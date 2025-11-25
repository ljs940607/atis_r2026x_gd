/**
* @name DS/StudioUIActorModelWeb/CXPWebViewer
* @constructor
* @augments  DS/StudioUIActorModelWeb/CXPUIActor
*
* @description
* <p>Create a CXPWebViewer rep (iframe)</p>
* <p>Define specific properties and bind them to the rep</p>
* <p>For security reason, some web page can't be display in the web viewer</p>
*/
define('DS/StudioUIActorModelWeb/CXPWebViewer',
[
    'UWA/Core',
	'DS/StudioUIActorModelWeb/CXPUIActor'
],
function (UWA, CXPUIActor) {
	'use strict';

	var CXPWebViewer = CXPUIActor.extend(
		/** @lends DS/StudioUIActorModelWeb/CXPWebViewer.prototype **/
	{

	    init: function (iUIActor) {
	        this._parent(iUIActor);

            this._webViewer = UWA.createElement('iframe').inject(this.getContainer());
            this._webViewer.style.width = '100%';
            this._webViewer.style.height = '100%';
			//Refused to display 'https: //www.google.com' in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'.

			Object.defineProperty(this, 'enable', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._enable;
				},
				set: function (iValue) {
					this._enable = iValue;
					if (this._enable) {
						this._webViewer.style.pointerEvents = 'inherit';
						this._webViewer.style.filter = 'none';
					}
					else {
						this._webViewer.style.pointerEvents = 'none';
						this._webViewer.style.filter = 'brightness(70%) grayscale(100%)';
					}
				}
			});

			Object.defineProperty(this, 'opacity', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._opacity;
				},
				set: function (iValue) {
					this._opacity = iValue;
					this._webViewer.style.opacity = this._opacity/255;
				}
			});

			Object.defineProperty(this, 'url', {
				enumerable: true,
				configurable: true,
				get: function () {
					return this._url;
				},
				set: function (iValue) {
					this._url = iValue;
					this._webViewer.src = this._url;
				}
			});

			//Object.defineProperty(this, 'message', {
			//	enumerable: true,
			//	configurable: true,
			//	get: function () {
			//		return this._message;
			//	},
			//	set: function (iValue) {
			//		this._message = iValue;
			//	}
			//});
			//
			//Object.defineProperty(this, 'script', {
			//	enumerable: true,
			//	configurable: true,
			//	get: function () {
			//		return this._script;
			//	},
			//	set: function (iValue) {
			//		this._script = iValue;
			//	}
			//});

		},




		// Click and double click
		registerPlayEvents: function (iSdkObject) {
		    this._parent(iSdkObject);

		    this._webViewer.addEventListener('mouseenter', this._mouseEnterEvent = function () {
		        iSdkObject.doUIDispatchEvent('UIEntered', 0);
		    });

		    this._webViewer.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
		        iSdkObject.doUIDispatchEvent('UIExited', 0);
		    });
		},

		// Release play events
		releasePlayEvents: function () {
		    this._parent();

		    this._webViewer.removeEventListener('mouseenter', this._mouseEnterEvent);
		    this._webViewer.removeEventListener('mouseleave', this._mouseLeaveEvent);
		}

	});
	return CXPWebViewer;
});




