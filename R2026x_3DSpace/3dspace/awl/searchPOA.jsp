<%--  searchPOA.jsp
   Copyright (c) 1992-2020 Dassault Systemes. All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
--%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxContentTypeInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<title>Search POA</title>
		<link href="../plugins/libs/jqueryui/1.10.3/css/jquery-ui.css" type="text/css" rel="stylesheet" />
		<link href="connector/styles/widgettable.css" rel="stylesheet" type="text/css" />

		<script type="text/javascript" src="connector/scripts/qwebchannel.js"></script>
		<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
		<script type="text/javascript" src="../common/scripts/jquery-ui.js"></script>
		<script type="text/javascript" src="connector/scripts/searchPOA.js"></script>
		<script type="text/javascript" src="connector/scripts/connectorUtil.js"></script>

		<script type="text/javascript">
			 function getSelectedPOAId() {
				return $(".selected").attr("id");
			 }
			 function getSelectedPOAName() {
				return $(".selected").attr("name");
			 }
			 function getSelectedPOARevision() {
				return $(".selected").attr("revision");
			 }
			 function getSelectedATName(){
				return associateTemplate;
			 }			 
			 $(document).ready(function(){
				attachEnterKeyToSearchBox(".containermain", "poasearchtext", "poasearchbtn");			 
			});
		</script>
	</head>
	<body>
		<div class="containermain">
			<div class="poasearchdiv"></div>
			<div class="poatablecontainer"></div>
			<div class="templatecontainer clearfix" id="templatecontainer">
				<div style="float: left">
					<span class="spanbtn" id="back">&lt;&lt;</span>
				</div>
				<div class="templateinnercontainer">
					<div class="templatesearchdiv"></div>
					<div id="templates"></div>
				</div>
			</div>
		</div>
	</body>
</html>
