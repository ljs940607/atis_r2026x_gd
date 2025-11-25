<%-- AWLSearchSupplierToAssignPOAs.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<%@ include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>

<!-- XSSOK request.getHeader : Header value -->
<emxUtil:localize id="i18nId" bundle="emxAWLStringResource" locale='<%=request.getHeader("Accept-Language")%>' />
<%
	String[] emxTableRowId = (String[])request.getParameterValues("emxTableRowId");
    String[] poaIDs        =  AWLUIUtil.getObjIdsFromRowIds(emxTableRowId);
     
    StringList poaState = BusinessUtil.getInfo(context, BusinessUtil.toStringList(poaIDs), DomainConstants.SELECT_CURRENT);
    String OBSOLETE = AWLState.OBSOLETE.get(context, AWLPolicy.POA);
    boolean hasObsoletePOA = BusinessUtil.matchingAnyValue(poaState, BusinessUtil.toStringList(OBSOLETE));
          
    String selectedPOAs    = FrameworkUtil.join(poaIDs, ",");

    String objectId = request.getParameter("objectId");
    String parentId = request.getParameter("parentOID");
    String action = request.getParameter("action");
    
    String sURL = "";
    
    if("associatePackaging".equals(action)) {
         sURL = AWLUtil.strcat("../common/emxFullSearch.jsp?field=TYPES=type_Part:Type!=type_POA:LASTREVISION=TRUE&table=AEFGeneralSearchResults&selection=multiple&suiteKey=AWL&header=emxAWL.Search.SelectPOAPackagePart&submitURL=../awl/AWLPOAPackagingPartAssociate.jsp&objectId=",
        	     objectId,"&selectedPOA=",selectedPOAs,"&parentOID=",parentId);
    	 
     }
     else {
         sURL = AWLUtil.strcat("../common/emxFullSearch.jsp?field=TYPES=type_Organization&suiteKey=AWL&SuiteDirectory=awl&table=PLCDesignResponsibilitySearchTable&selection=single&hideHeader=true&HelpMarker=emxhelpassigningsupplierPOA&emxSuiteDirectory=awl&submitURL=../awl/AWLAddSupplierToPOA.jsp&objectId=",
        	     objectId,"&selectedPOA=",selectedPOAs,"&parentOID=",parentId);
     }
%>

<script type="text/javascript">
    //XSSOK hasObsoletePOA value coming from logic
    <framework:ifExpr expr="<%=hasObsoletePOA%>">
		alert ("<emxUtil:i18n localize="i18nId">emxAWL.ObsoletePOA.Selection.Error</emxUtil:i18n>");
		
    </framework:ifExpr>
    
    //XSSOK hasObsoletePOA value coming from logic
    <framework:ifExpr expr="<%=!hasObsoletePOA%>">    
        var submitURL = "<%=XSSUtil.encodeURLForServer(context, sURL)%>";
	showModalDialog(submitURL,850,630,"true","Medium");
    </framework:ifExpr>
</script>

