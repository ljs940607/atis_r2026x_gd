define('DS/StuVirtualObjects/StuPathImpl_Linear', ['DS/StuCore/StuContext', 'DS/MathematicsES/MathsDef'], function (STU, DSMath) {
	'use strict';

/**
* Full JS path implementation
*
* @class
* @private
*/
    var PathImpl_Linear = function () {
        this.name = 'PathImpl_Linear';

		this.Points = [];
		this.PointsLinearCurvilinearAbs = [];
		this.LinearSectionLength = [];
		this.LinearPathLength = 0;
    };

/**
* @method
* @private
*/
	PathImpl_Linear.prototype.setData = function (iPoints) {
		this.Points = [];
		this.PointsLinearCurvilinearAbs = [];
		this.LinearSectionLength = [];
		this.LinearPathLength = 0;

		this.Points = iPoints;
		this.nbCtrlPts = this.Points.length;
		this.nbSections = this.nbCtrlPts - 1;
		this.BuildLinearData();
	};

/**
* @method
* @private
*/
	PathImpl_Linear.prototype.BuildLinearData = function () {
		this.LinearPathLength = 0.0;

		for (var s = 0; s < this.nbSections; s++) {
			var T = new DSMath.Vector3D((this.Points[s + 1].x - this.Points[s].x), (this.Points[s + 1].y - this.Points[s].y), (this.Points[s + 1].z - this.Points[s].z));
			this.LinearSectionLength[s] = T.norm();
			this.LinearPathLength += this.LinearSectionLength[s];
		}

		this.PointsLinearCurvilinearAbs[0] = 0;
		for (var p = 1; p < this.nbCtrlPts; p++) {
			this.PointsLinearCurvilinearAbs[p] = this.PointsLinearCurvilinearAbs[p - 1] + this.LinearSectionLength[p - 1] / this.LinearPathLength;
		}
	};

/**
* @method
* @private
*/
	PathImpl_Linear.prototype.getPointAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var LocalParams = this.TotalPathLengthRatioToLocalLinearParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var LocalParam = LocalParams.localParam;
		var PtStart = this.Points[iSection];
		var PtEnd = this.Points[iSection + 1];
		var P3 = new DSMath.Point(PtStart.x + LocalParam * (PtEnd.x - PtStart.x), PtStart.y + LocalParam * (PtEnd.y - PtStart.y), PtStart.z + LocalParam * (PtEnd.z - PtStart.z));
		return P3;
	};

/**
* @method
* @private
*/
	PathImpl_Linear.prototype.getTangentAtCurvilinearAbs = function (iTotalPathLengthRatio) {	
		var LocalParams = this.TotalPathLengthRatioToLocalLinearParam(iTotalPathLengthRatio);
		var iSection = LocalParams.section;
		var PtStart = this.Points[iSection];
		var PtEnd = this.Points[iSection + 1];
		const T3 = new DSMath.Vector3D((PtEnd.x - PtStart.x), (PtEnd.y - PtStart.y), (PtEnd.z - PtStart.z));
		T3.normalize();
		T3.multiplyScalar(this.linearPathLength);
		return T3;
	};

/**
* @method
* @private
*/
	PathImpl_Linear.prototype.getCurvatureAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var C3 = new DSMath.Vector3D(0.0,0.0,0.0);
		return C3;
	};

	/**
* @method
* @private
*/
	PathImpl_Linear.prototype.getThirdDerivativeAtCurvilinearAbs = function (iTotalPathLengthRatio) {
		var K3 = new DSMath.Vector3D(0.0, 0.0, 0.0);
		return K3;
	};


/**
* @method
* @private
*/
	PathImpl_Linear.prototype.TotalPathLengthRatioToLocalLinearParam = function (iTotalPathLengthRatio) {
		var PMin = 0;
		var PMax = this.nbCtrlPts-1;

		while (PMax - PMin > 1) {
			var PMid = Math.round(0.5 * (PMin + PMax));
			if (this.PointsLinearCurvilinearAbs[PMid] < iTotalPathLengthRatio) {
				PMin = PMid;
			}
			else {
				PMax = PMid;
			}
		}

		var Output = {};
		Output.localParam = (iTotalPathLengthRatio - this.PointsLinearCurvilinearAbs[PMin]) / (this.PointsLinearCurvilinearAbs[PMax] - this.PointsLinearCurvilinearAbs[PMin]);
		Output.section = PMin;
		return Output;
	};


	/**
* @method
* @private
*/
	PathImpl_Linear.prototype.findLinearSectionClosestPointParam = function (iSection, iTarget) {
		var PtStart = this.Points[iSection];
		var PtEnd = this.Points[iSection + 1];

		var StartToTarget = new DSMath.Vector3D(iTarget.x - PtStart.x, iTarget.y - PtStart.y, iTarget.z - PtStart.z);
		var EndToTarget = new DSMath.Vector3D(iTarget.x - PtEnd.x, iTarget.y - PtEnd.y, iTarget.z - PtEnd.z);
		var StartToEnd = new DSMath.Vector3D(PtEnd.x - PtStart.x, PtEnd.y - PtStart.y, PtEnd.z - PtStart.z);

		if (StartToTarget.norm() === 0) {
			Out.Param = 0;
			Out.Dist = 0;
			return Out;
		}
		if (StartToEnd.norm() === 0) {
			Out.Param = 0;
			Out.Dist = StartToTarget.norm();
			return Out;
		}
		var P = StartToTarget.dot(StartToEnd) / (StartToTarget.norm() * StartToEnd.norm());
		if (P < 0) {
			Out.Param = 0;
			Out.Dist = StartToTarget.norm();
			return Out;
		}
		if (P > 1) {
			Out.Param = 1;
			Out.Dist = EndToTarget.norm();
			return Out;
		}
		Out.Param = P;
		var ClosestPoint = new DSMath.Point(PtStart.x + P * StartToEnd.x, PtStart.y + P * StartToEnd.y, PtStart.z + P * StartToEnd.z);
		var Diff = new DSMath.Vector3D(iTarget.x - ClosestPoint.x, iTarget.y - ClosestPoint.y, iTarget.z - ClosestPoint.z);
		Out.Dist = Diff.norm();
	}

	/**
	* @method
	* @private
	*/
	PathImpl_Linear.prototype.getClosestToPointParam = function (iTarget) {
		var MinDistPtSection = 1;
		var MinDistPtParam = 1;
		var MinDistPtDist = -1;

		for (var s = 1; s < this.nbSections - 1; s++) {
			var X = this.findLinearSectionClosestPointParam(s, iTarget);

			if (X !== null) {
				if (MinDistPtDist < 0 || X.Dist < MinDistPtDist) {
					MinDistPtDist = X.Dist;
					MinDistPtSection = s;
					MinDistPtParam = X.Param;
				}
			}
		}
		return this.PointsLinearCurvilinearAbs[MinDistPtSection] + MinDistPtParam * (this.PointsLinearCurvilinearAbs[MinDistPtSection+1] - this.PointsLinearCurvilinearAbs[MinDistPtSection]);
	};


/**
* @method
* @private
*/
	PathImpl_Linear.prototype.getInflectionPoints = function (iInterpolationType) {
		var InflectionPointsParams = [];
		return InflectionPointsParams;
	};

   
	PathImpl_Linear.prototype.constructor = PathImpl_Linear;
    
	STU.PathImpl_Linear = PathImpl_Linear;
	return PathImpl_Linear;
});





define('StuVirtualObjects/StuPathImpl_Linear', ['DS/StuVirtualObjects/StuPathImpl_Linear'], function (PathImpl_Linear) {
    'use strict';

	return PathImpl_Linear;
});
