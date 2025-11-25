<%@include file="../emxUICommonAppInclude.inc" %>
<%@ page import = "matrix.db.Context,matrix.db.JPO,com.matrixone.servlet.Framework,com.matrixone.apps.domain.util.*, jakarta.json.Json, jakarta.json.JsonObjectBuilder, jakarta.json.JsonObject" %>
<%@ page import = "java.util.HashMap,java.util.Map" %>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%
    try
    {        
    	//Commented ad per 13x.HF1 Transaction handling
        //ContextUtil.startTransaction(context, true);
        
        response.setHeader("Content-Type", "text/plain; charset=UTF-8");
        response.setContentType("text/plain; charset=UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Pragma", "no-cache");
        
        String language  = request.getHeader("Accept-Language");
        String timeZone  =(String)session.getAttribute("timeZone");
        
        HashMap requestMap = UINavigatorUtil.getRequestParameterMap(request);
        requestMap.put("timeZone", timeZone);
        String[] args      = JPO.packArgs(requestMap);
        Map resultMap    = null;
        
        try 
        {
           resultMap    = (Map) JPO.invoke(context, "AWLArtworkPackageUI", null, "doProcess", args, Map.class);
        }catch (Exception exJPO) 
        {
           throw (new FrameworkException(exJPO.toString()));
        }
        
        JsonObject responseJson = BusinessUtil.toJSONObject(resultMap);
        
        out.clear();
        out.print(responseJson.toString());
        //ContextUtil.commitTransaction(context);
        
    } catch (Exception ex)
    {
        //ContextUtil.abortTransaction(context);
        
        JsonObjectBuilder errorJson = Json.createObjectBuilder();
        errorJson.add("hasError",true);
        errorJson.add("error", ex.getMessage());
        ex.printStackTrace();
        out.clear();
        out.print(errorJson.toString());
    }
%>

