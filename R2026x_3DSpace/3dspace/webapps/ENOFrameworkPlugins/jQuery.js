if (typeof jQuery !== 'undefined') {
        define('DS/ENOFrameworkPlugins/jQuery', function () {
            'use strict';
            return jQuery;
        });
    } else {
        // In case the module gets executed multiple times
        //if we don't have latest in the path for the module
            var lJQueryPath = require.toUrl('DS/ENOjquery/ENOjquery');
            // Remove any query strings
            var lIndexOfQuestionMark = lJQueryPath.indexOf('?');
            if (lIndexOfQuestionMark > -1) { //remove ? and what follows from the url
                lJQueryPath = lJQueryPath.substring(0, lIndexOfQuestionMark);
            }


            require.config({
                paths: {
                    'DS/ENOjquery/ENOjquery': lJQueryPath 
                },
                shim: {
                    'DS/ENOjquery/ENOjquery': {
                        exports: 'jQuery'
                    }
                }
            });
        
    }
    define('DS/ENOFrameworkPlugins/jQuery', ['DS/ENOjquery/ENOjquery'], function (jQuery) {
        'use strict';
        jQuery.noConflict();    // relinquish control of the $ variable 
        return jQuery;
    });

    
