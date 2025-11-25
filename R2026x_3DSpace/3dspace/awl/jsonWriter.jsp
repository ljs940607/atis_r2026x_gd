<%@page import="com.matrixone.apps.cpd.framework.ModelMap"%>
<%@ page import="com.dassault_systemes.platform.ven.jackson.databind.node.ObjectNode"%>
<%
	response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
	response.setHeader("Pragma", "no-cache"); //HTTP 1.0
	response.setDateHeader("Expires", 0); //prevents caching at the proxy server
	response.setContentType("text/html; charset=UTF-8");
	
	ObjectNode jsonObjectNode=(ObjectNode)ModelMap.get(request, "jsonObject");
	String s=(String)ModelMap.get(request, "jsonString");
	out.print(s);
%>
