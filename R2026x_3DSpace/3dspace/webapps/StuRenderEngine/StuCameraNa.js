define('DS/StuRenderEngine/StuCameraNa', ['DS/StuCore/StuContext', 'DS/StuRenderEngine/StuActor3D', 'DS/MathematicsES/MathsDef', 'DS/StuCore/StuEnvServices'], function (STU, Actor3D, DSMath, StuEnvServices) {
	("use strict");

	var getterSetter = function (self, varName, iStorageVar, iMin, iMax, raytraceFlag) {
		if (!STU.isEKIntegrationActive()) {
			Object.defineProperty(self, varName, {
				enumerable: true,
				configurable: true,
				get: function () {
					//Get Value from model is expensive...
					//if (self.CATI3DExperienceObject !== undefined && self.CATI3DExperienceObject !== null) {
					//    return self.CATI3DExperienceObject.GetValueByName(varName);
					//}
					if (iStorageVar !== null && iStorageVar !== undefined) {
						//console.log("Retrieve " + varName +" using stored var --> " + iStorageVar);
						return iStorageVar;
					} else if (self.CATI3DExperienceObject !== undefined && self.CATI3DExperienceObject !== null) {
						//console.log("Retrieve " + varName +" using model binding");
						return self.CATI3DExperienceObject.GetValueByName(varName);
					} else {
						return null;
					}
				},
				set: function (value) {
					// Clamping condition
					if (iMin !== null && iMin !== undefined && iMax !== null && iMax !== undefined) {
						value = Math.min(Math.max(value, iMin), iMax);
					}

					if (
						/*iStorageVar !== null && iStorageVar !== undefined && value !== iStorageVar && */ value !==
							null &&
						value !== undefined
					) {
						//iStorageVar = value;
						//Set Value for visu impact
						if (self.CATI3DExperienceObject !== undefined && self.CATI3DExperienceObject !== null) {
							iStorageVar = value;
							self.CATI3DExperienceObject.SetValueByName(varName, value);
						}
					}

					//Specific action to set Raytrace wrapper (usefull for raytrace behavior)
					if (
						self.Raytrace !== null &&
						self.Raytrace !== undefined &&
						raytraceFlag !== null &&
						raytraceFlag !== undefined
					) {
						self._raytraceUpdateFlag |= raytraceFlag;
					}
				},
			});
		}
	};

	var getterSetterPostProcess = function (self, varName, iStorageVar) {
		if (!STU.isEKIntegrationActive()) {
			Object.defineProperty(self, varName, {
				enumerable: true,
				configurable: true,
				get: function () {
					if (iStorageVar !== null && iStorageVar !== undefined) {
						return iStorageVar;
					} else if (self.CATI3DExperienceObject !== undefined && self.CATI3DExperienceObject !== null) {
						return self.CATI3DExperienceObject.GetValueByName(varName);
					} else return null;
				},
				set: function (value) {
					if (self.CATI3DExperienceObject !== undefined && self.CATI3DExperienceObject !== null) {
						iStorageVar = value;
						self.CATI3DExperienceObject.SetValueByName(varName, value);
					}
					
					var event = new STU.CameraPostProcessEvent();
					EP.EventServices.dispatchEvent(event);
				}
			});
		}
	};

	var log2 = function log2(x) {
		return Math.log(x) / Math.LN2;
	};

	/**
	 * Describe a camera.
	 *
	 * @exports Camera
	 * @class
	 * @constructor
	 * @noinstancector
	 * @public
	 * @extends {STU.Actor3D}
	 * @memberof STU
	 * @alias STU.Camera
	 */
	var Camera = function () {
		Actor3D.call(this);
		this.componentInterface = this.protoId;
		this.name = "Camera";

		// interpolation
		this._isSwitching = false;
		this._previousIsSwitching = false;

		//var myEnvServices = new StuEnvServices();
		this._CXP_CAMERA_VIEWANGLE_V2 = StuEnvServices.CATGetEnv("_CXP_CAMERA_VIEWANGLE_V2");

		//////////////////////////////////////////////////////////////////////////
		// Properties that should be visible in UI
		//////////////////////////////////////////////////////////////////////////

		/**
		 * Near clip distance in mm
		 *
		 * @member
		 * @instance
		 * @name nearClip
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._nearClip = 1000.0;
		getterSetter(this, "nearClip", this._nearClip); //this.nearClip = 1000.0;

		/**
		 * Far clip distance in mm
		 *
		 * @member
		 * @instance
		 * @name farClip
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._farClip = 1000000.0;
		getterSetter(this, "farClip", this._farClip); //this.farClip = 1000000.0;

		/**
		 * View angle in degrees.
		 * Only available in perspective projection type.
		 * Updating view angle updates as well focal length.
		 *
		 * @member
		 * @instance
		 * @name viewAngle
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._viewAngle = 45.0;
		getterSetter(this, "viewAngle", this._viewAngle); //this.viewAngle = 45.0;

		/**
		 * Focal length in mm.
		 * Only available in perspective projection type.
		 * Updating focal length updates as well view angle.
		 *
		 * @member
		 * @instance
		 * @name focalLength
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		Object.defineProperty(this, "focalLength", {
			enumerable: true,
			configurable: true,
			get: function () {
				var new_version = this._CXP_CAMERA_VIEWANGLE_V2 || this._version > 422000;
				var deg2rad = Math.PI / 180;
				var d = new_version ? 24 : 36;
				return d / (2 * Math.tan(this.viewAngle * deg2rad));
			},
			set: function (iValue) {
				var new_version = this._CXP_CAMERA_VIEWANGLE_V2 || this._version > 422000;
				var d = new_version ? 24 : 36;
				var rad2deg = 180 / Math.PI;
				this.viewAngle = Math.atan(d / (2 * iValue)) * rad2deg;
			},
		});

		/**
		 * Camera projection type :
		 *  0 -> Perspective
		 *  1 -> Parallel
		 *
		 * @member
		 * @instance
		 * @name projectionType
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._projectionType = 0;
		getterSetter(this, "projectionType", this._projectionType); //this.projectionType = 0;

		/**
		 * Camera zooming factor
		 * Only available in parallel projection type
		 *
		 * @member
		 * @instance
		 * @name zoom
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._zoom = 0.0;
		getterSetter(this, "zoom", this._zoom); //this.zoom = 0.0;

		/**
		 * Automaticallycompute the nearClip and farClip
		 * When activate, the nearClip and farClip are disabled
		 *
		 * @member
		 * @instance
		 * @name enableAutomaticClipping
		 * @public
		 * @type {Boolean}
		 * @memberof STU.Camera
		 */
		this._enableAutomaticClipping = null;
		getterSetter(this, "enableAutomaticClipping", this._enableAutomaticClipping);

		/**
		 * The aperture specifies the amount of light you want on your object.<br/>
		 * The value lies between 1 to &infin;. The higher the value, the sharper the image. The lower the value, the more blurred the objects out of the focus.<br/>
		 * Use Raytrace.InfinityAperture to set aperture to infinity.
		 *
		 * @member
		 * @instance
		 * @name aperture
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._aperture = null; //8.0;
		if (!STU.isEKIntegrationActive()) {
			Object.defineProperty(this, "aperture", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this._aperture === null || this._aperture === undefined) {
						this._aperture = this.CATI3DExperienceObject.GetValueByName("aperture");
					}
					return this._aperture;
				},
				set: function (iAperture) {
					var EV = 0;
					if (this.aperture == 0) EV = log2((8.0 * 8.0) / this.speed);
					else EV = log2((this.aperture * this.aperture) / this.speed);

					var oldCorrection = EV + this.exposure;

					iAperture = iAperture < 1 && iAperture !== 0 ? 1 : iAperture;

					if (iAperture == 0) EV = log2((8.0 * 8.0) / this.speed);
					else EV = log2((iAperture * iAperture) / this.speed);

					var newCorrection = EV + this.exposure;

					this.exposure += newCorrection - oldCorrection;

					this._aperture = iAperture;
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						this.CATI3DExperienceObject.SetValueByName("aperture", iAperture);
					}

					//Specific action to set Raytrace wrapper
					if (this.Raytrace !== null && this.Raytrace !== undefined) {
						this._raytraceUpdateFlag |= Camera.RaytraceOption.eAperture;
					}
				},
			});
		}

		/**
		 * The speed refers to the shutter speed. <br/>
		 * The value lies between 1/4000s and 1s. The higher the value, the darker the image.
		 *
		 * @member
		 * @instance
		 * @name speed
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		//getterSetter(this, "speed", 0.0025, 1, Camera.RaytraceOption.eSpeed);
		this._speed = null; //0.008;
		if (!STU.isEKIntegrationActive()) {
			Object.defineProperty(this, "speed", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this._speed === null || this._speed === undefined) {
						this._speed = this.CATI3DExperienceObject.GetValueByName("speed");
					}
					return this._speed;
				},
				set: function (iSpeed) {
					var EV = 0;
					if (this.aperture == 0) EV = log2((8.0 * 8.0) / this.speed);
					else EV = log2((this.aperture * this.aperture) / this.speed);

					var oldCorrection = EV + this.exposure;

					//iSpeed = Math.min(Math.max(iSpeed, 0.00025), 1);

					if (this.aperture == 0) EV = log2((8.0 * 8.0) / iSpeed);
					else EV = log2((this.aperture * this.aperture) / iSpeed);

					var newCorrection = EV + this.exposure;

					this.exposure += newCorrection - oldCorrection;

					//console.log(this.exposure);

					this._speed = iSpeed;
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						this.CATI3DExperienceObject.SetValueByName("speed", iSpeed);
					}

					//Specific action to set Raytrace wrapper
					if (this.Raytrace !== null && this.Raytrace !== undefined) {
						this._raytraceUpdateFlag |= Camera.RaytraceOption.eSpeed;
					}
				},
			});
		}

		/**
		 * If true, aperture speed and exposure are used to tune visu exposure
		 * If false, default exposure is used
		 *
		 * @member
		 * @instance
		 * @name enableExposure
		 * @public
		 * @type {Boolean}
		 * @memberof STU.Camera
		 */
		this._enableExposure = null;
		getterSetter(this, "enableExposure", this._enableExposure); //this.enableExposure = false;

		/**
		 * The exposure allows you to control the amount of light that determines the brightness of the image. <br/>
		 * The value lies between -9 and 9.
		 *
		 * @member
		 * @instance
		 * @name  exposure
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._exposure = null;
		getterSetter(this, "exposure", this._exposure, -9, 9, Camera.RaytraceOption.eExposure);
		//Object.defineProperty(this, 'exposure', {
		//    enumerable: true,
		//    configurable: true,
		//    get: function () {
		//        return this._exposure;
		//    },
		//    set: function (iExposure) {
		//        this._exposure = Math.min(Math.max(iExposure, -9), 9);

		//        this.CATI3DExperienceObject.SetValueByName("exposure", this._exposure);
		//        //Specific action to set Raytrace wrapper
		//        if (this.Raytrace !== null && this.Raytrace !== undefined) {
		//            this._raytraceUpdateFlag |= Camera.RaytraceOption.eExposure;
		//        }
		//    }
		//});

		/**
		 * If true, aperture and focusDistance are used to compute the depth of field
		 * If false, the depth of field is infinite
		 *
		 * @member
		 * @instance
		 * @name enableDepthOfField
		 * @public
		 * @type {Boolean}
		 * @memberof STU.Camera
		 */
		this._enableDepthOfField = null;
		getterSetter(this, "enableDepthOfField", this._enableDepthOfField); //this.enableDepthOfField = false;

		/**
		 * Focus distance (in mm) from the camera, used for depth of field computation and display
		 *
		 * @member
		 * @instance
		 * @name focusDistance
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._focusDistance = 1000.0;
		Object.defineProperty(this, "focusDistance", {
			enumerable: true,
			configurable: true,
			get: function () {
				return this._focusDistance;
			},
			set: function (iDistance) {
				this._focusDistance = iDistance >= 0 ? iDistance : 0;

				if (!STU.isEKIntegrationActive()) {
					this.CATI3DExperienceObject.SetValueByName("focusDistance", this._focusDistance);
				}

				//Specific action to set Raytrace wrapper
				if (this.Raytrace !== null && this.Raytrace !== undefined) {
					this._raytraceUpdateFlag |= Camera.RaytraceOption.eFocus;
				}
			},
		});

		/**
		 * Enable a glow effect on the global vizualization.
		 *
		 * @member
		 * @instance
		 * @name enableGlow
		 * @public
		 * @type {Boolean}
		 * @memberof STU.Camera
		 */
		this._enableGlow = null;
		getterSetter(this, "enableGlow", this._enableGlow); //this.enableGlow = false;

		/**
		 * Intensity of the glow effect on the global light vizualization.
		 *
		 * @member
		 * @instance
		 * @name glowIntensity
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._glowIntensity = null;
		getterSetter(this, "glowIntensity", this._glowIntensity); //this.glowIntensity = 0.0;

		/**
		 * If true, applies tone mapping values defined below
		 * If false, default visu tone mapping values
		 *
		 * @member
		 * @instance
		 * @name enableToneMapping
		 * @public
		 * @type {Boolean}
		 * @memberof STU.Camera
		 */
		this._enableToneMapping = null;
		getterSetterPostProcess(this, 'enableToneMapping', this._enableToneMapping); //this.enableToneMapping = false;

		/**
		 * Tone mapping mode to use
		 * If equal to 0, Photographic tone mapping
		 * If equal to 1, Filmic tone mapping
		 *
		 * @member
		 * @instance
		 * @name toneMapping
		 * @publicCamera
		 * @type {STU.Camera.ToneMappingMode}
		 * @memberof STU.Camera
		 */
		this._toneMapping = null;
		getterSetterPostProcess(this, 'toneMapping', this._toneMapping); //this.toneMapping = 0;

		/**
		 * Give more details to dark area.
		 * Note: this property is only available for Photographic tone mapping
		 *
		 * @member
		 * @instance
		 * @name blacks
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._blacks = null;
		getterSetterPostProcess(this, 'blacks', this._blacks); //this.blacks = 0.0;

		/**
		 * Give more details to bright area.
		 * Note: this property is only available for Photographic tone mapping
		 *
		 * @member
		 * @instance
		 * @name whites
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._whites = null;
		getterSetterPostProcess(this, 'whites', this._whites); //this.whites = 0.0;


		/**
		 * Desaturate under 1 down to 0 for black and white picture.
		 * Note: this property is only available for Photographic tone mapping
		 *
		 * @member
		 * @instance
		 * @name saturation
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._saturation = null;
		getterSetterPostProcess(this, 'saturation', this._saturation); //this.saturation = 0.0;

		/**
		 * Impacts the bright values.
		 * Adjusts the scale of the shoulder part of the tone mapping curve.
		 * Note: this property is only available for Filmic tone mapping.
		 *
		 * @member
		 * @instance
		 * @name shoulderScale
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._shoulderScale = null;
		getterSetterPostProcess(this, 'shoulderScale', this._shoulderScale); //this.shoulderScale = 0.0;

		/**
		 * Impacts the grey values.
		 * Adjusts the scale of the linear section of the tone mapping curve.
		 * Note: this property is only available for Filmic tone mapping.
		 *
		 * @member
		 * @instance
		 * @name linearScale
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._linearScale = null;
		getterSetterPostProcess(this, 'linearScale', this._linearScale); //this.linearScale = 0.0;

		/**
		 * Adjusts the angle of the linear section of the tone mapping curve.
		 * Note: this property is only available for Filmic tone mapping.
		 *
		 * @member
		 * @instance
		 * @name linearAngle
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._linearAngle = null;
		getterSetterPostProcess(this, 'linearAngle', this._linearAngle); //this.linearAngle = 0.0;

		/**
		 * Impacts the dark values.
		 * Adjusts the scale of the toe part of the tone mapping curve.
		 * Note: this property is only available for Filmic tone mapping.
		 *
		 * @member
		 * @instance
		 * @name toeScale
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._toeScale = null;
		getterSetterPostProcess(this, 'toeScale', this._toeScale); //this.toeScale = 0.0;

		/**
		 * Adjusts the intensity of shadows in the Filmic tone mapping curve.
		 * Note: this property is only available for Filmic tone mapping.
		 *
		 * @member
		 * @instance
		 * @name toeNumerator
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._toeNumerator = null;
		getterSetterPostProcess(this, 'toeNumerator', this._toeNumerator); //this.toeNumerator = 0.0;

		/**
		 * Adjusts the transition of shadows from black to midtones.
		 * Note: this property is only available for Filmic tone mapping.
		 * 
		 * @member
		 * @instance
		 * @name toeDenominator
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._toeDenominator = null;
		getterSetterPostProcess(this, 'toeDenominator', this._toeDenominator); //this.toeDenominator = 0.0;

		/**
		 * Adjusts the white level of the tone mapping curve.
		 * Note: this property is only available for Filmic tone mapping.
		 *
		 * @member
		 * @instance
		 * @name whiteLevel
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._whiteLevel = null;
		getterSetterPostProcess(this, 'whiteLevel', this._whiteLevel); //this.whiteLevel = 0.0;

		/**
		 * Give the slope of the curve for gamma correction.
		 * Note: this property is available for both tone mapping modes.
		 *
		 * @member
		 * @instance
		 * @name gamma
		 * @public
		 * @type {Number}
		 * @memberof STU.Camera
		 */
		this._gamma = null;
		getterSetterPostProcess(this, 'gamma', this._gamma); //this.gamma = 2.2;

		/**
		 * If true, applies tone mapping values defined below
		 * If false, default visu tone mapping values
		 *
		 * @member
		 * @instance
		 * @name enableColorGrading
		 * @public
		 * @type {Boolean}
		 * @memberof STU.Camera
		 */
		this._enableColorGrading = null;
		getterSetter(this, "enableColorGrading", this._enableColorGrading); //this.enableColorGrading = false;

		/**
		 * Texture containing the color look up table data
		 *
		 * @member
		 * @instance
		 * @name LUTImage
		 * @public
		 * @type {STU.PictureResource}
		 * @memberof STU.Camera
		 */
		this._LUTImage = -1;
		getterSetter(this, "LUTImage", this._LUTImage);

		/**
		 *
		 * Distance To Target
		 *
		 * @member
		 * @private
		 * @type {Number}
		 */
		this.distanceToTarget = 1;

		//
		// A camera is NOT clickable
		// This Object.defineProperty is intended to overwrite Actor3d.clickable
		//
		Object.defineProperty(this, "clickable", {
			enumerable: true,
			configurable: true,
			get: function () {
				return false;
			},
			set: function (iClickable) {
				if (this.CATI3DXGraphicalProperties !== undefined && this.CATI3DXGraphicalProperties !== null) {
					this.CATI3DXGraphicalProperties.SetPickMode(false);
				}
			},
		});

		/**
		 * Flag linked to modification done on properties associated to Raytrace behavior.
		 *
		 * @member
		 * @private
		 * @type {STU.Camera.RaytraceOption}
		 */
		this._raytraceUpdateFlag = 0;

		/**
		 * Version of the camera
		 *
		 * @member
		 * @private
		 * @type {Number}
		 */
		this._version = -1;
	}; // STU.Camera.

	/**
	 * Infinity value for aperture
	 * @type {Number}
	 * @public
	 */
	Camera.InfinityAperture = 0;

	///
	// Enumeration of all raytrace value updated.<br/>
	//
	// @enum {number}
	// @private
	//
	///
	Camera.RaytraceOption = {
		eAperture: 1,
		eExposure: 2,
		eSpeed: 4,
		eFocus: 8,
		eFocusMode: 16,
		eGlow: 32,
		eToneMapping: 64,
		eNone: 0,
	};

	///
	// Enumeration of all constant aperture values.<br/>
	//
	// @enum {number}
	// @private
	//
	///
	Camera.ApertureValue = {
		"f/1": 1,
		"f/1.2": 1.2,
		"f/1.4": 1.4,
		"f/1.7": 1.7,
		"f/2": 2,
		"f/2.4": 2.4,
		"f/2.8": 2.8,
		"f/3.4": 3.4,
		"f/4": 4,
		"f/4.8": 4.8,
		"f/5.6": 5.6,
		"f/6.8": 6.8,
		"f/8": 8,
		"f/9.5": 9.5,
		"f/11": 11,
		"f/13.5": 13.5,
		"f/16": 16,
		"f/19": 19,
		"f/22": 22,
		"f/27": 27,
		"f/32": 32,
		"f/38.5": 38.5,
		"f/45": 45,
		"f/54.5": 54.5,
		"f/64": 64,
		eInfinty: 0,
	};

	///
	// Enumeration of all constant speed values.<br/>
	//
	// @enum {number}
	// @private
	//
	///
	Camera.SpeedValue = {
		"1s": 1,
		"1/2s": 0.5,
		"1/4s": 0.25,
		"1/8s": 0.125,
		"1/16s": 0.0625,
		"1/30s": 0.03333333333333333333333333333333,
		"1/60s": 0.01666666666666666666666666666667,
		"1/125s": 0.008,
		"1/250s": 0.004,
		"1/500s": 0.002,
		"1/1000s": 0.001,
		"1/2000s": 0.0005,
		"1/4000s": 0.00025,
	};

	/**
	 * Enumeration of all tone mapping modes.<br/>
	 * @enum {number}
	 * @public
	 * @readonly
	 *
	 */
	Camera.ToneMappingMode = {
		/** Adjusts HDR images to look natural on displays by preserving details in highlights and shadows. */
		ePhotographic: 0,
		/** Emulates the look of film in digital images by enhancing mid-tones and compressing highlights and shadows. */
		eFilmic: 1,
	};

	Camera.prototype = new Actor3D();
	Camera.prototype.constructor = Camera;

	/**
	 * Compute the target position from the camera's Forward direction
	 * and the last distance to target computed.
	 *
	 * The distance to target is computed when the lookAt() method
	 * is called, using the new Sight direction and the current camera
	 * position.
	 *
	 * @method
	 * @public
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 * <p>Using the the word "World" as argument will return the vector expressed in the world context. </p>
	 * <p>However using the word "Location" as argument will return the vector with its coordinates expressed in the parent globe location context.</p>
	 * <p>If null, the result will be returned in world context. </p>
	 * @return {DSMath.Vector3D}
	 */
	Camera.prototype.getTargetPosition = function (iRef) {
		var myPosInRef = this.getTransform(iRef);
		var scale = Math.cbrt(myPosInRef.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)

		if (scale <= 0.0) scale = 1.0;

		var targetPos = DSMath.Vector3D.multiplyScalar(this.getForward(iRef), this.distanceToTarget / scale);
		targetPos.add(this.getPosition());

		return targetPos;
	};

	/**
	 * Returns the direction the camera is looking in.
	 *
	 * @method
	 * @public
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 * @return {DSMath.Vector3D}
	 */
	Camera.prototype.getForward = function (iRef) {
		// [TJR] Note: the Sight (or Forward, depending on vocabulary) looks at the opposite
		// of X axis.
		var quat = new DSMath.Quaternion();
		//this.getTransform(iRef).matrix.getQuaternion(quat);

		// [ASO4]: To avoid orientation problem (particulary in globe context)
		// We check the matrix validity (no scale) to compute our quaternion
		var matrix = this.getTransform(iRef).matrix;
		if (!matrix.isARotation()) {
			matrix = this.getTransform(iRef).matrix.clone();
			var coefScale = 1 / matrix.getScale();
			matrix.multiplyScalar(coefScale);
		}
		matrix.getQuaternion(quat);

		var startFwd = new DSMath.Point(-1, 0, 0);
		var newFwd = startFwd.clone().applyQuaternion(quat);

		// Convert DSMath.Point to DSMath.Vector3D
		var fwd = new DSMath.Vector3D(newFwd.x, newFwd.y, newFwd.z);
		fwd.normalize();

		return fwd;
	}; // getForward.

	/**
	 * Sets the direction the camera is looking in.
	 * This method preserves the Up direction, but
	 * recompute the Right direction of the camera.
	 *
	 * @method
	 * @public
	 * @param {DSMath.Vector3D} iFwd - vector corresponding to the new forward vector of the camera
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 * <p>Using the the word "World" as argument will set the vector expressed in the world context. </p>
	 * <p>However using the word "Location" as argument will set the vector with its coordinates expressed in the parent globe location context.</p>
	 * <p>If null, the vector will be set in world context. </p>
	 */
	Camera.prototype.setForward = function (iFwd, iRef) {
		var up = this.getUp(iRef);
		var dir = DSMath.Vector3D.negate(iFwd);
		dir.normalize();
		var right = DSMath.Vector3D.cross(dir, up);
		right.normalize();

		var transform = this.getTransform(iRef);

		var matrix = new DSMath.Matrix3x3();
		//var newCoef = [dir.x, right.x, up.x, dir.y, right.y, up.y, dir.z, right.z, up.z];
		matrix.setFromArray([dir.x, right.x, up.x, dir.y, right.y, up.y, dir.z, right.z, up.z]);

		transform.matrix = matrix;

		this.setTransform(transform, iRef);
	};

	/**
	 * Returns the up direction of the camera.
	 *
	 * @method
	 * @public
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 * @return {DSMath.Vector3D}
	 */
	Camera.prototype.getUp = function (iRef) {
		var quat = new DSMath.Quaternion();
		//this.getTransform(iRef).matrix.getQuaternion(quat);

		// [ASO4]: To avoid orientation problem (particulary in globe context)
		// We check the matrix validity (no scale) to compute our quaternion
		var matrix = this.getTransform(iRef).matrix;
		if (!matrix.isARotation()) {
			matrix = this.getTransform(iRef).matrix.clone();
			var coefScale = 1 / matrix.getScale();
			matrix.multiplyScalar(coefScale);
		}
		matrix.getQuaternion(quat);

		// IBS GLOBE : OK (le up est l'axe (0,0,1) du rep�le propre � this)
		var startUp = new DSMath.Point(0, 0, 1);
		var newUp = startUp.applyQuaternion(quat);

		// Convert DSMath.Point to DSMath.Vector3D
		var up = new DSMath.Vector3D(newUp.x, newUp.y, newUp.z);
		up.normalize();
		return up;
	};

	/**
	 * Sets the Up direction of the camera.
	 * This method preserves the Forward direction, but
	 * recompute the Right direction of the camera.
	 *
	 * @method
	 * @public
	 * @param {DSMath.Vector3D} iUp - vector corresponding to the new up vector of the camera
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 */
	Camera.prototype.setUp = function (iUp, iRef) {
		var fwd = this.getForward(iRef);
		var dir = DSMath.Vector3D.negate(fwd);
		var up = DSMath.Vector3D.normalize(iUp);
		var right = DSMath.Vector3D.cross(dir, up);
		right.normalize();

		var transform = this.getTransform(iRef);

		var matrix = new DSMath.Matrix3x3();
		matrix.setFromArray([dir.x, right.x, up.x, dir.y, right.y, up.y, dir.z, right.z, up.z]);

		transform.matrix = matrix;

		this.setTransform(transform, iRef);
	};

	/**
	 * Returns the right side direction of the camera.
	 *
	 * @method
	 * @public
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 * @return {DSMath.Vector3D}
	 */
	Camera.prototype.getRight = function (iRef) {
		var quat = new DSMath.Quaternion();
		//this.getTransform(iRef).matrix.getQuaternion(quat);

		// [ASO4]: To avoid orientation problem (particulary in globe context)
		// We check the matrix validity (no scale) to compute our quaternion
		var matrix = this.getTransform(iRef).matrix;
		if (!matrix.isARotation()) {
			matrix = this.getTransform(iRef).matrix.clone();
			var coefScale = 1 / matrix.getScale();
			matrix.multiplyScalar(coefScale);
		}
		matrix.getQuaternion(quat);

		// IBS GLOBE : OK (le right est l'axe (0,1,0) du rep�le propre � this)
		var startRight = new DSMath.Point(0, 1, 0);
		var newRight = startRight.applyQuaternion(quat); //Deprecated: quat.rotate(startRight);

		// Convert DSMath.Point to DSMath.Vector3D
		var right = new DSMath.Vector3D(newRight.x, newRight.y, newRight.z);
		right.normalize();

		return right;
	};

	/**
	 * Sets the Right direction of the camera.
	 * This method preserves the Forward direction, but
	 * recompute the Up direction of the camera.
	 *
	 * @method
	 * @public
	 * @param {DSMath.Vector3D} iRight - vector corresponding to the new right vector of the camera
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 */
	Camera.prototype.setRight = function (iRight, iRef) {
		var fwd = this.getForward(iRef);
		var dir = DSMath.Vector3D.negate(fwd);
		var right = DSMath.Vector3D.normalize(iRight);
		var up = DSMath.Vector3D.cross(right, dir);
		up.normalize();

		var transform = this.getTransform(iRef);

		var matrix = new DSMath.Matrix3x3();
		matrix.setFromArray([dir.x, right.x, up.x, dir.y, right.y, up.y, dir.z, right.z, up.z]);

		transform.matrix = matrix;

		this.setTransform(transform, iRef);
	};

	/**
	 * Make the camera look at the given position or node
	 *
	 * This method preserves the roll angle by keeping
	 * the right direction parallel to the ground.
	 *
	 * @method
	 * @public
	 * @param {(DSMath.Vector3D|STU.Actor3D)} iTarget - The position or target the camera is suppose to looking at.
	 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	 */
	Camera.prototype.lookAt = function (iTarget, iRef) {
		// si iTarget est un Actor3D, iRef est inutile
		// si iTarget est un vecteur, on suppose qu'il est exprim� dans le referrentiel de iRef

		// sceneTransformInWorld * actorTransformInScene = actorTransformInWorld

		// actorTransformInScene * sceneTransformInWorld = actorTransformInWorld
		// => sceneTransformInWorld = invActorTransformInScene * actorTransformInWorld
		var actorTransformInScene = this.getTransform("Location");
		var actorTransformInWorld = this.getTransform("World");
		var invActorTransformInScene = actorTransformInScene.getInverse();
		var sceneTransformInWorld = DSMath.Transformation.multiply(actorTransformInWorld, invActorTransformInScene);
		var invSceneTransformInWorld = sceneTransformInWorld.getInverse();

		var targetPointInScene;
		if (iTarget instanceof Actor3D) {
			var targetPosInScene = iTarget.getPosition("Location");
			targetPointInScene = new DSMath.Point(targetPosInScene.x, targetPosInScene.y, targetPosInScene.z);
		} else if (iTarget instanceof DSMath.Vector3D) {
			targetPointInScene = new DSMath.Point(iTarget.x, iTarget.y, iTarget.z); // dans ce cas on suppose que le vecteur est exprim� dans iRef
			if (iRef !== null && iRef !== undefined) {
				var ReferentialTransfo_Scene = STU.Experience.getCurrent().getReferentialTransform(iRef, "Location");
				targetPointInScene.applyTransformation(ReferentialTransfo_Scene);
			}
		}

		// targetPointWorld = sceneTransformInWorld*targetPointInScene
		var targetPointInWorld = targetPointInScene.clone();
		targetPointInWorld.applyTransformation(sceneTransformInWorld);

		var renderManager = STU.RenderManager.getInstance();
		var gravityDirectionInWorld = new DSMath.Vector3D(0.0, 0.0, -1.0);

		gravityDirectionInWorld = renderManager.getGravityVector(this, "World");

		// gravityDirectionWorld = sceneTransformInWorld*gravityDirectionScene
		// invsceneTransformInWorld*gravityDirectionWorld = gravityDirectionScene
		var gravityDirectionInScene = gravityDirectionInWorld.clone();
		gravityDirectionInScene.applyTransformation(invSceneTransformInWorld);

		var upDirInScene = gravityDirectionInScene.clone();
		upDirInScene.negate();
		upDirInScene.normalize();

		// computing the new sight direction using current eye position and the position of the target
		// sightDirInScene = this.getPosition - targetPointInScene
		var myPosVecInScene = this.getPosition("Location");

		var eps = 0.001;
		if (!myPosVecInScene.isEqual(targetPointInScene, eps)) {
			var sightDirInScene = new DSMath.Vector3D(
				myPosVecInScene.x - targetPointInScene.x,
				myPosVecInScene.y - targetPointInScene.y,
				myPosVecInScene.z - targetPointInScene.z
			);
			sightDirInScene.normalize();

			var v1 = upDirInScene.dot(sightDirInScene); //Cos(0)=1
			var rightDirInScene;
			if (upDirInScene.dot(sightDirInScene) != 1) {
				// computing the right direction using the ground-projected sight direction
				rightDirInScene = DSMath.Vector3D.cross(upDirInScene, sightDirInScene);
				rightDirInScene.normalize();

				// computing the up direction as usual
				upDirInScene = DSMath.Vector3D.cross(sightDirInScene, rightDirInScene);
				upDirInScene.normalize();
			} else {
				//computing up direction according to world right vector
				upDirInScene = DSMath.Vector3D.cross(sightDirInScene, DSMath.Vector3D.yVect);
				upDirInScene.normalize();

				rightDirInScene = DSMath.Vector3D.cross(upDirInScene, sightDirInScene);
				rightDirInScene.normalize();
			}

			// updating the transform
			var myNewTransformInScene = this.getTransform("Location");
			var matrix = new DSMath.Matrix3x3();
			matrix.setFromArray([
				sightDirInScene.x,
				rightDirInScene.x,
				upDirInScene.x,
				sightDirInScene.y,
				rightDirInScene.y,
				upDirInScene.y,
				sightDirInScene.z,
				rightDirInScene.z,
				upDirInScene.z,
			]);

			myNewTransformInScene.matrix = matrix;
			this.setTransform(myNewTransformInScene, "Location");
		} else {
			console.error("Cannot look at the target (Camera and target are located at the same place)");
		}

		/*var myNewTransformWorld = this.getTransform("World");
        var sightDirWorld = sightDirInScene.clone();
        sightDirWorld.applyTransformation(sceneTransformInWorld);
        var rightDirWorld = rightDirInScene.clone();
        rightDirWorld.applyTransformation(sceneTransformInWorld);
        var upDirWorld = upDirInScene.clone();
        upDirWorld.applyTransformation(sceneTransformInWorld);
        var matrix = new DSMath.Matrix3x3();
        matrix.setFromArray([sightDirWorld.x, rightDirWorld.x, upDirWorld.x,
                            sightDirWorld.y, rightDirWorld.y, upDirWorld.y,
                            sightDirWorld.z, rightDirWorld.z, upDirWorld.z
        ]);
        myNewTransformWorld.matrix = matrix;
        this.setTransform(myNewTransformWorld, "World");*/

		// compute the distance to target value
		// for further calls to getTargetPosition
		// on stocke la distance en referrentiel monde
		var targetPosInWorld = new DSMath.Vector3D(targetPointInWorld.x, targetPointInWorld.y, targetPointInWorld.z);
		var vecToTarget = DSMath.Vector3D.sub(targetPosInWorld, this.getPosition("World"));
		this.distanceToTarget = vecToTarget.norm();
	};

	/**
	 * Returns true if the camera is the current one.
	 *
	 * @method
	 * @public
	 * @return {Boolean}
	 */
	Camera.prototype.isCurrent = function () {
		var renderMgr = STU.RenderManager.getInstance();
		return renderMgr.getCurrentCamera() === this;
	};

	/**
	 * Sets the camera as the current one.
	 *
	 * @method
	 * @public
	 */
	Camera.prototype.setAsCurrent = function () {
		var renderMgr = STU.RenderManager.getInstance();
		renderMgr.setCurrentCamera(this);
	};

	/**
	 * Check if modification has been done on properties linked to Raytrace
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.hasUpdatedRaytraceValue = function () {
		return this._raytraceUpdateFlag != Camera.RaytraceOption.eNone;
	};

	/**
	 * Reset modification flag linked to Raytrace properties.
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.restoreRaytraceFlag = function () {
		this._raytraceUpdateFlag = Camera.RaytraceOption.eNone;
	};

	/**
	 * Get modification flag linked to Raytrace properties.
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.getRaytraceFlag = function () {
		return this._raytraceUpdateFlag;
	};

	/**
	 * Add a modification flag linked to Raytrace properties.
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.AddRaytraceFlag = function (iFlag) {
		if (this.Raytrace !== null && this.Raytrace !== undefined) {
			this._raytraceUpdateFlag |= iFlag;
		}
	};

	/**
	 * Process to execute when this STU.Camera is activating.
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.onActivate = function (oExceptions) {
		Actor3D.prototype.onActivate.call(this, oExceptions);

		var event = new STU.CameraPostProcessEvent();
		EP.EventServices.dispatchEvent(event);
	};


	/**
	 * Interpolates current camera and this camera during a
	 * duration specified directly on this capacity
	 *
	 * @method
	 * @private
	 * @param {number} iDuration duration of the transition in s
	 */
	Camera.prototype.becomesCurrentInStart = function (iDuration) {
		this._isSwitching = true;

		let interpolationManager = STU.InterpolationManager.getInstance();
		let renderManager = STU.RenderManager.getInstance();

		let currentCamera = renderManager.getCurrentCamera();
		let targetCamera = this;
		let easing = STU.InterpolationManager.EEasingType.eInOutCubic;

		let initCamera = {};
		initCamera.transform = currentCamera.getTransform();
		initCamera.focalLength = currentCamera.focalLength;
		initCamera.enableExposure = currentCamera.enableExposure;
		initCamera.exposure = currentCamera.exposure;
		initCamera.aperture = currentCamera.aperture;
		initCamera.speed = currentCamera.speed;
		initCamera.enableDepthOfField = currentCamera.enableDepthOfField;
		initCamera.focusDistance = currentCamera.focusDistance;
		initCamera.enableGlow = currentCamera.enableGlow;
		initCamera.glowIntensity = currentCamera.glowIntensity;
		initCamera.enableToneMapping = currentCamera.enableToneMapping;
		initCamera.toneMapping = currentCamera.toneMapping;
		initCamera.blacks = currentCamera.blacks;
		initCamera.whites = currentCamera.whites;
		initCamera.saturation = currentCamera.saturation;
		initCamera.shoulderScale = currentCamera.shoulderScale;
		initCamera.linearScale = currentCamera.linearScale;
		initCamera.linearAngle = currentCamera.linearAngle;
		initCamera.toeScale = currentCamera.toeScale;
		initCamera.toeNumerator = currentCamera.toeNumerator;
		initCamera.toeDenominator = currentCamera.toeDenominator;
		initCamera.whiteLevel = currentCamera.whiteLevel;
		initCamera.gamma = currentCamera.gamma;

		if (targetCamera.enableExposure) currentCamera.enableExposure = true;
		if (targetCamera.enableGlow) currentCamera.enableGlow = true;
		if (targetCamera.enableToneMapping) currentCamera.enableToneMapping = true;
		if (targetCamera.enableDepthOfField) currentCamera.enableDepthOfField = true;

		// deactivating camera to prevent conflict with navigations
		currentCamera.deactivate();

		// compute source and target camera lookat target
		let sourceLookAt = currentCamera
			.getPosition()
			.clone()
			.addScaledVector(currentCamera.getForward().clone(), currentCamera.focusDistance);
		let targetLookAt = targetCamera
			.getPosition()
			.clone()
			.addScaledVector(targetCamera.getForward().clone(), targetCamera.focusDistance);

		let duration = iDuration * 1000;

		if (initCamera.focalLength != targetCamera.focalLength)
			interpolationManager.animate(
				currentCamera,
				"focalLength",
				initCamera.focalLength,
				targetCamera.focalLength,
				duration,
				{ easing: easing }
			);

		if (initCamera.aperture != targetCamera.aperture) {
			interpolationManager.animate(
				currentCamera,
				"aperture",
				initCamera.aperture,
				targetCamera.aperture,
				duration,
				{ easing: easing }
			);
		}
		if (initCamera.speed != targetCamera.speed) {
			interpolationManager.animate(currentCamera, "speed", initCamera.speed, targetCamera.speed, duration, {
				easing: easing,
			});
		}

		if (initCamera.exposure != targetCamera.exposure)
			interpolationManager.animate(
				currentCamera,
				"exposure",
				initCamera.exposure,
				targetCamera.exposure,
				duration,
				{ easing: easing }
			);

		if (initCamera.focusDistance != targetCamera.focusDistance) {
			interpolationManager.animate(
				currentCamera,
				"focusDistance",
				initCamera.focusDistance,
				targetCamera.focusDistance,
				duration,
				{
					easing: easing,
				}
			);
		}

		if (initCamera.focusDistance != targetCamera.focusDistance) {
			interpolationManager.animate(
				currentCamera,
				"focusDistance",
				initCamera.focusDistance,
				targetCamera.focusDistance,
				duration,
				{
					easing: easing,
				}
			);
		}

		if (initCamera.glowIntensity != targetCamera.glowIntensity) {
			interpolationManager.animate(
				currentCamera,
				"glowIntensity",
				initCamera.glowIntensity,
				targetCamera.glowIntensity,
				duration,
				{
					easing: easing,
				}
			);
		}

		if (initCamera.blacks != targetCamera.blacks) {
			interpolationManager.animate(currentCamera, "blacks", initCamera.blacks, targetCamera.blacks, duration, {
				easing: easing,
			});
		}

		if (initCamera.whites != targetCamera.whites) {
			interpolationManager.animate(currentCamera, "whites", initCamera.whites, targetCamera.whites, duration, {
				easing: easing,
			});
		}

		if (initCamera.saturation != targetCamera.saturation) {
			interpolationManager.animate(
				currentCamera,
				"saturation",
				initCamera.saturation,
				targetCamera.saturation,
				duration,
				{ easing: easing }
			);
		}

		if (initCamera.shoulderScale != targetCamera.shoulderScale) {
			interpolationManager.animate(currentCamera, "shoulderScale", initCamera.shoulderScale, targetCamera.shoulderScale, duration, {
				easing: easing,
			});
		}

		if (initCamera.linearScale != targetCamera.linearScale) {
			interpolationManager.animate(currentCamera, "linearScale", initCamera.linearScale, targetCamera.linearScale, duration, {
				easing: easing,
			});
		}

		if (initCamera.linearAngle != targetCamera.linearAngle) {
			interpolationManager.animate(currentCamera, "linearAngle", initCamera.linearAngle, targetCamera.linearAngle, duration, {
				easing: easing,
			});
		}

		if (initCamera.toeScale != targetCamera.toeScale) {
			interpolationManager.animate(currentCamera, "toeScale", initCamera.toeScale, targetCamera.toeScale, duration, {
				easing: easing,
			});
		}

		if (initCamera.toeNumerator != targetCamera.toeNumerator) {
			interpolationManager.animate(currentCamera, "toeNumerator", initCamera.toeNumerator, targetCamera.toeNumerator, duration, {
				easing: easing,
			});
		}

		if (initCamera.toeDenominator != targetCamera.toeDenominator) {
			interpolationManager.animate(currentCamera, "toeDenominator", initCamera.toeDenominator, targetCamera.toeDenominator, duration, {
				easing: easing,
			});
		}

		if (initCamera.whiteLevel != targetCamera.whiteLevel) {
			interpolationManager.animate(currentCamera, "whiteLevel", initCamera.whiteLevel, targetCamera.whiteLevel, duration, {
				easing: easing,
			});
		}

		if (initCamera.gamma != targetCamera.gamma) {
			interpolationManager.animate(currentCamera, "gamma", initCamera.gamma, targetCamera.gamma, duration, {
				easing: easing,
			});
		}

		interpolationManager.animate(
			currentCamera,
			"transform",
			initCamera.transform,
			targetCamera.getTransform(),
			duration,
			{
				setter: "setTransform",
				easing: easing,
				updateCallback: function (o, p, t) {
					// interpolating lookat target to force having something relevant to lookat
					// during transform interpolation
					let coef = interpolationManager.ease(easing, t, duration, 0, 1);

					let midLookAt = interpolationManager.lerpVector3D(sourceLookAt, targetLookAt, coef);
					o.lookAt(midLookAt);

					//rm.createSphere(new DSMath.Point(midLookAt.x, midLookAt.y, midLookAt.z), 100, {lifetime: 1000});
				},

				endCallback: function () {
					// switching to target camera for navigation
					targetCamera.setAsCurrent();

					// restoring previous state
					currentCamera.setTransform(initCamera.transform);
					currentCamera.focalLength = initCamera.focalLength;
					currentCamera.enableExposure = initCamera.enableExposure;
					currentCamera.aperture = initCamera.aperture;
					currentCamera.speed = initCamera.speed;
					currentCamera.exposure = initCamera.exposure;
					currentCamera.enableDepthOfField = initCamera.enableDepthOfField;
					currentCamera.focusDistance = initCamera.focusDistance;
					currentCamera.enableGlow = initCamera.enableGlow;
					currentCamera.glowIntensity = initCamera.glowIntensity;
					currentCamera.enableToneMapping = initCamera.enableToneMapping;
					currentCamera.toneMapping = initCamera.toneMapping;
					currentCamera.blacks = initCamera.blacks;
					currentCamera.whites = initCamera.whites;
					currentCamera.saturation = initCamera.saturation;
					currentCamera.shoulderScale = initCamera.shoulderScale;
					currentCamera.linearScale = initCamera.linearScale;
					currentCamera.linearAngle = initCamera.linearAngle;
					currentCamera.toeScale = initCamera.toeScale;
					currentCamera.toeNumerator = initCamera.toeNumerator;
					currentCamera.toeDenominator = initCamera.toeDenominator;
					currentCamera.whiteLevel = initCamera.whiteLevel;
					currentCamera.gamma = initCamera.gamma;

					// reactivating camera (should not navigate anymore, though)
					currentCamera.activate();

					// we are ending the switch service
					this._isSwitching = false;
				},
			}
		);
	};

	/**
	 * Function called during the interpolation execution
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.becomesCurrentInExecute = function () {
		// do nothing
	};

	/**
	 * Function called at the interpolation end
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.becomesCurrentInEnd = function () {
		if (!this._isSwitching && !this._previousIsSwitching) {
			this._previousIsSwitching = false;
			return true;
		}
		this._previousIsSwitching = this._isSwitching;
		return false;
	};

	/**
	 * Function called at the interpolation stop
	 *
	 * @method
	 * @private
	 */
	Camera.prototype.becomesCurrentInStop = function () {
		this.becomesCurrentInEnd();
	};

	// Expose in STU namespace.
	STU.Camera = Camera;

	return Camera;
});

define('StuRenderEngine/StuCameraNa', ['DS/StuRenderEngine/StuCameraNa'], function (Camera) {
	'use strict';

	return Camera;
});
