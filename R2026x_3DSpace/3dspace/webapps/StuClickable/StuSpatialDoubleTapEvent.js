define('DS/StuClickable/StuSpatialDoubleTapEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent'], function (STU, Event) {
    'use strict';

    /**
     * Sent when the eye is moving over an actor in the Vision Pro and user interact twice
     * 
     * @class
     * @constructor
     * @private
     * @extends {EP.Event}
     * @memberof STU
	 * @alias STU.SpatialDoubleTapEvent
     */
    var SpatialDoubleTapEvent = function () {
        Event.call(this);

        /**
         * The target actor, containing the STU.Clickable.
         *
         * @member
         * @private
         * @type {STU.Actor}
         */
        this.actor;
    };

    SpatialDoubleTapEvent.prototype = new Event();
    SpatialDoubleTapEvent.prototype.constructor = SpatialDoubleTapEvent;
    SpatialDoubleTapEvent.prototype.type = 'SpatialDoubleTapEvent';

    /**
     * Set the target actor, containing the STU.Clickable.
     *
     * @method
     * @private
     * @param {STU.Actor3D} iActor
     */
    SpatialDoubleTapEvent.prototype.setActor = function (iActor) {
        this.actor = iActor;
    };

    /**
     * Return the target actor, containing the STU.Clickable.
     *
     * @method
     * @private
     * @return {STU.Actor3D}
     */
    SpatialDoubleTapEvent.prototype.getActor = function () {
        return this.actor;
    };

    // Expose in STU namespace.
    STU.SpatialDoubleTapEvent = SpatialDoubleTapEvent;

    EP.EventServices.registerEvent(SpatialDoubleTapEvent);

    return SpatialDoubleTapEvent;
});
