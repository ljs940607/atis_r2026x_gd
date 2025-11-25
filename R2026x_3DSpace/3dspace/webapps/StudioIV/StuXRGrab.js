define('DS/StudioIV/StuXRGrab',
	['DS/StuCore/StuContext', 'DS/StuModel/StuBehavior', 'DS/EPTaskPlayer/EPTask', 'DS/StuCore/StuTools', 'DS/EP/EP', 'DS/EPEventServices/EPEvent', 'DS/MathematicsES/MathsDef', 'DS/StudioIV/StuXRManager', 'DS/StuWebPlayer/StuWebPlayer'],
	function (STU, Behavior, Task, Tools, EP, EventServices, DSMath, XRManager, WebPlayer) {
		'use strict';

		/**
		 * Behavior that permit to grab on a XR Device
		 *
		 * @exports XRGrab
		 * @class 
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends {STU.Behavior}
		 * @memberof STU
		 * @alias STU.XRGrab
		 */
		var XRGrab = function () {
			Behavior.call(this);
			this.name = "XR Grab";

			//////////////////////////////////////////////////////////////////////////
			// Properties that should be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Identifier of the input that will trigger the grab
			 * @public
			 * @type {STU.XRManager.EDeviceInput}
			 */
			this.grabInputID;

			/**
			 * Enable or disable gravity gun. Gravity gun will bring closer the 3D actor that is grabbed to the viewer
			 * @public
			 * @type {Boolean}
			 */
			this.gravityGun;

			/**
			 * Get/Set the speed of the 3D actor that will pull the 3D actor grabbed
			 * @public
			 * @type {Number}
			 */
			this.grabSpeed;

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Reference to the Actor3D currently grabbed 
			 * @private
			 * @type {Actor3D}
			 */
			this._actorToGrab = null;

			/**
			 * Reference to the previous Actor3D grabbed 
			 * @private
			 * @type {Actor3D}
			 */
			this._previousActorToGrab = null;

			/**
			 * Transform of the actor when is was grabbed in the controller referential
			 * @private
			 * @type {Transform}
			 */
			this._ctrlToActorTransform = null;

			/**
			 * Flag set to true when the actor bounding box has reached the controller
			 * @private
			 * @type {Boolean}
			 */
			this._isInsideBoundingBox = false;

			/**
			 * If the manipulated actor contains a RigidBody behavior
			 * we save its current mode, switched it to driven and restore it after the manipulation
			 * @private
			 * @type {Number}
			 */
			this._rigidBodyMode = -1;
		}

		XRGrab.prototype = new Behavior();
		XRGrab.prototype.constructor = XRGrab;

		/**
		* Process executed when XRGrab is activating
		* 
		* @method
		* @private
		*/
		XRGrab.prototype.onActivate = function (oExceptions) {
			Behavior.prototype.onActivate.call(this, oExceptions);

			EP.EventServices.addObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
			EP.EventServices.addObjectListener(EP.DeviceReleaseEvent, this, '_onDeviceReleaseEvent');

			this._actor = this.getActor();
		};

		/**
		* Process executed when XRGrab is deactivating
		* 
		* @method
		* @private
		*/
		XRGrab.prototype.onDeactivate = function () {
			Behavior.prototype.onDeactivate.call(this);

			EP.EventServices.removeObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
			EP.EventServices.removeObjectListener(EP.DeviceReleaseEvent, this, '_onDeviceReleaseEvent');
		};

		/**
		 * Update method called each frames
		 *
		 * @method
		 * @private
		 */
		XRGrab.prototype.onExecute = function (context) {
			// Do nothing when no actor is grabbed
			if (this._actorToGrab !== null) {

				// When the gravity gun option is on, we need to pull the grabbed actor towards the controller
				if (this.gravityGun === true) {

					if (this._previousActorToGrab !== this._actorToGrab) {
						// First we get the bounding box of the grabbed actor and compute its center and radius
						var BBox = this._actorToGrab.getOrientedBoundingBox();

						// Compute bounding box center
						this.BBCenterInWorld = new DSMath.Vector3D().set(
							(BBox.low.x + BBox.high.x) / 2,
							(BBox.low.y + BBox.high.y) / 2,
							(BBox.low.z + BBox.high.z) / 2
						);

						this.currentTransObj = this._actorToGrab.getTransform();
						this.BBRadius = BBox.low.distanceTo(BBox.high) / 2;
					}
					else {
						// If the grabbed actor doesn't change, we apply the transformation to the bounding box
						var BBCenterTransfo = new DSMath.Transformation();
						BBCenterTransfo.vector = this.BBCenterInWorld;

						var BBCenterInActor = DSMath.Transformation.multiply(this.previousTransObj.getInverse(), BBCenterTransfo);

						this.currentTransObj = this._actorToGrab.getTransform();
						this.BBCenterInWorld = DSMath.Transformation.multiply(this.currentTransObj, BBCenterInActor).vector;
					}

					// We assume that the controller position is the vector part of its transform
					var ctrlPos = this.getActor().getPosition();
					var controllerToActor = DSMath.Vector3D.sub(this.BBCenterInWorld, ctrlPos);

					var ctrlToActorSquareDistance = controllerToActor.squareNorm();

					// we pull the grabbed actor until when reached the bounding box distance
					if (ctrlToActorSquareDistance > (this.BBRadius * this.BBRadius) && this._isInsideBoundingBox === false) {
						// we want to pull the actor along the controller ray
						var trackerRectifiedTransfo = this._ctrlToActorTransform.clone();
						trackerRectifiedTransfo.setEulerRotation([0, Math.PI / 6, 0]); //STU.XRManager.controllerTransformToRayTransform(trackerRectifiedTransfo);

						// The translation happens in the controller referencial 
						var inv = this._ctrlToActorTransform.getInverse();
						var rayOriginToActor = DSMath.Transformation.multiply(inv, trackerRectifiedTransfo).matrix.getSecondColumn();

						// deltaTime is in ms -> we divide by 1000 to get a speed in s 
						var translateAmount = this.grabSpeed * context.deltaTime / 1000;

						var ctrlToActorDistance = Math.sqrt(ctrlToActorSquareDistance);

						// if the translation vector is inside the bounding box we adjust 
						// the vector to be just on the border of the box
						if (ctrlToActorDistance - translateAmount < this.BBRadius) {
							translateAmount = ctrlToActorDistance - this.BBRadius;
							this._isInsideBoundingBox = true;
						}

						// we assume here that rayOriginToActor is normalized 
						var translateVector = rayOriginToActor.multiplyScalar(translateAmount);

						// we add the translation vector the to current grabbed actor transform 
						this._ctrlToActorTransform.vector.add(translateVector);
					} else {
						this._isInsideBoundingBox = true;
					}
				}

				this.previousTransObj = this.currentTransObj;

				// we apply the new computed transform to the grabbed actor
				this._actorToGrab.setTransform(this._ctrlToActorTransform, this.getActor());

				this._previousActorToGrab = this._actorToGrab;
			}
		};

		/**
		 * Event listener called each time a device button is pressed
		 *
		 * @method
		 * @private
		 */
		XRGrab.prototype._onDevicePressEvent = function (iDeviceEvent) {
			// Only events about the manipulator grab button interest us
			let controllerID = this._actor.deviceID; //controller1 is deviceID=1 and controller2 is deviceID=2 "luckily"
			if (iDeviceEvent.buttonName !== XRManager.EDeviceInputName[this.grabInputID] + "_" + controllerID ) {
				return;
			}

			// When the grab button is pressed we launch a pick along the controller ray to known which actor needs to be grabbed
			//AVP MODIF ghost pick override
			if (WebPlayer.getInstance().isAVPEnabled()) {
				var intersection = new STU.Intersection()
				intersection.setActor(iDeviceEvent.actor)
			}
			else {
				//check if we have a XRRay behavior attached first
				if (this._actor.XRRay === null || this._actor.XRRay === undefined) {
					console.error("There is no XR Ray Behavior attached to this actor. XR Grab cannot work properly.")
					return;
				}

				var intersection = this._actor.XRRay.pick();
			}

			if (intersection !== undefined && intersection !== null && intersection.actor !== undefined && intersection.actor !== null) {
				// we save the grabbed actor 
				this._actorToGrab = intersection.getActor();

				// we save the grabbed actor transform in the controller referential
				var actorTransfo = this._actorToGrab.getTransform(this.getActor());
				this._ctrlToActorTransform = actorTransfo;
				// We assume the controller is far away from the actor's bounding box 
				this._isInsideBoundingBox = false;

				// in case there is a rigidbody behavior
				if (this._actorToGrab.RigidBody !== undefined && this._actorToGrab.RigidBody !== null) {
					this._rigidBodyMode = this._actorToGrab.RigidBody.motionType; // we save the current mode
					this._actorToGrab.RigidBody.motionType = 2; // and switch the mode to driven
				}
			}
		};

		/**
		 * Event listener called each time a device button is released
		 *
		 * @method
		 * @private
		 */
		XRGrab.prototype._onDeviceReleaseEvent = function (iDeviceEvent) {
			// Only events about the manipulator grab button interest us
			let controllerID = this._actor.deviceID; //controller1 is deviceID=1 and controller2 is deviceID=2 "luckily"
			if (iDeviceEvent.buttonName !== XRManager.EDeviceInputName[this.grabInputID] + "_" + controllerID) {
				return;
			}

			// we restore the rigidbody motion mode
			if (this._actorToGrab !== null && this._rigidBodyMode !== -1) {
				this._actorToGrab.RigidBody.motionType = this._rigidBodyMode;
				this._rigidBodyMode = -1;
			}
			// the grab is ended, we release the reference to the actor
			this._actorToGrab = null;
		};

		// Expose in STU namespace.
		STU.XRGrab = XRGrab;

		return XRGrab;
	});

define('StudioIV/StuXRGrab', ['DS/StudioIV/StuXRGrab'], function (XRGrab) {
	'use strict';

	return XRGrab;
});
