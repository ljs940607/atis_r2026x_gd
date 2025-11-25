<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import = "java.util.Map"%>

<%
	String url = "";
  try
  {
    	String[] checkBoxArray = emxGetParameterValues(request, "emxTableRowId"); 
    	if(checkBoxArray.length != 0 )
    	{
	Map parsedRowInfo = BusinessUtil.parseTableRowId(checkBoxArray[0]);
	StringBuilder completeURL=new StringBuilder(emxGetParameter(request, "href"));
	if(completeURL.toString( ).contains("common/emxTree.jsp"))
	{
	    url = completeURL.append("?objectId=").append((String)parsedRowInfo.get(BusinessUtil.OBJECT_ID)).toString();
	    
	}else
	{
	    request.getRequestDispatcher(completeURL.append("?objectId=").append((String)parsedRowInfo.get(BusinessUtil.OBJECT_ID)).toString()).forward(request, response);    
	}
    	}
    	else
    	{
    		String language = context.getSession().getLanguage();
    		throw new Exception(AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.CannotPerform")); 
    	}
   }catch(Exception ex)
   {
	   ex.printStackTrace();
       if(session.getAttribute("error.message") == null)
       {
          session.setAttribute("error.message", ex.toString());
       }
   }
%>
<script language="Javascript">      
       window.parent.frames.location.href = "<%= XSSUtil.encodeURLForServer(context, url) %>";
</script>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
