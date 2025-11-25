/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import static com.matrixone.apps.awl.util.AWLConstants.MQL_ERROR;
import static com.matrixone.apps.awl.util.AWLConstants.MQL_NOTICE;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import matrix.db.BusinessObject;
import matrix.db.BusinessObjectList;
import matrix.db.Context;
import matrix.db.RelationshipType;
import matrix.util.MatrixException;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.CopyList;
import com.matrixone.apps.awl.dao.CustomizationPOA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.preferences.AWLGlobalPreference;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPreferences;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.common.Route;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MessageUtil;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;

@SuppressWarnings({ "PMD.SignatureDeclareThrowsException",
					"PMD.TooManyMethods" })
public class AWLArtworkMasterBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = -5150349193448785671L;
	
	public AWLArtworkMasterBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	/* Determines whether Context has All AWL Access
	 * 
	 */
	public boolean hasAllAccess(Context context, String[] args) throws FrameworkException
	{
		return Access.isProductManager(context)  || Access.isArtworkProjectManager(context) ||
		Access.isMasterCopyAuthor(context)  || Access.isMasterCopyApprover(context) ||
		Access.isLocalCopyAuthor(context) || Access.isLocalCopyApprover(context) ||
		Access.isGraphicDesigner(context) || Access.isArtworkApprover(context);
	}
	
	/*
	 * Trigger method invoked when master artwork element is deleted
	 * This method will delete connected artwork elements 
	 */
	public int deleteConnectedArtworkElements (Context context, String[] args) throws FrameworkException
	{
		try {
			String objectId = args[0];
			ArtworkMaster am = new ArtworkMaster(objectId);

			PropertyUtil.setRPEValue(context, "fromMasterLabelElement", "true" ,false);

			List<ArtworkContent> aeList = am.getArtworkElementContent(context, EMPTY_STRING);
			for(int k = 0 ; k <aeList.size() ; k++)
				aeList.get(k).deleteObject(context);

			PropertyUtil.setRPEValue(context, "fromMasterLabelElement", "false" ,false);
			return 0;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	@SuppressWarnings({ "rawtypes" })
	public int canReviseArtworkMaster(Context context, String[] args) throws FrameworkException	{
		try {
			String objectId = args[0];
			ArtworkMaster artworkMaster = new ArtworkMaster(objectId);
			if(!artworkMaster.isLastRevision(context)) {
				MqlUtil.mqlCommand(context, MQL_ERROR , AWLPropertyUtil.getI18NString(context, "emxAWL.Error.HigherRevisionExist"));
				return 1;
			}
			
			StringBuilder objWhere = new StringBuilder(50);
			objWhere.append("(attribute[")
					.append(AWLAttribute.IS_BASE_COPY.get(context))
					.append("] smatch const ").append("\"").append("Yes").append("\")");
			
			MapList localCopies = artworkMaster.getArtworkElements(context, StringList.create(SELECT_CURRENT, SELECT_NAME), null, objWhere.toString());
			if(BusinessUtil.isNullOrEmpty(localCopies)) {
				MqlUtil.mqlCommand(context, MQL_ERROR , AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkMaster.Revise.Error.NoElementsConnected"));
				return 1;
			}
			
			Map baseElement = (Map)localCopies.get(0);
			String currentState = (String) baseElement.get(SELECT_CURRENT);
			if(!AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT).equalsIgnoreCase(currentState)) {
				MqlUtil.mqlCommand(context, MQL_ERROR , AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkMaster.Revise.Error.BaseCopyIsNotInRelease"));
				return 1;
			}
			
			return 0;
		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	
	public void reviseArtworkMasterAndLocalCopies(Context context, String[] args) throws FrameworkException	{
		try {
			String objectId = args[0];
			ArtworkMaster oldMaster = new ArtworkMaster(objectId);
			oldMaster.reviseMasterAndLocalCopies(context);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public void floatNewRevInArtworkAssembly(Context context, String[] args) throws FrameworkException	{
		try {
			String oldMasterId = args[0];
			ArtworkMaster oldMaster = new ArtworkMaster(oldMasterId);
			oldMaster.floatNewRevInArtworkAssembly(context);
			
		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void createArtworkRoutes(Context context,String[] args) throws FrameworkException
	{
		boolean isContextPushed = false;
		try {
			String oldMasterId = args[0];
			ArtworkMaster oldMaster = new ArtworkMaster(oldMasterId);
			ArtworkContent currentArtworkElement = oldMaster.getBaseArtworkElement(context);
			
			String SEL_ROUTE_STATUS = AWLAttribute.ROUTE_STATUS.getSel(context);
			MapList baseCopyActiveRoutes = currentArtworkElement.related(AWLType.ROUTE, AWLRel.OBJECT_ROUTE).id().where(AWLUtil.strcat(SEL_ROUTE_STATUS, "=='Started'")).query(context);
			if(BusinessUtil.isNullOrEmpty(baseCopyActiveRoutes))
				return;
			
			String SEL_COPY_LANGUAGE = AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context);
			//Get the heirarchy of new revision -- Start
			ArtworkMaster revisedMaster = new ArtworkMaster(oldMaster.getNextRevision(context));
			MapList revisedArts = revisedMaster.getArtworkElements(context, StringList.create(SELECT_ID, SELECT_TYPE, SEL_COPY_LANGUAGE), null, null, true, true);
			Map<String, String> revisedArtsByLang = ((List<Map>)revisedArts).stream().collect(Collectors.toMap(eachArt->{
				return (String) ((Map)eachArt).get(SEL_COPY_LANGUAGE);
			}, eachArt -> {
				return (String) ((Map)eachArt).get(SELECT_ID);
			}));
			//Get the new heirarchy of new revision -- End
			
			String SEL_MARKETING_NAME = AWLAttribute.MARKETING_NAME.getSel(context);
			String SEL_AUTHOR_ID = AWLUtil.strcat("from[", AWLRel.ARTWORK_CONTENT_AUTHOR.get(context), "].to.id");
			String SEL_APPROVER_ID = AWLUtil.strcat("from[", AWLRel.ARTWORK_CONTENT_APPROVER.get(context), "].to.id");
			String SEL_IS_BASE_COPY = AWLAttribute.IS_BASE_COPY.getSel(context);
			
			MapList oldArts = oldMaster.getArtworkElements(context, StringList.create(SELECT_ID, SELECT_TYPE, SEL_AUTHOR_ID, SEL_APPROVER_ID, SEL_IS_BASE_COPY, SEL_MARKETING_NAME, SEL_COPY_LANGUAGE), null, null, true, true);
			for(Map eachOldArt: (List<Map>)oldArts) {
				try {
					String strIsBaseCopy = (String) eachOldArt.get(SEL_IS_BASE_COPY);
					String oldArtworkId = (String) eachOldArt.get(DomainConstants.SELECT_ID);
					String copyLanguage = (String) eachOldArt.get(SEL_COPY_LANGUAGE);
					String revisedArtId = (String) revisedArtsByLang.get(copyLanguage);
					
					String authorTemplate = (String) eachOldArt.get(SEL_AUTHOR_ID);
					String approverTemplate = (String) eachOldArt.get(SEL_APPROVER_ID);
					(new CopyElement(revisedArtId)).updateAssignee(context, authorTemplate, approverTemplate);
					
					/*if(!isContextPushed) {
						ContextUtil.pushContext(context);
						isContextPushed = true;
					}*/
					
					if(AWLConstants.RANGE_YES.equalsIgnoreCase(strIsBaseCopy)) {
						Map activeTaskMap = RouteUtil.getActiveTaskByCopy(context, oldArtworkId);
						boolean hasTask = activeTaskMap != null && !activeTaskMap.isEmpty();
						
						if (hasTask) {
							String[] subjectArgs = {BusinessUtil.getString(activeTaskMap, DomainObject.SELECT_NAME), context.getUser()};
							String strSubject = MessageUtil.getMessage(context, null, "emxAWL.ReviseArtworkElement.ActiveTask.Deleted.Subject",	subjectArgs, null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);
		
							String[] messageArgs = {(String)eachOldArt.get(DomainConstants.SELECT_TYPE), (String)eachOldArt.get(SEL_MARKETING_NAME)};						
							String strMessage = MessageUtil.getMessage(context, null, "emxAWL.ReviseArtworkElement.ActiveTask.Deleted.Message",
									messageArgs, null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);
							
							RouteUtil.deleteActiveRouteByCopy(context, oldArtworkId,true, strMessage, strSubject);
							
							if (BusinessUtil.isNotNullOrEmpty(authorTemplate)) {
								RouteUtil.createArtworkRoute(context, context.getUser(), revisedArtId, true);
								RouteUtil.startArtworkAuthoringRoute(context, revisedArtId);
							}
							if (BusinessUtil.isNotNullOrEmpty(approverTemplate)) {
								RouteUtil.completeApprovalRoute(context, RouteUtil.getConnectedRoute(context, oldArtworkId, RouteUtil.getArtworkAction(context, oldArtworkId, false)));
								RouteUtil.createArtworkRoute(context, context.getUser(), revisedArtId, false);
							}
						
						}
					} else {
						if (BusinessUtil.isNotNullOrEmpty(authorTemplate))
							RouteUtil.createArtworkRoute(context, context.getUser(), revisedArtId, true);
						if (BusinessUtil.isNotNullOrEmpty(approverTemplate)) 
							RouteUtil.createArtworkRoute(context, context.getUser(), revisedArtId, false);
					}
				} catch(Exception e) {
					throw new RuntimeException(e);
				}
			};
		} catch(Exception e) {
			throw new FrameworkException(e);
		} finally {
			if(isContextPushed)
				ContextUtil.popContext(context);
		}
	}
	
	public void floatNewMasterRevToProductHierarchy(Context context, String[] args) throws FrameworkException	{
		try {
			String objectId = args[0];
			ArtworkMaster oldMaster = new ArtworkMaster(objectId);
			oldMaster.floatNewMasterRevToProductHierarchy(context);
		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}
	/*
	 * N94
	 * Trigger Check method invoked before master artwork element  deletion
	 * This method will check if artwork element is in active use or not.
	 Only Preliminary Artwork Elements with Single Revision and not associated with POA,Multiple Product can be deleted.
	 */
	public int checkActiveUsageOfElement(Context context, String[] args) throws FrameworkException
	{
		try {
			
			if(args.length == 0 )
				throw new IllegalArgumentException();	
			
			String objectId = args[0];
			
			ArtworkMaster am = new ArtworkMaster(objectId);
			String marketingname = AWLAttribute.MARKETING_NAME.getSel(context);
			StringList objSelects    = BusinessUtil.toStringList(SELECT_CURRENT,marketingname);
			Map selectsMap=am.getInfo(context, objSelects );
			String state=(String)selectsMap.get(DomainConstants.SELECT_CURRENT);
			String name=(String)selectsMap.get(marketingname);
			String message = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.delete.alert");

			if(!AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT).equalsIgnoreCase(state))
			{
				String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElementstate.Alert");
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, "\n", name, "\t", strMessage));
				return 1;
			}
			
			

			if( am.isIncludedInPOA(context) )
			{
				String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElementpoa.Alert");
 		        MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, "\n", name, "\t", strMessage));
				return 1;
			}

			if(am.isAssociatedWithMultipleProduct(context)){
				String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.delete.productalert");
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, "\n", name, "\t", strMessage));
				return 1;
			}
			
			
			BusinessObjectList list = am.getRevisions(context);
			if(list.size()>1)
			{
				String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElementrevision.Alert");
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, "\n", name, "\t", strMessage));
				return 1;
			}
			
			StringList artworkElementIds = am.getLocalCopies(context);
			for(String s : (List<String>) artworkElementIds ){
				ArtworkContent ac = ArtworkContent.getNewInstance(context, s);
				String objWhere = AWLUtil.strcat("((", SELECT_CURRENT, "!=", AWLState.PRELIMINARY.get(context, AWLPolicy.COPY_LIST), ")&&(",SELECT_CURRENT,"!=", AWLState.OBSOLETE.get(context, AWLPolicy.COPY_LIST), "))");
				MapList copylists = ac.getAssociatedCopyList(context, objWhere);
				if(!copylists.isEmpty()){
					String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.ArtworkElementCopyList");
					MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, "\n", name, "\t", strMessage));
					return 1;
				}
			}
			return 0;
			
			
		} catch (Exception e) {
			throw new FrameworkException(e.getMessage());
		}
	}

    //when Master Copy is transferred, transfer its base copy also
	public void transferOwnershipofBasecopy (Context context, String[] args) throws FrameworkException
	{
		try {
			String objectId = args[0];
			ArtworkMaster am = new ArtworkMaster(objectId);
			ArtworkContent baseElement = am.getBaseArtworkElement(context);
			if(baseElement==null)
			{
				return;
			}

			StringList selectList=new StringList();
			selectList.add(DomainConstants.SELECT_OWNER);
			selectList.add(AWLConstants.PROJECT);
			selectList.add(AWLConstants.ORGANIZATION);
			Map<?, ?> artworkMasterInfo = am.getInfo(context, selectList);
			artworkMasterInfo.remove(SELECT_ID);
			artworkMasterInfo.remove(SELECT_TYPE);

			String srcValue="";
			String dstnValue="";
			String command="";

			Map<?, ?> artworkBaseInfo = baseElement.getInfo(context, selectList);
			artworkBaseInfo.remove(SELECT_ID);
			artworkBaseInfo.remove(SELECT_TYPE);
            //compare artwork master with artwork base
			if( artworkMasterInfo.equals(artworkBaseInfo)){
				return;
			}			
			else{
				srcValue=(String)artworkMasterInfo.get(DomainConstants.SELECT_OWNER);
				dstnValue=(String)artworkBaseInfo.get(DomainConstants.SELECT_OWNER);
				if(!srcValue.equals(dstnValue))
				{
					baseElement.setOwner(context, srcValue);
				}
				srcValue=(String)artworkMasterInfo.get(AWLConstants.PROJECT);
				dstnValue=(String)artworkBaseInfo.get(AWLConstants.PROJECT);
				if(!srcValue.equals(dstnValue))
				{
					command="mod bus $1 project $2";
					MqlUtil.mqlCommand(context, command, true, baseElement.getObjectId(),srcValue);				
					
				}
				srcValue=(String)artworkMasterInfo.get(AWLConstants.ORGANIZATION);
				dstnValue=(String)artworkBaseInfo.get(AWLConstants.ORGANIZATION);
				if(!srcValue.equals(dstnValue))
				{
					command="mod bus $1 organization $2";
					MqlUtil.mqlCommand(context, command, true, baseElement.getObjectId(),srcValue);
									
				}
			}
			

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}

}

