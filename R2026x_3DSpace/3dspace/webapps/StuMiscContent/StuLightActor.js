define('DS/StuMiscContent/StuLightActor', ['DS/StuCore/StuContext', 'DS/StuRenderEngine/StuActor3D', 'DS/StuCore/StuTools'], function (STU, Actor3D, Tools) {
	'use strict';

    /**
     * Describe a light object.
     *
     * @exports LightActor
     * @class
     * @constructor
     * @noinstancector
     * @public
     * @extends STU.Actor3D
     * @memberof STU
     * @alias STU.LightActor
     */
	var LightActor = function () {

		Actor3D.call(this);
		this.name = 'LightActor';



        //////////////////////////////////////////////////////////////////////////
        // Properties that should NOT be visible in UI
        //////////////////////////////////////////////////////////////////////////

        /**
         * Enable or disable the light actor
         *
         * @member
         * @instance
         * @name _powered
         * @private
         * @type {boolean}
         * @memberof STU.LightActor
         */
        Tools.bindVariable(this, "_powered", "boolean");

        /**
         * Get/Set intensity unit value // user should not change the intensity unit during play, useless use case
         *
         * @member
         * @instance
         * @name intensityUnit
         * @private
         * @type {number}
         * @memberof STU.LightActor
         */
        Tools.bindVariable(this, "intensityUnit", "number");

        //////////////////////////////////////////////////////////////////////////
        // Properties that should be visible in UI
        //////////////////////////////////////////////////////////////////////////

        /**
         * Get/Set cast shadows flag 
         *
         * @member
         * @instance
         * @name castShadows
         * @public
         * @type {boolean}
         * @memberof STU.LightActor
         */
        Tools.bindVariable(this, "castShadows", "boolean");

        /**
         * Get/Set color mode enum 
         *
         * @member
         * @instance
         * @name colorMode
         * @public
         * @type {STU.LightActor.EColorMode}
         * @memberof STU.LightActor
         */
        this.colorMode = null; // bind in constructor

        /**
         * Get/Set light diffuseColor 
         *
         * @member
         * @instance
         * @name diffuseColor
         * @public
         * @type {STU.Color}
         * @memberof STU.LightActor
         */
        this.diffuseColor = null; // bind in constructor

        /**
         * Get/Set temperature value 
         *
         * @member
         * @instance
         * @name temperature
         * @public
         * @type {number}
         * @memberof STU.LightActor
         */
        this.temperature = null; // bind in constructor

        /**
         * Get/Set Area intensity (named power in model)
         *
         * @member
         * @instance
         * @name intensity
         * @public
         * @type {number}
         * @memberof STU.LightActor
         */
        this.intensity = null; // bind in constructor
	};



    /**
     * An enumeration of all the supported reference of colorization ( RGB / Temperature ).<br/>
     * It allows to refer in the code to a specific key.
     *
     * @enum {number}
     * @public
     */
    LightActor.EColorMode = {
        eRGB: 0,
        eTemperature: 1
    };



	LightActor.prototype = new Actor3D();
	LightActor.prototype.constructor = LightActor;

    LightActor.prototype.onInitialize = function (oExceptions) {
        STU.Actor3D.prototype.onInitialize.call(this, oExceptions);

        // Note: binding during initialization, because binder needs access to a sub object delegate
        // that is assigned only later during the build (thus after constructor)
        Tools.bindVariableColorToColorSpec_Proxy(this, { propName: "diffuseColor", varName: "diffuseColor" });
        Tools.bindVariableEnum(this, { varName: "colorMode", propName: "colorMode", enum: STU.LightActor.EColorMode });
        Tools.bindVariableDouble(this, { varName: "power", propName: "intensity", min: 0 });
        Tools.bindVariableDouble(this, { varName: "temperature", propName: "temperature", min: 0 });
    };

    LightActor.prototype.onDispose = function () {
        STU.Actor3D.prototype.onDispose.call(this);

        Tools.removeBinding(this, 'diffuseColor');
        Tools.removeBinding(this, 'colorMode');
        Tools.removeBinding(this, 'intensity');
        Tools.removeBinding(this, 'temperature');
    };

    /**
     * @type {boolean}
     * @private
     */
	LightActor.prototype.powerOn = function () {
		this._powered = true;
	};
    /**
     * @type {boolean}
     * @private
     */
	LightActor.prototype.powerOff = function () {
		this._powered = false;
	};
    /**
     * @return {boolean}
     * @private
     */
	LightActor.prototype.isOn = function () {
		return this._powered;
	};
    /**
     * @return {boolean}
     * @private
     */
	LightActor.prototype.isOff = function () {
		return !this._powered;
	};

	// Expose in STU namespace.
	STU.LightActor = LightActor;

	return LightActor;
});

define('StuMiscContent/StuLightActor', ['DS/StuMiscContent/StuLightActor'], function (LightActor) {
	'use strict';

	return LightActor;
});
