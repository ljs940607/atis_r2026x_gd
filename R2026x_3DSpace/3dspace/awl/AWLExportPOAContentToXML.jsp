 <%--
        emxAWLExportBOLToXML.jsp
        Exports an Artwork Assembly for given POA
--%>
<%@page import="java.util.HashMap"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>

<%--<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.servlet.Framework"%> 
<%@page import="java.io.OutputStreamWriter"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.net.URL"%>
--%>

<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage, com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="java.io.FileInputStream, java.io.OutputStream, java.io.File "%>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="matrix.util.StringList,java.text.SimpleDateFormat"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.jdom.output.XMLOutputter, com.matrixone.jdom.Document"%>
<%@page import="java.util.zip.ZipOutputStream, java.util.zip.ZipEntry"%>
<%@page import="com.matrixone.apps.domain.util.EnoviaBrowserUtility"%>
<%@page import="com.matrixone.apps.domain.util.EnoviaBrowserUtility.Browsers"%>

<%
	try 
	{
		String userAgent = request.getHeader("User-Agent");
		boolean isIE = EnoviaBrowserUtility.is(request,Browsers.IE);
		boolean isEdge = EnoviaBrowserUtility.is(request,Browsers.EDGE);
		boolean isSafari = EnoviaBrowserUtility.is(request,Browsers.SAFARI);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
		String strCurrentDateTime = sdf.format(new Date());
		
		String objectId = emxGetParameter(request, "objectId");
		String[] args = new String[]{objectId};
		
		POA poa = new POA(objectId);
		MapList poaGraphicAssemblyList = poa.getGraphicElements(context, new StringList(), new StringList());
		boolean generateZIPfile = !poaGraphicAssemblyList.isEmpty() ? true : false;
		
		String wsPath = context.createWorkspace();
		String fileName = AWLUtil.strcat(poa.getName(context), "_", poa.getInfo(context, DomainConstants.SELECT_CURRENT), "_", strCurrentDateTime);
		File zipFile;
		if(generateZIPfile) {
			zipFile = new File(AWLUtil.strcat(wsPath , File.separator , fileName,".zip"));
			ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipFile));
			
			String poaFolderPath = AWLUtil.strcat( poa.getName(context), "/");
			zipOut.putNextEntry(new ZipEntry(poaFolderPath));
			zipOut.closeEntry();
			
			poa.checkoutPOAGraphics(context, zipOut, poaFolderPath);
			
			String formattedPOAXML = poa.getPOAContentXMLDocument(context, poa.getName(context));
			
			String poaXMLFileName = AWLUtil.strcat(poa.getName(context), File.separator, fileName, ".xml");
			zipOut.putNextEntry(new ZipEntry(poaXMLFileName));
			
			PrintWriter priOut = new PrintWriter(zipOut, true);
			priOut.println(formattedPOAXML);
			zipOut.closeEntry();
			zipOut.finish();
			zipOut.close();
		} else {
			String formattedPOAXML = poa.getPOAContentXMLDocument(context, "");
			
			zipFile = new File(AWLUtil.strcat(wsPath, File.separator, fileName, ".xml"));			
			FileOutputStream fileOutStream = new FileOutputStream(zipFile);
			PrintWriter priOut = new PrintWriter(fileOutStream, true);
			
			priOut.println(formattedPOAXML);
			priOut.close();
		}		

		String zipFilePath = zipFile.getAbsolutePath();

		java.io.File downloadFile = new java.io.File(zipFilePath);
		
		String encFileName = downloadFile.getName();
		if (isIE || isEdge || isSafari) {
			encFileName = FrameworkUtil.encodeURL(encFileName, "UTF-8");
		} 
		else {
			encFileName = "=?UTF-8?B?" + new String(FrameworkUtil.encodeBase64(encFileName.getBytes("UTF-8"), false), "UTF-8") + "?=";
		}
		response.reset();
		response.setContentType("application/octet-stream; charset=UTF-8");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + encFileName + "\"");
		OutputStream outp = null;
		FileInputStream in = null;
		try {
			out.clear();
			outp = response.getOutputStream();
			in = new FileInputStream(zipFilePath);
			byte[] b = new byte[1024];
			int i = 0;
			while ((i = in.read(b)) > 0) {
				outp.write(b, 0, i);
			}
			outp.flush();
		} catch (Exception e) {
			throw e;
		} finally {
			if (in != null)
				in.close();
			
			if (outp != null)
				outp.close();
			
			if(out!=null){
				out.close();	
			}			
			
			java.io.File fileToDelete = new java.io.File(zipFilePath);
			if (fileToDelete.exists())
				fileToDelete.delete();
			
			context.deleteWorkspace();
		}
	} catch (Exception ex) {
		session.setAttribute("error.message", ex.toString().trim());
		ex.printStackTrace();
	} %>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
