/// <amd-module name='DS/CSIExecutionGraphUI/controllers/CSIEGUIExecutionEventController'/>
define("DS/CSIExecutionGraphUI/controllers/CSIEGUIExecutionEventController", ["require", "exports", "DS/CSIExecutionGraphUI/tools/CSIEGUITools", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphContainerBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayConcatBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayGetBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayGetIndexBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayInsertBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayLengthBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayPopBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayPushBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayRemoveBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArraySetBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayShiftBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayUnshiftBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSAddBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSDivideBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSIsEqualBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSMultiplyBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSSetValueBlock", "DS/EPSSchematicsCoreLibrary/calculator/EPSSubstractBlock", "DS/EPSSchematicsCoreLibrary/flow/EPSIfBlock", "DS/EPSSchematicsCoreLibrary/flow/EPSOnlyOneBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSIExport", "DS/EPSSchematicsCSI/EPSSchematicsCSIIntrospection"], function (require, exports, CSIEGUITools, EventServices, ExecutionEvents, ExecutionEnums, Tools, ModelEnums, GraphContainerBlock, ArrayConcatBlock, ArrayGetBlock, ArrayGetIndexBlock, ArrayInsertBlock, ArrayLengthBlock, ArrayPopBlock, ArrayPushBlock, ArrayRemoveBlock, ArraySetBlock, ArrayShiftBlock, ArrayUnshiftBlock, AddBlock, DivideBlock, IsEqualBlock, MultiplyBlock, SetValueBlock, SubstractBlock, IfBlock, OnlyOneBlock, CSIExport, CSIIntrospection) {
    "use strict";
    /**
     * This class defines the CSI Execution Graph UI execution event controller.
     * @private
     * @class CSIEGUIExecutionEventController
     * @alias module:DS/CSIExecutionGraphUI/controllers/CSIEGUIExecutionEventController
     */
    class CSIEGUIExecutionEventController {
        /**
         * @public
         * @constructor
         * @param {CSIExecutionGraphUIEditor} editor - The CSI Execution Graph UI editor.
         */
        constructor(editor) {
            this._pendingBlocks = {};
            this._connectionStatesBySelector = {};
            this._connectionStatesByPool = {};
            this._editor = editor;
        }
        /**
         * Removes the controller.
         * @public
         */
        remove() {
            this._editor = undefined;
            this._pendingBlocks = undefined;
            this._debugId = undefined;
            this._connectionStatesBySelector = undefined;
            this._connectionStatesByPool = undefined;
        }
        /**
         * Clears the controller.
         * @public
         */
        clear() {
            this._pendingBlocks = {};
            this._debugId = undefined;
            this._connectionStatesBySelector = {};
            this._connectionStatesByPool = {};
        }
        /**
         * Gets the debugId.
         * @public
         * @returns {number|undefined} The debugId.
         */
        getDebugId() {
            return this._debugId;
        }
        /**
         * Handles debug event.
         * @public
         * @param {Parameters} parameters - The debug event parameters.
         */
        debugEvent(parameters) {
            const portParam = parameters.readParameters('port', 'Parameters');
            const port = portParam.readString('name');
            const subPort = port.split('.')[1];
            const block = portParam.readString('block');
            const dataParam = parameters.readParameters('data', 'Parameters');
            if (subPort === 'id' && block === Tools.rootPath) { // We only need root debugId for the moment
                this._debugId = dataParam.readUint32('debugId');
            }
            else if (subPort === 'break') {
                this._breakEvent(dataParam);
            }
            else if (subPort === 'unbreak') {
                this._unbreakEvent(dataParam);
            }
            else if (subPort === 'info') {
                this.debugEvent(dataParam);
            }
            else if (subPort === 'progress') {
                this._progressEvent(dataParam);
            }
            else if (subPort === 'blockState') {
                this._blockStateEvent(dataParam);
            }
            else if (subPort === 'connectionState') {
                this._connectionStateEvent(dataParam);
            }
        }
        /**
         * Computes the trace data port events to send for the root graph.
         * @public
         * @param {string} portName - The name of the data port.
         * @param {object} data - The sub data port structure.
         */
        executionGraphDataEvent(portName, data) {
            this._executionDataEvent(Tools.rootPath, portName, data);
        }
        /**
         * Sends a trace stop event.
         * @public
         */
        // eslint-disable-next-line class-methods-use-this
        traceStop() {
            EventServices.dispatchEvent(new ExecutionEvents.TraceStopEvent());
        }
        /**
         * Handles break event.
         * @private
         * @param {Parameters} parameters - The break event parameters.
         */
        _breakEvent(parameters) {
            const breakPortParam = parameters.readParameters('port', 'Parameters');
            const breakPort = breakPortParam.readString('name');
            const breakBlock = breakPortParam.readString('block').replace(/\//g, '.');
            const breakDataParam = parameters.readParameters('data', 'Parameters');
            const breakData = breakDataParam !== undefined ? breakDataParam.toJSObject() : {};
            const debugBreakEvent = new ExecutionEvents.DebugBreakEvent();
            debugBreakEvent.path = Tools.rootPath + '.' + breakBlock;
            EventServices.dispatchEvent(debugBreakEvent);
            if (breakData !== undefined) {
                if (breakData.call !== undefined) {
                    this._executionDataEvent(breakBlock, breakPort, breakData.call);
                    this._executionDataEvent(breakBlock, 'nodeIdSelector', breakData.nodeIdSelector || {});
                }
                else {
                    this._executionDataEvent(breakBlock, breakPort, breakData);
                }
            }
        }
        /**
         * Handles unbreak event.
         * @private
         * @param {Parameters} parameters - The unbreak event parameters.
         */
        // eslint-disable-next-line class-methods-use-this
        _unbreakEvent(parameters) {
            const unbreakPortParam = parameters.readParameters('port', 'Parameters');
            const unbreakBlock = unbreakPortParam.readString('block').replace(/\//g, '.');
            const debugUnbreakEvent = new ExecutionEvents.DebugUnbreakEvent();
            debugUnbreakEvent.path = Tools.rootPath + '.' + unbreakBlock;
            EventServices.dispatchEvent(debugUnbreakEvent);
        }
        /**
         * Handles block state event.
         * @private
         * @param {Parameters} parameters - The block state event parameters.
         */
        _blockStateEvent(parameters) {
            const blockStatePortParam = parameters.readParameters('port', 'Parameters');
            const blockStatePortName = blockStatePortParam.readString('name');
            const blockState = blockStatePortName.split('.')[1];
            const blockId = blockStatePortParam.readString('block');
            const blockPath = Tools.rootPath + '.' + blockId.replace(/\//g, '.');
            let alreadyConnected = false;
            if (blockState === 'calling') {
                const blockStateDataParam = parameters.readParameters('data', 'Parameters');
                const selector = blockStateDataParam.readString('selector');
                if (selector === '_') {
                    alreadyConnected = true;
                }
                else {
                    const instance = blockStateDataParam.readUint32('instance');
                    const graphModel = this._editor.getGraphModel();
                    const blockModel = blockPath === Tools.rootPath ? graphModel : graphModel.getObjectFromPath(blockPath);
                    const graphPath = blockModel.graph.toPath();
                    const pool = CSIIntrospection.getFunctionPool(blockModel.getUid()) || 'CSIExecutionGraph';
                    const connectionState = this._getConnectionState(graphPath, selector, pool, instance);
                    if (!connectionState?.override) {
                        this._executionDataEvent(blockId, 'nodeIdSelector', {});
                    }
                    connectionState?.blockPaths.push(blockPath);
                    alreadyConnected = connectionState?.status === 'connected';
                }
            }
            if (blockState !== 'calling' || alreadyConnected) {
                const debugBlockEvent = new ExecutionEvents.DebugBlockEvent();
                debugBlockEvent.path = blockPath;
                switch (blockState) {
                    case 'pending':
                        {
                            debugBlockEvent.state = ExecutionEnums.EBlockState.ePending;
                            break;
                        }
                    case 'connecting':
                        {
                            debugBlockEvent.state = ExecutionEnums.EBlockState.eConnecting;
                            break;
                        }
                    case 'calling':
                        {
                            debugBlockEvent.state = ExecutionEnums.EBlockState.eExecuting;
                            break;
                        }
                    case 'terminated':
                        {
                            debugBlockEvent.state = ExecutionEnums.EBlockState.eTerminated;
                            break;
                        }
                }
                EventServices.dispatchEvent(debugBlockEvent);
            }
        }
        /**
         * Gets connection state.
         * @private
         * @param {string} graphPath - The connection state graph path.
         * @param {string} selector - The connection state selector.
         * @param {string} pool - The connection state pool.
         * @param {number} instance - The connection state instance.
         * @returns {IConnectionState|undefined} The connection state.
         */
        _getConnectionState(graphPath, selector, pool, instance) {
            let connectionState;
            if (selector !== '_') {
                let connectionStates;
                if (selector !== '') {
                    const graphSelector = graphPath + '.' + selector;
                    connectionStates = this._connectionStatesBySelector[graphSelector];
                    if (connectionStates === undefined) {
                        connectionStates = [];
                        this._connectionStatesBySelector[graphSelector] = connectionStates;
                    }
                }
                else {
                    const graphPool = graphPath + '.' + pool;
                    connectionStates = this._connectionStatesByPool[graphPool];
                    if (connectionStates === undefined) {
                        connectionStates = [];
                        this._connectionStatesByPool[graphPool] = connectionStates;
                    }
                }
                connectionState = connectionStates[instance];
                if (connectionState === undefined) {
                    connectionState = {
                        status: '',
                        blockPaths: []
                    };
                    connectionStates[instance] = connectionState;
                }
            }
            return connectionState;
        }
        /**
         * Handles connection state event.
         * @private
         * @param {Parameters} parameters - The connection state event parameters.
         */
        _connectionStateEvent(parameters) {
            const connectionStatePortParam = parameters.readParameters('port', 'Parameters');
            const graphId = connectionStatePortParam.readString('block');
            const isRootGraph = graphId === Tools.rootPath;
            const graphPath = isRootGraph ? graphId : Tools.rootPath + '.' + graphId.replace(/\//g, '.');
            const connectionStateDataParam = parameters.readParameters('data', 'Parameters');
            const selector = connectionStateDataParam.readString('selector');
            if (selector !== '_') {
                const pool = connectionStateDataParam.readString('pool');
                const instance = connectionStateDataParam.readUint32('instance');
                const status = connectionStateDataParam.readString('status');
                const connectionState = this._getConnectionState(graphPath, selector, pool, instance);
                if (connectionState) {
                    connectionState.status = status;
                    if (status === 'pending') {
                        if (connectionStateDataParam.exists('block')) {
                            connectionState.override = true;
                            const block = connectionStateDataParam.readString('block');
                            const override = connectionStateDataParam.readParameters('override', 'Parameters');
                            this._executionDataEvent(block, 'nodeIdSelector', override.toJSObject());
                        }
                    }
                    else if (status === 'connected') {
                        connectionState.blockPaths.forEach(blockPath => {
                            const debugBlockEvent = new ExecutionEvents.DebugBlockEvent();
                            debugBlockEvent.path = blockPath;
                            debugBlockEvent.state = ExecutionEnums.EBlockState.eExecuting;
                            EventServices.dispatchEvent(debugBlockEvent);
                        });
                    }
                }
            }
        }
        /**
         * Computes the trace data port events to send.
         * @private
         * @param {string} blockId - The id of the block.
         * @param {string} portName - The name of the data port.
         * @param {object} data - The sub data port structure.
         */
        _executionDataEvent(blockId, portName, data) {
            const graphModel = this._editor && this._editor.getGraphModel();
            if (graphModel !== undefined) {
                const blockPath = Tools.rootPath + '.' + blockId.replace(/\//g, '.');
                const blockModel = blockId === Tools.rootPath ? graphModel : graphModel.getObjectFromPath(blockPath);
                const blockCtrs = [GraphContainerBlock, IfBlock, IsEqualBlock, SetValueBlock, OnlyOneBlock,
                    ArrayConcatBlock, ArrayGetBlock, ArrayGetIndexBlock, ArrayInsertBlock, ArrayLengthBlock, ArrayPopBlock,
                    ArrayPushBlock, ArrayRemoveBlock, ArraySetBlock, ArrayShiftBlock, ArrayUnshiftBlock,
                    AddBlock, DivideBlock, MultiplyBlock, SubstractBlock];
                if (CSIEGUITools.isInstanceOf(blockModel, blockCtrs)) {
                    Object.keys(data).forEach(subDataPortName => {
                        const subDataPortValue = data[subDataPortName];
                        const subDataPortModel = blockModel.getDataPortByName(subDataPortName) || blockModel.getDataPortByName(subDataPortName.charAt(0).toUpperCase() + subDataPortName.slice(1));
                        if (subDataPortModel && subDataPortValue !== undefined) {
                            CSIEGUIExecutionEventController._recTraceDataPortEvent(blockModel, subDataPortModel, subDataPortValue, portName + '.');
                            CSIEGUIExecutionEventController._traceDataPortEvent(subDataPortModel, subDataPortValue);
                        }
                    });
                }
                else {
                    const dataPortModel = blockModel.getDataPortByName(portName) || blockModel.getDataPortByName(portName.charAt(0).toUpperCase() + portName.slice(1));
                    if (dataPortModel && data !== undefined) {
                        CSIEGUIExecutionEventController._recTraceDataPortEvent(blockModel, dataPortModel, data, portName + '.');
                        CSIEGUIExecutionEventController._traceDataPortEvent(dataPortModel, data);
                    }
                }
            }
        }
        /**
         * Sends a trace data port event for each sub data port.
         * @private
         * @static
         * @param {Block} blockModel - The block model.
         * @param {DataPort} dataPortModel - The data port model.
         * @param {object} data - The sub data port structure.
         * @param {string} path - The path of the data port.
         */
        static _recTraceDataPortEvent(blockModel, dataPortModel, data, path) {
            if (dataPortModel && typeof data === 'object') {
                Object.keys(data).forEach(subDataPortName => {
                    const subDataPortValue = data[subDataPortName];
                    if (subDataPortValue !== undefined) {
                        const subDataPortModel = dataPortModel.getDataPortByName(subDataPortName) || blockModel.getDataPortByName(path + subDataPortName);
                        const subDataPortPath = path + subDataPortName + '.';
                        if (subDataPortModel) {
                            this._recTraceDataPortEvent(blockModel, subDataPortModel, subDataPortValue, subDataPortPath);
                            if (subDataPortModel.getDataLinks().length > 0) {
                                this._traceDataPortEvent(subDataPortModel, subDataPortValue);
                            }
                        }
                        else {
                            this._recTraceDataPortEvent(blockModel, dataPortModel, subDataPortValue, subDataPortPath);
                        }
                    }
                });
            }
        }
        /**
         * Sends a trace data port event with the associated trace data link events.
         * @private
         * @static
         * @param {DataPort} dataPortModel - The data port model.
         * @param {*} value - The data port value.
         */
        static _traceDataPortEvent(dataPortModel, value) {
            const event = new ExecutionEvents.TraceDataPortEvent();
            event.path = dataPortModel.toPath();
            event.value = value;
            event.valueType = dataPortModel.getValueType();
            EventServices.dispatchEvent(event);
            dataPortModel.getDataLinks().forEach(dataLink => {
                const eventLink = new ExecutionEvents.TraceDataLinkEvent();
                eventLink.path = dataLink.toPath();
                EventServices.dispatchEvent(eventLink);
            });
        }
        /**
         * Dispatches the trace block event.
         * @private
         * @static
         * @param {TraceBlockEvent} traceBlockEvent - The trace block event to dispatch.
         * @param {string} path - The path of the block in the CSI map.
         * @returns {boolean} True if the event has been dispatched else false.
         */
        static _dispatchTraceBlockEvent(traceBlockEvent, path) {
            let result = false;
            if (traceBlockEvent) {
                EventServices.dispatchEvent(traceBlockEvent);
                if (!traceBlockEvent.errorStack) {
                    const portPaths = CSIExport.mapCSItoSchematics[path] || [];
                    portPaths.forEach(portPath => {
                        const eventPort = new ExecutionEvents.TracePortEvent();
                        eventPort.path = portPath;
                        EventServices.dispatchEvent(eventPort);
                    });
                    const linkPaths = CSIExport.mapSchematicsLinks[path] || [];
                    linkPaths.forEach(linkPath => {
                        const eventLink = new ExecutionEvents.TraceLinkEvent();
                        eventLink.path = linkPath;
                        EventServices.dispatchEvent(eventLink);
                    });
                }
            }
            return result;
        }
        /**
         * Handles progress event.
         * @private
         * @param {Parameters} parameters - The progress event parameters.
         */
        _progressEvent(parameters) {
            let blockId = Tools.rootPath;
            let port = 'progress';
            let data = parameters.toJSObject();
            if (parameters.exists('port')) {
                const portParam = parameters.readParameters('port', 'Parameters');
                const dataParam = parameters.readParameters('data', 'Parameters');
                data = dataParam?.toJSObject() || {};
                blockId = portParam.readString('block');
                port = portParam.readString('name');
            }
            const path = blockId + '.' + port;
            const isRootGraph = blockId === Tools.rootPath;
            const blockPath = Tools.rootPath + '.' + blockId.replace(/\//g, '.');
            const graphModel = this._editor.getGraphModel();
            const blockModel = (graphModel ? (isRootGraph ? graphModel : graphModel.getObjectFromPath(blockPath)) : undefined);
            if (path && blockId && port) {
                let traceBlockEvent = new ExecutionEvents.TraceBlockEvent();
                traceBlockEvent.path = blockPath;
                if (isRootGraph) {
                    traceBlockEvent.path = blockId;
                    if (port.startsWith('call')) {
                        EventServices.dispatchEvent(new ExecutionEvents.TraceStopEvent());
                        EventServices.dispatchEvent(new ExecutionEvents.TraceStartEvent());
                    }
                }
                if (!isRootGraph || port.startsWith('call')) { // already done by client for success/error/progress
                    this._executionDataEvent(blockId, port, data);
                }
                if (port.startsWith('call')) {
                    traceBlockEvent.executionResult = ModelEnums.EExecutionResult.eExecutionPending;
                    const uid = blockModel.getUid();
                    if (this._pendingBlocks[blockId] && port === 'call' && uid !== CSIEGUITools.AndAndBlockUid && uid !== CSIEGUITools.OrOrBlockUid) {
                        this._pendingBlocks[blockId] += 1;
                    }
                    else {
                        this._pendingBlocks[blockId] = 1;
                    }
                }
                else if (port.startsWith('success')) {
                    if (this._pendingBlocks[blockId] === undefined || this._pendingBlocks[blockId] === 1) {
                        traceBlockEvent.executionResult = ModelEnums.EExecutionResult.eExecutionFinished;
                        this._pendingBlocks[blockId] = undefined;
                    }
                    else {
                        this._pendingBlocks[blockId] -= 1;
                        traceBlockEvent.executionResult = ModelEnums.EExecutionResult.eExecutionPending;
                    }
                }
                else if (port.startsWith('error')) {
                    if (parameters.exists('data') && parameters.readParameters('data', 'Parameters').getObjectType() === 'CSISystemError') {
                        traceBlockEvent.executionResult = ModelEnums.EExecutionResult.eExecutionError;
                        traceBlockEvent.errorStack = parameters.readString('description');
                    }
                    else if (this._pendingBlocks[blockId] === undefined || this._pendingBlocks[blockId] === 1) {
                        traceBlockEvent.executionResult = ModelEnums.EExecutionResult.eExecutionWarning;
                        if (blockModel instanceof IfBlock || blockModel instanceof IsEqualBlock) {
                            traceBlockEvent.executionResult = ModelEnums.EExecutionResult.eExecutionFinished;
                        }
                        this._pendingBlocks[blockId] = undefined;
                    }
                    else {
                        this._pendingBlocks[blockId] -= 1;
                        traceBlockEvent.executionResult = ModelEnums.EExecutionResult.eExecutionPending;
                    }
                }
                else if (!port.startsWith('progress')) {
                    traceBlockEvent = undefined;
                }
                CSIEGUIExecutionEventController._dispatchTraceBlockEvent(traceBlockEvent, path);
            }
        }
    }
    return CSIEGUIExecutionEventController;
});
