/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionDataLink'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionDataLink", ["require", "exports", "DS/EPSSchematicEngine/EPSSchematicsExecutionLink", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary"], function (require, exports, ExecutionLink, EventServices, ExecutionEvents, ExecutionEnums, TypeLibrary) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class define a schematics execution data link.
     * @class ExecutionDataLink
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionDataLink
     * @extends ExecutionLink
     * @private
     */
    class ExecutionDataLink extends ExecutionLink {
        /**
         * @constructor
         * @param {DataLink} model - The data link model.
         * @param {ExecutionGraph} graph - The parent execution graph.
         */
        constructor(model, graph) {
            super(model, graph);
        }
        /**
         * Traces the execution data link.
         * @private
         */
        trace() {
            if (this.getTraceMode() & ExecutionEnums.FTraceEvent.fDataLink) {
                const event = new ExecutionEvents.TraceDataLinkEvent();
                event.path = this.model.toPath();
                EventServices.dispatchEvent(event);
            }
        }
        /**
         * This method copies the data link value from the start port to the end port.
         * @private
         */
        copyDataLinkValue() {
            let value = this.startPort.getValue();
            value = TypeLibrary.castValueType(this.endPort.getValueType(), value);
            this.endPort.setValue(value);
            this.trace();
        }
    }
    return ExecutionDataLink;
});
