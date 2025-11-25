<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import = "matrix.db.Context,matrix.db.JPO" %>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.cpd.dao.Country"%>
<%@page import="com.matrixone.apps.awl.dao.POA"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file="../emxUICommonAppInclude.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>

<%@include file="../common/emxRTE.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>
<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>

<script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>

<%
    String prdIDList = AWLUtil.getSelectedIDsStrFS(request);
   	String selectedCountryLable= AWLPropertyUtil.getI18NString(context, "emxAWL.SubHeader.SelectedCountry");
   	String selectedLangLable= AWLPropertyUtil.getI18NString(context, "emxAWL.SubHeader.SelectedLanguages");
   	String selectCountryLanguageLable = AWLPropertyUtil.getI18NString(context, "emxAWL.Heading.SelectCountryLang");
   	//String brandID = request.getParameter("objectId");
   	String requiredField = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.RequiredText");
   	String artworkPackage = AWLPropertyUtil.getI18NString(context, "emxAWL.Attribute.ArtworkPackage");
   	String chooseAPString = AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.ChooseExistingArtworkPackage");
   	//String titleString = AWLPropertyUtil.getI18NString(context,""
   	String responsibleOrganization = AWLPropertyUtil.getI18NString(context,"emxFramework.Label.DesignResponsibility");
   	String newArtworkPackageDetails = AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.NewArtworkPackageDetails");
   	String title = AWLPropertyUtil.getI18NString(context, "emxCPD.Common.Title");
   	String description = AWLPropertyUtil.getI18NString(context, "emxFramework.Basic.Description");
   	String ecm = AWLPropertyUtil.getI18NString(context, "emxAWL.ECM.EnterpriseChangeManagement");
   	
   	String changeTemplate = AWLPropertyUtil.getI18NString(context, "emxAWL.Form.Label.ChangeTemplate");
   	String changeOrder = AWLPropertyUtil.getI18NString(context, "emxAWL.Form.Label.ChangeOrder");
   	String changeAction = AWLPropertyUtil.getI18NString(context, "emxAWL.Form.Label.ChangeAction");
   	String poa = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.POAName");
   	String createNewChangeAction = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.CreateNewChangeActionForPOA");
   	String addAllElementsToPOA = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ArtworkElementsToBeAttached");
   	String artworkUsage = AWLPropertyUtil.getI18NString(context, "emxAWL.Action.AWLArtworkUsage");
   	String clear = AWLPropertyUtil.getI18NString(context, "emxCommonButton.Clear");
   	String newPOADetails = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.NewPOADetails");//emxAWL.Label.NewPOADetails
   	String selectCountriesAndLanguages = AWLPropertyUtil.getI18NString(context, "emxAWL.Label.SelectCountriesnLanguages");
   	String invalidInputAlert = AWLPropertyUtil.getI18NString(context, "emxAWL.Alert.checkEmptyString");
   	String languageStr     = request.getHeader("Accept-Language");
   	String createNew = AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.CreateNewChangeOrder");
   	String useExisting = AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.UseExisting");
   		
   	Map artworkUsageList = (Map) JPO.invoke(context, "AWLPOAUI", null, "getArtworkUsageRanges",null,Map.class);
   	StringList artworkUsageDisplayValues = (StringList)artworkUsageList.get(AWLConstants.RANGE_FIELD_DISPLAY_CHOICES);
   	StringList artworkUsageFields = (StringList)artworkUsageList.get(AWLConstants.RANGE_FIELD_CHOICES);
   	
                        	String poaPurpose = emxGetParameter(request, "POAPurpose");
                        	boolean isCustomizedPOA  = BusinessUtil.isNotNullOrEmpty(poaPurpose) && "CustomizedPOA".equalsIgnoreCase(poaPurpose);
   	boolean isCMEnabled = POA.isCMEnabled(context);
   	
   	StringList hierarchyProductList = new StringList(); 
   	if(BusinessUtil.isNotNullOrEmpty(prdIDList))
   	{
   		hierarchyProductList = FrameworkUtil.split(prdIDList, "|");
   	}
   	else
   	{
   		String contextObjectID = emxGetParameter(request,"objectId");
   		hierarchyProductList.add(contextObjectID);
   		prdIDList = contextObjectID;
   	}
   	
   	int prdCnt=0, plCnt=0, modelSel=0;
   	for(String productHierarchyId : (List<String>) hierarchyProductList)
   	{
   		DomainObject domObj=new DomainObject(productHierarchyId);
   		if(domObj.isKindOf(context, AWLType.MODEL.get(context)))
   			modelSel++;
   		if(domObj.isKindOf(context, AWLType.PRODUCT_LINE.get(context)))
   			plCnt++;
   		else{
   			prdCnt++;
   		}
   	}

   	boolean boolArray[] = BusinessUtil.isKindOf(context, hierarchyProductList, AWLType.POA.get(context));
   	
   	if(modelSel == 0)
   	{
	   	if((plCnt > 0 && prdCnt > 0) || modelSel > 0)
	   	{          		
			%>
	        <script type="text/javaScript">
	            //XSSOK :  I18N label or message
	        	alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.CreatePOA.InvalidSelection")%>");      
	            getTopWindow().closeSlideInDialog();
	        </script> 
	  		<%
		}
		else if(BusinessUtil.isMatching(boolArray, true, false))
		{		
	     	%>
	        <script type="text/javaScript">
	        	//XSSOK :  I18N label or message
	            alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Message.CreatePOA.POASelection")%>");      
	            getTopWindow().closeSlideInDialog();
			</script> 
	        <% 
		   	
		}
   	}
   	else
   	{
		%>
        <script type="text/javaScript">
            //XSSOK :  I18N label or message
        	alert("<%=AWLPropertyUtil.getI18NString(context, "emxAWL.CreatePOA.selectCPGProductOrProductLine")%>");      
            getTopWindow().closeSlideInDialog();
        </script> 
  		<%
   	}

%>	
<head>
<script>
	//WX7
    $(document).ready(function() {
        var isECMEnabled = "<%=isCMEnabled%>"; 
        if(isECMEnabled == "false")
        {
            $(".ecmField").remove();
        }else{
        	//document.getElementById("chooseTemplateName").readOnly = true;
    		document.getElementById("changeOrderName").readOnly = true;	
        }
        $(".useExistingRow").hide();
		document.getElementById("chooseExistingArtworkPackage").readOnly = true;
		
    });
//
var selectCountryLangWindow;
//AA1:This API will modify tds for countries and languages.
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
//AA1:This API will render selected countries and languages.
function renderSelGeogrpagy (selectedCountries,selectedLangauges){
	$('input[name="h_SelectedLanguages"]').val( selectedLangauges );
	$('input[name="h_SelectedCountries"]').val( selectedCountries );
	


    modifyTD("selectedCountryTD",selectedCountries);
    modifyTD("selectedlanguageTD",selectedLangauges);
    
}

//AA1:This API will returns selected country id separated by |
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
//AA1:This API will returns selected languages
function getSelectedLanguages(){
    return $('input[name="h_SelectedLanguages"]').val();
}
//AA1:This API will open select country languages screen in modal popup
function showAddCountryLangDlg(){
	var countriesList = getSelectedCountries();
	var languageList = $('input[name="h_SelectedLanguages"]').val();
	 
    var countrySelectionURL="../awl/emxAWLCommonFS.jsp?functionality=AWLManageCountryLanguagesToPOA&suiteKey=AWL&selectedProductList=<xss:encodeForURL><%=prdIDList%></xss:encodeForURL>";
    <%
    if(plCnt > 0)
	{
	%>
		countrySelectionURL=countrySelectionURL+"&productline=true"
	<%
	}
    %>
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

//WX7
function closeWindow(){
    getTopWindow().closeSlideInDialog();
}
   
//WX7
function validate()
{
	var valid = areECMFieldsValid();
	var apValuesSelectionValid = areArtworkPackageValuesValid();
	var artworkUsageSelected = isArtworkUsageSelected();
	var countriesSelected = getSelectedCountries();
	var languagesSelected = getSelectedLanguages();
	
	if(artworkUsageSelected == false
			|| valid == false 
			|| apValuesSelectionValid == false
			|| countriesSelected==""
			|| languagesSelected=="")
		return false;
	else
		return true;
}


function isArtworkUsageSelected()
{
	var selArtworkUsage = $('option:selected', $("#artworkUsageSelection")).length;
	if(selArtworkUsage == 0)
		return false;
	else
		return true;
}
	
	function areArtworkPackageValuesValid()
	{
		var values = document.getElementsByName('ArtworkPackageType');
		var value;
		for(var i = 0; i < values.length; i++){
		    if(values[i].checked){
		        value = values[i].value;
		    }
		}
		if(value == "createNew")
		{
			var titleValue  = document.getElementById("artworkPackageTitle").value;
			//var description = document.getElementById("artworkPackageDescription").value;
			if(titleValue == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			var artworkPackageValue = document.getElementById("chooseExistingArtworkPackage").value;
			if(artworkPackageValue == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		}
	}
	function areECMFieldsValid()
	{
		var ecmEnabled = "<%=isCMEnabled%>"; 
		if(ecmEnabled == "true")
		{
			
			//var changeTemplate = document.getElementById("chooseTemplateName").value;
			var changeOrder = document.getElementById("changeOrderName").value;
			//if (changeTemplate == "" || changeOrder == "" ) 
			if ( changeOrder == "" ) 
			{
				return false;
			}
			else
				return true;
		}
		else
		{
			return true;
		}
	}
  //WX7
    function submit(){  
    
        var valid = validate();
        if(valid)
        {
            var formName = document.createPOAForm;
            var languages = getSelectedLanguages();
            var countries = getSelectedCountries();
           	var URL = "../awl/AWLCreatePOAPostProcess.jsp";
           	formName.action= URL;
           	turnOnProgress();
            formName.submit();
   		}
        else
        {
        	//XSSOK :  I18N label or message
        	alert("<%=invalidInputAlert%>");
        }
    }
    
  //WX7
	function basicClear(field)
	{
		if(field == "artworkPackageField" )
		{
			document.getElementById("chooseExistingArtworkPackage").value = "";
			document.getElementById("ArtworkChangeSelectedOID").value = "";
		}
		//if(field == "chooseTemplateName")
		//{
		//	document.getElementById("chooseTemplateName").value = "";
		//	document.getElementById("chooseTemplateNameOID").value = "";
		//}
		if(field == "changeOrderName")
		{
			document.getElementById("changeOrderName").value = "";
			document.getElementById("changeOrderNameOID").value = "";
		}
	}
	//WX7
	function handleArtworkPackageChange()
	{
		var values = document.getElementsByName('ArtworkPackageType');
		var value;
		for(var i = 0; i < values.length; i++){
		    if(values[i].checked){
		        value = values[i].value;
		    }
		}
		if(value == "useExisting")
		{
			document.getElementById("chooseExistingArtworkPackageButton").disabled = false;
			$(".useExistingRow").show();
			$(".createNewRow").hide();
			document.getElementById("artworkPackageTitle").readOnly = true;
			document.getElementById("artworkPackageTitle").value = "";
		}
		else
		{
			document.getElementById("chooseExistingArtworkPackageButton").disabled = true;
			$(".createNewRow").show();
			$(".useExistingRow").hide();
			document.getElementById("artworkPackageTitle").readOnly = false;
			document.getElementById("artworkPackageTitle").value = "";
		}
	}
	

	
</script>

</head>
<!--  XSSOK root_dir Static reference -->
<LINK href="../common/styles/emxUIDefault.css" rel="stylesheet" type="text/css">
<LINK href="../common/styles/emxUIForm.css" rel="stylesheet" type="text/css">

<body>
<form name="createPOAForm" id="createPOAForm" method="post">
<%@include file = "../common/enoviaCSRFTokenInjection.inc"%>
    <table class="form">
        <tbody>
		<!-- XSSOK -->
		<tr><td class="createRequiredNotice"><%=requiredField %></td></tr>
            <tr>
                <td valign="middle" colspan="6" class="createInputField">
                    <table border="0">
                    <tbody>
					<!-- XSSOK -->
					<tr><td colspan="15" class="createLabelRequired"><label for="ArtworkPackageHeader"><%=artworkPackage %></label></td></tr>
						<tr>
							<td width="16"><input class ="required" type="radio" onchange="javascript:handleArtworkPackageChange()" checked="checked" value="createNew" id="ArtworkPackageType" name="ArtworkPackageType" required="true"></td>
							<!-- XSSOK -->
							<td><%=createNew %></td>
				      		<td>
				      			&nbsp;
				      		</td>
							<td width="16"><input class ="required" type="radio" onchange="javascript:handleArtworkPackageChange()" "unchecked" value="useExisting" id="ArtworkPackageType" name="ArtworkPackageType" required="true"></td>
							<!-- XSSOK -->
							<td><%=useExisting %></td>
						</tr>
                    </tbody>
                    </table>
                </td>
            </tr>
			<!-- XSSOK -->
			<tr class="useExistingRow"><td width="150" valign="middle" class="createLabelRequired"><label for="artworkPackageField"><%=chooseAPString %></label></td></tr>
			<tr class="useExistingRow"><td width="16">
					<input type="text" size="20" onchange="javascript:populateArtworkPackageData()" 
						   name="chooseExistingArtworkPackage" id="chooseExistingArtworkPackage" value="">
						   <input id="chooseExistingArtworkPackageButton" type="button" name="chooseExistingArtworkPackageButton" disabled="true" 
						   value="..." onclick="javascript:showChooser('../common/emxFullSearch.jsp?field=TYPES=type_ArtworkPackage:CURRENT=policy_ArtworkPackage.state_Create&table=AEFGeneralSearchResults&selection=single&formName=AWLFom_SelectForArtworkPackage&submitAction=refreshCaller&hideHeader=true&HelpMarker=emxhelpfullsearch&submitURL=../awl/AWLPOACreateSupportPage.jsp?mode=ArtworkPackageChooser&typeAhead=false&chooserType=FormChooser&suiteKey=AWL&fieldNameDisplay=chooseExistingArtworkPackage&fieldNameOID=ArtworkChangeSelected&fieldNameActual=chooseExistingArtworkPackage&titleField=artworkPackageTitle&descriptionField=artworkPackageDescription')">
						  <!-- XSSOK -->
						   <a href="javascript:basicClear('artworkPackageField')"><%=clear %></a>
				</td>
			</tr>

            <input type="hidden" id="ArtworkChangeSelectedOID" name="ArtworkChangeSelectedOID" />
           
	        <input type="hidden" name="prdIDList" value="<xss:encodeForHTMLAttribute><%=prdIDList%></xss:encodeForHTMLAttribute>"/>
			<!-- XSSOK -->
			<tr class="createNewRow"><td class="heading1"><%=newArtworkPackageDetails %></td></tr>			
			<tr class="createNewRow">
            	<td valign="middle" colspan="6" class="createInputField">
					<table border="0">
					<tbody>
						<!-- XSSOK -->
						<tr><td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=title %></label></td></tr>
						<tr><td><input type="text" onkeypress="" name="artworkPackageTitle" id="artworkPackageTitle" size="20" title="Title" value=""></td></tr>
					</tbody>
					</table>
            	</td>
            </tr>
            
         	<!-- XSSOK -->
	 		<tr class="createNewRow"><td width="150" valign="middle"><label for="artWorkDescription"><%=description %></label></td></tr>
			<tr class="createNewRow"><td valign="middle" colspan="" class="createInputField"><table class="textarea"><tbody><tr><td><textarea title="Description" fieldlabel="Description" id="artworkPackageDescription" name="artworkPackageDescription" rows="5" cols="25"></textarea></td></tr></tbody></table></td></tr>       
	         
            <tr><td valign="middle" colspan="" class="createInputField"><table class=""><tbody></tbody></table></td></tr>
           
	        <tr id="calc_RDO"></tr>
	        <!-- XSSOK -->
	        	<tr class="ecmField"><td class="heading1"><%=ecm%></td></tr>
	       <!-- XSSOK -->
				<!-- <tr class="ecmField"><td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=changeTemplate %></label></td></tr>
				<tr class="ecmField">
					<td width="16">
					<input type="text" size="20"  name="chooseTemplateName" id="chooseTemplateName" value="" class ="required">
					<input type="hidden" name="chooseTemplateNameOID" id="chooseTemplateNameOID" value="">
					<input type="button"  value="..." name="btnChooseChangeTemplate"  onclick="javascript:showChooser('../common/emxFullSearch.jsp?submitAction=refreshCaller&field=TYPES=type_ChangeTemplate:CURRENT=policy_ChangeTemplate.state_Active&selection=single&table=ECMChangeTemplateSearchSummary&fieldNameActual=chooseTemplateName&fieldNameDisplay=chooseTemplateName&includeOIDprogram=enoECMChangeTemplate:getUsageTemplates&submitURL=../awl/AWLPOACreateSupportPage.jsp?mode=ChangeTemplateChooser&typeAhead=false&chooserType=FormChooser&suiteKey=AWL&fieldNameDisplay=chooseTemplateName&fieldNameOID=chooseTemplateNameOID&fieldNameActual=chooseTemplateName','600','600','true','','chooseTemplateName')"> -->
					<!-- XSSOK -->
					<!-- <a href="javascript:basicClear('chooseTemplateName')"><%=clear %></a>
									</td>
				</tr> -->
				<!-- XSSOK -->
         		<tr class="ecmField"><td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=changeOrder %></label></td></tr>
				<tr class="ecmField">
					<td width="16">
						<input type="text" size="20" name="changeOrderName" id="changeOrderName" value="" class ="required">
						<input type="hidden" name="changeOrderNameOID" id="changeOrderNameOID" value="">
						<input type="button"  value="..." name="btnChossesChangeOrder" onclick="javascript:showChooser('../common/emxFullSearch.jsp?table=AEFGeneralSearchResults&selection=single&field=TYPES=type_ChangeOrder&submitURL=../common/AEFSearchUtil.jsp?mode=Chooser&typeAhead=false&chooserType=FormChooser&suiteKey=AWL&fieldNameDisplay=changeOrderName&fieldNameOID=changeOrderNameOID&fieldNameActual=changeOrderName','600','600','true','','changeOrderName')">
						<!-- XSSOK -->
						<a href="javascript:basicClear('changeOrderName')"><%=clear %></a></td></tr>
					
					<!-- XSSOK -->
				<!--
          	  	<tr class="ecmField"><td width="150" valign="middle" class="createLabel"><label for="Title"><%=changeAction %></label></td></tr>            	
            	<tr class="ecmField"><td width="16"><input type="checkbox" name="createChangePOAForChangeAction" id="createChangePOAForChangeAction" checked/><%=createNewChangeAction%></td></tr>
            	-->
            
            <!-- XSSOK -->
            <tr><td class="heading1"><%=newPOADetails %></td></tr>
            
	 		<tr><td width="150" valign="middle"><label for="addAllElementsToPOA"><%=addAllElementsToPOA %></label></td></tr>
			<tr><td valign="middle" colspan="" class="createInputField">
			      <table class="radio">
			      	<tbody><tr>
  		      	    	<td>
  		      	    		<input type="hidden" name="isCustomizedPOA"  id="isCustomizedPOA"  value="<%=isCustomizedPOA%>"/>
                        	<input type="radio" <% if(isCustomizedPOA){%> "unchecked" <%} else { %>checked="checked" <%}%> value="All" id="addAllElementsToPOA" name="addAllElementsToPOA">  		      	        
  		      	    		<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ArtworkElementsToBeAttached.All") %>
			      		</td>
			      		<td>
			      			&nbsp;
			      		</td>
  		      	    	<td>
                        	<input type="radio" <% if(isCustomizedPOA){%> checked="checked" <%} else { %> "unchecked" <%}%>   value="None" id="addAllElementsToPOA" name="addAllElementsToPOA">  		      	        
  		      	    		<%=AWLPropertyUtil.getI18NString(context, "emxAWL.Label.ArtworkElementsToBeAttached.None") %>
			      		</td>
			       	</tr></tbody>
			       </table>
			  </td></tr>       
            
            <tr><td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=artworkUsage %></label></td></tr>
            <tr>
            	<td>
            		 <select multiple size='5' id="artworkUsageSelection" name="artworkUsageSelection" class ="required" style="width: 100%;">
            		 	<%
            		 	for(int i = 0; i < artworkUsageFields.size(); i++)
						{
							String choice = artworkUsageFields.get(i).toString();
							String display = artworkUsageDisplayValues.get(i).toString();
						
            		 	%>
  						<option value="<%=XSSUtil.encodeForHTMLAttribute(context, choice)%>"><%=XSSUtil.encodeForHTML(context, display)%></option>
  						<%
						}
  						%>
					</select> 
            	</td>
            </tr>
        <!-- //XSSOK I18N label or message	 -->    
	    <tr><td><a href="javascript:showAddCountryLangDlg();"><%=selectCountryLanguageLable%></a></td></tr>
	        <!-- //XSSOK I18N label or message	 -->    
            <tr><td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=selectedCountryLable%></label></td><tr>
            <input type="hidden" name="h_SelectedCountries"  id="h_SelectedCountries" class ="required" value=""/>
            <tr><td id="selectedCountryTD"></td></tr>
            <!-- //XSSOK I18N label or message	 -->    
            <tr><td width="150" valign="middle" class="createLabelRequired"><label for="Title"><%=selectedLangLable%></label></td></tr>
            <input type="hidden" name="h_SelectedLanguages" id="h_SelectedLanguages" class ="required" value="" />
            <tr><td id="selectedlanguageTD"></td></tr>
            
		</tbody>
	</table>	
</form>

</body>
</html>
<% if(context!=null)context.shutdown(); %>
