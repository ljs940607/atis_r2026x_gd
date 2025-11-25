/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DWebViewer
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DWebViewer_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DWebViewer',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor'
],
function (UWA, CATE3DXUIRep2DUIActor) {
	'use strict';

    /* Important limitations:
    *   - a lot of external websites will not be loaded because, for security concerns, they set 'X-Frame-Options' to 'SAMEORIGIN' (example: https://www.google.com)
    *   - dscef.sendString is not currently managed (to do)
    *   - there is currently no implementation of web ressources (to do), meaning that a local web page is not possible either
    *   - executeScript will only work on same origin, meaning currently almost never.
    */
	var CATE3DXUIRep2DWebViewer = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DWebViewer.prototype **/
	{

        _Fill: function(iContainer) {
            this._parent(iContainer);

            this._iframe = UWA.createElement('iframe').inject(iContainer);
            this._iframe.style.width = '100%';
            this._iframe.style.height = '100%';

            let webViewerEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetUrl(webViewerEO.GetValueByName('url'));
            this._ListenVariableChanges(webViewerEO, 'url');

            this._SetEnabled(webViewerEO.GetValueByName('enabled'));
            this._ListenVariableChanges(webViewerEO, 'enabled');
        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            let webViewerEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'url') {
                this._SetUrl(webViewerEO.GetValueByName('url'));
            } else if (iVariableName === 'enabled') {
                this._SetEnabled(webViewerEO.GetValueByName('enabled'));
            } else {
                this._parent(iProps);
            }
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);
            var self = this;

            this._iframe.addEventListener('mouseenter', this._mouseEnterEvent = function () {
                if (!self._enabled) {
                    return;
                }
		        iSDKObject.doUIDispatchEvent('UIEnterEvent');
		    });

		    this._iframe.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
                if (!self._enabled) {
                    return;
                }
		        iSDKObject.doUIDispatchEvent('UIExitEvent');
		    });

            window.addEventListener('message', this._messageReceivedEvent = function(iEvent) {
                if (iEvent.source !== self._iframe.contentWindow) {
                    return;
                }

                if (typeof iEvent.data !== 'string') {
                    throw new TypeError('web viewer received non-string message type. Only strings are accepted');
                } 

                iSDKObject.doUIDispatchEvent('UIWebMessageReceivedEvent', JSON.stringify({message:iEvent.data}));
            })
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._iframe.removeEventListener('mouseenter', this._mouseEnterEvent);
		    this._iframe.removeEventListener('mouseleave', this._mouseLeaveEvent);
		},

        _SetUrl: function(iURL) {
            this._iframe.src = iURL;
        },

        _SetEnabled: function(iEnabled) {
            this._enabled = iEnabled;
            if (this._enabled) {
                this._iframe.style.pointerEvents = 'inherit';
                this._iframe.style.filter = 'none';
            }
            else {
                this._iframe.style.pointerEvents = 'none';
                this._iframe.style.filter = 'brightness(70%) grayscale(100%)';
            }
        },

        ExecuteScript: function(iScript) {
            this._iframe.contentWindow.eval(iScript);
        },

        SendMessage: function(iMessage) {
            this._iframe.contentWindow.postMessage(iMessage, this._iframe.src);
        },

        _GetVisuMinimumDimension: function() {
            // same as win
			return {width: 0, height: 0};
		},

	});
	return CATE3DXUIRep2DWebViewer;
});
