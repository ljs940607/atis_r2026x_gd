//
// A wrapper script for loading a versioned jQuery UI component. It allows
// for easier experimentation with a new module at upgrade time. 
//
// Background documentation:
//
// - AMD - https://github.com/amdjs/amdjs-api/blob/master/AMD.md
// - AMD - https://github.com/amdjs/amdjs-api/wiki/AMD
//
// - DS AMD Concepts (especially the DS naming convention for modules) - https://dsxdev-online.dsone.3ds.com/doconline/DSInternalDoc.htm?show=CAAUWAClient/CAAUWATaAMDConcepts.htm
//

// jQueryUI AMD loader definition, borrowed and adapted from the 3DSpace jQuery UI AMD loader which this component is, in part, replacing.
//
// Attempts to leverage a simpler AMD loader used in the ven-jquery component, were unsuccessful, so this more concise loader is being
// used in the alternative.

/*! Copyright 2025 Dassault Systèmes */
/* Configure AMD Loader to load non AMD lib
 * See requirejs shim config for references :
 *   http://requirejs.org/docs/api.html#config-shim
 */
/* global require, define, jQuery */

// if JQuery.ui has already been exported to global scope (preloaded), define it right away.
if (typeof jQuery !== 'undefined' && typeof jQuery.ui !== 'undefined') {
	define('DS/ENOjqueryUI/jQueryUI', function () {
		'use strict';
        return jQuery.ui;
    });
} else {
    // In case the module gets executed multiple times
    if (require.toUrl('DS/VENCDjqueryUI/jQueryUI').indexOf('latest') === -1) { //if we don't have latest in the path for the module
        var lJQueryUIPath = require.toUrl('DS/VENCDjqueryUI/latest/');
		
		// Remove any query strings
        var lIndexOfQuestionMark = lJQueryUIPath.indexOf('?');
        if (lIndexOfQuestionMark > -1) { //remove ? and what follows from the url
            lJQueryUIPath = lJQueryUIPath.substring(0, lIndexOfQuestionMark);
        }

        require.config({
            paths: {
                'DS/VENCDjqueryUI/jQueryUI': lJQueryUIPath + 'jquery-ui.min'
            },
            shim: {
                'DS/VENCDjqueryUI/jQueryUI': {
                    deps: ['DS/ENOjquery/ENOjquery'],
                    exports: 'jQuery.ui'
                }
            }
        });
    }
}

define('DS/ENOjqueryUI/jQueryUI', ['DS/VENCDjqueryUI/jQueryUI'], function (jQueryUI) {
    'use strict';
    return jQueryUI;
});
