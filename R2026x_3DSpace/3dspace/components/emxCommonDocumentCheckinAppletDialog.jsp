<%-- emxComponentsMultiFileUploadDialogCode.jsp - used for Checkin of file into Document Object
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   static const char RCSID[] = "$Id: emxCommonDocumentCheckinAppletDialog.jsp.rca 1.22 Wed Oct 22 16:18:54 2008 przemek Experimental przemek $"
--%>
<%@ page import="com.matrixone.servlet.Framework,com.matrixone.fcs.mcs.McsBase" %>
<%@page import="com.matrixone.apps.common.util.DocumentUtil"%>
<%@include file = "../emxContentTypeInclude.inc"%>
<%@include file = "emxComponentsCheckin.inc"%>


<%
    Map emxCommonDocumentCheckinData = (Map) session.getAttribute("emxCommonDocumentCheckinData");
    String restrictedFormats = EnoviaResourceBundle.getProperty(context,"emxComponents.Commondocument.RestrictedFormats");
    boolean allowedFormatsEnable = false;
    String allowedFileExtensions = "";
    try
    {
    	allowedFileExtensions = FrameworkProperties.getProperty(context,"emxComponents.Commondocument.SupportedFormats"); 
    	if (allowedFileExtensions != null && !"".equals(allowedFileExtensions))
    	{
    		allowedFormatsEnable = true;
    	}
    } catch(Exception ex)
    {
    	//Do Nothing
    }
    // Reading request parameters and storing into variables
    String objectId            = (String) emxCommonDocumentCheckinData.get("objectId");
    String store               = (String) emxCommonDocumentCheckinData.get("store");
    String objectType          = (String) emxCommonDocumentCheckinData.get("type");
    String objectPolicy        = (String) emxCommonDocumentCheckinData.get("policy");

    String objectAction        = (String) emxCommonDocumentCheckinData.get("objectAction");  
    String fileRequired        = (String) emxCommonDocumentCheckinData.get("fileRequired");
    String objectAliasType     = (String) emxCommonDocumentCheckinData.get("defaultType");
    String languageStr	       = (String) request.getHeader("Accept-Language");

    
    String DocumentFileRequired = EnoviaResourceBundle.getProperty(context,"emxComponents.CommonDocument.DocumentFileRequired");
    if ("true".equalsIgnoreCase(DocumentFileRequired))
    {
        if ( fileRequired == null || fileRequired.equals("") || "true".equalsIgnoreCase(fileRequired))
        {
            fileRequired = "true";
        }
        else
        {
            fileRequired = "false";
        }
    } 
    else
    {
        if ( fileRequired == null || fileRequired.equals("") || "false".equalsIgnoreCase(fileRequired))
        {
            fileRequired = "false";
        }
        else
        {
            fileRequired = "true";
        }
    }

    if (objectAction == null || objectAction.equals("") )
    {
        objectAction = "create";
    }


    StringList formats = new StringList();
    FormatList formatList = new FormatList();
    String defaultFormat = "generic";
    if ( objectAliasType == null || objectAliasType.equals("") || objectAliasType.equals("null"))
    {
        objectAliasType = "type_Document";
    }
    if ( objectType == null || "".equals(objectType) || "null".equals(objectType) )
    {
        objectType = PropertyUtil.getSchemaProperty(context, objectAliasType);
        emxCommonDocumentCheckinData.put("type", objectType);
    }
    if ( objectPolicy == null || "".equals(objectPolicy) || "null".equals(objectPolicy) )
    {
        objectPolicy = null;
    }

	String storeFromBL = DocumentUtil.getStoreFromBL(context, "Document");
	
    if ( store == null || store.equals("") )
    {
        store = com.matrixone.apps.common.Person.getPerson(context).getInfo(context, DomainConstants.SELECT_COMPANY_STORE);
    }

    String webAppName = Framework.getFullClientSideURL(request,response,"");
    String policyStore = "";
    String formatStr = "";
    Document document = (Document)DomainObject.newInstance(context, CommonDocument.TYPE_DOCUMENT);
    // Modified for the Bug No: 340337 1 && 322203 1/7/2008 5:29 PM Begin 

    if ( objectId != null && !objectId.equals("") && !objectAction.equalsIgnoreCase("image")) {
        document.setId(objectId);
        StringList selectList = new StringList();
        selectList.add(CommonDocument.SELECT_DEFAULT_FORMAT);
        selectList.add(CommonDocument.SELECT_FORMATS);
        selectList.add(CommonDocument.SELECT_STORE);
        Map commonDocMap = document.getInfo(context, selectList);
        policyStore = (String)commonDocMap.get(CommonDocument.SELECT_STORE);
        defaultFormat = (String)commonDocMap.get(CommonDocument.SELECT_DEFAULT_FORMAT);
        formats = (StringList)commonDocMap.get(CommonDocument.SELECT_FORMATS);
		} 
//added the below condition for the bug 322203 to download the jt files 
else if ( objectAction.equalsIgnoreCase("image") || !objectAction.equalsIgnoreCase(CommonDocument.OBJECT_ACTION_UPDATE_HOLDER) ) {
// Modified for the Bug No: 340337 1 && 322203 1/7/2008 5:29 PM End
        MapList policyList = mxType.getPolicies(context,objectType,true);
        Iterator itr = policyList.iterator();
        while( itr.hasNext() )
        {
            Map m = (Map)itr.next();
            String typePolicy = (String)m.get("name");
            if ( objectPolicy == null || objectPolicy.equals(typePolicy) )
            {
                if (policyStore!= null && policyStore.equals("") )
                {
                    policyStore = (String)m.get("store");
                }
                formats = (StringList) m.get("formats");
                defaultFormat = (String)m.get("defaultFormat");
                break;
            }
        }
    }

    if ( formats != null && formats.size() >= 1)
    {
        formatStr = FrameworkUtil.join(formats,",");
    }
    String isVCDoc = (String)emxCommonDocumentCheckinData.get("isVcDoc");
    if("true".equals(isVCDoc) && store.equals("")) {
	if(storeFromBL != null && !storeFromBL.trim().equals(""))
	{
		System.out.println("L48 : CommonDocumentCheckinAppletDialog isVCDoc = true setting store = storeFromBL");
		store = storeFromBL;
	}
	else
       		store = (String)emxCommonDocumentCheckinData.get("server");
    }
    else if (isVCDoc == null || "false".equalsIgnoreCase(isVCDoc))
    {
	
	if(storeFromBL != null && !storeFromBL.trim().equals(""))
	{
		System.out.println("L48 : CommonDocumentCheckinAppletDialog setting store = storeFromBL");
		store = storeFromBL;
	}
	else
	{
	        if ( store != null && (!(store.trim()).equals("")) )
	        {
	            store = PropertyUtil.getSchemaProperty(context,store);
	        }
		else if (policyStore == null || (policyStore.trim().equals("")) ) 
		{
	        store = PropertyUtil.getSchemaProperty(context,"store_STORE");
	        } 
		else 
		{
	        store = policyStore;
	        }
	}
    }
    Store storeObject = new Store(store);
    storeObject.open(context);
    boolean storeLocked = storeObject.getLocked(context);
    storeObject.close(context);


    if(!"".equals(store)  )
    {
        String symbolicStoreName = FrameworkUtil.getAliasForAdmin(context, "store", store, true);
   		emxCommonDocumentCheckinData.put("store", symbolicStoreName);
    }

    
    //String commentsName = com.matrixone.client.fcs.FcsClient.resolveFcsParam(com.matrixone.fcs.mcs.McsBase.getCommentParamName(0));

    String error = (String)session.getAttribute("error.message");
    if (error != null) {
%>
      &nbsp;
      <table width="90%" border="0"  cellspacing="0" cellpadding="3"  class="formBG" align="center" >
        <tr >
          <td class="errorHeader"><%=XSSUtil.encodeForHTML(context, ComponentsUtil.i18nStringNow("emxComponents.Error.Header", languageStr))%></td>
        </tr>
        <tr align="center">
          <td class="errorMessage" align="center"><%=XSSUtil.encodeForHTML(context, error)%></td>
        </tr>
      </table>
<%
      session.removeAttribute("error.message");
    }
    String allowedFormats = "";
    String currentImages = "";
    if ( "image".equalsIgnoreCase(objectAction) )
    {
      StringList images = null;
      allowedFormats = EnoviaResourceBundle.getProperty(context,"emxComponents.ImageManager.AllowedFormats");
      DomainObject obj = DomainObject.newInstance(context, objectId);
      StringList imageNames = obj.getInfoList(context, DomainObject.SELECT_IMAGE_HOLDER_MX_SMALL_IMAGE_FILE_NAMES);
      if ( imageNames != null )
      {
        images =  new StringList(imageNames.size());
        Iterator imageItr = imageNames.iterator();
        while(imageItr.hasNext())
        {
            String imageName = (String)imageItr.next();
            images.add(imageName.substring(0, imageName.lastIndexOf(".")));
        }
      }
      currentImages = FrameworkUtil.join(images, ",");
    }


%>
<script language="JavaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"></script> 
<script language="JavaScript" src="../common/scripts/emxUICore.js" type="text/javascript"></script>

<script language="javascript">
		
/**
* This function will filter the contents of value as per the property: emxFramework.FilterParameterPattern*
*/
function filterParameter(value){
      try{
        var startIndex = -1;        		      
      	<%
	      	String filterParameterPattern = EnoviaResourceBundle.getProperty(context,"emxFramework.FilterParameterPattern");
	      	if(filterParameterPattern != null && !filterParameterPattern.trim().equals(""))
	      	{				
	      		StringTokenizer st = new StringTokenizer(filterParameterPattern, ",");
	          	String [] filters = new String[st.countTokens()];
		        for (int count = 0; st.hasMoreTokens(); count++)
		        {
	    	    	// convert to lower case for easier matching	    	    	
	        	    filters[count] = st.nextToken().trim().toLowerCase();
	    	    	if(!filters[count].equals("</script>"))
	    	    	{    
	        %>    		startIndex = value.toLowerCase().indexOf("<%=filters[count]%>");				        
	      	<%		}
	    	    	else
	    	    	{
	    	%>	    	startIndex = value.toLowerCase().indexOf("</script");
	    				if(startIndex > -1)	
	    				{
	    					if(!value.substring(startIndex + 8, startIndex + 9 ) == ">")
	    					{
	    						startIndex = -1;
	    					}
	    				}	    				
	    	<%    	}
	      	%>
	        	    if(startIndex > -1)
	           		{
	              		var subString1 = value.substring(0,startIndex);
	              		var subString2="";
	              		try{
	              			subString2 = value.substring(startIndex + <%=filters[count].length()%> , value.length);
	              		}catch(e){
	              			subString2 = value.substring(startIndex + <%=filters[count].length()%> , value.length());
	              		}
	              		value = subString1 + subString2;	              	
	              	}
	        <%	              
	   			}
			
	      	}%>
      	}catch (e){}
return value;
}

  function checkinFile()
  {
      var fileName;
      var fileFormat;
      var fileTitle;
      var fileComments;
      var fileDescription;
      var allowedFileExtensions = "<%=allowedFileExtensions%>";
      var hiddenForm = parent.frames["checkinHiddenFrame"].document.forms[0];
      hiddenForm.noOfFiles.value = getFileCount();

      var allowedFormats = "<%=allowedFormats%>";
	  //XSSOK
      var currentImages = "<%=currentImages%>";
      var objectAction = "<%=XSSUtil.encodeForJavaScript(context, objectAction)%>";
      allowedFormats = allowedFormats.toLowerCase();
      var imageFileName;
      var imageExt;
      var fileRequired = <%=XSSUtil.encodeForJavaScript(context, fileRequired)%>;
     

<%
      if ( storeLocked && isVCDoc == null ) {
%>
	//XSSOK
      alert ("<emxUtil:i18nScript localize="i18nId">emxComponents.CommonDocument.InvalidStore</emxUtil:i18nScript> ");
      return;
<%
    }  else if ( storeLocked && "true".equalsIgnoreCase(isVCDoc)) {
     String[] messageValues = new String[1];
     messageValues[0] = store;
     String invalidStoreAlert = MessageUtil.getMessage(context,null,"emxComponents.VCDocument.InvalidStore",messageValues,null,context.getLocale(),"emxComponentsStringResource");

%>
      alert ("<%=XSSUtil.encodeForJavaScript(context, invalidStoreAlert)%>");
      return;
<%
    }

%>
      if(getFileCount() == 0 && fileRequired)
      {
        alert ("<emxUtil:i18nScript localize="i18nId">emxComponents.Common.SelectFile</emxUtil:i18nScript>");
        return;
      }
      else
      {
          // prevent uploading if the number files to upload exceeds the max limit
          if(getFileCount() > maxLimit)
          {
            
            return;
          }

          // prevent upload of files with invalid chars
          var nameAllBadCharName = getAllFileBadChars(document.mainForm.name);
          var showBadFileAlert = false;
          var badCharinFile = "";
          var badCharFileList = "\n ";
          var filecount = getFileCount();
          for(var i = 0; i < filecount; i++)
          {
            
              if(showBadFileAlert && i == (filecount-1)){
            	  var uniqueList=badCharinFile.split(' ');
            	  var result = [];
            	  for(var i =0; i < uniqueList.length ; i++){
            	      if(result.indexOf(uniqueList[i]) == -1) result.push(uniqueList[i]);
            	  }
            	  badCharinFile = result.join(" ");
              }
 			  var alertMessage="<emxUtil:i18nScript localize="i18nId">emxComponents.ErrorMsg.InvalidFileName</emxUtil:i18nScript>";
              alertMessage=alertMessage.replace("{0}",badCharinFile);
              alert(alertMessage+badCharFileList+"<emxUtil:i18nScript localize="i18nId">emxComponents.Common.AlertInvalidInput</emxUtil:i18nScript>"+nameAllBadCharName+"<emxUtil:i18nScript localize="i18nId">emxComponents.Common.AlertRemoveInValidChars</emxUtil:i18nScript>");
                return;
              }
              
             
              
              if (badCharComments.length != 0)
              {
                var commentAllBadCharName = getAllFileBadChars();
      			alert("<emxUtil:i18nScript localize="i18nId">emxComponents.ErrorMsg.InvalidInputMsg</emxUtil:i18nScript>"+badCharComments+"<emxUtil:i18nScript localize="i18nId">emxComponents.Common.AlertInvalidInput</emxUtil:i18nScript>"+commentAllBadCharName+"<emxUtil:i18nScript localize="i18nId">emxComponents.Common.AlertRemoveInValidChars</emxUtil:i18nScript>");
               
                return;
              }
              }
              
              for ( var j = 0; j < getFileCount(); j++ ) {
                if( i != j )
                {
                  return;
                  }
                }

            }

<%
		String fileExtensionFormats = EnoviaResourceBundle.getProperty(context,"emxComponents.VersionControl.FolderAllowedFormats");
         if ( objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_FILE_FOLDER) ||
              objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CONVERT_CHECKIN_VC_FILE_FOLDER) ||
              objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_ZIP_TAR_GZ) ||
               objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CHECKIN_VC_FOLDER) ||
			 objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_ON_DEMAND))
         {
            String fileORfolder = (String) emxCommonDocumentCheckinData.get("vcDocumentType");
            if(objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_ZIP_TAR_GZ) ||
                      (fileORfolder != null && fileORfolder.equals("Folder")) ||
                      objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CHECKIN_VC_FOLDER))
            {
            
%>
                var fileExtensionFormats = "<%=fileExtensionFormats%>";
                var fileNameLength = "";
                if(isIE) {
                    fileNameLength = fileName.length;
                }else {
                    fileNameLength = fileName.length();
                }
                var fileExt = fileName.substring(fileName.lastIndexOf(".")+1, fileNameLength);
                fileExt= fileExt.toLowerCase();
                if(fileExtensionFormats.indexOf(fileExt.toLowerCase()) < 0){
                    alert("<emxUtil:i18nScript localize="i18nId">emxComponents.Image.NotSupportedFormat</emxUtil:i18nScript>" + fileExtensionFormats);
                    return;
                }
<%
            } 
          }

        if ( objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CHECKIN_VC_FILE) ||
            objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_ON_DEMAND)){
		    DomainObject checkObj = new DomainObject(objectId);
		    String checking = checkObj.getInfo(context, CommonDocument.SELECT_VCFOLDER);
		    if(checking.equals("TRUE")){
%>
               var fileExtensionFormats = "<%=fileExtensionFormats%>";
                var fileNameLength = "";
                if(isIE) {
                    fileNameLength = fileName.length;
                }else {
                    fileNameLength = fileName.length();
                }
                var fileExt = fileName.substring(fileName.lastIndexOf(".")+1, fileNameLength);
                fileExt= fileExt.toLowerCase();
                if(fileExtensionFormats.indexOf(fileExt.toLowerCase()) < 0){
                    alert("<emxUtil:i18nScript localize="i18nId">emxComponents.Image.NotSupportedFormat</emxUtil:i18nScript>" + fileExtensionFormats);
                    return;
                }
		
<%           }// eof Checking if
    	} // eof object action to Checkin VC FIle
 %>

      if(objectAction.toLowerCase() == "image") {

          imageFileName = fileName;

          var len = 0;
          if(navigator.appName == "Microsoft Internet Explorer") {
          len = imageFileName.length;
          }
        //Modify:12-Aug-09:nr2:R208:COM:Bug:378065
        //The upload button was not working in FireFox3 as imageFileName.length() was not being identified. 
          else if(navigator.appName == "Netscape"){
        	  len = imageFileName.length;
          }
          //End:R208:COM:Bug:378065
          else {
            len = imageFileName.length();
          }

          imageExt = imageFileName.substring(imageFileName.lastIndexOf(".")+1, len);

          imageName = imageFileName.substring(0,imageFileName.lastIndexOf("."));

          if ( allowedFormats.indexOf(imageExt.toLowerCase()) < 0 )
          {
          alert("<emxUtil:i18nScript localize="i18nId">emxComponents.Image.NotSupportedFormat</emxUtil:i18nScript>" + allowedFormats);
          return;
          }
          if ( currentImages.indexOf(imageName) >= 0 )
          {
            if(!confirm("<emxUtil:i18nScript localize="i18nId">emxComponents.Image.ConfirmFileOverwrite</emxUtil:i18nScript>" ))
            {
             return;
            }
          }
      } else {
             var restrictedFormats = "<%=restrictedFormats%>";
             restrictedFormats = restrictedFormats.toLowerCase();
             var restrictedFormatArr = restrictedFormats.split(","); 
	  var vFileName = fileName;
	  var fileExt = vFileName.substring(vFileName.lastIndexOf(".")+1, vFileName.length);
                  if (jQuery.inArray(fileExt.toLowerCase(), restrictedFormatArr) >= 0)
                  {
                      alert("<emxUtil:i18nScript localize="i18nId">emxComponents.CommonDocument.NotSupportedFormat</emxUtil:i18nScript>" + restrictedFormats);
                      return;
                  }
<%	        
	        if(allowedFormatsEnable)
			{
%>				
				if ( allowedFileExtensions.indexOf(fileExt.toLowerCase()) < 0 ){		
		    		alert("<emxUtil:i18nScript localize="i18nId">emxComponents.CommonDocument.SupportedFormat</emxUtil:i18nScript>" + allowedFileExtensions);
		            return;
				}
<%
	        }
%>	            
      }
      
     eval("hiddenForm.fileName" + i + ".value='" + fileName + "'");
     
     

  

          }
      }
      hiddenForm.store.value = "<%=XSSUtil.encodeForJavaScript(context, store)%>";
      hiddenForm.objectId.value = "<%=XSSUtil.encodeForJavaScript(context, objectId)%>";
      hiddenForm.submit();
  }

 function checkinCancel() {
<%
    if ( objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_FILE_FOLDER)
        || objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_ZIP_TAR_GZ)
        || objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CONVERT_CHECKIN_VC_FILE_FOLDER) 
        || objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CREATE_VC_ON_DEMAND)) {
 %>
     document.mainForm.action = "emxCommonDocumentCancelProcess.jsp?objectId=<%=XSSUtil.encodeForURL(context, objectId)%>";
     //document.miscAction.enctype = "application/x-www-form-urlencoded";
     document.mainForm.submit();
     //getTopWindow().close();
<%
   }
    else {
 %>
      getTopWindow().closeWindow();
  <%
    }
  %>
 }
  function closeWindow()
  {
    window.closeWindow();
  }

   var interval;
  
 
  
 


  // function to be called on click of previous button
  function goBack() {
  <%   if( objectAction.equalsIgnoreCase(VCDocument.OBJECT_ACTION_CONVERT_CHECKIN_VC_FILE_FOLDER))
    {
 %>
      document.mainForm.action="emxCommonDocumentConversionDialogFS.jsp?fromAction=previous";
 <%   }
    else{
%>
    // submit with values to process page of step 4; then from there redirect to step 3
    document.mainForm.action="emxCommonDocumentCreateDialogFS.jsp?fromAction=previous";
 <%   }  %>
    document.mainForm.submit();
    return;

  }

  // On Browser resize, Resize Applet 
 

</script>
<%
    int interval = session.getMaxInactiveInterval();
    int maxInterval = Integer.parseInt((String)EnoviaResourceBundle.getProperty(context,"emxFramework.ServerTimeOutInSec"));
    if ( interval != maxInterval )
    {
      session.setMaxInactiveInterval(maxInterval);
      session.setAttribute("InactiveInterval", new Integer(interval));
    }
    String firstLang = languageStr.split(",")[0];
    String locale = firstLang.split("-")[0];
    HashMap props = new HashMap();
    props.put("formats", formatStr);
    props.put("defaultFormat", defaultFormat);
    props.put("showAdvanced", "true");
    props.put("language", locale);

   
%>

<script>




//To update the DOM cookie, it wont overide the existing cookies.
function updateCookies(name, value)
{
	document.cookie = name+"="+value;
}




function parseSpChr(argString)
{
	var regEx = new RegExp ("\\\\", 'gi') ;
	argString = argString + "";
	argString = argString.replace(regEx, "\\\\");
	regEx = new RegExp ("'", 'gi') ;
	argString = argString.replace(regEx, "\\'");
	regEx = new RegExp ("\"", 'gi') ;
	argString = argString.replace(regEx, "\\\"");
    return argString;    
}

</script>
<form name = "mainForm" method = "post" enctype = "multipart/form-data" action="" target="_parent">
  <input type="hidden" name=parentId value="<xss:encodeForHTMLAttribute><%=objectId%></xss:encodeForHTMLAttribute>" />
</form>
<form action='emxCommonDocumentCheckinProcess.jsp' method='post' name='noFilesForm'>
<%@include file = "../common/enoviaCSRFTokenInjection.inc"%>
  <input type='hidden' name='noOfFiles' value='0'>
</form>
<%@include file = "../emxUICommonEndOfPageInclude.inc" %>


