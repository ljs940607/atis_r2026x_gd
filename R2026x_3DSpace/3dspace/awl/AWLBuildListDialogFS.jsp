
<%@include file="../emxUIFramesetUtil.inc"%>

<%

  String fieldNameActual = emxGetParameter(request,"fieldNameActual");
  String fieldListItemName=emxGetParameter(request,"fieldListItemName");
  String filedSeparator=emxGetParameter(request,"fieldSeparatorName");
  String chkBoxSelectedValue= emxGetParameter(request,"chkBoxSelectedValue");


  framesetObject fs = new framesetObject();
  
  fs.setDirectory("awl");
  String initSource = emxGetParameter(request,"initSource");
  if (initSource == null){
    initSource = "";
  }
  String jsTreeID = emxGetParameter(request,"jsTreeID");
  String suiteKey = emxGetParameter(request,"suiteKey");
  // ----------------- Do Not Edit Above ------------------------------
  String sNewRev = emxGetParameter(request,"RevMode");
  String strObjectId  = emxGetParameter(request,"objectId");
  
  //Obtain the object id
  if (strObjectId != null) {
    fs.setObjectId ( strObjectId );
  }
  String strProductID = emxGetParameter(request, "productID");

  // Specify URL to come in middle of frameset
  String contentURL = "AWLBuildListDialog.jsp";

  // add these parameters to each content URL, and any others the App needs
  contentURL += "?suiteKey=" + suiteKey + "&initSource=" + initSource + "&jsTreeID=" + jsTreeID;
  contentURL += "&PRCFSParam1=PartFamily";
  contentURL += "&objectId=" + strObjectId;
  contentURL += "&productId=" + strProductID;
  contentURL += "&fieldNameActual="+fieldNameActual;
  contentURL += "&chkBoxSelectedValue="+chkBoxSelectedValue;
  contentURL += "&fieldListItemName="+fieldListItemName;
  contentURL += "&filedSeparator="+ filedSeparator;
  // Marker to pass into Help Pages
  // icon launches new window with help frameset inside
  String HelpMarker = "emxhelpaddlistitems";


  fs.initFrameset("emxAWL.TopHeader.BuildListIngrdiantDeclatration",
                  HelpMarker,
                  contentURL,
                  false,
                  true,
                  false,
                  false);

  fs.setStringResourceFile("emxAWLStringResource");

  fs.createFooterLink("emxCommonButton.Done",
                      "checkInput()",
                      "role_GlobalUser",
                      false,
                      true,
                      "common/images/buttonDialogDone.gif",
                      0);

 
  fs.createFooterLink("emxCommonButton.Cancel",
                      "parent.closeWindow()",
                      "role_GlobalUser",
                      false,
                      true,
                      "common/images/buttonDialogCancel.gif",
                      0);
  
  fs.setToolbar("AWLListItemSearchToolbar");
  // ----------------- Do Not Edit Below ------------------------------

  fs.writePage(out);

%>




