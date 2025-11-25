<%@page import="com.matrixone.apps.domain.util.ENOCsrfGuard"%>
<%
try{
	String csrfTokenName			= (String) formBean.getElementValue("csrfTokenName");
	String requestCSRFTokenValue	= (String) formBean.getElementValue(csrfTokenName);
	ENOCsrfGuard.validateRequest(context, session, csrfTokenName, requestCSRFTokenValue);
}catch(Exception ex){
	response.sendError(401,EnoviaResourceBundle.getFrameworkStringResourceProperty(context, "emxFramework.ValidationError.CSRFError", request.getLocale()));
}
%>

