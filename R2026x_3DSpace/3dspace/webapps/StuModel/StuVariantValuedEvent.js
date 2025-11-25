
define('DS/StuModel/StuVariantValuedEvent',
    ['DS/StuCore/StuContext', 'DS/EPEventServices/EPEventServices', 'DS/EPEventServices/EPEvent'],
    function (STU, EPEventServices, Event) {
    'use strict';

    /**
        * Describe a STU.VariantValuedEvent.
        *
        * @exports VariantValuedEvent
        * @class
        * @constructor
        * @noinstancector
        * @private
        * @extends EP.Event
        * @memberof STU
        * @alias STU.VariantValuedEvent
        */
    var VariantValuedEvent = function () {

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

        VariantValuedEvent.prototype = new Event();
        VariantValuedEvent.prototype.constructor = VariantValuedEvent;
        VariantValuedEvent.prototype.type = 'VariantValuedEvent';

    // Expose in STU namespace.
        STU.VariantValuedEvent = VariantValuedEvent;

        EPEventServices.registerEvent(VariantValuedEvent);
        return VariantValuedEvent;
});

define('StuModel/StuVariantValuedEvent', ['DS/StuModel/StuVariantValuedEvent'], function (VariantValuedEvent) {
    'use strict';

    return VariantValuedEvent;
});
