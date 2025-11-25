/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import static com.matrixone.apps.awl.util.AWLConstants.CLOSEBRACKET_FROM_ID;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.CopyList;
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
import com.matrixone.apps.awl.util.ArtworkElementUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.cpd.dao.Country;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UITableIndented;
import java.io.StringReader;
import java.io.StringWriter;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult; 
//import com.matrixone.apps.awl.dao.ArtworkElement;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

public class AWLArtworkMasterUIBase_mxJPO extends AWLObject_mxJPO
{
	private static final String OBJECT_ID = "objectId";
	private static final String EXPORT_FORMAT = "exportFormat";
	private static final String FRAMEWORK_UTIL_REPLACE_STRING = "\\\'";
	private static final String MODIFY_ACCESS = "current.access[modify]";
	
	private static final long serialVersionUID = -3120730632244167294L;

	@SuppressWarnings({"PMD.SignatureDeclareThrowsException" })
	
	public AWLArtworkMasterUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
/*
 Access function for Edit details of composite copy.Need to consider state also
 */
	public boolean isCompositeElement(Context context, String[] args) throws FrameworkException {
		
		try{
			Map paramMap         = (Map)JPO.unpackArgs(args);
			String copyElementId = BusinessUtil.getObjectId(paramMap);
			Map artworkInfo = BusinessUtil.getInfo(context, copyElementId, BusinessUtil.toStringList(SELECT_TYPE, SELECT_CURRENT));
			String elementType  = (String) artworkInfo.get(SELECT_TYPE);
			String elementState  = (String) artworkInfo.get(SELECT_CURRENT);
			return CopyElement.isCompositeCopyElementType(context, elementType) && 
				   AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT, elementState);
		}catch(Exception e){ throw new FrameworkException(e);}
		
	}

	public boolean isNotCompositeElement(Context context, String[] args) throws FrameworkException {
		try{
			Map paramMap         = (Map)JPO.unpackArgs(args);
			String copyElementId = BusinessUtil.getObjectId(paramMap);
			String elementType   = BusinessUtil.getInfo(context, copyElementId, SELECT_TYPE);		
			return !(CopyElement.isCompositeCopyElementType(context, elementType));
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public StringList getMasterCopyText(Context context, String[] args)throws FrameworkException
	{
		try{
			//This program should not return programHTMLOutput
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList objList = (MapList)programMap.get("objectList");
			Map paramMap = BusinessUtil.getRequestParamMap(programMap);
			Map paramList = (Map)programMap.get(BusinessUtil.PARAM_LIST);
			String reportFormat = BusinessUtil.getString(paramMap, "reportFormat");
			String SEL_BASE_COPYTEXT_RTE = "from[" + AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "].to.attribute[Copy Text_RTE]";

			//Fix IR-215500
			StringList objIds = BusinessUtil.getIdList(objList);
			StringList returnList = new StringList(objIds.size());
			boolean isProductLineArtworkElements = false;
			if(BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(paramList, "isProductLineArtworkElements")))
				isProductLineArtworkElements = "true".equalsIgnoreCase(BusinessUtil.getString(paramList, "isProductLineArtworkElements"));
			if (isProductLineArtworkElements) {
				for (int i = 0; i < objList.size(); i++) {
					Map currentObject = (Map) objList.get(i);
					String baseCopyTextRTE = "";
					if (BusinessUtil.isNotNullOrEmpty((String) currentObject.get(SEL_BASE_COPYTEXT_RTE))) {
						baseCopyTextRTE = (String) currentObject.get(SEL_BASE_COPYTEXT_RTE);
					}
					returnList.add(baseCopyTextRTE);
				}
				
			} else {
				boolean kindofMCE[] = BusinessUtil.isKindOf(context, BusinessUtil.toStringArray(objIds),
						AWLType.MASTER_COPY_ELEMENT.get(context));
				boolean kindofCE[] = BusinessUtil.isKindOf(context, BusinessUtil.toStringArray(objIds),
						AWLType.COPY_ELEMENT.get(context));

				StringList meIds = IntStream.range(0, objIds.size()).boxed().filter(index -> {
					return kindofMCE[index];
				}).map(index -> {
					return objIds.get(index);
				}).collect(Collectors.toCollection(StringList::new));

				StringList aeIds = IntStream.range(0, objIds.size()).boxed().filter(index -> {
					return kindofCE[index];
				}).map(index -> {
					return objIds.get(index);
				}).collect(Collectors.toCollection(StringList::new));

				boolean isFormatExist = "CSV".equalsIgnoreCase(reportFormat) || "Text".equalsIgnoreCase(reportFormat);
				String baseCopyTextWithWhere = isFormatExist
						? "from[" + AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "|to.attribute["
								+ AWLAttribute.IS_BASE_COPY.get(context) + "]=='Yes'].to.attribute[Copy Text]"
						: "from[" + AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "|to.attribute["
								+ AWLAttribute.IS_BASE_COPY.get(context) + "]=='Yes'].to.attribute[Copy Text_RTE]";
				String baseCopyText = isFormatExist
						? "from[" + AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "].to.attribute[Copy Text]"
						: "from[" + AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "].to.attribute[Copy Text_RTE]";
				String copyTextSel = isFormatExist ? AWLAttribute.COPY_TEXT.get(context) : "attribute[Copy Text_RTE]";

				Map<String, String> finalMap = new HashMap<String, String>();
				if (BusinessUtil.isNotNullOrEmpty(meIds)) {
					MapList baseCopyInfo = BusinessUtil.getObjDetails(context, objIds,
							StringList.create(SELECT_ID, baseCopyTextWithWhere), null);
					finalMap.putAll(((List<Map>) baseCopyInfo).stream().collect(Collectors.toMap(currentMap -> {
						return (String) currentMap.get(SELECT_ID);
					}, currentMap -> {
						String copyText = (String) currentMap.get(baseCopyText);
						copyText = BusinessUtil.isNullOrEmpty(copyText) ? "" : copyText;
						return copyText;
					})));
				}

				if (BusinessUtil.isNotNullOrEmpty(aeIds)) {
					MapList copyInfo = BusinessUtil.getObjDetails(context, objIds,
							StringList.create(SELECT_ID, copyTextSel), null);
					finalMap.putAll(((List<Map>) copyInfo).stream().collect(Collectors.toMap(currentMap -> {
						return (String) currentMap.get(SELECT_ID);
					}, currentMap -> {
						String copyText = (String) currentMap.get(copyTextSel);
						copyText = BusinessUtil.isNullOrEmpty(copyText) ? "" : copyText;
						return copyText;
					})));
				}

				for (int i = 0; i < objList.size(); i++) {
					String id = (String) ((Map) objList.get(i)).get(SELECT_ID);
					returnList.add(finalMap.get(id));
				}
			}
			return returnList;
		}catch(Exception e){ 
			throw new FrameworkException(e); 
		}
		
	}
	/**
	 * Returns Local Copy Text Column information
	 * Returns programHTMLOutput content for Graphic or Copy Text
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  StringList       - list of LocalCopyText column info
	 * @throws  Exception    - if operation fail
	 * @since   AWL 2012x
	 */
	public StringList getLocalCopyText(Context context, String[] args) throws FrameworkException
	{
		//programHTMLOutput column to display local copy text
		try{
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);
			String languageType = BusinessUtil.getString(requestMap, "LanguageFilter");
			String multipleCopy = AWLPropertyUtil.getI18NString(context, "emxAWL.InlineTranslation.MultipleLocalCopy");
			Map paramMap = BusinessUtil.getRequestParamMap(programMap);
			String reportFormat = BusinessUtil.getString(paramMap, "reportFormat");

			StringList objIds = BusinessUtil.getIdList(objectList);
			boolean kindofMCE[] = BusinessUtil.isKindOf(context, BusinessUtil.toStringArray(objIds), AWLType.MASTER_COPY_ELEMENT.get(context));
			boolean kindofCE[] = BusinessUtil.isKindOf(context, BusinessUtil.toStringArray(objIds), AWLType.COPY_ELEMENT.get(context));

			StringList copyTextList = new StringList(objectList.size());

			for(int i=0; i<objectList.size(); i++){
				String elementId = (String)objIds.get(i);			
				String copyText  = "";
				if(kindofMCE[i]) {
					String copyId  = ArtworkElementUtil.getMasterCopyByCopyElement(context, elementId);
					StringList langCopyList = ArtworkElementUtil.getCopyByLanguage(context, copyId, languageType);
					if(BusinessUtil.isNotNullOrEmpty(langCopyList))
					{
						if(langCopyList.size() == 1)
						{
							CopyElement ce = new CopyElement(langCopyList.get(0).toString());
							copyText  = ArtworkElementUtil.getCopyTextProgramHTML(context, ce, reportFormat); 
						}else
						{
							copyText = AWLUtil.strcat("<div><a href=\"javascript:;\" copyId=\"", copyId, "\" onclick=\"openInlineLocalCopyList('", copyId, "','", languageType, "');\">", multipleCopy, "</a></div>");						
						}
					}
				} else if(kindofCE[i]){				
					CopyElement copyElem = new CopyElement(elementId);				
					copyText  = copyElem.isBaseCopy(context) ? copyText : 
										ArtworkElementUtil.getCopyTextProgramHTML(context, copyElem, reportFormat); 
				}
	            copyTextList.add(copyText);
			}
			return copyTextList;
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	/* * Returns Local State Column information
	 * 
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  StringList       - list of LocalState column info
	 * @throws  Exception    - if operation fails
	 */
	public StringList getLocalState(Context context, String[] args) throws FrameworkException
	{		
		try
		{
			Map programMap      = (Map)JPO.unpackArgs(args);
			MapList objectList  = BusinessUtil.getObjectList(programMap);
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);
			String languageType = BusinessUtil.getString(requestMap, "LanguageFilter");	
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);
			StringList objIds = BusinessUtil.getIdList(objectList);
			boolean kindofMCE[] = BusinessUtil.isKindOf(context, BusinessUtil.toStringArray(objIds), AWLType.MASTER_COPY_ELEMENT.get(context));
			boolean kindofCE[] = BusinessUtil.isKindOf(context, BusinessUtil.toStringArray(objIds), AWLType.COPY_ELEMENT.get(context));

			StringList copyStateList=new StringList(objectList.size());
			for(int i=0; i<objectList.size(); i++){
				String elementId = (String)objIds.get(i);			
				String copyState  = "";
				if(kindofMCE[i])
				{
					String copyId  = ArtworkElementUtil.getMasterCopyByCopyElement(context, elementId);
					StringList langCopyList = ArtworkElementUtil.getCopyByLanguage(context, copyId, languageType);
					if(BusinessUtil.isNotNullOrEmpty(langCopyList) && langCopyList.size() == 1)
					{
						ArtworkContent element = ArtworkContent.getNewInstance(context, (String) langCopyList.get(0));
						copyState = AWLArtworkElementUIBase_mxJPO.getCurrentStateHTML(context, element, exportFormat);
					}
				} else if(kindofCE[i]){
					CopyElement copyElem = new CopyElement(elementId);				
					copyState  = AWLArtworkElementUIBase_mxJPO.getCurrentStateHTML(context, copyElem, exportFormat);
				} 
				copyStateList.add(copyState);				
			}
			return copyStateList;
		}catch(Exception ex) { throw new FrameworkException(ex);}
	}
	//start added to fix IR-158951V6R2013x 
	/*
	 * This method is to return the Place of Origin of given Objects
	 * @param Context context
	 * @param args
	 * @return MapList {Place Of Origin Values}
	 * @author VI5
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getConnectedPHPlaceOfOrigin(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			
			String contextObjId = BusinessUtil.getString(programMap, OBJECT_ID);
			
			if(BusinessUtil.isNullOrEmpty(contextObjId)) {
				String tRowId = (String) programMap.get("emxTableRowId");
				contextObjId = (String)BusinessUtil.parseTableRowId(tRowId).get(OBJECT_ID);
			}
			
			ArtworkMaster artworkMaster = BusinessUtil.isKindOf(context, contextObjId, AWLType.MASTER_ARTWORK_ELEMENT.get(context)) ? new ArtworkMaster(contextObjId) :
										  BusinessUtil.isKindOf(context, contextObjId, AWLType.ARTWORK_ELEMENT.get(context)) ?
										  ArtworkContent.getNewInstance(context, contextObjId).getArtworkMaster(context) : null;

			if(artworkMaster == null)
				return new MapList();
			
			MapList	objIdList = artworkMaster.related(AWLUtil.toArray(AWLType.PRODUCT_LINE, AWLType.CPG_PRODUCT), AWLUtil.toArray(AWLRel.ARTWORK_MASTER)).
											 from().query(context);
			return objIdList;
		}catch(Exception e){ throw new FrameworkException(e);}
		
	}
	
	public StringList getPlaceOfOrigin(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList artworkMasterList = (MapList)programMap.get("objectList");
			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(BusinessUtil.getRequestParamMap(programMap), EXPORT_FORMAT));
			Map paramList = (Map)programMap.get(BusinessUtil.PARAM_LIST);
			
			boolean isProductLineArtworkElements = false;
			if(BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(paramList, "isProductLineArtworkElements")))
				isProductLineArtworkElements = "true".equalsIgnoreCase(BusinessUtil.getString(paramList, "isProductLineArtworkElements"));
			if (isProductLineArtworkElements) {
				return getPlaceOfOriginHTML(context, artworkMasterList, false, isExporting);
			} else {
				StringList artworkMasterIdList = BusinessUtil.getIdList(artworkMasterList);
				return getPlaceOfOriginHTML(context, artworkMasterIdList, false, isExporting);
			}
						
		}catch(Exception e){ throw new FrameworkException(e);}
		
	}	
	protected StringList getPlaceOfOriginHTML(Context context, MapList artworkMasterList, boolean displayMultipleInPopup, boolean isExporting) throws FrameworkException 
	{
		try
		{
			StringList exportPlaceOfOrigin = new StringList();
			StringList placeOfOriginHTML = new StringList(artworkMasterList.size());

			String SEL_PLACE_ORIGIN = AWLUtil.strcat("to[", AWLRel.ARTWORK_MASTER.get(context), "].from.id");
			String COPYLIST_ORIGIN = "to["+AWLRel.ASSOCIATED_COPY_LIST.get(context)+"].from.id";
			String OBS_COPYLIST_ORIGIN = "to["+AWLRel.ASSOCIATED_COPY_LIST_HISTORY.get(context)+"].from.id";
			String SEL_STRUCTURED_ARTWORK_MASTER = AWLUtil.strcat( "to[",AWLRel.STRUCTURED_ARTWORK_MASTER.get(context) , "].from.id");
			
			String multipleStr = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Multiple");
			String imagePath = "<img height=\"16\" border=\"0\" src=\"images/IMGNAME\"/>";
			String obsoleteState = AWLState.OBSOLETE.get(context, AWLPolicy.COPY_LIST);

			for (int i = 0; i < artworkMasterList.size(); i++)
			{
				Map artworkMasterInfo = (Map) artworkMasterList.get(i);
				String masterId = (String) artworkMasterInfo.get(SELECT_ID);
				boolean isCopyList = AWLType.COPY_LIST.get(context).equalsIgnoreCase((String) artworkMasterInfo.get(SELECT_TYPE));
				boolean isObsoleted = obsoleteState.equals(BusinessUtil.getFirstString(artworkMasterInfo, SELECT_CURRENT));
				boolean isSER = BusinessUtil.isNotNullOrEmpty(BusinessUtil.getFirstString(artworkMasterInfo, SEL_STRUCTURED_ARTWORK_MASTER));
				StringList placeOfOriginIDs = !isCopyList
						? (isSER ? BusinessUtil.getInfoList(context, masterId, SEL_STRUCTURED_ARTWORK_MASTER)
								: BusinessUtil.getStringList(artworkMasterInfo, SEL_PLACE_ORIGIN))
						: (isCopyList && !isObsoleted)
								? BusinessUtil.getStringList(artworkMasterInfo, COPYLIST_ORIGIN)
								: BusinessUtil.getStringList(artworkMasterInfo, OBS_COPYLIST_ORIGIN);

				String placeOfOrginStr = "";

				if(BusinessUtil.isNullOrEmpty(placeOfOriginIDs))
				{
					placeOfOriginHTML.add("");
					continue;
				}

				String artworkMasterID = (String)placeOfOriginIDs.get(0);
				Map placeOfOrigin = BusinessUtil.getInfo(context, artworkMasterID, 
						BusinessUtil.toStringList(SELECT_TYPE, AWLAttribute.MARKETING_NAME.getSel(context)));
				String placeOfOriginName  = BusinessUtil.getString(placeOfOrigin, AWLAttribute.MARKETING_NAME.getSel(context));

				if(isExporting)
				{
					exportPlaceOfOrigin.add(placeOfOriginName);
					continue;
				}
				if(placeOfOriginIDs.size() == 1){
					exportPlaceOfOrigin.add(placeOfOriginName);
					String type = BusinessUtil.getString(placeOfOrigin, SELECT_TYPE);

					String image = FrameworkUtil.findAndReplace(imagePath, "IMGNAME", AWLPropertyUtil.getTypeIconFromCache(context, type));
					String planceOfOrg = XSSUtil.encodeForHTML(context, placeOfOriginName);

					placeOfOrginStr = AWLUtil.strcat(image, " ", planceOfOrg);
				} else {
					if(displayMultipleInPopup) {
						String jsInclude ="<script language=\"javascript\" type=\"text/javascript\" src=\"../awl/scripts/emxAWLUtil.js\"></script>";
						StringBuilder html = new StringBuilder(100);
						html.append(jsInclude);
						html.append( "<div><a href=\"javascript:;\"");
						html.append( "onclick=\"openPlaceOfOrigin('");
						html.append(masterId);
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
		
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	protected StringList getPlaceOfOriginHTML(Context context, StringList artworkMasterIDs, boolean displayMultipleInPopup, boolean isExporting) throws FrameworkException 
	{
		try
		{
			StringList exportPlaceOfOrigin = new StringList();
			StringList placeOfOriginHTML = new StringList(artworkMasterIDs.size());

			String SEL_PLACE_ORIGIN = AWLUtil.strcat("to[", AWLRel.ARTWORK_MASTER.get(context), "].from.id");
			String COPYLIST_ORIGIN = "to["+AWLRel.ASSOCIATED_COPY_LIST.get(context)+"].from.id";
			String OBS_COPYLIST_ORIGIN = "to["+AWLRel.ASSOCIATED_COPY_LIST_HISTORY.get(context)+"].from.id";
			String SEL_STRUCTURED_ARTWORK_MASTER = AWLUtil.strcat( "to[",AWLRel.STRUCTURED_ARTWORK_MASTER.get(context) , "].from.id");

			MapList prodHierarchyList = BusinessUtil.getInfoList(context, artworkMasterIDs, BusinessUtil.toStringList(SEL_PLACE_ORIGIN,COPYLIST_ORIGIN,OBS_COPYLIST_ORIGIN,SELECT_CURRENT));
			boolean[] isKindOfMAE = BusinessUtil.isKindOf(context, artworkMasterIDs, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
			boolean[] isKindOfCL = BusinessUtil.isKindOf(context, artworkMasterIDs, AWLType.COPY_LIST.get(context));

			String multipleStr = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Multiple");
			String imagePath = "<img height=\"16\" border=\"0\" src=\"images/IMGNAME\"/>";
			String obsoleteState = AWLState.OBSOLETE.get(context, AWLPolicy.COPY_LIST);

			for (int i = 0; i < artworkMasterIDs.size(); i++)
			{
				if(!isKindOfMAE[i] && !isKindOfCL[i] ) 
				{
					placeOfOriginHTML.add("");
					continue;
				}

				Map artworkMasterInfo = (Map) prodHierarchyList.get(i);
				String masterId = (String) artworkMasterIDs.get(i);
				boolean isObsoleted = obsoleteState.equals(BusinessUtil.getFirstString(artworkMasterInfo,SELECT_CURRENT));
				StringList placeOfOriginIDs  = isKindOfMAE[i] ? (new ArtworkMaster(masterId).isStructuredElement(context) ? 
						BusinessUtil.getInfoList(context, masterId, SEL_STRUCTURED_ARTWORK_MASTER) : BusinessUtil.getStringList(artworkMasterInfo, SEL_PLACE_ORIGIN)):
				              (isKindOfCL[i] && !isObsoleted) ? BusinessUtil.getStringList(artworkMasterInfo,COPYLIST_ORIGIN ):
							                                    BusinessUtil.getStringList(artworkMasterInfo,OBS_COPYLIST_ORIGIN );

				String placeOfOrginStr = "";

				if(BusinessUtil.isNullOrEmpty(placeOfOriginIDs))
				{
					placeOfOriginHTML.add("");
					continue;
				}

				String artworkMasterID = (String)placeOfOriginIDs.get(0);
				Map placeOfOrigin = BusinessUtil.getInfo(context, artworkMasterID, 
						BusinessUtil.toStringList(SELECT_TYPE, AWLAttribute.MARKETING_NAME.getSel(context)));
				String placeOfOriginName  = BusinessUtil.getString(placeOfOrigin, AWLAttribute.MARKETING_NAME.getSel(context));

				if(isExporting)
				{
					exportPlaceOfOrigin.add(placeOfOriginName);
					continue;
				}
				if(placeOfOriginIDs.size() == 1){
					exportPlaceOfOrigin.add(placeOfOriginName);
					String type = BusinessUtil.getString(placeOfOrigin, SELECT_TYPE);

					String image = FrameworkUtil.findAndReplace(imagePath, "IMGNAME", AWLPropertyUtil.getTypeIconFromCache(context, type));
					String planceOfOrg = XSSUtil.encodeForHTML(context, placeOfOriginName);

					placeOfOrginStr = AWLUtil.strcat(image, " ", planceOfOrg);
				} else {
					if(displayMultipleInPopup) {
						String jsInclude ="<script language=\"javascript\" type=\"text/javascript\" src=\"../awl/scripts/emxAWLUtil.js\"></script>";
						StringBuilder html = new StringBuilder(100);
						html.append(jsInclude);
						html.append( "<div><a href=\"javascript:;\"");
						html.append( "onclick=\"openPlaceOfOrigin('");
						html.append(masterId);
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
		
		} catch (Exception e) { throw new FrameworkException(e);}
	}	

	public Boolean setCopyText(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap paramMap = (HashMap)programMap.get("paramMap");
			String copyElementId  = (String)paramMap.get(AWLConstants.OBJECT_ID);
			String newCLValue = (String)paramMap.get("New Value");
			if(BusinessUtil.isKindOf(context, copyElementId, AWLType.MASTER_ARTWORK_ELEMENT.get(context)))
			{
				ArtworkMaster artworkMaster = new ArtworkMaster(copyElementId);
				CopyElement baseElement = (CopyElement) artworkMaster.getBaseArtworkElement(context);
				baseElement.setCopyText(context, newCLValue);
			}else if (BusinessUtil.isKindOf(context, copyElementId, AWLType.COPY_ELEMENT.get(context)))
			{
				CopyElement copyElement = new CopyElement(copyElementId);
                copyElement.setCopyText(context, newCLValue); /* To fix IR IR-189352V6R2014 */
			}
			return Boolean.TRUE;

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/**
	 * Invoked from Global Search Table
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	public StringList getGeographicLocation(Context context, String args[]) throws FrameworkException {
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			StringList ids = BusinessUtil.getIdList(objectList);
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);

			return getGeographicLocationHTML(context, ids, exportFormat);
		} catch (Exception e) { throw new FrameworkException(e);}
		
	}
	
	public StringList getGeographicLocationHTML(Context context, StringList ids, String exportFormat) throws FrameworkException {
		try {
			boolean[] isKindOFMAE = BusinessUtil.isKindOf(context, ids, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
			boolean[] isKindOFCL = BusinessUtil.isKindOf(context, ids, AWLType.COPY_LIST.get(context));
			StringList geographicValues = new StringList(ids.size());
			for (int i = 0; i < ids.size(); i++) {
				if(!isKindOFMAE[i] && !isKindOFCL[i] ) {
					geographicValues.add(EMPTY_STRING);
					continue;
				} 
				String artworkMasterId = (String) ids.get(i);
				geographicValues.add(getGeographicInfoHTML(context, artworkMasterId, exportFormat,isKindOFMAE[i]));
			}
			return geographicValues;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	@SuppressWarnings({ "unused", "unchecked" })
	protected StringList getGeographicLocationHTML(Context context, MapList objectList, String exportFormat) throws FrameworkException {
		try {
			StringList geographicValues = new StringList(objectList.size());
			boolean export = BusinessUtil.isNotNullOrEmpty(exportFormat);
			for (int i = 0; i < objectList.size(); i++) {
				Map obj = (Map) objectList.get(i);
				StringList countriesList = (StringList) obj.get("countries");
				if(BusinessUtil.isNullOrEmpty(countriesList)) {
					geographicValues.add("");
					continue;
				}

				Collections.sort(countriesList);

				if(BusinessUtil.isNotNullOrEmpty(exportFormat)) {
					geographicValues.add(FrameworkUtil.join(countriesList, ","));
					continue;
				}

				StringList encodedCountry = new StringList(countriesList.size());
				for (String country : (List<String>)countriesList) {
					encodedCountry.add(XSSUtil.encodeForJavaScript(context, country));
				}

				StringBuffer html = new StringBuffer(200);
				html.append( "<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../awl/images/AWLStatusLocationAssigned.gif\" ");
				html.append( "onmouseover=\"showTooltip(event, this,'").append(FrameworkUtil.join(encodedCountry, ", ")).append("');\" ");
				html.append( "onmouseout=\"hideTooltip(event, this);\" />");
				geographicValues.add(html.toString());
			}
			return geographicValues;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	
	private String getGeographicInfoHTML(Context context, String artworkMasterId , String exportFormat,boolean isArtworkMaster) throws FrameworkException
	{
		try
		{
			List<Country> existingCountries = isArtworkMaster ? new ArtworkMaster(artworkMasterId).getCountries(context) :
																new CopyList(artworkMasterId).getCountries(context);
			
			if(existingCountries.isEmpty() ) {
				return "";
			}

			StringList countryNames = new StringList(existingCountries.size());
			for (Country country : existingCountries) {
				countryNames.add(country.getName());
			}
			Collections.sort(countryNames);
			
			if(BusinessUtil.isNotNullOrEmpty(exportFormat)) {
				return FrameworkUtil.join(countryNames, ",");
			}
			
			StringList encodedCountry = new StringList(existingCountries.size());
			for (String country : (List<String>)countryNames) {
				encodedCountry.add(XSSUtil.encodeForJavaScript(context, country));
			}
			
			StringBuffer html = new StringBuffer(200);
			html.append( "<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../awl/images/AWLStatusLocationAssigned.gif\" ");
			html.append( "onmouseover=\"showTooltip(event, this,'").append(FrameworkUtil.join(encodedCountry, ", ")).append("');\" ");
			html.append( "onmouseout=\"hideTooltip(event, this);\" />");
			return html.toString();

		} catch(Exception e){ throw new FrameworkException(e);}
	}

	/**
	 * @deprecated 
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * Deprecated during Copy List Highlight in 15s FD04.
	 * State column values show using expressions 
	 */
	public StringList getCurrentStateSymbol(Context context, String[] args) throws FrameworkException
	{		
		try
		{
			Map programMap 	= (Map) JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			

			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);

			StringList objIds = BusinessUtil.getIdList(objectList);
			String kindofmce = AWLUtil.strcat("type.kindof[", AWLType.MASTER_ARTWORK_ELEMENT.get(context), "]");
			String kindofCL = AWLUtil.strcat("type.kindof[" , AWLType.COPY_LIST.get(context), "]");
			StringList selects = new StringList(5);
			selects.add(SELECT_CURRENT);
			selects.add(SELECT_POLICY);
			selects.add(kindofCL);
			selects.add(kindofmce);	
			MapList objInfoList = BusinessUtil.getInfo(context, objIds,selects);

			StringList currentValues = new StringList(objectList.size());
			for(int i = 0; i < objectList.size(); i++)
			{
				Map objectMap      = (Map)objectList.get(i);
				String objectId      = BusinessUtil.getId(objectMap);
				String currentHtml = "";
				Map info = (Map)objInfoList.get(i);

				if(AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)info.get(kindofmce))) {
					ArtworkMaster master = new ArtworkMaster(objectId);
					ArtworkContent element = master.getBaseArtworkElement(context);
					currentHtml = AWLArtworkElementUIBase_mxJPO.getCurrentStateHTML(context, element,exportFormat);
				}else if(AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)info.get(kindofCL))){					
					String policy = (String) info.get(SELECT_POLICY);
					String current = (String) info.get( SELECT_CURRENT);
					currentHtml = AWLPropertyUtil.getStateI18NString(context, policy, current);
				}
				/*else if(kindofCE[i]){
					CopyElement ce = new CopyElement((String)objIds.get(i));
					ce = (CopyElement) (!ce.isBaseCopy(context) ? ce.getBaseContent(context) : ce);
					currentHtml = ${CLASS:AWLArtworkElementUIBase}.getCurrentStateHTML(context, ce, exportFormat);
				} */
				currentValues.add(currentHtml);
			}
			return currentValues;
		}catch(Exception ex){ throw new FrameworkException(ex);}
	}

	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * @param image
	 * @param tooltip
	 * @param isSelective
	 * @param masterId
	 * @return
	 * @throws FrameworkException
	 */
	protected String getTranslationIconHTML(String image, String tooltip, boolean isSelective, String masterId) throws FrameworkException {
		StringBuffer sbHTML = new StringBuffer(250);
		if(isSelective)
			sbHTML.append("<a href=\"javascript:;\">");
		sbHTML.append("<img alt=\"");
		sbHTML.append(tooltip).append("\" height=\"16\" border=\"0\" align=\"middle\" style=\"padding:1px\" ");
		sbHTML.append("onmouseover=\"showTooltip(event, this,'").append(tooltip);
		sbHTML.append("');\" onmouseout=\"hideTooltip(event, this);\" ");
		if(isSelective)
			sbHTML.append(" onclick=\"openSelectiveTranslationWindow('").append(masterId).append("');\" ");
		sbHTML.append("src=\"../awl/images/").append(image).append("\" />");
		
		if(isSelective)
			sbHTML.append("</a>");
		
		return sbHTML.toString();
	}
	
	protected String getInlineTranslationHTML(Context context, ArtworkMaster master, String exportFormat) throws FrameworkException {
		try {
			String inlineTranslation  = AWLPropertyUtil.getI18NString(context,"emxAWL.Attribute.InlineTranslation");
			String noTranslation      = AWLPropertyUtil.getI18NString(context,"emxAWL.Tooltip.NoTranslation");

			inlineTranslation = FrameworkUtil.findAndReplace(inlineTranslation, "'", FRAMEWORK_UTIL_REPLACE_STRING);
			noTranslation = FrameworkUtil.findAndReplace(noTranslation, "'", FRAMEWORK_UTIL_REPLACE_STRING);

			String image   = "";
			String tooltip = "";
			String strInlineStatus = "";
			if(master.isTranslationElement(context))
			{
				if(master.isInlineTranslationElement(context))
				{
					image   = "AWLiconStatusInlineTranslation.gif";
					tooltip = inlineTranslation;
					strInlineStatus = AWLConstants.RANGE_YES;
				}
			}else
			{
				image   = "AWLiconStatusNoTranslation.gif";
				tooltip = noTranslation;
			}
			
			boolean export = BusinessUtil.isNotNullOrEmpty(exportFormat);

			if(BusinessUtil.isNotNullOrEmpty(image) && !export)
			{
				return getTranslationIconHTML(image, tooltip, false, master.getObjectId(context));
			}else{
				return strInlineStatus;
			}
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	private String getBaseCopyDiffFromSystemDefault(Context context, ArtworkMaster master, String exportFormat) throws FrameworkException {
		try {
			if(!master.isKindOf(context, AWLType.MASTER_COPY_ELEMENT))
				return "";
			String defaultLang = AWLPreferences.getSystemBaseLanguage(context);
			String copyElementLang = master.getBaseArtworkElement(context).getCopyTextLanguage(context);
			if(defaultLang.equals(copyElementLang))
				return "";

			String baseLangMsg = AWLUtil.strcat(AWLPropertyUtil.getI18NString(context, "emxAWL.Label.GeneratedBaseCopyLanguage"), " : ");
			String sysDefaultMsg = AWLUtil.strcat(AWLPropertyUtil.getI18NString(context, "emxAWL.Label.SystemDefaultLanguage"), " : ");
			
			StringBuffer langdiff = new StringBuffer("<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../common/images/iconSmallStatusAlert.gif\" " +
					"onmouseover=\"showTooltip(event, this,''{0}&lt;strong&gt;{1}&lt;/strong&gt;&lt;br/&gt;{2}&lt;strong&gt;{3}&lt;/strong&gt;'');\"" +
					" onmouseout=\"hideTooltip(event, this);\" />");
			
			return MessageFormat.format(langdiff.toString(), baseLangMsg, XSSUtil.encodeForJavaScript(context, copyElementLang),  
													         sysDefaultMsg, XSSUtil.encodeForJavaScript(context, defaultLang));
		} catch (Exception e) { throw new FrameworkException(e);}
	}	

	protected StringList getInlineTranslationHTML(Context context, StringList ids, String exportFormat) throws FrameworkException {
		try {
			boolean[] isKindOFMCE = BusinessUtil.isKindOf(context, ids, AWLType.MASTER_COPY_ELEMENT.get(context));
			StringList inlineTransValues = new StringList(ids.size());
			for (int i = 0; i < ids.size(); i++) {
				if(!isKindOFMCE[i]) {
					inlineTransValues.add(EMPTY_STRING);
					continue;
				} 
				String artworkMasterId = (String) ids.get(i);
				inlineTransValues.add(getInlineTranslationHTML(context, new ArtworkMaster(artworkMasterId), exportFormat));
			}
			return inlineTransValues;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	protected StringList getInlineTranslationHTML(Context context, MapList objs, String exportFormat) throws FrameworkException {
		try{
			String selTranslate = AWLAttribute.TRANSLATE.getSel(context);
			String SEL_STRUCTURED_MASTER_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			String selInlineTranslate = AWLAttribute.INLINE_TRANSLATION.getSel(context);
			boolean export = BusinessUtil.isNotNullOrEmpty(exportFormat);	
			StringList returnList = new StringList();	
			String inlineTranslation  = AWLPropertyUtil.getI18NString(context,"emxAWL.Attribute.InlineTranslation");
			String noTranslation      = AWLPropertyUtil.getI18NString(context,"emxAWL.Tooltip.NoTranslation");
			String structuredElement  = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.StructuredElement");
			
			inlineTranslation = FrameworkUtil.findAndReplace(inlineTranslation, "'", FRAMEWORK_UTIL_REPLACE_STRING);
			noTranslation = FrameworkUtil.findAndReplace(noTranslation, "'", FRAMEWORK_UTIL_REPLACE_STRING);	
			for (Map obj : (List<Map>) objs) {
				String image   = "";
				String tooltip = "";
				String strInlineStatus = "";	
				boolean isNoTranslate = "No".equals(obj.get(selTranslate));
				boolean isInline = "Yes".equals(obj.get(selInlineTranslate));
				boolean isMCE = "true".equals(obj.get(AWLType.MASTER_COPY_ELEMENT.get(context)));
				boolean isStructuredElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)obj.get(SEL_STRUCTURED_MASTER_ELEMENT));
				if(!isMCE) {
					returnList.add("");
					continue;
				}	
				
				if(isStructuredElement){
					image   = "AWLStructureCopy.png";
					tooltip = structuredElement;
				}
				
				if(isNoTranslate) {
					image   = "AWLiconStatusNoTranslation.png";
					tooltip = noTranslation;
				} else if(isInline){
					image   = "AWLiconStatusInlineTranslation.png";
					tooltip = inlineTranslation;
					strInlineStatus = AWLConstants.RANGE_YES;
				}					
				if(BusinessUtil.isNotNullOrEmpty(image) && !export)
				{
				StringBuffer sbHTML = new StringBuffer(250);
				sbHTML.append("<img alt=\"");
				sbHTML.append(tooltip).append("\" border=\"0\" align=\"middle\" style=\"padding:1px\" ");
				sbHTML.append("onmouseover=\"showTooltip(event, this,'").append(tooltip);
				sbHTML.append("');\" onmouseout=\"hideTooltip(event, this);\" ");
				sbHTML.append("src=\"../common/images/").append(image).append("\" />");
				returnList.add(sbHTML.toString());
				}else{
					returnList.add(strInlineStatus);
				}
			}	
			return returnList;
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}	
	
	protected StringList getBaseCopyDiffFromSystemDefaultHTML(Context context, StringList ids, String exportFormat) throws FrameworkException {
		try {
			boolean[] isKindOFMCE = BusinessUtil.isKindOf(context, ids, AWLType.MASTER_COPY_ELEMENT.get(context));
			StringList baseCopyDiffValues = new StringList(ids.size());
			for (int i = 0; i < ids.size(); i++) {
				if(!isKindOFMCE[i]) {
					baseCopyDiffValues.add(EMPTY_STRING);
					continue;
				} 
				String artworkMasterId = (String) ids.get(i);
				baseCopyDiffValues.add(getBaseCopyDiffFromSystemDefault(context, new ArtworkMaster(artworkMasterId), exportFormat));
			}
			return baseCopyDiffValues;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected StringList getBaseCopyDiffFromSystemDefaultHTML(Context context,MapList objectList, String exportFormat ) throws FrameworkException {
		try {
			String defaultLang = AWLPreferences.getSystemBaseLanguage(context);
			String baseCopySelectable = AWLAttribute.IS_BASE_COPY.getSel(context);
			String copyTextLangSelectable = AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context);
			StringList baseCopyDiffValues = new StringList(objectList.size());		
			StringList ids = BusinessUtil.getIdList(objectList);
			StringList mceIDs = new StringList(ids.size());
			for (Map obj : (List<Map>)objectList) {
				if("true".equals(obj.get(AWLType.MASTER_COPY_ELEMENT.get(context)))) {
					mceIDs.add((String)obj.get(SELECT_ID));
				}
			}
			String selLC =  "from["+AWLRel.ARTWORK_ELEMENT_CONTENT.get(context)+"].to.id";
			MapList aeIDs = BusinessUtil.getInfoList(context, mceIDs, selLC);			
			StringList allAEIDs = new StringList();
			for (Map obj : (List<Map>)aeIDs) {
				allAEIDs.addAll(BusinessUtil.getStringList(obj, selLC));
			}			
			StringList selAEs = BusinessUtil.toStringList(SELECT_ID, baseCopySelectable,copyTextLangSelectable );
			MapList aeInfo = BusinessUtil.getInfo(context, allAEIDs, selAEs);
			Map aeByID = BusinessUtil.groupByKey(aeInfo, SELECT_ID);
			String baseLang = "";
			for (Map obj : (List<Map>)objectList) {
				if(!"true".equals(obj.get(AWLType.MASTER_COPY_ELEMENT.get(context)))) {
					baseCopyDiffValues.add("");
					continue;
				}
				String maeID = (String) obj.get(SELECT_ID); 
				int index = mceIDs.indexOf(maeID);
				Map lcIDsMap = (Map) aeIDs.get(index);				
				StringList lcIDs = BusinessUtil.getStringList(lcIDsMap, selLC);
				for (String lcID : (List<String>)lcIDs) {
					MapList lcMap = (MapList) aeByID.get(lcID);
					Map lcInfo = (Map) lcMap.get(0);
					if("Yes".equals(lcInfo.get(AWLAttribute.IS_BASE_COPY.getSel(context)))) {
						baseLang = (String) lcInfo.get(AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context));
					}
				}	
				if(defaultLang.equals(baseLang)){
					baseCopyDiffValues.add(EMPTY_STRING);
					continue;	
				}
				String baseLangMsg = AWLUtil.strcat(AWLPropertyUtil.getI18NString(context, "emxAWL.Label.GeneratedBaseCopyLanguage"), " : ");
				String sysDefaultMsg = AWLUtil.strcat(AWLPropertyUtil.getI18NString(context, "emxAWL.Label.SystemDefaultLanguage"), " : ");				
				StringBuffer langdiff = new StringBuffer("<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../common/images/iconSmallStatusAlert.gif\" " +
						"onmouseover=\"showTooltip(event, this,''{0}&lt;strong&gt;{1}&lt;/strong&gt;&lt;br/&gt;{2}&lt;strong&gt;{3}&lt;/strong&gt;'');\"" +
						" onmouseout=\"hideTooltip(event, this);\" />");				
				baseCopyDiffValues.add(MessageFormat.format(langdiff.toString(), baseLangMsg, XSSUtil.encodeForJavaScript(context, baseLang),  
														         sysDefaultMsg, XSSUtil.encodeForJavaScript(context, defaultLang)));			
			}return baseCopyDiffValues;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	//TODO rename to commitArtWorkMasterRemove
	@com.matrixone.apps.framework.ui.ConnectionProgramCallable
	public Map commiteArtWorkMasterRemove(Context context, String[] args) throws FrameworkException 
	{
		try {
			Access.checkRequiredAccess(context, "ArtworkElementRemove");
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			
	
			MapList chgRowsMapList = UITableIndented.getChangedRowsMapFromElement(context, programMap.get("contextData"));
			MapList hCustomList = new MapList(chgRowsMapList.size());			

			for (int j = 0; j < chgRowsMapList.size(); j++)
			{ 
				Map tempMap = (Map) chgRowsMapList.get(j);
				String markup = (String) tempMap.get("markup");
				if("cut".equalsIgnoreCase(markup))
				{
					String artworkMasterRelId = (String) tempMap.get("relId");
					DomainRelationship.disconnect(context, artworkMasterRelId);
				} 
			}

			HashMap hmCustom = new HashMap();
			hmCustom.put("changedRows", hCustomList);
			return hmCustom;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	//Modified by N94 during POA Simplification Highlight in R418
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@com.matrixone.apps.framework.ui.ConnectionProgramCallable
	public Map createOrRemoveArtworkMaster(Context context, String[] args) throws FrameworkException 
	{
		boolean isContextPushed = false;
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			String brandId= (String) programMap.get("parentOID");
			Map paraMap = BusinessUtil.getParamMap(programMap);
			String parentId = (String) paraMap.get("parentOID");
			DomainObject domObj = null;
			if(BusinessUtil.isNotNullOrEmpty(brandId)){
				domObj = new DomainObject(brandId);
			}
			DomainObject domParent = null;
			String parentType = "";
			if(BusinessUtil.isNotNullOrEmpty(parentId)){
				domParent = new DomainObject(parentId);
				parentType = domParent.getInfo(context, SELECT_TYPE);
			}

			MapList chgRowsMapList = UITableIndented.getChangedRowsMapFromElement(context,  programMap.get("contextData"));	

			Map<String, Object> newArtworkMastersMap = new HashMap<String, Object>();
			MapList changedRowsMapList = new MapList();
			String strRelId=null;
			String objectId;
			StringList copyListIds = new StringList();
			StringList derivativeList = new StringList();
			for(AWLType type : AWLUtil.toArray(AWLType.PRODUCT_LINE, AWLType.CPG_PRODUCT)) {
				derivativeList.addAll(type.getDerivative(context, false,true));
			}
			
			boolean hasModifyAndFromConnectAndFromDisconnectAccess = Access.hasAccess(context,parentId, "fromdisconnect","fromconnect","modify");
			if(!hasModifyAndFromConnectAndFromDisconnectAccess) {
				//MqlUtil.mqlCommand(context, "mod bus $1 grant $2 access $3,$4,$5,$6,$7;" , true, parentId, context.getUser(), "toconnect","todisconnect","fromconnect","fromdisconnect","modify");
				ContextUtil.pushContext(context);
				isContextPushed = true;
			}
			
			for(int i=0; i<chgRowsMapList.size(); i++) {
				Map<?, ?> chgRowsMap = (Map<?, ?>) chgRowsMapList.get(i);

				String markup = (String) chgRowsMap.get("markup");
				strRelId = (String) chgRowsMap.get("relId");
				objectId = (String) chgRowsMap.get("oid");
				
                String domObjType = domObj.getInfo(context,SELECT_TYPE);
				if(BusinessUtil.isNotNullOrEmpty(objectId)&& BusinessUtil.isKindOf(context, objectId, AWLType.COPY_LIST.get(context))) {
					copyListIds.add(objectId);
				} else {
					if("cut".equalsIgnoreCase(markup)) {
						//Code to disconnect the Artwork Elements from its associated Copy Lists
			    		    ArtworkMaster artworkMasterObj = new ArtworkMaster(objectId);
			    		    String objWhere = AWLUtil.strcat("((current==", AWLState.PRELIMINARY.get(context, AWLPolicy.COPY_LIST), ")||(current==", AWLState.OBSOLETE.get(context, AWLPolicy.COPY_LIST), "))");
			    		    MapList allAssociatedCopyLists = artworkMasterObj.getCopyListsRelIds(context,parentId,objectId,objWhere);
			    		   StringList allAssociatedRelIds = BusinessUtil.toStringList(allAssociatedCopyLists, DomainRelationship.SELECT_ID);
							
							
							String REL_AM_POA = AWLRel.POA_ARTWORK_MASTER.get(context);
							StringBuilder relPattern = new StringBuilder(100);
							relPattern.append(REL_AM_POA);
							String poaRELNames = relPattern.toString();
							
							StringBuilder typePattern = new StringBuilder(100);
							typePattern.append(AWLType.POA.get(context));
							String clTypeNames = typePattern.toString();
							
							String SEL_POA_ASSOCIATED = AWLUtil.strcat(AWLConstants.TO_OPENBRACKET,AWLRel.ASSOCIATED_POA.get(context),AWLConstants.CLOSEBRACKET_FROM_ID);
							StringList busSelects = StringList.create(DomainConstants.SELECT_ID, DomainConstants.SELECT_CURRENT, SEL_POA_ASSOCIATED);
							StringList relSelects = StringList.create(DomainRelationship.SELECT_ID);
							String POA_POLICY = AWLPolicy.POA.get(context);	
							String POA_STATE_DRAFT = AWLState.DRAFT.get(context, POA_POLICY);
							String POA_STATE_PRELIMINARY = AWLState.PRELIMINARY.get(context, POA_POLICY);
							
							MapList currentAMInfo = artworkMasterObj.getRelatedObjects(context, poaRELNames, clTypeNames, busSelects, relSelects, true, true, (short)1, null, null, 0);
							MapList validAMPOAsToDisconnect = new MapList();
							for(Map amPOAInfo : (List<Map>)currentAMInfo) {
								String poaState = (String)amPOAInfo.get(DomainConstants.SELECT_CURRENT);
								String associatedPOA = (String) amPOAInfo.get(SEL_POA_ASSOCIATED);
								if((POA_STATE_DRAFT.equals(poaState) || POA_STATE_PRELIMINARY.equals(poaState)) && parentId.equals(associatedPOA))
									validAMPOAsToDisconnect.add(amPOAInfo);
							}
							allAssociatedRelIds.addAll(BusinessUtil.toStringList(validAMPOAsToDisconnect, DomainRelationship.SELECT_ID));
							
							// Process POAs to get POA
							StringList poaIds = BusinessUtil.getIdList(validAMPOAsToDisconnect);
			    			for(String currentPOAId: (List<String>) poaIds) {
			    				POA poa = new POA(currentPOAId);
			    				MapList currentPOAInfo = poa.getArtworkElementsForMaster(context, StringList.create(DomainConstants.SELECT_ID), StringList.create(DomainRelationship.SELECT_ID),  objectId,  false );
			    				allAssociatedRelIds.addAll(BusinessUtil.toStringList(currentPOAInfo, DomainRelationship.SELECT_ID));
			    			}
			    			
							if(BusinessUtil.isNotNullOrEmpty(allAssociatedRelIds))
			    		    {
			    		    
			    		    	DomainRelationship.disconnect(context, BusinessUtil.toStringArray(allAssociatedRelIds));
			    		    }
							DomainRelationship.disconnect(context, strRelId);
					} else if("new".equalsIgnoreCase(markup)) {					
						String alertMsg = AWLPropertyUtil.getI18NString(context, "emxAWL.alert.SelectPLOrProdutOrPromotion", 
															new String[]{"type"}, new String[]{AWLPropertyUtil.getTypeI18NString(context, parentType, false)});
						
						if (domObj == null || !derivativeList.contains(domObjType) ) {
							Map errorMap = new HashMap();
							errorMap.put("Action", "ERROR");				
							errorMap.put("Message", alertMsg);
							return errorMap;
						}
						Map<?, ?> newArtworkMasterMap = (Map<?, ?>) chgRowsMap.get("columns");
						String artworkMasterType = (String) newArtworkMasterMap.get("Type");
						String artMastermDisplayName = (String) newArtworkMasterMap.get("MarketingName");
						String masterArtworkCopyText = (String) newArtworkMasterMap.get("MasterArtworkCopyText");
	
						Map<String, String> copyElementData = new HashMap<String, String>();
						copyElementData.put(DomainConstants.SELECT_TYPE, artworkMasterType);
						copyElementData.put(AWLAttribute.MARKETING_NAME.get(context), artMastermDisplayName);
						copyElementData.put(AWLAttribute.DISPLAY_TEXT.get(context), masterArtworkCopyText);
						copyElementData.put(AWLAttribute.TRANSLATE.get(context), AWLConstants.RANGE_YES);
						copyElementData.put(AWLAttribute.INLINE_TRANSLATION.get(context), AWLConstants.RANGE_NO);
						copyElementData.put(AWLAttribute.BUILD_LIST.get(context), AWLConstants.RANGE_NO);
	
						ArtworkMaster am = ArtworkMaster.createMasterCopyElement(context, artworkMasterType, copyElementData,domObj, new ArrayList<Country>());
						
						MapList parentRelList = am.related(AWLUtil.toArray(AWLType.PRODUCT_LINE, AWLType.CPG_PRODUCT), 
								                           AWLUtil.toArray(AWLRel.ARTWORK_MASTER)).from().query(context);
						Map newArtworkMasterRowMap = new HashMap();
						newArtworkMasterRowMap.put("markup", "new");
						newArtworkMasterRowMap.put("oid", am.getId(context));
						newArtworkMasterRowMap.put("columns", newArtworkMasterMap);
						newArtworkMasterRowMap.put("rowId", chgRowsMap.get("rowId"));
						newArtworkMasterRowMap.put("pid", brandId);
						if(parentRelList.size()>0)  {
							String relId = BusinessUtil.getString((Map)parentRelList.get(0), DomainRelationship.SELECT_ID);
							if(BusinessUtil.isNotNullOrEmpty(relId))
								newArtworkMasterRowMap.put("relid", relId);
						}
						changedRowsMapList.add(newArtworkMasterRowMap);
					}
					if(!newArtworkMastersMap.containsKey("Action")) {
						newArtworkMastersMap.put("Action", "success");
						newArtworkMastersMap.put("changedRows", changedRowsMapList);
					}
				}
			}
			//We are handling only the Cut cases for Copy List. so no additional checks done
			//To avoid multiple DB hits, getting all the selected Copy Lists together and processing here.
				if(copyListIds.size()>0){
					if(BusinessUtil.isKindOf(context, parentId, AWLType.CPG_PRODUCT.get(context))){
						CPGProduct product = new CPGProduct(parentId);
						product.removeCopyLists(context, copyListIds);
					} else {
						Brand brand = new Brand(parentId);
						brand.removeCopyLists(context, copyListIds);
				}
			}
			/*
			if(!hasModifyAndFromConnectAndFromDisconnectAccess) {	
				String personUserAgent = PropertyUtil.getSchemaProperty(context, "person_UserAgent");
				MqlUtil.mqlCommand(context, "mod bus $1 revoke grantor $2 grantee $3;", true, parentId, personUserAgent, context.getUser());
			}
			*/
			return newArtworkMastersMap;
		}
		catch (Exception e) { e.printStackTrace();
			throw new FrameworkException(e);
			}finally {
				if(isContextPushed) {
					ContextUtil.popContext(context);
				}
			}
	}

	
	/**
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * @author VI5
	 */
	public boolean inlineTranslationAccess(Context context, String[] args) throws FrameworkException
	{
		boolean canShow = false;

		try{
			Map programMap     = (Map)JPO.unpackArgs(args);
			String masterId   = BusinessUtil.getObjectId(programMap);
			String mode        = BusinessUtil.getString(programMap, "mode");

			if(!"edit".equalsIgnoreCase(mode)&& !ArtworkContent.isMasterListitem(context, masterId) && !ArtworkContent.isListItemCopy(context, masterId))
			{
				String elementType = BusinessUtil.getInfo(context, masterId, DomainConstants.SELECT_TYPE);
				if(!ArtworkContent.isCompositeCopyElementType(context, elementType))
				{
					canShow =  true;
				}
			} else if("edit".equalsIgnoreCase(mode) && ArtworkContent.isTranslationElement(context, masterId) &&
						!ArtworkContent.isMasterListitem(context, masterId) && !ArtworkContent.isListItemCopy(context, masterId))
			{
					
				canShow = !isinlineTranslationEditable(context, masterId);
			}
			canShow = canShow ? !new ArtworkMaster(masterId).isStructuredElementRoot(context) : canShow;
			
			return canShow;
		} catch(Exception e){ throw new FrameworkException(e);}
	}

	/***
	 * 2011x.FD04
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	public boolean inlineTranslationEditAccess(Context context, String[] args) throws FrameworkException
	{
		try{
			boolean canEdit    = false;
			Map programMap     = (Map)JPO.unpackArgs(args);
			String masterId   = BusinessUtil.getObjectId(programMap);
			String mode        = BusinessUtil.getString(programMap, "mode");

			if("edit".equalsIgnoreCase(mode) && ArtworkContent.isTranslationElement(context, masterId) && !ArtworkContent.isMasterListitem(context, masterId) && !ArtworkContent.isListItemCopy(context, masterId))
			{
				canEdit = isinlineTranslationEditable(context, masterId);
			}
			
			return canEdit = canEdit ? !new ArtworkMaster(masterId).isStructuredElementRoot(context) : canEdit;
	
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	/** @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * @author VI5
	 */
	public int updateInlineTranslation(Context context, String[] args) throws FrameworkException
	{
		try{
			Map programMap   = (HashMap) JPO.unpackArgs(args);
			Map paramMap     = BusinessUtil.getParamMap(programMap);

			String inlineTranslation = BusinessUtil.getString(paramMap, "New Value");
			String masterId = BusinessUtil.getObjectId(paramMap);
			

			BusinessUtil.setAttribute(context, masterId, AWLAttribute.INLINE_TRANSLATION.get(context), inlineTranslation);
			
			ArtworkMaster master = new ArtworkMaster(masterId);
			if(master.isStructuredElement(context)) {
				if(AWLConstants.RANGE_YES.equals(inlineTranslation)) {
					ArtworkMaster root = master.getStructuredElementRoot(context);
					root.updateStructureInPOA(context);
				} else {
					ArtworkMaster root = master.getStructuredElementRoot(context);
					MapList structure = root.getStructuredElementList(context);
					
					StringList inlineLCsToDel = new StringList();
					
					String SEL_COPY_TEXT_LANG = AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context);
					StringList selects = StringList.create(DomainObject.SELECT_ID, SEL_COPY_TEXT_LANG);
					
					//Delete the inline copies created for this structure element
					MapList lcCopies = master.getArtworkElements(context, selects, null, null);
					for (Map element : (List<Map>)lcCopies) {
						String lang = (String) element.get(SEL_COPY_TEXT_LANG);
						if(lang.indexOf(',') > 0) {
							inlineLCsToDel.add((String)element.get(DomainObject.SELECT_ID));
						}
					}					

					boolean hasInline = BusinessUtil.toStringList(structure, AWLAttribute.INLINE_TRANSLATION.getSel(context)).
							contains(AWLConstants.RANGE_YES);

					//If there are no inline elements, no need to retain the inline elements that are already created.
					if(!hasInline) {
						MapList rootElements = root.getArtworkElements(context, selects, null, null);
						for (Map element : (List<Map>)rootElements) {
							String lang = (String) element.get(SEL_COPY_TEXT_LANG);
							if(lang.indexOf(',') > 0) {
								inlineLCsToDel.add((String)element.get(DomainObject.SELECT_ID));
							}
						}
					}
					
					if(BusinessUtil.isNotNullOrEmpty(inlineLCsToDel))
						DomainObject.deleteObjects(context, BusinessUtil.toStringArray(inlineLCsToDel));
				}
				 
			}
			
			return 0;
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}
	/** Below program will get copy text of  Master copy Element to display in web form for view  and edit mode
	 */
	public  String getCopyTextForMasterCopy(Context context, String[] args) throws FrameworkException
	{
		try{
			//This program "should not" return programHTMLOutput
			Map programMap = (Map) JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get("requestMap");
			String masterId = (String) mpRequest.get(OBJECT_ID);
			String copytextlog="";
			ArtworkMaster artworkMaster = new ArtworkMaster(masterId);
			ArtworkContent baseElement = artworkMaster.getBaseArtworkElement(context);
			if(!baseElement.isGraphicElement())
			{
				copytextlog = ((CopyElement)baseElement).getCopyText(context, true);
				copytextlog = addStyleToHTML(context,copytextlog);
			}
			return baseElement.isGraphicElement() ? "" : copytextlog;
		}catch(Exception e){ throw new FrameworkException(e);}
	}

		public  String getCopyTextForMasterCopyEdit(Context context, String[] args) throws FrameworkException
	{
		try{
			//This program "should not" return programHTMLOutput
			Map programMap = (Map) JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get("requestMap");
			String masterId = (String) mpRequest.get(OBJECT_ID);
			String copytextlog="";
			ArtworkMaster artworkMaster = new ArtworkMaster(masterId);
			ArtworkContent baseElement = artworkMaster.getBaseArtworkElement(context);
			if(!baseElement.isGraphicElement())
			{
				copytextlog = ((CopyElement)baseElement).getCopyText(context, true);
				//copytextlog = addStyleToHTML(context,copytextlog);
			}
			return baseElement.isGraphicElement() ? "" : copytextlog;
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	public static String addStyleToHTML(Context context, String copytextlog) throws FrameworkException
	{
		try{
			//copytextlog = "<div dir=\"rtl\">abcd</div>";
			String outputXML=copytextlog;
			Element elem = null;
			if(copytextlog !="")
			{
				if((copytextlog.contains("rtl") || copytextlog.contains("RTL")))
				{
					if(!copytextlog.contains("<div>") && !copytextlog.contains("<DIV>")){
						StringBuilder copytextlogDiv = new StringBuilder();
						copytextlogDiv.append("<div>");
						copytextlogDiv.append(copytextlog);					
						copytextlogDiv.append("</div>");
						copytextlog = copytextlogDiv.toString(); 
					}
					Document doc = convertStringToXMLDocument(copytextlog);
					if(doc!=null)
					{
						NodeList divList = doc.getElementsByTagName("div");
						NodeList spanList = doc.getElementsByTagName("span");
						
						if(divList.getLength()!= 0)
						{
							/*if(divList.getLength() == 0)
							{
								StringBuilder copytextlogDiv = new StringBuilder();
								copytextlogDiv.append("<div>");
								copytextlogDiv.append(copytextlog);					
								copytextlogDiv.append("</div>");
								copytextlog = copytextlogDiv.toString(); 
								doc = convertStringToXMLDocument(copytextlog);
								divList = doc.getElementsByTagName("div");
								spanList = doc.getElementsByTagName("span");
							}*/
							for (int itr = 0; itr < divList.getLength(); itr++) {
								Node node = divList.item(itr);
								if (node.getNodeType() == Node.ELEMENT_NODE) {
									 elem = (Element) node;
									 elem.setAttribute("style", "white-space:pre;text-align: right;");
								}
							}
							for (int itr = 0; itr < spanList.getLength(); itr++) {
								Node node = spanList.item(itr);
								if (node.getNodeType() == Node.ELEMENT_NODE) {
									 elem = (Element) node;
									 elem.setAttribute("style", "float:none;margin-right: 0px;");
								}
							}
							outputXML = convertXmlDomToString(doc);
							outputXML = outputXML.replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>","");
						}						
					}
				}
			}
			return outputXML;
		}
		catch (Exception e) {
			return copytextlog;
		}
	}

	public static String convertXmlDomToString(Document xmlDocument) {

		TransformerFactory tf = TransformerFactory.newInstance();
		Transformer transformer;
		try {
			transformer = tf.newTransformer();
		
			// Uncomment if you do not require XML declaration
			// transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
		
			//A character stream that collects its output in a string buffer,
			//which can then be used to construct a string.
			StringWriter writer = new StringWriter();
		
			//transform document to string
			transformer.transform(new DOMSource(xmlDocument), new StreamResult(writer));
		
			return writer.getBuffer().toString();
		}catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private static Document convertStringToXMLDocument(String xmlString) {
		//Parser that produces DOM object trees from XML content
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	
	    //API to obtain DOM Document instance
	    DocumentBuilder builder = null;
	    try {
			//Create DocumentBuilder with default configuration
			builder = factory.newDocumentBuilder();
	
			//Parse the content to Document object
			Document doc = builder.parse(new InputSource(new StringReader(xmlString)));
			return doc;
	    } catch (Exception e) {
			e.printStackTrace();
	    }
	    return null;
	}
	/** updates "Master Copy Text" attribute value of "Copy Element" (Part) attached to "Master Copy Element" in WebForm.
	 * This method is re-written to support new OOTB data model by VD8.
	 * @author VD8
	 * @param context
	 * @param args
	 * @return integer (0 = Success)
	 * @throws FrameworkException
	 * @since 2012x
	 */
	public int updateCopyTextForMasterCopy(Context context, String[] args) throws FrameworkException
	{
		try{
			String strNewCopyTextValue = "";
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map paramMap = (HashMap) programMap.get("paramMap");
			String masterId = (String)paramMap.get(OBJECT_ID);
			String[] strNewCopyText = (String[]) paramMap.get("New Values");

			for ( int j=0; j <strNewCopyText.length; j++)
			{
				strNewCopyTextValue = strNewCopyText[j];
			}

			ArtworkMaster artworkMaster = new ArtworkMaster(masterId);

			if(artworkMaster != null)
			{
				StringList slCopyElements = artworkMaster.getInfoList(context, AWLUtil.strcat("relationship[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].to.id"));
				String copyElementId = "";
				CopyElement copyElement = null;
				String strIsBaseCopy = "";
				for(int j=0; j<slCopyElements.size(); j++)
				{
					copyElementId =(String)slCopyElements.get(j);
					copyElement = new CopyElement(copyElementId);
					strIsBaseCopy = copyElement.getAttributeValue(context, AWLAttribute.IS_BASE_COPY.get(context));
					if(!"".equalsIgnoreCase(strIsBaseCopy) && !strIsBaseCopy.isEmpty() && strIsBaseCopy.equalsIgnoreCase("Yes"))
					{
						copyElement.setCopyText(context, strNewCopyTextValue);
						break;
					}
				}
			}
			return 0;
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	public String getRestrictedCountriesInfo(Context context,String[] args)throws FrameworkException
	{
		try{
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map paramMap = (HashMap) programMap.get("paramMap");
			String masterId = (String)paramMap.get(OBJECT_ID);
			ArtworkMaster artworkMaster = new ArtworkMaster(masterId);
			MapList mList = artworkMaster.related(AWLType.COUNTRY, AWLRel.COUNTRIES_ASSOCIATED).name().query(context);
			StringList slCountries = BusinessUtil.toStringList(mList, SELECT_NAME);	
			return FrameworkUtil.join(slCountries,",");	
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	/**
	 * This method used control access on modifying copy text from Brand/Product Artwork Elements tab 
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public StringList isMasterCopyElementEditable(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList artworkContentList=(MapList)programMap.get("objectList");
			Map requestMap = (Map)programMap.get(BusinessUtil.REQUEST_MAP);
			boolean isProductLineArtworkElements = false;
			if(BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(requestMap, "isProductLineArtworkElements")))
				isProductLineArtworkElements = "true".equalsIgnoreCase(BusinessUtil.getString(requestMap, "isProductLineArtworkElements"));
			StringList objectIdsList = BusinessUtil.toStringList(artworkContentList, SELECT_ID);
			StringList retList = new StringList(objectIdsList.size());
			//PM or MCAU only can modify copy text, no need any further checks
			if(!(Access.isMasterCopyAuthor(context) || Access.isProductManager(context))) {
				for (int i = 0; i < objectIdsList.size(); i++) {
					retList.add(Boolean.FALSE.toString());
				}
			} else {
				String PRELIMINARY = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT);

				String baseCopyModifySelWhere = AWLUtil.strcat("from[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "|to.attribute[", AWLAttribute.IS_BASE_COPY.get(context), "]=='Yes'].to.current.access[modify]");
				String baseCopyModifySel = AWLUtil.strcat("from[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].to.current.access[modify]");
				String kindofmce = AWLUtil.strcat("type.kindof[", AWLType.MASTER_COPY_ELEMENT.get(context), "]");
				String SEL_BUILD_LIST = AWLAttribute.BUILD_LIST.getSel(context);
				String SEL_INTERFACE_STRUCTURED_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
				if(!isProductLineArtworkElements)
					artworkContentList = BusinessUtil.getObjDetails(context, objectIdsList, StringList.create(SELECT_ID, baseCopyModifySelWhere, SELECT_CURRENT, kindofmce, SEL_BUILD_LIST, SEL_INTERFACE_STRUCTURED_ELEMENT), null);
				Map<String, Map> amInfoById = ((List<Map>)artworkContentList).stream().collect(Collectors.toMap(currentMap -> {
					return (String)currentMap.get(SELECT_ID);
				}, currentMap -> {
					return currentMap;
				}));
				
				for (String id: objectIdsList) {
					Map currentMap = amInfoById.get(id);
					boolean isMasterInPreliminary = PRELIMINARY.equals((String)currentMap.get(SELECT_CURRENT));
					boolean hasModAccessOnBaseCopy = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)currentMap.get(baseCopyModifySel));
					boolean isCopyElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) currentMap.get(kindofmce));
					boolean isBuildList = AWLConstants.RANGE_YES.equalsIgnoreCase((String) currentMap.get(SEL_BUILD_LIST));
					boolean isSER = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) currentMap.get(SEL_INTERFACE_STRUCTURED_ELEMENT));
					
					boolean isEditable = isMasterInPreliminary && hasModAccessOnBaseCopy && isCopyElement && !isBuildList && !isSER;
					retList.add(isEditable ? Boolean.TRUE.toString() : Boolean.FALSE.toString());
				}			
			}
			return retList;
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	public boolean isMasterArtworkElementEditable(Context context, String[] args) throws FrameworkException
	{
		try{
			if(!isNotCompositeElement(context, args))
				return false;
			
			Map programMap     = (Map)JPO.unpackArgs(args);
			String artworkMasterId   = BusinessUtil.getObjectId(programMap);
			ArtworkMaster artworkMaster = new ArtworkMaster(artworkMasterId);
			StringList slObject = StringList.create(SELECT_CURRENT, MODIFY_ACCESS);
			  
			Map mapArtworkMaster = artworkMaster.getInfo(context, slObject);
			
			return AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.ARTWORK_ELEMENT, (String) mapArtworkMaster.get(SELECT_CURRENT)) &&
				   Boolean.TRUE.toString().equalsIgnoreCase((String) mapArtworkMaster.get(MODIFY_ACCESS)) && 
				   (Access.isMasterCopyAuthor(context) || Access.isProductManager(context));
			
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	public boolean isinlineTranslationEditable(Context context, String artworkMasterId) throws FrameworkException
	{
		try{
			ArtworkMaster artworkMaster = new ArtworkMaster(artworkMasterId);
			
			boolean hasRole = Access.isProductManager(context) || Access.isMasterCopyAuthor(context);
			boolean hasModify = FrameworkUtil.hasAccess(context, artworkMaster , "modify") ;
			boolean hasValidState = AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.ARTWORK_ELEMENT, artworkMaster.getInfo(context, SELECT_CURRENT));
			boolean hasValidRev = artworkMaster.getInfoList(context, "revisions").size() == 1; 
			boolean hasValidPOA = false;
			
			if(artworkMaster.isStructuredElement(context)) {
				ArtworkMaster root = artworkMaster.getStructuredElementRoot(context);
				StringList states = AWLPolicy.POA.getStates(context, AWLState.DRAFT, AWLState.OBSOLETE);
				MapList poas = root.getPOAs(context, BusinessUtil.toStringArray(states));
				hasValidPOA = BusinessUtil.isNullOrEmpty(poas);
			} else {
				hasValidPOA = BusinessUtil.isNullOrEmpty(artworkMaster.getPOAs(context));
			}
			
			return hasRole && hasModify && hasValidState && hasValidRev && hasValidPOA;
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	protected boolean[] isMasterCopyElementEditable(Context context, StringList objectIdsList) throws FrameworkException
	{
		//Do not add any specific checks like Artwork Element state, etc because same method is being used in multiple places
		//Artwork Package page while authoring, Brand-Artwork elements tab etc
		try {
			String kindofmce = AWLUtil.strcat("type.kindof[", AWLType.MASTER_COPY_ELEMENT.get(context), "]");
			String SEL_BUILD_LIST = AWLAttribute.BUILD_LIST.getSel(context);
			String SEL_INTERFACE_STRUCTURED_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);

			StringList selects = StringList.create(kindofmce, SEL_BUILD_LIST, SEL_INTERFACE_STRUCTURED_ELEMENT);
			MapList ml = BusinessUtil.getInfo(context, objectIdsList, selects);
			boolean[] returnArr = new boolean[ml.size()];

			for(int i=0; i<ml.size(); i++) {
				Map m = (Map) ml.get(i);
				boolean isCopyElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) m.get(kindofmce));
				boolean isBuildList = AWLConstants.RANGE_YES.equalsIgnoreCase((String) m.get(SEL_BUILD_LIST));
				boolean isSER = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) m.get(SEL_INTERFACE_STRUCTURED_ELEMENT));
				returnArr[i] = isCopyElement && !isBuildList && !isSER;
			}
			return returnArr;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	public StringList getArtworkMasterStatusColumn(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			
			MapList objectList = BusinessUtil.getObjectList(programMap);
			StringList ids     = BusinessUtil.getIdList(objectList); 
			
			Map requestMap          = BusinessUtil.getRequestParamMap(programMap);
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);
			
			StringList additionalInfo = new StringList();
			StringList geographicValues = getGeographicLocationHTML(context, objectList, exportFormat);
			StringList inlineValues = getInlineTranslationHTML(context, objectList, exportFormat);
			StringList baseisDiff = getBaseCopyDiffFromSystemDefaultHTML(context, objectList, exportFormat);
			String space16Image = "<img src=\"../common/images/utilSpacer.gif\" width=\"16px\" height=\"16px\" />";

			for(int i=0; i < geographicValues.size(); i++)
			{
				String geographicValue = (String)geographicValues.get(i);
				String inlineValue = (String)inlineValues.get(i);
				String base = (String) baseisDiff.get(i);
				
				geographicValue = BusinessUtil.isNullOrEmpty(geographicValue) ? space16Image : geographicValue;
				inlineValue = BusinessUtil.isNullOrEmpty(inlineValue) ? space16Image : inlineValue;
				base = BusinessUtil.isNullOrEmpty(base) ? space16Image : base;
					
				String artworkAdditionalInfoValue = AWLUtil.strcat(geographicValue, inlineValue, base);
				additionalInfo.add(artworkAdditionalInfoValue);
			}
			return additionalInfo;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	

	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * @param context
	 * @param ids
	 * @param exportFormat
	 * @return
	 * @throws FrameworkException
	 */
	public StringList getPromotionIconHTML(Context context, StringList ids, String exportFormat) throws FrameworkException {
		/*try {
			boolean[] isKindOFMAE = BusinessUtil.isKindOf(context, ids, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
			StringList isPromotion = BusinessUtil.getInfo(context, ids, AWLAttribute.IS_PROMOTIONAL_ARTWORK.getSel(context));
			StringList promotionValues = new StringList(ids.size());
			
			boolean isExport = BusinessUtil.isNotNullOrEmpty(exportFormat);
			String iconToolTip = AWLPropertyUtil.getI18NString(context,"emxAWL.ToolTip.PromotionalArtworkElement");
			iconToolTip  = FrameworkUtil.findAndReplace(iconToolTip, "'", FRAMEWORK_UTIL_REPLACE_STRING);
			StringBuffer html = new StringBuffer(250);
			html.append( "<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../awl/images/AWLPromotionalOptionIcon.gif\" ");
			html.append( "onmouseover=\"showTooltip(event, this,'").append(iconToolTip).append("');\" ");
			html.append( "onmouseout=\"hideTooltip(event, this);\" ");
			html.append( " />");				
			
			for (int i = 0; i < ids.size(); i++) {
				if(!isKindOFMAE[i] || !"TRUE".equalsIgnoreCase(isPromotion.get(i).toString())) {
					promotionValues.add(EMPTY_STRING);
					continue;
				}
				promotionValues.add(isExport ? "Yes" : html.toString());
			}
			return promotionValues;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}	
	
	/** 
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Returns SelectiveTranslation Column detail
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Vector       - list of SelectiveTranslation column info
	 * @throws  Exception    - if operation fails
	 */
	public StringList getSelectiveTranslationHTML(Context context, Map programMap) throws FrameworkException
	{
		/*StringList selTrans = new StringList();
		try
		{
			Map requestMap          = BusinessUtil.getRequestParamMap(programMap);
			String strObjectID 		= BusinessUtil.getObjectId(requestMap);
			MapList objectList      = BusinessUtil.getObjectList(programMap);
			if (BusinessUtil.isKindOf(context, strObjectID, AWLType.PROMOTIONAL_OPTION.get(context))) {
				return selTrans;
			}
			
			try {Access.checkRequiredAccess(context, "SelectiveTranslation");} catch (Exception e) {return selTrans;}
			
			String tooltip = AWLPropertyUtil.getI18NString(context,"emxAWL.Heading.SelectiveTranslations");
			tooltip = FrameworkUtil.findAndReplace(tooltip, "'", FRAMEWORK_UTIL_REPLACE_STRING);
			String image   = "AWLiconStatusSelectiveTranslation.gif";
			for(Iterator oItr = objectList.iterator(); oItr.hasNext();)
			{
				Map objectMap    = (Map)oItr.next();
				String masterId = BusinessUtil.getId(objectMap);
				String html   = EMPTY_STRING;
				//TODO move isCopyElement to artworkmaster
				if(BusinessUtil.isNotNullOrEmpty(masterId) &&
						ArtworkElementUtil.isMasterCopyElement(context, masterId) &&
							!ArtworkContent.isCompositeCopyElement(context, masterId))
				{
					ArtworkMaster master = new ArtworkMaster(masterId);
					if(master.isTranslationElement(context))
						html = getTranslationIconHTML(image, tooltip, true, masterId);
				}
				selTrans.add(html);
			}
		}catch(Exception ex){ throw new FrameworkException(ex);}
		return selTrans;*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}

    /** This method gets the object Structure List for the context Master Artwork Element object.
     * 	This method gets invoked by settings in the command which displays the 
     * 	Structure Navigator for Master Artwork Element type objects
     *  @param context the eMatrix <code>Context</code> object
     *  @param args    holds the following input arguments:
     *  	paramMap   - Map having object Id String
     *  @return MapList containing the object list to display in Master Artwork Element structure navigator
     *  @throws Exception if the operation fails
     * @author Raghavendra M J 
     */
     public static MapList getArtworkStructureList(Context context, String[] args) throws FrameworkException 
     {
    	 try {
    		 HashMap programMap = (HashMap) JPO.unpackArgs(args);
    		 HashMap paramMap   = (HashMap)programMap.get(BusinessUtil.PARAM_MAP);
    		 String objectId    = BusinessUtil.getObjectId(paramMap);
    		 
    		 ArtworkMaster artMaster =  new ArtworkMaster(objectId);	    	    	 
    		 //Adding Structurd Master Only to the View
    		 if(artMaster.isStructuredElementRoot(context))
    			 return artMaster.getStructuredElementList(context);
    		 else 
				 return artMaster.getArtworkElements(context, null, null, null);
    	 } catch(Exception e){ throw new FrameworkException(e);}
     }
     
     
     /** Copies the Artwork Element
      *  @param context the eMatrix <code>Context</code> object
      *  @param args    holds the following input arguments: paramMap   - Map having object Id String
      *  @return Map 	containing the object copied Structured Root Master Id
      *  @throws Exception if the operation fails
      *  @author Raghavendra M J
      *  @Since VR2018x Created during 'Nutrition Facts Highlight'
      */
 	@com.matrixone.apps.framework.ui.CreateProcessCallable
 	public Map copyArtworkElement(Context context, String[] args) throws FrameworkException 
 	{
 		try 
 		{
 			Map programMap = (Map) JPO.unpackArgs(args);
 			Map paraMap = BusinessUtil.getParamMap(programMap);

 			//If Place of Origin is different then we need to consider the  PlaceOfOriginOID else context parent id passed from JSP.
 			String placeOfOriginId= (String) programMap.get("PlaceOfOriginOID");
 			if(BusinessUtil.isNullOrEmpty(placeOfOriginId))
 				placeOfOriginId= (String) programMap.get("parentOID");
 			
 			String artworkMasterId= (String) programMap.get("artworkMasterId");
 			Map attributeDetails = new HashMap();
 			attributeDetails.put("description", (String) programMap.get("ArtworkChangeDescription"));
 			attributeDetails.put("title", (String) programMap.get("Title"));
 			attributeDetails.put("marketingName", (String) programMap.get("DisplayName"));
 			attributeDetails.put("mcsUrl", (String) programMap.get("mcsUrl"));

 			ArtworkMaster oldArtworkMasterRoot = new ArtworkMaster(artworkMasterId);
 			
 			ArtworkMaster newArtworkMasterRoot = null;
 			String newArtworkMasterId = ""; 
 			if(oldArtworkMasterRoot.isKindOf(context, AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.get(context))){
 				newArtworkMasterRoot = oldArtworkMasterRoot.copyMasterImageElement(context, attributeDetails, placeOfOriginId);
 				newArtworkMasterId = newArtworkMasterRoot.getObjectId(context);
 				
 			} else {
 				
 				newArtworkMasterRoot = oldArtworkMasterRoot.createMasterAndConnectAndConnectLocalCopies(context, attributeDetails, placeOfOriginId);

 	 			boolean isStructuredElement = oldArtworkMasterRoot.isStructuredElementRoot(context);
 	 			if(isStructuredElement){

 	 				MapList structuredElementList = BusinessUtil.toUniqueMapList(oldArtworkMasterRoot.getStructuredElementList(context, null, null), DomainRelationship.SELECT_ID);
 	 				for (Map structuredElementMap :(List<Map>) structuredElementList) {

 	 					String elementId = (String)  structuredElementMap.get(SELECT_ID);
 	 					ArtworkMaster oldStructuredArtworkMaster = new ArtworkMaster(elementId);
 	 					ArtworkMaster newStructuredArtworkMaster = oldStructuredArtworkMaster.createMasterAndConnectAndConnectLocalCopies(context, attributeDetails, newArtworkMasterRoot.getObjectId(context));
 	 				}
 	 			}

 	 			newArtworkMasterId = newArtworkMasterRoot.getObjectId(context);
 			}
 			
 			HashMap returnMap = new HashMap(1);
 			returnMap.put(SELECT_ID, newArtworkMasterRoot.getObjectId(context));

 			return returnMap;
 		}
 		catch(Exception e){
 			throw new FrameworkException(e);
 		}
 	}
 	
	public Object getArtworkMasterCreateTypes(Context context, String[] args) throws FrameworkException {
		try{
			String selectedTypes ="Distribution Statement Master Copy,Importer Statement Master Copy,Internal Package Identifier Master Copy,Local Contact Information Master Copy\r\n" + 
					",Location of Origin Master Copy,Lot Number Master Copy,Manufacturer Statement Master Copy,Manufacturing Site Master Copy\r\n" + 
					",Online Printer Header Master Copy,Packing Statement Master Copy,Regional Contact Information Master Copy,Allergen Statements Master Copy\r\n" + 
					",Warning Statements Master Copy,Target Market Master Copy,Active Ingredients Declaration Master Copy,Active Ingredients Header Master Copy\r\n" + 
					",Drug Facts Master Copy,Environmental Statements Master Copy,Inactive Ingredients Declaration Master Copy,Inactive Ingredients Header Master Copy\r\n" + 
					",Ingredients Declaration Master Copy,Ingredients Header Master Copy,Nutrition Claims Master Copy,Nutrition Facts Master Copy\r\n" + 
					",Preservatives Master Copy,Product Use Master Copy,Quality Statements Master Copy,Registration Information Master Copy\r\n" + 
					",Shelf Life Statement Master Copy,Technical Facts Master Copy,Content Claim Master Copy,Disclaimer Master Copy\r\n" + 
					",Marketing Claim Master Copy,Marketing Master Copy,Not for Sale Statement Master Copy,Packaging Claim Master Copy\r\n" + 
					",Pricing Statement Master Copy,Product Features Master Copy,Promotional Master Copy,Third Party Endorsements Master Copy\r\n" + 
					",Violator Master Copy,Warranty Description Master Copy,Gross Content Statement Master Copy,Net Content Statement Master Copy\r\n" + 
					",Package Count Master Copy,Copyright Trademark Statement Master Copy,Patent Numbers Master Copy,Patent Statement Master Copy\r\n" + 
					",Under License Statement Master Copy,Additional Product Variant Information Master Copy,Brand Name Master Copy,Functional Name Master Copy\r\n" + 
					",Product or Statement of Identity Master Copy,Sub Brand Name Master Copy,Trade Item Form Description Master Copy,Variant Master Copy\r\n" + 
					",Assembly Instructions Master Copy,Contact Information Master Copy,Disposal Information Master Copy,Opening Instructions Master Copy\r\n" + 
					",Other Instructions Master Copy,Preparation Instructions Master Copy,Recycle Statements Master Copy,Storage Instructions Master Copy\r\n" + 
					",Usage Instructions Master Copy,Website Master Copy,Consumer Guarantee Master Copy,Cross Sell Master Copy\r\n" + 
					",Diet Exchanges Master Copy,Icon Variable Text Master Copy,Product Display Disclaimer Master Copy,Recipe Master Copy\r\n" + 
					",Sweepstakes Offer Master Copy";
			StringList slTypes =  FrameworkUtil.split(selectedTypes, ",");
			HashMap tempMap = new HashMap();
			tempMap.put("field_choices", slTypes);
		    tempMap.put("field_display_choices", slTypes);
		    return tempMap;
		} catch(Exception e) {throw new FrameworkException(e);}
	}
	
}

