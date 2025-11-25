<%--  
    emxAWLProductsListFilterProcess.jsp  -
	Copyright (c) 1992-2020 Dassault Systemes.
	All Rights Reserved.
	This program contains proprietary and trade secret information of MatrixOne,Inc.
	Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%
	String requestParameters = AWLUIUtil.getRequestParametersQueryString(context, request, true, 
		"AWLPOAsTaskManagementFilterCommand");

//XSS encoding not required here, we are encoding the parameter values in getRequestParametersQueryString API
String url = AWLUtil.strcat("../common/emxIndentedTable.jsp?", requestParameters);
%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript">
    var filterCmd = getTopWindow().document.getElementById('AWLPOAsTaskManagementFilterCommand');
    var taskFilter = filterCmd != null ? filterCmd.value : "";
    //XSSOK url : Local variable/Request Parameter
    window.parent.frames.location.href  = "<%=url%>" + "&AWLPOAsTaskManagementFilterCommand=" + taskFilter;
</script>
