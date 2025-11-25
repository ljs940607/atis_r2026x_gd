
import java.util.Iterator;
import java.util.Map;
import matrix.db.Context;
import matrix.util.StringList;
import com.matrixone.apps.common.Route;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;

public class emxRouteUpdateApprovalIterationMigrationBase_mxJPO extends emxCommonMigration_mxJPO
{

	private static final long serialVersionUID = -5029177381386073045L;
	public static String relationship_ObjectRoute = "";   

	public static String SELECT_OBJECT_ROUTE_REL_ID = "";   
	public static String SELECT_OBJECT_ROUTE_CONTENT_ID = "";   
	public static String SELECT_ROUTE_STATE = "";   
	public static String SELECT_REL_ATTRIBUTE_ROUTE_BASE_STATE = "";  
	public static String SELECT_REL_ATTRIBUTE_STATE_ITERATION_NUMBER = "";    
	public static String SELECT_REL_ATTRIBUTE_ROUTE_BASE_POLICY = "";
	public static String SELECT_OBJECT_ROUTE_CONTENT_POLICY = "";
	public static String SELECT_OBJECT_ROUTE_CONTENT_CURRENT = "";

	public emxRouteUpdateApprovalIterationMigrationBase_mxJPO(Context context, String[] args) throws Exception {
		super(context, args);
	}

	public static void init(Context context) throws FrameworkException
	{
		String ATTRIBUTE_STATE_ITERATION_NUMBER = PropertyUtil.getSchemaProperty(context, "attribute_StateIterationNumber");
		relationship_ObjectRoute = PropertyUtil.getSchemaProperty(context, "relationship_ObjectRoute");         
		SELECT_OBJECT_ROUTE_CONTENT_ID = "to["+ relationship_ObjectRoute +"].from.id";   
		SELECT_OBJECT_ROUTE_CONTENT_POLICY = "to["+ relationship_ObjectRoute +"].from.policy";  
		SELECT_OBJECT_ROUTE_CONTENT_CURRENT = "to["+ relationship_ObjectRoute +"].from.current";
		SELECT_OBJECT_ROUTE_REL_ID = "to["+ relationship_ObjectRoute +"].id";   
		SELECT_REL_ATTRIBUTE_ROUTE_BASE_STATE = "to["+ relationship_ObjectRoute +"]."+DomainRelationship.getAttributeSelect(DomainObject.ATTRIBUTE_ROUTE_BASE_STATE);
		SELECT_REL_ATTRIBUTE_ROUTE_BASE_POLICY = "to["+ relationship_ObjectRoute +"]."+DomainRelationship.getAttributeSelect(DomainObject.ATTRIBUTE_ROUTE_BASE_POLICY);
		SELECT_REL_ATTRIBUTE_STATE_ITERATION_NUMBER = "to["+ relationship_ObjectRoute +"]."+DomainRelationship.getAttributeSelect(ATTRIBUTE_STATE_ITERATION_NUMBER);
	}

	public void migrateObjects(Context context, StringList objectList) throws Exception
	{     
		init(context);
		StringList objectSelects = new StringList(15);
		objectSelects.add(Route.SELECT_PHYSICAL_ID);
		objectSelects.add(Route.SELECT_NAME);
		objectSelects.add(Route.SELECT_TYPE);
		objectSelects.add(Route.SELECT_ID);
		objectSelects.add(Route.SELECT_CURRENT);
		objectSelects.add(Route.SELECT_IS_LAST);
		objectSelects.add(Route.SELECT_REVISION);
		objectSelects.add(Route.SELECT_ROUTE_STATUS);

		objectSelects.add(SELECT_REL_ATTRIBUTE_STATE_ITERATION_NUMBER);
		objectSelects.add(SELECT_REL_ATTRIBUTE_ROUTE_BASE_POLICY);   
		objectSelects.add(SELECT_REL_ATTRIBUTE_ROUTE_BASE_STATE);   
		objectSelects.add(SELECT_OBJECT_ROUTE_CONTENT_ID);   
		objectSelects.add(SELECT_OBJECT_ROUTE_CONTENT_POLICY);   
		objectSelects.add(SELECT_OBJECT_ROUTE_CONTENT_CURRENT);   
		objectSelects.add(SELECT_OBJECT_ROUTE_REL_ID);   

		String[] oidsArray = new String[objectList.size()];
		oidsArray = (String[])objectList.toArray(oidsArray);
		StringList mulValSelects= new StringList();
		mulValSelects.add(SELECT_REL_ATTRIBUTE_STATE_ITERATION_NUMBER);
		mulValSelects.add(SELECT_REL_ATTRIBUTE_ROUTE_BASE_POLICY);   
		mulValSelects.add(SELECT_REL_ATTRIBUTE_ROUTE_BASE_STATE);   
		mulValSelects.add(SELECT_OBJECT_ROUTE_CONTENT_ID);   
		mulValSelects.add(SELECT_OBJECT_ROUTE_REL_ID);   
		mulValSelects.add(SELECT_OBJECT_ROUTE_CONTENT_POLICY);   
		mulValSelects.add(SELECT_OBJECT_ROUTE_CONTENT_CURRENT);   
		
		MapList mapList = DomainObject.getInfo(context, oidsArray, objectSelects, mulValSelects);
		
		try{
			ContextUtil.pushContext(context);               
			Iterator itr = mapList.iterator();
			while( itr.hasNext())
			{
				try{
					Map valueMap = (Map) itr.next();
					String strObjId = (String)valueMap.get(Route.SELECT_ID);
					String strType = (String)valueMap.get(Route.SELECT_TYPE);
					String strName = (String)valueMap.get(Route.SELECT_NAME);
					String strRevision = (String)valueMap.get(Route.SELECT_REVISION);
					String isLast = (String)valueMap.get(Route.SELECT_IS_LAST);
					String routeStatus  = (String)valueMap.get(Route.SELECT_ROUTE_STATUS); 
					if(!"Route".equals(strType)) {
						mqlLogRequiredInformationWriter("No migration is requied since type is not Route: " + strName+"\n");
						checkAndWriteUnconvertedOID( strType+", "+strName+", "+strRevision+",  type is not Route \n" , strObjId);
						continue;
					}

					if(!"true".equalsIgnoreCase(isLast)) {
						mqlLogRequiredInformationWriter("No migration is requied since Route is not the latest revision: " + strName+"\n");
						checkAndWriteUnconvertedOID( strType+", "+strName+", "+strRevision+", Route is not the latest revision \n" , strObjId);
						continue;
					}
					
					String currentState = (String)valueMap.get(Route.SELECT_CURRENT);

					if(Route.STATE_ROUTE_COMPLETE.equalsIgnoreCase(currentState) ||"Archive".equalsIgnoreCase(currentState)) {
						mqlLogRequiredInformationWriter("No migration is requied since Route is completed: " + strName+"\n");
						checkAndWriteUnconvertedOID( strType+", "+strName+", "+strRevision+", Route is completed \n" , strObjId);
						continue;
					}

					StringList strObjectRouteRelIds = (StringList)valueMap.get(SELECT_OBJECT_ROUTE_REL_ID);
					if(strObjectRouteRelIds == null || strObjectRouteRelIds.size() == 0) {
						mqlLogRequiredInformationWriter("No migration is requied since Route is not associated to any object: " + strName+"\n");
						checkAndWriteUnconvertedOID( strType+", "+strName+", "+strRevision+", Route is not associated to any object \n" , strObjId);
						continue;
					}

					StringList strObjectRouteContentId = (StringList)valueMap.get(SELECT_OBJECT_ROUTE_CONTENT_ID);
					StringList strObjectRouteContentPolicy = (StringList)valueMap.get(SELECT_OBJECT_ROUTE_CONTENT_POLICY);
					StringList strObjectRouteContentCurrent = (StringList)valueMap.get(SELECT_OBJECT_ROUTE_CONTENT_CURRENT);
					//StringList strObjectRouteBasePolicy = (StringList)valueMap.get(SELECT_REL_ATTRIBUTE_ROUTE_BASE_POLICY);
					StringList strObjectRouteBaseState = (StringList)valueMap.get(SELECT_REL_ATTRIBUTE_ROUTE_BASE_STATE);
					StringList strObjectStateIteration = (StringList)valueMap.get(SELECT_REL_ATTRIBUTE_STATE_ITERATION_NUMBER);
					mqlLogRequiredInformationWriter("Started migration for Route-"+strName);
					for(int index=0;index<strObjectRouteRelIds.size();index++) {
						String iteration =  strObjectStateIteration.get(index);
						if("0".equalsIgnoreCase(iteration)) {
						updateStateIterationNumber(context, routeStatus, strObjectRouteRelIds.get(index), strObjectRouteContentId.get(index), strObjectRouteContentCurrent.get(index), strObjectRouteContentPolicy.get(index), strObjectRouteBaseState.get(index));
							mqlLogRequiredInformationWriter("Updated Iteration Numb for Object: " +  strObjectRouteContentId.get(index));
						}
					}
					mqlLogRequiredInformationWriter("Migration done for Route-"+strName);
					checkAndloadMigratedOids(strObjId);                   
				} catch (Exception ex) {
					mqlLogRequiredInformationWriter("Failed To Update State Iteration Number");
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
	
	
	/** this update the counter. will be used when route blocking maturity change or content added to route
	 * @param context
	 * @param routeId
	 * @param relId
	 * @param contentId
	 * @param strRouteBaseState
	 */
	public static void updateStateIterationNumber(Context context, String routeStatus,String relId, String contentId, String contentCurrentState, String contentPolicy,String strRouteBaseState)  {
		try {			
			if("Ad Hoc".equals(strRouteBaseState)) {
				return;
			}
			strRouteBaseState = PropertyUtil.getSchemaProperty(context, "Policy", contentPolicy, strRouteBaseState);
			String strCount = Route.getStateIteration(context, contentId, null, strRouteBaseState);
			if("0".equalsIgnoreCase(strCount)) {
				strCount = "1";
			}
			if(UIUtil.isNotNullAndNotEmpty(strCount)) {
				updateStateIterationNumber(context, relId, strCount);
			}
		}catch(Exception ex) {
			System.out.println("Exception in updateStateIterationNumber : "+ex.getMessage());
		}
	}



	public static void updateStateIterationNumber(Context context, String relId, String strCount) throws FrameworkException {
		String ATTRIBUTE_STATE_ITERATION_NUMBER = PropertyUtil.getSchemaProperty(context, "attribute_StateIterationNumber");
		String command = "mod connection $1 $2 $3";
		MqlUtil.mqlCommand(context, true, command, true, relId, ATTRIBUTE_STATE_ITERATION_NUMBER, strCount);
	}
}
