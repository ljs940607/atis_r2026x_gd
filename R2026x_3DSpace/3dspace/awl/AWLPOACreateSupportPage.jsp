<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>
<%@page import  = "com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.util.List"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIUtility.js"></script>

<%
	try	
{
%>
	<%
	 response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
     response.setHeader("Pragma", "no-cache"); //HTTP 1.0
    
     String mode = request.getParameter("mode");
 	 String strLanguage = context.getSession().getLanguage();    
     List<String> emxTableRowIdList=AWLUtil.getSelectedIDs(request);
     String objectId = emxTableRowIdList.get(0);
     
     String title = null;
     String description =null;
     String name = null;
     
     if(BusinessUtil.isKindOf(context,objectId,AWLType.ARTWORK_PACKAGE.get(context))){
    	 
     		ArtworkPackage apObject = new ArtworkPackage(objectId);
     		title = apObject.getAttributeValue(context, DomainConstants.ATTRIBUTE_TITLE);
     		description = apObject.getDescription(context);
     		name = apObject.getName(context);
     }
     else{
    	 	DomainObject doChangeTemplate = DomainObject.newInstance(context, objectId);
    	 	name = doChangeTemplate.getName(context);
     }
         
     if("ArtworkPackageChooser".equals(mode)) {
     %>
	 <script language="javascript" type="text/javaScript">
	 	getTopWindow().getWindowOpener().document.getElementById("chooseExistingArtworkPackage").value = "<%=name%>";
		getTopWindow().getWindowOpener().document.getElementById("artworkPackageTitle").value = "<%=title%>";
		getTopWindow().getWindowOpener().document.getElementById("artworkPackageDescription").value = "<xss:encodeForJavaScript><%=description%></xss:encodeForJavaScript>";
		getTopWindow().getWindowOpener().document.getElementById("ArtworkChangeSelectedOID").value = "<xss:encodeForJavaScript><%=objectId%></xss:encodeForJavaScript>";
		getTopWindow().closeWindow();  
	</script>
	
	<% }else{ %>
		 <script language="javascript" type="text/javaScript">
		 	getTopWindow().getWindowOpener().document.getElementById("chooseTemplateName").value = "<%=name%>";
		 	getTopWindow().getWindowOpener().document.getElementById("chooseTemplateNameOID").value = "<xss:encodeForJavaScript><%=objectId%></xss:encodeForJavaScript>";		 	
		 	//XSSOK i18N label
		 	getTopWindow().getWindowOpener().document.getElementById("changeOrderName").value = "<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Button.CreateNew")%>";
		 	getTopWindow().getWindowOpener().document.getElementById("changeOrderNameOID").value = "CreateNew";		 	
		 	getTopWindow().closeWindow();  
		</script>
		
	<%}		
     
	}catch(Exception ex)
	{
		ex.printStackTrace();
	 }
%>
