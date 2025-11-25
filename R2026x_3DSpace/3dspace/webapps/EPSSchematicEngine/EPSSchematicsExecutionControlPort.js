/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionControlPort'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionControlPort", ["require", "exports", "DS/EPSSchematicEngine/EPSSchematicsExecutionPort", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums", "DS/EPSSchematicEngine/EPSSchematicsExecutionControlLinkContext"], function (require, exports, ExecutionPort, GraphBlock, Enums, EventServices, ExecutionEvents, ExecutionEnums, ExecutionControlLinkContext) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a schematics execution control port.
     * @class ExecutionControlPort
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionControlPort
     * @private
     */
    class ExecutionControlPort extends ExecutionPort {
        /**
         * @constructor
         * @param {ControlPort} model - The control port model.
         * @param {ExecutionBlock} parent - The parent execution block.
         */
        constructor(model, parent) {
            super(model, parent);
            this.active = false;
        }
        /**
         * Adds a port activate listener on the control port.
         * @protected
         * @param {Function} callback - The callback that will be called on event reception.
         */
        addPortActivateListener(callback) {
            if (this.model.getType() === Enums.EControlPortType.eOutput || this.model.getType() === Enums.EControlPortType.eOutputEvent) {
                this.eventTarget.addListener(ExecutionEvents.ExecutionControlPortActivateEvent, callback);
            }
        }
        /**
         * Removes a port activate listener from the control port.
         * @protected
         * @param {Function} callback - The callback that will be called on event reception.
         */
        removePortActivateListener(callback) {
            if (this.model.getType() === Enums.EControlPortType.eOutput || this.model.getType() === Enums.EControlPortType.eOutputEvent) {
                this.eventTarget.removeListener(ExecutionEvents.ExecutionControlPortActivateEvent, callback);
            }
        }
        /**
         * Activates the control port.
         * @private
         */
        activate() {
            if (this.model.block instanceof GraphBlock && this.model.block.graph === undefined) {
                if (this.model.getType() === Enums.EControlPortType.eOutput || this.model.getType() === Enums.EControlPortType.eOutputEvent) {
                    // Send the activate port event
                    const event = new ExecutionEvents.ExecutionControlPortActivateEvent();
                    event.controlPort = this;
                    this.eventTarget.dispatchEvent(event);
                    if (this.model.getType() === Enums.EControlPortType.eOutputEvent) {
                        this.parent.sendEvent(this);
                    }
                }
            }
            this.active = true;
            this.trace();
        }
        /**
         * Deactivates the control port.
         * @private
         */
        deactivate() {
            this.active = false;
        }
        /**
         * Checks whether the port is active or not.
         * @private
         * @return {boolean} True if the port is active else false.
         */
        isActive() {
            return this.active;
        }
        /**
         * Gets the port event.
         * @private
         * @return {EPEvent} The port event.
         */
        getEvent() {
            return this.event;
        }
        /**
         * Sets the port event.
         * @private
         * @param {EPEvent} event - The port event.
         */
        setEvent(event) {
            if ((this.model.getType() === Enums.EControlPortType.eInputEvent || this.model.getType() === Enums.EControlPortType.eOutputEvent) &&
                event instanceof EventServices.getEventByType(this.model.getEventType())) {
                this.event = event;
            }
        }
        /**
         * Traces the execution of the control port.
         * @private
         */
        trace() {
            if (this.getTraceMode() & ExecutionEnums.FTraceEvent.fControlPort) {
                const event = new ExecutionEvents.TracePortEvent();
                event.path = this.model.toPath();
                EventServices.dispatchEvent(event);
            }
        }
        /**
         * Gets the next links to execute connected to that port.
         * @private
         * @return {ExecutionControlLinkContext[]} The next links to execute.
         */
        getLinksToExecute() {
            let links = [];
            if (this.model.block instanceof GraphBlock) {
                links = this.links.filter(link => link.startPort === this);
            }
            else {
                links = this.links.slice(0);
            }
            const mappedLinks = links.map(link => new ExecutionControlLinkContext(link));
            return mappedLinks;
        }
    }
    return ExecutionControlPort;
});
