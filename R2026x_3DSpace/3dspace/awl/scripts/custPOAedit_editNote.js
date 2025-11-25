(function($){
	editNoteInstanceCustPOA = new function() {
		this.editNote = function (cmd) {
			var selectedPOAIDsArray=getArrayofSelectedPoaIDs();
			if( selectedPOAIDsArray.length <=0 ) {
				alert(POA_EDIT_LABELS["emxAWL.POAEdit.SelectSinglePOA"]);
				return;
			}
            
            var isArtworkMasterAssociated = false;
			var arrayLength = selectedPOAIDsArray.length;
			var nonAssociatedPOANames = [];
            $('tr td div.selected').each(function() {
			/*var mcid=$(cmd).closest("td").attr("mcid");*/
			var poaNames = editInstance.isArtworkMasterConnectedtoPOA(selectedPOAIDsArray, $(this).closest('td').attr('mcid'));
			nonAssociatedPOANames.push(poaNames);
            if(arrayLength != poaNames.length) {
				isArtworkMasterAssociated=true;
			} });
					if(!isArtworkMasterAssociated){
						return;
					}
            var langData={};
            var langDataForDisplay={};
            var mcids = [];
            
             $('tr td div.selected').each(function(i) {
            var mcid = $(this).closest('td').attr('mcid');
            var mcid = $(this).closest('td').attr('mcid');
			mcids[i]=mcid;
			var trElem=$(this).closest("tr");
			var isGraphic=trElem.data('isGraphic');
			var isInline=trElem.data('isInline');
			
			var langNamesArr=[];
			var langIdsArr=[];
                 var lcids="";
                 var langNamesStr = "";
                 var lang_names= "";
			for (var i = 0; i < arrayLength; i++) {
				poaID=selectedPOAIDsArray[i];
				
				var tdid="mc_poa" + mcid + "_" + poaID;
	
				var tdCell=$("td[id='" + tdid + "']");
				var isEmptyCells = typeof tdCell.attr("lang_names") == "undefined" || tdCell.attr("lang_names") === "";
					if(!isEmptyCells){
				 langNamesStr=tdCell.attr("lang_names");
				 lang_names=langNamesStr.split(",");
				 lc_ids=tdCell.attr("lc_ids").split(",");
                    }
	
				if(isInline || isGraphic){					
					if(isInline && customEditUtil.isCustomModifyPOA(poaID)){						
						lang_names=langNamesStr.split("|");
						for(var j=0; j<lang_names.length; j++)
						{
							var langName=lang_names[j];
							var langarray=langData[langName];
							if(langarray==null)langarray=[];
							langarray.push(poaID + '|' + lc_ids[j] );
							langData[langName]=langarray;
                            langDataForDisplay[langName]="_isInline";
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
				else{
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
				//console.log(langData);
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
										reqArg["notes"]=$("#Notes").val();
													
										if(reqArg["notes"]==null || reqArg["notes"]==""){
										if(!confirm(POA_EDIT_LABELS['emxAWL.EditNote.Confirmation']))
										return;
										}
										reqArg["poaLcData"]=poaLcArr;
													
										//console.log(reqArg)
													
										editInstance.ajaxExec("../resources/awl/db/poaservice/updateNotes", reqArg, 
																function(){
                                                                    $.each(mcids,function(i,mcid) { 
                                                                    	var selectedCells = new Array();
																	$.each(selectedPOAIDsArray,function(index,value){
																		selectedCells.push(customEditUtil.getCellId(mcid,value));
																	});	renderUIAfterModAssemnblyElement(selectedCells,"td[mc_id='"+mcid+"']");
                                                                        });
																	var message = "";
																	if(nonAssociatedPOANames && nonAssociatedPOANames.length > 0) {
																		message = POA_EDIT_LABELS["emxAWL.Warning.PartialArtworkElementsAssocaition"] + ' ' + nonAssociatedPOANames +"\n";
																	}
																	message += POA_EDIT_LABELS['emxAWL.Alert.NotesUpdatedSuccessfully'];
																	alert(message);
																	},
																	function(){
														alert(POA_EDIT_LABELS['emxAWL.EditNote.Error'])});
													
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
					title: POA_EDIT_LABELS['emxAWL.Label.EditNote'], // +"[" + trElem.data('copytype') + "]",
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
                                else if(langType==="_isGeneric"){
                                    var td=$("<td/>").html(langName).data("poa_lc", langData[langName]).appendTo(tr);
                                }
                                else if(langType=="_isInline"){
                                     var td=$("<td/>").html("["+langName+"]").data("poa_lc", langData[langName]).appendTo(tr);
                                }
								/*var td=$("<td/>").html(langPrefix+langName+langSuffix).data("poa_lc", langData[langName]).appendTo(tr);*/
							}
						
	
						var p=$("<p/>").appendTo(this);
						p.append($("<label/>"));
						p.html(POA_EDIT_LABELS['emxAWL.Label.Note']).appendTo(this);			    	
						var textarea=$("<textarea/>").attr("id", "Notes");
						
						$(this).append(textarea);
						
					},
					closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
					buttons: buttonsConfig
			}); // end confirm dialog
		};
	};
})(jQuery);

