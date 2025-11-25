/// <amd-module name="DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitHandFlyNav"/>
define("DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitHandFlyNav", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkitNativeSkills"], function (require, exports, THREE, WebVisuXRToolkit, WebVisuXRToolkitConfigManager, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandFlyNavSnap = exports.HandFlyNavLocomotion = void 0;
    class HandFlyNavLocomotion {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit.InputAction.GunHand]);
            this.desiredHandedness = new Set([WebVisuXRToolkit.AbstractHandedness.Primary, WebVisuXRToolkit.AbstractHandedness.Secondary]);
        }
        onActivate(input) {
            const raycastForward = new THREE.Vector3().getPositionFromMatrix(input.getJoint("index-finger-tip").getMatrix())
                .sub(new THREE.Vector3().getPositionFromMatrix(input.getJoint("index-finger-phalanx-proximal").getMatrix()))
                .normalize();
            const thumbVector = new THREE.Vector3().getPositionFromMatrix(input.getJoint("thumb-tip").getMatrix())
                .sub(new THREE.Vector3().getPositionFromMatrix(input.getJoint("thumb-phalanx-proximal").getMatrix()))
                .normalize();
            const skillInfo = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.FlyNavName);
            const speed = raycastForward.dot(thumbVector) * (skillInfo?.settings?.getNumericalValue("flySpeed") || 50);
            const XRNodeOrientation = new THREE.Quaternion().setFromRotationMatrix(WebVisuXRToolkit.getXRNode().getMatrix());
            raycastForward.applyQuaternion(XRNodeOrientation).normalize();
            const dot = raycastForward.dot(new THREE.Vector3(0, 0, 1));
            if (dot > 0.8 || dot < -0.8) {
                raycastForward.set(0, 0, dot).normalize();
            }
            else {
                raycastForward.z = 0;
                raycastForward.normalize();
            }
            const movementVector = raycastForward.multiplyScalar(speed);
            const position = new THREE.Vector3().getPositionFromMatrix(WebVisuXRToolkit.getXRNode().getMatrix()).add(movementVector);
            WebVisuXRToolkit.getXRNode().setMatrix(WebVisuXRToolkit.getXRNode().getMatrix().setPosition(position));
        }
        onActivateBegin(input, activatingAction) {
        }
        onActivateEnd(input, deActivatingAction) {
        }
        onUnregisterInput(input) {
        }
        onRegisterInput(input) {
        }
    }
    exports.HandFlyNavLocomotion = HandFlyNavLocomotion;
    class HandFlyNavSnap {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit.InputAction.IndexPinch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit.AbstractHandedness.Primary, WebVisuXRToolkit.AbstractHandedness.Secondary]);
        }
        onActivate(input) { }
        onActivateBegin(input, activatingAction) { }
        onActivateEnd(input, deActivatingAction) {
            const XRMatrix = WebVisuXRToolkit.getXRNode().getMatrix();
            if (input.handedness === WebVisuXRToolkit.InputHandedness.Left) {
                XRMatrix.rotateZ(15 * Math.PI / 180);
            }
            else if (input.handedness === WebVisuXRToolkit.InputHandedness.Right) {
                XRMatrix.rotateZ(-15 * Math.PI / 180);
            }
            WebVisuXRToolkit.getXRNode().setMatrix(XRMatrix);
        }
        onUnregisterInput(input) { }
        onRegisterInput(input) { }
    }
    exports.HandFlyNavSnap = HandFlyNavSnap;
});
