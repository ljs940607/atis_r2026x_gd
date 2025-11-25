define('DS/StuCID/StuUIActor3D', ['DS/StuCore/StuContext',
	'DS/StuRenderEngine/StuActor3D', 'DS/StuCID/StuUIEvents'], function (STU, Actor3D, UIEvents) {
		'use strict';

	var getterSetter = function (self, varName, readOnly = false) {
			if (!STU.isEKIntegrationActive()) {
				Object.defineProperty(self, varName, {
					enumerable: true,
					configurable: true,
					get: function () {
						if (self.CATI3DExperienceObject !== undefined && self.CATI3DExperienceObject !== null) {
							return self.CATI3DExperienceObject.GetValueByName(varName);
						}
					},
					set: function (value) {
						if (readOnly || !self.initialized) {
							return;
						}
						if (self.CATI3DExperienceObject !== undefined && self.CATI3DExperienceObject !== null) {
							self.CATI3DExperienceObject.SetValueByName(varName, value);
						}
					}
				});
			}
		};

		/**
		* Describes the base actor for all 3D UI Actors.
		* This class proposes properties and functions common to all 3D UI Actors.
		*
		* @exports UIActor3D
		* @class
		* @constructor
		* @noinstancector 
		* @public
		* @extends STU.Actor3D
		* @memberof STU
		* @alias STU.UIActor3D
		*/
		var UIActor3D = function () {

			Actor3D.call(this);
			this.name = 'UIActor3D';
			this.CATICXP3DUIActor;

			/**
			* Get/Set width
			*
			* @member
			* @instance
			* @name width
			* @public
			* @type {number}
			* @memberof STU.UIActor3D
			*/
			getterSetter(this, "width");


			/**
			* Get/Set height
			*
			* @member
			* @instance
			* @name height
			* @public
			* @type {number}
			* @memberof STU.UIActor3D
			*/
			getterSetter(this, "height");

			/**
			* Get/Set enabled
			*
			* @member
			* @instance
			* @name enabled
			* @public
			* @type {boolean}
			* @memberof STU.UIActor3D
			*/
			getterSetter(this, "enabled");

			/**
			* A 3D UI Actor has no color. <br/>
			* Changing this property will have no effect
			*
			* @public
			* @member
			* @instance
			* @type {STU.Color}
			*/
			this.color;

			/**
			* A 3D UI Actor has no property clickable. <br/>
			* Changing this property will have no effect
			*
			* @public
		    * @readonly
			* @member
			* @instance
			* @name clickable
			* @type {boolean}
		    * @memberof STU.UIActor3D
			* @see STU.Actor3D#clickable
			*/
			getterSetter(this, 'clickable', true);

		};

		UIActor3D.prototype = new Actor3D();
		UIActor3D.prototype.constructor = UIActor3D;
		UIActor3D.prototype.featureCatalog = 'CXP3DUIActor_Spec.feat';
		UIActor3D.prototype.featureStartup = 'CXP3DUIActor_Spec';

		UIActor3D.prototype.onInitialize = function (oExceptions) {
			Actor3D.prototype.onInitialize.call(this, oExceptions);
			if (this.CATICXP3DUIActor !== null && this.CATICXP3DUIActor !== undefined) {
				this.CATICXP3DUIActor.setESObject(this);
			}
		};

		UIActor3D.prototype.doUIDispatchEvent = function (iEventName, params) {
			try {
				var event;
				if (params == null || params === undefined) {
					event = new STU[iEventName](this);
				} else {
					var paramObj = JSON.parse(params);
					event = new STU[iEventName](this, paramObj);
				}
				if (event !== undefined) {
					this.dispatchEvent(event);
				}
			} catch (e) {
				console.error(e.stack);
			}
		};

		/** 
		* @method
		* @private
		* @see STU.UIActor3D#enable
		*/
		UIActor3D.prototype.isEnabled = function () {
			return this.enabled;
		}

		/**
		* Disables this STU.UIActor3D.
		*
		* @method
		* @private
		* @see STU.UIActor3D#enable
		*/
		UIActor3D.prototype.disables = function () {
			this.enabled = false;
		};

		/**
		* Enables this STU.UIActor3D.
		*
		* @method
		* @private
		* @see STU.UIActor3D#enable
		*/
		UIActor3D.prototype.enables = function () {
			this.enabled = true;
		};

		// Expose in STU namespace.
		STU.UIActor3D = UIActor3D;

		return UIActor3D;
	});

define('StuCID/StuUIActor3D', ['DS/StuCID/StuUIActor3D'], function (UIActor3D) {
	'use strict';

	return UIActor3D;
});
