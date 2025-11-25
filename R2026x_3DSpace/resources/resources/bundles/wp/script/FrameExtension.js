/**
 * Embedded Window integration management
 */

// Provide dsDashboardWindow.top and dsDashboardWindow.top.parent as a safer window.top / window.parent
// Function to find the topmost window reachable, likely a 3DDashboard
window.dsDashboardWindow = {
    topPlatformWindow: null,

    get parent() {
        try {
            if (window.parent.document) { return window.parent; }
        }
        catch (e) { return window.self}
    },

    get top() {
        // Answer with cache
        if (this.topPlatformWindow) { return this.topPlatformWindow; }

        // Search
        this.topPlatformWindow = window;
        try {
            while (this.topPlatformWindow.parent &&
                   this.topPlatformWindow !== this.topPlatformWindow.parent) {
                try {
                    this.topPlatformWindow.parent.document;
                    if (this.topPlatformWindow.wap && this.topPlatformWindow.top && !this.topPlatformWindow.top.wap) {
                        break;
                    }
                    this.topPlatformWindow = this.topPlatformWindow.parent;
                } catch (crossOriginError) {
                    // Cross-origin restriction
                    break;
                }
            }
        } catch (e) {
            console.warn('Erreur while searching top window:', e);
        }

        return this.topPlatformWindow;
    }
};
window.dsDashboardWindow.top;


// Minimalistic require to catch Pub/Sub events ASAP
require(['DS/PubSub/PubSub'], function (PubSub) {

'use strict';

    /**
     * Function to show error message related to widget loading
     *
     * Expected to work in a standalone minimalist env, including not being correctly
     * loaded widget (ie: failing upon retrieving widget sources)
     */

    // Warn if Passport errors out due to wrong SAML usage (WAFData.js)
    var onPassportErrorUnauthedClient = function () {
        return new Promise((resolve, reject) => {

            require([
                'DS/UIKIT/Alert',
                'i18n!DS/WebAppsFoundations/assets/nls/WebAppsFoundations',
                'css!DS/WebAppsFoundations/assets/WebAppsFoundations',
                'css!DS/UIKIT/UIKIT'
                ],
                function(Alert,NLS) {

                    var docBody = document.body;

                    // Light CSS adjustments to accommodate the Alert (nice-to-have)
                    // This hides html page contents, excepted our alert div
                    docBody.addClassName('widget-error-fadeout-body');


                    // Friendly alert toast, only one even if numerous XHR errors
                    if (!document.body.hasClassName('passport-error-unauthed-client')) {
                        var alert = new Alert({
                            visible: true,
                            fullWidth: false,
                            closable: false,
                            messageClassName: 'error',
                            className: 'passport-error-unauthed-client'
                        }).inject(docBody, 'top');

                        alert.add({
                            message: NLS.onPassportErrorUnauthedClient
                        });

                        docBody.addClassName('passport-error-unauthed-client');
                    }

                    //
                    resolve();

                }, reject);

        });
    };

    // Listen up
    PubSub.add('passport:unauthorized_client', onPassportErrorUnauthedClient);

});


/* global require */
require([
        'UWA/Environments/Frame',
        'UWA/Widget'
],
function (
            Frame,
            Widget
) {

'use strict';

     /**
     * Check widget running context, warn if running a run-your-app cached widget
     * in an unexpected context (run full screen OR in webpage reader)
     */
    (function () {
        Widget.prototype.checkRunabilityContext = function () {
            if (window.parent.frames.length == 0 || window.location.ancestorOrigins.length > 1) {

                return new Promise((resolve, reject) => {
                    require([
                        'DS/UIKIT/Alert',
                        'i18n!DS/WebAppsFoundations/assets/nls/WebAppsFoundations',
                        'css!DS/UIKIT/UIKIT'
                        ],
                        function(Alert,NLS) {

                            var docBody = document.body;

                            // Friendly alert toast
                            if (!document.body.hasClassName('widget-runability-except-fullscreen')) {
                                var alert = new Alert({
                                    visible: true,
                                    fullWidth: false,
                                    closable: true,
                                    messageClassName: 'info',
                                    className: 'widget-runability-except-fullscreen'
                                }).inject(docBody, 'top');

                                alert.add({
                                    message: NLS.wigdetRunabiltyException
                                });

                                docBody.addClassName('widget-runability-except-fullscreen');
                            }

                            //
                            resolve();

                        }, reject);

                });
            }
            return;
        };
    }());

    /**
     * Prefix widget log message by their ID when inside a frame.
     */
    (function () {
        var parent = Widget.prototype.log;
        Widget.prototype.log = function (msg) {
            return parent.call(this, 'Widget' + (this.id ? ' instance #' + this.id : '') + ': ' + msg);
        };
    }());

    /**
     * Dispatch an onUpdateMenu when removeMenu is called.
     * Not done by netvibes. sight.
     */
    (function () {
        var parent = Widget.prototype.removeMenu;
        Widget.prototype.removeMenu = function (name) {
            parent.call(this, name);
            this.launched && this.dispatchEvent('onUpdateMenu', [this.menus]);
        };
    }());

    /**
     * We need this to pass the metas to the parent environment since the getWidget call
     * is not performed anymore.
     */
    (function () {
        var parent = Widget.prototype.setMetas;
        Widget.prototype.setMetas = function (metas) {
            // Avoid duplication of autorefresh calls
            this.clearPeriodical('autoRefresh');
            parent.call(this, metas);
            this.environment.sendRemote('onUpdateMetas', metas);
        };
    }());

    /**
     * This will call frame's widget.setMetas when onUpdateMetas event come from top document.
     */
    (function () {
        Frame.prototype.onUpdateMetas = function (newMetas) {
            this.widget.setMetas(newMetas);
        };
    }());

    /**
     * This will call original onEdit then dispatch it to parent environment.
     */
    (function () {
        var parent = Frame.prototype.onEdit;
        Frame.prototype.onEdit = function (e) {
            parent.call(this);
            this.sendRemote('onEdit', e);
        };
    }());

    /**
     * This will call frame endEdit then dispatch it to parent environment.
     */
    (function () {
        var parent = Frame.prototype.endEdit;
        Frame.prototype.endEdit = function (e) {
            parent.call(this);
            this.sendRemote('endEdit', e);
        };
    }());

    /**
     * This will call frame onUpdateMenu then dispatch it to parent environment.
     */
    (function () {
        var parent = Frame.prototype.onUpdateMenu;
        Frame.prototype.onUpdateMenu = function (menus) {
            parent.call(this);
            this.widget.launched && this.sendRemote('onUpdateMenu', menus);
        };
        /**
         * Remove default frame menus.
         */
        Frame.prototype.registerMenus = function () {
            this.widget.setMenu({ name: 'options' });
        };
    }());

    /**
     * Remove any dispatch to parent environment from inside the frame.
     */
    (function () { Frame.prototype.onResize = function () {}; }());

    /**
     * Prevent 500 ms timeout on Intercom
     */
    (function () {
        var parent = Frame.prototype.initRemote;
        Frame.prototype.initRemote = function () {
            var that = this,
                savedRemoteQueue = this._remoteQueue;

            // Empty remote queue to bypass check inside _runRemoteQueue
            this._remoteQueue = [];
            parent.call(this);
            // Put back remote queue once parent is called
            this._remoteQueue = savedRemoteQueue;

            // Run the queue when we successfully subscribed to parent server
            this.socket.addListener('subscribe', function runQueue () {
                that._runRemoteQueue();
                that.socket.removeListener('subscribe', runQueue);
            });
        };
    }());
});



/**
 * Drag and Drop content validator
 */
try {
    require(['DS/3DXContentChecker/3DXContentChecker_v2.1', 'DS/UIKIT/SuperModal'], function (Checker, SuperModal) {

        try {
            var PublicAPI = dsDashboardWindow.top.require('DS/UWPClientCode/PublicAPI'),
                isFeatureEnabled, isModalEnabled, superModal;

            isModalEnabled = !PublicAPI.getApplicationConfiguration('app.3dxcontentchecker.popup.disable');
            isFeatureEnabled = PublicAPI.getApplicationConfiguration('app.3dxcontentchecker.enable') === 'true';

            if (!isFeatureEnabled) return;

            if (isModalEnabled) {
                superModal = new SuperModal({ renderTo: document.documentElement });
            }

            document.addEventListener('dragstart', function (event) {
                try {
                    if (event && event.dataTransfer) {
                        const dataTransfer = event.dataTransfer;
                        const data = dataTransfer.getData('text/plain');
                        if (data) {
                            const parsed = JSON.parse(data);
                            parsed.protocol === '3DXContent' && !Checker.check(data) && isModalEnabled && parsed.version === '2.1' &&
                                superModal.dialog({
                                    title: 'FATAL: Invalid Drag and Drop',
                                    body: '<p>This app attempted a Drag and Drop action using a wrong format. See console logs for more detail. See more on this <a target="_blank" href="https://dsdoc.dsone.3ds.com/devdoc/3DEXPERIENCER2024x/en/DSInternalExaDoc.htm?show=CAAWebAppsJSDragDropPro/CAAWebAppsQr3DXContent.htm">CAA article</a></p>',
                                });
                        }
                    }
                } catch (e) {}
            });
        } catch (e) {}
    });
} catch (e) {}
