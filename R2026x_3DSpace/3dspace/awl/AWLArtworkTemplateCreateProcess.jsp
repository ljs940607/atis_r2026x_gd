<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.domain.*"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkTemplate"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.common.CommonDocument"%>
<%@page import="com.matrixone.apps.common.util.FormBean"%>

<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIUtility.js"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<%
	FormBean formBean=new FormBean();
	formBean.processForm(request.getSession(), request);
%>
<%@include file = "../cpd/CPDFormCSRFValidation.inc"%> 
<%!public String getFormParameter(FormBean formBean, String parameter )
{
	return (String) formBean.getElementValue(parameter);
}%>
	<%
	
	String parentId = request.getParameter("parentOID");
	String openerFrame = emxGetParameter(request, "openerFrame");

	String artworkTemplateId = "";

		try
		{
	    	Map<String, String> artworkTemplateCreationData = new HashMap<String, String>();
	    		    	
	    	//Sy6 : Need to check this
            String charset = response.getCharacterEncoding();
	
			artworkTemplateCreationData.put(DomainConstants.SELECT_TYPE, AWLType.ARTWORK_TEMPLATE.get(context));
			
			artworkTemplateCreationData.put(BusinessUtil.PARENT_ID, parentId);
			artworkTemplateCreationData.put(DomainConstants.SELECT_NAME, getFormParameter(formBean, "txtName"));
			artworkTemplateCreationData.put(DomainConstants.ATTRIBUTE_TITLE, getFormParameter(formBean, "txtTitle"));
			artworkTemplateCreationData.put(CommonDocument.SELECT_FILE_NAME, getFormParameter(formBean, "fileName0"));
			artworkTemplateCreationData.put(DomainConstants.SELECT_DESCRIPTION, new String(getFormParameter(formBean, "txtArtTempDescription").getBytes(),charset));

			ArtworkTemplate artworkTemplate = ArtworkTemplate.createArtworkTemplate(context, artworkTemplateCreationData);
			artworkTemplateId = artworkTemplate.getObjectId(context);

		}catch(Exception ex)
		{
			session.setAttribute("error.message", ex.toString().trim());
			ex.printStackTrace();
		%>
			<script language="javascript" type="text/javaScript">
				
				alert("<xss:encodeForJavaScript><%=ex.getMessage() %></xss:encodeForJavaScript>");
			</script>
		<%
		}
		%>
	<script language="javascript" type="text/javaScript">
		var openerFrame = "<xss:encodeForJavaScript><%=openerFrame%></xss:encodeForJavaScript>";
		
		//SY6 : Logic for refreshment of Artwork Templates table
		if(findFrame(getTopWindow(),openerFrame)!=null)
		{
			getTopWindow().findFrame(getTopWindow(),openerFrame).location.reload();
			getTopWindow().closeSlideInDialog();
		} else {
			getTopWindow().closeSlideInDialog();
		}
	</script>
