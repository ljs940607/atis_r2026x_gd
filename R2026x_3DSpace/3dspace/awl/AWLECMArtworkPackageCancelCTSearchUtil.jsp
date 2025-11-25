<%--
  AWLECMArtworkPackageCancelCTSearchUtil.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>

<%-- Common Includes --%>

<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>
<%@include file="emxValidationInclude.inc"%>
<%@include file="../components/emxComponentsTreeUtilInclude.inc"%>

<%@page import="com.matrixone.apps.common.util.FormBean"%> 
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainRelationship"%>
<%@page import="com.matrixone.apps.domain.util.mxType"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="matrix.db.Context"%> 
<%@page import="com.matrixone.apps.domain.util.PropertyUtil"%>

<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIUtility.js"></script>
<script language="Javascript" src="../common/scripts/emxUIPopups.js"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"></script>
<script language="Javascript" src="../common/scripts/emxUITableUtil.js"></script>
<script language="Javascript" src="../common/scripts/emxUIFreezePane.js"></script>



<%
  boolean bIsError = false;
  boolean isRefreshTree = false;
// Modified for IR IR-030496V6R2011WIM
String action = "";
String msg = "";
String strMode = emxGetParameter(request,"mode");
  try
  {
     String strObjId = emxGetParameter(request, "objectId");
     String strContext = emxGetParameter(request,"context");
     String strRelName = emxGetParameter(request,"relName");   
     String strIsUNTOper = emxGetParameter(request,"isUNTOper");   
     String strContextObjectId[] = emxGetParameterValues(request,"emxTableRowId");
     String strToConnectObjectType = "";
     String[] selectedBuildIds = null;
     //IR-077450V6R2012
     String strTypeAhead = emxGetParameter(request,"typeAhead");
     
     String strAppendRevision = emxGetParameter(request,"appendRevision");
   
     if(strContextObjectId==null)
		 {   
     %>    
       <script language="javascript" type="text/javaScript">
           alert("<emxUtil:i18n localize='i18nId'>emxProduct.Alert.FullSearch.Selection</emxUtil:i18n>");
       </script>
     <%}
 
     else
		 {	 
		if (strMode.equalsIgnoreCase("Chooser")){
			 String strSearchMode = emxGetParameter(request, "chooserType");
				 if (strSearchMode.equals("CustomChooser") || strSearchMode.equals("FormChooser"))
	              {   
	                  
		              String fieldNameActual = emxGetParameter(request, "fieldNameActual");
	                  String fieldNameDisplay = emxGetParameter(request, "fieldNameDisplay");
	                  
	                  StringTokenizer strTokenizer = new StringTokenizer(strContextObjectId[0] , "|");
                      String strObjectId = strTokenizer.nextToken() ; 
                      
	                  DomainObject objContext = new DomainObject(strObjectId);
	                  String strContextObjectName = objContext.getInfo(context,DomainConstants.SELECT_NAME);
	                  if("true".equalsIgnoreCase(strAppendRevision)){
	                	  strContextObjectName = strContextObjectName + " " + objContext.getInfo(context,DomainConstants.SELECT_REVISION);
	                  }
	                  %>
	                  <script language="javascript" type="text/javaScript">
	                  
	                  //Start for //IR-077450V6R2012
	                  var vfieldNameActual="";
	                	  var vfieldNameDisplay="";
	                    if(getTopWindow().getWindowOpener()){
	                       vfieldNameActual = getTopWindow().getWindowOpener().document.getElementsByName("<%=XSSUtil.encodeForJavaScript(context,fieldNameActual)%>");
	                       vfieldNameDisplay = getTopWindow().getWindowOpener().document.getElementsByName("<%=XSSUtil.encodeForJavaScript(context,fieldNameDisplay)%>");
	                    }else{
	                    	   vfieldNameActual = parent.frames[0].document.getElementsByName("<%=XSSUtil.encodeForJavaScript(context,fieldNameActual)%>");
                                  vfieldNameDisplay = parent.frames[0].document.getElementsByName("<%=XSSUtil.encodeForJavaScript(context,fieldNameDisplay)%>");
                          }
                       
                      
	                      vfieldNameDisplay[0].value ="<%=XSSUtil.encodeForJavaScript(context,strContextObjectName)%>" ;
	                      
	                      vfieldNameActual[0].value ="<%=XSSUtil.encodeForJavaScript(context,strObjectId)%>" ;
	                       //need an action at this point but need action on other page.
	                       
	                      var anotherFieldNameActual="";
	                	  var anotherFieldNameDisplay="";
	                    if(getTopWindow().getWindowOpener()){
	                    	anotherFieldNameActual = getTopWindow().getWindowOpener().document.getElementsByName("ChangeOrder");
	                    	anotherFieldNameDisplay = getTopWindow().getWindowOpener().document.getElementsByName("ChangeOrderOID");
	                    	flag = getTopWindow().getWindowOpener().document.getElementById("popupco");
	                    }else{
	                    	anotherFieldNameActual = parent.frames[0].document.getElementsByName("ChangeOrder");
	                    	anotherFieldNameDisplay = parent.frames[0].document.getElementsByName("ChangeOrderOID");
	                    	flag = getTopWindow().getWindowOpener().document.getElementById("popupco");
                          }
	                       
	                    	flag.disabled = false;
	                    	anotherFieldNameDisplay[0].value="CreateNew";
	                    	anotherFieldNameActual[0].value ="CreateNew" ;
	                    	document.POAConfirmationPage.ChangeOrderDisplay.value= "createNewChangeOrder"; 
	                    	
	                       
		          	</script>
	                      <%if (strTypeAhead ==null || !strTypeAhead.equalsIgnoreCase("true")){ %>
	                       <script language="javascript" type="text/javaScript">
	                                  			
							
	                      getTopWindow().location.href = "../common/emxCloseWindow.jsp";   
	                      	                  
	                    </script>
	                    <%}//End for  //IR-077450V6R2012 %>
	               <%
	              } 
				 }
     }     
  }
  catch(Exception e)
  {
    bIsError=true;
    session.setAttribute("error.message", e.toString());
    //emxNavErrorObject.addMessage(e.toString().trim());
  }// End of main Try-catck block
%>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
<%
// Modified for IR IR-030496V6R2011WIM
//IR-037276V6R2011- IF there is no exception in above delete opearation then refresh Page.      
if(!bIsError && strMode.equalsIgnoreCase("searchDelete"))
    {       
      action = "remove";
      msg = "";
      out.clear();
      response.setContentType("text/xml");
    %>
    <mxRoot>
        <!-- XSSOK -->
        <action><![CDATA[<%= action %>]]></action>
        <!-- XSSOK -->
        <message><![CDATA[    <%= msg %>    ]]></message>    
    </mxRoot>
    <%
    }
 %>
