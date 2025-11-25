

<%-- Common Includes --%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Set" %>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import = "java.util.StringTokenizer"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="java.util.Enumeration"%>
<%@page import="com.matrixone.apps.awl.dao.Brand"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster" %>
<%@page import="com.matrixone.apps.awl.dao.ArtworkContent" %>
<%@page import="com.matrixone.apps.awl.util.AWLConstants" %>
<%@page import="com.matrixone.apps.domain.util.FrameworkException" %>
<%
	String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowId");
	String mode = emxGetParameter(request, "mode");        
   	String strObjId = emxGetParameter(request, "objectId");
    	String strParentId = emxGetParameter(request, "parentOID"); 
    	String csrfName = emxGetParameter(request, "csrfTokenName"); 
    	String csrfValue = emxGetParameter(request, csrfName); 

	String artworkMasterID = "";
	String artworkMasterRelId = "";
	StringTokenizer strTokenizer = null;
	String strAlertMessage = "";
	String parentId = "";
	boolean bIsInvalidToRemove = false;
	boolean isConfirmationNeeded =false;
    boolean isIncludedInPOA = false;
    StringList strObjectIdList = new StringList();
	StringList strParentIdList = new StringList();
	String[] strObjectIdArray = AWLUIUtil.getObjIdsFromRowIds(arrTableRowIds);
	String masterids = FrameworkUtil.join(strObjectIdArray,",");
	
    try
    {
%> 		<%@include file = "../common/enoviaCSRFTokenValidation.inc"%> 
<%             
		
		boolean isArtworkMaster[] = BusinessUtil.isKindOf(context, AWLUIUtil.getObjIdsFromRowIds(arrTableRowIds), AWLType.MASTER_ARTWORK_ELEMENT.get(context));
		boolean isArtworkMasterType = BusinessUtil.isMatching(isArtworkMaster, true, true);
		if(!isArtworkMasterType) {
%>			<script language="javascript" type="text/javaScript">
		     //XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
   		       alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.SelectArtworkMasterForThisOperation")%>");
			</script>
<%			return;
		}
 	for(int i=0;i<arrTableRowIds.length;i++)
	{
    	if(arrTableRowIds[i].indexOf("|") > 0)
    	{
    		strTokenizer = new StringTokenizer(arrTableRowIds[i] , "|");
    		artworkMasterRelId = strTokenizer.nextToken();
    		artworkMasterID = strTokenizer.nextToken();
    		parentId = strTokenizer.nextToken();
    		DomainRelationship artworkMasterRel = new DomainRelationship(artworkMasterRelId);
    		String strPlaceOfOrigin = artworkMasterRel.getAttributeValue(context, AWLAttribute.PLACE_OF_ORIGIN.get(context));
    		if(!"".equals(strPlaceOfOrigin) && strPlaceOfOrigin.equalsIgnoreCase("No"))
    		{
    			bIsInvalidToRemove = true;
    			strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElementRemove.Alert");
 %>
    			<script language="javascript" type="text/javaScript">
    				//XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
    				alert("<%=strAlertMessage%>");
    			</script>
    			<%
						return;
    		}
    		else
    		{
    		    if( BusinessUtil.isKindOf(context, strParentId, AWLType.PRODUCT_LINE.get(context)) )
    		    {
    		       Brand brand =  new Brand(strParentId);
    		       isIncludedInPOA = brand.isArtworkMasterIncludedByPOAOfBrandContext(context, artworkMasterID);
																		
    		    }else if( BusinessUtil.isKindOf(context, strParentId, AWLType.CPG_PRODUCT.get(context)) )
    		    {
    		       CPGProduct product =  new CPGProduct(strParentId); 
    		       isIncludedInPOA = product.isArtworkMasterIncludedByPOAInProductContext(context, artworkMasterID);
    		    }
    		    if(isIncludedInPOA)
    		    {
    		    	StringList reviewState = AWLPolicy.POA.getStates(context, AWLState.DRAFT, AWLState.PRELIMINARY, AWLState.ARTWORK_IN_PROCESS, AWLState.OBSOLETE);
    		    	MapList pOAsInReview = new ArtworkMaster(artworkMasterID).getPOAs(context, BusinessUtil.toStringArray(reviewState));
    		    	
    		    	if (BusinessUtil.isNotNullOrEmpty(pOAsInReview)){
    		    		bIsInvalidToRemove = true;
    		    		strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.POAInReviewApprovedReleased");
    		    		%>
   	    		       	<script language="javascript" type="text/javaScript">
   	    		     		//XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
   		    		    	alert("<%=strAlertMessage%>");
   						</script>
   	  					<%
   						return;
    		    	}
    		    	
    		    	StringList draftAndPrelimStates = AWLPolicy.POA.getStates(context, AWLState.ARTWORK_IN_PROCESS, AWLState.REVIEW, AWLState.APPROVED, AWLState.RELEASE, AWLState.OBSOLETE);
    		    	MapList pOAsInDraftOrPrelim = new ArtworkMaster(artworkMasterID).getPOAs(context, BusinessUtil.toStringArray(draftAndPrelimStates));
    		    	
    		    	if (BusinessUtil.isNotNullOrEmpty(pOAsInDraftOrPrelim)){
    		    		isConfirmationNeeded=true;
    		    		
    		    	}
         }
    		    
    		    
    		}
    		String artworkMasterId = strObjectIdArray[i].toString();
			ArtworkMaster artworkMasterObj = new ArtworkMaster(artworkMasterId);
			String objWhere = AWLUtil.strcat("((current!=", AWLState.PRELIMINARY.get(context, AWLPolicy.COPY_LIST), ")&&(current!=", AWLState.OBSOLETE.get(context, AWLPolicy.COPY_LIST), "))");
			MapList allAssociatedCopyLists = artworkMasterObj.getCopyListsRelIds(context,parentId,artworkMasterId,objWhere);
			StringList copyListNames = BusinessUtil.toStringList(allAssociatedCopyLists, DomainConstants.SELECT_NAME);
			HashSet uniqueCopyListNames = new HashSet(copyListNames);
			copyListNames.clear(); 
			copyListNames.addAll(uniqueCopyListNames);
			StringList relIds = BusinessUtil.toStringList(allAssociatedCopyLists, DomainRelationship.SELECT_ID);
			
			if(BusinessUtil.isNotNullOrEmpty(relIds))
			{
				bIsInvalidToRemove = true;
				int count = 3;
				String strName = AWLUIUtil.getEllipsisString(copyListNames, count);
				copyListNames = new StringList(strName);
				 throw new FrameworkException(MessageUtil.getMessage(context, null, "emxAWL.Alert.AssociatedWithCopyList", BusinessUtil.toStringArray(copyListNames) , null, MessageUtil.getLocale(context), AWLConstants.AWL_STRING_RESOURCE));

				
			}
    		if(!bIsInvalidToRemove)
    		{
    			strObjectIdList.add(artworkMasterID);
    			strParentIdList.add(parentId);
    		}
				
    	}else
    	{
    		strObjectIdList.add(artworkMasterRelId);     
    		strParentIdList.add(artworkMasterID);    
			}
		} 
 	
 	if(isConfirmationNeeded){
 		strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.POAInDraftOrPrelim");
 		%>
		<script type="text/javaScript">
 		//XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
 		if(confirm("<%=strAlertMessage %>"))
 		{
 			parent.editableTable.cut();
        		//parent.closeWindow();
			// Yes -- Go and remove
			// No -- return from jsp
			
 		} 
	</script>
		<%
		return;
 	}
 	
        
        //ContextUtil.pushContext(context);
        //The selected Element will be disconnected when applyEdits() of emxUIFreezePane.js is called
		%>
        <script language="javascript" type="text/javaScript">
              parent.editableTable.cut();    
              //parent.closeWindow();   
        </script>
     <% 
     //ContextUtil.popContext(context);
		}
	catch(Exception e)
	{
	    e.printStackTrace();
	    if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }

	}
%>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
