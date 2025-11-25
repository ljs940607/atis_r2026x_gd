/// <amd-module name="DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitControllerFlyNav"/>
define("DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitControllerFlyNav", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebappsUtils/WebappsUtils", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkitNativeSkills"], function (require, exports, THREE, WebappsUtils_1, WebVisuXRToolkit_1, WebVisuXRToolkitConfigManager, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ControllerFlyNav = void 0;
    class ControllerFlyNav extends EventTarget {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.JoystickTouch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Secondary]);
            this._iconindicators = new Map();
            this._lastIconKey = ""; // Stores the last applied icon
        }
        onActivate(input) {
            //console.log("onActivate ControllerFlyNav")
            if (input.targetRayWorldMatrix) {
                const skillInfo = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.FlyNavName);
                const speed = skillInfo.settings.getNumericalValue(NLS.flySpeed);
                const joystickX = input.joystickAxes[2];
                const joystickY = -input.joystickAxes[3];
                const magnitude = Math.sqrt(joystickX * joystickX + joystickY * joystickY);
                const raycastOrientation = new THREE.Quaternion();
                if (skillInfo.settings.getBooleanValue("_followControllerOrientation")) {
                    input.targetRayWorldMatrix.decompose(undefined, raycastOrientation, undefined);
                }
                else {
                    (0, WebVisuXRToolkit_1.getHeadWorldMatrix)().decompose(undefined, raycastOrientation, undefined);
                }
                let direction = "center";
                let iconKey = "";
                if (joystickX !== 0 || joystickY !== 0) {
                    const absX = Math.abs(joystickX);
                    const absY = Math.abs(joystickY);
                    let raycastForward = new THREE.Vector3();
                    // Determine the dominant movement direction
                    if (absX > absY) { // Strafe left/right has higher magnitude
                        if (joystickX > 0.1) {
                            direction = "east";
                            if (absX >= 0.9)
                                iconKey = "skill_fly_navigation_strafe_right_speed3";
                            else if (absX >= 0.6)
                                iconKey = "skill_fly_navigation_strafe_right_speed2";
                            else if (absX >= 0.3)
                                iconKey = "skill_fly_navigation_strafe_right_speed1";
                            else
                                iconKey = "skill_fly_navigation_strafe_right_idle";
                        }
                        else if (joystickX < -0.1) {
                            direction = "west";
                            if (absX >= 0.9)
                                iconKey = "skill_fly_navigation_strafe_left_speed3";
                            else if (absX >= 0.6)
                                iconKey = "skill_fly_navigation_strafe_left_speed2";
                            else if (absX >= 0.3)
                                iconKey = "skill_fly_navigation_strafe_left_speed1";
                            else
                                iconKey = "skill_fly_navigation_strafe_left_idle";
                        }
                        raycastForward = new THREE.Vector3(joystickX < 0 ? -1 : 1, 0, 0).applyQuaternion(raycastOrientation).normalize();
                    }
                    else if (absY > absX) {
                        // Forward/backward has higher magnitude
                        if (joystickY > -0.1) {
                            direction = "north";
                            if (absY >= 0.9)
                                iconKey = "skill_fly_navigation_forward_speed3";
                            else if (absY >= 0.6)
                                iconKey = "skill_fly_navigation_forward_speed2";
                            else if (absY >= 0.3)
                                iconKey = "skill_fly_navigation_forward_speed1";
                            else
                                iconKey = "skill_fly_navigation_forward_idle";
                        }
                        else if (joystickY < 0.1) {
                            direction = "south";
                            if (absY >= 0.9)
                                iconKey = "skill_fly_navigation_backwards_speed3";
                            else if (absY >= 0.6)
                                iconKey = "skill_fly_navigation_backwards_speed2";
                            else if (absY >= 0.3)
                                iconKey = "skill_fly_navigation_backwards_speed1";
                            else
                                iconKey = "skill_fly_navigation_backwards_idle";
                        }
                        raycastForward = new THREE.Vector3(0, joystickY < 0 ? -1 : 1, 0).applyQuaternion(raycastOrientation).normalize();
                    }
                    const dot = raycastForward.dot(new THREE.Vector3(0, 0, 1));
                    if ((dot > 0.8 || dot < -0.8)) {
                        if (absY > absX) {
                            raycastForward.set(0, 0, dot).normalize();
                        }
                        else {
                            raycastForward.set(0, 0, -dot).applyQuaternion(raycastOrientation);
                            raycastForward.z = 0;
                            raycastForward.normalize();
                        }
                    }
                    else {
                        raycastForward.z = 0;
                        raycastForward.normalize();
                    }
                    const movementVector = raycastForward.multiplyScalar(speed * magnitude * (0, WebVisuXRToolkit_1.getDeltaTime)() * 100);
                    const position = new THREE.Vector3().getPositionFromMatrix((0, WebVisuXRToolkit_1.getXRNode)().getMatrix()).add(movementVector);
                    (0, WebVisuXRToolkit_1.getXRNode)().setMatrix((0, WebVisuXRToolkit_1.getXRNode)().getMatrix().setPosition(position));
                    this.dispatchEvent(new Event("FlyNavMovement"));
                }
                // Only update the icon if it actually changed
                if (iconKey !== this._lastIconKey) {
                    this._lastIconKey = iconKey; // Store new state
                    this.cleanupIcons(input);
                    if (iconKey !== "") {
                        const skillIcon = this._iconindicators.get(iconKey);
                        input.addIconIndicator(skillIcon[0], `thumbstick/${direction}`);
                        skillIcon[1] = `thumbstick/${direction}`;
                        this._iconindicators.set(iconKey, skillIcon);
                        const directions = ["south", "north", "west", "east"];
                        // Map each direction to its idle icon key
                        const idleIcons = {
                            north: "skill_fly_navigation_forward_idle",
                            south: "skill_fly_navigation_backwards_idle",
                            west: "skill_fly_navigation_strafe_left_idle",
                            east: "skill_fly_navigation_strafe_right_idle",
                        };
                        for (const other of directions) {
                            if (other !== direction) {
                                const idleIconKey = idleIcons[other];
                                if (idleIconKey) {
                                    const skillIcon = this._iconindicators.get(idleIconKey);
                                    if (skillIcon) {
                                        input.addIconIndicator(skillIcon[0], `thumbstick/${other}`);
                                        skillIcon[1] = `thumbstick/${other}`;
                                        this._iconindicators.set(idleIconKey, skillIcon);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        const skill_fly_navigation_overview = this._iconindicators.get("skill_fly_navigation_overview");
                        input.addIconIndicator(skill_fly_navigation_overview[0], "thumbstick/center");
                        skill_fly_navigation_overview[1] = "thumbstick/center";
                        this._iconindicators.set("skill_fly_navigation_overview", skill_fly_navigation_overview);
                    }
                }
            }
        }
        onActivateBegin(input, activatingAction) {
            //console.log("onActivateBegin ControllerFlyNav")
        }
        onActivateEnd(input, deActivatingAction) {
            //console.log("onActivateEnd ControllerFlyNav")
            this.cleanupIcons(input);
            const skill_fly_navigation_overview = this._iconindicators.get("skill_fly_navigation_overview");
            input.addIconIndicator(skill_fly_navigation_overview[0], "thumbstick/center");
        }
        onUnregisterInput(input) {
            this.cleanupIcons(input);
            input.removeLabelIndicator("thumbstick/center");
        }
        onRegisterInput(input) {
            this._labelIndicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.FlyNavLabel);
            this._iconindicators.set("skill_fly_navigation_overview", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_overview.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_forward_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_forward_idle.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_forward_speed1", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_forward_speed1.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_forward_speed2", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_forward_speed2.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_forward_speed3", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_forward_speed3.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_backwards_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_backwards_idle.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_backwards_speed1", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_backwards_speed1.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_backwards_speed2", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_backwards_speed2.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_backwards_speed3", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_backwards_speed3.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_left_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_left_idle.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_left_speed1", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_left_speed1.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_left_speed2", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_left_speed2.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_left_speed3", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_left_speed3.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_right_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_right_idle.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_right_speed1", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_right_speed1.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_right_speed2", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_right_speed2.png")), undefined]);
            this._iconindicators.set("skill_fly_navigation_strafe_right_speed3", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_strafe_right_speed3.png")), undefined]);
            input.addLabelIndicator(this._labelIndicator, "thumbstick/center");
            const skill_fly_navigation_overview = this._iconindicators.get("skill_fly_navigation_overview");
            input.addIconIndicator(skill_fly_navigation_overview[0], "thumbstick/center");
            skill_fly_navigation_overview[1] = "thumbstick/center";
            this._iconindicators.set("skill_fly_navigation_overview", skill_fly_navigation_overview);
        }
        cleanupIcons(input) {
            for (const el of this._iconindicators) {
                if (el[1][1] !== undefined) {
                    input.removeIconIndicator(el[1][1]);
                    el[1][1] = undefined;
                }
            }
        }
    }
    exports.ControllerFlyNav = ControllerFlyNav;
});
