
define('DS/StuCID/StuButton3DActor', ['DS/StuCore/StuContext', 'DS/StuCID/StuUIActor3D', 'DS/StuCore/StuTools', 'DS/MathematicsES/MathsDef'],
	function (STU, UIActor3D, Tools, DSMath) {
		'use strict';

		/**
		* @exports Button3DActor
		* @class
		* @constructor
		* @noinstancector 
		* @public
		* @extends STU.UIActor3D
		* @memberof STU
		* @alias STU.Button3DActor
		*/
		var Button3DActor = function () {
			UIActor3D.call(this);
			this.name = 'Button3DActor';

			/**
			 * Get/Set label
			 *
			 * @member
			 * @instance
			 * @name label
			 * @public
			 * @type {string}
			 * @memberof STU.Button3DActor
			 */
			Tools.bindVariable(this, "label", "string");

			/**
			 * Get/Set font size
			 *
			 * @member
			 * @instance
			 * @name fontSize
			 * @public
			 * @type {number}
			 * @memberof STU.Button3DActor
			 */
			Tools.bindVariable(this, "fontSize", "number");

			/**
			 * Get/Set pushable
			 *
			 * @member
			 * @instance
			 * @name pushable
			 * @public
			 * @type {boolean}
			 * @memberof STU.Button3DActor
			 */
			Tools.bindVariable(this, "pushable", "boolean");

			/**
			 * Get/Set pushed
			 *
			 * @member
			 * @instance
			 * @name pushed
			 * @public
			 * @type {boolean}
			 * @memberof STU.Button3DActor
			 */
			Tools.bindVariable(this, "pushed", "boolean");

			/**
			 * Get/Set icon
			 *
			 * @member
			 * @instance
			 * @name icon
			 * @public
			 * @type {STU.PictureResource}
			 * @memberof STU.Button3DActor
			 */
			Tools.bindVariable(this, "icon", "object");

			/**
			 * Get/Set icon dimension
			 *
			 * @member
			 * @instance
			 * @name iconDimension
			 * @public
			 * @type {DSMath.Vector2D}
			 * @memberof STU.Button3DActor
			 */
			Tools.bindObject(this, "iconDimension", DSMath.Vector2D, ["x", "y"]);
		};

		Button3DActor.prototype = new UIActor3D();
		Button3DActor.prototype.constructor = Button3DActor;

		// Expose in STU namespace.
		STU.Button3DActor = Button3DActor;
		return Button3DActor;
	}
);

define('StuCID/StuButton3DActor', ['DS/StuCID/StuButton3DActor'], function (Button3DActor) {
	'use strict';

	return Button3DActor;
});
