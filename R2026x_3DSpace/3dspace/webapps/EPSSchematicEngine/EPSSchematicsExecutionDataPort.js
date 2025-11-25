/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionDataPort'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionDataPort", ["require", "exports", "DS/EPSSchematicEngine/EPSSchematicsExecutionPort", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPEventServices/EPEventServices"], function (require, exports, ExecutionPort, ExecutionEvents, ExecutionEnums, GraphBlock, Enums, EventServices) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a schematics execution data port.
     * @class ExecutionDataPort
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionDataPort
     * @private
     */
    class ExecutionDataPort extends ExecutionPort {
        /**
         * @constructor
         * @param {DataPort} model - The data port model.
         * @param {ExecutionBlock|ExecutionDataPort} parent - The parent execution block.
         */
        constructor(model, parent) {
            super(model, parent);
            this.portValued = false;
            this.isValueInitialized = false;
            this.executionValue = undefined;
            this.dataPorts = [];
            this.dataPortsByName = {};
            this.buildFromModel();
        }
        /**
         * @private
         */
        buildFromModel() {
            const dataPortsModel = this.model.getDataPorts();
            for (let dp = 0; dp < dataPortsModel.length; dp++) {
                this.createDataPortPlay(dataPortsModel[dp]);
            }
        }
        /**
         * Creates the execution data port.
         * @private
         * @param {DataPort} dataPortModel - The data port model.
         */
        createDataPortPlay(dataPortModel) {
            const dataPort = new ExecutionDataPort(dataPortModel, this);
            this.dataPorts.push(dataPort);
            this.dataPortsByName[dataPortModel.name] = dataPort;
        }
        /**
         * Adds a value change listener on the data port.
         * @protected
         * @param {Function} callback - The callback that will be called on event reception.
         */
        addValueChangeListener(callback) {
            if (this.model.getType() === Enums.EDataPortType.eOutput) {
                this.eventTarget.addListener(ExecutionEvents.ExecutionDataPortValueChangeEvent, callback);
            }
        }
        /**
         * Removes a value change listener from the data port.
         * @protected
         * @param {Function} callback - The callback that will be called on event reception.
         */
        removeValueChangeListener(callback) {
            if (this.model.getType() === Enums.EDataPortType.eOutput) {
                this.eventTarget.removeListener(ExecutionEvents.ExecutionDataPortValueChangeEvent, callback);
            }
        }
        /**
         * Gets the execution links connected to that input data port.
         * If the port is an input graph port then only graph external links will be selected.
         * If the port is an output graph port then only graph internal links will be selected.
         * If the port is an output block port then no links will be selected.
         * @private
         * @returns {ExecutionDataLink[]} The list of execution links connected to that input data port.
         */
        getInputDataLinks() {
            let links = [];
            if (this.model.block instanceof GraphBlock) {
                links = this.links.filter(link => link.endPort === this);
            }
            else if (this.model.getType() === Enums.EDataPortType.eInput || this.model.getType() === Enums.EDataPortType.eInputExternal) {
                links = this.links.slice(0);
            }
            return links;
        }
        /**
         * Gets the execution links connected to that output data port.
         * If the port is an input graph port then only graph internal links will be selected.
         * If the port is an output graph port then only graph external links will be selected.
         * If the port is an input block port then no links will be selected.
         * @private
         * @return {ExecutionDataLink[]} The list of execution links connected to that output data port.
         */
        getOutputDataLinks() {
            let links = [];
            if (this.model.block instanceof GraphBlock) {
                links = this.links.filter(link => link.startPort === this);
            }
            else if (this.model.getType() === Enums.EDataPortType.eOutput) {
                links = this.links.slice(0);
            }
            return links;
        }
        /**
         * Checks whether the data port has been valued or not.
         * @private
         * @return {boolean} True if the data port is valued else false.
         */
        isValued() {
            let portValued = this.portValued;
            if (this.parent instanceof ExecutionDataPort) {
                portValued = this.parent.isValued();
            }
            else if (this.model.block instanceof GraphBlock) {
                if (this.model.getType() !== Enums.EDataPortType.eOutput) {
                    portValued = true;
                }
            }
            return portValued;
        }
        /**
         * Gets the port's value.
         * @protected
         * @returns {*} The port's value.
         */
        getValue() {
            let value;
            if (this.parent instanceof ExecutionDataPort) {
                value = this.parent.getValue();
                const propertyList = this.model.getName().split('.');
                while (value !== undefined && propertyList.length > 0) {
                    value = value[propertyList.shift()];
                }
            }
            else {
                if (!this.isValueInitialized) {
                    this.executionValue = this.model.getDefaultValue();
                    this.isValueInitialized = true;
                }
                value = this.executionValue;
            }
            return value;
        }
        /**
         * Sets the port's value.
         * @protected
         * @param {*} value - The port's value.
         */
        setValue(value) {
            if (value !== this.getValue()) {
                if (this.parent instanceof ExecutionDataPort) {
                    let parentValue = this.parent.getValue();
                    const propertyList = this.model.getName().split('.');
                    while (parentValue !== undefined && propertyList.length > 0) {
                        if (propertyList.length === 1) {
                            parentValue[propertyList.shift()] = value;
                        }
                        else {
                            parentValue = parentValue[propertyList.shift()];
                        }
                    }
                }
                else {
                    this.executionValue = value;
                    this.isValueInitialized = true;
                }
                this.onValueChange();
            }
            this.portValued = true;
            this.trace();
        }
        onValueChange() {
            if (this.parent instanceof ExecutionDataPort) {
                this.parent.onValueChange();
            }
            else {
                const event = new ExecutionEvents.ExecutionDataPortValueChangeEvent();
                event.dataPort = this;
                event.value = this.getValue();
                this.eventTarget.dispatchEvent(event);
            }
        }
        /**
         * Gets the port's value type.
         * @protected
         * @return {string} The port's value type.
         */
        getValueType() {
            return this.model.getValueType();
        }
        /**
         * Traces the execution of the data port.
         * @private
         */
        trace() {
            if (this.getTraceMode() & ExecutionEnums.FTraceEvent.fDataPort) {
                const event = new ExecutionEvents.TraceDataPortEvent();
                event.path = this.model.toPath();
                event.value = this.getValue();
                event.valueType = this.getValueType();
                EventServices.dispatchEvent(event);
                if (this.parent instanceof ExecutionDataPort) {
                    this.parent.trace();
                }
            }
        }
    }
    return ExecutionDataPort;
});
