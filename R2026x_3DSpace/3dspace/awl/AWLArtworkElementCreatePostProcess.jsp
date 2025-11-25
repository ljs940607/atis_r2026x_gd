<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>

<script language="Javascript" src="../common/scripts/emxUITreeUtil.js"></script>
  <%
	 	String artworkMasterId = emxGetParameter(request,"parentOID");
	  	String artworkContentId = emxGetParameter(request,"newObjectId");
		String appDirectory = AWLPropertyUtil.getConfigPropertyString(context , "eServiceSuiteAWL.Directory");
	%>
	<script language="javascript" type="text/javaScript">
	if (parent.window.getWindowOpener() != null) 
	{
		var frameContent = findFrame(parent.getWindowOpener().getTopWindow(), "content");
		var conTree = parent.getWindowOpener().getTopWindow().objDetailsTree;
		frameContent.addStructureTreeNode("<xss:encodeForJavaScript><%=artworkContentId%></xss:encodeForJavaScript>","<xss:encodeForJavaScript><%=artworkMasterId%></xss:encodeForJavaScript>",conTree.getSelectedNode().nodeID,"<xss:encodeForJavaScript><%=appDirectory%></xss:encodeForJavaScript>");
	}
	parent.closeWindow();</script>
