
<%--  AWLPrefDisplayDocumentLockStatusProcess.jsp -
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

--%>
<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>

<%
  
    // check if change has been submitted or just refresh mode
    // Get Document locks tatus
    String documentlockstatus = emxGetParameter(request, "documentlockstatus");
  
   
    // if change has been submitted then process the change
    if (documentlockstatus != null)
    {
        try
        {
            ContextUtil.startTransaction(context, true);
			%> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
 			// Set vault Preference
            AWLPreferences.setDisplayDocumentLockStatus(context, documentlockstatus);
         }
         catch (Exception ex) {
             ContextUtil.abortTransaction(context);

             if(ex.toString()!=null && (ex.toString().trim()).length()>0)
             {
            	 //TODO: any perticular format follwed here?
                 emxNavErrorObject.addMessage("AWLPrefDisplayDocumentLockStatusProcess:" + ex.toString().trim());
             }
         }
         finally
         {
             ContextUtil.commitTransaction(context);
         }
     }
 %>


<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

