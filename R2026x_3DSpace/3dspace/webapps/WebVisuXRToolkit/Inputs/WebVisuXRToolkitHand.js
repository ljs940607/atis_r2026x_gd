/// <amd-module name="DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitHand"/>
define("DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitHand", ["require", "exports", "DS/Visualization/ThreeJS_DS", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInput", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils", "DS/WebVisuGLTF/GLTFLoader", "DS/WebappsUtils/WebappsUtils", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers", "DS/WebVisuXRToolkit/WebVisuXRToolkit"], function (require, exports, THREE, WebVisuXRToolkitInput_1, WebVisuXRToolkitSkillsUtils_1, GLTFLoader, WebappsUtils_1, WebVisuXRToolkitHelpers_1, WebVisuXRToolkit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitHand = void 0;
    const WebXRJointToGLTFJoint = {
        "wrist": "",
        "thumb-metacarpal": "ThumbMetacarpal",
        "thumb-phalanx-proximal": "ThumbProximal",
        "thumb-phalanx-distal": "ThumbDistal",
        "thumb-tip": "ThumbTip",
        "index-finger-metacarpal": "IndexMetacarpal",
        "index-finger-phalanx-proximal": "IndexProximal",
        "index-finger-phalanx-intermediate": "IndexIntermediate",
        "index-finger-phalanx-distal": "IndexDistal",
        "index-finger-tip": "IndexTip",
        "middle-finger-metacarpal": "MiddleMetacarpal",
        "middle-finger-phalanx-proximal": "MiddleProximal",
        "middle-finger-phalanx-intermediate": "MiddleIntermediate",
        "middle-finger-phalanx-distal": "MiddleDistal",
        "middle-finger-tip": "MiddleTip",
        "ring-finger-metacarpal": "RingMetacarpal",
        "ring-finger-phalanx-proximal": "RingProximal",
        "ring-finger-phalanx-intermediate": "RingIntermediate",
        "ring-finger-phalanx-distal": "RingDistal",
        "ring-finger-tip": "RingTip",
        "pinky-finger-metacarpal": "LittleMetacarpal",
        "pinky-finger-phalanx-proximal": "LittleProximal",
        "pinky-finger-phalanx-intermediate": "LittleIntermediate",
        "pinky-finger-phalanx-distal": "LittleDistal",
        "pinky-finger-tip": "LittleTip",
    };
    const GLTFJointToWebXRJoint = Object.fromEntries(Object.entries(WebXRJointToGLTFJoint)
        .filter(([_, v]) => v !== "")
        .map(([key, value]) => [value, key]));
    var HandStandardFingers;
    (function (HandStandardFingers) {
        HandStandardFingers["thumb"] = "thumb";
        HandStandardFingers["index"] = "index";
        HandStandardFingers["middle"] = "middle";
        HandStandardFingers["ring"] = "ring";
        HandStandardFingers["pinky"] = "pinky";
    })(HandStandardFingers || (HandStandardFingers = {}));
    var FingerState;
    (function (FingerState) {
        FingerState["straight"] = "straight";
        FingerState["bent"] = "bent";
        FingerState["in_between"] = "in_between";
    })(FingerState || (FingerState = {}));
    const PINCH_START_DISTANCE = 0.05;
    const PINCH_TRIGGER_DISTANCE = 0.02;
    const REBOUND_THRESHOLD = 0.005;
    const WRIST_OFFSET = new THREE.Vector3(35, 115, 60);
    const HANDPALMUP_THRESHOLD = -0.7;
    class WebVisuXRToolkitHand extends WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput {
        get targetRayMatrix() {
            return this._handRayMatrix?.clone();
        }
        get targetRayWorldMatrix() {
            return this._handRayMatrixWorld?.clone();
        }
        get IndexThumbDistance() {
            return this._indexThumbDistance;
        }
        get MiddleThumbDistance() {
            return this._middleThumbDistance;
        }
        constructor(mesh_id, XRInputSource, isMixedRealityActive, isDisplayingIndicators) {
            super(mesh_id, XRInputSource, isMixedRealityActive, isDisplayingIndicators, true);
            this._joints = new Map();
            this._fingerStates = new Map();
            this._gestureStates = new Map();
            this._indexThumbDistance = 1;
            this._middleThumbDistance = 1;
            this.wristInvMat = new THREE.Matrix4();
            const loader = new GLTFLoader();
            const modelPath = this.handedness === WebVisuXRToolkitInput_1.InputHandedness.Left ? "models/SimpleHand_Left.gltf" : "models/SimpleHand_Right.gltf";
            const path = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", modelPath);
            //const debugAxis = getDebugAxis();
            //debugAxis.setMatrix(new THREE.Matrix4().scale(new THREE.Vector3(10, 10, 10)))
            //this._model.addChild(debugAxis)
            loader.load(path).then((model) => {
                model.exludeFromBounding(true);
                this._model.addChild(model);
                this._hasModelLoaded = true;
                this._skeleton = model.getSkeletons()[0];
                const obj = this._skeleton.getSkeletonRootNode();
                this._joints.set("wrist", obj);
                // const label = createLabelIndicator("wrist");
                // label.setMatrix(label.getMatrix().scale(new THREE.Vector3(0.001, 0.001, 0.001)))
                // this.debugWristNode.addChild(label)
                //WebVisuXRToolkitManager.instance.sceneManager.XRNode.add(this.debugWristNode);
                for (const child of obj.children) {
                    if (GLTFJointToWebXRJoint[child.name]) {
                        this._joints.set(GLTFJointToWebXRJoint[child.name], child);
                        // const label = createLabelIndicator(GLTFJointToWebXRJoint[child.name]);
                        // label.setMatrix(label.getMatrix().scale(new THREE.Vector3(0.001, 0.001, 0.001)))
                        // child.addChild(label)
                    }
                }
                ;
            });
            this._handRayMatrix = this.targetRayMatrix;
        }
        setHandMatrixFromShoulderThroughWrist(XRNodeMatrix) {
            const shoulder_mat_local = (0, WebVisuXRToolkit_1.getHeadMatrix)().clone().translate(new THREE.Vector3(this.handedness === WebVisuXRToolkitInput_1.InputHandedness.Right ? 200 : -200, 0, -150));
            const shoulder_mat_world = XRNodeMatrix.clone().multiply(shoulder_mat_local);
            const wrist_mat_arr = this.getJoint("wrist").getMatrixWorld().decompose();
            const wrist_pos = wrist_mat_arr[0];
            const quat = wrist_mat_arr[1];
            const offset_pos = wrist_pos.add(new THREE.Vector3(this.handedness === WebVisuXRToolkitInput_1.InputHandedness.Right ? WRIST_OFFSET.x : -WRIST_OFFSET.x, WRIST_OFFSET.y, WRIST_OFFSET.z).applyQuaternion(quat));
            const rot = new THREE.Quaternion().setFromRotationMatrix((0, WebVisuXRToolkitHelpers_1.makeRotationMatrix)(new THREE.Vector3().getPositionFromMatrix(shoulder_mat_world), offset_pos));
            const matrix_world = new THREE.Matrix4().compose(offset_pos, rot, new THREE.Vector3(1, 1, 1));
            this._handRayMatrixWorld = matrix_world;
            this._handRayMatrix = new THREE.Matrix4().getInverse(XRNodeMatrix).multiply(matrix_world);
        }
        /** @internal */
        _update(frame, referenceSpace, XRInputSource, headMatrix, XRNodeMatrix) {
            if (this._hasModelLoaded && frame.getJointPose) {
                if (!XRInputSource.hand) {
                    console.log("Strange behaviour, we are supposed to have XRInputSource.hand, we have : ", XRInputSource.hand);
                }
                else {
                    for (const jointSpace of XRInputSource.hand.values()) {
                        const jointPose = frame.getJointPose(jointSpace, referenceSpace);
                        if (jointPose) {
                            const node = this._joints.get(jointSpace.jointName);
                            if (node) {
                                if (jointSpace.jointName === "wrist") {
                                    this.wristInvMat = new THREE.Matrix4().setFromArray(Array.from(jointPose.transform.inverse.matrix));
                                    this._model.setMatrix((0, WebVisuXRToolkitHelpers_1.convertXRRigidTransform)(jointPose.transform).translate(new THREE.Vector3(0, 40, 0)));
                                }
                                else {
                                    const handSpaceMat = new THREE.Matrix4().multiplyMatrices(this.wristInvMat, new THREE.Matrix4().setFromArray(Array.from(jointPose.transform.matrix)));
                                    handSpaceMat.multiplyMatrices(new THREE.Matrix4().rotateX(0.5 * Math.PI).rotateZ(Math.PI), handSpaceMat);
                                    handSpaceMat.rotateX(0.5 * Math.PI).rotateZ(Math.PI);
                                    node.setMatrix(handSpaceMat);
                                }
                            }
                            else {
                                console.error("Couldn't find", jointSpace.jointName);
                            }
                        }
                    }
                }
                //Update Skinning
                if (this._skeleton !== undefined) {
                    this._skeleton.updateBonesPoses();
                }
                this.setHandMatrixFromShoulderThroughWrist(XRNodeMatrix);
                //Handle thumb differently because it has less joints
                if (this._joints.has("thumb-phalanx-proximal") && this._joints.has("thumb-phalanx-distal") && this._joints.has("thumb-tip")) {
                    const thumb_metacarpal_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get("thumb-metacarpal").getMatrix());
                    const thumb_phalanx_proximal_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get("thumb-phalanx-proximal").getMatrix());
                    const thumb_phalanx_distal_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get("thumb-phalanx-distal").getMatrix());
                    const thumb_tip_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get("thumb-tip").getMatrix());
                    const first_vec = thumb_phalanx_proximal_pos.clone().sub(thumb_metacarpal_pos).normalize();
                    const second_vec = thumb_tip_pos.sub(thumb_phalanx_distal_pos).normalize();
                    const dot = first_vec.dot(second_vec);
                    if (dot < 0.2) {
                        this._fingerStates.set(HandStandardFingers.thumb, FingerState.bent);
                    }
                    else if (dot > 0.2) {
                        this._fingerStates.set(HandStandardFingers.thumb, FingerState.straight);
                    }
                }
                const list = ["index", "middle", "ring", "pinky"];
                for (const finger of list) {
                    if (this._joints.has(`${finger}-finger-phalanx-proximal`) && this._joints.has(`${finger}-finger-phalanx-intermediate`) && this._joints.has(`${finger}-finger-phalanx-distal`) && this._joints.has(`${finger}-finger-tip`)) {
                        const phalanx_proximal_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get(`${finger}-finger-phalanx-proximal`).getMatrix());
                        const phalanx_intermediate_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get(`${finger}-finger-phalanx-intermediate`).getMatrix());
                        const phalanx_distal_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get(`${finger}-finger-phalanx-distal`).getMatrix());
                        const tip_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get(`${finger}-finger-tip`).getMatrix());
                        const first_vec = phalanx_intermediate_pos.sub(phalanx_proximal_pos).normalize();
                        const second_vec = tip_pos.sub(phalanx_distal_pos).normalize();
                        const dot = first_vec.dot(second_vec);
                        if (dot < 0) {
                            this._fingerStates.set(HandStandardFingers[finger], FingerState.bent);
                        }
                        else if (dot > 0) {
                            this._fingerStates.set(HandStandardFingers[finger], FingerState.straight);
                        }
                    }
                }
                this._updateGestures(headMatrix);
            }
        }
        _updateGestures(headMatrix) {
            const index_tip_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get("index-finger-tip").getMatrix());
            const middle_tip_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get("middle-finger-tip").getMatrix());
            const thumb_tip_pos = new THREE.Vector3().getPositionFromMatrix(this._joints.get("thumb-tip").getMatrix());
            this._indexThumbDistance = index_tip_pos.distanceTo(thumb_tip_pos);
            this._middleThumbDistance = middle_tip_pos.distanceTo(thumb_tip_pos);
            this._handleThresholdInputAction(this._indexThumbDistance, PINCH_START_DISTANCE, REBOUND_THRESHOLD, WebVisuXRToolkitSkillsUtils_1.InputAction.IndexAboutToPinch);
            this._handleThresholdInputAction(this._indexThumbDistance, PINCH_TRIGGER_DISTANCE, REBOUND_THRESHOLD, WebVisuXRToolkitSkillsUtils_1.InputAction.IndexPinch);
            this._handleThresholdInputAction(this._middleThumbDistance, PINCH_START_DISTANCE, REBOUND_THRESHOLD, WebVisuXRToolkitSkillsUtils_1.InputAction.MiddleAboutToPinch);
            this._handleThresholdInputAction(this._middleThumbDistance, PINCH_TRIGGER_DISTANCE, REBOUND_THRESHOLD, WebVisuXRToolkitSkillsUtils_1.InputAction.MiddlePinch);
            //this._handleInputAction(index_tip_pos.distanceTo(thumb_tip_pos) < distanceToPinch + threshold, InputAction.Pinch)
            if (this._gestureStates.get(WebVisuXRToolkitSkillsUtils_1.InputAction.IndexPinch)) {
                this._handleInputAction(false, WebVisuXRToolkitSkillsUtils_1.InputAction.FlatHand);
            }
            else {
                this._handleInputAction(this._fingerStates.get(HandStandardFingers.index) === FingerState.straight
                    && this._fingerStates.get(HandStandardFingers.thumb) === FingerState.straight
                    && this._fingerStates.get(HandStandardFingers.middle) === FingerState.straight
                    && this._fingerStates.get(HandStandardFingers.ring) === FingerState.straight
                    && this._fingerStates.get(HandStandardFingers.pinky) === FingerState.straight, WebVisuXRToolkitSkillsUtils_1.InputAction.FlatHand);
            }
            this._handleInputAction(this._fingerStates.get(HandStandardFingers.index) === FingerState.straight
                && this._fingerStates.get(HandStandardFingers.thumb) === FingerState.bent
                && this._fingerStates.get(HandStandardFingers.middle) === FingerState.bent
                && this._fingerStates.get(HandStandardFingers.ring) === FingerState.bent
                && this._fingerStates.get(HandStandardFingers.pinky) === FingerState.bent, WebVisuXRToolkitSkillsUtils_1.InputAction.Point);
            this._handleInputAction(this._fingerStates.get(HandStandardFingers.index) === FingerState.straight
                && this._fingerStates.get(HandStandardFingers.middle) === FingerState.straight
                && this._fingerStates.get(HandStandardFingers.ring) === FingerState.bent
                && this._fingerStates.get(HandStandardFingers.pinky) === FingerState.bent, WebVisuXRToolkitSkillsUtils_1.InputAction.GunHand);
            const wristOrientation = new THREE.Quaternion().setFromRotationMatrix(this.getMatrix().multiply(this.getJoint('wrist').getMatrix()));
            const currentWristFrontVector = new THREE.Vector3(0, 1, 0).applyQuaternion(wristOrientation).normalize();
            const dotFront = currentWristFrontVector.dot(new THREE.Vector3(0, 0, 1));
            this._handleThresholdInputAction(dotFront, HANDPALMUP_THRESHOLD, REBOUND_THRESHOLD, WebVisuXRToolkitSkillsUtils_1.InputAction.HandPalmUp);
        }
        _handleThresholdInputAction(left_value, right_value, threshold, inputAction) {
            if (this._gestureStates.get(inputAction)) {
                if (left_value > right_value + threshold) {
                    //action end
                    this.endedActions.add(inputAction);
                    this._gestureStates.set(inputAction, false);
                }
            }
            else {
                if (left_value <= right_value - threshold) {
                    //action start
                    this.startedActions.add(inputAction);
                    this._gestureStates.set(inputAction, true);
                }
            }
        }
        _handleInputAction(activation_condition, inputAction) {
            if (activation_condition) {
                if (!this._gestureStates.get(inputAction)) {
                    this.startedActions.add(inputAction);
                    this._gestureStates.set(inputAction, true);
                }
            }
            else {
                if (this._gestureStates.get(inputAction)) {
                    this.endedActions.add(inputAction);
                }
                this._gestureStates.set(inputAction, false);
            }
        }
        getJoint(name) {
            return this._joints.get(name);
        }
        _connect() {
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.HandPassive);
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive);
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality);
        }
        _disconnect() {
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.HandPassive);
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive);
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality);
        }
        getAvailableInputs() {
            return new Set([WebVisuXRToolkitSkillsUtils_1.InputAction.HandPassive, WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive, WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality, WebVisuXRToolkitSkillsUtils_1.InputAction.IndexPinch, WebVisuXRToolkitSkillsUtils_1.InputAction.MiddlePinch, WebVisuXRToolkitSkillsUtils_1.InputAction.FlatHand, WebVisuXRToolkitSkillsUtils_1.InputAction.Point, WebVisuXRToolkitSkillsUtils_1.InputAction.GunHand, WebVisuXRToolkitSkillsUtils_1.InputAction.HandPalmUp]);
        }
    }
    exports.WebVisuXRToolkitHand = WebVisuXRToolkitHand;
});
