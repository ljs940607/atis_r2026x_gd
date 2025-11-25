<%-- emxCommonDocumentUpdateAppletDialogFS.jsp - used for Checkin of file into Document Object
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   static const char RCSID[] = "$Id: emxCommonDocumentUpdateAppletDialogFS.jsp.rca 1.22 Wed Oct 22 16:18:54 2008 przemek Experimental przemek $"
--%>

<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "emxComponentsUtil.inc"%>

<%@include file = "../common/emxUIConstantsInclude.inc"%>
<%@ page import = "com.matrixone.apps.domain.util.FrameworkProperties" %>
<script language="javascript" src="../common/scripts/emxUICore.js"></script>
<%
  Map emxCommonDocumentCheckinData = (Map) session.getAttribute("emxCommonDocumentCheckinData");

  if(emxCommonDocumentCheckinData == null)
  {
    emxCommonDocumentCheckinData = new HashMap();
  }

  Enumeration enumParam = request.getParameterNames();

  // Loop through the request elements and
  // stuff into emxCommonDocumentCheckinData
  while (enumParam.hasMoreElements())
  {
      String name  = (String) enumParam.nextElement();
      String value = emxGetParameter(request,name); //request.getParameter(name);
      emxCommonDocumentCheckinData.put(name, value);
  }
  
  String documentType = (String) emxCommonDocumentCheckinData.get("realType");
  String objectId = (String) emxCommonDocumentCheckinData.get("objectId");
  String objectAction = (String)emxCommonDocumentCheckinData.get("objectAction");
  String oldFileName = (String) emxCommonDocumentCheckinData.get("oldFileName");
  String noOfFilesStr        = (String) emxCommonDocumentCheckinData.get("noOfFiles");
  String languageStr		   = (String) request.getHeader("Accept-Language");
  
  String checkinFileFrom     = (String) emxCommonDocumentCheckinData.get("checkinFileFrom");
  String deleteFileOnCheckin     = (String) emxCommonDocumentCheckinData.get("deleteFileOnCheckin");
  String checkinDirValue     = (String) emxCommonDocumentCheckinData.get("checkinDirValue");  
 
  String policyStore = "";
  String format = "";
  String fileName = "";
  
  MapList docList = new MapList();
  int noOfFiles = 0;
	  
  noOfFilesStr = !UIUtil.isNullOrEmpty(noOfFilesStr) ? noOfFilesStr : EnoviaResourceBundle.getProperty(context,"emxComponents.MultiFileUpload.NoOfFiles");  

  Map objectMap = new HashMap();

  if(documentType == null)
  {
      documentType = CommonDocument.TYPE_DOCUMENT;
  }
  emxCommonDocumentCheckinData.put("type", documentType);

  // put the document attribute values into formBean
  // since JPO expects the attributes in a map, stuff the formBean with attribute map
  // get the list of Attribute names
  MapList attributeMapList = mxType.getAttributes( context, documentType);

  Iterator i = attributeMapList.iterator();
  String attributeName = null;
  String attrValue = "";
  String attrType = "";
  double tz = Double.parseDouble((String) session.getAttribute ( "timeZone" ));
  Map attributeMap = new HashMap();
  while(i.hasNext())
  {
      Map attrMap = (Map)i.next();
      attributeName = (String)attrMap.get("name");
      attrValue = (String) emxCommonDocumentCheckinData.get(attributeName);
      attrType = (String)attrMap.get("type");
      if ( attrValue != null && !"".equals(attrValue) && !"null".equals(attrValue) )
      {
          if("timestamp".equals(attrType))
          {
             attrValue = eMatrixDateFormat.getFormattedInputDate(context, attrValue, tz,request.getLocale());
          }
          attributeMap.put( attributeName, attrValue);
      }
  }
  String accessType = (String)emxCommonDocumentCheckinData.get("AccessType");
  String accessAttrStr = PropertyUtil.getSchemaProperty(context, "attribute_AccessType");
  if ( accessType != null && !"".equals(accessType) && !"null".equals(accessType))
  {
      attributeMap.put( accessAttrStr, accessType);
  }

  // stuff the formBean with attribute map
  emxCommonDocumentCheckinData.put( "attributeMap", attributeMap);
  
  
  
  if ( objectAction.equals(CommonDocument.OBJECT_ACTION_UPDATE_MASTER) ) {
	  
	  String objectWhere = CommonDocument.SELECT_LOCKER + "== '" + context.getUser() +"'";
      if (! UIUtil.isNullOrEmpty(oldFileName))
      {
          objectWhere += " && (" + CommonDocument.SELECT_TITLE + "== '" + oldFileName + "')";
      }	        
	  
	  StringList objectSelects = new StringList();    
      
      objectSelects.add(CommonDocument.SELECT_ID);
      objectSelects.add(CommonDocument.SELECT_CHECKIN_REASON);
      objectSelects.add(CommonDocument.SELECT_FILE_NAME);
      objectSelects.add(CommonDocument.SELECT_FILE_FORMAT);
      objectSelects.add(CommonDocument.SELECT_STORE);
      objectSelects.add(CommonDocument.SELECT_TITLE);      
      
      DomainObject object = DomainObject.newInstance(context, objectId);
      docList = object.getRelatedObjects(context,                       // context.
                                        CommonDocument.RELATIONSHIP_ACTIVE_VERSION,  // rel filter.
                                        CommonDocument.TYPE_DOCUMENTS,               // type filter.
                                        objectSelects,                   // business selectables.
                                        null,                   // relationship selectables.
                                        false,                        // expand to direction.
                                        true,                         // expand from direction.
                                        (short) 1,                    // level
                                        objectWhere,                  // object where clause
                                        CommonDocument.EMPTY_STRING);
      noOfFiles = docList.size();     
    
      objectMap = object.getInfo(context, objectSelects);
      
      policyStore = (String)objectMap.get(CommonDocument.SELECT_STORE);
      emxCommonDocumentCheckinData.put( "store", policyStore);
      emxCommonDocumentCheckinData.put("deleteFromTree", objectId);
      emxCommonDocumentCheckinData.put("format", CommonDocument.SELECT_FILE_FORMAT);
      emxCommonDocumentCheckinData.put("append", "true");
      
      StringList objectFileNames = (StringList)objectMap.get(CommonDocument.SELECT_FILE_NAME);
      StringList objectFileFormats = (StringList)objectMap.get(CommonDocument.SELECT_FILE_FORMAT);
      String fileTitle = (String)objectMap.get(CommonDocument.SELECT_TITLE);
      
      
      for(int j=0; j < noOfFiles; j++)
      {
    	  Map m = new HashMap();
    	  
    	  if ( docList.size() > j )
          {
              m = (Map)docList.get(j);
              
              if (! UIUtil.isNullOrEmpty(oldFileName))
              {
            	    int index = objectFileNames.indexOf(oldFileName);
            	    if ( index != -1 && objectFileFormats.size() >= index)
            	    	    {
            	    	    format = (String)objectFileFormats.get(index);
            	    	    fileName = (String)objectFileNames.get(index);
            	    	    }
               }
              else{
            	  format = (String)objectFileFormats.get(j);
                  fileName = (String)objectFileNames.get(j);
                  oldFileName = fileName;
              }
             

          }
      }
      emxCommonDocumentCheckinData.put( "fileName", fileName);
      emxCommonDocumentCheckinData.put( "format", format);
  }
  
  HashMap props = new HashMap();
   
 
  StringBuffer updates= new StringBuffer(),fileNames= new StringBuffer();
  String fName=""; 
  String directory = "";
  String userDefaultCheckoutFolder = Download.processDefaultCheckoutDirectory(context);
  for(int k=0; k < docList.size();k++){
	  Map m1 = new HashMap();
	  m1 = (Map)docList.get(k);
	  if(k != docList.size()-1){
		  fName = (String)m1.get(CommonDocument.SELECT_TITLE)+"|";
		  fileNames.append(fName);
		  	  
	  }else{
		  fName = (String)m1.get(CommonDocument.SELECT_TITLE);
		  fileNames.append(fName);			  
	  }
	  
  
  if (UIUtil.isNotNullAndNotEmpty(userDefaultCheckoutFolder)){
			  updates.append(userDefaultCheckoutFolder).append("/").append(fName);
	  directory = userDefaultCheckoutFolder;
  }
  
  else if (! UIUtil.isNullOrEmpty (checkinDirValue) && checkinFileFrom.equalsIgnoreCase("specific")){
	  
	  String specificCheckinFolder = checkinDirValue;
	  specificCheckinFolder = FrameworkUtil.findAndReplace (specificCheckinFolder , "\\", "/");
		  updates.append(specificCheckinFolder).append("/").append(fName);
	  directory = specificCheckinFolder;
  }
  }
 
    String firstLang = languageStr.split(",")[0];
    String locale = firstLang.split("-")[0];
	String files = fileNames.toString();
	String strupdates = updates.toString();
	emxCommonDocumentCheckinData.put( "oldFileName",files);
	//emxCommonDocumentCheckinData.put( "oldFileName0",files);
	emxCommonDocumentCheckinData.put("updates", strupdates);
  props.put("language", locale);
  props.put("files",files );
  props.put("updates", strupdates);
  
  if (! UIUtil.isNullOrEmpty (strupdates)){
	  props.put("directory", directory); 
  } 
  
  props.put("debug", "true");    
  //deleteAfterUpload is set to false initially and made true once the checkin happens with out ant error
  props.put("deleteAfterUpload", "false");

%>


<%@page import="com.matrixone.apps.common.Download"%>
<%@include file = "../emxJSValidation.inc" %>
<script language="javascript" src="../common/scripts/emxJSValidationUtil.js"></script>

  function checkinFile()
  {
     
	  var fileName;
	  var fileComments;
	  var message;
      var hiddenForm = parent.frames["checkinHiddenFrame"].document.forms[0];
      hiddenForm.noOfFiles.value = getFileCount();  
      var objectAction = "<%=XSSUtil.encodeForJavaScript(context, objectAction)%>";
      var oldFileName = "<%=XSSUtil.encodeForJavaScript(context, files)%>";
      var oldfiles = oldFileName.split("|");      
      var format = "<%=format%>";
      var filesCount = getFileCount();
     
		var nameAllBadCharName = getAllFileBadChars(document.forms[0].name);
      var showBadFileAlert = false;
      var badCharinFile = "";
      var badCharFileList = "\n ";
      var filecount = getFileCount();

 function checkinCancel() {

      getTopWindow().closeWindow();	
 
 }
  function closeWindow()
  {
    window.closeWindow();
  }

   // function to be called on click of previous button
  function goBack() {  
   
    document.mainForm.action="emxCommonDocumentCreateDialogFS.jsp?fromAction=previous";
    document.mainForm.submit();
    return;

  }


</script>

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
<%@include file = "../emxUICommonEndOfPageInclude.inc" %>
