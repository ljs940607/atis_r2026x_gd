/**
 * @name DS/StudioUIActorModelWeb/extensions/CATE3DUIActor3DXUIEvents
 * @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents}
 * @constructor
 *
 * @description
 * CATI3DXUIEvents implementation for CXP3DImagebuttonActor_Spec
 */
define('DS/StudioUIActorModelWeb/extensions/CATE3DUIActor3DXUIEvents',
[
	'UWA/Core',
	'UWA/Class/Events',
	'UWA/Class/Listener',
	'DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents'
],
function (
	UWA,
	Events,
	Listener,
	CATI3DXUIEvents
) {
	'use strict';

	let CATE3DUIActor3DXUIEvents = UWA.Class.extend(Events, Listener,
		/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DUIActor3DXUIEvents.prototype **/
		{
			init: function () {
				this._processEvents = true;
			},

			Build: function () {

			},
			
			Dispose: function () {

			},

			processUIEvents: function (iProcessEvents) {
				this._processEvents = iProcessEvents;
			},
			
			receiveUIEvent: function (iCAT3DXUIEventType) {
				if (! Object.hasOwn(CATI3DXUIEvents.CAT3DXUIEventTypes, iCAT3DXUIEventType)) return;

				if (this._processEvents) {
					this.dispatchEvent(iCAT3DXUIEventType, []);
				}
			},

		});

	return CATE3DUIActor3DXUIEvents;
});
