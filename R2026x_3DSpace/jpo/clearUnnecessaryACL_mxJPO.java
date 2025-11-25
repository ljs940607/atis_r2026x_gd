import matrix.db.Context;
import matrix.db.MatrixWriter;

import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileWriter;

import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.jsystem.util.ExceptionUtils;

public class clearUnnecessaryACL_mxJPO {

    BufferedWriter writer = null;
    FileWriter warningLog = null;
    String documentDirectory = "";
    
	public clearUnnecessaryACL_mxJPO(Context context, String[] args) throws Exception {		
		// TODO Auto-generated constructor stub
		writer = new BufferedWriter(new MatrixWriter(context));
	}
	
	public int mxMain(Context context, String[] args) throws Exception {
			
		try {			
			if(args.length < 1) 
				throw new IllegalArgumentException();
		}
	    catch (IllegalArgumentException iExp) {
	        writer.write("=================================================================\n");
	        writer.write("Wrong number of arguments.\nPlease provide directory path for creating log file as 1st argument\n");
	        writer.write(iExp.toString() + " : FAILED \n");
	        writer.write("=================================================================\n");
	        writer.close();
	        return 0;
	    }
		
		try {
			documentDirectory = args[0];

	        // documentDirectory does not ends with "/" add it
	        String fileSeparator = java.io.File.separator;
	        if(documentDirectory != null && !documentDirectory.endsWith(fileSeparator)) {
	            documentDirectory = documentDirectory + fileSeparator;
	        }

			warningLog = new FileWriter(documentDirectory + "ACL_Clearing.log", false);
		}
	    catch (FileNotFoundException fEx)
	    {
	        // check if user has access to the directory
	        // check if directory exists
	        writer.write("=================================================================\n");
	        writer.write("Directory does not exist or does not have access to the directory\n");
	        writer.write("=================================================================\n");
	        writer.close();
	        return 0;
	    }

		try {
			mqlLogRequiredInformationWriter("=================================================================");
	    	mqlLogRequiredInformationWriter("Clear the Unnecessary ACLs");
	    	mqlLogRequiredInformationWriter("=================================================================");
	    	
	    	long start = System.currentTimeMillis();
			mqlLogRequiredInformationWriter("Start Time: " + start);
			     		
			ContextUtil.pushContext(context, null, null, null);
	        ContextUtil.startTransaction(context,true);
	        
	        clearACL(context);
	        
	        long finish = System.currentTimeMillis();
			mqlLogRequiredInformationWriter("Finish Time: " + finish);
			
			mqlLogRequiredInformationWriter("=================================================================");
	    	mqlLogRequiredInformationWriter("Process completed in " + (finish-start) + "ms.");
	    	mqlLogRequiredInformationWriter("=================================================================");
	        
	        ContextUtil.commitTransaction(context);
	    }
	    catch (Exception ex) {
	        // abort if transition fails
	    	mqlLogRequiredInformationWriter("=================================================================");
	    	mqlLogRequiredInformationWriter("Unneccessary ACLs clearing failed.");
	    	mqlLogRequiredInformationWriter("=================================================================");
	        writer.flush();

	        ContextUtil.abortTransaction(context);
	    }
	    finally {
	        writer.close();
	        warningLog.close();
	        ContextUtil.popContext(context);
	    }

        return 0;
	}

	/*
	 * This method clears unnecessary ACLs for the Grant role and
	 * User Projects role along with its child roles
	 */
	public void clearACL(Context context) throws Exception {
		
		String usrPrjACLCmd = "transition clear accesslist inactive role $1 $2";
		String grantACLCmd = "transition clear accesslist inactive role $1";
		
		try {
			mqlLogRequiredInformationWriter("Starting the clean-up of unnecessary ACLs for 'User Projects' and its child roles.");			
			MqlUtil.mqlCommand(context, usrPrjACLCmd, "User Projects", "propagate");
			mqlLogRequiredInformationWriter("Successfully completed the clean-up of unnecessary ACLs for 'User Projects' and its child roles.");
			
			mqlLogRequiredInformationWriter("Starting the clean-up of unnecessary ACLs for Grant role.");			
			MqlUtil.mqlCommand(context, grantACLCmd, "Grant");
			mqlLogRequiredInformationWriter("Successfully completed the clean-up of unnecessary ACLs for Grant role.");
		}
		catch (Exception ex) {
			mqlLogRequiredInformationWriter(ex.getMessage());
    		mqlLogRequiredInformationWriter(ExceptionUtils.getStackTrace(ex));
    		throw ex;
		}		
	}

	public void mqlLogRequiredInformationWriter(String command) throws Exception {
        writer.write(command + "\n");
        writer.flush();
      
        warningLog.write(command + "\n");
        warningLog.flush();
    }
}

