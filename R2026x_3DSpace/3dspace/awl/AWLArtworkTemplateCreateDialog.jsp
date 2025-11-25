
<%-- Common Includes --%>

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "AWLUICommonAppIncludeWithStrictDocType.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>
<%@include file="emxValidationInclude.inc" %>

<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>

<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.DomainConstants" %>
<%@page import="com.matrixone.apps.domain.DomainObject" %>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="matrix.util.StringList"%>

<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>

<%	
	String invalidImageFile = AWLPropertyUtil.getI18NString(context, "emxAWL.Common.InvalidFileName");	

try{       
	
%>
<%@include file = "../emxUICommonHeaderEndInclude.inc"%>

<!-- Artwork Template Creation Form -->
	<form name="UploadTemplateFile" method="post" enctype="multipart/form-data" onsubmit="submit(); return false">
	<%@include file = "../common/enoviaCSRFTokenInjection.inc"%> 
		<div id="artworkTemplateData" style="float: left;">			
	
			<table border="0" cellpadding="5" cellspacing="2">
				<!-- Artwork Template Name -->
				<tr>
					<td width="150" nowrap="nowrap" class="labelRequired">
					<!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N  -->
						<%=AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Name")%>
					</td>
				</tr>
				<tr>
					<td nowrap="nowrap" class="field"><input type="text" name="txtName" id="txtName" size="20" value="" disabled /> 
						<input type="checkbox" id="nameFieldCheckBoxId" onClick="enableOrDisableNameTextBox()" checked />
					</td>
				</tr>
	
				<!-- Artwork Template Title -->
				<tr>
				<!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
					<td width="150" nowrap="nowrap" class="label"><%=AWLPropertyUtil.getI18NString(context, "emxCPD.Common.Title")%></td>
				</tr>
				<tr>
					<td nowrap="nowrap" class="field"><input type="text" name="txtTitle" size="20" value=""></td>
				</tr>
	
				<!-- Upload Artwork Template File Field -->
				<tr>
					<td nowrap width="150" class="label">
					<!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
						<label for="Name"><%=AWLPropertyUtil.getI18NString(context, "emxAWL.CompanyDialog.Image/File")%>
						</label>
					</td>
				</tr>
				<tr>
					<td nowrap width="380" class="inputField"><input type="file" name="file" id="file" onpaste="return false;" onKeyPress="return displaymessage(event);"> 
						<input type="hidden" name="fileName0" id="fileName0">
					</td>
				</tr>
	
				<!-- Artwork Template Description Field -->
				<tr>
				<!-- XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N -->
					<td width="150" nowrap="nowrap" class="labelRequired"><%=AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Description")%>
					</td>
				</tr>
				<tr>
					<td nowrap="nowrap" class="field"><textarea name="txtArtTempDescription" rows="5" cols="25"></textarea>
				</td>
				</tr>
			</table>
		</div>
	</form>
<%
} catch (Exception e) {
	emxNavErrorObject.addMessage(e.toString().trim());
	session.setAttribute("error.message", e.toString().trim());
}
%>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>

     <script language="javascript" type="text/javaScript">
     
     function enableOrDisableNameTextBox() 
		{	
		    if (!document.getElementById("nameFieldCheckBoxId").checked) {
		    	
	            document.getElementById("txtName").disabled = false;		          
	        }
	        else 
	        {		        	
	        	document.getElementById("txtName").value = "";
	        	document.getElementById("txtName").disabled = true;		            
	        }
		}
     
     var  formName = document.UploadTemplateFile;
	 var isProcessing = false;
     
     // checking mandatory feild validations before submiting
     
     // SY6 : Its required to validate the Artwork Template Creation form 
     function validateArtworkTemplate()
     {
        var iValidForm = true;        
        
        //Validation check for Description  field.
        //XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
       	var fieldName = "<%=AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Description")%> ";           	
       	var field 	= formName.txtArtTempDescription;
       	iValidForm = basicValidation(formName,field,fieldName,true,true,true,false,false,false,false);     
       
                    
	//Validation to check for Name field.
	if (iValidForm) {
		var fieldNameChecked = document.getElementById("nameFieldCheckBoxId");       	
		if(!fieldNameChecked.checked)
		{
			//XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
	  		var fieldName = "<%=AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Name")%> ";           	
	  		var field 	= formName.txtName;
	  		iValidForm = basicValidation(formName,field,fieldName,true,true,true,false,false,false,false);   
		}
        }

        if (!iValidForm) {
           return ;
        }

        return iValidForm;
     } 
     
     // close button
     function closeWindow()
     {
        <%        	
            out.println("getTopWindow().closeSlideInDialog();");            
        %>
     }
     
     function cancelSlideIn()
     {
	getTopWindow().closeSlideInDialog();
     }	
    
     <%       
       StringBuffer sQueryString = new StringBuffer("");
       Enumeration eNumParameters = emxGetParameterNames(request);
       while( eNumParameters.hasMoreElements() ) {
         String strParamName = (String)eNumParameters.nextElement();
         String strParamValue = emxGetParameter(request, strParamName);         
         sQueryString.append("&" + strParamName + "=" + strParamValue);
       }
       sQueryString.deleteCharAt(0);
       
       String strURL = AWLUtil.strcat("../awl/AWLArtworkTemplateCreateProcess.jsp?", sQueryString.toString());      
     %>
    
    
    // submit button
    function submit()
    {
    	if(isProcessing)
		{
			alert(emxUIConstants.STR_URL_SUBMITTED);
		}
		else
		{
	        var tempFileName = document.UploadTemplateFile.file.value;      
	        var fileSep = "\\";
	        
		//ensuring its not linux to fix IR-974096-3DEXPERIENCER2023x by rrr1
	        if (isUnix && !isLinux) {
	                fileSep = "/";
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
	         
	         // XSSOK invalidImageFile :  Local variable coming from Res Bundle-I18N  
	          alert("<%=invalidImageFile%>");
	          document.UploadTemplateFile.file.focus();
	          return;
	        }  	        
	        document.UploadTemplateFile.fileName0.value = tempFileName;
	      
	       
	      
	      // SY6 : Its required to validate the Artwork Template Creation form
	      var iValidForm=true;
	      iValidForm = validateArtworkTemplate();
	      if (!iValidForm) {
	          return ;
	      }
	      formName.action ="<xss:encodeForJavaScript><%=strURL%></xss:encodeForJavaScript>";
	      turnOnProgress();
		  isProcessing = true;
		  formName.submit();
	    }
   }

    </script>
    
    <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
    <%@include file = "../emxUICommonEndOfPageInclude.inc"%>
