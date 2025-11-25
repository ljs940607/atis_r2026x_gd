<%-- AWLSelectChangeManagementProcess.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>
<%@page import="com.matrixone.apps.awl.dao.CO"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>

<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkFile"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLECMUtil"%>
<%@page import="matrix.util.StringList"%>
<% 
	String ctxObjID = emxGetParameter(request,"objectId");
	String selROWID = AWLUIUtil.getObjIdFromRowId(emxGetParameter(request,"emxTableRowId"));
	String suiteKey = emxGetParameter(request, "suiteKey");
	String mode = emxGetParameter(request,"artworkmode");

    // Fetching all the Request Parameters related to "Enterprise Change Management".
    String changeTemplateId = emxGetParameter(request, "ChangeTemplateOID");
    String changeOrderId = emxGetParameter(request, "ChangeOrderOID");
    
	try
	{
		CO changeOrder = CO.fetchCO(context, changeOrderId, changeTemplateId);

		if("ArtworkFileRevise".equalsIgnoreCase(mode))
		{
			new ArtworkFile(ctxObjID).addToCAForRevise(context, changeOrder);
		}
		else if("POAObsolete".equalsIgnoreCase(mode))
		{
			new POA(selROWID).addToCAForObsolescence(context, changeOrder);
		}
	}
	catch (Exception e) 
	{
		session.setAttribute("error.message", e.getMessage());
		throw new FrameworkException(e); 
	}
	String actionURL  =  "../common/emxTree.jsp?AppendParameters=true&objectId=" + XSSUtil.encodeForURL(context,ctxObjID) + "&emxSuiteDirectory"+ XSSUtil.encodeForURL(context,suiteKey);
	%>
	
	
	
	<script language="javascript" type="text/javaScript">
		loadTreeNode("<%=XSSUtil.encodeForJavaScript(context, ctxObjID)%>", null, null, "<%=XSSUtil.encodeForJavaScript(context, suiteKey)%>", true, "<%=XSSUtil.encodeForJavaScript(context, actionURL)%>");
		getTopWindow().closeSlideInDialog();
	</script>
