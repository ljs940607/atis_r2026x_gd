<%@page import="com.matrixone.apps.awl.enumeration.AWLFormat"%>
<%@page import="com.matrixone.apps.common.util.ImageManagerUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.util.ConnectorUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkFile"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxContentTypeInclude.inc"%>

<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../webapps/VENCDjqueryUI/latest/jquery-ui.min.js"></script>
<link   href="../webapps/VENCDjqueryUI/latest/jquery-ui.css" type="text/css" rel="stylesheet" />
<!--<script type="text/javascript" src="../common/scripts/jquery-ui.js"></script> -->
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javascript" src="connector/scripts/AWLArtworkFileUpload.js"></script>

<link rel="stylesheet" href="connector/styles/AWLArtworkFileUpload.css">

<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="matrix.db.Context"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>Upload Files to Artwork Files</title>
<%
	String artworkFileId =  XSSUtil.encodeForJavaScript(context, request.getParameter("objectId"));
	String poaId = XSSUtil.encodeForJavaScript(context, request.getParameter("parentOID"));
	
	String formatGS1 = AWLFormat.GS1_RESPONSE.get(context);
	String formatArtwork = AWLFormat.ARTWORK.get(context);
	String formatGeneric = AWLFormat.GENERIC.get(context);
	
	String formatTranslatedGS1 = AWLPropertyUtil.getFormatI18NString(context, formatGS1, false);	
	String formatTranslatedArtwork = AWLPropertyUtil.getFormatI18NString(context, formatArtwork, false);
	String formatTranslatedGeneric = AWLPropertyUtil.getFormatI18NString(context, formatGeneric, false);
	
	POA poaObject = new POA(poaId);
	ArtworkFile artworkFile =  new ArtworkFile(artworkFileId);
	
	MapList artworkFormat = artworkFile.getFileVersionInfoByFileFormat(context, formatArtwork);
	MapList gs1Format = artworkFile.getFileVersionInfoByFileFormat(context, formatGS1);
	String currentResponseFile = artworkFile.getArtworkResponse(context);
	
	boolean showArtwork = BusinessUtil.isNotNullOrEmpty(artworkFormat);
	boolean showGS1 = BusinessUtil.isNotNullOrEmpty(gs1Format) && BusinessUtil.isNotNullOrEmpty(currentResponseFile);
	String artworkUploaded = DomainConstants.EMPTY_STRING;
	if(showArtwork){
		Map artworkMap = (Map)artworkFormat.get(0);
		StringList fileNames = artworkMap.containsKey(AWLConstants.FILE_NAME) ? BusinessUtil.getStringList(artworkMap, AWLConstants.FILE_NAME) : DomainConstants.EMPTY_STRINGLIST ;
		artworkUploaded = (String)(BusinessUtil.isNullOrEmpty(fileNames) ? DomainConstants.EMPTY_STRING : fileNames.get(0));	
	}
	
	String gs1Uploaded = DomainConstants.EMPTY_STRING;
	if(showGS1){
		Map gs1Map = (Map)gs1Format.get(0);
		StringList fileNames = gs1Map.containsKey(AWLConstants.FILE_NAME) ? BusinessUtil.getStringList(gs1Map, AWLConstants.FILE_NAME) : DomainConstants.EMPTY_STRINGLIST ;
		gs1Uploaded = (String)(BusinessUtil.isNullOrEmpty(fileNames) ? DomainConstants.EMPTY_STRING : fileNames.get(0));	
	}
	String poaName = BusinessUtil.getInfo(context, poaId, DomainConstants.SELECT_NAME);
%>

</head>

<body>
	<form id="checkInAFForm" name="checkInAFForm"
		enctype="multipart/form-data" method="post"
		action="../db/o3dconnect/checkin">
		<table class="list">
			<tbody>
				<tr>
					<!-- XSSOK -->
					<th class="required" width="20%"><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Header.Format"))%></th>
					<th class="required" " width="33%"><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Header.File"))%></th>
					<th class="comments" width="33%"><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Comments"))%></th>
				</tr>
				<tr class="even">
					<!-- XSSOK -->
					<td><select class="allowedFormats" id="file1Select" size="1">
					</select></td>
					<td class="uploadFile"><input type="file" name="file1"
						size="30"></td>
					<td><textarea id="aifileComments"></textarea></td>
				</tr>
				<tr class="odd">
					<!-- XSSOK -->
					<td><select class="allowedFormats" id="file2Select" size="1">
					</select></td>
					<td class="uploadFile"><input type="file" name="file2" size="30"></td>
					<td><textarea id="responsefileComments"></textarea></td>
				</tr>
				<tr class="even">
					<!-- XSSOK -->
					<td><select class="allowedFormats" id="file3Select" size="1">
					</select></td>
					<td class="uploadFile"><input type="file" name="file3" size="30"></td>
					<td><textarea id="pdffileComments"></textarea></td>
				</tr>
				<tr class="odd">
					<!-- XSSOK -->
					<td><select class="allowedFormats" id="file4Select" size="1">
					</select></td>
					<td class="uploadFile"><input type="file" name="file4" size="30"></td>
					<td><textarea id="svgfileComments"></textarea></td>
				</tr>
			</tbody>
		</table>
	</form>
		<div>
		<!-- XSSOK -->
		<span class="heading"><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Header.Instruction"))%></span>
		<ol style="padding-left: 28px;">
		<!-- XSSOK -->
			<li><span><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Instruction.validRespFile"))%></span><br /></li>
			<li><span><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Instruction.updateGS1AndArtworkFile"))%></span><br /></li>
			<% if(showArtwork) { %>
			<!-- XSSOK -->
				<li><span><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Instruction.SameExtnForNewfile"))%></li>
			<% } %>
		</ol>
		<br />
		<% if(showArtwork || showGS1) { %>
		<!-- XSSOK -->
				<span class="heading"><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Header.CurrentUploadFile"))%></span>
		<% } %>
		<ol style="padding-left: 28px;">
			<% if(showArtwork) { %>
			<!-- XSSOK -->
				<li><span><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Info.CurrentUploadArtworkFile"))%></span><span class="values"><%=XSSUtil.encodeForHTML(context, artworkUploaded)%></span><br /></li>
			<% } %>
			<% if(showGS1) { %>
			<!-- XSSOK -->
				<li><span><%=XSSUtil.encodeForHTML(context, AWLPropertyUtil.getI18NString(context, "emxAWL.Info.CurrentUploadGS1RespFile"))%></span><span class="values"><%=XSSUtil.encodeForHTML(context, gs1Uploaded)%></span><br /></li>
			<% } %>
		</ol>
	</div>
</body>
</html>

 <script type="text/javascript">
 // XSSOK
 	var artworkUploaded = "<%=XSSUtil.encodeForJavaScript(context, artworkUploaded)%>";
	var showArtwork = "<%=XSSUtil.encodeForJavaScript(context, Boolean.toString(showArtwork))%>";
	var showGS1 = "<%=XSSUtil.encodeForJavaScript(context, Boolean.toString(showGS1))%>";
	var formatTranslatedGS1 = "<%=XSSUtil.encodeForJavaScript(context, formatTranslatedGS1)%>";
	var formatTranslatedArtwork = "<%=XSSUtil.encodeForJavaScript(context, formatTranslatedArtwork)%>";
	var formatTranslatedGeneric = "<%=XSSUtil.encodeForJavaScript(context, formatTranslatedGeneric)%>";
	var formatGS1 = "<%=XSSUtil.encodeForJavaScript(context, formatGS1)%>";
	var formatGeneric = "<%=XSSUtil.encodeForJavaScript(context, formatGeneric)%>";
	var formatArtwork = "<%=XSSUtil.encodeForJavaScript(context, formatArtwork)%>";
    var artworkFileId = "<%=XSSUtil.encodeForJavaScript(context, artworkFile.getObjectId(context))%>";
    var poaId = "<%=XSSUtil.encodeForJavaScript(context, poaId)%>";
    var poaName = "<%=XSSUtil.encodeForJavaScript(context, poaName)%>";
 </script>
