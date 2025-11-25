/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;

import matrix.db.Context;
import matrix.util.StringList;

@SuppressWarnings({ "PMD.SignatureDeclareThrowsException","PMD.TooManyMethods" })
public class AWLArtworkPackageBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -4668047702413210938L;
	private static final String TO_DOT_ID = "].to.id";
	private static final String FROM_OPEN = "from[";
	private static final String MQL_NOTICE = "notice $1";

	public AWLArtworkPackageBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	/**
	* It checks whether all Artwork's has assignee or not.	
	* @param   context 
	* @param   args   
	* @throws  Exception
	* @throws  IllegalArgumentException - when args size is zero
	* @since   AWL 2013x
	* @author  Subbarao G(SY6)
	*/
	public int checkArtworkAssignees(Context context,String args[]) throws FrameworkException
	{
		try {			
			ArtworkPackage artworkPackage = new ArtworkPackage(getId(context));
			//If Selected for Cancel No need to do the checks
			if(artworkPackage.isSelectedForCancel(context))
				return 0;
			
			String authoringSel = AWLUtil.strcat(FROM_OPEN,AWLRel.ARTWORK_CONTENT_AUTHOR.get(context),TO_DOT_ID);
			String approvalSel = AWLUtil.strcat(FROM_OPEN,AWLRel.ARTWORK_CONTENT_APPROVER.get(context),TO_DOT_ID);
			StringList objSelects    = BusinessUtil.toStringList(SELECT_NAME, authoringSel, approvalSel);
		    objSelects.add("current");
			MapList artworkPackageConnectedItems 		 = POA.isCMEnabled(context) ?
					artworkPackage.getArtworkPackageContent(context, objSelects, null) :
					artworkPackage.getArtworkPackageConnectedItems(context, objSelects);

			if(BusinessUtil.isNullOrEmpty(artworkPackageConnectedItems))
			{
				String message      = AWLPropertyUtil.getI18NString(context,"emxAWL.ArtworkPackage.NoObjectConnected");
				MqlUtil.mqlCommand(context, MQL_NOTICE, message);
				return 1;
			}

			StringList missingList = new StringList();

			for(int i = 0; i < artworkPackageConnectedItems.size(); i++)
			{
				Map objectMap      = (Map)artworkPackageConnectedItems.get(i);
				String authoringId = BusinessUtil.getString(objectMap, authoringSel);
				String approvalId  = BusinessUtil.getString(objectMap, approvalSel);
				if(!(BusinessUtil.exists(context, authoringId) && BusinessUtil.exists(context, approvalId)))
				{
					missingList.add(BusinessUtil.getName(objectMap));
				}
			}

			if(BusinessUtil.isNotNullOrEmpty(missingList))
			{
				String nameMessage = FrameworkUtil.join(missingList, "\n");				
			//	String language = context.getSession().getLanguage();
				String message      = AWLPropertyUtil.getI18NString(context,"emxAWL.ArtworkPackage.RoutesNotAttached");
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, "\n", nameMessage));
				return 1;
			}			
			return 0;
		
		} catch (Exception e){ throw new FrameworkException(e); }
	}
	
	/**
	* It creates the Artwork Routes.	
	* @param   context  
	* @param   args     
	* @throws  Exception
	* @throws  IllegalArgumentException - when args size is zero
	* @since   AWL 2013x
	* @author  Subbarao G(SY6)
	*/
	public void createArtworkRoutes(Context context, String[] args) throws FrameworkException
	{
		try
		{   
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			long begin = System.currentTimeMillis();
			
			boolean isCMEnabled = POA.isCMEnabled(context);
			
			String artworkId = args[0];
			ArtworkPackage artworkPackage = new ArtworkPackage(artworkId);
			String routeOwner = artworkPackage.getOwner(context).toString();
			String SEL_IS_BASE_COPY = AWLAttribute.IS_BASE_COPY.getSel(context);
			String SEL_RE_AUTHOR_CONTENT = AWLAttribute.RE_AUTHOR_CONTENT.getSel(context);
			String KIND_POA = AWLUtil.strcat("type.kindof[", AWLType.POA.get(context), "]");
			
			String PRELIMINARY = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			String RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
					
			StringList selectables = BusinessUtil.toStringList(SEL_RE_AUTHOR_CONTENT, SELECT_CURRENT);
			if(!isCMEnabled) {
				selectables.add(KIND_POA);
			}
			
			//If ECM flag is not enabled, get the POAs information also to create and start route
			MapList artworkContent = isCMEnabled ? 
					artworkPackage.getArtworkPackageContent(context, selectables, null) :
					artworkPackage.getArtworkPackageConnectedItems(context, selectables);
			
			//From the content segregate Local Content and Base Content and process later steps
			MapList localContent = new MapList();
			MapList baseContent = new MapList();
			StringList skipAuthorBaseIds = new StringList();
			for (Map content : (List<Map>)artworkContent) {
				//POA routes will be created here
				if("TRUE".equalsIgnoreCase((String) content.get(KIND_POA))) {
					RouteUtil.createArtworkRoutes(context, routeOwner, (String) content.get(SELECT_ID));
				} else if(AWLConstants.RANGE_YES.equalsIgnoreCase((String) content.get(SEL_IS_BASE_COPY))) {
					boolean reAuthor = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) content.get(SEL_RE_AUTHOR_CONTENT));
					boolean release = RELEASE.equalsIgnoreCase((String) content.get(SELECT_CURRENT));
					if(release && !reAuthor)
						skipAuthorBaseIds.add((String)content.get(SELECT_ID));
					baseContent.add(content);
				} else {
					localContent.add(content);
				}
			}
			
			//Process Local Content, Create Local Copy Routes
			//localContentToAutor is used when the Base Copy is released and no authoring is required.
			StringList localContentToAutor = createLocalCopyRoutes(context, routeOwner, localContent);
			
			//Process Base Content
			//Get all local Ids for base copies
			String REL_ARTWORK_ELEMENT_CONTENT = AWLRel.ARTWORK_ELEMENT_CONTENT.get(context);
			String SEL_LOCAL_CONTENT = AWLUtil.strcat("to[", REL_ARTWORK_ELEMENT_CONTENT, "].from.from[", REL_ARTWORK_ELEMENT_CONTENT, TO_DOT_ID);
			MapList localIds = BusinessUtil.getInfoList(context, skipAuthorBaseIds, SEL_LOCAL_CONTENT);

			for (Map copy : (List<Map>)baseContent) {
				//If Base Copy is in Preliminary authoring and approval task will be created
				//If Base Copy is in Release authoring and approval task will be created if Re authoring is required else
				//Start local copy Routes directly for that base copy

				String copyId  = BusinessUtil.getId(copy);

				boolean reAuthor = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) copy.get(SEL_RE_AUTHOR_CONTENT));
				String current = (String) copy.get(SELECT_CURRENT);
				boolean release = RELEASE.equalsIgnoreCase(current);
				boolean preliminary = PRELIMINARY.equals(current);
				
				//Base Copy is in Review state or Base copy already has a active Route, no need to create and start route for base copy
				//when base copy is revised/completed local copy route will be started automatically.
				if(!(preliminary || release) || RouteUtil.hasRoute(context, copyId))
					continue;
				
				if(preliminary || (release && reAuthor)) {
					//Create and Start Base Route when copy is in Preliminary state or release and re authoring required.
					RouteUtil.createArtworkRoutes(context, routeOwner, copyId);
					RouteUtil.startArtworkAuthoringRoute(context, copyId);
				} else {
					//Copy is in release and re authoring not required, start Local copy Routes
					StringList localCopies = BusinessUtil.getStringList((Map)localIds.get(skipAuthorBaseIds.indexOf(copyId)), SEL_LOCAL_CONTENT);
					for (String localId : (List<String>)localCopies) {
						if(localContentToAutor.contains(localId)) {
							RouteUtil.startArtworkAuthoringRoute(context, localId);
						}
					}
				}
			}
			long end = System.currentTimeMillis();
			System.out.println(AWLUtil.strcat("Time taken to generate routes : ", ((end-begin)/1000.0), " secs"));
		} catch (Exception e){ throw new FrameworkException(e); }
	}	
	
	/**
	 * Create Routes for Local Copies, this method will not create Route if 
	 * Element is not in Preliminary or element has already route connected.
	 */
	private StringList createLocalCopyRoutes(Context context, String routeOwner, MapList localContent) throws FrameworkException {
		String PRELIMINARY = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
		String RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
		String SEL_RE_AUTHOR_CONTENT = AWLAttribute.RE_AUTHOR_CONTENT.getSel(context);

		StringList localContentToAutor = new StringList();
		for (Map apContent : (List<Map>)localContent) {
			String copyId  = BusinessUtil.getId(apContent);
			String current = (String) apContent.get(SELECT_CURRENT);
			boolean release = RELEASE.equalsIgnoreCase(current);
			boolean preliminary = PRELIMINARY.equals(current);
			boolean reAuthor = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) apContent.get(SEL_RE_AUTHOR_CONTENT));

			//With selective Authoring, need to create Routes for released local copy only if re authroing is true

			if(!(preliminary || release) || RouteUtil.hasRoute(context, copyId))
				continue;
			
			if((preliminary || (release && reAuthor)) && !RouteUtil.hasRoute(context, copyId)) {
				localContentToAutor.add(copyId);
				RouteUtil.createArtworkRoutes(context, routeOwner, copyId);
			}

		}
		return localContentToAutor;
	}

	/**
	* It demote's the Artwork from Review state to Previous state if the Artwork rejected by the Approver. 
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero.
	* @since   AWL 2013x
	* @author  SubbaRao G(SY6)
	*/
	public void demoteArtworkOnApprovalRejection(Context context, String[] args) throws FrameworkException
	{
		try
		{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();

			//Fix IR-227144V6R2014x
			//Fix R2015x - Inbox Task subtyping is removed
			//Complete logic is changed, only when Artwork Inbox Task rejected we demote the object and create the Routes for reauthor and approve

			//If Route is not Approval Route and Route is not stopped just return, we have to recreate the route only when Route is stopped.
			String SEL_ROUTE_ID_FROM_TASK = AWLUtil.strcat(FROM_OPEN, AWLRel.ROUTE_TASK.get(context), TO_DOT_ID);
			
			String taskId 	  = args[0];
			String routeId = BusinessUtil.getInfo(context, taskId, SEL_ROUTE_ID_FROM_TASK);
			
			if(!RouteUtil.isArtworkElementAction(BusinessUtil.getInfo(context, routeId, AWLAttribute.ARTWORK_INFO.getSel(context)))) {
				return;
			}
			
			String SEL_ROUTE_BASE_PURPOSE = AWLAttribute.ROUTE_BASE_PURPOSE.getSel(context);
			Map routeInfo = BusinessUtil.getInfo(context, routeId, 
					BusinessUtil.toStringList(AWLAttribute.ROUTE_STATUS.getSel(context), SEL_ROUTE_BASE_PURPOSE));
			
			if(!("Stopped".equals(routeInfo.get(AWLAttribute.ROUTE_STATUS.getSel(context))) && 
					AWLConstants.ROUTE_APPROVAL.equals(routeInfo.get(SEL_ROUTE_BASE_PURPOSE)))) {
				return;
			}
			
			String SEL_ROUTE_CONTENT_IDs = AWLUtil.strcat("to[", DomainConstants.RELATIONSHIP_OBJECT_ROUTE, "].from.id");
			StringList contentIds = BusinessUtil.getInfoList(context, routeId, SEL_ROUTE_CONTENT_IDs);
			if(contentIds.size() != 1)
				throw new FrameworkException("Content Size is not equal to one");
			
			//If content is not in Review state no need to demote and create routes
			String contentId = (String) contentIds.get(0);
			DomainObject content = new DomainObject(contentId);
			String STATE_REVIEW = AWLState.REVIEW.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			if(!STATE_REVIEW.equals(content.getInfo(context, DomainObject.SELECT_CURRENT))) {
				return;
			}

			RouteUtil.completeRouteOnRejection(context, routeId);		
			content.demote(context);
			
			//H49:Revise Outside Artwork Package
			String strIsRevisedOutSide = content.getAttributeValue(context, AWLAttribute.IS_REVISED_OUTSIDE_ARTWORK_PACKAGE.get(context));
			if(AWLConstants.RANGE_YES.equals(strIsRevisedOutSide))
				return;		
			
			//Create new Routes and set the rejection comments to both Authoring and Approval route.
			String SEL_COMMENTS = DomainObject.getAttributeSelect(ATTRIBUTE_COMMENTS);
			StringBuffer SEL_TASK_OWNER = new StringBuffer(FROM_OPEN + DomainConstants.RELATIONSHIP_PROJECT_TASK + "].to.name");
			StringList selects = BusinessUtil.toStringList(SEL_COMMENTS, SEL_TASK_OWNER.toString());
			
			MapList rejectedTasks = RouteUtil.getRejectedTasks(context, routeId, selects);		
			Map rejectcomments = new HashMap(rejectedTasks.size());
			for (Map rejectedTask : (List<Map>)rejectedTasks) {
				String rejComments = (String) rejectedTask.get(SEL_COMMENTS);
				String rejBy = (String) rejectedTask.get(SEL_TASK_OWNER.toString());
				//rejBy = PersonUtil.getFullName(context, rejBy);
				rejectcomments.put(rejBy, rejComments);
			}
			StringBuffer rejectedBy = new StringBuffer(100);
			StringBuffer rejComments = new StringBuffer(1000);
			for (String rejectedUser : (Set<String>)rejectcomments.keySet()) {
				rejectedBy.append(rejectedUser).append(", ");
				rejComments.append(rejectcomments.get(rejectedUser));
			}
			rejectedBy.delete(rejectedBy.length() - 2, rejectedBy.length() - 1);

			String routeOwner = RouteUtil.getRouteOwner(context, routeId);
			RouteUtil.createArtworkRoutes(context, routeOwner, contentId);
			RouteUtil.setRouteInstructionsForRejectedContent(context, contentId, rejectedBy.toString(), rejComments.toString());
			RouteUtil.startArtworkAuthoringRoute(context, contentId);
		} catch (Exception e){ throw new FrameworkException(e); }
	}
	
	/**
	* Promotes the 'Artwork Package' to Complete state if all the connected items are released.   
	* @param   context
	* @param   args
	* @throws  IllegalArgumentException - when args size is zero.
	* @since   AWL 2013x
	* @author  SubbaRao G(SY6)
	*/
	public int checkConnectedItemsReleased (Context context, String[] args) throws FrameworkException  
    {
		try{
			if(args.length == 0 || BusinessUtil.isNullOrEmpty(args[0]))
				throw new IllegalArgumentException();
			

			ArtworkPackage artworkPackage = new ArtworkPackage(args[0]);
			
			//If Selected for Cancel No need to do the checks
			if(artworkPackage.isSelectedForCancel(context))
				return 0;
			
			
			String STATE_RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			String STATE_OBSOLETE = AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			
		    StringList objSelects   = BusinessUtil.toStringList(SELECT_ID, SELECT_NAME, SELECT_CURRENT);
			MapList artworkPackageConnectedItems = artworkPackage.getArtworkPackageConnectedItems(context, objSelects);
			StringList artworkList = new StringList(artworkPackageConnectedItems.size()); 

			for (Iterator iterator = artworkPackageConnectedItems.iterator(); iterator.hasNext();) {
				Map artworkItem = (Map) iterator.next();
				String artworkName = (String)artworkItem.get(SELECT_NAME);
				String artworkState = (String)artworkItem.get(SELECT_CURRENT);
				
				if(!STATE_RELEASE.equals(artworkState) && !STATE_OBSOLETE.equals(artworkState))
				{
					artworkList.add(artworkName);
				}
			}
			if(artworkList.size() > 0)
			{
			//	String language = context.getSession().getLanguage();
				String message      = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.artworkPackageAssociatedItems");
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLUtil.strcat(message, artworkList.toString()));
				return 1;
			}
			return 0;
		} catch (Exception e){ throw new FrameworkException(e); }
	}
	
	public void resetReAuthoringOnDemoteToAssign(Context context, String[] args) throws FrameworkException 
	{
		try
		{
			String artworkPackageId = args[0];
			ArtworkPackage ap = new ArtworkPackage(artworkPackageId);
			List<ArtworkContent> artworkContent = ap.getArtworkPackageContents(context);
			for (ArtworkContent content : artworkContent) {
				content.resetReAuthoring(context);
			}
		} catch (Exception e){ throw new FrameworkException(e); }
	}
	
	/** Checks whether an artwork package can be deleted.
	 * @param   context 
 	 * @throws  
	 * @since   AWL 2014x
	 * @author  wx7
	 * @return int 0--> canDelete  1--> cannot delete 
     * Created for IR-244320V6R2014x 
	 */
	public int checkDeleteAction(Context context,String[] args) throws FrameworkException
	{
		try{
			String artworkPackageId = args[0];
			ArtworkPackage ap = new ArtworkPackage(artworkPackageId);
			
			boolean inCreateState = AWLState.CREATE.get(context,AWLPolicy.ARTWORK_PACKAGE).equals(ap.getInfo(context, SELECT_CURRENT));
			boolean hasPOAs = ap.getPOAs(context).size() != 0;
			
			String errorMessage = hasPOAs ? "emxAWL.ArtworkPackage.Delete.Error.POAsAttached" :
				                 !inCreateState ?  "emxAWL.ArtworkPackage.Delete.Error.NotInCreateState" : null;

			if(BusinessUtil.isNotNullOrEmpty(errorMessage))
			{
				errorMessage      = AWLPropertyUtil.getI18NString(context, errorMessage);
				MqlUtil.mqlCommand(context, MQL_NOTICE, errorMessage);
				return 1;
			}
		} catch (Exception e){ throw new FrameworkException(e); }
		return 0;
	}
	
	public int checkPOAsObsoletedToMoveCancelState(Context context, String[] args) throws FrameworkException {
		try {
			String artworkPackageId = args[0];
			ArtworkPackage ap = new ArtworkPackage(artworkPackageId);
			if(ap.isSelectedForCancel(context) && !ap.getPOAs(context).isEmpty()) {
				String errorMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkPackage.Cancel.POANotInObsolete");
				MqlUtil.mqlCommand(context, MQL_NOTICE, errorMessage);
				return 1;
			}
		} catch (Exception e){ throw new FrameworkException(e); }
		return 0;
	}
	/**
	 * Check Trigger to Check whether connected POAs are in preliminary or obsolete state or else do not allow the operation
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - Arguments
	 * @throws FrameworkException
	 * @author ukh1 (Utkarsh Kumar Singh)
	 * @return 0 or 1 based on the validations.
	 * @Since VR2015x.HF4 
	 * Created during 'Copy List Highlight'
	 */
	public int checkPOAStatePreliminaryorObsolete(Context context, String[] args) throws FrameworkException {
		try {
			String objId = args[0];
			ArtworkPackage ap = new ArtworkPackage(objId);
			List<POA> poalist = ap.getPOAs(context);
			StringList poaIDs = BusinessUtil.toStringList(context, poalist);
			StringList poaState = BusinessUtil.getInfo(context, poaIDs, SELECT_CURRENT);
			String preliminaryState = AWLState.PRELIMINARY.get(context, AWLPolicy.POA);
			String obsoleteState =  AWLState.OBSOLETE.get(context, AWLPolicy.POA);
			
			for(String state : (List<String>)poaState){
				if(!(preliminaryState.equalsIgnoreCase(state) || obsoleteState.equalsIgnoreCase(state))){
					MqlUtil.mqlCommand(context, MQL_NOTICE,AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.POANotInPreliminary"));
					return 1;
				}
			}
			return 0;
		} catch (Exception e){throw new FrameworkException(e); }
	}
	
	/** Checks whether an artwork package is promoted from Complete to Cancel.
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - StringList of Column Values List
	 * @author Raghavendra M J (R2J)
	 * @Since VR2017x
     * Created for IR-459856-3DEXPERIENCER2017x 
	 */
	public int checkForCancelState(Context context,String[] args) throws FrameworkException
	{
		try
		{
			String artworkPackageId = args[0];
			ArtworkPackage ap = new ArtworkPackage(artworkPackageId);
			boolean inCompleteState = AWLState.COMPLETE.get(context,AWLPolicy.ARTWORK_PACKAGE).equals(ap.getInfo(context, SELECT_CURRENT));

			if(inCompleteState)
			{
				MqlUtil.mqlCommand(context, MQL_NOTICE, AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.CannotCancelArtworkPackage"));
				return 1;
			}
		} catch (Exception e){ throw new FrameworkException(e); }
		return 0;
	}
}

