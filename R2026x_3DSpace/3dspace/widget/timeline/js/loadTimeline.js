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

function (){
	var myObj = {
		html: function() { return jQuery('<div id="'+ this.getId() +'" class="enovia-timeline-target"></div>');},
		getId: function() { return "dsTL_" + new Date().getTime()},
		draw: function(data){
				console.log('drawing from custom script');
				var ctnr = this.html();
				var testTL = new Timeline(data);
      			testTL.draw(jQuery(ctnr));
 
				return ctnr;
			}
	};
	return myObj;
}()
