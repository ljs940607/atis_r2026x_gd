define('DS/StudioIV/StuXRManager', [
	'DS/StuCore/StuContext',
	'DS/StuCore/StuManager',
	'DS/EP/EP',
	'DS/EPEventServices/EPEventServices',
	'DS/EPEventServices/EPEvent',
	'DS/EPInputs/EPDevices',
	'DS/MathematicsES/MathsDef',
	'DS/StuCore/StuEnvServices',
	'DS/StuRenderEngine/StuRenderManager',
	'DS/StuRenderEngine/StuColor',
	'DS/StuModel/StuSceneActivateEvent'
],
	function (
		STU,
		Manager,
		EP,
		EventServices, 
		Event,
		EPDevices,
		DSMath,
		StuEnvServices,
		RenderManager,
		Color,
		StuSceneActivateEvent
		) {
		'use strict';

        /**
         * The XR manager is the way of interacting with the XR device in a experience involving Virtual Reality <br/>
         * 
         *
         * @exports XRManager
         * @class
         * @constructor
         * @noinstancector
         * @public
         * @extends STU.Manager
         * @memberof STU
	     * @alias STU.XRManager
         */
		var XRManager = function () {
			Manager.call(this);
			this.name = "XRManager";

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Private object that hold the wrapper to link C++ & JS
			 *
			 * @member
			 * @instance
			 * @name _wrapper
			 * @private
			 * @type {Object}
			 * @memberof STU.XRManager
			 */
			this._wrapper = null;

			/**
			 * Private object that hold the current interaction area actor for XR experience
			 *
			 * @member
			 * @instance
			 * @name _interactionAreaActor
			 * @private
			 * @type {STU.XRInteractionAreaActor}
			 * @memberof STU.XRManager
			 */
			this._interactionAreaActor = null;

			/**
			 * Private object that hold the EP.Device reference for the headset for XR experience
			 *
			 * @member
			 * @instance
			 * @name _XRHeadset
			 * @private
			 * @type {EP.Devices}
			 * @memberof STU.XRManager
			 */
			this._XRHeadset = null;

			/**
			 * Private object that hold the current headset camera actor for XR experience
			 *
			 * @member
			 * @instance
			 * @name _XRHeadsetActor
			 * @private
			 * @type {STU.XRHeadsetActor}
			 * @memberof STU.XRManager
			 */
			this._XRHeadsetActor = null;
						
			/**
			 * Private object that hold all the devices available in the XR experience
			 *
			 * @member
			 * @instance
			 * @name _listDevices
			 * @private
			 * @type {Array.<STU.XRDeviceActor>}
			 * @memberof STU.XRManager
			 */
			this._listDevices = null;

			/**
			 * Private object that hold the transform to apply to have the correct orientation in CXP from the coords that we get from techno team
			 *
			 * @member
			 * @instance
			 * @name _IVTechnoToV6Transform
			 * @private
			 * @type {STU.XRInteractionAreaActor}
			 * @memberof STU.XRManager
			 */
			this._IVTechnoToV6Transform = new DSMath.Transformation();
			this._IVTechnoToV6Transform.matrix.set(
				1, 0, 0,
				0, 0, -1,
				0, 1, 0);

			/**
			 * Private object that hold the environment variable to deactivate the move Press & Release ?
			 *
			 * @member
			 * @instance
			 * @name _deactivateByPassForMove
			 * @private
			 * @type {Boolean}
			 * @memberof STU.XRManager
			 */
			this._deactivateByPassForMove = null;
		};

		XRManager.prototype = new Manager();
		XRManager.prototype.constructor = XRManager;

		/**
		 * An enumeration of all the supported keys inputs for a XR device.<br/>
		 * It allows to refer in the code to a specific key input.
		 *
		 * @enum {number}
		 * @public
		 */
		XRManager.EDeviceInput = {
			eNone: 0,
			eHorizontalAnalog: 1,
			eVerticalAnalog: 2,
			eTriggerAnalog: 3,
			eGripAnalog: 4,
			eSystemButton: 5,
			eMenuButton: 6,
			eGripButton: 7,
			eCenterButton: 8,
			eTriggerButton: 9,
		};

		/**
		 * An enumeration of all the supported keys.<br/>
		 * It allows to refer in the code to a specific key.
		 * Only used to have the related String given a EDeviceInput. Supposed to be replaced later with more "explanated" strings
		 *
		 * @readonly
		 * @enum {String}
		 * @private
		 */
		XRManager.EDeviceInputName = {
			 /** @private */
			0: "",
			 /** @private */
			1: "aHorizontal",
			 /** @private */
			2: "aVertical",
			 /** @private */
			3: "aTrigger",
			 /** @private */
			4: "aGrip",
			 /** @private */
			5: "bSystem",
			 /** @private */
			6: "bMenu",
			 /** @private */
			7: "bGrip",
			 /** @private */
			8: "bCenter",
			 /** @private */
			9: "bTrigger",
		};

		/**
		 * An enumeration of all the XR Device ID.<br/>
		 * It allows to refer in the code to a specific device.
		 * 
		 *
		 * @enum {number}
		 * @public
		 */
		XRManager.EDeviceIdentifier = {
			eNone: 0,
			eRightController: 1,
			eLeftController: 2,
			eXRDevice_1: 3,
			eXRDevice_2: 4,
			eXRDevice_3: 5,
			eXRDevice_4: 6,
			eXRDevice_5: 7,
			eXRDevice_6: 8,
			eXRDevice_7: 9,
			eXRDevice_8: 10,
			eXRDevice_9: 11,
			eXRDevice_10: 12,
			eXRDevice_11: 13,
			eRightHand: 14,
			eLeftHand: 15,
		};

		/**
		 * An enumeration of all the device id.<br/>
		 * It allows to refer in the code to a specific key.
		 * Only used to have the related String given a EDeviceInput. Supposed to be replaced later with more "explanated" strings
		 *
		 * @readonly
		 * @enum {String}
		 * @private
		 */
		XRManager.EDeviceIdentifierName = {
			 /** @private */
			0: "",
			 /** @private */
			1: "controllerTracker_1",
			 /** @private */
			2: "controllerTracker_2",
			 /** @private */
			3: "genericTracker_1",
			 /** @private */
			4: "genericTracker_2",
			 /** @private */
			5: "genericTracker_3",
			 /** @private */
			6: "genericTracker_4",
			 /** @private */
			7: "genericTracker_5",
			 /** @private */
			8: "genericTracker_6",
			 /** @private */
			9: "genericTracker_7",
			 /** @private */
			10: "genericTracker_8",
			 /** @private */
			11: "genericTracker_9",
			 /** @private */
			12: "genericTracker_10",
			 /** @private */
			13: "genericTracker_11",
			/** @private */
			14: "controllerAimTracker_1", //hands do not use the EPDevice so not relevant at all here 
			/** @private */
			15: "controllerAimTracker_2", //hands do not use the EPDevice so not relevant at all here 
		};

        /**
         * Process to execute when this STU.XRManager is initializing.
         *
         * @method
         * @private
         * @see STU.XRManager#onDispose
         */
		XRManager.prototype.onInitialize = function (oExceptions) {
			Manager.prototype.onInitialize.call(this, oExceptions);

			// Initialize the bindings between C++ & JS
			if (this.buildHMDWrapper !== null && this.buildHMDWrapper !== undefined) { // jshint ignore:line
				this._wrapper = this.buildHMDWrapper(); // jshint ignore:line
			}

			// Check that correct binding is done
			if (this._wrapper === undefined || this._wrapper === null) {
				console.error("Native binding is not available for XR component");
			}

			// Init environment variable
			this._deactivateByPassForMove = StuEnvServices.CATGetEnv("CXP_DEACTIVATE_BY_PASS_VR");

			// Init list of all the XR devices
			this._listDevices = [];

			// under variable for now for auto geomtry
			this._enableOpenXRAutoGeometry = StuEnvServices.CATGetEnv("CXP_ENABLE_XR_CONTROLLER_VISU");

			// Add Listener to get notified : Registers listeners for headset state
			this._currentSceneChangedCb = STU.makeListener(this, 'onCurrentSceneChanged');
			EventServices.addListener(STU.SceneActivateEvent, this._currentSceneChangedCb);
		};

		XRManager.prototype.onCurrentSceneChanged = function () {
			// unregister objects?
			this._listDevices = []
			
			// register local objects? done already in XRDeviceActor
			//for (var device of this._listDevices) {
			//}

			//check if we need to delete the XR viewer
			if (this._wrapper !== null && this._interactionAreaActor === null) {
				//delete the C++ device
				this._wrapper.sceneStop();
				//delete this._wrapper;
				this._wrapper = null;

				//remove the reference to the device
				this._XRHeadset = null;
			}
		};

		XRManager.prototype.restartXRViewer = function () {
			//rebuild the wrapper if necessary
			if (this._wrapper === null) {
				// Initialize the bindings between C++ & JS
				if (this.buildHMDWrapper !== null && this.buildHMDWrapper !== undefined ) { 
					this._wrapper = this.buildHMDWrapper(); // jshint ignore:line
				}
			}
		};


        /**
         * Process to execute when this STU.XRManager is disposing.
         *
         * @method
         * @private
         * @see STU.XRManager#onInitialize
         */
		XRManager.prototype.onDispose = function () {
			if (this._wrapper !== null) {
				//delete this._wrapper;
				this._wrapper = null;
			}

			this._deactivateByPassForMove = null;

			//do i need to delete items of the this._listDevices ? with something like XRManager.prototype._deleteAllDevices();

			this._enableOpenXRAutoGeometry = null;

			EventServices.removeListener(STU.SceneActivateEvent, this._currentSceneChangedCb);
				delete this._currentSceneChangedCb;

			Manager.prototype.onDispose.call(this);
		};

        /**
         * Actually start the XR engine
         * 
         * @method
         * @private
         */
		XRManager.prototype.startXRViewer = function (iEmulationEnabled) {
			if (this._wrapper !== null) {

				let showAutoGeometry = false;
				//if variable is set then we have to enable the auto geometry mode
				if (this._enableOpenXRAutoGeometry !== null && this._enableOpenXRAutoGeometry !== undefined) {
					showAutoGeometry = true;
				}
				this.setRepresentationVisibility(showAutoGeometry);

				// The viewpoint parameters have to be setup BEFORE the engine start because there are read only once during init
				RenderManager.getInstance().onPostExecute();

				//Native engine start
				this._wrapper.start(this._interactionAreaActor.CATI3DExperienceObject);

				//start the emulation if needed
				if (iEmulationEnabled || this._wrapper.getIsEmulationRequiered()) {
					this.startEmulation();
				}

				// After the XR viewer start, the interaction area transform needs to be initialized
				this.setInteractionAreaTransform(this._interactionAreaActor.getTransform("Visu"));

			} else {
				console.error("Native binding is not available for XR component");
			}
		};

		/**
		 * Dispatch the emulation setup
		 * 
		 * @method
		 * @private
		 */
		XRManager.prototype.startEmulation = function () {
			var renderMgr = STU.RenderManager.getInstance();
			if (renderMgr) {
				if (this._XRHeadsetActor)
				{
					renderMgr.setCurrentCamera(this._XRHeadsetActor)
				}
			}
		};


        /**
         * Interaction Area transform coming from the XR engine
         * TBDELETED
         *
         * @method
         * @private
         * 
         * @return {DSMath.Transformation} Interaction Area transform 
         */
		XRManager.prototype.getInteractionAreaTransform = function () {
			var interactionAreaTransfo = new DSMath.Transformation();
			if (this._wrapper !== null) {
				this._wrapper.getInteractionCtxTransform(interactionAreaTransfo);

				var tmpMatrix = interactionAreaTransfo.matrix.clone();
				interactionAreaTransfo.matrix.setSecondColumn(tmpMatrix.getThirdColumn().negate());
				interactionAreaTransfo.matrix.setThirdColumn(tmpMatrix.getSecondColumn());
			}
			return interactionAreaTransfo;
		};

		/**
		 * XR Hand coming from the XR engine
		 *
		 * @method
		 * @private
		 * 
		 * @return {DSMath.Transformation} XR Hand transform 
		 */
		XRManager.prototype.updateXRHand = function (iIsLeftHand) {
			var xrPalmTransfo = new DSMath.Transformation();
			var xrHandArray = [];
			var xrGestures = [];

			if (this._wrapper !== null) {
				//need to get all pos in one call to reduce PCS (?)
				this._wrapper.getXRHand(xrHandArray, xrGestures, iIsLeftHand);

				//function getConnectedHands can only return array, could be better to make it return directly object (but would need to init them?)
				if (xrHandArray.length > 0) {
					//if array empty, then hands are not tracked
					xrPalmTransfo.setFromArray(xrHandArray[0])
				}
			}

			//save it inside the manager for getDeviceTrasnform
			if (iIsLeftHand) {
				this.xrHandLeftPalmTransform = xrPalmTransfo;
			}
			else {
				this.xrHandRightPalmTransform = xrPalmTransfo;
			}

			return [xrHandArray, xrGestures]
		};

        /**
         * Set the Interaction Area transform of the XR engine
         *
         * @method
         * @private
         * 
         * @param {DSMath.Transformation} iTransform New transform of the interaction area
         */
		XRManager.prototype.setInteractionAreaTransform = function (iTransform) {
			if (this._wrapper !== null) {
				var newTransform = iTransform.clone();

				var matrix = iTransform.matrix;
				newTransform.matrix.setSecondColumn(matrix.getThirdColumn());
				newTransform.matrix.setThirdColumn(matrix.getSecondColumn().negate());

				this._wrapper.setInteractionCtxTransform(newTransform);
			}
		};

        /**
         * Hide / show the controller representation coming from SteamVR
         * It has to be called before starting the XR engine 
         *
         * @method
         * @private
		 * 
         * @param {Boolean} iRepVisibility 
         */
		XRManager.prototype.setRepresentationVisibility = function (iRepVisibility) {
			if (this._wrapper !== null) {
				this._wrapper.setRepresentationVisibility(iRepVisibility);
			}
		};

		/**
		 * Activate the refresh of the main viewer 
		 * It can impact the framerate as the rendering will be performed 
		 * for the main viewer and for the XR headset
		 *
         * @method
		 * @private 
		 */
		XRManager.prototype.activateMainViewerRefresh = function () {
			if (this._wrapper !== null) {
				this._wrapper.activateMainViewerRefresh();
			}
		};

        /**
         * Deactivate the refresh of the main viewer 
         * Useful to increase rendering performances 
         *
         * @method
         * @private
         */
		XRManager.prototype.deactivateMainViewerRefresh = function () {
			if (this._wrapper !== null) {
				this._wrapper.deactivateMainViewerRefresh();
			}
		};

        /**
         * Returns a reference to the current Interaction Area Actor
         *
         * @method
         * @public
         * 
         * @return {STU.XRInteractionAreaActor} 
         */
		XRManager.prototype.getInteractionArea = function () {
			return this._interactionAreaActor;
		};

		/**
		 * Method called at the creation of a device in XR Experience
		 *
		 * @method
		 * @private
		 * 
		 * @param {STU.XRDeviceActor} iDevice Reference to the XR actor 
		 */
		XRManager.prototype.registerDevice = function (iDevice) {
			XRManager.prototype._listDevices.push(iDevice);
		};

		/**
		 * Return the reference to the XRDeviceActor corresponding to its deviceID
		 *
         * @method
		 * @public
		 * 
		 * @param  {STU.XRManager.EDeviceIdentifier } iDeviceID Device enum to return 
		 * @return {STU.XRDeviceActor} Reference to the XR actor 
		 */
		XRManager.prototype.getDevice = function (iDeviceID) {
			for (let i = 0; i < this._listDevices.length; i++) {
				if (this._listDevices[i].deviceID === iDeviceID) {
					return this._listDevices[i];
				}
			}
			return null;
		};

		/**
		 * Return the reference to all of the XRDeviceActor in the XR Experience
		 *
         * @method
		 * @public
		 * 
		 * @return {Array.<STU.XRDeviceActor>} Reference to the XR devices 
		 */
		XRManager.prototype.getDevices = function () {
			return this._listDevices;
		};

		/**
		 * Return the XR Headset
		 * 
		 * @method
		 * @private
		 * 
		 * @return {EP.Device}
		 */
		XRManager.prototype.getXRHeadset = function () {
			if (this._XRHeadset === null) {
				var devicesList = EPDevices.getDeviceList();
				// if there is only one device we suppose it is the XR Device
				if (devicesList.length == 1) {
					this._XRHeadset = devicesList[0];
				}
				else {
					for (var i = 0; i < devicesList.length; i++) {
						var device = devicesList[i];
						if ("headTracker" in device.trackerNames) {
							this._XRHeadset = device;
							break;
						}
					}
				}
			}
			return this._XRHeadset;
		};

		/**
		 * Device transform in the interaction area referential
		 *
		 * @method
		 * @private
		 * 
		 * @param  {STU.XRManager.EDeviceIdentifier } iDeviceID Device enum to return 
		 * @return {DSMath.Transformation} Transform of the device in the interaction area referential 
		 */
		XRManager.prototype.getDeviceTransform = function (iDeviceID) {
			var headset = this.getXRHeadset();
			if (headset === null) { // Case where XR headset isn't connected to the computer
				return new DSMath.Transformation();
			}

			var deviceTransform = headset.getTrackerNameValue(XRManager.EDeviceIdentifierName[iDeviceID]);

			if (iDeviceID === 0) { // Case where XR device actor has an DeviceID is set to none
				deviceTransform = null;
				return deviceTransform;
			}
			else if (iDeviceID === XRManager.EDeviceIdentifier.eRightHand) { // Case where XR Hand, as EP does not support them
				deviceTransform = this.xrHandRightPalmTransform 
			}
			else if (iDeviceID === XRManager.EDeviceIdentifier.eLeftHand) { // Case where XR Hand, as EP does not support them
				deviceTransform = this.xrHandLeftPalmTransform
			}

			if (deviceTransform === null || deviceTransform === undefined) { // Case where XR device isn't connected to the computer
				deviceTransform = null;
				return deviceTransform;
			}

			var localTransform = ThreeDS.Mathematics.multiplyTransfo(this._IVTechnoToV6Transform, deviceTransform);
			return localTransform;
		};

		/**
		 * Headset device transform in the device interaction area referential
		 *
		 * @method
		 * @private
		 * 
		 * @return {DSMath.Transformation} Transform of the headset device
		 */
		XRManager.prototype.getHeadsetTransform = function () {
			var device = this.getXRHeadset();
			if (device === null) { // Case where XR device isn't connected to the computer
				return new DSMath.Transformation();
			}

			var headsetTransform = device.getTrackerNameValue("headTracker");

			var transformInCamRef = headsetTransform.clone();

			transformInCamRef.matrix.setFirstColumn(headsetTransform.matrix.getThirdColumn());
			transformInCamRef.matrix.setSecondColumn(headsetTransform.matrix.getFirstColumn());
			transformInCamRef.matrix.setThirdColumn(headsetTransform.matrix.getSecondColumn());

			return ThreeDS.Mathematics.multiplyTransfo(this._IVTechnoToV6Transform, transformInCamRef);
		};




		var pickPath = null;
		var Interactions;
		(function (Interactions) {
			Interactions[(Interactions["Press"] = 0)] = "Press";
			Interactions[(Interactions["Release"] = 1)] = "Release";
			Interactions[(Interactions["Drag"] = 2)] = "Drag";
			Interactions[(Interactions["Move"] = 3)] = "Move";
		})(Interactions || (Interactions = {}));

		XRManager.prototype.interactions = Interactions;

        /**
         *
         * @private
         * @param {DSMath.Transformation} iTransform Transform of the controller sending the event
         * @param {STU.Intersection} iPickResult Picking result of STU.RenderManager pickFromRay 
         * @param {STU.XRManager.Interactions} iInteractionType The type of interaction to send to the UI element
         * @param {Boolean} iHoverEnabled The type of interaction to send to the UI element
         */
		XRManager.prototype.dispatchPickingToUi = function (iTransform, iPickResult, iInteractionType, iHoverEnabled) {
			if (this._wrapper !== null) {
				if ((iPickResult !== null) && ('_pickPath' in iPickResult) && (iPickResult._pickPath !== null)) {
					pickPath = iPickResult._pickPath;
				}
				else // IR-616533 - To detect if we pick in the background
				{
					this._wrapper.continuePicking(iTransform, null, false);
					return;
				}
				switch (iInteractionType) {
					case Interactions.Press:
						if (this._deactivateByPassForMove === null) {
							if (!iHoverEnabled) {
								this._wrapper.continuePicking(iTransform, pickPath, false);
							}
						}
						this._wrapper.launchPicking(iTransform, pickPath);
						break;

					case Interactions.Release:
						this._wrapper.stopPicking(iTransform);
						if (this._deactivateByPassForMove === null) {
							if (!iHoverEnabled) {
								this._wrapper.continuePicking(iTransform, null, false);
							}
						}
						break;

					case Interactions.Drag:
						this._wrapper.continuePicking(iTransform, pickPath, true);
						break;

					case Interactions.Move:
						this._wrapper.continuePicking(iTransform, pickPath, false);
						break;
				}
			}
		};

        /**
         * Displays axis using debug primitives for a given transform
         * Usefull for debugging 
         *
         * @method
         * @private
		 * 
         * @param  {DSMath.Transformation} t Transform to display
         * @param  {Number} alpha Transparency level ;  255 -> fully opaque, 0 -> invisible 
         */
		XRManager.prototype.debugTransfo = function (t, alpha) {
			if (alpha === undefined) {
				alpha = 255;
			}

			var dir = t.matrix.getFirstColumn();
			var right = t.matrix.getSecondColumn();
			var up = t.matrix.getThirdColumn();


			var rm = RenderManager.getInstance();

			rm._createVector({
				length: 200,
				startPoint: t.vector,
				direction: dir,
				color: new Color(255, 0, 0),
				alpha: alpha,
				lifetime: 1
			});
			rm._createVector({
				length: 200,
				startPoint: t.vector,
				direction: right,
				color: new Color(0, 255, 0),
				alpha: alpha,
				lifetime: 1
			});
			rm._createVector({
				length: 200,
				startPoint: t.vector,
				direction: up,
				color: new Color(0, 0, 255),
				alpha: alpha,
				lifetime: 1
			});
		};



		// Expose in STU namespace.
		STU.XRManager = XRManager;

		return XRManager;
	});

define('StudioIV/StuXRManager', ['DS/StudioIV/StuXRManager'], function (XRManager) {
	'use strict';

	return XRManager;
});
