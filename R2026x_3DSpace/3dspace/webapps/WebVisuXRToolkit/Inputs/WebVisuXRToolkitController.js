/// <amd-module name="DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitController"/>
define("DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitController", ["require", "exports", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInput", "DS/WebappsUtils/WebappsUtils", "DS/WebVisuGLTF/GLTFLoader", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils"], function (require, exports, WebVisuXRToolkitInput_1, WebappsUtils_1, GLTFLoader, WebVisuXRToolkitSkillsUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitController = exports.OculusStandartInputs = void 0;
    var OculusStandartInputs;
    (function (OculusStandartInputs) {
        OculusStandartInputs[OculusStandartInputs["trigger"] = 0] = "trigger";
        OculusStandartInputs[OculusStandartInputs["grip"] = 1] = "grip";
        OculusStandartInputs[OculusStandartInputs["touchscreen_click"] = 2] = "touchscreen_click";
        OculusStandartInputs[OculusStandartInputs["Joystick"] = 3] = "Joystick";
        OculusStandartInputs[OculusStandartInputs["AXButton"] = 4] = "AXButton";
        OculusStandartInputs[OculusStandartInputs["BYButton"] = 5] = "BYButton";
        OculusStandartInputs[OculusStandartInputs["unknown2"] = 6] = "unknown2";
    })(OculusStandartInputs || (exports.OculusStandartInputs = OculusStandartInputs = {}));
    // here for example, AXButton and Joystick don't exist
    var OtherStandartInputs;
    (function (OtherStandartInputs) {
        OtherStandartInputs[OtherStandartInputs["grip"] = 4] = "grip";
        OtherStandartInputs[OtherStandartInputs["trigger"] = 2] = "trigger";
        OtherStandartInputs[OtherStandartInputs["BYButton"] = 3] = "BYButton";
        OtherStandartInputs[OtherStandartInputs["AXButton"] = -1] = "AXButton";
        OtherStandartInputs[OtherStandartInputs["Joystick"] = -1] = "Joystick";
        OtherStandartInputs[OtherStandartInputs["touchscreen_click"] = 0] = "touchscreen_click";
        OtherStandartInputs[OtherStandartInputs["unknown2"] = 1] = "unknown2";
    })(OtherStandartInputs || (OtherStandartInputs = {}));
    class WebVisuXRToolkitController extends WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput {
        constructor(mesh_id, XRInputSource, inputType, isMixedRealityActive, isDisplayingIndicators) {
            super(mesh_id, XRInputSource, isMixedRealityActive, isDisplayingIndicators, false);
            this._joystickAxes = [];
            this._animationClips = new Map();
            this._inputStatus = new Map();
            this._right_controller_models = new Map([
                ["meta-quest-touch-plus", "models/controller_MetaQuestTouchPlus_Right.gltf"],
                ["oculus-touch-v3", "models/controller_MetaQuest2_right.gltf"],
                ["htc-vive-focus-3", "models/controller_HTCFocus3_Right.gltf"],
                ["htc-vive", "models/controller_HTCViveWand.gltf"],
                ["generic-trigger-squeeze-thumbstick", "models/controller_MetaQuestTouchPlus_Right.gltf"]
            ]);
            this._left_controller_models = new Map([
                ["meta-quest-touch-plus", "models/controller_MetaQuestTouchPlus_Left.gltf"],
                ["oculus-touch-v3", "models/controller_MetaQuest2_left.gltf"],
                ["htc-vive-focus-3", "models/controller_HTCFocus3_Left.gltf"],
                ["htc-vive", "models/controller_HTCViveWand.gltf"],
                ["generic-trigger-squeeze-thumbstick", "models/controller_MetaQuestTouchPlus_Left.gltf"]
            ]);
            this._type = inputType;
            const loader = new GLTFLoader();
            let i = 0;
            for (; i < XRInputSource.profiles.length; i++) {
                if (this._handedness === WebVisuXRToolkitInput_1.InputHandedness.Left ? this._left_controller_models.has(XRInputSource.profiles[i]) : this._right_controller_models.has(XRInputSource.profiles[i])) {
                    break;
                }
            }
            const path = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", this._handedness === WebVisuXRToolkitInput_1.InputHandedness.Left ? this._left_controller_models.get(XRInputSource.profiles[i]) : this._right_controller_models.get(XRInputSource.profiles[i]));
            this.gamepad = XRInputSource.gamepad;
            loader.load(path).then((model) => {
                if (model.getAnimations) {
                    for (const anim of model.getAnimations()) {
                        this._animationClips.set(anim.name, anim);
                    }
                }
                this._model.addChild(model);
                this._hasModelLoaded = true;
            }).catch(e => {
                console.error("Couldn't identify controller", XRInputSource.profiles, path);
                const metaquestpluspath = (0, WebappsUtils_1.getWebappsAssetUrl)("WebVisuXRToolkit", this._handedness === WebVisuXRToolkitInput_1.InputHandedness.Left ? this._left_controller_models.get("meta-quest-touch-plus") : this._right_controller_models.get("meta-quest-touch-plus"));
                loader.load(metaquestpluspath).then((model) => {
                    this._model.addChild(model);
                    this._hasModelLoaded = true;
                });
            });
        }
        _connect() {
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.ControllerPassive);
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive);
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality);
        }
        _disconnect() {
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.ControllerPassive);
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive);
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality);
        }
        getAvailableInputs() {
            const inputsToRegister = new Set([WebVisuXRToolkitSkillsUtils_1.InputAction.ControllerPassive, WebVisuXRToolkitSkillsUtils_1.InputAction.FullImmersive, WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality]);
            if (this.gamepad) {
                const buttons = this.gamepad.buttons;
                Object.assign(this._joystickAxes, this.gamepad.axes);
                if (this._type.grip != -1 && buttons[this._type.grip]) {
                    if (buttons[this._type.grip].pressed != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.GripPress);
                    }
                    if (buttons[this._type.grip].touched != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.GripTouch);
                    }
                }
                if (this._type.trigger != -1 && buttons[this._type.trigger]) {
                    if (buttons[this._type.trigger].pressed != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.TriggerPress);
                    }
                    if (buttons[this._type.trigger].touched != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.TriggerTouch);
                    }
                }
                if (this._type.AXButton != -1 && buttons[this._type.AXButton]) {
                    if (buttons[this._type.AXButton].pressed != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.FirstButtonPress);
                    }
                    if (buttons[this._type.AXButton].touched != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.FirstButtonTouch);
                    }
                }
                if (this._type.BYButton != -1 && buttons[this._type.BYButton]) {
                    if (buttons[this._type.BYButton].pressed != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.SecondButtonPress);
                    }
                    if (buttons[this._type.BYButton].touched != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.SecondButtonTouch);
                    }
                }
                if (this._type.Joystick != -1 && buttons[this._type.Joystick]) {
                    if (buttons[this._type.Joystick].pressed != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.JoystickPress);
                    }
                    if (buttons[this._type.Joystick].touched != undefined) {
                        inputsToRegister.add(WebVisuXRToolkitSkillsUtils_1.InputAction.JoystickTouch);
                    }
                }
            }
            return inputsToRegister;
        }
        get joystickAxes() {
            return this._joystickAxes;
        }
        /** @internal */
        _update(frame, referenceSpace, XRInputSource, XRNodeMatrix) {
            this.gamepad = XRInputSource.gamepad;
            if (XRInputSource.gamepad) {
                const buttons = XRInputSource.gamepad.buttons;
                this._joystickAxes = Object.assign([], XRInputSource.gamepad.axes);
                let clip = this._animationClips.get("input/thumbstick/y");
                if (clip) {
                    clip.update(clip.startTime + (-this._joystickAxes[3] * 0.5 + 0.5) * (clip.endTime - clip.startTime));
                }
                clip = this._animationClips.get("input/thumbstick/x");
                if (clip) {
                    clip.update(clip.startTime + (this._joystickAxes[2] * 0.5 + 0.5) * (clip.endTime - clip.startTime));
                }
                if (this._type.grip != -1 && buttons[this._type.grip]) {
                    const clip = this._animationClips.get("input/squeeze/value");
                    if (clip) {
                        clip.update(clip.startTime + (buttons[this._type.grip].value * 0.5 + 0.5) * (clip.endTime - clip.startTime));
                    }
                    this._handleInputAction(buttons[this._type.grip], WebVisuXRToolkitSkillsUtils_1.InputAction.GripPress, WebVisuXRToolkitSkillsUtils_1.InputAction.GripTouch);
                }
                if (this._type.trigger != -1 && buttons[this._type.trigger]) {
                    const clip = this._animationClips.get("input/trigger/value");
                    if (clip) {
                        clip.update(clip.startTime + (buttons[this._type.trigger].value * 0.5 + 0.5) * (clip.endTime - clip.startTime));
                    }
                    this._handleInputAction(buttons[this._type.trigger], WebVisuXRToolkitSkillsUtils_1.InputAction.TriggerPress, WebVisuXRToolkitSkillsUtils_1.InputAction.TriggerTouch);
                }
                if (this._type.AXButton != -1 && buttons[this._type.AXButton]) {
                    const clip = this._animationClips.get("input/lower_button/click");
                    if (clip) {
                        clip.update(clip.startTime + (buttons[this._type.AXButton].value * 0.5 + 0.5) * (clip.endTime - clip.startTime));
                    }
                    this._handleInputAction(buttons[this._type.AXButton], WebVisuXRToolkitSkillsUtils_1.InputAction.FirstButtonPress, WebVisuXRToolkitSkillsUtils_1.InputAction.FirstButtonTouch);
                }
                if (this._type.BYButton != -1 && buttons[this._type.BYButton]) {
                    const clip = this._animationClips.get("input/upper_button/click");
                    if (clip) {
                        clip.update(clip.startTime + (buttons[this._type.BYButton].value * 0.5 + 0.5) * (clip.endTime - clip.startTime));
                    }
                    this._handleInputAction(buttons[this._type.BYButton], WebVisuXRToolkitSkillsUtils_1.InputAction.SecondButtonPress, WebVisuXRToolkitSkillsUtils_1.InputAction.SecondButtonTouch);
                }
                if (this._type.Joystick != -1 && buttons[this._type.Joystick]) {
                    this._handleInputAction(buttons[this._type.Joystick], WebVisuXRToolkitSkillsUtils_1.InputAction.JoystickPress, WebVisuXRToolkitSkillsUtils_1.InputAction.JoystickTouch);
                }
            }
        }
        _handleInputAction(button, inputActionPress, inputActionTouch) {
            if (button.pressed) {
                if (!this._inputStatus.get(inputActionPress)) {
                    this.startedActions.add(inputActionPress);
                }
                this._inputStatus.set(inputActionPress, true);
            }
            else {
                if (this._inputStatus.get(inputActionPress)) {
                    this.endedActions.add(inputActionPress);
                }
                this._inputStatus.set(inputActionPress, false);
            }
            if (button.touched) {
                if (!this._inputStatus.get(inputActionTouch)) {
                    this.startedActions.add(inputActionTouch);
                }
                this._inputStatus.set(inputActionTouch, true);
            }
            else {
                if (this._inputStatus.get(inputActionTouch)) {
                    this.endedActions.add(inputActionTouch);
                }
                this._inputStatus.set(inputActionTouch, false);
            }
        }
    }
    exports.WebVisuXRToolkitController = WebVisuXRToolkitController;
});
