/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.Map;
import java.util.Set;

import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.domain.util.FrameworkException;

import matrix.db.Context;

/**
 * @deprecated Since R2016x with POA Simplification highlight
 */
@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "deprecation"})
public class AWLMasterCopyListBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	//private static final long serialVersionUID = 3987375468907360008L;
	//private static final String SELECT_RELATIONSHIP_ID = "id[connection]";

	public AWLMasterCopyListBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	/**
	 * Method to replicate the Selective Translations data on MCL revise
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void replicateSelectiveTranslations (Context context, String[] args) throws FrameworkException
	{
		/**
		 * Get the Artwork Masters related to current MCL along with the FP Master Language rel ids
		 * Get the Artwork Masters related to the new MCL along with the MCL Artwork rel id
		 * Iterate the current Artwork Masters list and get the FP Master Language relids list for the current Artwork Master iteration
		 * Get the Artwork Master map from the new MCL Artwork list.
		 * Connect the new MCL Artwork rel ids to the FP Master Language relationship list.
		 */
		/*try {
			String strObjectId = args[0];
			
			StringBuffer sbWhere = new StringBuffer();
			sbWhere.append(DomainObject.getAttributeSelect(AWLAttribute.TRANSLATE.get(context)));
			sbWhere.append(" == ").append(AWLConstants.RANGE_YES);
			
			StringList objectSelects = BusinessUtil.toStringList(SELECT_ID, SELECT_NAME);
			String strSelectiveTranslationRelSelectable = AWLUtil.strcat("frommid[", AWLRel.SKIP_TRANSLATION.get(context), "].torel.id");
			StringList relationshipSelects = BusinessUtil.toStringList(SELECT_RELATIONSHIP_ID,
					strSelectiveTranslationRelSelectable);

			MasterCopyList mcl = new MasterCopyList(strObjectId);
			MapList mclArtworkMasters = mcl.related(AWLType.MASTER_COPY_ELEMENT, AWLRel.MCL_ARTWORK)
											.sel(objectSelects).relSe(relationshipSelects).where(sbWhere.toString()).query(context);

			String strNewMCLId = mcl.getInfo(context, AWLConstants.SELECT_NEXT_ID);
			MasterCopyList newMCL = new MasterCopyList(strNewMCLId);
			MapList revisedMCLArtworkMasterList = newMCL.related(AWLType.MASTER_COPY_ELEMENT, AWLRel.MCL_ARTWORK)
											.sel(objectSelects).relSe(relationshipSelects).where(sbWhere.toString()).query(context);

			ContextUtil.startTransaction(context, true);
			for (Map mclArtworkMaster : (List<Map>) mclArtworkMasters) {
				StringList fpMasterLanguageRelIDList = BusinessUtil.getStringList(mclArtworkMaster,strSelectiveTranslationRelSelectable);
				if (BusinessUtil.isNullOrEmpty(fpMasterLanguageRelIDList))
					continue;
				Map revisedMCLArtworkMaster = BusinessUtil.getMapWithValue(revisedMCLArtworkMasterList, SELECT_NAME,
						BusinessUtil.getString(mclArtworkMaster, SELECT_NAME));
				String mclArtworkMasterRelID = BusinessUtil.getString(revisedMCLArtworkMaster, SELECT_RELATIONSHIP_ID);
				for (String fpMasterLanguageRelID : (List<String>) fpMasterLanguageRelIDList) {
					MqlUtil.mqlCommand(context, "add connection $1 fromrel $2 torel $3", 
							AWLRel.SKIP_TRANSLATION.get(context), mclArtworkMasterRelID, fpMasterLanguageRelID);
				}
			}
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	 * Method to remove the Selective Translations data on MCL Obsolete
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void removeSelectiveTranslations (Context context, String[] args) throws FrameworkException
	{
		/*try {
			String strObjectId = args[0];
			StringBuffer sbWhere = new StringBuffer();
			sbWhere.append(DomainObject.getAttributeSelect(AWLAttribute.TRANSLATE.get(context)));
			sbWhere.append(" == ").append(AWLConstants.RANGE_YES);
			StringList relIdsToDisconnect = new StringList();
			
			StringList objectSelects = BusinessUtil.toStringList(SELECT_ID, SELECT_NAME);
			String strSelectiveTranslationRelSelectable = AWLUtil.strcat("frommid[", AWLRel.SKIP_TRANSLATION.get(context), "].id");
			StringList relationshipSelects = BusinessUtil.toStringList(SELECT_RELATIONSHIP_ID,
					strSelectiveTranslationRelSelectable);
			
			MasterCopyList mcl = new MasterCopyList(strObjectId);
			MapList mclArtworkMasters = mcl.related(AWLType.MASTER_COPY_ELEMENT, AWLRel.INACTIVE_MCL_ARTWORK)
			.sel(objectSelects).relSe(relationshipSelects).where(sbWhere.toString()).query(context);

			ContextUtil.startTransaction(context, true);
			for (Map mclArtworkMaster : (List<Map>)mclArtworkMasters) {
				StringList selectiveTranslationRelIDs = BusinessUtil.getStringList(mclArtworkMaster,strSelectiveTranslationRelSelectable);
				if (BusinessUtil.isNullOrEmpty(selectiveTranslationRelIDs))
					continue;
				relIdsToDisconnect.addAll(selectiveTranslationRelIDs);
			}
			DomainRelationship.disconnect(context, BusinessUtil.toStringArray(relIdsToDisconnect));
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			throw new FrameworkException(e);
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/** Called by Promote Action Trigger on MCL Review state, When MCL moves to release state --> all the Preliminary POAs will be revised
	 * @param   context ,args
 	 * @throws   FrameworkException
	 * @since   AWL2013x.HF1
	 * @author  AA1
	 * @modified Raghavendra M J (R2J)
	 * @return void 
     * Created during POA Synchronization Highlight .
     * Modified during "Enterprise Change Management" 
	 */
	
	public void startPOASynchronization(Context context ,String[] args)throws FrameworkException
	{
		/*String mclID	= getId(context);
		String savedContextUser=PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
		savedContextUser = BusinessUtil.isNullOrEmpty(savedContextUser) ?context.getUser( ):savedContextUser;
		try 
		{
			ContextUtil.startTransaction(context, true);
			if(BusinessUtil.isNotNullOrEmpty(mclID))
			{
				MasterCopyList revisedMCL = new MasterCopyList(mclID);
				MasterCopyList originalMCL=revisedMCL.getPreviousRevision(context, MasterCopyList.class);
				if(originalMCL!=null)
				{
					StringBuilder preliminaryPOAWhereClause= new StringBuilder( SELECT_CURRENT );
				    preliminaryPOAWhereClause.append( " == '" ).append( AWLState.PRELIMINARY.get(context, AWLPolicy.POA) ).append( '\'' );
				    
					List<POA> prelimianryPOATobeRevised=originalMCL.getPOAs(context,preliminaryPOAWhereClause.toString());
					GeneratePOA generatePOA=null;
					Map<ArtworkPackage,String> artPkgesWithRevisedPOA=new HashMap<ArtworkPackage,String>();
					Set<ArtworkPackage> demotedArtworkPackages=new HashSet<ArtworkPackage>();
					Map<String,Set<ArtworkPackage>> poaOwnersWithArtworkPackages=new HashMap<String,Set<ArtworkPackage>>();
					for(POA poaTobeRevised:prelimianryPOATobeRevised)
					{
						// Fetching the Connected "Change Action" Id. 
						Map changeActionDetails = poaTobeRevised.getActiveChangeAction(context);
						
						String poaVault=poaTobeRevised.getInfo(context, SELECT_VAULT);
						String revisedPOAID= (poaTobeRevised.revise(context,poaTobeRevised.getNextSequence(context),poaVault)).getObjectId(context);
						POA revisedPOA=new POA(revisedPOAID);
						
						if(changeActionDetails != null && !changeActionDetails.isEmpty())
						{
							String changeActionID = BusinessUtil.getId(changeActionDetails);
							boolean hasAccess = Access.hasAccess(context, changeActionID, "read,show,modify");
							if(!hasAccess) 
								MqlUtil.mqlCommand(context, "mod bus $1 grant $2 access $3,$4,$5;", true, changeActionID, context.getUser(), 
										"read", "show", "modify");
							DomainRelationship.setToObject(context,  BusinessUtil.getRelationshipId(changeActionDetails), revisedPOA);
							if(!hasAccess) 
								MqlUtil.mqlCommand(context, "mod bus $1 $2 $3 $4 $5 $6;", true, changeActionID, "revoke", "grantor", PropertyUtil.getSchemaProperty(context, "person_UserAgent"), "grantee", context.getUser());
						}
					
						//Generate Assembly for revised POA and demote Artwork Package if required.
						generatePOA=new GeneratePOA();
						ArtworkPackage artworkPackage=revisedPOA.getArtworkPackage(context);

						if(generatePOA.generatePOAsAssembly(context,revisedPOA))
						{ 
							if(artworkPackage.demoteFromWorkInProcess(context))
							{
								demotedArtworkPackages.add(artworkPackage);
							}
						}

						//Make POA Owner list for notification with Artwork Package and POA info.
						String poaOwnerName=revisedPOA.getOwner(context).getName();
						Set<ArtworkPackage> artPkgesUnderPOAOwner=new HashSet<ArtworkPackage>();
						if(poaOwnersWithArtworkPackages.get(poaOwnerName)!=null)
						{
							artPkgesUnderPOAOwner=poaOwnersWithArtworkPackages.get(poaOwnerName);
						}
						artPkgesUnderPOAOwner.add(artworkPackage);
						poaOwnersWithArtworkPackages.put(poaOwnerName, artPkgesUnderPOAOwner);

						//Fill Artwork Package Set
						String previosPOAList="";
						if(artPkgesWithRevisedPOA.get(artworkPackage)!=null)
							previosPOAList=artPkgesWithRevisedPOA.get(artworkPackage);

						previosPOAList = AWLUtil.strcat(previosPOAList, "  ", revisedPOA.getName(context));
						artPkgesWithRevisedPOA.put(artworkPackage, previosPOAList);

					}
					Set<ArtworkPackage> artPkgeSet=artPkgesWithRevisedPOA.keySet();
					//Remove unwanted elements from Artwork Package.
					for(ArtworkPackage artworkPackage:artPkgeSet)
						artworkPackage.disconnectNotRequiredContents(context);
					
					ContextUtil.commitTransaction(context);
					
					String revisedMCLName= revisedMCL.getName(context);
					sendNoticeProcessing(context,poaOwnersWithArtworkPackages,demotedArtworkPackages,artPkgesWithRevisedPOA,revisedMCLName,savedContextUser);
					
				}
			}
		}
		catch (Exception ex) {		
			ContextUtil.abortTransaction(context);
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	//1) Send notification to all Demoted Artwork Package .
	//2) Send notification to all revised POA Owners.
	//3) Alert to Logged-in user for all POAs /Artwork Packages which are impacted.
	/*private void sendNoticeProcessing(Context context ,
			                         Map<String,Set<ArtworkPackage>> poaOwnersWithArtworkPackages,
			                         Set<ArtworkPackage> demotedArtworkPackages,
			                         Map<ArtworkPackage,String> artPkgesWithRevisedPOA,
			                         String revisedMCLName,
			                         String savedContextUser) throws Exception
 	{
		try {
			String needNoticeDefaultValueFromProperty = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.NotifyContextUser.OnReleaseOfRevisedMCL");
			boolean needNoticeForContextUser = "true".equalsIgnoreCase(needNoticeDefaultValueFromProperty);
			
			notifyDemotedArtworkPackageOwner(context, demotedArtworkPackages, artPkgesWithRevisedPOA, revisedMCLName, savedContextUser,needNoticeForContextUser);
			String[] poaAlertInfo=notifyPOAOwners(context, poaOwnersWithArtworkPackages, artPkgesWithRevisedPOA, revisedMCLName, savedContextUser,demotedArtworkPackages,needNoticeForContextUser);
			if(poaAlertInfo.length == 2)
				{
					alertRevisedPOAsInfo(context,poaAlertInfo[0],poaAlertInfo[1],revisedMCLName);
				}
					
		} catch (Exception e) { throw new FrameworkException (e); }
	}*/

	//Send notification to all Demoted Artwork Package .
	
	/*private void notifyDemotedArtworkPackageOwner(Context context,
			                                      Set<ArtworkPackage> demotedArtworkPackages,
			                                      Map<ArtworkPackage,String> artPkgesWithRevisedPOA,
			                                      String revisedMCLName,
			                                      String savedContextUser,
			                                      boolean needNoticeForContextUser) throws Exception
	{
		try
		{
			String[] subjectKeys =  new String[]{"ArtworkPackageName"};
			String[] messageKeys =  new String[]{"CopyListName","POAsNameList","ArtworkPackageName"};
			for(ArtworkPackage artworkPackageForNotification:demotedArtworkPackages)
			{
				StringList toList=artworkPackageForNotification.getInfoList(context, SELECT_OWNER);
				if(toList.size() > 0)
				{
					if(needNoticeForContextUser || (! savedContextUser.equals(toList.get(0))))
					{
						String artworkPackageName=artworkPackageForNotification.getName(context);
						String[] subjectKeyValues = new String[]{artworkPackageName};
						String[] messageKeyValues = new String[]{revisedMCLName, artPkgesWithRevisedPOA.get(artworkPackageForNotification),artworkPackageName};
						//${CLASS:emxMailUtil}.setAgentName(context, new String[]{savedContextUser});
						invokeLocal(context, "emxMailUtil", null, "setAgentName", new String[]{savedContextUser} , Integer.class);
						Map argsMap = new HashMap();
						argsMap.put("toList", toList);
						argsMap.put("ccList", EMPTY_STRINGLIST);
						argsMap.put("bccList", EMPTY_STRINGLIST);
						argsMap.put("subjectKey", "emxAWL.MailSubject.POAAssemblyChanged");
						argsMap.put("subjectKeys", subjectKeys);
						argsMap.put("subjectValues", subjectKeyValues);
						argsMap.put("messageKey","emxAWL.MailMessage.POAAssemblyChanged");
						argsMap.put("messageKeys", messageKeys);
						argsMap.put("messageValues", messageKeyValues);
						argsMap.put("objectIdList", EMPTY_STRINGLIST);
						argsMap.put("companyName", EMPTY_STRING);
						argsMap.put("basePropFile", "emxAWLStringResource");
						//${CLASS:emxMailUtil}.sendNotification(context,toList,null,null,"emxAWL.MailSubject.POAAssemblyChanged",subjectKeys ,subjectKeyValues,"emxAWL.MailMessage.POAAssemblyChanged",messageKeys,messageKeyValues,null, null, "emxAWLStringResource");
						invokeLocal(context, "emxMailUtil", null, "sendNotification", JPO.packArgs(argsMap) , Integer.class);
					}
				}
			}
		}
		catch (Exception e) {
			// Ignore the failure in notification, need not to re throw exception.
			//${CLASS:emxContextUtil}.mqlWarning(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Warning.NotificationSendFailed"));
			MqlUtil.mqlCommand(context, "warning $1", AWLPropertyUtil.getI18NString(context, "emxAWL.Warning.NotificationSendFailed"));
			e.printStackTrace();
		}
	}*/
	//Send notification to all revised POA Owners.
	
	/*private String[] notifyPOAOwners(Context context,
			                         Map<String,Set<ArtworkPackage>> poaOwnersWithArtworkPackages,
			                         Map<ArtworkPackage,String> artPkgesWithRevisedPOA,
			                         String revisedMCLName,
			                         String savedContextUser,
			                         Set<ArtworkPackage> demotedArtworkPackages,
			                         boolean needNoticeForContextUser) throws Exception
	{
		
		String poaInfoOwnebyContextUser="";
		String poaInfoOwnebyOtherUser="";
		try
		{
			Set<String> poaOnwers=poaOwnersWithArtworkPackages.keySet();
			String[] messageKeys =  new String[]{"CopyListName","POAsRevisedInfo"};
			
			String artworkPackageLable= AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource", "emxFramework.Type.Artwork_Package", null);
			
			String poaLable=AWLPropertyUtil.getI18NString(context, "emxAWL.POAs.Lable");
			String demotedLable=AWLPropertyUtil.getI18NString(context, "emxAWL.Lable.Demoted");
			for(String poaOwner:poaOnwers)
			{
				Set<ArtworkPackage> artowkrPkgesUnderOwner=poaOwnersWithArtworkPackages.get(poaOwner);
				String revisedPOAsInfo="";
				for(ArtworkPackage artPkg:artowkrPkgesUnderOwner)
				{
					String artworkPackageName=demotedArtworkPackages.contains(artPkg)?AWLUtil.strcat(artPkg.getName(context), demotedLable):artPkg.getName(context);
					revisedPOAsInfo = AWLUtil.strcat(revisedPOAsInfo,artworkPackageLable," :- ",artworkPackageName, "::",poaLable,artPkgesWithRevisedPOA.get(artPkg), "\n");
				}
				String[] messageKeyValues = new String[]{revisedMCLName, revisedPOAsInfo};
				//Send notification based on context user and default value for same in property key. 
				if(needNoticeForContextUser || (! savedContextUser.equals(poaOwner)))
				{
					StringList toList=new StringList();
					toList.add(poaOwner);
					//${CLASS:emxMailUtil}.setAgentName(context, new String[]{savedContextUser});
					invokeLocal(context, "emxMailUtil", null, "setAgentName", new String[]{savedContextUser} , Integer.class);
					Map argsMap = new HashMap();
					argsMap.put("toList", toList);
					argsMap.put("ccList", EMPTY_STRINGLIST);
					argsMap.put("bccList", EMPTY_STRINGLIST);
					argsMap.put("subjectKey", "emxAWL.MailSubject.POARevised");
					argsMap.put("subjectKeys", new String[]{});
					argsMap.put("subjectValues", new String[]{});
					argsMap.put("messageKey","emxAWL.MailMessage.POARevised");
					argsMap.put("messageKeys", messageKeys);
					argsMap.put("messageValues", messageKeyValues);
					argsMap.put("objectIdList", EMPTY_STRINGLIST);
					argsMap.put("companyName", EMPTY_STRING);
					argsMap.put("basePropFile", "emxAWLStringResource");
					//${CLASS:emxMailUtil}.sendNotification(context,toList,null,null,"emxAWL.MailSubject.POARevised",new String[0] ,new String[0],"emxAWL.MailMessage.POARevised",messageKeys,messageKeyValues,null, null, "emxAWLStringResource");
					invokeLocal(context, "emxMailUtil", null, "sendNotification", JPO.packArgs(argsMap) , Integer.class);
				}
				
				if(poaOwner.equals(savedContextUser))
				{
					poaInfoOwnebyContextUser=revisedPOAsInfo;
				}
				else
				{
					poaInfoOwnebyOtherUser=AWLUtil.strcat(poaInfoOwnebyOtherUser, revisedPOAsInfo);
				}
			}
			
		}
		catch (Exception e) {
			// Ignore the failure in notification, need not to re throw exception.
			//${CLASS:emxContextUtil}.mqlWarning(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Warning.NotificationSendFailed"));
			MqlUtil.mqlCommand(context, "warning $1", AWLPropertyUtil.getI18NString(context, "emxAWL.Warning.NotificationSendFailed"));
			e.printStackTrace();
		}
		return new String[]{poaInfoOwnebyContextUser,poaInfoOwnebyOtherUser};
	}*/
	
	// Alert to Logged-in user for all POAs /Artwork Packages which are impacted.
	
	/*private void alertRevisedPOAsInfo(Context context,
			                          String poaInfoOwnebyContextUser,
			                          String poaInfoOwnebyOtherUser,
			                          String revisedMCLName )throws FrameworkException
	{
		try
		{
			if(BusinessUtil.isNotNullOrEmpty(poaInfoOwnebyContextUser) || BusinessUtil.isNotNullOrEmpty(poaInfoOwnebyOtherUser))
			{
				StringBuilder revisedPOAsInfo=new StringBuilder();
				String NEW_LINE = "\n";
				if(BusinessUtil.isNotNullOrEmpty(poaInfoOwnebyContextUser))
				{
					String ownedByYou=AWLPropertyUtil.getI18NString(context, "emxAWL.Lable.OwnedByYou");
					revisedPOAsInfo.append(NEW_LINE).append(ownedByYou).append(poaInfoOwnebyContextUser);
				}
				if(BusinessUtil.isNotNullOrEmpty(poaInfoOwnebyOtherUser))
				{
					String ownedByOthers=AWLPropertyUtil.getI18NString(context, "emxAWL.Lable.OwnedByOthers");
					revisedPOAsInfo.append(NEW_LINE).append(ownedByOthers).append(poaInfoOwnebyOtherUser);
				}

				String[] messageKeys =  new String[]{"CopyListName","POAsRevisedInfo"};
				String[] messageKeyValues = new String[]{revisedMCLName, revisedPOAsInfo.toString()};
				MqlUtil.mqlCommand(context, "notice $1", MessageUtil.getMessage(context,null,"emxAWL.MailMessage.POARevised",messageKeys,messageKeyValues,null,MessageUtil.getLocale(context),AWLConstants.AWL_STRING_RESOURCE));
			}
		} catch (Exception ex){ throw new FrameworkException(ex); }	
	}*/
	/**
	    * Review - Release Promote check trigger to check POA connected to previous MCL revision.
	    *
	    * @param   context - the eMatrix <code>Context</code> object
	    * @param   args    - holds the parameters
	    * @return  void
	    * @since   AWL R214
	    * @author  B1R
	 * @throws FrameworkException 
	    * */
	public int checkPOAConnectedToPreviousMCLRevision(Context context ,String[] args)throws FrameworkException
	{
		/*try {
			String objectID	= getId(context);
			StringList excludePOAStates = AWLPolicy.POA.getStates(context, AWLState.PRELIMINARY, AWLState.RELEASE, AWLState.OBSOLETE);
			
			MasterCopyList mcl = new MasterCopyList(objectID);
			// Get the previous revision of the MCL
			MasterCopyList prevRevision = mcl.getPreviousRevision(context, MasterCopyList.class);			
			if (prevRevision != null) {
				StringBuffer whereExpr	= new StringBuffer(100);
				if(!excludePOAStates.isEmpty()) {
					int i = 0;
					for (; i < excludePOAStates.size() - 1; i++) {
						whereExpr.append(SELECT_CURRENT).append(" == '").append((String)excludePOAStates.get(i)).append("' || ");
					}
					whereExpr.append(SELECT_CURRENT).append(" == '").append((String)excludePOAStates.get(i)).append('\'');
				}		
				List<POA> poaList = prevRevision.getPOAs(context, whereExpr.toString());
				if(!poaList.isEmpty()){
					//${CLASS:emxContextUtilBase}.mqlNotice(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Message.POAAssociatedToPrevRevision"));
					MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context, "emxAWL.Message.POAAssociatedToPrevRevision"));
					return 1;
				}
			}
			return 0;
		} catch (Exception ex){ throw new FrameworkException(ex); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	    * Review - Release Promote Action trigger to promote previous MCL revision to obsolete state.
	    *
	    * @param   context - the eMatrix <code>Context</code> object
	    * @param   args    - holds the parameters
	    * @return  void
	    * @throws  FrameworkException Exception
	    * @since   AWL R214
	    * @author  B1R
	    * */
	public void promotePreviousMCLRevisionToObsoleteState(Context context ,String[] args)throws FrameworkException
	{
		/*String objectID	= getId(context);
		
		try {
			ContextUtil.startTransaction(context, true);						
			MasterCopyList mcl = new MasterCopyList(objectID);
			// Get the previous revision of the MCL
			MasterCopyList prevRevision = mcl.getPreviousRevision(context, MasterCopyList.class);	
			if (prevRevision != null) {
				// Set previous MCL Revision to Obsolete state
				prevRevision.setState(context, AWLState.OBSOLETE.get(context, AWLPolicy.MCL));
			}
			ContextUtil.commitTransaction(context);
		}
		catch (Exception ex) {
			ContextUtil.abortTransaction(context);
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}*/	
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	    * Release - Obsolete Promote check trigger to check
	    * The latest revision should be in Release state while promoting previous revision to obsolete state.
	    * 
	    * @param   context - the eMatrix <code>Context</code> object
	    * @param   args    - holds the parameters
	    * @return  void
	    * @throws  FrameworkException Exception
	    * @since   AWL R214
	    * @author  B1R
	    * */
	
	public int isLatestMCLRevisionIsInReleaseState(Context context ,String[] args)throws FrameworkException
	{
		/*String objectID	= getId(context);
		
		try {						
			MasterCopyList mcl = new MasterCopyList(objectID);			
			// Get the next MCL revision
			MasterCopyList nextRevision = mcl.getNextRevision(context, MasterCopyList.class);
			if ( nextRevision != null && !AWLState.RELEASE.get(context, AWLPolicy.MCL).equalsIgnoreCase(nextRevision.getInfo(context,DomainConstants.SELECT_CURRENT))) {
				//${CLASS:emxContextUtilBase}.mqlNotice(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Message.LatestRevisionStateCheck"));
				MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context, "emxAWL.Message.LatestRevisionStateCheck"));
				return 1;
			}
			return 0;
		} catch (Exception ex){ throw new FrameworkException(ex); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	    * Release - Obsolete Promote check trigger to check
	    * POAs associated to latest revision of MCL should be in Release/Obsolete state.
	    * 
	    * @param   context - the eMatrix <code>Context</code> object
	    * @param   args    - holds the parameters
	    * @return  void
	    * @throws  FrameworkException Exception
	    * @since   AWL R214
	    * @author  B1R
	    * */
	
	public int isLatestMCLRevisionIsAssociatedToActivePOAs(Context context ,String[] args)throws FrameworkException
	{
		/*String objectID	= getId(context);
		
		try {						
			MasterCopyList mcl = new MasterCopyList(objectID);			
			// Get the next MCL revision, if next rev exitsts then we should not do this check
			if(mcl.getNextRevision(context, MasterCopyList.class) != null){
				return 0;
			}

			StringList excludePOAStates = new StringList(AWLState.RELEASE.get(context, AWLPolicy.POA));
			excludePOAStates.add(AWLState.OBSOLETE.get(context,  AWLPolicy.POA));
			StringList poaStates = BusinessUtil.toStringList(mcl.getPOAsList(context), DomainConstants.SELECT_CURRENT);				
			BusinessUtil.toUniqueList(poaStates);
			poaStates.removeAll(excludePOAStates);
			if(poaStates.size() > 0){
				MqlUtil.mqlCommand(context, "notice $1", AWLPropertyUtil.getI18NString(context, "emxAWL.Message.POAAssociatedToLatestRevision"));
				return 1;
			}
		} catch (Exception ex){ throw new FrameworkException(ex); }
		return 0;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	/**
	    * Release - Obsolete Promote Override trigger to update inactive relationships
	    * from ProductCopyList to InactiveProductCopyList and  
	    * from MCLArtwork rel to InactiveMCLArtwork
	    * 
	    * @param   context - the eMatrix <code>Context</code> object
	    * @param   args    - holds the parameters
	    * @return  void
	    * @throws  FrameworkException Exception
	    * @since   AWL R214
	    * @author  B1R
	    * */
	public void updateInactiveRelationships(Context context ,String[] args)throws FrameworkException
	{
		/*String objectID	= getId(context);
		
		try {
			ContextUtil.startTransaction(context, true);
			MasterCopyList mcl = new MasterCopyList(objectID);
			
			// Update ProductCopyList rel to InactiveProductCopyList rel
			CPGProduct prod = mcl.getProduct(context);
			String pclRelId = prod.getRelationshipId(context, AWLType.MCL, AWLRel.PRODUCT_COPY_LIST, objectID, true);
			
			String pclQuery = "modify connection $1 type $2";
			MqlUtil.mqlCommand(context, pclQuery, pclRelId, AWLRel.INACTIVE_PRODUCT_COPY_LIST.get(context));			
			
			// Update MCLArtwork rel to InactiveMCLArtwork
			MapList amMapList = mcl.getArtworkMasterList(context, null, null, "");
			for(Object amMapObjedt : amMapList){
				Map amMap = (Map) amMapObjedt;
				pclRelId = (String)amMap.get(SELECT_RELATIONSHIP_ID);
				MqlUtil.mqlCommand(context, pclQuery, pclRelId, AWLRel.INACTIVE_MCL_ARTWORK.get(context));
			}			
			ContextUtil.commitTransaction(context);			
		}
		catch (Exception ex) {		
			ContextUtil.abortTransaction(context);
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}	*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
}

