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

//Handles Modify Assembly Element Operations.  
modifyAssemlyElementHandler = function(){
	'use strict';
	$('button#footerButtons').addClass('hideElement'); 
		var selectedLcIds=  "";
		$("td.success").each(function(index)
				{
					selectedLcIds =selectedLcIds+"|"+ $(this).attr("lc_ids");
				});
		//alert(selectedLcIds);
		var width = $("#workingPane").width();
		var docWidth = $(window).width();
		var perc = (width)/docWidth;
		if(perc > 0.8){
			greyOutWorkingArea("70%");
		}
		else{
			enableWorkingArea();
		}
		//Fetch the union languages from selected cells POA
		var uniqueLangaugesJSONArr = getUniquePOALanguageJSONArray($("td.success"));
		var languageUIInfoJSONArr = updateLanguageUsage(uniqueLangaugesJSONArr);
		//Create GUI for modifing assembly elements.
		createModifyAssemblyDiv(languageUIInfoJSONArr,POA_EDIT_LABELS['emxAWL.Label.ModifyAssemblyElement'],"btnSaveAssembly");
		setSlideInWidth("30%");
};
//wx7 this function will update ui info on unique language list
function updateLanguageUsage(uniqueLangaugesJSONArr){
	var languageUIInfoJSONArr = Array();
	var commonLanguagesJSONArray = getCommonAssemblyElementLanguage(); //common languages
	var cellLanguagesUnionJSONArray = customEditUtil.getUniqueLanguageFromCells($("td.success")); // union(selected cell languages)
	var partialLanguagesJSONArray = excludeElementsFromArray(cellLanguagesUnionJSONArray,commonLanguagesJSONArray);
	var unsuedLanguagesJSONArray = excludeElementsFromArray(uniqueLangaugesJSONArr,cellLanguagesUnionJSONArray);
	addUIPropertyToJSONObjects(commonLanguagesJSONArray,"checked");
	addUIPropertyToJSONObjects(partialLanguagesJSONArray,"partial");
	addUIPropertyToJSONObjects(unsuedLanguagesJSONArray,"unchecked");
	$.merge(languageUIInfoJSONArr,commonLanguagesJSONArray);
	$.merge(languageUIInfoJSONArr,partialLanguagesJSONArray);
	$.merge(languageUIInfoJSONArr,unsuedLanguagesJSONArray);
	return languageUIInfoJSONArr;
}
	
function addUIPropertyToJSONObjects(JSONObjectArr,value){
	$.each(JSONObjectArr,function(index,JSONObj){
		JSONObj.state =  value;
	});
}
//wx7 - function  to exclude json objects from subset
function excludeElementsFromArray(unionJSONArray,subsetJSONArray){
	var returnArray = Array();
	if(subsetJSONArray.length == 0 || typeof subsetJSONArray === undefined){
		return unionJSONArray;
	}
	$.each(unionJSONArray, function(unionIndex,unionObject) {
		var unionObjectId = unionObject.id;
		var addToReturnArr = true;
        $.each(subsetJSONArray,function(subsetIndex,subsetObject){
			if(subsetObject.id == unionObjectId)
				addToReturnArr = false;
		});
		if(addToReturnArr)
			returnArray.push(unionObject);
	});
	return returnArray;
}


//wx7 - This function will return an array of unique languages among POAs, selectedCells array has to be sent as parameter
function getUniquePOALanguageJSONArray(selectedItemArray){
	'use strict';
	var uniqueLangaugesJSONArr = Array();
	var processedPOAs = Array(); // to avoid processed POA cells
	var uniqueLanguages = Array(); // to avoid duplicate languages
	
	$.each(selectedItemArray,function(){
		var poaId = $(this).attr("poa_id");
		if(typeof poaId !== "undefined" && processedPOAs.indexOf(poaId) < 0){ //making sure that it is cell and not processed
			processedPOAs.push(poaId);
			//get the poa cell and read languages and store in an array
			var poaElem = $("th[id='"+poaId+"'] span.langSpan")[0];
			//var poaElem = document.getElementById(poaId);
			var langIds = $(poaElem).attr("lang_ids").split(",");
			var langNames = $(poaElem).attr("lang_names").split(",");
			$.each(langIds,function(index,eachLangId){
				//if(uniqueMapper[value] == undefined){
				if(uniqueLanguages.indexOf(eachLangId) < 0){
					//state attribute can be checked | unchecked | indeterminate
					var langInfo= {name: $.trim(langNames[index]),id: $.trim(eachLangId)};
					uniqueLangaugesJSONArr.push(langInfo);
					//uniqueMapper[value] = 1;
					uniqueLanguages.push(eachLangId);
				}
			});
		}
	});
	return uniqueLangaugesJSONArr;
}
	
	//AA1: This function will do addition or removal of local elements based on given input.
saveManageLC = function () {
	'use strict';
	var selectedCells = Array();
	//get inline MCAIds 
	var slectedInlineIds = Array();
	$("td.success[isinline = 'true']").each(function() {
		slectedInlineIds.push($(this).attr("id"));
		selectedCells.push($(this).attr("id"));
	});
	//get non inline MCAIds
	var slectedNonInlineIds = Array();
	$("td.success[isinline = 'false']").each(function() {
		slectedNonInlineIds.push($(this).attr("id"));
		selectedCells.push($(this).attr("id"));
	});
	//get newly added languages
	var addedLanguageJSONArray = Array();
	$("#modifyAssemblyContentDiv>.languageCheckBoxLabel").each(function(){
		var checkBoxElem = $(this).children()[0];
		//checkboxes with state as partial or unchecked and checked property true are newly added languages
		if(($(checkBoxElem).attr("state") == "unchecked" &&  $(checkBoxElem).prop("checked") == true) ||
		   ($(checkBoxElem).attr("state") == "partial" && $(checkBoxElem).prop("indeterminate") == false && $(checkBoxElem).prop("checked") == true) ){
			var langInfo = { name : $(checkBoxElem).attr("name"), id : $(checkBoxElem).attr("lang_id")};
			addedLanguageJSONArray.push(JSON.stringify(langInfo));
		}
	});
	
	//get newly removed languages
	var removedLanguageJSONArray = Array();
	$("#modifyAssemblyContentDiv>.languageCheckBoxLabel").each(function(){
		var checkBoxElem = $(this).children()[0];
		
		//checkboxes with state as partial or unchecked and checked property true are newly added languages
		if( ($(checkBoxElem).attr("state") == "checked" &&  $(checkBoxElem).prop("checked") == false) ||
			($(checkBoxElem).attr("state") == "partial" && $(checkBoxElem).prop("indeterminate") == false && $(checkBoxElem).prop("checked") == false) ){
			var langInfo = { name : $(checkBoxElem).attr("name"), id : $(checkBoxElem).attr("lang_id")};
			removedLanguageJSONArray.push(JSON.stringify(langInfo));
		}
	});
	
	
	var addedLangMessage = "";
	var removedLangMessage = "";
	var inlineMessage = "";
	if ((addedLanguageJSONArray.length + removedLanguageJSONArray.length) == 0) {
		alert(POA_EDIT_LABELS['emxAWL.Alert.NoChangesInAssembly']);
		return;
	}
	if (addedLanguageJSONArray.length > 0 && slectedNonInlineIds.length > 0) {
		// perform add elements operation in database
		addedLangMessage = getSyncJSON("../resources/awl/db/poaservice/addlocalelements", "selectedMCAs_POAs="+ slectedNonInlineIds + "&addedLanguages="+ encodeURIComponent(addedLanguageJSONArray));
	}

	if(removedLanguageJSONArray.length > 0)
	{
			var selectedLangNamesToRemove = new Array();
			$(removedLanguageJSONArray).each(function(index, curentJSONObject){
				var langInfo = $.parseJSON(curentJSONObject);				
				selectedLangNamesToRemove.push(langInfo.name);
			});
		var mandLanguages = customEditUtil.getMandLangsForSelectedMasterCells($("td.success"));		
		if(customEditUtil.findCommonElements(mandLanguages, selectedLangNamesToRemove).length > 0 
						&& confirm(POA_EDIT_LABELS['emxAWL.Confirm.RemoveMandatoryElement'])==false)
			return;
	}

	if (removedLanguageJSONArray.length > 0 && slectedNonInlineIds.length > 0) {
		// perform remove elements operation in database
		removedLangMessage = getSyncJSON("../resources/awl/db/poaservice/removelocalelements","selectedMCAs_POAs=" + slectedNonInlineIds+"&removedLanguages=" + encodeURIComponent(removedLanguageJSONArray));
	}

	if (slectedInlineIds.length > 0 && (addedLanguageJSONArray.length + removedLanguageJSONArray.length > 0)) {
		// perform inline elements operation in database
		inlineMessage = getSyncJSON("../resources/awl/db/poaservice/manageinlinecopies","selectedInlineMCAs_POAs=" + slectedInlineIds+ "&addedLanguages=" + encodeURIComponent(addedLanguageJSONArray)+ "&removedLanguages=" + encodeURIComponent(removedLanguageJSONArray));
	}

	// display message
	var alertString = "";
	if (addedLangMessage.returnString != undefined)
		alertString += addedLangMessage.returnString + "  ";
	if (removedLangMessage.returnString != undefined)
		alertString += removedLangMessage.returnString + "  ";
	if (inlineMessage.returnString != undefined)
		alertString += inlineMessage.returnString + " ";

	if (alertString.trim() != "")
		alert(alertString);
	// close sliden and enable working pane
	renderUIAfterModAssemnblyElement(selectedCells,"td.success");
	closeSlideInWindow();
	customEditUtil.removeEmptyRows(); 	
};

renderUIAfterRemoveElement = function (selectedCells,cellSelector) {
	var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
	$(cellSelector).each(function() {
			
		var copyId = $(this).attr("mc_id");
		var poaId = $(this).attr("poa_id");
			
			
		if(selectedPOAsArr.indexOf(poaId)!=-1) {
			if(sequenceData[poaId])
				delete sequenceData[poaId][copyId];
			
				$(this).children().each(function(){	
					$(this).remove();
				});
			
			editCopyElementSequenceNumber.validateSequenceNumber(poaId);
		}
	});
	editInstance.addOrRemoveEmptyCellColor(); // This is to Add or Remove the background color for empty cells
	updateSequenceNumberChangedFlag();
}
renderUIAfterPOARemovedFromCustomizedPOA= function (selectedCells,cellSelector) {
	var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
	$(cellSelector).each(function() {
			
		var copyId = $(this).attr("mc_id");
		var poaId = $(this).attr("poa_id");
		var mc_poaid = $(this).attr("id");
		console.log(selectedCells);
		if(selectedPOAsArr.indexOf(poaId)!=-1 && selectedCells.indexOf($(this).attr("id")) !=-1) {
			if(sequenceData[poaId])
				delete sequenceData[poaId][copyId];
			
				$(this).children().each(function(){	
					$(this).remove();
				});
			
			editCopyElementSequenceNumber.validateSequenceNumber(poaId);
		}
	});
	editInstance.addOrRemoveEmptyCellColor(); 
	updateSequenceNumberChangedFlag();
}
//Render GUI after assembly element modification
renderUIAfterModAssemnblyElement = function (selectedCells,cellSelector) {
	var jsonMC_POA_DataMatrix = editInstance.getUpdatedUIInfo(selectedCells);  
	var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
	$(cellSelector)
			.each(
					function() {
						//var mc_poa = $(this).attr("id");
						var copyId = $(this).attr("mc_id");
						var poaId = $(this).attr("poa_id");
						
						if($.inArray(poaId, selectedPOAsArr) > -1 ) {
						//Delete current copy sequence information from sequence data repository
						if(sequenceData[poaId])
							delete sequenceData[poaId][copyId];
						
						
						var isGraphic = $(this).attr("isGraphic");
						var isGraphicBool = (isGraphic == "true"); 
						var isInline = $(this).attr("isInline");
						var isInlineBool= (isInline == "true");
						// information.
						var allPOAsDataforEachMC = jsonMC_POA_DataMatrix[copyId];
						//get local copy details for each POA
						// remove existing all children of selected mca_POA 
						// consider cases where all local elements are removed
						if (allPOAsDataforEachMC && allPOAsDataforEachMC.hasOwnProperty(poaId))
						{
							var localCopyInfo = allPOAsDataforEachMC[poaId];
								$.each(selectedPOAsArr, function(index,currentPOA){
									if(currentPOA == poaId) {
										var container = document.getElementById('mc_poa'+copyId+'_'+poaId);
										$(container).children().each(function(index, currentChildElement) {
												$(currentChildElement).remove();
							});
									}
								});
							editInstance.addMCA_POACell(isGraphicBool, copyId, poaId, localCopyInfo, $(this),isInlineBool);
						}else{
								$.each(selectedPOAsArr, function(index,currentPOA){
									if(currentPOA == poaId) {
										var container = document.getElementById('mc_poa'+copyId+'_'+poaId);
										$(container).children().each(function(index, currentChildElement) {
												$(currentChildElement).remove();
										});
						}
								});
							}
						editCopyElementSequenceNumber.validateSequenceNumber(poaId);
						} else if("td.success" == cellSelector){
							if(sequenceData[poaId])
								delete sequenceData[poaId][copyId];
							var isGraphic = $(this).attr("isGraphic");
							var isGraphicBool = (isGraphic == "true"); 
							var isInline = $(this).attr("isInline");
							var isInlineBool= (isInline == "true");
							var allPOAsDataforEachMC = jsonMC_POA_DataMatrix[copyId];
							//get local copy details for each POA
							if (allPOAsDataforEachMC && allPOAsDataforEachMC.hasOwnProperty(poaId))
							{
								var localCopyInfo = allPOAsDataforEachMC[poaId];
								$(this).children().each(function(){
									$(this).remove();
								});
								editInstance.addMCA_POACell(isGraphicBool, copyId, poaId, localCopyInfo, $(this),isInlineBool);
								editCopyElementSequenceNumber.validateSequenceNumber(poaId);
							}else {
								if(!allPOAsDataforEachMC){ //IR-696720-3DEXPERIENCER2018x
									$(this).removeAttr("lang_ids");
									$(this).removeAttr("lc_ids");
									$(this).removeAttr("lang_names");
									$(this).removeAttr("lc_currentstate");
									$(this).children().each(function(){
										$(this).remove();
									}); 
								} else if(allPOAsDataforEachMC && !allPOAsDataforEachMC.hasOwnProperty(poaId)) {
									$(this).removeAttr("lang_ids");
									$(this).removeAttr("lc_ids");
									$(this).removeAttr("lang_names");
									$(this).removeAttr("lc_currentstate");
									$(this).children().each(function(){
										$(this).remove();
									});
								}
							}
						}
					});
	editInstance.addOrRemoveEmptyCellColor(); // This is to Add or Remove the background color for empty cells
	updateSequenceNumberChangedFlag();
}

	//Create Modify Assembly GUI DIV creation
	createModifyAssemblyDiv = function(languageUIInfoJSONArr,header,commandId){
		'use strict';
		//Manage Assembly element slideinslidein Div creation 
		var slideInDiv= $('<div/>').attr("id","slideInDiv").css("width","30%");
		var slideInContentTable = createSlideInContentTable(languageUIInfoJSONArr,header);
		var footerActionBar = getActionToolbar(commandId);
		
		slideInDiv.append(slideInContentTable);
		slideInDiv.append(footerActionBar);
		//attach the new slideIn div to page and adjust working pane area width.
		$('#pageContent').append(slideInDiv);
		LanguageSelectionChangedHandler();
		$("#workingPane").show( "slide", {direction: "right" }, 20000 );
	}
	
	
	//action tool bar creation.
	function getActionToolbar(commandId){
		'use strict';
		// for Save and Cancel.
		var footerDiv = $("<div/>");
		footerDiv.attr("id","slideInFooter");
		footerDiv.attr("align","right");
		
		var saveButton = $("<button/>");
		saveButton.attr("id",commandId);
		saveButton.attr("type","button");
		saveButton.attr("class","btn btn-default");
		saveButton.text(POA_EDIT_LABELS['emxCommonButton.Save']);
		
		var closeButton = $("<button/>");
		closeButton.attr("id","closeWindow");
		closeButton.attr("type","button");
		closeButton.attr("onclick","closeSlideInWindow()");
		closeButton.attr("class","btn btn-default");
		closeButton.text(POA_EDIT_LABELS['emxCommonButton.Cancel']);
		
		footerDiv.append(saveButton);
		footerDiv.append(closeButton);
		return footerDiv;
	};	
	
	//Creation of slidein content table
	function createSlideInContentTable(languageUIInfoJSONArr,header){
		'use strict';
		// create header row
		var slideInContentTable = $("<table/>");
		slideInContentTable.attr("id","slideInContentTable");
		var headerRow = $("<tr/>");
		headerRow.attr("class","slideInTableHeader");
		var headerCell = $("<td/>");
		headerCell.text(header).css("padding","10px");
		headerRow.append(headerCell);
		
		//create content row
		var modifyAssemblyContentRow = $("<tr/>");
		modifyAssemblyContentRow.attr("id","modifyAssemblyContentRow");
		var modifyAssemblyContentCell = $("<td/>");
		modifyAssemblyContentCell.attr("id","modifyAssemblyContentCell");
		var modifyAssemblyContentDiv = $("<div/>");
		modifyAssemblyContentDiv.attr("id","modifyAssemblyContentDiv");
		modifyAssemblyContentCell.append(modifyAssemblyContentDiv);
		modifyAssemblyContentRow.append(modifyAssemblyContentCell);
		customEditUtil.fillElements(modifyAssemblyContentDiv,languageUIInfoJSONArr);
		//append rows to table
		slideInContentTable.append(headerRow);
		slideInContentTable.append(modifyAssemblyContentRow);
		slideInContentTable.append(modifyAssemblyContentRow);
		
		return slideInContentTable;
	}
	//wx7 - handler for select/deselect all languages in slidein
	ToggleLanguagesSelection = function(){
		'use strict';
		var state = this.checked;
		$(':checkbox.languageCheckBox').each(function() {
			$(this).prop("indeterminate",false);
			this.checked = state;                        
		});
		return false;
	};
	
	//wx7 - handler for managing select/deselect of languages
	LanguageSelectionChangedHandler = function (){
		'use strict';
		var allCBLength = $(':checkbox.languageCheckBox').length;
		var selectedCBLen =  $(':checkbox:checked.languageCheckBox').length;
		var partialCBLen = 0;
		$(':checkbox.languageCheckBox').each(function(){
			if($(this).prop("indeterminate"))
				partialCBLen++;
		});
		if(selectedCBLen == 0 && partialCBLen == 0){
			$( "#toggleLanguages" ).prop("indeterminate",false);
			$( "#toggleLanguages" ).prop("checked",false);
		}
		else if(allCBLength == selectedCBLen){
			$( "#toggleLanguages" ).prop("indeterminate",false);
			$( "#toggleLanguages" ).prop("checked",true);
		}else{
			$( "#toggleLanguages" ).prop("indeterminate",true);
		}
		return false;
	};
	
	
	//Get Common NON Assembly languages
	function getCommonNonAssemblyElementLanguage(selPOALanguages){
		'use strict';
		//POA doesnt have any langauges then return emtpy string.
		if(selPOALanguages && selPOALanguages == "")
			return "";
		
		//LC doesnt have any langauges then return all POAs languages.
		//If cell doesnt have language then return from there.
		var selectedItemArray =$("td.success");
		var allSelectedCellLangIds="";
		for(var selectedLangIndex=0; selectedLangIndex < selectedItemArray.length;selectedLangIndex ++ ){
			var selLangId = $(selectedItemArray[selectedLangIndex]).attr("lang_ids");
			if(typeof selLangId === "undefined")
				continue;
			allSelectedCellLangIds=allSelectedCellLangIds+selLangId;
		}
		
		allSelectedCellLangIds = $.trim(allSelectedCellLangIds);
		//If cell doesnt have any langauges then return all POAs languages as unused languages
		if(allSelectedCellLangIds == "")
			return selPOALanguages;
		
		var jsonCommonNotUsedLanguages = Array();
		//Check all poa languages present in selected cells if not present then add as unused languages. 
		for(var eachPOALangIndex=0; eachPOALangIndex < selPOALanguages.length; eachPOALangIndex++ ){
			var poaLanguage = selPOALanguages[eachPOALangIndex];
				if( allSelectedCellLangIds.indexOf(poaLanguage.id) < 0 )
			 jsonCommonNotUsedLanguages.push(poaLanguage);
			}
		return jsonCommonNotUsedLanguages;
	}
	
	//Get Common Assembly elements languages for selected cells
	function getCommonAssemblyElementLanguage(){
		'use strict';
		return getCommonLanguages($("td.success"));
	}
	//Get Common languages for given dom element array
	function getCommonLanguages(selectedItemArray){
		'use strict';
		var jsonCommonLanguagesInfo = Array();
		//If cell doesnt have language then return from there.
		if(typeof $(selectedItemArray[0]).attr("lang_ids") === "undefined")
			return "";
		var langIdsFrist = $(selectedItemArray[0]).attr("lang_ids");
		var langNamesFrist= $(selectedItemArray[0]).attr("lang_names");
		//For inline copy "[]" need to replace.					
		if(langIdsFrist.indexOf('[') != -1){
			langIdsFrist = langIdsFrist.replace("[","").replace("]","");
			langNamesFrist=langNamesFrist.replace("[","").replace("]","");
		}
		langIdsFrist = langIdsFrist.split(',');
		langNamesFrist= langNamesFrist.split(',');

		for(var eachLangIndex=0; eachLangIndex < langIdsFrist.length; eachLangIndex++ ){
			var languageId = $.trim(langIdsFrist[eachLangIndex]);
			var isCommon=true;
			//Verify in all selected tds
			for(var selectedLangIndex=0; selectedLangIndex < selectedItemArray.length;selectedLangIndex ++ ){
					var selLangId = $(selectedItemArray[selectedLangIndex]).attr("lang_ids");
					if(typeof selLangId === "undefined" || selLangId == "")
						return "";
					if(selLangId.indexOf(languageId) < 0 ){
						isCommon=false;
						break;
					}
				}
			//If present in all selected tds
			if(isCommon){
				//Create JSON string [{name,id}]
			 var langInfo= {name: $.trim(langNamesFrist[eachLangIndex]),id: $.trim(langIdsFrist[eachLangIndex])};
			 jsonCommonLanguagesInfo.push(langInfo);
				}
			
		}
		return jsonCommonLanguagesInfo;
	}
	//Get Common POA languages for selected cells
	function getCommonPOALanguage(){
		'use strict';
		var uniquePOAIds=Array();	
						
		$("td.success").each(function (){
			var poaId = $(this).attr("poa_id");
			if(uniquePOAIds.indexOf("th[id='"+poaId+"']") < 0)
				uniquePOAIds.push("th[id='"+poaId+"']");
		});
		
		return getCommonLanguages(uniquePOAIds);
	}
	
	renderUIAfterLCRevisionChange = function (selectedCells,cellSelector) {
		var jsonMC_POA_DataMatrix = editInstance.getUpdatedUIInfo(selectedCells);  
		var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
		$(cellSelector)
				.each(
						function() {
							var copyId = $(this).attr("mc_id");
							var poaId = $(this).attr("poa_id");
							
								if(sequenceData[poaId])
									delete sequenceData[poaId][copyId];
								var isGraphic = $(this).attr("isGraphic");
								var isGraphicBool = (isGraphic == "true"); 
								var isInline = $(this).attr("isInline");
								var isInlineBool= (isInline == "true");
								var allPOAsDataforEachMC = jsonMC_POA_DataMatrix[copyId];
								
								if (allPOAsDataforEachMC && allPOAsDataforEachMC.hasOwnProperty(poaId))
								{
									var localCopyInfo = allPOAsDataforEachMC[poaId];
									$(this).children().each(function(){
										$(this).remove();
									});
									editInstance.addMCA_POACell(isGraphicBool, copyId, poaId, localCopyInfo, $(this),isInlineBool);
									editCopyElementSequenceNumber.validateSequenceNumber(poaId);
								}
						});
		editInstance.addOrRemoveEmptyCellColor();
		updateSequenceNumberChangedFlag();
	}
	
})(jQuery);
