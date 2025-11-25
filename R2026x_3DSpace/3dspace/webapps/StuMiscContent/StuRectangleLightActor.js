define('DS/StuMiscContent/StuRectangleLightActor', ['DS/StuCore/StuContext', 'DS/StuMiscContent/StuAreaLightActor', 'DS/StuCore/StuTools'], function (STU, AreaLightActor, Tools) {
	'use strict';

    /**
     * Describe a light object.
     *
     * @exports RectangleLightActor
     * @class
     * @constructor
     * @noinstancector
     * @public
     * @extends STU.AreaLightActor 
     * @memberof STU
     * @alias STU.RectangleLightActor
     */
	var RectangleLightActor = function () {
		AreaLightActor.call(this);
		this.name = 'RectangleLightActor';



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
        this.solidAngle = 2 * Math.PI;

        /**
        * Surface of the area light
        *
        * @member
        * @private
        * @type {Number}
        */
        this.emittingSurface = this.length * 0.001 * this.height * 0.001; //what we got from model is in millimeters, we need this in SI units, so in meters

        //////////////////////////////////////////////////////////////////////////
		// Properties that should be visible in UI
		//////////////////////////////////////////////////////////////////////////

        /**
         * Get/Set rectangle light length
         *
         * @member
         * @instance
         * @name length
         * @public
         * @type {number}
         * @memberof STU.RectangleLightActor
         */
        Tools.bindVariable(this, "length", "number");

        /**
         * Get/Set rectangle light height
         *
         * @member
         * @instance
         * @name height
         * @public
         * @type {number}
         * @memberof STU.RectangleLightActor
         */
        Tools.bindVariable(this, "height", "number");
	};

	RectangleLightActor.prototype = new AreaLightActor();
	RectangleLightActor.prototype.constructor = RectangleLightActor;



    // function called to update the solid angle (do nothing as it does not evolve)
    RectangleLightActor.prototype.updateSolidAngle = function () {
    }

    // function called to update the emitting surface (as it varies in function of the dimensions)
    RectangleLightActor.prototype.updateEmittingSurface = function () {
        this.emittingSurface = this.length * 0.001 * this.height * 0.001; //what we got from model is in millimeters, we need this in SI units, so in meters
    }



	// Expose in STU namespace.
	STU.RectangleLightActor = RectangleLightActor;

	return RectangleLightActor;
});

define('StuMiscContent/StuRectangleLightActor', ['DS/StuMiscContent/StuRectangleLightActor'], function (RectangleLightActor) {
	'use strict';

	return RectangleLightActor;
});
