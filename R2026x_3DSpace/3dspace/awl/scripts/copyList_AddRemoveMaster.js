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
	copyListAddRemoveMaster = new function (){

	
	//Overridden to get Unused Elements for selected CopyLists
	this.getUnsedMasterElements=function() {
		return getSyncJSON("../resources/awl/view/copylist/getunusedmasterelements", "CopyListIds="+customEditUtil.getSelectedPOAs());
	};
	
	//Overridden to add Master Copy to CopyList
	this.getAddMasterCopyServiceURL=function() {
		return "../resources/awl/db/copylist/addmastercopy";
	};
	
	 //Overridden to Remove Master Copy from CopyList
	 this.getRemoveMasterCopyServiceURL=function(){
		 return "../resources/awl/db/copylist/removemastercopy";
	 };
	 
	 this.getAddMasterCopiesServiceURL=function(){
			return "../resources/awl/db/copylist/addmastercopies";
		};
	 
};
})(jQuery);
