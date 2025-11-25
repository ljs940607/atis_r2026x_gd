<%--
  AWLPrefLanguage.jsp

  Copyright (c) 1992-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of MatrixOne,
  Inc.  Copyright notice is precautionary only
  and does not evidence any actual or intended publication of such program
  
--%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.enumeration.*"%>
<%@page import="com.matrixone.apps.awl.dao.LocalLanguage"%>
<%@page import="matrix.db.Context"%><HTML>

<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>


  <HEAD>
    <TITLE></TITLE>
    <META http-equiv="imagetoolbar" content="no">
    <META http-equiv="pragma" content="no-cache">
    <!-- src is modified by Vaibhav to fix Language Preference UI Issue on 12 Nov 2010 -->
    <SCRIPT language="JavaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"> </SCRIPT>
    <SCRIPT language="JavaScript" src="../common/scripts/emxUIModal.js" type="text/javascript"> </SCRIPT>
    <SCRIPT language="JavaScript" src="../common/scripts/emxUIPopups.js" type="text/javascript"> </SCRIPT>
    <SCRIPT type="text/javascript">
      addStyleSheet("emxUIDefault");
      addStyleSheet("emxUIForm");
                                
      function doLoad() {
        if (document.forms[0].elements.length > 0) {
          var objElement = document.forms[0].elements[0];
                                                                
          if (objElement.focus) objElement.focus();
          if (objElement.select) objElement.select();
        }
      }
    </SCRIPT>
  </HEAD>
  <BODY onload="doLoad(), turnOffProgress()">
    <FORM method="post" action="AWLPrefLanguageProcess.jsp">
      <TABLE border="0" cellpadding="5" cellspacing="2"
             width="100%">
        <TR>
          <TD width="150" class="label">
            <emxUtil:i18n localize="i18nId">emxFramework.Preferences.Language</emxUtil:i18n>
          </TD>
          <TD class="inputField">
            <SELECT name="language" id="language">
<%
	try
    {
	    ContextUtil.startTransaction(context, false);
	    // Get Language choices
	    
	   MapList mlLanguageList =  LocalLanguage.getAllLocalLanguages(context);
	   StringList langNames = BusinessUtil.toStringList(mlLanguageList, DomainConstants.SELECT_NAME);
	  
	    //get default language
		String LanguageDefault = AWLPreferences.getPreferedBaseLanguage(context);
	    // for each Language choice
					for (int i = 0; i < langNames.size(); i++)
		{
				        String languageValue = (String)langNames.get(i);
	        
				        String selectedStr = languageValue.equals(LanguageDefault) ? "selected='selected'" : "";
						%>
						  <OPTION value="<xss:encodeForHTMLAttribute><%= languageValue%></xss:encodeForHTMLAttribute>" <%= selectedStr%> >
			                	<xss:encodeForHTML><%=languageValue%></xss:encodeForHTML>
              </OPTION>
<%
      	}
    }
    catch (Exception ex)
    {
        ContextUtil.abortTransaction(context);

        if(ex.toString()!=null && (ex.toString().trim()).length()>0)
        {
            emxNavErrorObject.addMessage("emxPrefConversions:" + ex.toString().trim());
        }
    } 
    finally
    {
        ContextUtil.commitTransaction(context);
    }
%>
            </SELECT>
          </TD>
        </TR>
      </TABLE>
    </FORM>
  </BODY>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

</HTML>

