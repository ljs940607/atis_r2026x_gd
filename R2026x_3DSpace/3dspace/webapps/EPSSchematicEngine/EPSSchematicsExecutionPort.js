/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionPort'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionPort", ["require", "exports", "DS/EPEventServices/EPEventTarget"], function (require, exports, EventTarget) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a schematics execution port.
     * @class ExecutionPort
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionPort
     * @private
     */
    class ExecutionPort {
        /**
         * @constructor
         * @param {DataPort|ControlPort} model - The port model.
         * @param {ExecutionBlock} parent - The parent execution block.
         */
        constructor(model, parent) {
            this.links = [];
            this.eventTarget = new EventTarget();
            this.model = model;
            this.parent = parent;
        }
        /**
         * Gets the trace mode state.
         * @private
         * @return {FTraceEvent} The trace mode state.
         */
        getTraceMode() {
            if (this.traceMode === undefined && this.parent !== undefined) {
                this.traceMode = this.parent.getTraceMode();
            }
            return this.traceMode;
        }
    }
    return ExecutionPort;
});
