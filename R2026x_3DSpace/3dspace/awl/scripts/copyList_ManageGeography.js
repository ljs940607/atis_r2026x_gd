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
copyListManageGeography = new function (){
	this.isPOAWindow=false;
	this.modifyGeogrpahyURL = function(){
		return "../resources/awl/db/copylist/managecountrieslanguages";
	};
	
	this.getTypeToAppend = function(){
		return "&type=copyList";
	};
	this.getGeoArtworksURL = function(){
		return "../resources/awl/view/copylist/getgeoartworksbycountry";
	};
	
	/*To Do validation if languages nothing is changed.
	this.validateLanguagesChanges = function(selectedLanguages) {
		var selectedPOAId = customEditUtil.getSelectedPOAs();
		var languageList = customEditUtil.getLanguagesInSequence(selectedPOAId);
		//Compare languages without sequence
		return customEditUtil.compareCountries(languageList,selectedLanguages);
		};
	*/
};
})(jQuery);
