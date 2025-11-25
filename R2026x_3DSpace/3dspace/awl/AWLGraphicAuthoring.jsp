<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkContent"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@include file="../emxUICommonAppNoDocTypeInclude.inc" %>
<%
String objectId = request.getParameter("objectId");
if(BusinessUtil.isKindOf(context, objectId, AWLType.ARTWORK_INBOX_TASK.get(context))) {
	Map tcMap = ArtworkContent.getArtworkInboxTaskContentInfo(context, objectId);
	objectId = BusinessUtil.getString(tcMap, "contentId");
}

String strURL = AWLUtil.strcat("../awl/AWLGraphicManagementUtil.jsp?mode=fileVersions&objectId=", XSSUtil.encodeForURL(context, objectId));
%>

<iframe src="<%=XSSUtil.encodeURLForServer(context, strURL)%>" width="100%" height="100%" name="detailsDisplay" frameborder="0"></iframe>
