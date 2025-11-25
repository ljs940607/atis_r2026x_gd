<%-- Common Includes --%>

<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.Access"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkException"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.util.List"%>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<%@include file="../common/enoviaCSRFTokenValidation.inc" %>
<%

	String strAlertMessage = "";	
	try {
		String[] arrTableRowIds = request.getParameterValues("emxTableRowId");
		arrTableRowIds = arrTableRowIds == null ? emxGetParameterValues(request, "emxTableRowIdActual") : arrTableRowIds;
		arrTableRowIds = AWLUIUtil.getObjIdsFromRowIds(arrTableRowIds);
		
		String strSelectedPOA = request.getParameter("selectedPOA");
		if(BusinessUtil.isNullOrEmpty(strSelectedPOA)) {
			 strSelectedPOA = request.getParameter("objectId");
		}
		
	    StringList poaList = FrameworkUtil.split(strSelectedPOA, ",");
	    POA.associatePackagingPart(context, BusinessUtil.toStringArray(poaList), arrTableRowIds);
	} catch (Exception e) {	
		strAlertMessage = e.getMessage();
		//session.setAttribute("error.message", e.getMessage());			
	}
	if(BusinessUtil.isNotNullOrEmpty(strAlertMessage)) {
	
%>
		<script language="javascript" type="text/javaScript">	
			//XSSOK strAlertMessage :  Local variable coming from Res Bundle-I18N
			alert("<%=strAlertMessage%>")
		</script>
<%
		} else {

%>
  		<script language="javascript" type="text/javaScript">	
  		var detailsFrame= getTopWindow().findFrame(getTopWindow().getWindowOpener().getTopWindow(), "detailsDisplay");
  		detailsFrame.location.href = detailsFrame.location.href;
		getTopWindow().closeWindow();

  		</script>
<%
		}
%>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>
