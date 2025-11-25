
<%--  emxAWLPrefLanguageProcess.jsp -
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

      static const char RCSID[] = $Id: emxAWLPrefLanguageProcess.jsp.rca 1.5 Wed Oct 22 15:48:15 2008 przemek Experimental przemek $
--%>
<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>

<%
  
    // check if change has been submitted or just refresh mode
    // Get language
    String language = emxGetParameter(request, "language");
  
   
    // if change has been submitted then process the change
    if (language != null)
    {
        try
        {
            ContextUtil.startTransaction(context, true);
			%> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
 	// Set vault Preference
            AWLPreferences.setPreferedBaseLanguage(context, language);
         }
         catch (Exception ex) {
             ContextUtil.abortTransaction(context);

             if(ex.toString()!=null && (ex.toString().trim()).length()>0)
             {
                 emxNavErrorObject.addMessage("emxPrefLanguage:" + ex.toString().trim());
             }
         }
         finally
         {
             ContextUtil.commitTransaction(context);
         }
     }
 %>


<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

