/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import static com.matrixone.apps.awl.util.AWLConstants.CLOSEBRACKET_FROM_ID;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.Vector;
import java.util.stream.Collectors;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import com.matrixone.apps.awl.dao.AWLObject;
import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkFile;
import com.matrixone.apps.awl.dao.ArtworkMaster;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.Brand;
import com.matrixone.apps.awl.dao.CPGProduct;
import com.matrixone.apps.awl.dao.CopyElement;
import com.matrixone.apps.awl.dao.CustomizationPOA;
import com.matrixone.apps.awl.dao.GraphicDocument;
import com.matrixone.apps.awl.dao.GraphicsElement;
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
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUIUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.Access;
import com.matrixone.apps.awl.util.ArtworkUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.common.util.ImageManagerUtil;
import com.matrixone.apps.cpd.dao.Country;
import com.matrixone.apps.cpd.dao.Language;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import matrix.db.Context;
import matrix.db.File;
import matrix.db.FileList;
import matrix.db.JPO;
import matrix.util.StringList;

@SuppressWarnings({ "PMD.SignatureDeclareThrowsException", "PMD.TooManyMethods","PMD.ExcessivePublicCount","PMD.AvoidCatchingThrowable" })
public class AWLPOAUIBase_mxJPO extends AWLObject_mxJPO
{
	private static final long serialVersionUID = -2812178350755487707L;
	private static final String OBJECT_ID = "objectId";
	private static final String ROUNDTRIP_INFO_MAP = "ROUNDTRIP_INFO_MAP";
	private static final String FILE_CHECKED_IN = "FILE_CHECKED_IN";
	private static final String FORMAT_AI = "ai";
	private static final String FALSE = "false";
	private static final String TRUE = "true";
	private static final String ROUNDTRIP_CONTENT = "ROUNDTRIP_CONTENT";
	private static final String IS_PRESENT = "IS_PRESENT";
	private static final String IS_MATCHING = "IS_MATCHING";
	private static final String NO_TEXT_FOUND =  "";
	private static final String ACTUAL_CONTENT = "ACTUAL_CONTENT";
	
	public AWLPOAUIBase_mxJPO(Context context, String[] args) throws Exception
	{
		super(context, args);
	}

	/**
	 * Program HTML Program which will returns the Associated Local Languages of POA. 
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @param  objectId - Object Id of the CPG Product
	 * @return String	Column Map Values of the Expanded Objects in HTML format
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since  VR2015x.HF1
	 * Created during 'POA Simplification Highlight'
	 * @deprecated during Copy List Highlight by N94
	 */
	public StringList showLanguagesAssigned(Context context, String args[]) throws FrameworkException
	{
		return super.showLanguagesAssociated(context, args);
	}
	
	/**
	 * @deprecated use AWLObject showLanguagesAssociated
	 */	
	public StringList showLanguagesAssociated(Context context, String args[]) throws FrameworkException
	{
		return super.showLanguagesAssociated(context, args);
	}
	
	/**
	 * Gets the Details for Context POA's Connected 'CPG Product's Information
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - String[] - Enovia JPO packed arguments 
	 * @return StringList	List of "CPG Product' Information 
	 * @throws FrameworkException
	 */

	public StringList getPOADescription(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap 	 = (HashMap) JPO.unpackArgs(args);
			MapList objectList 	 = BusinessUtil.getObjectList(programMap);
			

			HashMap paramList = (HashMap)programMap.get(BusinessUtil.PARAM_LIST);
			boolean isFileExport = paramList != null && paramList.containsKey("reportFormat");			
			
			StringList ids = BusinessUtil.getIdList(objectList);
			StringList poasDesc = BusinessUtil.getInfo(context, ids, SELECT_DESCRIPTION);
			boolean[] isKindOFPOA = BusinessUtil.isKindOf(context, ids, AWLType.POA.get(context));

			String labelI18NProduct = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ProductName");
			String labelI18NLanguages = AWLPropertyUtil.getI18NString(context, "emxAWL.common.Languages");
			String labelI18NCountries = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.POACountries");
			String labelI18NArtworkUsage = AWLPropertyUtil.getI18NString(context, "emxAWL.Action.AWLArtworkUsage");
			
			StringList returnHTML = new StringList(ids.size());
			
			for (int i = 0; i < ids.size(); i++) {
				if(!isKindOFPOA[i] || isFileExport) {
					returnHTML.add(XSSUtil.encodeForHTML(context, (String)poasDesc.get(i)));
					continue;
				}
				
				POA poa = new POA((String) ids.get(i));
				
				String cpgProductName = poa.getProductName(context);			
				List<Country> poaCountries = poa.getCountries(context);
				List<Language> poaLanguages = poa.getSortedLanguages(context); 
				String poaArtUsage = poa.getArtworkUsage(context);
				
				
				StringList encodedCountries = new StringList(poaCountries.size());
				for (Country country : poaCountries) {
					encodedCountries.add(XSSUtil.encodeForHTML(context, country.getName()));
				}
				Collections.sort(encodedCountries);
				
				StringList encodedLanguages = new StringList(poaLanguages.size());
				for (Language language : poaLanguages) {
					encodedLanguages.add(XSSUtil.encodeForHTML(context, language.getName(context))); 
				}
				
				StringBuilder builder = new StringBuilder(200);
				String BOLD_TAG_START = "<b>";
				String BR_TAG = "<br/>";
				String OBJ_SEPERATOR = ", ";
				builder.append(BOLD_TAG_START).append(labelI18NProduct).append(" : </b> ").append(XSSUtil.encodeForHTML(context, cpgProductName)).append(BR_TAG);
				builder.append(BOLD_TAG_START).append(labelI18NArtworkUsage).append(" : </b> ").append(XSSUtil.encodeForHTML(context,poaArtUsage)).append(BR_TAG);
				builder.append(BOLD_TAG_START).append(labelI18NCountries).append(" : </b><br/> ").append(FrameworkUtil.join(encodedCountries, OBJ_SEPERATOR)).append(BR_TAG);
				builder.append(BOLD_TAG_START).append(labelI18NLanguages).append(" : </b><br/> ").append(FrameworkUtil.join(encodedLanguages, OBJ_SEPERATOR)).append(BR_TAG);
				
				returnHTML.add(builder.toString());
			}
			return returnHTML;
		}catch(Exception ex){ throw new FrameworkException(ex);}
	}	
	
	/**
	 * Returns POA ArtworkPackage Column detail
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Vector       - list of POA ArtworkPackage Column info
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2013x
	 * @author BV8
	 */
	public StringList getArtworkColumnValue(Context context, String[] args) throws FrameworkException
	{
		StringList currentValues = new StringList();
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			Map requestMap     = BusinessUtil.getRequestParamMap(programMap);
			ArtworkPackage artWork = null;
			String artworkId   = BusinessUtil.getString(requestMap, "artworkId");
			if(BusinessUtil.isNotNullOrEmpty(artworkId)) 
				artWork = new ArtworkPackage(artworkId);

			for (Object obj : objectList)
			{
				Map objectMap = (Map)obj;
				boolean isConnected = false;
				if(artWork != null) {
					String id	  = BusinessUtil.getId(objectMap);
					isConnected = artWork.isPOAConnectedToArtwork(context, id);
				}
				currentValues.add(isConnected ? "Yes" : "No");
			}

		}catch(Exception ex){ throw new FrameworkException(ex);}
		return currentValues;
	}

	protected StringList getPOAProductIds(Context context, StringList poaIds) throws FrameworkException {
		try {
			String productSel = AWLUtil.strcat("to[", AWLRel.ASSOCIATED_POA.get(context), "].from.id");			
			return BusinessUtil.getInfo(context, poaIds, productSel);
			
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	
	/**
	 * Returns POA Product Name Column detail
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Vector       - list of POA Product Name Column info
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2013x
	 * @author  BV8
	 */
	public StringList getPOAProductName(Context context, String[] args) throws FrameworkException
	{
		StringList currentValues = new StringList();
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			
			StringList idList  = BusinessUtil.getIdList(objectList);
			StringList prdIds = getPOAProductIds(context, idList);
			StringList prdList = BusinessUtil.getInfo(context, prdIds, AWLAttribute.MARKETING_NAME.getSel(context));

			for(int i = 0; i < prdList.size(); i++)
			{
				String prdName = prdList.get(i).toString();
				prdName = FrameworkUtil.findAndReplace(prdName, "&amp;", "&");
				prdName = FrameworkUtil.findAndReplace(prdName, "&", "&amp;");

				prdName = AWLUtil.strcat("<p><span style='font-weight:bold'>", prdName, "</span></p>");
				currentValues.add(prdName);
			}
		}catch(Exception ex){ throw new FrameworkException(ex);}
		return currentValues;
	}

	public StringList getPOAProductHierarchy(Context context, String[] args) throws FrameworkException 
	{
		try
		{
			Map programMap     = (Map)JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);
			Map requestMap      = BusinessUtil.getRequestParamMap(programMap);		 

			StringList poaIdList  = BusinessUtil.getIdList(objectList);

			String SEL_ATTR_MARKETING_NAME = AWLUtil.strcat("attribute[", AWLAttribute.MARKETING_NAME.get(context), "]");
			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(requestMap, "exportFormat"));
			if(isExporting)
			{
				StringList poaIds = BusinessUtil.getIdList(objectList);
				return BusinessUtil.getInfo(context, getPOAProductIds(context, poaIds), SEL_ATTR_MARKETING_NAME);
			}

			return ArtworkUtil.getPOAHierarchyHTML(context, poaIdList, new StringList(AWLType.MODEL.get(context)));

		}catch(Exception e){ throw new FrameworkException(e);}

	}

	public boolean isPOAAssignment(Context context, String[] args) throws FrameworkException
	{
		try{
			Map requestMap    = (Map)JPO.unpackArgs(args);
			AWLArtworkPackageUIBase_mxJPO apui = new AWLArtworkPackageUIBase_mxJPO(context, null);
			String actionType = apui.getActionType(requestMap);
			return "POA".equalsIgnoreCase(actionType);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkContentPOAs(Context context, String[] args) throws FrameworkException
	{
		try
		{
			Map requestMap 	 = (Map)JPO.unpackArgs(args);
			String objectId  = BusinessUtil.getObjectId(requestMap);

			ArtworkContent ac = ArtworkContent.getNewInstance(context, objectId);
			ArtworkMaster am = ac.getArtworkMaster(context);
			return am.getArtworkContentPOAs(context);
		}catch(Exception ex){ throw new FrameworkException(ex);}
	}
	
	/**
	 * @deprecated -- During Rountrip Sync Highlight
	 */
	public boolean isAIDocumentCheckedIn(Context context, String[] args) throws FrameworkException 
	{
		try {
			Map programMap = (Map)JPO.unpackArgs(args);
			POA poaObject = new POA((String) programMap.get(OBJECT_ID));
			if(!poaObject.isKindOf(context, AWLType.POA)){
				return false;
			}
			return !getCheckedInAIFileList(context, poaObject).isEmpty();
		}
		catch(Exception e) { throw new FrameworkException(e);}
	}
	
	/**
	 * Access Expression Program to show or hide the Response Columns in Rountrip Assembly table.
	 * @param context - the enovia <code>Context</code> object
	 * @param args - String[] - enovia JPO packed arguments
	 * @return - boolean value to show or hide the column. 
	 * @throws FrameworkException
	 * @since CAP V2015x.HF10
	 * @author R2J(Raghavendra M J)
	 * Created during Rountrip Sync Highlight
	 */
	public boolean isResponseFileCheckedIn(Context context, String[] args) throws FrameworkException 
	{
		try 
		{
			Map programMap = (Map)JPO.unpackArgs(args);
			POA poaObject = new POA((String) programMap.get(OBJECT_ID));
			if(!poaObject.isKindOf(context, AWLType.POA))
				return false;
			
			return BusinessUtil.isNotNullOrEmpty(poaObject.getArtworkFile(context).getArtworkResponse(context));
		}
		catch(Exception e) { throw new FrameworkException(e);}
	}
	
	/**
	 * @param   context - the enovia <code>Context</code> object
	 * @param poaObject	
	 * @return  FileList       - list of checkedin files
	 * @since   AWL 2016x
	 * @author  WX7 
	 * @throws FrameworkException
	 * @deprecated ==  During Rountrip Sync Highlight 
	 */
	protected FileList getCheckedInAIFileList(Context context, POA poaObject) throws FrameworkException {
		try {
			ArtworkFile artworkFileObject = poaObject.getArtworkFile(context);
			FileList fileList = artworkFileObject.getFiles(context);
			FileList aiFileList = new FileList();
			for(int i = 0; i < fileList.size();i++) {
				File fileObject =(File) fileList.get(i);
				String fileName = fileObject.getName();
				String fileFormat = fileName.substring(fileName.lastIndexOf(".")+1);
				if(FORMAT_AI.equalsIgnoreCase(fileFormat)) {
					aiFileList.add(fileObject);
				}
			}
			return aiFileList;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * program called from POA Artwork Assembly page
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  MapList       - list of Local copy elements connected to POA
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2015x
	 * @author  WX7 - modified existing code to handle the roundtrip XML scenario 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAContent(Context context, String[] args) throws FrameworkException {
		try {
			Map paramMap = (Map) JPO.unpackArgs(args);
			String poaId = (String) paramMap.get(OBJECT_ID);
			String IS_GRAPHIC = AWLUtil.strcat("type.kindof[" , AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context) , "]");
			POA poaObject = new POA(poaId);
			String instanceSeqSelect = AWLAttribute.INSTANCE_SEQUENCE.getSel(context);
			String sequenceNumberSelect = AWLAttribute.ARTWORK_ELEMENT_SEQUENCE_ORDER.getSel(context);
			StringList selectables = new StringList(instanceSeqSelect);
						selectables.add(sequenceNumberSelect);
			MapList masterCopyList = poaObject.getArtworkMasters(context, new StringList(SELECT_ID),
					selectables, 
					AWLConstants.EMPTY_STRING);
			StringList masterIDList = BusinessUtil.getIdList(masterCopyList);
			
			Map<String, String> sequenceNumberIDMap = new HashMap<String, String>();
			Map<String, String> instanceSequenceIDMap = new HashMap<String, String>();
			for(Map master : (List<Map>) masterCopyList){
				String masterId = (String) master.get(SELECT_ID);
				String sequenceNumber = (String) master.get(AWLAttribute.ARTWORK_ELEMENT_SEQUENCE_ORDER.getSel(context));
				String instanceSequence = (String) master.get(AWLAttribute.INSTANCE_SEQUENCE.getSel(context));
				sequenceNumberIDMap.put(masterId, sequenceNumber);
				instanceSequenceIDMap.put(masterId, instanceSequence);
			}
				MapList assemblyElementsList =  poaObject.getArtworkAssemblyStructure(context, StringList.create(IS_GRAPHIC, SELECT_ID));
			for(Map localMap : (List<Map>) assemblyElementsList){
				// checking the level will indicate that the element we are iterating is a child element of an structured element
				String sequenceNumber = "";
				String instanceSequenceNumber = "";
				if("1".equalsIgnoreCase((String) localMap.get("level"))){
					String masterId = (String) localMap.get("masterId");
					masterId = BusinessUtil.getApplicableObjectRevFromList(context, masterId, masterIDList);
					if(masterId == null)
						continue;
					sequenceNumber = sequenceNumberIDMap.get(masterId);
					instanceSequenceNumber = instanceSequenceIDMap.get(masterId);
				}
				localMap.put("sequenceNumber", sequenceNumber);
				localMap.put("instanceSequence", instanceSequenceNumber);
			}
			return assemblyElementsList;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	/**
	 * Program to display difference
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   contentOnCopyElement - content on copy element
	 * @param  contentOnArtworkFile       - copy content on artwork file
	 * @return String	- HTML for displaying difference
	 * @since   AWL 2016x
	 * @author  (Copied logic from AWLArtworkElementUIBase : getCopyTextDiff) WX7
	 * @modified Raghavendra M J(R2J) -- During Graphic Support Highlight
	 * @deprecated
	 */
	public StringList getCompareTextHTML(Context context, String[] args) throws FrameworkException 
	{
		try
		{
			/*HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList objList 	 = BusinessUtil.getObjectList(programMap);
			StringList returnList = new StringList(objList.size());
			
			String IS_GRAPHIC = AWLUtil.strcat("type.kindof[" , AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context) , "]");

			for(int i = 0; i < objList.size();i++){
				Map objectMap = (Map) objList.get(i);
				Map mappedCopyInfo = (Map) objectMap.get(ROUNDTRIP_INFO_MAP);
				boolean fileCheckedIn = mappedCopyInfo != null && TRUE.equals(mappedCopyInfo.get(FILE_CHECKED_IN));

				if(fileCheckedIn && TRUE.equals(mappedCopyInfo.get(IS_PRESENT)))
				{
					String objectId = (String) objectMap.get(DomainConstants.SELECT_ID);
					String roundTripHTML = "";
					String extsintingCOntent = (String) mappedCopyInfo.get(ACTUAL_CONTENT);
					String modifiedContent = (String) mappedCopyInfo.get(ROUNDTRIP_CONTENT);

					String isGraphiElement = (String) objectMap.get(IS_GRAPHIC);
					if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(isGraphiElement)) 
					{
						String modifiedDate = new GraphicsElement(objectId).getGraphicDocument(context).getModified(context);						
						long exisiting = BusinessUtil.getUnixTimeStampInSec(modifiedDate);

						if(BusinessUtil.isNotNullOrEmpty(modifiedContent))
						{
							long modified = Long.parseLong(modifiedContent);
							String modifiedString = AWLPropertyUtil.getI18NString(context,"emxFramework.Basic.Modified");
							roundTripHTML = modified != exisiting ? AWLUtil.strcat(modifiedString , ": ", modifiedDate) : EMPTY_STRING;
						}
					} else {
						roundTripHTML = AWLUtil.getCompareHTMLString(context, extsintingCOntent, modifiedContent);	
					}

					returnList.add(roundTripHTML);
				} else {
					returnList.add(DomainConstants.EMPTY_STRING);
				}
			}
			return returnList;*/
			
			return EMPTY_STRINGLIST;
			
		}catch(Exception e){ throw new FrameworkException(e); }
	}
	
	/**
	 * Helper program to get information about the roundtrip XML file checkedin
	 *
	 * @param   mappedDoc      - XML DOM Document object 
	 * @param   xmlKey         - Key used to represent artwork elements in roundtrip XML
	 * @param  copyContent       - copy content of copy element
	 * @return Map	- Map having information about the artwork element presence | content matching status.
	 * @since   AWL 2016x
	 * @author  WX7
	 * @modified Raghavendra M J(R2J) -- During Graphic Support Highlight
	 * @throws FrameworkException 
	 */
	@SuppressWarnings("unchecked")
	private Map getMappedElementInfo(Context context, String assemblyElementId, Document mappedDoc, String xmlKey, String copyContent) throws FrameworkException 
	{
		try
		{
			boolean isPresent = false;
			boolean isMatching = false;
			String roundtripContent = NO_TEXT_FOUND;

			if(mappedDoc != null) {
				NodeList customSchemaRoot = mappedDoc.getElementsByTagName("awl:poa");
				if(customSchemaRoot.getLength() != 0) 
				{
					Element customSchemaRootEl = (Element) customSchemaRoot.item(0);
					NodeList copyElements = customSchemaRootEl.getElementsByTagName("rdf:li");
					for(int j = 0 ; !isPresent && j < copyElements.getLength(); j++)
					{
						Element copyElementMetadata = (Element) copyElements.item(j);
						String copyKey = copyElementMetadata.getElementsByTagName("awl:artworkelementID").item(0).getTextContent();
						isPresent = xmlKey.equals(copyKey);
						if(isPresent) {
							roundtripContent = copyElementMetadata.getElementsByTagName("awl:artworkelementContent").item(0).getTextContent();;
						}

						if(BusinessUtil.isKindOf(context, assemblyElementId, AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context)))
						{
							/*String modifiedDate = new GraphicsElement(assemblyElementId).getGraphicDocument(context).getModified(context);
							long exisiting = BusinessUtil.getUnixTimeStampInSec(modifiedDate);

							if(BusinessUtil.isNotNullOrEmpty(roundtripContent))
							{
								long modified = Long.parseLong(roundtripContent);
								isMatching = modified == exisiting;
							}*/
							
							/* IR-491905  For the Out of Sync Cases, we are considering primary image version id as the base for comaparision */
							GraphicDocument graphicDoc = new GraphicsElement(assemblyElementId).getGraphicDocument(context);
							Map primaryImageNameInfo = graphicDoc.getPrimaryImageNameInfo(context);
							String exisiting = primaryImageNameInfo.isEmpty() ? AWLConstants.EMPTY_STRING : (String) primaryImageNameInfo.get(AWLConstants.FILE_ID);
							isMatching = BusinessUtil.isNotNullOrEmpty(roundtripContent) && exisiting.equalsIgnoreCase(roundtripContent);
						}
						else
						{
							isMatching = isPresent && roundtripContent.equals(copyContent);	
						}
					}
				}
			} // !null check

			Map returnMap = new HashMap();
			returnMap.put(FILE_CHECKED_IN, TRUE);
			returnMap.put(ROUNDTRIP_CONTENT, roundtripContent);
			returnMap.put(ACTUAL_CONTENT, copyContent);
			returnMap.put(ACTUAL_CONTENT,BusinessUtil.isNullOrEmpty(copyContent)  ? NO_TEXT_FOUND : copyContent);
			returnMap.put(IS_PRESENT, isPresent ? TRUE : FALSE);
			returnMap.put(IS_MATCHING, isMatching ? TRUE : FALSE);

			return returnMap;
		}catch(Exception e){ throw new FrameworkException(e); }
	}
	
	/**
	 * Column program to get artwork content in POA artwork assembly page
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  StringList       - list of Local copy elements copy content
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2016x
	 * @author  WX7
	 * @modified Raghavendra M J(R2J) -- During Graphic Support Highlight
	 * @deprecated
	 */
	
	public StringList getRoundtripContent(Context context,String[] args) throws FrameworkException 
	{
		try
		{
			/*HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList objList 	 = BusinessUtil.getObjectList(programMap);
			StringList returnList = new StringList(objList.size());
			String IS_GRAPHIC = AWLUtil.strcat("type.kindof[" , AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context) , "]");

			for(int i = 0; i < objList.size();i++){
				Map objectMap = (Map) objList.get(i);
				Map mappedCopyInfo = (Map) objectMap.get(ROUNDTRIP_INFO_MAP);
				boolean fileCheckedIn = mappedCopyInfo != null && TRUE.equals(mappedCopyInfo.get(FILE_CHECKED_IN));
				if(fileCheckedIn){
					boolean isPresent = TRUE.equals(mappedCopyInfo.get(IS_PRESENT));
					String isGraphiElement = (String) objectMap.get(IS_GRAPHIC);
					if(AWLConstants.RANGE_TRUE.equalsIgnoreCase(isGraphiElement))
						returnList.add(DomainConstants.EMPTY_STRING);
					else
						returnList.add(!isPresent ? "NA" : mappedCopyInfo.get(ROUNDTRIP_CONTENT).toString());
				}
			}
			return returnList;*/
			return EMPTY_STRINGLIST;
			
		}catch(Exception e){ throw new FrameworkException(e); }
	}

	/**
	 * Column program to get artwork content in POA artwork assembly page
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  StringList       - list of Local copy elements copy content
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2016x
	 * @author Raghavendra M J(R2J) -- AddDuring Graphic Support Highlight
	 */
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public StringList getArtworkElementContent(Context context,String[] args) throws FrameworkException 
	{
		try
		{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList elementMapList 	 = BusinessUtil.getObjectList(programMap);
			StringList elementContentList = new StringList(elementMapList.size());
			String IS_GRAPHIC = AWLUtil.strcat("type.kindof[" , AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context) , "]");
			String reportFormat = BusinessUtil.getString(BusinessUtil.getRequestParamMap(programMap), "exportFormat");
			//boolean isReportFormatExist = (BusinessUtil.isNotNullOrEmpty(reportFormat) && ("CSV".equalsIgnoreCase(reportFormat) || "Text".equalsIgnoreCase(reportFormat)))?true:false;
			
			boolean isTxtReportFormat = BusinessUtil.isNotNullOrEmpty(reportFormat) && 
                    ("CSV".equalsIgnoreCase(reportFormat) || "Text".equalsIgnoreCase(reportFormat));
			boolean useHTMLArtworkContent = !isTxtReportFormat;

			StringList idList = new StringList();
			Map graphicURLMap = new HashMap(elementMapList.size());
			for (Map elementMap :(List<Map>) elementMapList) 
			{
				//This API is used by compare tab also, In compare tab new element from response can have empty element id.
				// Check for artworkId First always in compare Tab --> id --> Contains JSON formatted map.
				String objectId = elementMap.containsKey("artworkId") && elementMap.containsKey("artworkType") ? (String)elementMap.get("artworkId") :
								  elementMap.containsKey(SELECT_ID) ? (String) elementMap.get(SELECT_ID) :  EMPTY_STRING ;

					if(BusinessUtil.isNullOrEmpty(objectId))
					{
						elementContentList.add(EMPTY_STRING);
					} 
					else 
					{
						boolean isGraphiElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) elementMap.get(IS_GRAPHIC)) ;
						if(isGraphiElement) 
						{
							if(useHTMLArtworkContent)
								graphicURLMap.put(objectId, getImageURLs(context, new StringList(objectId), programMap, true));
							else 
								graphicURLMap.put(objectId, EMPTY_STRING);
						}
						else 
						{
							// capturing copy elemnt object Id.
							idList.add(objectId);
						}
					}
			}

			String objectSelect = useHTMLArtworkContent ? "attribute["+  AWLAttribute.COPY_TEXT.get( context ) +"_RTE]" : 
														"attribute["+  AWLAttribute.COPY_TEXT.get( context ) +"]";

			StringList selects = BusinessUtil.toStringList(objectSelect, SELECT_ID, IS_GRAPHIC);
			MapList copyElementInfoList = BusinessUtil.getInfo(context, idList, selects);

			StringList returnList = new StringList(elementMapList.size());
			
			for (Map elementMap : (List<Map>) elementMapList) 
			{
				//This API is used by compare tab also, In compare tab new element from response can have empty element id.
				// Check for artworkId First always in compare Tab --> id --> Contains JSON formatted map.
				String objectId = elementMap.containsKey("artworkId") && elementMap.containsKey("artworkType") ? (String)elementMap.get("artworkId") :
								  elementMap.containsKey(SELECT_ID) ? (String) elementMap.get(SELECT_ID) :  EMPTY_STRING ;
				
				boolean isGraphiElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) elementMap.get(IS_GRAPHIC)) ;
				if(isGraphiElement && BusinessUtil.isNotNullOrEmpty(objectId)) {
					StringList urls = (StringList)graphicURLMap.get(objectId);
					returnList.add((String)(urls.get(0)));
				} else {
					Map currentMap = BusinessUtil.getMapWithValue(copyElementInfoList, SELECT_ID, objectId);
					//returnList.add((String) currentMap.get(objectSelect));	
					String copyText = (String) currentMap.get(objectSelect);
					String returnEncodedForProgramHTML = EMPTY_STRING;
					if(copyText != null)
						returnEncodedForProgramHTML = AWLUIUtil.getHTMLEncodeForProgramHTML(context, copyText);
					String content = AWLUtil.strcat("<span class=\"verbatim\">", returnEncodedForProgramHTML, "</span>");
					returnList.add(content);
				}
			}
			return returnList;

		} catch(Exception e){ throw new FrameworkException(e); }
	}
	  
	/**
	 * Column program to get roundtrip xml content state in POA artwork assembly page
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  StringList       - list of flag value for each assembly element
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2016x
	 * @author  WX7
	 * @deprecated
	 */
	
	public StringList getRoundtripCompareFlag(Context context, String[] args) throws FrameworkException {
		try{
			/*HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList objList 	 = BusinessUtil.getObjectList(programMap);
			StringList returnList = new StringList(objList.size());
			String Roundtripmatchtooltip = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.RoundtripMatch");
			String Roundtripnomatchtooltip = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.RoundtripNoMatch");
			String Roundtripmissingmatchtooltip = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.RoundtripMissingMatch");
			String ROUNDTRIP_MATCH_HTML = "<img alt = \"RoundTrip Match\" src=\"../common/images/RefreshGreen_btn.png\" width=\"20px\" height=\"32px\" onmouseover=\"showTooltip(event, this, '"+Roundtripmatchtooltip+"');\" onmouseout=\"hideTooltip(event, this);\" />";
			String ROUNDTRIP_NOMATCH_HTML = "<img alt = \"RoundTrip MisMatch\"  src=\"../common/images/RefreshRed_btn.png\" width=\"20px\" height=\"32px\" onmouseover=\"showTooltip(event, this, '"+Roundtripnomatchtooltip+"');\" onmouseout=\"hideTooltip(event, this);\" />";
			String ROUNDTRIP_MISSING_HTML = "<img src=\"../common/images/RefreshRed_btn.png\" width=\"20px\" height=\"32px\" onmouseover=\"showTooltip(event, this,'"+Roundtripmissingmatchtooltip+"');\" onmouseout=\"hideTooltip(event, this);\"/>";
			for(int i = 0; i < objList.size();i++){
				Map objectMap = (Map) objList.get(i);
				Map mappedCopyInfo = (Map) objectMap.get(ROUNDTRIP_INFO_MAP);
				
				boolean fileCheckedIn = mappedCopyInfo != null && TRUE.equals(mappedCopyInfo.get(FILE_CHECKED_IN));
				String flag = "";
				if(fileCheckedIn){
				boolean isPresent = TRUE.equals(mappedCopyInfo.get(IS_PRESENT));
				boolean isMatching = TRUE.equals(mappedCopyInfo.get(IS_MATCHING));
				
				flag = !fileCheckedIn || !isPresent ? ROUNDTRIP_MISSING_HTML :
							   isMatching ? ROUNDTRIP_MATCH_HTML : ROUNDTRIP_NOMATCH_HTML;
				}
				returnList.add(flag);
			}
			
			return returnList;*/
			return EMPTY_STRINGLIST;
			
		}catch(Exception e){ throw new FrameworkException(e); }
	}

	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkFiles(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String  objectId   = (String) programMap.get(OBJECT_ID);
			POA domPOA = new POA(objectId);
			return domPOA.related(AWLType.ARTWORK_FILE, AWLRel.PART_SPECIFICATION).relid().query(context);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getConnectedFilesFromArtworkFile(Context context, String[] args) throws FrameworkException
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String  objectId   = (String) programMap.get(OBJECT_ID);
			POA domPOA = new POA(objectId);
			ArtworkFile artworkFile = domPOA.getArtworkFile(context);
			MapList returnList =  artworkFile.related(AWLType.ARTWORK_FILE, AWLRel.LATEST_VERSION).relid().rev().name().type().state().sel("latest").attr(AWLAttribute.TITLE).query(context);
			for (Map elementMap :(List<Map>) returnList) 
			{
				//elementMap.put(CommonDocument.SELECT_FILE_FORMAT, ImageManagerUtil.getFileExtension((String)elementMap.get(AWLAttribute.TITLE.get(context))));
				elementMap.put("isLatestRevision", Boolean.getBoolean((String)elementMap.get("latest")));
				String fileExtension = ImageManagerUtil.getFileExtension((String)elementMap.get(AWLAttribute.TITLE.getSel(context)));
				elementMap.put(CommonDocument.SELECT_FILE_FORMAT, fileExtension);
			}
			
			
			return returnList;
		} catch (Exception e) { throw new FrameworkException(e);}
	}

	public String getApprovalAssignee(Context context, String[] args)
	throws FrameworkException {
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get("paramMap");
			String objectId = (String) paramMap.get(OBJECT_ID);

			POA domPOA = new POA(objectId);
			return domPOA.getApprovalAssigneeName(context);

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkFilesWhereUsed(Context context, String[] args) throws FrameworkException 
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String strObjectId = (String) programMap.get(OBJECT_ID);
			String strFunctionality = (String) programMap.get("functionality");

			String strGenericRelationKey = AWLUtil.strcat("emxAWL.whereUsedRelationship.", strFunctionality);
			strGenericRelationKey = strGenericRelationKey.trim();

			String strGenericTypeKey = AWLUtil.strcat("emxAWL.whereUsedType.", strFunctionality);
			strGenericTypeKey = strGenericTypeKey.trim();

			String strRelPattern = AWLPropertyUtil.getConfigPropertyString(context,strGenericRelationKey);

			if(strRelPattern!=null && !"*".equals(strRelPattern))
			{
				StringList relPatternList = FrameworkUtil.split(strRelPattern, ",");
				StringList tempRelPatternList = new StringList();
				for (int i = 0; i < relPatternList.size(); i++)
				{
					String tempRel = (String) relPatternList.get(i);
					tempRel = PropertyUtil.getSchemaProperty(context, tempRel);
					tempRelPatternList.add(tempRel);
				}
				strRelPattern = FrameworkUtil.join(tempRelPatternList, ",");
			}

			String typePattern = AWLPropertyUtil.getConfigPropertyString(context,strGenericTypeKey);
			if(typePattern!=null && !typePattern.equals("*"))
			{
				StringList typePatternList = FrameworkUtil.split(typePattern, ",");
				StringList tempTypePatternList = new StringList();
				for (int i = 0; i < typePatternList.size(); i++) 
				{
					String tempType = (String) typePatternList.get(i);
					tempType = PropertyUtil.getSchemaProperty(context, tempType);
					tempTypePatternList.add(tempType);
				}
				typePattern = FrameworkUtil.join(tempTypePatternList, ",");
			}
			
			StringList objectSelects = new StringList(1);
			objectSelects.add(DomainObject.SELECT_ID);

			StringList relationshipSelects = new StringList(1);
			relationshipSelects.add(DomainRelationship.SELECT_NAME);

			POA domPOA = new POA(strObjectId);
			MapList mapIdOfArtworkFile = domPOA.getRelatedObjects(context, strRelPattern, typePattern,
					                                                objectSelects, relationshipSelects, 
					                                                true, true, (short) 1, 
					                                                null, null, 0);

			MapList whereUsedObjects = new MapList(mapIdOfArtworkFile.size());
			for (Map artworkFiles : (List<Map>)mapIdOfArtworkFile) {
				String strArtworkObjectId = (String) artworkFiles.get("id");
				DomainObject domArtworkFiles = new DomainObject(strArtworkObjectId);

				whereUsedObjects = domArtworkFiles.getRelatedObjects(context,
						strRelPattern, typePattern, objectSelects,
						relationshipSelects, true, true, (short) 1, null, null, 0);

			}
			return whereUsedObjects;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public static MapList getPOAWhereUsed(Context context, String[] args) throws FrameworkException 
	{
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String strObjectId = (String) programMap.get("objectId");
			POA poa = new POA(strObjectId);
			ArtworkPackage ap = poa.getArtworkPackage(context);
			MapList aps = new MapList(1);
			Map apMap = new HashMap(1);
			apMap.put(SELECT_ID, ap.getId(context));
			aps.add(apMap);
			return aps;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public String getCurrentStateHTML(Context context, String[] args) throws FrameworkException {
		try {
			POA poa = new POA(args[0]);
			Map info = poa.getInfo(context, BusinessUtil.toStringList(SELECT_POLICY, SELECT_CURRENT));
			String policy = (String) info.get(SELECT_POLICY);
			String current = (String) info.get( SELECT_CURRENT);
			
			String i18NState = AWLPropertyUtil.getStateI18NString(context, policy, current);
		
				StringBuilder builder = new StringBuilder(300);
				builder.append(i18NState);
				return builder.toString();

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	//N94 IR-173923V6R2013x 
	public String getConnectedArtworkPackage(Context context, String[] args)
	throws FrameworkException {

		try{
			Map programMap = (Map) JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get("paramMap");
			String objectId = (String) paramMap.get(OBJECT_ID);		
			POA poa = new POA(objectId);
			ArtworkPackage ap = poa.getArtworkPackage(context);
			if(ap==null){
				return "";
			}
			Map info = ap.getInfo(context, BusinessUtil.toStringList(SELECT_ID, SELECT_NAME));
			String returnId = (String) info.get( SELECT_ID);
			String returnString = (String) info.get(SELECT_NAME);
			StringBuffer sbLink=new StringBuffer(150);
			sbLink.append("<a href=\"javascript:;\" onclick=\"javascript:showModalDialog('../common/emxTree.jsp?objectId=");
			sbLink.append(returnId);
			sbLink.append("','true');\">");
			sbLink.append(returnString);
			sbLink.append("</a>");
			return sbLink.toString();
		}
		catch(Exception e){ throw new FrameworkException(e);}
	}

	/**
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  Boolean       - Is part of Art
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2013x
	 * @author E55
	 */
	public boolean showPartOfArtworkPackageColumn(Context context, String[] args) throws FrameworkException
	{
		try{
			 Map programMap     = (Map)JPO.unpackArgs(args);
			    String artworkId   = BusinessUtil.getString(programMap, "artworkId");
			    return BusinessUtil.isNotNullOrEmpty(artworkId); 	
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	/**
	 *  Get Vector of Strings for Document Action Icons
	 *
	 *  @param context the eMatrix <code>Context</code> object
	 *  @param args an array of String arguments for this method
	 *  @return Vector object that contains a vector of html code to
	 *        construct the Actions Column.
	 *  @throws Exception if the operation fails
	 * 	@author R2J
	 */

	public static StringList getDocumentActions(Context context, String args[]) throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			HashMap checkMap = new HashMap(programMap);
			MapList objectList 	 = BusinessUtil.getObjectList(checkMap);
			Map paramList = (Map)programMap.get(BusinessUtil.PARAM_LIST);
			MapList newObjectList = new MapList();
			Map newParam = new HashMap(paramList);
			for(Object obj:objectList)
			{
				Map map= (Map)obj;
				String poaId=(String)map.get("id");
				POA poa=new POA(poaId);
				String afid = poa.getArtworkFile(context).getObjectId(context);

				Map newMap = new HashMap(map);
				newMap.put("id", afid);
				newObjectList.add(newMap);

				newParam.put("parentOID", poaId);
			}
			checkMap.put("objectList", newObjectList);
			checkMap.put(BusinessUtil.PARAM_LIST, newParam);
			return BusinessUtil.toStringList((Vector)invokeLocal(context, "emxCommonDocumentUI", null, "getDocumentActions", JPO.packArgs(checkMap), Vector.class));
		}catch(Exception e){ throw new FrameworkException(e);}
		
	}
	
    public boolean isChangeManagementEnabled(Context context, String[] args) throws FrameworkException {
         return POA.isCMEnabled(context);
    }       
     
    public boolean isChangeManagementNotEnabled(Context context, String[] args) throws FrameworkException {
        return !POA.isCMEnabled(context);
    }
      
      /**
       * Pre-Process JPO Method Which will validates the Below Conditions.
       * 	If Selected POA or Its "Artwork File" is Connected to "Change Action" 
       * 		Is Connected "Change Action" is in Complete State.
       * 			In Complete State --> Stopping the Operation with suitable alert.
       * 		else
       * 			Allowing to Connect to the New "Change Action"
       * @param   context
       * @param   args
       * @throws  FrameworkException - when args size is zero.
       * @since   AWL 2015x
       * @author  Raghavendra M J (R2J)
       * Created during "Enterprise Change Management" Highlight. 
       */

      @com.matrixone.apps.framework.ui.PreProcessCallable
      public Map changeManagementObsoletePOAPreProcess(Context context, String[] args) throws FrameworkException
      {
    	  try
    	  { 
    		  Map programMap = (Map) JPO.unpackArgs(args);
    		  Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);

    		  String strTableRowIds = (String) mpRequest.get("rowIds");
    		  StringList rowIdList = FrameworkUtil.split(strTableRowIds, ",");
    		  String objectId = (String) rowIdList.get(0);

    		  // Context POA and its Artwork File should not have active CA connected.
    		  POA poa = new POA(objectId);
    		  
    		  String actionKey = "Action";
    		  String messageKey = "Message";
                  String msg = "";
                  
                  if(!poa.canMoveToObsoleteState(context)) {
                     msg = "emxAWL.Alert.POAObsoleteNotAllowed";
                  }
                  
                  if(BusinessUtil.isNullOrEmpty(msg)) {
                        msg = poa.getActiveChangeAction(context) != null ||
                              poa.getArtworkFile(context).getActiveChangeAction(context) != null ? 
                              "emxAWL.Alert.NonCompleteCAs" : "";
                  }

    		  Map returnMap = new HashMap(2);
    		  if(BusinessUtil.isNullOrEmpty(msg))
    		  {
    		       returnMap.put(actionKey,"Continue");
    		       returnMap.put(messageKey,AWLConstants.EMPTY_STRING);
    		  }
    		  else
    		  {
    		       String strMessage =  AWLPropertyUtil.getI18NString(context,msg);
    		       returnMap.put(actionKey, "Stop");
    		       returnMap.put(messageKey,strMessage);
    		  }
    		  return returnMap;
    	  }catch(Exception e){ throw new FrameworkException(e);}
      }

      /**
       * Access Program to Show the "Change Management" Artwork File Revise Command with Following Checks.
       * 	If Selected "Artwork File" is Connected to "Change Action" 
       * 		Is Connected "Change Action" is in Complete State.
       * 			In Complete State --> Disabling the Command.
       * 		else
       * 			Allowing to Connect to the New "Change Action"
       * @param   context
       * @param   args
       * @throws  FrameworkException - when args size is zero.
       * @since   AWL 2015x
       * @author  Raghavendra M J (R2J)
       * Created during "Enterprise Change Management" Highlight. 
       */

      public boolean showECMArtworkFileReviseCommand(Context context, String[] args) throws FrameworkException
      {
    	  try
    	  {
    		  HashMap programMap = (HashMap) JPO.unpackArgs(args);
			  String objectId = (String) programMap.get(OBJECT_ID);	
			  return POA.isCMEnabled(context) &&
					 new ArtworkFile(objectId).getActiveChangeAction(context) == null;
    	  }	catch(Exception e){ throw new FrameworkException(e);}
      }
      
      
      public Map getPOACreateOptionRangeValues(Context context, String[] args) throws FrameworkException {
          try {
              Map programMap = (Map)JPO.unpackArgs(args);
              Map paramMap   = (Map)programMap.get("paramMap");
              String sLanguage = (String) paramMap.get("languageStr");
              
              StringList values = new StringList(3);
              StringList range = new StringList(3);
              
              values.add("createNew");
              range.add(AWLPropertyUtil.getI18NString(context,"emxAWL.Button.CreateNew", sLanguage));
              
              values.add("useExisting");
              range.add(AWLPropertyUtil.getI18NString(context,"emxAWL.CreatePOA.UseExisting", sLanguage));
              
              HashMap resultMap = new HashMap();
              resultMap.put(AWLConstants.RANGE_FIELD_CHOICES, values);
              resultMap.put(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES, range);
              return resultMap;
              
          } catch (Exception e){ throw new FrameworkException(e);	}
  	}
      
      
      /**
       * Function returns the Artwork Usage Range Values depending on the context language
       * @param   context
       * @param   args -> no values need to be passed
       * @throws  FrameworkException
       * @since   AWL 2015x
       * @author  Pralhad Patil(WX7)
       */
      
    public static Map getArtworkUsageRanges(Context context, String[] args) throws FrameworkException 
  	{
    	  try {
    		  
    		  StringList valueranges = AWLAttribute.ARTWORK_USAGE.getAttrRanges(context);
    		  StringList displayRanges = valueranges;
    		  //StringList displayRanges = AWLPropertyUtil.getAttributeRangeI18N(context, AWLAttribute.ARTWORK_USAGE.get(context), valueranges, context.getLocale().getLanguage());
    		  HashMap resultMap = new HashMap();
    		  resultMap.put(AWLConstants.RANGE_FIELD_CHOICES, valueranges);
    		  resultMap.put(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES, displayRanges);
    		  return resultMap;
              
          } catch (Exception e){ throw new FrameworkException(e);	}
  	} 
    
    /**
     * Function returns the Instance Sequence for artwork Element
     * @param   context
     * @param   args -> no values need to be passed
     * @throws  FrameworkException
     * @since   AWL 2015x
     * @author  N94
     */
    
    public StringList getInstanceSequencefromMaster(Context context, String[] args)throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			MapList objList 	 = BusinessUtil.getObjectList(programMap);
			Map paramMap = BusinessUtil.getRequestParamMap(programMap);
			String poaId = BusinessUtil.getString(paramMap, "parentOID");		
			POA poaObj = new POA(poaId);
			StringList objIds = BusinessUtil.getIdList(objList);
			return getInstanceSequencebyMaster(context, poaObj, objIds);
		}catch(Exception e){ throw new FrameworkException(e); }
	}
	protected StringList getInstanceSequencebyMaster(Context context, POA poaObj, StringList objIds) throws FrameworkException {
		try{
			
			Map<String, StringList> mSequenceInfo = getSequenceInfobyMaster(context, poaObj, objIds, true, false);
			return mSequenceInfo.get(AWLConstants.INSTANCE_SEQ);
			
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}
    
		protected Map<String, StringList> getSequenceInfobyMaster(Context context, POA poaObj, StringList objIds, boolean getInstanceSequence, boolean getSequenceNumber) throws FrameworkException {
		try{
			Map<String, StringList> mMasterSequenceInfo = new HashMap<String, StringList>();
			if(!getInstanceSequence && !getSequenceNumber) {
				mMasterSequenceInfo.put(AWLConstants.INSTANCE_SEQ, new StringList());
				mMasterSequenceInfo.put(AWLConstants.SEQUENCE_NUMBER, new StringList());
				return mMasterSequenceInfo;
			}
			StringList relSelects = new StringList();
			String SEL_INSTANCE_SQUENCE = AWLAttribute.INSTANCE_SEQUENCE.getSel(context);
			String SEL_SQUENCE_NUMBER = AWLAttribute.ARTWORK_ELEMENT_SEQUENCE_ORDER.getSel(context);
			if(getInstanceSequence)
				relSelects.add(SEL_INSTANCE_SQUENCE);
			if(getSequenceNumber)
				relSelects.add(SEL_SQUENCE_NUMBER);
			
			MapList masterCopies = poaObj.getArtworkMasters(context, new StringList(DomainConstants.SELECT_ID), relSelects, AWLConstants.EMPTY_STRING);
			HashMap<String,String> masterInstanceData = new HashMap<String,String>();
			Map<String,String> masterSequenceNumberData = new HashMap<String,String>();
			  for(Map masterInfoMap :(List<Map>)masterCopies)
			  {
				  String masterId=(String)masterInfoMap.get(DomainConstants.SELECT_ID);
				  masterInstanceData.put(masterId, (String) masterInfoMap.get(SEL_INSTANCE_SQUENCE));
				  masterSequenceNumberData.put(masterId, (String) masterInfoMap.get(SEL_SQUENCE_NUMBER));
			  }
			StringList slInstanceSequence = new StringList(objIds.size());
			StringList slSequenceNumber = new StringList(objIds.size());
			StringList masterIds = BusinessUtil.getInfo(context, objIds, AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.id"));
			for(int i=0; i<objIds.size(); i++)
			{
				slInstanceSequence.add(masterInstanceData.get(masterIds.get(i)));				
				slSequenceNumber.add(masterSequenceNumberData.get(masterIds.get(i)));				
			}
			
			mMasterSequenceInfo.put(AWLConstants.INSTANCE_SEQ, slInstanceSequence);
			mMasterSequenceInfo.put(AWLConstants.SEQUENCE_NUMBER, slSequenceNumber);
			
			return mMasterSequenceInfo;
			
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}
    
    /**
	 * Access Expression Program to show either Associated To field should be displayed or not.
	 * Return true if programMap has selectedPOAId with POA id selected.  
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2016x
	 * @author  AA1
	 */
    @com.matrixone.apps.framework.ui.ProgramCallable
	public boolean isAssociationFieldRequired(Context context, String[] args) throws FrameworkException
	{
		try {
			if (args.length == 0 ){
				throw new IllegalArgumentException();
			}
		Map programMap          = (Map)JPO.unpackArgs(args);
		String selectedPOAId = BusinessUtil.getString(programMap, "selectedPOAId");
		return UIUtil.isNotNullAndNotEmpty(selectedPOAId);
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
    
	/**
	 * Returns the default association of newly created Element in POA Product Hirerachy. 
	 * Return Product Marketing name.
	 *
	 * @param   context      - the enovia <code>Context</code> object
	 * @param   args         - String[] - enovia JPO packed arguments
	 * @return  String       - POA Product Name  
	 * @throws  Exception    - if operation fails
	 * @since   AWL 2016x
	 * @author  AA1
	 */
    @com.matrixone.apps.framework.ui.ProgramCallable
	public String getDefaultAssociation(Context context, String[] args) throws FrameworkException
	{
		try
		{
			if (args.length == 0 ){
				throw new IllegalArgumentException();
			}
			Map programMap     = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			String selectedPOAId = (String) mpRequest.get(AWLConstants.SELECTED_POA_ID);
			StringList idList  = new StringList(selectedPOAId);
			String prdName = "";
			if(UIUtil.isNotNullAndNotEmpty(selectedPOAId))
			{
				StringList productIds = getPOAProductIds(context, idList);
				StringList prdList = BusinessUtil.getInfo(context, productIds, AWLAttribute.MARKETING_NAME.getSel(context));
				
				
				if(prdList.size() ==  1)
				{
					prdName= prdList.get(0).toString();
					
				}else
				{
					//Invalid POA connection 
					String errorException =  AWLPropertyUtil.getI18NString(context, "emxAWL.POAWarning.InvalidPoruct");
					throw new FrameworkException(errorException);
				}
			}
			return prdName;
		}catch(Exception ex){ throw new FrameworkException(ex);}
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
	public Map loadDefaultAssociation(Context context, String[] args) throws FrameworkException
	{
		try
		{
			if (args.length == 0 ){
				throw new IllegalArgumentException();
			}
			
			HashMap resultMap = new HashMap();
			Map programMap     = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			List<String> poaIds = FrameworkUtil.split((String) mpRequest.get(AWLConstants.SELECTED_POA_ID), ",");
			if(BusinessUtil.isNotNullOrEmpty(poaIds))
			{
	    		//Get all applicable place of origins
				resultMap.put("SelectedValues", (String) mpRequest.get("hierarchyIds") );
				resultMap.put("SelectedDisplayValues",  (String) mpRequest.get("hierarchyNames"));
			}
			return resultMap;
		}catch(Exception ex){ throw new FrameworkException(ex);}
	}

	/**
	 * Include Program for getting applicable origin for new element form POA context. 
	 * This API is intended to use only if selected POAs has at least one common hierarchy element.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args    holds the following input arguments:
	 *           	  0 -  HashMap containing one String entry for key "selectedPOAId"
	 * @return        a <code>StringList</code> object having the list of Change Templates, Object Id of Change Template objects.
	 * @throws        Exception if the operation fails
	 * @since   AWL 2016x
	 * @author  AA1
	 **
	 */
    @SuppressWarnings({"PMD.AvoidBranchingStatementAsLastInLoop"})
	@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList getHierarchyForNewElement(Context context, String[] args) throws FrameworkException
	{
    	try
    	{
    		StringList returnList = new StringList();
    		if (args.length == 0 )
    		{
    			throw new IllegalArgumentException();
    		}
    		Map programMap     = (Map)JPO.unpackArgs(args);
    		StringList poaIds = FrameworkUtil.split((String) programMap.get(AWLConstants.OBJECT_ID), ",");
    		Map<String,List<String>> poasWithHierarchy =ArtworkMaster.getPOAHierachyData(context, poaIds);
    		//Get nearest place of origin.
    		String firstPrdId =  ArtworkMaster.getNearestCommonPlaceOfOrigin(poasWithHierarchy);
    		Set<String> grpedPOAIds = poasWithHierarchy.keySet();

    		for(String poaId:grpedPOAIds)
    		{	// Take sub list from nearest place of origin till last element because all these ids can act as place of origin.
    			List<String>  prdIds = poasWithHierarchy.get(poaId);
    			int idexOfFirstCommon = prdIds.indexOf(firstPrdId);
    			if(idexOfFirstCommon != -1)
    			{
    				List<String> finalPlaceOfOrigins =  prdIds.subList(idexOfFirstCommon, prdIds.size());
    				return new StringList(finalPlaceOfOrigins.toArray(new String [finalPlaceOfOrigins.size()]));
    			}
    		}
    		return new StringList();
    	}
    	catch(Exception e){
    		throw new FrameworkException(e);
    	}
	}
	
	/**
	 * Returns the Copy List association to the Artwork Element
	 * @param context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return MapList {List of Copy Lists}
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @return {MapList of Copy Lists}
	 * @Since VR2015x.HF4 
	 * Created during 'Copy List Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public StringList getCopyListsForPOAAssembly(Context context, String[] args) throws FrameworkException
	{
		StringList returnList = new StringList();
		try
		{
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map requestParamMap = BusinessUtil.getRequestParamMap(programMap);

			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(requestParamMap, "exportFormat"));

			String toolTipText =  AWLPropertyUtil.getI18NString(context, "emxAWL.TableHeader.CopyLists");
			String poaId = (String) requestParamMap.get(OBJECT_ID);
			
			// Getting all the Artwork Elements in the Assembly.
			MapList assemblyElementsList = BusinessUtil.getObjectList(programMap);
			StringList assemblyElementsIds = BusinessUtil.getIdList(assemblyElementsList);

			String SEL_IS_INLINE = AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.", AWLAttribute.INLINE_TRANSLATION.getSel(context));
			StringList selInlineVal = BusinessUtil.getInfo(context, assemblyElementsIds, SEL_IS_INLINE);
			
			StringList nameSelect = new StringList();
			nameSelect.add(SELECT_NAME);
			// Getting the Copy Lists connected to POA.
			MapList poaCopyLists =  new POA(poaId).getCopyLists(context, nameSelect, EMPTY_STRING);
			StringList poaCopyListIds = BusinessUtil.getIdList(poaCopyLists);
			
			// get all the copy list for all the artwork element in single db hit.
			String SEL_COPYLIST_ID = AWLUtil.strcat("to[", AWLRel.ARTWORK_ASSEMBLY.get(context),"].from.id");
			MapList assemblyList = BusinessUtil.getInfoList(context, assemblyElementsIds, SEL_COPYLIST_ID);
			
			// Getting all the Copy Lists of POA and Artwork Content 
			Map allCopyListsMap = BusinessUtil.toMapById(poaCopyLists);
			for (int i = 0; i < assemblyElementsIds.size(); i++)
			{
				String id = (String) assemblyElementsIds.get(i);
				boolean isInline = AWLConstants.RANGE_YES.equalsIgnoreCase((String) selInlineVal.get(i));
				StringList clIDs = null;
				if(isInline)
				{
					//For inline elements need to get copy list from Base element. 
					MapList copyLists = new CopyElement(id).getCopyLists(context, EMPTY_STRINGLIST, EMPTY_STRING, true);
					clIDs = BusinessUtil.getIdList(copyLists);
				} else
				{
					Map aeMap = (Map) assemblyList.get(i);
					clIDs = (StringList) aeMap.get(SEL_COPYLIST_ID);
				}
				
				if(BusinessUtil.isNotNullOrEmpty(clIDs))
				{
					
					StringList copyListNames = extractCopyListNames(allCopyListsMap,poaCopyListIds, clIDs);
				
					String[] javaScriptMethodArgsArray = {poaId, AWLRel.POA_COPY_LIST.toString(), AWLType.COPY_LIST.toString(), "false" , "true", "emxAWL.FormHeader.CopyLists"};
					returnList.add(generateHTMLForMoreObjects(context, copyListNames, true, toolTipText, isExporting, "showAssociatedObjects", javaScriptMethodArgsArray));
				}
				else
				{
					//On No association of Copy Lists Adding the empty string entry.
					returnList.add(EMPTY_STRING);
				}
			}
			return returnList;

		} catch(Exception e){ throw new FrameworkException(e);}
	}
	
	/**
	 * Method returns the names of the connected Copylist objects.
	 * @param allCopyListsMap
	 * @param clIDs
	 * @param poaCopyListIds 
	 * @return
	 */
	private StringList extractCopyListNames(Map allCopyListsMap,
			StringList clIDs, StringList poaCopyListIds)
	{
		List<String> commonCopyListsIds = new StringList();
		commonCopyListsIds.addAll(poaCopyListIds);
		commonCopyListsIds.retainAll(clIDs);
		StringList copyListNames = new StringList();
		
		for (String copyListId : commonCopyListsIds)
		{
				Map copyListMap = (Map) allCopyListsMap.get(copyListId);
				String copyListName = (String) copyListMap.get(SELECT_NAME);
				copyListNames.add(copyListName);
		}
		Collections.sort(copyListNames);
		return copyListNames;
	}

	
	/**
	 * To get the Copy Lists associated to the POA. 
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public static MapList getCopyLists(Context context, String args[]) throws FrameworkException {
		try{
			Map programMap = (HashMap) JPO.unpackArgs(args);
			String poaId = (String) programMap.get(AWLConstants.OBJECT_ID);
			POA poa = new POA(poaId);
			MapList copyListData = poa.getCopyLists(context, new StringList(DomainConstants.SELECT_ID), 
					EMPTY_STRING);
			return copyListData;
		} catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Returns the Object Ids to be Excluded from the Search Page
	 * @param context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return StringList of {List of Copy Lists}
	 * @throws FrameworkException
	 * @author WX7 (Pralhad Patil)
	 * @return {StringList of Object Ids to be Excluded from the Search Page}
	 * @Since VR2015x.HF4 
	 * Created during 'Copy List Highlight'
	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList getToBeExcludedPOAIds(Context context, String [] args) throws FrameworkException
	{
		try
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			String poaIdsInUI = (String) programMap.get("poaIdsInUI");
			StringList toBeExcludeIds = FrameworkUtil.split(poaIdsInUI, ",");
			return  toBeExcludeIds;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 * Returns the Object Ids to be Excluded from the Search Page
	 * @param context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return StringList of {List of Copy Lists}
	 * @throws FrameworkException
	 * @author WX6 (Shivaraj Patil)
	 * @return {StringList of Object Ids to be Excluded from the Search Page}
	 * @Since VR2017x.HF2 
	 * Created as a fix for IR-46787
	 */
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList getToBeExcludedPOAAssociatedPartIds(Context context, String [] args) throws FrameworkException
	{
		try
		{
			Map paramMap = (Map) JPO.unpackArgs(args);
			String poaId = (String) paramMap.get(OBJECT_ID);
			POA poaObject = new POA(poaId);
			MapList mapList = poaObject.getPackagingParts(context);
			return  BusinessUtil.getIdList(mapList);
		} catch (Exception e)
		{
			throw new FrameworkException(e); 
		}
	}
	
	/**
	 * Gets the First Level POAs
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF4
	 * Created during 'POA Simplification Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAViewPOAs(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			String filter = (String) programMap.get("AWLProductRevisionFilter");
			AWLType typeArray[] = {AWLType.PRODUCT_LINE, AWLType.MODEL, AWLType.CPG_PRODUCT, AWLType.POA};
			StringBuilder strObjectWhere = new StringBuilder();
			strObjectWhere.append("from[").append(AWLRel.DERIVED.get(context)).append("] == False");
			if("Released".equalsIgnoreCase(filter)){
				strObjectWhere.append(" && "+ AWLConstants.CURRENT+"=="+AWLState.RELEASE.get(context, AWLPolicy.POA.get(context)));
			}else if("Obsolete".equalsIgnoreCase(filter)){
				strObjectWhere.append(" && "+ AWLConstants.CURRENT+"=="+AWLState.OBSOLETE.get(context, AWLPolicy.POA.get(context)));
			}else if("In Work".equalsIgnoreCase(filter)){
				strObjectWhere.append(" && "+ AWLConstants.CURRENT+"!="+AWLState.OBSOLETE.get(context, AWLPolicy.POA.get(context))+ " && "+ AWLConstants.CURRENT+"!="+AWLState.RELEASE.get(context, AWLPolicy.POA.get(context)) );
					}
			AWLRel relArray[] = {AWLRel.PRODUCT_LINE_MODELS, AWLRel.SUB_PRODUCT_LINES, AWLRel.MAIN_PRODUCT, AWLRel.PRODUCTS, AWLRel.ASSOCIATED_POA};

			MapList hierarchyMapList = AWLUtil.getHierarchyInfoList(context, objectId, true, true, true);

			MapList hierarchyInfo = new MapList();

			for (Map hierarchyMap : (List<Map>) hierarchyMapList) {

				String hierarchyId  = (String) hierarchyMap.get(SELECT_ID);
				String objectType = (String) hierarchyMap.get(SELECT_TYPE);

				AWLObject currentObject = objectType.equalsIgnoreCase(AWLType.CPG_PRODUCT.get(context)) ? new CPGProduct(hierarchyId) :  new Brand(hierarchyId) ;
				hierarchyInfo.addAll(currentObject.related(typeArray, relArray).level(1).select(AWLType.POA).where(strObjectWhere.toString()).query(context));
			}

			return correctLevelInfo(context, hierarchyInfo, "1");

		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Expands the POAs to Next Possible Levels
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF4
	 * Created during 'POA Simplification Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAViewExpandedPOA(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			
			// Querying till One level.
			MapList poaList = new POA(objectId).related(AWLUtil.toArray( AWLType.POA), AWLUtil.toArray(AWLRel.DERIVED))
						.id().type().from().state().select(AWLUtil.toArray(AWLType.POA)).level(0).query(context);
			
			return correctLevelInfo(context, poaList, "2");
			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * To Correct the Level Information for the Selected Hierarchy
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  toSequenceMap - List of Map Values for Level Correction
	 * @return MapList	List of Corrected Map Values.
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF4
	 * Created during 'POA Simplification Highlight'
	 */
	private MapList correctLevelInfo(Context context, List<Map> toSequenceMap, String requiredLevel)
	{
		MapList returnMapList = new MapList();
		for (Map currentMap : toSequenceMap) 
		{
			currentMap.put(SELECT_LEVEL, requiredLevel);
			returnMapList.add(currentMap);
		}
		return returnMapList;
	}
	
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList getExcludePOAsForComprised(Context context, String [] args) throws FrameworkException
	{
		try
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			String selectedPOAIds = (String) programMap.get("selectedPOAIds");
			StringList selectedPOAIdList = FrameworkUtil.split(selectedPOAIds, ",");
			String comprisedPOASelect = AWLUtil.strcat("from[", AWLRel.COMPRISED_OF_ARTWORK.get(context), "].to.id");
			StringList poaSelects = new StringList();			
			poaSelects.add(comprisedPOASelect);
			MapList comprisedPOAMapList = BusinessUtil.getInfoList(context, selectedPOAIdList, poaSelects);
			StringList existingConnectedPOAs = new StringList();
			int index=0;
			for(Map poaRecordMap: (List<Map>)comprisedPOAMapList){
				StringList poaList = (StringList)poaRecordMap.get(comprisedPOASelect);
				if(BusinessUtil.isNullOrEmpty(poaList)){
					existingConnectedPOAs = new StringList();
					break;
				}
					if(index == 0 ){
						existingConnectedPOAs.addAll(poaList);
					}else
					{
						StringList list = new StringList();
				        for (String commonPOAId :(List<String>) existingConnectedPOAs) {
				            if(poaList.contains(commonPOAId)) {
				                list.add(commonPOAId);
				            }
				        }
				        existingConnectedPOAs = list;
					}
				index++;
 			}
			return  existingConnectedPOAs;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 * Returns the POAs connected to Customized POAs
	 * @param context the eMatrix <code>Context</code> object
	 * @param args - String[] - Enovia JPO packed arguments
	 * @return StringList {List of POANames}
	 * @throws FrameworkException
	 * @author ukh1 (Utkarsh)
	 * @Since VR2015x.HF5
	 */
	public StringList getConnectedPOAsForUI(Context context, String[] args) throws FrameworkException 
	{
		try 
		{
			Map programMap = (Map) JPO.unpackArgs(args);
			StringList poaIdList = BusinessUtil.getIdList(BusinessUtil.getObjectList(programMap));
			String toolTipText = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.POAs");
			StringList allPOANamesHTML = new StringList(poaIdList.size());
			StringList connectedPOANames = DomainConstants.EMPTY_STRINGLIST;
			AWLRel comprisedOfArtwork = AWLRel.COMPRISED_OF_ARTWORK;

			String customization =  AWLPropertyUtil.getI18NString(context,"emxAWL.Table.MarketingCustomizationPOA");
			String standardPOAMsg =  AWLPropertyUtil.getI18NString(context,"emxAWL.Table.StandardPOA");

			Map requestParamMap = BusinessUtil.getRequestParamMap(programMap);
			boolean isExporting =  BusinessUtil.isNotNullOrEmpty(BusinessUtil.getString(requestParamMap, "exportFormat"));

			for (String poaId : (List<String>) poaIdList) 
			{
				POA poaObj = new POA(poaId);
				//For Standard POAs Value Standard is displayed
				if(poaObj.getAttributeValue(context, AWLAttribute.ARTWORK_BASIS.get(context)).equalsIgnoreCase(AWLConstants.RANGE_POABASIS_STANDARD)){
					allPOANamesHTML.add(standardPOAMsg);
					continue;
				}
				MapList connectedPOAIds = poaObj.related(AWLType.POA, comprisedOfArtwork).to().level(1).query(context);
				connectedPOANames = BusinessUtil.toStringList(connectedPOAIds,DomainConstants.SELECT_NAME);

				//If no POAs are connected then value customization is to be displayed
				if (connectedPOANames.size() == 0) {
					allPOANamesHTML.add(customization);
					continue;
				}

				String[] javaScriptMethodArgsArray = {poaId, comprisedOfArtwork.toString(), AWLType.POA.toString(), "false" , "true", toolTipText};
				allPOANamesHTML.add(generateHTMLForMoreObjects(context, connectedPOANames, true, toolTipText, isExporting, "showAssociatedObjects", javaScriptMethodArgsArray));
			}
			return allPOANamesHTML;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	/**
	 * Gets the Comprised Artworks.
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return MapList	List of Column Map Values of the POA Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF4
	 * Created during 'Customization Kit Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getComprisedArtworks(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			CustomizationPOA customizationPOA = new CustomizationPOA(objectId);
			StringList objectSelects =  BusinessUtil.toStringList(SELECT_ID, SELECT_NAME, DomainRelationship.SELECT_ID, SELECT_TYPE);
			return customizationPOA.getComprisedPOAs(context, objectSelects);

		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Access Expression for Portal Command -- Comprised Artworks  
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return boolea true or False based on Artwork Basis attribute value.
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF4
	 * Created during 'Customization Kit Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public boolean isCustomizationArtwork(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			POA poa = new POA(objectId);
			String artworkBasis = poa.getAttributeValue(context, AWLAttribute.ARTWORK_BASIS.get(context));
			if(BusinessUtil.isNotNullOrEmpty(artworkBasis) && artworkBasis.equalsIgnoreCase(AWLConstants.RANGE_POABASIS_MARKETING_CUSTOMIZATION))
				return true;
			else
				return false;

		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Verify is it standard POA or Custmization POA  
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return boolea true or False if POA is standard POA
	 * @throws FrameworkException
	 * @author AA1 
	 * @Since VR2015x.HF5
	 * Created during 'Customization Kit Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public boolean isStandardArtwork(Context context, String[] args) throws FrameworkException
	{
		return !isCustomizationArtwork(context, args);
	}
	
	/**
	 * Checks for Command Access to Checkin.  
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return boolean true or False based on checkin access.
	 * @throws FrameworkException
	 * @author Raghavendra M J (R2J) 
	 * @Since VR2015x.HF10
	 * Created during 'Customization Kit Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public boolean hasCheckinAccessToUploadArtworkFile(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			/*We are modifying the context object Id of the table to Artwork File Id, 
			So considering directly Artwork File Id*/ 
			return Access.hasAccess(context, objectId, "checkin");
			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * Checks for Command Access to Checkin.  
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return boolean true or False based on checkin access.
	 * @throws FrameworkException
	 * @author Raghavendra M J (R2J) 
	 * @Since VR2015x.HF10
	 * Created during 'Customization Kit Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public boolean hasPOAEditAccess(Context context, String[] args) throws FrameworkException
	{
		try{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			String currentState = new POA(objectId).getInfo(context, SELECT_CURRENT);
			String POA_DRAFT_STATE = AWLState.DRAFT.get(context, AWLPolicy.POA);
			return Access.hasAccess(context, objectId, "modify") &&  POA_DRAFT_STATE.equals(currentState);
			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * To Get the Names of the Countries/Languages associated to the POA
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return - List of Country/Language Names
	 * @throws FrameworkException
	 * @since AWL V62015x.HF4
	 * @author UKH1 (Utkarsh)
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public String getLanguagesOrCountryNames(Context context, String args[]) throws FrameworkException 
	{
		try 
		{
			Map programMap = JPO.unpackArgs(args);
			Map fieldMap = BusinessUtil.getMap(programMap , "fieldMap");
			String poaId = BusinessUtil.getString(BusinessUtil.getRequestMap(programMap), AWLConstants.OBJECT_ID);
			String fieldName = BusinessUtil.getString(fieldMap, SELECT_NAME);
			POA poa = new POA(poaId);
			StringList returnList = "Countries".equalsIgnoreCase(fieldName) ? poa.getCountryNames(context) :
			                        "Languages".equalsIgnoreCase(fieldName) ? poa.getLanguageNames(context) :
									"LocalCopyLanguages".equalsIgnoreCase(fieldName) ? poa.getLanguageNamesFromContent(context, false) : new StringList();
			return FrameworkUtil.join(returnList, ", ");
		}
		catch(Exception e) { throw new FrameworkException(e); }
	}

	
	/**
	 * Gets the connected POAs to Next Possible Levels
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @author R2J (Raghavendra M J)
	 * @Since VR2015x.HF6
	 * Created during 'Customization Kit Highlight'
	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPOAEvolutions(Context context, String[] args) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			String objectId = (String) programMap.get(OBJECT_ID);
			
			//from[Derived].to.name
			String SEL_DERIVED = AWLUtil.strcat("to[", AWLRel.DERIVED.get(context), "].from.name");

			MapList outputList = new MapList();
			
			MapList fromPOAList = new POA(objectId).related(AWLType.POA, AWLRel.DERIVED).from().level(0).sel(SEL_DERIVED).query(context);
			MapList toPOAList = new POA(objectId).related(AWLType.POA, AWLRel.DERIVED).level(0).sel(SEL_DERIVED).query(context);
			Map poaInfo = BusinessUtil.getInfo(context, objectId, BusinessUtil.toStringList(SELECT_ID, SEL_DERIVED));
			
			int level = 0;
			for (int i = fromPOAList.size() - 1; i >=0 ; i--) {
				Map map = new HashMap(3);
				Map object = (Map) fromPOAList.get(i);
				map.put(SELECT_ID, object.get(SELECT_ID));
				map.put("clevel", Integer.toString(level++));
				map.put(SEL_DERIVED, object.get(SEL_DERIVED));
				outputList.add(map);
			}
			
			Map map = new HashMap(4);
			map.put(SELECT_ID, objectId);
			map.put("clevel", Integer.toString(level++));
			map.put(SEL_DERIVED, poaInfo.get(SEL_DERIVED));
			map.put("styleRows", "ResourcePlanningGreenBackGroundColor");
			outputList.add(map);
			
			for (int i = 0; i < toPOAList.size() ; i++) {
				map = new HashMap(3);
				Map object = (Map) toPOAList.get(i);
				map.put(SELECT_ID, object.get(SELECT_ID));
				map.put("clevel", Integer.toString(level + Integer.parseInt((String) object.get("level"))));
				map.put(SEL_DERIVED, object.get(SEL_DERIVED));
				outputList.add(map);
			}
			
			outputList.sort("level", "ascending", "integer");
			
			return outputList;
		} catch (Exception e){ throw new FrameworkException(e);	}
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
	public StringList getComprisedPOAForPOAAssembly(Context context, String[] args) throws FrameworkException
	{
		try 
		{
			StringList returnList = new StringList();
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map requestParamMap = BusinessUtil.getRequestParamMap(programMap);

			MapList assemblyElementsList = BusinessUtil.getObjectList(programMap);
			StringList relDList = BusinessUtil.toStringList(assemblyElementsList, DomainRelationship.SELECT_ID);
			String SEL_COMPRISED_POA = AWLUtil.strcat("tomid[",AWLRel.COMPRISED_ARTWORK_ASSEMBLY.get(context),"].fromrel.to.name");

			MapList artworkAssemblyInfo = BusinessUtil.getRelInfoList(context, relDList, SEL_COMPRISED_POA);

			for (Map artworkElementMap : (List<Map>)artworkAssemblyInfo) 
			{
				StringList connectedPOAsNames = BusinessUtil.getStringList(artworkElementMap, SEL_COMPRISED_POA);
				if(BusinessUtil.isNotNullOrEmpty(connectedPOAsNames))
					connectedPOAsNames= BusinessUtil.toUniqueSortedList(connectedPOAsNames);
				String val = BusinessUtil.isNullOrEmpty(connectedPOAsNames) ? "" :
					FrameworkUtil.join(connectedPOAsNames, ", ");  
				returnList.add(val);
			}			
			return returnList;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	/**
	 * @deprecated
	 */
	
	public boolean isAIDocumentCheckedIn(Context context, POA poaObject) throws FrameworkException {
		try {
			
			//Even though Access Expression is false, it tries to execute Access Function, Hence we need to add check here.
			if(!poaObject.isKindOf(context, AWLType.POA))
				return false;
			
			ArtworkFile artworkFileObject = poaObject.getArtworkFile(context);
			FileList fileList;

			fileList = artworkFileObject.getFiles(context);

			FileList aiFileList = new FileList();
			for(int i = 0; i < fileList.size();i++) {
				File fileObject =(File) fileList.get(i);
				String fileName = fileObject.getName();
				String fileFormat = fileName.substring(fileName.lastIndexOf(".")+1);
				if(FORMAT_AI.equalsIgnoreCase(fileFormat)) {
					aiFileList.add(fileObject);
					break;
				}
			}
			return aiFileList.size() > 0 ? true : false;
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}	
	
	
	
	/**
	 * Helper API to get required selectables
	 * @param context
	 * @return
	 * @throws FrameworkException
	 */
	private Map<String,String> getSelectables(Context context){
		 Map<String,String> selectables = new HashMap<String, String>();
		 selectables.put(AWLConstants.COPY_TEXT, "attribute["+  AWLAttribute.COPY_TEXT.get( context ) +"_RTE]");
		 selectables.put(AWLConstants.LANGUAGE_SEL,  AWLAttribute.COPY_TEXT_LANGUAGE.getSel(context));
		 selectables.put(AWLConstants.GS1KEY_SEL,  "type.property[GS1KEY].value");
		 selectables.put(AWLConstants.IS_GRAPHIC,  AWLUtil.strcat("type.kindof[" , AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context) , "]"));
		 selectables.put(AWLConstants.LANG_ISO_SEL,  AWLUtil.strcat("from[", AWLRel.CONTENT_LANGUAGE.get(context),"].to.attribute[",AWLAttribute.ISO_CODE.get(context),"]"));
		 return selectables;
	}
	
	/**
	 * Gather information for POA from system. From POA :: 1) type 2)Name 3)Ins Sequence 4)Language 5)Content 9)State 10)Rev 11)Is mandatory
	 * @param context
	 * @param poaObject
	 * @param langISOWithSeq
	 * @param selectable
	 * @return map of Key as GS1Key+INSTANCE SEQ+LOCALE SEQ and Value as Map of other informatino.
	 * @throws FrameworkException
	 * @throws IOException
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private Map<String,Map> processPOAAssemblyData(Context context,POA poaObject,Map<String, String> langISOWithSeq,Map<String,String> selectable)throws FrameworkException, IOException{
		
		try{
			final String INLINECOPY_LOCALSEQUENCE = AWLPropertyUtil.getInlineElementLocaleSequence(context);
			final String NO_TRANSLATE_LOCALSEQUENCE = AWLPropertyUtil.getNoTranslateElementLocaleSequence(context);
			final String GRAPHIC_LOCALSEQUENCE = AWLPropertyUtil.getGraphicElementLocaleSequence(context);
			String IS_GRAPHIC = AWLUtil.strcat("type.kindof[" , AWLType.ARTWORK_GRAPHIC_ELEMENT.get(context) , "]");
			String IS_STRUCTURE = AWLUtil.strcat("to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.",AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context));
			String MASTER_ID = AWLUtil.strcat("to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.id");
			StringList selectList = new StringList();
			// From POA     :: 1) type 2)Name 3)Ins Sequence 4)Language 5)Content 9)State 10)Rev 11)Is mandatory
			selectList.add(MASTER_ID);
			selectList.add(AWLConstants.REV);
			selectList.add(SELECT_TYPE);
			selectList.add(SELECT_ID);
			selectList.add(SELECT_NAME);
			selectList.add(AWLConstants.CURRENT);
			selectList.add(SELECT_REVISION);
			selectList.add(AWLConstants.LAST);
			selectable.put(AWLConstants.IS_INLINE, AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from." ,AWLAttribute.INLINE_TRANSLATION.getSel(context)));
			selectable.put(AWLConstants.TRANSLATE, AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from." ,AWLAttribute.TRANSLATE.getSel(context)));
			selectable.put("isStructure", IS_STRUCTURE);
			selectList.addAll(selectable.values());
			selectable.put(AWLConstants.IS_MANDATORY,AWLAttribute.IS_MANDATORY.getSel(context));
			
			MapList poaAssemblyElements = poaObject.related(AWLType.ARTWORK_ELEMENT, AWLRel.ARTWORK_ASSEMBLY).relid().sel(selectList).sel("level").relSel(AWLAttribute.IS_MANDATORY.getSel(context)).query(context);
			
			Map<String, MapList> elementsByMaster = BusinessUtil.groupByKey(poaAssemblyElements, MASTER_ID);
			
			//Get master ids
			StringList masterids = elementsByMaster.keySet().stream().collect(Collectors.toCollection(StringList::new));
			MapList mlMasterInfo = BusinessUtil.getInfo(context, StringList.asList(masterids), BusinessUtil.toStringList(SELECT_ID, SELECT_REVISION, AWLConstants.LAST));
			Map<String, Map> masterInfoById = ((List<Map>)mlMasterInfo).stream().collect(Collectors.toMap(masterInfo -> {
				return (String)masterInfo.get(SELECT_ID);
			}, masterInfo -> masterInfo));
			
			StringList objList = BusinessUtil.toStringList(poaAssemblyElements, SELECT_ID);
			Map<String, StringList> mMasterSequenceInfo = getSequenceInfobyMaster(context, poaObject,objList, true, true);
			StringList instanceSequenceList = mMasterSequenceInfo.get(AWLConstants.INSTANCE_SEQ);
			StringList sequenceNumberList = mMasterSequenceInfo.get(AWLConstants.SEQUENCE_NUMBER);
			
			//Get Assembly have map with Key GS1_INSTSEQ_LOCAL_SEQ
			Map<String,Map> poaDataMap = new HashMap<String,Map>();
			String langISOSelect= selectable.get(AWLConstants.LANG_ISO_SEL);
			String isInlineSelect= selectable.get(AWLConstants.IS_INLINE);
			String isTranslateKey= selectable.get(AWLConstants.TRANSLATE);
			
			String mcFlagTooltip = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.NewMC");
			String lcFlagTooltip = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.NewLC");
			String HIGHER_REVISION_ICON = "<img src=\"../common/images/I_A-newer-revision-exists.png\" border=\"0\" align=\"middle\"></img>";
			
			for(int elementIndex = 0; elementIndex < poaAssemblyElements.size(); elementIndex++){
				
				String localeSequence=INLINECOPY_LOCALSEQUENCE;
				Map objectMap = (Map)poaAssemblyElements.get(elementIndex);
				String masterId = (String) objectMap.get(MASTER_ID);
				
				//MC Latest Revision Check -- Start
				Map masterInfo = masterInfoById.get(masterId);
				String mcCurrentRev = (String)masterInfo.get(SELECT_REVISION);
    			String mcLatestRev = (String)masterInfo.get(AWLConstants.LAST);
    			boolean isLatestMCRevisionExist = !mcCurrentRev.equals(mcLatestRev);
    			String mcTooltip = AWLUtil.strcat(mcFlagTooltip, " ", mcLatestRev);
    			String mcFlag = isLatestMCRevisionExist? AWLUtil.strcat("<a HREF=\"#\" TITLE=\"", mcTooltip, "\">", HIGHER_REVISION_ICON, "</a>"): " ";
    			objectMap.put("MCFlag", mcFlag);
    			objectMap.put("MCRev", mcCurrentRev);
    			//MC Latest Revision Check -- End
    			
    			//LC Latest Revision Check -- Start
				String lcCurrentRev = (String)objectMap.get(SELECT_REVISION);
    			String lcLatestRev = (String)objectMap.get(AWLConstants.LAST);
    			boolean isLatestLCRevisionExist = !lcCurrentRev.equals(lcLatestRev);
    			String lcTooltip = AWLUtil.strcat(lcFlagTooltip, " ", lcLatestRev);
    			String lcFlag = isLatestLCRevisionExist? AWLUtil.strcat("<a HREF=\"#\" TITLE=\"", lcTooltip, "\">", HIGHER_REVISION_ICON, "</a>"): " ";
    			objectMap.put("LCFlag", lcFlag);
    			objectMap.put("LCRev", lcCurrentRev);
    			//LC Latest Revision Check -- End
				
				boolean isGraphiElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) objectMap.get(IS_GRAPHIC)) ;
				boolean isStructure = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) objectMap.get(IS_STRUCTURE)) ;
				
				//Instance Sequence logic
				String insSeq = (String)instanceSequenceList.get(elementIndex);
				objectMap.put(AWLConstants.INSTANCE_SEQ, insSeq);
				objectMap.put(AWLConstants.GS1_KEY, (String)objectMap.get("type.property[GS1KEY].value"));
				
				//Sequence logic
				String sSequenceNumber = (String)sequenceNumberList.get(elementIndex);
				objectMap.put(AWLConstants.SEQUENCE_NUMBER, sSequenceNumber);
				
				Object langISO=objectMap.get(langISOSelect);
				String isInline=(String)objectMap.get(isInlineSelect);
				String isTranslate=(String)objectMap.get(isTranslateKey);
				objectMap.put(AWLConstants.TRANSLATE, isTranslate);
				//consider local sequence only if its copy element which is not inline element
				if(langISO !=null && langISO instanceof String && langISO.toString().length() > 0 && langISO.toString().indexOf(',') == -1 && AWLConstants.RANGE_NO.equalsIgnoreCase(isInline) && AWLConstants.RANGE_YES.equalsIgnoreCase(isTranslate))
					localeSequence = (String)langISOWithSeq.get(langISO.toString());
				
				localeSequence = isGraphiElement ? GRAPHIC_LOCALSEQUENCE : 
								AWLConstants.RANGE_NO.equalsIgnoreCase(isTranslate) ? NO_TRANSLATE_LOCALSEQUENCE : localeSequence;
				objectMap.put(AWLConstants.LOCAL_SEQ_NODE, localeSequence);
				
				String key = null;
				
				if(isStructure) {
				//TODO Remove, no need of  local seq --> 
					key= AWLUtil.strcat(objectMap.get(selectable.get(AWLConstants.GS1KEY_SEL)), AWLConstants.SEPARATOR_UDERSCORE,insSeq);
					poaDataMap.put(key, objectMap);
					objectMap.put("isStructure", AWLConstants.RANGE_TRUE);
					
					String copyId = (String) objectMap.get(SELECT_ID);
					
					ArtworkMaster artworkMaster = new ArtworkMaster((String) masterId);
					MapList structureCopyList = poaObject.getStructureCopyAssembly(context, artworkMaster, elementsByMaster.get(masterId), selectList);
					
					Map<String, Map> structureMap = new HashMap<String, Map>();
					for (Map object : (List<Map>)structureCopyList) {
						localeSequence=INLINECOPY_LOCALSEQUENCE;
						langISO=object.get(langISOSelect);
						isInline=(String)object.get(isInlineSelect);
						isTranslate=(String)object.get(isTranslateKey);
						//consider local sequence only if its copy element which is not inline element
						if(langISO !=null && langISO instanceof String && langISO.toString().length() > 0 && langISO.toString().indexOf(',') == -1 && AWLConstants.RANGE_NO.equalsIgnoreCase(isInline) && AWLConstants.RANGE_YES.equalsIgnoreCase(isTranslate))
							localeSequence = (String)langISOWithSeq.get(langISO.toString());
						
						localeSequence = AWLConstants.RANGE_NO.equalsIgnoreCase(isTranslate) ? NO_TRANSLATE_LOCALSEQUENCE : localeSequence;
						String strLocalType = (String) object.get(SELECT_TYPE);
						
						boolean isNutrientType = (boolean) object.get("isNutrientType");
						boolean isVitaminType = (boolean) object.get("isVitaminType");

						String gs1Key = (String) object.get(AWLConstants.GS1_KEY);
						String structuredAttribute = (String) object.get("structuredAttribute");

						String gs1Type = EMPTY_STRING;
						if(isNutrientType || isVitaminType)
							gs1Type = NutritionFactsConfiguration.getNutriFactConfigByNutrientCode(context, structuredAttribute).getLabel(context, true);
						else
						{
							gs1Type = BusinessUtil.isNullOrEmpty(strLocalType) ? GS1TenantCacheUtil.getArtworkElementType(context, gs1Key) : strLocalType;
							gs1Type = AWLPropertyUtil.getTypeI18NString(context, gs1Type, false);
						}
							
						
						if(BusinessUtil.isNullOrEmpty(gs1Key))
							continue;

						object.put(AWLConstants.GS1_KEY, gs1Key);
						object.put("MCFlag", "");
						object.put("MCRev", "");
						object.put("LCFlag", "");
						object.put("LCRev", "");
						object.put(SELECT_TYPE, gs1Type);
						object.put(AWLConstants.INSTANCE_SEQ, insSeq);
						object.put(AWLConstants.LOCALE_SEQUENCE, localeSequence);
						key= AWLUtil.strcat(gs1Key, AWLConstants.SEPARATOR_UDERSCORE,insSeq, AWLConstants.SEPARATOR_UDERSCORE,localeSequence);
						object.put(selectable.get(AWLConstants.IS_MANDATORY), objectMap.get(selectable.get(AWLConstants.IS_MANDATORY)));
						structureMap.put(key, object);
					}
					objectMap.put("structureInfo", structureMap);
				} else {
					key= AWLUtil.strcat(objectMap.get(selectable.get(AWLConstants.GS1KEY_SEL)), AWLConstants.SEPARATOR_UDERSCORE,insSeq, AWLConstants.SEPARATOR_UDERSCORE,localeSequence);
					poaDataMap.put(key, objectMap);
				}
			}
		
			return poaDataMap;
			
		}catch(Exception e){
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Gets the Roundtrip Assembly Elements
	 * @param  context the eMatrix <code>Context</code> object
	 * @param  args - String[] - Enovia JPO packed arguments
	 * @return MapList	List of Column Map Values of the Expanded Objects
	 * @throws FrameworkException
	 * @Since VR2015x.HF10
	 * Created during 'Roundtrip Sync Highlight'
	 */
	private MapList getArtworkResponseRoundTripFilterAssembly(Context context, String[] args, String filter) throws FrameworkException 
	{
		try 
		{
			Map paramMap = (Map) JPO.unpackArgs(args);
			String poaId = (String) paramMap.get(OBJECT_ID);
			POA poaObject = new POA(poaId);

			MapList assemblyElementsList = new MapList();
			//icons for compare matches
			Map<String,String> icons = AWLUIUtil.getRoundtripCompareFlag(context);
			//Get XML file from POA and Parse XML file create MAP with key like GS1_INSTSEQ_LOCAL_SEQ-->Content
			ArtworkFile artworkFile = poaObject.getArtworkFile(context);

			//checks if roundtrip is not present.
			GS1Assembly roundtrip  = artworkFile.getGS1Assembly(context);
			if(roundtrip ==null) {
				return assemblyElementsList;
			}
			List<GS1ArtworkContent> roundtripContentList= roundtrip.getArtworkContent();
			Map<String,GS1ArtworkContent> roundtripDataMap = GS1Util.getUniqueKeyMap(context,roundtripContentList);

			Map<String,String> selectable=getSelectables(context);
			Map<String, String> langISOWithSeq = poaObject.getPOALocaleElement(context, null, true);
			StringList langsFromPOA = poaObject.getLanguageNamesFromContent(context, true);
			Map<String,Map> poaDataMap = processPOAAssemblyData(context,poaObject, langISOWithSeq,selectable);

			//Use tree map so that it will be sorted accordingly. Take keys from both maps add in TreeSet so that data will be fetched by sorting type.
			Set<String> uniqueTableRows = new TreeSet<String>();
			uniqueTableRows.addAll(roundtripDataMap.keySet());
			uniqueTableRows.addAll(poaDataMap.keySet());
			for(String unqiueKey: uniqueTableRows)
			{
				GS1ArtworkContent responseData = roundtripDataMap.get(unqiueKey);
				Map poaElementData = poaDataMap.get(unqiueKey);
				Map rowMap = processEachArtworkElement(context, poaElementData, responseData, selectable, langsFromPOA);

				Map eachRowMap = (Map) rowMap;
				Map checkBoxMap = (Map) eachRowMap.get(SELECT_ID);
				
				eachRowMap.put(SELECT_ID, XSSUtil.encodeForURL(context, new com.matrixone.apps.cpd.util.JsonHelper().getJsonString(checkBoxMap)));
				String responseContentFlag = (String)eachRowMap.get(AWLConstants.ROUNDTRIP_CMP_FLAG);
				String responseContentFlagIcon = icons.get(responseContentFlag);
				
				eachRowMap.put(AWLConstants.ROUNDTRIP_CMP_FLAG,responseContentFlagIcon);
				eachRowMap.put("level","1");

				//Based on filter key decide to insert in assembly list.
				if(filter.equals(AWLConstants.RANGE_ALL) || filter.equals(responseContentFlag))
					assemblyElementsList.add(eachRowMap);
			}
			return assemblyElementsList;

		} catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	
	/**
	 * Process POA data and roundtrip Date to create each row for roundtrip compare screen.
	 * @param context
	 * @param poaElementData
	 * @param responceElementData
	 * @param selectable
	 * @param poaAssemblyLangauges
	 * @param icons
	 * @return data of each row for roundtrip compare screen.
	 * @throws FrameworkException
	 */
	public Map processEachArtworkElement(Context context, Map poaElementData, GS1ArtworkContent responceElementData, Map selectable ,StringList poaAssemblyLangauges) throws FrameworkException
	{
		try
		{
			// initialize all local variables.
			Map eachRowMap = new HashMap();
			
			boolean isPresentInRes, isPresentInPOA, isContentMatch, isGraphic, isChangedByRecipient;
			isPresentInRes = isPresentInPOA = isContentMatch = isGraphic = isChangedByRecipient = false;
			
			//from DB only
			String artId, artName, artRev, artState, artIsMand, artContent,isTranslate;
			artId = artName = artRev = artState = artIsMand = artContent = isTranslate = EMPTY_STRING;
			
			//from DB or Response data
			String artLang, artInsSeq, artTypeActual, resStatus, resCompareHTML, resContent, localeSequence,gs1Type, gs1Key, artSeqNumber, LCRev, MCRev, MCFlag, LCFlag;	
			artLang = artInsSeq = artTypeActual = resStatus = resCompareHTML = resContent = localeSequence = gs1Type = gs1Key = artSeqNumber = LCRev = MCRev = MCFlag = LCFlag = EMPTY_STRING;
			
			isPresentInRes  = responceElementData!=null;
			isPresentInPOA	= poaElementData!=null && !poaElementData.isEmpty();
			
			boolean isStructure = isPresentInPOA?BusinessUtil.isNotNullOrEmpty((String)poaElementData.get("isStructure")) : isPresentInRes ? responceElementData.isStructure() : false;
			
			//Existing Element present in system, get info from Map.
			if(isPresentInPOA)
			{
				isTranslate = (String)poaElementData.get(AWLConstants.TRANSLATE);
				artId = (String)poaElementData.get(AWLConstants.ID);
				artContent = (String)poaElementData.get(selectable.get(AWLConstants.COPY_TEXT));
				artName = (String)poaElementData.get(AWLConstants.NAME.toLowerCase());
				artRev = (String)poaElementData.get(AWLConstants.REV);
				artState = (String)poaElementData.get(AWLConstants.CURRENT);
				artIsMand = (String)poaElementData.get(selectable.get(AWLConstants.IS_MANDATORY));
				//Logic to show extra languages for inline and instance seq.
				Object language = poaElementData.get(selectable.get(AWLConstants.LANGUAGE_SEL));
				artLang =  language == null || isStructure ? AWLConstants.EMPTY_STRING : language.toString();
				artInsSeq = (String) poaElementData.get(AWLConstants.INSTANCE_SEQ);
				artSeqNumber = (String)poaElementData.get(AWLConstants.SEQUENCE_NUMBER);	
				artSeqNumber = BusinessUtil.isNullOrEmpty(artSeqNumber)?"":artSeqNumber;
				localeSequence = (String) poaElementData.get(AWLConstants.LOCAL_SEQ_NODE);
				artTypeActual = (String) poaElementData.get(AWLConstants.TYPE);
				isGraphic = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String) poaElementData.get(selectable.get(AWLConstants.IS_GRAPHIC)));
				gs1Key = (String) poaElementData.get(AWLConstants.GS1_KEY);
				gs1Type = BusinessUtil.isNullOrEmpty(gs1Type)? gs1Key : gs1Type;
				
				MCRev = (String) poaElementData.get("MCRev");
				LCRev = (String) poaElementData.get("LCRev");
				MCFlag = (String) poaElementData.get("MCFlag");
				LCFlag = (String) poaElementData.get("LCFlag");
			}
			
			//Present in Response File, check presence in XML Map if found add data otherwise mark as New in DB.
			if(isPresentInRes)
			{
				resContent = responceElementData.getRTEContent();
				
				//IR-550739-3DEXPERIENCER2018x  -- Start
				//isContentMatch = isContentMatch? isContentMatch: AWLUtil.isRTEContentMatch(context, UIRTEUtil.getNonRTEString(context, artContent), UIRTEUtil.getNonRTEString(context, resContent));
				
				isChangedByRecipient = responceElementData.isChangedByRecipient();
				//Newly added from Responce file or Removed from POA, check presence in Assembly Map if found add data otherwise mark as New in XML.
				if(!isPresentInPOA)
				{
					//Fetch from poa lang name, display type from System Cache, inline ignorance 999.
					artLang    = responceElementData.getLocaleSequence();
					
					String inlineLocaleSeq = EnoviaResourceBundle.getProperty(context, "emxAWL.POAResponse.IngoreValidationForLocaleSequence");
					StringList seqToSkip = FrameworkUtil.split(inlineLocaleSeq, ",");

					if(isStructure)
						artLang = AWLConstants.EMPTY_STRING;
					else {
						artLang = seqToSkip.contains(artLang) ?	AWLConstants.EMPTY_STRING :
							(String)poaAssemblyLangauges.get(Integer.valueOf(artLang) - 1);
					}
			
					artInsSeq = responceElementData.getInstanceSequence();
					artSeqNumber = "999";
					gs1Type = responceElementData.getGs1Key();
					localeSequence = responceElementData.getLocaleSequence();
					artTypeActual  = GS1TenantCacheUtil.getArtworkElementType(context, responceElementData.getGs1Key());
					if(artTypeActual==null) {
						artTypeActual = NutritionFactsConfiguration.getNutriFactConfigByGS1(context, gs1Type).getType();
						//artTypeActual = AWLPropertyUtil.getTypeI18NString(context, artTypeActual, true);
						artTypeActual = ArtworkMaster.getArtworkElementType(context, artTypeActual, true, false);
					}
					isGraphic 	   = responceElementData.isGraphic();
				}
			}
			
			//Graphic element comparison check based on changed by recipient value. 
			if(isGraphic){
				resStatus    = isPresentInPOA && isPresentInRes ? 
						       (isChangedByRecipient ? AWLConstants.RESPONSE_MODIFIED_ELEMENT : AWLConstants.RESPONSE_MATCH_ELEMENT) : 
							   (isPresentInPOA ? AWLConstants.RESPONSE_MISSING_ELEMENT : AWLConstants.RESPONSE_NEW_ELEMENT);
			}
			else
			{
				if(isPresentInPOA) {
					Map<String, String> compareResult = AWLUtil.getCompareResult(context, artContent, resContent);
					isContentMatch = Boolean.valueOf(compareResult.get("isContentSame"));
					resCompareHTML = (String) compareResult.get("compareResult");
					if(isContentMatch)
						resCompareHTML = AWLUtil.strcat("<span class='verbatim'>", resCompareHTML, "</span>");
				} else {
					resCompareHTML = AWLUIUtil.getHTMLEncodeForProgramHTML(context, resContent.replaceAll("(?i)&lt;", "<").replaceAll("(?i)&gt;", ">"));
					resCompareHTML = AWLUtil.strcat("<span class='verbatim'>", resCompareHTML, "</span>");
				}
				
				resStatus    = isPresentInPOA && isPresentInRes ? 
						       (isContentMatch ? AWLConstants.RESPONSE_MATCH_ELEMENT : AWLConstants.RESPONSE_MODIFIED_ELEMENT) :
							   isPresentInPOA ? AWLConstants.RESPONSE_MISSING_ELEMENT:AWLConstants.RESPONSE_NEW_ELEMENT;
			}
			
			resCompareHTML = isGraphic ? EMPTY_STRING : resCompareHTML;
			
			//responceContentFlag = icons.get(responceContentFlag);
			String langSpecificState = artState.isEmpty()?artState:AWLPropertyUtil.getStateI18NString(context, AWLPolicy.POA.get(context),artState);
			String langSpecificRange = artIsMand.isEmpty()?artIsMand:AWLPropertyUtil.getAttributeRangeI18NString(context, AWLAttribute.IS_MANDATORY.get(context), artIsMand);
			
			// Total Cloumns:: 1) type 2)Name 3)Ins Sequence 4)Language 5)Content 6)R Text 7)R Match 8)R Flag 9)State 10)Rev 11)Is mandatory
			//XSS Encoding not working for Copy text RTE.
			
			String elemenType = AWLPropertyUtil.getTypeI18NString(context, artTypeActual, false);
			
			boolean canSync = isPresentInPOA && isPresentInRes &&  !isContentMatch && !isGraphic;
			boolean canAdd =  isPresentInRes && (!isPresentInPOA || !isContentMatch);
			boolean canRemove = isPresentInPOA;
			/* Modified condition to fix IR-528223 */
			boolean outOfSync = ((isPresentInPOA || isPresentInRes) && (!isContentMatch && !isGraphic));
			
			/*For Graphic Element, present in both Response and POA, 
			   If isChangedByRecipient is false, then We are not allowing create new.
			   else isChangedByRecipient is true, then We are allowing user to create new.*/ 
			canAdd = isGraphic && isPresentInRes && isPresentInPOA ? isChangedByRecipient : canAdd;
			
			String elementKey = isStructure ? gs1Type+"_"+artInsSeq : gs1Type+"_"+artInsSeq+"_"+localeSequence;
			
			
			
			//Building JSON to pass it on to JSP, by setting the ID of checkbox as this encoded information
			Map elementInfoMap = new HashMap();
			elementInfoMap.put("TypeActual", artTypeActual);
			elementInfoMap.put("artworkInsSequence", artInsSeq);
			elementInfoMap.put("artworkIsMandatory", artIsMand);
			elementInfoMap.put("artworkId", artId);
			elementInfoMap.put(AWLConstants.GS1_KEY, gs1Key);
			elementInfoMap.put("isStructure", Boolean.toString(isStructure));
			elementInfoMap.put("artworkLanguage", artLang);
			elementInfoMap.put("isGraphic", Boolean.toString(isGraphic));
			elementInfoMap.put(AWLConstants.ROUNDTRIP_CMP_FLAG, resStatus);
			elementInfoMap.put("canSync", Boolean.toString(canSync));
			elementInfoMap.put("outOfSync", Boolean.toString(outOfSync));
			elementInfoMap.put("canAdd", Boolean.toString(canAdd));
			elementInfoMap.put("canRemove", Boolean.toString(canRemove));
			elementInfoMap.put(AWLConstants.GS1_RESPONSE_ELEMENTKEY, elementKey);
			elementInfoMap.put("artworkLocaleSequence", localeSequence);
			elementInfoMap.put(AWLConstants.IS_TRANSLATE, isTranslate);
			
			//String encodedJSON = XSSUtil.encodeForURL(context, new com.matrixone.apps.cpd.util.JsonHelper().getJsonString(elementInfoMap));
			
			// Information passed to JSP to process the element --> emxTableRowId --> Selected Row ID
			eachRowMap.put(SELECT_ID,  elementInfoMap);
			eachRowMap.put("artworkTypeActual", artTypeActual);
			eachRowMap.put(AWLConstants.GS1_RESPONSE_ELEMENTKEY, elementKey);
			eachRowMap.put("artworklocalesequence", localeSequence);
			eachRowMap.put(AWLConstants.GS1_KEY, gs1Key);
			eachRowMap.put("artworkType", AWLConstants.TYPE_LOCAL_COPY_IMAGE + AWLPropertyUtil.getTypeI18NString(context, artTypeActual, false));
			eachRowMap.put("artworkId", artId);
			eachRowMap.put(selectable.get(AWLConstants.IS_GRAPHIC), Boolean.toString(isGraphic));
			eachRowMap.put("artworkName", artName);
			eachRowMap.put("artworkInstanceSequence", artInsSeq);
			eachRowMap.put("artworkSequenceNumber", artSeqNumber);
			eachRowMap.put("artworkLanguage", artLang);
			eachRowMap.put("artworkContent", artContent);
			eachRowMap.put("artworkRoundtripContent", resContent);
			eachRowMap.put(AWLConstants.ROUNDTRIP_CMP_FLAG, resStatus);
			eachRowMap.put("artworkRoundtripCompareHTML", resCompareHTML);
			eachRowMap.put("artworkStateActual", artState);
			eachRowMap.put("artworkState",langSpecificState );
			eachRowMap.put("artworkRevision", artRev);
			eachRowMap.put("artworkIsMandatoryActual", artIsMand);
			eachRowMap.put("artworkIsMandatory", langSpecificRange);
			eachRowMap.put("canSync", Boolean.toString(canSync));
			eachRowMap.put("canAdd", Boolean.toString(canAdd));
			eachRowMap.put("canRemove", Boolean.toString(canRemove));
			eachRowMap.put("isGraphic", Boolean.toString(isGraphic));
			eachRowMap.put("outOfSync", Boolean.toString(outOfSync));
			eachRowMap.put("LCRev", LCRev);
			eachRowMap.put("MCRev", MCRev);
			eachRowMap.put("LCFlag", LCFlag);
			eachRowMap.put("MCFlag", MCFlag);
			
			boolean isSubStructuredElement =  poaElementData!=null && AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)poaElementData.get("isSubStructuredElement"));
			
			if(isSubStructuredElement) {
				elementInfoMap.put("isSubStructuredElement", Boolean.toString(isSubStructuredElement));
				elementInfoMap.put("gs1Type", gs1Type);
				elementInfoMap.put(AWLConstants.GS1_KEY, gs1Key);	
			}
			return isStructure ? processStructureElement(context, poaElementData, responceElementData, selectable, poaAssemblyLangauges, eachRowMap) : eachRowMap ;
			
		} catch (Exception e) { throw new FrameworkException(e);}
		
	}
	
	/**
	 * Process POA data and roundtrip data to create each row for roundtrip compare screen for structured element
	 * @param context
	 * @param poaElementData
	 * @param responseData
	 * @param selectable
	 * @param poaAssemblyLangauges
	 * @param structureRootElementMap
	 * @return
	 * @throws FrameworkException
	 */
	private Map processStructureElement(Context context, Map poaElementData, GS1ArtworkContent responseData, Map selectable, StringList poaAssemblyLangauges, Map structureRootElementMap) throws FrameworkException 
	{
		Map eachRowMap = (Map) structureRootElementMap;
		Map checkBoxMap = (Map) eachRowMap.get(SELECT_ID);
		boolean isPresentInRes = responseData!=null,
				isPresentInPOA = poaElementData!=null;

		Map<String, Map> poaStructureInfo = isPresentInPOA ?(Map<String, Map>) poaElementData.get("structureInfo") : null;
		Map<String, GS1ArtworkContent> responseStructureInfo = isPresentInRes ? GS1Util.getUniqueKeyMap(context, responseData.getStructureInfo()) : null;
		
		Set<String> structElementUniqueKeys =  isPresentInPOA ? poaStructureInfo.keySet()  :  
											   isPresentInRes ? GS1Util.getUniqueKeyMap(context, responseData.getStructureInfo()).keySet() : new TreeSet<String>();
		MapList slChildrenToJSON = new MapList();
		
		List<Boolean> lCanSync = new ArrayList<Boolean>();
		List<Boolean> lCanAdd = new ArrayList<Boolean>();
		List<Boolean> lCanRemove = new ArrayList<Boolean>();
		List<Boolean> lOutOfSync = new ArrayList<Boolean>();
		
		for (String key : structElementUniqueKeys) 
		{
			Map poaStructureElementData = isPresentInPOA ? poaStructureInfo.get(key) : null;
			GS1ArtworkContent responseStructureData = isPresentInRes ? responseStructureInfo.get(key) : null;
			Map currentStructureInfoMap = processEachArtworkElement(context, poaStructureElementData, responseStructureData, selectable, poaAssemblyLangauges);
			currentStructureInfoMap.put("level","2");
			currentStructureInfoMap.put("disableSelection", "true");
			currentStructureInfoMap.remove(SELECT_ID);
			currentStructureInfoMap.remove("artworkType");			
			lCanSync.add(Boolean.valueOf((String) currentStructureInfoMap.get("canSync")));
			lCanAdd.add(Boolean.valueOf((String) currentStructureInfoMap.get("canAdd")));
			lCanRemove.add(Boolean.valueOf((String) currentStructureInfoMap.get("canRemove")));
			lOutOfSync.add(Boolean.valueOf((String) currentStructureInfoMap.get("outOfSync")));
			slChildrenToJSON.add(currentStructureInfoMap);
		}
		checkBoxMap.put("children", slChildrenToJSON);
		
		//canSync logic
		boolean canSync = lCanSync.contains(true);
		boolean canRemove = lCanRemove.contains(true);
		boolean canAdd = canSync ? true : canRemove ? false : lCanAdd.contains(true);
		
						      
        String resStatus    = (isPresentInPOA && isPresentInRes) ? 
								       ((canSync|| canAdd) ?  AWLConstants.RESPONSE_MODIFIED_ELEMENT: AWLConstants.RESPONSE_MATCH_ELEMENT) :
									   (isPresentInPOA ? AWLConstants.RESPONSE_MISSING_ELEMENT:AWLConstants.RESPONSE_NEW_ELEMENT);
							       
       checkBoxMap.put("canAdd", Boolean.toString(canAdd));
       checkBoxMap.put("canSync", Boolean.toString(canSync));
       checkBoxMap.put("canRemove", Boolean.toString(canRemove));
       eachRowMap.put(AWLConstants.ROUNDTRIP_CMP_FLAG, lOutOfSync.contains(true) ? AWLConstants.RESPONSE_MODIFIED_ELEMENT : "");
       
	  return eachRowMap;
	}
	
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getChildren(Context context, String[]  args) throws FrameworkException {
		try 
		{
			Map paramMap = (Map) JPO.unpackArgs(args);
			
			if(BusinessUtil.isNullOrEmpty((String)paramMap.get("objectId")))
				return new MapList();
			
			String receivedJSON = XSSUtil.decodeFromURL((String)paramMap.get("objectId"));			
			JsonObject myJson =  BusinessUtil.toJSONObject(receivedJSON);

			if(!myJson.containsKey("children"))
				return new MapList();

			JsonArray childreArray = (JsonArray) myJson.getJsonArray("children");
			MapList returnList = new MapList();
			Map<String,String> icons = AWLUIUtil.getRoundtripCompareFlag(context);

			for (int i = 0; i < childreArray.size(); i++) {
				JsonObject objects = childreArray.getJsonObject(i);
				Map currentMap = BusinessUtil.toMap(objects);

				currentMap.put("artworkType", AWLConstants.TYPE_LOCAL_COPY_IMAGE + (String)currentMap.get("artworkTypeActual"));
				String responceContentFlag = (String)currentMap.get(AWLConstants.ROUNDTRIP_CMP_FLAG);
				String responceContentFlagIcon = icons.get(responceContentFlag);
				currentMap.put(AWLConstants.ROUNDTRIP_CMP_FLAG, responceContentFlagIcon);
				returnList.add(currentMap);
			}

			return returnList;

		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}

	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkResponseCompareAllElements(Context context, String[] args) throws FrameworkException {
		return getArtworkResponseRoundTripFilterAssembly(context, args, AWLConstants.RANGE_ALL);
	}
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkResponseCompareModifiedElements(Context context, String[] args) throws FrameworkException {
			return getArtworkResponseRoundTripFilterAssembly(context, args, AWLConstants.RESPONSE_MODIFIED_ELEMENT);
	}
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkResponseCompareNewElements(Context context, String[] args) throws FrameworkException {
			return getArtworkResponseRoundTripFilterAssembly(context, args, AWLConstants.RESPONSE_NEW_ELEMENT);
	}
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getArtworkResponseCompareMissingElements(Context context, String[] args) throws FrameworkException {
			return getArtworkResponseRoundTripFilterAssembly(context, args, AWLConstants.RESPONSE_MISSING_ELEMENT);
	}	
	
	public String getArtworkResponsePrimaryFile(Context context, String[] args) throws FrameworkException {
		try {
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map requestMap = BusinessUtil.getRequestMap(programMap);
			String objectId = (String) requestMap.get(OBJECT_ID);
			boolean isPOA = BusinessUtil.isKindOf(context, objectId, AWLType.POA.get(context));
			boolean isAF = !isPOA && BusinessUtil.isKindOf(context, objectId, AWLType.ARTWORK_FILE.get(context));
			ArtworkFile file = isPOA ? new POA(objectId).getArtworkFile(context,false) : 
				               isAF ? new ArtworkFile(objectId) : null;
			if(file == null)
				return "";

			StringList primIDs = file.getArtworkResponsePrimaryFiles(context);
			if(BusinessUtil.isNullOrEmpty(primIDs))
				return "";
			
			
			return FrameworkUtil.join(BusinessUtil.getInfo(context, primIDs, AWLAttribute.TITLE.getSel(context)), ", ");
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public String getArtworkResponseRoundtripFile(Context context, String[] args) throws FrameworkException {

		try {
			Map programMap = (HashMap) JPO.unpackArgs(args);
			Map requestMap = BusinessUtil.getRequestMap(programMap);
			String objectId = (String) requestMap.get(OBJECT_ID);
			boolean isPOA = BusinessUtil.isKindOf(context, objectId, AWLType.POA.get(context));
			boolean isAF = !isPOA && BusinessUtil.isKindOf(context, objectId, AWLType.ARTWORK_FILE.get(context));
			ArtworkFile file = isPOA ? new POA(objectId).getArtworkFile(context,false) : 
				               isAF ? new ArtworkFile(objectId) : null;
			if(file == null)
				return "";

			String fileID = file.getArtworkResponse(context);
			if(BusinessUtil.isNullOrEmpty(fileID))
				return "";
			
			
			return BusinessUtil.getInfo(context, fileID, AWLAttribute.TITLE.getSel(context));
		} catch (Exception e) {
			throw new FrameworkException(e);
		}
	}
	
	public Vector getVersionFileActions(Context context, String args[]) throws FrameworkException
	{
		try
		{
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
			Map requestParamMap = BusinessUtil.getRequestParamMap(programMap);
			String artworkFileId = (String)requestParamMap.get("objectId");
			List<Map> objectList = BusinessUtil.getObjectList(programMap);
			for (Map currentMap : objectList)  {
				currentMap.put(CommonDocument.SELECT_MASTER_ID, artworkFileId);
			}
			return (Vector) invokeLocal(context, "emxCommonFileUI", null, "getFileActions", JPO.packArgs(programMap), Vector.class);

		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	public String getCopyTextFromGS1(Context context, String[] args) throws FrameworkException {
		try {
			Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			String poaId = (String) mpRequest.get(AWLConstants.SELECTED_POA_ID);
			String gs1ResponseElementKey = (String) mpRequest.get(AWLConstants.GS1_RESPONSE_ELEMENTKEY);
			GS1Assembly roundtrip  = new POA(poaId).getArtworkFile(context).getGS1Assembly(context);
			if(roundtrip == null)
				return EMPTY_STRING;
			List<GS1ArtworkContent> roundtripContentList= roundtrip.getArtworkContent();
			Map<String,GS1ArtworkContent> roundtripDataMap = GS1Util.getUniqueKeyMap(context,roundtripContentList);
			GS1ArtworkContent content = roundtripDataMap.get(gs1ResponseElementKey);
			if (content == null)
				return EMPTY_STRING;
			
			return content.getRTEContent();
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public Map getStructureCopyTextFromGS1(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			String poaId = (String) mpRequest.get(AWLConstants.SELECTED_POA_ID);
			String gs1ResponseElementKey = (String) mpRequest.get(AWLConstants.GS1_RESPONSE_ELEMENTKEY);
			GS1Assembly roundtrip  = new POA(poaId).getArtworkFile(context).getGS1Assembly(context);
			Map<String, String> structureCopyText = new HashMap<String, String>();
			if(roundtrip == null)
				return structureCopyText;
			
			List<GS1ArtworkContent> roundtripContentList= roundtrip.getArtworkContent();
			Map<String,GS1ArtworkContent> roundtripDataMap = GS1Util.getUniqueKeyMap(context,roundtripContentList);
			GS1ArtworkContent content = roundtripDataMap.get(gs1ResponseElementKey);
			if (content == null)
				return structureCopyText;
			
			List<GS1ArtworkContent> structureInfo = content.getStructureInfo();
			for (GS1ArtworkContent gs1ArtworkContent : structureInfo) {
				structureCopyText.put(gs1ArtworkContent.getGs1Key()+"_"+gs1ArtworkContent.getInstanceSequence()+"_"+gs1ArtworkContent.getLocaleSequence(), gs1ArtworkContent.getRTEContent());
			}
			
			return structureCopyText;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	
	public String getInstanceSequenceFromGS1(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map requestMap = (Map) programMap.get(AWLConstants.requestMap);
			if(AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)requestMap.get(AWLConstants.USE_INSTANCESEQ_FROM_RES))){
				return AWLPropertyUtil.getI18NString(context, "emx.AWL.AutoNextInSequence");
			}
			return (String) requestMap.get(AWLConstants.RESPONSE_SEQUENCE);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public String getDefaultAssociationForGS1(Context context, String[] args) throws FrameworkException
	{
    	try
		{
    		Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			return BusinessUtil.getInfo(context, (String)mpRequest.get(AWLConstants.PLACE_OF_ORG_OID), DomainConstants.SELECT_NAME);
		}catch(Exception ex){ throw new FrameworkException(ex);}
		
	}
	
	public String getSelectedLanguagesFromGS1(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			return (String)mpRequest.get(AWLConstants.SELECTED_LANGUAGE);
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public boolean isLCLangNotMatchPrefBaseLang(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			if(AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)programMap.get("isStructure"))) {
				return false;
			}
			return AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)programMap.get(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG));
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public boolean isLCLangMatchPrefBaseLang(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			if(AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)programMap.get("isStructure"))) {
				return false;
			}
			return AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)programMap.get(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG));
		} catch(Exception e) {throw new FrameworkException(e);}
	}
	
	public boolean checkForInline(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			return AWLConstants.RANGE_YES.equalsIgnoreCase((String)programMap.get(AWLConstants.IS_INLINE_COPY));
		} catch(Exception e) {throw new FrameworkException(e);}
	}
	
	public boolean checkForNotInline(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			return AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)programMap.get(AWLConstants.IS_LCLANG_MATCH_PREF_BASELANG)) && AWLConstants.RANGE_NO.equalsIgnoreCase((String)programMap.get(AWLConstants.IS_INLINE_COPY));
		} catch(Exception e) {throw new FrameworkException(e);}
	}
	
	
	public String getMasterCreationInstruction(Context context, String[] args) throws FrameworkException {
		return AWLPropertyUtil.getI18NString(context, "emxAWL.Message.NoMasterElementConnectedToPOA");
	}

	public Object getLanguageChoice(Context context, String[] args) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			String selectedLang = (String)mpRequest.get(AWLConstants.RESPONSE_LANG);
			StringList slLang =  FrameworkUtil.split(selectedLang, ",");
			HashMap tempMap = new HashMap();
			tempMap.put("field_choices", slLang);
		    tempMap.put("field_display_choices", slLang);
		    return tempMap;
		} catch(Exception e) {throw new FrameworkException(e);}
	}
	
	public String getInlineTranslationValueForGS1(Context context, String args[]) throws FrameworkException {
		try{
			
			Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			return (String)mpRequest.get(AWLConstants.IS_INLINE_COPY);
		} catch(Exception e) {throw new FrameworkException(e);}
	}
	
	public String getTranslateValueForGS1(Context context, String args[]) throws FrameworkException {
		try{
			Map programMap = (Map)JPO.unpackArgs(args);
			Map mpRequest = (Map) programMap.get(AWLConstants.requestMap);
			return (String)mpRequest.get(AWLConstants.IS_TRANSLATE);
		} catch(Exception e) {throw new FrameworkException(e);}
	}

	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getPackagingParts(Context context, String[] args) throws FrameworkException {
		try {
			Map paramMap = (Map) JPO.unpackArgs(args);
			String poaId = (String) paramMap.get(OBJECT_ID);
			POA poaObject = new POA(poaId);
			return poaObject.getPackagingParts(context);
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	
	public StringList getPackageAssocationsHTML(Context context, String[] args) throws FrameworkException {
		try {
			Map programMap = (Map) JPO.unpackArgs(args);
			StringList objectIdList = BusinessUtil.getIdList(BusinessUtil.getObjectList(programMap));
			StringList returnList = new StringList(objectIdList.size());
			
			Map paramList = (Map)programMap.get(BusinessUtil.PARAM_LIST);
			String export = BusinessUtil.getString(paramList, "exportFormat");
			boolean forExport = BusinessUtil.isNotNullOrEmpty(export);
			
			String PROGRAM = "AWLPOAUI";
			String FUNCTION = "getPackagingPartNames";
			String toolTipText =  AWLPropertyUtil.getI18NString(context, "emxAWL.Header.POAPackagePartAssociated");
			
			for (String poaID : (List<String>)objectIdList) {
				POA poa = new POA(poaID);
				MapList packages = poa.getPackagingParts(context);
				StringList names = BusinessUtil.toStringList(packages, SELECT_NAME);
				
				String arguments = AWLUtil.strcat("poaID=", poaID);
				String[] javaScriptMethodArgsArray = {PROGRAM, FUNCTION, arguments, "poaID", toolTipText};

				
				String html = generateHTMLForMoreObjects(context, names, true, "emxAWL.Header.POAPackagePartAssociated", forExport, 
						"showAssociatedObjectsUsingJPO", javaScriptMethodArgsArray);
				
				returnList.add(html);
			}
			
			return returnList;
			
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	
	public StringList getPackagingPartNames(Context context, String[] args) throws FrameworkException {
		try {
			Map queryInfoMap = (HashMap) JPO.unpackArgs(args);
			String poaID = (String)  queryInfoMap.get("poaID");
			POA poa = new POA(poaID);
			MapList packages = poa.getPackagingParts(context);
			StringList names = BusinessUtil.toStringList(packages, SELECT_NAME);
			Collections.sort(names);
			return names;
		} catch (Exception e){ throw new FrameworkException(e);	}
	}
	
	public StringList getElementStatusColumn(Context context, String[] args) throws FrameworkException
	{
		try
		{
			String SEL_STRUCTURED_MASTER_ELEMENT = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
			String SEL_ATTR_INLINE_TRANSLATION = AWLAttribute.INLINE_TRANSLATION.getSel(context);
			String SEL_ATTR_TRANSLATE = AWLAttribute.TRANSLATE.getSel(context);
			
			Map programMap = (Map) JPO.unpackArgs(args);
			MapList objectMapList = BusinessUtil.getObjectList(programMap);
			StringList objectIdList = BusinessUtil.getIdList(objectMapList);

			StringList returnImages = new StringList();
			MapList imagesMapList = new MapList();
			
			String inlineTranslation  = AWLPropertyUtil.getI18NString(context,"emxAWL.Attribute.InlineTranslation");
			String noTranslation      = AWLPropertyUtil.getI18NString(context,"emxAWL.Tooltip.NoTranslation");
			String structuredElement  = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.StructuredElement");
			
			for (Map elementMap :(List<Map>) objectMapList) {
				
				boolean isInline = AWLConstants.RANGE_YES.equalsIgnoreCase((String)elementMap.get(SEL_ATTR_INLINE_TRANSLATION));
				boolean isNoTranslate = AWLConstants.RANGE_NO.equalsIgnoreCase((String)elementMap.get(SEL_ATTR_TRANSLATE));
				boolean isStructuredElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)elementMap.get(SEL_STRUCTURED_MASTER_ELEMENT));
				
				String image = "";
				String tooltip = "";
				
				if(isStructuredElement){
					image   = "AWLStructureCopy.png";
					tooltip = structuredElement;
				}else if(isNoTranslate) {
					image   = "AWLiconStatusNoTranslation.png";
					tooltip = noTranslation;
				} else if(isInline){
					image   = "AWLiconStatusInlineTranslation.png";
					tooltip = inlineTranslation;
				}
				
				if(BusinessUtil.isNotNullOrEmpty(image))
				{
					StringBuffer sbHTML = new StringBuffer(250);
					sbHTML.append("<img alt=\"");
					sbHTML.append(tooltip).append("\" border=\"0\" align=\"middle\" style=\"padding:1px\" ");
					sbHTML.append("onmouseover=\"showTooltip(event, this,'").append(tooltip);
					sbHTML.append("');\" onmouseout=\"hideTooltip(event, this);\" ");
					sbHTML.append("src=\"../common/images/").append(image).append("\" />");
					returnImages.add(sbHTML.toString());
				} else {
					returnImages.add(AWLConstants.EMPTY_STRING);
					
				}
			}
			return returnImages;
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	public StringList getTypeNames(Context context, String args[]) throws FrameworkException {
		try{
			Map programMap = (HashMap) JPO.unpackArgs(args);
			StringList objectIdList = BusinessUtil.getIdList(BusinessUtil.getObjectList(programMap));
			
			MapList mlObjectIds =  BusinessUtil.getObjectList(programMap);
			Map currentMap = (Map) mlObjectIds.get(0);
			String strLevel = (String) currentMap.get("level");
			StringList slTypes = BusinessUtil.getInfo(context, objectIdList, "type");
			if("0".equalsIgnoreCase(strLevel) || "1".equalsIgnoreCase(strLevel)) {
				return slTypes;
			}
			
			StringList nutritionTypes = new StringList();
			StringList vitaminTypes = new StringList();
			for(int i=0;i<slTypes.size();i++) {
				String currentType = (String)slTypes.get(i);
				if(AWLType.NUTRIENT_CODES_COPY.get(context).equalsIgnoreCase(currentType)){
					nutritionTypes.add(objectIdList.get(i));
				} else if(AWLType.VITAMIN_CODES_COPY.get(context).equalsIgnoreCase(currentType)) {
					vitaminTypes.add(objectIdList.get(i));
				}
			}
			
			if(BusinessUtil.isNotNullOrEmpty(nutritionTypes)) {
				//BusinessUtil.getInfo(context, nutritionTypes, select)
			}
			
			if(BusinessUtil.isNotNullOrEmpty(vitaminTypes)) {
				
			}
			
			return BusinessUtil.getInfo(context, objectIdList, "type");
		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
    /** To Get the Artwork Element Type
     *  @param context the eMatrix <code>Context</code> object
     *  @param args    holds the following input arguments: paramMap   - Map having object Id String
     *  @return Map 	containing the object copied Structured Root Master Id
     *  @throws Exception if the operation fails
     *  @author Raghavendra M J
     *  @Since VR2018x Created during 'Nutrition Facts Highlight'
     */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public StringList getArtworkElementType(Context context, String args[]) throws FrameworkException 
	{
		try
		{
			Map programMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);

			Map paramList = (HashMap)programMap.get(BusinessUtil.PARAM_LIST);

			MapList childrenList = (MapList)paramList.get("children");

			Map childrenByKey = BusinessUtil.toMapById(objectList);

			StringList objectIdList = BusinessUtil.getIdList(BusinessUtil.getObjectList(programMap));
			String SEL_ATTR_VITAMIN_CODE = AWLUtil.strcat("to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.",  AWLAttribute.VITAMIN_CODE.getSel(context));
			String SEL_ATTR_NUTRIENT_CODE = AWLUtil.strcat("to[",AWLRel.ARTWORK_ELEMENT_CONTENT.get(context),"].from.",  AWLAttribute.NUTRIENT_CODE.getSel(context));
			MapList slTypes = BusinessUtil.getInfo(context, objectIdList, StringList.create(SELECT_TYPE, SELECT_ID, SEL_ATTR_VITAMIN_CODE, SEL_ATTR_NUTRIENT_CODE));

			StringList returnTypes = new StringList();
			for (Map currentInfoMap :(List<Map>) slTypes) 
			{
				String currentType = (String)currentInfoMap.get(SELECT_TYPE);
				String elementId  = (String)currentInfoMap.get(SELECT_ID);

				Map fetchedInfoMap = BusinessUtil.getMapWithValue(objectList, SELECT_ID, (String)currentInfoMap.get(SELECT_ID));
				boolean isSubStructuredElement = AWLConstants.RANGE_TRUE.equalsIgnoreCase((String)fetchedInfoMap.get("isSubStructuredElement"));
				if(isSubStructuredElement)
				{
					Map structureInfoMap = (HashMap) childrenByKey.get(elementId);
					boolean isNutrientType = (boolean) structureInfoMap.get("isNutrientType");
					boolean isVitaminType = (boolean) structureInfoMap.get("isVitaminType");

					String structuredAttribute = (String) structureInfoMap.get("structuredAttribute");

					String gs1Type = "";
					gs1Type = GS1TenantCacheUtil.getArtworkElementType(context, structuredAttribute);
					if(isNutrientType || isVitaminType)
						gs1Type = NutritionFactsConfiguration.getNutriFactConfigByNutrientCode(context, structuredAttribute).getLabel(context, true);
					else 
						gs1Type = AWLPropertyUtil.getTypeI18NString(context, currentType, false);

					returnTypes.add(gs1Type);
				}
				else {
					returnTypes.add(currentType);
				}
			}

			return returnTypes;

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	/** To Get the Artwork Element Type
     *  @param context the eMatrix <code>Context</code> object
     *  @param args    holds the following input arguments: paramMap   - Map having object Id String
     *  @return Map 	containing the object copied Structured Root Master Id
     *  @throws Exception if the operation fails
     *  @author Raghavendra M J
     *  @Since VR2018x Created during 'Nutrition Facts Highlight'
     */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public StringList getArtworkElementState(Context context, String args[]) throws FrameworkException 
	{
		try
		{
			Map programMap = (HashMap) JPO.unpackArgs(args);
			MapList objectList = BusinessUtil.getObjectList(programMap);

			StringList objectIdList = BusinessUtil.getIdList(BusinessUtil.getObjectList(programMap));
			MapList slTypes = BusinessUtil.getInfo(context, objectIdList, StringList.create(SELECT_TYPE, SELECT_ID, SELECT_CURRENT, SELECT_POLICY));

			StringList returnStates = new StringList();
			for (Map currentTypeMap : (List<Map>) slTypes) {
				String currentType = (String) currentTypeMap.get(SELECT_TYPE);
				if (AWLPropertyUtil.isStructuredElementRootType(context, currentType, false))
					returnStates.add("");
				else {
					String currentState = (String) currentTypeMap.get(SELECT_CURRENT);
					String currentPolicy = (String) currentTypeMap.get(SELECT_POLICY);
					returnStates.add(AWLPropertyUtil.getStateI18NString(context, currentPolicy, currentState));
				}
			}

			return returnStates;

		} catch (Exception e) { throw new FrameworkException(e);}
	}
	
	
	/**	
	 * Method shows higher revision Icon if a higher revision of the Master Copy exists otherwise it will display blank.
	 * @param   context
	 * @param   args
	 * @throws  IllegalArgumentException - when args size is zero
	 * @since   AWL 2022x.Beta
	 * @author  Giri Nimmala(NGI3)
	 */
	@SuppressWarnings("rawtypes")
	public StringList getHigherRevisionIcon(Context context, String[] args) throws FrameworkException {
        try {
        	Map programMap = (HashMap) JPO.unpackArgs(args);
            Map paramMap      = BusinessUtil.getRequestParamMap(programMap);
            Map columnMap      = BusinessUtil.getColumnMap(programMap);
            Map  settingMap = (Map)columnMap.get(AWLConstants.STR_SETTINGS);
    		String reportFormat = BusinessUtil.getString(paramMap, "reportFormat");
    		String columnName = BusinessUtil.getString(columnMap, "name");
    		MapList objectList = BusinessUtil.getObjectList(programMap);
    		StringList idList = BusinessUtil.getIdList(objectList);
    		
    		final String tooltipForHigherRevision = columnName.equals("MCFlag")? AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.NewMC"): AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.NewLC");
    		if("MCFlag".equalsIgnoreCase(columnName)) {
    			String SEL_MASTER_ID = AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), CLOSEBRACKET_FROM_ID);
    			MapList artworkMasterRevList = BusinessUtil.getInfoList(context, idList, BusinessUtil.toStringList(SEL_MASTER_ID));
    			idList = BusinessUtil.toStringList(artworkMasterRevList, SEL_MASTER_ID, true);
    		}
    		
    		if(BusinessUtil.isNullOrEmpty(idList))
    			return StringList.create(" ");
    		
    		StringList objectSelectables = BusinessUtil.toStringList(SELECT_ID, SELECT_REVISION, AWLConstants.LAST);
    		MapList mlObjectInfo = BusinessUtil.getInfo(context, idList, objectSelectables);

    		String HIGHER_REVISION_ICON = "<img src=\"../common/images/I_A-newer-revision-exists.png\" border=\"0\" align=\"middle\"></img>";
    		return ((List<Map>)mlObjectInfo).stream().map(objectMap ->{
            	String currentRevision = (String)objectMap.get(SELECT_REVISION);
    			String latestRevision = (String)objectMap.get(AWLConstants.LAST);
    			String tooltip = tooltipForHigherRevision+" "+ latestRevision;
    			String higherRevImageHTML = AWLUtil.strcat("<a HREF=\"#\" TITLE=\"", tooltip, "\">", HIGHER_REVISION_ICON, "</a>");
    			boolean isLatestRev = currentRevision.equals(latestRevision);
    			return  "".equalsIgnoreCase(reportFormat)? (isLatestRev ? " " : higherRevImageHTML) 
					  	   													: (isLatestRev ? AWLConstants.RANGE_NO : AWLConstants.RANGE_YES);
    		}).collect(Collectors.toCollection(StringList::new));
    		
		}  catch (Exception e) { throw new FrameworkException(e); }
    }
	
}
