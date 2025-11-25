define('DS/StudioIV/StuXRControllerActor',
	['DS/StuCore/StuContext', 'DS/StuRenderEngine/StuActor3D', 'DS/StuCore/StuTools', 'DS/StudioIV/StuXRDeviceActor', 'DS/StudioIV/StuXRManager', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices'],
	function (STU, Actor3D, Tools, XRDeviceActor, XRManager, Event, EventServices) {
		'use strict';

        /**
         * Describes a XR Controller actor.<br/>
         * 
         *
         * @exports XRControllerActor
         * @class
         * @constructor
         * @noinstancector
         * @public
         * @extends STU.XRDeviceActor
         * @memberof STU
         * @alias STU.XRControllerActor
         */
		var XRControllerActor = function () {
			XRDeviceActor.call(this);

			this.name = 'XRControllerActor';
		};

		XRControllerActor.prototype = new XRDeviceActor();
		XRControllerActor.prototype.constructor = XRControllerActor;

        /**
         * Vibrates the controller during a specified number of milliseconds 
         * 
		 * @method
         * @public
		 * 
         * @param {Number} iDuration Number of milliseconds the controller will vibrate (should be lower than 65535ms).
		 * @returns {boolean} true if vibration is successfully launched
         */
		XRControllerActor.prototype.vibrate = function (iDuration) {
			var XRMgr = STU.XRManager.getInstance();
			var wrapper = XRMgr._wrapper;
			if (wrapper == null || wrapper == undefined) {
				console.error("Unable to get wrapper, vibrate won't work");
				return false;
			}

			if (this.deviceID == XRManager.EDeviceIdentifier.eRightController) {
				wrapper.hapticPulse(1, iDuration, 1.0);
			}
			else if (this.deviceID == XRManager.EDeviceIdentifier.eLeftController) {
				wrapper.hapticPulse(2, iDuration, 1.0);
			}
			else {
				console.error("You need to set the device ID using setDeviceID before calling vibrate");
			}
			return true;
		};

        /**
         * Vibrates the controller during a specified number of seconds 
         * It is used as a capacity in NL
         * 
         * @private 
         * @param {Number} iDuration Number of seconds the controller will vibrate
         */
		XRControllerActor.prototype._vibrateSeconds = function (iDuration) {
			return this.vibrate(iDuration * 1000);
		};



		// Expose in STU namespace.
		STU.XRControllerActor = XRControllerActor;

		return XRControllerActor;
	});

define('StudioIV/StuXRControllerActor', ['DS/StudioIV/StuXRControllerActor'], function (XRControllerActor) {
	'use strict';

	return XRControllerActor;
});
