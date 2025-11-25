<%-- AWLMovePOAtoAPProcess.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%> 
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file="../components/emxComponentsTreeUtilInclude.inc"%>

<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="matrix.util.StringList"%>
<% 
	    
	try 
   {
        ContextUtil.startTransaction(context, true);
        String targetAPID = ""; 
		
		String sourceAPID = emxGetParameter(request,"objectId");
		ArtworkPackage sourceArtworkPackage = new ArtworkPackage(sourceAPID);
		String suiteKey = emxGetParameter(request, "suiteKey");
		
        
        String artworkPackageState = BusinessUtil.getInfo(context, sourceAPID, DomainConstants.SELECT_CURRENT);
        boolean isArtworkPackageInWIPstate = AWLState.WORK_IN_PROCESS.get(context, AWLPolicy.ARTWORK_PACKAGE).equals(artworkPackageState);
        
        
        String title = emxGetParameter(request, "Title");
        String description = emxGetParameter(request, "Description");

        String strSelectedPOA = emxGetParameter(request, "selectedPOA");
        StringList poaIdList = FrameworkUtil.split(strSelectedPOA, ",");
        
        if(!isArtworkPackageInWIPstate){
             targetAPID= emxGetParameter(request, "UseExistingOID");
             if(BusinessUtil.isNullOrEmpty(targetAPID) && BusinessUtil.isNotNullOrEmpty(title) )
             {
               ArtworkPackage ap = ArtworkPackage.create(context, title, description); 
               targetAPID = ap.getId(context);
             }
        }else{
             targetAPID = AWLUtil.getSelectedIDsStrFS(request);
        }
       
        sourceArtworkPackage.movePOAs(context, poaIdList, new ArtworkPackage(targetAPID));
		ContextUtil.commitTransaction(context); 
    %> 
       
    
   <Script language="Javascript">
   //XSSOK i18n Label
    alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.MovePOASuccess")%>");    
     </script>
    
    <%
    String actionURL = "../common/emxTree.jsp?AppendParameters=true&objectId=" + XSSUtil.encodeForURL(context,targetAPID) + "&emxSuiteDirectory"+ XSSUtil.encodeForURL(context,suiteKey);
    if(!isArtworkPackageInWIPstate)
    {
       %>
    
     <script language="javascript" type="text/javaScript">
        var isSlideIn = "<%=!isArtworkPackageInWIPstate%>";
        loadTreeNode("<%=XSSUtil.encodeForJavaScript(context, targetAPID)%>", null, null, "<%=XSSUtil.encodeForJavaScript(context, suiteKey)%>", true, "<%=XSSUtil.encodeForJavaScript(context, actionURL)%>");        
        getTopWindow().closeSlideInDialog();       
    </script>
    
  <% 
    } else{
	  %>
	    
	     <script language="javascript" type="text/javaScript">
	        var isSlideIn = "<%=!isArtworkPackageInWIPstate%>";	       
	        loadTreeNode("<%=XSSUtil.encodeForJavaScript(context, targetAPID)%>", null, null, "<%=XSSUtil.encodeForJavaScript(context, suiteKey)%>", true, "<%=XSSUtil.encodeForJavaScript(context, actionURL)%>");
	        //Fix for IR-373710-3DEXPERIENCER2016x parent also refers FullSearch popup
	       	parent.closeWindow();
	    </script>
	    
	  <% 
    }//end Else
   }//end Try  
	  catch (Exception ex) 
  
    {       
        ex.printStackTrace();
        ContextUtil.abortTransaction(context);
        String alertMsg = ex.getMessage(); 
      %> 
         <script language="javascript" type="text/javaScript"> 
             alert("<xss:encodeForJavaScript><%=alertMsg%></xss:encodeForJavaScript>");
             window.getTopWindow().closeWindow();
        </script>
              
  <% } %>
