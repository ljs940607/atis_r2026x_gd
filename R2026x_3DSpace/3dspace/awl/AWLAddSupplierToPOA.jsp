<%-- AWLAddSupplierToPOA.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>

<%-- Common Includes --%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>

<%@ include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%> 
<%
	try
  {
	 // object Id of Selected POA on parent page
     String strSelectedPOA =request.getParameter("selectedPOA");
	 if(BusinessUtil.isNullOrEmpty(strSelectedPOA)) {
		 strSelectedPOA =request.getParameter("objectId");
	 }
     StringList poaList    =FrameworkUtil.split(strSelectedPOA, ",");
     // selected organizantions
     String[] emxTableRowId = (String[])request.getParameterValues("emxTableRowId");
     String strSelectedOrganization = emxTableRowId[0];
     String orgId = AWLUIUtil.getObjIdFromRowId(strSelectedOrganization);
     DomainObject orgObj = new DomainObject(orgId);

     for(Iterator itr = poaList.iterator(); itr.hasNext();) { 
    	   POA poa = new POA((String)itr.next());
    	   poa.addSupplier(context, orgObj);
     }

  }  
  catch(Exception e)
  {
    session.setAttribute("error.message", e.getMessage());
  }
%>
  
<%@page import="java.util.Iterator"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="javascript" type="text/javaScript">
	var detailsFrame= getTopWindow().findFrame(getTopWindow().getWindowOpener().getTopWindow(), "AWLPOAProperties");
	if(!detailsFrame){
		detailsFrame= getTopWindow().findFrame(getTopWindow().getWindowOpener().getTopWindow(), "detailsDisplay");
	}
	getTopWindow().closeWindow(); 
	detailsFrame.location.href = detailsFrame.location.href;
 </script>



