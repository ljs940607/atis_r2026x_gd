<%--
  AWLPrefArtworkElementDisplayProcessing.jsp
  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>


<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>

<%
    // check if change has been submitted or just refresh mode
    // Get language
    String prefArtworkElementDisplay = emxGetParameter(request, "prefArtworkElementDisplay");
        if( (prefArtworkElementDisplay == null) || ("".equals(prefArtworkElementDisplay)) )
        {
            prefArtworkElementDisplay="";
        }
    // if change has been submitted then process the change
        try
        {
            ContextUtil.startTransaction(context, true);
            %> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
            if(prefArtworkElementDisplay !=null)
            	AWLPreferences.setArtworkElementDisplay(context,prefArtworkElementDisplay.trim());
        }
        catch (Exception ex) {
            ContextUtil.abortTransaction(context);

            if(ex.toString()!=null && (ex.toString().trim()).length()>0)
            {
                emxNavErrorObject.addMessage("prefArtworkElementDisplay:" + ex.toString().trim());
            }
        }
        finally
        {
            ContextUtil.commitTransaction(context);
        }
%>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
