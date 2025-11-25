
<%-- Common Includes --%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.dao.GraphicDocument"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "AWLUICommonAppIncludeWithStrictDocType.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>
    
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<%@page import="java.util.List"%>
<%
	String acceptLanguage = request.getHeader("Accept-Language");
	String bundle = "emxAWLStringResource";
%>

<%@page import="matrix.util.StringList"%>
<%@include file="emxValidationInclude.inc" %>


<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>

<script type="text/javascript">
    
    $(document).ready(function() { 
        $('#masterElementData').css('left', '0');
    });
    </script>

    <%
    	String strURL = null;
        String strUploadXMLAlert = null;
        String invalidImageFile = null;
        String noUploadXMLFile = null;
	    try{       
	    	
	    	String sFunctionality = emxGetParameter(request, "functionality");
			String sSuiteKey = emxGetParameter(request, "suiteKey");
			if (sSuiteKey.indexOf("eServiceSuite") != 0){
			      sSuiteKey = "eServiceSuite" + sSuiteKey;
			  }
			
			//Process Page
			String strProcessFailMsgKey = AWLUtil.strcat(sSuiteKey,".",sFunctionality,".processFailMsg");
			strProcessFailMsgKey = AWLPropertyUtil.getConfigPropertyString(context,strProcessFailMsgKey).trim();
			 
			//Current Page
			String strWrongFileMsgKey = AWLUtil.strcat(sSuiteKey,".",sFunctionality,".WrongFileMsg");
			strWrongFileMsgKey = AWLPropertyUtil.getConfigPropertyString(context,strWrongFileMsgKey).trim();
			 
			strUploadXMLAlert = AWLPropertyUtil.getI18NString(context, strWrongFileMsgKey);
		    invalidImageFile = AWLPropertyUtil.getI18NString(context, "emxAWL.Common.InvalidFileName");
		    noUploadXMLFile = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.NoUploadXMLFileMsg");
		     
		     
		    //Query params for processingjsp
		    String strProcessURLKey = AWLUtil.strcat(sSuiteKey,".",sFunctionality,".processURL");
			String strProcessURL = AWLPropertyUtil.getConfigPropertyString(context,strProcessURLKey).trim();
		    strURL = AWLUtil.strcat("../awl/",strProcessURL,"?","functionality=",sFunctionality);
	        
	    	
           	String uiType = emxGetParameter(request,"uiType");
    %>
    
    <%@include file = "../emxUICommonHeaderEndInclude.inc"%>

     <!-- Master create Form -->
     <form name="UploadFile" method="post" enctype="multipart/form-data" onsubmit="submitForm(); return false">
    	<%@include file = "../common/enoviaCSRFTokenInjection.inc"%> 
     <div id="masterElementData">
            <input type="hidden" name="uiType" value="<xss:encodeForHTMLAttribute><%=uiType%></xss:encodeForHTMLAttribute>" />
            <input type="hidden" name="failMsgKey" value="<xss:encodeForHTMLAttribute><%=strProcessFailMsgKey%></xss:encodeForHTMLAttribute>" />

       <table border="0" cellpadding="5" cellspacing="2" >
        <!-- Image Field -->
        <tr>
          <td  nowrap  width="150" class="label">
          <!-- XSSOK .getI18NString : Res Bundle-I18N -->
           <label for="Name"> <%=AWLPropertyUtil.getI18NString(context, "emxAWL.Form.XMLFile")%>
          </label></td>
        </tr>
        <tr>
          <td nowrap   width="380" class="inputField">
          <input type="file" name="file" id="file" onpaste="return false;" onKeyPress="return displaymessage(event);" >      
          <input type="hidden" name="fileName0" id="fileName0">
          </td>
        </tr>
       </table>
    </div>
  </form>
     <%
     	}catch(Exception e) {
     			e.printStackTrace();
     		%>
          	<html><body>
  			<br><br>
  
    		<b>Error in AWLGlobalPreferenceConfigUpload.jsp URL or instance configuration:</b> <br><br>Exception: <xss:encodeForHTML><%=e.getMessage()%></xss:encodeForHTML><br><br>
    		Possible causes include:<br>
			    1. Missing String in property file<br>
			    2. Incorrect Suite Key<br>
			    3. Instance definition in app property file is incorrect<br>
  			</body></html>
        <%}
     %>
     <script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
     <script language="javascript" type="text/javaScript">
     var  formName = document.UploadFile;
	 var isProcessing = false;
	 
	 function checkForFileEntry() {
		 if(document.UploadFile.fileName0.value==""){
			//XSSOK OK
			 alert("<%=noUploadXMLFile%>");
			 return false;
		 }
		 return true;
	 }
     
     function cancelSlideIn()
     {
    		 if(getTopWindow().slideInFrame)
 			{
    			 return getTopWindow().closeSlideInDialog();
 			}
    		 else if(getTopWindow().getWindowOpener()){
    			 getTopWindow().close();
    		}	
     }


    //When Enter Key Pressed on the form
    function submitForm()
    {
        submit();
    }
    
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
	        // removed isMac 
	        if (isUnix) {
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
	        	//XSSOK OK
	          alert("<%=invalidImageFile%>");
	          document.UploadFile.file.focus();
	          return;
	        }   
	        document.UploadFile.fileName0.value = tempFileName;
	        
	        //Validate upload file extension
	        if(document.UploadFile.fileName0.value != "")
	        {
	            var dotIndex = tempFileName.lastIndexOf(".");
	            var fileExtension = tempFileName.substring(dotIndex+1, tempFileName.length);
	            fileExtension = fileExtension.toLowerCase();
	           
	            if(fileExtension != "xml")
	            {
	            	//XSSOK OK
	                alert("<%=strUploadXMLAlert%>");
	                document.UploadFile.file.focus();
	                return;
	            }
	        }
	  
	       
	      var iValidForm=true;
	      iValidForm = checkForFileEntry();
	      if (!iValidForm)
	      {
	          return ;
	      }
	      //XSSOK OK
	      var submitURL = "<%=strURL%>";
	      formName.action = submitURL;
	      turnOnProgress();
		  isProcessing = true;
		  formName.submit();
	    }
   }

    </script>
    
    <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
    <%@include file = "../emxUICommonEndOfPageInclude.inc"%>
