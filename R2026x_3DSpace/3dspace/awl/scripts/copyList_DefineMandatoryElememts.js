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
defineMandtoryElementsInstance = new function (){
	/*
		This function is handler for defineMandatoryElements command
		author : wx7
	*/
	this.defineMandatoryElementsHandler = function () {
		if(isSeqNumChanged) {
			var confirmValue = confirm(POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquence'])
			if(!confirmValue) {
				return;
			}
			isSeqNumChanged=false;
		}
		'use strict';

		if($(".empty-artworkelement-cell.success").length == $("td.success").length){
				alert(POA_EDIT_LABELS['emxAWL.Warning.SelectNonEmptyCell']);
				return;
		}
		
		var uiSelectionFlag = defineMandtoryElementsInstance.getUISelectionFlag();
		if(uiSelectionFlag == "mixed"){
			alert(POA_EDIT_LABELS['emxAWL.Alert.CannotSelectNoramlAndSpecialCopies']);
			return;
		}
		customEditUtil.showSlideInDialog("30%");
		var uniqueLangaugesJSONArr = new Array();
		var languageUIInfoJSONArr = new Array();
		if(uiSelectionFlag == "normal"){
			uniqueLangaugesJSONArr = customEditUtil.getUniqueLanguageFromCells($("td.success"));;
			languageUIInfoJSONArr = defineMandtoryElementsInstance.updateMandatoryLanguageInformation(uniqueLangaugesJSONArr);
		} else {
			languageUIInfoJSONArr = defineMandtoryElementsInstance.getUIWithDisplayName();
		}
		createModifyAssemblyDiv(languageUIInfoJSONArr,POA_EDIT_LABELS['emxAWL.Label.DefineMandaElements'],"btnSaveMandatoryInformation");
	};
	
	/*This function will return whether only normal copies are selected
		wx7--review comment : This complete code is not required. Though this is added to keep atomicity of method.
	*/
	this.getUISelectionFlag = function (){
		var normalCopies = new Array();
		var specialCopies = new Array();
		$("td.success").each(function(){
			var isGraphic = $(this).attr("isgraphic");
			var isInline = $(this).attr("isinline");
			var isNoTranslate = $(this).attr("isnotranslate");
			if(isGraphic == "true" || isInline == "true" || isNoTranslate == "true")
				specialCopies.push($(this).attr("id"));
			else
				normalCopies.push($(this).attr("id"));
		});
		if(normalCopies.length == $("td.success").length)
			return "normal";
		else if(specialCopies.length == $("td.success").length)
			return "special";
		else 
			return "mixed"
	};
	
	/*This function will update ui information for special case elements*/
	this.getUIWithDisplayName = function(){
		var languageUIInfoJSONArr = new Array();
		var addedIds = new Array();
		$("td.success").each(function(){
			if($(this).hasClass("empty-artworkelement-cell"))
				return;
			var displayNameTD = $(this).closest("tr").children("td")[0];
			var mandatoryInformation = $(this).attr("lc_mandids");
			//since State and Revision spans exist for displayNameTD, get text() from first node element
			var uiInfo = {name: $(displayNameTD).attr("dispName"),id:$(this).attr("mc_id")}; // storing id of master instead of language
			if(addedIds.indexOf($(this).attr("mc_id")) == -1){
				languageUIInfoJSONArr.push(uiInfo);
				addedIds.push($(this).attr("mc_id"));
			}
		});
		
		var checkedArray = new Array();
		var unCheckedArray = new Array();
		var partialCheckedArray = new Array();
		$.each(addedIds,function(index,value){
			var selector = "td.success[mc_id='"+value+"']";
			var noOfMasterCellsSelected = $("td.success[mc_id='"+value+"']").length;
			var mandatoryCellsCount = 0;
			$("td.success[mc_id='"+value+"']").each(function(){
				mandatoryCellsCount += parseInt($(this).attr("lc_mandids"));
				
			});
			if(mandatoryCellsCount == noOfMasterCellsSelected){
				checkedArray.push(value);
			} else if(mandatoryCellsCount == 0){
				unCheckedArray.push(value);
			} else{
				partialCheckedArray.push(value);
			}
		});
		languageUIInfoJSONArr = defineMandtoryElementsInstance.addUIPropertyToJSONObjects(languageUIInfoJSONArr,checkedArray,"checked");
		languageUIInfoJSONArr = defineMandtoryElementsInstance.addUIPropertyToJSONObjects(languageUIInfoJSONArr,unCheckedArray,"unchecked");
		languageUIInfoJSONArr = defineMandtoryElementsInstance.addUIPropertyToJSONObjects(languageUIInfoJSONArr,partialCheckedArray,"partial");
		return languageUIInfoJSONArr;
	};
	
	/*This function will update ui information on unique array*/
	this.updateMandatoryLanguageInformation = function (uniqueLangaugesJSONArr) {
		'use strict';
		var commonElementsArray = new Array();
		var uncommonElementsArray = new Array();
		var partialElementsArray = new Array();
		//This associativeArray will store the lang and no of occurence of each language as property of it.
		//initialize everything to 0
		var associativeArray = {};
		$.each(uniqueLangaugesJSONArr,function(){
			associativeArray[this.id] = 0;
		});
		var selectedCellsLength = $("td.success").length;
		//iterate through each of selected cell and update associativeArray array accordingly
		$("td.success").each(function(){
			var languageIds = $(this).attr("lang_ids");
			if(languageIds != undefined && languageIds != "") {
				var languageIdsArr = languageIds.split(",");
				var mandatoryInformationArr = $(this).attr("lc_mandids").split(",");
				$.each(languageIdsArr,function(index,value){
					if(mandatoryInformationArr[index] == "1")
						associativeArray[value] += 1; 
				});
			}
		});
		
		$.each(associativeArray,function(key,value){
			if(value == selectedCellsLength)
				commonElementsArray.push(key);
			else if(value == "0")
				uncommonElementsArray.push(key);
			else
				partialElementsArray.push(key);
		});
		//all required data is present now.
		uniqueLangaugesJSONArr = defineMandtoryElementsInstance.addUIPropertyToJSONObjects(uniqueLangaugesJSONArr,commonElementsArray,"checked");
		uniqueLangaugesJSONArr = defineMandtoryElementsInstance.addUIPropertyToJSONObjects(uniqueLangaugesJSONArr,uncommonElementsArray,"unchecked");
		uniqueLangaugesJSONArr = defineMandtoryElementsInstance.addUIPropertyToJSONObjects(uniqueLangaugesJSONArr,partialElementsArray,"partial");
		return uniqueLangaugesJSONArr;
	};
	
	
	this.addUIPropertyToJSONObjects = function(JSONObjectArr,idsArr,value){
		$.each(JSONObjectArr,function(index,JSONObj){
			if(idsArr.indexOf(JSONObj.id) != -1)
				JSONObj.state =  value;
		});
		return JSONObjectArr;
	}
	
	this.saveMandatoryInformation = function(){
		
		//get non inline MCAIds
		var selectedCellIds = Array();
		$("td.success").each(function() {
			selectedCellIds.push($(this).attr("id"));
		});
		if(defineMandtoryElementsInstance.getUISelectionFlag() == "normal"){
			var addedLanguagesArray = Array();
			var removedLanguageArray = Array();
			$("#modifyAssemblyContentDiv>.languageCheckBoxLabel").each(function(){
				var checkBoxElem = $(this).children()[0];
				//checkboxes with state as partial or unchecked and checked property true are newly added languages
				if(($(checkBoxElem).attr("state") == "unchecked" &&  $(checkBoxElem).prop("checked") == true) ||
				($(checkBoxElem).attr("state") == "partial" && $(checkBoxElem).prop("indeterminate") == false && $(checkBoxElem).prop("checked") == true) ){
					addedLanguagesArray.push($(checkBoxElem).attr("name"));
				}
			});
			$("#modifyAssemblyContentDiv>.languageCheckBoxLabel").each(function(){
				var checkBoxElem = $(this).children()[0];
				//checkboxes with state as partial or unchecked and checked property true are newly added languages
				if( ($(checkBoxElem).attr("state") == "checked" &&  $(checkBoxElem).prop("checked") == false) ||
					($(checkBoxElem).attr("state") == "partial" && $(checkBoxElem).prop("indeterminate") == false && $(checkBoxElem).prop("checked") == false) ){
					removedLanguageArray.push($(checkBoxElem).attr("name"));
				}
			});
			var messageObject = getSyncJSON("../resources/awl/db/copylist/updateMandatoryFlag","selectedCellIds=" + selectedCellIds +"&removedLanguages=" + removedLanguageArray.join(",") +"&addedLanguages=" +addedLanguagesArray.join(","));
			if(messageObject.returnString != ""){
				alert(messageObject.returnString);
			}
		}
		 else {
			var toBeAddedAsMandatoryArray = new Array();
			var toBeRemovedAsMandatoryArray = new Array();
			$("#modifyAssemblyContentDiv>.languageCheckBoxLabel").each(function(){
				var checkBoxElem = $(this).children()[0];
				if(($(checkBoxElem).attr("state") == "unchecked" &&  $(checkBoxElem).prop("checked") == true) ||
				   ($(checkBoxElem).attr("state") == "partial" && $(checkBoxElem).prop("indeterminate") == false && $(checkBoxElem).prop("checked") == true) ){
					toBeAddedAsMandatoryArray.push($(checkBoxElem).attr("lang_id"));
				}
			});
			$("#modifyAssemblyContentDiv>.languageCheckBoxLabel").each(function(){
				var checkBoxElem = $(this).children()[0];
				if( ($(checkBoxElem).attr("state") == "checked" &&  $(checkBoxElem).prop("checked") == false) ||
					($(checkBoxElem).attr("state") == "partial" && $(checkBoxElem).prop("indeterminate") == false && $(checkBoxElem).prop("checked") == false)){
					toBeRemovedAsMandatoryArray.push($(checkBoxElem).attr("lang_id"));
				}
			});
			var messageObject = getSyncJSON("../resources/awl/db/copylist/updateMandatoryFlagOnMaster","selectedCellIds=" + selectedCellIds +"&addedMasterIds=" + toBeAddedAsMandatoryArray.join(",") +"&removedMasterIds=" + toBeRemovedAsMandatoryArray.join(","));
			if(messageObject.returnString != ""){
				alert(messageObject.returnString);
			}
		}
		
		
		renderUIAfterModAssemnblyElement(selectedCellIds,"td.success");
		closeSlideInWindow();
	};
};
})(jQuery);
