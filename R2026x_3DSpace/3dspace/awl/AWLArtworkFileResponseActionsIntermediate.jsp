<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.util.POACompareUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@include file = "../emxUICommonAppInclude.inc"%>

<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../common/scripts/jquery-ui.js"></script>
<script type="text/javascript" src="../common/scripts/emxUITooltips.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>
<script type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>

<link rel="stylesheet" href="connector/styles/AWLArtworkFileUpload.css">

<%
	String mode = emxGetParameter(request,"mode");
	String rowId = emxGetParameter(request,"emxTableRowId");
	
	String poaId = emxGetParameter(request,"objectId");
	String strURL = null;
	if("compare".equals(mode)) {
		String responseMessage = POACompareUtil.validatePOACompare(context, poaId, getServletContext().getRealPath("/awl/xsd/SchemaGS1/gs1/ecom/ArtworkContentResponse.xsd"));
		if(BusinessUtil.isNullOrEmpty(responseMessage)) {
	    	// No failure in the validation. Generate URL.
	    	strURL = POACompareUtil.getCompareURL(context, poaId); %>
	    	<script>
	    		<!-- XSSOK -->
                document.location.href = "<%=strURL%>";
             </script>
	    	<%
	   } else {
%>			<!-- XSSOK -->
          <div class="MessageContainer"> <%=XSSUtil.encodeForHTML(context, responseMessage) %></div>
<%     } 
	} else  if("upload".equals(mode)) {
		strURL = POACompareUtil.getUploadURL(context, poaId);
	%>
		<script language="Javascript">
		    //XSSOK
		    document.location.href = "<%=strURL%>";
		</script>
		<%
			} else  if("remove".equals(mode)) {
				//Content not present in POA
				String result = POACompareUtil.removePOAElements(context, poaId, emxGetParameterValues(request,"emxTableRowId"));
				if(BusinessUtil.isNullOrEmpty(result)) {
		%> <script> refreshTableFrame("AWLArtworkResponseRoundTripSummary"); </script> <%
		} else { %> 
			<script language="Javascript">
			<!-- XSSOK -->
				alert("<%=XSSUtil.encodeForJavaScript(context, result)%>");
			</script>
		<%}
	} else  if("sync".equals(mode)) {
		String result = "";
		try{
			result = POACompareUtil.syncPOAElements(context, poaId, emxGetParameterValues(request,"emxTableRowId"));
		}catch(Exception e) {
			result = e.getMessage();
		}
		if(BusinessUtil.isNullOrEmpty(result)) {%>
			 <script> refreshTableFrame("AWLArtworkResponseRoundTripSummary"); </script>
		<% } else { %>
			<script language="Javascript">
				//XSSOK
				alert("<%=XSSUtil.encodeForJavaScript(context, result)%>");
			</script>
		<%}
	} else  if("EditPOA".equals(mode)) {
    	String typeOfPOA = POA.standardOrCustomOrMixed(context, new StringList(poaId));
    	
    	 %>
    	<script language="javascript" type="text/javaScript"> 
		 	 var functionalityName="AWLPOAEdit";
			 var isCustom = false;
		 <%
    	if(AWLConstants.RANGE_POABASIS_MARKETING_CUSTOMIZATION.equalsIgnoreCase(typeOfPOA)) { %>
                    functionalityName ="AWLCustomizePOAEdit";
            		isCustom = true;
		<% } %>
        var poaEditURL="../awl/AWLPOAEdit.jsp?functionality="+functionalityName+"&suiteKey=AWL&poaIds=<%=XSSUtil.encodeForURL(context, poaId)%>&isCustomizedPOA="+isCustom;
        showModalDialog(poaEditURL,600,400,true,'Large');          
        </script> <%   
	}
%> 
