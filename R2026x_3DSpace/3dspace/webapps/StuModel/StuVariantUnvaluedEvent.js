
define('DS/StuModel/StuVariantUnvaluedEvent',
    ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEventServices', 'DS/EPEventServices/EPEvent'],
    function (STU, EPEventServices, Event) {
    'use strict';

    /**
        * Describe a STU.VariantUnvaluedEvent.
        * It occurs when a human animation task is Started.
        *
        * @exports VariantUnvaluedEvent
        * @class
        * @constructor
        * @noinstancector
        * @private
        * @extends EP.Event
        * @memberof STU
        * @alias STU.VariantUnvaluedEvent
        */
        var VariantUnvaluedEvent = function () {

            Event.call(this);

            /**
            * Variant 
            *
            * @member
            * @private
            * @type {STU.Variant}
            * @default undefined
            */
            this.variant = null;

            /**
            * Variant Value
            *
            * @member
            * @private
            * @type {STU.Value}
            * @default undefined
            */
            this.value = null;

            /**
            * Initiator
            *
            * @member
            * @private
            * @type {string}
            * @default undefined
            */
            this.initiator = "";
    };

        VariantUnvaluedEvent.prototype = new Event();
        VariantUnvaluedEvent.prototype.constructor = VariantUnvaluedEvent;
        VariantUnvaluedEvent.prototype.type = 'VariantUnvaluedEvent';

    // Expose in STU namespace.
        STU.VariantUnvaluedEvent = VariantUnvaluedEvent;

        EP.EventServices.registerEvent(VariantUnvaluedEvent);
        return VariantUnvaluedEvent;
});

define('StuModel/StuVariantUnvaluedEvent', ['DS/StuModel/StuVariantUnvaluedEvent'], function (VariantUnvaluedEvent) {
    'use strict';

    return VariantUnvaluedEvent;
});
