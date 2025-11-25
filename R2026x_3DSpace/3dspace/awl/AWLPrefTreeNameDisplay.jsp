<%--
  AWLPreferenceTreeNameDisplay.jsp

  Copyright (c) 1993-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information of
  Dassault Systemes.
  Copyright notice is precautionary only and does not evidence any actual
  or intended publication of such program
--%>


<HTML>

<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>

<emxUtil:localize id="i18nId" bundle="emxAWLStringResource" locale='<%=XSSUtil.encodeForHTML(context, request.getHeader("Accept-Language")) %>' />


  <HEAD>
    <TITLE></TITLE>
    <META http-equiv="imagetoolbar" content="no">
    <META http-equiv="pragma" content="no-cache">
    <SCRIPT language="JavaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"> </SCRIPT>
    <SCRIPT language="JavaScript" src="../common/scripts/emxUIModal.js" type="text/javascript"></SCRIPT>
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
 <%
        String treedisplayPref="";
  
        String treedisplayObjectNameSelected="";
        String treedisplayDisplayNameSelected="";
        String treedisplayFullNameSelected="";       
        String treedisplayDisplayNameAndRevSelected="";
        String treedisplayDisplayNameTypeRevSelected="";
                
		treedisplayPref=AWLPreferences.getTreeDisplay(context);
		
		
        if(AWLConstants.TREE_DISPLAY_DISPLAY_NAME.equalsIgnoreCase(treedisplayPref))
        {
        	treedisplayDisplayNameSelected = "checked";
        }
        else if(treedisplayPref.equalsIgnoreCase(AWLConstants.TREE_DISPLAY_OBJECT_NAME))
        {
        	treedisplayObjectNameSelected="checked";
        }
        else if(treedisplayPref.equalsIgnoreCase(AWLConstants.TREE_DISPLAY_FULL_NAME))
        {
        	treedisplayFullNameSelected="checked";
         }
        else if(treedisplayPref.equalsIgnoreCase(AWLConstants.TREE_DISPLAY_DISPLAY_NAME_REV))
        {
        	treedisplayDisplayNameAndRevSelected="checked";
         }
        else if(treedisplayPref.equalsIgnoreCase(AWLConstants.TREE_DISPLAY_DISPLAY_NAME_TYPE_REV))
        {
        	treedisplayDisplayNameTypeRevSelected="checked";
         }
      
  %>
  <BODY onload="doLoad(), turnOffProgress()">
    <FORM method="post" action="AWLPrefTreeNameDisplayProcessing.jsp">
      <TABLE border="0" cellpadding="5" cellspacing="2"
             width="100%">
        <TR>
          <TD width="150" class="label">
            <emxUtil:i18n localize="i18nId">emxAWL.ActionLink.TreeNameDisplay</emxUtil:i18n>
          </TD>
          <td class="inputField">
                <table>
                        <tr>
						<!-- XSSOK treedisplayDisplayNameSelected : static -->
                        <td><input type="radio" name="prefTreeNameDisplay" id="prefTreeNameDisplay" value="<%=AWLConstants.TREE_DISPLAY_DISPLAY_NAME %>" <%=treedisplayDisplayNameSelected%>><emxUtil:i18n localize="i18nId">emxAWL.Label.DisplayName</emxUtil:i18n></td>
                        </tr>
                        
                        <tr>
						<!-- XSSOK treedisplayObjectNameSelected : static -->
                        <td><input type="radio" name="prefTreeNameDisplay" id="prefTreeNameDisplay" value="<%=AWLConstants.TREE_DISPLAY_OBJECT_NAME %>" <%=treedisplayObjectNameSelected%>><emxUtil:i18n localize="i18nId">emxAWL.DisplayPreference.ObjectName</emxUtil:i18n></td>
                        </tr>
                        
                        <tr>
						<!-- XSSOK treedisplayFullNameSelected : static -->
                        <td><input type="radio" name="prefTreeNameDisplay" id="prefTreeNameDisplay" value="<%=AWLConstants.TREE_DISPLAY_FULL_NAME %>" <%=treedisplayFullNameSelected%>><emxUtil:i18n localize="i18nId">emxAWL.TreeDisplayPreference.FullName</emxUtil:i18n></td>
                        </tr>
                        
                        <tr>
						<!-- XSSOK treedisplayDisplayNameAndRevSelected : static -->
                        <td><input type="radio" name="prefTreeNameDisplay" id="prefTreeNameDisplay" value="<%=AWLConstants.TREE_DISPLAY_DISPLAY_NAME_REV %>" <%=treedisplayDisplayNameAndRevSelected%>><emxUtil:i18n localize="i18nId">emxAWL.TreeDisplayPreference.DisplayNameRev</emxUtil:i18n></td>
                        </tr>
                        
                        <tr>
						<!-- XSSOK treedisplayDisplayNameTypeRevSelected : static -->
                        <td><input type="radio" name="prefTreeNameDisplay" id="prefTreeNameDisplay" value="<%=AWLConstants.TREE_DISPLAY_DISPLAY_NAME_TYPE_REV %>" <%=treedisplayDisplayNameTypeRevSelected%>><emxUtil:i18n localize="i18nId">emxAWL.TreeDisplayPreference.DisplayNameTypeRev</emxUtil:i18n></td>
                        </tr>
                </table>
            </td>
        </TR>
      </TABLE>
    </FORM>
  </BODY>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

</HTML>

