define('DS/StudioIV/StuXRHeadsetActor',
	['DS/StuCore/StuContext', 'DS/EPTaskPlayer/EPTask', 'DS/StuRenderEngine/StuCameraNa', 'DS/StudioIV/StuXRManager', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices'],
	function (STU, Task, Camera, XRManager, Event, EventServices) {
		'use strict';

		/**
		 * VR Process Transform update TASK.
		 * @class 
		 * @private
		 */
		// We need to create a task to update each frame the pos
		var XRHeadsetUpdateTask = function (actHandler) {
			Task.call(this);
			this.name = "XRHeadsetUpdateTask";
			this.actHandler = actHandler;
		};

		XRHeadsetUpdateTask.prototype = new Task();
		XRHeadsetUpdateTask.prototype.constructor = XRHeadsetUpdateTask;

		/**
		 * Method called each frame by the task manager
		 *
		 * @method
		 * @private
		 * @param  iExeCtx Execution context
		 */
		XRHeadsetUpdateTask.prototype.onExecute = function (iExContext) {
			if (this.actHandler === undefined || this.actHandler === null) {
				return this;
			}
			var actHandler = this.actHandler;

			if (actHandler !== undefined && typeof actHandler.onExecute === "function") {
				actHandler.onExecute(iExContext);
			}
		};


        /**
        * This event is thrown when the headset is taken off the user head
        *
        * @exports XRHeadsetTakenOffEvent
        * @class
        * @constructor
        * @noinstancector
        * @public
        * @extends EP.Event
        * @memberof STU
        */
		var XRHeadsetTakenOffEvent = function () {
			Event.call(this);
		};

		XRHeadsetTakenOffEvent.prototype = new Event();
		XRHeadsetTakenOffEvent.prototype.constructor = XRHeadsetTakenOffEvent;
		XRHeadsetTakenOffEvent.prototype.type = 'XRHeadsetTakenOffEvent';

		// Expose in STU namespace.
		STU.XRHeadsetTakenOffEvent = XRHeadsetTakenOffEvent;
		EventServices.registerEvent(XRHeadsetTakenOffEvent);

        /**
        * This event is thrown when the headset is put on the user head
        *
        * @exports XRHeadsetPutOnEvent
        * @class
        * @constructor
        * @noinstancector
        * @public
        * @extends EP.Event
        * @memberof STU
        */
		var XRHeadsetPutOnEvent = function () {
			Event.call(this);
		};

		XRHeadsetPutOnEvent.prototype = new Event();
		XRHeadsetPutOnEvent.prototype.constructor = XRHeadsetPutOnEvent;
		XRHeadsetPutOnEvent.prototype.type = 'XRHeadsetPutOnEvent';

		// Expose in STU namespace.
		STU.XRHeadsetPutOnEvent = XRHeadsetPutOnEvent;
		EventServices.registerEvent(XRHeadsetPutOnEvent);



        /**
         * Describes a XR Headset Actor.<br/>
         * 
         *
         * @exports XRHeadsetActor
         * @class
         * @constructor
         * @noinstancector
         * @public
         * @extends STU.Camera
         * @memberof STU
         * @alias STU.XRHeadsetActor
         */
		var XRHeadsetActor = function () {
			Camera.call(this);
			this.name = 'XRHeadsetActor';

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Private object that hold the button related to headset wornability
			 *
			 * @member
			 * @instance
			 * @name _headsetWornButtonID
			 * @private
			 * @type {Object}
			 * @memberof STU.XRHeadsetActor
			 */
			this._headsetWornButtonID = "bHeadsetWorn"; //this string specific will have to change when changing the input management of XR Device

			/**
			 * Private object that hold the reference to the instance of the XRManager
			 *
			 * @member
			 * @instance
			 * @name _XRMgr
			 * @private
			 * @type {Object}
			 * @memberof STU.XRHeadsetActor
			 */
			this._XRMgr = null;
		};

		XRHeadsetActor.prototype = new Camera();
		XRHeadsetActor.prototype.constructor = XRHeadsetActor;

        /**
		 * Process executed when XRHeadsetActor is activating
         * 
		 * @method
         * @private
         */
		XRHeadsetActor.prototype.onActivate = function (oExceptions) {
			Camera.prototype.onActivate.call(this, oExceptions);

			// Add Listener to get notified : Registers listeners for headset state
			EventServices.addObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
			EventServices.addObjectListener(EP.DeviceReleaseEvent, this, '_onDeviceReleaseEvent');

			// need to create an implicit execute task to the task player as it is not a behavior
			this._XRHeadsetUpdateTask = new XRHeadsetUpdateTask(this);
			EP.TaskPlayer.addTask(this._XRHeadsetUpdateTask, STU.getTaskGroup(STU.ETaskGroups.ePostProcess));

			// XR manager reference
			if (XRManager !== null && XRManager !== undefined && typeof XRManager.getInstance === "function") {
				this._XRMgr = XRManager.getInstance();

				// register the XR Headset actor in XRManager
				this._XRMgr._XRHeadsetActor = this;
			}

			this._inputManager = new STU.InputManager();
			this._inputManager.initialize();
			this._inputManager.activate(true);

			this._inputManager.keyLeft = EP.Keyboard.EKey.eLeft;
			this._inputManager.keyRight = EP.Keyboard.EKey.eRight;
			this._inputManager.keyUp = EP.Keyboard.EKey.eUp;
			this._inputManager.keyDown = EP.Keyboard.EKey.eDown;
			this._inputManager.mouseAxis = 2;

			this._inputManager.keyFront = EP.Keyboard.EKey.ePageUp;
			this._inputManager.keyBack = EP.Keyboard.EKey.ePageDown;

			this._lastMousePosition = new DSMath.Point();
		};

        /**
		 * Process executed when XRHeadsetActor is deactivating
         * 
		 * @method
         * @private
         */
		XRHeadsetActor.prototype.onDeactivate = function () {
			// Remove Listener when you don't need it anymore : Unregisters listeners for headset state
			EventServices.removeObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
			EventServices.removeObjectListener(EP.DeviceReleaseEvent, this, '_onDeviceReleaseEvent');

			// remove explicit task to stop the update
			EP.TaskPlayer.removeTask(this._XRHeadsetUpdateTask);
			delete this._XRHeadsetUpdateTask;

			Camera.prototype.onDeactivate.call(this);
		};

		/**
		 * Update method called each frames => actually called by XRHeadsetUpdateTask
		 * @method
		 * @private
		 */
		XRHeadsetActor.prototype.onExecute = function (iExeCtx) {
			// Case where XR headset isn't connected to the computer
			var headset = this._XRMgr.getXRHeadset();
			if (headset === null) {
				this.manageMovementEmulator(iExeCtx.deltaTime / 1000)
				return;
			}

			// The headset transform is relative to the interaction context
			var XRHeadsetTransform = this._XRMgr.getHeadsetTransform();
			this.setTransform(XRHeadsetTransform, this._XRMgr.getInteractionArea());

		};

		/**
		 * Update method called each frames
		 *
		 * @method
		 * @private
		 */
		XRHeadsetActor.prototype.manageMovementEmulator = function (iDeltaTime) {
			//////////////////////////
			//Handle cam movement
			//////////////////////////
			var forward = this.getForward();
			var right = this.getRight();
			var ZAxisVec = new DSMath.Vector3D(0, 0, 1);

			var forwardZ0 = this.getForward();
			forwardZ0.z = 0;
			forwardZ0.normalize();

			var axisX = this._inputManager.axis1.x;
			var axisY = this._inputManager.axis1.y;
			var axisZ = this._inputManager.axis1.z;

			var motionVector;
			motionVector = DSMath.Vector3D.multiplyScalar(right, axisX);
			motionVector.add(DSMath.Vector3D.multiplyScalar(forwardZ0, axisY));
			motionVector.add(DSMath.Vector3D.multiplyScalar(ZAxisVec, axisZ));

			if (motionVector.squareNorm() > 0) {
				motionVector.normalize();
			}

			// setting speed of movement
			this.walkSpeed = 2000.0;
			var speed = this.walkSpeed;
			speed *= iDeltaTime;
			motionVector.multiplyScalar(speed);

			//actually setting the new pos
			var currentCamPos = this.getPosition();
			var nextCamPosition = null;
			nextCamPosition = currentCamPos;
			nextCamPosition.add(motionVector);

			this.setPosition(nextCamPosition);

			//////////////////////////
			//Handle cam rotation
			//////////////////////////
			this._standHeight = 1800.0;

			this._zWorld = new DSMath.Vector3D();
			this._zWorld.set(0, 0, 1);
			this.horizontalRotationSensitivity = 100
			this.verticalRotationSensitivity = 100

			if (this._inputManager.buttonsState[8] === false) {
				this._isMousePressed = false;
			} else {
				//if the mouse wasn't pressed the previous frame 
				if (this._isMousePressed === false) {
					this._lastMousePosition.x = this._inputManager.axis2.x;
					this._lastMousePosition.y = this._inputManager.axis2.y;
				}
				this._isMousePressed = true;
			}

			if (this._isMousePressed === true) {
				var deltaX = 0;
				var deltaY = 0;

				//manage mouse inputs
				var mouseXAxis = this._inputManager.axis2.x;
				var mouseYAxis = this._inputManager.axis2.y;

				var refX = this._lastMousePosition.x;
				var refY = this._lastMousePosition.y;

				deltaX = mouseXAxis - refX;
				deltaY = mouseYAxis - refY;

				var camToTarget = new DSMath.Vector3D();

				var rightQuat = new DSMath.Quaternion();
				rightQuat.makeRotation(right, -deltaY * STU.Math.DegreeToRad * this.horizontalRotationSensitivity * iDeltaTime);

				var zAxisQuat = new DSMath.Quaternion();
				zAxisQuat.makeRotation(this._zWorld, deltaX * STU.Math.DegreeToRad * this.verticalRotationSensitivity * iDeltaTime);

				var composedRotQuat = DSMath.Quaternion.multiply(rightQuat, zAxisQuat);

				var forwardPoint = new DSMath.Point();
				forwardPoint.set(forward.x, forward.y, forward.z);
				var camToTargetPoint = forwardPoint.applyQuaternion(composedRotQuat);//var camToTargetPoint = composedRotQuat.rotate(forwardPoint);
				camToTarget.set(camToTargetPoint.x, camToTargetPoint.y, camToTargetPoint.z);

				//avoid rotation glitches
				if (Math.abs(camToTarget.z) > 0.999) {
					forwardPoint.set(forward.x, forward.y, forward.z);
					camToTargetPoint = forwardPoint.applyQuaternion(zAxisQuat);//camToTargetPoint = zAxisQuat.rotate(forwardPoint);
					camToTarget.set(camToTargetPoint.x, camToTargetPoint.y, camToTargetPoint.z);
				}
				var lookAtPosition = new DSMath.Vector3D();
				lookAtPosition.set(nextCamPosition.x + camToTarget.x, nextCamPosition.y + camToTarget.y, nextCamPosition.z + camToTarget.z);
				this.lookAt(lookAtPosition);
			}

			return this;
		};

		/**
		 * Method called as listener is triggered to DevicePressEvent to dispatch XRHeadsetPutOnEvent
		 * @method
		 * @private
		 */
		XRHeadsetActor.prototype._onDevicePressEvent = function (iEvent) {
			if (iEvent.buttonName !== this._headsetWornButtonID) {
				return;
			}
			else {
				this.dispatchEvent(new XRHeadsetPutOnEvent());
			}
		};

		/**
		 * Method called as listener is triggered to DeviceReleaseEvent to dispatch XRHeadsetTakenOffEvent
		 * @method
		 * @private
		 */
		XRHeadsetActor.prototype._onDeviceReleaseEvent = function (iEvent) {
			if (iEvent.buttonName !== this._headsetWornButtonID) {
				return;
			}
			else {
				this.dispatchEvent(new XRHeadsetTakenOffEvent());
			}
		};

		/**
		 * True when the headset is on top of the user head, false otherwise 
		 * 
		 * @public
		 * @return {Boolean}
		 */
		XRHeadsetActor.prototype.isWorn = function () {
			var XRHeadset = this._XRMgr.getXRHeadset();
			if (XRHeadset !== null && XRHeadset !== undefined) {
				return XRHeadset.isButtonNamePressed(this._headsetWornButtonID);
			}
			else {
				return false;
			}
		};

		// Expose in STU namespace.
		STU.XRHeadsetActor = XRHeadsetActor;

		return XRHeadsetActor;
	});
