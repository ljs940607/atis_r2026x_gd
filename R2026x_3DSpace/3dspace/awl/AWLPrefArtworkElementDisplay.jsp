<%--
  AWLPrefArtworkElementDisplay.jsp
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
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>

<emxUtil:localize id="i18nId" bundle="emxAWLStringResource" locale='<%=XSSUtil.encodeForHTML(context, request.getHeader("Accept-Language")) %>' />

  <HEAD>
    <TITLE></TITLE>
    <META http-equiv="imagetoolbar" content="no">
    <META http-equiv="pragma" content="no-cache">
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
 <%
        String artworkElementDisplay="";
		String artworkElementDisplayObjectNameSelected="";
		String artworkElementDisplayDisplayNameSelected="";
                
        artworkElementDisplay=AWLPreferences.getArtworkElementDisplay(context);
        if(AWLConstants.ARTWORK_ELEMENT_DISPLAY_DISPLAY_NAME.equalsIgnoreCase(artworkElementDisplay))
        {
           artworkElementDisplayDisplayNameSelected="checked";
        }
        else
        {
           artworkElementDisplayObjectNameSelected="checked";
        }
  %>
  <BODY onload="doLoad(), turnOffProgress()">
    <FORM method="post" action="AWLPrefArtworkElementDisplayProcessing.jsp">
      <TABLE border="0" cellpadding="5" cellspacing="2"
             width="100%">
        <TR>
          <TD width="150" class="label">
            <emxUtil:i18n localize="i18nId">emxAWL.ActionLink.ArtworkElementDisplay</emxUtil:i18n>
          </TD>
          <td class="inputField">
                <table>
                        <tr>
                           <td>
                              <!-- XSSOK artworkElementDisplayDisplayNameSelected : static -->
                              <input type="radio" name="prefArtworkElementDisplay" id="prefArtworkElementDisplay" value="<%=AWLConstants.ARTWORK_ELEMENT_DISPLAY_DISPLAY_NAME %>" <%=artworkElementDisplayDisplayNameSelected%>>
                                 <emxUtil:i18n localize="i18nId">emxAWL.Label.DisplayName</emxUtil:i18n>
                           </td>
                        </tr>
                        <tr>
                            <td>
                              <!-- XSSOK artworkElementDisplayDisplayNameSelected : static -->
                              <input type="radio" name="prefArtworkElementDisplay" id="prefArtworkElementDisplay" value="<%=AWLConstants.ARTWORK_ELEMENT_DISPLAY_OBJECT_NAME %>" <%=artworkElementDisplayObjectNameSelected%>>
                              <emxUtil:i18n localize="i18nId">emxAWL.DisplayPreference.ObjectName</emxUtil:i18n>
                           </td>
                        </tr>
                </table>
            </td>
        </TR>
      </TABLE>
    </FORM>
  </BODY>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>

</HTML>

