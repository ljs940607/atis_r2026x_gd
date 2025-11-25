/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved .
**  This program contains proprietary and trade secret information of MatrixOne ,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/

import java.text.MessageFormat;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.CopyList;
import com.matrixone.apps.awl.dao.GraphicDocument;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLInterface;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLType;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPreferences;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUIUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.ArtworkElementUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.cpd.dao.Country;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIComponent;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

public class AWLArtworkElementUIBase_mxJPO extends AWLObject_mxJPO
{
	private static final String LABEL_RANGE_YES = "emxAWL.Label.Range.Yes";
	private static final String TO_OPEN = "to[";
	//private static final String FROM_OPEN = "from[";
	private static final long serialVersionUID = 5532051551966437756L;

	private static final String OBJECT_ID = "objectId";
	private static final String RANGE_TRUE = "true";
	private static final String EXPORT_FORMAT = "exportFormat";
	
	public AWLArtworkElementUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}
	
	/**
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 * deperecated by N94 during POA Simplification Highlight since not used in the application
	 */
	@Deprecated
	public boolean showReviseForArtworkElement (Context context, String[] args) throws FrameworkException
	{
		/*try
		{
			Map paramMap 					= (Map)JPO.unpackArgs(args);
			String elementId 				= (String)paramMap.get(OBJECT_ID);	
			DomainObject copyElement 		= new DomainObject(elementId);
			String latestElementRevId 		= copyElement.getLastRevision(context).getObjectId();
			boolean isCommandVisible 		= true;
			String elementState 			= BusinessUtil.getInfo(context, 
												latestElementRevId, DomainConstants.SELECT_CURRENT);
			
			if(ArtworkElementUtil.isCopyContent(context, elementId))
			{
				elementId = ArtworkElementUtil.getCopyElementByCopy(context, elementId).get(0).toString();
				Map map = new HashMap();
				map.put("objectId", elementId);
				isCommandVisible 			=	showReviseForCopyContent(context, JPO.packArgs(map));
				
			}else if(ArtworkElementUtil.isMasterCopyElement(context, elementId))
			{
				String REVIEW = AWLState.REVIEW.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
				String RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);

				if(RELEASE.equals(elementState))
				{
					StringList localcopyIDList		= ArtworkElementUtil.getLocalCopyByCopyElement(context, latestElementRevId);
					for(int x = 0; x < localcopyIDList.size(); x++)
					{
						String localId 			= (String) localcopyIDList.get(x);
						String localIdState		= BusinessUtil.getInfo(context, localId, DomainConstants.SELECT_CURRENT);
						
						if(REVIEW.equals(localIdState))
						{
							isCommandVisible 		= false;
							break;
						}
					}
				}else
				{
					isCommandVisible 		= false;
				}
			}
			
			return isCommandVisible;
		} catch (Exception e) { throw new FrameworkException(e); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public boolean showReviseForCopyContent (Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map paramMap 					= (Map)JPO.unpackArgs(args);
			String elementId 				= (String)paramMap.get(OBJECT_ID);	
			String tRowId = (String) paramMap.get("emxTableRowId");
			String isFromRMB = BusinessUtil.getString(paramMap, "isFromRMB");
			if(BusinessUtil.isNotNullOrEmpty(tRowId)&& RANGE_TRUE.equalsIgnoreCase(isFromRMB)) {
				elementId = (String)BusinessUtil.parseTableRowId(tRowId).get(OBJECT_ID);
			} 

			DomainObject contextObject 		= new DomainObject(elementId);
			String latestElementRevId 		= contextObject.getLastRevision(context).getObjectId();
			boolean isCommandVisible 		= false;
			String elementState 			= BusinessUtil.getInfo(context, 
												latestElementRevId, DomainConstants.SELECT_CURRENT);
			if (BusinessUtil.isNotNullOrEmpty(elementId)
					&& elementId.equalsIgnoreCase(latestElementRevId)
					&& AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT).equals(elementState))
			{
				isCommandVisible = true;
			}
			
			//Basic check failed, just return
			if(!isCommandVisible)
				return isCommandVisible;
			
			if(GraphicDocument.isGraphicType(context, elementId)) {
				return isCommandVisible;
			}			
			
			//Check whether it is a Structure Element
			boolean isMCE = BusinessUtil.isKindOf(context, elementId, AWLType.MASTER_COPY_ELEMENT.get(context));
			boolean isCE = BusinessUtil.isKindOf(context, elementId, AWLType.COPY_ELEMENT.get(context));
			ArtworkMaster artworkMaster = null;
			if(isCE) {
				artworkMaster = ArtworkContent.getNewInstance(context, elementId).getArtworkMaster(context);
			} else if(isMCE) {
				artworkMaster = new ArtworkMaster(elementId);
			} else {
				return isCommandVisible; //This case should happen only for Graphic Element and it is taken care with state check
			}
			
			boolean isSE  = artworkMaster.isStructuredElement(context);
			if(isSE)
				return false;
			else
				return true;
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	private MapList getHierarhcyArtworkMasters(Context context, String strbjectId) throws FrameworkException {
		try
		{
			MapList artworkElementMapList = new MapList();
			if(BusinessUtil.isKindOf(context, strbjectId, AWLType.PRODUCT_LINE.get(context)))
			{
				Brand brand = new Brand(strbjectId);
				artworkElementMapList = brand.getArtworkElementsList(context, true);
			}else if(BusinessUtil.isKindOf(context, strbjectId, AWLType.CPG_PRODUCT.get(context)))
			{
				CPGProduct product = new CPGProduct(strbjectId);
				artworkElementMapList = product.getArtworkElementsList(context, true);
			}
			return artworkElementMapList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeAvailableCopyElements(Context context, String [] args) throws FrameworkException
	{
		try
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			String strbjectId = (String) programMap.get(OBJECT_ID);
			return  ArtworkMaster.getMasterCopyElements(context, getHierarhcyArtworkMasters(context, strbjectId));
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeAvailableGraphicsElements(Context context, String [] args) throws FrameworkException
	{
		try
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			String strbjectId = (String) programMap.get(OBJECT_ID);
			return  ArtworkMaster.getGraphicsDocumentIds(context, getHierarhcyArtworkMasters(context, strbjectId));
		} catch (Exception e) { throw new FrameworkException(e); }
	}
		
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkStructureForProductLine(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			String strObjectid = (String)programMap.get(OBJECT_ID);

			MapList currentLevelOBJs = new MapList();
			
			boolean isProductLine = BusinessUtil.isKindOf(context, strObjectid, AWLType.PRODUCT_LINE.get(context));
			boolean isProduct = !isProductLine && BusinessUtil.isKindOf(context, strObjectid, AWLType.CPG_PRODUCT.get(context));
			boolean disableAllRows = false;
			
			String SEL_PLACE_ORIGIN = AWLUtil.strcat("to[", AWLRel.ARTWORK_MASTER.get(context), "].from.id");
			String COPYLIST_ORIGIN = "to["+AWLRel.ASSOCIATED_COPY_LIST.get(context)+"].from.id";
			String OBS_COPYLIST_ORIGIN = "to["+AWLRel.ASSOCIATED_COPY_LIST_HISTORY.get(context)+"].from.id";
			String SEL_STRUCTURED_ARTWORK_MASTER = AWLUtil.strcat( "to[",AWLRel.STRUCTURED_ARTWORK_MASTER.get(context) , "].from.id");
			String selCLLang = AWLUtil.strcat("from[", AWLRel.COPY_LIST_LOCAL_LANGUAGE.get(context), "].to.name");
			
			String copyListCountrySelect = "from["+AWLRel.COPY_LIST_COUNTRY.get(context)+"].to.name";
			String masterArtworkElement = AWLType.MASTER_ARTWORK_ELEMENT.get(context);
			String masterCopyElement = AWLType.MASTER_COPY_ELEMENT.get(context);
			String SEL_STRUCTURED_MASTER_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			String SEL_ATTR_INLINE_TRANSLATION = AWLAttribute.INLINE_TRANSLATION.getSel(context);
			String SEL_ATTR_TRANSLATE = AWLAttribute.TRANSLATE.getSel(context);
			String maeCountrySelect = "from["+AWLRel.COUNTRIES_ASSOCIATED.get(context)+"].to.name";
			
			String SEL_BASE_COPYTEXT_RTE = "from[" + AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) + "|to.attribute[" + AWLAttribute.IS_BASE_COPY.get(context) + "]=='Yes'].to.attribute[Copy Text_RTE]";
			String baseCopyModifySelWhere = AWLUtil.strcat("from[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "|to.attribute[", AWLAttribute.IS_BASE_COPY.get(context), "]=='Yes'].to.current.access[modify]");
			String kindofmce = AWLUtil.strcat("type.kindof[", AWLType.MASTER_COPY_ELEMENT.get(context), "]");
			String SEL_BUILD_LIST = AWLAttribute.BUILD_LIST.getSel(context);
			String SEL_INTERFACE_STRUCTURED_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			
			StringList maeSel = BusinessUtil.toStringList(SELECT_TYPE, 
														  SEL_ATTR_INLINE_TRANSLATION, 
														  SEL_STRUCTURED_MASTER_ELEMENT,
														  SEL_ATTR_TRANSLATE, 
														  SEL_PLACE_ORIGIN, COPYLIST_ORIGIN, OBS_COPYLIST_ORIGIN,SEL_BASE_COPYTEXT_RTE,
														  SEL_STRUCTURED_ARTWORK_MASTER,
														  SELECT_ID, baseCopyModifySelWhere, SELECT_CURRENT, kindofmce, SEL_BUILD_LIST, SEL_INTERFACE_STRUCTURED_ELEMENT);
			if(isProductLine || isProduct )
			{			
				MapList maeList = new MapList();
				MapList clList = new MapList();		
				List<Brand> parentHierarchy = null;	

				if(isProductLine) {
					Brand brandObj = new Brand(strObjectid);	
					maeList.addAll(brandObj.getArtworkElementsList(context, maeSel, null));
					clList.addAll( brandObj.getAllCopyLists(context));
					parentHierarchy = brandObj.getHierarchyProductLines(context, true);
				} else {
					CPGProduct cpgProduct = new CPGProduct(strObjectid);
					maeList.addAll(cpgProduct.getArtworkElementsList(context, maeSel, null, false));
					clList.addAll( cpgProduct.getAllCopyLists(context));
					parentHierarchy = cpgProduct.getProductLines(context);
				}
				StringList maeIDs = BusinessUtil.toStringList(maeList, SELECT_ID);
				StringList clIDs = BusinessUtil.toStringList(clList, SELECT_ID);
				for (Brand brand : parentHierarchy) 
				{
					MapList parentMAE = brand.getArtworkElementsList(context, maeSel, null);
					MapList parentCL  = brand.getAllCopyLists(context);
					for (Map mpContentItem : (List<Map>)parentMAE) {
						
						String id = (String) mpContentItem.get(SELECT_ID);
						if(maeIDs.contains(id))
							continue;
						mpContentItem.put(AWLConstants.SB_ROW_DISABLE_SELECTION, RANGE_TRUE);
						maeIDs.add(id);
						maeList.add(mpContentItem);
					}
					
					for (Map mpContentItem : (List<Map>)parentCL) {
						String id = (String)mpContentItem.get(SELECT_ID);
						if(clIDs.contains(id))
							continue;
						mpContentItem.put(AWLConstants.SB_ROW_DISABLE_SELECTION, RANGE_TRUE);
						clIDs.add(id);
						clList.add(mpContentItem);

					}					
				}
				StringList mce = AWLType.MASTER_COPY_ELEMENT.getDerivative(context, false, true);
				maeIDs = BusinessUtil.toStringList(maeList, SELECT_ID);

				MapList maeInfo = BusinessUtil.getInfoList(context, maeIDs, maeCountrySelect);
				for (int i = 0; i < maeList.size(); i++) {
					Map mae = (Map) maeList.get(i);
					Map aeInfo = (Map) maeInfo.get(i);		
					boolean isCE = mce.contains(mae.get(SELECT_TYPE)); 
					mae.put(masterArtworkElement, "true");
					mae.put(masterCopyElement, isCE ? "true" : "false");
					mae.put("countries", BusinessUtil.getStringList(aeInfo, maeCountrySelect));
				}
				
				clIDs = BusinessUtil.toStringList(clList, SELECT_ID);
				
				MapList clInfo = BusinessUtil.getInfoList(context, clIDs, BusinessUtil.toStringList(selCLLang,
						copyListCountrySelect, SEL_PLACE_ORIGIN, COPYLIST_ORIGIN, OBS_COPYLIST_ORIGIN));

				for (int i = 0; i < clList.size(); i++) {
					Map cl = (Map) clList.get(i);
					Map clInf = (Map) clInfo.get(i);
					cl.put(AWLType.COPY_LIST.get(context), "true");
					cl.put("countries", BusinessUtil.getStringList(clInf, copyListCountrySelect));
					cl.put("languages", BusinessUtil.getStringList(clInf, selCLLang));
					cl.put(SEL_PLACE_ORIGIN, BusinessUtil.getStringList(clInf, SEL_PLACE_ORIGIN));
					cl.put(COPYLIST_ORIGIN, BusinessUtil.getStringList(clInf, COPYLIST_ORIGIN));
					cl.put(OBS_COPYLIST_ORIGIN, BusinessUtil.getStringList(clInf, OBS_COPYLIST_ORIGIN));
				}				
				currentLevelOBJs.addAll(maeList);
				currentLevelOBJs.addAll(clList);
			} 
			else if(BusinessUtil.isKindOf(context, strObjectid, AWLType.MASTER_COPY_ELEMENT.get(context))) 
			{
				disableAllRows = true;
				ArtworkMaster am =  new ArtworkMaster(strObjectid);
				//Adding the Master Only to the View				
				if(am.isStructuredElementRoot(context)) {
					currentLevelOBJs = am.getStructuredElementList(context, maeSel, null);
					for (Map currentStructredAEMap :(List<Map>) currentLevelOBJs) {
						currentStructredAEMap.put(masterCopyElement, "true");
						currentStructredAEMap.put(masterArtworkElement, "true");
					}
					
				} else if(am.isTranslationElement(context)) {
					String objWhere	 = AWLUtil.strcat("(attribute[" , AWLAttribute.IS_BASE_COPY.get(context) , "] smatch const " , "\"" , AWLConstants.RANGE_NO , "\")");
					currentLevelOBJs = am.getArtworkElements(context, StringList.create(SELECT_ID), null, objWhere);
				}
				
			} else if(BusinessUtil.isKindOf(context, strObjectid, AWLType.COPY_LIST.get(context))) {
				disableAllRows = true;
				CopyList  cl =  new CopyList(strObjectid);					
				currentLevelOBJs = cl.getAllCopyElements(context);	
			}	

			if(disableAllRows) 
			{
				for(Map row : (List<Map>) currentLevelOBJs) {
					row.put(AWLConstants.SB_ROW_DISABLE_SELECTION, RANGE_TRUE);
				}
			}
			return currentLevelOBJs;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	public StringList getPlaceOfOrigin(Context context, String[] args) throws FrameworkException {
		try {
			HashMap argsMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(argsMap);
			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(BusinessUtil.getRequestParamMap(argsMap), EXPORT_FORMAT));
			
			StringList artworkMasterIDs = BusinessUtil.toStringList(objectList, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
			return new AWLArtworkMasterUIBase_mxJPO(context, null).getPlaceOfOriginHTML(context, artworkMasterIDs, false, isExporting);
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	/**
	 * This is used in 
	 * Master Copy Approval -> Current Content column
	 * Local Copy Authoring -> Base Copy Content, Compare Lang Content
	 * Local Copy Approval ->  Base Copy Content, Current Content, Compare Lang Content
	 * Returns programHTMLOutput content for Graphic or Copy Text
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */	

	public StringList getCurrentContent(Context context,String args[]) throws FrameworkException
	{
		try {
			Map programMap        = (Map)JPO.unpackArgs(args);
			Map paramMap		  =  BusinessUtil.getRequestParamMap(programMap);
			MapList objectList    = BusinessUtil.getObjectList(programMap);
			Map columnMap         = BusinessUtil.getColumnMap(programMap);

			AWLArtworkPackageUIBase_mxJPO apUI = (AWLArtworkPackageUIBase_mxJPO )newInstanceOfJPO(context, "AWLArtworkPackageUI");
			String colLanguage    = BusinessUtil.getString(columnMap, AWLConstants.COLUMN_LANGUAGE);
			String langFilter 	  =  apUI.getLanguageType(context, paramMap);
			String multipleCopy     = AWLPropertyUtil.getI18NString(context,"emxAWL.InlineTranslation.MultipleLocalCopy", BusinessUtil.getString(paramMap, AWLConstants.LANGUAGE_STRING));
			
			StringList results = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map map = (Map) iterator.next();
				StringList ids = apUI.getColumnIds(map, colLanguage, langFilter);
				if(ids.size() == 0) {
					results.add("");
				} else if(ids.size() == 1) {
					ArtworkContent element = ArtworkContent.getNewInstance(context, (String) ids.get(0));
					results.add(getCopyTextOrGraphicImage(context, element, programMap));	
				} else {
					String id = BusinessUtil.getString(map, AWLConstants.BASE_COPY_ID);
					//XSS Encoding langName to pass to javascript
					String colLangEnCoded = XSSUtil.encodeForJavaScript(context, colLanguage);
		        	String value = AWLUtil.strcat("<div><a href=\"javascript:;\" onclick=\"openInlineLocalCopyList('", id, "','", colLangEnCoded, "');\">", multipleCopy, "</a></div>");
		        	results.add(value);
				}
			}
			return results;			
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 * Returns Last Approved content for Artwork Element
	 * Returns programHTMLOutput content for Graphic or Copy Text
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	public StringList getLastApprovedContent(Context context,String args[]) throws FrameworkException
	{
		try {
			HashMap argsMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = new MapList(BusinessUtil.getObjectList(argsMap));
			Map columnMap         = BusinessUtil.getColumnMap(argsMap);
			String colLanguage    = BusinessUtil.getString(columnMap, AWLConstants.COLUMN_LANGUAGE);
			String langIdKey      = AWLUtil.strcat(SELECT_ID, colLanguage);
			
			StringList objectIdList = BusinessUtil.toStringList(objectList, langIdKey);
			String[] content = new String[objectIdList.size()];
			for(int i=0; i<objectIdList.size(); i++)
			{
				String objectId = (String) objectIdList.get(i);
				if(BusinessUtil.isNullOrEmpty(objectId)) {
					content[i] = "";
					continue;
				}
				ArtworkContent ae = ArtworkContent.getNewInstance(context, objectId);
				ArtworkContent lastRel = ae.getLastReleasedRevision(context);
				content[i] = lastRel == null ? "" : getCopyTextOrGraphicImage(context, lastRel, argsMap);
			}		
			return new StringList(content);
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 * This is used in 
	 * Master Copy Authoring -> Current State column
	 * Master Copy Approval -> Current State column
	 * Local Copy Authoring -> Base Copy Current State, Current State, Compare Lang Current State
	 * Local Copy Approval -> Base Copy Current State, Current State, Compare Lang Current State
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	
	public StringList getCurrentState(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap        = (Map)JPO.unpackArgs(args);
			Map paramMap          = BusinessUtil.getRequestParamMap(programMap);
			MapList objectList    = BusinessUtil.getObjectList(programMap);
			Map columnMap         = BusinessUtil.getColumnMap(programMap);
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);

			AWLArtworkPackageUIBase_mxJPO apUI = (AWLArtworkPackageUIBase_mxJPO)newInstanceOfJPO(context, "AWLArtworkPackageUI");
			String colLanguage    = BusinessUtil.getString(columnMap, AWLConstants.COLUMN_LANGUAGE);
			String langFilter 	  =  apUI.getLanguageType(context, paramMap);

			StringList currentValues = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map map = (Map) iterator.next();
				StringList ids = apUI.getColumnIds(map, colLanguage, langFilter);
				
				if(ids.size() == 1) {
					ArtworkContent element = ArtworkContent.getNewInstance(context, (String) ids.get(0));
					currentValues.add(getCurrentStateHTML(context, element,exportFormat));	
				} else {
					currentValues.add("");					
				}				
			}
			return currentValues;
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	/**
	 * This is used in
	 * Master Copy Authoring -> Current State column
	 * Master Copy Approval -> Current State column
	 * Local Copy Authoring -> Base Copy Current State, Current State, Compare Lang Current State
	 * Local Copy Approval -> Base Copy Current State, Current State, Compare Lang Current State
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */

	public StringList getCopyTextDiff(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap        = (Map)JPO.unpackArgs(args);
			Map paramMap          = BusinessUtil.getRequestParamMap(programMap);
			MapList objectList    = BusinessUtil.getObjectList(programMap);
			Map columnMap         = BusinessUtil.getColumnMap(programMap);

			AWLArtworkPackageUIBase_mxJPO apUI = (AWLArtworkPackageUIBase_mxJPO)newInstanceOfJPO(context, "AWLArtworkPackageUI");
			String colLanguage    = BusinessUtil.getString(columnMap, AWLConstants.COLUMN_LANGUAGE);
			String langFilter 	  =  apUI.getLanguageType(context, paramMap);

			StringList currentValues = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map map = (Map) iterator.next();
				StringList ids = apUI.getColumnIds(map, colLanguage, langFilter);

				if(ids.size() == 1) {
					ArtworkContent element = ArtworkContent.getNewInstance(context, (String) ids.get(0));
					currentValues.add(getCopyTextDiff(context, element));
				} else {
					currentValues.add("");
				}
			}
			return currentValues;

		} catch (Exception e) { throw new FrameworkException(e); }
	}

	private String getCopyTextDiff(Context context, ArtworkContent ae) throws FrameworkException {

		try {
			if (ae.isKindOf(context, AWLType.COPY_ELEMENT.get(context))) {
				DomainObject awo = new DomainObject(ae.getPreviousRevision(context));
				if (awo.exists(context)) {
					String strCurrentCopyText = XSSUtil.encodeForJavaScript(context,ae.getInfo(context, AWLAttribute.COPY_TEXT.getSel(context)));

					String strPreviousCopyText = "";
						strPreviousCopyText = XSSUtil.encodeForJavaScript(context,awo.getInfo(context, AWLAttribute.COPY_TEXT.getSel(context)));
					
					String strFirstHeader = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Current");
					String strSecondHeader = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.PreviousRevision");
					StringBuilder builder = new StringBuilder(75);
					builder.append("<a href=\"javascript:;\">").
			        append("<img ").
			        append("height=\"16\" border=\"0\" ").
			        append("onmouseover=\"showCopyTextDiff(event, this,'").
			        		append(strCurrentCopyText.replaceAll("\'", "\\\\\\\'").replaceAll("\"", "\\\\\\\"")).append("',  '").
			        		append(strPreviousCopyText.replaceAll("\'", "\\\\\\\'").replaceAll("\"", "\\\\\\\"")).append("', '").
							append(strFirstHeader).append(":', '").append(strSecondHeader).append(":');\" ").
			        append("src=\"../common/images/iconActionCompare.gif\" /></a>");
					return builder.toString();
				}
			}

		} catch (Exception e) { throw new FrameworkException(e); }
		return "";
	}
	
	public StringList getInlineTranslationHTML(Context context, Map programMap) throws FrameworkException {
		try {
			Map paramMap          = BusinessUtil.getRequestParamMap(programMap);
			MapList objectList    = BusinessUtil.getObjectList(programMap);
			
			Map requestMap          = BusinessUtil.getRequestParamMap(programMap);
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);
			
			AWLArtworkPackageUIBase_mxJPO apUI = (AWLArtworkPackageUIBase_mxJPO)newInstanceOfJPO(context, "AWLArtworkPackageUI");
			String actionType 		= apUI.getActionType(paramMap);
			boolean isLocalCopyAction	= apUI.isLocalCopyAction(actionType);
			
			StringList ids = BusinessUtil.getIdList(objectList);
			StringList artworkMasterIDs = BusinessUtil.toStringList(objectList, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
			AWLArtworkMasterUIBase_mxJPO artworkMasterUI = (AWLArtworkMasterUIBase_mxJPO)newInstanceOfJPO(context, "AWLArtworkMasterUI");
			if(isLocalCopyAction) {
				StringList returnList = new StringList(objectList.size());
				for (int i = 0; i < artworkMasterIDs.size(); i++) {
					String masterId = (String) artworkMasterIDs.get(i);
					ArtworkMaster master = new ArtworkMaster(masterId);
					if(isLocalCopyAction) {
						boolean canTranslate = master.isTranslationElement(context);
						boolean isGraphic = !BusinessUtil.isKindOf(context, masterId, AWLType.MASTER_COPY_ELEMENT.get(context));
						if(isGraphic){
							returnList.add(EMPTY_STRING);
							continue;
						}
						boolean inLine = canTranslate && master.isInlineTranslationElement(context);
						if(!canTranslate) {
							returnList.add(artworkMasterUI.getInlineTranslationHTML(context, master, exportFormat));
						} else if(canTranslate && !inLine) {
							returnList.add("");
						} else {
			        		String image   = "AWLiconStatusInlineTranslation.gif";
			        		String tooltip = BusinessUtil.getInfo(context, (String)ids.get(i), AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context)); 
			        		tooltip = XSSUtil.encodeForJavaScript(context, tooltip);
							returnList.add(artworkMasterUI.getTranslationIconHTML(image, tooltip, false, masterId));						
						}
					} else {
						returnList.add(artworkMasterUI.getInlineTranslationHTML(context, master, exportFormat));
					}
				}
				return returnList;
			} else {
				return artworkMasterUI.getInlineTranslationHTML(context, artworkMasterIDs, exportFormat);
			}
		}  catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public static String getCurrentStateHTML(Context context, ArtworkContent ae, String exportFormat) throws FrameworkException {
		try {
		    if(ae == null || BusinessUtil.isNullOrEmpty(ae.getObjectId(context)) ){
				return "";
			}		
			Map info = ae.getInfo(context, BusinessUtil.toStringList(SELECT_POLICY, SELECT_CURRENT));
			String policy = (String) info.get(SELECT_POLICY);
			String current = (String) info.get( SELECT_CURRENT);
			return AWLPropertyUtil.getStateI18NString(context, policy, current);
			
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	
	private String getCopyTextOrGraphicImage(Context context, ArtworkContent element, Map argsMap) throws FrameworkException {
		try {
			Map paramMap = BusinessUtil.getRequestParamMap(argsMap); 
	    	String reportFormat = BusinessUtil.getString(paramMap, "reportFormat");
			if(element.isGraphicElement()) 
			{
				if(BusinessUtil.isNotNullOrEmpty(reportFormat))
					return "";
				String graphicId = element.getId(context);
				AWLGraphicsElementUIBase_mxJPO graphicUI = (AWLGraphicsElementUIBase_mxJPO)newInstanceOfJPO(context, "AWLGraphicsElementUI",new String[]{graphicId});
				StringList finalImages = graphicUI.getImageURLs(context, StringList.create(graphicId), argsMap, true);
				return (String) finalImages.get(0);
			} else {
				return ArtworkElementUtil.getCopyTextProgramHTML(context, ((CopyElement)element), reportFormat);
			}
		} catch (Exception e) { throw new FrameworkException(e); }
	}	

	/**
	 * @deprecated Since R2016x with POA Simplification highlight
	 * Dynamic Column Creation of MCL for Selected Artwork Element
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	public MapList getMCLforSelectedArtwokElement(Context context, String args[])throws FrameworkException
    {
		/*try
		{
	        Map progMap  = (Map) JPO.unpackArgs(args);
	        Map reqMap = (Map) progMap.get("requestMap");

	        MapList mclList = null;
	        
	        String strSelectId = (String) reqMap.get("selectId");	
		    if(BusinessUtil.isNotNullOrEmpty(strSelectId)){
		    	MapList slSelectMPIds = new MapList();
		        StringList strIds = FrameworkUtil.split(strSelectId, ",");
		        String strSelectIdKey = "";	        
		        StringBuffer sbWhereCondition1 = new StringBuffer(25);
		        sbWhereCondition1 = sbWhereCondition1.append("id==");
		        for (Iterator it = strIds.iterator(); it.hasNext();) 
		        {
					strSelectIdKey = (String) it.next();
					sbWhereCondition1 = sbWhereCondition1.append(strSelectIdKey);
		            sbWhereCondition1 = sbWhereCondition1.append("|| id==");
		            if(strSelectIdKey != null && !"".equalsIgnoreCase(strSelectIdKey))
		            {
		            	slSelectMPIds.add(strSelectIdKey);
		            } 
				}
		        mclList = slSelectMPIds;	
		    }else
		    {
		    	String strParentObjectId = (String) reqMap.get(OBJECT_ID);
		    	CPGProduct cpgProduct = new CPGProduct(strParentObjectId);
		     	mclList =  cpgProduct.getMCLList(context);
		    }
		  

	        MapList returnMap = new MapList();
	        HashSet hashParentList = new HashSet();
        	String grpHeader = "emxAWL.Table.MasterCopyList";
            hashParentList.add(mclList);  
            Iterator itr = hashParentList.iterator();
            
            while(itr.hasNext())
            {
                MapList parentmapList = (MapList) itr.next();
                for(int j=0;j<parentmapList.size();j++)
                {
                	String strMCLId ="";
                	
                	if(BusinessUtil.isNotNullOrEmpty(strSelectId))
                	{
                	   strMCLId = (String) parentmapList.get(j);
                	}else
                	{
                		Map tempMap = (Map) parentmapList.get(j);
                        strMCLId = (String) tempMap.get("id"); 
                	}
                	
                    MasterCopyList objMCL = new MasterCopyList(strMCLId);
                    
                    HashMap hashfornewColumn = new HashMap();
                    HashMap hashColumnSetting = new HashMap();
                    hashColumnSetting.put("Column Type","programHTMLOutput");
                    hashColumnSetting.put("Registered Suite","AWL");
                    hashColumnSetting.put("Export", RANGE_TRUE);
                    hashColumnSetting.put("Editable", RANGE_TRUE);                   
                    hashColumnSetting.put("Input Type", "combobox");
                    hashColumnSetting.put("function", "checkArtworkElementAssociatationWithMCL");
                    hashColumnSetting.put("program", "AWLArtworkElementUI");                        
                 
                    String revisionMCLId = "";
                   
                    String revisionMCLName = objMCL.getInfo(context, AWLAttribute.MARKETING_NAME.getSel(context));
                    revisionMCLId = objMCL.getObjectId();
                    hashColumnSetting.put("Group Header", grpHeader);
                    hashColumnSetting.put("Width","100");                        
                    //Setting the global Column with the above settings
                    hashfornewColumn.put("settings",hashColumnSetting);
                    hashfornewColumn.put("label",revisionMCLName);
                    hashfornewColumn.put("name",revisionMCLId);
                    hashfornewColumn.put("id",revisionMCLId);
                    returnMap.add(hashfornewColumn);		                    
                }
            }
        
		    return returnMap;
	    } catch (Exception e) { throw new FrameworkException(e); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
		
    }

    /**
     * @deprecated Since R2016x with POA Simplification highlight
     * Fill the value in Corresponding Artwork Element and MCL 
     * @param context
     * @param args
     * @return
     * @throws FrameworkException
     */
    public List checkArtworkElementAssociatationWithMCL(Context context, String[] args)throws FrameworkException {
    	/*try{			
			Map programMap = (Map) JPO.unpackArgs(args);
			MapList artworkElementIDList  = (MapList)programMap.get("objectList");
			HashMap columnMap  = (HashMap)programMap.get("columnMap");
			HashMap paramList = (HashMap) programMap.get("paramList");
			String reportFormat = (String) paramList.get("reportFormat");
			
			//Fix IR-249897V6R2014x, IR-287631
			String SHOW_GREEN_IMAGE = "<img src=\"../common/images/CPDTaskStatusGreen.gif\" border=\"0\" align=\"absmiddle\" />";
			String YES = AWLPropertyUtil.getI18NString(context, LABEL_RANGE_YES);
			String DISPLAY_VALUE = "CSV".equalsIgnoreCase(reportFormat) || "Text".equalsIgnoreCase(reportFormat) ? YES : SHOW_GREEN_IMAGE;

			StringList mclElementIDs = BusinessUtil.getInfoList(context, (String)columnMap.get("id"), 
					AWLUtil.strcat("from[", AWLRel.MCL_ARTWORK.get(context), "].to.id"));

			StringList artworkElementInMCLusageList = new StringList(artworkElementIDList.size());
			for (int i = 0; i < artworkElementIDList.size() ; i++)
			{
				Map artworkElementMap = (Map) artworkElementIDList.get(i);
				String strRootNode = (String)artworkElementMap.get("Root Node");
				String strArtworkElementID = (String) artworkElementMap.get("id");
				String status = RANGE_TRUE.equalsIgnoreCase(strRootNode) || !mclElementIDs.contains(strArtworkElementID) ?
						        DomainConstants.EMPTY_STRING : DISPLAY_VALUE;
				artworkElementInMCLusageList.add(status);
			}
			return artworkElementInMCLusageList;
		} catch (Exception e) { throw new FrameworkException(e); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
    }
	
	/***
     * Returns content (Copy Text and Image) for the given Artwork Elements
     * @param context
     * @param args
     * @return
     * @throws FrameworkException
     */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkElementContentInfo(Context context, String [] args) throws FrameworkException
	{
		try{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			String languageStr = BusinessUtil.getString(programMap, AWLConstants.LANGUAGE_STRING);
			MapList infoList   = new MapList(objectList.size());
			String DISPLAY_NAME = AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.", AWLAttribute.MARKETING_NAME.getSel(context));
		
			programMap.put(UIComponent.IMAGE_MANAGER_GENERATE_HTML_FLAG, "false");
			programMap.put("format", "format_mxThumbnailImage");
			Map mpMCSURL = (Map)programMap.get("mpMCSURL");
	        String strMCSURL = (String)mpMCSURL.get("MCSURL");
	        HashMap paramMap = new HashMap();
			HashMap imageMap = new HashMap();
	        imageMap.put("MCSURL", strMCSURL);
			paramMap.put("ImageData", imageMap);
			programMap.put("paramList", paramMap);
			
			for(Iterator oItr = objectList.iterator(); oItr.hasNext();)
			{
				Map objectMap  = (Map)oItr.next();
				String elementId  = BusinessUtil.getId(objectMap);
				ArtworkContent ac = ArtworkContent.getNewInstance(context, elementId);
				String type    = BusinessUtil.getInfo(context, ac.getId(context), SELECT_TYPE);
				type  		   = AWLPropertyUtil.getTypeI18NString(context, type, languageStr, false);
				String content  = getCopyTextOrGraphicImage(context, ac, programMap);

				String displayName = ac.getInfo(context, DISPLAY_NAME);
				Map info	   = new HashMap();
				info.put(SELECT_ID, elementId);
				info.put(SELECT_TYPE, type);
				info.put(DISPLAY_NAME, displayName );
				info.put(AWLConstants.ARTWORK_CONTENT, content);
				infoList.add(info);
			}
			return infoList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkPackages(Context context, String[] args) throws FrameworkException
	{
		try {
			Map programMap 	= (Map) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			ArtworkContent ac = null;
			if(BusinessUtil.isKindOf(context, objectId, AWLType.MASTER_ARTWORK_ELEMENT.get(context)))
			{
				ArtworkMaster am = new ArtworkMaster(objectId);
				ac = am.getBaseArtworkElement(context);
			} else
				ac = ArtworkContent.getNewInstance(context, objectId);
			List<ArtworkPackage> apList = ac.getArtworkPackages(context);
			MapList ml = new MapList(apList.size());
			for(ArtworkPackage ap : apList) {
				Map m = new HashMap();
				m.put(SELECT_ID, ap.getObjectId(context));
				ml.add(m);
			}
			return ml;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public boolean isArtworkElementEditable(Context context, String[] args) throws FrameworkException
	{
		try {
			Map programMap     = (Map)JPO.unpackArgs(args);
			String copyElementId   = BusinessUtil.getObjectId(programMap);
			return isCopyTextEditable(context, BusinessUtil.toStringList(copyElementId))[0];
		} catch(Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	public StringList getArtworkAdditionalInfo(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			
			MapList objectList = BusinessUtil.getObjectList(programMap);
			StringList artworkMasterIDs = BusinessUtil.toStringList(objectList, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
			
			Map requestMap          = BusinessUtil.getRequestParamMap(programMap);
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);

			String actionType = BusinessUtil.getString(BusinessUtil.getRequestParamMap(programMap), AWLConstants.ARTWORK_ACTION_TYPE);
			StringList artworkAdditionalInfo = new StringList(); 
			
			
			String countriesAssociatedSelect = AWLUtil.strcat("from[",AWLRel.COUNTRIES_ASSOCIATED.get(context),"].to.name"); //"from[Countries Associated].to.name"
			String isBaseCopySelect = AWLUtil.strcat("from[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].to.",AWLAttribute.IS_BASE_COPY.getSel(context)); //"from[Artwork Element Content].to.attribute[Is Base Copy].value"
			String copyTextLanguageSelect = AWLUtil.strcat("from[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].to.",AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context)); //"from[Artwork Element Content].to.attribute[Copy Text Language].value"
			String translateSelect = AWLAttribute.TRANSLATE.getSel(context);
			String inlineTranslateSelect = AWLAttribute.INLINE_TRANSLATION.getSel(context);
			
			// Get Master Artwork Details
			MapList mlArtworkMasterDetails = BusinessUtil.getInfoList(context, artworkMasterIDs, 
					BusinessUtil.toStringList(translateSelect, inlineTranslateSelect, SELECT_ID, countriesAssociatedSelect, isBaseCopySelect, copyTextLanguageSelect));
			
			Map<String, Map> artworkMasterDetailMapByID     = new HashMap<String,Map>();
			for(Iterator litr = mlArtworkMasterDetails.iterator(); litr.hasNext();)
		    {
				Map map  = (Map)litr.next();
				Map<String, Object> artworkMasterDetail = new HashMap<String, Object>();
				StringList countryNames = (StringList)map.get(countriesAssociatedSelect);
				if(BusinessUtil.isNotNullOrEmpty(countryNames)) {
					Collections.sort(countryNames);
				}
				
				StringList isBaseCopyStringlist = (StringList)map.get(isBaseCopySelect);
				StringList copyElementLangList = (StringList)map.get(copyTextLanguageSelect);
				int baseIndex = isBaseCopyStringlist.indexOf(AWLConstants.RANGE_YES);
				String baseCopyLanguage = baseIndex >= 0 ? (String) copyElementLangList.get(baseIndex) : EMPTY_STRING;
				
				artworkMasterDetail.put(translateSelect , BusinessUtil.getFirstString(map, translateSelect));
				artworkMasterDetail.put(inlineTranslateSelect , BusinessUtil.getFirstString(map, inlineTranslateSelect));
				artworkMasterDetail.put(countriesAssociatedSelect, countryNames);
				artworkMasterDetail.put(isBaseCopySelect, baseCopyLanguage);
				artworkMasterDetail.put(copyTextLanguageSelect, copyElementLangList);
				
				artworkMasterDetailMapByID.put((String)((StringList)map.get(SELECT_ID)).get(0), artworkMasterDetail);
				
		    }
			
			
			String inlineTranslation  = AWLPropertyUtil.getI18NString(context,"emxAWL.Attribute.InlineTranslation");
			String noTranslation      = AWLPropertyUtil.getI18NString(context,"emxAWL.Tooltip.NoTranslation");
			inlineTranslation = FrameworkUtil.findAndReplace(inlineTranslation, "'", "\\\'");
			noTranslation = FrameworkUtil.findAndReplace(noTranslation, "'", "\\\'");
			
			String defaultLang = AWLPreferences.getSystemBaseLanguage(context);
			String baseLangMsg = AWLUtil.strcat(AWLPropertyUtil.getI18NString(context, "emxAWL.Label.GeneratedBaseCopyLanguage"), " : ");
			String sysDefaultMsg = AWLUtil.strcat(AWLPropertyUtil.getI18NString(context, "emxAWL.Label.SystemDefaultLanguage"), " : ");
			
			
			String space16Image = "<img src=\"../common/images/utilSpacer.gif\" width=\"16px\" height=\"16px\" />";
			for (String currentArtworkMasterID : (List<String>)artworkMasterIDs) {
				Map map = artworkMasterDetailMapByID.get(currentArtworkMasterID);
				
				String geographicValue = EMPTY_STRING;
				String inlineValue = EMPTY_STRING;
				String base = EMPTY_STRING;
				
				// Geographical info -- Start
				StringList countryNames = (StringList)map.get(countriesAssociatedSelect);
				if(BusinessUtil.isNotNullOrEmpty(countryNames)) {
					if(BusinessUtil.isNotNullOrEmpty(exportFormat)) {
						geographicValue = FrameworkUtil.join(countryNames, ",");
					} else {
						StringList encodedCountry = new StringList(countryNames.size());
						for (String country : (List<String>)countryNames) {
							encodedCountry.add(XSSUtil.encodeForJavaScript(context, country));
						}
						StringBuffer html = new StringBuffer(200);
						html.append( "<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../awl/images/AWLStatusLocationAssigned.gif\" ");
						html.append( "onmouseover=\"showTooltip(event, this,'").append(FrameworkUtil.join(encodedCountry, ", ")).append("');\" ");
						html.append( "onmouseout=\"hideTooltip(event, this);\" />");
						geographicValue = html.toString();
					}
				}
				// Geographical info -- End
				
				// In line Information -- Start
				String image   = EMPTY_STRING;
				String tooltip = EMPTY_STRING;
				String strInlineStatus = EMPTY_STRING;
				
				String translateValue = (String)map.get(translateSelect);
				String inlineValueTemp = (String)map.get(inlineTranslateSelect);
				if(AWLConstants.RANGE_YES.equalsIgnoreCase(inlineValueTemp)){
					image   = "AWLiconStatusInlineTranslation.gif";
					tooltip = inlineTranslation;
					strInlineStatus = AWLConstants.RANGE_YES;
					if(AWLConstants.LOCAL_COPY_AUTHORING.equalsIgnoreCase(actionType) || AWLConstants.LOCAL_COPY_APPROVAL.equalsIgnoreCase(actionType)) {
						tooltip = FrameworkUtil.join((StringList)map.get(copyTextLanguageSelect),","); 
		        		tooltip = XSSUtil.encodeForJavaScript(context, tooltip);
					 }
				} else if(AWLConstants.RANGE_NO.equalsIgnoreCase(translateValue)){
					image   = "AWLiconStatusNoTranslation.gif";
					tooltip = noTranslation;
				}
				
				if(BusinessUtil.isNotNullOrEmpty(image) && !BusinessUtil.isNotNullOrEmpty(exportFormat))
				{
					StringBuffer sbHTML = new StringBuffer(250);
					sbHTML.append("<img alt=\"");
					sbHTML.append(tooltip).append("\" height=\"16\" border=\"0\" align=\"middle\" style=\"padding:1px\" ");
					sbHTML.append("onmouseover=\"showTooltip(event, this,'").append(tooltip);
					sbHTML.append("');\" onmouseout=\"hideTooltip(event, this);\" ");
					sbHTML.append("src=\"../awl/images/").append(image).append("\" />");
					
					inlineValue = sbHTML.toString();
				}else{
					inlineValue = strInlineStatus;
				}
				//In line Information -- End
				
				//Base difference Information -- Start
				String isBaseCopyLanguage = (String) map.get(isBaseCopySelect);
				if(BusinessUtil.isNotNullOrEmpty(isBaseCopyLanguage) && !defaultLang.equals(isBaseCopyLanguage)) {
					StringBuffer langdiff = new StringBuffer("<img border=\"0\" align=\"middle\" style=\"padding:1px\" src=\"../common/images/iconSmallStatusAlert.gif\" " +
							"onmouseover=\"showTooltip(event, this,''{0}&lt;strong&gt;{1}&lt;/strong&gt;&lt;br/&gt;{2}&lt;strong&gt;{3}&lt;/strong&gt;'');\"" +
							" onmouseout=\"hideTooltip(event, this);\" />");
					
					base = MessageFormat.format(langdiff.toString(), baseLangMsg, XSSUtil.encodeForJavaScript(context, isBaseCopyLanguage));  
				
				}
				//Base difference Information -- End
				
				geographicValue = BusinessUtil.isNullOrEmpty(geographicValue) ? space16Image : geographicValue;
				inlineValue = BusinessUtil.isNullOrEmpty(inlineValue) ? space16Image : inlineValue;
				base = BusinessUtil.isNullOrEmpty(base) ? space16Image : base;

				String artworkAdditionalInfoValue = AWLUtil.strcat(geographicValue, inlineValue, base);
				artworkAdditionalInfo.add(artworkAdditionalInfoValue);				
			}
			return artworkAdditionalInfo;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	public StringList getPOAsAndArtworkPackages(Context context, String[] args) throws FrameworkException
	{
		StringList poaAndArtworkPackageList = new StringList();
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(BusinessUtil.getRequestParamMap(programMap), EXPORT_FORMAT));

			String title       = "";
			String treeUrl = "<a href=\"javascript:;\" onclick=\"javascript:showModalDialog(''../common/emxTree.jsp?objectId={0}'','true');\">{1}</a>";
			String moreAPsUrl = "<a href=\"javascript:;\" title=\"{0}\" onclick=\"openCopyArtworkPackages(''{1}'');\">...</a>";
            StringList apStates = AWLPolicy.ARTWORK_PACKAGE.getStates(context, AWLState.COMPLETE, AWLState.CANCELLED);                			
            
			String actionType = BusinessUtil.getString(BusinessUtil.getRequestParamMap(programMap), AWLConstants.ARTWORK_ACTION_TYPE);
            String idSelectable;
			
            if(AWLConstants.LOCAL_COPY_AUTHORING.equalsIgnoreCase(actionType) || AWLConstants.LOCAL_COPY_APPROVAL.equalsIgnoreCase(actionType)) {
				//idSelectable = "to[Artwork Assembly].from.to[Artwork Package Content].from.id";
            	idSelectable = AWLUtil.strcat("to[",AWLRel.ARTWORK_ASSEMBLY.get(context),"].from.to[",AWLRel.ARTWORK_PACKAGE_CONTENT.get(context),"].from.id");
			} else {
				//idSelectable =  "to[Artwork Element Content].from.to[POA Artwork Master].from.to[Artwork Package Content].from.id";
				idSelectable =  AWLUtil.strcat("to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.to[",AWLRel.POA_ARTWORK_MASTER.get(context),"].from.to[",AWLRel.ARTWORK_PACKAGE_CONTENT.get(context),"].from.id");
			}
			
            // Get connected artwork packages and copy id.
			MapList mlArtworkPackageIDAndCopyIDs = BusinessUtil.getInfoList(context, BusinessUtil.getIdList(objectList), BusinessUtil.toStringList(idSelectable,SELECT_ID));
			
			Set<String> artworkPackageIDList = new HashSet<String>();
			for(Iterator itr = mlArtworkPackageIDAndCopyIDs.iterator(); itr.hasNext();)
			{
				Map currentPackageID = (Map)itr.next();
				StringList slArtworkPackageIDs = (StringList)currentPackageID.get(idSelectable);
				if(BusinessUtil.isNullOrEmpty(slArtworkPackageIDs)) {
					continue;
				}
				for (String currentID : (List<String>)slArtworkPackageIDs) {
					artworkPackageIDList.add(currentID);
				}
			}
			
			// Get artwork package details with name, current,id
			MapList mlArtworkPackageDetails = BusinessUtil.getInfo(context, BusinessUtil.toStringList(artworkPackageIDList), BusinessUtil.toStringList(SELECT_NAME,SELECT_ID,SELECT_CURRENT));
			
			// Group the Artwork Package details.
			Map<String, Map> artworkPackageDetailMap     = new HashMap<String,Map>();
			for(Iterator litr = mlArtworkPackageDetails.iterator(); litr.hasNext();)
		    {
				Map map  = (Map)litr.next();
				String groupKey = (String)map.get(SELECT_ID);
				if(apStates.contains((String)map.get(SELECT_CURRENT)))
						artworkPackageDetailMap.put(groupKey, map);
		    }
			
			
            for (Map currentMap : (List<Map>)mlArtworkPackageIDAndCopyIDs) {
            	StringBuffer artworkPackageHTML = new StringBuffer();
            	
            	StringList slArtworkPackageIds = (StringList)currentMap.get(idSelectable);
            	if(BusinessUtil.isNullOrEmpty(slArtworkPackageIds)) {
            		poaAndArtworkPackageList.add(EMPTY_STRING);
            		continue;
            	}
            	
				String copyid = (String)((StringList)currentMap.get(SELECT_ID)).get(0);
				int validArtworkPackageCount=0;
				for (int i=0;i<slArtworkPackageIds.size();i++) {
					String currentArtworkPackageID = (String)slArtworkPackageIds.get(i);
					Map currentArtworkPackage = (Map)artworkPackageDetailMap.get(currentArtworkPackageID);
					if(currentArtworkPackage!=null) {
						validArtworkPackageCount++;
						String artworkPackageName = BusinessUtil.getString(currentArtworkPackage, SELECT_NAME);
						if(isExporting) {
							artworkPackageHTML.append(artworkPackageName).append(", ");
						} else {
							//XSS Encoding Artwork Package to display as HTML
							String artworkPackageNameEncoded = XSSUtil.encodeForHTML(context, artworkPackageName);
							artworkPackageHTML.append(MessageFormat.format(treeUrl, BusinessUtil.getString(currentArtworkPackage, SELECT_ID), artworkPackageNameEncoded)).append(", ");
						}
					}
				}
				
				if(validArtworkPackageCount==0) {
					artworkPackageHTML = new StringBuffer("");
				} else if(validArtworkPackageCount>3) {
						if(isExporting) {
							artworkPackageHTML = new StringBuffer(artworkPackageHTML.substring(0, artworkPackageHTML.length()-2));
						} else {
							artworkPackageHTML.append(MessageFormat.format(moreAPsUrl, title, copyid));
						}
				} else {
					artworkPackageHTML = new StringBuffer(artworkPackageHTML.substring(0, artworkPackageHTML.length()-2));
				}
				poaAndArtworkPackageList.add(artworkPackageHTML.toString());
			}
			return poaAndArtworkPackageList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	/**
	 * Returns Graphic Image or Copy Text of Base Copy
	 * Returns programHTMLOutput content
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	public StringList getBaseCopyCurrentContent(Context context,String args[]) throws FrameworkException
	{
		try {
			Map programMap        = (Map)JPO.unpackArgs(args);		
			MapList objectList    = BusinessUtil.getObjectList(programMap);

			StringList results = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map map = (Map) iterator.next();		    	
				String masterId = (String) map.get(AWLType.MASTER_ARTWORK_ELEMENT.get(context));
				masterId = BusinessUtil.isNullOrEmpty(masterId)? BusinessUtil.getId(map) : masterId;
				ArtworkMaster element = new ArtworkMaster(masterId);
				ArtworkContent baseCopy = element.getBaseArtworkElement( context );
				results.add(getCopyTextOrGraphicImage(context, baseCopy, programMap));
			}
			return results;			

		} catch (Exception e) { throw new FrameworkException(e); }
	}

	public StringList getBaseCopyCurrentState(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap        = (Map)JPO.unpackArgs(args);		
			MapList objectList    = BusinessUtil.getObjectList(programMap);		
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);
			String exportFormat = BusinessUtil.getString(requestMap, EXPORT_FORMAT);

			StringList currentValues = new StringList(objectList.size());
			for (Iterator iterator = objectList.iterator(); iterator.hasNext();) {
				Map map = (Map) iterator.next();
				ArtworkMaster element = new ArtworkMaster((String) map.get(AWLType.MASTER_ARTWORK_ELEMENT.get(context)));
				ArtworkContent baseCopy = element.getBaseArtworkElement( context );
				currentValues.add(getCurrentStateHTML(context, baseCopy,exportFormat));								
			}
			return currentValues;

		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	public String getDisplayName(Context context, String[] args) throws FrameworkException 
	{
		try {
			Map programMap = (Map)JPO.unpackArgs(args);
			Map paramMap  = BusinessUtil.getParamMap( programMap );
			String copyId = BusinessUtil.getString(paramMap, OBJECT_ID); 
			return ArtworkContent.getNewInstance(context, copyId).getDisplayName(context);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Returns Route Info Column detail for Assigning the authors
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Vector       - list of TaskInfo Column info
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2013.HF1
	 * @author  Balaji (bu4)
	 */
	public StringList getActiveRouteInfo(Context context, String[] args) throws FrameworkException
	{
		StringList taskInfoList = new StringList();
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			StringList ids = BusinessUtil.getIdList(objectList);			
			String routeImage = "<img src=\"../common/images/iconSmallRoute.gif\" border=\"0\" align=\"absmiddle\" />";
			for (String id : (List<String>)ids) {
				String taskHtml  = "";
				if(BusinessUtil.isNotNullOrEmpty(id) && RouteUtil.hasRoute(context, id)){
					taskHtml = AWLUtil.strcat("<div><a href=\"javascript:;\" copyId=\"", id, "\" onclick=\"openRouteInfo(this,'", id, "');\">", routeImage, "</a></div>");
				}
				taskInfoList.add(taskHtml);
			}
		} catch (Exception e) { throw new FrameworkException(e); }
		return taskInfoList;
	}

	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAllRoutes(Context context,String[] arg) throws FrameworkException{
		try{
			Map programMap     = (Map)JPO.unpackArgs(arg);
			String copyId = BusinessUtil.getString(programMap, OBJECT_ID);
			ArtworkContent content = ArtworkContent.getNewInstance(context, copyId);
			boolean isMasterAssignment = content.isBaseCopy(context);
			String AUTHORING = isMasterAssignment ? AWLConstants.MASTER_COPY_AUTHORING : AWLConstants.LOCAL_COPY_AUTHORING;
			String APPROVAL = isMasterAssignment ? AWLConstants.MASTER_COPY_APPROVAL : AWLConstants.LOCAL_COPY_APPROVAL;
			
			MapList returnList = new MapList(2);
			String routeId = RouteUtil.getConnectedRoute(context, copyId, AUTHORING);
			if(BusinessUtil.isNotNullOrEmpty(routeId)) {
				Map m = new HashMap(1);
				m.put(SELECT_ID, routeId);
				returnList.add(m);
			}
			
			routeId = RouteUtil.getConnectedRoute(context, copyId, APPROVAL);
			if(BusinessUtil.isNotNullOrEmpty(routeId)) {
				Map m = new HashMap(1);
				m.put(SELECT_ID, routeId);
				returnList.add(m);
			}
			return returnList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
	
	public StringList getReAuthorColumn(Context context,String[] args) throws FrameworkException {
		try {
			Map programMap     = (Map)JPO.unpackArgs(args);
			Map requestMap =BusinessUtil.getRequestParamMap(programMap);
			MapList objectList = BusinessUtil.getObjectList(programMap);

			StringList ids = BusinessUtil.getIdList(objectList);
			StringList returnList = new StringList(objectList.size());
			
			boolean isMasterAssignment = AWLConstants.MASTER_COPY.equalsIgnoreCase(BusinessUtil.getString(requestMap, AWLConstants.ARTWORK_ASSIGN_TYPE));
			
			StringList reAuthor = BusinessUtil.getInfo(context, ids, AWLAttribute.RE_AUTHOR_CONTENT.getSel(context));
			StringList current = BusinessUtil.toStringList(objectList, SELECT_CURRENT);
			StringList hasRoute = BusinessUtil.toStringList(objectList, AWLConstants.HAS_ROUTE);
			
			String RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			
			String YES = AWLPropertyUtil.getI18NString(context, LABEL_RANGE_YES);
			String NO = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Range.No");
			String NA = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.NotApplicable");
			
			if(isMasterAssignment) 
			{
				for (int i = 0; i < ids.size(); i++) {
					String display = !RELEASE.equals(current.get(i)) || RANGE_TRUE.equals(hasRoute.get(i)) ? NA : 
						             RANGE_TRUE.equalsIgnoreCase((String) reAuthor.get(i)) ? YES : NO;
					returnList.add(display);
				}
			} else 
			{
				StringList artworkMasterIds = BusinessUtil.toStringList(objectList, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
				
				String[] masterIDArr = new String[artworkMasterIds.size()];
				artworkMasterIds.toArray(masterIDArr);
				boolean[] kindOfMCE = BusinessUtil.isKindOf(context, masterIDArr, AWLType.MASTER_COPY_ELEMENT.get(context));
				StringList translate = BusinessUtil.getInfo(context, artworkMasterIds, AWLAttribute.TRANSLATE.getSel(context));
				for (int i = 0; i < ids.size(); i++) {
					boolean showNA =  !kindOfMCE[i] ||  AWLConstants.RANGE_NO.equalsIgnoreCase((String) translate.get(i));
					String display = showNA || !RELEASE.equals(current.get(i)) || RANGE_TRUE.equals(hasRoute.get(i)) ? NA : 
						             RANGE_TRUE.equalsIgnoreCase((String) reAuthor.get(i)) ? YES : NO;
					returnList.add(display);
				}
			}
			return returnList;
					
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
	
	//Fix IR-228095V6R2013x
	public StringList isCopyTextEditable(Context context, String[] args) throws FrameworkException
	{
		try {
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList    = BusinessUtil.getObjectList(programMap);	
			StringList slObject = BusinessUtil.toStringList(objectList, SELECT_ID);
			
			boolean accessArr[] = isCopyTextEditable(context, slObject);
			
			StringList isEditableList = new StringList(slObject.size());
			for (int i = 0; i < accessArr.length; i++) 
			{
				isEditableList.add(accessArr[i] ? Boolean.TRUE.toString() : Boolean.FALSE.toString());
			}
			return isEditableList;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	//Fix IR-228095V6R2013x
	protected boolean[] isCopyTextEditable(Context context, StringList artworkElementIds) throws FrameworkException {
		try {
			String MOD_ACCESS = "current.access[modify]";
			String STATE_PRELIMINARY = AWLState.PRELIMINARY.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
			String IS_BASE_COPY = AWLAttribute.IS_BASE_COPY.getSel(context);
			String IS_MASTER_COPY_ELEMENT = AWLUtil.strcat("type.kindof[" , AWLType.MASTER_COPY_ELEMENT.get(context), "]");
			String PROP_INTERFACE_STRUCTMASTER =AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.", AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context)); 

			
			StringList selectables = new StringList();
			selectables.add(SELECT_CURRENT);
			selectables.add(MOD_ACCESS);
			selectables.add(IS_BASE_COPY);
			selectables.add(PROP_INTERFACE_STRUCTMASTER);
			selectables.add(IS_MASTER_COPY_ELEMENT);
			
			boolean isMCAU = Access.isMasterCopyAuthor(context);
			boolean isLCAU = Access.isLocalCopyAuthor(context);
			boolean isPM = Access.isProductManager(context);
			
			MapList artworkElementInfo = BusinessUtil.getInfo(context, artworkElementIds, selectables);
			boolean returnArry[] = new boolean[artworkElementIds.size()];
			for (int i = 0; i < returnArry.length; i++) {
				Map artworkElement = (Map) artworkElementInfo.get(i);
				boolean isBase = AWLConstants.RANGE_YES.equals(artworkElement.get(IS_BASE_COPY)); 
				boolean isMaster = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)artworkElement.get(IS_MASTER_COPY_ELEMENT));
				
				boolean isEditable = STATE_PRELIMINARY.equals(artworkElement.get(SELECT_CURRENT)) && 
								RANGE_TRUE.equalsIgnoreCase((String) artworkElement.get(MOD_ACCESS)) &&
								(isPM || (isBase && isMCAU) || (!isBase && isLCAU));
				
				boolean isStructuredElementRootType = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)artworkElement.get(PROP_INTERFACE_STRUCTMASTER));
				isEditable = isEditable ? !isStructuredElementRootType && !isMaster : isEditable;
				
				returnArry[i] = isEditable;
			}
			return returnArry;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void doArtworkContentAssignment(Context context, String[] args) throws FrameworkException {
		try {
			AWLArtworkPackageUIBase_mxJPO artworkPackageJPO = (AWLArtworkPackageUIBase_mxJPO)newInstanceOfJPO(context, "AWLArtworkPackageUI");
			Map assigneeInfo = artworkPackageJPO.getAssigneeDetails(context, args);
			String id = BusinessUtil.getString(assigneeInfo, AWLConstants.OBJECT_ID);
			String type = BusinessUtil.getInfo(context, id, SELECT_TYPE);
			String author = BusinessUtil.getString(assigneeInfo, AWLRel.ARTWORK_CONTENT_AUTHOR.get(context));
			String approver = BusinessUtil.getString(assigneeInfo, AWLRel.ARTWORK_CONTENT_APPROVER.get(context));
			
			ArtworkContent element = GraphicDocument.getGraphicDocumentTypes(context).contains(type) ?
										new GraphicDocument(id).getGraphicElement(context) :
										ArtworkContent.getNewInstance(context, id);

			element.updateAssignee(context, author, approver);
		} catch (Exception e) { throw new FrameworkException(e); }
	}	
	
	public String getArtworkElementPlaceOfOrigin (Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap =(Map) JPO.unpackArgs(args);
			
			Map requestMap =(Map) programMap.get("requestMap");
			String parentOID = (String) requestMap.get(AWLConstants.PARENT_OID);
			
			if(BusinessUtil.isNotNullOrEmpty(parentOID))
			{
				//Used in Copy Structured Element Form 
				return BusinessUtil.getInfo(context, parentOID, SELECT_NAME);
			}

			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			String masterId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_MASTER_ID);
			
			if(BusinessUtil.isNullOrEmpty(masterId))
			{
				//Used in Artwork Element View Form --> To display place of origin.
				masterId = (String) requestMap.get(AWLConstants.OBJECT_ID);
				if(new ArtworkMaster(masterId).isStructuredElement(context))
					return BusinessUtil.getInfo(context, masterId, SELECT_NAME);
			}
				
			
			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(BusinessUtil.getRequestMap(programMap), "reportFormat"));
			
			StringList placeOfOrigin = new AWLArtworkMasterUIBase_mxJPO(context, null).getPlaceOfOriginHTML(context, new StringList(masterId), true, isExporting);
			
			return BusinessUtil.isNotNullOrEmpty(placeOfOrigin) ?  placeOfOrigin.get(0).toString() : "";
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public String getElementLastApprovedContent (Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap =(Map) JPO.unpackArgs(args);
			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			String elementId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_ID);

			ArtworkContent ae = ArtworkContent.getNewInstance(context, elementId);
			ArtworkContent lastRel = ae.getLastReleasedRevision(context);
			return lastRel == null ? "" : getContent(context, args, lastRel.getId(context), false);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public String getElementCurrentContent (Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap =(Map) JPO.unpackArgs(args);
			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			String elementId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_ID);
			if(ArtworkElementUtil.isGraphicElement(context, elementId))
			{
				return getContent(context, args, elementId, false);
			}
			
			else
			{
				return AWLArtworkMasterUIBase_mxJPO.addStyleToHTML(context ,getContent(context, args, elementId, false));
			}
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public String getMasterCopyContent (Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap =(Map) JPO.unpackArgs(args);
			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			String elementId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_ID);			
			
			return getContent(context, args, elementId, true);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	@SuppressWarnings("PMD.SignatureDeclareThrowsException")
	private String getContent (Context context, String[] args, String artworkContentID, boolean getBaseCopyContent) throws Exception
	{
		Map programMap =(Map) JPO.unpackArgs(args);
		Map requestMap = BusinessUtil.getRequestMap(programMap);
		
		if(ArtworkElementUtil.isGraphicElement(context, artworkContentID))
		{
			Map fieldMap = BusinessUtil.getMap(programMap, "fieldMap");
			Map settings = BusinessUtil.getMap(fieldMap, "settings");
			
			Map tempMap = new HashMap(requestMap);
			tempMap.put("objectId", artworkContentID);
			
			Map tempProgramMap = new HashMap(programMap);
			tempProgramMap.put("requestMap", tempMap);
			tempProgramMap.put("paramList", requestMap);
			tempProgramMap.put("format", BusinessUtil.getString(settings, RouteUtil.IMAGE_SIZE));
			
			String[] newargs = JPO.packArgs(tempProgramMap);
			return ((AWLGraphicsElementUIBase_mxJPO)newInstanceOfJPO(context, "AWLGraphicsElementUI",newargs)).getGraphicImageURL(context, newargs);
		}
		else
		{	
		    CopyElement copyElement = (CopyElement) ArtworkContent.getNewInstance(context, artworkContentID);
			if(getBaseCopyContent) {
				copyElement =  (CopyElement) copyElement.getArtworkMaster(context).getBaseArtworkElement(context);
			}
			
			return ArtworkElementUtil.getCopyTextProgramHTML(context, copyElement, BusinessUtil.getString(requestMap, "reportFormat"));
		}
	}
	
	public boolean showMasterContentHeader(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);		
			
			String contentId = BusinessUtil.getObjectId(programMap);
			
			if(!BusinessUtil.isKindOf(context, contentId, AWLType.COPY_ELEMENT.get(context)))
				return false;
			
			ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, contentId);
			
			return !artworkContent.isBaseCopy(context);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public String getBaseCopyLanguage (Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap =(Map) JPO.unpackArgs(args);
			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			String elementId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_ID);
			String masterId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_MASTER_ID);
			
			Map basecopyDetails = ArtworkElementUtil.getMasterCopyByCopyElement(context, masterId, StringList.create(SELECT_ID));
			String baseCopyID = BusinessUtil.getFirstString(basecopyDetails, SELECT_ID);
			return baseCopyID.equals(elementId)?EMPTY_STRING:BusinessUtil.getAttribute(context, baseCopyID, AWLAttribute.COPY_TEXT_LANGUAGE.get(context));
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public String getPromotion (Context context, String[] args) throws FrameworkException
	{
			/*try {
			Map programMap =(Map) JPO.unpackArgs(args);

			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			
			String masterId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_MASTER_ID);
			
			ArtworkMaster master = new ArtworkMaster(masterId);
			return master.isPromotional(context) ? 
					   AWLPropertyUtil.getI18NString(context,LABEL_RANGE_YES) : AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Range.No");
		} catch (Exception e){ throw new FrameworkException(e);	}*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}
	
	public String getArtworkInlineTranslation (Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map programMap =(Map) JPO.unpackArgs(args);
			
			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			String elementId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_ID);

			ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, elementId);
			
			String inlineMsg = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Inline");
			String yesMsg = AWLPropertyUtil.getI18NString(context,LABEL_RANGE_YES);
			String noMsg = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Range.No");
			
			boolean isGraphic = artworkContent.isGraphicElement();

			if(isGraphic) {
				return "";
			} else {
				String SEL_ARTWORK_MASTER_ID = AWLUtil.strcat(TO_OPEN , AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) , "].from.id");
				String masterId = BusinessUtil.getInfo(context, elementId, SEL_ARTWORK_MASTER_ID);
				
				ArtworkMaster master = new ArtworkMaster(masterId);
				return master.isInlineTranslationElement(context) ? inlineMsg : 
					   master.isTranslationElement(context) ? yesMsg : noMsg;
			}
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public String getArtworkGeographicLocation (Context context, String[] args) throws FrameworkException
	{  
		StringBuffer html = new StringBuffer(100);
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map artworkElementInfo = getArtworkElementInfo(context, programMap);
			String artworkMasterId = BusinessUtil.getString(artworkElementInfo, AWLConstants.CONTENT_MASTER_ID);
			String contentId = (String) artworkElementInfo.get("contentId");
			
			ArtworkMaster artworkMaster = new ArtworkMaster(artworkMasterId);
			
			List<Country> existingCountries = artworkMaster.getCountries(context);
			if (existingCountries.isEmpty()) {
				return "";
			} else if (existingCountries.size() <= 3) {
				StringList slNames = new StringList();
				for (Country ctry : existingCountries) {
					slNames.add(ctry.getName(context));
				}
				Collections.sort(slNames);
				html.append(FrameworkUtil.join(slNames, " , "));
			} else {
				String strGeographicInfo = AWLPropertyUtil.getI18NString(context,"emxAWL.ManageCountries.GeographicInfo");
				strGeographicInfo = FrameworkUtil.findAndReplace(strGeographicInfo, "'", "\\\'");
				String jsInclude = "<script language=\"javascript\" type=\"text/javascript\" src=\"../awl/scripts/emxAWLUtil.js\"></script>";
				html.append(jsInclude);
				html.append("<a href=\"javascript:;\">");
				html.append("<img border=\"0\" src=\"../awl/images/AWLStatusLocationAssigned.gif\" ");
				html.append("onmouseover=\"showTooltip(event, this,'").append(strGeographicInfo).append("');\" ");
				html.append("onmouseout=\"hideTooltip(event, this);\" ");
				
				html.append("onclick=\"openManageCountryAssignments('").append(artworkMasterId).append("');\" />");
				html.append("</a>");
			}

		}  catch (Exception e){ throw new FrameworkException(e);	}

		return html.toString();
	}
	
	private Map getArtworkElementInfo(Context context, Map programMap) throws FrameworkException {
		try {
			Map requestMap = BusinessUtil.getRequestMap(programMap);
			String objectId = BusinessUtil.getObjectId(requestMap);
			String SEL_ARTWORK_MASTER_ID = AWLUtil.strcat(TO_OPEN , AWLRel.ARTWORK_ELEMENT_CONTENT.get(context) , "].from.id");
			
			String masterId = BusinessUtil.getInfo(context, objectId, SEL_ARTWORK_MASTER_ID);
			Map returnMap = new HashMap(20);
			returnMap.put(AWLConstants.CONTENT_ID, objectId);
			returnMap.put(AWLConstants.CONTENT_MASTER_ID, masterId);
			
			return returnMap;			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public boolean canAssignAuthorsAndApprovalsForBaseCopy(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String contentId = BusinessUtil.getObjectId(programMap);
            String type = BusinessUtil.getInfo(context, contentId, DomainConstants.SELECT_TYPE);
			
			ArtworkContent artworkContent = GraphicDocument.getGraphicDocumentTypes(context).contains(type) ?
									        new GraphicDocument(contentId).getGraphicElement(context) :
									        ArtworkContent.getNewInstance(context, contentId);
		   if(artworkContent == null)
			   return false;
									        
            if(!artworkContent.isBaseCopy(context) || artworkContent.isStructuredElement(context))	
            	return false;
            
			return canAssignAuthorsAndApprovals(context, artworkContent);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}

	public boolean canAssignAuthorsAndApprovalsForLocalCopy(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String contentId = BusinessUtil.getObjectId(programMap);
			
			if(!BusinessUtil.isKindOf(context, contentId, AWLType.COPY_ELEMENT.get(context)))
				return false;
			
			ArtworkContent artworkContent = ArtworkContent.getNewInstance(context, contentId);
			
            if(artworkContent.isBaseCopy(context) || artworkContent.isStructuredElement(context))	
            	return false;

            return canAssignAuthorsAndApprovals(context, artworkContent);
        } catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	private boolean canAssignAuthorsAndApprovals(Context context, ArtworkContent artworkContent) throws FrameworkException {
		String contentId = artworkContent.getId(context);
		String contentState = BusinessUtil.getInfo(context, contentId, DomainConstants.SELECT_CURRENT);
		
		return AWLState.PRELIMINARY.equalsObjectState(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT, contentState) && 
		       !RouteUtil.hasRoute(context, contentId);
	}
	
	/**
	 * Returns the default association in ranges so that id will be available, this api will be called as reload program. 
	 * Return Product Marketing name.
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  String       - POA Product Name and Product Id  
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2016x
	 * @author  AA1
	 */
    @com.matrixone.apps.framework.ui.ProgramCallable
	public Map loadDefaultPlaceOfOrigin(Context context, String[] args) throws FrameworkException
	{
		try
		{
			if (args.length == 0 ){
				throw new IllegalArgumentException();
			}
			
			HashMap resultMap = new HashMap();
			Map programMap     = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			
			Map requestMap =(Map) programMap.get("requestMap");
			String emxTableRowId = (String) requestMap.get("emxTableRowId");
			
			String objectId = AWLUIUtil.getObjIdFromRowId(emxTableRowId);
			
			if(BusinessUtil.isNotNullOrEmpty(objectId))
			{
	    		//Get all applicable place of origins
				resultMap.put("SelectedValues", objectId );
				resultMap.put("SelectedDisplayValues",  BusinessUtil.getInfo(context, objectId, SELECT_TYPE));
			}
			return resultMap;
		}catch(Exception ex){ throw new FrameworkException(ex);}
	}
    
    
	/**
	 * To Show the command or not for Lifecycle.
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Boolean      - To Show the command or not  
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2018X
	 * @author  R2J
	 */
    public boolean isStructuredElement(Context context, String[] args) throws FrameworkException
    {
    	try
    	{
    		Map programMap =(Map) JPO.unpackArgs(args);

    		String objectId = BusinessUtil.getObjectId(programMap);
    		boolean isMaster = BusinessUtil.isKindOf(context, objectId, AWLType.MASTER_ARTWORK_ELEMENT.get(context));
    		ArtworkMaster artworkMaster = isMaster ? new ArtworkMaster(objectId) : ArtworkContent.getNewInstance(context, objectId).getArtworkMaster(context); 

    		if(artworkMaster.isStructuredElement(context))
    			return true;

    		return  false;

    	} catch (Exception e){ throw new FrameworkException(e);	}
    }
    
    /**
	 * To Show the command or not for Lifecycle.
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Boolean      - To Show the command or not  
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2018X
	 * @author  R2J
	 */
    public boolean isNonStructuredElement(Context context, String[] args) throws FrameworkException
    {
    	try
    	{
    		return !isStructuredElement(context, args); 

    	} catch (Exception e){ throw new FrameworkException(e);	}
    }
}

