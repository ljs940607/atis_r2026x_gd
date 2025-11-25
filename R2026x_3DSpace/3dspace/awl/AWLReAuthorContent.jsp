<%--
  AWLReAuthorContent.jsp

  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program

--%>
<%-- Common Includes --%>

<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>

<%@page import = "com.matrixone.apps.domain.*"%>
<%@page import = "com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import = "com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import = "com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import = "com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkContent"%>
<%@page import="java.util.List"%>
<%@page import="matrix.util.StringList"%>
<%
	try{
%> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
 	String strMode = emxGetParameter(request,"mode");
          String[] emxTableRowId = emxGetParameterValues(request, "emxTableRowId");
          String[] ObjectIds = AWLUIUtil.getObjIdsFromRowIds(emxTableRowId);
          StringList currentState = BusinessUtil.getInfo(context, BusinessUtil.toStringList(ObjectIds), DomainConstants.SELECT_CURRENT);
          String RELEASE = AWLState.RELEASE.get(context, AWLPolicy.ARTWORK_ELEMENT_CONTENT);
          String strAlertMessage = "";
          for(String artworkState : (List<String>)currentState) {
        	  if(!RELEASE.equals(artworkState)) {
        		  strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkGenerateTask.error");
 %>
            
<script language="javascript" type="text/javaScript">
				//XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
                alert("<%=strAlertMessage%>");
            </script>
<%
              return;
    	  }
      }
      
      boolean reAuthor = "yes".equalsIgnoreCase(strMode);
      for(String elementId : ObjectIds) {
    	  ArtworkContent content = ArtworkContent.getNewInstance(context, elementId);
    	  if(reAuthor) {
    		  content.reauthorContent(context);
    	  } else {
    		  content.skipAuthoring(context);
    	  }
      }
 %>
         <script language="Javascript">
               window.parent.reloadCurrentStructure();
         </script>
<% } catch(Exception e) { %>
	<script language="javascript" type="text/javaScript">  
    alert("<%=XSSUtil.encodeForJavaScript(context, e.getMessage())%>");
    </script>
<% } %>
