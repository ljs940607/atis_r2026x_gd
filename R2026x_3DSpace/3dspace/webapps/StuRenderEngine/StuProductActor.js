
define('DS/StuRenderEngine/StuProductActor', ['DS/StuCore/StuContext', 'DS/StuRenderEngine/StuActor3D', 'DS/StuRenderEngine/CXPConfServices', 'DS/StuModel/StuVariantsManager',], function (STU, Actor3D, CXPConfServices, StuVariantsManager) {
	'use strict';

    /**
	 * Describe a STU.Actor3D which represents a Product imported in the experience.
	 * This object has a geometric representation which is required by some specific STU.Behavior.
	 *
     * @exports ProductActor
	 * @class
	 * @constructor
     * @noinstancector 
	 * @public
	 * @extends STU.Actor3D
	 * @memberof STU
	 * @alias STU.ProductActor
	 */
	var ProductActor = function () {

		Actor3D.call(this);

		//this.CATICXPProductConfigMgr;

        /**
		 * Override of opacity from STU.Actor3D
		 * as STU.ProductActor doesn't have opacity.
		 *
		 * @member
		 * @instance
		 * @name opacity
		 * @private
		 * @type {number}
		 * @memberof STU.ProductActor
		 */
		Object.defineProperty(this, "opacity", {
			enumerable: true,
			configurable: true,
			get: function () {
				return 0;
			},
			set: function (iOpacity) {
				// console.warn('There is no opacity on STU.ProductActor');
			}
		});



        /**
		 * Set the current config of this STU.ProductActor.
		 *
		 * @member
		 * @instance
		 * @name currentConfiguration
		 * @public
		 * @type {Object}
		 * @memberof STU.ProductActor
		 */
		Object.defineProperty(this, 'currentConfiguration', {
			enumerable: true,
			configurable: true,
			get: function () {
				var myConfsManager = new CXPConfServices().build();
				return myConfsManager.getConfiguration(this.CATI3DExperienceObject);
			},
			set: function (iConfig) {
				var myConfsManager = new CXPConfServices().build();
				myConfsManager.setConfiguration(this.CATI3DExperienceObject, iConfig.CATI3DExperienceObject);
				myConfsManager.checkActivations(this.CATI3DExperienceObject);
			}
		});

	};

	ProductActor.prototype = new Actor3D();
	ProductActor.prototype.constructor = ProductActor;

    /**
     * Process executed when STU.ProductActor is activating.
     *
     * @method
     * @private
     */
	ProductActor.prototype.onInitialize = function (oExceptions) {
		Actor3D.prototype.onInitialize.call(this, oExceptions);

        if (this.variants !== undefined && this.variants !== null) {
            for (var i = 0; i < this.variants.length; i++) {
                this.variants[i].initialize(oExceptions);
            }
        }

		if (this._exposedConfigurations == undefined) return;
		// if the block is empty it is considered as executed
		for (var i = 0; i < this['_exposedConfigurations'].length; i++) {
			this['_exposedConfigurations'][i].initialize();
		}

    };

    /**
    * Process to execute when this STU.ProductActor is disposing.
    *
    * @method
    * @private
    */
    ProductActor.prototype.onDispose = function () {
        Actor3D.prototype.onDispose.call(this);

        if (this.variants !== undefined && this.variants !== null) {
            for (var i = this.variants.length - 1; i >= 0; i--) {
                this.variants[i].dispose();
            }
        }
    }

    /**
     * Process executed when STU.ProductActor is activating.
     *
     * @method
     * @private
     */
	ProductActor.prototype.onActivate = function (oExceptions) {
		Actor3D.prototype.onActivate.call(this, oExceptions);

        if (this.variants !== undefined && this.variants !== null) {
            for (var i = 0; i < this.variants.length; i++) {
                this.variants[i].updateActivity(oExceptions);
            }
        }

		// if the block is empty it is considered as executed
		if (this._exposedConfigurations == undefined) return;
		for (var i = 0; i < this['_exposedConfigurations'].length; i++) {
			this['_exposedConfigurations'][i].updateActivity(oExceptions);
        }
	};

    /**
    * Process executed when STU.ProductActor is deactivating.
    *
    * @method
    * @private
    */
    ProductActor.prototype.onDeactivate = function (oExceptions) {
        Actor3D.prototype.onDeactivate.call(this, oExceptions);

        if (this.variants !== undefined && this.variants !== null) {
            for (var i = this.variants.length - 1; i >= 0; i--) {
                this.variants[i].updateActivity();
            }
        }
    };

	////////////////////////////////
	////// IBS PUBLIC JS APIs for CONFS

    /**
	 * Returns the configuration applied to this STU.ProductActor.
	 *
	 * @method
	 * @public
	 * @return {STU.ProductConfiguration} the configuration applied to this STU.ProductActor at the time of the call
	 */
	ProductActor.prototype.getCurrentConfiguration = function () {
		var myConfsManager = new CXPConfServices().build();
		return myConfsManager.getConfiguration(this.CATI3DExperienceObject);
	};

    /**
	 * Removes all configurations applied to this STU.ProductActor.
	 *
	 * @method
	 * @public
	 */
	ProductActor.prototype.removeCurrentConfiguration = function () {
		var myConfsManager = new CXPConfServices().build();
		myConfsManager.removeConfiguration(this.CATI3DExperienceObject);
		myConfsManager.checkActivations(this.CATI3DExperienceObject);
	};

    /**
	 * Applies a configuration to this STU.ProductActor.
	 *
	 * @method
	 * @public
     * @param {STU.ProductConfiguration} iConf Configuration to apply to this STU.ProductActor.
	 */
	ProductActor.prototype.setCurrentConfiguration = function (iConf) {
		var myConfsManager = new CXPConfServices().build();
		myConfsManager.setConfiguration(this.CATI3DExperienceObject, iConf.CATI3DExperienceObject);
		myConfsManager.checkActivations(this.CATI3DExperienceObject);
	};

    /**
	 * Returns the list of configurations exposed on this STU.ProductActor.
	 *
	 * @method
	 * @public
     * @return {STU.ProductConfiguration[]} the exposed configurations on this STU.ProductActor.
	 */
	ProductActor.prototype.getConfigurations = function () {
		return this._exposedConfigurations;
	};


	////////////////////////////////
	////// IBS PRIVATE JS APIs for CONFS (ODTs)

    /**
      * Applies a configuration, identified by its name, to this STU.ProductActor.
      *
      * @method
      * @private
      * @param {string} iName Name of the configuration to apply to this actor.
      */
	ProductActor.prototype.setCurrentConfigurationByName = function (iName) {
		var myConfsManager = new CXPConfServices().build();
		myConfsManager.setConfigurationByName(this.CATI3DExperienceObject, iName);
		myConfsManager.checkActivations(this.CATI3DExperienceObject);
	};
    /**
    * Returns the name of the applied configuration to this STU.ProductActor.
    *
    * @method
    * @private
    * @return {string} the configuration name; empty string if no configuration is found.
    */
	ProductActor.prototype.getCurrentConfigurationName = function () {
		var myConfsManager = new CXPConfServices().build();
		return myConfsManager.getCurrentConfigurationName(this.CATI3DExperienceObject);
	};

	////// ~IBS JS APIs for CONFS
	////////////////////////////////

	////////////////////////////////
	////// ASO4 PRIVATE JS APIs for ASSET UPDATE

    /**
    * Retrieve the object�s status relative to its asset link.
    *  
    * @method
    * @private
    * @return {STU.Actor3D.EAssetLinkStatus} enum describing the status of the object�s asset link
    */
	ProductActor.prototype.getAssetLinkStatus = function () {
		var status = this.CATI3DExperienceObject.getAssetLinkStatus();
		return status;
	};

	////// ~ASO4 JS APIs for ASSET UPDATE
	////////////////////////////////




    ////////////////////////////////
	////// JS APIs for VARIANTS

    /**
            * Returns a Variant identified by its name, defined in the context of this Product Actor
            * @method
            * @public
			* @param {String} [iName] the name of the variant
            * @return {STU.Variant}
            */
    ProductActor.prototype.getVariantByName = function (iName) {
        var myVariantsManager = StuVariantsManager.get();
        return myVariantsManager.getVariantByNameInContext(this.CATI3DExperienceObject, iName);
    }

    /**
        * Returns a Variant identified by its display name, defined in the context of this Product Actor
        * WARNING: if display name is not unique, first variant found is returned
        * @method
        * @public
		* @param {String} [iDisplayName] the display name of the variant
        * @return {STU.Variant}
        */
    ProductActor.prototype.getVariantByDisplayName = function (iDisplayName) {
        var myVariantsManager = StuVariantsManager.get();
        return myVariantsManager.getVariantByDisplayNameInContext(this.CATI3DExperienceObject, iDisplayName);
    }

    /**
        * Returns an array of all the Variants of a given type, defined in the context of this Product Actor
        * @method
        * @public
        * @param {STU.Variant.EVariantType} iType type of the returned variants
        * @return {STU.Variant[]}
        */
    ProductActor.prototype.getVariantsByType = function (iType) {
        var typeVariants = [];
        for (const variant of this.variants) {
			if (variant.getType() === iType
				|| iType === STU.Variant.EVariantType.eAll
				|| iType === STU.Variant.EVariantType.ePackage && variant.getType() === STU.Variant.EVariantType.eProductConfiguration
				|| iType === STU.Variant.EVariantType.ePackage && variant.getType() === STU.Variant.EVariantType.eUserPackage) {
                typeVariants.push(variant);
            }
        }
        return typeVariants;
    }










	////////////////////////////////
	////// DCN23 JS APIs for PLM METADATA

	/**
	 * Returns the PLM Metedata of this Product Actor.
	 * Function can also be used to retrive PLM Infos from a STU.Intersection issued from a pick.
	 * 
	 * @method
	 * @public
	 * @param {STU.Intersection} [iIntersection] - the intersection of the picked occurrence
	 * @param {boolean} [iLeafElemOnly=false] - set to true to get only the PLM Infos of the lowest element picked in the list returned
	 * @return {Object} list containing the dictionnaries of PLMMetadata of all the occurences picked in the arborescense {propertyName: propertyValue}
	 */
	ProductActor.prototype.getPLMMetadata = function (iIntersection, iLeafElemOnly = false) {
		// Initialize PLMServices if not already done
		if (!this.PLMServices) {
			this.PLMServices = this.buildPLMServices();
		}

		// Internal function to extract properties from a given object (itself or as argument)
		const extractPLMProperties = (source) => {
			const targetPLMProperties = {};
			const propertiesNames = this.PLMServices.GetPLMProperties(source);

			for (const propName of propertiesNames) {
				targetPLMProperties[propName] = this.PLMServices.GetPLMPropValue(source, propName);
			}

			return targetPLMProperties;
		};

		// Working as a service
		if (iIntersection && iIntersection._occurence) {
			var PLMDataHolderList = [];

			if (iLeafElemOnly) {
				PLMDataHolderList.push(extractPLMProperties(iIntersection._occurence[0]));
			}
			else {
				for (var holder of iIntersection._occurence) {
					PLMDataHolderList.push(extractPLMProperties(holder));
				}
			}
			
			return PLMDataHolderList;
		}

		// Cache properties if not already done
		if (!this.PLMProperties) {
			this.PLMProperties = extractPLMProperties(this.CATI3DExperienceObject);
		}

		return this.PLMProperties;
    }

	////// ~DCN23 JS APIs for PLM METADATA
	////////////////////////////////










	// Expose in STU namespace.
	STU.ProductActor = ProductActor;

	return ProductActor;
});

define('StuRenderEngine/StuProductActor', ['DS/StuRenderEngine/StuProductActor'], function (ProductActor) {
	'use strict';

	return ProductActor;
});
