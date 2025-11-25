<%--
  AWLArtworkTemplateDisconnectDeleteIntermediate.jsp

  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program
  
--%>

<%-- Common Includes --%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>

<%@page import="com.matrixone.apps.awl.dao.AWLObject"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkTemplate"%>

<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>

<%@page import="com.matrixone.apps.common.util.ComponentsUIUtil"%>

<%@page import="java.awt.List"%>
<%@page import="matrix.db.Context"%>

<script src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIModal.js"></script>
<%
	String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowId");
	String[] artIds = ComponentsUIUtil.getSplitTableRowIds(arrTableRowIds);
	StringList artTempIds = BusinessUtil.toStringList(artIds);

	String strMode = emxGetParameter(request, "mode");
	String strParentId = emxGetParameter(request, "parentOID");	
	
	String strAlertMessage = "";
	String sURL = "";
	HashMap infoMap = new HashMap();
 
    try
    {   
    	sURL = AWLUtil.strcat("../awl/AWLArtworkTemplateDisconnectDelete.jsp?parentOID=",strParentId,"&mode=",strMode);
    	%>
		<form name="disconnectOrDeleteForm" action="<%=XSSUtil.encodeURLForServer(context, sURL)%>" method="post" >
			<%@include file="../common/enoviaCSRFTokenInjection.inc" %>
			<% 
			
			if ("disconnect".equalsIgnoreCase(strMode))
			{	
				AWLObject awlObject = (AWLObject)DomainObject.newInstance(context, strParentId, "AWL");
				infoMap = (HashMap) ArtworkTemplate.disconnectArtworkTemplateProcess(context, awlObject, artTempIds);
				
				StringList relIdsList = (StringList) infoMap.get("relIds");
			
				for(int j=0;j<relIdsList.size();j++)
				{
					%>
					<!-- XSSOK relIdsList.get : DB Value - OID or REL ID -->
			       		<input type="hidden" name="relIdsList" value="<%= relIdsList.get(j)%>" />    
			   		<% 
				} 
				
			}
			else if ("delete".equalsIgnoreCase(strMode))
			{
				StringList artworkTemplatesState = BusinessUtil.getInfo(context, artTempIds, DomainConstants.SELECT_CURRENT);
		    	boolean artworkTemplatesinReviewOrRelease = artworkTemplatesState.contains(AWLState.REVIEW.get(context, AWLPolicy.POA)) || 
		    												artworkTemplatesState.contains(AWLState.RELEASE.get(context, AWLPolicy.POA));
		 
				if(artworkTemplatesinReviewOrRelease)
				{
					strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkTemplate.Delete.Error.NotInPreliminaryState");
					%>
						<script language="javascript" type="text/javaScript">
						//XSSOK strAlertMessage :  Local variable coming from Res Bundle-I18N
							alert("<%=strAlertMessage%>");
						</script>
					<%
					return;	
				}
				else
				{
					AWLObject awlObject = (AWLObject)DomainObject.newInstance(context, strParentId, "AWL");
					infoMap = (HashMap) ArtworkTemplate.deleteArtworkTemplateProcess(context, awlObject, artTempIds);
				
					for(int i=0;i<arrTableRowIds.length;i++)            		
					{
						%>
				       		<input type="hidden" name="emxTableRowId" value="<%=XSSUtil.encodeForHTMLAttribute(context, arrTableRowIds[i])%>"/>    
				   		<% 
					}
				}
			}
			%>
		</form>	
		<%
		
		String message = (String) infoMap.get("message");
		if(message.equalsIgnoreCase("abortOperation"))
		{
			// If the Connected POA's are in Reviwe/Release State then Stopping the Operation.
		    strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.ArtworkTemplateInUse");
			%>
				<script language="javascript" type="text/javaScript">
				//XSSOK strAlertMessage :  Local variable coming from Res Bundle-I18N
					alert("<%=strAlertMessage%>");
				</script>
			<%
			return;	
		}
     	else if(message.equalsIgnoreCase("confirmationMessage"))
     	{
     		// If the Connected POA's are in Preliminary/AIP State then Asking for User Confimation Message.
			%>					
			<script language="javascript" type="text/javaScript">								
			var msg = confirm("<%=i18nNow.getI18nString("emxAWL.Alert.DisconnectAllConnectedPOA","emxAWLStringResource",context.getSession().getLanguage())%>");                                    
				if(msg)
				{				    										    							
					document.disconnectOrDeleteForm.submit();		        							
				}
			</script>
			<%
     	}
     	else if(message.equalsIgnoreCase("continueMessage"))
     	{
     		// Submitting the Default Form If No Connected POA's to CPG Product and Product and Product Line.
     		%>										
			<script language="javascript" type="text/javaScript">						    										    							
					document.disconnectOrDeleteForm.submit();		     
			</script>
			<%
	}
    } 
    catch(Exception e) 
    {
        e.printStackTrace();
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
    }
    	
%>	<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
