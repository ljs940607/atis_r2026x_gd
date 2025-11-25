/*
* * @quickReview IBS 18:11:26 IBS getBoundingSphere with iRef
* * @quickReview IBS 18:02:01 correction API GetMaterial
* * @quickReview IBS 18:08:11 cleanup API pour passer par objets STUMaterial (CATECXPMaterial_StuIBuilder, CATEPrototypeBuildCXPMaterial) 
* * @quickReview IBS 17:07:24 m�thodes pour modifier materials en cours de play (StuMaterialsManager)
* * @quickReview IBS 17:04:21 RenderManager fonctionne en rep�re world
*						+ gestion scaling globe
*/





define('DS/StuRenderEngine/StuActor3D', ['DS/StuCore/StuContext', 'DS/StuModel/StuActor', 'DS/MathematicsES/MathsDef', 'DS/StuClickable/StuClickableManager',
	'DS/StuRenderEngine/StuMaterialsManager', 'DS/StuMath/StuBox', 'DS/StuRenderEngine/StuColor'],
	function (STU, Actor, DSMath, ClickableManager, StuMaterialsManager, Box) {
		'use strict';

		/**
		 * Describe a STU.Actor which represents a 3D object with a position, an orientation and a scale in the 3D space. 
		 * These information can be evaluated with one matrix transformation.
		 * This class provides the possibility to interact and manipulate them through different kind of APIs.
		 * This object can have a geometric representation which is required by some specific STU.Behavior.
		 *
		 * @exports Actor3D
		 * @class
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends STU.Actor
		 * @memberof STU
		 * @alias STU.Actor3D
		 */
		var Actor3D = function () {

			Actor.call(this);

			this.CATI3DExperienceObject;
			this.CATIMovable;
			this.CATI3DXGraphicalProperties;
			this.CATI3DGeoVisu;
			this.StuIRepresentation;

			/**
			 * Whether this STU.Actor3D responds to a click.
			 *
			 * @member
			 * @instance
			 * @name clickable
			 * @public
			 * @type {boolean}
			 * @memberof STU.Actor3D
			 */
			Object.defineProperty(this, 'clickable', {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DXGraphicalProperties !== null && this.CATI3DXGraphicalProperties !== undefined) {
						return this.CATI3DXGraphicalProperties.GetPickMode();
					} else {
						return false;
					}
				},
				set: function (iClickable) {
					if (iClickable != 0 && iClickable != 1) {
						throw new TypeError('iClickable argument is not a boolean');
					}

					if (iClickable === true) {
						STU.ClickableManager.getInstance().addClickable(this);
					} else {
						STU.ClickableManager.getInstance().removeClickable(this);
					}

					if (this.CATI3DXGraphicalProperties !== null && this.CATI3DXGraphicalProperties !== undefined) {
						this.CATI3DXGraphicalProperties.SetPickMode(iClickable == 1);
					}
				}
			});


			/**
			 * Whether this STU.Actor3D is visible.
			 *
			 * @member
			 * @instance
			 * @name visible
			 * @public
			 * @type {boolean}
			 * @memberof STU.Actor3D
			 */
			Object.defineProperty(this, 'visible', {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DXGraphicalProperties !== null && this.CATI3DXGraphicalProperties !== undefined) {
						return this.CATI3DXGraphicalProperties.GetShowMode();
					} else {
						return false;
					}
				},
				set: function (iVisible) {
					if (iVisible != 1 && iVisible != 0) {
						throw new TypeError('iVisible argument is not a boolean');
					}

					if (this.CATI3DXGraphicalProperties !== null && this.CATI3DXGraphicalProperties !== undefined) {
						this.CATI3DXGraphicalProperties.SetShowMode(iVisible == 1);
					}
				}
			});


			/**
			 * The opacity level of this STU.Actor3D.
			 * The value must be included between 0 and 255.
			 *
			 * @member
			 * @instance
			 * @name opacity
			 * @public
			 * @type {number}
			 * @memberof STU.Actor3D
			 */
			Object.defineProperty(this, 'opacity', {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DXGraphicalProperties !== null && this.CATI3DXGraphicalProperties !== undefined) {
						return this.CATI3DXGraphicalProperties.GetOpacity();
					} else {
						return 0;
					}
				},
				set: function (iOpacity) {
					if (typeof iOpacity !== 'number') {
						throw new TypeError('iOpacity argument is not a number');
					}

					if (iOpacity < 0 || iOpacity > 255) {
						throw new RangeError('iOpacity argument is outside of the pixel value range 0-255');
					}

					if (this.CATI3DXGraphicalProperties !== null && this.CATI3DXGraphicalProperties !== undefined) {
						this.CATI3DXGraphicalProperties.SetOpacity(iOpacity);
					}
				}
			});


			/**
			 * The color of this STU.Actor3D.
			 *
			 * @member
			 * @instance
			 * @name color
			 * @public
			 * @type {STU.Color}
			 * @memberof STU.Actor3D
			 */
			Object.defineProperty(this, 'color', {
				enumerable: true,
				configurable: true,
				get: function () {
					if (!!this.CATI3DXGraphicalProperties) {
						return new STU.Color(this.CATI3DXGraphicalProperties.GetRed(), this.CATI3DXGraphicalProperties.GetGreen(), this.CATI3DXGraphicalProperties.GetBlue());
					} else {
						return new STU.Color(0, 0, 0);
					}
				},
				set: function (iColor) {
					var color;

					if (iColor instanceof STU.Color) {
						color = [iColor.getRed(), iColor.getGreen(), iColor.getBlue()];
					}
					else if (Array.isArray(iColor) && iColor.length >= 3) {
						color = iColor;
					}
					else {
						throw new TypeError('iColor argument is not a STU.Color');
					}

					if (!!this.CATI3DXGraphicalProperties) {
						this.CATI3DXGraphicalProperties.SetColor(color[0], color[1], color[2]);
					}
				}
			});
		};

		Actor3D.prototype = new Actor();
		Actor3D.prototype.constructor = Actor3D;





/**
* A referential argument can be given as a function parameter to explicit the referential in which other positional (points, orientations, scales) inputs and outputs should be interpreted.
* A referential may be:
* <ul>
* <li>null: all inputs and outputs should be interpreted in the referential of: </li>
* <ul>
* <li>The current scene if a scene is active</li>
* <li>The standard world if no scene is active</li>
* </ul>
* <li>A STU.Actor3D: all inputs and outputs should be interpreted in the referential of this actor</li>
* <li>A DSMath.Transformation: all inputs and outputs should be interpreted in the referential of an object which has this transformation as its world position</li>
* <li>The string "World": all inputs and outputs should be interpreted in the referential of the standard world, even if a scene is currently active</li>
* </ul>
*
* Note: if a planets environment is active the world referential is
* <ul>
* <li>Centered at the center of planet earth </li>
* <li>Z axis oriented from the south pole to the north pole</li>
* <li>Y axis points away from the Greenwich meridian</li>
* </ul>
*
* @example
* // example function working with positional inputs (points, orientations, scales) and producing a positional result (point, orientation, scale), taking a working referential iRef as parameter.
* myActor.computeXXXPositionalInfo(iPoint, iVector, iScale, iRef)
* {
*            Output.point = new DSMath.Point([someComputation]);
*            Output.vector = new DSMath.Vector3D([someOtherComputation]);
*            Output.scale = [someThirdComputation];
* }
* // WORKING WITH SINGLE REFERENTIAL
* // build inputs in a defined referential Ref1 (null, an actor, or "World"), for example using getTransform:
* var myTransfo_Ref1 = myActor3D.getTransform(Ref1);
* var MyPosPoint_Ref1 = new DSMath.Point(myTransfo_Ref1.vector.x, myTransfo_Ref1.vector.y,myTransfo_Ref1.vector.z);
* var MyUpVector_Ref1 = new DSMath.Vector3D(myTransfo_Ref1.matrix.getThirdColumn());
* var MyScale_Ref1 = myTransfo_Ref1.getScaling().scale;
*
* // provide those inputs to a function, explicitly forcing this function to work in the referential Ref1 and produce outputs in this referential:
* var myResult = computeXXXPositionalInfo(MyPosPoint_Ref1, MyUpVector_Ref1, MyScale_Ref1, Ref1);
*
* // use the results in the Ref1 referential:
* myOtherObject.setXXXPosition(myResult.point, Ref1);
* myOtherObject.setXXXUp(myResult.vector, Ref1);
* myOtherObject.setXXXScale(myResult.scale, Ref1);
*
* // CHANGING REFERENTIAL
* // whenever groups of positional (point, orientation, scale) variables are expressed in different referentials 
* // they usually should be converted to a common referential to be used conjointly
* // converting a positional variable (point, orientation, scale) from the referential of actor actor1 to the referential of actor actor2 is done in the following manner:
*
* // myTransfo_actor1 is a transform expressed in the referential of actor1
* // (for example: myTransfo_actor1 = myActor3D.getTransform(actor1): myTransfo_actor1 is the position of myActor3D in the referential of actor1)
* myTransfo_actor1 = [some computation]
*
* // actor1Pos_actor2 is the position of actor1 in the referential of actor2
* actor1Pos_actor2 = actor1.getTransform(actor2);
* // myTransfo_actor2 is the conversion of myTransfo_actor1 to the referential of actor2
* myTransfo_actor2 = myTransfo_actor1.applyTransform(actor1Pos_actor2);
*
* // this is equivalent to:
* actor1Pos = actor1.getTransform();
* actor2Pos = actor2.getTransform();
* actor2PosInv = actor2Pos.getInverse();
* myTransfo_world = myTransfo_actor1.applytransform(actor1Pos);     // converts myTransfo_actor1 from actor1 referential to world referential
* myTransfo_actor2 = myTransfo_world.applytransform(actor2PosInv);  // myTransfo_world from world referential to actor2 referential
*
* // in the example case mentioned above where myTransfo_actor1 = myActor3D.getTransform(actor1) this is also equivalent to:
* myTransfo_actor2 =  myActor3D.getTransform(actor2);
*
* @public
* @typedef {(STU.Actor3D|DSMath.Transformation|string)} STU.Referential
*/


		var _ArrayBuffer = null;// new Float64Array(12);

		/**
		 * Returns the parent STU.Location when existing 
		 * @deprecated R2025x Use getSceneTransform instead. See also STU.Referential.
		 * @public
		 * @return {?STU.Location} Parent STU.Location of this STU.Actor3D
		 */
		Actor3D.prototype.getLocation = function () {
			console.warn('`getLocation` is deprecated, use `getSceneTransform`! See also STU.Referential.');
			//var a = new Error();
			//console.log(a.stack);
			

			var ancestor = this.getParent();
			if (ancestor !== undefined && ancestor !== null && (ancestor instanceof Actor3D)) {
				return ancestor.getLocation();
			} else {
				return null;
			}
		};

	/**
	 * Returns the parent STU.Location when existing
	 * Used for legacy location support. this should only be called from getSceneTransform
	 * @private
	 * @return {?STU.Location} Parent STU.Location of this STU.Actor3D
	 */
		Actor3D.prototype.getLocation_Legacy = function () {
			var ancestor = this.getParent();
			if (ancestor !== undefined && ancestor !== null && (ancestor instanceof Actor3D)) {
				return ancestor.getLocation_Legacy();
			} else {
				return null;
			}
		};


	 /**
	  * Returns the position of the scene or location this STU.Actor3D belongs to 
	  * By default, the result is expressed in the world referential.
	  *
	  * @method
	  * @public
	  * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
	  * @return {DSMath.Transformation} the position of the current scene or location
	  */
		Actor3D.prototype.getSceneTransform = function (iRef) {
			if (iRef === undefined || iRef === null) {
				iRef = "World";
			}

			var LocationTransfo = new DSMath.Transformation(); // Identity
			if (iRef === "Location") {
				return LocationTransfo;
			}

			// support for legacy locations
			let myLocation = this.getLocation_Legacy();
			if (myLocation !== undefined && myLocation !== null) {
				return myLocation.getTransform(iRef);
			}

			return this.getExperience().getSceneTransform(iRef);
		};


		/**
		 * Returns the matrix transformation of this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 *
		 * @method
		 * @public
		 * @param {STU.Referential} [iRef] Referential in which to interpret the returned transform
		 * @return {DSMath.Transformation} the matrix transformation.
		 * @see STU.Actor3D#setTransform
		 */

		Actor3D.prototype.getTransform = function (iRef) {

			var ActorRef = null;
			var TransfoRef = null;

			// a special case where we can directly set the local transform on CATIMovable
			// NOTE: iRef is not necessarily a STU.Actor3D, it could be the experience root
			if (iRef === this.getParent()) {
				if (STU.isEKIntegrationActive()) {
					return this.getTransform_NoBinding(iRef);
				}

				if (_ArrayBuffer === null) {
					_ArrayBuffer = new Float64Array(12);
					this.CATIMovable.ExternalizeArray(_ArrayBuffer);
				}

				var outputTransform = new DSMath.Transformation();
				this.CATIMovable.GetLocalPosition();
				outputTransform.setFromArray(_ArrayBuffer);
				return outputTransform;
			}

			else if (iRef === undefined || iRef === null || iRef === "Location") {
				// support for legacy locations: to be removed (ODT impact w slight position differences)
				let myLocation = this.getLocation_Legacy();
				if (myLocation !== undefined && myLocation !== null) {
					ActorRef = myLocation;
				}
				else {
					var SceneReferential = this.getSceneTransform();
					TransfoRef = SceneReferential;
				}
			}

			// world position = position relative to root of l'experience
			// the root of experience may be scaled relative to au scene graph root (planets)
			else if (iRef === "World" || iRef instanceof STU.Experience) {
				TransfoRef = new DSMath.Transformation(); // Identity
			}
			// visu position = position relative to scene graph root
			// the root of experience may be scaled relative to au scene graph root (planets)
			else if (iRef === "Visu") {
				let rm = STU.RenderManager.getInstance();
				var expScale = rm.getExperienceScaleFactor();
				TransfoRef = DSMath.Transformation.makeScaling(1 / expScale, new DSMath.Point(0, 0, 0));
			}

			else if (iRef instanceof STU.Actor3D) {
				ActorRef = iRef;
			}

			else if (iRef instanceof DSMath.Transformation) {
				TransfoRef = iRef;
			}

			if ((ActorRef === null || ActorRef === undefined) && (TransfoRef === null || TransfoRef === undefined)) {
				console.warn('getTransform : iRef argument is not a suitable STU.Referential (using scene referential)');

				// support for legacy locations: to be removed (ODT impact w slight position differences)
				let myLocation = this.getLocation_Legacy();
				if (myLocation !== undefined && myLocation !== null) {
					ActorRef = myLocation;
				}
				else {
					var SceneReferential = this.getSceneTransform();
					TransfoRef = SceneReferential;
				}
			}
			if (ActorRef !== undefined && ActorRef !== null) {
				if (STU.isEKIntegrationActive()) {
					return this.getTransform_NoBinding(ActorRef);
				}
				if (this.CATIMovable !== undefined && this.CATIMovable !== null) {
					// this is what we want to do, for simplicity and genericity:
					//let ID = new DSMath.Transformation(); // Identity
					//var ActorRefTransfoInWorldRef = ActorRef.getTransform(ID);
					//return this.getTransform(ActorRefTransfoInWorldRef);

					// this is what we do to support legacy ODTs: to be removed (ODT impact w slight position differences)
					if (_ArrayBuffer === null) {
						_ArrayBuffer = new Float64Array(12);
						this.CATIMovable.ExternalizeArray(_ArrayBuffer);
					}

					var myWorldTransform = new DSMath.Transformation();
					this.CATIMovable.GetAbsPosition();
					myWorldTransform.setFromArray(_ArrayBuffer);
					var refWorldTransform = new DSMath.Transformation();
					ActorRef.CATIMovable.GetAbsPosition();
					refWorldTransform.setFromArray(_ArrayBuffer);
					var invRefWorldTransform = refWorldTransform.getInverse();
					var res = invRefWorldTransform.multiply(myWorldTransform);
					return res;
				}
				else {
					throw new Error('this.CATIMovable not found in Actor3D getTransform');
				}
				return;
			}
			else if (TransfoRef !== undefined && TransfoRef !== null) {

				var coef = TransfoRef.getArray();
				for (var i = coef.length - 1; i >= 0; i--) {
					var e = coef[i];
					if (!isFinite(e) || isNaN(e)) {
						throw new Error('iRef contains NaN or infinite elements');
					}
				}

				if (STU.isEKIntegrationActive()) {
					return this.getTransform_NoBinding(TransfoRef);
				}
				if (this.CATIMovable !== undefined && this.CATIMovable !== null) {
					var refWorldTransform = new DSMath.Transformation();
					refWorldTransform = TransfoRef.clone();
					var invRefWorldTransform = refWorldTransform.getInverse();

					if (_ArrayBuffer === null) {
						_ArrayBuffer = new Float64Array(12);
						this.CATIMovable.ExternalizeArray(_ArrayBuffer);
					}

					var myWorldTransform = new DSMath.Transformation();
					this.CATIMovable.GetAbsPosition();
					myWorldTransform.setFromArray(_ArrayBuffer);

					var expScale = STU.RenderManager.getInstance().getExperienceScaleFactor();
					var visuTransfoInWorldRef = DSMath.Transformation.makeScaling(1 / expScale, new DSMath.Point(0, 0, 0));
					myWorldTransform.multiply(visuTransfoInWorldRef);
					myWorldTransform.vector.applyTransformation(visuTransfoInWorldRef);

					var myPosRelToRef = invRefWorldTransform.multiply(myWorldTransform);
					return myPosRelToRef;
				}
				else {
					throw new Error('this.CATIMovable not found in Actor3D getTransform');
				}
				return;
			}
		};



		var _arrayToBuffer = function (array) {
			_ArrayBuffer[0] = array[0]; _ArrayBuffer[1] = array[1]; _ArrayBuffer[2] = array[2];
			_ArrayBuffer[3] = array[3]; _ArrayBuffer[4] = array[4]; _ArrayBuffer[5] = array[5];
			_ArrayBuffer[6] = array[6]; _ArrayBuffer[7] = array[7]; _ArrayBuffer[8] = array[8];
			_ArrayBuffer[9] = array[9]; _ArrayBuffer[10] = array[10]; _ArrayBuffer[11] = array[11];
		};


		/**
		 * Sets a new matrix transformation for this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 *
		 * @method
		 * @public
		 * @param {DSMath.Transformation} iTransform Matrix transformation.
		 * @param {STU.Referential} [iRef] Referential in which to interpret the input transform
		 * @see STU.Actor3D#getTransform
		 */
		Actor3D.prototype.setTransform = function (iTransform, iRef) {

			if (!(iTransform instanceof DSMath.Transformation)) {
				throw new TypeError('setTransform: iTransform argument is not a suitable DSMath.Transformation');
			}
			var coef = iTransform.getArray();
			for (var i = coef.length - 1; i >= 0; i--) {
				var e = coef[i];
				if (!isFinite(e) || isNaN(e)) {
					throw new Error('iTransform contains NaN or infinite elements');
				}
			}


			var ActorRef = null;
			var TransfoRef = null;

			// a special case where we can directly set the local transform on CATIMovable
			// NOTE: iRef is not necessarily a STU.Actor3D, it could be the experience root
			if (iRef === this.getParent()) {
				if (STU.isEKIntegrationActive()) {
					return this.setTransform_NoBinding(iTransform, iRef);
				}

				if (_ArrayBuffer === null) {
					_ArrayBuffer = new Float64Array(12);
					this.CATIMovable.ExternalizeArray(_ArrayBuffer);
				}

				let array = iTransform.getArray();
				_arrayToBuffer(array);
				this.CATIMovable.SetLocalPosition(this.CATIMovable);
				return;
			}
			else if (iRef === undefined || iRef === null || iRef === "Location") {

				// support for legacy locations: to be removed (ODT impact w slight position differences)
				let myLocation = this.getLocation_Legacy();
				if (myLocation !== undefined && myLocation !== null) {
					ActorRef = myLocation;
				}
				else {
					var SceneReferential = this.getSceneTransform();
					TransfoRef = SceneReferential;
				}
			}
			// world position = position relative to root of l'experience
			// the root of experience may be scaled relative to au scene graph root (planets)
			else if (iRef === "World" || iRef instanceof STU.Experience) {
				TransfoRef = new DSMath.Transformation(); // Identity
			}
			// visu position = position relative to scene graph root
			// the root of experience may be scaled relative to au scene graph root (planets)
			else if (iRef === "Visu") {
				let rm = STU.RenderManager.getInstance();
				var expScale = rm.getExperienceScaleFactor();
				TransfoRef = DSMath.Transformation.makeScaling(1 / expScale, new DSMath.Point(0, 0, 0));
			}

			else if (iRef instanceof STU.Actor3D) {
				ActorRef = iRef;
			}

			else if (iRef instanceof DSMath.Transformation) {
				TransfoRef = iRef;
			}

			if ((ActorRef === null || ActorRef === undefined) && (TransfoRef === null || TransfoRef === undefined)) {
				console.warn('setTransform : iRef argument is not a suitable STU.Referential (using scene referential)');

				// support for legacy locations: to be removed (ODT impact w slight position differences)
				let myLocation = this.getLocation_Legacy();
				if (myLocation !== undefined && myLocation !== null) {
					ActorRef = myLocation;
				}
				else {
					var SceneReferential = this.getSceneTransform();
					TransfoRef = SceneReferential;
				}
            }


			if (ActorRef !== undefined && ActorRef !== null) {
				if (STU.isEKIntegrationActive()) {
					return this.setTransform_NoBinding(iTransform, ActorRef);
				}
				if (this.CATIMovable !== undefined && this.CATIMovable !== null) {
					// this is what we want to do, for simplicity and genericity:
					//let ID = new DSMath.Transformation(); // Identity
					//var ActorRefTransfoInWorldRef = ActorRef.getTransform(ID);
					//return this.setTransform_TransfoRef(iTransform, ActorRefTransfoInWorldRef);

					// this is what we do to support legacy ODTs: to be removed (ODT impact w slight position differences)
					if (_ArrayBuffer === null) {
						_ArrayBuffer = new Float64Array(12);
						this.CATIMovable.ExternalizeArray(_ArrayBuffer);
					}
					var refWorldTransform = new DSMath.Transformation();
					ActorRef.CATIMovable.GetAbsPosition();
					refWorldTransform.setFromArray(_ArrayBuffer);
					var inputTransform = DSMath.Transformation.multiply(refWorldTransform, iTransform);
					var array = inputTransform.getArray();
					_arrayToBuffer(array);
					this.CATIMovable.SetAbsPosition(); // has a pointer to _ArrayBuffer
				}
				else {
					throw new Error('this.CATIMovable not found in Actor3D getTransform');
				}
				return;
			}

			else if (TransfoRef !== undefined && TransfoRef !== null) {

				var coef = TransfoRef.getArray();
				for (var i = coef.length - 1; i >= 0; i--) {
					var e = coef[i];
					if (!isFinite(e) || isNaN(e)) {
						throw new Error('iRef contains NaN or infinite elements');
					}
				}

				if (STU.isEKIntegrationActive()) {
					return this.setTransform_NoBinding(iTransform, TransfoRef);
				}

				if (this.CATIMovable !== undefined && this.CATIMovable !== null) {
					var iTransformRelToWorld = DSMath.Transformation.multiply(TransfoRef, iTransform);
					var iTransformRelToVisu = iTransformRelToWorld;
					var expScale = STU.RenderManager.getInstance().getExperienceScaleFactor();
					var worldTransfoInVisudRef = DSMath.Transformation.makeScaling(expScale, new DSMath.Point(0, 0, 0));
					iTransformRelToVisu.multiply(worldTransfoInVisudRef);
					iTransformRelToVisu.vector.applyTransformation(worldTransfoInVisudRef);

					if (_ArrayBuffer === null) {
						_ArrayBuffer = new Float64Array(12);
						this.CATIMovable.ExternalizeArray(_ArrayBuffer);
					}

					let array = iTransformRelToVisu.getArray();
					_arrayToBuffer(array);
					this.CATIMovable.SetAbsPosition(); // has a pointer to _ArrayBuffer
				}
				else {
					throw new Error('this.CATIMovable not found in Actor3D getTransform');
				}
				return;
			}
		};


		/**
		 * Returns the position of this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 * Values are expressed in millimeters.
		 *
		 * @method
		 * @public
		 * @param {STU.Referential} [iRef] Referential in which to interpret the output position
		 * @return {DSMath.Vector3D} the position of this STU.Actor3D.
		 * @see STU.Actor3D#setPosition
		 * @see STU.Actor3D#translate
		 */
		Actor3D.prototype.getPosition = function (iRef) {
			var transform = this.getTransform(iRef);
			return transform.vector.clone();
		};

		/**
		 * Sets a new position for this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 * Values are expressed in millimeters.
		 *
		 * @method
		 * @public
		 * @param {DSMath.Vector3D | DSMath.Point} iPos Vector3D or Point corresponding to the new position in 3D.
		 * @param {STU.Referential} [iRef] Referential in which to interpret the output position
		 * @see STU.Actor3D#getPosition
		 * @see STU.Actor3D#translate
		 */
		Actor3D.prototype.setPosition = function (iPos, iRef) {
			if (!(iPos instanceof DSMath.Vector3D) && !(iPos instanceof DSMath.Point)) {
				throw new TypeError('iPos argument is not a DSMath.Vector3D or DSMath.Point');
			}

			var transform = this.getTransform(iRef);
			transform.vector = new DSMath.Vector3D(iPos.x, iPos.y, iPos.z);
			this.setTransform(transform, iRef);
		};


		// IBS GLOBE REVIVAL ACHTUNG : this et iDestActor dans la meme scene ?
		// normallement c'est OK mm si ils ne sont pas dans la mm scene
		/**
		 * Teleport this STU.Actor3D to another Stu.Actor3D transform
		 *
		 * @method
		 * @private
		 * @see STU.Actor3D#getTransform
		 */
		Actor3D.prototype.teleport = function (iDestActor) {
			if (!(iDestActor instanceof STU.Actor3D)) {
				throw new TypeError('iDestActor argument is not a STU.Actor3D');
			}

			var destTransfo = iDestActor.getTransform("World");
			var myScale = this.getScale();

			this.setTransform(destTransfo, "World");
			this.setScale(myScale);
		};

		/**
		 * Translates this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 *
		 * @method
		 * @public
		 * @param {DSMath.Vector3D} iVec Vector3D corresponding to the translation value in 3D to apply.
		 * @param {STU.Referential} [iRef] Referential in which to interpret the input translation
		 * @see STU.Actor3D#getPosition
		 * @see STU.Actor3D#setPosition
		 */
		Actor3D.prototype.translate = function (iVec, iRef) {
			if (!(iVec instanceof DSMath.Vector3D)) {
				throw new TypeError('iVec argument is not a DSMath.Vector3D');
			}

			var translationVector = new DSMath.Vector3D();
			translationVector.set(iVec.x, iVec.y, iVec.z);

			var myTransformRelToRef = this.getTransform(iRef);
			myTransformRelToRef.vector.add(translationVector);
			this.setTransform(myTransformRelToRef, iRef);
		};



		/**
		 * Returns the euler rotation of this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 * Values are in radian.
		 *
		 * @method
		 * @public
		 * @param {STU.Referential} [iRef] Referential in which to interpret the output rotation
		 * @return {DSMath.Vector3D}  the euler rotation of this STU.Actor3D.
		 * @see STU.Actor3D#setRotation
		 * @see STU.Actor3D#rotate
		 */
		Actor3D.prototype.getRotation = function (iRef) {
			var transform = this.getTransform(iRef);
			// Begin Set Scale to 1.0
			var currentScale = this.getScale();

			var coefScale = 1.0 / currentScale;

			var matrix3x3 = transform.matrix;
			var coefMatrix3x3 = matrix3x3.getArray();
			for (var i = 0; i < coefMatrix3x3.length; i++) {
				coefMatrix3x3[i] *= coefScale;
			}
			matrix3x3.setFromArray(coefMatrix3x3);
			transform.matrix = matrix3x3;
			// End Set Scale to 1.0

			var euler = transform.getEuler();
			var rot = new DSMath.Vector3D();
			rot.x = euler[1];
			rot.y = euler[2];
			rot.z = euler[0];
			return rot;
		};

		/**
		 * Sets a new euler rotation for this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 * Values are in radian.
		 *
		 * @method
		 * @public
		 * @param {DSMath.Vector3D} iRot Vector3D corresponding to the new euler rotation in 3D.
		 * @param {STU.Referential} [iRef] Referential in which to interpret the input rotation
		 * @see STU.Actor3D#getRotation
		 * @see STU.Actor3D#rotate
		 */
		Actor3D.prototype.setRotation = function (iRot, iRef) {
			if (!(iRot instanceof DSMath.Vector3D)) {
				throw new TypeError('iRot argument is not a DSMath.Vector3D');
			}

			var transform = this.getTransform(iRef);
			var currentScale = 1;

			if (iRef !== this) {
				currentScale = this.getScale();
			}

			var euler = [];
			euler[0] = iRot.z;
			euler[1] = iRot.x;
			euler[2] = iRot.y;
			transform.setRotationFromEuler(euler);//transform.setEuler(euler);

			// Begin Set Scale
			var coefScale = currentScale / Math.cbrt(transform.matrix.determinant()); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
			var matrix3x3 = transform.matrix;
			var coefMatrix3x3 = matrix3x3.getArray();
			for (var i = 0; i < coefMatrix3x3.length; i++) {
				coefMatrix3x3[i] *= coefScale;
			}
			matrix3x3.setFromArray(coefMatrix3x3);
			transform.matrix = matrix3x3;
			// End Set Scale

			this.setTransform(transform, iRef);
		};

		/**
		 * Rotates this STU.Actor3D around itself.
		 * By default, the function uses the scene referential.
		 * Values are in radian.
		 *
		 * @method
		 * @public
		 * @param {DSMath.Vector3D} iRot Vector3D corresponding to the euler rotation in 3D to apply.
		 * @param {STU.Referential} [iRef] Referential in which to interpret the input rotation
		 * @see STU.Actor3D#getRotation
		 * @see STU.Actor3D#setRotation
		 */
		Actor3D.prototype.rotate = function (iRot, iRef) {
			// NewWorld = Ref x Rotate x Local (ignore position to rotate)
			// WORLD Axis : NewWorld = Ref (= ID) x Rotate x Local (= World)
			// LOCAL Axis : NewWorld = Ref (= World) x Rotate x Local (= ID)
			// REF Axis : NewWorld = Ref x Rotate x Local

			if (!(iRot instanceof DSMath.Vector3D)) {
				throw new TypeError('iRot argument is not a DSMath.Vector3D');
			}

			var myTransform;
			var keepPos;
			var rotTransform;

			rotTransform = new DSMath.Transformation();
			var euler = [];
			euler[0] = iRot.z;
			euler[1] = iRot.x;
			euler[2] = iRot.y;
			rotTransform.setRotationFromEuler(euler);

			// ma pos dans le repere de iRef
			myTransform = this.getTransform(iRef);

			// sauvegarde position
			keepPos = myTransform.vector.clone();
			myTransform.vector = new DSMath.Vector3D();

			// applique rotation
			myTransform = DSMath.Transformation.multiply(rotTransform, myTransform);

			// r�tabli position
			myTransform.vector = keepPos;

			// ma nouvelle pos dans le repere de iRef
			this.setTransform(myTransform, iRef);
		};

		/**
		 * Rotates this STU.Actor3D around a vector.
		 *
		 * @method
		 * @public
		 * @param  {DSMath.Vector3D} iOrigin Center of the rotation expressed in the current scene / world referrential.
		 * @param  {DSMath.Vector3D} iVector Vector to rotate around expressed in the current scene / world referrential.
		 * @param  {Number} iAngle  Angle in radian.
		 */
		Actor3D.prototype.rotateAround = function (iOrigin, iVector, iAngle) {
			var actorCenterToOrigin = new DSMath.Vector3D();
			actorCenterToOrigin = DSMath.Vector3D.sub(this.getPosition(), iOrigin); // dans repere scene / world

			var quat = new DSMath.Quaternion();

			quat.makeRotation(iVector, iAngle);

			var actorTransform = this.getTransform(); // dans repere scene / world

			var rotTransform = actorTransform.clone();
			rotTransform.matrix = DSMath.Matrix3x3.multiply(quat.getMatrix(), actorTransform.matrix);

			var newPosCenter = actorCenterToOrigin.applyQuaternion(quat);
			var finalactorPos = iOrigin.clone();
			finalactorPos.set(finalactorPos.x + newPosCenter.x, finalactorPos.y + newPosCenter.y, finalactorPos.z + newPosCenter.z);

			rotTransform.vector = finalactorPos;
			this.setTransform(rotTransform); // dans repere scene / world
		};

		/**
		 * Returns the scale of this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 *
		 * @method
		 * @public
		 * @param {STU.Referential} [iRef] Referential in which to interpret the output scale
		 * @return {number} the scale value.
		 * @see STU.Actor3D#setScale
		 */
		Actor3D.prototype.getScale = function (iRef) {
			var transform = this.getTransform(iRef);

			var scale3 = transform.matrix.determinant();
			var scale = Math.pow(Math.abs(scale3), 1 / 3);
			if (scale3 < 0) {
				scale = -scale;
			}
			return scale;
		};

		/**
		 * Sets a new scale for this STU.Actor3D.
		 * By default, the function uses the scene referential.
		 *
		 * @method
		 * @public
		 * @param {number} iScale New scale value.
		 * @param {STU.Referential} [iRef] Referential in which to interpret the input scale
		 * @see STU.Actor3D#getScale
		 */
		Actor3D.prototype.setScale = function (iScale, iRef) {
			if (iScale === 0) {
				throw new Error('iScale argument cannot be zero');
			}
			var transform = this.getTransform(iRef);
			var currentScale = this.getScale();
			if (currentScale === 0) {
				throw new Error('currentScale cannot be zero');
			}

			var coefScale = iScale / currentScale;

			var matrix3x3 = transform.matrix;
			var coefMatrix3x3 = matrix3x3.getArray();
			for (var i = 0; i < coefMatrix3x3.length; i++) {
				coefMatrix3x3[i] *= coefScale;
			}
			matrix3x3.setFromArray(coefMatrix3x3);
			transform.matrix = matrix3x3;

			this.setTransform(transform, iRef);
		};

		/**
		 * Return the opacity of this STU.Actor3D.
		 * Range value is between 0 and 255.
		 * (deprecate use this.opacity instead)
		 *
		 * @method
		 * @private
		 * @return {number} corresponding to the opacity value
		 * @see STU.Actor3D#setOpacity
		 */
		Actor3D.prototype.getOpacity = function () {
			return this.opacity;
		};

		/**
		 * Set a new opacity for this STU.Actor3D.
		 * Range value is between 0 and 255.
		 * (deprecate use this.opacity instead)
		 *
		 * @method
		 * @private
		 * @param {number} iOpacity corresponding to the new opacity value
		 * @see STU.Actor3D#getOpacity
		 */
		Actor3D.prototype.setOpacity = function (iOpacity) {
			this.opacity = iOpacity;
		};

		/**
		 * Return the color of this STU.Actor3D.
		 * (deprecate use Actor3D.color instead)
		 * @method
		 * @private
		 * @return {STU.Color} instance object corresponding to the color
		 * @see STU.Actor3D#setColor
		 */
		Actor3D.prototype.getColor = function () {
			console.info('Deprecate use Actor3D.color instead');
			return this.color;
		};

		/**
		 * Set a new color for this STU.Actor3D.
		 * (deprecate use Actor3D.color instead)
		 * @method
		 * @private
		 * @param {STU.Color} iColor instance object corresponding to the new color
		 * @see STU.Actor3D#getColor
		 */
		Actor3D.prototype.setColor = function (iColor) {
			console.info('Deprecate use Actor3D.color instead');
			this.color = iColor;
		};

		/**
		 * Returns true if this STU.Actor3D is visible.
		 *
		 * @method
		 * @public
		 * @return {boolean} true if this STU.Actor3D is visible.<br/>
		 * 					 false otherwise.
		 * @see STU.Actor3D#setVisible
		 */
		Actor3D.prototype.isVisible = function () {
			return this.visible;
		};

		/**
		 * Set a new visible information for this STU.Actor3D.
		 * True to make it visible or false to hide.
		 *
		 * @method
		 * @private
		 * @param {boolean} iVisible
		 * @see STU.Actor3D#isVisible
		 */
		Actor3D.prototype.setVisible = function (iVisible) {
			this.visible = iVisible;
		};

		/**
		 * Hide this STU.Actor3D.
		 *
		 * @method
		 * @private
		 * @see STU.Actor3D#isVisible
		 */
		Actor3D.prototype.hide = function () {
			this.visible = false;
		};

		/**
		 * Show this STU.Actor3D.
		 *
		 * @method
		 * @private
		 * @see STU.Actor3D#isVisible
		 */
		Actor3D.prototype.show = function () {
			this.visible = true;
		};

		/**
		 * Returns true if this STU.Actor3D responds to a click.
		 *
		 * @method
		 * @public
		 * @return {boolean} true if this STU.Actor3D responds to a click.<br/>
		 * 					 false otherwise.
		 * @see STU.Actor3D#setClickable
		 */
		Actor3D.prototype.isClickable = function () {
			return this.clickable;
		};

		/**
		 * Sets the clickable state of this STU.Actor3D.
		 * 
		 *
		 * @method
		 * @public
	
		 * @param {boolean} iClickable true to make it clickable. <br/> 
		 *                             false to ignore picking action.
		 * @see STU.Actor3D#isClickable
		 */
		Actor3D.prototype.setClickable = function (iClickable) {
			this.clickable = iClickable;
		};


		/**
		 * Returns a bounding sphere which is enclosing this STU.Actor3D geometry.
		 *
		 * The sphere position is given in scene referential.
		 *
		 * @method
		 * @public
		 * @param {STU.Referential} [iRef] Referential in which to interpret the output sphere
		 * @return {STU.Sphere} instance object corresponding to the bounding sphere
		 */
		Actor3D.prototype.getBoundingSphere = function (iRef) {
			var sphere = new STU.Sphere();
			this.StuIRepresentation.GetBoundingSphere(sphere);

			if (iRef === "Parent") {
				return sphere;
			}
			// sphere exprim饠dans le rep貥 "local" de this = par rapport ࠳on parent
			// on veut la position de sont parent par rapport ࠩRef
			var parentActor = this.getParent();
			var T = null;
			if (parentActor !== undefined && parentActor !== null && parentActor instanceof STU.Actor3D) {
				T = parentActor.getTransform(iRef);
			}
			// this n'a pas de parent : il est sous le root
			// c'est comme si il 鴡it sous un parent qui porte sa position, avec une BS qui compense pour cet offset
			else {
				var MyPosRelToParent = this.getTransform(); // because I have no parent
				var MyPosRelToRef = this.getTransform(iRef);

				// MyPosRelToRef = MyPosRelToParent x MyParentPosRelToRef
				// => MyParentPosRelToRef = inv(MyPosRelToParent) x MyPosRelToRef
				var InvMyPosRelToParent = MyPosRelToParent.getInverse();
				T = DSMath.Transformation.multiply(MyPosRelToRef, InvMyPosRelToParent);
			}
			if (T !== undefined && T !== null) {
				sphere.center.applyTransformation(T);
				sphere.radius = Math.cbrt(T.matrix.determinant()) * (sphere.radius); // don't use .getScaling().scale, it fails for transformations which are not perfectly orthogonal (planets)
			}
			return sphere;
		};


		/**
		 * Returns a bounding box which is enclosing this STU.Actor3D geometry.
		 *
		 * The box corner points are given in scene referential.
		 * Use getOrientedBoundingBox to compute a bounding box in a specific referential / orientation
		 *
		 * @method
		 * @private
		 * @return {STU.Box} instance object corresponding to the bounding box
		 */
		Actor3D.prototype.getBoundingBox = function () {
			var box = new STU.Box();
			
			var SceneReferential = this.getSceneTransform();
			var SceneTransfo = this.getTransform(SceneReferential);

			this.StuIRepresentation.GetBoundingBox(box, SceneTransfo, 0); // bbox in scene ref
			return box;
		};


		/**
		 * Returns a bounding box, with a user-defined orientation, which contains the actor's geometry. <br/> 
		 * 
		 *
		 * @method
		 * @public
		 * @param {Object} iParams
		 * @param {STU.Referential} [iParams.orientation] Defines the orientation of the box and the referential in which it is expressed<br/>
		 * 														if it is undefined or equal to Identity, or equal to "World" : the box is expressed and oriented along the world canonical axes <br/> 
		 * 														if it is equal to this.getSceneTransform(), or equal to "Location" : the box is expressed and oriented along the scene/location canonical axes <br/>
		 * 														if set to an actor : the box is expressed and oriented along the canonical axes of this actor's most local referential <br/>
		 * 														if it is set to a DSMath.Transformation : this transformation is understood to express a referential's transformation in the world referential, the box is expressed and oriented along canonical axes of this referential <br/>
		 * @param {boolean} iParams.excludeChildren - if true, the box contains the given actor only, without the geometry of its subactors
		 * @return {STU.Box} instance object corresponding to the bounding box in the referential defined by iParams.orientation
		 */
		Actor3D.prototype.getOrientedBoundingBox = function (iParams) {
			var box = new STU.Box();
			var absTransfo = this.getTransform("World");
			if (iParams === null || iParams === undefined) {
				iParams = { orientation: new DSMath.Transformation(), excludeChildren:false };
			}
			if (iParams.orientation === null || iParams.orientation === undefined) {
				iParams.orientation = new DSMath.Transformation();
            }
			iParams.orientation = this.getExperience().getReferentialTransform(iParams.orientation, "World");
			this.StuIRepresentation.GetOrientedBoundingBox(box, iParams, absTransfo);
			return box;
		};


		/**
		 * Returns the actor in the given collection which is the closest (in distance) to this STU.Actor3D.
		 * 
		 *
		 * @method
		 * @public
		 * @param {STU.Collection} iCollection Target collection.
		 * @return {STU.Actor3D} the closest actor in the given collection.
		 */
		Actor3D.prototype.getNearestActor = function (iCollection) {
			var objCount = iCollection.getObjectCount();

			var nearestIndex = -1;
			var nearestDist = -1;

			var pos = this.getPosition();

			for (var i = 0; i < objCount; i++) {
				var obj = iCollection.getObjectAt(i);
				if (obj instanceof STU.Actor3D && obj !== this) {
					var pos2 = obj.getPosition();
					pos2.sub(pos);
					var dist = pos2.squareNorm();
					if (nearestDist === -1 || dist < nearestDist) {
						nearestDist = dist;
						nearestIndex = i;
					}
				}
			}

			if (nearestIndex !== -1) {
				return iCollection.getObjectAt(nearestIndex);
			}

			return null;
		};

		Actor3D.prototype.onInitialize = function (oExceptions) {
			Actor.prototype.onInitialize.call(this, oExceptions);

			if (this.uniqueID !== undefined) {
				STU.RenderManager.getInstance().registerActor(this.uniqueID, this);
			}
		};

		/**
		 * Process to execute when this STU.Actor3D is activating.
		 *
		 * @method
		 * @private
		 */
		Actor3D.prototype.onActivate = function (oExceptions) {
			Actor.prototype.onActivate.call(this, oExceptions);

			if (this.isClickable()) {
				STU.ClickableManager.getInstance().addClickable(this);
			}
		};

		/**
		 * Process to execute when this STU.Actor3D is deactivating.
		 *
		 * @method
		 * @private
		 */
		Actor3D.prototype.onDeactivate = function () {
			STU.ClickableManager.getInstance().removeClickable(this);
			Actor.prototype.onDeactivate.call(this);
		};

		/**
		 * @private
		 */
		Actor3D.prototype.onDispose = function () {
			// we set the pickmode to true so the user can click 
			// on the actor during authoring
			this.clickable = true;

			if (_ArrayBuffer !== null) {
				this.CATIMovable.CleanArray(_ArrayBuffer);
				_ArrayBuffer = null;
			}
			Actor.prototype.onDeactivate.call(this);
			Actor.prototype.onDispose.call(this);
		};

		//->SVV : EK Drop 1
		/**
		 * getTransform implementing without binding on CATIMovable
		 * 
		 * this should only be called from Actor3D.prototype.getTransform with iRef a transform or an actor
		 * 
		 * if iRef is an actor
		 *	out = iRef.getTransform_NoBinding("World").getInverse() x this.getTransform_NoBinding("World")
		 * 
		 * if iRef is a transfo (locating a referential in World)
		 *	out = iRef.geInverse() x this.getTransform_NoBinding("World")
	     *	
		 * if iRef is "World" (only called internally)
		 * out = this.getParent().getTransform_NoBinding("World") x this._varposition
		 * 
		 * @method
		 * @private
		 */
		/* jshint camelcase : false */
		Actor3D.prototype.getTransform_NoBinding = function (iRef) {

			if (iRef === "World") {
				var parentActor = this.getParent();
				var parenWorldPos = new DSMath.Transformation();
				if (parentActor instanceof STU.Actor3D) {
					parenWorldPos = parentActor.getTransform_NoBinding("World");
				}
				var MyLocalTransform = new DSMath.Transformation();
				MyLocalTransform.setFromArray(this._varposition);
				var res = DSMath.Transformation.multiply(parenWorldPos, MyLocalTransform);

				return res
			}

			
			var transform = new DSMath.Transformation();
			// special case 1: iRef is me
			if (iRef === this) {
				return transform;
			}
			// special case 2: iRef is my parent
			transform.setFromArray(this._varposition);
			var parentActor = this.getParent();
			if (iRef === parentActor) {
				return transform;
			}

			// generic cases
			var RefWorldTransform = new DSMath.Transformation();
			if (iRef !== null && iRef !== undefined && (iRef instanceof DSMath.Transformation)) {
				RefWorldTransform = iRef.clone();
			}
			if (iRef !== null && iRef !== undefined && (iRef instanceof STU.Actor3D)) {		
				RefWorldTransform = iRef.getTransform_NoBinding("World");
			}
			if (iRef !== null && iRef !== undefined && (iRef instanceof STU.Experience)) {
				RefWorldTransform = new DSMath.Transformation();
			}

			var invRefTransformWorld = RefWorldTransform.getInverse();
			var MyTransformWorld = this.getTransform_NoBinding("World");
			return DSMath.Transformation.multiply(invRefTransformWorld, MyTransformWorld);	
		};

		/**
		 * setTransform implementing without binding on CATIMovable
		 * 
		 * this should only be called from Actor3D.prototype.setTransform with iRef a transform or an actor
		 *
		 * if iRef is an actor
		 *	iRef.setTransform_NoBinding( iRef.getTransform_NoBinding("World") x iTransform , "World")
		 *
		 * if iRef is a transfo (locating a referential in World)
		 * iRef.setTransform_NoBinding( iRef x iTransform , "World")
	     *
		 * if iRef is "World" (only called internally)
		 * this._varposition = this.getParent().getTransform_NoBinding("World").getInverse() * this.getTransform_NoBinding("World")
		 *
		 * @method
		 * @private
		 */
		Actor3D.prototype.setTransform_NoBinding = function (iTransform, iRef) {
			if (iRef === "World") {
				var parentActor = this.getParent();
				var parenWorldPos = new DSMath.Transformation();
				if (parentActor instanceof STU.Actor3D) {
					parenWorldPos = parentActor.getTransform_NoBinding("World");
				}
				var MyLocalTransform = DSMath.Transformation.multiply(parenWorldPos.getInverse(), iTransform);
				
				this._varposition = MyLocalTransform.getArray();
				return;
			}

			// special case 1: iRef is me
			if (iRef === this) {
				var transform = new DSMath.Transformation(); 
				transform.setFromArray(this._varposition);
				var newTransform = DSMath.Transformation.multiply(transform, iTransform);
				this._varposition = newTransform.getArray();
				return;
			}

			// special case 2: iRef is my parent
			var parentActor = this.getParent();
			if (iRef === parentActor) {
				this._varposition = iTransform.getArray();
				return;
			}


			// generic cases
			var RefWorldTransform = new DSMath.Transformation();
			if (iRef !== null && iRef !== undefined && (iRef instanceof DSMath.Transformation)) {
				RefWorldTransform = iRef.clone();
			}
			if (iRef !== null && iRef !== undefined && (iRef instanceof STU.Actor3D)) {
				RefWorldTransform = iRef.getTransform_NoBinding("World");
			}
			if (iRef !== null && iRef !== undefined && (iRef instanceof STU.Experience)) {
				RefWorldTransform = new DSMath.Transformation();
			}

			var newWorldTransfo = DSMath.Transformation.multiply(RefWorldTransform, iTransform);
			return this.setTransform_NoBinding(newWorldTransfo, "World");
		};


		////////////////////////////////
		////// IBS JS APIs for MATERIALS

		/**
		 * Returns the name of the applied material.
		 *
		 * @method
		 * @public
		 * @return {string} the material name; empty string if no material is found.
		 */
		Actor3D.prototype.getMaterialName = function () {
			var myMaterialsManager = new StuMaterialsManager().build();
			return myMaterialsManager.getMaterialName(this.CATI3DExperienceObject);
		};

		/**
		 * Returns the material applied to this STU.Actor3D.
		 *
		 * @method
		 * @public
		 * @return {STU.Material} the applied material 
		 */
		Actor3D.prototype.getMaterial = function () {
			var myMaterialsManager = new StuMaterialsManager().build();
			return myMaterialsManager.getMaterial(this.CATI3DExperienceObject);
		};

		/**
		 * Removes all materials applied to this STU.Actor3D.
		 *
		 * @method
		 * @public
		 */
		Actor3D.prototype.removeMaterials = function () {
			var myMaterialsManager = new StuMaterialsManager().build();
			myMaterialsManager.removeMaterials(this.CATI3DExperienceObject);
		};

		/**
		 * Applies a material, identified by its name, to this STU.Actor3D.
		 *
		 * @method
		 * @public
		 * @param {string} iName Name of the material to apply to this actor.
		 */
		Actor3D.prototype.setMaterialByName = function (iName) {
			var myMaterialsManager = new StuMaterialsManager().build();
			myMaterialsManager.setMaterialByName(this.CATI3DExperienceObject, iName);
		};

		/**
		 * Applies a material to this STU.Actor3D.
		 *
		 * @method
		 * @public
		 * @param {STU.Material} iMaterial Material to apply to this actor.
		 */
		Actor3D.prototype.setMaterial = function (iMaterial) {
			var myMaterialsManager = new StuMaterialsManager().build();
			myMaterialsManager.setMaterial(this.CATI3DExperienceObject, iMaterial.CATI3DExperienceObject);
		};

		/**
		 * Returns true if this STU.Actor3D has iMaterial applied.
		 *
		 * @method
		 * @public
		 * @param {STU.Material} iMaterial STU.Material to check.
		 * @return {boolean} true if this STU.Actor3D has the material. <br/>
		 *                   false otherwise.
		 */
		Actor3D.prototype.hasMaterial = function (iMaterial) {
			// return this.materials[0].linktomaterial == iMaterial;

			var myMaterialsManager = new StuMaterialsManager().build();
			return iMaterial == myMaterialsManager.getMaterial(this.CATI3DExperienceObject);
		};

		////// ~IBS JS APIs for MATERIALS
		////////////////////////////////

		////////////////////////////////
		////// PRIVATE JS APIs for ASSET UPDATE

		/**
		* An enumeration of all the managed status of an actor's asset link.<br/>
		* It allows to refer in the code to a specific state.
		*
		* @enum {number}
		* @public
		*/
		Actor3D.EAssetLinkStatus = {
			eBroken: 0,
			eBrokenChild: 1,
			eOK: 2,
			eFiltered: 3,
		};

		/**
		* Retrieve the object's status relative to its asset link. <br/>
		*  
		* @method
		* @public
		* @return {STU.Actor3D.EAssetLinkStatus} enum describing the status of the object's asset link <br/>
		*/
		Actor3D.prototype.getAssetLinkStatus = function () {
			return Actor3D.EAssetLinkStatus.eOK;
		};

		////// ~JS APIs for ASSET UPDATE
		////////////////////////////////


		// Expose in STU namespace.
		STU.Actor3D = Actor3D;

		return Actor3D;
	});

define('StuRenderEngine/StuActor3D', ['DS/StuRenderEngine/StuActor3D'], function (Actor3D) {
	'use strict';

	return Actor3D;
});
