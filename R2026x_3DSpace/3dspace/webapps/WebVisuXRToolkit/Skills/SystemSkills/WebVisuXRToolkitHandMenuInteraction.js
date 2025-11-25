/// <amd-module name="DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitHandMenuInteraction"/>
define("DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitHandMenuInteraction", ["require", "exports", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkit"], function (require, exports, WebVisuXRToolkitManager_1, THREE, WebVisuXRToolkit) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandMenuActivationOnHand = exports.HandMenuGrabWindow = exports.HandMenuHoverWindow = exports.HandMenuActivation = void 0;
    class HandMenuActivation {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit.InputAction.ControllerPassive]);
            this.desiredHandedness = new Set([WebVisuXRToolkit.AbstractHandedness.Secondary]);
            this.is_hand_menu_showing = false;
        }
        onActivate(input) {
            const controller_right_vector = new THREE.Vector3(1, 0, 0).applyQuaternion(input.getMatrix().decompose()[1]);
            controller_right_vector.z = 0;
            const controller_to_head_vector = input.getMatrix().decompose()[0].sub(WebVisuXRToolkit.getHeadMatrix().decompose()[0]);
            controller_to_head_vector.z = 0;
            const dotProduct = -controller_right_vector.normalize().dot(controller_to_head_vector.normalize());
            const pinned = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.isHandMenuPinned();
            const hasSettings = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.anySettingsToDisplay();
            // Only update visibility if needed
            if (!this.is_hand_menu_showing) {
                if ((dotProduct > 0.6 || pinned) && hasSettings) {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.setVisibility(true);
                    this.is_hand_menu_showing = true;
                }
            }
            else {
                if (dotProduct < 0.3 && !pinned) {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.setVisibility(false);
                    this.is_hand_menu_showing = false;
                }
            }
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            return new Set();
        }
        onActivateEnd(input, deActivatingAction) {
            return new Set();
        }
        onRegisterInput(input) {
            input.model.addChild(WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu);
            if (input instanceof WebVisuXRToolkit.WebVisuXRToolkitController) {
                const mat = new THREE.Matrix4().rotateY(-Math.PI * 0.5).rotateX(-Math.PI * 0.5).rotateZ(-Math.PI / 5).translate(new THREE.Vector3(-(WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.headerWidth / 2 + 20), 30, 40));
                WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.setMatrix(mat);
            }
            else {
                // here for translate (palm facing face): positive x is left, y is depth (y > 0 is closer to face), z is height (upper is higher)
                const mat = new THREE.Matrix4().rotateZ(Math.PI * -0.7).rotateX(Math.PI * 0.3).translate(new THREE.Vector3(-(WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.headerWidth / 2 + 50), 0, 150));
                WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.setMatrix(mat); // .rotateY(Math.PI * 0.2)
            }
        }
        onUnregisterInput(input) {
            input.model.removeChild(WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu);
        }
    }
    exports.HandMenuActivation = HandMenuActivation;
    function checkCollision(boxMin, boxMax, boxCenter, sphereCenter, sphereRadius) {
        // Convert box to world coordinates
        const worldBoxMin = boxMin.clone().add(boxCenter);
        const worldBoxMax = boxMax.clone().add(boxCenter);
        // Find the closest point on the AABB to the sphere center
        const closestPoint = new THREE.Vector3(Math.max(worldBoxMin.x, Math.min(sphereCenter.x, worldBoxMax.x)), Math.max(worldBoxMin.y, Math.min(sphereCenter.y, worldBoxMax.y)), Math.max(worldBoxMin.z, Math.min(sphereCenter.z, worldBoxMax.z)));
        // Check if the squared distance is less than the squared radius
        return closestPoint.distanceToSquared(sphereCenter) < sphereRadius * sphereRadius;
    }
    class HandMenuHoverWindow {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit.InputAction.ControllerPassive]);
            this.desiredHandedness = new Set([WebVisuXRToolkit.AbstractHandedness.Primary]);
            this._currently_hovered_window = null;
        }
        onActivate(input) {
            const window = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.currently_shown_window;
            if (window) {
                window.waitForTextureRefreshed().then(() => {
                    const window_boundingBox = window.getBoundingBox();
                    window_boundingBox.min.z = 0;
                    window_boundingBox.max.z = 1;
                    if (this._inputBoundingSphereWithoutTooltips && checkCollision(window_boundingBox.min, window_boundingBox.max, window.getMatrixWorld().decompose()[0], input.getMatrixWorld().decompose()[0], this._inputBoundingSphereWithoutTooltips.radius)) {
                        if (this._currently_hovered_window === null) {
                            this._currently_hovered_window = window;
                            window.setMatrix(window.getMatrix().scale(new THREE.Vector3(1.25, 1.25, 1.25)));
                        }
                    }
                    else if (this._currently_hovered_window) {
                        this._currently_hovered_window.setMatrix(this._currently_hovered_window.getMatrix().scale(new THREE.Vector3(0.8, 0.8, 0.8)));
                        this._currently_hovered_window = null;
                    }
                });
            }
            else {
                this._currently_hovered_window = null;
            }
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            return new Set();
        }
        onActivateEnd(input, deActivatingAction) {
            return new Set();
        }
        async onRegisterInput(input) {
            while (input.hasModelLoaded() === false) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            if (input.isDisplayingIndicators()) {
                input.displayIndicators(false);
                this._inputBoundingSphereWithoutTooltips = input.model.getBoundingSphere();
                input.displayIndicators(true);
            }
            else {
                this._inputBoundingSphereWithoutTooltips = input.model.getBoundingSphere();
            }
        }
        onUnregisterInput(input) {
        }
    }
    exports.HandMenuHoverWindow = HandMenuHoverWindow;
    class HandMenuGrabWindow {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit.InputAction.GripPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit.AbstractHandedness.Primary]);
            this._currently_grabbed_window = null;
            this._selectedObjectOffsetMatrix = new THREE.Matrix4();
        }
        getInputCenterRotationMatrix(input) {
            return input.getMatrixWorld();
        }
        onActivate(input) {
            if (this._currently_grabbed_window) {
                const inputWorldMatrix = this.getInputCenterRotationMatrix(input);
                const updated_matrix = inputWorldMatrix.multiply(this._selectedObjectOffsetMatrix);
                this._currently_grabbed_window.setMatrix(updated_matrix);
                return new Set([WebVisuXRToolkit.InputAction.GripPress]);
            }
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            const window = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.currently_shown_window;
            if (window) {
                const window_boundingBox = window.getBoundingBox();
                window_boundingBox.min.z = 1;
                window_boundingBox.max.z = 1;
                if (checkCollision(window_boundingBox.min, window_boundingBox.max, window.getMatrixWorld().decompose()[0], input.getMatrixWorld().decompose()[0], input.model.getBoundingSphere().radius)) {
                    this._currently_grabbed_window = window;
                    window.displayHeader(true);
                    const window_world_matrix = window.getMatrixWorld();
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.removeChild(this._currently_grabbed_window);
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.UIManagerNode.addChild(this._currently_grabbed_window);
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.empty_currently_shown_window();
                    this._selectedObjectOffsetMatrix = new THREE.Matrix4().multiplyMatrices(new THREE.Matrix4().getInverse(input.getMatrixWorld()), window_world_matrix).scale(new THREE.Vector3(2, 2, 2));
                    return new Set([WebVisuXRToolkit.InputAction.GripPress]);
                }
            }
            return new Set();
        }
        onActivateEnd(input, deActivatingAction) {
            if (this._currently_grabbed_window) {
                this._currently_grabbed_window = null;
                return new Set([WebVisuXRToolkit.InputAction.GripPress]);
            }
            return new Set();
        }
        onRegisterInput(input) {
        }
        onUnregisterInput(input) {
        }
    }
    exports.HandMenuGrabWindow = HandMenuGrabWindow;
    //? The classes above are for the Controller, the ones below are for Hand inputs, a renaming refactor round could be nice for convention continuity sake
    class HandMenuActivationOnHand extends HandMenuActivation {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit.InputAction.HandPassive]);
        }
        onActivate(input) {
            const hand_up_vector = new THREE.Vector3(0, 0, 1).applyQuaternion(input.getMatrix().decompose()[1]);
            hand_up_vector.z = 0;
            const hand_to_head_vector = input.getMatrix().decompose()[0].sub(WebVisuXRToolkit.getHeadMatrix().decompose()[0]);
            hand_to_head_vector.z = 0;
            const dotProduct = -hand_up_vector.normalize().dot(hand_to_head_vector.normalize());
            const pinned = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.isHandMenuPinned();
            const hasSettings = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.anySettingsToDisplay();
            // Only update visibility if needed
            if (!this.is_hand_menu_showing) {
                if ((dotProduct > 0.3 || pinned) && hasSettings) {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.setVisibility(true);
                    this.is_hand_menu_showing = true;
                }
            }
            else {
                if (dotProduct < -0.6 && !pinned) {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.handMenu.setVisibility(false);
                    this.is_hand_menu_showing = false;
                }
            }
            return new Set();
        }
    }
    exports.HandMenuActivationOnHand = HandMenuActivationOnHand;
});
