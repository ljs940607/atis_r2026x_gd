/*global define*/
define('DS/StuSound/StuSoundPlayerNA', ['DS/StuSound/StuSoundPlayer', 'DS/StuSound/StuSoundManagerNA'], function (StuSoundPlayerJS, StuSoundManagerNA) {
	'use strict';

	StuSoundPlayerJS.prototype.buildWrapper = function () {
		StuSoundManagerNA.prototype.registerSoundPlayer(this); //register the StuSoundPlayer so that we can exploit it later in the soundManager for mute
		return new stu__SoundSourceWrapper();
	}

	return StuSoundPlayerJS;
});
