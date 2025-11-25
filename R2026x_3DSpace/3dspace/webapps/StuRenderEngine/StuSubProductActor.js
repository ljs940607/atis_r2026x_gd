define('DS/StuRenderEngine/StuSubProductActor', ['DS/StuCore/StuContext', 'DS/StuRenderEngine/StuActor3D', 'DS/StuRenderEngine/CXPConfServices'], function (STU, Actor3D, CXPConfServices) {
	'use strict';

	/**
	 * Describe a STU.Actor3D which represents a subpart of a product which a has exposed in the experience.
	 * This object has a geometric representation which is required by some specific STU.Behavior.
	 *
     * @exports SubProductActor
	 * @class
	 * @constructor
     * @noinstancector 
	 * @public
	 * @extends STU.Actor3D
	 * @memberof STU
	 * @alias STU.SubProductActor
	 */
	var SubProductActor = function () {
		Actor3D.call(this);

		/**
		 * Override of opacity from STU.Actor3D
		 * as STU.SubProductActor doesn't have opacity.
		 *
		 * @member
		 * @instance
		 * @name opacity
		 * @private
		 * @type {number}
		 * @memberof STU.SubProductActor
		 */
		Object.defineProperty(this, 'opacity', {
			enumerable: true,
			configurable: true,
			get: function () {
				// console.error('there is no opacity on STU.SubProductActor');
				return 0;
			},
			set: function () {
				// console.error('there is no opacity on STU.SubProductActor');
			}
		});
	};

	SubProductActor.prototype = new Actor3D();
	SubProductActor.prototype.constructor = SubProductActor;


	////////////////////////////////
	////// IBS JS APIs for CONFS

    /**
    * Applies a configuration to this STU.ProductActor.
    *  
    * @method
    * @public
    * @return {boolean} TRUE if this actor is filtered (currently not active)
    */
	SubProductActor.prototype.isFilteredByConfiguration = function () {
		// get this subproduct's root product actor
		var rootActor = this;
		while (rootActor !== null && rootActor !== undefined && rootActor instanceof STU.SubProductActor) {
			rootActor = rootActor.getParent();
		}

		var myConfsManager = new CXPConfServices().build();
		return myConfsManager.isFilteredByConfiguration(rootActor.CATI3DExperienceObject, this.CATI3DExperienceObject);
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
	SubProductActor.prototype.getAssetLinkStatus = function () {
		var status = this.CATI3DExperienceObject.getAssetLinkStatus();
		return status;
	};

	////// ~ASO4 JS APIs for ASSET UPDATE
	////////////////////////////////

	////////////////////////////////
	////// DCN23 JS APIs for PLM METADATA

    /**
	 * Returns the PLM Metedata of this SubProduct Actor.
	 * Function can also be used to retrive PLM Infos from a STU.Intersection issued from a pick.
	 * 
	 * @method
	 * @public
	 * @param {STU.Intersection} [iIntersection] - the intersection of the picked occurrence
	 * @param {boolean} [iLeafElemOnly=false] - set to true to get only the PLM Infos of the lowest element picked in the list returned
	 * @return {Object} list containing the dictionnaries of PLMMetadata of all the occurences picked in the arborescense {propertyName: propertyValue}
	 */
 	SubProductActor.prototype.getPLMMetadata = function (iIntersection, iLeafElemOnly = false) {
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
	STU.SubProductActor = SubProductActor;

	return SubProductActor;
});

define('StuRenderEngine/StuSubProductActor', ['DS/StuRenderEngine/StuSubProductActor'], function (SubProductActor) {
	'use strict';

	return SubProductActor;
});
