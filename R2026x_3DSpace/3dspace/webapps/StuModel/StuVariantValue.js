
define('DS/StuModel/StuVariantValue', ['DS/StuCore/StuContext', 'DS/StuModel/StuInstance', 'DS/StuModel/StuVariantsManager'], function (STU, Instance, StuVariantsManager) {
    'use strict';

	/**
	 * Describe an Object representing a Variant Value
	 *
	 * @exports VariantValue
	 * @class
	 * @constructor
     * @noinstancector
     * @public
	 * @extends STU.Instance
     * @alias STU.VariantValue
	 */
    var VariantValue = function () {
        Instance.call(this);
        this.name = 'VariantValue';

	    /**
		 * native object CATI3DExpVariantValue
		 *
		 * @member
		 * @public
		 * @type {Object}
		 */
        this.CATI3DExpVariantValue = null; // valued by CATEVariant_StuIBuilder::Build


        /**
         * Returns the display Name of this variant value
         *
         * @member
         * @instance
         * @name displayName
         * @public
         * @type {string}
         * @memberof STU.VariantValue
         */
        Object.defineProperty(this, "displayName", {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.getDisplayName();
            },
            set: function (iOpacity) {
                // read only
            }
        });
    };

    VariantValue.prototype = new Instance();
    VariantValue.prototype.constructor = VariantValue;

    /**
    *  returns this's parent Variant
    *
    * @method
    * @public
    * @return {STU.Variant} the parent Variant
    */
    VariantValue.prototype.getVariant = function () {
        var myVariantsManager = StuVariantsManager.get();
        return myVariantsManager.getParentVariant(this.CATI3DExpVariantValue);
    };

    /**
    *  values this's parent Variant to this Value
    *
    * @method
    * @public
    */
    VariantValue.prototype.setAsCurrent = function () {
        //var myVariantsManager = StuVariantsManager.get();
        //myVariantsManager.setValueAsCurrent(this.CATI3DExpVariantValue);

        // IBS 01/25 all changes go through Variant.prototype.setCurrentValue
        var MyVariant = this.getVariant();
        if (MyVariant != null && MyVariant != undefined) {
            MyVariant.setCurrentValue(this);
        }
    };

    /**
    * Returns the display Name of this value
    *
    * @method
    * @public
    * @return {string} the display name of this value
    */
    VariantValue.prototype.getDisplayName = function () {
        return this['Alternative Name'];
    };

    // Expose in STU namespace.
    STU.VariantValue = VariantValue;
    return VariantValue;
});

define('StuModel/StuVariantValue', ['DS/StuModel/StuVariantValue'], function (VariantValue) {
    'use strict';
    return VariantValue;
});

