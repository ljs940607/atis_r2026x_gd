define('DS/StuWebPlayer/StuWebPlayerMessageReceivedEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent', 'DS/EP/EP'], function (STU, Event, EP) {

	'use strict';

	/**
	 * Event hosting a message sent by the experience integrator through the Experience Player WebComponent.
	 * 
	 * To send a message to the integrator, please use {@link STU.WebPlayer#sendMessage}.
	 * 
	 * @exports WebPlayerMessageReceivedEvent 
	 * @class
	 * @constructor
	 * @noinstancector
	 * @public
	 * @extends {EP.Event}
	 * @memberof STU
	 * @alias STU.WebPlayerMessageReceivedEvent
	 * @see STU.WebPlayer#sendMessage
	 */

	var WebPlayerMessageReceivedEvent = function (message) {

		Event.call(this);

		/**
		 * Message sent by the integrator web page.
		 * 
		 * Supported and unsuppported message types are determined by the structured clone algorithm
		 * as implemented by javascript's postMessage() method. Supported types are :
		 * 	  boolean, number, string, null, undefined, array, plain objects
		 *
		 * @member
		 * @instance
		 * @name message
		 * @public
		 * @type {object}
		 * @memberof STU.WebPlayerMessageReceivedEvent		 
		 */
		this.message = message;

	};

	WebPlayerMessageReceivedEvent.prototype = new Event();
	WebPlayerMessageReceivedEvent.prototype.constructor = WebPlayerMessageReceivedEvent;
	WebPlayerMessageReceivedEvent.prototype.type = 'WebPlayerMessageReceivedEvent';

	// Expose in STU namespace.
	STU.WebPlayerMessageReceivedEvent = WebPlayerMessageReceivedEvent;

	EP.EventServices.registerEvent(WebPlayerMessageReceivedEvent);

	return WebPlayerMessageReceivedEvent;
});

define('StuWebPlayer/StuWebPlayerMessageReceivedEvent', ['DS/StuWebPlayer/StuWebPlayerMessageReceivedEvent'], function (WebPlayerMessageReceivedEvent) {
	'use strict';

	return WebPlayerMessageReceivedEvent;
});

