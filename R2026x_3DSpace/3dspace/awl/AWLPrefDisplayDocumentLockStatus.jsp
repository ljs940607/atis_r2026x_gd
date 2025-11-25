<%--
  AWLPrefDisplayDocumentLockStatus.jsp

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
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="matrix.db.Context"%><HTML>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>


<%@include file="../common/emxNavigatorInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>

<emxUtil:localize id="i18nId" bundle="emxAWLStringResource" locale='<%=XSSUtil.encodeForHTML(context, request.getHeader("Accept-Language")) %>' />
<HEAD>
<TITLE></TITLE>
<META http-equiv="imagetoolbar" content="no">
<META http-equiv="pragma" content="no-cache">
<!-- src is modified by Vaibhav to fix Language Preference UI Issue on 12 Nov 2010 -->
<SCRIPT language="JavaScript" src="../common/scripts/emxUIConstants.js"
	type="text/javascript"> </SCRIPT>
<SCRIPT language="JavaScript" src="../common/scripts/emxUIModal.js"
	type="text/javascript"> </SCRIPT>
<SCRIPT language="JavaScript" src="../common/scripts/emxUIPopups.js"
	type="text/javascript"> </SCRIPT>
<SCRIPT type="text/javascript">
      addStyleSheet("emxUIDefault");
      addStyleSheet("emxUIForm");
                                
      function doLoad()
      {
        if (document.forms[0].elements.length > 0)
        {
          var objElement = document.forms[0].elements[0];
                                                                
          if (objElement.focus) objElement.focus();
          if (objElement.select) objElement.select();
        }
      }
    </SCRIPT>
</HEAD>
<BODY onload="doLoad(), turnOffProgress()">
	<FORM method="post" action="AWLPrefDisplayDocumentLockStatusProcess.jsp">
		<TABLE border="0" cellpadding="5" cellspacing="2" width="100%">
			<TR>
				<TD style="width:45%;" class="label">
					<emxUtil:i18n localize="i18nId">emxAWL.Label.AWLPersonPreferenceDisplayLockStatusLabel</emxUtil:i18n>
				</TD>
				<TD class="inputField"><SELECT name="documentlockstatus" id="documentlockstatus">
	<%
	try
    {
	    ContextUtil.startTransaction(context, false);
	    //get Document LockStatus
		String documentLockStatus = AWLPreferences.getDisplayDocumentLockStatus(context);
	    
	    String[]  documentLockStatusOptions = {AWLConstants.RANGE_YES,AWLConstants.RANGE_NO}; 
	    String[] displayValues = {AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Range.Yes") , AWLPropertyUtil.getI18NString(context, "emxAWL.Label.Range.No") };
	    
	    // for each choice
        for(int i=0; i<documentLockStatusOptions.length; i++)    
        {
        	String documentLockStatusValue = documentLockStatusOptions[i];
        	String displayValue = displayValues[i];
        	
        	String selectedStr = documentLockStatusValue.equals(documentLockStatus) ? "selected='selected'" : "";
	%>
			<OPTION
				value="<xss:encodeForHTMLAttribute><%= documentLockStatusValue%></xss:encodeForHTMLAttribute>"
				<%= selectedStr%>>
				<xss:encodeForHTML><%=displayValue%></xss:encodeForHTML>
			</OPTION>
	<%
        }
    }
    catch (Exception ex)
    {
        ContextUtil.abortTransaction(context);

        if(ex.toString()!=null && (ex.toString().trim()).length()>0)
        {
            emxNavErrorObject.addMessage("AWLPrefDisplayDocumentLockStatus:" + ex.toString().trim());
        }
    } 
    finally
    {
        ContextUtil.commitTransaction(context);
    }
	%>
				</SELECT></TD>
			</TR>
			<TR>
				<TD width="150" colspan='2'>
					<emxUtil:i18n localize="i18nId">emxAWL.ActionLink.AWLPersonPreferenceDisplayLockStatusNoteContent</emxUtil:i18n>
				</TD>
			</TR>
			
		</TABLE>
	</FORM>
</BODY>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>

</HTML>

