
define('DS/StuSound/StuSoundPlayerResumedEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices',], function (STU, Event, EventServices) {
	'use strict';

	/**
	 * This event is thrown when the sound player tries to resume the sound
	 * 
	 * @exports SoundPlayerResumedEvent
	 * @class
	 * @constructor
     * @noinstancector 
	 * @public
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.SoundPlayerResumedEvent
	 */
	var SoundPlayerResumedEvent = function () {
		Event.call(this);
	};

	SoundPlayerResumedEvent.prototype = new Event();
	SoundPlayerResumedEvent.prototype.constructor = SoundPlayerResumedEvent;
	SoundPlayerResumedEvent.prototype.type = 'SoundPlayerResumedEvent';

	// Expose in STU namespace.
	STU.SoundPlayerResumedEvent = SoundPlayerResumedEvent;
	EventServices.registerEvent(SoundPlayerResumedEvent);

	return SoundPlayerResumedEvent;
});

define('StuSound/StuSoundPlayerResumedEvent', ['DS/StuSound/StuSoundPlayerResumedEvent'], function (SoundPlayerResumedEvent) {
	'use strict';

	return SoundPlayerResumedEvent;
});
