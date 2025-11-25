<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@ page import="java.util.List" %>
<%@page import="matrix.db.Context"%>

<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../components/emxComponentsUtil.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>

<%
	try {
		
		String submitAction = request.getParameter("isApply");
		String typeActual = request.getParameter("TypeActual");
		String nutritionId = request.getParameter("newObjectId");
		
		if("false".equalsIgnoreCase(submitAction) && AWLPropertyUtil.isStructuredElementRootType(context, typeActual, false)) { %>
			<script language="javascript" type="text/javaScript"> 
		   		var nutritionEditURL="../webapps/ENOStructureCopy/ENOStructureCopy.html?functionality=NutriFactEdit&type=xyz&suiteKey=AWL&nutritionId=<%=XSSUtil.encodeForURL(context,nutritionId)%>";		
		   		getTopWindow().showModalDialog(nutritionEditURL,600,400,true,'Large');	
				getTopWindow().closeSlideInDialog();
			</script>
		<% } %>	 
		
		<script language="javascript" type="text/javaScript">
			//findFrame(top, "AWLMasterLabelElements").location.reload();
			var contentFrameObj = getTopWindow().findFrame(getTopWindow(), "AWLMasterLabelElements");		
			if(contentFrameObj == null)
				contentFrameObj.location.href = contentFrameObj.location.href;					
	  	</script>;
		
     <%}
     catch(Exception e) {
          String alertMsg = e.getMessage(); 
	  %> 
          <script language="javascript" type="text/javaScript"> 
          	alert("<xss:encodeForJavaScript><%=alertMsg%></xss:encodeForJavaScript>");
          </script>
	<% } 
	%>
    
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
