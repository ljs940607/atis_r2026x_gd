
<%--  Common Includes  --%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>
<%@page import="com.matrixone.apps.awl.dao.GraphicDocument"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "AWLUICommonAppIncludeWithStrictDocType.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>
    
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.DomainConstants" %>
<%@page import="com.matrixone.apps.domain.DomainObject" %>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>

<%@page import="java.util.List"%>
<%
	String acceptLanguage = request.getHeader("Accept-Language");
String bundle = "emxAWLStringResource";
%>


<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="matrix.util.StringList"%>
<%@include file="emxValidationInclude.inc" %>




<%@page import="com.matrixone.apps.awl.dao.Brand"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLAttribute"%>
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>

<%
	final String[] CHECK_AWL = {"ENO_AWL_TP"};
	try{
	ComponentsUtil.checkLicenseReserved(context, CHECK_AWL);
	}catch(Exception e)
	{
  %>
	<script type="text/javaScript">
	// XSSOK
	alert("<%=XSSUtil.encodeForJavaScript(context, e.getMessage())%>");
	if(getTopWindow().slideInFrame)
		{
		 getTopWindow().closeSlideInDialog();
		}
	 else if(getTopWindow().getWindowOpener()){
		 getTopWindow().closeWindow();
	}	
	 </script>
	 <%
	}
	String createGraphicElement = AWLPropertyUtil.getI18NString(context, "emxAWL.Message.CreateGraphicElement");
    String confirmResponsibleOrg=AWLPropertyUtil.getI18NString(context, "emxAWL.ResponsibleOrganization.ConfirmMessage");
    String brandIdStr=AWLUtil.getSelectedIDsStrFS(request);
	String selectedPOAIds = emxGetParameter(request, AWLConstants.SELECTED_POA_ID);
	boolean isAssociationFieldRequired = BusinessUtil.isNotNullOrEmpty(selectedPOAIds);
	
	

%>
       
<script   language="javascript" type="text/javascript">
    
    var parentRDO = "";
    var isTreeDisplayed=false;
    var clist=null;
    $(document).ready(function() { 
        $('#masterElementData').css('left', '0');
    });
    </script>

    <%
    	String language = context.getSession().getLanguage();   
                      
                    String strImageUploadAlert = AWLPropertyUtil.getI18NString(context, "emxAWL.UploadImage.Alert");
                    String invalidImageFile = AWLPropertyUtil.getI18NString(context, "emxAWL.Common.InvalidFileName");
                    
                    //Added for Artwork Chnage
                    HashMap ACDetails=(HashMap)session.getAttribute("ACDetails"); 
                    if(ACDetails!=null)
                    {
                     session.removeAttribute("ACDetails");
                    }
                    
                    try{       
                       String portalCmdName = emxGetParameter(request, "portalCmdName");
                       String strGraphicTypeName = emxGetParameter(request, "graphicType");
                       String strInstanceSequence = emxGetParameter(request, "instanceSequenceNumber");
                       String strUseInstanceSeqFromRes = emxGetParameter(request, AWLConstants.USE_INSTANCESEQ_FROM_RES);
                       if(BusinessUtil.isNullOrEmpty(strInstanceSequence) && AWLConstants.RANGE_FALSE.equalsIgnoreCase(strUseInstanceSeqFromRes)) {
                    	   strInstanceSequence = AWLPropertyUtil.getI18NString(context, "emx.AWL.AutoNextInSequence");
                       }
                       StringList imageTypesList = null;
                       if(BusinessUtil.isNullOrEmpty(strGraphicTypeName)){
                    	   imageTypesList = AWLType.MASTER_ARTWORK_GRAPHIC_ELEMENT.getDerivative(context, false); 
                       } else {
                    	   imageTypesList = BusinessUtil.toStringList(strGraphicTypeName);
                       }
                       StringList docTypesList = GraphicDocument.getGraphicDocumentTypes(context);
                       String uiType = emxGetParameter(request,"uiType");
    %>
    <%@include file = "../emxUICommonHeaderEndInclude.inc"%>

     <!-- Master create Form -->
     <form name="UploadFile" method="post" enctype="multipart/form-data" onsubmit="submitForm(); return false">
    	<%@include file = "../common/enoviaCSRFTokenInjection.inc"%> 
     <div id="masterElementData">
            <input type="hidden" name="contextObjectId" value="<xss:encodeForHTMLAttribute><%=emxGetParameter(request, "parentOID")%></xss:encodeForHTMLAttribute>" />
            <input type="hidden" name="portalCmdName" value="<xss:encodeForHTMLAttribute><%=portalCmdName%></xss:encodeForHTMLAttribute>" />
            <input type="hidden" name="uiType" value="<xss:encodeForHTMLAttribute><%=uiType%></xss:encodeForHTMLAttribute>" />

       <table border="0" cellpadding="5" cellspacing="2" >
        <tr>
            <td width="150" nowrap="nowrap" class="labelRequired">
                <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
                <%=AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource", "emxFramework.Basic.Type", null)%>
            </td>
         </tr>
         <tr>
            <td class="inputField" colspan="1">
            <select name="txtMasterActualType">
                <%
                	for (int i = 0; i < imageTypesList.size(); i++) {
                	    String graphicType = (String)imageTypesList.get(i);
                            String strDisplayType = AWLPropertyUtil.getTypeI18NString(context, graphicType, false);
                %>
                           <!--XSSOK  graphicType DB Schema Type and strDisplayType is I18N value-->
                           <option value="<%=graphicType%>"><%=strDisplayType%></option>
                <%
                	}
                %>
            </select></td>
        </tr>
        <tr>
            <td width="150" nowrap="nowrap" class="labelRequired">
                <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
                <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.DocumentType")%>
            </td>
         </tr>
         <tr>
            <td class="inputField" colspan="1">
            <select name="txtDocumentActualType">
                <%
                	for (int i = 0; i < docTypesList.size(); i++) {
                           String docType = (String)docTypesList.get(i);
                           String strDocType = AWLPropertyUtil.getTypeI18NString(context, docType, false);
                %>
                           <!--XSSOK  docType DB Schema Type and strDocType is I18N value-->
                           <option value="<%=docType%>"> <%=strDocType%> </option>
                <%
                	}
                %>
            </select></td>
        </tr>
        
        <!-- Image Field -->
        <tr>
          <td  nowrap  width="150" class="label">
          <!-- XSSOK .getI18NString : Res Bundle-I18N -->
           <label for="Name"> <%=AWLPropertyUtil.getI18NString(context, "emxAWL.CompanyDialog.Image/File")%>
          </label></td>
        </tr>
        <tr>
          <td nowrap   width="380" class="inputField">
          <input type="file" name="file" id="file" onpaste="return false;" onKeyPress="return displaymessage(event);" >      
          <input type="hidden" name="fileName0" id="fileName0">
          </td>
        </tr>
    
      <!-- Marketing Name -->
        <tr>
            <td width="150" nowrap="nowrap" class="labelRequired">
            <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
                 <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.DisplayName")%>
            </td>
        </tr>
        <tr>    
            <td nowrap="nowrap" class="field">
                <input type="text" name="txtMarketingName" size="20" value="">
            </td>
        </tr>
      
       <!-- Description Field --> 
       <tr>
         <td width="150" nowrap="nowrap" class="label">
         <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
           <%=AWLPropertyUtil.getI18NString(context,"emxFrameworkStringResource" ,"emxFramework.Basic.Description", null)%>              
         </td>
      </tr>
     <tr>
         <td nowrap="nowrap" class="field">
           <textarea name="txtMasterDescription" rows="5" cols="25" ></textarea>
         </td>
       </tr>
       
       <!-- Instance Sequence Field --> 
     <% if(BusinessUtil.isNotNullOrEmpty(strInstanceSequence)){	 %>
      <tr>
           <td width="150" nowrap="nowrap" class="label">
           <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
                <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.InstanceSequence")%>
           </td>
       </tr>
       <tr>    
           <td nowrap="nowrap" class="field">
           <!-- XSSOK  -->
               <%=strInstanceSequence%>
               <input type="hidden" name="txtInstanceSequence" readonly="readonly" value="<%=XSSUtil.encodeForHTML(context, strInstanceSequence)%>" />
           </td>
       </tr>
      
      <%} %>
        
        <!-- Place of Origin -->
        <!--Added to accomodate the Place of Origin depending on request parameter-->
	<% 
		
        if(isAssociationFieldRequired){
        	List<String> poaIds = FrameworkUtil.split(selectedPOAIds, ",");
            List<String> finalPlaceOfOrigins = ArtworkMaster.getPlaceOfOriginForNewElement(context,poaIds);
		    StringList placeOfOriginList = new StringList(finalPlaceOfOrigins.toArray(new String[finalPlaceOfOrigins.size()]));
		    StringList hierarchyNamesList = BusinessUtil.getInfo(context,placeOfOriginList , AWLAttribute.MARKETING_NAME.getSel(context));
		    String displayValue = FrameworkUtil.join(hierarchyNamesList, ",") ;
		    String disabled = "";
    	    if(displayValue.contains(",")){
    		    disabled = "disabled";
    	    }
    	%>
    		<tr>
         <td width="150" nowrap="nowrap" class="labelRequired">
         <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
            <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Table.PlaceOfOrigin")%>
         </td>
       </tr>
    	<tr>
         	<td nowrap="nowrap" class="field">
         	
         		<input type="text" name="AssociateToDisplay" size="20"" readonly="readonly" value="<xss:encodeForHTMLAttribute><%=displayValue %></xss:encodeForHTMLAttribute>" />
         		<input type="hidden" name="AssociateTo" readonly="readonly" value="<xss:encodeForHTMLAttribute><%=displayValue %> </xss:encodeForHTMLAttribute>" />
         		<input type="hidden" name="AssociateToOID" readonly="readonly" value="<xss:encodeForHTMLAttribute><%=FrameworkUtil.join(placeOfOriginList, ",") %></xss:encodeForHTMLAttribute>" />
         		<input type="button" name="btnAssociateTo" <%=disabled %> value="..." onclick="javascript:showChooser('../common/emxFullSearch.jsp?field=TYPES=type_ProductLine,type_CPGProduct&table=AWLProductHierarchyWorkPlace&selection=single&submitAction=refreshCaller&hideHeader=true&includeOIDprogram=AWLPOAUI:getHierarchyForNewElement&HelpMarker=emxhelpfullsearch&showInitialResults=true&submitURL=../common/AEFSearchUtil.jsp?mode=Chooser&chooserType=FormChooser&chooserType=FormChooser&fieldNameActual=AssociateTo&fieldNameDisplay=AssociateToDisplay&fieldNameOID=AssociateToOID&suiteKey=AWL&<%=AWLConstants.OBJECT_ID %>=<%=XSSUtil.encodeForURL(selectedPOAIds)%>')">
           	</a>
         </td>
       </tr>
    	<%   
       } %>
        <!-- Artwork Change -->
        <!-- Artwork Change field is made readonly by Vaibhav on 11 Nov 2010 -->
       
       <!-- Responsible Organization(Design Responsibility label changed-->
       <tr>
         <td width="150" nowrap="nowrap" class="label">
         <!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
            <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Attribute.Design_Responsibility")%>
         </td>
       </tr>
     <tr>
         <td nowrap="nowrap" class="field">
         <% String organization = (String)JPO.invoke(context,"AWLObject",null,"getCurrentOrg",null,String.class); %>
           <input type="text" name="txtMasterDesResp" size="20"" readonly="readonly" value="<xss:encodeForHTMLAttribute><%=organization%></xss:encodeForHTMLAttribute>" />
           </a>
         </td>
       </tr>
   
       </table>
        
 
    </div>
    
    
  </form>
     <%
     	}catch(Exception e)
                         {
                           emxNavErrorObject.addMessage(e.toString().trim());
                           session.setAttribute("error.message", e.toString().trim());
                         }
     %>
     <script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
     <script language="javascript" type="text/javaScript">
     var  formName = document.UploadFile;
	 var isProcessing = false;
     // checking mandatory feild validations before submiting
     function validateMaster()
     {
        var iValidForm = true;
            
        //validation for special chars in the description field - The sixth(true/false) and last parameter 'checkBadChars' specifies which characters have to be blocked (all bad chars, common illegal characters are now Restricted Characters)
        if (iValidForm)
        {
          // XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
          var fieldName = "<%=AWLPropertyUtil.getI18NString(context, bundle, "emxFramework.Basic.Description", null)%> ";
          var field = formName.txtMasterDescription;
          iValidForm = basicValidation(formName,field,fieldName,false,false,true,false,false,false,checkBadChars);
        }
        
        //Validation to check for Required fields
        
        <%-- Commented  to fix IR-328629-3DEXPERIENCER2015x 
        if (iValidForm)
        {
        	// XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
             var fieldName = "<%=AWLPropertyUtil.getI18NString(context,bundle, "emxFramework.Basic.Description", null)%> ";
             var field = formName.txtMasterDescription;
             // Modified by Kamal to check special chars in description field
             iValidForm = basicValidation(formName,field,fieldName,true,true,true,false,false,false,checkBadChars);
        } --%>
        
        // Added by Kamal to fix HF-081239V6R2011x_, escape "&" character
        /*Commendted by g1g on 13-02-2012 to fix HF-114950V6R2012x_
        if(iValidForm)
              formName.txtFeatureDescription.value=escape(formName.txtFeatureDescription.value);*/

        if (iValidForm)
        {
        	// XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
              var fieldName = "<%=AWLPropertyUtil.getI18NString(context,bundle, "emxAWL.Label.DisplayName", null)%> ";
              var field = formName.txtMarketingName;
              // Modified by Kamal to check special chars in marketing name
              iValidForm = basicValidation(formName,field,fieldName,true,true,true,false,false,false,checkBadChars);
        }
              
        // Added by Kamal to fix HF-081239V6R2011x_, escape "&" character
        /*Commendted by g1g on 13-02-2012 to fix HF-114950V6R2012x_
        if(iValidForm)
        {
             formName.txtMarketingName.value=escape(formName.txtMarketingName.value);
        }*/


        if (!iValidForm)
        {
           return ;
        }
        //document.getElementById("ArtworkChangeDescription").disabled = false;
       // document.getElementById("ArtworkChangeDescription").readOnly = false;
        return iValidForm;
           
     }
     
       
     // (Not used anymore >> for cleanUp)
     function closeWindow()
     {
        <%
            if("CreateStandAlone".equals(request.getParameter("uiType")))
                out.println("getTopWindow().closeWindow();");
            else
                out.println("getTopWindow().closeSlideInDialog();");
        %>
     }
     function cancelSlideIn()
     {
    		 if(getTopWindow().slideInFrame)
 			{
    			 return getTopWindow().closeSlideInDialog();
 			}
    		 else if(getTopWindow().getWindowOpener()){
    			 getTopWindow().closeWindow();
    		}	
     }

     <%
       // getting the querystring for passing to FeatureUtil
       StringBuffer sQueryString = new StringBuffer("");
       Enumeration eNumParameters = emxGetParameterNames(request);
       while( eNumParameters.hasMoreElements() ) {
         String strParamName = (String)eNumParameters.nextElement();
         String strParamValue = emxGetParameter(request, strParamName);
         if (strParamName.equalsIgnoreCase("mode")) continue;
         else {
        	 if("emxTableRowIdActual".equalsIgnoreCase(strParamName) || "emxTableRowId".equalsIgnoreCase(strParamName)) {
        		 strParamValue = XSSUtil.encodeForURL(context, strParamValue);
        	 }
        	 sQueryString.append("&" + strParamName + "=" + strParamValue);
         }
       }
       sQueryString.deleteCharAt(0);
       String strURL = "../awl/AWLArtworkElementProcess.jsp?";      
     %>

    //When Enter Key Pressed on the form
    function submitForm()
    {
        submit();
    }
    
    // submit button
    function submit()
    {
    	if(isProcessing)
		{
			alert(emxUIConstants.STR_URL_SUBMITTED);
		}
		else
		{
	        var tempFileName = document.UploadFile.file.value;      
	        var fileSep = "\\";
	        // removed isMac or condition for IR-224096V6R2014 by e55 
	        if (isUnix) {
	                fileSep = "/";
	        }
			
			if(isLinux) {
				fileSep = "\\";
			}

	        // In Mac, Netscape 7.0 and less, file separator is :
	        // In Mac, Netscape 7.1 and above, file separator is /
	        // basically in Mac / Netscape look for :, if not found look for /
	        if ( isMac && isMinMoz1)
	        {
	          fileSep = ":";
	          slIndex = tempFileName.lastIndexOf(fileSep);
	          if(slIndex == -1)
	          {
	            fileSep = "/";
	          }
	        }
	        slIndex = tempFileName.lastIndexOf(fileSep);
	        tempFileName = tempFileName.substring(slIndex+1,tempFileName.length);

	        // File Name can not have special characters
	        var apostrophePosition = tempFileName.indexOf("'");
	        var hashPosition = tempFileName.indexOf("#");
	        var dollarPosition = tempFileName.indexOf("$");
	        var atPosition = tempFileName.indexOf("@");
	        var andPosition = tempFileName.indexOf("&");
	        var percentPosition = tempFileName.indexOf("%");

	        if ( apostrophePosition != -1 || hashPosition != -1 || dollarPosition != -1 || atPosition != -1 || andPosition != -1  || percentPosition != -1){
	         
	        // XSSOK invalidImageFile : Local variable coming from Res Bundle-I18N
	          alert("<%=invalidImageFile%>");
	          document.UploadFile.file.focus();
	          return;
	        }   
	        document.UploadFile.fileName0.value = tempFileName;
	        
	        //Added by Vaibhav on 28 Oct 2010 to validate image upload
	        if(document.UploadFile.fileName0.value != "")
	        {
	            var dotIndex = tempFileName.lastIndexOf(".");
	            var fileExtension = tempFileName.substring(dotIndex+1, tempFileName.length);
	            fileExtension = fileExtension.toLowerCase();
	            //alert(fileExtension);
	           
	            if(fileExtension != "gif" && fileExtension != "jpg" && fileExtension != "png" && fileExtension != "giff" && fileExtension != "jpeg" && fileExtension != "3dxml" && fileExtension != "cgr" && fileExtension != "pdf" && fileExtension != "bmp" && fileExtension != "psd" && fileExtension != "ai")
	            {
	                //alert("Selected file's extension is not supported. Allowed file extensions are: \ngif,jpg,png,giff,jpeg,3dxml,cgr,pdf,bmp,psd,ai");
	                // XSSOK strImageUploadAlert : Local variable coming from Res Bundle-I18N
	                alert("<%=strImageUploadAlert%>");
	                document.UploadFile.file.focus();
	                return;
	            }
	        }
	        //End Added by Vaibhav on 28 Oct 2010 to validate image upload
	                
	      <%
	      // Setting the Create Multiple Flag depending on the mode in the Request.
	      // This captures the APPLY button click in previous page.
	      String strModePrevious     = emxGetParameter(request, "mode");
	  
	      // This time the click is DONE
	      sQueryString.append("&mode=create");
	      sQueryString.append("&graphicElement=true");
	      strURL = strURL + sQueryString;
	      %>
	       
	      var iValidForm=true;
	      iValidForm = validateMaster();
	      if (!iValidForm)
	      {
	          return ;
	      }
	      var submitURL = '<%=strURL%>';
	      <%if(isAssociationFieldRequired){%>
	      	submitURL = submitURL + '&AssociateToOID=' + $("input[name='AssociateToOID']").val();
	      <%}%>
	      formName.action = submitURL;
	      turnOnProgress();
		  isProcessing = true;
		  formName.submit();
	    }
   }

    </script>
    
    <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
    <%@include file = "../emxUICommonEndOfPageInclude.inc"%>
