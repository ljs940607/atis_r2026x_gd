
/*
	*
	* TERMS OF USE - EASING EQUATIONS
	*
	* Open source under the BSD License.
	*
	* Copyright 2001 Robert Penner
	* All rights reserved.
	*
	* Redistribution and use in source and binary forms, with or without modification,
	* are permitted provided that the following conditions are met:
	*
	* Redistributions of source code must retain the above copyright notice, this list of
	* conditions and the following disclaimer.
	* Redistributions in binary form must reproduce the above copyright notice, this list
	* of conditions and the following disclaimer in the documentation and/or other materials
	* provided with the distribution.
	*
	* Neither the name of the author nor the names of contributors may be used to endorse
	* or promote products derived from this software without specific prior written permission.
	*
	* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
	* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	*  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	*  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	*  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
	* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	*  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
	* OF THE POSSIBILITY OF SUCH DAMAGE.
	*
*/

define('DS/StuCore/StuInterpolationManager', ['DS/StuCore/StuContext', 'DS/StuCore/StuManager', 'DS/EPTaskPlayer/EPTaskPlayer', 'DS/EPTaskPlayer/EPTask', 'DS/MathematicsES/MathTolerancesJS'], function (STU, Manager, TaskPlayer, Task, MathTolerances) {
	'use strict';

	/**
	 * Manager exposing services to interpolate and animate values.
	 *
	 * @exports InterpolationManager
	 * @class
	 * @constructor
	 * @noinstancector 
	 * @public
	 * @extends STU.Manager
	 * @memberof STU
	 * @alias STU.InterpolationManager
	 */
	var InterpolationManager = function () {
		Manager.call(this);
		this.name = 'InterpolationManager';

		this._mainTask = null;
		this._animationJobs = [];
	};

	InterpolationManager.prototype = new Manager();
	InterpolationManager.prototype.constructor = InterpolationManager;

	/**
	   * Supported property types for ease and animate methods.
	 * 
	 * @public
	   * @typedef {(number|Date|DSMath.Point|DSMath.Point2D|DSMath.Vector3D|DSMath.Vector3D|DSMath.Quaternion|DSMath.Transformation|STU.Color|STU.ColorRGB)} STU.InterpolationManager~InterpolatedType	 
	  */

	/**
	 * This callback is displayed as part of the Requester class.
	 * 
	 * @public
	 * @callback STU.InterpolationManager~endCallback
	 * @param {object} object object being modified
	 * @param {string} property property being modified
	 */

	/**
	 * This callback is displayed as part of the Requester class.
	 * 
	 * @public
	 * @callback STU.InterpolationManager~updateCallback
	 * @param {object} object object being modified
	 * @param {string} property property being modified
	 * @param {number} time time spent in the animation
	 */


	/**
	 * Process to execute when this STU.Manager is initializing.
	 *
	 * @method
	 * @private
	 * @see STU.Manager#onDispose
	 */
	InterpolationManager.prototype.onInitialize = function () {

		this._mainTask = new InterpolationManagerTask(this);
		TaskPlayer.addTask(this._mainTask);
	};

	/**
	 * Process to execute when this STU.Manager is disposing.
	 *
	 * @method
	 * @private
	 * @see STU.Manager#onInitialize
	 */
	InterpolationManager.prototype.onDispose = function () {
		TaskPlayer.removeTask(this._mainTask);
		delete this._mainTask;
	};


	/**
	 * Process to execute when this STU.Manager is disposing.
	 *
	 * @method
	 * @private	 
	 */
	InterpolationManager.prototype.onExecute = function (iContext) {
		for (const j in this._animationJobs) {
			let job = this._animationJobs[j];

			job.currentTime += iContext.deltaTime;
			if (job.currentTime > job.duration)
				job.currentTime = job.duration;

			// easing the interpolation factor first
			let coef = 1 - ((job.duration - job.currentTime) / job.duration);	// IBS 		= job.currentTime / job.duration
			if (coef > 1) {
				console.error("InterpolationManager: this situation should not appear");
			}

			// modulating the interpolation coef with the easing function, if set
			if (job.easing != undefined) {
				coef = this.ease(job.easing, job.currentTime, job.duration, 0, 1);
			}

			// interpolating the values with the eased factor
			job.currentVal = job.lerp.call(this, job.inValue, job.outValue, coef);

			// setting the interpolated value via the right accessor
			if (job.setter != undefined) {
				job.object[job.setter].call(job.object, job.currentVal);
			}
			else if (job.property != undefined) {
				job.object[job.property] = job.currentVal;
			}
			else {
				console.error("InterpolationManager: no write access to data");
			}

			// let's call the update callback if requested
			if (job.updateCallback) {
				job.updateCallback(job.object, job.property, job.currentTime);
			}

			// let's call a finish callback if requested
			if (coef == 1 && job.endCallback) {
				job.endCallback(job.object, job.property);
			}
		}

		// removing jobs from the list if finished
		this._animationJobs = this._animationJobs.filter(job => job.currentTime < job.duration);
	};

	/**
	 * Linear interpolation of a number.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {number} iA initial value
	 * @param {number} iB final value
	 * @param {number} iX interpolation factor
	 * @return {number} interpolated value	 
	 */
	InterpolationManager.prototype.lerpNumber = function (iA, iB, iX) {
		return iA + (iB - iA) * iX;
	}

	/**
	 * Linear interpolation of a date value.	 
	 *  
	 * @method
	 * @public
	 * 
	 * @param {Date} iA initial value
	 * @param {Date} iB final value
	 * @param {number} iX interpolation factor
	 * @return {Date} interpolated value	 
	 */
	InterpolationManager.prototype.lerpDate = function (iA, iB, iX) {
		let inNumber = iA.getTime();
		let outNumber = iB.getTime();
		let lerpRes = this.lerpNumber(inNumber, outNumber, iX);

		let result = new Date();
		result.setTime(lerpRes);
		return result;
	}

	/**
	 * Linear interpolation of a 3D vector.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Vector3D} iA initial value
	 * @param {DSMath.Vector3D} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Vector3D} interpolated value	 
	 */
	InterpolationManager.prototype.lerpVector3D = function (iA, iB, iX) {
		return DSMath.Vector3D.lerp(iA, iB, iX);
	}

	/**
	 * Spherical interpolation of a 3D vector.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Vector3D} iA initial value
	 * @param {DSMath.Vector3D} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Vector3D} interpolated value	 
	 */
	InterpolationManager.prototype.slerpVector3D = function (iA, iB, iX) {
		var tol = new MathTolerances();

		// if iA and iB are colinear + same direction, or one of them is null, there is no angle between them so slerp is impossible
		// in this case revert to lerp
		if (iA.norm() < tol.epsilonForLengthTest || iB.norm() < tol.epsilonForLengthTest) {
			return this.lerpVector3D(iA, iB, iX);
		}
		// angle between the vectors
		const theta = iA.getAngleTo(iB);

		if (theta < tol.epsilonForAngleTest) {
			return this.lerpVector3D(iA, iB, iX);
        }
		// after this point iA and iB are neither null nor colinear

		// sin of the angle
		const sinTheta = Math.sin(theta);
		// interpolation factors for both vectors
		const factor1 = Math.sin((1 - iX) * theta) / sinTheta;
		const factor2 = Math.sin(iX * theta) / sinTheta;

		let vX = new DSMath.Vector3D(
			iA.x * factor1 + iB.x * factor2,
			iA.y * factor1 + iB.y * factor2,
			iA.z * factor1 + iB.z * factor2
		);
		return vX;
	}

	/**
	 * Linear interpolation of a 2D vector.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Vector2D} iA initial value
	 * @param {DSMath.Vector2D} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Vector2D} interpolated value	 
	 */
	InterpolationManager.prototype.lerpVector2D = function (iA, iB, iX) {
		return DSMath.Vector2D.lerp(iA, iB, iX);
	}

	/**
	 * Spherical interpolation of a 2D vector.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Vector2D} iA initial value
	 * @param {DSMath.Vector2D} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Vector2D} interpolated value	 
	 */
	InterpolationManager.prototype.slerpVector2D = function (iA, iB, iX) {
		var tol = new MathTolerances();

		// if iA and iB are colinear + same direction, or one of them is null, there is no angle between them so slerp is impossible
		// in this case revert to lerp
		if (iA.norm() < tol.epsilonForLengthTest || iB.norm() < tol.epsilonForLengthTest) {
			return this.lerpVector2D(iA, iB, iX);
		}
		// angle between the vectors
		const theta = iA.getAngleTo(iB);

		if (theta < tol.epsilonForAngleTest) {
			return this.lerpVector2D(iA, iB, iX);
		}
		// after this point iA and iB are neither null nor colinear

		// sin of the angle
		const sinTheta = Math.sin(theta);
		// interpolation factors for both vectors
		const factor1 = Math.sin((1 - iX) * theta) / sinTheta;
		const factor2 = Math.sin(iX * theta) / sinTheta;

		let vX = new DSMath.Vector2D(
			iA.x * factor1 + iB.x * factor2,
			iA.y * factor1 + iB.y * factor2
		);
		return vX;
	}

	/**
	 * Linear interpolation of a 3D point.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Point} iA initial value
	 * @param {DSMath.Point} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Point} interpolated value	 
	 */
	InterpolationManager.prototype.lerpPoint = function (iA, iB, iX) {
		return DSMath.Point.lerp(iA, iB, iX);
	}

	/**
	 * Linear interpolation of a 2D point.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Point2D} iA initial value
	 * @param {DSMath.Point2D} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Point2D} interpolated value	 
	 */
	InterpolationManager.prototype.lerpPoint2D = function (iA, iB, iX) {
		return DSMath.Point2D.lerp(iA, iB, iX);
	}

	/**
	 * Linear interpolation of a quaternion.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Quaternion} iA initial value
	 * @param {DSMath.Quaternion} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Quaternion} interpolated value	 
	 */
	InterpolationManager.prototype.lerpQuaternion = function (iA, iB, iX) {
		return DSMath.Quaternion.lerp(iA, iB, iX);
	}

	/**
	 * Spherical interpolation of a quaternion.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Quaternion} iA initial value
	 * @param {DSMath.Quaternion} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Quaternion} interpolated value	 
	 */
	InterpolationManager.prototype.slerpQuaternion = function (iA, iB, iX) {
		return DSMath.Quaternion.slerp(iA, iB, iX);
	}

	/**
	 * Linear interpolation of a Transformation
	 * 
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Transformation} iA initial value
	 * @param {DSMath.Transformation} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Transformation} interpolated value
	 */
	InterpolationManager.prototype.lerpTransformation = function (iA, iB, iX) {
		let qA = iA.matrix.getQuaternion();
		let qB = iB.matrix.getQuaternion();

		let sA = iA.matrix.getScale();
		let sB = iB.matrix.getScale();

		let vA = iA.vector;
		let vB = iB.vector;

		let qX = DSMath.Quaternion.lerp(qA, qB, iX);
		let vX = DSMath.Vector3D.lerp(vA, vB, iX);
		let sX = this.lerpNumber(sA, sB, iX);

		let tX = new DSMath.Transformation();
		tX.matrix = qX.getMatrix();
		tX.vector = vX;
		tX.matrix.multiplyScalar(sX);

		return tX;
	}

	/**
	 * Spherical linear interpolation of a Transformation
	 * Note that the rotation is slerped thanks to a quaternion, 
	 * but the position component is simply lerped.
	 * 
	 * @method
	 * @public
	 * 
	 * @param {DSMath.Transformation} iA initial value
	 * @param {DSMath.Transformation} iB final value
	 * @param {number} iX interpolation factor
	 * @return {DSMath.Transformation} interpolated value
	 */
	InterpolationManager.prototype.slerpTransformation = function (iA, iB, iX) {
		let mA = iA.matrix.clone();
		let mB = iB.matrix.clone();
		mA.setFirstColumn(mA.getFirstColumn().normalize());
		mA.setSecondColumn(mA.getSecondColumn().normalize());
		mA.setThirdColumn(mA.getThirdColumn().normalize());
		mB.setFirstColumn(mB.getFirstColumn().normalize());
		mB.setSecondColumn(mB.getSecondColumn().normalize());
		mB.setThirdColumn(mB.getThirdColumn().normalize());
		let qA = mA.getQuaternion();
		let qB = mB.getQuaternion();

		let sA = iA.matrix.getScale();
		let sB = iB.matrix.getScale();

		let vA = iA.vector;
		let vB = iB.vector;

		let qX = DSMath.Quaternion.slerp(qA, qB, iX);
		let vX = this.lerpVector3D(vA, vB, iX);
		let sX = this.lerpNumber(sA, sB, iX);

		let tX = new DSMath.Transformation();
		tX.matrix = qX.getMatrix();
		tX.vector = vX;
		tX.matrix.multiplyScalar(sX);

		return tX;
	}

	/**
	 * Linear interpolation of a color value.	 
	 *  
	 * @method
	 * @public
	 * 
	 * @param {STU.Color} iA initial value
	 * @param {STU.Color} iB final value
	 * @param {number} iX interpolation factor
	 * @return {STU.Color} interpolated value	 
	 */
	InterpolationManager.prototype.lerpColor = function (iA, iB, iX) {
		let vA = new DSMath.Vector3D(iA.r, iA.g, iA.b);
		let vB = new DSMath.Vector3D(iB.r, iB.g, iB.b);

		let vX = this.lerpVector3D(vA, vB, iX);

		if (vX.x < 0) vX.x = 0;
		if (vX.x > 255) vX.x = 255;
		if (vX.y < 0) vX.y = 0;
		if (vX.y > 255) vX.y = 255;
		if (vX.z < 0) vX.z = 0;
		if (vX.z > 255) vX.z = 255;

		let cX = new STU.Color(vX.x, vX.y, vX.z);
		return cX;
	}

	/**
	 * Spherical interpolation of a color value.	 
	 *  
	 * @method
	 * @public
	 * 
	 * @param {STU.Color} iA initial value
	 * @param {STU.Color} iB final value
	 * @param {number} iX interpolation factor
	 * @return {STU.Color} interpolated value	 
	 */
	InterpolationManager.prototype.slerpColor = function (iA, iB, iX) {
		let vA = new DSMath.Vector3D(iA.r, iA.g, iA.b);
		let vB = new DSMath.Vector3D(iB.r, iB.g, iB.b);

		let vX = this.slerpVector3D(vA, vB, iX);

		if (vX.x < 0) vX.x = 0;
		if (vX.x > 255) vX.x = 255;
		if (vX.y < 0) vX.y = 0;
		if (vX.y > 255) vX.y = 255;
		if (vX.z < 0) vX.z = 0;
		if (vX.z > 255) vX.z = 255;

		let cX = new STU.Color(vX.x, vX.y, vX.z);

		return cX;
	}


	/**
	 * Linear interpolation of a color.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {STU.ColorRGB} iA initial value
	 * @param {STU.ColorRGB} iB final value
	 * @param {number} iX interpolation factor
	 * @return {STU.ColorRGB} interpolated value	 
	 */
	InterpolationManager.prototype.lerpColorRGB = function (iA, iB, iX) {
		let vA = new DSMath.Vector3D(iA.r, iA.g, iA.b);
		let vB = new DSMath.Vector3D(iB.r, iB.g, iB.b);
		let vX = this.lerpVector3D(vA, vB, iX);

		if (vX.x < 0) vX.x = 0;
		if (vX.x > 1) vX.x = 1;
		if (vX.y < 0) vX.y = 0;
		if (vX.y > 1) vX.y = 1;
		if (vX.z < 0) vX.z = 0;
		if (vX.z > 1) vX.z = 1;

		let cX = new STU.ColorRGB(vX.x, vX.y, vX.z);
		return cX;
	}


	/**
	 * Spherical interpolation of a color.
	 *  
	 * @method
	 * @public
	 * 
	 * @param {STU.ColorRGB} iA initial value
	 * @param {STU.ColorRGB} iB final value
	 * @param {number} iX interpolation factor
	 * @return {STU.ColorRGB} interpolated value	 
	 */
	InterpolationManager.prototype.slerpColorRGB = function (iA, iB, iX) {
		let vA = new DSMath.Vector3D(iA.r, iA.g, iA.b);
		let vB = new DSMath.Vector3D(iB.r, iB.g, iB.b);
		let vX = this.slerpVector3D(vA, vB, iX);

		if (vX.x < 0) vX.x = 0;
		if (vX.x > 1) vX.x = 1;
		if (vX.y < 0) vX.y = 0;
		if (vX.y > 1) vX.y = 1;
		if (vX.z < 0) vX.z = 0;
		if (vX.z > 1) vX.z = 1;

		let cX = new STU.ColorRGB(vX.x, vX.y, vX.z);
		return cX;
	}


	/**
	 * Interpolates a value at a given type using an input easing type.
	 * 
	 * @public
	 * @param {STU.InterpolationManager.EEasingType} iEasingType type of easing function used for the interpolation
	 * @param {number} iCurrentTime current time user for the interpolation (between 0 and iDuration)
	 * @param {number} iTotalTime total time to be used for the interpolation
	 * @param {number} iBeginValue value at time = 0
	 * @param {number} iEndValue value at time = iDuration
	 * @return {number} interpolated value between begin and end value for the given time and easing function
	 * 
	 */
	InterpolationManager.prototype.ease = function (iEasingType, iCurrentTime, iTotalTime, iBeginValue, iEndValue) {
		return InterpolationManager.easingTypeToFunctionMap[iEasingType](iCurrentTime, iBeginValue, iEndValue, iTotalTime);
	};


	/**
	 * Registers an animation job that will automatically interpolate an object's property 
	 * during an given amount of time, given begin and end values, and a total duration.
	 * 
	 * Caller has also the possibility to customize the getter and setter used to set the property
	 * and register a callback that will be called when the animation is finished.
	 * 
	 * Note: if the object is inactive or get's inactive, it is automatically removed from the list of animation jobs.
	 * This is to ensure that objects from previous scenes don't remain animated.
	 * 
	 * @example
	 * 	// fade cube's color from red to green during 10s	
	 * let im = STU.InterpolationManager.getInstance();
	 * let cube = this.getExperience().getActorByName("Cube");
	 * 
	 * let bColor = new STU.Color(255, 0, 0);
	 * let eColor = new STU.Color(0, 255, 0);
	 * im.animate(cube, "color", bColor, eColor, 10000, {
	 * 	easing: STU.InterpolationManager.EEasingType.easeInOutQuad,
	 * 	updateCallback: function() {
	 * 		console.log("color updated: " + JSON.stringify(cube.color));
	 * 	},
	 * 	endCallback: function () {
	 * 		console.log("interpolation is finished")
	 * 	}
	 * });
	 * 
	 * @method 
	 * @public
	 * @param {object} iObject object hosting the property to animate
	 * @param {string} iProperty name of the property to animate
	 * @param {STU.InterpolationManager~InterpolatedType} iBeginValue initial value of the property when starting the animation
	 * @param {STU.InterpolationManager~InterpolatedType} iEndValue target value of the property when finishing the animation
	 * @param {number} iDuration duration of the animation (in ms)
	 * @param {object} [iOptions] optionnal parameters
	 * @param {string} [iOptions.getter=undefined] name of the function to call on the object to get the value
	 * @param {string} [iOptions.setter=undefined] name of the function to call on the object to set the value
	 * @param {STU.InterpolationManager.EEasingType} [iOptions.easing=undefined] easing function to use for the interpolation
	 * @param {boolean} [iOptions.forceLinear=false] force linear interpolation for values where spherical interpolation that usually fit better (lerp VS slerp)
	 * @param {STU.InterpolationManager~endCallback} [iOptions.endCallback=undefined] function called when the animation is finished	 
	 * @param {STU.InterpolationManager~updateCallback} [iOptions.updateCallback=undefined] function called when updating the value
	 * 
	*/
	InterpolationManager.prototype.animate = function (iObject, iProperty, iBeginValue, iEndValue, iDuration, iOptions) {
		// quick access to options for readability
		let options = iOptions ? iOptions : {};

		// creation of the job to be registered
		let job = {
			object: iObject,
			property: iProperty,
			getter: options.getter,
			setter: options.setter,
			inValue: iBeginValue,
			outValue: iEndValue,
			duration: iDuration,
			easing: options.easing,
			currentTime: 0,
			currentVal: iBeginValue,
			endCallback: options.endCallback,
			updateCallback: options.updateCallback,
		}

		let forceLinear = false;
		if (options.forceLinear != undefined)
			forceLinear = iOptions.forceLinear;

		// selecting the correct interpolation function for the given input data type
		if (typeof job.inValue == "number") {
			job.lerp = this.lerpNumber;
		}
		else if (job.inValue instanceof DSMath.Vector3D) {
			job.lerp = forceLinear ? this.lerpVector3D : this.slerpVector3D;

			var cloneIN = job.inValue.clone();
			job.inValue = cloneIN;
			var cloneOUT = job.outValue.clone();
			job.outValue = cloneOUT;
		}
		else if (job.inValue instanceof DSMath.Transformation) {
			job.lerp = forceLinear ? this.lerpTransformation : this.slerpTransformation;

			var cloneIN = job.inValue.clone();
			job.inValue = cloneIN;
			var cloneOUT = job.outValue.clone();
			job.outValue = cloneOUT;
		}
		else if (job.inValue instanceof DSMath.Quaternion) {
			job.lerp = forceLinear ? this.lerpQuaternion : this.slerpQuaternion;

			var cloneIN = job.inValue.clone();
			job.inValue = cloneIN;
			var cloneOUT = job.outValue.clone();
			job.outValue = cloneOUT;
		}
		else if (job.inValue instanceof STU.Color) {
			job.lerp = forceLinear ? this.lerpColor : this.slerpColor;

			var cloneIN = new STU.Color(job.inValue.r, job.inValue.g, job.inValue.b);
			job.inValue = cloneIN;
			var cloneOUT = new STU.Color(job.outValue.r, job.outValue.g, job.outValue.b);
			job.outValue = cloneOUT;
		}
		else if (job.inValue instanceof STU.ColorRGB) {
			job.lerp = forceLinear ? this.lerpColorRGB : this.slerpColorRGB;

			var cloneIN = new STU.ColorRGB(job.inValue.r, job.inValue.g, job.inValue.b);
			job.inValue = cloneIN;
			var cloneOUT = new STU.ColorRGB(job.outValue.r, job.outValue.g, job.outValue.b);
			job.outValue = cloneOUT;

		}
		else if (job.inValue instanceof Date) {
			job.lerp = this.lerpDate;

			var cloneIN = new Date(job.inValue.getTime());
			job.inValue = cloneIN;
			var cloneOUT = new Date(job.outValue.getTime());
			job.outValue = cloneOUT;
		}
		else if (job.inValue instanceof DSMath.Point) {
			job.lerp = this.lerpPoint;

			var cloneIN = job.inValue.clone();
			job.inValue = cloneIN;
			var cloneOUT = job.outValue.clone();
			job.outValue = cloneOUT;
		}
		else if (job.inValue instanceof DSMath.Vector2D) {
			job.lerp = forceLinear ? this.lerpVector2D : this.slerpVector2D;

			var cloneIN = job.inValue.clone();
			job.inValue = cloneIN;
			var cloneOUT = job.outValue.clone();
			job.outValue = cloneOUT;
		}
		else if (job.inValue instanceof DSMath.Point2D) {
			job.lerp = this.lerpPoint2D;

			var cloneIN = job.inValue.clone();
			job.inValue = cloneIN;
			var cloneOUT = job.outValue.clone();
			job.outValue = cloneOUT;
		}

		else {
			console.error("InterpolationManager: type of value not yet supported, skipping this job");
			return;
		}

		this._animationJobs.push(job);
	};


	/***********************************************************************************************************************************/

	/**
	 * An enumeration of all the supported easing methods.
	 * 
	 * For more information about easing types, you can refer to this useful 
	 * extenal webside: <a>https://easings.net/</a>.
	 *
	 * @enum {number}
	 * @public
	*/
	InterpolationManager.EEasingType = {
		eInQuad: 0,
		eOutQuad: 1,
		eInOutQuad: 2,
		eInCubic: 3,
		eOutCubic: 4,
		eInOutCubic: 5,
		eInQuart: 6,
		eOutQuart: 7,
		eInOutQuart: 8,
		eInQuint: 9,
		eOutQuint: 10,
		eInOutQuint: 11,
		eInSine: 12,
		eOutSine: 13,
		eInOutSine: 14,
		eInExpo: 15,
		eOutExpo: 16,
		eInOutExpo: 17,
		eInCirc: 18,
		eOutCirc: 19,
		eInOutCirc: 20,
		eInElastic: 21,
		eOutElastic: 22,
		eInOutElastic: 23,
		eInBack: 24,
		eOutBack: 25,
		eInOutBack: 26,
		eInBounce: 27,
		eOutBounce: 28,
		eInOutBounce: 29,
	};


	/**
	 * Available easing functions
	 *
	 * @member
	 * @private	 
	 */
	InterpolationManager.easingFunctions = {

		// base easing function for whitch x in [0..1] produces output in [0..1]
		// if f(x) is the IN easing function and g(x) the OUT eaing fuction
		// g(x) is always 1-f(1-x)
		// g(x) is the symetrical function of f relatively to diagonal line y=x

		// POLYNOMIAL
		polyInEasing: function (x, N) {
			return Math.pow(x, N);
		},
		polyOutEasing: function (x, N) {
			return 1 - InterpolationManager.easingFunctions.polyInEasing(1 - x, N);
		},
		polyInOutEasing: function (x, N) {
			if (x < 0.5) {
				return 0.5 * InterpolationManager.easingFunctions.polyInEasing(2 * x, N);
			}
			else {
				return 0.5 + 0.5 * InterpolationManager.easingFunctions.polyOutEasing(2 * x - 1, N);
			}
		},
		// TRIGONOMETRIC
		sineInEasing: function (x) {
			return 1 - Math.cos(x * (Math.PI / 2));
		},
		sineOutEasing: function (x) {
			return 1 - InterpolationManager.easingFunctions.sineInEasing(1 - x); // equivalent to Math.sin(x * (Math.PI / 2)
		},
		sineInOutEasing: function (x) {
			if (x < 0.5) {
				return 0.5 * InterpolationManager.easingFunctions.sineInEasing(2 * x);
			}
			else {
				return 0.5 + 0.5 * InterpolationManager.easingFunctions.sineOutEasing(2 * x - 1);
			}
		},
		// EXPONENTIAL
		expoInEasing: function (x, N) {
			if (x == 0) {
				return 0;
			}
			else {
				return Math.pow(2, N * (x - 1));
			}
		},
		expoOutEasing: function (x, N) {
			return 1 - InterpolationManager.easingFunctions.expoInEasing(1 - x, N);
		},
		expoInOutEasing: function (x, N) {
			if (x < 0.5) {
				return 0.5 * InterpolationManager.easingFunctions.expoInEasing(2 * x, N);
			}
			else {
				return 0.5 + 0.5 * InterpolationManager.easingFunctions.expoOutEasing(2 * x - 1, N);
			}
		},
		// CIRCULAR
		circInEasing: function (x) {
			return 1 - Math.sqrt(1 - x * x);
		},
		circOutEasing: function (x) {
			return 1 - InterpolationManager.easingFunctions.circInEasing(1 - x);
		},
		circInOutEasing: function (x) {
			if (x < 0.5) {
				return 0.5 * InterpolationManager.easingFunctions.circInEasing(2 * x);
			}
			else {
				return 0.5 + 0.5 * InterpolationManager.easingFunctions.circOutEasing(2 * x - 1);
			}
		},
		// BACK (?)
		backInEasing: function (x, s) {
			if (s == undefined) s = 1.70158;
			return Math.pow(x, 3) * (s + 1) - Math.pow(x, 2) * s;
		},
		backOutEasing: function (x, s) {
			return 1 - InterpolationManager.easingFunctions.backInEasing(1 - x, s);
		},
		backInOutEasing: function (x, s) {
			if (x < 0.5) {
				return 0.5 * InterpolationManager.easingFunctions.backInEasing(2 * x, s);
			}
			else {
				return 0.5 + 0.5 * InterpolationManager.easingFunctions.backOutEasing(2 * x - 1, s);
			}
		},
		// BOUNCE
		bounceInEasing: function (x) {
			return 1 - InterpolationManager.easingFunctions.bounceOutEasing(1 - x);
		},
		bounceOutEasing: function (x) {
			if (x < (1 / 2.75)) {
				return (7.5625 * Math.pow(x, 2));
			} else if (x < (2 / 2.75)) {
				return (7.5625 * Math.pow(x - (1.5 / 2.75), 2) + .75);
			} else if (x < (2.5 / 2.75)) {
				return (7.5625 * Math.pow(x - (2.25 / 2.75), 2) + .9375);
			} else {
				return (7.5625 * Math.pow(x - (2.625 / 2.75), 2) + .984375);
			}
		},
		bounceInOutEasing: function (x) {
			if (x < 0.5) {
				return 0.5 * InterpolationManager.easingFunctions.bounceInEasing(2 * x);
			}
			else {
				return 0.5 + 0.5 * InterpolationManager.easingFunctions.bounceOutEasing(2 * x - 1);
			}
		},
		// ELASTIC
		elasticInEasing: function (x, N) {
			const c4 = (2 * Math.PI) / 3;

			return x === 0
				? 0
				: x === 1
					? 1
					: -InterpolationManager.easingFunctions.expoInEasing(x, N) * Math.sin((x * 10 - 10.75) * c4);
		},
		elasticOutEasing: function (x, N) {
			return 1 - InterpolationManager.easingFunctions.elasticInEasing(1 - x, N);
		},
		elasticInOutEasing: function (x, N) {
			if (x < 0.5) {
				return 0.5 * InterpolationManager.easingFunctions.elasticInEasing(2 * x, N);
			}
			else {
				return 0.5 + 0.5 * InterpolationManager.easingFunctions.elasticOutEasing(2 * x - 1, N);
			}
		},


		easeInQuad: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInEasing((t / duration), 2);
		},
		easeOutQuad: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyOutEasing((t / duration), 2);
		},
		easeInOutQuad: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInOutEasing((t / duration), 2);
		},


		easeInCubic: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInEasing((t / duration), 3);
		},
		easeOutCubic: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyOutEasing((t / duration), 3);
		},
		easeInOutCubic: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInOutEasing((t / duration), 3);
		},


		easeInQuart: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInEasing((t / duration), 4);
		},
		easeOutQuart: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyOutEasing((t / duration), 4);
		},
		easeInOutQuart: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInOutEasing((t / duration), 4);
		},


		easeInQuint: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInEasing((t / duration), 5);
		},
		easeOutQuint: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyOutEasing((t / duration), 5);
		},
		easeInOutQuint: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.polyInOutEasing((t / duration), 5);
		},


		easeInSine: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.sineInEasing((t / duration));
		},
		easeOutSine: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.sineOutEasing((t / duration));
		},
		easeInOutSine: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.sineInOutEasing((t / duration));
		},



		easeInExpo: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.expoInEasing((t / duration), 10);
		},
		easeOutExpo: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.expoOutEasing((t / duration), 10);
		},
		easeInOutExpo: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.expoInOutEasing((t / duration), 10);
		},



		easeInCirc: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.circInEasing(t / duration);
		},
		easeOutCirc: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.circOutEasing((t / duration));
		},
		easeInOutCirc: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.circInOutEasing((t / duration));
		},



		easeInBack: function (t, startValue, endValue, duration, s) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.backInEasing((t / duration), s);
		},
		easeOutBack: function (t, startValue, endValue, duration, s) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.backOutEasing((t / duration), s);
		},
		easeInOutBack: function (t, startValue, endValue, duration, s) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.backInOutEasing((t / duration), s);
		},


		easeInBounce: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.bounceInEasing((t / duration));
		},
		easeOutBounce: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.bounceOutEasing((t / duration));
		},
		easeInOutBounce: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.bounceInOutEasing((t / duration));
		},


		easeInElastic: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.elasticInEasing((t / duration), 10);
		},
		easeOutElastic: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.elasticOutEasing((t / duration), 10);
		},
		easeInOutElastic: function (t, startValue, endValue, duration) {
			return startValue + (endValue - startValue) * InterpolationManager.easingFunctions.elasticInOutEasing((t / duration), 10);
		}
	};

	/**
	 * Maps that finds the easing function out of an easing type
	 *
	 * @member
	 * @private	 
	 */
	InterpolationManager.easingTypeToFunctionMap = new Array();
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInQuad] = InterpolationManager.easingFunctions.easeInQuad;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutQuad] = InterpolationManager.easingFunctions.easeOutQuad;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutQuad] = InterpolationManager.easingFunctions.easeInOutQuad;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInCubic] = InterpolationManager.easingFunctions.easeInCubic;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutCubic] = InterpolationManager.easingFunctions.easeOutCubic;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutCubic] = InterpolationManager.easingFunctions.easeInOutCubic;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInQuart] = InterpolationManager.easingFunctions.easeInQuart;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutQuart] = InterpolationManager.easingFunctions.easeOutQuart;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutQuart] = InterpolationManager.easingFunctions.easeInOutQuart;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInQuint] = InterpolationManager.easingFunctions.easeInQuint;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutQuint] = InterpolationManager.easingFunctions.easeOutQuint;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutQuint] = InterpolationManager.easingFunctions.easeInOutQuint;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInSine] = InterpolationManager.easingFunctions.easeInSine;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutSine] = InterpolationManager.easingFunctions.easeOutSine;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutSine] = InterpolationManager.easingFunctions.easeInOutSine;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInExpo] = InterpolationManager.easingFunctions.easeInExpo;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutExpo] = InterpolationManager.easingFunctions.easeOutExpo;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutExpo] = InterpolationManager.easingFunctions.easeInOutExpo;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInCirc] = InterpolationManager.easingFunctions.easeInCirc;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutCirc] = InterpolationManager.easingFunctions.easeOutCirc;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutCirc] = InterpolationManager.easingFunctions.easeInOutCirc;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInElastic] = InterpolationManager.easingFunctions.easeInElastic;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutElastic] = InterpolationManager.easingFunctions.easeOutElastic;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutElastic] = InterpolationManager.easingFunctions.easeInOutElastic;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInBack] = InterpolationManager.easingFunctions.easeInBack;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutBack] = InterpolationManager.easingFunctions.easeOutBack;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutBack] = InterpolationManager.easingFunctions.easeInOutBack;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInBounce] = InterpolationManager.easingFunctions.easeInBounce;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eOutBounce] = InterpolationManager.easingFunctions.easeOutBounce;
	InterpolationManager.easingTypeToFunctionMap[InterpolationManager.EEasingType.eInOutBounce] = InterpolationManager.easingFunctions.easeInOutBounce;

	/***********************************************************************************************************************************/

	/**
	 * Main task to manage Interpolation Manager execution
	 *
	 * @exports InterpolationManagerTask
	 * @class
	 * @constructor
	 * @private
	 * @extends EP.Task
	 */
	let InterpolationManagerTask = function (iManager) {
		Task.call(this);
		this.name = 'InterpolationManagerTask';
		this.mgr = iManager;
	};

	InterpolationManagerTask.prototype = new Task();
	InterpolationManagerTask.prototype.constructor = InterpolationManagerTask;
	InterpolationManagerTask.prototype.onExecute = function (iPlayerContext) {
		this.mgr.onExecute(iPlayerContext);
	};


	/***********************************************************************************************************************************/

	STU.registerManager(InterpolationManager);

	// Expose in STU namespace.
	STU.InterpolationManager = InterpolationManager;

	return InterpolationManager;
});
