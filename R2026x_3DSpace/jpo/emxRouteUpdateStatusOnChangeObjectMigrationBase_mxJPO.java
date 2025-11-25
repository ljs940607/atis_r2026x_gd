
import java.util.Iterator;
import matrix.db.Context;
import matrix.db.MQLCommand;
import matrix.db.Policy;
import matrix.util.StringList;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.framework.ui.UIUtil;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Comparator;

public class emxRouteUpdateStatusOnChangeObjectMigrationBase_mxJPO extends emxCommonMigration_mxJPO
{

    private static final long serialVersionUID = -5029177381386073045L;
 
    public emxRouteUpdateStatusOnChangeObjectMigrationBase_mxJPO(Context context, String[] args) throws Exception {
      super(context, args);
    }

    public static void init(Context context) throws FrameworkException
    {
    	          
    }

	public void migrateObjects(Context context, StringList objectList) throws Exception
	{     
		init(context);
		try {
			ContextUtil.pushContext(context);
			for(int i =0; i<objectList.size();i++) {
				String changeObjId = objectList.get(i);
				try {
					MapList mapList = getMigrationNeededRoutesOnChangeObject(context,changeObjId);
					if(mapList != null && !mapList.isEmpty() && mapList.size() > 1) {

						boolean isAnyRouteMigrated = false;
						for(int j = 0; j<mapList.size(); j++) {
							Map<String, String> routeObjInfo= (Map) mapList.get(j);
							String currentState = (String)routeObjInfo.get(SELECT_CURRENT);
							String routeStatus = (String)routeObjInfo.get("attribute[Route Status]"); 
							String routeId = (String)routeObjInfo.get(SELECT_ID);
							String routeName = (String)routeObjInfo.get(SELECT_NAME);

							if("Complete".equals(currentState) && "Stopped".equals(routeStatus)) {
								isAnyRouteMigrated = true;
								DomainObject dmoObject = new DomainObject(routeId);
								dmoObject.setAttributeValue(context, DomainObject.ATTRIBUTE_ROUTE_STATUS, "Finished");
							}
						}
						
						if(isAnyRouteMigrated) {
							int lastElemIndex = mapList.size()-1;
							Map routeObjInfo= (Map) mapList.get(lastElemIndex);
							String routeStatus = (String)routeObjInfo.get("attribute[Route Status]"); 
							if("Finished".equals(routeStatus)) {
								String routeId = (String)routeObjInfo.get(SELECT_ID);
								String routeName = (String)routeObjInfo.get(SELECT_NAME);
								String routeDesc = (String)routeObjInfo.get(SELECT_DESCRIPTION);
								DomainObject dmoObject = new DomainObject(routeId);
								dmoObject.setDescription(context, routeDesc+" ");
							}
						}

					}
				}catch(Exception ex){     
					checkAndWriteUnconvertedOID( "Related Route Objects are not migrated for Change Object "+changeObjId, changeObjId); 
					mqlLogRequiredInformationWriter("Related Route Objects not migrated for Change Object "+changeObjId+"\n"); 
				}
				mqlLogRequiredInformationWriter("====================================================================\n");
			}
		}catch(Exception ex){ 
        	//Do nothing
        }finally{
        	ContextUtil.popContext(context);        	
        }
	}

	private static MapList getMigrationNeededRoutesOnChangeObject(Context context, String changeObject) throws Exception {
		try
		{
			StringList	routeSelects = new StringList();
			String relSelectIterNumber = "attribute[State Iteration Number]";
			String relSelectModelerType = "attribute[Modeler Type]";

			StringList relationshipSelects = new StringList();
			relationshipSelects.add(relSelectIterNumber);
			relationshipSelects.add(relSelectModelerType);

			routeSelects.add(SELECT_ID);
			routeSelects.add(SELECT_CURRENT);
			routeSelects.add(SELECT_DESCRIPTION);
			routeSelects.add("attribute[Route Status]");
			routeSelects.add("attribute[Route Activity State]");
			routeSelects.add(SELECT_NAME);

			String objectWhere = "current == Complete";// Current == completed
			// All completed Routes with Route status as "Stopped" should be changed to finished
			DomainObject changeObj = new DomainObject(changeObject);
			MapList mapList = changeObj.getRelatedObjects(context, "Object Route", "Route", routeSelects, relationshipSelects, false, true, (short) 1, objectWhere, null, 0);

			Comparator<Map<String, String>> mapValueComparator = (map1, map2) -> {
				String value1 = map1.get(relSelectIterNumber); 
				String value2 = map2.get(relSelectIterNumber);
				return value1.compareTo(value2); 
			};

			mapList.sort(mapValueComparator);
			return mapList;
		} catch(Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
	}
        
    public void mqlLogRequiredInformationWriter(String command) throws Exception
    {
        super.mqlLogRequiredInformationWriter(command +"\n");
    }
    
    
    public void checkAndloadMigratedOids(String command) throws Exception
    {
     if(migratedOids.indexOf(command)<= -1){
        super.loadMigratedOids(command +"\n");
     }
        
    }
    public void checkAndWriteUnconvertedOID(String command, String ObjectId) throws Exception
    {
     if(migratedOids.indexOf(ObjectId)<= -1){
        super.writeUnconvertedOID(command, ObjectId);
     }
        
    }
}
