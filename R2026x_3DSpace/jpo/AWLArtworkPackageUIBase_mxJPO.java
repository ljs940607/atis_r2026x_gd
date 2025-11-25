/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.text.DateFormat;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import jakarta.json.JsonArray;

import com.matrixone.apps.awl.dao.AWLObject;
import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLInterface;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPreferences;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.common.Person;
import com.matrixone.apps.common.Route;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.AccessUtil;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.framework.ui.UICache;
import com.matrixone.apps.framework.ui.UIComponent;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;

@SuppressWarnings({ "PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods", "PMD.ExcessivePublicCount" })

public class AWLArtworkPackageUIBase_mxJPO extends AWLObject_mxJPO
{

	private static final String DISABLE = "disable";
	private static final String DYNAMIC_URL = "Dynamic URL";
	private static final String SELECT_LATEST = "latest";
	private static final String SELECT_CURRENT_ACCESS = "current.access";
	private static final String ACCESS_DEMOTE = "demote";
	private static final String ACCESS_PROMOTE = "promote";
	private static final String ACCESS_REVISE = "revise";
	private static final String ACCESS_MODIFY = "modify";
	private static final String Sortable = "Sortable";
	private static final String AWL_ARTWORK_PACKAGE_UI_JPO = "AWLArtworkPackageUI";
	private static final String Width = "Width";
	private static final String AWL = "AWL";
	private static final String programHTMLOutput = "programHTMLOutput";
	private static final String function = "function";
	private static final String program = "program";
	private static final String AWL_ARTWORK_ELEMENT_UI_JPO = "AWLArtworkElementUI";
	private static final String REL_SEL_CLOSE_TO_ID = "].to.id";
	private static final String TO_OPEN = "to[";
	private static final String FROM_OPEN = "from[";
	private static final String CURRENT_COPY_TEXT = "CurrentCopyText";
	private static final String FILTER_TYPE = "filterType";
	private static final String COLUMN_TYPE = "Column Type";
	private static final String RANGE_TRUE = "true";
	private static final String RANGE_FALSE = "false";
	private static final String DYNAMIC_LAST_APPROVED_CONTENT = "LastApprovedContent";
	private static final String ROUTE_STATUS = "RouteStatus";
	private static final String EXPORT = "Export";
	private static final StringList STOPPED_ROUTE_STATUS = BusinessUtil.toStringList(
			"Finished", // Incase of Artwork Inbox Task Route, the route status is 'Finished' when a task is rejected
			"Stopped" // Incase of Inbox Task Route, the route status is 'Stopped' when a task is rejected
			);
	private static final String Auto_Filter = "Auto Filter";
	/**
	 * 
	 */
	private static final long serialVersionUID = 4930303015701408227L;

	public AWLArtworkPackageUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map createArtworkPackage(Context context, String[] args) throws FrameworkException {
		try
		{
			
			Map ProgramMap = JPO.unpackArgs(args);
			ArtworkPackage ap = ArtworkPackage.create(context);
			HashMap map = new HashMap(2);
			String apid = ap.getId(context);
			String  artworkPackageTitle= (String)ProgramMap.get("Title");
			ap.setAttributeValue(context, DomainConstants.ATTRIBUTE_TITLE, artworkPackageTitle);
			map.put(SELECT_ID, apid);
			map.put(DomainConstants.ATTRIBUTE_TITLE, BusinessUtil.isNotNullOrEmpty(artworkPackageTitle)? artworkPackageTitle : "");
			return map;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	//Modified by N94 during POA Simplification Highlight in R418
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getActiveArtworkPackages (Context context, String[] args) throws FrameworkException
	{   
		if(Access.isArtworkProjectManager(context) || Access.isProductManager(context))
		{

			String strActiveACWhereExpression = AWLUtil.strcat("(current == ", AWLState.CREATE.get(context, AWLPolicy.ARTWORK_PACKAGE),
					" || current == ", AWLState.ASSIGN.get(context, AWLPolicy.ARTWORK_PACKAGE),
					" || current == '", AWLState.WORK_IN_PROCESS.get(context, AWLPolicy.ARTWORK_PACKAGE),"'", 
					")");
			return getArtworkPackageList(context, strActiveACWhereExpression);
		} 
		else 
		{
			Person personObject = Person.getPerson(context, context.getUser());  
			String strPersonId = personObject.getObjectId();

			String objectSelects = "to[PROJECT_TASK|(from.current=='ASSIGNED' || from.current=='REVIEW') && from.type =='INBOX_TASK'].from.from[ROUTE_TASK].to.to[OBJECT_ROUTE].from.to[ARTWORK_ELEMENT_CONTENT].from.to[POA_ARTWORK_MASTER].from.to[ARTWORK_PACKAGE_CONTENT|(from.current=='WORK_IN_PROCESS')].from.id";
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "PROJECT_TASK", AWLRel.PROJECT_TASK.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "ASSIGNED", AWLState.ASSIGNED.get(context, AWLPolicy.INBOX_TASK));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "REVIEW", AWLState.REVIEW.get(context, AWLPolicy.INBOX_TASK));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "INBOX_TASK", AWLType.INBOX_TASK.get( context ));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "ROUTE_TASK", AWLRel.ROUTE_TASK.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "OBJECT_ROUTE", AWLRel.OBJECT_ROUTE.get(context));			
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "ARTWORK_ELEMENT_CONTENT", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "POA_ARTWORK_MASTER", AWLRel.POA_ARTWORK_MASTER.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "ARTWORK_PACKAGE_CONTENT", AWLRel.ARTWORK_PACKAGE_CONTENT.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "WORK_IN_PROCESS", AWLState.WORK_IN_PROCESS.get(context, AWLPolicy.ARTWORK_PACKAGE));

			return getArtworkPackageList(context, strPersonId, objectSelects);		 
		}     
	}

	//Modified by N94 during POA Simplification Highlight in R418
	/**
	 * Method will return all the cancelled state Artwork Packages.
	 * @param context The eMatrix <code>Context</code> object
	 * @param args String[] as packaged argument for method
	 * @return MapList with Cancelled state <b>Artwork Package</b>
	 * @author BNN2,DBN9
	 * @throws FrameworkException
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getInActiveArtworkPackages (Context context, String[] args) throws FrameworkException 
	{   
		return getArtworkPackages(context,AWLState.CANCELLED.get(context, AWLPolicy.ARTWORK_PACKAGE));     
	}
	
	
	/**
	 * Method will return all the Complete state Artwork Packages.
	 * @param context The eMatrix <code>Context</code> object
	 * @param args String[] as packaged argument for method
	 * @return MapList with Complete state <b>Artwork Package</b>
	 * @author DBN9,BNN2
	 * @throws FrameworkException
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getCompletedArtworkPackages (Context context, String[] args) throws FrameworkException 
	{   
		return getArtworkPackages(context,AWLState.COMPLETE.get(context, AWLPolicy.ARTWORK_PACKAGE));      
	}
	/**
	 * Method will called from public API's to get 'Artwork Package' list based on the state.
	 * @param context The eMatrix <code>Context</code> object
	 * @param stateName state name of <b>Artwork Package</b>
	 * @return MapList with Complete state <b>Artwork Package</b>
	 * @author DBN9,BNN2
	 * @throws FrameworkException
	 */
	private MapList getArtworkPackages(Context context, String stateName) throws FrameworkException {
		
		if(Access.isArtworkProjectManager(context) || Access.isProductManager(context))
		{
			String strInActiveACWhereExpression = AWLUtil.strcat("(current == ", stateName, ")");
			return getArtworkPackageList(context, strInActiveACWhereExpression);
		} 
		else 
		{
			Person personObject = Person.getPerson(context, context.getUser());  
			String strPersonId = personObject.getObjectId();

			String objectSelects = "to[PROJECT_TASK|from.current=='COMPLETE' && from.type =='INBOX_TASK'].from.from[ROUTE_TASK].to.to[OBJECT_ROUTE].from.to[ARTWORK_ELEMENT_CONTENT].from.to[POA_ARTWORK_MASTER].from.to[ARTWORK_PACKAGE_CONTENT|(from.current=='AP_STATE_NAME')].from.id";
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "PROJECT_TASK", AWLRel.PROJECT_TASK.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "COMPLETE", AWLState.COMPLETE.get(context, AWLPolicy.INBOX_TASK));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "INBOX_TASK", AWLType.INBOX_TASK.get( context ));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "ROUTE_TASK", AWLRel.ROUTE_TASK.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "OBJECT_ROUTE", AWLRel.OBJECT_ROUTE.get(context));			
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "ARTWORK_ELEMENT_CONTENT", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "POA_ARTWORK_MASTER", AWLRel.POA_ARTWORK_MASTER.get(context));
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "ARTWORK_PACKAGE_CONTENT", AWLRel.ARTWORK_PACKAGE_CONTENT.get(context));
			
			objectSelects = FrameworkUtil.findAndReplace(objectSelects, "AP_STATE_NAME", stateName);
			
			return getArtworkPackageList(context, strPersonId, objectSelects);		 
		}
	}

	protected MapList getArtworkPackageList(Context context, String strWhereCondition) throws FrameworkException 
	{	   
		MapList relBusObjPageList    = new MapList();
		StringList objectSelects     = StringList.create(SELECT_ID);

		relBusObjPageList = findObjects(context, AWLType.ARTWORK_PACKAGE.get(context),
				QUERY_WILDCARD, QUERY_WILDCARD, QUERY_WILDCARD, QUERY_WILDCARD,
				strWhereCondition,
				true,
				objectSelects);

		return relBusObjPageList;
	}	

	protected MapList getArtworkPackageList(Context context, String strPersonId, String objectSelects) throws FrameworkException 
	{
		String strQuery = "print bus $1 select $2 dump";					
		String sResult = MqlUtil.mqlCommand(context, strQuery, strPersonId, objectSelects);			

		StringList slIdList = FrameworkUtil.split(sResult, ",");
		slIdList = BusinessUtil.toUniqueList(slIdList);

		MapList relBusObjPageList = new MapList();
		for(int i=0; i<slIdList.size(); i++)
		{
			String strObjectId = (String)slIdList.get(i);
			Map mpObject = new HashMap();
			mpObject.put(SELECT_ID, strObjectId);				
			relBusObjPageList.add(mpObject);
		}
		return relBusObjPageList;
	}	


	@SuppressWarnings("unchecked")
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkPackageContent(Context context, String[] args) throws FrameworkException 
	{
		try
		{
			Map requestMap 			= (Map)JPO.unpackArgs(args);
			String artworkId 		= BusinessUtil.getObjectId(requestMap);
			String actionType 		= getActionType(requestMap);
			StringList compareLangs = getCompareLanguages(requestMap);
			//String filterType 		= getFilterType(requestMap);
			String filterType = getFilterOwner(context, requestMap);
			ArtworkPackage artworkPackage = new ArtworkPackage(artworkId);
			String languageType 	= getLanguageType(context, requestMap);
			//Added to prevent loading local preference language for every artwork package
			StringList languageList = artworkPackage.getArtworkContentLanguages(context);
			//above statement return either url sent language or LocalDisplayPreference
			if(BusinessUtil.isNotNullOrEmpty(languageList) && !languageList.contains(languageType))
			{
				languageList.sort();
				languageType = (String)languageList.get(0);
			}
					
			
			String MASTER_ARTWORK_ELEMENT = AWLType.MASTER_ARTWORK_ELEMENT.get(context);

			
			StringList selects = BusinessUtil.toStringList(SELECT_ID, 
					ArtworkContent.getArtworkMasterIdSel(context), 
					AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context),
					SELECT_CURRENT);

			
			selects.add(AWLAttribute.IS_BASE_COPY.getSel(context));
			selects.add(SELECT_CURRENT_ACCESS);
			selects.add(SELECT_LATEST);
			//below is used in evaluate changed Rows in MCAU Page for Graphic Types. validateAuthoring() 
			selects.add(SELECT_TYPE);
			
			MapList artworkContent = null;

			if(isLocalCopyAction(actionType))
			{
				artworkContent = getArtworkLocalContent(context, artworkId, languageType, compareLangs);
			} else {
				artworkContent = artworkPackage.getArtworkPackageContent(context, selects, true);
				artworkContent = BusinessUtil.fixKey(artworkContent, ArtworkContent.getArtworkMasterIdSel(context), MASTER_ARTWORK_ELEMENT);
			}

			if(isTaskAssignmentAction(requestMap)) {
				boolean isLocalAssignment = AWLConstants.LOCAL_COPY.equalsIgnoreCase(getAssignType(requestMap));
				String langIdKey   = BusinessUtil.isNotNullOrEmpty(languageType)? (AWLUtil.strcat(SELECT_ID, languageType)) : SELECT_ID;
                String ObsoleteState = AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
				for (Iterator iterator = artworkContent.iterator(); iterator.hasNext();) {
					Map assigneeMap = (Map) iterator.next();
					if(isLocalAssignment) {
						String strContentId = (String)assigneeMap.get(langIdKey);
						String baseContentId = (String)assigneeMap.get(AWLConstants.BASE_COPY_ID);
						if(BusinessUtil.isNullOrEmpty(strContentId) || (strContentId.equals(baseContentId))) {
							assigneeMap.put(AWLConstants.SB_ROW_DISABLE_SELECTION, RANGE_TRUE);
							continue;
						}
					}
					boolean bHasRoute = RouteUtil.hasRoute(context, (String)assigneeMap.get(isLocalAssignment ? langIdKey : SELECT_ID));
					boolean  isObsoleted      = ObsoleteState.equals((String)assigneeMap.get(SELECT_CURRENT));

					assigneeMap.put(AWLConstants.HAS_ROUTE, bHasRoute ? RANGE_TRUE : RANGE_FALSE);
					assigneeMap.put(AWLConstants.SB_ROW_DISABLE_SELECTION, ( bHasRoute || isObsoleted)  ? RANGE_TRUE : RANGE_FALSE);
					
				}
			} else {
				artworkContent = filterCopyByAccess(context, artworkId, artworkContent, actionType, filterType);
			}
			
			String IS_GRAPHIC_ELEMENT = AWLUtil.strcat("type.kindof[" , AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context) , "]");
			String ATTR_INLINE_TRANSLATION = AWLAttribute.INLINE_TRANSLATION.getSel(context);
			String ATTR_TRANSLATE = AWLAttribute.TRANSLATE.getSel(context);
			String PROP_INTERFACE_STRUCTMASTER = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			
			StringList masterSelects = BusinessUtil.toStringList(SELECT_ID, SELECT_CURRENT ,
																IS_GRAPHIC_ELEMENT, ATTR_INLINE_TRANSLATION,
																ATTR_TRANSLATE, PROP_INTERFACE_STRUCTMASTER);
			
			StringList artworkMasterIds = BusinessUtil.toStringList(artworkContent, MASTER_ARTWORK_ELEMENT);
			MapList artworkMasterInfoList = BusinessUtil.getInfo(context, artworkMasterIds, masterSelects);
			
			artworkMasterInfoList = BusinessUtil.fixKey(artworkMasterInfoList, IS_GRAPHIC_ELEMENT, "MasterIsGraphic");
			artworkMasterInfoList = BusinessUtil.fixKey(artworkMasterInfoList, ATTR_INLINE_TRANSLATION, "IsMasterInline");
			artworkMasterInfoList = BusinessUtil.fixKey(artworkMasterInfoList, ATTR_TRANSLATE, "IsMasterTranslate");
			artworkMasterInfoList = BusinessUtil.fixKey(artworkMasterInfoList, PROP_INTERFACE_STRUCTMASTER, "isStructuredElement");
			artworkMasterInfoList = BusinessUtil.fixKey(artworkMasterInfoList, SELECT_ID, MASTER_ARTWORK_ELEMENT);
			artworkMasterInfoList = BusinessUtil.fixKey(artworkMasterInfoList, SELECT_CURRENT, "MasterState");
			
			for (int i = 0; i < artworkContent.size(); i++) 
			{
				Map artworkContentMap = (Map) artworkContent.get(i);
				Map artworkMasterMap = (Map) artworkMasterInfoList.get(i);
				
				artworkContentMap.putAll(artworkMasterMap);
			}
			
			return artworkContent;
			
		}catch (Exception e) { throw new FrameworkException(e); }
	}

	protected String getFilterType(Map requestMap)
	{
		String filterType = BusinessUtil.getString(requestMap, FILTER_TYPE);	
		String filters    = BusinessUtil.getString(requestMap, "filters");
		String jsFilter   = BusinessUtil.getString(BusinessUtil.toJSONObject(filters), FILTER_TYPE);
		if(AWLConstants.FILTER_TYPE_ALL.equalsIgnoreCase(jsFilter) || AWLConstants.FILTER_TYPE_MINE.equalsIgnoreCase(jsFilter))
			filterType = jsFilter;
		else if(!AWLConstants.FILTER_TYPE_ALL.equalsIgnoreCase(filterType) && !AWLConstants.FILTER_TYPE_MINE.equalsIgnoreCase(filterType))
			filterType = AWLConstants.FILTER_TYPE_ALL;

		return filterType;
	}
	
	protected String getFilterOwner(Context context, Map requestMap) throws Exception{
		String ownerFilter = (String)requestMap.get("AWLOwnerFilter");
		if(BusinessUtil.isNullOrEmpty(ownerFilter)){
			ownerFilter = AWLPreferences.getTaskDisplayPreference(context);
			requestMap.put("AWLOwnerFilter", ownerFilter);					
		}
		return ownerFilter;
	}

	protected MapList filterCopyByAccess(Context context, String artworkId, MapList elementsList,
			String actionType, String filterType) throws FrameworkException
			{
		MapList filteredList    = new MapList();
		updateEditableInfo(context, artworkId, elementsList, actionType);

		for(Iterator eitr = elementsList.iterator(); eitr.hasNext();)
		{
			Map<String, String> elementMap  = (Map)eitr.next();
			if(!elementMap.containsKey(AWLConstants.IS_EDITABLE))
				elementMap.put(AWLConstants.IS_EDITABLE, RANGE_FALSE);

			if(!elementMap.containsKey(AWLConstants.HAS_ROUTE_ACCESS))
				elementMap.put(AWLConstants.HAS_ROUTE_ACCESS, RANGE_FALSE);

			if(!elementMap.containsKey(AWLConstants.HAS_MODIFY_ACCESS))
				elementMap.put(AWLConstants.HAS_MODIFY_ACCESS, RANGE_FALSE);

			if(AWLConstants.FILTER_TYPE_MINE.equalsIgnoreCase(filterType) && isEditable(elementMap))
				filteredList.add(elementMap);
			else if(AWLConstants.FILTER_TYPE_ALL.equalsIgnoreCase(filterType))
				filteredList.add(elementMap);
		}
		return filteredList;
			}

	protected boolean isEditable(Map elementMap) {
		return RANGE_FALSE.equalsIgnoreCase((String) elementMap.get(AWLConstants.SB_ROW_DISABLE_SELECTION));
	}

	//Modified by N94 during POA Simplification Highlight in R418
	protected void updateEditableInfo(Context context, String artworkId, MapList copyList, String actionType) throws FrameworkException
	{
		StringList idList        = BusinessUtil.getIdList(copyList);

		String routePurposeKey   = AWLUtil.strcat(FROM_OPEN , AWLRel.OBJECT_ROUTE.get(context) , "].to." , AWLAttribute.ROUTE_BASE_PURPOSE.getSel(context));
		String routeIdKey        = AWLUtil.strcat(FROM_OPEN , AWLRel.OBJECT_ROUTE.get(context) , REL_SEL_CLOSE_TO_ID);
		String routeStatusKey    = AWLUtil.strcat(FROM_OPEN , AWLRel.OBJECT_ROUTE.get(context) , "].to." , AWLAttribute.ROUTE_STATUS.getSel(context));
		String routeArtworkAction= AWLUtil.strcat(FROM_OPEN , AWLRel.OBJECT_ROUTE.get(context)  , "].to." , AWLAttribute.ARTWORK_INFO.getSel(context));

		String taskTypeKey       = AWLUtil.strcat(TO_OPEN , AWLRel.ROUTE_TASK.get(context) , "].from.type");
		String taskNameKey       = AWLUtil.strcat(TO_OPEN , AWLRel.ROUTE_TASK.get(context) , "].from.name");
		String taskOwnerKey      = AWLUtil.strcat(TO_OPEN , AWLRel.ROUTE_TASK.get(context) , "].from.owner");
		String taskIdKey         = AWLUtil.strcat(TO_OPEN , AWLRel.ROUTE_TASK.get(context) , "].from.id");
		String taskStateKey      = AWLUtil.strcat(TO_OPEN , AWLRel.ROUTE_TASK.get(context) , "].from.current");

		StringList routeSelects  = BusinessUtil.toStringList(routePurposeKey, routeIdKey, routeStatusKey, routeArtworkAction);
		StringList taskSelects   = BusinessUtil.toStringList(taskTypeKey, taskNameKey, taskOwnerKey, taskIdKey, taskStateKey);

		Map copyIdMap  			 = BusinessUtil.toMapById(copyList);
		MapList values 			 = BusinessUtil.getInfoList(context, idList, routeSelects);

		StringList routePurposes = BusinessUtil.toStringList(AWLConstants.ROUTE_REVIEW, AWLConstants.ROUTE_APPROVAL, AWLConstants.ROUTE_STANDARD);

		if(isApprovalAction(actionType))
		{
			routePurposes.remove(AWLConstants.ROUTE_REVIEW);
		}

		String COMPLETE = AWLState.COMPLETE.get(context, AWLPolicy.INBOX_TASK);
		
		String artworkPackageState = BusinessUtil.getInfo(context, artworkId, DomainConstants.SELECT_CURRENT);
		boolean isWIP = AWLState.WORK_IN_PROCESS.get( context, AWLPolicy.ARTWORK_PACKAGE ).equalsIgnoreCase(artworkPackageState);

		for(int i = 0; i < idList.size(); i++)
		{
			Map valueMap  		   = (Map)values.get(i);
			Map copyMap   		   = (Map)copyIdMap.get(idList.get(i).toString());
			StringList purposeList = BusinessUtil.getStringList(valueMap, routePurposeKey);
			StringList rotuteList  = BusinessUtil.getStringList(valueMap, routeIdKey);
			StringList statusList  = BusinessUtil.getStringList(valueMap, routeStatusKey);
			StringList artworkActionList = BusinessUtil.getStringList(valueMap, routeArtworkAction);
			StringList currentAccess = FrameworkUtil.split(BusinessUtil.getFirstString(copyMap, SELECT_CURRENT_ACCESS), ",");

			StringList accessList  = new StringList();
			Map activeTasks = new HashMap();

			for(int p = 0; p < purposeList.size(); p++)
			{
				if(AWLConstants.ROUTE_STARTED.equals(statusList.get(p).toString()) &&
						routePurposes.contains((purposeList.get(p).toString())))
				{
					String routeId        	 = rotuteList.get(p).toString();
					Map taskInfo		 	 = BusinessUtil.getInfoList(context, routeId, taskSelects);

					StringList taskIdList    = BusinessUtil.getStringList(taskInfo, taskIdKey);
					StringList taskStateList    = BusinessUtil.getStringList(taskInfo, taskStateKey);
					StringList taskOwnerList = BusinessUtil.getStringList(taskInfo, taskOwnerKey);
					String artworkAction     = (String) artworkActionList.get(p);

					for(int t = 0; t < taskIdList.size(); t++)
					{
						String taskState = taskStateList.get(t).toString();

						if(COMPLETE.equals(taskState)) {
							continue;//should not consider completed tasks
						}
						String taskId  = taskIdList.get(t).toString();
						String taskOwner = taskOwnerList.get(t).toString();
						if (BusinessUtil.isKindOf(context, taskId, AWLType.INBOX_TASK.get(context)))
						{
					        if(artworkAction.equalsIgnoreCase(actionType))
							{
								activeTasks.put(taskOwner, taskId);
								accessList.add(taskOwner);
							}
						}
					}
				}
			}

			String contextUser = context.getUser();
			String inboxTaskId = "";
			if(activeTasks.containsKey(contextUser)) {
				inboxTaskId = (String) activeTasks.get(contextUser);
			} else if(!activeTasks.isEmpty()) {
				String[] taksOwnerArr = BusinessUtil.toStringArray(activeTasks.keySet()) ;
				for (int j = 0; j < taksOwnerArr.length; j++) {
					String taskOwner =  taksOwnerArr[j];
					String result = MqlUtil.mqlCommand(context, "list user $1 select type dump", taskOwner);
					if(("role".equals(result) || "group".equals(result)) && PersonUtil.hasAssignment(context, taskOwner)) {
						inboxTaskId = (String) activeTasks.get(taskOwner);
						break;
					}
				}
				//If PM or who has access to Artwork Package open the AP page (not having active task assigned to them)
				//we should show any current active task
				if(BusinessUtil.isNullOrEmpty(inboxTaskId))
					inboxTaskId = (String) activeTasks.get(taksOwnerArr[0]);
			}

			boolean hasRouteAccess  = accessList.contains(contextUser);
            
			boolean hasModifyAccess = currentAccess.contains(ACCESS_MODIFY);
			boolean hasReviseAccess = currentAccess.contains(ACCESS_REVISE);
			boolean hasPromoteDemoteAccess = currentAccess.contains(ACCESS_PROMOTE) && currentAccess.contains(ACCESS_DEMOTE);
			//POA Simplification
			//Element will not be connected to Artwork Package here..so no need to check following line
			//boolean connected       = isElementConnectedToArtwork(context, latestRev.getObjectId(), artworkId);
			//instead check whether the element that is connected to POA is latest or not if not we will not be showing allowing to edit the element
			boolean latest = "TRUE".equalsIgnoreCase(BusinessUtil.getFirstString(copyMap, SELECT_LATEST));
			boolean  isReleased      = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT).equals((String)copyMap.get(SELECT_CURRENT));

			boolean  isEditable      = !hasRouteAccess ? false :    
                					   RouteUtil.isApprovalAction(actionType) ? hasPromoteDemoteAccess :
                				       latest && (hasModifyAccess || (isReleased && hasReviseAccess));
			
			boolean  isBaseCopy      =  AWLConstants.RANGE_YES.equalsIgnoreCase((String)copyMap.get(AWLAttribute.IS_BASE_COPY.getSel(context)));

			isEditable		=  isLocalCopyAction(actionType) && isBaseCopy ? false : isEditable;

			isEditable = isWIP? isEditable : false;

			copyMap.put(AWLConstants.IS_EDITABLE, isEditable ? RANGE_TRUE : RANGE_FALSE);
			copyMap.put(AWLConstants.SB_ROW_DISABLE_SELECTION, isEditable ?  RANGE_FALSE : RANGE_TRUE);
			copyMap.put(AWLConstants.HAS_ROUTE_ACCESS, hasRouteAccess ? RANGE_TRUE : RANGE_FALSE);
			copyMap.put(AWLConstants.HAS_MODIFY_ACCESS, hasModifyAccess ? RANGE_TRUE : RANGE_FALSE);
			copyMap.put(AWLConstants.ARTWORK_TASK_ID, inboxTaskId);
		}
	}

	protected boolean isElementConnectedToArtwork(Context context, String copyId, String artworkId) throws FrameworkException
	{
		String expression   = AWLUtil.strcat(TO_OPEN, AWLRel.ARTWORK_PACKAGE_CONTENT.get(context), "|from.id=='", artworkId, "']");
		String value    	= BusinessUtil.getInfo(context, copyId, expression);
		return !RANGE_FALSE.equalsIgnoreCase(value);
	}

	/**
	 * Returns executeScript for dynamic refresh after apply
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Map          - post process response
	 * @since   AWL 2011x.FD03
	 * @author  senthilnathan sk (NQG)
	 */
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public Map reloadArtworkStructure(Context context, String args[])
	{
		Map result = new HashMap();
		String errorMsg = context.getCustomData("errormessage");
		if(BusinessUtil.isNotNullOrEmpty(errorMsg)) {
			result.put("Action", "STOP");
		} else {
			result.put("Action", "execScript");
			result.put("Message", AWLUtil.strcat("{ main : function() ", 
					"{ ", 
					" 	updateoXML(xmlResponse); ",
					" 	postDataXML.loadXML(\"<mxRoot/>\"); ",
					" 	arrUndoRows = new Object(); ",
					" 	aMassUpdate = new Array(); ",
					"	reloadCurrentStructure();  ",
			"} }"));
		}
		return result;
	}

	public Map doProcess(Context context, String[] args) throws FrameworkException
	{
	    Map status = new HashMap();
	    try
	    {
		Map requestMap 	= (Map)JPO.unpackArgs(args);
	        String service  = BusinessUtil.getString(requestMap, "service");

		String artworkId 	  = (String)requestMap.get("artworkId");
		if(!BusinessUtil.isNullOrEmpty(artworkId))
		{
		    String currentState	= BusinessUtil.getInfo(context, artworkId, "current");
		    if("Cancelled".equalsIgnoreCase(currentState))
		    {
		    	String strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElementCancelled.Alert");
			    throw new Exception(strAlertMessage);
		    }
		}
	    //by e55 for IR-161865V6R2013x 
	        if(AWLConstants.ARTWORK_CONTENT_SUBMIT_AUTHOR.equalsIgnoreCase(service))
	        {
	        	status = submitCopyAuthor(context, requestMap);
	        }
	        else if(AWLConstants.ARTWORK_CONTENT_SUBMIT_APPRORVE.equalsIgnoreCase(service) || 
	        		AWLConstants.ARTWORK_CONTENT_SUBMIT_REJECT.equalsIgnoreCase(service))
	        {
	        	status = submitCopyApproveReject(context, requestMap, service);
	        }
	        else if("TaskAssignment".equalsIgnoreCase(service))
	        {
	        	status = checkApprovalAccess(context, requestMap);
	        }
	        else
	        {
	        	status = getStateStatus(context, requestMap);
	        }
	    } catch (Exception e) { throw new FrameworkException(e); }
	    return status;
	}

	protected Map checkApprovalAccess(Context context, Map requestMap) throws FrameworkException
	{
	    Map status = new HashMap();
	    String strObjectId 	  = (String)requestMap.get("objectId");
	    String strActionType = (String)requestMap.get("actionType");
	    try {
	    	DomainObject obj = new DomainObject(strObjectId);
			if(!obj.exists(context)) {
				return status;
			}
			String strRouteBasePurpose = AWLUtil.strcat("attribute[", AWLAttribute.ROUTE_BASE_PURPOSE.get( context ), "].value");
			Map mapInfo = BusinessUtil.getInfo(context, strObjectId,BusinessUtil.toStringList(SELECT_TYPE, strRouteBasePurpose));
			boolean bFlag = false;
			if(TYPE_ROUTE_TEMPLATE.equals(mapInfo.get(SELECT_TYPE)))
			{
				String strRTBasePurpose = (String)mapInfo.get(strRouteBasePurpose);
				bFlag =AWLConstants.ROUTE_APPROVAL.equals(strRTBasePurpose);
			}
			else
			{
				Person person = (Person)DomainObject.newInstance(context, TYPE_PERSON);
				person.setId(strObjectId);
				String personName = person.getInfo(context, SELECT_NAME);
				bFlag = AWLConstants.MASTER_COPY_AUTHORING.equalsIgnoreCase(strActionType) ?
				       Access.hasRole(context, personName, Access.COPY_ARTWORK_ROLES.MASTER_COPY_APPROVER) :
				       Access.hasRole(context, personName, Access.COPY_ARTWORK_ROLES.LOCAL_COPY_APPROVER);

			}
			status.put("hasApprovalAccess", bFlag ? RANGE_TRUE : RANGE_FALSE);
		} catch (Exception e) { throw new FrameworkException(e); }
    	    return status;
	}
	
	public StringList getAdvancedActions(Context context, String[] args) throws FrameworkException
	{
		StringList advancedEditList = new StringList();
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			Map requestMap     = BusinessUtil.getRequestParamMap(programMap);

			boolean isAuthor = isAuthoringAction(getActionType(requestMap));
			AWLGraphicsElementUIBase_mxJPO graphicUI = (AWLGraphicsElementUIBase_mxJPO)newInstanceOfJPO(context, "AWLGraphicsElementUI");

			boolean showCopyTextDiff = showStringCompare(context);
			StringList copyTextDiff = showCopyTextDiff ?((AWLArtworkElementUIBase_mxJPO)newInstanceOfJPO(context,"AWLArtworkElementUI" ,args)).getCopyTextDiff(context, args) : null;
			StringList taskInfoVector = getTaskInfo(context, args);

			Map columnMap      = BusinessUtil.getColumnMap(programMap);
			String colLang     = BusinessUtil.getString(columnMap, AWLConstants.COLUMN_LANGUAGE);
			String newColumn   = AWLUtil.strcat("CurrentCopyText", colLang);
			String advancedEditTitle = AWLPropertyUtil.getI18NString(context, "emxAWL.Title.AdvancedEdit");

			String space16Image = "<img src=\"../common/images/utilSpacer.gif\" width=\"16px\" height=\"16px\" />";
			String spaceImage = "<img src=\"../common/images/utilSpacer.gif\" width=\"1px\" height=\"1px\" />";
			
			StringList graphicTypeList = AWLType.ARTWORK_GRAPHIC_ELEMENT.getDerivative(context, false);
			
			
			StringList graphicIDs = new StringList();
			for(Iterator itr = objectList.iterator(); itr.hasNext();)
			{
				Map currentMap = (Map)itr.next();
				if(graphicTypeList.contains((String)currentMap.get(SELECT_TYPE)))
					graphicIDs.add((String)currentMap.get(DomainObject.SELECT_ID));
			}
			
			StringList hasFiles = BusinessUtil.getInfo(context, graphicIDs, AWLUtil.strcat("from[",AWLRel.GRAPHIC_DOCUMENT.get(context),"].to.from[Active Version]"));
			
			for(int i=0; i<objectList.size(); i++)
			{
				Map objectMap = (Map)objectList.get(i);
				String id        = BusinessUtil.getId(objectMap);
				ArtworkContent ae = ArtworkContent.getNewInstance(context, id);
				String masterId = BusinessUtil.getString(objectMap, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
				String editHtml  = "";
				int idx = graphicIDs.indexOf(id);
				if(idx != -1)
				{
					boolean hasFile = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) hasFiles.get(idx));
					//editHtml = graphicUI.getGraphicImageActions(context, id, ( isEditable(objectMap)&& isAuthor ));
					editHtml = graphicUI.getGraphicImageActions(context, id, hasFile, ( isEditable(objectMap)&& isAuthor ));
				} 
				else if( isEditable(objectMap) && ArtworkContent.isCompositeCopyElement( context, masterId ) && isAuthor )
				{
					editHtml = AWLUtil.strcat("<a href=\"javascript:;\" copyId=\"", id , "\" featureId=\"", masterId , "\" onclick=\"openAdvancedEditWithBuildListTrue(this,'", newColumn ,"');\"><img src=\"",
							"../awl/images/" ,"AWLBuildFromList.gif" , "\" " ,
							"title=\"" ,advancedEditTitle ,"\" alt=\"" ,advancedEditTitle,
							"\" border=\"0\" align=\"absmiddle\" /></a>");

				}
				editHtml = BusinessUtil.isNullOrEmpty(editHtml) ? space16Image : editHtml;
				String taskInfo = BusinessUtil.isNullOrEmpty((String)taskInfoVector.get(i)) ? space16Image : (String)taskInfoVector.get(i);
				String copyTxtDiff = showCopyTextDiff ? (String)copyTextDiff.get(i) : "";
				copyTxtDiff = BusinessUtil.isNullOrEmpty(copyTxtDiff) ? space16Image : copyTxtDiff;
				String actionsHTML = AWLUtil.strcat(taskInfo, spaceImage,
													editHtml, spaceImage,
													copyTxtDiff);				
				advancedEditList.add(actionsHTML);
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		return advancedEditList;
	}

	public StringList getTaskInfo(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);

			StringList taskInfoList = new StringList(objectList.size());
			StringList taskIds = BusinessUtil.toStringList(objectList, AWLConstants.ARTWORK_TASK_ID);
			for (int i = 0; i < taskIds.size(); i++) {
				String inboxTaskId = (String) taskIds.get(i);
				if(BusinessUtil.isNullOrEmpty(inboxTaskId)) {
					taskInfoList.add("");
					continue;
				}

				String taksName = BusinessUtil.getInfo(context, inboxTaskId, SELECT_NAME);
				taksName = XSSUtil.encodeForHTML(context, taksName);
				String image = "AWLTaskInfo.gif";
				String taskHtml = AWLUtil.strcat("<a href=\"javascript:;\" onclick=\"openTaskInfo(this,'", inboxTaskId, "','", taksName, "');\"><img src=\"",
				"../awl/images/", image, "\" ",
				"title=\"", taksName, "\" alt=\"", taksName, 
				"\" border=\"0\" /></a>");
				taskInfoList.add(taskHtml);
			}
			return taskInfoList;
		} catch (Exception e) { throw new FrameworkException(e); }

	}	

	public Map submitCopyAuthor(Context context, Map requestMap) throws FrameworkException
	{
		Map submitStatus = new HashMap();
		try
		{
			//String loggedInUser      = PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
			//String contextUser       = context.getUser();
			//PropertyUtil.setRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, AWLUtil.strcat("\"", contextUser, "\""), false);
			String languageStr  	 = BusinessUtil.getString(requestMap, AWLConstants.LANGUAGE_STRING);
			String timeZone			 = BusinessUtil.getString(requestMap, AWLConstants.TIME_ZONE);
			double clientTZOffset    = (new Double(timeZone)).doubleValue();
			context.setCustomData("timeZone", timeZone);
			
			MapList dataList = getArtworkContentSumitDataList(context, requestMap);
			StringList slFailureCopies = new StringList();
			
			for (Iterator iterator = dataList.iterator(); iterator.hasNext();)
			{
	            Map copyObject = (Map)iterator.next();
	            String artworkElementId  = BusinessUtil.getId(copyObject);
				try {
					ContextUtil.startTransaction(context, true);
					Map<String,String> reviewTask   = RouteUtil.getReviewTaskToSubmit(context, artworkElementId);
					if(reviewTask != null)
					{
						String taskId  = BusinessUtil.getId(reviewTask);
						RouteUtil.CompleteInboxTask(context, taskId, AWLConstants.TASK_STATUS_NONE, AWLConstants.TASK_STATUS_NONE, languageStr, clientTZOffset);						
					}
					ContextUtil.commitTransaction(context);
				} catch (Exception ex) {
					ContextUtil.abortTransaction(context);
					ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, artworkElementId);
					ArtworkMaster artworkMaster=artworkElement.getArtworkMaster( context );
					slFailureCopies.addElement(artworkMaster.getDisplayName( context )); 
				}
			}
			
			if (!slFailureCopies.isEmpty()) {
				String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.AuthoringTask.Error");
				strMessage = AWLUtil.strcat(strMessage, FrameworkUtil.join(slFailureCopies, ", "));
				MqlUtil.mqlCommand(context, "notice $1", strMessage);
			}

			submitStatus.put(AWLConstants.ACTION, AWLConstants.ACTION_SUCCESS);
		} catch (Exception e) { throw new FrameworkException(e); }
		return submitStatus;

	}
	
	protected Map submitCopyApproveReject(Context context, Map requestMap, String artworkAction) throws FrameworkException
	{
	    Map submitStatus          	 = new HashMap();
		try
		{
			String loggedInUser      = PropertyUtil.getRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, false);
			String contextUser       = context.getUser();
			
			PropertyUtil.setRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, contextUser, false);
			String languageStr  	 = BusinessUtil.getString(requestMap, AWLConstants.LANGUAGE_STRING);
			String timeZone			 = BusinessUtil.getString(requestMap, AWLConstants.TIME_ZONE);
			double clientTZOffset    = (new Double(timeZone)).doubleValue();
			MapList dataList = getArtworkContentSumitDataList(context, requestMap);
	        StringList slFailureCopies = new StringList();
	        for(int i = 0; i < dataList.size(); i++)
		    {
	            Map copyObject = (Map)dataList.get(i);
	            String copyId  = BusinessUtil.getId(copyObject);
	            try {
        			ContextUtil.startTransaction(context, true);
        	        	
        	        	Map approvalTask = RouteUtil.getApprovalTaskToSubmit(context, copyId);
        	        	if(approvalTask != null)
        	        	{
        	        		String taskId  = BusinessUtil.getId(approvalTask);
        			        String comments  = BusinessUtil.getString(copyObject, "comment");
        	        		RouteUtil.CompleteInboxTask(context, taskId, comments, artworkAction, languageStr, clientTZOffset);
        	        	}
        	        	ContextUtil.commitTransaction(context);
			} catch (Exception ex) {
				ContextUtil.abortTransaction(context);
				ArtworkContent artworkElement = ArtworkContent.getNewInstance(context, copyId);
				ArtworkMaster artworkMaster=artworkElement.getArtworkMaster( context );
				slFailureCopies.addElement(artworkMaster.getDisplayName( context )); }
	        }
	        PropertyUtil.setRPEValue(context, ContextUtil.MX_LOGGED_IN_USER_NAME, loggedInUser, false);
	        if (!slFailureCopies.isEmpty()) 
	        {
			String strMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.ApprovalTask.Error");
			strMessage = AWLUtil.strcat(strMessage, FrameworkUtil.join(slFailureCopies, ", "));
	        	MqlUtil.mqlCommand(context, "notice $1", strMessage);
	    	        }
	        
	        submitStatus.put("action", "success");
		} catch (Exception e) { throw new FrameworkException(e); }
		return submitStatus;
	}

	private MapList getArtworkContentSumitDataList(Context context, Map requestMap)
			throws FrameworkException {
		String data              = BusinessUtil.getString(requestMap, "data");
		JsonArray dataArray		 = BusinessUtil.toJSONArray(data);
		return BusinessUtil.toMapList(dataArray);
	}

	protected String getActionType(Map requestMap)
	{
		return BusinessUtil.getString(requestMap, AWLConstants.ARTWORK_ACTION_TYPE);
	}


	protected boolean isMasterCopyAction(String actionType)
	{
		return AWLConstants.MASTER_COPY_AUTHORING.equalsIgnoreCase(actionType) ||
				AWLConstants.MASTER_COPY_APPROVAL.equalsIgnoreCase(actionType);
	}

	protected boolean isLocalCopyAction(String actionType)
	{
		return AWLConstants.LOCAL_COPY_AUTHORING.equalsIgnoreCase(actionType) ||
				AWLConstants.LOCAL_COPY_APPROVAL.equalsIgnoreCase(actionType);
	}

	protected boolean isAuthoringAction(String actionType)
	{
		return AWLConstants.MASTER_COPY_AUTHORING.equalsIgnoreCase(actionType) ||
				AWLConstants.LOCAL_COPY_AUTHORING.equalsIgnoreCase(actionType) ||
				AWLConstants.POA_DESIGN.equalsIgnoreCase(actionType);
	}
	protected boolean isApprovalAction(String actionType)
	{
		return AWLConstants.MASTER_COPY_APPROVAL.equalsIgnoreCase(actionType) || 
				AWLConstants.LOCAL_COPY_APPROVAL.equalsIgnoreCase(actionType) ||
				AWLConstants.POA_APPROVAL.equalsIgnoreCase(actionType);
	}

	protected boolean isPOAAction(String actionType) 
	{
		return AWLConstants.POA_DESIGN.equalsIgnoreCase(actionType) ||
				AWLConstants.POA_APPROVAL.equalsIgnoreCase(actionType);
	}

	protected boolean isTaskAssignmentAction(Map requestMap) {
		String assignee  = getAssignType(requestMap);
		return (AWLConstants.MASTER_COPY.equalsIgnoreCase(assignee) ||
				AWLConstants.LOCAL_COPY.equalsIgnoreCase(assignee));
	}	

	protected static String getAssignType(Map requestMap)
	{
		return BusinessUtil.getString(requestMap, AWLConstants.ARTWORK_ASSIGN_TYPE);
	}

	public StringList canEditArtworkContent(Context context, String[] args) throws FrameworkException
	{
		try
		{
			StringList editAccess = new StringList ();
			try
			{
				Map programMap       = (Map)JPO.unpackArgs(args);
				MapList objectList   = BusinessUtil.getObjectList(programMap);
				StringList slMasterObjList = BusinessUtil.toStringList(objectList, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
				boolean blList[] = new AWLArtworkMasterUIBase_mxJPO(context,null).isMasterCopyElementEditable(context, slMasterObjList);
				
				Map requestMap	     = BusinessUtil.getRequestMap(programMap);
				boolean authoringAction = isAuthoringAction(getActionType(requestMap)); 
				for(int i=0;i<objectList.size();i++)
				{
					Map objectMap    = (Map)objectList.get(i);
					boolean editable =  authoringAction && isEditable(objectMap) && blList[i];
					
					String isStructuredElementValue = (String)objectMap.get("isStructuredElement");
					editable = editable ? "false".equalsIgnoreCase(isStructuredElementValue) : editable;
					
					editAccess.add(editable ? Boolean.TRUE.toString() : Boolean.FALSE.toString());
				}
			}catch(Exception ex)
			{
				ex.printStackTrace();
				throw new MatrixException(ex);
			}
			return editAccess;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	public MapList getDynamicLanguageColumns(Context context, String[] args) throws FrameworkException
	{
		try
		{
			MapList columns         = new MapList();
			Map programMap          = (Map)JPO.unpackArgs(args);
			Map requestMap	        = BusinessUtil.getRequestMap(programMap);

			String actionType       = getActionType(requestMap);
			String language         = getLanguageType(context, requestMap);
			
			String artworkPackageId = BusinessUtil.getObjectId(requestMap);
			
			ArtworkPackage artworkPackage = new ArtworkPackage(artworkPackageId);
			
			//Added to prevent loading local preference language for every artwork package
			StringList aplanguageList = artworkPackage.getArtworkContentLanguages(context);
			if(BusinessUtil.isNotNullOrEmpty(aplanguageList) && !aplanguageList.contains(language))
			{
				aplanguageList.sort();
				language = (String)aplanguageList.get(0);
			}
			
			StringList languageList = getCompareLanguages(requestMap);
			languageList.remove(language);
			languageList.add(0, language);

			for(int i = 0; i < languageList.size(); i++)
			{
				String xlang   = languageList.get(i).toString();
				if(AWLConstants.LOCAL_COPY_AUTHORING.equalsIgnoreCase(actionType))
				{
					columns.addAll(createAuthoringLanguageColumns(context, xlang, language.equals(xlang)));
				}
				else if(AWLConstants.LOCAL_COPY_APPROVAL.equalsIgnoreCase(actionType))
				{
					columns.addAll(createApprovalLanguageColumns(context, xlang, language.equals(xlang)));
				}
			}
			return columns;
		} catch (Exception e) { throw new FrameworkException(e); }
	}


	private MapList createAuthoringLanguageColumns(Context context, String localLang, boolean defaultLang) throws FrameworkException
	{
		String groupHeader      = AWLPropertyUtil.getI18NString(context, "emxAWL.Header.LocalCopy");
		groupHeader = AWLUtil.strcat(groupHeader, " - ", localLang);

		MapList columns    = new MapList();
		
		if(defaultLang) {
			Map lastApproved = getLastApprovedColumn(localLang, groupHeader);
			columns.add(lastApproved);

			Map newColumn = getCurrentCopyTextColumn(localLang, groupHeader, true);
			columns.add(newColumn);
			
			Map actionsColumn = getActionsColumn(localLang, groupHeader);
			columns.add(actionsColumn);
			
			//Map taskInfo = getTaskInfoColumn(localLang, groupHeader);
			//columns.add(taskInfo);
		} else {
			Map newColumn = getCurrentCompLangContentColumn(localLang, groupHeader);
			columns.add(newColumn);
		}

		Map stateColumn = getStateColumn(localLang, groupHeader);
		columns.add(stateColumn);

		for (int i = 0; i < columns.size(); i++) {
			Map col = (Map) columns.get(i);
			col.put(AWLConstants.COLUMN_LANGUAGE, localLang);
		}

		return columns;
	}

	public boolean showStringCompare(Context context, String[] args) throws FrameworkException
	{
		return showStringCompare(context);
	}

	public boolean showStringCompare(Context context) throws FrameworkException
	{
		String strCompareValue = null;
		strCompareValue = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.showStringCompare");
		return(strCompareValue != null && RANGE_TRUE.equalsIgnoreCase(strCompareValue.trim()));

	}

	private Map getCurrentCompLangContentColumn(String localLang, String groupHeader) {
		Map content = getCurrentCopyTextColumn(localLang, groupHeader, false);
		Map columnSettingsMap = BusinessUtil.getMap(content, UICache.SETTINGS);
		columnSettingsMap.put(program, AWL_ARTWORK_ELEMENT_UI_JPO);
		columnSettingsMap.put(function, "getCurrentContent");
		columnSettingsMap.put(COLUMN_TYPE, programHTMLOutput);
		content.put("label", "emxAWL.Label.Content");
		return content;
	}

	private MapList createApprovalLanguageColumns(Context context, String localLang, boolean defaultLang) throws FrameworkException
	{
		String groupHeader      = AWLPropertyUtil.getI18NString(context, "emxAWL.Header.LocalCopy");
		groupHeader = AWLUtil.strcat(groupHeader, " - ", localLang);

		MapList columns    = new MapList();

		if(defaultLang)
		{
			Map lastApproved = getLastApprovedColumn(localLang, groupHeader);
			columns.add(lastApproved);

			Map newColumn   = getCurrentCopyTextColumn(localLang, groupHeader, false);
			columns.add(newColumn);
			
			Map actionsColumn = getActionsColumn(localLang, groupHeader);
			columns.add(actionsColumn);

			//Map taskInfo = getTaskInfoColumn(localLang, groupHeader);
			//columns.add(taskInfo);
		} else 
		{
			Map newColumn = getCurrentCompLangContentColumn(localLang, groupHeader);
			columns.add(newColumn);
		}

		Map stateColumn = getStateColumn(localLang, groupHeader);
		columns.add(stateColumn);

		for (int i = 0; i < columns.size(); i++) {
			Map col = (Map) columns.get(i);
			col.put(AWLConstants.COLUMN_LANGUAGE, localLang);
		}
		return columns;
	}	

	private Map getStateColumn(String localLang, String groupHeader) {
		Map stateColumn   = createColum(AWLUtil.strcat("State", localLang), "emxFramework.Basic.State", "", AWL, groupHeader, false);
		Map settings = UIComponent.getSettings(stateColumn);
		settings.put(COLUMN_TYPE, programHTMLOutput);
		settings.put(program, AWL_ARTWORK_ELEMENT_UI_JPO);
		settings.put(function, "getCurrentState");
		settings.put("Style Column", "AWLColumnTextCenter");
		//Modifed for IR-366488-3DEXPERIENCER2015x
		settings.put("Admin Type", "State");
		settings.put(Width, "50");
		settings.put(EXPORT,RANGE_TRUE);
		return stateColumn;
	}
	
	private Map getReAuthorColumn(String localLang, String groupHeader) {
		Map reAuthorColumn   = createColum(AWLUtil.strcat("ReAuthor", localLang), "emxAWL.SelectiveAuthoring.Label.ReAuthor", "", AWL,groupHeader,false);
		Map settings = UIComponent.getSettings(reAuthorColumn);
		settings.put(COLUMN_TYPE, program);
		settings.put(program, AWL_ARTWORK_ELEMENT_UI_JPO);
		settings.put(function, "getReAuthorColumn");
		return reAuthorColumn;
	}	
	
	private Map getRouteInfoColumn(String localLang, String groupHeader) {
		Map routeColumn   = createColum(AWLUtil.strcat("RouteInfo", localLang), "<img border=\"0\" src=\"../common/images/iconSmallRoute.gif\" />", "", AWL,groupHeader,false);
		Map settings = UIComponent.getSettings(routeColumn);
		settings.put(COLUMN_TYPE, programHTMLOutput);
		settings.put(program, AWL_ARTWORK_ELEMENT_UI_JPO);
		settings.put(function, "getActiveRouteInfo");
		settings.put("Style Column", "AWLColumnTextCenter");
		settings.put(Width, "50");
		return routeColumn;
	}
	
	private Map getActionsColumn(String localLang, String groupHeader) {
		Map actions   = createColum(AWLUtil.strcat("Actions", localLang), "emxAWL.Common.Actions", "", AWL, groupHeader, false);
		Map settings = UIComponent.getSettings(actions);
		settings.put(COLUMN_TYPE, programHTMLOutput);
		settings.put(function, "getAdvancedActions");
		settings.put(program, AWL_ARTWORK_PACKAGE_UI_JPO);
		settings.put(Sortable, RANGE_FALSE);
		settings.put("Style Column", "AWLColumnTextCenter");
		settings.put(Width, "50");
		settings.put(Auto_Filter, "false");
		return actions;
	}

	private Map getCurrentCopyTextColumn(String localLang, String groupHeader, boolean isAuthroing) {
		Map newColumn   = createColum(isAuthroing ? CURRENT_COPY_TEXT : AWLUtil.strcat(CURRENT_COPY_TEXT, localLang), "emxAWL.Form.Label.CurrentContent", "", AWL, groupHeader, false);
		Map settings = UIComponent.getSettings(newColumn);
		settings.put(COLUMN_TYPE, program);
		settings.put(program, "AWLCopyElementUI");
		settings.put(function, "getCurrentCopyText");
		settings.put(Width, "200");
		settings.put(Sortable, RANGE_FALSE);
		settings.put("Preserve Spaces", RANGE_TRUE);
		settings.put(DYNAMIC_URL, DISABLE); 
		
		if(isAuthroing) {
			settings.put("Input Type","textarea");
			settings.put("Editable", RANGE_TRUE);
			settings.put("Required", RANGE_TRUE);
			settings.put("Edit Access Function", "canEditArtworkContent");
			settings.put("Edit Access Program", AWL_ARTWORK_PACKAGE_UI_JPO);
			settings.put("Update Function", "updateCopyTextValue");
			settings.put("Update Program", "AWLCopyElementUI");
			settings.put("Style Function", "getCurrentColumnStyle");
			settings.put("Style Program", AWL_ARTWORK_PACKAGE_UI_JPO);
			settings.put("Rich Text Editor", RANGE_TRUE);
		}
		return newColumn;
	}

	private Map getLastApprovedColumn(String localLang, String groupHeader) {
		Map lastApproved   = createColum(AWLUtil.strcat(DYNAMIC_LAST_APPROVED_CONTENT, localLang), "emxAWL.Label.LastApproved", "", AWL, groupHeader, false);
		Map settings = UIComponent.getSettings(lastApproved);
		settings.put(COLUMN_TYPE, programHTMLOutput);
		settings.put(program, AWL_ARTWORK_ELEMENT_UI_JPO);
		settings.put(Sortable, RANGE_FALSE);
		settings.put(function, "getLastApprovedContent");
		settings.put(EXPORT,RANGE_TRUE);
		settings.put(DYNAMIC_URL, DISABLE); 
		return lastApproved;
	}

	private Map createColum(String name, String label, String expression, String suite, String groupHeader, boolean rowGrouping)
	{
		Map column = new HashMap();
		column.put("expression_businessobject", expression);
		column.put("hidden", RANGE_FALSE);
		column.put("sorttype", "none");
		column.put("name", name);
		column.put("label", label);

		Map settings = new HashMap();
		settings.put(Sortable, RANGE_FALSE);
		settings.put("Registered Suite", suite);
		if(BusinessUtil.isNotNullOrEmpty(groupHeader))
			settings.put("Group Header", groupHeader);
		settings.put("Row Grouping", rowGrouping);
		column.put("settings", settings);

		return column;
	}

	public Map getArtworkLanguages(Context context, String[] args) throws FrameworkException
	{
		try {
			Map languageMap         = new HashMap();
			Map programMap 		    = (Map)JPO.unpackArgs(args);
			Map requestMap	        = BusinessUtil.getRequestMap(programMap);

			String artworkId   		= BusinessUtil.getObjectId(requestMap);
			ArtworkPackage ap 		= new ArtworkPackage(artworkId);
			StringList languageList = ap.getArtworkContentLanguages(context);
			
			String defaultLanguage 	= getLanguageType(context, programMap);
			
			if(BusinessUtil.isNotNullOrEmpty(languageList) && !languageList.contains(defaultLanguage)) {
				languageList.sort();
			} else {			
				languageList.remove(defaultLanguage);
				languageList.add(0, defaultLanguage);
			}

			languageMap.put(AWLConstants.RANGE_FIELD_CHOICES, languageList);
			languageMap.put(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES, languageList);
			return languageMap;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	
	public Map getOwnerFilterRangeValues(Context context, String[] args) throws FrameworkException
	{
		try {
			Map taskPreferenceMap = new HashMap();
			StringList preferenceList = new StringList();
			StringList preferenceDisplayOptionList = new StringList();
			String defaultTaskDisplay = AWLPreferences.getTaskDisplayPreference(context);
			if(BusinessUtil.isNullOrEmpty(defaultTaskDisplay) || defaultTaskDisplay.equals(AWLConstants.TASK_PREFERENCE_ALL)){
				preferenceList.add(AWLConstants.TASK_PREFERENCE_ALL);
				preferenceDisplayOptionList.add(AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkOwnerFilterCommand.Ranges.ShowAll"));
				preferenceList.add(AWLConstants.TASK_PREFERENCE_OWNED);
				preferenceDisplayOptionList.add(AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkOwnerFilterCommand.Ranges.ShowMine"));
			}
			else{
				preferenceList.add(AWLConstants.TASK_PREFERENCE_OWNED);
				preferenceDisplayOptionList.add(AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkOwnerFilterCommand.Ranges.ShowMine"));
				preferenceList.add(AWLConstants.TASK_PREFERENCE_ALL);
				preferenceDisplayOptionList.add(AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkOwnerFilterCommand.Ranges.ShowAll"));
			}
			taskPreferenceMap.put(AWLConstants.RANGE_FIELD_CHOICES, preferenceList);
			taskPreferenceMap.put(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES, preferenceDisplayOptionList);
			return taskPreferenceMap;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	
	protected String getLanguageType(Context context, Map requestMap) throws FrameworkException
	{
		String languageType = BusinessUtil.getString(requestMap, "AWLLocalCopyLanguageFilter");
		if(BusinessUtil.isNullOrEmpty(languageType)) {
			languageType   = BusinessUtil.getString(requestMap, "languageType");	
			String filters        = BusinessUtil.getString(requestMap, "filters");
			String jsLanguage     = BusinessUtil.getString(BusinessUtil.toJSONObject(filters), "languageType");
	
			languageType = BusinessUtil.isNotNullOrEmpty(jsLanguage) ? jsLanguage : AWLPreferences.getLocalCopyDisplayLanguagePreference(context);
		}
		return languageType;
	}

	protected StringList getCompareLanguages(Map requestMap)
	{
		String compareLanguage   = BusinessUtil.getString(requestMap, "compareLanguage");	
		String filters           = BusinessUtil.getString(requestMap, "filters");
		String jsLanguage        = BusinessUtil.getString(BusinessUtil.toJSONObject(filters), "compareLanguage");

		compareLanguage = BusinessUtil.isNotNullOrEmpty(jsLanguage) ? jsLanguage : compareLanguage;
		return BusinessUtil.toUniqueSortedList(FrameworkUtil.split(compareLanguage, ","));
	}

	public StringList getAuthoringAssignee(Context context, String[] args) throws FrameworkException
	{
		return getAssigneeColumn(context, args, true);
	}

	public StringList getApprovalAssignee(Context context, String[] args) throws FrameworkException
	{
	    return getAssigneeColumn(context, args, false);

	}

	//Fix IR-215886
	//This method is invoked to display Author or Approver column values for Artwork Element/POA 
	protected StringList getAssigneeColumn(Context context, String[] args, boolean authoring) throws FrameworkException {
		try {
			
			Map programMap       = (Map)JPO.unpackArgs(args);
			
			MapList objectList   = BusinessUtil.getObjectList(programMap);
			Map requestMap =BusinessUtil.getRequestParamMap(programMap);

			boolean isLocalAssignment = AWLConstants.LOCAL_COPY.equalsIgnoreCase(BusinessUtil.getString(requestMap, AWLConstants.ARTWORK_ASSIGN_TYPE));
			StringList elementIDs = BusinessUtil.getIdList(objectList);
			
			AWLRel assgineeRel = authoring ? AWLRel.ARTWORK_CONTENT_AUTHOR : AWLRel.ARTWORK_CONTENT_APPROVER;
			
			StringList assigneeIDs = BusinessUtil.getInfo(context, elementIDs, 
					AWLUtil.strcat("from[",assgineeRel.get(context),"].to.id")); 
			
			StringList assigneesReturnList = new StringList(objectList.size());
			if(!isLocalAssignment) {
				for (int i = 0; i < assigneeIDs.size(); i++) {
					assigneesReturnList.add(AWLUtil.getAssigneeDisplayName(context, (String) assigneeIDs.get(i)));
				}
			} else {
				StringList artworkMasterIds = BusinessUtil.toStringList(objectList, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
				String[] masterIDArr = new String[artworkMasterIds.size()];
				artworkMasterIds.toArray(masterIDArr);
				
				boolean[] kindOfMCE = BusinessUtil.isKindOf(context, masterIDArr, AWLType.MASTER_COPY_ELEMENT.get(context));
				StringList translate = BusinessUtil.getInfo(context, artworkMasterIds, AWLAttribute.TRANSLATE.getSel(context));
				
				for (int i = 0; i < elementIDs.size(); i++) {
					boolean showBlank =  !kindOfMCE[i] ||  AWLConstants.RANGE_NO.equalsIgnoreCase((String) translate.get(i));
					String display = showBlank ? "" : AWLUtil.getAssigneeDisplayName(context, (String) assigneeIDs.get(i));
					assigneesReturnList.add(display);
				}				
			}
			return assigneesReturnList;
					
		} catch (Exception e) { throw new FrameworkException(e); }
	}	


	public String assignAuthorAsApproverCheckBox(Context context, String[] args) throws FrameworkException 
	{
		StringBuffer sb = new StringBuffer(300);
		sb.append("<input type=\"checkbox\" value=\"\" name=\"AssignAuthorAsApprover\" id=\"AssignAuthorAsApprover\" onchange=\"onChangeAssignAuthorAsApprover(this)\"></input>");
		sb.append("<input type=\"hidden\" value=\"false\" id=\"AssignAuthorAsApproverHiddenValue\"  name=\"AssignAuthorAsApproverHiddenValue\"></input>");
		return sb.toString();
	}

	public MapList getDynamicLanguageAssigneeColumns(Context context, String[] args) throws FrameworkException
	{
		try {
			MapList columns         = new MapList();
			Map programMap          = (Map)JPO.unpackArgs(args);
			Map requestMap	        = BusinessUtil.getRequestMap(programMap);

			String language         = getLanguageType(context, requestMap);
			StringList languageList = getCompareLanguages(requestMap);
			languageList.remove(language);
			languageList.add(0, language);

			for(int i = 0; i < languageList.size(); i++)
			{
				String xlang   = languageList.get(i).toString();
				columns.addAll(createLanguageAssigneeColumns(context, xlang, language.equals(xlang)));
			}
			return columns;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	private MapList createLanguageAssigneeColumns(Context context, String language, boolean defaultLang) throws FrameworkException
	{
		String groupHeader      = AWLPropertyUtil.getI18NString(context, "emxAWL.Header.LocalCopy");
		groupHeader = AWLUtil.strcat(groupHeader, " - ", language);

		MapList columns    = new MapList();
		Map newColumn = getCurrentCopyTextColumn(language, groupHeader, false);
		columns.add(newColumn);

		Map authColumn = getAuthorAssigneeColumn(language, groupHeader);
		columns.add(authColumn);

		Map approvColumn = getApprovalAssigneeColumn(language, groupHeader);
		columns.add(approvColumn);

		Map stateColumn   = getStateColumn(language, groupHeader) ;
		columns.add(stateColumn);

		Map routeColumn = getRouteInfoColumn(language, groupHeader);
		columns.add(routeColumn);

		Map reAuthorColumn = getReAuthorColumn(language, groupHeader);
		columns.add(reAuthorColumn);
		
		for (int i = 0; i < columns.size(); i++) {
			Map col = (Map) columns.get(i);
			col.put(AWLConstants.COLUMN_LANGUAGE, language);
		}		
		return columns;
	}

	private Map getApprovalAssigneeColumn(String language, String groupHeader) {
		Map approvColumn   = createColum(AWLUtil.strcat("Approval Template", language), "emxAWL.Label.Approver", "", AWL, groupHeader, true);
		Map settings = UIComponent.getSettings(approvColumn);
		settings.put(COLUMN_TYPE, program);
		settings.put(Sortable, RANGE_TRUE);
		settings.put(program, AWL_ARTWORK_PACKAGE_UI_JPO);
		settings.put(function, "getApprovalAssignee");
		return approvColumn;
	}

	private Map getAuthorAssigneeColumn(String language, String groupHeader) {
		Map authColumn   = createColum(AWLUtil.strcat("Authoring Template", language), "emxAWL.Label.Author", "", AWL, groupHeader, true);
		Map settings	     = UIComponent.getSettings(authColumn);
		settings.put(COLUMN_TYPE, program);
		settings.put(Sortable, RANGE_TRUE);
		settings.put(program, AWL_ARTWORK_PACKAGE_UI_JPO);
		settings.put(function, "getAuthoringAssignee");
		return authColumn;
	}

	//Modified by N94 during POA Simplification Highlight in R418
	private MapList getArtworkLocalContent(Context context, String artworkId, String languageType, StringList compareLanguages) throws FrameworkException
	{
		try {
			ArtworkPackage artworkPackage = new ArtworkPackage(artworkId);
			String attrBasCopySel = AWLAttribute.IS_BASE_COPY.getSel(context);
			String attrCopyTextLangSel = AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context);
			String TYPE_ARTWORK_MASTER = AWLType.MASTER_ARTWORK_ELEMENT.get(context);

			StringList selects = BusinessUtil.toStringList(SELECT_ID, ArtworkContent.getArtworkMasterIdSel(context), attrCopyTextLangSel, attrBasCopySel,SELECT_CURRENT);
			selects.add(AWLAttribute.IS_BASE_COPY.getSel(context));
			selects.add(SELECT_CURRENT_ACCESS);
			selects.add(SELECT_LATEST);
						
			MapList localContent = artworkPackage.getArtworkPackageAllContent(context, selects);
			localContent = BusinessUtil.fixKey(localContent, ArtworkContent.getArtworkMasterIdSel(context), TYPE_ARTWORK_MASTER);

			String landIdKey = AWLUtil.strcat(SELECT_ID, languageType);
			Map masterMap = BusinessUtil.groupByKey(localContent, TYPE_ARTWORK_MASTER);
			Map baseIds = new HashMap(localContent.size());
			for (Iterator iterator = localContent.iterator(); iterator.hasNext();) {
				Map object = (Map) iterator.next();
				if(AWLConstants.RANGE_YES.equalsIgnoreCase((String) object.get(attrBasCopySel))) {
					baseIds.put(object.get(TYPE_ARTWORK_MASTER), object.get(SELECT_ID));
				}
			}
			MapList filteredList = new MapList(localContent.size());
			for (Iterator masterKeyIter = masterMap.keySet().iterator(); masterKeyIter.hasNext();) {
				String masterId = (String) masterKeyIter.next();
				ArtworkMaster master = new ArtworkMaster(masterId);
				boolean isInline = master.isInlineTranslationElement(context);
				boolean canTranslate = master.isTranslationElement(context);
				String baseId = (String) baseIds.get(masterId);

				MapList masterContent = (MapList) masterMap.get(masterId);

				Map langIdMap = new HashMap();
				for (Iterator iterator = masterContent.iterator(); iterator.hasNext();) {
					Map localMap = (Map) iterator.next();
					String copyTextLang = (String) localMap.get(attrCopyTextLangSel);
					String id = (String) localMap.get(SELECT_ID);
					langIdMap.put(copyTextLang, id);
				}

				for (Iterator iterator = masterContent.iterator(); iterator.hasNext();) {
					Map localMap = (Map) iterator.next();
					String localId = (String) localMap.get(SELECT_ID);
					ArtworkContent ae = ArtworkContent.getNewInstance(context, localId);
					String copyTextLang = (String) localMap.get(attrCopyTextLangSel);
					StringList langList = FrameworkUtil.split(copyTextLang, AWLConstants.LANGUAGE_SEPARATOR);
					
					boolean isBaseCopy = AWLConstants.RANGE_YES.equalsIgnoreCase((String) localMap.get(attrBasCopySel));
					
					boolean include = langList.contains(languageType) ? !(isBaseCopy && isInline) :
						                                                 (!canTranslate ||  ae.isGraphicElement());
					if(!include)
						continue;
					if(langList.contains(languageType))
						localMap.put(landIdKey, localId);
					localMap.put(AWLConstants.BASE_COPY_ID, baseId);
					localMap.put(AWLConstants.LANGUAGE_MAP, langIdMap);
					localMap.put(AWLConstants.IS_BASE_COPY, isBaseCopy);

					for (int i = 0; i < compareLanguages.size(); i++) {
						String compareId = (String) langIdMap.get(compareLanguages.get(i));
						if(BusinessUtil.isNotNullOrEmpty(compareId)) {
							localMap.put(AWLUtil.strcat(SELECT_ID, compareLanguages.get(i)), compareId);
						}
					}
					filteredList.add(localMap);
				}
			}

			return filteredList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	protected Map getAssigneeDetails(Context context, String[] args) throws FrameworkException {
		try {
			Map programMap          	= (Map)JPO.unpackArgs(args);
			Map requestMap	        	= BusinessUtil.getRequestMap(programMap);

			String strRowIDs 			= (String)requestMap.get(AWLConstants.SEL_ROW_IDs);
			String objectID				= (String)requestMap.get(AWLConstants.OBJECT_ID);
			String DesignerPersonOID			= (String)requestMap.get("DesignerPersonOID");
			String AuthorPersonOID			= (String)requestMap.get("AuthorPersonOID");
			String ApproverPersonOID		= (String)requestMap.get("ApproverPersonOID");
			String AuthorRouteTemplateOID 	= (String)requestMap.get("AuthorRouteTemplateOID");
			String ApproverRouteTemplateOID = (String)requestMap.get("ApproverRouteTemplateOID");
			String strAssignAuthorAsApproverHiddenValue	= (String)requestMap.get("AssignAuthorAsApproverHiddenValue");
			boolean isAuthorAsApprover = RANGE_TRUE.equalsIgnoreCase(strAssignAuthorAsApproverHiddenValue);

			StringList idList = FrameworkUtil.split(strRowIDs, ",");

			String author	= BusinessUtil.isNotNullOrEmpty(AuthorPersonOID) ? AuthorPersonOID :
							  BusinessUtil.isNotNullOrEmpty(AuthorRouteTemplateOID) ? AuthorRouteTemplateOID :
					          BusinessUtil.isNotNullOrEmpty(DesignerPersonOID) ? DesignerPersonOID : "";


			String approver = BusinessUtil.isNotNullOrEmpty(ApproverPersonOID) ? ApproverPersonOID :
							  BusinessUtil.isNotNullOrEmpty(ApproverRouteTemplateOID) ? ApproverRouteTemplateOID :
							  isAuthorAsApprover ? author : "";

			Map map = new HashMap(4);
			map.put(AWLConstants.SEL_ROW_IDs, idList);
			map.put(AWLConstants.OBJECT_ID, objectID);
			map.put(AWLRel.ARTWORK_CONTENT_AUTHOR.get(context), author);
			map.put(AWLRel.ARTWORK_CONTENT_APPROVER.get(context), approver);
			return map;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void doPOAAssignment(Context context, String[] args) throws FrameworkException {
		try {
			Map assigneeInfo = getAssigneeDetails(context, args);
			StringList idList=BusinessUtil.getStringList(assigneeInfo, AWLConstants.SEL_ROW_IDs);
			String author=BusinessUtil.getString(assigneeInfo,AWLRel.ARTWORK_CONTENT_AUTHOR.get(context));
			String approver=BusinessUtil.getString(assigneeInfo,AWLRel.ARTWORK_CONTENT_APPROVER.get(context));
			for (int i = 0; i < idList.size(); i++) {
				POA poa = new POA((String) idList.get(i));
				poa.updateAssignee(context, author, approver);
			}
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
		
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void doArtworkContentAssignment(Context context, String[] args) throws FrameworkException {
		try {
			Map assigneeInfo = getAssigneeDetails(context, args);
			StringList idList = BusinessUtil.getStringList(assigneeInfo,AWLConstants.SEL_ROW_IDs);
			String author = BusinessUtil.getString(assigneeInfo,AWLRel.ARTWORK_CONTENT_AUTHOR.get(context));
			String approver = BusinessUtil.getString(assigneeInfo,AWLRel.ARTWORK_CONTENT_APPROVER.get(context));
			for (int i = 0; i < idList.size(); i++) {
				ArtworkContent element = ArtworkContent.getNewInstance(context, (String) idList.get(i));
				element.updateAssignee(context, author, approver);
			}
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	public StringList getMatchingLocalLanguages(Map languageMap, String language) throws FrameworkException {
		StringList matchingLang = new StringList(languageMap.size());
		for (Iterator iterator = languageMap.keySet().iterator(); iterator.hasNext();) {
			String languages = (String) iterator.next();
			StringList langList = FrameworkUtil.split(languages, AWLConstants.LANGUAGE_SEPARATOR);
			if(langList.contains(language)) {
				matchingLang.add((String)languageMap.get(languages));
			}
		}
		return matchingLang;
	}
	
	public StringList getColumnIds(Map objectMap, String colLang, String langFilter) throws FrameworkException {
		//colLang will be null for Master Copy Pages and Local Copy Master content column
		if(BusinessUtil.isNotNullOrEmpty(colLang)) 
		{
			if(!colLang.equals(langFilter)) { //For compare lang 
				Map localLangMap = (Map) objectMap.get(AWLConstants.LANGUAGE_MAP);
				StringList matchingIds =  getMatchingLocalLanguages(localLangMap, colLang);
				return matchingIds;
			}
			else {
				String id = BusinessUtil.getString(objectMap, AWLUtil.strcat(SELECT_ID, langFilter));
				return BusinessUtil.isNullOrEmpty(id) ? new StringList() : BusinessUtil.toStringList(id);
			}
		} else {
			//We are setting Base Copy Id in getArtworkLocalContent()
			String baseCopy = BusinessUtil.getString(objectMap, AWLConstants.IS_BASE_COPY);
			String key = BusinessUtil.isNullOrEmpty(baseCopy) ? SELECT_ID : AWLConstants.BASE_COPY_ID;
			return BusinessUtil.toStringList(BusinessUtil.getString(objectMap, key));
		}
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getInlineLocalElementsList(Context context, String [] args)  throws FrameworkException
	{
		try
		{
	        Map requestMap 			= (Map)JPO.unpackArgs(args);
	        String elementId 		= BusinessUtil.getObjectId(requestMap);
	        String languageType 	= getLanguageType(context, requestMap);
	        CopyElement ce			= new CopyElement(elementId); 
	        List<ArtworkContent> localElements = ce.getElementsByLanguage(context, languageType);
	        StringList idsList	= new StringList();
	        for (ArtworkContent localElement : localElements) {
	        	idsList.add(localElement.getId(context));
	        }
	        return BusinessUtil.toMapList(SELECT_ID, idsList);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 * To get the POAs list associated to a specific Artwork Package  
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * @since CAP 2015x.HF1
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAllImplementedPOAs (Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap 	= (HashMap)JPO.unpackArgs(args);
			String contextId 	= BusinessUtil.getObjectId(programMap);
			String currentLevel = (String) programMap.get(SELECT_LEVEL);
			String isFrom = (String)programMap.get("isFrom");
			
			MapList returnList = new MapList();
			
			if(BusinessUtil.isKindOf(context, contextId, AWLType.ARTWORK_PACKAGE.get(context)))
			{
				ArtworkPackage ap = new ArtworkPackage(contextId);
				if(BusinessUtil.isNotNullOrEmpty(isFrom) && isFrom.equalsIgnoreCase("ArtworkPackage")){
					returnList =  ap.getPOAs(context,new StringList());
				}else{
				returnList =  ap.getLatestEvolutionPOAs(context);
				}
			} 
			else if(BusinessUtil.isKindOf(context, contextId, AWLType.POA.get(context)) && 
					BusinessUtil.isNotNullOrEmpty(currentLevel) && currentLevel.replaceAll("[^,]","").length()==1) {
				POA poa = new POA(contextId);
				returnList = poa.getPOAEvolutions(context);
			}
			
			return returnList;
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	* Gets all Obsolete POA's from Artwork Package.		
	* @param   context 
	* @throws  FrameworkException 
	* @since   AWL 2013x
	* @author  AA1
	*/
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAllObsoletePOAs (Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap 	= (HashMap)JPO.unpackArgs(args);
			String artworkId 	= BusinessUtil.getObjectId(programMap);
			ArtworkPackage ap 	= new ArtworkPackage(artworkId);
			return ap.getObsoletePOAs(context, null);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	//User For Affected Item page.
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkContentItems(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map requestMap 		= (Map)JPO.unpackArgs(args);
	        String artworkId 	= BusinessUtil.getObjectId(requestMap);
	        ArtworkPackage ap 	= new ArtworkPackage(artworkId);
	        MapList itemsList 	= ap.getArtworkPackageConnectedItems(context, new StringList());
			return itemsList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	protected Map getStateStatus(Context context, Map requestMap) throws FrameworkException
	{
		try
		{
	        Map status  = new HashMap();
	        String objectId 		 = BusinessUtil.getObjectId(requestMap);
	        String languageStr  	 = (String) requestMap.get(AWLConstants.LANGUAGE_STRING);

	        String rejectedOnLabel   = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.RejectedOn", languageStr);
	        String rejectedByLabel   = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Rejectedby", languageStr);
	        String commentLabel      = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Comment", languageStr);
	        String completedOnLabel  = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.CompletedOn", languageStr);
	        String approverLabel     = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Approver", languageStr);
	        String obsoletedOnLabel  = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.ObsoletedOn", languageStr);

	        String sentApprovalLabel     = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.ApprovalOn", languageStr);
	        String pendingApprovalLabel  = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.PendingApproval", languageStr);
	        
	        String rejecttemplate = AWLUtil.strcat("<div> <ul> <li> <p><span style='font-weight:bold'>{0}</span></p> </li>",
										"<li> <p>", rejectedOnLabel, " {1}</p> </li>", 
										"<li> <p>", rejectedByLabel, " {2}</p> </li>",
										"<li> <p>", commentLabel, " {3}</p> </li> </ul> </div>");

	        String reviewtemplate = AWLUtil.strcat("<div> <ul> <li> <p><span style='font-weight:bold'>{0}</span></p> </li>" ,
										"<li> <p>" , sentApprovalLabel, " {1}</p> </li>" ,
										"<li> <p>" , pendingApprovalLabel , " {2}</p> </li> </ul> </div>");

			String approvertemplate = AWLUtil.strcat("<div> <ul> <li> <p><span style='font-weight:bold'>{0}</span></p> </li>" ,
										"<li> <p>" , completedOnLabel , " {1}</p> </li>" ,
										"<li> <p>" , approverLabel , " {2}</p> </li> </ul> </div>");

	        String obsoletetemplate = AWLUtil.strcat("<div> <ul> <li> <p><span style='font-weight:bold'>{0}</span></p> </li>", 
										"<li> <p>", obsoletedOnLabel, " {1}</p> </li> </ul> </div>");

	        String state		= BusinessUtil.getInfo(context, objectId, SELECT_CURRENT);
	        String policy		= BusinessUtil.getInfo(context, objectId, SELECT_POLICY);
	        String message		= "";

	        String transState   = AWLPropertyUtil.getStateI18NString(context, policy, state, languageStr);
	        
	        String artworkContentPolicy = AWLPolicy.ARTWORK_ELEMENT_CONTENT.get(context);
			String PRELIMINARY = AWLState.PRELIMINARY.get(context, artworkContentPolicy);
			String REVIEW = AWLState.REVIEW.get(context, artworkContentPolicy);
			String APPROVED = AWLState.APPROVED.get(context, artworkContentPolicy);
			String RELEASE = AWLState.RELEASE.get(context, artworkContentPolicy);
			String OBSOLETE = AWLState.OBSOLETE.get(context, artworkContentPolicy);

			//Fix IR-249831V6R2013x
	        if(PRELIMINARY.equals(state)) {
		        MapList rejectedList  = RouteUtil.getRejectedTasksByCopy(context, objectId);
		        if(rejectedList.size() > 0)
		        {
		        	Map rejectedTask   = (Map)rejectedList.get(0);
		        	String rejectedOn  = RouteUtil.getTaskCompletionDate(rejectedTask);
		        	String owner       = RouteUtil.getTaskOwner(rejectedTask);
		        	String comment     = RouteUtil.getTaskComments(rejectedTask);
		        	message		       = MessageFormat.format(rejecttemplate, transState, rejectedOn, owner, comment);
		        }
	        } else if(REVIEW.equals(state)){
		        	Map reviewTask     = RouteUtil.getApprovalTaskByCopy(context, objectId);
		        	if(reviewTask != null)
		        	{
		        		String taskId  = BusinessUtil.getId(reviewTask);
		        		String sentOn  = BusinessUtil.getInfo(context, taskId, SELECT_ORIGINATED);
			        	String pending = RouteUtil.getTaskOwner(reviewTask);
			        	message		   = MessageFormat.format(reviewtemplate, transState, sentOn, pending);
		        	}
	        }else if(APPROVED.equals(state) || RELEASE.equals(state))
	        {
	        	MapList tasks     = RouteUtil.getApprovedTasksByCopy(context, objectId);
	        	if(tasks.size() > 0)
			    {
		        	Map task          = (Map)tasks.get(0);
		        	String rejectedOn = RouteUtil.getTaskCompletionDate(task);
		        	String owner      = RouteUtil.getTaskOwner(task);
		        	message		      = MessageFormat.format(approvertemplate, transState, rejectedOn, owner);
			    }
	        }else if(OBSOLETE.equals(state))
	        {
	        	String obsoletedOn = BusinessUtil.getInfo(context, objectId, AWLUtil.strcat("state[", state, "].actual"));
	        	message		       = MessageFormat.format(obsoletetemplate, transState, obsoletedOn);
	        }
	        message = BusinessUtil.isNullOrEmpty(message) ? transState : message;
	        status.put("state", state);
	        status.put("message", message);
	        return status;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getCurrentColumnStyle(Context context, String[] args) throws FrameworkException
    {
		try
		{
			Map programMap      	= (Map)JPO.unpackArgs(args);
			MapList objectList  	= BusinessUtil.getObjectList(programMap);
			Map requestMap      	= BusinessUtil.getRequestParamMap(programMap);
			Map columnMap       	= BusinessUtil.getColumnMap(programMap);
			String colLang     		= BusinessUtil.getString(columnMap, AWLConstants.COLUMN_LANGUAGE);
			String colName 			= BusinessUtil.getString(columnMap, SELECT_NAME);
			boolean isImageColumn 	= "CurrentImage".equals(colName);
			String langFilter		= getLanguageType(context, requestMap);
			boolean isAuthoring		= isAuthoringAction(getActionType(requestMap));

			StringList fieldListStyles 	   = new StringList(objectList.size());
			for(Iterator oItr = objectList.iterator(); oItr.hasNext();)
			{
				String css    = "";
			    Map objectMap = (Map)oItr.next();
			    StringList ids = getColumnIds(objectMap, colLang, langFilter);
				//show in specific style only when user has edit access to the cell
		        if(isAuthoring && isEditable(objectMap)&& ids.size()==1)
		        {
		        	String id        		 = (String) ids.get(0);
		        	ArtworkContent ac		 = ArtworkContent.getNewInstance(context, id);
		        	boolean isGraphicElement = ac.isGraphicElement();
		        	boolean isSE = "true".equalsIgnoreCase((String) objectMap.get("isStructuredElement"));
		        	if(isImageColumn == isGraphicElement) {
		        		ArtworkContent lastAc	 = ac.getLastReleasedRevision(context);
		        		css = isSE ? "" :
		        			  lastAc!=null && ac.isRelease(context) ?
		        			  "AWLAuthoringCurrentColumnRelease" : "AWLAuthoringCurrentColumnPreliminary";
		        	}
		        }
		        fieldListStyles.add(css);
		    }
			return fieldListStyles;
		} catch (Exception e) { throw new FrameworkException(e); }
    }
	
	public MapList getSupplierJobSelectedPOAList(Context context, String[] args) throws FrameworkException {
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			String poaIds = (String) programMap.get("poaIds");
			StringList poaIdList = FrameworkUtil.split(poaIds, ",");
			MapList returnlist = new MapList(poaIdList.size());
			HashMap poaMap = new HashMap(1);
			for (String poaId : (List<String>)poaIdList) {
				HashMap cloneMap = (HashMap) poaMap.clone();
				cloneMap.put(SELECT_ID, poaId);
				returnlist.add(cloneMap);
			}
			return returnlist;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
			
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkElementTasks(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap 			= (Map)JPO.unpackArgs(args);
			String artworkId 		= BusinessUtil.getObjectId(programMap);
			ArtworkPackage artworkPackage = new ArtworkPackage(artworkId);
			String filter = (String) programMap.get("AWLArtworkElementsTaskManagementFilterCommand");
			StringList objSelects   = BusinessUtil.toStringList(SELECT_ID, SELECT_TYPE, SELECT_NAME);
			MapList artworkElementContentItems = artworkPackage.getArtworkPackageContent(context, objSelects);
			
			return getRouteNodeOrRouteTaskItems(context, artworkElementContentItems, filter);
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkElementContentTasks(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap 			= (Map)JPO.unpackArgs(args);
			String artworkId 		= BusinessUtil.getObjectId(programMap);
			
			ArtworkMaster am = BusinessUtil.isKindOf(context, artworkId, AWLType.ARTWORK_ELEMENT.get(context)) ? ArtworkContent.getNewInstance(context, artworkId).getArtworkMaster(context)
																											   : new ArtworkMaster(artworkId);
			List<ArtworkContent> artworkElements = am.getArtworkElementContent(context,null);
			if(artworkElements.isEmpty())
				return new MapList();
			MapList artworkElementList = new MapList();
			for (Iterator iterator = artworkElements.iterator(); iterator.hasNext();) {
				ArtworkContent element = (ArtworkContent)iterator.next();
				
					Map aeMap = new HashMap();
					aeMap.put(SELECT_ID, element.getId(context));
					artworkElementList.add(aeMap);
				
				
			}
			String filter = (String) programMap.get("AWLArtworkElementsTaskManagementFilterCommand");
			return getRouteNodeOrRouteTaskItems(context, artworkElementList, filter);
		} catch (Exception e) { throw new FrameworkException(e); }
		
	}	

	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAsTasks(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap 			= (Map)JPO.unpackArgs(args);
			String artworkId 		= BusinessUtil.getObjectId(programMap);
			ArtworkPackage artworkPackage = new ArtworkPackage(artworkId);
			String strAWLPOAsTaskAssignmentFilterValue = (String) programMap.get("AWLPOAsTaskManagementFilterCommand");
			StringList objSelects   = BusinessUtil.toStringList(SELECT_ID, SELECT_TYPE, SELECT_NAME);
			
			MapList POAItems = artworkPackage.getPOAs(context, objSelects);
			return getRouteNodeOrRouteTaskItems(context, POAItems, strAWLPOAsTaskAssignmentFilterValue);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
		
	protected MapList getRouteNodeOrRouteTaskItems(Context context, MapList artworkPackageImplItems, String filter) throws FrameworkException {
		MapList mlTaskorPersonInfo = new MapList();
		try{

			String attrApprovalStatus = AWLAttribute.APPROVAL_STATUS.getSel(context);
			String attrRouteStatus = AWLAttribute.ROUTE_STATUS.getSel(context);
			String attrRouteNodeId = AWLAttribute.ROUTE_NODE_ID.getSel(context);
			String strProjectTaskId = AWLUtil.strcat(FROM_OPEN, AWLRel.PROJECT_TASK.get(context), REL_SEL_CLOSE_TO_ID);
			String attrScheduledCompletionDate = AWLAttribute.SCHEDULED_COMPLETION_DATE.getSel(context);
			String attrRTU = AWLAttribute.ROUTE_TASK_USER.getSel(context);

			StringList slRouteNodeSelects = new StringList();
			slRouteNodeSelects.add(SELECT_NAME);
			slRouteNodeSelects.add(SELECT_TYPE);
			slRouteNodeSelects.add(SELECT_ID);

			StringList slRouteNodeRelSelects = new StringList();
			slRouteNodeRelSelects.add(DomainRelationship.SELECT_ID);
			slRouteNodeRelSelects.add(DomainRelationship.SELECT_NAME);
			slRouteNodeRelSelects.add(attrScheduledCompletionDate);
			slRouteNodeRelSelects.add(attrRTU);

			StringList slRouteTaskObjSelects = new StringList();
			slRouteTaskObjSelects.add(SELECT_NAME);
			slRouteTaskObjSelects.add(SELECT_ID);
			slRouteTaskObjSelects.add(SELECT_TYPE);
			slRouteTaskObjSelects.add(SELECT_CURRENT);
			slRouteTaskObjSelects.add(attrRouteNodeId);
			slRouteTaskObjSelects.add(strProjectTaskId);
			slRouteTaskObjSelects.add(attrScheduledCompletionDate);
			slRouteTaskObjSelects.add(attrApprovalStatus);
			slRouteTaskObjSelects.add(attrRTU);

			StringList slRouteTaskRelSelects = new StringList();
			slRouteTaskRelSelects.add(DomainRelationship.SELECT_ID);
			slRouteTaskRelSelects.add(DomainRelationship.SELECT_NAME);
			slRouteTaskRelSelects.add(DomainRelationship.SELECT_TYPE);
			
			boolean bShowPendingActiveTasks = "Pending and Active".equals(filter);

			for(Iterator itr = artworkPackageImplItems.iterator(); itr.hasNext();)
			{
				Map mpCopyContent = (Map)itr.next();
				String artworkElementContentOrPOAId = (String)mpCopyContent.get(SELECT_ID);
				MapList routeInfoList = new MapList();
				String artMasterId = "";
				if(BusinessUtil.isKindOf(context, artworkElementContentOrPOAId, AWLType.ARTWORK_ELEMENT.get(context)))
				{
					ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, artworkElementContentOrPOAId);
					routeInfoList = artworkContent.getAllRoutes(context);
					artMasterId =  artworkContent.getArtworkMaster(context).getObjectId(context);
				}
				else{
					POA poa = new POA(artworkElementContentOrPOAId);
					routeInfoList = poa.getAllRoutes(context);
				}

				MapList routeNodeOrTaskList = new MapList();

				for (Iterator iterator = routeInfoList.iterator(); iterator.hasNext();) {
					Map routeInfo = (Map) iterator.next();
					String routeId = (String) routeInfo.get(SELECT_ID);
					String routeState = (String) routeInfo.get(SELECT_CURRENT);
					String artworkAction = RouteUtil.getArtworkAction(context, routeId);
					String routeStatus = (String) routeInfo.get(attrRouteStatus);

					Route rotue = new Route(routeId);

					MapList routeNodeInfo = RouteUtil.getRouteNodeInfo(context, routeId, slRouteNodeSelects, slRouteNodeRelSelects);

					Map routeNodeOrTaskByRouteNodeId = BusinessUtil.toObjectMap(routeNodeInfo, DomainRelationship.SELECT_ID);

					//Update Route Node info Map for a Route Node it task is already created for the Route Node.
					if(!"Define".equalsIgnoreCase(routeState)) {
						MapList routeTasks = rotue.getRouteTasks(context, slRouteTaskObjSelects, slRouteTaskRelSelects, null, false);
						for (Iterator routeTaskItr = routeTasks.iterator(); routeTaskItr.hasNext();) {
							Map mpRouteTask = (Map) routeTaskItr.next();
							String routeNodeId = (String) mpRouteTask.get(attrRouteNodeId);
							//Remove the Route Node info and add Route Task
							routeNodeOrTaskByRouteNodeId.remove(routeNodeId);
							routeNodeOrTaskByRouteNodeId.put(routeNodeId, mpRouteTask);
						}
					}

					for (Iterator iterator2 = routeNodeOrTaskByRouteNodeId.values().iterator(); iterator2.hasNext();) {
						Map routeNodeTaskInfo = (Map) iterator2.next();
						routeNodeTaskInfo.put(AWLConstants.ROUTE_ARTWORK_INFO_ACTION, artworkAction);
						routeNodeTaskInfo.put(AWLConstants.ARTWORK_MASTER_ID, artMasterId);
						routeNodeTaskInfo.put(ROUTE_STATUS, routeStatus);
					}

					//Add All Route Node or Route Task Info to the final MapList
					routeNodeOrTaskList.addAll(routeNodeOrTaskByRouteNodeId.values());
				}

				if(routeNodeOrTaskList.isEmpty())
					continue;

				for(Iterator itrRouteNodeOrTask = routeNodeOrTaskList.iterator();itrRouteNodeOrTask.hasNext();)
				{
					Map mapRouteNodeOrRouteTaskValue = (Map)itrRouteNodeOrTask.next();

					Map returnMap = new HashMap();

					String id = (String)mapRouteNodeOrRouteTaskValue.get(SELECT_ID);
					String type = (String)mapRouteNodeOrRouteTaskValue.get(SELECT_TYPE);
					String current = (String)mapRouteNodeOrRouteTaskValue.get(SELECT_CURRENT);
					String relid = (String)mapRouteNodeOrRouteTaskValue.get(DomainRelationship.SELECT_ID);
					String relName = (String)mapRouteNodeOrRouteTaskValue.get(DomainRelationship.SELECT_NAME);
					String approvalStatus = (String)mapRouteNodeOrRouteTaskValue.get(attrApprovalStatus);
					String strScheduledCompletionDateValue = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, attrScheduledCompletionDate);
					String routeTaskUser = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, attrRTU);
					String routeAction = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, AWLConstants.ROUTE_ARTWORK_INFO_ACTION);
					String artworkMasterId = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, AWLConstants.ARTWORK_MASTER_ID);
					String apId = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, AWLConstants.ARTWORK_PACKAGE_ID);
					String routeStatus = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, ROUTE_STATUS);
					String routeNodeId = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, attrRouteNodeId);
					String strProjectTaskUser = BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, strProjectTaskId);
					boolean routeStopped = STOPPED_ROUTE_STATUS.contains(routeStatus);

					boolean isRouteNode = AWLRel.ROUTE_NODE.get(context).equalsIgnoreCase(relName);
					
					boolean isTaskInActive = "Complete".equals(current) || routeStopped;
					
					if(bShowPendingActiveTasks && isTaskInActive)
						continue;					

					/**
					 * Getting assignee id
					 * if isRouteNode = true
					 * 		connected object will be Person/Route Task User
					 * else 
					 * 		connected object will be task id, so 
					 * 			get Person/Route Task User connected to the task
					 * 			if person/route task user id is empty 
					 *              (if we restart the route old task rev-1 will not have person/RTU connected to it)
					 * 				get the to id from Route Node relationship id
					 * 
					 * if assignee is person 
					 * 		get person name
					 * else
					 * 		get Route Task user from Route node info
					 */
					boolean isRTUEmpty = BusinessUtil.isNullOrEmpty(strProjectTaskUser);
					String selRouteNodeToID = "print connection $1 select to.id[connection] dump";
					String assigneeId = isRouteNode ? BusinessUtil.getString(mapRouteNodeOrRouteTaskValue, DomainConstants.SELECT_ID) :
										isRTUEmpty  ? MqlUtil.mqlCommand(context, selRouteNodeToID, true, routeNodeId):
													  strProjectTaskUser;
					boolean isAssignedToPerson = BusinessUtil.isKindOf(context, assigneeId, TYPE_PERSON);
					String strAssigneeName = "";
					if(isAssignedToPerson) {
						strAssigneeName = BusinessUtil.getInfo(context, assigneeId, DomainObject.SELECT_NAME);
					} else {
						strAssigneeName = routeTaskUser;
						boolean isRole = strAssigneeName.startsWith("role_");
						boolean isGroup = strAssigneeName.startsWith("group_");
						//From symbolic name get actual name
						strAssigneeName = PropertyUtil.getSchemaProperty(context, strAssigneeName);
						String adminType = isRole ? "Role" : "Group";
						strAssigneeName = !(isRole || isGroup) ? strAssigneeName : 
							EnoviaResourceBundle.getAdminI18NString(context, adminType, strAssigneeName, context.getSession().getLanguage());
					}

					if(isTaskInActive)
						returnMap.put("disableSelection", RANGE_TRUE);

					returnMap.put(SELECT_ID, id);
					returnMap.put(DomainRelationship.SELECT_ID, relid);
					returnMap.put(DomainRelationship.SELECT_NAME, relName);
					returnMap.put(SELECT_TYPE, type);
					returnMap.put(SELECT_CURRENT, current);
					returnMap.put(AWLConstants.TASK_CONTENT_ID , artworkElementContentOrPOAId);

					returnMap.put(AWLConstants.ROUTE_ARTWORK_INFO_ACTION, routeAction);
					returnMap.put(AWLConstants.TASK_DUE_DATE, strScheduledCompletionDateValue);
					returnMap.put(ATTRIBUTE_APPROVAL_STATUS, approvalStatus);
					returnMap.put(AWLConstants.ARTWORK_MASTER_ID, artworkMasterId);
					returnMap.put(AWLConstants.ASSIGNEE_NAME, strAssigneeName);
					returnMap.put(ATTRIBUTE_ROUTE_TASK_USER, routeTaskUser);

					returnMap.put(AWLConstants.ARTWORK_PACKAGE_ID, apId);
					returnMap.put(AWLConstants.IS_ASSIGNED_TO_PERSON, isAssignedToPerson);
					returnMap.put(AWLConstants.ASSIGNEE_ID, assigneeId);
					returnMap.put(ROUTE_STATUS, routeStatus);

					mlTaskorPersonInfo.add(returnMap);
				}
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		return mlTaskorPersonInfo;
	}
	
	public StringList showTaskStatusGif(Context context, String[] args) throws FrameworkException
	{
		StringList enableCheckbox = new StringList();
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);

			String stateComplete = AWLState.COMPLETE.get(context, AWLPolicy.INBOX_TASK);
			
			Date curDate = new Date();

			for (Iterator oitr = objectList.iterator(); oitr.hasNext();)
			{
				Map objectMap = (Map) oitr.next();
				String taskState = (String) objectMap.get(SELECT_CURRENT);
				String routeStatus = BusinessUtil.getString(objectMap, ROUTE_STATUS);
				boolean routeStopped = STOPPED_ROUTE_STATUS.contains(routeStatus);

				String statusColor= "";

				String strRouteNodeOrRouteTask = (String) objectMap.get(DomainRelationship.SELECT_NAME);
				if(strRouteNodeOrRouteTask.equals(AWLRel.ROUTE_NODE.get(context)))
				{
					statusColor = routeStopped ? "taskNotStartedRejectedRoute" : "taskNotStarted";
				}
				else if(taskState.equals(stateComplete))
				{
					statusColor = (String) objectMap.get(AWLAttribute.APPROVAL_STATUS.get(context));
					statusColor = "Reject".equals(statusColor) ? "Reject" : "Approve";
				} 
				else if (routeStopped)
				{
					statusColor = "RejectedRoute";
				}
				else
				{
					String taskDueDate = (String)objectMap.get(AWLConstants.TASK_DUE_DATE);
					boolean dueDateEmpty = BusinessUtil.isNullOrEmpty(taskDueDate);
					Date dueDate = dueDateEmpty ? null : eMatrixDateFormat.getJavaDate(taskDueDate);
					if(dueDateEmpty) {
						statusColor = "Green";
					} else if(curDate.after(dueDate)) {
						statusColor = "Red";
					} else {
						String strNearingDueDate = AWLPropertyUtil.getConfigPropertyString(context, "emxCPD.NearingDueDate.Duration");	
						int nearingDueDateDuration = Integer.parseInt(strNearingDueDate);
						int noOfDaysBetweenDueDateAndCurDate  = BusinessUtil.getBusinessDaysBetweenTwoDates(curDate, dueDate);
						statusColor = (noOfDaysBetweenDueDateAndCurDate <= nearingDueDateDuration) ? "Yellow" : "Green";
					}
				}
				enableCheckbox.add(getStatusColor(context,statusColor));
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		return enableCheckbox;
	}
	
	private String getStatusColor(Context context, String statusColor) throws FrameworkException
	{
		String strTooltip = "";
		String image = "";
		String statusImageString = "";
		try {
			//Due Date Crossed
		//	String language = context.getSession().getLanguage();
			if("Red".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskPastDueDate";
				image = "../common/images/iconStatusRed.gif";
			}
			//Due Date is on track
			else if("Green".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskOnTime";
				image = "../common/images/iconStatusGreen.gif";
			}
			//Task Approved
			else if("Approve".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskApproved";
				//iconStatusComplete.gif
				//iconActionApprove.gif
				image = "../common/images/iconStatusComplete.gif";
			}
			//Task Rejected
			else if("Reject".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskRejected";
				//iconStatusRejected.gif
				//iconActionReject.gif
				//image = "../common/images/iconStatusRejected.gif";
				image = "../awl/images/AWLApprovalRejected.gif";
			}
			else if("taskNotStarted".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskNotStarted";
				image = "../common/images/iconStatusGrey.gif";
			}
			//Due Date is near
			else if("Yellow".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskNearingDueDate";
				image = "../common/images/iconStatusYellow.gif";
			}
			else if ("RejectedRoute".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskActive.RouteStopped";
				image = "../common/images/iconStatusAbstain.gif";
			}
			else if ("taskNotStartedRejectedRoute".equals(statusColor))
			{
				strTooltip = "emxAWL.Tooltip.TaskNotStarted.RouteStopped";
				image = "../common/images/iconStatusContainsUnreported.gif";
			}
			
			if(BusinessUtil.isNotNullOrEmpty(strTooltip)) {
				strTooltip = AWLPropertyUtil.getI18NString(context,strTooltip);	

				statusImageString = AWLUtil.strcat("<img src=\"", image, "\" align=\"middle\" ", 
				"onmouseover=\"showTooltip(event, this,'", strTooltip, "');\" ", 
				"onmouseout=\"hideTooltip(event, this);\" ", "/>");
			}
		}  catch (Exception e) { throw new FrameworkException(e); }
		return statusImageString;
	}
	
	// Added by SY6 : Task Assignment Enhancement (12x.FD01)
	public StringList getRouteNodeOrRouteTaskAssigneeName(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
            StringList elementTypes  =  new StringList(objectList.size());
			for (Iterator oitr = objectList.iterator(); oitr.hasNext();)
			{
				Map objectMap      = (Map)oitr.next();
				String elementId   = BusinessUtil.getString(objectMap, AWLConstants.ASSIGNEE_NAME);
				elementTypes.add(elementId);
			}
			return elementTypes;
		} catch (Exception e) { throw new FrameworkException(e); }
		
	}
	
	public StringList getTaskType(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap 	 = (HashMap) JPO.unpackArgs(args);
			MapList objectList 	 = BusinessUtil.getObjectList(programMap);
			StringList taskType = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map object = (Map) iterator.next();
				String actionType = (String) object.get(AWLConstants.ROUTE_ARTWORK_INFO_ACTION);
				String key = isMasterCopyAction(actionType) ?
						(isAuthoringAction(actionType) ? "emxAWL.Label.AWLMasterCopyAuthoring" : "emxAWL.Label.MasterCopyApproval" ) :
						(isAuthoringAction(actionType) ? "emxAWL.Label.AWLLocalCopyAuthoring" : "emxAWL.Label.LocalCopyApproval" );
				taskType.add(AWLPropertyUtil.getI18NString(context,key));
			}
			return taskType;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList isCellEditableForDueDateColumn(Context context, String[] args) throws FrameworkException
	{
		StringList editAccess     = new StringList ();
		try
		{
			Map programMap        = (Map)JPO.unpackArgs(args);
			Map mpRequestMap    = (Map)programMap.get("requestMap");
			String artworkId    = (String)mpRequestMap.get("objectId");
			String artworkOwner = BusinessUtil.getInfo(context, artworkId, DomainConstants.SELECT_OWNER);
			String contextUser  = context.getUser();
			boolean artworkPackageOwner =  contextUser.equals(artworkOwner);
			MapList objectList    = BusinessUtil.getObjectList(programMap);
			boolean isProductManager = Access.isProductManager(context);

			for(int i = 0; i < objectList.size(); i++)
			{
				Map objectMap  = (Map) objectList.get(i);
				String taskState = BusinessUtil.getCurrentState(objectMap);
				boolean canEdit = (artworkPackageOwner || isProductManager)&& !AWLState.COMPLETE.get(context, AWLPolicy.INBOX_TASK).equals(taskState); 
				editAccess.add(canEdit ? Boolean.TRUE.toString() : Boolean.FALSE.toString());
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		return editAccess;
	}
	
	public void updateDueDateColumn(Context context,String[] args)throws FrameworkException
	{
		try
		{
		    HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap requestMap = (HashMap)programMap.get("requestMap");
			HashMap paramMap = (HashMap)BusinessUtil.getParamMap(programMap);
			String strObjectId = BusinessUtil.getObjectId(paramMap);
			String strRelId = BusinessUtil.getRelId(paramMap);
			String strNewDate = (String)paramMap.get(AWLConstants.NEW_VALUE);
			Locale locale = (Locale)requestMap.get("locale");
			DomainObject doObject = new DomainObject(strObjectId);
			double clientTZOffset  = Double.parseDouble((String)requestMap.get("timeZone"));
			DateFormat dtFormat = DateFormat.getDateInstance(DateFormat.MEDIUM, locale);
			String sysDate = dtFormat.format(new Date());
			String curDate = eMatrixDateFormat.getFormattedInputDateTime(context, sysDate, "12:00:00 AM", clientTZOffset, locale);
			String newDate =  BusinessUtil.isNullOrEmpty(strNewDate) ? DomainObject.EMPTY_STRING :eMatrixDateFormat.getFormattedInputDateTime(context, strNewDate, "12:00:00 AM", clientTZOffset, locale);
			Date dNewDate = eMatrixDateFormat.getJavaDate(newDate);
			Date dCurDate = eMatrixDateFormat.getJavaDate(curDate);
			

			DomainRelationship doRel = new DomainRelationship(strRelId);
			ContextUtil.startTransaction(context, true);
			try{
	        		doRel.open(context);
	        		String strRelName = doRel.getTypeName();
	        		boolean isRouteNode = AWLRel.ROUTE_NODE.get( context ).equalsIgnoreCase(strRelName);
	        		if(dNewDate.before(dCurDate))
	        		{	
	        			String strMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.NewDateShouldBeGreaterThanCurrentDate");									
	        			MqlUtil.mqlCommand(context, "notice $1", strMessage);
	        		}
	        		else if(isRouteNode)
	        		{
	        			doRel.setAttributeValue(context, strRelId,AWLAttribute.SCHEDULED_COMPLETION_DATE.get(context), newDate);
	        		}
	        		else
	        		{
	        			doObject.setAttributeValue(context,AWLAttribute.SCHEDULED_COMPLETION_DATE.get(context), newDate);
	        		}
	        		ContextUtil.commitTransaction(context);
			}catch (Exception e) {
				e.printStackTrace();
				ContextUtil.abortTransaction(context);
			}finally{
				doRel.close(context);
			}
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	// Added by SY6 : Task Assignment Enhancement (13x)
	public StringList getDueDate(Context context, String[] args) throws FrameworkException
	{
		try
		{
			StringList elementTypes  =  new StringList();
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
			for(Iterator itrObjectList = objectList.iterator(); itrObjectList.hasNext();)
			{
				Map mpObject = (Map)itrObjectList.next();
				String taskState = BusinessUtil.getCurrentState(mpObject);
				String dueDate = BusinessUtil.getString(mpObject, AWLConstants.TASK_DUE_DATE);
				elementTypes.add(!AWLState.COMPLETE.get(context, AWLPolicy.INBOX_TASK).equals(taskState) ? dueDate : AWLConstants.EMPTY_STRING);
			}
			return elementTypes;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getTaskCompletionDate(Context context, String[] args) throws FrameworkException
	{
		try
		{
			StringList elementTypes      =  new StringList();
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
			
			for(Iterator itrObjectList = objectList.iterator(); itrObjectList.hasNext();)
			{
				Map mpObject = (Map)itrObjectList.next();
				String relName = (String) mpObject.get(DomainRelationship.SELECT_NAME);
				if(DomainConstants.RELATIONSHIP_ROUTE_NODE.equals(relName)) {
					elementTypes.add(DomainConstants.EMPTY_STRING);
				} else {
					String strTaskId = BusinessUtil.getId(mpObject);
					String taskState = BusinessUtil.getCurrentState(mpObject);
					boolean isCompleted = AWLState.COMPLETE.get(context, AWLPolicy.INBOX_TASK).equals(taskState);
					elementTypes.add(!isCompleted ? AWLConstants.EMPTY_STRING :
										BusinessUtil.getAttribute(context, strTaskId, AWLAttribute.ACTUAL_COMPLETION_DATE));
				}
			}
			return elementTypes;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	// Added by SY6 : Task Assignment Enhancement (13x)
	public StringList getArtworkElementType(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap      = (Map)JPO.unpackArgs(args);
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);

			String languageStr  = BusinessUtil.getString(requestMap, AWLConstants.LANGUAGE_STRING);
			MapList objectList  = BusinessUtil.getObjectList(programMap);

			StringList artworkMasterIds = BusinessUtil.toStringList(objectList, AWLConstants.ARTWORK_MASTER_ID);
			StringList artworkMasterTypes = BusinessUtil.getInfo(context, artworkMasterIds, DomainObject.SELECT_TYPE);

			StringList i18NFeatureTypes = new StringList(artworkMasterTypes.size());
			for (Iterator iterator = artworkMasterTypes.iterator(); iterator.hasNext();) {
				String type = (String) iterator.next();
				i18NFeatureTypes.add(AWLPropertyUtil.getTypeI18NString(context, type, languageStr, false));
			}
			return  i18NFeatureTypes;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	// Added by SY6 : Task Assignment Enhancement (13x)
	public StringList getArtworkElementDisplayName(Context context, String[] args) throws FrameworkException
	{
		try
		{
			String attrDisplayName = DomainObject.getAttributeSelect(AWLAttribute.MARKETING_NAME.get(context));

			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
			StringList artworkMasterIds = BusinessUtil.toStringList(objectList, AWLConstants.ARTWORK_MASTER_ID);
			StringList marketingName = BusinessUtil.getInfo(context, artworkMasterIds, attrDisplayName);
			StringList returnList = new StringList(marketingName.size());
			for (Iterator iterator = marketingName.iterator(); iterator.hasNext();) {
				String displayName = (String) iterator.next();
				returnList.add(displayName);
			}
			return returnList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	// Added by SY6 : Task Assignment Enhancement (12x.FD01)
	public StringList getArtworkTaskManagementLanguage(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
			StringList copyTextLanguageList = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map mpObject = (Map) iterator.next();
				String artworkContentId = (String)mpObject.get(AWLConstants.TASK_CONTENT_ID);
				ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, artworkContentId);
				copyTextLanguageList.add(artworkContent.getCopyTextLanguage(context));
			}
			return copyTextLanguageList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getPOADescriptionByTask(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);

			StringList artworkContentIds = BusinessUtil.toStringList(objectList, AWLConstants.TASK_CONTENT_ID);
			return BusinessUtil.getInfo(context, artworkContentIds, SELECT_DESCRIPTION);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getPOAStateImage(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
			StringList poaStateList = new StringList();
			String typePOA = AWLType.POA.get(context);
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map mpObject = (Map) iterator.next();
				String strPOAId = (String) mpObject.get(AWLConstants.TASK_CONTENT_ID);
				//if no TASK_CONTENT_ID then it's TYPE is POA 
				if(BusinessUtil.isNullOrEmpty(strPOAId))
				    strPOAId = (String)mpObject.get( SELECT_ID );
				    
				String state = EMPTY_STRING;
				if(BusinessUtil.isNotNullOrEmpty(strPOAId) && BusinessUtil.isKindOf(context, strPOAId, typePOA)) {
					state = ((AWLPOAUIBase_mxJPO)newInstanceOfJPO(context,"AWLPOAUI" ,new String[] {strPOAId})).getCurrentStateHTML(context, new String[] {strPOAId});
				}
				poaStateList.add(state);
			}
			return poaStateList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getPOAName(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);

			StringList artworkContentIds = BusinessUtil.toStringList(objectList, AWLConstants.TASK_CONTENT_ID);
			return BusinessUtil.getInfo(context, artworkContentIds, SELECT_NAME);
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public StringList getPOATaskType(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap 	 = (HashMap) JPO.unpackArgs(args);
			MapList objectList 	 = BusinessUtil.getObjectList(programMap);			
			StringList taskType = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map object = (Map) iterator.next();
				String actionType = (String) object.get(AWLConstants.ROUTE_ARTWORK_INFO_ACTION);
				taskType.add(actionType);
			}
			return taskType;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public Map reassignArtworkContentTask(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map returnMap = new HashMap();
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			Map requestMap	   = BusinessUtil.getRequestMap(programMap);

			String relIds = (String)requestMap.get(AWLConstants.SEL_REL_IDs);
			StringList relIdList = FrameworkUtil.split(relIds, ",");
			String rowIds = (String)requestMap.get(AWLConstants.SEL_ROW_IDs);
			StringList rowIdList = FrameworkUtil.split(rowIds, ",");

			String newAssigneeOID = (String)requestMap.get(AWLConstants.NEW_ASSIGNEE_OID);
			if(BusinessUtil.isNullOrEmpty(newAssigneeOID) || BusinessUtil.isNullOrEmpty(relIdList)) {
				String message = AWLPropertyUtil.getI18NString(context,"emxAWL.NoPersonOrTaskSelected.Alert");	
				returnMap.put(AWLConstants.MESSAGE, message);
				returnMap.put(AWLConstants.ACTION, AWLConstants.ACTION_ERROR);
				return returnMap;
			}

			Person person = (Person)DomainObject.newInstance(context, TYPE_PERSON);
			person.setId(newAssigneeOID);
			String personName = BusinessUtil.getInfo(context, newAssigneeOID, SELECT_NAME);
			
			String artworkInfoFromSelector=AWLUtil.strcat("from.", AWLAttribute.ARTWORK_INFO.getSel(context));
			String artworkInfoToSelector=AWLUtil.strcat("to.", AWLAttribute.ARTWORK_INFO.getSel(context));
			String taskIdSelector=AWLUtil.strcat("from.", SELECT_ID);

			StringList relationshipSelects = new StringList(DomainRelationship.SELECT_NAME);
			relationshipSelects.add(artworkInfoFromSelector);
			relationshipSelects.add(artworkInfoToSelector);
			relationshipSelects.add(taskIdSelector);

			StringList routeTaskIdsList = new StringList();
			StringList routeNodeIdsList = new StringList();
			StringList slRouteTaskPersonOrRTUID = new StringList();
			StringList slRouteTaskRouteIDList = new StringList();
			StringList slRouteNodeRouteIDList = new StringList();
			boolean errorFlag=false;

			MapList relList = DomainRelationship.getInfo(context, (String[]) relIdList.toArray(new String[]{}), relationshipSelects);
			for(int i=0; i < relList.size(); i++) {
				Map relMap = (Map)relList.get(i);

				String relName = (String)relMap.get(DomainRelationship.SELECT_NAME);
				String strRouteOrTaskID = (String)relMap.get(taskIdSelector);
				String actionType = (String) (AWLRel.ROUTE_NODE.get(context).equals(relName) ? relMap.get(artworkInfoFromSelector) : relMap.get(artworkInfoToSelector));

				boolean isPOA = isPOAAction(actionType);
				boolean isMasterCopy = !isPOA && isMasterCopyAction(actionType);
				boolean isAuthroing = isAuthoringAction(actionType);
				
			    Access.COPY_ARTWORK_ROLES roleToCheck = isPOA ? (isAuthroing ? Access.COPY_ARTWORK_ROLES.GRAPHIC_DESIGNER : Access.COPY_ARTWORK_ROLES.ARTWORK_APPROVER) :
			    										isMasterCopy ? (isAuthroing ? Access.COPY_ARTWORK_ROLES.MASTER_COPY_AUTHOR : Access.COPY_ARTWORK_ROLES.MASTER_COPY_APPROVER) :
			    													(isAuthroing ? Access.COPY_ARTWORK_ROLES.LOCAL_COPY_AUTHOR : Access.COPY_ARTWORK_ROLES.LOCAL_COPY_APPROVER);
				if(!Access.hasRole(context, personName, roleToCheck)) {
					errorFlag = true;
					break;
				}

				String strRouteTaskPersonOrRTUSelectable = AWLUtil.strcat(FROM_OPEN, AWLRel.ROUTE_TASK.get(context), "].to.from[", AWLRel.ROUTE_NODE.get(context), REL_SEL_CLOSE_TO_ID);
				
				String strRouteTaskRouteSelectable = AWLUtil.strcat(FROM_OPEN, AWLRel.ROUTE_TASK.get(context), REL_SEL_CLOSE_TO_ID);
				
				if(AWLRel.ROUTE_TASK.get(context).equals(relName)) {
					routeTaskIdsList.add(strRouteOrTaskID);
					String strPersonOrRTUID = BusinessUtil.getInfo(context, strRouteOrTaskID, strRouteTaskPersonOrRTUSelectable);
					String strRouteID = BusinessUtil.getInfo(context, strRouteOrTaskID, strRouteTaskRouteSelectable);
					slRouteTaskPersonOrRTUID.add(strPersonOrRTUID);
					slRouteTaskRouteIDList.add(strRouteID);
				} else if(AWLRel.ROUTE_NODE.get(context).equals(relName)) {
					routeNodeIdsList.add((String)relIdList.get(i));
					slRouteNodeRouteIDList.add(strRouteOrTaskID);
				}
			}

			if(errorFlag) {
				String strAlertMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.ArtworkContentTask.Alert");
				returnMap.put(AWLConstants.MESSAGE, strAlertMessage);
				returnMap.put(AWLConstants.ACTION, AWLConstants.ACTION_ERROR);
				return returnMap;
			}

			String newTaskOwner = BusinessUtil.getInfo(context, newAssigneeOID, SELECT_NAME);

			for(int i=0;i<routeTaskIdsList.size();i++) {
				requestMap.put(AWLConstants.OBJECT_ID, routeTaskIdsList.get(i));
				String routeTaskId =(String) routeTaskIdsList.get(i);
				DomainObject inboxTaskObj = new DomainObject(routeTaskId);
				String dueDateVal = inboxTaskObj.getAttributeValue(context, AWLAttribute.SCHEDULED_COMPLETION_DATE.get(context));
				String saArgs[] = JPO.packArgs(programMap);
				invokeLocal(context, "emxInboxTask", saArgs, "updateAssignee", saArgs , HashMap.class);
				inboxTaskObj.setAttributeValue(context,  AWLAttribute.SCHEDULED_COMPLETION_DATE.get(context), dueDateVal);
				String personOrRTU = (String)slRouteTaskPersonOrRTUID.get(i);
				String strRouteID = (String)slRouteTaskRouteIDList.get(i);
				if(BusinessUtil.isNotNullOrEmpty(personOrRTU) && BusinessUtil.isKindOf(context, personOrRTU, AWLAttribute.ROUTE_TASK_USER.get(context)))
				{
					grantAccessToNewAssigneeForRoleOrGroupBased(context, strRouteID, newTaskOwner);
				}    
			}
			
			for(int i=0;i < routeNodeIdsList.size(); i++) {
				String routeNodeId = (String) routeNodeIdsList.get(i);
				String strRouteTaskUser = DomainRelationship.getAttributeValue(context, routeNodeId,  AWLAttribute.ROUTE_TASK_USER.get(context));					 
				String strRouteID = (String)slRouteNodeRouteIDList.get(i);
				if(strRouteTaskUser.startsWith("role_") || strRouteTaskUser.startsWith("group_"))
				{
					grantAccessToNewAssigneeForRoleOrGroupBased(context, strRouteID, newTaskOwner);
				} else
				{
					String currentTaskOwner = BusinessUtil.getInfo(context, (String)rowIdList.get(i), SELECT_NAME);
					grantAccessToNewAssigneeForPersonBased(context, new DomainObject(strRouteID), currentTaskOwner, newTaskOwner);
				}
				DomainRelationship.setToObject(context, routeNodeId, person);
				DomainRelationship.setAttributeValue(context, routeNodeId, AWLAttribute.ROUTE_TASK_USER.get(context), "");
			}

			returnMap.put(AWLConstants.FORM_EDIT_ACTION, AWLConstants.ACTION_CONTINUE);
			return returnMap;
		} catch (Exception e) { 
			e.printStackTrace();
			throw new FrameworkException(e);
			}
	}
	
	protected void grantAccessToNewAssigneeForRoleOrGroupBased(Context context, String strRouteID, String newTaskOwner) throws FrameworkException
	{
			ContextUtil.pushContext(context, AccessUtil.ROUTE_ACCESS_GRANTOR, null, null);
    		//MqlUtil.mqlCommand(context, "mod bus $1 grant $2 access $3,$4,$5", true, strRouteID, newTaskOwner, "read","checkout","show");
            ContextUtil.popContext(context);
	}
	
	protected void grantAccessToNewAssigneeForPersonBased(Context context, DomainObject routeObj, String currentTaskOwner, String newTaskOwner) throws FrameworkException 
	{
        StringList objectSelects = new StringList();
        objectSelects.add(SELECT_ID);
        objectSelects.add(SELECT_GRANTOR);
        objectSelects.add(SELECT_GRANTEE);
        objectSelects.add(SELECT_GRANTEEACCESS);
        objectSelects.add(SELECT_OWNER);
        StringList typeList = BusinessUtil.getTypesOnRelation(context, RELATIONSHIP_OBJECT_ROUTE, true);
        // Get the route items along with grant information
        MapList items = routeObj.getRelatedObjects(
                                    context,
                                    RELATIONSHIP_OBJECT_ROUTE,
                                    FrameworkUtil.join(typeList, ","),               
                                    objectSelects,    
                                    new StringList(),
                                    true,                       
                                    false,                      
                                    (short) 1,                  
                                    EMPTY_STRING,
                                    EMPTY_STRING,
                                    (int) 0);
        
        // Get grant information against the route object itself and add it to the route items list
        Map routeMap = routeObj.getInfo(context, objectSelects);
        items.add(0, routeMap);
        
        // grant access to route and route items
        Iterator itr = items.iterator();
        while (itr.hasNext()) {
            Map map = (Map) itr.next();

            // Reset grantee information for this item.
            java.util.List grantors = null;
            java.util.List grantees = null;
            java.util.List granteeAccesses = null;

            Object grantorsObject = map.get(SELECT_GRANTOR);
            if (grantorsObject instanceof String || grantorsObject == null) {
                if (grantorsObject == null || "".equals(grantorsObject)) {
                    // There are no grantors, nothing to grant for item.
                    continue;
                }
                grantors = new ArrayList(1);
                grantees = new ArrayList(1);
                granteeAccesses = new ArrayList(1);

                // Add signle grantee information to list objects.
                grantors.add(grantorsObject);
                grantees.add(map.get(SELECT_GRANTEE));
                granteeAccesses.add(map.get(SELECT_GRANTEEACCESS));
            } else {
                grantors = (java.util.List) map.get(SELECT_GRANTOR);
                grantees = (java.util.List) map.get(SELECT_GRANTEE);
                granteeAccesses = (java.util.List) map.get(SELECT_GRANTEEACCESS);
            }
            
            // The item that we are going to grant, which could be the route itself.
            String itemId = (String) map.get(SELECT_ID);

            for (int i = 0; i < grantors.size(); i++) {
            	
                // check to see if grantee is the context user.
                String grantee = (String) grantees.get(i);	                
                if (BusinessUtil.isNotNullOrEmpty(grantee) && !grantee.equals(currentTaskOwner)) {
                    continue;
                }
                String grantor = (String) grantors.get(i);
                if (BusinessUtil.isNotNullOrEmpty(grantor) && !grantor.equals(AccessUtil.ROUTE_ACCESS_GRANTOR)) {
                    continue;
                }
                
                String granteeAccess = (String) granteeAccesses.get(i);
               	                
                // Perhaps it is better to build a context object using the route delegation grantor, but not sure of password
                boolean isContextPushed = false;
                try {
                    ContextUtil.pushContext(context, AccessUtil.ROUTE_ACCESS_GRANTOR, null, null);
                    isContextPushed = true;
                    StringBuffer mqlString = new StringBuffer("modify bus $1 grant $2 access ");
                    StringList sl = FrameworkUtil.split(granteeAccess, ",");
                    String[] params = new String[sl.size()+2];
                    params[0] = itemId;
                    params[1] = newTaskOwner;
                    for(int n=0; n<sl.size(); n++) {
                    	mqlString.append("$"+(n+3)+", ");
                    	params[n+2]=sl.get(n).toString();
                    }
                    //mqlString will be in the form modify bus $1 grant $2 access $3 $4 ....
                   // MqlUtil.mqlCommand(context, mqlString.substring(0, mqlString.length()-1), params);
                } finally {
                    if(isContextPushed)
                        ContextUtil.popContext(context);
                }                    
            }
        }
    }
	
	
	/**	
	 * Method shows higher revision Icon if a higher revision of the object exists otherwise it will display blank.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero
	 * @since   AWL 2013x.HF1
	 * @author  SubbaRao G(SY6)
	 */
	public StringList getHigherRevisionIcon(Context context, String[] args) throws FrameworkException {
        try {
        	Map programMap = (HashMap) JPO.unpackArgs(args);
            Map paramMap      = BusinessUtil.getRequestParamMap(programMap);
    		String reportFormat = BusinessUtil.getString(paramMap, "reportFormat");
            MapList objectList = BusinessUtil.getObjectList(programMap);
            StringList idList = BusinessUtil.getIdList(objectList);
            StringList objectSelectables = BusinessUtil.toStringList(SELECT_ID, SELECT_REVISION, AWLConstants.LAST);
            
            MapList mlObjectInfo = BusinessUtil.getInfo(context, idList, objectSelectables);
            
            String tooltipForHigherRevision =  AWLPropertyUtil.getI18NString(context, "emxComponentsStringResource", 
    				  											     "emxComponents.EngineeringChange.HigherRevisionExists", context.getSession().getLanguage());
            
            String HIGHER_REVISION_ICON = "<img src=\"../common/images/iconSmallHigherRevision.gif\" border=\"0\" align=\"middle\"></img>";
            
            String higherRevImageHTML = AWLUtil.strcat("<a HREF=\"#\" TITLE=\"", tooltipForHigherRevision, "\">", HIGHER_REVISION_ICON, "</a>");
            
            StringList higherRevisionHTMLList = new StringList();
            
            for (Iterator iterator = mlObjectInfo.iterator(); iterator.hasNext();) {
    			Map objectMap = (Map) iterator.next();
    			String currentRevision = (String)objectMap.get(SELECT_REVISION);
    			String latestRevision = (String)objectMap.get(AWLConstants.LAST);
    			boolean isLatestRev = currentRevision.equals(latestRevision);
    			String higherRevisionHTMLValue = "".equalsIgnoreCase(reportFormat) ? (isLatestRev ? " " : higherRevImageHTML) 
    																		  	   : (isLatestRev ? AWLConstants.RANGE_NO : AWLConstants.RANGE_YES);
    			higherRevisionHTMLList.add(higherRevisionHTMLValue);			
    		}
            return higherRevisionHTMLList;
		}  catch (Exception e) { throw new FrameworkException(e); }
    }		
	 
    /**
     * Returns the Artwork Package Range Values
     * @param context
     * @param args
     * @return
     * @throws Exception
     * @author N94
     */
    public Map getMovePOAArtworkPackageRange (Context context, String[] args) throws Exception {
         HashMap rangeMap = new HashMap();
        StringList fieldRangeValues = new StringList();
        StringList fieldDisplayRangeValues = new StringList();
        fieldDisplayRangeValues.addElement(AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.CreateNewChangeOrder"));
        fieldDisplayRangeValues.addElement(AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.ChooseExistingArtworkPackage"));
        fieldRangeValues.addElement("createNew");
        fieldRangeValues.addElement("useExisting");
        rangeMap.put( "field_choices" , fieldRangeValues);
        rangeMap.put( "field_display_choices" , fieldDisplayRangeValues);
        return  rangeMap;
    } 
    
    
	/**
	 * In Move POA to Artwork Package Form. If User Choose "Use Existing AP" exclude the Current Artwork Package in
	 * search Results
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * @author N94
	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeSourceArtworkPackageInMovePOA(Context context, String [] args) throws FrameworkException
	{
		try
		{	
			Map<String, String> programMap = (Map) JPO.unpackArgs(args);
			String contextObject = programMap.get(BusinessUtil.OBJECT_ID);			
			return BusinessUtil.toStringList(contextObject);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * To check if the given Artwork Package contains any Customized POA 
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - boolean - has Cutomization POA or not
	 * @throws FrameworkException
	 * @author RRR1 (Rakshith)
	 * @Since VR2015x.HF6
	 * Created during 'Customization Kit Highlight'
	 */
	
	public boolean containsCustomizedPOA(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map<String , String> programMap = (Map) JPO.unpackArgs(args);
			String contextObjectID = programMap.get(BusinessUtil.OBJECT_ID);
			String SEL_ATTR_ARTWORK_BASIS = 
					AWLUtil.strcat("from[", AWLRel.ARTWORK_PACKAGE_CONTENT.get(context) , "].to.", AWLAttribute.ARTWORK_BASIS.getSel(context)); 
			StringList attributeList =  BusinessUtil.getInfoList(context, contextObjectID, SEL_ATTR_ARTWORK_BASIS);
			return attributeList.contains(AWLConstants.ARTWORK_BASIS_MARKETING_CUSTOMIZATION);

		} catch(Exception e){ throw new FrameworkException(e); }
	}
	
	/**
	 * To get theComprised POAs of a given element. 
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - StringList of Column Values List
	 * @throws FrameworkException
	 * @author RRR1 (Rakshith)
	 * @Since VR2015x.HF6
	 * Created during 'Customization Kit Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public StringList getComprisedPOAsForArtworkElements(Context context, String[] args) throws FrameworkException
	{		
		try 
		{
			StringList returnList = new StringList();
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map requestParamMap = BusinessUtil.getRequestParamMap(programMap);

			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(requestParamMap, "exportFormat"));
			String toolTipText =  AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ComprisedPOAs");
			String PROGRAM = "AWLArtworkPackageUI";
			String FUNCTION = "getComprisedPOAsForArtworkElement";
			String argNames = "apID,aeID";
			
			String artworkPackageID = (String) requestParamMap.get(AWLConstants.OBJECT_ID);
			MapList assemblyElementsList = BusinessUtil.getObjectList(programMap);
			StringList artworkElementIDs = BusinessUtil.getIdList(assemblyElementsList);
			
			Map<String, StringList> comprisedPOAsForElement = getComprisedPOAsForArtworkElements(context, artworkElementIDs, artworkPackageID);
			 
			for (String aeID : (List<String>)artworkElementIDs) {
				StringList comprisedPOANames = comprisedPOAsForElement.get(aeID);
				if(BusinessUtil.isNotNullOrEmpty(comprisedPOANames)) 
				{
					String arguments = AWLUtil.strcat("apID=", artworkPackageID, "&amp;aeID=", aeID);
					String[] javaScriptMethodArgsArray = {PROGRAM, FUNCTION, arguments, argNames, toolTipText};
					returnList.add(generateHTMLForMoreObjects(context, comprisedPOANames, true, toolTipText, isExporting, "showAssociatedObjectsUsingJPO", javaScriptMethodArgsArray));
				}
				else
				{
					returnList.add(EMPTY_STRING);
				}
			}
			return returnList;

		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	private Map<String, StringList> getComprisedPOAsForArtworkElements(Context context, StringList artworkElementIDs, String artworkPackageID) throws FrameworkException {
		try {
			ArtworkPackage ap = new ArtworkPackage(artworkPackageID);
			StringList artworkPackagePOAIdNames = BusinessUtil.toStringList(
					ap.getPOAs(context, new StringList(AWLObject.SELECT_ID)),DomainConstants.SELECT_NAME);
			String REL_ARTWORK_ASSEMBLY = AWLRel.ARTWORK_ASSEMBLY.get(context);
			String REL_COMPRISED_ARTWORK_ASSEMBLY = AWLRel.COMPRISED_ARTWORK_ASSEMBLY.get(context);
			String SEL_COMPRISED_ARTWORK_REL_ID = AWLUtil.strcat("to[", REL_ARTWORK_ASSEMBLY ,"].tomid[", REL_COMPRISED_ARTWORK_ASSEMBLY,"].fromrel.id");
			String FROM_NAME = "from.name";
			String TO_NAME = "to.name";
			StringList REL_SEL = BusinessUtil.toStringList(FROM_NAME, TO_NAME);

			Map<String, StringList> returnMap = new HashMap<String, StringList>(artworkElementIDs.size());
			MapList artworkAssemblyInfo = BusinessUtil.getInfoList(context, artworkElementIDs, 
					BusinessUtil.toStringList(SELECT_ID, SEL_COMPRISED_ARTWORK_REL_ID));
			
			for (Map artworkElementMap : (List<Map>)artworkAssemblyInfo) 
			{
				String aeID = BusinessUtil.getFirstString(artworkElementMap, SELECT_ID);
				StringList comprisedREL =(StringList) artworkElementMap.get(SEL_COMPRISED_ARTWORK_REL_ID);
				if(BusinessUtil.isNullOrEmpty(comprisedREL)) {
					returnMap.put(aeID, new StringList());
					continue;
				}

				MapList relInfo = DomainRelationship.getInfo(context, BusinessUtil.toStringArray(comprisedREL),	REL_SEL);
				StringList comprisedPOANames = new StringList();
				for (Map object : (List<Map>)relInfo) {
					String str = (String) object.get(FROM_NAME);
					if(artworkPackagePOAIdNames.contains(str))
						comprisedPOANames.add((String)object.get(TO_NAME));
				}
				comprisedPOANames = BusinessUtil.toUniqueSortedList(comprisedPOANames);
				returnMap.put(aeID, comprisedPOANames);
			}
		
			return returnMap;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Getting the Comprised POA for current Artwork Element 
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - StringList of Column Values List
	 * @throws FrameworkException
	 */
	public StringList getComprisedPOAsForArtworkElement(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map queryInfoMap = (HashMap) JPO.unpackArgs(args);
			String apID = (String)  queryInfoMap.get("apID");
			String aeID = (String)  queryInfoMap.get("aeID");
			return getComprisedPOAsForArtworkElements(context, BusinessUtil.toStringList(aeID), apID).get(aeID);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
}

