// This will transform all of jQuery's $.ajax calls to use the proxies defined by the UWA component (so we don't have to do this manually for every request!)
if(window.jQuery && window.widget && window.widget.getValue) {
    // Make sure we are at least v1.5 of jQuery so we have the function we want to use.
    // Also make sure that the widget environment isn't 'uwa', which means that we are running in standalone mode
    if(jQuery.ajaxPrefilter) {
        /****
        options - the request options
        originalOptions - the options as provided to the ajax method, unmodified and, thus, without defaults from ajaxSettings
        jqXHR - the jqXHR object of the request
        ****/
        jQuery.ajaxPrefilter(function( options, originalOptions, jqXHR ){
            'use strict';
            var $ = window.jQuery; //for mkscc compliance, we have to define all our variables...

            var context = window.widget.getValue("pad_security_ctx") || window.widget.getValue('collabSpace');
            if (!context && window.Foe && window.Foe.Model && window.Foe.Model.Session) {
                context = Foe.Model.Session.get('security_ctx');
                if (context && context.contains('ctx::ctx::')) {
                    //NWT 8/31/2021 - not sure how, but sometimes the ctx:: prefix gets added twice.  at least fix it here
                    context = secContext.replace('ctx::ctx::', 'ctx::');
                    Foe.Model.Session.set('security_ctx', context);
                }
                window.widget.setValue('pad_security_ctx', context);
            }
            if (!context && window.widget.data && window.widget.data.X3DContentId) {
                var X3DContentId = window.widget.data.X3DContentId;
                if ((typeof X3DContentId === 'string') && (X3DContentId[0] === '{')) {
                    X3DContentId = JSON.parse(X3DContentId);
                }
                if (X3DContentId && X3DContentId.data && X3DContentId.data.items && X3DContentId.data.items.length && X3DContentId.data.items[0].contextId) {
                    //NWT 2/15/2024 - IR-1233648-3DEXPERIENCER2024x
                    //just use this contextID.  We were either opened from another widget or from 3DSearch, and we haven't had time to pull the security context yet
                    context = X3DContentId.data.items[0].contextId;
                    if (context && context.contains('ctx::ctx::')) {
                        //NWT 8/31/2021 - not sure how, but sometimes the ctx:: prefix gets added twice.  at least fix it here
                        context = secContext.replace('ctx::ctx::', 'ctx::');
                    }
                    if (window.Foe && window.Foe.Model && window.Foe.Model.Session) {
                        Foe.Model.Session.set('security_ctx', context); //just set this locally for now for the benefit of others
                    }
                }
            }
            var objNewHeaders = {
                SecurityContext : context,
                'Accept-Language': window.widget.lang || 'en'
            };
            if (options.headers) {
                options.headers = $.extend(true, options.headers, objNewHeaders);
            } else {
                options.headers = objNewHeaders;
            }
        });
    }
}
