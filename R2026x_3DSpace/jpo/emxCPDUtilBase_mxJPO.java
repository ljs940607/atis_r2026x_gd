/*
 *  emxCPDUtilBase.java
 *  CPD Utility JPO.
 */
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;


import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.common.Person;
import com.matrixone.apps.common.util.ComponentsUIUtil;
import com.matrixone.apps.common.util.ImageConversionUtil;
import com.matrixone.apps.common.util.ImageManagerUtil;
import com.matrixone.apps.cpd.CPDCommonConstants;
import com.matrixone.apps.cpd.util.CPDPropertyUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.Image;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.fcs.common.Resources;

import matrix.db.Context;
import matrix.db.FileList;
import matrix.db.JPO;
import matrix.util.StringList;

/**
 * @version V6R2011x - Copyrigh t (c) 2010, MatrixOne, Inc.
 */
@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "PMD.AvoidDuplicateLiterals", "PMD.TooManyMethods"})
public class emxCPDUtilBase_mxJPO extends emxDomainObject_mxJPO
{
	private static final String SEL_ACTIVE_VERSION_MAJOR_ID = "to[" + CommonDocument.RELATIONSHIP_ACTIVE_VERSION + "].from.id";
	private static final String SELECT_MOVE_FILES_TO_VERSION = CommonDocument.SELECT_MOVE_FILES_TO_VERSION;
	private static final String MINOR_ID = "MINOR_ID";
	private static final String MAJOR_ID = "MAJOR_ID";

	/**
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds no arguments
	 * @throws Exception if the operation fails
	 * @since CPN V6R2011x
	 * @grade 0
	 */
	public emxCPDUtilBase_mxJPO (Context context, String[] args)
	throws Exception
	{
		super(context, args);
	}

	/**
	 * This method is executed if a specific method is not specified.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds no arguments
	 * @returns int
	 * @throws Exception if the operation fails
	 * @since CPN V6R2011x
	 */
	public int mxMain(Context context, String[] args)
	throws Exception
	{
		if (!context.isConnected()) {
			throw new Exception("not supported on desktop client");
		}
		return 0;
	}

	/**
	 * Gets the CPG Accelerator Installed Version .
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds input arguments.
	 * @return a String for CPG Accelerator Version, else null if non-CPG Accelerator Name passed
	 * @throws Exception if the operation fails.
	 */
	public static String getAcceleratorVersionInstalled(matrix.db.Context context, String[] args) throws Exception
	{
		if (args.length == 0 )
		{
			throw new IllegalArgumentException();
		}

		String strAccName = args[0];
		String strInstalled  = "print program $1 select $2 dump";
		Map<String, String> appAndAcceleratorName = new HashMap<String, String>(5);
		appAndAcceleratorName.put("CPN", "appVersionCPG Accelerator IPM");
		appAndAcceleratorName.put("AWL", "appVersionAWLAccelerator");
		appAndAcceleratorName.put("NPI", "appVersionNPIAccelerator");
		appAndAcceleratorName.put("VBM", "appVersionVBMAccelerator");
		
		if(!appAndAcceleratorName.containsKey(strAccName)) {
			return null;
		}
		
		return	MqlUtil.mqlCommand(context, strInstalled, 
				                                "eServiceSystemInformation.tcl", 
                                                 "property[" + appAndAcceleratorName.get(strAccName) +"].value");
	}

	/**
	 * Checks if the CPG Accelerator is Installed .
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds input arguments.
	 * @return a boolean weather the CPG Accelerator is Insatalled or not.
	 * @throws Exception if the operation fails.
	 */
	public static boolean isAcceleratorInstalled(matrix.db.Context context, String[] args) throws Exception
	{
		if (args.length == 0 )
		{
			throw new IllegalArgumentException();
		}

		return UIUtil.isNotNullAndNotEmpty(getAcceleratorVersionInstalled(context,args));
	}

	/**
	 * Checks if the any of CPG Accelerators is Installed .
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds input arguments.
	 * @return a boolean weather any of the CPG Accelerator is Insatalled or not.
	 * @throws Exception if the operation fails.
	 */
	public static boolean anyCPGAcceleratorInstalled(matrix.db.Context context, String[] args) throws Exception
	{
		String myArgs[] = new String[1];
		boolean isInstalled = false;

		StringList slAccNames = new StringList(4);
		slAccNames.addElement("NPI");
		slAccNames.addElement("CPN");
		slAccNames.addElement("VBM");
		slAccNames.addElement("AWL");

		for(int i=0;i<slAccNames.size();i++)
		{
			myArgs[0] = (String)slAccNames.get(i);
			isInstalled = isAcceleratorInstalled(context,myArgs);
			if(isInstalled)
				break;
		}
		return isInstalled;
	}
	
	/**
	 * @deprecated will be removed in coming releases
	 */
	public static Boolean isVisibleInCPD(Context context,String[] args)throws Exception
	{
		return true;
	}

	//SY6: This method Checks the assignee has approver role or not while creating Project Task relationship between Inbox Task and Person/RTU.
	public int checkProjectTaskAssigneeHasApproverRole (Context context, String[] args) throws Exception
    {
		String routeId = args[0];
		String strNewAssignee = args[1];

		return checkAssigneeHasApproverRole(context, routeId, strNewAssignee);
    }

	//SY6: This method Checks the New assignee has approver role or not while creating Project Task relationship between Inbox Task and Person/RTU
	public int checkNewProjectTaskAssigneeHasApproverRole (Context context, String[] args) throws Exception
    {
		String taskId = args[0];
		String strNewAssignee = args[1];

		String strRTBasePurposeSelectable = "from[" + DomainConstants.RELATIONSHIP_ROUTE_TASK + "].to.attribute[" + DomainConstants.ATTRIBUTE_ROUTE_BASE_PURPOSE + "]";
		String strRTBasePurpose = getRTBasePurpose(context, taskId, strRTBasePurposeSelectable);

		return canAssignTask(context, strRTBasePurpose, strNewAssignee);
    }

	//SY6: This method checks the Assignee has approver role or not while creating Route Node relationship between Route and Person/RTU
	public int checkRouteNodeAssigneeHasApproverRole (Context context, String[] args) throws Exception
    {
		String routeId = args[0];
		if(!isKindOf(context, routeId, DomainObject.TYPE_ROUTE)) {
			return 0;
		}
		String strNewAssignee = args[1];

		return checkAssigneeHasApproverRole(context, routeId, strNewAssignee);
    }

	//SY6: This method checks the New Assignee has approver role or not while creating Route Node relationship between Route and Person/RTU
	public int checkNewRouteNodeAssigneeHasApproverRole (Context context, String[] args) throws Exception
    {
		String routeId = args[0];
		if(!isKindOf(context, routeId, DomainObject.TYPE_ROUTE)) {
			return 0;
		}
		String strNewAssignee = args[1];

		return checkAssigneeHasApproverRole(context, routeId, strNewAssignee);
    }

	private int checkAssigneeHasApproverRole (Context context, String routeOrTaskId, String assignee) throws Exception
	{
		String strRTBasePurposeSelectable = "attribute[" + DomainConstants.ATTRIBUTE_ROUTE_BASE_PURPOSE + "]";
		String strRTBasePurpose = getRTBasePurpose(context, routeOrTaskId, strRTBasePurposeSelectable);

		return canAssignTask(context, strRTBasePurpose, assignee);
	}

	private String getRTBasePurpose(Context context, String taskOrRouteId, String strRTBasePurposeSelectable) throws Exception
	{
		DomainObject doObj = DomainObject.newInstance(context, taskOrRouteId);
		String strRTBasePurpose = (String)doObj.getInfo(context, strRTBasePurposeSelectable);

		return strRTBasePurpose;
	}

	private int canAssignTask(Context context, String strRTBasePurpose, String newAssignee) throws Exception {
		
		boolean canAssign = CPDCommonConstants.ROUTE_APPROVAL.equals(strRTBasePurpose);
		if(!canAssign || !isKindOf(context, newAssignee, DomainObject.TYPE_PERSON))
			return 0;

		Person person = (Person)DomainObject.newInstance(context, DomainObject.TYPE_PERSON);
		person.setId(newAssignee);
		canAssign = person.hasRole(context, CPDCommonConstants.ROLE_APPROVER);
		String taskAssignee = PersonUtil.getFullName(context, person.getInfo(context, DomainConstants.SELECT_NAME));
		
		if(!canAssign)
		{
			String lang = context.getLocale().toString();
			String strMessage = ComponentsUIUtil.getI18NString(context, lang, CPDCommonConstants.CPD_STRING_RESOURCE, "emxCPD.Alert.AssigneeNotHaveApproverRole",
					new String[]{taskAssignee});

			emxContextUtilBase_mxJPO.mqlNotice(context ,strMessage);
		}
		return canAssign ? 0 : 1;
	}
	
	
    /**
     *  This method assigns selected Inbox tasks from the task table to the newly selected persons
     * @param context
     * @param args
     * @throws Exception
	 * @author TY1
	 */
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void reassignTasksToSelectedPerson(Context context, String[] args) throws Exception
	{
		try
		{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap requestMap = (HashMap)programMap.get("requestMap");

			String strTaskIDs    = (String)requestMap.get("selRowIDs");
			StringList slTaskIds = FrameworkUtil.split(strTaskIDs, ",");
			
			String loggedInUser = context.getUser();
			String newAssignee = (String)requestMap.get("NewAssignee");
			//fix IR-152885V6R2014x
			if(loggedInUser.equals(newAssignee))
			{
				String errorMessage = EnoviaResourceBundle.getProperty(context, CPDCommonConstants.CPD_STRING_RESOURCE ,context.getLocale(),
						"emxCPD.InboxTaskReassign.AssignToSelfError");
				emxContextUtilBase_mxJPO.mqlNotice(context , errorMessage);
			}
			else 
			{
				for(int i=0 ; i<slTaskIds.size() ; i++)
				{
					String strTaskId = (String)slTaskIds.get(i);
					requestMap.put("objectId", strTaskId);
					String saArgs[] = JPO.packArgs(programMap);
					DomainObject inboxTaskObj = new DomainObject(strTaskId);
					
					String dueDateVal = inboxTaskObj.getAttributeValue(context, DomainConstants.ATTRIBUTE_SCHEDULED_COMPLETION_DATE);
					new emxInboxTask_mxJPO(context, null).updateAssignee(context, saArgs);
					inboxTaskObj.setAttributeValue(context,  DomainConstants.ATTRIBUTE_SCHEDULED_COMPLETION_DATE, dueDateVal);
				}
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	//Task Reassignment - PreProcessFunction 
	//to check whether all selected tasks are of type Inbox Task or not
    //Author: WX7
	@com.matrixone.apps.framework.ui.PreProcessCallable
    public Map reassignInboxTaskPreProcess(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map) JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get("requestMap");

			String strTableRowIds = (String) mpRequest.get("rowIds");
			String[] rowIds = ComponentsUIUtil.stringToArray(strTableRowIds, ",");
			
			StringList selects = new StringList();
			selects.add(DomainConstants.SELECT_TYPE);
			selects.add(DomainConstants.SELECT_OWNER);
			selects.add(DomainConstants.SELECT_CURRENT);
			selects.add(DomainObject.getAttributeSelect(DomainConstants.ATTRIBUTE_ALLOW_DELEGATION));
			
			MapList taskDetails = DomainObject.getInfo(context, rowIds, selects);
			boolean canReassign = false;
			for (Map selectedTask : (List<Map>)taskDetails) {
				boolean isIT = DomainConstants.TYPE_INBOX_TASK.equalsIgnoreCase((String) selectedTask.get(DomainObject.SELECT_TYPE));
				boolean isOwner = context.getUser().equalsIgnoreCase((String) selectedTask.get(DomainObject.SELECT_OWNER));
				boolean isActive = DomainConstants.STATE_INBOX_TASK_ASSIGNED.equalsIgnoreCase((String) selectedTask.get(DomainObject.SELECT_CURRENT));
				boolean allowDelegation = "TRUE".equalsIgnoreCase((String) selectedTask.get(DomainObject.getAttributeSelect(DomainConstants.ATTRIBUTE_ALLOW_DELEGATION)));
				
				canReassign = isIT && isOwner && isActive && allowDelegation;
				if(!canReassign)
					break;
			}
			
			Map returnMap = new HashMap(2);
			String actionKey = "Action";
			String messageKey = "Message";
			
			if (!canReassign) {
				String language = context.getSession().getLanguage();
				
				String messageValue = EnoviaResourceBundle.getProperty(context, CPDCommonConstants.CPD_STRING_RESOURCE, 
						new Locale(language), "emxCPD.Task.Reassignment.Error");
		
				returnMap.put(actionKey, "Stop");
				returnMap.put(messageKey, messageValue);
			} else {
				returnMap.put(actionKey, "Continue");
				returnMap.put(messageKey, "");
			}
			return returnMap;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public boolean isKindOf(Context context, String objectId, String type) throws FrameworkException
	{
        String sResult = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", objectId, "type.kindof[" + type+ "]");
        return "TRUE".equalsIgnoreCase(sResult);
	}

	
	/**
	 * @deprecated will be removed in coming releases
	 */
	public void connectImageHolderForGraphicType(Context context, String[] args) throws FrameworkException{
		try{
			String docId = args[0];
			if(!isValidObjectID(context, docId)) {
				return;
			}
			boolean isCPGObject = CPDPropertyUtil.isCPGGraphicPolicy(context,docId);
			if(isCPGObject){
				connectImageHolderToDocument(context, args);
			}
		}
		catch(Exception e){
			throw new FrameworkException(e);
		}
	}

	/**
	 * Checkin Trigger Program for Graphic Document Type
	 * For Copy/Checkin files to Image Holder when file is checked in to Graphic Document Type 
	 * @deprecated will be removed in coming releases
	 */	
	@SuppressWarnings("unchecked")
	public void connectImageHolderToDocument(Context context, String[] args) throws FrameworkException
	{
		documentCheckInFileSyncImageHolder(context, args);
	}
	
	private void copyImageFromDocumentToImageManager(Context context, String srcOid, String format, String srcFile, String tgtOid) throws FrameworkException {
		boolean uniqDirCreated = false;
        // create a unique temporary directory
        String imageRoot = Resources.getWorkspaceRoot();
        String uniqueDir = imageRoot.endsWith(File.separator) ?  imageRoot + UUID.randomUUID().toString() :
                                                                 imageRoot + File.separator + UUID.randomUUID().toString();
        
        String srcFilePath = uniqueDir + File.separator + srcFile;        
		try {
			
            uniqDirCreated = (new File(uniqueDir)).mkdir();
            
            if(!uniqDirCreated) {
            	throw new FrameworkException("Unable to create temp directory!");
            }
            //Checkout file to a temp dir
            DomainObject srcObj = new DomainObject(srcOid);
            srcObj.checkoutFile(context, false, format, srcFile, uniqueDir);
            
            //check in file to image hoder generic format from temp folder
            StringBuffer checkin = new StringBuffer(100);
            checkin.append("checkin bus $1 unlock format $2 store $3 append $4");
            
			MqlUtil.mqlCommand(context, checkin.toString(), tgtOid, DomainConstants.FORMAT_GENERIC, ImageConversionUtil.getStore(context, ImageConversionUtil.POLICY_IMAGEHOLDER), srcFilePath);
		} catch (Exception e) {
			throw new FrameworkException(e);
		} finally {
			if(uniqDirCreated) {
	            try {
	                new ImageConversionUtil().deleteDirectoryRecursive(new File(uniqueDir));
	            }catch (Exception e) {}
			}
		}
	}
	

	public int checkForFileCheckedin(Context context, String[] args) throws Exception
	{
		if(args.length == 0)
			throw new IllegalAccessException();
		String docId = args[0];
		DomainObject doDoc = new DomainObject(docId);
		String fileName = doDoc.getInfo(context, CommonDocument.SELECT_FILE_NAME);
		if(fileName != null && !"".equalsIgnoreCase(fileName)) {
			return 0;
		} else {
			return 1;
		}
	}
	
	
	/**
	 * Relationship Active Version Delete Override Trigger Program
	 * Trigger will be invoked if any version is deleted
	 * 1. Deletes Respective file in Image Holder
	 * 2. If version Doc is deleted and if it have previous revision, then the file in previous revision
	 * 	  is checked in to Image holder also
	 * 
	 * @deprecated this trigger is not used anymore due to performance problem for other APPs
	 */
	public void syncImageHolder(Context context, String[] args) throws FrameworkException 
	{
		return;
	}
	
	public void connectImageHolderToRevisedGraphicDocument(Context context, String[] args) throws FrameworkException{
		try{
			String docId = args[0];
			if(!isValidObjectID(context, docId)) {
				return;
			}
			
			boolean isCPGObject = CPDPropertyUtil.isCPGGraphicPolicy(context,docId);
			if(isCPGObject){
				connectImageHolderToRevisedDocument(context,args);
			}
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}
	
	public void connectImageHolderToRevisedDocument(Context context, String[] args) throws FrameworkException
	{
		try {
			String oldDocId = args[0];
			if(!isValidObjectID(context, oldDocId)) {
				return;
			}
			
			DomainObject oldDocObj = new DomainObject(oldDocId);
			if(CommonDocument.POLICY_VERSION.equalsIgnoreCase(oldDocObj.getInfo(context, SELECT_POLICY)))
				return;
			DomainObject docObj = new DomainObject(oldDocObj.getLastRevision(context));
			StringList sl = new StringList(SELECT_FILE_FORMAT);
			sl.add(SELECT_FILE_NAME);
			Map docDetails = docObj.getInfo(context, sl);
			if(docDetails != null) {
				StringList flNames = (StringList) docDetails.get(SELECT_FILE_NAME);
				if(flNames!=null && flNames.size()>0 && UIUtil.isNotNullAndNotEmpty((String) flNames.get(0))) {
					Image img = oldDocObj.getImageObject(context);
					DomainObject imageClone = new DomainObject(img.cloneObject(context, null)); 
					DomainRelationship.connect(context, imageClone, RELATIONSHIP_IMAGE_HOLDER, docObj);
				}
			}
		} catch (Exception e) {
			throw new FrameworkException(e);
		}

	}
	
	private boolean isValidObjectID(Context context, String objID) throws FrameworkException {
		return UIUtil.isNotNullAndNotEmpty(objID) && FrameworkUtil.isObjectId(context, objID);
	}
	
	private String getPreviousRevID(Context context, String objectID) throws FrameworkException {
		try{
			if(UIUtil.isNullOrEmpty(objectID))
				return null;
			DomainObject avObj = new DomainObject(objectID);
			DomainObject prevRevision = new DomainObject(avObj.getPreviousRevision(context));
			return prevRevision.getObjectId();
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}
	
	private String getVersionObjIDWithFileName(Context context, String majorDocID, String fileName) throws FrameworkException {
		try {
			DomainObject domObj = new DomainObject(majorDocID);
			
			//TODO get the Action Versions using getRelated
			StringList list = domObj.getInfoList(context, "from[" + CommonDocument.RELATIONSHIP_ACTIVE_VERSION + "].to.id");
			
			for(int i=0; i<list.size(); i++){
				DomainObject obj = new DomainObject((String)list.get(i));
				
				String title = obj.getInfo(context,CommonDocument.SELECT_TITLE);
				boolean isLatest = "TRUE".equalsIgnoreCase(obj.getInfo(context, "latest"));
				
				if(fileName.equals(title) && isLatest) {
					return obj.getObjectId(context);
				}
			}
			return null;
			
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	@SuppressWarnings("rawtypes")
	private Map getSourceDocInfo(Context context, String srcID) throws FrameworkException {
		try {
			DomainObject docObj = new DomainObject(srcID);

			StringList selects = new StringList(SELECT_MOVE_FILES_TO_VERSION);
			selects.add(SEL_ACTIVE_VERSION_MAJOR_ID);
			
			return docObj.getInfo(context, selects);
			
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	private Map<String, String> getMajorMinorIDs(Context context, String majorID, String minorID, boolean moveFilesToVersion) throws FrameworkException {
		Map<String, String> retMAP = new HashMap<String, String>(3);
		retMAP.put(MAJOR_ID, majorID);
		retMAP.put(MINOR_ID, minorID);
		retMAP.put(SELECT_MOVE_FILES_TO_VERSION, new Boolean(moveFilesToVersion).toString());
		return retMAP;
	}
	
	@SuppressWarnings("rawtypes")
	private Map<String, String> getMajorMinorIDInDelete(Context context, String srcID) throws FrameworkException {
		Map docMap = getSourceDocInfo(context, srcID);
		
		//Get Document Id based on moveFilesToVersion Attribute
		boolean moveFilesToVersion = "true".equalsIgnoreCase((String)docMap.get(SELECT_MOVE_FILES_TO_VERSION));
		String majorObjectID = (String)docMap.get(SEL_ACTIVE_VERSION_MAJOR_ID);
		String minorObjectID = srcID;
		
		return getMajorMinorIDs(context, majorObjectID, minorObjectID, moveFilesToVersion);
	}	
	
	@SuppressWarnings("rawtypes")
	private Map<String, String> getMajorMinorIDInCheckIn(Context context, String srcID, String fileNameC) throws FrameworkException {
		Map docMap = getSourceDocInfo(context, srcID);
		
		//Get Document Id based on moveFilesToVersion Attribute
		boolean moveFilesToVersion = "true".equalsIgnoreCase((String)docMap.get(SELECT_MOVE_FILES_TO_VERSION));
		String majorObjectID = null;
		String minorObjectID = null;
		if(moveFilesToVersion) {
			minorObjectID = srcID;
			majorObjectID  = (String)docMap.get(SEL_ACTIVE_VERSION_MAJOR_ID);
		} else {
			majorObjectID = srcID;
			minorObjectID = getVersionObjIDWithFileName(context, majorObjectID, fileNameC);
		}

		return getMajorMinorIDs(context, majorObjectID, minorObjectID, moveFilesToVersion);
	}
	
	private StringList getGenericFormatFiles(Context context, String objectID) throws FrameworkException {
		try {
			String files = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", objectID, Image.SELECT_FORMAT_GENERIC);
			return FrameworkUtil.split(files, ",");
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private boolean canGenerateImageForDocument(Context context, DomainObject majorObj, String format, String fileName) 
	throws FrameworkException 
	{
		try {
			StringList selects = new StringList();
			selects.add(DomainConstants.SELECT_TYPE);
			selects.add(DomainConstants.SELECT_POLICY);
			
			Map info = majorObj.getInfo(context, selects);
			String type = (String) info.get(DomainConstants.SELECT_TYPE);
			String policy = (String) info.get(DomainConstants.SELECT_POLICY);			
			
			String typeSymb = FrameworkUtil.getAliasForAdmin(context, DomainConstants.SELECT_TYPE, type, true);
					
			if(!CPDPropertyUtil.getDocImageGenerationPolicySupported(context, typeSymb, true, false).contains(policy))
				return false;

			// Ignore the files for image conversion
			if(!CPDPropertyUtil.getDocImageGenerationFormatSupported(context, typeSymb, true, false).contains(format))
				return false;
			
			String fileExt = ImageManagerUtil.getFileExtension(fileName);
			for (String ext : (List<String>) CPDPropertyUtil.getDocImageGenerateFileExtensionNotSupported(context)) {
				if(ext.equalsIgnoreCase(fileExt))
				   return false;
			}			
			
			if(CPDPropertyUtil.getDocImageGenerationImageUtilityRequired(context, typeSymb, true) &&
			   UIUtil.isNullOrEmpty(CPDPropertyUtil.getImageUtilityName(context)))	{
				  return false;
			}
			
			return true;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	private boolean isVersionObject(Context context, String docID) throws FrameworkException {
		return CommonDocument.POLICY_VERSION.equals(MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", docID, "policy"));
	}
	
	private Map<String, String> getDocFilesNameFormat(Context context, DomainObject doc) throws FrameworkException {
		try {
			Map<String, String> files = new HashMap<String, String>();
			FileList filesList = doc.getFiles(context);
			for (int i = 0; i < filesList.size(); i++) {
				matrix.db.File file = (matrix.db.File) filesList.get(i);
				String fileName = file.getName();
				String fileFormat = file.getFormat();
				files.put(fileName, fileFormat);
			}
			return files;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	@SuppressWarnings({ "unchecked" })
	private boolean removeFileFromImageHolder(Context context, String versionObjID, Image imageHolder)throws FrameworkException {
		try {
			if(imageHolder == null)
				return false;			
			
			DomainObject verObj = new DomainObject(versionObjID);
			String fileName = verObj.getInfo(context, DomainObject.getAttributeSelect(DomainConstants.ATTRIBUTE_TITLE));
			String fileNameBase = ImageManagerUtil.getFileBaseName(fileName);
			
			StringList genericFiles = getGenericFormatFiles(context, imageHolder.getId(context).trim());
			if(!genericFiles.contains(fileName))
				return false;
			
			//This should be called before deleting the file
			String primaryImageName = imageHolder.getInfo(context, DomainObject.getAttributeSelect(ATTRIBUTE_PRIMARY_IMAGE));
			
            int countOfFiles = 0;
            for(String genericFileName : (List<String>) genericFiles){
            	String genericFileNameBase = ImageManagerUtil.getFileBaseName(genericFileName);
            	if(fileNameBase.equalsIgnoreCase(genericFileNameBase))
            			++countOfFiles;
            }

        	// This method will delete default generic format file for given file name on given image object. 
        	// This is mainly used when Existing file and newly uploaded file names are matching but not extension. 
        	// In this case do not to delete other formats file just need to delete generic format file with considering file extension.  	
        	// Fix for Issue: IR-361946-V6R2013x 
            if(countOfFiles == 1) {
            	imageHolder.deleteImages(context, new String[]{fileName});
            } else if(countOfFiles > 1) {
            	MqlUtil.mqlCommand(context,"delete bus $1 format $2 file $3;", imageHolder.getId(context).trim(), DomainConstants.FORMAT_GENERIC, fileName);
            }
            
            return fileName.equals(primaryImageName);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	private String createImageHolder(Context context, String objectID) throws FrameworkException {
		DomainObject object = DomainObject.newInstance(context, objectID);
		DomainObject imageHolderObject = DomainObject.newInstance(context, TYPE_IMAGE_HOLDER);
		imageHolderObject.createAndConnect(context, TYPE_IMAGE_HOLDER, RELATIONSHIP_IMAGE_HOLDER, object, false);
		return imageHolderObject.getInfo(context, SELECT_ID);
	}	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void copyFileAndGenerateImages(Context context, DomainObject docObj, String fileSrcObjID, String format, String fileName, boolean setThisAsPrimary, String...args) 
	throws FrameworkException {
		try {
			Image imageHolder = docObj.getImageObject(context);
			
			String primaryImage = null;
			
			if(imageHolder == null) {
				createImageHolder(context, docObj.getId(context).trim());
				imageHolder = docObj.getImageObject(context);
				setThisAsPrimary = true;
			} else {
				primaryImage = imageHolder.getInfo(context, DomainObject.getAttributeSelect(ATTRIBUTE_PRIMARY_IMAGE));
				setThisAsPrimary = setThisAsPrimary || UIUtil.isNullOrEmpty(primaryImage);
			}
			
			String strImgHolderId = imageHolder.getId(context).trim();
			
			// For Copy/Checkin file to Image Holder
			copyImageFromDocumentToImageManager(context, fileSrcObjID, format, fileName, strImgHolderId);
			
			// Generating all formats of file in Image Holder
			HashMap paramMap = new HashMap();
			HashMap objectMap = new HashMap();
			paramMap.put("objectId",strImgHolderId);
			objectMap.put("fileName",new StringList(fileName));
			new emxImageManagerBase_mxJPO(context,args).generateTransformatedImages(context, paramMap, objectMap);
			
			//Check and update the primary image
			//If primary image is not set, set the current image as primary image, else check whether it is the valid primary image.
			if(!setThisAsPrimary) {
				
				String primaryBaseName = ImageManagerUtil.getFileBaseName(primaryImage);
				
				StringList genericImages = getGenericFormatFiles(context, strImgHolderId);
				StringList baseNames = new StringList(genericImages.size());
	            for(String genericName : (List<String>) genericImages){
	            	baseNames.add(ImageManagerUtil.getFileBaseName(genericName));
	            }
	            setThisAsPrimary = !baseNames.contains(primaryBaseName);
			}
			
			if(setThisAsPrimary) {
				String strPrimfileName = ImageManagerUtil.getPrimaryImageFileNameForImageManager(context, fileName);
				imageHolder.setAttributeValue(context, ATTRIBUTE_PRIMARY_IMAGE, strPrimfileName);
			}
					
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void documentCheckInFileSyncImageHolder(Context context, String[] args) throws FrameworkException
	{
		try {
			String fileSrcObjID = args[0];
			String format = args[1];
			String fileNameF = args[2];
			String fileNameO = args[3];
			
			if(!isValidObjectID(context, fileSrcObjID))
				return;			
			
			String fileName = UIUtil.isNotNullAndNotEmpty(fileNameO) && fileNameF.endsWith(fileNameO) ? fileNameO : fileNameF;
			
			Map<String, String> majorMinor = getMajorMinorIDInCheckIn(context, fileSrcObjID, fileName); // get Minor Object ID depending on
																									// move file to version attribute
			if(majorMinor == null)
				return;
			
			String majorObjectID = majorMinor.get(MAJOR_ID);
			String minorObjectID = majorMinor.get(MINOR_ID);
			
			DomainObject majorObject = new DomainObject(majorObjectID);
			
			if(!canGenerateImageForDocument(context, majorObject, format, fileName))
				return;
			
			boolean isThisPrimary = false;
			
			//If we are updating already existing file (checkout and checkin), remove previous version image from image holder
			String preID = getPreviousRevID(context, minorObjectID);
			if(UIUtil.isNotNullAndNotEmpty(preID))
				isThisPrimary = removeFileFromImageHolder(context, preID, majorObject.getImageObject(context)); 
			
			copyFileAndGenerateImages(context, majorObject, fileSrcObjID, format, fileName, isThisPrimary, args);

		} catch (Exception e) {
			throw new FrameworkException(e);
		}

	}
	
	public Map getMajorMinorID(Context context, String[] args) throws FrameworkException {
		try{
			String versionID = args[0];
			Map <String, String> resultMap = new HashMap<String,String>();
			if(!isValidObjectID(context, versionID) || !isVersionObject(context, versionID)) {
				return null;
			}
			DomainObject currentVerObj = DomainObject.newInstance(context, versionID);
			StringList selects = new StringList();
			selects.add(DomainConstants.SELECT_LAST_ID);
			selects.add("previous.id");
			
			Map verInfo = currentVerObj.getInfo(context, selects);
			if(!versionID.equals(verInfo.get(DomainConstants.SELECT_LAST_ID))) {
				return null; 
			}
			
			String preVerID = (String) verInfo.get("previous.id");
			
			boolean hasPrevRev = UIUtil.isNotNullAndNotEmpty(preVerID);
			resultMap = hasPrevRev ? getMajorMinorIDInDelete(context, preVerID) : getMajorMinorIDInDelete(context, versionID);
			resultMap.put("preVerID", preVerID);
			return resultMap;
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}
	
	@SuppressWarnings("rawtypes")
	public void documentDeleteSyncImageHolder(Context context, String[] args) throws FrameworkException {
		try {
			String currentVerID = args[0];
			//In case of delete this version following is the seq of operations
			//  a. if previous version exist
			//      i.   update Active Version and Latest Version rel to pre ver 
			//      ii.  delete file from major doc (if Move Files To Version is false)
			//      iii. move pre ver file from minor to major doc (if Move Files To Version is false)
			//      iv.  delete the current minor doc
			
			//  b. if pre ver not exist
			//      i.  delete file from major doc (if Move Files To Version is false)
			//      ii. delete the current minor doc
			

			//In case of delete all version following is the seq of operations
			//      i.  delete file from major doc (if Move Files To Version is false)
			//      ii. delete all versions from 1 to n
			
			//We need to proceed for sync only when latest rev is deleted			
			// If the version being deleted is not the latest version return, no need to proceed with the logic
			//In case of delete this version, current docID should be latest version id
			//In case of delete all version, latest version will be deleted at the end
			
			//If it has previous version, then it is the case of delete this version else delete all version
			//If delete this version case - prev version will be connected as AV, delete all case current version will be connected.
			//Map<String, String> majorMinorID = hasPrevRev ? getMajorMinorIDInDelete(context, preVerID) : getMajorMinorIDInDelete(context, currentVerID);
			Map<String, String> majorMinorID = getMajorMinorID(context,args);
			if(majorMinorID == null)
				return;
			
			String majorDocID = majorMinorID.get(MAJOR_ID);
			DomainObject majorDocObj = new DomainObject(majorDocID);
			Image image = majorDocObj.getImageObject(context);
			String preVerID = majorMinorID.get("preVerID");
			boolean hasPrevRev = UIUtil.isNotNullAndNotEmpty(preVerID);
			//Remove file from image holder if it is present in image holder
			boolean isPrimary = removeFileFromImageHolder(context, currentVerID, image);
			
			if(!hasPrevRev)
				return;
			
			boolean isMoveFileToVer = "true".equals(majorMinorID.get(SELECT_MOVE_FILES_TO_VERSION));
			
			currentVerID = preVerID;
			DomainObject currentVerObj = DomainObject.newInstance(context, preVerID);
			
			String fileSrc = isMoveFileToVer ? currentVerID : majorDocID;
			DomainObject fileSrcObj = isMoveFileToVer ? currentVerObj : majorDocObj;
			
			Map<String, String> docFiles = getDocFilesNameFormat(context, fileSrcObj);
			String currentFile = currentVerObj.getInfo(context, CommonDocument.SELECT_TITLE);
			String currentFileFormat = docFiles.get(currentFile);
			
			if(!canGenerateImageForDocument(context, majorDocObj, currentFileFormat, currentFile)) {
				return;
			}
			
			copyFileAndGenerateImages(context, majorDocObj, fileSrc, currentFileFormat, currentFile, isPrimary);
			
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	
	
}
