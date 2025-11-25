<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="org.apache.jasper.tagplugins.jstl.core.ForEach"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.dao.CopyList"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.domain.util.MessageUtil"%>

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../components/emxComponentsUtil.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>

<%   
	boolean isCLAllowedToRemove = false;
    try { 
    	
    	String strParentId = emxGetParameter(request, "parentOID");
    	String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowId");  
    	String copyListIds[] = AWLUIUtil.getObjIdsFromRowIds(arrTableRowIds);
    	StringList selectedCLIds = StringList.create(copyListIds);
    	String strAlertMessage = "";
    	
    	isCLAllowedToRemove = BusinessUtil.isMatching(BusinessUtil.isKindOf(context, copyListIds,AWLType.COPY_LIST.get(context)), true, true);
    	
    	if(!isCLAllowedToRemove) {
    		String message = MessageUtil.getMessage(context, null, "emxAWL.Message.SelectCopyListsForThisOperation", 
	   				null , null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE);
	   			throw new FrameworkException(message);
    	}
    	
    	//STEP-1: Copy List information
		String REL_CL_POA = AWLRel.POA_COPY_LIST.get(context);
		
		StringBuilder relPattern = new StringBuilder(100);
		relPattern.append(REL_CL_POA);
		String poaRELNames = relPattern.toString();
		
		StringBuilder typePattern = new StringBuilder(100);
		typePattern.append(AWLType.POA.get(context));
		String clTypeNames = typePattern.toString();
		
		String SEL_POA_ASSOCIATED = AWLUtil.strcat(AWLConstants.FROM_OPENBRACKET,AWLRel.ASSOCIATED_POA.get(context),AWLConstants.CLOSEBRACKET_TO_ID);
		StringList busSelects = StringList.create(DomainConstants.SELECT_ID, DomainConstants.SELECT_CURRENT);
		StringList relSelects = StringList.create(DomainRelationship.SELECT_ID);
		
		String busWhere = AWLUtil.strcat(AWLConstants.TO_OPENBRACKET,AWLRel.ASSOCIATED_POA.get(context),AWLConstants.CLOSEBRACKET_FROM_ID, "=='" , strParentId, "'");
		
		MapList allCopyListInfo = new MapList();
		for(String currentCLId : copyListIds) {
			CopyList copyList = new CopyList(currentCLId);
			
			MapList currentCLInfo = copyList.getRelatedObjects(context, poaRELNames, clTypeNames, busSelects, relSelects, true, true, (short)1, busWhere, null, 0);
			allCopyListInfo.addAll(currentCLInfo);
		}
    	
		Map<String, MapList> allCLInfoByRelationship = BusinessUtil.groupByKey(allCopyListInfo, "relationship");
		
		
    	//STEP-2: Check for POA
    	MapList allCLPOAInfo = allCLInfoByRelationship.get(REL_CL_POA);
    	if(BusinessUtil.isNullOrEmpty(allCLPOAInfo)) {
    		isCLAllowedToRemove = true;
    	} else {
    		Map<String, MapList> poaInfoByState = BusinessUtil.groupByKey(allCLPOAInfo, DomainConstants.SELECT_CURRENT);
    		
    		String POA_POLICY = AWLPolicy.POA.get(context);	
    		
    		// STEP-3: Check for Review
    		MapList reviewStatePOAs = poaInfoByState.get(AWLState.REVIEW.get(context, POA_POLICY));
    		if(BusinessUtil.isNotNullOrEmpty(reviewStatePOAs)) {
    			isCLAllowedToRemove = false;
	    		strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.POAInReview");
	    		%>
    		       	<script language="javascript" type="text/javaScript">
    		     		//XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
	    		    	alert("<%=strAlertMessage%>");
					</script>
  				<%
				return;
    		}
    		
    		// STEP-4: Check for Draft or Prelim
    		MapList draftStatePOAs = poaInfoByState.get(AWLState.DRAFT.get(context, POA_POLICY));
    		MapList preliminaryPOAs = poaInfoByState.get(AWLState.PRELIMINARY.get(context, POA_POLICY));
    				
    		if(BusinessUtil.isNotNullOrEmpty(draftStatePOAs) || BusinessUtil.isNotNullOrEmpty(preliminaryPOAs)) {
    			isCLAllowedToRemove = false;
    			strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.POAInDraftOrPrelim");
    			%>
    			<script language="javascript" type="text/javaScript">
   	 			//XSSOK 
    	 		if(confirm("<%=strAlertMessage%>")) {
	    			parent.editableTable.cut();
	            		//parent.closeWindow();
    			}
    	 		</script>
    	 	<%}
    	}
    	
    	if(isCLAllowedToRemove) { %>
    		<script language="javascript" type="text/javaScript">
   				parent.editableTable.cut();
           	</script>
    	<% }
 	} catch(Exception e) {
	    e.printStackTrace();
	    if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
%>      <script language="javascript" type="text/javaScript">
			alert(<xss:encodeForJavaScript><%=e.getMessage()%></xss:encodeForJavaScript>);
			//parent.closeWindow();
        </script>
<%	}
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
