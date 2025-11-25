/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionControlLink'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionControlLink", ["require", "exports", "DS/EPSSchematicEngine/EPSSchematicsExecutionLink", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums"], function (require, exports, ExecutionLink, EventServices, ExecutionEvents, ExecutionEnums) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class define a schematics execution control link.
     * @class ExecutionControlLink
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionControlLink
     * @extends ExecutionLink
     * @private
     */
    class ExecutionControlLink extends ExecutionLink {
        /**
         * @constructor
         * @param {ControlLink} model - The control link model.
         * @param {ExecutionGraph} graph - The parent execution graph.
         */
        constructor(model, graph) {
            super(model, graph);
        }
        /**
         * Traces the execution control link.
         * @private
         */
        trace() {
            if (this.getTraceMode() & ExecutionEnums.FTraceEvent.fControlLink) {
                const event = new ExecutionEvents.TraceLinkEvent();
                event.path = this.model.toPath();
                EventServices.dispatchEvent(event);
            }
        }
    }
    return ExecutionControlLink;
});
