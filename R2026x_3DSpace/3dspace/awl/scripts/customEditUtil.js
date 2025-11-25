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
    customEditUtil = new function () {

        //API To enable command on tool-bar
        this.enableCommand = function(commandId){
            if($(commandId).length > 0){
                $(commandId).removeClass('disabled awl-custom-disabled');
                //For IE need to add attribute
                $(commandId).removeAttr('disabled','disabled');
            }
        };

		/*
			Private function to toggle Commands
		*/
		function toggleCommands (commandsArray, toEnable)
		{
			$(commandsArray).each(function(index){
        		var commandId = "#"+this;
        	    if($(commandId).length > 0)
				{
					if(toEnable) {
						$(commandId).removeClass('disabled awl-custom-disabled');
						//For IE need to add attribute
						$(commandId).removeAttr('disabled','disabled');
					} else {
						$(commandId).addClass('disabled awl-custom-disabled');
						//For IE need to add attribute
						$(commandId).attr('disabled','disabled');
					}
                }
        	});
		}

        //API To disable array of commands on tool-bar
        this.disableCommands = function(commandsArray){
				toggleCommands(commandsArray, false);
        };

        //API To enable array of commands on tool-bar
        this.enableCommands = function(commandsArray){
				toggleCommands(commandsArray, true);
        };

        //API To disable command on tool-bar
        this.disableCommand = function(commandId){
            if($(commandId).length > 0){
                $(commandId).addClass('disabled awl-custom-disabled');
                //For IE need to add attribute
                $(commandId).attr('disabled','disabled');
            }
        };

        //API to add refresh icon on command
        this.addProcessingIconOnCommand = function(commandId) {
            if($(commandId).length > 0){
                $(commandId).toggleClass('progress');
                $(commandId).toggleClass(commandId.substring(1));
            }
        };

        //API to remove refresh icon on command
        this.removeProcessingIconOnCommand = function(commandId) {
            if($(commandId).length > 0){
                $(commandId).toggleClass('progress');
                $(commandId).toggleClass(commandId.substring(1));
            }
        };

        /*
            wx7 - This method returns id of cell by taking mcid  and  poaid as input
            mc_poa1448.43406.60288.25863_1448.43406.42176.63339 -> This is the example format
        */
        this.getCellId = function (artworkMasterId,poaId) {
            'use strict';
            var id = "mc_poa"+artworkMasterId+"_"+poaId;
            return id;
        };

		this.isCustomModifyPOA = function (poaId) {
            'use strict';
			var tableHeaderCell =$('th[id="'+poaId+'"]');
            var kindOfHeaderInfo = tableHeaderCell.data('kindOfHeader');
			if(kindOfHeaderInfo == 'CustomModifyPOA'){
				return true;
			}
			return false;
			
		};
		
        /*
            wx7 - This method will return | separated ids of POAs
        */
        this.getSelectedPOAs = function () {
            'use strict';
            //get poaIds selected
            var poaIds = "";
            $("th.POASelected").each(function(){
                poaIds += $(this).attr("id") +",";
            });
            //removing last | character
            poaIds = poaIds.slice(0,-1);
            return poaIds;
        };

        /*
            This method will return array of all the POAIds in UI
            author : wx7
        */
        this.getAllPOAIdsArrayInUI = function() {
            'use strict';
            var idsInUI = new Array();
            $("th.POAHeaderCell").each(function(){
                idsInUI.push($(this).attr("id"));
            });
            return idsInUI;
        };
        //This API will return countries information for given POA/Copy List id.
        //Information will be fetched from countryInfoSpan Span
        this.getCountriesDetails =function(headerId){
            'use strict';
            var countrySpan =$('th[id="'+headerId+'"] span.countryInfoSpan');
            var poaCountry_ids = JSON.parse(countrySpan.attr('country_ids'));
            return poaCountry_ids.join("|");
            };

        //This API will return languages in instance sequence order for given POA/Copy List id.
        //Information will be fetched from langSpan Span under header
        this.getLanguagesInSequence =function(headerId){
            'use strict';
            var outputLanguageList = Array();
            var langSpan =$('th[id="'+headerId+'"] span.langSpan');
            var poaLanguage_ids = (langSpan.attr('lang_ids')|| '').split(",");
            var poaLanguage_names = (langSpan.attr('lang_names')|| '').split(",");
            var poaLanguage_instSeq = new Array();
            //In case of copy list lang_seq wont be present hence create array and assign Instance sequence.
            if(typeof langSpan.attr('lang_seq') === "undefined"){
                for (var indexSeq = 1; indexSeq <= poaLanguage_ids.length; indexSeq++) {
                    poaLanguage_instSeq.push(indexSeq)
                    }
            }else{
                poaLanguage_instSeq = langSpan.attr('lang_seq').split(",");
            }
            //Note Languages sequence will be based on Sequence attribute
            $.each(poaLanguage_ids, function( index,languageId) {
                var languageName = poaLanguage_names[index];
                var sequence = poaLanguage_instSeq[index];
                var languageInfoJSON = "{\"seq\":"+sequence+",\"id\":\""+languageId+"\",\"name\":\""+languageName+"\"}";
                outputLanguageList.push(languageInfoJSON);
            });
            return outputLanguageList;
        };

        //This API will return product information ie. product ids, product types if product type is CPG Product then Type will be TRUE otherwise it will be FALSE.
        //Information will be fetched from header attributes
        this.getProductDetails =function(headerId){
            'use strict';
            var outputProductList = Array();
            var tableHeaderCell =$('th[id="'+headerId+'"]');
            var product_ids = tableHeaderCell.attr('prod_ids').split(",");
            var product_types = tableHeaderCell.attr('prod_types').split(",");
            var product_names = tableHeaderCell.attr('prod_names').split(",");
            $.each(product_ids, function( index,productId) {
                var productName = product_names[index];
                var isProductline = product_types[index];
                outputProductList.push(productId+","+isProductline);
            });
            return outputProductList;
        };

        this.isTableRowExists = function (rowId) {
            var rowExists = false;
            $('#editTable tbody tr').each(function() {
                if($(this).attr("id") == rowId) {
                    rowExists = true;
                }
            });
            return rowExists;
        };


        this.addNewTableRowsilent = function(copyId, copyData, poasLocalCopyDataForEachMC, selectedTableRow) {
            'use strict'; 
            var poaIdArr = customEditUtil.getAllPOAIdsArrayInUI();
            if(!customEditUtil.isEmpty(selectedTableRow)) {
                var newRow = createNewTableRow(copyId,copyData,poaIdArr,poasLocalCopyDataForEachMC);
                $(selectedTableRow).before(newRow);
            } else {
               $("#editTable").append(createNewTableRow(copyId,copyData,poaIdArr,poasLocalCopyDataForEachMC));
            }
              editInstance.addOrRemoveEmptyCellColor();	// This will change the color of Empty Cells
              editInstance.alignFirstColumn();
        }
        
        //AA1:Create New Table Row TODO
        this.addNewTableRow = function(copyId, selectedTableRow){
            'use strict';
            //getMetaData of Copy in format for CopyData
            var copyData = getSyncJSON("../resources/awl/view/artworkmaster/getmastercopymetadata", "mca_id="+copyId);
            //get all POAs data for given Copy Id ie.poaIds
            var poaIdArr = customEditUtil.getAllPOAIdsArrayInUI();
            var allPOAsDataforEachMC = editInstance.getLocalCopyInfo(poaIdArr,copyId);
            var poasLocalCopyDataForEachMC = allPOAsDataforEachMC[copyId];
            if(!customEditUtil.isEmpty(selectedTableRow)){
              var newRow = createNewTableRow(copyId,copyData,poaIdArr,poasLocalCopyDataForEachMC);
              $(selectedTableRow).before(newRow);
            }
            else
             $("#editTable").append(createNewTableRow(copyId,copyData,poaIdArr,poasLocalCopyDataForEachMC));
            //IR-653263-3DEXPERIENCER2019x
            var childEles = null;
            if($("#modifyAssemlyElement").attr("disabled")==="disabled" && (childEles = $("#editTableBody").children()).length > 0){
            	
            	childEles.each(function(i,ele){
            		if(!(ele.children[3].getAttribute("isGraphic")==="true")){
            			customEditUtil.enableCommand('#modifyAssemlyElement');
            			return false;
            		}	
            	});
            	
            }	
            editInstance.addOrRemoveEmptyCellColor();	// This will change the color of Empty Cells
            editInstance.alignFirstColumn();
        };

        this.addNewTableRowAboveSelectedIndex = function(copyId){
        	'use strict';
        	var selectedRow = this.validateAndGetSelectedRow();
        	//getMetaData of Copy in format for CopyData
            var copyData = getSyncJSON("../resources/awl/view/artworkmaster/getmastercopymetadata", "mca_id="+copyId);
            //get all POAs data for given Copy Id ie.poaIds
            var poaIdArr = customEditUtil.getAllPOAIdsArrayInUI();
            var allPOAsDataforEachMC = editInstance.getLocalCopyInfo(poaIdArr,copyId);
            var poasLocalCopyDataForEachMC = allPOAsDataforEachMC[copyId];
            var newArtworkElementRow = createNewTableRow(copyId,copyData,poaIdArr,poasLocalCopyDataForEachMC);
          if(selectedRow==undefined){
        	  $("#editTable").append(newArtworkElementRow);
          }else{
        	  $(selectedRow).before(newArtworkElementRow);
          }
        }

        this.validateAndGetSelectedRow = function(){
        	var selectedRow = $('#editTable>tbody>tr>td.elementtype>div.selectable.selected').closest('tr');
        	if(selectedRow.length>1){
        		alert("Please select a single Row"); //todo update property values.
        		return;
        	}
        	return selectedRow[0];
        }

        //AA1 Compare Language Data considering instance sequence. Return true if everything is same
        this.compareLanguageWithSequence = function(existingDataArray,newDataArray){
            'use strict';
            //getMetaData of Copy in format for CopyData
            if(existingDataArray.length != newDataArray.length)
                return false;
            var newDataIDs = new Array();
            var newDataTempForSequenceIDs = new Array(newDataArray.length);
            $.each(newDataArray, function( index,newDataJSON) {
                    var newDataObject = JSON.parse(newDataJSON);
                    newDataIDs.push(newDataObject.id);
                    newDataTempForSequenceIDs.splice(newDataObject.seq-1, 0, newDataObject.id);
                });
            $.each(existingDataArray, function( index,existingJSON) {
                    var idToRemove = JSON.parse(existingJSON).id;
                    var indexInExisting = newDataIDs.indexOf(idToRemove);
                    if(indexInExisting > -1){
                        newDataIDs.splice(indexInExisting,1);
                    }
                    //Check sequence of new and existing languages
                    var newInstSequence = newDataTempForSequenceIDs.indexOf(idToRemove);
                    if(JSON.parse(existingJSON).seq != newInstSequence+1){
                        return false;
                    }
                });
            if( newDataIDs.length == 0 )
            return true;
            else
            return false;
        };

        //AA1 Compare Country Data, return true if everything is same
        this.compareCountries = function(existingCountryArray,newCountryArray){
            'use strict';
            //getMetaData of Copy in format for CopyData
            if(existingCountryArray.length != newCountryArray.length)
                return false;
            var newDataIDs = new Array();
            $.each(newCountryArray, function( index,newDataJSON) {
                var newDataObject = JSON.parse(newDataJSON);
                    newDataIDs.push(newDataObject.id);
                });
            $.each(existingCountryArray, function( index,existingJSON) {
                    var idToRemove = JSON.parse(existingJSON).id;
                    var indexInExisting = newDataIDs.indexOf(idToRemove);
                    if(indexInExisting > -1){
                        newDataIDs.splice(indexInExisting,1);
                    }
                });
            if( newDataIDs.length == 0 )
            return true;
            else
            return false;
        };

        /*This API will return MCID of POA Column*/
        this.getAllMC_ids = function (poaId) {
            'use strict';
            var mcIds_ForGivenPOA = new Array();
            var poa_seclector = $("td[poa_id='"+poaId+"']");
                $(poa_seclector).each(function( index, eachMC_Cell) {
                mcIds_ForGivenPOA.push($(eachMC_Cell).attr("id"));
            });
            return mcIds_ForGivenPOA;
        };

        /*
            This method will replace the value of "parameterName" parameter with "parameterValue" passed and return newURL by updating "url" sent
            author : wx7
        */
        this.replaceURLParameterValue = function (url,parameterName,parameterValue) {
            var arr = url.split(parameterName +"=");
            var secondPartArr = arr[1].split("&");
            secondPartArr[0] = parameterName +"="+parameterValue;
            return arr[0] + secondPartArr.join("&");
        };

        this.showSlideInDialog = function(width) {
            'use strict';
            var width = $("#workingPane").width();
            var docWidth = $(window).width();
            var perc = (width)/docWidth;
            if(perc >0.8){
                greyOutWorkingArea("70%");
            }
            else{
                enableWorkingArea();
            }
            setSlideInWidth(width);
        };

        //wx7 - This function will return an array of unique languages among POAs, selectedCells array has to be sent as parameter
        this.getUniqueLanguageFromCells = function(selectedItemArray){
            'use strict';
            var uniqueLangaugesJSONArr = Array();
            //var uniqueMapper = Array(); // to keep track of duplicates among POAs
            var uniqueLanguages = Array();

            $.each(selectedItemArray,function(index,elem){
                    var langIds = $(elem).attr("lang_ids");
                    var langNames = $(elem).attr("lang_names");
                    if(typeof langIds !== "undefined" && langIds != ""){
                        if(langIds.indexOf('[') != -1){
                            langIds = langIds.replace("[","").replace("]","");
                            langNames = langNames.replace("[","").replace("]","");
                        }
                        var langIdsArr = langIds.split(",");
                        var langNamesArr = langNames.split(",");

                        $.each(langIdsArr,function(index,eachLangId){
                            if(uniqueLanguages.indexOf(eachLangId) < 0){
                                var langInfo= {name: $.trim(langNamesArr[index]),id: $.trim(eachLangId)};
                                uniqueLangaugesJSONArr.push(langInfo);
                                uniqueLanguages.push(eachLangId);
                            }
                        });
                    }
            });
            return uniqueLangaugesJSONArr;
        };

        this.fillElements = function (element,contentJSONArr){
            'use strict';
            var selectAllLabel = $("<label/>");
            selectAllLabel.attr("class","ToggleAllCountriesCBLabel");
            selectAllLabel.text(POA_EDIT_LABELS['emxAWL.Label.SelectOrDeselectAll']);

            var selectAllCB = $("<input/>");
            selectAllCB.attr("type","checkbox");
            selectAllCB.attr("id","toggleLanguages");
            selectAllCB.attr("name","toggleLanguages");
            selectAllCB.attr("value","select all");
            selectAllCB.attr("class","ToggleAllCountriesCB");

            selectAllLabel.prepend(selectAllCB);
            element.append(selectAllLabel);
            element.append("</br>");
            $.each(contentJSONArr,function(index,JSONObj){
                var countryLabel = $("<label/>");
                var country = $("<input/>");
                country.attr("type","checkbox");
                country.attr("class","languageCheckBox");
                country.attr("name",JSONObj.name);
                country.attr("lang_id",JSONObj.id);
                countryLabel.attr("class","languageCheckBoxLabel");
                countryLabel.html(JSONObj.name);
                country.attr("state",JSONObj.state);
                if(JSONObj.state == "checked")
                    country.prop("checked",true);
                else if(JSONObj.state == "partial")
                    country.prop("indeterminate",true);
                countryLabel.prepend(country);
                element.append(countryLabel);
            });
        };
            /*This api will refresh the column information of poa (Cells of current POA)*/
    this.renderPOAwithCoulmnCells = function(poaId) {
        'use strict';
        //get poa assembly
        var mcIds_ForGivenPOA = customEditUtil.getAllMC_ids(poaId);
        var poaAssemblyJSONData = editInstance.getMasterCopyData(poaId);
        var selectedCells = new Array();
        $.each(poaAssemblyJSONData, function(copyId, copyData) {
            if(customEditUtil.isTableRowExists(copyId)) {
                var cell_Id= customEditUtil.getCellId(copyId,poaId);
                selectedCells.push(cell_Id);
                var indexToRemove  = mcIds_ForGivenPOA.indexOf(cell_Id);
                if(indexToRemove > -1) {
                    mcIds_ForGivenPOA.splice(indexToRemove,1);
                }
            } else {
                customEditUtil.addNewTableRow(copyId);
                var cell_Id = customEditUtil.getCellId(copyId,poaId);
                selectedCells.push(cell_Id);
            }
        });
        //For each removal cell
        $(mcIds_ForGivenPOA).each(function(index, cellIdsToRemove) {
            selectedCells.push(cellIdsToRemove);
        });
        if( selectedCells.length > 0 ) {
            var selector = "td[poa_id='"+poaId+"']";
            renderUIAfterModAssemnblyElement(selectedCells,selector);
        }
        //remove any empty rows
        customEditUtil.removeEmptyRows();
        alignScrollbar();
    };

		 /*
			wx7 - This method remove empty rows
		*/
			this.removeEmptyRows = function(){
			$('#editTable tbody tr').each(function() {
				var rowEmpty = true;
				$('td', this).each(function () {
					if(($(this).attr("poa_id")) != undefined){
						if(($(this).text()) != "")
							rowEmpty = false;
					}	
				});
				
				if(rowEmpty){
					$(this).remove();
				 }				
			});
			
			//To disable command if all selected rows are removed.
			//IR-653263-3DEXPERIENCER2018x
			var disable = true;
			var childEles = null;
			if($("#modifyAssemlyElement").attr("disabled")!=="disabled" && (childEles = $("#editTableBody").children()).length > 0){				
		    	childEles.each(function(i,ele){
		    		if(!(ele.children[3].getAttribute("isGraphic")==="true")){
		    			disable = false;
		    			return false;
		    		}	
		    	});
			}
			
			if( disable){
				customEditUtil.disableCommand('#modifyAssemlyElement');
				editInstance.disableClearButton();
			}
		};
     this.renderPOAwithCoulmnCellsAfterPOADisconnect = function(poaId) {
        'use strict';
        //get poa assembly
        var mcIds_ForGivenPOA = customEditUtil.getAllMC_ids(poaId);
        var poaAssemblyJSONData = editInstance.getMasterCopyData(poaId);
        var selectedCells = new Array();
        $.each(poaAssemblyJSONData, function(copyId, copyData) {
            if(customEditUtil.isTableRowExists(copyId)) {
                var cell_Id= customEditUtil.getCellId(copyId,poaId);
                var indexToRemove  = mcIds_ForGivenPOA.indexOf(cell_Id);
                if(indexToRemove > -1) {
                    mcIds_ForGivenPOA.splice(indexToRemove,1);
                }
            } else {
                customEditUtil.addNewTableRow(copyId);
            }
        });
        //For each removal cell
        $(mcIds_ForGivenPOA).each(function(index, cellIdsToRemove) {
            selectedCells.push(cellIdsToRemove);
        });
        if( selectedCells.length > 0 ) {
            var selector = "td[poa_id='"+poaId+"']";
            renderUIAfterPOARemovedFromCustomizedPOA(selectedCells,selector);
        }
        //remove any empty rows
        customEditUtil.removeEmptyRows();
        alignScrollbar();
    };
		/*
			R2J - This method removes progress icon puts cancel icon back
		*/
		this.removeProgress = function (elem, imagepath){
			'use strict';
			var imageTag = $(elem).find('img');
			imageTag.attr('src',imagepath);
		};
		
		//Handler: Master Copy Span Click Handler
		this.masterCopyEllipsisHandler = function(eventObject){
			'use strict';
			var clickedAnchor=eventObject.target;
			if($(clickedAnchor).is('img'))
				return;
			var artworkMasterId = "";
			
			//If Clicked element is anchor tag and has class .ellipsis_MC, It will have 2 children as constructed in Tree
			if(($(clickedAnchor).is('a') && $(clickedAnchor).hasClass('ellipsis_MC'))){
			artworkMasterId = $(clickedAnchor).children("span").attr('mc_id');
			}// In case Of IE browser, clickedAnchor is span element, hence we need to get artworkMasterId as below.
			else if($(clickedAnchor).is('span')){
			artworkMasterId = $(clickedAnchor).attr('mc_id');
			}
			
			if(artworkMasterId == null || artworkMasterId == '')
			  return;
			var mcTable = $('<table id="masterCopyTable" title="Display Name"></table>');
			mcTable.attr("class","table table-bordered table-condensed table-hover table-striped");
			var thead = $("<thead ></thead>");
			var theadRow = $("<tr></tr>");
			var elementTypeHTML = $("<th>"+POA_EDIT_LABELS['emxAWL.Label.CopyElementType']+"</th>");
			var elementRevisionHTML = $("<th>"+POA_EDIT_LABELS['AWL.Common.Revision']+"</th>");
			var elementStateHTML = $("<th>"+POA_EDIT_LABELS['emxFramework.Basic.State']+"</th>");
			var mcContentHTML = $("<th>"+POA_EDIT_LABELS['emxLabel.Label.BaseContent']+"</th>");
			$(theadRow).append(elementTypeHTML);
			$(theadRow).append(elementRevisionHTML);
			$(theadRow).append(elementStateHTML);
			$(theadRow).append(mcContentHTML);
			$(thead).append(theadRow);
			$(mcTable).append(thead);
			
			var mcTableBody = $('<tbody></tbody>');
			var jsonMasterCopyData = getSyncJSON("../resources/awl/view/artworkmaster/getmastercopymetadata", "mca_id="+artworkMasterId);
			$.each(jsonMasterCopyData,function(key,value){
				if(value == null)
					jsonMasterCopyData[key] = "";
			});
			
			var flagImage = getImageURL(jsonMasterCopyData.flag,jsonMasterCopyData.GeoInclusion);
			var masterType = jsonMasterCopyData.type;
			$(mcTable).attr("title",jsonMasterCopyData.displayNameAtt);
			var revisionInfo = jsonMasterCopyData["revisions"];
			$.each(revisionInfo, function(index){
				var revisionDetails = revisionInfo[index];
				var bodyRow = $("<tr></tr>");
				var typeTD= $('<td>'+masterType+'</td>');
				var revisionTD= $('<td style=\"text-align:center\">'+revisionDetails["revision"]+'</td>');
				var stateTD= $('<td>'+revisionDetails["state"]+'</td>');
				var copyText= $('<td>'+revisionDetails["COPY_TEXT"]+'</td>');
				$(bodyRow).append(typeTD);
				$(bodyRow).append(revisionTD);
				$(bodyRow).append(stateTD);
				$(bodyRow).append(copyText);
				$(mcTableBody).append(bodyRow);
			});
			$(mcTable).append(mcTableBody);
			mcTable.dialog({
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
				},
				open: function(event, ui) {
				    $(event.target).parent().find(".ui-dialog-title").append(" ").append(flagImage);
				  }
			});
		};	
		

		//Get id Array from javascript JSON String , used for countries and languages.
		this.getIdArrayFromJSString = function(givenJSONObjectString){
			'use strict';
				var givenJSONObjectStringfied = JSON.stringify(givenJSONObjectString);
				var pasedObjects = JSON.parse(givenJSONObjectStringfied)
				var IdsToReturn = new Array();
					$(pasedObjects).each(function(index){
						var objectInfo = $.parseJSON(pasedObjects[index]);
						IdsToReturn.push(objectInfo.id);
					});
					
				return IdsToReturn;
			};
			
		//AA1 Compare Country Data, return true if everything is same
        this.compareArrays = function(existingCountryArray,newlySelectedIds){
            'use strict';
            //getMetaData of Copy in format for CopyData
            if(existingCountryArray.length != newlySelectedIds.length)
                return false;
            $.each(newlySelectedIds, function(index,idToRemove) {
                    var indexInExisting = existingCountryArray.indexOf(idToRemove);
                    if(indexInExisting > -1){
                    	existingCountryArray.splice(indexInExisting,1);
                    }
                });
            if( existingCountryArray.length == 0 )
            return true;
            else
            return false;
        };
		
		//Get id Array from java String having content separated by comma, used for countries and languages.
		this.getIdArrayFromJavaString = function(givenJavaString){
			'use strict';
			var IdsToReturn = new Array();
			if(givenJavaString === undefined || givenJavaString.length == 0 )
				return IdsToReturn;
			givenJavaString = givenJavaString.replace("[","").replace("]","").replace(new RegExp(" ", 'g'),"");
			var givenStringArray =givenJavaString.split(",");
			
			$.each(givenStringArray, function( index,givenObjectId) {
				IdsToReturn.push(givenObjectId);
            });
			return IdsToReturn;
			};

		//Convert Java string having JSON objects to javascript array of json objects
		this.getJSONArrayFromJavaString = function(givenJavaStringWithJObject){
			'use strict';
			if(givenJavaStringWithJObject === undefined || givenJavaStringWithJObject.length == 0 )
				return new Array();
			
			givenJavaStringWithJObject = givenJavaStringWithJObject.replace(new RegExp("},", 'g'),"}},");
			return givenJavaStringWithJObject.split("},");
			};

  	this.isEmpty = function (val){
  		return (typeof(value) !== "undefined"|| val == null || val.length <= 0) ? true : false;
  	}

	/*
		Function to find Mandatory Languages for selected Master cells
		@selectedTDS : Selected table data in the view.
		@author : Raghavendra M J (R2J)
		@since : 2015x.HF17
	*/
	this.getMandLangsForSelectedMasterCells= function(selectedTDS)
	{
			var mandLanguages = new Array();
			$.each(selectedTDS, function(index, currentCell){
				var mandLangValues = ($(currentCell).attr('lc_mandids')||"").split(",");
				var langNames = ($(currentCell).attr('lang_names')||"").split(",");
				var element = "1";
				var idx = mandLangValues.indexOf(element);
				while (idx != -1) {
					  mandLanguages.push(langNames[idx]);
					  idx = mandLangValues.indexOf(element, idx + 1);
				}
			});	
			return mandLanguages;
	}
	/*
		Function to find common elements between arrays.
		@author : Raghavendra M J (R2J)
		@since : 2015x.HF17
	*/
	this.findCommonElements = function(arrayA, arrayB) {
		var tempArray;
		if (arrayB.length > arrayA.length) 
			tempArray = arrayB, arrayB = arrayA, arrayA = tempArray; // indexOf to loop over shorter
		return arrayA.filter(function (e) {
			return arrayB.indexOf(e) > -1;
		});
		return tempArray;
	}
	
	/*
		Function to removeAll from the source array of toRemoveArray
		@author : Raghavendra M J (R2J)
		@since : 2015x.HF17
	*/
	this.removeAllFromArray = function(sourceArray, toRemoveArray) {		
		var sourceArray = $.grep(sourceArray, function(value) {
			return $.inArray(value, toRemoveArray) < 0;
		});
		return sourceArray;
	}
		
		this.getNotesInfo = function(notesImageSpan){
			
			var notesInfoArray = $(notesImageSpan).data("localLanguageNotesMap");
			var isGraphicElement =  notesInfoArray["isGraphicElement"];
			
			var notesTable = $("<table>").attr("id","notesTable");
			var thead = $("<thead ></thead>");
			var theadRow = $("<tr></tr>");
			var thLanguage=$("<th>"+POA_EDIT_LABELS['emxAWL.common.Languages']+"</th>");
			$(thLanguage).attr("style","background: #368ec4;width: 50%");
			var thName=$("<th>"+POA_EDIT_LABELS['emxAWL.Label.Notes']+"</th>");
			$(thName).attr("style","background: #368ec4;width: 50%");
			if(!isGraphicElement)
				$(theadRow).append(thLanguage);
			$(theadRow).append(thName);
			$(thead).append(theadRow);
			$(notesTable).append(thead);
			notesTable.attr("class","table table-bordered table-condensed table-hover table-striped");			
			notesTable.attr("title", notesInfoArray['masterElemenType']+"  ( "+notesInfoArray['displayName']+" )");
			
			$.each(notesInfoArray, function( langName,languageNotes) {
				
				if(langName =="masterElemenType" ||  langName == "displayName"||  langName == "isGraphicElement")
					return;
				
				var notesDiv = $("<div/>").html(languageNotes);
				var eachLangNewRow = $('<tr></tr>');
				if($('#editNotesSpan').parents('td').attr('isinline') == 'true' ){
					var langList = langName.split(",");
					if(langList.length > 3 ){
						langName = langList[0] + ", " + langList[1] + ", " + langList[2] + " +" + (langList.length-3).toString() ;
					}
				}
				var eachLangNameCell = $('<td>'+langName+'</td>');

				var eachLangNotesCell = $('<td></td>');
				eachLangNotesCell.append(notesDiv);

				if(!isGraphicElement)
					$(eachLangNewRow).append(eachLangNameCell);
				$(eachLangNewRow).append(eachLangNotesCell);				
				$(notesTable).append(eachLangNewRow);
			});
			
			notesTable.dialog({
				title: jQuery(this).attr("data-dialog-title"),
				closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
				close: function() { jQuery(this).remove(); },
				modal: false,
				hide: { effect: "none", duration: 150 },
				show: { effect: "none", duration: 150 },
				height: 'auto',
				position: {
					my: 'center',
					at: 'center',
					of: notesImageSpan
				}
			});
			notesTable.parent().addClass("LanguageDialogue-overflow");
			$(notesTable[0]).attr("style","width: 100%");
		};
		
		this.hideToolTip = function(idSelector) {
			//$(idSelector).tooltip('close');
			$(window).focus();
		};
		this.injectMessageIfDynaIsEmpty = function(artworkTreeData) {
			if(artworkTreeData.length==0) {
				var dynaContainer = $(".dynatree-container")[0];
				// create message container
				var emptyDynatreeContiner = $('<div class="empty-dynatree-container">'+POA_EDIT_LABELS['emxAWL.Msg.NoArtworkElementsFound']+'</div>');
				$(dynaContainer).append(emptyDynatreeContiner);
			}
		};
    
		getAlertMessage = function(message, msgType) {
			var timeout = 'alert-error'==msgType?4000:1500;
			var container = $('<div>').attr('class','alert alert-root awl-alertcontiner').attr('style','visibility: visible').mouseover(function() {
				
			});
			var msgContainer = $('<div>').attr('class','alert-message fade alert-closable alert-has-icon in').attr('style','position: absolute; z-index: 0; top: 210px;').html(message);
			msgContainer.addClass(msgType);
			
			var iconContainer = $('<span>').attr('class','icon fonticon');
			var button = $('<button>').attr('class','close').attr('type', 'button').click(function() {
				$(container).remove();
			}).html('*');
			msgContainer.append(iconContainer);
			msgContainer.append(button);
			container.append(msgContainer);
			$(document.body).append(container);
			setTimeout(function(){ 
				$(container).remove();
			}, timeout);
		};
		
		this.SuccessAlert = function(message) {
			getAlertMessage(message, 'alert-success');
		};
		this.ErrorAlert = function(message) {
			getAlertMessage(message, 'alert-error');
		};
		this.WarningAlert = function(message) {
			getAlertMessage(message, 'alert-warning');
		};
		
    };
})(jQuery);
