/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLInterface;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.gs1assembly.GS1ArtworkContent;
import com.matrixone.apps.awl.gs1assembly.GS1Assembly;
import com.matrixone.apps.awl.gs1assembly.GS1TenantCacheUtil;
import com.matrixone.apps.awl.gs1assembly.GS1Util;
import com.matrixone.apps.awl.preferences.NutritionFactsConfiguration;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPreferences;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.ArtworkElementUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.common.util.ComponentsUtil;
import com.matrixone.apps.cpd.dao.Country;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIRTEUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;
import matrix.util.StringUtils;

@SuppressWarnings({"PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods"})
public class AWLCopyElementUIBase_mxJPO extends AWLObject_mxJPO
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 5754028721819296065L;
	private static final String[] CHECK_AWL = {"ENO_AWL_TP"};
	private static final String[] CHECK_AWE = {"ENO_AWE_TP", "ENO_AWL_TP"};
	
	public AWLCopyElementUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getActiveLocalElementsStructure(Context context, String[] args)	throws FrameworkException 
	{
		try {
			Map programMap = (HashMap) JPO.unpackArgs(args);
			String strObjectId = (String)  programMap.get(AWLConstants.OBJECT_ID);
			ArtworkMaster artworkMaster = new ArtworkMaster(strObjectId);
			
			return artworkMaster.isStructuredElementRoot(context) ? 
					artworkMaster.getStructuredElementList(context) :
						artworkMaster.getArtworkElements(context, null, null, null);
			
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getStructredElementLocalCopies(Context context, String[] args)	throws FrameworkException 
	{
		try {
			Map programMap = (HashMap) JPO.unpackArgs(args);
			String strObjectId = (String)  programMap.get(AWLConstants.OBJECT_ID);
			
			if(BusinessUtil.isKindOf(context, strObjectId, AWLType.MASTER_COPY_ELEMENT.get(context)) && new ArtworkMaster(strObjectId).isStructuredElement(context))
				return new ArtworkMaster(strObjectId).getArtworkElements(context, null, null, null) ;
			else 
				return new MapList();
			
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	
	public MapList getActiveArtworkMastersStructure(Context context, String[] args)	throws FrameworkException 
	{
		try {
			Map programMap = (HashMap) JPO.unpackArgs(args);
			String strObjectId = (String)  programMap.get("objectId");
			DomainObject dobj =new DomainObject(strObjectId);		    
			MapList mList = dobj.getRelatedObjects(context, "Artwork Elements Master", "Artwork Master", new StringList(DomainConstants.SELECT_ID), new StringList(), true, false, (short)0, "", "",0);
			return mList;
		} catch (Exception e) {	throw new FrameworkException(e); }

	}
	
	//using AWLPreferences.getSystemBaseLanguage instead of getDefaultPreferenceLanguage(deprecated method)
	public StringList getAllAvailableLanguageNames(Context context, String args[]) throws FrameworkException
	{
		MapList objects = DomainObject.findObjects(context, 
				   AWLType.LOCAL_LANGUAGE.get(context),
				   null, 
				   "-",
				   null, AWLPropertyUtil.getVaultsForFindObjects(context), 
				   "current==Active",
				   false, new StringList(SELECT_NAME));
		
		String preferanceLanguage = AWLPreferences.getSystemBaseLanguage(context);
		StringList names = BusinessUtil.toStringList(objects, SELECT_NAME);
		names.remove(preferanceLanguage);
		Collections.sort(names);
		names.insertElementAt(preferanceLanguage, 0);
		return names;
	}

	public boolean isActiveLocalCopy(Context context, String[] args) throws FrameworkException {
		try {
			HashMap paramMap = (HashMap)JPO.unpackArgs(args);
			String objectId = (String)paramMap.get(AWLConstants.OBJECT_ID);
			
			String IS_MASTER_ARTWORK_ELEMENT = AWLUtil.strcat("type.kindof[" , AWLType.MASTER_ARTWORK_ELEMENT.get(context) , "]");
			String ATTR_INLINE_TRANSLATION = AWLAttribute.INLINE_TRANSLATION.getSel(context);
			String ATTR_TRANSLATE = AWLAttribute.TRANSLATE.getSel(context);
			String PROP_INTERFACE_STRUCTMASTER =AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			String IS_STRUCTURE = AWLUtil.strcat("to[", AWLRel.STRUCTURED_ARTWORK_MASTER.get(context), "].id");
			
			StringList objectSelects = BusinessUtil.toStringList(IS_MASTER_ARTWORK_ELEMENT,
																 ATTR_INLINE_TRANSLATION, 
																 ATTR_TRANSLATE, 
																 PROP_INTERFACE_STRUCTMASTER,
																 IS_STRUCTURE);
			
			Map artworkMasterInfo = BusinessUtil.getInfo(context, objectId, objectSelects);
					
			if("false".equalsIgnoreCase((String)artworkMasterInfo.get(IS_MASTER_ARTWORK_ELEMENT)))
				return false;

			boolean isTranslationElement = AWLConstants.RANGE_YES.equalsIgnoreCase((String)artworkMasterInfo.get(ATTR_TRANSLATE));
			boolean isInlineTranslationElement = AWLConstants.RANGE_YES.equalsIgnoreCase((String)artworkMasterInfo.get(ATTR_INLINE_TRANSLATION));
			boolean isStructuredElement = BusinessUtil.isNotNullOrEmpty((String)artworkMasterInfo.get(IS_STRUCTURE));
			
			return isTranslationElement && !isInlineTranslationElement &&  !isStructuredElement;

		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	/**
	 * Returns CopyText from CopyContent
	 *
	 * @param   context   - the enovia <code>Context</code> object
	 * @param   args      - String[] - JPO packed arguments
	 * @return  Vector    - list of CopyText
	 * @throws  Exception - if operation fails
	 */
	public StringList getCopyTextForLC(Context context, String[] args)throws FrameworkException
	{
		try {
			//This program should not return programHTMLOutput
			Map programMap          = (Map)JPO.unpackArgs(args);
			Map paramMap = BusinessUtil.getRequestParamMap(programMap);
			String reportFormat = BusinessUtil.getString(paramMap, "reportFormat");
			MapList objectList      = BusinessUtil.getObjectList(programMap);
			StringList copyIdList   = BusinessUtil.getIdList(objectList);
			StringList copyText = new StringList(copyIdList.size());
			for (Iterator iterator = copyIdList.iterator(); iterator.hasNext();) {
				String copyId = (String) iterator.next();
				CopyElement copy = new CopyElement(copyId);
				copyText.add(copy.getCopyText(context, reportFormat));
			}
			return copyText;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}

	public boolean isTranslate (Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap paramMap = (HashMap)JPO.unpackArgs(args);
			String cpElementId = (String)paramMap.get(AWLConstants.OBJECT_ID);

			CopyElement copyElement = new CopyElement(cpElementId);
			String lastCopyId       = copyElement.getLastRevision(context).getObjectId(context);
			CopyElement lastCopy  = new CopyElement(lastCopyId);
			ArtworkMaster master = lastCopy.getArtworkMaster(context);
			return master.isTranslationElement(context);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	/** 
	 * Below function  is update function  will get updated copy text of  Master copy Element
	 */
	public int updateCopyTextForLocalCopy(Context context, String[] args)  throws FrameworkException
	{
		try {
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map paramMap = (HashMap) programMap.get(AWLConstants.paramMap);
			
			String cpId = (String)paramMap.get(AWLConstants.OBJECT_ID);
			CopyElement copyElement = new CopyElement(cpId);
			
			String copyText = (String)paramMap.get("New Value");
			copyElement.setCopyText(context, copyText);
			return 0;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	/*
	 * Below program will get copy text of  Local copy  to display in web form for view  and edit mode
	 */
	public  String getCopyTextForLocalCopy(Context context, String[] args) throws FrameworkException
	{
		try {
			//This program "should not" return programHTMLOutput
			Map programMap = (Map) JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			String cpId=(String)mpRequest.get(AWLConstants.OBJECT_ID);
			CopyElement copyElement=new CopyElement(cpId);
			return copyElement.getCopyText(context, true);
		} catch (Exception e) {	throw new FrameworkException(e); }
	}

	public int updateApprovingRouteTemplates(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap progMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) progMap.get(AWLConstants.paramMap);
			String objectId = (String) paramMap.get(AWLConstants.OBJECT_ID);

			String strNewApprovalRouteId = (String) paramMap.get("New OID");
			strNewApprovalRouteId = strNewApprovalRouteId == null ? "" : strNewApprovalRouteId;

			CopyElement domLocalCopy = new CopyElement(objectId);
			domLocalCopy.updateAssignee(context, null, strNewApprovalRouteId);
			return 0;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	public int updateAuthoringRouteTemplates(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap progMap = (HashMap) JPO.unpackArgs(args);
			HashMap paramMap = (HashMap) progMap.get(AWLConstants.paramMap);
			String objectId = (String) paramMap.get(AWLConstants.OBJECT_ID);

			String strNewApprovalRouteId = (String) paramMap.get("New OID");
			strNewApprovalRouteId = strNewApprovalRouteId == null ? "" : strNewApprovalRouteId;

			CopyElement domLocalCopy = new CopyElement(objectId);
			domLocalCopy.updateAssignee(context, strNewApprovalRouteId, null);
			return 0;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}	

	public String displayAuthoringName(Context context, String[] args) throws FrameworkException
	{
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get(AWLConstants.paramMap);
			String cpId = (String) paramMap.get(AWLConstants.OBJECT_ID);
			CopyElement copyElement = new CopyElement(cpId);
			return copyElement.getAuthoringAssigneeName(context);
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	public String displayApprovalName(Context context, String[] args) throws FrameworkException
	{
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get(AWLConstants.paramMap);
			String cpId = (String) paramMap.get(AWLConstants.OBJECT_ID);
			CopyElement copyElement = new CopyElement(cpId);
			return copyElement.getApprovalAssigneeName(context);
		} catch (Exception e) {	throw new FrameworkException(e); }
	}	

	public StringList getCurrentCopyText(Context context, String[] args) throws FrameworkException
	{
		try
		{
			//This program should not return programHTMLOutput
			//used in program columns
			Map programMap        = (Map)JPO.unpackArgs(args);
			MapList objectList    = BusinessUtil.getObjectList(programMap);
			Map columnMap         = BusinessUtil.getColumnMap(programMap);
			String colLanguage    = BusinessUtil.getString(columnMap, AWLConstants.COLUMN_LANGUAGE);
			String langIdKey      = AWLUtil.strcat(SELECT_ID, colLanguage);
			Map paramMap      = BusinessUtil.getRequestParamMap(programMap);
			String reportFormat = BusinessUtil.getString(paramMap, "reportFormat");

			StringList copyIdList = BusinessUtil.toStringList(objectList, langIdKey);
			StringList newValueList = new StringList(copyIdList.size());
			for (int i = 0; i < copyIdList.size(); i++) {
				String id = (String) copyIdList.get(i);
				//For Translate = No in local copy page
				if(BusinessUtil.isNullOrEmpty(id)) {
					newValueList.add("");
					continue;
				}
				ArtworkContent ae = ArtworkContent.getNewInstance(context, id);
				if(ae.isCopyElement()) {
					newValueList.add(((CopyElement)ae).getCopyText(context, reportFormat));
				} else {
					newValueList.add("");
				}
			}
			return newValueList;
			
		} catch (Exception e) {	throw new FrameworkException(e); }
	}

	public boolean updateCopyTextValue(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap 		= (Map)JPO.unpackArgs(args);
			Map paramMap  		= BusinessUtil.getParamMap(programMap);
			String copyId  	    = BusinessUtil.getObjectId(paramMap);
			CopyElement copyElement = new CopyElement(copyId);
			String masterId  = BusinessUtil.getInfo(context, copyId, AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.id"));
			String value  =  BusinessUtil.getString(paramMap, AWLConstants.NEW_VALUE);
			if(ArtworkContent.isCompositeCopyElement(context, masterId)) {
				HashMap<String, String> compositeElementData = new HashMap<String, String>();
				//May be copy text also contains all the special characters, so we are using the strong pattern to separate the values 
				//StringList requestValueList = FrameworkUtil.split(value,"~#~");
				 String[] requestValueList = StringUtils.split(value, "~#~");
				if(requestValueList != null && requestValueList.length > 2)
			    {
					String strListItemSequence  = requestValueList[0];
					String coMpositecopyTextValue  = requestValueList[1];
					String strListSeparator	    = requestValueList[2];
					compositeElementData.put("listSeparator", strListSeparator);
					compositeElementData.put("listItemSequence", strListItemSequence);
					compositeElementData.put("txtFeatureMarketingText", coMpositecopyTextValue);
					compositeElementData.put("masterId", masterId);
					//ArtworkMaster artworkMaster = new ArtworkMaster(masterId);
					copyElement.updateCompositeCopyText(context, compositeElementData);
			    } else {
			    	//this case when user does not use the list item.
			    	copyElement.setCopyText(context, value);
			    }
				
			}else {
				copyElement.setCopyText(context, value);
			}
			

		} catch (Exception e) {	throw new FrameworkException(e); }
		return true;
	}

	/** 
	* @author bv8
	* To show Search and Add/Remove command in build from list page of  composite Copy Element
	*/	
	public boolean enableCompositeCopyListCommands(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectID = BusinessUtil.getObjectId(programMap);
			boolean hasModifyAccess = false;
			boolean hasCreateAccess = false;
			if(Access.isMasterCopyAuthor(context) || Access.isProductManager(context) || Access.isArtworkProjectManager(context)) {
				hasCreateAccess = true;
			}
			if(BusinessUtil.isNotNullOrEmpty(objectID)) {
				boolean modifyORRevise = (FrameworkUtil.hasAccess(context, new DomainObject(objectID), "modify") || 
						FrameworkUtil.hasAccess(context, new DomainObject(objectID), "revise"));
				hasModifyAccess = modifyORRevise && ArtworkElementUtil.isBaseCoy(context, objectID);
			} else {
				hasModifyAccess = hasCreateAccess;
			}
			return hasModifyAccess;
			
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	public boolean isNonStructuredElementRootType(Context context, String[] args) throws FrameworkException {
		return !isStructuredElementRootType(context, args);
	}
	
	public boolean isStructuredElementRootType(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = JPO.unpackArgs(args);
			//System.out.println("-------------UNPACKARGS=" + programMap.toString());
			String objectId = BusinessUtil.getString(programMap, AWLConstants.OBJECT_ID);
			String mode = BusinessUtil.getString(programMap, "mode");
			//System.out.println("-------------MODEEEE1=" + mode);
			if(mode.equalsIgnoreCase("edit"))
				return true;

			String elementType = BusinessUtil.getString(programMap, SELECT_TYPE);

			if((BusinessUtil.isNullOrEmpty(elementType) || elementType.equalsIgnoreCase(QUERY_WILDCARD)) && BusinessUtil.isNotNullOrEmpty(objectId))
				elementType = BusinessUtil.getInfo(context, objectId, SELECT_TYPE);

			if(BusinessUtil.isNotNullOrEmpty(elementType) && elementType.startsWith("_selectedType:")) {
				elementType = elementType.substring(elementType.indexOf(':')+1,elementType.indexOf(','));
			}
			
			//If type received is of symbolic name, we are getting the actual type.
			if(elementType.startsWith("type_"))
				elementType = AWLPropertyUtil.getTypeI18NString(context, elementType, true);

			return AWLPropertyUtil.isStructuredElementRootType(context, elementType, false);

		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public boolean isStructuredElementRootTypeEdit(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = JPO.unpackArgs(args);
			//System.out.println("-------------UNPACKARGS=" + programMap.toString());
			String objectId = BusinessUtil.getString(programMap, AWLConstants.OBJECT_ID);
			String mode = BusinessUtil.getString(programMap, "mode");
			//System.out.println("-------------MODEEEE2=" + mode);
			if(!mode.equalsIgnoreCase("edit"))
				return false;

			String elementType = BusinessUtil.getString(programMap, SELECT_TYPE);

			if((BusinessUtil.isNullOrEmpty(elementType) || elementType.equalsIgnoreCase(QUERY_WILDCARD)) && BusinessUtil.isNotNullOrEmpty(objectId))
				elementType = BusinessUtil.getInfo(context, objectId, SELECT_TYPE);

			if(BusinessUtil.isNotNullOrEmpty(elementType) && elementType.startsWith("_selectedType:")) {
				elementType = elementType.substring(elementType.indexOf(':')+1,elementType.indexOf(','));
			}
			
			//If type received is of symbolic name, we are getting the actual type.
			if(elementType.startsWith("type_"))
				elementType = AWLPropertyUtil.getTypeI18NString(context, elementType, true);

			return !(AWLPropertyUtil.isStructuredElementRootType(context, elementType, false));

		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}

	public boolean isNonCompositeStructuredRootElementType(Context context, String[] args) throws FrameworkException {
		return isNonCompositeType(context, args) && isNonStructuredElementRootType(context, args);
	}
	
	public boolean isNonCompositeType(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap hm = JPO.unpackArgs(args);
			String type = BusinessUtil.getString(hm, SELECT_TYPE);
			if(BusinessUtil.isNotNullOrEmpty(type)) {
				if(type.startsWith("_selectedType:")) {
					type = type.substring(type.indexOf(':')+1,type.indexOf(','));
				}
				String eligibleType=  AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.compositeMasterCopy.EligibleTypes", AWLConstants.EMPTY_STRING);
				eligibleType = PropertyUtil.getSchemaProperty(context, eligibleType);
				if(type.equalsIgnoreCase(eligibleType)) {
					return false;
				}
			}
		    return true;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	public boolean isCompositeType(Context context, String[] args) throws FrameworkException
	{
		return !isNonCompositeType(context, args);
	}
	
	public List getListSeparators(Context context, String[] args) throws FrameworkException
	{
		StringList sl = new StringList();
		String strListSeparator = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.ListItem.Seperator", AWLConstants.EMPTY_STRING);
		String listSeparator[] = strListSeparator.split("#");
		for(String separator :listSeparator){
			if (!separator.equals(EMPTY_STRING)){
				sl.add(separator);
			}
		}
		return sl;
	}
	
	//Modified by N94 during POA Simplification Highlight in R418
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map createMasterCopyElement(Context context, String[] args) throws FrameworkException 
	{
		try 
		{
			ComponentsUtil.checkLicenseReserved(context, CHECK_AWL);
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			
			Map<String, String> copyElementData = new HashMap<String, String>();			
			String strType = BusinessUtil.getString(programMap, "TypeActual");			
			copyElementData.put(DomainConstants.SELECT_TYPE, strType);
			//copyElementData.put(DomainConstants.SELECT_DESCRIPTION, request.getParameter("txtFeatureDescription"));
			copyElementData.put(AWLAttribute.MARKETING_NAME.get(context), BusinessUtil.getString(programMap, "DisplayName"));
			copyElementData.put(AWLAttribute.DISPLAY_TEXT.get(context), BusinessUtil.getString(programMap, "CopyText"));
			copyElementData.put(AWLAttribute.TRANSLATE.get(context), BusinessUtil.getString(programMap, "Translate"));
			copyElementData.put(AWLAttribute.INLINE_TRANSLATION.get(context), BusinessUtil.getString(programMap, "InlineTranslation"));
			copyElementData.put(AWLAttribute.BUILD_LIST.get(context), BusinessUtil.getString(programMap, "BuildFromList"));
			copyElementData.put("listSeparator", BusinessUtil.getString(programMap, "ListSeparator"));
			copyElementData.put("listItemSequence", BusinessUtil.getString(programMap, "listItemSequence"));
			copyElementData.put("listItemId", BusinessUtil.getString(programMap, "listItemId"));
			
			//This is for creating element from POA Edit screen. 
			//get product and poa id and connect newly created element with product or product line and with POA
			//Searching origin from Search or type ahead will add object id to AssociatedToOID
			List<String> placeOfOriginIDs =  FrameworkUtil.split(BusinessUtil.getString(programMap, "PlaceOfOriginOID"), ",");
			String selectedPOAId =  BusinessUtil.getString(programMap, AWLConstants.SELECTED_POA_ID);
			if(BusinessUtil.isNotNullOrEmpty(selectedPOAId))
			{
				//On loading AssociatedToOID will not have object id hence reload program is written and AssociatedTo will have object id.
				if(BusinessUtil.isNullOrEmpty(placeOfOriginIDs))
				{
					placeOfOriginIDs =  FrameworkUtil.split(BusinessUtil.getString(programMap, "PlaceOfOrigin"), ",");
				}
			}
			
			//Continuation of behavior from other navigation except POA Edit
			//context object will be treated as place-of origin		
			if(BusinessUtil.isNullOrEmpty(placeOfOriginIDs))
			{
				// In CPG Product/Brand  - Artwork Elements Tab -  Consider always parentOID.
				String placeOfOriginId = BusinessUtil.getString(programMap, AWLConstants.PARENT_OID);
				if(BusinessUtil.isNullOrEmpty(placeOfOriginId))
				{
					// In Other Cases.
					placeOfOriginId = BusinessUtil.getString(programMap, AWLConstants.OBJECT_ID);
				}
				if(BusinessUtil.isNotNullOrEmpty(placeOfOriginId))
					placeOfOriginIDs.add(placeOfOriginId);
			}
			
			//Removing unnecessary white spaces and nulls in the list.
			placeOfOriginIDs.removeAll(Arrays.asList(null,""));
			
			DomainObject placeOfOriginOBJ = BusinessUtil.isNotNullOrEmpty(placeOfOriginIDs) ? new DomainObject(placeOfOriginIDs.get(0)) : null;
			ArtworkMaster am = ArtworkMaster.createMasterCopyElement(context, strType, copyElementData, placeOfOriginOBJ, new ArrayList<Country>());
			
			if(BusinessUtil.isNotNullOrEmpty(placeOfOriginIDs)) 
			{
				placeOfOriginIDs.remove(0);
				for (String placeOfOriginID : placeOfOriginIDs) 
				{
					DomainRelationship rel = am.connectFrom(context, AWLRel.ARTWORK_MASTER, new DomainObject(placeOfOriginID));
					rel.setAttributeValue(context, AWLAttribute.PLACE_OF_ORIGIN.get(context), AWLConstants.RANGE_YES);
				}
			}
			
			String masterId = am.getId(context);
			HashMap map = new HashMap(1);
			map.put(SELECT_ID, masterId);
			
			return map;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map createMasterCopyElementForGS1(Context context, String[] args) throws FrameworkException 
	{
		try 
		{
			ComponentsUtil.checkLicenseReserved(context, CHECK_AWL);
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			HashMap requestValueMap = (HashMap)programMap.get("RequestValuesMap");
			
			Map<String, String> copyElementData = new HashMap<String, String>();			
			String strType = BusinessUtil.getString(programMap, "TypeActual");			
			copyElementData.put(DomainConstants.SELECT_TYPE, strType);
			copyElementData.put(AWLAttribute.MARKETING_NAME.get(context), BusinessUtil.getString(programMap, "DisplayName"));
			
			boolean isStructure = AWLConstants.RANGE_TRUE.equalsIgnoreCase(BusinessUtil.getString(programMap, "isStructure"));
			
			String displayText = BusinessUtil.getString(programMap, "CurrentCopyText");
			displayText = BusinessUtil.isNullOrEmpty(displayText)?BusinessUtil.getString(programMap, "MasterArtworkCopyText"):displayText;
			String selectedLanguage=  BusinessUtil.getString(programMap, AWLConstants.SELECTED_LANGUAGE);
			if(BusinessUtil.isNullOrEmpty(selectedLanguage)) {
				String[] selectedInlineLang = (String[])requestValueMap.get(AWLConstants.SELECTED_LANGUAGE_FOR_INLINE);
				if(selectedInlineLang != null){
					selectedLanguage =  FrameworkUtil.join(selectedInlineLang,AWLConstants.LANGUAGE_SEPARATOR);
				}
			}
			
			copyElementData.put(AWLAttribute.DISPLAY_TEXT.get(context), displayText);
			copyElementData.put(AWLAttribute.TRANSLATE.get(context), BusinessUtil.getString(programMap, "Translate"));
			copyElementData.put(AWLAttribute.INLINE_TRANSLATION.get(context), BusinessUtil.getString(programMap, "InlineTranslation"));
			copyElementData.put("listItemSequence", BusinessUtil.getString(programMap, "InstanceSequence"));
			String placeOfOrgID = BusinessUtil.getString(programMap, "PlaceOfOriginOID");
			placeOfOrgID =  BusinessUtil.isNullOrEmpty(placeOfOrgID)?BusinessUtil.getString(programMap, AWLConstants.PLACE_OF_ORG_OID):placeOfOrgID;
			
			String selectedPOAId=  BusinessUtil.getString(programMap, AWLConstants.SELECTED_POA_ID);
			POA poaObject = new POA(selectedPOAId);
			
			ArtworkMaster artworkMaster = ArtworkMaster.createMasterCopyElement(context, strType, copyElementData, DomainObject.newInstance(context,placeOfOrgID), new ArrayList<Country>());
			
			if(AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)programMap.get(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG)) && !isStructure){
				CopyElement copyElement = artworkMaster.fetchLocalCopyElement(context,selectedLanguage);
				copyElement.setCopyText(context, BusinessUtil.getString(programMap, "CopyText"));
			}
			
			if(isStructure)
				poaObject.addArtworkMaster(context, artworkMaster);
			else
				poaObject.addLocalCopiesToPOA(context, artworkMaster, BusinessUtil.toStringList(selectedLanguage));
			
			if(!AWLConstants.RANGE_FALSE.equalsIgnoreCase(BusinessUtil.getString(programMap, AWLConstants.USE_INSTANCESEQ_FROM_RES))) {
				poaObject.setInstanceSequence(context, artworkMaster, Integer.parseInt(BusinessUtil.getString(programMap, "InstanceSequence")));	
			}
			
			HashMap map = new HashMap(1);
			map.put(SELECT_ID, artworkMaster.getId(context));
			return map;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map createLocalCopyElementForGS1(Context context,String args[]) throws FrameworkException {
		try{
			ComponentsUtil.checkLicenseReserved(context, CHECK_AWE);
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(BusinessUtil.OBJECT_ID);
			String sLanguage = (String) programMap.get("Language");
			
			ArtworkMaster artworkMaster = new ArtworkMaster(objectId);
			CopyElement copyElement = artworkMaster.fetchLocalCopyElement(context, sLanguage);
			copyElement.setCopyText(context, BusinessUtil.getString(programMap, "CopyText"));
			String selectedPOAId=  BusinessUtil.getString(programMap, AWLConstants.SELECTED_POA_ID);
			POA poaObject = new POA(selectedPOAId);
			poaObject.addLocalCopiesToPOA(context, artworkMaster, BusinessUtil.toStringList(sLanguage));
			
			HashMap map = new HashMap();
			map.put(SELECT_ID, copyElement.getObjectId(context));
			return map;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	/**
	 * @deprecated since R2016x, relationship between Artwork Package and Artwork Element is no longer exist.
	 * @param context
	 * @param args
	 * @return
	 * @author N94
	 * @throws FrameworkException
	 */
	public Map autoCreateRange(Context context, String[] args) throws FrameworkException {
		HashMap m = new HashMap();
		m.put("field_choices", new StringList("true"));
	    m.put("field_display_choices", new StringList(AWLPropertyUtil.getI18NString(context, "emxAWL.Button.AutoCreate")));
		return m;
	}
	
	public String getListItem(Context context, String[] args) throws FrameworkException {
		String buildListTitle = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.SelectListItems");
		StringBuffer sb = new StringBuffer(600);
		sb.append("<input type='hidden' name='listItemSequence' value='' />")
			.append("<input type='hidden' name='addtionalInfo' value='' />")	
			.append("<input type='hidden' name='hidCopyTextList' value='' />")	
			.append("<input type='hidden' name='listItemId' value='' />");
      	sb.append("<a href='javascript:void(0);'><img src='../awl/images/AWLBuildFromList.gif' border='0' align='middle' title='").append(buildListTitle).append("' onclick='javascript:showListDialog(\"../awl/AWLBuildListDialogFS.jsp?fieldNameActual=CopyText&amp;fieldNameDisplay=CopyText&amp;fieldListItemName=listItemId&amp;fieldListItemDisplay=listItemId&amp;fieldSeparatorName=ListSeparator\");'/></a>");
      return sb.toString();
	}

	  /**
	   * Method to return the list of Languages to be excluded from the Sarach page.
	   * @param   context    - the Enovia <code>Context</code> object
	   * @param   args       -  Array of Arguments. 
	   * @return StringList with the list of type list on from or to of the given relationship
	   * @throws FrameworkException
	   * @author  Raghavendra M J (R2J)
	   */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeExistingContentLanguages(Context context, String args[]) throws FrameworkException
	{
		try
		{
			HashMap paramMap = (HashMap)JPO.unpackArgs(args);
			String objectId = (String) paramMap.get(BusinessUtil.OBJECT_ID);
			List<ArtworkContent> artworkContentIdList = new ArtworkMaster(objectId).getArtworkElementContent(context, EMPTY_STRING);
			StringList artworkElementList = new StringList(artworkContentIdList.size());
			  
			for(DomainObject artworkContent : artworkContentIdList)
				  artworkElementList.add(artworkContent.getObjectId(context));
			  
			StringList contentLanguagesIdList = BusinessUtil.getInfo(context, artworkElementList, AWLUtil.strcat("from[", AWLRel.CONTENT_LANGUAGE.get(context), "].to.id"));
			
			return contentLanguagesIdList;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map createLocalCopyElement(Context context, String[] args) throws FrameworkException
	{
		try
		{
			ComponentsUtil.checkLicenseReserved(context, CHECK_AWE);
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(BusinessUtil.OBJECT_ID);
			String sLanguage = (String) programMap.get("Language");
			
			ArtworkMaster artMaster = new ArtworkMaster(objectId);
			CopyElement copyElement = artMaster.fetchLocalCopyElement(context, sLanguage);
			/*String authoringRouteID = BusinessUtil.getString(programMap, "Authoring Route TemplateOID");
			String approverRouteID = BusinessUtil.getString(programMap, "Approval Route TemplateOID");
			copyElement.updateAssignee(context, authoringRouteID, approverRouteID);*/
			HashMap map = new HashMap();
			map.put(SELECT_ID, copyElement.getObjectId(context));
			return map;
		} catch (Exception e) {	throw new FrameworkException(e); }
	}
	
	public boolean canUpdateCopyTextValue(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String contentId = BusinessUtil.getObjectId(programMap);
			
			String MOD_ACCESS = "current.access[modify]";
			String REV_ACCESS = "current.access[revise]";
			String STATE_PRELIMINARY = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			String STATE_RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			String PROP_INTERFACE_STRUCTMASTER =AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.", AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context)); 

			StringList selectables = BusinessUtil.toStringList(SELECT_CURRENT, 
																MOD_ACCESS, 
																REV_ACCESS,  
																PROP_INTERFACE_STRUCTMASTER,
																STATE_PRELIMINARY,
																STATE_RELEASE);
			
			// Minimizing the DB Hits.
			Map artworkElementInfo = BusinessUtil.getInfo(context, contentId, selectables);
			
			String currentState = (String) artworkElementInfo.get(SELECT_CURRENT);
			boolean isPreliminary = currentState.equals(STATE_PRELIMINARY);
			boolean isRelease = currentState.equals(STATE_RELEASE);
			
			boolean canModify = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) artworkElementInfo.get(MOD_ACCESS));
			boolean canRevise = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) artworkElementInfo.get(REV_ACCESS));
			
			boolean canUpdateCopyText = false;
			
			if(isPreliminary && canModify) {
				canUpdateCopyText = true;
			} else if(isRelease && canRevise) {
				Map reviewTask   = RouteUtil.getReviewTaskToSubmit(context, contentId);
				if(reviewTask != null && !reviewTask.isEmpty())
					canUpdateCopyText = true;
			}
			
			boolean isStructuredElementRootType = AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)artworkElementInfo.get(PROP_INTERFACE_STRUCTMASTER));
			
			return canUpdateCopyText ? isStructuredElementRootType : canUpdateCopyText;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Post process API to create the Structured Elements under Element Root 
	 * @param   context    - the Enovia <code>Context</code> object
	 * @param   args       -  Array of Arguments.
	 * @throws FrameworkException
	 * @author Raghavendra M J
	 * @Since VR2018x Created during 'Nutrition Facts Highlight'
	 */
	
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void poaSyncAddStructureElementPostProcess(Context context, String[] args) throws FrameworkException 
	{
		try
		{
			final String INLINECOPY_LOCALSEQUENCE = AWLPropertyUtil.getInlineElementLocaleSequence(context);
			final String NO_TRANSLATE_LOCALSEQUENCE = AWLPropertyUtil.getNoTranslateElementLocaleSequence(context);
			Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			Map mParamMap = (Map) programMap.get(AWLConstants.paramMap);

			String poaId = (String) mpRequest.get(AWLConstants.SELECTED_POA_ID);
			POA poaObject = new POA(poaId);

			String rootStructureMasterElementId = (String)mParamMap.get("newObjectId");
			ArtworkMaster newArtworkMaster = new ArtworkMaster(rootStructureMasterElementId);

			String gs1ResponseElementKey = (String) mpRequest.get(AWLConstants.GS1_RESPONSE_ELEMENTKEY);
			GS1Assembly roundtrip  = new POA(poaId).getArtworkFile(context).getGS1Assembly(context);
			Map<String, String> structureCopyText = new HashMap<String, String>();
			if(roundtrip == null)
				return;
			List<GS1ArtworkContent> roundtripContentList= roundtrip.getArtworkContent();
			Map<String,GS1ArtworkContent> roundtripDataMap = GS1Util.getUniqueKeyMap(context,roundtripContentList);
			GS1ArtworkContent content = roundtripDataMap.get(gs1ResponseElementKey);

			if (content == null)
				return;

			List<GS1ArtworkContent> structureInfo = content.getStructureInfo();
			Map<String, ArtworkMaster> addedSubMastersByGS1Key = new HashMap();

			Set<String> subStructureTypeSet = new HashSet<String>();
			Set languagesToAdd = new HashSet<>();

			Map<Integer, Map> poaLanguagesMap = poaObject.getLanguageInfoByLocaleSeq(context);
			StringList poaLanguages = poaObject.getLanguageNames(context);

			StringList currentLangauges = new StringList();
			for (GS1ArtworkContent gs1ArtworkContent : structureInfo) {
				String localeSequence = gs1ArtworkContent.getLocaleSequence();

				if(!(INLINECOPY_LOCALSEQUENCE.equalsIgnoreCase(localeSequence) || NO_TRANSLATE_LOCALSEQUENCE.equalsIgnoreCase(localeSequence))){
					Map tempMap = (Map) poaLanguagesMap.get(Integer.parseInt(localeSequence));
					String currentLangauge = (String) tempMap.get(SELECT_NAME);
					currentLangauges.add(currentLangauge);
				}
			}

			for (GS1ArtworkContent gs1ArtworkContent : structureInfo) {

				String currentGS1Key = gs1ArtworkContent.getGs1Key();
				String elementType  = GS1TenantCacheUtil.getArtworkElementType(context, currentGS1Key);
				if(BusinessUtil.isNotNullOrEmpty(elementType))
					elementType = ArtworkMaster.getMasterArtworkElementType(context, elementType, false, false);
				String localeSequence = gs1ArtworkContent.getLocaleSequence();

				Map<String, String> copyStructureElementData = new HashMap<String, String>();
				if(elementType==null) {
					elementType = NutritionFactsConfiguration.getNutriFactConfigByGS1(context, currentGS1Key).getType();
					elementType = PropertyUtil.getSchemaProperty(context, elementType);
					if(AWLType.NUTRIENT_CODES_MASTER_COPY.get(context).equalsIgnoreCase(elementType) || AWLType.VITAMIN_CODES_MASTER_COPY.get(context).equalsIgnoreCase(elementType)) {
						copyStructureElementData.put("attributeRange", NutritionFactsConfiguration.getNutriFactConfigByGS1(context, currentGS1Key).getAttributeRange());
					}
				}

				boolean inlineOrNoTranslateSeq = INLINECOPY_LOCALSEQUENCE.equalsIgnoreCase(localeSequence) || NO_TRANSLATE_LOCALSEQUENCE.equalsIgnoreCase(localeSequence);

				Map currentLangInfoMap = (Map) poaLanguagesMap.get(Integer.parseInt(localeSequence));
				String currentLangauename = inlineOrNoTranslateSeq ? "" : (String) currentLangInfoMap.get(SELECT_NAME);

				if((subStructureTypeSet.contains(elementType) && !(inlineOrNoTranslateSeq)))
					continue;

				String strTranslate = NO_TRANSLATE_LOCALSEQUENCE.equalsIgnoreCase(localeSequence)?AWLConstants.RANGE_NO:AWLConstants.RANGE_YES;
				String strInline = INLINECOPY_LOCALSEQUENCE.equalsIgnoreCase(localeSequence)?AWLConstants.RANGE_YES:AWLConstants.RANGE_NO;

				copyStructureElementData.put(DomainConstants.SELECT_TYPE, elementType);
				copyStructureElementData.put(AWLAttribute.MARKETING_NAME.get(context), currentGS1Key);
				copyStructureElementData.put(AWLAttribute.DISPLAY_TEXT.get(context), "");
				copyStructureElementData.put(AWLAttribute.TRANSLATE.get(context), strTranslate);
				copyStructureElementData.put(AWLAttribute.INLINE_TRANSLATION.get(context),strInline);
				copyStructureElementData.put(AWLAttribute.BUILD_LIST.get(context), "");
				copyStructureElementData.put("isStrucuredElement", "TRUE");

				//Sub Structure Master
				ArtworkMaster newSubStructureMaster = ArtworkMaster.createMasterCopyElement(context, elementType, copyStructureElementData, newArtworkMaster, new ArrayList<Country>());

				addedSubMastersByGS1Key.put(currentGS1Key+ (inlineOrNoTranslateSeq ? "_"+localeSequence : ""), newSubStructureMaster);
				subStructureTypeSet.add(elementType);
			}

			currentLangauges =  BusinessUtil.isNullOrEmpty(currentLangauges) ?  poaLanguages : currentLangauges;
			poaObject.addLocalCopiesToPOA(context, newArtworkMaster, currentLangauges);

			for (GS1ArtworkContent gs1ArtworkContent : structureInfo) {

				String currentGS1Key = gs1ArtworkContent.getGs1Key();
				String localeSequence = gs1ArtworkContent.getLocaleSequence();
				Map currentLangInfoMap = (Map) poaLanguagesMap.get(Integer.parseInt(localeSequence));

				boolean isInline = INLINECOPY_LOCALSEQUENCE.equalsIgnoreCase(localeSequence);
				boolean isNoTranslate = NO_TRANSLATE_LOCALSEQUENCE.equalsIgnoreCase(localeSequence);
				boolean inlineOrNoTranslateSeq = isInline || isNoTranslate;
				String currentLangauename = inlineOrNoTranslateSeq ? "" : (String) currentLangInfoMap.get(SELECT_NAME);

				ArtworkMaster artworkMaster = addedSubMastersByGS1Key.get(currentGS1Key+ (inlineOrNoTranslateSeq ? "_"+localeSequence : ""));

				ArtworkContent subStructure = null; 

				if(isInline && currentLangauges.size() > 1){
					String objWhere	 = AWLUtil.strcat("(attribute[" , AWLAttribute.IS_BASE_COPY.get(context) , "] smatch const " , "\"" , AWLConstants.RANGE_NO , "\")");
					subStructure = artworkMaster.getArtworkElementContent(context, objWhere).get(0);
				} else 
				{
					if(isInline &&  currentLangauges.size() == 1){
						currentLangauename = poaLanguages.size() == 1 ? (String) poaLanguages.get(0) : artworkMaster.getBaseArtworkElement(context).getCopyTextLanguage(context);
					} else if(isNoTranslate){
						currentLangauename =  artworkMaster.getBaseArtworkElement(context).getCopyTextLanguage(context);
					}
					
					currentLangauename = isInline && BusinessUtil.isNullOrEmpty(currentLangauename) ?  poaLanguages.join(",") : currentLangauename;
					subStructure = artworkMaster.fetchLocalCopyElement(context, currentLangauename);  
				}
				UIRTEUtil.setAttributeValue(context, subStructure.getObjectId(), AWLAttribute.COPY_TEXT.get(context), gs1ArtworkContent.getRTEContent());
			}

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
}

