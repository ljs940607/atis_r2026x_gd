define('DS/StuVirtualObjects/StuPathImpl_Cubic', ['DS/StuCore/StuContext', 'DS/MathematicsES/MathsDef'], function (STU, DSMath) {
	("use strict");

	/**
	 * Full JS path implementation
	 *
	 * @class
	 * @private
	 */
	var PathImpl_Cubic = function () {
		this.name = "PathImpl_Cubic";
		// the positions of the control points: 
		// array of N DSMath.Point
		this.Points = [];

		this.NbCtrlPts = 0;
		this.NbSections = 0;

		// the curvilinear abcissas of the control points on the curve
		// array of N numbers
		this.PointsCubicCurvilinearAbs = [];
		// right tangent at control point
		// array of N DSMath.Vector3D
		this.RightTans = [];
		// left tangent at control point
		// array of N DSMath.Vector3D
		this.LeftTans = [];
		// data generated to compute path positions and tangents
		this.CubicSectionData = [];
		// value computed for path length
		this.CubicPathLength = 0;
		// 20 is high precision
		this.CubicInversionApproxSamples = 20;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.setData = function (iPoints, iRightTgts, iLeftTgts) {
		this.Points = [];
		this.RightTans = [];
		this.LeftTans = [];
		this.CubicSectionData = [];


		this.Points = iPoints;
		this.RightTans = iRightTgts;
		this.LeftTans = iLeftTgts;

		this.NbCtrlPts = this.Points.length;
		this.NbSections = this.NbCtrlPts - 1;

		this.BuildCubicData();
	};



	/**
	 * builds :
	 * this.CubicSectionData [0 ... NbSections-1]
	 * this.PointsCubicCurvilinearAbs [0 ... NbCtrlPts-1]
	 *
	 * this.CubicSectionData[i] contains data relative to section i between points i and i+1
	 * it has tables defining discretized pieces of the function converting length parameter to natural cubic parameter
	 *
	 * SectionData._l[0 ...CubicInversionApproxSamples-1] if the curvilinear length along this cubic section at sampled points
	 * CubicSection[i] :
	 *
	 *     |---------------------------------------------------------------------|
	 *   CtrlPt i                                                           CtrlPt i+1
	 *     |-------------|-------------|-------------|-------------|-------------|
	 *    _l[0]=0       _l[1]       _l[2]                                       _l[CubicInversionApproxSamples-1]=Subsection length
	 *    _P1[0]        _P1[1]      _P1[2]
	 *    _P2[0]		   _P2[1]	   _P2[2]
	 *    _P3[0]		   _P3[1]	   _P3[2]
	 *    _P4[0]		   _P4[1]	   _P4[2]
	 *
	 * given a length along the path L, we want to find the natural parameter t that we can plug into the cubic spline polynoms of a given section (defined by points, tangents) to produce a path position.
	 * this is done by:
	 * 1/ finding the section in which L lands: FindCubicSectionParam
	 *		L lands between section delimited by points Output.LeftPointIndex and Output.RightPointIndex
	 *      Output.NormedParam a length-proportional parameter ranging from 0 for left point to 1 for right point
	 *      Output.LengthParam a true length parameter ranging from 0 for left point to (Subsection length) for right point
	 *      L lands between sub-section (CubicInversionApproxSamples) delimited by points Output.LeftSubPointIndex and Output.RightSubPointIndex
	 *            the length of this subsection is determined var delta_l= ...
	 *            we produce a length-proportional paramameter ranging from 0 to 1 within this subsection var normedLength = ...
	 *            the natural spline param within this subsection is: Output.localParam = _P1.normedLength^3 + _P2.normedLength^2 + _P3.normedLength + _P4
	 * @method
	 * @private
	 *
	 */
	PathImpl_Cubic.prototype.BuildCubicData = function () {
		var delta_t = 1.0 / (this.CubicInversionApproxSamples - 1);
		this.CubicPathLength = 0.0;

		for (var s = 0; s < this.NbSections; s++) {
			var SectionData = {};

			var Pt1 = this.Points[s];
			var Pt2 = this.Points[s + 1];
			var Tgt1 = this.RightTans[s];
			var Tgt2 = this.LeftTans[s + 1];
			var Ax = 2.0 * Pt1.x + Tgt1.x - 2.0 * Pt2.x + Tgt2.x;
			var Bx = -3.0 * Pt1.x - 2.0 * Tgt1.x + 3.0 * Pt2.x - Tgt2.x;
			var Cx = Tgt1.x;
			var Dx = Pt1.x;

			var Ay = 2.0 * Pt1.y + Tgt1.y - 2.0 * Pt2.y + Tgt2.y;
			var By = -3.0 * Pt1.y - 2.0 * Tgt1.y + 3.0 * Pt2.y - Tgt2.y;
			var Cy = Tgt1.y;
			var Dy = Pt1.y;

			var Az = 2.0 * Pt1.z + Tgt1.z - 2.0 * Pt2.z + Tgt2.z;
			var Bz = -3.0 * Pt1.z - 2.0 * Tgt1.z + 3.0 * Pt2.z - Tgt2.z;
			var Cz = Tgt1.z;
			var Dz = Pt1.z;

			var a = 9.0 * (Ax * Ax + Ay * Ay + Az * Az);
			var b = 12.0 * (Ax * Bx + Ay * By + Az * Bz);
			var c = 6.0 * (Ax * Cx + Ay * Cy + Az * Cz) + 4.0 * (Bx * Bx + By * By + Bz * Bz);
			var d = 4.0 * (Bx * Cx + By * Cy + Bz * Cz);
			var e = Cx * Cx + Cy * Cy + Cz * Cz;

			var t = [];
			var V = [];
			var dV = [];
			for (var i = 0; i < this.CubicInversionApproxSamples; i++) {
				var t_i = i * delta_t;
				t[i] = t_i;
				V[i] = dV[i] = 0.0;

				var f_i = a * Math.pow(t_i, 4) + b * Math.pow(t_i, 3) + c * Math.pow(t_i, 2) + d * t_i + e;
				if (f_i >= 0) {
					V[i] = Math.sqrt(f_i);
					if (V[i] != 0) {
						dV[i] =
							(4.0 * a * Math.pow(t_i, 3) + 3.0 * b * Math.pow(t_i, 2) + 2.0 * c * t_i + d) /
							(2.0 * V[i]);
					}
				}

				if (i == 0) {
					SectionData._l = [];
					SectionData._P1 = [];
					SectionData._P2 = [];
					SectionData._P3 = [];
					SectionData._P4 = [];
					SectionData._l[0] = 0;
				} else {
					var c1 = delta_t * (dV[i] + dV[i - 1]) + 2.0 * (V[i - 1] - V[i]);
					var c2 = 3.0 * (V[i] - V[i - 1]) - delta_t * (2.0 * dV[i - 1] + dV[i]);
					var c3 = dV[i - 1] * delta_t;
					var c4 = V[i - 1];

					var l_i = delta_t * (c1 / 4.0 + c2 / 3.0 + c3 / 2.0 + c4);
					SectionData._l[i] = SectionData._l[i - 1] + l_i;

					if (V[i - 1] != 0 && V[i] != 0) {
						SectionData._P1[i - 1] = 2.0 * t[i - 1] + l_i / V[i - 1] - 2.0 * t[i] + (1.0 / V[i]) * l_i;
						SectionData._P2[i - 1] = -3.0 * t[i - 1] - 2.0 * (l_i / V[i - 1]) + 3.0 * t[i] - l_i / V[i];
						SectionData._P3[i - 1] = l_i / V[i - 1];
						SectionData._P4[i - 1] = t[i - 1];
					}
				}
			}
			SectionData._length = SectionData._l[this.CubicInversionApproxSamples - 1];
			this.CubicSectionData[s] = SectionData;

			this.CubicPathLength += SectionData._length;
		}

		this.PointsCubicCurvilinearAbs[0] = 0;
		for (var p = 1; p < this.NbCtrlPts; p++) {
			this.PointsCubicCurvilinearAbs[p] =
				this.PointsCubicCurvilinearAbs[p - 1] + this.CubicSectionData[p - 1]._length / this.CubicPathLength;
		}
	};


	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getPointAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var LocalParam = LocalParams.localParam;

		var PtStart = this.Points[iSection];
		var TanStart = this.RightTans[iSection];
		var PtEnd = this.Points[iSection + 1];
		var TanEnd = this.LeftTans[iSection + 1];

		var LocalParam2 = LocalParam * LocalParam;
		var LocalParam3 = LocalParam2 * LocalParam;

		var a = 1 - 3 * LocalParam2 + 2 * LocalParam3;
		var b = 3 * LocalParam2 - 2 * LocalParam3;
		var c = LocalParam - 2 * LocalParam2 + LocalParam3;
		var d = LocalParam3 - LocalParam2;
		var P3 = new DSMath.Point(
			a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x,
			a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y,
			a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z
		);

		return P3;
	};

	/**
	 * the normed tangent vector
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getTangentAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var iSubSection = LocalParams.subSection;
		var LocalParam = LocalParams.localParam;
		var normedLength = LocalParams.normedLength;
		var delta_l = LocalParams.delta_l;

		// variation of LocalParam per variation of iTotalPathLengthRatio
		// normedLength = iTotalPathLengthRatio*this.CubicPathLength / delta_l
		var k = this.CubicPathLength / delta_l;
		var d_LocalParam_d_TotalPathLengthRatio =
			k *
			(3 * this.CubicSectionData[iSection]._P1[iSubSection] * Math.pow(normedLength, 2) +
				2 * this.CubicSectionData[iSection]._P2[iSubSection] * normedLength +
				this.CubicSectionData[iSection]._P3[iSubSection]);

		var PtStart = this.Points[iSection];
		var TanStart = this.RightTans[iSection];
		var PtEnd = this.Points[iSection + 1];
		var TanEnd = this.LeftTans[iSection + 1];

		var LocalParam2 = LocalParam * LocalParam;

		// g'(f(l)) . f'(l)
		var a = 6 * LocalParam2 - 6 * LocalParam;
		var b = 6 * LocalParam - 6 * LocalParam2;
		var c = 1 - 4 * LocalParam + 3 * LocalParam2;
		var d = 3 * LocalParam2 - 2 * LocalParam;
		var T3 = new DSMath.Vector3D(
			a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x,
			a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y,
			a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z
		);
		T3.multiplyScalar(d_LocalParam_d_TotalPathLengthRatio);
		T3.multiplyScalar(1 / this.CubicPathLength);
		return T3;
	};

	/**
	 * the 1st derrivative of the normed tangent vector
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getCurvatureAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var iSubSection = LocalParams.subSection;
		var LocalParam = LocalParams.localParam;
		var normedLength = LocalParams.normedLength;
		var delta_l = LocalParams.delta_l;

		// variation of LocalParam per variation of iTotalPathLengthRatio
		// normedLength = iTotalPathLengthRatio*this.CubicPathLength / delta_l
		var k = this.CubicPathLength / delta_l;
		var d_LocalParam_d_TotalPathLengthRatio =
			k *
			(3 * this.CubicSectionData[iSection]._P1[iSubSection] * Math.pow(normedLength, 2) +
				2 * this.CubicSectionData[iSection]._P2[iSubSection] * normedLength +
				this.CubicSectionData[iSection]._P3[iSubSection]);
		var d2_LocalParam_d2_TotalPathLengthRatio =
			k *
			k *
			(6 * this.CubicSectionData[iSection]._P1[iSubSection] * normedLength +
				2 * this.CubicSectionData[iSection]._P2[iSubSection]);

		var PtStart = this.Points[iSection];
		var TanStart = this.RightTans[iSection];
		var PtEnd = this.Points[iSection + 1];
		var TanEnd = this.LeftTans[iSection + 1];

		var LocalParam2 = LocalParam * LocalParam;

		// g'(f(l)) . f'(l)
		//a = (6 * LocalParam2 - 6 * LocalParam);
		//b = (6 * LocalParam - 6 * LocalParam2);
		//c = (1 - 4 * LocalParam + 3 * LocalParam2);
		//d = (3 * LocalParam2 - 2 * LocalParam);
		//var T3 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//T3.multiplyScalar(d_LocalParam_d_TotalPathLengthRatio / this.CubicPathLength);

		// g'(f(l)) . f''(l)
		var a = 6 * LocalParam2 - 6 * LocalParam;
		var b = 6 * LocalParam - 6 * LocalParam2;
		var c = 1 - 4 * LocalParam + 3 * LocalParam2;
		var d = 3 * LocalParam2 - 2 * LocalParam;
		var C3_1 = new DSMath.Vector3D(
			a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x,
			a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y,
			a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z
		);
		C3_1.multiplyScalar(d2_LocalParam_d2_TotalPathLengthRatio / this.CubicPathLength);

		// g''(f(l)) . (f'(l))²
		a = 12 * LocalParam - 6;
		b = 6 - 12 * LocalParam;
		c = 6 * LocalParam - 4;
		d = 6 * LocalParam - 2;
		var C3_2 = new DSMath.Vector3D(
			a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x,
			a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y,
			a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z
		);
		C3_2.multiplyScalar(
			(d_LocalParam_d_TotalPathLengthRatio * d_LocalParam_d_TotalPathLengthRatio) / this.CubicPathLength
		);

		var C3 = new DSMath.Vector3D(C3_1.x + C3_2.x, C3_1.y + C3_2.y, C3_1.z + C3_2.z);
		return C3;
	};

	/**
	 * the 2nd derrivative of the normed tangent vector
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getThirdDerivativeAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var iSubSection = LocalParams.subSection;
		var LocalParam = LocalParams.localParam;
		var normedLength = LocalParams.normedLength;
		var delta_l = LocalParams.delta_l;

		// variation of LocalParam per variation of iTotalPathLengthRatio
		// normedLength = iTotalPathLengthRatio*this.CubicPathLength / delta_l
		var k = this.CubicPathLength / delta_l;
		var d_LocalParam_d_TotalPathLengthRatio =
			k *
			(3 * this.CubicSectionData[iSection]._P1[iSubSection] * Math.pow(normedLength, 2) +
				2 * this.CubicSectionData[iSection]._P2[iSubSection] * normedLength +
				this.CubicSectionData[iSection]._P3[iSubSection]);
		var d2_LocalParam_d2_TotalPathLengthRatio =
			k *
			k *
			(6 * this.CubicSectionData[iSection]._P1[iSubSection] * normedLength +
				2 * this.CubicSectionData[iSection]._P2[iSubSection]);
		var d3_LocalParam_d3_TotalPathLengthRatio = k * k * k * (6 * this.CubicSectionData[iSection]._P1[iSubSection]);

		var PtStart = this.Points[iSection];
		var TanStart = this.RightTans[iSection];
		var PtEnd = this.Points[iSection + 1];
		var TanEnd = this.LeftTans[iSection + 1];

		var LocalParam2 = LocalParam * LocalParam;

		// -----------------------------
		// g'(f(l)) . f'(l)
		//a = (6 * LocalParam2 - 6 * LocalParam);
		//b = (6 * LocalParam - 6 * LocalParam2);
		//c = (1 - 4 * LocalParam + 3 * LocalParam2);
		//d = (3 * LocalParam2 - 2 * LocalParam);
		//var T3 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//T3.multiplyScalar(d_LocalParam_d_TotalPathLengthRatio / this.CubicPathLength);

		// -------------------------------
		// g'(f(l)) . f''(l)
		//var a = (6 * LocalParam2 - 6 * LocalParam);
		//var b = (6 * LocalParam - 6 * LocalParam2);
		//var c = (1 - 4 * LocalParam + 3 * LocalParam2);
		//var d = (3 * LocalParam2 - 2 * LocalParam);
		//var C3_1 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//C3_1.multiplyScalar(d2_LocalParam_d2_TotalPathLengthRatio / this.CubicPathLength);

		// g''(f(l)) . (f'(l))²
		//a = (12 * LocalParam - 6);
		//b = (6 - 12 * LocalParam);
		//c = (6 * LocalParam - 4);
		//d = (6 * LocalParam - 2);
		//var C3_2 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//C3_2.multiplyScalar(d_LocalParam_d_TotalPathLengthRatio * d_LocalParam_d_TotalPathLengthRatio / this.CubicPathLength);

		//C3 = new DSMath.Vector3D(C3_1.x + C3_2.x, C3_1.y + C3_2.y, C3_1.z + C3_2.z);
		// -------------------------------

		// g'(f(l)) . f'''(l)
		var a = 6 * LocalParam2 - 6 * LocalParam;
		var b = 6 * LocalParam - 6 * LocalParam2;
		var c = 1 - 4 * LocalParam + 3 * LocalParam2;
		var d = 3 * LocalParam2 - 2 * LocalParam;
		var K3_1 = new DSMath.Vector3D(
			a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x,
			a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y,
			a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z
		);
		K3_1.multiplyScalar(d3_LocalParam_d3_TotalPathLengthRatio / this.CubicPathLength);

		// 3 . g''(f(l)) . f'(l) . f''(l)
		a = 12 * LocalParam - 6;
		b = 6 - 12 * LocalParam;
		c = 6 * LocalParam - 4;
		d = 6 * LocalParam - 2;
		var K3_2 = new DSMath.Vector3D(
			a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x,
			a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y,
			a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z
		);
		K3_2.multiplyScalar(
			(3 * d_LocalParam_d_TotalPathLengthRatio * d2_LocalParam_d2_TotalPathLengthRatio) / this.CubicPathLength
		);

		//  g'''(f(l)) . f'(l)^3
		a = 12;
		b = -12;
		c = 6;
		d = 6;
		var K3_3 = new DSMath.Vector3D(
			a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x,
			a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y,
			a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z
		);
		K3_3.multiplyScalar(
			(d_LocalParam_d_TotalPathLengthRatio *
				d_LocalParam_d_TotalPathLengthRatio *
				d_LocalParam_d_TotalPathLengthRatio) /
				this.CubicPathLength
		);

		var K3 = new DSMath.Vector3D(K3_1.x + K3_2.x + K3_3.x, K3_1.y + K3_2.y + K3_3.y, K3_1.z + K3_2.z + K3_3.z);
		return K3;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getPointAtParam = function (iSection, iParam) {
		var Pt1 = this.Points[iSection];
		var Pt2 = this.Points[iSection + 1];
		var Tgt1 = this.RightTans[iSection];
		var Tgt2 = this.LeftTans[iSection + 1];

		var t = iParam;
		var t2 = t * iParam;
		var t3 = t2 * iParam;

		var a = 1 - 3 * t2 + 2 * t3;
		var b = 3 * t2 - 2 * t3;
		var c = t - 2 * t2 + t3;
		var d = -t2 + t3;

		var P3 = new DSMath.Point(
			a * Pt1.x + b * Pt2.x + c * Tgt1.x + d * Tgt2.x,
			a * Pt1.y + b * Pt2.y + c * Tgt1.y + d * Tgt2.y,
			a * Pt1.z + b * Pt2.z + c * Tgt1.z + d * Tgt2.z
		);
		return P3;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getTangentAtParam = function (iSection, iParam) {
		var Pt1 = this.Points[iSection];
		var Pt2 = this.Points[iSection + 1];
		var Tgt1 = this.RightTans[iSection];
		var Tgt2 = this.LeftTans[iSection + 1];

		var t = iParam;
		var t2 = t * iParam;

		var a = -6 * t + 6 * t2;
		var b = 6 * t - 6 * t2;
		var c = 1 - 4 * t + 3 * t2;
		var d = -2 * t + 3 * t2;

		var T3 = new DSMath.Vector3D(
			a * Pt1.x + b * Pt2.x + c * Tgt1.x + d * Tgt2.x,
			a * Pt1.y + b * Pt2.y + c * Tgt1.y + d * Tgt2.y,
			a * Pt1.z + b * Pt2.z + c * Tgt1.z + d * Tgt2.z
		);
		return T3;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getCurvatureAtParam = function (iSection, iParam) {
		var Pt1 = this.Points[iSection];
		var Pt2 = this.Points[iSection + 1];
		var Tgt1 = this.RightTans[iSection];
		var Tgt2 = this.LeftTans[iSection + 1];

		var t = iParam;

		var a = -6 + 12 * t;
		var b = 6 - 12 * t;
		var c = -4 + 6 * t;
		var d = -2 + 6 * t;

		var C3 = new DSMath.Vector3D(
			a * Pt1.x + b * Pt2.x + c * Tgt1.x + d * Tgt2.x,
			a * Pt1.y + b * Pt2.y + c * Tgt1.y + d * Tgt2.y,
			a * Pt1.z + b * Pt2.z + c * Tgt1.z + d * Tgt2.z
		);
		return C3;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getThirdDerivativeAtParam = function (iSection) {
		var Pt1 = this.Points[iSection];
		var Pt2 = this.Points[iSection + 1];
		var Tgt1 = this.RightTans[iSection];
		var Tgt2 = this.LeftTans[iSection + 1];

		var a = 12;
		var b = -12;
		var c = 6;
		var d = 6;

		var K3 = new DSMath.Vector3D(
			a * Pt1.x + b * Pt2.x + c * Tgt1.x + d * Tgt2.x,
			a * Pt1.y + b * Pt2.y + c * Tgt1.y + d * Tgt2.y,
			a * Pt1.z + b * Pt2.z + c * Tgt1.z + d * Tgt2.z
		);
		return K3;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.FindCubicSectionParam = function (iTotalPathLengthRatio) {
		var PMin = 0;
		var PMax = this.NbCtrlPts - 1;

		while (PMax - PMin > 1) {
			var PMid = Math.round(0.5 * (PMin + PMax));
			if (this.PointsCubicCurvilinearAbs[PMid] < iTotalPathLengthRatio) {
				PMin = PMid;
			} else {
				PMax = PMid;
			}
		}

		var Output = {};
		Output.LeftPointIndex = PMin;
		Output.RightPointIndex = PMax;
		Output.NormedParam =
			(iTotalPathLengthRatio - this.PointsCubicCurvilinearAbs[PMin]) /
			(this.PointsCubicCurvilinearAbs[PMax] - this.PointsCubicCurvilinearAbs[PMin]);
		Output.LengthParam = (iTotalPathLengthRatio - this.PointsCubicCurvilinearAbs[PMin]) * this.CubicPathLength;

		var iMin = 0;
		var iMax = this.CubicInversionApproxSamples - 1;
		while (iMax - iMin > 1) {
			var iMid = Math.round(0.5 * (iMin + iMax));
			if (this.CubicSectionData[PMin]._l[iMid] < Output.LengthParam) {
				iMin = iMid;
			} else {
				iMax = iMid;
			}
		}
		Output.LeftSubPointIndex = iMin;
		Output.RightSubPointIndex = iMax;
		return Output;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.LocalCubicParamToTotalPathLengthRatio = function (iSection, iParam) {
		// find a curvilinear param X between PointsCubicCurvilinearAbs[iSection] and PointsCubicCurvilinearAbs[iSection+1]
		// such that TotalPathLengthRatioToLocalCubicParam(X) = iParam
		var epsilon = 0.0001; // relative to section length
		var maxIter = 20;
		var iter = 0;

		var PMax = this.PointsCubicCurvilinearAbs[iSection + 1];
		var PMin = this.PointsCubicCurvilinearAbs[iSection];
		var PMid = 0.5 * (PMin + PMax);
		var LocalParam = this.TotalPathLengthRatioToLocalCubicParam(PMid).localParam;

		while (Math.abs(LocalParam - iParam) > epsilon && iter < maxIter) {
			if (LocalParam < iParam) {
				PMin = PMid;
			} else {
				PMax = PMid;
			}
			var PMid = 0.5 * (PMin + PMax);
			LocalParam = this.TotalPathLengthRatioToLocalCubicParam(PMid).localParam;

			iter++;
		}
		return PMid;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.TotalPathLengthRatioToLocalCubicParam = function (iTotalPathLengthRatio) {
		var SectionParam = this.FindCubicSectionParam(iTotalPathLengthRatio);
		var SectionLengthParam = SectionParam.LengthParam;
		var SectionIndex = SectionParam.LeftPointIndex;
		var SectionSubIndex = SectionParam.LeftSubPointIndex;
		var delta_l =
			this.CubicSectionData[SectionIndex]._l[SectionSubIndex + 1] -
			this.CubicSectionData[SectionIndex]._l[SectionSubIndex];
		var normedLength = (SectionLengthParam - this.CubicSectionData[SectionIndex]._l[SectionSubIndex]) / delta_l;

		var LocalParam =
			this.CubicSectionData[SectionIndex]._P1[SectionSubIndex] * Math.pow(normedLength, 3) +
			this.CubicSectionData[SectionIndex]._P2[SectionSubIndex] * Math.pow(normedLength, 2) +
			this.CubicSectionData[SectionIndex]._P3[SectionSubIndex] * normedLength +
			this.CubicSectionData[SectionIndex]._P4[SectionSubIndex];

		var Output = {};
		Output.localParam = LocalParam;
		Output.normedLength = normedLength;
		Output.section = SectionIndex;
		Output.subSection = SectionSubIndex;
		Output.delta_l = delta_l;
		return Output;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.findCubicSectionClosestPointParam = function (iSection, iTarget) {
		var nbSamples = 11;
		var maxIter = 5;
		var Out = [];

		var PMin = 0;
		var PClosest = 0.5;
		var MinDist = -1;
		var Amplitude = 1;
		for (var i = 0; i < maxIter; i++) {
			for (var s = 0; s < nbSamples; s++) {
				var P = PMin + s * (Amplitude / (nbSamples - 1));
				var Pt = this.getPointAtParam(iSection, P);
				var Dist = Pt.distanceTo(iTarget);
				if (MinDist < 0 || Dist < MinDist) {
					MinDist = Dist;
					PClosest = P;
				}
			}
			Amplitude = (Amplitude * 2) / (nbSamples - 1);
			PMin = Math.max(0, PClosest - Amplitude / 2);
		}
		Out.Param = PClosest;
		Out.Dist = MinDist;
		return Out;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getClosestToPointParam = function (iTarget) {
		var MinDistPtSection = 1;
		var MinDistPtParam = 1;
		var MinDistPtDist = -1;

		for (var s = 0; s < this.NbSections; s++) {
			var X = this.findCubicSectionClosestPointParam(s, iTarget);

			if (X !== null) {
				if (MinDistPtDist < 0 || X.Dist < MinDistPtDist) {
					MinDistPtDist = X.Dist;
					MinDistPtSection = s;
					MinDistPtParam = X.Param;
				}
			}
		}
		return this.LocalCubicParamToTotalPathLengthRatio(MinDistPtSection, MinDistPtParam);
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.findCubicSectionInflectionPointParam = function (iS, iT) {
		var epsilon = 0.0001; // relative to section length
		var maxIter = 20;

		var prevT = iT;
		var nextT = prevT;
		var iter = 0;

		var K = this.getThirdDerivativeAtParam(iS);
		K = DSMath.Vector3D.multiplyScalar(K, -1);
		while (iter < maxIter) {
			var T = this.getTangentAtParam(iS, prevT);
			var C = this.getCurvatureAtParam(iS, prevT);
			var A = T.clone().cross(C);
			var B = T.clone().cross(K);
			var dt = A.dot(B) / B.squareNorm();
			nextT = prevT + 0.5 * dt;
			if (nextT > 1) {
				nextT = 1;
				break;
			}
			if (nextT < 0) {
				nextT = 0;
				break;
			}
			if (Math.abs(nextT - prevT) < epsilon) {
				break;
			}
			prevT = nextT;
			iter++;
		}
		// start point is inflection only if curvature vector flips at right / left of this point
		if (nextT === 0) {
			if (iS > 0) {
				var C1 = this.getCurvatureAtParam(iS, 0);
				var C2 = this.getCurvatureAtParam(iS - 1, 1);

				if (C1.clone().dot(C2) <= 0) {
					return 0;
				}
			}
			return null;
		}
		if (nextT === 1) {
			if (iS < this.NbSections - 1) {
				var C1 = this.getCurvatureAtParam(iS, 1);
				var C2 = this.getCurvatureAtParam(iS + 1, 0);

				if (C1.clone().dot(C2) <= 0) {
					return 1;
				}
			}
			return null;
		}
		return nextT;
	};

	/**
	 * @method
	 * @private
	 */
	PathImpl_Cubic.prototype.getInflectionPoints = function () {
		var InflectionPointsParams = [];
		for (var s = 0; s < this.NbSections; s++) {
			// find zeroes of getCurvatureAtCurvilinearAbs between this.PointsCubicCurvilinearAbs[s] and this.PointsCubicCurvilinearAbs[s+1]
			var I1 = this.findCubicSectionInflectionPointParam(s, 0.5);
			if (I1 !== null) {
				InflectionPointsParams.push(this.LocalCubicParamToTotalPathLengthRatio(s, I1));
			}
		}
		return InflectionPointsParams;
	};

	PathImpl_Cubic.prototype.constructor = PathImpl_Cubic;

	STU.PathImpl_Cubic = PathImpl_Cubic;
	return PathImpl_Cubic;
});





define('StuVirtualObjects/StuPathImpl_Cubic', ['DS/StuVirtualObjects/StuPathImpl_Cubic'], function (PathImpl_Cubic) {
    'use strict';

	return PathImpl_Cubic;
});
