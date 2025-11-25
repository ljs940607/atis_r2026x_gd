define('DS/StuVirtualObjects/StuPathActor', ['DS/StuCore/StuContext', 'DS/MathematicsES/MathsDef', 'DS/StuRenderEngine/StuActor3D', 'DS/StuVirtualObjects/StuPathImpl_Cubic', 'DS/StuVirtualObjects/StuPathImpl_Linear'], function (STU, DSMath, Actor3D, PathImpl_Cubic, PathImpl_Linear) {
	'use strict';

	/**
	* Describe a path object.
	*
	* @exports PathActor
	* @class
	* @constructor
	* @noinstancector
	* @public
	* @extends STU.Actor3D
	* @memberof STU
	* @alias STU.PathActor
	*/
	var PathActor = function () {
		Actor3D.call(this);

		this.VIAIIxpVirtualPath;

		//
		// A path has no color
		// This Object.defineProperty is intended to overwrite Actor3D.color
		//
		Object.defineProperty(this, 'color', {
			enumerable: true,
			configurable: true,
			get: function () {
				return new STU.Color(0, 0, 0);
			},
			set: function () { }
		});
	};

	//////////////////////////////////////////////////////////////////////////////
	//                           Prototype definitions                          //
	//////////////////////////////////////////////////////////////////////////////
	PathActor.prototype = new Actor3D();
	PathActor.prototype.constructor = PathActor;


	/**
	 * Returns the length of this STU.PathActor.
	 *
	 * @method
	 * @public
	 * @return {number} The length value in model unit (mm)
	 * @param {STU.Referential} [iRef] Referential in which to interpret the output length
	 */
	PathActor.prototype.getLength = function (iRef) {
		this.checkInit();
		var LocalLength = 0;
		if (this.interpolationType === 1) {
			LocalLength = this.myCubicPathImpl.CubicPathLength;
		}
		else if (this.interpolationType === 2) {
			LocalLength = this.myAdvancedPathImpl._PathLength;
		}
		else {
			LocalLength = this.myLinearPathImpl.LinearPathLength;
		}
		var PathTransfo = this.getTransform(iRef);
		var PathScale = Math.cbrt(PathTransfo.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
		return LocalLength * Math.abs(PathScale);
	};

	/**
	 * Returns the point's coordinate of this STU.PathActor corresponding to the given length ratio.
	 * If you want the point at the curvilinear distance d from the start of the path, you must enter as parameter value:
	 *   iRatio = d/L where L = total length of path given by getLength function
	 * @method
	 * @public
	 * @param {number} iRatio curvilinear distance from start of Path express in ratio of length within the range [0,1]
	 * @param {STU.Referential} [iRef] Referential in which to interpret the output position
	 * @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates in model unit (mm)
	 */
	PathActor.prototype.getValue = function (iRatio, iRef) {
		var oPoint = this.evaluatePosition(iRatio, iRef);
		// return a vector instead of point. This is a problem as transforms will not apply correctly to the position interpreted as a vector.
		var oVec = new DSMath.Vector3D();
		oVec.x = oPoint.x;
		oVec.y = oPoint.y;
		oVec.z = oPoint.z;
		return oVec;
	};

	/**
	 * Returns an array of point corresponding to the discretization of this STU.PathActor
	 * iRatio is the distance separating 2 contiguous points, expressed as a ratio of the Length of the path given by getLength function 
	 * @method
	 * @public
	 * @param {number} iRatio curvilinear distance increment between 2 Points express in ratio of path's length within the range [0,1]
	 * @param {STU.Referential} [iRef] Referential in which to interpret the output positions
	 * @return {Array.<DSMath.Vector3D>} array of DSMath.Vector3D corresponding to the discretization Point (coordinates in model unit (mm))
	 */
	PathActor.prototype.getDiscretization = function (iRatio, iRef) {
		var oPoints = [];

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.PathActor.getDiscretization] lenght ratio increment not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
		}
		var p = 0;
		var i = 0;
		while (p < 1) {
			oPoints[i] = this.getValue(p, iRef);
			p += iRatio;
			i++;
		}
		oPoints[i] = this.getValue(1.0, iRef);
		return oPoints;
	};

	/**
	 * Process to execute when this STU.PathActor is activating.
	 *
	 * @method
	 * @private
	 */
	PathActor.prototype.onActivate = function (oExceptions) {
		this.checkInit();
		Actor3D.prototype.onActivate.call(this, oExceptions);
	};

	/**
	 * Process to execute when this STU.PathActor is deactivating.
	 *
	 * @method
	 * @private
	 */
	PathActor.prototype.onDeactivate = function () {
		Actor3D.prototype.onDeactivate.call(this);
	};





	//////////////////////////////////////////////////////////////////////////////
	//                            Path evolutions: PUBLIC                      //
	//////////////////////////////////////////////////////////////////////////////


	/**
	* Returns the point's coordinate of this STU.PathActor corresponding to the given length ratio.
	 * if you want the point at the curvilinear distance d from the start of the path, you must enter as parameter value:
	 *   iRatio = d/L where L = total length of path given by getLength function
	* @method
	* @public
	* @param {number} iRatio curvilinear distance from start of Path express in ratio of length within the range [0,1]
	* @param {STU.Referential} [iRef] Referential in which to interpret the output position
	* @return {DSMath.Point} instance representing the {X,Y,Z} coordinates in model unit (mm)
	*/
	PathActor.prototype.evaluatePosition = function (iRatio, iRef) {
		this.checkInit();
		var oPoint = new DSMath.Point();

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.PathActor.getValue] ratio of length not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
		}

		var PathTransfo = this.getTransform(iRef);

		var P = new DSMath.Point();
		if (this.interpolationType === 1) { P = this.myCubicPathImpl.getPointAtCurvilinearAbs(iRatio); }
		else if (this.interpolationType === 2) { P = this.myAdvancedPathImpl.GetPointAtCurvilinearAbs(iRatio); }
		else { P = this.myLinearPathImpl.getPointAtCurvilinearAbs(iRatio); }

		P.applyTransformation(PathTransfo);
		oPoint = P.clone();
		return oPoint;
	};


	/**
	* Returns the tangent to the path at the point's coordinate of this STU.PathActor corresponding to the given length ratio (see evaluatePosition)
	* The returned tangent is normalized
	* @method
	* @public
	* @param {number} iRatio curvilinear distance from start of Path express in ratio of length within the range [0,1]
	* @param {STU.Referential} [iRef] Referential in which to interpret the output vector
	* @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates in model unit (mm)
	*/
	PathActor.prototype.evaluateTangent = function (iRatio, iRef) {
		this.checkInit();
		var oVec = new DSMath.Vector3D();

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.PathActor.evaluateTangent] ratio of length not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
		}

		var PathTransfo = this.getTransform(iRef);

		var V = new DSMath.Vector3D();
		if (this.interpolationType === 1) { V = this.myCubicPathImpl.getTangentAtCurvilinearAbs(iRatio); }
		else if (this.interpolationType === 2) { V = this.myAdvancedPathImpl.GetTangentAtCurvilinearAbs(iRatio); }
		else { V = this.myLinearPathImpl.getTangentAtCurvilinearAbs(iRatio); }

		V.applyTransformation(PathTransfo);
		oVec = V.clone();
		return oVec;
	};

	/**
	* Returns the curvature of the path at the point's coordinate of this STU.PathActor corresponding to the given length ratio (see evaluatePosition)
	* The returned vector is the derivative of the normed tangent. 
	* Its norm N is related to the osculating circle (best tangent fit) of radius R and the length of the curve L by the relation: R = L/(N*N)
	* use evaluateCurvatureCenter to retrieve the center of the osculating circle (best tangent fit) at a given point
	* @method
	* @public
	* @param {number} iRatio curvilinear distance from start of Path express in ratio of length within the range [0,1]
	* @param {STU.Referential} [iRef] Referential in which to interpret the output vector
	* @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates in model unit (mm)
	*/
	PathActor.prototype.evaluateCurvature = function (iRatio, iRef) {
		this.checkInit();
		var oVec = new DSMath.Vector3D();

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.PathActor.evaluateCurvature] ratio of length not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
		}

		var PathTransfo = this.getTransform(iRef);

		var C = new DSMath.Vector3D();
		if (this.interpolationType === 1) { C = this.myCubicPathImpl.getCurvatureAtCurvilinearAbs(iRatio); }
		else if (this.interpolationType === 2) { C = this.myAdvancedPathImpl.GetCurvatureAtCurvilinearAbs(iRatio); }
		else { C = this.myLinearPathImpl.getCurvatureAtCurvilinearAbs(iRatio); }
		C.applyTransformation(PathTransfo);
		oVec = C.clone();
		return oVec;
	};

	/**
	* Returns the center of the osculating circle (best tangent fit) at at the point's coordinate of this STU.PathActor corresponding to the given length ratio (see evaluatePosition)
	* @method
	* @public
	* @param {number} iRatio curvilinear distance from start of Path express in ratio of length within the range [0,1]
	* @param {STU.Referential} [iRef] Referential in which to interpret the output point
	* @return {DSMath.Point} instance representing the {X,Y,Z} coordinates in model unit (mm)
	*/
	PathActor.prototype.evaluateCurvatureCenter = function (iRatio, iRef) {
		this.checkInit();
		var oPoint = new DSMath.Point();

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.PathActor.evaluateCurvatureCenter] ratio of length not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
		}

		var PathTransfo = this.getTransform(iRef);

		var C = new DSMath.Vector3D();
		var P = new DSMath.Point();
		if (this.interpolationType >= 1) {
			if (this.interpolationType == 1) {
				C = this.myCubicPathImpl.getCurvatureAtCurvilinearAbs(iRatio);
				P = this.myCubicPathImpl.getPointAtCurvilinearAbs(iRatio);
			}
			else if (this.interpolationType == 2) {
				C = this.myAdvancedPathImpl.GetCurvatureAtCurvilinearAbs(iRatio);
				P = this.myAdvancedPathImpl.GetPointAtCurvilinearAbs(iRatio);
			}

			C.applyTransformation(PathTransfo);
			P.applyTransformation(PathTransfo);
			var N = C.squareNorm();
			var L = this.getLength();
			if (N === 0) { return null; }
			C = DSMath.Vector3D.multiplyScalar(C, L / N);
			oPoint = new DSMath.Point(P.x + C.x, P.y + C.y, P.z + C.z);
			return oPoint;
		}
		else { return null; }
	};


	/**
	* Returns the curvilinear distance from start of Path express in ratio of length within the range [0,1] corresponding to the point of the curve which is closest to iTarget
	* @method
	* @public
	* @param {DSMath.Vector3D | STU.Actor3D} iTarget Actor or 3D position vector. We want to find the closest path point to this Target. 
	*		If the target is an actor, its position (Actor.getPosition) is used as target 
	*		If the target is a point or a vector, its coordinates are interpreted in the referential of iRef
	* @param {STU.Referential} [iRef] Referential in which to interpret the input target if iTarget is a vector
	* @return {number} length ratio (between 0 and 1, directly usable in evaluatePosition evaluateTangent functions)
	*/
	PathActor.prototype.evaluateNearestRatio = function (iTarget, iRef) {
		this.checkInit();

		var TargetPos = new DSMath.Vector3D();
		if (iTarget instanceof Actor3D) {
			TargetPos = iTarget.getPosition();
		}
		else if (iTarget instanceof DSMath.Vector3D || iTarget instanceof DSMath.Point) {
			TargetPos = iTarget.clone();
		}
		else {
			console.log('[STU.PathActor.evaluateNearestRatio] given iTarget is neither Actor3D nor a DSMath.Vector3D / DSMath.Point');
			throw new TypeError('iTarget argument is invalid');
		}

		var PathTransfo = this.getTransform(iRef);
		var InvPathTransfo = PathTransfo.getInverse();

		var LocalTargetPos = new DSMath.Point(TargetPos.x, TargetPos.y, TargetPos.z);
		LocalTargetPos.applyTransformation(InvPathTransfo);

		var Impl = [];
		if (this.interpolationType === 1) { return this.myCubicPathImpl.getClosestToPointParam(LocalTargetPos); }
		else if (this.interpolationType === 2) {
			return this.myAdvancedPathImpl.GetClosestToPointParam(LocalTargetPos);
		}
		else { return this.myLinearPathImpl.getClosestToPointParam(LocalTargetPos); }
	};

	/**
* Returns the point on the path which is closest to iTarget
*
* @method
* @public
* @param {DSMath.Vector3D | DSMath.Point | STU.Actor3D} iTarget Actor or 3D position vector. We want to find the closest path point to this Target. If the target is an actor, its position (Actor.getPosition) is used as target
* @param {STU.Referential} [iRef] Referential in which to interpret the input target if iTarget is a vector and the output point
* @return {DSMath.Point} a point of the curve expressed in referrential iRef
*/
	PathActor.prototype.evaluateNearestPosition = function (iTarget, iRef) {
		var Ratio = this.evaluateNearestRatio(iTarget, iRef);
		var oPoint = this.evaluatePosition(Ratio, iRef);
		return oPoint;
	};



	//////////////////////////////////////////////////////////////////////////////
	//                            Path evolutions: PRIVATE                      //
	//////////////////////////////////////////////////////////////////////////////



	PathActor.prototype.checkInit = function () {
		if (this.InitFromModel !== true) {
			this.initFromModel();
		}
	};


	/**
	* synchronises JS impl with C++ impl
	*
	* @method
	* @private
	*/
	PathActor.prototype.initFromModel = function () {
		var LeftTgts = [];
		var RightTgts = [];
		var CtrlPts = [];

		// myCubicPathImpl and myLinearPathImpl should work in most local referrential (this) to avoid numerical imprecision (planets scenario)
		this.VIAIIxpVirtualPath.GetTangents(this.CATIMovable, LeftTgts, RightTgts);
		this.VIAIIxpVirtualPath.GetCtrlPoints(this.CATIMovable, CtrlPts);

		this.myCubicPathImpl = new PathImpl_Cubic();
		this.myLinearPathImpl = new PathImpl_Linear();
		this.myCubicPathImpl.setData(CtrlPts, RightTgts, LeftTgts);
		this.myLinearPathImpl.setData(CtrlPts);
		this.InitFromModel = true;
	};

	/**
	 * Returns all the control points of this STU.PathActor 
	 * @method
	 * @private
	 * @param {STU.Referential} [iRef] Referential in which to interpret the output points
	 * @return {Array.<DSMath.Point>} the positions of the path control points, expressed in referrential iRef
	 */
	PathActor.prototype.getControlPoints = function (iRef) {
		this.checkInit();
		var PathTransfo = this.getTransform(iRef);

		var oPoints = [];
		var sourcePts = [];
		var oPoints = [];
		if (this.interpolationType === 1) { sourcePts = this.myCubicPathImpl.Points; }
		else if (this.interpolationType === 2) { sourcePts = this.myAdvancedPathImpl._CtrlPts_Pos; }
		else { sourcePts = this.myLinearPathImpl.Points; }
		for (var p = 0; p < sourcePts.length; p++) {
			oPoints[p] = sourcePts[p].clone().applyTransformation(PathTransfo);
		}
		return oPoints;
	};

	/**
	 * Returns a single control points of this STU.PathActor identified by its index iPt (0..N-1)
	 * @method
	 * @private
	 * @param {number} [iPt] index of point
	 * @param {STU.Referential} [iRef] Referential in which to interpret the output point
	 * @return {DSMath.Point} the position of the path control point, expressed in referrential iRef
	 */
	PathActor.prototype.getControlPoint = function (iPt, iRef) {
		this.checkInit();

		var sourcePts = [];
		if (this.interpolationType === 1) { sourcePts = this.myCubicPathImpl.Points; }
		else if (this.interpolationType === 2) { sourcePts = this.myAdvancedPathImpl._CtrlPts_Pos; }
		else { sourcePts = this.myLinearPathImpl.Points; }

		if (iPt >= 0 && iPt < sourcePts.length) {

			var PathTransfo = this.getTransform(iRef);
			var oPoint = sourcePts[iPt].clone().applyTransformation(PathTransfo);
			return oPoint;
		}
		else {
			console.log('[STU.PathActor.getControlPoint] index out of bounds');
		}
	};


	/**
	* Sets all the control points of this STU.PathActor 
	* @method
	* @private
	* @param {Array.<DSMath.Point>} [iPos] the positions of the path control points, expressed in referrential iRef
	* @param {STU.Referential} [iRef] Referential in which to interpret the input points
	*/
	PathActor.prototype.setControlPoints = function (iPos, iRef) {
		this.VIAIIxpVirtualPath.SetCtrlPoints(iPos, iRef);
		this.initFromModel();
	};

	/**
	* Sets a single control points of this STU.PathActor identified by its index iPt (0..N-1)
	* @method
	* @private
	* @param {number} [iPt] index of point to set
	* @param {DSMath.Point} [iPos] the position of the path control point, expressed in referrential iRef
	* @param {STU.Referential} [iRef] Referential in which to interpret the input point
	*/
	PathActor.prototype.setControlPoint = function (iPt, iPos, iRef) {

		var oPoints = this.getControlPoints(iRef);

		if (iPt >= 0 && iPt < oPoints.length) {
			//oPoints[iPt] = iPos.clone();
			this.VIAIIxpVirtualPath.SetCtrlPoints(iRef, oPoints);
			this.initFromModel();
		}
		else {
			console.log('[STU.PathActor.setControlPoint] index out of bounds');
		}
	};


	/**
	* Returns the parameters on the curve for inflection points
	* @method
	* @private
	* @return {Array.<number>} an array of parameter values identifying inflection points
	*/
	PathActor.prototype.evaluateInflectionPoints = function () {
		this.checkInit();
		if (this.interpolationType === 1) { return this.myCubicPathImpl.getInflectionPoints(); }
		else if (this.interpolationType === 2) {
			return this.myAdvancedPathImpl.GetInflectionPoints();
		}
		else { return this.myLinearPathImpl.getInflectionPoints(); }
	};
















	//////////////////////////////////////////////////////////////////////////////
	//                            STU expositions.                              //
	//////////////////////////////////////////////////////////////////////////////

	// Expose only those entities in STU namespace.
	STU.PathActor = PathActor;

	return PathActor;
});

define('StuVirtualObjects/StuPathActor', ['DS/StuVirtualObjects/StuPathActor'], function (PathActor) {
	'use strict';

	return PathActor;
});
