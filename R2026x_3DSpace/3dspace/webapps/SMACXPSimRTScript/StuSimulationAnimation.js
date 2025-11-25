/// <amd-module name="DS/SMACXPSimRTScript/StuSimulationAnimation"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("DS/SMACXPSimRTScript/StuSimulationAnimation", ["require", "exports", "DS/StuCore/StuContext", "DS/StuModel/StuAnimation", "DS/SMACXPSimRTScript/StuAnimationPlayer"], function (require, exports, STU, Animation, AnimationPlayer) {
    "use strict";
    //import AnimationPlayer = require("DS/CXPKinAnimation/StuAnimationPlayer");
    var SimulationAnimation = /** @class */ (function (_super) {
        __extends(SimulationAnimation, _super);
        /**
         * Describes a Simulation Animation object.
         *
         * <p>Simulation Animations are objects exposed on Physics Simulation Result Actor, and share similar play capabilities with Experience animations.
         * They are retrieved with the same getAnimations / getAnimationByName methods exposed on Actor3D, but only Result Actors actually host and
         * return Simulation Animations
         * </p>
         *
         * @example
         *  // get a Result actor, retrieve on of its animations and play it
         * 	var actor = this.getExperience().getActorByName("MySimulationResultActor");
         *  var anim = actor.getAnimationByName("MySimulationResultAnimation");
         *  anim.play();
         *
         * @public
         * @exports SimulationAnimation
         * @memberof STU
         * @class
         * @extends {STU.Animation}
         * @alias STU.SimulationAnimation
         * @constructor
         * @noinstancector
         */
        function SimulationAnimation() {
            var _this = _super.call(this) || this;
            /**
            * Get duration
            *
            * @member
            * @instance
            * @name duration
            * @public
            * @type {number}
            * @memberOf STU.SimulationAnimation
            */
            _this._duration = 0;
            /**
             * C++ class bindings to control the animation engine
             *
             * @private
             * @type {stu__SimulationAnimationWrapper}
             * @constructor
             */
            _this._wrapper = null;
            return _this;
        }
        Object.defineProperty(SimulationAnimation.prototype, "duration", {
            get: function () {
                return this._duration;
            },
            set: function (iDuration) { },
            enumerable: false,
            configurable: true
        });
        /**
        * Plays the animation. <br/>
        * If already playing, does nothing. <br/>
        * It takes into account the various parameters defined on.
        *
        * @method
        * @name STU.SimulationAnimation#play
        * @function
        */
        SimulationAnimation.prototype.play = function () {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                animPlayer.play(this);
            }
            else {
                console.error("could not play the animation");
            }
        };
        ;
        /**
        * Pauses the animation if playing.
        *
        * @method
        * @name STU.SimulationAnimation#pause
        * @function
        */
        SimulationAnimation.prototype.pause = function () {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                animPlayer.pause(this);
            }
            else {
                console.error("could not pause the animation");
            }
        };
        ;
        /**
        * Stops the animation.
        *
        * @method
        * @name STU.SimulationAnimation#stop
        * @function
        */
        SimulationAnimation.prototype.stop = function () {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                animPlayer.stop(this);
            }
            else {
                console.error("could not stop the animation");
            }
        };
        ;
        /**
         * Tells if the animation is playing
         *
         * @public
         * @return {boolean}
         * @name STU.SimulationAnimation#isPlaying
         * @function
         */
        SimulationAnimation.prototype.isPlaying = function () {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                return animPlayer.isPlaying(this);
            }
            return false;
        };
        ;
        /**
         * Tells if the animation is paused
         *
         * @public
         * @return {boolean}
         * @name STU.SimulationAnimation#isPaused
         * @function
         */
        SimulationAnimation.prototype.isPaused = function () {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                return animPlayer.isPaused(this);
            }
            return false;
        };
        ;
        /**
         * Tells if the animation is playing backward
         *
         * @public
         * @return {boolean}
         * @name STU.SimulationAnimation#isPlayingBackward
         * @function
         */
        SimulationAnimation.prototype.isPlayingBackward = function () {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                return animPlayer.isPlayingBackward(this);
            }
            return false;
        };
        /**
         * Returns the current time of the animation in seconds
         *
         * @public
         * @return {number}
         * @name STU.SimulationAnimation#getTime
         * @function
         */
        SimulationAnimation.prototype.getTime = function () {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                return animPlayer.getTime(this);
            }
            return 0;
        };
        /**
         * Sets the current time of the animation to the given time
         *
         * @public
         * @param {number} iTime the new time of the animation (in seconds)
         * @name STU.SimulationAnimation#setTime
         * @function
         */
        SimulationAnimation.prototype.setTime = function (iTime) {
            var animPlayer = AnimationPlayer.getInstance();
            if (animPlayer !== null && animPlayer !== undefined) {
                animPlayer.setTime(this, iTime);
            }
        };
        /**
        * Returns all the actors concerned by the animation: the animated Result actor, exposed subactors (Decomposition items) and legend actor
        * Non-exposed object will not be returned
        *
        * @public
        * @return {Array.<STU.Actor>}
        * @name STU.SimulationAnimation#getAnimatedObjects
        * @function
        */
        SimulationAnimation.prototype.getAnimatedObjects = function () {
            var wrapper = this._getOrCreateWrapper();
            if (wrapper !== undefined && wrapper !== null) {
                var expPointer = this.CATI3DExperienceObject;
                if (expPointer === null || expPointer === undefined) {
                    console.error("Cannot find reference to engine animation, build must be corrupted");
                    return [];
                }
                return this._wrapper.getAnimatedObjects(expPointer);
            }
        };
        ;
        /**
         * Get or create the C++ binding for this animation instance
         * @private
         * @returns {stu__SimulationAnimationWrapper}
         */
        SimulationAnimation.prototype._getOrCreateWrapper = function () {
            if (this._wrapper === null || this._wrapper === undefined) {
                this._wrapper = new stu__SimulationAnimationWrapper();
            }
            return this._wrapper;
        };
        /**
         * Process to execute when this STU.Instance is initializing.
         *
         * @method
         * @private
         */
        SimulationAnimation.prototype.onInitialize = function () {
            _super.prototype.onInitialize.call(this);
            var expPointer = this.CATI3DExperienceObject;
            if (expPointer !== undefined && expPointer !== null) {
                this._duration = expPointer.GetValueByName("duration");
            }
        };
        return SimulationAnimation;
    }(Animation));
    STU["SimulationAnimation"] = SimulationAnimation;
    return SimulationAnimation;
});
