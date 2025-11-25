/**
* @name DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents
* @interface
*
* @description
* Interface to process events sent to 3D UIActors by CATI3DXUIEventsManager
*/
define('DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents',
[
	'UWA/Class',
	'DS/WebComponentModeler/CATWebInterface'
],
function (
	UWA,
	CATWebInterface
) {
	'use strict';

	var CATI3DXUIEvents = CATWebInterface.singleton(
    /** @lends DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents **/
	{
	    /**
        * Enum for UI event types.
        * @readonly
        * @enum {string}
        */
	    CAT3DXUIEventTypes: {
			CAT3DXUILeftClickEvent: "CAT3DXUILeftClickEvent",
			CAT3DXUIRightClickEvent: "CAT3DXUIRightClickEvent",
			CAT3DXUIDoubleClickEvent: "CAT3DXUIDoubleClickEvent",
			CAT3DXUIPressEvent: "CAT3DXUIPressEvent",
			CAT3DXUIReleaseEvent: "CAT3DXUIReleaseEvent",
			CAT3DXUIEnterEvent: "CAT3DXUIEnterEvent",
			CAT3DXUIExitEvent: "CAT3DXUIExitEvent",
			CAT3DXUIHoverEvent: "CAT3DXUIHoverEvent",
	    },

		interfaceName: 'CATI3DXUIEvents',
	    /** @lends DS/StudioUIActorModelWeb/interfaces/CATI3DXUIEvents.prototype **/
		required: {
			
			/**
            * Decide if the events should be sent to the 3DUIActor
            * @public
			* @param {boolean} iProcessEvents - true if the events should be sent to the 3DUIActor, false otherwise.
            */
			processUIEvents: function(iProcessEvents) {
			},

			/**
            * Send the given event to the 3DUIActor
            * @public
			* @param {string} iCAT3DXUIEventType - name of the event to send, should be defined in CAT3DXUIEventTypes.
            */
			receiveUIEvent: function(iCAT3DXUIEventType) {
			},

		},

		optional: {

		}

	});

	return CATI3DXUIEvents;
});
