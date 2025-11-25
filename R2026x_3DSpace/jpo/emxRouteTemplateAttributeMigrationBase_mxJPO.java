
import java.util.Iterator;
import java.util.Map;
import matrix.db.Context;
import matrix.util.StringList;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;

public class emxRouteTemplateAttributeMigrationBase_mxJPO extends emxCommonMigration_mxJPO
{

	private static final long serialVersionUID = -5029177381386073045L;
	private static String TYPE_ROUTE_TEMPLATE = null;
	private static String ATTRIBUTE_ROUTE_COMPLETION_ACTION = null;


	public emxRouteTemplateAttributeMigrationBase_mxJPO(Context context, String[] args) throws Exception {
		super(context, args);
	}

	public static void init(Context context) throws FrameworkException
	{
		TYPE_ROUTE_TEMPLATE = PropertyUtil.getSchemaProperty(context,"type_RouteTemplate");  
		ATTRIBUTE_ROUTE_COMPLETION_ACTION = PropertyUtil.getSchemaProperty(context, "attribute_RouteCompletionAction");
	}

	public void migrateObjects(Context context, StringList objectList) throws Exception
	{     
		init(context);
		StringList objectSelects = new StringList();
		objectSelects.add(DomainConstants.SELECT_ID);
		objectSelects.add(DomainConstants.SELECT_NAME);
		objectSelects.add(DomainConstants.SELECT_TYPE);
		objectSelects.add("attribute["+ATTRIBUTE_ROUTE_COMPLETION_ACTION+"]");
		String[] oidsArray = new String[objectList.size()];
		oidsArray = (String[])objectList.toArray(oidsArray);        

		MapList mapList = DomainObject.getInfo(context, oidsArray, objectSelects);

		String strType="";
		String strName="";
		String strObjId ="";
		String strRCAValue ="";
		try{
			ContextUtil.pushContext(context); 
			Iterator itr = mapList.iterator();
			while( itr.hasNext())
			{
				try{
					Map valueMap = (Map) itr.next();
					strObjId = (String)valueMap.get(DomainConstants.SELECT_ID);
					strType = (String)valueMap.get(DomainConstants.SELECT_TYPE);
					strName = (String)valueMap.get(DomainConstants.SELECT_NAME);
					strRCAValue = (String)valueMap.get("attribute["+ATTRIBUTE_ROUTE_COMPLETION_ACTION+"]");
					if(!TYPE_ROUTE_TEMPLATE.equalsIgnoreCase(strType)) {
						mqlLogRequiredInformationWriter("No attribute update is requied since object not Route Template: " + strObjId+"\n");
						checkAndWriteUnconvertedOID( strType+","+strName+", type is not Route Template \n" , strObjId);
						continue; 
					}
					if("Promote Connected Object".equalsIgnoreCase(strRCAValue)) {
						mqlLogRequiredInformationWriter("No attribute update is requied route template: " + strObjId+"\n");
						checkAndWriteUnconvertedOID( strType+","+strName+", attribute update is not required \n" , strObjId);
						continue; 
					}

					String command = "mod bus $1 $2 $3;";
					mqlCommand.executeCommand(context, command, strObjId, ATTRIBUTE_ROUTE_COMPLETION_ACTION, "Promote Connected Object");
					mqlLogRequiredInformationWriter("Successfully migrated route template: " + strObjId+"\n");
					checkAndloadMigratedOids(strObjId);
					//Updating non migratedId's information
					checkAndWriteUnconvertedOID( strType+","+strName+", Ownership Update is not required \n" , strObjId);		                          

				} catch (Exception ex) {
					checkAndWriteUnconvertedOID( strType+","+strName+", attribute is not updated \n" , strObjId);		                          
					mqlLogRequiredInformationWriter("Failed to update ownership ");
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

}
