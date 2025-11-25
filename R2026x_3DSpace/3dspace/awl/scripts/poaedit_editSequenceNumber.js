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
	editCopyElementSequenceNumber = new function()
	{
			this.editSequenceNumber = function(){
			var selectedPOAIDsArray = getArrayofSelectedPoaIDs();
			var reqArg = {};
			var poa_mc_sequenceNumberArray = [];
			var invalidValueFound = false;
			var hasDuplicates = false;
			var indexCount = 0;
			var invalidValueNodes = [];
			var allSeqNumbNodes = [];
			if(isSeqNumChanged) {
				$(selectedPOAIDsArray).each(function(i)
				{
					var seqNumbArray = [];
					var seqNumbNodes = [];
					$('td[poa_id="'+selectedPOAIDsArray[i]+'"]').each(function(j)
					{
						// Elements which are not associated are ignored
						if(!$(this).hasClass('empty-artworkelement-cell'))
						{
							var seqNumberNode = $(this).find('div>input');
							var seqNumber = $(seqNumberNode).val();
							allSeqNumbNodes.push(seqNumberNode);
	
							if(seqNumber != defaultSequenceNumber) {
								if(seqNumber<0 || isNaN(seqNumber))
								{
									invalidValueFound = true;
									invalidValueNodes.push(seqNumberNode);
								}
								else if(seqNumbArray.indexOf(seqNumber)!=-1){
									hasDuplicates = true;
									invalidValueNodes.push(seqNumberNode);
									invalidValueNodes.push(seqNumbNodes[seqNumbArray.indexOf(seqNumber)]); // This to HighLight both the Instances when Duplicates are found
								}else{
									seqNumbArray.push(seqNumber);
									seqNumbNodes.push(seqNumberNode);
								}
							}
							var mcid = $(this).attr('mc_id');
							var poa_mc_seq = selectedPOAIDsArray[i]+"_"+mcid+"_"+seqNumber;
							
							// Sequence Information Repository . Adding modifiedValue to unique poa_mc id
							var poaId = selectedPOAIDsArray[i];
							sequenceData[poaId][mcid].modifiedValue = seqNumber; 
							
							poa_mc_sequenceNumberArray[indexCount] = poa_mc_seq;
							indexCount++; // This counter ensures empty values are not part of the array
						}
				  });
				});
				if(hasDuplicates){
				//alert(POA_EDIT_LABELS["emxAWL.Alert.DuplicateValuesFound"]);
				var toContinue = confirm(POA_EDIT_LABELS['emxAWL.Alert.DuplicateValuesFound']);			
				if(toContinue == false){
					return;
				}
				}
				this.enableOrDisableHighlight(allSeqNumbNodes,invalidValueNodes); // passing all Nodes and Invalid Seq Numb Text-box Nodes
				if(invalidValueFound)
				{
					alert(POA_EDIT_LABELS['emxAWL.alert.PositiveNumerical']); //todo update property
					return;
				}
				reqArg["poa_mc_seqNumb"] = poa_mc_sequenceNumberArray;
				editInstance.ajaxExec("../resources/awl/db/poaservice/updateSequenceNumber", reqArg, this.seqNumberUpdated.bind(this, selectedPOAIDsArray, false), this.seqNumberUpdateFailureCallback.bind(this, selectedPOAIDsArray));
			} else {
				customEditUtil.WarningAlert(POA_EDIT_LABELS['emxAWL.POAEditView.NoUnSavedSequence']);
			}
		}

		this.seqNumbHighlightingOnLoad = function(){  // This function is to HighLight the Sequence Number Text-Box with Duplicate or Invalid Values
			var poaIds = $('.POAHeaderCell:not(.non-editable-poa)');
			var invalidValueNodes = [];
			var allSeqNumNodes = [];
			$(poaIds).each(function(i){
				var seqNumbArray = [];
				var seqNumbNodes = [];
			$('td[poa_id="'+$(poaIds[i]).attr('id')+'"]').each(function(j) {
				if(!$(this).hasClass('empty-artworkelement-cell')){
				 var seqNumberNode = $(this).find('div>input');
				 var seqNumber = $(seqNumberNode).val();
				 if(seqNumber != defaultSequenceNumber) { 
					 if(seqNumber<0 || isNaN(seqNumber)){
	
							invalidValueFound = true;
							invalidValueNodes.push(seqNumberNode);
						}
						else if(seqNumbArray.indexOf(seqNumber)!=-1){
							hasDuplicates = true;
							invalidValueNodes.push(seqNumberNode);
							//var existingNodeIndex = seqNumbArray.indexOf(seqNumber);
							invalidValueNodes.push(seqNumbNodes[seqNumbArray.indexOf(seqNumber)]); // This to HighLight both the Instances when Duplicates are found
						}else{
							seqNumbArray.push(seqNumber);
							seqNumbNodes.push(seqNumberNode);
						}
	
					}
				}
			  });
			});
			this.enableOrDisableHighlight(allSeqNumNodes,invalidValueNodes);
		}

		this.enableOrDisableHighlight = function(validSeqNums,invalidSeqNums) {
			// This function is to either HighLight a Sequence Number Text-box in red when data
			// is Duplicate, Empty Or Invalid and to disable these when valid data is updated.
			$(validSeqNums).each(function(i){
				$(this).removeClass('invalid-sequence-number');
			});

			$(invalidSeqNums).each(function(i) {
				$(this).addClass('invalid-sequence-number');
			});

		}

		this.resetSequenceNumber = function(){
			var selectedPOAIDsArray = getArrayofSelectedPoaIDs();
			var toContinue = confirm(POA_EDIT_LABELS['emxAWL.alert.ValuesOverridden']);
			if(toContinue == false){
				return;
			}

			var reqArg = {};

			var poa_mc_sequenceNumberArray = [];
			var emptyValueFound = false;
			var hasDuplicates = false;
			var indexCount = 0;
			var invalidValueNodes = [];
			var allSeqNumbNodes = [];

			$(selectedPOAIDsArray).each(function(i){
				var seqNumbArray = [];
				var elementCount = 1;
			$('td[poa_id="'+selectedPOAIDsArray[i]+'"]').each(function(j) {
				if(!$(this).hasClass('empty-artworkelement-cell')){
				 var seqNumbNode = $(this).find('div>input');
				 $(seqNumbNode).val(elementCount);
				 allSeqNumbNodes.push(seqNumbNode);
				 var mcid = $(this).attr('mc_id');
				 var poa_mc_seq = selectedPOAIDsArray[i]+"_"+mcid+"_"+elementCount;
				
				 // Sequence Information Repository . Adding modifiedValue to unique poa_mc id
				 var poaId = selectedPOAIDsArray[i];
				 if(sequenceData[poaId][mcid])
					sequenceData[poaId][mcid].modifiedValue = elementCount; 
				
				 poa_mc_sequenceNumberArray[indexCount] = poa_mc_seq;
				 indexCount++; // This counter ensures empty values are not part of the array
				 elementCount++;
				}
			  });
			});
			this.enableOrDisableHighlight(allSeqNumbNodes,invalidValueNodes);
			reqArg["poa_mc_seqNumb"] = poa_mc_sequenceNumberArray;
			isSeqNumChanged = true;
			editInstance.ajaxExec("../resources/awl/db/poaservice/updateSequenceNumber", reqArg, this.seqNumberUpdated.bind(this, selectedPOAIDsArray, true), this.seqNumberResetFailureCallback.bind(this, selectedPOAIDsArray) );
		}
		
		this.seqNumberUpdated = function (selectedPOAIds, isReset, data, arg_data) {
			/*if(data.result == "error"){
				alert(data.message);
				return;
			}*/
			for(var i=0; i<selectedPOAIds.length; i++) {
				var poaId = selectedPOAIds[i];
				var currentPOASequenceNumberInfo = sequenceData[poaId];
				for(var copyId in currentPOASequenceNumberInfo) {
					var copySequenceNumberInfo = currentPOASequenceNumberInfo[copyId];
					copySequenceNumberInfo.originalValue = copySequenceNumberInfo.modifiedValue;
					copySequenceNumberInfo.modifiedValue = undefined;
				}
				
				// Clear sequence modified css
				$("td[poa_id='"+poaId+"']").find(".sequence-number-modified").each(function(){
					$(this).removeClass('sequence-number-modified');
				});
				
				// Check for unsaved data
				updateSequenceNumberChangedFlag();
			}
			var alertMessage = isReset?POA_EDIT_LABELS["emxAWL.POAEditView.SequenceResetSuccess"]:POA_EDIT_LABELS["emxAWL.POAEditView.SequenceUpdateSuccess"]
			customEditUtil.SuccessAlert(alertMessage);
		}

		this.seqNumberResetFailureCallback = function(selectedPOAIds, response_data, request_data) {
			for(var i=0; i<selectedPOAIds.length; i++) {
				var poaId = selectedPOAIds[i];
				$("td[poa_id='"+poaId+"']").find(".seqNumberInputBox").each(function(){
					$(this).addClass('sequence-number-modified');
				});
			}
			customEditUtil.ErrorAlert(POA_EDIT_LABELS["emxAWL.POAEditView.SequenceUpdateFailed"])
		}
		
		this.seqNumberUpdateFailureCallback = function(selectedPOAIds, response_data, request_data) {
			//Need to add logic to sequence flag
			customEditUtil.ErrorAlert(POA_EDIT_LABELS['emxAWL.POAEditView.SequenceUpdateFailed']);
		}
		
		var orders = [1];
		this.sortBySequenceNumber = function(e) {
			var rows = [];
			var orderIndex = 0;
			var POAHeaderNode = $(e).closest('th.POAHeaderCell');
			var poaId = $(POAHeaderNode).attr('id');
			var sortIconNode = $(POAHeaderNode).find('.sortBySequenceOrder');
			var columnSorted = ($(sortIconNode).hasClass('up') || $(sortIconNode).hasClass('down')) && !($(sortIconNode).hasClass('diamond')); 
			//$('th').removeClass('sortedHeaderCell'); // Removing Highlighted color from all headers
			$('.sortBySequenceOrder').addClass('diamond'); // Hiding all POA/CL header sort icons
			$('#sortingOrderIcon').addClass('diamond'); // Hiding sort Icon of Type/Name column
		//	$('#sortOptionsContainer .selectable').removeClass('selected'); // For add/remove Type/Name selection

			if($(sortIconNode).hasClass('down') && orders[orderIndex]==-1){
				orders[orderIndex]=1;
			}else if($(sortIconNode).hasClass('up') && orders[orderIndex]==1){
				orders[orderIndex]=-1;
			}			
			//$(POAHeaderNode).addClass('sortedHeaderCell'); // Highlighting the currently selected Header
			//$(sortIconNode).css('display',"");
			if(columnSorted){
				$(sortIconNode).removeClass("diamond");
				$(sortIconNode).toggleClass("up");
				$(sortIconNode).toggleClass("down");
			}else {
				orders[orderIndex]=1;
				$(sortIconNode).removeClass("diamond");
				$(sortIconNode).addClass("up");
				$(sortIconNode).removeClass("down");
				
			}
			
			 $('#editTable>tbody>tr').each(function() {
				rows.push($(this));
			});
			 var rowsLength = rows.length;
			 rows.sort(function(a,b) {
				var firstValue = parseInt($(a).find('td.poaLanguaesCell[poa_id="'+poaId+'"]').find('.seqNumberInputBox').val());
				var secondValue = parseInt($(b).find('td.poaLanguaesCell[poa_id="'+poaId+'"]').find('.seqNumberInputBox').val());
				var firstTypeValue = $(a).find('td.element-type-cell').attr('mctype');
				var secondTypeValue = $(b).find('td.element-type-cell').attr('mctype') ;
				var firstInstanceSeqValue = parseInt($(a).find('td.poaLanguaesCell[poa_id="'+poaId+'"]').find('.instSeqData').text());
				var secondInstanceSeqValue = parseInt($(b).find('td.poaLanguaesCell[poa_id="'+poaId+'"]').find('.instSeqData').text()); 
				
				if(isNaN(firstValue) && !isNaN(secondValue) ){
					return 1;
				}else if(!isNaN(firstValue) && isNaN(secondValue) ){
					return -1;
				}else if(isNaN(firstValue) && isNaN(secondValue) ){
					return 0;
				}
				return (firstValue>secondValue)? orders[orderIndex] : firstValue!==secondValue? -orders[orderIndex] :
					(firstTypeValue>secondTypeValue) ? orders[orderIndex] : firstTypeValue!==secondTypeValue ? -orders[orderIndex] :
						(firstInstanceSeqValue>secondInstanceSeqValue) ? orders[orderIndex] : firstInstanceSeqValue!==secondInstanceSeqValue ? -orders[orderIndex] : 0 ; 
				
			 });
			 orders[orderIndex] *= -1 ;
			 while(rowsLength--){
				 $('#editTable>tbody').prepend(rows[rowsLength]);
			 }

		}

		 this.enableSequenceNumberEdit = function(e){
			var selectedNode = $(e.target); // todo should be editable only when both POA and COpy element is editable
			var poaId = $(selectedNode).closest('td').attr('poa_id');
			var poaHeaderNode = document.getElementById(poaId);
			var poaState = $(poaHeaderNode).attr('poa_state');
			if( (!isCopyListGlobal && poaState==POA_EDIT_LABELS['emxFramework.State.Draft']) || (isCopyListGlobal && poaState==POA_EDIT_LABELS['emxFramework.State.Preliminary'])){
				$(e.target).prop('readonly',false);
			}else{
				alert(POA_EDIT_LABELS['emxAWL.Alert.POANotEditable']);
				// Added to avoid the multiple alerts
				$(e.target).blur();
			}
			$(this).data('oldValue', $(this).val());
		}

		/*
			Function to handle the pre-save validation for sequence numbers.
			@author Raghavendra M J (R2J)
			@since VR2015x.HF17
		*/
		this.validateForDuplicateSequenceNumbers = function(e)
		{
			var selectedNode = $(e.target); // todo should be editable only when both POA and COpy element is editable
			var selectedNodeTDTag = $(selectedNode).closest('td');
			var poaId = selectedNodeTDTag.attr('poa_id');
			var mcId = $(selectedNode).closest('td').attr('mc_id');
			editCopyElementSequenceNumber.validateSequenceNumber(poaId);
			var currentValue = selectedNode.val();
			//if(currentValue<0 || isNaN(currentValue) || customEditUtil.isEmpty(currentValue) || (!isNaN(currentValue) && currentValue.toString().indexOf('.') != -1))
			if(customEditUtil.isEmpty(currentValue) || isNaN(currentValue) || currentValue<0 || currentValue.toString().indexOf('.') != -1)
			{
				e.target.value = $(selectedNode).data('oldValue');
				$(selectedNode).addClass('invalid-sequence-number');	
				alert(POA_EDIT_LABELS['emxAWL.alert.PositiveNumerical']);				
				setTimeout(function() { e.target.focus();}, 10);
				editCopyElementSequenceNumber.validateSequenceNumber(poaId);
				return;
			}
			if(sequenceData[poaId][mcId].originalValue != currentValue) {
				isSeqNumChanged = true;
				sequenceData[poaId][mcId].modifiedValue = currentValue;
				$(selectedNode).addClass('sequence-number-modified');
			} else {
				sequenceData[poaId][mcId].modifiedValue = undefined;
				$(selectedNode).removeClass('sequence-number-modified');
				isSeqNumChanged = false; //set Sequence Number Changed as false. We'll set this flag by iterating sequence data.
				
				//Set the flag based on the modified value in sequence data
				updateSequenceNumberChangedFlag();
			}
		}
		/*
			Function to validate for incorrect/duplicate sequence
			@author Raghavendra M J (R2J)
			@since VR2015x.HF17
		*/
		this.validateSequenceNumber = function(poaId)
		{
			var allElementsArray = $('td[poa_id="'+poaId+'"]').find("div>input");
			var inputValuesArray = new Array();
			var dupArray = new Array();
			$.each(allElementsArray, function(index, currentInpurBox)
			{
				var seqNumber =  currentInpurBox.value;
				if( seqNumber != defaultSequenceNumber ) {
					if( inputValuesArray.indexOf(seqNumber)==-1 )
					{
						inputValuesArray.push(seqNumber);
						$(currentInpurBox).removeClass('invalid-sequence-number');
					}
					else
						dupArray.push(currentInpurBox);
				} else {
					$(currentInpurBox).removeClass('invalid-sequence-number');
				}
			});

			$(dupArray).each(function(index, currentInpurBox) {
				var seqNumber =  currentInpurBox.value;
				$(allElementsArray).each(function(indx, box) {
					if(box.value == seqNumber)
						$(this).addClass('invalid-sequence-number');
				});
			});
		};
		
	}
})(jQuery);

