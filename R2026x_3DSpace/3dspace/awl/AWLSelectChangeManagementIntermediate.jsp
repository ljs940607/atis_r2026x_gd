<%-- AWLSelectChangeManagementIntermediate.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>

<%@page import = "com.matrixone.apps.domain.*"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<%
	String objectId = emxGetParameter(request,"objectId");
	String emxTableRowId = emxGetParameter(request,"emxTableRowId");
	String selROWID = AWLUIUtil.getObjIdFromRowId(emxTableRowId);
	String suiteKey = emxGetParameter(request, "suiteKey");
    String sURL = "";

    try
	{
        POA poa = new POA(selROWID);
        if(AWLState.OBSOLETE.get(context, AWLPolicy.POA).equals(poa.getInfo(context, DomainConstants.SELECT_CURRENT)))
        {
            String strAlertMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.ObsoletedPOAs");
            %>
                <script language="javascript" type="text/javaScript">
                	//XSSOK strAlertMessage :  Local variable coming from Res Bundle-I18N
                    alert("<%=strAlertMessage%>");
                    getTopWindow().closeSlideInDialog();
            	</script>
            <%
            return;
        }
        else if(!AWLState.RELEASE.get(context, AWLPolicy.POA).equals(poa.getInfo(context, DomainConstants.SELECT_CURRENT)))
        {
           sURL = AWLUtil.strcat("../awl/AWLArtworkPackageCancellation.jsp?objectId=",objectId,"&cmd=poaObsolete&refreshmode=poaObsolete");
        } 
        else 
        {
           sURL = AWLUtil.strcat("../common/emxForm.jsp?mode=edit&formHeader=emxAWL.ECM.POA.Obsolete&form=AWLSelectChangeManagementForm&submitAction=refreshCaller&targetLocation=slidein&preProcessJPO=AWLPOAUI:changeManagementObsoletePOAPreProcess&postProcessURL=../awl/AWLSelectChangeManagementProcess.jsp","&suiteKey=",suiteKey,"&StringResourceFileId=emxAWLStringResource");
        }
		%>
		<form name="selectChangeManagementFrom" action="<%=XSSUtil.encodeURLForServer(context, sURL)%>" method="post" >
			<%@include file="../common/enoviaCSRFTokenInjection.inc" %>
			<input type="hidden" name="emxTableRowId" value="<%=XSSUtil.encodeForHTMLAttribute(context, emxTableRowId)%>" />
            <input type="hidden" name="artworkmode" value="POAObsolete" />
            <input type="hidden" name="objectId" value="<%=XSSUtil.encodeForHTMLAttribute(context, objectId)%>" />
		 </form>
	     <%
	}
    catch(Exception e)
    {
        e.printStackTrace();
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
    }
	%>
	<script language="javascript" type="text/javaScript">
		document.selectChangeManagementFrom.submit();
	</script>
