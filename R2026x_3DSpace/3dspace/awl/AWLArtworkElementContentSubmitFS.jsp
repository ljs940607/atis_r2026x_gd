<%--  AWLArtworkElementContentSubmitFS.jsp
   Copyright (c) 1999-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
 --%>
<%@include file="../emxUIFramesetUtil.inc"%>

<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.framework.ui.framesetObject"%>
<%
	framesetObject fs = new framesetObject();
	String [] tableRowId = request.getParameterValues("emxTableRowId");
	MapList rowList      = BusinessUtil.parseTableRowId(tableRowId);
	StringList idList = BusinessUtil.getObjectIdList(rowList); 
	String rowId = FrameworkUtil.join(idList, ",");
	
    String initSource   = emxGetParameter(request,"initSource");
    initSource = initSource == null? "" : initSource;
    
    String jsTreeID     = emxGetParameter(request,"jsTreeID");
    String suiteKey     = emxGetParameter(request,"suiteKey");
    String artworkContentSubmitAciton     = emxGetParameter(request,"artworkContentSubmitAciton");
    // ----------------- Do Not Edit Above ------------------------------
    String strObjectId  = emxGetParameter(request,"objectId");
 
  //Specify URL to come in middle of frameset
  String contentURL = "AWLArtworkElementContentSubmitDialog.jsp";
  
  // add these parameters to each content URL, and any others the App needs
  contentURL += "?suiteKey=" + suiteKey + "&initSource=" + initSource + "&jsTreeID=" + jsTreeID;
  contentURL += "&objectId=" + strObjectId;
  contentURL += "&rowId=" + rowId;
  contentURL +="&artworkContentSubmitAciton=" +  artworkContentSubmitAciton;
  
  // Marker to pass into Help Pages
  // icon launches new window with help frameset inside
  String HelpMarker = "";  	
  String header = "emxAWL.Heading.ArtworkContentSubmitAction."+artworkContentSubmitAciton;
  
  fs.initFrameset(header,
                  HelpMarker,
                  contentURL,
                  false,
                  true,
                  false,
                  false);

  fs.setStringResourceFile("emxAWLStringResource");

  fs.createFooterLink("emxCommonButton.Done",
                      "artworkElementContentSubmit()",
                      "role_GlobalUser",
                      false,
                      true,
                      "common/images/buttonDialogDone.gif",
                      0);

  fs.createFooterLink("emxCommonButton.Cancel",
                      "close()",
                      "role_GlobalUser",
                      false,
                      true,
                      "common/images/buttonDialogCancel.gif",
                      0);

  // ----------------- Do Not Edit Below ------------------------------

  fs.writePage(out);
%>
