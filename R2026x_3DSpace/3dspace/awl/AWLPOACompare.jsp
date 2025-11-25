<%--  AWLPOACompare.jsp
  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information
  of MatrixOne, Inc.   Copyright notice is precautionary only and
  does not evidence any actual or intended publication of such program
--%>
<%@ include file="../emxUICommonAppInclude.inc"%> 
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%
String strObjId = emxGetParameter(request,"objectId");
String strParentId = emxGetParameter(request,"parentOID");
String strStringResourceFileId = emxGetParameter(request,"StringResourceFileId");
String strsuiteKey = emxGetParameter(request,"suiteKey");
String strSuiteDirectory = emxGetParameter(request,"SuiteDirectory");
String expandProgram=emxGetParameter(request,"program");
String table=emxGetParameter(request,"table");
String sURL = AWLUtil.strcat("../common/emxAdvancedStructureCompare.jsp?objectId=",strObjId,"&table=",table,"&relationship=relationship_ArtworkAssembly");
%>

<script language="Javascript">
document.location.href = "<xss:encodeForJavaScript><%=sURL%></xss:encodeForJavaScript>"; 
</script>


