define('DS/StuModel/StuCameraPostProcessEvent', [
	'DS/StuCore/StuContext',
	'DS/EPEventServices/EPEventServices',
	'DS/EPEventServices/EPEvent',
], function (STU, EventServices, Event) {
	('use strict');

	/**
	 * @exports CameraPostProcessEvent
	 * @class
	 * @constructor
	 * @noinstancector
	 * @private
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.CameraPostProcessEvent
	 */
	class CameraPostProcessEvent extends Event {
		constructor() {
			super();
		}

		get type() {
			return this.constructor.name;
		}
	}

	// Expose in STU namespace.
	STU.CameraPostProcessEvent = CameraPostProcessEvent;
	EventServices.registerEvent(CameraPostProcessEvent);

	return CameraPostProcessEvent;
});

define('StuModel/StuCameraPostProcessEvent', ['DS/StuModel/StuCameraPostProcessEvent'], function (CameraPostProcessEvent) {
	'use strict';

	return CameraPostProcessEvent;
});
