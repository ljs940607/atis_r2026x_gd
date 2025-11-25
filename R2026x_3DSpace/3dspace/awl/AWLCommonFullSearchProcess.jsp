<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.awl.dao.CustomizationPOA"%>
<%@include file="../emxUICommonAppInclude.inc"%>

<%@ page import = "com.matrixone.apps.domain.util.*" %> 
<%@ page import = "java.util.Set" %> 
<%@ page import = "java.util.HashSet" %> 
<%@ page import = "com.matrixone.apps.domain.*" %> 
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<script language="JavaScript" src="../common/scripts/emxUIConstants.js"  type="text/javascript"></script>
<script language="javascript" src="../common/scripts/emxUICore.js"></script>
<%
String[] emxTableRowId =emxGetParameterValues(request,"emxTableRowId");
String processContext = emxGetParameter(request,"searchContext");
if(processContext.equalsIgnoreCase("addPOAToPOAEditScreen")){ 
	String[] poaObjectIds = AWLUIUtil.getObjIdsFromRowIds(emxTableRowId);
	%>
	<script>
		var newSelectedPOAIds = '<%=XSSUtil.encodeForURL(context,AWLUtil.strcat( FrameworkUtil.join(poaObjectIds, "|"),"|"))%>';
		getTopWindow().getWindowOpener().addRemoveItemInstance.addPOA(newSelectedPOAIds);
		getTopWindow().closeWindow();
	</script>
	<% 
}
else if("connectComprisedPOA".equalsIgnoreCase(processContext)){ 
	String[] poaObjectIds = AWLUIUtil.getObjIdsFromRowIds(emxTableRowId);
	String selectedPOAIds = emxGetParameter(request,"selectedPOAIds");
	String warningMsg = CustomizationPOA.addComprisedPOAs(context,Arrays.asList(selectedPOAIds.split(",")),Arrays.asList(poaObjectIds));
	%>
	<script>
	var warningMessage='<%=XSSUtil.encodeForJavaScript(context,warningMsg)%>';
	if(warningMessage.length > 0){
		alert(warningMessage);
	}
		getTopWindow().closeWindow();
	</script>
	<% 
}
else if("addCEToPOAFromConnector".equalsIgnoreCase(processContext)){
	String errorMsg = null;
	String[] masterIds = AWLUIUtil.getObjIdsFromRowIds(emxTableRowId);
	
	Set<String> set = new HashSet<String>(masterIds.length);
	boolean bError = false;
	for(int i=0 ; i < masterIds.length; i++){	
		DomainObject domObj = DomainObject.newInstance(context, masterIds[i]);	
		MapList maplist = domObj.getRevisionsInfo(context, new StringList(new String[] {"id"}), new StringList());
		
		for(int j=0 ; j < maplist.size(); j++){	
			Map m = (Map)maplist.get(j);
            String id = (String) m.get("id");
            if(set.contains(id)) {
            	bError = true;
            	break;
            }
            set.add(id);
		}
		if(bError) {
			break;
		}
	}
	
	if(bError){
		errorMsg = AWLPropertyUtil.getI18NString(context,"AWL.ArtworkElement.MultipleRevisionSelection");
	}
	
	
	%>
	<script>
		var errorMsg = '<%=errorMsg%>';
		
		if(errorMsg == 'null'|| errorMsg == null){
			var newMasterIds = '<%=FrameworkUtil.join(masterIds, ",")%>';
			getTopWindow().getWindowOpener().POA_Edit_Instance.addCEToPOAForConnector(newMasterIds,newMasterIds);
			getTopWindow().closeWindow();
		}else{
			alert(errorMsg);
			getTopWindow().location.reload();
		}
	   
	</script>
	<% 
} else if("addCLToPOAEditScreen".equalsIgnoreCase(processContext)){
	String[] selectedCLIds = AWLUIUtil.getObjIdsFromRowIds(emxTableRowId);
	String selectedPOAIds = emxGetParameter(request,"selectedPOAIds");
	String amIds = null;
	String message = null;
	String alreadyConnectedIds = null;
	String errorMsg = null;
	try{
		Map result = POA.addCopyLists(context, StringList.asList(selectedPOAIds.split(",")), StringList.asList(selectedCLIds));
		amIds = (String)result.get("ids");
		alreadyConnectedIds = (String)result.get("already-connected-ids");
		message = (String)result.get("message");
	} catch(Exception e) {
		errorMsg = e.getMessage();
	}
	%>
	<script>
		var errorMsg = '<%=errorMsg%>';
		var connectedIds = '<%=alreadyConnectedIds%>';
		//debugger;
		if(connectedIds) {
			var targetWindow = getTopWindow().getWindowOpener();
			getTopWindow().closeWindow();
			targetWindow.location.href = targetWindow.location.href;
		}else if(errorMsg == 'null'|| errorMsg == null){
			var ids = "<%= amIds %>";
			var message = "<%= XSSUtil.encodeForJavaScript(context, message) %>";
			//getTopWindow().getWindowOpener().POA_Edit_Instance.addCEToPOAForConnector(newMasterIds,newMasterIds);
			getTopWindow().getWindowOpener().POA_Edit_Instance.postAddExistingCL({ids:ids, message:message});
			getTopWindow().closeWindow();
		}else{
			getTopWindow().getWindowOpener().POA_Edit_Instance.postAddExistingCL({error: errorMsg});
			getTopWindow().closeWindow();
		}
	   
	</script>
	<% 
}
%>
