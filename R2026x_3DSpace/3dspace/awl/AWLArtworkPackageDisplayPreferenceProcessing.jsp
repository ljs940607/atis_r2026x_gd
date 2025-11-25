<%--
  AWLArtworkPackagePreferenceProcessing.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>


<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@ page import="com.matrixone.apps.awl.util.BusinessUtil"%>

<%
	try{
		String taskDisplayPreference = emxGetParameter(request, "taskDisplayPreference");
		String defaultLocalCopyDisplayPreference = emxGetParameter(request, "language");
		if(BusinessUtil.isNullOrEmpty(taskDisplayPreference))
		{
			taskDisplayPreference = AWLPreferences.getTaskDisplayPreference(context);
		}
		if(BusinessUtil.isNullOrEmpty(defaultLocalCopyDisplayPreference))
		{
			taskDisplayPreference = AWLPreferences.getLocalCopyDisplayLanguagePreference(context);
		}
		
		AWLPreferences.setDefaultLocalDisplayLanguage(context, defaultLocalCopyDisplayPreference);
		AWLPreferences.setTaskDisplayPreference(context, taskDisplayPreference);
	}
	catch(Exception e)
	{
		System.out.println(e);
	}
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
