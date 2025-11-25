<%--
	AWLPOABOMPackageLinkDisconnect.jsp

  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program
  
--%>

<%-- Common Includes --%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.common.util.ComponentsUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="matrix.db.JPO"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkTemplate"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>

<%@page import="java.util.List"%>
<%@page import="matrix.db.Context"%>

<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<%
    String strAlertMessage = "";	    
    try
    {
    	   String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowIdActual");	
		   arrTableRowIds = arrTableRowIds == null ? emxGetParameterValues(request, "emxTableRowId") : arrTableRowIds;	
    	   String[] relIds = AWLUIUtil.getRelIdsFromRowIds(arrTableRowIds);
    	   POA.disAssociatePackagingPart(context, relIds);
    } 
    catch(Exception e) {
        e.printStackTrace();
		strAlertMessage = e.getMessage();
    }
    
	if(BusinessUtil.isNotNullOrEmpty(strAlertMessage)) {
		
%>
		<script language="javascript" type="text/javaScript">	
			//XSSOK strAlertMessage :  Local variable coming from Res Bundle-I18N
			alert("<%=strAlertMessage%>")
		</script>
<%
		}

%>
		<script language="javascript" type="text/javaScript">	
  			var frameToReload = getTopWindow().findFrame(getTopWindow(), "detailsDisplay");
			if(frameToReload != null)
			frameToReload.location.href = frameToReload.location.href;	
  		</script>
    	
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
