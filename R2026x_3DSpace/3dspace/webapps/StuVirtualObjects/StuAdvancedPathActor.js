define('DS/StuVirtualObjects/StuAdvancedPathActor', ['DS/StuCore/StuContext', 'DS/MathematicsES/MathsDef', 'DS/StuVirtualObjects/StuPathActor', 'DS/StuVirtualObjects/StuPathImpl_Advanced'], function (STU, DSMath, PathActor, PathImpl_Advanced) {
	'use strict';

	/**
	* Describes an advanced path object.
	*
	* @exports AdvancedPathActor
	* @class
	* @constructor
	* @noinstancector
	* @public
	* @extends STU.PathActor
	* @memberof STU
	* @alias STU.AdvancedPathActor
	*/
	var AdvancedPathActor = function () {
		PathActor.call(this);

		/**
		 * Width in mm of this path.
		 *
		 * @member
		 * @instance
		 * @name width
		 * @public
		 * @type {number}
		 * @memberof STU.AdvancedPathActor
		 */
		Object.defineProperty(this, 'width', {
			enumerable: true,
			configurable: true,
			get: function () {
				return this._width;
			},
			set: function (value) {
				value = Math.abs(value); // IR-1383566
				this._width = value;
				// call binding to refresh visu
				if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
					this.VIAIIxpVirtualPath.SetWidth(value);
				}
			},
		});

		/**
		 * Closed state of this path: a closed path loops from last control point back to first control point.
		 *
		 * @member
		 * @instance
		 * @name closed
		 * @public
		 * @type {boolean}
		 * @memberof STU.AdvancedPathActor
		 */
		Object.defineProperty(this, 'closed', {
			enumerable: true,
			configurable: true,
			get: function () {
				return this._closed;
			},
			set: function (value) {
				this._closed = value;
				if (this.myAdvancedPathImpl) {
					// at init, myAdvancedPathImpl has not been created
					this.myAdvancedPathImpl.SetClosed(this._closed);
					this.myAdvancedPathImpl.CheckValidity();
					this.myAdvancedPathImpl.UpdateCurve();
				}
				// call binding to refresh visu
				if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
					this.VIAIIxpVirtualPath.SetClosed(value);
				}
			},
		});
	};

	//////////////////////////////////////////////////////////////////////////////
	//                           Prototype definitions                          //
	//////////////////////////////////////////////////////////////////////////////
	AdvancedPathActor.prototype = new PathActor();
	AdvancedPathActor.prototype.constructor = AdvancedPathActor;

	/**
	 * An object collecting the information relative to a AdvancedPathActor control point.
	 * This information is expressed in a specific referential which should be associated to the control point information when gettin / setting control point information.
	 * @public
	 * @typedef {Object} STU.ControlPoint
	 * @property {DSMath.Point} position - instance representing the {X,Y,Z} coordinates of the control point in model unit (mm)
	 * @property {DSMath.Vector3D} inTangent - instance representing the { X, Y, Z } coordinates of the incoming tangent in model unit(mm)
	 * @property {DSMath.Vector3D} outTangent - instance representing the { X, Y, Z } coordinates of the outgoing tangent in model unit(mm)
	 * @property {DSMath.Vector3D} up - instance representing the { X, Y, Z } coordinates of the upward direction in model unit(mm)
	 * @property {number} roll - integer value for up direction rolls in the section following this control point
	 * @property {STU.AdvancedPathActor.ETangentMode} mode - tangent computation mode of this control point
	 * @example
	 *
	 * // creating a discontinuous tangency (right angle) at control point 4 of a path:
	 * var MyPath = this.getActor();
	 * var P = this.path.getControlPoint(4);
	 * P.inTangent = new DSMath.Vector3D(0,2000,0);
	 * P.outTangent = new DSMath.Vector3D(5000, 0, 0);
	 * P.mode = STU.AdvancedPathActor.ETangentMode.eFree;
	 * MyPath.setControlPoint(4,P);
	 *
	 */

	/**
	 * Synchronises JS impl with C++ impl.
	 *
	 * @method
	 * @private
	 */
	AdvancedPathActor.prototype.initFromModel = function () {
		var LeftTgts = [];
		var RightTgts = [];
		var CtrlPts = [];
		var Ups = [];
		var Rolls = [];
		var Modes = [];
		var closed = false;

		for (var p = 0; p < this.ctrlPts.length; p++) {
			var Quat = new DSMath.Quaternion(
				this.ctrlPts[p].ctrlPtQuaternion[0],
				this.ctrlPts[p].ctrlPtQuaternion[1],
				this.ctrlPts[p].ctrlPtQuaternion[2],
				this.ctrlPts[p].ctrlPtQuaternion[3]
			);
			var W = new DSMath.Vector3D(0.0, 0.0, 1.0);
			var V = new DSMath.Vector3D(0.0, 1.0, 0.0);
			var U = new DSMath.Vector3D(1.0, 0.0, 0.0);
			W.applyQuaternion(Quat);
			V.applyQuaternion(Quat);
			U.applyQuaternion(Quat);

			CtrlPts[p] = new DSMath.Point(
				this.ctrlPts[p].ctrlPtPositions[0],
				this.ctrlPts[p].ctrlPtPositions[1],
				this.ctrlPts[p].ctrlPtPositions[2]
			);

			var OutU = U.clone().multiplyScalar(this.ctrlPts[p].ctrlPtOutTangent[0]);
			var OutV = V.clone().multiplyScalar(this.ctrlPts[p].ctrlPtOutTangent[1]);
			RightTgts[p] = new DSMath.Vector3D(OutU.x + OutV.x, OutU.y + OutV.y, OutU.z + OutV.z);
			var InU = U.clone().multiplyScalar(this.ctrlPts[p].ctrlPtInTangent[0]);
			var InV = V.clone().multiplyScalar(this.ctrlPts[p].ctrlPtInTangent[1]);
			LeftTgts[p] = new DSMath.Vector3D(InU.x + InV.x, InU.y + InV.y, InU.z + InV.z);

			Ups[p] = W.clone();
			Rolls[p] = this.ctrlPts[p].ctrlPtRoll;
			Modes[p] = this.ctrlPts[p].ctrlPtAutoComputeTangents;
			closed = this.closed;
		}

		// myAdvancedPathImpl should work in most local referrential (this) to avoid numerical imprecision (planets scenario)
		/*this.VIAIIxpVirtualPath.GetTangents(this.CATIMovable, LeftTgts, RightTgts);
		this.VIAIIxpVirtualPath.GetCtrlPoints(this.CATIMovable, CtrlPts);
		this.VIAIIxpVirtualPath.GetUps(Ups);
		this.VIAIIxpVirtualPath.GetRolls(Rolls);
		this.VIAIIxpVirtualPath.GetModes(Modes);
		closed = this.VIAIIxpVirtualPath.GetClosed();
		// convert CtrlPts to points (instead of vectors)
		for (var i = 0; i < CtrlPts.length; i++) {		
			CtrlPts[i] = new DSMath.Point(CtrlPts[i].x, CtrlPts[i].y, CtrlPts[i].z);
		}*/

		this.myAdvancedPathImpl = new PathImpl_Advanced();
		this.myAdvancedPathImpl.SetData(CtrlPts, RightTgts, LeftTgts, Ups, Rolls, Modes, closed);

		this.myAdvancedPathImpl.CheckValidity();
		this.myAdvancedPathImpl.BuildCurve();
		this.interpolationType = 2;
		this.InitFromModel = true;
	};

	/**
	 * Returns the up vector on the path at the point's coordinate of this STU.PathActor corresponding to the given length ratio (see evaluatePosition).
	 * The returned up vector is normalized.
	 * @method
	 * @public
	 * @param {number} iRatio curvilinear distance from start of Path express in ratio of length within the range [0,1]
	 * @param {STU.Referential} [iRef] Referential in which to interpret the output vector
	 * @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates in model unit (mm)
	 */
	AdvancedPathActor.prototype.evaluateUp = function (iRatio, iRef) {
		this.checkInit();
		var oVec = new DSMath.Vector3D();

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.AdvancedPathActor.evaluateUp] ratio of length not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
			//iRatio = ((iRatio % 1)+1)%1;
		}

		var PathTransfo = this.getTransform(iRef);
		var V = new DSMath.Vector3D();
		V = this.myAdvancedPathImpl.GetUpAtCurvilinearAbs(iRatio);
		V.applyTransformation(PathTransfo);
		oVec = V.clone();
		return oVec;
	};

	/**
	 * Retrieves the position of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {STU.Referential} [iRef] Referential in which to retrieve the position
	 * @return {DSMath.Point} instance representing the {X,Y,Z} coordinates of the control point in model unit (mm)
	 */
	AdvancedPathActor.prototype.getControlPointPosition = function (iIndex, iRef) {
		var CtrlPtInPath = this.myAdvancedPathImpl.GetCtrlPtPos(iIndex);
		// convert output to iRef referential
		var PathTransfoInRef = this.getTransform(iRef);
		var CtrlPtInRef = CtrlPtInPath.clone();
		CtrlPtInRef.applyTransformation(PathTransfoInRef);
		return CtrlPtInRef;
	};

	/**
	 * Modifies the position of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {DSMath.Point} iPos representing the {X,Y,Z} coordinates in model unit (mm) of the control point position
	 * @param {STU.Referential} [iRef] referential in which to interpret the input position
	 */
	AdvancedPathActor.prototype.setControlPointPosition = function (iIndex, iPos, iRef) {
		// convert input to point if it's a vector
		var CtrlPtInRef = new DSMath.Point(iPos.x, iPos.y, iPos.z);

		// convert input to path referential
		var PathTransfoInRef = this.getTransform(iRef);
		var RefTransfoInPath = PathTransfoInRef.getInverse();
		var CtrlPtInPath = CtrlPtInRef.clone();
		CtrlPtInPath.applyTransformation(RefTransfoInPath);

		// call binding to refresh visu
		if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
			var CtrlPts = [];
			this.VIAIIxpVirtualPath.GetCtrlPoints(this.CATIMovable, CtrlPts);
			CtrlPts[iIndex] = CtrlPtInPath;
			this.VIAIIxpVirtualPath.SetCtrlPoints(CtrlPts);
		}

		// refresh JS impl
		this.myAdvancedPathImpl.SetCtrlPtPos(iIndex, CtrlPtInPath);
		this.myAdvancedPathImpl.CheckValidity();
		this.myAdvancedPathImpl.UpdateCurve();
	};

	/**
	 * Retrieves the incoming tangent of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {STU.Referential} [iRef] Referential in which to retrieve the tangent
	 * @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates of the tangent in model unit (mm)
	 */
	AdvancedPathActor.prototype.getControlPointInTangent = function (iIndex, iRef) {
		var LeftTangentInPath = this.myAdvancedPathImpl.GetCtrlPtLeftT(iIndex);
		// convert output to iRef referential
		var PathTransfoInRef = this.getTransform(iRef);
		var LeftTangentInRef = LeftTangentInPath.clone();
		LeftTangentInRef.applyTransformation(PathTransfoInRef);
		return LeftTangentInRef;
	};

	/**
	 * Retrieves the outgoing tangent of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {STU.Referential} [iRef] Referential in which to retrieve the tangent
	 * @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates of the tangent in model unit (mm)
	 */
	AdvancedPathActor.prototype.getControlPointOutTangent = function (iIndex, iRef) {
		var RightTangentInPath = this.myAdvancedPathImpl.GetCtrlPtRightT(iIndex);
		// convert output to iRef referential
		var PathTransfoInRef = this.getTransform(iRef);
		var RightTangentInRef = RightTangentInPath.clone();
		RightTangentInRef.applyTransformation(PathTransfoInRef);
		return RightTangentInRef;
	};

	/**
	 * Modifies the tangent vectors of a control point of this path.
	 * Tangents are expected to adhere to the current tangent computation mode restrictions,
	 * if not, they are re-computed as best we can using the provided inputs.
	 * @see: AdvancedPathActor.ETangentMode
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {DSMath.Vector3D} iInTgt representing the {X,Y,Z} coordinates in model unit (mm) of the incoming tangent at control point
	 * @param {DSMath.Vector3D} iOutTgt representing the {X,Y,Z} coordinates in model unit (mm) of the outgoing tangent at control point
	 * @param {STU.Referential} [iRef] referential in which to interpret the input tangent vectors
	 */
	AdvancedPathActor.prototype.setControlPointTangents = function (iIndex, iInTgt, iOutTgt, iRef) {
		// convert input to path referential
		var PathTransfoInRef = this.getTransform(iRef);
		var RefTransfoInPath = PathTransfoInRef.getInverse();
		var InTgtInPath = iInTgt.clone();
		InTgtInPath.applyTransformation(RefTransfoInPath);
		var OutTgtInPath = iOutTgt.clone();
		OutTgtInPath.applyTransformation(RefTransfoInPath);

		// call binding to refresh visu
		if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
			var LeftTgts = [];
			var RightTgts = [];
			this.VIAIIxpVirtualPath.GetTangents(this.CATIMovable, LeftTgts, RightTgts);
			LeftTgts[iIndex] = InTgtInPath;
			RightTgts[iIndex] = OutTgtInPath;
			this.VIAIIxpVirtualPath.SetTangents(LeftTgts, RightTgts);
		}

		// refresh JS impl
		this.myAdvancedPathImpl.SetCtrlPtLeftT(iIndex, InTgtInPath);
		this.myAdvancedPathImpl.SetCtrlPtRightT(iIndex, OutTgtInPath);
		this.myAdvancedPathImpl.CheckValidity();
		this.myAdvancedPathImpl.UpdateCurve();
	};

	/**
	 * Retrieves the upward normalized direction of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {STU.Referential} [iRef] referential in which to retrieve the up direction
	 * @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates of the up direction in model unit (mm)
	 */
	AdvancedPathActor.prototype.getControlPointUp = function (iIndex, iRef) {
		var UpInPath = this.myAdvancedPathImpl.GetCtrlPtUp(iIndex);
		// convert output to iRef referential
		var PathTransfoInRef = this.getTransform(iRef);
		var UpInRef = UpInPath.clone();
		UpInRef.applyTransformation(PathTransfoInRef);
		return UpInRef;
	};

	/**
	 * Modifies the up direction of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {DSMath.Vector3D} iUp representing the {X,Y,Z} coordinates in model unit (mm) of the control point up direction
	 * @param {STU.Referential} [iRef] referential in which to interpret the input vector
	 */
	AdvancedPathActor.prototype.setControlPointUp = function (iIndex, iUp, iRef) {
		// convert input to path referential
		var PathTransfoInRef = this.getTransform(iRef);
		var RefTransfoInPath = PathTransfoInRef.getInverse();
		var UpInPath = iUp.clone();
		UpInPath.applyTransformation(RefTransfoInPath);
		UpInPath.normalize();

		// call binding to refresh visu
		if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
			var Ups = [];
			this.VIAIIxpVirtualPath.GetUps(Ups);
			Ups[iIndex] = UpInPath;
			this.VIAIIxpVirtualPath.SetUps(Ups);
		}

		// refresh JS impl
		this.myAdvancedPathImpl.SetCtrlPtUp(iIndex, UpInPath);
		this.myAdvancedPathImpl.CheckValidity();
		this.myAdvancedPathImpl.UpdateCurve();
	};

	/**
	 * Retrieves the up direction roll in the section following a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @return {number} integer value for the roll
	 */
	AdvancedPathActor.prototype.getControlPointRoll = function (iIndex) {
		return this.myAdvancedPathImpl.GetCtrlPtRoll(iIndex);
	};

	/**
	 * Sets the up direction roll in the section following a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {number} iRoll integer value for the roll
	 */
	AdvancedPathActor.prototype.setControlPointRoll = function (iIndex, iRoll) {
		iRoll = Math.round(iRoll);

		// call binding to refresh visu
		if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
			var Rolls = [];
			this.VIAIIxpVirtualPath.GetRolls(Rolls);
			Rolls[iIndex] = iRoll;
			this.VIAIIxpVirtualPath.SetRolls(Rolls);
		}

		// refresh JS impl
		this.myAdvancedPathImpl.SetCtrlPtRoll(iIndex, iRoll);
		this.myAdvancedPathImpl.CheckValidity();
		this.myAdvancedPathImpl.UpdateCurve();
	};

	/**
	 * Retrieves the tangent computation mode of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @return {STU.AdvancedPathActor.ETangentMode} enum value for the mode
	 */
	AdvancedPathActor.prototype.getControlPointMode = function (iIndex) {
		var value = this.myAdvancedPathImpl.GetCtrlPtMode(iIndex);
		return value;
		//return this.getEnumKeyByValue(value);
	};

	/**
	 * Sets the tangent computation mode of a control point of this path.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {STU.AdvancedPathActor.ETangentMode} iMode value for the mode
	 */
	AdvancedPathActor.prototype.setControlPointMode = function (iIndex, iMode) {
		// call binding to refresh visu
		if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
			var Modes = [];
			this.VIAIIxpVirtualPath.GetModes(Modes);
			Modes[iIndex] = iMode;
			this.VIAIIxpVirtualPath.SetModes(Modes);
		}

		// refresh JS impl
		this.myAdvancedPathImpl.SetCtrlPtMode(iIndex, iMode);
		this.myAdvancedPathImpl.CheckValidity();
		this.myAdvancedPathImpl.UpdateCurve();
	};

	/**
	 * Retrieves all the information relative to a control point of this path
	 * this information is expressed in the referential iRef.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {STU.Referential} [iRef] referential in which to interpret the control point information
	 * @return {STU.ControlPoint} control point information
	 */
	AdvancedPathActor.prototype.getControlPoint = function (iIndex, iRef) {
		var oCtrlPt = {};
		oCtrlPt.position = this.getControlPointPosition(iIndex, iRef);
		oCtrlPt.inTangent = this.getControlPointInTangent(iIndex, iRef);
		oCtrlPt.outTangent = this.getControlPointOutTangent(iIndex, iRef);
		oCtrlPt.up = this.getControlPointUp(iIndex, iRef);
		oCtrlPt.roll = this.getControlPointRoll(iIndex);
		oCtrlPt.mode = this.getControlPointMode(iIndex);
		return oCtrlPt;
	};

	/**
	 * Sets all the information relative to a control point of this path
	 * this information is expressed in the referential iRef.
	 * @method
	 * @public
	 * @param {number} iIndex index of the control point (starting at 0)
	 * @param {STU.ControlPoint} control point information
	 * @param {STU.Referential} [iRef] referential in which to interpret the control point information
	 */
	AdvancedPathActor.prototype.setControlPoint = function (iIndex, iCtrlPt, iRef) {
		// convert input to path referential
		var PathTransfoInRef = this.getTransform(iRef);
		var RefTransfoInPath = PathTransfoInRef.getInverse();

		var PosInPath = iCtrlPt.position.clone();
		PosInPath.applyTransformation(RefTransfoInPath);
		var InTgtInPath = iCtrlPt.inTangent.clone();
		InTgtInPath.applyTransformation(RefTransfoInPath);
		var OutTgtInPath = iCtrlPt.outTangent.clone();
		OutTgtInPath.applyTransformation(RefTransfoInPath);
		var UpInPath = iCtrlPt.up.clone();
		UpInPath.applyTransformation(RefTransfoInPath);
		UpInPath.normalize();

		var CtrlPtInPath = {};
		CtrlPtInPath.position = PosInPath;
		CtrlPtInPath.inTangent = InTgtInPath;
		CtrlPtInPath.outTangent = OutTgtInPath;
		CtrlPtInPath.up = UpInPath;
		CtrlPtInPath.roll = iCtrlPt.roll;
		CtrlPtInPath.mode = iCtrlPt.mode;

		// call binding to refresh visu
		if (this.VIAIIxpVirtualPath !== null && this.VIAIIxpVirtualPath !== undefined) {
			this.VIAIIxpVirtualPath.SetCtrlPointData(iIndex, CtrlPtInPath);
		}

		// refresh JS impl
		this.myAdvancedPathImpl.SetCtrlPtMode(iIndex, iCtrlPt.mode);
		this.myAdvancedPathImpl.SetCtrlPtPos(iIndex, PosInPath);
		this.myAdvancedPathImpl.SetCtrlPtLeftT(iIndex, InTgtInPath);
		this.myAdvancedPathImpl.SetCtrlPtRightT(iIndex, OutTgtInPath);
		this.myAdvancedPathImpl.SetCtrlPtUp(iIndex, UpInPath);
		this.myAdvancedPathImpl.SetCtrlPtRoll(iIndex, iCtrlPt.roll);
		this.myAdvancedPathImpl.CheckValidity();
		this.myAdvancedPathImpl.UpdateCurve();
	};

	/**
	 * Retrieves the width of this path.
	 * @method
	 * @public
	 * @return {number} width in mm of this path
	 */
	AdvancedPathActor.prototype.getWidth = function () {
		return this.width;
	};
	/**
	 * Sets the width of this path.
	 * @method
	 * @public
	 * @param {number} width in mm of this path
	 */
	AdvancedPathActor.prototype.setWidth = function (iWidth) {
		this.width = iWidth;
	};

	/**
	 * Retrieves the closed state of this path.
	 * @method
	 * @public
	 * @return {boolean} closed state of this path
	 */
	AdvancedPathActor.prototype.getClosed = function () {
		return this.closed;
	};
	/**
	 * Sets the closed state of this path.
	 * @method
	 * @public
	 * @param {boolean} iClosed closed state of this path
	 */
	AdvancedPathActor.prototype.setClosed = function (iClosed) {
		this.closed = iClosed;
	};

	/**
	 * Enumeration of possible tangency computations at control points of a path.
	 *
	 * @enum {number}
	 * @public
	 * @readonly
	 */
	AdvancedPathActor.ETangentMode = {
		/**
		 * Type is not defined.
		 * */
		eUndefined: 0,
		/**
		 * Tangents are automatically computed based on relative positions of next and previous control points to achieve a natural looking smoothness.
		 * */
		eAutoSmooth: 1,
		/**
		 * Right and left tangents are colinear, there are no additional constraints on the lengths or directions of the tangents.
		 * */
		eSmooth: 2,
		/**
		 * Right and left tangents are colinear and of same length, there are no constraints on the directions of the tangents.
		 * */
		eSymmetrical: 3,
		/**
		 * The right tangent points toward the next control point, the left tangent points towards the previous control point, tangents at the extremities of a path section are colinear and equal: this section is rectilinear.
		 * */
		eLinear: 4,
		/**
		 * No constraints on the tangents, if left and right tangents are not colinear.
		 * */
		eFree: 5,
		/**
		 * @private
		 * */
		eDegeneratedLeft: 6, // Treat this point like start point (quadratic curve).
		/**
		 * @private
		 * */
		eDegeneratedRight: 7, // Treat this point like an end point (quadratic curve).
		/**
		 * @private
		 * */
		eIgnored: 8, // This point is ignore in the control point sequence.
	};




	//////////////////////////////////////////////////////////////////////////////
	//                            STU expositions.                              //
	//////////////////////////////////////////////////////////////////////////////

	// Expose only those entities in STU namespace.
	STU.AdvancedPathActor = AdvancedPathActor;

	return AdvancedPathActor;
});

define('StuVirtualObjects/StuAdvancedPathActor', ['DS/StuVirtualObjects/StuAdvancedPathActor'], function (AdvancedPathActor) {
	'use strict';

	return AdvancedPathActor;
});
