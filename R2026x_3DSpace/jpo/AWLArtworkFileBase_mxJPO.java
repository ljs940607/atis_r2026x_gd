/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import static com.matrixone.apps.awl.util.AWLConstants.MQL_NOTICE;

import java.util.List;
import java.util.Map;

import matrix.db.Context;
import matrix.db.Policy;
import matrix.util.StringList;

import com.dassault_systemes.enovia.changeaction.constants.ChangeActionGenericConstants;
import com.matrixone.apps.awl.dao.ArtworkFile;
import com.matrixone.apps.awl.dao.ArtworkTemplate;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.ConnectorUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.common.util.ImageManagerUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;

import matrix.db.Context;
import matrix.util.StringList;

@SuppressWarnings({ "PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods" })
public class AWLArtworkFileBase_mxJPO extends AWLObject_mxJPO
{

	private static final StringList FORMATS_TO_CHECK = BusinessUtil.toStringList("ai", "svg", "pdf");
	private static final String REVOKE_ACCESS = "mod bus $1 revoke grantor $2 grantee $3;";
	private static final String ARTWORK_FILE_REV = "artworkFileRev";
	private static final String POA_REV = "poaRev";
	private static final String POA_NAME = "poaName";
	private static final String USER = "user";
	private static final String TASK_NAME = "taskName";
	private static final String TEMPLATE_REV = "templateRev";
	private static final String TEMPLATE_NAME = "templateName";
	private static final String ARTWORK_FILE_NAME = "artworkFileName";
	private static final long serialVersionUID = -5150349193448785671L;
	private static final String TO_OPEN = "to[";
	
	
	public AWLArtworkFileBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	 /**
     * This method is used by Action trigger to add the title to the  Artwork File.
     * @param context
     * @param args
     * @throws Exception
     * @author r2j
     */
	public void addTitletoArtworkFile(Context context, String[] args) throws FrameworkException
	{
		try{
			String artworkFileId = args[0];
			ArtworkFile af= new ArtworkFile(artworkFileId);
			String strName =af.getName(context);
			af.setAttributeValue(context,DomainConstants.ATTRIBUTE_TITLE, strName);
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	   public void promoteArtworkFileOnPOAPromote(Context context, String[] args) throws FrameworkException 
	    {
		   try{
			   if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
					throw new IllegalArgumentException();
		    	String poaId     	=  args[0];
		    	String strCurrent   =  args[1];
		    	POA domPOA = new POA(poaId);
		    	MapList connectedArtworkfileList = domPOA.related(AWLType.ARTWORK_FILE, AWLRel.PART_SPECIFICATION).to().sel(DomainObject.SELECT_ID).sel(DomainRelationship.SELECT_NAME).query(context);

		    	if(connectedArtworkfileList.size() > 0)
		    	{
			    	Map connectedArtworkFile = (Map) connectedArtworkfileList.get(0);
			    	String strArtworkFileId = (String)connectedArtworkFile.get("id");
			    	DomainObject domArtworkFile = new DomainObject(strArtworkFileId);
			    	domArtworkFile.setState(context, strCurrent);
			    }
			}catch(Exception e){ throw new FrameworkException(e);}
	    	
	    }
	    public void demoteArtworkFileOnPOAPromote(Context context, String[] args) throws FrameworkException 
	    {
	    	try{
	    		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
					throw new IllegalArgumentException();
		    	String poaId   		= args[0];
		    	String strCurrent   = args[1];
		    	POA domPOA = new POA(poaId);
		    	MapList connectedArtworkfileList = domPOA.related(AWLType.ARTWORK_FILE, AWLRel.PART_SPECIFICATION).to().sel(DomainObject.SELECT_ID).sel(DomainRelationship.SELECT_NAME).query(context);

		    	if(connectedArtworkfileList.size() > 0)
		    	{
		    		if((AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA)).equalsIgnoreCase(strCurrent))
		    			strCurrent = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_FILE.get(context));
			    	Map connectedArtworkFile = (Map) connectedArtworkfileList.get(0);
			    	String strArtworkFileId = (String)connectedArtworkFile.get("id");
			    	DomainObject domArtworkFile = new DomainObject(strArtworkFileId);
			    	domArtworkFile.setState(context, strCurrent);
			    }
	    	}catch(Exception e){ throw new FrameworkException(e);}
	    	
	    }
	    
	    
	    /**
	     * This method will be used by trigger to connect Latest Revision of Artwork File to POA when Artwork File is Revised.
	     * @param context
	     * @param args
	     * @throws FrameworkException 
	     * @author vi5
	     */
	    public void connectRevisedArtworkFileToPOA(Context context, String[] args) throws FrameworkException 
	    {
	    	boolean isContextPushed = false;
	    	try{
	    		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
	    			throw new IllegalArgumentException();
	    		
	    		String artworkFileId   = args[0];
	    		
	    		ArtworkFile artworkFile = new ArtworkFile(artworkFileId);
	    		String policy = artworkFile.getInfo(context, DomainConstants.SELECT_POLICY);
	    		if(PropertyUtil.getSchemaProperty(context, "policy_Version").equals(policy))
	    		{
	    			return;
	    		}
    			ArtworkFile revisiedArtworkFile = artworkFile.getLastRevision(context, ArtworkFile.class);
		    		
	    		String REL_PART_SPECIFICATION = AWLRel.PART_SPECIFICATION.get(context);
	    		String TYPE_POA = AWLType.POA.get(context);
				StringList selectObjects = new StringList(2);
				selectObjects.add(AWLUtil.strcat(TO_OPEN, REL_PART_SPECIFICATION, "].id"));
				selectObjects.add(AWLUtil.strcat(TO_OPEN, REL_PART_SPECIFICATION, "].from[", TYPE_POA, "].id"));

		    		Map  mapArtworkFile = artworkFile.getInfo(context, selectObjects);
		    		String partSpecRelID = (String) mapArtworkFile.get(selectObjects.get(0));
		    		String poaId = (String) mapArtworkFile.get(selectObjects.get(1));
		    		
		    		POA poa = new POA(poaId);
		    		POA latestRevOfPOA = poa.getLastRevision(context, POA.class);


	    				//Fix IR-304898 IR-3049113 - grant and revoke access to Graphic Designer
	    		//Fix IR-359328 Giving modify access because other than GD (who is owner for Image Holder) other people PM/APM can't delete Image Holder connected to POA
				//IR-1290305-3DEXPERIENCER2025x
				//String ctxUSER = context.getUser();
				//MqlUtil.mqlCommand(context, "mod bus $1 grant $2 access $3,$4,$5,$6,$7;" , true, poaId, ctxUSER,"toconnect","todisconnect","fromconnect","fromdisconnect","modify");
		    	   isContextPushed = AWLUtil.pushContextIfNoAccesses(context,poaId,new StringList(new String[] {
		    			   "toconnect","todisconnect","fromconnect","fromdisconnect","modify"
		    	   }));	
		    	   
	    				if(poaId.equals(latestRevOfPOA.getObjectId(context))) {
	    					//IF POA connected to old Artwork File is the latest revision 
	    					// then we need to disconnect old Artwork File from POA, 
							//this is the case for Artwork File revise or Artwork File Revise on Artwork Template Revise
	    					DomainRelationship.disconnect(context, partSpecRelID);
	    				}
	    				
				DomainRelationship.connect(context, latestRevOfPOA, REL_PART_SPECIFICATION, revisiedArtworkFile);
	    				
				disconnectImageHolder(context, latestRevOfPOA, revisiedArtworkFile);
	    				
				//String personUserAgent = PropertyUtil.getSchemaProperty(context, "person_UserAgent");
				//MqlUtil.mqlCommand(context, REVOKE_ACCESS, true, poaId, personUserAgent, ctxUSER);
	    				
	    				
	    		
			} catch (Exception e) {
				e.printStackTrace();
				throw new FrameworkException(e);
			}finally {
				if(isContextPushed) {
					ContextUtil.popContext(context);
				}
			}
	    }
	    
	    //TODO: This should be a separate trigger
	    private void disconnectImageHolder(Context context, POA poa, ArtworkFile artworkFile) throws FrameworkException {
			try {
				String imageHolderId = poa.getImageHolderId(context);
				if(BusinessUtil.isNotNullOrEmpty(imageHolderId)) {
					poa.disconnectFrom(context, AWLRel.IMAGE_HOLDER, new DomainObject(imageHolderId));
				}
				
				imageHolderId = artworkFile.getImageHolderId(context);
				if(BusinessUtil.isNotNullOrEmpty(imageHolderId)) {
					artworkFile.disconnectFrom(context, AWLRel.IMAGE_HOLDER, new DomainObject(imageHolderId));
				}
			} catch(Exception e){ throw new FrameworkException(e);}
			
		}

	    /**
	     * This method is used by Artwork File Preliminary promote check trigger to check whether some file is associated with Artwork File in Revision of Artwork file. 
	     * @param context
	     * @param args
	     * @return 1(If file is not associated) or 0
	     * @throws FrameworkException
	     * @author vi5
	     * modified by N94 2014x code merge
	     */
	    public int checkForFileAvailability(Context context, String[] args) throws FrameworkException 
	    {
	    	try{
	    		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
					throw new IllegalArgumentException();
		    	//If POA is moved from Preliminary to Obsolete because of MCL Revise,Artwork File will also change its state, No need to Check file availability in this case. 
		    	String state = args[1]; 
				if(state.equals(AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_FILE)))
					return 0 ;
		     	String artworkFileId  	    = args[0];
		    	DomainObject artworkFile	= new DomainObject(artworkFileId);
		    	String isFileAssociated = artworkFile.getInfo(context,AWLUtil.strcat("from[", AWLRel.LATEST_VERSION.get(context), "]"));
		    	String errorMessage     = AWLPropertyUtil.getI18NString(context,"emxAWL.ArtworkFile.NoArtworkFileConnected");
		    	if("true".equalsIgnoreCase(isFileAssociated))    	
			    return 0;
		    	//${CLASS:emxContextUtilBase}.mqlError(context , errorMessage);
		    	MqlUtil.mqlCommand(context, "error $1",errorMessage);
		    	return 1;
	    	}catch(Exception e){ throw new FrameworkException(e);}
	    	
	    }
	    /**
	     * This method is used by Check trigger to promote Artwork File from current state to next state in accordance with the POA state.
	     * @param context
	     * @param args
	     * @throws FrameworkException
	     * @author r2j
	     */
		public int checkforPOAState(Context context, String[] args) throws FrameworkException
		{
			try{
				String artworkFileId = args[0];
				String afNextState = args[1];
				ArtworkFile af = new ArtworkFile(artworkFileId);		
				POA poaObj = af.getPOA(context);
				String poaState = poaObj.getInfo(context,DomainConstants.SELECT_CURRENT);
				boolean canPromote = poaObj.getInfo(context, SELECT_REVISION).equals(af.getInfo(context, SELECT_REVISION)) ? poaState.equals(afNextState) :
									 poaState.equals(AWLState.RELEASE.get(context, AWLPolicy.POA));  
				if(!canPromote)
				{
					String message = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.POAStateErrMsg", new String[]{"statename"}, new String[]{afNextState});
					//${CLASS:emxContextUtilBase}.mqlNotice(context , message);
					MqlUtil.mqlCommand(context, "notice $1", message);
					return 1;
				}
				return 0;
			}catch(Exception e){ throw new FrameworkException(e);}
			
		}
	    
	    /**
	     * This method is used by Artwork File Preliminary promote override trigger to create ApprovalRoute For the ArtworkFile if it has more than one revision.
	     * @param context
	     * @param args
	     * @throws FrameworkException
	     * @author vi5
	     * modified by N94 2014x code merge
	     */
	    public void createApprovalRouteForArtworkFile(Context context, String[] args) throws FrameworkException 
	    {
	    	try{
	    		if(POA.isCMEnabled(context))
	    			return;
	    		
	    		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
					throw new IllegalArgumentException();
		    	
		    	String state = args[1]; 
		    	
				String OBSOLETE = AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_FILE);
				if(state.equals(OBSOLETE))
					return ;
		     	String artworkFileId= args[0];
		     	ArtworkFile artFile = new ArtworkFile(artworkFileId);
		    	ArtworkFile firstArtworkFile = artFile.getFirstRevision(context, ArtworkFile.class);
		    	ArtworkFile lastArtworkFile = artFile.getLastRevision(context, ArtworkFile.class);
		    	
		    	// If POA is moved to Review State (GD submit task),then Artwork File wl be moved to review state as well. Since Artwork File not revised..NO need to create routes.
		    	if(firstArtworkFile.equals(lastArtworkFile))
		    		return ;
		    	
		    	DomainObject artworkFile	= new DomainObject(artworkFileId);
		    	DomainObject previousartworkFile=new DomainObject(artworkFile.getPreviousRevision(context));
		     	
		    	
		    	Map selectsMap = BusinessUtil.getInfo (context, previousartworkFile.getId(context),
						 BusinessUtil.toStringList(SELECT_CURRENT,
						 AWLAttribute.BRANCH_TO.getSel(context)));
		        String previousArtworkFileState = (String)selectsMap.get(SELECT_CURRENT);
		        String branchTo = (String)selectsMap.get(AWLAttribute.BRANCH_TO.getSel(context));
		       
		        //Check if artwork file is revised because of MCL Revision, if so don't create Routes
				Boolean startroute = !(previousArtworkFileState.equals(OBSOLETE) && branchTo.equals(OBSOLETE));
		    	if(startroute)
				{
		    		String apOwner = artworkFile.getInfo(context, 
		    				AWLUtil.strcat(TO_OPEN, AWLRel.PART_SPECIFICATION.get(context),"].", "from[", AWLType.POA.get(context), "].to[", AWLRel.ARTWORK_PACKAGE_CONTENT.get(context), "].from.owner"));
		    		RouteUtil.createArtworkRoute(context, apOwner, artworkFileId, false);
				}
	    	}catch(Exception e){ throw new FrameworkException(e);}
	    	
	    }
	    /**
	     * This method is used by  Artwork File Preliminary action trigger to start route for Artwork File if it has more than one revision.
	     * @param context
	     * @param args
	     * @throws FrameworkException
	     * @author vi5
	     * modified by N94 2014x code merge
	     */
	    public void startArtworkApprovalRouteForArtworkFile(Context context, String[] args) throws FrameworkException 
	    {
	    	if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
	    		throw new IllegalArgumentException();
	    	RouteUtil.startArtworkApprovalRoute(context, args[0]);
	    }
	    
	    /**
	     * This method is used by action trigger to promote Artwork File from Approve state to Release state
	     * @param context
	     * @param args
	     * @throws FrameworkException
	     * @author vi5
	     * * modified by r2j 2014x code merge
	     */
	    public void autoReleaseArtworkFileOnApprove(Context context,String[] args) throws FrameworkException
		{
	    	String changeId = context.getCustomData(ChangeActionGenericConstants.customDataChangeIdKey);
			boolean isChangeTemplatePresent = BusinessUtil.isNotNullOrEmpty(changeId);
	    	try{
	    		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
					throw new IllegalArgumentException();
			if (!isChangeTemplatePresent) {
				String artworkFileId = args[0];
				ArtworkFile af = new ArtworkFile(artworkFileId);
				String revision = af.getLastRevision(context).getRevision();
				POA poaObj = af.getPOA(context);
				if (!poaObj.getLastRevision(context).getRevision().equals(revision))
					af.setState(context, AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_FILE));
			}
	    	}catch(Exception e){ throw new FrameworkException(e);}
			
		}
	    /**
	     * This method is used to check that user has revise access for artwork file.
	     * @param context
	     * @param args
	     * @return
	     * @throws FrameworkException
	     */
	    public static boolean hasReviseAccessForArtworkFile(Context context, String[] args)throws FrameworkException
		{
	    	try {
				if (args == null || args.length < 1)
				{
				    throw (new IllegalArgumentException());
				}
				boolean returnValue = false;
				String artworkFileId  = args[0];
				String authoringRouteOwnerID = new ArtworkFile(artworkFileId).getPOA(context).getAuthoringAssigneeId(context); 
				String authoringRouteOwner = BusinessUtil.getInfo(context, authoringRouteOwnerID, "name");
				if(context.getUser().equalsIgnoreCase(authoringRouteOwner))
					returnValue = true;
				return returnValue;
				    		 
	    	} catch (Exception e) {
	    		throw new FrameworkException(e);
	    	}
		}
		/**
		 * This method is used to obsolete the earlier artwork file on Approval for its latest revision
		 * @param context
		 * @param args
		 * @throws FrameworkException
		 * @author vi5
		 */
		public void promoteArtworkFileToObsolete(Context context, String[] args) throws FrameworkException 
	    {
			String changeId = context.getCustomData(ChangeActionGenericConstants.customDataChangeIdKey);
			boolean isChangeTemplatePresent = BusinessUtil.isNotNullOrEmpty(changeId);
			try{
				if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
					throw new IllegalArgumentException();
			if (!isChangeTemplatePresent) {
				String artworkFileId = args[0];
				ArtworkFile artworkFile = new ArtworkFile(artworkFileId);
				ArtworkFile previousArtworkFile = artworkFile.getPreviousRevision(context, ArtworkFile.class);
				if (null != previousArtworkFile)
					previousArtworkFile.setState(context, AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_FILE));
			}
			} catch(Exception e){ throw new FrameworkException(e);}
	    	
	    		
	    }
		
		public void floatNewArtworkFileRevToPackagingPart(Context context, String[] args) throws FrameworkException {
			try {
				if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
					throw new IllegalArgumentException();
		    	String artworkFileId    = args[0];
		    	ArtworkFile artworkFile = new ArtworkFile(artworkFileId);
		    	POA poa = artworkFile.getPOA(context);
		    	poa.floatPackagingPart(context);
			} catch(Exception e){ throw new FrameworkException(e);}
		}
  /**
   * This method is used to notify supplier for associated Artwork File revision
	 * @param context
	 * @param args
	 * @throws FrameworkException 
	 * @author vi5
	*/
  public void notifyPOASupplierOnArtworkFileRevised(Context context, String[] args) throws FrameworkException 
  {
	  try{
		  if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
		
		String artworkFileId   = args[0];
		ArtworkFile artworkFile = new ArtworkFile(artworkFileId);
		ArtworkFile revisedArtworkFile = artworkFile.getNextRevision(context, ArtworkFile.class);

		Object supplierNameList = null;
		if(null != revisedArtworkFile)
		supplierNameList = revisedArtworkFile.getInfoList(context, AWLUtil.strcat(TO_OPEN, AWLRel.PART_SPECIFICATION.get(context), "]", 
							".from.to[", AWLRel.SUPPLIER_POA.get(context), "].from", 
							".from[", AWLRel.ORGANIZATION_REPRESENTATIVE.get(context), "].to.name"));
		
		if(supplierNameList != null)
		{
			String[] mailArguments = new String[7];
			if (supplierNameList instanceof StringList) {
				if(((StringList) supplierNameList).size()==0) return;
				
				if(((StringList) supplierNameList).size()>1)
				{
					mailArguments[0] = FrameworkUtil.join(((StringList) supplierNameList), ",");
				}else{
					mailArguments[0] = (String) ((StringList) supplierNameList).get(0);
				} 
			} else {
				if (((String) supplierNameList).trim().length() > 0) { 
					mailArguments[0] = (String) supplierNameList;
				} else {
					return;
				}
			}
			
			mailArguments[1] = "emxFramework.ProgramObject.eServicecommonInitiateRoute.SubjectBackGroundForArtworkFileRevision";
			mailArguments[2] = "0";
			mailArguments[3] = "emxFramework.ProgramObject.eServicecommonInitiateRoute.MessageNoticeBackGroundForArtworkFileRevision";
			mailArguments[4] = "1";
			mailArguments[5] = "artworkFile";
			mailArguments[6] = AWLUtil.strcat(AWLPropertyUtil.getTypeI18NString(context, AWLType.ARTWORK_FILE.get(context), false),   
								" ", artworkFile.getName(context), " ", artworkFile.getInfo(context, "revision"));
			try
			{
				String  savedContextUser=PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
	            savedContextUser = BusinessUtil.isNullOrEmpty(savedContextUser) ?context.getUser( ):savedContextUser;

				//${CLASS:emxMailUtil}.setAgentName(context, new String[]{savedContextUser});
				invokeLocal(context, "emxMailUtil", null, "setAgentName", new String[]{savedContextUser} , Integer.class);
				//${CLASS:emxMailUtil}.sendNotificationToUser(context,mailArguments);
				invokeLocal(context, "emxMailUtil", null, "sendNotificationToUser", mailArguments , Integer.class);
			}catch (Exception e) {
					//${CLASS:emxContextUtil}.mqlWarning(context, AWLPropertyUtil.getI18NString(context,"emxAWL.Warning.NotificationSendFailed"));
					MqlUtil.mqlCommand(context, "warning $1", AWLPropertyUtil.getI18NString(context,"emxAWL.Warning.NotificationSendFailed"));
			}
			
		}
		}catch(Exception e){ throw new FrameworkException(e);}
		
  	
  }
	public void cloneAFImageHolderToPOA(Context context, String[] args) throws FrameworkException
	{
		
		try
		{
			Map<String, String> majorMinorID = getMajorMinorID(context,args);
			if(majorMinorID == null)
				return;
			String majorAFId = (String) majorMinorID.get("MAJOR_ID");
			if(BusinessUtil.isNotNullOrEmpty(majorAFId))
				args[0] = majorAFId;
			else return;
			cloneImageHolderToPOA(context, args);
		} 
		catch (Exception e) { throw new FrameworkException(e);}
	}
  
  /*
	 * Checkin Trigger Program for Artwork File Type 
	 * For cloning Artwork File Image Holder when file is checked in to Artwork File Type 
	 */
	public void cloneImageHolderToPOA(Context context, String[] args) throws FrameworkException
	{
		boolean isContextPushed = false;
		try {
			String afId = args[0];

			ArtworkFile afObj = new ArtworkFile(afId);
			StringList selects = StringList.create(CommonDocument.SELECT_MOVE_FILES_TO_VERSION,
			                                       AWLUtil.strcat(TO_OPEN, AWLRel.ACTIVE_VERSION.get(context), "].from.id"),
			                                       SELECT_REVISION);
			Map afMap = afObj.getInfo(context, selects);
			//Get ArtworkFile Id based on moveFilesToVersion Attribute
			boolean moveFilesToVersion = "true".equalsIgnoreCase((String)afMap.get(CommonDocument.SELECT_MOVE_FILES_TO_VERSION));
			if(moveFilesToVersion) {
				afId = (String)afMap.get(AWLUtil.strcat(TO_OPEN, AWLRel.ACTIVE_VERSION.get(context), "].from.id"));
				afObj = new ArtworkFile(afId);
			}
			
			POA poaObj = afObj.getPOA(context);
			if(poaObj == null)
				return;

			//Delete current Image Holders of POA 
			String poaId = poaObj.getObjectId(context);
			String poaImgHolderRelId = BusinessUtil.getInfo(context, poaId, AWLUtil.strcat(TO_OPEN, AWLRel.IMAGE_HOLDER.get(context), "].id"));
			//Fix IR-304898 IR-3049113 - grant and revoke access to Graphic Designer
			boolean boolAccess = Access.hasAccess(context, poaId, "modify","toconnect","todisconnect","fromconnect","fromdisconnect");
			if(!boolAccess)
			{
				//MqlUtil.mqlCommand(context, "mod bus $1 grant $2 access $3,$4,$5,$6,$7;" , true, poaId, context.getUser(),"modify","toconnect","todisconnect","fromconnect","fromdisconnect");
				isContextPushed = AWLUtil.pushContextIfNoAccesses(context,poaId ,new StringList(new String[] {"toconnect","todisconnect","fromconnect","fromdisconnect"}));
			}
			if(BusinessUtil.isNotNullOrEmpty(poaImgHolderRelId))
			{
                DomainRelationship.disconnect(context, poaImgHolderRelId);				
			}
			
			//Connect cloned ArtworkFile Image Holder to POA
			String imgHolderId = afObj.getImageHolderId(context);
			if(BusinessUtil.isNotNullOrEmpty(imgHolderId)) {
				DomainObject imageHolderObject = new DomainObject(imgHolderId);
				//clone image holder and connect to POA
				DomainObject imageClone = new DomainObject(imageHolderObject.cloneObject(context, null));
				poaObj.connectFrom(context, AWLRel.IMAGE_HOLDER, new DomainObject(imageClone));
			}
/*			if(!boolAccess)
			{
				MqlUtil.mqlCommand(context, "mod bus $1 revoke grantor $2 grantee $3;", true, poaId, PropertyUtil.getSchemaProperty(context, "person_UserAgent"), context.getUser());
			}
*/			
		} catch (Exception e) { 
			e.printStackTrace();
			throw new FrameworkException(e);
			}	finally {
				if(isContextPushed) {
					ContextUtil.popContext(context);
				}
			}

	}

	/**
	 * It checks for the Selected Artwork Template is in Release state. 
	 * @param   context - the eMatrix <code>Context</code> object
	 * @param   args    - holds the parameters
	 * @return  void
	 * @throws 	FrameworkException
	 * @since   AWL 2015x
	 * @author  Raghavendra M J (R2J)
	 * */
	public int checkArtworkTemplateInReleaseState(Context context,String args[]) throws FrameworkException
	{
		try {
			ArtworkFile artworkFie = new ArtworkFile(getObjectId(context));			
					
			ArtworkTemplate template = artworkFie.getArtworkTemplate(context);
			
			if(template == null)
				return 0;
			
			String templateState = BusinessUtil.getInfo(context, template.getObjectId(context), DomainConstants.SELECT_CURRENT);
	    	boolean isReleased = AWLState.RELEASE.equalsObjectState(context, AWLPolicy.ARTWORK_TEMPLATE, templateState);

			if(!isReleased)
			{
				String alertMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.NotInReleasedState");
				//${CLASS:emxContextUtilBase}.mqlNotice(context, alertMessage);
				MqlUtil.mqlCommand(context, "notice $1", alertMessage);
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * Sends the task deletion notification to the Artwork File Owner when its demoted from Review State.
	 * @param   context - the eMatrix <code>Context</code> object
	 * @param   args    - holds the parameters
	 * @return  void
	 * @throws 	FrameworkException
	 * @since   AWL 2015x
	 * @author  Subbarao G (SY6)
	 * */
	public void deleteActiveApprovalTask (Context context, String[] args) throws FrameworkException
	{
		try {
			String artworkFileId = getObjectId(context);
			String strSubjectKey = args[0];
			String strMessageKey = args[1];
			deleteActiveTask(context, artworkFileId, strSubjectKey, strMessageKey, false);

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	protected void deleteActiveTask(Context context, String artworkFileId, String strSubjectKey, String strMessageKey, boolean authoring)
			throws FrameworkException {
		try{
			Map activeTaskMap = RouteUtil.getActiveTaskByCopy(context, artworkFileId);
			// If the Artwork File has some active routes, delete the route.

			if (activeTaskMap != null && !activeTaskMap.isEmpty()) {
				ArtworkFile artworkFile = new ArtworkFile(artworkFileId);
				
				ArtworkTemplate template = artworkFile.getArtworkTemplate(context);				
				boolean canNotify = template!=null && template.getNextRevision(context)!=null;
				
				if(!canNotify)
					return;
					
				Map temlateInfo = BusinessUtil.getInfo(context, template.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_CURRENT, DomainConstants.SELECT_REVISION));
				
				String[] subjectMessageKeys=new String[]{TASK_NAME, USER};
				String[] subjectKeyValues = {BusinessUtil.getString(activeTaskMap, SELECT_NAME),context.getUser()};
				String strSubject = AWLPropertyUtil.getI18NString(context, strSubjectKey, subjectMessageKeys, subjectKeyValues);
				
				String[] messageKeys=new String[]{ARTWORK_FILE_NAME, TEMPLATE_NAME, TEMPLATE_REV, TASK_NAME, USER};
				String[] messageKeyValues = {artworkFile.getInfo( context, SELECT_NAME), BusinessUtil.getString(temlateInfo, DomainConstants.SELECT_CURRENT),
						BusinessUtil.getString(temlateInfo, DomainConstants.SELECT_REVISION), BusinessUtil.getString(activeTaskMap, SELECT_NAME),context.getUser()};
				
				String strMessage = AWLPropertyUtil.getI18NString(context, strMessageKey, messageKeys, messageKeyValues);
				RouteUtil.deleteActiveRouteByCopy(context, artworkFileId, authoring, strMessage, strSubject);
			}
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	/**
	 *  On Artwork Template Revise, Revises the Released Artwork File and Sends notification to the POA Owner.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @author Subbarao G(SY6)
	 */
	public void notifyPOAOwnerAboutArtworkFileReviseOnArtworkTemplateRevise (Context context, String[] args) throws FrameworkException
	{
		try {
			
			String strSubjectKey = args[0];
			String strMessageKey = args[1];
			
			String artworkFileId  = getId(context);
			String isVersionObject = BusinessUtil.getInfo(context, artworkFileId, CommonDocument.SELECT_IS_VERSION_OBJECT);
			
			if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(isVersionObject))
				return;
			
			ArtworkFile artworkFile = new ArtworkFile(artworkFileId);
			ArtworkFile revisiedArtworkFile = artworkFile.getLastRevision(context, ArtworkFile.class); 
					
			POA poa = revisiedArtworkFile.getPOA(context);
						
			ArtworkTemplate template  = poa.getArtworkTemplate(context);
			
			boolean canNotify = template!=null && template.getNextRevision(context)!=null; 
			if(!canNotify)
				return;
			
			Map poaInfo = BusinessUtil.getInfo(context, poa.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));
			Map artworkFileInfo = BusinessUtil.getInfo(context, artworkFile.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));
			Map templateInfo = BusinessUtil.getInfo(context, template.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));

			String poaName = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_NAME);
			String poaRev = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_REVISION);
			
			String templateName = BusinessUtil.getString(templateInfo, DomainConstants.SELECT_NAME);
			String templateRev = BusinessUtil.getString(templateInfo, DomainConstants.SELECT_REVISION);
			
			String artworkFileName = BusinessUtil.getString(artworkFileInfo, DomainConstants.SELECT_NAME);
			String artworkFileRev = BusinessUtil.getString(artworkFileInfo, DomainConstants.SELECT_REVISION);
			
			String[] subjectKeys = new String[]{ARTWORK_FILE_NAME, ARTWORK_FILE_REV, TEMPLATE_NAME, TEMPLATE_REV};
			String[] subjectKeyValues = new String[]{artworkFileName, artworkFileRev, templateName, templateRev};
			String[] messageKeys = new String[]{POA_NAME, POA_REV, ARTWORK_FILE_NAME, ARTWORK_FILE_REV, TEMPLATE_NAME, TEMPLATE_REV};
			String[] messageKeyValues = new String[]{poaName, poaRev, artworkFileName, artworkFileRev, templateName, templateRev};
			
			strSubjectKey = AWLPropertyUtil.getI18NString(context, strSubjectKey, subjectKeys, subjectKeyValues);
			strMessageKey = AWLPropertyUtil.getI18NString(context, strMessageKey, messageKeys, messageKeyValues);
			
			/*	${CLASS:emxMailUtilBase}.sendNotification( context,
													new StringList(poa.getOwner(context).getName()),
													null,
													null,
													strSubjectKey,
													new String[]{},
													new String[]{},
													strMessageKey,
													new String[]{},
													new String[]{},
													new StringList(),
													null);*/
			sendNotification(context, poa.getOwner(context).getName(), strSubjectKey, strMessageKey);
			
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	
	/**
	 *  On Artwork Template Revise, Review Artwork File will be demoted to Preliminary State. While demoting sends notificaton to the POA and Artwork File Owners.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @author Subbarao G(SY6)
	 */
	public void notifyArtworkFileAndPOAOwnerOnTemplateRevise (Context context, String[] args) throws FrameworkException
	{
		try {
			
			String strSubjectKey = args[0];
			String strMessageKey = args[1];
			
			ArtworkFile artworkFile = new ArtworkFile(getId(context));
			
			
			POA poa = artworkFile.getPOA(context);
			ArtworkTemplate template  = poa.getArtworkTemplate(context);
			boolean canNotify = template!=null && template.getNextRevision(context)!=null; 
			if(!canNotify)
				return;
			
			Map poaInfo = BusinessUtil.getInfo(context, poa.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));
			Map artworkFileInfo = BusinessUtil.getInfo(context, artworkFile.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));
			Map templateInfo = BusinessUtil.getInfo(context, template.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));

			String poaName = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_NAME);
			String poaRev = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_REVISION);
			
			String templateName = BusinessUtil.getString(templateInfo, DomainConstants.SELECT_NAME);
			String templateRev = BusinessUtil.getString(templateInfo, DomainConstants.SELECT_REVISION);
			
			String artworkFileName = BusinessUtil.getString(artworkFileInfo, DomainConstants.SELECT_NAME);
			String artworkFileRev = BusinessUtil.getString(artworkFileInfo, DomainConstants.SELECT_REVISION);
			
			String[] subjectKeys = new String[]{POA_NAME, POA_REV,ARTWORK_FILE_NAME, ARTWORK_FILE_REV, TEMPLATE_NAME, TEMPLATE_REV};
			String[] subjectKeyValues = new String[]{poaName, poaRev, artworkFileName, artworkFileRev, templateName, templateRev};
			String[] messageKeys = new String[]{POA_NAME, POA_REV, ARTWORK_FILE_NAME, ARTWORK_FILE_REV, TEMPLATE_NAME, TEMPLATE_REV};
			String[] messageKeyValues = new String[]{poaName, poaRev, artworkFileName, artworkFileRev, templateName, templateRev};

			StringList ownerList = new StringList(2);
			ownerList.add(poa.getOwner(context).getName());
			ownerList.add(artworkFile.getOwner(context).getName());

			strSubjectKey = AWLPropertyUtil.getI18NString(context, strSubjectKey, subjectKeys, subjectKeyValues);
			strMessageKey = AWLPropertyUtil.getI18NString(context, strMessageKey, messageKeys, messageKeyValues);
			
			/*	${CLASS:emxMailUtilBase}.sendNotification( context,
													BusinessUtil.toUniqueList(ownerList),
													null,
													null,
													strSubjectKey,
													new String[]{},
													new String[]{},
													strMessageKey,
													new String[]{},
													new String[]{},
													new StringList(),
													null);*/
			sendNotification(context, BusinessUtil.toUniqueList(ownerList), strSubjectKey, strMessageKey, EMPTY_STRINGLIST);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	public void connectImageHolderToDocument(Context context, String[] args) throws FrameworkException
	{
		try
		{
			//If no image conversion is configured we can ignore the conversion of file into image.
			//generally checked in file will be ai, without image conversion utility conversion is not possible
			if(BusinessUtil.isNullOrEmpty(AWLPropertyUtil.getConfigPropertyString(context,"emxComponents.ImageManager.ImageUtility.Name")))
			{
				return;
			}
			invokeLocal(context, "emxCPDUtil", null, "connectImageHolderToDocument", args, null);
		} 
		catch (Exception e) { throw new FrameworkException(e);}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int checkForSameFilePresence(Context context, String[] args) throws FrameworkException 
	{
		try
		{
			String artworkFileId = args[0];
			String fileName = args[2];
			String fileExtension = ImageManagerUtil.getFileExtension(fileName);
			
			Map attachedFilesMap =  ConnectorUtil.getAttachedFileNames(context, artworkFileId);
			MapList extensionMap = attachedFilesMap.containsKey(fileExtension) ?(MapList) attachedFilesMap.get(fileExtension) :  null;

			if(BusinessUtil.isNotNullOrEmpty(extensionMap) && extensionMap.size() > 1){
				String message = "\""+fileExtension + "\" "+ AWLPropertyUtil.getI18NString(context,"emxAWL.Warning.CannotUpload");	    	
				MqlUtil.mqlCommand(context, MQL_NOTICE, message);
				return 1;
			}
			return 0;

		} catch(Exception e){ throw new FrameworkException(e);}
	}
	
	public void grantDisconnectAccess(Context context, String args[]) throws FrameworkException 
	{
		boolean isContextPushed = false;
		try	{
			String fromObjectId = args[0];
			String toObjectId = args[1];
			
			String GRANT_ACCESS_MQL = "mod bus $1 grant $2 access fromdisconnect;";
			
			if(BusinessUtil.exists(context, fromObjectId) && !Access.hasAccess(context, fromObjectId, "fromdisconnect")) {
				context.setCustomData(AWLUtil.strcat("fromdisconnect-", fromObjectId), "false");
				//MqlUtil.mqlCommand(context, GRANT_ACCESS_MQL, true, fromObjectId, context.getUser());
				isContextPushed = AWLUtil.pushContextIfNoAccesses(context,fromObjectId ,new StringList(new String[] {"fromdisconnect"}));
			}
				
			
			if(BusinessUtil.exists(context, toObjectId) && !Access.hasAccess(context, toObjectId, "todisconnect")) {
				context.setCustomData(AWLUtil.strcat("todisconnect-", toObjectId), "false");
				MqlUtil.mqlCommand(context, GRANT_ACCESS_MQL, true, toObjectId, context.getUser());
			}
				
			
		} catch(Exception e){ 
			e.printStackTrace();
			throw new FrameworkException(e);
		}finally {
				if(isContextPushed) {
					ContextUtil.popContext(context);
				}
			}
	}
	
	public void revokeDisconnectAccess(Context context, String args[]) throws FrameworkException 
	{
		try
		{
			String fromObjectId = args[0];
			String toObjectId = args[1];
			
			String REVOKE_ACCESS_MQL = "mod bus $1 revoke grantor $2 grantee $3;";
			
			if(BusinessUtil.exists(context, fromObjectId) && Access.hasAccess(context, fromObjectId, "fromdisconnect") && 
					"false".equals(context.getCustomData(AWLUtil.strcat("fromdisconnect-", fromObjectId))))
				MqlUtil.mqlCommand(context, 
								   REVOKE_ACCESS_MQL, 
								   true, 
								   fromObjectId, 
								   PropertyUtil.getSchemaProperty(context,AWLConstants.person_UserAgent), 
								   context.getUser());
			
			if(BusinessUtil.exists(context, toObjectId) && Access.hasAccess(context, toObjectId, "todisconnect") && 
					"false".equals(context.getCustomData(AWLUtil.strcat("todisconnect-" + toObjectId))))
				MqlUtil.mqlCommand(context, 
								   REVOKE_ACCESS_MQL, 
								   true, 
								   toObjectId, 
								   PropertyUtil.getSchemaProperty(context,AWLConstants.person_UserAgent), 
								   context.getUser());
			
		} catch(Exception e){ throw new FrameworkException(e);}
	}
	
	/**
	 *	If Print Ready Artwork is in Review - The system will warn the user that the Print Ready Artwork(s) is in Review state 
 	 *  If  Print Ready Artwork is in Release  - The system will revise the Print Ready Artwork(s) as well.
	 * @param   context - the eMatrix <code>Context</code> object
	 * @param   args    - holds the parameters
	 * @return  int --> Status of the operation.
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   CAP-COR VR2017x.HF02
	 * @author  Raghavendra M J (R2J)
	 * */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public int revisePrintReadyFilesIfReleased(Context context,String args[]) throws FrameworkException
	{
		try 
		{
			String objectId = args[0];
			ArtworkFile artworkFie = new ArtworkFile(objectId);
			
			Policy artworkFiePolicy = artworkFie.getPolicy(context);
			
			if(artworkFiePolicy.getName().equalsIgnoreCase(AWLPolicy.VERSION.get(context)))
				return 0;
			
			POA poaObject = artworkFie.getPOA(context);
			MapList connectedPrintReadyObjects = poaObject.getPrintReadyArtworkObjects(context, new StringList("owner"));
			StringList printReadyArtworksStates = BusinessUtil.toStringList(connectedPrintReadyObjects, DomainConstants.SELECT_CURRENT);

			String preliminaryState = AWLState.PRELIMINARY.get(context, AWLPolicy.PRINT_READY_ARTWORK.get(context));
			String reviewState = AWLState.REVIEW.get(context, AWLPolicy.PRINT_READY_ARTWORK.get(context));
			String releaseState = AWLState.RELEASE.get(context, AWLPolicy.PRINT_READY_ARTWORK.get(context));

			if(printReadyArtworksStates.contains(preliminaryState) || printReadyArtworksStates.contains(reviewState)) 
			{
				/*MqlUtil.mqlCommand(context, MQL_NOTICE, AWLPropertyUtil.getI18NString(context,"emxAWL.Warning.PrintReadyFilesNotReleased"));
				return 1;*/
				throw new FrameworkException(AWLPropertyUtil.getI18NString(context,"emxAWL.Warning.PrintReadyFilesNotReleased"));
				
			} else {
				for (Map printReadyObjectMap :(List<Map>) connectedPrintReadyObjects) 
				{
					String currentState = (String)printReadyObjectMap.get(DomainConstants.SELECT_CURRENT);
					if(releaseState.equalsIgnoreCase(currentState)){
						String printReadyObjectId = (String)printReadyObjectMap.get(DomainConstants.SELECT_ID);
						CommonDocument printReadyDocument = new CommonDocument(printReadyObjectId);
						
						// Print Ready Artwork Revise Command will be invoked so, it will take care of connect and disconnect part.
						printReadyDocument.revise(context, false);
					}
				}
				return 0;
			}
			
		} catch (Exception e) { throw new FrameworkException(e);}
	}
}
