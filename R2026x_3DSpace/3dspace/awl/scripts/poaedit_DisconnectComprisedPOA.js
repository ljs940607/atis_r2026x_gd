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
poaDisconnectComprised = new function (){
	//Handler To disconnect comprised POA from  Custmization POA. This command is only for single POA select
	this.disconnectComprisedPOAHandler = function() {
		'use strict';
		
		//Only single POA selection is allowed.
		var selectedPOAId = customEditUtil.getSelectedPOAs();
		if(selectedPOAId.indexOf(",") != -1){
			alert(POA_EDIT_LABELS['emxAWL.Message.SelectSingleHeaderObject'])
		}
		else{
			//Get comprised POA info to show on slidein page.
			var comprisedPOAInforMap = getSyncJSON("../resources/awl/view/customizationpoa/getcomprisedpoaInfo", "customizationPOAId="+selectedPOAId);
			//Show message if customization POA doesnt have any connected POAs.
			if(Object.keys(comprisedPOAInforMap).length == 0){
				alert(POA_EDIT_LABELS['emxAWL.CustomizedPOA.POANotConnected']);
				return true;
			}
			//Decide size of sliden div 
			var width = $("#workingPane").width();
			var docWidth = $(window).width();
			var perc = (width)/docWidth; 
			if(perc>0.8){
				greyOutWorkingArea("70%");
			}
			else{
				enableWorkingArea();
			}
			
			//Create GUI for disconnect POA slidein
			var slideInTable = $("<table/>");
			slideInTable.attr("id","poaSlideinTable");
			var tableHeaderRow = $("<tr/>");
			tableHeaderRow.attr("class","slideInTableHeader");
			
			var headerCell = $("<td/>");
			headerCell.text(POA_EDIT_LABELS['emxAWL.Action.DisconnectComprisedPOA']);
			tableHeaderRow.append(headerCell);
			
			var treeActionBarCell = $("<td/>").attr("class","tree-action-bar").attr("valign","right");
			var closeButton = $("<image/>").attr("class","btn btn-default poa-edit-toolbar").attr("id","closeSlideIn").attr("onclick","closeSlideInWindow()").attr("title",POA_EDIT_LABELS['emxCommonButton.Close']);
			//closeButton.tooltip();
			treeActionBarCell.append(closeButton);
			tableHeaderRow.append(treeActionBarCell);
			slideInTable.append(tableHeaderRow);
			
			var headerRow1 = $("<tr>").addClass("slidein-sub-header");
			var nameCell = $("<td>");
			var descriptionCell = $("<td>");
			
			$(nameCell).append(POA_EDIT_LABELS['emxFramework.Basic.Name']);
			$(descriptionCell).append(POA_EDIT_LABELS['emxFramework.Basic.Description']);
			headerRow1.append(nameCell);
			headerRow1.append(descriptionCell);
			slideInTable.append(headerRow1);
			var contentRow = $("<tr>").addClass("remove-poa-slidein-content-row");
			var contentCell = $("<td>").addClass("remove-poa-slidein-content-cell").attr("colspan","2");
			var contentDiv = $("<div>").addClass("remove-poa-slidein-content-div");
			
			$.each(comprisedPOAInforMap, function(poaId, poaData) {
				var eachNewPOA = $("<span>").addClass("remove-slidein-poa-span");
				var nameIconDiv = $("<div>").addClass("remove-slidein-poa-name");
				var removPOAicon = $('<img>').attr('CusPOAId',selectedPOAId).attr('POAToRemoveId',poaId).attr('class', 'removeConnectedPOA').attr('src','../common/images/iconActionCancel.png').attr('title',POA_EDIT_LABELS['emxAWL.Action.DisconnectComprisedPOA']).attr('alt',POA_EDIT_LABELS['emxAWL.Action.DisconnectComprisedPOA']);
				$(nameIconDiv).append(removPOAicon);
				$(nameIconDiv).append("&nbsp;&nbsp;");				
				$(nameIconDiv).append(poaData.name);
				$(eachNewPOA).append(nameIconDiv);
				var eachCurrentStateCell  = $('<div>').html(poaData.description);
				
				$(eachCurrentStateCell).addClass("remove-slidein-poa-description");
				$(eachNewPOA).append(eachCurrentStateCell);
				$(contentDiv).append(eachNewPOA);
			});
			$(contentCell).append(contentDiv);
			$(contentRow).append(contentCell);
			$(slideInTable).append(contentRow);
			var slideInDiv= $('<div/>').attr("id","slideInDiv").css("width","30%");
			slideInDiv.append(slideInTable);
			//attach the new slideIn div to page and adjust working pane area width.
			$('#pageContent').append(slideInDiv);
			$("#workingPane").show( "slide", {direction: "right" }, 20000 );
			setSlideInWidth("30%");			
		}
	};
	
	//Handler:To disconnect comprised POA from Customization POA 
	this.removeConnectedPOAHandler = function(e){
		'use strict';
		var clickedSpan=e.target;
		if(!$(clickedSpan).is('img'))
			return;
		
		showProgress($(clickedSpan).parent());
		var customizationPOAId = $(clickedSpan).attr("CusPOAId");
		if(checkSequenceNumberChangedInPOAList([customizationPOAId])) {
			var confirmValue = confirm(POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquence'])
			if(!confirmValue) {
				return;
			}
		}
		var poaToRemoveId = $(clickedSpan).attr("POAToRemoveId");
		var artworkElemensToBeRemovedMap = getSyncJSON("../resources/awl/view/customizationpoa/isConnectedWithOtherCompirsedPOAs", "customizationPOAId=" + customizationPOAId +"&poaToRemoveId=" + poaToRemoveId);
		if(!jQuery.isEmptyObject(artworkElemensToBeRemovedMap) ){
			var encodedinHTML = $("<p/>").html(artworkElemensToBeRemovedMap.alertMessage);
			if(confirm(encodedinHTML.text())==false){
			customEditUtil.removeProgress($(clickedSpan).parent(), '../common/images/iconActionCancel.png');
			return;
		}
		}
		$.ajax({
			type: "POST",
			url: "../resources/awl/db/customizationpoa/removepoa",
			data: "customizationPOAId="+customizationPOAId+"&poaToRemoveId="+poaToRemoveId,
			dataType: "json",
			cache: false,
			async: true,
			beforeSend: function (request)
           		 {
			  addSecureTokenHeader(request);
            		 },
			success: function(jsonResponse){
				if(jsonResponse.returnString == "success"){	
				//render GUI incase elements are removed from customization POA becuase of disconnect POA
					customEditUtil.renderPOAwithCoulmnCellsAfterPOADisconnect(customizationPOAId);		
					$(clickedSpan).hide();
					}else{
						alert(jsonResponse.returnString);
						$(clickedSpan).hide();
					}
				},
			error: function(request,status,errorThrown){
				alert(errorThrown);
				$(clickedSpan).hide();
				}
			});	
	};
	
};
})(jQuery);
