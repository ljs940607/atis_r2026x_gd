define('DS/StuMiscContent/StuAreaLightActor', ['DS/StuCore/StuContext', 'DS/StuMiscContent/StuLightActor', 'DS/StuCore/StuTools'], function(STU, LightActor, Tools) {
    'use strict';

    /**
     * Describe a area light object.
     *
     * @exports AreaLightActor
     * @class
     * @constructor
     * @noinstancector
     * @public
     * @extends STU.LightActor
     * @memberof STU
     * @alias STU.AreaLightActor
     */
    var AreaLightActor = function() {
        LightActor.call(this);
        this.name = 'AreaLightActor';



        //////////////////////////////////////////////////////////////////////////
        // Properties that should NOT be visible in UI
        //////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////
		// Properties that should be visible in UI
		//////////////////////////////////////////////////////////////////////////

        /**
         * Get/Set show geoemtry flag 
         *
         * @member
         * @instance
         * @name showGeometry
         * @public
         * @type {boolean}
         * @memberof STU.AreaLightActor
         */
        Tools.bindVariable(this, "showGeometry", "boolean");
    };





    /**
     * An enumeration of all the supported reference of intensity unit for area lights ( Lumen / Candela / Lumen Per Square Meter / Nit ).<br/>
     * It allows to refer in the code to a specific key.
     *
     * @enum {number}
     * @public
     */
    AreaLightActor.EIntensityUnit = {
        eLumen: 0,
        eCandela: 1,
        eLumenPerSquareMeter: 2,
        eNit: 3,
    };



    AreaLightActor.prototype = new LightActor();
    AreaLightActor.prototype.constructor = AreaLightActor;

    AreaLightActor.prototype.onInitialize = function (oExceptions) {
        STU.LightActor.prototype.onInitialize.call(this, oExceptions);

        // Note: we need to redefine this.emittingSurface after the dimensions as it depends of it.
        this.updateEmittingSurface();
    };



    ////////////////
    // Virtual functions
    ////////////////

    // Manual function to compensate the fact that UnitIntensity is not exposed along the otehr properties.
    // Therefore, the .setIntensity & .getIntensity are here to let the user decide which intensityUnit + intensity the user would like to use to have full control.
    AreaLightActor.prototype.setIntensity = function (iIntensity, iEIntensityUnit = STU.AreaLightActor.EIntensityUnit.eLumen) {
        if (iIntensity !== undefined && typeof iIntensity === 'number') {
            if (0 < iIntensity && iIntensity < 1000000000) {
                if (typeof iEIntensityUnit === 'number') {

                    switch (iEIntensityUnit) {
                        case AreaLightActor.EIntensityUnit.eLumen:
                            this.intensity = iIntensity;
                            break;

                        case AreaLightActor.EIntensityUnit.eCandela:
                            this.updateSolidAngle();
                            this.intensity = iIntensity * this.solidAngle;
                            break;

                        case AreaLightActor.EIntensityUnit.eLumenPerSquareMeter:
                            this.updateEmittingSurface();
                            this.intensity = iIntensity * this.emittingSurface;
                            break;

                        case AreaLightActor.EIntensityUnit.eNit:
                            this.updateSolidAngle();
                            this.updateEmittingSurface();
                            this.intensity = iIntensity * this.solidAngle * this.emittingSurface;
                            break;

                        default:
                            this.intensity = iIntensity; // default set it in lumen
                            console.warn('Unknown intensity unit : ' + iEIntensityUnit + " ; setted in lumen.");
                    }
                }
                else {
                    console.warn('Unknown intensity unit : ' + iEIntensityUnit + " ; nothing done.");
                }
            }
            else {
                console.warn('Exceeding intensity value : ' + iIntensity + " ; nothing done. Please use intensity as a reasonable number");
            }
        }
        else {
            console.warn('Unknown intensity value : ' + iIntensity + " ; nothing done. Please use intensity as a positive number");
        }
        return this;
    };

    AreaLightActor.prototype.getIntensity = function (iEIntensityUnit = STU.AreaLightActor.EIntensityUnit.eLumen) {
        let l_Intensity = this.intensity;

        //reset the l_Intensity to lumen ...
        switch (this.intensityUnit) {
            case AreaLightActor.EIntensityUnit.eLumen:
                break;

            case AreaLightActor.EIntensityUnit.eCandela:
                this.updateSolidAngle();
                l_Intensity = l_Intensity * this.solidAngle;
                break;

            case AreaLightActor.EIntensityUnit.eLumenPerSquareMeter:
                this.updateEmittingSurface();
                l_Intensity = l_Intensity * this.emittingSurface;
                break;

            case AreaLightActor.EIntensityUnit.eNit:
                this.updateSolidAngle();
                this.updateEmittingSurface();
                l_Intensity = (l_Intensity * this.solidAngle) * this.emittingSurface;
                break;

            default:
                console.warn('Unknown current intensity unit : ' + this.intensityUnit + " ; returned in its own unit.");
                return l_Intensity;
        }

        //actually "getting"
        if (typeof iEIntensityUnit === 'number') {

            switch (iEIntensityUnit) {
                case AreaLightActor.EIntensityUnit.eLumen:
                    break;

                case AreaLightActor.EIntensityUnit.eCandela:
                    this.updateSolidAngle();
                    l_Intensity = l_Intensity / this.solidAngle;
                    break;

                case AreaLightActor.EIntensityUnit.eLumenPerSquareMeter:
                    this.updateEmittingSurface();
                    l_Intensity = l_Intensity / this.emittingSurface;
                    break;

                case AreaLightActor.EIntensityUnit.eNit:
                    this.updateSolidAngle();
                    this.updateEmittingSurface();
                    l_Intensity = (l_Intensity / this.solidAngle) / this.emittingSurface;
                    break;

                default:
                    console.warn('Unknown intensity unit : ' + iEIntensityUnit + " ; returned in lumen.");
            }
        }
        else {
            console.warn('Unknown intensity unit : ' + iEIntensityUnit + " ; returned in lumen.");
        }
        return l_Intensity;
    };

    // Expose in STU namespace.
    STU.AreaLightActor = AreaLightActor;

    return AreaLightActor;
});

define('StuMiscContent/StuAreaLightActor', ['DS/StuMiscContent/StuAreaLightActor'], function (AreaLightActor) {
    'use strict';

    return AreaLightActor;
});
