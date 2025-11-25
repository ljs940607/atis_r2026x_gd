/// <amd-module name="DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInputManager"/>
define("DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInputManager", ["require", "exports", "DS/WebVisuXRToolkit/WebVisuXRToolkitConfigManager", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitController", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitHand", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitTouchscreen", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInput"], function (require, exports, WebVisuXRToolkitConfigManager, WebVisuXRToolkitController_1, WebVisuXRToolkitHand_1, WebVisuXRToolkitTouchscreen_1, WebVisuXRToolkitInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitInputManager = void 0;
    /**
     * The InputManager is taking care of the life cycle of the different inputs wether these are controller or hands
     */
    class WebVisuXRToolkitInputManager {
        constructor() {
            this._leftInput = null;
            this._rightInput = null;
            this._noHandednessInputs = new Array();
        }
        addSources(inputSources, XRNode, session, isMixedRealityActive, isDisplayingIndicators) {
            const newInputs = new Array();
            for (let i = 0; i < inputSources.length; i++) {
                if (inputSources[i].hand && !WebVisuXRToolkitConfigManager.instance.devMode.active) {
                    console.log("hand detected with dev mode deactivated");
                    continue;
                }
                if (inputSources[i].hand) {
                    const input = new WebVisuXRToolkitHand_1.WebVisuXRToolkitHand('hand_model', inputSources[i], isMixedRealityActive, isDisplayingIndicators);
                    XRNode.addChild(input.model);
                    newInputs.push(input);
                }
                else if (inputSources[i].targetRayMode === "tracked-pointer") {
                    const input = new WebVisuXRToolkitController_1.WebVisuXRToolkitController("controller_model", inputSources[i], WebVisuXRToolkitController_1.OculusStandartInputs, isMixedRealityActive, isDisplayingIndicators);
                    XRNode.addChild(input.model);
                    newInputs.push(input);
                }
                else if (inputSources[i].targetRayMode === "screen") {
                    newInputs.push(new WebVisuXRToolkitTouchscreen_1.WebVisuXRToolkitTouchscreen(inputSources[i], session, isMixedRealityActive));
                }
                else if (inputSources[i].targetRayMode === "transient-pointer") {
                    console.log("AVP Input when pinching and looking at something");
                    continue;
                }
                newInputs[i]._connect();
                switch (inputSources[i].handedness) {
                    case "left":
                        this._leftInput = newInputs[i];
                        break;
                    case "right":
                        this._rightInput = newInputs[i];
                        break;
                    case "none":
                        this._noHandednessInputs.push(newInputs[i]);
                        break;
                }
            }
            return newInputs;
        }
        removeSources(inputSources, XRNode, skillsManager) {
            for (let i = 0; i < inputSources.length; i++) {
                switch (inputSources[i].handedness) {
                    case "left":
                        if (this._leftInput) {
                            this._leftInput._disconnect();
                            skillsManager._updateAction(this._leftInput);
                            XRNode.removeChild(this._leftInput.model);
                            skillsManager._declareUnavailableActions(this._leftInput);
                            this._leftInput = null;
                        }
                        break;
                    case "right":
                        if (this._rightInput) {
                            this._rightInput._disconnect();
                            skillsManager._updateAction(this._rightInput);
                            XRNode.removeChild(this._rightInput.model);
                            skillsManager._declareUnavailableActions(this._rightInput);
                            this._rightInput = null;
                        }
                        break;
                    case "none":
                        for (let i = this._noHandednessInputs.length - 1; i >= 0; i--) {
                            const input = this._noHandednessInputs[i];
                            if (input.XRInputSource === inputSources[i]) {
                                input._disconnect();
                                skillsManager._updateAction(input);
                                skillsManager._declareUnavailableActions(input);
                                this._noHandednessInputs.splice(i, 1);
                            }
                        }
                        break;
                }
            }
        }
        update(inputSources, frame, referenceSpace, headMatrix, XRNodeMatrix, skillsManager) {
            for (let i = 0; i < inputSources.length; i++) {
                switch (inputSources[i].handedness) {
                    case "none":
                        for (const input of this._noHandednessInputs) {
                            input.update(frame, referenceSpace, inputSources[i], headMatrix, XRNodeMatrix);
                            skillsManager._updateAction(input);
                        }
                    case "left":
                        if (this._leftInput) {
                            this._leftInput.update(frame, referenceSpace, inputSources[i], headMatrix, XRNodeMatrix);
                            skillsManager._updateAction(this._leftInput);
                        }
                        break;
                    case "right":
                        if (this._rightInput) {
                            this._rightInput.update(frame, referenceSpace, inputSources[i], headMatrix, XRNodeMatrix);
                            skillsManager._updateAction(this._rightInput);
                        }
                        break;
                }
            }
        }
        destroy(XRNode, skillsManager) {
            if (this._leftInput) {
                this._leftInput._disconnect();
                skillsManager._updateAction(this._leftInput);
                XRNode.removeChild(this._leftInput.model);
                skillsManager._declareUnavailableActions(this._leftInput);
                this._leftInput = null;
            }
            if (this._rightInput) {
                this._rightInput._disconnect();
                skillsManager._updateAction(this._rightInput);
                XRNode.removeChild(this._rightInput.model);
                skillsManager._declareUnavailableActions(this._rightInput);
                this._rightInput = null;
            }
            for (const input of this._noHandednessInputs) {
                input._disconnect();
                skillsManager._updateAction(input);
                skillsManager._declareUnavailableActions(input);
            }
            this._noHandednessInputs = [];
        }
        setInputsVisiblity(display) {
            if (this._leftInput && this._leftInput instanceof WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput) {
                this._leftInput.setModelVisibility(display);
            }
            if (this._rightInput && this._rightInput instanceof WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput) {
                this._rightInput.setModelVisibility(display);
            }
            for (const input of this._noHandednessInputs) {
                if (input instanceof WebVisuXRToolkitInput_1.WebVisuXRToolkit3DInput) {
                    input.setModelVisibility(display);
                }
            }
        }
        getInputs() {
            return {
                "left": this._leftInput,
                "right": this._rightInput,
                "others": this._noHandednessInputs,
            };
        }
    }
    exports.WebVisuXRToolkitInputManager = WebVisuXRToolkitInputManager;
});
