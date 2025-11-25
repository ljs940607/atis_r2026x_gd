<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>

<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<script src="../common/scripts/emxUICore.js"></script>
<script src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>

<%
try
{
     String contextObjectId = emxGetParameter(request,"objectId");
     
     String mcsUrl = com.matrixone.apps.common.CommonDocument.getMCSURL(context, request);
     
     String[] emxtableRowId = emxGetParameterValues(request, "emxTableRowId");
     String[] tableRowIds = AWLUIUtil.getObjIdsFromRowIds(emxtableRowId);
     
     String selectOnlyElements = AWLPropertyUtil.getI18NString(context, "emxAWL.ManageCountries.Alert");
     
     if(tableRowIds.length <= 0){
    	 %> 
         <script language="Javascript">  
                alert("<%=selectOnlyElements %>");
         </script>
         <%
     } else {
     
	    String artworkMasterId = tableRowIds[0];
	    String elementType = BusinessUtil.getInfo(context, artworkMasterId, DomainConstants.SELECT_TYPE);
	    
	    if(!new ArtworkMaster(artworkMasterId).isKindOf(context, AWLType.MASTER_ARTWORK_ELEMENT.get(context))){
	   	%> 
	       <script language="Javascript">  
	       		alert("<%=selectOnlyElements %>");
	       </script>
	       <%
	    } else {
	   	 
		 String copyHeader = AWLPropertyUtil.getI18NString(context, "emxAWL.Edit.AWLCopyArtworkElement");
		 String appendParameters = AWLUtil.strcat("&type=", elementType, "&parentOID=", contextObjectId, "&header=", copyHeader, "&artworkMasterId=", artworkMasterId, "&objectId=", artworkMasterId, "&mcsUrl=", mcsUrl);
	     String sURL = AWLUtil.strcat("../common/emxCreate.jsp?form=AWLCopyArtworkElement&policy=policy_ArtworkElementContent&createJPO=AWLArtworkMasterUI:copyArtworkElement&nameField=autoName&openerFrame=AWLProductLineArtworkElements&submitAction=refreshCaller&showApply=true", appendParameters);
	     %> 
	     <script language="Javascript">  
	            getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", "true");
	     </script>
	     <%
	    }
   	}

	}catch(Exception e)
    {
        e.printStackTrace();
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
    }
%>


