<%--
	AWLArtworkTemplateDisconnectDelete.jsp

  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program
  
--%>

<%-- Common Includes --%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.common.util.ComponentsUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="matrix.db.JPO"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkTemplate"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>

<%@page import="java.util.List"%>
<%@page import="matrix.db.Context"%>

<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<%
	String[] relIds = emxGetParameterValues(request, "relIdsList");
	StringList relIdsList = BusinessUtil.toStringList(relIds);

	String strMode = emxGetParameter(request, "mode");
	String strParentId = emxGetParameter(request, "parentOID");
	
	String strAlertMessage = "";
	String sURL = "";


    try
    {	
     	if ("disconnect".equalsIgnoreCase(strMode) && BusinessUtil.isNotNullOrEmpty(relIdsList) )
     	{
     		if(BusinessUtil.isKindOf(context, strParentId, AWLType.CPG_PRODUCT.get(context))) {
	     		StringList templateIdList = new StringList(relIdsList.size());
	     		for(String relId : (List<String>) relIdsList){
	     			DomainRelationship dorel = new DomainRelationship(relId);
	     			dorel.open(context);     			
	     			ArtworkTemplate artTemp = new ArtworkTemplate(dorel.getTo());
	     			dorel.close(context);
	     			templateIdList.add(artTemp.getObjectId(context));
	     		}
	     		templateIdList = BusinessUtil.toUniqueList(templateIdList);
	     		
	     		for(String templateId : (List<String>) templateIdList){
	     			JPO.invoke(context, "AWLArtworkTemplate", null, "artworkTemplateDisconnectDeleteNotification", new String[] {templateId, strParentId});
	     		}
     		}

     		// Disconnect all the Artwork Templates
     		DomainRelationship.disconnect(context, relIds);
    	}
     	else if ("delete".equalsIgnoreCase(strMode))
     	{
     		
     		String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowId");
     		String[] artIds = ComponentsUIUtil.getSplitTableRowIds(arrTableRowIds);
     		StringList artTempIds = BusinessUtil.toStringList(artIds);
     		
     		
     		// Deleting the Selected Artwork Templates Connected Documents.	
     		ArtworkTemplate.deleteArtworkTemplateConnectedDocumentObjects(context, artTempIds);
     		
     		// Deleting the Selected Artwork Templates.
     		for (String templateId : artIds)
     		{
     			ArtworkTemplate artTemp = new ArtworkTemplate(templateId); 
     			JPO.invoke(context, "AWLArtworkTemplate", null, "artworkTemplateDisconnectDeleteNotification", new String[] {templateId, ""});
     			artTemp.delete(context);
     		}	
     	}
		%>	
		<script language="javascript" type="text/javaScript">
			//R2J : Refreshing the Artwork Templates table.
			if(findFrame(getTopWindow(),"AWLArtworkTemplateSummaryCommand")!=null)
	          		findFrame(getTopWindow(),"AWLArtworkTemplateSummaryCommand").location.reload();
			else if(findFrame(getTopWindow(),"AWLPOAProperties")!=null)
	          		findFrame(getTopWindow(),"AWLPOAProperties").location.reload();
		</script>
	 	<%
    } 
    catch(Exception e) {
        e.printStackTrace();
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
    }
    	
%>	<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
