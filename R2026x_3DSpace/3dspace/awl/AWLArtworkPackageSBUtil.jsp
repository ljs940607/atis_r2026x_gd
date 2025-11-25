<%--  AWLArtworkPackageSBUtil.jsp

   Copyright (c) 1999-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
 --%>
<%@page import="com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxContentTypeInclude.inc"%>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import = "com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import = "matrix.util.StringList"%>
<%@page import = "com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%
	out.clear();
response.setContentType("text/javascript; charset=" + response.getCharacterEncoding());
String accLanguage  = request.getHeader("Accept-Language");
String submitApproval  = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.SubmitApproval");
String submitAuthoring = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.SubmitAuthoring");
String doubleSubmitArtwork = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.ArtworkDoubleSubmit");
String EnableFDA = Boolean.toString(ArtworkUtil.isFDAEnabled(context));

%>
var AWLGraphicTypesArr = new Array();
var AWLStructureTypesArr = new Array();
<%
StringList slGraphicPartTypes = AWLType.ARTWORK_GRAPHIC_ELEMENT.getDerivative(context, false);
for(int i=0;i<slGraphicPartTypes.size();i++)
{
    String strType = (String) slGraphicPartTypes.get(i);
%>
    //XSSOK strType - is DB Schema Type
    AWLGraphicTypesArr[<%=i%>] = '<%=strType%>';
<%  
}

StringList slStructureRootTypes = AWLPropertyUtil.getStructuredElementRootTypes(context, false);
for(int i=0;i<slStructureRootTypes.size();i++) {
	String strType = (String) slStructureRootTypes.get(i);
%>
    //XSSOK strType - is DB Schema Type
    AWLStructureTypesArr[<%=i%>] = '<%=strType%>';
<%
}
%>

var AWL = {};
// XSSOK submitApproval :  Local variable coming from Res Bundle-I18N 
AWL.SUBMIT_APPROVAL_MESSAGE   = "<%=submitApproval%>";
//  XSSOK submitAuthoring :  Local variable coming from Res Bundle-I18N  
AWL.SUBMIT_AUTHORING_MESSAGE = "<%=submitAuthoring%>";
// XSSOK doubleSubmitArtwork :  Local variable coming from Res Bundle-I18N  
AWL.ARTWORK_DOUBLE_SUBMIT_MESSAGE = "<%=doubleSubmitArtwork%>";
// XSSOK EnableFDA :  Local variable coming from Res Bundle-I18N  
AWL.EnableFDA = "<%=EnableFDA%>";


// XSSOK static value
AWL.ARTWORK_CONTENT_SUBMIT_APPRORVE = "<%=AWLConstants.ARTWORK_CONTENT_SUBMIT_APPRORVE%>";
// XSSOK static value
AWL.ARTWORK_CONTENT_SUBMIT_REJECT = "<%=AWLConstants.ARTWORK_CONTENT_SUBMIT_REJECT%>";
// XSSOK static value
AWL.ARTWORK_CONTENT_SUBMIT_AUTHOR = "<%=AWLConstants.ARTWORK_CONTENT_SUBMIT_AUTHOR%>";
