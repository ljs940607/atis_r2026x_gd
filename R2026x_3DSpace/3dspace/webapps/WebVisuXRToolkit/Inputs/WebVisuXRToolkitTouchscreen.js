/// <amd-module name="DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitTouchscreen"/>
define("DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitTouchscreen", ["require", "exports", "DS/WebVisuXRToolkit/Inputs/WebVisuXRToolkitInput", "DS/WebVisuXRToolkit/Skills/WebVisuXRToolkitSkillsUtils", "DS/WebVisuXRToolkit/WebVisuXRToolkitHelpers"], function (require, exports, WebVisuXRToolkitInput_1, WebVisuXRToolkitSkillsUtils_1, WebVisuXRToolkitHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitTouchscreen = void 0;
    class WebVisuXRToolkitTouchscreen extends WebVisuXRToolkitInput_1.WebVisuXRToolkitInput {
        constructor(XRInputSource, session, isMixedRealityActive) {
            super(XRInputSource, isMixedRealityActive);
            this._touchAxes = [];
            let hitTestOptionsInit = {
                profile: 'generic-touchscreen',
                offsetRay: new XRRay()
            };
            if (session.requestHitTestSourceForTransientInput) {
                const promise = session.requestHitTestSourceForTransientInput(hitTestOptionsInit);
                if (promise) {
                    promise.then((hitTestSource) => {
                        this._transientInputHitTestSource = hitTestSource;
                    });
                }
            }
        }
        _connect() {
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.TouchScreenPassive);
            this.startedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality);
        }
        _disconnect() {
            this._transientInputHitTestSource?.cancel();
            this._transientInputHitTestSource = undefined;
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.TouchScreenPassive);
            this.endedActions.add(WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality);
        }
        getAvailableInputs() {
            const inputsToRegister = new Set([WebVisuXRToolkitSkillsUtils_1.InputAction.TouchScreenPassive, WebVisuXRToolkitSkillsUtils_1.InputAction.MixedReality]);
            return inputsToRegister;
        }
        getHitTestMatrixResult() {
            return this._hitResultMatrix;
        }
        getHitTestMatrixWorldResult() {
            return this._hitResultMatrixWorld;
        }
        get touchAxes() {
            return this._touchAxes;
        }
        /** @internal */
        _update(frame, referenceSpace, XRInputSource, headMatrix, XRNodeMatrix) {
            if (XRInputSource.gamepad) {
                this._touchAxes = XRInputSource.gamepad.axes;
            }
            if (this._transientInputHitTestSource) {
                let hitTestResults = frame.getHitTestResultsForTransientInput(this._transientInputHitTestSource);
                if (hitTestResults.length > 0) {
                    const res = hitTestResults[0];
                    if (res.results[0]) {
                        const pose = res.results[0].getPose(referenceSpace);
                        if (pose) {
                            this._hitResultMatrix = (0, WebVisuXRToolkitHelpers_1.convertXRRigidTransform)(pose.transform);
                            this._hitResultMatrixWorld = XRNodeMatrix.clone().multiply(this._hitResultMatrix);
                        }
                        else {
                            this._hitResultMatrix = undefined;
                            this._hitResultMatrixWorld = undefined;
                        }
                    }
                }
            }
        }
    }
    exports.WebVisuXRToolkitTouchscreen = WebVisuXRToolkitTouchscreen;
});
