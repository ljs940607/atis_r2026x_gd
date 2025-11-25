
<%@page import="com.matrixone.apps.domain.util.ContextUtil"%><%--
  emxAWLPromotionCreateProcessUtil.jsp

  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program

--%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../components/emxComponentsTreeUtilInclude.inc" %>
<%@include file = "../components/emxComponentsUtil.inc" %>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<%

	try {
		
		
		
	    String objectId     = emxGetParameter(request, "newObjectId");
	    String parentOID     = emxGetParameter(request, "parentOID");
	    String DesignResponsibilityOID =    emxGetParameter(request,"DesignResponsibilityOID");
	    String DesignResponsibility =    emxGetParameter(request,"DesignResponsibility"); 
	    
		DomainObject dobArtworkMaster = new DomainObject(parentOID);
		DomainObject dobArtworkElement = new DomainObject(objectId);
		DomainRelationship domainRelationship = new DomainRelationship();
		domainRelationship = DomainRelationship.connect(context, dobArtworkElement, "ArtworkContent", dobArtworkMaster);
	}catch(Exception e)
	{	    
		throw new Exception(e.toString());	
	}
	%>
