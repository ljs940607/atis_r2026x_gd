import java.io.IOException;
import java.io.StringReader;

import com.matrixone.apps.awl.enumeration.AWLXMLAttribute;
import com.matrixone.apps.awl.enumeration.AWLXMLPropertyKey;
import com.matrixone.apps.awl.gs1assembly.GS1ArtworkContent;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.jdom.Document;
import com.matrixone.jdom.Element;
import com.matrixone.jdom.JDOMException;
import com.matrixone.jdom.input.SAXBuilder;

import matrix.db.Context;

public class AWLXMLCustomizationGS1ResponseBase_mxJPO extends AWLXMLCustomizationGS1Base_mxJPO {
	
	public AWLXMLCustomizationGS1ResponseBase_mxJPO(Context context, String[] args) throws Exception {
	}
	
	@Override
	public Document getTransformDocument(Context context) throws FrameworkException
	{
        Document doc = null;

        SAXBuilder sb = new SAXBuilder();

        try {
        	String xslStream = MqlUtil.mqlCommand(context, "print page $1 select $2 dump", "awl2gs1Response.xsl", "content");
        	doc = sb.build(new StringReader(xslStream));
        	
        } catch (JDOMException e) {
            e.printStackTrace();
        }
        catch (IOException e)  {
            e.printStackTrace();
        }
        
        return doc;
	}
	
	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizeCopyElement(context, com.matrixone.jdom.Element)
	 */
	public void customizeCopyElement(Context context, Element copyElement,GS1ArtworkContent as) throws FrameworkException {
		

		copyElement.setAttribute(AWLXMLAttribute.FOR_PLACEMENT_ONLY.getName(), AWLXMLPropertyKey.FOR_PLACEMENT_ONLY.getValue(context));
		copyElement.setAttribute(AWLXMLAttribute.AGENCY_CODE.getName(), AWLXMLPropertyKey.AGENCY_CODE.getValue(context));
		copyElement.setAttribute(AWLXMLAttribute.CODE_LIST_NAME.getName(), AWLXMLPropertyKey.CODE_LIST_NAME.getValue(context));
		copyElement.setAttribute(AWLXMLAttribute.CODE_LIST_URI.getName(), AWLXMLPropertyKey.CODE_LIST_URI.getValue(context));
		copyElement.setAttribute(AWLXMLAttribute.CODE_LIST_VERSION.getName(), AWLXMLPropertyKey.CODE_LIST_VERSION.getValue(context));
		copyElement.setAttribute(AWLXMLAttribute.LANGUAGE_CODE.getName(), AWLXMLPropertyKey.LANGUAGE_CODE.getValue(context));
		copyElement.setAttribute(AWLXMLAttribute.SOURCE_REF.getName(), AWLXMLPropertyKey.SOURCE_REFERENCE.getValue(context));


		appendContentResponseStatus(copyElement,as);
	}

	private void appendContentResponseStatus(Element copyElement,GS1ArtworkContent as) {
		copyElement.setAttribute(AWLXMLAttribute.CHANGED_BY_REC.getName(), as.isChangedByRecipient() ? "true" : "false");
	}

	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizeGraphicsElement(context, com.matrixone.jdom.Element)
	 */
	public void customizeGraphicElement(Context context, Element graphicsElement,GS1ArtworkContent as) throws FrameworkException{
		try{
			//super.customizeGraphicElement(context, graphicsElement);
			//super class will create the graphic id, It'll not be present for response
			graphicsElement.setAttribute(AWLXMLAttribute.SOURCE_NAME.getName(), "");

			graphicsElement.setAttribute(AWLXMLAttribute.REF_IDENITFIER.getName(), "");
			appendContentResponseStatus(graphicsElement,as);
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	public void customizeStructureElement(Context context, Element structureElement,GS1ArtworkContent as) throws FrameworkException {
		structureElement.setAttribute(AWLXMLAttribute.AGENCY_CODE.getName(), AWLXMLPropertyKey.AGENCY_CODE.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_NAME.getName(), AWLXMLPropertyKey.CODE_LIST_NAME.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_URI.getName(), AWLXMLPropertyKey.CODE_LIST_URI.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_VERSION.getName(), AWLXMLPropertyKey.CODE_LIST_VERSION.getValue(context));
		
		appendContentResponseStatus(structureElement,as);
	}
}
