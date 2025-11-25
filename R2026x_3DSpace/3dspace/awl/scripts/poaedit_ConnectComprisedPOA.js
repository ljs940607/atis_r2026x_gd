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
poaConnectComprised = new function (){
	//Handler To connect comprised POA with Custmization POA. This command is multi select POA.
	this.connectComprisedPOAHandler = function() {
		'use strict';
		var selectedPOAsString = customEditUtil.getSelectedPOAs();

		var URL = '../common/emxFullSearch.jsp?field=TYPES=type_POA:CURRENT=policy_POA.state_Release,policy_POA.state_Obsolete&table=AEFGeneralSearchResults&formInclusionList=POA_BrandHierarchy&fieldLabels=POA_BrandHierarchy:emxFramework.Attribute.Place_Of_Origin&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=connectComprisedPOA&excludeOIDprogram=AWLPOAUI:getExcludePOAsForComprised&selectedPOAIds='+selectedPOAsString;
		showModalDialog(URL,100,50,true,'');
	};
	
	
	
	//Handler:POA Header click. Need to show comprised POA detaiils. 
	this.poaHeaderClickHandler = function(e){
		'use strict';
		var clickedSpan=e.target;
		if(!$(clickedSpan).is('p'))
			return;
		//Get info of comprised POA
		var comprisedPOAInforMap = getSyncJSON("../resources/awl/view/customizationpoa/getcomprisedpoaInfo", "customizationPOAId="+$(clickedSpan).closest("th").attr("id"));
		//Show message if customization POA doesnt have any connected POAs.
		if(Object.keys(comprisedPOAInforMap).length == 0){
			alert(POA_EDIT_LABELS['emxAWL.CustomizedPOA.POANotConnected']);
			return true;
		}
		var poaConnectedPOATable = $('<table id="poaConnectedPOATable" title="'+$(clickedSpan).text()+'"></table>');
		poaConnectedPOATable.attr("class","table table-bordered table-condensed table-hover table-striped");
		poaConnectedPOATable.attr("style","width: 100%;");
		var thead = $("<thead ></thead>");
		var theadRow = $("<tr></tr>");

		var thName=$("<th>"+POA_EDIT_LABELS['emxFramework.Basic.Name']+"</th>");
		$(thName).attr("style","background: #368ec4;width: 20%");
		var thTitle=$("<th>"+POA_EDIT_LABELS['emxCPD.Common.Title']+"</th>");
		$(thTitle).attr("style","background: #368ec4;width: 20%");
		var thDescription=$("<th>"+POA_EDIT_LABELS['emxFramework.Basic.Description']+"</th>");
		$(thDescription).attr("style","background: #368ec4;width: 65%");
		var thCurrentState=$("<th>"+POA_EDIT_LABELS['emxAWL.Label.CurrentState']+"</th>");
		$(thCurrentState).attr("style","background: #368ec4;width: 15%");
		
		$(theadRow).append(thName);
		$(theadRow).append(thTitle);
		$(theadRow).append(thDescription);
		$(theadRow).append(thCurrentState);
		$(thead).append(theadRow);
		$(poaConnectedPOATable).append(thead);
		var tableBody = $('<tbody/>');
		$.each(comprisedPOAInforMap, function(poaId, poaData) {
			var eachNewRow = $('<tr></tr>');
			var eachNameCell = $('<td>'+poaData.name+'</td>');
			var eachTitleCell = $('<td>'+poaData.poaTitle+'</td>');
			var eachDescCell = $('<td>'+poaData.description+'</td>');
			var eachCurrentStateCell  = $('<td>'+poaData.currentState+'</td>');
			
			$(eachNewRow).append(eachNameCell);
			$(eachNewRow).append(eachTitleCell);
			$(eachNewRow).append(eachDescCell);
			$(eachNewRow).append(eachCurrentStateCell);
			$(tableBody ).append(eachNewRow);
			
			});

		$(poaConnectedPOATable).append(tableBody); 
		poaConnectedPOATable.dialog({
			title: jQuery(this).attr("data-dialog-title"),
			closeText:POA_EDIT_LABELS["emxCommonButton.Close"],
			close: function() { jQuery(this).remove(); },
			modal: false,
			hide: { effect: "none", duration: 150 },
			show: { effect: "none", duration: 150 },
			width: '600px',
			height: 'auto',
			position: [e.pageX,e.pageY],
			autoResize: true
		});

	};
	
};
})(jQuery);
