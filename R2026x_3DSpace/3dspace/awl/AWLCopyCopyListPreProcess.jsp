<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="java.util.List"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType" %>               
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>   
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.CopyList"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="javascript" type="text/javaScript">
	var proceed=true;
</script>
<%
	String strLanguage = context.getSession().getLanguage();
	String[] strTableRowIds = emxGetParameterValues(request,"emxTableRowId");
	String contextObjectId = request.getParameter("objectId");	
	StringList copyListObjectList = BusinessUtil.toStringList(AWLUIUtil.getObjIdsFromRowIds(strTableRowIds));
	String functionality = emxGetParameter(request,"functionality");
	String selectedCopyListId = (String) copyListObjectList.get(0);
	
	 if(!BusinessUtil.isKindOf(context, selectedCopyListId, AWLType.COPY_LIST.get(context)))
	 {
		 %> 	         
		 <script language="javascript" type="text/javaScript">
			 //XSSOK I18N label or message	
			 alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectCopyList")%>");
		 </script>
		 <%
		 return;
	 } 
	 String sURL = AWLUtil.strcat("../awl/emxAWLCommonFS.jsp?selectedCopyListId=", selectedCopyListId, "&functionality=",functionality,"&contextObjectId=",contextObjectId,  "&suiteKey=AWL&allowedTypes=type_CopyList");
	 List <ArtworkMaster> copyListArtworkMasters = new CopyList(selectedCopyListId).getArtworkMasters(context);
	 if(BusinessUtil.isNullOrEmpty(copyListArtworkMasters)) 
	 {	 
	 	%>	 	 
	 	<script language="javascript" type="text/javaScript">
	 	//XSSOK
	 	proceed = confirm("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.CopyCopyList.CopyListHasNoElements")%>");
	 	</script>
	 	<%
	}
	%>
	<body>
		<form name="CopyCopyList" method="post">
		<%@include file = "../common/enoviaCSRFTokenInjection.inc"%> 
			<script language="Javascript">
		 	 if(proceed)
		 	 {
		 	 	 getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", true);
		 	 }
		 	 </script>
		</form>
	</body>

