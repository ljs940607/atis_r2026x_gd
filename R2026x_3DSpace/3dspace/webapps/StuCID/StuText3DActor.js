
define('DS/StuCID/StuText3DActor', ['DS/StuCore/StuContext', 'DS/StuCID/StuUIActor3D', 'DS/StuCore/StuTools', 'DS/StuRenderEngine/StuColor'],
	function (STU, UIActor3D, Tools, Color) {
		'use strict';

		/**
		* @exports Text3DActor
		* @class
		* @constructor
		* @noinstancector 
		* @public
		* @extends STU.UIActor3D
		* @memberof STU
		* @alias STU.Text3DActor
		*/
		var Text3DActor = function () {
			UIActor3D.call(this);
			this.name = 'Text3DActor';

			/**
			 * Get/Set text
			 *
			 * @member
			 * @instance
			 * @name text
			 * @public
			 * @type {string}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVariable(this, "text", "string");

			/**
			 * Get/Set font size
			 *
			 * @member
			 * @instance
			 * @name fontSize
			 * @public
			 * @type {number}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVariable(this, "fontSize", "number");

			/**
			 * Get/Set font
			 *
			 * @member
			 * @instance
			 * @name font
			 * @public
			 * @type {string}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVariable(this, "font", "string");

			 
			/**
			 * Get/Set italic
			 *
			 * @member
			 * @instance
			 * @name italic
			 * @public
			 * @type {boolean}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVariable(this, "italic", "boolean");

			/**
			 * Get/Set bold
			 *
			 * @member
			 * @instance
			 * @name bold
			 * @public
			 * @type {boolean}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVariable(this, "bold", "boolean");

			/**
			 * Get/Set alignment
			 *
			 * @member
			 * @instance
			 * @name alignment
			 * @public
			 * @type {STU.Text3DActor.ETextAlignments}
			 * @memberof STU.Text3DActor
			 */
			 Object.defineProperty(this, "alignment", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						return this.CATI3DExperienceObject.GetValueByName("alignment");
					}
				},
				set: function (value) {
					if (value !== STU.Text3DActor.ETextAlignments.eAlignLeft
						&& value !== STU.Text3DActor.ETextAlignments.eAlignCenter
						&& value !== STU.Text3DActor.ETextAlignments.eAlignRight){
						throw new TypeError("given value should be a value from STU.Text3DActor.ETextAlignments");
					}
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						this.CATI3DExperienceObject.SetValueByName("alignment", value);
					}
				}
			});

			/**
			 * Get/Set text color
			 * 
			 * @member
			 * @instance
			 * @name textColor
			 * @public
			 * @type {STU.Color}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVCXColor(this, "textColor", Color);

			/**
			 * Get/Set text opacity. Value is between 0 and 1
			 *
			 * @member
			 * @instance
			 * @name textOpacity
			 * @public
			 * @type {number}
			 * @memberof STU.Text3DActor
			 */
			 Object.defineProperty(this, "textOpacity", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						return this.CATI3DExperienceObject.GetValueByName("textOpacity");
					}
				},
				set: function (value) {
					if (typeof value !== "number") {
						throw new TypeError('given value is not a number');
					}
					if (value > 1 || value < 0){
						throw new TypeError("given value should be between 0 and 1");
					}
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						this.CATI3DExperienceObject.SetValueByName("textOpacity", value);
					}
				}
			});

			/**
			 * Get/Set show background
			 *
			 * @member
			 * @instance
			 * @name showBackground
			 * @public
			 * @type {boolean}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVariable(this, "showBackground", "boolean");

			/**
			 * Get/Set background color
			 * 
			 * @member
			 * @instance
			 * @name backgroundColor
			 * @public
			 * @type {STU.Color}
			 * @memberof STU.Text3DActor
			 */
			 Tools.bindVCXColor(this, "backgroundColor", Color);

			/**
			 * Get/Set background opacity. Value is between 0 and 1
			 *
			 * @member
			 * @instance
			 * @name backgroundOpacity
			 * @public
			 * @type {number}
			 * @memberof STU.Text3DActor
			 */
			Object.defineProperty(this, "backgroundOpacity", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						return this.CATI3DExperienceObject.GetValueByName("backgroundOpacity");
					}
				},
				set: function (value) {
					if (typeof value !== "number") {
						throw new TypeError('given value is not a number');
					}
					if (value > 1 || value < 0){
						throw new TypeError("given value should be between 0 and 1");
					}
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						this.CATI3DExperienceObject.SetValueByName("backgroundOpacity", value);
					}
				}
			});


			/**
			 * Get/Set show border
			 *
			 * @member
			 * @instance
			 * @name showBorder
			 * @public
			 * @type {boolean}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVariable(this, "showBorder", "boolean");

			/**
			 * Get/Set border color
			 * 
			 * @member
			 * @instance
			 * @name borderColor
			 * @public
			 * @type {STU.Color}
			 * @memberof STU.Text3DActor
			 */
			Tools.bindVCXColor(this, "borderColor", Color);
			
			/**
			 * Get/Set border opacity. Value is between 0 and 1
			 *
			 * @member
			 * @instance
			 * @name borderOpacity
			 * @public
			 * @type {number}
			 * @memberof STU.Text3DActor
			 */
			Object.defineProperty(this, "borderOpacity", {
				enumerable: true,
				configurable: true,
				get: function () {
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						return this.CATI3DExperienceObject.GetValueByName("borderOpacity");
					}
				},
				set: function (value) {
					if (typeof value !== "number") {
						throw new TypeError('given value is not a number');
					}
					if (value > 1 || value < 0){
						throw new TypeError("given value should be between 0 and 1");
					}
					if (this.CATI3DExperienceObject !== undefined && this.CATI3DExperienceObject !== null) {
						this.CATI3DExperienceObject.SetValueByName("borderOpacity", value);
					}
				}
			});

		};

		Text3DActor.prototype = new UIActor3D();
		Text3DActor.prototype.constructor = Text3DActor;

		/**
		 * for NL capacity
		 *
		 * @method
		 * @private
		 */
		 Text3DActor.prototype.setText = function (iText) {
			this.text = iText;
		}

		/**
		* Enumeration of all possible text alignments
		*
		* @enum {number}
		* @public
		*/
		Text3DActor.ETextAlignments = {
			eAlignLeft: 0,
			eAlignCenter: 1,
			eAlignRight: 2
		};

		// Expose in STU namespace.
		STU.Text3DActor = Text3DActor;
		return Text3DActor;
	});

define('StuCID/StuText3DActor', ['DS/StuCID/StuText3DActor'], function (Text3DActor) {
	'use strict';

	return Text3DActor;
});


