define('DS/StuModel/StuSignalEvent', [
	'DS/StuCore/StuContext',
	'DS/EPEventServices/EPEventServices',
	'DS/EPEventServices/EPEvent',
], function (STU, EventServices, Event) {
	('use strict');

	/**
	 * @classdesc
	 * Describe a string message event emitted by a STU.Instance.
	 * This event can be dispatched globally on the EP.EventServices and locally on the corresponding STU.Instance.
	 * In order to get notified, you need to add a listener as STU.SignalEvent type on the corresponding STU.Instance or on the EP.EventServices.
	 *
	 * @example
	 * // on emitter (global event)
	 * beScript.onStart = function () {
	 *     this._signalEmitted = false;
	 * };
	 *
	 * beScript.execute = function (context) {
	 *     if (!this._signalEmitted) {
	 *         var signal = new STU.SignalEvent();
	 *         signal.message = "Hello JS World";
	 *         EP.EventServices.dispatchEvent(signal);
	 *         this._signalEmitted = true;
	 *     }
	 * };
	 *
	 * // on receiver (global event)
	 * beScript.onAllSignal = function (iEvent) {
	 *     if (iEvent.message === "Hello JS World") {
	 *         const rotateBeh = this.actor.getBehaviorByType(STU.Rotate)
	 *         rotateBeh.startsRotation();
	 *
	 *         // set the test result
	 *         const currentScene = STU.Experience.getCurrent().getCurrentScene();
	 *         const testResultActor = currentScene.getActorByName("TestResultActor");
	 *         const testResult = testResultActor.getBehaviors()[0];
	 *         testResult.ok = true;
	 *     }
	 * };
	 *
	 * @exports SignalEvent
	 * @class
	 * @constructor
	 * @noinstancector
	 * @public
	 * @extends EP.Event
	 * @memberof STU
	 * @alias STU.SignalEvent
	 */
	class SignalEvent extends Event {
		constructor(message) {
			super();

			/**
			 * Set or get the content of the message.
			 *
			 * @member
			 * @public
			 * @type {string}
			 */
			this.message = message;
		}

		get type() {
			return this.constructor.name;
		}
	}

	// Expose in STU namespace.
	STU.SignalEvent = SignalEvent;
	EventServices.registerEvent(SignalEvent);

	return SignalEvent;
});

define('StuModel/StuSignalEvent', ['DS/StuModel/StuSignalEvent'], function (SignalEvent) {
	'use strict';

	return SignalEvent;
});
