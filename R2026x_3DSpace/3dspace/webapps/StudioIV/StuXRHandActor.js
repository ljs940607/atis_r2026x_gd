define('DS/StudioIV/StuXRHandActor', [
	'DS/StuCore/StuContext',
	'DS/StuRenderEngine/StuActor3D',
	'DS/StuCore/StuTools',
	'DS/StudioIV/StuXRDeviceActor',
	'DS/StudioIV/StuXRManager',
	'DS/EPEventServices/EPEvent',
	'DS/EPEventServices/EPEventServices',
	'DS/EPTaskPlayer/EPTask',
	'DS/StuRenderEngine/StuRenderManager',
	'DS/StudioIV/StuXRHandPinchBeginEvent',
	'DS/StudioIV/StuXRHandPinchEndEvent',
], function (
	STU,
	Actor3D,
	Tools,
	XRDeviceActor,
	XRManager,
	Event,
	EventServices,
	Task,
	RenderManager,
	XRHandPinchBeginEvent,
	XRHandPinchEndEvent
) {
	('use strict');

	/**
	 * Describes a XR Hand actor.<br/>
	 *
	 * @exports XRHandActor
	 * @class
	 * @constructor
	 * @noinstancector
	 * @public
	 * @extends STU.XRDeviceActor
	 * @memberof STU
	 * @alias STU.XRHandActor
	 */
	var XRHandActor = function () {
		XRDeviceActor.call(this);

		this.name = 'XRHandActor';

		//////////////////////////////////////////////////////////////////////////
		// Properties that should NOT be visible in UI
		//////////////////////////////////////////////////////////////////////////

		/**
		 * Private object that hold the reference to the transform of the joints.
		 *
		 * @member
		 * @instance
		 * @name _joints
		 * @private
		 * @type {Object}
		 * @memberof STU.XRHandActor
		 */
		this._joints = null;

		/**
		 * Private object that hold the reference to the poses status.
		 *
		 * @member
		 * @instance
		 * @name _poses
		 * @private
		 * @type {Object}
		 * @memberof STU.XRHandActor
		 */
		this._poses = null;
	};

	/**
	 * An enumeration of supported joints for a XR Hand. </br>
	 *
	 * @enum {number}
	 * @private
	 *
	 */
	XRHandActor.EJoints = {
		/** @private */
		ePalmTransform: 0,
		/** @private */
		eWristTransform: 1,

		/** @private */
		eThumbProximalTransform: 2,
		/** @private */
		eThumbIntermediateTransform: 3,
		/** @private */
		eThumbDistalTransform: 4,
		/** @private */
		eThumbTipTransform: 5,

		/** @private */
		eIndexProximalTransform: 6,
		/** @private */
		eIndexIntermediateTransform: 7,
		/** @private */
		eIndexDistalTransform: 8,
		/** @private */
		eIndexTipTransform: 9,

		/** @private */
		eMiddleProximalTransform: 10,
		/** @private */
		eMiddleIntermediateTransform: 11,
		/** @private */
		eMiddleDistalTransform: 12,
		/** @private */
		eMiddleTipTransform: 13,

		/** @private */
		eRingProximalTransform: 14,
		/** @private */
		eRingIntermediateTransform: 15,
		/** @private */
		eRingDistalTransform: 16,
		/** @private */
		eRingTipTransform: 17,

		/** @private */
		eLittleProximalTransform: 18,
		/** @private */
		eLittleIntermediateTransform: 19,
		/** @private */
		eLittleDistalTransform: 20,
		/** @private */
		eLittleTipTransform: 21,
	};

	XRHandActor.prototype = new XRDeviceActor();
	XRHandActor.prototype.constructor = XRHandActor;

	/**
	 * Process executed when XRHandActor is activating.
	 *
	 * @method
	 * @private
	 */
	XRHandActor.prototype.onActivate = function (oExceptions) {
		XRDeviceActor.prototype.onActivate.call(this, oExceptions);

		//thumb, index, middle, ring, little
		//Proximal, Intermediate, Distal, Tip
		this._joints = {
			xrPalmTransform: new DSMath.Transformation(),
			xrWristTransform: new DSMath.Transformation(),

			xrThumbProximalTransform: new DSMath.Transformation(),
			xrThumbIntermediateTransform: new DSMath.Transformation(),
			xrThumbDistalTransform: new DSMath.Transformation(),
			xrThumbTipTransform: new DSMath.Transformation(),

			xrIndexProximalTransform: new DSMath.Transformation(),
			xrIndexIntermediateTransform: new DSMath.Transformation(),
			xrIndexDistalTransform: new DSMath.Transformation(),
			xrIndexTipTransform: new DSMath.Transformation(),

			xrMiddleProximalTransform: new DSMath.Transformation(),
			xrMiddleIntermediateTransform: new DSMath.Transformation(),
			xrMiddleDistalTransform: new DSMath.Transformation(),
			xrMiddleTipTransform: new DSMath.Transformation(),

			xrRingProximalTransform: new DSMath.Transformation(),
			xrRingIntermediateTransform: new DSMath.Transformation(),
			xrRingDistalTransform: new DSMath.Transformation(),
			xrRingTipTransform: new DSMath.Transformation(),

			xrLittleProximalTransform: new DSMath.Transformation(),
			xrLittleIntermediateTransform: new DSMath.Transformation(),
			xrLittleDistalTransform: new DSMath.Transformation(),
			xrLittleTipTransform: new DSMath.Transformation(),
		};

		this._jointsName = [
			'xrPalmTransform',
			'xrWristTransform',

			'xrThumbProximalTransform',
			'xrThumbIntermediateTransform',
			'xrThumbDistalTransform',
			'xrThumbTipTransform',

			'xrIndexProximalTransform',
			'xrIndexIntermediateTransform',
			'xrIndexDistalTransform',
			'xrIndexTipTransform',

			'xrMiddleProximalTransform',
			'xrMiddleIntermediateTransform',
			'xrMiddleDistalTransform',
			'xrMiddleTipTransform',

			'xrRingProximalTransform',
			'xrRingIntermediateTransform',
			'xrRingDistalTransform',
			'xrRingTipTransform',

			'xrLittleProximalTransform',
			'xrLittleIntermediateTransform',
			'xrLittleDistalTransform',
			'xrLittleTipTransform',
		];

		//OpenPalmPose, Pinch2Strength, Pinch5Strength, GrabStrength, PointingPose
		this._poses = {
			xrOpenPalmBool: false,
			xrPinch2Bool: false,
			xrPinch5Bool: false,
			xrGrabStrengthBool: false,
			xrPointingPoseBool: false,
		};

		this._posesName = [
			'xrOpenPalmBool',
			'xrPinch2Bool',
			'xrPinch5Bool',
			'xrGrabStrengthBool',
			'xrPointingPoseBool',
		];
	};

	/**
	 * Process executed when XRHandActor is deactivating.
	 *
	 * @method
	 * @private
	 */
	XRHandActor.prototype.onDeactivate = function () {
		XRDeviceActor.prototype.onDeactivate.call(this);

		this._joints = [];
	};

	/**
	 * Update method called each frames => actually called by XRHandUpdateTask.
	 * @method
	 * @private
	 */
	XRHandActor.prototype.onExecute = function () {
		// Case where XR headset isn't connected to the computer
		var headset = this._XRMgr.getXRHeadset();
		if (headset === null) {
			return;
		}

		//both hands at the same time -> could call for each hands but will perf issue..?
		let isLeftHand = false;
		if (this.deviceID === XRManager.EDeviceIdentifier.eRightHand) {
			isLeftHand = false;
		} else if (this.deviceID === XRManager.EDeviceIdentifier.eLeftHand) {
			isLeftHand = true;
		}

		//call the xr manager to retrieve the correct coordonnates for the hand in its wrapper
		let xrHandTransformArray = [];
		let xrGesturesArray = [];
		[xrHandTransformArray, xrGesturesArray] = this._XRMgr.updateXRHand(isLeftHand);

		//HANDLING the joints of the hand
		if (xrHandTransformArray.length > 0) {
			//save the first transform : palm
			let palmTransform = new DSMath.Transformation();
			palmTransform.setFromArray(xrHandTransformArray[0]);
			var localPalmTransform = ThreeDS.Mathematics.multiplyTransfo(
				this._XRMgr._IVTechnoToV6Transform,
				palmTransform
			);
			var palmTransformInInterArea = ThreeDS.Mathematics.multiplyTransfo(
				this._XRMgr.getInteractionArea().getTransform(),
				localPalmTransform
			);

			this._joints[this._jointsName[0]] = palmTransformInInterArea;

			//start at 1 because the first eleme is a transform of the palm , the rest are vectors
			let jointsListLength = Object.keys(this._joints).length;
			for (let i = 1; i < jointsListLength; i++) {
				let jointVector = new DSMath.Vector3D();
				jointVector.setFromArray(xrHandTransformArray[i]);

				let jointTransform = new DSMath.Transformation();

				let jointName = this._jointsName[i];
				jointTransform.setVector(jointVector);
				var appliedTransform = ThreeDS.Mathematics.multiplyTransfo(
					this._XRMgr._IVTechnoToV6Transform,
					jointTransform
				);
				var transformInInterArea = ThreeDS.Mathematics.multiplyTransfo(
					this._XRMgr.getInteractionArea().getTransform(),
					appliedTransform
				);

				this._joints[jointName] = transformInInterArea;
			}

			//this.displayJointDebug();
		}

		//HANDLING the pose of the hand
		if (xrGesturesArray.length > 0) {
			//save status of each pose, dispatch events for each change of status
			//OpenPalmPose, Pinch2Strength, Pinch5Strength, GrabStrength, PointingPose
			let posesListLength = Object.keys(this._poses).length;
			for (let i = 0; i < posesListLength; i++) {
				let poseName = this._posesName[i];
				if (!poseName) continue; // check pose exist

				//get status of pose
				const isGestureActive = xrGesturesArray[i] === 1;
				const wasPoseActive = this._poses[poseName];

				//check for changement of pose status
				if (isGestureActive && !wasPoseActive) {
					//save new status
					this._poses[poseName] = true;

					//---dispatch PoseBeginEvent on self actor
					if (poseName === 'xrPinch2Bool') {
						//WARN supporting only pinch for now
						this.dispatchEvent(new STU.XRHandPinchBeginEvent());
					}
				} else if (!isGestureActive && wasPoseActive) {
					//save new status
					this._poses[poseName] = false;

					//---dispatch PoseEndEvent on self actor
					if (poseName === 'xrPinch2Bool') {
						//WARN supporting only pinch for now
						this.dispatchEvent(new STU.XRHandPinchEndEvent());
					}
				}
			}
		}

		//update the pos of the xrHand actor
		XRDeviceActor.prototype.onExecute.call(this);
	};

	/**
	 * Function to get the transform of a specific joint.
	 * @method
	 * @private
	 */
	XRHandActor.prototype.getJoint = function (iJointNameEnum) {
		//WARN!! joints transform are in world relative, need to set it relative to the interaction area
		let jointsListLength = Object.keys(this._joints).length;
		if (0 <= iJointNameEnum && iJointNameEnum < jointsListLength) {
			let jointName = this._jointsName[iJointNameEnum];
			return this._joints[jointName];
		} else {
			console.warn('Your enum input is not supported to get a hand joint.');
		}
	};

	/**
	 * Function to display the joints FOR DEBUG.
	 * @method
	 * @private
	 */
	XRHandActor.prototype.displayJointDebug = function () {
		var rm = RenderManager.getInstance();
		var debugSphere = { lifetime: 0, color: new STU.Color(255, 0, 0) }; //red

		//start at 0 because the first eleme is a transform of the wrist, the rest are vectors
		let jointsListLength = Object.keys(this._joints).length;
		for (let i = 0; i < jointsListLength; i++) {
			let jointName = this._jointsName[i];
			rm.createSphere(this._joints[jointName], 10, debugSphere);
		}
	};

	// Expose in STU namespace.
	STU.XRHandActor = XRHandActor;

	return XRHandActor;
});

define('StudioIV/StuXRHandActor', ['DS/StudioIV/StuXRHandActor'], function (
	XRHandActor
) {
	'use strict';

	return XRHandActor;
});
