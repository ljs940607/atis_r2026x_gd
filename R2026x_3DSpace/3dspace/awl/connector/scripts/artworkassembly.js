var getPOAArtworkAssemblyUrl = "../resources/awl/connector/o3dconnect/getPOAArtworkAssembly";
var getGDTaskUrl = "../resources/awl/connector/o3dconnect/getGDTask";
var hasCORLicense = "../resources/awl/connector/o3dconnect/hasCORLicense";
var hasCAPLicense = "../resources/awl/connector/o3dconnect/hasCAPLicense";
var hasAuthoringRole = "../resources/awl/connector/o3dconnect/hasAuthoringRole";
var hasLeaderRole = "../resources/awl/connector/o3dconnect/hasLeaderRole";
var promoteGDTaskUrl = "../resources/awl/connector/o3dconnect/promoteGDTask";
var lockPOAUrl = "../resources/awl/connector/document/lockPOA";
var unlockPOAUrl = "../resources/awl/connector/document/unlockPOA";
var isProcessing = false;
var isTaskProcessing = false;
var PATTERN_SPCIAL_CHAR = /[\W\_]/g;
var selectionSequenceArray = [];
var bContentWrapped = false;
var baseCopyTextBySequence = {};
var flag = true;
var flagcross = true;
var multiOccurMisMatch = false;
var copyTextArray = {};
var copyTextRTEArray = {};
var isXMLCheck;
$(document).ready(function () { 
    
	let loadQObjectPromise = getPromiseWithWindowQSetUp("jshelper");    
	loadQObjectPromise.then(function (val) {
		
        Q.repaintPanel();
        if (!hasContext)
            return;

		Q.getBaseSequence(function(returnValue) {
			baseSequenceNumber = returnValue;
			if(baseSequenceNumber > 0)
				isBaseSequenceApplicable = true;
			else
				isBaseSequenceApplicable = false;
		});
	
        updateStyleSheet();
        addProgressInfoToDiv();
		
        $.ajax({
            url: "../resources/awl/connector/o3dconnect/getLabel",
            success: function (data) {
                ARTWORK_PANEL_LABLES = $.parseJSON(data);
                addTooltipToActionsCommands();
                if (poaName != "null") {
                  if(poaName.indexOf(".xml")!=-1)
                  Q.loadGS1Assembly(poaName);
					else 
						updateArtworkAssemblyPanel(poaName);
                } else {                    
                    clearArtworkAssemblyPanel();
                    removeProgessInfo();
					updateEditPOAsCommand();
                }
                Q.setCurrentLoggedinUser(currentUser);
                Q.repaintPanel();
            }
        });
		
        $('#searchCommandbtn').click(function () {
            Q.searchPOA();
        });

        $('#uploadGS1XML').click(function () {			
            addProgessInfo();
            Q.uploadGS1XML(function(data){                 
                 removeProgessInfo();
            });			
        });		
        
        //Autotagging
        $('#automap').click(function () {	
            Q.automap();
        });
		
		    $('#copysplit').click(function () {	
            Q.copySplit();
        });

      //AddExisting PT
        $('#addExistingElement').click(function () {	
            Q.openAddExistingDLg($("#description").attr("poaID"));
        });
        
        
        $('#generateGS1Response').click(function () {
			if(isUnmappedElementExist()){
				
				Q.showConfirmAlert( function(userChoice){
					if(userChoice) {
						addProgessInfo();
						Q.generateGS1ResponseXML(localePrefUsedForImport, function () {
							removeProgessInfo();
						});
					}
				});
			} else {
				addProgessInfo();
				Q.generateGS1ResponseXML(localePrefUsedForImport, function () {
					removeProgessInfo();
				});
			}
        });	
		
        $('#multiMap').click(function () {
            $("#multiMap").addClass("disabled-commands");
            Q.openMultiMapDialog(getSelectionSequenceMap(), function () {
                $("#multiMap").removeClass("disabled-commands");
                //this.disabled = false;
            });
        });
		
        $('#associatePOABtn').click(function () {
            Q.associatePOA(function(){                 
            });
        });

        Q.getDocumentPOA(function (returnValue) {
            docPOAName = returnValue;
        });

        $('#checkinbtn').click(function () {			
			Q.getDocumentPOA(function (docPOAName) {
                if (docPOAName == null || docPOAName == "") {
                    /*var confirmValue = confirm(ARTWORK_PANEL_LABLES['emxAWL.Message.NoPOACheckinConfirmMsg']);
                    if (confirmValue) {
                        Q.associatePOA();
                    }*/
                    Q.showJavaScriptConfirmBox(ARTWORK_PANEL_LABLES['emxAWL.Message.NoPOACheckinConfirmMsg'], function (confirmValue) {
                        if (confirmValue) {
                            Q.associatePOA();
                        }
                    });
                } else {
                    if(isUnmappedElementExist()){
				
				Q.showConfirmAlert( function(userChoice){
					if(userChoice) {
						Q.CheckinFile();
					}
				});
			} else {
				Q.CheckinFile();
			}
                }
			});
        });
		
        $('#promoteTaskbtn').click(function () {
            // This callback will be invoked when myMethod has a return value. Keep in mind that the communication is asynchronous, hence the need for this callback.
			Q.getDocumentPOA(function (returnValue) {
				Q.promoteGDTask(returnValue);				
			});            
        });

        $('#annotateArtbtn').click(function () {
            toggleAnnotationDetails();
            Q.ToggleAnnotation();
            Q.repaintPanel();
        });
		
		$('#singleMarker').click(function () {
            Q.addSingleMapMarkerAttr();
            Q.repaintPanel();
        });

        $('#selectAllCheckbox').click(function () {
            selectDeselectAllCheckbox();
        }); 

		$('#hideMappedElements').click(function () { 
			flag = !flag;
            hideMappedElements(true);
        });
		$('#crossHighlight').click(function () { 
			Q.setCrossHighlightValue(flagcross);
			$('#crossHighlight').toggleClass('selected');
			flagcross = !flagcross;

        });
		
        $(document.body).on('click','#artworkAssemblySearch', function(){        	
        	this.focus();
        });
        
        $(document.body).on('input', '.filter', filterRows);
		
		window.onresize = handleTableResize;
		
		//Resize table
		//resizableGrid(document.getElementById("artworkAssemblyTable"));
		setTimeout( function ( ) { handleTableResize(); }, 300 );
    });	
	loadQObjectPromise.catch(
		// Log the rejection reason
		(reason) => {
			console.log('Handle rejected promise (' + reason + ') here.');
	});
});

function updateStyleSheet() {
    //	document.styleSheets[0].insertRule(`
    //		td.linkedToConnector > span.linkSpan {
    //			background-image: url("connector/images/iconSmallLinkedObject.png");
    //		} 
    //	`);
    //addCrossHighlightChkBox();
    //document.getElementById("copysplit").style.display = 'none';
    // var span = $('<span />').attr({ class: 'cross-highlight-span', style: 'float:right; display: inline-block; position:relative; right:20px' });

    // var chk = $('<input/>').attr({ type: 'checkbox', id: 'cross-highlight-chk', style: 'display:inline-block'/*, text :'Cross Highlight'*/ });
    // var lbl = $('<label>').text('Cross Highlight');

    // chk.change(function () {
        // // alert('##' + this.checked);
    // });

    // span.append(chk);
    // span.append(lbl);
    // $('.FiltersDiv').append(span);


    $('#copysplit').hide();
    Object.values(document.styleSheets).forEach(styleSheet => {
        if (styleSheet.href != null && styleSheet.href.indexOf("artworkassembly.css") >= 0) {
            styleSheet.insertRule(`
				td.linkedToConnector  > span.linkSpan {
					background-image: url("../images/iconSmallLinkedObject.png");
					background-repeat: no-repeat;
					background-size: contain;
				} 
			`);
            styleSheet.insertRule(`
				span.linkSpan {
					padding: 6px;
				}
			`);
            //styleSheet.insertRule(`
            //	#artworkAssemblyTable > tbody {
            //		display: table !important;
            //	}		
            //`);
        }
    });
}


function handleTableResize(event) {
    var tableDivWidth = $('#artworkAssemblyTableDiv').width();
    $('#artworkAssemblyTable').css("width", tableDivWidth);
    $('.artworkAssemblyTableHead').css("width", tableDivWidth - 4);
    $('#artworkAssemblyTableBody').css("width", tableDivWidth);

    var tableHeadWidth = $('.artworkAssemblyTableHead').width();
    $('#artworkAssemblyTableBody>tr').each(function (i) {
        if (i > 0)
            return false;
        $(this).css("width", tableHeadWidth);

        $(this).find("td").each(function (i, elem) {
            var className = $(elem).attr("class").split("�")[0];
            var tHWidth = $('.artworkAssemblyTableHead>tr>th.' + className).width();
            $(elem).css("width", tHWidth);
        });
    });

    //�$('#artworkAssemblyTableBody>tr>td').each(function�(i)�{
    //�����//if(i�>�0)
    //���������//return�false;
    //�����var�className�=�$(this).attr("class").split("�")[0];
    //�����var�tHWidth�=�$('.artworkAssemblyTableHead>tr>th.'�+�className).width();
    //�����$(this).css("width",�tHWidth);
    //�����//$(this).css("max-width",�tHWidth+2);
    //�����//$(this).css("min-width",�tHWidth);
    //�});
	
		$('#artworkAssemblyTableBody>tr>td').each(function(){
		var className = $(this).attr("class").split(" ")[0];
		var tHWidth = $('.artworkAssemblyTableHead>tr>th.'+className).width();			
		$(this).css("width", tHWidth);
	});

	
}

window.onresize = handleTableResize;

/* Method to handle Tooltip for Action commands */
function addTooltipToActionsCommands() {
    $(".clearAllFiltersButton").attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.ClearAllFilters']);
    $(".showHideFilterImage").attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.Filter']);
    $(".sortingImage").attr("title", "");
    $('#revertToOriginalSortingButton').addClass("action-command").attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.RevertSorting']);
    $('#refreshCommandbtn').addClass("action-command");
    $('#searchCommandbtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.SearchPOA']);
    $('#associatePOABtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.AssociatePOA']);
    $('#addArtbtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.CreateArt']);
    $('#removeArtbtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.RemoveArt']);
    $('#syncPanelbtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.SyncElements']);
    $('#annotateArtbtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.ToggleAnnotation']);
    $('#lockOrUnlockSpan').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.LockPOA']);
    $('#checkinbtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.CheckinFiletoPOA']);
    $('#expandPoa').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.collapsePoa']);
    $('#collapsePoa').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.expandPoa']);
    $('#promoteTaskbtn').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.PromoteGdTask']);
    $('#multiMap').attr("title", ARTWORK_PANEL_LABLES['emxAWL.Tooltip.OpenMultiMapPanel']);
    $('#uploadGS1XML').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.ImportGS1ContentFile']);
    $('#generateGS1Response').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.ExportGS1ResponseFile']);
    $('#automap').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.Automap']);
    $('#copysplit').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.CopySplit']);//IR - 651800
    $('#addExistingElement').attr("title", ARTWORK_PANEL_LABLES['emxAWL.Heading.POAEdit']);
    $('#hideMappedElements').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.HideElements']);
    $('#singleMarker').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.SingleMarker']);
    $('#contentWrapSpan').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.WrapContentAssemblyTable']);//For wrap/unwrap text of column in assembly table
    $("#crossHighlighttext").html(ARTWORK_PANEL_LABLES['emxAWL.Label.CrossHighlight']);
    
    $(document).tooltip();
}

/*Method to Toggle Annotation*/
function toggleAnnotationDetails() {
    var annotateArt = $("#annotateArtbtn");
    if ($(annotateArt).hasClass("pushed")) {
        $(annotateArt).removeClass("pushed");
    } else {
        $(annotateArt).addClass("pushed");
    }
    return annotateArt;
}

function selectDeselectAllCheckbox() {
    $('#selectAllCheckbox').toggleClass('selected');
    if ($('#selectAllCheckbox').hasClass('selected')) {
        $(".artworkAssembly:visible").each(function (index, elem) {
            if ($(elem).css("pointer-events") !== "none") {
                $(this).find("input:checkbox").prop("checked", true);
                $(this).addClass("highlight");
                $(this).find("label.checkboxIcon").addClass("selected");
                var key = $(this).attr("data-key");
                //Q.selectElement(key, true);
            }
        });
    } else {
        $(".artworkAssembly:visible").each(function (index, elem) {
            $(this).find("input:checkbox").prop("checked", false);
            $(this).removeClass("highlight");
            $(this).find("label.checkboxIcon").removeClass("selected");
            var key = $(this).attr("data-key");
           // Q.selectElement(key, false);
        });
    }
    updateSelectedElementList();
    /*updateCheckBoxLabels();*/
    Q.repaintPanel();
    handleSelectAllBox("artworkAssemblyTable");
}

function isUnmappedElementExist() {
    var isUnmappedElementExist = false;
    $(".artworkAssembly").each(function (index, elem) {
        if ($(elem).css("pointer-events") !== "none") {
            var spanLink = $(this).find("span.linkSpan");
            var bgLen = $(spanLink).css('background-image');
            //if ($(this).find("span.linkSpan > img.artworkTypeImage").length != 1)
            if (/*$(this).find("span.linkSpan > img.artworkTypeImage").length == 1*/bgLen == "none")
                isUnmappedElementExist = true;
        }
    });
    return isUnmappedElementExist;
}

function hideMappedElements(canToggle) {
    if (flag) {
        $('#hideMappedElements').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.HideElements']);
    }
    else {
        $('#hideMappedElements').attr("title", ARTWORK_PANEL_LABLES['emxAWL.ToolTip.ShowElements']);
    }
    if (canToggle) {
        $('#hideMappedElements').toggleClass('selected');

    }
    if ($('#hideMappedElements').hasClass('selected')) {
        $(".artworkAssembly").each(function (index, elem) {
            if ($(elem).css("pointer-events") !== "none") {
                var linkSpan = $(this).find("span.linkSpan");
                var bgCss = $(linkSpan).css('background-image');
                if (/*$(this).find("span.linkSpan > img.artworkTypeImage").length == 1*/bgCss != "none")
                    $(elem).hide();
                else
                    $(elem).show();
            }
        });

        $(".artworkAssembly").each(function (index, elem) {
            if ($(elem).css("pointer-events") == "none") {

                var parentId = $(elem).attr("id");
                var siblinds = $(elem).siblings();
                var canHide = true;
                for (var i = 0; i < siblinds.length; i++) {
                    if ($(siblinds[i]).attr("parentInfo") && parentId == $(siblinds[i]).attr("parentinfo").replace(PATTERN_SPCIAL_CHAR, "-") && $(siblinds[i]).is(":visible")) {
                        canHide = false;
                        break;
                    }
                }

                if (canHide)
                    $(elem).hide();
                else
                    $(elem).show();

            }
        });
    } else {
        $(".artworkAssembly").each(function (index, elem) {
            if ($(elem).css("pointer-events") !== "none") {
                $(elem).show();
            }
        });

        $(".artworkAssembly").each(function (index, elem) {
            if ($(elem).css("pointer-events") == "none") {
                var parentId = $(elem).attr("id");
                var siblinds = $(elem).siblings();
                var canShow = true;
                for (var i = 0; i < siblinds.length; i++) {
                    if ($(siblinds[i]).attr("parentInfo") && parentId == $(siblinds[i]).attr("parentinfo").replace(PATTERN_SPCIAL_CHAR, "-") && $(siblinds[i]).is(":hidden")) {
                        canShow = false;
                        break;
                    }
                }

                if (canShow)
                    $(elem).show();
            }
        });
    }
    filterRowsHelper("artworkAssemblyTable");
    //updateCheckBoxLabels();
}

function handleSelectionSequenceArrayAndRender() {
    var selectedElements = $('input[type=checkbox].syncCheckbox:checked');
    var selectedElementsUniqueKeys = [];
    $(selectedElements).each(function (key, value) {
        var currentUniqueKey = $(this).closest("tr").attr("UniqueKey");
        selectedElementsUniqueKeys.push(currentUniqueKey);
        if (!selectionSequenceArray.includes(currentUniqueKey)) {
            selectionSequenceArray.push(currentUniqueKey);
        }
    });

    for (var i = selectionSequenceArray.length - 1; i >= 0; i--) {
        if (!selectedElementsUniqueKeys.includes(selectionSequenceArray[i]))
            selectionSequenceArray.splice(i, 1);
    }

    renderSelectionSequence();
}

function renderSelectionSequence() {
    var selectedElements = $('input[type=checkbox].syncCheckbox:checked');
    var allSelectionSequenceSpans = $("span.selectionSequenceSpan");

    $.each(allSelectionSequenceSpans, function (index, value) {
        $(this).text("");
    });

    $(selectedElements).each(function (key, value) {
        var selectedElementCheckboxTD = $(this).closest("td.checkbox");
        var currentUniqueKey = $(this).closest("tr").attr("UniqueKey");
        selectedElementCheckboxTD.find("span.selectionSequenceSpan").text(selectionSequenceArray.indexOf(currentUniqueKey) + 1);
    });
}

function clearSelectionSequenceArrayAndRendering() {
    selectionSequenceArray = [];

    var allSelectionSequenceSpans = $("span.selectionSequenceSpan");

    $.each(allSelectionSequenceSpans, function (index, value) {
        $(this).text("");
    });

}

function addProgressInfoToDiv() {
    var progressText = $("<span>").attr("class", "progressWheelContent").attr("id", "progressWheelText");
    var progressWheelSpan = $("<span>").attr("class", "progressWheelContent").append(getCommandsImageHTML("syncElementsbtn", "iconLoadingWheel.gif"));
    $("#actions").append(progressWheelSpan).append(progressText);
    Q.repaintPanel();
}

var baseSequenceNumber;
var isBaseSequenceApplicable = false;
function syncronizeAIDocument(event) {
    //Check if any elements are selected.
    addProgessInfo();
    var parsedJSONTypes = "";
    var canSyncAll = $(".highlight").length <= 0 ? true : false;
    Q.getBaseSequence(function (returnValue) {
        baseSequenceNumber = returnValue;
        if (baseSequenceNumber > 0)
            isBaseSequenceApplicable = true;
        else
            isBaseSequenceApplicable = false;

        if (!canSyncAll) {
            syncAllOrSelectedElementsInArtworkAssembly(".highlight", "", canSyncAll);
        }
        else {
            Q.getDocumentPOA(function (docPOAName) {
                if (docPOAName != "" && docPOAName.indexOf("xml") == -1)
                    updateArtworkAssembly(docPOAName, true, canSyncAll);
                else if (docPOAName != "" && docPOAName.indexOf("xml") != -1) {
                    Q.getMultiMapInfoForSync(canSyncAll, function (resultValue) {
                        parsedJSONTypes = $.parseJSON(resultValue);	    // parsedJSONTypes will actually contain Multimap info	
                        var syncValueBoolean = parsedJSONTypes.syncValueBoolean;
                        if (syncValueBoolean) {
                            delete parsedJSONTypes['syncValueBoolean'];
                            syncAllOrSelectedElementsInArtworkAssembly(".artworkAssembly", parsedJSONTypes, parsedJSONTypes.canSyncAll);
                           
                        }
                     //   removeProgessInfo();
                        return;
                    });
                }
                else
                    Q.showJavaScriptAlert(ARTWORK_PANEL_LABLES['emxAWL.Message.POANotAssociated']);//IR-581111 - Uniform alert box
            });
        }
    });
   // removeProgessInfo();

}

//Sync All
function synchronizeAllAIDocument() {
    Q.getMultiMapInfoForSync(false, function (resultValue) {
        parsedJSONTypes = $.parseJSON(resultValue);	    // parsedJSONTypes will actually contain Multimap info	
        var syncValueBoolean = parsedJSONTypes.syncValueBoolean;
        if (syncValueBoolean) {
            delete parsedJSONTypes['syncValueBoolean'];
            syncAllOrSelectedElementsInArtworkAssembly(".artworkAssembly", parsedJSONTypes, true);
        }
        //return;
    });
}


function syncAllOrSelectedElementsInArtworkAssembly(selectorClassName, parsedJSONTypes, canSyncAll) {
    addProgessInfo();

    var promises=[];
    var hasKeyPromise;

    $(selectorClassName).each(function (index, elem) {
        var datakey = $(this).attr("data-key");
        var UKey = $(this).attr("UniqueKey");
        var elementKey = $(this).attr("id");
        var jsonData = getJsonForElementData(elementKey);
        var that = this;
        
        hasKeyPromise=new Promise((hasKeyResolve, hasKeyReject)=>{
            Q.hasKey(UKey, function (returnValue) {
                if (returnValue) {
                    var isCopyElement = $(that).attr("artworkType") == "Copy";
                    if (isCopyElement) {
                        promises.push(new Promise((resolve, reject)=>{
                            Q.SyncElementV2(UKey, getElementCopyTextRTE(datakey), canSyncAll, jsonData, resolve);    
                        }));
                    // Q.SyncElementV2(UKey, getElementCopyTextRTE(datakey), canSyncAll, jsonData);  // Single map sync
                        if (!canSyncAll) {
                            
                            // Multimap sync for Non-selectAll sync --- Start
                            promises.push(new Promise((resolve, reject)=>{
                                Q.getMultiMapInfo("", function (returnValue) {
                            
                                    var allKeys = new Array();
                                    $(".artworkAssembly").each(function () {
                                        var jsKey = $(this).attr("id");
                                        var aiKey = $(this).attr("UniqueKey");
                                        var isCopyElement = $(this).attr("artworkType") == "Copy";
                                        if (isCopyElement)
                                            allKeys.push(aiKey);
                                    });
                                
                                    var multiMapElements = $.parseJSON(returnValue);
                                    var returnObject = {};
                                    var assemblyMultiMappings = [];
                                    $.each(multiMapElements, function (multiMapKey, associatedElementKeysString) {
                                        var eachMultuMapObject = {
                                            "isPremap": false
                                        };
                                        var copyTextContentJSON = "";
                                        var UKeyExists = false;
                                        var associatedElementKeys = associatedElementKeysString;
                                        if (associatedElementKeys.length > 0) {
                                            $.each(associatedElementKeys, function (index, currentKey) {
                                                if (UKey == Object.keys(currentKey)[0])
                                                    UKeyExists = true;
                                            });
                                            if (UKeyExists) {
                                                var eachMultiMapCopyText = {};
                                                var multiMappedElements = [];;
                                                $.each(associatedElementKeys, function (index, currentObj) {
                                                    var currentKey = Object.keys(currentObj)[0];
                                                    var currentRowObject = {};
                                
                                                    if (currentKey.indexOf("Marker") != -1) {
                                                        var posOfPipeSep = currentKey.indexOf("|");
                                                        var size = currentKey.length;
                                                        var seperator = currentKey.substring(posOfPipeSep + 1, size);
                                                        currentRowObject["content"] = seperator;
                                                        currentRowObject["key"] = currentKey;
                                                        currentRowObject["contentRTE"] = seperator;
                                                        copyTextContentJSON = copyTextContentJSON + seperator;
                                                    }
                                
                                                    else if (currentKey.indexOf("Marker") == -1 && allKeys.indexOf(currentKey) == -1) {
                                                        eachMultuMapObject["isPremap"] = true;
                                                        var copyText = currentObj[currentKey];
                                
                                                        currentRowObject["content"] = copyText;
                                                        currentRowObject["contentRTE"] = copyText;
                                                        copyTextContentJSON = copyTextContentJSON + copyText;
                                                    }
                                                    else {
                                                        var attributeId = currentKey.replace(PATTERN_SPCIAL_CHAR, "-");
                                                        currentRowObject["key"] = currentKey;
                                
                                                        var copyTextRTE = $("#" + attributeId).attr("copyTextRTE");
                                                        var copyText = $("#" + attributeId).attr("copyText");
                                                        var gs1Key = $("#" + attributeId).attr("gs1Type");
                                                        if (isBaseSequenceApplicable && isEmpty(copyTextRTE)) {
                                                            var currentRow = "#" + attributeId;
                                                            var searchKey = $(currentRow).attr("gs1Type") + "|" + $(currentRow).attr("instanceSequence");
                                                            var elementInfo = baseCopyTextBySequence[searchKey];
                                                            if ($(currentRow).attr("subSturcturedElement") == "true") {
                                                                var parentKey = $(currentRow).attr("UniqueKey").split(":")[1];
                                                                elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                                                            }
                                                            if ($(currentRow).attr("subSturcturedElement") == "true") {
                                                                var parentKey = $(currentRow).attr("UniqueKey").split(":")[1];
                                                                elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                                                            }
                                                            var baseCopyElementInfo = elementInfo[baseSequenceNumber];
                                                            copyTextRTE = baseCopyElementInfo["copyTextRTE"];
                                                            copyText = baseCopyElementInfo["copyText"];
                                                            gs1Key = baseCopyElementInfo["gs1Key"];
                                                        }
                                
                                
                                                        if (!isEmpty(copyTextRTE)) {
                                                            currentRowObject["content"] = copyText;
                                                            currentRowObject["gs1Key"] = gs1Key;
                                                            currentRowObject["contentRTE"] = copyTextRTE;
                                                            copyTextContentJSON = copyTextContentJSON + copyTextRTE;
                                                        }
                                                    }
                                                    multiMappedElements.push(currentRowObject);
                                                });
                                                eachMultuMapObject["combinedCopyText"] = generateJSONForCopytext(copyTextContentJSON);
                                                eachMultuMapObject["multMapKey"] = multiMapKey;
                                                eachMultuMapObject["eachMultiMapCopyText"] = eachMultiMapCopyText;
                                                eachMultuMapObject["multiMappedElements"] = multiMappedElements;
                                                assemblyMultiMappings.push(eachMultuMapObject);
                                
                                                promises.push(new Promise((resolve1, reject) => {
                                                    Q.SyncElement(multiMapKey, generateJSONForCopytext(copyTextContentJSON), false, resolve1);
                                                }));
                                            }
                                        }
                                    });
                                    returnObject["assemblyMultiMappings"] = assemblyMultiMappings;
                                    Q.updateMulitMapContents(JSON.stringify(returnObject), true, resolve);
                            
                                // Multimap sync for Non-selectAll sync --- End
                                });
                            }));
                        }
                    } else if ($(that).attr("artworkType") == "graphic") {
                        Q.SyncGraphicElement(UKey);
                    }
                }
                hasKeyResolve();
            });
        });
    });

    // Select All sync for Multimap --  IR-569278-3DEXPERIENCER2018x and IR-571948-3DEXPERIENCER2018x
    if (canSyncAll) {
        for (var key in parsedJSONTypes) {
            var copyTextContentJSON = "";
            var elemTypes = parsedJSONTypes[key];

            var isPremap = false;
            if (elemTypes.length > 0) {
                $.each(elemTypes.split(","), function (index, type) {
                    var isMarker = type.indexOf("Marker") != -1;
                    if (isMarker) {
                        var seperator = type.split("|")[1];
                        var regex = /\\n/gim;
                        if (seperator.match(regex))
                            seperator = seperator.replace(regex, "\r");

                        copyTextContentJSON = copyTextContentJSON + seperator;
                    }

                    type = type.replace(PATTERN_SPCIAL_CHAR, "-");
                    var contentRTE = $("#" + type).attr("copytextrte");
                    var instanceSequence = $("#" + type).attr("instanceSequence");
                    if (!isMarker && instanceSequence === undefined) {
                        isPremap = true;
                        return true;
                    } else if (isEmpty(contentRTE) && isBaseSequenceApplicable) {
                        var gs1Key = $("#" + type).attr("gs1Type");
                        var currentRow = "#" + type;
                        var searchKey = $(currentRow).attr("gs1Type") + "|" + $(currentRow).attr("instanceSequence");
                        var elementInfo = baseCopyTextBySequence[searchKey];
                        if ($(currentRow).attr("subSturcturedElement") == "true") {
                            var parentKey = $(currentRow).attr("UniqueKey").split(":")[1];
                            elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                        }
                        var baseCopyElementInfo = elementInfo[baseSequenceNumber];
                        contentRTE = baseCopyElementInfo["copyTextRTE"];
                    }
                    if (!isEmpty(contentRTE)) {
                        copyTextContentJSON = copyTextContentJSON + contentRTE;
                    }
                });
                copyTextContentJSON = generateJSONForCopytext(copyTextContentJSON);
                //Q.generateJSONForCopytext(copyTextContentJSON, function(val){
                        if (!isPremap){
                            promises.push(new Promise((resolve, reject)=>{
                                Q.SyncElement(key, copyTextContentJSON, canSyncAll, resolve);
                            }));
                        }
               //});
            }
        }
        promises.push(updateMultiMappedElements("", true));
        // Select All sync for Multimap --End--  IR-569278-3DEXPERIENCER2018x and IR-571948-3DEXPERIENCER2018x
    }
    // Q.updateStatusColumns();

    if(!hasKeyPromise)
    {
        hasKeyPromise=new Promise((res, rej)=>res);
    }

    hasKeyPromise.then(()=>{
        Promise.all(promises).then(function() {
            removeProgessInfo();  
            setTimeout(refreshArtworkAssemblyTable);
        });
    });
}

function sendElementJsonDataToConnector() {
    // return;
    var jsonMap = {};
    if ($("#artworkAssemblyTableBody") !== undefined) {
        $("#artworkAssemblyTableBody>tr").each(function () {
            var elementId = $(this).attr("id");
            //var jsonData = getJsonForElementDataToSend(elementId);
            var jsonData = getJsonForElementData(elementId);
            //contentJSONRTE
            jsonMap[elementId] = jsonData;
               Q.updateJsonMapForElementKey(elementId, jsonData);
        });
    }
    return jsonMap;

}

function addElementToPanel(event) {
    //enable checkbox
    addProgessInfo();
    var selectedRow = $("tr.highlight");

    //IR-526498-3DEXPERIENCER2018x:: Fix
    if (selectedRow.length == 0) {
        //IR-581111 - Uniform alert box
        Q.showJavaScriptAlert(ARTWORK_PANEL_LABLES['emxAWL.Message.NoElementSelected']);
        removeProgessInfo();
        return;
    }

    if (selectedRow.length > 1) {
        //IR-581111 - Uniform alert box
        Q.showJavaScriptAlert(ARTWORK_PANEL_LABLES['emxAWL.Message.TooManyElementSelected']);
        removeProgessInfo();
        return;
    }

    var elementKey = $(selectedRow).attr("id");

    $(selectedRow).find("input:checkbox").attr("disabled", false);

    if ($(selectedRow).attr("artworkType") == "graphic") {
        var hasAttachment = $(selectedRow).attr("hasAttachment");
        if (hasAttachment == "false") {
            //IR-581111 - Uniform alert box
            Q.showJavaScriptAlert(ARTWORK_PANEL_LABLES['emxAWL.Message.NoGraphicAssociatedWithElement']);
            removeProgessInfo();
            return;
        }
    }

    var jsonData = getJsonForElementData(elementKey);
    Q.MapArt(jsonData);

    //    var isCopyElement = $(selectedRow).attr("artworkType") == "Copy";
    //    var typeInstLocaleSeqInfo = $(selectedRow).attr("data-key");
    //    if (isCopyElement) {
    //
    //        var copyText = getElementCopyTextRTE(elementKey);
    //        var parenKey = $(selectedRow).attr("parentInfo");
    //
    //        if ($(selectedRow).attr("subSturcturedElement") == "true") {
    //            parenKey = parenKey.replace(/-/g, "|");
    //            Q.CreateStructureArt(typeInstLocaleSeqInfo, copyText, parenKey);
    //        } else
    //            Q.CreateArt(typeInstLocaleSeqInfo, copyText);
    //
    //    } else {
    //        var hasAttachment = $(selectedRow).attr("hasAttachment");
    //        if (hasAttachment == "false") {
    //            alert(ARTWORK_PANEL_LABLES['emxAWL.Message.NoGraphicAssociatedWithElement']);
    //            return;
    //        }
    //        Q.createGraphicArt(typeInstLocaleSeqInfo, $(selectedRow).attr("objectId"), $(selectedRow).attr("modifiedTimeStamp"));
    //    }
    if ($('#hideMappedElements').hasClass('selected'))
        selectedRow.toggleClass("highlight");
    removeProgessInfo();
    Q.repaintPanel();
}

function addLinkIconToElementRow(elementKey) {
    var id = elementKey.replace(PATTERN_SPCIAL_CHAR, "-");
    var selectedRow = $("#" + id);
    var statusColumn = selectedRow.find("td.statusColumn");
    if (!statusColumn.hasClass("linkedToConnector")) {
        statusColumn.addClass("linkedToConnector");
        //var statusLinkImage = getCommandsImageHTML("artworkTypeImage", "iconSmallLinkedObject.png");
        var linkSpan = $(statusColumn).find('.linkSpan');
        //linkSpan.append(statusLinkImage);
    }
}

function removeElementFromPanel(event) {
    Q.RemoveArt();
    Q.repaintPanel();
    hideMappedElements(false);
}

function removeLinkIcon(jsKey) {
    var selectedRow = $("#" + jsKey);
    var statusColumn = selectedRow.find("td.statusColumn");
    if (statusColumn.hasClass("linkedToConnector")) {
        statusColumn.removeClass("linkedToConnector");
        // statusColumn.find("img").remove();
    }
}

function getElementCopyTextRTE(elementKey) {
    //TODO check if element is present in panel first.
    var selectedRow = $("#" + elementKey.replace(PATTERN_SPCIAL_CHAR, "-"));
    if (selectedRow != undefined) {
        var copyText = "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en'><head><title /></head><body><contentData>" + $(selectedRow).attr("copyTextRTE") + "</contentData></body></html>";
        copyText = generateJSONForCopytext($(selectedRow).attr("copyTextRTE"));
        return copyText;
    }
    // return "<html><body><b>"+ $(selectedRow).attr("copyTextRTE")+"</b></body></html>";
}

// Clean up
// function getElementTimeStamp(elementKey) {
// var selectedRow = $("#" + elementKey);
// return $(selectedRow).attr("modifiedTimeStamp");
// }

// Clean up
// function isElementPresentInPanel(aiKey) {
// var jsKey = aiKey.replace(/\|/g, "-");
// return ($("#" + jsKey).length == 0 ? false : true);
// }

// Clean up
// function isTextContentMatching(key, text) {
// var row = $("#" + key);
// var copyText = $(row).attr("copyText");
// return (copyText === text) ? true : false;
// }

function refreshArtworkAssemblyTable(event) {
    addProgessInfo();
    selectionSequenceArray = [];
    if (!isXMLCheck) {
        Q.getDocumentPOA(function (docPOAName) {
            if (docPOAName != "")
                updateArtworkAssembly(docPOAName);
            else
                Q.showJavaScriptAlert(ARTWORK_PANEL_LABLES['emxAWL.Message.POANotAssociated']);//IR-581111 - Uniform alert box
        });
    }
    else {
        updateMultiMappedElements("", false, function () {
            Q.saveQDOMToXMP();
        });
    }
    Q.removeInvalidArtsFromDocumentDictionary();
    Q.saveAllCompareResult(function (){
        Q.PostSelectSync(function (){
            removeProgessInfo();
        });
    });
}

// Used to support Sync and Refresh for multi map elements. --  IR-569278-3DEXPERIENCER2018x and IR-571948-3DEXPERIENCER2018x
// Pass the parameter "toSync" as true for sync and false for refresh
function updateMultiMappedElements(docPOAName, toSync) {
    var returnObject = {};
    var allKeys = new Array();
    $(".artworkAssembly").each(function () {
        var jsKey = $(this).attr("id");
        var aiKey = $(this).attr("UniqueKey");
        var isCopyElement = $(this).attr("artworkType") == "Copy";
        if (isCopyElement)
            allKeys.push(aiKey);
    });

    var returnMultiMapInfoObject = {
        "isPremap": false,
    };

    if (allKeys.length == 0)
        return;

    return new Promise((resolve, reject)=>{

        Q.getMultiMapInfo("", function (returnValue) {
            //console.log("Q.getMultiMapInfo: " + returnValue)
            var info = $.parseJSON(returnValue);
            var assemblyMultiMappings = [];
            $.each(info, function (multiMapKey, associatedElementKeysString) {
                //console.log("multimapinfo- each: " + multiMapKey)
                var eachMultuMapObject = {
                    "isPremap": false
                };
                var copyTextContentJSON = "";
                var associatedElementKeys = associatedElementKeysString;
                if (associatedElementKeys.length > 0) {
                    var eachMultiMapCopyText = {};
                    var multiMappedElements = [];;
                    $.each(associatedElementKeys, function (index, currentObj) {
                        var currentKey = Object.keys(currentObj)[0];
                        var currentRowObject = {};

                    if (currentKey.indexOf("Marker") != -1) {
                        var posOfPipeSep = currentKey.indexOf("|");
                        var size = currentKey.length;
                        var seperator = currentKey.substring(posOfPipeSep + 1, size);
                        currentRowObject["content"] = seperator;
                        currentRowObject["key"] = currentKey;
                        currentRowObject["contentRTE"] = seperator;
                        copyTextContentJSON = copyTextContentJSON + seperator;
                    }

                    else if (currentKey.indexOf("Marker") == -1 && allKeys.indexOf(currentKey) == -1) {
                        eachMultuMapObject["isPremap"] = true;
                        var copyText = currentObj[currentKey];

                        currentRowObject["content"] = copyText;
                        currentRowObject["contentRTE"] = copyText;
                        copyTextContentJSON = copyTextContentJSON + copyText;
                    }
                    else {
                        var attributeId = currentKey.replace(PATTERN_SPCIAL_CHAR, "-");
                        currentRowObject["key"] = currentKey;

                        var copyTextRTE = $("#" + attributeId).attr("copyTextRTE");
                        var copyText = $("#" + attributeId).attr("copyText");
                        var gs1Key = $("#" + attributeId).attr("gs1Type");

                        if (isBaseSequenceApplicable && isEmpty(copyTextRTE)) {
                            var currentRow = "#" + attributeId;
                            var searchKey = $(currentRow).attr("gs1Type") + "|" + $(currentRow).attr("instanceSequence");
                            var elementInfo = baseCopyTextBySequence[searchKey];
                            if ($(currentRow).attr("subSturcturedElement") == "true") {
                                var parentKey = $(currentRow).attr("UniqueKey").split(":")[1];
                                elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                            }
                            if ($(currentRow).attr("subSturcturedElement") == "true") {
                                var parentKey = $(currentRow).attr("UniqueKey").split(":")[1];
                                elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                            }
                            var baseCopyElementInfo = elementInfo[baseSequenceNumber];
                            copyTextRTE = baseCopyElementInfo["copyTextRTE"];
                            copyText = baseCopyElementInfo["copyText"];
                            gs1Key = baseCopyElementInfo["gs1Key"];
                        }

                        if (!isEmpty(copyTextRTE)) {
                            currentRowObject["content"] = copyText;
                            currentRowObject["gs1Key"] = gs1Key;
                            currentRowObject["contentRTE"] = copyTextRTE;
                            copyTextContentJSON = copyTextContentJSON + copyTextRTE;
                        }
                    }
                    multiMappedElements.push(currentRowObject);
                });
                eachMultuMapObject["combinedCopyText"] = generateJSONForCopytext(copyTextContentJSON);
                eachMultuMapObject["multMapKey"] = multiMapKey;
                eachMultuMapObject["eachMultiMapCopyText"] = eachMultiMapCopyText;
                eachMultuMapObject["multiMappedElements"] = multiMappedElements;
                assemblyMultiMappings.push(eachMultuMapObject);
            }
        });
        returnObject["assemblyMultiMappings"] = assemblyMultiMappings;
            resolve();
        Q.updateMulitMapContents(JSON.stringify(returnObject), toSync);
        });
    });
}

function removeOutOfSyncIcon(elementKey) {
    var selectedRow = $("#" + elementKey);
    var statusColumn = selectedRow.find("td.statusColumn");
    statusColumn.removeClass("syncElement");
    var outOfSyncSpan = $(statusColumn).find('.outOfSyncSpan');
    $(outOfSyncSpan).find(".artworkTypeImage").remove();
}


function updateArtworkAssembly(poaName, fromSync, canSyncAll) {
    addProgessInfo();
	var clientTimeZoneValue = new Date().getTimezoneOffset()/60;
    if (!isProcessing) {
        isProcessing = true;
        $.ajax({
            data: {
                poaName: poaName,
				timeZone: clientTimeZoneValue
            },
            url: getPOAArtworkAssemblyUrl,
            success: function (data) {
                isProcessing = false;
                objectData = $.parseJSON(data);
                objectData = objectData.data;
                updateArtworkAssemblyTable(objectData.artworkAssemblyInfo);
                updateGDTaskCommmand(poaName);
                //updateMultiMappedElements(poaName);
                removeProgessInfo();
                Q.repaintPanel();
                //Q.updateCompleteArtworkAssemblyJSONData(getAssemblyElementsJSONFromGlobalVar(true));

                if (fromSync) {
                    Q.getMultiMapInfoForSync(canSyncAll, function (resultValue) {
                        parsedJSONTypes = $.parseJSON(resultValue);	    // parsedJSONTypes will actually contain Multimap info	
                        var syncValueBoolean = parsedJSONTypes.syncValueBoolean;
                        if (syncValueBoolean) {
                            delete parsedJSONTypes['syncValueBoolean'];
                            syncAllOrSelectedElementsInArtworkAssembly(".artworkAssembly", parsedJSONTypes, parsedJSONTypes.canSyncAll);
                        }
                        //return;
                    });
                }
            }
        });
    }
    removeProgessInfo();
}

function clearArtworkAssemblyPanelHeader() {
    $('#poaName').find('span').remove();
    $("#description").empty();
    $("#languages").empty();
    $("#countries").empty();
    $("#placeoforigin").empty();
    $("#promoteTaskbtn").hide();
    $("#poaName").removeClass("highlightPOA");
    $("#collapsePoa").hide();
    $("#expandPoa").hide();
}

function clearArtworkAssemblyPanel() {
    clearArtworkAssemblyPanelHeader();
    $("#poainfo").empty();
    $("#artworkAssemblyTableBody").empty();
    $("#note").empty();
    $("#preview").empty();
    Q.clearEntries();
    Q.repaintPanel();
}
var globalAAData;
var assemblyElemJson;
var assemblyElemJsonWithGraphics;
var globalLanguageSeqMap = {};

function updateArtworkAssemblyPanel(poaName) {
    clearArtworkAssemblyPanel();
    addProgessInfo();
    $.ajax({
        data: {
            poaName: poaName
        },
        url: getPOAArtworkAssemblyUrl,
        success: function (data) {
            objectData = $.parseJSON(data);
            isProcessing = false;
            objectData = $.parseJSON(data);
            var returnResponse = objectData.result;
            if (returnResponse == "failure") {
                Q.showNotification(objectData.data);
            } else {
                objectData = objectData.data;
                manageLockStatus(objectData.POABasicInfo.lockPOAStatus);
                updatePOAInfo(objectData);
                enableCommands();
                isXMLCheck = false;
                updateArtworkAssemblyTable(objectData.artworkAssemblyInfo);
                updateGDTaskCommmand(objectData.POABasicInfo.name);
                updateEditPOAsCommand();
                Q.repaintPanel();
            }
            //removeProgessInfo();
            //updateCompleteAAJSONDataAndUpdateModText(getAssemblyElementsJSONFromGlobalVar(true));
        }
    });
    Q.repaintPanel();
    removeProgessInfo();
}

function updateEditPOAsCommand() {
    $("#addExistingElementSeparator").hide();
    $("#addExistingElement").hide();
    $.ajax({
        url: hasCAPLicense,
        success: function (data) {

            $.ajax({
                url: hasLeaderRole,
                error: function (data) {
                    $("#addExistingElementSeparator").hide();
                    $("#addExistingElement").hide();
                    Q.logUserAccessError("Cannot complete this action, you does not have required access to perform this action.");
                },
                success: function (data) {
                    $("#addExistingElementSeparator").show();
                    $("#addExistingElement").show();
                }
            });
        },
        error: function (data) {
            $("#addExistingElementSeparator").hide();
            $("#addExistingElement").hide();
            Q.logUserAccessError("Cannot complete this action, you does not have required licenses to perform this action. Please contact administrator.");
        }
    });
}

function updateGDTaskCommmand(poaName) {
    $.ajax({
        data: {
            poaName: poaName
        },
        url: getGDTaskUrl,
        success: function (data) {
            if (data == undefined) {
                $("#promoteTaskbtn").hide();
            } else {
                objectData = $.parseJSON(data);
                var result = objectData.result;
                if (result == "success") {
                    $("#promoteTaskbtn").show();
                } else {
                    $("#promoteTaskbtn").hide();
                    Q.showNotification(objectData.data);
                }
            }
        }
    });
}


function promoteGDTask(poaName, comments) {
    if (!isTaskProcessing) {
        isTaskProcessing = true;
    }
    $.ajax({
        data: {
            taskComments: comments,
            POAName: poaName
        },
        url: promoteGDTaskUrl,
        success: function (data) {
            isTaskProcessing = false;
            objectData = $.parseJSON(data);
            var result = objectData.result;
            if (result == "success") {
                $("#promoteTaskbtn").hide();
            }
            Q.showNotification(objectData.data);
        }
    });
}

function hidePromoteTaskCommand() {
    $("#promoteTaskbtn").hide();
}

function togglePOADetails(event) {
    $('img', this.event.currentTarget).toggle();
    $(".descriptionBox").toggle();

    if ($(".descriptionBox").css("display") == "none")
        $("header").css("height", "66px");
    else
        $("header").css("height", "140px");

    var margin_top = parseInt($("header").css("height"));
    $("section").css("top", margin_top);
    Q.repaintPanel();
}

function updatePOAInfo(objectData) {
    clearArtworkAssemblyPanelHeader();
    var poaInfo = objectData.POABasicInfo;

    var countriesArray = Array();
    $.each(objectData.CountryInfo, function (indx, eachCountryInfo) {
        countriesArray.push(eachCountryInfo.name);
    });

    var poaNameSpan = $("<span>").attr("id", "poaHeader").append(getCommandsImageHTML("", "iconSmallPOA.png")).append(" " + poaInfo.name);
    $("#poaName").append(poaNameSpan);
    if (poaInfo.description != null)
        $("#description").append(getElipsisSpanFromString(poaInfo.description, 40, "poaContentInfo"));

    if (poaInfo.id != null)
        $("#description").attr("poaID", poaInfo.id);

    $("#placeoforiginLabel").html(ARTWORK_PANEL_LABLES['emxAWL.Table.PlaceOfOrigin']);
    $("#placeoforigin").append(objectData.ProductInfo.name);
    $("#countries").append(getObjectSpanWithTooltip(getNameArrayFromJSON(objectData.CountryInfo, 'name'), "poaContentInfo"));
    $("#languages").append(getObjectSpanWithTooltip(getNameArrayFromJSON(objectData.LanguageInfo, 'name', true), "poaContentInfo"));

    updateGlobalLanguageMap(objectData.LanguageInfo);
    Q.repaintPanel();
}

function updateGlobalLanguageMap(objectData) {
    $.each(objectData, function (indx, eachObjectInfo) {
        if (eachObjectInfo.seq)
            globalLanguageSeqMap[eachObjectInfo.name] = eachObjectInfo.seq;
        else
            globalLanguageSeqMap[eachObjectInfo.name] = indx + 1;
    });
}

function updateArtworkAssemblyTable(artworkAssemblyData) {
    decoratePOAInfo();
    $("#artworkAssemblyTableBody").empty();
    var artworkAssemblyDataArray = [];
    for (var currentID in artworkAssemblyData) {
        artworkAssemblyDataArray.push(artworkAssemblyData[currentID]);
    }

    // Update Global variable containing Artwork Assembly data
    globalAAData = artworkAssemblyDataArray;
    //	assemblyElemJson = getAssemblyElementsJSONFromGlobalVar(false);
    //	assemblyElemJsonWithGraphics = getAssemblyElementsJSONFromGlobalVar(true);

    //Sort elements
    sortArtworkAssemblyData(artworkAssemblyDataArray, "artworkAssemblyTable");
    $.each(artworkAssemblyDataArray, function (indx, row) {
        var gs1Type = row["gs1Type"];
        var instanceSequence = row["instanceSequence"];
        var localeSequence = row["localeSequence"];
        var generatedUniqueKey = gs1Type + "|" + instanceSequence;
        var currentElementInfo = baseCopyTextBySequence[generatedUniqueKey] || {};
        baseCopyTextBySequence[generatedUniqueKey] = currentElementInfo;
        var isFromGS1XML = row.id == 'fromGS1XML' ? true : false;
        if (row.NutritionInfo != null && row.NutritionInfo.length > 0) {
            $.each(row.NutritionInfo, function (index, structuredRow) {
                var seGS1Type = structuredRow["gs1Type"];
                var seInstanceSequence = structuredRow["instanceSequence"];
                var generatedUniqueKeyForSE = seGS1Type + "|" + seInstanceSequence;
                var currentSEInfo = currentElementInfo[generatedUniqueKeyForSE] || {};
                var seLocaleSequence = structuredRow["localeSequence"];
                currentElementInfo[generatedUniqueKeyForSE] = currentSEInfo;


                var currentInfo = {};
                var copyText = structuredRow.COPY_TEXT;
                var copyTextRTE = structuredRow.copyTextRTE;
                if (isFromGS1XML) {
                    copyText = decodeHTML(copyText);
                    copyTextRTE = decodeHTML(copyTextRTE);
                }
                if (copyText) {
                    var index = hasRTLTag(copyText);
                    if (index > 0) {
                        copyText = copyText.substring(index);
                    }
                }
                currentInfo["generate-json-copy-text"] = generateJSONForCopytext(copyTextRTE);
                currentInfo["copyTextRTE"] = copyTextRTE;
                currentInfo["copyText"] = copyText;
                currentInfo["gs1Key"] = structuredRow["gs1Type"];
                currentSEInfo[seLocaleSequence] = currentInfo;
            });
        } else {
            var currentInfo = {};
            var copyText = row.COPY_TEXT;
            var copyTextRTE = row.copyTextRTE;
            if (isFromGS1XML) {
                copyText = decodeHTML(copyText);
                copyTextRTE = decodeHTML(copyTextRTE);
            }
            if (copyText) {
                var index = hasRTLTag(copyText);
                if (index > 0) {
                    copyText = copyText.substring(index);
                }
            }
            currentInfo["generate-json-copy-text"] = generateJSONForCopytext(row["copyTextRTE"]);
            currentInfo["copyTextRTE"] = copyTextRTE;
            currentInfo["copyText"] = copyText;
            currentInfo["gs1Key"] = row["gs1Key"];
            currentElementInfo[localeSequence] = currentInfo;
        }
    });
    Q.getDocumentPOA(function (returnValue) {
        var isXML = returnValue.indexOf(".xml") != -1;

        $.each(artworkAssemblyDataArray, function (indx, row) {
            addRow(row, isXML);
            if (row.NutritionInfo != null && row.NutritionInfo.length > 0) {
                sortArtworkAssemblyData(row.NutritionInfo, "artworkAssemblyTable");
                $.each(row.NutritionInfo, function (index, structuredRow) {
                    addRow(structuredRow, isXML);
                });
            }
        });
        handleTableResize();
    });

    //   Q.PostSelectSync();

    //Update variables on Cpp side
    Q.updateCompleteAAJSONDataAndUpdateModText(getAssemblyElementsJSONFromGlobalVar(true), function () {
        Q.updateArtworkAssemblyJSONData(getAssemblyElementsJSONFromGlobalVar(false));
        updateElements();
        Q.PostSelectSync();
        Q.repaintPanel();
    });

    //    Q.updateCompleteAAJSONDataAndUpdateModText(assemblyElemJsonWithGraphics, function(){
    //		Q.updateArtworkAssemblyJSONData(assemblyElemJson);
    //		updateElements();
    //	    Q.PostSelectSync();
    //	    Q.repaintPanel();
    //	});		



}

function decoratePOAInfo() {
    $("#expandPoa").show();
    $("#poaName").addClass("highlightPOA");
}

function sortAccordingToMappings() {
    var targetColumn = $(event.currentTarget).closest('th');
    var table = $(event.currentTarget).parent().closest('table');
    var index = $(event.currentTarget).closest('th').index();

    if (index != 7)
        return;

    var rows = table.find('tr:gt(0)').toArray();

    var arrayOfMapped = [];
    var alreadyProcessedSubStructures = [];
    //var arrayOfOutOfSync = [];
    var finalArray = [];

    for (var i = 0; i < rows.length; i++) {
        var currentRow = rows[i];

        var statusColumn = $(currentRow).find("td.statusColumn");
        var isMapped = statusColumn.hasClass("linkedToConnector");
        var isSubStructured = $(currentRow).attr("subSturcturedElement") == "true";

        if (alreadyProcessedSubStructures.indexOf(currentRow) != -1)
            continue;

        if (isMapped) {
            if (isSubStructured) {
                var structureArray = [];
                if (structureArray.indexOf(currentRow) != -1)
                    continue;

                structureArray.push(currentRow);

                var uniqueKey_SubStructure = $(currentRow).attr("UniqueKey");
                var uKLength = uniqueKey_SubStructure.length;
                var colonIndex = uniqueKey_SubStructure.indexOf(":");
                var uniqueKey_Parent = uniqueKey_SubStructure.substring(colonIndex + 1, uKLength);

                for (var j = 0; j < rows.length; j++) {
                    var row = rows[j];
                    var isStructuredRoot = $(row).attr("structuredRoot") == "true";
                    var isSubStructuredElement = $(row).attr("subSturcturedElement") == "true";

                    if (!isStructuredRoot && !isSubStructuredElement)
                        continue;

                    if (alreadyProcessedSubStructures.indexOf(row) != -1 || structureArray.indexOf(row) != -1)
                        continue;

                    if (isStructuredRoot) {
                        if ($(row).attr("UniqueKey") == uniqueKey_Parent)
                            structureArray.splice(structureArray.indexOf(currentRow), 0, row);
                    }

                    if (isSubStructuredElement) {
                        var uK_SubStructure = $(row).attr("UniqueKey");
                        var uK_Length = uK_SubStructure.length;
                        var colon_Index = uK_SubStructure.indexOf(":");
                        var uK_Parent = uK_SubStructure.substring(colon_Index + 1, uK_Length);

                        if (uK_Parent == uniqueKey_Parent)
                            structureArray.splice(structureArray.indexOf(currentRow) + 1, 0, row);
                    }
                }

                // Sort the formed Structured elements array
                var lastIndexAdded = 0;
                var sortedStructureArray = structureArray;
                var parentIndex = 0;

                for (var k = 0; k < structureArray.length; k++) {
                    var currentStructureRow = structureArray[k];

                    if ($(currentStructureRow).attr("structuredRoot") == "true") {
                        parentIndex = k;
                        continue;
                    }

                    if ($(currentStructureRow).attr("subSturcturedElement") == "true") {
                        var isSubStructuredMapped = $(currentStructureRow).find("td.statusColumn").hasClass("linkedToConnector");

                        if (isSubStructuredMapped) {
                            if (lastIndexAdded == 0) {
                                sortedStructureArray.splice(k, 1);
                                sortedStructureArray.splice(1, 0, currentStructureRow);
                                lastIndexAdded = 1;
                            } else {
                                sortedStructureArray.splice(sortedStructureArray.indexOf(currentStructureRow), 1);
                                sortedStructureArray.splice(lastIndexAdded + 1, 0, currentStructureRow);
                                lastIndexAdded++;
                            }
                        }
                    }

                }

                var parentArr = sortedStructureArray.splice(parentIndex, 1);

                // Ascending or descending
                if ($(targetColumn).attr("sorted") == "ascending") {
                    // Reverse the sort for descending
                    sortedStructureArray = sortedStructureArray.reverse();
                }

                sortedStructureArray.splice(parentIndex, 0, parentArr[0]);

                alreadyProcessedSubStructures = alreadyProcessedSubStructures.concat(sortedStructureArray);

                finalArray = finalArray.concat(sortedStructureArray);

            } else {
                finalArray.push(currentRow);
            }
        }
    }

    // Ascending or descending
    if (!$(targetColumn).attr("sorted")) {
        $(targetColumn).attr("sorted", "ascending");
        finalArray = finalArray.reverse();
        for (var i = 0; i < finalArray.length; i++) { table.prepend($(finalArray[i])); }
    } else {
        if ($(targetColumn).attr("sorted") == "ascending") {
            for (var i = 0; i < finalArray.length; i++) { table.append($(finalArray[i])); }
            $(targetColumn).attr("sorted", "descending");
        } else if ($(targetColumn).attr("sorted") == "descending") {
            $(targetColumn).attr("sorted", "ascending");
            finalArray = finalArray.reverse();
            for (var i = 0; i < finalArray.length; i++) { table.prepend($(finalArray[i])); }
        }
    }

}

/*
    Adding the row to Table
*/
function addRow(row, isXML) {
    var isFromGS1XML = row.id == 'fromGS1XML' ? true : false;
    var isSubSturcturedElement = row.subSturcturedElement == "true";
    var copyTypeName = row.isNoTranslate == true ? "NoTranslate" : row.isInlineCopy == true ? "Inline" : "";
    var copyTypeImageName = row.isNoTranslate == true ? "AWLiconStatusNoTranslation.gif" :
        row.isInlineCopy == true ? "AWLiconStatusInlineTranslation.gif" :
            row.artworkType == "Structure" == true ? "AWLStructureCopy.png" :
                row.artworkType == "graphic" == true ? "iconSmallArtworkElement.png" : "iconActionRichTextEditor.png";
    var typeImageName = row.artworkType == "Copy" ? copyTypeImageName : "iconSmallArtworkElement.png";
    var typeImageSpan = $("<span>").append(getCommandsImageHTML("artworkTypeImage", copyTypeImageName));

    var gs1Type = row.gs1Type;
    var InstanceSequence = row.instanceSequence;
    var CurrentState = row.lc_CurrentState
    if (row.lc_CurrentState == undefined) {
        CurrentState = "";
    }
    if (!bContentWrapped) {
        gs1Type = (gs1Type.length > 50) ? gs1Type.substr(0, 50).trim() + ".." : gs1Type;
        InstanceSequence = (InstanceSequence.length > 50) ? InstanceSequence.substr(0, 50).trim() + ".." : InstanceSequence;
        CurrentState = (CurrentState.length > 50) ? CurrentState.substr(0, 50).trim() + ".." : CurrentState;
    }

    var typeText = $("<span>").addClass("artworkTypeText").append(gs1Type);
    var elementKey = $("<td>").append(typeImageSpan).append(typeText);
    var instanceSequence = $("<td>").addClass("artworkInstanceSequence").append(row.instanceSequence);
    var langaugeName = $("<td>").addClass("artworkLanguage").append(row.isInlineCopy ? getObjectSpanWithTooltipWithFixedLength(row.languageName.split(","), "poaContentInfo", 1) : row.languageName);
    var currenState = $("<td>").addClass("artworkState").append(row.lc_CurrentState);
    // new columns RRR1
    //var notesValue = (row.notes.length>15)? row.notes.substr(0,15).trim()+".." : row.notes.substr(0,15) ;
    var notesValue = row.notes;
    if (!bContentWrapped) {
        notesValue = (notesValue.length > 50) ? notesValue.substr(0, 50).trim() + ".." : notesValue;
    }

    if (isFromGS1XML)
        notesValue = decodeHTML(notesValue);
    var notes = $("<td>").html(notesValue);

    var contentValue = (row.artworkType == "graphic") ? "" : isFromGS1XML ? decodeHTML(row.copyTextRTE) : row.copyTextRTE;
    contentValue = (contentValue.length > 50) ? contentValue.substr(0, 50).trim() + ".." : contentValue;

    if (isFromGS1XML)
        contentValue = decodeHTML(contentValue);
    var content = $("<td>").html(contentValue);

    var status = $("<td>").attr("class", "statusColumn");
    var linkSpan = $("<span>").addClass("linkSpan");
    var outOfSyncSpan = $("<span>").addClass("outOfSyncSpan");
    status.append(linkSpan).append(outOfSyncSpan);

    var checkbox = $("<input type=checkbox />");
    checkbox.addClass("syncCheckbox");
    var label = $("<label>").attr("class", "checkboxIcon");
    var selectionSequenceSpan = $("<span>").addClass("selectionSequenceSpan");
    checkbox.click(function () {
        $(this).closest("tr").toggleClass("selected");
        updateSelectedElementList();
    });
    checkbox.change(function () {
        updateSelectedElementList();
    });
    var currentTD = $("<td>").attr({ class: "checkbox" });
    var elementKey = $("<td>").attr({ class: "copyElementType" });
    var langaugeName = $("<td>").attr({ class: "language" });
    var instanceSequence = $("<td>").attr({ class: "tableHeaderImagesCell" });
    var content = $("<td>").attr({ class: "content" });
    var notes = $("<td>").attr({ class: "notes" });
    var currentState = $("<td>").attr({ class: "order" });
    var statusColumn = $("<td>").attr({ class: "statusColumn" });
    if (isSubSturcturedElement) {
        currentTD.append("   ").append(checkbox).addClass("preserveSpaces").append(label).append(selectionSequenceSpan);
        elementKey.append("  ").addClass("preserveSpaces");
        currentState.addClass("preserveSpaces")
        instanceSequence.addClass("preserveSpaces")
        statusColumn.addClass("preserveSpaces");
    } else {
        currentTD.append(row.isStructuredRoot == "true" ? "" : checkbox).append(label).append(selectionSequenceSpan);
    }
    elementKey.append(typeImageSpan).append(typeText);
    //currentState.append(row.lc_CurrentState);
    currentState.append(CurrentState);

    var contentValue = (row.artworkType == "graphic") ? "" : isFromGS1XML ? decodeHTML(row.copyTextRTE) : row.copyTextRTE;
    if (contentValue) {
        var index = hasRTLTag(contentValue);
        if (index > 0) {
            contentValue = contentValue.substring(index);
        }
    }

    var that = content;
    Q.getJSONOfTagsFromRTEContent(contentValue, function (jsonTags) {
        var jasonData = JSON.parse(jsonTags);

        var content = "";
        var rteContent = "";

        var firstData = "";
        var startingTagsOfFirstdata = "";
        var firstTag = "";

        if (jasonData.length > 0) {
            firstData = jasonData[0];
            startingTagsOfFirstdata = firstData["starting-tags"];
            if (startingTagsOfFirstdata.length > 0) {
                firstTag = startingTagsOfFirstdata[0].tagName;
            }
        }

        for (var i = 0; i < jasonData.length; i++) {
            var data = jasonData[i];
            var sTags = "";
            var eTags = "";
            content += data.content;

            var startingTags = data["starting-tags"];
            if (startingTags.length > 0) {
                for (var t = 0; t < startingTags.length; t++) {
                    var attribute = startingTags[t]["attribute"];;
                    if ((attribute != null) && (attribute["dir"] != undefined)) {
                        var attrValue = "\"" + attribute["dir"] + "\"";
                        sTags += "<" + startingTags[t].tagName + " dir=" + attrValue + ">";
                    }
                    else {
                        sTags += "<" + startingTags[t].tagName + ">";
                    }
                }
            }

            var endingTags = data["ending-tags"];
            if (endingTags.length > 0) {
                for (var t = 0; t < endingTags.length; t++)
                    eTags += "</" + endingTags[t].tagName + ">";
            }

            if (content.length <= 50) {
                rteContent += sTags + data.content + eTags;
            }
            else {
                if (firstTag == "div") {
                    if (!eTags.includes("</div>")) {
                        eTags = eTags + "</div>";
                    }
                }
                rteContent += sTags + data.content.substr(0, (50 - (content.length - data.content.length))) + "..." + eTags;
                break;
            }
        }
        if (rteContent.includes("</span>") && !rteContent.includes("<div dir=\"rtl\">")) {
            rteContent = "<div dir=\"rtl\">" + rteContent + "</div>";
        }
        that.html(rteContent);
    });
    //contentValue = (contentValue.length > 50) ? contentValue.substr(0, 50).trim() + ".." : contentValue;
    //content.html(contentValue);

    // Give filterContent attr to enable full text search and bypass ellipsis
    if (row.copyTextRTE) {
        if (isFromGS1XML)
            content.attr("filterContent", getPlainTextFromRTEText(decodeHTML(row.copyTextRTE)));
        else
            content.attr("filterContent", getPlainTextFromRTEText(row.copyTextRTE));
    }
    var notesValue = row.notes;
    if (isFromGS1XML) {
        notesValue = decodeHTML(notesValue);
    }
    if (!bContentWrapped) {
        notesValue = (notesValue.length > 50) ? notesValue.substr(0, 50).trim() + ".." : notesValue;
    }
    notes.append(notesValue);
    // Give filterContent attr to enable full text search and bypass ellipsis
    if (isFromGS1XML)
        notes.attr("filterContent", getPlainTextFromRTEText(decodeHTML(row.notes)));
    else
        notes.attr("filterContent", getPlainTextFromRTEText(row.notes));

    //instanceSequence.append(row.instanceSequence);
    instanceSequence.append(InstanceSequence);
    // if(row.artworkType != "graphic" ){
    // content.attr("toFilterContent", row.COPY_TEXT);
    // notes.attr("toFilterContent", row.notes);		
    // }


    // Exposing language Seq number - Start
    var currLangName = "";

    // var currLangName = (row.isInlineCopy || row.isMasterInlineCopy) && row.languageName ? //getObjectSpanWithTooltipWithFixedLength(row.languageName.split(","), "poaContentInfo", 1) : row.languageName;

    if (row.languageName) {
        var langFilterContent = "";
        if ((row.isInlineCopy || row.isMasterInlineCopy) && row.languageName) {
            var langArray = [];
            $.each(row.languageName.split(","), function (index, eachLanguage) {
                if (globalLanguageSeqMap[eachLanguage])
                    langArray.push(globalLanguageSeqMap[eachLanguage] + "-" + eachLanguage);
                else {
                    for (var k in globalLanguageSeqMap) {
                        if (k.indexOf(eachLanguage) != -1)
                            langArray.push(globalLanguageSeqMap[k] + "-" + eachLanguage);
                    }
                }
            });
            currLangName = getObjectSpanWithTooltipWithFixedLength(langArray, "poacontentinfo", 1);
            langFilterContent = langArray.join(", ");
        } else {
            if (globalLanguageSeqMap[row.languageName])
                currLangName = globalLanguageSeqMap[row.languageName] + "-" + row.languageName;
            else {
                for (var k in globalLanguageSeqMap) {
                    if (k.indexOf(row.languageName) != -1)
                        currLangName = globalLanguageSeqMap[k] + "-" + row.languageName;
                }
            }
            langFilterContent = currLangName;
        }
    }
    // Exposing language Seq number - End

    if (!bContentWrapped) {
        currLangName = (currLangName.length > 50) ? currLangName.substr(0, 50).trim() + ".." : currLangName;
    }
    langaugeName.append(currLangName);
    // Give filterContent attr to enable full text search and bypass ellipsis
    langaugeName.attr("filterContent", langFilterContent);

    statusColumn.attr("class", "statusColumn");
    var linkSpan = $("<span>").addClass("linkSpan");
    var outOfSyncSpan = $("<span>").addClass("outOfSyncSpan");
    var tooltipSpan = $("<div>").attr("class", "outOfSyncTooltip");
    outOfSyncSpan.append(tooltipSpan);
    statusColumn.append(linkSpan).append(outOfSyncSpan);

    var downloadURL = "";
    if (!isFromGS1XML) {
        downloadURL = "../db/o3dconnect/getFile?mode=downloadURL&elementId=" + row.id;
    }

    // GS1TYPE-INS SEQ-LOCALE SEQ
    var attrNotesValue = row.notes;
    if (isFromGS1XML)
        attrNotesValue = decodeHTML(attrNotesValue);
    var tr = $("<tr>").addClass("artworkAssembly")
        .attr("objectId", row.id)
        .attr("artworkType", row.artworkType)
        .attr("notes", attrNotesValue)
        .attr("onClick", "artworkElementClick(event)")
        .attr("instanceSequence", row.instanceSequence)
        .attr("languageName", row.languageName)
        .attr("state", row.lc_CurrentState)
        .attr("localeSequence", row.localeSequence)
        .attr("elementTypeIcon", copyTypeName)
        .attr("sequenceNumber", row.sequenceNumber)
        .attr("gs1Type", row.gs1Type)
        .attr("UniqueKey", row.UniqueKey);

    if (row.isStructuredRoot == undefined)
        tr.attr("onClick", "artworkElementClick(event)");
    else
        $(tr).css("pointer-events", "none");

    if (row.NutritionInfo != null && row.NutritionInfo.length > 0)
        $(tr).attr("structuredRoot", "true");

    if (row.artworkType == "Copy" || row.artworkType == "Structure") {
        var dataKey = row.gs1Type + "|" + row.instanceSequence + "|" + row.localeSequence;
        var attributeId = dataKey.replace(PATTERN_SPCIAL_CHAR, "-");
        var copyText = row.COPY_TEXT;
        var copyTextRTE = row.copyTextRTE;
        if (isFromGS1XML) {
            copyText = decodeHTML(copyText);
            copyTextRTE = decodeHTML(copyTextRTE);
        }
        /*     if(copyText.indexOf("rtl") !== -1){
                 copyText = copyText.substring(copyText.indexOf(">")+1);
             }*/
        if (copyText) {
            var index = hasRTLTag(copyText);
            if (index > 0) {
                copyText = copyText.substring(index);
            }
        }

        if (isSubSturcturedElement) {
            var dataKey = row.UniqueKey;
            attributeId = dataKey.replace(PATTERN_SPCIAL_CHAR, "-");
        }

        tr.attr("id", attributeId)
            .attr("copyText", copyText)
            .attr("copyTextRTE", copyTextRTE)
            .attr("data-key", dataKey);

    } else if (row.artworkType == "graphic") {
        var dataKey = row.gs1Type + "|" + row.instanceSequence;
        var attributeId = dataKey.replace(PATTERN_SPCIAL_CHAR, "-");
        tr.attr("id", attributeId)
            .attr("hasAttachment", row.hasAttachment)
            .attr("primaryImageName", row.primaryImageName)
            .attr("lockGraphicDocStatus", row.lockGraphicDocStatus)
            .attr("downloadURL", downloadURL)
            .attr("modified", row.modified)
            .attr("modifiedTimeStamp", row.modifiedTimeStamp)
            .attr("data-key", dataKey);
    }

    if (row.artworkType == "Structure" || row.isStructuredRoot == "true") {
        var Uk = row.gs1Type + "|" + row.instanceSequence;
        tr.attr("UniqueKey", Uk);
    }

    if (isSubSturcturedElement) {
        var dataKey = row.UniqueKey;
        tr.attr("data-key", dataKey);
        attributeId = dataKey.replace(PATTERN_SPCIAL_CHAR, "-");
        tr.attr("id", attributeId)
        tr.attr("parentInfo", row.parentInfo);
        tr.attr("subSturcturedElement", "true");
    }
    // Q.getDocumentPOA(function (returnValue) 
    // {
    if (isXML)
        tr.append(currentTD).append(elementKey).append(instanceSequence).append(langaugeName).append(content).append(notes).append(statusColumn);
    else
        tr.append(currentTD).append(elementKey).append(instanceSequence).append(langaugeName).append(content).append(notes).append(currentState).append(statusColumn);

    // $(tr).find("td").each(function(index, value){
    // var className = $(this).attr("class").split(" ")[0];
    // var tHWidth = $('.artworkAssemblyTableHead>tr>th.'+className).width();
    // $(this).css("width", tHWidth);
    // //$(this).css("max-width", tHWidth+2);
    // //$(this).css("min-width", tHWidth);
    // });

    $("#artworkAssemblyTableBody").append(tr);
    //});
}

function wrapColumnContent(event) {
    bContentWrapped = (!bContentWrapped);
    wrapUnwrapArtworkTableContent(objectData.artworkAssemblyInfo);
}

function wrapUnwrapArtworkTableContent(artworkAssemblyData) {
    var artworkAssemblyDataArray = [];
    for (var currentID in artworkAssemblyData) {
        artworkAssemblyDataArray.push(artworkAssemblyData[currentID]);
    }
    sortArtworkAssemblyData(artworkAssemblyDataArray, "artworkAssemblyTable");
    $.each(artworkAssemblyDataArray, function (indx, row) {
        wrapUnwrapRow(row);
        if (row.NutritionInfo != null && row.NutritionInfo.length > 0) {
            sortArtworkAssemblyData(row.NutritionInfo, "artworkAssemblyTable");
            $.each(row.NutritionInfo, function (index, structuredRow) {
                wrapUnwrapRow(structuredRow);
            });
        }
    });
}

function wrapUnwrapRow(row) {
    $('#artworkAssemblyTableBody>tr').each(function () {
        var id = $(this).attr("uniqueKey");
        if (id == row.UniqueKey) {
            var isFromGS1XML = row.id == 'fromGS1XML' ? true : false;
            var gs1Type = row.gs1Type;
            var InstanceSequence = row.instanceSequence;
            var CurrentState = row.lc_CurrentState
            var notesValue = row.notes;
            var currLangName = "";
            var contentValueRTE = (row.artworkType == "graphic") ? "" : isFromGS1XML ? decodeHTML(row.copyTextRTE) : row.copyTextRTE;
            if (row.lc_CurrentState == undefined) {
                CurrentState = "";
            }
            if (row.languageName) {
                var langFilterContent = "";
                if ((row.isInlineCopy || row.isMasterInlineCopy) && row.languageName) {
                    var langArray = [];
                    $.each(row.languageName.split(","), function (index, eachLanguage) {
                        if (globalLanguageSeqMap[eachLanguage])
                            langArray.push(globalLanguageSeqMap[eachLanguage] + "-" + eachLanguage);
                        else {
                            for (var k in globalLanguageSeqMap) {
                                if (k.indexOf(eachLanguage) != -1)
                                    langArray.push(globalLanguageSeqMap[k] + "-" + eachLanguage);
                            }
                        }
                    });
                    currLangName = getObjectSpanWithTooltipWithFixedLength(langArray, "poacontentinfo", 1);
                    langFilterContent = langArray.join(", ");
                } else {
                    if (globalLanguageSeqMap[row.languageName])
                        currLangName = globalLanguageSeqMap[row.languageName] + "-" + row.languageName;
                    else {
                        for (var k in globalLanguageSeqMap) {
                            if (k.indexOf(row.languageName) != -1)
                                currLangName = globalLanguageSeqMap[k] + "-" + row.languageName;
                        }
                    }
                    langFilterContent = currLangName;
                }
            }
            if (!bContentWrapped) {
                gs1Type = (gs1Type.length > 50) ? gs1Type.substr(0, 50).trim() + ".." : gs1Type;
                InstanceSequence = (InstanceSequence.length > 50) ? InstanceSequence.substr(0, 50).trim() + ".." : InstanceSequence;
                CurrentState = (CurrentState.length > 50) ? CurrentState.substr(0, 50).trim() + ".." : CurrentState;
                notesValue = (notesValue.length > 50) ? notesValue.substr(0, 50).trim() + ".." : notesValue;
                //contentValueRTE = (contentValueRTE.length > 50) ? contentValueRTE.substr(0, 50).trim() + ".." : contentValueRTE;

                var that = this;
                Q.getJSONOfTagsFromRTEContent(contentValueRTE, function (jsonTags) {
                    var jasonData = JSON.parse(jsonTags);

                    var content = "";
                    var rteContent = "";

                    var firstData = "";
                    var startingTagsOfFirstdata = "";
                    var firstTag = "";

                    if (jasonData.length > 0) {
                        firstData = jasonData[0];
                        startingTagsOfFirstdata = firstData["starting-tags"];
                        if (startingTagsOfFirstdata.length > 0) {
                            firstTag = startingTagsOfFirstdata[0].tagName;
                        }
                    }

                    for (var i = 0; i < jasonData.length; i++) {
                        var data = jasonData[i];
                        var sTags = "";
                        var eTags = "";
                        content += data.content;

                        var startingTags = data["starting-tags"];
                        if (startingTags.length > 0) {
                            for (var t = 0; t < startingTags.length; t++) {
                                var attribute = startingTags[t]["attribute"];;
                                if ((attribute != null) && (attribute["dir"] != undefined)) {
                                    var attrValue = "\"" + attribute["dir"] + "\"";
                                    sTags += "<" + startingTags[t].tagName + " dir=" + attrValue + ">";
                                }
                                else {
                                    sTags += "<" + startingTags[t].tagName + ">";
                                }
                            }
                        }

                        var endingTags = data["ending-tags"];
                        if (endingTags.length > 0) {
                            for (var t = 0; t < endingTags.length; t++)
                                eTags += "</" + endingTags[t].tagName + ">";
                        }

                        if (content.length <= 50) {
                            rteContent += sTags + data.content + eTags;
                        }
                        else {
                            if (firstTag == "div") {
                                if (!eTags.includes("</div>")) {
                                    eTags = eTags + "</div>";
                                }
                            }
                            rteContent += sTags + data.content.substr(0, (50 - (content.length - data.content.length))) + "..." + eTags;
                            break;
                        }
                    }
                    $(that).find('td.content').html(rteContent);
                });
                currLangName = (currLangName.length > 50) ? currLangName.substr(0, 50).trim() + ".." : currLangName;
            }
            else {
                var that = this;
                Q.handleAngleBracketToParse(contentValueRTE, function (rteContent) {
                    $(that).find('td.content').html(rteContent);
                });
            }
            $(this).find('td.copyElementType').find('span.artworkTypeText').html(gs1Type);
            $(this).find('td.tableHeaderImagesCell').html(InstanceSequence);
            $(this).find('td.order').html(CurrentState);
            $(this).find('td.notes').html(notesValue);
            //$(this).find('td.content').html(contentValueRTE);
            $(this).find('td.language').html(currLangName);
        }
    });
}

/*
    On Selection of Artwork Element Row -- Need to handle
    1) Handle the highlighting the Table row
    2) Handling the details to display on preview and note divs
*/
function artworkElementClick(event) {
    var selectedRow = $(event.currentTarget);
    var key = $(selectedRow).attr("data-key");
    var highlight = $(selectedRow).hasClass("highlight");

    highlightArtworkElement(key, !highlight);
    checkOrUncheckSelectAll();
    handleSelectAllBox("artworkAssemblyTable");
    Q.repaintPanel();
}

function checkOrUncheckSelectAll() {
    var selectedElementsLength = $('input[type=checkbox].syncCheckbox').length;
    var syncCheckboxLength = $('tr.highlight').length;
    $("#selectAll").prop("checked", syncCheckboxLength == selectedElementsLength ? true : false);
    if (syncCheckboxLength == selectedElementsLength) {
        $('#selectAllCheckbox').addClass('selected');
    } else {
        $('#selectAllCheckbox').removeClass('selected');
    }
}

function highlightArtworkElement(key, highlight) {
    var id = "#" + key.replace(PATTERN_SPCIAL_CHAR, "-");

    Q.selectElement(key, highlight);
    $(id).find("input:checkbox").prop("checked", highlight);
    if (highlight) {
        $(id).addClass("highlight");
        $(id).find("label.checkboxIcon").addClass("selected");
    } else {
        $(id).removeClass("highlight");
        $(id).find("label.checkboxIcon").removeClass("selected");
    }

    //toggle annotation selected
    if ($(".highlight").length == 1) {
        $(".highlight").each(function () {
            var highlightedKey = $(this).attr("id");
            var highlightedId = "#" + highlightedKey;

            displayPreview($(highlightedId));
            displayNotes($(highlightedId).attr("notes"));
        });
    } else {
        $("#preview").empty();
        $("#note").empty();
    }
    updateSelectedElementList();
}

function filterRows() {
    var selectedRows = $(".highlight");
    var processedStructuredRoots = [];
    for (var i = 0; i < selectedRows.length; i++) {
        var currentRow = selectedRows[i];
        if ($(currentRow).attr("subSturcturedElement") !== undefined) {
            var parentValue = $(currentRow).attr("parentInfo");
            if (processedStructuredRoots.indexOf(parentValue) === -1) {
                processedStructuredRoots.push(parentValue);

                /*Process child elements
                 * Add not highlighted element first
                 * Then process highlighted child elements.
                 * So that selected elements will come on the top
                 */
                var selectedChildElements = [];
                $("tr[parentInfo='" + parentValue + "']").each(function () {
                    if ($(this).hasClass("highlight"))
                        selectedChildElements.push(this);
                    else
                        $(this).prependTo("#artworkAssemblyTable");
                });
                selectedChildElements.forEach(function (current) {
                    $(current).prependTo("#artworkAssemblyTable");
                });
                /*
                 * Add parent element
                 */
                $('#' + parentValue.replace(PATTERN_SPCIAL_CHAR, "-")).prependTo("#artworkAssemblyTable");
            }
        } else {
            $(currentRow).prependTo("#artworkAssemblyTable");
        }
    }
}

function displayPreview(rowInfo) {
    $("#preview").empty();

    if ($(".highlight").length > 1) {
        return;
    }
    var isCopyElement = $(rowInfo).attr("artworkType") == "Copy";

    var preivew;
    if (isCopyElement) {
        var textDecoded = decodeRTEText($(rowInfo).attr("copyTextRTE"));
        preivew = $.parseHTML(textDecoded);
        $("#preview").html(preivew);
    } else {
        var hasAttachment = $(rowInfo).attr("hasAttachment");
        if (hasAttachment == "true") {
            preivew = $(rowInfo).attr("downloadURL");
            var typeImage = $("<img></img>").attr("src", preivew).attr("class", "preivewImage");
            $("#preview").append(typeImage);
        }
    }
}

function displayNotes(notes) {
    $("#note").empty();
    $("#note").html(notes);
}

function lockOrUnlock(event) {
    var lockOrUnlockSpan = $("#lockOrUnlockSpan");

    Q.isPOAAssociatedToFile(function (returnValue) {
        if (!returnValue) {
            Q.showNotification(ARTWORK_PANEL_LABLES['emxAWL.Message.POAInfoMissing']);
        }
    });
    //var isDocumentHasMapping = Q.isPOAAssociatedToFile();
    //if(!isDocumentHasMapping)
    //Q.showNotification(ARTWORK_PANEL_LABLES['emxAWL.Message.POAInfoMissing']);
    //lockOrUnlockSpan.tooltip("disable");
    var isLocked = $(event.currentTarget).hasClass("lockPOA");
    var lockOrUnlockUrl = !isLocked ? unlockPOAUrl : lockPOAUrl;
    lockOrUnlockSpan.attr("title", ARTWORK_PANEL_LABLES[isLocked ? "emxAWL.ToolTip.UnlockPOA" : "emxAWL.ToolTip.LockPOA"]);
    //lockOrUnlockSpan.tooltip("enable");
    poaName = $.trim($("#poaName").text());
    $.ajax({
        data: {
            POAName: poaName
        },
        url: lockOrUnlockUrl + "/" + poaName,
        success: function (data) {
            objectData = $.parseJSON(data);
            var result = objectData.result;
            if (result == "success")
                manageLockStatus(isLocked);
            Q.showNotification(objectData.data);
            Q.repaintPanel();
        },
        error: function (data) {
            Q.showNotification(data.responseText);
            Q.repaintPanel();
        }
    });
    Q.repaintPanel();
}

function manageLockStatus(isLocked) {
    var lockOrUnlockSpan = $("#lockOrUnlockSpan");
    var imageName = isLocked ? "unlocked.png" : "locked.png";
    lockOrUnlockSpan.attr("title", ARTWORK_PANEL_LABLES[isLocked ? "emxAWL.ToolTip.UnlockPOA" : "emxAWL.ToolTip.LockPOA"]);
    $("#lockOrUnlockSpan img").remove();
    lockOrUnlockSpan.append(getCommandsImageHTML("action-command", imageName)).attr("onClick", "lockOrUnlock(event)");
    handleLockStatus(lockOrUnlockSpan, isLocked);
}

function handleLockStatus(elementSpan, isLocked) {
    Q.repaintPanel();
    if (isLocked)
        elementSpan.removeClass("lockPOA");
    else
        elementSpan.addClass("lockPOA");
}

/*function getRoundTripCompareText(text1, text2) {
    var dmp = new diff_match_patch();
    var differences = dmp.diff_main(text1, text2);
    var differencesHTMLText = $.parseHTML(diff_prettierHtml(differences));
    var myToolTipText = "";
    $.each(differencesHTMLText, function (indx, row) {
        myToolTipText = myToolTipText + row.outerHTML;
    });
    return myToolTipText;
}*/

function diff_prettierHtml(diffs) {
    var html = [];
    for (var x = 0; x < diffs.length; x++) {
        var op = diffs[x][0]; // Operation (insert, delete, equal)
        var data = diffs[x][1]; // Text of change.
        var text = data;
        var className = DIFF_EQUAL === op ? "matcingText" : DIFF_INSERT === op ? "insertedText" : "deletedText";

        // Replace needed as span element trims blank spaces, so replace them with &nbsp
        if (className == "insertedText" || className == "deletedText")
            text = text.replace(/ /g, '\u00a0');

        html[x] = "<span class=" + className + ">" + text + "</span>";
    }
    return html.join("");
};

function addProgessInfo() {
    $(".progressWheelContent").show();
}

function removeProgessInfo() {
    $(".progressWheelContent").hide();
}

function searchArtworkAssemblyTableStatic() {
    'use strict';
    var searhStringArray = $(this).val().split(/[^a-zA-Z0-9]/);
    $(".artworkAssembly").each(function () {
        $(this).hide();
    });
    var searchString = $(this).val();
    $("tbody tr").filter(function () {
        var elementType = $(this).find('.artworkTypeText').text();
        var instSequence = $(this).attr('instancesequence');
        var language = $(this).attr('languagename');
        var state = $(this).attr('state');
        var notes = $(this).attr('notes');
        var content = $(this).attr('copyText');
        var filterText = "";
        filterText = elementType + " " + instSequence + " " + language + " " + state + " " + notes + " " + content;
        if (filterText != undefined && filterText.trim().toUpperCase().indexOf(searchString.toUpperCase()) == -1)
            return false;
        else
            return true;
    }).show();

    handleSelectAllBox("artworkAssemblyTable");
    Q.repaintPanel();
}

function updateElements() {
    $(".artworkAssembly").each(function () {
        var jsKey = $(this).attr("id");
        var aiKey = $(this).attr("UniqueKey");
        var that = this;

        Q.hasKey(aiKey, function (returnValue) {
            if (returnValue == true) {
                var artworkType = $(that).attr("artworkType");
                var contentInAI;
                var contentOnDB = artworkType == "Copy" ? getPlainTextFromRTEText($(that).attr("copyTextRTE")) : $('#' + jsKey).attr("modifiedTimeStamp");
                contentOnDB = contentOnDB.replace(/<br\s*[\/]?>/gi, "\n");
				var copyTextRTE = artworkType == "Copy" ? $(that).attr("copytextrte") : $('#' + jsKey).attr("modifiedTimeStamp");
				 copyTextRTE = copyTextRTE.replace(/<br\s*[\/]?>/gi, "\n");
                if (artworkType == "Copy") {
                    Q.updateEntry(aiKey, copyTextRTE, function () {
                        Q.saveQDOMToXMP();
                    });
                } else {
                    Q.updateEntry(aiKey, contentOnDB, function () {
                        Q.saveQDOMToXMP();
                    });
                }
            }
        });
    });
    updateMultiMappedElements(poaName, false, function () {
        Q.saveQDOMToXMP();
    });
    Q.repaintPanel();
}

function validateRTLAttribute(returnObject) {

    while (returnObject.includes("\"rtl\"") || returnObject.includes("\"LTR\""))
    {
        returnObject = returnObject.replace("\"rtl\"", "\\\"rtl\\\"");
        returnObject = returnObject.replace("\"LTR\"", "\\\"LTR\\\"");
        returnObject = returnObject.replace("\"LTR\"", "\\\"LTR\\\"");
    }

    return returnObject;
}

function areSame(arr)
    {
        let first = arr[0];
       for (let i=1; i<arr.length; i++)
           if (arr[i] != first)
                return false;
       return true;
    }
	
//wx7: Function to update the status columns
//some modifications are done in below method for allowing same elements multiple times in multi map panel
function updateStatusColumns(returnObject) {
    //console.log(returnObject)
    //return;
    console.log('##updateStatusColumns 1## js inject');

    //return ;
    //Q.getElementsInfoForStatusColumnUpdate(function(returnObject){
    Q.getDocumentPOA(function (poaName) {
        var isXML = poaName.indexOf(".xml") != -1;

        var t0 = performance.now();
        //console.log('##updateStatusColumns starts##'+t0);
        returnObject = validateRTLAttribute(returnObject);
        var returnJSONObject = $.parseJSON(returnObject);

        $(".artworkAssembly").each(function () {
            var jsKey = $(this).attr("id");
            var aiKey = $(this).attr("UniqueKey");
            var that = this;

            if (returnJSONObject.hasOwnProperty(aiKey)) {
                addLinkIconToElementRow(aiKey);
				
                var artworkType = $(that).attr("artworkType");
                //var contentOnDB = artworkType == "Copy" ? getPlainTextFromJSONRTEText(generateJSONForCopytext($(that).attr("copyTextRTE"))):$('#' + jsKey).attr("modifiedTimeStamp");				
                var contentOnDB = artworkType == "Copy" ? $(that).attr("copyTextRTE") : $('#' + jsKey).attr("modifiedTimeStamp");
                if (contentOnDB.includes("</span>")) {
                    if (!contentOnDB.includes("<div dir=\"rtl\">"))
                        contentOnDB = "<div dir=\"rtl\">" + contentOnDB + "</div>";
                }

                var returnedTextContent = contentOnDB;
				  var aiContentList = (returnJSONObject[aiKey])["aiContentList"];
				  console.log('--RTC aicontentlist value',aiContentList );
                if ((returnJSONObject[aiKey])["aiContentList"]) {
                    if ((returnJSONObject[aiKey])["aiContentList"].length == 1) {
                      
					    multiOccurMisMatch = false;
		                returnedTextContent = (returnJSONObject[aiKey])["aiContentList"][0];

                        //for (var index in aiContentList) {
                           
                       // }
                    } else {
						if (!(areSame(aiContentList))) {
							 console.log('--RTC if areSame check' );
                                returnedTextContent = "O3DConnectMultipleOccurred";
								multiOccurMisMatch = true;
                                //break;
                            }
						else{
                            returnedTextContent = (returnJSONObject[aiKey])["aiContentList"][0];     //		IR-1013775-3DEXPERIENCER2023x fix--take ai content instead of db
						//returnedTextContent = contentOnDB;
							multiOccurMisMatch = false;     
						}
						

                    }

                    if (returnedTextContent === "O3DConnectMultipleOccurred") {
                        // Q.getTextContentForSyncCheck(aiKey, contentOnDB, function (returnedTextContent) {
                        // contentOnAI = returnedTextContent;
                        // if(contentOnAI=="O3DConnectMultipleOccurred")
                        changeIcon(aiKey, jsKey, contentOnDB, returnedTextContent, isXML);
                        //else
                        //	updateSyncIcon(aiKey, jsKey, contentOnDB, returnedTextContent);
                        //});										
                    } else {
                        updateSyncIcon(aiKey, jsKey, contentOnDB, returnedTextContent, isXML);
                    }
                }

            } else {
                removeLinkIcon(jsKey);
                removeSyncIcon(jsKey);
            }
        });
    });
    //Q.repaintPanel();
}

//wx7: function to update graphic element on AI.
function updateGraphicElement(aiKey) {
    var jsKey = aiKey.replace(PATTERN_SPCIAL_CHAR, "-");
    Q.updateGraphicArt(aiKey, $('#' + jsKey).attr("objectId"), $('#' + jsKey).attr("modifiedTimeStamp"));
    Q.repaintPanel();
}

//wx7: function to remove sync icon for row
function removeSyncIcon(jsKey) {
    var selectedRow = $("#" + jsKey);
    var statusColumn = selectedRow.find("td.statusColumn");
    if (statusColumn.hasClass("syncElement")) {
        //statusColumn.removeClass("syncElement");
        statusColumn.find("img").remove();
    }
}

//wx7: function to show status icon
function updateSyncIcon(aiKey, jsKey, contentOnDb, contentOnAI, isXML) {

    if (contentOnDb)
	{
        contentOnDb = contentOnDb.replace(/<br\s*[\/]?>/gi, "\n"); 
		contentOnDb = contentOnDb.replace(/\"/g, "&quot;");
		contentOnDb = contentOnDb.replace(/\'/g, "&apos;");		//added for allowing same elements multiple times in multi map panel
		//contentOnDb = contentOnDb.replace( /(<([^>]+)>)/ig, '');                //commented for allowing same elements multiple times in multi map panel
	}

    if (contentOnAI)
	{
        contentOnAI = contentOnAI.replace(/<br\s*[\/]?>/gi, "\n");
		contentOnAI = contentOnAI.replace(/\"/g, "&quot;");
		contentOnAI = contentOnAI.replace(/\'/g, "&apos;");
	}

    Q.getJSONOfTagsFromRTEContent(contentOnAI, function (jsonTagsAI) {
        var jsonAI = jsonTagsAI;
        Q.getJSONOfTagsFromRTEContent(contentOnDb, function (jsonTagsDb) {
            var jsonDb = jsonTagsDb;
            var result = getRoundTripCompareText(JSON.parse(jsonDb), JSON.parse(jsonAI));
            var isInSync = result['isContentSame'];

            if (isInSync) {
                removeOutOfSyncIcon(jsKey);
                return;
            }
            else {
                changeIcon(aiKey, jsKey, contentOnDb, contentOnAI, isXML);
            }
        });
    });
}

function changeIcon(aiKey, jsKey, contentOnDb, contentOnAI, isXML) {
    //	Q.getDocumentPOA(function (poaName) {			
    var selectedRow = $("#" + jsKey);

    //		var isXML =  poaName.indexOf(".xml")!=-1;
    var isGraphicElement = $(selectedRow).attr("artworkType") == "graphic";
    if (isXML && isGraphicElement)
        return;

    var statusColumn = selectedRow.find("td.statusColumn");
    //if (!statusColumn.hasClass("syncElement")) {
        statusColumn.addClass("syncElement");
        var statusLinkImage = getCommandsImageHTML("artworkTypeImage", "iconActionSyncStructureFromEnovia.png")
            .on("mouseover", function (event) {
                var isCopyElement = $(selectedRow).attr("artworkType") == "Copy";
                if (isCopyElement) {
                    Q.getTextContentForSyncCheck(aiKey, contentOnDb, function (returnedTextContent) {
                        Q.getMarkerValue(aiKey, contentOnDb, function (markerValue) {
                            tooltipText = markerValue;
                            if (tooltipText === "SingleMarkerTooltip") {
                                $("#preview").html(contentOnDb);
                                showtip(event, ARTWORK_PANEL_LABLES['emxAWL.MultiOccurred.Elements.SingleFrameTooltip']);
                            }
                            else if (tooltipText === "MultipleMarkerTooltip") {
                                $("#preview").html(contentOnDb);
                                showtip(event, ARTWORK_PANEL_LABLES['emxAWL.MultiOccurred.Elements.MultiFrameTooltip']);
                            }
                        });
                        contentOnAI = returnedTextContent;
                        if (contentOnAI === "O3DConnectMultipleOccurred" || multiOccurMisMatch) {
                            /* $(statusLinkImage).attr("title", ARTWORK_PANEL_LABLES['emxAWL.MultiOccurred.Elements.Tooltip']); */
                            //$("#preview").html(contentOnDb);                                                                           //commented for allowing same elements multiple times in multi map panel
                            contentOnAI = "";                                                                                            //for IR-1011987
                            $("#preview").html(contentOnAI);                                                                             //added for allowing same elements multiple times in multi map panel
                            showtip(event, ARTWORK_PANEL_LABLES['emxAWL.MultiOccurred.Elements.Tooltip']);
                        } else
                            //$(statusLinkImage).attr("title", "Out of Sync");
                            Q.getJSONOfTagsFromRTEContent(contentOnAI, function (jsonTags) {
                                var jsonAI = jsonTags;
                                Q.getJSONOfTagsFromRTEContent(contentOnDb, function (jsonTags) {
                                    var jsonDb = jsonTags;
									jsonDb = jsonDb.replace(/&lt;/g, "<");
									jsonDb = jsonDb.replace(/&gt;/g, ">'");
									jsonAI = jsonAI.replace(/&lt;/g, "<");
                                    jsonAI = jsonAI.replace(/&gt;/g, ">");
                                    console.log('##23xFD01 1## js inject');

                                    var result = getRoundTripCompareText(JSON.parse(jsonDb), JSON.parse(jsonAI));
                                    $("#preview").html(result['compareResult']);
                                });
                            });
                    });
                } else {
                    if (contentOnDb != contentOnAI)
                        $("#preview").html(ARTWORK_PANEL_LABLES['emxFramework.Basic.Modified'] + " : " + $(selectedRow).attr("modified"));
                }

            }).mouseout(function () {
                var selectedRow = $("tr.highlight");
                if ($(selectedRow).attr("id") == undefined) {
                    $("#preview").empty();
                } else {
                    displayPreview(selectedRow);
                }
                hidetip();
            });
        var outOfSyncSpan = $(statusColumn).find('.outOfSyncSpan');
        var elemLinkImage = $(outOfSyncSpan).find('.artworkTypeImage');
        if (!elemLinkImage.length)
        outOfSyncSpan.append(statusLinkImage);
    //}
    //	});
}

function showtip(e, message) {
    var x = 0;
    var y = 0;
    var m;
    var h;
    if (!e)
        var e = window.event;

    var tar = e.target.parentNode;
    if (e.pageX || e.pageY) {
        x = e.pageX; y = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    m = tar.getElementsByClassName('outOfSyncTooltip')[0];

    m.style.top = 0 + "px";


    // if((y>10)&&(y<450))
    // {  
    // m.style.top=y-4+"px";  
    // }
    // else
    // {  
    // m.style.top=y+4+"px";  
    // }

    var messageHeigth = (message.length / 20) * 10 + 25;
    //if((e.clientY+messageHeigth)>510)
    //{  m.style.top=y-messageHeigth+"px"; }
    if (x < 850) { m.style.left = x - 200 + "px"; }
    else { m.style.left = x - 170 + "px"; }
    m.innerHTML = message; m.style.display = "block"; m.style.zIndex = 203;
}

function hidetip() {
    var m;
    m = document.getElementsByClassName('outOfSyncTooltip');
    for (i = 0; i < m.length; i++) {
        m[i].style.display = "none";
    }
    //m.style.display="none";
}

/*
 * wx7 : Function to select elements in artwork assembly panel
 * Input : List of AI keys to be selected in HTML panel.
 */
function selectElementsInAssemblyPanel(AIKeyListString) {
    clearArtworkElementSelectionOnPanel();
    selectAISelectedArts(AIKeyListString);

    if (AIKeyListString == "")
        clearSelectionSequenceArrayAndRendering();

    handleSelectAllBox("artworkAssemblyTable");
}

/*
 * wx7 : Function to clear artwork element selection on artwork assembly panel
 */
function clearArtworkElementSelectionOnPanel() {
    //clear the selection
    $(".artworkAssembly").each(function (index, elem) {
        $(this).find("input:checkbox").prop("checked", false);
        $(this).removeClass("highlight");
        $(this).find('label.checkboxIcon').removeClass('selected');
    });
}

/*
 * wx7 : Function to select elements on artwork assembly panel
 * Input : Comma seperated string of AI keys
 */
function selectAISelectedArts(AIKeyListString) {
    var keyList = new Array();
    keyList = AIKeyListString.split(",");
    $("#preview").html("");
    $("#note").html("");
    $.each(keyList, function (index, aiKey) {
        var jsKey = aiKey.replace(PATTERN_SPCIAL_CHAR, "-");
        selectElementInAssemblyPanel(jsKey);
    });
    updateSelectedElementList(true);
}

/*
 * wx7 : Function to select elements in artwork assembly panel Input : JS id to
 * be selected in HTML panel.
 */
function selectElementInAssemblyPanel(id) {
    if ($("#" + id).length) { // do opearation only if it is present in the panel
        $("#" + id).find("input:checkbox").prop("checked", true);
        $("#" + id).addClass("highlight");
        $("#" + id).find("label.checkboxIcon").addClass('selected');
        $("#preview").html($.parseHTML(decodeRTEText($("#" + id).attr("copyTextRTE"))));
        clearSelectionSequenceArrayAndRendering();
    }
}

// Clean up
// function updateHighlightedRows() {
// //get selected items from document and higlight in panel
// Q.getSelectedArtIdsInDocument(function (AIKeyListString) {
// selectAISelectedArts(AIKeyListString);
// });
// /* var AIKeyListString = Q.getSelectedArtIdsInDocument();
// selectAISelectedArts(AIKeyListString); */
// }

/*

*/
function updateSelectedElementList(isSelectedFromAI) {
    var selectedElements = $('input[type=checkbox].syncCheckbox:checked');
    var selectElementsArray = [];
    var selectGraphicElementsArray = [];
    $(selectedElements).each(function (key, value) {
        var currentRow = $(this).closest("tr");
        var key = $(currentRow).attr("data-key");
        if ($(currentRow).attr("subSturcturedElement") && $(currentRow).attr("subSturcturedElement") != "true") {
            var aiKey = key.replace(/-/g, "|");
            selectElementsArray.push(aiKey);
        } else {
            selectElementsArray.push(key);
        }

        var graphicElement = $(currentRow).attr('artworktype');
        if (graphicElement == 'graphic')
            selectGraphicElementsArray.push($(currentRow).attr('id'));
    });
    Q.updateArtworkAssemblySelectedElements(selectElementsArray.toString());
    Q.updateArtworkAssemblySelectedGraphicElements(selectGraphicElementsArray.toString()); //RRR1
    //Q.updateArtworkAssemblyJSONData(getAssemblyElementsJSONFromGlobalVar(false));
    //Q.updateCompleteArtworkAssemblyJSONData(getAssemblyElementsJSONFromGlobalVar(true));
    if (!isSelectedFromAI)
        handleSelectionSequenceArrayAndRender();
}

function loadJSONFromGS1XMLDocument(data) {
    var myJSON = JSON.stringify(data);
    var jsonData = $.parseJSON(myJSON);
    clearArtworkAssemblyPanel();
    objectData = $.parseJSON(data);
    objectData = objectData.data;

    //store locale preference values that are used for importing content file
    localePrefUsedForImport = objectData.LocalePrefUsed || {};

    if (!isEmpty(objectData['validationMsg'])) {
        Q.isAlertsDisabledForGS1Import(function (returnValue) {
            if (!returnValue) {
                Q.showJavaScriptAlert(decodeHTML(objectData['validationMsg']));
            }
        });
    }


    updatePOAInfo(objectData);
    updateArtworkAssemblyTable(objectData.artworkAssemblyInfo);
    //updateMultiMappedElements(poaName);
    removeProgessInfo();
    disbaleCommandsForGS1XML();
    isXMLCheck = true;
    Q.repaintPanel();
}

function enableCommands() {
    //$("#refreshCommandbtn").removeClass("disabled-commands");
    $("#checkinbtn").removeClass("disabled-commands");
    $("#promoteTaskbtn").removeClass("disabled-commands");
    $("#lockOrUnlockSpan").removeClass("disabled-commands");

    $("#stateHeader").show();
    $("#countriesInfo").show();
    $("#addExistingElementSeparator").show();
    $("#addExistingElement").show();
}

function disbaleCommandsForGS1XML() {
    $("#placeoforiginLabel").html(ARTWORK_PANEL_LABLES['emxAWL.Label.FileName']);
    //$("#refreshCommandbtn").addClass("disabled-commands");
    $("#checkinbtn").addClass("disabled-commands");
    $("#promoteTaskbtn").addClass("disabled-commands");
    $("#lockOrUnlockSpan").addClass("disabled-commands");

    $("#stateHeader").hide();
    $("#countriesInfo").hide();
    $("#addExistingElementSeparator").hide();
    $("#addExistingElement").hide();
}

function decodeHTML(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

// Pass "id" attr of the row to this method
function getJsonForElementData(elementId) {
    var elementJson = {};
    if ($("#artworkAssemblyTableBody") !== undefined) {
        //$("#artworkAssemblyTableBody>tr").each(function () {
        //    var currentRow = this;
        //    if ($(currentRow).attr("id") != elementId)
        //        return;
        //    else {
        var currentRow = $("#" + elementId); 
                if ($(currentRow).attr("artworkType") != "graphic") {
                    elementJson["objectId"] = $(currentRow).attr("objectId");
                    elementJson["artworkType"] = $(currentRow).attr("artworkType");
                    elementJson["content"] = $(currentRow).attr("copyText");
                    elementJson["contentRTE"] = $(currentRow).attr("copyTextRTE");
                    elementJson["contentJSONRTE"] = generateJSONForCopytext($(currentRow).attr("copyTextRTE"));
                    elementJson["notes"] = $(currentRow).attr("notes");
                    elementJson["instanceSequence"] = $(currentRow).attr("instanceSequence");
                    elementJson["sequenceNumber"] = $(currentRow).attr("sequenceNumber");
                    elementJson["language"] = $(currentRow).attr("languageName");
                    elementJson["state"] = $(currentRow).attr("state");
                    elementJson["gs1Key"] = $(currentRow).attr("gs1Type");
                    elementJson["localeSequence"] = $(currentRow).attr("localeSequence");
                    elementJson["elementTypeIcon"] = $(currentRow).attr("elementTypeIcon");
                    elementJson["UniqueKey"] = $(currentRow).attr("UniqueKey");

                    var searchKey = $(currentRow).attr("gs1Type") + "|" + $(currentRow).attr("instanceSequence");
                    var elementInfo = baseCopyTextBySequence[searchKey];
                    if ($(currentRow).attr("subSturcturedElement") == "true") {
                        var parentKey = $(currentRow).attr("UniqueKey").split(":")[1];
                        elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                    }
                    if ($(currentRow).attr("subSturcturedElement") == "true") {
                        elementJson["parentInfo"] = $(currentRow).attr("parentInfo");
                        elementJson["subSturcturedElement"] = $(currentRow).attr("subSturcturedElement");
                        var parentKey = $(currentRow).attr("UniqueKey").split(":")[1];
                        elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                    }
                    var elementInfoObj = {};
                    for (var property in elementInfo) {
                        var generateJsonCopy = elementInfo[property]["generate-json-copy-text"];
                        elementInfoObj[property] = generateJsonCopy;
                    }
                    elementJson["element-info"] = JSON.stringify(elementInfoObj);
                }

                if ($(currentRow).attr("artworkType") === "graphic") {
                    elementJson["objectId"] = $(currentRow).attr("objectId");
                    elementJson["artworkType"] = $(currentRow).attr("artworkType");
                    elementJson["notes"] = $(currentRow).attr("notes");
                    elementJson["instanceSequence"] = $(currentRow).attr("instanceSequence");
                    elementJson["sequenceNumber"] = $(currentRow).attr("sequenceNumber");
                    elementJson["language"] = $(currentRow).attr("languageName");
                    elementJson["state"] = $(currentRow).attr("state");
                    elementJson["gs1Key"] = $(currentRow).attr("gs1Type");
                    elementJson["localeSequence"] = $(currentRow).attr("localeSequence");
                    elementJson["elementTypeIcon"] = $(currentRow).attr("elementTypeIcon");
                    elementJson["UniqueKey"] = $(currentRow).attr("UniqueKey");
                    elementJson["content"] = $(currentRow).attr("modifiedTimeStamp");
                    elementJson["contentRTE"] = $(currentRow).attr("modifiedTimeStamp");
                    elementJson["contentJSONRTE"] = $(currentRow).attr("modifiedTimeStamp");
                    elementJson["modifiedTimeStamp"] = $(currentRow).attr("modifiedTimeStamp");
                    elementJson["modified"] = $(currentRow).attr("modified");
                    elementJson["primaryImageName"] = $(currentRow).attr("primaryImageName");
                    elementJson["lockGraphicDocStatus"] = $(currentRow).attr("lockGraphicDocStatus");
                    elementJson["downloadURL"] = $(currentRow).attr("downloadURL");
                    elementJson["hasAttachment"] = $(currentRow).attr("hasAttachment");
                }
        //    }
       // });
        return JSON.stringify(elementJson);
    }
}

// Pass "id" attr of the row to this method
function getJsonForElementDataToSend(elementId) {
    var elementJson = {};
    if ($("#artworkAssemblyTableBody") !== undefined) {
        //$("#artworkAssemblyTableBody>tr").each(function () {
        //    var currentRow = this;
        //    if (currentRow.attr("id") != elementId)
        //        return;
        //    else {
        var currentRow = $("#" + elementId); 
                if (currentRow.attr("artworkType") != "graphic") {
                    elementJson["objectId"] = currentRow.attr("objectId");
                    elementJson["artworkType"] = currentRow.attr("artworkType");
                    elementJson["content"] = currentRow.attr("copyText");
                    elementJson["contentRTE"] = currentRow.attr("copyTextRTE");
                    
                    //elementJson["contentJSONRTE"] = generateJSONForCopytext(currentRow.attr("copyTextRTE"));
                    elementJson["contentJSONRTE"] = currentRow.attr("copyTextRTE");

                    elementJson["notes"] = currentRow.attr("notes");
                    elementJson["instanceSequence"] = currentRow.attr("instanceSequence");
                    elementJson["sequenceNumber"] = currentRow.attr("sequenceNumber");
                    elementJson["language"] = currentRow.attr("languageName");
                    elementJson["state"] = currentRow.attr("state");
                    elementJson["gs1Key"] = currentRow.attr("gs1Type");
                    elementJson["localeSequence"] = currentRow.attr("localeSequence");
                    elementJson["elementTypeIcon"] = currentRow.attr("elementTypeIcon");
                    elementJson["UniqueKey"] = currentRow.attr("UniqueKey");

                    var searchKey = currentRow.attr("gs1Type") + "|" + currentRow.attr("instanceSequence");
                    var elementInfo = baseCopyTextBySequence[searchKey];
                    if (currentRow.attr("subSturcturedElement") == "true") {
                        var parentKey = currentRow.attr("UniqueKey").split(":")[1];
                        elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                    }
                    if (currentRow.attr("subSturcturedElement") == "true") {
                        elementJson["parentInfo"] = currentRow.attr("parentInfo");
                        elementJson["subSturcturedElement"] = currentRow.attr("subSturcturedElement");
                        var parentKey = currentRow.attr("UniqueKey").split(":")[1];
                        elementInfo = baseCopyTextBySequence[parentKey][searchKey];
                    }
                    var elementInfoObj = {};
                    for (var property in elementInfo) {
                        var generateJsonCopy = elementInfo[property]["generate-json-copy-text"];
                        elementInfoObj[property] = generateJsonCopy;
                    }
                    elementJson["element-info"] = JSON.stringify(elementInfoObj);
                }

                if (currentRow.attr("artworkType") === "graphic") {
                    elementJson["objectId"] = currentRow.attr("objectId");
                    elementJson["artworkType"] = currentRow.attr("artworkType");
                    elementJson["notes"] = currentRow.attr("notes");
                    elementJson["instanceSequence"] = currentRow.attr("instanceSequence");
                    elementJson["sequenceNumber"] = currentRow.attr("sequenceNumber");
                    elementJson["language"] = currentRow.attr("languageName");
                    elementJson["state"] = currentRow.attr("state");
                    elementJson["gs1Key"] = currentRow.attr("gs1Type");
                    elementJson["localeSequence"] = currentRow.attr("localeSequence");
                    elementJson["elementTypeIcon"] = currentRow.attr("elementTypeIcon");
                    elementJson["UniqueKey"] = currentRow.attr("UniqueKey");
                    elementJson["content"] = currentRow.attr("modifiedTimeStamp");
                    elementJson["contentRTE"] = currentRow.attr("modifiedTimeStamp");
                    elementJson["contentJSONRTE"] = currentRow.attr("modifiedTimeStamp");
                    elementJson["modifiedTimeStamp"] = currentRow.attr("modifiedTimeStamp");
                    elementJson["modified"] = currentRow.attr("modified");
                    elementJson["primaryImageName"] = currentRow.attr("primaryImageName");
                    elementJson["lockGraphicDocStatus"] = currentRow.attr("lockGraphicDocStatus");
                    elementJson["downloadURL"] = currentRow.attr("downloadURL");
                    elementJson["hasAttachment"] = currentRow.attr("hasAttachment");
                }
        //    }
       // });
        return elementJson;
    }
}

function getAssemblyElementsJSONFromGlobalVar(includeGraphic) {
    var assemblyData = globalAAData;
    var artworkElementsArray = new Array();

    $.each(assemblyData, function (index, currentRow) {

        if (includeGraphic)
            artworkElementsArray.push(getElementJsonData(currentRow));
        else {
            if (currentRow.artworkType != "graphic")
                artworkElementsArray.push(getElementJsonData(currentRow));
        }

        if (currentRow.NutritionInfo != null && currentRow.NutritionInfo.length > 0) {
            $.each(currentRow.NutritionInfo, function (index, structuredRow) {
                artworkElementsArray.push(getElementJsonData(structuredRow));
            });
        }
    });

    var returnObj = {};
    returnObj["artworkElements"] = artworkElementsArray;
    returnObj["languageSequenceMap"] = globalLanguageSeqMap;
    return JSON.stringify(returnObj);
}

function getElementJsonData(currentRow) {

    if (currentRow.artworkType != "graphic") {
        var currentRowObject = {};

        var isFromGS1XML = currentRow.id == 'fromGS1XML' ? true : false;

        var copyText = currentRow.COPY_TEXT;
        var copyTextRTE = currentRow.copyTextRTE;
        var notes = currentRow.notes;
        var elementTypeIcon = currentRow.isNoTranslate == true ? "NoTranslate" : currentRow.isInlineCopy == true ? "Inline" : "";
        var isStructuredRoot = false;
        var downloadURL = "";

        if (isFromGS1XML) {
            copyText = decodeHTML(copyText);
            copyTextRTE = decodeHTML(copyTextRTE);
            notes = decodeHTML(notes);
        }
        else
            downloadURL = "../db/o3dconnect/getFile?mode=downloadURL&elementId=" + currentRow.id;

        if (copyText) {
            var index = hasRTLTag(copyText);
            if (index > 0) {
                copyText = copyText.substring(index);
            }
        }

        if (currentRow.NutritionInfo != null && currentRow.NutritionInfo.length > 0)
            isStructuredRoot = true;
        else
            isStructuredRoot = false;

        var searchKey = currentRow.gs1Type + "|" + currentRow.instanceSequence;
        var elementInfo = baseCopyTextBySequence[searchKey];
        if (currentRow.subSturcturedElement == "true") {
            var parentKey = currentRow.UniqueKey.split(":")[1];
            elementInfo = baseCopyTextBySequence[parentKey][searchKey];
        }
        if (currentRow.subSturcturedElement == "true") {
            currentRowObject["parentInfo"] = currentRow.parentInfo;
            currentRowObject["subSturcturedElement"] = currentRow.subSturcturedElement;
            var parentKey = currentRow.UniqueKey.split(":")[1];
            elementInfo = baseCopyTextBySequence[parentKey][searchKey];
        }
        var elementInfoObj = {};
        for (var property in elementInfo) {
            var generateJsonCopy = elementInfo[property]["generate-json-copy-text"];
            elementInfoObj[property] = generateJsonCopy;
        }
        currentRowObject["element-info"] = JSON.stringify(elementInfoObj);

        currentRowObject["type"] = currentRow.artworkType;
        currentRowObject["name"] = currentRow.artworkType;
        currentRowObject["content"] = copyText;
        currentRowObject["contentRTE"] = copyTextRTE;
        currentRowObject["contentJSONRTE"] = generateJSONForCopytext(copyTextRTE);
        currentRowObject["notes"] = notes;
        currentRowObject["instanceSequence"] = currentRow.instanceSequence;
        currentRowObject["sequenceNumber"] = currentRow.sequenceNumber;
        currentRowObject["language"] = currentRow.languageName;
        currentRowObject["state"] = currentRow.lc_CurrentState;
        currentRowObject["gs1Key"] = currentRow.gs1Type;
        currentRowObject["localeSequence"] = currentRow.localeSequence;
        currentRowObject["elementTypeIcon"] = elementTypeIcon;
        currentRowObject["artworkType"] = currentRow.artworkType;
        currentRowObject["UniqueKey"] = currentRow.UniqueKey;
        currentRowObject["structuredRoot"] = isStructuredRoot;


        if (currentRow.subSturcturedElement == "true") {
            currentRowObject["parentInfo"] = currentRow.parentInfo;
            currentRowObject["subSturcturedElement"] = currentRow.subSturcturedElement;
        }

        if (isStructuredRoot) {
            var Uk = currentRow.gs1Type + "|" + currentRow.instanceSequence;
            currentRowObject["UniqueKey"] = Uk;
        }

    }

    if (currentRow.artworkType === "graphic") {
        var currentRowObject = {};
        currentRowObject["gs1Key"] = currentRow.gs1Type;
        currentRowObject["artworkType"] = currentRow.artworkType;
        currentRowObject["instanceSequence"] = currentRow.instanceSequence;
        currentRowObject["type"] = currentRow.artworkType;
        currentRowObject["name"] = currentRow.artworkType;
        currentRowObject["content"] = currentRow.modifiedTimeStamp;
        currentRowObject["contentRTE"] = currentRow.modifiedTimeStamp;
        currentRowObject["contentJSONRTE"] = currentRow.modifiedTimeStamp;
        currentRowObject["modifiedTimeStamp"] = currentRow.modifiedTimeStamp;
        currentRowObject["modified"] = currentRow.modified;
        currentRowObject["primaryImageName"] = currentRow.primaryImageName;
        currentRowObject["lockGraphicDocStatus"] = currentRow.lockGraphicDocStatus;
        currentRowObject["downloadURL"] = downloadURL;
        currentRowObject["hasAttachment"] = currentRow.hasAttachment;
        currentRowObject["UniqueKey"] = currentRow.UniqueKey;
    }

    return currentRowObject;

}

function getSelectionSequenceMap() {
    var selSeqArray = selectionSequenceArray;
    var sequenceInfo = {};
    var linkInfo = {};
    $(".artworkAssembly").each(function (index, elem) {
        if ($(elem).css("pointer-events") !== "none") {
            var linkSpan = $(this).find("span.linkSpan");
            var bgCss = $(linkSpan).css('background-image');
            if (/*$(this).find("span.linkSpan > img.artworkTypeImage").length == 1*/bgCss != "none")
                linkInfo[$(elem).attr("id")] = true;
        }
    });

    for (i = 0; i < selSeqArray.length; i++) {
        sequenceInfo[i] = selSeqArray[i];
    }
    //console.log({ sequenceInfo: sequenceInfo, linkInfo: linkInfo });
    return JSON.stringify({ sequenceInfo: sequenceInfo, linkInfo: linkInfo });
}



