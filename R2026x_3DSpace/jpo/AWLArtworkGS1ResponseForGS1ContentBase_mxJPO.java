import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import com.matrixone.apps.awl.enumeration.AWLXMLAttribute;
import com.matrixone.apps.awl.enumeration.AWLXMLElement;
import com.matrixone.apps.awl.enumeration.AWLXMLPropertyKey;
import com.matrixone.apps.awl.gs1assembly.GS1ArtworkContent;
import com.matrixone.apps.awl.gs1assembly.GS1Assembly;
import com.matrixone.apps.awl.gs1assembly.GS1POA;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.jdom.Element;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;

public class AWLArtworkGS1ResponseForGS1ContentBase_mxJPO extends AWLArtworkContentGS1Response_mxJPO {

	private GS1Assembly gs1ContentAssembly = null;
	private GS1POA gs1ContentPOA = null;
	
	public AWLArtworkGS1ResponseForGS1ContentBase_mxJPO(Context context, String[] args) throws Exception {
		super(context, args);
	}

	@SuppressWarnings("rawtypes")
	@Override
	protected void init(Context context, String[] args) throws FrameworkException {
		try {
			HashMap argsMap = JPO.unpackArgs(args);
			initAdaptar(context, argsMap);
			contentElements = getPOAArtworkElements(context,argsMap);
		} catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e.toString());
		} 
	}
	
	@SuppressWarnings("rawtypes")
	private void initAdaptar(Context context, HashMap argsMap) throws MatrixException {
		adapter = getAdapter(context);
		
		poaFolderPath = argsMap.get("poaName").toString();
		adapter.setPOAFolderPath(context, poaFolderPath);
		
		gs1ContentAssembly = (GS1Assembly) argsMap.get("gs1ContentAssembly");
		((AWLXMLCustGS1ResponseForGS1Content_mxJPO)adapter).setGS1ContentAssembly(gs1ContentAssembly);
		
		gs1ContentPOA = (GS1POA) argsMap.get("gs1ContentPOA");
		((AWLXMLCustGS1ResponseForGS1Content_mxJPO)adapter).setGS1ContentPOAElement(gs1ContentPOA);
	}
	
	/**
	 * API used to initialize adapter class.
	 * Adapter class configured with the below property "emxAWL.ExportGS1ResponseFromXML.AdapterClass"
	 */
	@Override
	protected AWLXMLCustomizationGS1ResponseBase_mxJPO getAdapter(Context context) throws MatrixException {
		try {
			String adapterClassName = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.ExportGS1ResponseFromXML.AdapterClass");
			return (AWLXMLCustomizationGS1ResponseBase_mxJPO) AWLObject_mxJPO.newInstanceOfJPO(context, adapterClassName);
		} catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	
	@Override
	protected Element createContentElement(Context context) throws FrameworkException
	{
		try
		{
			Element contentElement = new Element(AWLXMLElement.CONTENT.getName());
			Map<String, String> poaArtworkPackageInfo = gs1ContentPOA.getPOAArtworkPackageInfo();
			
			String creationTimeDate = poaArtworkPackageInfo.get(AWLXMLAttribute.TIME_STAMP.getName());
			if(BusinessUtil.isNullOrEmpty(creationTimeDate)) {
				SimpleDateFormat defaultAWLGS1DateFormat = adapter.getDateTimeFormat(context, AWLXMLPropertyKey.DEFAULT_AWLGS1_DATE_FORMAT.getValue(context));
				creationTimeDate = defaultAWLGS1DateFormat.format(new Date());
			}
			contentElement.setAttribute(AWLXMLAttribute.TIME_STAMP.getName(), creationTimeDate);
			
			String projectId = poaArtworkPackageInfo.get(AWLXMLAttribute.PROJECT_ID.getName());
			if(BusinessUtil.isNullOrEmpty(projectId)) {
				projectId = AWLXMLPropertyKey.DEFAULT_ARTPKG_PROJECT_ID.getValue(context);
			}
			contentElement.setAttribute(AWLXMLAttribute.PROJECT_ID.getName(), projectId);
			String description = poaArtworkPackageInfo.get(AWLXMLAttribute.PROJECT_NAME.getName());
			if(BusinessUtil.isNullOrEmpty(description))
				description= "NA";
			contentElement.setAttribute(AWLXMLAttribute.PROJECT_NAME.getName(), description);

			return contentElement;
		} catch (Exception e) { throw new FrameworkException(e); }
	}
	
	@Override
	protected Element createPOAElement(Context context) throws FrameworkException {
		try
		{
			Element poaElementTag = new Element(AWLXMLElement.POA.getName());
			String poaName = gs1ContentPOA.getPOAName();
			poaElementTag.setAttribute(AWLXMLAttribute.ID.getName(), poaName);
			adapter.customizePOAElement(context, poaElementTag);
			createLocaleElement(context, poaElementTag);
			if(contentElements != null) { 
				for(GS1ArtworkContent gs1ArtworkContent : contentElements) {
					((AWLXMLCustGS1ResponseForGS1Content_mxJPO)adapter).setCurrentGS1ArtworkContent(gs1ArtworkContent);
					if(gs1ArtworkContent.isGraphic()) {
						createGraphicsElement(context, poaElementTag, gs1ArtworkContent);
					}
					else if(gs1ArtworkContent.isStructure()) {
						createStructureCopyElement(context, poaElementTag, gs1ArtworkContent);
					} else {
						createCopyElement(context, poaElementTag, gs1ArtworkContent);
					}
				}
			}
			return poaElementTag;
		} catch(Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}
	
	@Override
	protected Map<String, String> createLocaleElement(Context context, Element poaElementTag) throws FrameworkException {
		Map<String, String> poaLocale =  gs1ContentPOA.getArtworkContentLocale();
				
		Map<Integer, String> formattedLocale = new TreeMap<>();
		for (Map.Entry<String, String> entry : gs1ContentPOA.getArtworkContentLocale().entrySet()) {
			formattedLocale.put(Integer.parseInt(entry.getKey()), entry.getValue());
		}
		
		formattedLocale.forEach((seqNumber, seqIdentifier)->{
			  Element locale = new Element(AWLXMLElement.LOCALE.getName());
			  locale.setAttribute(AWLXMLAttribute.SEQUENCE.getName(), String.valueOf(seqNumber));
			  locale.setAttribute(AWLXMLAttribute.ID.getName(), seqIdentifier);
			  poaElementTag.addContent(locale);
		});
		return poaLocale;
	}
	
	@Override
	protected void createGraphicsElement(Context context, Element poaElementTag, GS1ArtworkContent gs1ArtworkContent) throws FrameworkException {
		try{
			Element graphicElementTag = new Element(AWLXMLElement.GRAPHIC.getName());
			customizeArtworkElementAttributes(gs1ArtworkContent, graphicElementTag);
			
			((AWLXMLCustomizationGS1Response_mxJPO)adapter).customizeGraphicElement(context, graphicElementTag,gs1ArtworkContent);
			poaElementTag.addContent(graphicElementTag);
		}catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e.getMessage());
		}
	}
}
