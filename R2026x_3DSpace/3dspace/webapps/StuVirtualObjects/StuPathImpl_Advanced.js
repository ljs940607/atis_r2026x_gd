//# ======================================================================
//# COPYRIGHT Dassault Systemes 2025
//# ======================================================================
//# ======================================================================
//# Name: PathImpl_Advanced
//# Creation: 2025
//# Author: IBS
//# ======================================================================

/*jshint esversion: 6 */

define('DS/StuVirtualObjects/StuPathImpl_Advanced', ['DS/StuCore/StuContext', 'DS/MathematicsES/MathsDef'], function (
	STU,
	DSMath
) {
	('use strict');

	/**
	 *
	 * Full JS path implementation, independant from StuPathImpl_Cubic
	 * this is a clone of the C++ impl: StudioCreativeContentModel\VIAIdeaExperienceVirtualObjModel.m\src\AdvancedPathImpl.cpp
	 *
	 * AdvancedPathImpl::AdvancedPathImpl
	 * AdvancedPathImpl::~AdvancedPathImpl
	 *
	 * @class
	 * @private
	 */
	var PathImpl_Advanced = function () {
		this.name = 'PathImpl_Advanced';

		this.CUBICINVERSIONSAMPLES = 20;
		this.UPDISCRETIZESTEP = 100;
		this.SMOOTHUP = 1;
		// see StuAdvancedPathPoint.ETangentMode
		this.TangentMode_eUndefined = 0;
		this.TangentMode_eAutoSmooth = 1;
		this.TangentMode_eSmooth = 2;
		this.TangentMode_eSymmetrical = 3;
		this.TangentMode_eLinear = 4;
		this.TangentMode_eFree = 5;
		this.TangentMode_eDegeneratedLeft = 6;
		this.TangentMode_eDegeneratedRight = 7;
		this.TangentMode_eIgnored = 8;

		this._PathLength = 0.0;
		this._Closed = false;
		this._NbCtrlPts = 0;
		this._NbSections = 0;

		this._CtrlPts_Pos = [];
		this._CtrlPts_RightTgt = [];
		this._CtrlPts_LeftTgt = [];

		this._CtrlPts_Up = [];
		this._CtrlPts_Roll = [];
		this._CtrlPts_Mode = [];
		this._CtrlPts_ComputedMode = [];

		this.ClearBuiltCurve();
		this.ClearSavedState();
	};

	/**
	 * SectionData* pNewSection = new SectionData()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.InitSectionData = function () {
		var NewSectionData = {};
		NewSectionData._l = [];
		NewSectionData._P1 = [];
		NewSectionData._P2 = [];
		NewSectionData._P3 = [];
		NewSectionData._P4 = [];
		NewSectionData._LazyU = [];

		NewSectionData._Length = 0.0;
		NewSectionData._CorrectiveRoll = 0.0;
		NewSectionData._dRollStart = 0.0;
		NewSectionData._dRollEnd = 0.0;
		return NewSectionData;
	};

	/**
	 * _TagSectionsForRebuild.insert(iValue)
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.InsertInTagSectionsForRebuild = function (iValue) {
		var i = 0;
		while (i < this._TagSectionsForRebuild.length && iValue > this._TagSectionsForRebuild[i]) {
			i++;
		}
		if (this._TagSectionsForRebuild[i] === iValue) {
			return;
		} else {
			this._TagSectionsForRebuild.splice(i, 0, iValue);
		}
	};
	/**
	 * _TagSectionsForRebuild.erase(iValue)
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.RemoveFromTagSectionsForRebuild = function (iValue) {
		const index = this._TagSectionsForRebuild.indexOf(iValue);
		if (index > -1) {
			this._TagSectionsForRebuild.splice(index, 1); // 2nd parameter means remove one item only
		}
	};

	/**
	 * void AdvancedPathImpl:: ClearBuiltCurve()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.ClearBuiltCurve = function () {
		this._CtrlPts_CurvAbs = [];
		this._SectionsData = [];
		this._TagSectionsForRebuild = [];
		this._PathLength = 0.0;
	};

	/**
	 * void AdvancedPathImpl:: ClearSavedState()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.ClearSavedState = function () {
		this._Saved_FlaggedManipulated = [];
		for (var p = 0; p < this._NbCtrlPts; p++) {
			this._Saved_FlaggedManipulated[p] = false;
		}
		this._Saved_CtrlPts_Pos = [];
		this._Saved_CtrlPts_RightTgt = [];
		this._Saved_CtrlPts_LeftTgt = [];
		this._Saved_CtrlPts_Up = [];
		this._Saved_CtrlPts_ComputedMode = [];
	};

	/**
	 * void AdvancedPathImpl:: SaveStateBeforeManip()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SaveStateBeforeManip = function () {
		var i = 0;
		for (i = 0; i < this._CtrlPts_Pos.length; i++) {
			this._Saved_CtrlPts_Pos[i] = this._CtrlPts_Pos[i].clone();
		}
		for (i = 0; i < this._CtrlPts_RightTgt.length; i++) {
			this._Saved_CtrlPts_RightTgt[i] = this._CtrlPts_RightTgt[i].clone();
		}
		for (i = 0; i < this._CtrlPts_LeftTgt.length; i++) {
			this._Saved_CtrlPts_LeftTgt[i] = this._CtrlPts_LeftTgt[i].clone();
		}
		for (i = 0; i < this._CtrlPts_Up.length; i++) {
			this._Saved_CtrlPts_Up[i] = this._CtrlPts_Up[i].clone();
		}
		for (i = 0; i < this._CtrlPts_ComputedMode.length; i++) {
			this._Saved_CtrlPts_ComputedMode[i] = this._CtrlPts_ComputedMode[i];
		}
	};

	/**
	 * void AdvancedPathImpl:: RevertToStateBeforeManip()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.RevertToStateBeforeManip = function () {
		var i = 0;
		for (i = 0; i < this._CtrlPts_Pos.length; i++) {
			this._CtrlPts_Pos[i] = this._Saved_CtrlPts_Pos[i].clone();
		}
		for (i = 0; i < this._CtrlPts_RightTgt.length; i++) {
			this._CtrlPts_RightTgt[i] = this._Saved_CtrlPts_RightTgt[i].clone();
		}
		for (i = 0; i < this._CtrlPts_LeftTgt.length; i++) {
			this._CtrlPts_LeftTgt[i] = this._Saved_CtrlPts_LeftTgt[i].clone();
		}
		for (i = 0; i < this._CtrlPts_Up.length; i++) {
			this._CtrlPts_Up[i] = this._Saved_CtrlPts_Up[i].clone();
		}
		for (i = 0; i < this._CtrlPts_ComputedMode.length; i++) {
			this._CtrlPts_ComputedMode[i] = this._Saved_CtrlPts_ComputedMode[i];
		}
	};

	/**
	 * void AdvancedPathImpl:: SetData()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetData = function (iCtrlPts, iRightTgts, iLeftTgts, iUps, iRolls, iModes, iClosed) {
		this.ClearSavedState();
		this._CtrlPts_Pos = [];
		this._CtrlPts_RightTgt = [];
		this._CtrlPts_LeftTgt = [];

		this._CtrlPts_Up = [];
		this._CtrlPts_Roll = [];
		this._CtrlPts_Mode = [];
		this._CtrlPts_ComputedMode = [];

		this._NbCtrlPts = iCtrlPts.length;
		if (this._NbCtrlPts > 0) {
			this._NbSections = this._NbCtrlPts - 1;
		} else {
			this._NbSections = 0;
		}

		for (var p = 0; p < this._NbCtrlPts; p++) {
			this._Saved_FlaggedManipulated[p] = false;
			this._CtrlPts_Pos[p] = iCtrlPts[p].clone();
			this._CtrlPts_RightTgt[p] = iRightTgts[p].clone();
			this._CtrlPts_LeftTgt[p] = iLeftTgts[p].clone();
			this._CtrlPts_Up[p] = iUps[p].clone();
			this._CtrlPts_Roll[p] = iRolls[p];
			this._CtrlPts_Mode[p] = iModes[p];
			this._CtrlPts_ComputedMode[p] = this.TangentMode_eIgnored;
			this._CtrlPts_CurvAbs[p] = 0;
		}

		this._Closed = iClosed;
		if (this._Closed) {
			this._NbSections++;
			this._CtrlPts_CurvAbs[this._NbSections] = 0;
		}

		this.ClearBuiltCurve();
	};

	/**
	 * void AdvancedPathImpl:: ShiftSectionsTaggedForRebuild()
	 * all sections indices in _TagSectionsForRebuild greater or equal to iShiftIndex are shifted by  ShiftValue
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.ShiftSectionsTaggedForRebuild = function (iShiftIndex, ShiftValue) {
		var indexesToAdd = [];
		for (var s = 0; s < this._TagSectionsForRebuild.length; s++) {
			if (this._TagSectionsForRebuild[s] >= iShiftIndex) {
				this.RemoveFromTagSectionsForRebuild(this._TagSectionsForRebuild[s]);
				indexesToAdd.push(this._TagSectionsForRebuild[s] + ShiftValue);
			}
		}
		for (var i = 0; i < indexesToAdd.length; i++) {
			this.InsertInTagSectionsForRebuild(indexesToAdd[i]);
		}
	};

	/**
	 * void AdvancedPathImpl:: AddPt()
	 * iIndex = 0: insert at begining of point
	 * iIndex = _NbCtrlPts: insert at end of point
	 * otherwise: insert new point before point iIndex
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.AddPt = function (iIndex, iCtrlPt, iRightTgt, iLeftTgt, iUp, iRoll, iMode) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			this._Saved_FlaggedManipulated = [
				...this._Saved_FlaggedManipulated.slice(0, iIndex),
				false,
				...this._Saved_FlaggedManipulated.slice(iIndex),
			];

			this._CtrlPts_Pos = [
				...this._CtrlPts_Pos.slice(0, iIndex),
				iCtrlPt.clone(),
				...this._CtrlPts_Pos.slice(iIndex),
			];

			this._CtrlPts_RightTgt = [
				...this._CtrlPts_RightTgt.slice(0, iIndex),
				iRightTgt.clone(),
				...this._CtrlPts_RightTgt.slice(iIndex),
			];

			this._CtrlPts_LeftTgt = [
				...this._CtrlPts_LeftTgt.slice(0, iIndex),
				iLeftTgt.clone(),
				...this._CtrlPts_LeftTgt.slice(iIndex),
			];

			this._CtrlPts_Up = [...this._CtrlPts_Up.slice(0, iIndex), iUp.clone(), ...this._CtrlPts_Up.slice(iIndex)];

			this._CtrlPts_Roll = [...this._CtrlPts_Roll.slice(0, iIndex), iRoll, ...this._CtrlPts_Roll.slice(iIndex)];

			this._CtrlPts_Mode = [...this._CtrlPts_Mode.slice(0, iIndex), iMode, ...this._CtrlPts_Mode.slice(iIndex)];

			this._CtrlPts_ComputedMode = [
				...this._CtrlPts_ComputedMode.slice(0, iIndex),
				8, // ETangentMode:: eIgnored
				...this._CtrlPts_ComputedMode.slice(iIndex),
			];

			var pNewSection = this.InitSectionData();
			if (!this._Closed && iIndex === this._NbCtrlPts - 1) {
				this._SectionsData[this._NbSections] = pNewSection;
			} else {
				this._SectionsData = [
					...this._SectionsData.slice(0, iIndex),
					pNewSection,
					...this._SectionsData.slice(iIndex),
				];
			}
			this._NbSections++;
			this._NbCtrlPts++;

			this._CtrlPts_CurvAbs[this._NbSections] = 0;
		} // if (iIndex >= 0 && iIndex < _NbCtrlPts)
		else if (iIndex === this._NbCtrlPts) {
			_Saved_FlaggedManipulated[this._NbCtrlPts] = false;
			this._CtrlPts_Pos[this._NbCtrlPts] = iCtrlPt;
			this._CtrlPts_RightTgt[this._NbCtrlPts] = iRightTgt;
			this._CtrlPts_LeftTgt[this._NbCtrlPts] = iLeftTgt;
			this._CtrlPts_Up[this._NbCtrlPts] = iUp;
			this._CtrlPts_Roll[this._NbCtrlPts] = iRoll;
			this._CtrlPts_Mode[this._NbCtrlPts] = iMode;
			this._CtrlPts_ComputedMode[this._NbCtrlPts] = this.TangentMode_eIgnored;

			if (!this._Closed && this._NbCtrlPts === 0) {
				// the first point of an open path does not create a section
			} else {
				var pNewSection = this.InitSectionData();
				this._SectionsData[this._NbCtrlPts] = pNewSection;
				this._NbSections++;
			}
			this._NbCtrlPts++;

			this._CtrlPts_CurvAbs[this._NbSections] = 0;
		} // else if (iIndex == this._NbCtrlPts) {

		if (this._NbSections > 0) {
			// before insert at index 3 (before PD) :
			// Points   : PA      PB      PC               PD       PE      PF
			// Sections :     SA      SB          SC           SD       SE       SF
			// AFTER insert at index 3 (before PD) :
			// Points   : PA      PB      PC*     PX       PD*      PE      PF
			// Sections :     SA      SB*     SC*     SX*      SD*      SE       SF

			// update _TagSectionsForRebuild, elements >= iIndex should be incremented, they were shifted by insert
			this.ShiftSectionsTaggedForRebuild(iIndex, 1);

			// inserted section is tagged for rebuild
			this.InsertInTagSectionsForRebuild(iIndex);

			// section before inserted section is tagged for rebuild
			if (iIndex > 0) {
				this.InsertInTagSectionsForRebuild(iIndex - 1);
			} else if (this._Closed) {
				this.InsertInTagSectionsForRebuild((iIndex - 1 + this._NbSections) % this._NbSections);
			}

			// section 2-before inserted section is tagged for rebuild
			if (iIndex > 1) {
				this.InsertInTagSectionsForRebuild(iIndex - 2);
			} else if (this._Closed) {
				this.InsertInTagSectionsForRebuild((iIndex - 2 + 2 * this._NbSections) % this._NbSections);
			}

			// section after inserted section is tagged for rebuild
			if (iIndex < this._NbSections - 1) {
				this.InsertInTagSectionsForRebuild(iIndex + 1);
			} else if (this._Closed) {
				this.InsertInTagSectionsForRebuild((iIndex + 1) % this._NbSections);
			}
		}
		this.ClearSavedState();
	};

	/**
	 * void AdvancedPathImpl:: RemovePt()
	 * iIndex = 0: remove first
	 * iIndex = _NbCtrlPts-1 : remove last point
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.RemovePt = function (iIndex) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			this._Saved_FlaggedManipulated.splice(iIndex, 1);

			this._CtrlPts_Pos.splice(iIndex, 1);
			this._CtrlPts_RightTgt.splice(iIndex, 1);
			this._CtrlPts_LeftTgt.splice(iIndex, 1);
			this._CtrlPts_Up.splice(iIndex, 1);
			this._CtrlPts_Roll.splice(iIndex, 1);
			this._CtrlPts_Mode.splice(iIndex, 1);
			this._CtrlPts_ComputedMode.splice(iIndex, 1);
			this._CtrlPts_CurvAbs.splice(iIndex, 1);

			if (this._NbCtrlPts === 1 && !this._Closed) {
				// no section to delete
			} else {
				this._SectionsData.splice(iIndex, 1);
				this._NbSections--;
			}
			this._NbCtrlPts--;
		}
		if (this._NbSections > 0) {
			// before remove at index 3 (PD) :
			// Points   : PA      PB      PC               PD       PE      PF
			// Sections :     SA      SB          SC           SD       SE       SF
			// AFTER remove at index 3 (PD) :
			// Points   : PA      PB      PC*                       PE*     PF
			// Sections :     SA      SB*           SC*                 SE*      SF

			// update _TagSectionsForRebuild,
			// elements == iIndex are removed
			// elements >= iIndex should be incremented, they were shifted by insert
			this.RemoveFromTagSectionsForRebuild(iIndex);
			this.ShiftSectionsTaggedForRebuild(iIndex, -1);

			// section before inserted section is tagged for rebuild
			if (iIndex > 0) {
				this.InsertInTagSectionsForRebuild(iIndex - 1);
			} else if (this._Closed) {
				this.InsertInTagSectionsForRebuild((iIndex - 1 + this._NbSections) % this._NbSections);
			}

			// section 2-before inserted section is tagged for rebuild
			if (iIndex > 1) {
				this.InsertInTagSectionsForRebuild(iIndex - 2);
			} else if (this._Closed) {
				this.InsertInTagSectionsForRebuild((iIndex - 2 + 2 * this._NbSections) % this._NbSections);
			}
		}
		this.ClearSavedState();
	};

	/**
	 * void AdvancedPathImpl::BuildCurve()
	 *
	 * builds :
	 * _SectionsData[0 ... nbSections-1]
	 * _CtrlPts_CurvAbs[0 ... nbCtrlPts-1] ou _CtrlPts_CurvAbs[0 ... nbCtrlPts] si closed
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
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.BuildCurve = function () {
		this.ClearBuiltCurve();
		this._PathLength = 0.0;

		this._CtrlPts_CurvAbs = [];
		for (var s = 0; s < this._NbSections + 1; s++) {
			this._CtrlPts_CurvAbs[s] = 0;
		}

		for (var s = 0; s < this._NbSections; s++) {
			var pNewSection = this.InitSectionData();
			this._SectionsData[s] = pNewSection;
		}

		for (var s = 0; s < this._NbSections; s++) {
			this.RebuildSection(s);
		}
		this._TagSectionsForRebuild = [];
	};

	/**
	 * AdvancedPathImpl:: RebuildSection()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.RebuildSection = function (s) {
		if (s >= 0 && s < this._NbSections) {
			var delta_t = 1.0 / (this.CUBICINVERSIONSAMPLES - 1);

			var pModifiedSection = this._SectionsData[s];
			if (pModifiedSection !== undefined) {
				var Mode1 = this._CtrlPts_ComputedMode[s % this._NbCtrlPts];
				var Mode2 = this._CtrlPts_ComputedMode[(s + 1) % this._NbCtrlPts];
				var bIgnoreSection = Mode1 === this.TangentMode_eIgnored || Mode2 === this.TangentMode_eIgnored;

				this._PathLength -= pModifiedSection._Length;
				pModifiedSection._Length = 0.0;

				if (!bIgnoreSection) {
					var Pt1 = this._CtrlPts_Pos[s % this._NbCtrlPts].clone();
					var Pt2 = this._CtrlPts_Pos[(s + 1) % this._NbCtrlPts].clone();
					var Tgt1 = this._CtrlPts_RightTgt[s % this._NbCtrlPts].clone();
					var Tgt2 = this._CtrlPts_LeftTgt[(s + 1) % this._NbCtrlPts].clone();
					var Ax = 2.0 * Pt1.x + Tgt1.x - 2.0 * Pt2.x + Tgt2.x;
					var Bx = -3.0 * Pt1.x - 2.0 * Tgt1.x + 3.0 * Pt2.x - Tgt2.x;
					var Cx = Tgt1.x;
					//var Dx = Pt1.x;

					var Ay = 2.0 * Pt1.y + Tgt1.y - 2.0 * Pt2.y + Tgt2.y;
					var By = -3.0 * Pt1.y - 2.0 * Tgt1.y + 3.0 * Pt2.y - Tgt2.y;
					var Cy = Tgt1.y;
					//var Dy = Pt1.y;

					var Az = 2.0 * Pt1.z + Tgt1.z - 2.0 * Pt2.z + Tgt2.z;
					var Bz = -3.0 * Pt1.z - 2.0 * Tgt1.z + 3.0 * Pt2.z - Tgt2.z;
					var Cz = Tgt1.z;
					//var Dz = Pt1.z;

					var a = 9.0 * (Ax * Ax + Ay * Ay + Az * Az);
					var b = 12.0 * (Ax * Bx + Ay * By + Az * Bz);
					var c = 6.0 * (Ax * Cx + Ay * Cy + Az * Cz) + 4.0 * (Bx * Bx + By * By + Bz * Bz);
					var d = 4.0 * (Bx * Cx + By * Cy + Bz * Cz);
					var e = Cx * Cx + Cy * Cy + Cz * Cz;

					var t = [];
					var V = [];
					var dV = [];

					for (var i = 0; i < this.CUBICINVERSIONSAMPLES; i++) {
						var t_i = i * delta_t;
						t[i] = t_i;
						V[i] = dV[i] = 0.0;

						var f_i = a * Math.pow(t_i, 4) + b * Math.pow(t_i, 3) + c * Math.pow(t_i, 2) + d * t_i + e;
						if (f_i >= 0) {
							V[i] = Math.sqrt(f_i);
							if (V[i] !== 0) {
								dV[i] =
									(4.0 * a * Math.pow(t_i, 3) + 3.0 * b * Math.pow(t_i, 2) + 2.0 * c * t_i + d) /
									(2.0 * V[i]);
							}
						}

						if (i === 0) {
							pModifiedSection._l[0] = 0;
						} else {
							var c1 = delta_t * (dV[i] + dV[i - 1]) + 2.0 * (V[i - 1] - V[i]);
							var c2 = 3.0 * (V[i] - V[i - 1]) - delta_t * (2.0 * dV[i - 1] + dV[i]);
							var c3 = dV[i - 1] * delta_t;
							var c4 = V[i - 1];

							var l_i = delta_t * (c1 / 4.0 + c2 / 3.0 + c3 / 2.0 + c4);
							pModifiedSection._l[i] = pModifiedSection._l[i - 1] + l_i;

							if (V[i - 1] !== 0 && V[i] !== 0) {
								pModifiedSection._P1[i - 1] =
									2.0 * t[i - 1] + l_i / V[i - 1] - 2.0 * t[i] + (1.0 / V[i]) * l_i;
								pModifiedSection._P2[i - 1] =
									-3.0 * t[i - 1] - 2.0 * (l_i / V[i - 1]) + 3.0 * t[i] - l_i / V[i];
								pModifiedSection._P3[i - 1] = l_i / V[i - 1];
								pModifiedSection._P4[i - 1] = t[i - 1];
							}
						}
					}

					pModifiedSection._Length = pModifiedSection._l[this.CUBICINVERSIONSAMPLES - 1];
					//this._SectionsData[s] = pModifiedSection;
					this._PathLength += pModifiedSection._Length;
				} // if (!bIgnoreSection)

				// _PathLength was modified, all curviliear abcissas are impacted
				for (var p = 1; p <= this._NbSections; p++) {
					if (p < this._CtrlPts_CurvAbs.length) {
						this._CtrlPts_CurvAbs[p] =
							this._CtrlPts_CurvAbs[p - 1] + this._SectionsData[p - 1]._Length / this._PathLength;
					}
				}
				// last curve abs shouls always be 1 (0.999... produces problems in FindCubicSectionParam)
				this._CtrlPts_CurvAbs[this._NbSections] = 1.0;

				// PathImpl_Advanced.prototype.BuildAdvancedData
				this._SectionsData[s]._CorrectiveRoll = 0;
				this._SectionsData[s]._dRollStart = 0;
				this._SectionsData[s]._dRollEnd = 0;

				if (!bIgnoreSection) {
					var previous_T = this._CtrlPts_RightTgt[s].clone();
					previous_T.normalize();
					this._SectionsData[s]._LazyU[0] = this._CtrlPts_Up[s].clone();
					//this._SectionsData[s].RollU[0] = this._CtrlPts_Up[s].clone();

					// compute _LazyU for _SectionsData[s]
					// lazyU is the parallel transport of the Up vector from one control point to the next
					// the rotation of the tangent vector between two close points (separated by one DiscretizeStep increment) is applied to the up vector
					// in order for the up vector to be kept perpendicular to the tangent vector by applying the minimal rotation to it
					for (var i = 1; i <= this.UPDISCRETIZESTEP; i++) {
						var t = (i * 1.0) / (this.UPDISCRETIZESTEP * 1.0);

						var T = this.GetTangentAtSectionParam(s, t);
						T.normalize();

						// TQ : the rotation aligning tangent previous_T with T
						var TQ = new DSMath.Quaternion();
						TQ.makeRotationFromVectors(previous_T, T);

						this._SectionsData[s]._LazyU[i] = this._SectionsData[s]._LazyU[i - 1].clone();
						this._SectionsData[s]._LazyU[i].applyQuaternion(TQ);
						previous_T = T;
					}

					// compute roll correction
					// roll correction is the roll (rotation around moving tangent vector)
					// which should be applied to the lazyU vector between two control points in order for the up vector to reach the defined up vector at the next control point
					var Axis = this._CtrlPts_LeftTgt[(s + 1) % this._NbCtrlPts].clone();
					Axis.normalize();
					this._SectionsData[s]._CorrectiveRoll = this._SectionsData[s]._LazyU[
						this.UPDISCRETIZESTEP
					].getSignedAngleTo(this._CtrlPts_Up[(s + 1) % this._NbCtrlPts], Axis);

					if (this._SectionsData[s]._CorrectiveRoll > DSMath.constants.PI) {
						this._SectionsData[s]._CorrectiveRoll -= DSMath.constants.PI2;
					}

					// roll will be applied following a cubic Hermit interpolation along path between control points S and S+1 in such a way that:
					// roll(CtrlPt_S) = 0 : the initial roll is null , the up is this.Ups[S]
					// roll(CtrlPt_S+1) = _SectionsData[s]->CorrectiveRoll + _CtrlPts_Roll[S]* CAT2PI
					// => the final roll is the sum of corrective roll(final up == this.Ups[S + 1]) + a number of full rotations(_CtrlPts_Roll[S])
					// roll values and derrivatives connect smoothly between sections
					if (this._NbSections === 1) {
						this._SectionsData[s]._dRollStart =
							this._SectionsData[s]._CorrectiveRoll + this._CtrlPts_Roll[s] * DSMath.constants.PI2;
						this._SectionsData[s]._dRollEnd =
							this._SectionsData[s]._CorrectiveRoll + this._CtrlPts_Roll[s] * DSMath.constants.PI2;
					} else {
						// this.nbSections >1
						var sNext = (s + 1) % this._NbSections;
						var sPrev = (s - 1 + this._NbSections) % this._NbSections;

						if (s === 0 && !this._Closed) {
							this._SectionsData[s]._dRollStart =
								this._SectionsData[s]._CorrectiveRoll + this._CtrlPts_Roll[s] * DSMath.constants.PI2;
							this._SectionsData[s]._dRollEnd =
								0.5 *
								(this._SectionsData[sNext]._CorrectiveRoll +
									this._CtrlPts_Roll[sNext] * DSMath.constants.PI2 +
									this._SectionsData[s]._CorrectiveRoll +
									this._CtrlPts_Roll[s] * DSMath.constants.PI2);
							this._SectionsData[sNext]._dRollStart = this._SectionsData[s]._dRollEnd;
						} else if (s === this._NbSections - 1 && !this._Closed) {
							this._SectionsData[s]._dRollStart =
								0.5 *
								(this._SectionsData[sPrev]._CorrectiveRoll +
									this._CtrlPts_Roll[sPrev] * DSMath.constants.PI2 +
									this._SectionsData[s]._CorrectiveRoll +
									this._CtrlPts_Roll[s] * DSMath.constants.PI2);
							this._SectionsData[sPrev]._dRollEnd = this._SectionsData[s]._dRollStart;
							this._SectionsData[s]._dRollEnd =
								this._SectionsData[s]._CorrectiveRoll + this._CtrlPts_Roll[s] * DSMath.constants.PI2;
						} else {
							this._SectionsData[s]._dRollStart =
								0.5 *
								(this._SectionsData[sPrev]._CorrectiveRoll +
									this._CtrlPts_Roll[sPrev] * DSMath.constants.PI2 +
									this._SectionsData[s]._CorrectiveRoll +
									this._CtrlPts_Roll[s] * DSMath.constants.PI2);
							this._SectionsData[sPrev]._dRollEnd = this._SectionsData[s]._dRollStart;

							this._SectionsData[s]._dRollEnd =
								0.5 *
								(this._SectionsData[sNext]._CorrectiveRoll +
									this._CtrlPts_Roll[sNext] * DSMath.constants.PI2 +
									this._SectionsData[s]._CorrectiveRoll +
									this._CtrlPts_Roll[s] * DSMath.constants.PI2);
							this._SectionsData[sNext]._dRollStart = this._SectionsData[s]._dRollEnd;
						}
					}
				} // if (!bIgnoreSection)

				//if (!bIgnoreSection) {
				//	this.RefreshVisuForSection(s);
				//}// if (!bIgnoreSection)
			} // if (pModifiedSection)
		} // if (s >= 0 && s < _NbSections)
	};

	/**
	 * AdvancedPathImpl::GetPointAtCurvilinearAbs()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetPointAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var LocalParam = LocalParams.localParam;

		var PtStart = this._CtrlPts_Pos[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var TanStart = this._CtrlPts_RightTgt[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var PtEnd = this._CtrlPts_Pos[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];
		var TanEnd = this._CtrlPts_LeftTgt[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];

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
	 * AdvancedPathImpl::GetUpAtCurvilinearAbs()
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetUpAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var MyLocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = MyLocalParams.section;
		var LocalParam = MyLocalParams.localParam;
		return this.GetUpAtSectionParam(iSection, LocalParam);
	};

	/**
	 * AdvancedPathImpl::GetTangentAtCurvilinearAbs()
	 * the normed tangent vector
	 * 
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetTangentAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var iSubSection = LocalParams.subSection;
		var LocalParam = LocalParams.localParam;
		var normedLength = LocalParams.normedLength;
		var delta_l = LocalParams.delta_l;

		// variation of LocalParam per variation of iTotalPathLengthRatio
		// normedLength = iTotalPathLengthRatio*this._PathLength / delta_l
		var k = this._PathLength / delta_l;
		var d_LocalParam_d_TotalPathLengthRatio =
			k *
			(3 * this._SectionsData[iSection]._P1[iSubSection] * Math.pow(normedLength, 2) +
				2 * this._SectionsData[iSection]._P2[iSubSection] * normedLength +
				this._SectionsData[iSection]._P3[iSubSection]);

		var PtStart = this._CtrlPts_Pos[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var TanStart = this._CtrlPts_RightTgt[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var PtEnd = this._CtrlPts_Pos[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];
		var TanEnd = this._CtrlPts_LeftTgt[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];

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
		T3.multiplyScalar(1 / this._PathLength);
		return T3;
	};

	/**
	 * AdvancedPathImpl::GetCurvatureAtCurvilinearAbs
	 * the 1st derrivative of the normed tangent vector
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCurvatureAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var iSubSection = LocalParams.subSection;
		var LocalParam = LocalParams.localParam;
		var normedLength = LocalParams.normedLength;
		var delta_l = LocalParams.delta_l;

		// variation of LocalParam per variation of iTotalPathLengthRatio
		// normedLength = iTotalPathLengthRatio*this._PathLength / delta_l
		var k = this._PathLength / delta_l;
		var d_LocalParam_d_TotalPathLengthRatio =
			k *
			(3 * this._SectionsData[iSection]._P1[iSubSection] * Math.pow(normedLength, 2) +
				2 * this._SectionsData[iSection]._P2[iSubSection] * normedLength +
				this._SectionsData[iSection]._P3[iSubSection]);
		var d2_LocalParam_d2_TotalPathLengthRatio =
			k *
			k *
			(6 * this._SectionsData[iSection]._P1[iSubSection] * normedLength +
				2 * this._SectionsData[iSection]._P2[iSubSection]);

		var PtStart = this._CtrlPts_Pos[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var TanStart = this._CtrlPts_RightTgt[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var PtEnd = this._CtrlPts_Pos[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];
		var TanEnd = this._CtrlPts_LeftTgt[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];

		var LocalParam2 = LocalParam * LocalParam;

		// g'(f(l)) . f'(l)
		//a = (6 * LocalParam2 - 6 * LocalParam);
		//b = (6 * LocalParam - 6 * LocalParam2);
		//c = (1 - 4 * LocalParam + 3 * LocalParam2);
		//d = (3 * LocalParam2 - 2 * LocalParam);
		//var T3 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//T3.multiplyScalar(d_LocalParam_d_TotalPathLengthRatio / this._PathLength);

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
		C3_1.multiplyScalar(d2_LocalParam_d2_TotalPathLengthRatio / this._PathLength);

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
			(d_LocalParam_d_TotalPathLengthRatio * d_LocalParam_d_TotalPathLengthRatio) / this._PathLength
		);

		var C3 = new DSMath.Vector3D(C3_1.x + C3_2.x, C3_1.y + C3_2.y, C3_1.z + C3_2.z);
		return C3;
	};

	/**
	 * AdvancedPathImpl::GetThirdDerivativeAtCurvilinearAbs
	 * the 2nd derrivative of the normed tangent vector
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetThirdDerivativeAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalCubicParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var iSubSection = LocalParams.subSection;
		var LocalParam = LocalParams.localParam;
		var normedLength = LocalParams.normedLength;
		var delta_l = LocalParams.delta_l;

		// variation of LocalParam per variation of iTotalPathLengthRatio
		// normedLength = iTotalPathLengthRatio*this._PathLength / delta_l
		var k = this._PathLength / delta_l;
		var d_LocalParam_d_TotalPathLengthRatio =
			k *
			(3 * this._SectionsData[iSection]._P1[iSubSection] * Math.pow(normedLength, 2) +
				2 * this._SectionsData[iSection]._P2[iSubSection] * normedLength +
				this._SectionsData[iSection]._P3[iSubSection]);
		var d2_LocalParam_d2_TotalPathLengthRatio =
			k *
			k *
			(6 * this._SectionsData[iSection]._P1[iSubSection] * normedLength +
				2 * this._SectionsData[iSection]._P2[iSubSection]);
		var d3_LocalParam_d3_TotalPathLengthRatio = k * k * k * (6 * this._SectionsData[iSection]._P1[iSubSection]);

		var PtStart = this._CtrlPts_Pos[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var TanStart = this._CtrlPts_RightTgt[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var PtEnd = this._CtrlPts_Pos[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];
		var TanEnd = this._CtrlPts_LeftTgt[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];

		var LocalParam2 = LocalParam * LocalParam;

		// -----------------------------
		// g'(f(l)) . f'(l)
		//a = (6 * LocalParam2 - 6 * LocalParam);
		//b = (6 * LocalParam - 6 * LocalParam2);
		//c = (1 - 4 * LocalParam + 3 * LocalParam2);
		//d = (3 * LocalParam2 - 2 * LocalParam);
		//var T3 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//T3.multiplyScalar(d_LocalParam_d_TotalPathLengthRatio / this._PathLength);

		// -------------------------------
		// g'(f(l)) . f''(l)
		//var a = (6 * LocalParam2 - 6 * LocalParam);
		//var b = (6 * LocalParam - 6 * LocalParam2);
		//var c = (1 - 4 * LocalParam + 3 * LocalParam2);
		//var d = (3 * LocalParam2 - 2 * LocalParam);
		//var C3_1 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//C3_1.multiplyScalar(d2_LocalParam_d2_TotalPathLengthRatio / this._PathLength);

		// g''(f(l)) . (f'(l))²
		//a = (12 * LocalParam - 6);
		//b = (6 - 12 * LocalParam);
		//c = (6 * LocalParam - 4);
		//d = (6 * LocalParam - 2);
		//var C3_2 = new DSMath.Vector3D(a * PtStart.x + b * PtEnd.x + c * TanStart.x + d * TanEnd.x, a * PtStart.y + b * PtEnd.y + c * TanStart.y + d * TanEnd.y, a * PtStart.z + b * PtEnd.z + c * TanStart.z + d * TanEnd.z);
		//C3_2.multiplyScalar(d_LocalParam_d_TotalPathLengthRatio * d_LocalParam_d_TotalPathLengthRatio / this._PathLength);

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
		K3_1.multiplyScalar(d3_LocalParam_d3_TotalPathLengthRatio / this._PathLength);

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
			(3 * d_LocalParam_d_TotalPathLengthRatio * d2_LocalParam_d2_TotalPathLengthRatio) / this._PathLength
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
				this._PathLength
		);

		var K3 = new DSMath.Vector3D(K3_1.x + K3_2.x + K3_3.x, K3_1.y + K3_2.y + K3_3.y, K3_1.z + K3_2.z + K3_3.z);
		return K3;
	};

	/**
	 * AdvancedPathImpl::PathParamToSectionParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.PathParamToSectionParam = function (iParam) {
		var Out = [];
		var ExtendedParam = iParam * this._NbSections; // 0.._NbSections

		Out.Section = Math.floor(ExtendedParam);
		if (Out.Section >= this._NbSections) {
			Out.Section = this._NbSections - 1;
		}

		Out.SectionParam = ExtendedParam - Out.Section;
		if (Out.Section < 0 || Out.Section >= this._NbSections || Out.SectionParam < 0.0 || Out.SectionParam > 1.0) {
			Out.RC = false;
		} else {
			Out.RC = true;
		}
	};

	/**
	 * AdvancedPathImpl::GetPointAtSectionParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetPointAtSectionParam = function (iSection, iParam) {
		var Pt1 = this._CtrlPts_Pos[iSection].clone();
		var Pt2 = this._CtrlPts_Pos[(iSection + 1) % this._NbCtrlPts].clone();
		var Tgt1 = this._CtrlPts_RightTgt[iSection].clone();
		var Tgt2 = this._CtrlPts_LeftTgt[(iSection + 1) % this._NbCtrlPts].clone();

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
	 * AdvancedPathImpl::GetUpAtSectionParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetUpAtSectionParam = function (iSection, iParam) {
		var i_f = iParam * this.UPDISCRETIZESTEP;

		if (i_f <= 0) {
			i_f = 0.0;
		}
		if (i_f >= this.UPDISCRETIZESTEP) {
			i_f = this.UPDISCRETIZESTEP;
		}

		var iPrevious = Math.floor(i_f);
		var UpPrevious = this._SectionsData[iSection]._LazyU[iPrevious];
		var iNext = Math.ceil(i_f);
		var UpNext = this._SectionsData[iSection]._LazyU[iNext];

		var LazyU = new DSMath.Vector3D();
		if (iPrevious === iNext) {
			LazyU = this._SectionsData[iSection]._LazyU[iPrevious].clone();
		} else {
			LazyU = new DSMath.Vector3D(
				(i_f - iPrevious) * UpNext.x + (iNext - i_f) * UpPrevious.x,
				(i_f - iPrevious) * UpNext.y + (iNext - i_f) * UpPrevious.y,
				(i_f - iPrevious) * UpNext.z + (iNext - i_f) * UpPrevious.z
			);
		}

		// make sure lazyU is perpendicular to Tangent
		var T = this.GetTangentAtSectionParam(iSection, iParam);
		T.normalize();

		var R = DSMath.Vector3D.cross(T, LazyU);
		LazyU = DSMath.Vector3D.cross(R, T);
		LazyU.normalize();

		var Roll = 0.0;
		var t = iParam;
		if (this.SMOOTHUP) {
			var t2 = t * t;
			var t3 = t * t2;
			//var a = (1 - 3 * t2 + 2 * t3); // start roll is 0
			var b = 3 * t2 - 2 * t3;
			var c = t - 2 * t2 + t3;
			var d = t3 - t2;
			// Roll smoothly evolves from 0 at t=0 to _SectionsData[S]._CorrectiveRoll + this.Rolls[S] * 2 * Math.PI at t=1
			Roll =
				b * (this._SectionsData[iSection]._CorrectiveRoll + this._CtrlPts_Roll[iSection] * 2 * Math.PI) +
				c * this._SectionsData[iSection]._dRollStart +
				d * this._SectionsData[iSection]._dRollEnd;
		} else {
			Roll = t * (this._SectionsData[iSection]._CorrectiveRoll + this._CtrlPts_Roll[iSection] * 2 * Math.PI);
		}
		RQ = new DSMath.Quaternion();
		RQ.makeRotation(T, Roll);
		return LazyU.applyQuaternion(RQ);
	};

	/**
	 * AdvancedPathImpl::GetTangentAtSectionParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetTangentAtSectionParam = function (iSection, iParam) {
		var Pt1 = this._CtrlPts_Pos[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var Pt2 = this._CtrlPts_Pos[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];
		var Tgt1 = this._CtrlPts_RightTgt[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var Tgt2 = this._CtrlPts_LeftTgt[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];

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
	 * AdvancedPathImpl::GetCurvatureAtSectionParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCurvatureAtSectionParam = function (iSection, iParam) {
		var Pt1 = this._CtrlPts_Pos[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var Pt2 = this._CtrlPts_Pos[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];
		var Tgt1 = this._CtrlPts_RightTgt[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var Tgt2 = this._CtrlPts_LeftTgt[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];

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
	 * AdvancedPathImpl::GetThirdDerivativeAtSectionParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetThirdDerivativeAtSectionParam = function (iSection) {
		var Pt1 = this._CtrlPts_Pos[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var Pt2 = this._CtrlPts_Pos[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];
		var Tgt1 = this._CtrlPts_RightTgt[(iSection + this._NbCtrlPts) % this._NbCtrlPts];
		var Tgt2 = this._CtrlPts_LeftTgt[(iSection + 1 + this._NbCtrlPts) % this._NbCtrlPts];

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
	 * AdvancedPathImpl::FindCubicSectionParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.FindCubicSectionParam = function (iTotalPathLengthRatio) {
		var PMin = 0;
		var PMax = this._NbSections;

		if (this._Closed) {
			PMax++;
		}

		while (PMax - PMin > 1) {
			var PMid = Math.round(0.5 * (PMin + PMax));
			if (this._CtrlPts_CurvAbs[PMid] < iTotalPathLengthRatio) {
				PMin = PMid;
			} else {
				PMax = PMid;
			}
		}

		var Output = {};
		Output.leftPointIndex = PMin;
		Output.rightPointIndex = PMax;
		Output.normedParam =
			(iTotalPathLengthRatio - this._CtrlPts_CurvAbs[PMin]) /
			(this._CtrlPts_CurvAbs[PMax] - this._CtrlPts_CurvAbs[PMin]);
		Output.lengthParam = (iTotalPathLengthRatio - this._CtrlPts_CurvAbs[PMin]) * this._PathLength;

		var iMin = 0;
		var iMax = this.CUBICINVERSIONSAMPLES - 1;
		while (iMax - iMin > 1) {
			var iMid = Math.round(0.5 * (iMin + iMax));
			if (this._SectionsData[PMin]._l[iMid] < Output.lengthParam) {
				iMin = iMid;
			} else {
				iMax = iMid;
			}
		}
		Output.leftSubPointIndex = iMin;
		Output.rightSubPointIndex = iMax;
		return Output;
	};

	/**
	 * AdvancedPathImpl::LocalCubicParamToTotalPathLengthRatio
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.LocalCubicParamToTotalPathLengthRatio = function (iSection, iParam) {
		// find a curvilinear param X between PointsCubicCurvilinearAbs[iSection] and PointsCubicCurvilinearAbs[iSection+1]
		// such that TotalPathLengthRatioToLocalCubicParam(X) = iParam
		var epsilon = 0.0001; // relative to section length
		var maxIter = 20;
		var iter = 0;

		var PMax = this._CtrlPts_CurvAbs[iSection + 1];
		var PMin = this._CtrlPts_CurvAbs[iSection];
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
	 * AdvancedPathImpl::TotalPathLengthRatioToLocalCubicParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.TotalPathLengthRatioToLocalCubicParam = function (iTotalPathLengthRatio) {
		var SectionParam = this.FindCubicSectionParam(iTotalPathLengthRatio);
		var SectionLengthParam = SectionParam.lengthParam;
		var SectionIndex = SectionParam.leftPointIndex;
		var SectionSubIndex = SectionParam.leftSubPointIndex;

		var delta_l =
			this._SectionsData[SectionIndex]._l[SectionSubIndex + 1] -
			this._SectionsData[SectionIndex]._l[SectionSubIndex];
		var normedLength = (SectionLengthParam - this._SectionsData[SectionIndex]._l[SectionSubIndex]) / delta_l;

		var LocalParam =
			this._SectionsData[SectionIndex]._P1[SectionSubIndex] * Math.pow(normedLength, 3) +
			this._SectionsData[SectionIndex]._P2[SectionSubIndex] * Math.pow(normedLength, 2) +
			this._SectionsData[SectionIndex]._P3[SectionSubIndex] * normedLength +
			this._SectionsData[SectionIndex]._P4[SectionSubIndex];

		var Output = {};
		Output.localParam = LocalParam;
		Output.normedLength = normedLength;
		Output.section = SectionIndex;
		Output.subSection = SectionSubIndex;
		Output.delta_l = delta_l;
		return Output;
	};

	/**
	 * AdvancedPathImpl::FindCubicSectionClosestPointParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.FindCubicSectionClosestPointParam = function (iSection, iTarget) {
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
				var Pt = this.GetPointAtSectionParam(iSection, P);
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
	 * AdvancedPathImpl::GetClosestToPointParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetClosestToPointParam = function (iTarget) {
		var MinDistPtSection = 1;
		var MinDistPtParam = 1;
		var MinDistPtDist = -1;

		for (var s = 0; s < this._NbSections; s++) {
			var X = this.FindCubicSectionClosestPointParam(s, iTarget);
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
	 * AdvancedPathImpl::FindCubicSectionInflectionPointParam
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.FindCubicSectionInflectionPointParam = function (iS, iT) {
		var epsilon = 0.0001; // relative to section length
		var maxIter = 20;

		var prevT = iT;
		var nextT = prevT;
		var iter = 0;

		var K = this.GetThirdDerivativeAtSectionParam(iS);
		K = DSMath.Vector3D.multiplyScalar(K, -1);
		while (iter < maxIter) {
			var T = this.GetTangentAtSectionParam(iS, prevT);
			var C = this.GetCurvatureAtSectionParam(iS, prevT);
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
				var C1 = this.GetCurvatureAtSectionParam(iS, 0);
				var C2 = this.GetCurvatureAtSectionParam(iS - 1, 1);

				if (C1.clone().dot(C2) <= 0) {
					return 0;
				}
			}
			return null;
		}
		if (nextT === 1) {
			if (iS < this._NbSections - 1) {
				var C1 = this.GetCurvatureAtSectionParam(iS, 1);
				var C2 = this.GetCurvatureAtSectionParam(iS + 1, 0);

				if (C1.clone().dot(C2) <= 0) {
					return 1;
				}
			}
			return null;
		}
		return nextT;
	};

	/**
	 * AdvancedPathImpl::GetInflectionPoints
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetInflectionPoints = function () {
		var InflectionPointsParams = [];
		for (var s = 0; s < this._NbSections; s++) {
			// find zeroes of getCurvatureAtCurvilinearAbs between this.PointsCubicCurvilinearAbs[s] and this.PointsCubicCurvilinearAbs[s+1]
			var I1 = this.FindCubicSectionInflectionPointParam(s, 0.5);
			if (I1 !== null) {
				InflectionPointsParams.push(this.LocalCubicParamToTotalPathLengthRatio(s, I1));
			}
		}
		return InflectionPointsParams;
	};

	/**
	 * AdvancedPathImpl::GetPerpendicularBissector
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetPerpendicularBissector = function (iP0, iP1, iP2) {
		const TolLength = DSMath.defaultTolerances.epsgForLengthTest;
		const CATMathJ = new DSMath.Vector3D(0.0, 1.0, 0.0);
		const CATMathK = new DSMath.Vector3D(0.0, 0.0, 1.0);

		var PB = new DSMath.Vector3D(0.0, 0.0, 0.0);
		var V1_null = false;
		var V2_null = false;
		var V1_eq_V2 = false;

		var V1 = new DSMath.Vector3D(iP0.x - iP1.x, iP0.y - iP1.y, iP0.z - iP1.z);
		if (V1.norm() > TolLength) {
			V1.normalize();
		} else {
			V1_null = true;
		}

		var V2 = new DSMath.Vector3D(iP2.x - iP1.x, iP2.y - iP1.y, iP2.z - iP1.z);
		if (V2.norm() > TolLength) {
			V2.normalize();
		} else {
			V2_null = true;
		}

		if (!V1_null && !V2_null) {
			PB = new DSMath.Vector3D(V2.x - V1.x, V2.y - V1.y, V2.z - V1.z);
			if (PB.norm() > TolLength) {
				PB.normalize();
				return PB;
			} else V1_eq_V2 = true;
		}

		if (V1_null && V2_null) {
			PB = new DSMath.Vector3D(1.0, 0.0, 0.0);
			return PB;
		} else if (V1_null || V1_eq_V2) {
			PB = V2.clone();
			PB = PB.cross(CATMathK);
			if (PB.norm() < TolLength) {
				PB = V2.clone();
				PB = PB.cross(CATMathJ);
			}
			PB.normalize();
			return PB;
		} else {
			//if (V2_null)
			PB = V1.clone();
			PB = PB.cross(CATMathK);
			if (PB.norm() < TolLength) {
				PB = V1.clone();
				PB = PB.cross(CATMathJ);
			}
			PB.normalize();
			return PB;
		}
	};

	/**
	 * AdvancedPathImpl::IsNullVector
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.IsNullVector = function (iV) {
		const TolLength = DSMath.defaultTolerances.epsgForLengthTest;
		return iV.norm() <= TolLength;
	};

	/**
	 * AdvancedPathImpl::AreIdenticalPoints
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.AreIdenticalPoints = function (iP1, iP2) {
		var diff = new DSMath.Vector3D(iP1.x - iP2.x, iP1.y - iP2.y, iP1.z - iP2.z);
		return this.IsNullVector(diff);
	};

	/**
	 * AdvancedPathImpl::AreIdenticalVectors
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.AreIdenticalVectors = function (iV1, iV2) {
		var diff = new DSMath.Vector3D(iV1.x - iV2.x, iV1.y - iV2.y, iV1.z - iV2.z);
		return this.IsNullVector(diff);
	};

	/**
	 * AdvancedPathImpl::Order1DegenerateLeftTangents
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.Order1DegenerateLeftTangents = function (iP, iPp1, oTLeft, oTRight) {
		oTRight = new DSMath.Vector3D(0.5 * (iPp1.x - iP.x), 0.5 * (iPp1.x - iP.x), 0.5 * (iPp1.x - iP.x));
		oTLeft = new DSMath.Vector3D(0.0, 0.0, 0.0);
		return this.TangentMode_eDegeneratedLeft;
	};

	/**
	 * AdvancedPathImpl::Order2DegenerateLeftTangents
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.Order2DegenerateLeftTangents = function (iP, iPp1, iPp2, oTLeft, oTRight) {
		if (this.AreIdenticalPoints(iPp1, iP)) {
			oTRight.x = 0.0;
			oTRight.y = 0.0;
			oTRight.z = 0.0;
			oTLeft.x = 0.0;
			oTLeft.y = 0.0;
			oTLeft.z = 0.0;
			return this.TangentMode_eIgnored;
		}
		if (this.AreIdenticalPoints(iPp2, iPp1)) {
			return this.Order1DegenerateLeftTangents(iP, iPp1, oTLeft, oTRight);
		}
		// quadratic Bezier handle
		var PB = this.GetPerpendicularBissector(iP, iPp1, iPp2);
		var d = iPp1.distanceTo(iP) / 3.0;
		var H1 = new DSMath.Point(iPp1.x - d * PB.x, iPp1.y - d * PB.y, iPp1.z - d * PB.z);

		// equivalent cubic Bezier handles
		var H1_right = new DSMath.Point(
			iP.x + (2.0 / 3.0) * (H1.x - iP.x),
			iP.y + (2.0 / 3.0) * (H1.y - iP.y),
			iP.z + (2.0 / 3.0) * (H1.z - iP.z)
		);
		//CATMathPoint H2_left = iPp1 + (2.0 / 3.0) * (H1 - iPp1);

		// equivalent Hermite spline tangents
		oTRight.x = 3.0 * (H1_right.x - iP.x);
		oTRight.y = 3.0 * (H1_right.y - iP.y);
		oTRight.z = 3.0 * (H1_right.z - iP.z);
		oTLeft.x = oTRight.x;
		oTLeft.y = oTRight.y;
		oTLeft.z = oTRight.z;
		return this.TangentMode_eDegeneratedLeft;
	};

	/**
	 * AdvancedPathImpl::AutoSmoothTangents
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.AutoSmoothTangents = function (iPm2, iPm1, iP, iPp1, iPp2, oTLeft, oTRight) {
		if (this.AreIdenticalPoints(iP, iPp1) && this.AreIdenticalPoints(iP, iPm1)) {
			oTRight.x = 0.0;
			oTRight.y = 0.0;
			oTRight.z = 0.0;
			oTLeft.x = 0.0;
			oTLeft.y = 0.0;
			oTLeft.z = 0.0;
			return this.TangentMode_eIgnored;
		} else if (this.AreIdenticalPoints(iP, iPp1)) {
			if (this.AreIdenticalPoints(iPm1, iPm2)) {
				var FlipR = new DSMath.Vector3D(0.0, 0.0, 0.0);
				var FlipL = new DSMath.Vector3D(0.0, 0.0, 0.0);
				this.Order1DegenerateLeftTangents(iP, iPm1, FlipL, FlipR);
				oTRight.x = -FlipL.x;
				oTRight.y = -FlipL.y;
				oTRight.z = -FlipL.z;
				oTLeft.x = -FlipR.x;
				oTLeft.y = -FlipR.y;
				oTLeft.z = -FlipR.z;
				return this.TangentMode_eDegeneratedRight;
			} else {
				var FlipR = new DSMath.Vector3D(0.0, 0.0, 0.0);
				var FlipL = new DSMath.Vector3D(0.0, 0.0, 0.0);
				this.Order2DegenerateLeftTangents(iP, iPm1, iPm2, FlipL, FlipR);
				oTRight.x = -FlipL.x;
				oTRight.y = -FlipL.y;
				oTRight.z = -FlipL.z;
				oTLeft.x = -FlipR.x;
				oTLeft.y = -FlipR.y;
				oTLeft.z = -FlipR.z;
				return this.TangentMode_eDegeneratedRight;
			}
		} else if (this.AreIdenticalPoints(iP, iPm1)) {
			if (this.AreIdenticalPoints(iPp1, iPp2)) {
				this.Order1DegenerateLeftTangents(iP, iPp1, oTLeft, oTRight);
				return this.TangentMode_eDegeneratedLeft;
			} else {
				this.Order2DegenerateLeftTangents(iP, iPp1, iPp2, oTLeft, oTRight);
				return this.TangentMode_eDegeneratedLeft;
			}
		} else {
			var PB = this.GetPerpendicularBissector(iPm1, iP, iPp1);
			// Bezier handles:
			//CATMathVector H1Right = P1 + (d2 / 3.0)*PB;
			//CATMathVector H1Left = P1 - (d0 / 3.0) * PB;
			// Hermit Tangents;
			//oTRight = 3.0 * (H1Right - P1);
			//oTLeft  = 3.0 * (P1 - H1Left);
			var dp1 = iP.distanceTo(iPp1);
			oTRight.x = PB.x * dp1;
			oTRight.y = PB.y * dp1;
			oTRight.z = PB.z * dp1;
			var dm1 = iP.distanceTo(iPm1);
			oTLeft.x = PB.x * dm1;
			oTLeft.y = PB.y * dm1;
			oTLeft.z = PB.z * dm1;
			return this.TangentMode_eAutoSmooth;
		}
	};

	/**
	 * AdvancedPathImpl::SmoothTangents
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SmoothTangents = function (ioTLeft, ioTRight) {
		if (this.IsNullVector(ioTLeft) && this.IsNullVector(ioTRight)) {
			ioTRight.x = 0.0;
			ioTRight.y = 0.0;
			ioTRight.z = 0.0;
			ioTLeft.x = 0.0;
			ioTLeft.y = 0.0;
			ioTLeft.z = 0.0;
			return this.TangentMode_eIgnored;
		} else if (this.IsNullVector(ioTRight)) {
			ioTRight.x = ioTLeft.x;
			ioTRight.y = ioTLeft.y;
			ioTRight.z = ioTLeft.z;
			return this.TangentMode_eSmooth;
		} else if (this.IsNullVector(ioTLeft)) {
			ioTLeft.x = ioTRight.x;
			ioTLeft.y = ioTRight.y;
			ioTLeft.z = ioTRight.z;
			return this.TangentMode_eSmooth;
		} else {
			var LeftWeight = ioTLeft.norm() / (ioTRight.norm() + ioTLeft.norm());
			var RightWeight = ioTRight.norm() / (ioTRight.norm() + ioTLeft.norm());
			ioTLeft.x = LeftWeight * (ioTRight.x + ioTLeft.x);
			ioTLeft.y = LeftWeight * (ioTRight.y + ioTLeft.y);
			ioTLeft.z = LeftWeight * (ioTRight.z + ioTLeft.z);
			ioTRight.x = RightWeight * (ioTRight.x + ioTLeft.x);
			ioTRight.y = RightWeight * (ioTRight.y + ioTLeft.y);
			ioTRight.z = RightWeight * (ioTRight.z + ioTLeft.z);
			return this.TangentMode_eSmooth;
		}
	};

	/**
	 * AdvancedPathImpl::SymmetricalTangents
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SymmetricalTangents = function (ioTLeft, ioTRight) {
		if (this.IsNullVector(ioTLeft) && this.IsNullVector(ioTRight)) {
			ioTRight.x = 0.0;
			ioTRight.y = 0.0;
			ioTRight.z = 0.0;
			ioTLeft.x = 0.0;
			ioTLeft.y = 0.0;
			ioTLeft.z = 0.0;
			return this.TangentMode_eIgnored;
		} else if (this.IsNullVector(ioTRight)) {
			ioTRight.x = ioTLeft.x;
			ioTRight.y = ioTLeft.y;
			ioTRight.z = ioTLeft.z;
			return this.TangentMode_eSymmetrical;
		} else if (this.IsNullVector(ioTLeft)) {
			ioTLeft.x = ioTRight.x;
			ioTLeft.y = ioTRight.y;
			ioTLeft.z = ioTRight.z;
			return this.TangentMode_eSymmetrical;
		} else {
			ioTRight.x = 0.5 * (ioTRight.x + ioTLeft.x);
			ioTRight.y = 0.5 * (ioTRight.y + ioTLeft.y);
			ioTRight.z = 0.5 * (ioTRight.z + ioTLeft.z);
			ioTLeft.x = ioTRight.x;
			ioTLeft.y = ioTRight.y;
			ioTLeft.z = ioTRight.z;

			return this.TangentMode_eSymmetrical;
		}
	};

	/**
	 * AdvancedPathImpl::LinearTangents
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.LinearTangents = function (iPm1, iP, iPp1, oTLeft, oTRight) {
		if (this.AreIdenticalPoints(iP, iPp1) && this.AreIdenticalPoints(iP, iPm1)) {
			oTRight.x = 0.0;
			oTRight.y = 0.0;
			oTRight.z = 0.0;
			oTLeft.x = 0.0;
			oTLeft.y = 0.0;
			oTLeft.z = 0.0;
			return this.TangentMode_eIgnored;
		} else if (this.AreIdenticalPoints(iP, iPp1)) {
			oTRight.x = 0.0;
			oTRight.y = 0.0;
			oTRight.z = 0.0;
			oTLeft.x = 0.5 * (iPm1.x - iP.x);
			oTLeft.y = 0.5 * (iPm1.y - iP.y);
			oTLeft.z = 0.5 * (iPm1.z - iP.z);
			return this.TangentMode_eDegeneratedRight;
		} else if (this.AreIdenticalPoints(iP, iPm1)) {
			oTLeft.x = 0.0;
			oTLeft.y = 0.0;
			oTLeft.z = 0.0;
			oTRight.x = 0.5 * (iPp1.x - iP.x);
			oTRight.y = 0.5 * (iPp1.y - iP.y);
			oTRight.z = 0.5 * (iPp1.z - iP.z);
			return this.TangentMode_eDegeneratedLeft;
		} else {
			oTRight.x = 0.5 * (iPp1.x - iP.x);
			oTRight.y = 0.5 * (iPp1.y - iP.y);
			oTRight.z = 0.5 * (iPp1.z - iP.z);
			oTLeft.x = 0.5 * (iPm1.x - iP.x);
			oTLeft.y = 0.5 * (iPm1.y - iP.y);
			oTLeft.z = 0.5 * (iPm1.z - iP.z);
			return this.TangentMode_eLinear;
		}
	};

	/**
	 * AdvancedPathImpl::FreeTangents
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.FreeTangents = function (ioTLeft, ioTRight) {
		if (this.IsNullVector(ioTLeft) && this.IsNullVector(ioTRight)) {
			ioTRight.x = 0.0;
			ioTRight.y = 0.0;
			ioTRight.z = 0.0;
			ioTLeft.x = 0.0;
			ioTLeft.y = 0.0;
			ioTLeft.z = 0.0;
			return this.TangentMode_eIgnored;
		} else if (this.IsNullVector(ioTRight)) {
			ioTRight.x = 0.0;
			ioTRight.y = 0.0;
			ioTRight.z = 0.0;
			return this.TangentMode_eFree;
		} else if (this.IsNullVector(ioTLeft)) {
			ioTLeft.x = 0.0;
			ioTLeft.y = 0.0;
			ioTLeft.z = 0.0;
			return this.TangentMode_eFree;
		} else {
			return this.TangentMode_eFree;
		}
	};

	/**
	 * AdvancedPathImpl::ComputeAndApplyTangentMode
	 * returns {Modified , ComputedMode}
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.ComputeAndApplyTangentMode = function (iCtrlPt, iMode) {
		const NullVec = new DSMath.Vector3D(0.0, 0.0, 0.0);
		var Out = {};

		var oComputedMode = this.TangentMode_eUndefined;
		var oModified = false;

		if (iCtrlPt < 0 || iCtrlPt >= this._NbCtrlPts) {
			oComputedMode = this.TangentMode_eUndefined;
			oModified = iMode !== oComputedMode;
			Out = { Modified: oModified, ComputedMode: oComputedMode };
			return Out;
		}

		var ComputedLeftTgt = this._CtrlPts_LeftTgt[iCtrlPt].clone();
		var ComputedRightTgt = this._CtrlPts_RightTgt[iCtrlPt].clone();

		if (this._NbCtrlPts === 1) {
			oModified =
				!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], NullVec) ||
				!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], NullVec);
			this._CtrlPts_RightTgt[iCtrlPt] = NullVec.clone();
			this._CtrlPts_LeftTgt[iCtrlPt] = NullVec.clone();
			oComputedMode = this.TangentMode_eIgnored;
			oModified = oModified || iMode !== oComputedMode;
			Out = { Modified: oModified, ComputedMode: oComputedMode };
			return Out;
		}
		// below this point we have at least 2 control points
		// EAutoSmooth = 1,			// tangents  are automatically computed based on relative positions of next and previous control points to achieve a natural looking smoothness
		if (iMode === this.TangentMode_eAutoSmooth) {
			if (this._Closed) {
				oComputedMode = this.AutoSmoothTangents(
					this._CtrlPts_Pos[(iCtrlPt - 2 + this._NbCtrlPts) % this._NbCtrlPts],
					this._CtrlPts_Pos[(iCtrlPt - 1 + this._NbCtrlPts) % this._NbCtrlPts],
					this._CtrlPts_Pos[iCtrlPt],
					this._CtrlPts_Pos[(iCtrlPt + 1 + this._NbCtrlPts) % this._NbCtrlPts],
					this._CtrlPts_Pos[(iCtrlPt + 2 + this._NbCtrlPts) % this._NbCtrlPts],
					ComputedLeftTgt,
					ComputedRightTgt
				);

				oModified =
					!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
					!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
				//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
				//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
				this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
				this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());

				if (oModified) {
					this.FixUp(iCtrlPt);
				}
				oModified = oModified || iMode !== oComputedMode;
				Out = { Modified: oModified, ComputedMode: oComputedMode };
				return Out;
			} // if (_Closed)
			else {
				if (iCtrlPt === 0) {
					// start point of an open path
					if (this._NbCtrlPts > 2) {
						oComputedMode = this.Order2DegenerateLeftTangents(
							this._CtrlPts_Pos[0],
							this._CtrlPts_Pos[1],
							this._CtrlPts_Pos[2],
							ComputedLeftTgt,
							ComputedRightTgt
						);
						oModified =
							!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
							!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
						//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
						//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
						this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
						this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
						if (oModified) {
							this.FixUp(iCtrlPt);
						}
						oModified = oModified || iMode !== oComputedMode;
						Out = { Modified: oModified, ComputedMode: oComputedMode };
						return Out;
					} else {
						oComputedMode = this.Order1DegenerateLeftTangents(
							this._CtrlPts_Pos[0],
							this._CtrlPts_Pos[1],
							ComputedLeftTgt,
							ComputedRightTgt
						);
						oModified =
							!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
							!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
						//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
						//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
						this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
						this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
						if (oModified) {
							this.FixUp(iCtrlPt);
						}
						oModified = oModified || iMode !== oComputedMode;
						Out = { Modified: oModified, ComputedMode: oComputedMode };
						return Out;
					}
				} // if (iCtrlPt == 0) // start point of an open path
				if (iCtrlPt === this._NbCtrlPts - 1) {
					// end point of an open path
					if (this._NbCtrlPts > 2) {
						var RTgt = new DSMath.Vector3D(0.0, 0.0, 0.0);
						var LTgt = new DSMath.Vector3D(0.0, 0.0, 0.0);
						oComputedMode = this.Order2DegenerateLeftTangents(
							this._CtrlPts_Pos[iCtrlPt],
							this._CtrlPts_Pos[iCtrlPt - 1],
							this._CtrlPts_Pos[iCtrlPt - 2],
							LTgt,
							RTgt
						);
						ComputedRightTgt = LTgt.negate();
						ComputedLeftTgt = RTgt.negate();

						if (oComputedMode === this.TangentMode_eDegeneratedLeft) {
							oComputedMode = this.TangentMode_eDegeneratedRight;
						}
						oModified =
							!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
							!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
						//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
						//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
						this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
						this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
						if (oModified) {
							this.FixUp(iCtrlPt);
						}
						oModified = oModified || iMode !== oComputedMode;
						Out = { Modified: oModified, ComputedMode: oComputedMode };
						return Out;
					} else {
						var RTgt = new DSMath.Vector3D(0.0, 0.0, 0.0);
						var LTgt = new DSMath.Vector3D(0.0, 0.0, 0.0);

						oComputedMode = this.Order1DegenerateLeftTangents(
							this._CtrlPts_Pos[iCtrlPt],
							this._CtrlPts_Pos[iCtrlPt - 1],
							LTgt,
							RTgt
						);
						ComputedRightTgt = LTgt.negate();
						ComputedLeftTgt = RTgt.negate();
						if (oComputedMode === this.TangentMode_eDegeneratedLeft) {
							oComputedMode = this.TangentMode_eDegeneratedRight;
						}

						oModified =
							!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
							!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
						//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
						//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
						this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
						this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
						if (oModified) {
							this.FixUp(iCtrlPt);
						}
						oModified = oModified || iMode !== oComputedMode;
						Out = { Modified: oModified, ComputedMode: oComputedMode };
						return Out;
					}
				} // if (iCtrlPt == (_NbCtrlPts - 1)) // end point of an open path // open path, not first or last point
				else {
					var LeftLeft = this._CtrlPts_Pos[iCtrlPt - 1].clone();
					if (iCtrlPt - 2 >= 0 && iCtrlPt - 2 < this._NbCtrlPts) {
						LeftLeft = this._CtrlPts_Pos[iCtrlPt - 2].clone();
					}

					var RightRight = this._CtrlPts_Pos[iCtrlPt + 1].clone();
					if (iCtrlPt + 2 >= 0 && iCtrlPt + 2 < this._NbCtrlPts) {
						RightRight = this._CtrlPts_Pos[iCtrlPt + 2].clone();
					}

					oComputedMode = this.AutoSmoothTangents(
						LeftLeft,
						this._CtrlPts_Pos[iCtrlPt - 1],
						this._CtrlPts_Pos[iCtrlPt],
						this._CtrlPts_Pos[iCtrlPt + 1],
						RightRight,
						ComputedLeftTgt,
						ComputedRightTgt
					);

					oModified =
						!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
						!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
					//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
					//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
					this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
					this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
					if (oModified) {
						this.FixUp(iCtrlPt);
					}
					oModified = oModified || iMode !== oComputedMode;
					Out = { Modified: oModified, ComputedMode: oComputedMode };
					return Out;
				}
			} // open path
		} // if (iMode == this.TangentMode_eAutoSmooth)

		//ESmooth = 2,				// right and left tangents are colinear, there are no additional constraints on the lengths or directions of the tangents
		if (iMode === this.TangentMode_eSmooth) {
			if (
				this.IsNullVector(this._CtrlPts_LeftTgt[iCtrlPt]) &&
				this.IsNullVector(this._CtrlPts_RightTgt[iCtrlPt])
			) {
				var oOut = this.ComputeAndApplyTangentMode(iCtrlPt, this.TangentMode_eAutoSmooth); // generate smooth tangents from scratch
				oModified = oOut.Modified;
				oComputedMode = oOut.ComputedMode;

				if (oModified) {
					this.FixUp(iCtrlPt);
				}
				oModified = oModified || iMode !== oComputedMode;
				Out = { Modified: oModified, ComputedMode: oComputedMode };
				return Out;
			} else {
				oComputedMode = this.SmoothTangents(ComputedLeftTgt, ComputedRightTgt);
				oModified =
					!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
					!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);

				//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
				//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
				this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
				this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
				if (oModified) {
					this.FixUp(iCtrlPt);
				}
				oModified = oModified || iMode !== oComputedMode;
				Out = { Modified: oModified, ComputedMode: oComputedMode };
				return Out;
			}
		} // if (iMode == this.TangentMode_eSmooth)

		// ESymmetrical = 3,			// right and left tangents are colinear and of same length, there are no constraints on the directions of the tangents
		if (iMode === this.TangentMode_eSymmetrical) {
			if (
				this.IsNullVector(this._CtrlPts_LeftTgt[iCtrlPt]) &&
				this.IsNullVector(this._CtrlPts_RightTgt[iCtrlPt])
			) {
				var oOut = this.ComputeAndApplyTangentMode(iCtrlPt, this.TangentMode_eAutoSmooth); // try to generate smooth tangents from scratch
			}
			// oComputedMode = this.SymmetricalTangents(this._CtrlPts_LeftTgt[iCtrlPt], this._CtrlPts_RightTgt[iCtrlPt]);
			oComputedMode = this.SymmetricalTangents(ComputedLeftTgt, ComputedRightTgt);
			this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
			this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
			
			oModified =
				!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], NullVec) ||
				!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], NullVec);
			if (oModified) {
				this.FixUp(iCtrlPt);
			}
			oModified = oModified || iMode !== oComputedMode;
			Out = { Modified: oModified, ComputedMode: oComputedMode };
			return Out;
		} // if (iMode == this.TangentMode_eSymmetrical)

		//ELinear = 4,				// the right tangent points toward the next control point, the left tangent points towards the previous control point, tangents at the extremities of a path section are colinear and equal => this section is rectilinear
		if (iMode === this.TangentMode_eLinear) {
			if (this._Closed) {
				oComputedMode = this.LinearTangents(
					this._CtrlPts_Pos[(iCtrlPt - 1 + this._NbCtrlPts) % this._NbCtrlPts],
					this._CtrlPts_Pos[iCtrlPt],
					this._CtrlPts_Pos[(iCtrlPt + 1 + this._NbCtrlPts) % this._NbCtrlPts],
					ComputedLeftTgt,
					ComputedRightTgt
				);

				oModified =
					!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
					!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
				//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
				//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
				this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
				this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
				if (oModified) {
					this.FixUp(iCtrlPt);
				}
				oModified = oModified || iMode !== oComputedMode;
				Out = { Modified: oModified, ComputedMode: oComputedMode };
				return Out;
			} else {
				if (iCtrlPt === 0) {
					// start point of an open path
					oComputedMode = this.Order1DegenerateLeftTangents(
						this._CtrlPts_Pos[0],
						this._CtrlPts_Pos[1],
						ComputedLeftTgt,
						ComputedRightTgt
					);
					oModified =
						!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
						!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
					//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
					//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
					this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
					this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
					if (oModified) {
						this.FixUp(iCtrlPt);
					}
					oModified = oModified || iMode !== oComputedMode;
					Out = { Modified: oModified, ComputedMode: oComputedMode };
					return Out;
				}
				if (iCtrlPt === this._NbCtrlPts - 1) {
					// end point of an open path
					var RTgt = new DSMath.Vector3D(0.0, 0.0, 0.0);
					var LTgt = new DSMath.Vector3D(0.0, 0.0, 0.0);
					oComputedMode = this.Order1DegenerateLeftTangents(
						this._CtrlPts_Pos[iCtrlPt],
						this._CtrlPts_Pos[iCtrlPt - 1],
						LTgt,
						RTgt
					);
					ComputedRightTgt = LTgt.negate();
					ComputedLeftTgt = RTgt.negate();
					if (oComputedMode === this.TangentMode_eDegeneratedLeft) {
						oComputedMode = this.TangentMode_eDegeneratedRight;
					}

					oModified =
						!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
						!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
					//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt;
					//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt;
					this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
					this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
					if (oModified) {
						this.FixUp(iCtrlPt);
					}
					oModified = oModified || iMode !== oComputedMode;
					Out = { Modified: oModified, ComputedMode: oComputedMode };
					return Out;
				} else {
					oComputedMode = this.LinearTangents(
						this._CtrlPts_Pos[iCtrlPt - 1],
						this._CtrlPts_Pos[iCtrlPt],
						this._CtrlPts_Pos[iCtrlPt + 1],
						ComputedLeftTgt,
						ComputedRightTgt
					);

					oModified =
						!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
						!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
					//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
					//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
					this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
					this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
					if (oModified) {
						this.FixUp(iCtrlPt);
					}
					oModified = oModified || iMode !== oComputedMode;
					Out = { Modified: oModified, ComputedMode: oComputedMode };
					return Out;
				}
			} // !_Closed
		} // if (iMode == this.TangentMode_eLinear)

		//EFree = 5,					 // no constraints on the tangents, if left and right tangents are not colinear
		if (iMode === this.TangentMode_eFree) {
			oComputedMode = this.FreeTangents(ComputedLeftTgt, ComputedRightTgt);

			oModified =
				!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
				!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
			//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
			//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
			this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
			this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
			if (oModified) {
				this.FixUp(iCtrlPt);
			}
			oModified = oModified || iMode !== oComputedMode;
			Out = { Modified: oModified, ComputedMode: oComputedMode };
			return Out;
		}

		if (iMode === this.TangentMode_eDegeneratedLeft || iMode === this.TangentMode_eDegeneratedRight) {
			oComputedMode = this.FreeTangents(ComputedLeftTgt, ComputedRightTgt);

			oModified =
				!this.AreIdenticalVectors(this._CtrlPts_LeftTgt[iCtrlPt], ComputedLeftTgt) ||
				!this.AreIdenticalVectors(this._CtrlPts_RightTgt[iCtrlPt], ComputedRightTgt);
			//this._CtrlPts_LeftTgt[iCtrlPt] = ComputedLeftTgt.clone();
			//this._CtrlPts_RightTgt[iCtrlPt] = ComputedRightTgt.clone();
			this.SetCtrlPtLeftT(iCtrlPt, ComputedLeftTgt.clone());
			this.SetCtrlPtRightT(iCtrlPt, ComputedRightTgt.clone());
			if (oModified) {
				this.FixUp(iCtrlPt);
			}
			oModified = oModified || iMode !== oComputedMode;
			Out = { Modified: oModified, ComputedMode: oComputedMode };
			return Out;
		} else {
			oComputedMode = this.TangentMode_eIgnored;
			oModified = oModified || iMode !== oComputedMode;
			Out = { Modified: oModified, ComputedMode: oComputedMode };
			return Out;
		}
	};

	/**
	 * AdvancedPathImpl::FixUp
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.FixUp = function (iCtrlPt) {
		const TolAngle = DSMath.defaultTolerances.epsgForAngleTest;
		const CATMathK = new DSMath.Vector3D(0.0, 0.0, 1.0);
		const CATMathJ = new DSMath.Vector3D(0.0, 1.0, 0.0);

		var LeftTgt = this._CtrlPts_LeftTgt[iCtrlPt].clone();
		var RightTgt = this._CtrlPts_RightTgt[iCtrlPt].clone();
		var Up = this._CtrlPts_Up[iCtrlPt].clone();

		// LeftTgt=RightTgt=0 : any Up is OK
		if (this.IsNullVector(LeftTgt) && this.IsNullVector(RightTgt)) {
			return;
		} else if (this.IsNullVector(LeftTgt)) {
			// LeftTgt=0, Up needs to be ⟂ to RightTgt
			RightTgt.normalize();
			// Up already ⟂ to RightTgt
			if (Math.abs(RightTgt.getAngleTo(Up) - DSMath.constants.PIBY2) < TolAngle) {
				return;
			}
			// Up currently colinear to RightTgt : arbitrary perpendicular direction is chosen for Up
			if (
				Math.abs(RightTgt.getAngleTo(Up) - 0) < TolAngle ||
				Math.abs(RightTgt.getAngleTo(Up) - DSMath.constants.PI) < TolAngle
			) {
				Up = RightTgt.clone().cross(CATMathK);
				if (this.IsNullVector(Up)) {
					Up = RightTgt.clone().cross(CATMathJ);
				}
				Up.normalize();
				//this._CtrlPts_Up[iCtrlPt] = Up.clone();
				this.SetCtrlPtUp(iCtrlPt, Up.clone());
				return;
			}
			// rotate Up around RightTgt to achieve Up⟂RightTgt
			else {
				var Tmp = RightTgt.clone().cross(Up);
				Tmp.normalize();
				Up = Tmp.cross(RightTgt);
				Up.normalize();
				//this._CtrlPts_Up[iCtrlPt] = Up.clone();
				this.SetCtrlPtUp(iCtrlPt, Up.clone());
				return;
			}
		} // else if (this.IsNullVector(LeftTgt)) {
		else if (this.IsNullVector(RightTgt)) {
			// RightTgt=0, Up needs to be ⟂ to LeftTgt
			LeftTgt.normalize();
			if (Math.abs(LeftTgt.getAngleTo(Up) - DSMath.constants.PIBY2) < TolAngle) {
				return;
			}
			if (
				Math.abs(LeftTgt.getAngleTo(Up) - 0) < TolAngle ||
				Math.abs(LeftTgt.getAngleTo(Up) - DSMath.constants.PI) < TolAngle
			) {
				Up = LeftTgt.clone().cross(CATMathK);
				if (this.IsNullVector(Up)) {
					Up = LeftTgt.clone().cross(CATMathJ);
				}
				Up.normalize();
				//this._CtrlPts_Up[iCtrlPt] = Up.clone();
				this.SetCtrlPtUp(iCtrlPt, Up.clone());
				return;
			} else {
				var Tmp = LeftTgt.clone().cross(Up);
				Tmp.normalize();
				Up = Tmp.cross(LeftTgt);
				Up.normalize();
				//this._CtrlPts_Up[iCtrlPt] = Up.clone();
				this.SetCtrlPtUp(iCtrlPt, Up.clone());
				return;
			}
		} else {
			// RightTg and LeftTgt not 0

			// LeftTgt and RightTgt //
			if (
				Math.abs(LeftTgt.getAngleTo(RightTgt) - 0) < TolAngle ||
				Math.abs(LeftTgt.getAngleTo(RightTgt) - DSMath.constants.PI) < TolAngle
			) {
				// they are both ⟂ to Up: OK
				if (Math.abs(LeftTgt.getAngleTo(Up) - DSMath.constants.PIBY2) < TolAngle) {
					return;
				}
				// LeftTgt and RightTgt and Up // : arbitrary perpendicular direction is chosen for Up
				if (
					Math.abs(LeftTgt.getAngleTo(Up) - 0) < TolAngle ||
					Math.abs(LeftTgt.getAngleTo(Up) - DSMath.constants.PI) < TolAngle
				) {
					Up = LeftTgt.clone().cross(CATMathK);
					if (this.IsNullVector(Up)) {
						Up = LeftTgt.clone().cross(CATMathJ);
					}
					Up.normalize();
					//this._CtrlPts_Up[iCtrlPt] = Up.clone();
					this.SetCtrlPtUp(iCtrlPt, Up.clone());
					return;
				}
				// rotate Up around RightTgt to achieve Up⟂RightTgt
				else {
					var Tmp = RightTgt.clone().cross(Up);
					Tmp.normalize();
					Up = Tmp.cross(RightTgt);
					Up.normalize();
					//this._CtrlPts_Up[iCtrlPt] = Up.clone();
					this.SetCtrlPtUp(iCtrlPt, Up.clone());
					return;
				}
			} else {
				// LeftTgt and RightTgt NOT //
				// they are both ⟂ to Up: OK
				if (
					Math.abs(LeftTgt.getAngleTo(Up) - DSMath.constants.PIBY2) < TolAngle &&
					Math.abs(RightTgt.getAngleTo(Up) - DSMath.constants.PIBY2) < TolAngle
				) {
					return;
				} else {
					var Perpendicular = LeftTgt.clone().cross(RightTgt);
					Perpendicular.normalize();
					Up = Perpendicular.dot(Up) > 0 ? Perpendicular.clone() : Perpendicular.negate().clone();
					//this._CtrlPts_Up[iCtrlPt] = Up.clone();
					this.SetCtrlPtUp(iCtrlPt, Up.clone());
					return;
				}
			}
		}
	};

	/**
	 * AdvancedPathImpl::GetCtrlPtPos
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCtrlPtPos = function (iIndex) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			return this._CtrlPts_Pos[iIndex].clone();
		}
		return new DSMath.Point(0.0, 0.0, 0.0);
	};

	/**
	 * AdvancedPathImpl::SetCtrlPtPos
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetCtrlPtPos = function (iIndex, iPt) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			if (this.AreIdenticalPoints(iPt, this._CtrlPts_Pos[iIndex])) {
				return;
			}

			this._CtrlPts_Pos[iIndex] = iPt.clone();
			if (this._Closed) {
				// the two sections directly adjacent to point
				this.InsertInTagSectionsForRebuild(iIndex % this._NbSections);
				this.InsertInTagSectionsForRebuild((iIndex - 1 + this._NbSections) % this._NbSections);

				// if the tangents of points i+1 / i-1 are computed based on point i's position, then the next sections should also be rebuilt
				if (this._CtrlPts_Mode[(iIndex + 1) % this._NbSections] === this.TangentMode_eAutoSmooth) {
					this.InsertInTagSectionsForRebuild((iIndex + 1) % this._NbSections);
				}
				if (
					this._CtrlPts_Mode[(iIndex - 1 + this._NbSections) % this._NbSections] ==
					this.TangentMode_eAutoSmooth
				) {
					this.InsertInTagSectionsForRebuild((iIndex - 2 + this._NbSections) % this._NbSections);
				}
			} // if (this._Closed)
			else {
				// the two sections directly adjacent to point
				if (iIndex < this._NbSections) {
					this.InsertInTagSectionsForRebuild(iIndex);
				}
				if (iIndex > 0) {
					this.InsertInTagSectionsForRebuild(iIndex - 1);
				}

				// if the tangents of points i+1 / i-1 are computed based on point i's position, then the next sections should also be rebuilt
				if (iIndex + 1 < this._NbSections && this._CtrlPts_Mode[iIndex + 1] === this.TangentMode_eAutoSmooth) {
					this.InsertInTagSectionsForRebuild(iIndex + 1);
				}
				if (iIndex - 1 > 0 && this._CtrlPts_Mode[iIndex - 2] === this.TangentMode_eAutoSmooth) {
					this.InsertInTagSectionsForRebuild(iIndex - 2);
				}
			} // !_Closed
		} // if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
	};

	/**
	 * AdvancedPathImpl::GetCtrlPtLeftT
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCtrlPtLeftT = function (iIndex) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			return this._CtrlPts_LeftTgt[iIndex].clone();
		}
		return new DSMath.Vector3D(1.0, 0.0, 0.0);
	};

	/**
	 * AdvancedPathImpl::SetCtrlPtLeftT
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetCtrlPtLeftT = function (iIndex, iLeftT) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			if (this.AreIdenticalVectors(iLeftT, this._CtrlPts_LeftTgt[iIndex])) {
				return;
			}
			this._CtrlPts_LeftTgt[iIndex] = iLeftT;

			if (this._Closed) {
				// the sections on the left of point
				this.InsertInTagSectionsForRebuild((iIndex - 1 + this._NbSections) % this._NbSections);
			} else {
				// the sections on the left of point
				if (iIndex > 0) {
					this.InsertInTagSectionsForRebuild(iIndex - 1);
				}
			}
		}
	};

	/**
	 * AdvancedPathImpl::GetCtrlPtRightT
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCtrlPtRightT = function (iIndex) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			return this._CtrlPts_RightTgt[iIndex];
		}
		return new DSMath.Vector3D(1.0, 0.0, 0.0);
	};

	/**
	 * AdvancedPathImpl::SetCtrlPtRightT
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetCtrlPtRightT = function (iIndex, iRightT) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			if (this.AreIdenticalVectors(iRightT, this._CtrlPts_RightTgt[iIndex])) {
				return;
			}

			this._CtrlPts_RightTgt[iIndex] = iRightT.clone();

			if (this._Closed) {
				// the section on the right of point
				this.InsertInTagSectionsForRebuild(iIndex % this._NbSections);
			} else {
				// the section on the right of point
				if (iIndex < this._NbSections) this.InsertInTagSectionsForRebuild(iIndex);
			}
		}
	};

	/**
	 * AdvancedPathImpl::GetCtrlPtUp
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCtrlPtUp = function (iIndex) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			return this._CtrlPts_Up[iIndex].clone();
		}
		return DSMath.Vector3D(0.0, 0.0, 1.0);
	};

	/**
	 * AdvancedPathImpl::SetCtrlPtUp
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetCtrlPtUp = function (iIndex, iUp) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			if (this.AreIdenticalVectors(iUp, this._CtrlPts_Up[iIndex])) {
				return;
			}

			this._CtrlPts_Up[iIndex] = iUp;
			if (this._Closed) {
				// the two sections directly adjacent to point
				this.InsertInTagSectionsForRebuild(iIndex % this._NbSections);
				this.InsertInTagSectionsForRebuild((iIndex - 1 + this._NbSections) % this._NbSections);

				// the next sections should also be rebuilt
				this.InsertInTagSectionsForRebuild((iIndex + 1) % this._NbSections);
				this.InsertInTagSectionsForRebuild((iIndex - 2 + this._NbSections) % this._NbSections);
			} else {
				// the two sections directly adjacent to point
				if (iIndex < this._NbSections) {
					this.InsertInTagSectionsForRebuild(iIndex);
				}
				if (iIndex > 0) {
					this.InsertInTagSectionsForRebuild(iIndex - 1);
				}

				// the next sections should also be rebuilt
				if (iIndex + 1 < this._NbSections) {
					this.InsertInTagSectionsForRebuild(iIndex + 1);
				}
				if (iIndex - 1 > 0) {
					this.InsertInTagSectionsForRebuild(iIndex - 2);
				}
			}
		}
	};

	/**
	 * AdvancedPathImpl::GetCtrlPtRoll
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCtrlPtRoll = function (iIndex) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			return this._CtrlPts_Roll[iIndex];
		}
		return 0;
	};

	/**
	 * AdvancedPathImpl::SetCtrlPtRoll
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetCtrlPtRoll = function (iIndex, iRoll) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			if (this._CtrlPts_Roll[iIndex] === iRoll) {
				return;
			}

			this._CtrlPts_Roll[iIndex] = iRoll;
			if (this._Closed) {
				// the section on the right of point iIndex + the two sections directly adjacent to it
				this.InsertInTagSectionsForRebuild(iIndex % this._NbSections);
				this.InsertInTagSectionsForRebuild((iIndex - 1 + this._NbSections) % this._NbSections);
				this.InsertInTagSectionsForRebuild((iIndex + 1 + this._NbSections) % this._NbSections);
			} else {
				// the section on the right of point iIndex + the two sections directly adjacent to it
				if (iIndex < this._NbSections) {
					this.InsertInTagSectionsForRebuild(iIndex);
				}
				if (iIndex + 1 < this._NbSections) {
					this.InsertInTagSectionsForRebuild(iIndex + 1);
				}

				if (iIndex > 0) {
					this.InsertInTagSectionsForRebuild(iIndex - 1);
				}
			}
		}
	};

	/**
	 * AdvancedPathImpl::GetCtrlPtMode
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.GetCtrlPtMode = function (iIndex) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			return this._CtrlPts_Mode[iIndex];
		}
		return 0;
	};

	/**
	 * AdvancedPathImpl::SetCtrlPtMode
	 * this requires a call to CheckValidity
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetCtrlPtMode = function (iIndex, iMode) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			if (this._CtrlPts_Mode[iIndex] === iMode) {
				return;
			}

			this._CtrlPts_Mode[iIndex] = iMode;
			if (this._Closed) {
				// the two sections directly adjacent to point
				this.InsertInTagSectionsForRebuild(iIndex % this._NbSections);
				this.InsertInTagSectionsForRebuild((iIndex - 1 + this._NbSections) % this._NbSections);
			} else {
				// the two sections directly adjacent to point
				if (iIndex < this._NbSections) this.InsertInTagSectionsForRebuild(iIndex);
				if (iIndex > 0) this.InsertInTagSectionsForRebuild(iIndex - 1);
			}
		}
	};

	/**
	 * AdvancedPathImpl::SetClosed
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetClosed = function (ibClosed) {
		if (ibClosed === this._Closed) {
			return;
		} else {
			if (this._Closed) {
				this._PathLength -= this._SectionsData[this._NbSections - 1]._Length;
				this._NbSections--;
				this._SectionsData.splice(-1);
				this._CtrlPts_CurvAbs.splice(-1);
				this._Closed = false;

				this.CheckValidity();
				if (this._NbSections > 0) {
					this.InsertInTagSectionsForRebuild(0);
					this.InsertInTagSectionsForRebuild(this._NbSections - 1);
				}
			} else {
				this._Closed = true;
				this._NbSections++;
				var pNewSection = this.InitSectionData();
				this._SectionsData[this._NbSections - 1] = pNewSection;
				this.RebuildSection(this._NbSections - 1);

				this.CheckValidity();
				if (this._NbSections > 0) {
					this.InsertInTagSectionsForRebuild(0);
					this.InsertInTagSectionsForRebuild(this._NbSections - 1);
					this.InsertInTagSectionsForRebuild(this._NbSections - 2);
				}
			}
		}
	};

	/**
	 * AdvancedPathImpl::SetFlagManipulated
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.SetFlagManipulated = function (iIndex, ibManip) {
		if (iIndex >= 0 && iIndex < this._NbCtrlPts) {
			this._Saved_FlaggedManipulated[iIndex] = ibManip;
		}
	};

	/**
	 * AdvancedPathImpl::CheckValidity
	 *
	 * after data is modified or set, call this to check that:
	 * Tangents are made perpendicualr to up and consistent with Auto Mode
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.CheckValidity = function () {
		for (var p = 0; p < this._NbCtrlPts; p++) {
			var UserMode = this._CtrlPts_Mode[p];
			var Out = this.ComputeAndApplyTangentMode(p, UserMode); // this also call FixUp
			this._CtrlPts_ComputedMode[p] = Out.ComputedMode;
		}
	};

	/**
	 * AdvancedPathImpl::UpdateCurve
	 *
	 * rebuilds sections in _TagSectionsForRebuild
	 *
	 * @method
	 * @private
	 */
	PathImpl_Advanced.prototype.UpdateCurve = function () {
		for (var i = 0; i < this._TagSectionsForRebuild.length; i++) {
			var s = this._TagSectionsForRebuild[i];
			this.RebuildSection(s);
		}
		this._TagSectionsForRebuild = [];
	};

	//////////////////////////////////////////////////////////////////////////////
	//                            STU expositions.                              //
	//////////////////////////////////////////////////////////////////////////////
	STU.PathImpl_Advanced = PathImpl_Advanced;
	return PathImpl_Advanced;
});

define('StuVirtualObjects/StuPathImpl_Advanced', ['DS/StuVirtualObjects/StuPathImpl_Advanced'], function (
	PathImpl_Advanced
) {
	'use strict';

	return PathImpl_Advanced;
});
