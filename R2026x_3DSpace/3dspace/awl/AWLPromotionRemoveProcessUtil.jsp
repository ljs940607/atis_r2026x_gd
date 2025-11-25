
<%--
  AWLPromotionRemoveProcessUtil.jsp

  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program

--%>

<%-- Common Includes --%><%-- 
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>

<%@page import="com.matrixone.apps.awl.dao.Promotion"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.dao.MasterCopyList"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>

<%

    String strMode = emxGetParameter(request, "strMode");
	String strObjId = emxGetParameter(request, "objectId");
	String strParentId = emxGetParameter(request, "parentOID"); 
	

    try{
        if (BusinessUtil.isNullOrEmpty(strMode)){
            String aeRelIds = emxGetParameter(request, "aeRelIds");
            String aeIds = emxGetParameter(request, "aeIds");
            StringList aeRelIdList = FrameworkUtil.split(aeRelIds, ",");
            StringList aeIdsList = FrameworkUtil.split(aeIds, ",");
	    	DomainRelationship.disconnect(context, BusinessUtil.toStringArray(aeRelIdList));
	    	Iterator aeIt = aeIdsList.iterator();
	    	while(aeIt.hasNext()){
	    		ArtworkMaster am = new ArtworkMaster((String)aeIt.next());
	    		List<MasterCopyList> mcls = am.getMCLs(context);
	    		am.disconnectFrom(context, AWLRel.MCL_ARTWORK, mcls);
	    	}
        } else if("disConnectFPMastersAndPromotionalAEs".equalsIgnoreCase(strMode)){         
            String promotionId = emxGetParameter(request, "promotionId");            
            String aeIds = emxGetParameter(request, "aeIds");
            String selectedFPMasters = emxGetParameter(request, "selectedFPMasters");
            String productIds = emxGetParameter(request, "productIds");
            
            StringList selectedFPMastersIdsList = FrameworkUtil.split(selectedFPMasters, ",");
            StringList aeIdsList = FrameworkUtil.split(aeIds, ",");
            StringList productIdsList = FrameworkUtil.split(productIds, ",");
    		
          	Promotion.removePromotionsFromProduct(context, promotionId, selectedFPMastersIdsList, aeIdsList, productIdsList);
        }
    	%>
		
        <script language="javascript" type="text/javaScript">
           parent.location.href = parent.location.href;
        </script>
        <%

    } catch(Exception e) {
        e.printStackTrace();
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", e.toString());
        }
    } 
%>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>  --%> 
