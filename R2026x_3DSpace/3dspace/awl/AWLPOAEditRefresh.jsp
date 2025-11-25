<%@include file = "../emxUICommonAppNoDocTypeInclude.inc"%>

<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="matrix.util.StringList"%>

<script language="javascript" src="scripts/emxUICore.js"></script>

<%
String newElementId = request.getParameter("newObjectId");
String selectedPOAId =request.getParameter(AWLConstants.SELECTED_POA_ID);
StringList poaIds = FrameworkUtil.split(selectedPOAId, ",");
//Need to add the Transaction context instead of session context to query for the object which is not yet commited the transaction.
Context ctx = (Context) request.getAttribute("context");
if(BusinessUtil.isNotNullOrEmpty(selectedPOAId) && BusinessUtil.isNotNullOrEmpty(newElementId))
{
		try 
		{
			ArtworkMaster artworkMaster = new ArtworkMaster(newElementId);
			artworkMaster.openObject(ctx);
			//Connect Element with POA. In case of failure throw exception with message. 
			artworkMaster.addPOAs(ctx, poaIds);
		} 
		catch (Exception e) 
		{
			 throw new ServletException(e);
	    } 
}
 %>
  <script type="text/javaScript">
	  getTopWindow().getWindowOpener().customEditUtil.addNewTableRow("<%=XSSUtil.encodeForJavaScript(ctx, newElementId)%>");
	  getTopWindow().getWindowOpener().editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
  </script>
