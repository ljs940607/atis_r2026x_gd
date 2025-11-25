<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import="java.util.Map"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.awl.dao.ArtworkPackage"%>

<script language="javascript" type="text/javascript" src="../awl/scripts/emxAWLUtil.js"></script>

<%
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Pragma", "no-cache");

  String suiteKey         = emxGetParameter(request, "suiteKey");
  String languageStr      = request.getHeader("Accept-Language");
   
  Map xrequestMap         = UINavigatorUtil.getRequestParameterMap(request);
  String currentFilterLanguage     = BusinessUtil.getString(xrequestMap, "languageType");;
  
  String artworkId        = BusinessUtil.getObjectId(xrequestMap);
  ArtworkPackage ap       = new ArtworkPackage(artworkId);
  
  StringList languageList = ap.getArtworkContentLanguages(context);
  languageList.remove(currentFilterLanguage);
  languageList.add(0, currentFilterLanguage);

  String compareLanguage  = BusinessUtil.getString(xrequestMap, "compareLanguage");
  StringList compareLangs = BusinessUtil.toUniqueSortedList(FrameworkUtil.split(compareLanguage, ","));
  
  //labels  
  String cancelLabel      = AWLPropertyUtil.getI18NString(context, "emxCommonButton.Cancel");
  String doneLabel        = AWLPropertyUtil.getI18NString(context, "emxCommonButton.Done");
  String authoringLabel   = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.AuthoringLanguage");
  String compareLabel     = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.CompareLanguageWith");
  String languageLabel = AWLPropertyUtil.getI18NString(context, "emxAWL.Table.Language");
  String i18NHeader = AWLPropertyUtil.getI18NString(context, "emxAWL.Heading.CompareLanguages");
  String selectAllChecked = (compareLangs.size() == languageList.size() - 1) ? "checked" : "";
%>

<script type="text/javascript">
  
  function compareByLanguages()
  {  
      var languageList = [];      
      var language     = document.getElementsByName("language");
      var selectedCount = 0;
	  
      for(var i = 0; i < language.length; i++)
      {
          if(language[i].checked)
          {
              languageList.push(language[i].value);
              selectedCount++;
          }
      }
      
      if(selectedCount == 0)
      {
    	  getTopWindow().getWindowOpener().location.href = getTopWindow().getWindowOpener().location.href;
      }
      else
      {
    	  getTopWindow().getWindowOpener().filterByCompareLanguage(languageList);  
      }
      getTopWindow().closeWindow();
  }
  
  function handleSelectAll(status)
  {
	  var checkboxes = document.getElementsByName("language");
	  for(var i = 0 ; i < checkboxes.length ; i++) 
	  {
		    checkboxes[i].checked = status.checked;
	  }
	}
  
  function handleCheckEvent(cb)
  {
	  //alert("handle check");
	  var checkboxes = document.getElementsByName("language");
	  var selectedCount = 0;
	  for(var i = 0; i < checkboxes.length; i++)
      {
          if(checkboxes[i].checked)
          {
              selectedCount++;
          }
      }
	  selectAllCB = document.getElementById("selectAll");
	  if(selectedCount < checkboxes.length && selectAllCB.checked)
	  {
		  selectAllCB.checked = false;
	  }
	  if(selectedCount == checkboxes.length)
	  {
		  selectAllCB.checked = true;
	  }
	  
  }
</script>
 <script language="Javascript">
  addStyleSheet("emxUIDefault");
  addStyleSheet("emxUIList");
 </script>

<%@include file = "../emxUICommonHeaderEndInclude.inc"%>

<form name="advanceEdit" method="post" action="" onsubmit="javascript:compareByLanguages(); return false">
	<div id="divPageBody">
		<div id="pageHeadDiv">
		<!--XSSOK i18NHeader I18N label -->
			<span class="pageHeader">&nbsp;<%=i18NHeader%></span>
		</div>

		<div id="pageContentDiv" style="overflow: auto; padding-bottom: 0px;">
			<table class="list" id="languageList">
				<tr>
       				<th width="2%" style="text-align: center;" >
        				<span style="text-align: center;">
        				<!--XSSOK selectAllChecked -- If all the Selected to Compare evaluated from some logic-->
         					<input type="checkbox" id="selectAll" onchange="handleSelectAll(this);" <%=selectAllChecked %>/>
        				</span>
       				</th>
       				<!--XSSOK languageLabel I18N label -->
       				<th nowrap><%=languageLabel %></th>
			   </tr>
			    <tr class='<framework:swap id ="1" />'>
			    	     <td style="font-size: 8pt" align="center" >
                                          <input type="checkbox" name="authoringLanguage" id="authoringLanguage" disabled 
                                              value = "<xss:encodeForHTMLAttribute><%=currentFilterLanguage%></xss:encodeForHTMLAttribute>" />
          					</td>
          					<td>
						       <b>
							       <i>	<xss:encodeForHTML><%=currentFilterLanguage %></xss:encodeForHTML> </i>
							           <!--XSSOK authoringLabel I18N label -->
							           (<%=authoringLabel %>)
						       </b>
          					</td> 
			    </tr>
		<%         
	      	 for(int i = 1; i < languageList.size(); i++) {
	      		 String language = (String) languageList.get(i);
	      		 boolean filterLanguage = language.equals(currentFilterLanguage);
	      		 String disabled = filterLanguage ? "disabled" : "";
	      		 String checked = compareLangs.contains(language) ? "checked" : "";
         %>
           			  <tr class='<framework:swap id ="1" />'>
          					<td style="font-size: 8pt" align="center" >
							<!--XSSOK disable -- To Disable the Filtered Language -->
							<input type="checkbox" name="language" onchange="handleCheckEvent(this);" <%=disabled %>
							<xss:encodeForHTMLAttribute><%=checked%></xss:encodeForHTMLAttribute>
							value = "<xss:encodeForHTMLAttribute><%=language%></xss:encodeForHTMLAttribute>" />
          					</td>
          					<td>
          						<xss:encodeForHTML><%=language %></xss:encodeForHTML>
          					</td> 	
				</tr>
				<%
              	 }
            	%>
				<tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				</tr>
			</table>
		</div>

        <br>
		<div id="divPageFoot">
			<table>
				<tbody>
					<tr>
						<td class="buttons">
							<table>
								<tbody>
									<tr>
							<td>
							  <a href="javascript:compareByLanguages();">
								<img border="0" align="absmiddle" src="../common/images/buttonDialogDone.gif" />
							  </a>
							</td>
							<td>
							<!--XSSOK doneLabel I18N label -->
							  <a href="javascript:compareByLanguages(); "> <%= doneLabel %> </a>
							 </td>
							<td>
								<a href="javascript:getTopWindow().close();">
									<img border="0" align="absmiddle" src="../common/images/buttonDialogCancel.gif" />
								</a>
							</td>
							<td>
							<!--XSSOK cancelLabel I18N label -->
								<a href="javascript:getTopWindow().close();"><%= cancelLabel %></a>
							</td>
						</tr>
					  </tbody>
					</table>
				 </td>
				</tr>
			 </tbody>
		</table>
	 </div>
	</div>
</form>

<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
<%@include file = "../emxUICommonEndOfPageInclude.inc" %>
