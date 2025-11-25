<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@ page import="java.util.List" %>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.dao.CopyList"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../components/emxComponentsTreeUtilInclude.inc"%>
<%@include file = "../components/emxComponentsUtil.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%> 
<%@include file = "../emxTagLibInclude.inc"%> 
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>

<%
try
{
	String submitAction = request.getParameter("SubmitAction");
	String functionality = request.getParameter("functionality");
	String name = request.getParameter("Name");
	String title = request.getParameter("Title");
	String description = request.getParameter("Description");
	String[] artworkusages = request.getParameterValues("artworkUsageSelection");
	String contextObjectId = request.getParameter("contextObjectId");
	String placeOfOriginId = request.getParameter("PlaceOfOriginOID");
	String selectedCountryList = request.getParameter("h_SelectedCountries");
	String selectedLanguageList = request.getParameter("h_SelectedLanguages");
	String copyListId = emxGetParameter(request, "selectedCopyListId");
	boolean isProductLineContext = BusinessUtil.isKindOf(context, placeOfOriginId, AWLType.PRODUCT_LINE.get(context));
	String frameName = isProductLineContext ? "AWLProductLineArtworkElements" : "AWLMasterLabelElements";

	Map attributeDetails = new HashMap();
	attributeDetails.put("name", name);
	attributeDetails.put("title", title);
	attributeDetails.put("description", description);

	CopyList copyList = new CopyList(copyListId);
	CopyList copiedCopyList = copyList.copyCopyList(context, attributeDetails, selectedCountryList, selectedLanguageList, artworkusages, placeOfOriginId);
	Map copiedCopyListMap = copiedCopyList.getInfo(context, BusinessUtil.toStringList(DomainConstants.SELECT_ID, DomainConstants.SELECT_NAME));
	
	String copiedCopyListId = (String) copiedCopyListMap.get(DomainConstants.SELECT_ID);
	String copiedCopyListName = (String) copiedCopyListMap.get(DomainConstants.SELECT_NAME);

	String copyListCreatedMessage = AWLPropertyUtil.getI18NString(context,"emxAWL.Copy.CopyList");
	String actionURL = "../common/emxTree.jsp?AppendParameters=true&objectId=" + XSSUtil.encodeForURL(context,placeOfOriginId) + "&emxSuiteDirectory=AWL";

	%>
	<script language="javascript" type="text/javaScript">
		
		//XSSOK i18N
		alert("<xss:encodeForJavaScript><%=copyListCreatedMessage%></xss:encodeForJavaScript>");
		
		<%	
		if("Submit".equalsIgnoreCase(submitAction)) 
		{
			//IR-697954-3DEXPERIENCER2020x
			copiedCopyListId = copiedCopyListId + "|" + copyListId;
			%>
			getTopWindow().closeSlideInDialog();
			var copyListEditURL="../awl/AWLPOAEdit.jsp?functionality=CopyListEdit&suiteKey=AWL&copyListId=<%=XSSUtil.encodeForURL(context,copiedCopyListId)%>&type=CopyList";
			getTopWindow().showModalDialog(copyListEditURL,600,400,true,'Large');
			<%
		}
		%>
		
		<%
		if(placeOfOriginId.equalsIgnoreCase(contextObjectId)) 
		{
			%>
				findFrame(getTopWindow(), "<%=XSSUtil.encodeForJavaScript(context, frameName)%>").location.reload();
			<%
		}
		else 
		{
			%>
			loadTreeNode("<%=XSSUtil.encodeForJavaScript(context, placeOfOriginId)%>", null, null, "AWL", true, "<%=XSSUtil.encodeForJavaScript(context, actionURL)%>");
			var artworkElementsFrame = findFrame(getTopWindow(), "<%=XSSUtil.encodeForJavaScript(context, frameName)%>");		
			artworkElementsFrame.location.href=artworkElementsFrame.location.href;
			<%
		}
		%>
	</script>
	<%
}
 catch(Exception e)
 {
	 String alertMsg = e.getMessage();
	 %>
	  <script language="javascript" type="text/javaScript">
		alert("<xss:encodeForJavaScript><%=alertMsg%></xss:encodeForJavaScript>");
	  </script>
	<%
}
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
