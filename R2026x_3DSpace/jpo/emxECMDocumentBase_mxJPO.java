import java.util.List;
import java.util.Map;

import matrix.db.JPO;
import matrix.db.Context;
import matrix.util.StringList;
import java.lang.reflect.Method;


public class emxECMDocumentBase_mxJPO {
	
	/**
	 * Trigger Method to check if Change Control is enabled on Document or if any CA connected to Document for Revise is completed.
	 * @param context
	 * @param args[0] is Document id and args[1] is key for alert message
	 * @return 1 - if Change Control is enabled on Document (or) if Document is connected to any CA, which is not for Revise and not completed
	 * @return 0 - if Change Control is not enabled on Document and if Document is not connected to any CA (or) if Document is connected to CA, which is not for Revise and completed
	 * @throws Exception
	 */
	public int checkIfChangeControlOrChangeInProcessForRevise(Context context, String[] args) throws Exception {
		int retVal = 0;
		try {
			Class<?> lClass = Class.forName("com.dassault_systemes.enovia.document.ECMDocumentUtil");
			Object inst = lClass.newInstance();
			Object[] lMethodArgumentArray = new Object[2];
			lMethodArgumentArray[0] = context;
			lMethodArgumentArray[1] = args[0];
			Method method = lClass.getMethod("checkIfChangeControlOrChangeInProcessForRevise", matrix.db.Context.class, String.class);
			retVal = (int) method.invoke(inst, lMethodArgumentArray);
		} catch (Exception e) {
			retVal=1;
		}
		return retVal;
	}
	
	/**
	 * Method to check if Document can be deleted wrt. ECM
	 * @param context
	 * @param args[0] is Document id and args[1] is key for alert message
	 * @return 1 - if Document is enabled with Change Control or if connected to any CA 
	 * @return 0 - if Document is not connected to any CA.
	 * @throws Exception
	*/
	public int checkIfDocumentCanBeDeletedOrDemoted(Context context, String[] args) throws Exception {
		
		try{
			int rel = JPO.invoke(context, "UnifiedChangeActionECMTriggers_mxJPO", null, "isObjectImpactedByAnyChange", args);
			return rel;
		}catch(Exception e){
			return 0;
		}
	}
	
	/**
	 * Method to check if Revise commands can be shown wrt. ECM
	 * @param context
	 * @param args[] will contain objectID of Document
	 * @return false - if Document is enabled with Change Control or if connected to any CA, which is not completed
	 * @return true - if Document is enabled with Change Control or if connected to any completed CA or if Document is not connected to any CA
	 * @throws Exception
	 */
	public boolean showReviseCommands(Context context, String[] args) throws Exception {
		boolean showReviseCommands = true;
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			String strDocId = (String) programMap.get("objectId");
			Class<?> lClass = Class.forName("com.dassault_systemes.enovia.document.ECMDocumentUtil");
			Object inst = lClass.newInstance();
			Object[] lMethodArgumentArray = new Object[2];
			lMethodArgumentArray[0] = context;
			lMethodArgumentArray[1] = strDocId;
			Method method = lClass.getMethod("showReviseCommands", matrix.db.Context.class, String.class);
			showReviseCommands = (boolean) method.invoke(inst, lMethodArgumentArray);
		} catch (Exception e) {
			showReviseCommands=true;
		}
		return showReviseCommands;
	}
}


