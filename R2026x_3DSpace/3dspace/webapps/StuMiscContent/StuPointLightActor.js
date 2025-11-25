define('DS/StuMiscContent/StuPointLightActor', ['DS/StuCore/StuContext', 'DS/StuMiscContent/StuLightActor', 'DS/StuCore/StuTools'], function (STU, LightActor, Tools) {
	'use strict';

    /**
     * Describe a light object.
     *
     * @exports PointLightActor
     * @class
     * @constructor
     * @noinstancector
     * @public
     * @extends STU.LightActor 
     * @memberof STU
     * @alias STU.PointLightActor
     */
	var PointLightActor = function () {

		LightActor.call(this);
        this.name = 'PointLightActor';



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
        this.solidAngle = 4 * Math.PI;

        //////////////////////////////////////////////////////////////////////////
        // Properties that should be visible in UI
        //////////////////////////////////////////////////////////////////////////

        /**
         * Get/Set point light power //deprecated
         *
         * @member
         * @instance
         * @name power
         * @public
         * @type {number}
         * @memberof STU.PointLightActor
         */
        Tools.bindVariable(this, "power", "number");
	};

    /**
     * An enumeration of all the supported reference of intensity unit ( Lumen / Candela ).<br/>
     * It allows to refer in the code to a specific key.
     *
     * @enum {number}
     * @public
     */
    PointLightActor.EIntensityUnit = {
        eLumen: 0,
        eCandela: 1
    };



	PointLightActor.prototype = new LightActor();
	PointLightActor.prototype.constructor = PointLightActor;



    // Manual function to compensate the fact that UnitIntensity is not exposed along the otehr properties.
    // Therefore, the .setIntensity & .getIntensity are here to let the user decide which intensityUnit + intensity the user would like to use to have full control.
    PointLightActor.prototype.setIntensity = function (iIntensity, iEIntensityUnit = STU.PointLightActor.EIntensityUnit.eLumen) {
        if (iIntensity !== undefined && typeof iIntensity === 'number') {
            if (0 < iIntensity && iIntensity < 1000000000) {
                if (typeof iEIntensityUnit === 'number') {

                    switch (iEIntensityUnit) {
                        case PointLightActor.EIntensityUnit.eLumen:
                            this.intensity = iIntensity;
                            break;

                        case PointLightActor.EIntensityUnit.eCandela:
                            //this.updateSolidAngle(); //not needed as the solid angle is constant for point light
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

    PointLightActor.prototype.getIntensity = function (iEIntensityUnit = STU.PointLightActor.EIntensityUnit.eLumen) {
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
                case PointLightActor.EIntensityUnit.eLumen:
                    break;

                case PointLightActor.EIntensityUnit.eCandela:
                    //this.updateSolidAngle(); //not needed as the solid angle is constant for point light
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
	STU.PointLightActor = PointLightActor;

	return PointLightActor;
});

define('StuMiscContent/StuPointLightActor', ['DS/StuMiscContent/StuPointLightActor'], function (PointLightActor) {
	'use strict';

	return PointLightActor;
});
