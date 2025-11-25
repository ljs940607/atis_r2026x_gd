define('DS/StuPublishToSwymBehaviors/StuTravellingNavigation', ['DS/StuCore/StuContext', 'DS/StuCameras/StuNavigation', 'DS/EPTaskPlayer/EPTask', 'DS/EP/EP', 'DS/MathematicsES/MathsDef'], function (STU, Navigation, Task, EP, DSMath) {
    'use strict';

    /**
     * Describe an orbital camera navigation.
     *
     * @exports TravellingNavigation
     * @class 
     * @constructor
     * @noinstancector
     * @private
     * @extends {STU.Navigation}
     * @memberOf STU
     * @alias STU.TravellingNavigation
     */
    const TravellingNavigation = function () {
        Navigation.call(this);
        this.name = 'TravellingNavigation';

        /**
        * Travelling starting point and destination are computed from target bounding elements. Camera look at the target during travelling
        *
        * @name  targetObject
        * @private
        * @type {STU.Actor3D}
        */
        this.targetObject = undefined;

        /**
        * Travelling duration.   
        *
        * @name  travellingDuration
        * @public
        * @type {number}           
        */
        this.travellingDuration = null;

        /**
        * View at the end of animation
        *
        * @name  view
        * @private
        * @type {number}
        */
        this._view = TravellingNavigation.views.right;

        /**
        * True camera travel from right to left.   
        *
        * @name  isTravellingFromRightToLeft    
        * @type {number}
        */
        this._isTravellingFromRightToLeft = false;

        /**
        * Multiply the target height to compute the initial position.  
        *
        * @name  initialPositionHeightMultiplier                  
        * @private
        * @type {number}
        */
        this._initialPositionHeightMultiplier = 2.0;
        /**
        * Multiply the target height to compute the final position.       
        *
        * @name  finalPositionHeightMultiplier                   
        * @private
        * @type {number}
        */
        this._finalPositionHeightMultiplier = 0.7;

        /**
        * Multiply the target length to compute the initial position.       
        *
        * @name initialPositionLengthMultiplier                     
        * @private
        * @type {number}
        */
        this._initialPositionLengthMultiplier = 8.0;

        /**
        * Multiply the target length to compute the final position.          
        *
        * @name  finalPositionLengthMultiplier                    
        * @type {number}
        */
        this._finalPositionLengthMultiplier = 1.4;


        /**
        * Choose the interpolation to apply on camera travelling animation.          
        *
        * @name  interpolationType                    
        * @type {number}
        */
        this._interpolationType = TravellingNavigation.interpolationTypes.logarithmic;

    };


    TravellingNavigation.prototype = new Navigation();
    TravellingNavigation.prototype.constructor = TravellingNavigation;

    /**
    * The interpolation applicated on camera.
    *
    * @name  interpolationTypes
    * @private
    */
    TravellingNavigation.interpolationTypes = {
        linear: 0,
        exponential: 1,
        sinusoidal: 2,
        logarithmic: 3,
    };

    /**
    * View that camera looks when it reach its destination.
    *
    * @name  views
    * @private
    */
    TravellingNavigation.views = {
        back: 0,
        front: 1,
        right: 2,
        left: 3,
    };

    /**
    * Process executed when STU.Travelling is activating
    *
    * @name  onActivate
    * @private
    */
    TravellingNavigation.prototype.onActivate = function () {
        Navigation.prototype.onActivate.call(this);
        /* Retrieve camera */
        this._camera = this.getActor();

        /* target parameters */
        const boundingBox = this.targetObject.getOrientedBoundingBox();
        const xmax = boundingBox.high.x;
        const xmin = boundingBox.low.x;
        const ymax = boundingBox.high.y;
        const ymin = boundingBox.low.y;
        const zmax = boundingBox.high.z;
        const zmin = boundingBox.low.z;
        const targetLength = xmax - xmin;
        const targetWidth = ymax - ymin;
        const targetHeight = zmax - zmin;
        const centerX = (xmax + xmin) / 2;
        const centerY = (ymax + ymin) / 2;
        const centerZ = (zmax + zmin) / 2;
        const bSphere = this.targetObject.getBoundingSphere();
        this._targetObjectPositionToLookAt = new DSMath.Vector3D(bSphere.center.x, bSphere.center.y, bSphere.center.z);

        /* Distance */
        const length = Math.max(targetWidth, targetLength, targetHeight);

        /* Initializing init & final lengths */
        const relInitialLengthPosition = length * this._initialPositionLengthMultiplier;
        const relFinalLengthPosition = length * this._finalPositionLengthMultiplier;

        /* Initializing init & final heights */
        const relInitialHeightPosition = targetHeight * this._initialPositionHeightMultiplier;
        const relFinalHeightPosition = targetHeight * this._finalPositionHeightMultiplier;

        /* Initializing positions  */
        switch (this._view) {
            case TravellingNavigation.views.back:
                this._initialLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX - relInitialLengthPosition, centerY - relInitialLengthPosition, centerZ + relInitialHeightPosition)
                    : new DSMath.Vector3D(centerX - relInitialLengthPosition, centerY + relInitialLengthPosition, centerZ + relInitialHeightPosition);
                this._finalLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX - relFinalLengthPosition, centerY + relFinalLengthPosition, centerZ + relFinalHeightPosition)
                    : new DSMath.Vector3D(centerX - relFinalLengthPosition, centerY - relFinalLengthPosition, centerZ + relFinalHeightPosition)
                break;

            case TravellingNavigation.views.front:
                this._initialLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX + relInitialLengthPosition, centerY + relInitialLengthPosition, centerZ + relInitialHeightPosition)
                    : new DSMath.Vector3D(centerX + relInitialLengthPosition, centerY - relInitialLengthPosition, centerZ + relInitialHeightPosition);
                this._finalLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX + distancrelFinalLengthPositioneEnd, centerY - relFinalLengthPosition, centerZ + relFinalHeightPosition)
                    : new DSMath.Vector3D(centerX + relFinalLengthPosition, centerY + relFinalLengthPosition, centerZ + relFinalHeightPosition)
                break;

            case TravellingNavigation.views.right:

                this._initialLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX - relInitialLengthPosition, centerY + relInitialLengthPosition, centerZ + relInitialHeightPosition)
                    : new DSMath.Vector3D(centerX + relInitialLengthPosition, centerY + relInitialLengthPosition, centerZ + relInitialHeightPosition);
                this._finalLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX + relFinalLengthPosition, centerY + relFinalLengthPosition, centerZ + relFinalHeightPosition)
                    : new DSMath.Vector3D(centerX - relFinalLengthPosition, centerY + relFinalLengthPosition, centerZ + relFinalHeightPosition)
                break;

            case TravellingNavigation.views.left:
                this._initialLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX + relInitialLengthPosition, centerY - relInitialLengthPosition, centerZ + relInitialHeightPosition)
                    : new DSMath.Vector3D(centerX - relInitialLengthPosition, centerY - relInitialLengthPosition, centerZ + relInitialHeightPosition);
                this._finalLengthPosition = this._isTravellingFromRightToLeft
                    ? new DSMath.Vector3D(centerX - relFinalLengthPosition, centerY - relFinalLengthPosition, centerZ + relFinalHeightPosition)
                    : new DSMath.Vector3D(centerX + relFinalLengthPosition, centerY - relFinalLengthPosition, centerZ + relFinalHeightPosition)
                break;
        }

        /* System parameters & camera initialisation*/
        this.reset();
        this._isTravelling = false;
        this._travellingCurrentTime = 0;
        this.travellingDuration *= 1000;
    };


    /**
   * Process executed in each frame.
   *
   * @name  onExecute
   * @private
   */
    TravellingNavigation.prototype.onExecute = function (context) {
        if (this.isTravelling()) {
            if (this._travellingCurrentTime > this.travellingDuration) {
                this._travellingCurrentTime = this.travellingDuration;
                this.arrivalState = true;
                this.stopTravelling();
                this._travellingCurrentTime = 0;
                return;
            }
            const deltaTime = context.deltaTime
            this._travellingCurrentTime += deltaTime;
            const position = this._getInterpolatedPosition();
            this._camera.setPosition(position);
            this._camera.lookAt(this._targetObjectPositionToLookAt);
            
        }
    };

    /**
   * That method retrieves camera position in each frame to perform travallling animation.
   *
   * @name  interpolate
   * @private
   */
    TravellingNavigation.prototype._getInterpolatedPosition = function () {
        if (this._travellingCurrentTime >= this.travellingDuration) {
            return this._finalLengthPosition;
        }

        /* Initializations */
        const diffLengthX = this._finalLengthPosition.x - this._initialLengthPosition.x;
        const diffLengthY = this._finalLengthPosition.y - this._initialLengthPosition.y;
        const diffHeight = this._initialLengthPosition.z - this._finalLengthPosition.z;
        let movementX = (this._travellingCurrentTime * diffLengthX / this.travellingDuration);
        let movementY = (this._travellingCurrentTime * diffLengthY / this.travellingDuration);
        const verticalMovement = -(this._travellingCurrentTime * diffHeight / this.travellingDuration);

        /* Acceleration types */
        switch (this._interpolationType) {
            case TravellingNavigation.interpolationTypes.linear:
                movementX *= this._travellingCurrentTime / this.travellingDuration; movementY *= this._travellingCurrentTime / this.travellingDuration; // Linear acceleration
                break;
            case TravellingNavigation.interpolationTypes.exponential:
                movementX *= Math.pow(2, this._travellingCurrentTime / this.travellingDuration) - 1; movementY *= Math.pow(2, this._travellingCurrentTime / this.travellingDuration) - 1; // Exponential acceleration
                break;
            case TravellingNavigation.interpolationTypes.sinusoidal:
                movementX *= Math.sin((Math.PI / 2) * (this._travellingCurrentTime / this.travellingDuration)); movementY *= Math.sin((Math.PI / 2) * (this._travellingCurrentTime / this.travellingDuration));  // Sinusoidal acceleration
                break;
            case TravellingNavigation.interpolationTypes.logarithmic:
                movementX *= Math.log(1.72 * this.travellingDuration / this._travellingCurrentTime + 1); movementY *= Math.log(1.72 * this.travellingDuration / this._travellingCurrentTime + 1); // Logarithmic acceleration
                break;
        }

        /* TravellingNavigation animation */
        const position = new DSMath.Vector3D(movementX + this._initialLengthPosition.x, movementY + this._initialLengthPosition.y, verticalMovement + this._initialLengthPosition.z);
        return position;
    };

    /**
    * Order that enables travelling animation.
    *
    * @name  startTravelling
    * @private
    */
    TravellingNavigation.prototype.startTravelling = function () {
        this._isTravelling = true;
    }

    /**
    * Order that disables travelling animation.
    *
    * @name  stopTravelling
    * @private
    */
    TravellingNavigation.prototype.stopTravelling = function () {
        this._isTravelling = false;
    }

    /**
    * Order that reset travelling animation.
    *
    * @name  reset
    * @private
    */
    TravellingNavigation.prototype.reset = function () {
        if (this._travellingCurrentTime !== 0) {
            this._travellingCurrentTime = 0;
            this.arrivalState = false;
        }
        if (this.travellingDuration > 0) {
            this._camera.setPosition(this._initialLengthPosition);
            this._camera.lookAt(this._targetObjectPositionToLookAt);
        }
        
    };

    /**
    * True if camera is performing travelling animation.
    *
    * @name  isTravelling
    * @private
    */
    TravellingNavigation.prototype.isTravelling = function () {
        return this._isTravelling;
    };

    /**
    * True if camera has reached travalling animation destination.
    *
    * @name  hasReachedDestination
    * @private
    */
    TravellingNavigation.prototype.hasReachedDestination = function () {
        return this.arrivalState;
    };

    // Expose in STU namespace.
    STU.TravellingNavigation = TravellingNavigation;
    return TravellingNavigation;
});


