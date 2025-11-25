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
CopyList_Edit_Instance = new function(){
 
//############### Toolbar related Code ################
	/* Overridden:API to create command specific to Copy List.
	1)	Copy List selection  based
		a.	Countries/Languages
		b.	Add Artwork Elements
		c.	Create new AE/GC
	2)	Element/Copy List selection based
		a.	Remove
		b.	Define Mandatory Elements
	3)	Cell selection based
		a.	Local Copies/Languages
	4)	Always present in the toolbar
		a.	6W Tag filtering
		b.	Copy
		c.	Add/remove Copy List
		d.	Clear Selection

	*/
	this.urlParameterKey = "copyListId";
	this.createContextToolbar = function (element) {
		'use strict';
		//TODO TVT
		var copyScreenCategories = new Array();
		var copyListSelectionBased = [{id:"addArtworkMaster", label:POA_EDIT_LABELS["emxAWL.Label.ModifyAssemblyMasters"]},
										{id:"removeArtworkMaster",label:POA_EDIT_LABELS["emxAWL.Command.Remove"]},
										{id:"addExistingElem", label: POA_EDIT_LABELS["emxAWL.ActionLink.AddExistingElements"]},
										{id:"manageCountryLanguages", label:POA_EDIT_LABELS["emxAWL.Label.ManageCountryLanguage"]}
									 ];
								
		var elemOrCLSelBased = [ {id:"defineMandatoryElements", label:POA_EDIT_LABELS["emxAWL.Label.DefineMandaElements"]}
							   ];
	 var addRemoveMenus = [ {id:"addCopyList", label:POA_EDIT_LABELS["emxAWL.Label.AddPOA"]},
									{id:"removeCopyList", label:POA_EDIT_LABELS["emxAWL.Label.RemovePOA"]}
							   ];
	 var artworkSelBasedMenu = [ {id:"editNote",label:POA_EDIT_LABELS["emxAWL.Label.EditNote"]},
	 			     {id:"editInstanceSequence",label:POA_EDIT_LABELS["emxAWL.Label.EditInstanceSequence"]},
	 			     {id:"resequenceElements", label:POA_EDIT_LABELS["emxAWL.Label.ReSequenceCopyElements"]},
	 			     {id:"saveSequenceNumber", label:POA_EDIT_LABELS["emxAWL.Tooltip.SaveSequence"]}													  
	 			     	];
												
		copyScreenCategories.push(copyListSelectionBased);							   
		copyScreenCategories.push(elemOrCLSelBased);
	    copyScreenCategories.push(artworkSelBasedMenu);
	    copyScreenCategories.push(addRemoveMenus);

		$(copyScreenCategories).each(function(){
			$(this).each(function(){
				$(element).append(editInstance.getToolbarCommand(this.id,this.label)).append("&nbsp;");
			});
			var separator = $("<span>").addClass("separator");
			$(element).append(separator).append("&nbsp;");
		});
	};
	
	//Overridden: Global Context menu is not required for Copy List
	/*this.getCtxMenuTop=function()
	{
		'use strict';
		return "";
	};*/
	//Overridden: Context menu per row is not required for Copy List, instead only remove menu is required.
	this.getCtxMenu = function()
	{	
		'use strict';
		//TODO Addition of remove menu.	
		var ctxmenu=$("<nav />");
		ctxmenu.addClass("copyListRemove");
		ctxmenu.attr("title",POA_EDIT_LABELS['emxAWL.Command.Remove'] );
		ctxmenu.click(function(){ addRemoveMaster.removeArtworkMaster(this); });
		return ctxmenu;
	};

//############### Table Header Related Code ################
	//Overridden: Function to get Copy List Header data, these will be displayed on header of dynamic columns.
	this.getDynamicColumnHeaderData = function(copyListIds){
		'use strict';
		return getSyncJSON("../resources/awl/view/copylist/getcopylistheaderdata", "CopyListIds="+copyListIds);
	};
	
	//Overridden: Function to get Master Copy Data for static columns of Copy List.
	this.getMasterCopyData = function(copyListIds){
		'use strict';
		return getSyncJSON("../resources/awl/view/copylist/getcopylistmastercopyData", "CopyListIds="+copyListIds);
	};

	//Overridden:Function to get Element Matrix Data of Copy List
	this.getElementMatrixData = function(copyListIds){
		'use strict';
		return getSyncJSON("../resources/awl/view/copylist/getcopylisteditdata", "CopyListIds="+copyListIds);
	};
	
	//Overridden:To add artwork usage in Copy List header with ellipsis also register event on click of language.
	this.getArtworkUsageInfo=function(POA_Info){
		'use strict';
	    var artworkUsageSpan = $('<span></span>');	    
		$(artworkUsageSpan).attr("style","font-size:small;font-weight:normal;");
		var artworkUsageString = "";
		var artworkUsages=Array();

		var artworkUsage_Info = POA_Info.ArtworkUsage;
		$(artworkUsage_Info).each(function (index){
			var eachArtworkUsage = artworkUsage_Info[index];
			artworkUsages.push(eachArtworkUsage);
			artworkUsageString = artworkUsageString + eachArtworkUsage;
			if(index < (artworkUsage_Info.length-1))
				artworkUsageString = artworkUsageString+",";				
			});
			if(artworkUsageString && artworkUsageString.length > 0){
				//To show dialog if its as ellipsis
				if ( artworkUsageString.length >= 20 ){
					//creating ellipsis and returning truncated string
					artworkUsageString = artworkUsageString.substr(0,20) +"...";
					$(artworkUsageSpan).addClass("ellipsis_ArtworkUsage");
				}
				$(artworkUsageSpan).append(artworkUsageString);
				$(artworkUsageSpan).attr({ "artworkUsage": JSON.stringify(artworkUsages)});
				$(artworkUsageSpan).addClass("poaLabel");
				
			}
		return artworkUsageSpan;
		};
	
	//Overridden:POA Artwork Usage Ellipsis Handler :To show Artwork Usage
	this.poaArtworkUsageEllipsis = function(e){
		'use strict';
		//Call common API to create Dialog for Artwork Usage
		var clickedSpan=e.target;
		var poaName = clickedSpan.parentElement.childNodes[0].textContent;
		editInstance.createSigleColumnEllipsisDialog(e,poaName,'artworkUsage');	
	};
	
	//Overridden: To add languages in Copy List header with ellipsis also register event on click of language.
	//Note Sequence number is not required for Copy List languages
	this.poaLangaugesWithEllipsis = function(languageIdsList,languageNamesList,languageSeqList){
		'use strict';
		if(languageNamesList.length > 0 ){
			languageNamesList.sort();
		    	var langSpan = $('<span></span>');	    
			$(langSpan).attr("style","font-size:small;font-weight:normal;");
			var ellipsisEnable=false;
			var languageNamesString = "";
			var langNames=Array();
			//var sequenceArray=Array();
			$.each(languageNamesList,function(index,value){
				//sequenceArray.push(languageSeqList[index]);
				langNames.push(value);
				
				if(index < 3){
					languageNamesString = languageNamesString + value;
					if(index < (languageNamesList.length-1))
						languageNamesString = languageNamesString+",";
				}
				else if(!ellipsisEnable){
					var extraLangs = languageNamesList.length - 3;
					languageNamesString = languageNamesString+"+"+extraLangs;
					ellipsisEnable=true;
				}
			});
			if(languageNamesString && languageNamesString.length > 0){
				$(langSpan).append(languageNamesString);
				$(langSpan).attr({ "lang_names": langNames,"lang_ids": languageIdsList});
				$(langSpan).addClass("langSpan");
				if(ellipsisEnable)
				{	
					$(langSpan).addClass("ellipsis_POA_lang");
				}
			}
		return langSpan;
		}
		else{ return "";}
	};
	//Overridden: Function to get Copy List Header Name, these will be displayed on header of dynamic columns.
	this.getDisplayName = function (name) {
		'use strict';
		if ( name.length >= 20 ){
			//creating ellipsis and returning special html
			var label = $("<label>");//.addClass("lengthyCLName"); TODO Remove handler and css
			label.attr("title",name);
			label.attr("actualname",name);
			label.append(name.substr(0,20) +"...");
			return label;
		}
		else {
			return name;
		}
	};
	//Overridden: On click of header languages ellipsis will show dialog with all languages. 
	this.getDialogContentForPOALanguages =function(poaLangTable, clickedSpan){
		'use strict';
		var thead = $("<thead ></thead>");
		var theadRow = $("<tr></tr>");

		var thLanguage=$("<th>"+POA_EDIT_LABELS['emxAWL.common.Languages']+"</th>");
		$(thLanguage).attr("style","background: #368ec4;width: 50%");
		$(theadRow).append(thLanguage);
		$(thead).append(theadRow);
		$(poaLangTable).append(thead);
		
		var langTableBody = $('<tbody></tbody>');
		$.each($(clickedSpan).attr('lang_names').split(","), function( index,langName) {
			var eachLangNewRow = $('<tr></tr>');
			var eachLangNameCell = $('<td>'+langName+'</td>');
			$(eachLangNewRow).append(eachLangNameCell);
			$(langTableBody).append(eachLangNewRow);
		});
		$(poaLangTable).append(langTableBody);
		
		return poaLangTable;
		
	};

//############### Table Rows Related Code ################
	//Overridden:Get the Local Copy Dialog Columns Header
	this.getLCDialogColumnsHeader = function(theadRow){
		'use strict';
		$(theadRow).append($("<th>" +POA_EDIT_LABELS['emxAWL.Label.IsMandatory']+"</th>"));		
		$(theadRow).append($("<th>" +POA_EDIT_LABELS['emxAWL.Label.Notes']+"</th>"));
		};
	
	//Overridden:Get the Local Copy Dialog Columns
	this.getLCDialogColumns = function(eachLangNewRow,lc_info,clickedSpan,index){
		'use strict';
		var langMandInfo = $(clickedSpan).attr('lc_mandIds').split(",");
		if( langMandInfo && langMandInfo[index] && langMandInfo[index] == 1)
			$(eachLangNewRow).append($("<td/>").html(POA_EDIT_LABELS['emxAWL.Label.Range.Yes']));
		else
			$(eachLangNewRow).append($("<td/>").html(POA_EDIT_LABELS['emxAWL.Label.Range.No']));
		
		var eachLCNotesCell = $("<td/>").html(lc_info.Notes)
		$(eachLangNewRow).append(eachLCNotesCell);
		};
			
	//Overridden:Get the Local Copy Dialog Body
	this.getLCDialogBodyData = function(clickedSpan){
			'use strict';
			return  getSyncJSON("../resources/awl/view/artworkelement/getcopycontent", "selArtworkContentIds="+$(clickedSpan).attr('lc_ids')+"&poaId=" + $(clickedSpan).closest("td").attr("poa_id")+"&type=CopyList");
		}
		
		

//Overridden:Create Cell of Local copy details for give Master copy and POA 
this.addMCA_POACell = function (isGraphic,copyId,poaId,localCopyInfo,eachNewCell,isInline){
		'use strict';
		var strMsgToolTipLanguage= POA_EDIT_LABELS["emxAWL.common.Languages"]; 
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
		//local variables declaration and initialization
		var langIds=Array();
		var langNames=Array();
		var lcIds=Array();
		var lcMandIds=Array();
		var lc_currentstate= Array();
		var isStructuredElementArray= Array();
		
		var langSpan = $('<span></span>');
		var inlineRevision = "";
		var higherRevisionExistIcon = "<img id='img' src='../common/images/I_A-newer-revision-exists.png' title='"+POA_EDIT_LABELS['emxAWL.Tooltip.OneOrMoreLocalCopies']+"' class='localrevisionImg'' /></img>";
		//Language details if not graphic element
		if(!isGraphic)
		{
			var ellipsisEnable=false;
			var languageNames="";
			var isLatestLCRevisionExist = false;
			$(lc_lang_Info).each(function (index){
				var eachLocalCopy = lc_lang_Info[index];
				lcIds.push(eachLocalCopy.id);
				langIds.push(eachLocalCopy.languageid);
				var langName = eachLocalCopy.languagename;
				langNames.push(langName);
				lcMandIds.push(eachLocalCopy.languageMand);
				lc_currentstate.push(eachLocalCopy.lc_currentstate);
				isStructuredElementArray.push(eachLocalCopy.StructuredElementType);
				inlineRevision = eachLocalCopy.Revision;
				//class langMand
				if(eachLocalCopy.languageMand == '1'){
					langName = editInstance.IMAGE_TAG +"<b>"+langName+"</b>";
				}
				//Code to show ellipsis
				if(index < 3)
				{
					languageNames = languageNames+langName;
					if(!isInline){
						languageNames = languageNames;
						if(eachLocalCopy.isLatestLCRevisionExist)
							isLatestLCRevisionExist = true;
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
			if(languageNames && languageNames.length > 0){
				languageNames = isLatestLCRevisionExist? higherRevisionExistIcon +" "+languageNames: languageNames;
				if(isInline) {
					langSpan.addClass("langSpan ellipsis_LC").html("["+languageNames+"]").attr("lang_names", langNames).attr("lc_ids", lcIds).attr("lc_mandIds", lcMandIds).attr("lc_currentstate", lc_currentstate);
				}
				else{
					langSpan.addClass("langSpan ellipsis_LC").html(languageNames).attr("lang_names", langNames).attr("lc_ids", lcIds).attr("lc_mandIds", lcMandIds).attr("lc_currentstate", lc_currentstate);
				}
				langSpan.attr("isStructuredElementArray", isStructuredElementArray);
			}
			$(eachNewCell).attr("lang_ids", langIds);
			$(eachNewCell).attr("lang_names", langNames);
			$(eachNewCell).attr("lc_ids", lcIds);
		}
		//For Copy List connected graphic element need to show as connected.
		if(isGraphic && $(lc_lang_Info).length > 0)
		{
			var associated =POA_EDIT_LABELS["emxAWL.Label.Associated"];
			if(lc_lang_Info[0].languageMand ==1){
				associated = editInstance.IMAGE_TAG +associated;
			} 
			lcMandIds.push(lc_lang_Info[0].languageMand);
			lc_currentstate.push(lc_lang_Info[0].lc_currentstate);
			lcIds.push(lc_lang_Info[0].id);
			$(langSpan).append(associated).css('display','block');
		}
		
		$(eachNewCell).append("<br />");
		$(eachNewCell).append(langSpan);
		
		if(isGraphic && localCopyInfo["InstSeq"] && $(lc_lang_Info).length > 0){
			var insSeqSpan = $('<span/>').addClass("instSeqData").attr("title", POA_EDIT_LABELS["emxAWL.Label.InstanceSequence"]);
			//insSeqSpan.tooltip();
			$(insSeqSpan).html(localCopyInfo["InstSeq"]);
			$(eachNewCell).append(insSeqSpan);
			
			var seqNumberSpan = $('<div/>').addClass('seqNumberContainer');
			var inputTextbox = $('<input/>').attr({class:'seqNumberInputBox', type:'text'})
																	.prop('readonly','true').val(localCopyInfo["seqNumb"]);
			if(isMobileOrTabletDevice()){
				$(inputTextbox).attr({style :"width:40px"});
			}
			inputTextbox.on('change', editCopyElementSequenceNumber.validateForDuplicateSequenceNumbers);			
			seqNumberSpan.append(inputTextbox);
			$(eachNewCell).append(seqNumberSpan); // appending Seq Number input box
		}  else if(!isGraphic &$(lc_lang_Info).length > 0 ) {
			var insSeqSpan = $('<span/>').addClass("instSeqData").attr("title", POA_EDIT_LABELS["emxAWL.Label.InstanceSequence"]);
			//insSeqSpan.tooltip();
			$(insSeqSpan).html(localCopyInfo["InstSeq"]);
			$(eachNewCell).append(insSeqSpan);
			
			var seqNumberSpan = $('<div/>').addClass('seqNumberContainer');
			var inputTextbox = $('<input/>').attr({class:'seqNumberInputBox', type:'text'})
																	.prop('readonly','true').val(localCopyInfo["seqNumb"]);
			if(isMobileOrTabletDevice()){
				$(inputTextbox).attr({style :"width:40px"});
			}
			inputTextbox.on('change', editCopyElementSequenceNumber.validateForDuplicateSequenceNumbers);			
			seqNumberSpan.append(inputTextbox);
			$(eachNewCell).append(seqNumberSpan); // appending Seq Number input box
		}
		
		if(localCopyInfo["hasNotesOnAnyElement"] == true){
			var iconDiv = $("<span/>").attr("class","notes-icon");
			iconDiv.attr("title",POA_EDIT_LABELS['emxAWL.Label.Notes']);
			iconDiv.attr("id","editNotesSpan");
			iconDiv.data("localLanguageNotesMap", localCopyInfo["localLanguageNotesMap"]);
			//iconDiv.tooltip();
			$(eachNewCell).append(iconDiv);
		}			

		
		$(eachNewCell).attr("lc_mandIds", lcMandIds);
		$(eachNewCell).attr("lc_ids", lcIds);			
		$(eachNewCell).attr("lc_currentstate", lc_currentstate);
		
		
		$(eachNewCell).addClass("changable_LC");
		$(eachNewCell).attr("selectable","true");
		
		return eachNewCell;
		
		
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
				//check if span exists. span will not be there first time or after page refresh.
				
				var checkLangSpan =$("td[id='" + cellId + "']").find('span');
				if(checkLangSpan.length <= 0){
					var poaName = $("th[id='" + value + "']").find('p.poaName').text();
					poaNames.push(poaName);	
				}
				//Note: its note else block, its separate check.
				//if we add and remove element in edit page, then empty span will be added for that <td> in addMCA_POACell() API. hence we need 2 checks
				if(checkLangSpan.length > 0){
					var checkSpanContent = $(checkLangSpan).html();
					
					//If empty span, then master is not connected with Copy List and is effect of modification
					if(checkSpanContent.length  <= 0)
					{
						var poaName = $("th[id='" + value + "']").find('p.poaName').text();
						poaNames.push(poaName);	
					}
				}
				
			});
			return poaNames;
		};
	
	//TEMPORARY TO BE REMOVED AFTER DEMO.....Common API to generate HTML code for command.
	/*this.getToolbarCommand = function(id,title){
		'use strict';
		var span = $("<span>").addClass("btn btn-default poa-edit-toolbar").attr("style","background-color:white !important;");
		//var asModButton= $('<image/>');
		span.attr("id",id);
		span.attr("title", title);
		span.tooltip();
		span.attr("class","btn btn-default poa-edit-toolbar "+ id); // testing -- added for TVT Check
		return span;
	};*/
		
	//Overriden to show Local Copy cell values after adding artwork Master in CopyList Edit page
	 this.getLocalCopyInfo=function(poaIdArr,copyId){
		return  getSyncJSON("../resources/awl/view/artworkmaster/getlocalcopiesforcopylists", "CopyListIds="+poaIdArr+"&mca_id="+copyId);
	 };
	 
	 /*
		This function will return the URL to fetch the latest UI data. 
	 */
	 this.getUpdatedUIInfo = function(selectedCells){
		return getSyncJSON("../resources/awl/view/copylist/getlocalcopiesinfo", "mca_POAInfo="	+ selectedCells);
	};
	
	/*
		This function will return id of command to be enabled after click of cell on poaedit page.
		TODO : this function may be modified to return array of commands. 
	*/
	this.getCellClickEnabledCommandId = function(){
		return "#defineMandatoryElements";
	};
	
	this.getRevisionUpdateURL = function(){
		return "../resources/awl/db/copylist/updateLocalCopies";
	};
};
})(jQuery);
