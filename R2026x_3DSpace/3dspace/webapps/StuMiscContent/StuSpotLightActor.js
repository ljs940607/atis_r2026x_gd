define('DS/StuMiscContent/StuSpotLightActor', ['DS/StuCore/StuContext', 'DS/StuMiscContent/StuLightActor', 'DS/StuCore/StuTools'], function (STU, LightActor, Tools) {
	'use strict';

    /**
     * Describe a light object.
     *
     * @exports SpotLightActor
     * @class
     * @constructor
     * @noinstancector
     * @public
     * @extends STU.LightActor 
     * @memberof STU
     * @alias STU.SpotLightActor
     */
	var SpotLightActor = function () {
		LightActor.call(this);
		this.name = 'SpotLightActor';



        //////////////////////////////////////////////////////////////////////////
        // Properties that should NOT be visible in UI
        //////////////////////////////////////////////////////////////////////////

        /**
        * Solid angle of the light
        *
        * @member
        * @private
        * @type {Number}
        */
        this.solidAngle = 2 * Math.PI * (1 - Math.cos(this.outerAngle * (Math.PI / 180))); //what we got from model is in degree, we need this in SI units, so in radian

        //////////////////////////////////////////////////////////////////////////
		// Properties that should be visible in UI
		//////////////////////////////////////////////////////////////////////////

        /**
         * Get/Set spot light outer angle in degrees
         *
         * @member
         * @instance
         * @name outerAngle
         * @public
         * @type {number}
         * @memberof STU.SpotLightActor
         */
		Tools.bindVariable(this, "outerAngle", "number");

        /**
         * Get/Set spot light inner angle in degrees
         *
         * @member
         * @instance
         * @name innerAngle
         * @public
         * @type {number}
         * @memberof STU.SpotLightActor
         */
        Tools.bindVariable(this, "innerAngle", "number");

        /**
         * Get/Set spot light power //deprecated
         *
         * @member
         * @instance
         * @name power
         * @public
         * @type {number}
         * @memberof STU.SpotLightActor
         */
        this.power = null; // bind in constructor
	};

    /**
     * An enumeration of all the supported reference of intensity unit ( Lumen / Candela ).<br/>
     * It allows to refer in the code to a specific key.
     *
     * @enum {number}
     * @public
     */
    SpotLightActor.EIntensityUnit = {
        eLumen: 0,
        eCandela: 1
    };

	SpotLightActor.prototype = new LightActor();
	SpotLightActor.prototype.constructor = SpotLightActor;

    SpotLightActor.prototype.onInitialize = function (oExceptions) {
        STU.LightActor.prototype.onInitialize.call(this, oExceptions);

        // Note: binding during initialization, because binder needs access to a sub object delegate
        // that is assigned only later during the build (thus after constructor)
        Tools.bindVariableDouble(this, { varName: "power", propName: "power", min: 0 });
    };


    // function called to update the solid angle (as it varies in function of the dimensions)
    SpotLightActor.prototype.updateSolidAngle = function () {
        this.solidAngle = 2 * Math.PI * (1 - Math.cos(this.outerAngle * (Math.PI / 180) /2 )); //what we got from model is in degree, we need this in SI units, so in radian
    };


    // Manual function to compensate the fact that UnitIntensity is not exposed along the otehr properties.
    // Therefore, the .setIntensity & .getIntensity are here to let the user decide which intensityUnit + intensity the user would like to use to have full control.
    SpotLightActor.prototype.setIntensity = function (iIntensity, iEIntensityUnit = STU.SpotLightActor.EIntensityUnit.eLumen) {
        if (iIntensity !== undefined && typeof iIntensity === 'number') {
            if (0 < iIntensity && iIntensity < 1000000000) {
                if (typeof iEIntensityUnit === 'number') {

                    switch (iEIntensityUnit) {
                        case SpotLightActor.EIntensityUnit.eLumen:
                            this.intensity = iIntensity;
                            break;

                        case SpotLightActor.EIntensityUnit.eCandela:
                            this.updateSolidAngle();
                            this.intensity = iIntensity * this.solidAngle;
                            break;

                        default:
                            this.intensity = iIntensity; // default set it in lumen
                            console.error('Unknown intensity unit : ' + iEIntensityUnit + " ; setted in lumen.");
                    }
                }
                else {
                    console.error('Unknown intensity unit : ' + iEIntensityUnit + " ; nothing done.");
                }
            }
            else {
                console.error('Exceeding intensity value : ' + iIntensity + " ; nothing done. Please use intensity as a reasonable number");
            }
        }
        else {
            console.error('Unknown intensity value : ' + iIntensity + " ; nothing done. Please use intensity as a positive number");
        }
        return this;
    };

    SpotLightActor.prototype.getIntensity = function (iEIntensityUnit = STU.SpotLightActor.EIntensityUnit.eLumen) {
        let l_Intensity = this.intensity;

        //reset the l_Intensity to lumen ...
        switch (this.intensityUnit) {
            case SpotLightActor.EIntensityUnit.eLumen:
                break;

            case SpotLightActor.EIntensityUnit.eCandela:
                this.updateSolidAngle();
                l_Intensity = l_Intensity * this.solidAngle;
                break;

            default:
                console.error('Unknown current intensity unit : ' + this.intensityUnit + " ; returned in its own unit.");
                return l_Intensity;
        }

        if (typeof iEIntensityUnit === 'number') {

            switch (iEIntensityUnit) {
                case SpotLightActor.EIntensityUnit.eLumen:
                    break;

                case SpotLightActor.EIntensityUnit.eCandela:
                    this.updateSolidAngle();
                    l_Intensity = l_Intensity / this.solidAngle;
                    break;

                default:
                    console.error('Unknown intensity unit : ' + iEIntensityUnit + " ; returned in lumen.");
            }
        }
        else {
            console.error('Unknown intensity unit : ' + iEIntensityUnit + " ; returned in lumen.");
        }
        return l_Intensity;
    };


	// Expose in STU namespace.
	STU.SpotLightActor = SpotLightActor;

	return SpotLightActor;
});

define('StuMiscContent/StuSpotLightActor', ['DS/StuMiscContent/StuSpotLightActor'], function (SpotLightActor) {
	'use strict';

	return SpotLightActor;
});
