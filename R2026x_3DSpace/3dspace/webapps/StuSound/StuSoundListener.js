define('DS/StuSound/StuSoundListener', ['DS/StuCore/StuContext', 'DS/StuModel/StuBehavior', 'DS/EPTaskPlayer/EPTask', 'DS/EPTaskPlayer/EPTaskPlayer', 'DS/MathematicsES/MathsDef', 'DS/StuRenderEngine/StuCameraNa', 'DS/StuRenderEngine/StuActor3D'],
	function (STU, Behavior, Task, TaskPlayer, DSMath, Camera, Actor3D) {
		'use strict';

		/**
		 * SoundListener HANDLER TASK.
		 * @class 
		 * @private
		 */
		var SoundListenerTask = function (behHandler) {
			Task.call(this);
			this.name = "SoundListenerTask";
			this.behHandler = behHandler;
		};

		SoundListenerTask.prototype = new Task();
		SoundListenerTask.constructor = SoundListenerTask;

		/**
		 * Method called each frame by the task manager
		 *
		 * @method
		 * @private
		 * @param  iExeCtx Execution context
		 */
		SoundListenerTask.prototype.onExecute = function (iExeCtx) {
			if (this.behHandler === undefined || this.behHandler === null) {
				return this;
			}
			var behHandler = this.behHandler;

			behHandler.update(iExeCtx.getDeltaTime() / 1000);
		};


		/**
		 * Describe a SoundListener behavior
		 *
		 * @exports SoundListener
		 * @class 
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends {STU.Behavior}
		 * @memberof STU
		 * @alias STU.SoundListener
		 */
		var SoundListener = function () {
			Behavior.call(this);
			this.name = 'SoundListener';

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Private object wrapper that hold the engine (win or web)
			 *
			 * @member
			 * @instance
			 * @name _soundListenerWrapper
			 * @private
			 * @type {Object}
			 * @memberof STU.SoundListener
			 */
			this._soundListenerWrapper = null;

			/**
			 * Private flag _isSpatialized used to know if spatialization is requiered
			 *
			 * @member
			 * @instance
			 * @name _isSpatialized
			 * @private
			 * @type {Boolean}
			 * @memberof STU.SoundListener
			 */
			this._isSpatialized = false;

			/**
			 * Actor holding the sound (for spatialization) <br/>
			 *
			 * @member
			 * @instance
			 * @name _actorSL
			 * @private
			 * @type {Object}
			 * @memberof STU.SoundListener
			 */
			this._actorSL = null;

			/**
			 * Transformation of the actor holding the listener (for spatialization) <br/>
			 *
			 * @member
			 * @instance
			 * @name _actorTransfoSL
			 * @private
			 * @type {DSMath.Transformation}
			 * @memberof STU.SoundListener
			 */
			this._actorTransfoSL = null;

			/**
			 * Flag to check if instance of camera (for spatialization) <br/>
			 *
			 * @member
			 * @instance
			 * @name _isActorSLCamera
			 * @private
			 * @type {Boolean}
			 * @memberof STU.SoundListener
			 */
			this._isActorSLCamera = false;

			//varaible needed to wrap and manage the current sound listener
			this.associatedTask;

			//////////////////////////////////////////////////////////////////////////
			// Properties that should be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Volume of played sound [0;1]
			 *
			 * @member
			 * @instance
			 * @name  volume
			 * @public
			 * @type {Number}
			 * @memberof STU.SoundListener
			 */

			this._volume = 1.0;
			Object.defineProperty(this, 'volume', {
				enumerable: true,
				configurable: true,
				get: function () {
					// for all case, this._soundListenerWrapper.getVolume() == this._volume
					/*if (!!this._soundListenerWrapper) {
						return this._soundListenerWrapper.getVolume();
					} else*/
					return this._volume;
				},
				set: function (iVolume) {
					this._volume = Math.min(Math.max(iVolume, 0), 1);

					this.updateVolume();					
				}
			});
		};



		SoundListener.prototype = new Behavior();
		SoundListener.prototype.constructor = SoundListener;
		SoundListener.prototype.protoId = 'BEDFDD1F-CBD5-4748-93AB-82FD4E01DDBE';
		SoundListener.prototype.pureRuntimeAttributes = [
			'_isSpatialized', '_actorTransfoSL'
		].concat(Behavior.prototype.pureRuntimeAttributes);

		/**
		 * The wrapper is shared between all sound Listener instance
		 * @private
		 * @type {Object}
		 */
		SoundListener._wrapper = null;

		/**
		 * Set the listener as the current one
		 *
		 * @method
		 * @public
		 */
		SoundListener.prototype.setAsCurrent = function () {
			//Remove of previous tasks 
			var tasks = TaskPlayer.getTasks();
			for (var i = tasks.length - 1; i >= 0; i--) {
				var task = tasks[i];

				if (task instanceof SoundListenerTask) {
					TaskPlayer.removeTask(task);
					task.behHandler._soundListenerWrapper = null; //[IR-782655] setAsCurrent returns error message
				}
			}

			// update volume level 
			this.volume = this._volume;

			TaskPlayer.addTask(this.associatedTask);
			//[IR-782655] setAsCurrent returns error message
			//_soundListenerWrapper was not defined on the new current listener
			if (SoundListener._wrapper !== null || SoundListener._wrapper !== undefined) {
				this._soundListenerWrapper = SoundListener._wrapper;
			}
		};

		/**
		 * True if this listener is the current one
		 *
		 * @method 
		 * @public
		 * @return {Boolean}
		 */
		SoundListener.prototype.isCurrentListener = function () {
			var tasks = TaskPlayer.getTasks();
			for (var i = tasks.length - 1; i >= 0; i--) {
				if (tasks[i] === this.associatedTask) {
					return true;
				}
			}

			return false;
		};

		/**
		 * Update method called each frames
		 *
		 * @method
		 * @private
		 */
		SoundListener.prototype.update = function () {
			//should be always true... (as we can only attach the sndListener behavior on a 3D actor)
			if (this._isSpatialized) {

				//gathering the infos of the actor holding the listener
				var transfo = this._actorSL.getTransform("World");

				//taking the position of the actor
				var positionVec = transfo.vector;
				positionVec.multiplyScalar(0.001); // cxp unit is mm sound engine is m
				transfo.vector = positionVec;

				//taking the orientation of the actor
				var forwardVec = transfo.matrix.getFirstColumn();
				var upVec = transfo.matrix.getThirdColumn();
				if (this._isActorSLCamera) {
					forwardVec.negate(); //Cameras are looking to -x
					transfo.matrix.setFirstColumn(forwardVec);
				}

				//checking if we need to update the position or orientation
				if (!this._actorTransfoSL.vector.isEqual(positionVec) || !this._actorTransfoSL.matrix.getFirstColumn().isEqual(forwardVec) || !this._actorTransfoSL.matrix.getThirdColumn().isEqual(upVec) ) {
					this._actorTransfoSL = transfo;
					this._soundListenerWrapper.setTransformation(this._actorTransfoSL);
				}
			}
		};

		/**
		 * Process executed when STU.SoundListener is activating
		 *
		 * @method
		 * @private
		 */
		SoundListener.prototype.onActivate = function (oExceptions) {
			Behavior.prototype.onActivate.call(this, oExceptions);

			this._actorSL = this.getActor();
			this._isSpatialized = this._actorSL instanceof Actor3D;
			this._isActorSLCamera = this._actorSL instanceof Camera;

			this.associatedTask = new SoundListenerTask(this);

			//By default the first SoundListener is activated
			if (SoundListener._wrapper === null || SoundListener._wrapper === undefined) {
				SoundListener._wrapper = this.buildWrapper(); // jshint ignore:line
				this._soundListenerWrapper = SoundListener._wrapper;
			} else {
				// other SoundListener 
				return;
			}

			//init setting up the variables for spatizalisation
			this._actorTransfoSL = new DSMath.Transformation();
			//seting up in engine as well
			this._soundListenerWrapper.setTransformation(this._actorTransfoSL);

			this.updateVolume();

			TaskPlayer.addTask(this.associatedTask);
		};

		/**
		 * 
		 * @private
		 */
		SoundListener.prototype.updateVolume = function () {
			if (!!this._soundListenerWrapper) {
				this._soundListenerWrapper.setVolume(this._volume);
			}
		};

		/**
		 * Process executed when STU.SoundListener is deactivating
		 *
		 * @method
		 * @private
		 */
		SoundListener.prototype.onDeactivate = function () {
			TaskPlayer.removeTask(this.associatedTask);
			delete this.associatedTask;
			delete SoundListener._wrapper;

			Behavior.prototype.onDeactivate.call(this);
		};


		// Expose in STU namespace.
		STU.SoundListener = SoundListener;

		return SoundListener;
	});

define('StuSound/StuSoundListener', ['DS/StuSound/StuSoundListener'], function (SoundListener) {
	'use strict';

	return SoundListener;
});
