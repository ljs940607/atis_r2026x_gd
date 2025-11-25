<%--
  AWLRemovePromotionArtworkElement.jsp

  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program

--%>

<%-- Common Includes --%>
<%-- 
<%@page import="com.matrixone.apps.awl.util.Access"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import = "java.util.StringTokenizer"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.dao.Promotion"%>
<%@page import="com.matrixone.apps.awl.dao.MasterCopyList"%>
<%@page import="java.util.Iterator"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="java.util.List"%>
<%
	String[] arrTableRowIds = emxGetParameterValues(request, "emxTableRowId");        
    String strObjId = emxGetParameter(request, "objectId");
    String strParentId = emxGetParameter(request, "parentOID"); 

    String artworkMasterId = "";
    String artworkMasterRelId = "";
    StringTokenizer strTokenizer = null;
    String strAlertMessage = "";
    String parentId = "";
    boolean isInvalidToRemove = false;
    boolean isIncludedInMCL = false;
    StringList aeRelIdList = new StringList();
    StringList aeIdList = new StringList();
    String strURL = "AWLPromotionRemoveProcessUtil.jsp?objectId="+strObjId+"&parentOID="+strParentId;
    if(arrTableRowIds[0].endsWith("|0")){
            strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.CannotPerform");
%>        
        
        <script language="javascript" type="text/javaScript">
			 //XSSOK srrAlertMessage : Local variable coming from Res Bundle-I18N
             alert("<%=strAlertMessage%>");      
             parent.closeWindow();  
        </script>
        <%
        	return;
                                    }
                                    
                                    try{
        %> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
 	Access.checkRequiredAccess(context,"PromotionArtworkRemove");
            for(int i=0;i<arrTableRowIds.length;i++)
            {
                if(arrTableRowIds[i].indexOf("|") > 0)
                {
                    strTokenizer = new StringTokenizer(arrTableRowIds[i] , "|");
                    artworkMasterRelId = strTokenizer.nextToken();
                    artworkMasterId = strTokenizer.nextToken();
                    parentId = strTokenizer.nextToken();                
                    ArtworkMaster am = new ArtworkMaster(artworkMasterId);                
                   
                    if(BusinessUtil.isKindOf(context, strParentId, AWLType.PROMOTIONAL_OPTION.get(context)) )
                    { 
                    	if(ArtworkMaster.isAssociatedToProductThroughMultiplePromotions(context, artworkMasterId, strParentId)){
                    		isInvalidToRemove = true;
                    		strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.OtherProductsAssociated"); 
                            break;
                    	}
    	                if(am.isIncludedInMCL(context))
    	                {
    	                	 isIncludedInMCL = true;                     
    	                     strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.ArtworkElement.Confirmation");
    	                }
    	                aeRelIdList.add(artworkMasterRelId);
    	                aeIdList.add(artworkMasterId);
                    }
                }
            }
            if (isInvalidToRemove){
 %>
            <script language="javascript" type="text/javaScript">
          //XSSOK srrAlertMessage : Local variable coming from Res Bundle-I18N
                alert("<%=strAlertMessage%>");
            </script>
            <%
        }else if(isIncludedInMCL){
        	strURL=strURL+"&aeRelIds="+FrameworkUtil.join(aeRelIdList, ",")+"&aeIds="+FrameworkUtil.join(aeIdList, ",");
        	%>
        	<script language="javascript" type="text/javaScript">
        	//XSSOK srrAlertMessage : Local variable coming from Res Bundle-I18N
            if(window.confirm("<%=strAlertMessage%>")){                                     
                window.location.href = "<xss:encodeForJavaScript><%=strURL%></xss:encodeForJavaScript>";                                   
            }
          </script>
          <%
        }else{
        	DomainRelationship.disconnect(context, BusinessUtil.toStringArray(aeRelIdList));
        	Iterator aeIt = aeIdList.iterator();
            while(aeIt.hasNext()){
                ArtworkMaster am = new ArtworkMaster((String)aeIt.next());
                List<MasterCopyList> mcls = am.getMCLs(context);
                am.disconnectFrom(context, AWLRel.MCL_ARTWORK, mcls);
            }
        	%>
        	<script language="javascript" type="text/javaScript">
        	   parent.location.href = parent.location.href;
        	</script>
        	<%
        }
    } catch(Exception e) {
        e.printStackTrace();
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
    }
%> 

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>--%>
