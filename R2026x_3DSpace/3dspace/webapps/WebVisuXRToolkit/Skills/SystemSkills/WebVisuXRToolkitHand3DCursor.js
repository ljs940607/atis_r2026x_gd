/// <amd-module name="DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitHand3DCursor"/>
define("DS/WebVisuXRToolkit/Skills/SystemSkills/WebVisuXRToolkitHand3DCursor", ["require", "exports", "DS/WebVisuXRToolkit/WebVisuXRToolkit"], function (require, exports, WebVisuXRToolkit) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hand3DCursor = void 0;
    // import { HTMLWindow } from 'DS/WebVisuXRToolkitUINode/HTMLWindow';
    class Hand3DCursor {
        constructor() {
            this.bindings = new Set([WebVisuXRToolkit.InputAction.ControllerPassive]);
            this.desiredHandedness = new Set([WebVisuXRToolkit.AbstractHandedness.Secondary]);
        }
        onActivate(input) {
            return new Set();
        }
        onActivateBegin(input, activatingAction) {
            return new Set();
        }
        onActivateEnd(input, deActivatingAction) {
            return new Set();
        }
        onRegisterInput(input) {
        }
        onUnregisterInput(input) {
        }
    }
    exports.Hand3DCursor = Hand3DCursor;
});
