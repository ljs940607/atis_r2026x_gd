<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="java.util.StringTokenizer"%>

<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType" %>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>                  
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@ page import="java.text.MessageFormat" %>
<%@ page import="com.matrixone.apps.awl.enumeration.AWLState" %>
<%@ page import="com.matrixone.apps.awl.enumeration.AWLPolicy" %>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="javascript" type="text/javaScript">
var proceed=true;
</script>

<%
	String strLanguage = context.getSession().getLanguage();
	String[] strTableRowIds = emxGetParameterValues(request,"emxTableRowId");
	String[] poaObjectIds = AWLUIUtil.getObjIdsFromRowIds(strTableRowIds);
	String functionality = emxGetParameter(request,"functionality");
	String strObjectID = null;
	boolean isMultiplePOAAction = (poaObjectIds.length>1)?true:false;
	StringList poaObjectList = BusinessUtil.toStringList(poaObjectIds);
	String selectedPOAs = FrameworkUtil.join(poaObjectIds, ",");
	String sURL = "";
		
    
	//start Preprocess          
	if(BusinessUtil.isNotNullOrEmpty(poaObjectList) && !POA.isKindOfPOA(context, poaObjectList)) {
%> 		        
		<script language="javascript" type="text/javaScript">
			//XSSOK I18N label or message	
			alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.selectPOA")%>");
		</script>
<%
	} else {
		boolean flag = false;
		String typeOfPOA = POA.standardOrCustomOrMixed(context, poaObjectList);
		
		if(functionality.equalsIgnoreCase("CreateEvolution")) {
			if(AWLConstants.RANGE_POABASIS_MARKETING_CUSTOMIZATION.equalsIgnoreCase(typeOfPOA) || "Mixed".equalsIgnoreCase(typeOfPOA) ) {
				flag = true;	
%>
				<script language="javascript" type="text/javaScript">
					//XSSOK
					alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.InvalidPOAForEvolution")%>");
				</script>
<%              
				return;
			}
			if(!POA.canCreateNextEvolution(context, poaObjectList)) {
				flag = true;
%> 					<script language="javascript" type="text/javaScript">
				//XSSOK
					<%
						String message = AWLPropertyUtil.getI18NString(context, "emxAWL.CreateEvolution.SelectPOAInStateReleaseObsolete");
						String policyPOA = AWLPolicy.POA.get(context);
						String releasedState = AWLState.RELEASE.get(context, policyPOA);
						String obsoleteState = AWLState.OBSOLETE.get(context, policyPOA);
						String i18NRelease  = AWLPropertyUtil.getStateI18NString(context, policyPOA, releasedState);
						String i18NObsolete  = AWLPropertyUtil.getStateI18NString(context, policyPOA, obsoleteState);
						String combinedState = i18NRelease + "/" + i18NObsolete;
						String formattedMessage = MessageFormat.format(message, combinedState);
					%>
					alert("<%=formattedMessage%>");
				</script>
<%              
			   return;
			 }
		}
			
		if(!flag) {
			sURL = AWLUtil.strcat("../awl/emxAWLCommonFS.jsp?selectedPOAs=",selectedPOAs,"&functionality=",functionality,"&suiteKey=AWL&allowedTypes=type_POA");	
		}
		if(!POA.hasElements(context,poaObjectList)) {
%>				
			<script language="javascript" type="text/javaScript">
				//XSSOK
				proceed = confirm("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.CreateCopyEvolution.POAHasNoElements")%>");
			</script>
<%		
		}
%>
		<body>
			<form name="CopyPOA" method="post">
				<script language="Javascript">
				var isMultiplePOAAction = "<%=isMultiplePOAAction%>";
				if(proceed) {
				  if(isMultiplePOAAction=="true") {
					//show NonModal incase of Multi POA
					getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", false);
				  }else {
					getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", true);
				  }
				} else {
					closeWindow();
				}
				</script>
			</form>
		</body>
<%
	}
		
%>

