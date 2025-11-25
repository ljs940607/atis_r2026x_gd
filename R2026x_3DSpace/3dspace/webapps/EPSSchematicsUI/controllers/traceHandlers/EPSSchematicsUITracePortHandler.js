/// <amd-module name='DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITracePortHandler'/>
define("DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITracePortHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines a UI trace port handler.
     * It provides enabling and disabling trace capacities.
     * @private
     * @abstract
     * @class UITracePortHandler
     * @alias module:DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITracePortHandler
     */
    class UITracePortHandler {
        /**
         * @public
         * @constructor
         * @param {UITraceController} controller - The UI trace controller.
         * @param {UIGraph} graph - The UI graph.
         * @param {string} path - The path of the port to trace.
         */
        constructor(controller, graph, path) {
            this._controller = controller;
            this._graph = graph;
            this._path = path;
            this._fromDebug = false;
        }
        /**
         * Sets the fromDebug state.
         * @public
         * @param {boolean} fromDebug - True if from debug else false.
         */
        setFromDebug(fromDebug) {
            this._fromDebug = fromDebug;
        }
        /**
         * Enables the trace capacity.
         * @public
         * @param {boolean} skipAnimation - True to skip the trace animation.
         */
        enable(skipAnimation) {
            if (this._outsideHandler !== undefined) {
                this._outsideHandler.enable(skipAnimation, undefined, this._fromDebug);
            }
            if (this._insideHandler !== undefined) {
                this._insideHandler.enable(skipAnimation, undefined, this._fromDebug);
            }
        }
        /**
         * Disables the trace capacity.
         * @public
         * @param {UIGraphBlock} [parentBlock] - The parent graph block.
         * @returns {boolean} True if inside and outside handlers are disabled.
         */
        disable(parentBlock) {
            if (this._insideHandler !== undefined) {
                this._insideHandler.disable();
                this._insideHandler = undefined;
            }
            if (this._outsideHandler !== undefined) {
                if (parentBlock === undefined || this._outsideElementUI?.getParent() !== parentBlock) {
                    this._outsideHandler.disable();
                    this._outsideHandler = undefined;
                    this._outsideElementUI = undefined;
                }
            }
            const isEmpty = this._outsideHandler === undefined && this._insideHandler === undefined;
            if (isEmpty) {
                this._controller = undefined;
                this._graph = undefined;
                this._path = undefined;
            }
            return isEmpty;
        }
    }
    return UITracePortHandler;
});
