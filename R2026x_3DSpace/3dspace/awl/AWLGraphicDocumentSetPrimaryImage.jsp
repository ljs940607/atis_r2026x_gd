<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.dao.GraphicDocument"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../components/emxComponentsUtil.inc"%>

<%
  String emxTableRowId = emxGetParameter(request, "emxTableRowId");
  String objectId = emxGetParameter(request, AWLConstants.OBJECT_ID);
  
  DomainObject dom = new DomainObject(emxTableRowId);
  String fileName = dom.getInfo(context, CommonDocument.SELECT_TITLE);
	
	
try
{
	%> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
	GraphicDocument gdoc = new GraphicDocument(objectId);
	gdoc.setPrimaryImage(context, fileName);
	    		
} catch (Exception ex)
{
    session.setAttribute("error.message" , ex.toString());
}
%>

<%@page import="com.matrixone.apps.common.CommonDocument"%><html>
<body>
<script language="JavaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" >
  var frameContent = findFrame(getTopWindow(),"detailsDisplay");
      if (frameContent != null )
      {
        frameContent.document.location.href = frameContent.document.location.href;
      } else {
        parent.document.location.href = parent.document.location.href;
      }
</script>

</body>
</html>
