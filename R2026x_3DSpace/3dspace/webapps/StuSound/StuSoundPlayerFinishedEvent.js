
define('DS/StuSound/StuSoundPlayerFinishedEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices',], function (STU, Event, EventServices) {
	'use strict';

	/**
	 * This event is thrown when the sound player has finished to play the sound
	 * 
	 * @exports SoundPlayerFinishedEvent
	 * @class
	 * @constructor
     * @noinstancector 
	 * @public
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.SoundPlayerFinishedEvent
	 */
	var SoundPlayerFinishedEvent = function () {
		Event.call(this);
	};

	SoundPlayerFinishedEvent.prototype = new Event();
	SoundPlayerFinishedEvent.prototype.constructor = SoundPlayerFinishedEvent;
	SoundPlayerFinishedEvent.prototype.type = 'SoundPlayerFinishedEvent';

	// Expose in STU namespace.
	STU.SoundPlayerFinishedEvent = SoundPlayerFinishedEvent;
	EventServices.registerEvent(SoundPlayerFinishedEvent);

	return SoundPlayerFinishedEvent;
});

define('StuSound/StuSoundPlayerFinishedEvent', ['DS/StuSound/StuSoundPlayerFinishedEvent'], function (SoundPlayerFinishedEvent) {
	'use strict';

	return SoundPlayerFinishedEvent;
});
