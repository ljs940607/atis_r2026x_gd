/* eslint valid-jsdoc: "off", no-unused-expressions: "off", no-eq-null: "off"*/
/* global define */

define('DS/StuWebPlayer/StuWebPlayer',
	['DS/StuCore/StuContext', 'DS/StuCore/StuManager'
	],
	function (STU, Manager) {
		'use strict';

		/**
		 * Manager allowing communication with the integrator of a standalone Experience Player.
		 *
		 * @example
		 * //get the webplayer
		 * let webPlayer = STU.WebPlayer.getInstance();		 
		 * 
		 * //send message to the integrator
		 * * let msg = "Hello, player!"
		 * webPlayer.sendMessage(msg);
		 *
		 * @exports WebPlayer
		 * @class
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends STU.Manager
		 * @memberof STU
		 * @alias STU.WebPlayer
		 */
		var WebPlayer = function () {
			Manager.call(this);
			this.name = 'WebPlayer';
		};

		WebPlayer.prototype = new Manager();
		WebPlayer.prototype.constructor = WebPlayer;

		/**
		 * Sends a message to the Experience Player's WebComponent.
		 * 
		 * This message can be received by the Experience Player integrator, allowing him
		 * to update the integration web page according to experience content or user interactions.
		 *
		 * Supported and unsuppported message types are determined by the structured clone algorithm
		 * as implemented by javascript's postMessage() method. Supported types are :
		 * 	  boolean, number, string, null, undefined, array, plain objects
		 * 
		 * Note: calling this method when playing in Creative Experience will log an error, as 
		 * there is not integration web page associated.
		 * 
		 * To receive messages from the Experience Player, please listen to {@link STU.WebPlayerMessageReceivedEvent}.
		 * 
		 * 		 
		 * @param {object} message message to send to the integrator
		 * @method
		 * @public		 
		 * @see STU.WebPlayerMessageReceivedEvent
		 */
		WebPlayer.prototype.sendMessage = function (message) {
			//implementation in StuWebPlayerNA and StuWebPlayerWeb
		};

		/**
		 * Check if the web player is working as a player for AVP
		 * 		 
		 * @method
		 * @private		 
		 */
		WebPlayer.prototype.isAVPEnabled = function () {
			//implementation in StuWebPlayerNA and StuWebPlayerWeb
			return false;
		};

		WebPlayer.prototype._startNewAVPExperience = function (iExperienceName) {
			//implementation in StuWebPlayerNA and StuWebPlayerWeb
		};

		STU.registerManager(WebPlayer);

		// Expose in STU namespace.
		STU.WebPlayer = WebPlayer;

		return WebPlayer;
	});

define('StuWebPlayer/StuWebPlayer', ['DS/StuWebPlayer/StuWebPlayer'], function (WebPlayer) {
	'use strict';

	return WebPlayer;
});
