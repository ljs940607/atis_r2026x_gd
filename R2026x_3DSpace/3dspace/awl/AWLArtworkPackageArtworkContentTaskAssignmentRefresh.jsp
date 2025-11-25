<%-- 
  AWLArtworkPackageArtworkContentTaskAssignmentRefresh.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<script language="JavaScript" src="scripts/emxUIConstants.js" type="text/javascript"></script>
<script language="javascript" src="scripts/emxUICore.js"></script>
<script language="javascript" src="scripts/emxUIModal.js"></script>
<script language="javascript" src="scripts/emxUIFormUtil.js"></script>
<%
   String slideinOpenerFrame = request.getParameter("openerFrame"); 
   
 %>
  <script language="javascript" type="text/javaScript">
  contentFrame = findFrame(getTopWindow(), '<%=XSSUtil.encodeForURL(slideinOpenerFrame)%>');
  contentFrame.reloadCurrentStructure();
  </script>
 
