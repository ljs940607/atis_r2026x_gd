<%@page import="com.matrixone.apps.cpd.framework.ModelMap"%>
<%@ page import="com.matrixone.apps.cpd.json.JSONObject"%>
<%
	response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
	response.setHeader("Pragma", "no-cache"); //HTTP 1.0
	response.setDateHeader("Expires", 0); //prevents caching at the proxy server
	response.setContentType("text/html; charset=UTF-8");
	
	JSONObject jsonObj=ModelMap.getJson(request, "jsonObject");
	out.print(jsonObj.toString());
%>
