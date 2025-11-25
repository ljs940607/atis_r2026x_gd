define('DS/StudioIV/StuXRHandPinchBeginEvent', [
	'DS/StuCore/StuContext',
	'DS/EPEventServices/EPEvent',
	'DS/EPEventServices/EPEventServices',
	'DS/EPInputs/EPDevice',
	'DS/EPInputs/EPDevicePressEvent',
], function (STU, Event, EventServices, Device, DevicePressEvent) {
	'use strict';

	/**
	 * This event is thrown when the XR Hand tries to begin a new pose
	 *
	 * @exports XRHandPinchBeginEvent
	 * @class
	 * @constructor
	 * @noinstancector
	 * @private
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.XRHandPinchBeginEvent
	 */
	var XRHandPinchBeginEvent = function () {
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
		var newEvt = new DevicePressEvent(parameters);
		newEvt.index = iIndex;
		newEvt.button = iButton;
		newEvt.buttonName = iButtonName;
		newEvt.device = iDevice;
		EventServices.dispatchEvent(newEvt);
	};

	XRHandPinchBeginEvent.prototype = new Event();
	XRHandPinchBeginEvent.prototype.constructor = XRHandPinchBeginEvent;
	XRHandPinchBeginEvent.prototype.type = 'XRHandPinchBeginEvent';

	// Expose in STU namespace.
	STU.XRHandPinchBeginEvent = XRHandPinchBeginEvent;
	EventServices.registerEvent(XRHandPinchBeginEvent);

	return XRHandPinchBeginEvent;
});

define('StudioIV/StuXRHandPinchBeginEvent', [
	'DS/StudioIV/StuXRHandPinchBeginEvent',
], function (XRHandPinchBeginEvent) {
	'use strict';

	return XRHandPinchBeginEvent;
});
