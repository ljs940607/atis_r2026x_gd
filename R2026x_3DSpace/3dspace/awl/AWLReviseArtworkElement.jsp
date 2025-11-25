<%--  AWLReviseArtworkElement.jsp  -

   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

--%>
<%-- Include file for error handling --%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../components/emxComponentsUtil.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc"%>
<%@include file = "../emxUICommonHeaderEndInclude.inc" %>
<%@ page import = "com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@ page import = "matrix.db.Context"%>
<%@ page import = "com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@ page import = "com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import = "java.util.StringTokenizer"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.awl.dao.CopyElement"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%
	String artworkPackageId					= emxGetParameter(request, "ArtworkChangeSelected");
	String artworkChangeDescription			= emxGetParameter(request, "ArtworkChangeDescription");
	String seletedObjId 					= null;
	String newCopyText	 				= emxGetParameter(request, "newCopyText");
	StringTokenizer strTokenizer			=	null;
	CopyElement copyElement				= null;
	ArtworkMaster artworkMaster				= null;
	//strTokenizer 							= new StringTokenizer(seletedObjIdList , ",");
	
	FormBean formBean = new FormBean();
	formBean.processForm(session,request);
	String mcsURL = com.matrixone.apps.common.CommonDocument.getMCSURL(context, request);
	formBean.setElementValue("mcsUrl",mcsURL);
	String strBaseCopy 			= (String)formBean.getElementValue("baseCopy");
	String objectId = "";
    String flag = "false";
	
	try	
	{
		ContextUtil.startTransaction(context, true);
		Map argsMap = new HashMap();
		argsMap.put("formBean", formBean);
		argsMap.put("request", request);
		String[] args = JPO.packArgs(argsMap);
		HashMap hMap = (HashMap) JPO.invoke(context, "AWLArtworkElement", null , "reviseArtworkElementOutsideArtworkPackage", args,Map.class);
		objectId = (String) hMap.get("objectId");
		ContextUtil.commitTransaction(context);
        flag = "true" ;
	}catch(Exception ex)
	{
		ContextUtil.abortTransaction(context);
		session.setAttribute("error.message" , ex.toString());
	}

%>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
        <script language="javascript" type="text/javaScript">
        var url = getTopWindow().location.href;
      //XSSOK Static value/value coming from some logic
        var flag = "<%=flag%>";
        if(flag == "true")
        {   
           url=decodeURIComponent(url);
            var findstr = "contentURL=";
           if(url.indexOf(findstr)== -1){
             	if(findFrame(getTopWindow(),"content")!=null){
                   var contentFrame  =  findFrame(getTopWindow(),"content");
                   url = formatURL(contentFrame.location.href);
                    contentFrame.location.href =  url;
                } 
            	 getTopWindow().closeSlideInDialog();
            }else{
            url = url.substring(url.indexOf(findstr)+findstr.length);
            url = formatURL(url);
            var isBase = "<%= XSSUtil.encodeForJavaScript(context, strBaseCopy)%>" ;
            if(isBase.toLowerCase() == "no")
                getTopWindow().getWindowOpener().location.href = getTopWindow().getWindowOpener().location.href;

            getTopWindow().location.href = url;    
            }    
        } else {
        	getTopWindow().closeSlideInDialog();
        }

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
    
<%@include file = "../emxUICommonEndOfPageInclude.inc"%>
