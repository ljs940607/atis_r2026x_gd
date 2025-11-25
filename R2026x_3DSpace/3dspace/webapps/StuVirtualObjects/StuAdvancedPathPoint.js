define('DS/StuVirtualObjects/StuAdvancedPathPoint', ['DS/StuCore/StuContext', 'DS/MathematicsES/MathsDef'], function (STU, DSMath) {
	('use strict');


	/**
	 * Describes an internal control point  an advanced path object.
	 *
	 * @exports AdvancedPathPoint
	 * @class
	 * @constructor
	 * @noinstancector
	 * @private
	 * @memberof STU
	 * @alias STU.AdvancedPathPoint
	 */
	var AdvancedPathPoint = function () {
		this.name = "AdvancedPathPoint";

		/**
		* Position of a control point in world referential
		*
		* @member
		* @instance
		* @name position
		* @private
		* @type {DSMath.Point}
		* @memberof STU.AdvancedPathPoint
		*/
		Object.defineProperty(this, "position", {
			enumerable: true,
			configurable: true,
			get: function () {
				var myIndex = this.getIndex();
				// get from impl
				return (this.parent.getControlPointPosition(myIndex,"World"));
			},
			set: function (value) {
				var myIndex = this.getIndex();
				// set on impl and C++ for visu refresh
				return (this.parent.setControlPointPosition(myIndex, value, "World"));
			}
		});

		/**
		* Incoming tangent of a control point in world referential
		*
		* @member
		* @instance
		* @name inTangent
		* @private
		* @type {DSMath.Vector3D}
		* @memberof STU.AdvancedPathPoint
		*/
		Object.defineProperty(this, "inTangent", {
			enumerable: true,
			configurable: true,
			get: function () {
				var myIndex = this.getIndex();
				// get from impl
				return (this.parent.getControlPointInTangent(myIndex, "World"));
			},
			set: function (value) {
				var myIndex = this.getIndex();
				// set on impl and C++ for visu refresh
				var outTangent = this.parent.getControlPointOutTangent(myIndex, "World");
				return (this.parent.setControlPointTangents(myIndex, value, outTangent, "World"));
			}
		});

		/**
		* Outgoing tangent of a control point in world referential
		*
		* @member
		* @instance
		* @name outTangent
		* @private
		* @type {DSMath.Vector3D}
		* @memberof STU.AdvancedPathPoint
		*/
		Object.defineProperty(this, "outTangent", {
			enumerable: true,
			configurable: true,
			get: function () {
				var myIndex = this.getIndex();
				// get from impl
				return (this.parent.getControlPointOutTangent(myIndex, "World"));
			},
			set: function (value) {
				var myIndex = this.getIndex();
				// set on impl and C++ for visu refresh
				var inTangent = this.parent.getControlPointInTangent(myIndex, "World");
				return (this.parent.setControlPointTangents(myIndex, inTangent, value, "World"));
			}
		});

		/**
		* upward normalized direction of a control point in world referential
		*
		* @member
		* @instance
		* @name up
		* @private
		* @type {DSMath.Vector3D}
		* @memberof STU.AdvancedPathPoint
		*/
		Object.defineProperty(this, "up", {
			enumerable: true,
			configurable: true,
			get: function () {
				var myIndex = this.getIndex();
				// get from impl
				return (this.parent.getControlPointUp(myIndex, "World"));
			},
			set: function (value) {
				var myIndex = this.getIndex();
				// set on impl and C++ for visu refresh
				var inTangent = this.inTangent;
				return (this.parent.setControlPointUp(myIndex, value, "World"));
			}
		});

		/**
		* up direction roll in the section following this control point
		*
		* @member
		* @instance
		* @name roll
		* @private
		* @type {number}
		* @memberof STU.AdvancedPathPoint
		*/
		Object.defineProperty(this, "roll", {
			enumerable: true,
			configurable: true,
			get: function () {
				var myIndex = this.getIndex();
				// get from impl
				return (this.parent.getControlPointRoll(myIndex));
			},
			set: function (value) {
				var myIndex = this.getIndex();
				// set on impl and C++ for visu refresh
				return (this.parent.setControlPointRoll(myIndex, value));
			}
		});

		/**
		* tangent computation mode of this control point
		*
		* @member
		* @instance
		* @name mode
		* @private
		* @type {STU.AdvancedPathActor.ETangentMode}
		* @memberof STU.AdvancedPathPoint
		*/
		Object.defineProperty(this, "mode", {
			enumerable: true,
			configurable: true,
			get: function () {
				var myIndex = this.getIndex();
				// get from impl
				return (this.parent.getControlPointMode(myIndex));
			},
			set: function (value) {
				var myIndex = this.getIndex();
				// set on impl and C++ for visu refresh
				return (this.parent.setControlPointMode(myIndex, value));
			}
		});


	};

	AdvancedPathPoint.prototype.getIndex = function () {
		var NbPts = this.parent.ctrlPts.length;
		for (var i = 0; i < NbPts; i++) {
			if (this.parent.ctrlPts[i] === this) {
				return i;
			}
		}
		return -1;
	};

	//////////////////////////////////////////////////////////////////////////////
	//                           Prototype definitions                          //
	//////////////////////////////////////////////////////////////////////////////
	AdvancedPathPoint.prototype.constructor = AdvancedPathPoint;

	//////////////////////////////////////////////////////////////////////////////
	//                            STU expositions.                              //
	//////////////////////////////////////////////////////////////////////////////
	STU.AdvancedPathPoint = AdvancedPathPoint;
	return AdvancedPathPoint;
});

define('StuVirtualObjects/StuAdvancedPathPoint', ['DS/StuVirtualObjects/StuAdvancedPathPoint'], function (AdvancedPathPoint) {
	'use strict';

	return AdvancedPathPoint;
});






define('StuVirtualObjects/StuAdvancedPathPoint', ['DS/StuVirtualObjects/StuAdvancedPathPoint'], function (StuAdvancedPathPoint) {
    'use strict';

	return StuAdvancedPathPoint;
});
