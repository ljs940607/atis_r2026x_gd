define('DS/StuClickable/StuSpatialTapEvent', ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEvent'], function (STU, Event) {
    'use strict';

    /**
     * Sent when the eye is moving over an actor in the Vision Pro and user interact
     * 
     * @class
     * @constructor
     * @private
     * @extends {EP.Event}
     * @memberof STU
     * @alias STU.SpatialTapEvent
    */
    var SpatialTapEvent = function () {
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

    SpatialTapEvent.prototype = new Event();
    SpatialTapEvent.prototype.constructor = SpatialTapEvent;
    SpatialTapEvent.prototype.type = 'SpatialTapEvent';

    /**
     * Set the target actor, containing the STU.Clickable.
     *
     * @method
     * @private
     * @param {STU.Actor3D} iActor
     */
    SpatialTapEvent.prototype.setActor = function (iActor) {
        this.actor = iActor;
    };

    /**
     * Return the target actor, containing the STU.Clickable.
     *
     * @method
     * @private
     * @return {STU.Actor3D}
     */
    SpatialTapEvent.prototype.getActor = function () {
        return this.actor;
    };

    // Expose in STU namespace.
    STU.SpatialTapEvent = SpatialTapEvent;

    EP.EventServices.registerEvent(SpatialTapEvent);

    return SpatialTapEvent;
});
