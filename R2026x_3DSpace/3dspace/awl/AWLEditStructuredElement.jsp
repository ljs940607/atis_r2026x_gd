<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLInterface"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>

<%@page import = "matrix.util.StringList"%>

<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import = "com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%-- Common Includes --%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>

<%
	String strMode = emxGetParameter(request, "mode");
	String objectid = emxGetParameter(request,"objectId");
	String rowId = emxGetParameter(request,"emxTableRowId");
	objectid = BusinessUtil.isNotNullOrEmpty(rowId) ? AWLUIUtil.getObjIdFromRowId(rowId) :  objectid;
	Boolean isStructure = true;
	String strStructureSel = AWLInterface.STRUCTURED_MASTER_ELEMENT.getSel(context);
	if("edit".equalsIgnoreCase(strMode)) {
		
		 String strIsStructureRoot = BusinessUtil.getInfo(context, objectid, strStructureSel);
		 if(AWLConstants.RANGE_FALSE.equalsIgnoreCase(strIsStructureRoot)) {
			 isStructure = false;
		 }
	} else if("view".equalsIgnoreCase(strMode)){
		String strStructureObjIdSel = AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.id");
		strStructureSel = AWLUtil.strcat("to[", AWLRel.ARTWORK_ELEMENT_CONTENT.get(context), "].from.",strStructureSel);
		Map result = BusinessUtil.getInfo(context, objectid, StringList.create(strStructureObjIdSel, strStructureSel));
		objectid =  (String)result.get(strStructureObjIdSel);
		if(AWLConstants.RANGE_FALSE.equalsIgnoreCase((String)result.get(strStructureSel))) {
			isStructure = false;
		}
	}
    
    if(isStructure) {
 %>
 <script language="javascript" type="text/javaScript"> 
			var nutritionEditURL="../webapps/ENOStructureCopy/ENOStructureCopy.html?functionality=NutriFactEdit&type=xyz&suiteKey=AWL&nutritionId=<%=XSSUtil.encodeForURL(context,objectid)%>";
			getTopWindow().showModalDialog(nutritionEditURL,600,400,true,'Large');
</script> 
<% 
    } else { 
    	String errorMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.StructureElementInvalid");
    	%>
    	<script language="javascript" type="text/javaScript"> 
			alert("<%=XSSUtil.encodeForJavaScript(context, errorMessage)%>");
		</script>
    <%}

%> 
   <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

