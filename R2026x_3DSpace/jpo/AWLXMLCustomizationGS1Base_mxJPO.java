/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import matrix.db.Context;
import matrix.util.StringList;

import com.matrixone.apps.awl.dao.AWLObject;
import com.matrixone.apps.awl.dao.GraphicsElement;
import com.matrixone.apps.awl.enumeration.AWLAttribute;
import com.matrixone.apps.awl.enumeration.AWLRel;
import com.matrixone.apps.awl.enumeration.AWLXMLAttribute;
import com.matrixone.apps.awl.enumeration.AWLXMLElement;
import com.matrixone.apps.awl.enumeration.AWLXMLPropertyKey;
import com.matrixone.apps.awl.util.AWLConstants;
import com.matrixone.apps.awl.util.AWLUtil;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.common.Company;
import com.matrixone.apps.common.Person;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.jdom.Document;
import com.matrixone.jdom.Element;
import com.matrixone.jdom.JDOMException;
import com.matrixone.jdom.input.SAXBuilder;

/**
 * @author RIS
 *
 */
@SuppressWarnings("PMD.TooManyMethods")
public class AWLXMLCustomizationGS1Base_mxJPO extends AWLXMLCustomizationBaseAdapter_mxJPO {
	
	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizeRootElement(context, com.matrixone.jdom.Element)
	 */
	public void customizeRootElement(Context context, Element awlRootTag) throws FrameworkException {
		try{
			awlRootTag.addContent(createSenderElement(context));
			awlRootTag.addContent(createRecevierElement(context));
			
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	@SuppressWarnings("rawtypes")
	protected Element createSenderElement(Context context) throws FrameworkException{
        Company company = Person.getPerson(context, context.getUser()).getCompany(context);
        
        String sFaxSelect = AWLAttribute.ORGANIZATION_FAX_NUMBER.getSel(context);
        String sTelNumberSelect = AWLAttribute.ORGANIZATION_PHONE_NUMBER.getSel(context);
        Map mCompanyDetails = company.getInfo(context, BusinessUtil.toStringList(DomainConstants.SELECT_NAME, DomainConstants.ATTRIBUTE_TITLE,sFaxSelect,sTelNumberSelect));
        
		Element senderElement = new Element(AWLXMLElement.SENDER.getName());
		senderElement.setAttribute(AWLXMLAttribute.AUTHORITY.getName(), AWLXMLPropertyKey.AUTHORITY.getValue(context));
		String contactName = BusinessUtil.isNullOrEmpty((String)mCompanyDetails.get(DomainConstants.ATTRIBUTE_TITLE))? (String)mCompanyDetails.get(DomainConstants.SELECT_NAME): (String)mCompanyDetails.get(DomainConstants.ATTRIBUTE_TITLE); 
		senderElement.setAttribute(AWLXMLAttribute.CONTACT.getName(), contactName);
		senderElement.setAttribute(AWLXMLAttribute.EMAIL_ADDRESS.getName(), AWLConstants.EMPTY_STRING);
		senderElement.setAttribute(AWLXMLAttribute.FAX_NUMBER.getName(), (String)mCompanyDetails.get(sFaxSelect));
		senderElement.setAttribute(AWLXMLAttribute.TEL_NUMBER.getName(), (String)mCompanyDetails.get(sTelNumberSelect));
		senderElement.setAttribute(AWLXMLAttribute.CONTACT_TYPE_ID.getName(), AWLXMLPropertyKey.SENDER_TYPE_IDENTIFIER.getValue(context));
		
		return senderElement;
	}
	
	protected Element createRecevierElement(Context context) throws FrameworkException {
		
		String emailIdSel = AWLUtil.strcat("from[", AWLRel.ORGANIZATION_REPRESENTATIVE.get(context), "].to.", AWLAttribute.EMAIL_ID.getSel(context));
		String repState = AWLUtil.strcat("from[", AWLRel.ORGANIZATION_REPRESENTATIVE.get(context), "].to.", DomainConstants.SELECT_CURRENT);
		StringList selectables = BusinessUtil.toStringList(DomainConstants.SELECT_ATTRIBUTE_TITLE,DomainConstants.ATTRIBUTE_TITLE, AWLAttribute.ORGANIZATION_FAX_NUMBER.getSel(context),
				   											AWLAttribute.ORGANIZATION_PHONE_NUMBER.getSel(context), emailIdSel, repState);
		MapList mlSuppliers = currentPOA.getSuppliers(context, selectables);
		
		String supName = "";
		String supEmailAdd = "";
		String supFaxNum = "";
		String supTelNum = "";
		
		if(!mlSuppliers.isEmpty()){
			Map mapSupplier = (Map)mlSuppliers.get(0);
			
			supName = (String)mapSupplier.get(DomainConstants.ATTRIBUTE_TITLE);
			if(UIUtil.isNullOrEmpty(supName)) {
				supName = (String)mapSupplier.get(DomainConstants.SELECT_ATTRIBUTE_TITLE);
			}
			
			supFaxNum = (String)mapSupplier.get(AWLAttribute.ORGANIZATION_FAX_NUMBER.getSel(context));
			supTelNum = (String)mapSupplier.get(AWLAttribute.ORGANIZATION_PHONE_NUMBER.getSel(context));
			 
			StringList mailIdList = BusinessUtil.getStringList(mapSupplier, emailIdSel);
			StringList stateList = BusinessUtil.getStringList(mapSupplier, repState);
			for(int i=0; i<stateList.size(); i++){
				if(stateList.get(i).equals("Active")){
					supEmailAdd = (String)mailIdList.get(i);
					break;
				}
			}
		}
		
		Element recevierElement = new Element(AWLXMLElement.RECEIVER.getName());
		recevierElement.setAttribute(AWLXMLAttribute.AUTHORITY.getName(), AWLXMLPropertyKey.AUTHORITY.getValue(context));
		recevierElement.setAttribute(AWLXMLAttribute.CONTACT.getName(), supName);
		recevierElement.setAttribute(AWLXMLAttribute.EMAIL_ADDRESS.getName(), supEmailAdd);
		recevierElement.setAttribute(AWLXMLAttribute.FAX_NUMBER.getName(), supFaxNum);
		recevierElement.setAttribute(AWLXMLAttribute.TEL_NUMBER.getName(), supTelNum);
		recevierElement.setAttribute(AWLXMLAttribute.CONTACT_TYPE_ID.getName(), AWLXMLPropertyKey.RECIVER_TYPE_IDENTIFIER.getValue(context));
		
		return recevierElement;
	}
	
	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizeDOCElement(context, com.matrixone.jdom.Element)
	 */
	public void customizeDOCElement(Context context, Element documentTag) throws FrameworkException {
		try{
			documentTag.setAttribute(AWLXMLAttribute.STANDARD.getName(), AWLXMLPropertyKey.AUTHORITY.getValue(context));
			documentTag.setAttribute(AWLXMLAttribute.DOC_TYPE_VERSION.getName(), AWLXMLPropertyKey.DOC_TYPE_VERSION.getValue(context));
			documentTag.setAttribute(AWLXMLAttribute.INSTANCE_ID.getName(), AWLXMLPropertyKey.DOC_INSTANCE_IDENTIFIER.getValue(context));
			documentTag.setAttribute(AWLXMLAttribute.DOC_MULTIPLE_TYPE.getName(), AWLXMLPropertyKey.DOC_MULTIPLE_TYPE.getValue(context));
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	

	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizePOAElement(context, com.matrixone.jdom.Element)
	 */
	@SuppressWarnings("rawtypes")
	public void customizePOAElement(Context context, Element poaElement) throws FrameworkException
	{
		try{
			String sArtworkTemplateSelect = AWLUtil.strcat("from[",AWLRel.ASSOCIATED_ARTWORK_TEMPLATE.get(context),"].to.id");
			StringList slSelects = BusinessUtil.toStringList(DomainConstants.SELECT_ORIGINATED,sArtworkTemplateSelect);
			
			
			Map mPOADetails= currentPOA.getInfo(context, slSelects);
			Date creationDate = eMatrixDateFormat.getJavaDate((String)mPOADetails.get(DomainConstants.SELECT_ORIGINATED));
			SimpleDateFormat defaultAWLGS1DateFormat = getDateTimeFormat(context, AWLXMLPropertyKey.DEFAULT_AWLGS1_DATE_FORMAT.getValue(context));
			
			poaElement.setAttribute(AWLXMLAttribute.VERSION_ID.getName(), currentPOA.getInfo(context, DomainConstants.SELECT_REVISION));
			//poaElement.setAttribute(AWLXMLAttribute.VERSION_TIME.getName(), defaultEnoviaDateFormat.format(creationDate));
			poaElement.setAttribute(AWLXMLAttribute.VERSION_TIME.getName(), defaultAWLGS1DateFormat.format(creationDate));
			poaElement.setAttribute(AWLXMLAttribute.POA_DESCRIPTION.getName(), currentPOA.getDescription(context));
			poaElement.setAttribute(AWLXMLAttribute.LANGUAGE_CODE.getName(), AWLXMLPropertyKey.LANGUAGE_CODE.getValue(context));		
			poaElement.setAttribute(AWLXMLAttribute.POA_GROUP_ID.getName(), artworkPackage.getName(context));
			String description = artworkPackage.getDescription(context);
			if(description.isEmpty())
				description = "NA";
			poaElement.setAttribute(AWLXMLAttribute.PACKING_COMP_DESC.getName(), description);
			poaElement.setAttribute(AWLXMLAttribute.CONTENT_OWNER.getName(), currentPOA.getOwner(context).toString());
			poaElement.setAttribute(AWLXMLAttribute.OWNER_GLN.getName(), AWLXMLPropertyKey.POA_CONTENTOWNER_GLN.getValue(context));
			
			//Artwork Template Details
			String sArtworkTemplateID = (String)mPOADetails.get(sArtworkTemplateSelect);
			if(BusinessUtil.isNotNullOrEmpty(sArtworkTemplateID)) {
				slSelects = BusinessUtil.toStringList(DomainConstants.SELECT_NAME,AWLAttribute.TITLE.getSel(context), DomainConstants.SELECT_ORIGINATED,DomainConstants.SELECT_REVISION);
				Map mArtworkTemplateDetails = BusinessUtil.getInfo(context, sArtworkTemplateID, slSelects);
				
				String sArtworkTemplateURL = AWLUtil.strcat((String)AWLObjectBase_mxJPO.invokeLocal(context, "emxMailUtil", null, "getBaseURL", new String[]{}, String.class) , "?objectId=", sArtworkTemplateID);
				poaElement.setAttribute(AWLXMLAttribute.ARTWORK_TEMPLATE_NAME.getName(), (String)mArtworkTemplateDetails.get(DomainConstants.SELECT_NAME));
				poaElement.setAttribute(AWLXMLAttribute.ARTWORK_TEMPLATE_TITLE.getName(), (String)mArtworkTemplateDetails.get(AWLAttribute.TITLE.getSel(context)));
				poaElement.setAttribute(AWLXMLAttribute.ARTWORK_TEMPLATE_URI.getName(), sArtworkTemplateURL);
				poaElement.setAttribute(AWLXMLAttribute.ARTWORK_TEMPLATE_REVISION.getName(), (String)mArtworkTemplateDetails.get(DomainConstants.SELECT_REVISION));
				//Originated Time
				creationDate = eMatrixDateFormat.getJavaDate((String)mArtworkTemplateDetails.get(DomainConstants.SELECT_ORIGINATED));
				poaElement.setAttribute(AWLXMLAttribute.ARTWORK_TEMPLATE_ORIGINATED.getName(), defaultAWLGS1DateFormat.format(creationDate));
				
			}
			
		}
		catch(Exception e){ throw new FrameworkException(e);}
	}

	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizeLocaleElement(context, com.matrixone.jdom.Element)
	 */
	@Deprecated
	public void customizeLocaleElement(Context context, Element localeElemj) throws FrameworkException
	{
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizeCopyElement(context, com.matrixone.jdom.Element)
	 */
	public void customizeCopyElement(Context context, Element copyElement) throws FrameworkException
	{
		try{
				String creationTimeDate = currentArtworkElement.getInfo(context, DomainConstants.SELECT_ORIGINATED);
				Date creationDate = eMatrixDateFormat.getJavaDate(creationTimeDate);
				SimpleDateFormat defaultAWLGS1DateFormat = getDateTimeFormat(context, AWLXMLPropertyKey.DEFAULT_AWLGS1_DATE_FORMAT.getValue(context));
				
				copyElement.setAttribute(AWLXMLAttribute.FOR_PLACEMENT_ONLY.getName(), AWLXMLPropertyKey.FOR_PLACEMENT_ONLY.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.AGENCY_CODE.getName(), AWLXMLPropertyKey.AGENCY_CODE.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.CODE_LIST_NAME.getName(), AWLXMLPropertyKey.CODE_LIST_NAME.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.CODE_LIST_URI.getName(), AWLXMLPropertyKey.CODE_LIST_URI.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.CODE_LIST_VERSION.getName(), AWLXMLPropertyKey.CODE_LIST_VERSION.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.LANGUAGE_CODE.getName(), AWLXMLPropertyKey.LANGUAGE_CODE.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.OPTION_SEQUENCE.getName(), AWLXMLPropertyKey.COPY_OPTION_SEQUENCE.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.PRIORITY_SEQUENCE.getName(), AWLXMLPropertyKey.COPY_PRIORITY_SEQUENCE.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.SOURCE_REF.getName(), AWLXMLPropertyKey.SOURCE_REFERENCE.getValue(context));
				copyElement.setAttribute(AWLXMLAttribute.VERSION_TIME.getName(), defaultAWLGS1DateFormat.format(creationDate));
		} catch(Exception e) { throw new FrameworkException(e);}
	}
	
	
	@Override
	public void customizeStructureElement(Context context, Element structureElement) throws FrameworkException {
		structureElement.setAttribute(AWLXMLAttribute.AGENCY_CODE.getName(), AWLXMLPropertyKey.AGENCY_CODE.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_NAME.getName(), AWLXMLPropertyKey.CODE_LIST_NAME.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_URI.getName(), AWLXMLPropertyKey.CODE_LIST_URI.getValue(context));
		structureElement.setAttribute(AWLXMLAttribute.CODE_LIST_VERSION.getName(), AWLXMLPropertyKey.CODE_LIST_VERSION.getValue(context));
	}

	/* (non-Javadoc)
	 * @see AWLXMLCustomization#customizeGraphicsElement(context, com.matrixone.jdom.Element)
	 */
	@SuppressWarnings("rawtypes")
	public void customizeGraphicElement(Context context, Element graphicsElement) throws FrameworkException{
		try{
			GraphicsElement graphicElement = (GraphicsElement)currentArtworkElement;
			String imageHolder = AWLObject.getImageHolderId(context, graphicElement.getGraphicDocument(context).getObjectId(context));
			Map mGraphicElementInfo = graphicElement.getInfo(context, BusinessUtil.toStringList(DomainConstants.SELECT_ORIGINATED,DomainConstants.SELECT_DESCRIPTION));
			if(BusinessUtil.isNotNullOrEmpty(imageHolder)) {
			
			DomainObject doImageholder = new DomainObject(imageHolder);
			String graphicDocPrimaryImageName = doImageholder.getInfo(context, AWLAttribute.PRIMARY_IMAGE.getSel(context));
			
			String graphicImagaPath = AWLUtil.strcat(poaFolderPath,  File.separator, graphicElement.getName(context), File.separator, graphicDocPrimaryImageName);
			graphicsElement.setAttribute(AWLXMLAttribute.REF_IDENITFIER.getName(), graphicImagaPath);	
			if(BusinessUtil.isNotNullOrEmpty(poaFolderPath))
				graphicsElement.setAttribute(AWLXMLAttribute.SOURCE_NAME.getName(), graphicDocPrimaryImageName);
			}
			
			
			graphicsElement.setAttribute(AWLXMLAttribute.FOR_PLACEMENT_ONLY.getName(), AWLXMLPropertyKey.FOR_PLACEMENT_ONLY.getValue(context));
			graphicsElement.setAttribute(AWLXMLAttribute.GRAPHIC_ELEMENT_DESCRIPTION.getName(), (String)mGraphicElementInfo.get(DomainConstants.SELECT_DESCRIPTION));
			graphicsElement.setAttribute(AWLXMLAttribute.LANGUAGE_CODE.getName(), AWLXMLPropertyKey.LANGUAGE_CODE.getValue(context));
			graphicsElement.setAttribute(AWLXMLAttribute.OPTION_SEQUENCE.getName(), AWLXMLPropertyKey.GRAPHIC_OPTION_SEQUENCE.getValue(context));
			graphicsElement.setAttribute(AWLXMLAttribute.PRIORITY_SEQUENCE.getName(), AWLXMLPropertyKey.GRAPHIC_PRIORITY_SEQUENCE.getValue(context));
			
			String creationTimeDate = (String) mGraphicElementInfo.get(DomainConstants.SELECT_ORIGINATED);
			Date creationDate = eMatrixDateFormat.getJavaDate(creationTimeDate);
			SimpleDateFormat defaultAWLGS1DateFormat = getDateTimeFormat(context, AWLXMLPropertyKey.DEFAULT_AWLGS1_DATE_FORMAT.getValue(context));
			graphicsElement.setAttribute(AWLXMLAttribute.VERSION_TIME.getName(), defaultAWLGS1DateFormat.format(creationDate));
			
		}catch(Exception e){ throw new FrameworkException(e);}
	}

	@Override
	public void customizeContentElement(Context context, Element contentTag) throws FrameworkException
	{
		contentTag.setAttribute(AWLXMLAttribute.DOC_STATUS_CODE.getName(), AWLXMLPropertyKey.DOC_STATUS_CODE.getValue(context));
		contentTag.setAttribute(AWLXMLAttribute.DOC_ACTION_CODE.getName(), AWLXMLPropertyKey.DOC_ACTION_CODE.getValue(context));
		contentTag.setAttribute(AWLXMLAttribute.DOC_STRUCTURE_VERSION.getName(), AWLXMLPropertyKey.DOC_STRUCTURE_VERSION.getValue(context));
		//artworkcontentIdentification Details
		contentTag.setAttribute(AWLXMLAttribute.ENTITY_ID.getName(), AWLXMLPropertyKey.DEFAULT_ENTITY_IDENTIFICATION.getValue(context));
		contentTag.setAttribute(AWLXMLAttribute.SOURCE_GLN.getName(), AWLXMLPropertyKey.DEFAULT_SOURCE_GLN.getValue(context));
		contentTag.setAttribute(AWLXMLAttribute.SOURCE_NAME.getName(), AWLXMLPropertyKey.DEFAULT_SOURCE_NAME.getValue(context));
		contentTag.setAttribute(AWLXMLAttribute.RECEIVER_GLN.getName(), AWLXMLPropertyKey.DEFAULT_RECEIVER_GLN.getValue(context));
		contentTag.setAttribute(AWLXMLAttribute.RECEIVER_NAME.getName(), AWLXMLPropertyKey.DEFAULT_RECEIVER_NAME.getValue(context));
	}

	@Override
	public Document getTransformDocument(Context context) throws FrameworkException
	{
        Document doc = null;

        SAXBuilder sb = new SAXBuilder();

        try {
        	
        	/*InputStream xslInputStream=Thread.currentThread().getContextClassLoader().getResourceAsStream("awl2gs1.xsl");
        	doc = sb.build(xslInputStream);
        	*/
        	/**/
        	String xslStream = MqlUtil.mqlCommand(context, "print page $1 select $2 dump", "awl2gs1.xsl", "content");
        	doc = sb.build(new StringReader(xslStream));
        	
        } catch (JDOMException e) {
            e.printStackTrace();
        }
        catch (IOException e)  {
            e.printStackTrace();
        }
        
        return doc;
	}
}
