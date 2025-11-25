/*
 **  Copyright (c) 1992-2020 Dassault Systemes.
 **  All Rights Reserved.
 **  This program contains proprietary and trade secret information of MatrixOne,
 **  Inc.  Copyright notice is precautionary only
 **  and does not evidence any actual or intended publication of such program
 **
 */
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;
import java.util.Set;
import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.dao.CopyList;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLInterface;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.XSSUtil;

public class AWLCopyListUIBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = 1L;
	private static final String EXPORT_FORMAT = "exportFormat";
	private static final String OBJECT_ID = "objectId";
	public static final String TO_OPENBRACKET = "to[";

	@SuppressWarnings({ "PMD.SignatureDeclareThrowsException",
						"PMD.AppendCharacterWithChar"})
	
	public AWLCopyListUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	/**
	 * To generate the Artwork Usage field UI
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return
	 * @throws FrameworkException
	 */
	public static String generateArtworkUsagefield(Context context, String args[]) 
			throws FrameworkException {
		StringBuilder sBuilder = new StringBuilder();
		try {
			Map programMap = JPO.unpackArgs(args);
			Map fieldMap = (HashMap)programMap.get("fieldMap");
			Map requestMap = (HashMap)programMap.get("requestMap");
			String name = (String)fieldMap.get("name");
			String mode = (String)requestMap.get("mode");
			String objectId = (String)requestMap.get("objectId");
			String artworkUsage = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump $3", 
					objectId, AWLAttribute.ARTWORK_USAGE.getSel(context), "|");
			String artworkUsages[] = artworkUsage.split("\\|");
			StringList artworkUsageList = BusinessUtil.toStringList(artworkUsages);
			StringList valueranges = AWLAttribute.ARTWORK_USAGE.getAttrRanges(context);
			//StringList displayRanges = AWLPropertyUtil.getAttributeRangeI18N(context, AWLAttribute.ARTWORK_USAGE.get(context), valueranges, context.getLocale().getLanguage());
			StringList displayRanges = valueranges;
			if("edit".equalsIgnoreCase(mode)) {
				String artworkUsageVal;
				sBuilder.append("<table><tbody><tr><td><select id=\"").append(name).append("Id\" title=\"").append(name).append("\" name=\"")
				.append(name).append("\" size=\"5\" multiple=\"\">");
				for(int i=0; i<displayRanges.size(); i++) {
					artworkUsageVal = (String)valueranges.get(i); 
					sBuilder.append("<option value=\"").append(artworkUsageVal).append('\"');
					if(artworkUsageList.contains(artworkUsageVal)) {
						sBuilder.append(" selected");
					}
					sBuilder.append(" >").append((String)displayRanges.get(i)).append("</option>");
				}
				sBuilder.append("</select></td>")
				.append("<td><a href=javascript:selectAllArtworkUsages()>")
				.append( AWLPropertyUtil.getI18NString(context, "emxAWL.Action.SelectAll"))
				.append("</a></td></tr></tbody></table>");
			} else {
				String artworkUsageDispVal;
				String reportFormat = (String)requestMap.get("reportFormat");
				if(reportFormat != null && reportFormat.equalsIgnoreCase("csv")) {
					for(String rangeValue : (List<String>)artworkUsageList) {
						artworkUsageDispVal = (String)displayRanges.get(valueranges.indexOf(rangeValue));
						sBuilder.append(artworkUsageDispVal)
						.append('\n');
					}
				} else {
					sBuilder.append("<table class=\"multi-attr\">").append("<tbody>");
					for(String rangeValue : (List<String>)artworkUsageList) {
						artworkUsageDispVal = (String)displayRanges.get(valueranges.indexOf(rangeValue));
						sBuilder.append("<tr> <td class=\"field\">").append(artworkUsageDispVal)
						.append("</td></tr>");
					}
					sBuilder.append("</tbody></table>");
				}
			}
		} catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e);
		}
		return sBuilder.toString();
	}
	/**
	 * To get the names of the Countries associated to the Copy List
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - List of Country Names
	 * @throws FrameworkException
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public StringList getCountryNames(Context context, String args[]) throws FrameworkException {
		try {
			return super.showCountries(context, args);
		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * To Get the Names of the Countries/Languages associated to the Copy List
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - List of Country Names
	 * @throws FrameworkException
	 * @since AWL V62015x.HF4
	 * @author R2J (Raghavendra M J)
	 * Created during 'Copy List Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public String getLanguagesOrCountryNames(Context context, String args[]) throws FrameworkException 
	{
		try 
		{
			StringList returnList = new StringList();
			Map programMap = JPO.unpackArgs(args);
			Map fieldMap = BusinessUtil.getMap(programMap , "fieldMap");
			String copyListId = BusinessUtil.getString(BusinessUtil.getRequestMap(programMap), AWLConstants.OBJECT_ID);
			String fieldName = BusinessUtil.getString(fieldMap, SELECT_NAME);

			if("Countries".equalsIgnoreCase(fieldName))
			{
				returnList = new CopyList(copyListId).getCountryNames(context);
			}
			else if("Languages".equalsIgnoreCase(fieldName))
			{
				returnList =  new CopyList(copyListId).getLanguageNames(context);
			}
			return FrameworkUtil.join(BusinessUtil.toUniqueSortedList(returnList), ",");
		}
		catch(Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 * To get the names of the Languages associated to the Copy List
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - List of Language Names
	 * @throws FrameworkException
	 * @Since VR2015x.HF4 
	 * Created during 'Copy List Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public StringList getLangaugeNames(Context context, String args[]) throws FrameworkException {
		try {
			return super.showLanguagesAssociated(context, args);
		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}
	/**
	 * To get the Copy Lists associated to a context object
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed argumentsd
	 * @param whereExpr
	 * @return - List of Hierarchy Copy Lists
	 * @throws FrameworkException
	 * @Since VR2015x.HF4 
	 * Created during 'Copy List Highlight'
	 */
	public MapList getHierarhcyCopyLists(Context context, String objectId, String whereExpr) 
			throws FrameworkException {
		try
		{
			MapList copyListMapList = new MapList();
			if(BusinessUtil.isKindOf(context, objectId, AWLType.PRODUCT_LINE.get(context)))
			{
				Brand brand = new Brand(objectId);
				copyListMapList = brand.getAssociatedCopyLists(context, EMPTY_STRINGLIST, whereExpr, true);
			} else if(BusinessUtil.isKindOf(context, objectId, AWLType.CPG_PRODUCT.get(context)))
			{
				CPGProduct product = new CPGProduct(objectId);
				copyListMapList = product.getAssociatedCopyLists(context, EMPTY_STRINGLIST, whereExpr, true);
			}
			return copyListMapList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 * To get the Copy Lists associated to a context object
	 * @param context
	 * @param objectId
	 * @param whereExpr
	 * @return
	 * @throws FrameworkException
	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeAssociatedCopyLists(Context context, String args[]) 
			throws FrameworkException {
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			String contextObjId = (String) programMap.get(AWLConstants.PARENT_OID);
			String whereExpr = AWLUtil.strcat(DomainConstants.SELECT_CURRENT, "==", AWLState.RELEASE.get(context,
					AWLPolicy.POA));
			
			MapList existingCopyList =  getHierarhcyCopyLists(context, contextObjId, whereExpr);
			return BusinessUtil.getIdList(existingCopyList);
		} catch(Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * To get the UI for the Place Of Origin column
	 * @param context
	 * @param objectId
	 * @param whereExpr
	 * @return
	 * @throws FrameworkException
	 */
	public StringList getPlaceOfOrigin(Context context, String[] args) throws FrameworkException {
		
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList copyListObjList = (MapList)programMap.get("objectList");
			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(BusinessUtil.getRequestParamMap(programMap), EXPORT_FORMAT));
			
			StringList copyListIdList = BusinessUtil.getIdList(copyListObjList);
			return getPlaceOfOriginHTML(context, copyListIdList, false, isExporting);
		}catch(Exception e){ throw new FrameworkException(e);}
	}	
	
	/**
	 * To get the UI for the Place Of Origin column
	 * @param context
	 * @param objectId
	 * @param whereExpr
	 * @return
	 * @throws FrameworkException
	 */
	protected StringList getPlaceOfOriginHTML(Context context, StringList copyListIdList, 
			boolean displayMultipleInPopup, boolean isExporting) throws FrameworkException {
		
		StringList exportPlaceOfOrigin = new StringList();
		StringList placeOfOriginHTML = new StringList(copyListIdList.size());
		
		//String COPYLIST_ORIGIN = TO_OPENBRACKET+AWLRel.ASSOCIATED_COPY_LIST.get(context)+"].from.id";
		String COPYLIST_ORIGIN_NAME = TO_OPENBRACKET+AWLRel.ASSOCIATED_COPY_LIST.get(context)+"].from.name";
		String COPYLIST_ORIGIN_TYPE = TO_OPENBRACKET+AWLRel.ASSOCIATED_COPY_LIST.get(context)+"].from.type";
		
		//String OBS_COPYLIST_ORIGIN = TO_OPENBRACKET+AWLRel.ASSOCIATED_COPY_LIST_HISTORY.get(context)+"].from.id";
		String OBS_COPYLIST_ORIGIN_NAME = TO_OPENBRACKET+AWLRel.ASSOCIATED_COPY_LIST_HISTORY.get(context)+"].from.name";
		String OBS_COPYLIST_ORIGIN_TYPE = TO_OPENBRACKET+AWLRel.ASSOCIATED_COPY_LIST_HISTORY.get(context)+"].from.type";

		MapList prodHierarchyList = BusinessUtil.getInfoList(context, copyListIdList, BusinessUtil.toStringList(COPYLIST_ORIGIN_NAME, COPYLIST_ORIGIN_TYPE, 
				OBS_COPYLIST_ORIGIN_NAME, OBS_COPYLIST_ORIGIN_TYPE, SELECT_CURRENT, SELECT_ID));
		
		boolean[] isKindOfCL = BusinessUtil.isKindOf(context, copyListIdList, AWLType.COPY_LIST.get(context));
		
		for(boolean flag : isKindOfCL){
			if(!flag) throw new FrameworkException("Only Copy List Objects can be passed to this method");
		}

		String multipleStr = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Multiple");
		String imagePath = "<img height=\"16\" border=\"0\" src=\"images/IMGNAME\"/>";

		boolean isObsoleted = false;
		String name = EMPTY_STRING;
		String type = EMPTY_STRING;
		String currentState = EMPTY_STRING;
		String copyListId = EMPTY_STRING;
		String placeOfOrginStr = EMPTY_STRING;
		StringList placeOfOriginNames = EMPTY_STRINGLIST; 
		StringList placeOfOriginTypes = EMPTY_STRINGLIST;
		
		Map copyListInfo = null;
		for (int i = 0; i < prodHierarchyList.size(); i++)
		{
			copyListInfo = (Map) prodHierarchyList.get(i);
			
			copyListId = BusinessUtil.getString(copyListInfo, SELECT_ID);
			currentState = BusinessUtil.getString(copyListInfo, SELECT_CURRENT);
		
			isObsoleted = AWLState.OBSOLETE.equalsObjectState(context, AWLPolicy.COPY_LIST, currentState);
			
			placeOfOriginNames = isObsoleted ? BusinessUtil.getStringList(copyListInfo,OBS_COPYLIST_ORIGIN_NAME ) :
										BusinessUtil.getStringList(copyListInfo,COPYLIST_ORIGIN_NAME );
			
			placeOfOriginTypes = isObsoleted ? BusinessUtil.getStringList(copyListInfo,OBS_COPYLIST_ORIGIN_TYPE ) :
				BusinessUtil.getStringList(copyListInfo,COPYLIST_ORIGIN_TYPE);

			if(BusinessUtil.isNullOrEmpty(placeOfOriginNames))
			{
				placeOfOriginHTML.add("");
				continue;
			}
			
			if(placeOfOriginNames.size() == 1){
				name = (String)placeOfOriginNames.get(0);
				type = (String)placeOfOriginTypes.get(0);
				
				exportPlaceOfOrigin.add(name);

				String image = FrameworkUtil.findAndReplace(imagePath, "IMGNAME", AWLPropertyUtil.getTypeIconFromCache(context, type));
				placeOfOrginStr = AWLUtil.strcat(image, " ", XSSUtil.encodeForHTML(context, name));
				
			} else {
				if(displayMultipleInPopup) {
					String jsInclude ="<script language=\"javascript\" type=\"text/javascript\" src=\"../awl/scripts/emxAWLUtil.js\"></script>";
					StringBuilder html = new StringBuilder(100);
					html.append(jsInclude);
					html.append( "<div><a href=\"javascript:;\"");
					html.append( "onclick=\"openPlaceOfOrigin('");
					html.append(copyListId);
					html.append("');\" >");
					html.append(multipleStr);					
					html.append( "</a></div>" );

					placeOfOrginStr = html.toString();
				} else {
					placeOfOrginStr = multipleStr;
				}
			}
			placeOfOriginHTML.add(placeOfOrginStr);
					
		}
		return isExporting ? exportPlaceOfOrigin : placeOfOriginHTML;
	}
	
	
	/**
	 * program called from CopyList Artwork Assembly page
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  MapList       - list of Local copy elements connected to CopyList
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2015x FD04
	 * @author  N94 - 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getCopyListContent(Context context, String[] args) throws FrameworkException {
		try {

			HashMap paramMap = (HashMap) JPO.unpackArgs(args);
			String copyListId = (String) paramMap.get(OBJECT_ID);
			CopyList copyList = new CopyList(copyListId);


			String SEL_STRUCTURED_MASTER_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			String SEL_ATTR_INLINE_TRANSLATION = AWLAttribute.INLINE_TRANSLATION.getSel(context);
			String SEL_ATTR_TRANSLATE = AWLAttribute.TRANSLATE.getSel(context);
			String maeCountrySelect = "from["+AWLRel.COUNTRIES_ASSOCIATED.get(context)+"].to.name";
			StringList maeSel = BusinessUtil.toStringList(SELECT_TYPE, SELECT_ID,
					SEL_ATTR_INLINE_TRANSLATION, 
					SEL_STRUCTURED_MASTER_ELEMENT,
					SEL_ATTR_TRANSLATE,
					maeCountrySelect);

			String SEL_MASTER = AWLUtil.strcat("to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.id");
			String instanceSeqSelect = AWLAttribute.INSTANCE_SEQUENCE.getSel(context);
			String sequenceNumberSelect = AWLAttribute.ARTWORK_ELEMENT_SEQUENCE_ORDER.getSel(context);
			StringList selectables = new StringList(instanceSeqSelect);
						selectables.add(sequenceNumberSelect);
			MapList masterCopyList = copyList.getArtworkMasters(context, new StringList(SELECT_ID),
					selectables, 
					AWLConstants.EMPTY_STRING);
			StringList masterOIDs = BusinessUtil.getIdList(masterCopyList);
			Map<String, String> sequenceNumberIDMap = new HashMap<String, String>();
			Map<String, String> instanceSequenceIDMap = new HashMap<String, String>();
			for(Map master : (List<Map>) masterCopyList){
				String masterId = (String) master.get(SELECT_ID);
				String sequenceNumber = (String) master.get(AWLAttribute.ARTWORK_ELEMENT_SEQUENCE_ORDER.getSel(context));
				String instanceSequence = (String) master.get(AWLAttribute.INSTANCE_SEQUENCE.getSel(context));
				sequenceNumberIDMap.put(masterId, sequenceNumber);
				instanceSequenceIDMap.put(masterId, instanceSequence);
			}
			StringList objsel = BusinessUtil.toStringList(SELECT_REVISION, "logicalid", SEL_MASTER);
			MapList copyListAssembly = copyList.getArtworkElements(context, objsel, null, false);
			copyListAssembly = BusinessUtil.filterLatestRevUsingLogicalID(context, copyListAssembly);
			StringList masterIDs = BusinessUtil.toStringList(copyListAssembly, SEL_MASTER);
			masterIDs = BusinessUtil.toUniqueList(masterIDs);

			MapList masterInfo = BusinessUtil.getInfo(context, masterIDs, maeSel);
			Map masterInfoById = BusinessUtil.toMapById(masterInfo);


			MapList returnList = new MapList();

			for (Map elementMap :(List<Map>) copyListAssembly) {

				String artworkMasterId = (String)elementMap.get(SEL_MASTER);

				if(BusinessUtil.isNotNullOrEmpty(artworkMasterId)){
					artworkMasterId = BusinessUtil.getApplicableObjectRevFromList(context, artworkMasterId, masterOIDs);
					if(artworkMasterId == null)
						continue;
					Map currentMasterInfo =(Map) masterInfoById.get(artworkMasterId);
					String sequenceNumber = sequenceNumberIDMap.get(artworkMasterId);
					String instanceSequenceNumber = instanceSequenceIDMap.get(artworkMasterId);
					elementMap.put("masterId", artworkMasterId);
					elementMap.put("masterType", (String)currentMasterInfo.get(SELECT_TYPE));
					elementMap.put(SEL_STRUCTURED_MASTER_ELEMENT, (String)currentMasterInfo.get(SEL_STRUCTURED_MASTER_ELEMENT));
					elementMap.put(SEL_ATTR_INLINE_TRANSLATION, (String)currentMasterInfo.get(SEL_ATTR_INLINE_TRANSLATION));
					elementMap.put(SEL_ATTR_TRANSLATE, (String)currentMasterInfo.get(SEL_ATTR_TRANSLATE));	
					elementMap.put("sequenceNumber", sequenceNumber);
					elementMap.put("instanceSequence", instanceSequenceNumber);
				}

				returnList.add(elementMap);

				if(new ArtworkMaster(artworkMasterId).isStructuredElementRoot(context)){
					MapList structureArtworkElements = ArtworkContent.getNewInstance(context, (String)elementMap.get(SELECT_ID)).getStructuredElementList(context, new StringList(SEL_MASTER), null, true);

					StringList structureMasterIDs = BusinessUtil.toUniqueList(BusinessUtil.toStringList(structureArtworkElements, SEL_MASTER));

					MapList structureMasterInfo = BusinessUtil.getInfo(context, structureMasterIDs, maeSel);
					Map structureMasterInfoById = BusinessUtil.toMapById(structureMasterInfo);

					for (Map structureElementMap :(List<Map>)  structureArtworkElements) {
						structureElementMap.put("level", "2");

						String structureArtworkElementId =(String)structureElementMap.get(SEL_MASTER);

						if(BusinessUtil.isNotNullOrEmpty(artworkMasterId)){
							Map currentStructureMasterInfo =(Map) structureMasterInfoById.get(structureArtworkElementId);
							structureElementMap.put("masterId", structureArtworkElementId);
							structureElementMap.put("masterType", (String)currentStructureMasterInfo.get(SELECT_TYPE));
							structureElementMap.put(SEL_STRUCTURED_MASTER_ELEMENT, (String)currentStructureMasterInfo.get(SEL_STRUCTURED_MASTER_ELEMENT));
							structureElementMap.put(SEL_ATTR_INLINE_TRANSLATION, (String)currentStructureMasterInfo.get(SEL_ATTR_INLINE_TRANSLATION));
							structureElementMap.put(SEL_ATTR_TRANSLATE, (String)currentStructureMasterInfo.get(SEL_ATTR_TRANSLATE));	
						}

						returnList.add(structureElementMap);
					}
				}
			}

			return returnList;
		}catch(Exception e){
			throw new FrameworkException(e);
		}
		
		
	}
}

