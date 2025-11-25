<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../components/emxComponentsTreeUtilInclude.inc" %>
<%@include file = "../components/emxComponentsUtil.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<%@page import="java.util.Enumeration"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%

	try {
		String parentOID     = emxGetParameter(request, "parentOID");
		String objectId     = emxGetParameter(request, "objectId");
		DomainObject dobArtworkMaster = new DomainObject(parentOID);
		String strType = "";
		strType = dobArtworkMaster.getInfo(context, DomainConstants.SELECT_TYPE);
		String strSymbolicTypeName = ArtworkMaster.getArtworkElementType(context, strType, false, true);
		String sURL = AWLUtil.strcat("../common/emxCreate.jsp?type=",strSymbolicTypeName,"&header=emxAWL.Action.CreateNewLocalCopyElement&form=AWLForm_CopyElementCreate&createJPO=AWLCopyElementUI:createLocalCopyElement&policy=policy_ArtworkElementContent&nameField=autoName&typeChooser=false&parentOID=",parentOID,"&objectId=",objectId,"&submitAction=refreshCaller&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&HelpMarker=emxhelpcreatelocalcopy&postProcessURL=../awl/AWLArtworkElementCreatePostProcess.jsp");
	%>	    
<script language="javascript" type="text/javaScript">
		//var strURL ="../common/emxCreate.jsp?type=<%=strSymbolicTypeName%>&header=emxAWL.Action.CreateNewLocalCopyElement&form=AWLForm_CopyElementCreate&mode=create&policy=policy_ArtworkElementContent&nameField=autoName&typeChooser=false&objectId=parentOID&relationship=ArtworkContent&direction=from&submitAction=treeContent";
	//var strURL ="../common/emxCreate.jsp?type=<%=strSymbolicTypeName%>&postProcessJPO=AWLCopyElementUI:connectElementToMaster&header=emxAWL.Action.CreateNewLocalCopyElement&form=AWLForm_CopyElementCreate&mode=create&policy=policy_ArtworkElementContent&nameField=autoName&typeChooser=false&parentOID=<%=parentOID%>&submitAction=refreshCaller&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&HelpMarker=emxhelpcreatelocalcopy";
			document.location.href="<xss:encodeForJavaScript><%=sURL%></xss:encodeForJavaScript>";
</script>
	<%
	}catch(Exception e)
	{	    
		throw new Exception(e.toString());	
	}
	%>
	<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
	
	
