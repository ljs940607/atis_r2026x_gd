

<%--
  AWLPOARemoveArtworkAssembly.jsp

  Utilities to remove Artowkr Assembly from POA

  Copyright (c) 1999-2020 Dassault Systemes.
  All Rights Reserved.

  This program contains proprietary and trade secret information
  of MatrixOne, Inc.  Copyright notice is precautionary only and
  does not evidence any actual or intended publication of such program

--%>

<%-- Common Includes --%>


<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>

<%@page import = "com.matrixone.apps.domain.*"%>
<%@page import = "com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import = "com.matrixone.apps.awl.dao.POA"%>
<%@page import = "com.matrixone.apps.awl.dao.ArtworkContent"%>
<%@page import = "java.util.StringTokenizer"%>
<%
	try	
	{
%> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
String[] arrTableRowIds = emxGetParameterValues(request,"emxTableRowId");
String strParentId = emxGetParameter(request, "parentOID");
POA poa=new POA(strParentId);
StringTokenizer strTokenizer = null;
String artworkcontentRelId="";
String artworkcontentID="";

for(int i=0;i<arrTableRowIds.length;i++)
{
     strTokenizer = new StringTokenizer(arrTableRowIds[i] , "|");
     artworkcontentRelId = strTokenizer.nextToken();
     artworkcontentID = strTokenizer.nextToken();
     ArtworkContent ac=ArtworkContent.getNewInstance(context, artworkcontentID);
     poa.removeLocalCopyFromPOAAssembly(context, ac);
}
     
 		
 	}catch(Exception ex)
 	{
 %>
		<script language="javascript" type="text/javaScript">
		 alert("<xss:encodeForJavaScript><%=ex.getMessage()%></xss:encodeForJavaScript>");
		 </script>
	<% }
%>
   		<script language="Javascript">
    		 window.parent.location.href= window.parent.location.href; //refreshing the page
		</script>
