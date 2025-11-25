/**
 * Implementation of the Tag Navigator component for BPS components
 * @requires TagNavigator.js
 * @requires UWA libraries
 * @requres jQuery
 * @version 1.2.0
 */

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

var bpsTagNavConnector = {
    tnWin: null,
    TagNavigator: null,
    rebuildViewNeeded: true,
    /**
     * Method
     * @returns a pointer to the window containing TagNavigator
     */
    getTNWindow: function() {
        return this.tnWin || getTopWindow();
    },
    /**
     * Method
     * @Description initializes the tagNavigator
     * fires "TN_LAUNCHED" for components that are registered listeners
     */
    initTagNavigator: function() {
        var othis = this;
        this.tnWin = this.getTNWindow();

        require(['DS/TagNavigator/TagNavigator'], function(TagNavigator) {
            var tagger, 
            path = window.location.pathname.split('/')[1];
            var paramWidgetId = getTopWindow().location.search.match(/[?&]widgetId=([^&]*)?/),
            paramTenant = getTopWindow().location.search.match(/[?&]tenant=([^&]*)?/);
            paramWidgetId = (paramWidgetId == null ? undefined : paramWidgetId[1] || undefined);
            paramTenant = (paramTenant == null ? undefined : paramTenant[1] || undefined);
            
            TagNavigator.set6WTaggerOptions({
                cStorageService: window.location.protocol + "//" + window.location.host + "/" + path,
                taggerService: window.location.protocol + "//" + window.location.host + "/" + path,
                tenant: paramTenant == "onpremise" ? undefined : paramTenant,
                lang: clntlang
            });
		getTopWindow().taggerCtx = "context1";
            var wId = paramWidgetId == null ? getTopWindow().taggerCtx : undefined;
            tagger = TagNavigator.get6WTagger(wId);
            othis.TagNavigator = TagNavigator;
            TagNavigator.create6WTaggerView(tagger, "tn-target",{onClose:toggleTagger}, true);
            othis.tnWin.jQuery(othis.tnWin.document).trigger("TN_LAUNCHED");
        });
    }
};

if(typeof console === "undefined") { //prevent IE from throwing errors. This is just a debug utility
    console = {
        log: function() {},
        warn: function() {},
        dir: function() {}
    };
}
