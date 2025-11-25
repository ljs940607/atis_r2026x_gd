define('DS/StuMiscContent/StuDirectionalLightActor', ['DS/StuCore/StuContext', 'DS/StuMiscContent/StuLightActor', 'DS/StuCore/StuTools'], function (STU, LightActor, Tools) {
	'use strict';

    /**
     * Describe a light object.
     *
     * @exports DirectionalLightActor
     * @class
     * @constructor
     * @noinstancector
     * @public
     * @extends STU.LightActor
     * @memberof STU
     * @alias STU.DirectionalLightActor
     */
	var DirectionalLightActor = function () {

		LightActor.call(this);
        this.name = 'DirectionalLightActor';



        //////////////////////////////////////////////////////////////////////////
        // Properties that should be visible in UI
        //////////////////////////////////////////////////////////////////////////

        /**
         * Get/Set directional light power //deprecated
         *
         * @member
         * @instance
         * @name power
         * @public
         * @type {number}
         * @memberof STU.DirectionalLightActor
         */
        Tools.bindVariable(this, "power", "number");
	};

    /**
     * An enumeration of all the supported reference of intensity unit ( Lux ).<br/>
     * It allows to refer in the code to a specific key.
     *
     * @enum {number}
     * @public
     */
    DirectionalLightActor.EIntensityUnit = {
        eLux: 0
    };

	DirectionalLightActor.prototype = new LightActor();
	DirectionalLightActor.prototype.constructor = DirectionalLightActor;

    // Manual function to compensate the fact that UnitIntensity is not exposed along the otehr properties.
    // Therefore, the .setIntensity & .getIntensity are here to let the user decide which intensityUnit + intensity the user would like to use to have full control.
    DirectionalLightActor.prototype.setIntensity = function (iIntensity, iEIntensityUnit = STU.DirectionalLightActor.EIntensityUnit.eLux) {
        if (iIntensity !== undefined && typeof iIntensity === 'number') {
            if (0 < iIntensity && iIntensity < 1000000000) {
                if (typeof iEIntensityUnit === 'number') {

                    switch (iEIntensityUnit) {
                        case DirectionalLightActor.EIntensityUnit.eLux:
                            this.intensity = iIntensity;
                            break;

                        default:
                            this.intensity = iIntensity; // default set it in lumen
                            console.error('Unknown intensity unit : ' + iEIntensityUnit + " ; setted in lux.");
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

    DirectionalLightActor.prototype.getIntensity = function (iEIntensityUnit = STU.DirectionalLightActor.EIntensityUnit.eLux) {
        let l_Intensity = this.intensity;
        if (typeof iEIntensityUnit === 'number') {

            switch (iEIntensityUnit) {
                case DirectionalLightActor.EIntensityUnit.eLux:
                    break;

                default:
                    console.error('Unknown intensity unit : ' + iEIntensityUnit + " ; returned in lux.");
            }
        }
        else {
            console.error('Unknown intensity unit : ' + iEIntensityUnit + " ; returned in lux.");
        }
        return l_Intensity;
    };

	// Expose in STU namespace.
	STU.DirectionalLightActor = DirectionalLightActor;

	return DirectionalLightActor;
});

define('StuMiscContent/StuDirectionalLightActor', ['DS/StuMiscContent/StuDirectionalLightActor'], function (DirectionalLightActor) {
	'use strict';

	return DirectionalLightActor;
});
