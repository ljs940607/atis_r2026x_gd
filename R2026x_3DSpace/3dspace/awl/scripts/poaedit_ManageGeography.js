/*
 * This file contains references to jQuery usage which rely on the page(s) where 
 * this code is included to resolve the jQuery library version in use.
 *
 * For reference, the common version of jQuery to be used in all code is located here:
 *     webapps/VENCDjquery/latest/dist/jquery.min.js
 *
 * There is also an AMD loader available for this centralized jQuery version to use in 
 * dependency declarations:
 *     DS/ENOjquery/ENOjquery
 */

(function($){
poaManageGeography = new function (){
    this.isPOAWindow=true;
	this.MandaLangsForSelectedPOA;
	this.currentPOALangs;
	
	this.getMandLanguagesNames = function() 
	{
		return this.MandaLangsForSelectedPOA;
	}
	
	this.getLanguagesNames = function() 
	{
		return this.currentPOALangs;
	}
	//Handler To manage Country Languages Command
	this.manageCountryLanguagesHandler = function() {
		'use strict';
		
		//Only single POA selection is allowed.
		var selectedPOAId = customEditUtil.getSelectedPOAs();

		 poaManageGeography.currentPOALangs = new Array();
		 var selectedLanguages = customEditUtil.getLanguagesInSequence(selectedPOAId);
		$.each(selectedLanguages, function( index,newDataJSON) {
			var newDataObject = JSON.parse(newDataJSON);
			poaManageGeography.currentPOALangs.push(newDataObject.name);                    
		});
		
		//Initialize the mand languages during every load of the page.
		poaManageGeography.MandaLangsForSelectedPOA = customEditUtil.getMandLangsForSelectedMasterCells($("td[poa_id='"+selectedPOAId+"']"));
		
		
		
		if(checkSequenceNumberChangedInPOAList([selectedPOAId])) {
			var confirmValue = confirm(POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquence'])
			if(!confirmValue) {
				return;
			}
		}
		if(selectedPOAId.indexOf(",") != -1){
			//XSSOK
			alert(POA_EDIT_LABELS['emxAWL.Message.SelectSingleHeaderObject'])
		}
		else{
			var countriesList = customEditUtil.getCountriesDetails(selectedPOAId);			
			var languageList = customEditUtil.getLanguagesInSequence(selectedPOAId);
			var productDetails =  customEditUtil.getProductDetails(selectedPOAId)[0];
			productDetails = productDetails.split(",");
			var productId = productDetails[0];
			var productType = productDetails[1];
			var appendProductLineToken="";
			//if its kind of CPG Product then dont append token
			if(productType.toUpperCase() === "FALSE"){
				appendProductLineToken="&productline=true"
			}
			$.ajax({
				type: "POST",
				url: "../resources/awl/util/storeParamInSession",
				data: "selectedCotunryList="+encodeURIComponent(countriesList)+"&selectedLanguageList="+encodeURIComponent(languageList),
				dataType: "text",
				cache: false,
				async: true,
				success: function(jsonResponse){
						var countrySelectionURL="../awl/emxAWLCommonFS.jsp?functionality=AWLManageCountryLanguagesToPOA&suiteKey=AWL&selectedProductList="+productId+"&fromWhere=customEdit"+appendProductLineToken+manageGeography.getTypeToAppend();	
						showModalDialog(countrySelectionURL,550,300,true,'Medium');
				},
			});	
		}
	};
	//To Override for type will be empty. Copy List type Copy List need to mention for disabling languages ordering
	this.getTypeToAppend = function(){
		return "";
	};
	
	//To Process Country Languages. API will be called from Country Language Dialogue box on submit action. 
	//TODO AA1: 1) Validation need to decide on client side or server. 2) XSS Validation	
	this.processCountryLangModification = function(selectedCountries,selectedLanguages,areCountriesSame,areLanguagesSame, addonlycountriesandlangs) {
		'use strict';
		var selectedPOAId = customEditUtil.getSelectedPOAs();
		var localSelectedCountries = JSON.stringify(selectedCountries);
		var localSelectedLanguages = JSON.stringify(selectedLanguages);
		customEditUtil.addProcessingIconOnCommand('#manageCountryLanguages');
		//Ajax call to do save operation, on success do render Header and GUI Cells operation
		$.ajax({
			type: "POST",
			url: manageGeography.modifyGeogrpahyURL(),
			data: "countryInfo="+encodeURIComponent(selectedCountries)+"&languageInfo="+encodeURIComponent(selectedLanguages)+"&selectedPOAs="+selectedPOAId+"&areCountriesSame="+areCountriesSame+"&areLanguagesSame="+areLanguagesSame+"&addonlycountriesandlangs="+addonlycountriesandlangs,
			dataType: "json",
			cache: false,
			async: true,
			beforeSend: function (request) {
				addSecureTokenHeader(request);
            },
			success: function(jsonResponse){
				if(jsonResponse.returnString == "success"){						
					manageGeography.renderHeaderPostCountryLanguages(selectedPOAId,JSON.parse(localSelectedCountries),JSON.parse(localSelectedLanguages),areCountriesSame,areLanguagesSame);
					manageGeography.renderCellsPostCountryLanguages(selectedPOAId);
					
				}else{
					//TODO XSS
					alert(jsonResponse.returnString);
				}
				customEditUtil.removeProcessingIconOnCommand('#manageCountryLanguages');
			},
			error: function(request,status,errorThrown){
				//TODO XSS
				alert(errorThrown);
				customEditUtil.removeProcessingIconOnCommand('#manageCountryLanguages');
			}
		});	 
		
	};
	
	this.getGeoElementsByCountry = function(countries, selectedCountries,selectedLanguages,areCountriesSame,areLanguagesSame) {
		"use strict";
		var selectedPOAId = customEditUtil.getSelectedPOAs();
		var newCountries="";
		countries.forEach(function(country){
			newCountries+=country+",";
		});
		newCountries = newCountries.slice(0,-1);
		var modifiedGEOData = new Object();
		modifiedGEOData["selectedCountries"] = JSON.parse(JSON.stringify(selectedCountries));
		modifiedGEOData["selectedLanguages"] = JSON.parse(JSON.stringify(selectedLanguages));
		modifiedGEOData["areCountriesSame"] = areCountriesSame;
		modifiedGEOData["areLanguagesSame"] = areLanguagesSame;
		
		$.ajax({
			type: "POST",
			url: manageGeography.getGeoArtworksURL(),
			data: "countryInfo="+encodeURIComponent(newCountries)+"&selectedPOAs="+encodeURIComponent(selectedPOAId),
			dataType: "json",
			cache: false,
			async: true,
			beforeSend: function (request) {
				addSecureTokenHeader(request);
         	},
            success: function(jsonResponse){
            	
            	 	var selectedPOAsArr = selectedPOAId.split(',');
            	 	var confirmMessage = manageGeography.isPOAWindow?POA_EDIT_LABELS['emxAWL.Confirm.ElementsAddedToPOA']: POA_EDIT_LABELS['emxAWL.Confirm.ElementsAddedToCL'];
            	 	var dialogDiv =  $("<div></div>").attr("class", "poa-alert-body").append(confirmMessage);
            	 	var poaIdName= {};
            	 	$("th.POASelected").each(function(index, poaTD){ 
            	 		var poaId = $(poaTD).attr("id");
            	 		poaIdName[poaId] = $(poaTD).find("p").text();
            	 	});
            	 	var isGeoElementsExist = false;
            	 	for(var i =0 ; i<selectedPOAsArr.length; i++) {
            	 		var currentPOAId = selectedPOAsArr[i];
            	 		var artworkelements = jsonResponse[currentPOAId];
            	 		var currentPOAName = poaIdName[currentPOAId]+" : ";
            	 		if(artworkelements.length>0)
            	 			isGeoElementsExist = true;
            	 		var poaDiv = $("<div/>").css("text-indent", "15px").append(currentPOAName);
            	 		var artName="";
            	 		for(var j=0; j<artworkelements.length; j++) {
            	 			artName+=artworkelements[j]+",";
            	 		}
            	 		$(poaDiv).append(artName.slice(0,-1));
            	 		$(dialogDiv).append("<br/>").append(poaDiv);
            	 	} 
            	 var onlyCountriesToAdd = false;
            	 if(isGeoElementsExist) {
					dialogDiv.dialog({
						title: "Notice",
						modal: true,
						hide: { effect: "none", duration: 150 },
				        show: { effect: "none", duration: 150 },
				        width: '600px',
				        height: 'auto',
				        resizable: false,
				        /*close: function(){
				        	if(onlyCountriesToAdd)
				        		poaManageGeography.processCountryLangModification(modifiedGEOData["selectedCountries"],modifiedGEOData["selectedLanguages"],modifiedGEOData["areCountriesSame"],modifiedGEOData["areLanguagesSame"], true);
				        	else
				        		poaManageGeography.processCountryLangModification(modifiedGEOData["selectedCountries"],modifiedGEOData["selectedLanguages"],modifiedGEOData["areCountriesSame"],modifiedGEOData["areLanguagesSame"]);
				        },*/
				        buttons: [
				        	{
				        		text: "Yes",
				        		click : function() {
				        			poaManageGeography.processCountryLangModification(modifiedGEOData["selectedCountries"],modifiedGEOData["selectedLanguages"],modifiedGEOData["areCountriesSame"],modifiedGEOData["areLanguagesSame"]);
				        			$(this).dialog("close");
				        		}
				        	},
				        	{
				        		text: "No",
				        		click: function() {
				        			poaManageGeography.processCountryLangModification(modifiedGEOData["selectedCountries"],modifiedGEOData["selectedLanguages"],modifiedGEOData["areCountriesSame"],modifiedGEOData["areLanguagesSame"], true);
				        			$(this).dialog("close");
				        		}
				        	}
				        ]
					});
            	} else {
            		manageGeography.processCountryLangModification(selectedCountries,selectedLanguages,areCountriesSame,areLanguagesSame);
            	}
			},
			error: function(request,status,errorThrown){
				//TODO XSS
				alert(errorThrown);
			}
		});	 
	};
	
	//To Override : API to return service URL for saving country languages changes.
	this.modifyGeogrpahyURL = function(){
		return "../resources/awl/db/poaservice/managecountrieslanguages";
	};
	this.getGeoArtworksURL = function(){
		return "../resources/awl/view/poaservice/getgeoartworksbycountry";
	};
	
	/*This api will refresh the header information of poa column*/
	this.renderHeaderPostCountryLanguages = function(selectedPOAId,selectedCountries,selectedLanguages,areCountriesSame,areLanguagesSame) {
		'use strict';
		if(areCountriesSame == false) {
			var countryIds = new Array();
			var countryNames = new Array();
			$(selectedCountries).each(function(index){
				var countryInfo = $.parseJSON(selectedCountries[index]);
				countryIds.push(countryInfo.id);
				countryNames.push(countryInfo.name);
			});
			$('th[id="'+selectedPOAId+'"] span.countryInfoSpan').replaceWith(editInstance.poaCountriesWithEllipsis(countryNames,countryIds));
		}
		
		if(areLanguagesSame == false) {
			var langNames = new Array();
			var langSequence = new Array();
			var langIds = new Array();
			$(selectedLanguages).each(function(index){
				var languageInfo = $.parseJSON(selectedLanguages[index]);
				langNames.push(languageInfo.name);
				langSequence.push(languageInfo.seq);
				langIds.push(languageInfo.id);
			});
			$('th[id="'+selectedPOAId+'"] span.langSpan').replaceWith(editInstance.poaLangaugesWithEllipsis(langIds,langNames,langSequence));
		}
	};
	
	/*This api will refresh the column information of poa (Cells of current POA)*/
	this.renderCellsPostCountryLanguages = function(poaId) {
		'use strict';
		//render POA after country and langauge modificatino. 
		customEditUtil.renderPOAwithCoulmnCells(poaId);		
		
	};
};
})(jQuery);
