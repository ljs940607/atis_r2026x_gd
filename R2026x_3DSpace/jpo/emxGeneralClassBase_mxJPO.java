/*
 *   Copyright (c) 1992-2020 Dassault Systemes.
 *   All Rights Reserved.
 *   This program contains proprietary and trade secret information of MatrixOne,
 *   Inc.  Copyright notice is precautionary only
 *   and does not evidence any actual or intended publication of such program
 *
 */

import matrix.db.BusinessObject;
import matrix.db.BusinessObjectWithSelect;
import matrix.db.BusinessObjectWithSelectList;
import matrix.db.Context;
import matrix.db.ExpandParams;
import matrix.db.ExpansionIterator;
import matrix.db.RelationshipWithSelect;
import matrix.db.TransactionParameters;
import matrix.util.StringList;

import java.util.*;

import com.dassault_systemes.apps.library.resource.LibraryCentralResourceConstants;
import com.matrixone.apps.domain.*;
import com.matrixone.apps.domain.util.*;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.library.LibraryCentralConstants;


/**
 * The <code>emxGeneralClassBase</code> represents implementation of 
 * the "To Side" of "SubClass" Relationship in LC Schema
 *
 */

public class emxGeneralClassBase_mxJPO  extends emxClassification_mxJPO {
	private final String SELECT_ATTRIBUTE_COUNT = getAttributeSelect(ATTRIBUTE_COUNT);

	/**
	 * Trigger method called on create check when classifying content.
	 * The classification of content will be blocked if the parent object is not in Active state.
	 * The state mapping is used to compare the state
	 */
	static final Map<String, Integer> stateMapping = new HashMap<String, Integer>() {
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;

		{
			put("Inactive", 1);
			put("InWork", 2);
			put("Active", 3);
			put("Obsolete", 4);
		}
	};


	/**
	 * Creates emxGeneralClassBase object
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following list of arguments:
	 *    0 - String entry for "objectId"
	 * @throws Exception if the operation fails
	 */

	public emxGeneralClassBase_mxJPO (Context context, String[] args) throws Exception
	{
		super (context, args);
	}


	/**
	 * This method is executed if a specific method is not specified.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds no arguments
	 * @return int
	 * @throws Exception if the operation fails
	 */

	public int mxMain (Context context, String[] args) throws Exception
	{
		if (true)
		{
			throw new Exception (
					"must specify method on emxGeneralClassBase invocation"
					);
		}

		return 0;
	}

	/**
	 * Updates the 'Classification Class' and its parent objects' count as a result
	 * of a classified item being revised.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following list of arguments:
	 *    0 - FROMOBJECTID
	 *    1 - TOOBJECTID
	 *    2 - PARENTEVENT
	 *    3 - NEWRELID
	 * @return int the enditems count
	 * @throws Exception if the operation fails
	 */
	public int updateCount(Context context, String[] args) throws Exception
	{
		if(args == null || (args !=null && args.length < 3))
		{
			throw new Exception ("ERROR - Invalid number of arguments");
		}

		int ret = 0;

		//arg[0]: classification object id
		DomainObject dmObj = (DomainObject) DomainObject.newInstance(context, args[0]);
		String parentEvent = args[2];   //revise,clone,modify
		String newRelId = args[3];      //new relationship id

		//update the count as a result of a classified item being revised
		if("revise".equals(parentEvent) && newRelId != null && newRelId.length() > 0)
		{
			try
			{
				ContextUtil.startTransaction(context, true);
				String attrCountSel = "attribute[" + dmObj.ATTRIBUTE_COUNT + "]";

				String countStr = dmObj.getInfo(context, attrCountSel);
				int count = (new Integer(countStr)).intValue();
				count++;

				dmObj.setAttributeValue(context, dmObj.ATTRIBUTE_COUNT, Integer.toString(count));

				//Update other parent's count as well
				StringList busSels = new StringList();
				busSels.add(dmObj.SELECT_ID);
				busSels.add(attrCountSel);

				String rels = LibraryCentralConstants.RELATIONSHIP_SUBCLASS;
				StringBuffer types = new StringBuffer(LibraryCentralConstants.TYPE_CLASSIFICATION);
				types.append(",");
				types.append(LibraryCentralConstants.TYPE_LIBRARIES);

				MapList result = dmObj.getRelatedObjects(context,
						rels,
						types.toString(),
						busSels,
						null,
						true,
						false,
						(short)0,
						null,
						null);

				if(result != null && result.size() > 0)
				{
					for(int i=0; i < result.size(); i++)
					{
						Map map = (Map) result.get(i);
						String sObjId = (String) map.get(dmObj.SELECT_ID);
						String sCount = (String) map.get(attrCountSel);
						int objCounts = (new Integer(sCount)).intValue();
						objCounts++;

						DomainObject parentObj =
								(DomainObject) DomainObject.newInstance(context,sObjId);

						parentObj.setAttributeValue(context, dmObj.ATTRIBUTE_COUNT, Integer.toString(objCounts));
					}
				}

				ContextUtil.commitTransaction(context);
			}catch(Exception ex)
			{
				ret = 1;
				ContextUtil.abortTransaction(context);
				ex.printStackTrace();
				throw ex;
			}
		}

		return ret;
	}

	/**
	 * checks disconnect access for author on classified item relationship.
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following list of arguments:
	 *    0 - TOOBJECTID
	 * @return int t
	 * @throws Exception if the operation fails
	 */
	public static int checkDisconnectAccessForAuthor(Context context, String args[]) throws Exception {
		int intReturn = 0;
		String toObjId = args[0];
		try {
			if (toObjId!=null)
			{
				String mql = "print expr $1 select value dump";
				String mqlresult = MqlUtil.mqlCommand(context, mql, "IPC_AuthorDeleteAccess");
				TransactionParameters params = context.getTransactionParams();
				if ("TRUE".equalsIgnoreCase(mqlresult)){

					DomainObject toObject = DomainObject.newInstance(context, toObjId);
					StringList toObjectSelects = new StringList();
					toObjectSelects.add("current.access[delete]");
					Map<?,?> toObjMap = toObject.getInfo(context, toObjectSelects);

					if("FALSE".equalsIgnoreCase((String)toObjMap.get("current.access[delete]"))){
						params.setData(context,"ALLOW_AUTHOR_DISCONNECT","FALSE");
					}else{
						params.setData(context,"ALLOW_AUTHOR_DISCONNECT","TRUE");
					}

				}else {
					params.setData(context,"ALLOW_AUTHOR_DISCONNECT","TRUE");
				}
			}
		} catch(Exception e) {
			throw e;
		}
		return intReturn;
	}

	/**
	 * To check if Class/Library can be promoted or demoted.
	 * 
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following list of arguments:
	 *    0 - OBJECTID
	 *    1 - STATENAME
	 *    2 - NEXTSTATE
	 *    3 - TYPE
	 * @return 0 if promote/demote is valid. Otherwise a non-zero number
	 * will be returned
	 * @throws Exception if operation fails
	 * @since R2024x FD01
	 */
	public int checkPromoteDemoteAllowed(Context context, String[] args) throws Exception {
		int retValue = 0;
		String type = args[3];

		//Perform Check only for General Library and General Class 
		if (type.equals(TYPE_GENERAL_CLASS) || type.equals(TYPE_GENERAL_LIBRARY)) {
			String objectId = args[0];
			String oldState = args[1];
			String newState = args[2];
			BusinessObject bIPClassificationObject = new BusinessObject(objectId);
			bIPClassificationObject.open(context);
			boolean isPromote = stateMapping.get(oldState) < stateMapping.get(newState) ? true : false;
			if (isPromote && type.equals(TYPE_GENERAL_CLASS)) { //Promote only needs to be covered for General Class
				String fromObjectStateSelect = "to[" + RELATIONSHIP_SUBCLASS + "].from.current";
				String parentCurrentState = bIPClassificationObject.select(context, fromObjectStateSelect);
				if (UIUtil.isNotNullAndNotEmpty(parentCurrentState) &&
						(stateMapping.get(parentCurrentState) < stateMapping.get(newState)) && (!"Obsolete".equals(newState))) {
					retValue = 1;
					emxContextUtil_mxJPO.mqlNotice(context,
							EnoviaResourceBundle.getProperty(context,
									"emxLibraryCentralStringResource",
									context.getLocale(),
									"emxLibraryCentral.Message.MsgClassPromoteNotAllowed"));
				}
			} else if (!isPromote) { // If it' a demote then test is required for General Library/Class.
				String childCurrentState =  ""; 
				ExpandParams expandParams = ExpandParams.getParams();
				expandParams.setBusSelects(SELECT_CURRENT);
				expandParams.setGetFrom(true);
				expandParams.setRelPattern(RELATIONSHIP_SUBCLASS);
				expandParams.setRecurse(1);
				ExpansionIterator iterator = bIPClassificationObject.getExpansionIterator(context, expandParams);
				while (iterator.hasNext()) {
					RelationshipWithSelect connectionInfo = iterator.next();
					childCurrentState = connectionInfo.getTargetSelectData(SELECT_CURRENT);
					if (stateMapping.get(childCurrentState) > stateMapping.get(newState) && (!"Obsolete".equals(childCurrentState) && !"Active".equals(newState))) {
						retValue = 1;
						if (type.equals(TYPE_GENERAL_CLASS)) {
							emxContextUtil_mxJPO.mqlNotice(context,
									EnoviaResourceBundle.getProperty(context,
											"emxLibraryCentralStringResource",
											context.getLocale(),
											"emxLibraryCentral.Message.MsgClassDemoteNotAllowed"));
						} else {
							emxContextUtil_mxJPO.mqlNotice(context,
									EnoviaResourceBundle.getProperty(context,
											"emxLibraryCentralStringResource",
											context.getLocale(),
											"emxLibraryCentral.Message.MsgLibraryDemoteNotAllowed"));
						}
						break;
					}
				}
				iterator.close();
			}
			bIPClassificationObject.close(context);
		}
		return retValue;
	}

	/**
	 * To check if Class can be MOVED to another Class or Library based on the target object state.
	 * 
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds the following list of arguments:
	 *    0 - TOTYPE
	 *    1 - TOOBJECTID
	 *    2 - FROMOBJECTID
	 *    3 - FROMTYPE 
	 * @return 0 if connection can be created to allow MOVE class. Otherwise, non-zero
	 *         value will be returned.
	 * @throws Exception if operation fails.
	 * @since R2024x FD01
	 */
	public int checkAllowClassMove(Context context, String[] args) throws Exception {
		int retValue = 0;

		String toType = args[0];
		String fromType = args[3];
		if (toType.equals(TYPE_GENERAL_CLASS) && (fromType.equals(TYPE_GENERAL_CLASS) || fromType.equals(TYPE_GENERAL_LIBRARY))) {
			String toObjectId = args[1];
			String fromObjectId = args[2];

			StringList oidList = new StringList();
			oidList.add(fromObjectId);
			oidList.add(toObjectId);

			StringList objectSelects = new StringList();
			objectSelects.add(SELECT_CURRENT);
			objectSelects.add(SELECT_ID);
			objectSelects.add("attribute["+LibraryCentralResourceConstants.ATTRIBUTE_ClassUsage+"]");
			objectSelects.add("attribute["+LibraryCentralResourceConstants.ATTRIBUTE_LibraryUsage+"]");


			//Retrieve from and to object information
			BusinessObjectWithSelectList busObjInfoList = BusinessObject.getSelectBusinessObjectData(context, oidList, objectSelects, false);

			Map<String, String> infoMap = new HashMap<>();
			Map<String, String> usageMap = new HashMap<>();
			for (BusinessObjectWithSelect busObjInfo : busObjInfoList) {
				String sUsage = busObjInfo.getSelectData("attribute["+LibraryCentralResourceConstants.ATTRIBUTE_ClassUsage+"]");
				if(UIUtil.isNullOrEmpty(sUsage)) {
					sUsage = busObjInfo.getSelectData("attribute["+LibraryCentralResourceConstants.ATTRIBUTE_LibraryUsage+"]");
				}
				infoMap.put(busObjInfo.getSelectData(SELECT_ID), busObjInfo.getSelectData(SELECT_CURRENT));
				usageMap.put(busObjInfo.getSelectData(SELECT_ID), sUsage);
			}

			String fromState = infoMap.get(fromObjectId);
			String toState = infoMap.get(toObjectId);
			String fromUsage = usageMap.get(fromObjectId);
			String toUsage = usageMap.get(toObjectId);
			if (stateMapping.get(fromState) < stateMapping.get(toState) && (!"Obsolete".equals(toState) || ("Obsolete".equals(toState) && "Inactive".equals(fromState)))) {
				retValue = 1;
				/*${CLASS:emxContextUtil}.mqlNotice(context,
                                               EnoviaResourceBundle.getProperty(context,
                                                                                "emxLibraryCentralStringResource",
                                                                                context.getLocale(),
                                                                                "emxLibraryCentral.Message.MsgMoveClassNotAllowed"));*/
				throw new FrameworkException(EnoviaResourceBundle.getProperty(context,
						"emxLibraryCentralStringResource",
						context.getLocale(),
						"emxLibraryCentral.Message.MsgMoveClassNotAllowed"));
			}
			else if ( UIUtil.isNotNullAndNotEmpty(fromUsage) && !fromUsage.equals(toUsage)) {
				retValue = 1;
				/*${CLASS:emxContextUtil}.mqlNotice(context,
                                               EnoviaResourceBundle.getProperty(context,
                                                                                "emxLibraryCentralStringResource",
                                                                                context.getLocale(),
                                                                                "emxLibraryCentral.Message.Usage.MsgMoveClassNotAllowed"));*/

				throw new FrameworkException(EnoviaResourceBundle.getProperty(context,
						"emxLibraryCentralStringResource",
						context.getLocale(),
						"emxLibraryCentral.Message.Usage.MsgMoveClassNotAllowed"));
			}
		}
		return retValue;
	}
	/**
	 * Update the count attribute of General Class for different use cases as required.
	 * 
	 * @param context the eMatrix Context object
	 * @param args history records of General Class.
	 * @since  R2024x FD02 The algorithm to update Count is changed to improve efficiency.
	 * @exception Exception if operation fails.
	 */
	public void updateCountOnTransaction(Context context, String[] args) throws Exception {
		String transactionHistory = args[0];
		String[] transactionRecords = transactionHistory.split("\n");

		//Cache to be used to keep track of content count
		Map<String, Integer> contentCountCache = new HashMap<>();

		//Data Structure used to hold GeneralClassIds and their Mapping with corresponding operation.
		Set<String> disconnectOpGeneralClasss = new HashSet<>();
		Set<String> connectOpGeneralClasss = new HashSet<>();
		Map<String, Object> GeneralClassOperationMap = new HashMap<>();

		String GeneralClassId = null;
		int count =0;
		boolean sortAttributeFlag = false;

		/*
		 * Load :
		 * - Cache with all the GeneralClasss (ID) involved in transaction with the number of content added/removed.
		 *      OR
		 * - Map with GeneralClass operation with the GeneralClassIds on which operation performed.
		 */
		for (String record : transactionRecords) {
			if (record.startsWith("id=")) {
				if (GeneralClassId!=null && count!=0) {
					contentCountCache.put(GeneralClassId, count);
					count=0;
				}
				GeneralClassId = record.substring("id=".length());
			} else {
				//Update Count when Content is involved in Transaction.
				if (record.contains("disconnect Classified Item to")) {
					count--;
				} else if (record.contains("connect Classified Item to")) {
					count++;
				}
				/*
				 * Either subGeneralClass is CREATED OR MOVED to Destination (GeneralClass is connected).
				 * MOVE needs to be covered.
				 */
				else if (record.contains("connect Classified Item to") && !record.contains("history added to identify actual user")) {
					connectOpGeneralClasss.add(GeneralClassId);
					GeneralClassOperationMap.put("C", connectOpGeneralClasss);
				}
				else if (record.contains("connect Subclass to") || record.contains("connect Subclass from General Class")) {
					sortAttributeFlag = true;
				}
			}
		}

		if (count!=0) {
			contentCountCache.put(GeneralClassId, count);
		}

		/*
		 * Update Count attribute when content is involved in transaction.
		 */
		if (!contentCountCache.isEmpty()) {
			updateContentCount(context, contentCountCache);
		}
	}

	/**
	 * Update Count attribute when content is directly involved in a transaction
	 * 
	 * @param context the eMatrix Context object.
	 * @param contentCountCache Map containing Count against a given GeneralClassId.
	 * @throws Exception if operation fails.
	 * @since R2024x GFD02 to make updateCountOnTransaction() method look clean.
	 */
	private void updateContentCount(Context context, Map<String, Integer> contentCountCache) throws Exception {
		Set<String> GeneralClassIdSet = contentCountCache.keySet();
		String[] objectIds = GeneralClassIdSet.toArray(new String[GeneralClassIdSet.size()]);

		//objectSelects required to get the existing Count values
		StringList objectSelects = new StringList();
		objectSelects.add(SELECT_ID);
		objectSelects.add(SELECT_ATTRIBUTE_COUNT);

		//Single DB call to retrieve existing value of Count attribute for all GeneralClasss involved in transaction
		MapList GeneralClassContentCount = DomainObject.getInfo(context, objectIds, objectSelects);

		//A temporary cache is required to retrieve the Number of content objects added/removed to GeneralClasss [COPY scenario]
		Map<String, Integer> tempCache = new HashMap<>(contentCountCache);

		//Update Cache with all the GeneralClasss in the hierarchy
		int count =0;
		String GeneralClassId = null;
		for (int i=0;i<GeneralClassContentCount.size();i++) {
			Map<?,?> GeneralClassMap = (Map<?,?>)GeneralClassContentCount.get(i);
			GeneralClassId = (String)GeneralClassMap.get(SELECT_ID);
			//Update GeneralClasss in Cache with 'existing count value' + 'number of content objects added/removed in given transaction'
			contentCountCache.put(GeneralClassId,  contentCountCache.get(GeneralClassId) +
					Integer.parseInt((String)GeneralClassMap.get(SELECT_ATTRIBUTE_COUNT)));

			DomainObject GeneralClass = new DomainObject(GeneralClassId);
			MapList parentGeneralClasssList = GeneralClass.getRelatedObjects(context,
					LibraryCentralConstants.RELATIONSHIP_SUBCLASS,
					LibraryCentralConstants.QUERY_WILDCARD,
					objectSelects,
					null,
					true,
					false,
					(short)0,
					null,
					null,
					0, null, null, null);
			String parentGeneralClassId =null;
			count = tempCache.get(GeneralClassId);
			for (int j=0;j<parentGeneralClasssList.size();j++) {
				Map<?,?> parentGeneralClassMap = (Map<?,?>)parentGeneralClasssList.get(j);
				parentGeneralClassId = (String)parentGeneralClassMap.get(SELECT_ID);
				if (contentCountCache.containsKey(parentGeneralClassId)) {
					contentCountCache.put(parentGeneralClassId, contentCountCache.get(parentGeneralClassId) + count);
				} else {
					contentCountCache.put(parentGeneralClassId, Integer.parseInt((String)parentGeneralClassMap.get(SELECT_ATTRIBUTE_COUNT)) + count);
				}
			}
		}

		//Update Count of all GeneralClasss from the Cache
		GeneralClassIdSet = contentCountCache.keySet();
		DomainObject GeneralClass = null;
		boolean isContextPushed = false;
		try {
			ContextUtil.pushContext(context);
			isContextPushed = true;
			for (String id : GeneralClassIdSet) {
				GeneralClass = new DomainObject(id);
				count = contentCountCache.get(id);
				GeneralClass.setAttributeValue(context, ATTRIBUTE_COUNT, String.valueOf(count));
			}
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		finally {
			if(isContextPushed) {
				ContextUtil.popContext(context);
			}
		}
	}
}
