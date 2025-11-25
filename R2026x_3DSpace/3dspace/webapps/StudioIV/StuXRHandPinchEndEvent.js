define('DS/StudioIV/StuXRHandPinchEndEvent', [
	'DS/StuCore/StuContext',
	'DS/EPEventServices/EPEvent',
	'DS/EPEventServices/EPEventServices',
	'DS/EPInputs/EPDevice',
	'DS/EPInputs/EPDeviceReleaseEvent',
], function (STU, Event, EventServices, Device, DeviceReleaseEvent) {
	'use strict';

	/**
	 * This event is thrown when the XR Hand tries to end a new pose
	 *
	 * @exports XRHandPinchEndEvent
	 * @class
	 * @constructor
	 * @noinstancector
	 * @private
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.XRHandPinchEndEvent
	 */
	var XRHandPinchEndEvent = function () {
		Event.call(this);

		let iDevice = new Device();
		let iIndex = 0;
		let iButton = 5;
		let iButtonName = "bPinch";

		var parameters = {};
		parameters.index = iIndex;
		parameters.button = iButton;
		parameters.buttonName = iButtonName;
		parameters.device = iDevice;
		var newEvt = new DeviceReleaseEvent(parameters);
		newEvt.index = iIndex;
		newEvt.button = iButton;
		newEvt.buttonName = iButtonName;
		newEvt.device = iDevice;
		EventServices.dispatchEvent(newEvt);
	};

	XRHandPinchEndEvent.prototype = new Event();
	XRHandPinchEndEvent.prototype.constructor = XRHandPinchEndEvent;
	XRHandPinchEndEvent.prototype.type = 'XRHandPinchEndEvent';

	// Expose in STU namespace.
	STU.XRHandPinchEndEvent = XRHandPinchEndEvent;
	EventServices.registerEvent(XRHandPinchEndEvent);

	return XRHandPinchEndEvent;
});

define('StudioIV/StuXRHandPinchEndEvent', [
	'DS/StudioIV/StuXRHandPinchEndEvent',
], function (XRHandPinchEndEvent) {
	'use strict';

	return XRHandPinchEndEvent;
});
