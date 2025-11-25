
import java.util.Iterator;
import java.util.Map;
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

public class emxRouteRevisionMigrationBase_mxJPO extends emxCommonMigration_mxJPO
{

    private static final long serialVersionUID = -5029177381386073045L;
           
    public emxRouteRevisionMigrationBase_mxJPO(Context context, String[] args) throws Exception {
      super(context, args);
    }

    public static void init(Context context) throws FrameworkException
    {
    	          
    }

    public void migrateObjects(Context context, StringList objectList) throws Exception
    {     
        init(context);
        
        String routeSequence = new Policy(DomainObject.POLICY_ROUTE).getFirstInSequence(context);
        
        StringList objectSelects = new StringList();
        objectSelects.add(DomainConstants.SELECT_NAME);
        objectSelects.add(DomainConstants.SELECT_PHYSICAL_ID);
        objectSelects.add(DomainConstants.SELECT_OWNER);     
        objectSelects.add(DomainConstants.SELECT_TYPE);
        objectSelects.add(DomainConstants.SELECT_REVISION);
        
        String[] oidsArray = new String[objectList.size()];
        oidsArray = (String[])objectList.toArray(oidsArray);        
             
        MapList mapList = DomainObject.getInfo(context, oidsArray, objectSelects);
		
		try{
		    ContextUtil.pushContext(context);
		    Iterator itr = mapList.iterator();
		    while( itr.hasNext())
		    {
		        try{
		            Map valueMap = (Map) itr.next();
		            
		             String strObjId = (String)valueMap.get(DomainConstants.SELECT_PHYSICAL_ID);
		             String strType = (String)valueMap.get(DomainConstants.SELECT_TYPE);
		             String strName = (String)valueMap.get(DomainConstants.SELECT_NAME);
		             String  strRevision = (String)valueMap.get(DomainConstants.SELECT_REVISION);
		            
		             if(UIUtil.isNotNullAndNotEmpty(strRevision) || !TYPE_ROUTE.equalsIgnoreCase(strType)) {
		            	 checkAndWriteUnconvertedOID( strType+", "+strName+", "+strRevision+", migration is not required. \n" , strObjId);		
		            	 continue; 
		             }                          
	            	 mqlLogRequiredInformationWriter(" Migration required for Route "+strName);
		             String mqlCommand = "mod bus $1 $2 $3 $4 $5";
		             MQLCommand.exec(context, mqlCommand, strObjId, DomainConstants.SELECT_NAME, strName, DomainConstants.SELECT_REVISION, routeSequence);
		             checkAndloadMigratedOids(strObjId);	                          
		            
		        } catch (Exception ex) {	                          
		            mqlLogRequiredInformationWriter("Failed to update revision: "+ex.getMessage());
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
