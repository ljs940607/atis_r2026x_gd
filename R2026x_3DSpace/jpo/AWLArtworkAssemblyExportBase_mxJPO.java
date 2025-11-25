/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.io.StringReader;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLPolicy;
import com.matrixone.apps.awl.enumeration.AWLState;
import com.matrixone.apps.awl.enumeration.AWLXMLAttribute;
import com.matrixone.apps.awl.enumeration.AWLXMLElement;
import com.matrixone.apps.awl.enumeration.AWLXMLPropertyKey;
import com.matrixone.apps.awl.gs1assembly.GS1ArtworkContent;
import com.matrixone.apps.awl.gs1assembly.GS1TenantCacheUtil;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.awl.util.RouteUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.jdom.Document;
import com.matrixone.jdom.Element;
import com.matrixone.jdom.input.SAXBuilder;
import com.matrixone.jdom.output.XMLOutputter;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

@SuppressWarnings({"PMD.TooManyMethods"})
public class AWLArtworkAssemblyExportBase_mxJPO {
	
	@SuppressWarnings({"PMD.UncommentedEmptyConstructor"})
	public AWLArtworkAssemblyExportBase_mxJPO(Context context, String[] args) throws FrameworkException
	{
	}

	protected AWLXMLCustomizationBaseAdapter_mxJPO adapter;
	protected POA currentPOA;
	protected ArtworkPackage artworkPackage;
	protected ArtworkContent currentArtworkElement;
	protected String poaFolderPath;
	protected List<GS1ArtworkContent> contentElements;
	//List<Map>[] listOfCopyAndGraphicMaps;
	
	/**
	 * Invoked from Supplier Job Package/ESKO/POA Artwork Assembly Export
	 * @param context
	 * @param args
	 * @return
	 * @throws FrameworkException
	 */
	public String createArtworkAssemblyXMLFormat(Context context, String[] args) throws FrameworkException
	{
		if(args.length == 0)
			throw new IllegalArgumentException();
		
		try{
			init(context, args);
			Document document = createArtworkAssembly(context);
			
			return AWLUtil.getXMLOutputterOutputString(context, document);
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	@SuppressWarnings({"PMD.AvoidCatchingThrowable", "unchecked"})
	protected void init(Context context, String[] args) throws FrameworkException {
		try {
			HashMap argsMap = JPO.unpackArgs(args);
			currentPOA = new POA(argsMap.get("poaId").toString());
			artworkPackage = currentPOA.getArtworkPackage(context);
			
			adapter = getAdapter(context);
			adapter.setPOA(context, currentPOA);
			adapter.setArtworkPackage(context, artworkPackage);
			try {
				poaFolderPath = argsMap.get("poaName").toString();
				contentElements = getPOAArtworkElements(context,argsMap);
			} catch(Exception e) {
				poaFolderPath = AWLConstants.EMPTY_STRING;
			}			
			adapter.setPOAFolderPath(context, poaFolderPath);
		} catch (Throwable e) { throw new FrameworkException(e.toString()); }
	}
	
    

	
	protected AWLXMLCustomizationBaseAdapter_mxJPO getAdapter(Context context) throws MatrixException {
		String adapterClassName = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.ExportXML.AdapterClass");
		return (AWLXMLCustomizationBaseAdapter_mxJPO) AWLObject_mxJPO.newInstanceOfJPO(context, adapterClassName);
	}
	
	protected Document createArtworkAssembly(Context context) throws FrameworkException {
		try
		{			
			Element awlRootTag = createAWLRootElement(context);
			adapter.customizeRootElement(context, awlRootTag);

			Element documentTag = createDocElement(context);
			adapter.customizeDOCElement(context, documentTag);
			awlRootTag.addContent(documentTag);

			Element contentElementTag = createContentElements(context);
			awlRootTag.addContent(contentElementTag);

			Document xslDoc = adapter.getTransformDocument(context);

        	XMLOutputter outputter = new XMLOutputter();
        	StringWriter strwriter=new StringWriter();

        	outputter.output(xslDoc, strwriter);
			
	        TransformerFactory factory = TransformerFactory.newInstance();
	        Source xslt = new StreamSource(new StringReader(strwriter.toString()));
	        Transformer transformer = factory.newTransformer(xslt);
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
		
        	strwriter=new StringWriter();
        	outputter.output(awlRootTag, strwriter);

        	
			Source text = new StreamSource(new StringReader(strwriter.toString()
    			.replace("&lt;P&gt;", "<p>").replace("&lt;/P&gt;", "</p>")
    			.replace("&lt;p&gt;", "<p>").replace("&lt;/p&gt;", "</p>")
    			));

	        StringWriter outString=new StringWriter();
	        transformer.transform(text, new StreamResult(outString));

	        
			String outStr = outString.toString()
	    		.replaceAll("&lt;[B|b][r|R][ ]?/&gt;", "<br/>")
	    		.replaceAll("&lt;[b|B]&gt;", "<b>")
	    		.replaceAll("&lt;/[b|B]&gt;", "</b>")
	    		.replaceAll("&lt;[i|I]&gt;", "<i>")
	    		.replaceAll("&lt;/[i|I]&gt;", "</i>")
	    		.replaceAll("&lt;[u|U]&gt;", "<u>")
	    		.replaceAll("&lt;/[u|U]&gt;", "</u>")
	    		.replaceAll("&lt;[S|s][T|t][R|r][O|o][N|n][G|g][ ]?&gt;", "<strong>")
                .replaceAll("&lt;/[S|s][T|t][R|r][O|o][N|n][G|g][ ]?&gt;", "</strong>")
                .replaceAll("&lt;[E|e][M|m][ ]?&gt;", "<em>")
                .replaceAll("&lt;/[E|e][M|m][ ]?&gt;", "</em>")
                .replaceAll("(?i)&lt;sup&gt;", "<sup>")
				.replaceAll("(?i)&lt;/sup&gt;", "</sup>")
				.replaceAll("(?i)&lt;span&gt;", "<span>")
				.replaceAll("(?i)&lt;/span&gt;", "</span>")
				.replaceAll("(?i)&lt;span dir=\"RTL\"&gt;", "<span dir=\"RTL\">")
				.replaceAll("(?i)&lt;span dir=\"LTR\"&gt;", "<span dir=\"LTR\">")
			;
			Document transformedDoc=(new SAXBuilder()).build(new StringReader(outStr));
			return transformedDoc;
			/*Document dom = new Document(awlRootTag);
			return dom;*/
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	/**
	 * Create AWL Root element with (Customized) attributes
	 * 
	 * @param context
	 * @return AWL-Root Element with (Customized) attributes
	 * @throws Exception
	 */
	protected Element createAWLRootElement(Context context)
	{
		return new Element(AWLXMLElement.AWL.getName());
	}

	protected Element createDocElement(Context context) throws FrameworkException
	{
		try
		{
			Element docElement = new Element(AWLXMLElement.DOC_ID.getName());
			SimpleDateFormat defaultAWLGS1DateFormat = adapter.getDateTimeFormat(context, AWLXMLPropertyKey.DEFAULT_AWLGS1_DATE_FORMAT.getValue(context));
			docElement.setAttribute(AWLXMLAttribute.TIME_STAMP.getName(), defaultAWLGS1DateFormat.format(new Date()));
			return docElement;
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	/**
	 * This will create Content Elements and its children elements. Content
	 * element will be added to AWL-Root Element
	 * 
	 * @param context
	 * @param awlRootElement
	 * @param globalArgs
	 * @return Content element
	 * @throws Exception
	 */
	protected Element createContentElements(Context context) throws FrameworkException 
	{
		try
		{
			// Create Content Element with Attributes.
			Element contentTag = createContentElement(context);
			adapter.customizeContentElement(context, contentTag);

			contentTag.addContent(createPOAElement(context));

			return contentTag;
		
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	/**
	 * @param context
	 * @param artworkPackage
	 * @return Content DOM Element
	 * @throws Exception
	 */
	protected Element createContentElement(Context context) throws FrameworkException
	{
		try
		{
			Element contentElement = new Element(AWLXMLElement.CONTENT.getName());
			
			String creationTimeDate = artworkPackage.getInfo(context, DomainConstants.SELECT_ORIGINATED);
			Date creationDate = eMatrixDateFormat.getJavaDate(creationTimeDate);
			SimpleDateFormat defaultAWLGS1DateFormat = adapter.getDateTimeFormat(context, AWLXMLPropertyKey.DEFAULT_AWLGS1_DATE_FORMAT.getValue(context));
			
			contentElement.setAttribute(AWLXMLAttribute.TIME_STAMP.getName(), defaultAWLGS1DateFormat.format(creationDate));
			contentElement.setAttribute(AWLXMLAttribute.PROJECT_ID.getName(), artworkPackage.getName(context));
			String description = artworkPackage.getDescription(context);
			if(!description.isEmpty())
				contentElement.setAttribute(AWLXMLAttribute.PROJECT_NAME.getName(), description);
			else
				contentElement.setAttribute(AWLXMLAttribute.PROJECT_NAME.getName(), "NA");
			

			// Place holder to customize content Element
			// customizeContentElement(context, contentElement, obj);
			return contentElement;
		} catch (Exception e) { throw new FrameworkException(e); }
		
	}


	/**
	 * Create POA DOM Element based on POAs in ENOVIA-AWL System.Consider
	 * creation of dynamic Attributes and Tags under POA.
	 * 
	 * @param context
	 * @param poaId
	 * @return POA DOM Element
	 * @throws Exception
	 */
	protected Element createPOAElement(Context context) throws FrameworkException 
	{
		try
		{
			Element poaElementTag = new Element(AWLXMLElement.POA.getName());
			poaElementTag.setAttribute(AWLXMLAttribute.ID.getName(), currentPOA.getName(context));
			adapter.customizePOAElement(context, poaElementTag);
			createLocaleElement(context, poaElementTag);
			if(contentElements != null) { 
				for(GS1ArtworkContent as : contentElements) {
					if(as.getObjectId() != null) {
						this.currentArtworkElement = ArtworkContent.getNewInstance(context,as.getObjectId());
						adapter.setCurrentArtworkElement(context, this.currentArtworkElement);
					}
					if(as.isGraphic()) {
						createGraphicsElement(context, poaElementTag, as);
					}
					else if(as.isStructure()) {
						createStructureCopyElement(context, poaElementTag, as);
					} else {
						createCopyElement(context, poaElementTag, as);
					}
				}
			}
			return poaElementTag;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	protected void createStructureCopyElement(Context context, Element poaElementTag, GS1ArtworkContent as) throws FrameworkException {
		Element structureElement = new Element(AWLXMLElement.STRUCTURE.getName());
		structureElement.setAttribute(AWLXMLAttribute.TYPE.getName(), as.getGS1Type());
		structureElement.setAttribute(AWLXMLAttribute.INSTANCE_SEQUENCE.getName(), as.getInstanceSequence());
		structureElement.setAttribute(AWLXMLAttribute.AGENCY_CODE.getName(), AWLXMLPropertyKey.AGENCY_CODE.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_NAME.getName(), AWLXMLPropertyKey.CODE_LIST_NAME.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_URI.getName(), AWLXMLPropertyKey.CODE_LIST_URI.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_VERSION.getName(), AWLXMLPropertyKey.CODE_LIST_VERSION.getValue(context));
		
		List<GS1ArtworkContent> strctureInfo = as.getStructureInfo();
		
		for (GS1ArtworkContent currentArtworkContent : strctureInfo) {
			createCopyElement(context, structureElement, currentArtworkContent);
		}
		adapter.customizeStructureElement(context, structureElement);
		poaElementTag.addContent(structureElement);
	}


	protected void createGraphicsElement(Context context, Element poaElementTag, GS1ArtworkContent as) throws FrameworkException {
		try{
			Element graphicElementTag = new Element(AWLXMLElement.GRAPHIC.getName());
			customizeArtworkElementAttributes(as,graphicElementTag);
			String graphicElementImageURL = AWLUtil.strcat((String)AWLObjectBase_mxJPO.invokeLocal(context, "emxMailUtil", null, "getBaseURL", new String[]{}, String.class) , "?objectId=", as.getObjectId());
			graphicElementTag.setAttribute(AWLXMLAttribute.REF_URI.getName(), graphicElementImageURL);
			adapter.customizeGraphicElement(context, graphicElementTag);
			poaElementTag.addContent(graphicElementTag);
		}catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e.getMessage());
		}
	}

	private HashMap<String, String> getMasterInstanceData(Context context) throws FrameworkException {
		MapList masterCopies = currentPOA.getArtworkMasters(context, StringList.create(DomainConstants.SELECT_ID), StringList.create(AWLAttribute.INSTANCE_SEQUENCE.getSel(context)), AWLConstants.EMPTY_STRING);
		HashMap<String, String> masterInstanceData = new HashMap<String, String>();

		for (Map masterInfoMap : (List<Map>) masterCopies) {
			String masterId = (String) masterInfoMap.get(DomainConstants.SELECT_ID);
			String instanceSequnece = (String) masterInfoMap.get(AWLAttribute.INSTANCE_SEQUENCE.getSel(context));
			masterInstanceData.put(masterId, instanceSequnece);
		}
		return masterInstanceData;
	}

//wx7
	protected void createCopyElement(Context context, Element poaElementTag, GS1ArtworkContent as) throws FrameworkException {
		Element copyElementTag = new Element(AWLXMLElement.COPY.getName());
		customizeArtworkElementAttributes(as, copyElementTag);
		Element contentCopyTextElement = new Element(AWLXMLElement.CONTENT_DATA.getName());
		contentCopyTextElement.setText(as.getRTEContent());
		copyElementTag.addContent(contentCopyTextElement);
		adapter.customizeCopyElement(context, copyElementTag);
		poaElementTag.addContent(copyElementTag);
	}

	protected void customizeArtworkElementAttributes(GS1ArtworkContent as, Element artworkElementTag) {
		artworkElementTag.setAttribute(AWLXMLAttribute.INSTANCE_SEQUENCE.getName(), as.getInstanceSequence());
		artworkElementTag.setAttribute(AWLXMLAttribute.LOCALE_SEQUENCE.getName(), as.getLocaleSequence());
		artworkElementTag.setAttribute(AWLXMLAttribute.APPROVED.getName(),Boolean.toString(as.isApproved()).toUpperCase());
		artworkElementTag.setAttribute(AWLXMLAttribute.TYPE.getName(), as.getGS1Type());
		artworkElementTag.setAttribute(AWLXMLAttribute.TEXT_NOTE.getName(), as.getNote());
	}

	private boolean isCopyApproved(Context context, boolean isPreliminaryPOA, boolean isDraft)
			throws MatrixException, FrameworkException {
		String artworkContentID = currentArtworkElement.getObjectId(context).trim();
		boolean hasRoutes = RouteUtil.hasRoute(context, artworkContentID);
		boolean isRelease = currentArtworkElement.isRelease(context);
		boolean isBase = currentArtworkElement.isBaseCopy(context);
		String baseID = isBase ? artworkContentID :
			                     currentArtworkElement.getArtworkMaster(context).getBaseArtworkElement(context).getObjectId(context).trim();
		boolean baseHasRoute = isBase ? hasRoutes : RouteUtil.hasRoute(context, baseID);

		boolean bApproved =  ( isPreliminaryPOA || isDraft ) ? false : 
							 isBase ? ( isRelease && !baseHasRoute ) :
								      ( isRelease && !hasRoutes && !baseHasRoute);
		return bApproved;
	}
	
	/**
	 * Create Locale DOM Element based on Language sequence in FP Master. Add
	 * Locale Element to POA DOM element. FP Master will be fetched based on
	 * POA. Returned map is used to identify language sequence for individual
	 * Copy Element. Note:- Sequence will always start with 1. ISO code is used as ID.
	 * @param context
	 * @param poaElementTag
	 * @param poa -- Required to know FP Master.
	 * @return HashMap of Locale where ISO code is key and sequence in FP Master is value.
	 * @throws Exception
	 */
	protected Map<String, String> createLocaleElement(Context context, Element poaElementTag) throws FrameworkException {
		
		return currentPOA.getPOALocaleElement(context, poaElementTag,false);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected List<GS1ArtworkContent> getPOAArtworkElements(Context context, HashMap argsMap) throws MatrixException
	{
		List<GS1ArtworkContent> artworkContentList = new ArrayList<GS1ArtworkContent>();
		Map completetePOAInfo = currentPOA.getGS1AssemblyDetails(context, null);
		Map<String, Map> artworkAssemblyInfo = (Map) completetePOAInfo.get(AWLConstants.ARTWORK_ASSEMBLY_INFO);
		
		
		MapList mlPOAArtworkElements = new MapList();
		for (Map.Entry<String, Map> currentEntry : artworkAssemblyInfo.entrySet()) {
			mlPOAArtworkElements.add(currentEntry.getValue());
		}
		
		mlPOAArtworkElements.addSortKey(AWLConstants.SEQUENCE_NUMBER, "ascending", "integer");
		mlPOAArtworkElements.addSortKey(DomainConstants.SELECT_TYPE, "ascending", "string");
		mlPOAArtworkElements.addSortKey(AWLConstants.INSTANCE_SEQ, "ascending", "integer");
		mlPOAArtworkElements.addSortKey(AWLConstants.LOCALE_SEQUENCE, "ascending", "integer");
		mlPOAArtworkElements.sort();
		

		Map poaInfoMap = (Map) completetePOAInfo.get(AWLConstants.POA_BASIC_INFO);
		String currentState = (String) poaInfoMap.get(DomainConstants.SELECT_CURRENT);
		boolean isPreliminaryPOA = AWLState.PRELIMINARY.get(context, AWLPolicy.POA).equalsIgnoreCase(currentState);
		boolean isDraft = AWLState.DRAFT.get(context, AWLPolicy.POA).equalsIgnoreCase(currentState);

		for (Map elementMap : (List<Map>)mlPOAArtworkElements) 
		{
			String elementId = (String) elementMap.get(DomainConstants.SELECT_ID); 
			//Map elementMap = artworkAssemblyInfo.get(elementId);
			this.currentArtworkElement = ArtworkContent.getNewInstance(context,elementId);
			boolean isApproved = isCopyApproved(context, isPreliminaryPOA, isDraft);

			String localeSequence = (String) elementMap.get(AWLConstants.LOCALE_SEQUENCE) ;
			localeSequence = BusinessUtil.isNullOrEmpty(localeSequence) ? DomainConstants.EMPTY_STRING : localeSequence;
			
			boolean isCopyElement = ((String) elementMap.get(AWLConstants.ARTWORK_TYPE)).equalsIgnoreCase(AWLConstants.COPY);
			boolean isStructureElement = ((String) elementMap.get(AWLConstants.ARTWORK_TYPE)).equalsIgnoreCase(AWLConstants.STRUCTURE);

			GS1ArtworkContent gs1ArtworkContent = new GS1ArtworkContent();
			gs1ArtworkContent.setObjectId(elementId);
			gs1ArtworkContent.setInstanceSequence((String) elementMap.get(AWLConstants.INSTANCE_SEQ));
			if(isStructureElement) {
				gs1ArtworkContent.setStructure(isStructureElement);
				List<Map> structureInfo = (List<Map>)elementMap.get(AWLConstants.AWL_STRUCTURE_INFO);
				List<GS1ArtworkContent> gs1ArtworkContentList = new ArrayList<GS1ArtworkContent>();
				for (Map currentStructure : structureInfo) {
					GS1ArtworkContent currentArtworkContent = new GS1ArtworkContent();
					currentArtworkContent.setObjectId((String)currentStructure.get(AWLConstants.ID));
					currentArtworkContent.setInstanceSequence((String) currentStructure.get(AWLConstants.INSTANCE_SEQ));
					
					String structureCopySequence = (String) currentStructure.get(AWLConstants.LOCALE_SEQUENCE) ;
					structureCopySequence = BusinessUtil.isNullOrEmpty(structureCopySequence) ? DomainConstants.EMPTY_STRING : structureCopySequence;
					
					currentArtworkContent.setLocaleSequence(structureCopySequence);
					currentArtworkContent.setLocale((String) currentStructure.get(AWLConstants.LOCALE_ISO_CODE));
					currentArtworkContent.setApproved(isApproved);
					currentArtworkContent.setGs1Key((String) currentStructure.get(AWLConstants.GS1_TYPE));
					currentArtworkContent.setNote((String) currentStructure.get(AWLConstants.NOTES));
					currentArtworkContent.setGS1Type((String) currentStructure.get(AWLConstants.GS1_TYPE));
					currentArtworkContent.setRTEContent((String) currentStructure.get(AWLConstants.COPY_TEXT_RTE));
					gs1ArtworkContentList.add(currentArtworkContent);
				}
				gs1ArtworkContent.setStructureInfo(gs1ArtworkContentList);
			} else {
				gs1ArtworkContent.setGraphic(!isCopyElement);
			}
			gs1ArtworkContent.setLocaleSequence(localeSequence);
			gs1ArtworkContent.setLocale((String) elementMap.get(AWLConstants.LOCALE_ISO_CODE));
			gs1ArtworkContent.setApproved(isApproved);
			gs1ArtworkContent.setGs1Key((String) elementMap.get(AWLConstants.GS1_TYPE));
			gs1ArtworkContent.setNote((String) elementMap.get(AWLConstants.NOTES));
			gs1ArtworkContent.setGS1Type(GS1TenantCacheUtil.getGS1Key(context, elementMap.get(DomainConstants.SELECT_TYPE).toString()));

			if(isCopyElement) {
				gs1ArtworkContent.setRTEContent((String) elementMap.get(AWLConstants.COPY_TEXT_RTE));
			}

			artworkContentList.add(gs1ArtworkContent);
		}
		return artworkContentList;
	}	
	
	/**
	 * Helper API to get Copy and Graphic element of POA assembly.
	 * 
	 * @param context
	 * @param argsMap 
	 * @param currentPOA
	 * @return ArrayList[] with Size of 2. ArrayList[0] gives Copy Element with
	 *         required info Map. ArrayList[1] gives Graphic Element with
	 *         required info Map.
	 * @throws MatrixException 
	 * @throws Exception
	 * @deprecated
	 */
	private ArrayList getPOAArtworkElements(Context context) throws MatrixException
	{
		return null;
	}
	@Deprecated
	protected void createCopyElement(Context context, Element poaElement, Map copyElementMap, Map masterInstanceMap,Map<String, String> langWithSeq) throws FrameworkException 
	{
		try
		{
			Element copyElementTag = new Element(AWLXMLElement.COPY.getName());

			customizeArtworkElementAttributes(context, copyElementTag, copyElementMap,masterInstanceMap, langWithSeq);
			String copyTextRTE = AWLUtil.strcat("attribute[", AWLAttribute.COPY_TEXT.get(context), "_RTE]");
			String copyTextRTEValue = (String) copyElementMap.get(copyTextRTE);
			customizeCopyElement(context, copyElementTag, copyTextRTEValue);
			adapter.customizeCopyElement(context, copyElementTag);
			poaElement.addContent(copyElementTag);
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	@Deprecated
	protected Element customizeCopyElement(Context context, Element copyElementTag, String copyTextRTE){
		Element contentCopyTextElement = new Element(AWLXMLElement.CONTENT_DATA.getName());
		contentCopyTextElement.setText(copyTextRTE);
		copyElementTag.addContent(contentCopyTextElement);
		return contentCopyTextElement;
	}

	@Deprecated
	protected void customizeArtworkElementAttributes(Context context, Element artworkElementTag, Map artworkElementMap,Map masterInstanceMap, Map<String, String> langWithSeq) throws FrameworkException 
	{
		try
		{
			String instanceSEQ= (String)masterInstanceMap.get(currentArtworkElement.getArtworkMaster(context).getObjectId(context));
			artworkElementTag.setAttribute(AWLXMLAttribute.INSTANCE_SEQUENCE.getName(), instanceSEQ);
			//artworkElementTag.setAttribute(AWLXMLAttribute.LOCALE_SEQUENCE.getName(), localeSeqVal);
			//artworkElementTag.setAttribute(AWLXMLAttribute.APPROVED.getName(), isApproved);
			artworkElementTag.setAttribute(AWLXMLAttribute.TYPE.getName(), currentArtworkElement.getGS1Type(context));
			artworkElementTag.setAttribute(AWLXMLAttribute.TEXT_NOTE.getName(), currentArtworkElement.getDisplayName(context));
		} catch (Exception e) { throw new FrameworkException(e); }
	}

	
	@Deprecated
	protected void createGraphicsElement(Context context, Element poaElement, Map graphicElement,Map masterInstanceMap, Map<String, String> langWithSeq) throws FrameworkException {
		try
		{
			Element graphicElementTag = new Element(AWLXMLElement.GRAPHIC.getName());
			customizeArtworkElementAttributes(context, graphicElementTag, graphicElement,masterInstanceMap, langWithSeq);
			String graphicElementImageURL = AWLUtil.strcat((String)AWLObjectBase_mxJPO.invokeLocal(context, "emxMailUtil", null, "getBaseURL", new String[]{}, String.class) , "?objectId=", graphicElement.get(DomainConstants.SELECT_ID));
			
			graphicElementTag.setAttribute(AWLXMLAttribute.REF_URI.getName(), graphicElementImageURL);		
			adapter.customizeGraphicElement(context, graphicElementTag);
			poaElement.addContent(graphicElementTag);
		} catch (Exception e) { throw new FrameworkException(e); }
		
	}

	/**
	 ** @deprecated - Its depricated as part of GS1 XML because no where used this API.
	 */
	@SuppressWarnings({"PMD.AvoidCatchingThrowable"})
	public String createArtworkAssemblyXMLFormatFile(Context context, String[] args) throws FrameworkException
	{
		/*try{
			if(args.length == 0)
				throw new IllegalArgumentException();

            //args[0] will be parentId we are not using this parameter   
			String strDirectoryName = null;
			String strFileName= null;
			try {
				strDirectoryName = args[1];
				strFileName = args[2];
			} catch (Exception e) {
				strDirectoryName = AWLConstants.EMPTY_STRING;
				strFileName= AWLConstants.EMPTY_STRING;
			}

			init(context, args);
			Document document = createArtworkAssembly(context);

			if(BusinessUtil.isNullOrEmpty(strDirectoryName) || BusinessUtil.isNullOrEmpty(strFileName))
				throw new RuntimeException("Directory and File Name are empty");

			String poaFileName = AWLUtil.strcat(currentPOA.getName(context), "_", currentPOA.getInfo(context, DomainConstants.SELECT_CURRENT));
			strFileName = BusinessUtil.isNullOrEmpty(strFileName) ? poaFileName : strFileName.replaceAll(".xml", AWLConstants.EMPTY_STRING);

			java.io.File srcXMLFile  = new java.io.File(strDirectoryName, AWLUtil.strcat(strFileName, ".xml"));
			java.io.BufferedWriter buf = new java.io.BufferedWriter(new java.io.FileWriter(srcXMLFile));
			XMLOutputter outputter = new XMLOutputter();
			outputter.output(document, buf);
			buf.close();

			return AWLUtil.getXMLOutputterOutputString(context, document);
		} catch (Exception e) { throw new FrameworkException(e); }*/
		throw new FrameworkException("API Usage Error: API is not supported in V6R2017x");
	}

}
