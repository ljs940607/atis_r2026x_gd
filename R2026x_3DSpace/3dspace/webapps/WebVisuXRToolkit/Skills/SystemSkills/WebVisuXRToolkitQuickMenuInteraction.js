/// <amd-module name="DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitQuickMenuInteraction"/>
define("DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitQuickMenuInteraction", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/WebVisuXRToolkitManager", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkit"], function (require, exports, THREE, WebVisuXRToolkitManager_1, WebVisuXRToolkit_1, WebVisuXRToolkitHelpers_1, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HandQuickMenuInteraction = exports.QuickMenuInteraction = void 0;
    class QuickMenuInteraction {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.SecondButtonPress]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
            this._buttonCenters = new Map();
            this._lastHoveredButton = null;
        }
        onActivate(input) {
            if (input.targetRayWorldMatrix) {
                //Get the current right controller position and calculate the horizontal distance change
                const aimPose_world = input.targetRayWorldMatrix;
                const controllerPosition = new THREE.Vector3();
                aimPose_world.decompose(controllerPosition, undefined, undefined);
                const qm = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu;
                const qmToWorld = qm.getMatrix();
                let closestButton = null;
                let minDistance = Infinity;
                for (const buttoncenter of this._buttonCenters) {
                    const button = buttoncenter[0];
                    const style = window.getComputedStyle(button);
                    if (style.visibility === 'hidden')
                        continue; // Pass the hidden buttons
                    const pos = buttoncenter[1].clone();
                    const buttonOffset = new THREE.Vector3(0, 0, -50); // 5cm offset for not choosing the disable button as default
                    pos.add(buttonOffset);
                    pos.applyMatrix4(qmToWorld);
                    // Calculate distance from the controller to the button position
                    const distance = controllerPosition.distanceTo(pos);
                    // // Check if this button is closer than the current closest button
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestButton = buttoncenter[0];
                    }
                }
                ;
                if (minDistance > 200) // If out of bounds clear the last hovered button
                 {
                    if (this._lastHoveredButton) {
                        this._lastHoveredButton.parentElement?.dispatchEvent(new Event("mouseleave")); // Normally this operation is happening naturally with the other HTMLNodes but for QM we need to dispatch this event manually.
                        this._lastHoveredButton.dispatchEvent(new Event("mouseleave"));
                        qm.htmlevent("mouseleave", -1, -1);
                        WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.tooltip.deactivateTooltip();
                        WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.resetCriticalStateButtons();
                        this._lastHoveredButton = null;
                    }
                }
                else if (closestButton && (this._lastHoveredButton !== closestButton)) {
                    this._lastHoveredButton?.parentElement?.dispatchEvent(new Event("mouseleave"));
                    closestButton.parentElement?.dispatchEvent(new Event("mouseenter"));
                    input.vibrate(0.3, 1);
                    //console.log("closest button", closestButton)
                    closestButton.dispatchEvent(new Event("mouseenter"));
                    this._lastHoveredButton?.dispatchEvent(new Event("mouseleave"));
                    this._lastHoveredButton = closestButton;
                }
            }
            return this.bindings;
        }
        onActivateBegin(input, activatingAction) {
            if (input.targetRayWorldMatrix) {
                const aimPose_world = input.targetRayWorldMatrix;
                const controllerPosition = new THREE.Vector3();
                aimPose_world.decompose(controllerPosition, undefined, undefined);
                const head_matrix = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)();
                const headQuaternion = new THREE.Quaternion();
                head_matrix.decompose(undefined, headQuaternion, undefined);
                const forwardHeadset = new THREE.Vector3(0, 1, 0);
                forwardHeadset.applyQuaternion(headQuaternion); // Rotate the forward vector by the headset's orientation
                const distanceToForward = 20; // 2 cm forward
                const distanceToUp = 15; // 1.5 cm up 
                const qmPosition = controllerPosition.clone().add(forwardHeadset.clone().multiplyScalar(distanceToForward)).add(new THREE.Vector3(0, 0, distanceToUp));
                const forwardUI = forwardHeadset.clone().multiplyScalar(-1);
                const qmMatrix = (0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(new THREE.Vector3(0, 0, 0), forwardUI).setPosition(qmPosition);
                WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.toggleQuickMenu(true);
                WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.waitForTextureRefreshed().then(() => {
                    WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.setMatrix(qmMatrix);
                    const inputsArray = new Array;
                    const inputs = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.inputManager.getInputs();
                    if (inputs.left) {
                        inputsArray.push(inputs.left);
                    }
                    if (inputs.right) {
                        inputsArray.push(inputs.right);
                    }
                    for (const input of inputs.others) {
                        inputsArray.push(input);
                    }
                    this._buttonCenters = WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.updateQmButtons(inputsArray);
                });
            }
            return this.bindings;
        }
        onActivateEnd(input, deActivatingAction) {
            //console.log("on activate end quick menu", this._lastHoveredButton, this._lastActiveButton)
            if (this._lastHoveredButton) {
                this._lastHoveredButton.click();
                this._lastHoveredButton = null;
            }
            WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.quickMenu.tooltip.deactivateTooltip();
            WebVisuXRToolkitManager_1.WebVisuXRToolkitManager.instance.UIManager.toggleQuickMenu(false);
            return this.bindings;
        }
        onUnregisterInput(input) {
            if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitHand)
                return;
            input.removeLabelIndicator("upper_button/center");
        }
        onRegisterInput(input) {
            if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitHand)
                return;
            this._indicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.QuickMenuName);
            input.addLabelIndicator(this._indicator, "upper_button/center");
        }
    }
    exports.QuickMenuInteraction = QuickMenuInteraction;
    class HandQuickMenuInteraction extends QuickMenuInteraction {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.MiddlePinch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
        }
    }
    exports.HandQuickMenuInteraction = HandQuickMenuInteraction;
});
