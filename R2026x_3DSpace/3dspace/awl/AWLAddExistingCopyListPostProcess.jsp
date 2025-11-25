<%@page import="java.util.List"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.awl.dao.CopyList"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>

<script src="../common/scripts/emxUICore.js"></script>

<%
  try
	  {
	  	 String strParentOID = emxGetParameter(request, "parentOID");
	  	 List<String> selectedItems = AWLUIUtil.getSelectedRowIDs(request);
	     String[] selectedCopyLists = AWLUIUtil.getObjIdsFromRowIds(BusinessUtil.toStringArray(selectedItems));
	     
	     CopyList.addCopyListsToProductHierarchy(context, strParentOID, selectedCopyLists);
%>	     <script language="javascript" type="text/javaScript">
		
		 //window.parent.getTopWindow().getWindowOpener().location.reload();
	
		var detailsFrame= getTopWindow().findFrame(window.parent.getTopWindow().getWindowOpener().getTopWindow(),"AWLMasterLabelElements");
		if(!detailsFrame){
			detailsFrame= getTopWindow().findFrame(window.parent.getTopWindow().getWindowOpener().getTopWindow(),"AWLProductLineArtworkElements");
		}
		detailsFrame.location.href = detailsFrame.location.href;
		
	     getTopWindow().window.closeWindow(); 
	     </script>
<%} catch(Exception e){
%>		<script language="javascript" type="text/javaScript">
        alert(<%=e.getMessage()%>);
        </script>
<%	}
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
