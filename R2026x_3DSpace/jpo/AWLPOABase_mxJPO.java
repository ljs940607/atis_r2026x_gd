/*
 **  Copyright (c) 1992-2020 Dassault Systemes.
 **  All Rights Reserved.
 **  This program contains proprietary and trade secret information of MatrixOne,
 **  Inc.  Copyright notice is precautionary only
 **  and does not evidence any actual or intended publication of such program
 **
 */

import static com.matrixone.apps.awl.util.AWLConstants.MQL_NOTICE;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import matrix.db.Context;
import matrix.util.Pattern;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.ArtworkTemplate;
import com.matrixone.apps.awl.dao.CA;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.CopyList;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLInterface;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLRole;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.preferences.AWLGlobalPreference;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PolicyUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.dassault_systemes.enovia.changeaction.constants.ChangeActionGenericConstants;

@SuppressWarnings("PMD.TooManyMethods")
public class AWLPOABase_mxJPO extends AWLObject_mxJPO
{
	private static final String TEMPLATE_REV = "templateRev";
	private static final String TEMPLATE_NAME = "templateName";
	private static final String POA_REV = "poaRev";
	private static final String POA_NAME = "poaName";
	private static final String USER = "user";
	private static final String TASK_NAME = "taskName";
	private static final String MSG_SEPARATOR =" :: ";
	public static final String TO_OPENBRACKET = "to[";
	/**
	 * 
	 */
	private static final long serialVersionUID = -4218642101319634538L;

	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLPOABase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	/**
	 * Checks for Artwork Elements presence in the POA during promotion to Preliminary State
	 * @param context the eMatrix <code>Context</code> object
	 * @param   args      - String[] - JPO packed arguments
	 * @return - Boolean 0 or 1 based on validation
	 * @throws FrameworkException
	 * @author  Raghavendra M J (R2J)	 
	 * @Since  VR2015x.HF6
	 * Created during 'Copy List Highlight'
	 */
	@SuppressWarnings({ "rawtypes", "unchecked"})
	public int checkForArtworkAssemblyPresence(Context context,String args[]) throws FrameworkException
	{
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String POAId = args[0];

			POA poa = new POA(POAId);
			if(poa.isSelectedForObsolete(context)){
				return 0;
			}
			String SEL_INSTANCE_SEQUENCE = AWLAttribute.INSTANCE_SEQUENCE.getSel(context);
			String SEL_STRUCTURE_ELEMENTS = AWLUtil.strcat("from[", AWLRel.STRUCTURED_ARTWORK_MASTER.get(context), "].to.id");
			String SEL_STRUCTURED_MASTER_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			String ATTR_MARKETING_NAME = AWLAttribute.MARKETING_NAME.getSel(context);
			
			
			MapList artworkMastersList = poa.getArtworkMasters(context,StringList.create(ATTR_MARKETING_NAME, SEL_STRUCTURE_ELEMENTS, SEL_STRUCTURED_MASTER_ELEMENT),StringList.create(SEL_INSTANCE_SEQUENCE),null);
			if(artworkMastersList.isEmpty())
			{
				String strMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.checkConnectedObjectToPOA.Alert");
				MqlUtil.mqlCommand(context, MQL_NOTICE, strMessage);
				return 1;
			}
			
			//check for structure empty
			StringList structuredMastersWithoutStructure =  new StringList();
			for (Map elementMap :(List<Map>) artworkMastersList) {
				
				boolean isStructuredElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) elementMap.get(SEL_STRUCTURED_MASTER_ELEMENT));
				if(isStructuredElement && BusinessUtil.isNullOrEmpty(BusinessUtil.getStringList(elementMap, SEL_STRUCTURE_ELEMENTS)))
					structuredMastersWithoutStructure.add((String)elementMap.get(ATTR_MARKETING_NAME));
			}
			if(BusinessUtil.isNotNullOrEmpty(structuredMastersWithoutStructure)){
				String elmentMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.AddArtworkMaster.Error.Message") + structuredMastersWithoutStructure.join(",");
				MqlUtil.mqlCommand(context, MQL_NOTICE, elmentMessage);
				return 1;
			}
			
			return 0;

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**
	 * It has 3 checks. If it fails any one of the below condition then shows the appropriate message.
	 * First Check - All Artwork Elements should be approved.
	 * Second Check - No Artwork Element should be in obsolete state. 
	 * Third Check -  No Artwork Element should have active routes.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public int preliminaryPromotionCheck(Context context,String args[]) throws FrameworkException
	{
		try {
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String state = args[1]; 
			if(state.equals(AWLState.OBSOLETE.get(context, AWLPolicy.POA)))
				return 0;
			String POAId = args[0];
			POA poa = new POA(POAId);
			String release = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			String obsolete = AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			String approvalMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.isChildArtworkAssemblyReleased");
						
			ArtworkPackage artworkPackage = poa.getArtworkPackage(context);

			if(!AWLState.WORK_IN_PROCESS.get(context, AWLPolicy.ARTWORK_PACKAGE).equals(artworkPackage.getInfo(context, SELECT_CURRENT)))
			{
				String strMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.isArtworkPackageWorkInProcess");
				//${CLASS:emxContextUtilBase}.mqlNotice(context ,strMessage);
				MqlUtil.mqlCommand(context, MQL_NOTICE, strMessage);
				return 1;
			}
			String SEL_IS_COMPRISED = AWLUtil.strcat("tomid[", AWLRel.COMPRISED_ARTWORK_ASSEMBLY.get(context), "]");
			MapList artworkContentList = poa.getArtworkElements(context, BusinessUtil.toStringList(SELECT_ID, SELECT_CURRENT),
																BusinessUtil.toStringList(SEL_IS_COMPRISED));

			for(Map currentValues :(List<Map>) artworkContentList)
			{
				String current = (String)currentValues.get(SELECT_CURRENT);
				boolean released = current.equalsIgnoreCase(release);
				boolean fromComprisedArtworks = "true".equalsIgnoreCase((String)currentValues.get(SEL_IS_COMPRISED));
				if(!fromComprisedArtworks && !released)
				{
					MqlUtil.mqlCommand(context, MQL_NOTICE, approvalMessage);
					return 1;
				}	
				if(fromComprisedArtworks && !(released || current.equalsIgnoreCase(obsolete) ))
				{
				MqlUtil.mqlCommand(context, MQL_NOTICE, approvalMessage);
				return 1;
			}
			}
			for (Iterator iterator = artworkContentList.iterator(); iterator.hasNext();) {
				Map artworkContentMap = (Map) iterator.next();
				String artworkContentId  = (String)artworkContentMap.get(SELECT_ID);
				String action = RouteUtil.getArtworkAction(context, artworkContentId, true);
				String authoringRoute = RouteUtil.getConnectedRoute(context, artworkContentId, action);

				if(BusinessUtil.isNotNullOrEmpty(authoringRoute))
				{
					String activeRouteMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.ContentHasActiveTasks");
					//${CLASS:emxContextUtilBase}.mqlNotice(context, activeRouteMessage);
					MqlUtil.mqlCommand(context, MQL_NOTICE, activeRouteMessage);
					return 1;
				}
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * It checks any one of the Artwork Element is in obsolete state. 
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public int checkArtworkAssemblyInObsoleteState(Context context,String args[]) throws FrameworkException
	{
		try {
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String POAId = args[0];
			POA poa = new POA(POAId);
			if(poa.isCustomizationPOA(context)){
				return 0;
			}
			MapList artworkContentList = poa.getArtworkElements(context, BusinessUtil.toStringList(SELECT_ID, SELECT_CURRENT));
			StringList artworkContentStateList = BusinessUtil.toStringList(artworkContentList, SELECT_CURRENT); 
			if(artworkContentStateList.contains(AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT)))
			{
				String approvalMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.isChildArtworkAssemblyObsolete");
				//${CLASS:emxContextUtilBase}.mqlNotice(context, approvalMessage);
				MqlUtil.mqlCommand(context, MQL_NOTICE, approvalMessage);
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * It starts the POA Graphic Designer Route.   
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void startPOAGraphicDesignerRoute(Context context, String [] args) throws FrameworkException
	{
		String state = args[1]; 
		boolean isCMEnabled = POA.isCMEnabled(context);
		if(isCMEnabled || state.equals(AWLState.OBSOLETE.get(context, AWLPolicy.POA)))
			return ;

		String strPOAId =args[0];
		if(BusinessUtil.isNotNullOrEmpty(strPOAId))
		{
			/**
			 * As demotion of POA to preliminary will delete Routes hence we might need to create Routes if its not present. 
			 */
			String designerRoute = RouteUtil.getConnectedRoute(context, strPOAId, RouteUtil.getArtworkAction(context,strPOAId, true));
			if (BusinessUtil.isNullOrEmpty(designerRoute)) {
				String routeOwner = BusinessUtil.getInfo(context, strPOAId, AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_PACKAGE_CONTENT.get( context ), "].from.owner"));
				RouteUtil.createArtworkRoute(context, routeOwner, strPOAId, true);
			}
			RouteUtil.startArtworkAuthoringRoute(context, strPOAId);	
		}

	}
	

	/**
	* It starts the POA Artwork Approver Route.   
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero.
	* @since   AWL 2013x
	* @author  SubbaRao G(SY6)
	 * @throws Exception 
	*/
	public void startPOAApprovalRoute(Context context, String [] args) throws FrameworkException
	{
	     try {
	        if(POA.isCMEnabled(context))
			   return;
  
	        String poaID = getId(context);
	        POA poa=new POA(poaID);
		
	        if(poa.isSelectedForObsolete(context)){
	           return ;
	        }
	        //Fix IR-227144V6R2014x 
	        if(BusinessUtil.isNullOrEmpty(RouteUtil.getConnectedRoute(context, poaID, AWLConstants.POA_APPROVAL)))
	            RouteUtil.createArtworkRoute(context, BusinessUtil.getInfo(context, poaID, SELECT_OWNER), poaID, false);

	        RouteUtil.startArtworkApprovalRoute(context, poaID);		
                
	     } catch(Exception e) {
               throw new FrameworkException(e);
	     }
	}

	/**
	 * This trigger method  Will check for active routes on POA. If active routes are there then operation is blocked.   
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public int hasActiveRoutes(Context context,String[] args)throws FrameworkException
	{
		try
		{
			if(args.length == 0)
				throw new IllegalArgumentException();
			String objId = args[0];	
			String errKey = args[1];
			
			/* This API is used for Draft state promote check.
			 *check for Object Route relationship attributes "Route Base State" 
			 * if "Route Base State"== State_Preliminary, only  get such routes
			 */	
			DomainObject poa = new DomainObject(objId);
			
			
			//if "Route Base State"== State_Preliminary, only  get such routes					
			StringBuilder relWhere = new StringBuilder();
			relWhere.append(getAttributeSelect(AWLAttribute.ROUTE_BASE_STATE.get(context))).append("==").append(AWLState.PRELIMINARY.toString());
			
            String where = RouteUtil.getRouteWhereClause(context, null, new String[] {AWLState.DEFINE.get(context, AWLPolicy.ROUTE.get(context)),AWLState.INPROCESS.get(context, AWLPolicy.ROUTE.get(context)) });
    		
    	    StringList selectables = BusinessUtil.toStringList(DomainConstants.SELECT_ID);
    		
    	    MapList routes =  poa.getRelatedObjects(context, 
    													DomainConstants.RELATIONSHIP_OBJECT_ROUTE, DomainConstants.TYPE_ROUTE, 
    									                selectables, new StringList(), 
    									                false, true, 
    									                (short)1, 
    									                where, relWhere.toString(), 
    									                0);
			
    	    StringList routeIds = BusinessUtil.getIdList(routes);			
			
			if(BusinessUtil.isNotNullOrEmpty(routeIds)){
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLPropertyUtil.getI18NString(context, errKey));
				return 1;
			}
			return 0;	
		}
		catch(Exception e) {throw new FrameworkException(e);}
	}
	
	/**
	 * It checks active authoring route associated to the POA or not.   
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public static int hasActiveAuthoringRoute(Context context,String[] args)throws FrameworkException
	{
		try {
			if(POA.isCMEnabled(context))
				return 0;

			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			
			POA poa = new POA(args[0]);
			if(poa.isSelectedForObsolete(context)){
				return 0;
			}

			String strPOAId = args[0];
			String action = RouteUtil.getArtworkAction(context, strPOAId, true);
			String authoringRoute = RouteUtil.getConnectedRoute(context, strPOAId, action);

			if(BusinessUtil.isNotNullOrEmpty(authoringRoute))
			{	
				String activeRouteMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.NoActiveAuthoringRoutesOnPOA");
				//${CLASS:emxContextUtilBase}.mqlNotice(context ,activeRouteMessage);
				MqlUtil.mqlCommand(context, MQL_NOTICE, activeRouteMessage);
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * It checks all the Artwork Package connected items released or not While promoting the POA to Release state.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void promoteArtworkPackage(Context context,String[] args) throws FrameworkException
	{
		try{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			POA poa = new POA(args[0]);
			if(poa.isSelectedForObsolete(context)){
				return;
			}
			ArtworkPackage artworkPackage = poa.getArtworkPackage(context);
			StringList objSelects   = BusinessUtil.toStringList(SELECT_ID, SELECT_CURRENT);

			MapList artworkPackageConnectedItems = artworkPackage.getArtworkPackageConnectedItems(context, objSelects);
			StringList stateList    = BusinessUtil.toStringList(artworkPackageConnectedItems, SELECT_CURRENT);
			stateList	= BusinessUtil.toUniqueList(stateList);

			if(stateList.size() == 1 && stateList.contains(AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT)))
			{	
				artworkPackage.promote(context);
			}

		}catch(Exception e){ throw new FrameworkException(e);}
	}

	/**
	 * It promotes the Artwork from Approved state to Released State.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero.
	 * @since   AWL 2013x
	 * @author  SubbaRao G(SY6)
	 */
	public void promoteArtworkToReleaseState(Context context,String args[]) throws FrameworkException
	{
		String changeId = context.getCustomData(ChangeActionGenericConstants.customDataChangeIdKey);
		boolean isChangeTemplatePresent = BusinessUtil.isNotNullOrEmpty(changeId);
		try{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			if (!isChangeTemplatePresent) {
				POA poa = new POA(args[0]);
				if (poa.isSelectedForObsolete(context)) {
					return;
				}
				poa.promote(context);
			}
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	public void sendNotificationToSupplier( Context context, String[] args ) throws FrameworkException
	{
		try{
			DomainObject domPOA = DomainObject.newInstance(context, getObjectId(context), AWLConstants.APPLICATION_AWL);		
			Pattern typePattern = new Pattern(AWLType.COMPANY.get(context));
			typePattern.addPattern(AWLType.PERSON.get(context));
			Pattern relPattern = new Pattern(AWLRel.SUPPLIER_POA.get(context));
			relPattern.addPattern(AWLRel.MEMBER.get(context));
			StringList objectSelects = new StringList(2);
			objectSelects.add(DomainConstants.SELECT_ID);
			objectSelects.add(DomainConstants.SELECT_NAME);
			StringList relationshipSelects = new StringList(2);
			relationshipSelects.add(AWLAttribute.PROJECT_ROLE.getSel(context));

			MapList personList = domPOA.getRelatedObjects(context, relPattern.getPattern(), typePattern.getPattern(),
					objectSelects, relationshipSelects, 
					true, true, (short) 2, 
					null, null, 0);

			StringList	assigneeList = new StringList();
			for (Iterator iterator = personList.iterator(); iterator.hasNext();) {
				Map personMap = (Map)iterator.next();
				String personOrCompnayId = (String)personMap.get(DomainConstants.SELECT_ID);
				if(BusinessUtil.isKindOf(context, personOrCompnayId, AWLType.COMPANY.get(context)))
					continue;

				String personName = (String)personMap.get(DomainConstants.SELECT_NAME);
				String strPersonRoles = (String)personMap.get(AWLAttribute.PROJECT_ROLE.getSel(context));
				StringList personRolesList = FrameworkUtil.split(strPersonRoles, "~");
				if(personRolesList.contains(AWLRole.COMPANY_REPRESENTATIVE.toString()))
					assigneeList.add(personName);
			}

			String strSubjectKey = AWLPropertyUtil.getI18NString(context,"emxAWL.POASupplier.Message.Subject");
			String strMessageKey = AWLPropertyUtil.getI18NString(context,"emxAWL.POASupplier.Message.Description");

			//Send the notification to the project role
			/*${CLASS:emxMailUtilBase}.sendNotification( context,
					assigneeList,
					null,
					null,
					strSubjectKey,
					new String[]{},
					new String[]{},
					strMessageKey,
					new String[]{},
					new String[]{},
					new StringList(getObjectId(context)),
					null);*/
			sendNotification(context, assigneeList, strSubjectKey, strMessageKey, new StringList(getObjectId(context)));

		}catch(Exception e){ throw new FrameworkException(e);}
	}



	/**
	 * Called by Trigger on Policy of POA on State Review on action Demote.
	 * On POA Demote to ArtworkInProcess state from  Review  Approval Task will be deleted.
	 * @see also completeStoppedRoutes
	 * */
	public void deleteActiveApprovalTask (Context context, String[] args) throws FrameworkException
	{
		try {

			if(POA.isCMEnabled(context))
				return;

			String strPOAId = args[0];
			String strSubjectKey = args[1];
			String strMessageKey = args[2];
			deleteActiveApprovalTask(context, strPOAId, strSubjectKey, strMessageKey, false);

		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * Called by Trigger on Policy of POA on State Review on action Demote.
	 * On POA Demote to ArtworkInProcess state from  Review  Approval Task will be deleted.
	 * @deprecated
	 * */
	public void deleteActiveAuthoringTask (Context context, String[] args) throws FrameworkException
	{
		deleteActiveDesignerTask(context, args);
	}
	/**
	 * Called by Trigger on Policy of POA on State Review on Override Promote.
	 * On POA promote to ArtworkInProcess state to  Review  Route should be created if not present.
	 * @throws Exception 
	 * */
	public void createApprovalRouteIfRequire(Context context, String [] args) throws FrameworkException
	{
		if(POA.isCMEnabled(context))
			return;
		try{

		    if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
			throw new IllegalArgumentException();
		    String poaId = args[0];
		    POA poa=new POA(poaId);
		    if(poa.isSelectedForObsolete(context)){
			return;
		    }
		    if(BusinessUtil.isNotNullOrEmpty(poaId))
		    {
			String designerRoute = RouteUtil.getConnectedRoute(context, poaId, RouteUtil.getArtworkAction(context,poaId, false));
			if (BusinessUtil.isNullOrEmpty(designerRoute)) {
				String routeOwnerId = BusinessUtil.getInfo(context, poaId, AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_PACKAGE_CONTENT.get( context ), "].from.owner"));
				RouteUtil.createArtworkRoute(context, routeOwnerId, poaId, false);
			}
		    }
		}catch(Exception e){
            throw new FrameworkException(e);
		}
	}

	/**
	 * Called by Trigger on Policy of POA on State ArtworkInProcess on action Demote.
	 * On POA Demote to Preliminary state from  ArtworkInProcess  Graphic Designer Route and Task will be deleted.
	 * see also completeStoppedRoutes
	 * */
	public void deleteActiveDesignerTask (Context context, String[] args) throws FrameworkException
	{
		if(POA.isCMEnabled(context))
			return;
		try {
			String strPOAId = args[0];
			String strSubjectKey = args[1];
			String strMessageKey = args[2];
			deleteActiveTask(context, strPOAId, strSubjectKey, strMessageKey, true);
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	protected void deleteActiveTask(Context context, String strPOAId, String strSubjectKey, String strMessageKey, boolean authoring)
			throws FrameworkException {
		try{
			Map activeTaskMap = RouteUtil.getActiveTaskByCopy(context, strPOAId);
			// If the POA has some active routes, delete the route.

			if (activeTaskMap != null && !activeTaskMap.isEmpty()) {
				POA poa=new POA(strPOAId);
				String[] subjectMessageKeys=new String[]{TASK_NAME,USER};
				String[] messageKeys=new String[]{POA_NAME};

				String[] subjectKeyValues = {BusinessUtil.getString(activeTaskMap, SELECT_NAME),context.getUser()};
				String poaName=poa.getInfo( context, SELECT_NAME );
				String[] messageKeyValues = {poaName};
				String strSubject = AWLPropertyUtil.getI18NString(context, strSubjectKey, subjectMessageKeys, subjectKeyValues);
				String strMessage = AWLPropertyUtil.getI18NString(context, strMessageKey, messageKeys, messageKeyValues);

				RouteUtil.deleteActiveRouteByCopy(context, strPOAId, authoring, strMessage, strSubject);
			}
		}catch(Exception e){ throw new FrameworkException(e);}
	}


	protected void deleteActiveApprovalTask(Context context, String strPOAId, String strSubjectKey, String strMessageKey, boolean authoring)
			throws FrameworkException {
		try{
			Map activeTaskMap = RouteUtil.getActiveTaskByCopy(context, strPOAId);
			// If the POA has some active routes, delete the route.

			if (activeTaskMap != null && !activeTaskMap.isEmpty()) {
				POA poa=new POA(strPOAId);

				Map poaMap = BusinessUtil.getInfo(context, poa.getId(context), BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION));
				String poaName = BusinessUtil.getString(poaMap, SELECT_NAME);
				String poaRev = BusinessUtil.getString(poaMap, SELECT_REVISION);

				String[] messageKeys;
				String[] messageKeyValues;

				String strMessage = "";
				String taskName = BusinessUtil.getString(activeTaskMap, SELECT_NAME);

				ArtworkTemplate oldArtwrokTemplate = poa.getArtworkTemplate(context);
				if(oldArtwrokTemplate != null && oldArtwrokTemplate.getNextRevision(context) != null) {

					Map templateMap = BusinessUtil.getInfo(context, oldArtwrokTemplate.getId(context), BusinessUtil.toStringList(SELECT_NAME, SELECT_REVISION));
					String templateName = BusinessUtil.getString(templateMap, SELECT_NAME);
					String templateRev = BusinessUtil.getString(templateMap, SELECT_REVISION);

					messageKeys = new String[]{POA_NAME, POA_REV, TEMPLATE_NAME, TEMPLATE_REV, TASK_NAME,USER};					
					messageKeyValues =  new String[]{poaName, poaRev, templateName, templateRev, taskName, context.getUser()};					
					strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplateRevise.POA.ActiveApproverTask.Deleted.Message", messageKeys, messageKeyValues);
				} else {
					messageKeys = new String[]{POA_NAME};				
					messageKeyValues =  new String[]{poaName};					
					strMessage = AWLPropertyUtil.getI18NString(context, strMessageKey, messageKeys, messageKeyValues);
				}

				String[] subjectMessageKeys = new String[]{TASK_NAME,USER};
				String[] subjectKeyValues = new String[]{taskName,context.getUser()};
				String strSubject = AWLPropertyUtil.getI18NString(context, strSubjectKey, subjectMessageKeys, subjectKeyValues);

				RouteUtil.deleteActiveRouteByCopy(context, strPOAId, authoring, strMessage, strSubject);
			}
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	/**
	 * This will Checks the Composite Copy Elements in the POA are having latest and released list items.
	 * 
	 * @param   context            - the enovia <code>Context</code> object
	 * @param   ConstructorObject  - String - POA ObjectId
	 * @return  int - returns 1 if fails else 0.
	 * @throws  FrameworkException 
	 * @author  h49
	 * @since   R214.HF1
	 */
	public int checkCompositeHasLatestAndReleaseListItems(Context context,String[] args)throws FrameworkException
	{
		try{
			if(args.length == 0 )
				throw new IllegalArgumentException();			

			String state = args[1];
			if(state.equals(AWLState.OBSOLETE.get(context, AWLPolicy.POA)))
				return 0;

			String POAId = args[0];
			POA poa = new POA(POAId);
			MapList contents = poa.related(AWLType.ARTWORK_ELEMENT, AWLRel.ARTWORK_ASSEMBLY).
					id().query(context);
			StringList poalangs = poa.getLanguageNames(context);
			
			String alert = AWLPropertyUtil.getI18NString(context,"emxAWL.Composite.ListItemsError");
			boolean flag = false;
			StringList slCompMasters = new StringList();
			for(int i=0;i<contents.size();i++)
			{
				Map hMap = (Hashtable) contents.get(i);
				CopyElement content = new CopyElement((String) hMap.get(DomainConstants.SELECT_ID));
				ArtworkMaster am = content.getArtworkMaster(context);
				if(slCompMasters.contains(am.getId(context)))
					continue;
				else
					slCompMasters.addElement(am.getId(context));
				HashMap<String, StringList> resultMap = (HashMap <String, StringList>) am.hasCompositeAssociatedWithLatestAndReleaseListItems(context, poalangs);
				if(!resultMap.isEmpty())
				{
					flag = true;
					Set keys = resultMap.keySet();
					Iterator it = keys.iterator();
					while(it.hasNext())
					{
						String key = (String) it.next();
						StringList slLangs = resultMap.get(key);
						alert = AWLUtil.strcat(alert,am.getName(context),"-",slLangs.toString(),"\n");
					}					
				}
			}			
			if(flag)
			{
				//${CLASS:emxContextUtilBase}.mqlError(context, alert);
				MqlUtil.mqlCommand(context, "error $1",alert);
				return 1;
			}
			return 0;	
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	public void promoteConnectedArtworkFile(Context context, String[] args) throws FrameworkException 
	{
		try{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
	    	String poaId               =  args[0];
	    	String strCurrent             = args[1];
	    	POA domPOA = new POA(poaId);
	    	if(domPOA.isSelectedForObsolete(context))
	    		return;
	    	MapList connectedArtworkfileList = domPOA.related(AWLType.ARTWORK_FILE, AWLRel.PART_SPECIFICATION).to().sel(SELECT_ID).sel(SELECT_NAME).query(context);
	    	//TODO Need to validate the logic?
	    	if(connectedArtworkfileList.size() > 0)
	    	{
		    	Map connectedArtworkFile = (Map) connectedArtworkfileList.get(0);
		    	String strArtworkFileId = (String)connectedArtworkFile.get(SELECT_ID);
		    	DomainObject domArtworkFile = new DomainObject(strArtworkFileId);
		    	domArtworkFile.setState(context, strCurrent);
		    }
		}catch(Exception e){ throw new FrameworkException(e);}

	}

	/**
	 * see also
	 * @param context
	 * @param args
	 * @throws Exception
	 */
	public void demoteConnectedArtworkFile(Context context, String[] args) throws FrameworkException 
	{
		try{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			String poaId               =  args[0];
			String strCurrent             =  args[1];
			POA domPOA = new POA(poaId);
			MapList connectedArtworkfileList = domPOA.related(AWLType.ARTWORK_FILE, AWLRel.PART_SPECIFICATION).to().sel(SELECT_ID).sel(SELECT_NAME).query(context);
			//TODO Need to validate the logic?
			if(connectedArtworkfileList.size() > 0)
			{
				if((AWLState.ARTWORK_IN_PROCESS.get(context, AWLPolicy.POA)).equalsIgnoreCase(strCurrent))
					strCurrent = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_FILE.get(context));
				Map connectedArtworkFile = (Map) connectedArtworkfileList.get(0);
				String strArtworkFileId = (String)connectedArtworkFile.get(SELECT_ID);
				DomainObject domArtworkFile = new DomainObject(strArtworkFileId);
				domArtworkFile.setState(context, strCurrent);
			}
		}catch(Exception e){ throw new FrameworkException(e);}

	}


	/**
	 * @deprecated Since R2016x with POA Simplification highlight 
	 * Called by Revise Action Trigger on POA
	 * System will associate the latest Revision of the POA with the Latest Revision of the Master Copy List.
	 * @param   context ,args
	 * @throws   FrameworkException
	 * @since   AWL2013x.HF1
	 * @author  B1R
	 * @return void 
	 * Created during POA Synchronization Highlight . 
	 */
	public void connectLatestRevisedPOAandRevisedMCL( Context context, String[] args ) throws FrameworkException
	{
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	/** Called by Revise Action Trigger on POA
	 * The Artwork File is Revised without files.
	 * 	The latest Revision of the Artwork File will be Associated with the Latest Revision of POA
	 * @param   context ,args
	 * @throws   FrameworkException
	 * @since   AWL2013x.HF1
	 * @author  B1R
	 * @return void 
	 * Created during POA Synchronization Highlight . 
	 */
	public void reviseAndReConnectArtworkFile( Context context, String[] args ) throws FrameworkException
	{
		try {
			String objectId = args[0];
			ContextUtil.startTransaction(context, true);
			
			POA originalPOA = new POA(objectId);
			POA revisedPOA = originalPOA.getNextRevision(context,POA.class);
			
			if(revisedPOA != null){
				// Modified because of #HF-208188V6R2013x_, CPN/EC have revise trigger on part which will connect Objects connected through "Part Specification".
				//In AWL perspective only one Artwork File should be Connected with POA. Hence disconnecting all previous connection caused of CPN/EC trigger.
				revisedPOA.disconnectAllArtworkFiles(context);

				Set<String> partSpecRelAttrs = AWLRel.PART_SPECIFICATION.getAttributes(context);
				Map artworkFileMap = originalPOA.getArtworkFileWithRelAttributes(context, partSpecRelAttrs);

				DomainObject artworkFile = new DomainObject(((String)(artworkFileMap).get(SELECT_ID)));	
				String owner = artworkFile.getOwner(context).getName();
				Map<String, String> attributes = new HashMap<String, String>();
				for(String attr : partSpecRelAttrs){
					attributes.put(attr, BusinessUtil.getString(artworkFileMap, AWLUtil.strcat("attribute[", attr, "]")));
				}
				
				DomainObject revisedArtFile = new DomainObject(artworkFile.reviseObject(context, false).getObjectId());
				
				//revised POA and Artwork File are connected in ArtworkFile Revise trigger
				revisedArtFile.setOwner(context,owner);
				String  partSpecRelId  = revisedArtFile.getInfo(context, AWLUtil.strcat(TO_OPENBRACKET , AWLRel.PART_SPECIFICATION.get(context) , "].id"));
				new DomainRelationship(partSpecRelId).setAttributeValues(context, attributes);
			}
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	/** Called by Revise Action Trigger on POA.
	 * Disconnect all the Routes which are not complete on the Previous Revision of the POA and Float the same to the latest Revision of the POA.
	 * @param   context ,args
	 * @throws   FrameworkException
	 * @since   AWL2013x.HF1
	 * @author  B1R
	 * @return void 
	 * Created during POA Synchronization Highlight . 
	 */
	public void floatRoutesToRevisedPOA( Context context, String[] args ) throws FrameworkException
	{
		try {
			if(POA.isCMEnabled(context))
				return;
			String objectId = args[0];
			ContextUtil.startTransaction(context, true);
			POA originalPOA = new POA(objectId);
			POA revisedPOA = originalPOA.getNextRevision(context,POA.class);
			StringList routeStates = AWLPolicy.ROUTE.getStates(context, AWLState.COMPLETE, AWLState.ARCHIVE);

			if(revisedPOA != null){
				MapList routeMapList = originalPOA.getRoutesByStates(context, routeStates);
				for(Iterator routeItr = routeMapList.iterator(); routeItr.hasNext();)
				{	
					Map routeInfo = (Map)routeItr.next();
					String objectRouteRelationshipId  = BusinessUtil.getString(routeInfo, SELECT_RELATIONSHIP_ID);
					DomainRelationship.setFromObject(context, objectRouteRelationshipId, revisedPOA);
				}
			}
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	/** Called by Revise Action Trigger on POA.
	 * Disconnect the earlier Revision of the POA from the Artwork Package and Associate the Latest Revision of the POA with the same Artwork Package.
	 * @param   context ,args
	 * @throws   FrameworkException
	 * @since   AWL2013x.HF1
	 * @author  B1R
	 * @return void 
	 * Created during POA Synchronization Highlight . 
	 */
	public void connectRevisedPOAwithArtworkPackage( Context context, String[] args ) throws FrameworkException
	{
		try {
			String objectId = args[0];
			ContextUtil.startTransaction(context, true);
			POA originalPOA = new POA(objectId);			
			POA revisedPOA = originalPOA.getNextRevision(context,POA.class);

			if(revisedPOA != null){
				ArtworkPackage artworkPackage = originalPOA.getArtworkPackage(context);
				if(artworkPackage!=null)
				{
					artworkPackage.disconnectTo(context, AWLRel.ARTWORK_PACKAGE_CONTENT, originalPOA);
					artworkPackage.connectTo(context, AWLRel.ARTWORK_PACKAGE_CONTENT, revisedPOA);
				}
			}
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}

	/** Called by Revise Action Trigger on POA.
	 * Promote the POA and Artwork File to obsolete state.
	 * @param   context ,args
	 * @throws   FrameworkException
	 * @since   AWL2013x.HF1
	 * @author  B1R
	 * @return void 
	 * Created during POA Synchronization Highlight . 
	 */
	public void obsoletePreviousPOAandArtworkFile( Context context, String[] args ) throws FrameworkException
	{
		try {
			ContextUtil.startTransaction(context, true);
			String objectId = args[0];
			ContextUtil.startTransaction(context, true);
			POA originalPOA = new POA(objectId);			
			POA revisedPOA = originalPOA.getNextRevision(context,POA.class);

			if(revisedPOA != null){
				String obsoluteStateOfPOA = AWLState.OBSOLETE.get(context, AWLPolicy.POA);
				String obsoluteStateOfAF = AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_FILE);
				DomainObject artworkFile = originalPOA.getArtworkFile(context);
				originalPOA.setAttributeValue(context, AWLAttribute.BRANCH_TO.get(context), obsoluteStateOfPOA);
				originalPOA.promote(context);
				artworkFile.setAttributeValue(context, AWLAttribute.BRANCH_TO.get(context), obsoluteStateOfAF);
				artworkFile.promote(context);		

			}

			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	/** Called by Revise Action Trigger on POA.
	 * Associate the Owner of Old POA with Revised POA.
	 * @param   context ,args
	 * @throws   FrameworkException
	 * @since   AWL2013x.HF1
	 * @author  N94
	 * @return void 
	 * Created during POA Synchronization Highlight . 
	 */
	public void updateRevisedPOAInfoWithOriginal( Context context, String[] args ) throws FrameworkException
	{
		try {
			String objectId = args[0];
			ContextUtil.startTransaction(context, true);
			POA originalPOA = new POA(objectId);
			POA revisedPOA = originalPOA.getNextRevision(context,POA.class);
			if(revisedPOA != null)
			{
				String owner=originalPOA.getOwner(context).getName();
				revisedPOA.setOwner(context,owner);
			}		
			ContextUtil.commitTransaction(context);
		} catch (Exception e) {
			ContextUtil.abortTransaction(context);
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}

	/**
	 * Validate eligibility of POA for Obsolete	
	 * @param   context,Trigger agruments in args[] 
	 * @throws  FrameworkException 
	 * @since   AWL 2013x.HF1 Issue:-Added for HF-204960V6R2013x_
	 * @author  AA1
	 * Created during Cancellation of Artwork Package Highlight for Issue: HF-204960V6R2013x_ . 
	 */
	public int canMoveToObsoleteState(Context context,String args[]) throws FrameworkException
	{
		try {
			POA poa = new POA(getId(context));

			if(poa.canMoveToObsoleteState(context))
			{
				return 0;
			}
			else
			{
				//Alert message saying Complete or Cancelled Artwork Package not allowed to obsolete POA.
				String alertPOAObsoleteNotAllowed = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.POAObsoleteNotAllowed");
				//${CLASS:emxContextUtilBase}.mqlError(context , alertPOAObsoleteNotAllowed);
				MqlUtil.mqlCommand(context, "error $1",alertPOAObsoleteNotAllowed);
				return 1;
			}
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 *For all LocalCoies which are  present in current POA only.	
	Five Actions  1)Disconnect current element from Current POA 2)Disconnect from Current Artwork Package 3)Consider element for Demote states
			  4)Disconnect base Copy from Artwork Package 5)Consider BaseCopy for Demote states	
	 * @param   context,Trigger agruments in args[] 
	 * @throws  FrameworkException 
	 * @since   AWL 2013x.HF1 Issue:-Added for HF-204960V6R2013x_
	 * @author  AA1
	 * Created during Cancellation of Artwork Package Highlight for Issue: HF-204960V6R2013x_ . 
	 * @deprecated not used any more
	 */

	public void artworkContentsProcessingOnPOAObsolete( Context context, String[] args ) throws FrameworkException
	{
		try {

			POA poa = new POA(getId(context));
			ArtworkPackage artworkPackage = poa.getArtworkPackage(context);
			poa.artworkContentsProcessingOnPOAObsolete(context,artworkPackage);

		} catch (Exception e) { throw new FrameworkException(e);}

	}

	/**
	 *This API will perform below Actions on Obsolete POA, 1)disconnect artwork contents from POA. 2)Artwork File connected with POA will be moved to Obsolete State
	 * @param   context,Trigger agruments in args[] 
	 * @throws  FrameworkException 
	 * @since   AWL 2013x.HF1 Issue:-Added for HF-204960V6R2013x_
	 * @author  AA1
	 * Created during Cancellation of Artwork Package Highlight for Issue: HF-204960V6R2013x_ 
	 * @deprecated not used any more
	 */

	public void contentAndArtworkFileProcessing( Context context, String[] args ) throws FrameworkException
	{
		try {

			POA poa = new POA(getId(context));
			List<POA> listOfPOA=new ArrayList<POA>();
			listOfPOA.add(poa);
			ArtworkPackage artworkPackage = poa.getArtworkPackage(context);
			artworkPackage.cancelArtPkgProcessingActionsOnPOA(context,listOfPOA,false);

		} catch (Exception e) { throw new FrameworkException(e);}

	}

	/**
	 * Promote artwork Package on POA Obsolete if all other POA and elements are in release state
	 * @param   context ,Trigger agruments in args[]
	 * @throws  FrameworkException 
	 * @since   AWL 2013x.HF1 Issue:-Added for HF-204960V6R2013x_
	 * @author  AA1
	 * Created during Cancellation of Artwork Package Highlight for Issue: HF-204960V6R2013x_ . 
	 * @deprecated not used any more
	 */
	public void promoteArtworkPackageOnPOAObsolete( Context context, String[] args ) throws FrameworkException
	{
		try {
			POA poa = new POA(getId(context));
			if(poa.isSelectedForObsolete(context)){
				return;
			}
			
			ArtworkPackage artworkPackage = poa.getArtworkPackage(context);
			if(artworkPackage.isSelectedForCancel(context)){
				return;
			}
			artworkPackage.promoteArtworkPackageOnPOAObsolete(context,context.getSession().getLanguage());

		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * Method to complete the stopped routes
	 * @param context
	 * @param args
	 * @modified BY Naveen Bommu
	 * @throws FrameworkException
	 */
	public void completeStoppedRoutes(Context context, String[] args) throws FrameworkException {
		try {
			if(args == null || args.length < 2 || POA.isCMEnabled(context))
				return;
			//Fixed for IR-477853, 
			super.completeStoppedRoutes(context, args);
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * Connects the Revised POA with artwork template
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @author Subbarao G(SY6)
	 */
	public void connectRevisedPOAWithArtworkTemplate (Context context, String[] args) throws FrameworkException
	{
		try {
			POA oldPOA = new POA(getId(context));
			ArtworkTemplate template  = oldPOA.getArtworkTemplate(context);

			if(template == null) 
				return;

			String templateOwner = template.getOwner(context).getName();
			if(!templateOwner.equalsIgnoreCase(oldPOA.getOwner(context).getName())) {

				Map poaInfo = BusinessUtil.getInfo(context, oldPOA.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));
				Map templateInfo = BusinessUtil.getInfo(context, template.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));

				String poaName = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_NAME);
				String poaRev = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_REVISION);

				String[] subjectKeys=new String[]{POA_NAME, POA_REV};
				String[] subjectKeyValues=new String[]{poaName, poaRev};
				String[] messageKeys=new String[]{POA_NAME, POA_REV, TEMPLATE_NAME, TEMPLATE_REV};
				String[] messageKeyValues=new String[]{poaName, poaRev, BusinessUtil.getString(templateInfo, DomainConstants.SELECT_NAME), BusinessUtil.getString(templateInfo, DomainConstants.SELECT_REVISION)};

				String subjectKey = AWLPropertyUtil.getI18NString(context, "emxAWL.POARevise.NotifyArtworkTemplate.Subject", subjectKeys, subjectKeyValues);
				String messageKey = AWLPropertyUtil.getI18NString(context, "emxAWL.POARevise.NotifyArtworkTemplate.Message", messageKeys, messageKeyValues);

				/*${CLASS:emxMailUtilBase}.sendNotification( context,
						new StringList(templateOwner),
						null,
						null,
						subjectKey,
						new String[]{},
						new String[]{},
						messageKey,
						new String[]{},
						new String[]{},
						new StringList(),
						null);*/
				sendNotification(context, templateOwner, subjectKey, messageKey);
			}
			POA newPOA = new POA(oldPOA.getNextRevision(context));

			String relId = oldPOA.getRelationshipId(context, AWLType.ARTWORK_TEMPLATE, AWLRel.ASSOCIATED_ARTWORK_TEMPLATE, template.getObjectId(context), true);
			DomainRelationship.setFromObject(context, relId, newPOA);

		} catch (Exception e) { throw new FrameworkException(e); }	

	}

	/**
	 *  On Artwork Template Revise, Demote POA from review to Artwork In Process, Sends notification to the POA Owner.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the parameters
	 * @throws exception on failure
	 * @return void
	 * @author Subbarao G(SY6)
	 */
	public void NotifyPOAOwnerOnArtworkTemplateRevisePOADemote (Context context, String[] args) throws FrameworkException
	{
		try {

			String strSubjectKey = args[0];
			String strMessageKey = args[1];

			POA poa = new POA(getId(context));
			ArtworkTemplate template  = poa.getArtworkTemplate(context);

			boolean canNotify = template!=null && template.getNextRevision(context)!=null; 
			if(!canNotify)
				return;

			Map poaInfo = BusinessUtil.getInfo(context, poa.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));
			Map templateInfo = BusinessUtil.getInfo(context, template.getObjectId(context), BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.SELECT_REVISION));

			String poaName = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_NAME);
			String poaRev = BusinessUtil.getString(poaInfo, DomainConstants.SELECT_REVISION);

			String[] subjectKeys = new String[]{POA_NAME,POA_REV, TEMPLATE_NAME, TEMPLATE_REV};
			String[] subjectKeyValues = new String[]{poaName, poaRev, BusinessUtil.getString(templateInfo, DomainConstants.SELECT_NAME), BusinessUtil.getString(templateInfo, DomainConstants.SELECT_REVISION)};
			String[] messageKeys = new String[]{POA_NAME, POA_REV, TEMPLATE_NAME, TEMPLATE_REV};
			String[] messageKeyValues = new String[]{poaName, poaRev, BusinessUtil.getString(templateInfo, DomainConstants.SELECT_NAME), BusinessUtil.getString(templateInfo, DomainConstants.SELECT_REVISION)};

			strSubjectKey = AWLPropertyUtil.getI18NString(context, strSubjectKey, subjectKeys, subjectKeyValues);
			strMessageKey = AWLPropertyUtil.getI18NString(context, strMessageKey, messageKeys, messageKeyValues);

			/*${CLASS:emxMailUtilBase}.sendNotification( context,
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
	
	
	private int checkAssociatedChangeActionState(Context context, POA poa, AWLState CA_STATE_TO_CHECK, String msgKey) throws FrameworkException {
		try {
			if(!POA.isCMEnabled(context) || poa.isSelectedForObsolete(context))
				return 0;
            
			String changeActionId = BusinessUtil.getId(poa.getActiveChangeAction(context));
			
			if(BusinessUtil.isNullOrEmpty(changeActionId)){
				return 0;
			}
			CA changeAction = new CA(context, changeActionId);
			
			if(!CA_STATE_TO_CHECK.get(context, AWLPolicy.CHANGE_ACTION).equals(changeAction.getInfo(context, SELECT_CURRENT)))
			{
				String strMessage = AWLPropertyUtil.getI18NString(context, msgKey);
				MqlUtil.mqlCommand(context, MQL_NOTICE, strMessage);
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * If Promotion of POA fails for the below condition then shows the appropriate message.
	 * Condition Checks ==> For State of Change Action == "In Work" State or Not  
	 * @param   context
	 * @param   args
	 * @throws  FrameworkException - when args size is zero.
	 * @since   AWL 2015x
	 * @author  Raghavendra M J (R2J)
	 * Created during "Enterprise Change Management" Highlight. 
	 */
	public int checkChangeActionInWorkState(Context context, String args[]) throws FrameworkException
	{
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
          
			POA poa = new POA(args[0]);
			return checkAssociatedChangeActionState(context, poa, AWLState.IN_WORK, "emxAWL.Alert.ChangeActionNotInWorkState");
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * If Promotion of POA fails for the below condition then shows the appropriate message.
	 * Condition Checks ==> For State of Change Action == "In Approval" State or Not  
	 * @param   context
	 * @param   args
	 * @throws  FrameworkException - when args size is zero.
	 * @since   AWL 2015x
	 * @author  Raghavendra M J (R2J)
	 * Created during "Enterprise Change Management" Highlight. 
	 */
	public int checkChangeActionInApprovalState(Context context, String args[]) throws FrameworkException
	{
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			POA poa = new POA(args[0]);
			return checkAssociatedChangeActionState(context, poa, AWLState.IN_APPROVAL, "emxAWL.Alert.ChangeActionNotInApprovalState");
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * If Promotion of POA fails for the below condition then shows the appropriate message.
	 * Condition Checks ==> For State of Change Action == "Complete" State or Not  
	 * @param   context
	 * @param   args
	 * @throws  FrameworkException - when args size is zero.
	 * @since   AWL 2015x
	 * @author  Raghavendra M J (R2J)
	 * Created during "Enterprise Change Management" Highlight. 
	 */
	public int checkChangeActionCompleteState(Context context, String args[]) throws FrameworkException
	{
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			POA poa = new POA(args[0]);
			return checkAssociatedChangeActionState(context, poa, AWLState.COMPLETE, "emxAWL.Alert.ChangeActionNotInCompleteState");
		} catch (Exception e) { throw new FrameworkException(e);}
	}


	/**
	 * Action trigger to Promote the "Artwork Package" to "Cancel" State only after moving last "POA" to "Obsolete" state.
	 * @param context
	 * @param args
	 * @throws FrameworkException - when args size is zero.
	 * @since AWL 2015x
	 * @author n94
	 * Created during "Enterprise Change Management" Highlight. 
	 * @deprecated 
	 */

	public void promoteArtworkPackageToCancelOnLastPOAObsolete(Context context, String args[]) throws FrameworkException
	{
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			
			POA poa = new POA(args[0]);
			ArtworkPackage artworkPackage = poa.getArtworkPackage(context);
			
			//If artwork package is null,return
			if(artworkPackage==null){
				return;
			}
		    
			MapList connectedPOAs = artworkPackage.getAllPOAMapList(context, new StringList(SELECT_CURRENT));
			StringList poastateList= BusinessUtil.toStringList(connectedPOAs, SELECT_CURRENT);

			boolean containsOnlyObsoleteState = BusinessUtil.matchingAllStringListValues(poastateList, AWLState.OBSOLETE.get(context, AWLPolicy.POA));
			if(containsOnlyObsoleteState)
			{
				artworkPackage.markForCancel(context);
				
				//IR-472825 --> We need to skip the 'Artwork package cancellation if already cancelled.' , Case --> This case arises when we have multiple POAs.
				String cancelledStateAP = AWLState.CANCELLED.get(context, AWLPolicy.ARTWORK_PACKAGE);
				if(!artworkPackage.getInfo(context, SELECT_CURRENT).equalsIgnoreCase(cancelledStateAP))
					artworkPackage.promote(context);
			}
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	
	
	/**
	 * Check trigger to check the previous evolution of POA is obsoleted prior to releasing the latest evolution
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * @author N94
	 * Created during POA Simplification Highlight
	 * @deprecated
	 */
	public int checkPreviousEvolutionPOAInObsoleteState(Context context,String args[]) throws FrameworkException
	{
		try {
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String POAId = args[0];
			POA poa = new POA(POAId);

			POA previousEvolutionPOA=poa.getPreviousEvolutionPOA(context);
			
			if(previousEvolutionPOA==null)
				return 0;
			boolean inObsoleteState = PolicyUtil.checkState(context, previousEvolutionPOA.getId(context),AWLState.OBSOLETE.get(context, AWLPolicy.POA), PolicyUtil.EQ);

			if(!inObsoleteState)
			{
				String Message = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.PreviousEvolutionPOANotInStateObsolete");
				Message=AWLUtil.strcat(Message,"\n",previousEvolutionPOA.getName());
				//${CLASS:emxContextUtilBase}.mqlNotice(context, Message);
				MqlUtil.mqlCommand(context, MQL_NOTICE, Message);
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * Check Trigger to Check the Disconnection from POA --> 'Artwork Assembly' <-- 'Artwork Element'
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - Arguments
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @return 0 or 1 based on the validations.
	 * @Since VR2015x.HF4 
	 * Created during 'Copy List Highlight'
	 */
	@SuppressWarnings("unused") // TODO This Method will be used in future for Is Mandatory Check on the Artwork Assembly while Artwork Element Removal.
	private int isMandatoryAssemblyElement(Context context,String args[]) throws FrameworkException
	{
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String fromObjectId = args[0];
			String relationshipId = args[1];

			//Trigger is applicable only when  where from side is POA for Artwork Assembly Disconnect.
			if(BusinessUtil.isKindOf(context, fromObjectId, AWLType.POA.get(context)))
			{
				//Remove Country will not validate 'Is Mandatory', if element is removed from POA due to 'Geographic Validation'
				if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(PropertyUtil.getGlobalRPEValue(context, AWLConstants.GEO_DISCONNECT))) 
				{
					return 0;
				}

				String isMandatory = DomainRelationship.getAttributeValue(context, relationshipId, AWLAttribute.IS_MANDATORY.get(context));

				//Blocking the disconnection if relationship is Mandatory attribute is TRUE
				if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(isMandatory) || AWLConstants.IS_MANDATORY_RANGE_YES.equalsIgnoreCase(isMandatory))
				{
					String Message = AWLPropertyUtil.getI18NString(context,"emxAWL.Message.IsMandatroyMessage");
					MqlUtil.mqlCommand(context, MQL_NOTICE, Message);
					return 1;
				}
			}
			return 0;

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	/**
	 * Check Trigger to Check whether Artwork Package is in Create/Assign state or else do not allow the operation
	 * To Demote POA to Draft state Artwork Package should be in Create/Assign state.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - Arguments
	 * @throws FrameworkException
	 * @author ukh1 (Utkarsh Kumar Singh)
	 * @return 0 or 1 based on the validations.
	 * @Since VR2015x.HF4 
	 * Created during 'Copy List Highlight'
	 */
	public int checkArtworkPackageStateToDemote(Context context, String args[]) throws FrameworkException
	{
		try
		{
		      String objId = args[0];
		      POA poaobj = new POA(objId);
		      ArtworkPackage ap = poaobj.getArtworkPackage(context);
		      String current = ap.getInfo(context, SELECT_CURRENT);
		      if(AWLState.CREATE.get(context, AWLPolicy.ARTWORK_PACKAGE).equalsIgnoreCase(current) || 
		         AWLState.ASSIGN.get(context, AWLPolicy.ARTWORK_PACKAGE).equalsIgnoreCase(current)){
		            return 0;
		      }
		      MqlUtil.mqlCommand(context, MQL_NOTICE, AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.APNotInCreateOrAssignState"));
		      return 1;
		}
		catch(Exception e){throw new FrameworkException(e);}
	}
	
	/**
	 * Connect all applicable Copy list and flag mandatory elements on POA Assembly. 
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * @author aa1
	 * Created during POA Simplification Highlight
	 */
	@SuppressWarnings("unchecked")
	public void connectCopyListAndFlagMandatoryElements(Context context, String args[]) throws FrameworkException
	{
		/*
		 * IR-766427-3DEXPERIENCER2018x : mand CL is already added in draft state now.Trigger calling this fn is also disabled.
		 * try {
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			
			String state = args[1];
			if(state.equals(AWLState.OBSOLETE.get(context, AWLPolicy.POA)))
				return ;
			
			String POAId = args[0];
			POA poa = new POA(POAId);
			if(poa.isCustomizationPOA(context)){
				return ;
			}
			//Get Applicable Mand Copy List for POAs
			StringList  listSelect = new StringList();
			listSelect.add(SELECT_ID);
			MapList	copyListMapList= poa.getCopyLists(context,listSelect , "");
			StringList existingCopyListsOnPOA = BusinessUtil.toStringList(copyListMapList, SELECT_ID);
			
			StringList allApplicableCopyListsForPOA = poa.getAllApplicableCopyLists(context);//getAllApplicableCopyLists or getApplicableCopyListsMandatory
			StringList copyListToDisconnect = new StringList(existingCopyListsOnPOA);
			copyListToDisconnect.removeAll(allApplicableCopyListsForPOA);
			StringList copyListsToConnect = new StringList(allApplicableCopyListsForPOA);
			copyListsToConnect.removeAll(existingCopyListsOnPOA);
			
			//Fix for the issue --> IR-483686
			//For Copy List to be connected to POA, We need to have at least one common element between the elements after passing all the basic conditions.
			StringList artworkAssemblyIds = BusinessUtil.toStringList(poa.getArtworkElements(context, null), SELECT_ID);
			List<String> tempCopyListIds = new StringList(copyListsToConnect);
			
			for (String  copyListId : tempCopyListIds) {
				StringList copyListArtworkElementIds = BusinessUtil.toStringList(new CopyList(copyListId).getArtworkElements(context), SELECT_ID);
				
				if(!BusinessUtil.matchingAnyValue(artworkAssemblyIds, copyListArtworkElementIds))
					copyListsToConnect.remove(copyListId);
			}
			
			//Connect Copy List to POA				
			poa.connectTo(context, AWLRel.POA_COPY_LIST, AWLUtil.getDomainObjectList(copyListsToConnect));
			
			//Stamp POA assembly with Mandatory Flag.
			Set<String> mandatroyElementsRelIds=  poa.updatePOAAssemblyWithMandatoryAttribute(context, allApplicableCopyListsForPOA);
			//Disconnect Copy Lists from POA which are not applicable Now.
			if(!copyListToDisconnect.isEmpty())
			poa.disconnectTo(context, AWLRel.POA_COPY_LIST, AWLUtil.getDomainObjectList(copyListToDisconnect));
			
			String SEL_IS_MAND_ATTR = AWLAttribute.IS_MANDATORY.getSel(context);
			//Get POA Assembly elements relationship id and attribute mandatory value.
			MapList paoArtworkAssembly = poa. related(AWLType.ARTWORK_ELEMENT, AWLRel.ARTWORK_ASSEMBLY).id().relid().relAttr(AWLAttribute.IS_MANDATORY).query(context);
			String isMandatoryAtrSelect = AWLAttribute.IS_MANDATORY.get(context);
			for(Map elementMap:(List<Map>) paoArtworkAssembly){
				String assemblyRelId = (String) elementMap.get(DomainRelationship.SELECT_ID);
				String mandAtrValue = (String) elementMap.get(SEL_IS_MAND_ATTR);
				//Check if its marked mandatory in above steps then ignore this also ignore if currently its false.
				if(!mandatroyElementsRelIds.contains(assemblyRelId) && (mandAtrValue.equalsIgnoreCase(AWLConstants.RANGE_TRUE)||mandAtrValue.equalsIgnoreCase(AWLConstants.RANGE_YES))){
					//Modify attribute to Un-mark flag
					DomainRelationship relObject = new DomainRelationship(assemblyRelId);
					relObject.setAttributeValue(context,isMandatoryAtrSelect, AWLConstants.RANGE_FALSE);	
				}
				
			}
			
		} catch (Exception e) { throw new FrameworkException(e);}
		*/
	}
	/**
	 * Check if user has missed any mandatory elements from copy lists. Note: Geography rule will be applied on considering Mandatory element. 
	 * @param context
	 * @param args
	 * @return 1 if poa has not connected with applicable mandatory element. 0 if POA assembly is proper.
	 * @throws FrameworkException
	 * @author aa1
	 * Created during POA Simplification Highlight
	 */
	public int hasMandatoryElements(Context context,String args[]) throws FrameworkException
	{
		try {
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String state = args[1];
			if(state.equals(AWLState.OBSOLETE.get(context, AWLPolicy.POA)))
				return 0;
			
			String POAId = args[0];
			POA poa = new POA(POAId);
			
			if(poa.isCustomizationPOA(context)){
				return 0;
			}
			
			//Get Applicable Mand Copy List for POAs
			StringList applicableMandCopyListsForPOA = poa.getApplicableCopyListsMandatory(context);

			//Get Mandatory Elements for given copy List and given languages
			Set<String>[] mandatoryElementsIdsarray = CopyList.getCopyListsMandatoryElemnts(context, applicableMandCopyListsForPOA, poa.getLanguageNames(context));
			//Get Mandatory inline copies Artwork Master Id separately
			Set<String> mandatoryElementsIds = mandatoryElementsIdsarray[0] ;
			Set<String> inlineMasterCopiesId = mandatoryElementsIdsarray[1] ;
			
			//Get elments Ids and inline copies Artwork Master Id separately for POA
			Set<String>[] poaElementsInLineIdsarray =getArtworkElementsAndInlineMaster(context, poa);
			Set<String> poaElementsIds = poaElementsInLineIdsarray[0] ;
			Set<String> poaInlineMasterIds = poaElementsInLineIdsarray[1] ;
			Set<String> poaMasterIds =poaElementsInLineIdsarray[2] ;
			//Verify if POA has missed any mandatory element 
			StringBuilder missingElementNames=new StringBuilder();
			StringBuilder missingMasterNames=new StringBuilder();
			Set<String> stillNotConnectedElements =new HashSet(mandatoryElementsIds);
			stillNotConnectedElements.removeAll(poaElementsIds);
			StringList poaCountryIds= BusinessUtil.getInfoList(context, POAId, AWLUtil.strcat("from[", AWLRel.POA_COUNTRY.get(context), "].to.id"));
			//Exlucde geography for non inline elemements.
			if(!stillNotConnectedElements.isEmpty())
			{
				StringBuilder[] missingAssemblyNames=  considerValidGeographyElements(context,poaCountryIds,stillNotConnectedElements,poaMasterIds);
				missingElementNames = missingAssemblyNames[0];
				missingMasterNames = missingAssemblyNames[1];
			}
			
			//Verify if POA has missed any mandatory inline element 
			StringBuilder missingInlineMasterNames=new StringBuilder();
			Set<String> stillNotConnectedInlineMaster=new HashSet(inlineMasterCopiesId);
			stillNotConnectedInlineMaster.removeAll(poaInlineMasterIds);
			//Exlucde geography for inline elemements.
			if(!stillNotConnectedInlineMaster.isEmpty())
			{
				missingInlineMasterNames = considerValidGeographyMaster(context, poaCountryIds, stillNotConnectedInlineMaster);
			}
			if(missingElementNames.length() > 0 ||missingMasterNames.length() > 0 || missingInlineMasterNames.length()>0 ){

				StringList copyListNames= BusinessUtil.getInfo(context, new StringList(new ArrayList<String>(applicableMandCopyListsForPOA)), SELECT_NAME);
				String copyListMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.CheckMessagePOA.MandCopyListMissing");
				String elmentMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.CheckMessagePOA.MandElementMissing");
				String inlineMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.CheckMessagePOA.MandMasterMissing");
				
				copyListMessage = AWLUtil.strcat(copyListMessage,MSG_SEPARATOR ,copyListNames,"\n");
				elmentMessage=	missingElementNames.length() > 0 ?AWLUtil.strcat(elmentMessage,"\n",missingElementNames.toString(),"\n"):"";
				inlineMessage=	(missingMasterNames.length() > 0 || missingInlineMasterNames.length() > 0) ?AWLUtil.strcat(inlineMessage,"\n",
						missingMasterNames.toString(),missingInlineMasterNames.toString(),"\n"):"";
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(copyListMessage,elmentMessage,inlineMessage));
				return 1;
			}
			return 0;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**
	 * Get current POA Assembly elements and  get inline Master id separately.
	 * @param context
	 * @param conext
	 * @param POA
	 * @return Set<string>[0] : POA assembly element Id
	 *  	   Set<string>[1] : POA assembly inline element's master Id 
	 * @throws FrameworkException
	 * @author aa1
	 * Created during POA Simplification Highlight
	 */
	private Set<String>[] getArtworkElementsAndInlineMaster(Context context,POA poa) throws FrameworkException{
		StringList objSelects = new StringList();
		objSelects.addElement(DomainConstants.SELECT_ID);
		String masterInlineAtrSelect = AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.", AWLAttribute.INLINE_TRANSLATION.getSel(context));
		String masterIdSelect = AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.", SELECT_ID);
		objSelects.addElement(masterInlineAtrSelect);
		objSelects.addElement(masterIdSelect);
		
		//Get POA Assembly elements.
		MapList paoArtworkAssembly = poa.getArtworkElements(context,objSelects);
		Set<String> poaElementsIds =new HashSet<String>();
		//Get Present masters of inline elements and local copy element id.
		Set<String>  poaInlineMasterIds =new HashSet<String>();
		
		//Master Ids which are connected to POA.
		Set<String> poaMasterIds =new HashSet<String>();
		for(Map poaElementInfo:(List<Map>)paoArtworkAssembly ){
			String elementId = (String) poaElementInfo.get(SELECT_ID);
			String masterInlineAtrValue = (String) poaElementInfo.get(masterInlineAtrSelect);
			String masterId = (String) poaElementInfo.get(masterIdSelect);
			if(AWLConstants.RANGE_YES.equalsIgnoreCase(masterInlineAtrValue)){
				poaInlineMasterIds.add(masterId);
			}else{
				poaElementsIds.add(elementId);
				poaMasterIds.add(masterId);
			}
		}
		
		Set[] poaElementsIdsarray=new Set[3];
		poaElementsIdsarray[0] = poaElementsIds;
		poaElementsIdsarray[1] = poaInlineMasterIds;
		poaElementsIdsarray[2] = poaMasterIds;
		return poaElementsIdsarray;
		
	}	

	/**
	 * Exculde elements considering geographical location defined on element.  
	 * @param context
	 * @param countries Id to verify
	 * @param artwork elment Ids to verify for geography 
	 * @return String: Message Master Copy Names along with local copy names.
	 * @throws FrameworkException
	 * @author aa1
	 * Created during POA Simplification Highlight
	 */
	private StringBuilder[] considerValidGeographyElements(Context context,StringList poaCountryIds,Set<String> artworkElementsToverify,Set<String> poaMasterIds)throws FrameworkException{
		
		StringBuilder validElementNames=new StringBuilder();
		StringBuilder validMasterNames=new StringBuilder();
		//Geography check is required
		StringList artworkElementSelects = new StringList();
		artworkElementSelects.addElement(DomainConstants.SELECT_NAME);
		String languageNames= AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context);
		artworkElementSelects.addElement(languageNames);
		String masterNameSelect = AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.", SELECT_NAME);
		String masterIdSelect = AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.", SELECT_ID);
		String masterTitleSelect = AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.", AWLAttribute.MARKETING_NAME.getSel(context));
		String masterCountriesIds = AWLUtil.strcat(TO_OPENBRACKET, AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.from[",AWLRel.COUNTRIES_ASSOCIATED.get(context) , "].to.id");
		artworkElementSelects.add(masterNameSelect);
		artworkElementSelects.add(masterIdSelect);
		artworkElementSelects.add(masterTitleSelect);
		artworkElementSelects.add(masterCountriesIds);
		
		MapList artworkElementInfo = BusinessUtil.getInfoList(context,new StringList(new ArrayList<String>(artworkElementsToverify)), artworkElementSelects);
		
		Map<String, List<String>> masterCopyNameAndLCNames=new HashMap<String, List<String>>();
		Set<String> masterCopyNames =new HashSet<String>();
		String nameToDisplay="",elementName="",elementLangName="",masterName="", masterTitle="",masterId="";
		StringList mastercountryId=new StringList();
		List<String> localCopyNames=new ArrayList<String>();
		for(Map masterInfo:(List<Map>)artworkElementInfo ){
			 elementName = BusinessUtil.getFirstString(masterInfo, SELECT_NAME);
			 masterName = BusinessUtil.getFirstString(masterInfo, masterNameSelect);
			 masterId = BusinessUtil.getFirstString(masterInfo, masterIdSelect);
			 masterTitle = BusinessUtil.getFirstString(masterInfo, masterTitleSelect); 
			 mastercountryId = (StringList) masterInfo.get(masterCountriesIds);
			//Geogrpahy is valid and element need to be added to POA as mandatory element  
			if(BusinessUtil.isNullOrEmpty(mastercountryId) || BusinessUtil.matchingAnyValue(poaCountryIds, mastercountryId)){
				nameToDisplay=AWLUtil.strcat(masterTitle,MSG_SEPARATOR,masterName);
				//If Master Connected then show each language details. Otherwise show Master Copy Name
				if(poaMasterIds.contains(masterId.trim())){
					elementLangName = BusinessUtil.getFirstString(masterInfo, languageNames);
					localCopyNames =	masterCopyNameAndLCNames.get(nameToDisplay);
					if(localCopyNames == null){
						localCopyNames=new ArrayList<String>();
					}
					localCopyNames.add(AWLUtil.strcat(elementLangName,"[", elementName ,"]"));
					masterCopyNameAndLCNames.put(nameToDisplay, localCopyNames);
				}else{
					masterCopyNames.add(nameToDisplay);
				}
			}
		}
		
		for(String displayName :masterCopyNameAndLCNames.keySet()){
			validElementNames.append(displayName).append(MSG_SEPARATOR).append(masterCopyNameAndLCNames.get(displayName)).append('\n');
		}
		
		for(String displayName :masterCopyNames){
			validMasterNames.append(displayName).append('\n');
		}
		
		StringBuilder[] namesToReturn = new StringBuilder[2];
		namesToReturn[0] = validElementNames;
		namesToReturn[1] = validMasterNames;
		return namesToReturn;
	}
	
	/**
	 * Exculde master considering geographical location defined on master.  
	 * @param context
	 * @param countries Id to verify
	 * @param artwork master Ids to verify for geography 
	 * @return String: Message Master Copy Names along with local copy names.
	 * @throws FrameworkException
	 * @author aa1
	 * Created during POA Simplification Highlight
	 */
private StringBuilder considerValidGeographyMaster(Context context,StringList poaCountryIds,Set<String> artworkMastersToverify)throws FrameworkException{
	
		StringBuilder missingInlineMasterNames=new StringBuilder();
		//Geography check is required
		StringList artworkElementSelects = new StringList();
		String masterCountriesIds = AWLUtil.strcat("from[", AWLRel.COUNTRIES_ASSOCIATED.get(context), "].to.id");
		artworkElementSelects.add(masterCountriesIds);
		artworkElementSelects.add(DomainConstants.SELECT_NAME);
		String masterTitleSelect =AWLAttribute.MARKETING_NAME.getSel(context);
		artworkElementSelects.add(masterTitleSelect);
		
		MapList artworkElementInfo = BusinessUtil.getInfoList(context,new StringList(new ArrayList<String>(artworkMastersToverify)), artworkElementSelects);
		
		String nameToDisplay="";
		StringList mastercountryId=new StringList();
		
		for(Map masterInfo:(List<Map>)artworkElementInfo ){
			nameToDisplay = AWLUtil.strcat(BusinessUtil.getFirstString(masterInfo, masterTitleSelect),MSG_SEPARATOR, BusinessUtil.getFirstString(masterInfo, SELECT_NAME)); 
			mastercountryId = (StringList) masterInfo.get(masterCountriesIds);
			//Geogrpahy is valid and element need to be added to POA as mandatory element  
			if(BusinessUtil.isNullOrEmpty(mastercountryId) || BusinessUtil.matchingAnyValue(poaCountryIds, mastercountryId)){
				missingInlineMasterNames.append(nameToDisplay).append('\n');
			}
		}
		
		return missingInlineMasterNames;
	}
	
	/**
	 * checks if comprised artwork assembly relationship still exists because of
	 * Custom POA and artwork Elements, if not then remove the artwork assembly 
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - Arguments
	 * @throws FrameworkException
	 * @author UKH1 (Utkarsh Kumar Singh)
	 * @since AWL 2015x.HF5 "Customization and Kit Support Highlight"
	 */
	public void checkAndDisconnectArtworkAssembly(Context context, String args[]) throws FrameworkException 
	{
		try 
		{
			String artworkAssemblyRelId = args[0].trim();

			if(!BusinessUtil.isConnectionExist(context, AWLRel.ARTWORK_ASSEMBLY, artworkAssemblyRelId, false, false))
				return;
			
			DomainRelationship relObj = new DomainRelationship(artworkAssemblyRelId);

			relObj.openRelationship(context);
			POA poaobj = new POA(relObj.getFrom().getObjectId());
			ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, relObj.getTo().getObjectId());

			String relSelect = AWLUtil.strcat("tomid[", AWLRel.COMPRISED_ARTWORK_ASSEMBLY.get(context), "].id");
			StringList comprisedArtworkIDs= BusinessUtil.getRelInfoList(context, artworkAssemblyRelId, relSelect);
			if ((comprisedArtworkIDs.isEmpty())) {
				poaobj.removeLocalCopyFromPOAAssembly(context, artworkContent);
			}
			relObj.closeRelationship(context, true);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public void doPOAObsoleteActions(Context context, String args[]) throws FrameworkException {
		try 
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			
			POA poa = new POA(args[0]);
			ArtworkPackage artworkPackage = poa.getArtworkPackage(context);
			
			if(artworkPackage == null || 
			   !AWLState.OBSOLETE.get(context, AWLPolicy.POA).equals(poa.getInfo(context, SELECT_CURRENT))) {
				//If artwork package is null,return
				//If this POA is not in Obsolete state then return
				return;
			}
			
			poa.doObsoleteActions(context);			
			
			StringList completedPOAs = artworkPackage.isSelectedForCancel(context) ? 
					                           BusinessUtil.toStringList(AWLState.OBSOLETE.get(context, AWLPolicy.POA)) :
					                           BusinessUtil.toStringList(AWLState.RELEASE.get(context, AWLPolicy.POA),
					                        		   					 AWLState.OBSOLETE.get(context, AWLPolicy.POA));
		    
			MapList connectedPOAs = artworkPackage.getAllPOAMapList(context, new StringList(SELECT_CURRENT));
			StringList poastateList = BusinessUtil.toStringList(connectedPOAs, SELECT_CURRENT);

			boolean containsOnlyObsoleteState = BusinessUtil.matchingAllStringListValues(poastateList, AWLState.OBSOLETE.get(context, AWLPolicy.POA));
			boolean promote = containsOnlyObsoleteState;
			
			if(containsOnlyObsoleteState)
			{
				artworkPackage.markForCancel(context);
			} else {
				promote = AWLState.WORK_IN_PROCESS.get(context, AWLPolicy.ARTWORK_PACKAGE).equals(artworkPackage.getInfo(context, SELECT_CURRENT));
				for (int i = 0; i < poastateList.size() && promote; i++) {
					promote = completedPOAs.contains(poastateList.get(i));
				}
			}
			if(promote)
				artworkPackage.promote(context);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public void setDefaultValues(Context context, String args[]) throws FrameworkException {
		try 
		{
			String poaId = args[0];
			//String attrType =  PropertyUtil.getSchemaProperty(context, args[1]);	
			
			String attrSymbNames = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.POA.Attribute.ToSetDefaultValues", "");
			StringList attrs = FrameworkUtil.split(attrSymbNames, ",");
			Map<String, String> poaDefaultAttrVals = new HashMap<String, String>();
			for (String attrSymb : attrs) {
				attrSymb = attrSymb.trim();
				String attr =  PropertyUtil.getSchemaProperty(context, attrSymb);
				String attrVal = AWLPropertyUtil.getConfigPropertyString(context, AWLUtil.strcat("emxAWL.POA.Attribute.", attrSymb, ".DefaultValue"));
				attrVal = attrVal.trim();
				poaDefaultAttrVals.put(attr, attrVal);
			}
			
			POA poa = new POA(poaId);
			poa.setAttributeValues(context, poaDefaultAttrVals);		
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public int checkForArtworkLatestRevisions(Context context,String args[]) throws FrameworkException
	{
		try {
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			String objectId = args[0];
			DomainObject domObj = DomainObject.newInstance(context, objectId);
			
			
			StringBuilder relPattern = new StringBuilder(60);
			relPattern.append(AWLRel.ARTWORK_ASSEMBLY.get(context))
						.append(",")
						.append(AWLRel.POA_ARTWORK_MASTER.get(context))
						.append(",")
						.append(AWLRel.COPY_LIST_ARTWORK_MASTER.get(context));
			
			StringBuilder typePattern = new StringBuilder(60);
			typePattern.append(AWLType.ARTWORK_ELEMENT.get(context))
						.append(",")
						.append(AWLType.MASTER_ARTWORK_ELEMENT.get(context));
			
			StringList busSelects = StringList.create(DomainConstants.SELECT_IS_LAST, DomainConstants.SELECT_NAME);
			MapList result = domObj.getRelatedObjects(context, relPattern.toString(), typePattern.toString(), busSelects, null, false, true, (short)0, null, null, 0);

			String notLatestObjects = ((List<Map>)result).stream().filter(elementInfo -> {
				return !Boolean.parseBoolean((String)elementInfo.get(DomainConstants.SELECT_IS_LAST));
			}).map(elementInfo -> {
				return (String)elementInfo.get(DomainConstants.SELECT_NAME);
			}).collect(Collectors.joining(", "));
			
			if(!BusinessUtil.isNullOrEmpty(notLatestObjects)) {
				boolean isCustomizationPOA = AWLConstants.ARTWORK_BASIS_MARKETING_CUSTOMIZATION.equals(domObj.getInfo(context, AWLAttribute.ARTWORK_BASIS.getSel(context)));
				//if(isCustomizationPOA)
				//	return 0;
				
				boolean isCopyList = domObj.isKindOf(context, AWLType.COPY_LIST.get(context));
				String poaPromotePref = isCopyList? AWLGlobalPreference.getCLPromotePref(context): AWLGlobalPreference.getPOAPromotePref(context);
				boolean canPromote = "Allow".equalsIgnoreCase(poaPromotePref);
				
				if(!canPromote) {
					return 1;
				}
				
				String warningMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Promote.Warning") + "\n" + notLatestObjects;
				MqlUtil.mqlCommand(context, "WARNING $1", warningMessage);
				
				return 0;
			}
			
			return 0;
			
		} catch (Exception e) { throw new FrameworkException(e);}
	}
		
}

