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

 /* Starting point  */
 var isLoadedFromXML = false;
 var isMappedElementsLoaded = false;
 var isAssemblyElementsLoaded = false;
 var isLoggedIn = false;
 var isEditMode = false;
 var autoAddMarkersGVar = false;
 var actualTextAreaName = "";
 var globalLanguageSequenceMap = {};
 var selectionSequenceArray = [];
 var bContentWrapped = false;
 var baseCopyTextBySequence = {};
 var baseCopySequenceValue;
 var isBaseCopyAvaiable = false;
 var linkInfo = {}; 
 var flag = true;
 var renderfunc = false;
 var MULTIMAP_PANEL_LABELS   = [];

 $(document).ready(function () {	  
     isLoggedIn = false;    	
	// Fetching the Labels
	 $.ajax({
		 url: "../resources/awl/connector/o3dconnect/getMultiMapLabels",
		 success: function (data) {
			 MULTIMAP_PANEL_LABELS = $.parseJSON(data);
			 assignLabelTranslations();
		 }
	 });
	loadGS1Types();
	renderPreviewPanel();
	mappedElementsArray = [];

    let loadQObjectPromise = getPromiseWithWindowQSetUp("multimaphelper");
     // We define what to do when the promise is resolved with the then() call, and what to do when the promise is rejected with the catch() call
    loadQObjectPromise.then(
         function (val) {
			 getAndSetPrerequisites(function(mode){
			 isEditMode = mode;


			 Q.getArtworkAssemblyData(function (assemblyData) {
			 	if (assemblyData != "" && assemblyData != undefined)
			 	{ 
			 		appendLanguageinPanel($.parseJSON(assemblyData));
			 	}
			 });
			
             //Fetch all the data required for loading the multimap panel data
			 if(isEditMode){
				Q.getMapppedArtData(function (mappedData) {
                    linkInfo = $.parseJSON(mappedData)["linkInfo"];
                    mappedData = $.parseJSON(mappedData)["sequenceInfo"];
                    if (mappedData != "" && mappedData != undefined) {
                        appendArtAssembly(mappedData, markEmptyContentCells);
                        isMappedElementsLoaded = true;
						renderPreviewPanel();
					}
                
				});
				
				

				Q.getArtworkAssemblyData(function (assemblyData) {
					if (assemblyData != "" && assemblyData != undefined)
					{ 		
				
						Q.getBaseCopySeqeunce(function(sequenceValue) {
							baseCopySequenceValue = sequenceValue;
							if(sequenceValue > 0)
								isBaseCopyAvaiable = true;
							else
								isBaseCopyAvaiable = false;
							
							setTimeout(function(){
								renderfunc = true;              //added as fix for either CA-1404 or CA-1405 or CA-1407
								appendArtworkAssemblyElements($.parseJSON(assemblyData));
								renderfunc = false;             //added as fix for either CA-1404 or CA-1405 or CA-1407
								isAssemblyElementsLoaded = true;
								updatePremapElementsToAssembly();
								objectData = $.parseJSON(assemblyData);
							});
						});
				
						//This is to Address the Structured Element appearing twice.
						
					}
				});
             } else {
                 //auto text area
                 Q.getAutoTextArea(function (autoTextAreaName) {
                     actualTextAreaName = autoTextAreaName;
                     $('#textFrameName').val(autoTextAreaName);
                 });

				 var assyData;
				 Q.getArtworkAssemblyData(function (assemblyData) {
					if (assemblyData != "" && assemblyData != undefined)
					{ 		
						assyData = assemblyData;
						//This is to Address the Structured Element appearing twice.
						setTimeout(function(){
							appendArtworkAssemblyElements($.parseJSON(assemblyData));
							isAssemblyElementsLoaded = true;
							updatePremapElementsToAssembly();
							objectData = $.parseJSON(assemblyData);
						});
					}
				});
				
				Q.getSelectedElementsMap(function (mappedData) {
					linkInfo = $.parseJSON(mappedData)["linkInfo"]
					if (mappedData != "" && mappedData != undefined){
						appendArtAssemblyInNonEditMode(mappedData, $.parseJSON(assyData), autoAddMarkersGVar, markEmptyContentCells);  // IR-670380-3DEXPERIENCER2019x
						isMappedElementsLoaded = true;
						setTimeout(function(){
						renderPreviewPanel();
						}, 10);
					}
                
				});
				
				Q.getBaseCopySeqeunce(function(sequenceValue) {
					baseCopySequenceValue = sequenceValue;
					if(sequenceValue > 0)
						isBaseCopyAvaiable = true;
					else
						isBaseCopyAvaiable = false;
				});
				 
			 }

             Q.getPOAName(function(poaName){
				 if(poaName.indexOf(".xml")!= -1){
					 $("#refreshElements").addClass("disabled-commands");
					 isLoadedFromXML = true;
				 }
                 currentPOAName = poaName;
             });

             Q.getMappedElemetsList(function (mappedElementsList) {
                 if (mappedElementsList != "" && mappedElementsList != undefined) {
                     mappedElementsArray = mappedElementsList.split(",");
                     $.each(mappedElementsArray, function (i) {
                         mappedElementsArray[i] = mappedElementsArray[i].replace(/\|/g, "_");
                     });
                 }
             });

             Q.getMultiMappedElemetNamesList(function (txtArName) {
                 textAreaName = txtArName;
             });

             /* Used to load the Artwork Assembly Panel for manual debug!   */
             /* loadAAPanel(); */
             renderCurrentContentPanel();

			 $("#autoAddMarkersCheckboxLabel").click(handleAutoAddMarkersCheckBox);
             $("#mappedElementsSelectAllCheckbox").click(mapSelectAllCheckbox);
             $("#AssemblySelectAllCheckbox").click(mapSelectAllCheckbox);
             $(document).on('click', '.checkboxIcon:not(#autoAddMarkersCheckboxLabel)', singleCheckboxClickHandler);
             $("#mapFilter").on("input", filterMappedElementsTable);
             $("#ArtworkAssemblyFilter").on("input", filteArtworkAssemblyTable);
             $("#premapFilter").on("input", filterPremapPanel);
             $(window).resize(resizeHandler);
             updatePremapElementsToAssembly();   // Can we comment this? to remove excessive calls to same function?
             resizeHandler();
			 $(document.body).on('input', '.filter', multimapFilterRows);
             });
         });

     loadQObjectPromise.catch(
         // Log the rejection reason
         (reason) => {
             console.log('Handle rejected promise (' + reason + ') here.');
      });
	  
     $('#hideMappedElements').click(function () {
            flag = !flag;
            hideMappedElements(event, true);
     });

     $("#mappedElementsTableBody").on('blur', '.copyTextContent', {}, function (e) {
         renderPreviewPanel();
     });

     $('#defaultMarkerValue').keydown(function (e) {
         setTimeout(function () {
             if (e.keyCode == 13 && e.shiftKey === true) {
                 let currentInput = $("#defaultMarkerValue");
                 let v = currentInput.val();
                 let cursorPos = currentInput.prop('selectionStart');
                 let textBefore = v.substring(0, cursorPos - 1);
                 let textAfter = v.substring(cursorPos, v.length);
                 currentInput.val(textBefore + '\u0003' + textAfter);
             }
         });
     });
 });
 
 /* Function to get Prereq preferences from Cpp side and updating UI
	To be called in Callback format only. First get this prereq data, update UI and then do the rest via callback
 */
 function getAndSetPrerequisites(callback){
	 
	 Q.isEditMode(function (mode) {  // IR-670380-3DEXPERIENCER2019x
        var EditMode = mode;
	 
		// Update login variable first
		Q.isLoggedIn(function (loginVal) {
			isLoggedIn = loginVal;
		});
		
		//Update the default marker value
		Q.getDefaultMarkerValue(function(defaultMarkerValue){
			$("#defaultMarkerValue").val(defaultMarkerValue);
		});
		
		Q.getAutoAddMarkersFlag(function(autoAddMarkers){
			autoAddMarkersGVar = autoAddMarkers;
			checkOrUncheckAutoAddMarkersCheckBox(autoAddMarkers);
		});
			
		callback(EditMode);
	});
 }

 /* Used to load the Artwork Assembly Panel for manual debug!   */
 function loadAAPanel() {
     $.getJSON("../awl/data_backup.json", function (data) {
         // appendGS1Types(gs1DataObject) ;
         appendArtworkAssemblyElements(data);
     });
 }
 
 function handleAutoAddMarkersCheckBox(){
	 // Handle input and label
	$(event.target).toggleClass("selected"); // new Icon and class updated
    var hasSelectedClass = $(event.target).hasClass("selected"); // check if class is present or not

    if (hasSelectedClass) {
        $(event.target).siblings("input").prop("checked", "checked");
		autoAddMarkersGVar = true;
    } else {
        $(event.target).siblings("input").prop("checked", "");
		autoAddMarkersGVar = false;
    }
 }
 
 function checkOrUncheckAutoAddMarkersCheckBox(autoAddMarkers){
	 var autoAddMarkersCheckboxLabel = $("#autoAddMarkersCheckboxLabel");
	 if(autoAddMarkers){
		 if(!$(autoAddMarkersCheckboxLabel).hasClass("selected")){
			 $(autoAddMarkersCheckboxLabel).addClass("selected");
			 $(autoAddMarkersCheckboxLabel).siblings("input").prop("checked", "checked");
		 }
			 
	 } else {
		 if($(autoAddMarkersCheckboxLabel).hasClass("selected")){
			 $(autoAddMarkersCheckboxLabel).removeClass("selected");
			 $(autoAddMarkersCheckboxLabel).siblings("input").prop("checked", "");
		 }
	 }
	 autoAddMarkersGVar = autoAddMarkers;
 }

 function togglePOADetails(event) { // Expand and Collapse Logic for PreviewPanel and CandidatePanel/AssemblyPanel
     var selection = event.target;
     if (selection.id === "collapseAvailableData" || selection.id === "expandAvailableData") {
         if (selection.id === "collapseAvailableData") {
             $('#availableElementsContainer').css("height", "2%");
             $('#previewContainer').css("height", "25%");
             $("#previewElementsContainer").css("height", "60%");
             $("#currentContentPreviewContainer").css("height", "25%");
             $("#currentContentPreviewElementsContainer").css("height", "60%");
             $("#collapseAvailableData").hide();
             $("#expandAvailableData").show();
         } else if (selection.id === "expandAvailableData") {
             $("#expandAvailableData").hide();
             $("#collapseAvailableData").show();
             if ($("#collapsePreview:visible").length > 0) {
                 $('#availableElementsContainer').css("height", "33%");
                 $('#previewContainer').css("height", "");
                 $("#previewElementsContainer").css("height", "");
             } else if ($("#expandPreview:visible").length > 0) {
                 $('#availableElementsContainer').css("height", "53%");
                 $('#previewContainer').css("height", "22px");
                 $("#previewElementsContainer").css("height", "");
             }

             if ($('#currentDataCollapsePreview:visible').length > 0) {
                 $("#currentContentPreviewContainer").css("height", "");
                 $("#currentContentPreviewElementsContainer").css("height", "");
             } else if ($('#currentDataExpandPreview:visible').length > 0) {
                 $("#currentContentPreviewContainer").css("height", "22px");
                 $("#currentContentPreviewElementsContainer").css("height", "");
             }

         }
     } else if (selection.id === "collapsePreview" || selection.id === "expandPreview") {
         if (selection.id === "collapsePreview") {
             $('#previewContainer').css("height", "22px");
             $('#availableElementsContainer').css("height", "53%");
             $('#assemblyElementsTableContainer').css("height", "64%");
             $(".assemblyElementsTableBody").css("height", "89%");
             $("#collapsePreview").hide();
             $("#expandPreview").show();
         } else if (selection.id === "expandPreview") {
             $("#expandPreview").hide();
             $("#collapsePreview").show();
             if ($("#collapseAvailableData:visible").length > 0) {
                 $('#previewContainer').css("height", "14%");
                 $('#availableElementsContainer').css("height", "33%");
                 $('#assemblyElementsTableContainer').css("height", "");
                 $(".assemblyElementsTableBody").css("height", "");
             } else if ($("#expandAvailableData:visible").length > 0) {
                 $('#previewContainer').css("height", "25%");
                 $('#availableElementsContainer').css("height", "2%");
                 $('#assemblyElementsTableContainer').css("height", "");
                 $(".assemblyElementsTableBody").css("height", "");
             }
         }
     } else if (selection.id === "currentDataCollapsePreview" || selection.id === "currentDataExpandPreview") {
         if (selection.id === "currentDataCollapsePreview") {
             $('#currentContentPreviewContainer').css({
                 "height": "22px",
                 "overflow": "hidden"
             });
             $('#currentDataCollapsePreview').hide();
             $("#currentDataExpandPreview").show();
         } else if (selection.id === "currentDataExpandPreview") {
             $('#currentContentPreviewContainer').css({
                 "height": "",
                 "overflow": "auto"
             });
             $("#currentDataExpandPreview").hide();
             $('#currentDataCollapsePreview').show();

         }
     }
     if ($("#expandPreview:visible").length > 0) { // To avoid scrolling when div is collapsed.
         $('#previewContainer').css("overflow", "hidden");
     } else {
         $('#previewContainer').css("overflow", "auto");
     }
 }

 function alignAssemblyTable(action) {
     if (action === "expand") {
         $('#assemblyElementsTable tr th,#assemblyElementsTable tr td').each(function () {
             if($(this).css("max-width")){
				 var maxWidth = $(this).css("max-width");
				 $(this).css("width", maxWidth);
			 } else
				 $(this).css("width", "250px");
         });
     } else if (action === "collapse") {
         $('#assemblyElementsTable tr th,#assemblyElementsTable tr td').each(function () {
             $(this).css("width", "");
         });
     }
	 
//	 $('#assemblyElementsTable>tbody>tr>td').each(function(){
//		 var index = $(this).index();
//		 var tHWidth = $('#assemblyElementsTable>thead').find('th').eq(index).width();	
//		 $(this).css("width", tHWidth);
//		 //$(this).css("max-width", tHWidth+2);
//		 //$(this).css("min-width", tHWidth);
//	 });
 }

 function toggleAvailableElements(event) {
     var selection = event.target;
     var premapComponents = $('#premapPanelHeading,#premapToolbar,#premapContent,#showHideFilterImage_P,#clearAllFiltersButton_P');
     var assemblyComponents = $('#assemblyElementsTableContainer,#assemblyElementPreview,#assemblyElementNotes,#artworkAssemblyHeader,#AssemblyFilter');

     if ($(selection).hasClass("collapsePremap") || $(selection).hasClass("expandPremap")) {
         if ($(selection).hasClass("collapsePremap")) {
             $(selection).removeClass('collapsePremap'); // Changing Class to change Icon
             $(selection).addClass("expandPremap");
             $('#premapElementsContainer').css({
                 'width': '4%'
             });
             $('#assemblyElementsContainer').css({
                 'width': '95%'
             });
			 $('#assemblyElementPreview').css({
				'margin-top': '10px'
			 });			 // Providing the new Width
             alignAssemblyTable("expand");
             $('#collapseAssemblyPanel').removeClass("expandAssembly").addClass("collapseAssembly");
             premapComponents.css({
                 display: "none"
             });
             assemblyComponents.css({
                 display: ''
             });
			 var TALabelTag = $("<div>").attr({class:"verticalTALabel"}).text("Type Assignment")
			 .css("width", $('#premapElementsContainer').width()-10)
			 .css("height", $('#premapElementsContainer').height()-80)
			 .css({"writing-mode":"vertical-lr", "transform":"rotate(180deg)", "position":"relative", "top":"40px", "font-size":"17px",
			 "font-weight":"bold"});
             $('#premapElementsContainer').append(TALabelTag);
             assignLabelTranslations();
         } else if ($(selection).hasClass('expandPremap')) {
             $(selection).removeClass('expandPremap');
             $(selection).addClass("collapsePremap");
			 $('.verticalTALabel').remove();
             if ($('.collapseAssembly:visible').length > 0) {
                 $('#premapElementsContainer').css({
                     'width': '33%'
                 });
                 $('#assemblyElementsContainer').css({
                     'width': '67%'
                 });
				 $('#assemblyElementPreview').css({
					'margin-top': '17px'
                 });
                 premapComponents.css({
                     display: ""
                 });
				 $('#collapsePremapPanel,#showHideFilterImage_P,#clearAllFiltersButton_P').css("display","inline-block");
				 if($('#premapFilter').val() == "")
					 $('#clearAllFiltersButton_P').css('display', "none");
                 alignAssemblyTable("collapse");
             }
         }
     }

     if ($(selection).hasClass("collapseAssembly") || $(selection).hasClass("expandAssembly")) {
         if ($(selection).hasClass("collapseAssembly")) {
             $(selection).removeClass('collapseAssembly');
             $(selection).addClass("expandAssembly");
             $('#premapElementsContainer').css({
                 'width': '94%'
             });
             $('#collapsePremapPanel').removeClass("expandPremap").addClass("collapsePremap");
             $('#assemblyElementsContainer').css({
                 'width': '4%'
             });
             premapComponents.css({
                 display: ""
             });
             assemblyComponents.css({
                 display: 'none'
             });
			 $('#collapsePremapPanel,#showHideFilterImage_P,#clearAllFiltersButton_P').css("display","inline-block");
			 if($('#premapFilter').val() == "")
				$('#clearAllFiltersButton_P').css('display', "none");
			 $('.verticalTALabel').remove();
         } else if ($(selection).hasClass('expandAssembly')) {
             $(selection).removeClass('expandAssembly');
             $(selection).addClass("collapseAssembly");
             if ($('.collapsePremap:visible').length > 0) {
                 $('#premapElementsContainer').css({
                     'width': '33%'
                 });
                 $('#assemblyElementsContainer').css({
                     'width': '67%'
                 });
                 assemblyComponents.css({
                     display: ''
                 });
             }
         }
     }
	 resizeTables();
 }

 function toggleCopyElements() {
     var selection = event.target;
     if ($(selection).hasClass('expandCopyGrid')) {
         $(selection).removeClass('expandCopyGrid').addClass('collapseCopyGrid');
         $('#mappedElementsContainer').css({
             height: '65%'
         });
         $("#mappedElementsTableBody").css('height', "96%");
     } else if ($(selection).hasClass('collapseCopyGrid')) {
         $(selection).removeClass('collapseCopyGrid').addClass('expandCopyGrid');
         $('#mappedElementsContainer').css({
             height: '26%'
         });
     }
 }

 /*
     UI Data Matrix class factory
  */
 var DataMatrixElement = function (opts) {
     var obj = {
         source: "",
         //typeicon: "",
         elementType: "",
         instanceSequence: "0",
         language: "",
         localeSequence: 0,
         content: "",
         plaformcontent: "",
         state: "",
         contentRTE: ""
     };
     var instance = {};
     for (var attr in obj)
         instance[attr] = obj[attr];
     for (var attr in opts)
         instance[attr] = opts[attr];
     return instance;
 };
 
 // Function to handle enabling and disabling move commands
 function enableDisableMoveCommands(){
	var allCheckBoxesInTBody = $("#mappedElementsTableBody td.checkbox>input[type='checkbox']");
	
	// First checkbox
	if($(allCheckBoxesInTBody).first().prop("checked") == true){
		if(!$("#moveUp").hasClass("disabled-commands"))
			$("#moveUp").addClass("disabled-commands");
	}else{
		if($("#moveUp").hasClass("disabled-commands"))
			$("#moveUp").removeClass("disabled-commands");
	}
	
	// Last checkbox
	if($(allCheckBoxesInTBody).last().prop("checked") == true){
		if(!$("#moveDown").hasClass("disabled-commands"))
			$("#moveDown").addClass("disabled-commands");
	}else{
		if($("#moveDown").hasClass("disabled-commands"))
			$("#moveDown").removeClass("disabled-commands");
	}
 }

 function updateArtworkAssemblyContent() {
     // To Fetch the 3DExperience Content value
	latest3DExpContent = {};
	updatePremapElementsToAssembly();
	Q.isLoggedIn(function (loginVal) {
    	if(!loginVal){
    		//IR-581111 - Uniform alert box
			Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.NotInOffline']);
    		return;
    	}
    	Q.getPOAName(function(poaName){
			if(poaName.indexOf(".xml")!= -1)
			{
				Q.getArtworkAssemblyData(function (assemblyData) {
					 if (assemblyData != "" && assemblyData != undefined)
						update3DExpContent($.parseJSON(assemblyData).artworkElements, "gs1Key", "contentRTE");
				 });
				 return;
			}
    		$.ajax({
    			data : {
    				poaName: poaName
    			},
    			url : "../resources/awl/connector/o3dconnect/getPOAArtworkAssembly",
    			success : function(data) {
    				objectData = $.parseJSON(data);
    				isProcessing = false;
    				var returnResponse = objectData.result;
    				if (returnResponse == "failure") {
    					Q.showNotification(objectData.data);
    				} else {
    					objectData = objectData.data;
    					var assemblyInfo = objectData.artworkAssemblyInfo;
						var artAssembly = getFormattedDataForRefresh(assemblyInfo);
						
						//Potential fix for IR-648226
						// But need to form data properly before passinf to appendArtworkAssemblyElements
						
						// Update Language seq info map
						var languageSeqMap = {};
						$.each(objectData.LanguageInfo, function(indx, eachObjectInfo){
							languageSeqMap[eachObjectInfo.name] = eachObjectInfo.seq;
						});
						
						artAssembly["languageSequenceMap"] = languageSeqMap;
						updateGlobalLanguageSequenceMap(languageSeqMap);
						
						appendArtworkAssemblyElements(artAssembly);
						updatePremapElementsToAssembly();
						update3DExpContent(assemblyInfo, "gs1Type", "copyTextRTE");
    				}
    				display3DExpContent();  //To Display the 3DExperience Content value
    				renderPreviewPanel();
    			}
    		});
    	});
    });
 }
 
 function updateGlobalLanguageSequenceMap(objectData)
{
	globalLanguageSequenceMap = objectData;
}
 
 function update3DExpContent(assemblyInfo, keyString, copyTextString)
 {
	$.each(assemblyInfo,function()
	{
		if($(this).attr("artworkType") != "Structure" && $(this).attr("subSturcturedElement") != "true"){
			var typeSequenceKey = $(this).attr(keyString)+"|"+$(this).attr("instanceSequence")+"|"+$(this).attr("localeSequence");
			latest3DExpContent[typeSequenceKey] = $(this).attr(copyTextString); 
		}
		
		if(isLoadedFromXML && $(this).attr("subSturcturedElement") == "true"){
			structuredSequenceKey = $(this).attr("UniqueKey");
			latest3DExpContent[structuredSequenceKey] = $(this).attr(copyTextString);
		}
		else if($(this).attr("artworkType")=="Structure" ){
			var childElements  = $(this).attr("NutritionInfo");
				$.each(childElements,function() {
					childTypeSequenceKey = $(this).attr("UniqueKey");
					latest3DExpContent[childTypeSequenceKey] = $(this).attr(copyTextString);
				});
		}
	});
	display3DExpContent();
	renderOutOfSync();
 }
 
 /* To Display the 3DExperience Content value */
 function display3DExpContent() {
     $(".mappedElementsTableBodyRow[source=assembly]").each(function () {
         var currentKey = $(this).attr("UniqueKey");
         for (var key in latest3DExpContent) {
             if (key == currentKey) {				 
                 $(this).find(".experienceContent").html(decodeRTEText(latest3DExpContent[currentKey]));
             }
         }
     });
 }

 function assignLabelTranslations() {
     // Command Translations
     $('#addMarkerImg').attr("title", MULTIMAP_PANEL_LABELS['emxFramework.Command.AddMarker']);
     $('#addElementImg').attr('title', MULTIMAP_PANEL_LABELS["emxAWL.ToolTip.CreateArt"]);
     $('#removeElementImg').attr('title', MULTIMAP_PANEL_LABELS["emxFramework.Command.RemoveOrUnMapElement"]);
     $('#moveUpImg').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Command.MoveUp']);
     $('#moveDownImg').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Command.MoveDown']);
     $('#syncElementsImg').attr('title', MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.SyncElements']);
     $('#refreshElementsImg').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Command.Refresh']);
	 $('#massUpdateImg').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Command.UpdateMarkers']);
     $('#contentWrapSpan').attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.WrapContentAssemblyTable']);//For wrap/unwrap text of column in assembly table
     $('#hideMappedElements').attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.HideElements']);
     $('#textFrameNameContainerLabel').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.CombinedTextAreaName']);
	 $('#defaultMarkerValueLabel').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.DefaultMarkerValue']);
     $('#markupFilterLabel').text(MULTIMAP_PANEL_LABELS['emxCommonButton.Filter']);
     $('#applyButton').text(MULTIMAP_PANEL_LABELS['emxCommonButton.Save']);
	 
	 $(".clearAllFiltersButton").attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.ClearAllFilters']);
	 $(".showHideFilterImage").attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.Filter']);
	 $(".sortingImage").attr("title", "");
	 $("#revertToOriginalSortingButton").attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.RevertSorting']);
	 $("#autoAddMarkersCheckboxLabel").attr("title", MULTIMAP_PANEL_LABELS['emxFramework.Command.AutoAddMarkers']);

     //Table Column Translations
     //$('tr#mappedElementsHeaderRow>.typeIcon').text(MULTIMAP_PANEL_LABELS['emxFramework.Basic.Type']);
     $('tr#mappedElementsHeaderRow>th.elementType>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.Element']);
     //$('tr#mappedElementsHeaderRow>th.instSeq>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.InstSeq']);
     $('tr#mappedElementsHeaderRow>th.language>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxAWL.Table.Language']);
     $('tr#mappedElementsHeaderRow>th.state>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Basic.State']);
     $('tr#mappedElementsHeaderRow>th.copyTextContent>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxAWL.ResponseCompare.ArtworkFileContent']);
     $('tr#mappedElementsHeaderRow>th.experienceContent>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.3DEXPERIENCEContent']);

     //poa assembly table translations
     $('th.AsemblyTypeHeaderCell>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.Element']);
     $('th.AssemblyLanguageHeaderCell>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxAWL.Table.Language']);
     $('th.AssemblyStateHeaderCell>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Basic.State']);
     $('th.AssemblyContentHeaderCell>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxAWL.Label.Content']);
     $('th.AssemblyNotesHeaderCell>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxAWL.Label.Notes']);
     $(".verticalTALabel").text(MULTIMAP_PANEL_LABELS['emxFramework.Label.TypeAssignment']);//end

     $('#premapPanelHeading').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.TypeAssignment']);
     $('#artworkAssemblyHeader').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.POAArtworkAssembly']);
     $('#AssemblyFilterLabel').text(MULTIMAP_PANEL_LABELS['emxCommonButton.Filter']);

     $('#premapFilterSpanLabel').text(MULTIMAP_PANEL_LABELS['emxAWL.Label.CopyElementType']);

     $('.AssemblyTypeIconHeaderCell').text(MULTIMAP_PANEL_LABELS['emxFramework.Basic.Type']);
     $('.AsemblyTypeHeaderCell>th.elementType>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxAWL.Label.CopyElementType']);
     $('.AssemblyISHeaderCell>th.elementType>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.InstSeq']);
     $('.AssemblyLanguageHeaderCell>th.elementType>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxAWL.Table.Language']);
     $('.AssemblyStateHeaderCell>th.elementType>span.tableHeaderTitle').text(MULTIMAP_PANEL_LABELS['emxFramework.Basic.State']);

     $('#assemblyElementPreview').html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Preview']);
     $('#assemblyElementNotes').html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Notes']);
     $('#previewHeader').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.CombinedTextPreview']);
     $('#currentContentPreviewHeader').text(MULTIMAP_PANEL_LABELS['emxFramework.Label.SelectedTextArea']);
     $('#footerSaveButton').text(MULTIMAP_PANEL_LABELS['emxFramework.RTE.Tooltip.OK']);
     $('#footerCancelButton').text(MULTIMAP_PANEL_LABELS['emxCommonButton.Cancel']);

     $('#collapseAvailableData').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#expandAvailableData').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#collapsePreview').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#expandPreview').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#currentDataCollapsePreview').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#currentDataExpandPreview').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#collapseCopyElementsGrid').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#collapseAssemblyPanel').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     $('#collapsePremapPanel').attr('title', MULTIMAP_PANEL_LABELS['emxFramework.Label.ExpandCollapse']);
     
     $(document).tooltip();
 }


 function singleCheckboxClickHandler(event) {
     if (!$(event.target).hasClass("selectAllLabel")) {
         $(event.target).toggleClass("selected"); // new Icon and class updated
         var hasSelectedClass = $(event.target).hasClass("selected"); // check if class is present or not

         if (hasSelectedClass) {
             $(event.target).siblings("input").prop("checked", "checked");
         } else {
             $(event.target).siblings("input").prop("checked", "");
         }
         checkOrUncheckSelectAll(event);
         var tableId = $(event.target).closest('table').attr("id");
         handleSelectAllBox(tableId);
		 
		 // Disable-enable move commands
		 if(tableId == "mappedElementsTable")
			enableDisableMoveCommands();
		
		 handleSelectionSequenceArrayAndRender();
     }
 }

 function checkOrUncheckSelectAll(event) {

     var table = $(event.target).closest('table');
     var selectAllInputCheckbox = $(table).find('thead tr th input:checkbox');
     var selectAllLabelCheckbox = $(table).find('thead tr th label.checkboxIcon');
     var selectedElementsLength = $(table).find('tr td label.checkboxIcon.selected').length;
     var syncCheckboxLength = $(table).find('tr td label.checkboxIcon').length;
     $(selectAllInputCheckbox).prop("checked", syncCheckboxLength == selectedElementsLength ? true : false);
     if (syncCheckboxLength == selectedElementsLength) {
         $(selectAllLabelCheckbox).addClass('selected');
     } else {
         $(selectAllLabelCheckbox).removeClass('selected');
     }
	 
	 handleSelectionSequenceArrayAndRender();
 }
 
 // Function to maintain the selection sequence of elements
 function handleSelectionSequenceArrayAndRender(){
	var selectedElements = $(".assemblyElementsTableBody input[type=checkbox]:checked");
	var selectedElementsUniqueKeys = [];
	$(selectedElements).each(function (key, value) {
		var currentUniqueKey = $(this).closest("tr").attr("UniqueKey");
		selectedElementsUniqueKeys.push(currentUniqueKey);
		if(!selectionSequenceArray.includes(currentUniqueKey)){
			selectionSequenceArray.push(currentUniqueKey);
		}
	});
	
	for(var i = selectionSequenceArray.length -1 ; i >= 0; i--){
		if(!selectedElementsUniqueKeys.includes(selectionSequenceArray[i]))
			selectionSequenceArray.splice(i, 1);
	}
	
	renderSelectionSequence();
}

// Function to render the selection sequence numbers in UI
function renderSelectionSequence(){
	var selectedElements = $(".assemblyElementsTableBody input[type=checkbox]:checked");
	var allSelectionSequenceSpans = $("span.selectionSequenceSpan");
	
	$.each(allSelectionSequenceSpans, function(index, value){
		$(this).text("");
	});
	
	$(selectedElements).each(function (key, value) {
		var selectedElementCheckboxTD = $(this).closest("td.assemblyCheckbox");
		var currentUniqueKey = $(this).closest("tr").attr("UniqueKey");
		selectedElementCheckboxTD.find("span.selectionSequenceSpan").text(selectionSequenceArray.indexOf(currentUniqueKey)+1);
	});
}

// Function to clear the selection sequence numbers from UI
function clearSelectionSequenceNumbersFromUI(){
	var allSelectionSequenceSpans = $("span.selectionSequenceSpan");
	$.each(allSelectionSequenceSpans, function(index, value){
		$(this).text("");
	});
}
 
 function renderSerialNumbers(){
	 var allSerialNoSpans = $("span.serialNoSpan");
	 
	 $.each(allSerialNoSpans, function(index, value){
		$(this).text("");
	 });
	 
	 $("#mappedElementsTableBody>tr").each(function(index, value){
		 $(this).find('span.serialNoSpan').text(index+1 + "    ");
	 });
 }
 
 /* To handle few Divs height on window Resize */
 function resizeHandler() {
	 var isFilterActivated = $("#mappedElementsHeaderRow > th.elementType > span.filterSpan").css("display") == "block" ? true : false;
     var copyElementsGridHeight = $("#mappedElementsContainer").height();
	 var removeHeight = 35 + (isFilterActivated? 14 : 0 );
     var newGridHeight = copyElementsGridHeight -  removeHeight;
     if (newGridHeight > 34) {
         $("#mappedElementsTableBody").css('height', newGridHeight + "px");
     }
	 var isFilterActivatedForAssy = $('#assemblyElementsTable > thead > tr > th.AsemblyTypeHeaderCell > span.filterSpan').css('display') == "block" ? true : false;
     var assemblyElementsHeight = $('#assemblyElementsTableContainer').height();
	 var assyRemoveHeight =  28 + (isFilterActivatedForAssy? 20 : 0 );
     var newAssemblyHeight = assemblyElementsHeight - assyRemoveHeight ;
     if (newAssemblyHeight > 25) {
         $(".assemblyElementsTableBody").css('height', newAssemblyHeight + "px");
     }
	 resizeTables();
 }
 
 function resizeTables(){
	 // Handle Working table
	 //$('#mappedElementsHeaderRow').css("width", "100%");
	 //$('.checkbox').css('width', "5%");
	 //$('.elementType').css('width', "15%");
//	 $('.instSeq').css('width', "7%");
//	 $('.language').css('width', "13%");
//	 $('.state').css('width', "12%");
//	 $('.experienceContent').css('width', "25%");
//	 $('.copyTextContent').css('width', "25%");
//	 $('.syncIndicator').css('width', "5%");
	 
	 // Handle ArtworkElements table
//	 $('#assemblyElementsTable').css("width", "100%");
//	 $('#assemblyElementsTable > thead').css("width", "100%");
//	 $('#assemblyElementsTable > thead > tr').css("width", "100%");
//	 $('.AssemblyInputHeaderCell').css({'width' : '5%', 'min-width' : '', 'max-width' : ''});
//	 $('.AsemblyTypeHeaderCell').css({'width' : '15%', 'min-width' : '', 'max-width' : ''});
//	 $('.AssemblyISHeaderCell').css({'width' : '7%', 'min-width' : '', 'max-width' : ''});
//	 $('.AssemblyLanguageHeaderCell').css({'width' : '15%', 'min-width' : '', 'max-width' : ''});
//	 $('.AssemblyContentHeaderCell').css({'width' : '35%', 'min-width' : '', 'max-width' : ''});
//	 $('.AssemblyStateHeaderCell').css({'width' : '15%', 'min-width' : '', 'max-width' : ''});
//	 $('.AssemblyNotesHeaderCell').css({'width' : '15%', 'min-width' : '', 'max-width' : ''});
//	 $('.AssemblyLinkHeaderCell').css({'width' : '2%', 'min-width' : '', 'max-width' : ''});
//	 $('#assemblyElementsTable>tbody>tr>td').each(function(){
//		 var index = $(this).index();
//		 var tHWidth = $('#assemblyElementsTable>thead').find('th').eq(index).width();	
//		 //console.log("width"+tHWidth);
//		 $(this).css("width", tHWidth+1);
//		 //$(this).css("max-width", tHWidth+2);
//		 //$(this).css("min-width", tHWidth);
//	 });
	 
 }

 /* Copy Text Content Edit handler*/
 function editCopyTextContentHandler() {
	 //return;	 
     $('td.copyTextContent').keyup(function(){
		 if($(this).html() == "<br>")
			 $(this).html("");
		 if($(this).html() == "")
			$(this).css("background-color", "#6d6d6d");   // To highlight cells with empty content
		 else
			$(this).css("background-color", "#333333");

	 });
	 validateAndRenderPreviewPanel();

 }
 
 // Function to mark(change background color) of empty content cells
 function markEmptyContentCells(){
	 $('td.copyTextContent', '#mappedElementsTable').each(function(){
		  if($(this).html() == "")
			$(this).css("background-color", "#6d6d6d");
		 else
			$(this).css("background-color", "#333333");
	 });
 }

 /*Validating if angle brackets are present and rendering preview*/
 function validateAndRenderPreviewPanel() {
     renderPreviewPanel();
 }

 function renderOutOfSync() {
     if (isLoggedIn) {
		 $("#mappedElementsTableBody>tr[source=assembly]").each(function () {

			 var currentContent = $(this).find('.copyTextContent').html();
			 //remove style attributes
			 var styleAttrRegex = new RegExp(/ style="[^"]*"/);
			 while (styleAttrRegex.test(currentContent))
				 currentContent = currentContent.replace(/ style="[^"]*"/, "");
			 //remove span tags from LRT text
			 if ((currentContent.indexOf('<span>') != 0) && (currentContent.indexOf('<span dir=\"LTR\">') != 0)) {
				 currentContent = currentContent.replace("<span>", "");
				 currentContent = currentContent.replace("</span>", "");
			 }
			 var platformContent = $(this).find('.experienceContent').html();
			 var diffContent = "";
			 var that = this;

			 //adding div tag if missing
			 if (currentContent.includes("</span>")) {
				 if (!currentContent.includes("<div dir=\"rtl\">"))
					 currentContent = "<div dir=\"rtl\">" + currentContent + "</div>";
			 }
			 if (platformContent.includes("</span>")) {
				 if (!platformContent.includes("<div dir=\"rtl\">"))
					 platformContent = "<div dir=\"rtl\">" + platformContent + "</div>";
			 }

            Q.getJSONOfTagsFromRTEContent(currentContent, function (jsonTags) {
                var jsonAI = jsonTags;
                Q.getJSONOfTagsFromRTEContent(platformContent, function (jsonTags) {
                    var jsonDb = jsonTags;
					             jsonAI = jsonAI.replace(/&amp;/g,"&");
					             jsonDb = jsonDb.replace(/&amp;/g,"&");
					             jsonDb = jsonDb.replace(/&lt;/g,"<");
					             jsonDb = jsonDb.replace(/&gt;/g,">");
                                 jsonAI = jsonAI.replace(/&lt;/g,"<");
                                 jsonAI = jsonAI.replace(/&gt;/g,">");
					 var result = getRoundTripCompareText(JSON.parse(jsonDb), JSON.parse(jsonAI));
					 //addition for IR-1038955 started
					 existingData_new = JSON.parse(jsonDb);
					 modifiedData_new = JSON.parse(jsonAI);
					 var existingPlainText = getPlainText(existingData_new);
					 var modifiedPlainText = getPlainText(modifiedData_new);
					 if (existingPlainText == modifiedPlainText) { //addition for IR-1038955for comparison of platform & textframe content(only text without RTE tags)
						 Q.compareRTEMap(currentContent, platformContent, function (res) { //addition for IR-1038955for comparison of platform & textframe content(text with RTE tags)
							 if (res) { //addition for IR-1038955 if content & RTE tags info is same then show icon accordingly
								 isContentSame = true;
								 result = { "isContentSame": isContentSame, "compareResult": "" };
								 var isInSync = result['isContentSame'];
								 diffContent = result['compareResult'];
								 if (isInSync) {
									 $(that).find('.syncIndicator').removeClass('showSyncIcon');
									 $(that).find('.copyTextContent').attr('diffContent', "Preview :");
								 }
								 else {
									 $(that).find('.syncIndicator').addClass('showSyncIcon');
									 $(that).find('.copyTextContent').attr('diffContent', diffContent);
								 }

								 $(".showSyncIcon").hover(function () {
									 $('#assemblyElementPreview').html($(this).siblings('.copyTextContent').attr('diffContent'));
								 });
								 $(".showSyncIcon").mouseleave(function () {
									 if (!isLoggedIn) {
										 $('#assemblyElementPreview').html("Preview :");
									 } else {
										 $('#assemblyElementPreview').html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Preview']);
									 }
								 });
							 }
							 else {//addition for IR-1038955 if content is same but RTE tags info is different then show out of sync icon
								 var isInSync = result['isContentSame'];
								 diffContent = result['compareResult'];
								 if (isInSync) {
									 $(that).find('.syncIndicator').removeClass('showSyncIcon');
									 $(that).find('.copyTextContent').attr('diffContent', "Preview :");
								 }
								 else {
									 $(that).find('.syncIndicator').addClass('showSyncIcon');
									 $(that).find('.copyTextContent').attr('diffContent', diffContent);
								 }

								 $(".showSyncIcon").hover(function () {
									 $('#assemblyElementPreview').html($(this).siblings('.copyTextContent').attr('diffContent'));
								 });
								 $(".showSyncIcon").mouseleave(function () {
									 if (!isLoggedIn) {
										 $('#assemblyElementPreview').html("Preview :");
									 } else {
										 $('#assemblyElementPreview').html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Preview']);
									 }
								 });
							 }
						 });
					 }
					 else {//addition for IR-1038955 if content is different then show out of sync icon
						 var isInSync = result['isContentSame'];
						 diffContent = result['compareResult'];
						 if (isInSync) {
							 $(that).find('.syncIndicator').removeClass('showSyncIcon');
							 $(that).find('.copyTextContent').attr('diffContent', "Preview :");
						 }
						 else {
							 $(that).find('.syncIndicator').addClass('showSyncIcon');
							 $(that).find('.copyTextContent').attr('diffContent', diffContent);
						 }

						 $(".showSyncIcon").hover(function () {
							 $('#assemblyElementPreview').html($(this).siblings('.copyTextContent').attr('diffContent'));
						 });
						 $(".showSyncIcon").mouseleave(function () {
							 if (!isLoggedIn) {
								 $('#assemblyElementPreview').html("Preview :");
							 } else {
								 $('#assemblyElementPreview').html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Preview']);
							 }
						 });
					 }
				 });
			 });
		 });
     }
}
//addition for IR-1038955 ended

/* function getRoundTripCompareText(text1, text2) {
     var dmp = new diff_match_patch();
     var differences = dmp.diff_main(text1, text2);
     var differencesHTMLText = $.parseHTML(diff_prettierHtml(differences));
     var myToolTipText = "";
     $.each(differencesHTMLText, function (indx, row) {
         myToolTipText = myToolTipText + row.outerHTML;
     });
     return myToolTipText;
 }*/


  function editCopyTextContentHandlerwithoutRendering() {
	 //return;	 
     $('td.copyTextContent').keyup(function(){
		 if($(this).html() == "<br>")
			 $(this).html("");
		 if($(this).html() == "")
			$(this).css("background-color", "#6d6d6d");   // To highlight cells with empty content
		 else
			$(this).css("background-color", "#333333");

	 });

 }
 
 
 function diff_prettierHtml(diffs) {
     var html = [];
     for (var x = 0; x < diffs.length; x++) {
         var op = diffs[x][0]; // Operation (insert, delete, equal)
         var data = diffs[x][1]; // Text of change.
         var text = data;
         var className = DIFF_EQUAL === op ? "matcingText" : DIFF_INSERT === op ? "insertedText" : "deletedText";;
         html[x] = "<span class=" + className + ">" + text + "</span>";
     }
     return html.join("");
 };

 /* To Display the Copy Text values of elements present in grid.    */
function renderPreviewPanel() {

	$("#previewElements").remove(); //to be safe just remove it and construct from scratch.
     var $preview = $("<div/>").attr({
         "id": "previewElements"
     });

     $("#mappedElementsTableBody>tr").each(function () {
		 
		var currentcontentRTE = $(this).children("td.copyTextContent")[0].innerHTML;
		 var copyTextDymanic = $(this).children("td.copyTextContent")[0];
		 //This should be fixed properly, on copy pasting the data some junk spans has been created in the tds... so proving temp fix
		 if ( $(copyTextDymanic).children('span').length > 0 ) {
			 currentcontentRTE = $.map($(copyTextDymanic), function(elem, index){
				return $(elem).text().trim();
			}).join("");
		 }				 
		
         var span = $("<span/>").attr({
             "instanceSequence": $(this).find("td.instSeq").html(),
             "localeSequence": $(this).find("td.language").attr("localeSequence"),
             "gs1Key": $(this).find("td.elementType").html(),
             "source": $(this).attr("source"),
             "contentRTE": currentcontentRTE,
             "state": $(this).find("td.state").html(),			 
             "parentInfo": $(this).attr("parentInfo"),
             "subSturcturedElement": $(this).attr("subSturcturedElement"),
             //"language": $(this).attr("language"),          //commented for IR-1012008
			 "language": $(this).find("td.language").html(),   //added for IR-1012008
             "experienceContent": $(this).children("td.experienceContent")[0].innerHTML,
             "contentJSONRTE": $(this).attr("contentJSONRTE"),
             "UniqueKey": $(this).attr('UniqueKey')
         }).append($(this).find("td.copyTextContent").html());
         $($preview).append(span);
     });
     $("#previewElementsContainer").append($preview);
     renderOutOfSync();
 }

 function renderCurrentContentPanel() {
     Q.getTextFrameContent(function (textFrameContent) {
         //$("#currentContentPreviewElementsContainer").html(textFrameContent);
         var span = $("<span/>").attr({
             "previewElementsContainer": textFrameContent
         }).append(textFrameContent);
         $("#currentContentPreviewElementsContainer").append(span);
     });
 }
 /*Function to load gs1 types*/
 function loadGS1Types() {
     $.getJSON("../awl/gs1types.json", function (gs1DataObject) {
         appendGS1Types(gs1DataObject);
		 $('#collapsePremapPanel').click();   // Hiding Premap panel by default
     });

 }

 /* Function to put all data of art into copy matrix        */
 function appendArtAssembly(artAssemblyData, cb) {
     $('#textFrameName').val(artAssemblyData.artLabel);
	 actualTextAreaName = artAssemblyData.artLabel;
	 
     var timeout;
     var k = 0;

     $.each(artAssemblyData.previewElements, function (i, eachDataElement) {
        // var typeIconClassName = (eachDataElement.source == "marker") ? "markerElementIcon" :
            // (eachDataElement.source == "premap") ? "premapElementIcon" :
            // "CopyElementIcon";
         if ((eachDataElement.gs1Key === "Marker") && eachDataElement.UniqueKey === undefined) {
             var uniqueKey = "Marker|" + eachDataElement.content;
             eachDataElement.UniqueKey = uniqueKey;
         }

         //this method calling added for IR-1012008
		  Q.getlanguageFromXMP(eachDataElement.UniqueKey,actualTextAreaName,k,function (language){
				 eachDataElement.language = language;
		  });
		  
		 Q.getAWLContentFromXMP(eachDataElement.UniqueKey,actualTextAreaName,k,function (contentRTE){
			// if(contentRTE != "") {
				eachDataElement.contentRTE = contentRTE;
			// }
			
			addElementToCopyDataMatrix(new DataMatrixElement({
				source: eachDataElement.source,
				elementType: eachDataElement.gs1Key,  
				instanceSequence: eachDataElement.instanceSequence, 
				localeSequence: eachDataElement.localeSequence,
				content: eachDataElement.content,
				contentRTE: eachDataElement.contentRTE,
				platformContent: eachDataElement.platformContent,
				subSturcturedElement: eachDataElement.subSturcturedElement,
				parentInfo: eachDataElement.parentInfo,
				// typeIcon: typeIconClassName,
				language: eachDataElement.language,     
				state: eachDataElement.state,
				contentJSONRTE: eachDataElement.contentJSONRTE,
				UniqueKey: eachDataElement.UniqueKey
			}), false);
			if(timeout)clearTimeout(timeout);
			timeout=setTimeout(renderPreviewPanel);
		 //});
         });
         k++;

     });
	 

	 cb();
 }
 
 // Function to add selected elemets on AA panel to MM working area in non-edit mode or first-time mode
 // IR-670380-3DEXPERIENCER2019x
 
 function appendArtAssemblyInNonEditMode(artAssemblyData, assyData, autoAddMarkers, cb){
		
		var selectedElementList = $.parseJSON(artAssemblyData)["sequenceInfo"];
		var defMarkerValue = $("#defaultMarkerValue").val();
		
		for(var i = 0; i < Object.keys(selectedElementList).length; i++){
			var selectedElement = selectedElementList[i];
			$.each(assyData.artworkElements, function (j, eachAssemblyElement) {			
				if (selectedElement == eachAssemblyElement.UniqueKey){
					//var typeIconClassName = "CopyElementIcon";
					
					addElementToCopyDataMatrix(new DataMatrixElement({
						source: "assembly",
						elementType: eachAssemblyElement.gs1Key,
						instanceSequence: eachAssemblyElement.instanceSequence,
						localeSequence: eachAssemblyElement.localeSequence,
						content: eachAssemblyElement.content,
						contentRTE: eachAssemblyElement.contentRTE,
						platformContent: eachAssemblyElement.contentRTE,
						subSturcturedElement: eachAssemblyElement.subSturcturedElement,
						parentInfo: eachAssemblyElement.parentInfo,
						//typeIcon: typeIconClassName,
						language: eachAssemblyElement.language,
						state: eachAssemblyElement.state,
						contentJSONRTE: eachAssemblyElement.contentJSONRTE,
						UniqueKey: eachAssemblyElement.UniqueKey
					}), false);
					
					if(autoAddMarkers && i != Object.keys(selectedElementList).length - 1){
						addElementToCopyDataMatrix(new DataMatrixElement({
							source: "marker",
							elementType: "Marker",
							//typeIcon: "markerElementIcon",
							instanceSequence: "",
							language:"",                //added for IR-1012008
							contentRTE: defMarkerValue
						}), false);
					}
				}
			});
		}
		cb();
 }

 /*Handler to add marker*/
 function addMarker() {
	 var defMarkerValue = $("#defaultMarkerValue").val();
     addElementToCopyDataMatrix(new DataMatrixElement({
         source: "marker",
         elementType: "Marker",
         //typeIcon: "markerElementIcon",
         instanceSequence: "",
		 language: "",                        //added for IR-1012008
		 contentRTE: defMarkerValue
     }), true);
	 //renderPreviewPanel();
	editCopyTextContentHandler();

 }

 /*
    wx7: Funtion to add row to copy data matrix.
 */
function addElementToCopyDataMatrix(data, doesSelectionMatter){
    var content = data.contentRTE;
    data = JSON.parse(JSON.stringify( data));
	
	// Appending languageSequenceNumber
	var languageText = "";
	if(data.language){
		$.each(data.language.split(","), function(index, currentLanguage){
			if(languageText != "")
				languageText = languageText.concat(", ");
			if(globalLanguageSequenceMap[currentLanguage])
				languageText = languageText.concat(globalLanguageSequenceMap[currentLanguage] + "-" + currentLanguage);
			else{
				for(var k in globalLanguageSequenceMap){
					if(k.indexOf(currentLanguage) != -1)
						languageText = languageText.concat(globalLanguageSequenceMap[k] + "-" + currentLanguage);
				}
			}
		});
	}
	
	var copyTextContent =data.contentRTE;
	if(copyTextContent=="" && isBaseCopyAvaiable && data["elementType"] !== "Marker" && data["source"] !== "premap" && Object.keys(baseCopyTextBySequence).length > 0) {
		var gs1Type = data["elementType"];
		var instanceSequence = data["instanceSequence"];
		var localeSequence = data["localeSequence"];
		var searchKey = gs1Type + "|" + instanceSequence;
		var elementInfo = baseCopyTextBySequence[searchKey];
		if (data["parentInfo"]) {
			var parentKey = data["UniqueKey"].split(":")[1];
			elementInfo = baseCopyTextBySequence[parentKey][searchKey];
		}
		copyTextContent = elementInfo[baseCopySequenceValue];
	}
    //Added the condition to not to how premap and marker in exp contente -- IR-548466-3DEXPERIENCER2015x
    var copyTextContentTD = $("<td>").addClass("copyTextContent").attr("contentRTE", copyTextContent).html(decodeRTEText(copyTextContent));
    /*$(copyTextContentTD).on("keyup", function(event) {
		console.log(event);
    	lastFocusedCopyTextTD = $(this);
    });*/
	var offset;
	$(copyTextContentTD).keydown(function (e) {
		let v= document.getSelection().anchorNode.nodeValue
		//setTimeout(function(){

			if (e.keyCode == 13 && e.shiftKey === true) {
				//let v = $(copyTextContentTD)[0].innerHTML;
					
				const str = v;
			    //v = v.slice(0,-2);
				let stringCount = 0;
				let keepCounting = true;
				 // for (let i = 0; i < str.length; i++) {
                    // if ((str[i] == "<") || (str[i] == "&")) {
                        // keepCounting = false;                
                    // }				
					// if ((str[i] == ";")) {
                        // keepCounting = true;
                    // }					
					// if (keepCounting) stringCount++

                    // if ((str[i] == ">")) {
                        // keepCounting = true;
                    // }
                    // if (stringCount == offset) {
                        // offset = i;
                        // break;
                    // }
                // }
				
                if (v == null) {
                    v = '\u0003';
                    copyTextContentTD.html(v);
                }
                else {
                    v = v.slice(0, offset) + '\u0003' + v.slice(offset);
                    document.getSelection().anchorNode.nodeValue = v;
                }
				event.preventDefault();
				return false;
				// const lastIndexOfL = str.lastIndexOf('\n');
				console.log("js noinject---"); 

				// const removeLastL = str.slice(0, lastIndexOfL-1) + str.slice(lastIndexOfL + 1);
				// copyTextContentTD.html(v);
				//console.log(e.which + " or Shift was pressed");
			}
			else
			{
				offset = window.getSelection().focusOffset;
			}
		//});
		
	}); 

//added for IR-1012008
	var languagevalue = "";
    if(data.source!="marker")
	{
    var copylan = data.language;
	var localseq = data.localeSequence;
	var separator = "-";
	languagevalue = localseq + separator + copylan;
	}
	
	
		
    var tdHTMLArr = [
        $("<td/>").addClass("checkbox").append($('<span>')
		.addClass("serialNoSpan")).append($("<input>").attr("type", "checkbox")).append($("<label>").addClass("checkboxIcon")),
        //$("<td/>").attr({class:"typeIcon"}).addClass(data.typeIcon),
        $("<td/>").addClass("elementType").text(data.elementType),
        $("<td/>").addClass("instSeq").text(data.instanceSequence),
        $("<td>").addClass("language").text(languageText).attr("localeSequence",data.localeSequence),//RRR1         //commented for IR-1012008
		
		
		//$("<td>").addClass("language").text(languageText).attr("localeSequence",data.localeSequence).html(languagevalue),
        $("<td>").addClass("state").text(data.state),
        copyTextContentTD,
        $("<td>").addClass("experienceContent").html(data.source=="premap" || data.source=="marker"  ? "" :  data.platformContent),
        $("<td>").addClass("syncIndicator").text("")
        ];
    if(data.source === "premap"){
        tdHTMLArr[2] = $(tdHTMLArr[2]).attr('contentEditable', 'true'); //instance
        tdHTMLArr[3] = $(tdHTMLArr[3]).attr('contentEditable', 'true'); //language
		tdHTMLArr[3] = $(tdHTMLArr[3]).text(data.localeSequence); // Need to populate locale Seq for premap instead of Lang
    }
    tdHTMLArr[5].attr('contentEditable', 'true'); //content

    if(data.source === "assembly"){
        tdHTMLArr[7] = $(tdHTMLArr[7]).removeClass("showSyncIcon"); //syncIcon
    }

	if((tdHTMLArr[5]).html() == "")
		$(tdHTMLArr[5]).css("background-color", "#6d6d6d");
	
    var markerRow = $("<tr/>").attr({class:"mappedElementsTableBodyRow",
        contentRTE : data.contentRTE,
        contentJSONRTE : data.contentJSONRTE,
        subSturcturedElement : data.subSturcturedElement,
        parentInfo : data.parentInfo,
        source: data.source,
		language: data.language,                   //added for IR-1012008
        UniqueKey: data.UniqueKey,
		instanceSequence: data.instanceSequence,
		localeSequence: data.localeSequence,
		gs1Key: data.elementType
    });

    $.each(tdHTMLArr,function(){
        $(this).addClass("mappedElementsContentCell");
        $(markerRow).append(this);
    });
   
	var selectedElementsInWorkingArea = $(".mappedElementsTableBodyRow>.checkbox>.selected");
	if(doesSelectionMatter){
     if($(selectedElementsInWorkingArea).length <= 1  ){
     	if($(selectedElementsInWorkingArea).length==1){
			$(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').before(markerRow);
     	}else if($(selectedElementsInWorkingArea).length==0){
     		 $("#mappedElementsTableBody").append(markerRow);
     	}
     	 
     }else{
		 if(data.source == "marker"){
			 if($(selectedElementsInWorkingArea).length != 0){
				$.each(selectedElementsInWorkingArea, function(index, currentRow){
					var markerClone = $(markerRow).clone(true);
					$(currentRow).parents('.mappedElementsTableBodyRow').before(markerClone);
				});
			 } else
				$("#mappedElementsTableBody").append(markerRow);
		 } else{
			//IR-658224 - Missing translation on multimap
			Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.SelectFromWorkingArea']);//IR-581111 - Uniform alert box
		 }
     }
	}else{
		$("#mappedElementsTableBody").append(markerRow);
	}
	//renderOutOfSync();
    editCopyTextContentHandlerwithoutRendering();
	//resizeTables();
	renderSerialNumbers();
}


 /*
    Handler to add element to multimap
     This function can add data from 2 sources,
     1) premap panel in multi map
     2) assembly panel in multi map
  */
 function addElement(isInvokedByUser) {
	 addProgessInfo();
     var artworkAssemblyTable = $("#assemblyElementsTable");
     var assemblySelectionQuery = $("td label.checkboxIcon.selected", artworkAssemblyTable).closest("tr")
     var premapSelectionQuery = $("li.selectedPremapElement");

     var selectionPresentOnAssembly = (assemblySelectionQuery.length > 0) ? true : false;
     var selectionPresentOnPremap = (premapSelectionQuery.length > 0) ? true : false;

     if (!selectionPresentOnAssembly && !selectionPresentOnPremap) {
         if (!isLoggedIn) {
             Q.showJavaScriptAlert("Select element from POA Assembly or Type Assignment Panel to add element to multiple element list");//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.SelectAssemblyOrPremap']);//IR-581111 - Uniform alert box
         }
		 removeProgessInfo();
         return;
     }
	 
	 // Return if more than one element is selected
	 var selectedElementsInWorkingArea = $(".mappedElementsTableBodyRow>.checkbox>.selected");
	 if($(selectedElementsInWorkingArea).length > 1){
		 Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.SelectFromWorkingArea']);//IR-581111 - Uniform alert box
		 removeProgessInfo();
		 return;
	 }
	 
	 // Auto add Markers
	 var autoAddMarkers = $("#autoAddMarkersCheckboxLabel").hasClass("selected");
	 var defMarkerValue = $("#defaultMarkerValue").val();
	 var markerElement = new DataMatrixElement({
							source: "marker",
							elementType: "Marker",
							//typeIcon: "markerElementIcon",
							instanceSequence: "",
							language:"",          //added for IR-1012008
							contentRTE: defMarkerValue
						});
	 var isWorkingTableEmpty = $("#mappedElementsTableBody").children('tr').length == 0;
	 
	 if(!autoAddMarkers){
		 Q.showJavaScriptConfirmBox(MULTIMAP_PANEL_LABELS['emxFramework.alert.AutoAddMarkers'], function(choice){
			 if(choice){
				 autoAddMarkers = choice;
				 checkOrUncheckAutoAddMarkersCheckBox(autoAddMarkers);
			 }
			 
			 // Add selected elements on assembly panel.
			if (selectionPresentOnAssembly) {
				var UniqueKeyArray = [];
				$("#mappedElementsTableBody .mappedElementsTableBodyRow").each(function () {
					UniqueKeyArray.push($(this).attr("UniqueKey"));
				});
	
				var duplicateElementsSelected = false;
				for(var z = 0; z < selectionSequenceArray.length; z++){
					$(assemblySelectionQuery).each(function (index, currentAssemblySelection) {
						if(selectionSequenceArray[z] == $(this).attr("UniqueKey")){
							var rowData = new DataMatrixElement({
								source: "assembly",
								//typeIcon: "CopyElementIcon",				 
								elementType: $(this).find("td.assemblyElementType").text(),
								instanceSequence: $(this).find("td.assemblyInstanceSequence").html(),
								language: $(this).attr("language"),//find("td.assemblyLanguage").html(),
								localeSequence: $(this).attr("localeSequence"),
								content: $(this).attr("content"),
								subSturcturedElement: $(this).attr("subSturcturedElement"),
								parentInfo: $(this).attr("parentInfo"),
								contentRTE: $(this).attr("contentRTE"),
								platformContent: $(this).attr("contentRTE"), //need to implement this.
								state: $(this).find("td.assemblyState").html(),
								contentJSONRTE: $(this).attr("contentJSONRTE"),
								UniqueKey: $(this).attr("UniqueKey")
							});

							var currentKey = rowData.UniqueKey;
												
					
							if ($.inArray(currentKey, UniqueKeyArray) != -1) {
								duplicateElementsSelected = true;
								addElementToCopyDataMatrix(rowData, true);               //to allow same elements multiple times in multimap panel
		
							} else {
								if(!autoAddMarkers)
									addElementToCopyDataMatrix(rowData, true);
								else{
									if(isWorkingTableEmpty){
										addElementToCopyDataMatrix(rowData, true);
										isWorkingTableEmpty = false;
										if(z != selectionSequenceArray.length - 1 || selectionPresentOnPremap)
											addElementToCopyDataMatrix(markerElement, true);
									} else {
										// Add at a particular position use case
										if($(selectedElementsInWorkingArea).length == 1){
											var selectedElementSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').attr('source');
											var prevToSelectedElemSource;
											if($(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').index() != 0)
												prevToSelectedElemSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').prev().eq(0).attr('source');
											else
												prevToSelectedElemSource = "empty"; // If first element in the table is selected
											
											if(prevToSelectedElemSource == "empty"){
												if(prevToSelectedElemSource == "empty" && selectedElementSource != "marker"){
													addElementToCopyDataMatrix(rowData, true);
													addElementToCopyDataMatrix(markerElement, true);
												}else if(prevToSelectedElemSource == "empty" && selectedElementSource == "marker"){
													addElementToCopyDataMatrix(rowData, true);
												}
											}else{											
												if(prevToSelectedElemSource == "marker" && selectedElementSource == "marker")
													addElementToCopyDataMatrix(rowData, true);
												else if(prevToSelectedElemSource == "marker" && selectedElementSource != "marker"){
													addElementToCopyDataMatrix(rowData, true);
													addElementToCopyDataMatrix(markerElement, true);
												}
												else if(prevToSelectedElemSource != "marker" && selectedElementSource == "marker"){
													addElementToCopyDataMatrix(markerElement, true);
													addElementToCopyDataMatrix(rowData, true);
												}
												else if(prevToSelectedElemSource != "marker" && selectedElementSource != "marker"){
													addElementToCopyDataMatrix(markerElement, true);
													addElementToCopyDataMatrix(rowData, true);
													addElementToCopyDataMatrix(markerElement, true);
												}
											}
										}else{
											// Add at the end use case
											if($("#mappedElementsTableBody").children("tr").last().attr("source") != "marker"){
												addElementToCopyDataMatrix(markerElement, true);
												isWorkingTableEmpty = false;
												addElementToCopyDataMatrix(rowData, true);
											} else {
												addElementToCopyDataMatrix(rowData, true);
												isWorkingTableEmpty = false;
											}									
											if(z != selectionSequenceArray.length - 1 || selectionPresentOnPremap)
												addElementToCopyDataMatrix(markerElement, true);
										}
									}									
								}
							}
						}
					});
				}
      
      //below few lines are commented to allow same elements multiple times in multimap panel
			//	if (duplicateElementsSelected && isInvokedByUser) {
				//	if (!isLoggedIn) {
					//	Q.showJavaScriptAlert("Copy element already mapped");//IR-581111 - Uniform alert box
					//} else {
						//Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.ElementAlreadyMapped']);//IR-581111 - Uniform alert box
					//}
				//}
				var selectedAssemblyElements = $("#assemblyElementsTable label.selected");
				selectedAssemblyElements.removeClass("selected");
				selectedAssemblyElements.each(function () {
					$(this).siblings("input").prop("checked", "");
				});
			// Why to refresh on adding element??
			//updateArtworkAssemblyContent(); // Populating the 3DExpereience Content Column
			}

			if (selectionPresentOnPremap) {
				$(premapSelectionQuery).each(function (index, currentPremapSelection) {
					var selectedPremapData = new DataMatrixElement({
						source: "premap",
						elementType: $(this).attr("gs1Key"),
						//typeIcon: "premapElementIcon",
						instanceSequence: "",
						language: "",             //added for IR-1012008
						localeSequence:""
					});
			 
					if(!autoAddMarkers)
						addElementToCopyDataMatrix(selectedPremapData, true);
					else{
						if(isWorkingTableEmpty){
							addElementToCopyDataMatrix(selectedPremapData, true);
							isWorkingTableEmpty = false;
							if(index != premapSelectionQuery.length-1)
								addElementToCopyDataMatrix(markerElement, true);
						} else {
							if($(selectedElementsInWorkingArea).length == 1){
								var selectedElementSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').attr('source');
								var prevToSelectedElemSource;
								if($(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').index() != 0)
									prevToSelectedElemSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').prev().eq(0).attr('source');
								else
									prevToSelectedElemSource = "empty";
								
								if(prevToSelectedElemSource == "empty"){
									if(prevToSelectedElemSource == "empty" && selectedElementSource != "marker"){
										addElementToCopyDataMatrix(selectedPremapData, true);
										addElementToCopyDataMatrix(markerElement, true);
									}else if(prevToSelectedElemSource == "empty" && selectedElementSource == "marker"){
										addElementToCopyDataMatrix(selectedPremapData, true);
									}
								} else {								
									if(prevToSelectedElemSource == "marker" && selectedElementSource == "marker")
										addElementToCopyDataMatrix(selectedPremapData, true);
									else if(prevToSelectedElemSource == "marker" && selectedElementSource != "marker"){
										addElementToCopyDataMatrix(selectedPremapData, true);
										addElementToCopyDataMatrix(markerElement, true);
									}
									else if(prevToSelectedElemSource != "marker" && selectedElementSource == "marker"){
										addElementToCopyDataMatrix(markerElement, true);
										addElementToCopyDataMatrix(selectedPremapData, true);
									}
									else if(prevToSelectedElemSource != "marker" && selectedElementSource != "marker"){
										addElementToCopyDataMatrix(markerElement, true);
										addElementToCopyDataMatrix(selectedPremapData, true);
										addElementToCopyDataMatrix(markerElement, true);
									}
								}
							} else {
								if($("#mappedElementsTableBody").children("tr").last().attr("source") != "marker"){
									addElementToCopyDataMatrix(markerElement, true);
									isWorkingTableEmpty = false;
									addElementToCopyDataMatrix(selectedPremapData, true);
								} else {
									addElementToCopyDataMatrix(selectedPremapData, true);
									isWorkingTableEmpty = false;
								}									
								if(index != premapSelectionQuery.length-1)
									addElementToCopyDataMatrix(markerElement, true);
							}
						}
					}
					$(this).toggleClass("selectedPremapElement"); //toggle selection
				});
			}
			renderPreviewPanel(); //IR-693408
		});
	 } else {
		 
		// Add selected elements on assembly panel.
		if (selectionPresentOnAssembly) {
			var UniqueKeyArray = [];
			$("#mappedElementsTableBody .mappedElementsTableBodyRow").each(function () {
				UniqueKeyArray.push($(this).attr("UniqueKey"));
			});
	
			var duplicateElementsSelected = false;
			for(var z = 0; z < selectionSequenceArray.length; z++){
				$(assemblySelectionQuery).each(function (index, currentAssemblySelection) {
					if(selectionSequenceArray[z] == $(this).attr("UniqueKey")){
						var rowData = new DataMatrixElement({
							source: "assembly",
							//typeIcon: "CopyElementIcon",				 
							elementType: $(this).find("td.assemblyElementType").text(),
							instanceSequence: $(this).find("td.assemblyInstanceSequence").html(),
							language: $(this).attr("language"),//find("td.assemblyLanguage").html(),
							localeSequence: $(this).attr("localeSequence"),
							content: $(this).attr("content"),
							subSturcturedElement: $(this).attr("subSturcturedElement"),
							parentInfo: $(this).attr("parentInfo"),
							contentRTE: $(this).attr("contentRTE"),
							platformContent: $(this).attr("contentRTE"), //need to implement this.
							state: $(this).find("td.assemblyState").html(),
							contentJSONRTE: $(this).attr("contentJSONRTE"),
							UniqueKey: $(this).attr("UniqueKey")
						});

						var currentKey = rowData.UniqueKey;
						// var currentKey = rowData.elementType + "|" + rowData.instanceSequence + "|" + rowData.localeSequence;
						// if(rowData.subSturcturedElement == "true"){
						// var parentKey = $(this).attr("parentInfo").replace(/-/g, "|");
						// var splitedParentKey = parentKey.split("|");
							// if(splitedParentKey.length == 3)
								// parentKey = splitedParentKey[0]+"|"+splitedParentKey[1];
						// currentKey = (currentKey +':'+ parentKey);
						// }
						
					
						if ($.inArray(currentKey, UniqueKeyArray) != -1) {
							duplicateElementsSelected = true;
							if(!autoAddMarkers)                                          //this if and else code is to fix CA-1408
								addElementToCopyDataMatrix(rowData, true);
							else
								addElementToCopyDataMatrix(markerElement, true);
								addElementToCopyDataMatrix(rowData, true);
	
						} else {
							if(!autoAddMarkers)
								addElementToCopyDataMatrix(rowData, true);
							else{
								if(isWorkingTableEmpty){
									addElementToCopyDataMatrix(rowData, true);
									isWorkingTableEmpty = false;
									if(z != selectionSequenceArray.length - 1 || selectionPresentOnPremap)
										addElementToCopyDataMatrix(markerElement, true);
								} else {
									if($(selectedElementsInWorkingArea).length == 1){
										var selectedElementSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').attr('source');
										var prevToSelectedElemSource;
										if($(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').index() != 0)
											prevToSelectedElemSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').prev().eq(0).attr('source');
										else
											prevToSelectedElemSource = "empty";
										
										if(prevToSelectedElemSource == "empty"){
											if(prevToSelectedElemSource == "empty" && selectedElementSource != "marker"){
												addElementToCopyDataMatrix(rowData, true);
												addElementToCopyDataMatrix(markerElement, true);
											}else if(prevToSelectedElemSource == "empty" && selectedElementSource == "marker"){
												addElementToCopyDataMatrix(rowData, true);
											}
										} else {										
											if(prevToSelectedElemSource == "marker" && selectedElementSource == "marker")
												addElementToCopyDataMatrix(rowData, true);
											else if(prevToSelectedElemSource == "marker" && selectedElementSource != "marker"){
												addElementToCopyDataMatrix(rowData, true);
												addElementToCopyDataMatrix(markerElement, true);
											}
											else if(prevToSelectedElemSource != "marker" && selectedElementSource == "marker"){
												addElementToCopyDataMatrix(markerElement, true);
												addElementToCopyDataMatrix(rowData, true);
											}
											else if(prevToSelectedElemSource != "marker" && selectedElementSource != "marker"){
												addElementToCopyDataMatrix(markerElement, true);
												addElementToCopyDataMatrix(rowData, true);
												addElementToCopyDataMatrix(markerElement, true);
											}
										}
									}else{										
										if($("#mappedElementsTableBody").children("tr").last().attr("source") != "marker"){
											addElementToCopyDataMatrix(markerElement, true);
											isWorkingTableEmpty = false;
											addElementToCopyDataMatrix(rowData, true);
										} else {
											addElementToCopyDataMatrix(rowData, true);
											isWorkingTableEmpty = false;
										}									
										if(z != selectionSequenceArray.length - 1 || selectionPresentOnPremap)
											addElementToCopyDataMatrix(markerElement, true);
									}
								}									
							}
						}
					}
				});
			}
       
      //below few lines are commented to allow same elements multiple times in multimap panel
			//if (duplicateElementsSelected && isInvokedByUser) {
				//if (!isLoggedIn) {
					//Q.showJavaScriptAlert("Copy element already mapped");//IR-581111 - Uniform alert box
				//} else {
					//Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.ElementAlreadyMapped']);//IR-581111 - Uniform alert box
				//}
			//}
			var selectedAssemblyElements = $("#assemblyElementsTable label.selected");
			selectedAssemblyElements.removeClass("selected");
			selectedAssemblyElements.each(function () {
				$(this).siblings("input").prop("checked", "");
			});
			// Why to refresh on adding element??
			//updateArtworkAssemblyContent(); // Populating the 3DExpereience Content Column
		}

		if (selectionPresentOnPremap) {
			$(premapSelectionQuery).each(function (index, currentPremapSelection) {
				var selectedPremapData = new DataMatrixElement({
					source: "premap",
					elementType: $(this).attr("gs1Key"),
					//typeIcon: "premapElementIcon",
					instanceSequence: "",
					language: "",             //added for IR-1012008
					localeSequence:""
				});
			 
				if(!autoAddMarkers)
					addElementToCopyDataMatrix(selectedPremapData, true);
				else{
					if(isWorkingTableEmpty){
						addElementToCopyDataMatrix(selectedPremapData, true);
						isWorkingTableEmpty = false;
						if(index != premapSelectionQuery.length-1)
							addElementToCopyDataMatrix(markerElement, true);
					} else {
						if($(selectedElementsInWorkingArea).length == 1){
							var selectedElementSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').attr('source');
							var prevToSelectedElemSource;
							if($(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').index() != 0)
								prevToSelectedElemSource = $(selectedElementsInWorkingArea).parents('.mappedElementsTableBodyRow').prev().eq(0).attr('source');
							else
								prevToSelectedElemSource = "empty";
							
							if(prevToSelectedElemSource == "empty"){
								if(prevToSelectedElemSource == "empty" && selectedElementSource != "marker"){
									addElementToCopyDataMatrix(selectedPremapData, true);
									addElementToCopyDataMatrix(markerElement, true);
								}else if(prevToSelectedElemSource == "empty" && selectedElementSource == "marker"){
									addElementToCopyDataMatrix(selectedPremapData, true);
								}
							} else {							
								if(prevToSelectedElemSource == "marker" && selectedElementSource == "marker")
									addElementToCopyDataMatrix(selectedPremapData, true);
								else if(prevToSelectedElemSource == "marker" && selectedElementSource != "marker"){
									addElementToCopyDataMatrix(selectedPremapData, true);
									addElementToCopyDataMatrix(markerElement, true);
								}
								else if(prevToSelectedElemSource != "marker" && selectedElementSource == "marker"){
									addElementToCopyDataMatrix(markerElement, true);
									addElementToCopyDataMatrix(selectedPremapData, true);
								}
								else if(prevToSelectedElemSource != "marker" && selectedElementSource != "marker"){
									addElementToCopyDataMatrix(markerElement, true);
									addElementToCopyDataMatrix(selectedPremapData, true);
									addElementToCopyDataMatrix(markerElement, true);
								}
							}
						} else {
							if($("#mappedElementsTableBody").children("tr").last().attr("source") != "marker"){
								addElementToCopyDataMatrix(markerElement, true);
								isWorkingTableEmpty = false;
								addElementToCopyDataMatrix(selectedPremapData, true);
							} else {
								addElementToCopyDataMatrix(selectedPremapData, true);
								isWorkingTableEmpty = false;
							}									
							if(index != premapSelectionQuery.length-1)
								addElementToCopyDataMatrix(markerElement, true);
						}
					}
				}
				$(this).toggleClass("selectedPremapElement"); //toggle selection
			});
		}
	 }
	 editCopyTextContentHandler();
	 clearSelectionSequenceNumbersFromUI();
     renderPreviewPanel();
     handleSelectAllBox(artworkAssemblyTable.attr("id"));
	 removeProgessInfo();
 }

 /*Handler to remvoe element from multi map*/
 function removeElement() {
     var mappedElementsTable = $('#mappedElementsTable');
     $("td label.checkboxIcon.selected", mappedElementsTable).each(function () {
         $(this).closest("tr.mappedElementsTableBodyRow").remove();
         $(this).prop("checked", "");
     });
     renderPreviewPanel();
     handleSelectAllBox(mappedElementsTable.attr("id"));
	 enableDisableMoveCommands();
	 renderSerialNumbers();
 }
 
 // Function to handle Mass update
 function updateMarkerValuesEnMasse(){
	 var isNonMarkerSelected = false;
	 var selectedElements = $("td label.checkboxIcon.selected", '#mappedElementsTable');
	 
	 // Check if only markers are selected
	 $(selectedElements).each(function () {
		 if(!isNonMarkerSelected){
			var currentRow = $(this).closest("tr.mappedElementsTableBodyRow");
			var isMarker = $(currentRow).attr("source") == "marker" ? true : false;
		 
			if(!isMarker){
				isNonMarkerSelected = true;
			}
		 }
	 });
	 
	 if(isNonMarkerSelected){
		 if (!isLoggedIn) {
             Q.showJavaScriptAlert("Mass update only available for Markers");			 
		 } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.MassUpdateOnlyMarkers']);
		 }
		 return;
	 }
	 
	 if($(selectedElements).length == 0){
		 if (!isLoggedIn) {
             Q.showJavaScriptConfirmBox("No marker is selected. Do you want to update all the markers?");			 
		 } else {
			 Q.showJavaScriptConfirmBox(MULTIMAP_PANEL_LABELS['emxFramework.alert.MassUpdateOnlyMarkersAddAll'], function(val){
				 if(val){
					// Update the values
					var defaultMarkerValue = $("#defaultMarkerValue").val();
						
					$("tr.mappedElementsTableBodyRow[source=marker]", '#mappedElementsTable').each(function(){
						$(this).find("td.copyTextContent").html(decodeRTEText(defaultMarkerValue));
					});
					 markEmptyContentCells();
					 renderPreviewPanel();
				 }
			 });             
		 }
		 return;
	 }
	 
	 // Update the values
	 var defaultMarkerValue = $("#defaultMarkerValue").val();
	 
	 $(selectedElements).each(function(){
		 var currentRow = $(this).closest("tr.mappedElementsTableBodyRow[source=marker]");
		 $(currentRow).find("td.copyTextContent").html(decodeRTEText(defaultMarkerValue));
	 });
   markEmptyContentCells();
   renderPreviewPanel();
 }

 /*Handler to move element up*/
 function moveElementUp() {
     var selectedElement = $("#mappedElementsTable td input:checkbox:checked");
	 var allRowsLength = $("#mappedElementsTable tr.mappedElementsTableBodyRow").length;
	 var firstSelectedIndex = $(selectedElement[0]).closest("tr").index();
	 
	 if(selectedElement.length == 0) { // IR-693845
         Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.selectAtLeast1']);
		return;
         }

	 if(firstSelectedIndex == 0)
		 return;
	 
     var row = selectedElement.closest("tr");
	 
	 $.each(row, function(index, currentRow){
		 $(currentRow).insertBefore($(currentRow).prev());
	 });
     renderPreviewPanel();
	 enableDisableMoveCommands();
	 renderSerialNumbers();
 }

 /*Handler to move element down*/
 function moveElementDown() {
     var selectedElement = $("#mappedElementsTable td input:checkbox:checked");
	 var allRowsLength = $("#mappedElementsTable tr.mappedElementsTableBodyRow").length;
	 var lastSelectedIndex = $(selectedElement[selectedElement.length-1]).closest("tr").index();
	 
 	 if(selectedElement.length == 0) { // IR-693845
           Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.selectAtLeast1']);
		return;
         }

	 if(lastSelectedIndex == allRowsLength - 1)
		 return;
	 
     var rows = selectedElement.closest("tr");	 
	 rows = $(rows).get().reverse();	 // Reversing is very important here for move down
	 
	 $.each(rows, function(index, currentRow){
		 $(currentRow).insertAfter($(currentRow).next());
	 });
     renderPreviewPanel();
	 enableDisableMoveCommands();
	 renderSerialNumbers();
 }

 /*Handler to synchronize elements*/
 function syncElements() {
     if (!isLoggedIn) {
         Q.showJavaScriptAlert("Operation not allowed in Offline mode ");//IR-581111 - Uniform alert box
         return;
     }
     var allAssemblyElements = $('.mappedElementsTableBodyRow[source=assembly]').find("input:checkbox:checked");
     var allNonAssemblyElements = $('.mappedElementsTableBodyRow[source!=assembly]').find("input:checkbox:checked");
     if (allNonAssemblyElements.length == 0 && allAssemblyElements.length == 0) {
         Q.showJavaScriptConfirmBox(MULTIMAP_PANEL_LABELS['emxFramework.confirm.SyncAll'], function(val){
			if(val){				
				$(".mappedElementsTableBodyRow[source=assembly]").each(function () {
					var platformContent = $(this).find(".experienceContent").html();
					if(isBaseCopyAvaiable && platformContent == "" && $(this).attr("elementType") !== "Marker" && $(this).attr("source") !== "premap") {
						var gs1Type = $(this).attr("gs1Key");
						var instanceSequence = $(this).attr("instanceSequence");
						var localeSequence = $(this).attr("localeSequence");
						var searchKey = gs1Type + "|" + instanceSequence;
						var elementInfo = baseCopyTextBySequence[searchKey];
						if ($(this).attr("parentInfo")) {
							var parentKey = $(this).attr("UniqueKey").split(":")[1];
							elementInfo = baseCopyTextBySequence[parentKey][searchKey];
						}
						platformContent = elementInfo[baseCopySequenceValue];

					}
					$(this).find('.copyTextContent').html(platformContent);
				});
                renderPreviewPanel();
                markEmptyContentCells();
			}
		});
		return;
	}
	
	if (allNonAssemblyElements.length > 0) {
		if (!isLoggedIn) {
				Q.showJavaScriptAlert("3DEXPERIENCE Platform Sync available only on Copy Elements");//IR-581111 - Uniform alert box
		} else {
			Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.SyncOnlyCopyElements']);//IR-581111 - Uniform alert box
		}
		return;
	}
    
	allAssemblyElements.each(function () {
		var platformContent = $(this).closest('tr').find(".experienceContent").html();
		if(isBaseCopyAvaiable && platformContent == "" && $(this).closest('tr').attr("elementType") !== "Marker" && $(this).closest('tr').attr("source") !== "premap") {
			var gs1Type = $(this).closest('tr').attr("gs1Key");
			var instanceSequence = $(this).closest('tr').attr("instanceSequence");
			var localeSequence = $(this).closest('tr').attr("localeSequence");
			var searchKey = gs1Type + "|" + instanceSequence;
			var elementInfo = baseCopyTextBySequence[searchKey];
			if ($(this).closest('tr').attr("parentInfo")) {
				var parentKey = $(this).closest('tr').attr("UniqueKey").split(":")[1];
				elementInfo = baseCopyTextBySequence[parentKey][searchKey];
			}
			platformContent = elementInfo[baseCopySequenceValue];

		}
		$(this).closest('tr').find('.copyTextContent').html(platformContent);
	});
	renderPreviewPanel();
	markEmptyContentCells();
 }


 /* Candidate Elements Click Handler    */
 function gs1ClickHandling() {
     $(".gs1-parent-type").click(ulClickHandler);
     $(".expandIcon").click(imgClickHandler);
     $(".gs1-child-type").hover(function (event) {
         if (event.target.nodeName === "LI") {
             $(this).css("background-color", "#262626");
         }
     });
     $(".gs1-child-type").mouseleave(function (event) {
         if (event.target.nodeName === "LI") {
             $(this).css("background-color", "");
         }
     });
     $(".gs1-child-type").click(function (event) {
         if (event.target.nodeName === "LI") {
             $(this).css("background-color", "");
             $(this).toggleClass("selectedPremapElement");
         }
     });
 }

 function ulClickHandler(event) { // Candidate Elements Click Handler
     if (event.target.nodeName === "UL") {
         $(this).find(" > .gs1-child-type").toggleClass("collapsed");
         $(this).closest(".gs1ParentContainer").find(".expandIcon").toggleClass("tilted");
     };
 }

 function imgClickHandler(event) { // Candidate Elements Click Handler
     if (event.target.nodeName === "IMG") {
         $(this).closest(".gs1ParentContainer").find(".gs1-child-type").toggleClass("collapsed");
         $(this).closest(".gs1ParentContainer").find(".expandIcon").toggleClass("tilted");
     };
 }

 function mapSelectAllCheckbox(event) { // Select all Checkbox click Handler
     $(event.target).toggleClass("selected"); // new Icon and class updated
     var hasSelectedClass = $(event.target).hasClass("selected"); // check if class is present or not
     var table = $(event.target).closest('table');
	 var tableId = $(event.target).closest('table').attr("id");

     if (hasSelectedClass) {
		$("#" + tableId + " tbody>tr:visible").each(function (index, elem) {
			if($(elem).css("pointer-events")!=="none") {
				$(this).find("label.checkboxIcon").addClass('selected');
				//$(event.target).siblings("input").prop("checked", "checked");
				$(this).find("input:checkbox").prop("checked", true);
			}
		});
     } else {
		 $("#" + tableId + " tbody>tr:visible").each(function (index, elem) {
			$(this).find("label.checkboxIcon").removeClass('selected');
			//$(event.target).siblings("input").prop("checked", "");
			$(this).find("input:checkbox").prop("checked", false);
		 });
     }
     
     handleSelectAllBox(tableId);
	 
	 // Disable-enable move commands
	 if(tableId == "mappedElementsTable")
		enableDisableMoveCommands();
	
	 handleSelectionSequenceArrayAndRender();
 }

 //function to render gs1 types panel
 function appendGS1Types(gs1DataObject) {

     var gs1TypesContainer = $("<div/>").attr({
         id: "premapContent"
     });
     $.each(gs1DataObject.GS1Types, function (i, eachGS1Parent) {
         var gs1ParentContainer = $("<div>").attr({
             class: "gs1ParentContainer"
         });
         var expandIcon = $("<img>").attr({
             class: "expandIcon"
         }).attr({
             height: "10px",
             width: "10px"
         });
         var eachParentGS1 = $("<ul/>").attr({
             class: "gs1-parent-type"
         }).text(eachGS1Parent.name);
         if (eachGS1Parent.GS1SubType !== undefined) {
             $.each(eachGS1Parent.GS1SubType, function (j, eachGS1Type) {
				 
				 
                 var eachChildGS1 = $("<li/>").attr({
                     class: "gs1-child-type collapsed "
                 }).text(eachGS1Type.name).attr({
                     "gs1key": eachGS1Type.gs1key
                 });
                 //IR - 574495 - Start
				 if(eachGS1Type.Structure ==="true")			
						$(eachChildGS1).css("pointer-events", "none");
				 //IR - 574495 - End
				
                 $(eachParentGS1).append(eachChildGS1);
             });
         }
         $(gs1ParentContainer).append(expandIcon).append(eachParentGS1);
         $(gs1TypesContainer).append(gs1ParentContainer);
     });
     $("#premapElementsContainer").append(gs1TypesContainer);
     gs1ClickHandling();
 }

 function appendLanguageinPanel(assemblyDataObject) {

	 var languageSequenceMap = assemblyDataObject.languageSequenceMap;
	 updateGlobalLanguageSequenceMap(languageSequenceMap);
	 //console.log("lang_method1"); 
	 
 }
 
 //function to render artwork assembly panel
 function appendArtworkAssemblyElements(assemblyDataObject) {
	 $(".assemblyElementsTableBody").remove();
 
     var tableBody = $("<tbody/>").attr({
         "class": "assemblyElementsTableBody"
     });
	 var languageSequenceMap = assemblyDataObject.languageSequenceMap;
	 updateGlobalLanguageSequenceMap(languageSequenceMap);
     var selectionCount = 0;
	 var artworkAssemblyDataArray = [];
	 
	 for (var currentID in assemblyDataObject.artworkElements) {
        artworkAssemblyDataArray.push(assemblyDataObject.artworkElements[currentID]);
     }
	 
	 sortArtworkAssemblyData(artworkAssemblyDataArray, "assemblyElementsTable");	
	 $.each(artworkAssemblyDataArray, function (j, eachAssemblyElement) {
		var gs1Type = eachAssemblyElement["gs1Key"];
		var instanceSequence = eachAssemblyElement["instanceSequence"];
		var localeSequence = eachAssemblyElement["localeSequence"];
		var generatedUniqueKey = gs1Type + "|" + instanceSequence;
		var currentElementInfo = baseCopyTextBySequence[generatedUniqueKey] || {};
		if (!eachAssemblyElement.parentInfo) {
			baseCopyTextBySequence[generatedUniqueKey] = currentElementInfo;
		}
		
		if (eachAssemblyElement.parentInfo) {
			var parentKey = eachAssemblyElement["UniqueKey"].split(":")[1];
			currentElementInfo = baseCopyTextBySequence[parentKey][generatedUniqueKey] || {};
			baseCopyTextBySequence[parentKey][generatedUniqueKey] = currentElementInfo;
			currentElementInfo[localeSequence] = eachAssemblyElement["contentRTE"];	
		} else if(eachAssemblyElement.type !=="Structure") {
			currentElementInfo[localeSequence] = eachAssemblyElement["contentRTE"];	
		}
	 });
     $.each(artworkAssemblyDataArray, function (j, eachAssemblyElement) {
         var eachElementRow = $("<tr/>").attr({
             "class": "artwork-assembly-row",
             "notes": eachAssemblyElement.notes,
             "typeIcon": eachAssemblyElement.elementTypeIcon,
             "contentRTE": eachAssemblyElement.contentRTE,
             "contentJSONRTE": eachAssemblyElement.contentJSONRTE,
             "content": eachAssemblyElement.content,
             "localeSequence": eachAssemblyElement.localeSequence,
             "gs1Key": eachAssemblyElement.gs1Key,
             "instanceSequence": eachAssemblyElement.instanceSequence,
             "sequenceNumber": eachAssemblyElement.sequenceNumber,
             "language": eachAssemblyElement.language,
             "state": eachAssemblyElement.state,
             "subSturcturedElement": eachAssemblyElement.subSturcturedElement,
             "parentInfo": eachAssemblyElement.parentInfo,
             "UniqueKey": eachAssemblyElement.UniqueKey,
             "structuredRoot" : eachAssemblyElement.structuredRoot
         });
		 
		if(eachAssemblyElement.type ==="Structure" || eachAssemblyElement.structuredRoot === true)		
			$(eachElementRow).css("pointer-events", "none");
		 var isSubStructuredElement = eachAssemblyElement.subSturcturedElement == "true";
         var isSelected = eachAssemblyElement.isSelected;
         var checkbox = $("<input/>").attr({
             type: "checkbox",
             checked: isSelected
         });
         var label = $("<label/>");
         
         if(eachAssemblyElement.type === "Structure" || eachAssemblyElement.structuredRoot === true ){ // IR-574495-3DEXPERIENCER2018x
        	 label.attr({
                 class: "disabledCheckboxIcon"
             });
         }else{
        	 label.attr({
                 class: "checkboxIcon"
             });
         }
         
         if (isSelected) {
             $(label).addClass("selected");
             selectionCount++;
         }
         var selectElem = $("<td/>");
         selectElem.addClass("ArtworkAssemblyContentCell assemblyCheckbox");
		 var selectionSequenceSpan = $("<span>").addClass("selectionSequenceSpan");		 
         
         if(isSubStructuredElement){
        	 $(selectElem).append(checkbox).append(label).css("text-align","right");
			 $(selectElem).append(selectionSequenceSpan);
         }else{
        	 $(selectElem).append(checkbox).append(label).append(selectionSequenceSpan);
         }
		 
         var langText = "";
         var typeIcon = "";
         if (eachAssemblyElement.elementTypeIcon == "NoTranslate") {
             typeIcon = $("<span/>").attr({
                 class: "assemblyTypeIcon"
             });
			 $(typeIcon).append(getCommandsImageHTML("artworkTypeImage", "AWLiconStatusNoTranslation.gif").css({"width":"15px", "height":"15px"}));
			 langText = eachAssemblyElement.language;
			 if(languageSequenceMap[eachAssemblyElement.language])
				 langText = languageSequenceMap[eachAssemblyElement.language] + "-" + eachAssemblyElement.language;
			 else{
				 for (var k in languageSequenceMap){
						if(k.indexOf(eachAssemblyElement.language) != -1)
							langText = languageSequenceMap[k] + "-" + eachAssemblyElement.language;
				 }
			 }
         } else if (eachAssemblyElement.elementTypeIcon == "Inline") {
             typeIcon = $("<span/>").attr({
                 class: "assemblyTypeIcon"
             });
			 $(typeIcon).append(getCommandsImageHTML("artworkTypeImage", "AWLiconStatusInlineTranslation.gif").css({"width":"15px", "height":"15px"}));
			 $.each(eachAssemblyElement.language.split(","), function(index, currentLang){
				 if(langText != "")
					 langText = langText.concat(", ");
				 if(languageSequenceMap[currentLang])
					 langText = langText.concat(languageSequenceMap[currentLang] + "-" + currentLang);
				 else{
					 for (var k in languageSequenceMap){
						if(k.indexOf(currentLang) != -1)
							langText = langText.concat(languageSequenceMap[k] + "-" + currentLang);
					 }
					 
				 }
			 });
         } else {
			 if(eachAssemblyElement.language){
				if(eachAssemblyElement.language.indexOf(",") != -1){
					typeIcon = $("<span/>").attr({
						class: "assemblyTypeIcon"
					});
					$(typeIcon).append(getCommandsImageHTML("artworkTypeImage", "AWLiconStatusInlineTranslation.gif").css({"width":"15px", "height":"15px"}));
					$.each(eachAssemblyElement.language.split(","), function(index, currentLang){
						if(langText != "")
							langText = langText.concat(", ");
						if(languageSequenceMap[currentLang])
							langText = langText.concat(languageSequenceMap[currentLang] + "-" + currentLang);
						else{
							for (var k in languageSequenceMap){
								if(k.indexOf(currentLang) != -1)
									langText = langText.concat(languageSequenceMap[k] + "-" + currentLang);
							}
					 
						}
					});				 
				} else {
					typeIcon = $("<span/>").attr({
						class: "assemblyTypeIcon"
					});
					$(typeIcon).append(getCommandsImageHTML("artworkTypeImage", "iconActionRichTextEditor.png").css({"width":"15px", "height":"15px"}));
					langText = eachAssemblyElement.language;
					if(languageSequenceMap[eachAssemblyElement.language])
						langText = languageSequenceMap[eachAssemblyElement.language] + "-" + eachAssemblyElement.language;
					else{
						for (var k in languageSequenceMap){
							if(k.indexOf(eachAssemblyElement.language) != -1)
								langText = languageSequenceMap[k] + "-" + eachAssemblyElement.language;
						}
					}
				}
			 }else{
				typeIcon = $("<span/>").attr({
						class: "assemblyTypeIcon"
				});
				$(typeIcon).append(getCommandsImageHTML("artworkTypeImage", "iconActionRichTextEditor.png").css({"width":"15px", "height":"15px"}));
				langText = eachAssemblyElement.language;				
			 }
		 }
		 
		 if(eachAssemblyElement.type === "Structure" || eachAssemblyElement.structuredRoot === true){
			 $(typeIcon).empty();
			 $(typeIcon).append(getCommandsImageHTML("artworkTypeImage", "AWLStructureCopy.png").css({"width":"15px", "height":"15px"}));
		 }			 
		 
		 var gs1KeyData = (eachAssemblyElement.gs1Key.length > 50) ? eachAssemblyElement.gs1Key.substr(0, 50).trim() + ".." : eachAssemblyElement.gs1Key;
		 var instanceSequenceData = (eachAssemblyElement.instanceSequence.length > 50) ? eachAssemblyElement.instanceSequence.substr(0, 50).trim() + ".." : eachAssemblyElement.instanceSequence;
		 var stateData = "";
		 if(eachAssemblyElement.state)
			stateData = (eachAssemblyElement.state.length > 50) ? eachAssemblyElement.state.substr(0, 50).trim() + ".." : eachAssemblyElement.state;
		if(langText)
		 langText = (langText.length > 50) ? langText.substr(0, 50).trim() + ".." : langText;
		 
         var elementType = $("<td/>").attr({
             class: "assemblyElementType ArtworkAssemblyContentCell"
         }).append(typeIcon).append(gs1KeyData);
         var instanceSequence = $("<td/>").attr({
             class: "assemblyInstanceSequence ArtworkAssemblyContentCell"
         }).text(instanceSequenceData);
         var language = $("<td/>").attr({
             class: "assemblyLanguage ArtworkAssemblyContentCell"
         }).text(langText);
         var state = $("<td/>").attr({
             class: "assemblyState ArtworkAssemblyContentCell"
         }).text(stateData);

         //var contentValue = (eachAssemblyElement.content.length > 15) ? eachAssemblyElement.content.substr(0, 15).trim() + ".." : eachAssemblyElement.content.substr(0, 15);
		 var contentValue = eachAssemblyElement.contentRTE;
         var notesValue = (eachAssemblyElement.notes.length > 50) ? eachAssemblyElement.notes.substr(0, 50).trim() + ".." : eachAssemblyElement.notes;
         var content = $("<td/>").attr({
             class: "assemblyContent ArtworkAssemblyContentCell"
         //}).text(contentValue);
		 });
         var notes = $("<td/>").attr({
             class: "assemblyNotes ArtworkAssemblyContentCell"
         }).text(notesValue);
		 
		 var linkSpan = $("<span>").addClass("linkSpan");
		 var linkStatus = $("<td/>").attr({
             class: "assemblyLink ArtworkAssemblyContentCell"
         }).append(linkSpan);

         if (linkInfo !== undefined) {
             if (linkInfo[eachAssemblyElement.UniqueKey.replace(/[\W\_]/g, "-")]) {
                 var statusLinkImage = getCommandsImageHTML("artworkTypeImage", "iconSmallLinkedObject.png");
                 linkSpan.append(statusLinkImage);
             }
         }
		
		 
		 // Give filterContent attr to enable full text search and bypass ellipsis
		 content.attr("filterContent", decodeRTEText(eachAssemblyElement.contentRTE));
		 notes.attr("filterContent", decodeRTEText(eachAssemblyElement.notes));
		 		 
		 var that = content;
		 Q.getJSONOfTagsFromRTEContent(contentValue,function(jsonTags){
		var jasonData = JSON.parse(jsonTags);
		
		var content = "";
		var rteContent = "";
		
		var firstData = "";
		var startingTagsOfFirstdata = "";
		var firstTag = "";
		
		if(jasonData.length>0){
			firstData = jasonData[0];
			startingTagsOfFirstdata = firstData["starting-tags"];
			if(startingTagsOfFirstdata.length > 0){
				firstTag = startingTagsOfFirstdata[0].tagName;
			}
		}
		
		for (var i = 0; i < jasonData.length; i++) {
			var data = jasonData[i];
			var sTags = "";
			var eTags = "";
			content += data.content;
			
			var startingTags = data["starting-tags"];
			if(startingTags.length>0){
			for(var t=0;t<startingTags.length;t++) {
					var attribute = startingTags[t]["attribute"];;
					if((attribute != null) && (attribute["dir"] != undefined)) 
					{
						var attrValue = "\"" +attribute["dir"]+ "\"";
						sTags += "<"+startingTags[t].tagName+ " dir=" + attrValue + ">";
					}
					else {
						sTags += "<"+startingTags[t].tagName+">";
					}
			}
			}
			
			var endingTags = data["ending-tags"];
			if(endingTags.length>0){
				for(var t=0;t<endingTags.length;t++)
					eTags += "</"+endingTags[t].tagName+">";
			}
			
			if(content.length <= 50){
				rteContent += sTags + data.content + eTags;
			}
			else {
			if(firstTag == "div")
				{
					if(!eTags.includes("</div>"))
					{
						eTags = eTags + "</div>";
					}
				}
				rteContent += sTags + data.content.substr(0,(50-(content.length-data.content.length))) + "..." + eTags;
				break;
			}
		}
	if(rteContent.includes("</span>") && !rteContent.includes("<div dir=\"rtl\">")) {
		rteContent = "<div dir=\"rtl\">" + rteContent + "</div>";
	}
	that.html(rteContent);
	});
		 $(eachElementRow).append(selectElem).append(elementType).append(instanceSequence).append(language).append(content).append(notes).append(state).append(linkStatus);
         $(tableBody).append(eachElementRow);
     });
     $("#assemblyElementsTable").append(tableBody);
     $(".artwork-assembly-row").hover(function () {
         if (!isLoggedIn) {
             $("#assemblyElementNotes").html("Notes : " + $(this).attr("notes"));
             $("#assemblyElementPreview").html("Preview : " + $(this).attr("contentRTE"));
         } else {
             $("#assemblyElementNotes").html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Notes'] + ": " + $(this).attr("notes"));
             $("#assemblyElementPreview").html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Preview'] + ": " + $(this).attr("contentRTE"));
         }
     });
     $(".artwork-assembly-row").mouseleave(function () {
         if (!isLoggedIn) {
             $("#assemblyElementNotes").html("Notes :");
             $("#assemblyElementPreview").html("Preview :");
         } else {
             $("#assemblyElementNotes").html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Notes']);
             $("#assemblyElementPreview").html(MULTIMAP_PANEL_LABELS['emxAWL.Label.Preview']);

         }
     });

     if (selectionCount > 0) {
         addElement(false); //false is passed to indicate this is an internal call and no need to show alert.

     }
	if(renderfunc == false)       //only this if statement not statement inside if is added as fix for either CA-1404 or CA-1405 or CA-1407
	{
	rectifyLanguageMapping();
	}
	alignAssemblyTable("");    // Call to realign the columns
 }
 
 function wrapColumnContent(event) {
    bContentWrapped = (!bContentWrapped);
	wrapUnwrapArtworkTableContent(objectData);
}

function wrapUnwrapArtworkTableContent(artworkAssemblyData) {
	var artworkAssemblyDataArray = [];
    for (var currentID in artworkAssemblyData) {
        artworkAssemblyDataArray.push(artworkAssemblyData[currentID]);
    }
	sortArtworkAssemblyData(artworkAssemblyDataArray, "assemblyElementsTable");
    $.each(artworkAssemblyDataArray, function (indx, row) {
		for(var i=0;i<row.length;i++) {
        wrapUnwrapRow(row[i]);
		}
    });
}

function wrapUnwrapRow(row) {
	$(".assemblyElementsTableBody>tr").each(function(){
		var id = $(this).attr("uniqueKey");
		if(id == row.UniqueKey) {
				var isFromGS1XML = row.id == 'fromGS1XML'? true: false;
				var gs1Type = row.gs1Key;
				var InstanceSequence = row.instanceSequence;
				var CurrentState = ""
				var notesValue = row.notes;
				var languageSequenceMap = "";
				if(row.languageSequenceMap)
				{
					languageSequenceMap = row.languageSequenceMap;
				}
				var langText = "";
				langText = row.language;				
				var contentValueRTE = (row.type == "graphic") ? "" : row.contentRTE;
				if (row.state) {
					CurrentState = row.state;
				}
								
				if (row.elementTypeIcon == "NoTranslate") {
					if(languageSequenceMap != "") {
						if(languageSequenceMap[row.language]){
							langText = languageSequenceMap[row.language] + "-" + row.language;
						}
						else{
							for (var k in languageSequenceMap){
								if(k.indexOf(row.language) != -1)
									langText = languageSequenceMap[k] + "-" + row.language;
							}
						}
					}
				} else if (row.elementTypeIcon == "Inline") {
				$.each(row.language.split(","), function(index, currentLang){
					if(langText != "")
					 langText = langText.concat(", ");
					if(languageSequenceMap[currentLang])
					 langText = langText.concat(languageSequenceMap[currentLang] + "-" + currentLang);
					else{
					 for (var k in languageSequenceMap){
						if(k.indexOf(currentLang) != -1)
							langText = langText.concat(languageSequenceMap[k] + "-" + currentLang);
					 } 
					}
					});
				} else {
				if(row.language){
				if(row.language.indexOf(",") != -1){
					$.each(row.language.split(","), function(index, currentLang){
						if(langText != "")
							langText = langText.concat(", ");
						if(languageSequenceMap[currentLang])
							langText = langText.concat(languageSequenceMap[currentLang] + "-" + currentLang);
						else{
							for (var k in languageSequenceMap){
								if(k.indexOf(currentLang) != -1)
									langText = langText.concat(languageSequenceMap[k] + "-" + currentLang);
							}
						}
					});				 
				} else {
					if(languageSequenceMap != ""){
					if(languageSequenceMap[row.language])
						langText = languageSequenceMap[row.language] + "-" + row.language;
					else{
						for (var k in languageSequenceMap){
							if(k.indexOf(row.language) != -1)
								langText = languageSequenceMap[k] + "-" + row.language;
						}
					}
					}
				}
			  }
		   }
				
			if (!bContentWrapped) {
				
				gs1Type = (gs1Type.length > 50) ? gs1Type.substr(0, 50).trim() + ".." : gs1Type;
				InstanceSequence = (InstanceSequence.length > 50) ? InstanceSequence.substr(0, 50).trim() + ".." : InstanceSequence;
				CurrentState = (CurrentState.length > 50) ? CurrentState.substr(0, 50).trim() + ".." : CurrentState;
				notesValue = (notesValue.length > 50) ? notesValue.substr(0, 50).trim() + ".." : notesValue;
				langText = (langText.length > 50) ? langText.substr(0, 50).trim() + ".." : langText;
								
				var that = this;
				Q.getJSONOfTagsFromRTEContent(contentValueRTE,function(jsonTags){
					var jasonData = JSON.parse(jsonTags);
		
					var content = "";
					var rteContent = "";
		
					var firstData = "";
					var startingTagsOfFirstdata = "";
					var firstTag = "";
		
					if(jasonData.length>0){
						firstData = jasonData[0];
						startingTagsOfFirstdata = firstData["starting-tags"];
						if(startingTagsOfFirstdata.length > 0){
							firstTag = startingTagsOfFirstdata[0].tagName;
						}
					}
		
					for (var i = 0; i < jasonData.length; i++) {
						var data = jasonData[i];
						var sTags = "";
						var eTags = "";
						content += data.content;
			
						var startingTags = data["starting-tags"];
						if(startingTags.length>0){
							for(var t=0;t<startingTags.length;t++) {
								var attribute = startingTags[t]["attribute"];;
								if((attribute != null) && (attribute["dir"] != undefined)) 
								{
									var attrValue = "\"" +attribute["dir"]+ "\"";
									sTags += "<"+startingTags[t].tagName+ " dir=" + attrValue + ">";
								}
								else {
									sTags += "<"+startingTags[t].tagName+">";
								}
							}
						}
			
						var endingTags = data["ending-tags"];
						if(endingTags.length>0){
							for(var t=0;t<endingTags.length;t++)
								eTags += "</"+endingTags[t].tagName+">";
						}
			
						if(content.length <= 50){
							rteContent += sTags + data.content + eTags;
						}
						else {
							if(firstTag == "div")
							{
								if(!eTags.includes("</div>"))
								{
									eTags = eTags + "</div>";
								}
							}
							rteContent += sTags + data.content.substr(0,(50-(content.length-data.content.length))) + "..." + eTags;
							break;
						}
					}
				$(that).find('td.assemblyContent').html(rteContent);
				});
            }
            else {
                var that = this;
                Q.handleAngleBracketToParse(contentValueRTE, function (rteContent) {
                    $(that).find('td.assemblyContent').html(rteContent);
                });
            }
			
			$(this).find('td.copyElementType').find('span.artworkTypeText').html(gs1Type);
			$(this).find('td.tableHeaderImagesCell').html(InstanceSequence);
			$(this).find('td.order').html(CurrentState);
			$(this).find('td.notes').html(notesValue);
			$(this).find('td.language').html(langText);
		}
	});
}

 function getElementsInfo() {
     var elementsArray = new Object();
     var mappedTableRows = $("#mappedElementsTable>tbody>tr");
     mappedTableRows.each(function (i) {
         var presentRow = {
             id: i,
             elementType: $(this).find("td.elementType").text(),
             instanceSequence: $(this).find("td.instSeq").text(),
             language: $(this).find("td.language").text(),
             state: $(this).find("td.state").text(),
             content: $(this).find("td.content").text(),
             platform: $(this).find("td.platform").text()
         };
         elementsArray[i] = presentRow;
     });
     return elementsArray;
 }

 function filterMappedElementsTable() { // Filter Logic for Mapped Elements Table
     'use strict';
     $("#mappedElementsTable tbody tr").each(function () {
         $(this).hide();
     });
     var searchString = $(this).val();

     $("tbody tr").filter(function () {

         var elementType = $(this).children('td.elementType').text();
         var instSequence = $(this).children('td.instSeq').text();
         var language = $(this).children('td.language').text();
         var state = $(this).children('td.state').text();
         var copyText = $(this).children('td.copyTextContent').text();
         var platform = $(this).children('td.platform').text();
         var filterText = "";

         filterText = elementType + " " + instSequence + " " + language + " " + state + " " + copyText + " " + platform;

         if (filterText != undefined && filterText.trim().toUpperCase().indexOf(searchString.toUpperCase()) == -1)
             return false;
         else
             return true;
     }).show();

     handleSelectAllBox("mappedElementsTable");
 }

 function filteArtworkAssemblyTable() { // Filter Logic for Artwork Assembly Table
     'use strict';
     $("#assemblyElementsTable tbody tr").each(function () {
         $(this).hide();
     });
     var searchString = $(this).val();
     $("#assemblyElementsTable tbody tr").filter(function () {
         var elementType = $(this).find(".assemblyElementType").text();
         var instSeq = $(this).find(".assemblyInstanceSequence").text();
         var language = $(this).find(".assemblyLanguage").text();
         var state = $(this).find(".assemblyState").text();
         var content = $(this).attr("content");
         var notes = $(this).attr("notes");
         var filterText = "";

         filterText = elementType + " " + instSeq + " " + language + " " + state + " " + content + " " + notes;

         if (filterText != undefined && filterText.trim().toUpperCase().indexOf(searchString.toUpperCase()) == -1)
             return false;
         else
             return true;
     }).show();
     handleSelectAllBox("assemblyElementsTable");
 }
 
 function showHidePremapFilter(event){
	 var filt = $('#premapFilter');
	 
	 if($(filt).css('display') == "none")
		$(filt).css('display', 'inline-block');
	 else if($(filt).css('display') == "inline-block")
		$(filt).css('display', 'none');
 }
 
 function clearPremapFilter(event){
	 var filt = $('#premapFilter');
	 $(filt).val("");
	 filterPremapPanel();
 }

 function filterPremapPanel() { // Filter Logic for Candidate Elements panel
     'use strict';
     var searchString = $('#premapFilter').val();
     $(".gs1-parent-type,.expandIcon").off("click");
     /* If the search String is empty then reset the panel by showing all UL elements and hiding LI elements */
     if (searchString.trim() == "") {
         $("#premapContent ul li").addClass("collapsed");
         $(".gs1ParentContainer").each(function () {
             $(this).show()
         });
         $(".gs1-parent-type").on("click", ulClickHandler);
         $(".expandIcon").on("click", imgClickHandler).removeClass("tilted");
		 
		 // Handle icon change
		 $("#showHideFilterImage_P").attr("src", "../common/images/iconActionFilter.png");
		 $("#clearAllFiltersButton_P").css("display", "none");
         return;
     } else{
		 $("#showHideFilterImage_P").attr("src", "../common/images/iconActionFiltersApplied.png");
		 $("#clearAllFiltersButton_P").css("display", "inline-block");
	 }

     /*if search string has some value then start by hiding all elements */
     $(".gs1ParentContainer").each(function () {
         $(this).hide();
     })

     /* Logic to display only those UL and LI elements which matched the search String */
     $(".gs1ParentContainer").filter(function () {
         var filterText = $(this).find("ul").text() + "";
         $(this).find("li").each(function () {
             filterText = filterText + " " + $(this).text();
         });
         if (filterText != undefined && filterText.trim().toUpperCase().search(searchString.toUpperCase()) == -1)
             return false;
         else {
             $(this).find(".expandIcon").addClass("tilted");
             return true;
         }
     }).show();
     $("#premapContent .gs1ParentContainer .gs1-parent-type .gs1-child-type").filter(function () {
         if ($(this).text().trim().toUpperCase().search(searchString.toUpperCase()) != -1)
             return true;
         else {
             $(this).addClass("collapsed");
             return false;
         }
     }).removeClass("collapsed");
 }

 //wx7: function to close the mutlimap dialog
 function closeMultiMapDialog() {
     'use strict';
     Q.closeMultiMapDialog();
 }

 //wx7: function to export preview data to AI
function exportPreview(callback) {
     updatePremapElementsToAssembly();
     'use strict';
     isCalledFirstTime = true;
     
     updateUniqueValueAttribute();
     renderPreviewPanel();
     updatePremapElementsToAssembly();
     mappedElementsArray = removeDuplicates(mappedElementsArray);
     var isValid = false;
     
     // Validation To Ensure Empty markers are not present and Only markers are Not mapped
     var isMarkerValueEmpty = false;
	 $(".mappedElementsTableBodyRow[source=marker]").each(function(){
		 $(this).find("td.copyTextContent").each(function(){
			 if($(this).html() == ""){
        		isMarkerValueEmpty = true;
        	}
		 });
	 });
	 
     if (isMarkerValueEmpty) {
         if (!isLoggedIn) {
             Q.showJavaScriptAlert("Markers with empty content are not allowed");//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.NoEmptyMarkers']);//IR-581111 - Uniform alert box
         }
         return;
     }
     if ($(".mappedElementsTableBodyRow[source=marker]").length == $(".mappedElementsTableBodyRow").length) {
         if (!isLoggedIn) {
             Q.showJavaScriptAlert("No Copy Elements or GS1 Types mapped");//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.NoElementorGS1']);//IR-581111 - Uniform alert box
         }
         return;
     }
     // Marker Validation Ends

     //Candidate Copy Validation - Ensure Type_Instance_LocalSequence are unique
     var isReqCandidateFiledsEmpty = false;
     var isReqCandidateFieldsInValid = false;
     $(".mappedElementsTableBodyRow[source=premap]").each(function () {
         if ($(this).find("td.instSeq").text() == "" || $(this).find("td.language").text() == "") {
             isReqCandidateFiledsEmpty = true;
         }
         if (!$.isNumeric($(this).find("td.instSeq").text()) || !$.isNumeric($(this).find("td.language").text()) || $(this).find('td.instSeq').text() <= 0 || $(this).find('td.language').text() <= 0) {
             isReqCandidateFieldsInValid = true;
         }
     });
     if (isReqCandidateFiledsEmpty) {
         if (!isLoggedIn) {
             Q.showJavaScriptAlert("Instance Sequence/Locale Sequence is mandatory for pre-mapped elements");//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.ISLSMandatory']);//IR-581111 - Uniform alert box
         }
         return;
     } else if (isReqCandidateFieldsInValid) { //To Ensure only Integers are used
         if (!isLoggedIn) {
             Q.showJavaScriptAlert("Instance Sequence/Language column Value can only hold a Positive Integer Value");//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.OnlyPositiveValue']);//IR-581111 - Uniform alert box
         }
         return;
     }
     // ----> Candidate Copy Validation Ends

     //Uniqueness Validation Starts
     var uniqueKeyList = [];
     $(".mappedElementsTableBodyRow[source!=marker]").each(function () {
    	 if($(this).attr("subSturcturedElement") == "true"){
    		 uniqueKeyList.push($(this).attr('UniqueKey'));
    	 }else{
         uniqueKeyList.push($(this).attr('UniqueKey'));
    	 }
     });

     //below few lines are commented to allow same elements multiple times in multimap panel
     //var hasDuplicate = hasDuplicates(uniqueKeyList);
     //if (hasDuplicate) {
       //  if (!isLoggedIn) {
         //    Q.showJavaScriptAlert("Instance Sequence not unique");//IR-581111 - Uniform alert box
         //} else {
           //  Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.ISNotUnique']);//IR-581111 - Uniform alert box
         //}
        // return;
     //}
    
     //Uniqueness Validation Ends
     var textAreaNameList = textAreaName.split(",");
     textAreaNameList = removeDuplicatesInArray(textAreaNameList);
     var currentTextAreaName = $('#textFrameName').val();
     if (isEditMode && currentTextAreaName == actualTextAreaName) {
         var index = textAreaNameList.indexOf(currentTextAreaName);
         textAreaNameList.splice(index, 1);
     }
     var isNameAlreadyUsed = (textAreaNameList.indexOf(currentTextAreaName) !== -1);
     if (isNameAlreadyUsed && (!$("#textFrameName").val() == "")) {
         if (!isLoggedIn) {
             Q.showJavaScriptAlert('Combined Text Area name is already used in document. Please use different name to map the element.');//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.NameNotUnique']);//IR-581111 - Uniform alert box
         }
         return;
     }
	 
	 if ($("#textFrameName").val() == "") {
         if (!isLoggedIn) {
             Q.showJavaScriptAlert("Text Area Name field cannot be empty.");//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.NoEmptyTextArea']);//IR-581111 - Uniform alert box
         }
         return;
     }
     if ($("#textFrameName").val().search(/timestamp/ig) >= 0) {
         if (!isLoggedIn) {
             Q.showJavaScriptAlert("Combined Text Area Name field cannot hold the keyword 'TimeStamp'.");//IR-581111 - Uniform alert box
         } else {
             Q.showJavaScriptAlert(MULTIMAP_PANEL_LABELS['emxFramework.alert.NoTimeStamp']);//IR-581111 - Uniform alert box
         }
         return;
     }
     // Text Area Name Validaion Ends

	 
	 
	 // If Code reaches here it means all the validations went fine
	 
     isValid = true;
     var multiMappedContentFrameArray = new Array();
     var previewArray = new Array();
     var copyTextContentJSON = "";
     var copyTextContentRTE = "";
     var plainText = "";
     var isPremap = false;
     var isMarker = false;
	 var autoAddMarkers = $("#autoAddMarkersCheckboxLabel").hasClass("selected")? true : false;

     var experienceContentStr = "";
     $("#previewElements").children().each(function () {
         copyTextContentJSON = copyTextContentJSON + $(this).attr("contentRTE");
         plainText = plainText + this.textContent;
         var instSeq = $(this).attr("instanceSequence");
         var localeSeq = $(this).attr("localeSequence");
         var gs1Key = $(this).attr("gs1Key");

         var eachPreviewObject = {
             "content": getPlainTextFromRTEText(this.innerHTML),
             "instanceSequence": $(this).attr("instanceSequence"),
             "localeSequence": $(this).attr("localeSequence"),
             "gs1Key": $(this).attr("gs1Key"),
             "source": $(this).attr("source"),
             "language": $(this).attr("language"),
             "subSturcturedElement": $(this).attr("subSturcturedElement"),
             "state": $(this).attr("state"),
			 "platformContent": $(this).attr("experienceContent"),
             "contentRTE": $(this).attr("contentRTE"),
             "contentJSONRTE": $(this).attr("contentJSONRTE"),
             "UniqueKey": $(this).attr("UniqueKey")
         };		 
		 var subSturcturedElement = $(this).attr("subSturcturedElement") == "true";		 
		 if(subSturcturedElement)
		 {
			var  parentkey = $(this).attr("parentInfo");			
			if(parentkey.indexOf("|") != -1)				
				parentkey = parentkey.replace(/\|/g, "-");
			
			eachPreviewObject.parentkey = parentkey;
			
			var  parentInfo = parentkey.replace(/-/g, "|");			
			eachPreviewObject.parentInfo = parentInfo;
		 }	 

         if ($(this).attr("source") === "marker")
		 {			
            var currentText = this.innerHTML;
            currentText = currentText.replace(' style="font-size: 12.8px;"', '');
			currentText	= currentText.replace(' style="font-size: 12.8px; white-space: normal;"','');
			currentText	= currentText.replace(' style="font-size: 12.8px; white-space: normal; background-color: rgb(51,51,51);"','');
			var regex = /<br\s*[\/]?>/gi;
			if(currentText.match(regex))
				currentText	= currentText.replace(regex, "\n");
			 experienceContentStr += currentText;
			 isMarker = true;			 
			 multiMappedContentFrameArray.push(gs1Key + "|" + currentText);
			 $(eachPreviewObject).attr("UniqueKey", gs1Key + "|" + currentText);
		 }             
         else
		 {
			 var completekey = gs1Key + "|" + instSeq + "|" + localeSeq;			 
			 if(subSturcturedElement)				 
				 completekey = completekey+ ":" + eachPreviewObject.parentkey;			 
				 
			 multiMappedContentFrameArray.push(completekey);			 
			 experienceContentStr += $(this).attr("experienceContent");

             //below 4 lines added for IR-1012008
			 var finallang=  $(eachPreviewObject).attr("language");
			 //var urlsplit = finallang.split("-");
			 var urlsplit = finallang.substring(finallang.indexOf('-') + 1);
			 $(eachPreviewObject).attr("language", urlsplit);
		 }
		 
         if (eachPreviewObject.source == "premap"){
             isPremap = true;
			 var currentText = this.innerHTML;
             var key = $(eachPreviewObject).attr("gs1Key") + "|" + $(eachPreviewObject).attr("instanceSequence") + 
             "|" + $(eachPreviewObject).attr("localeSequence");
             $(eachPreviewObject).attr("UniqueKey", key);
			 experienceContentStr += currentText;
         }
         previewArray.push(eachPreviewObject);
     });

		copyTextContentRTE = copyTextContentJSON;
		//copyTextContentJSON = copyTextContentJSON.replace(/<\/div><div dir=\"rtl\">/g, "<br>");   // IR-1102245
        copyTextContentJSON = generateJSONForCopytext(copyTextContentJSON);
     var returnObject = {
         "isPremap": isPremap,
         "isMarker": isMarker,
         "experienceContent": generateJSONForCopytext(experienceContentStr)
     };


     returnObject["copyTextContentJSON"] = copyTextContentJSON;
     returnObject["plainText"] = plainText;
     returnObject["previewElements"] = previewArray;
     returnObject["multiMappedContentFrameArray"] = multiMappedContentFrameArray;
     returnObject["artLabel"] = $("#textFrameName").val();
	 returnObject["defaultMarkerValue"] = $("#defaultMarkerValue").val(); // Default marker value
     returnObject["editMode"] = isEditMode; //This to read the selected elements (Premapped Elements)
	 returnObject["autoAddMarkers"] = autoAddMarkers;
	 returnObject["experienceContentStr"] = experienceContentStr;
	 returnObject["copyTextContentRTE"] = copyTextContentRTE;
     Q.mapContent(JSON.stringify(returnObject));
	 callback();
     return isValid;
 }

 function hasDuplicates(array) { // To check Duplicates in an array
     var valuesSoFar = [];
     for (var i = 0; i < array.length; ++i) {
         var value = array[i];
         if (valuesSoFar.indexOf(value) !== -1) {
             return true;
         }
         valuesSoFar.push(value);
     }
     return false;
 }

 function removeDuplicates(array) {
     var valuesSoFar = [];
     for (var i = 0; i < array.length; i++) {
         var value = array[i];
         if (valuesSoFar.indexOf(value) == -1) {
             valuesSoFar.push(value);
         }
     }
     return valuesSoFar;
 }

 function updateUniqueValueAttribute() { // To update the type_inst_localeSeq(uniquekeyForMultiMap) value of Mapped Elements table

     $(".mappedElementsTableBodyRow[source=assembly]").each(function () {
    	 if($(this).attr("subSturcturedElement") == "true"){
    		 var parentKey = $(this).attr("parentInfo").replace(/-/g,"|");
			 var splitedParentKey = parentKey.split("|");
					if(splitedParentKey.length == 3)
						parentKey = splitedParentKey[0]+"|"+splitedParentKey[1];
    		 $(this).attr("UniqueKey", $(this).find('.elementType').text() + "|" + $(this).find('.instSeq').text() + "|" + $(this).find('.language').attr("localesequence")+ ":"+parentKey);
    	 }else{
    		 $(this).attr("UniqueKey", $(this).find('.elementType').text() + "|" + $(this).find('.instSeq').text() + "|" + $(this).find('.language').attr("localesequence"));
    	 }
     });
     $(".mappedElementsTableBodyRow[source=premap]").each(function () {
         $(this).attr("UniqueKey", $(this).find('.elementType').text() + "|" + $(this).find('.instSeq').text() + "|" + $(this).find('.language').text());

         $(this).find('.language').attr("localesequence", $(this).find('.language').text());
     });
	 
     $(".artwork-assembly-row").each(function () {
		 if($(this).attr("subSturcturedElement") == "true"){
    		 var parentKey = $(this).attr("parentInfo").replace(/-/g, "|");
			 var splitedParentKey = parentKey.split("|");
					if(splitedParentKey.length == 3)
						parentKey = splitedParentKey[0]+"|"+splitedParentKey[1];
    		 $(this).attr("UniqueKey", $(this).attr("gs1key") + "|" + $(this).attr("instancesequence") + "|" + $(this).attr("localesequence")+":" +parentKey);
    	 } else if($(this).attr("structuredRoot") == "true"){
			 $(this).attr("UniqueKey", $(this).attr("gs1key") + "|" + $(this).attr("instancesequence"));
		 } else{
    		  $(this).attr("UniqueKey", $(this).attr("gs1key") + "|" + $(this).attr("instancesequence") + "|" + $(this).attr("localesequence"));
    	 }
     
     });
     //renderPreviewPanel();
 }

 var isCalledFirstTime = false;
 
 function exportPreviewAndClose() {
     isCalledFirstTime = false;
	     addProgessInfo();
     //Q.multimapSaveCompareResult();
	 exportPreview(closeMultiMapDialog);
	 
     // if (exportPreview())
    // {
    	 // if(isCalledFirstTime)//IR - 576620 - Calling exportPreview Again when OK is pressed
        	 // exportPreview();
    	 // closeMultiMapDialog();
    // }
     removeProgessInfo();
}

function addProgessInfo() {
	//document.getElementById("iconLoadImg").style.visibility = "visible";
}

function removeProgessInfo() {
	//document.getElementById("iconLoadImg").style.visibility = "hidden";
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

 /*This API will look if a corresponding Element is present on POA,
 If so the pre-map element will be replaced with it. */
 function updatePremapElementsToAssembly() {
	 if(!isMappedElementsLoaded)
		 return;
     updateUniqueValueAttribute();
     var premapElements = $(".mappedElementsTableBodyRow[source=premap]");
     var premapElementsUniqeKey = premapElements.map(function () {
         return $(this).attr('UniqueKey');
     }).get();
     var mappedCopyElements = $(".mappedElementsTableBodyRow[source=assembly]");
     var mappedCopyElementsUniqueKey = mappedCopyElements.map(function () {
         return $(this).attr('UniqueKey');
     }).get();
     var assemblyElements = $(".artwork-assembly-row");
     var assemblyElementsUniqueKeys = assemblyElements.map(function () {
         return $(this).attr('UniqueKey');
     }).get();
     var isNonEligiblePremapFound = false;
     var nonEligiblePremapElements = [];
     var isNonEligibleCopyElementFound = false;
     var nonEligibleCopyElements = [];

     premapElementsUniqeKey.map(function (i) {
         if (jQuery.inArray(i, assemblyElementsUniqueKeys) != -1) {
             isNonEligiblePremapFound = true;
             nonEligiblePremapElements.push(i);
         }
     });

     $.each(mappedCopyElementsUniqueKey, function (index, value) {
         if ($.inArray(value, assemblyElementsUniqueKeys) == -1) {
             isNonEligibleCopyElementFound = true;
             nonEligibleCopyElements.push(value);
         }
     });

     if (isNonEligiblePremapFound) {
    	 var mappedElements =  $(".mappedElementsTableBodyRow");
    	 var mappedAssemblyElements = $(".mappedElementsTableBodyRow[source=assembly]");
    	 var artworkAssemblyElements = $(".artwork-assembly-row");
    	 var premapAssemblyElements = $(".mappedElementsTableBodyRow[source=premap]");
         //nonEligiblePremapElements.map(function (i) {                                                                          //commented for IR-1011572
         $(".mappedElementsTableBodyRow[source=premap]").each(function () {                                                      //added for IR-1011572
             //var currentPremapElement = fetchRowWithUniqueKey(premapAssemblyElements,i); //$(".mappedElementsTableBodyRow[source=premap][UniqueKey=" + i + "]");  //commented for IR-1011572
            // var currentPremapContent = $(currentPremapElement).find('.copyTextContent').text();                               //commented for IR-1011572
             var currentPremapContent = $(this).find('.copyTextContent').html();                                                 //added for IR-1011572
             //var currentRowIndex = currentPremapElement.index();                                                               //commented for IR-1011572
             var currentRowIndex = $(this).index();                                                                              //added for IR-1011572
             //$(this).remove();                   //commented for IR-1029474                                                                                //added for IR-1011572
             //$(currentPremapElement).remove(); // Removing the premap Element                                                  //commented for IR-1011572
             var i = $(this).attr("UniqueKey");                                                                                  //added for IR-1011572
             var correspondingAssemblyElement = fetchRowWithUniqueKey(artworkAssemblyElements,i); //$('.artwork-assembly-row[UniqueKey=' + i + ']');
             //if (fetchRowWithUniqueKey(mappedAssemblyElements,i).length <= 0) { // Adding the Matching element present in POA assembly
             //above if statement is commented as fix for either CA-1404 or CA-1405 or CA-1407
			 
  
       if((correspondingAssemblyElement != "") && (correspondingAssemblyElement != null))    //added if statement for IR-1029474
			 
			 {
				 $(this).remove();          //added for IR-1029474  
			 if(currentRowIndex != -1)
			 {
                 addElementToCopyDataMatrix(new DataMatrixElement({
                     source: "assembly",
                     elementType: correspondingAssemblyElement.attr('gs1key'),
                     instanceSequence: correspondingAssemblyElement.attr('instanceSequence'),
                     localeSequence: correspondingAssemblyElement.attr('localeSequence'),
                     content: correspondingAssemblyElement.attr('content'),
                     contentRTE: currentPremapContent,
					           platformContent: correspondingAssemblyElement.attr('contentRTE'),
                     //typeIcon: 'CopyElementIcon',
                     language: correspondingAssemblyElement.attr('language'),
                     state: correspondingAssemblyElement.attr('state'),
                     contentJSONRTE: correspondingAssemblyElement.attr("contentJSONRTE"),
                     UniqueKey: correspondingAssemblyElement.attr('UniqueKey')
                 }), false);
			 }
             //}
             
			 if(currentRowIndex ==0)                //only single line if statement not statement inside if statement is added as fix for either CA-1404 or CA-1405 or CA-1407
			 {
             var mappedElement =  fetchRowWithUniqueKey($(".mappedElementsTableBodyRow[source=assembly]"),i);  // this is done to maintain the order of the element
             mappedElement.remove();
             if(currentRowIndex!=0){
            	 if(currentRowIndex > $(".mappedElementsTableBodyRow").length )
            		 currentRowIndex = $(".mappedElementsTableBodyRow").length ;
                 $(".mappedElementsTableBodyRow").eq(currentRowIndex-1).after(mappedElement);
             }else if(currentRowIndex==0) {
            	 $("#mappedElementsTableBody").prepend(mappedElement);
             }  
			 }

             //added below code for IR-1011572
			 if(currentRowIndex!=0){
				 var mappedElement =  fetchlastRow($(".mappedElementsTableBodyRow"),i);  // this will get last row from mappedelement table
				 mappedElement.remove();
            	 if(currentRowIndex > $(".mappedElementsTableBodyRow").length )
            		 currentRowIndex = $(".mappedElementsTableBodyRow").length ;
                 $(".mappedElementsTableBodyRow").eq(currentRowIndex-1).after(mappedElement);
			 }
             
             // if (currentPremapContent != " " && currentPremapContent != "") {
            	
            	 // mappedElement.find(".copyTextContent").text(currentPremapContent);
             // }
			 
			 }   //end of else           //added for IR-1029474  
         });
     }

     if (isNonEligibleCopyElementFound) {
    	 var mappedAssemblyElements = $(".mappedElementsTableBodyRow[source=assembly]");
    	 var premapAssemblyElements = $(".mappedElementsTableBodyRow[source=premap]");
         nonEligibleCopyElements.map(function (i) {
             var CopyElementToBeReplaced = fetchRowWithUniqueKey(mappedAssemblyElements,i);
			 var currentElementContent = $(CopyElementToBeReplaced).find('.copyTextContent').text();
             var currentRowIndex = CopyElementToBeReplaced.index();
             if (fetchRowWithUniqueKey(premapAssemblyElements,i).length <= 0) {
                 addElementToCopyDataMatrix(new DataMatrixElement({
                     source: "premap",
                     elementType: CopyElementToBeReplaced.find('.elementType').text(),
                     instanceSequence: CopyElementToBeReplaced.find('.instSeq').text(),
                     localeSequence: CopyElementToBeReplaced.find('.language').attr('localesequence'),
                     content: CopyElementToBeReplaced.attr('content'),
                     contentRTE: currentElementContent,
					 platformContent: "",
                     //typeIcon: 'premapElementIcon',
                     language: CopyElementToBeReplaced.find('.language').attr('localesequence'),
                     state: CopyElementToBeReplaced.find('.state').text(),
                     contentJSONRTE: CopyElementToBeReplaced.attr('contentJSONRTE'),
                     UniqueKey: CopyElementToBeReplaced.attr('UniqueKey')
                 }), false);
             }
             CopyElementToBeReplaced.remove();
             
             var mappedElement =  fetchRowWithUniqueKey($(".mappedElementsTableBodyRow[source=premap]"),i);  // this is done to maintain the order of the element
             mappedElement.remove();
             if(currentRowIndex!=0){
                 $(".mappedElementsTableBodyRow").eq(currentRowIndex-1).after(mappedElement);
             }else if(currentRowIndex==0) {
            	 $("#mappedElementsTableBody").prepend(mappedElement);
             }

        });
    }

    if (premapElementsUniqeKey == "" && !hasDuplicates(mappedCopyElementsUniqueKey))
        rectifyLanguageMapping();
    editCopyTextContentHandler();
    renderSerialNumbers();
}

function fetchRowWithUniqueKey(elements, key){	
	var matchedElement = "";
    $.each(elements,function() {
   	 var uniqueKeyValue = $(this).attr('UniqueKey');
   	 if(key === uniqueKeyValue){
   		 matchedElement = $(this) ;
   		 return false;
   	 	}
    });
    return matchedElement;
}

//added for IR-1011572
function fetchlastRow(elements, key){	
	var matchedElement = "";
    $.each(elements,function() {
   	 //var uniqueKeyValue = $(this).attr('UniqueKey');
   	 //if(key === uniqueKeyValue){
		 matchedElement = "";
   		 matchedElement = $(this) ;
   		// return false;
   	 	//}
    });
    return matchedElement;
}
 
 function rectifyLanguageMapping() {

     var allMappedElements = $(".mappedElementsTableBodyRow[source=assembly]");
     var artworkAssemblyElements = $(".artwork-assembly-row");
     $.each(allMappedElements, function () {
         var currentElementKey = $(this).attr('UniqueKey');
         var currentLang = $(this).find('.language').text();
         var assemblyElementWithSameKey = fetchRowWithUniqueKey(artworkAssemblyElements,currentElementKey);
         
		 if(assemblyElementWithSameKey != ""){
         var assemblyElementLang = $(assemblyElementWithSameKey).attr('language');
		 var orgContent = $(this).find("td.copyTextContent").html();

         if (currentLang != assemblyElementLang) {
			 var currentRowIndex = $(this).index();
             $(this).remove();
             addElementToCopyDataMatrix(new DataMatrixElement({
                 source: "assembly",
                 elementType: assemblyElementWithSameKey.attr('gs1key'),
                 instanceSequence: assemblyElementWithSameKey.attr('instanceSequence'),
                 localeSequence: assemblyElementWithSameKey.attr('localeSequence'),
                 content: assemblyElementWithSameKey.attr('content'),
                 contentRTE: orgContent,
				 platformContent: assemblyElementWithSameKey.attr('contentRTE'),
                 //typeIcon: 'CopyElementIcon',
                 language: assemblyElementWithSameKey.attr('language'),
                 state: assemblyElementWithSameKey.attr('state'),
                 contentJSONRTE: assemblyElementWithSameKey.attr('contentJSONRTE'),
				 subSturcturedElement: assemblyElementWithSameKey.attr("subSturcturedElement"),
				 parentInfo: assemblyElementWithSameKey.attr('parentInfo'),
                 UniqueKey: assemblyElementWithSameKey.attr('UniqueKey')
             }), false);
			 
			 var mappedElement =  fetchRowWithUniqueKey($(".mappedElementsTableBodyRow[source=assembly]"),currentElementKey);  // this is done to maintain the order of the element
             mappedElement.remove();
			 var copyTextContentTD = $(mappedElement).children('.copyTextContent')[0];
				$(copyTextContentTD).keydown(function (e) {
					let v= document.getSelection().anchorNode.nodeValue
			//setTimeout(function(){
	
					if (e.keyCode == 13 && e.shiftKey === true) {
					//let v = $(copyTextContentTD)[0].innerHTML;
						
					const str = v;
					//v = v.slice(0,-2);
					let stringCount = 0;
					let keepCounting = true;
					// for (let i = 0; i < str.length; i++) {
						// if ((str[i] == "<") || (str[i] == "&")) {
							// keepCounting = false;                
						// }				
						// if ((str[i] == ";")) {
							// keepCounting = true;
						// }					
						// if (keepCounting) stringCount++
	
						// if ((str[i] == ">")) {
							// keepCounting = true;
						// }
						// if (stringCount == offset) {
							// offset = i;
							// break;
						// }
					// }
					
                        if (v == null) {
                            v = '\u0003';
                            document.getSelection().anchorNode.innerHTML = v;
                        }
                        else {
                            v = v.slice(0, offset) + '\u0003' + v.slice(offset);
                            document.getSelection().anchorNode.nodeValue = v;
                        }
					event.preventDefault();
					return false;
					// const lastIndexOfL = str.lastIndexOf('\n');
					console.log("js noinject---"); 
	
					// const removeLastL = str.slice(0, lastIndexOfL-1) + str.slice(lastIndexOfL + 1);
					// copyTextContentTD.html(v);
					//console.log(e.which + " or Shift was pressed");
					}
					else
					{
						offset = window.getSelection().focusOffset;
					}
				//});
			
				});       
					if(currentRowIndex!=0){
                 $(".mappedElementsTableBodyRow").eq(currentRowIndex-1).after(mappedElement);
             }else if(currentRowIndex==0) {
            	 $("#mappedElementsTableBody").prepend(mappedElement);
             }
         }}
     });
	 renderOutOfSync();

 }

 function getFormattedDataForRefresh(assemblyInfo){
	 var returnObject;
	 var tempArray = [];
	 
	 for(var key in assemblyInfo){
		 var orgObj = assemblyInfo[key];
		 var artworkType = orgObj.artworkType;
		 var isStructureElemRoot = false;
		 
		 if(artworkType == "graphic" || artworkType == "Graphic")
			 continue;
		 
		 if(artworkType == "structure" || artworkType == "Structure")
			 isStructureElemRoot = true;
		 
		 var newObj = getNewFormattedObjectFromOrg(orgObj);
		 
		 tempArray.push(newObj);
		 
		 if(isStructureElemRoot){
			 $.each(orgObj["NutritionInfo"], function(){
				 var newSubObj = getNewFormattedObjectFromOrg(this);
				 
				 tempArray.push(newSubObj);
			 });			 
		 }
	 }		 
	 returnObject = {artworkElements: tempArray};
	 
	 return returnObject;
 }
 
 function getNewFormattedObjectFromOrg(orgObj){
	 
	 var isStructure = false;
	 var isSubStructuredElement = false;
	 var isInline = false;
	 var isNoTranslate = false;
	 var artworkType = orgObj["artworkType"];
	 
	 if(artworkType == "structure" || artworkType == "Structure")
		isStructure = true;
		 
	 if(orgObj["isNoTranslate"] == true)
			 isNoTranslate = true;
	 if(orgObj["isInlineCopy"] == true)
			 isInline = true;
		 
	 if(orgObj["subSturcturedElement"] == "true")
		 isSubStructuredElement = true;
		 
		 
	 var newObj = {
			 notes : orgObj["notes"],
			 contentRTE : orgObj["copyTextRTE"],
			 content : orgObj["COPY_TEXT"],
			 contentJSONRTE : generateJSONForCopytext(orgObj["copyTextRTE"]),
			 localeSequence : orgObj["localeSequence"],
			 gs1Key : orgObj["gs1Type"],
			 instanceSequence : orgObj["instanceSequence"],
			 language : orgObj["languageName"],
			 state : orgObj["lc_CurrentState"],
			 type : artworkType
		 };
		 
	 if(isNoTranslate)
		 newObj["elementTypeIcon"] = "NoTranslate";
	 else if(isInline)
		 newObj["elementTypeIcon"] = "Inline";
	 else
		 newObj["elementTypeIcon"] = "";
		 
	 if(isStructure) {
		 newObj["structuredRoot"] = true;
		 if(orgObj["UniqueKey"] === undefined)
		 {
			 var uniqueKey = orgObj["gs1Type"] + "|" + orgObj["instanceSequence"];
			 newObj["UniqueKey"] = uniqueKey;
		 }
	 }
	 else{
		 newObj["structuredRoot"] = false;
		 newObj["UniqueKey"] = orgObj["UniqueKey"];
	 }
	 
	 if(!isSubStructuredElement)
		 newObj["sequenceNumber"] = orgObj["sequenceNumber"];
	 else{
		 newObj["subSturcturedElement"] = "true";
		 newObj["parentInfo"] = orgObj["parentInfo"];
	 }
	 
	 return newObj;	 
 }
 
function hideMappedElements(event, canToggle) {
	'use strict';
    if (flag) {
        $('#hideMappedElements').attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.HideElements']);
    }
    else {
        $('#hideMappedElements').attr("title", MULTIMAP_PANEL_LABELS['emxAWL.ToolTip.ShowElements']);
    }
	if(canToggle) {
		$('#hideMappedElements').toggleClass('selected');
	}
    if ($('#hideMappedElements').hasClass('selected')) {
        $(".artwork-assembly-row").each(function (index, elem) {
			if($(elem).css("pointer-events")!=="none") {
				if($(this).find("span.linkSpan > img.artworkTypeImage").length == 1)
					$(elem).hide();
				else
					$(elem).show();
			}
        });
		
		$(".artwork-assembly-row").each(function (index, elem) {
			if($(elem).css("pointer-events") =="none") {
				
				var uniqueKey = $(elem).attr("uniquekey");
				var siblinds = $(elem).siblings();
				var canHide = true;
				for(var i=0; i<siblinds.length; i++) {
					if($(siblinds[i]).attr("parentInfo") && uniqueKey == $(siblinds[i]).attr("uniquekey").split(":")[1]  && $(siblinds[i]).is(":visible")) {
						canHide = false;
						break;
					}
				}
				if(canHide)
					$(elem).hide();
				else
					$(elem).show();
				
			}
        });
    } else {
        $(".artwork-assembly-row").each(function (index, elem) {
            if($(elem).css("pointer-events")!=="none") {
				$(elem).show();
			}
        });
		
		$(".artwork-assembly-row").each(function (index, elem) {
            if($(elem).css("pointer-events") =="none") {
				var parentId = $(elem).attr("id");
				var siblinds = $(elem).siblings();
				var canShow = true;
				for(var i=0; i<siblinds.length; i++) {
					if($(siblinds[i]).attr("parentInfo") && parentId == $(siblinds[i]).attr("uniquekey").split(":")[1]  && $(siblinds[i]).is(":hidden")) {
						canShow = false;
						break;
					}
				}
				
				if(canShow)
					$(elem).show();
			}
        });
    }
	multimapFilterRowsHelper("assemblyElementsTable");
	// Handler for maintaing selections and selectAll
	handleSelectAllBox("assemblyElementsTable");
}


