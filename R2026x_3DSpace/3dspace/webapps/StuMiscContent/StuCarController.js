/*
* * @quickReview IBS 17:04:21 GetExperienceScaleFactor bind� 
*						+ RenderManager fonctionne en rep�re world
*						+ clickablestate sur les roues (cas des roues primitives)
*
*/

/* global define */
define('DS/StuMiscContent/StuCarController', [
	'DS/StuCore/StuContext', 'DS/EP/EP', 'DS/StuModel/StuBehavior', 'DS/EPEventServices/EPEvent',
	'DS/MathematicsES/MathsDef', 'DS/StuRenderEngine/StuActor3D', 'DS/EPInputs/EPKeyboardEvent', 'DS/EPInputs/EPGamepadEvent', 'DS/EPInputs/EPKeyboard'],
	function (STU, EP, Behavior, Event, DSMath, Actor3D) {
		'use strict';


	    /**
		 * This event is thrown when the Car has reached the end of a path
		 *
		 * @class 
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends EP.Event
		 * @memberof STU
		 */
		var CarHasCompletedEvent = function (iPath, iActor) {
			Event.call(this);
	        /**
			 * The path that the STU.Actor had followed
			 *
			 
			 * @type {STU.PathActor}
			 * @public
			 * @default
			 */
			this.path = iPath !== undefined ? iPath : null;

	        /**
			 * The STU.Actor that has reached the end of the path
			 *
			 * @type {STU.Actor}
			 * @public
			 * @default
			 */
			this.actor = iActor !== undefined ? iActor : null;
		};

		CarHasCompletedEvent.prototype = new Event();
		CarHasCompletedEvent.prototype.constructor = CarHasCompletedEvent;
		CarHasCompletedEvent.prototype.type = 'CarHasCompletedEvent';

		// Expose in STU namespace.
		STU.CarHasCompletedEvent = CarHasCompletedEvent;
		EP.EventServices.registerEvent(CarHasCompletedEvent);


	    /**
		 * Describe a car controller behavior
		 *
		 * @exports CarController
		 * @class 
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends {STU.Behavior}
		 * @memberof STU
	     * @alias STU.CarController
		 */
		var CarController = function () {
			Behavior.call(this);
			this.name = 'CarController';

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			// Internal properties
	        /**
			 * Object for storing internals properties
			 *
			 * @member
			 * @private
			 * @type {Object}
			 */
			this.__internal__ = {};

	        /**
			 * Current speed of the car
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this.__internal__.CurrentSpeed = 0;

	        /**
			 * Speed to reach for the car
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this.__internal__.TargetSpeed = 0;

	        /**
			 * List of the wheels
			 *
			 * @member
			 * @private
			 * @type {Object}
			 */
			this.__internal__.Wheels = {};

	        /**
			 * True if all wheels were correctly configured
			 *
			 * @member
			 * @private
			 * @type {Boolean}
			 */
			this.__internal__.HasWheels = false;

	        /**
			 * Current front wheels direction
			 * 1  if front wheels are turned right
			 * -1 if front wheels are turned left
			 * 0  if front wheels are not turned
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this.__internal__.CurrentWheelDirection = 1;

	        /** 
			 * The amount of front wheels rotation
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this.__internal__.CurrentWheelRotationAmount = 0;

	        /**
			 * List of each wheels radius
			 *
			 * @member
			 * @private
			 * @type {Object}
			 */
			this.__internal__.Radius = {}; // radius of each wheels

	        /**
			 * List of each wheels bounding spheres
			 *
			 * @member
			 * @private
			 * @type {Object}
			 */
			this.__internal__.BoundingSphere = {};

	        /**
			 * Init flag
			 * @private
			 * @type {Boolean}
			 */
			this.__internal__.Init = false;

	        /**
			 * Change of basis matrix for going from car basis to each wheel's basis
			 *
			 * @member
			 * @private
			 * @type {Object}
			 */
			this.__internal__.P13w = {};

	        /**
			 * Transforms of each wheels in the car referential
			 *
			 * @member
			 * @private
			 * @type {Object}
			 */
			this.__internal__.transforms = {};

			this.__internal__.steeringWheelInitTransform = new DSMath.Transformation(); // POC_Steering - Steering wheel
			this.__internal__.steeringWheelLocalTransform = new DSMath.Transformation();// POC_Steering - Steering wheel

	        /**
			 * Array containing the state of each keys
			 * @member
			 * @private
			 * @type {Object}
			 */
			this.__internal__.keyState = {
				moveForward: 0,
				moveBackward: 0,
				turnRight: 0,
				turnLeft: 0,
				brake: 0,
			};

			this.__internal__.timeInTheAir = 0;

			this.__internal__.cleanGamePadAxis = false;

			this.__internal__.target = null;

			this.__internal__.isFollowingPath = false;

			this.__internal__.pathLength = false;

			this.__internal__.currentDistanceFollowPath = 0;

			this.__internal__.upVec = new DSMath.Vector3D(0, 0, 1);

			this.__internal__.trafficManagerOverride = false;

			this.__internal__.carLength = 0;

			this.__internal__.gravity = new DSMath.Vector3D(0, 0, -1);

			this._useBBoxAsRadius = true;

			//////////////////////////////////////////////////////////////////////////
			// Properties that should be visible in UI
			//////////////////////////////////////////////////////////////////////////

	        /**
			 * Mapped key for moving forward
			 *
			 * @member
			 * @public
			 * @type {EP.Keyboard.EKey}
			 */
			this.moveForward = EP.Keyboard.EKey.eUp;

	        /**
			 * Mapped key for moving backward
			 *
			 * @member
			 * @public
			 * @type {EP.Keyboard.EKey}
			 */
			this.moveBackward = EP.Keyboard.EKey.eDown;

	        /**
			 * Mapped key for turning right
			 *
			 * @member
			 * @public
			 * @type {EP.Keyboard.EKey}
			 */
			this.turnRight = EP.Keyboard.EKey.eRight;
	        /**
			 * Mapped key for turning left
			 *
			 * @member
			 * @public
			 * @type {EP.Keyboard.EKey}
			 */
			this.turnLeft = EP.Keyboard.EKey.eLeft;

	        /**
			 * Mapped key for braking
			 *
			 * @member
			 * @public
			 * @type {EP.Keyboard.EKey}
			 */
			this.brake = EP.Keyboard.EKey.eSpace;

	        /**
			 * Speed of the car in km/h
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.speed = 50.0; // km / h

	        /**
			 * Time in seconds for the car to go from 0 to Speed
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.acceleration = 5.0; // s
	        /**
			 * Time in seconds for the car to go from Speed to 0
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.deceleration = 1.0; // s

	        /**
			 * Maximum turning angle of front wheels in radians
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.steeringAngle = 0.785398163; //45.0 * Math.DegreeToRad

	        /**
			 * Time in seconds for front wheels to go from 0 to TurningRadius
			 *
			 * @member
			 * @public
			 * @type {number}
			 */
			this.steeringTime = 1.5;

	        /**
			 * Front left wheel actor
			 *
			 * @member
			 * @private
			 * @type {STU.Actor3D}
			 */
			this.frontLeftWheel = null;

	        /**
			 * Front right wheel actor
			 *
			 * @member
			 * @private
			 * @type {STU.Actor3D}
			 */
			this.frontRightWheel = null;

	        /**
			 * Back left wheel actor
			 *
			 * @member
			 * @private
			 * @type {STU.Actor3D}
			 */
			this.backLeftWheel = null;

	        /**
			 * Back right wheel actor
			 *
			 * @member
			 * @private
			 * @type {STU.Actor3D}
			 */
			this.backRightWheel = null;

	        /**
			 * Align the car with the ground geometry
			 *
			 * @member
			 * @public
			 * @type {Boolean}
			 */
			this.keepOnGround = true;

			/**
			 * POC_Steering Wheel - Steering Wheel Actor
			 *
			 * @member
			 * @private
			 * @type {STU.Actor3D}
			 */
			this.steeringWheelActor = null;

			/**
			 * POC_Steering - Steering Wheel Rotation Axis Angle Offset
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this.steeringWheelAngleOffset = 158;

			/**
			 * POC_Steering - Steering Wheel Rotation Factor
			 *
			 * @member
			 * @private
			 * @type {number}
			 */
			this.steeringWheelRotationFactor = 8;
		};

		CarController.prototype = new Behavior();
		CarController.prototype.constructor = CarController;
		CarController.prototype.pureRuntimeAttributes = ['__internal__'].concat(Behavior.prototype.pureRuntimeAttributes);

		/**
		 * Applies gravity and ground alignment to the car based on wheel contact points.
		 *
		 * The method:
		 * 1. Casts rays from each wheel towards the ground to detect surface intersections.
		 * 2. Computes the average ground distance and surface normal under the wheels.
		 * 3. Applies gravity if the wheels are airborne.
		 * 4. If close to the ground, aligns the car with the surface normal.
		 *
		 * @param {DSMath.Vector3D} oMoveVec - Movement vector to apply (modified in place).
		 * @param {number} iDeltaTime - Time step (seconds).
		 * @param {STU.Actor3D} iActor - The car actor.
		 * @param {DSMath.Vector3D} iUpActorVec - Current "up" vector of the car.
		 * @private
		 */
		CarController.prototype.computeGravityForce = function (oMoveVec, iDeltaTime, iActor, iUpActorVec) {
			if (!this.__internal__.HasWheels) return;

			var wheels = this.__internal__.Wheels;
			var renderManager = STU.RenderManager.getInstance();
			var mySceneTransfo = this.actor.getSceneTransform();

			// Car transform in scene space
			var actorTransformScene = this.getActor().getTransform(mySceneTransfo);

			// Gravity direction in scene coordinates (straight down)
			var gravityDirectionScene = new DSMath.Vector3D(0, 0, -1);

			// Accumulators for averaging
			var avgDstScene = 0; // Average distance from wheels to ground
			var avgNormalScene = new DSMath.Vector3D(); // Average ground normal
			var nbImpacts = 0; // Number of wheels that hit the ground

			// Temporarily disable picking for the car to avoid self-intersection
			var carClickableState = iActor.clickable;
			iActor.clickable = false;

			var wheelCenterAvgPosScene = new DSMath.Point();
			var intersections = {}; // Ground contact points for each wheel

			// ------------------------------------------------------------
			// 1. Raycast from each wheel toward the ground
			// ------------------------------------------------------------
			for (var w in wheels) { /* jshint -W089 */
				var wheelClickableState = wheels[w].clickable;
				wheels[w].clickable = false; // Avoid self-pick

				// Wheel center in scene coordinates
				var wheelCenterScene = DSMath.Transformation.multiply(
					actorTransformScene,
					this.__internal__.P13w[w]
				).vector;

				// Build ray starting slightly above the wheel (4x radius)
				var rayVect = new STU.Ray();
				rayVect.origin.x = wheelCenterScene.x - this.__internal__.Radius[w] * 4 * gravityDirectionScene.x;
				rayVect.origin.y = wheelCenterScene.y - this.__internal__.Radius[w] * 4 * gravityDirectionScene.y;
				rayVect.origin.z = wheelCenterScene.z - this.__internal__.Radius[w] * 4 * gravityDirectionScene.z;

				wheelCenterAvgPosScene.addVector(wheelCenterScene);

				// Point ray straight down
				rayVect.direction.copy(gravityDirectionScene);
				rayVect.setLength(1e10); // Very long ray

				// First, try ground-specific picking
				var params = {
					position: rayVect.origin,
					reference: mySceneTransfo,
					pickGeometry: true,
					pickTerrain: true,
					pickWater: false
				};

				var intersect = renderManager._pickGroundFromPosition(params);

				if (intersect) {
					nbImpacts++;
					var point = intersect.point;

					// Distance from ray origin to intersection
					var dx = point.x - rayVect.origin.x;
					var dy = point.y - rayVect.origin.y;
					var dz = point.z - rayVect.origin.z;
					var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

					avgDstScene += dist;
					intersections[w] = point;
				} else {
					// Fallback: generic ray picking to get surface normal
					var intersectArray = renderManager._pickFromRay(rayVect, true, true);
					if (
						intersectArray[0] &&
						intersectArray[0].normal
					) {
						avgNormalScene.add(intersectArray[0].normal);
					}
				}

				wheels[w].clickable = wheelClickableState; // Restore wheel pickability
			}

			iActor.clickable = carClickableState; // Restore car pickability
			wheelCenterAvgPosScene.multiplyScalar(0.25); // Average wheel center

			// ------------------------------------------------------------
			// 2. If at least one wheel hit the ground, process results
			// ------------------------------------------------------------
			if (nbImpacts > 0) {
				avgDstScene /= nbImpacts;

				// Compute average ground normal
				if (nbImpacts === 4) {
					// Use all 4 wheels to compute normal
					var rightVec = DSMath.Vector3D.sub(intersections.WheelBR, intersections.WheelBL).normalize();

					var frontCenter = DSMath.Vector3D.add(intersections.WheelFL, intersections.WheelFR).multiplyScalar(0.5);
					var backCenter = DSMath.Vector3D.add(intersections.WheelBL, intersections.WheelBR).multiplyScalar(0.5);

					var frontVec = DSMath.Vector3D.sub(frontCenter, backCenter);
					avgNormalScene = DSMath.Vector3D.cross(rightVec, frontVec);
				} else {
					avgNormalScene.multiplyScalar(1 / nbImpacts);
				}
				avgNormalScene.normalize();

				// --------------------------------------------------------
				// 3. If far from the ground → apply gravity
				// --------------------------------------------------------
				if (avgDstScene > (10 + this.__internal__.Radius.WheelFR * 5)) {
					var gravityFactor = 9.81 * this.__internal__.timeInTheAir * 10;
					oMoveVec.x += gravityFactor * gravityDirectionScene.x;
					oMoveVec.y += gravityFactor * gravityDirectionScene.y;
					oMoveVec.z += gravityFactor * gravityDirectionScene.z;

					this.__internal__.timeInTheAir += iDeltaTime;
				} else {
					// ----------------------------------------------------
					// 4. Close to ground → adjust position & align to ground
					// ----------------------------------------------------
					var diffScene = (this.__internal__.Radius.WheelFR * 5) - avgDstScene;

					// Only translate if deviation is significant
					if (Math.abs(diffScene) > 10) {
						var diffVecScene = DSMath.Vector3D.multiplyScalar(avgNormalScene, diffScene);
						iActor.translate(diffVecScene);
					}

					this.__internal__.timeInTheAir = 0;

					// Align actor with ground plane
					this.alignWithTheGround(iActor, iUpActorVec, avgNormalScene, wheelCenterAvgPosScene);
				}
			}
		};

		// essaye de rendre colin�aire iGroundZ et iUpActorVector
		// iUpActorVector dans repere scene 
		// iGroundZ dans repere scene
		// iWheelCenterAvgPosScene dans repere scene
		CarController.prototype.alignWithTheGround = function (iActor, iUpActorVector, iGroundZ, iWheelCenterAvgPosScene) {
			if (iUpActorVector === undefined || iUpActorVector === null) {
				console.error('iUpActorVector == null');
				return;
			}
			if (iGroundZ === undefined || iGroundZ === null) {
				console.error('iGroundZ == null');
				return;
			}

			var orth = DSMath.Vector3D.cross(iGroundZ, iUpActorVector);

			// collinear test 
			if (orth.squareNorm() > 0.0001) {
				orth.normalize();
				var dot = iGroundZ.dot(iUpActorVector);
				var angle = -Math.acos(dot);

				iActor.rotateAround(iWheelCenterAvgPosScene, orth, angle);
			}
		};

		/**
		 * Instructs the car to stop following the given path.
		 *
		 * @method
		 * @private
		 */
		CarController.prototype.stopFollowPath = function () {
			this.__internal__.isFollowingPath = false;
			this._target = null;
			console.debug('Car ' + this.getActor().name + ' has stopped following path');
			this.__internal__.CurrentSpeed = 0;
		};

		/**
		 * Instructs the car to start following a given path from a certain percentage of its length.
		 *
		 * @method
		 * @param {STU.PathActor} path - Path the car should follow.
		 * @param {number} [percentage=0] - Starting position on the path (0 to 1).
		 * @private
		 */
		CarController.prototype.followPath = function (path, percentage) {
			console.debug('Follow Path trigger: ' + this.getActor().name);

			// If path is new OR was previously stopped
			if (this.__internal__.target !== path || (this.__internal__.target === path && !this.__internal__.isFollowingPath)) {

				this.__internal__.target = path;
				this.__internal__.isFollowingPath = true;
				this.__internal__.pathLength = path.getLength();
				this.__internal__.currentDistanceFollowPath = 0;

				// Initialize wheel geometry if applicable
				if (this.__internal__.HasWheels) {
					if (!this.__internal__.Init) {
						this.init(this.getActor());
					}
					this.__internal__.CurrentSpeed = this.__internal__.CurrentSpeed; // Keep last speed value
				}

				// Start position on the path based on percentage
				var pathStartValue = 0;
				if (percentage !== undefined && percentage !== null && percentage >= 0 && percentage <= 1) {
					this.__internal__.currentDistanceFollowPath = this.__internal__.pathLength * percentage;
					pathStartValue = percentage;
				}

				var mySceneTransfo = this.actor.getSceneTransform();
				var pathStart = path.getValue(pathStartValue, mySceneTransfo).clone();

				var moveToPath, carFrontVector, carCenter;

				if (this.__internal__.HasWheels) {
					// TEMP code (Berdj Demo)
					this.__internal__.upVec = new DSMath.Vector3D(0, 0, 1);
					var angle = this.getAngleAngleBetweenCarAndPath();
					if (!isNaN(angle)) {
						this.getActor().rotateAround(this.getBackWheelCenter(), this.__internal__.upVec, angle);
					}

					carCenter = this.getBackWheelCenter();
					moveToPath = pathStart.sub(carCenter);
					carFrontVector = this.getCarFrontVector();
				} else {
					carCenter = this.getActor().getPosition();
					moveToPath = pathStart.sub(carCenter);
					carFrontVector = this.getActor().getTransform().matrix.getFirstColumn();
				}

				// Move the car to align with the starting point of the path
				this.getActor().translate(moveToPath);
			}
		};


		/**
		 * Updates the car position and orientation while following a path.
		 *
		 * @method
		 * @param {number} iDeltaTime - Time elapsed since the last update.
		 * @private
		 */
		CarController.prototype.updateFollowPath = function (iDeltaTime) {
			var actor = this.getActor();
			var carLength = this.getWheelbaseLength();
			var radius = this.__internal__.Radius["WheelFR"];

			// Update distance along the path
			if (this.__internal__.currentDistanceFollowPath + (carLength / 2) + radius < this.__internal__.pathLength) {
				this.__internal__.currentDistanceFollowPath += this.__internal__.CurrentSpeed * iDeltaTime;
			}

			// If path end reached
			if (this.__internal__.currentDistanceFollowPath + (carLength / 2) + radius > this.__internal__.pathLength) {
				this.__internal__.currentDistanceFollowPath = this.__internal__.pathLength - radius - (carLength / 2);
				this.__internal__.isFollowingPath = false;
				this._target = null;
				actor.dispatchEvent(new CarHasCompletedEvent(this.__internal__.target, actor));
				console.debug('Car ' + this.getActor().name + ' has completed following path');
				this.dispatchEvent(new STU.ServiceStoppedEvent("followPath", this));
				this.__internal__.CurrentSpeed = 0;
				this.__internal__.keyState.moveForward = 0;
			}

			var carFrontVector = null;
			var carCenter = null;
			var carBackCenter = null;
			if (this.__internal__.HasWheels) {
				carFrontVector = this.getCarFrontVector();
				carCenter = this.getWheelCenter();
				//carBackCenter = this.getBackWheelCenter();
				carCenter = this.getBackWheelCenter();
			} else {
				carFrontVector = this.getActor().getTransform().matrix.getFirstColumn();
				carCenter = this.getActor().getPosition();
				carBackCenter = carCenter.clone();
			}

			var mySceneTransfo = this.actor.getSceneTransform();
			var targetPosition = this.__internal__.target.getValue(
				this.__internal__.currentDistanceFollowPath / this.__internal__.pathLength,
				mySceneTransfo
			);

			var updatePosition = targetPosition.sub(carCenter);
			var angle = this.getAngleAngleBetweenCarAndPath();

			if (updatePosition.norm() < 1 || isNaN(angle)) {
				return;
			}

			// Rotate and adjust car pitch
			actor.rotateAround(carCenter, this.__internal__.upVec, angle);
			updatePosition.z = 0;
			if (carFrontVector.z < 0) {
				var pitch = this.getAngleBetweenVectors(carFrontVector, updatePosition);
				if (!isNaN(pitch) && Math.abs(pitch) < 0.7) {
					updatePosition.z = -updatePosition.norm() * Math.tan(pitch);
				}
			}

			actor.translate(updatePosition);
		};


		/**
		 * Updates the wheel rotation and steering while following a path.
		 *
		 * @method
		 * @param {number} iDeltaTime - Time elapsed since the last update.
		 * @private
		 */
		CarController.prototype.updateWheelFollowPath = function (iDeltaTime) {
			if (!this.__internal__.HasWheels) return;

			var actor = this.getActor();
			var actorTransform = actor.getTransform();
			var P03 = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL);
			var matrixCoeff = P03.matrix.getArray();

			var LeftVectWheel = new DSMath.Vector3D(matrixCoeff[0], matrixCoeff[3], matrixCoeff[6]);
			var upVec = new DSMath.Vector3D(matrixCoeff[1], matrixCoeff[4], matrixCoeff[7]);

			var mySceneTransfo = this.actor.getSceneTransform();
			var wheels = this.__internal__.Wheels;
			var carFrontVector = this.getCarFrontVector();
			var carLength = this.getWheelbaseLength();
			var radius = this.__internal__.Radius["WheelFR"];

			// Compute tangent vector along the path at front wheels
			var distFrontMid = this.__internal__.currentDistanceFollowPath + (carLength / 2);
			var distFrontEnd = distFrontMid + radius;
			if (distFrontMid >= this.__internal__.pathLength) {
				distFrontMid = this.__internal__.pathLength - 0.01;
				distFrontEnd = this.__internal__.pathLength;
			}

			var p1 = this.__internal__.target.getValue(distFrontMid / this.__internal__.pathLength, mySceneTransfo);
			var p2 = this.__internal__.target.getValue(distFrontEnd / this.__internal__.pathLength, mySceneTransfo);
			var tangent = DSMath.Vector3D.sub(p2, p1).normalize();

			// Initialize rotation state if not set
			this._previousWheelRotation = this._previousWheelRotation ?? 0;
			this._totalWheelRotation = this._totalWheelRotation ?? 0;

			// Steering angle adjustment
			var angle_front_wheels = this.getAngleBetweenVectorsInXY(carFrontVector, tangent);
			var wheelRotation = angle_front_wheels - this._previousWheelRotation;
			this._previousWheelRotation = angle_front_wheels;

			// Clamp wheel steering angle
			if (Math.abs(this._totalWheelRotation + wheelRotation) > this.steeringAngle) {
				var exceed = Math.abs(this._totalWheelRotation + wheelRotation) - this.steeringAngle;
				wheelRotation -= exceed * Math.sign(this._totalWheelRotation + wheelRotation);
				this._previousWheelRotation -= exceed * Math.sign(this._totalWheelRotation + wheelRotation);
			}

			this._totalWheelRotation += wheelRotation;

			// Rotate front wheels
			var FLwheelCenter = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
			wheels.WheelFL.rotateAround(FLwheelCenter, upVec, wheelRotation);

			var FRwheelCenter = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector;
			wheels.WheelFR.rotateAround(FRwheelCenter, upVec, wheelRotation);

			// Rotate all wheels for forward motion
			for (var w in wheels) {
				var wheelCenter = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w[w]).vector;
				var rotationAngle = (this.__internal__.CurrentSpeed * iDeltaTime) / this.__internal__.Radius[w];
				var rotationAxis = (w === "WheelFR" || w === "WheelFL")
					? LeftVectWheel.clone().applyMatrix3x3(DSMath.Matrix3x3.makeRotation(upVec, this._totalWheelRotation))
					: LeftVectWheel;

				wheels[w].rotateAround(wheelCenter, rotationAxis, rotationAngle);
			}
		};


		/**
		 * Adjusts acceleration/braking so the car matches the desired speed when following a path.
		 *
		 * @method
		 * @param {number} iDeltaTime - Time elapsed since the last update.
		 * @private
		 */
		CarController.prototype.updateFollowPathSpeed = function (iDeltaTime) {
			var keyState = this.__internal__.keyState;
			var desiredSpeed = this.speed * 277.777778; // m/s
			var currentSpeed = this.__internal__.CurrentSpeed;

			if (desiredSpeed >= currentSpeed) {
				keyState.moveForward = 1; // accelerate
				keyState.moveBackward = 0;
			} else {
				keyState.moveForward = 0;
				keyState.moveBackward = 1; // decelerate
			}
		};

		//To Use only if we have wheels 
		CarController.prototype.getAngleAngleBetweenCarAndPath = function () {
			var mySceneTransfo = this.actor.getSceneTransform();
			var carLength = this.getWheelbaseLength();
			var radius = this.__internal__.Radius["WheelFR"];
			var back_pos = this.getBackWheelCenter();
			var center_pos = this.getWheelCenter();
			var front_pos_on_path = this.__internal__.target.getValue((this.__internal__.currentDistanceFollowPath + (carLength / 2) + (radius)) / this.__internal__.pathLength, mySceneTransfo);
			var back_pos_on_path;
			if ((this.__internal__.currentDistanceFollowPath - (carLength / 2) > 0))
				back_pos_on_path = this.__internal__.target.getValue((this.__internal__.currentDistanceFollowPath - (carLength / 2)) / this.__internal__.pathLength, mySceneTransfo);
			else
				back_pos_on_path = this.__internal__.target.getValue(0, mySceneTransfo);
			//var center_pos_on_path = this.__internal__.target.getValue((this.__internal__.currentDistanceFollowPath) / this.__internal__.pathLength, mySceneTransfo);

			var front_vector = DSMath.Vector3D.sub(center_pos, back_pos).normalize();
			var path_direction = DSMath.Vector3D.sub(front_pos_on_path, back_pos_on_path).normalize();
			var angle = this.getAngleBetweenVectorsInXY(front_vector, path_direction);
			return angle;
		};

		/**
		 * Check if the car is following a give path.
		 *
		 * @method
		 * @param {number} iDeltaTime - Time elapsed since the last update.
		 * @private
		 */
		CarController.prototype.isFollowingPath = function (path) {
			if (path === this.__internal__.target) {
				return this.__internal__.isFollowingPath;
			}
			return false;
		};


		CarController.prototype.getWheelCenter = function () {
			var actorTransform = this.getActor().getTransform(); // dans le repere scene
			var middle = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector.clone();
			middle.add(DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector);
			middle.add(DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector);
			middle.add(DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBR).vector);
			middle.multiplyScalar(0.25);
			return middle;
		};

		CarController.prototype.getBackWheelCenter = function () {
			var actorTransform = this.getActor().getTransform(); // dans le repere scene
			var middle = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector.clone();
			middle.add(DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBR).vector);
			middle.multiplyScalar(0.5);
			return middle;
		};

		CarController.prototype.getFrontWheelCenter = function () {
			var actorTransform = this.getActor().getTransform(); // dans le repere scene
			var middle = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector.clone();
			middle.add(DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector);
			middle.multiplyScalar(0.5);
			return middle;
		};

		CarController.prototype.getWheelbaseLength = function () { //empattement
			if (this.__internal__.HasWheels === true) {
				if (this.__internal__.carLength === null || this.__internal__.carLength === undefined || this.__internal__.carLength === 0) {
					var actorTransform = this.getActor().getTransform();
					var FLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
					var BLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector;
					var FRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector;
					var BRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBR).vector;

					var center_front = DSMath.Vector3D.add(FLwheelCenterPosition, FRwheelCenterPosition);
					center_front.multiplyScalar(0.5);
					var center_back = DSMath.Vector3D.add(BLwheelCenterPosition, BRwheelCenterPosition);
					center_back.multiplyScalar(0.5);
					var back2front_vector = DSMath.Vector3D.sub(center_back, center_front);

					this.__internal__.carLength = back2front_vector.norm();
				}

				return this.__internal__.carLength;
			}
			else {
				console.warn("cannot compute wheelbase");
				return 0;
			}
		};

		CarController.prototype.setCarPosition = function (vector) {
			var carCenter = this.getWheelCenter(); // dans le repere scene
			var destination = vector.clone();
			destination.sub(carCenter);
			this.getActor().translate(destination); // dans le repere scene
		};

		CarController.prototype.getCarFrontVector = function () {
			var actorTransform = this.getActor().getTransform(); // dans le repere scene
			var FLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
			var FRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector;
			var BLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector;
			var BRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBR).vector;

			var center_front = FLwheelCenterPosition.add(FRwheelCenterPosition);
			center_front.multiplyScalar(0.5);
			var center_back = BLwheelCenterPosition.add(BRwheelCenterPosition);
			center_back.multiplyScalar(0.5);

			var Front_Direction = center_front.sub(center_back);
			Front_Direction.normalize();

			Front_Direction.z = 0;

			return Front_Direction;
		};

		CarController.prototype.getCarRightVector = function () {
			var actorTransform = this.getActor().getTransform(); // dans le repere scene
			var BRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBR).vector;
			var BLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector;
			BRwheelCenterPosition.sub(BLwheelCenterPosition);
			BRwheelCenterPosition.normalize();
			return BRwheelCenterPosition;
		};

		CarController.prototype.getCarLeftVector = function () {
			var actorTransform = this.getActor().getTransform(); // dans le repere scene
			var BRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBR).vector;
			var BLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector;
			BLwheelCenterPosition.sub(BRwheelCenterPosition);
			BLwheelCenterPosition.normalize();
			return BLwheelCenterPosition;
		};

		CarController.prototype.getAngleBetweenVectorsInXY = function (vector1, vector2) {
			var vec1 = vector1.clone();
			vec1.z = 0;
			vec1.normalize();
			var vec2 = vector2.clone();
			vec2.z = 0;
			vec2.normalize();
			var dot = vec1.dot(vec2);
			var angle = 0;
			if (dot >= 1) {
				angle = 0.0;
			} else if (dot <= -1) {
				angle = Math.PI;
			} else {
				angle = Math.acos(dot);
			}
			var sign = vec1.x * vec2.y - vec1.y * vec2.x;
			if (sign < 0) {
				return -angle;
			}
			return angle;
		};

		CarController.prototype.getAngleBetweenVectors = function (vector1, vector2) {
			var vec1 = vector1.clone();
			vec1.normalize();
			var vec2 = vector2.clone();
			vec2.normalize();
			var dot = vec1.dot(vec2);
			var angle = 0;
			if (dot >= 1) {
				angle = 0.0;
			} else if (dot <= -1) {
				angle = Math.PI;
			} else {
				angle = Math.acos(dot);
			}
			return angle;
		};

		CarController.prototype.setTrafficManagerOverride = function () {
			this.__internal__.trafficManagerOverride = true;
			if (this.__internal__.HasWheels) {
				this.init(this.getActor());
				var actorTransform = this.getActor().getTransform();
				var FLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
				var BLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector;
				var BRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBR).vector;
				FLwheelCenterPosition.sub(BLwheelCenterPosition);
				BRwheelCenterPosition.sub(BLwheelCenterPosition);
				this.__internal__.carLength = FLwheelCenterPosition.norm();
				this.__internal__.carWidth = BRwheelCenterPosition.norm();
				return true;
			}
			else {
				return false;
			}
		};

		CarController.prototype.setTrafficManagerOverrideByCopy = function (iModelBeh) {
			this.__internal__.trafficManagerOverride = true;
			if (this.__internal__.HasWheels) {
				for (var w in this.__internal__.Wheels) {
					this.__internal__.Radius[w] = iModelBeh.__internal__.Radius[w];
					this.__internal__.P13w[w] = iModelBeh.__internal__.P13w[w].clone();
					this.__internal__.BoundingSphere[w] = iModelBeh.__internal__.BoundingSphere[w];
					this.__internal__.transforms[w] = iModelBeh.__internal__.transforms[w].clone();
				}

				this.__internal__.carLength = iModelBeh.__internal__.carLength;
				this.__internal__.carWidth = iModelBeh.__internal__.carWidth;
				this.__internal__.Init = true;
				return true;
			}
			else {
				return false;
			}
		};

		CarController.prototype.pointToVector = function (point) {
			var vector = new DSMath.Vector3D();
			vector.set(point.x, point.y, point.z);
			return vector;
		};


		CarController.prototype.copyTransform = function (transform) {
			var t = new DSMath.Transformation();
			t.matrix = transform.matrix.clone();
			t.vector = transform.vector.clone();
			return t;
		};

		CarController.prototype.reajustCenter = function (wheelsIntersection) {
			var carCenter = this.getWheelCenter();
			var computedCenter = new DSMath.Vector3D();
			computedCenter.set(0, 0, 0);
			var wheels = this.__internal__.Wheels;
			for (var w in wheels) { /*jshint -W089 */
				var intersect = wheelsIntersection[w];
				if (intersect === 0 || intersect === undefined) {
					return 0;
				}
				computedCenter.add(this.pointToVector(intersect.point));
			}
			computedCenter.multiplyScalar(0.25);
			var wheeloffset = new DSMath.Vector3D(0, 0, this.__internal__.Radius["WheelBL"]); //Supposing all wheels with same size
			computedCenter.add(wheeloffset);
			var carCenterModification = DSMath.Vector3D.sub(computedCenter, carCenter);
			this.getActor().translate(carCenterModification);
		};

		CarController.prototype.trafficManagerUpdate = function (wheelsIntersection, iDeltaTime, speed, rotateWheels, iAngle) {
			this.reajustCenter(wheelsIntersection);
			var gravityVector = new DSMath.Vector3D();
			var actor = this.getActor();
			var actorTransform = actor.getTransform();
			var upVec = new DSMath.Vector3D();
			var P03 = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL);
			var matrixCoeff = P03.matrix.getArray();
			upVec.set(matrixCoeff[1], matrixCoeff[4], matrixCoeff[7]);
			var wheels = this.__internal__.Wheels;
			var avgDst = 0;
			var avgNormal = new DSMath.Vector3D();
			var nbImpacts = 0;
			var wheelCenterAvgPos = new DSMath.Vector3D();
			var intersections = {};
			var carFrontVector = this.getCarFrontVector();
			var carCenter = this.getWheelCenter();
			var direction = new DSMath.Vector3D();

			var wheelsCenter = new DSMath.Vector3D();
			var intersectionCenter = new DSMath.Vector3D();

			// Rotate the wheels
			if (rotateWheels) {
				var LeftVectWheel = new DSMath.Vector3D();
				LeftVectWheel.set(matrixCoeff[0], matrixCoeff[3], matrixCoeff[6]);
				var FRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector;


				var wheelCenterPosition = actor.getPosition();
				for (var w in wheels) { /*jshint -W089 */
					wheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w[w]).vector;
					var rotationAngle = speed * (1000 * iDeltaTime) / this.__internal__.Radius[w];
					wheels[w].setTransform(this.__internal__.transforms[w], actor);
					wheels[w].rotateAround(wheelCenterPosition, LeftVectWheel, rotationAngle);
					this.__internal__.transforms[w] = wheels[w].getTransform(actor);
				}

				var wheelRotation = iAngle;
				var FLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
				wheels.WheelFL.rotateAround(FLwheelCenterPosition, upVec, wheelRotation);

				var FRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector;
				wheels.WheelFR.rotateAround(FRwheelCenterPosition, upVec, wheelRotation);
			}


			// Rotate the car to match the wheels
			if (wheelsIntersection.WheelFR !== 0 && wheelsIntersection.WheelBR !== 0) {
				direction.x = wheelsIntersection.WheelFR.point.x - wheelsIntersection.WheelBR.point.x;
				direction.y = wheelsIntersection.WheelFR.point.y - wheelsIntersection.WheelBR.point.y;
				direction.z = wheelsIntersection.WheelFR.point.z - wheelsIntersection.WheelBR.point.z;

				intersectionCenter.add(wheelsIntersection.WheelFR.point);
				intersectionCenter.add(wheelsIntersection.WheelBR.point);
				intersectionCenter.add(wheelsIntersection.WheelFL.point);
				intersectionCenter.add(wheelsIntersection.WheelBL.point);
				intersectionCenter.multiplyScalar(1 / 4);

				var angle = this.getAngleBetweenVectorsInXY(carFrontVector, direction);
				if (direction.norm() > 1 && !isNaN(angle) && Math.abs(angle) > 0.0001) {
					actor.rotateAround(carCenter, upVec, angle);
				}
			}

			for (var w in wheels) { /*jshint -W089 */
				//compute wheel center position
				var wheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w[w]).vector;
				wheelsCenter.add(wheelCenterPosition);
				wheelCenterPosition.z += this.__internal__.Radius[w] * 4;
				wheelCenterAvgPos.x += wheelCenterPosition.x;
				wheelCenterAvgPos.y += wheelCenterPosition.y;
				wheelCenterAvgPos.z += wheelCenterPosition.z;
				if (wheelsIntersection[w] !== 0) {
					nbImpacts++;
					var intersectedPoint = wheelsIntersection[w].getPoint();
					var intersectedNormal = wheelsIntersection[w].getNormal();
					avgDst += Math.sqrt((intersectedPoint.x - wheelCenterPosition.x) * (intersectedPoint.x - wheelCenterPosition.x) + (intersectedPoint.y - wheelCenterPosition.y) *
						(intersectedPoint.y - wheelCenterPosition.y) + (intersectedPoint.z - wheelCenterPosition.z) * (intersectedPoint.z - wheelCenterPosition.z));
					avgNormal.add(intersectedNormal);
					intersections[w] = intersectedPoint;
				}
			}

			wheelCenterAvgPos.x /= 4;
			wheelCenterAvgPos.y /= 4;
			wheelCenterAvgPos.z /= 4;

			wheelsCenter.multiplyScalar(1 / 4);
			var inAir = wheelsCenter.z - this.__internal__.Radius.WheelFR * 2 > intersectionCenter.z;

			if (nbImpacts > 0) {
				avgDst /= nbImpacts;
				if (nbImpacts === 4) {
					var rightVec = DSMath.Vector3D.sub(intersections.WheelBR, intersections.WheelBL).normalize();
					var frontVec = DSMath.Vector3D.sub(intersections.WheelFL, intersections.WheelBL).normalize();
					avgNormal = DSMath.Vector3D.cross(rightVec, frontVec);
				} else {
					avgNormal.multiplyScalar(1 / nbImpacts);
				}

				//if (avgDst > 10 + this.__internal__.Radius.WheelFR * 5) {
				if (inAir) {
					gravityVector.z -= 9.81 * this.__internal__.timeInTheAir * 10;
					this.__internal__.timeInTheAir += iDeltaTime;
				} else {
	                /*var diff = this.__internal__.Radius.WheelFR * 5 - avgDst;
	                if (Math.abs(diff) > 10) {
	                    var diffVec = DSMath.Vector3D.multiplyScalar(avgNormal, diff);
	                    actor.translate(diffVec);
	                }*/
					this.__internal__.timeInTheAir = 0;
					this.alignWithTheGround(actor, upVec, avgNormal, wheelCenterAvgPos);
				}
			}
			if (gravityVector.z !== 0) {
				actor.translate(gravityVector);
			}
		};
		/**
		 * Main method executed each frame
		 *
		 * @method
		 * @private
		 * @param {Number} iDeltaTime Time elapsed since last frame (in seconds)
		 */
		CarController.prototype.executeOneFrame = function (iDeltaTime) {
			var actor = this.getActor();
			if (!actor || !(actor instanceof Actor3D)) return this;

			// Handle path-following mode first
			if (this.__internal__.isFollowingPath) {
				this.updateFollowPathSpeed();
				this.updateFollowPath(iDeltaTime);
				this.updateWheelFollowPath(iDeltaTime);
			}

			// If traffic manager is in control → skip
			if (this.__internal__.trafficManagerOverride) return;

			this.handleGamepadAxis(); // Handle gamepad inputs

			// Update speed based on input
			this.applySpeedControl(iDeltaTime);

			// Move and rotate the car
			if (!this.__internal__.HasWheels) {
				this.moveWithoutWheels(actor, iDeltaTime);
			} else {
				this.moveWithWheels(actor, iDeltaTime);
			}
		};

		/**
		 * Calculates the car's new speed based on acceleration, braking, and keyState.
		 * 
		 * @method
		 * @param {Number} iDeltaTime Time elapsed since last frame (in seconds)
		 * @private
		 */
		CarController.prototype.applySpeedControl = function (iDeltaTime) {
			var keyState = this.__internal__.keyState;
			var speed = this.speed * 277.777778; // km/h → mm/s
			var newSpeed = this.__internal__.CurrentSpeed;

			if (this.speed > 0) {
				// No movement keys pressed
				if (keyState.moveForward === 0 && keyState.moveBackward === 0 && keyState.brake === 0) {
					newSpeed = this.decelerateToIdle(newSpeed, speed, iDeltaTime);
				}
				// Moving forward
				else if (keyState.moveForward !== 0 && keyState.moveBackward === 0 && keyState.brake === 0) {
					newSpeed = this.accelerateForward(newSpeed, speed, iDeltaTime) * keyState.moveForward;
				}
				// Moving backward
				else if (keyState.moveForward === 0 && keyState.moveBackward !== 0 && keyState.brake === 0) {
					newSpeed = this.accelerateBackward(newSpeed, speed, iDeltaTime) * keyState.moveBackward;
				}
				// Braking
				else if (keyState.brake !== 0) {
					newSpeed = this.applyBraking(newSpeed, speed, iDeltaTime);
				}
			} else {
				newSpeed = 0; // No configured speed → no movement
			}

			this.__internal__.CurrentSpeed = newSpeed;
		};

		// ------------------------
		// Speed calculation helpers
		// ------------------------
		CarController.prototype.decelerateToIdle = function (currentSpeed, maxSpeed, dt) {
			if (this.acceleration > 0) {
				var t = (currentSpeed / maxSpeed) * this.acceleration;
				if (t > 0) t = Math.max(t - dt, 0);
				else if (t < 0) t = Math.min(t + dt, 0);
				else t = 0;
				return (maxSpeed / this.acceleration) * t;
			}
			return 0;
		};

		CarController.prototype.accelerateForward = function (currentSpeed, maxSpeed, dt) {
			if (this.acceleration > 0 && this.deceleration > 0) {
				if (currentSpeed < 0) {
					var t = (currentSpeed / maxSpeed) * this.deceleration;
					t = Math.min(t + dt, this.deceleration);
					return (maxSpeed / this.deceleration) * t;
				} else {
					var t = (currentSpeed / maxSpeed) * this.acceleration;
					t = Math.min(t + dt, this.acceleration);
					return (maxSpeed / this.acceleration) * t;
				}
			}
			return maxSpeed;
		};

		CarController.prototype.accelerateBackward = function (currentSpeed, maxSpeed, dt) {
			if (this.acceleration > 0 && this.deceleration > 0) {
				if (currentSpeed > 0) {
					var t = (currentSpeed / maxSpeed) * this.deceleration;
					t = Math.max(t - dt, -this.deceleration);
					return (maxSpeed / this.deceleration) * t;
				} else {
					var t = (currentSpeed / maxSpeed) * this.acceleration;
					t = Math.max(t - dt, -this.acceleration);
					return (maxSpeed / this.acceleration) * t;
				}
			}
			return -maxSpeed;
		};

		CarController.prototype.applyBraking = function (currentSpeed, maxSpeed, dt) {
			if (this.deceleration > 0) {
				var t = (currentSpeed / maxSpeed) * this.deceleration;
				if (currentSpeed > 0.1) {
					t = Math.max(t - dt, 0);
				} else if (currentSpeed < -0.1) {
					t = Math.min(t + dt, 0);
				} else {
					t = 0;
				}
				return (maxSpeed / this.deceleration) * t;
			}
			return 0;
		};

		// ------------------------
		// Movement without wheels
		// ------------------------
		CarController.prototype.moveWithoutWheels = function (actor, dt) {
			var keyState = this.__internal__.keyState;
			var moveVec = new DSMath.Vector3D();

			if (this.__internal__.CurrentSpeed !== 0 && !this.__internal__.isFollowingPath) {
				// Translate the car
				moveVec.set(this.__internal__.CurrentSpeed * dt, 0, 0);
				actor.translate(moveVec, actor);

				// Apply rotation from steering input
				if (keyState.turnLeft !== 0 || keyState.turnRight !== 0) {
					var RotateAngle = this.steeringAngle * dt;
					RotateAngle *= keyState.turnRight !== 0 ? -keyState.turnRight : keyState.turnLeft;

					// Reverse rotation if going backward
					if (this.__internal__.CurrentSpeed < 0) {
						RotateAngle *= -1;
					}

					var rotationVec = new DSMath.Vector3D();
					rotationVec.set(0, 0, RotateAngle);
					actor.rotate(rotationVec, actor);
				}
			}
		};

		// ------------------------
		// Movement with wheels
		// ------------------------
		CarController.prototype.moveWithWheels = function (actor, dt) {
			var wheels = this.__internal__.Wheels;
			var upVec = new DSMath.Vector3D();
			var moveVec = new DSMath.Vector3D();

			// Init wheel transforms if needed
			if (!this.__internal__.Init) {
				this.init(actor);
			} else if (!this.__internal__.isFollowingPath) {
				for (var w in wheels) { /* jshint -W089 */
					wheels[w].setTransform(this.__internal__.transforms[w], actor);
				}
			}

			var actorTransform = actor.getTransform();

			// Extract "up" vector from back-left wheel
			var P03 = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL);
			var matrixCoeff = P03.matrix.getArray();
			upVec.set(matrixCoeff[1], matrixCoeff[4], matrixCoeff[7]);
			this.__internal__.upVec = upVec;

			// Handle forward/backward movement
			if (this.__internal__.CurrentSpeed !== 0 && !this.__internal__.isFollowingPath) {
				moveVec.set(matrixCoeff[2], matrixCoeff[5], matrixCoeff[8]);
				moveVec.normalize();

				var LeftVectWheel = new DSMath.Vector3D();
				LeftVectWheel.set(matrixCoeff[0], matrixCoeff[3], matrixCoeff[6]);

				moveVec.multiplyScalar(this.__internal__.CurrentSpeed * dt);
				actor.translate(moveVec);
				actorTransform = actor.getTransform();

				// Rotate each wheel
				for (var w in wheels) {
					var wheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w[w]).vector;
					var rotationAngle = (this.__internal__.CurrentSpeed * dt) / this.__internal__.Radius[w];
					wheels[w].rotateAround(wheelCenterPosition, LeftVectWheel, rotationAngle);
					this.__internal__.transforms[w] = wheels[w].getTransform(actor);
				}
			}

			// Apply gravity
			if (this.keepOnGround) {
				var gravityVector = new DSMath.Vector3D();
				this.computeGravityForce(gravityVector, dt, actor, upVec);
				if (gravityVector.z !== 0) {
					actor.translate(gravityVector);
				}
			}

			// Handle steering for wheeled vehicles
			this.applySteering(actor, moveVec, upVec, actorTransform, dt);
		};

		// ------------------------
		// Steering logic
		// ------------------------
		CarController.prototype.applySteering = function (actor, moveVec, upVec, actorTransform, dt) {
			var keyState = this.__internal__.keyState;

			if (keyState.turnLeft === 0 && keyState.turnRight === 0 &&
				this.__internal__.CurrentWheelRotationAmount <= 0) {
				return; // No steering input and no wheel rotation to reset
			}

			var currentWheelDirection = this.__internal__.CurrentWheelDirection;
			var timeToTurnWheels = this.steeringTime;
			var turningRadius = this.steeringAngle;
			var currentWheelRotationAmount = this.__internal__.CurrentWheelRotationAmount;
			var wheelRotation;
			var maxSpeed = this.speed * 277.777778;
			var velocityContraint = (3 * maxSpeed - this.__internal__.CurrentSpeed) / (3 * maxSpeed);

			// Determine steering direction and wheel rotation
			if (keyState.turnLeft !== 0 || keyState.turnRight !== 0) {
				var rotationSign = keyState.turnRight > 0 ? -keyState.turnRight : keyState.turnLeft;

				if (currentWheelDirection !== rotationSign) {
					currentWheelRotationAmount -= 3 * dt;
					if (currentWheelRotationAmount < 0) {
						currentWheelDirection = rotationSign;
						currentWheelRotationAmount *= -1;
					}
					wheelRotation = currentWheelDirection * currentWheelRotationAmount * turningRadius / timeToTurnWheels;
				} else {
					if (timeToTurnWheels > 0) {
						currentWheelRotationAmount = Math.min(currentWheelRotationAmount + dt * velocityContraint, timeToTurnWheels);
						wheelRotation = currentWheelDirection * currentWheelRotationAmount * turningRadius / timeToTurnWheels;
					} else {
						currentWheelRotationAmount = 0;
						wheelRotation = currentWheelDirection * turningRadius;
					}
				}
			} else {
				if (timeToTurnWheels > 0) {
					currentWheelRotationAmount = Math.max(currentWheelRotationAmount - 2 * dt, 0);
					wheelRotation = currentWheelDirection * currentWheelRotationAmount * turningRadius / timeToTurnWheels;
				} else {
					currentWheelRotationAmount = 0;
					wheelRotation = currentWheelDirection * turningRadius;
				}
			}

			// Rotate the entire car
			if (this.__internal__.CurrentSpeed !== 0) {
				var quat = new DSMath.Quaternion();
				quat.makeRotation(upVec, wheelRotation);
				var motionPt = moveVec.applyQuaternion(quat);

				if (keyState.turnLeft > 0) {
					var FLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
					var BLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector;
					var carRotationAngle =
						Math.atan2((motionPt.y + FLwheelCenterPosition.y) - BLwheelCenterPosition.y,
							(motionPt.x + FLwheelCenterPosition.x) - BLwheelCenterPosition.x) -
						Math.atan2(FLwheelCenterPosition.y - BLwheelCenterPosition.y,
							FLwheelCenterPosition.x - BLwheelCenterPosition.x);
					actor.rotateAround(BLwheelCenterPosition, upVec, carRotationAngle);
				} else {
					var FRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
					var BRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL).vector;
					var carRotationAngle =
						Math.atan2((motionPt.y + FRwheelCenterPosition.y) - BRwheelCenterPosition.y,
							(motionPt.x + FRwheelCenterPosition.x) - BRwheelCenterPosition.x) -
						Math.atan2(FRwheelCenterPosition.y - BRwheelCenterPosition.y,
							FRwheelCenterPosition.x - BRwheelCenterPosition.x);
					actor.rotateAround(BRwheelCenterPosition, upVec, carRotationAngle);
				}
				actorTransform = actor.getTransform();
			}

			// Save wheel rotation state
			this.__internal__.CurrentWheelRotationAmount = currentWheelRotationAmount;
			this.__internal__.CurrentWheelDirection = currentWheelDirection;

			// Rotate front wheels visually
			var FLwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFL).vector;
			this.__internal__.Wheels.WheelFL.rotateAround(FLwheelCenterPosition, upVec, wheelRotation);

			var FRwheelCenterPosition = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelFR).vector;
			this.__internal__.Wheels.WheelFR.rotateAround(FRwheelCenterPosition, upVec, wheelRotation);

			/////////////
			// POC_Steering - Rotation of steering wheel
			/////////////

			if (this.steeringWheelActor) {
				//as the wheels are rotating also to move to roll, we "resetted" their steer in the "Movement with wheels" section
				//therefore we are reseting as well the rotation of the steering wheel as well
				var steeringWheelTransform = this.__internal__.steeringWheelInitTransform; //position of actor defined in cxp
				var steeringWheelCenterPoint = DSMath.Transformation.multiply(actorTransform, this.__internal__.steeringWheelLocalTransform).vector; //actual center of rotation (not the same if product is bad designed)

				// actual resetting the sterring wheel to its rest position
				this.steeringWheelActor.setTransform(steeringWheelTransform, this.actor);

				//We create the rotation axis around which the steering wheel will turn around -> up axis that is offset of a certain angle
				var steeringWheelAngleOffsetInRad = this.steeringWheelAngleOffset * (Math.PI / 180); //arbitrary by user - inputed in degree
				const cosTheta = Math.cos(steeringWheelAngleOffsetInRad);
				const sinTheta = Math.sin(steeringWheelAngleOffsetInRad);

				var frontVector = this.getCarFrontVector().normalize();
				var rightVector = this.getCarRightVector().normalize();
				var upVector = DSMath.Vector3D.cross(rightVector, frontVector).normalize(); //three system axis

				//rotate around axis rightVector
				const rotationAxis = new DSMath.Vector3D.add(frontVector.multiplyScalar(cosTheta), upVector.multiplyScalar(sinTheta))

				//actual application of rotation
				this.steeringWheelActor.rotateAround(steeringWheelCenterPoint, rotationAxis, wheelRotation * this.steeringWheelRotationFactor);
			}

			/////////////
			// END POC_Steering - Rotation of steering wheel
			/////////////
		};

		/**
		 * Initializes wheel transformation matrices in the car's reference frame.
		 *
		 * This method:
		 * 1. Stores the initial wheel transforms relative to the car.
		 * 2. Computes each wheel's bounding sphere (from bounding box data for accuracy).
		 * 3. Calculates each wheel's radius (either from bounding box or raycast).
		 * 4. Determines the car's local coordinate system using wheel positions.
		 * 5. Computes transformation matrices for each wheel relative to the car.
		 * 6. Slightly rotates wheels to ensure consistent transform initialization.
		 *
		 * @method
		 * @private
		 * @param  {STU.Actor3D} iActor - The car actor.
		 */
		CarController.prototype.init = function (iActor) {
			this.__internal__.Init = true;
			var wheels = this.__internal__.Wheels;
			var wheelBS = this.__internal__.BoundingSphere; // Bounding spheres for each wheel
			var carTransform = iActor.getTransform();       // Car's initial transform

			// ------------------------------------------------------------
			// 1. Store initial wheel transforms and compute bounding spheres
			// ------------------------------------------------------------
			for (var w in wheels) { /* jshint -W089 */
				// Save wheel transform relative to the car
				this.__internal__.transforms[w] = wheels[w].getTransform(iActor);

				// Get bounding box (more reliable than getBoundingSphere)
				var box = wheels[w].getBoundingBox();
				wheelBS[w] = {
					center: {
						x: (box.high.x + box.low.x) * 0.5,
						y: (box.high.y + box.low.y) * 0.5,
						z: (box.high.z + box.low.z) * 0.5
					},
					radius: Math.abs(box.high.z - box.low.z) * 0.5
				};
			}

			// ------------------------------------------------------------
			// 2. Compute wheel radii (raycast or fallback to bounding box)
			// ------------------------------------------------------------
			var carClickableState = iActor.clickable;
			iActor.clickable = true; // Enable picking for raycasting

			for (var w in wheels) {
				if (this._useBBoxAsRadius) {
					this.__internal__.Radius[w] = wheelBS[w].radius;
				} else {
					this.__internal__.Radius[w] = this.computeWheelRadius(wheelBS[w], wheels[w]);
				}
			}

			// ------------------------------------------------------------
			// 3. Compute the car's local coordinate system
			// ------------------------------------------------------------
			var sceneTransform = this.actor.getSceneTransform();
			var upScene = sceneTransform.matrix.getThirdColumn().clone().normalize();

			// Get front vector from lower points of front-left and back-left wheels
			var FL_lower = new DSMath.Vector3D(wheelBS.WheelFL.center.x, wheelBS.WheelFL.center.y, wheelBS.WheelFL.center.z);
			var BL_lower = new DSMath.Vector3D(wheelBS.WheelBL.center.x, wheelBS.WheelBL.center.y, wheelBS.WheelBL.center.z);

			var offsetVec = upScene.clone().multiplyScalar(this.__internal__.Radius.WheelFL);
			FL_lower.sub(offsetVec);

			offsetVec = upScene.clone().multiplyScalar(this.__internal__.Radius.WheelBL);
			BL_lower.sub(offsetVec);

			var frontVec = FL_lower.sub(BL_lower).normalize();

			// Left vector: from back-right to back-left wheels
			var leftVec = DSMath.Vector3D.sub(wheelBS.WheelBL.center, wheelBS.WheelBR.center).normalize();

			// Up vector: cross product of front and left vectors
			var upVec = DSMath.Vector3D.cross(frontVec, leftVec);

			// Transformation matrix coefficients for wheel local frame
			var coeff = [
				leftVec.x, upVec.x, frontVec.x,
				leftVec.y, upVec.y, frontVec.y,
				leftVec.z, upVec.z, frontVec.z
			];

			// ------------------------------------------------------------
			// 4. Compute P13w transforms (wheel → car)
			// ------------------------------------------------------------
			for (var w in wheels) {
				var P03 = new DSMath.Transformation();
				P03.matrix.setFromArray(coeff);
				P03.vector.set(wheelBS[w].center.x, wheelBS[w].center.y, wheelBS[w].center.z);

				var P30 = P03.getInverse();
				var P31 = DSMath.Transformation.multiply(P30, carTransform);
				var P13 = P31.getInverse();

				this.__internal__.P13w[w] = P13;
			}

			// ------------------------------------------------------------
			// 5. Align wheels for consistent initialization
			// ------------------------------------------------------------
			var actor = this.getActor();
			var actorTransform = actor.getTransform();

			var P03_BL = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w.WheelBL);
			var matrixCoeff = P03_BL.matrix.getArray();
			var leftVecWheel = new DSMath.Vector3D(matrixCoeff[0], matrixCoeff[3], matrixCoeff[6]);

			for (var w in wheels) {
				var wheelCenter = DSMath.Transformation.multiply(actorTransform, this.__internal__.P13w[w]).vector;
				wheels[w].rotateAround(wheelCenter, leftVecWheel, 0.0001);

				// Update stored wheel transform after adjustment
				this.__internal__.transforms[w] = wheels[w].getTransform(actor);
			}

			// Restore car's original clickable state
			iActor.clickable = carClickableState;

			/////////////
			// POC_Steering - Rotation of steering wheel
			/////////////

			// ------------------------------------------------------------
			// 6. Store steering wheel position on its own - repeat operations
			// ------------------------------------------------------------
			if (this.steeringWheelActor) {
				this.__internal__.steeringWheelInitTransform = this.steeringWheelActor.getTransform(iActor);

				var bbox = this.steeringWheelActor.getOrientedBoundingBox();
				var steeringWheelBbox = {
					center: new DSMath.Vector3D(
						(bbox.high.x + bbox.low.x) * 0.5,
						(bbox.high.y + bbox.low.y) * 0.5,
						(bbox.high.z + bbox.low.z) * 0.5
					),
					radius: Math.abs(bbox.high.z - bbox.low.z) * 0.5
				};

				var P03 = new DSMath.Transformation();
				var A = steeringWheelBbox.center;

				P03.matrix.setFromArray(coeff);
				P03.vector.set(A.x, A.y, A.z);

				var P01 = carTransform;
				var P30 = P03.getInverse();
				var P31 = DSMath.Transformation.multiply(P30, P01);
				var P13 = P31.getInverse();

				this.__internal__.steeringWheelLocalTransform = P13;
			}

			/////////////
			// END POC_Steering - Rotation of steering wheel
			/////////////
		};
		
	    /**
		 * Callback called when a keyboard key is hit
		 * @method
		 * @private
		 */
		CarController.prototype.onKeyboardEvent = function (iKeyboardEvent) {
			var isPressed = 0;
			if (iKeyboardEvent.constructor === EP.KeyboardPressEvent) {
				var isPressed = 1;
			} else if (iKeyboardEvent.constructor === EP.KeyboardReleaseEvent) {
				var isPressed = 0;
			} else {
				return;
			}

			switch (iKeyboardEvent.getKey()) {
				case this.moveForward:
					this.__internal__.keyState.moveForward = isPressed;
					break;

				case this.moveBackward:
					this.__internal__.keyState.moveBackward = isPressed;
					break;

				case this.turnRight:
					this.__internal__.keyState.turnRight = isPressed;
					break;

				case this.turnLeft:
					this.__internal__.keyState.turnLeft = isPressed;
					break;

				case this.brake:
					this.__internal__.keyState.brake = isPressed;
					break;
			}
		};


		CarController.prototype.onGamepadEvent = function (iGamepadEvent) {
			var isPressed = 0;

			if (iGamepadEvent.constructor === EP.GamepadPressEvent) {
				isPressed = 1;
			} else if (iGamepadEvent.constructor === EP.GamepadReleaseEvent) {
				isPressed = 0;
			} else {
				return;
			}

			switch (iGamepadEvent.button) {
				case EP.Gamepad.EButton.eDPadUp:
				case EP.Gamepad.EButton.eA:
					this.__internal__.keyState.moveForward = isPressed;
					break;

				case EP.Gamepad.EButton.eDPadDown:
					this.__internal__.keyState.moveBackward = isPressed;
					break;

				case EP.Gamepad.EButton.eDPadRight:
					this.__internal__.keyState.turnRight = isPressed;
					break;

				case EP.Gamepad.EButton.eDPadLeft:
					this.__internal__.keyState.turnLeft = isPressed;
					break;

				case EP.Gamepad.EButton.eX:
					this.__internal__.keyState.brake = isPressed;
					break;
			}
		};

		CarController.prototype.handleGamepadAxis = function () {
			var gp = EP.Devices.getGamepad();
			if (gp === undefined || gp === null) {
				return;
			}

			var gpAxisValueX = gp.getAxisValue(EP.Gamepad.EAxis.eRSX);
			var gpAbsAxisValueX = Math.abs(gpAxisValueX);

			var gpAxisValueY = gp.getAxisValue(EP.Gamepad.EAxis.eLSY);
			var gpAbsAxisValueY = Math.abs(gpAxisValueY);

			if (gpAbsAxisValueX <= 0.1 && gpAbsAxisValueY <= 0.1 && !gp.isButtonPressed(EP.Gamepad.EButton.eA)) {
				if (this.__internal__.cleanGamePadAxis === false) {
					this.__internal__.keyState.moveForward = 0;
					this.__internal__.keyState.moveBackward = 0;
					this.__internal__.keyState.turnRight = 0;
					this.__internal__.keyState.turnLeft = 0;
					this.__internal__.cleanGamePadAxis = true;
				}
				return;
			}

	        /*		var strenghtAmount = Math.sqrt(gpAxisValueX*gpAxisValueX + gpAxisValueY*gpAxisValueY);
			 */
			this.__internal__.cleanGamePadAxis = false;
			if (gpAxisValueX > 0) {
				this.__internal__.keyState.turnRight = gpAbsAxisValueX;
				this.__internal__.keyState.turnLeft = 0;
			} else {
				this.__internal__.keyState.turnLeft = gpAbsAxisValueX;
				this.__internal__.keyState.turnRight = 0;
			}

			if (gpAxisValueY > 0) {
				this.__internal__.keyState.moveForward = 1;
				this.__internal__.keyState.moveBackward = 0;
			}
			else if (gpAxisValueY < 0) {
				this.__internal__.keyState.moveForward = 0;
				this.__internal__.keyState.moveBackward = 1;
			}
		};

	    /**
		 * Process executed when STU.CarController is activating
		 *
		 * @method
		 * @private
		 */
		CarController.prototype.onActivate = function (oExceptions) {
			var actorAssetLinkStatus = this.actor.getAssetLinkStatus();
			if (actorAssetLinkStatus == Actor3D.EAssetLinkStatus.eBroken) {
				console.error("[Car Controller]: Behavior is owned or pointing a by broken actor. The behavior will not run.");
				return;
			}

			Behavior.prototype.onActivate.call(this, oExceptions);

			this.keyboardCb = STU.makeListener(this, 'onKeyboardEvent');
			EP.EventServices.addListener(EP.KeyboardEvent, this.keyboardCb);

			this.gamepadCB = STU.makeListener(this, 'onGamepadEvent');
			EP.EventServices.addListener(EP.GamepadEvent, this.gamepadCB);
		};

	    /**
		 * Process executed when STU.CarController is deactivating
		 *
		 * @method
		 * @private
		 */
		CarController.prototype.onDeactivate = function () {
			EP.EventServices.removeListener(EP.KeyboardEvent, this.keyboardCb);
			delete this.keyboardCb;

			EP.EventServices.removeListener(EP.GamepadEvent, this.gamepadCB);
			delete this.gamepadCB;

			Behavior.prototype.onDeactivate.call(this);
		};

		/**
		 * Method called each frame by the task manager
		 *
		 * @method
		 * @private
		 * @param  iExContext Execution context
		 */
		CarController.prototype.onExecute = function (iExContext) {
			this.executeOneFrame(iExContext.getDeltaTime() / 1000);
		};

	    /**
		 * Process executed when CarControllerTask is started
		 * @private
		 */
		CarController.prototype.onStart = function () {

			var actor = this.getActor();
			if (actor === null || actor === undefined) {
				// we are on a component prototype, we should not run a task
				return;
			}

			var nbWheels = 0;
			var wheels = {};

			wheels.WheelFL = this.frontLeftWheel;
			wheels.WheelFR = this.frontRightWheel;
			wheels.WheelBL = this.backLeftWheel;
			wheels.WheelBR = this.backRightWheel;
			
			this.__internal__.Wheels = wheels;

			for (var w in wheels) {
				if (wheels[w] !== undefined && wheels[w] !== null) {
					nbWheels++;
				}
			}

			if (nbWheels === 4) {
				this.__internal__.HasWheels = true;
			} else {
				this.__internal__.HasWheels = false;
			}
		};

		/**
		 * Compute the physical radius of a wheel actor.
		 *
		 * This function tries to determine the radius of a wheel using a raycasting
		 * approach. If raycasting fails, it falls back to computing the radius from
		 * the wheel's bounding box in the car's reference frame.
		 *
		 * @param {Object} iWheelBS - Bounding sphere of the wheel (with `center` and `radius` properties).
		 * @param {Object} iWheel - The wheel actor object.
		 * @returns {number} The computed radius of the wheel in scene units.
		 * @private
		 */
		CarController.prototype.computeWheelRadius = function (iWheelBS, iWheel) {
			var oWheelRadius = -1;

			var renderManager = STU.RenderManager.getInstance();

			// Save the current clickable state and make the wheel clickable for ray picking
			var wheelClickableState = iWheel.clickable;
			iWheel.clickable = true;

			// ------------------------------------------------------------
			// 1. Primary method: Raycast from above the wheel toward its center
			// ------------------------------------------------------------

			var wheelBSCenter = iWheelBS.center;
			var wheelBSRadius = iWheelBS.radius;

			// Create a ray starting slightly above the wheel's bounding sphere
			var rayVect = new STU.Ray();
			rayVect.origin.x = wheelBSCenter.x;
			rayVect.origin.y = wheelBSCenter.y;
			rayVect.origin.z = wheelBSCenter.z + wheelBSRadius + 10; // +10 for clearance

			rayVect.direction.x = 0;
			rayVect.direction.y = 0;
			rayVect.direction.z = -1; // Pointing downwards toward the wheel

			// The ray length is slightly larger than the diameter of the sphere
			rayVect.setLength(wheelBSRadius * 2 + 20);

			// Convert ray coordinates from local to world space
			var mySceneTransfo = this._camera.getSceneTransform();

			// Pick intersections along the ray
			var intersectArray = renderManager._pickFromRay(rayVect, false, false, mySceneTransfo);
			var nbImpacts = intersectArray.length;

			for (var i = 0; i < nbImpacts; i++) {
				var impact = intersectArray[i];
				if (impact.actor && impact.actor.name === iWheel.name) {
					var intersectedPoint = impact.getPoint();
					oWheelRadius = intersectedPoint.z - wheelBSCenter.z;
					break;
				}
			}

			// ------------------------------------------------------------
			// 2. Fallback method: Use bounding box in car's reference frame
			// ------------------------------------------------------------
			if (oWheelRadius === -1) {
				console.error('Wheel Radius could not be computed via raycast, using fallback method.');

				var MyCar = this.getActor();

				// Get wheel position relative to the car
				var WheelPosInCarRef = iWheel.getTransform(MyCar);

				// Temporarily place the wheel in the car's coordinate system
				iWheel.setTransform(WheelPosInCarRef, "Location");

				// Get bounding box in world/scene space
				var BBoxInCarRef = iWheel.getBoundingBox();

				// Restore wheel's original position
				iWheel.setTransform(WheelPosInCarRef, MyCar);

				// Compute car scale relative to the scene
				var CarScaleRelToScene = Math.cbrt(MyCar.getTransform("Location").matrix.determinant());
				if (CarScaleRelToScene <= 0.0) {
					CarScaleRelToScene = 1.0;
				}

				// Calculate radius as half the Z-extent of the bounding box
				oWheelRadius = 0.5 * (BBoxInCarRef.high.z - BBoxInCarRef.low.z) * CarScaleRelToScene;
				oWheelRadius = Math.abs(oWheelRadius);

				console.error('Fallback radius: ', oWheelRadius);
			}

			// Restore original clickable state
			iWheel.clickable = wheelClickableState;

			return oWheelRadius;
		};

		CarController.prototype.noEpsilon = function (iValue, iEps) {
			if (Math.abs(iValue) < iEps) {
				return 0.0;
			}
			return iValue;
		};

		CarController.prototype.dumpPos = function (iPos) {
			var NbDigits = 6;
			var Epsilon = 1e-10;
			var dumpLoc = "----- Pos : (NbDigits :" + NbDigits + " eps :" + Epsilon + ")" + "\n";

			var Ux = this.noEpsilon(iPos.matrix.coef[0], Epsilon);
			var Uy = this.noEpsilon(iPos.matrix.coef[1], Epsilon);
			var Uz = this.noEpsilon(iPos.matrix.coef[2], Epsilon);

			var Vx = this.noEpsilon(iPos.matrix.coef[3], Epsilon);
			var Vy = this.noEpsilon(iPos.matrix.coef[4], Epsilon);
			var Vz = this.noEpsilon(iPos.matrix.coef[5], Epsilon);

			var Wx = this.noEpsilon(iPos.matrix.coef[6], Epsilon);
			var Wy = this.noEpsilon(iPos.matrix.coef[7], Epsilon);
			var Wz = this.noEpsilon(iPos.matrix.coef[8], Epsilon);

			var Tx = this.noEpsilon(iPos.vector.x, Epsilon);
			var Ty = this.noEpsilon(iPos.vector.y, Epsilon);
			var Tz = this.noEpsilon(iPos.vector.z, Epsilon);

			dumpLoc = dumpLoc + "     Matrix : " + "\n";
			dumpLoc = dumpLoc + "          " + Ux.toExponential(NbDigits) + " , " + Uy.toExponential(NbDigits) + " , " + Uz.toExponential(NbDigits) + "\n";
			dumpLoc = dumpLoc + "          " + Vx.toExponential(NbDigits) + " , " + Vy.toExponential(NbDigits) + " , " + Vz.toExponential(NbDigits) + "\n";
			dumpLoc = dumpLoc + "          " + Wx.toExponential(NbDigits) + " , " + Wy.toExponential(NbDigits) + " , " + Wz.toExponential(NbDigits) + "\n";

			dumpLoc = dumpLoc + "     Vector : " + "\n";
			dumpLoc = dumpLoc + "          " + Tx.toExponential(NbDigits) + " , " + Ty.toExponential(NbDigits) + " , " + Tz.toExponential(NbDigits) + "\n";
			return dumpLoc;
		};

		CarController.prototype.vector2String = function (iVector) {
			var NbDigits = 10;
			var Epsilon = 1e-10;
			var Tx = this.noEpsilon(iVector.x, Epsilon);
			var Ty = this.noEpsilon(iVector.y, Epsilon);
			var Tz = this.noEpsilon(iVector.z, Epsilon);

			return "{ " + Tx.toExponential(NbDigits) + " ; " + Ty.toExponential(NbDigits) + " ; " + Tz.toExponential(NbDigits) + " }";
		};
		
		// Expose in STU namespace.
		STU.CarController = CarController;

		return CarController;
	});

define('StuMiscContent/StuCarController', ['DS/StuMiscContent/StuCarController'], function (CarController) {
	'use strict';

	return CarController;
});
