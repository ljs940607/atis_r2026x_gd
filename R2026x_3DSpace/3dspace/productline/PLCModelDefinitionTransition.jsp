<%--
  \PLCModelDefinitionTransition.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>

<%-- Common Includes --%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="emxProductCommonInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@ include file="FTRTransitionUtil.jsp" %>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="matrix.db.Context"%>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIUtility.js"></script>
<script type="text/javascript" src="../webapps/AmdLoader/AmdLoader.js"></script>
<script type="text/javascript"
	src="../webapps/c/UWA/js/UWA_W3C_Alone.js"></script>

<%
try
  {	  
	  String pageId = emxGetParameter(request, "pageId");
	  String strMode = emxGetParameter(request, "mode");
	  String strObjIdContext = emxGetParameter(request, "objectId");
	  	  
	  String appId = "";
	  String additionalData = "";
	  
	  
	  switch (pageId) {
	      case "Collaboration":
	          appId = "ENORIPE_AP";
	          break;
	      case "Content":
	          appId = "ENXMODL_AP";
	          break;
	      default:
	          throw new Exception("Invalid pageId: " + pageId);
	  
	  }
	  additionalData = generateAdditionalData(context, pageId, strObjIdContext);
%>

<div id="redirectMessage"
	style="text-align: left; margin-top: 50px; font-size: 19px; font-weight: normal;">
	<emxUtil:i18n localize="i18nId">emxProductLine.MDTransition.Message</emxUtil:i18n><a href="#" id="fallbackLink"
		style="text-decoration: underline; cursor: pointer;"><emxUtil:i18n localize="i18nId">emxProductLine.MDTransition.MessageClickHere</emxUtil:i18n></a>.
</div>

<script language="javascript" type="text/javascript">
	function redirectToApp() {
		require(
				[ "UWA/Utils/InterCom" ],
				function(InterCom) {
					var compassPageSocket = new InterCom.Socket(
							'compassPageSocket');
					compassPageSocket.subscribeServer('com.ds.compass',
							getTopWindow());
					compassPageSocket
							.dispatchEvent(
									'onSetX3DContent',
									{
										envId : 'OnPremise',
										version : "1.1",
										source : 'ENOVAMA_AP',
										widgetId : (window.widget && window.widget.id) ? window.widget.id
												: '',
										data :<%= additionalData %>
									}, 'compassPageSocket');
					compassPageSocket.dispatchEvent('onLaunchApp', {
						appId: "<%= appId %>"
					}, 'compassPageSocket');
				});
	}

	setTimeout(function() {
		redirectToApp();
	}, 3000);

	document.getElementById('fallbackLink').addEventListener('click',
			function(event) {
				event.preventDefault();
				redirectToApp();
			});
</script>

<%
} catch (Exception e) {
session.setAttribute("error.message", e.getMessage());
}
%>
<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
