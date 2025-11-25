<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "emxComponentsUtil.inc"%>

<script language="JavaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"></script>

<%
Map requestMap = (Map) session.getAttribute("emxCommonDocumentCheckinData");
String filePath = (String)requestMap.get("updates");
HashMap props = new HashMap();
props.put("debug", "true");
props.put("filePath", filePath);


%>


