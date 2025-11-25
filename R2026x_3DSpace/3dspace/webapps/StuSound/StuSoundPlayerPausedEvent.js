
define('DS/StuSound/StuSoundPlayerPausedEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices',], function (STU, Event, EventServices) {
	'use strict';

	/**
	 * This event is thrown when the sound player tries to pause the sound
	 * 
	 * @exports SoundPlayerPausedEvent
	 * @class
	 * @constructor
     * @noinstancector 
	 * @public
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.SoundPlayerPausedEvent
	 */
	var SoundPlayerPausedEvent = function () {
		Event.call(this);
	};

	SoundPlayerPausedEvent.prototype = new Event();
	SoundPlayerPausedEvent.prototype.constructor = SoundPlayerPausedEvent;
	SoundPlayerPausedEvent.prototype.type = 'SoundPlayerPausedEvent';

	// Expose in STU namespace.
	STU.SoundPlayerPausedEvent = SoundPlayerPausedEvent;
	EventServices.registerEvent(SoundPlayerPausedEvent);

	return SoundPlayerPausedEvent;
});

define('StuSound/StuSoundPlayerPausedEvent', ['DS/StuSound/StuSoundPlayerPausedEvent'], function (SoundPlayerPausedEvent) {
	'use strict';

	return SoundPlayerPausedEvent;
});
