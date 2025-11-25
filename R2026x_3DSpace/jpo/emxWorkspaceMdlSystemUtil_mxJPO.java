import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.dassault_systemes.enovia.workspace.modeler.Workspace;
import com.dassault_systemes.enovia.workspace.modeler.WorkspaceMdlUtil;
import com.dassault_systemes.enovia.workspace.modeler.WorkspaceVault;
import com.matrixone.apps.common.SubscriptionManager;
import com.matrixone.apps.domain.DomainAccess;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.StringUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

public class emxWorkspaceMdlSystemUtil_mxJPO extends emxDomainObject_mxJPO {
    
    private final String SELECT_ATTRIBUTE_COUNT = getAttributeSelect(ATTRIBUTE_COUNT);
    private static ExecutorService executor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors()/2);
    
    private static final String DISCONNECTED_HISTORY_RECORD = "disconnect Vaulted Objects to";
    private static final String CONNECTED_HISTORY_RECORD = "connect Vaulted Objects to";
    
    //to ensure data retrieved from RPE variable only once 
    //private int _contentCount =0;
    
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    public emxWorkspaceMdlSystemUtil_mxJPO(Context context, String[] args) throws Exception {
        super(context, args);
    }
    
    /**
     * Update the count attribute of bookmark for different use cases as required.
     * 
     * @param context the eMatrix Context object
     * @param args history records of bookmark.
     * @since R2022x FD01
     *        R2022x FD04 The algorithm to update Count is changed to improve efficiency.
     *        R2024x GA   The algorithm to update Count is further changed to incorporate
     *                    Bookmark DELETE and MOVE use cases. With this change CREATE/DELETE
     *                    Action trigger on Sub Vaults relationship will send value of count
     *                    by which the value of Count attribute will be updated for bookmarks.
     * @exception Exception if operation fails.
     */
    public void updateCountOnTransaction(Context context, String[] args) throws Exception {
        String transactionHistory = args[0];
        //System.out.println("BOOKMARK UPDATE COUNT :\n" + transactionHistory);
        String[] transactionRecords = transactionHistory.split("\n");
        
        //Cache to be used to keep track of content count
        Map<String, Integer> contentCountCache = new HashMap<>();
        
        //Data Structure used to hold bookmarkIds and their Mapping with corresponding operation.
        Set<String> disconnectOpBookmarks = new HashSet<>();
        Set<String> connectOpBookmarks = new HashSet<>();
        Map<String, Object> bookmarkOperationMap = new HashMap<>();
        
        String bookmarkId = null;
        int count =0;
        
        /*
         * Load :
         * - Cache with all the bookmarks (ID) involved in transaction with the number of content added/removed.
         *      OR
         * - Map with bookmark operation with the bookmarkIds on which operation performed.
         */
        for (String record : transactionRecords) {
            if (record.startsWith("id=")) {
                if (bookmarkId!=null && count!=0) {
                    contentCountCache.put(bookmarkId, count);
                    count=0;
                }
                bookmarkId = record.substring("id=".length());
            } else {
                //Update Count when Content is involved in Transaction.
                if (record.contains("disconnect Vaulted Objects to")) {
                    count--;
                } else if (record.contains("connect Vaulted Objects to")) {
                    count++;
                }
                
                //Below conditions is to update Count when subBookmark is DELETED or MOVED.
                
                /*
                 * Either subBookmark is DELETED OR MOVED from Source (Bookmark is disconnected).
                 * Both Use Cases needs to be covered. 
                 */
                else if (record.contains("disconnect Sub Vaults to")) {
                    disconnectOpBookmarks.add(bookmarkId);
                    bookmarkOperationMap.put( "D", disconnectOpBookmarks);
                }
                
                /*
                 * Either subBookmark is CREATED OR MOVED to Destination (bookmark is connected).
                 * MOVE needs to be covered.
                 */
                else if (record.contains("connect Sub Vaults to") && !record.contains("history added to identify actual user")) {
                    connectOpBookmarks.add(bookmarkId);
                    bookmarkOperationMap.put("C", connectOpBookmarks);
                }
            }
        }
        
        if (count!=0) {
            contentCountCache.put(bookmarkId, count);
        }
        
        /*
         * Update Count attribute when content is involved in transaction.
         */
        if (!contentCountCache.isEmpty()) {
            updateContentCount(context, contentCountCache);
        }
        /*
         * Update Count if operation Map is not empty. It can have
         * - DISCONNECT subBookmark "D"
         * - CONNECT subBookmark "C"
         * - OR Both
         */
        else if (!bookmarkOperationMap.isEmpty()) {
            updateCountOnBookmarkOperation(context, bookmarkOperationMap);
        }
    }
    
    /**
     * Update Count attribute when content is directly involved in a transaction
     * 
     * @param context the eMatrix Context object.
     * @param contentCountCache Map containing Count against a given bookmarkId.
     * @throws Exception if operation fails.
     * @since R2024x GA to make updateCountOnTransaction() method look clean.
     */
    private void updateContentCount(Context context, Map<String, Integer> contentCountCache) throws Exception {
        Set<String> bookmarkIdSet = contentCountCache.keySet();
        String[] objectIds = bookmarkIdSet.toArray(new String[bookmarkIdSet.size()]);
        
        //objectSelects required to get the existing Count values
        StringList objectSelects = new StringList();
        objectSelects.add(SELECT_ID);
        objectSelects.add(SELECT_ATTRIBUTE_COUNT);
        
        //Single DB call to retrieve existing value of Count attribute for all bookmarks involved in transaction
        MapList bookmarkContentCount = DomainObject.getInfo(context, objectIds, objectSelects);
        
        //A temporary cache is required to retrieve the Number of content objects added/removed to bookmarks [COPY scenario]
        Map<String, Integer> tempCache = new HashMap<>(contentCountCache);
        
        //Update Cache with all the bookmarks in the hierarchy
        int count =0;
        String bookmarkId = null;
        for (int i=0;i<bookmarkContentCount.size();i++) {
            Map<?,?> bookmarkMap = (Map<?,?>)bookmarkContentCount.get(i);
            bookmarkId = (String)bookmarkMap.get(SELECT_ID);
            //Update bookmarks in Cache with 'existing count value' + 'number of content objects added/removed in given transaction'
            contentCountCache.put(bookmarkId,  contentCountCache.get(bookmarkId) +
                                               Integer.parseInt((String)bookmarkMap.get(SELECT_ATTRIBUTE_COUNT)));
            
            DomainObject bookmark = new DomainObject(bookmarkId);
            MapList parentBookmarksList = bookmark.getRelatedObjects(context,
                                                                     RELATIONSHIP_SUB_VAULTS,
                                                                     TYPE_WORKSPACE_VAULT,
                                                                     objectSelects,
                                                                     null,
                                                                     true,
                                                                     false,
                                                                     (short)0,
                                                                     null,
                                                                     null,
                                                                     0, null, null, null);
            String parentBookmarkId =null;
            count = tempCache.get(bookmarkId);
            for (int j=0;j<parentBookmarksList.size();j++) {
                Map<?,?> parentBookmarkMap = (Map<?,?>)parentBookmarksList.get(j);
                parentBookmarkId = (String)parentBookmarkMap.get(SELECT_ID);
                if (contentCountCache.containsKey(parentBookmarkId)) {
                    contentCountCache.put(parentBookmarkId, contentCountCache.get(parentBookmarkId) + count);
                } else {
                    contentCountCache.put(parentBookmarkId, Integer.parseInt((String)parentBookmarkMap.get(SELECT_ATTRIBUTE_COUNT)) + count);
                }
            }
        }
        
        //Update Count of all bookmarks from the Cache
        bookmarkIdSet = contentCountCache.keySet();
        DomainObject bookmark = null;
        for (String id : bookmarkIdSet) {
            bookmark = new DomainObject(id);
            count = contentCountCache.get(id);
            bookmark.setAttributeValue(context, ATTRIBUTE_COUNT, String.valueOf(count));
        }
    }
    
    /**
     * Update Count attribute when bookmark is MOVED or DELETED.
     * 
     * @param context the eMatrix Context object
     * @param bookmarkOperationMap Map contains bookmark connect/disconnect operations
     *                             mapped to the bookmark id on which operation happened
     *                             Below are the Keys:
     *                              C  : Sub Vaults connect happens
     *                              D  : Sub Vaults disconnect happens
     * @throws Exception if operation fails
     * @since 2024x GA, to update Count in transaction trigger when Bookmak is DELETED or MOVED
     * SuppressWarnings is added as it is guaranteed that Set<String> will be returned.
     */
    @SuppressWarnings("unchecked")
    private void updateCountOnBookmarkOperation(Context context, Map<String, Object> bookmarkOperationMap) throws Exception {
        //variables required
        DomainObject bookmark = new DomainObject();
        Map<?,?> map = null;
        Set<String> operatingBookmarkIds = null;
        MapList parentBookmarksList = null;
        
        //Map used to store Count of all required bookmarks
        Map<String, Integer> bookmarkCountUpdate = new HashMap<>();
        
        //objectSelects required to get the existing Count values
        StringList objectSelects = new StringList();
        objectSelects.add(SELECT_ID);
        objectSelects.add(SELECT_ATTRIBUTE_COUNT);
        
        /*
         * Step 1 : Get existing Count value of Source bookmark (from which subBookmark is disconnected)
         *          and its parent bookmark and put them in Map with updated value of Count.
         */
        int existingCount = 0;
        int countChangedBy =0;
        String resetBookmarkId = null;
        if (bookmarkOperationMap.containsKey("D")) {
            operatingBookmarkIds = (Set<String>)bookmarkOperationMap.get("D");
            for (String bookmarkId : operatingBookmarkIds) {
                bookmark.setId(bookmarkId);
                existingCount = Integer.parseInt(bookmark.getInfo(context, SELECT_ATTRIBUTE_COUNT));
                countChangedBy = Integer.parseInt(PropertyUtil.getRPEValue(context, "BOOKMARK_DECREMENT_COUNT_" + bookmarkId, true));
                bookmarkCountUpdate.put(bookmarkId, existingCount - countChangedBy);
                resetBookmarkId = bookmarkId;
                
                parentBookmarksList = bookmark.getRelatedObjects(context,
                                                                 RELATIONSHIP_SUB_VAULTS,
                                                                 TYPE_WORKSPACE_VAULT,
                                                                 objectSelects,
                                                                 null,
                                                                 true,
                                                                 false,
                                                                 (short)0,
                                                                 null,
                                                                 null,
                                                                 0, null, null, null);
                for (int i=0; i<parentBookmarksList.size(); i++) {
                    map = (Map<?,?>)parentBookmarksList.get(i);
                    bookmarkId = (String)map.get(SELECT_ID);
                    existingCount = Integer.parseInt((String)map.get(SELECT_ATTRIBUTE_COUNT));
                    if (bookmarkCountUpdate.containsKey(bookmarkId)) {
                        bookmarkCountUpdate.put(bookmarkId, bookmarkCountUpdate.get(bookmarkId) - countChangedBy);
                    } else {
                        bookmarkCountUpdate.put(bookmarkId, existingCount - countChangedBy);
                    }
                }
                PropertyUtil.unsetRPEValue(context, "BOOKMARK_DECREMENT_COUNT_" + resetBookmarkId, true);
            }
        }
        
        /*
         * Step 2 : Get existing Count value of Destination bookmark (on which subBookmark is connected)
         *          and its parent bookmark and put them in Map with updated value of Count.
         */
        if (bookmarkOperationMap.containsKey("C")) {
            operatingBookmarkIds = (Set<String>)bookmarkOperationMap.get("C");
            for (String bookmarkId : operatingBookmarkIds) {
                bookmark.setId(bookmarkId);
                existingCount = Integer.parseInt(bookmark.getInfo(context, SELECT_ATTRIBUTE_COUNT));
                countChangedBy = Integer.parseInt(PropertyUtil.getRPEValue(context, "BOOKMARK_INCREMENT_COUNT_" + bookmarkId, true));
                bookmarkCountUpdate.put(bookmarkId, existingCount + countChangedBy);
                resetBookmarkId = bookmarkId;
                
                parentBookmarksList = bookmark.getRelatedObjects(context,
                                                                 RELATIONSHIP_SUB_VAULTS,
                                                                 TYPE_WORKSPACE_VAULT,
                                                                 objectSelects,
                                                                 null,
                                                                 true,
                                                                 false,
                                                                 (short)0,
                                                                 null,
                                                                 null,
                                                                 0, null, null, null);
                for (int i=0; i<parentBookmarksList.size(); i++) {
                    map = (Map<?,?>)parentBookmarksList.get(i);
                    bookmarkId = (String)map.get(SELECT_ID);
                    existingCount = Integer.parseInt((String)map.get(SELECT_ATTRIBUTE_COUNT));
                    if (bookmarkCountUpdate.containsKey(bookmarkId)) {
                        bookmarkCountUpdate.put(bookmarkId, bookmarkCountUpdate.get(bookmarkId) + countChangedBy);
                    } else {
                        bookmarkCountUpdate.put(bookmarkId, existingCount + countChangedBy);
                    }
                }
                PropertyUtil.unsetRPEValue(context, "BOOKMARK_INCREMENT_COUNT_" + resetBookmarkId, true);
            }
        }
        
        /*
         * Step 3 : Update Count of all required bookmarks.
         */
        Set<String> bookmarkIdSet = bookmarkCountUpdate.keySet();
        for (String bookmarkId : bookmarkIdSet) {
            bookmark.setId(bookmarkId);
            countChangedBy = bookmarkCountUpdate.get(bookmarkId);
            bookmark.setAttributeValue(context, ATTRIBUTE_COUNT, String.valueOf(countChangedBy));
        }
    }
    
    /**
     * Publishes message when content is attached to/detached from bookmark
     * 
     * @param context the eMatrix Context object
     * @param args contains history records of objects in current transaction.
     * @since  R2023x FD02
     * Updated R2025x FD01:
     *   To improve the performance of transaction trigger we changed the
     *   entire algorithm for preparing and sending events for
     *   connected/disconnected events.
     * Updated R2026x MAJOR:
     *   Using Java Fixed Thread Pool and frameContext to send events.
     */
    public void sendAttachDetachEventMessage(Context context, String[] args) {
        /*
         * Step 1 : Retrieve transaction history and check if connected or disconnected event
         *          actually happened. 
         */
        String transactionHistory = args[0];
        //System.out.println("BOOKMARK RAISE EVENTS :\n" + transactionHistory);
        String[] transactionRecords = transactionHistory.split("\n");     // Can we replace it with BufferedReader for more efficiency? Only do if we are sure there will be large number of history records.
        
        if (isEventRequired(transactionRecords)) {
            /*
             * Step 2 : Map bookmark id with corresponding history records.
             */
            boolean isConnectedEvent = false;
            boolean isDisconnectedEvent = false;
            WorkspaceMdlUtil workspaceMdl = WorkspaceMdlUtil.newInstance();
            try {
                String bookmarkId = null;
                Map<String, List<String>> bookmarkToHistoryMap = new LinkedHashMap<>();
                List<String> historyRecords = new LinkedList<>();
                for (String record : transactionRecords) {
                    if (record.startsWith("id=")) {
                        if (!historyRecords.isEmpty()) {
                            bookmarkToHistoryMap.put(bookmarkId, historyRecords);
                            historyRecords = new LinkedList<>();
                        }
                        
                        bookmarkId = record.substring("id=".length());
                    } else {
                        // content disconnect event
                        if (record.contains(DISCONNECTED_HISTORY_RECORD)) {
                            historyRecords.add(record);
                            isDisconnectedEvent = true;
                        } else if (record.contains(CONNECTED_HISTORY_RECORD)) { // content connect event
                            historyRecords.add(record);
                            isConnectedEvent = true;
                        }
                    }
                }
                
                // Put event related history records to the map for last bookmark in the transaction history.
                if (bookmarkId!=null && !historyRecords.isEmpty()) {
                    bookmarkToHistoryMap.put(bookmarkId, historyRecords);
                }
                
                // Send events
                //workspaceMdl.sendEventMessage(context, bookmarkToHistoryMap);
                
                
                /*
                 * Step 3 : Create frame context and copy over RPE values from original context to
                 *          the frame context.
                 * 
                 * We are creating frame context in order to avoid blocking Worker Thread from sending event.
                 * This has one issue i.e. we are loosing RPE variables as the clone context is in
                 * separate Matrix session and RPE variables persists within a session.
                 */
                Context newIndependentContext = context.getFrameContext("sendAttachDetachEventMessage");
                copyRPEValues(context, newIndependentContext, isDisconnectedEvent, isConnectedEvent);
                
                
                /*
                 * Step 4 : Submit the task of sending events to Executor service.
                 * 
                 * Once you submit this task the background thread will take care of it.
                 * The Transaction trigger will finish its execution and the events will be sent in background.
                 */
                executor.submit(() -> workspaceMdl.sendEventMessage(newIndependentContext, bookmarkToHistoryMap));
            } catch (Exception e) {
                System.out.println("Error publishing events " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
    
    /**
     * Checks if connected/disconnected event actually happens.
     * 
     * @param transactionRecords array of string containing each history record in a given transaction
     * @return true if event is required
     * @since R2026x MAJOR
     */
    private boolean isEventRequired(String[] transactionRecords) {
        for (String record : transactionRecords) {
            if (record.contains(DISCONNECTED_HISTORY_RECORD) || record.contains(CONNECTED_HISTORY_RECORD)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Copy RPE values from original to frame context.
     * 
     * @param context the eMatrix Context object
     * @param newIndependentContext context created using frameContext API
     * @param isDisconnectedEvent true if a disconnected event is found
     * @param isConnectedEvent true if a connected event is found
     * @throws FrameworkException if copy RPE fails.
     * @since R2026x MAJOR
     */
    private void copyRPEValues(Context context, Context newIndependentContext, boolean isDisconnectedEvent, boolean isConnectedEvent) throws FrameworkException {
        // Copy if disconnected event happened
        if (isDisconnectedEvent) {
            copyRPEValue(context, newIndependentContext, "ENO_BOOKMARK_REMOVE_CONTENT");
        }
        
        // Copy if connected event happened
        if (isConnectedEvent) {
            String rpeValue = PropertyUtil.getRPEValue(context, "ENO_BOOKMARK_ROOT_COPY_CONTENT", true);
            if (rpeValue!=null && !rpeValue.isEmpty()) {
                copyRPEValue(context, newIndependentContext, "ENO_BOOKMARK_ROOT_COPY_CONTENT");
            } else {
                copyRPEValue(context, newIndependentContext, "ENO_BOOKMARK_ADD_CONTENT");
            }
        }
    }
    
    /**
     * Copy RPE value from original context to frame context
     * @param context the eMatrix Context object
     * @param newIndependentContext the frame context object
     * @param rpeKey RPE key whose value will be copied
     * @throws FrameworkException if any operation RPE variable fails.
     * @since R2026x MAJOR
     */
    private void copyRPEValue(Context context, Context newIndependentContext, String rpeKey) throws FrameworkException {
        // Retrieve value from original context
        String rpeValue = PropertyUtil.getRPEValue(context, rpeKey, true);
        
        // Set RPE value on frame context
        PropertyUtil.setRPEValue(newIndependentContext, rpeKey, rpeValue, true);
        
        // Clear value from original RPE variable
        PropertyUtil.unsetRPEValue(context, rpeKey, true);
    }
    
    /*
     * Publishes message when content is attached to/detached from bookmark
     * 
     * @param context the eMatrix Context object
     * @param args contains history records of objects in current transaction.
     * @since R2023x FD02
     *
    public void sendAttachDetachEventMessage(Context context, String[] args) {
        String transactionHistory = args[0];
        //System.out.println("BOOKMARK RAISE EVENTS :\n" + transactionHistory);
        String[] transactionRecords = transactionHistory.split("\n");
        
        // Check if connect/disconnect event actually happens
        boolean isEventRequired = false;
        for (String record : transactionRecords) {
            if (record.contains("disconnect Vaulted Objects to") || record.contains("connect Vaulted Objects to")) {
                isEventRequired = true;
                break;
            }
        }
        
        if (isEventRequired) {
            WorkspaceMdlUtil workspaceMdl = WorkspaceMdlUtil.newInstance();
            try {
                //object selectAbles
                StringList objectSelects = new StringList();
                objectSelects.add(SELECT_NAME);
                objectSelects.add(SELECT_TYPE);
                objectSelects.add(SELECT_PHYSICAL_ID);
                objectSelects.add("type.property[PublicResourceURI].value");
                
                //relationship selectAbles
                StringList relationshipSelects = new StringList();
                relationshipSelects.add("from.type");
                relationshipSelects.add("from.physicalid");
                
                MapList bookmarkContent = null;
                String bookmarkId = null;
                DomainObject bookmark = new DomainObject();
                for (String record : transactionRecords) {
                    if (record.startsWith("id=")) {
                        bookmarkId = record.substring("id=".length());
                        
                        //Get details from this object
                        bookmark.setId(bookmarkId);
                        
                        //Get all the details in one DB call
                        bookmarkContent = bookmark.getRelatedObjects(context,
                                                                     RELATIONSHIP_VAULTED_OBJECTS,
                                                                     QUERY_WILDCARD,
                                                                     objectSelects,
                                                                     relationshipSelects,
                                                                     false,
                                                                     true,
                                                                     (short) 1,
                                                                     null,
                                                                     null,
                                                                     0,
                                                                     null,
                                                                     null,
                                                                     null);
                        
                        _contentCount = bookmarkContent.size();
                    } else {
                        if (record.contains("disconnect Vaulted Objects to")) {  //detach event occurred
                            workspaceMdl.sendEventMessage(context, bookmarkContent, record, "detach", _contentCount);
                        } else if (record.contains("connect Vaulted Objects to")) {  //attach event occurred
                            workspaceMdl.sendEventMessage(context, bookmarkContent, record, "attach", _contentCount);
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("Error publishing events " + e.getMessage());
                e.printStackTrace();
            } finally {
                workspaceMdl.closeProducer();
            }
        }
    }
    */
    
    /**
     * Add ownership of new Workspace Member.
     * 
     * @param context the eMatrix Context object
     * @param args holds id of Workspace Member object
     * @return void
     * @throws Exception if the operation fails
     * @since R2025x FD02
     */
    public void connectMember(Context context, String[] args) throws FrameworkException {
        try {
            String workspaceId = args[0];
            String project = args[1];
            String result = MqlUtil.mqlCommand(context, "list role $1 select $2 $3 dump $4", true, project, "person", "parent", "|");
            StringList resultList = StringUtil.split(result, "|");
            String personId = "";
            if (resultList.size() == 2 && "User Projects".equals(resultList.get(1))) {
                personId = PersonUtil.getPersonObjectID(context, (String)resultList.get(0));
                if (personId != null) {
                    String memberSelects = "from[" + RELATIONSHIP_WORKSPACE_MEMBER + "|to.id==" + personId + "].id";
                    String relId = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", true, workspaceId, memberSelects);
                    
                    if (relId == null || relId.isEmpty()) {
                        DomainRelationship.connect(context, workspaceId, RELATIONSHIP_WORKSPACE_MEMBER, personId, true);
                    }
                }
            }
            
            String rpe = PropertyUtil.getGlobalRPEValue(context, "RPE_MEMBER_ADDED_REMOVED");
            if ("true".equalsIgnoreCase(rpe)) {
                Workspace workspace = new Workspace(workspaceId);
                SubscriptionManager subscriptionMgr = workspace.getSubscriptionManager();
                subscriptionMgr.publishEvent(context, Workspace.EVENT_MEMBER_ADDED, personId);
            }
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage().replaceAll("java.lang.Exception:", "");
            throw new FrameworkException(msg);
        }
    }
    
    /**
     * Removes ownership of a given Workspace Member
     * 
     * @param context context the eMatrix Context object
     * @param args holds Bookmark Root id and ownership details of a Workspace Member
     * @throws Exception if the operation fails
     * @since R2025x FD02
     */
    public void disconnectMember(Context context, String[] args) throws FrameworkException {
        try {
            String workspaceId = args[0];
            String project = args[1];
            String organization = args[2];
            String comment = args[3];
            String personId = "";
            String result = MqlUtil.mqlCommand(context, "list role $1 select $2 $3 dump $4", true, project, "person", "parent", "|");
            StringList resultList = StringUtil.split(result, "|");
            if (resultList.size() == 2 && "User Projects".equals(resultList.get(1))) {
                String personName = (String)resultList.get(0);
                personId = PersonUtil.getPersonObjectID(context, personName);
                project = personName + "_PRJ";
                organization = null;
                if (personId != null) {
                    String memberSelects = "from[" + RELATIONSHIP_WORKSPACE_MEMBER + "|to.id==" + personId + "].id";
                    String relId = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", true, workspaceId, memberSelects);
                    if ( relId != null && !relId.isEmpty()) {
                        DomainRelationship.disconnect(context, relId);
                    }
                }
            }
            
            String rpe = PropertyUtil.getGlobalRPEValue(context, "RPE_MEMBER_ADDED_REMOVED");
            if ("true".equalsIgnoreCase(rpe)) {
                Workspace workspace = new Workspace(workspaceId);
                SubscriptionManager subscriptionMgr = workspace.getSubscriptionManager();
                subscriptionMgr.publishEvent(context, Workspace.EVENT_MEMBER_REMOVED, personId);
                StringList objectSelects = new StringList();
                objectSelects.add(SELECT_ID);
                ContextUtil.pushContext(context, null, null, null);
                MapList bookmarks = WorkspaceVault.getWorkspaceVaults(context, workspace, objectSelects, 0);
                Iterator<?> itr = bookmarks.iterator();
                while (itr.hasNext()) {
                    Map<?, ?> bookmarkMap = (Map<?, ?>)itr.next();
                    String bookmarkId = (String)bookmarkMap.get(SELECT_ID);
                    DomainAccess.deleteObjectOwnership(context, bookmarkId, organization, project, comment);
                }
                ContextUtil.popContext(context);
            }
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage().replaceAll("java.lang.Exception:", "");
            throw new FrameworkException(msg);
        }
    }
    
    /**
     * API to create a list of links.
     * Here links will be created by actual user with 'User Agent' access.
     * 
     * @param context context the eMatrix Context object
     * @param args array of String holding input arguments in Serialized form
     * @return StringList containing IDs of links created
     * @since  R2025x FD02
     * Updated R2026x GA to return a StringList 
     * @throws Exception if creating links failed
     */
    @SuppressWarnings("unchecked")
    public StringList createLinks(Context context, String[] args) throws Exception {
        Map<String, Object> mJPOInputArgsMap = (Map<String, Object>)JPO.unpackArgs(args);
        MapList linkInfoList = (MapList)mJPOInputArgsMap.get("cslInfoList");
        String ownerId = (String)mJPOInputArgsMap.get("ownerId");
        Map<?, ?> linkInfo = null;
        String command = "add link $1 owner bus $2 uri '$3' service '$4' appdata '$5' select '$6' dump";
        StringList createdLinksIdList = new StringList();
        for (int i=0; i<linkInfoList.size(); i++) {
            linkInfo = (Map<?,?>) linkInfoList.get(i);
            String uri = (String)linkInfo.get("uri");
            String serviceName = (String)linkInfo.get("service");
            String appData = (String)linkInfo.get("appdata");
            String linkId = MqlUtil.mqlCommand(context, command, false, WorkspaceVault.LINKTYPE_VAULTEDOBJECTSLINK, ownerId, uri, serviceName, appData, SELECT_ID);
            
            createdLinksIdList.add(linkId);
        }
        return createdLinksIdList;
    }
    
    /**
     * API to delete a list of links.
     * Here links will be deleted by actual user with 'User Agent' access.
     * 
     * @param context context the eMatrix Context object
     * @param args array of String holding input arguments in Serialized form
     * @since R2025x FD02
     * @throws Exception if deleting links failed
     */
    public void deleteLinks(Context context, String[] args) throws Exception {
        StringList linkIds = (StringList)JPO.unpackArgs(args);
        String command = "delete link $1";
        for (String linkId : linkIds) {
            MqlUtil.mqlCommand(context, command, false, linkId);
        }
    }
    
    /**
     * API to update a link.
     * Here link will be modified by actual user with 'User Agent' access.
     * 
     * @param context context the eMatrix Context object
     * @param args array of String holding input arguments in Serialized form
     * @since R2025x FD02
     * @throws Exception if modifying a link failed
     */
    @SuppressWarnings("unchecked")
    public void modifyLinks(Context context, String[] args) throws Exception {
        Map<String, Object> mJPOInputArgsMap = (Map<String, Object>)JPO.unpackArgs(args);
        String command = (String)mJPOInputArgsMap.get("command");
        String[] updateAttributes = (String[])mJPOInputArgsMap.get("updateAttributes");
        MqlUtil.mqlCommand(context, command, false, updateAttributes);
    }
}
