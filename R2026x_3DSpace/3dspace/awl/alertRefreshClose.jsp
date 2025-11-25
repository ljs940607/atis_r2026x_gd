<%@include file = "../emxContentTypeInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@ page import="com.matrixone.apps.cpd.framework.*"%>
<%
	response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
	response.setHeader("Pragma", "no-cache"); //HTTP 1.0
	response.setDateHeader("Expires", 0); //prevents caching at the proxy server
%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript">
	alert("<xss:encodeForJavaScript><%=ModelMap.get(request, "jsAlert")%></xss:encodeForJavaScript>");
<%
	Boolean refresh=(Boolean)ModelMap.get(request, "refresh");
	if(refresh!=null && refresh)
	{
%>
		var contentFrameObj = getTopWindow().findFrame(getTopWindow(), "AWLFPMastersList");		
		if(contentFrameObj == null)
			contentFrameObj = getTopWindow().findFrame(getTopWindow(),"detailsDisplay");

		contentFrameObj.location.href=contentFrameObj.location.href;
<%
	}

	Boolean closeSlideIn=(Boolean)ModelMap.get(request, "closeSlideIn");
	if(closeSlideIn!=null && closeSlideIn)
	{
%>
		getTopWindow().closeSlideInDialog();
<%
	}
%>
</script>
