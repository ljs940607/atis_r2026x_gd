var stuContextRequires = [
	'DS/StuCore/StuContext',
	'DS/StuModel/StuBehavior',
	'DS/EPEventServices/EPEvent',
	'DS/EPEventServices/EPEventServices',
	'DS/MathematicsES/MathsDef',
	'DS/StuRenderEngine/StuCameraNa',
	'DS/StuRenderEngine/StuActor3D',
	'DS/StuSound/StuSoundPlayerStartedEvent',
	'DS/StuSound/StuSoundPlayerStoppedEvent',
	'DS/StuSound/StuSoundPlayerPausedEvent',
	'DS/StuSound/StuSoundPlayerResumedEvent',
	'DS/StuSound/StuSoundPlayerFinishedEvent',
];
if (typeof (window) === 'undefined') {
	stuContextRequires.push('binary!StudioSoundModelRT');
}
//warn! by using the variable stuContextRequires, we might be missing some LINK_WITH issues to be added in the imakefile (not sure why we have to add the binary?)

define('DS/StuSound/StuSoundPlayer', stuContextRequires, function (
	STU,
	Behavior,
	Event,
	EventServices,
	DSMath,
	Camera,
	Actor3D) {
	'use strict';

	//////////////////////////////////////////////////////////////////////////
	// Actual Sound Player behavior defintion
	//////////////////////////////////////////////////////////////////////////

	/**
	 * Describe a behavior able to play a specialized sound.
	 *
	 * @exports SoundPlayer
	 * @class 
	 * @constructor
	 * @noinstancector
	 * @public
	 * @extends {STU.Behavior}
	 * @memberof STU
     * @alias STU.SoundPlayer
	 */
	var SoundPlayer = function () {

		Behavior.call(this);
		this.name = 'SoundPlayer';

		//////////////////////////////////////////////////////////////////////////
		// Properties that should NOT be visible in UI
		//////////////////////////////////////////////////////////////////////////

		/**
		 * Private object wrapper that hold the engine (win or web)
		 *
		 * @member
		 * @instance
		 * @name _sndSoundWrapper
		 * @private
		 * @type {Object}
		 * @memberof STU.SoundPlayer
		 */
		this._sndSoundWrapper = this.buildWrapper(); // jshint ignore:line

		/**
		 * Private flag _isSpatialized used to know if spatialization is requiered
		 *
		 * @member
		 * @instance
		 * @name _isSpatialized
		 * @private
		 * @type {Boolean}
		 * @memberof STU.SoundPlayer
		 */
		this._isSpatialized = false;

		/**
		 * Private flag _hasStartedPlaying used to know when sound finished
		 *
		 * @member
		 * @instance
		 * @name _hasStartedPlaying
		 * @private
		 * @type {Boolean}
		 * @memberof STU.SoundPlayer
		 */
		this._hasStartedPlaying = false;

		/**
		 * Actor holding the sound (for spatialization) <br/>
		 *
		 * @member
		 * @instance
		 * @name _actorSP
		 * @private
		 * @type {Object}
		 * @memberof STU.SoundPlayer
		 */
		this._actorSP = null;

		/**
		 * Transformation of the actor holding the sound (for spatialization) <br/>
		 *
		 * @member
		 * @instance
		 * @name _actorTransfoSP
		 * @private
		 * @type {DSMath.Transformation}
		 * @memberof STU.SoundPlayer
		 */
		this._actorTransfoSP = null;

		/**
		 * Flag to check if instance of camera (for spatialization) <br/>
		 *
		 * @member
		 * @instance
		 * @name _isActorSPCamera
		 * @private
		 * @type {Boolean}
		 * @memberof STU.SoundPlayer
		 */
		this._isActorSPCamera = false;

		//////////////////////////////////////////////////////////////////////////
		// Properties that should be visible in UI
		//////////////////////////////////////////////////////////////////////////

		/**
		 * Sound resource that will be played
		 *
		 * @member
		 * @instance
		 * @name  sound
		 * @public
		 * @type {STU.SoundResource}
		 * @memberof STU.SoundPlayer
		 */
		this._sound = null;
		Object.defineProperty(this, 'sound', {
			enumerable: true,
			configurable: true,
			get: function () {
				return this._sound;
			},
			set: function (iSound) {
				this._sound = iSound;

				this.updateSound(); //no arg -> true, to change the sound we need first to stop it
			}
		});


		/**
		 * Loop mode <br/>
		 *  true : the sound is repeated after having reached the end <br/>
		 *  false : the sound will stop when the end is reached <br/>
		 *
		 * @member
		 * @instance
		 * @name  loop
		 * @public
		 * @type {Boolean}
		 * @memberof STU.SoundPlayer
		 */
		this._loop = true;
		Object.defineProperty(this, 'loop', {
			enumerable: true,
			configurable: true,
			get: function () {
				if (!!this._sndSoundWrapper && this._sndSoundWrapper.getEngineStatus() === 1) {
					return (1 === this._sndSoundWrapper.isLooping());
				}

				return this._loop;
			},
			set: function (iLoop) {
				this._loop = iLoop;

				// for onActivate, called by updateSound()
				if (!!this._sndSoundWrapper) {
					this._sndSoundWrapper.setLoopMode(iLoop);
				}
			}
		});

		/**
		 * Volume of played sound [0;1]
		 *
		 * @member
		 * @instance
		 * @name  volume
		 * @public
		 * @type {Number}
		 * @memberof STU.SoundPlayer
		 */
		this._volume = 1.0;
		Object.defineProperty(this, 'volume', {
			enumerable: true,
			configurable: true,
			get: function () {
				// always this._volume, setVolume is always called with this._volume
				/*if (!!this._sndSoundWrapper) {
					this._volume = this._sndSoundWrapper.getVolume();
				}*/

				return this._volume;
			},
			set: function (iVolume) {
				this._volume = Math.min(Math.max(iVolume, 0), 1);

				// for onActivate, called by this.updateSound()
				if (!!this._sndSoundWrapper) {
					this._sndSoundWrapper.setVolume(this._volume);
				}
			}
		});

		/**
		 * Duration of the sound in seconds
		 *
		 * @member
		 * @instance
		 * @name  duration
		 * @readOnly
		 * @public
		 * @type {Number}
		 * @memberof STU.SoundPlayer
		 */
		Object.defineProperty(this, 'duration', {
			enumerable: true,
			configurable: true,
			get: function () {
				var duration = -1;
				if (!!this._sndSoundWrapper) {
					duration = this._sndSoundWrapper.getDuration();
				}

				return duration;
			}
		});

		/**
		 * Percentage of the sound already played <br/>
		 * Range : [0;100]
		 *
		 * @member
		 * @instance
		 * @name  playPosition
		 * @readOnly
		 * @public
		 * @type {Number}
		 * @memberof STU.SoundPlayer
		 */
		Object.defineProperty(this, 'playPosition', {
			enumerable: true,
			configurable: true,
			get: function () {
				var playPosition = -1;
				if (!!this._sndSoundWrapper) {
					playPosition = this._sndSoundWrapper.getPlayPostion();
				}

				return playPosition;
			}
		});

		/**
		 * Inner angle of the sound cone, in radian <br/>
		 * Range : [0;2*Math.PI]
		 *
		 * @member
		 * @instance
		 * @name  coneInnerAngle
		 * @private
		 * @default 2*Math.PI
		 * @type {Number}
		 * @memberof STU.SoundPlayer
		 */
		this._coneInnerAngle = 2 * Math.PI;
		Object.defineProperty(this, 'coneInnerAngle', {
			enumerable: true,
			configurable: true,
			get: function () {
				if (!!this._sndSoundWrapper) {
					this._coneInnerAngle = this._sndSoundWrapper.getConeInnerAngle();
				}

				return this._coneInnerAngle;
			},
			set: function (iConeInnerAngle) {
				this._coneInnerAngle = iConeInnerAngle;

				this.updateConeInnerAngle();
			}
		});

		/**
		 * Outer angle of the sound cone, in radian <br/>
		 * Range : [0;2*Math.PI]
		 *
		 * @member
		 * @instance
		 * @name  coneOuterAngle
		 * @private
		 * @default 2*Math.PI
		 * @type {Number}
		 * @memberof STU.SoundPlayer
		 */
		this._coneOuterAngle = 2 * Math.PI;
		Object.defineProperty(this, 'coneOuterAngle', {
			enumerable: true,
			configurable: true,
			get: function () {
				if (!!this._sndSoundWrapper) {
					this._coneOuterAngle = this._sndSoundWrapper.getConeOuterAngle();
				}

				return this._coneOuterAngle;
			},
			set: function (iConeOuterAngle) {
				this._coneOuterAngle = iConeOuterAngle;

				this.updateConeOuterAngle();
			}
		});

		/**
		 * Source roll-off factor <br/>
		 * Range : [0.0 ; +inf]
		 *
		 * @member
		 * @instance
		 * @name  rollOffFactor
		 * @private
		 * @default 1
		 * @type {Number}
		 * @memberof STU.SoundPlayer
		 */
		this._rollOffFactor = 1;
		Object.defineProperty(this, 'rollOffFactor', {
			enumerable: true,
			configurable: true,
			get: function () {
				if (!!this._sndSoundWrapper) {
					this._rollOffFactor = this._sndSoundWrapper.getRollOffFactor();
				}

				return this._rollOffFactor;
			},
			set: function (iRollOffFactor) {
				this._rollOffFactor = iRollOffFactor;

				this.updateRollOffFactor();
			}
		});


		/**
		 * Sound pitch <br/>
		 * Range : [0.5;2.0]
		 *
		 * @member
		 * @instance
		 * @name  pitch
		 * @private
		 * @default 1
		 * @type {Number}
		 * @memberof STU.SoundPlayer
		 */
		this._pitch = 1.0;
		Object.defineProperty(this, 'pitch', {
			enumerable: true,
			configurable: true,
			get: function () {
				if (!!this._sndSoundWrapper) {
					this._pitch = this._sndSoundWrapper.getPitch();
				}

				return this._pitch;
			},
			set: function (iPitch) {
				this._pitch = iPitch;

				this.updatePitch();
			}
		});

		/**
		 * The speed of sound. It is used in Doppler computing.
		 *
		 * @member
		 * @instance
		 * @name  tempo
		 * @private
		 * @type {Number}
		 * @default  343.3
		 * @memberof STU.SoundPlayer
		 */
		this._tempo = 0;
		Object.defineProperty(this, 'tempo', {
			enumerable: true,
			configurable: true,
			get: function () {
				if (!!this._sndSoundWrapper) {
					this._tempo = this._sndSoundWrapper.getTempo();
				}

				return this._tempo;
			},
			set: function (iTempo) {
				this._tempo = iTempo;

				this.updateTempo();
			}
		});


		this._speed = 1.0;
		Object.defineProperty(this, 'speed', {
			enumerable: true,
			configurable: true,
			get: function () {
				return this._speed;
			},
			set: function (iSpeed) {
				// IR-1106726: need to use binding bindVariableDouble of StuTools.js instead, but need refactoring, simply to a quick check here
				this._speed = Math.max(iSpeed, 0.001);
				this.pitch = Math.max(iSpeed, 0.001); //note that _speed is not used, it is pitch that manages the sound's speed
			}
		});

	};



	SoundPlayer.prototype = new Behavior();
	SoundPlayer.prototype.constructor = SoundPlayer;
	SoundPlayer.prototype.pureRuntimeAttributes = [
		'_loop', '_volume', '_actorTransfoSP', '_sndSoundWrapper', '_isSpatialized'
	].concat(Behavior.prototype.pureRuntimeAttributes);


	/**
	 * Update method called each frames
	 *
	 * @method
	 * @private
	 * @param   {Number} iElapsedTime Time elapsed since last frame
	 */
	SoundPlayer.prototype.onExecute = function () {
		//added for NL usage
		this.handleSoundFinished();

		//spacialiazed sound management (pos&dir of actor)
		if (this._isSpatialized && this.isPlaying()) {

			//gathering the infos of the actor holding the sound
			var transfo = this._actorSP.getTransform("World");  //PCS: this takes 20microseconds

			//taking the position of the actor
			var positionVec = transfo.vector;
			if (positionVec !== undefined) {
				positionVec.multiplyScalar(0.001); // cxp unit is mm sound engine is m
				transfo.vector = positionVec;
			}

			//taking the direction of the actor
			var directionVec = transfo.matrix.getFirstColumn();
			if (this._isActorSPCamera) {
				directionVec.negate(); //Cameras are looking to -x
				transfo.matrix.setFirstColumn(directionVec);
			}

			//checking if we need to update the position or direction
			if (this._actorTransfoSP) {
				if (!this._actorTransfoSP.vector.isEqual(positionVec) || !this._actorTransfoSP.matrix.getFirstColumn().isEqual(directionVec)) {
					this._actorTransfoSP = transfo;
					this._sndSoundWrapper.setTransformation(this._actorTransfoSP); //PCS: this also takes 20microseconds
				}
			}
		}
	};

	/**
	 * Computes if we finished to play the sound
	 *
	 * @method
	 * @private
	 */
	SoundPlayer.prototype.handleSoundFinished = function () {
		//check that sound has started
		if (this._hasStartedPlaying === true) {

			//so i can deduce that if playPosition is equals 0, then we have finished play the sound
			if (this.playPosition === 0) {

				//we say now that we dont have play sound anymore
				this._hasStartedPlaying = false;

				// Notify NL listeners the ending of sound
				var actor = this.getActor();
				var evt = new STU.SoundPlayerFinishedEvent();
				actor.dispatchEvent(evt);

				// Send event service finished (for NL: "Then" functionnalty)
				this.dispatchEvent(new STU.ServiceStoppedEvent("soundPlayerPlayService", this));
			}
		}
		else if (this.playPosition > 0) {
			// save the info that we have started the sound (cannot link it to .play() as duration doesnt start at the eact frame)
			this._hasStartedPlaying = true;
		}
		
	};



	/**
	 * Plays the sound resource
	 * @method
	 * @public
	 */
	SoundPlayer.prototype.play = function () {
		// Actually send instruction to play sound
		this._sndSoundWrapper.play();

		// Notify NL listeners the start of sound
		var actor = this.getActor();
		var evt = null;
		//check if we were playing before (if was paused, then resume)
		if (this.playPosition === 0) {
			evt = new STU.SoundPlayerStartedEvent();
		}
		else {
			evt = new STU.SoundPlayerResumedEvent();
		}
		actor.dispatchEvent(evt);
	};

	/**
	 * Pauses the sound resource
	 * @method
	 * @public
	 */
	SoundPlayer.prototype.pause = function () {
		this._sndSoundWrapper.pause();

		// Notify NL listeners the pause of sound
		var actor = this.getActor();
		var evt = new STU.SoundPlayerPausedEvent();
		actor.dispatchEvent(evt);
	};

	/**
	 * Stops the playing sound
	 * @method
	 * @public
	 */
	SoundPlayer.prototype.stop = function () {
		this._sndSoundWrapper.stop();

		// Notify NL listeners the end of sound
		var actor = this.getActor();
		var evt = new STU.SoundPlayerStoppedEvent();
		actor.dispatchEvent(evt);

		// Send event service finished (for NL: "Then" functionnalty)
		this.dispatchEvent(new STU.ServiceStoppedEvent("soundPlayerPlayService", this));
	};

	/**
	 * Resumes the sound resource
	 * @method
	 * @public
	 */
	SoundPlayer.prototype.resume = function () {
		//fct for NL purpose
		if (!this.isPlaying()) {
			this.play(); //NL event sent by play itself
		}
	};

	/**
	 * Play state : <br/>
	 *     true if the sound is playing <br/>
	 *     false otherwise <br/>
	 *
	 * @method
	 * @public
	 * @return {Boolean}
	 */
	SoundPlayer.prototype.isPlaying = function () {
		return this._sndSoundWrapper.isPlaying();
	};

	/**
	 * Pause state : <br/>
	 *     true if the sound is paused <br/>
	 *     false otherwise <br/>
	 *
	 * @method
	 * @public
	 * @return {Boolean}
	 */
	SoundPlayer.prototype.isPaused = function () {
		return this._sndSoundWrapper.isPaused();
	};

	/**
	 * Stop state : <br/>
	 *     true if the sound is stopped <br/>
	 *     false otherwise <br/>
	 *
	 * @method
	 * @public
	 * @return {Boolean}
	 */
	SoundPlayer.prototype.isStopped = function () {
		return this._sndSoundWrapper.isStopped();
	};


	/**
	 * Process executed when SoundPlayer is activating
	 * @method
	 * @private
	 */
	SoundPlayer.prototype.onActivate = function (oExceptions) {
		Behavior.prototype.onActivate.call(this, oExceptions);

		//setted so that we dont need to call getParent again for PCS issue (not supposed to changed)
		this._actorSP = this.getActor();

		//checking that it needs spatialization or not
		this._isSpatialized = this._actorSP instanceof Actor3D;

		//checking to know to reverse correctly for special case of cameras because Cameras are looking to -x
		this._isActorSPCamera = this._actorSP instanceof Camera;

		if (!this._sndSoundWrapper) {
			console.error("No sound engine has been detected.")
			return;
		}

		if (!this._sound || !this._sound.CATI3DExperienceObject) {
			console.warn("No sound resource has been set, please make sure that it will be at least set dynamically.")
		}

		//init setting up the variables for spatizalisation
		this._actorTransfoSP = new DSMath.Transformation();
		// DCN23: IR-1118788 when not spatialized sound issue because no position/direction is ever set (they are only called to update the player when moving for spatialization)
		// moving fix here from cppEngine cause spatialization is not meant to be changed (for now ?) (=if not spatialized->isNot3DActor->willNotChange)
		this._sndSoundWrapper.setTransformation(this._actorTransfoSP);

		//first updates for inits
		this.updateSound(false); //IR-1111981: here im calling update sound to initialize the soundPlayer, but if we have done a start with another script before the init it will be stopped :(
		this.updateTempo();
		this.updatePitch();
		this._sndSoundWrapper.setSpeed({
			x: 1,
			y: 1,
			z: 1
		});

		this.updateConeInnerAngle();
		this.updateConeOuterAngle();
		this.updateRollOffFactor();

		// Sound engine activation 
		var sndStatus = this._sndSoundWrapper.getEngineStatus();
		if (sndStatus !== 1) {
			this._sndSoundWrapper.playSoundEngine();
		}

		//force the mute of the sound on start after engine has been actually activated, cant do if before...
		if (STU.SoundManager.getInstance()._isMuted === true) {
			this._sndSoundWrapper.setVolume(0.000001); //cant set it to 0, so i set to very smol
		}
	};

	/**
	 * 
	 * @private
	 */
	SoundPlayer.prototype.updateSound = function (iChangeSound = true) {
		if (!!this._sndSoundWrapper && !!this._sound && !!this._sound.CATI3DExperienceObject) {
			var isPlaying = this.isPlaying();

			// IR-1111981: if we are changing the sound file, we stop the current play of the current file and then we change the sound played (to ensure that we change sound played, i do believe done on the "SetSound")
			// the only case we dodge this (for now) is that when we are calling updateSound from onActivate we are forced to stop but it is not necessary as we are in onActivate (so before fix we override the start before the init)
			if (iChangeSound) {
				this.stop();
			}

			this._sndSoundWrapper.setResource(this._sound.CATI3DExperienceObject);
			// IBS CORRECTION SUMMER PROJECT
			this._sndSoundWrapper.setSpatialized(this._isSpatialized);
			this._sndSoundWrapper.setLoopMode(this._loop);
			this._sndSoundWrapper.setVolume(this._volume);


			// IR-376085 
			// Handle the case where the user wants to change the sound while playing
			if (isPlaying) {
				this.play();
			}
		}
	};

	/**
	 * 
	 * //Dummy function for NL to set speed
	 * @private
	 */
	SoundPlayer.prototype.setSpeed = function (iSpeed) {
		if (!!this) {
			this.speed = iSpeed;
		}
	};

	/**
	 * 
	 * //Dummy function for NL to set volume
	 * @private
	 */
	SoundPlayer.prototype.setVolume = function (iVolume) {
		if (!!this) {
			this.volume = iVolume;
		}
	};

	/**
	 * 
	 * //Dummy function for NL to set playPosition
	 * @private
	 */
	SoundPlayer.prototype.setPlayPosition = function (iSetPlayPosition) {
		if (!!this) {
			this.playPosition = iSetPlayPosition;
		}
	};

	/**
	 * 
	 * @private
	 */
	SoundPlayer.prototype.updateTempo = function () {
		if (!!this._sndSoundWrapper) {
			this._sndSoundWrapper.setTempo(this._tempo);
		}
	};

	/**
	 * 
	 * @private
	 */
	SoundPlayer.prototype.updatePitch = function () {
		if (!!this._sndSoundWrapper) {
			this._sndSoundWrapper.setPitch(this._pitch);
		}
	};

	/**
	 * 
	 * @private
	 */
	SoundPlayer.prototype.updateConeInnerAngle = function () {
		if (!!this._sndSoundWrapper) {
			this._sndSoundWrapper.setConeInnerAngle(this._coneInnerAngle);
		}
	};

	/**
	 * 
	 * @private
	 */
	SoundPlayer.prototype.updateConeOuterAngle = function () {
		if (!!this._sndSoundWrapper) {
			this._sndSoundWrapper.setConeOuterAngle(this._coneOuterAngle);
		}
	};

	/**
	 * 
	 * @private
	 */
	SoundPlayer.prototype.updateRollOffFactor = function () {
		if (!!this._sndSoundWrapper) {
			this._sndSoundWrapper.setRollOffFactor(this._rollOffFactor);
		}
	};

	/**
	 * Process executed when SoundPlayer is deactivating
	 * @method
	 * @private
	 */
	SoundPlayer.prototype.onDeactivate = function () {
		if (!!this._sndSoundWrapper) {
			this._sndSoundWrapper.stop();
			this._sndSoundWrapper.stopSoundEngine();
		}

		// delete this._sndSoundWrapper;

		Behavior.prototype.onDeactivate.call(this);
	};

	// Expose in STU namespace.
	STU.SoundPlayer = SoundPlayer;

	return SoundPlayer;
});

define('StuSound/StuSoundPlayer', ['DS/StuSound/StuSoundPlayer'], function (SoundPlayer) {
	'use strict';

	return SoundPlayer;
});
