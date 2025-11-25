<%--  
    Copyright (c) 1992-2020 Dassault Systemes.
    All Rights Reserved.
    This program contains proprietary and trade secret information of Dassault Systemes.
    Copyright notice is precautionary only and does not evidence any actual or intended publication of such program
--%>

<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.cpd.CPDCommonConstants"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.cpd.dao.Country"%>
<%@include file = "AWLUICommonAppIncludeWithStrictDocType.inc"%>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@include file = "../emxContentTypeInclude.inc"%>
<%@include file = "../emxTagLibInclude.inc"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%
//Get all request parameters
   String prdListStr = request.getParameter("selectedProductList");
   String selectedCountiesStr=(String)session.getAttribute(AWLConstants.AWL_SELECT_COUNTRY_LIST);
   String selectedLanguagesStr=(String)session.getAttribute(AWLConstants.AWL_SELECT_LANGUAGE_LIST);
   session.removeAttribute(AWLConstants.AWL_SELECT_COUNTRY_LIST);
   session.removeAttribute(AWLConstants.AWL_SELECT_LANGUAGE_LIST);
   selectedCountiesStr = selectedCountiesStr==null?AWLConstants.EMPTY_STRING:selectedCountiesStr;
   selectedLanguagesStr = selectedLanguagesStr==null?AWLConstants.EMPTY_STRING:selectedLanguagesStr;
   
   String fromWhere = request.getParameter("fromWhere");
   String type = request.getParameter("type");
   String productlinesel= request.getParameter("productline");
   String browserLang = request.getHeader("Accept-Language");
   
   boolean isFromCustomEditScreen = BusinessUtil.isNotNullOrEmpty(fromWhere) && "customEdit".equalsIgnoreCase(fromWhere);
   boolean isCopyList = BusinessUtil.isNotNullOrEmpty(type) && "copyList".equalsIgnoreCase(type);
   String selectedCountriesId = selectedCountiesStr.length()> 0 ? selectedCountiesStr.replace("|",","):"";
   
   String applicableCountryIds = CPDCommonConstants.ALL_COUNTRY_TOKEN;
   if(BusinessUtil.isNullOrEmpty(productlinesel) || AWLConstants.RANGE_FALSE.equalsIgnoreCase(productlinesel))
   {
		StringList prdStringList = new StringList(prdListStr.split(AWLConstants.REGEX_ID_SEPERATOR));
		List<Country> commonCountries = CPGProduct.getCommonCandidateMarkets(context, new ArrayList(prdStringList));
		StringList countriesId = BusinessUtil.toStringList(context, commonCountries);
		applicableCountryIds = countriesId.toString();
		if (commonCountries.isEmpty()) {
			applicableCountryIds = CPDCommonConstants.ALL_COUNTRY_TOKEN;
		}
   }   	
%>
<html>
<head>
<link rel="stylesheet" href="../webapps/UIKIT/UIKIT.css" />
<LINK href="../cpd/regioncountry/scripts/eventboundlist.css" rel="stylesheet" type="text/css" />
<LINK href="../cpd/regioncountry/scripts/eventboundorderlist.css" rel="stylesheet" type="text/css" />
<link href="../plugins/libs/jqueryui/1.10.3/css/jquery-ui.css" type="text/css" rel="stylesheet" />
<link href="../webapps/VENENO6WPlugins/plugins/jqueryui/latest/css/cupertino/jquery.ui.custom.min.css" type="text/css" rel="stylesheet" />
<LINK href="../common/styles/emxUIDefault.css" rel="stylesheet" type="text/css" />
<LINK href="../cpd/regioncountry/scripts/regioncountries.css" rel="stylesheet" type="text/css" />
<LINK href="../cpd/regioncountry/scripts/tree.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="../webapps/VENCDjquery/latest/dist/jquery.min.js"></script>
<script type="text/javascript" src="../common/scripts/jquery-ui.js"></script>
<script type="text/javascript" src="../cpd/regioncountry/scripts/tree.js"></script>
<script type="text/javascript" src="../cpd/regioncountry/scripts/eventboundlist.js"></script>
<script type="text/javascript" src="../cpd/regioncountry/scripts/eventboundorderlist.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIConstants.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script> 
<script type="text/javascript" src="../awl/scripts/customEditUtil.js"></script>
<script type="text/javaScript">
var isLangaugeOrderRequired = <%=isCopyList?"false":"true"%>;
        var isProcessing = false;       
        function closeWindow()
        {
                getTopWindow().closeWindow();
        }
        
        function submit()
        {
            if(isProcessing)
            {
                alert(emxUIConstants.STR_URL_SUBMITTED);
            }
            else
            {
                var selectedCountries = clist[0].getSelectedList();
                var selectedLanguages = langOrderlist[0].getSelectedList();
				
                var currentLanguages = new Array();
                $.each(selectedLanguages, function( index,newDataJSON) {
                    var newDataObject = JSON.parse(newDataJSON);
                    currentLanguages.push(newDataObject.name);                    
                });
				
				
              	//Validate Country and Langauge selection, it is mandatory to have at lease one coutry and language.
                if(!selectedCountries || selectedCountries.length<=0) {
                    //XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
                    alert("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.Message.SelectCountries", browserLang)%>");
                 }
                 else if(!selectedLanguages || selectedLanguages.length<=0) {
                    //XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
                    alert("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.FPMaster.Alert.SelectLang", browserLang)%>");
                    }else{
                            //Validate if really there are chanegs to country and languages. 
                    	 	var existingSelectedCountryIds= customEditUtil.getIdArrayFromJavaString("<xss:encodeForJavaScript><%=selectedCountriesId%></xss:encodeForJavaScript>"); 
                    	 	
                    		var newlySelectedIds = customEditUtil.getIdArrayFromJSString(selectedCountries);
                    		
                    		var countryAddList = [];
                    		newlySelectedIds.forEach(function(countryid){
                    			if(existingSelectedCountryIds.indexOf(countryid)==-1) 
                    				countryAddList.push(countryid);
                    		});
                    		var countryCompareResult = customEditUtil.compareArrays(existingSelectedCountryIds,newlySelectedIds);
                    		var languageCompareResult = false;
                    		
                    		var existingSelectedLanguageJObjects = customEditUtil.getJSONArrayFromJavaString("<xss:encodeForJavaScript><%=selectedLanguagesStr%></xss:encodeForJavaScript>");
                    		if(isLangaugeOrderRequired){
                    			languageCompareResult = customEditUtil.compareLanguageWithSequence(existingSelectedLanguageJObjects,selectedLanguages);
                    		}else{
                    			
                    			languageCompareResult = customEditUtil.compareCountries(existingSelectedLanguageJObjects,selectedLanguages);
                    		}
                    		//Show alert if existing selection does not changed.
                   		 if(countryCompareResult && languageCompareResult) {
                       			//XSSOK AWLPropertyUtil.getI18NString : Res Bundle-I18N
                            		alert("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.Message.NoChanges", browserLang)%>");
                       		}else{
					if(getTopWindow().getWindowOpener().manageGeography != undefined)
					{
						var mandLanguages = getTopWindow().getWindowOpener().manageGeography.MandaLangsForSelectedPOA;
						if(mandLanguages && mandLanguages.length > 0)
						{
							// Get all the languages from  POA
							var currentPOALangs = getTopWindow().getWindowOpener().manageGeography.currentPOALangs;
							var langsToRemove = customEditUtil.removeAllFromArray(currentPOALangs, currentLanguages);
											
							var commonLangs = customEditUtil.findCommonElements(mandLanguages, langsToRemove);
							if(commonLangs.length > 0 && confirm("<%=AWLPropertyUtil.getI18NString(context,"emxAWL.Confirm.RemoveMandatoryLangFromPOA", browserLang)%>")==false)
							return;
						}										
					}
	                    	  <%if(isFromCustomEditScreen){
	                              %>
	                              if( countryAddList.length>0 ) {
	                            	  	getTopWindow().getWindowOpener().manageGeography.getGeoElementsByCountry(countryAddList, selectedCountries, selectedLanguages,countryCompareResult,languageCompareResult);
	                              } else {
	                              		getTopWindow().getWindowOpener().manageGeography.processCountryLangModification(selectedCountries, selectedLanguages,countryCompareResult,languageCompareResult);
	                              }
	                           <%}else{
	                               %>
				       				getTopWindow().getWindowOpener().renderSelGeogrpagy(selectedCountries, selectedLanguages);
	                           <%} %> 
	                           turnOnProgress();
	                           isProcessing = true;
				   			   getTopWindow().closeWindow();
                       	 }
                    }
            }
        }
        
        var clist, langlist;
        $(document).ready(function() {
        	 //Get all string labels related parameters
        	CPD_ReCoLa_LABELS = getSyncJSON("../resources/cpd/view/countryregion/getlabel");
        	createComponentGUI();
        	
        	//Tree component to create tree for regions
            var treeObj=$("#regionDiv").tree({
    			duration: 400, 
    			triggerSelectOn: 'leafchildnode',
    			serverurl: "../resources/cpd/view/countryregion/getregionsapplicable", 
    			urlparam: "RegionID={id}&ApplicableCountryIds=<xss:encodeForURL><%=applicableCountryIds%></xss:encodeForURL>&SelectedCountryIds=<xss:encodeForURL><%=selectedCountriesId%></xss:encodeForURL>"
    		});
          	//Evenboundlist component to show countries based on region selection.Soring by country name  alphabets. 
            clist=$("#countriesDiv").eventBoundList('1', treeObj, 'selected', 'deselected', {
                duration: 400, 
                serverurl: "../resources/cpd/view/countryregion/getcountriesapplicable",
    			urlparam: "RegionID={id}&ApplicableCountryIds=<xss:encodeForURL><%=applicableCountryIds%></xss:encodeForURL>&SelectedCountryIds=<xss:encodeForURL><%=selectedCountriesId%></xss:encodeForURL>",
                showUnique: true,
                showOriginatorSelectAll : false,
                strSelectAll:CPD_ReCoLa_LABELS['emxCPD.Label.SelectAll'],
            });
          	//Evenboundlist component to show languages based on country selection.Soring by language name alphabets.
            langlist=$("#languageDiv").eventBoundList('1', clist, 'selected', 'deselected', {
                duration: 400, 
                serverurl: "../resources/awl/view/country/getLanguagesToCreatePOA",
                urlparam: "countryID={id}&SelectedLanguageIds=<xss:encodeForURL><%=selectedLanguagesStr%></xss:encodeForURL>",
                showOriginatorSelectAll : false, 
                enableReorder: false,
                showUnique: true,
                strSelectAll:CPD_ReCoLa_LABELS['emxCPD.Label.SelectAll'],
                sorted: true,
                sequnceOrder: isLangaugeOrderRequired,
            });
          	//EvenboundOrderlist component to show select languages so that user can reoder by drag and drop.
            langOrderlist=$("#languageOrderDiv").eventBoundOrderList('1', langlist, 'selected', 'deselected', {
                duration: 400,
                enableReorder: isLangaugeOrderRequired,
                showUnique: true,
                sorted: !isLangaugeOrderRequired,
                sequnceOrder: isLangaugeOrderRequired,
            });
          	//Start will expand Tree root node, so that top elvel roots can be seen.
           treeObj[0].start();
          
        });
        //API to create GUI for region,Country,Language and Language Order 
        createComponentGUI = function(){ 
	        //GUI creation logic
	        var tableHTML = $("<table>").attr("id","regionCountryLangTable");
	        //UI KIT and Jqeury csss are used for table to have similar look and feel.
	    	tableHTML.addClass("table table-bordered table-condensed table-striped resizable");
	    	tableHTML.attr("style","width: 99%;");
	    	//Create component table Header 
	    	var theadHTML = $("<thead>").attr("id","tableHeader");
	    	var headerRow = $("<tr>").attr("id","tableHeaderRow");
	    	var regionTH = $("<th>").attr("class","geography-table-header ui-resizable").html(CPD_ReCoLa_LABELS['emxCPD.label.Regions']);
	    	var countryTH = $("<th>").attr("class","geography-table-header ui-resizable").html(CPD_ReCoLa_LABELS['emxCPD.common.Countries']);
	    	var langTH = $("<th>").attr("class","geography-table-header ui-resizable").html(CPD_ReCoLa_LABELS['emxCPD.label.Languages']);
	    	var langOrderTH = $("<th>").attr("class","geography-table-header ui-resizable").html(CPD_ReCoLa_LABELS['emxCPD.label.LanguageSelected']);
	    	//Add drag and drop message only if its language sequence is required. 
	    	if(isLangaugeOrderRequired){
	    		var messageSpan = $("<span>").addClass("languageOrderMsg").html("<br>"+CPD_ReCoLa_LABELS['emxCPD.label.LanguageOrderMsg']);
	    		langOrderTH.append(messageSpan);
	    	}
	    	headerRow.append(regionTH);
	    	headerRow.append(countryTH);
	    	headerRow.append(langTH);
	    	headerRow.append(langOrderTH);
	    	
	    	theadHTML.append(headerRow);
	    	//Create component table Body
	    	var tbodyHTML = $("<tbody>").attr("id","tableBody");
	    	var tableBodyRow = $("<tr>").attr("id","tableBodyRow");
	    	var regionTD = $("<td>");
	    	var regionDiv = $("<div>").attr("class","RegCountryLangDiv").attr("id","regionDiv");
	    	regionTD.append(regionDiv);
	    	
	    	var countryTD = $("<td>");
	    	var countryDiv = $("<div>").attr("class","RegCountryLangDiv").attr("id","countriesDiv");
	    	countryTD.append(countryDiv);
	    	
	    	var langTD = $("<td>");
	    	var languageDiv = $("<div>").attr("class","RegCountryLangDiv").attr("id","languageDiv");
	    	langTD.append(languageDiv);
	    	
	    	var langOrderTD = $("<td>");
	    	var languageOrderDiv = $("<div>").attr("class","RegCountryLangDiv").attr("id","languageOrderDiv");
	    	langOrderTD.append(languageOrderDiv);
	    	
	    	tableBodyRow.append(regionTD);
	    	tableBodyRow.append(countryTD);
	    	tableBodyRow.append(langTD);
	    	tableBodyRow.append(langOrderTD);
	    	
	    	tbodyHTML.append(tableBodyRow);
	    	
	    	tableHTML.append(theadHTML);
	    	tableHTML.append(tbodyHTML);
	    	
	    	//append table to page content div
	    	var editTableDiv=$("#pageContent");
	    	editTableDiv.append(tableHTML);
        }
</script>
</head>
<body style="cursor: auto;">
<div id='pageContent'></div>
<form name="CountryLangSelectForm"  method="post" action=""  class="hideForm">
</form>
</body>
</html>
