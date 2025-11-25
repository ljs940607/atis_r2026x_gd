/// <amd-module name="DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIEventController"/>
define("DS/WebVisuXRToolkit/UI/WebVisuXRToolkitUIEventController", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebVisuXRToolkitUIEventController = exports.XREvents = exports.FMEvents = exports.QMEvents = void 0;
    var QMEvents;
    (function (QMEvents) {
        QMEvents["QMUpdated"] = "qmUpdated";
        QMEvents["QMNewSkillSelected"] = "qmNewSkillSelected";
    })(QMEvents || (exports.QMEvents = QMEvents = {}));
    var FMEvents;
    (function (FMEvents) {
        //Add FM related events
    })(FMEvents || (exports.FMEvents = FMEvents = {}));
    var XREvents;
    (function (XREvents) {
        XREvents["FrameChanged"] = "frameChanged";
    })(XREvents || (exports.XREvents = XREvents = {}));
    class WebVisuXRToolkitUIEventController extends EventTarget {
        constructor() {
            super();
        }
        static get instance() {
            if (!this.ins) {
                this.ins = new WebVisuXRToolkitUIEventController();
            }
            return this.ins;
        }
        emit(eventName, detail) {
            this.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
        }
        on(eventName, callback) {
            this.addEventListener(eventName, (event) => callback(event));
        }
        off(eventName, callback) {
            this.removeEventListener(eventName, callback);
        }
    }
    exports.WebVisuXRToolkitUIEventController = WebVisuXRToolkitUIEventController;
});
