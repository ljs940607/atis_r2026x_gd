/// <amd-module name="DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitAirGrabNav"/>
define("DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitAirGrabNav", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkitNativeSkills"], function (require, exports, THREE, WebVisuXRToolkit_1, WebVisuXRToolkitConfigManager, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandAirGrab = exports.ControllerAirGrab = void 0;
    class ControllerAirGrab extends EventTarget {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.GripPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary, WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
            this.isPressingRightControllerGrab = false;
            this.isPressingLeftControllerGrab = false;
            this.onPressBeginRightControllerWorldMatrix = null;
            this.onPressBeginLeftControllerWorldMatrix = null;
            this.onPressRightControllerMatrix = null;
            this.onPressLeftControllerMatrix = null;
            this.initialOnGrabXRNodeMatrix = null;
            this.initialOnGrabHeadWorldMatrix = null;
            this.initialOnGrabHeadMatrixInverse = null;
            this.initialOnGrabControllerDistance = null;
            this.initialOnGrabControllerAveragePos = null;
            this._handMovingSoloController = null;
        }
        computeMovementAndRotation(quat, vec, origin, centerOfRot, scale) {
            const toCenterOfRotation = centerOfRot.clone().sub(origin);
            const toNewPos = origin.clone().sub(centerOfRot).applyQuaternion(quat);
            const newPos = origin.clone().add(toCenterOfRotation).add(toNewPos).add(vec);
            const startHeadWorldMatrixData = this.initialOnGrabHeadWorldMatrix.decompose();
            const newRot = startHeadWorldMatrixData[1].clone().multiply(this.initialOnGrabHeadMatrixInverse.decompose()[1]).multiply(quat);
            return new THREE.Matrix4().compose(newPos, newRot, scale);
        }
        twoControllersMovement() {
            if (this.initialOnGrabControllerAveragePos === null || this.initialOnGrabXRNodeMatrix === null || this.initialOnGrabControllerDistance === null || this.initialOnGrabHeadWorldMatrix === null || this.initialOnGrabHeadMatrixInverse === null) {
                const rightWorldController = this.onPressBeginRightControllerWorldMatrix.decompose();
                const leftWorldController = this.onPressBeginLeftControllerWorldMatrix.decompose();
                this.initialOnGrabControllerAveragePos = new THREE.Vector3().addVectors(rightWorldController[0], leftWorldController[0]).multiplyScalar(0.5);
                this.initialOnGrabXRNodeMatrix = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix();
                this.initialOnGrabHeadWorldMatrix = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)();
                this.initialOnGrabHeadMatrixInverse = new THREE.Matrix4().getInverse((0, WebVisuXRToolkit_1.getHeadMatrix)());
                this.initialOnGrabControllerDistance = rightWorldController[0].distanceTo(leftWorldController[0]);
            }
            const initXRNodeMatrixData = this.initialOnGrabXRNodeMatrix.decompose();
            const initRightWorldController = this.onPressBeginRightControllerWorldMatrix.decompose();
            const initLeftWorldController = this.onPressBeginLeftControllerWorldMatrix.decompose();
            const currentRightWorldController = this.initialOnGrabXRNodeMatrix.clone().multiply(this.onPressRightControllerMatrix).decompose();
            const currentLeftWorldController = this.initialOnGrabXRNodeMatrix.clone().multiply(this.onPressLeftControllerMatrix).decompose();
            const curBariPos = new THREE.Vector3().addVectors(currentLeftWorldController[0], currentRightWorldController[0]).multiplyScalar(0.5);
            // Determine rotation angle
            const currentLRVec = new THREE.Vector3().subVectors(currentRightWorldController[0], currentLeftWorldController[0]);
            currentLRVec.z = 0;
            const initLRVec = new THREE.Vector3().subVectors(initRightWorldController[0], initLeftWorldController[0]);
            initLRVec.z = 0;
            //After putting the to vectors on the same plane, we cross them to have the rotation axis
            //In that case it will always be around the Z-up Vector
            // Then we have two cross vectors and we want to find the angle between them and use that for rotation
            const rotAxis = new THREE.Vector3().crossVectors(currentLRVec, initLRVec);
            const rotAngle = initLRVec.angleTo(currentLRVec);
            const quat = new THREE.Quaternion().setFromAxisAngle(rotAxis.normalize(), rotAngle);
            // mvt
            const diffPos = new THREE.Vector3().subVectors(this.initialOnGrabControllerAveragePos, curBariPos);
            const skillInfo = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.AirGrabName);
            if (skillInfo.settings.getBooleanValue("_EnableAirGrabScaling")) {
                const initScale = initXRNodeMatrixData[2].x; // all values should be equal;
                const currentControllerDistance = currentRightWorldController[0].distanceTo(currentLeftWorldController[0]);
                const scale = initScale * (this.initialOnGrabControllerDistance / currentControllerDistance);
                const headData = (0, WebVisuXRToolkit_1.getHeadMatrix)().decompose();
                //diffPos.add(new THREE.Vector3(headData[0].x, 0, 0).applyQuaternion(headData[1]).multiplyScalar(initScale - scale))
                //diffPos.add(new THREE.Vector3(0, headData[0].y, 0).applyQuaternion(headData[1]).multiplyScalar(initScale - scale))
                diffPos.add(new THREE.Vector3(0, 0, headData[0].z).multiplyScalar(initScale - scale).applyQuaternion((0, WebVisuXRToolkit_1.getXRNode)().getMatrix().decompose()[1]));
                (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(this.computeMovementAndRotation(quat, diffPos, initXRNodeMatrixData[0], curBariPos, new THREE.Vector3(scale, scale, scale)));
            }
            else {
                (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(this.computeMovementAndRotation(quat, diffPos, initXRNodeMatrixData[0], curBariPos, initXRNodeMatrixData[2]));
            }
        }
        oneControllerMovement(input) {
            const InitMatrixWorldData = input.handedness === WebVisuXRToolkit_1.InputHandedness.Right ? this.onPressBeginRightControllerWorldMatrix.decompose() : this.onPressBeginLeftControllerWorldMatrix.decompose();
            const inputworldData = this.initialOnGrabXRNodeMatrix.clone().multiply(input.getMatrix()).decompose();
            const diffPos = new THREE.Vector3().subVectors(InitMatrixWorldData[0], inputworldData[0]);
            const XRNodeMatData = this.initialOnGrabXRNodeMatrix.decompose();
            const quat = new THREE.Quaternion();
            const skillInfo = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.AirGrabName);
            if (skillInfo.settings.getBooleanValue("_EnableAirGrabMonoInputRotation")) {
                const initialForward = new THREE.Vector3(0, 1, 0).applyQuaternion(InitMatrixWorldData[1]);
                initialForward.z = 0;
                const currentForward = new THREE.Vector3(0, 1, 0).applyQuaternion(inputworldData[1]);
                currentForward.z = 0;
                const rotAxis = new THREE.Vector3().crossVectors(initialForward, currentForward);
                const rotAngle = currentForward.angleTo(initialForward);
                quat.setFromAxisAngle(rotAxis.normalize(), rotAngle).conjugate();
                //quat.multiplyQuaternions(InitMatrixWorldData[1].inverse(), inputworldData[1]).conjugate();
            }
            (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(this.computeMovementAndRotation(quat, diffPos, XRNodeMatData[0], inputworldData[0], XRNodeMatData[2]));
        }
        onActivate(input) {
            if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) {
                this.onPressRightControllerMatrix = input.getMatrix();
            }
            else if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Left) {
                this.onPressLeftControllerMatrix = input.getMatrix();
            }
            if (this.isPressingRightControllerGrab && this.isPressingLeftControllerGrab) {
                if (this._handMovingSoloController) {
                    this._handMovingSoloController = null;
                    this.initialOnGrabXRNodeMatrix = null;
                    this.initialOnGrabHeadWorldMatrix = null;
                    this.initialOnGrabHeadMatrixInverse = null;
                }
                if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) // Only compute once
                 {
                    this.twoControllersMovement();
                    this.dispatchEvent(new Event("TwoInputsAirGrab"));
                }
            }
            else if (this._handMovingSoloController && this._handMovingSoloController === input.handedness) {
                this.oneControllerMovement(input);
                this.dispatchEvent(new Event("OneInputAirGrab"));
            }
        }
        onActivateBegin(input, activatingAction) {
            this.initialOnGrabXRNodeMatrix = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix();
            if (!(this.isPressingRightControllerGrab && this.isPressingLeftControllerGrab) && this._handMovingSoloController === null) {
                this._handMovingSoloController = input.handedness;
                this.initialOnGrabHeadWorldMatrix = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)();
                this.initialOnGrabHeadMatrixInverse = new THREE.Matrix4().getInverse((0, WebVisuXRToolkit_1.getHeadMatrix)());
            }
            if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) {
                this.isPressingRightControllerGrab = true;
                this.onPressBeginRightControllerWorldMatrix = input.getMatrixWorld();
            }
            else if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Left) {
                this.isPressingLeftControllerGrab = true;
                this.onPressBeginLeftControllerWorldMatrix = input.getMatrixWorld();
            }
        }
        onActivateEnd(input, deActivatingAction) {
            this.initialOnGrabControllerDistance = null;
            this.initialOnGrabXRNodeMatrix = null;
            this.initialOnGrabControllerAveragePos = null;
            if (this._handMovingSoloController !== null && this._handMovingSoloController === input.handedness) {
                this._handMovingSoloController = null;
            }
            if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) {
                this.isPressingRightControllerGrab = false;
                this.onPressRightControllerMatrix = null;
            }
            else if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Left) {
                this.isPressingLeftControllerGrab = false;
                this.onPressLeftControllerMatrix = null;
            }
        }
        onUnregisterInput(input) {
            if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) {
                input.removeLabelIndicator("squeeze/center");
            }
            else if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Left) {
                input.removeLabelIndicator("squeeze/center");
            }
        }
        onRegisterInput(input) {
            if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Right) {
                this._rightindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.AirGrabLabel);
                input.addLabelIndicator(this._rightindicator, "squeeze/center");
            }
            else if (input.handedness === WebVisuXRToolkit_1.InputHandedness.Left) {
                this._leftindicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.AirGrabLabel);
                input.addLabelIndicator(this._leftindicator, "squeeze/center");
            }
        }
    }
    exports.ControllerAirGrab = ControllerAirGrab;
    class HandAirGrab extends ControllerAirGrab {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.IndexPinch]);
        }
        onRegisterInput(input) {
        }
        onUnregisterInput(input) {
        }
    }
    exports.HandAirGrab = HandAirGrab;
});
