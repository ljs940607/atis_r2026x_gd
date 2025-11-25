define('DS/StuMiscContent/StuOpenClose', ['DS/StuCore/StuContext', 'DS/StuModel/StuBehavior', 'DS/EPTaskPlayer/EPTask', 'DS/EP/EP', 'DS/MathematicsES/MathsDef', 'DS/EPInputs/EPKeyboard',
	'DS/EPInputs/EPKeyboardPressEvent', 'DS/StuClickable/StuClickablePressEvent', 'DS/StuModel/StuService'], function (STU, Behavior, Task, EP, DSMath) {
		'use strict';

		/**
			 * Behavior to provide open and close actions on door.
			 * @exports OpenClose
			 * @class 
			 * @constructor
			 * @public
			 * @extends STU.Behavior
			 * @memberof STU 
			 * @alias STU.OpenClose
		*/
		var OpenClose = function () {

			Behavior.call(this);

			this.componentInterface = this.protoId;

			this.name = "OpenClose";

			/**
			 * Method of activation of task (mouse click/keyboard/trigger)
			 *
			 * @member
			 * @public
			 * @type {STU.OpenClose.eActivationMode}
			 */
			this.activateOn = 0;

			/**
			 * Mapped key for keyboard activation
			 *
			 * @member
			 * @public
			 * @type {EP.Keyboard.EKey}
			 */
			this.activationKey = EP.Keyboard.EKey.eO;

			/**
			 * Type of motion (Rotation / Translation)
			 *
			 * @member
			 * @public
			 * @type {STU.OpenClose.eMode}
			 */
			this.mode = 0;

			/**
			 * Total duration of motion
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.duration = 2;

			/**
			 * Speed of motion
			 *
			 * @deprecated R2024x Use <b>duration</b> instead
			 * 
			 * @member
			 * @public
			 * @type {number}
			 */
			this.speed = 0.1;

			/**
			 * Axis of reference
			 * 0 - X axis, 1 - Y axis, 2 - Z axis
			 * @member
			 * @public
			 * @type {STU.OpenClose.eReferenceAxis}
			 */
			this.referenceAxis = 2;

			/**
			 * Maximum millimeter value by which to open the door (for Translation)
			 *
			 * @member
			 * @public
			 * @type {number} 
			 */
			this.openedPosition = 1000;

			/**
			 * Maximum radian angle by which to open the door (for Rotation)
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.openedAngle = 1.57079;

			/**
			 * Minimum angle or length value to close the door
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this._closedPosition = 0.0;

			/**
			 * Maximum angle or length value to close the door
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this._openedValue = 0.0


			/**
			 * Percentage of door opened initially
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.intialOpenedRatio = 0.0;

			/**
			 *Time between frames
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this._deltaTime = 1;

			/**
			 * Cumulative time for each frame
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this._currentTime = 0;

			this._currentValue = 0.0;

			/**
			 * Open state = 0 . close state = 1
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this._state;



			/**
			 * Moving state
			 * 0 - Idle, 1 - Opening, 2 - Closing
			 * @member
			 * @private
			 * @type {STU.OpenClose.eMovingState}
			 */
			this._movingState = 0;

			/**
			 * Boolean to indicate negative direction
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this._negDir;

			/**
			 * Boolean to start moving the door.
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this.moveTheDoor;

			

		
		};

		OpenClose.prototype = new Behavior();
		OpenClose.prototype.constructor = OpenClose;

		/**
		* An enumeration of the different moving state the behavior can be in; 0 - Idle, 1 - Opening, 2 - Closing
		*
		* @enum {number}
		* @private
		*/
		OpenClose.eMovingState = {
			/**
			 * @private
			 * @type {Number}
			 */
			eIdle: 0,

			/**
			 * @private
			 * @type {Number}
			 */
			eOpening: 1,

			/**
			 * @private
			 * @type {Number}
			 */
			eClosing: 2,

			/**
			 * @private
			 * @type {Number}
			 */
			eSwitching: 3
		};

		/**
		* An enumeration of all the supported method of activation of task (mouse click/keyboard/trigger)
		*
		* @enum {number}
		* @public
		*/
		OpenClose.eActivationMode = {
			eMouseClick: 0,
			eKeyboard: 1,
			eTrigger: 2
		};

		/**
		* An enumeration of all the supported Type of motion (rotation/translation)
		*
		* @enum {number}
		* @public
		*/
		OpenClose.eMode = {
			eRotation: 0,
			eTranslation: 1
		};

		/**
		* An enumeration of the axis of reference; 0 - X axis, 1 - Y axis, 2 - Z axis
		*
		* @enum {number}
		* @public
		*/
		OpenClose.eReferenceAxis = {
			eAxisX: 0,
			eAxisY: 1,
			eAxisZ: 2
		};


		/**
		 * Process to execute when this STU.OpenClose is activating. 
		 *
		 * @method
		 * @private
		 */
		OpenClose.prototype.onActivate = function (oExceptions) {
			Behavior.prototype.onActivate.call(this, oExceptions);

			this._currentValue = 0.0;

			switch (this.mode) {
				case OpenClose.eMode.eRotation:
					this._openedValue = this.openedAngle;
					break;

				case OpenClose.eMode.eTranslation:
					this._openedValue = this.openedPosition;
					break;
			
				default:
					console.error("OpenClose: invalid mode");
					return;					
			}			

			this._state = 1; //closed state.
			this.moveTheDoor = false; //do not move the door at start of play.
			this._movingState = STU.OpenClose.eMovingState.eIdle;

			if (this._openedValue < 0.0) {
				// we will handle negative direction by moving negative distance.
				this._openedValue = -this._openedValue;
				this._negDir = 1;
			}
			if (this.intialOpenedRatio === 1) {
				this._state = 0; //open state.
			}

			//if door is half open at the start, we will first move to full open position at start.
			this._currentValue = (1 - this.intialOpenedRatio) * this._openedValue;
			this._currentTime = (1 - this.intialOpenedRatio) * this.duration;


			//add listeners based on input method
			if (this.activateOn === OpenClose.eActivationMode.eMouseClick) {
				this.getActor().addObjectListener(STU.ClickablePressEvent, this, 'onClickablePressEvent');
			}
			else if (this.activateOn === OpenClose.eActivationMode.eKeyboard) {
				EP.EventServices.addObjectListener(EP.KeyboardPressEvent, this, 'onKeyboardEvent');
			}
			else if (this.activateOn === OpenClose.eActivationMode.eTrigger) {
				EP.EventServices.addObjectListener(STU.TriggerZoneEnterEvent, this, 'onTriggerZoneEnterEvent');
				EP.EventServices.addObjectListener(STU.TriggerZoneExitEvent, this, 'onTriggerZoneExitEvent');
			}
		};

		/**
		 * Process to execute when this STU.OpenClose is deactivating. 
		 *
		 * @method
		 * @private
		 */
		OpenClose.prototype.onDeactivate = function () {

			//remove all listeners
			this.getActor().removeObjectListener(STU.ClickablePressEvent, this, 'onClickablePressEvent');
			EP.EventServices.removeObjectListener(EP.KeyboardPressEvent, this, 'onKeyboardEvent');
			EP.EventServices.removeObjectListener(STU.TriggerZoneEnterEvent, this, 'onTriggerZoneEnterEvent');
			EP.EventServices.removeObjectListener(STU.TriggerZoneExitEvent, this, 'onTriggerZoneExitEvent');

			this._currentValue = 0.0;
			this._state = 0;

			Behavior.prototype.onDeactivate.call(this);
		};

		/**
		 * Main method executed each frames
		 *
		 * @method
		 * @private	 
		 */
		OpenClose.prototype.onExecute = function (iContext) {

			this._deltaTime = (iContext.getDeltaTime() / 1000);

			if (this.moveTheDoor) {
				var actor = this.getActor();
				// We might not be in a ring yet thus test !!
				if (actor === undefined || actor === null) {
					return this;
				}

				var upVec = new DSMath.Vector3D();//vector around which to rotate.
				var translateVec = new DSMath.Vector3D();//vector along which to translate.

				//Applying easing function
				var normalizeTime = this._currentTime / this.duration; //time between 0-1
				var normalizeStep = this.easeInOutCubic(normalizeTime); // step between 0-1

				if (normalizeTime >= 1.00) {
					normalizeStep = 1.00;
				}

				//converting step from 0-1 to (Closed position to opened position)
				let _moveStep = normalizeStep * (this._openedValue - this._closedPosition) - this._currentValue; // ease step

				//set up vector for rotation and translate vector for translation based on reference axis.
				if (this.referenceAxis === OpenClose.eReferenceAxis.eAxisX) {
					upVec.set(1, 0, 0);
					translateVec.x = _moveStep;
				}
				else if (this.referenceAxis === OpenClose.eReferenceAxis.eAxisY) {
					upVec.set(0, 1, 0);
					translateVec.y = _moveStep;
				}
				else if (this.referenceAxis === OpenClose.eReferenceAxis.eAxisZ) {
					upVec.set(0, 0, 1);
					translateVec.z = _moveStep;
				}

				//for closing we will just reverse the vectors.
				if (this._state === 1) {
					upVec.negate();
					translateVec.negate();
				}
				//for negative direction also we will reverse the vectors.
				if (this._negDir === 1) {
					upVec.negate();
					translateVec.negate();
				}

				//if reference is undefined or null, we will use this actor as reference.
				if (this.reference === undefined || this.reference === null) {
					this.reference = actor;
				}

				//Get reference origin
				var origin = this.reference.getPosition();

				//Get reference transformation
				var refMatrix = this.reference.getTransform().matrix;
				var refMatrixCoef = refMatrix.getArray();

				//remove scale feactor from reference transformation matrix.
				var scale = Math.sqrt(refMatrixCoef[0] * refMatrixCoef[0] + refMatrixCoef[3] * refMatrixCoef[3] + refMatrixCoef[6] * refMatrixCoef[6]);

				if (scale !== 1.0 && scale !== 0.0) {
					for (var i = 0; i < refMatrixCoef.length; i++) {
						refMatrixCoef[i] /= scale;
					}
					refMatrix.setFromArray(refMatrixCoef);
				}

				//apply reference transformation matrix to rotation vector.
				upVec = upVec.applyMatrix3x3(refMatrix);
				translateVec = translateVec.divideScalar(scale);


				if (this._currentValue < (this._openedValue - this._closedPosition)) {
					this._currentValue = this._currentValue + _moveStep;
					if (this.mode === 0) { //rotation
						actor.rotateAround(origin, upVec, _moveStep);
					}
					else if (this.mode === 1) { //translation
						actor.translate(translateVec, this.reference);
					}
				}
				else {
					this.moveTheDoor = false;
					switch (this._movingState) {
						case STU.OpenClose.eMovingState.eOpening: this.dispatchEvent(new STU.ServiceStoppedEvent("open", this)); break;
						case STU.OpenClose.eMovingState.eClosing: this.dispatchEvent(new STU.ServiceStoppedEvent("close", this)); break;
						case STU.OpenClose.eMovingState.eSwitching: this.dispatchEvent(new STU.ServiceStoppedEvent("switch", this)); break;
					}
					this._movingState = STU.OpenClose.eMovingState.eIdle;

				}


				//increment the currenttime by delta between frames.
				if (this._currentTime < this.duration) {
					this._currentTime += this._deltaTime;
				}
			}
			return this;
		};

		/**
		 * Callback called on a mouse click
		 * @method
		 * @private
		 */
		OpenClose.prototype.onClickablePressEvent = function () {

			if (this._state === 0) {
				this._state = 1;
			}
			else {
				this._state = 0;
			}
			this._valueModification();
			this.moveTheDoor = true;
		};

		/**
		 * Callback called when a keyboard key is hit
		 * @method
		 * @private
		 */
		OpenClose.prototype.onKeyboardEvent = function (iKeyboardEvent) {

			if (iKeyboardEvent instanceof EP.KeyboardPressEvent) {
				if (iKeyboardEvent.getKey() === this.activationKey) {
					if (this._state === 1) {
						this._state = 0;
					}
					else if (this._state === 0) {
						this._state = 1;
					}
					this._valueModification();
					this.moveTheDoor = true;
				}
			}
		};

		/**
		 * Callback called on a trigger zone enter event
		 * @method
		 * @private
		 */
		OpenClose.prototype.onTriggerZoneEnterEvent = function (iZoneEvent) {

			if ((iZoneEvent.zone === this.activationZone) && (iZoneEvent.object !== this.getActor())) {
				this._state = 0;
				this._valueModification();
				this.moveTheDoor = true;
			}
		};

		/**
		 * Callback called on a trigger zone exit event
		 * @method
		 * @private
		 */
		OpenClose.prototype.onTriggerZoneExitEvent = function (iZoneEvent) {
			if ((iZoneEvent.zone === this.activationZone) && (iZoneEvent.object !== this.getActor())) {
				this._state = 1;
				this._valueModification();
			}
		};


		/**
		 * Open capacity.(driver capacity)
		 * To open the door
		 *
		 * @method
		 * @public	 
		 */
		OpenClose.prototype.open = function () {
			this._state = 0;
			this._valueModification();
			this.moveTheDoor = true;
			this._movingState = STU.OpenClose.eMovingState.eOpening;
			this.dispatchEvent(new STU.ServiceStartedEvent("open", this));
		};

		/**
		 * return true is the door is opening
		 *
		 * @method
		 * @public
		 * @return {Boolean}
		 */
		OpenClose.prototype.isOpening = function () {
			return this._movingState == STU.OpenClose.eMovingState.eOpening;
		};


		/**
		 * Close capacity.(driver capacity)
		 * To close the door
		 *
		 * @method
		 * @public	 
		 */
		OpenClose.prototype.close = function () {
			this._state = 1;
			this._valueModification();
			this.moveTheDoor = true;
			this._movingState = STU.OpenClose.eMovingState.eClosing;
			this.dispatchEvent(new STU.ServiceStartedEvent("close", this));
		};

		/**
		 * return true is the door is closing
		 *
		 * @method
		 * @private
		 * @return {Boolean}
		 */
		OpenClose.prototype.isClosing = function () {
			return this._movingState == STU.OpenClose.eMovingState.eClosing;
		};

		/**
		 * Switch capacity.(driver capacity)
		 * To open the closed door or close the opened door
		 *
		 * @method
		 * @public	 
		 */
		OpenClose.prototype.switch = function () {
			if (this._state === 0) {
				this._state = 1;
			}
			else {
				this._state = 0;
			}
			this._valueModification();
			this.moveTheDoor = true;
			this._movingState = STU.OpenClose.eMovingState.eSwitching;
			this.dispatchEvent(new STU.ServiceStartedEvent("switch", this));
		};

		/**
		 * return true is the door is switching
		 *
		 * @method
		 * @private
		 * @return {Boolean}
		 */
		OpenClose.prototype.isSwitching = function () {
			return this._movingState == STU.OpenClose.eMovingState.eSwitching;
		};

		/**
		 * function use to stop capacities
		 *
		 * @method
		 * @private
		 */
		OpenClose.prototype.stopMovement = function () {
			this._valueModification();
			this.moveTheDoor = false;
			console.log("stopMovement");
		};


		/**
		 * Returns true when the door is in opened state.
		 *
		 * @public
		 * @return {Boolean}
		*/
		OpenClose.prototype.isOpened = function () {
			var isDoorOpen = false;
			if (!this.moveTheDoor && this._state === 0 && this._currentTime >= this.duration) {
				isDoorOpen = true;
			}
			return isDoorOpen;
		};


		/**
		 * Returns true when the door is in closed state.
		 *
		 * @public
		 * @return {Boolean}
		*/
		OpenClose.prototype.isClosed = function () {
			var isDoorClose = false;
			if (!this.moveTheDoor && this._state === 1 && this._currentTime >= this.duration) {
				isDoorClose = true;
			}
			return isDoorClose;
		};

		//Cubic easing function for door open and close.
		OpenClose.prototype.easeInOutCubic = function (n) {

			var q = 0.48 - n / 1.04;
			var Q = Math.sqrt(0.1734 + q * q);
			var x = Q - q;
			var X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1);
			var y = -Q - q;
			var Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1);
			var t = X + Y + 0.5;
			return (1 - t) * 3 * t * t + t * t * t;

		};

		OpenClose.prototype._valueModification = function () {
			//change time and value to 0 if cycle is completed.
			if (this._currentTime >= this.duration) {
				this._currentTime = 0;
				this._currentValue = 0.0;
			}
			//if we reverse in between, we have to go back from existing position.
			else if (this._currentTime !== 0) {
				this._currentTime = this.duration - this._currentTime;
				this._currentValue = (this._openedValue - this._closedPosition) - this._currentValue;
			}
		};


		STU.OpenClose = OpenClose;

		return OpenClose;
	});

define('StuMiscContent/StuOpenClose', ['DS/StuMiscContent/StuOpenClose'], function (OpenClose) {
	'use strict';

	return OpenClose;
});
