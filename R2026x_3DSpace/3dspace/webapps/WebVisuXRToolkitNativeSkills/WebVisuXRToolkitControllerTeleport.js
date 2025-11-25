/// <amd-module name="DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitControllerTeleport"/>
define("DS/WebVisuXRToolkitNativeSkills/WebVisuXRToolkitControllerTeleport", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/Visualization/Node3D", "DS/WebVisuGLTF/GLTFLoader", "DS/WebappsUtils/WebappsUtils", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/WebVisuXRToolkit/WebVisuXRToolkit", "i18n!DS/WebVisuXRToolkit/assets/nls/WebVisuXRToolkitNativeSkills"], function (require, exports, THREE, Node3D, GLTFLoader, WebappsUtils_1, WebVisuXRToolkitConfigManager, WebVisuXRToolkit_1, NLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Teleport = void 0;
    function getParabolicIntersection(origin, direction) {
        const speed = 500;
        const gravity = 9.8;
        const a = -0.5 * gravity;
        const b = direction.z * speed;
        const c = origin.z - (0, WebVisuXRToolkit_1.getXRNode)().getMatrix().decompose()[0].z;
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return null;
        }
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const t1 = (-b + sqrtDiscriminant) / (2 * a);
        const t2 = (-b - sqrtDiscriminant) / (2 * a);
        const t = t1 > t2 ? t1 : t2;
        if (t < 0) {
            return null;
        }
        /*const x = origin.x + direction.x * speed * t;
        const y = origin.y + direction.y * speed * t;
        const z = origin.z + direction.z * speed * t + 0.5 * gravity * t * t;
        return new THREE.Vector3(x, y, z);*/
        //return new THREE.Vector3().addVectors(origin, direction.clone().multiplyScalar(t))
        return new THREE.Vector3(origin.x + direction.x * t * speed, origin.y + direction.y * t * speed, (0, WebVisuXRToolkit_1.getXRNode)().getMatrix().decompose()[0].z);
    }
    function ComputeFixedUpPoseFromPosAndForward(pos, forward) {
        let up = new THREE.Vector3(0.0, 0.0, 1.0);
        // for numerical stability we can't use (0,0,1) when the forward direction is close to looking into this direction; so in this case we flip the up axis to (0,1,0)
        if (Math.abs(forward.z) > 0.9)
            up = new THREE.Vector3(0.0, 1.0, 0.0);
        const right = forward.clone().cross(up);
        right.normalize();
        return new THREE.Matrix4().makeBasis(right, up.clone().cross(right), up).setPosition(pos);
    }
    function ComputePoseFromPosAndForward(pos, forward) {
        let up = new THREE.Vector3(0.0, 0.0, 1.0);
        // for numerical stability we can't use (0,0,1) when the forward direction is close to looking into this direction; so in this case we flip the up axis to (0,1,0)
        if (Math.abs(forward.z) > 0.9)
            up = new THREE.Vector3(0.0, 1.0, 0.0);
        const right = forward.clone().cross(up);
        right.normalize();
        up = right.clone().cross(forward);
        up.normalize();
        return new THREE.Matrix4().makeBasis(right, forward, up).setPosition(pos);
    }
    function setFromUnitVectors(vFrom, vTo) {
        const quat = new THREE.Quaternion();
        // assumes direction vectors vFrom and vTo are normalized
        let r = vFrom.dot(vTo) + 1;
        if (r < Number.EPSILON) {
            // vFrom and vTo point in opposite directions
            r = 0;
            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                quat.x = -vFrom.y;
                quat.y = vFrom.x;
                quat.z = 0;
                quat.w = r;
            }
            else {
                quat.x = 0;
                quat.y = -vFrom.z;
                quat.z = vFrom.y;
                quat.w = r;
            }
        }
        else {
            // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
            quat.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            quat.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            quat.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            quat.w = r;
        }
        return quat.normalize();
    }
    class Teleport extends EventTarget {
        constructor() {
            super(...arguments);
            this.bindings = new Set([WebVisuXRToolkit_1.InputAction.FullImmersive, WebVisuXRToolkit_1.InputAction.JoystickTouch]);
            this.desiredHandedness = new Set([WebVisuXRToolkit_1.AbstractHandedness.Primary]);
            this._teleportationMarker = new Node3D();
            this._teleportLaserNode = null;
            this._laserMaterial = new THREE.MeshBasicMaterial({ force: true, color: 0xff0000 });
            this._iconindicators = new Map();
            this._timeCounter = 0.0;
            this._rotateAngle = 0;
            this._isTiltingForward = false;
            this._hasCompletedSnapping = false;
            this._hasStartedTeleporting = false;
            this._hasStartedSnapping = false;
        }
        initLaserRay() {
            const loader = new GLTFLoader();
            loader.load((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "models/TeleportTargetMarker.glb")).then(marker => {
                this._teleportationMarker.addChild(marker);
                this._teleportationMarker.setVisibility(false);
            });
            this._laserMaterial.activatePDSFX();
            (0, WebVisuXRToolkit_1.getXRObjects)().addChild(this._teleportationMarker);
            const myUniforms = {
                "end_position": { type: "v3", value: new THREE.Vector3() },
                "mode": { type: "f", value: 0.0 },
                "time": { type: "f", value: 0.5 },
            };
            this._laserMaterial.setPDSFXUniforms(myUniforms);
            const myVaryings = {
                "v_x": { type: "f" },
                "v_local_dist": { type: "f" }
            };
            this._laserMaterial.setPDSFXVaryings(myVaryings);
            const overridenFunctions_VS = {
                ComputeObjectPosition: `const float pc = 1.0;
                float B(float t)
                {
                    // Standard Quadratic Bézier Curve but p0 == 0.0 as we always start from the aim pose in local coordinates
                    return 2.0*(1.0-t)*t*pc + t*t*end_position.z;
                }

                float B_dt(float t)
                {
                    return 2.0 * (1.0 - t) * pc + 2.0 * t * (end_position.z - pc);
                }

                vec3 ComputeObjectPosition() {
                    vec3 pos = vGetAttribPosition();
                    v_x = pos.x;
                    float t = pos.z; // interpolation parameter in local coordinates
                    if(mode == 0.0)
                    {
                        pos.y = B(t);
                    }

                    pos.z = t * end_position.y;

                    v_local_dist = B_dt(t);

                    return pos;
                }`,
            };
            const overridenFunctions_FS = {
                ProcessFinalColor: `
                void ProcessFinalColor(inout vec4 finalColor)
                {
                    float t = 1.0 - fract(v_local_dist * 8.0 + time);
                    
                    // Note: for some reason at the moment the range of v_x is always between -0.015 and 0.015
                    // It might be broken if something which does affect the vGetAttribPosition is changed
                    float xMin = -0.015;
                    float xMax =  0.015;
                    float length = xMax - xMin; 
                    float normalizedX  = (v_x - xMin) / length;
                    if(!(normalizedX  > t && normalizedX  < (1.0 - t))) 
                    {
                        discard;
                    }
                    //finalColor = vec4(t, t, t, 1.0);
                    finalColor = vec4(0.0, 0.6235, 0.8706, 1.0);    
                }`,
            };
            this._laserMaterial.setPDSFXOverridableFunctions(overridenFunctions_VS, overridenFunctions_FS);
            loader.load((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", "models/TeleportLaser.glb")).then(laser => {
                this._teleportLaserNode = laser;
                this._teleportLaserNode.setMaterial(this._laserMaterial);
                (0, WebVisuXRToolkit_1.getXRObjects)().addChild(this._teleportLaserNode);
                this._teleportLaserNode.setVisibility(false);
                this._teleportLaserNode.forceBoundingElements(true, { sphere: new THREE.Sphere(undefined, 2000) }, {});
            });
        }
        updateLaserRay(input, targetRayWorldMatrix, dt) {
            const teleportMode = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.TeleportName)?.settings?.getStringValue(NLS.TeleportMode) || NLS.TeleportArc;
            const origin = new THREE.Vector3();
            const orientation = new THREE.Quaternion();
            targetRayWorldMatrix.decompose(origin, orientation, undefined);
            const forward = new THREE.Vector3(0, 1, 0).applyQuaternion(orientation);
            const pose = teleportMode === NLS.TeleportArc ? ComputePoseFromPosAndForward(origin, forward) /* align to ground */ : targetRayWorldMatrix;
            this._teleportLaserNode.setMatrix(pose);
            const matData = pose.decompose();
            let targetPos = null;
            if (teleportMode === 'Line') {
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().removeChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const sceneBoundingSphere = (0, WebVisuXRToolkit_1.getViewer)().getRootNode().getBoundingSphere();
                (0, WebVisuXRToolkit_1.getViewer)().getRootNode().addChild((0, WebVisuXRToolkit_1.getXRObjects)());
                const tfar = sceneBoundingSphere.distanceToPoint(origin) + sceneBoundingSphere.radius;
                targetPos = origin.clone().add(forward.clone().multiplyScalar(tfar));
                if (WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.TeleportName).settings.getBooleanValue(NLS.CollisionsLineTeleport)) {
                    const raycast_results = input.castRayIntoScenegraph((0, WebVisuXRToolkit_1.getViewer)(), (0, WebVisuXRToolkit_1.getXRObjects)(), "prim");
                    if (raycast_results.length > 0) {
                        targetPos = raycast_results[0].point;
                        input.userData.hasHitanObject = raycast_results[0];
                    }
                }
            }
            else {
                targetPos = getParabolicIntersection(matData[0], new THREE.Vector3(0, 1, 0).applyQuaternion(matData[1]));
            }
            if (targetPos) {
                const fixedForward = Math.abs(forward.z) > 0.899 ? new THREE.Vector3(0, 0, -1).applyQuaternion(matData[1]) : forward;
                const targetMatrix = ComputeFixedUpPoseFromPosAndForward(targetPos, fixedForward);
                if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitController) {
                    if (input.joystickAxes[2] !== 0 && input.joystickAxes[3] !== 0) {
                        this._rotateAngle = Math.atan2(-input.joystickAxes[2], -input.joystickAxes[3]);
                    }
                    targetMatrix.rotateZ(this._rotateAngle);
                }
                else {
                    const angle = this.currentPinchWristUpVector.angleTo(this.onPinchWristUpVector);
                    const onPinchWristRightVector = new THREE.Vector3(-this.onPinchWristUpVector.z, 0, this.onPinchWristUpVector.x);
                    const angleOrientation = onPinchWristRightVector.dot(this.currentPinchWristUpVector) > 0 ? 1 : -1;
                    targetMatrix.rotateZ(angle * angleOrientation);
                }
                this._teleportationMarker.setMatrix(targetMatrix);
                this._timeCounter += dt;
                this._laserMaterial.updatePDSFXUniform("time", this._timeCounter);
                const end_position_in_controller_space = targetPos.clone().applyMatrix4(new THREE.Matrix4().getInverse(pose)).multiplyScalar(1.0 / 1000);
                this._laserMaterial.updatePDSFXUniform("end_position", end_position_in_controller_space);
                this._laserMaterial.updatePDSFXUniform("mode", teleportMode === NLS.TeleportArc ? 0.0 : 1.0);
            }
        }
        handleTeleportAction(input) {
            if (input.targetRayWorldMatrix) {
                if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitHand) {
                    const wristOrientation = new THREE.Quaternion().setFromRotationMatrix(input.getJoint('wrist').getMatrix());
                    this.currentPinchWristUpVector = new THREE.Vector3(0, 0, 1).applyQuaternion(wristOrientation).normalize();
                    this.currentPinchWristUpVector.y = 0;
                    if (!this.onPinchWristUpVector) {
                        this.onPinchWristUpVector = this.currentPinchWristUpVector;
                    }
                }
                else {
                    const joystickX = input.joystickAxes[2];
                    const joystickY = input.joystickAxes[3];
                    const angle = angleDirection(joystickX, joystickY);
                    if (angle > 260 && angle < 280) {
                        // tilt forward
                        if (this._isTiltingForward === false) {
                            this._isTiltingForward = true;
                            this.cleanupIcons(input);
                            this.activateIcon(input, "skill_teleport_active", "thumbstick/north");
                            this.activateIcon(input, "skill_teleport_rotate_target_left_idle", "thumbstick/west");
                            this.activateIcon(input, "skill_teleport_rotate_target_back_idle", "thumbstick/south");
                            this.activateIcon(input, "skill_teleport_rotate_target_right_idle", "thumbstick/east");
                        }
                    }
                    else if (this._isTiltingForward) {
                        //rotating
                        this._isTiltingForward = false;
                        this.cleanupIcons(input);
                        this.activateIcon(input, "skill_teleport_active", "thumbstick/north");
                        this.activateIcon(input, "skill_teleport_rotate_target_left_active", "thumbstick/west");
                        this.activateIcon(input, "skill_teleport_rotate_target_back_active", "thumbstick/south");
                        this.activateIcon(input, "skill_teleport_rotate_target_right_active", "thumbstick/east");
                    }
                }
                this._teleportationMarker.setVisibility(true);
                this._teleportLaserNode.setVisibility(true);
                this.updateLaserRay(input, input.targetRayWorldMatrix, (0, WebVisuXRToolkit_1.getDeltaTime)());
            }
        }
        handleSnapRotationAction(input) {
            const joystickX = input.joystickAxes[2];
            if (joystickX > -0.5 && joystickX < 0.5) {
                if (joystickX > -0.1 && joystickX < 0.1) {
                    this._hasStartedSnapping = false;
                    this.cleanupIcons(input);
                    this.activateIcon(input, "skill_teleport_stepturn_navigation_overview", "thumbstick/center");
                }
                this._hasCompletedSnapping = false;
            }
            if (!this._hasCompletedSnapping) {
                if (joystickX > 0.5) {
                    this._hasCompletedSnapping = true;
                    const XRMatrix = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix();
                    XRMatrix.rotateZ(-15 * Math.PI / 180);
                    (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(XRMatrix);
                }
                else if (joystickX < -0.5) {
                    this._hasCompletedSnapping = true;
                    const XRMatrix = (0, WebVisuXRToolkit_1.getXRNode)().getMatrix();
                    XRMatrix.rotateZ(15 * Math.PI / 180);
                    (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(XRMatrix);
                }
            }
        }
        onActivate(input) {
            if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitHand) {
                this.handleTeleportAction(input);
                this._teleportationMarker.setVisibility(true);
                this._teleportLaserNode.setVisibility(true);
            }
            else {
                if (this._hasStartedTeleporting) {
                    this.handleTeleportAction(input);
                    if (input.targetRayWorldMatrix) {
                        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(input.targetRayWorldMatrix.decompose()[1]);
                        if (up.z > 0.9) {
                            this._teleportationMarker.setVisibility(false);
                            this._teleportLaserNode.setVisibility(false);
                            this._hasStartedTeleporting = false;
                        }
                    }
                }
                else if (this._hasStartedSnapping) {
                    this.handleSnapRotationAction(input);
                }
                else {
                    const joystickX = input.joystickAxes[2];
                    const joystickY = input.joystickAxes[3];
                    const absX = Math.abs(joystickX);
                    const absY = Math.abs(joystickY);
                    // Determine the dominant movement direction
                    if (absX > absY) {
                        if (joystickX < -0.1) {
                            this._hasStartedSnapping = true;
                            this.cleanupIcons(input);
                            this.activateIcon(input, "skill_teleport_idle", "thumbstick/north");
                            this.activateIcon(input, "skill_fly_navigation_turn_left_active", "thumbstick/west");
                            this.activateIcon(input, "skill_fly_navigation_turn_right_idle", "thumbstick/east");
                        }
                        else if (joystickX > 0.1) {
                            this._hasStartedSnapping = true;
                            this.cleanupIcons(input);
                            this.activateIcon(input, "skill_teleport_idle", "thumbstick/north");
                            this.activateIcon(input, "skill_fly_navigation_turn_left_idle", "thumbstick/west");
                            this.activateIcon(input, "skill_fly_navigation_turn_right_active", "thumbstick/east");
                        }
                    }
                    else if (absY > absX) {
                        if (joystickY < -0.1) {
                            this._hasStartedTeleporting = true;
                            this._teleportationMarker.setVisibility(true);
                            this._teleportLaserNode.setVisibility(true);
                        }
                    }
                }
            }
        }
        onActivateBegin(input) {
            if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitController) {
                this.cleanupIcons(input);
                this.activateIcon(input, "skill_teleport_stepturn_navigation_overview", "thumbstick/center");
            }
            this.startTouchHeadWorldMatrix = (0, WebVisuXRToolkit_1.getHeadWorldMatrix)();
            this.startTouchHeadMatrixInverse = new THREE.Matrix4().getInverse((0, WebVisuXRToolkit_1.getHeadMatrix)());
        }
        onActivateEnd(input, deActivatingAction) {
            if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitController) {
                this.cleanupIcons(input);
                this.activateIcon(input, "skill_teleport_stepturn_navigation_overview", "thumbstick/center");
                this._hasStartedSnapping = false;
                this._hasStartedTeleporting = false;
                this._hasCompletedSnapping = false;
            }
            if (this._teleportationMarker.isVisible() && deActivatingAction !== WebVisuXRToolkit_1.InputAction.FullImmersive && deActivatingAction !== WebVisuXRToolkit_1.InputAction.HandPalmUp) {
                const teleportMode = WebVisuXRToolkitConfigManager.instance.getSkillInfos(NLS.TeleportName).settings.getStringValue(NLS.TeleportMode);
                const markerDec = this._teleportationMarker.getMatrixWorld().decompose();
                const aimedPos = markerDec[0];
                const aimedDirection = new THREE.Vector3(0, 1, 0).applyQuaternion(markerDec[1]);
                const lookDirection = new THREE.Vector3(0, 1, 0).applyQuaternion((0, WebVisuXRToolkit_1.getHeadWorldMatrix)().decompose()[1]);
                lookDirection.z = 0;
                lookDirection.normalize();
                const quat = setFromUnitVectors(lookDirection, aimedDirection);
                const startTouchHeadWorldMatrixData = this.startTouchHeadWorldMatrix.clone().decompose();
                const rot = startTouchHeadWorldMatrixData[1].clone().multiply(this.startTouchHeadMatrixInverse.decompose()[1]).multiply(quat);
                if (teleportMode === "Line" && input.userData.hasHitanObject) {
                    const normal = input.userData.hasHitanObject.normal;
                    if (normal.z > 0.7) // floor
                     {
                        (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(new THREE.Matrix4().compose(aimedPos, rot, (0, WebVisuXRToolkit_1.getXRNode)().getMatrix().decompose()[2]));
                    }
                    else if (normal.z < 0.7) // ceiling
                     {
                        (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(new THREE.Matrix4().compose(aimedPos.add(new THREE.Vector3(0, 0, -(0, WebVisuXRToolkit_1.getHeadMatrix)().decompose()[0].z - 50)), rot, (0, WebVisuXRToolkit_1.getXRNode)().getMatrix().decompose()[2]));
                    }
                    else { // wall
                        const inputPos = input.getMatrix().decompose()[0];
                        inputPos.z = 0;
                        const headsetPos = (0, WebVisuXRToolkit_1.getHeadMatrix)().decompose()[0];
                        headsetPos.z = 0;
                        const distance = inputPos.distanceTo(headsetPos);
                        const vec = (0, WebVisuXRToolkit_1.getXRNode)().getMatrixWorld().decompose()[0].setZ(0).sub(aimedPos.clone().setZ(0)).normalize().multiplyScalar(distance);
                        (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(new THREE.Matrix4().compose(aimedPos.add(vec), rot, (0, WebVisuXRToolkit_1.getXRNode)().getMatrix().decompose()[2]));
                    }
                }
                else {
                    (0, WebVisuXRToolkit_1.getXRNode)().setMatrix(new THREE.Matrix4().compose(aimedPos, rot, (0, WebVisuXRToolkit_1.getXRNode)().getMatrix().decompose()[2]));
                }
                this.dispatchEvent(new CustomEvent("TeleportationDone", { detail: { position: aimedPos } }));
            }
            this._teleportationMarker.setVisibility(false);
            this._teleportLaserNode.setVisibility(false);
            this.startTouchHeadWorldMatrix = undefined;
            this.startTouchHeadMatrixInverse = undefined;
        }
        onUnregisterInput(input) {
            this._teleportationMarker.removeChildren();
            if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitController) {
                input.removeLabelIndicator("thumbstick/center");
                input.removeIconIndicator("thumbstick/center");
                this.cleanupIcons(input);
            }
            (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(this._teleportationMarker);
            (0, WebVisuXRToolkit_1.getXRObjects)().removeChild(this._teleportLaserNode);
        }
        activateIcon(input, icon, attachment) {
            const _icon = this._iconindicators.get(icon);
            input.addIconIndicator(_icon[0], attachment);
            _icon[1] = attachment;
            this._iconindicators.set(icon, _icon);
        }
        cleanupIcons(input) {
            for (const el of this._iconindicators) {
                if (el[1][1] !== undefined) {
                    input.removeIconIndicator(el[1][1]);
                    el[1][1] = undefined;
                }
            }
        }
        onRegisterInput(input) {
            this.initLaserRay();
            if (input instanceof WebVisuXRToolkit_1.WebVisuXRToolkitController) {
                this._labelIndicator = (0, WebVisuXRToolkit_1.createLabelIndicator)(NLS.TeleportName);
                input.addLabelIndicator(this._labelIndicator, "thumbstick/center");
                this._iconindicators.set("skill_teleport_stepturn_navigation_overview", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_stepturn_navigation_overview.png")), undefined]);
                this.activateIcon(input, "skill_teleport_stepturn_navigation_overview", "thumbstick/center");
                this._iconindicators.set("skill_teleport_active", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_active.png")), undefined]);
                this._iconindicators.set("skill_teleport_rotate_target_left_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_rotate_target_left_idle.png")), undefined]);
                this._iconindicators.set("skill_teleport_rotate_target_back_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_rotate_target_back_idle.png")), undefined]);
                this._iconindicators.set("skill_teleport_rotate_target_right_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_rotate_target_right_idle.png")), undefined]);
                this._iconindicators.set("skill_teleport_rotate_target_left_active", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_rotate_target_left_active.png")), undefined]);
                this._iconindicators.set("skill_teleport_rotate_target_back_active", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_rotate_target_back_active.png")), undefined]);
                this._iconindicators.set("skill_teleport_rotate_target_right_active", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_rotate_target_right_active.png")), undefined]);
                this._iconindicators.set("skill_teleport_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_teleport_idle.png")), undefined]);
                this._iconindicators.set("skill_fly_navigation_turn_left_active", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_turn_left_active.png")), undefined]);
                this._iconindicators.set("skill_fly_navigation_turn_left_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_turn_left_idle.png")), undefined]);
                this._iconindicators.set("skill_fly_navigation_turn_right_idle", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_turn_right_idle.png")), undefined]);
                this._iconindicators.set("skill_fly_navigation_turn_right_active", [(0, WebVisuXRToolkit_1.createIconIndicator)((0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkitNativeSkills", "skill_fly_navigation_turn_right_active.png")), undefined]);
            }
        }
    }
    exports.Teleport = Teleport;
    function angleDirection(x, y) {
        // Calculate angle in radians using arctangent
        const angleRadians = Math.atan2(y, x);
        // Convert radians to degrees
        let angleDegrees = (angleRadians * 180) / Math.PI;
        // Adjust angle to be positive (in range [0, 360))
        if (angleDegrees < 0) {
            angleDegrees += 360;
        }
        return angleDegrees;
    }
});
