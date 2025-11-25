import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.matrixone.apps.awl.enumeration.AWLXMLAttribute;
import com.matrixone.apps.awl.enumeration.AWLXMLElement;
import com.matrixone.apps.awl.enumeration.AWLXMLPropertyKey;
import com.matrixone.apps.awl.gs1assembly.GS1ArtworkContent;
import com.matrixone.apps.awl.util.AWLPropertyUtil;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.jdom.Element;

import matrix.db.Context;
import matrix.util.MatrixException;

public class AWLArtworkContentGS1ResponseBase_mxJPO extends AWLArtworkAssemblyExportBase_mxJPO {

	public AWLArtworkContentGS1ResponseBase_mxJPO(Context context, String[] args) throws Exception {
		super(context, args);
	}

	protected List<GS1ArtworkContent> getPOAArtworkElements(Context context, HashMap argsMap) throws MatrixException
	{
		return (ArrayList<GS1ArtworkContent>) argsMap.get("poaElements");
	}

	protected AWLXMLCustomizationGS1ResponseBase_mxJPO getAdapter(Context context) throws MatrixException {
		try {
			String adapterClassName = AWLPropertyUtil.getConfigPropertyString(context,
					"emxAWL.ExportGS1Response.AdapterClass");
			return (AWLXMLCustomizationGS1ResponseBase_mxJPO) AWLObject_mxJPO.newInstanceOfJPO(context,
					adapterClassName);
		} catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e);
		}
	}

	// wx7
	protected void createCopyElement(Context context, Element poaElementTag, GS1ArtworkContent as)
			throws FrameworkException {
		Element copyElementTag = new Element(AWLXMLElement.COPY.getName());
		customizeArtworkElementAttributes(as, copyElementTag);
		Element contentCopyTextElement = new Element(AWLXMLElement.CONTENT_DATA.getName());
		contentCopyTextElement.setText(as.getRTEContent());
		copyElementTag.addContent(contentCopyTextElement);
		((AWLXMLCustomizationGS1ResponseBase_mxJPO)adapter).customizeCopyElement(context, copyElementTag, as);
		poaElementTag.addContent(copyElementTag);
	}
	
	protected void createGraphicsElement(Context context, Element poaElementTag, GS1ArtworkContent as) throws FrameworkException {
		try{
			Element graphicElementTag = new Element(AWLXMLElement.GRAPHIC.getName());
			customizeArtworkElementAttributes(as,graphicElementTag);
			String graphicElementImageURL = AWLUtil.strcat((String)AWLObjectBase_mxJPO.invokeLocal(context, "emxMailUtil", null, "getBaseURL", new String[]{}, String.class) , "?objectId=", as.getObjectId());
			graphicElementTag.setAttribute(AWLXMLAttribute.REF_URI.getName(), graphicElementImageURL);
			((AWLXMLCustomizationGS1ResponseBase_mxJPO)adapter).customizeGraphicElement(context, graphicElementTag,as);
			poaElementTag.addContent(graphicElementTag);
		}catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e.getMessage());
		}
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
		((AWLXMLCustomizationGS1ResponseBase_mxJPO)adapter).customizeStructureElement(context, structureElement,as);
		poaElementTag.addContent(structureElement);
	}
}
