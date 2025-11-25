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
	POA_Edit_Instance = new function () {
	this.urlParameterKey = "poaIds";
	var previousShowedContextMenu;
	this.hideContextMenuOnMove = function() {
		if(Browser.MOBILE && previousShowedContextMenu) {
			$(previousShowedContextMenu).css("display","none");
		}
	}
	// Handler : To position and show context menu
	this.positionContextMenu = function(){
		if(Browser.MOBILE && previousShowedContextMenu) {
			$(previousShowedContextMenu).css("display","none");
		}
		var THRESHOLD_SPACE = 150.00;
		var viewPortHeight = $(window).height();
		// console.log("viewPortHeight = " + viewPortHeight);
		var rowOffset = $(this).closest("tr").offset();
		// console.log("row top position = " + rowOffset.top);
		var availableSpaceForMenu = parseFloat(viewPortHeight) - parseFloat(rowOffset.top);
		// console.log("availableSpaceForMenu " + availableSpaceForMenu);
		if(parseFloat(availableSpaceForMenu) <= THRESHOLD_SPACE) {
			$(this).children(".menu").css({top : rowOffset.top - THRESHOLD_SPACE});
		}else{
			$(this).children(".menu").css({top:rowOffset.top});
		}
		previousShowedContextMenu = $(this).children(".menu").css("display","block");
	};
	
	this.addCEToPOAForConnector = function(node, mcIDs) {
                    'use strict';
 
                   var artworkMasterId = mcIDs.split(",");
				   


				//$(element).parent().parent().parent().find("span.dynatree-checkbox").remove();
				// Support for IE
                var selectedPOAs = customEditUtil.getSelectedPOAs();
				var selectedPOAsArr = selectedPOAs.split(",");
				var addMasterCopyData = "addAnyExisting=true&copyId="+mcIDs+"&selectedPOAs="+selectedPOAs;
				var URL = addRemoveMaster.getAddMasterCopiesServiceURL();
				
				//make ajax call
                    $.ajax({
                        type: "POST",
                        //url: addRemoveMaster.getAddMasterCopyServiceURL(),
						url: URL,
                        data: addMasterCopyData,
                        dataType: "json",
                        cache: false,
                        async: true,
                        beforeSend: function(request) {
                            addSecureTokenHeader(request);
                        },
                        success: function(jsonResponse) {
							$.each(artworkMasterId, function(i,v){
								if (customEditUtil.isTableRowExists(v) == true) {
									var selectedCells = Array();
									$.each(selectedPOAsArr, function(index, value) {
										selectedCells.push(customEditUtil.getCellId(v, value));
									});

									//refresh cells
									var selector = "td[mc_id='" + v + "']";
									renderUIAfterModAssemnblyElement(selectedCells, selector);
								} else {

									//add new row
									customEditUtil.addNewTableRow(v, $("div#selectElement.selectable.artworkElementCell.selected").parent().parent());
								}
							});
						    editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
						   // removeOtherElementCheckBoxes(artworkMasterId);
                            //if (jsonResponse.returnString != "success") {
                                customEditUtil.removeEmptyRows();
                            //    alert(jsonResponse.returnString);
                          //  }
                 
                 var alertMsg = ""; 
                 var showAlert = false;
                 var res = JSON.parse(jsonResponse.returnString);
                 var revs = res.Rev_Exist;
                 var revKeys = Object.keys(revs);
                 var countries = res.No_Country;
                 var countryKeys = Object.keys(countries);
                 var ctxObjType = res.object_type;                 
                 var alertMsg1 = "";
                 var alertMsg2 = "";
                 
                 if(ctxObjType ==="POA"){
                	 alertMsg1 = POA_EDIT_LABELS['AWL.ArtworkElement.MultipleRevisionExistsForPOAs'];
                	 alertMsg2 = POA_EDIT_LABELS['AWL.ArtworkElement.NoCommonCountriesForPOAs'];
                 }else if(ctxObjType ==="Copy List"){
                	 alertMsg1 = POA_EDIT_LABELS['AWL.ArtworkElement.MultipleRevisionExistsForCopyLists'];
                	 alertMsg2 = POA_EDIT_LABELS['AWL.ArtworkElement.NoCommonCountriesForCopyLists'];
                 }else if(ctxObjType ==="Customized POA"){
                	 alertMsg1 = POA_EDIT_LABELS['AWL.ArtworkElement.MultipleRevisionExistsForCustomizedPOAs'];
                	 alertMsg2 = POA_EDIT_LABELS['AWL.ArtworkElement.NoCommonCountriesForCustomizedPOAs'];
                 }
                 if(revKeys.length > 0){
                	 showAlert = true;
                	 alertMsg = alertMsg1;
                	 
                 }
                 revKeys.forEach(function(key){
                	 alertMsg += "\n";
                	 alertMsg += key + " : ";
                	 var rev = revs[key];
                	 rev.forEach(function(ele){
                		 alertMsg += ele + ",";
                	 });
                	 alertMsg = alertMsg.substr(0, alertMsg.length-1);
                 });
                 
                 if(countryKeys.length > 0){
                     showAlert = true;
                     alertMsg += "\n";
                     alertMsg += alertMsg2;
                     
                     countryKeys.forEach(function(key){
                    	 alertMsg += "\n";
                    	 alertMsg += key + " : ";
                    	 var country = countries[key];
                    	 country.forEach(function(ele){
                    		 alertMsg += ele + ",";
                    	 });
                    	 alertMsg = alertMsg.substr(0, alertMsg.length-1);
                     });
                     
                     }
                 if(showAlert)
                	 alert(alertMsg);
                 
			    if(!customEditUtil.isEmpty(jsonResponse['message'])){
					alert(jsonResponse['message']);
				}else if(!customEditUtil.isEmpty(jsonResponse.InvalidSequenceNumbersTypes)){
					alert("These types having invalid sequences: "+ jsonResponse.InvalidSequenceNumbersTypes);
				}

			    $.each(selectedPOAsArr, function(index, poaId) {
			    	editCopyElementSequenceNumber.validateSequenceNumber(poaId);
			    });
			    editInstance.handleHeaderScrollBar();	
                        },
                        error: function(request, status, errorThrown) {
                            alert(errorThrown);
                        }
                    });
                };
	   

	//Handler: To hide context menu
	this.hideContextMenu = function(){
		$(this).children(".menu").css("display","none");
	};
	// Handler: On select of Local Copy Cell enabling/disable required commands from toolbar.
	this.localCopyCellClickHandler=function(e){
		'use strict';
		
		var clickedTD=e.target;
		if(($(e.target).is('span') && $(e.target).hasClass("ellipsis_LC")) || $(e.target).hasClass('seqNumberInputBox') || $(e.target).hasClass('notes-icon'))
			return
		
		if(!$(e.target).is('td'))
		{
			clickedTD = $(e.target).closest( "td" );
		}
		var poaId = $(clickedTD).attr("poa_id");
		var headerCell = document.getElementById(poaId);
		var isNonEditable = $(headerCell).hasClass('non-editable-poa');
		if(!isNonEditable){
		$(clickedTD).toggleClass('success');
		if( $("td.success").length > 0){
			customEditUtil.enableCommand(editInstance.getCellClickEnabledCommandId());	
			editInstance.enableClearButton();
		}else{
			customEditUtil.disableCommand(editInstance.getCellClickEnabledCommandId());	
			editInstance.disableClearButton();
		}
	  }
	  
	  if($(".empty-artworkelement-cell.success").length == $("td.success").length)
		  customEditUtil.disableCommand('#defineMandatoryElements');	  
	};
	
	this.addExistingCLHandler=function(e){
		'use strict';
		var selectedMastersOnEditView = $("div#selectElement.selectable.artworkElementCell.selected");
		if(selectedMastersOnEditView.length > 1){
			alert(POA_EDIT_LABELS['emxAWL.Error.SelectOneMaster']);
			return;
		}
		var selectedPOAs = customEditUtil.getSelectedPOAs();
		var URL = '../common/emxFullSearch.jsp?field=TYPES=type_CopyList:CURRENT=policy_CopyList.state_Release&table=AWLExistingCLSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addCLToPOAEditScreen&selectedPOAIds='+selectedPOAs;
		showModalDialog(URL,100,50,true,'');
	};
	
	this.postAddExistingCL = function(result) {
		'use strict';
		if(result.error != undefined && result.error != "") {
			alertComponent.add({
		        className: 'error awl-new-alert-continer',
		        message: result.error,
		    });
			return;
		}
		if(result.message != "") {
			alertComponent.add({
			        className: 'primary awl-new-alert-continer',
			        message: result.message,
			    });
		}
		var masterIds = result.ids;
		var selectedPOAs = customEditUtil.getSelectedPOAs();
		var selectedPOAsArr = selectedPOAs.split(",");
		var allMasterData = getSyncJSON("../resources/awl/view/artworkmaster/getmastercopiesmetadata", "mca_id="+masterIds);
        var allPOAsDataforEachMC = editInstance.getLocalCopyInfo(selectedPOAs, masterIds);
        
    
		var selectedPOAList = selectedPOAs.split(',');
		var sortBy;
		var isSortByTypeName = false;
		var sortOrder='up';
		var poaToBeConsidered = selectedPOAList[0];
		
		if($('#sortingOrderIcon').attr('class') != 'diamond') {
			isSortByTypeName = true;
			sortOrder = $('#sortingOrderIcon').attr('class');
			sortBy = $('.selectable.sortByIcon.selected').attr('id'); // possible values sortByNameIcon, sortByTypeIcon
		} else {
			var sortedPOA = $('[class="sortBySequenceOrder up"],[class="sortBySequenceOrder down"]')[0];
			var sortedPOAId = $(sortedPOA).parent().parent().attr('id');
			if(selectedPOAList.indexOf(sortedPOAId) != -1) {
				poaToBeConsidered = sortedPOAId;
				sortOrder = $(sortedPOA).attr('class')=="sortBySequenceOrder up"?'up':'down';
			}
		}
		
		var newlyAddedMasterIds = masterIds.split(",");
		newlyAddedMasterIds.sort(function(firstMasterId, secondMasterId){
			var firstNodeId = firstMasterId;
			var secondNodeId = secondMasterId;
			if(firstNodeId && secondNodeId)  {
        		
				var firstMCDetails = allMasterData[firstNodeId];
				var secondMCDetails = allMasterData[secondNodeId];
				if(isSortByTypeName) {
					var firstElementData = firstMCDetails['type'];
					var secondElementData = secondMCDetails['type'];
					if('sortByNameIcon'==sortBy) {
						firstElementData = firstMCDetails['displayName'];
						secondElementData = secondMCDetails['displayName'];
					}
					return ( sortOrder == 'up'? (firstElementData > secondElementData? 1: -1): (firstElementData < secondElementData? 1: -1));
					
				} else {
					var firstMCLocalElementDetailsWithPOA = allPOAsDataforEachMC[firstNodeId];
					var secondMCLocalElementDetailsWithPOA = allPOAsDataforEachMC[secondNodeId];
					
					if(!firstMCLocalElementDetailsWithPOA) {
						return sortOrder == 'up' ? 1: -1;
					}
					if(!secondMCLocalElementDetailsWithPOA){
						return sortOrder == 'up' ? -1: 1;
					}
					
					var firstMCLocalElementDetails = firstMCLocalElementDetailsWithPOA[poaToBeConsidered];
					var secondMCLocalElementDetails = secondMCLocalElementDetailsWithPOA[poaToBeConsidered];
					if(!firstMCLocalElementDetails) {
						return sortOrder == 'up' ? 1: -1;
					}
					if(!secondMCLocalElementDetails){
						return sortOrder == 'up' ? -1: 1;
					}
					
					var firstMCSeqNumber = parseInt(firstMCLocalElementDetails['seqNumb']);
					var secondMCSeqNumber = parseInt(secondMCLocalElementDetails['seqNumb']);
					
					if(isNaN(firstMCSeqNumber) && !isNaN(secondMCSeqNumber)) {
						return sortOrder == 'up' ? 1 : -1;
					} else if(!isNaN(firstMCSeqNumber) && isNaN(secondMCSeqNumber)) {
						return sortOrder == 'up'? -1: 1;
					} else if(isNaN(firstMCSeqNumber) && isNaN(secondMCSeqNumber)) {
						return 0;
					}
					
					var result = firstMCSeqNumber===secondMCSeqNumber;
					if(result) {
						var firstTypeValue = firstMCDetails['type'];
						var secondTypeValue = secondMCDetails['type'];
						
						result = firstTypeValue === secondTypeValue;
						if(result) {
							var firstInstanceSeqValue = parseInt(firstMCLocalElementDetails['InstSeq']);
							var secondInstanceSeqValue = parseInt(secondMCLocalElementDetails['InstSeq']); 
							return ( sortOrder == 'up'? (firstInstanceSeqValue > secondInstanceSeqValue? 1: -1): (firstInstanceSeqValue < secondInstanceSeqValue? 1: -1));
						}else {
							return ( sortOrder == 'up'? (firstTypeValue > secondTypeValue? 1: -1): (firstTypeValue < secondTypeValue? 1: -1));
						}
					} else {
						return ( sortOrder == 'up'? (firstMCSeqNumber > secondMCSeqNumber? 1: -1) : (firstMCSeqNumber < secondMCSeqNumber? 1: -1));
					}
				}
			}
		});
		// IR-589730-3DEXPERIENCER2015x - Sort logic end
		newlyAddedMasterIds.forEach(function(elementId){
			if (customEditUtil.isTableRowExists(elementId) == true) {
				var selectedCells = Array();
				$.each(selectedPOAsArr, function(index, poaId) {
					selectedCells.push(customEditUtil.getCellId(elementId, poaId));
				});
				//refresh cells
				var selector = "td[mc_id='" + elementId + "']";
				renderUIAfterModAssemnblyElement(selectedCells, selector);
			} else {
				//add new row
				if(allPOAsDataforEachMC[elementId])
					customEditUtil.addNewTableRowsilent(elementId,allMasterData[elementId],  allPOAsDataforEachMC[elementId], $("div#selectElement.selectable.artworkElementCell.selected").parent().parent());
			}
			$.each(selectedPOAsArr, function(index, poaId) {
					editCopyElementSequenceNumber.validateSequenceNumber(poaId);
			});
		});
		
		editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
		editInstance.handleHeaderScrollBar();
	};
	
	/*
		This function will return id of command to be enabled after click of cell on poaedit page.
		TODO : this function may be modified to return array of commands. 
	*/
	this.getCellClickEnabledCommandId = function(){
		return "#modifyAssemlyElement";
	};

	// Handler: Enable Clear Button
	this.enableClearButton = function(){
			customEditUtil.enableCommand('#clear');			
	};

	// Handler: Disable Clear Button
	this.disableClearButton = function(){
		if($("td.success").length === 0 && $("th.POASelected").length === 0 && $("td div.selected").length === 0){
			customEditUtil.disableCommand('#clear');
		}
	};

	// Handler: Clear selected Header and Cells
	this.clearSelection = function(){
		$("td.success").each(function(){
			$(this).toggleClass('success');
		});
		
		$("th.POASelected").each(function(){
			$(this).toggleClass('POASelected');
		});
		$("td div.selected").each(function() {
			$(this).toggleClass('selected');
		});
		
		$('#selectAll').removeClass('selected');
		$('#selectAllElements').removeClass('selected');
		
		var commandsArray = ['modifyAssemlyElement','addArtworkMaster','createMasterCopyElement',
		                     'createGraphicElement','manageCountryLanguages', 'removePOA',
		                     'removeCopyList', 'defineMandatoryElements', 'connectComprisedPOA',
		                     'disconnectComprisedPOA', 'addElementFromComprisedPOA', 'editNote',
		                     'editInstanceSequence', 'removeArtworkMaster','resequenceElements','saveSequenceNumber','addExistingElem', 'addExistingCL'];

		customEditUtil.disableCommands(commandsArray);

		$("#removeAllHeaderIcon").addClass('disabled');
		$("#removeAllHeaderIcon").attr("style","opacity:0.25;");
		editInstance.disableClearButton();
	};

// To Override:Get the Local Copy Dialog Columns Header
this.getLCDialogColumnsHeader = function(theadRow){
	'use strict';
	var notes = $("<th>" +POA_EDIT_LABELS['emxAWL.Label.Notes']+"</th>");
	$(theadRow).append(notes);
	if(IS_POA_CUSTOMIZED == false){
		var thCopyLists=$("<th>"+POA_EDIT_LABELS['emxAWL.TableHeader.CopyLists']+"</th>");
		$(theadRow).append(thCopyLists);
	}
	else{
		var poaHeader = $("<th>" +POA_EDIT_LABELS['emxAWL.Label.ComprisedPOAs']+"</th>");
		$(theadRow).append(poaHeader);
	}
	};
// To Override:Get the Local Copy Dialog Body
this.getLCDialogBodyData = function(clickedSpan){
		return  getSyncJSON("../resources/awl/view/artworkelement/getcopycontent", "selArtworkContentIds="+$(clickedSpan).attr('lc_ids')+"&poaId=" + $(clickedSpan).closest("td").attr("poa_id")+"&type=POA");
	};
// To Override:Get the Local Copy Dialog Columns
this.getLCDialogColumns = function(eachLangNewRow,lc_info,clickedSpan,index){
	var eachLCNotesCell = $("<td/>").html(lc_info.Notes);
	$(eachLangNewRow).append(eachLCNotesCell);
	
	if(IS_POA_CUSTOMIZED == false){
		var eachLCCopyListsCell = $("<td/>").html(lc_info.CopyLists)
		$(eachLangNewRow).append(eachLCCopyListsCell);
	}
	else{
		var poas = "";
		if(lc_info.lcPOAs != null)
			poas = lc_info.lcPOAs;
		var eachLCPOAs= $("<td/>").html(poas); 
		$(eachLangNewRow).append(eachLCPOAs);
	}
	};
// Handler:Local Elements Language Ellipsis Handler :To show local copy with language name , local copy Name and local copy Text
this.lcLanguageEllipsisHandler = function(e){
	'use strict';
	var clickedSpan=e.target;
	if($(clickedSpan).is("b"))
		clickedSpan = $(e.target).parent()[0];
	if(!$(clickedSpan).is('span'))
		return;
	
	var structureTypes = Array();
	// To support in IE we need to trim() before split()
	$.each($(clickedSpan).attr('isstructuredelementarray').trim().split(","), function(i, el){
		if($.inArray(el, structureTypes) === -1) structureTypes.push(el);
	});

	var isStructuredElementType = "true" === structureTypes[0] ;
	
	// show Master Type and Master Copy text as Table header
	
	var trElem=$(clickedSpan).closest("tr");
	var isInlineCopy=trElem.data('isInline'); 	
	var isLanguageSplitToken=","; 	
	if(isInlineCopy == true){
		if( customEditUtil.isCustomModifyPOA($(clickedSpan).closest("td").attr('poa_id'))== true){
			isLanguageSplitToken ="|";
		}
	}
	var poaId = $(clickedSpan).closest("td").attr('poa_id');
	var masterTypeTD = $(trElem).children("td")[0];
	// filter only <P> element text
	var masterTypeInfo = $(masterTypeTD).find("p").text();
	var displayNameTD = $(clickedSpan).closest("tr").children("td")[0];
	var mcDisplay = masterTypeInfo + " - " + $(displayNameTD).attr("dispname") + " - "+$(displayNameTD).attr("revision");
	var langTable = $('<table id="langTable" title="'+mcDisplay+'"></table>');
	langTable.attr("class","table table-bordered table-condensed table-hover table-striped");
	// langTable.attr("style","width: 100%;");
	var thead = $("<thead ></thead>");
	var theadRow = $("<tr></tr>");
	theadRow.attr("class","POAHeaderRow");
	var thLanguage=$("<th>"+POA_EDIT_LABELS['emxAWL.Table.Language']+"</th>");
	var thName =$("<th>"+POA_EDIT_LABELS['emxFramework.Basic.Name']+"</th>");
	
	if(!isStructuredElementType)
		var thCopyText= $("<th>" +POA_EDIT_LABELS['emxLabel.Label.BaseContent']+"</th>");
	
	var thCurrent=$("<th>"+POA_EDIT_LABELS['emxAWL.Label.CurrentState']+"</th>");
	var thLatestRevision=$("<th>"+POA_EDIT_LABELS['emxAWL.POAEditView.LinkedRevision']+"</th>");
	var thNewRevAvailable=$("<th>"+POA_EDIT_LABELS['emxAWL.POAEditView.NewAvailableRevision']+"</th>");
	$(theadRow).append(thLanguage);
	$(theadRow).append(thName);
	$(theadRow).append(thCopyText);
	$(theadRow).append(thCurrent);
	$(theadRow).append(thLatestRevision);
	$(theadRow).append(thNewRevAvailable);
	
	editInstance.getLCDialogColumnsHeader(theadRow);
	
	
	$(thead).append(theadRow);
	$(langTable).append(thead);
	
	var langTableBody = $('<tbody></tbody>');
	var jsonLocalCopyData = editInstance.getLCDialogBodyData(clickedSpan);
	// jsonLocalCopyData=jsonLocalCopyData.data;
	var lc_ids = $(clickedSpan).attr('lc_ids').split(",");
	var langNames = $(clickedSpan).attr('lang_names').split(isLanguageSplitToken);
	var langMandInfo = $(clickedSpan).attr('lc_mandIds').split(",");
	var eachLCCurrentArray=$(clickedSpan).attr('lc_currentstate').split(",");
	$.each(lc_ids, function( index,lc_id) {
		var langName ="";
		var langMand="";
		var langCurrentState="";
		if(lc_ids.length == 1){
			langName = $(clickedSpan).attr('lang_names');
			langCurrentState = $(clickedSpan).attr('lc_currentstate');
			langMand=$(clickedSpan).attr('lc_mandIds');
			}
		else{
			langName = langNames[index];
			langCurrentState = eachLCCurrentArray[index];
			langMand=langMandInfo[index];
		}
		
		if(langMand == 1){
			langName=editInstance.IMAGE_TAG+langName;
		}
		var eachLangNewRow = $('<tr></tr>');
		var eachLangCell = $('<td>'+langName+'</td>');
			eachLangCell.attr("class","langSpan");
		var lc_info =  jsonLocalCopyData[lc_id];
		var eachLCNameCell = $('<td>'+lc_info.lcName+'</td>');	
		var eachLCCurrent=$('<td>'+langCurrentState+'</td>');
		var copyText=""; 
		if(lc_info.content != null)
			copyText = lc_info.content;
		
		$(eachLangNewRow).append(eachLangCell);
		$(eachLangNewRow).append(eachLCNameCell);
		if(!isStructuredElementType) {
			var eachLCContentCell = $('<td>'+copyText+'</td>');
			$(eachLangNewRow).append(eachLCContentCell);
		}
		$(eachLangNewRow).append(eachLCCurrent);
		
		/** Multi Revisions Code * */
		var eachLCRevisionCell = $("<td/>");
		$(eachLCRevisionCell).attr("align", "center");
		$(eachLCRevisionCell).attr("width", "120px");
		var revisionInfo = JSON.parse(lc_info["revision-info"]);
		
		var currentRev =  parseInt(lc_info.revision);
		var isLatestRevExist = lc_info.revision < lc_info.noOfRevisions? true: false;
		
		//var minusButton = $("<div/>").addClass("value-button").html('&#9660;');
		var minusButton = $("<div/>").addClass("value-button").html("-");
		$(minusButton).attr('id', "decrease");
		
		var revisionDiv = $("<div/>").addClass("revisionDiv").html(lc_info.revision);
		$(revisionDiv).attr('oldlcid', lc_id);
		//var plusButton = $("<div/>").addClass("value-button").html('&#9650;');
		var plusButton = $("<div/>").addClass("value-button").html("+");
		$(plusButton).attr('id', "increase");
		var extraLangInfo = $('<img/>').attr("src", "../common/images/I_A-newer-revision-exists.png")
				.attr("title", POA_EDIT_LABELS['emxAWL.Tooltip.NewRevisionAvailable'])
				.css("display", "block")
				.css("margin-left", "auto")
				.css("margin-right", "auto")
				.css("margin-top", "5%")
				.addClass("localrevisionImg");
		isLatestRevExist? $(extraLangInfo).css("visibility", "visible"): $(extraLangInfo).css("visibility", "hidden");
		var eachNextRevAvailCell = $("<td/>").append(extraLangInfo);
		
		$(plusButton).click(function(){
			var value = parseInt($(revisionDiv).text());
	        value = isNaN(value) ? lc_info.revision : value;
	            value++;
	            var higerRevFound = false;
	            while(value <= lc_info.noOfRevisions && !higerRevFound){
	            		if(revisionInfo[value] || (value == lc_info.revision))
	            			higerRevFound = true;
	            		else 
	            		    value++;
	            	}
	            if(higerRevFound || (value == lc_info.revision)){
		            $(revisionDiv).text(value);
		            $(eachNextRevAvailCell).find("img").css("visibility", "hidden");
		            // $(revisionDiv).attr('newlcid', revisionInfo[value-1].id);
		            var revisionId;
		            var revisionCurrent;
		            var lc_content;
		            if(value == lc_info.revision){
		            	revisionId = lc_id;
		            	revisionCurrent = langCurrentState;
		            	lc_content = copyText;
		            }
		            else {
		            	revisionId = revisionInfo[value].id;
		            	revisionCurrent = revisionInfo[value].current;
		            	lc_content = revisionInfo[value].content;
		            }
		            $(revisionDiv).attr('newlcid', revisionId);
		            if($(revisionDiv).attr('newlcid') != $(revisionDiv).attr('oldlcid')) {
		            		$(revisionDiv).addClass('lcChanged');
		            }
		            else {
		            	$(revisionDiv).removeClass('lcChanged');
		            	$(revisionDiv).removeAttr('newlcid');
		            }
		            $(eachLCCurrent).text(revisionCurrent);
		            if(!isStructuredElementType && lc_content != null){
		            	$(eachLCContentCell).html(lc_content);
		            }
	            }
		});
		$(minusButton).click(function(){
			 var value = parseInt($(revisionDiv).text());
		        value = isNaN(value) ? lc_info.revision : value;
		            value--;
		            var lowerRevFound = false;
		            while(value >= 1 && !lowerRevFound){
		            		if(revisionInfo[value] || (value == lc_info.revision))
		            			lowerRevFound = true;
		            		else 
		            		    value--;
		            	}
		            if(lowerRevFound || (value == lc_info.revision)){
			            $(revisionDiv).text(value);
			            $(eachNextRevAvailCell).find("img").css("visibility", "visible");
			            //$(revisionDiv).attr('newlcid', revisionInfo[value-1].id);
			            var revisionId;
			            var revisionCurrent;
			            var lc_content;
			            if(value == lc_info.revision){
			            	revisionId = lc_id;
			            	revisionCurrent = langCurrentState;
			            	lc_content = copyText;
			            }
			            else {
			            	revisionId = revisionInfo[value].id;
			            	revisionCurrent = revisionInfo[value].current;
			            	lc_content = revisionInfo[value].content;
			            }
			            $(revisionDiv).attr('newlcid', revisionId);
			            if($(revisionDiv).attr('newlcid') != $(revisionDiv).attr('oldlcid')) {
		            		$(revisionDiv).addClass('lcChanged');
			            }
			            else {
			            	$(revisionDiv).removeClass('lcChanged');
			            	$(revisionDiv).removeAttr('newlcid');
			            }
			            $(eachLCCurrent).text(revisionCurrent);
			            if(!isStructuredElementType && lc_content != null){
			            	$(eachLCContentCell).html(lc_content);
			            }
		            }
		});
//		var isAddedFromComprisedPOA = "true" == $(clickedSpan).attr("isAddedFromComprisedPOA");
//		if(isAddedFromComprisedPOA) {
//			$(minusButton).off('click');
//			$(plusButton).off('click');
//			$(minusButton).css("cursor", "not-allowed");
//			$(plusButton).css("cursor", "not-allowed");
//		}
		
		$(eachLCRevisionCell).append(minusButton);
		$(eachLCRevisionCell).append(revisionDiv); 
		$(eachLCRevisionCell).append(plusButton); 
		// $(eachLCRevisionCell).centerElement();
		$(eachLangNewRow).append(eachLCRevisionCell); 
		$(eachLangNewRow).append(eachNextRevAvailCell); 
		
		var poaState = document.getElementById(poaId).getAttribute('poa_state');
		//if("Draft" != poaState)
		if( (!isCopyListGlobal && poaState != POA_EDIT_LABELS['emxFramework.State.Draft']) || (isCopyListGlobal && poaState != POA_EDIT_LABELS['emxFramework.State.Preliminary'])){
			$(minusButton).off('click');
			$(plusButton).off('click');
		}
		$(minusButton).hover(function(){
			if(!isCopyListGlobal && poaState != POA_EDIT_LABELS['emxFramework.State.Draft'])
				$(this).attr('title', "POA is Not-Editable in "+ poaState + " State");
			else if(isCopyListGlobal && poaState != POA_EDIT_LABELS['emxFramework.State.Preliminary'])
				$(this).attr('title', "Copy List is Not-Editable in "+ poaState + " State");
		});
		$(plusButton).hover(function(){
			if(!isCopyListGlobal && poaState != POA_EDIT_LABELS['emxFramework.State.Draft'])
				$(this).attr('title', "POA is Not-Editable in "+ poaState + " State");
			else if(isCopyListGlobal && poaState != POA_EDIT_LABELS['emxFramework.State.Preliminary'])
				$(this).attr('title', "Copy List is Not-Editable in "+ poaState + " State");
		});
		
		/** Multi Revisions Code end * */
		
		editInstance.getLCDialogColumns(eachLangNewRow,lc_info,clickedSpan,index);
		$(langTableBody).append(eachLangNewRow);
	});
		
	$(langTable).append(langTableBody); 
	
	//Multi Revisions 
	var buttonsConfig = [
		{
		    text: POA_EDIT_LABELS['emxCommonButton.OK'],
		    open: function() { $(this).addClass('buttonBackground') },
		    click: function () {
		        var poaNewLcArr = [];
		        var poaOldLcArr = [];
		        var selectedTDs = $(this).find(".lcChanged");
		        selectedTDs.each(function () {
		            poaNewLcArr = poaNewLcArr.concat($(this).attr("newlcid"));
		            poaOldLcArr = poaOldLcArr.concat($(this).attr("oldlcid"));
		        });
		        var reqArg = {};
		        reqArg["poaNewLcData"] = poaNewLcArr;
		        reqArg["poaOldLcData"] = poaOldLcArr;
		        reqArg["poaId"] = $(clickedSpan).closest("td").attr("poa_id");
		        reqArg["mcId"] = $(clickedSpan).closest("td").attr("mc_id");
		        if(poaNewLcArr.length > 0){
		        	$(clickedSpan).closest("td").addClass("success");
		        	// $(clickedSpan).closest("td").addClass("revisionChange");
		        var revisionupdateurl = editInstance.getRevisionUpdateURL();
		        editInstance.ajaxExec(revisionupdateurl, reqArg,
                function (data, arg_data) {
                    if (data.result == "error") {
                        alert(data.message);
                        return;
                    }

                    var mcids = [];
                    var selectedPOAIDsArray = [];
                    var poaId = reqArg["poaId"];
                    var mcId = reqArg["mcId"];
                    mcids.push(mcId);
                    selectedPOAIDsArray.push(poaId);
                    $.each(mcids, function (i, mcid) {
                        var selectedCells = new Array();
                        $.each(selectedPOAIDsArray, function (index, value) {
                            selectedCells.push(customEditUtil.getCellId(mcid, value));
                        });
                        renderUIAfterLCRevisionChange(selectedCells, "td[mc_id='" + mcid + "']");
                    });
                    customEditUtil.SuccessAlert(POA_EDIT_LABELS["emxAWL.Alert.RevisionUpdatedSuccessfully"]);
                },
        function () { alert(POA_EDIT_LABELS['emxAWL.EditNote.Error']) });
		    }
		        $(this).dialog('destroy').remove();
		    }
		},
			{
			    text: POA_EDIT_LABELS['emxCommonButton.Cancel'],
			    click: function () {
			    	var selectedTDs = $(this).find(".lcChanged");
			    	if(selectedTDs.length > 0){
			    		if(confirm(POA_EDIT_LABELS['emxAWL.Alert.DiscardChanges']))
			    			$(this).dialog('destroy').remove();
			    	}
			    	else
			    		$(this).dialog('destroy').remove();
			    },
			}
];
	
	//Multi Revisions
	langTable.dialog({
        title: jQuery(this).attr("data-dialog-title"),
        closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
        beforeClose: function() { 
        	var selectedTDs = $(this).find(".lcChanged");
	    	if(selectedTDs.length > 0){
	    		if(confirm(POA_EDIT_LABELS['emxAWL.Alert.DiscardChanges']))
	    			return true;
	    		else
	    			return false;
	    	}
        	},
        modal: false,
        hide: { effect: "none", duration: 150 },
        show: { effect: "none", duration: 150 },
        width: 'auto',
        height: 'auto',
        position: {
            my: 'center',
            at: 'center',
            of: this
        },
        buttons: buttonsConfig
    });
	langTable.parent().addClass("LanguageDialogue-overflow");
};

// Handler:POA Language Ellipsis Handler :To show POA langauges with Sequence number
this.poaLangaugeEllipsisHandler = function(e){
	'use strict';
	var clickedSpan=e.target;
	if(!$(clickedSpan).is('span'))
		return;
	var poaLangTable = $("<table>").attr("id","poaLangTable");
	poaLangTable.attr("class","table table-bordered table-condensed table-hover table-striped");
	poaLangTable.attr("style","width: 100%;");
	var poaName = clickedSpan.parentElement.childNodes[0].textContent
	poaLangTable.attr("title",poaName);
	poaLangTable = editInstance.getDialogContentForPOALanguages(poaLangTable, clickedSpan); 
	poaLangTable.dialog({
        title: jQuery(this).attr("data-dialog-title"),
        closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
        close: function() { jQuery(this).remove(); },
        modal: false,
        hide: { effect: "none", duration: 150 },
        show: { effect: "none", duration: 150 },
        width: 'auto',
        height: 'auto',
        position: {
            my: 'center',
            at: 'center',
            of: this
        }
    });
	poaLangTable.parent().addClass("LanguageDialogue-overflow");
};
// To Override:On click of header languages ellipsis show dialog with all languages. 
this.getDialogContentForPOALanguages =function(poaLangTable,clickedSpan){
	var thead = $("<thead ></thead>");
	var theadRow = $("<tr></tr>");

	var thLanguage=$("<th>"+POA_EDIT_LABELS['emxAWL.common.Languages']+"</th>");
	$(thLanguage).attr("style","background: #368ec4;width: 50%");
	var thName =$("<th>"+POA_EDIT_LABELS['emxAWL.BuildListSequence.Label']+"</th>");
	$(thName).attr("style","background: #368ec4;width: 50%");
	$(theadRow).append(thLanguage);
	$(theadRow).append(thName);
	$(thead).append(theadRow);
	$(poaLangTable).append(thead);
	var langTableBody = $('<tbody></tbody>');
	var langNames = $(clickedSpan).attr('lang_names').split(",");
	$.each($(clickedSpan).attr('lang_seq').split(","), function( index,lc_id) {
		var langName = langNames[index];
		var eachLangNewRow = $('<tr></tr>');
		var eachLangNameCell = $('<td>'+langName+'</td>');
		var eachLangSeqCell = $('<td>'+lc_id+'</td>');
		$(eachLangNewRow).append(eachLangNameCell);
		$(eachLangNewRow).append(eachLangSeqCell);
		$(langTableBody).append(eachLangNewRow);
	});
	$(poaLangTable).append(langTableBody);
	return poaLangTable;
	};
// Handler:POA Language Ellipsis Handler :To show POA Countries
this.poaCountrieEllipsisHandler = function(e){
	var clickedSpan=e.target;
	var poaName = clickedSpan.parentElement.childNodes[0].textContent
	editInstance.createSigleColumnEllipsisDialog(e,poaName,'country_names');
};
// To Override:POA Artwork Usage Ellipsis Handler :To show Artwork Usage
this.poaArtworkUsageEllipsis = function(e){
	return true;		
};
// Common API To create Dialog
this.createSigleColumnEllipsisDialog = function(e,header,attributeName){
	'use strict';
	var clickedSpan=e.target;
	if(!$(clickedSpan).is('span'))
		return;

	var poaCountryTable = $('<table id="poaCountryTable" title="'+header+'"></table>');
	poaCountryTable.attr("class","table table-bordered table-condensed table-hover table-striped");
	poaCountryTable.attr("style","width: 100%;");
	var thead = $("<thead ></thead>");
	var theadRow = $("<tr></tr>");

	var thName=$("<th>"+POA_EDIT_LABELS['emxAWL.Label.POACountries']+"</th>");;
	if("artworkUsage"==attributeName) {
		thName=$("<th>"+POA_EDIT_LABELS['emxAWL.Action.AWLArtworkUsage']+"</th>");
	}
	$(thName).attr("style","background: #368ec4;width: 50%");
	$(theadRow).append(thName);
	$(thead).append(theadRow);
	$(poaCountryTable).append(thead);
	var tableBody = $('<tbody/>');
	var valuesArray = $(clickedSpan).attr(attributeName);
	valuesArray = JSON.parse(valuesArray) ;
	$.each(valuesArray, function( index,countryName) {
		var eachNewRow = $('<tr></tr>');
		var eachNameCell = $('<td>'+countryName+'</td>');
		$(eachNewRow).append(eachNameCell);
		$(tableBody ).append(eachNewRow);
	});
	$(poaCountryTable).append(tableBody ); 
	poaCountryTable.dialog({
        title: jQuery(this).attr("data-dialog-title"),
        closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
        close: function() { jQuery(this).remove(); },
        modal: false,
        hide: { effect: "none", duration: 150 },
        show: { effect: "none", duration: 150 },
        width: 'auto',
        height: 'auto',
        position: [e.pageX,e.pageY],
        autoResize: true
    });
	poaCountryTable.parent().addClass("LanguageDialogue-overflow");
};

// To Override:To add languages in POA header with ellipsis also register event on click of language.
this.poaLangaugesWithEllipsis=function(languageIdsList,languageNamesList,languageSeqList){
	'use strict';
	if(languageNamesList.length > 0 ){
	    var langSpan = $('<span></span>');	    
		$(langSpan).attr("style","font-size:small;font-weight:normal;");
		var ellipsisEnable=false;
		var languageNamesString = "";
		var langNames=Array();
		var sequenceArray=Array();
		$.each(languageNamesList,function(index,value){
			sequenceArray.push(languageSeqList[index]);
			langNames.push(value);
			
			if(index < 3){
				languageNamesString = languageNamesString + value;
				if(index < (languageNamesList.length-1))
					languageNamesString = languageNamesString+",";
			}
			else if(!ellipsisEnable){
				var extraLangs = languageNamesList.length-3;
				languageNamesString = languageNamesString+"+"+extraLangs;
				ellipsisEnable=true;
			}
		});
		if(languageNamesString && languageNamesString.length > 0){
			$(langSpan).append(languageNamesString);
			$(langSpan).attr({ "lang_names": langNames, "lang_seq": sequenceArray,"lang_ids":languageIdsList});
			$(langSpan).addClass("ellipsis_POA_lang langSpan");
		}
	return langSpan;
	}
	else{ return "";}
}

// To add Countries in POA header with ellipsis also register event on click of language.
this.poaCountriesWithEllipsis=function(countryNamesList,countryIdList){
	'use strict';
	if(countryNamesList.length > 0 ){
		var countrySpan = $('<span/>').addClass("countryInfoSpan");
		$(countrySpan).attr("style","font-size:small;font-weight:normal;");
		var ellipsisEnable=false;
		var countryNamesString = "";
		var countriesVisible = 3;
		$.each(countryNamesList,function(index,value){
			if(index < countriesVisible){ // Three countries will be displayed
				countryNamesString = countryNamesString + value;
				if(index < (countryNamesList.length-1))
					countryNamesString = countryNamesString+",";
			}
			else if(!ellipsisEnable){
				var extraCountries = countryNamesList.length - countriesVisible;
				countryNamesString = countryNamesString+"+"+extraCountries;
				ellipsisEnable=true;
			}
		});
		if(countryNamesString && countryNamesString.length > 0){
			$(countrySpan).append(countryNamesString);
			$(countrySpan).attr("country_names", JSON.stringify(countryNamesList));
			$(countrySpan).attr("country_ids", JSON.stringify(countryIdList));
			// To show dialog if its as ellipsis
			if(ellipsisEnable)
				$(countrySpan).addClass("ellipsis_POA_Country");
		}
		return countrySpan;
	}
	else{ return "";}
}

//#fillheader
//Create Table header with static Master Copy details and with dynamic POA Header information
this.createTableWithHeader = function(poaIds) {
	'use strict';
	
	  /*var MIN_TABLE_WIDTH = 0.7 * $(window).width();*/
	  var tableHTML = $("<table>").attr("id","editTable");
	  var commandsDiv = $("<div>").attr("id","commandsDiv").attr("class","commandsDiv");
	  var theadHTML = $("<thead>").attr("id","editTableHeader"); //.attr("width",$(window).width()*0.8+"px");
	  var editColumnHeaderRow = $("<tr>").attr("id","editColumnHeaderRow").attr("style","color:#ffffff;");
	  editInstance.createActionToolbar(commandsDiv);
	  var elementTypeHTML = $("<th>").attr("id","elementTypeCell");
	  var elementTypeText = $("<span/>").html(POA_EDIT_LABELS['emxAWL.Label.ElementTypeDisplayName']);// RRR1 Todo Use new label html(POA_EDIT_LABELS['emxAWL.Label.CopyElementType']);
    var sortingOrderIcon = $("<div>").attr("id","sortingOrderIcon").attr("class","diamond");
  	elementTypeHTML.append(elementTypeText).append(sortingOrderIcon); //.append(filterContainer);//RRR1 - To Add the filter in first column header
  	elementTypeHTML.addClass("edit-table-header artwork-master-type-header element-type-header");

    var selectAllElementsWrapper = $("<div>").attr("id","selectAllElementsWrapper");
  	var selAllElem = $('<div>').attr('id', 'selectAllElements').addClass('selectable');
  	var selectAllText = $("<div>").html(POA_EDIT_LABELS['emxAWL.Label.SelectAll']).attr("id","selectAllElementsLabel");
  	selectAllElementsWrapper.append(selAllElem).append(selectAllText);
    
    var sortOptions = $('<div>').attr("id","sortOptionsContainer");
    var sortBy = $('<span>').attr("id","sortOptions").html(POA_EDIT_LABELS["emxAWL.Label.SortBy"]);
    var type = $('<span>').attr("id","sortByType").html(POA_EDIT_LABELS['emxFramework.Basic.Type']);
      var sortByTypeIcon = $('<div>').attr("id","sortByTypeIcon").attr("class","selectable sortByIcon");
    type.append(sortByTypeIcon);
    var name = $('<span>').attr("id","sortByName").html(POA_EDIT_LABELS['emxFramework.Basic.Name']);
      var sortByNameIcon = $('<div>').attr("id","sortByNameIcon").attr("class","selectable selected sortByIcon");
    name.append(sortByNameIcon);

    //.css("background","URL('../images/uncheck-pressed.png')");
    
    sortOptions.append(sortBy).append(type).append(name);
    elementTypeHTML.append(selectAllElementsWrapper).append(sortOptions);
	
// BNN2 Sorting Logic - Starts
	var orders=[1];
	elementTypeHTML.on("click",function(e){
		var selection = e.target;

        var selectionIndex = "";
        if($(selection).is('#sortByType') || $(selection).is('#sortByName') || $(selection).is("#sortOptionsContainer") 
          || $(selection).is("#sortByTypeIcon") || $(selection).is("#sortByNameIcon") || $(selection).is("#sortOptions") || $(selection).is("#selectAllElementsWrapper") || $(selection).is("#selectAllElements") || $(selection).is("#selectAllElementsLabel")) // page should not be sorted when we click
            {
			if($(selection).is('#sortByTypeIcon')) {
                $(selection).addClass("selected");
                $('#sortByNameIcon').removeClass("selected");
                }
            else if($(selection).is("#sortByNameIcon")){
                $(selection).addClass("selected");
                $('#sortByTypeIcon').removeClass("selected");
            }
                return;
            }
        
        if($('#sortByTypeIcon').hasClass('selected')){
            selectionIndex = 1;
        }else{
            selectionIndex = 2;
        }

        $('.sortBySequenceOrder').addClass('diamond');// Removing sort icon on POA Header cell


       if($("#sortingOrderIcon").hasClass('diamond')){
    	   $("#sortingOrderIcon").addClass("up");
           $("#sortingOrderIcon").removeClass("down");
           $("#sortingOrderIcon").removeClass("diamond");
   
       }else{
        $("#sortingOrderIcon").toggleClass("up");
        $("#sortingOrderIcon").toggleClass("down");
       }
		var tableBody = $("tbody")[0];
		var thead=tableBody.previousElementSibling;
		var rows = [];
        
        for(var i=0;i<tableBody.getElementsByTagName('tr').length;i++) {
            rows.push(tableBody.getElementsByTagName('tr')[i]);
        }
        
		var rowLength=rows.length;
		var colIndex=0;
		rows.sort(function(a,b){
		                var i=a.children[colIndex].children[selectionIndex].textContent.toLowerCase();
		                var j=b.children[colIndex].children[selectionIndex].textContent.toLowerCase();
		                return i===j?0:i>j?orders[colIndex]:-orders[colIndex];
		});
		orders[colIndex]*=-1;
		while(tableBody.lastChild)
			tableBody.removeChild(tableBody.lastChild);
		while(rowLength--)
			$(tableBody).prepend(rows[rowLength]);
	});   
  // BNN2 Sorting Logic - Ends

	var flagHTML = $("<span><img src='../common/images/iconActionStart.gif' style='width:16px; height:16px;padding-right:2px;' /></span>");
	// display name
	var displayNameHTML = $("<th/>").addClass("edit-table-header display-name-header").html(POA_EDIT_LABELS['emxFramework.Basic.State']+ "</br>"+POA_EDIT_LABELS['AWL.Common.Revision']+"</br>")// RRR1
	displayNameHTML.append(flagHTML);
	// flag HTML
	//var flagHTML = $("<th><img src='../common/images/iconActionStart.gif' style='width:16px; height:16px;padding-right:2px;' /></th>");
	// flagHTML.attr("class","edit-table-header flag-cell-header");

	//masterCopyContent
	var mcContentHTML = $("<th>"+POA_EDIT_LABELS['emxLabel.Label.BaseContent']+"</th>");
	mcContentHTML.attr("class","edit-table-header content-cell-header");
	var selectAllWrapper = $("<div>").attr("id","selectAllWrapper");
	var selAllElem = $('<div>').attr('id', 'selectAll').addClass('selectable poa-edit-toolbar');
	var selectAllText = $("<div>").attr("id","selectAllLabel");
	if(this.urlParameterKey == "copyListId"){
		selectAllText.html(POA_EDIT_LABELS['emxAWL.Action.SelectAllCopyLists']);
	} else {
		selectAllText.html(POA_EDIT_LABELS['emxAWL.Action.SelectAllPOAs']);
	}
	
	
	selectAllWrapper.append(selAllElem).append(selectAllText);
	mcContentHTML.append(selectAllWrapper);
	// Append static coloumn's header to table.
	$(editColumnHeaderRow).append(elementTypeHTML).append(displayNameHTML).append(mcContentHTML); 																								//RRR1 -  instead of appending to editHeaderRow
	var editTableDiv=$("#editTableDiv");

	theadHTML.append(editColumnHeaderRow);


	var actionToolbar = $("#actionToolbarDiv");
	actionToolbar.append(commandsDiv);

	
	tableHTML.append(theadHTML);
	editTableDiv.append(tableHTML);
	
	// get Dynamic columns from ajax here.
	var jsonPOAHeaderData = this.getDynamicColumnHeaderData(poaIds);
	var poaIdArr = poaIds.split("|");

	$.each(poaIdArr , function (index){
		// alert(poaIdArr[index]);
		var poaId = poaIdArr[index];
		var poaData = jsonPOAHeaderData[poaId];
		
		
		var poaColHeader = $("<th></th>");

		var languageIdsList =  poaData.LanguageInfo.Ids;
		var languageNamesList = poaData.LanguageInfo.Name;
		var languageSeqList = poaData.LanguageInfo.Seq;
		var countryIdsList =  poaData.CountryInfo.Ids;
		var countryNamesList = poaData.CountryInfo.Name;
		// Product Information details
		var productIdsList =  poaData.ProductInfo.Ids;
		var productNamesList = poaData.ProductInfo.Name;
		var productTypesList = poaData.ProductInfo.Types;
		
		
		var poaInfoMap = poaData.POA_Info;
		var poaState = poaInfoMap.current;
		var poaNameState = poaInfoMap.Name+" ("+poaState+")";								// editInstance.getDisplayName(poaInfoMap.Name)+"
		poaColHeader.append($("<p>").addClass("poaName").html(poaNameState)); // poaInfoMap.Name

		//Get Artwork Usage,Languages, Countries dynamically
		poaColHeader.append(editInstance.getArtworkUsageInfo(poaData.POA_Info));
		poaColHeader.append(editInstance.poaLangaugesWithEllipsis(languageIdsList,languageNamesList,languageSeqList));
		poaColHeader.append(editInstance.poaCountriesWithEllipsis(countryNamesList,countryIdsList));
		poaColHeader.attr({ "id": poaId, "class": "POAHeaderCell edit-table-header", "title": POA_EDIT_LABELS['emxCPD.Common.Title']+":" + poaData.POA_Info.Name + ", "+ POA_EDIT_LABELS['emxFramework.Basic.Name']+":" + poaData.POA_Info.Description  
							+ ", "+ POA_EDIT_LABELS['emxFramework.Basic.State']+":" + poaData.POA_Info.current,"prod_names": productNamesList,"prod_ids": productIdsList,"prod_types": productTypesList,"poa_state":poaState});
		poaColHeader.data("kindOfHeader",poaData.POA_Info.kindOfHeader);
		var headerIconsContainer = $("<div>").addClass('poa-header-icons-container');
		if( (!isCopyListGlobal && poaState!=POA_EDIT_LABELS['emxFramework.State.Draft']) || (isCopyListGlobal && poaState!=POA_EDIT_LABELS['emxFramework.State.Preliminary'])){ 
			poaColHeader.addClass('non-editable-poa');
			var nonEditableIconHolder = $('<div>').addClass('non-Editable-Icon');
			$(poaColHeader).append(nonEditableIconHolder);
		}
		 var sortingBySequenceOrderIcon = $("<div>").attr("class","sortBySequenceOrder diamond");
		 $(headerIconsContainer).append(sortingBySequenceOrderIcon);
    /*
     * if(!isCustomizedPOA){ var poaSelectorForCopy = $("<div>").addClass('poa-for-copy-icon'); } //
     * For Harmonization a point from LVD in Road Map for AWL
     */
		 $(poaColHeader).append(headerIconsContainer);

		$(editColumnHeaderRow).append(poaColHeader);
	});
}

// R2J Filter Handler Starts
this.filterPOAEditPage = function (){
    'use strict';
    // var searhStringArray = $(this).val().split(/[^a-zA-Z0-9]/);
    $("table tbody tr").each(function(){
        $(this).hide();
    });
    var searchString = $(this).val();
    
    // TODO --> To implement Special Characters Validation.
    // validateForSpecialChars(searchString);

    // var selectedOption = $('#filterSelection option:selected').html();
    var selectedOption = $('#filterSelection option:selected').attr('id');

    $("tbody tr").filter(function(){
    	
    	var tableRowType = $(this).children('td.elementtype').attr("mctype");
    	var dispalyNameCellInfo =  $(this).children('td.displayNameCell');
    	var displayName = $(this).children('td.elementtype').attr('dispNameAtt');
    	var copyText = $(this).children('td.content-cell').text(); //$(dispalyNameCellInfo).attr("mcCopyText");
    	var revision = $(dispalyNameCellInfo).attr("mcRevision");
    	var elementState = $(dispalyNameCellInfo).attr("mcState");
    	var copyList = $(this).children('td.poaLanguaesCell').attr("copylistconnected")
    	var poaLanguagesForEachCell = "";
    	$(this).children('td.poaLanguaesCell').each(function(){
    		poaLanguagesForEachCell += $(this).attr('lang_names');
    	});

    	var filterText = "";
    	if(selectedOption == "filterByName")
    		filterText = displayName;
		if(selectedOption == "filterByType")
			filterText = tableRowType;
		else if(selectedOption == "filterByCopyText")
			filterText = copyText;
		else if(selectedOption == "filterByLanguage")
			filterText = poaLanguagesForEachCell;
		else if(selectedOption == "filterByCopyList" && !isCopyListGlobal) // 5 -> Copy List(s)
			filterText = copyList;
	    else if(selectedOption == "filterAll")
	    	filterText = displayName + " " + tableRowType + " "+ copyText+ " "+revision + " "+ elementState + " "+poaLanguagesForEachCell+" "+(isCopyListGlobal ? "" : copyList);

		if(filterText != undefined && filterText.trim().toUpperCase().indexOf(searchString.toUpperCase()) == -1)
			return false;
		else if(filterText == undefined && searchString.length != 0)
			return false;
		else
			return true;
    }).show();
}

// TODO --> To implement Special Characters Validation.
function validateForSpecialChars(string){
	
	var containsSpecialChars = false;
	var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
	for(i = 0; i < specialChars.length;i++){
        if(string.indexOf(specialChars[i]) > -1){
        	containsSpecialChars = true;
            return;
        }
    }
	
	if(containsSpecialChars)
		alert('Your search string contains illegal characters.')
	
}
// R2J Filter Handler Ends

// To Override:Function to get POAHeader Name, these will be displayed on header of dynamic columns.
this.getDisplayName = function (name) {
		return name;
};
// To Override:Function to get POAHeader data, these will be displayed on header of dynamic columns.
this.getArtworkUsageInfo = function(POA_Info){
	var artworkUsageStrings =  POA_Info.ArtworkUsage;
	var artworkUsageInfoHTML = $("<span/>").addClass("poaLabel").html(artworkUsageStrings);
	return artworkUsageInfoHTML;
}

// To Override:Function to get POAHeader data, these will be displayed on header of dynamic columns.
this.getDynamicColumnHeaderData = function(poaIds){
	return getSyncJSON("../resources/awl/view/poaservice/getpoaheaderdata", "POAIds="+poaIds);
}
// TODO May be not used.
function addToolbarButton(toolbarDiv, iconpath, tooltip, onclickfn){
	$("<div/>").addClass("toolbarbtn").append($("<img/>").attr("src", iconpath).attr("title", tooltip)).click(onclickfn).appendTo(toolbarDiv);
}
this.IMAGE_TAG = "<img src='../common/images/iconStatusMandatory.gif' style='width:16px; height:16px;padding-right:2px;' /></img>";
// #fill the row cell
// To Override:Create Cell of Local copy details for give Master copy and POA
this.addMCA_POACell = function (isGraphic,copyId,poaId,localCopyInfo,eachNewCell,isInline){
		'use strict';
		var strMsgToolTipInsSeq = POA_EDIT_LABELS["emxAWL.Label.InstanceSequence"];
		var strMsgToolTipLanguage= POA_EDIT_LABELS["emxAWL.common.Languages"]; 
		var strMsgToolTipComprisedArtwork = POA_EDIT_LABELS["emxAWL.Label.ComprisedArtwork"]; 
		var strMsgToolTipCopyLists = POA_EDIT_LABELS["emxAWL.TableHeader.CopyLists"]; 
		
		/*
		 * Store sequence Info
		 *  {
		 *  	poaid1:{
		 *  		copyid1:{modifiedValue:undefined,originalValue:2},
		 *  		copyid2:{modifiedValue:undefined,originalValue:2}
		 *  	},
		 *  	poaid2:{
		 *  		copyid1:{modifiedValue:undefined,originalValue:2},
		 *  		copyid2:{modifiedValue:undefined,originalValue:2}
		 *  	}
		 */
		var seqNumb = parseInt(localCopyInfo.seqNumb);
		var currentPOASequenceInfo = sequenceData[poaId] || {};
		currentPOASequenceInfo[copyId] = {originalValue:seqNumb, modifiedValue:undefined};
		sequenceData[poaId] = currentPOASequenceInfo;		
		
		var lc_lang_Info = localCopyInfo["LocalCopiesInfo"];
		var langIds=Array();
		var langNames=Array();
		var lcIds=Array();
		var lcMandIds=Array();
		var mandatoryCopyLists=Array();
		var lc_currentstate= Array();
		var isStructuredElementArray= Array();
		var langSpan = $('<span></span>');
		var isAddedFromComprisedPOA = false;	
		var isAddedFromCopyList = false;		
		
		$(lc_lang_Info).each(function (index){
			if(!IS_POA_CUSTOMIZED && this.isAssociatedWithCopyList == "True"){
				isAddedFromCopyList = true;
			}
			if(IS_POA_CUSTOMIZED  && this.isAddedFromPOA == "True"){
				isAddedFromComprisedPOA = true;
			}
		});
		// Language details if not graphic element
		if(!isGraphic)
		{
		
		var ellipsisEnable=false;
		var languageNames="";
		var isCellToBeDisabled = false;
		var extraLangInfo = "<img id='img' src='../common/images/I_A-newer-revision-exists.png' title='"+POA_EDIT_LABELS['emxAWL.Tooltip.OneOrMoreLocalCopies']+"' class='localrevisionImg' /></img>";
		var isAnyLatestLCRevisionExist = false;
		$(lc_lang_Info).each(function (index){
		
			if(this.isAddedFromPOA == "True"){
				isCellToBeDisabled = true;
			}
			var eachLocalCopy = lc_lang_Info[index];
			lcIds.push(eachLocalCopy.id);
			
			// Added to avoid the duplicates in case of inline elements in case of Structured Elements.
			var currentIterationLanguageName = eachLocalCopy.languagename;
			if(Array.isArray(currentIterationLanguageName) && currentIterationLanguageName.length > 1) {
				$.each(currentIterationLanguageName, function(language){
					if($.inArray(currentIterationLanguageName[language], langNames) === -1) 
						langNames.push(currentIterationLanguageName[language]);
				});
			} else {
				if($.inArray(currentIterationLanguageName, langNames) === -1) 
						langNames.push(currentIterationLanguageName);
			}
			
			var currentIterationLanguageId = eachLocalCopy.languageid;
			if(Array.isArray(currentIterationLanguageId) && currentIterationLanguageId.length > 1){
				$.each(currentIterationLanguageId, function(languageid){
					if($.inArray(currentIterationLanguageId[languageid], langIds) === -1) 
						langIds.push(currentIterationLanguageId[languageid]);
				});
			} else {
				if($.inArray(eachLocalCopy.languageid, langIds) === -1) 
						langIds.push(eachLocalCopy.languageid);
			}
			
			lcMandIds.push(eachLocalCopy.languageMand);
			mandatoryCopyLists.push(eachLocalCopy.mandatoryCopyLists);
			lc_currentstate.push(eachLocalCopy.lc_currentstate);
			isStructuredElementArray.push(eachLocalCopy.StructuredElementType);
			
			
			if(index < 3)
			{
				if(eachLocalCopy.languageMand == '1'){
					// var mandLanguageName=eachLocalCopy.languagename.bold();
					languageNames = languageNames+ editInstance.IMAGE_TAG +"<b>"+eachLocalCopy.languagename+"</b>";
					var isNoTranslate = $(eachNewCell).attr("isnotranslate");
					if(isInline || IS_POA_CUSTOMIZED || (isNoTranslate == 'true')) {
						if(eachLocalCopy.isLatestLCRevisionExist) {
							isAnyLatestLCRevisionExist = true;
						}
					}
					if(IS_POA_CUSTOMIZED || isNoTranslate == 'true'){
						languageNames = isAnyLatestLCRevisionExist? extraLangInfo +" "+languageNames: languageNames;
					}
				}else{
					languageNames = languageNames+eachLocalCopy.languagename;
					if(isInline) {
						if(eachLocalCopy.isLatestLCRevisionExist) {
							isAnyLatestLCRevisionExist = true;
						}
					} else {
						if(IS_POA_CUSTOMIZED) {
							if(eachLocalCopy.isLatestLCRevisionExist) {
								isAnyLatestLCRevisionExist = true;
							}
						}
						languageNames = isAnyLatestLCRevisionExist? extraLangInfo +" "+languageNames: languageNames;
					}
				}
				if(index < (lc_lang_Info.length-1))
					languageNames = languageNames+",";
			}else if(!ellipsisEnable)
			{
				var extraLangs = lc_lang_Info.length - 3;
				languageNames = languageNames+"+"+extraLangs;
				ellipsisEnable=true;
			}
		});
		if(isCellToBeDisabled == true){
			eachNewCell.removeClass("changable_LC");
		}
		if(languageNames && languageNames.length > 0){
				
				if(isInline) {
					
					if( customEditUtil.isCustomModifyPOA(poaId)== true){
						var htmlToAdd = "";
						var languageSplitbyPipe="";
						var languageIdSplitbyPipe="";
						var langArray = [langNames];
						var langIdArray = [langIds];
						var isInlineMand = lc_lang_Info[0].languageMand === 1;
						$(langArray).each(function(index,languagesName){
							htmlToAdd = isInlineMand ? htmlToAdd + editInstance.IMAGE_TAG + "[ <b> " + languagesName + "</b>]" : htmlToAdd+"["+languagesName+"]";
							languageSplitbyPipe=languageSplitbyPipe+languagesName;
							languageIdSplitbyPipe=languageIdSplitbyPipe+langIdArray[index];
							if(index < langArray.length-1){
								htmlToAdd=htmlToAdd+"</br>";
								languageSplitbyPipe=languageSplitbyPipe+"|";
								languageIdSplitbyPipe=languageIdSplitbyPipe+"|";
								
							}
						});
						htmlToAdd = isAnyLatestLCRevisionExist? extraLangInfo+" "+htmlToAdd : htmlToAdd;
						langSpan.html(htmlToAdd);
						langNames = languageSplitbyPipe;
						langIds=languageIdSplitbyPipe;
					}else{
						var langContent = isAnyLatestLCRevisionExist? extraLangInfo +" ["+languageNames+"]" : "["+languageNames+"]";
						langSpan.html(langContent);
					}
					
					langSpan.addClass("langSpan ellipsis_LC").attr("lang_names", langNames).attr("lc_ids", lcIds).attr("lc_currentstate",lc_currentstate).attr("lc_mandIds", lcMandIds);
				}
				else{
					langSpan.addClass("langSpan ellipsis_LC").html(languageNames)
									.attr("lang_names", langNames)
									.attr("lc_ids", lcIds)
									.attr("lc_currentstate",lc_currentstate)
									.attr("lc_mandIds", lcMandIds);
				}
				langSpan.attr("isStructuredElementArray", isStructuredElementArray);
			}
		}
		if((isGraphic || $(lc_lang_Info).length > 0) && localCopyInfo["InstSeq"]){
			// Adding the Seq number text box
			if(!customEditUtil.isEmpty(localCopyInfo["InstSeq"])){			
				var firstLineDiv = $('<div>');
				var seqNumberSpan = $('<div/>').addClass('seqNumberContainer');
				var inputTextbox = $('<input/>').attr({class:'seqNumberInputBox', type:'text'})
								  .prop('readonly','true').val(localCopyInfo["seqNumb"]);
				
				if(isMobileOrTabletDevice()){
					$(inputTextbox).attr({style :"width:40px"});
				}
				inputTextbox.on('change', editCopyElementSequenceNumber.validateForDuplicateSequenceNumbers);			
				seqNumberSpan.append(inputTextbox);

				// Adding Instance Seq Info
				var instanceAndLangContainer = $('<span>').addClass('instance-lang-container');
				var insSeqSpan = $('<span/>').addClass("instSeqData").attr("title", strMsgToolTipInsSeq);
				$(insSeqSpan).html(localCopyInfo["InstSeq"]);
				firstLineDiv.append(seqNumberSpan);
				firstLineDiv.append(insSeqSpan);
			}

			if(localCopyInfo["hasNotesOnAnyElement"] == true){
				var notesSpan = $("<span/>").attr("class","notes-icon");
				notesSpan.attr("title",POA_EDIT_LABELS['emxAWL.Label.Notes']);
				notesSpan.attr("id","editNotesSpan");
				notesSpan.data("localLanguageNotesMap", localCopyInfo["localLanguageNotesMap"]);
				$(firstLineDiv).append(notesSpan);
			}
			langSpan.attr("isAddedFromComprisedPOA", isAddedFromComprisedPOA);
			$(eachNewCell).append("<br />");
			$(eachNewCell).append(langSpan);
			$(eachNewCell).append(firstLineDiv);

			

			if(isGraphic){
				lcMandIds.push(lc_lang_Info[0].languageMand);
				lc_currentstate.push(lc_lang_Info[0].lc_currentstate);
				lcIds.push(lc_lang_Info[0].id);
				
				if(lc_lang_Info[0].languageMand == 1){
					$(eachNewCell).append(editInstance.IMAGE_TAG);
				}
			}
		}
		
		$(eachNewCell).attr("lang_ids", langIds);
		$(eachNewCell).attr("lang_names", langNames);
		$(eachNewCell).attr("lc_ids", lcIds);
		$(eachNewCell).attr("lc_currentstate", lc_currentstate);
		$(eachNewCell).attr("lc_mandIds", lcMandIds);
		$(eachNewCell).attr("mandatoryCopyLists", mandatoryCopyLists);

		if(isAddedFromComprisedPOA){
			var comprisedArtSpan = $("<span/>").attr("class","comprisedArtworks-icon");
			comprisedArtSpan.attr("title",strMsgToolTipComprisedArtwork);
			$(eachNewCell).append(comprisedArtSpan);
		}
		if($(lc_lang_Info).length > 0)
		{
			var copyListDiv = $("<div/>");
			var copylistImagespan = $("<span/>").attr("class","copylist-icon");
			var copyListSpan = $('<span></span>');

			var copyListArray = localCopyInfo.connectedFromCopyList;
			var copyListConnected = copyListArray.join(", ");

			if(copyListArray.join(",").length >15)
			{
					copyListSpan.html(copyListConnected.substr(0, 15)+"...");
					copylistImagespan.attr("title",copyListConnected);
					copyListSpan.attr("title",copyListConnected);
			} else {
				copyListSpan.html(copyListConnected);
			}

			if(copyListArray.length > 0){
				$(copyListDiv).append(copylistImagespan).append(copyListSpan);
				$(eachNewCell).append(copyListDiv);
			}
			$(eachNewCell).attr("copyListConnected", copyListConnected);

		}
		var poaCell = $("th[id='"+poaId+"']")[0];
		var languageSpan = $(poaCell).find(".langSpan")[0];
		
		//if(IS_POA_CUSTOMIZED == true){
			var languageNamesOnHeaderArr = $(languageSpan).attr("lang_names").split(",");
			var languageIdsOnHeaderArr = $(languageSpan).attr("lang_ids").split(",");
			editInstance.resequenceCellInformation(eachNewCell,languageNamesOnHeaderArr,languageIdsOnHeaderArr, lc_lang_Info);
		//}
			
		return eachNewCell;
	};
	
	// Create POA Edit Table body
	// #fillrow
	function createTableBody(poaIds){
		'use strict';
		var jsonCopyElementData = editInstance.getMasterCopyData(poaIds);
		var jsonMC_POA_DataMatrix = editInstance.getElementMatrixData(poaIds);
	
		var poaIdArr = poaIds.split("|");
		var $tbody = $("<tbody/>").attr("id","editTableBody");
		// null check: what if value is really null.
		$.each(jsonCopyElementData, function(copyId, copyData) {
		var allPOAsDataforEachMC = jsonMC_POA_DataMatrix[copyId];
		
		($tbody).append(createNewTableRow(copyId, copyData,poaIdArr,allPOAsDataforEachMC));
		});
		$("#editTable").append($tbody);
		editElementSequenceNumber.seqNumbHighlightingOnLoad(); // HighLighting the Seq Numb Text Box into red if values are invalid.
		customEditUtil.removeEmptyRows();

	}
	// To Override:Function to get Master Copy Data for static columns.
	this.getMasterCopyData = function(poaIds){
		return getSyncJSON("../resources/awl/view/poaservice/getmastercopydata", "POAIds="+poaIds);
	}
	// To Override:Function to get Element Matrix Data
	this.getElementMatrixData = function(poaIds){
		return getSyncJSON("../resources/awl/view/poaservice/getpoaeditdata", "POAIds="+poaIds);
	}
	
	// Create New Table Row TODO Need to add remove icon on each Master Copy Type
	createNewTableRow = function (copyId,copyData,poaIdArr,allPOAsDataforEachMC){
		'use strict';
		var decodedCopyText = decodeURIComponent(copyData.copyText);
		var eachNewRow = $("<tr id="+copyId+"></tr>").css('height','90px');
		$.each(copyData,function(key,value){
			if(value == null)
				copyData[key] = "";
		});
        
		var isGraphic = copyData.flag.indexOf("GraphicType") > -1;
		var isInline = copyData.flag.indexOf("InlineType") > -1;
		var isStructuredElement = copyData.StructuredElementType == "true";    
			
		eachNewRow.data('mcid', copyId);
		eachNewRow.data('copytype', copyData.type);
		eachNewRow.data('copyname', copyData.displayName);
		eachNewRow.data('isGraphic', isGraphic);
		eachNewRow.data('isInline', isInline);
		eachNewRow.data('isStructuredElement', isStructuredElement);
		eachNewRow.data('isLatestMCRevisionExist', copyData.isLatestMCRevisionExist);
		eachNewRow.data('last', copyData.last);
		
		var typeCell = $('<td/>').attr("mcid",copyId).attr("mctype",copyData.type).attr("revision", copyData.Revision).attr("dispName",copyData.displayName).attr("dispNameAtt",copyData.displayNameAtt).addClass("elementtype element-type-cell");
		var selectable = $('<div>').attr('id','selectElement').addClass('selectable artworkElementCell');
		typeCell.append(selectable);
		// typeCell.append(editInstance.getCtxMenu()); // RRR1 - Removing Menu

		var dispName = $('<div>').append(copyData.displayName);
		var typeCellText = $("<p/>").html(copyData.type);
		typeCell.append(typeCellText).append(dispName);
		
		//var displayNameCell = $('<td></td>').attr("mcid",copyId).text(copyData.displayName);
		var displayNameCell = $('<td></td>').attr("mcid",copyId) // RRR1 .text(copyData.displayName)
		.attr("mcCopyText",copyData.copyText)
		.attr("mcRevision",copyData.Revision)
		.attr("isLatestMCRevisionExist", copyData.isLatestMCRevisionExist)
		.attr('last', copyData.last)
		.attr("mcState",copyData.State).addClass("displayNameCell");
		
		$(displayNameCell).append("<BR/>").addClass("display-name-cell");
		var stateSpan = $('<span/>');
		$(stateSpan).html("<b>"+ POA_EDIT_LABELS['emxFramework.Basic.State']+ ":</b> &nbsp;" + copyData.State);
		var revisionSpan = $('<span/>');
		$(revisionSpan).html("<b>"+ POA_EDIT_LABELS['AWL.Common.Revision'] + ":</b> &nbsp;" +copyData.Revision);
		
		var latestRevisionImg = $("<img></img>")
		.attr("class", "revisionconflict")
		.attr("title", POA_EDIT_LABELS['emxAWL.Alert.NewMC']+" "+copyData.last)
		.attr('src','../common/images/I_A-newer-revision-exists.png');
		
		$(displayNameCell).append(stateSpan);
		$(displayNameCell).append("<BR/>");
		$(displayNameCell).append(revisionSpan);
		if(copyData.isLatestMCRevisionExist)
			$(displayNameCell).append(latestRevisionImg);
		$(displayNameCell).append("<BR/>");
		$(displayNameCell).append(getImageURL(copyData.flag,copyData.GeoInclusion));
		// var flagCell = $('<td></td>').attr("mcid",copyId).append(getImageURL(copyData.flag,copyData.GeoInclusion)).addClass("flag-cell");
		
		var strMsgEditStructuredElement = POA_EDIT_LABELS["emxAWL.View.StructuredElement"]; 		
		if(isStructuredElement){
			
		var structuredElementImg = $("<img></img>").attr("masterCopyId",copyId)
			.attr("class", "editStructuredElement")
			.attr("title", strMsgEditStructuredElement)
			.attr('src','../common/images/AWLStructureCopy.png')
			.attr("onClick","editStructuredElementInstance.showNutritionFactsDetails(event)");
			
			$(displayNameCell).append(structuredElementImg);							
		}
		
		if(isGraphic)
		{
		var mcContentCell = $('<td></td>').attr("mcid",copyId).attr("class","verbatim").append(copyData.copyText).addClass("content-cell");
		}
		else
		{
		var mcContentCell = $('<td></td>').attr("mcid",copyId).attr("class","verbatim").append(decodedCopyText).addClass("content-cell");
		}
		
		$(eachNewRow)
		// .append(removeIconTag)
		.append(typeCell).append(displayNameCell).append(mcContentCell);
			
		// For each Master copy create cell data. Fetch all POAs information.
		
		var isGraphicOrNoTranslate = isGraphic || (copyData.flag.indexOf("NoTranslate") > -1);
		// For each POA create local copies cell data
		$.each(poaIdArr , function (index){
			var poaId = poaIdArr[index];
			
			// var eachNewCell= $('<td id="mc_poa'+copyId+'_'+poaId+'"></td>');
			var eachNewCell= $('<td id="mc_poa'+copyId+'_'+poaId+'"></td>').addClass("poaLanguaesCell");
			// Dont allow click for Graphic element and No translation elements.
			$(eachNewCell).addClass("cell-selectable");
			if(!isGraphicOrNoTranslate){
				$(eachNewCell).addClass("changable_LC");
				$(eachNewCell).attr("selectable","true");
			}
			else{
				$(eachNewCell).attr("selectable","false");
			}
			$(eachNewCell).attr("mc_id", copyId);
			$(eachNewCell).attr("poa_id", poaId);
			$(eachNewCell).attr("isinline", isInline);
			$(eachNewCell).attr("isGraphic", isGraphic);
			$(eachNewCell).attr("isStructuredElement", isStructuredElement);            
			var isNoTranslate = copyData.flag.indexOf("NoTranslate") > -1;
			$(eachNewCell).attr("isNoTranslate", isNoTranslate);
			// if Master Copy Part of POA then add local copies information.
			if(allPOAsDataforEachMC && allPOAsDataforEachMC.hasOwnProperty(poaId)){
				var localCopyInfo =  allPOAsDataforEachMC[poaId];
				eachNewCell = editInstance.addMCA_POACell(isGraphic,copyId,poaId,localCopyInfo,eachNewCell,isInline);
			}else{
				$(eachNewCell).addClass("empty-artworkelement-cell");
			}
			
			$(eachNewRow).append(eachNewCell);
		});
			
		return eachNewRow;
	};
	
	
	// Get image based on flag condition
	getImageURL = function (key,geoInclusion)
	{
		'use strict';
		var returnImages = $("<span></span>");
		if(key == "NoTranslate" || key == "InlineType")
		{
			var imageTag = $("<img></img>");
			if(key == "InlineType")
			{
				$(imageTag).attr('src','../awl/images/AWLiconStatusInlineTranslation.gif');
				$(imageTag).attr("title", POA_EDIT_LABELS['emxAWL.Attribute.InlineTranslation']);
			}else if(key == "NoTranslate")
			{
				$(imageTag).attr('src','../awl/images/AWLiconStatusNoTranslation.gif');
				$(imageTag).attr("title", POA_EDIT_LABELS['emxAWL.Tooltip.NoTranslation']);
			}
			/*else if(key == "BuildFromList")
			{
				$(imageTag).attr('src','../awl/images/AWLListIcon.gif');
				$(imageTag).attr("title", POA_EDIT_LABELS['emxAWL.Label.BuildFromList']);
			}*/
			returnImages.append(imageTag);
		}
	
		if(geoInclusion != "")
		{
			var geoString = "";
			$.each(geoInclusion, function(key,value){
				geoString =  geoString +value+",";
				
			});
			geoString = geoString.substring(0,geoString.length - 1);
			
			var geoImage = $("<img src='../awl/images/AWLStatusLocationAssigned.gif' />");
			returnImages.append(geoImage);
			$(geoImage).attr("title", geoString);
		}
		return returnImages;
	};
	// Exposed API
	this.populateTable = function (poaIds){
		'use strict';
		this.createTableWithHeader(poaIds);
		createTableBody(poaIds);
		this.alignFirstColumn();

	};

this.alignFirstColumn=	function(){ // Sets the First Columns Height Dynamically
		$("#editTable>tbody>tr").each(function(i) {
		
			var currentRowHeight = $(this).height()-12;
			
			// IR-661157-3DEXPERIENCER2018x
			var mcTypeEleHeight = $(this.children[0].children[1]).height();
			var mcNameEleHeight = $(this.children[0].children[2]).height();
			var totHeight = mcTypeEleHeight + mcNameEleHeight;			
			if(totHeight > currentRowHeight){
				currentRowHeight = totHeight + 1 ;
			}
			
			var firstColumnCell = $(this).find("td.elementtype").height(currentRowHeight);
		});
		var numberOfPOAs = $('.POAHeaderCell'); // To Set the POA Elements Width to fit the screen.
			if(numberOfPOAs.length===1){
				$('.POAHeaderCell').css("width","100%");
				$('.cell-selectable').css("width","100%");
			}
			else if(numberOfPOAs.length===2){
				$('.POAHeaderCell').css("width","50%");
				/* $('.POAHeaderCell')[1].css("padding-right","50%"); */
				$('.cell-selectable').css("width","50%");
			}
			if(IS_POA_CUSTOMIZED){
				$('#pageContent').css({'min-width':'1092px'});
			}
			editInstance.handleHeaderScrollBar();
			/* sorting should be disabled during new copy element addition
         eventFire(document.getElementById('elementTypeCell'),'click'); */  // To Sort the First Column based on Display name when the page renders.
	}

this.handleHeaderScrollBar = function(){
	// No Row Fix Start
    var numberOfArtworkElements = $('#editTable>tbody>tr').length;
    if(numberOfArtworkElements>0){
    	$('#editTable>thead').css('overflow','visible');
    }else{
    	$('#editTable>thead').css('overflow','auto');
    }
    var windowWidth = $(window).width();
    var headerWidth = $("#editTable>thead").width();
    
    $("#editTable>thead").width(windowWidth-15);
    
	// No Row Fix End
}
	
	/*
	 * Author : wx7 This function will resequence the languages in the cell
	 * according to languages on poa header cell
	 */
	this.resequenceCellInformation = function(cell,languageNamesOnHeaderArr,languageIdsOnHeaderArr, localCopyInfo){
		var cellId = $(cell).attr("id");
		var isInline = $(cell).attr("isinline");
		var isGraphic = $(cell).attr("isgraphic");
		var isNoTranslate = $(cell).attr("isnotranslate");
		var cellLanguageSpan = $(cell).find(".langSpan")[0];
		var isAnyLatestLCRevisionExist = false;
		var extraLangInfo = "<img id='img' src='../common/images/I_A-newer-revision-exists.png' title='"+POA_EDIT_LABELS['emxAWL.Tooltip.OneOrMoreLocalCopies']+"' class='localrevisionImg'' /></img>";
		if(cellLanguageSpan != undefined && isGraphic == "false" && isInline == "false" && isNoTranslate == "false"){
			var cellLanguageNamesArr = $(cellLanguageSpan).attr("lang_names").split(",");
			var cellLocalCopyIds = $(cellLanguageSpan).attr("lc_ids").split(",");
			var cellMandatoryInfoArr = $(cellLanguageSpan).attr("lc_mandids").split(",");
			var cellLCStateArr = $(cellLanguageSpan).attr("lc_currentstate").split(",");
			
			var updatedLanguageNamesArr = new Array();
			var displayLanguageNamesArr = new Array();
			var updatedLocalCopyIds = new Array();
			var updatedMandInfoArr = new Array();
			var updatedLCStateArr = new Array();
			$.each(languageNamesOnHeaderArr,function(index,value){
				var fixIndex = cellLanguageNamesArr.indexOf(value);
				
				if(fixIndex != -1){
					var langName = value ;
					$.each(localCopyInfo, function(copyindex, eachLocalCopy){
						if(eachLocalCopy.id == cellLocalCopyIds[fixIndex]) {
							if(eachLocalCopy.isLatestLCRevisionExist) {
								isAnyLatestLCRevisionExist = true;
							}
						}
					});
					
					updatedLanguageNamesArr.push(langName);
					displayLanguageNamesArr.push(value);
					updatedLocalCopyIds.push(cellLocalCopyIds[fixIndex]);
					updatedMandInfoArr.push(cellMandatoryInfoArr[fixIndex]);
					updatedLCStateArr.push(cellLCStateArr[fixIndex]);
				}
			});
			$(cellLanguageSpan).attr("lang_names",displayLanguageNamesArr);
			$(cellLanguageSpan).attr("lc_ids",updatedLocalCopyIds);
			$(cellLanguageSpan).attr("lc_mandids",updatedMandInfoArr);
			$(cellLanguageSpan).attr("lc_currentstate",updatedLCStateArr);
			var displayValue = "";
			for(i = 0 ; i < updatedLanguageNamesArr.length && i < 3; i++){
				if(updatedMandInfoArr[i] == "1")
					displayValue = displayValue + editInstance.IMAGE_TAG +"<b>"+updatedLanguageNamesArr[i]+"</b>" + ",";
				else
					displayValue = displayValue + updatedLanguageNamesArr[i] + ",";
			}
			if(updatedLanguageNamesArr.length > 3){
				var extraLangs = updatedLanguageNamesArr.length - 3;
				displayValue += "+"+extraLangs;
			}else{
				displayValue = displayValue.slice(0,-1);
			}
			if(isAnyLatestLCRevisionExist) {
				displayValue = extraLangInfo + " "+displayValue;
			}
			$(cellLanguageSpan).html(displayValue);
		}
	};
	
	
	// To create common Toolbar for POA and Copy
	this.createCommonToolbar = function (element) {
		'use strict';
		var commonMenus = [ {id:"clear", label:POA_EDIT_LABELS["emxCommonButton.ClearSelection"]}
			  ];

		$(commonMenus).each(function(){
				$(element).append(editInstance.getToolbarCommand(this.id,this.label)).append("&nbsp;");
		});
		
	};
	
	// To Override: To Create POA Specific Toolbar
	this.createContextToolbar = function(element) {
		'use strict';
		var menus = new Array();
		var customPOASelBasedMenu = new Array();
		customPOASelBasedMenu.push({id:"connectComprisedPOA", label:POA_EDIT_LABELS["emxAWL.Label.ConnectComprisedPOA"]});
		customPOASelBasedMenu.push({id:"disconnectComprisedPOA", label:POA_EDIT_LABELS["emxAWL.Action.DisconnectComprisedPOA"]});
		customPOASelBasedMenu.push({id:"addElementFromComprisedPOA", label:POA_EDIT_LABELS["emxAWL.Action.AddElementFromComprisedPOA"]});
		var poaSelBasedMenu = new Array();
		// Create command should be added only for PM user not for APM.
		var jsonHasPMRole = getSyncJSON("../resources/awl/db/poaservice/checkproductmanagerrole", "");
		if(	jsonHasPMRole && jsonHasPMRole['hasProductManager'] == true){
			poaSelBasedMenu.push({id:"createGraphicElement", label:POA_EDIT_LABELS["emxAWL.Label.AddNewGraphicElement"]});
			poaSelBasedMenu.push({id:"createMasterCopyElement", label:POA_EDIT_LABELS["emxAWL.Action.AddNewMasterCopyElement"]});
		
		}
		poaSelBasedMenu.push({id:"addArtworkMaster", label:POA_EDIT_LABELS["emxAWL.Label.ModifyAssemblyMasters"]},
		                     {id:"removeArtworkMaster",label:POA_EDIT_LABELS["emxAWL.Label.AWLArtworkElementRemove"]},
		                     {id:"modifyAssemlyElement", label:POA_EDIT_LABELS["emxAWL.Label.ModifyAssemblyElement"]},
		                     {id:"addExistingElem", label: POA_EDIT_LABELS["emxAWL.ActionLink.AddExistingElements"]},
							 {id:"addExistingCL", label: POA_EDIT_LABELS["emxAWL.Label.AWLCopyListAddExisting"]}
							 );
		var defaultEnabledMenus = [{id:"addPOA", label:POA_EDIT_LABELS["emxAWL.Label.AddPOA"]},
 		                           {id:"removePOA", label:POA_EDIT_LABELS["emxAWL.Label.RemovePOA"]}
		                          ];
		var artworkSelBasedMenu = [{id:"editNote",label:POA_EDIT_LABELS["emxAWL.Label.EditNote"]},
		                           {id:"editInstanceSequence",label:POA_EDIT_LABELS["emxAWL.Label.EditInstanceSequence"]},
		                           {id:"resequenceElements", label:POA_EDIT_LABELS["emxAWL.Label.ReSequenceCopyElements"]},
		                           {id:"saveSequenceNumber", label:POA_EDIT_LABELS["emxAWL.Tooltip.SaveSequence"]}
		                           ];
		var poaOperationsMenu = new Array();
		poaOperationsMenu.push({id:"manageCountryLanguages", label:POA_EDIT_LABELS["emxAWL.Label.ManageCountryLanguage"]});
						
		if(IS_POA_CUSTOMIZED == true){
			menus.push(customPOASelBasedMenu);
		}
		menus.push(poaSelBasedMenu);
		menus.push(artworkSelBasedMenu);				
		menus.push(poaOperationsMenu);				
		menus.push(defaultEnabledMenus);		
		$(menus).each(function(){
			$(this).each(function(){
				$(element).append(editInstance.getToolbarCommand(this.id,this.label)).append("&nbsp;");
			});
			var separator = $("<span>").addClass("separator");
			$(element).append(separator).append("&nbsp;");
		});
	};
	// Common API to generate HTML code for command.
	this.getToolbarCommand = function(id,title){
		'use strict';
		var span = $("<span>").addClass("btn btn-default poa-edit-toolbar").attr("style","background-color:white !important;");
		// var asModButton= $('<image/>');
		span.attr("id",id);
		span.attr("title", title);
		span.attr("disabled","disabled");
		span.attr("class","btn btn-default disabled awl-custom-disabled poa-edit-toolbar "+ id);
		// span.append(asModButton);
		return span;
	};
	// Main API To create Toolbar
	this.createActionToolbar = function (commandsCell)
	{
		'use strict';
		var container = $("<div>");
		var menuDiv= $('<div>');
		menuDiv.attr("id","menudiv");
		menuDiv.attr("style","text-align: left;");
		
		this.createContextToolbar(menuDiv);
		this.createCommonToolbar(menuDiv);
		// R2J Filter Logic Starts
		var filterContainer = $("<div>").attr("id","filterContainer").attr("class","filter");
		var dropDown = $("<select>").attr("id", "filterSelection").attr("class", "filterBox");
		var filterByName = $("<option>").attr("id","filterByName").html(POA_EDIT_LABELS['emxAWL.Label.DisplayName']);
		var filterByType = $("<option>").attr("id", "filterByType").html(POA_EDIT_LABELS['emxAWL.Label.CopyElementType']);
		var filterByCopyText = $("<option>").attr("id", "filterByCopyText").html(POA_EDIT_LABELS['emxLabel.Label.BaseContent']);
		var filterByLanguage = $("<option>").attr("id", "filterByLanguage").html(POA_EDIT_LABELS['emxAWL.Table.Language']);
		var filterAll = $("<option>").attr("id", "filterAll").html(POA_EDIT_LABELS['emxAWL.Filter.All']);
		dropDown.append(filterAll)
				.append(filterByName)
				.append(filterByType)
				.append(filterByCopyText)
				.append(filterByLanguage);

		if(!isCopyListGlobal){
			var filterByCopyList = $("<option>").attr("id", "filterByCopyList").html(POA_EDIT_LABELS['emxAWL.Header.CopyLists']);
			dropDown.append(filterByCopyList);
		}
		// commandsCell.append(dropDown);
		var filter = $("<input type=text />").attr("class", "filterBox").attr("id", "poaEditPageFilter").attr("placeholder",POA_EDIT_LABELS['emxCommonButton.Filter']);
		filterContainer.append(filter).append(dropDown); // .append(filterLabel)
		$(container).append(menuDiv).append(filterContainer);
		$(commandsCell).append(container);
	};
	// Handler: Select All command handler
	this.selectAllHeaderHandler = function(){
		'use strict';
		// TODO Need to verify this here
		$(this).toggleClass("selected");

		var commandsArray = ['addArtworkMaster','createMasterCopyElement','createGraphicElement','manageCountryLanguages','removePOA','removeCopyList','connectComprisedPOA', 'disconnectComprisedPOA','addElementFromComprisedPOA','resequenceElements','saveSequenceNumber','addExistingElem', 'addExistingCL'];

		if($(this).hasClass("selected"))
		{
			$(".POAHeaderCell").addClass("POASelected");
			customEditUtil.enableCommands(commandsArray);
			editInstance.enableClearButton();
			poaAddRemoveMaster.selectAllPOAMasterCopy();
		}
		else
		{
			$(".POAHeaderCell").removeClass("POASelected");
			customEditUtil.disableCommands(commandsArray);
			editInstance.disableClearButton();
			poaAddRemoveMaster.selectAllPOAMasterCopy();
		}
		addRemoveMaster.nonEditablePOAHandler(); // To Disable Commands if Non editable POAs are selected
	};
    
     this.selectAllElementsHandler = function() {
         'use strict';
         $(this).toggleClass("selected");
		 var editCommandArrays = ['editNote','editInstanceSequence','removeArtworkMaster'];
		 var selectedNonEditablePOA = $('.non-editable-poa.POASelected').length;
            if($(this).hasClass("selected")){
              $(".artworkElementCell:visible").addClass("selected");
              if(selectedNonEditablePOA==0){
            	  customEditUtil.enableCommands(editCommandArrays);
              	  editInstance.enableClearButton();
              }
            } else {
              $(".artworkElementCell").removeClass("selected");
            customEditUtil.disableCommands(editCommandArrays);
            editInstance.disableClearButton();
            }
     }
	// API to call asynchronous ajax call pass callback function as string
	// If callbackFunction passed as string then declaration should be global
	// and without namespaces.
	getAsyncJSON = function (arg_url, arg_data,callbackFunction){
		$.ajax({
			async: true,
			dataType: "json",
			url: arg_url,
			data: arg_data,
			type: "POST",
			cache: false,
			success: function(data) {
				if(typeof callbackFunction === 'function') {
					callbackFunction(data);
				}else{
					var fn = window[callbackFunction];
					if(typeof fn === 'function') {
					    fn(data);
					}
				}
			} 
		});
	};
	// To Override: to get row specific context menu
	this.getCtxMenu = function()
	{
		var ctxmenu=$("<nav />");
		ctxmenu.addClass("ctxmenu");
		var ulelem=$("<ul/>").addClass("menu");
		ctxmenu.append(ulelem);
		ulelem.append($("<li>/>").addClass("menuitem edit-note-command").html(POA_EDIT_LABELS["emxAWL.Label.EditNote"]).click(function(){ editNoteInstance.editNote(this); }));
		ulelem.append($("<li>/>").addClass("menuitem edit-instace-sequence").html(POA_EDIT_LABELS["emxAWL.Label.EditInstanceSequence"]).click(function(){ editSequenceInstance.editInstanceSeq(this); }));
		ulelem.append($("<li/>").addClass("menuitem remove-artwork-master").html(POA_EDIT_LABELS["emxAWL.Command.Remove"]).click(function(){ addRemoveMaster.removeArtworkMaster(this); }));
		
		return ctxmenu;
	}

	// Overriden to show Local Copy cell values after adding artwork Master in
	// POA Edit page
	 this.getLocalCopyInfo=function(poaIdArr,copyId){
		 return getSyncJSON("../resources/awl/view/artworkmaster/getlocalcopiesforpoas", "POAIds="+poaIdArr+"&mca_id="+copyId);
	 };
	
	//Overridden to check whether selected CopyList has Artwork Master connected or not before modification
	this.isArtworkMasterConnectedtoPOA = function (selectedPOAIDsArray, mcid)
	{
		if( selectedPOAIDsArray.length <=0 )
		{			
			return;
		}		
		var poaNames = new Array();
		$.each(selectedPOAIDsArray,function(index,value){
			var cellId = customEditUtil.getCellId(mcid,value);
			var instSeqData = $("td[id='" + cellId + "']").find(".instSeqData")
			if(instSeqData.length <= 0) 
			{
				var poaName = $("th[id='" + value + "']").find('p.poaName').html()
				poaNames.push(poaName);	
			}				
		});
		return poaNames;
	};
	
	this.ajaxExec = function (arg_url, arg_data, successfn, errorfn)
	{
		$.ajax({
			async: true,
			dataType: "json",
			url: arg_url,
			data: arg_data,
			type: "POST",
			cache: false,
			beforeSend: function (request)
                       {
			 addSecureTokenHeader(request);
                       },
			success: function(data) {
				if(typeof successfn === 'function') {
					successfn(data, arg_data);
				}else{
					var fn = window[successfn];
					if(typeof fn === 'function') {
					    fn(data, arg_data);
					}
				}
			},
			error: function(data) {
				if(typeof errorfn === 'function') {
					errorfn(data, arg_data);
				}else{
					var fn = window[errorfn];
					if(typeof fn === 'function') {
					    fn(data, arg_data);
					}
				}
			} 
		});		
	};
	
	this.getUpdatedUIInfo = function(selectedCells){
		return getSyncJSON("../resources/awl/view/poaservice/getlocalcopiesinfo", "mca_POAInfo="	+ selectedCells);
	};

	this.addOrRemoveEmptyCellColor = function(){ // This API is to Add or Remove the background-color for empty cells called from modAssemblyElement
		$("td.poaLanguaesCell").each(function() {
			if($(this).text()!=="" && $(this).hasClass('empty-artworkelement-cell')){
				$(this).removeClass('empty-artworkelement-cell');
			}else if($(this).text()=="" && !$(this).hasClass('empty-artworkelement-cell')){
				$(this).addClass('empty-artworkelement-cell');
				if($(this).attr("selectable") === "true") {
					$(this).trigger("click");
				}
			}
		});
	}
	
	this.getRevisionUpdateURL = function(){
		return "../resources/awl/db/poaservice/updateLocalCopies";
	};

};
})(jQuery);
