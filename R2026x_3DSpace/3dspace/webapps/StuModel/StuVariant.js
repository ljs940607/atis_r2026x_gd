
define('DS/StuModel/StuVariant', [
    'DS/StuCore/StuContext',
    'DS/StuModel/StuInstance',
	'DS/StuModel/StuVariantsManager',
	'DS/StuModel/StuVariantValuedEvent',
	'DS/StuModel/StuVariantUnvaluedEvent'
], function (STU, Instance, StuVariantsManager, StuVariantValuedEvent, StuVariantUnvaluedEvent) {
	("use strict");

	/**
	 * Describe an Object representing an Experience Variant
	 * The variants customize the appearance of a product.
	 * They can be imported from an enovia variance dictionary or created by the user
	 *
	 * @exports Variant
	 * @class
	 * @constructor
	 * @noinstancector
	 * @public
	 * @extends STU.Instance
	 * @alias STU.Variant
	 */
	var Variant = function () {
		Instance.call(this);
		this.name = "Variant";

		/**
		 * native object CATI3DExpVariant2
		 *
		 * @member
		 * @private
		 * @type {Object}
		 */
		this.CATI3DExpVariant2 = null; // valued by CATEVariantSet_StuIBuilder::Build

		/**
		 * Variant display name
		 * this is the name that appears in the Model definition application UI
		 * this name may not be unique (several variants can have the same display name)
		 *
		 * @member
		 * @instance
		 * @name displayName
		 * @public
		 * @type {string}
		 * @memberof STU.Variant
		 */
		Object.defineProperty(this, "displayName", {
			enumerable: true,
			configurable: true,
			get: function () {
				return this.getDisplayName();
			},
			set: function (iOpacity) {
				// read only
			},
		});

		/**
		 * Variant type, see STU.Variant.EVariantType
		 *
		 * @member
		 * @instance
		 * @name type
		 * @public
		 * @type {STU.Variant.EVariantType}
		 * @memberof STU.Variant
		 */
		Object.defineProperty(this, "type", {
			enumerable: true,
			configurable: true,
			get: function () {
				return this.getType();
			},
			set: function (iOpacity) {
				// read only
			},
		});
	};

	Variant.prototype = new Instance();
	Variant.prototype.constructor = Variant;

	/**
	 * Returns the values of this Variant
	 *
	 * @method
	 * @public
	 * @return {STU.VariantValue[]} the values of this variant
	 */
	Variant.prototype.getValues = function () {
		return this["values"];
	};

	/**
	 * returns a value identified by its name
	 *
	 * @method
	 * @public
	 * @param {string} iName Name of the value to retrieve.
	 * @return {?STU.VariantValue} the variant value
	 */
	Variant.prototype.getValueByName = function (iName) {
		for (const value of this.values) {
			if (value.name === iName) {
				return value;
			}
		}
		return null;
	};

	/**
	 * returns a value identified by its display name
	 * WARNING: if display name is not unique, first value found is used
	 *
	 * @method
	 * @public
	 * @param {string} iName Name of the value to retrieve.
	 * @return {?STU.VariantValue} the variant value
	 */
		Variant.prototype.getValueByDisplayName = function (iDisplayName) {
		for (const value of this.values) {
			if (value.displayName === iDisplayName) {
				return value;
			}
		}
		return null;
	};

	/**
	 * values a Variant to a given Value, identified by its name
	 * @method
	 * @public
	 * @param {string} iName Name of the value used to value this Variant.
	 */
		Variant.prototype.setCurrentValueByName = function (iName) {
		//var myVariantsManager = StuVariantsManager.get();
		//myVariantsManager.setCurrentValueByName(this.CATI3DExpVariant2, iName);

		// IBS 01/25 all changes go through Variant.prototype.setCurrentValue
		var MyValue = this.getValueByName(iName);
		this.setCurrentValue(MyValue);
	};

	/**
	 * values the Variant to a given Value, identified by its display name
	 * WARNING: if display name is not unique, first value found is used
	 * @method
	 * @public
	 * @param {string} iDisplayName display name of the value used to value this Variant.
	 */
		Variant.prototype.setCurrentValueByDisplayName = function (iDisplayName) {
		//var myVariantsManager = StuVariantsManager.get();
		//myVariantsManager.setCurrentValueByDisplayName(this.CATI3DExpVariant2, iDisplayName);

		// IBS 01/25 all changes go through Variant.prototype.setCurrentValue
		var MyValue = this.getValueByDisplayName(iDisplayName);
		this.setCurrentValue(MyValue);
	};

	/**
	 *  values the Variant to a given Value
	 *
	 * @method
	 * @public
	 * @param {STU.VariantValue} iValue value used to value this Variant.
	 */
		Variant.prototype.setCurrentValue = function (iValue) {
		// IBS 01/25 dispatch from JS
		this.doDispatchEventJS("ValueModified", iValue);

		var myVariantsManager = StuVariantsManager.get();
		if (null === iValue) {
			myVariantsManager.unsetCurrentValue(this.CATI3DExpVariant2);
		} else {
			myVariantsManager.setCurrentValue(this.CATI3DExpVariant2, iValue.CATI3DExpVariantValue);
		}
	};

	/**
	 *  unvalues a Variant
	 *
	 * @method
	 * @public
	 */
		Variant.prototype.unsetCurrentValue = function () {
		//var myVariantsManager = StuVariantsManager.get();
		//myVariantsManager.unsetCurrentValue(this.CATI3DExpVariant2);

		// IBS 01/25 all changes go through Variant.prototype.setCurrentValue
		this.setCurrentValue(null);
	};



	/**
	 *  Values the Variant to the next value (cycles through values).
	 *  If no value is currently active, nothing is done.
	 *  If the variant is an option group and a single option is currently active: deactivates this option and activates the next option.
	 *  If no option or more than one option is currently active, nothing is done.
	 *
	 * @method
	 * @public
	 */
		Variant.prototype.setNextValue = function () {
		//var myVariantsManager = StuVariantsManager.get();
		//myVariantsManager.setNextValue(this.CATI3DExpVariant2);

		// IBS 01/25 all changes go through Variant.prototype.setCurrentValue
		var currentValue = this.getCurrentValue();
		var currentValueIndex = -1;
		for (i = 0; i < (this.values).length; i++) {
			if (currentValue === this.values[i]) {
				currentValueIndex = i;
				break;
			}
		}
		if (currentValueIndex >= 0) {
			var NextValue = this.values[(i + 1) % (this.values.length)];
			this.setCurrentValue(NextValue);
        }
	};

	/**
	 * tests if the Variant is currently set to a given Value
	 * @method
	 * @public
	 * @param {STU.VariantValue} iValue value used to compare to the current value
	 * @return {Boolean}
	 */
	Variant.prototype.isValueCurrent = function (iValue) {
		var myVariantsManager = StuVariantsManager.get();
		if (myVariantsManager.isValueCurrent(this.CATI3DExpVariant2, iValue.CATI3DExpVariantValue) == 1) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * tests if the Variant is currently set to any Value
	 *
	 * @method
	 * @public
	 * @return {Boolean}
	 */
	Variant.prototype.isNoValueCurrent = function () {
		var myVariantsManager = StuVariantsManager.get();
		if (myVariantsManager.isNoValueCurrent(this.CATI3DExpVariant2) == 1) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Returns the value at which this Variant is currently valued
	 *
	 * @method
	 * @public
	 * @return {STU.VariantValue} the variant at which this Variant is valued.
	 */
	Variant.prototype.getCurrentValue = function () {
		var myVariantsManager = StuVariantsManager.get();
		return myVariantsManager.getCurrentValue(this.CATI3DExpVariant2);
	};

	/**
	 * Returns the type of this variant
	 *
	 * @method
	 * @public
	 * @return {STU.Variant.EVariantType} the type of this variant
	 */
	Variant.prototype.getType = function () {
		var myVariantsManager = StuVariantsManager.get();
		var myType = myVariantsManager.getVariantType(this.CATI3DExpVariant2);

		var key = Object.keys(Variant.EVariantType)[myType];
		var value = Object.values(Variant.EVariantType)[myType];

		// a package created from enovia source (source type 2) is a product configuration
		// a package created by user (source type 1) is a user package
		if (value === Variant.EVariantType.ePackage) {
			if (this["Source Type"] === 2) {
				return Variant.EVariantType.eProductConfiguration;
			} else {
				return Variant.EVariantType.eUserPackage;
			}
		}

		var key = Object.keys(Variant.EVariantType)[myType];
		var value = Object.values(Variant.EVariantType)[myType];
		return value;
	};
	/**
	 * Returns the display Name of this variant
	 *
	 * @method
	 * @public
	 * @return {string} the display name of this variant
	 */
	Variant.prototype.getDisplayName = function () {
		return this["Alternative Name"];
	};

	/**
	 * useful to dispatch events from c++
	 *
	 * @private
	 */
		Variant.prototype.doDispatchEvent = function (iEventName, iValue) {
		if (iEventName == "ValueModified") {
			if (iValue === undefined || iValue === null) {
				var e = new StuVariantUnvaluedEvent();
				e.variant = this;
				e.value = null;
				e.initiator = "MODEL";
				this.dispatchEvent(e);
			} else {
				var e = new StuVariantValuedEvent();
				e.variant = this;
				e.value = iValue;
				e.initiator = "MODEL";
				this.dispatchEvent(e);
			}
		}

		// ! DEPREQ !
		if (iEventName == "OptionSet") {
			var e = new STU.VariantOptionSetEvent();
			e.option = iValue;
			this.dispatchEvent(e);
		}

		if (iEventName == "OptionUnset") {
			var e = new STU.VariantOptionUnsetEvent();
			e.option = iValue;
			this.dispatchEvent(e);
		}
		// ! DEPREQ !
		};

		/**
	 * useful to dispatch events from c++
	 *
	 * @private
	 */
		Variant.prototype.doDispatchEventJS = function (iEventName, iValue) {
		if (iEventName == "ValueModified") {
			if (iValue === undefined || iValue === null) {
				var e = new StuVariantUnvaluedEvent();
				e.variant = this;
				e.value = null;
				e.initiator = "USER";
				this.dispatchEvent(e);
			} else {
				var e = new StuVariantValuedEvent();
				e.variant = this;
				e.value = iValue;
				e.initiator = "USER";
				this.dispatchEvent(e);
			}
		}
	};


	/**
	 * Enumeration of possible variant types.
	 * see VariantType in CAT3DExpVariantDefs
	 *
	 * @readonly
	 * @enum {number}
	 * @public
	 */
	Variant.EVariantType = {
		/** the combination of all types */
		eAll: 0,
		/** type is not defined */
		eUndefined: 1,
		/** a variant driving the appearance of a material */
		eMaterial: 2,
		/** a variant driving the visibility of a product part, through a conditional variant */
		eVisibility: 3,
		/** a variant created by the user to drive the state of other variants */
		ePackage: 4,
		/** a variant resulting from the conversion of an effectivity */
		eConditional: 5,
		/** a variant resulting from the conversion of an enovia dictionary variant */
		eEnoviaDictionary: 6,
		/** a variant resulting from the conversion of an enovia dictionary option group ! DEPREQ ! */
		eOptionGroup: 7,
		/** a package variant resulting from the conversion of an enovia dictionary product configuration (as opposed to eUserPackage).
		 * eProductConfiguration is a subtype of ePackage
		 * 'type' property and getType will return the most specific type eProductConfiguration type,
		 * but ePackage can be used in ProductActor.prototype.getVariantsByType */
		eProductConfiguration: 8,
		/** a package variant created by the user (as opposed to eProductConfiguration).
		 * eUserPackage is a subtype of ePackage
		 * 'type' property and getType will return the most specific type eUserPackage type,
		 * but ePackage can be used in ProductActor.prototype.getVariantsByType */
		eUserPackage: 9,
	};

	// Expose in STU namespace.
	STU.Variant = Variant;
	return Variant;
});

define('StuModel/StuVariant', ['DS/StuModel/StuVariant'], function (Variant) {
    'use strict';

    return Variant;
});
