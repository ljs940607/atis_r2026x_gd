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

(function($) {
    poaAddRemoveMaster = new function() {
	/*
		Function to handle create new Master copy element
	*/
		var FetchedArtworkTreeData = [];
		var artworkTreeData = [];
        this.createMasterCopyElement = function() {
            'use strict';
            var selectedPOAId = customEditUtil.getSelectedPOAs();
            if (selectedPOAId.length == 0) {
                //XSSOK
                alert(POA_EDIT_LABELS['emxAWL.Message.selectPOA'])
            } else {
                var hierarchyValues = validateForCommonHierarchy(selectedPOAId);
                var appendString = "&selectedPOAId=" + selectedPOAId + "&objectId=" + selectedPOAId + "&parentOID=" + selectedPOAId + "&hierarchyIds=" + hierarchyValues[0] + "&hierarchyNames=" + hierarchyValues[1];
                var createNewMCURL = "../common/emxCreate.jsp?form=type_MasterCopyElement&policy=policy_ArtworkElementContent&HelpMarker=emxhelpcreatemastercopy&createJPO=AWLCopyElementUI:createMasterCopyElement&nameField=autoName&postProcessURL=../awl/AWLPOAEditRefresh.jsp&preProcessJavaScript=createElementFromPOAEdit:checkAcessForYesOnBuildFromList&type=type_TargetMarketMasterCopy&showApply=true&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl&widgetId=null" + appendString;
                showModalDialog(createNewMCURL, 100, 50, true, '');
            }
        };
        
        this.createMasterCopyElementFromConnector = function() {
        	console.log("Create MCE from Connector");
            'use strict';
            var selectedPOAId = customEditUtil.getSelectedPOAs();
            if (selectedPOAId.length == 0) {
                //XSSOK
                alert(POA_EDIT_LABELS['emxAWL.Message.selectPOA'])
            } else {
                var hierarchyValues = validateForCommonHierarchy(selectedPOAId);
                var appendString = "&selectedPOAId=" + selectedPOAId + "&objectId=" + selectedPOAId + "&parentOID=" + selectedPOAId + "&hierarchyIds=" + hierarchyValues[0] + "&hierarchyNames=" + hierarchyValues[1];
                var createNewMCURL = "../common/emxCreate.jsp?form=type_MasterCopyElement_connector&policy=policy_ArtworkElementContent&HelpMarker=emxhelpcreatemastercopy&createJPO=AWLCopyElementUI:createMasterCopyElement&nameField=autoName&fromConnector=true&postProcessURL=../awl/AWLPOAEditRefresh.jsp&preProcessJavaScript=createElementFromPOAEdit:checkAcessForYesOnBuildFromList&type=type_TargetMarketMasterCopy&showApply=true&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&SuiteDirectory=awl&widgetId=null" + appendString;
                showModalDialog(createNewMCURL, 100, 50, true, '');
            }
        };

        //Handler To create new Master Graphic Element
        this.createGraphicElement = function() {
            'use strict';
            var selectedPOAId = customEditUtil.getSelectedPOAs();
            if (selectedPOAId.length == 0) {
                //XSSOK
                alert(POA_EDIT_LABELS['emxAWL.Message.selectPOA'])
            } else {
                validateForCommonHierarchy(selectedPOAId);
                var appendString = "&selectedPOAId=" + selectedPOAId + "&objectId=" + selectedPOAId + "&parentOID=" + selectedPOAId;
                var createNewGraphicURL = "../awl/emxAWLCommonFS.jsp?functionality=ImageElementCreateFSInstance&context=createImageElement&suiteKey=AWL&uiType=CreateStandAlone" + appendString;
                showModalDialog(createNewGraphicURL, "", "", true, '');
            }
        };

        //Function to check for common hierarchy
        function validateForCommonHierarchy(selectedPOAId) {
            'use strict';
            var hierarchyValues = new Array();
            var hierarchyIds = getSyncJSON("../resources/awl/view/artworkmaster/getPlaceOfOriginForNewElement", "selectedPOAId=" + selectedPOAId);
            hierarchyValues.push(hierarchyIds);
            var hierarchyNames = getSyncJSON("../resources/awl/util/getMarketingNames", "objectIds=" + hierarchyIds);
            hierarchyValues.push(hierarchyNames);
            var hierarchyIdsLength = hierarchyIds.split(",");
            if (hierarchyIdsLength.length > 1) {
                var alertMessage = POA_EDIT_LABELS["emxAWL.CreateArtworkElement.MultiPOA"];
                alertMessage = alertMessage.replace("{...}", hierarchyNames);

                //XSSOK getting I18N value
                alert(alertMessage);
            }
            return hierarchyValues;
        }


        //On click of POA header cell selection
        this.poaHeaderCellClicked = function(e) {
            'use strict';
            var selection = e.target;
            if (!$(selection).is('th'))
                return;
            $(selection).toggleClass('POASelected');

            //For removing select all check box
            var isPoaSelected = $(selection).hasClass('POASelected');
            if (!isPoaSelected)
                $('#selectAll').removeClass('selected');

            //For enabling select all check box
            if ($('.POAHeaderCell').length == $('.POASelected').length)
                $('#selectAll').addClass('selected');

            //TODO need to use toggle Class
            //TODO Enable/Disable Removal Icon on Element Type
		var commandsArray = ['addArtworkMaster','createMasterCopyElement','createGraphicElement','manageCountryLanguages','removePOA', 'disconnectComprisedPOA','addElementFromComprisedPOA','removeCopyList','connectComprisedPOA', 'resequenceElements','saveSequenceNumber','addExistingElem', 'addExistingCL'];

		if( $("th.POASelected").length > 0){
			customEditUtil.enableCommands(commandsArray);
			editInstance.enableClearButton();
		} else {
			customEditUtil.disableCommands(commandsArray);
			editInstance.disableClearButton();
		}
		addRemoveMaster.nonEditablePOAHandler(this);
		
		selectPOAMasterCopy(e.currentTarget.id,isPoaSelected);
	};
	
	selectPOAMasterCopy = function(poaId,select){		
		var eleList = $("td[id*='_"+poaId+"']");

		eleList.each(function(index,ele){
			if($(ele).attr("selectable") === "true"){
				if(select && ele.innerHTML !==""){
					//$(ele).attr("class", "success");
					if(!$(ele).hasClass("success") && $(ele).attr("isnotranslate") != "true" && $(ele).attr("isgraphic") != "true"){
						$(ele).trigger("click");
					}
				}else{
					//$(ele).removeClass("success");
					if($(ele).hasClass("success")){
						$(ele).trigger("click");
					}
				}
			}
		});
	};
	
	this.selectAllPOAMasterCopy = function(){
		$(".POAHeaderCell").each(function(index,ele){
			selectPOAMasterCopy($(ele).attr("id"),$(ele).hasClass("POASelected"));
		});
	};
	
	this.nonEditablePOAHandler = function(event){ // This Function is Invoked when Non-Draft POA/CL is selected.
		var nonEditablePOAList = $('.non-editable-poa');
		var isNonEditablePOASelected = false;
		if(nonEditablePOAList.length >= 1){
			$.each(nonEditablePOAList,function() {
				if($(this).hasClass('POASelected'))
					isNonEditablePOASelected = true;
		});
	  }
		var editCommandArrays = ['editNote','editInstanceSequence','removeArtworkMaster'];
		if(isNonEditablePOASelected){
			var commandsArray = ['addExistingElem','addArtworkMaster','createMasterCopyElement','createGraphicElement','manageCountryLanguages','disconnectComprisedPOA','addElementFromComprisedPOA','connectComprisedPOA', 'resequenceElements','saveSequenceNumber', 'addExistingCL'];
			customEditUtil.disableCommands(commandsArray);
			customEditUtil.disableCommands(editCommandArrays);
			customEditUtil.enableCommand('#removePOA');
			customEditUtil.enableCommand('#removeCopyList ');
		}else if($('.artworkElementCell.selected').length>0){
			customEditUtil.enableCommands(editCommandArrays);
		}
	}

this.artworkElementCellClicked = function(e){
	'use strict';

	$(this).toggleClass('selected');
    if(!$(this).hasClass("selected")){
        $('#selectAllElements').removeClass("selected");
    }
    if($('#editTable tbody tr').length == $('td div.selected').length)
			$('#selectAllElements').addClass('selected');

	var editCommandArrays = ['editNote','editInstanceSequence','removeArtworkMaster'];
	var selectedNonEditablePOA = $('.non-editable-poa.POASelected').length;

	if( $("td div.selected").length > 0 && selectedNonEditablePOA==0) {
		customEditUtil.enableCommands(editCommandArrays);
		editInstance.enableClearButton();
	} else {
		customEditUtil.disableCommands(editCommandArrays);;
		editInstance.disableClearButton();
	}
}

clearAddMasterSelections = function() {
	$('#addArtworkMasterFilter').val("");
			$(".dynatree-selected").removeClass('dynatree-selected');
}// Clear RRR1

	 //N94 expandAll Tree Nodes
	expandAll= function(){
		$("#addArtworkMasters").dynatree("getRoot").visit(function(node){
			node.expand(true);
		  });

		  return false;
	}

        //N94 Collapse All Tree Nodes
        collapseAll = function() {
            $("#addArtworkMasters").dynatree("getRoot").visit(function(node) {
                node.expand(false);
            });
            return false;
        }

	/*
		Fetches selected check box masters
		@author Raghavendra M J(R2J)
		@since 2015x.HF16
	*/
	getAllMasterSelectedNodes=function(){
		var selectedMasterNodes = [];
		var allNodesSelected = $("#addArtworkMasters").dynatree("getSelectedNodes");
		$.each(allNodesSelected, function(index, currentNode){
			if(currentNode && currentNode.data.isAdded!="true" && currentNode.data.kindOf == "MasterCopyName"){
				selectedMasterNodes.push(currentNode);
			}
		});
		return selectedMasterNodes;
	}
	getSelectedMasterRevisionId = function(node) {
		var childNodeList = node.childList;
		for(var i=0; i<childNodeList.length ; i++) {
        	if(childNodeList[i].bSelected) {
        		return childNodeList[i].data.id;
        	}
        }
	}
	addSelectedElements=function(event){
			var mcids = [];
			var mc_cl_ids = [];
			var validMasterNodes = [];
			var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
			var copyListIds = [];
			var allNodesSelected = $("#addArtworkMasters").dynatree("getSelectedNodes");
			var selectedMasterNodes  = getAllMasterSelectedNodes();			
			selectedMasterNodes.forEach(function(currentNode){
				//var currentMasterId = currentNode.data.objectId;
				var currentMasterId = getSelectedMasterRevisionId(currentNode);
						if(jQuery.inArray(currentMasterId, mcids ) == -1)
							mcids.push(currentMasterId);
						
							var currentCopyListId = currentNode.parent.parent.data.objectId;
							if(jQuery.inArray( currentCopyListId, copyListIds ) == -1)
								copyListIds.push(currentCopyListId);

							var mc_cl_id = currentMasterId+"_"+currentCopyListId;
							if(jQuery.inArray( mc_cl_id, mc_cl_ids ) == -1)
								mc_cl_ids.push(mc_cl_id);
			});

			if (mcids.length <= 0) {
				alert(POA_EDIT_LABELS["emxAWL.Alert.SelectElement"]);
				return;
			}

			var clickedImage = event;
			$(clickedImage).removeClass('addSelectedElements');
			$(clickedImage).addClass('progressClass');
			$.ajax({
				type: "POST",
				url: addRemoveMaster.getAddMasterCopiesServiceURL(),
				data: "copyId=" + mcids + " &selectedPOAs=" + selectedPOAsArr+"&copyListId="+copyListIds.join(",") +"&copyListMasterId="+mc_cl_ids.join(",") ,
				dataType: "json",
				cache: false,
				async: true,
				beforeSend: function(request) {
					addSecureTokenHeader(request);
					$('#editTableBody').css("position", "relative");
					maskComponent.mask(document.body);
				},
				success: function(jsonResponse) {
					$('#editTableBody').css("position", "fixed");
					maskComponent.unmask(document.body);
					var responseMsg = jsonResponse.returnString;
					if(responseMsg!='success') {
						alert(jsonResponse.returnString);
					}
					var selectedPOAs = customEditUtil.getSelectedPOAs();
					var selectedMasterNodes  = getAllMasterSelectedNodes();	
					var selectedMasterIds = [];
					selectedMasterNodes.forEach(function(node){
						if(node.data.kindOf == "MasterCopyName")
						{
							selectedMasterIds.push(getSelectedMasterRevisionId(node));
						}
					});
					
					var allMasterData = getSyncJSON("../resources/awl/view/artworkmaster/getmastercopiesmetadata", "mca_id="+selectedMasterIds.join(","));
		            		var allPOAsDataforEachMC = editInstance.getLocalCopyInfo(selectedPOAs, selectedMasterIds.join(","));
					
					// IR-589730-3DEXPERIENCER2015x - Sort logic start 
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
					selectedMasterNodes.sort(function(firstNode, secondNode){
						var firstNodeId = firstNode.data.objectId;
						var secondNodeId = secondNode.data.objectId;
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
		            
					selectedMasterNodes.forEach(function(node){
						if(node.data.kindOf == "MasterCopyName")
						{
							var elementId = getSelectedMasterRevisionId(node);
							if(elementId)  {
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
								removeOtherElementCheckBoxes(node.data.masterName);
								$.each(selectedPOAsArr, function(index, poaId) {
										editCopyElementSequenceNumber.validateSequenceNumber(poaId);
								});
							}
							//node.render();
						}
					});
					editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
					$(clickedImage).removeClass('progressClass');
					$(clickedImage).addClass('addSelectedElements');
					
					if(!customEditUtil.isEmpty(jsonResponse['message'])){
						alert(jsonResponse['message']);
					}else if(!customEditUtil.isEmpty(jsonResponse.InvalidSequenceNumbersTypes)){
						alert("These types having invalid sequences: "+ jsonResponse.InvalidSequenceNumbersTypes);
					}
					editInstance.handleHeaderScrollBar();
				},
				error: function(request, status, errorThrown) {
					$('#editTableBody').css("position", "fixed");
					maskComponent.unmask(document.body);
					alert(errorThrown);					
				}
        });
	}

	refreshArtworkAssemblyTable = function(){
		//addRemoveMaster.createDynaTree(false);
		//refreshDynaTree();
		eventFire(document.getElementById('btnexpandAll'), 'click');
}

	refreshDynaTree = function()
	{
		$("#addArtworkMasters").dynatree("getRoot").visit(function(node)
		{
			if(node.data.kindOf != "MasterType")
				return

			var noOfChildNodes = node.childList.length;
			if(noOfChildNodes > 0)
			{
				var isAddedCount = 0;

				$(node.childList).each(function(index, node){
						if(node.data.isAdded == "true")
							isAddedCount = isAddedCount + 1;
				});
				if(isAddedCount == noOfChildNodes){
					node.data.hideCheckbox = true;
					node.render();
				}
			}
		   });
	}

        /* If mastercopy row is already present in just change cells for given POAs.
        Form a selected cells based on mca added and poas selection. then call rener API
        On Click of Add Artwork Master Command */
        //TODO
        /* Get the data to create sliden for selected POAs disable working area for further operation
        createSlidenDivForAddMasterCopy On Click of Add Artwork Master Command  */
        this.addArtworkMasterHandler = function() {
            'use strict';
            // To handle the master selecion and element addition
            var selectedMastersOnEditView = $("div#selectElement.selectable.artworkElementCell.selected");

            if(selectedMastersOnEditView.length > 1){
            	alert(POA_EDIT_LABELS['emxAWL.Error.SelectOneMaster']);
            	return;
            }
            
			$('#editTableBody').css("position", "relative");
			maskComponent.mask(document.body);
			var url = "../resources/awl/view/poaservice/getunusedmasterelements";
			var queryForCopyList = $("#fromCopyList:checked").val() == "on";
			var data = "POAIds="+customEditUtil.getSelectedPOAs()+"&queryForCopyList="+queryForCopyList;
			if(isCopyListGlobal) {
				url = "../resources/awl/view/copylist/getunusedmasterelements";
				data = "CopyListIds="+customEditUtil.getSelectedPOAs();
			} 
			$.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                cache: false,
                async: true,
                beforeSend: function(request) {
                    addSecureTokenHeader(request);
                },
                success: function(jsonPOAHeaderData) {
					$('#editTableBody').css("position", "fixed");
                	maskComponent.unmask(document.body);
                	var selectedLcIds = "";
                    $("td.success").each(function(index) {
                        selectedLcIds = selectedLcIds + "|" + $(this).attr("lc_ids");
                    });
                    var width = $("#workingPane").width();
                    var docWidth = $(window).width();
                    var perc = (width) / docWidth;
        		if(perc>0.8){
        			greyOutWorkingArea("60%");
        		}
        		else{
                        enableWorkingArea();
                    }
                    if(jsonPOAHeaderData.hierarchyInfo.length == 0){
        				artworkTreeData=FetchedArtworkTreeData= [];
        			} else {
        				if($("#fromCopyList:checked").val() == "on"){
        						if(artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.copyListInfo == undefined)
        							artworkTreeData=FetchedArtworkTreeData = [];
        						else
        							artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.copyListInfo;

        				} else {
        						if(artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.hierarchyInfo == undefined)
        							artworkTreeData=FetchedArtworkTreeData = [];
        						else
        							artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.hierarchyInfo;
        				}
        			}
                	
                    var slideInDiv = $('<div id="slideInDiv"></div>');
            		var slideInContentTable = addRemoveMaster.createSlideInArtworkMasterTable('emxAWL.Label.ModifyAssemblyMasters', true);
                    slideInDiv.append(slideInContentTable);
                   

                    //attach the new slideIn div to page and adjust working pane area width.
                    $('#workingPane').append(slideInDiv);
                    $("#editTableDiv").show( "slide", {direction: "right" }, 20000 );
                    
                	var imagePath = "../common/images/";
            		$("#addArtworkMasters").dynatree({
            			onActivate: function(node) {
            			},
            			checkbox: true,
            			onCustomRender: function(node) {

                                // Render title as columns
                                if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "Product") {
                                    var styleProductNode = "<span class='product' >" + node.data.title + "</span>";
                                    return styleProductNode;
                                }

            			    // Render title as columns
            			    if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "CopyList") {
            					var copylistNode= "<span class='copyList' >"+node.data.title+"</span>";
            					return copylistNode;
            				}
            		    
            			    if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "revision") {
            			    	var id = node.data.id.replace(/\./g, "");
            			    	var masterid = node.data.masterid.replace(/\./g, "");
            			    	var resultTag = "";
            			    	if(!node.parent.data.isAdded) {
            			    		resultTag = "<span class='dynatree-radio' id='"+id+"' name='"+masterid+"' data-masterid='"+node.data.masterid+"'></span>";
            			    	}
            			    	var spantag = "<span class='revision' >"+node.data.title+"</span>";
            					return resultTag + spantag;
            		    	}
            			
            				//Rendering for Copy List
            				if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterType") {
            					var copyListNode = "<span class='MasterType' >" + node.data.title + "</span>";
            					return copyListNode;
            				}			
                            //Rendering for Structured Master Element
                            if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "StructuredMasterCopyName") {
                                var structuredMasterNode = "<span class='structuredMaster' >" + node.data.title + "</span>";
                                node.data.hideCheckbox = true;
                                return structuredMasterNode;
                            }
                            if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterCopyName"){
            					if(node.data.isAdded) {
            						node._select(false, false, false);
            						node._fixSelectionState();
            						node._updatePartSelectionState();
            					}
                            }

            				// Default rendering, dont render for product/type
            				if(node.data.hasOwnProperty("kindOf") && node.data.kindOf != "MasterCopyName"){
            				  return false;
            				}

            				var eachRow  = "<a class='dynatree-title ellipsis_MC' href='#' >";
            				var displayNameNotAdded=true;
            				for(var i=0; i<1; i++){
            					if(node.data.hasOwnProperty("displayName") &&displayNameNotAdded){
            						var copyId=node.data.objectId;
            						var copyListId=node.data.connectedCopyListId;
            						var masterName=node.data.masterName;
            						var displayName = false;
            						var styleForPatial="";
            						if(node.data.hasOwnProperty("partialUsage") && node.data.partialUsage){
            							styleForPatial="style='color:green'";
            						}
            						eachRow = eachRow + "<span class='td' mc_id='"+copyId+"' mastername='"+masterName+"' "+styleForPatial+">"+node.data.displayName+"</span>";

            						if(!node.data.hasOwnProperty("isAdded") && !node.data.isArtworkElementUsed){
            							var imageTag = "<img mc_id='"+copyId+"'"+
            														"class='addIcon'"+
            														"copyListId='"+copyListId+"'"+
            														"masterName='"+masterName+"'"+
            														"src='../common/images/iconActionAdd.png'"+
            														"style='width:16px; left:350px;height:16px;padding-right:2px;' />";
            							var spanTag = "<span mc_id='"+copyId+"' mastername='"+masterName+"'></span>" + imageTag;
            							eachRow = eachRow +spanTag;
            						}
            					}
            				}
            				eachRow = eachRow + "</a>";
            				return eachRow;
            			},
            			onRender : function (node, event){
            				var fromCopyList  = $("#fromCopyList:checked").val() == "on";
            				if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterCopyName")
            						renderCompleteTree($("#addArtworkMasters").dynatree("getRoot"));
            			},
                            /* Disable the Add icon in sliden for this master copy Make Asynch Ajax call for add actions.
                       On success message in callback ,
                       get copy data for all POAs
                           If mastercopy row is already present in just change cells for given POAs. Refer renderPartialAddedMasterCells
                           If mastercopy row is NOT present then add new row with info of each POAs. Refer addNewTableRow
                           Remove row copy from sliden
                           On failure show proper message and keep row as gray only. */
                            onClick: function(node, event) {
                                'use strict';
                                var element = event.target;
                                if(node.data.kindOf == "revision") {
                                	selectRevision(true, node);
                                	return;
                                }
                           
                                if (!$(element).hasClass('addIcon'))
                                    return;
                                
                                
                                if(!node.bSelected){
                                	node.bSelected = true;
                                	 $(node.span).addClass("dynatree-selected");
                                	 var childNodeList = node.childList;
                 	     			 childNodeList[childNodeList.length-1].bSelected=true;
                 	     			 $(childNodeList[childNodeList.length-1].span).addClass("dynatree-selected");
                                }
                                showProgress($(element).parent());
                                
                                var childNodeList = node.childList;
                                var artworkMasterId = "";
                                for(var i=0; i<childNodeList.length ; i++) {
                                	if(childNodeList[i].bSelected) {
                                		artworkMasterId = childNodeList[i].data.id;
                                		break;
                                	}
                                }
            				var copyListId = "";
            				if(node.parent.parent.data.hasOwnProperty("kindOf") && node.parent.parent.data.kindOf == "CopyList"){
            					copyListId = node.parent.parent.data.objectId;
            				}

            				//$(element).parent().parent().parent().find("span.dynatree-checkbox").remove();
            				// Support for IE
                                var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
            				var fromCopyList  = $("#fromCopyList:checked").val() == "on";

            				var addMasterCopyData = "copyId="+artworkMasterId+"&selectedPOAs="+selectedPOAsArr;
            				if(fromCopyList)
            					addMasterCopyData = addMasterCopyData+"&copyListId="+copyListId+"&copyListMasterId="+artworkMasterId+"_"+copyListId;

            				//make ajax call
                                $.ajax({
                                    type: "POST",
                                    url: addRemoveMaster.getAddMasterCopyServiceURL(),
                                    data: addMasterCopyData,
                                    dataType: "json",
                                    cache: false,
                                    async: true,
                                    beforeSend: function(request) {
                                        addSecureTokenHeader(request);
                                    },
                                    success: function(jsonResponse) {
                                        if (customEditUtil.isTableRowExists(artworkMasterId) == true) {
                                            var selectedCells = Array();
                                            $.each(selectedPOAsArr, function(index, value) {
                                                selectedCells.push(customEditUtil.getCellId(artworkMasterId, value));
                                            });

                                            //refresh cells
                                            var selector = "td[mc_id='" + artworkMasterId + "']";
                                            renderUIAfterModAssemnblyElement(selectedCells, selector);
                                        } else {

                                            //add new row
                                            if(jsonResponse.ADD_ROW != "false")
                                        		customEditUtil.addNewTableRow(artworkMasterId, $("div#selectElement.selectable.artworkElementCell.selected").parent().parent());
                                        }
            						    editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
            						    node.data.isAdded = "true"; //Once Added,Set This attribute on Node and dont construct Img HTML
            						    //removeOtherElementCheckBoxes(artworkMasterId);
            						    removeOtherElementCheckBoxes(node.data.masterName);
                                        if (jsonResponse.returnString != "success") {
                                            customEditUtil.removeEmptyRows();
                                            alert(jsonResponse.returnString);
                                        }
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
                            },
                            onSelect: function(flag, node) {
            					node._fixSelectionState();
            					node._updatePartSelectionState();
            					selectRevision(flag, node);
                            },
                            imagePath: imagePath,
                            children: artworkTreeData,
            	       });
            		customEditUtil.injectMessageIfDynaIsEmpty(artworkTreeData);
            		
            		eventFire(document.getElementById('btnexpandAll'), 'click');
                    eventFire(document.getElementById('btnCollapseAll'), 'click');

                    //Aligning the Structured Elements towards right.
                    $(".structuredMaster").parent().css("margin", "22px");
                    $('button#footerButtons').addClass('hideElement');    
        			setSlideInWidth("40%");
                },
                error: function(jsonResponse) {
					$('#editTableBody').css("position", "fixed");
                	maskComponent.unmask(document.body);
                }
            });
        };

        //Create Add Artwork Master GUI DIV creation
        this.createaddArtworkMasterDiv = function() {
            'use strict';

            //Add Artwork Master slidein Div creation
            var slideInDiv = $('<div id="slideInDiv"></div>');
		var slideInContentTable = addRemoveMaster.createSlideInArtworkMasterTable('emxAWL.Label.ModifyAssemblyMasters', true);
            slideInDiv.append(slideInContentTable);

            //attach the new slideIn div to page and adjust working pane area width.
            $('#workingPane').append(slideInDiv);
            $("#editTableDiv").show( "slide", {direction: "right" }, 20000 );
        //attach the new slideIn div to page and adjust working pane area width.
            addRemoveMaster.createDynaTree();
            eventFire(document.getElementById('btnexpandAll'), 'click');
            eventFire(document.getElementById('btnCollapseAll'), 'click');

            //Aligning the Structured Elements towards right.
            $(".structuredMaster").parent().css("margin", "22px");
        };

    //Function to handle When product is selected the Associated Masters should be selected
        this.handleProductSelection = function() {

            var isproduct = $(this).siblings(":last").hasClass("product");
           var isMasterType = $(this).siblings(":last").hasClass("MasterType");
           var isCopyList= $(this).siblings(":last").hasClass("copyList");
            var isProductSelected = $(this).parent().hasClass('dynatree-selected');
            if(isproduct || isMasterType || isCopyList){
                if(isProductSelected){
                $(this).parent().siblings('ul').find('li>span.dynatree-node').addClass("dynatree-selected");
                }
                else{
                    $(this).parent().siblings('ul').find('li>span.dynatree-node').removeClass("dynatree-selected");
                }
            }
        };
	this.switchAddArtworkMaster = function(event){
		//addRemoveMaster.createDynaTree(false);
		
		$('#editTableBody').css("position", "relative");
		maskComponent.mask(document.body);
		
		var url = "../resources/awl/view/poaservice/getunusedmasterelements";
		var queryForCopyList = $("#fromCopyList:checked").val() == "on";
		var data = "POAIds="+customEditUtil.getSelectedPOAs()+"&queryForCopyList="+queryForCopyList;
		
		$.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                cache: false,
                async: true,
                beforeSend: function(request) {
                    addSecureTokenHeader(request);
                },
                success: function(jsonPOAHeaderData) {
					$('#editTableBody').css("position", "fixed");
					maskComponent.unmask(document.body);
					//var jsonPOAHeaderData = addRemoveMaster.getUnsedMasterElements();

					if(jsonPOAHeaderData.hierarchyInfo.length == 0){
						artworkTreeData=FetchedArtworkTreeData= [];
					} else {
						if($("#fromCopyList:checked").val() == "on"){
								if(artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.copyListInfo == undefined)
									artworkTreeData=FetchedArtworkTreeData = [];
								else
									artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.copyListInfo;

						} else {
								if(artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.hierarchyInfo == undefined)
									artworkTreeData=FetchedArtworkTreeData = [];
								else
									artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.hierarchyInfo;
						}
					}
					
					var imagePath = "../common/images/";
					$("#addArtworkMasters").dynatree({
						onActivate: function(node) {
						},
						checkbox: true,
						onCustomRender: function(node) {

							// Render title as columns
							if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "Product") {
								var styleProductNode = "<span class='product' >" + node.data.title + "</span>";
								return styleProductNode;
							}

							// Render title as columns
							if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "CopyList") {
								var copylistNode= "<span class='copyList' >"+node.data.title+"</span>";
								return copylistNode;
							}
						
							if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "revision") {
								var id = node.data.id.replace(/\./g, "");
								var masterid = node.data.masterid.replace(/\./g, "");
								var resultTag = "";
								if(!node.parent.data.isAdded) {
									resultTag = "<span class='dynatree-radio' id='"+id+"' name='"+masterid+"' data-masterid='"+node.data.masterid+"'></span>";
								}
								var spantag = "<span class='revision' >"+node.data.title+"</span>";
								return resultTag + spantag;
							}
						
							//Rendering for Copy List
							if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterType") {
								var copyListNode = "<span class='MasterType' >" + node.data.title + "</span>";
								return copyListNode;
							}			
							//Rendering for Structured Master Element
							if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "StructuredMasterCopyName") {
								var structuredMasterNode = "<span class='structuredMaster' >" + node.data.title + "</span>";
								node.data.hideCheckbox = true;
								return structuredMasterNode;
							}
							if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterCopyName"){
								if(node.data.isAdded) {
									node._select(false, false, false);
									node._fixSelectionState();
									node._updatePartSelectionState();
								}
							}

							// Default rendering, dont render for product/type
							if(node.data.hasOwnProperty("kindOf") && node.data.kindOf != "MasterCopyName"){
							  return false;
							}

							var eachRow  = "<a class='dynatree-title ellipsis_MC' href='#' >";
							var displayNameNotAdded=true;
							for(var i=0; i<1; i++){
								if(node.data.hasOwnProperty("displayName") &&displayNameNotAdded){
									var copyId=node.data.objectId;
									var copyListId=node.data.connectedCopyListId;
									var masterName=node.data.masterName;
									displayName = false;
									var styleForPatial="";
									if(node.data.hasOwnProperty("partialUsage") && node.data.partialUsage){
										styleForPatial="style='color:green'";
									}
									eachRow = eachRow + "<span class='td' mc_id='"+copyId+"' mastername='"+masterName+"' "+styleForPatial+">"+node.data.displayName+"</span>";

									if(!node.data.hasOwnProperty("isAdded") && !node.data.isArtworkElementUsed){
										var imageTag = "<img mc_id='"+copyId+"'"+
																	"class='addIcon'"+
																	"copyListId='"+copyListId+"'"+
																	"masterName='"+masterName+"'"+
																	"src='../common/images/iconActionAdd.png'"+
																	"style='width:16px; left:350px;height:16px;padding-right:2px;' />";
										var spanTag = "<span mc_id='"+copyId+"' mastername='"+masterName+"'></span>" + imageTag;
										eachRow = eachRow +spanTag;
									}
								}
							}
							eachRow = eachRow + "</a>";
							return eachRow;
						},
						onRender : function (node, event){
							var fromCopyList  = $("#fromCopyList:checked").val() == "on";
							if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterCopyName")
									renderCompleteTree($("#addArtworkMasters").dynatree("getRoot"));
						},
						/* 
						Disable the Add icon in sliden for this master copy Make Asynch Ajax call for add actions.
						On success message in callback ,
						get copy data for all POAs
						If mastercopy row is already present in just change cells for given POAs. Refer renderPartialAddedMasterCells
						If mastercopy row is NOT present then add new row with info of each POAs. Refer addNewTableRow
						Remove row copy from sliden
						On failure show proper message and keep row as gray only. */
						onClick: function(node, event) {
							'use strict';
							var element = event.target;
							if(node.data.kindOf == "revision") {
								selectRevision(true, node);
								return;
							}
					   
							if (!$(element).hasClass('addIcon'))
								return;
							
							
							if(!node.bSelected){
								node.bSelected = true;
								 $(node.span).addClass("dynatree-selected");
								 var childNodeList = node.childList;
								 childNodeList[childNodeList.length-1].bSelected=true;
								 $(childNodeList[childNodeList.length-1].span).addClass("dynatree-selected");
							}
							showProgress($(element).parent());
							
							var childNodeList = node.childList;
							var artworkMasterId = "";
							for(var i=0; i<childNodeList.length ; i++) {
								if(childNodeList[i].bSelected) {
									artworkMasterId = childNodeList[i].data.id;
									break;
								}
							}
							var copyListId = "";
							if(node.parent.parent.data.hasOwnProperty("kindOf") && node.parent.parent.data.kindOf == "CopyList"){
								copyListId = node.parent.parent.data.objectId;
							}

							//$(element).parent().parent().parent().find("span.dynatree-checkbox").remove();
							// Support for IE
								var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
							var fromCopyList  = $("#fromCopyList:checked").val() == "on";

							var addMasterCopyData = "copyId="+artworkMasterId+"&selectedPOAs="+selectedPOAsArr;
							if(fromCopyList)
								addMasterCopyData = addMasterCopyData+"&copyListId="+copyListId+"&copyListMasterId="+artworkMasterId+"_"+copyListId;

							//make ajax call
							$.ajax({
								type: "POST",
								url: addRemoveMaster.getAddMasterCopyServiceURL(),
								data: addMasterCopyData,
								dataType: "json",
								cache: false,
								async: true,
								beforeSend: function(request) {
									addSecureTokenHeader(request);
								},
								success: function(jsonResponse) {
									if (customEditUtil.isTableRowExists(artworkMasterId) == true) {
										var selectedCells = Array();
										$.each(selectedPOAsArr, function(index, value) {
											selectedCells.push(customEditUtil.getCellId(artworkMasterId, value));
										});

										//refresh cells
										var selector = "td[mc_id='" + artworkMasterId + "']";
										renderUIAfterModAssemnblyElement(selectedCells, selector);
									} else {

										//add new row
										if(jsonResponse.ADD_ROW != "false")
										customEditUtil.addNewTableRow(artworkMasterId, $("div#selectElement.selectable.artworkElementCell.selected").parent().parent());
									}
									editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
									node.data.isAdded = "true"; //Once Added,Set This attribute on Node and dont construct Img HTML
									//removeOtherElementCheckBoxes(artworkMasterId);
									removeOtherElementCheckBoxes(node.data.masterName);
									if (jsonResponse.returnString != "success") {
										customEditUtil.removeEmptyRows();
										alert(jsonResponse.returnString);
									}
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
						},
						onSelect: function(flag, node) {
							node._fixSelectionState();
							node._updatePartSelectionState();
							selectRevision(flag, node);
						},
						imagePath: imagePath,
						children: artworkTreeData,
					});
					customEditUtil.injectMessageIfDynaIsEmpty(artworkTreeData);
					setSlideInWidth("40%");
					refreshDynaTree();
					eventFire(document.getElementById('btnexpandAll'), 'click');
				},
				error: function(jsonPOAHeaderData) {
					$('#editTableBody').css("position", "fixed");
					maskComponent.unmask(document.body);
					alert(jsonPOAHeaderData);
				}
		});
		
	}
	
    //Function to handle When product is selected the Associated Masters should be selected
        this.handleElementTypeSelection = function(event) {

            var elementype = $(this).siblings(":last").hasClass("td");
            var isProductSelected = $(this).parent().hasClass('dynatree-selected');
            if (elementype) {
                if (isProductSelected) {
                    $(this).parent().siblings('ul').find('li>span.dynatree-node').addClass("dynatree-selected");
                } else {
                    $(this).parent().siblings('ul').find('li>span.dynatree-node').removeClass("dynatree-selected");
                }
            }
        };
//AWLAddExistingElem
this.addExistingElemHandler = function() {
			var selectedMastersOnEditView = $("div#selectElement.selectable.artworkElementCell.selected");
			if(selectedMastersOnEditView.length > 1){
				alert(POA_EDIT_LABELS['emxAWL.Error.SelectOneMaster']);
				return;
			}
 			var poaIdsInUIArray = customEditUtil.getAllPOAIdsArrayInUI();
			//var URL = '../common/emxFullSearch.jsp?field=TYPES=type_CopyList&table=AEFGeneralSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addPOAToPOAEditScreen&excludeOID='+poaIdsInUIArray.join(",");
 			var URL = '../common/emxFullSearch.jsp?field=TYPES=type_MasterLabelElement,type_MasterArtworkGraphicElement:Type!=type_VitaminCodesMasterCopy,type_ServingSizeMasterCopy,type_NutrientCodesMasterCopy,type_ServingperContainerMasterCopy:includeMCE=true&table=AWLAddExistingSelectCopyElementTypes&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addCEToPOAFromConnector';
			//var URL = '../common/emxFullSearch.jsp?field=TYPES=type_LabelElement&table=AEFGeneralSearchResults_AddExisting&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addCEToPOAFromConnector'; 
			//../awl/db/poaservice/addmastercopytopoa';
			
			//var URL = '../common/emxFullSearch.jsp?field=TYPES=type_CopyList:CURRENT=policy_CopyList.state_Preliminary&table=AEFGeneralSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addPOAToPOAEditScreen&excludeOIDprogram=AWLPOAUI:getToBeExcludedPOAIds&poaIdsInUI='+poaIdsInUIArray.join(",");
			showModalDialog(URL,100,50,true,'');
		};
	


        //Creation of slide-in content table
	this.createSlideInArtworkMasterTable = function(slideInHeader, addElementsFromHierarchyOrCopyList){
            // for all headers
            'use strict';
            var slideInContentTable = $("<table/>").attr("id", "slideInContentTable");
            var headerRow = $("<tr/>").attr("class", "slideInTableHeader")
            var headerRowCell = $("<td/>").text(POA_EDIT_LABELS[slideInHeader]).css("padding", "10px");
            headerRow.append(headerRowCell);

            var treeActionBarRow = $("<tr/>").attr("valign", "right").attr("class", "slideinCommands");
            var treeActionBarCell = $("<td/>").attr("class", "tree-action-bar").attr("valign", "right");

		if(!isCopyListGlobal && addElementsFromHierarchyOrCopyList)
		{
				var addArtworkMasterSelectDiv = $("<div/>").attr("class", "switchViewDiv");

				var listOfOptions = [{ "Id": "fromHierarchy", "Name": POA_EDIT_LABELS['emxAWL.Label.ProductHierarchy'], "checked": "true" },
												     { "Id": "fromCopyList", "Name": POA_EDIT_LABELS['emxAWL.label.CopyList'] }];
				$.each(listOfOptions, function() {
						addArtworkMasterSelectDiv.append(
							$('<input />', {
								type: 'radio',
								name: 'fromHierarchy',
								id: this.Id,
								checked: this.checked
							})
						);
						addArtworkMasterSelectDiv.append(
									$('<span />', {
										'text': this.Name
									})
						)
						addArtworkMasterSelectDiv.append(" ");
					});

				headerRowCell.append(addArtworkMasterSelectDiv);
		}

		var filterContainer = $("<input/>").attr('type','text').attr("class","addArtworkMasterFilter").attr("id","addArtworkMasterFilter").attr("title",POA_EDIT_LABELS['emxCommonButton.Filter']).attr("placeholder",POA_EDIT_LABELS['emxCommonButton.Filter']);
		if(slideInHeader!='emxAWL.Action.AddElementFromComprisedPOA'){ // To Ensure filter is not added when adding elements from POA
			treeActionBarCell.append(filterContainer);
			treeActionBarCell.append("&nbsp;");
		}
		if(slideInHeader!='emxAWL.Action.AddElementFromComprisedPOA'){
		var addSelectedArtworkMasters = $("<img/>").attr("class","btn btn-default add-masters-toolbar nopadding")
																						   .attr("id","btnaddSelectedElements")
																						   .attr("onclick","addSelectedElements(this)")
																						   .attr("alt","")
																						   .attr("title",POA_EDIT_LABELS['emxCommonButton.addAll']);
		addSelectedArtworkMasters.addClass("addSelectedElements");
		//addSelectedArtworkMasters.tooltip();

		treeActionBarCell.append(addSelectedArtworkMasters);
		treeActionBarCell.append("&nbsp;");
		}

		var expandButton = $("<img/>").attr("class","btn btn-default add-masters-toolbar nopadding").attr("alt","").attr("id","btnexpandAll").attr("onclick","expandAll()").attr("title",POA_EDIT_LABELS['emxCommonButton.expandAll']);
		//expandButton.tooltip();


		var collapseButton = $("<img/>").attr("class","btn btn-default add-masters-toolbar nopadding").attr("alt","").attr("id","btnCollapseAll").attr("onclick","collapseAll()").attr("title",POA_EDIT_LABELS['emxCommonButton.collapseAll']);
		//collapseButton.tooltip();

		var closeButton = $("<img/>").attr("class","btn btn-default add-masters-toolbar nopadding").attr("alt","").attr("id","closeSlideIn").attr("onclick","closeSlideInWindow()").attr("title",POA_EDIT_LABELS['emxCommonButton.Close']);
		///closeButton.tooltip();

            treeActionBarCell.append(expandButton)
                         .append("&nbsp;")
                         .append(collapseButton)
                         .append("&nbsp;")
                         .append(closeButton);
            treeActionBarRow.append(treeActionBarCell);

            slideInContentTable.append(headerRow);
            slideInContentTable.append(treeActionBarRow);
            var artworkMasterDialog = $('<div/>'); //it adds the element to HTML dom
            artworkMasterDialog.attr("id", "addArtworkMasters");
            artworkMasterDialog.attr("style", "background-color:white;");
            var addArtworkMastersrow = $("<tr/>");
            var cellm = $("<td/>");
            cellm.attr("id", "addArtworkMastersCell");
            cellm.append(artworkMasterDialog);
            addArtworkMastersrow.append(cellm);
            slideInContentTable.append(addArtworkMastersrow);
            return slideInContentTable;
        };


	/*
		Function to filter the artwork master in the Add Artwork Master table.
		@author : Raghavendra M J (R2J)
		@since : 2015x.HF17
	*/

	filterMatchedMasterNodes = function(currentNode, searchString, matchForCopyList){
		var matchedMasterTypeNodes = [];
		
        var specialChars = ["(" , ")" , "[" , "]" , "{" , "}" , "*"];			
			$.each(specialChars,function(i,e){
				var reg = new RegExp("\\" + e,"g");
				var b = '\\' + e;
				
				searchString = searchString.replace(reg,b);
			});
			
		$.each(currentNode.children, function(index, currentMasterTypeNode){

			var masterNodes = currentMasterTypeNode.children;
			var currentMasterTypeTitle = currentMasterTypeNode.title.toLowerCase();
			var matchedMasterNodes = [];

			$.each(masterNodes, function(index, currentMasterNode){
				var masterTitle = currentMasterNode.title.toLowerCase();
				if(masterTitle.search(searchString)!=-1 || currentMasterTypeTitle.search(searchString)!=-1
							||(matchForCopyList && currentNode.title.toLowerCase().search(searchString)!=-1))
					matchedMasterNodes.push(currentMasterNode);
			});

			if(matchedMasterNodes.length> 0 || (currentMasterTypeTitle.search(searchString)!=-1) )
			{
				var newMasterTypeNode = new Object();
				newMasterTypeNode.kindOf = currentMasterTypeNode.kindOf;
				newMasterTypeNode.title = currentMasterTypeNode.title;
				newMasterTypeNode.icon  = currentMasterTypeNode.icon;
				newMasterTypeNode.key   = currentMasterTypeNode.key;
				newMasterTypeNode.children = matchedMasterNodes;
				matchedMasterTypeNodes.push(newMasterTypeNode);
			}
		});
		return matchedMasterTypeNodes;
	}

	/*
		Function to filter the Hieararchy in the Add Artwork Master table.
		@since : 2015x.HF12
	*/
	addArtworkMasterFilterHandler = function()
	{
        if(JSON.stringify(FetchedArtworkTreeData)===JSON.stringify({})){
			return;
		}
        var searchString = $('#addArtworkMasterFilter').val().toLowerCase();
      //IR-697574-3DEXPERIENCER2018x
        /*if(searchString=="" || searchString=="undefined"){
        	addRemoveMaster.createDynaTree(false);// Passing False to indicate Filter Search String has not been entered
        }*/
      
        var bSearchString = !(searchString=="" || searchString=="undefined"); 
        
        var matchedParentNodes = [];
        if(bSearchString){
		 $.each(FetchedArtworkTreeData, function(index, currentParent){
			var fromCopyList  = $("#fromCopyList:checked").val() == "on";
			var matchedNodes = [];
			if(fromCopyList){
				$.each(currentParent.children, function(index, copyListNode){
					var masterTypeNodes = copyListNode.children;
					var copyListTitle = copyListNode.title.toLowerCase();
					var matchedMasterTypeNodes = filterMatchedMasterNodes(copyListNode, searchString, fromCopyList );

					if(matchedMasterTypeNodes.length> 0 || (copyListTitle.search(searchString)!=-1) )
					{
						var newCopyListNode = new Object();
						newCopyListNode.kindOf = copyListNode.kindOf;
						newCopyListNode.title = copyListNode.title;
						newCopyListNode.icon  = copyListNode.icon;
						newCopyListNode.key   = copyListNode.key;
						newCopyListNode.objectId= copyListNode.objectId;
						newCopyListNode.children = matchedMasterTypeNodes;
						matchedNodes.push(newCopyListNode);
					}
				});

			} else {
				matchedNodes = filterMatchedMasterNodes(currentParent, searchString, false);
			}
			if( matchedNodes.length>0 )	{
					 var newParentNode = new Object();
					newParentNode.kindOf = currentParent.kindOf;
					newParentNode.title = currentParent.title;
					newParentNode.children = matchedNodes;
					newParentNode.icon = currentParent.icon;
					newParentNode.key  = currentParent.key;
					matchedParentNodes.push(newParentNode);
				}
				else if((currentParent.title.toLowerCase().search(searchString.toLowerCase()) !=-1)){
					matchedParentNodes.push(currentParent);
				}
		 });

	   }else{
		   matchedParentNodes = FetchedArtworkTreeData;
	   }
        FilteredArtworkTreeData= matchedParentNodes;
		addRemoveMaster.createDynaTree(true);
		eventFire(document.getElementById('btnexpandAll'), 'click');
  }
    
        //Function to close the slideIn and Handle the Rows alignment
        this.closeAddOrRemoveSlideIn = function() {
            enableWorkingArea();
            closeSlideInWindow();

            //Handle the Rows alignment according to the POA Header Size.
            var actualWidth =  $("#editColumnHeaderRow").find('th.POAHeaderCell').width()
            $('tr').each(function(index) {
                if(index!= 0){
                    var currentRowTds = $('tr')[index];
                    var languageTd = $(currentRowTds).find('td.poaLanguaesCell');
                    $(languageTd).width(actualWidth);
                }
            });
        }
        //To Override to get not used element for Copy List.
        this.getUnsedMasterElements = function() {
		var queryForCopyList = $("#fromCopyList:checked").val() == "on";
		return getSyncJSON("../resources/awl/view/poaservice/getunusedmasterelements", "POAIds="+customEditUtil.getSelectedPOAs()+"&queryForCopyList="+queryForCopyList);
        };

        //To Override to get web service URL for connecting element
        this.getAddMasterCopyServiceURL = function() {
		var urlpath = "../resources/awl/db/poaservice/"
		var serviceName = $("#fromCopyList:checked").val() == "on"  ? "addmastercopytopoafromcl" :  "addmastercopytopoa";
		return urlpath+serviceName;
        };

    // To fetch the Master and Local elemenst to load
        this.getAddMasterCopiesServiceURL = function() {
		var urlpath = "../resources/awl/db/poaservice/"
		var serviceName = $("#fromCopyList:checked").val() == "on"  ? "addmastercopytopoafromcl" :  "addmastercopiestopoa";
		return urlpath+serviceName;
        };

	//TODO AA1 To verify.
	this.createDynaTree = function(searchStringIncluded){ //searchStringIncluded will decide whether to fetch data from server or to make use of MatchedList

		if(searchStringIncluded){
			artworkTreeData = FilteredArtworkTreeData; // This Variable will be set in addArtworkMasterFilterHandler()
		} else {
			var jsonPOAHeaderData = addRemoveMaster.getUnsedMasterElements();
			if(jsonPOAHeaderData.hierarchyInfo.length == 0){
				artworkTreeData=FetchedArtworkTreeData= [];
			} else {
				if($("#fromCopyList:checked").val() == "on"){
						if(artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.copyListInfo == undefined)
							artworkTreeData=FetchedArtworkTreeData = [];
						else
							artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.copyListInfo;

				} else {
						if(artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.hierarchyInfo == undefined)
							artworkTreeData=FetchedArtworkTreeData = [];
						else
							artworkTreeData=FetchedArtworkTreeData=jsonPOAHeaderData.hierarchyInfo;
				}
			}
		}
		var imagePath = "../common/images/";
		$("#addArtworkMasters").dynatree({
			onActivate: function(node) {
			},
			checkbox: true,
			onCustomRender: function(node) {

                    // Render title as columns
                    if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "Product") {
                        var styleProductNode = "<span class='product' >" + node.data.title + "</span>";
                        return styleProductNode;
                    }

			    // Render title as columns
			    if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "CopyList") {
					var copylistNode= "<span class='copyList' >"+node.data.title+"</span>";
					return copylistNode;
				}
		    
			    if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "revision") {
			    	var id = node.data.id.replace(/\./g, "");
			    	var masterid = node.data.masterid.replace(/\./g, "");
			    	var resultTag = "";
			    	if(!node.parent.data.isAdded) {
			    		resultTag = "<span class='dynatree-radio' id='"+id+"' name='"+masterid+"' data-masterid='"+node.data.masterid+"'></span>";
			    	}
			    	var spantag = "<span class='revision' >"+node.data.title+"</span>";
					return resultTag + spantag;
		    	}
			
				//Rendering for Copy List
				if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterType") {
					var copyListNode = "<span class='MasterType' >" + node.data.title + "</span>";
					return copyListNode;
				}			
                //Rendering for Structured Master Element
                if (node.data.hasOwnProperty("kindOf") && node.data.kindOf == "StructuredMasterCopyName") {
                    var structuredMasterNode = "<span class='structuredMaster' >" + node.data.title + "</span>";
                    node.data.hideCheckbox = true;
                    return structuredMasterNode;
                }
                if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterCopyName"){
					if(node.data.isAdded) {
						node._select(false, false, false);
						node._fixSelectionState();
						node._updatePartSelectionState();
					}
                }

				// Default rendering, dont render for product/type
				if(node.data.hasOwnProperty("kindOf") && node.data.kindOf != "MasterCopyName"){
				  return false;
				}

				var eachRow  = "<a class='dynatree-title ellipsis_MC' href='#' >";
				var displayNameNotAdded=true;
				for(var i=0; i<1; i++){
					if(node.data.hasOwnProperty("displayName") &&displayNameNotAdded){
						var copyId=node.data.objectId;
						var copyListId=node.data.connectedCopyListId;
						var masterName=node.data.masterName;
						displayName = false;
						var styleForPatial="";
						if(node.data.hasOwnProperty("partialUsage") && node.data.partialUsage){
							styleForPatial="style='color:green'";
						}
						eachRow = eachRow + "<span class='td' mc_id='"+copyId+"' mastername='"+masterName+"' "+styleForPatial+">"+node.data.displayName+"</span>";

						if(!node.data.hasOwnProperty("isAdded") && !node.data.isArtworkElementUsed){
							var imageTag = "<img mc_id='"+copyId+"'"+
														"class='addIcon'"+
														"copyListId='"+copyListId+"'"+
														"masterName='"+masterName+"'"+
														"src='../common/images/iconActionAdd.png'"+
														"style='width:16px; left:350px;height:16px;padding-right:2px;' />";
							var spanTag = "<span mc_id='"+copyId+"' mastername='"+masterName+"'></span>" + imageTag;
							eachRow = eachRow +spanTag;
						}
					}
				}
				eachRow = eachRow + "</a>";
				return eachRow;
			},
			onRender : function (node, event){
				var fromCopyList  = $("#fromCopyList:checked").val() == "on";
				if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterCopyName")
						renderCompleteTree($("#addArtworkMasters").dynatree("getRoot"));
			},
                /* Disable the Add icon in sliden for this master copy Make Asynch Ajax call for add actions.
           On success message in callback ,
           get copy data for all POAs
               If mastercopy row is already present in just change cells for given POAs. Refer renderPartialAddedMasterCells
               If mastercopy row is NOT present then add new row with info of each POAs. Refer addNewTableRow
               Remove row copy from sliden
               On failure show proper message and keep row as gray only. */
                onClick: function(node, event) {
                    'use strict';
                    var element = event.target;
                    if(node.data.kindOf == "revision") {
                    	selectRevision(true, node);
                    	return;
                    }
               
                    if (!$(element).hasClass('addIcon'))
                        return;
                    
                    
                    if(!node.bSelected){
                    	node.bSelected = true;
                    	 $(node.span).addClass("dynatree-selected");
                    	 var childNodeList = node.childList;
     	     			 childNodeList[childNodeList.length-1].bSelected=true;
     	     			 $(childNodeList[childNodeList.length-1].span).addClass("dynatree-selected");
                    }
                    showProgress($(element).parent());
                    
                    var childNodeList = node.childList;
                    var artworkMasterId = "";
                    for(var i=0; i<childNodeList.length ; i++) {
                    	if(childNodeList[i].bSelected) {
                    		artworkMasterId = childNodeList[i].data.id;
                    		break;
                    	}
                    }
				var copyListId = "";
				if(node.parent.parent.data.hasOwnProperty("kindOf") && node.parent.parent.data.kindOf == "CopyList"){
					copyListId = node.parent.parent.data.objectId;
				}

				//$(element).parent().parent().parent().find("span.dynatree-checkbox").remove();
				// Support for IE
                    var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
				var fromCopyList  = $("#fromCopyList:checked").val() == "on";

				var addMasterCopyData = "copyId="+artworkMasterId+"&selectedPOAs="+selectedPOAsArr;
				if(fromCopyList)
					addMasterCopyData = addMasterCopyData+"&copyListId="+copyListId+"&copyListMasterId="+artworkMasterId+"_"+copyListId;

				//make ajax call
                    $.ajax({
                        type: "POST",
                        url: addRemoveMaster.getAddMasterCopyServiceURL(),
                        data: addMasterCopyData,
                        dataType: "json",
                        cache: false,
                        async: true,
                        beforeSend: function(request) {
                            addSecureTokenHeader(request);
                        },
                        success: function(jsonResponse) {
                            if (customEditUtil.isTableRowExists(artworkMasterId) == true) {
                                var selectedCells = Array();
                                $.each(selectedPOAsArr, function(index, value) {
                                    selectedCells.push(customEditUtil.getCellId(artworkMasterId, value));
                                });

                                //refresh cells
                                var selector = "td[mc_id='" + artworkMasterId + "']";
                                renderUIAfterModAssemnblyElement(selectedCells, selector);
                            } else {

                                //add new row
                            	customEditUtil.addNewTableRow(artworkMasterId, $("div#selectElement.selectable.artworkElementCell.selected").parent().parent());
                            }
						    editInstance.alignFirstColumn(); // This will adjust the cell height such that all cells in a row have same height in case of large content.
						    node.data.isAdded = "true"; //Once Added,Set This attribute on Node and dont construct Img HTML
						    //removeOtherElementCheckBoxes(artworkMasterId);
						    removeOtherElementCheckBoxes(node.data.masterName);
                            if (jsonResponse.returnString != "success") {
                                customEditUtil.removeEmptyRows();
                                alert(jsonResponse.returnString);
                            }
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
                },
                onSelect: function(flag, node) {
					node._fixSelectionState();
					node._updatePartSelectionState();
					selectRevision(flag, node);
                },
                imagePath: imagePath,
                children: artworkTreeData,
	       });
		customEditUtil.injectMessageIfDynaIsEmpty(artworkTreeData);
	   };
	   
	   selectRevision = function(flag, node) {
		   if(node.data.kindOf === "MasterType") {
			   setTimeout(function(){
				   var childNodeList = node.childList;
				   for(var j=0; j<childNodeList.length; j++) {
					   var revisionChildNodeList = childNodeList[j].childList;
					   for(var k=0; k<revisionChildNodeList.length-1; k++) {
						   revisionChildNodeList[k].bSelected=false;
						   $(revisionChildNodeList[k].span).removeClass("dynatree-selected");
					   }
				   }
			   }, 10);
		   }else if(node.data.kindOf === "MasterCopyName") {
			   var childNodeList = node.childList;
			   for(var i=0; i<childNodeList.length-1; i++) {
				   childNodeList[i].bSelected=false;
				   $(childNodeList[i].span).removeClass("dynatree-selected");
			   }
		   } else if(node.data.kindOf === "revision"){
			   var childNodeList = node.parent.childList;
			   for(var i=0; i<childNodeList.length; i++) {
				   childNodeList[i].bSelected=false;
				   $(childNodeList[i].span).removeClass("dynatree-selected");
			   }
			   node.bSelected=true;
			   node._fixSelectionState();
			   node._updatePartSelectionState();
			   node.parent._select(flag, false, false);
			   $(node.span).addClass("dynatree-selected");
		   } else if(node.data.kindOf === "Product") {
			   setTimeout(function(){
				   var fromCopyList  = $("#fromCopyList:checked").val() == "on";
				   var childNodeList = node.childList;
					  for(var i=0; i<childNodeList.length; i++) {
						   var subChildNodeList = childNodeList[i].childList;
						   for(var j=0; j<subChildNodeList.length; j++) {
							   var revisionChildNodeList = subChildNodeList[j].childList;
							   if(!fromCopyList) {
								   for(var k=0; k<revisionChildNodeList.length-1; k++) {
									   revisionChildNodeList[k].bSelected=false;
									   $(revisionChildNodeList[k].span).removeClass("dynatree-selected");
								   }
							   }
						   }
					   }
				},10);
			  
		   }
	   };

	/*
		Renders complete tree for the entire slide in.
		@author Raghavendra M J(R2J)
		@since 2015x.HF16
	*/
	renderCompleteTree = function(node){
		var rootNode = $("#addArtworkMasters").dynatree("getRoot");
		var parentNodeChildList = rootNode.childList;
		var addedParentNodes = [];
		$.each(parentNodeChildList, function(index, currentProductLine)
		{
				var copyListNodes = currentProductLine.childList;
				var addedChildNodes = [];
				var fromCopyList  = $("#fromCopyList:checked").val() == "on";
				if(fromCopyList)
				{

					$.each(copyListNodes, function(index, copyListNode){
							addedChildNodes = renderMasterNodes(copyListNode, addedChildNodes);
					});
					if(copyListNodes && copyListNodes.length == addedChildNodes.length){
						removeCheckBox(currentProductLine);
					}
				} else {
					addedChildNodes = renderMasterNodes(currentProductLine, addedChildNodes);
				}
		});
	};

	/*
		Renders Only maaster type node
		@author Raghavendra M J(R2J)
		@since 2015x.HF16
	*/
	renderMasterNodes = function(parentNode, addedNodes)
	{
			var masterTypeNodes = parentNode.childList;
			var addedMasterTypeNodes = [];

			$.each(masterTypeNodes, function(index, currentMasterTypeNode){

				var masterNodes = currentMasterTypeNode.childList;
				var addedMasterNodes = [];

				$.each(currentMasterTypeNode && masterNodes, function(index, currentMasterNode){
					if(currentMasterNode.data.isArtworkElementUsed || currentMasterNode.data.isAdded == "true"){
						removeCheckBox(currentMasterNode);
						addedMasterNodes.push(currentMasterNode);
					}
				});

				if(masterNodes && masterNodes.length == addedMasterNodes.length){
					removeCheckBox(currentMasterTypeNode);
					addedMasterTypeNodes.push(currentMasterTypeNode);
				}
			});

			if(masterTypeNodes  && masterTypeNodes.length == addedMasterTypeNodes.length){
					removeCheckBox(parentNode);
					addedNodes.push(parentNode);
			}
			return addedNodes;
	}

	/*
		Removes applicable check box
		@author Raghavendra M J(R2J)
		@since 2015x.HF16
	*/
	removeCheckBox = function(node){
		node.data.isAdded = "true";
		node.data.hideCheckbox = true;
		if(node.span && node.span.children){
			var checkBoxSpanClass = node.span.children[1].getAttribute("class");
			if(checkBoxSpanClass == "dynatree-checkbox"){
				node.data.checkbox =  false;
				node.render();
			}
		}
	};




	removeOtherElementCheckBoxes = function(mastername){
		var allSpans = $('span[mastername="'+mastername +'"]');
		$('span[mastername="'+mastername +'"]').each(function(index, currentSpan) {
			var checkBoxElement = $(currentSpan.parentElement.parentElement).find("span.dynatree-checkbox");
				if(checkBoxElement.length > 0){
					//checkBoxElement[0].remove();
					// Support for IE
					checkBoxElement[0].parentNode.removeChild(checkBoxElement[0]);
			}
			var addIconElement = $($(currentSpan.parentElement.parentElement)[0]).find("a>img");
			if(addIconElement.length > 0){
				//addIconElement[0].remove();
				// Support for IE
				addIconElement[0].parentNode.removeChild(addIconElement[0]);
			}
		});
		$("#addArtworkMasters").dynatree("getRoot").visit(function(node){
			if(node.data.hasOwnProperty("kindOf") && node.data.kindOf == "MasterCopyName"){
				var jqueryObject = $(node.span);
				var nameMaster = jqueryObject.find("a>span").attr( "mastername" );
				if(mastername == nameMaster)
				{
					node.data.isArtworkElementUsed = true;
					node.data.isAdded = "true";
					node.render();
				}
			}
		 });
	}

	/*
		Function to fetch the valid nodes for addition
		@Since VR2015x.HF17
	*/

	 getValidMasterNodesToAdd = function(node) {
        	var validMasterNodes = [];
        	if(!node)
        		return;

        	if(node.data.objectId!=undefined && node.data.isAdded!="true" && node.data.kindOf == "MasterCopyName" ) {
        		validMasterNodes.push(node);
        		return validMasterNodes;
        	}

        	if(!node.childList)
        		return;

        	for(var i=0;i<node.childList.length;i++) {
        		var currentChild = node.childList[i];
        		if(currentChild.data.objectId!=undefined && currentChild.data.isAdded!="true" && currentChild.data.kindOf == "MasterCopyName" ) {
        			validMasterNodes.push(currentChild);
        		} else {
        			var result = getValidMasterNodesToAdd(currentChild);
        			if(result) {
						result.forEach(function(currentNode) {
							validMasterNodes.push(currentNode);
						});
        			}
        		}
    		}
        	return validMasterNodes;
        };

		/*
			Function to disable the checkbox and remove the add icon from the element
			@Since VR2015x.HF17
		*/
        disableNodeCheckBox = function(node) {
        	if (!node)
                return;

        	node.data.isAdded = "true";
    		node.data.hideCheckbox = true;
    		node.render(true);

    		if (!node.parent)
                return;

    		if(!node.parent.childList)
    			return;

    		//check parent
    		var childNodes = node.parent.childList;
    		var isAllChildsAdded = true;
    		for(var i=0;i<childNodes.length;i++) {
    			if(!childNodes[i].data.isAdded)
    				isAllChildsAdded = false;
    		}
    		if(isAllChildsAdded) {
    			disableNodeCheckBox(node.parent);
    		}
        };
        //Get Remove Master Copy service URL
        this.getRemoveMasterCopyServiceURL = function() {
            return "../resources/awl/db/poaservice/removemastercopiesfrompoas";
        };
        /*
            wx7 - This method will be called when delete on artwork master type is clicked
            Check if any POA Selected --> Else Warn the User for Selection.
            Case:If POA Selected : Then Check whether the POA has selected Artwork Master Connected or Not
            Is Connected --> Give the Confirmation Message.
            Is Not Connected --> Warn the User with Not Connected POAs Information for selected POAs */

        this.removeArtworkMaster = function(cell) {
            'use strict';
            var selectedPOAIDsArray = getArrayofSelectedPoaIDs();
            if (selectedPOAIDsArray.length <= 0) {
                alert(POA_EDIT_LABELS["emxAWL.Message.SelectHeaderObject"]);
                return;
            }

            var mcaPOAs = new Array();
            var nonAssociatedPOANames = [];
	    var mandCopyListsArray = new Array();
            $('tr td div.selected').each(function() {
                var mcid = $(this).closest('td').attr('mcid');
                var poaNames = editInstance.isArtworkMasterConnectedtoPOA(selectedPOAIDsArray, $(this).closest('td').attr('mcid'));
                nonAssociatedPOANames.push(poaNames);
                showProgress($(this).closest('td'));

                $.each(selectedPOAIDsArray, function(index, value) {
                    var cellId = customEditUtil.getCellId(mcid, value);
                    var cellTd = $("td[id='" + cellId + "']");
                    var lc_ids = cellTd.attr('lc_ids');
                    var isGraphic = cellTd.attr('isgraphic');
                    var lc_mandidsValue = cellTd.attr('lc_mandids');
				var mandCopyLists = (cellTd.attr('mandatoryCopyLists')||"").split(","); 
				var lc_mandids = Boolean(typeof lc_mandidsValue != 'undefined' && lc_mandidsValue != "" && lc_mandidsValue.indexOf(1)>=0);
				var hasElement = Boolean(isGraphic && lc_mandids) || Boolean(typeof lc_ids != 'undefined' && lc_ids != "");
				if (hasElement)
					mcaPOAs.push(cellId);

				if(lc_mandids && !customEditUtil.isEmpty(mandCopyLists)){
					$.each(mandCopyLists, function(index, value){
						mandCopyListsArray.push(value);
					});
				}
			});
		});

		mandCopyListsArray = $.distinct(mandCopyListsArray);

        var newArray = [];
        $(nonAssociatedPOANames).each(function(i,value) {
           newArray= newArray.concat(value);
        });
        nonAssociatedPOANames = $.distinct(newArray);

		var message =  POA_EDIT_LABELS['emxAWL.RemoveArtworkElementFromPOAs.Confirmation'];
		if(mandCopyListsArray.length > 0 )
		{
			message = POA_EDIT_LABELS['emxAWL.Confirm.RemoveMandatoryMaster'];			
		}

		if(mcaPOAs != "" && confirm(message)==true)
		{
				var removeCommand = cell;
                $(removeCommand).removeClass('removeArtworkMaster');
                $(removeCommand).addClass('progressClass');
                $.ajax({
                    type: "POST",
                    url: addRemoveMaster.getRemoveMasterCopyServiceURL(),
                    data: "selectedMCEs_POAs=" + mcaPOAs,
                    dataType: "json",
                    cache: false,
                    async: true,
                    beforeSend: function(request) {
                        addSecureTokenHeader(request);
						$('#editTableBody').css("position", "relative");
						maskComponent.mask(document.body);
                    },
                    success: function(jsonResponse) {
						$('#editTableBody').css("position", "fixed");
						maskComponent.unmask(document.body);
                        /* Fix for IR-434767-3DEXPERIENCER2017x --> To show the alert message for artwork master's non associated POAs */
                        var message = POA_EDIT_LABELS["emxAWL.RemoveArtworkElementFromPOAs.Message"] + '\n' + nonAssociatedPOANames;
                        if (nonAssociatedPOANames.length > 0)
                            alert(message);

                        enableRow($(cell).closest('tr'));
                        $('tr td div.selected').each(function() {
                            var selector = "td[mc_id='" + $(this).closest('td').attr("mcid") + "']";
			    renderUIAfterRemoveElement(mcaPOAs,selector);
                        });
                        removeProgress($(cell).closest('td'));
			customEditUtil.removeEmptyRows();

                        $(removeCommand).removeClass('progressClass');
                        $(removeCommand).addClass('removeArtworkMaster');						
						var editCommandArrays = ['editNote','editInstanceSequence','removeArtworkMaster'];
						customEditUtil.disableCommands(editCommandArrays);
                    	editInstance.handleHeaderScrollBar();
                    },
                    error: function(request, status, errorThrown) {
                        alert(errorThrown);
						$('#editTableBody').css("position", "fixed");
						maskComponent.unmask(document.body);
                    }
                });
            } else if (mcaPOAs == "") {
                alert(POA_EDIT_LABELS["emxAWL.Alert.NoElementAssociatedToPOA"]);
                return;
            }

            //When user selects all, We need to remove this option, as soon as user operation is done.
            if ($('#selectAllElements').hasClass('selected'))
                $('#selectAllElements').removeClass('selected');
        };

        /*
            wx7 - enable column
        */
        enableColumn = function(poaId) {
            $("td[poa_id='" + poaId + "']").each(function() {
                toggleCellClick(this);
            });
        };
        /*
            wx7 - enable column
        */
        disableColumn = function(poaId) {
            $("td[poa_id='" + poaId + "']").each(function() {
                toggleCellClick(this);
            });
        };
        /*
            wx7 - This method will return cell ids of row passed
        */
        getRowCellIds = function(row) {
            var cellIds = "";
            $(row).children().each(function() {
                if (($(this).attr('id')) != undefined)
                    cellIds += $(this).attr('id') + ",";
            });
            cellIds = cellIds.slice(0, -1);
            return cellIds;
        };
        
        getValidMasterNodesToAdd = function(node) {
        	var validMasterNodes = [];
        	if(!node)
        		return;
        	
        	if(node.data.objectId!=undefined && node.data.isAdded!="true") {
        		validMasterNodes.push(node);
        		return validMasterNodes;
        	}
        	
        	if(!node.childList)
        		return;
        	
        	for(var i=0;i<node.childList.length;i++) {
        		var currentChild = node.childList[i];
        		if(currentChild.data.objectId!=undefined && currentChild.data.isAdded!="true") {
        			validMasterNodes.push(currentChild);
        		} else {
        			var result = getValidMasterNodesToAdd(currentChild);
        			if(result) {
						result.forEach(function(currentNode) {
							validMasterNodes.push(currentNode);
						});
        			}
        		}
    		}
        	return validMasterNodes;
        };
        
        disableNodeCheckBox = function(node) {
        	if (!node)
                return;

        	node.data.isAdded = "true";
    		node.data.hideCheckbox = true;
    		node.render(true);
    		
    		if (!node.parent)
                return;
    		
    		if(!node.parent.childList)
    			return;
    		
    		//check parent
    		var childNodes = node.parent.childList;
    		var isAllChildsAdded = true;
    		for(var i=0;i<childNodes.length;i++) {
    			if(!childNodes[i].data.isAdded)
    				isAllChildsAdded = false;
    		}
    		if(isAllChildsAdded) {
    			disableNodeCheckBox(node.parent);
    		}
        };
        /*
            wx7 - This method will be called when delete on artwork master type HEADER is clicked
        */
        removeAllArtworkMasterFromPOAs = function() {
            'use strict';
            var confirmResult = confirm(POA_EDIT_LABELS["emxAWL.Warning.RemovelAllFromPOA"]);
            if (confirmResult == false)
                return;
            showProgress($("#removeAllHeaderIcon").closest("th"));
            var selectedPOAs = customEditUtil.getSelectedPOAs();
            var artworkMasters = getAllArtworkMasterIds();
            //Disable all the cells of poa selected.

            var selectedPOAsArr = selectedPOAs.split(',');
            $.each(selectedPOAsArr, function(poaIndex, poaId) {
                disableColumn(poaId);
            });
            var artworkMastersArr = artworkMasters.split(',');
            var processingIds = "";
            $.each(artworkMastersArr, function(amIndex, mcid) {
                $.each(selectedPOAsArr, function(poaIndex, poaId) {
                    var cellId = customEditUtil.getCellId(mcid, poaId);
                    processingIds += cellId + ",";
                });
            });
            processingIds = processingIds.slice(0, -1);
            $.ajax({
                type: "POST",
                url: "../resources/awl/db/poaservice/removemastercopiesfrompoas",
                data: "selectedMCEs_POAs=" + processingIds,
                dataType: "json",
                cache: false,
                async: true,
                beforeSend: function(request) {
                    addSecureTokenHeader(request);
                },
                success: function(jsonResponse) {
                    //remove progress for each cell and refresh cell
                    removeProgress($("#removeAllHeaderIcon").closest("th"));
                    $.each(selectedPOAsArr, function(poaIndex, poaId) {
                        enableColumn(poaId);
                    });
                    var selector = "";
                    $.each(selectedPOAsArr, function(index, value) {
                        selector += "td[poa_id='" + value + "'],";
                    });
                    selector = selector.slice(0, -1);
                    renderUIAfterModAssemnblyElement(processingIds, selector);
                    customEditUtil.removeEmptyRows();
                },
                error: function(request, status, errorThrown) {
                    alert(errorThrown);
                }
            });
        };
        /*
            This function will return selected ids of a row
        */
        getSelectedArtworkMasterCells = function(row) {
            'use strict';
            var selectedCellIds = '';
            $("td.success").each(function(index) {
                if (($(this).attr("mc_id")) == ($(row).attr('id')))
                    selectedCellIds += $(this).attr("id") + ",";
            });
            selectedCellIds = selectedCellIds.slice(0, -1);
            return selectedCellIds;
        };




        /*
            wx7 - This method will return | separated ids of selected cells
        */
        getSelectedCells = function() {
            'use strict';
            var selectedCellIds = '';
            $("td.success").each(function(index) {
                selectedCellIds += $(this).attr("id") + ",";
            });
            selectedCellIds = selectedCellIds.slice(0, -1);
            return selectedCellIds;
        };




        /*
        RIS - This method will return array of selected POA IDs
        */
        getArrayofSelectedPoaIDs = function() {
            'use strict';
            // get poaIds selected
            var poaIds = [];
            $("th.POASelected").each(function() {
                poaIds.push($(this).attr("id"));
            });
            return poaIds;
        };

        /*
            wx7 - This method will return | separated string of artwork masters in screen
        */
        getAllArtworkMasterIds = function() {
            'use strict';
            var artworkMasters = "";
            $('#editTable tbody tr').each(function() {
                artworkMasters += $(this).attr('id') + ",";
            });
            artworkMasters = artworkMasters.slice(0, -1);
            return artworkMasters;
        };

        /*
            wx7 - This method will add changable_LC class.
        */
        disableRow = function(elem) {
            'use strict';
            $(elem).find('td').each(function() {
                toggleCellClick(this);
            });
        };

        /*
            wx7 - This method toggle cell click
        */
        toggleCellClick = function(cell) {
            'use strict';
            if ($(cell).attr("selectable") == "true")
                $(cell).toggleClass("changable_LC");

        };

        /*
            wx7 - This method shows progress icon
        */
        showProgress = function(elem) {
            'use strict';
            var imageTag = $(elem).find('img');
            imageTag.attr('src', '../common/images/iconParamProgress.gif');
        };

        /*
            wx7 - This method enables row
        */
        enableRow = function(elem) {
            'use strict';
            //$(elem).removeClass('processing');
            $(elem).find('td').each(function() {
                toggleCellClick(this);
            });
        };

        /*
            wx7 - This method removes progress icon
        */
        removeProgress = function(elem) {
            'use strict';
            var imageTag = $(elem).find('img');
            imageTag.attr('src', '../common/images/iconActionDelete.gif');
        };
    };
})(jQuery);
