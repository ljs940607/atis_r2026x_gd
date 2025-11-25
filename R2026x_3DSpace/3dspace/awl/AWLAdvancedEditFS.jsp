
<%@page import="com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import="com.matrixone.apps.framework.ui.framesetObject"%><%--  emxAWLAdvanceEditFS.jsp   -   
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
--%>

<%@include file="../emxUIFramesetUtil.inc"%>

<%
  framesetObject fs = new framesetObject();
 
  String initSource   = emxGetParameter(request,"initSource");  
  String jsTreeID     = emxGetParameter(request,"jsTreeID");
  String suiteKey     = emxGetParameter(request,"suiteKey");
  // ----------------- Do Not Edit Above ------------------------------
  String sNewRev      = emxGetParameter(request,"RevMode");
  String strObjectId  = emxGetParameter(request,"objectId");
  String strProductID = emxGetParameter(request, "productID");
  String rowId        = emxGetParameter(request, "rowId");
  String columnName   = emxGetParameter(request, "columnName");
  String BuildList   = emxGetParameter(request, "BuildList");
  String featureId   = emxGetParameter(request, "featureId");
  //String copyText     = emxGetParameter(request, "copyText");

  //Sets the application directory
  String sAppDirectory = "awl";
  fs.setDirectory(sAppDirectory);
  
  if (initSource == null){
	  initSource = "";
  }

  //Specify URL to come in middle of frameset
    String contentURL = "";
  if(BuildList!=null&&BuildList.equals("true")){
	  contentURL = "AWLAdvanceEditWithBuildListTrueDialog.jsp";
  }else{
	  contentURL = "AWLAdvancedEditDialog.jsp";
  }


  
  // add these parameters to each content URL, and any others the App needs
  contentURL += "?suiteKey=" + suiteKey + "&initSource=" + initSource + "&jsTreeID=" + jsTreeID;
  contentURL += "&PRCFSParam1=PartFamily";
  contentURL += "&objectId=" + strObjectId;
  contentURL += "&productId=" + strProductID;
  contentURL += "&rowId=" + rowId;
  contentURL += "&columnName=" + columnName;
  //contentURL += "&copyText=" + copyText;
  contentURL += "&warn=false";
  
  if(featureId!=null&&!featureId.equals("")){
	  contentURL += "&featureId=" + featureId;
	  }

  // Marker to pass into Help Pages
  // icon launches new window with help frameset inside
  String HelpMarker = "emxhelpadvanceedit";

  
  fs.initFrameset("emxAWL.Label.AdvancedEdit",
                  HelpMarker,
                  contentURL,
                  false,
                  true,
                  false,
                  false);

  fs.setStringResourceFile("emxAWLStringResource");

  fs.createFooterLink("emxCommonButton.Done",
                      "updateField()",
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

  // ----------------- Do Not Edit Below ------------------------------

  fs.writePage(out);
%>
