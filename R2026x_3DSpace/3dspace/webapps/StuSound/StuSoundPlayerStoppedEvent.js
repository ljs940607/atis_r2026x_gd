
define('DS/StuSound/StuSoundPlayerStoppedEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices',], function (STU, Event, EventServices) {
	'use strict';

	/**
	 * This event is thrown when the sound player tries to stop the sound
	 * 
	 * @exports SoundPlayerStoppedEvent
	 * @class
	 * @constructor
     * @noinstancector 
	 * @public
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.SoundPlayerStoppedEvent
	 */
	var SoundPlayerStoppedEvent = function () {
		Event.call(this);
	};

	SoundPlayerStoppedEvent.prototype = new Event();
	SoundPlayerStoppedEvent.prototype.constructor = SoundPlayerStoppedEvent;
	SoundPlayerStoppedEvent.prototype.type = 'SoundPlayerStoppedEvent';

	// Expose in STU namespace.
	STU.SoundPlayerStoppedEvent = SoundPlayerStoppedEvent;
	EventServices.registerEvent(SoundPlayerStoppedEvent);

	return SoundPlayerStoppedEvent;
});

define('StuSound/StuSoundPlayerStoppedEvent', ['DS/StuSound/StuSoundPlayerStoppedEvent'], function (SoundPlayerStoppedEvent) {
	'use strict';

	return SoundPlayerStoppedEvent;
});
