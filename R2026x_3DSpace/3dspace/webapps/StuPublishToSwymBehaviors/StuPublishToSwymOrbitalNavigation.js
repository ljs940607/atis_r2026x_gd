define('DS/StuPublishToSwymBehaviors/StuPublishToSwymOrbitalNavigation', ['DS/StuCore/StuContext', 'DS/StuCameras/StuOrbitalNavigation', 'DS/MathematicsES/MathsDef'], function (STU, OrbitalNavigation, DSMath) {
    'use strict';



    /**
    * Describe an Publish To Swym orbital camera navigation.
    *
    * @exports PublishToSwymOrbitalNavigation
    * @class
    * @constructor
    * @noinstancector
    * @private
    * @extends {STU.OrbitalNavigation}
    * @memberOf STU
    * @alias STU.PublishToSwymOrbitalNavigation
    */
    const PublishToSwymOrbitalNavigation = function () {
        OrbitalNavigation.call(this);
        this.name = 'PublishToSwymOrbitalNavigation';

        /**
        * Pause duration between 2 animations.
        *
        * @name  pauseDuration
        * @private
        * @type {number}
        */
        this.pauseDuration = undefined;

        /**
        * Animation duration between 2 views  
        *
        * @name  animDuration
        * @private
        * @type {number}
        */
        this._animationDuration = 2.5;

        /**
        * Views wanted to be shown. Must be greater than 0 !
        *
        * @name  viewNumber
        * @private
        * @type {number}
        */
        this._viewsNumber = 4;

        /**
        * If the camera go the opposite way when it finished to show all views or not.  
        *
        * @name  bounce
        * @private
        * @type {boolean}
        */
        this._bounce = false;

        /**
        * If the camera default movement is like a clock wise or not.
        *
        * @name  reverse
        * @private
        * @type {boolean}
        */
        this._reverse = false;

        /**
         * Enable the camera automatic rotation when no input has been pressed since a while
         *
         * @member
         * @public
         * @type {Boolean}
         */
        this.automaticRotationAtIdle = true; // forced

        /**
        * Choose the interpolation to apply on camera travelling animation.          
        *
        * @name  interpolationType                    
        * @type {number}
        */
        this.interpolationType = undefined;
    };

    PublishToSwymOrbitalNavigation.prototype = new OrbitalNavigation();
    PublishToSwymOrbitalNavigation.prototype.constructor = PublishToSwymOrbitalNavigation;
    PublishToSwymOrbitalNavigation.prototype.type = 'PublishToSwymOrbitalNavigation';

    /**
    * The interpolation applicated on camera movement.
    *
    * @name  accelerationType
    * @private
    */
    PublishToSwymOrbitalNavigation.interpolationTypes =
    {
        linear: 0,
        exponential: 1,
        sinusoidal: 2,
        logarithmic: 3,
    };

    /**
    * Process executed when behavior is activating
    *
    * @name  onActivate
    * @private
    */
    PublishToSwymOrbitalNavigation.prototype.onActivate = function () {
        OrbitalNavigation.prototype.onActivate.call(this);

        this._isAutoRotating = false;
        this._isRotatingBetweenViews = false;
        this._animationCurrentTime = 0;
        this._delayCurrentTime = 0;
        this._view = 0;
        this._isBouncing = false;
        this._viewsAngle = [0];
        this._elapsedTimeAtIdle = this.automaticRotationTimer;
        if (this._viewsNumber > 0) {
            const ref = 2 * Math.PI / this._viewsNumber;
            for (let viewNumber = 0; viewNumber < this._viewsNumber; viewNumber++) {
                this._viewsAngle[viewNumber] = { init: viewNumber * ref, final: (viewNumber + 1) * ref };
            }
        } else {
            console.log("viewsNumber must be greater than 0 ! ");
        }
        this._targetPosition = new DSMath.Vector3D();
        this.getTargetPosition(this._targetPosition, "Location");
        this._refPosition = new DSMath.Vector3D(this._targetPosition.x, 0, 0);
        /*this.maximumDistance = (this.targetPosition.y + distance) * 4;
        this.minimumDistance = (this.targetPosition.y + distance) / 4;*/
    };

    /**
    * Update method called each frame
    * 
    *
    * @method
    * @private
    */
    PublishToSwymOrbitalNavigation.prototype.update = function () {
        //check if the maximum distance is bigger than the minimum distance
        /* if (this.minimumDistance > this.maximumDistance || this.minimumDistance < 0 || this.maximumDistance < 0) {
             return this;
         }*/

        /* Actions */
        this._updateSetup();
        this._handleAllZooming();
        const cameraPosition = this._camera.getPosition();
        this._updateCameraPosition(cameraPosition);
        this._manageAutomaticRotationTimer();
    };

    /**
    * Manage scenarios from automatic rotation timer and camera position modifications.
    * 
    *
    * @method
    * @private
    */
    PublishToSwymOrbitalNavigation.prototype._manageAutomaticRotationTimer = function () {
        const cameraPosition = this._camera.getPosition();
        if (this.oldCameraPosition.isEqual(cameraPosition)) {
            this._elapsedTimeAtIdle += this._deltaTime;
            if (this._isAutoRotating) {
                this._updateCameraPositionFromAutomaticRotation();
            } else {
                if (this._elapsedTimeAtIdle >= this.automaticRotationTimer) {
                    this.startAutomaticRotation();
                }
            }
        } else {
            if (this._isAutoRotating) {
                this.stopAutomaticRotation();
            }
            this._elapsedTimeAtIdle = 0;
        }
    };

    /**
    * Applicates the rotation on camera.
    * 
    *
    * @method
    * @private
    */
    PublishToSwymOrbitalNavigation.prototype._updateCameraPositionFromAutomaticRotation = function () {
        if (this._isAutoRotating) {
            const directionRot = this._reverse === true ? -1 : 1;
            const rotationVec3 = this._isBouncing === true ? -1 * directionRot : directionRot;

            if (!this._isRotatingBetweenViews) {
                this._delayCurrentTime += this._deltaTime;
                if (this._delayCurrentTime > this.pauseDuration) {
                    this._isRotatingBetweenViews = true;
                    this._delayCurrentTime = 0;
                    this._animationCurrentTime = 0;
                }
            } else {
                this._animationCurrentTime += this._deltaTime;
                while (this._animationCurrentTime >= this._currentAnimationDuration) {
                    this._animationCurrentTime -= this._currentAnimationDuration;
                    this._view += 1;
                    if (this._view >= this._viewsNumber) {
                        this._view = 0;
                        if (this._bounce) {
                            this._isBouncing = !this._isBouncing;
                        }
                    }
                    const arrayAngle = this._viewsAngle[this._view];
                    this._currentAnimationInitAngle = arrayAngle.init;
                    this._currentAnimationFinalAngle = arrayAngle.final;
                    this._currentAnimationDuration = this._animationDuration;

                    if (this.pauseDuration !== 0) {
                        this._isRotatingBetweenViews = false;
                        this._animationCurrentTime = 0;
                        return;
                    } else {
                        if (this.animationTimeInCurrentPosition !== 0) {
                            this.animationTimeInCurrentPosition = 0;
                        }
                    }
                }
                const angle = this._getAngle(
                    this._animationCurrentTime,
                    this._currentAnimationDuration,
                    this._currentAnimationInitAngle,
                    this._currentAnimationFinalAngle
                );
                const rot = new DSMath.Vector3D(0, 0, 1);
                this._camera.setPosition(this._refPosition);
                this._camera.rotateAround(this._targetPosition, rot, rotationVec3 * angle);
                this._camera.lookAt(this._targetPosition);
            }
        }

    };

    /**
    * Computes the angle to applicate on camera rotation, at a given time.
    * 
    *
    * @method
    * @public
    */
    PublishToSwymOrbitalNavigation.prototype._getAngle = function (animeTime, duration, angleStart, angleEnd) {
        if (animeTime > duration) {
            return angleEnd;
        }
        let accelerationFactor = 0;
        const diff = angleEnd - angleStart;	// Difference between start angle and end angle
        switch (this.interpolationType) {
            case PublishToSwymOrbitalNavigation.interpolationTypes.linear:
                accelerationFactor = 1;
                break;

            case PublishToSwymOrbitalNavigation.interpolationTypes.exponential:
                accelerationFactor = Math.pow(2, animeTime / duration) - 1;
                break;

            case PublishToSwymOrbitalNavigation.interpolationTypes.sinusoidal:
                accelerationFactor = Math.sin((Math.PI / 2) * (animeTime / duration));
                break;

            case PublishToSwymOrbitalNavigation.interpolationTypes.logarithmic:
                accelerationFactor = Math.log(1.72 * duration / animeTime + 1);
                if (!Number.isFinite(accelerationFactor)) {
                    accelerationFactor = 0;
                }
                break;

            default:
                accelerationFactor = 1;
                break;
        }
        return (accelerationFactor * (animeTime * diff / duration)) + angleStart;	// Retrieves rotation angle in radians

    };

    /**
    * Starts camera automatic rotation
    * 
    *
    * @method
    * @public
    */
    PublishToSwymOrbitalNavigation.prototype.startAutomaticRotation = function () {
        const cameraPosition = this._camera.getPosition();
        const targetToCamVector = new DSMath.Vector2D(cameraPosition.x - this._targetPosition.x, cameraPosition.y - this._targetPosition.y);
        const targetToRefVector = new DSMath.Vector2D(0, 1);
        const angle = targetToCamVector.getSignedAngleTo(targetToRefVector);
        this._currentAnimationInitAngle = angle >= 0 ? (-2) * Math.PI + angle : (-1) * angle;
        if (this._currentAnimationInitAngle < 0) {
            this._currentAnimationInitAngle = Math.abs(this._currentAnimationInitAngle);
        }
        for (let viewNumber = 0; viewNumber < this._viewsNumber; viewNumber++) {
            if (this._currentAnimationInitAngle >= this._viewsAngle[viewNumber].init && this._currentAnimationInitAngle <= this._viewsAngle[viewNumber].final) {
                this._view = viewNumber;
            }
        }
        const arrayAngle = this._viewsAngle[this._view];
        this.animationTimeInCurrentPosition = this._animationDuration * (this._currentAnimationInitAngle - arrayAngle.init) / (arrayAngle.final - arrayAngle.init);
        this._refPosition.z = cameraPosition.z;
        this._refPosition.y = targetToCamVector.norm() + this._targetPosition.y;
        this._currentAnimationDuration = this._animationDuration - this.animationTimeInCurrentPosition;
        this._currentAnimationFinalAngle = arrayAngle.final;
        this._animationCurrentTime = 0;
        this._isAutoRotating = true;
        this._isRotatingBetweenViews = true;
    };

    /**
    * Stops camera automatic rotation.
    * 
    *
    * @method
    * @private
    */
    PublishToSwymOrbitalNavigation.prototype.stopAutomaticRotation = function () {
        this._isAutoRotating = false;
        this._isRotatingBetweenViews = false;
    };

    /**
    * Sensor for NL
    * 
    *
    * @method
    * @public
    */
    PublishToSwymOrbitalNavigation.prototype.isPlaying = function () {
        return this._isAutoRotating;
    };

    // Expose in STU namespace.
    STU.PublishToSwymOrbitalNavigation = PublishToSwymOrbitalNavigation;
    return PublishToSwymOrbitalNavigation;
});


