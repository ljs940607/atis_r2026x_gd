<%-- emxProgramCentralProjectExportProcess.jsp

  Performs the action that exports a project to the client.

  Copyright (c) 1992-2020 Dassault Systemes.

  All Rights Reserved.
  This program contains proprietary and trade secret information
  of MatrixOne, Inc.  Copyright notice is precautionary only and
  does not evidence any actual or intended publication of such program

  static const char RCSID[] = "$Id: emxProgramCentralProjectExportProcess.jsp.rca 1.27 Wed Oct 22 15:50:35 2008 przemek Experimental przemek $";


<%@include file = "emxProgramGlobals2.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc"%>

<%@page import = "com.matrixone.apps.program.Task" %>

<head>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javascript" language="JavaScript">
    addStyleSheet("emxUIDialog");
</script>
</head>
--%>
<%@page import="com.matrixone.apps.domain.util.EnoviaBrowserUtility.Browsers"%>
<%@include file = "emxProgramGlobals2.inc"%>
<%@include file = "../emxRequestWrapperMethods.inc"%>

<%
//create context variable for use in pages
matrix.db.Context context = Framework.getFrameContext(session);
%>

<%
  // Gets the parameters from the request.
  String objectId = (String) emxGetParameter(request, "objectId");
		
  String[] objectIds = emxGetParameterValues(request, "objectIds");
  String programId = (String) emxGetParameter(request, "programId");
  String language = request.getHeader("Accept-Language");
  String exportFormat = (String) emxGetParameter(request, "exportFormat");
  String exportSubProject = (String) emxGetParameter(request, "exportSubProject"); 
  Map paramMap = new HashMap();
  int objectIDsLength = objectIds.length;

  
  StringList selectable = new StringList();
  selectable.add(ProgramCentralConstants.SELECT_NAME);
  selectable.add(ProgramCentralConstants.SELECT_ATTRIBUTE_TITLE);
  selectable.add(ProgramCentralConstants.SELECT_KINDOF_PROJECT_SPACE);
  
    paramMap.clear();
	paramMap.put("exportFormat", exportFormat);
	paramMap.put("language", language);
	if ("True".equalsIgnoreCase(exportSubProject)) {
		paramMap.put("exportSubProject", exportSubProject);
	}
	String extension = ".txt";
	boolean isEdge = EnoviaBrowserUtility.is(request, Browsers.EDGE);
	boolean isMoz = EnoviaBrowserUtility.is(request, Browsers.MOZILLAFAMILY);
	if (("CSV".equalsIgnoreCase(exportFormat) || "HTML".equalsIgnoreCase(exportFormat))) {
		extension = ".csv";
	}
	if( objectIDsLength == 0 && objectId != null){
		objectIds[0] = objectId;
	}
	if (objectIDsLength == 1) {
		objectId = objectIds[0];
		DomainObject selectedProject = new DomainObject(objectId);
  		Map selectedProjectInfo = selectedProject.getInfo(context, selectable);
  		//String fileName = (String)selectedProjectInfo.get(ProgramCentralConstants.SELECT_NAME);
  		String isProjectSpace = (String)selectedProjectInfo.get(ProgramCentralConstants.SELECT_KINDOF_PROJECT_SPACE);
  	  	String fileName = ProgramCentralUtil.getTitleForProjectType(context, selectedProjectInfo, "true".equalsIgnoreCase(isProjectSpace));
  
  if(!"True".equalsIgnoreCase(isProjectSpace)){
  String errorMessage = ProgramCentralUtil.getPMCI18nString(context,"emxProgramCentral.Project.SelectProject",language);
%>
<script language="javascript" type="text/javaScript">
alert("<%=XSSUtil.encodeForJavaScript(context,errorMessage)%>");
</script>
<%
return;
	}
  try {
		paramMap.put("objectId", objectId);
		StringList projectTasks  = JPO.invoke(context, "emxProjectSpace", null, "exportProjectTaskList", JPO.packArgs(paramMap),StringList.class);
		

	 	String fileEncodeType = request.getCharacterEncoding();
	  	if ("".equals(fileEncodeType) || fileEncodeType == null || fileEncodeType == "null"){
			fileEncodeType=UINavigatorUtil.getFileEncoding(context, request);
	  	}
		fileName = (fileName == null || "null".equalsIgnoreCase(fileName))?"":fileName;
		String saveAsFileName = fileName;
		fileName += extension;
		String saveAs = ServletUtil.encodeURL(fileName);
		String tempFileName = fileName;
		if(!isMoz || isEdge) {
			fileName=FrameworkUtil.encodeURL(tempFileName,"UTF-8");
		} else {
			fileName = "=?UTF-8?B?" + new String(FrameworkUtil.encodeBase64(tempFileName.getBytes("UTF-8"),false), "UTF-8") + "?=";
		}
		
		out.clear();
		response.setContentType ("text/plain;charset="+fileEncodeType);
		response.setHeader ("Content-Disposition", "attachment;filename=" + fileName);
		
		Iterator taskItr = projectTasks.iterator();
		while (taskItr.hasNext()) {
		   String thisLine = (String) taskItr.next();
		   out.println(thisLine);
		}
  } catch(Exception ex) {
	  ex.printStackTrace();
  }
	} else {
		paramMap.put("projectIds", objectIds);
		paramMap.put("programId", programId);
		paramMap.put("extension", extension);
		
		try{			
			if("HTML".equalsIgnoreCase(exportFormat)){
				return;
			}
			JPO.invoke(context, "emxProjectSpace", null, "exportProjectsProcess", JPO.packArgs(paramMap));
			String mailAlertMsg = ProgramCentralUtil.getPMCI18nString(context,"emxProgramCentral.Project.exportMailAlert",language);
			%>
				<script language="javascript" type="text/javaScript">
					alert("<%=XSSUtil.encodeForJavaScript(context,mailAlertMsg)%>");
				</script>
			<%
		}		
		catch(Exception ex){
			if(ex.getMessage().contains("FoundationUserException")){
				String[] exceptionMessage = ex.getMessage().split(":");
				String message = exceptionMessage[exceptionMessage.length-1];
				%>
				<script language="javascript" type="text/javaScript">
					alert("<%=XSSUtil.encodeForJavaScript(context,message)%>");
				</script>
				<%
			}
		}
	}
 %>

