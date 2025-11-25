
define('DS/StuSound/StuSoundPlayerStartedEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices',], function (STU, Event, EventServices) {
	'use strict';

	/**
	 * This event is thrown when the sound player tries to play the sound
	 * 
	 * @exports SoundPlayerStartedEvent
	 * @class
	 * @constructor
     * @noinstancector 
	 * @public
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.SoundPlayerStartedEvent
	 */
	var SoundPlayerStartedEvent = function () {
		Event.call(this);
	};

	SoundPlayerStartedEvent.prototype = new Event();
	SoundPlayerStartedEvent.prototype.constructor = SoundPlayerStartedEvent;
	SoundPlayerStartedEvent.prototype.type = 'SoundPlayerStartedEvent';

	// Expose in STU namespace.
	STU.SoundPlayerStartedEvent = SoundPlayerStartedEvent;
	EventServices.registerEvent(SoundPlayerStartedEvent);

	return SoundPlayerStartedEvent;
});

define('StuSound/StuSoundPlayerStartedEvent', ['DS/StuSound/StuSoundPlayerStartedEvent'], function (SoundPlayerStartedEvent) {
	'use strict';

	return SoundPlayerStartedEvent;
});
