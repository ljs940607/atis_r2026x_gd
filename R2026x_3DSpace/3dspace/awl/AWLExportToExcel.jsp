
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="java.io.File"%>
<%@page import="com.matrixone.apps.awl.util.AWLExportPOAToExcel"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>

<%
	String errorMsg = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.ExportFailed");
	try{
		String [] tableRowId = emxGetParameterValues(request, "emxTableRowId");
	    tableRowId = AWLUIUtil.getObjIdsFromRowIds(tableRowId);
	    StringList selectedPOAList = BusinessUtil.toStringList(tableRowId);
	
		AWLExportPOAToExcel exportProcess = new AWLExportPOAToExcel();
		String name = exportProcess.startExportProcess(context, selectedPOAList);
		
		
		name = name+".zip";
		response.setContentType("application/octet-stream");
	    response.setHeader ("Content-Disposition","attachment; filename=\"" +name +"\"" );
	    response.addHeader("fileName", name);                
	    
	    InputStream in = new FileInputStream(exportProcess.getWorkingPath()+File.separator+name);
	    
		ServletOutputStream sout = response.getOutputStream();
	    int count;
	    int buffSize = 8*1024;
	    byte[] buf = new byte[buffSize];
	    while((count = in.read(buf,0,buffSize)) > 0)
	    {
	        sout.write(buf,0,count);
	    }
	    in.close();
	    sout.close();
	    sout.flush();
		out.clear();
		out = pageContext.pushBody();
		AWLUtil.deleteFilesInWorkspace(context, exportProcess.getWorkingPath(), false);
}
catch(Exception ex)
{
%><script>
		//XSSOK OK
		alert("<%=errorMsg%>");
	</script>
<%}
%>
