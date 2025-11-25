<%-- This file is for Opening the Window on clicking the Top links in Content Page.
  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
--%>

<%@page import="java.util.StringJoiner"%>
<%@page import="com.matrixone.apps.domain.util.MapList"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@ include file = "../emxUICommonAppInclude.inc"%>
<%@page import="com.matrixone.apps.framework.ui.UIUtil"%>
<script type="text/javascript" src="./scripts/emxUICore.js"></script>
<script type="text/javascript" src="./scripts/emxUIModal.js"></script>
<script type="text/javascript" src="../emxUIPageUtility.js"></script>
<script type="text/javascript" src="./scripts/emxUIConstants.js"></script>
<script type="text/javascript" src="../webapps/AmdLoader/AmdLoader.js"></script>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICoreMenu.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIToolbar.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIEsignDialog.js"></script>
<script type="text/javascript" src="../common/scripts/emxUINavigator.js"></script>

<%
	String fromPage   = emxGetParameter(request, "fromPage");
	String objectId   = emxGetParameter(request, "objectId");
	String parentOID   = emxGetParameter(request, "parentOID");
	String timeStamp	= emxGetParameter(request, "timeStamp");
	String languageStr 			= request.getHeader("Accept-Language");
	int lifeCycleTasksCount=0;
    session.removeAttribute("VerificationCount");	
    String action = "";
	String taskAssigneeUserName 	 = context.getUser();
	String  currTenantId = "OnPremise";
	if(!FrameworkUtil.isOnPremise(context)){   	
		currTenantId = context.getTenant();
	}
	String attr_RequiresEsign          = PropertyUtil.getSchemaProperty(context, "attribute_RequiresESign");
	String selectRequiresEsign = "from[" + DomainConstants.RELATIONSHIP_ROUTE_TASK + "].to.attribute[" + attr_RequiresEsign + "]";

	boolean requireAuthentication = false;
	String esignConfigSetting ="None";
	String taskPhysicalIds = "";
   try{
		String initargs[] = {};
		HashMap params = new HashMap();
		MapList taskSummaryList = (MapList)JPO.invoke(context, "emxInboxTask", initargs, "getActiveTasks", JPO.packArgs (params), Object.class); 
		String []taskListIds = new String[taskSummaryList.size()];
		if("AEFLifecycleMassApproveTask".equalsIgnoreCase(fromPage) && objectId!=null){
			Map paramMap = new HashMap();
			paramMap.put("objectId", objectId);
			paramMap.put("languageStr", languageStr);
			//To get current assigned tasks count for the object
			MapList resultMap= (MapList)JPO.invoke(context, "emxLifecycle", null, "getCurrentAssignedTaskSignaturesOnObject",JPO.packArgs(paramMap), MapList.class);
			lifeCycleTasksCount = resultMap.size();
		}
		
		for(int i=0; i<taskSummaryList.size(); i++){
			Map map = (Map) taskSummaryList.get(i);
			taskListIds[i] = (String) map.get("id");
		}
		StringList masterSelects = new StringList();
		masterSelects.add(DomainObject.SELECT_TYPE);
		masterSelects.add(DomainObject.SELECT_NAME);
		masterSelects.add(selectRequiresEsign);
		masterSelects.add("attribute["+DomainConstants.ATTRIBUTE_ROUTE_ACTION+"]");
		masterSelects.add(DomainObject.SELECT_PHYSICAL_ID);
		masterSelects.add(DomainObject.SELECT_CURRENT);
		MapList mlist = DomainObject.getInfo(context, taskListIds, masterSelects);
		DomainObject genericDomainObject = new DomainObject();
		String taskCurrent = "";
		String taskObjRouteAction = "";
		String objRequiresESign = "";
		for(int i=0; i<mlist.size(); i++){
			Map map = (Map) mlist.get(i);
			objRequiresESign = (String) map.get(selectRequiresEsign);
			taskObjRouteAction = (String) map.get("attribute["+DomainConstants.ATTRIBUTE_ROUTE_ACTION+"]");
			taskCurrent = (String) map.get(DomainObject.SELECT_CURRENT);
			if("True".equalsIgnoreCase(objRequiresESign) && !"Review".equalsIgnoreCase(taskCurrent) && !"Comment".equalsIgnoreCase(taskObjRouteAction)){
				requireAuthentication=true;
				break;
			}else{
				requireAuthentication=false;
			}
		}
		StringJoiner joiner = new StringJoiner(",");
		for(int i=0; i<mlist.size(); i++){
			Map map = (Map) mlist.get(i);
			String physicalId = (String) map.get(DomainObject.SELECT_PHYSICAL_ID);
			joiner.add(physicalId);
		}
		taskPhysicalIds = joiner.toString();
	   /* esignConfigSetting = MqlUtil.mqlCommand(context, "list expression $1 select $2 dump","ENXESignRequiresESign", "value");
		if( UIUtil.isNullOrEmpty(esignConfigSetting) || ("").equals(esignConfigSetting))
			esignConfigSetting="None";  */
   }
    catch (Exception e){
	   esignConfigSetting="None";
   }
   /* if("RouteSpecific".equalsIgnoreCase(esignConfigSetting)||"All".equalsIgnoreCase(esignConfigSetting))
   {
	   requireAuthentication=true;
   } */
   
	boolean showUserName = "true".equalsIgnoreCase(EnoviaResourceBundle.getProperty(context, "emxFramework.Routes.ShowUserNameForFDA"));
    
    if(fromPage.equals("AEFLifecycleMassApproveTask")) {
        boolean signatureApprovalPasswordConfirmation = "true".equalsIgnoreCase(EnoviaResourceBundle.getProperty(context, "emxFramework.LifeCycle.ApprovalPasswordConfirmation"));
		action = "emxTableEdit.jsp?program=emxLifecycle:getCurrentAssignedTaskSignaturesOnObject&table=AEFMyTaskMassApprovalSummary&selection=multiple&header=emxComponents.LifecycleTasks.Heading.ApproveAssignedTasks&postProcessURL=emxLifecycleTasksMassApprovalProcess.jsp&HelpMarker=emxhelpmassapprove&suiteKey=Components&StringResourceFileId=emxComponentsStringResource&SuiteDirectory=components&objectId=";
		
		if(requireAuthentication){
			action = action + XSSUtil.encodeForJavaScript(context, objectId) + "&parentOID=" + XSSUtil.encodeForJavaScript(context, parentOID);
		}else{
			action = action + XSSUtil.encodeForURL(context, objectId) + "&parentOID=" + XSSUtil.encodeForURL(context, parentOID);
		}
        if(requireAuthentication || signatureApprovalPasswordConfirmation) {
            String taskAndSignatureTypes = (String) matrix.db.JPO.invoke(context, "emxLifecycle", null, "getTypesToMassApprove", new String[]{objectId}, String.class);
            if("Both".equals(taskAndSignatureTypes)) {
                requireAuthentication = true;
            } else if("IT".equals(taskAndSignatureTypes) && requireAuthentication) {
                requireAuthentication = true;
            } else if("Signature".equals(taskAndSignatureTypes) && signatureApprovalPasswordConfirmation) {
                requireAuthentication = true;
                showUserName = false;
            } else {
                requireAuthentication = false;
            }
            
        }
    } else if(fromPage.equals("APPUserTaskMassApproval")) {
        action = "emxTableEdit.jsp?program=emxLifecycle:getAllAssignedTasks&table=AEFMyTaskMassApprovalSummary&selection=multiple&header=emxComponents.Common.TaskMassApproval&postProcessURL=emxLifecycleTasksMassApprovalProcess.jsp&HelpMarker=emxhelpmytaskmassapprove&suiteKey=Components&StringResourceFileId=emxComponentsStringResource&SuiteDirectory=component";
    } else if(fromPage.equals("APPEditAllMultiTasks")) {
        action = "emxTableEdit.jsp?HelpMarker=emxhelpeditalltasks2&suiteKey=Components&StringResourceFileId=emxComponentsStringResource&SuiteDirectory=components&objectId=" + XSSUtil.encodeForURL(context, objectId) + "&parentOID=" + XSSUtil.encodeForURL(context, parentOID) + "&timeStamp=" + XSSUtil.encodeForURL(context, timeStamp);
    } else if(fromPage.equals("APPMultiTaskComplete")) {
        String[] taskIds = emxGetParameterValues(request, "emxTableRowId");
        String taskIdsKey = "APPMultiTaskComplete:" + System.currentTimeMillis();
        action = "../components/emxMultitaskCompleteProcess.jsp?taskIdsKey=" + taskIdsKey;
        session.setAttribute(taskIdsKey, taskIds);
    }
%>
    <body>
    	<form name="TaskMassApproveForm" id="TaskMassApproveForm" method="post">
<%
	if(requireAuthentication) {
%>
		<!-- //XSSOK -->
		<input type="hidden" id="pageAction" name="pageAction" value='<%=action%>' />
		<!-- //XSSOK -->
		<input type="hidden" id="showUserName" name="showUserName" value='<%=showUserName%>' />
		<script language="Javascript" >
		var jsonObj = {"taskAssigneeUserName":"<%=taskAssigneeUserName%>", "currTenantId":"<%=currTenantId%>","taskPhysicalIds":"<%=taskPhysicalIds%>"};
		if(<%="APPUserTaskMassApproval".equalsIgnoreCase(fromPage)%>){
		var fromJSP = "taskMaskApprovalProcess";
		var topWindowOpener = getTopWindow().getWindowOpener().parent;
		try{
			if (topWindowOpener) {
		        if (topWindowOpener.parent && topWindowOpener.parent.launchMassApprovalEsignAuthDialog != undefined) {
					//Mass Approval for Assigned Tasks
		            topWindowOpener.parent.launchMassApprovalEsignAuthDialog('<%= action %>', fromJSP, jsonObj);
		        } else if (topWindowOpener.launchMassApprovalEsignAuthDialog != undefined) {
		        	//Task Mass Approval
					topWindowOpener.launchMassApprovalEsignAuthDialog('<%= action %>', fromJSP, jsonObj);
		        } else if(getTopWindow().getWindowOpener().getTopWindow() != undefined && getTopWindow().getWindowOpener().getTopWindow().parent != undefined && getTopWindow().getWindowOpener().getTopWindow().parent.launchMassApprovalEsignAuthDialog != undefined){
		        	getTopWindow().getWindowOpener().getTopWindow().parent.launchMassApprovalEsignAuthDialog('<%= action %>', fromJSP, jsonObj);
		        }
		    } else {
		        console.log("topWindowOpener is not available.");
		    }
		}catch(e){
			console.log("Error in launching eSignDialog"+e);
		}
		getTopWindow().closeWindow();
		}
		else if(<%="AEFLifecycleMassApproveTask".equalsIgnoreCase(fromPage)%>)
		{
			
		var fromJSP = "lifeCycleMassApprovalProcess";    		
		getTopWindow().getWindowOpener().getTopWindow().launchMassApprovalEsignAuthDialog('<%=action%>',fromJSP, jsonObj,'<%=lifeCycleTasksCount%>');
		getTopWindow().closeWindow();
		}
		
  	   </script>
<%	        
	    } else { 
%>
				<!-- //XSSOK -->
				<script language="Javascript" >
		    		var TaskMassApproveForm=document.getElementById("TaskMassApproveForm");
					//XSSOK
					TaskMassApproveForm.action = "<%=action%>";
					TaskMassApproveForm.submit();	        
				</script>			
<%	        
	        } 	   
%>
		</form>
	</body>

