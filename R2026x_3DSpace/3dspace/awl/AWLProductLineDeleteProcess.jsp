<%--
  AWLRemoveDeleteProductHierarchy.jsp

--%>

<%-- Common Includes --%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@page import = "com.matrixone.apps.productline.ProductLineCommon"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="java.util.List"%>
<%@page import="matrix.util.StringList"%>

<html>
    
   
	<form name="formName" method="post">
<%
	String strMode = emxGetParameter(request, "mode");
	String[] emxTableRowIds = emxGetParameterValues(request, "emxTableRowId");
	List emxTableRowIdList=AWLUtil.getSelectedIDs(request);
	String[] relidList= AWLUtil.getRelationshipIDs(emxTableRowIds);
    try
	{    
			
				AWLUtil.delete(context, emxTableRowIdList);
			%>
				<script language="javascript" type="text/javaScript">
					window.parent.location.href = window.parent.location.href; //refreshing the page
				</script>
			<%
        
		
    }catch(Exception e) {
    	//TODO:catch the Exception
    }
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
	</form>
</html>

