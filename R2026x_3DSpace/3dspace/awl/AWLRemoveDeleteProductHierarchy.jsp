<%--
  AWLRemoveDeleteProductHierarchy.jsp

--%>

<%-- Common Includes --%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Iterator"%>
<%@page import="matrix.util.StringList"%>
<%@page import="java.util.Map"%>
<%@page import="com.matrixone.apps.domain.util.MapList"%>
<script language="Javascript" src="../common/scripts/emxUITreeUtil.js"></script> 

<html>   
<form name="formName" method="post">
<%
	String ctxObjectId = emxGetParameter(request, "objectId");
	String strMode = emxGetParameter(request, "mode");
	String[] emxTableRowIds = emxGetParameterValues(request, "emxTableRowId");
	List<String> emxTableRowIdList=AWLUtil.getSelectedIDs(request);
	StringList tableRowIdList = BusinessUtil.toStringList(emxTableRowIdList);
	StringList tabeleRowIdOwnerList = BusinessUtil.getInfo(context,tableRowIdList, DomainConstants.SELECT_OWNER);
	String[] relidList= AWLUtil.getRelationshipIDs(emxTableRowIds);
	
    StringList mclIDList = new StringList();
    StringList mclOwnerList = new StringList();
    
    MapList mapList = BusinessUtil.parseTableRowId(emxTableRowIds);
    String strObjectId = BusinessUtil.getObjectId((Map)mapList.get(0));
    if(ctxObjectId.equals(strObjectId))
    {
	        String message = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.CannotPerform") ;
			%>
           		<script language="javascript" type="text/javaScript">
           		//XSSOK message: Local variable coming from Res Bundle-I18N
                 	alert("<%=message%>");      
           		</script>
        	<%
        	return;
	}
    
    try
	{    
		if("delete".equalsIgnoreCase(strMode)) 
		{	
			 %> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%>  <%
			 AWLUtil.delete(context, emxTableRowIdList);
		}			
   
		if("remove".equalsIgnoreCase(strMode)) {	
			 %> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%>  <%
			DomainRelationship.disconnect(context, relidList);
		}	
		
		for(String strObjId : emxTableRowIdList) 
		{
			%>
				<script language="javascript" type="text/javaScript">
				getTopWindow().deleteStructureNode("<xss:encodeForJavaScript><%=strObjId%></xss:encodeForJavaScript>",false);
				</script>                
			<%          
		}
		%>
			<script language="javascript" type="text/javaScript">
			getTopWindow().refreshTablePage();
			</script>   
		<% 
    } catch(Exception e) {
    	e.printStackTrace();
    	if (e.toString()!=null && e.toString().length()>0) {
    		emxNavErrorObject.addMessage(e.toString().trim());
    	}
    }
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
	</form>
</html>

