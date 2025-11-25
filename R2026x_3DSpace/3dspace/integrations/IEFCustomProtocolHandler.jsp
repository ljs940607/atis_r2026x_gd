<%--  IEFCustomProtocolHandler.jsp

   Copyright (c) 2016-2020 Dassault Systemes. All rights reserved.
   This program contains proprietary and trade secret information of
   Dassault Systemes and its subsidiaries. Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

--%>
<%@ include file ="MCADTopInclude.inc" %>
<%

Context context 		= Framework.getFrameContext(session);
String hrefLink			= Request.getParameter(request,"hreflink");
//IR-1250965 Applet based object removed
String encodedHostName 	= MCADUrlUtil.hexEncode(request.getServerName());
String locationLink 	= hrefLink + ":servername=" + encodedHostName;
%>

<script src="scripts/MCADUtilMethods.js" type="text/javascript"></script>
<script language="JavaScript" src="../common/scripts/emxUICore.js" type="text/javascript"></script>

<script language="JavaScript">




	// Changed for CRIT HF-363748-V5-6R2014SP3
	window.location.href = "<%=XSSUtil.encodeForJavaScript(context,locationLink)%>";

</script>

