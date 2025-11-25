
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import matrix.db.Context;
import matrix.util.StringList;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;

public class emxCommonObjectRouteTemplateMigrationBase_mxJPO extends emxCommonMigration_mxJPO
{

    private static final long serialVersionUID = -5029177381386073045L;    
    public static String RELATIONSHIP_OBJECTROUTE = "";
    public static String SEL_OBJECTROUTE_REL_IDS = "";
    public static String SEL_OBJECTROUTE_REL_TO_TYPE = "";
    public static String SEL_OBJECTROUTE_REL_ORIGINATED = "";
    public static String SEL_OBJECTROUTE_REL_TO_IDS = "";
       

    public emxCommonObjectRouteTemplateMigrationBase_mxJPO(Context context, String[] args) throws Exception {
      super(context, args);
    }

    public static void init(Context context) throws FrameworkException
    {
         RELATIONSHIP_OBJECTROUTE = PropertyUtil.getSchemaProperty(context, "relationship_ObjectRoute");
         SEL_OBJECTROUTE_REL_IDS = "from["+ RELATIONSHIP_OBJECTROUTE +"].id";
         SEL_OBJECTROUTE_REL_TO_TYPE = "from["+ RELATIONSHIP_OBJECTROUTE +"].to.type";
         SEL_OBJECTROUTE_REL_ORIGINATED = "from["+ RELATIONSHIP_OBJECTROUTE +"].originated";
         SEL_OBJECTROUTE_REL_TO_IDS = "from["+ RELATIONSHIP_OBJECTROUTE +"].to.id";
    }

    public void migrateObjects(Context context, StringList objectList) throws Exception
    {
        init(context);
        StringList objectSelects = new StringList(15);

        objectSelects.add(SEL_OBJECTROUTE_REL_IDS);
        objectSelects.add(SEL_OBJECTROUTE_REL_TO_TYPE);
        objectSelects.add(SEL_OBJECTROUTE_REL_ORIGINATED);
        objectSelects.add(SEL_OBJECTROUTE_REL_TO_IDS);
        objectSelects.add(DomainConstants.SELECT_ID);    
        objectSelects.add(DomainConstants.SELECT_TYPE);
        objectSelects.add(DomainConstants.SELECT_REVISION);
        objectSelects.add(DomainConstants.SELECT_NAME);
     
        String[] oidsArray = new String[objectList.size()];
        oidsArray = (String[])objectList.toArray(oidsArray);
        StringList mulValSelects= new StringList();
        mulValSelects.add(SEL_OBJECTROUTE_REL_IDS);
        mulValSelects.add(SEL_OBJECTROUTE_REL_TO_TYPE);
        mulValSelects.add(SEL_OBJECTROUTE_REL_ORIGINATED);
        mulValSelects.add(SEL_OBJECTROUTE_REL_TO_IDS);
        
		mqlLogRequiredInformationWriter("getInfo ...................."); 
		
        MapList mapList = DomainObject.getInfo(context, oidsArray, objectSelects, mulValSelects);
        try{
        	ContextUtil.pushContext(context);
        	Iterator itr = mapList.iterator();
        	String strType="";
    		String strName="";
    		String strRevision="";
    		String strObjId ="";
    		String strTemplateId = "";
        	while( itr.hasNext())
        	{
        		try {
        			List<String> allObjectRouteRelId = new ArrayList<String>();
                	List<String> storeConnectionIds = new ArrayList<String>();
                	List<String> discardConnectionIds = new ArrayList<String>();
                	List<String> allRevisedTemplatedId = new ArrayList<String>();
                	List<String> storeRevisedTemplateIds = new ArrayList<String>();
                	List<String> discardRevisedTemplateIds = new ArrayList<String>();
        			Map valueMap = (Map) itr.next();
        			MapList originatedAndRouteObjectIdMapList = new MapList();
        			strType = (String)valueMap.get(DomainConstants.SELECT_TYPE);
        			strName = (String)valueMap.get(DomainConstants.SELECT_NAME);
        			strRevision = (String)valueMap.get(DomainConstants.SELECT_REVISION);
        			strObjId = (String)valueMap.get(DomainConstants.SELECT_ID);
        			StringList objectRouteRelIds = (StringList)valueMap.get(SEL_OBJECTROUTE_REL_IDS);
        			StringList objectRouteConnectedTypes = (StringList)valueMap.get(SEL_OBJECTROUTE_REL_TO_TYPE);
        			StringList objectRouteRelOriginatedList = (StringList)valueMap.get(SEL_OBJECTROUTE_REL_ORIGINATED);
        			StringList objectRouteToTemplateIds = (StringList)valueMap.get(SEL_OBJECTROUTE_REL_TO_IDS);
        			
        			Map<String,String> originatedAndRouteObjectIdMapping =  new TreeMap<>();
        			Map<String,String> originatedAndTemplateIdMapping =  new TreeMap<>();
        			// Keep Template Objects and remove route objects
        			if(objectRouteRelIds != null && objectRouteRelIds.size() > 2) {
        				for(int i=0; i<objectRouteRelIds.size(); i++) {
            				if("Route Template".equalsIgnoreCase((String)objectRouteConnectedTypes.get(i))) {
            					String originated = (String)objectRouteRelOriginatedList.get(i);
            					String templateId = (String)objectRouteToTemplateIds.get(i);
            					String objectRouteId = (String)objectRouteConnectedTypes.get(i);
            					HashMap<String,String> originatedAndObjectRouteMap = new HashMap<>();
            					originatedAndObjectRouteMap.put("date", originated);
            					originatedAndRouteObjectIdMapList.add(originatedAndObjectRouteMap);
            					originatedAndRouteObjectIdMapping.put(originated,objectRouteId);
            					originatedAndTemplateIdMapping.put(originated,templateId);
            					if(!allObjectRouteRelId.contains(objectRouteId)) {
            						allObjectRouteRelId.add(objectRouteId);
            					}
            					if(!allRevisedTemplatedId.contains(templateId)) {
            						allRevisedTemplatedId.add(templateId);
            					}
            				}
            			} 
            			// Get the first Template connect to change objects based on originated date on relationship object
        				if(allObjectRouteRelId.size()>1) {
        					mqlLogRequiredInformationWriter("migrating object for id "+strObjId);
        					if(originatedAndRouteObjectIdMapList.size()>0) {
                				originatedAndRouteObjectIdMapList.sort("date", "ascending", "date");
                    			String firstDate = (String)((HashMap)originatedAndRouteObjectIdMapList.get(0)).get("date");
                    			String firstRouteObjectId = (String)originatedAndRouteObjectIdMapping.get(firstDate);
                    			String firstTemplateId = (String)originatedAndTemplateIdMapping.get(firstDate);
                    			storeConnectionIds.add(firstRouteObjectId);
                    			storeRevisedTemplateIds.add(firstTemplateId);
                			}
                			for(int i = 0; i< allObjectRouteRelId.size(); i++) {
                        		if(!storeConnectionIds.contains(allObjectRouteRelId.get(i))){
                        			discardConnectionIds.add(allObjectRouteRelId.get(i));
                        		}
                        	}
                			for(int i = 0; i< allRevisedTemplatedId.size(); i++) {
                        		if(!storeRevisedTemplateIds.contains(allRevisedTemplatedId.get(i))){
                        			discardRevisedTemplateIds.add(allRevisedTemplatedId.get(i));
                        		}
                        	}
                			DomainRelationship.disconnect(context, discardConnectionIds.toArray(new String[0]));
                			checkAndloadMigratedOids(strObjId);
                			mqlLogRequiredInformationWriter(" Migration is completed for id "+strObjId+" and the disconnected template ids are "+discardRevisedTemplateIds);
        				}
        			}
	            } catch (Exception ex) {
	            	mqlLogRequiredInformationWriter("Failed to disconnected revised template ");
	            	checkAndWriteUnconvertedOID(strType+","+strName+","+strRevision+"Unsuccessfull migration ids",strObjId);
	            }
	        }
        	
        } catch(Exception ex){        
        }finally{
        	ContextUtil.popContext(context);
        }
    }
    
    
    public void mqlLogRequiredInformationWriter(String command) throws Exception
    {
        super.mqlLogRequiredInformationWriter(command +"\n");
    }
    public void checkAndWriteUnconvertedOID(String command, String ObjectId) throws Exception
    {
     if(migratedOids.indexOf(ObjectId)<= -1){
        super.writeUnconvertedOID(command, ObjectId);
     }
        
    }
    public void checkAndloadMigratedOids(String command) throws Exception
    {
     if(migratedOids.indexOf(command)<= -1){
        super.loadMigratedOids(command +"\n");
     }
        
    }
}
