import java.util.Iterator;
import java.util.Map;

import com.matrixone.apps.domain.DomainAccess;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;

import matrix.db.Context;
import matrix.util.StringList;

public class emxWorkspaceVaultMdlBase_mxJPO extends emxDomainObject_mxJPO {
    
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    public emxWorkspaceVaultMdlBase_mxJPO(Context context, String[] args) throws Exception {
        super(context, args);
    }
    
    /**
     * Changes ownership on bookmark
     * 
     * @param context context the eMatrix Context object
     * @param args holds bookmark id and ownership details
     * @return 0 if action is completed successfully
     * @throws Exception 
     * @since R2022x GA
     */
    public int changeOwnerAction(Context context, String[] args) throws Exception {
        try {
            String bookmarkObjectId = args[0];
            String kindOfOwner = args[1];
            String newOwner = args[2];
            
            // check if old owner is the same as the new owner, nothing to do
            // issue caused by Move where only changing CS also changes owner to same owner and context user does not have changesov after CS is changed - so change CS is blocked
            String oldOwner =  args[3];
            if (oldOwner!=null && oldOwner.equals(newOwner))
                return 0;
            
            if ("owner".equals(kindOfOwner)) {
                StringList accessNames = DomainAccess.getLogicalNames(context, bookmarkObjectId);
                String defaultAccess = accessNames.get(accessNames.size() - 1);
                DomainAccess.createObjectOwnership(context,
                                                   bookmarkObjectId,
                                                   PersonUtil.getPersonObjectID(context, newOwner),
                                                   defaultAccess,
                                                   DomainAccess.COMMENT_MULTIPLE_OWNERSHIP);
            }
            return 0;
        } catch (Exception e) {
            return 1;
        }
    }
    
    /**
     * Set the RPE variable with Count value by which increment or decrement is required
     * upon Sub Vaults Connection CREATE or DELETE.
     *
     * @param context the eMatrix Context object
     * @param args holds id of subBookmark object and event 
     * @return void
     * @throws Exception if the operation fails
     * @since R2022x GA
     * Updated in R2024x GA to send Count to be incremented/decremented.
     * @grade 0
     */
    public void updateCount(Context context, String[] args) throws FrameworkException {
        try {
            String fromObjectId = getObjectId(context);
            DomainObject subBookmark = new DomainObject(args[0]);
            String event = args[1];
            String SELECT_ATTRIBUTE_COUNT = getAttributeSelect(ATTRIBUTE_COUNT);
            String toCount = subBookmark.getInfo(context, SELECT_ATTRIBUTE_COUNT);
            String lastUpdatedCount = "0";
            if ("CREATE".equalsIgnoreCase(event)) {
                //Support Multiple MOVE : check if connect already happened on from object.
                lastUpdatedCount = PropertyUtil.getRPEValue(context, "BOOKMARK_INCREMENT_COUNT_" + fromObjectId, true);
                if (lastUpdatedCount !=null && !lastUpdatedCount.equals("")) {
                    toCount = String.valueOf(Integer.parseInt(toCount) + Integer.parseInt(lastUpdatedCount)); 
                }
                PropertyUtil.setRPEValue(context, "BOOKMARK_INCREMENT_COUNT_" + fromObjectId, toCount, true);
            } else {
                //Support Multiple MOVE. check if disconnect already happened on from object.
                lastUpdatedCount = PropertyUtil.getRPEValue(context, "BOOKMARK_DECREMENT_COUNT_" + fromObjectId, true);
                if (lastUpdatedCount !=null && !lastUpdatedCount.equals("")) {
                    toCount = String.valueOf(Integer.parseInt(toCount) + Integer.parseInt(lastUpdatedCount)); 
                }
                PropertyUtil.setRPEValue(context, "BOOKMARK_DECREMENT_COUNT_" + fromObjectId, toCount, true);
            }
        } catch(Exception ex) {
            throw new FrameworkException(ex);
        }
    }
    
    /**
     * Update the count attribute of bookmark when removing content from it.
     * 
     * @param context the eMatrix Context object
     * @param args history records of bookmark.
     * @since R2022x FD01
     */
    public void updateCountOnTransaction(Context context, String[] args) throws Exception {
        String transactionHistory = args[0];
        String[] transactionRecords = transactionHistory.split("\n");
        DomainObject bookmark = null;
        int count =0;
        for (String record : transactionRecords) {
            if (record.startsWith("id=")) {
                if (bookmark!=null) {
                    updateCount(context, bookmark, count);
                    count =0;
                }
                bookmark = new DomainObject(record.substring("id=".length()));
            } else {
                if (record.contains("disconnect Vaulted Objects to")) {
                    count--;
                } else if (record.contains("connect Vaulted Objects to")) {
                    count++;
                }
            }
        }
        updateCount(context, bookmark, count);
    }
    
    /**
     * Updates Count attribute of a bookmark
     * 
     * @param context the eMatrix Context object
     * @param bookmark the bookmark whose Count attribute is to be update
     * @param count the number by which bookmark Count attribute need to be updated.
     * @throws Exception if operation fails.
     */
    private void updateCount(Context context, DomainObject bookmark, int count) throws Exception {
        String SELECT_ATTRIBUTE_COUNT = getAttributeSelect(ATTRIBUTE_COUNT);
        try {
            //Update count attribute of given bookmark
            int updatedCount = Integer.parseInt(bookmark.getInfo(context, SELECT_ATTRIBUTE_COUNT)) + count;
            bookmark.setAttributeValue(context, ATTRIBUTE_COUNT, String.valueOf(updatedCount));
            
            //Now update the count of parent bookmarks
            StringList objectSelects = new StringList();
            objectSelects.add(SELECT_ID);
            objectSelects.add(SELECT_ATTRIBUTE_COUNT);
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
            Map<?,?> parentBookmarkInfo = null;
            DomainObject parentBookmarkObject = null;
            Iterator<?> iterator = parentBookmarksList.iterator();
            while (iterator.hasNext()) {
                parentBookmarkInfo = (Map<?,?>)iterator.next();
                parentBookmarkObject = new DomainObject((String)parentBookmarkInfo.get(SELECT_ID));
                updatedCount = Integer.parseInt((String)parentBookmarkInfo.get(SELECT_ATTRIBUTE_COUNT)) + count;
                parentBookmarkObject.setAttributeValue(context, ATTRIBUTE_COUNT, Integer.toString(updatedCount));
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
