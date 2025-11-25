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
	addRemoveCopyListInstance = new function() {	
      this.addPOAHandler = function() {
    	  if(isSeqNumChanged) {
				var confirmValue = confirm(POA_EDIT_LABELS['emxAWL.POAEditView.UnSavedSquence'])
				if(!confirmValue) {
					return;
				}
				isSeqNumChanged=false;
			}
			var poaIdsInUIArray = customEditUtil.getAllPOAIdsArrayInUI();
			//var URL = '../common/emxFullSearch.jsp?field=TYPES=type_CopyList&table=AEFGeneralSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addPOAToPOAEditScreen&excludeOID='+poaIdsInUIArray.join(",");
			var URL = '../common/emxFullSearch.jsp?field=TYPES=type_CopyList&table=AEFGeneralSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addPOAToPOAEditScreen&excludeOIDprogram=AWLPOAUI:getToBeExcludedPOAIds&poaIdsInUI='+poaIdsInUIArray.join(",");
			//var URL = '../common/emxFullSearch.jsp?field=TYPES=type_CopyList:CURRENT=policy_CopyList.state_Preliminary&table=AEFGeneralSearchResults&selection=multiple&submitURL=../awl/AWLCommonFullSearchProcess.jsp&showInitialResults=true&searchContext=addPOAToPOAEditScreen&excludeOIDprogram=AWLPOAUI:getToBeExcludedPOAIds&poaIdsInUI='+poaIdsInUIArray.join(",");
			showModalDialog(URL,100,50,true,'');
		};
		this.showRemoveMessage= function(){
			alert(POA_EDIT_LABELS["emxAWL.Warning.AllCopyListsCannotBeRemoved"]);
			return;
		
	
    };
    
};
})(jQuery);

