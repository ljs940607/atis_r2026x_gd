define('DS/StudioIV/StuXRRay',
	['DS/StuCore/StuContext', 'DS/StuModel/StuBehavior', 'DS/EPTaskPlayer/EPTask', 'DS/StuCore/StuTools', 'DS/EP/EP', 'DS/MathematicsES/MathsDef', 'DS/EPEventServices/EPEvent', 'DS/StudioIV/StuXRManager'],
	function (STU, Behavior, Task, Tools, EP, DSMath, EventServices, XRManager) {
		'use strict';

		/**
		 * Behavior that permit to Ray on a XR Device
		 *
		 * @exports XRRay
		 * @class 
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends {STU.Behavior}
		 * @memberof STU
		 * @alias STU.XRRay
		 */
		var XRRay = function () {
			Behavior.call(this);
			this.name = "XR Ray";

			//////////////////////////////////////////////////////////////////////////
			// Properties that should be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Identifier of the input that will trigger the click
			 * @public
			 * @type {STU.XRManager.EDeviceInput}
			 */
			this.clickInputID;

			/**
			 * Enable or disable the display of the ray
			 * @public
			 * @type {Boolean}
			 */
			this.display;

			/**
			 * Get/Set the offset of the origin of the ray compared to the origin of the XR Device
			 * @public
			 * @type {DSMath.Vector3D}
			 */
			this.offset;

			/**
			 * Get/Set the length of the ray
			 * @public
			 * @type {Number}
			 */
			this.length;

			/**
			 * Get/Set the color of the ray
			 * @public
			 * @type {STU.ColorRGB}
			 */
			this.color;

			/**
			 * Get/Set the thickness of the ray
			 * @public
			 * @type {Number}
			 */
			this.thickness;

			/**
			 * Enable or disable the possibility to hover on 3D Actors with the ray
			 * @public
			 * @type {Boolean}
			 */
			this.enableHovering;

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Ray specifications
			 * @private
			 * @type {Object}
			 */
			this.rayParams = null;

			/**
			 * Ray specifications
			 * @private
			 * @type {STU.Actor3D}
			 */
			this._actor = null; //this.getActor();

			/**
			 * Ray specifications
			 * @private
			 * @type {STU.XRManager}
			 */
			this._XRMgr = null;

			/**
			 * Reference to the last pressed actor used when sending the clickable release event
			 * @private
			 * @type {DSMath.Point}
			 */
			this._rayOrigin = new DSMath.Point;

			/**
			 * Reference to the last pressed actor used when sending the clickable release event
			 * @private
			 * @type {DSMath.Vector3D}
			 */
			this._rayDirection = new DSMath.Vector3D;

			/**
			 * Reference to the last pressed actor used when sending the clickable release event
			 * @private
			 * @type {STU.Actor3D}
			 */
			this._lastPressedActor = null;

			/**
			 * Reference to the last ray transformation
			 * @private
			 * @type {DSMath.Transformation}
			 */
			this._lastRayTransform = null;

			/**
			 * Reference to the last ray intersection
			 * @private
			 * @type {STU.Intersection}
			 */
			this._lastRayIntersection = null;

			/**
			 * Flag to check if pressed
			 * @private
			 * @type {Boolean}
			 */
			this._hasPressedSomething = false;

			/**
			 * Number of time click
			 * @private
			 * @type {number}
			 */
			this.currentClickTime = 0.0;

			/**
			 * If you want to change the during time for the click, you have to change this value
			 * @private
			 * @type {number}
			 */
			this.clickTime = 300.0;
		};

		XRRay.prototype = new Behavior();
		XRRay.prototype.constructor = XRRay;

		/**
		* Process executed when XRRay is initializating
		* 
		* @method
		* @private
		*/
		XRRay.prototype.onInitialize = function (oExceptions) {
			Behavior.prototype.onInitialize.call(this, oExceptions);

			// Note: binding during initialization, because binder needs access to a sub object delegate
			// that is assigned only later during the build (thus after constructor)
			//binding for vcx not working properly? +not relevant as only in play ?
			if (this.color !== null && this.color !== undefined) {
				if (!(this.color instanceof STU.ColorRGB)) {
					this.color = new STU.ColorRGB(this.color[0] / 255, this.color[1] / 255, this.color[2] / 255);
				}
			}

			if (this.length === undefined || this.length === null) {
				this.length = 0;
			}
		};


		/**
		* Process executed when XRRay is activating
		* 
		* @method
		* @private
		*/
		XRRay.prototype.onActivate = function (oExceptions) {
			Behavior.prototype.onActivate.call(this, oExceptions);

			this._actor = this.getActor();

			// XR manager reference
			if (XRManager !== null && XRManager !== undefined && typeof XRManager.getInstance === "function") {
				this._XRMgr = XRManager.getInstance();
			}

			//update ray params
			this._updateRayParams();

			EP.EventServices.addObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
			EP.EventServices.addObjectListener(EP.DeviceReleaseEvent, this, '_onDeviceReleaseEvent');
		};

		/**
		* Process executed when XRRay is deactivating
		* 
		* @method
		* @private
		*/
		XRRay.prototype.onDeactivate = function () {
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
		XRRay.prototype.onExecute = function (iContext) {
			// Display the ray if this option has been chosen
			if (this.display === true) {
				var worldCtrlTransform = this.getActor().getTransform("World");
				this.moveRay(worldCtrlTransform);
			}

			this.currentClickTime += iContext.deltaTime;
		};

		/**
		 * Display and position the picking ray given the controller transform in the interaction area referential
		 * @method
		 * @private
		 * 
		 * @param iTransform DSMath.Transformation
		 */
		XRRay.prototype.moveRay = function (iTransform) {
			// We want the to ray to be parallel to the top of the controller we adjust the transform accordingly
			var worldActorTransform = iTransform.clone();

			//rotate to be align with controller angle
			var orientedWorldActorTransform = DSMath.Transformation.multiply(worldActorTransform, this.getRayTransform());
			this._lastRayTransform = orientedWorldActorTransform.clone();

			//adding the offset (create the origin of the ray at the vector of the transform + adding the offset)
			var offsettedControllerCenterVector = new DSMath.Point(this.offset.x, this.offset.y, this.offset.z);
			offsettedControllerCenterVector.applyTransformation(orientedWorldActorTransform)
			this._rayOrigin.copy(offsettedControllerCenterVector); //save data for pick

			//getting the axis that is align with the controller
			var zDirection = orientedWorldActorTransform.matrix.getThirdColumn().normalize();
			this._rayDirection.copy(zDirection); //save data for pick

			//create the endpoint of the ray
			var endPoint = new DSMath.Point();
			endPoint.copy(offsettedControllerCenterVector);
			endPoint.addScaledVector(zDirection, this.length);

			//Actually draw the ray
			let rm = STU.RenderManager.getInstance();
			rm.createLine(offsettedControllerCenterVector, endPoint, this.rayParams);

			//process the interaction with 3DUIactors
			var interaction = null;
			if (this.enableHovering === true) {
				var intersection = this.pick();

				interaction = (this._lastPressedActor === null) ? this._XRMgr.interactions.Move : this._XRMgr.interactions.Drag;

				// ----------------- ClickableEvent management -----------------
				// during manipulation of Actor3D, if there is latency, there can be ClickableExit and ClickableMove event, so we block these event if we manipulate
				var sendEvents = true;
				if (this.getActor().XRGrab != undefined) {
					sendEvents = (this.getActor().XRGrab._actorToRay == null)
				}

				// check if the button to click is not pressed
				// from actor...
				if (this._lastRayIntersection != null && this._lastRayIntersection != undefined && this._lastRayIntersection.actor != undefined) {
					// ... to background
					if ((intersection == null || intersection == undefined) && sendEvents) {
						this.sendClickableEvent(new STU.ClickableExitEvent(), null, this._lastRayIntersection.actor);
					}
					else if (intersection != null && intersection != undefined && intersection.actor != undefined) {
						// ... to another actor
						if (this._lastRayIntersection.actor != intersection.actor) {
							this.sendClickableEvent(new STU.ClickableExitEvent(), null, this._lastRayIntersection.actor);
							this.sendClickableEvent(new STU.ClickableEnterEvent(), null, intersection.actor);
						}
						// ... to the same actor
						else {
							this.sendClickableEvent(new STU.ClickableMoveEvent(), null, intersection.actor);
						}
					}
				}
				// from background ... 
				else if (this._lastRayIntersection == null || this._lastRayIntersection == undefined) {
					// ... to an actor
					if (intersection != null && intersection != undefined && intersection.actor != undefined && sendEvents) {
						this.sendClickableEvent(new STU.ClickableEnterEvent(), null, intersection.actor);
					}
				}
				// ----------------- End of ClickableEvent management -----------------

				this._lastRayIntersection = intersection;

				if ((this.currentClickTime > this.clickTime && interaction == this._XRMgr.interactions.Drag) || interaction == this._XRMgr.interactions.Move) {
					this._XRMgr.dispatchPickingToUi(this._lastRayTransform, this._lastRayIntersection, interaction);
				}
			}
			else {
				if (this._hasPressedSomething) {
					var intersection = this.pick();
					this._lastRayIntersection = intersection;

					if (this.currentClickTime > this.clickTime) {
						interaction = this._XRMgr.interactions.Drag;
						this._XRMgr.dispatchPickingToUi(this._lastRayTransform, this._lastRayIntersection, interaction, this.enableHovering);
					}
				};
			}
		};

		/**
		 * Returns the actor3D pointed by a given controller and within the picking range
		 * @method 
		 * @public
		 * 
		 * @return {STU.Intersection}
		 */
		XRRay.prototype.pick = function () {
			if (this._XRMgr === null || this._XRMgr === undefined) {
				return null;
			}
			var interAreaActor = this._XRMgr.getInteractionArea();
			if (interAreaActor === null || interAreaActor === undefined) {
				return null;
			}
			var localCtrlTransform = this._XRMgr.getDeviceTransform(this._actor.deviceID);
			var worldCtrlTransform = DSMath.Transformation.multiply(interAreaActor.getTransform(), localCtrlTransform);

			// First we check if the transform is in the cache  
			var transformId = JSON.stringify(worldCtrlTransform);
			var pickedElement = interAreaActor._pickingTransforms[transformId];
			if (pickedElement !== undefined && pickedElement !== null) {
				return pickedElement;
			}

			// Create the STU.Ray to do the actual ray picking with the data given by this.moveRay()
			var ray = new STU.Ray(); //WARN: STU.Ray only use world coordonnates that is why i am not using referential to XRInteractionArea
			ray.setOrigin(this._rayOrigin);
			ray.setDirection(this._rayDirection);
			ray.setLength(this.length);

			var firstIntersection = STU.RenderManager.getInstance().pickFromRay(ray, { pickAllElements: true, referential: "World" });

			if (firstIntersection === undefined || firstIntersection === null) {
				return null;
			}

			// Saves the picked actor in the cache
			interAreaActor._pickingTransforms[transformId] = firstIntersection;

			if (firstIntersection.actor !== null && firstIntersection.actor !== undefined)
				if (firstIntersection.actor === this._actor) {
					console.warn("The XR Ray has picked the device itself, the expected behavior may not work properly. Please change the XR Ray's offset to ensure a correct picking.")
				}

			return firstIntersection;
		};

		/**
		* Returns the Transformation assiociated with the ray orientation
		* @method 
		* @public
		* 
		* @return {DSMath.Transformation}
		*/
		XRRay.prototype.getRayTransform = function () {
			// The front of the controller it tilted by PI/6 we need to adjust the transform accordingly
			var localTransform = new DSMath.Transformation();
			localTransform.setEulerRotation([0, Math.PI, 0]); //rotate first in the right orientation of the actor
			localTransform.setEulerRotation([0, - Math.PI / 3, 0]); //offset it by the angle of the controller angle
			return localTransform;
		};

		/**
		* Process executed to update the ray color
		* 
		* @method
		* @private
		*/
		XRRay.prototype._updateRayParams = function () {
			if (this.color === null || this.color === undefined) {
				this.color = new STU.ColorRGB;
			}
			var oldColor = this.color.toColor();

			//actual update of rayParams
			this.rayParams =
			{
				referential: "World",
				lifetime: 0, // The ray has a lifetime of one frame
				thickness: this.thickness,
				color: oldColor
			};
		};

		/**
		 * Event listener called each time a device button is pressed
		 * It sends a clickablePress events when the clickButton is pressed and the ray is pointing towards a clickable actor
		 *
		 * @method
		 * @private
		 */
		XRRay.prototype._onDevicePressEvent = function (iDeviceEvent) {
			// Only events about the ray click button interest us
			let controllerID = this._actor.deviceID; //controller1 is deviceID=1 and controller2 is deviceID=2 "luckily"
			if (this.display !== true) {
				return;
			}

			if (iDeviceEvent.buttonName === XRManager.EDeviceInputName[this.clickInputID] + "_" + controllerID || iDeviceEvent.buttonName === "bPinch") {
				// we need to know which actor the ray is pointing at
				var intersection = this.pick();

				this._lastRayIntersection = intersection;

				// if a 3D actor was picked we send a clickable press event
				if (intersection !== undefined && intersection !== null) {
					var pickedActor = intersection.actor;
					this.sendClickableEvent(new STU.ClickablePressEvent(), iDeviceEvent, pickedActor);
					// save picked actor in order to send a release event later on
					this._lastPressedActor = pickedActor;
					this._hasPressedSomething = true;
					this.currentClickTime = 0.0;

					this._XRMgr.dispatchPickingToUi(this._lastRayTransform, this._lastRayIntersection, this._XRMgr.interactions.Press);
				}
			}
		};

		/**
		 * Event listener called each time a device button is released
		 * It sends a clickable release event when a device release event is issued
		 * 
		 * @method
		 * @private
		 */
		XRRay.prototype._onDeviceReleaseEvent = function (iDeviceEvent) {
			// Only events about the ray click button interest us
			let controllerID = this._actor.deviceID; //controller1 is deviceID=1 and controller2 is deviceID=2 "luckily"
			if (this.display !== true) {
				return;
			}

			if (iDeviceEvent.buttonName === XRManager.EDeviceInputName[this.clickInputID] + "_" + controllerID || iDeviceEvent.buttonName === "bPinch") {
				this.sendClickableEvent(new STU.ClickableReleaseEvent(), iDeviceEvent, this._lastPressedActor);

				if (this._lastRayIntersection !== undefined && this._lastRayIntersection !== null) {
					this._XRMgr.dispatchPickingToUi(this._lastRayTransform, this._lastRayIntersection, this._XRMgr.interactions.Release);
				}

				this.currentClickTime = 0.0;
				this._hasPressedSomething = false;
				this._lastRayIntersection = null;
				this._lastPressedActor = null;
			}
		};

		/**
		 * Method called to actually send the click event to other actors
		 *
		 * @method
		 * @private
		 */
		XRRay.prototype.sendClickableEvent = function (iClickableEvent, iMouseEvent, iActor) {
			if (iActor !== undefined && iActor !== null && iClickableEvent !== undefined && iClickableEvent !== null) {
				iClickableEvent.setActor(iActor);

				if (iMouseEvent !== null && typeof iMouseEvent.getButton === "function") {
					iClickableEvent.setButton(iMouseEvent.getButton());
				}

				iActor.dispatchEvent(iClickableEvent);
			}
		};



		// Expose in STU namespace.
		STU.XRRay = XRRay;

		return XRRay;
	});

define('StudioIV/StuXRRay', ['DS/StudioIV/StuXRRay'], function (XRRay) {
	'use strict';

	return XRRay;
});

