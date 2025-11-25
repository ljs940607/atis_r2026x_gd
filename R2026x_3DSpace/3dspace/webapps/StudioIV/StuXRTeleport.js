define('DS/StudioIV/StuXRTeleport',
	['DS/StuCore/StuContext', 'DS/StuModel/StuBehavior', 'DS/EPTaskPlayer/EPTask', 'DS/StuCore/StuTools', 'DS/EP/EP', 'DS/MathematicsES/MathsDef', 'DS/StudioIV/StuXRManager'],
	function (STU, Behavior, Task, Tools, EP, DSMath, XRManager) {
		'use strict';

		/**
		 * Behavior that permit to Teleport on a XR Device
		 *
		 * @exports XRTeleport
		 * @class 
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends {STU.Behavior}
		 * @memberof STU
		 * @alias STU.XRTeleport
		 */
		var XRTeleport = function () {
			Behavior.call(this);
			this.name = "XR Teleport";

			//////////////////////////////////////////////////////////////////////////
			// Properties that should be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Identifier of the input that will trigger the teleport
			 * @public
			 * @type {STU.XRManager.EDeviceInput}
			 */
			this.teleportInputID;

			/**
			 * Collection that rassembles all the actors that are defined as ground that is available to telport to.
			 * @public
			 * @type {STU.Collection}
			 */
			this.groundElements;

			/**
			 * Set the speed of the 3D actor that will pull the 3D actor grabbed
			 * @public
			 * @type {Number}
			 */
			this.grabSpeed;

			/**
			 * Get/Set the unreachable ray color that will color the ray when trying to teleport to an undefined location
			 * @public
			 * @type {STU.ColorRGB}
			 */
			this.unreachableColor;

			/**
			 * Get/Set the fade duration on how long will the coloration of the ray will last
			 * @public
			 * @type {Number}
			 */
			this.fadeDuration;

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Up world vector to be used when computing the teleport constraints
			 * @private
			 * @type {DSMath.Vector3D}
			 */
			this._upVector = null;

			/**
			 * Remaining time to display the forbidden animation in ms
			 * @private
			 * @type {number}
			 */
			this._rayAnimRemainingTime = 0;

			/**
			 * Ray color before the forbidden animation
			 * @private
			 * @type {STU.ColorRGB}
			 */
			this._savedRayColor = new STU.ColorRGB();
		};

		XRTeleport.prototype = new Behavior();
		XRTeleport.prototype.constructor = XRTeleport;

		/**
		* Process executed when XRTeleport is initializating
		* 
		* @method
		* @private
		*/
		XRTeleport.prototype.onInitialize = function (oExceptions) {
			Behavior.prototype.onInitialize.call(this, oExceptions);

			// Note: binding during initialization, because binder needs access to a sub object delegate
			// that is assigned only later during the build (thus after constructor)
			//binding for vcx not working properly? +not relevant as only in play ?
			if (this.unreachableColor !== null && this.unreachableColor !== undefined) {
				if (!(this.unreachableColor instanceof STU.ColorRGB)) {
					this.unreachableColor = new STU.ColorRGB(this.unreachableColor[0] / 255, this.unreachableColor[1] / 255, this.unreachableColor[2] / 255);
				}
			}

		};

		/**
		* Process executed when XRTeleport is activating
		* 
		* @method
		* @private
		*/
		XRTeleport.prototype.onActivate = function (oExceptions) {
			Behavior.prototype.onActivate.call(this, oExceptions);

			this._actor = this.getActor();

			// Up world vector to be used when computing the teleport constraints ; parent should be XR Interaction Area
			var parent = this._actor.getParent();
			if (parent != null && parent != undefined) {
				this._upVector = parent.getTransform("World").matrix.getThirdColumn()
			}

			//// if the controller is under a location, its up vector is used 
			//var parent = this._actor;
			//while (parent != null && parent != undefined) {
			//	if (parent instanceof STU.Location) {
			//		this._upVector = parent.getTransform("World").matrix.getThirdColumn();
			//		break;
			//	}
			//	parent = parent.getParent();
			//}

			EP.EventServices.addObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
		};

		/**
		* Process executed when XRTeleport is deactivating
		* 
		* @method
		* @private
		*/
		XRTeleport.prototype.onDeactivate = function () {
			Behavior.prototype.onDeactivate.call(this);

			EP.EventServices.removeObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
		};

		/**
		 * Update method called each frames
		 *
		 * @method
		 * @private
		 */
		XRTeleport.prototype.onExecute = function (iContext) {
			// Only the forbidden ray animation animation is handled in the execute loop  
			if (this._rayAnimRemainingTime > 0) {

				// When there is no more remaining time, we restore the color 
				if (this._rayAnimRemainingTime - iContext.deltaTime <= 0) {
					this._actor.XRRay.color.r = this._savedRayColor.r;
					this._actor.XRRay.color.g = this._savedRayColor.g;
					this._actor.XRRay.color.b = this._savedRayColor.b;
					this._actor.XRRay._updateRayParams();
				}
				this._rayAnimRemainingTime -= iContext.deltaTime;
			}
		};

		/**
		 * Teleport the user to the place pointed by the controller ray 
		 * The interaction context will be translate in such a way that the picked point will be right under the controller
		 *
		 * @method
		 * @private
		 */
		XRTeleport.prototype.teleport = function () {
			//check if we have a XRRay behavior attached first
			if (this._actor.XRRay === null || this._actor.XRRay === undefined) {
				console.error("There is no XR Ray Behavior attached to this actor. XR Teleport cannot work properly.")
				return
			}

			var intersection = this._actor.XRRay.pick();

			// No pickable actor was found, no need to go further
			if (intersection === undefined || intersection === null) {
				return;
			}

			// If the groundElements collection contains actor, we check that the picked actor is one of them  
			var ignorePickingAngleConstraint = false;
			if (this.groundElements !== null && this.groundElements !== undefined) {

				if (this.groundElements.contains(intersection.getActor()) === false) {
					// the picked actor isn't in the picking collection
					return;
				} else {
					// actor was found in the collection, we remove the constraint
					ignorePickingAngleConstraint = true;
				}
			}

			var normal = intersection.getNormal();
			var angleBetweenVectors = normal.getAngleTo(this._upVector);

			// If the angle between upWorld and the normal is over 20 degrees we forbid teleport
			// and we give feedback to the user by changing the ray color
			if (ignorePickingAngleConstraint === false && angleBetweenVectors * DSMath.constants.RAD_TO_DEG > 20) {
				//we only save the color if there is no animation going on 
				if (this._rayAnimRemainingTime <= 0) {
					var rayColor = this._actor.XRRay.color;
					this._savedRayColor.r = rayColor.r; // clone the current color
					this._savedRayColor.g = rayColor.g; // clone the current color
					this._savedRayColor.b = rayColor.b; // clone the current color

					rayColor.r = this.unreachableColor.r;
					rayColor.g = this.unreachableColor.g;
					rayColor.b = this.unreachableColor.b;

					this._actor.XRRay._updateRayParams();
				}

				this._rayAnimRemainingTime = this.fadeDuration;
				return;
			}

			// It's time to translate the interaction context 
			// in order to do that we need to compute the translation vector 
			var XRMgr = STU.XRManager.getInstance();
			var interAreaActor = XRMgr.getInteractionArea();

			var interAreaTransform = new DSMath.Transformation();
			interAreaTransform = interAreaActor.getTransform("World");

			// First we project the controller position on the interaction context plane 
			var ctlPos = XRMgr.getDeviceTransform(this._actor.deviceID).vector;

			var interAreaPos = interAreaTransform.vector.clone();
			var interAreaUp = interAreaTransform.matrix.getThirdColumn();

			// construction of the interaction context plane from the position and it's up vector 
			var interAreaPlane = new DSMath.Plane().setOrigin(interAreaPos.x, interAreaPos.y, interAreaPos.z)
				.setNormal(interAreaUp.x, interAreaUp.y, interAreaUp.z);

			var ctlProjectionOnInterAreaGround = ctlPos.projectOnPlane(interAreaPlane).clone();
			ctlProjectionOnInterAreaGround.applyTransformation(interAreaTransform);

			// from that we compute the translation vector
			var intersectionPoint = intersection.getPoint();
			var interactionAreaToIntersectionPt = DSMath.Vector3D.sub(intersectionPoint, interAreaPos);

			var projectionToIntersection = DSMath.Vector3D.sub(interactionAreaToIntersectionPt, ctlProjectionOnInterAreaGround);
			interAreaTransform.vector.add(projectionToIntersection);

			interAreaActor.setTransform(interAreaTransform, "World");
		};

		/**
		 * Event listener called each time a device button is pressed
		 * It tries to teleport the user to the place pointed by the controller ray when the teleportButton is pressed 
		 *
		 * @method
		 * @private
		 */
		XRTeleport.prototype._onDevicePressEvent = function (iDeviceEvent) {
			// Only events about the teleport button interest us
			let controllerID = this._actor.deviceID; //controller1 is deviceID=1 and controller2 is deviceID=2 "luckily"
			if (iDeviceEvent.buttonName !== XRManager.EDeviceInputName[this.teleportInputID] + "_" + controllerID) {
				return;
			}

			this.teleport();
		};
		


		// Expose in STU namespace.
		STU.XRTeleport = XRTeleport;

		return XRTeleport;
	});

define('StudioIV/StuXRTeleport', ['DS/StudioIV/StuXRTeleport'], function (XRTeleport) {
	'use strict';

	return XRTeleport;
});



