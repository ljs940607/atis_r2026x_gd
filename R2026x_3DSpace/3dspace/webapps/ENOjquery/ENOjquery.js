//
// A wrapper script for loading a versioned jQuery component. It allows
// for easier experimentation with a new module at upgrade time. 
//
// Background documentation:
//
// - AMD - https://github.com/amdjs/amdjs-api/blob/master/AMD.md
// - AMD - https://github.com/amdjs/amdjs-api/wiki/AMD
//
// - DS AMD Concepts (especially the DS naming convention for modules) - https://dsxdev-online.dsone.3ds.com/doconline/DSInternalDoc.htm?show=CAAUWAClient/CAAUWATaAMDConcepts.htm
//

// AMD Loader logic borrowed from 3DSpace, VEN6WJQueryPlugins

// Insure the latest jquery from VENCDjQuery is loaded
var insureLoaderUsesLatestJquery = function() {
	'use strict';
	
    // In case the module gets executed multiple times
    if (require.toUrl('DS/VENCDjquery/jQuery').indexOf('latest') === -1) { //if we don't have latest in the path for the module
        var lJQueryPath = require.toUrl('DS/VENCDjquery/latest/dist/');
        // Remove any query strings
        var lIndexOfQuestionMark = lJQueryPath.indexOf('?');
        if (lIndexOfQuestionMark > -1) { //remove ? and what follows from the url
            lJQueryPath = lJQueryPath.substring(0, lIndexOfQuestionMark);
        }

        // use config to set the jquery to the latest (minimized) version provided by VENCDjQuery and shim to provide global jQuery object
        require.config({
            paths: {
                'DS/VENCDjquery/jQuery': lJQueryPath + 'jquery.min'
            },
            shim: {
                'DS/VENCDjquery/jQuery': {
                    exports: 'jQuery'
                }
            }
        });
    }
};

// if JQuery has already been exported to global scope (preloaded), define it right away.
if (typeof jQuery !== 'undefined') {
    // if there is a different version, load our version and relinquish globals back to the previous version
    if (jQuery.fn.jquery !== '3.7.1') {
        insureLoaderUsesLatestJquery();
        define('DS/ENOPlugins/ENOjquery', ['DS/VENCDjquery/jQuery'], function() {
            'use strict';
			
            // relinquish control of the $ and jQuery global variables to the previous jQuery version
            var jQueryLatest = jQuery.noConflict(true);
            jQuery.noConflict(); // relinquish control of $ on previous jQuery version
			
            return jQueryLatest;
        });
    }

    // if the loaded version is correct, simply return the global jQuery
	define('DS/ENOjquery/ENOjquery', function () {
		'use strict';
        return jQuery;
    });
} else {
    insureLoaderUsesLatestJquery();
	
	define('DS/ENOjquery/ENOjquery', ['DS/VENCDjquery/jQuery'], function(jQueryLatest) {
		'use strict';
		jQuery.noConflict(); //relinquish control of the $ variable
		return jQueryLatest;
	});
}
