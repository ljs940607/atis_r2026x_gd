define('DS/StudioIV/StuXRDeviceActor',
	['DS/StuCore/StuContext', 'DS/EPTaskPlayer/EPTask', 'DS/StuRenderEngine/StuActor3D', 'DS/StuCore/StuTools', 'DS/StudioIV/StuXRManager'],
	function (STU, Task, Actor3D, Tools, XRManager) {
		("use strict");

		/**
		 * VR Process Transform update TASK.
		 * @class
		 * @private
		 */
		// We need to create a task to update each frame the pos
		var XRDeviceUpdateTask = function (actHandler) {
			Task.call(this);
			this.name = "XRDeviceUpdateTask";
			this.actHandler = actHandler;
		};

		XRDeviceUpdateTask.prototype = new Task();
		XRDeviceUpdateTask.prototype.constructor = XRDeviceUpdateTask;

		/**
		 * Method called each frame by the task manager
		 *
		 * @method
		 * @private
		 * @param  iExeCtx Execution context
		 */
		XRDeviceUpdateTask.prototype.onExecute = function (iExContext) {
			if (this.actHandler === undefined || this.actHandler === null) {
				return this;
			}
			var actHandler = this.actHandler;

			if (actHandler !== undefined && typeof actHandler.onExecute === "function") {
				actHandler.onExecute(iExContext);
			}
		};

		/**
		 * Describes a XR Device actor.</br>
		 *
		 * @exports XRDeviceActor
		 * @class
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends STU.Actor3D
		 * @memberof STU
		 * @alias STU.XRDeviceActor
		 */
		var XRDeviceActor = function () {
			Actor3D.call(this);
			this.name = "XRDeviceActor";

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Private object that hold the reference to the instance of the XRManager
			 *
			 * @member
			 * @instance
			 * @name _XRMgr
			 * @private
			 * @type {Object}
			 * @memberof STU.XRDeviceActor
			 */
			this._XRMgr = null;

			//////////////////////////////////////////////////////////////////////////
			// Properties that should be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Geometry of the XR device
			 *
			 * @member
			 * @instance
			 * @name geometry
			 * @public
			 * @type {STU.XRDeviceActor.EGeometries}
			 * @memberof STU.XRDeviceActor
			 */
			Object.defineProperty(this, "geometry", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						return this.CATI3DExperienceObject.GetValueByName("geometry");
					}
				},
				set: function (value) {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						var enumObj = STU.XRDeviceActor.EGeometries;
						for (var e in enumObj) {
							if (value !== enumObj[e]) {
								this.CATI3DExperienceObject.SetValueByName("geometry", value);
								return;
							}
						}

						throw new TypeError("given value should be a value from STU.XRDeviceActor.EGeometries");
					}
				},
			});

			/**
			 * Get/Set the identifier that define which XR Device it is
			 *
			 * @member
			 * @instance
			 * @name  deviceID
			 * @public
			 * @type {STU.XRManager.EDeviceIdentifier}
			 * @memberof STU.XRDeviceActor
			 */
			Object.defineProperty(this, "deviceID", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						return this.CATI3DExperienceObject.GetValueByName("deviceID");
					}
				},
				set: function (value) {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						var enumObj = STU.XRManager.EDeviceIdentifier;
						for (var e in enumObj) {
							if (value !== enumObj[e]) {
								this.CATI3DExperienceObject.SetValueByName("deviceID", value);
								return;
							}
						}

						throw new TypeError("given value should be a value from STU.XRManager.EDeviceIdentifier");
					}
				},
			});
		};

		/**
		 * An enumeration of supported geometries for a XR Device </br>
		 *
		 * @enum {number}
		 * @public
		 *
		 */
		XRDeviceActor.EGeometries = {
			/** @private */
			eNone: 0,
			/** @private */
			eDefault: 1,
		};

		XRDeviceActor.prototype = new Actor3D();
		XRDeviceActor.prototype.constructor = XRDeviceActor;

		/**
		 * Process executed when XRDeviceActor is initializing
		 *
		 * @method
		 * @private
		 */
		XRDeviceActor.prototype.onInitialize = function (oExceptions) {
			Actor3D.prototype.onInitialize.call(this, oExceptions);

			// Note: binding during initialization, because binder needs access to a sub object delegate
			// that is assigned only later during the build (thus after constructor)
			// cannot use tools bindings with scene switch
			//STU.bindVariableEnum(this, { varName: "geometry", propName: "geometry", enum: STU.XRDeviceActor.EGeometries });
			//STU.bindVariableEnum(this, { varName: "deviceID", propName: "deviceID", enum: STU.XRManager.EDeviceIdentifier });
		};

		/**
		 * Process executed when XRDeviceActor is activating
		 *
		 * @method
		 * @private
		 */
		XRDeviceActor.prototype.onActivate = function (oExceptions) {
			Actor3D.prototype.onActivate.call(this, oExceptions);

			// need to create an implicit execute task to the task player as it is not a behavior
			this._XRDeviceUpdateTask = new XRDeviceUpdateTask(this);
			EP.TaskPlayer.addTask(this._XRDeviceUpdateTask, STU.getTaskGroup(STU.ETaskGroups.ePostProcess));

			// XR manager reference
			if (XRManager !== null && XRManager !== undefined && typeof XRManager.getInstance === "function") {
				this._XRMgr = XRManager.getInstance();

				//register it to manager
				this._XRMgr._listDevices.push(this);
			}

			if (this.deviceID == 0) {
				console.warn("A XR Device has not been correctly identified.");
			}
		};

		/**
		 * Process executed when XRDeviceActor is deactivating
		 *
		 * @method
		 * @private
		 */
		XRDeviceActor.prototype.onDeactivate = function () {
			// remove explicit task to stop the update
			EP.TaskPlayer.removeTask(this._XRDeviceUpdateTask);
			delete this._XRDeviceUpdateTask;

			Actor3D.prototype.onDeactivate.call(this);
		};

		/**
		 * Update method called each frames => actually called by XRDeviceUpdateTask
		 * @method
		 * @private
		 */
		XRDeviceActor.prototype.onExecute = function () {
			// Case where XR headset isn't connected to the computer
			var headset = this._XRMgr.getXRHeadset();
			if (headset === null) {
				return
			}

			var localCtrlTransform = null;

			// The transform from getDeviceTransform() is in the interaction context referential
			localCtrlTransform = this._XRMgr.getDeviceTransform(this.deviceID);

			// Apply the computed device transform to its Actor 3D counterpart
			if (localCtrlTransform === null || localCtrlTransform === undefined) {
				//no device detected so i should hide it no?
				this.setVisible(false);
			}
			else {
				this.setTransform(localCtrlTransform, this._XRMgr.getInteractionArea());
				if (this.isVisible() === false) {
					this.setVisible(true); // make sure that it is now visible?
				}
			}
		};

		/**
		 * Returns the Device ID associated with this XR Device
		 * (set private bc useless as deviceID member is public)
		 *
		 * @method
		 * @private
		 *
		 * @returns {number} {STU.XRManager.EDeviceIdentifier}
		 */
		XRDeviceActor.prototype.getDeviceID = function () {
			return this.deviceID;
		};

		// Expose in STU namespace.
		STU.XRDeviceActor = XRDeviceActor;

		return XRDeviceActor;
	}
);
