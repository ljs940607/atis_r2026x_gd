<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.AWLPreferences"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.*"%>
<%@page import="com.matrixone.apps.awl.dao.LocalLanguage"%>

<%@page import="matrix.db.Context"%><HTML>

<%@include file="../common/emxNavigatorInclude.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxTagLibInclude.inc"%>

<!--XSSOK request header -->
<emxUtil:localize id="i18nId" bundle="emxAWLStringResource" locale='<%=request.getHeader("Accept-Language")%>' />

<HEAD>
<TITLE>Artwork Package Preferences</TITLE>
<META http-equiv="imagetoolbar" content="no">
<META http-equiv="pragma" content="no-cache">
<script language="Javascript" src="../common/scripts/emxUIConstants.js"	type="text/javascript"></script>
<script language="Javascript" src="../common/scripts/emxUIModal.js"	type="text/javascript"></script>
<script language="Javascript" src="../common/scripts/emxUIPopups.js" type="text/javascript"></script>

<script type="text/javascript">
	addStyleSheet("emxUIDefault");
	addStyleSheet("emxUIForm");

	function doLoad() {
		if (document.forms[0].elements.length > 0) {
			var objElement = document.forms[0].elements[0];

			if (objElement.focus)
				objElement.focus();
			if (objElement.select)
				objElement.select();
		}
	}
</script>
</HEAD>

<BODY onload="doLoad(), turnOffProgress()">
	<FORM method="post" action="AWLArtworkPackageDisplayPreferenceProcessing.jsp">

		<%
			//Code for displaying the default tasks
			String taskDisplayPreference = "";
			String displayAllTasksSelected = "";
			String displayOwnedTasksSelected = "";

			taskDisplayPreference = AWLPreferences
					.getTaskDisplayPreference(context);

			if (taskDisplayPreference.equals(AWLConstants.TASK_PREFERENCE_ALL)
					|| BusinessUtil.isNullOrEmpty(taskDisplayPreference))
				displayAllTasksSelected = "checked";
			else
				displayOwnedTasksSelected = "checked";
		%>


		<TABLE border="0" cellpadding="5" cellspacing="2" width="100%">
			<TR>
				<TD width="150" class="label"><emxUtil:i18n localize="i18nId">emxAWL.Preferences.DefaultTaskDisplay</emxUtil:i18n>
				</TD>
				<td class="inputField">
					<table>
						<tr>
							<td>
								<!-- XSSOK AWLConstants.TASK_PREFERENCE_ALL and displayAllTasksSelected are static value/coming from logic-->
                                <input type="radio" name="taskDisplayPreference" id="taskDisplayPreference"	value="<%=AWLConstants.TASK_PREFERENCE_ALL%>" <%=displayAllTasksSelected%>> 
                                  <emxUtil:i18n	localize="i18nId">emxAWL.ArtworkOwnerFilterCommand.Ranges.ShowAll</emxUtil:i18n>
						    </td>
						</tr>
						<tr>
							<td>
								<!-- XSSOK AWLConstants.TASK_PREFERENCE_OWNED and displayOwnedTasksSelected are static value/coming from logic-->
								<input type="radio" name="taskDisplayPreference" id="taskDisplayPreference" value="<%=AWLConstants.TASK_PREFERENCE_OWNED%>" <%=displayOwnedTasksSelected%>> 
									<emxUtil:i18n localize="i18nId">emxAWL.ArtworkOwnerFilterCommand.Ranges.ShowMine</emxUtil:i18n>
							</td>
						</tr>
					</table>
				</td>
			</TR>
		</TABLE>
		<TABLE border="0" cellpadding="5" cellspacing="2" width="100%">
			<TR>
				<TD width="150" class="label"><emxUtil:i18n localize="i18nId">emxAWL.Label.AWLDefaultLocalLanguage</emxUtil:i18n>
				</TD>
				<TD class="inputField">
					<SELECT name="language" id="language">
						<%
							try {
								ContextUtil.startTransaction(context, false);

								// Get Language choices
								MapList languageList =  LocalLanguage.getAllLocalLanguages(context);

								String localLanguageDefault = AWLPreferences.getLocalCopyDisplayLanguagePreference(context).trim();

								for (int i = 0; i < languageList.size(); i++) {
									Map languageMap = (Map) languageList.get(i);									
									String languageName = (String) languageMap.get(DomainConstants.SELECT_NAME);
									String selectedStr = languageName.equals(localLanguageDefault) ? "selected='selected'": "";
									
						%>
						<!-- XSSOK selectedStr is coming from logic-->
						<OPTION <%=selectedStr%> value="<xss:encodeForHTMLAttribute><%=languageName%></xss:encodeForHTMLAttribute>">
							<xss:encodeForHTML><%=languageName%></xss:encodeForHTML>
						</OPTION>
						<%
							}
							} catch (Exception ex) {
								ContextUtil.abortTransaction(context);

								if (ex.toString() != null
										&& (ex.toString().trim()).length() > 0) {
									emxNavErrorObject.addMessage("emxPrefConversions:"
											+ ex.toString().trim());
								}
							} finally {
								ContextUtil.commitTransaction(context);
							}
						%>
				</SELECT>
				</TD>
			</TR>
		</TABLE>





	</FORM>
</BODY>

<%@include file="../common/emxNavigatorBottomErrorInclude.inc"%>

</HTML>

