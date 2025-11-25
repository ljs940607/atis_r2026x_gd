<%-- Common Includes --%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>

<%@include file="../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.domain.*"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkException"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.*"%>
<%@page import="com.matrixone.apps.awl.dao.*"%>
<%@page import="java.util.List"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<%@include file="../common/enoviaCSRFTokenValidation.inc" %>
<%

	try {
		String strObjId = emxGetParameter(request, BusinessUtil.OBJECT_ID);
		String portalCmdName = emxGetParameter(request, "portalCmdName");		
		List<String> strSelectedObjIds = AWLUtil.getSelectedIDs(request);
		List<ArtworkTemplate> artworkTemplateList = new ArrayList<ArtworkTemplate>(strSelectedObjIds.size());
		for(String artworkTemplate : strSelectedObjIds) {
			ArtworkTemplate template = new ArtworkTemplate(artworkTemplate);
			artworkTemplateList.add(template);
		} 

		AWLObject awlobject = (AWLObject)DomainObject.newInstance(context, strObjId, AWLConstants.APPLICATION_AWL);

		Map associateTemplateInfo = ArtworkTemplate.associateArtworkTemplate(context, awlobject, artworkTemplateList);		
		
		String messageValue = (String)associateTemplateInfo.get("message");
		String strAlertMessage = "";
		if(BusinessUtil.isNotNullOrEmpty(messageValue)) {
			StringList templateNamesList = BusinessUtil.getStringList(associateTemplateInfo, "artworkTemplatNames");
			String artworkTemplatNames = FrameworkUtil.join(templateNamesList, ",");
			String[] messageKeys = {"artworkTemplatNames"};
			String[] messageKeyValues = {artworkTemplatNames};
			
			if("NoProductCandidateMarkets".equalsIgnoreCase(messageValue)) {
				strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.ProductNoCandidateMarkets", messageKeys, messageKeyValues);				
			} else if("NoMatchingCountriesOfProductAndArtworkTemplate".equalsIgnoreCase(messageValue)){
				strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.NoMatchingCountriesOfProductAndArtworkTemplate", messageKeys, messageKeyValues);
			}
		}
		
		if(BusinessUtil.isNotNullOrEmpty(strAlertMessage)) {
			%>
			<script language="javascript" type="text/javaScript">	
			//XSSOK strAlertMessage :  Local variable coming from Res Bundle-I18N
				alert("<%=strAlertMessage%>")
				window.getTopWindow().closeWindow();
			</script>
			<%
		} else{
			%>
			<script language="javascript" type="text/javaScript">
			
			var portalCmdName = "<%=XSSUtil.encodeForJavaScript(context,portalCmdName)%>";
			
			//SY6 : Logic for refreshment of Artwork Templates table
			if(getTopWindow().findFrame(getTopWindow().getWindowOpener().getTopWindow(),portalCmdName)!=null)
			{
				getTopWindow().findFrame(getTopWindow().getWindowOpener().getTopWindow(), portalCmdName).location.reload();
				window.getTopWindow().closeWindow();
			} else {
				window.getTopWindow().closeWindow();
			}
			</script>
			<%
		}

	} catch (Exception e) {			
		session.setAttribute("error.message", e.getMessage());			
	}
%>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>


