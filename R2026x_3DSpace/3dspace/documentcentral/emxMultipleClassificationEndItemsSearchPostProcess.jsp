<%--   emxWorkspaceWizardCancelProcess.jsp -- This is the process page which deletes the created Workspace Object.

  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program

  static const char RCSID[] = $Id: emxWorkspaceWizardCancelProcess.jsp.rca 1.7 Wed Oct 12 16:18:22 2016 przemek Experimental przemek $
--%>
<%@ include file="../emxUICommonAppInclude.inc"%> 
<%@page import="java.util.*"%>
<%@page import="matrix.db.*"%>
<%@page import="com.matrixone.apps.domain.*"%>
<%@page import="com.matrixone.apps.domain.util.*"%>
<html>
<script language="JavaScript" src="../common/scripts/emxUICore.js" type="text/javascript"></script>

 <%
	   String emxTableRowId = emxGetParameter(request,"emxTableRowId");
	   System.out.println("emxTableRowId======================="+emxTableRowId);
		int begin = emxTableRowId.indexOf("|");
		String objectId = "";
		if (begin < 0)
			objectId = emxTableRowId;
		else {
			int end = emxTableRowId.indexOf("|", begin + 1);
			if (end < 0)
				objectId = emxTableRowId.substring(begin + 1);
			else
				objectId = emxTableRowId.substring(begin + 1, end);
		}
 %>
	 <script language="Javascript">
		 var oid = "<%=objectId%>";
		 if(oid !== null && oid !== ""){
		  document.location.href = "../common/emxTree.jsp?objectId="+oid;
		 }
	  </script>
</html>



 
