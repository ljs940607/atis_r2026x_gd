<%--  AWLCopyElementUpdateContentPostProcess.jsp

   Copyright (c) 1999-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
   
   This jsp is used to validate the webform fields in create mode
 --%>
<%@page import="com.matrixone.apps.awl.dao.CopyElement"%>

<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>

<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="java.util.*"%>
<%
	String objectId = "";
	Boolean flag=true;
	try{
		ContextUtil.startTransaction(context, true);
		
		String strobjectId = (String) request.getParameter("objectId");
		String copyTextValue = (String) request.getParameter("CopyText");  
		
		CopyElement copyElement =  new CopyElement(strobjectId);
		copyElement.setCopyText(context, copyTextValue);
		
		String latestcopyElementId = copyElement.getLastRevision(context).getObjectId();
		objectId = BusinessUtil.isNotNullOrEmpty(latestcopyElementId) ? latestcopyElementId : strobjectId;
		
		ContextUtil.commitTransaction(context);
	} catch(Exception ex)
	{
		flag=false;
		ContextUtil.abortTransaction(context);
		session.setAttribute("error.message" , ex.toString());
	}	
	
	if(flag){
%>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="javascript" type="text/javaScript">
	var url = getTopWindow().location.href;
	url=decodeURIComponent(url);
	if(findFrame(getTopWindow(),"content")!=null){
        var contentFrame =  findFrame(getTopWindow(),"content");
        url = formatURL(contentFrame.location.href);
        contentFrame.location.href =  url;
     }
 	 getTopWindow().closeSlideInDialog();
     
    
	function formatURL(url){
   	 var arr = url.split("&");
        var obj = "objectId";
        for(var i=0;i<arr.length;i++)
        {
            var str = arr[i];
            if(i == 0 && str.indexOf('?') == -1) {
                str = str + "?";
                arr.splice(i,1,str);			 
            }			
            if(str.indexOf(obj) == 0)
            {
                arr.splice(i,1);
            }
        }
        url = arr.join("&");
        url = url+"&objectId=<%= XSSUtil.encodeForURL(context, objectId) %>";
        return url;
   }
</script>
<%} %>
