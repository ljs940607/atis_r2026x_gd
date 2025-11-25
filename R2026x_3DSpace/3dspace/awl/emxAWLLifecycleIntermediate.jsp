<!--emxAWLLifecycleIntermediate.jsp-->

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@ include file="../emxUICommonAppInclude.inc"%> 
<%@include file = "../emxUICommonHeaderBeginInclude.inc"%>
<%@include file = "../emxUICommonHeaderEndInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>
<%@ page import = "com.matrixone.apps.domain.*"%>
<%@ page import = "com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@ page import = "matrix.db.Context"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Enumeration"%>
<%@page import="java.util.Iterator"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkUtil"%>

<%
	String strObjId = emxGetParameter(request,"objectId");
	StringBuffer buffer = new StringBuffer(300);
	try
	{      
		String masterCopyID  = strObjId;
		if(ArtworkElementUtil.isMasterCopyElement(context, strObjId))
		{
			masterCopyID 	= ArtworkElementUtil.getMasterCopyByCopyElement(context, strObjId);
			
		}
		
		Map paramMap = new HashMap();
	    Enumeration eNumParameters = emxGetParameterNames(request);
	
	    while( eNumParameters.hasMoreElements() ) 
	    {
	    	String strParamName = (String)eNumParameters.nextElement();
	    	paramMap.put(strParamName, emxGetParameter(request, strParamName));
	    }
	    
	    paramMap.put("objectId", masterCopyID);
	    paramMap.put("StringResourceFileId", "emxFrameworkStringResource");
	    paramMap.put("SuiteDirectory", "common");
	    paramMap.put("suiteKey", "Framework");
	    
	    buffer.append("../common/emxLifecycle.jsp?mode=advanced&showPageHeader=false");
	    
	    for (Iterator iterator = paramMap.keySet().iterator(); iterator.hasNext();)
	    {
	        String paramName = (String) iterator.next();
	        buffer.append('&').append(paramName).append('=').append(paramMap.get(paramName));
	    }
	}
	catch(Exception ex)
	{
		throw ex;
	}
%>

<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%><script language="javascript" type="text/javaScript">
	  //<![CDATA[
	     //Releasing Mouse Events
	var frameContent = findFrame(getTopWindow(),"pagecontent");
	document.location.href = "<xss:encodeForJavaScript><%= buffer.toString()%></xss:encodeForJavaScript>";
	  	//]]>
</script>
