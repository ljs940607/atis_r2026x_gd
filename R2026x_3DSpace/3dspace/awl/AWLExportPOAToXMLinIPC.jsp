 <%--
        emxAWLExportBOLToXML.jsp
        Exports an Artwork Assembly for given POA
--%>

<%@ include file="../emxUICommonAppInclude.inc"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.jdom.Document"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.jdom.output.XMLOutputter"%>
<%@page import="com.matrixone.util.MxXMLUtils"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="matrix.db.JPO"%>

<%
    try
    {          
        String poaId = emxGetParameter(request,"objectId");
        POA poa = new POA(poaId);
        String artworkAssemblyJPO = AWLUtil.getJPOClassName(context, "com.dassault_systemes.enovia.apps.awl.migration.AWLArtworkAssemblyExportIPC");
        Document docObject=(Document) JPO.invokeLocal(context,artworkAssemblyJPO, null,"createArtworkAssemblyDocument", new String[] {poaId},Document.class);
    	String poaName = poa.getInfo(context, POA.SELECT_NAME);
    	String poaState = poa.getInfo(context, POA.SELECT_CURRENT);
    	
    	StringBuilder filename = new StringBuilder(50);
    	filename.append(poaName).append('-').append(poaState).append(".xml");
    	
		String filenameStr = FrameworkUtil.encodeURL(filename.toString(), "UTF-8");
		response.setHeader ("Content-Disposition","attachment; filename=\"" + filenameStr +"\"");
		response.setLocale(request.getLocale());
		response.setContentType("text/xml; charset=UTF-8");
		XMLOutputter  outputter = MxXMLUtils.getOutputter(true);
		String strOutPut = outputter.outputString(docObject);
		strOutPut = AWLUtil.formatCopyText(context, strOutPut);
		out.clear();
		out.write(strOutPut);
		out.flush();
    }
    catch(Throwable mxEx)
    {
    	mxEx.printStackTrace();
%>
<script>
       alert("<xss:encodeForJavaScript><%= mxEx.getMessage() %></xss:encodeForJavaScript>");
        </script>
<%
    }
%>
