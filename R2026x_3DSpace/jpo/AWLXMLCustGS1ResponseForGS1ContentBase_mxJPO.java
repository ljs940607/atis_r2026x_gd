import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import com.matrixone.apps.awl.enumeration.AWLXMLAttribute;
import com.matrixone.apps.awl.enumeration.AWLXMLElement;
import com.matrixone.apps.awl.enumeration.AWLXMLPropertyKey;
import com.matrixone.apps.awl.gs1assembly.GS1ArtworkContent;
import com.matrixone.apps.awl.gs1assembly.GS1Assembly;
import com.matrixone.apps.awl.gs1assembly.GS1POA;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.jdom.Element;

import matrix.db.Context;

public class AWLXMLCustGS1ResponseForGS1ContentBase_mxJPO extends AWLXMLCustomizationGS1Response_mxJPO {
	
	public AWLXMLCustGS1ResponseForGS1ContentBase_mxJPO(Context context, String[] args) throws Exception {
		super(context, args);
	}

	protected GS1Assembly gs1ContentAssembly;
	protected GS1POA gs1ContentPOAElement;
	protected GS1ArtworkContent currentGS1ArtworkContent;

	public void setGS1ContentAssembly(GS1Assembly gs1ContentAssembly) {
		this.gs1ContentAssembly = gs1ContentAssembly;
	}

	public void setGS1ContentPOAElement(GS1POA gs1ContentPOAElement) {
		this.gs1ContentPOAElement = gs1ContentPOAElement;
	}
	
	public void setCurrentGS1ArtworkContent(GS1ArtworkContent gs1ArtworkContent) {
		this.currentGS1ArtworkContent = gs1ArtworkContent;
	}

	@SuppressWarnings("unchecked")
	@Override
	protected Element createSenderElement(Context context) throws FrameworkException{
		
		Map<String, String> senderInfo =  (Map<String, String>) gs1ContentAssembly.getDocumentHeaderInfo().get(AWLXMLElement.SENDER.getName());
		if(senderInfo == null) {
			return super.createSenderElement(context);
		}
		return getDocumentContactElement(context, senderInfo, true);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	protected Element createRecevierElement(Context context) throws FrameworkException {
		
		Map<String, String> receiverInfo =  (Map<String, String>) gs1ContentAssembly.getDocumentHeaderInfo().get(AWLXMLElement.RECEIVER.getName());
		if(receiverInfo == null) {
			return super.createSenderElement(context);
		} 
		return getDocumentContactElement(context, receiverInfo, false);
	}
	
	private Element getDocumentContactElement(Context context, Map<String, String> contactInfo, boolean forSender) throws FrameworkException {
		
		String elementName = forSender?AWLXMLElement.RECEIVER.getName():AWLXMLElement.SENDER.getName();
		//SWAPING SENDER TO RECEIVER AND RECEIVER TO SENDER
		
		Element contactElement = new Element(elementName);
		String senderAuthority = contactInfo.get(AWLXMLAttribute.AUTHORITY.getName());
		senderAuthority = BusinessUtil.isNullOrEmpty(senderAuthority)? AWLXMLPropertyKey.AUTHORITY.getValue(context): senderAuthority;
		contactElement.setAttribute(AWLXMLAttribute.AUTHORITY.getName(), senderAuthority);
		
		String strContact = contactInfo.get(AWLXMLAttribute.CONTACT.getName());
		strContact = BusinessUtil.isNullOrEmpty(strContact)? "": strContact;
		contactElement.setAttribute(AWLXMLAttribute.CONTACT.getName(), strContact);
		
		String strEmail = contactInfo.get(AWLXMLAttribute.EMAIL_ADDRESS.getName());
		strEmail = BusinessUtil.isNullOrEmpty(strEmail)? "": strEmail;
		contactElement.setAttribute(AWLXMLAttribute.EMAIL_ADDRESS.getName(), strEmail);
		
		
		String strFax = contactInfo.get(AWLXMLAttribute.FAX_NUMBER.getName());
		strFax = BusinessUtil.isNullOrEmpty(strFax)? "": strFax;
		contactElement.setAttribute(AWLXMLAttribute.FAX_NUMBER.getName(), strFax);
		
		
		String strTelphone = contactInfo.get(AWLXMLAttribute.TEL_NUMBER.getName());
		strTelphone = BusinessUtil.isNullOrEmpty(strTelphone)? "": strTelphone;
		contactElement.setAttribute(AWLXMLAttribute.TEL_NUMBER.getName(), strTelphone);
		
		String senderTypeIdentifier = contactInfo.get(AWLXMLAttribute.CONTACT_TYPE_ID.getName());
		senderTypeIdentifier = BusinessUtil.isNullOrEmpty(senderTypeIdentifier)? AWLXMLPropertyKey.SENDER_TYPE_IDENTIFIER.getValue(context): senderTypeIdentifier;
		contactElement.setAttribute(AWLXMLAttribute.CONTACT_TYPE_ID.getName(), senderTypeIdentifier);
		
		return contactElement;
	}
	
	@Override
	public void customizeDOCElement(Context context, Element documentTag) throws FrameworkException {
		try{
			documentTag.setAttribute(AWLXMLAttribute.STANDARD.getName(), AWLXMLPropertyKey.AUTHORITY.getValue(context));
			documentTag.setAttribute(AWLXMLAttribute.DOC_TYPE_VERSION.getName(), AWLXMLPropertyKey.DOC_TYPE_VERSION.getValue(context));
			documentTag.setAttribute(AWLXMLAttribute.INSTANCE_ID.getName(), AWLXMLPropertyKey.DOC_INSTANCE_IDENTIFIER.getValue(context));
			documentTag.setAttribute(AWLXMLAttribute.DOC_MULTIPLE_TYPE.getName(), AWLXMLPropertyKey.DOC_MULTIPLE_TYPE.getValue(context));
		}catch(Exception e){ throw new FrameworkException(e);}
	}
	
	@Override
	public void customizePOAElement(Context context, Element poaElement) throws FrameworkException {
		
		Map<String, String> poaBasicInfo = gs1ContentPOAElement.getPOABasicInfo();
		
		String versionId = poaBasicInfo.get(AWLXMLAttribute.VERSION_ID.getName());
		if(BusinessUtil.isNullOrEmpty(versionId))
			versionId = AWLXMLPropertyKey.DEFAULT_POA_VERSION_ID.getValue(context);
		poaElement.setAttribute(AWLXMLAttribute.VERSION_ID.getName(), versionId);
		
		String versionTime = poaBasicInfo.get(AWLXMLAttribute.VERSION_TIME.getName());
		if(BusinessUtil.isNullOrEmpty(versionTime)) {
			SimpleDateFormat defaultAWLGS1DateFormat = getDateTimeFormat(context, AWLXMLPropertyKey.DEFAULT_AWLGS1_DATE_FORMAT.getValue(context));
			versionTime = defaultAWLGS1DateFormat.format(new Date());
		}
		poaElement.setAttribute(AWLXMLAttribute.VERSION_TIME.getName(), versionTime);
		
		String poaDescription = poaBasicInfo.get(AWLXMLAttribute.POA_DESCRIPTION.getName());
		poaDescription = BusinessUtil.isNullOrEmpty(poaDescription)? "NA": poaDescription;
		poaElement.setAttribute(AWLXMLAttribute.POA_DESCRIPTION.getName(), poaDescription);
		
		String poaOwner = poaBasicInfo.get(AWLXMLAttribute.CONTENT_OWNER.getName());
		poaOwner = BusinessUtil.isNullOrEmpty(poaOwner)? "DS ENOVIA": poaOwner;
		poaElement.setAttribute(AWLXMLAttribute.CONTENT_OWNER.getName(), poaOwner);
		
		poaElement.setAttribute(AWLXMLAttribute.OWNER_GLN.getName(), AWLXMLPropertyKey.POA_CONTENTOWNER_GLN.getValue(context));
		poaElement.setAttribute(AWLXMLAttribute.LANGUAGE_CODE.getName(), AWLXMLPropertyKey.LANGUAGE_CODE.getValue(context));
		
		
		String poaGroupId = poaBasicInfo.get(AWLXMLAttribute.POA_GROUP_ID.getName());
		if(BusinessUtil.isNullOrEmpty(poaGroupId))
			poaGroupId = AWLXMLPropertyKey.DEFAULT_POA_GROUP_ID.getValue(context);
		poaElement.setAttribute(AWLXMLAttribute.POA_GROUP_ID.getName(), poaGroupId);
		
		String packageDesc = poaBasicInfo.get(AWLXMLAttribute.PACKING_COMP_DESC.getName());
		String description = BusinessUtil.isNullOrEmpty(packageDesc)? "NA": packageDesc;
		poaElement.setAttribute(AWLXMLAttribute.PACKING_COMP_DESC.getName(), description);
	}
	
	@Override
	public void customizeCopyElement(Context context, Element copyElement, GS1ArtworkContent as)
			throws FrameworkException {
		super.customizeCopyElement(context, copyElement, as);
		copyElement.setAttribute(AWLXMLAttribute.FOR_PLACEMENT_ONLY.getName(), Boolean.toString(as.isForPlacementOnly()).toUpperCase());
	}
}
