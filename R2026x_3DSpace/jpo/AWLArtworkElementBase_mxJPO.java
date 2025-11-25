/*
 **  Copyright (c) 1992-2020 Dassault Systemes.
 **  All Rights Reserved.
 **  This program contains proprietary and trade secret information of MatrixOne,
 **  Inc.  Copyright notice is precautionary only
 **  and does not evidence any actual or intended publication of such program.
 */

import static com.matrixone.apps.awl.util.AWLConstants.MQL_ERROR;
import static com.matrixone.apps.awl.util.AWLConstants.MQL_NOTICE;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.matrixone.apps.awl.dao.AWLObject;
import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.CustomizationPOA;
import com.matrixone.apps.awl.dao.GraphicDocument;
import com.matrixone.apps.awl.dao.GraphicsElement;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.preferences.AWLGlobalPreference;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUIUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.common.Route;
import com.matrixone.apps.common.util.FormBean;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.Job;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MessageUtil;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.framework.ui.UIRTEUtil;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.BusinessObject;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;

@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods" })
public class AWLArtworkElementBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = 1030038723216105441L;
	private static final String MOD_REVOKE_GRANTOR_GRANTEE = "mod bus $1 revoke grantor $2 grantee $3;";
	private static final String GRANT_MOD_ACCESS_MQL = "mod bus $1 grant $2 access modify;";
	private static final String GRANT_DEMOTE_ACCESS_MQL = "mod bus $1 grant $2 access demote;";
	private static final String GRANT_CHANGEOWNER_ACCESS_MQL = "mod bus $1 grant $2 access ChangeOwner;";
	
	private static final String MQL_CONNECT_WITH_ATTR = "connect bus $1 preserve relationship $2 to $3 $4 $5";
	private static final String MQL_CONNECT = "connect bus $1 preserve relationship $2 to $3";
	private static final String MQL_MODIFY_CONNECT_TO_SIDE = "modify connection $1 to $2";
	
	public AWLArtworkElementBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	/**	
	 * Promotes the 'Master Artwork Element' if the base copy(Artwork Element) is promoted.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void promoteConnectedMasterArtworkElement(Context context,String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();

			String artworkElementId = args[0];
			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
			if(artworkElement.isBaseCopy(context))
			{
				ArtworkMaster artworkMaster = artworkElement.getArtworkMaster(context);
				artworkMaster.promote(context);

				if(artworkElement.isGraphicElement()) {
					GraphicsElement graphicElement = (GraphicsElement)artworkElement;
					GraphicDocument graphicDocument = graphicElement.getGraphicDocument(context);
					graphicDocument.promote(context);
				}   			
			}
		}
		catch (Exception e) { throw new FrameworkException(e);	}
	}

	/**	
	 * Starts Approval process on 'Artwork Element' when authored.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void startApprovalRoute(Context context,String[] args) throws FrameworkException
	{
		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
			throw new IllegalArgumentException();

		String copyId = args[0];
		
		if(BusinessUtil.isKindOf(context, copyId, AWLType.ARTWORK_ELEMENT.get(context))) {
			ArtworkContent content = ArtworkContent.getNewInstance(context, copyId);
			if(content.isStructuredElement(context))
				return;
		}
		
		RouteUtil.startArtworkApprovalRoute(context, copyId);
	}

	/**	
	 * If you promote any 'Master Artwork Element' Object then it checks the corresponding base copy(Artwork Element) is in next state.
	 * Ex: If 'Master Artwork Element' in Preliminary state and promoting this then it checks corresponding 'Artwork Element' is in Review State.
	 * If 'Artwork Element' in Review State then blocks the 'Master Artwork Element' object promotion. 
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */	
	public int compareStateWithBaseContentState(Context context,String[] args) throws FrameworkException
	{
		try
		{
			String masterArtworkElementId     =  args[0];
			String artworkElementState  =  args[1];

			ArtworkMaster artworkMaster = new ArtworkMaster(masterArtworkElementId);
			ArtworkContent artworkElementId	 = artworkMaster.getBaseArtworkElement(context);
			String state     = BusinessUtil.getInfo(context, artworkElementId.getObjectId(context), SELECT_CURRENT);
			if(!state.equals(artworkElementState))
			{		    	   
				String message      = AWLPropertyUtil.getI18NString(context,"emxAWL.CheckCopyContentStateMC.Alert");	    	
				String stateMessage = AWLPropertyUtil.getI18NString(context,"emxFramework.Basic.State");

				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, " ", artworkElementState, " ", stateMessage));
				return 1;
			}
			return 0;
		}
		catch (Exception e) { throw new FrameworkException(e);	}
	}

	/**
	 * Starts Authoring process on LocalCopy when Base Copy(Artwork Element) is approved.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void startLocalCopyAuthuringRoutes(Context context, String[] args) throws FrameworkException
	{
		boolean contextChanged = false;
		try
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String artworkElementBaseCopyId = args[0];
			ArtworkContent artworkElementBaseCopy = ArtworkContent.getNewInstance(context, artworkElementBaseCopyId);

			if(artworkElementBaseCopy.isBaseCopy(context) && artworkElementBaseCopy.isCopyElement())
			{
				String loggedInUser      = PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
				args[1] = BusinessUtil.isNullOrEmpty(loggedInUser) ? context.getUser( ):loggedInUser;

				ArtworkMaster artworkMaster=artworkElementBaseCopy.getArtworkMaster( context );
				Map artworkMasterInfo = artworkMaster.getInfo(context, BusinessUtil.toStringList(SELECT_TYPE, AWLAttribute.MARKETING_NAME.getSel(context)));
				String type = (String) artworkMasterInfo.get(SELECT_TYPE);
				type = AWLPropertyUtil.getTypeI18NString(context, type, false);
				String marketingName = (String) artworkMasterInfo.get(AWLAttribute.MARKETING_NAME.getSel(context));

				String[] msgKey = {"type", "marketingname"};
				String[] msgVal = {type, marketingName};

				String jobTitle      = AWLPropertyUtil.getI18NString(context, "emxAWL.BackgroundJob.Title.LocalCopyAuthoring", msgKey, msgVal);	    	
				String jobDescription= AWLPropertyUtil.getI18NString(context, "emxAWL.BackgroundJob.Description.LocalCopyAuthoring", msgKey, msgVal);

				Job job = new Job("AWLArtworkElement", "startAuthoringRoutesonLocalCopyByJob", args);
				job.setContextObject(artworkElementBaseCopyId);
				job.setTitle(jobTitle);
				job.setDescription(jobDescription);
				//To Reduce Mails and notification, Mark NotifyOwner attribute as NO 
				job.setNotifyOwner(AWLConstants.RANGE_NO);
				job.create(context);

				String jobId=job.getId(context);
				//select latest WIP artwork Package Owner as Job Owner if not present then Artwork Element Owner will be Job Owner.
				String latestArtworkPackageId=artworkElementBaseCopy.getLatestWIPArtworkPackage(context);
				String jobOwner= BusinessUtil.isNotNullOrEmpty(latestArtworkPackageId) ? new ArtworkPackage(latestArtworkPackageId).getOwner(context).getName()
						:artworkElementBaseCopy.getOwner(context).getName();
				MqlUtil.mqlCommand(context, GRANT_CHANGEOWNER_ACCESS_MQL, true, jobId, context.getUser());
				boolean isContextPushed = AWLUtil.pushContextIfNoAccesses(context,jobId ,new StringList(new String[] {"ChangeOwner"}));
				if(isContextPushed)
					contextChanged = true;
					
				job.setOwner( context, jobOwner );
				//MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, jobId, PropertyUtil.getSchemaProperty(context, 	AWLConstants.person_UserAgent), context.getUser());


				//HF-210805V6R2013x_ Pushed context of superuser while submitting job.
				if(!contextChanged)
				ContextUtil.pushContext(context);
				contextChanged = true;
				job.submit(context);
			}
		}
		catch (Exception e) {e.printStackTrace(); throw new FrameworkException(e);	}
		finally{
		    if(contextChanged)
				ContextUtil.popContext(context);
		}
	}

	/**
	 * Starts Authoring process by background job.
	 * 
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 */
	public static void startAuthoringRoutesonLocalCopyByJob(Context context,String args[])throws FrameworkException
	{
		boolean isContextPushed = false;
		try
		{
			String artworkElementBaseCopyId = args[0];
			String loggedInUser=args[1];
			ArtworkContent artworkElementBaseCopy = ArtworkContent.getNewInstance(context, artworkElementBaseCopyId);

			List<ArtworkContent> localCopies = ((CopyElement)artworkElementBaseCopy).getLocalCopies(context);
			try{
				ContextUtil.startTransaction(context, true);
				for (ArtworkContent localCopy : localCopies) {
					RouteUtil.startArtworkAuthoringRoute(context, localCopy.getId(context));
				}
				ContextUtil.commitTransaction(context);
			}
			catch(Exception ex)
			{ex.printStackTrace();
				ContextUtil.abortTransaction(context);
				//Demote Master Copy and Base Copy to Review state 
				//Send notification to all Artwork Package Owners associated with Local Copy. If Artwork Package is not connected then Artwork Element Owner will receive notification. 
				ArtworkMaster artworkMaster = artworkElementBaseCopy.getArtworkMaster( context );

				//MqlUtil.mqlCommand(context, GRANT_DEMOTE_ACCESS_MQL, true, artworkElementBaseCopyId, context.getUser());
				
				isContextPushed = AWLUtil.pushContextIfNoAccesses(context,artworkElementBaseCopyId ,new StringList(new String[] {"demote"}));
			
				artworkElementBaseCopy.demote(context);
				//MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, artworkElementBaseCopyId, PropertyUtil.getSchemaProperty(context, AWLConstants.person_UserAgent), context.getUser());

				String artworkMasterId=artworkMaster.getId(context);
				//MqlUtil.mqlCommand(context, GRANT_DEMOTE_ACCESS_MQL, true, artworkMasterId, context.getUser());
				isContextPushed = AWLUtil.pushContextIfNoAccesses(context,artworkMasterId ,new StringList(new String[] {"demote"}));
				artworkMaster.demote(context);
				//MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, artworkMasterId, PropertyUtil.getSchemaProperty(context, AWLConstants.person_UserAgent), context.getUser());

				String artworkMaster_MarketingName = artworkMaster.getDisplayName( context );

				StringList artworkPackageStates=AWLPolicy.ARTWORK_PACKAGE.getStates(context, AWLState.COMPLETE, AWLState.CANCELLED);
				StringBuilder whereClause=new StringBuilder("current matchlist '");
				whereClause.append(FrameworkUtil.join(artworkPackageStates, ","));
				whereClause.append("' ','");
				StringList selects= StringList.create(SELECT_OWNER, SELECT_CURRENT);
				MapList artworkPakcageList = artworkElementBaseCopy.getArtworkPackagesMapList(context, selects,null, whereClause.toString());

				StringList artworkPackageOwnerList = BusinessUtil.toStringList(artworkPakcageList, SELECT_OWNER);
				String[] mailArguments = new String[13];
				mailArguments[0] = artworkPackageOwnerList.size() >0 ? FrameworkUtil.join(artworkPackageOwnerList, ","):artworkElementBaseCopy.getOwner(context).getName();
				mailArguments[1] = "emxFramework.ProgramObject.eServicecommonInitiateRoute.SubjectBackGround";
				mailArguments[2] = "1";
				mailArguments[3] = "MarketingName";
				mailArguments[4] = artworkMaster_MarketingName;
				mailArguments[5] = "emxFramework.ProgramObject.eServicecommonInitiateRoute.MessageNoticeBackGround";
				mailArguments[6] = "3";
				mailArguments[7] = "CopyContentType";
				mailArguments[8] = artworkElementBaseCopy.getInfo( context, SELECT_TYPE );
				mailArguments[9] = "MarketingName";
				mailArguments[10] = artworkMaster_MarketingName;
				mailArguments[11] = "BaseCopyLink";

				mailArguments[12] = AWLUtil.strcat((String)invokeLocal(context, "emxMailUtil", null, "getBaseURL", args , String.class) ,"?objectId=",artworkElementBaseCopyId );
				invokeLocal(context, "emxMailUtil", null, "setAgentName", new String[]{loggedInUser} , Integer.class);
				invokeLocal(context, "emxMailUtil", null, "sendNotificationToUser", mailArguments , Integer.class);
			}

		}
		catch (Exception e) { e.printStackTrace();
			throw new FrameworkException(e);
			}	finally {
			if(isContextPushed) {
				ContextUtil.popContext(context);
			}
		}
	}

	/**TODO Temporary fix 
	 *  check should be made that an authoring and approval template has been assigned.  If one has not, an error message should be issued to the user and the promote blocked" \
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  N94
	 */
	public int checkConnectedRouteForCopyElement(Context context,String[] args)throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();

			String artworkElementId = args[0];

			ArtworkContent ae = ArtworkContent.getNewInstance(context, artworkElementId);
			if(ae.isStructuredElement(context))
				return 0;

			String approvalTemplateId       = ae.getAuthoringAssigneeId(context);
			String authoringTemplateId       = ae.getApprovalAssigneeId(context);

			if(!BusinessUtil.exists(context, authoringTemplateId) || !BusinessUtil.exists(context, approvalTemplateId))
			{				
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLPropertyUtil.getI18NString(context,"emxAWL.checkConnectedRouteForCopyElement.Alert"));
				return 1;
			}
			return 0;
		}
		catch (Exception e) { throw new FrameworkException(e);	}
	}	

	/**
	 * Checks whether LocalCopy(Artwork Element) state is lower than than the 'Master Artwork Element' state.   
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public int compareStateWithArtworkMasterState(Context context,String[] args)throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();

			String artworkElementId = args[0];
			String artworkElementState = args[1];
			ArtworkContent ae = ArtworkContent.getNewInstance(context, artworkElementId);	

			if(ae.isBaseCopy(context))
				return 0;

			ArtworkMaster masterArtworkElementId = ae.getArtworkMaster(context);
			String masterArtworkElementState = masterArtworkElementId.getInfo(context, SELECT_CURRENT);
			List<String> stateList =  new ArrayList<String>(5);
			stateList.add(AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT));
			stateList.add(AWLState.REVIEW.get(context, AWLPolicy.ARTWORK_ELEMENT));
			stateList.add(AWLState.APPROVED.get(context, AWLPolicy.ARTWORK_ELEMENT));
			stateList.add(AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT));
			stateList.add(AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT));

			int artworkElementIndex    = stateList.indexOf(artworkElementState);
			int masterArtworkElementIndex = stateList.indexOf(masterArtworkElementState);

			if(artworkElementIndex > masterArtworkElementIndex)
			{
				String message      = AWLPropertyUtil.getI18NString(context,"emxAWL.CheckMasterArtworkElementState.Alert");	

				MqlUtil.mqlCommand(context, MQL_NOTICE, message);
				return 1;
			}
			return 0;
		}
		catch (Exception e) { throw new FrameworkException(e);	}
	}


	/**	
	 * Demote's the 'Master Artwork Element' if the base copy(Artwork Element) is demoted.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void demoteConnectedMasterArtworkElement(Context context,String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String artworkElementId = args[0];
			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
			if(!artworkElement.isBaseCopy(context))
				return;

			ArtworkMaster artworkMaster = artworkElement.getArtworkMaster(context);
			artworkMaster.demote(context);

			if(artworkElement.isGraphicElement()) {
				GraphicsElement graphicElement = (GraphicsElement)artworkElement;
				GraphicDocument graphicDocument = graphicElement.getGraphicDocument(context);
				graphicDocument.demote(context);
			}   			
		}
		catch (Exception e) { throw new FrameworkException(e);	}
	}


	/**
	 * Only 'Artwork Element' is connected to the 'Artwork Package' and 'Artwork Element' is in Release state 
	 * then it promotes the 'Artwork Package' to complete state.   
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void promoteArtworkPackage(Context context,String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String artworkElementId    = args[0];
			ArtworkContent ae = ArtworkContent.getNewInstance(context, artworkElementId);
			List<ArtworkPackage> artworkPackagesInWIP = ae.getWIPArtworkPackages(context);

			StringList objSelects   = BusinessUtil.toStringList(SELECT_ID, SELECT_CURRENT);
			for(ArtworkPackage artworkPackage:artworkPackagesInWIP)
			{
				MapList artworkPackageConnectedItems = artworkPackage.getArtworkPackageConnectedItems(context, objSelects);
				StringList stateList    = BusinessUtil.toStringList(artworkPackageConnectedItems, SELECT_CURRENT);
				stateList	= BusinessUtil.toUniqueList(stateList);

				if(stateList.size() == 1 && stateList.contains(AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT)))
				{	
					artworkPackage.promote(context);
				}
			}
		}
		catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 *Content are not allowed to review if,
	 *1)Selected object is not released object.
	 *2)OR if associated local copies are in review states
	 *3)OR if associated POA's are in Artwork In Process /Review state 
	 */
	
	public int canReviseArtwork(Context context, String[] args) throws FrameworkException
	{
		try {
			String artworkContentId = getId( context );
			ArtworkContent artworkContent= ArtworkContent.getNewInstance( context, artworkContentId );
			if(latestRevisionNotIsInReleaseState(context, artworkContent) || 
			   checkLocalCopyInReview(context, artworkContent) || 
			   areAssociatedPOAsDisallowRevise(context, artworkContent) || 
			   !checkHasReviseAccess(context, artworkContent)) 
			{
				return 1;
			}
		} catch (Exception e) { throw new FrameworkException(e); }

		return 0;
	}
	
	/**
	 * Checks for Can it be revised 
	 * @param   context - the enovia <code>Context</code> object
	 * @param   args - String[]   	- Form Input Fields Map
	 * @throws FrameworkException
	 * @author R2J(Raghavendra M J)
	 * @Since VR2018x
	 * Created during 'Nutrition Facts Highlight'
	 */
	public int canReviseStructuredElement(Context context, String[] args) throws FrameworkException
	{
		try 
		{
			String artworkContentId = getId( context );
			
			ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, artworkContentId);
			String currentContentRevision = BusinessUtil.getInfo(context, artworkContentId, "last");

			if(!artworkContent.isStructuredElement(context))
				return 0;

			ArtworkContent structuredElementRoot = artworkContent.getStructuredElementRoot(context);
			String rootRev =  BusinessUtil.getInfo(context, structuredElementRoot.getObjectId(context), "last");

			if(!currentContentRevision.equalsIgnoreCase(rootRev)){
				String errorMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.Revise.Error.MasterStrutureNotInNextRevision");
				MqlUtil.mqlCommand(context, MQL_ERROR ,errorMessage);
				return 1;
			}
		}
		catch (Exception e) { throw new FrameworkException(e); }
		return 0;
	}
	
	/**
	 * Revises the Structure Artwork Element 
	 * @param   context - the enovia <code>Context</code> object
	 * @param   args - String[]   	- Form Input Fields Map
	 * @throws FrameworkException
	 * @author R2J(Raghavendra M J)
	 * @Since VR2018x
	 * Created during 'Nutrition Facts Highlight'
	 */
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void reviseStructuredElementRoot(Context context, String[] args) throws FrameworkException
	{
		try
		{
			ArtworkContent currentContent = ArtworkContent.getNewInstance(context, getObjectId(context).trim());
			if(!currentContent.isStructuredElement(context))
				return;
			
			ArtworkContent structuredElementRoot = currentContent.getStructuredElementRoot(context);
			if(structuredElementRoot==null)
				return;
			
			ArtworkContent revisedStructuredRoot = ArtworkContent.getNewInstance(context, structuredElementRoot.reviseObject(context, true).getObjectId(context));
			
			MapList currentStructureLC = structuredElementRoot.getStructuredElementList(context, false);
			for (Map structure : (List<Map>)currentStructureLC) {
				ArtworkContent currentLocalElement = ArtworkContent.getNewInstance(context, (String) structure.get(SELECT_ID));
				//If it has latest version already don't revise
				String relN = (String) structure.get(DomainRelationship.SELECT_NAME);
				AWLRel rel = AWLRel.STRUCTURED_ARTWORK_ELEMENT.get(context).equals(relN) ? 
						AWLRel.STRUCTURED_ARTWORK_ELEMENT : AWLRel.STRUCTURED_ARTWORK_ELEMENT_PROXY;
				if(!currentLocalElement.isLastRevision(context)) {
					DomainObject revisedElement = new DomainObject(currentLocalElement.getLastRevision(context));
					revisedStructuredRoot.connectTo(context, rel, revisedElement);
					continue;
				}
				BusinessObject revisedElement = currentLocalElement.reviseObject(context, true);
				revisedStructuredRoot.connectTo(context, rel, new DomainObject(revisedElement));
			}
			
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
 
	/**
	 * Connects Structure relations to master 
	 * @param   context - the enovia <code>Context</code> object
	 * @param   args - String[]   	- Form Input Fields Map
	 * @throws FrameworkException
	 * @author R2J(Raghavendra M J)
	 * @Since VR2018x
	 * Created during 'Nutrition Facts Highlight'
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void connectStructuredElementRelations(Context context, String[] args) throws FrameworkException
	{
		try 
		{
			ArtworkContent currentContent = ArtworkContent.getNewInstance(context, getObjectId(context).trim());
			ArtworkMaster currentMaster = currentContent.getArtworkMaster(context);
			
			boolean isBase = currentContent.isBaseCopy(context);
			boolean baseStructureRevise = "true".equals(context.getCustomData("ReviseBaseStructureRoot"));
			
			if(!currentMaster.isStructuredElementRoot(context)) {
						return;
			}			
			
/*			if(!currentMaster.isStructuredElementRoot(context) ||
			   (baseStructureRevise && !isBase)) {
				return;
			}*/			
			
			ArtworkContent revisedContent = ArtworkContent.getNewInstance(context, getLastRevision(context).getObjectId(context));
			ArtworkMaster revisedMaster = revisedContent.getArtworkMaster(context);

			String selMaster = AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "].from.last.id");
			String selLatestID = "last.id";
			
			StringList selects = isBase ? StringList.create(selMaster, selLatestID) : StringList.create(selLatestID);
			
			MapList currentStructureLC = currentContent.getStructuredElementList(context, selects, StringList.create(DomainRelationship.SELECT_NAME), true);
			for (Map structureLC : (List<Map>)currentStructureLC) {
				ArtworkContent lcCurrentStructure = ArtworkContent.getNewInstance(context, (String) structureLC.get(SELECT_ID));
				ArtworkContent lcRevisedStructure = ArtworkContent.getNewInstance(context, (String) structureLC.get(selLatestID));
				String relN = (String) structureLC.get(DomainRelationship.SELECT_NAME);
				AWLRel rel = AWLRel.STRUCTURED_ARTWORK_ELEMENT.get(context).equals(relN) ? 
						AWLRel.STRUCTURED_ARTWORK_ELEMENT : AWLRel.STRUCTURED_ARTWORK_ELEMENT_PROXY;
				revisedContent.connectTo(context, rel, lcRevisedStructure);
				
				if(isBase) {
					ArtworkMaster revisedStructureMaster = new ArtworkMaster((String) structureLC.get(selMaster));
					revisedMaster.connectTo(context, AWLRel.STRUCTURED_ARTWORK_MASTER, revisedStructureMaster);
				}
			}

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}

	
	private boolean checkHasReviseAccess(Context context, ArtworkContent artworkContent) throws FrameworkException
	{
		try {
			if(!Access.hasAccess(context, artworkContent.getObjectId(context), "revise")) {
				String errorMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.Revise.Error.DontHaveReviseAccess");
				MqlUtil.mqlCommand(context, MQL_ERROR ,errorMessage);
				return false;
			}
			if(!artworkContent.isBaseCopy(context) || artworkContent.isGraphicElement()) {
				return true;
			}
			//If it is Base Copy check revise access on local copies also.
			List<ArtworkContent> localCopies = ((CopyElement)artworkContent).getLocalCopies(context);			
			for (ArtworkContent localCopy : localCopies) {  
				if(localCopy.isRelease(context) && !Access.hasAccess(context, localCopy.getObjectId(context), "revise")) {
					String errorMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.Revise.Error.DontHaveLocalCopyReviseAccess");
					MqlUtil.mqlCommand(context, MQL_ERROR ,errorMessage);
					return false;
				}			  
			}				
			return true;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 *This will Verify ,
	 *1)Last revision of object should be release state
	 *2)Asked object should be last object, ie prior to last released objects are not allowed to revise 
	 */
	private boolean latestRevisionNotIsInReleaseState(Context context, ArtworkContent artworkContent) throws FrameworkException
	{
		try {
			StringList objectSelectables = BusinessUtil.toStringList(SELECT_LAST_ID, AWLConstants.SELECT_LAST_CURRENT);

			Map latestArtworkContentInfo = artworkContent.getInfo( context, objectSelectables );
			String artworkContentReleaseState=AWLState.RELEASE.get( context, AWLPolicy.ARTWORK_ELEMENT_CONTENT );
			String errorMessage = "";
			if(!artworkContentReleaseState.equals(latestArtworkContentInfo.get(AWLConstants.SELECT_LAST_CURRENT)))
			{
				errorMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.message.SelectedObjNotInReleaseState");
			}
			else if(!artworkContent.getId( context ).equalsIgnoreCase((String)latestArtworkContentInfo.get(SELECT_LAST_ID)))
			{
				errorMessage =  AWLPropertyUtil.getI18NString(context, "emxAWL.message.SelectedObjNotLatestRevObject");
			}

			if(!errorMessage.isEmpty())
			{
				MqlUtil.mqlCommand(context, MQL_ERROR,errorMessage);
				return true;
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		return false;
	}
	/**
	 *This will Verify that ,
	 *1)Connected POAs should not be Artwork In Process or Review state 
	 */
	private boolean areAssociatedPOAsDisallowRevise(Context context, ArtworkContent artworkContent) throws FrameworkException
	{	
		try {

			String ARTWORK_IN_PROCESS = AWLState.ARTWORK_IN_PROCESS.get( context, AWLPolicy.POA );
			String REVIEW = AWLState.REVIEW.get( context, AWLPolicy.POA );
			String whereExpr = AWLUtil.strcat("(current == \"", REVIEW, "\") || (current == \"", ARTWORK_IN_PROCESS, "\")");
			StringList objSelects = BusinessUtil.toStringList(SELECT_ID, SELECT_NAME);

			MapList poasList = artworkContent.related(AWLType.POA, AWLRel.ARTWORK_ASSEMBLY).from().sel( objSelects ).where( whereExpr ).query(context);

			String poaNamesList = FrameworkUtil.join(BusinessUtil.toStringList(poasList, SELECT_NAME), ",");
			if(!poasList.isEmpty())
			{
				String[] messageKeys = {"poaNames"};
				String[] messageKeyValues = {poaNamesList};
				String errorMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Revise.POAsInAIPOrReview.Error", messageKeys, messageKeyValues);
				MqlUtil.mqlCommand(context, MQL_ERROR ,errorMessage);
				return true;
			}
			return false;

		} catch (Exception e) { throw new FrameworkException(e); }
	}

	/**
	 * Checks whether revise is allowed for MasterCopy content or not.   
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	private boolean checkLocalCopyInReview(Context context, ArtworkContent artworkContent) throws FrameworkException
	{
		try {
			if(!artworkContent.isBaseCopy(context) || artworkContent.isGraphicElement())
				return false;

			List<ArtworkContent> localCopies = ((CopyElement)artworkContent).getLocalCopies(context);
			StringList localCopyTextLangsList = new StringList(localCopies.size());
			StringList artworkPackageIdsList = new StringList(localCopies.size());

			for (ArtworkContent artworkElement : localCopies) 
			{
				if(artworkElement.isReview(context))
				{
					String strLocalCopyTextLang = artworkElement.getInfo(context, AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context));
					localCopyTextLangsList.add(strLocalCopyTextLang);
					String strArtworkPackageId = artworkElement.getFirstArtworkPackage(context);
					if(BusinessUtil.isNotNullOrEmpty(strArtworkPackageId))
						artworkPackageIdsList.add(BusinessUtil.getInfo(context, strArtworkPackageId, SELECT_NAME));
				}
			}

			if(!localCopyTextLangsList.isEmpty())// && !artworkPackageIdsList.isEmpty())
			{
				artworkPackageIdsList = BusinessUtil.toUniqueList(artworkPackageIdsList);
				String strLocalCopyTextLangs = FrameworkUtil.join(localCopyTextLangsList, ",");
				String strArtworkPackages = FrameworkUtil.join(artworkPackageIdsList, ",");

				String artworkElementType = EnoviaResourceBundle.getTypeI18NString(context, artworkContent.getInfo(context, SELECT_TYPE), context.getSession().getLanguage());
				String displayName = artworkContent.getArtworkMaster(context).getInfo(context, AWLAttribute.MARKETING_NAME.getSel(context));

				if(BusinessUtil.isNullOrEmpty(strArtworkPackages))
					strArtworkPackages = "-";
				String[] formatArgs     = {artworkElementType, displayName, strLocalCopyTextLangs, strArtworkPackages};

				String errorMessage  =
						AWLPropertyUtil.getI18NString(context,"emxAWL.MasterCopy.Revise.LocalCopyInReview.Error", 
								new String[]{"AEType", "AEDisplayName", "LCLanguage", "APName"},
								formatArgs);
				context.setCustomData("errormessage", errorMessage); 
				MqlUtil.mqlCommand(context, MQL_ERROR,errorMessage);
				return true;
			}			
			return false;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	public int canReviseListItem(Context context,String[] args)throws FrameworkException
	{
		try {			
			if(!ArtworkContent.isListItemCopy(context, getId(context)))
				return 0;
			ArtworkContent ac = ArtworkContent.getNewInstance(context, getId(context));
			ArtworkMaster  am = ac.getArtworkMaster(context);
			List<ArtworkMaster> compositeMasterList = am.getCompositeMasters(context);
			List<ArtworkContent> compositereviewcopyList = new ArrayList<ArtworkContent>();
			List<ArtworkContent> compositecopyList = new ArrayList<ArtworkContent>();
			for(ArtworkMaster comp: compositeMasterList)
			{
				compositereviewcopyList.addAll(comp.getArtworkElementContent(context, AWLUtil.strcat("current == ", AWLState.REVIEW.get(context,AWLPolicy.ARTWORK_ELEMENT_CONTENT))));
				compositecopyList.addAll(comp.getArtworkElementContent(context,""));
			}
			if(!compositereviewcopyList.isEmpty())
			{
				StringBuffer format = new StringBuffer();
				for(ArtworkContent comp: compositereviewcopyList)
				{
					format.append(comp.getInfo(context, SELECT_NAME));
				}				
				String[] formatArgs     = {format.toString()};

				String errorMessage  =
						AWLPropertyUtil.getI18NString(context, "emxAWL.Revise.CompositeInReview.error", 
								new String[]{"Name"},
								formatArgs);
				context.setCustomData("errormessage", errorMessage); 
				MqlUtil.mqlCommand(context, MQL_ERROR, errorMessage);
				return 1;				
			}

			for(ArtworkContent content : compositecopyList)
			{
				if(areAssociatedPOAsDisallowRevise(context,content))
					return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
	/**
	 * Floats Route to the latest Artwork Element.   
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void floatConnectedArtworkRoutes(Context context,String[] args) throws FrameworkException
	{
		boolean isContextPushed = false;
		try
		{	
			ArtworkContent currentArtworkElement = ArtworkContent.getNewInstance(context, getId(context));

			MapList routeInfoList = currentArtworkElement.getAllRoutes(context);			
			for(Iterator routeItr = routeInfoList.iterator(); routeItr.hasNext();)
			{	
				Map routeInfo = (Map)routeItr.next();				

				String strRTStatusValue      = BusinessUtil.getString(routeInfo, AWLAttribute.ROUTE_STATUS.getSel(context));
				String strRTBasePurposeValue = BusinessUtil.getString(routeInfo, AWLAttribute.ROUTE_BASE_PURPOSE.getSel(context));
				String strRTBaseStateValue   = BusinessUtil.getString(routeInfo, AWLAttribute.ROUTE_BASE_STATE.getSel(context));
				String strRTBasePolicyValue  = BusinessUtil.getString(routeInfo, AWLAttribute.ROUTE_BASE_POLICY.getSel(context));
				String strRTArtworkInfo      = BusinessUtil.getString(routeInfo, AWLAttribute.ARTWORK_INFO.getSel(context));

				if(BusinessUtil.isNotNullOrEmpty(strRTArtworkInfo) && AWLState.RELEASE.toString().equals(strRTBaseStateValue) && 
						(AWLConstants.ROUTE_STATUS_STARTED.equals(strRTStatusValue) || AWLConstants.ROUTE_STATUS_NOT_STARTED.equals(strRTStatusValue)))
				{					


					Map<String, String> attributes = new HashMap<String, String>();
					attributes.put(AWLAttribute.ROUTE_BASE_PURPOSE.get(context), strRTBasePurposeValue);
					attributes.put(AWLAttribute.ROUTE_BASE_POLICY.get(context), strRTBasePolicyValue);

					attributes.put(AWLAttribute.ROUTE_BASE_STATE.get(context), 
							strRTArtworkInfo.contains("Authoring") ? AWLState.PRELIMINARY.toString() : AWLState.REVIEW.toString());

					if(!isContextPushed) {
						ContextUtil.pushContext(context);
						isContextPushed = true;
					}

					ArtworkContent revisedArtworkElement = ArtworkContent.getNewInstance(context, currentArtworkElement.getLastRevision(context).getObjectId());
					String objectRouteRelationshipId  = BusinessUtil.getString(routeInfo, SELECT_RELATIONSHIP_ID);
					DomainRelationship.setFromObject(context, objectRouteRelationshipId, revisedArtworkElement);
					DomainRelationship doObjectRouteRelId = new DomainRelationship(objectRouteRelationshipId);
					doObjectRouteRelId.setAttributeValues(context, attributes);
					String strRouteId = BusinessUtil.getId(routeInfo);
					Route route = new Route(strRouteId);
					route.setAttributeValue(context, AWLAttribute.ROUTE_COMPLETION_ACTION.get(context), AWLConstants.RANGE_PROMOTE_CONNECTED_OBJECT);
					
				}
			}
		}
        catch (Exception e) { throw new FrameworkException(e); }
		finally {
			if(isContextPushed)
				ContextUtil.popContext(context);
		}
	}

	/**
	 * Floats the ArtworkPackage to new revision.   
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void floatArtworkPackageToNewRev(Context context, String args[]) throws FrameworkException
	{
		boolean isContextPushed = false;
		try {
			ArtworkContent currentArtworkElement = ArtworkContent.getNewInstance(context, getId(context));
			String revisedArtworkElementId      = currentArtworkElement.getLastRevision(context).getObjectId();
			ArtworkContent revisedArtworkElement = ArtworkContent.getNewInstance(context, revisedArtworkElementId);

			MapList currentAEArtworkPackagesList = currentArtworkElement.getActiveArtworkPackagesList(context);
			MapList revisedAEArtworkPackageList = revisedArtworkElement.getActiveArtworkPackagesList(context);
			StringList revisedAEArtworkPkgIDList = BusinessUtil.toStringList(revisedAEArtworkPackageList, SELECT_ID);
			for (Map artworkPackageMap : (List<Map>)currentAEArtworkPackagesList) {
				String artworkPackageId = (String)artworkPackageMap.get(SELECT_ID);
				if(revisedAEArtworkPkgIDList.contains(artworkPackageId))
					continue;

				String strRelId = (String)artworkPackageMap.get(SELECT_RELATIONSHIP_ID);

				//MqlUtil.mqlCommand(context, GRANT_MOD_ACCESS_MQL, true, artworkPackageId, context.getUser());
				isContextPushed = AWLUtil.pushContextIfNoAccesses(context,artworkPackageId,new StringList(new String[] {"modify"}));
				DomainRelationship.setToObject(context, strRelId, revisedArtworkElement);
				//MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, artworkPackageId, PropertyUtil.getSchemaProperty(context, AWLConstants.person_UserAgent), context.getUser());
				
			}
		} catch (Exception e) {e.printStackTrace();
			throw new FrameworkException(e);
		}finally {
			if(isContextPushed) {
				ContextUtil.popContext(context);
			}
		}
	}

	/**
	 * It revises the content.   
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	
	
	public void reviseConnectedContent(Context context, String[] args) throws FrameworkException
	{
		try {
			ArtworkContent currentArtworkElement = ArtworkContent.getNewInstance(context, getId(context));

			if(!currentArtworkElement.isBaseCopy(context))
				return ;

			ArtworkMaster currentArtworkMaster = currentArtworkElement.getArtworkMaster(context);
			if(currentArtworkMaster == null)
				return ;

			ArtworkMaster revisedArtworkMaster = new ArtworkMaster(currentArtworkMaster.reviseObject(context, true).getObjectId(context));
			ArtworkContent revisedArtworkElement = ArtworkContent.getNewInstance(context, currentArtworkElement.getNextRevision(context).getObjectId(context));

			revisedArtworkMaster.connectTo(context, AWLRel.ARTWORK_ELEMENT_CONTENT, revisedArtworkElement);

			StringBuffer messageBody = new StringBuffer(150);
			messageBody.append("Master Copy \"").append(currentArtworkElement.getInfo(context, SELECT_TYPE)).append("\" - \"").
			append(currentArtworkElement.getInfo(context, AWLAttribute.MARKETING_NAME.getSel(context))).append("\" content is being modified.").
			append("\", Local Copy authoring cannot be proceed until modified master copy is Approved.");

			String objWhere	 = AWLUtil.strcat("(attribute[", AWLAttribute.IS_BASE_COPY.get(context), "] smatch const ", "\"", AWLObject.RANGE_NO, "\")");			
			MapList localCopyList   = currentArtworkMaster.getArtworkElements(context, StringList.create(DomainConstants.SELECT_CURRENT), null, objWhere);
			
			String revisedLocalCopyContentId = "";
			DomainObject revisedLocalCopyContent = new DomainObject();
			
			String PRELIMINARY = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			for(int i=0;i<localCopyList.size();i++)
			{	
				Map localCopyMap = (Hashtable) localCopyList.get(i);
				String localCopyId = (String)localCopyMap.get(DomainConstants.SELECT_ID);
				String localCopyName = (String)localCopyMap.get(DomainConstants.SELECT_NAME);
				String localCopyState = (String)localCopyMap.get(DomainConstants.SELECT_CURRENT);

				CopyElement localArtworkElement = new CopyElement(localCopyId);
				MapList mAPList = getArtworkPackagesBasedOnCreationDate(context ,localCopyId);			

				if(PRELIMINARY.equals(localCopyState))
				{
					revisedLocalCopyContentId = localCopyId;
					revisedLocalCopyContent.setId(revisedLocalCopyContentId);
					String connectionId = localArtworkElement.getRelationshipId(context, AWLType.MASTER_ARTWORK_ELEMENT,AWLRel.ARTWORK_ELEMENT_CONTENT, currentArtworkMaster.getId(context), false);					
					DomainRelationship.disconnect(context, connectionId);
				} else {										
					revisedLocalCopyContent = DomainObject.newInstance(context, localArtworkElement.reviseObject(context, true));
					UIRTEUtil.setAttributeValue(context, revisedLocalCopyContent.getObjectId(context), AWLAttribute.COPY_TEXT.get(context), "");
					revisedLocalCopyContentId = revisedLocalCopyContent.getObjectId(context);
				}

				StringBuffer subject = new StringBuffer("Local Copy Authoring Task is delted.");
				StringBuffer body = new StringBuffer(100);
				body.append("Authoring Task for Local Copy \"").append(localCopyName)
				.append("\" is being removed for the following reason.\n");
				body.append(messageBody.toString());
				String localCopyAuthoringRouteId = RouteUtil.getConnectedRoute(context, revisedLocalCopyContentId, AWLConstants.LOCAL_COPY_AUTHORING);
				String localCopyApprovalRouteId = RouteUtil.getConnectedRoute(context, revisedLocalCopyContentId, AWLConstants.LOCAL_COPY_APPROVAL);

				if(BusinessUtil.isNotNullOrEmpty(localCopyAuthoringRouteId) && AWLState.INPROCESS.get(context, AWLPolicy.ROUTE).equals(BusinessUtil.getInfo(context, localCopyAuthoringRouteId, DomainConstants.SELECT_CURRENT)))
				{
					String authoringRouteId = RouteUtil.getConnectedRoute(context, revisedLocalCopyContentId, RouteUtil.getArtworkAction(context, localCopyId, true));
					String routeOwner = RouteUtil.getRouteOwner(context, authoringRouteId);
					RouteUtil.deleteActiveRouteByCopy(context, revisedLocalCopyContentId, true, body.toString(), subject.toString());
					RouteUtil.createArtworkRoute(context, routeOwner, revisedLocalCopyContentId, true);
				}

				if(!mAPList.isEmpty() && BusinessUtil.isNullOrEmpty(localCopyAuthoringRouteId) && BusinessUtil.isNullOrEmpty(localCopyApprovalRouteId))
				{
					String lastArtworkPackageId  = BusinessUtil.getString((Map) mAPList.get(0), DomainConstants.SELECT_ID);
					String routeOwner = BusinessUtil.getInfo(context, lastArtworkPackageId, DomainConstants.SELECT_OWNER);
					RouteUtil.createArtworkRoute(context, routeOwner, revisedLocalCopyContentId, true);
					RouteUtil.createArtworkRoute(context, routeOwner, revisedLocalCopyContentId, false);
				}				
				revisedArtworkMaster.connectTo(context, AWLRel.ARTWORK_ELEMENT_CONTENT, revisedLocalCopyContent);				
			}
			artworkMasterFloatOnRevise(context, revisedArtworkMaster);
		} catch (Exception e) { throw new FrameworkException(e); }		
	}

	/**
	 * Floats the POA to new revision.   
	 * @param   context
	 * @param   args
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 * @throws Exception 
	 * @deprecated
	 */
	public void floatPOAToNewRev(Context context, String[] args) throws FrameworkException
	{
		boolean isContextPushed = false;
		try {
			ArtworkContent currentArtworkElement = ArtworkContent.getNewInstance(context, getId(context));
			DomainObject doRevisedArtworkElement= new DomainObject(currentArtworkElement.getNextRevision(context));

			String PRELIMINARY = AWLState.PRELIMINARY.get( context, AWLPolicy.POA );
			String DRAFT = AWLState.DRAFT.get( context, AWLPolicy.POA );
			String objWherePrelimiaryOrDraft = AWLUtil.strcat("(current == \"", PRELIMINARY, "\") || (current == \"", DRAFT, "\")");
			MapList preliminaryPOAs = currentArtworkElement.related(AWLUtil.toArray( AWLType.POA), 
					AWLUtil.toArray(AWLRel.ARTWORK_ASSEMBLY)).
					from().id().relid().state().where(objWherePrelimiaryOrDraft).
					relSel(SELECT_RELATIONSHIP_NAME).
					query(context);
			for (Map poaMap : (List<Map>)preliminaryPOAs) {
				String strRelId = (String)poaMap.get(SELECT_RELATIONSHIP_ID);
				String poaId = (String)poaMap.get(SELECT_ID);
				//MCAU does not have modify access for POA in Preliminary state, Provide Modify Access to MCAU to connect to POA
				//MqlUtil.mqlCommand(context, GRANT_MOD_ACCESS_MQL, true, poaId, context.getUser());
				isContextPushed = AWLUtil.pushContextIfNoAccesses(context,poaId,new StringList(new String[] {"modify"}));
				DomainRelationship.setToObject(context, strRelId,doRevisedArtworkElement );
				//MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, poaId, PropertyUtil.getSchemaProperty(context, AWLConstants.person_UserAgent), context.getUser());
			}

		} catch (Exception e) {e.printStackTrace();
			throw new FrameworkException(e);
		}finally {
			if(isContextPushed) {
				ContextUtil.popContext(context);
			}
		}
	}

	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void floatNewRevInArtworkAssembly(Context context, String[] args) throws FrameworkException
	{
		try {
			String localCopyObjectId = args[0];
			ArtworkContent currentArtworkElement = ArtworkContent.getNewInstance(context, args[0]);
			//Structure element's then skip it
			if(currentArtworkElement.isStructuredElement(context))
				return;
			
			DomainObject doRevisedArtworkElement= new DomainObject(currentArtworkElement.getNextRevision(context));
			floatNewRevInArtworkAssembly(context, currentArtworkElement, doRevisedArtworkElement);
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void floatNewRevInArtworkAssembly(Context context, ArtworkContent currentArtworkElement, DomainObject doRevisedArtworkElement) throws MatrixException, FrameworkException {
		//If structure element then revise sub structure elements			
		
		String localCopyObjectId = currentArtworkElement.getObjectId(context);
		
		StringBuilder objWhere = new StringBuilder(100);
		List<String> clFloatStates = AWLGlobalPreference.getCERevFloatPrefForCL(context);
		String clsToFloat = clFloatStates.stream().map(state -> {
			return new StringBuilder("current").append("==\"").append(state).append("\"").toString();
		}).collect(Collectors.joining("||"));
		
		List<String> poaFloatStates = AWLGlobalPreference.getCERevFloatPrefForPOA(context);
		String poasToFloat = poaFloatStates.stream().map(state -> {
			return new StringBuilder("current").append("==\"").append(state).append("\"").toString();
		}).collect(Collectors.joining("||"));
		
		StringBuilder poasToFloatBuilder = new StringBuilder();
		String currentState = doRevisedArtworkElement.getInfo(context, AWLConstants.CURRENT);
		boolean isReleaseAction = (AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT)).equalsIgnoreCase(currentState);
		if(!isReleaseAction) {
			poasToFloatBuilder = new StringBuilder(poasToFloat);
		}else {
			poasToFloatBuilder = new StringBuilder(poasToFloat).append("||").append("current").append("==\"").append(AWLState.PRELIMINARY.get(context, AWLPolicy.POA)).append("\"");
		}
		objWhere.append("(type").append("==\"").append(AWLType.POA.get(context)).append("\"").append(" && ").append("(").append(poasToFloatBuilder).append(")").append(")")
		.append(" || ")
		.append("(type").append("==\"").append(AWLType.COPY_LIST.get(context)).append("\"").append(" && ").append("(").append(clsToFloat).append(")").append(")");
		
		String kindofCL = AWLUtil.strcat("type.kindof[" , AWLType.COPY_LIST.get(context), "]");
		String atrArtworkBasis = AWLAttribute.ARTWORK_BASIS.getSel(context);
		String ComprisedArtworkAssemblySelects= AWLUtil.strcat("tomid[", AWLRel.COMPRISED_ARTWORK_ASSEMBLY.get(context), "]");
		
		String ctxUser = context.getUser();
		String userAgent = PropertyUtil.getSchemaProperty(context, AWLConstants.person_UserAgent);
		MapList associatedObjs = currentArtworkElement.related(new AWLType[]{AWLType.POA, AWLType.COPY_LIST}, 
				AWLUtil.toArray(AWLRel.ARTWORK_ASSEMBLY)).
				from().id().type().relid().sel("current.access[modify]").state().sel(kindofCL).sel(atrArtworkBasis).
				relSel(SELECT_RELATIONSHIP_NAME).relSel(ComprisedArtworkAssemblySelects).where(objWhere.toString()).
				query(context);
		
			//IR-1285284-3DEXPERIENCER2025x -local copy auth/approval KO
		/*		if(BusinessUtil.isNotNullOrEmpty(associatedObjs)) {
					//Grant modify access on old Rev to update Artwork Assembly Relation attributes
					MqlUtil.mqlCommand(context, GRANT_MOD_ACCESS_MQL, true, localCopyObjectId, ctxUser);
				}
		*/	
		
		String MQL_CONNECT = "connect bus $1 preserve relationship $2 to $3 $4 $5";
		String REL_ARTWORK_ASSEMBLY_HISTORY = AWLRel.ARTWORK_ASSEMBLY_HISTORY.get(context);
		String ATTR_END_EFFECTIVITY_DATE = AWLAttribute.END_EFFECTIVITY_DATE.get(context);
		((List<Map>)associatedObjs).forEach(obj -> {

			boolean isContextPushed = false;
			try {
				String strRelId = (String)obj.get(SELECT_RELATIONSHIP_ID);
				String objId = (String)obj.get(SELECT_ID);
				boolean isCL =  "true".equalsIgnoreCase((String)obj.get(kindofCL));
				boolean hasModify = "true".equalsIgnoreCase((String)obj.get("current.access[modify]"));
				boolean isCustomizationPOA =  AWLConstants.ARTWORK_BASIS_MARKETING_CUSTOMIZATION.equalsIgnoreCase((String)obj.get(atrArtworkBasis));
				boolean isConnectedViaPOA =  false;
				if(isCustomizationPOA){
					StringList comprisedArtwokrAssy = BusinessUtil.getStringList(obj, ComprisedArtworkAssemblySelects);
					comprisedArtwokrAssy = BusinessUtil.toUniqueList(comprisedArtwokrAssy);
					if(comprisedArtwokrAssy.size() >0){
						isConnectedViaPOA = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)comprisedArtwokrAssy.get(0));
					}
				}
				
				//Dont float for customization POAs.
				if(isCustomizationPOA && isConnectedViaPOA)
					return;
				
				//MCAU does not have modify access for POA in Preliminary state, Provide Modify Access to MCAU to connect to POA
				if(!hasModify) {
					//MqlUtil.mqlCommand(context, GRANT_MOD_ACCESS_MQL, true, objId, ctxUser);
					isContextPushed = AWLUtil.pushContextIfNoAccesses(context,objId,new StringList(new String[] {"modify"}));
					
				}
				DomainRelationship.setToObject(context, strRelId,doRevisedArtworkElement );

				if(isCL && !isReleaseAction)
				{
					SimpleDateFormat sdf = new SimpleDateFormat( eMatrixDateFormat.getEMatrixDateFormat(), context.getLocale());			
					String strTodaysDate = sdf.format(new Date());
					//IR-770594-3DEXPERIENCER2021x
					MqlUtil.mqlCommand(context, MQL_CONNECT, objId, REL_ARTWORK_ASSEMBLY_HISTORY, localCopyObjectId, ATTR_END_EFFECTIVITY_DATE, strTodaysDate);
				}
				//if(!hasModify) 	MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, objId, userAgent, ctxUser);
			} catch(Exception e) {e.printStackTrace();
				throw new RuntimeException(e);
			}finally {
				if(isContextPushed) {
					try {
						ContextUtil.popContext(context);
					} catch (FrameworkException e) {
						e.printStackTrace();
					}
				}
			}
		});
	/*	if(BusinessUtil.isNotNullOrEmpty(associatedObjs)) {
			Revoke modify access on old Rev granted to update Artwork Assembly Relation attributes
			MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, localCopyObjectId, userAgent, ctxUser);
		}
		*/
	}


	/**
	 * @param context
	 * @param revisedArtworkMaster
	 * @throws FrameworkException
	 */
	protected void artworkMasterFloatOnRevise(Context context, ArtworkMaster revisedArtworkMaster) throws FrameworkException
	{
		try {
			String oldRevMasterId = revisedArtworkMaster.getPreviousRevision(context).getObjectId(context);
			ArtworkMaster oldArtworkMaster = new ArtworkMaster(oldRevMasterId);

			String kindofPOA = AWLUtil.strcat("type.kindof[" ,AWLType.POA.get(context) , "]");
			String kindofCL = AWLUtil.strcat("type.kindof[" , AWLType.COPY_LIST.get(context), "]");
			String atrArtworkBasisSelects =  AWLAttribute.ARTWORK_BASIS.getSel(context);

			StringList selectablePOA= BusinessUtil.toStringList(kindofPOA,atrArtworkBasisSelects, kindofCL);
			
			MapList artworkMasterObjs = oldArtworkMaster.related(AWLUtil.toArray(AWLType.CPG_PRODUCT, AWLType.PRODUCT_LINE, AWLType.POA, AWLType.COPY_LIST), 
					AWLUtil.toArray(AWLRel.ARTWORK_MASTER, AWLRel.POA_ARTWORK_MASTER, AWLRel.COPY_LIST_ARTWORK_MASTER)).
					from().id().relid().state().
					relSel(SELECT_RELATIONSHIP_NAME).sel(selectablePOA).
					query(context);

			ContextUtil.pushContext(context);
			
			StringList poaStatesToIgnore = new StringList();
			poaStatesToIgnore.add(AWLState.OBSOLETE.get(context, AWLPolicy.POA));
			poaStatesToIgnore.add(AWLState.RELEASE.get(context, AWLPolicy.POA));
			
			StringList clStatesToIgnore = new StringList();
			clStatesToIgnore.add(AWLState.OBSOLETE.get(context, AWLPolicy.COPY_LIST));
			
			for (Map oldArtworkMasterConnectedItem : (List<Map>)artworkMasterObjs) {
				//Modified by N94 during POA Simplification Highlight
				//Should not update Artwork Master on Released and Obsoleted POAs.
				if(AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) oldArtworkMasterConnectedItem.get(kindofPOA)))
				{
					String poaCurrentState = (String) oldArtworkMasterConnectedItem.get(SELECT_CURRENT);
					if(poaStatesToIgnore.contains(poaCurrentState))
					{
						continue;
					}
					boolean isCustomizationPOA =  AWLConstants.ARTWORK_BASIS_MARKETING_CUSTOMIZATION.equalsIgnoreCase((String)oldArtworkMasterConnectedItem.get(atrArtworkBasisSelects));
					if(isCustomizationPOA){
						CustomizationPOA custPOA=new CustomizationPOA(((String)oldArtworkMasterConnectedItem.get(DomainConstants.SELECT_ID)));
						StringList masterIds= custPOA.getArtworkMasterConnectedFromComprisedPOA(context);
						if(masterIds.contains(oldRevMasterId))
							continue;
					}
				} else if(AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) oldArtworkMasterConnectedItem.get(kindofCL))) {
					String clCurrentState = (String) oldArtworkMasterConnectedItem.get(SELECT_CURRENT);
					if(clStatesToIgnore.contains(clCurrentState))
					{
						continue;
					}
				}
				String strRelId = (String)oldArtworkMasterConnectedItem.get(SELECT_RELATIONSHIP_ID);
				DomainRelationship.setToObject(context, strRelId, revisedArtworkMaster);
			}
			
		} catch (Exception e) { throw new FrameworkException(e); }
		finally{
			ContextUtil.popContext(context);
			}
	}

	/**
	 * This method is deprecated in R2015x
	 * @param context
	 * @param args
	 * @throws FrameworkException
	 */
	@Deprecated
	public void startLocalCopyAuthoringRouteByReleasedBaseCopy(Context context, String[] args) throws FrameworkException
	{
		authoringTaskCompleteAction(context, args);
	}
	
	/**
	 * This trigger is invoked on completing the Authoring Task, 
	 * if the task is for other than Artwork Element Authoring this will return without doing any Action.
	 * 
	 * If Artwork Element is base element and in Release state
	 * 		Deletes Approval Task (as the content is not modified)		
	 *      Starts Local Copy Authoring Tasks
	 * If Artwork Element is in Preliminary State
	 *      Checks whether this is the last task in the Route, if yes if same person assigned as Approver if so compeltes Approval Task also.  
	 * 
	 * @param context
	 * @param args
	 * @throws FrameworkException
	 */
	public void authoringTaskCompleteAction(Context context, String[] args) throws FrameworkException {
		if(args.length == 0)
			throw new IllegalArgumentException();

		
		String SELECT_ROUTE_ID = AWLUtil.strcat("from[", AWLRel.ROUTE_TASK.get(context), "].to.id");
		String SELECT_ARTWORK_INFO = AWLAttribute.ARTWORK_INFO.getSel(context);
		String SELECT_ROUTE_ACTION = DomainObject.getAttributeSelect(ATTRIBUTE_ROUTE_ACTION);
		String SELECT_ROUTE_BASE_PURPOSE = DomainObject.getAttributeSelect(ATTRIBUTE_ROUTE_BASE_PURPOSE);
		
		String taskId   = args[0];
		Map taskInfo	= BusinessUtil.getInfo(context, taskId, 
											   BusinessUtil.toStringList(SELECT_ROUTE_ID, SELECT_ROUTE_ACTION));
		
		String routeId  = (String) taskInfo.get(SELECT_ROUTE_ID);
		Map routeInfo   = BusinessUtil.getInfo(context, routeId, 
				                               BusinessUtil.toStringList(SELECT_ARTWORK_INFO, SELECT_CURRENT, SELECT_ROUTE_BASE_PURPOSE));
		
		if(!RouteUtil.isArtworkElementAuthroing((String) routeInfo.get(SELECT_ARTWORK_INFO)) || 
		   !AWLState.COMPLETE.get(context, AWLPolicy.ROUTE).equals(routeInfo.get(SELECT_CURRENT))) {
			return;
		}
		
		MapList copy = RouteUtil.getCopyByTask(context, taskId);
		if(copy.size() !=1) {
			return;
		}
		
		Map copyMap		 = (Map)copy.get(0);
		String copyId 	 = BusinessUtil.getId(copyMap);
		String copyState 	 = BusinessUtil.getCurrentState(copyMap);
		ArtworkContent ac = ArtworkContent.getNewInstance(context, copyId);
		
		boolean isInRelease = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT).equals(copyState);
		
		//String taskType = (String) taskInfo.get(SELECT_ROUTE_ACTION);
		String routeBasePurpose = (String) routeInfo.get(SELECT_ROUTE_BASE_PURPOSE);
		if(isInRelease) {
			deleteApprovalRoute(context, ac);
			startLocalCopyAuthoringRoutes(context, ac);
		} else if(RouteUtil.ROUTE_APPROVAL.equals(routeBasePurpose)){
			autoCompleteApprovalTask(context, ac);
		}		
	}
	
	private void autoCompleteApprovalTask(Context context, ArtworkContent ac) throws FrameworkException {
		try {
			String artworkElementId = ac.getId(context);
			Map approvalTask = RouteUtil.getApprovalTaskToSubmit(context, artworkElementId);
			if(approvalTask != null)
			{			
				String aprouteId = BusinessUtil.getString(approvalTask, RouteUtil.ROUTE_ID);
				StringList routeNodes = BusinessUtil.getInfoList(context, aprouteId,
										AWLUtil.strcat("from[", AWLRel.ROUTE_NODE.get(context), "].to.id"));
				boolean authorAndApproversAreSame = context.getUser().toString().equalsIgnoreCase(
						BusinessUtil.getString(approvalTask, DomainConstants.SELECT_OWNER));

				if(routeNodes.size() == 1 && authorAndApproversAreSame) {
					String aptaskId    = BusinessUtil.getId(approvalTask);

					String apstatus    = AWLConstants.ROUTE_ACTION_APPROVE;
					String apcomments  = "Auto Approved on completion of Authoring as Author and Approver are same";
					//TODO Need to fix the Time Zone
					RouteUtil.CompleteInboxTask(context, aptaskId, apcomments, apstatus, context.getSession().getLanguage(), 
							getTimeZone(context));
					
					String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ApprovalRoute.Alert");
					MqlUtil.mqlCommand(context, MQL_NOTICE, strMessage);
				}
			}				
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	private double getTimeZone(Context context) {
		try {
			String timeZone = context.getCustomData("timeZone");
			if(BusinessUtil.isNullOrEmpty(timeZone)) {
				timeZone = context.getTimezone();
				TimeZone tz = TimeZone.getTimeZone(timeZone);
			    Calendar cal = GregorianCalendar.getInstance(tz);
			    int offsetInMillis = tz.getOffset(cal.getTimeInMillis());

			    String offset = String.format("%02d:%02d", Math.abs(offsetInMillis / 3600000), Math.abs((offsetInMillis / 60000) % 60));
			    timeZone = (offsetInMillis >= 0 ? "+" : "-") + offset;
			}
			return Double.parseDouble(timeZone);
		} catch (Exception e) {
			return 0.0;
		}
	}
	
	private void startLocalCopyAuthoringRoutes(Context context, ArtworkContent ac) throws FrameworkException {
		if(!ac.isBaseCopy(context) || ac.isGraphicElement())
			return;
		ArtworkMaster am = ac.getArtworkMaster(context);							
		String objWhere	 = AWLUtil.strcat("(attribute[", AWLAttribute.IS_BASE_COPY.get(context), "] smatch const ", "\"", AWLConstants.RANGE_NO, "\")");
		List<ArtworkContent> localArtworkContentList = am.getArtworkElementContent(context, objWhere);
		for(ArtworkContent lac : localArtworkContentList) {
			RouteUtil.startArtworkAuthoringRoute(context, lac.getId(context));
		}
	}

	private void deleteApprovalRoute(Context context, ArtworkContent ac) throws FrameworkException {
		try {
			String artworkElementId = ac.getObjectId(context);
			String approvalRouteId = RouteUtil.getConnectedRoute(context, artworkElementId, 
									       RouteUtil.getArtworkAction(context, artworkElementId, false));
			if(BusinessUtil.isNullOrEmpty(approvalRouteId)) {
				return;
			}

			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
			ArtworkMaster artworkMaster=artworkElement.getArtworkMaster( context );
			//Fix IR-236454V6R2014x
			Route routeObj = new Route(approvalRouteId);
			String routeDelSub = AWLUtil.strcat("Route Task Delete Notification :", routeObj.getInfo(context, SELECT_NAME));
			String routeDelMessage = AWLUtil.strcat("Approval not required for Artwork Element ",
					artworkMaster.getDisplayName( context ),
					", author has not modified the content.");
			RouteUtil.deleteActiveRouteByCopy(context, artworkElementId, false, routeDelMessage, routeDelSub);	
		} catch (Exception e) {	throw new FrameworkException(e); }
	}

	public int checkEmptyCopyText(Context context, String[] args) throws FrameworkException
	{
		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
			throw new IllegalArgumentException();
		try {
			String copyContentId = args[0];
			ArtworkContent ac = ArtworkContent.getNewInstance(context, copyContentId);
			if(BusinessUtil.isKindOf(context, copyContentId, AWLType.COPY_ELEMENT.get(context))) {
				
				if(ac.isStructuredElementRoot(context))
					return 0;
				
				String strCopyText = BusinessUtil.getInfo(context, copyContentId,
						DomainObject.getAttributeSelect(AWLAttribute.COPY_TEXT.get(context)));	
				if(BusinessUtil.isNullOrEmpty(strCopyText)){
					String errorMessage  = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.CopyText");
					MqlUtil.mqlCommand(context, MQL_ERROR,errorMessage);
					return 1;
				}
			} else if(ac.isGraphicElement()) {
				GraphicsElement ge = new GraphicsElement(copyContentId);
				GraphicDocument gdoc = ge.getGraphicDocument(context);
				MapList activeFilesList = gdoc.related(new AWLType[]{AWLType.GRAPHIC_DOC, AWLType.PHOTO_DOC, AWLType.SYMBOL_DOC}, 
						new AWLRel[]{AWLRel.ACTIVE_VERSION}).query(context);
				if(activeFilesList.size()==0) {
					String strAlert =  AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.GraphicNoFiles");
					MqlUtil.mqlCommand(context, MQL_NOTICE, strAlert);
					return 1;
				}
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		
		return 0;
	}
	/**
	 * This will gives the list of Artwork Packages Based on Creation Date
	 * 
	 * @param   context            - the enovia <code>Context</code> object
	 * @param   contentId - String - Copy Content Id	 
	 * @return  MapList - returns the Artwork Package Ids in the order of creation.
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	private MapList getArtworkPackagesBasedOnCreationDate(Context context ,String contentId)throws FrameworkException
	{
		try
		{
			CopyElement copy = new CopyElement(contentId);
			String PRELIMINARY = AWLState.PRELIMINARY.get( context, AWLPolicy.POA );
			String DRAFT = AWLState.DRAFT.get( context, AWLPolicy.POA );
			String where = AWLUtil.strcat("(current == \"", PRELIMINARY, "\") || (current == \"", DRAFT, "\")");				
			List<POA> activePOAs = copy.related(AWLType.POA, AWLRel.ARTWORK_ASSEMBLY).id().from().where(where).query(context,POA.class);

			if(activePOAs.isEmpty())
				return new MapList();

			where = AWLUtil.strcat("current == '" ,AWLState.WORK_IN_PROCESS.get(context, AWLPolicy.ARTWORK_PACKAGE) ,"'");
			MapList apList = new MapList();
			for(POA poa :activePOAs)
			{
				apList.addAll(poa.related(AWLType.ARTWORK_PACKAGE, AWLRel.ARTWORK_PACKAGE_CONTENT).id().from().sel(DomainConstants.SELECT_ORIGINATED).where(where).query(context));
			}
			BusinessUtil.toUniqueMapList(apList);		
			apList.sort(DomainConstants.SELECT_ORIGINATED, null, "date");
			return apList;
		}
		catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 * This will invoke once List Items is Approved by Master/Local Copy Approver.
	 * 		- Updating the associated Language Composite Copy
	 * 		- Will Revise the Composite Copy Content if it is Release State
	 * 		- Starting the Routes on the Local List Item if content is Base List Item
	 * 		- Staring the Composite Copy Routes depending on the condtions.
	 * 
	 * @param   context            - the enovia <code>Context</code> object
	 * @param   args - String[] - 
	 * @param 	ConstructorArgs - String - List Item Copy Content Id	 
	 * @return  void
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	public void updateCompositeCopyOnListItemApprove(Context context,String[] args)throws FrameworkException
	{
		boolean isContextPushed = false;
		try{			
			ArtworkContent ac = ArtworkContent.getNewInstance(context,getId(context));		

			if(!ac.isKindOf(context, AWLType.LIST_ITEM_COPY))
				return;

			String owner 	= ac.getOwner(context).toString();
			String lang     = ac.getAttributeValue(context, AWLAttribute.COPY_TEXT_LANGUAGE.get(context));				

			ContextUtil.pushContext(context, owner, "",context.getVault().getName());
			isContextPushed = true;
			ArtworkMaster newmasterlistitem =  ac.getArtworkMaster(context);				

			String prevId = newmasterlistitem.getInfo(context, AWLConstants.PREVIOUS_ID);
			ArtworkMaster masterlistitem = ac.isBaseCopy(context) && BusinessUtil.isNotNullOrEmpty(prevId) ?  
					new ArtworkMaster(prevId) :newmasterlistitem ;


					MapList compositeList = masterlistitem.related(AWLType.MASTER_ARTWORK_ELEMENT, AWLRel.SELECTED_LIST_ITEM).id().
							from().relid().relAttr(AWLUtil.toArray(AWLAttribute.LIST_ITEM_SEQUENCE,AWLAttribute.ADDITIONAL_INFO)).query(context);

					for(int i=0;i<compositeList.size();i++)
					{					
						Map hmap = (Hashtable) compositeList.get(i);
						String id = (String) hmap.get(DomainConstants.SELECT_ID);
						String relid = (String) hmap.get(DomainRelationship.SELECT_ID);
						HashMap<String,String> attributeMap = new HashMap<String,String>();
						attributeMap.put(AWLAttribute.LIST_ITEM_SEQUENCE.get(context),(String) hmap.get(AWLAttribute.LIST_ITEM_SEQUENCE.getSel(context)));
						attributeMap.put(AWLAttribute.ADDITIONAL_INFO.get(context), (String)hmap.get(AWLAttribute.ADDITIONAL_INFO.getSel(context)));

						ArtworkMaster comp = new ArtworkMaster(id);
						String objWhere	 = AWLUtil.strcat("(attribute[" , AWLAttribute.COPY_TEXT_LANGUAGE.get(context) , "].value == " , "\"" , lang , "\")"); 

						List<ArtworkContent> compList = comp.getArtworkElementContent(context, objWhere);
						if(!compList.isEmpty()&& compList.size()==1)
						{
							CopyElement compcopy = (CopyElement) compList.get(0);
							if(compcopy.isRelease(context))
							{	
								CopyElement revisedCopy = null;
								if(compcopy.isBaseCopy(context))
								{							
									revisedCopy = new CopyElement(compcopy.reviseObject(context, false));
									ArtworkMaster revisedMaster = new ArtworkMaster(comp.getLastRevision(context));
									DomainRelationship.disconnect(context, relid);
									DomainRelationship dr = DomainRelationship.connect(context, revisedMaster, AWLRel.SELECTED_LIST_ITEM.get(context), newmasterlistitem);
									dr.setAttributeValues(context, attributeMap);
									revisedMaster.setCompositeCopyText(context, lang);
									List<ArtworkContent> copyElemnts = revisedMaster.getArtworkElementContent(context, "");
									//There are some use cases like base copy will not be connected to poa....
									boolean startBaseAuthoringtRote = false;
									ArtworkContent baseArtworkElement =  revisedMaster.getBaseArtworkElement(context);
									for(ArtworkContent copy: copyElemnts)							
									{
										CopyElement ce = (CopyElement) copy;
										MapList mWIPAPList = getArtworkPackagesBasedOnCreationDate(context,ce.getId(context));
										if((!ce.isBaseCopy(context) && !mWIPAPList.isEmpty())) {	
											checkAndCreateRoutesOnOutsideArtworkPackage(context, copy.getId(context),owner);
											startBaseAuthoringtRote = true;
										}
									}
									//what to do if the basecopy do not have any localcopies?
									if(startBaseAuthoringtRote) {
										checkAndCreateRoutesOnOutsideArtworkPackage(context, baseArtworkElement.getId(context),owner);
										RouteUtil.startArtworkAuthoringRoute(context, revisedCopy.getId(context));							
										compcopy = revisedCopy;
									}
								}
								else
								{
									comp.setCompositeCopyText(context, lang);									
									revisedCopy   =  (CopyElement) comp.getArtworkElementContent(context, objWhere).get(0);
									MapList mWIPAPList = getArtworkPackagesBasedOnCreationDate(context,revisedCopy.getId(context));
									if(!mWIPAPList.isEmpty())
									{																	
										checkAndCreateRoutesOnOutsideArtworkPackage(context, revisedCopy.getId(context),owner);
										RouteUtil.startArtworkAuthoringRoute(context, revisedCopy.getId(context));							
										compcopy = revisedCopy;
									}

								}

							}
							else
							{
								if(compcopy.isBaseCopy(context))
								{
									DomainRelationship.disconnect(context, relid);
									DomainRelationship dr = DomainRelationship.connect(context, comp, AWLRel.SELECTED_LIST_ITEM.get(context),
											newmasterlistitem);
									dr.setAttributeValues(context, attributeMap);	
								}						
								comp.setCompositeCopyText(context,lang);							
							}
							if(ac.isBaseCopy(context))						
								startRouteOnLocalListItem(context,ac,owner);
						}
					}				
		}
		catch (Exception e) { throw new FrameworkException(e); }
		finally
		{
			if(isContextPushed)
				ContextUtil.popContext(context);			
		}
	}
	/**
	 * This is a private method for check and creating the routes of the copies revised outside Artwork Package
	 * 		- Will do deleting the Authoring and Approval Route if Active Task is present
	 * 
	 * @param   context            	- the enovia <code>Context</code> object
	 * @param   latestRevisionId   	- String   	-  	Copy Content Id 
	 * @param 	owner				- String 	-	Owner name to set on the Route	 
	 * @return  void
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	private void checkAndCreateRoutesOnOutsideArtworkPackage(Context context ,String latestRevisionId ,String owner)throws FrameworkException
	{
		try{
			ArtworkContent ac = ArtworkContent.getNewInstance(context,latestRevisionId);
			ArtworkMaster am = ac.getArtworkMaster(context);
			String loggedInUser      = PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
			loggedInUser = BusinessUtil.isNotNullOrEmpty(loggedInUser) ? loggedInUser : context.getUser();
			//ContextUtil.pushContext(context, loggedInUser, "",context.getVault().getName());
			Map activeTaskMap = RouteUtil.getActiveTaskByCopy(context, latestRevisionId);
			//ContextUtil.popContext(context);
			if (activeTaskMap != null && !activeTaskMap.isEmpty()) {
				String[] subjectArgs = {BusinessUtil.getString(activeTaskMap, DomainObject.SELECT_NAME),
						context.getUser()};
				String strSubject = MessageUtil.getMessage(context, null, "emxAWL.ReviseArtworkElement.ActiveTask.Deleted.Subject",
						subjectArgs, null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);

				String[] messageArgs = {ac.getTypeName(),am.getAttributeValue(context, AWLAttribute.MARKETING_NAME.get(context))};						
				String strMessage = MessageUtil.getMessage(context, null, "emxAWL.ReviseArtworkElement.ActiveTask.Deleted.Message",
						messageArgs, null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);

				RouteUtil.deleteActiveRouteByCopy(context, latestRevisionId,true, strMessage, strSubject);
				RouteUtil.deleteActiveRouteByCopy(context, latestRevisionId,false, strMessage, strSubject);

			}		
			//H49 For List Item Approver Context User will be "Master/Local Copy Approver".So setting the route owner as who revised the List Item			
			RouteUtil.createArtworkRoutes(context,owner, latestRevisionId);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 * This is a private method create and Start the Authoring Route for the Local List Item 
	 * @param   context            	- the enovia <code>Context</code> object
	 * @param   copy   				- Artwork Content   	-  	Copy Content Object 
	 * @param 	owner				- String 	-	Owner name to set on the Route	 
	 * @return  void
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	private void startRouteOnLocalListItem(Context context,ArtworkContent copy,String owner)throws FrameworkException
	{
		List<ArtworkContent> listLocalCopies = ((CopyElement)copy).getLocalCopies(context);
		try{
			for(ArtworkContent ce : listLocalCopies)
			{
				checkAndCreateRoutesOnOutsideArtworkPackage(context, ce.getId(context),owner);
				RouteUtil.startArtworkAuthoringRoute(context, ce.getId(context));	
			}
		}
		catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 * This is a Override trigger method to create on promotion of the copy content from Preliminary to Review 
	 * @param   context            	- the enovia <code>Context</code> object
	 * @param   args   				- String[]   	-  	
	 * @param	Constructor Args 	- String 		- Copy Content ObjectId  
	 * @return  void
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	public void createApprovalRoute(Context context,String[] args)throws FrameworkException
	{		
		try {
			ArtworkContent ac = ArtworkContent.getNewInstance(context, getId(context));
			if(ac.isStructuredElement(context))
				return;
			String routeOwner = ac.getOwner(context).toString();
			RouteUtil.createArtworkRoute(context, routeOwner, getId(context) , false);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 * This is a Check trigger method to check whether Composite copy is having latest and released list items while approving
	 * @param   context            	- the enovia <code>Context</code> object
	 * @param   args   				- String[]   	-  	
	 * @param	Constructor Args 	- String 		- Copy Content ObjectId  
	 * @return  int					- return 1 if fails else 0
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	public int verifyAllListItemsLatestReleased(Context context,String[] args)throws FrameworkException
	{		
		try
		{
			ArtworkContent ce =  ArtworkContent.getNewInstance(context, getId(context));
			ArtworkMaster am = ce.getArtworkMaster(context);			
			if(ArtworkContent.isCompositeCopyElement(context, am.getId(context)) )
			{
				MapList infoList = am.getArtworkElements(context, StringList.create(AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context)), null, null);
				HashMap<String, StringList> resultMap = (HashMap <String, StringList>) am.hasCompositeAssociatedWithLatestAndReleaseListItems(context, BusinessUtil.toStringList(infoList, AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context)));
				if(!resultMap.isEmpty())
				{
					String alert = AWLPropertyUtil.getI18NString(context, "emxAWL.Composite.ListItemsError");
					Set keys = resultMap.keySet();
					Iterator it = keys.iterator();
					while(it.hasNext())
					{
						String key = (String) it.next();
						StringList slLangs = resultMap.get(key);
						alert = AWLUtil.strcat(alert,am.getName(context),"-",slLangs.toString(),"\n");
					}
					MqlUtil.mqlCommand(context, MQL_ERROR ,alert);
					return 1;
				}				
			}
		}
		catch (Exception e) { throw new FrameworkException(e); }
		
		return 0;
	}
	/**
	 * This is a Action trigger method to Update the Local Composite Copy Text while approving the Base Composite Copy
	 * @param   context            	- the enovia <code>Context</code> object
	 * @param   args   				- String[]   	-  	
	 * @param	Constructor Args 	- String 		- Copy Content ObjectId  
	 * @return  void
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	public void updateLocalCompositeCopyText(Context context,String[] args)throws FrameworkException
	{
		try
		{

			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, getId(context));		
			if(artworkElement.isBaseCopy(context) && artworkElement.isCopyElement() ) {
				ArtworkMaster am = artworkElement.getArtworkMaster(context);			
				if(ArtworkContent.isCompositeCopyElement(context,  am.getId(context))) {					
					List<ArtworkContent> localCopies = ((CopyElement)artworkElement).getLocalCopies(context);
					for (ArtworkContent localCopy : localCopies) {						
						String langName = localCopy.getCopyTextLanguage(context);						
						am.setCompositeCopyText(context, langName);						
					}					
				}			
			}
		}
		catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 * This method is used to revise the copy content in context of outside of artwork package
	 * @param   context            	- the enovia <code>Context</code> object
	 * @param   args   				- String[]   	- Form Input Fileds Map
	 * @return  Map					- success/error information
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	public Map reviseArtworkElementOutsideArtworkPackage (Context context, String[] args) throws FrameworkException {
		Map returnMap = new HashMap();
		try {			
			Map requestMap = (Map) JPO.unpackArgs(args);
			FormBean formBean = (FormBean) requestMap.get("formBean");			
			if (formBean == null)
				return returnMap;

			String strObjId  			= (String)formBean.getElementValue("objectId");			
			String authorTemplate 			= (String)formBean.getElementValue("hiddenAuthorOID");
			String approverTemplate		 	= (String)formBean.getElementValue("hiddenApproverOID");
			String copyText 			= (String)formBean.getElementValue("newCopyText");
			String strGraphic 			= (String)formBean.getElementValue("isGraphic");
			String strComposite 			= (String)formBean.getElementValue("isComposite");			
			String strListItemSequence 		= (String)formBean.getElementValue("listItemSequence");			
			String strMasterId 			= (String)formBean.getElementValue("masterId");
			String strBaseCopy 			= (String)formBean.getElementValue("baseCopy");
			String strAuthorAsApprover 		= (String)formBean.getElementValue("hiddenAuthorAsApprover");
			String strListSeperator			= (String)formBean.getElementValue("listSeperator");
			String strMasterCopy 			= (String)formBean.getElementValue("masterCopy");
			String latestRevisionId = "";


			if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(strAuthorAsApprover) && BusinessUtil.isNotNullOrEmpty(approverTemplate))
			{
				Map<String ,String> approvalMap = new HashMap<String,String>();
				approvalMap.put("service", "TaskAssignment");
				approvalMap.put(BusinessUtil.OBJECT_ID, approverTemplate);
				approvalMap.put("actionType", AWLConstants.RANGE_YES.equalsIgnoreCase(strBaseCopy)? AWLConstants.MASTER_COPY_AUTHORING: AWLConstants.LOCAL_COPY_AUTHORING);

				AWLArtworkPackageUIBase_mxJPO artworkPackageUIJPO = ((AWLArtworkPackageUIBase_mxJPO)newInstanceOfJPO(context,"AWLArtworkPackageUI" , JPO.packArgs(approvalMap)));
				Map approvalAccessMap = artworkPackageUIJPO.doProcess(context, JPO.packArgs(approvalMap));
				if(AWLConstants.RANGE_FALSE.equalsIgnoreCase(BusinessUtil.getString(approvalAccessMap, "hasApprovalAccess"))) {
					returnMap.put("error", AWLPropertyUtil.getI18NString(context, "emxAWL.Error.AuthorAsApprover"));
					return returnMap;
				}
			}

			if(BusinessUtil.isNotNullOrEmpty(strObjId))
			{				
				
				if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(strGraphic))
				{
					String[] methodArgs = AWLUtil.getArgsForGraphicElement(context, formBean);
					AWLGraphicsElementUIBase_mxJPO graphicElementUIJPO = ((AWLGraphicsElementUIBase_mxJPO)newInstanceOfJPO(context,"AWLGraphicsElementUI" , methodArgs));
					Map objectMap =graphicElementUIJPO.addImageToGraphicElement(context, methodArgs);
					StringList slObjectId = BusinessUtil.getStringList(objectMap, AWLConstants.OBJECT_ID);
					if(BusinessUtil.isNotNullOrEmpty(slObjectId)) {
						String strGraphicId = (String)slObjectId.get(0);
						latestRevisionId = new GraphicDocument(strGraphicId).getGraphicElement(context).getObjectId(context);
					}
				}
				else if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(strComposite))
				{				
					HashMap<String, String> compositeElementData = new HashMap<String, String>();
					compositeElementData.put("listSeparator", strListSeperator);
					compositeElementData.put("listItemSequence", strListItemSequence);
					compositeElementData.put("txtFeatureMarketingText", copyText);
					compositeElementData.put("masterId", strMasterId);
					CopyElement copy = new CopyElement(strObjId);
					copy.updateCompositeCopyText(context, compositeElementData);

					latestRevisionId = copy.getInfo(context, AWLConstants.SELECT_NEXT_ID);

				}
				else
				{					
					CopyElement copy = new CopyElement(strObjId);
					copy.setCopyText(context, copyText);
					latestRevisionId = copy.getLatestRevisionObjectId(context);

				}
				ArtworkContent latestCopy = ArtworkContent.getNewInstance(context, latestRevisionId);
				ArtworkMaster latestMaster = latestCopy.getArtworkMaster(context);
				if(BusinessUtil.isNotNullOrEmpty(latestRevisionId))
				{
					Map activeTaskMap = RouteUtil.getActiveTaskByCopy(context, latestRevisionId);
					boolean hasTask = activeTaskMap != null && !activeTaskMap.isEmpty();

					Map<String, String> attributeMap = new HashMap<String, String>();
					attributeMap.put(AWLAttribute.IS_REVISED_OUTSIDE_ARTWORK_PACKAGE.get( context ), hasTask ? AWLConstants.RANGE_NO  : AWLConstants.RANGE_YES);					
					latestCopy.setAttributeValues(context, attributeMap);
					//Update author and approver information.
					latestCopy.updateAssignee(context, authorTemplate, approverTemplate);
					
					if (hasTask) {
						String[] subjectArgs = {BusinessUtil.getString(activeTaskMap, DomainObject.SELECT_NAME),
								context.getUser()};
						String strSubject = MessageUtil.getMessage(context, null, "emxAWL.ReviseArtworkElement.ActiveTask.Deleted.Subject",
								subjectArgs, null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);

						String[] messageArgs = {latestCopy.getTypeName(),latestMaster.getAttributeValue(context, AWLAttribute.MARKETING_NAME.get(context))};						
						String strMessage = MessageUtil.getMessage(context, null, "emxAWL.ReviseArtworkElement.ActiveTask.Deleted.Message",
								messageArgs, null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);

						RouteUtil.deleteActiveRouteByCopy(context, latestRevisionId,true, strMessage, strSubject);
						if (BusinessUtil.isNotNullOrEmpty(authorTemplate)) {
							RouteUtil.createArtworkRoute(context, context.getUser(), latestRevisionId, true);
							RouteUtil.startArtworkAuthoringRoute(context, latestRevisionId);
						}
						if (BusinessUtil.isNotNullOrEmpty(approverTemplate)) {
							RouteUtil.completeApprovalRoute(context, RouteUtil.getConnectedRoute(context, latestRevisionId, RouteUtil.getArtworkAction(context, latestRevisionId, false)));
							RouteUtil.createArtworkRoute(context, context.getUser(), latestRevisionId, false);
						}
					}										
				}
				String objectId = AWLConstants.RANGE_YES.equalsIgnoreCase(strMasterCopy) ? latestMaster.getId(context) : latestRevisionId ;				
				returnMap.put("objectId",objectId);
			}

		} catch (Exception e) { throw new FrameworkException(e); }
		
		return returnMap;
	}

	/**
	 * On Releasing the Artwork Element we are setting skip Authoring for the element.
	 * This value is used when next Artwork Package is moved from Assign to Work In Progress whether the Authoring Task should be created or not?
	 * Artwork Package owner can change this value while doing Artwork Assignments.
	 */	
	public void resetReAuthoringOnRelease(Context context, String[] args) throws FrameworkException {
		try {
			String artworkId = args[0];
			ArtworkContent content = ArtworkContent.getNewInstance(context, artworkId);
			content.resetReAuthoring(context);
		} catch (Exception e) { throw new FrameworkException(e); }
	}


	//when base Copy ownership is transferred, transfer its master copy also 
	public void transferOwnershipofMastercopy (Context context, String[] args) throws FrameworkException
	{
		try {
			String objectId = args[0];
			ArtworkContent content = ArtworkContent.getNewInstance(context, objectId);


			if(!content.isBaseCopy(context))
				return;
			ArtworkMaster am = content.getArtworkMaster(context);
			if(am==null)
			{
				return;
			}

			StringList selectList=new StringList();
			selectList.add(DomainConstants.SELECT_OWNER);
			selectList.add(AWLConstants.PROJECT);
			selectList.add(AWLConstants.ORGANIZATION);
			Map<?, ?> artworkBaseInfo = content.getInfo(context, selectList);
			artworkBaseInfo.remove(SELECT_ID);
			artworkBaseInfo.remove(SELECT_TYPE);

			String srcValue="";
			String dstnValue="";
			String command="";

			Map<?, ?>  artworkMasterInfo= am.getInfo(context, selectList);
			artworkMasterInfo.remove(SELECT_ID);
			artworkMasterInfo.remove(SELECT_TYPE);
			//compare artwork master with artwork base
			if( artworkMasterInfo.equals(artworkBaseInfo))
				return;
			else{			

				srcValue=(String)artworkBaseInfo.get(DomainConstants.SELECT_OWNER);
				dstnValue=(String)artworkMasterInfo.get(DomainConstants.SELECT_OWNER);
				if(!srcValue.equals(dstnValue))
				{
					am.setOwner(context, srcValue);
				}
				srcValue=(String)artworkBaseInfo.get(AWLConstants.PROJECT);
				dstnValue=(String)artworkMasterInfo.get(AWLConstants.PROJECT);
				if(!srcValue.equals(dstnValue))
				{
					command="mod bus $1 project $2";
					MqlUtil.mqlCommand(context, command, true,am.getObjectId(),srcValue);


				}
				srcValue=(String)artworkBaseInfo.get(AWLConstants.ORGANIZATION);
				dstnValue=(String)artworkMasterInfo.get(AWLConstants.ORGANIZATION);
				if(!srcValue.equals(dstnValue))
				{
					command="mod bus $1 organization $2";
					MqlUtil.mqlCommand(context, command, true, am.getObjectId(),srcValue);

				}
			}

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Checks the authoring and approval route template/person Availability for local copy List Items during Promotion from Review State of Base Copy List Item
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL R418
	 * @author  N94
	 */
	public int checkAssignmentsForLocalListItem(Context context,String[] args)throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();

			String artworkElementId = args[0];

			ArtworkContent ae = ArtworkContent.getNewInstance(context, artworkElementId);
			
			StringList missingList = new StringList();
			
			/*When we revise List Item, and try to promote Base Copy List Item from Review to Release state.
              We try to start Routes for its Local List Items, so check Assignments for LocalListItems before starting Routes */

			if((BusinessUtil.isKindOf(context, artworkElementId, AWLType.LIST_ITEM_COPY.get(context))) && ae.isBaseCopy(context)){
				List<ArtworkContent> localListItems = ((CopyElement) ae).getLocalCopies(context);
				
					for(ArtworkContent listItem : localListItems)
					{
						String approvalTemplateId       = listItem.getAuthoringAssigneeId(context);
						String authoringTemplateId       = listItem.getApprovalAssigneeId(context);
						if(!(BusinessUtil.exists(context, approvalTemplateId) && BusinessUtil.exists(context, authoringTemplateId)))
						{
							missingList.add(listItem.getName());
						}
					}		
			}
			
			if(BusinessUtil.isNotNullOrEmpty(missingList))
			{
				String nameMessage = FrameworkUtil.join(missingList, "\n");				
				MqlUtil.mqlCommand(context, MQL_NOTICE, nameMessage);
				return 1;
			}			
			return 0;
		}
		catch (Exception e) { throw new FrameworkException(e);	}
	}	


	/**
	 * Content are not allowed to review if, associated POA's are in Artwork In Process /Review state
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * @since 2013x.HF8
	 */
	
	public int canReviseArtworkElementAssociatedPOAs(Context context, String[] args) throws FrameworkException
	{
		try {
			String artworkContentId = getId( context );
			ArtworkContent artworkContent= ArtworkContent.getNewInstance( context, artworkContentId );
			if(areAssociatedPOAsDisallowRevise(context, artworkContent))
				return 1;			
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
		
		return 0;
	}
	
	/**
	 * It revises the local copies connected to the basecopy and creates the new routes depends on its state.
	 * @param context Enovia Context
	 * @param args Artwork Element.
	 * @since 2013x.HF8
	 * @throws FrameworkException
	 */
	public void createRoutesForLocalCopies(Context context, String[] args) throws FrameworkException{
		try {
			ArtworkContent oldArtworkElement = ArtworkContent.getNewInstance(context, getId(context));
			
			if(!oldArtworkElement.isBaseCopy(context) || oldArtworkElement.isGraphicElement())
				return ;
			
			ArtworkContent newArtworkElement = ArtworkContent.getNewInstance(context, oldArtworkElement.getLastRevision(context).getObjectId(context));
			
			ArtworkMaster revisedArtworkMaster = newArtworkElement.getArtworkMaster(context);			
			StringBuffer messageBody = new StringBuffer(150);
			messageBody.append("Master Copy \"").append(oldArtworkElement.getInfo(context, SELECT_TYPE)).append("\" - \"").
						append(revisedArtworkMaster.getInfo(context, AWLAttribute.MARKETING_NAME.getSel(context))).append("\" content is being modified.").
						append("\", Local Copy authoring cannot be proceed until modified master copy is Approved.");
			String objWhere	 = "(attribute[" + AWLAttribute.IS_BASE_COPY.get(context) + "] smatch const " + "\"" + AWLObject.RANGE_NO + "\")";
			MapList localCopyList   = revisedArtworkMaster.getArtworkElements(context, StringList.create(DomainConstants.SELECT_CURRENT), null, objWhere);
			
			for(int i=0;i<localCopyList.size();i++)
			{	
				Map localCopyMap = (Map) localCopyList.get(i);
				String revisedLocalCopyContentId = (String)localCopyMap.get(DomainConstants.SELECT_ID);
				String localCopyName = (String)localCopyMap.get(DomainConstants.SELECT_NAME);
				String localCopyState = (String)localCopyMap.get(DomainConstants.SELECT_CURRENT);				
				
				MapList mAPList = getArtworkPackagesBasedOnCreationDate(context ,revisedLocalCopyContentId);			
				if(AWLConstants.STATE_PRELIMINARY.equalsIgnoreCase(localCopyState) || AWLConstants.STATE_RELEASE.equalsIgnoreCase(localCopyState))
				{
					StringBuffer subject = new StringBuffer("Local Copy Authoring Task is deleted.");
					StringBuffer body = new StringBuffer();
					body.append("Authoring Task for Local Copy \"").append(localCopyName)
					.append("\" is being removed for the following reason.\n");
					body.append(messageBody.toString());
					String localCopyAuthoringRouteId = RouteUtil.getConnectedRoute(context, revisedLocalCopyContentId, AWLConstants.LOCAL_COPY_AUTHORING);
					String localCopyApprovalRouteId = RouteUtil.getConnectedRoute(context, revisedLocalCopyContentId, AWLConstants.LOCAL_COPY_APPROVAL);
					
					if(BusinessUtil.isNotNullOrEmpty(localCopyAuthoringRouteId) && AWLState.INPROCESS.get(context, AWLPolicy.ROUTE).equals(BusinessUtil.getInfo(context, localCopyAuthoringRouteId, DomainConstants.SELECT_CURRENT)))
					{
						String authoringRouteId = RouteUtil.getConnectedRoute(context, revisedLocalCopyContentId, AWLConstants.LOCAL_COPY_AUTHORING);
						String routeOwner = RouteUtil.getRouteOwner(context, authoringRouteId);
						RouteUtil.deleteActiveRouteByCopy(context, revisedLocalCopyContentId, true, body.toString(), subject.toString());
						RouteUtil.createArtworkRoute(context, routeOwner, revisedLocalCopyContentId, true);
					}
					
					if(!mAPList.isEmpty() && BusinessUtil.isNullOrEmpty(localCopyAuthoringRouteId) && BusinessUtil.isNullOrEmpty(localCopyApprovalRouteId))
					{
						String lastArtworkPackageId  = BusinessUtil.getString((Map) mAPList.get(0), DomainConstants.SELECT_ID);
						String routeOwner = BusinessUtil.getInfo(context, lastArtworkPackageId, DomainConstants.SELECT_OWNER);
						RouteUtil.createArtworkRoute(context, routeOwner, revisedLocalCopyContentId, true);
						RouteUtil.createArtworkRoute(context, routeOwner, revisedLocalCopyContentId, false);
					}					
				}				
			}
			artworkMasterFloatOnRevise(context, revisedArtworkMaster);
			
		}catch (Exception e) {
			throw new FrameworkException(e);
		}
	}

	/**
	 * This method checks whether Graphic Element has any files uploaded or not
	 * 
	 * @param context
	 * @param args
	 * @return
	 * @since 2013x.HF8
	 * @throws FrameworkException
	 */
	public int isGraphicElementHasFile(Context context, String[] args) throws FrameworkException
	{
		if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
			throw new IllegalArgumentException();
		try {
			String copyContentId = args[0];
			ArtworkContent ac = ArtworkContent.getNewInstance(context, copyContentId);
			if(ac.isGraphicElement()) {
				GraphicsElement ge = new GraphicsElement(copyContentId);
				GraphicDocument gdoc = ge.getGraphicDocument(context);
				MapList activeFilesList = gdoc.related(new AWLType[]{AWLType.GRAPHIC_DOC, AWLType.PHOTO_DOC, AWLType.SYMBOL_DOC}, 
						 new AWLRel[]{AWLRel.ACTIVE_VERSION}).query(context);
				if(activeFilesList.size()==0) {
					MqlUtil.mqlCommand(context, MQL_NOTICE, AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.GraphicNoFiles"));
					return 1;
				}
			}
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
		return 0;
	}
	
	/**	
	 * Promotes the Connected Graphic Document If Artwork Element is base copy and Graphic Element
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero
	 * @since   AWL 2013x.HF8
	 */
	public void promoteConnectedGraphicDocument(Context context,String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();

			String artworkElementId = args[0];
			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
			if(artworkElement.isBaseCopy(context) && artworkElement.isGraphicElement())
			{
				GraphicsElement graphicElement = (GraphicsElement)artworkElement;
				GraphicDocument graphicDocument = graphicElement.getGraphicDocument(context);
				graphicDocument.promote(context);
			}
		
			artworkElement.promoteStructure(context);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**	
	* Demote's the Connected Graphic Document If Artwork Element is base copy and Graphic Element
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero
	* @since   AWL 2013x.HF8
	*/
	public void demoteConnectedGraphicDocument(Context context,String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String artworkElementId = args[0];
			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
			if(artworkElement.isBaseCopy(context) && artworkElement.isGraphicElement()){
				GraphicsElement graphicElement = (GraphicsElement)artworkElement;
				GraphicDocument graphicDocument = graphicElement.getGraphicDocument(context);
				graphicDocument.demote(context);
			}
			
			artworkElement.demoteStructure(context);
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
	
	/**
	 * Checks if the Artwork Element is Associated with Copy Lists in beyond editable state.
	 * @param context
	 * @param args
	 * @return
	 * @throws Exception
	 */
	
	public int hasCopyListsAssociated(Context context, String[] args) throws FrameworkException
	{
		try
		{
			String artworkElementId = args[0];
			ArtworkContent artworkObj = ArtworkContent.getNewInstance(context, artworkElementId);
			String objWhere = AWLUtil.strcat("((", SELECT_CURRENT, "!=", AWLState.PRELIMINARY.get(context, AWLPolicy.COPY_LIST), ")&&(",SELECT_CURRENT,"!=", AWLState.OBSOLETE.get(context, AWLPolicy.COPY_LIST), "))");
			MapList copyListsAssociated = artworkObj.getAssociatedCopyList(context,objWhere);
			if(!copyListsAssociated.isEmpty())
			{
				StringList strNameList = BusinessUtil.toStringList(copyListsAssociated, DomainConstants.SELECT_NAME);
				int count = 3;
				String strName = AWLUIUtil.getEllipsisString(strNameList, count);
					strNameList = new StringList(strName);
				 throw new FrameworkException(MessageUtil.getMessage(context, null, "emxAWL.Alert.AssociatedWithCopyList", BusinessUtil.toStringArray(strNameList) , null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE));
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	/**
	 * Trigger to Set the History relationship for connected Copy Lists
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - Trigger Arguments
	 * @throws FrameworkException
	 * @author NPA3 (Nidhi Priya)
	 * @since AWL 2015x.HF6 
	 * Created during "Customization and Kit Support Highlight"
	 */

	public void setHistoryRelationshipToConnectedCopyLists(Context context,String[] args) throws FrameworkException
	{
		boolean isContextPushed = false;
		try	{
			if(args.length == 0)
				throw new IllegalArgumentException();

			String artworkElementId = args[0];
			
			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
			MapList associatedCopyList  = artworkElement.getAssociatedCopyList(context, null);
			StringList relIDs = BusinessUtil.toStringList(associatedCopyList, DomainRelationship.SELECT_ID);

			SimpleDateFormat sdf = new SimpleDateFormat( eMatrixDateFormat.getEMatrixDateFormat(), context.getLocale());			
			String strTodaysDate = sdf.format(new Date());
			Map effectivityAttr = Collections.singletonMap(AWLAttribute.END_EFFECTIVITY_DATE.get(context), strTodaysDate);
			
			List<String> ids = BusinessUtil.getIdList(associatedCopyList);
			ids.add(artworkElementId);
			//List<String> accessGrantedIDs = new ArrayList<String>();
			
			//String user = context.getUser();
			//String personUserAgent = PropertyUtil.getSchemaProperty(context, "person_UserAgent");
			//String MQL_GRANT_ACCESS = "mod bus $1 grant $2 access $3;";
			//String MQL_REVOKE_ACCESS = "mod bus $1 revoke grantor $2 grantee $3;";
			String ACCESS_CHANGETYPE = "changetype";
			
			for (String id : ids) 
			{
				boolean hasChangeTypeAccess = Access.hasAccess(context, id, ACCESS_CHANGETYPE);
				if(!hasChangeTypeAccess) {
					//MqlUtil.mqlCommand(context, MQL_GRANT_ACCESS, true, id, user, ACCESS_CHANGETYPE);
					boolean isContextPushedTmp = AWLUtil.pushContextIfNoAccesses(context,id ,new StringList(new String[] {"ChangeOwner"}));
					
					if(!isContextPushed && isContextPushedTmp) 
						isContextPushed = true;					
				}
			}
			
			BusinessUtil.changeRelName(context, relIDs,  AWLRel.ARTWORK_ASSEMBLY_HISTORY.get(context), effectivityAttr);

	/*		for (String id : accessGrantedIDs) 	{				
				MqlUtil.mqlCommand(context, MQL_REVOKE_ACCESS, true, id, personUserAgent, user);
			}
			*/
		}
		catch (Exception e) {e.printStackTrace();
			throw new FrameworkException(e);
		}finally {
			if(isContextPushed) {
				ContextUtil.popContext(context);
			}
		}
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void floatAERevisionsToCLPOA(Context context,String[] args) throws FrameworkException {
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();

			String artworkElementId = args[0];
			
			String SEL_CAN_MODIFY = "current.access[modify]";
			String SEL_IS_BASE_COPY = AWLAttribute.IS_BASE_COPY.getSel(context);
			String SEL_MASTER_ID = AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.id");
			
			ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
			Map resultInfo = artworkElement.getInfo(context, StringList.create(SEL_IS_BASE_COPY, SEL_MASTER_ID,SEL_CAN_MODIFY));
			boolean isBaseCopy = AWLConstants.RANGE_YES.equals((String)resultInfo.get(SEL_IS_BASE_COPY));
			
			
			List<String> poaFloatStates = AWLGlobalPreference.getCERevFloatPrefForPOA(context);
			String poasToFloat = poaFloatStates.stream().map(state -> {
				return new StringBuilder("current").append("==\"").append(state).append("\"").toString();
			}).collect(Collectors.joining("||"));
			
			StringBuilder poasToFloatBuilder = new StringBuilder(poasToFloat).append("||").append("current").append("==\"").append(AWLState.PRELIMINARY.get(context, AWLPolicy.POA)).append("\"");
			StringBuilder objWhere = new StringBuilder(100);
			objWhere.append("(type").append("==\"").append(AWLType.POA.get(context)).append("\"").append(" && ").append("(").append(poasToFloatBuilder.toString()).append(")").append(")");
			
			if(isBaseCopy) {
				String obsoleteState = AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT);
				String whereClauseForPOASelects = new StringBuilder("current!=\"").append(obsoleteState).append("\"").toString();
				String revisedMasterId = (String)resultInfo.get(SEL_MASTER_ID);
				ArtworkMaster revisedMaster = new ArtworkMaster(revisedMasterId);
				
				String SEL_ATTR_COPYTEXT_LANGUAGE = AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context);
				MapList revisedMasterConntectedLocalCopies = revisedMaster.getArtworkElements(context, StringList.create(SEL_ATTR_COPYTEXT_LANGUAGE), null, whereClauseForPOASelects);
				Map<String, String> revisedCopyLangAndId = IntStream.range(0, revisedMasterConntectedLocalCopies.size()).boxed()
																		.collect(Collectors.toMap(i-> {
																					Map currentLocalCopies = (Map) revisedMasterConntectedLocalCopies.get(i);
																					return (String)currentLocalCopies.get(SEL_ATTR_COPYTEXT_LANGUAGE);
																				}, i-> {
																					Map currentLocalCopies = (Map) revisedMasterConntectedLocalCopies.get(i);
																					return (String)currentLocalCopies.get(SELECT_ID);
																				})
																		);
				
				MapList amRevisionInfo = revisedMaster.getRevisionsInfo(context, StringList.create(DomainConstants.SELECT_ID, DomainConstants.SELECT_CURRENT), new StringList());
				List<String> amIds =  ((List<Map>)amRevisionInfo).stream().filter(currentRevision -> {
					String currentState = (String) currentRevision.get(DomainConstants.SELECT_CURRENT);
					return !obsoleteState.equalsIgnoreCase(currentState);
				}).map(currentRevision -> {
					return (String) currentRevision.get(DomainConstants.SELECT_ID);
				}).collect(Collectors.toList());
				
				
				//STEP-2: Artwork Master Connected POAs - Start
				String SEL_ARTWORK_BASIS =  AWLAttribute.ARTWORK_BASIS.getSel(context);
				
				String SEL_POA_ID = new StringBuilder(30)
						.append("to[")
						.append(AWLRel.ARTWORK_ASSEMBLY.get(context))
						.append("].from.id")
						.toString();

				String SEL_POA_CONNECTION_ID = new StringBuilder(100)
													.append("to[")
													.append(AWLRel.ARTWORK_ASSEMBLY.get(context))
													.append("].id")
													.toString();
				

				StringList busSelects = StringList.create(SEL_ATTR_COPYTEXT_LANGUAGE, SEL_POA_ID, SEL_POA_CONNECTION_ID, SEL_CAN_MODIFY);
				
				for(String eachAMId : amIds) {
					try {
						//STEP-2.1: Artwork Master Connected POAs - Start
						ArtworkMaster oldMaster = new ArtworkMaster(eachAMId);
						MapList connectedPOAs = oldMaster.related(new AWLType[]{AWLType.POA}, 
								AWLUtil.toArray(AWLRel.POA_ARTWORK_MASTER)).
								from().id().type().relid().sel(SEL_ARTWORK_BASIS).sel(SEL_CAN_MODIFY).where(objWhere.toString()).
								query(context);
						
						Set applicablePOAIds = new HashSet<>();
						Map<String, Map> poaInfoById = new HashMap<>();
						((List<Map>)connectedPOAs).forEach(eachPOAInfo -> {
							try {
								String poaId = (String)eachPOAInfo.get(SELECT_ID);
								boolean isCustomizationPOA =  AWLConstants.ARTWORK_BASIS_MARKETING_CUSTOMIZATION.equalsIgnoreCase((String)eachPOAInfo.get(SEL_ARTWORK_BASIS));
								if(isCustomizationPOA){
									CustomizationPOA custPOA=new CustomizationPOA((String)poaId);
									StringList masterIds= custPOA.getArtworkMasterConnectedFromComprisedPOA(context);
									if(masterIds.contains(eachAMId))
										return;
								}
								poaInfoById.put(poaId, eachPOAInfo);
								applicablePOAIds.add(poaId);
							} catch(Exception e) {
								throw new RuntimeException(e);
							}
						});
						//STEP-2.1: Artwork Master Connected POAs - End
						
						//STEP-2.2: Get Artwork Elements and connected POA - Start
						MapList mlLocalElements = oldMaster.getArtworkElements(context, busSelects, null, whereClauseForPOASelects);
						List<Map> lOldLocalCopies = ((List<Map>)mlLocalElements).stream().map((o) -> {
							Object connectedPOAIds = o.get(SEL_POA_ID);
							Object connectedPOACLRelIds = o.get(SEL_POA_CONNECTION_ID);
							Map<String, String> poaIdRelIdMap = new HashMap();
							
							if(connectedPOAIds instanceof StringList) {
								StringList slPOACLIds = (StringList) connectedPOAIds;
								StringList slPOACLRelIds = (StringList) connectedPOACLRelIds;
								poaIdRelIdMap = IntStream.range(0, slPOACLIds.size()).boxed()
										.filter(i -> {
											String poaIdOrCLId = slPOACLIds.get(i);
											return applicablePOAIds.contains(poaIdOrCLId);
										})
										.collect(Collectors.toMap(i->slPOACLIds.get(i), i-> slPOACLRelIds.get(i)));
							} else {
								if(applicablePOAIds.contains((String)connectedPOAIds)) {
									poaIdRelIdMap.put((String)connectedPOAIds, (String)connectedPOACLRelIds);
								}
							}
							o.put("connectedPOAIdRelIdMap", poaIdRelIdMap);
							return o;
						}).collect(Collectors.toList());
						//STEP-2: Get Artwork Elements and connected POA - End
						
						String ctxUser = context.getUser();
						String userAgent = PropertyUtil.getSchemaProperty(context, AWLConstants.person_UserAgent);
						
						Set<String> grantedObjectIds = new HashSet<>();
						//IR-759074-3DEXPERIENCER2020x -start
						for(Map oldLocalCopy : lOldLocalCopies) {
						
							String copyTextLanguage = (String) oldLocalCopy.get(SEL_ATTR_COPYTEXT_LANGUAGE);
							Map<String, String> connectedPOAIdRelIdMap = (Map<String, String>) oldLocalCopy.get("connectedPOAIdRelIdMap");
							String latestCEId1 = revisedCopyLangAndId.get(copyTextLanguage);
														
							//if latestCEId is null then create new LC for copyTextLanguage and connect it to new MC rev
							if(com.matrixone.apps.framework.ui.UIUtil.isNullOrEmpty(latestCEId1) && !eachAMId.equals(revisedMasterId)) {
								String LCid = (String) oldLocalCopy.get(SELECT_ID);
								
								String REL_CONTENT_LANGUAGE =AWLRel.CONTENT_LANGUAGE.get(context);
								String SEL_LANG_ID = new StringBuilder(30).append("from[")
										.append(REL_CONTENT_LANGUAGE).append("].to.id").toString();
								String ATTR_IS_BASE_COPY = AWLAttribute.IS_BASE_COPY.get(context);
								String ATTR_COPYTEXT_LANGUAGE = AWLAttribute.COPY_TEXT_LANGUAGE.get(context);
								
								StringList busSel = StringList.create(SELECT_TYPE, SELECT_NAME, SEL_LANG_ID, SEL_ATTR_COPYTEXT_LANGUAGE, SEL_IS_BASE_COPY);
								
								boolean isContextPushed = false;
								try {
								MapList ml = DomainObject.getInfo(context, new String[] {LCid}, busSel);
								Map localCopyMap = (Map) ml.get(0);
								String type = (String) localCopyMap.get(DomainObject.SELECT_TYPE);
								String langName = (String) localCopyMap.get(SEL_ATTR_COPYTEXT_LANGUAGE);
								String langIdValue = (String) localCopyMap.get(SEL_LANG_ID);
								String[] langIdValueArr = langIdValue.split("");
								StringList langIds = new StringList(langIdValueArr);
							
								String isBaseCopyValue = (String) localCopyMap.get(SEL_IS_BASE_COPY);
								
								//create new local copy -- Start
								String strVaultName = context.getVault().getName();
								
								latestCEId1 = FrameworkUtil.autoName(context, FrameworkUtil.getAliasForAdmin(context, DomainConstants.SELECT_TYPE, type, true), "", "policy_ArtworkElementContent", strVaultName, true);
								MqlUtil.mqlCommand(context, "mod bus $1 $2 $3 $4 $5", latestCEId1, ATTR_COPYTEXT_LANGUAGE, langName, ATTR_IS_BASE_COPY, isBaseCopyValue);
								for(String langId : langIds) {
									MqlUtil.mqlCommand(context, MQL_CONNECT, latestCEId1, REL_CONTENT_LANGUAGE, langId);
								}
								//create new local copy -- End		
																
									boolean hasModify = "true".equalsIgnoreCase((String)resultInfo.get(SEL_CAN_MODIFY));
									if(!hasModify && grantedObjectIds.add(revisedMasterId)) {
										MqlUtil.mqlCommand(context, GRANT_MOD_ACCESS_MQL, true, revisedMasterId, ctxUser);
										isContextPushed = AWLUtil.pushContextIfNoAccesses(context,revisedMasterId ,new StringList(new String[] {"modify"}));
									}
									MqlUtil.mqlCommand(context, "add connection $1 from $2 to $3", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), revisedMasterId,latestCEId1);									
								} catch (FrameworkException e) {
									e.printStackTrace();
								}finally {
									if(isContextPushed) {
										ContextUtil.popContext(context);
									}
								}								
							}
							
							String latestCEId=latestCEId1;							
							if(UIUtil.isNotNullAndNotEmpty(latestCEId)) {
							//IR-759074-3DEXPERIENCER2020x -end
							connectedPOAIdRelIdMap.forEach((poaCLId, relId) -> {
								boolean isContextPushed = false;
								try {
									Map poaCLInfo = poaInfoById.get(poaCLId);
									boolean hasModify = "true".equalsIgnoreCase((String)poaCLInfo.get(SEL_CAN_MODIFY));
									if(!hasModify && grantedObjectIds.add(poaCLId)) {
										//MqlUtil.mqlCommand(context, GRANT_MOD_ACCESS_MQL, true, poaCLId, ctxUser);										
										isContextPushed = AWLUtil.pushContextIfNoAccesses(context,poaCLId ,new StringList(new String[] {"modify"}));										
									}
									MqlUtil.mqlCommand(context, MQL_MODIFY_CONNECT_TO_SIDE, relId, latestCEId);
								} catch(FrameworkException e) {
									e.printStackTrace();
									throw new RuntimeException(e);
								}finally {
									if(isContextPushed) {
										try {
											ContextUtil.popContext(context);
										} catch (FrameworkException e) {
											e.printStackTrace();
										}
									}
								}
							});
						  }					
						}
						
						applicablePOAIds.forEach(poaCLId -> {
							try {
								Map poaCLInfo = poaInfoById.get(poaCLId);
								String relationshipId = (String) poaCLInfo.get(DomainRelationship.SELECT_ID);
								MqlUtil.mqlCommand(context, MQL_MODIFY_CONNECT_TO_SIDE, relationshipId, revisedMasterId);
								
							} catch (Exception e) {e.printStackTrace();
								throw new RuntimeException(e);
							}
						});
						
				/*		grantedObjectIds.forEach(id -> {
							try {
								MqlUtil.mqlCommand(context, MOD_REVOKE_GRANTOR_GRANTEE, true, id, userAgent, ctxUser);
							} catch(FrameworkException e) {e.printStackTrace();
								throw new RuntimeException(e);
							}
						});*/
						
					} catch (Exception e) {e.printStackTrace();
						throw new RuntimeException(e);
					}
				}
				
			} else {
				String obsoleteState = AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
				MapList revisionInfo = artworkElement.getRevisionsInfo(context, StringList.create(DomainConstants.SELECT_ID, DomainConstants.SELECT_CURRENT), new StringList());
				((List<Map>)revisionInfo).stream().filter(currentRevision -> {
					String currentState = (String) currentRevision.get(DomainConstants.SELECT_CURRENT);
					return !obsoleteState.equalsIgnoreCase(currentState);
				}).map(currentRevision -> {
					return (String) currentRevision.get(DomainConstants.SELECT_ID);
				}).forEach(revisionid-> {
					try {
						DomainObject newObj = DomainObject.newInstance(context, artworkElement);
						ArtworkContent oldRevision = ArtworkContent.getNewInstance(context, revisionid);
						floatNewRevInArtworkAssembly(context, oldRevision, newObj);
					} catch(Exception e) {e.printStackTrace();
						throw new RuntimeException(e);
					}
				});	
			}
			
		} catch(Exception e) {e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
}

