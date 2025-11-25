/// <amd-module name='DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceDataPortHandler'/>
define("DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceDataPortHandler", ["require", "exports", "DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceHandler", "DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITracePortHandler"], function (require, exports, UITraceHandler, UITracePortHandler) {
    "use strict";
    /**
     * This class defines a UI trace data port handler.
     * It provides enabling and disabling trace capacities.
     * @private
     * @class UITraceDataPortHandler
     * @alias module:DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceDataPortHandler
     * @extends UITracePortHandler
     */
    class UITraceDataPortHandler extends UITracePortHandler {
        /**
         * @public
         * @constructor
         * @param {UITraceController} controller - The UI trace controller.
         * @param {UIGraph} graph - The UI graph.
         * @param {string} path - The path of the port to trace.
         */
        constructor(controller, graph, path) {
            super(controller, graph, path);
        }
        /**
         * Enables the trace capacity.
         * @public
         * @override
         * @param {boolean} skipAnimation - True to skip the trace animation.
         */
        enable(skipAnimation) {
            if (this._outsideHandler === undefined) {
                this._outsideElementUI = this._graph.getOutsideDataPortFromPath(this._path);
                if (this._outsideElementUI !== undefined) {
                    this._outsideHandler = new UITraceHandler(this._controller, this._outsideElementUI);
                }
            }
            if (this._outsideElementUI !== undefined) {
                const label = this._outsideElementUI.getPersistentLabel();
                if (label) {
                    label.getView().refreshLabelDisplay();
                }
            }
            if (this._insideHandler === undefined) {
                const elementUI = this._graph.getInsideDataPortFromPath(this._path);
                if (elementUI !== undefined) {
                    this._insideHandler = new UITraceHandler(this._controller, elementUI);
                }
            }
            super.enable(skipAnimation);
        }
        /**
         * Disables the trace capacity.
         * @public
         * @override
         * @param {UIGraphBlock} [parentBlock] - The parent graph block.
         * @returns {boolean} True if inside and outside handlers are disabled.
         */
        disable(parentBlock) {
            if (this._outsideElementUI !== undefined) {
                const label = this._outsideElementUI.getPersistentLabel();
                if (label) {
                    label.getView().refreshLabelDisplay();
                }
            }
            return super.disable(parentBlock);
        }
    }
    return UITraceDataPortHandler;
});
