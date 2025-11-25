<%--  artworktemplate.jsp
   Copyright (c) 1992-2020 Dassault Systemes. All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
--%>

<%@page import="com.matrixone.apps.awl.util.ConnectorUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxContentTypeInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@include file = "../emxRequestWrapperMethods.inc"%>
<%@page import="matrix.db.Context"%>

<%
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
response.setHeader("Expires", "0"); // Proxies.
%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0, s-maxage=0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="Sat, 01 Dec 2001 00:00:00 GMT">
<title>Artwork Template</title>
<script type="text/javascript" src="connector/scripts/qwebchannel.js"></script>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../webapps/VENCDjqueryUI/latest/jquery-ui.min.js"></script>
<link   href="../webapps/VENCDjqueryUI/latest/jquery-ui.css" type="text/css" rel="stylesheet" />
<!--<script type="text/javascript" src="../common/scripts/jquery-ui.js"></script>-->
<script type="text/javascript" src="connector/scripts/artworktemplate.js"></script>
<script type="text/javascript" src="connector/scripts/diff_match_patch.js"></script>
<script type="text/javascript" src="connector/scripts/connectorUtil.js"></script>
<!--<link href="../plugins/libs/jqueryui/1.10.3/css/jquery-ui.css" type="text/css" rel="stylesheet" />-->
<link rel="stylesheet" href="connector/styles/artworktemplate.css">
<link rel="stylesheet" href="connector/styles/aiui.css">

<%  Context context = (Context) ServletUtil.getSessionValue(session, "ematrix.context");
    String artworkTemplateName = XSSUtil.encodeForJavaScript(context, request.getParameter("artworkTemplateName"));
    String templateName = "", templateDesc = "", currentState = "", poaassociated = ""; 
    String details = "", placeoforigin = "", countriesAsscoiated = "", locked = "", notHaveRequiredLicense="";
            
    boolean hasContext = context != null;
    if(hasContext) {
    	locked = AWLPropertyUtil.getI18NString(context,"emxAWL.Label.Locked");
    	details = AWLPropertyUtil.getI18NString(context,"emxAWL.Header.Details");
        templateName = AWLPropertyUtil.getI18NString(context,"emxFramework.Basic.Name");
        templateDesc = AWLPropertyUtil.getI18NString(context,"emxFramework.Basic.Description");
        currentState = AWLPropertyUtil.getI18NString(context,"emxFramework.Basic.State");
        poaassociated = AWLPropertyUtil.getI18NString(context,"emxAWL.Common.AssociatedPOA");
        placeoforigin = AWLPropertyUtil.getI18NString(context,"emxAWL.Table.PlaceOfOrigin");
        countriesAsscoiated = AWLPropertyUtil.getI18NString(context,"emxAWL.ManageCountries.CountriesAssigned");
        notHaveRequiredLicense = AWLPropertyUtil.getI18NString(context,"emxAWL.UserAction.NotHaveRequiredLicense");
    }
%>
<script type="text/javascript">
        var artworkTemplateName =  "<%=artworkTemplateName%>";
        var hasContext =  <%=hasContext%>;
</script>

</head>
<body>

<script>
		$.ajax({
	        url: "../resources/awl/connector/o3dconnect/hasCORLicense",
	        error:function(data){
	        	$("#error-container").removeClass("hide-container");
	        	$("#error-container").addClass("show-container");
	        },
	        success:function(data) {
	        	$("#data-container").removeClass("hide-container");
	        	$("#data-container").addClass("show-container");
	        }
		});
	</script>

<div id="error-container" class="error-container hide-container">
	<h2 id="noLicense">  <%=notHaveRequiredLicense%>  </h2>
</div>

<div id="data-container" class="data-container hide-container">
        <div id="actions" class="actions">
            <span id="searchArtworkTemplatebtn" class="action-command">
                    <img class="action-command" src="connector/images/xml-32.png"/>
            </span>
            <span id="associateArtworkTemplateBtn" class="action-command">
                    <img class="action-command" src="connector/images/Associate.png" />
            </span>     
            <span id="lockOrUnlockTemplateSpan" class="action-command">
                    <img id="lockOrUnlockImg "class="action-command" src="connector/images/locked.png" onClick="lockOrUnlock(event)"/>
            </span>
            <span id="checkinbtn" class="action-command">
                    <img class="action-command" src="connector/images/checkinfile.png" />
            </span>
			<span id="addCreatebtn" class="action-command">
                    <img class="action-command" src="connector/images/newfile.png"/>
            </span>
        </div>
        <div id="artworkTemplateInfoDiv" class="artworkTemplateInfoDiv">
			
			<div>
				<div id="templateName" class="header"></div>
				<div class="header"><%= templateDesc %></div>
				<div id="templateDescription" class="descriptionBox"></div>
			</div>
			<div>
				<div class="header"><%= poaassociated %></div>
				<div id="poaassociated" class="descriptionBox"></div>
			</div>
			<br>
			<div>
				<div class="header"><%= countriesAsscoiated %></div>
				<div id="countriesAssociated" class="descriptionBox"></div>
			</div>
			<div>
				<div class="header"><%= details %></div>
				<div class="descriptionBox">
					<div>
					<table id="details">
						<tr>
						<td class="column"><%= placeoforigin %></td>
						<td id="placeoforigin"></td>
						</tr>
						<tr>
						<td class="column"><%= currentState %></td>
						<td id="currentState"></td>
						</tr>
						<tr>
						<td class="column"><%= locked %></td>
						<td id="lockStatus"></td>
						</tr>
					</table>
				</div>
				</div>
			</div>
        </div>

</div>	
</body>
</html>
