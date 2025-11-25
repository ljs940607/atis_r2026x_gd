
<%-- Common Includes --%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil" %>
<%@page import = "java.util.Enumeration" %>
<%@page import = "java.util.StringTokenizer"%>
<%@page import="com.matrixone.apps.domain.util.mxType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.dao.GraphicDocument"%>

<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>

<%
	String masterType = "";
	String strURL = "";
	try
	{
		String strMode = emxGetParameter(request,"mode");
		String strObjectID = emxGetParameter(request, "parentOID");
		String txtType = null;      
		String strLanguage = context.getSession().getLanguage();
		String strAWLArtworkElementCheckAlert = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.CannotPerform");
		String strIncludeSearchTypes = "";
		String strExcludeSearchTypes = AWLPropertyUtil.getConfigPropertyString(context, "emxAWL.ArtworkElementActionsAddExisting.ExcludeSearchTypes");
		
		
	    DomainObject domObjForType =  new DomainObject(strObjectID);
	    txtType = domObjForType.getInfo(context,DomainConstants.SELECT_TYPE);
	    
	    if((mxType.isOfParentType(context, txtType, AWLType.PRODUCT_LINE.get(context)))||(mxType.isOfParentType(context, txtType, AWLType.CPG_PRODUCT.get(context))))
	    {
			if(strMode.equalsIgnoreCase("GraphicElement"))
			{
				strIncludeSearchTypes = FrameworkUtil.join(GraphicDocument.getGraphicDocumentTypes(context),",");
				strURL = "../common/emxFullSearch.jsp?objectId="+strObjectID+"&suiteKey=AWL&txtType="+txtType+"&field=TYPES="+strIncludeSearchTypes+":POLICY!=policy_Version:CURRENT=policy_Asset.state_RELEASED,policy_ArtworkGraphic.state_Preliminary,policy_ArtworkGraphic.state_Review,policy_ArtworkGraphic.state_Release:LATESTREVISION=TRUE&excludeOIDprogram=AWLArtworkElementUI:excludeAvailableGraphicsElements&HelpMarker=emxhelpaddingartwork&selection=multiple&showSavedQuery=true&hideHeader=true&form=AWLAddExistingGraphicForm&table=AWLAddExistingGraphicTable&formInclusionList=AWL_GRAPHIC_MARKETING_NAME&showInitialResults=true&submitURL=../awl/AWLAddExistingArtworkElementIntermediate.jsp?suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=AWL&objectId="+strObjectID+"&mode="+strMode;			
			}
			else if(strMode.equalsIgnoreCase("CopyElement"))
			{
				strIncludeSearchTypes = AWLType.MASTER_COPY_ELEMENT.get(context);
				masterType = AWLType.MASTER_COPY_ELEMENT.get(context);
				strURL = "../common/emxFullSearch.jsp?objectId="+strObjectID+"&suiteKey=AWL&txtType="+txtType+"&field=TYPES="+strIncludeSearchTypes+":Type!="+strExcludeSearchTypes+":CURRENT!=policy_ArtworkElement.state_Obsolete:LASTREVISION=TRUE:IS_STRUCTURED_ELEMENT=False&excludeOIDprogram=AWLArtworkElementUI:excludeAvailableCopyElements&HelpMarker=emxhelpaddingartwork&selection=multiple&showSavedQuery=true&hideHeader=true&form=AWLArtworkElementSearchForm&table=AWLLogicalFeatureSearchResultTable&formInclusionList=AWL_MARKETING_NAME,AWL_COPY_TEXT,DESGIN_RESPONSIBILITY&showInitialResults=true&submitURL=../awl/AWLAddExistingArtworkElementIntermediate.jsp?suiteKey=awl&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl&objectId="+strObjectID+"&masterType="+masterType+"&mode="+strMode;
			}
	    }
          else 
	    {
%>
			<script language="javascript" type="text/javaScript">
			// XSSOK strAWLArtworkElementCheckAlert : Res Bundle-I18N
			alert("<%=strAWLArtworkElementCheckAlert%>");
			</script>
<%
		return;
	    }
	    %>
		<body>   
			<form name="AWLArtworkMasterFullSearch" method="post">  
				<input type=hidden name="excludeOID" value=""/>  
					<script language="Javascript">
						var submitURL = "<%=XSSUtil.encodeURLForServer(context, strURL)%>";
						showModalDialog(submitURL,850,630,"true","Medium");
					</script>
			</form>
		</body>
	<%
	
	}catch(Exception e)
	   {
		session.setAttribute("error.message", e.getMessage());
	   }
	%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
