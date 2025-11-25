<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.domain.*"%>


<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.awl.actions.ArtworkElementActions"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>

<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Locale"%>
<%@page import="com.matrixone.apps.cpd.dao.Country"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.cpd.dao.CPDCache"%>
<%@page import="com.matrixone.apps.common.CommonDocument"%>
<%@page import="com.matrixone.apps.common.util.FormBean"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<%@page import="com.dassault_systemes.cap.services.util.ENOAWLWebServicesUtils"%>
<%@page import="com.matrixone.apps.domain.util.ContextUtil"%><script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIUtility.js"></script>
<%
	FormBean formBean=new FormBean();
	formBean.processForm(request.getSession(), request);
%>
<%@include file = "../cpd/CPDFormCSRFValidation.inc"%> 
<%!public String getFormParameter(FormBean formBean, String parameter )
	{
		return (String) formBean.getElementValue(parameter);
	}%>
	
	<%!/* Ngi5 -- start :: CA-119 (IR-749877) : Bad character validation  */
	public boolean isValidName(Context context, String name) throws Exception{
		boolean isValidMktName = ENOAWLWebServicesUtils.isValidName(context, name, "emxSystem", new Locale("en"));
		if(isValidMktName){
			return isValidMktName;
		}else{
			throw new Exception("One or more elements were not created due to invalid Name value");
		}
	}%>
	
	<%
		String mode        = emxGetParameter(request,"mode");
		String contextMode = emxGetParameter(request,"context");
		//String suiteKey    = emxGetParameter(request, "suiteKey");
		String applyMode    = emxGetParameter(request, "applyMode");
	//	String uiType    = emxGetParameter(request, "uiType");
	//	String objectId    = emxGetParameter(request, "objectId");
	//	String tableRowId = emxGetParameter(request,"contextObjectId");
		String portalCmdName = emxGetParameter(request,"portalCmdName");
		String openerFrame = emxGetParameter(request,"openerFrame");
		String mcsUrl = com.matrixone.apps.common.CommonDocument.getMCSURL(context, request);
		String newObjectId = "";
		String editAction = null;
		boolean isError   = false;
		boolean isMultiEditPOAContext = false;
		
		
		try
		{
		    if("createimageElement".equalsIgnoreCase(contextMode))
	        {
		    	Map<String, String> imageElementData = new HashMap<String, String>();
		    	String masterType 		= getFormParameter(formBean,"txtMasterActualType");
	            String documentType         = getFormParameter(formBean,"txtDocumentActualType");
	            String strInstanceSequence = getFormParameter(formBean,"txtInstanceSequence");
		    	
		    	/*To do check with bps team*/
	            String charset = response.getCharacterEncoding();
		        String ParameterNames = "";			
		
		imageElementData.put(DomainConstants.SELECT_TYPE, masterType);
	    imageElementData.put(DomainConstants.DOCUMENT, documentType);
	    /* Ngi5 -- start :: CA-119 (IR-749877) : XSS security check on Marketing Name of Graphic element */
	    String marketingName = getFormParameter(formBean, "txtMarketingName");
	    if(isValidName(context, marketingName)) {
	    	imageElementData.put(AWLAttribute.MARKETING_NAME.get(context), new String(marketingName.getBytes(),charset));
	    }
	    /* Ngi5 -- end */
		imageElementData.put(DomainConstants.SELECT_DESCRIPTION, new String(getFormParameter(formBean, "txtMasterDescription").getBytes(),charset));
		imageElementData.put(CommonDocument.SELECT_FILE_NAME, getFormParameter(formBean, "fileName0"));		
		imageElementData.put("mcsUrl", mcsUrl);
		
		String ctxObjId = getFormParameter(formBean, "contextObjectId");
 		String associateToOID = emxGetParameter(request,"AssociateToOID");
		isMultiEditPOAContext = BusinessUtil.isNotNullOrEmpty(associateToOID);
		List nearestHierarchyList = new StringList();	
		if(isMultiEditPOAContext) { 
			//try to get contextId from create ge from multi page edit
				//connect to immediate hierarchy
				if(associateToOID.contains(",")) {
					nearestHierarchyList = FrameworkUtil.split(associateToOID, ",");
					ctxObjId = nearestHierarchyList.get(0).toString();
				} else { // connect to common hierarchy
					ctxObjId = associateToOID;
				}
			}
		
		DomainObject ctxObject = BusinessUtil.isNotNullOrEmpty(ctxObjId) ? new DomainObject(ctxObjId) : null;
		List<Country> countries = new ArrayList<Country>();
		String selectedcountries = getFormParameter(formBean, "selectedcountries");
		if(BusinessUtil.isNotNullOrEmpty(selectedcountries)) 
		{
		   String []countryIDs=selectedcountries.split(",");
		   for(String countryID: countryIDs)
		   {
			    countries.add(CPDCache.getCountry(countryID));
		   }
		}
		
		ArtworkMaster dobImagekMaster = ArtworkMaster.createMasterImageElement(context, masterType, imageElementData,ctxObject, countries);
		if(isMultiEditPOAContext){
			StringList poaIds = FrameworkUtil.split(emxGetParameter(request,AWLConstants.SELECTED_POA_ID), ",");
			if(nearestHierarchyList.size() > 0) {
				//connect artwork master to each hierarchy
				nearestHierarchyList.remove(0);
				for (int i = 0; i < nearestHierarchyList.size(); i++) 
				{
					String nearestHierarchyId = nearestHierarchyList.get(i).toString();
					DomainRelationship rel = dobImagekMaster.connectFrom(context, AWLRel.ARTWORK_MASTER, new DomainObject(nearestHierarchyId));
					rel.setAttributeValue(context, AWLAttribute.PLACE_OF_ORIGIN.get(context), AWLConstants.RANGE_YES);
				}
			}
			dobImagekMaster.addPOAs(context,poaIds);
					if(BusinessUtil.isNotNullOrEmpty(strInstanceSequence)) {
						
						try{
							Integer instSeq = Integer.parseInt(strInstanceSequence);
							POA poaObject = new POA((String)poaIds.get(0));
							poaObject.setInstanceSequence(context, dobImagekMaster, instSeq);
							//Ignoring the exception String for instance sequence, Case: POA Compare Tab, create new / sync-create new Graphic Element 
						} catch(Exception e) {}	
					}
				}
			newObjectId = dobImagekMaster.getId(context);
	        }
			else if("createCopyElement".equalsIgnoreCase(contextMode))
		    {
		Map<String, String> copyElementData = new HashMap<String, String>();
		String strType = request.getParameter("txtFeatureActualType");		
		copyElementData.put(DomainConstants.SELECT_TYPE, strType);
		copyElementData.put(DomainConstants.SELECT_DESCRIPTION, request.getParameter("txtFeatureDescription"));
		/* Ngi5 -- start :: CA-119 (IR-749877) : XSS security check is done additionally on Marketing Name as part of this task */
		if(isValidName(context, request.getParameter("txtMarketingName"))){
			copyElementData.put(AWLAttribute.MARKETING_NAME.get(context), request.getParameter("txtMarketingName"));
		}
		/* Ngi5 -- end */
		copyElementData.put(AWLAttribute.DISPLAY_TEXT.get(context), request.getParameter("txtFeatureMarketingText"));
		copyElementData.put(AWLAttribute.TRANSLATE.get(context), request.getParameter("txtTranslate"));
		copyElementData.put(AWLAttribute.INLINE_TRANSLATION.get(context), request.getParameter("txtInlineTranslation"));
		copyElementData.put("listItemId", request.getParameter("listItemId"));
		copyElementData.put("listSeparator", request.getParameter("listSeparator"));
		copyElementData.put("listItemSequence", request.getParameter("listItemSequence"));
		copyElementData.put(AWLAttribute.BUILD_LIST.get(context), request.getParameter("BuildFrmListItem"));
		
		copyElementData.put(AWLRel.DESIGN_RESPONSIBILITY.get(context), request.getParameter("txtFeatureDesignResponsibility"));

		String ctxObjId = emxGetParameter(request,"contextObjectId");
		DomainObject ctxObject = BusinessUtil.isNotNullOrEmpty(ctxObjId) ? new DomainObject(ctxObjId) : null;
		List<Country> countries = new ArrayList<Country>();
		String selectedcountries = request.getParameter("selectedcountries");
		if(BusinessUtil.isNotNullOrEmpty(selectedcountries)) 
		{
		   String []countryIDs=selectedcountries.split(",");
		   for(String countryID: countryIDs)
		   {
			    countries.add(CPDCache.getCountry(countryID));
		   }
		}
		ContextUtil.startTransaction(context, true);
		ArtworkMaster artworkMasterObj = ArtworkMaster.createMasterCopyElement(context, strType, copyElementData,ctxObject, countries);
		ContextUtil.commitTransaction(context);
		newObjectId = artworkMasterObj.getId(context);
	    	 }
			else if("editCompositeCopyElement".equalsIgnoreCase(contextMode))
		    {
		Map<String, String> compositeElementData = new HashMap<String, String>();
		String objectId = request.getParameter("objectId");
		compositeElementData.put("listItemId", request.getParameter("listItemId"));
		compositeElementData.put("listSeparator", request.getParameter("listSeparator"));
		compositeElementData.put("BuildFrmListItem", request.getParameter("BuildFrmListItem"));
		compositeElementData.put("listItemSequence", request.getParameter("listItemSequence"));
		compositeElementData.put("OldtxtMarketingName", request.getParameter("OldtxtMarketingName"));
		compositeElementData.put("OldlistSeparator", request.getParameter("OldlistSeparator"));
		compositeElementData.put("OldBuildFrmListItem", request.getParameter("OldBuildFrmListItem"));
		/* Ngi5 -- start :: CA-119 (IR-749877) : XSS security check is done additionally on Marketing Name as part of this task */
		if(isValidName(context, request.getParameter("txtMarketingName"))){
			compositeElementData.put("txtMarketingName", request.getParameter("txtMarketingName"));
		}
		/* Ngi5 -- end */
		compositeElementData.put("txtFeatureDesignResponsibility", request.getParameter("txtFeatureDesignResponsibility"));
		compositeElementData.put("txtFeatureMarketingText", request.getParameter("txtFeatureMarketingText"));
		compositeElementData.put("objectId", objectId);
		
		
		ArtworkMaster artworkMaster = new ArtworkMaster(objectId);
		ContextUtil.startTransaction(context, true);
		artworkMaster = artworkMaster.updateCompositeCopyElement(context, compositeElementData);
		ContextUtil.commitTransaction(context);
		newObjectId = artworkMaster.getId(context);
	    	} 
			
		}catch(Exception ex)
		{
			ex.printStackTrace();
			isError = true;
	%>
			<script language="javascript" type="text/javaScript">
				
				alert("<%=XSSUtil.encodeForJavaScript(context, ex.getMessage())%>");
			</script>
		<%
	}
	%>
	<script language="javascript" type="text/javaScript">
	    //XSSOK check whether objectid is null or empty
	    var isValidObjID = "<%=BusinessUtil.isNotNullOrEmpty(newObjectId)%>" == "true";
	var portalCmdName = "<xss:encodeForJavaScript><%=portalCmdName%></xss:encodeForJavaScript>";
	var jsIsPopup = <%=isMultiEditPOAContext%>;
	
		if("AWLArtworkResponseRoundTripSummary"=="<xss:encodeForJavaScript><%=openerFrame%></xss:encodeForJavaScript>") {
			var frameToReload = findFrame(getTopWindow(), "<xss:encodeForJavaScript><%=openerFrame%></xss:encodeForJavaScript>");
			frameToReload.location.href = frameToReload.location.href;
			getTopWindow().closeSlideInDialog();
		}
	if(jsIsPopup){
		getTopWindow().getWindowOpener().customEditUtil.addNewTableRow("<%=XSSUtil.encodeForJavaScript(context, newObjectId)%>");
		getTopWindow().getWindowOpener().editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
		getTopWindow().closeWindow();
	}
	 if("editCompositeCopyElementAction"=="<xss:encodeForJavaScript><%=mode%></xss:encodeForJavaScript>" && findFrame(getTopWindow(),"<xss:encodeForJavaScript><%=openerFrame%></xss:encodeForJavaScript>")!=null)
		{
			getTopWindow().closeSlideInDialog();
			getTopWindow().findFrame(getTopWindow(), "<xss:encodeForJavaScript><%=openerFrame%></xss:encodeForJavaScript>").location.reload();
		}else if(findFrame(getTopWindow(),portalCmdName)!=null)
		{
			getTopWindow().findFrame(getTopWindow(),portalCmdName).location.reload();
			if("apply"=="<xss:encodeForJavaScript><%=applyMode%></xss:encodeForJavaScript>")
			{
				 var contentFrame  =  getTopWindow().findFrame(getTopWindow(),"slideInFrame");
	             contentFrame.location.href =  contentFrame.location.href;
			}
			else
			{
				getTopWindow().closeSlideInDialog();
			}
			
		} else if(isValidObjID)
		{
			getTopWindow().closeSlideInDialog();
	   		parent.window.document.location.href = "../common/emxTree.jsp?objectId=" + "<%=XSSUtil.encodeForURL(context, newObjectId)%>";
		}		

</script>
