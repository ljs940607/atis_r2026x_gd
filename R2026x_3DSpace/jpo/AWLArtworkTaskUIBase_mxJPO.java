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
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;

@SuppressWarnings("serial")
public class AWLArtworkTaskUIBase_mxJPO extends AWLObject_mxJPO 
{
	private static final String FROM_OPEN = "from[";
	private static final String PROJECT_TASK_TYPE = AWLUtil.strcat(FROM_OPEN, RELATIONSHIP_PROJECT_TASK, "].to.type");
	private static final String INBOX_TASK_ID = "inboxTaskId";
	private static final String INBOX_TASK_NAME = "inboxTaskName";
	private static final String INBOX_TASK_TYPE = "inboxTaskType";
	private static final String INOBX_TASK_STATE = "inboxTaskState";
	public final static String LANGUAGE_STRING    = "languageStr";
	public final static String TIME_ZONE    = "-5.5";
	public final static String GROUP_MULTIPLE     = "Multiple";
	public final static String RANGE_TRUE = "true";
	
	/*B1R Added for R214.HF1*/	
	private static final String ARTWORK_INBOX_TASK_CONTENT = AWLUtil.strcat(FROM_OPEN, RELATIONSHIP_ROUTE_TASK, "].to.to[", RELATIONSHIP_OBJECT_ROUTE, "].from.id");
		
	/**
	*
	* @param context the eMatrix <code>Context</code> object
	* @param args holds no arguments
	* @throws Exception if the operation fails
	* @since AEF
	* @grade 0
	*/
	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	public AWLArtworkTaskUIBase_mxJPO (Context context, String[] args)
	throws Exception
	{
		super(context, args);
	}	
	
	/* Added by B1R for R214.HF1 */
	
	    /************************************** code added for R214.HF1 ******************************************************************/	
		
		
		/**Method to get the active tasks associated to the context user
		 * based on the action
		 * 
		 * @param context - the eMatrix <code>Context</code> object
		 * @param args - string args
		 * @return - List of tasks associated to the context user based on the action
		 * @throws FrameworkException
		 */
	@com.matrixone.apps.framework.ui.ProgramCallable
		public MapList getActiveArtworkInboxTaskContent (Context context, String[] args) throws FrameworkException
		{
			try
			{
				Map requestMap	= (Map)JPO.unpackArgs(args);
				String strAction = BusinessUtil.getString(requestMap, "actionType");
				MapList tasks = (MapList)invokeLocal(context, "emxInboxTask", args, "getActiveTasks", args, MapList.class);//getActiveTasks(context, args);
				return getContentList(context, tasks, strAction);
			    //return new MapList();
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		
		/** Method to get the list of content objects from the passed in tasks
		 * 
		 * @param context - the eMatrix <code>Context</code> object
		 * @param tasks - list of the tasks
		 * @param strAction - Action (master/local copy authoring/approval)
		 * @return maplist of the content objects
		 * @throws FrameworkException
		 * @author B1R
		 */
		protected MapList getContentList (Context context, MapList tasks, String strAction) throws FrameworkException
		{
			try
			{
				Map<String, Map<String,String>> finalContentMap = getContentTaskMap(context, tasks, strAction);
				
				StringList contentSelects = new StringList();
				contentSelects.addElement(SELECT_TYPE);
				contentSelects.addElement(SELECT_ID);
				contentSelects.addElement(SELECT_NAME);
				contentSelects.addElement(SELECT_CURRENT);
				contentSelects.addElement(AWLAttribute.MARKETING_NAME.getSel( context ));
				contentSelects.addElement(AWLAttribute.IS_BASE_COPY.getSel( context ));
				contentSelects.addElement(AWLUtil.strcat(AWLAttribute.COPY_TEXT.getSel( context ), "_RTE"));
				contentSelects.addElement(AWLAttribute.COPY_TEXT_LANGUAGE.getSel( context ));
				contentSelects.addElement(AWLConstants.PREVIOUS_ID);
				contentSelects.addElement( ARTWORK_INBOX_TASK_CONTENT);
				StringList s = BusinessUtil.getKeyList(finalContentMap);
				MapList contentMapList = BusinessUtil.getInfo(context, s, contentSelects);
				MapList finalResultList = new MapList(1);
				for (Object object : contentMapList)
				{
					Map contentMap = (Map)object;
					finalResultList.add(buildArtworkContentMap(context, contentMap,finalContentMap));
				}
				return finalResultList;
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		
		/** Method to get the task info of the content
		 * 
		 * @param tasks - list of tasks
		 * @param strAction - Action (master/local copy authoring/approval)
		 * @return map containing the content ids as keys and related task information as value
		 * @throws FrameworkException
		 * @author B1R
		 */
		protected Map<String, Map<String,String>> getContentTaskMap (Context context, MapList tasks, String strAction) throws FrameworkException
		{
			try
			{
				Map<String, Map<String,String>> contentTaskMap = new HashMap<String, Map<String,String>>();
				for (Object object : tasks)
				{
					Map taskMap = (Map)object;
					Map<String, String> contentInfo = new HashMap<String, String>();
					//WBS Task modifications start
					String routeId = BusinessUtil.getString(taskMap , AWLUtil.strcat(FROM_OPEN,AWLRel.ROUTE_TASK.get(context),"].to.id"));
					if(BusinessUtil.isNullOrEmpty(routeId))
						continue;
					//WBS Task modifications end
					String strType		= BusinessUtil.getString(taskMap,SELECT_TYPE);				
					String contentId	= BusinessUtil.getInfo( context, BusinessUtil.getString(taskMap,SELECT_ID), ARTWORK_INBOX_TASK_CONTENT);
					//String routeId = BusinessUtil.getString(taskMap , AWLUtil.strcat(FROM_OPEN,AWLRel.ROUTE_TASK.get(context),"].to.id"));
					String artowrkInfo = BusinessUtil.getAttribute(context, routeId, AWLAttribute.ARTWORK_INFO.get(context));
					if(BusinessUtil.isNotNullOrEmpty( contentId ) && artowrkInfo.equalsIgnoreCase(strAction)){
						contentInfo.put(AWLConstants.ACTION_TYPE, strAction);
						contentInfo.put(SELECT_ID, BusinessUtil.getString(taskMap,SELECT_ID));
						contentInfo.put(SELECT_NAME, BusinessUtil.getString(taskMap,SELECT_NAME));
						contentInfo.put(SELECT_CURRENT, BusinessUtil.getString(taskMap,SELECT_CURRENT));
						contentInfo.put(ATTRIBUTE_ROUTE_TASK_USER, BusinessUtil.getString(taskMap,
												getAttributeSelect(ATTRIBUTE_ROUTE_TASK_USER)));
						contentInfo.put(PROJECT_TASK_TYPE, BusinessUtil.getString(taskMap,PROJECT_TASK_TYPE));
						contentInfo.put(SELECT_TYPE, strType);
						contentTaskMap.put(contentId, contentInfo);
					}
					//}
				}
				return contentTaskMap;	    
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		
		/** Method to get the content information and the content task information
		 * in to a single map
		 * 
		 * @param context - the eMatrix <code>Context</code> object
		 * @param contentMap - Map with the content information
		 * @param finalContentMap - Map with the content task information
		 * @return map containing the content information and the content task information
		 * @throws FrameworkException
		 * @author B1R
		 */
		protected Map buildArtworkContentMap (Context context, 
							Map<String, String> contentMap,
							Map<String, Map<String, String>> finalContentMap) throws FrameworkException
		{
			try
			{
				String contentId	= BusinessUtil.getString(contentMap, SELECT_ID);
				ArtworkContent ac = ArtworkContent.getNewInstance(context, contentId);
				Map contentInfoMap	= BusinessUtil.getMap(finalContentMap, contentId);
				//String strProjectTaskType	= BusinessUtil.getString(contentInfoMap, PROJECT_TASK_TYPE);
				contentMap.put(AWLConstants.ACTION_TYPE, BusinessUtil.getString(contentInfoMap, AWLConstants.ACTION_TYPE));
				ArtworkMaster master = ac.getArtworkMaster( context );
				String masterId = master.getId( context);
				
				contentMap.put(AWLType.MASTER_ARTWORK_ELEMENT.get(context), masterId);
				contentMap.put(INBOX_TASK_ID, BusinessUtil.getString(contentInfoMap, SELECT_ID));
				contentMap.put(INBOX_TASK_TYPE, BusinessUtil.getString(contentInfoMap, SELECT_TYPE));
				contentMap.put(INBOX_TASK_NAME, BusinessUtil.getString(contentInfoMap, SELECT_NAME));
				contentMap.put(INOBX_TASK_STATE, BusinessUtil.getString(contentInfoMap, SELECT_CURRENT));
				contentMap.put("isStructuredElement", Boolean.valueOf(master.isStructuredElementRoot(context)).toString());
				
				if(ac.isGraphicElement())
				{
					contentMap.put(getAttributeSelect(AWLAttribute.COPY_TEXT_LANGUAGE.getSel( context )),"");
					
				}
				contentMap.put(AWLConstants.SB_ROW_DISABLE_SELECTION, "false");
				//boolean isAuthor = ArtworkUtil.isAuthoringAction(BusinessUtil.getString(contentInfoMap, ACTION_TYPE));
				
				//boolean hasModifyAccess = isAuthor;
				contentMap.put("hasModifyAccess", RANGE_TRUE);
				contentMap.put("isEditable", RANGE_TRUE);
				return contentMap;
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		/** Method to get the content language
		 * 
		 * @param context - the eMatrix <code>Context</code> object
		 * @param args - string args
		 * @return Vector list of content language
		 * @throws FrameworkException
		 * @author B1R
		 */
		public StringList getContentLanguages (Context context, String[] args) throws FrameworkException
		{
			try
			{
				String copyTextSelectableLanguage = getAttributeSelect(AWLAttribute.COPY_TEXT_LANGUAGE.get( context ));
				StringList returnList = new StringList();
				Map programMap = (HashMap) JPO.unpackArgs(args);
				MapList objectList = BusinessUtil.getObjectList(programMap);
				for (Object object : objectList)
				{
					Map objectMap = (Map)object;
					returnList.add(BusinessUtil.getString(objectMap, copyTextSelectableLanguage));
				}
				return returnList;
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		
		/** Method to get the Master copy language
		 * 
		 * @param context - the eMatrix <code>Context</code> object
		 * @param args - string args
		 * @return Vector list of content language
		 * @throws FrameworkException
		 * @author B1R
		 */
		public StringList getMasterCopyLanguage (Context context, String[] args) throws FrameworkException
		{
			try
			{
				StringList returnList = new StringList();
				Map programMap = (HashMap) JPO.unpackArgs(args);
				MapList objectList = BusinessUtil.getObjectList(programMap);
				for (Object object : objectList)
				{
					Map objectMap = (Map)object;
					ArtworkMaster am = new ArtworkMaster( BusinessUtil.getString(objectMap, AWLType.MASTER_ARTWORK_ELEMENT.get(context)));
					ArtworkContent ac = am.getBaseArtworkElement( context );
					returnList.add(ac.getCopyTextLanguage( context ));
				}
				return returnList;
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		
		
		/**
		* show the buttons like SUBMIT button in Actions
		* @param context
		* @param args
		* @return isGraphic 
		* @author BV8
		*/
		public boolean showComplete(Context context, String[] args) throws FrameworkException
		{
			try
			{
				HashMap programMap = (HashMap) JPO.unpackArgs(args);
				String taskId = BusinessUtil.getObjectId(programMap);
				return canWorkOnArtworkTask(context, taskId, "showModifySubmit"); 
			} catch (Exception e){ throw new FrameworkException(e);	}
		}

		/**
		* show the buttons like Approve,Reject  button in Actions
		* @param context
		* @param args
		* @return isGraphic 
		* @author BV8
		*/
		public boolean showApproveAndReject(Context context, String[] args) throws FrameworkException
		{
			try
			{
				HashMap programMap = (HashMap) JPO.unpackArgs(args);
				String taskId = BusinessUtil.getObjectId(programMap);
				return canWorkOnArtworkTask(context, taskId, "showApproveReject");			
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		
	@com.matrixone.apps.framework.ui.ProgramCallable
		public MapList getArtworkElementArtworkPackages(Context context, String[] args) throws FrameworkException
		{
			try
			{
				Map programMap =(Map) JPO.unpackArgs(args);
				
				String objectId = BusinessUtil.getString(programMap, "objectId");	
				objectId = BusinessUtil.isKindOf(context, objectId, AWLType.INBOX_TASK.get(context)) ? 
						   BusinessUtil.getInfo(context, objectId, ARTWORK_INBOX_TASK_CONTENT) : objectId;

				ArtworkContent ac = BusinessUtil.isKindOf(context, objectId, AWLType.MASTER_ARTWORK_ELEMENT.get(context)) ? 
									new ArtworkMaster(objectId).getBaseArtworkElement(context) :
									ArtworkContent.getNewInstance(context, objectId);

				MapList artwrokPackagesList = ac.getArtworkPackagesMapList(context,BusinessUtil.toStringList(SELECT_CURRENT),null,null);
			    MapList activeArtworkPackageList = new MapList(artwrokPackagesList.size());
			    
				StringList apStates = AWLPolicy.ARTWORK_PACKAGE.getStates(context, AWLState.COMPLETE, AWLState.CANCELLED);
			    for (Iterator iterator = artwrokPackagesList.iterator(); iterator.hasNext();) {
					Map artworkPackageMap = (Map) iterator.next();
					String artworkPackageState = (String)artworkPackageMap.get(SELECT_CURRENT);
					if(apStates.contains(artworkPackageState)) {				
						activeArtworkPackageList.add(artworkPackageMap);
					}
				}	    
			    return activeArtworkPackageList;
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		/** 
		* @author BV8
		*/
	@com.matrixone.apps.framework.ui.ProgramCallable
		public MapList getArtworkElementPOAs(Context context, String[] args) throws FrameworkException{
			try{
				Map programMap =(Map) JPO.unpackArgs(args);
				String objectId = BusinessUtil.getString(programMap, "objectId");	


				if(BusinessUtil.isKindOf(context, objectId, AWLType.INBOX_TASK.get(context)))
					objectId = BusinessUtil.getInfo(context, objectId, ARTWORK_INBOX_TASK_CONTENT);

				//modified by N94 for issue HF-202030V6R2013x Behaviour is changed to suite 2013GA
				ArtworkMaster am = BusinessUtil.isKindOf(context, objectId, AWLType.MASTER_ARTWORK_ELEMENT.get(context)) ?
						new ArtworkMaster(objectId) : ArtworkContent.getNewInstance(context, objectId).getArtworkMaster(context);

				StringList poaStates = AWLPolicy.POA.getStates(context, AWLState.RELEASE, AWLState.OBSOLETE);
				return am.getPOAs(context, BusinessUtil.toStringArray(poaStates));
			} catch (Exception e){ throw new FrameworkException(e);	}
		}
		
		
		/** 
		* @author p26
		* To show Modify Content command in Single Task Authoring for Graphic Element
		*/
		public boolean canModifyGraphic(Context context, String[] args) throws FrameworkException
		{
			try {
				HashMap programMap = (HashMap) JPO.unpackArgs(args);
				String taskId = BusinessUtil.getObjectId(programMap);
				Map taskContentMap = ArtworkContent.getArtworkInboxTaskContentInfo(context, taskId);
				boolean isGraphic = RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(taskContentMap, AWLConstants.IS_GRAPHIC));
				return isGraphic && showComplete(context, args);
			}  catch (Exception e){ throw new FrameworkException(e);}
		}
		
		/** 
		* @author p26
		* To show Modify Content command in Single Task Authoring for Copy Element
		*/
		public boolean canModifyContent(Context context, String[] args) throws FrameworkException
		{
			try {
				HashMap programMap = (HashMap) JPO.unpackArgs(args);
				String taskId = BusinessUtil.getObjectId(programMap);
				Map taskContentMap = ArtworkContent.getArtworkInboxTaskContentInfo(context, taskId);
				boolean isGraphic = RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(taskContentMap, AWLConstants.IS_GRAPHIC));
				return !isGraphic && showComplete(context, args);
			} catch (Exception e) {
				throw new FrameworkException(e);
			}
		}
		
		/**
		 * @param context
		 * @param taskId
		 * @return
		 * @throws FrameworkException
		 */
		private boolean canWorkOnArtworkTask(Context context, String taskId, String action)
				throws FrameworkException {
			boolean blnReturn = true;
			
			Map taskContentMap = ArtworkContent.getArtworkInboxTaskContentInfo(context, taskId);
			
			String strRouteID = RouteUtil.getRoutebyTask(context, taskId);
			String strRouteStatus = BusinessUtil.getInfo(context,strRouteID,getAttributeSelect(ATTRIBUTE_ROUTE_STATUS));
	        boolean isRouteRejected = "Finished".equals(strRouteStatus) && RouteUtil.hasRejectedTasks(context, strRouteID);

			boolean isContextUserTaskOwner = (context.getUser()).equals(BusinessUtil.getString(taskContentMap,AWLConstants.TASK_OWNER));
			boolean taskCompleted = "Complete".equals(BusinessUtil.getString(taskContentMap, AWLConstants.TASK_STATE));
			boolean blnRoleTask = RANGE_TRUE.equals(BusinessUtil.getString(taskContentMap,AWLConstants.IS_ROLE_TASK));
	        boolean isTaskDirectAssignee = isContextUserTaskOwner && !blnRoleTask;
			
			String routeAction = BusinessUtil.getString(taskContentMap,AWLConstants.ACTION_TYPE);
	        boolean bnlAuthoring = RouteUtil.isAuthoringAction(routeAction);
	        boolean bnlMasterCopy = RouteUtil.isMasterCopyAction(routeAction);

			boolean hasModifyAccess = RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(taskContentMap,AWLConstants.MODIFY_ACCESS));
			boolean hasReviseAccess = RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(taskContentMap,AWLConstants.REVISE_ACCESS));
			boolean hasPromoteAccess = RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(taskContentMap,AWLConstants.PROMOTE_ACCESS));
			boolean hasDemoteAccess = RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(taskContentMap,AWLConstants.DEMOTE_ACCESS));
			boolean isContentReleased = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT).
					equals(BusinessUtil.getString(taskContentMap, AWLConstants.CONTENT_STATE));
			
			boolean hasRequiredRole = bnlAuthoring ? bnlMasterCopy ? Access.isMasterCopyAuthor(context) :  Access.isLocalCopyAuthor(context) :
												     bnlMasterCopy ? Access.isMasterCopyApprover(context) :  Access.isLocalCopyApprover(context);

			boolean hasAccessOnObject = !hasRequiredRole ? false :
				                        bnlAuthoring ? (hasModifyAccess || (isContentReleased && hasReviseAccess)) :
	                                                   (hasPromoteAccess && hasDemoteAccess);
			if ("showWarningMessage".equals(action)) {
				//Don't show any message if task assigned to Role/Group or task is already completed or context user is not the owner of the task.
			    //for authoring show message if user don't have modify or revise (if element is released) access
				//for approval show message if user don't have promtoe or demote access / Route has a rejected task and route status is finished.
				blnReturn =  isRouteRejected ? true :
	                         !isTaskDirectAssignee || taskCompleted ? false :
							 !hasAccessOnObject;
			}
			else if ("showApproveReject".equals(action)) {
				/* Show Approve and Reject if .
				 * context user is the owner of the task and
				 * context user have promtoe and demote access and its approval task and Route has no rejected task and route status is not finished.
				 * task is not assigned to Role/Group and task is not completed
				 */
				blnReturn = !bnlAuthoring &&
	              			!isRouteRejected &&
							!taskCompleted &&
							isTaskDirectAssignee &&
				            hasAccessOnObject; 
			}
			else if ("showModifySubmit".equals(action)) {
				/*
				 * Show Modify and Submit buttons if
				 * Context user is the task owner &&
				 * Context user has modify access or (content is released and context user has revise access) &&
				 * Its a authoring task && task is not completed & its not a role task
				 */
				blnReturn = bnlAuthoring &&
	              			!isRouteRejected &&
							!taskCompleted &&
							isTaskDirectAssignee &&
				            hasAccessOnObject;			 
			}
			return blnReturn;
		}
}
