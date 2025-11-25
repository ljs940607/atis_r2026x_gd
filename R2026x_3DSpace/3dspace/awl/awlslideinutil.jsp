<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import = "java.util.*" %>
<%@include file = "../emxTagLibInclude.inc"%>
<%@include file="../emxUITopInclude.inc"%>
<%
	String url=request.getParameter("page")+"?";

	Map<String, String[]> paramMap=request.getParameterMap();
	for(Map.Entry<String, String[]> entry: paramMap.entrySet()) {
		if(entry.getValue().length>0) {
			String key = entry.getKey();
			String value = entry.getValue()[0];
			if("emxTableRowIdActual".equalsIgnoreCase(key) || "emxTableRowId".equalsIgnoreCase(key)) {
				value = XSSUtil.encodeForURL(context, value);
			}
			url=AWLUtil.strcat(url, key, "=", value, "&");
		}
	}
	
%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript">
   getTopWindow().showSlideInDialog("<xss:encodeForJavaScript><%=url%></xss:encodeForJavaScript>", "true");
</script>
