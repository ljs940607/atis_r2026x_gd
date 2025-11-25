<%@page import="matrix.db.Context,matrix.db.JPO"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>

<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>
<%@include file="../common/emxRTE.inc"%>
<%@include file="../emxTagLibInclude.inc"%>
<%@include file="emxValidationInclude.inc" %>

<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>

<%		
        String selectedCountryLable= AWLPropertyUtil.getI18NString(context, "emxAWL.SubHeader.SelectedCountry");
        String selectedLangLable= AWLPropertyUtil.getI18NString(context, "emxAWL.SubHeader.SelectedLanguages");
        String selectCountryLanguageLable = AWLPropertyUtil.getI18NString(context, "emxAWL.Heading.SelectCountryLang");
		String requiredField = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.RequiredText");
		String name = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Name");
		String autoName = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.AutoName");
		String title = AWLPropertyUtil.getI18NString(context, "emxCPD.Common.Title");
        String description = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Description");
		String artworkUsage = AWLPropertyUtil.getI18NString(context, "emxAWL.Action.AWLArtworkUsage");
		String selectAll = AWLPropertyUtil.getI18NString(context, "emxAWL.Action.SelectAll");
        String clear = AWLPropertyUtil.getI18NString(context, "emxCommonButton.Clear");
        String selectCountriesAndLanguages = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.SelectCountriesnLanguages");
		String invalidInputAlert = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkEmptyString");
        String languageStr     = request.getHeader("Accept-Language");
		
		Map artworkUsageList = (Map) JPO.invoke(context, "AWLPOAUI", null, "getArtworkUsageRanges",null,Map.class);
		StringList artworkUsageDisplayValues = (StringList)artworkUsageList.get(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES);
		StringList artworkUsageFields = (StringList)artworkUsageList.get(AWLConstants.RANGE_FIELD_CHOICES);
		
		String functionality = emxGetParameter(request, "functionality");
		String contextProductId = emxGetParameter(request, "parentOID");
        
		boolean isProductLineContext = false;
		DomainObject domObj=new DomainObject(contextProductId);
		String contextObjName = domObj.getInfo(context, DomainConstants.SELECT_NAME);
		if(domObj.isKindOf(context, AWLType.PRODUCT_LINE.get(context))){
			isProductLineContext = true;
		}
%>

<head>
<script>
var functionality = "<%=XSSUtil.encodeForJavaScript(context, functionality)%>";
//var isProcessing = false;

	//This API will modify tds for countries and languages.
	function modifyTD(tableId,selectedData){
	    var htmlData = [];
	    for (var i = 0; i < selectedData.length; i++) {
	        var eachNodeInfo = selectedData[i];
	        var selectedNodeMap= $.parseJSON(eachNodeInfo);
	        htmlData[parseInt(selectedNodeMap.seq)-1]=selectedNodeMap.name.trim();
	    }
	    var textToDisplay="";
	    for (var i = 0; i < htmlData.length; i++) {
	            textToDisplay =textToDisplay+ htmlData[i]+",";
	    }
	    if(textToDisplay.length>0)
	        textToDisplay = "<span>"+textToDisplay.substring(0, textToDisplay.length-1)+"</span>";
	    
	    var selectedTD = document.getElementById(tableId);
	    if(selectedTD)
	        {
	            selectedTD.innerHTML =  textToDisplay;
	        }
	}

	//This API will render selected countries and languages.
	function renderSelGeogrpagy (selectedCountries,selectedLangauges){
		$('input[name="h_SelectedLanguages"]').val( selectedLangauges );
		$('input[name="h_SelectedCountries"]').val( selectedCountries );
	
	    modifyTD("selectedCountryTD",selectedCountries);
	    modifyTD("selectedlanguageTD",selectedLangauges);
	    
	}

	//This API will returns selected country id separated by |
	function getSelectedCountries(){
	    var selectedCountryIdList="";
	    var countriesList = $('input[name="h_SelectedCountries"]').val();
	    if(countriesList && countriesList.length > 0)
	        {
	    		var countryJSONArray = $.parseJSON("["+countriesList+"]");
	            for (var i = 0; i < countryJSONArray.length; i++) {
	                var selectedNodeMap = countryJSONArray[i];
	                 selectedCountryIdList =selectedCountryIdList+"|"+selectedNodeMap.id.trim().replace(/\"/g, "");
	            }
	            selectedCountryIdList=selectedCountryIdList.substr(1, selectedCountryIdList.length);
	        }
	    return selectedCountryIdList;
	}
	
	//This API will returns selected languages
	function getSelectedLanguages(){
	    return $('input[name="h_SelectedLanguages"]').val();
	}
	
	//This API will open select country languages screen in modal popup
	function showAddCountryLangDlg(){
		var countriesList = getSelectedCountries();
		var languageList = $('input[name="h_SelectedLanguages"]').val();
	    var countrySelectionURL="../awl/emxAWLCommonFS.jsp?functionality=AWLManageCountryLanguagesToPOA&suiteKey=AWL&selectedProductList=<xss:encodeForURL><%=contextProductId%></xss:encodeForURL>";
	    countrySelectionURL=countrySelectionURL + "&productline=" + <xss:encodeForURL><%=isProductLineContext%></xss:encodeForURL> + "&type=copyList";
	    
	    $.ajax({
			type: "POST",
			url: "../resources/awl/util/storeParamInSession",
			data: "selectedCotunryList="+encodeURIComponent(countriesList)+"&selectedLanguageList="+encodeURIComponent(languageList),
			dataType: "text",
			cache: false,
			async: true,
			success: function(jsonResponse){
	    			showModalDialog(countrySelectionURL,550,300,true,'Medium');
			},
		});
	}
	
	function closeWindow(){
	    getTopWindow().closeSlideInDialog();
	}
   
	function validate()
	{
		var formObj = document.createCopyListForm;
		var nameObj = document.getElementById("Name");
		var autoNameObj = document.getElementById("AutoName");
		var titleObj = document.getElementById("Title");
		var descriptionObj = document.getElementById("Description");
			
		var flag = true;
		
		if(autoNameObj.checked == false) {
			flag = basicValidation(formObj,nameObj,"Name",true,true,true,false,false,false,"NameBadChars");
		}
		
		if(flag && basicValidation(formObj,titleObj,"Title",true,true,true,false,false,false,"BadChars")) {
			var descVal = trimWhitespace(descriptionObj.value);
			
			if((descVal != "")){
				if(basicValidation(formObj,descriptionObj,"Description",true,false,true,false,false,false,"BadChars")) {
					flag = true;
				} else {
					return false;
				}
			}
			if(flag && isArtworkUsageSelected()) {
				var countriesSelected = getSelectedCountries();
				if(countriesSelected=="") {
					alert("<xss:encodeForJavaScript><%=invalidInputAlert%></xss:encodeForJavaScript>");
					return false;
				} else{
					var countriesSelected = getSelectedCountries();
					if(countriesSelected=="") {
						flag = false;
						alert("<xss:encodeForJavaScript><%=invalidInputAlert%></xss:encodeForJavaScript>");
					} else {
						var languagesSelected = getSelectedLanguages();
						if(languagesSelected=="") {
							flag = false;
							alert("<xss:encodeForJavaScript><%=invalidInputAlert%></xss:encodeForJavaScript>");
						} else {
							return true;
						}
					}
				}
			} else {
				alert("<xss:encodeForJavaScript><%=invalidInputAlert%></xss:encodeForJavaScript>");
				return false;
			}
		} else {
			return false;
		}
	}


	function isArtworkUsageSelected() {
		var selArtworkUsage = $('option:selected', $("#artworkUsageSelection")).length;
		if (selArtworkUsage == 0)
			return false;
		else
			return true;
	}

	function selectAll() {
		$("#artworkUsageSelection option").each(function()
		{
		    $(this).prop('selected', true);
		});
	}
	function submitForm() {
		var valid = validate();
		if (valid) {
			
			var formName = document.createCopyListForm;
			var languages = getSelectedLanguages();
			var countries = getSelectedCountries();
			var URL = "../awl/AWLCreateCopyListPostProcess.jsp";
			
		        formName.action = URL;
			formName.target = "jpcharfooter";
			turnOnProgress();
			formName.submit();
	                turnOffProgress();
			}			
		}
	
	function apply() {
		var submitAction = document.getElementById("SubmitAction");
		submitAction.value="Apply";
		submitForm();
	}

	function submit() {
		var submitAction = document.getElementById("SubmitAction");
		submitAction.value="Submit";
		submitForm();
	}

	function toggleNameField() {
		var autoName = document.getElementById("AutoName");
		var nameField = document.getElementById("Name");
		if (autoName.checked) {
			nameField.value = "";
			nameField.disabled = true;
		} else {
			nameField.disabled = false;
		}
	}
	function disableFields() {
		var nameField = document.getElementById("Name");
		nameField.disabled = true;
	}
</script>

</head>
<!--  XSSOK root_dir Static reference -->
<LINK href="../common/styles/emxUIDefault.css" rel="stylesheet"	type="text/css">
<LINK href="../common/styles/emxUIForm.css" rel="stylesheet" type="text/css">

<body onload="disableFields()">
	<form name="createCopyListForm" id="createCopyListForm" method="post">
	<%@include file = "../common/enoviaCSRFTokenInjection.inc"%> 
		<table class="form">
			<tbody>
				<tr>
					<td class="createRequiredNotice"><%=requiredField%></td>
				</tr>

				<input type="hidden" name="functionality" value="<xss:encodeForHTMLAttribute><%=functionality%></xss:encodeForHTMLAttribute>" />
				<input type="hidden" name="contextProductId" value="<xss:encodeForHTMLAttribute><%=contextProductId%></xss:encodeForHTMLAttribute>" />
				<input type="hidden" name="isProductLineContext" value="<xss:encodeForHTMLAttribute><%=isProductLineContext%></xss:encodeForHTMLAttribute>" />
				<input type="hidden" name="SubmitAction" id="SubmitAction" value="" />
				
				<tr><td></td></tr>

				<!-- XSSOK -->
				<tr class="Name">
					<td width="150" valign="middle" class="createLabelRequired"><label for="Name"><%=name%></label></td>
				</tr>
				<tr class="Name">
					<td valign="middle" colspan="" class="createInputField">
						<table class="textarea">
							<tbody>
								<tr>
									<td width="150"><input type="text" name="Name" id="Name" class="required" value=""></td>
									<td width="20"><input type="checkbox" name="AutoName" id="AutoName" onchange="javascript:toggleNameField()" checked></td>
									<td><label for="AutoName"><%=autoName%></label></td>
								</tr>
							</tbody>
						</table>
				</tr>
				<tr class="Title">
					<td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=title%></label></td>
				</tr>
				<tr class="Title">
					<td valign="middle" colspan="" class="createInputField">
						<table class="textarea">
							<tbody>
								<tr>
									<td><input type="text" name="Title" id="Title" class="required" value="Copy List - <%=contextObjName%>"></td>
								</tr>
							</tbody>
						</table>
				</tr>
				<!-- XSSOK -->
				<tr class="Description">
					<td width="150" valign="middle"><label for="Description"><%=description%></label></td>
				</tr>
				<tr class="Description">
					<td valign="middle" colspan="" class="createInputField">
						<table class="textarea">
							<tbody>
								<tr>
									<td><textarea title="Description" fieldlabel="Description" id="Description" name="Description" rows="5" cols="25"></textarea></td>
								</tr>
							</tbody>
						</table>
				</tr>				
				<tr>
				    <!-- XSSOK -->
					<td width="150" valign="middle" class="createLabelRequired"><label for="artworkUsage"><%=artworkUsage%></label>
					<a href="javascript:selectAll()"><%=selectAll%></a></td>
				</tr>
				<tr class="artworkUsageSelection">
					<td valign="middle" colspan="6" class="createInputField">
						<table border="0">
							<tbody>
								<!-- XSSOK -->
								<tr>
									<td><select multiple size='5' id="artworkUsageSelection" name="artworkUsageSelection" class="required" style="width: 150%;">
									<%
										for (int i = 0; i < artworkUsageFields.size(); i++) {
											String choice = artworkUsageFields.get(i).toString();
											String display = artworkUsageDisplayValues.get(i).toString();
									%>
											<option value="<%=XSSUtil.encodeForHTMLAttribute(context, choice)%>"><%=XSSUtil.encodeForHTML(context, display)%></option>
									<%
										}
									%>
									</select></td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				
				<tr>
				    <!-- XSSOK -->
					<td><a href="javascript:showAddCountryLangDlg();"><%=selectCountryLanguageLable%></a></td>
				</tr>
				
				<tr>
				    <!-- XSSOK -->
					<td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=selectedCountryLable%></label></td>
				<tr>
				<input type="hidden" name="h_SelectedCountries"  id="h_SelectedCountries" class ="required" value="">
				
				<tr>
				   
					<td id="selectedCountryTD"><span></span></td>
				</tr>
				
				<tr>
				    <!-- XSSOK -->
					<td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=selectedLangLable%></label></td>
				</tr>
				<input type="hidden" name="h_SelectedLanguages"	id="h_SelectedLanguages" class="required" value="">  
			
				<tr>
					<td id="selectedlanguageTD"><span></span></td>
				</tr>
			</tbody>
		</table>
	</form>

</body>
</html>
<%
	if (context != null)
		context.shutdown();
%>
