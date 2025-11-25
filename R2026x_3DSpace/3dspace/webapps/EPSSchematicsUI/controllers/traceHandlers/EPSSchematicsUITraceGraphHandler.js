/// <amd-module name='DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceGraphHandler'/>
define("DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceGraphHandler", ["require", "exports", "DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceHandler", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UITraceHandler, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI trace graph handler.
     * Graph have no UI element representation that can be traced but
     * need to display error message notification.
     * @private
     * @class UITraceGraphHandler
     * @alias module:DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceGraphHandler
     * @extends UITraceHandler
     */
    class UITraceGraphHandler extends UITraceHandler {
        /**
         * @public
         * @constructor
         * @param {UITraceController} controller - The UI trace controller.
         * @param {UIGraph} elementUI - The UI graph element.
         */
        constructor(controller, elementUI) {
            super(controller, elementUI);
        }
        /**
         * Enables the graph trace capacity.
         * @public
         * @override
         * @param {boolean} _skipAnimation - True to skip the trace animation.
         * @param {ITraceOptions} [options] - The trace options
         */
        enable(_skipAnimation, options) {
            if (options !== undefined && options.executionResult !== undefined) {
                if (options.executionResult === ModelEnums.EExecutionResult.eExecutionError) {
                    this.displayError(options);
                }
            }
        }
        /**
         * Disables the trace capacity.
         * @private
         * @override
         */
        // eslint-disable-next-line class-methods-use-this
        disable() { }
    }
    return UITraceGraphHandler;
});
