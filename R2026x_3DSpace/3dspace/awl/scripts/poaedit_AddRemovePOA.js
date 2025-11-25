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
	addRemovePOAInstance = new function() {
		/*
			This method removes POA from POAEdit Screen
			author : wx7 
		*/
		this.addPOAHandler = function() {
			if(isSeqNumChanged) {
				var confirmValue = confirm(POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquence'])
				if(!confirmValue) {
					return;
				}
				isSeqNumChanged=false;
			}
			var poaIdsInUIArray = customEditUtil.getAllPOAIdsArrayInUI();
			var URL = '../common/emxFullSearch.jsp?field=TYPES=type_POA:POA_ARTWORK_BASIS=';
			if(IS_POA_CUSTOMIZED == true){
				URL = URL + 'Marketing Customization';
			}
			else{
				URL = URL + 'Standard';
			}
			//URL = URL + '&formInclusionList=POA_BrandHierarchy&fieldLabels=POA_BrandHierarchy:emxFramework.Attribute.Place_Of_Origin&table=AEFGeneralSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addPOAToPOAEditScreen&excludeOID='+poaIdsInUIArray.join(",");
			URL = URL + '&formInclusionList=POA_BrandHierarchy&fieldLabels=POA_BrandHierarchy:emxFramework.Attribute.Place_Of_Origin&table=AEFGeneralSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addPOAToPOAEditScreen&excludeOIDprogram=AWLPOAUI:getToBeExcludedPOAIds&poaIdsInUI='+poaIdsInUIArray.join(",");

			showModalDialog(URL,100,50,true,'');
		};
		
		/*
			This method adds POAs selected in search page
			author : wx7 
		*/
		this.addPOA = function (newIds) {
			var poaIdsInUI = customEditUtil.getAllPOAIdsArrayInUI().join(encodedPipeForURL);
			newIds  += poaIdsInUI;
			window.location.href = customEditUtil.replaceURLParameterValue(window.location.href,editInstance.urlParameterKey,newIds);
		};
		
		/*
			This method removes POA from POAEdit Screen
			author : wx7 
		*/
		this.removePOAHandler = function(poaIDs,ctxPOA) {
			
			if(isSeqNumChanged) {
				var confirmValue = confirm(POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquence']);
				if(!confirmValue) {
					return;
				}
				isSeqNumChanged=false;
			}
			
			var selectedPOAsArr = customEditUtil.getSelectedPOAs().split(",");
			var poaIdsInUIArray = customEditUtil.getAllPOAIdsArrayInUI();
			
			
			if(ctxPOA){				
				if(selectedPOAsArr.includes(ctxPOA)){
					addRemoveItemInstance.showRemoveMessage(true);
					selectedPOAsArr.remove(ctxPOA);
				}
				
			}else if(poaIdsInUIArray.length == selectedPOAsArr.length){
				addRemoveItemInstance.showRemoveMessage();
				var poaNotToBeRemoved = poaIdsInUIArray.slice(-1)[0];
				selectedPOAsArr.remove(poaNotToBeRemoved);
			}
			
			$.each(selectedPOAsArr,function(index,toBeRemovedPOAId){
				if(poaIDs != toBeRemovedPOAId)
				{
					poaIdsInUIArray = $.grep(poaIdsInUIArray, function(value) {
						return value != toBeRemovedPOAId;
				});
				}
			});
			window.location.href = customEditUtil.replaceURLParameterValue(window.location.href,editInstance.urlParameterKey,poaIdsInUIArray.join(encodedPipeForURL));
		};
		this.showRemoveMessage =function (isConnector){
			if(isConnector){
				alert(POA_EDIT_LABELS["emxAWL.Warning.ArtworkAssemblyPOACannotBeRemoved"]);
			}else{
				alert(POA_EDIT_LABELS["emxAWL.Warning.AllPOAsCannotBeRemoved"]);
			}
			
		};
	};
})(jQuery);

