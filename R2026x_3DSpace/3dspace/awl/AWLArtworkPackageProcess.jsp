<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="java.util.List"%>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIUtility.js"></script>

<%
	try	
{
%> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
 	String strLanguage = context.getSession().getLanguage();    
     List<String> emxTableRowIdList=AWLUtil.getSelectedIDs(request);
     boolean state_WIP=false;
     
     for(String apID: emxTableRowIdList) 
     {
 	   String currentState    = BusinessUtil.getInfo(context,apID,DomainConstants.SELECT_CURRENT);
 	   if(currentState.equalsIgnoreCase(AWLState.WORK_IN_PROCESS.get(context,AWLPolicy.ARTWORK_PACKAGE.get(context))))
 	   {
 	       state_WIP=true;
 	       break;
 	   }
 	 }
     
     if(!state_WIP)
     {
 	      	AWLUtil.delete(context, emxTableRowIdList);
 %>
        	 <script language="javascript" type="text/javaScript">      
        	    parent.document.location.href = parent.document.location.href    
             </script>   
             <%
     }
     else{
          String strWIPAlert = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.ArtworkPackageInWorkInProcess");
                %>
            	<script language="javascript" type="text/javaScript">
            	   // XSSOK strWIPAlert : Local variable coming from Res Bundle-I18N
            	   alert("<%=strWIPAlert%>");
            	</script>
             <%
        }       
}catch(Exception ex)
	{ %>
		<script language="javascript" type="text/javaScript">
		     alert("<%=XSSUtil.encodeForJavaScript(context, ex.getMessage())%>");
		 </script>
	<% }
%>
