define('DS/StuSound/StuSoundManager', ['DS/StuCore/StuContext', 'DS/StuCore/StuManager'],
	function (STU, Manager) {
		'use strict';


		/**
         * The Sound manager is the way of interacting with all the sound of the experience <br/>
		 *
		 * @exports SoundManager
		 * @class
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends STU.Manager
		 * @memberof STU
		 * @alias STU.SoundManager
		 */
		var SoundManager = function () {

			Manager.call(this);

			this.name = 'SoundManager';
			this._isMuted = false;
		};

		SoundManager.prototype = new Manager();
		SoundManager.prototype.constructor = SoundManager;

		/**
         * Mute the sound of all sound players
         * Useful to deactivate the sound of the experience
		 * 
         * @public
         */
		SoundManager.prototype.muteAll = function () {
			this.mute(); // call the related function in Win (NA) or Web
			this._isMuted = true;
		};

		/**
         * Unmute the sound of all sound players
		 * Useful to reactivate the sound of the experience
		 *
		 * @public
		 */
		SoundManager.prototype.unmuteAll = function () {
			this.unmute(); // call the related function in Win (NA) or Web
			this._isMuted = false;
		};



		STU.registerManager(SoundManager);

		// Expose in STU namespace.
		STU.SoundManager = SoundManager;

		return SoundManager;
	});

define('StuSound/StuSoundManager', ['DS/StuSound/StuSoundManager'], function (SoundManager) {
	'use strict';

	return SoundManager;
});
