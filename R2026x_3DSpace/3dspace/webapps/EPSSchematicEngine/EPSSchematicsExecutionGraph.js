/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionGraph'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionGraph", ["require", "exports", "DS/EPSSchematicEngine/EPSSchematicsExecutionBlock", "DS/EPSSchematicEngine/EPSSchematicsExecutionScriptBlock", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicEngine/typings/ExperienceKernel/EPSSEExperienceKernel", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsScriptBlock", "DS/EPSSchematicEngine/EPSSchematicsExecutionDataLink", "DS/EPSSchematicEngine/EPSSchematicsExecutionControlLink", "DS/EPSSchematicEngine/EPSSchematicsExecutionControlLinkContext", "DS/EPSSchematicEngine/EPSSchematicsExecutionDataPort", "DS/EPSSchematicEngine/EPSSchematicsExecutionControlPort", "DS/EPSSchematicsModelWeb/EPSSchematicsTemplateGraphBlock"], function (require, exports, ExecutionBlock, ExecutionScriptBlock, EventServices, Enums, TypeLibrary, ExecutionEvents, Tools, EK, GraphBlock, ScriptBlock, ExecutionDataLink, ExecutionControlLink, ExecutionControlLinkContext, ExecutionDataPort, ExecutionControlPort, TemplateGraphBlock) {
    "use strict";
    var EDebugRequest;
    (function (EDebugRequest) {
        EDebugRequest[EDebugRequest["eContinue"] = 0] = "eContinue";
        EDebugRequest[EDebugRequest["eBreakAll"] = 1] = "eBreakAll";
        EDebugRequest[EDebugRequest["eStepOver"] = 2] = "eStepOver";
        EDebugRequest[EDebugRequest["eStepInto"] = 3] = "eStepInto";
    })(EDebugRequest || (EDebugRequest = {}));
    /**
     * This class defines a schematics execution graph.
     * @class ExecutionGraph
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionGraph
     * @private
     */
    class ExecutionGraph extends ExecutionBlock {
        static { this.kMaximumExecutedBlocks = 1024; }
        /**
         * @constructor
         * @param {GraphBlock} model - The graph block model.
         * @param {ExecutionGraph} parent - The parent execution block.
         * @param {string} version - The JSON graph version.
         * @param {string[]} [modules] - The modules to be load by workers.
         * @param {INode} [node] - The node to be used by graph.
         * @param {INodeId} [nodeId] - The nodeId to be used by graph.
         * @param {boolean} [breakOnStart] - Request to break before executing first block.
         * @param {IBreakpoint[]} [breakpoints] - Breakpoints.
         */
        constructor(model, parent, version, modules, node, nodeId, breakOnStart, breakpoints) {
            super(model, parent);
            this.blocks = [];
            this.dataLinks = [];
            this.controlLinks = [];
            this.waitingCursors = [];
            this.nodeIdsBySelector = {};
            this.nodeIds = [];
            this._onEventCB = this.onEvent.bind(this);
            this.version = version;
            this.modules = modules;
            this.node = node;
            this.nodeId = nodeId;
            this.debugRequest = breakOnStart ? EDebugRequest.eBreakAll : EDebugRequest.eContinue;
            this.updateBreakpoints(breakpoints || []);
            this.buildFromGraphModel();
        }
        /**
         * Creates the execution graph instance from the specified json graph and
         * the wanted input/output data overrides.
         * @public
         * @static
         * @param {string|IJSONGraph} json - The JSON string or object representing the graph
         * @param {string[]} [modules] - The modules to be load by workers.
         * @param {INode} [node] - The node to be used by graph.
         * @param {INodeId} [nodeId] - The nodeId to be used by graph.
         * @param {boolean} [breakOnStart] - Request to break before executing first block.
         * @param {IBreakpoint[]} [breakpoints] - Breakpoints.
         * @returns {ExecutionGraph} The execution graph instance.
         */
        static createExecutionGraph(json, modules, node, nodeId, breakOnStart, breakpoints) {
            let jsonGraph;
            // Parse the json
            if (typeof json === 'string') {
                jsonGraph = JSON.parse(json);
            }
            else if (typeof json === 'object') {
                jsonGraph = json;
            }
            else {
                throw new Error('Invalid JSON graph!');
            }
            // Get the json version
            const version = jsonGraph.version === undefined ? '0.0.0' : jsonGraph.version;
            // Create the execution graph
            const graphBlockModel = new GraphBlock();
            graphBlockModel.buildFromJSONObject(jsonGraph);
            const graph = new ExecutionGraph(graphBlockModel, undefined, version, modules, node, nodeId, breakOnStart, breakpoints);
            return graph;
        }
        /**
         * @private
         */
        buildFromGraphModel() {
            const blocksModel = this.model instanceof TemplateGraphBlock ? this.model.getBlocks(false) : this.model.getBlocks();
            for (let b = 0; b < blocksModel.length; b++) {
                this.createBlockPlay(blocksModel[b]);
            }
            const dataLinksModel = this.model instanceof TemplateGraphBlock ? this.model.getDataLinks(false) : this.model.getDataLinks();
            for (let dl = 0; dl < dataLinksModel.length; dl++) {
                this.createDataLinkPlay(dataLinksModel[dl]);
            }
            const controlLinksModel = this.model instanceof TemplateGraphBlock ? this.model.getControlLinks(false) : this.model.getControlLinks();
            for (let cl = 0; cl < controlLinksModel.length; cl++) {
                this.createControlLinkPlay(controlLinksModel[cl]);
            }
        }
        /**
         * Get object from path.
         * @private
         * @param {string} iPath - The object path.
         * @returns {ExecutionPort} - The object corresponding to the path.
         */
        getObjectFromPath(iPath) {
            const elements = iPath.replace(/\[/g, '.').replace(/\]/g, '').split('.');
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let object = this;
            for (let e = 1; e < elements.length; e++) {
                let property = elements[e];
                if (object instanceof ExecutionDataPort) {
                    property = elements.slice(e).join('.');
                    e = elements.length - 1;
                    object = object.dataPortsByName[property];
                }
                else {
                    object = object[property];
                }
            }
            return object;
        }
        /**
         * Creates an execution block.
         * @private
         * @param {Block} blockModel - The block model.
         */
        createBlockPlay(blockModel) {
            let block;
            if (blockModel instanceof GraphBlock) {
                block = new ExecutionGraph(blockModel, this, undefined, this.getModules(), this.getNode(), this.getNodeId(), false, this.breakpoints);
            }
            else if (blockModel instanceof ScriptBlock) {
                block = new ExecutionScriptBlock(blockModel, this);
            }
            else {
                block = new ExecutionBlock(blockModel, this);
            }
            this.blocks.push(block);
        }
        /**
         * Creates an execution data link.
         * @private
         * @param {DataLink} model - The data link model.
         */
        createDataLinkPlay(model) {
            const dataLink = new ExecutionDataLink(model, this);
            this.dataLinks.push(dataLink);
        }
        /**
         * Creates an execution control link.
         * @private
         * @param {ControlLink} model - The control link model.
         */
        createControlLinkPlay(model) {
            const controlLink = new ExecutionControlLink(model, this);
            this.controlLinks.push(controlLink);
        }
        /**
         * Subscribes event listeners for each graph input execution ports
         * declared as event ports.
         * @private
         */
        subscribeEventListeners() {
            const ports = this.getControlPorts(Enums.EControlPortType.eInputEvent);
            for (let p = 0; p < ports.length; p++) {
                const port = ports[p];
                const eventCtr = EventServices.getEventByType(port.model.getEventType());
                if (eventCtr !== undefined) {
                    EventServices.addListener(eventCtr, this._onEventCB);
                }
            }
        }
        /**
         * Unsubscribes event listeners for each graph input execution ports
         * declared as event ports.
         * @private
         */
        unsubscribeEventListeners() {
            const ports = this.getControlPorts(Enums.EControlPortType.eInputEvent);
            for (let p = 0; p < ports.length; p++) {
                const port = ports[p];
                const eventCtr = EventServices.getEventByType(port.model.getEventType());
                if (eventCtr !== undefined) {
                    EventServices.removeListener(eventCtr, this._onEventCB);
                }
            }
        }
        /**
         * The graph callback to subscribed events.
         * @private
         * @param {EPEvent} event - The subscribed event.
         */
        onEvent(event) {
            if (TypeLibrary.hasType(this.model.getGraphContext(), event.getType(), Enums.FTypeCategory.fEvent)) {
                const ports = this.getControlPorts(Enums.EControlPortType.eInputEvent).filter(controlPort => {
                    return event instanceof EventServices.getEventByType(controlPort.model.getEventType());
                });
                for (let p = 0; p < ports.length; p++) {
                    const port = ports[p];
                    port.setEvent(event);
                    port.activate(); // TODO: a ajouter dans le waitingcursor? surement probleme de stacking des valeur des events!
                }
            }
        }
        /**
         * Copies the each unique linked data port value into
         * each input data ports of the specified block.
         * @private
         * @static
         * @param {ExecutionBlock} block - The block to copy the input parameter values to.
         * @returns {boolean} True if each data link value are ready else false.
         */
        static copyInputDataLinkValues(block) {
            let result = true;
            const copyLinkValue = (dataPort) => {
                const dataLink = dataPort.getInputDataLinks()[0];
                const valued = dataLink === undefined || dataLink.startPort.isValued();
                if (valued && dataLink !== undefined) {
                    dataLink.copyDataLinkValue();
                }
                return valued;
            };
            const dataPorts = block.getDataPorts([Enums.EDataPortType.eInput, Enums.EDataPortType.eInputExternal]);
            for (let dp = 0; dp < dataPorts.length && result; dp++) {
                result = copyLinkValue(dataPorts[dp]);
                const subDataPorts = dataPorts[dp].dataPorts;
                for (let sdp = 0; sdp < subDataPorts.length && result; sdp++) {
                    result = copyLinkValue(subDataPorts[sdp]);
                }
            }
            return result;
        }
        /**
         * Copies the output parameter values from the specified block
         * to the connected linked ports.
         * Output parameter values are propagated through each graph block
         * @private
         * @static
         * @param {ExecutionBlock} block - The block to copy the output parameter values from.
         */
        static copyOutputDataLinkValues(block) {
            const copyLinkValue = (dataPort) => {
                const dataLinks = dataPort.getOutputDataLinks();
                for (let dl = 0; dl < dataLinks.length; dl++) {
                    const dataLink = dataLinks[dl];
                    if (dataPort.model.block.graph === dataLink.endPort.model.block) {
                        dataLink.copyDataLinkValue();
                    }
                }
            };
            const dataPorts = block.getDataPorts(Enums.EDataPortType.eOutput);
            for (let dp = 0; dp < dataPorts.length; dp++) {
                copyLinkValue(dataPorts[dp]);
                const subDataPorts = dataPorts[dp].dataPorts;
                for (let sdp = 0; sdp < subDataPorts.length; sdp++) {
                    copyLinkValue(subDataPorts[sdp]);
                }
            }
        }
        /**
         * Sends the event defined by the port.
         * @private
         * @param {ExecutionControlPort} port - The execution control port.
         */
        // eslint-disable-next-line class-methods-use-this
        sendEvent(port) {
            const EventCtor = EventServices.getEventByType(port.model.getEventType());
            const event = port.getEvent() || new EventCtor();
            EventServices.dispatchEvent(event);
        }
        // eslint-disable-next-line class-methods-use-this
        sendBreakEvent(iCursor) {
            const event = new ExecutionEvents.DebugBreakEvent();
            event.path = iCursor.model.toPath();
            EventServices.dispatchEvent(event);
        }
        // eslint-disable-next-line class-methods-use-this
        sendUnbreakEvent(iCursor) {
            const event = new ExecutionEvents.DebugUnbreakEvent();
            event.path = iCursor.model.toPath();
            EventServices.dispatchEvent(event);
        }
        /**
         * @public
         */
        continue() {
            for (let wc = 0; wc < this.waitingCursors.length; wc++) {
                const waitingCursor = this.waitingCursors[wc];
                if (waitingCursor instanceof ExecutionGraph) {
                    waitingCursor.continue();
                }
            }
            this.debugRequest = EDebugRequest.eContinue;
        }
        /**
         * @public
         */
        breakAll() {
            for (let wc = 0; wc < this.waitingCursors.length; wc++) {
                const waitingCursor = this.waitingCursors[wc];
                if (waitingCursor instanceof ExecutionGraph && waitingCursor.isExecuting()) {
                    waitingCursor.breakAll();
                }
            }
            this.debugRequest = EDebugRequest.eBreakAll;
        }
        /**
         * @public
         * @param {string} contextPath - The context path.
         */
        stepOver(contextPath) {
            if (this.model.toPath() === contextPath) {
                this.debugRequest = EDebugRequest.eStepOver;
            }
            else {
                for (let wc = 0; wc < this.waitingCursors.length; wc++) {
                    const waitingCursor = this.waitingCursors[wc];
                    if (waitingCursor instanceof ExecutionGraph && contextPath.startsWith(waitingCursor.model.toPath())) {
                        waitingCursor.stepOver(contextPath);
                        break;
                    }
                }
            }
        }
        /**
         * @public
         * @param {string} contextPath - The context path.
         */
        stepInto(contextPath) {
            if (this.model.toPath() === contextPath) {
                if (this.breakCursor !== undefined && this.breakCursor.model.handleStepInto()) {
                    this.debugRequest = EDebugRequest.eStepInto;
                }
            }
            else {
                for (let wc = 0; wc < this.waitingCursors.length; wc++) {
                    const waitingCursor = this.waitingCursors[wc];
                    if (waitingCursor instanceof ExecutionGraph && contextPath.startsWith(waitingCursor.model.toPath())) {
                        waitingCursor.stepInto(contextPath);
                        break;
                    }
                }
            }
        }
        /**
         * @public
         * @param {string} contextPath - The context path.
         */
        stepOut(contextPath) {
            if (this.model.toPath() === contextPath) {
                this.continue();
            }
            else {
                for (let wc = 0; wc < this.waitingCursors.length; wc++) {
                    const waitingCursor = this.waitingCursors[wc];
                    if (waitingCursor instanceof ExecutionGraph && contextPath.startsWith(waitingCursor.model.toPath())) {
                        waitingCursor.stepOut(contextPath);
                        break;
                    }
                }
            }
        }
        /**
         * @public
         * @param {IBreakpoint[]} breakpoints - Breakpoints.
         */
        updateBreakpoints(breakpoints) {
            this.breakpoints = breakpoints;
            this.breakpointsByPath = {};
            for (let b = 0; b < this.blocks.length; b++) {
                const block = this.blocks[b];
                if (block instanceof ExecutionGraph) {
                    block.updateBreakpoints(breakpoints);
                }
            }
            for (let bp = 0; bp < breakpoints.length; bp++) {
                const breakpoint = breakpoints[bp];
                this.breakpointsByPath[breakpoint.path] = undefined;
            }
        }
        /**
         * @private
         * @param {ExecutionBlock} block - The block.
         * @return {boolean} True if the block has breakpoint on given block, false otherwise.
         */
        hasBreakpointOn(block) {
            let result = this.breakCursor !== block;
            result = result && this.breakpointsByPath.hasOwnProperty(block.model.toPath());
            return result;
        }
        /**
         * @private
         */
        onBlockBreak() {
            this.breakAll();
        }
        /**
         * @private
         * @param {ExecutionBlock} block - The block.
         * @returns {boolean} True if the block has to break, false otherwise.
         */
        hasToBreak(block) {
            const result = this.debugRequest === EDebugRequest.eBreakAll || this.hasBreakpointOn(block);
            if (result) {
                this.debugRequest = EDebugRequest.eBreakAll;
                if (this.breakCursor === undefined) {
                    this.breakCursor = block;
                    this.sendBreakEvent(this.breakCursor);
                    this.breakAll();
                    if (this.parent !== undefined) {
                        this.parent.onBlockBreak();
                    }
                }
            }
            else if (this.breakCursor !== undefined) {
                this.sendUnbreakEvent(this.breakCursor);
                this.breakCursor = undefined;
            }
            if (this.debugRequest === EDebugRequest.eStepOver) {
                this.debugRequest = EDebugRequest.eBreakAll;
            }
            return result;
        }
        /**
         * @private
         * @returns {boolean} True if the graph has to step into.
         */
        hasToStepInto() {
            const result = this.debugRequest === EDebugRequest.eStepInto;
            if (result) {
                this.debugRequest = EDebugRequest.eBreakAll;
            }
            return result;
        }
        /**
         * Executes the loop of the graph.
         * @private
         * @param {IRunParameters} runParams - The parameters of the loop.
         * @returns {EExecutionResult} The graph execution result.
         */
        onExecute(runParams) {
            let currentCursor;
            // Merge previous waiting cursors and clear it
            let cursorToExecute = this.waitingCursors;
            this.waitingCursors = [];
            // Expand if template
            if (this.model.isTemplate() && this.model.expand()) {
                this.buildFromGraphModel();
            }
            // Get the activated graph input control ports
            const nextInputControlPortCursors = this.getActivatedInputControlPorts();
            cursorToExecute = cursorToExecute.concat(nextInputControlPortCursors);
            let blocksCount = 0;
            while (undefined !== (currentCursor = cursorToExecute.shift())) {
                // Check maximum graph executed blocks during one frame
                if (blocksCount > ExecutionGraph.kMaximumExecutedBlocks) {
                    throw new Error('Graph ' + this.model.getName() + ' has reached maximum authorized executed blocks!');
                }
                if (currentCursor instanceof ExecutionControlPort) {
                    const port = currentCursor;
                    port.deactivate();
                    const nextLinkCursors = port.getLinksToExecute();
                    cursorToExecute = cursorToExecute.concat(nextLinkCursors);
                }
                else if (currentCursor instanceof ExecutionControlLinkContext) {
                    const linkCtx = currentCursor;
                    if (linkCtx.activate()) {
                        const link = linkCtx.link;
                        const block = link.endPort.parent;
                        if (block !== this && block.executionResult === Enums.EExecutionResult.eExecutionWorker) {
                            this.waitingCursors.push(linkCtx);
                        }
                        else {
                            link.endPort.setEvent(link.startPort.getEvent());
                            link.endPort.activate();
                            if (block !== this) {
                                cursorToExecute.unshift(block);
                            }
                        }
                    }
                    else {
                        this.waitingCursors.push(linkCtx);
                    }
                }
                else if (currentCursor instanceof ExecutionBlock) {
                    const block = currentCursor;
                    // Copy values linked to this block input data ports
                    // const dataReady = ExecutionGraph.copyInputDataLinkValues(block);
                    if (block !== this.breakCursor && !ExecutionGraph.copyInputDataLinkValues(block)) {
                        // If at least one data port is not ready then stacks the block and differs its execution next frame
                        this.waitingCursors.push(currentCursor);
                        blocksCount++;
                    }
                    else {
                        if (!block.isExecuting() && this.hasToBreak(block)) {
                            this.waitingCursors.push(currentCursor);
                            this.waitingCursors.push.apply(this.waitingCursors, cursorToExecute);
                            cursorToExecute.length = 0;
                        }
                        else {
                            if (this.hasToStepInto()) {
                                block.breakAll();
                            }
                            const result = block.execute(runParams);
                            blocksCount++;
                            if (block.isExecuting()) {
                                this.waitingCursors.push(currentCursor);
                            }
                            else if (result === Enums.EExecutionResult.eExecutionError || !ExecutionGraph.isExecutionResult(result)) {
                                throw new Error('Failed to execute block ' + block.model.getName() + ' in graph ' + this.model.getName());
                            }
                            ExecutionGraph.copyOutputDataLinkValues(block);
                            const nextOutputControlPortCursors = block.getActivatedOutputControlPorts();
                            cursorToExecute.unshift.apply(cursorToExecute, nextOutputControlPortCursors);
                        }
                    }
                }
            }
            return this.waitingCursors.length > 0 ? Enums.EExecutionResult.eExecutionPending : Enums.EExecutionResult.eExecutionFinished;
        }
        static isExecutionResult(result) {
            return Enums.EExecutionResult.hasOwnProperty(result);
        }
        getModules() {
            return this.modules;
        }
        getNodeIdFromSelector(nodeIdSelectorName) {
            let nodeId;
            if (nodeIdSelectorName === Tools.parentNodeIdSelector) {
                nodeId = this.getNodeId();
            }
            else {
                nodeId = this.nodeIdsBySelector[nodeIdSelectorName];
                if (nodeId === undefined) {
                    const nodeIdSelector = this.model.getNodeIdSelectorByName(nodeIdSelectorName);
                    if (nodeIdSelector !== undefined) {
                        const pool = nodeIdSelector.getPool();
                        let criterionEnumValue = nodeIdSelector.getCriterion();
                        let criterion;
                        switch (criterionEnumValue) {
                            case Enums.ECriterion.eIdentifier:
                                {
                                    const identifier = nodeIdSelector.getIdentifier();
                                    criterion = EK.Criterion.identifier(identifier);
                                    break;
                                }
                            case Enums.ECriterion.eOnlyMyHypervisor:
                                {
                                    criterion = EK.Criterion.onlyMyHypervisor();
                                    break;
                                }
                            case Enums.ECriterion.eNotMyHypervisor:
                                {
                                    criterion = EK.Criterion.notMyHypervisor();
                                    break;
                                }
                            case Enums.ECriterion.ePreferMyHypervisor:
                                {
                                    criterion = EK.Criterion.preferMyHypervisor();
                                    break;
                                }
                            default:
                                {
                                    criterion = undefined;
                                    break;
                                }
                        }
                        const timeout = nodeIdSelector.getTimeout();
                        if (timeout !== undefined) {
                            if (criterion === undefined) {
                                criterion = EK.Criterion.timeout(timeout);
                            }
                            else {
                                criterion.withTimeout(timeout);
                            }
                        }
                        const queuing = nodeIdSelector.getQueuing();
                        if (!queuing) {
                            if (criterion === undefined) {
                                criterion = EK.Criterion.noQueuing();
                            }
                            else {
                                criterion.withoutQueuing();
                            }
                        }
                        const cmdLine = nodeIdSelector.getCmdLine();
                        if (cmdLine !== undefined) {
                            if (criterion === undefined) {
                                criterion = EK.Criterion.none();
                            }
                            criterion.withCmdLine(cmdLine);
                        }
                        const node = this.getNode();
                        nodeId = node.select(pool, criterion);
                        this.nodeIdsBySelector[nodeIdSelectorName] = nodeId;
                    }
                }
            }
            return nodeId;
        }
        getNodeIdFromPool(pool) {
            const node = this.getNode();
            const nodeId = node.select(pool);
            this.nodeIds.push(nodeId);
            return nodeId;
        }
        disconnect() {
            for (let b = 0; b < this.blocks.length; b++) {
                const block = this.blocks[b];
                if (block instanceof ExecutionGraph) {
                    block.disconnect();
                }
            }
            const selectors = Object.keys(this.nodeIdsBySelector);
            for (let s = 0; s < selectors.length; s++) {
                const selector = selectors[s];
                this.nodeIdsBySelector[selector].close();
                delete this.nodeIdsBySelector[selector];
            }
            for (let nid = 0; nid < this.nodeIds.length; nid++) {
                this.nodeIds[nid].close();
            }
            this.nodeIds.length = 0;
        }
    }
    return ExecutionGraph;
});
