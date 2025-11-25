<%-- Common Includes --%>

<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.awl.enumeration.AWLType" %>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel" %>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct" %>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<html>
 <script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
 <script language="javascript" src="../common/scripts/emxUIUtility.js"></script>
 <script language="Javascript" src="../common/scripts/emxUITreeUtil.js"></script> 
<%
  String strObjId = emxGetParameter(request,"objectId");
  String strNewObjId = emxGetParameter(request,"newObjectId");
  //We need to add the Transaction context instead of session context to query for the object which is not yet commited the transaction.
  Context ctx = (Context) request.getAttribute("context");
 if(BusinessUtil.isKindOf(ctx,strNewObjId, AWLType.CPG_PRODUCT.get(context)))
  {
      CPGProduct objCPG = new CPGProduct(strNewObjId);
      String strModelId = objCPG.getInfo(ctx,"to["+ AWLRel.MAIN_PRODUCT.get(ctx)+"].from.id");
      strNewObjId = strModelId;      
  } 
  
  String appDirectory = AWLPropertyUtil.getConfigPropertyString(context , "eServiceSuiteAWL.Directory");
  
  %>
  <script language="javascript" type="text/javaScript">
  var ParentId = "<xss:encodeForJavaScript><%=strObjId%></xss:encodeForJavaScript>";
  var NewObjId = "<xss:encodeForJavaScript><%=strNewObjId%></xss:encodeForJavaScript>";
	 getTopWindow().refreshTablePage();  
	// getTopWindow().refreshStructureTree();
	 getTopWindow().addStructureTreeNode( NewObjId, ParentId, null,null, null, null, null);
	 parent.closeWindow();      
  </script>
</html>
