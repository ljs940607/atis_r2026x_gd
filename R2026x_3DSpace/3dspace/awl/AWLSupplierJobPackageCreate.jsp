<%-- AWLSupplierJobPackageCreate.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BufferedHttpResponseWrapper"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.servlet.Framework"%>
<%@page import="java.io.OutputStreamWriter"%>
<%@include file="../emxUICommonAppInclude.inc" %>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>

<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.net.URL"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="java.io.OutputStream"%>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.util.EnoviaBrowserUtility"%>
<%@page import="com.matrixone.apps.domain.util.EnoviaBrowserUtility.Browsers"%>


<%
	try{
	    String objectId = emxGetParameter(request,"objectId");   
	    String timeStamp = emxGetParameter(request,"timeStamp");    
	    String [] tableRowId = emxGetParameterValues(request, "emxTableRowId");
	    tableRowId = AWLUIUtil.getObjIdsFromRowIds(tableRowId);
	    StringList selectedPOAList = BusinessUtil.toStringList(tableRowId);
	    String supplierPackageTable = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.SupplierJobPackage.ExportTableName");
	    
	    String userAgent = request.getHeader("User-Agent");
	    String userAgentLower = userAgent.toLowerCase();
	    boolean isIE = EnoviaBrowserUtility.is(request,Browsers.IE);
	    boolean isEdge = EnoviaBrowserUtility.is(request,Browsers.EDGE);
	    boolean isMACOS = EnoviaBrowserUtility.is(request,Browsers.MAC_OS);
	    String timezone = (String)session.getAttribute("timeZone");
	    
	    StringBuilder talbeExportURL = new StringBuilder(100);
	    talbeExportURL.append("/common/emxTableExport.jsp");
	    talbeExportURL.append("?exportFormat=CSV&timeStamp=&table=").append(supplierPackageTable).append('&');
	    talbeExportURL.append("program=").append("AWLArtworkPackageUI:getSupplierJobSelectedPOAList").append('&');
	    talbeExportURL.append("objectId=").append(objectId).append("&");
	    talbeExportURL.append("poaIds=").append(FrameworkUtil.join(tableRowId, ","));
	    
	    RequestDispatcher dispatcher = request.getSession().getServletContext().getRequestDispatcher(talbeExportURL.toString());
	    BufferedHttpResponseWrapper wrapper = new BufferedHttpResponseWrapper(response);
	    dispatcher.include(request, wrapper);
	    wrapper.flushBuffer();
	    
	    ArtworkPackage ap = new ArtworkPackage(objectId);
	    String wsPath = context.createWorkspace();
	    String zipFilePath = ap.createSupplierJobContent(context, selectedPOAList, new String(wrapper.getBuffer()), wsPath, timezone);
	    
	    java.io.File downloadFile = new java.io.File(zipFilePath);  
	    String encFileName = downloadFile.getName();
	    if (isIE || isEdge || isMACOS) {
	        encFileName = FrameworkUtil.encodeURL(encFileName, "UTF8");
	    } else {            
	        encFileName = "=?UTF-8?B?" + new String(FrameworkUtil.encodeBase64(encFileName.getBytes("UTF-8"),false), "UTF-8") + "?=";           
	    }    
	    response.reset();
	    
	    String fileEncodeType = UINavigatorUtil.getFileEncoding(context, request);
	    response.setContentType("application/octet-stream; charset="+fileEncodeType);   
	    response.setHeader ("Content-Disposition","attachment; filename=\"" + encFileName +"\"");       
	    OutputStream outp = null;
	    FileInputStream in = null;
	    try
	    {
	        outp = response.getOutputStream();      
	        in = new FileInputStream(zipFilePath);  
	        byte[] b = new byte[1024];
	        int i = 0;  
	        while((i = in.read(b)) > 0)
	        {
	            outp.write(b, 0, i);
	        }
	        outp.flush();
	        out.clear();
	        out=pageContext.pushBody();
	    }
	    catch(Exception e)
	    {     
	        throw e;
	    }
	    finally
	    {
	        if(in != null)
	            in.close();
	        if(outp != null)
	            outp.close();
	        java.io.File zipFile = new java.io.File(zipFilePath);
	        if(zipFile.exists())
	            zipFile.delete();
	        context.deleteWorkspace();     
	    }
	}catch(Exception ex)
	{
		ex.printStackTrace();
%>
		<script language="javascript" type="text/javascript">
		
		alert("<xss:encodeForJavaScript><%=ex.getMessage()%></xss:encodeForJavaScript>");
		</script>
		<%
	}
    
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
