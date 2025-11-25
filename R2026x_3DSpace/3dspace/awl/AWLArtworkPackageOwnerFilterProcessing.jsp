<%--  
    AWLArtworkPackageOwnerFilterProcessing.jsp
	Copyright (c) 1992-2020 Dassault Systemes.
	All Rights Reserved.
	This program contains proprietary and trade secret information of MatrixOne,Inc.
	Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@ page import="com.matrixone.apps.awl.util.*"%>

<%
String actionType = request.getParameter("actionType");
String frameName = AWLConstants.LOCAL_COPY_AUTHORING.equalsIgnoreCase(actionType) ? "AWLLocalCopyAuthoring" :
   				   AWLConstants.LOCAL_COPY_APPROVAL.equalsIgnoreCase(actionType)  ? "AWLLocalCopyApproval" : 
   				   AWLConstants.MASTER_COPY_AUTHORING.equalsIgnoreCase(actionType) ? "AWLMasterCopyAuthoring":
   				   AWLConstants.MASTER_COPY_APPROVAL.equalsIgnoreCase(actionType) ? "AWLMasterCopyApproval": "" ;	
%>

<script language="JavaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript">  
// XSSOK frameName : local variable coming through some logic
	if(<%=BusinessUtil.isNotNullOrEmpty(frameName)%> == true){
		// XSSOK frameName : local variable coming through some logic
		var contentFrameObj = findFrame(getTopWindow(),"<%=frameName%>");
		contentFrameObj.doArtworkFilter();
	} 
</script>
