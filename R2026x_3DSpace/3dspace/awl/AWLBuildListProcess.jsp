<%--  
	Copyright (c) 1992-2020 Dassault Systemes.
	All Rights Reserved.
	This program contains proprietary and trade secret information of MatrixOne,Inc.
	Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@page import = "com.matrixone.apps.domain.*"%>
<%@page import = "com.matrixone.apps.common.*"%>
<%@page import="com.matrixone.apps.domain.util.BackgroundProcess"%>
<%@page import="com.matrixone.apps.awl.*" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%

String fieldNameActual    = emxGetParameter(request,"fieldNameActual");
String CopyTextArray     = emxGetParameter(request,"CopyTextArray");
String strListItemID     = emxGetParameter(request,"strListItemID");
String strSequenceNumber =emxGetParameter(request,"strSequenceNumber");
String fieldSequenceNumber =emxGetParameter(request,"fieldSequenceNumber");
String additionalInfoValue =emxGetParameter(request,"additionalInfoValue");
String fieldAdditionalInfo =emxGetParameter(request,"fieldAdditionalInfo");
String fieldListItemName = emxGetParameter(request,"fieldListItemName");
String fieldlistSeparator=emxGetParameter(request,"fieldlistSeparator");
String sParentFeatureId  =  emxGetParameter(request,"objectId");
String strProductId      =  emxGetParameter(request,"productId");
String sTypeName         =  emxGetParameter(request,"copyElementType");
String sMarketingName    =  emxGetParameter(request,"txtMarketingName");
String sCopyText         = emxGetParameter(request,"txtCopyText");
String sVaultName        = emxGetParameter(request,"txtVault");
String sRespOrg          = emxGetParameter(request,"txtDesignResponsibility");
String sPolicy           = emxGetParameter(request,"copyElementPolicy");
String sLanguage         = emxGetParameter(request,"txtActualLanguage");
String sDesignRespId     = emxGetParameter(request,"txtDesignResponsibility");
%>



<%@page import="matrix.util.MatrixException"%><script language="javascript" src="../common/scripts/emxUIConstants.js"></script>

<script language="javascript" type="text/javaScript">
var tmpFieldNameActual = "<xss:encodeForJavaScript><%=fieldNameActual%></xss:encodeForJavaScript>";
var tmpfieldListItemName="<xss:encodeForJavaScript><%=fieldListItemName%></xss:encodeForJavaScript>";
var tmpfieldSequenceNumber="<xss:encodeForJavaScript><%=fieldSequenceNumber%></xss:encodeForJavaScript>";
var fieldAdditionalInfo = "<xss:encodeForJavaScript><%=fieldAdditionalInfo%></xss:encodeForJavaScript>";
var vfieldNameOID=getTopWindow().getWindowOpener().document.forms[0][tmpFieldNameActual];
var vfieldNameListItem=getTopWindow().getWindowOpener().document.forms[0][tmpfieldListItemName];
var vfieldNameListItemSequence=getTopWindow().getWindowOpener().document.forms[0][tmpfieldSequenceNumber];
var vfieldAdditionalInfo=getTopWindow().getWindowOpener().document.forms[0][fieldAdditionalInfo];
vfieldNameOID.updateRTE("<xss:encodeForJavaScript><%=CopyTextArray%></xss:encodeForJavaScript>");
//vfieldNameOID.value = "<%=CopyTextArray %>";
vfieldNameListItem.value="<xss:encodeForJavaScript><%=strListItemID%></xss:encodeForJavaScript>";
//vfieldNameListItemSequence.value="<%=strSequenceNumber%>";
//vfieldAdditionalInfo.value="<%=additionalInfoValue%>";
</script>


<script language="Javascript">  
   var pageContent = getTopWindow().findFrame(getTopWindow(), "pagecontent");
   pageContent.updateBuildList();
   getTopWindow().closeWindow();
</script>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
