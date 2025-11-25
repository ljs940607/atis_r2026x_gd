<%--  emxTeamDeleteRouteTemplate.jsp   -

   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   static const char RCSID[] = $Id: emxDeleteRouteTemplate.jsp.rca 1.11 Wed Oct 22 16:18:52 2008 przemek Experimental przemek $
--%>

<%@page import="java.util.Map"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@include file  = "../emxUICommonAppInclude.inc"%>
<%@include file  = "emxRouteInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>
<%@page import = "matrix.db.ClientTask"%>
<%@page import = "matrix.db.ClientTaskList"%>
<%@page import = "matrix.db.ClientTaskItr"%>
<%
  String[] sTemplateIds = ComponentsUIUtil.getSplitTableRowIds(request.getParameterValues("emxTableRowId"));
	String templateName = null;
  for(int i=0;i<sTemplateIds.length;i++) {
    try{
    String sTemplateId = sTemplateIds[i];
    
    BusinessObject boTemplate = new BusinessObject(sTemplateId);
    boTemplate.open(context);
    DomainObject templateDO = new DomainObject(sTemplateId);
    StringList objectSelects = new StringList();
    objectSelects.add("name");
    objectSelects.add("to[Initiating Route Template].from.id");
    java.util.List multivalueList = new java.util.ArrayList();
    multivalueList.add("to[Initiating Route Template].from.id");
    
    Map routeInfoMap= templateDO.getInfo(context, objectSelects,multivalueList);
    templateName = (String)routeInfoMap.get("name");
    StringList routeTaskState = (StringList)routeInfoMap.get("to[Initiating Route Template].from.id");   
    
    templateName = (String) templateDO.getInfo(context,"name");
    String strCurrentState = (String) templateDO.getInfo(context, com.matrixone.apps.domain.DomainObject.SELECT_CURRENT);
    if("active".equalsIgnoreCase(strCurrentState)){
    	String errMsg=EnoviaResourceBundle.getProperty(context, "emxComponentsStringResource", context.getLocale(),"emxComponents.Common.NoDeleteAccess")+":"+templateName;
    	session.setAttribute("error.message",errMsg);
    }else if(routeTaskState!= null&& routeTaskState.size()>0){
    	String errMsg=EnoviaResourceBundle.getProperty(context, "emxComponentsStringResource", context.getLocale(),"emxComponents.Common.NoDeleteAccess")+":"+templateName;
    	session.setAttribute("error.message",errMsg);
    }
    else{
    	boTemplate.remove(context);
    	%>
    	<script language="javascript" src="../common/scripts/emxUICore.js"></script>
		<script language="javascript">
	  	getTopWindow().deleteObjectFromTrees("<%=XSSUtil.encodeForJavaScript(context, sTemplateId)%>", false);
		</script>
		<%
    }
    boTemplate.close(context);
    }
    catch(Exception e)
    {
    	String errMsg = e.getMessage();
    	ClientTaskList listNotices 	= context.getClientTasks();
		if(listNotices.size() == 1){
			ClientTaskItr itrNotices 	= new ClientTaskItr(listNotices);
			ClientTask clientTaskMessage =  itrNotices.obj();
			errMsg = (String) clientTaskMessage.getTaskData();
			if(errMsg.contains("<TEMPLATE>")){
				errMsg = errMsg.replace("<TEMPLATE>", templateName);
			}
		}else {         
          //Remove the java.lang.Exception coming in the message
          if(errMsg.indexOf("No delete") > -1 )
          {
          	 String object = errMsg.substring(errMsg.indexOf("'")+1,errMsg.lastIndexOf("'"));
			 errMsg=EnoviaResourceBundle.getProperty(context, "emxComponentsStringResource", context.getLocale(),"emxComponents.Common.NoDeleteAccess")+":"+object;
          
          }else if(errMsg.indexOf("No fromdisconnect") > -1)
          {
          	 errMsg = errMsg.substring(29,86);
          }
		}

      session.setAttribute("error.message",errMsg);
    }
  }
%>

  <script language="Javascript">
    parent.window.location.href= parent.window.location.href;
  </script>
