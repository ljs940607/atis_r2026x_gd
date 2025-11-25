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
	editNoteInstanceStandardPOA = new function() {
		this.notesUpdated = function () {
			if(data.result == "error"){
				alert(data.message);
				return;
			}
			
			var selectedCells = new Array();
			$.each(mcids,function(i,mcid) {
			$.each(selectedPOAIDsArray,function(index,value){
				selectedCells.push(customEditUtil.getCellId(mcid,value));
			});
			renderUIAfterModAssemnblyElement(selectedCells,"td[mc_id='"+mcid+"']");
			});
			var message = "";
			if(nonAssociatedPOANames && nonAssociatedPOANames.length > 0) {
				message = POA_EDIT_LABELS["emxAWL.Warning.PartialArtworkElementsAssocaition"] + ' ' + nonAssociatedPOANames +"\n";
			}
			message += POA_EDIT_LABELS['emxAWL.Alert.NotesUpdatedSuccessfully'];
			alert(message);
		};			
		
		this.editNote = function (cmd) {
			var selectedPOAIDsArray=getArrayofSelectedPoaIDs();
			if( selectedPOAIDsArray.length <=0 ) {
				alert(POA_EDIT_LABELS["emxAWL.POAEdit.SelectSinglePOA"]);
				return;
			}
			if(isSeqNumChanged) {
				var confirmValue = confirm(POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquence'])
				if(!confirmValue) {
					return;
				}
				isSeqNumChanged=false;
			}

			var isArtworkMasterAssociated = false;
			var arrayLength = selectedPOAIDsArray.length;
			var nonAssociatedPOANames = [];
			$('tr td div.selected').each(function() { 
			var poaNames = editInstance.isArtworkMasterConnectedtoPOA(selectedPOAIDsArray, $(this).closest('td').attr('mcid'));
			nonAssociatedPOANames.push(poaNames);
			if(arrayLength != poaNames.length) {
				isArtworkMasterAssociated=true;
			} });
					if(!isArtworkMasterAssociated){
				alert(POA_EDIT_LABELS["emxAWL.Alert.NoElementAssociatedToPOA"]);
						return;
					}
					var langData={};
                    var langDataForDisplay={};
					var mcids = [];
					$('tr td div.selected').each(function(i) {  
			var mcid = $(this).closest('td').attr('mcid');
			mcids[i]=mcid;
			var trElem = $(this).closest('tr');
			var isGraphic=trElem.data('isGraphic');
			var isInline=trElem.data('isInline');  	
			
			var lc_ids="";
			var langNamesStr="";
			var allLanguagesArray=[];
			var lang_names="";
			for (var i = 0; i < arrayLength; i++) {
				poaID=selectedPOAIDsArray[i];
				
				var tdid="mc_poa" + mcid + "_" + poaID;
	
				var tdCell=$("td[id='" + tdid + "']");
				var  isEmptyeCells = typeof tdCell.attr("lang_names") == "undefined" || tdCell.attr("lang_names") === "";

				if(!isEmptyeCells)
				{
					lc_ids=tdCell.attr("lc_ids").split(",");
					langNamesStr=tdCell.attr("lang_names");
				}
				
				if(isInline || isGraphic){					
					if(isInline ){						
						lang_names=langNamesStr.split("|");
                        if(lang_names!="" && lang_names!='undefined'){
						for(var j=0; j<lang_names.length; j++)
						{
							var langName=lang_names[j];
							var langarray=langData[langName];
							if(langarray==null)langarray=[];
							langarray.push(poaID + '|' + lc_ids[j] );
							langData[langName]=langarray;
                            langDataForDisplay[langName]="_isInline";
						}
                            }
					}else{
						langName='singleElement';
						if(langData[langName]==null)
							langData[langName]=[];
						if(isGraphic){
							langData[langName].push(poaID + '|' + mcid );
                            langDataForDisplay[langName]="_isGraphic";
                            }
						else
							langData[langName].push(poaID + '|' + lc_ids[0] );
					}
				}
				else if(!isEmptyeCells){
					lang_names=langNamesStr.split(",");
					for(var j=0; j<lang_names.length; j++)
					{
						var langName=lang_names[j];
						var langarray=langData[langName];
						if(langarray==null)langarray=[];
						langarray.push(poaID + '|' + lc_ids[j] );
						langData[langName]=langarray;
                        langDataForDisplay[langName]="_isGeneric";
					}
				}
			}
					});


               var newArray = [];
$(nonAssociatedPOANames).each(function(i,value) {
   newArray= newArray.concat(value);
}); 
             nonAssociatedPOANames = $.distinct(newArray);

					
					
			var buttonsConfig = [
						{
							text: POA_EDIT_LABELS['emxFramework.RTE.Tooltip.OK'],
							click: function() {
									var poaLcArr=[];
									var selectedTDs=$(this).find(".selected>td");
										if(selectedTDs.length<=0)
										{
											alert(POA_EDIT_LABELS['emxAWL.EditNote.SelectLanguage']); 
											return;
										}
										selectedTDs.each(function(){ 
											poaLcArr=poaLcArr.concat($(this).data("poa_lc")); 
										});
													
										var reqArg={};
										reqArg["notes"]=$("#editedNotes").val();
													
										if(reqArg["notes"]==null || reqArg["notes"]==""){
										if(!confirm(POA_EDIT_LABELS['emxAWL.EditNote.Confirmation']))
										return;
										}
										reqArg["poaLcData"]=poaLcArr;
										editInstance.ajaxExec("../resources/awl/db/poaservice/updateNotes", reqArg, 
										function (data, arg_data) {
											if(data.result == "error"){
												alert(data.message);
												return;
											}
									
									
									$.each(mcids,function(i,mcid) {
										var selectedCells = new Array();
										$.each(selectedPOAIDsArray,function(index,value){
											selectedCells.push(customEditUtil.getCellId(mcid,value));
										});
										renderUIAfterModAssemnblyElement(selectedCells,"td[mc_id='"+mcid+"']");
									});
									var message = "";
									if(nonAssociatedPOANames && nonAssociatedPOANames.length > 0) {
										message = POA_EDIT_LABELS["emxAWL.Warning.PartialArtworkElementsAssocaition"] + ' ' + nonAssociatedPOANames +"\n";
									}
									/* SUG-R2J  Is not required as per suggestion needs to be implemented
									$(selectedCells).each(function(index, currentId){
										$("td[id='" + currentId + "']").effect( "highlight", {color:"#005686"}, 3000 );
									}); */
									customEditUtil.SuccessAlert(POA_EDIT_LABELS["emxAWL.Alert.NotesUpdatedSuccessfully"]);
								}, 
								function(){alert(POA_EDIT_LABELS['emxAWL.EditNote.Error'])});					  
							  $(this).dialog('destroy').remove();
								}
							},
							{
								text: POA_EDIT_LABELS['emxCommonButton.Cancel'],
								click: function() {
								$(this).dialog('destroy').remove();
								},
							}
						];
					$('<div></div>').dialog({
							modal: true,
							title: POA_EDIT_LABELS['emxAWL.Label.EditNote'], //+"[" + trElem.data('copytype') + "]",
							open: function () {
									var selAllElem=$("<p/>").addClass("noteselall selectable selected").html(POA_EDIT_LABELS['emxAWL.Label.SelectAll']).appendTo(this);
									selAllElem.click(function(){
										$(this).toggleClass('selected');
										if($(this).hasClass('selected'))
											$(".notelang.selectable").addClass('selected');
										else
											$(".notelang.selectable").removeClass('selected');
									});

									var table=$("<table/>").appendTo(this);

									for(var langName in langData)
									{
										var langType = langDataForDisplay[langName];
										var tr=$("<tr/>").addClass("notelang selectable selected").click(function(){
												$(this).toggleClass("selected");
												$(".noteselall").removeClass("selected");
												if($('.notelang.selectable').length==$('.notelang.selected').length)
													$(".noteselall").addClass("selected");
											}).appendTo(table);
										if(langType==="_isGraphic"){
										var td=$("<td/>").html(POA_EDIT_LABELS['emxAWL.Label.GraphicElementType']).data("poa_lc", langData[langName]).appendTo(tr);
											}
										else if(langType=="_isInline"){
											var td=$("<td/>").html("["+langName+"]").data("poa_lc", langData[langName]).appendTo(tr);
										}
										else if(langType==="_isGeneric"){
											var td=$("<td/>").html(langName).data("poa_lc", langData[langName]).appendTo(tr);
										}
									}
								var p=$("<p/>").appendTo(this);
								p.append($("<label/>"));
								p.html(POA_EDIT_LABELS['emxAWL.Label.Note']).appendTo(this);
								var textarea=$("<textarea/>").attr("id", "editedNotes");

								$(this).append(textarea);

							},
							closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
							buttons: buttonsConfig
					}); // end confirm dialog
		};
	};
})(jQuery);

