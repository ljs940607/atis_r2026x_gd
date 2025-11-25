<%@ page import="java.util.List" %>
<%@page import="matrix.db.Context"%>

<%@page import="com.matrixone.apps.awl.dao.CopyList"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
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
		String emxSuiteDirectory = emxGetParameter(request, "emxSuiteDirectory");
        
		String submitAction = request.getParameter("SubmitAction");
		String functionality = request.getParameter("functionality");
		String name = request.getParameter("Name");
		String title = request.getParameter("Title");
		String description = request.getParameter("Description");
                String[] artworkUsage = request.getParameterValues("artworkUsageSelection");
                String contexObjectId = request.getParameter("contextProductId");
                String isProductlineContext = request.getParameter("isProductLineContext");
                String selectedCountryList = request.getParameter("h_SelectedCountries");
                String selectedLanguageList = request.getParameter("h_SelectedLanguages");
        
        
                String copyListCreatedMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.CopyListCreatedSuccessfully");
                String successMessage = ""; 	
		
		String copyListId = CopyList.create(context, name, title, description, artworkUsage, contexObjectId, 
				selectedCountryList, selectedLanguageList);
		
		CopyList copyList = new CopyList(copyListId);
		successMessage = AWLUtil.strcat(copyListCreatedMessage, "\n", copyList.getName(context));
		if("Submit".equalsIgnoreCase(submitAction)) {
%>
			<script language="javascript" type="text/javaScript"> 
			//XSSOK i18N
			alert("<xss:encodeForJavaScript><%=successMessage%></xss:encodeForJavaScript>");
			var copyListEditURL="../awl/AWLPOAEdit.jsp?functionality=CopyListEdit&suiteKey=AWL&copyListId=<%=XSSUtil.encodeForURL(context,copyListId)%>&type=CopyList";
<%			if("true".equalsIgnoreCase(isProductlineContext)) {
%>				findFrame(top, "AWLProductLineArtworkElements").location.reload();
<%			} else {
%>				findFrame(top, "AWLMasterLabelElements").location.reload();
<%			}
%>			getTopWindow().showModalDialog(copyListEditURL,600,400,true,'Large');
			getTopWindow().closeSlideInDialog();
	                </script>
<%		} else {
%>			<script language="javascript" type="text/javaScript">
				alert("<xss:encodeForJavaScript><%=successMessage%></xss:encodeForJavaScript>");
<%			if("true".equalsIgnoreCase(isProductlineContext)) {
%>				findFrame(top, "AWLProductLineArtworkElements").location.reload();
<%		} else {
%>				findFrame(top, "AWLMasterLabelElements").location.reload();
<%			}
%>  	    </script>
<%      }
     }
     catch(Exception e) {
          String alertMsg = e.getMessage(); 
%> 
          <script language="javascript" type="text/javaScript"> 
          alert("<xss:encodeForJavaScript><%=alertMsg%></xss:encodeForJavaScript>");
          //getTopWindow().closeSlideInDialog();
          </script>
          
<%  } 
%>
    
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
