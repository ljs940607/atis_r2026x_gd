/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionBlock'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionBlock", ["require", "exports", "DS/EPSSchematicEngine/EPSSchematicsExecutionDataPort", "DS/EPSSchematicEngine/EPSSchematicsExecutionControlPort", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsWorkerManager", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums"], function (require, exports, ExecutionDataPort, ExecutionControlPort, ExecutionEvents, EventServices, WorkerManager, Enums, ExecutionEnums) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the schematics execution block run parameters.
     * Several time related information are available such as deltaTime, currentTime and
     * the global step count.
     * @class ExecutionBlock.RunParameters
     * @private
     */
    class RunParameters {
        constructor() {
            this.globalStepsCount = 0;
            this.currentTime = 0.0;
            this.deltaTime = 0.0;
        }
    }
    /**
     * This class defines a schematics execution block.
     * @class ExecutionBlock
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionBlock
     * @private
     */
    class ExecutionBlock {
        static { this.RunParameters = RunParameters; }
        /**
         * @constructor
         * @param {Block} model - The block model.
         * @param {ExecutionGraph} parent - The parent execution graph.
         */
        constructor(model, parent) {
            this.dataPorts = [];
            this.dataPortsByName = {};
            this.controlPorts = [];
            this.controlPortsByName = {};
            this.settings = [];
            this.settingsByName = {};
            this.executeOnWorker = false;
            this.data = {}; // User data container
            this.model = model;
            this.parent = parent;
            this.buildFromBlockModel();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the data port from name.
         * @public
         * @param {string} portName - The data port's name.
         * @returns {ExecutionDataPort} The data port.
         */
        getDataPortByName(portName) {
            return this.dataPortsByName[portName];
        }
        /**
         * Gets the control port from name.
         * @public
         * @param {string} portName - The control port's name.
         * @returns {ExecutionControlPort} The control port.
         */
        getControlPortByName(portName) {
            return this.controlPortsByName[portName];
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //       _______ _______      ___   _________ ________   ______ _________ ________ ______         //
        //      |_   __ \_   __ \   .'   `.|  _   _  |_   __  |.' ___  |  _   _  |_   __  |_   _ `.       //
        //        | |__) || |__) | /  .-.  \_/ | | \_| | |_ \_/ .'   \_|_/ | | \_| | |_ \_| | | `. \      //
        //        |  ___/ |  __ /  | |   | |   | |     |  _| _| |          | |     |  _| _  | |  | |      //
        //       _| |_   _| |  \ \_\  `-'  /  _| |_   _| |__/ \ `.___.'\  _| |_   _| |__/ |_| |_.' /      //
        //      |_____| |____| |___|`.___.'  |_____| |________|`.____ .' |_____| |________|______.'       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the input control port name list of the block.
         * This list is sorted according to the port's creation order.
         * @protected
         * @returns {string[]} The input control port name list.
         */
        getInputControlPortNameList() {
            const list = [];
            const ports = this.getControlPorts(Enums.EControlPortType.eInput).concat(this.getControlPorts(Enums.EControlPortType.eInputEvent));
            for (let i = 0; i < ports.length; i++) {
                list.push(ports[i].model.getName());
            }
            return list;
        }
        /**
         * Gets the output control port name list of the block.
         * This list is sorted according to the port's creation order.
         * @protected
         * @returns {string[]} The output control port name list.
         */
        getOutputControlPortNameList() {
            const list = [];
            const ports = this.getControlPorts(Enums.EControlPortType.eOutput).concat(this.getControlPorts(Enums.EControlPortType.eOutputEvent));
            for (let i = 0; i < ports.length; i++) {
                list.push(ports[i].model.getName());
            }
            return list;
        }
        /**
         * Gets the input data port name list of the block.
         * This list is sorted according to the port's creation order.
         * @protected
         * @returns {string[]} The input data port name list.
         */
        getInputDataPortNameList() {
            const list = [];
            const ports = this.getDataPorts(Enums.EDataPortType.eInput);
            for (let i = 0; i < ports.length; i++) {
                list.push(ports[i].model.getName());
            }
            return list;
        }
        /**
         * Gets the output data port name list of the block.
         * This list is sorted according to the port's creation order.
         * @protected
         * @returns {string[]} The output data port name list.
         */
        getOutputDataPortNameList() {
            const list = [];
            const ports = this.getDataPorts(Enums.EDataPortType.eOutput);
            for (let i = 0; i < ports.length; i++) {
                list.push(ports[i].model.getName());
            }
            return list;
        }
        /**
         * Gets the local data port name list of the block.
         * This list is sorted according to the port's creation order.
         * @public
         * @returns {string[]} The local data port name list.
         */
        getLocalDataPortNameList() {
            const list = [];
            const ports = this.getDataPorts(Enums.EDataPortType.eLocal);
            for (let i = 0; i < ports.length; i++) {
                list.push(ports[i].model.getName());
            }
            return list;
        }
        /**
         * Checks the specified input control port is activated.
         * @public
         * @param {string} portName - The control port's name.
         * @returns {boolean} True if the port is activated else false.
         */
        isInputControlPortActivated(portName) {
            const port = this.getControlPortByName(portName);
            return port !== undefined && (port.model.getType() === Enums.EControlPortType.eInput || port.model.getType() === Enums.EControlPortType.eInputEvent) ? port.isActive() : false;
        }
        /**
         * Activates the specified output control port.
         * @protected
         * @param {string} portName - The control port's name.
         */
        activateOutputControlPort(portName) {
            const port = this.getControlPortByName(portName);
            if (port !== undefined && (port.model.getType() === Enums.EControlPortType.eOutput || port.model.getType() === Enums.EControlPortType.eOutputEvent)) {
                port.activate();
            }
        }
        /**
         * Gets the input data port's value from the specified port's name.
         * @protected
         * @param {string} portName - The data port's name.
         * @returns {*} The port's value.
         */
        getInputDataPortValue(portName) {
            const port = this.getDataPortByName(portName);
            return port !== undefined && port.model.getType() === Enums.EDataPortType.eInput ? port.getValue() : undefined;
        }
        /**
         * Gets the input data port's value type from the specified port's name.
         * @public
         * @param {string} portName - The data port's name.
         * @returns {string} The data port's value type.
         */
        getInputDataPortValueType(portName) {
            const port = this.getDataPortByName(portName);
            return port !== undefined && port.model.getType() === Enums.EDataPortType.eInput ? port.getValueType() : undefined;
        }
        /**
         * Sets the output data port's value from the specified port's name.
         * @protected
         * @param {string} portName - The data port's name.
         * @param {*} value - The port's value;
         */
        setOutputDataPortValue(portName, value) {
            const port = this.getDataPortByName(portName);
            if (port !== undefined && port.model.getType() === Enums.EDataPortType.eOutput) {
                port.setValue(value);
            }
        }
        /**
         * Gets the local data port's value from the specified port's name.
         * @public
         * @param {string} portName - The data port's name.
         * @returns {*} The port's value.
         */
        getLocalDataPortValue(portName) {
            const port = this.getDataPortByName(portName);
            return port !== undefined && port.model.getType() === Enums.EDataPortType.eLocal ? port.getValue() : undefined;
        }
        /**
         * Sets the local data port's value from the specified port's name.
         * @public
         * @param {string} portName - The data port's name.
         * @param {*} value - The port's value;
         */
        setLocalDataPortValue(portName, value) {
            const port = this.getDataPortByName(portName);
            if (port !== undefined && port.model.getType() === Enums.EDataPortType.eLocal) {
                port.setValue(value);
            }
        }
        /**
         * Gets the setting's value from the specified setting's name.
         * @protected
         * @param {string} settingName - The setting's name.
         * @returns {*} The setting's value.
         */
        getSettingValue(settingName) {
            const setting = this.getSettingByName(settingName);
            return setting !== undefined ? setting.getValue() : undefined;
        }
        /**
         * Gets the node.
         * @protected
         * @returns {INode} The node.
         */
        getNode() {
            if (this.node === undefined && this.parent !== undefined) {
                this.node = this.parent.getNode();
            }
            return this.node;
        }
        /**
         * Gets the nodeId.
         * @protected
         * @param {string} [pool] - The pool used for select if nodeId selector is undefined.
         * @returns {INodeId} The nodeId.
         */
        getNodeId(pool) {
            if (this.nodeId === undefined) {
                const nodeIdSelector = this.model.getNodeIdSelector();
                if (nodeIdSelector !== undefined) {
                    this.nodeId = this.parent.getNodeIdFromSelector(nodeIdSelector);
                }
                else if (typeof pool === 'string') {
                    this.nodeId = this.parent.getNodeIdFromPool(pool);
                }
            }
            return this.nodeId;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                  _______ _______    _____ ____   ____ _    _________ ________                  //
        //                 |_   __ \_   __ \  |_   _|_  _| |_  _/ \  |  _   _  |_   __  |                 //
        //                   | |__) || |__) |   | |   \ \   / // _ \ |_/ | | \_| | |_ \_|                 //
        //                   |  ___/ |  __ /    | |    \ \ / // ___ \    | |     |  _| _                  //
        //                  _| |_   _| |  \ \_ _| |_    \ ' // /   \ \_ _| |_   _| |__/ |                 //
        //                 |_____| |____| |___|_____|    \_/____| |____|_____| |________|                 //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Prints a message.
         * @public
         * @param {EP.ESeverity} severity - The print severity.
         * @param {...*} content - The content to be printed.
         */
        print(severity, ...content) {
            const event = new ExecutionEvents.PrintEvent();
            event.path = this.model.toPath();
            event.severity = severity;
            event.content = content;
            EventServices.dispatchEvent(event);
        }
        /**
         * Sends a notification.
         * @public
         * @param {EP.ESeverity} severity - The severity notification.
         * @param {string} title - The title notification.
         * @param {string} message - The message notification.
         */
        // eslint-disable-next-line class-methods-use-this
        notify(severity, title, message) {
            const event = new ExecutionEvents.NotifyEvent();
            event.severity = severity;
            event.title = title;
            event.message = message;
            EventServices.dispatchEvent(event);
        }
        /**
         * @private
         */
        buildFromBlockModel() {
            const dataPortsModel = this.model.getDataPorts();
            for (let dp = 0; dp < dataPortsModel.length; dp++) {
                this.createDataPortPlay(dataPortsModel[dp]);
            }
            const controlPortsModel = this.model.getControlPorts();
            for (let cp = 0; cp < controlPortsModel.length; cp++) {
                this.createControlPortPlay(controlPortsModel[cp]);
            }
            const settingsModel = this.model.getSettings();
            for (let s = 0; s < settingsModel.length; s++) {
                this.createSettingPlay(settingsModel[s]);
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
         * Creates the execution control port.
         * @private
         * @param {ControlPort} controlPortModel - The control port model.
         */
        createControlPortPlay(controlPortModel) {
            const controlPort = new ExecutionControlPort(controlPortModel, this);
            this.controlPorts.push(controlPort);
            this.controlPortsByName[controlPortModel.name] = controlPort;
        }
        /**
         * Creates the execution settings.
         * @private
         * @param {Setting} settingModel - The setting model.
         */
        createSettingPlay(settingModel) {
            this.settings.push(settingModel);
            this.settingsByName[settingModel.name] = settingModel;
        }
        /**
         * Constructs JSON from local data port, input control port, input data port and the model block.
         * @private
         * @param {IJSONExecutionBlock} oJSONExecutionBlock - The JSON execution block.
         */
        inputsToJSON(oJSONExecutionBlock) {
            this.model.toJSON(oJSONExecutionBlock);
            for (let cp = 0; cp < oJSONExecutionBlock.controlPorts.length; cp++) {
                const oJSONControlPort = oJSONExecutionBlock.controlPorts[cp];
                if (oJSONControlPort.portType === Enums.EControlPortType.eInput) {
                    oJSONControlPort.isActive = this.isInputControlPortActivated(oJSONControlPort.name);
                }
            }
            for (let dp = 0; dp < oJSONExecutionBlock.dataPorts.length; dp++) {
                const oJSONDataPort = oJSONExecutionBlock.dataPorts[dp];
                const dataPort = this.getDataPortByName(oJSONDataPort.name);
                if (dataPort !== undefined &&
                    (oJSONDataPort.portType === Enums.EDataPortType.eInput ||
                        oJSONDataPort.portType === Enums.EDataPortType.eInputExternal ||
                        oJSONDataPort.portType === Enums.EDataPortType.eLocal)) {
                    oJSONDataPort.executionValue = dataPort.getValue();
                }
            }
            oJSONExecutionBlock.data = this.data;
        }
        /**
         * Replaces outputs and local values of the execution block from JSON.
         * @private
         * @param {IJSONExecutionBlock} iJSONExecutionBlock - The JSON execution block.
         */
        outputsFromJSON(iJSONExecutionBlock) {
            for (let cp = 0; cp < iJSONExecutionBlock.controlPorts.length; cp++) {
                const iJSONControlPort = iJSONExecutionBlock.controlPorts[cp];
                if (iJSONControlPort.isActive && iJSONControlPort.portType === Enums.EControlPortType.eOutput) {
                    this.activateOutputControlPort(iJSONControlPort.name);
                }
            }
            const TypeLibrarySingleton = require('DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary');
            for (let dp = 0; dp < iJSONExecutionBlock.dataPorts.length; dp++) {
                const iJSONDataPort = iJSONExecutionBlock.dataPorts[dp];
                const dataPort = this.getDataPortByName(iJSONDataPort.name);
                if (dataPort !== undefined && (iJSONDataPort.portType === Enums.EDataPortType.eOutput || iJSONDataPort.portType === Enums.EDataPortType.eLocal)) {
                    const executionValue = TypeLibrarySingleton.getValueFromJSONValue(this.model.getGraphContext(), iJSONDataPort.executionValue, iJSONDataPort.valueType);
                    dataPort.setValue(executionValue);
                }
            }
            this.data = iJSONExecutionBlock.data;
        }
        /**
         * Checks if the block is currently executing.
         * @private
         * @returns {boolean} True if it is executing else false.
         */
        isExecuting() {
            let result = this.executionResult === Enums.EExecutionResult.eExecutionWorker;
            result = result || this.executionResult === Enums.EExecutionResult.eExecutionPending;
            return result;
        }
        /**
         * The callback of the execution block.
         * @private
         * @param {IRunParameters} runParams - The run parameters.
         * @returns {EP.EExecutionResult} The block execution result.
         */
        onExecute(runParams) {
            return this.model.execute.call(this, runParams);
        }
        /**
         * Checks whether the block can be executed on worker.
         * @private
         * @returns {boolean} True if the block can be executed onworker else false.
         */
        couldBeExecuteOnWorker() {
            return typeof Worker !== 'undefined' &&
                WorkerManager.workerActivated &&
                this.parent !== undefined &&
                this.parent.getModules() !== undefined;
        }
        /**
         * Activates the execution of the current block on worker if possible.
         * @public
         * @returns {boolean} True if the activation could be performed else false.
         */
        activateWorker() {
            if (this.couldBeExecuteOnWorker()) {
                this.executeOnWorker = true;
            }
            else {
                this.executeOnWorker = false;
            }
            return this.executeOnWorker;
        }
        /**
         * Executes the block.
         * @private
         * @param {IRunParameters} runParams - The run parameters.
         * @returns {EP.EExecutionResult} The block execution result.
         */
        execute(runParams) {
            let result;
            if (!this.isExecuting()) {
                this.executeOnWorker = false;
                this.model.onPreExecute.call(this);
            }
            if (this.executeOnWorker) {
                result = WorkerManager.executeBlock(this, runParams);
            }
            else {
                let errorStack, errorMessage;
                try {
                    result = this.onExecute(runParams);
                }
                catch (err) {
                    if (err instanceof Error) {
                        result = Enums.EExecutionResult.eExecutionError;
                        errorStack = err.stack;
                        errorMessage = err.message;
                    }
                }
                this.trace(result, errorStack, errorMessage);
            }
            if (!this.isExecuting()) {
                this.model.onPostExecute.call(this);
            }
            this.executionResult = result;
            return result;
        }
        /**
         * Gets the trace mode state.
         * @private
         * @returns {FTraceEvent} The trace mode state.
         */
        getTraceMode() {
            if (this.traceMode === undefined && this.parent !== undefined) {
                this.traceMode = this.parent.getTraceMode();
            }
            return this.traceMode;
        }
        /**
         * Traces the block.
         * @private
         * @param {EExecutionResult} executionResult - The block execution result.
         * @param {string} [errorStack] - The block execution error stack.
         * @param {string} [errorMessage] - The block execution error message.
         */
        trace(executionResult, errorStack, errorMessage) {
            if (this.getTraceMode() & ExecutionEnums.FTraceEvent.fBlock) {
                const event = new ExecutionEvents.TraceBlockEvent();
                event.path = this.model.toPath();
                event.executionResult = executionResult;
                event.errorStack = errorStack;
                event.errorMessage = errorMessage;
                EventServices.dispatchEvent(event);
            }
        }
        /**
         * Gets the control ports from the specified port's type.
         * If no port's type is specified then all control ports will be retrieved.
         * @public
         * @param {EP.EControlPortType} [portType] - The control port's type.
         * @returns {ExecutionControlPort[]} The control ports.
         */
        getControlPorts(portType) {
            let controlPorts;
            if (portType === undefined) {
                controlPorts = this.controlPorts.slice(0);
            }
            else {
                controlPorts = this.controlPorts.filter(controlPort => controlPort.model.type === portType);
            }
            return controlPorts;
        }
        /**
         * Gets the data ports from the specified port's types.
         * If no port's type is specified then all data ports will be retrieved.
         * @public
         * @param {Enums.EDataPortType | Enums.EDataPortType[]} [portTypes] - The data port's types.
         * @returns {ExecutionDataPort[]} The data ports.
         */
        getDataPorts(portTypes) {
            let dataPorts;
            if (portTypes === undefined) {
                dataPorts = this.dataPorts.slice(0);
            }
            else if (Array.isArray(portTypes)) {
                dataPorts = this.dataPorts.filter(dataPort => portTypes.includes(dataPort.model.type));
            }
            else {
                dataPorts = this.dataPorts.filter(dataPort => dataPort.model.type === portTypes);
            }
            return dataPorts;
        }
        /**
         * Gets the block settings.
         * @public
         * @returns {Setting[]} The settings.
         */
        getSettings() {
            return this.settings.slice(0);
        }
        /**
         * Gets the block setting from the provided setting's name.
         * @public
         * @param {string} settingName - The setting's name.
         * @returns {Setting} The setting.
         */
        getSettingByName(settingName) {
            return this.settingsByName[settingName];
        }
        /**
         * Checks the specified output control port is activated.
         * @public
         * @param {string} portName - The control port's name.
         * @returns {boolean} True if the port is activated else false.
         */
        isOutputControlPortActivated(portName) {
            const port = this.getControlPortByName(portName);
            return port !== undefined && (port.model.getType() === Enums.EControlPortType.eOutput || port.model.getType() === Enums.EControlPortType.eOutputEvent) ? port.isActive() : false;
        }
        /**
         * Activates the specified input control port.
         * @public
         * @param {string} portName - The control port's name.
         */
        activateInputControlPort(portName) {
            const port = this.getControlPortByName(portName);
            if (port !== undefined && (port.model.getType() === Enums.EControlPortType.eInput || port.model.getType() === Enums.EControlPortType.eInputEvent)) {
                port.activate();
            }
        }
        /**
         * Deactivates the specified output control port.
         * @public
         * @param {string} portName - The control port's name.
         */
        deactivateOutputControlPort(portName) {
            const port = this.getControlPortByName(portName);
            if (port !== undefined && (port.model.getType() === Enums.EControlPortType.eOutput || port.model.getType() === Enums.EControlPortType.eOutputEvent)) {
                port.deactivate();
            }
        }
        /**
         * Gets the output data port's value from the specified port's name.
         * @public
         * @param {string} portName - The data port's name.
         * @returns {*} The port's value.
         */
        getOutputDataPortValue(portName) {
            const port = this.getDataPortByName(portName);
            return port !== undefined && port.model.getType() === Enums.EDataPortType.eOutput ? port.getValue() : undefined;
        }
        /**
         * Sets the input data port's value type from the specified port's name.
         * @public
         * @param {string} portName - The data port's name.
         * @param {string} valueType - The data port's value type.
         * @returns {boolean} True if the data port's value type has been set else false.
         */
        setInputDataPortValueType(portName, valueType) {
            const port = this.getDataPortByName(portName);
            return port !== undefined && port.model.getType() === Enums.EDataPortType.eInput ? port.model.setValueType(valueType) : false;
        }
        /**
         * Gets the output data port's value type from the specified port's name.
         * @public
         * @param {string} portName - The data port's name.
         * @returns {string} The data port's value type.
         */
        getOutputDataPortValueType(portName) {
            const port = this.getDataPortByName(portName);
            return port !== undefined && port.model.getType() === Enums.EDataPortType.eOutput ? port.getValueType() : undefined;
        }
        /**
         * Sets the input data port's value from the specified port's name.
         * @public
         * @param {string} portName - The data port's name.
         * @param {*} value - The port's value;
         */
        setInputDataPortValue(portName, value) {
            const port = this.getDataPortByName(portName);
            if (port !== undefined && port.model.getType() === Enums.EDataPortType.eInput) {
                port.setValue(value);
            }
        }
        /**
         * Gets the input control port event.
         * @public
         * @param {string} portName - The control port's name.
         * @return {EPEvent} The event.
         */
        getInputControlPortEvent(portName) {
            const port = this.getControlPortByName(portName);
            return port !== undefined && port.model.getType() === Enums.EControlPortType.eInputEvent ? port.getEvent() : undefined;
        }
        /**
         * Sets the input control port event.
         * @public
         * @param {string} portName - The control port's name.
         * @param {EPEvent} event - The event.
         */
        setInputControlPortEvent(portName, event) {
            const port = this.getControlPortByName(portName);
            if (port !== undefined && port.model.getType() === Enums.EControlPortType.eInputEvent) {
                port.setEvent(event);
            }
        }
        /**
         * Sets the output control port event.
         * @public
         * @param {string} portName - The control port's name.
         * @param {EPEvent} event - The event.
         */
        setOutputControlPortEvent(portName, event) {
            const port = this.getControlPortByName(portName);
            if (port !== undefined && port.model.getType() === Enums.EControlPortType.eOutputEvent) {
                port.setEvent(event);
            }
        }
        /**
         * Gets the list of the block activated input control port.
         * @protected
         * @returns {ExecutionControlPort[]} The list of activated input control port.
         */
        getActivatedInputControlPorts() {
            const ports = [];
            const inputControlPorts = this.getControlPorts(Enums.EControlPortType.eInput).concat(this.getControlPorts(Enums.EControlPortType.eInputEvent));
            for (let i = 0; i < inputControlPorts.length; i++) {
                const port = inputControlPorts[i];
                if (port.isActive()) {
                    ports.push(port);
                }
            }
            return ports;
        }
        /**
         * Gets the list of the block activated output control port.
         * @public
         * @returns {ExecutionControlPort[]} The list of activated output control port.
         */
        getActivatedOutputControlPorts() {
            const ports = [];
            const outputControlPorts = this.getControlPorts(Enums.EControlPortType.eOutput).concat(this.getControlPorts(Enums.EControlPortType.eOutputEvent));
            for (let i = 0; i < outputControlPorts.length; i++) {
                const port = outputControlPorts[i];
                if (port.isActive()) {
                    ports.push(port);
                }
            }
            return ports;
        }
        /**
         * Deactivates the block input control ports.
         * @public
         */
        deactivateInputControlPorts() {
            const inputControlPorts = this.getControlPorts(Enums.EControlPortType.eInput).concat(this.getControlPorts(Enums.EControlPortType.eInputEvent));
            for (let i = 0; i < inputControlPorts.length; i++) {
                inputControlPorts[i].deactivate();
            }
        }
    }
    return ExecutionBlock;
});
