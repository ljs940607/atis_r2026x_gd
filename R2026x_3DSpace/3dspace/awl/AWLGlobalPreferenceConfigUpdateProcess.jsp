<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.preferences.AWLGlobalPreference"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.io.File"%>
<%@page import="com.matrixone.apps.common.util.FormBean"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>

<%
String alertMessage = ""; 
FormBean formBean=new FormBean();
formBean.processForm(request.getSession(), request);
%>
<%@include file = "../cpd/CPDFormCSRFValidation.inc"%>

<%
// read file name
String fileName = (String) formBean.getElementValue("fileName0");
String sFunctionality = emxGetParameter(request, "functionality");
String sFailMsgKey = (String) formBean.getElementValue("failMsgKey");
// get the uploaded file path
String workspacePath = context.createWorkspace();
try{
	
	if("ProductLineConfigurationFSInstance".equals(sFunctionality)) {
		//Process for SubProductLine Configuration Updation
		AWLGlobalPreference.setSubProductLineConfig(context, application.getRealPath("/awl/SubProductLineConfig.xsd"), AWLUtil.strcat(workspacePath,File.separator,fileName));
	} else if("ArtworkUsageUploadFSInstance".equals(sFunctionality)){
		//Process for ArtworkUsage Range Update
		AWLGlobalPreference.setArtowrkUsageRange(context, application.getRealPath("/awl/ArtworkUsageRange.xsd"), AWLUtil.strcat(workspacePath,File.separator,fileName));
	} else if("NutritionFactsFSInstance".equals(sFunctionality)){
		//Process for Structured Element Configuration Update
		AWLGlobalPreference.setNutritionFactsConfiguration(context, application.getRealPath("/awl/NutritionFacts.xsd"), AWLUtil.strcat(workspacePath,File.separator,fileName));
	} else {
		throw new Exception("Nothing mapped");
	}
	
	
} catch(Exception e){
	if(BusinessUtil.isNullOrEmpty(sFailMsgKey)){
		alertMessage = "Upload Failed";
	} else {
		alertMessage = AWLPropertyUtil.getI18NString(context, sFailMsgKey);
	}
%>
	
	<script>
	//XSSOK OK
	alert("<%=alertMessage%>");
	</script>
	
<%	e.printStackTrace();
} finally {
	AWLUtil.deleteFileFromWorkspace(context, workspacePath,fileName,true);
}


%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script>
	getTopWindow().closeSlideInDialog();
	getTopWindow().refreshContentPage();
</script>
