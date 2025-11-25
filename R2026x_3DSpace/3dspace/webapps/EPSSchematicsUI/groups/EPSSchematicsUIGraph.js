/// <amd-module name='DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph'/>
define("DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph", ["require", "exports", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGroup", "DS/EPSSchematicsUI/groups/views/EPSSchematicsUIGraphView", "DS/EPSSchematicsUI/geometries/EPSSchematicsUIGraphGeometry", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIScriptBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphContainerBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIComment", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataDrawer", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataTestDrawer", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphControlButton", "DS/EPSSchematicsUI/tools/EPSSchematicsUIMath", "DS/EPSSchematicsUI/components/EPSSchematicsUISmartSearch", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphEventPort", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphControlPortView", "DS/EPSSchematicsUI/edges/EPSSchematicsUIDataLink", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIJSONConverter", "DS/EPSSchematicsUI/libraries/EPSSchematicsUILocalTemplateLibrary", "DS/EPSSchematicsUI/components/EPSSchematicsUIGraphToolbar", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIShortcut", "DS/EPSSchematicsUI/edges/EPSSchematicsUILink", "DS/EPSSchematicsUI/edges/EPSSchematicsUIControlLink", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort", "DS/EPSSchematicsUI/controllers/EPSSchematicsUINodeIdSelectorController", "DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsDataLink", "DS/EPSSchematicsModelWeb/EPSSchematicsControlLink", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsScriptBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphContainerBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsCSI/EPSSchematicsCSIScriptFunctionBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSIGraphFunctionBlock"], function (require, exports, UIGroup, UIGraphView, UIGraphGeometry, UIBlock, UIGraphBlock, UIScriptBlock, UIGraphContainerBlock, UIComment, UIGraphDataDrawer, UIGraphDataTestDrawer, UIGraphControlButton, UIMath, UISmartSearch, UIGraphControlPort, UIGraphEventPort, UIGraphControlPortView, UIDataLink, UITools, UIJSONConverter, UILocalTemplateLibrary, UIGraphToolbar, UIShortcut, UILink, UIControlLink, UIShortcutDataPort, UIGraphDataPort, UINodeIdSelectorController, UISubDataPort, Events, ModelEnums, DataLink, ControlLink, DataPort, ScriptBlock, GraphBlock, GraphContainerBlock, EventPort, Tools, TypeLibrary, CSIScriptFunctionBlock, CSIGraphFunctionBlock) {
    "use strict";
    /**
     * This class defines a UI graph.
     * @private
     * @class UIGraph
     * @alias module:DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph
     * @extends UIGroup
     */
    class UIGraph extends UIGroup {
        /**
         * @public
         * @constructor
         * @param {UIViewer} viewer - The graph viewer.
         * @param {GraphBlock} model - The graph model.
         * @param {IJSONGraphUI} [modelUI] - The graph model UI.
         */
        constructor(viewer, model, modelUI) {
            super(viewer);
            this.blocks = [];
            this.comments = [];
            this.controlLinks = [];
            this.dataLinks = [];
            this.shortcuts = [];
            this.controlPorts = [];
            this.dataLinksMinimizerState = false;
            // Analyzer
            this.graphAnalyserState = false;
            this.controlWaitingDataBlocks = [];
            this.dataLoopBlocks = [];
            this.controlLoopBlocks = [];
            this.onBlockAddCB = this._onBlockAdd.bind(this);
            this.onBlockRemoveCB = this._onBlockRemove.bind(this);
            this.onDataPortAddCB = this._onDataPortAdd.bind(this);
            this.onDataPortRemoveCB = this._onDataPortRemove.bind(this);
            this.onControlPortAddCB = this._onControlPortAdd.bind(this);
            this.onControlPortRemoveCB = this._onControlPortRemove.bind(this);
            this.onDataLinkAddCB = this._onDataLinkAdd.bind(this);
            this.onDataLinkRemoveCB = this._onDataLinkRemove.bind(this);
            this.onControlLinkAddCB = this._onControlLinkAdd.bind(this);
            this.onControlLinkRemoveCB = this._onControlLinkRemove.bind(this);
            this.kGraphPaddingTop = 70;
            this.kGraphPaddingBottom = 50;
            this.kGraphPaddingLeft = 50;
            this.kGraphPaddingRight = 50;
            this.model = model;
            this.setView(new UIGraphView(this));
            //this.display.geometry = new UIGraphGeometry(0, 0, 800, 400);
            this.display.set('geometry', new UIGraphGeometry(0, 0, 800, 400));
            this.inputControlPortButton = new UIGraphControlButton(this, true);
            this.outputControlPortButton = new UIGraphControlButton(this, false);
            this._nodeIdSelectorController = new UINodeIdSelectorController(this);
            this.localTemplateLibrary = new UILocalTemplateLibrary(this.model.getGraphContext());
            this.toolbar = this.createGraphToolBar();
            // Initialize model callbacks
            this.model.addListener(Events.BlockAddEvent, this.onBlockAddCB);
            this.model.addListener(Events.BlockRemoveEvent, this.onBlockRemoveCB);
            this.model.addListener(Events.DataPortAddEvent, this.onDataPortAddCB);
            this.model.addListener(Events.DataPortRemoveEvent, this.onDataPortRemoveCB);
            this.model.addListener(Events.ControlPortAddEvent, this.onControlPortAddCB);
            this.model.addListener(Events.ControlPortRemoveEvent, this.onControlPortRemoveCB);
            this.model.addListener(Events.DataLinkAddEvent, this.onDataLinkAddCB);
            this.model.addListener(Events.DataLinkRemoveEvent, this.onDataLinkRemoveCB);
            this.model.addListener(Events.ControlLinkAddEvent, this.onControlLinkAddCB);
            this.model.addListener(Events.ControlLinkRemoveEvent, this.onControlLinkRemoveCB);
            // Initialize drawers
            this.initializeDrawers();
            // Add the graph node to the graph view
            this.viewer.getDisplay().updateLock();
            try {
                this.viewer.getDisplay().addNode(this.display);
            }
            finally {
                this.viewer.getDisplay().updateUnlock();
            }
            this._buildFromModel();
            if (modelUI !== undefined) {
                this.fromJSON(modelUI);
            }
            const alwaysMinimizeDataLink = this.getEditor().getLocalStorageController().getAlwaysMinimizeDataLinksSetting();
            this.setDataLinksMinimizerState(alwaysMinimizeDataLink);
        }
        /**
         * Initialize drawers.
         * @protected
         */
        initializeDrawers() {
            this.inputDataDrawer = new UIGraphDataDrawer(this, ModelEnums.EDataPortType.eInput);
            this.outputDataDrawer = new UIGraphDataDrawer(this, ModelEnums.EDataPortType.eOutput);
            this.inputLocalDataDrawer = new UIGraphDataDrawer(this, ModelEnums.EDataPortType.eLocal, true);
            const options = this.viewer.getEditor().getOptions();
            if (!options.hideOutputLocalDataDrawer) {
                this.outputLocalDataDrawer = new UIGraphDataDrawer(this, ModelEnums.EDataPortType.eLocal, false);
            }
            const isTestEditorEnabled = options.tabViewMode !== undefined && options.tabViewMode.testEditor !== undefined;
            const rootGraph = this.getEditor()._getViewer().getMainGraph();
            const isRootGraphInitialized = rootGraph !== undefined; // When building the first graph, main graph viewer is not yet registered!
            const isRootGraph = rootGraph === this;
            if (isTestEditorEnabled && (!isRootGraphInitialized || isRootGraph)) { // Test drawers only available on root graph!
                this.inputDataTestDrawer = new UIGraphDataTestDrawer(this, ModelEnums.EDataPortType.eInput);
                this.outputDataTestDrawer = new UIGraphDataTestDrawer(this, ModelEnums.EDataPortType.eOutput);
            }
        }
        /**
         * Removes the graph.
         * @public
         * @override
         */
        remove() {
            this.viewer.getDisplay().updateLock();
            try {
                this._nodeIdSelectorController.remove();
                this.inputControlPortButton.remove();
                this.outputControlPortButton.remove();
                this.removeComments(this.comments);
                this._removeBlockView();
                this.removeSmartSearch();
                this._removeAllDataLinks();
                this._removeAllControlLinks();
                this._removeAllBlocks();
                this._removeAllControlPorts();
                if (this.inputDataDrawer !== undefined) {
                    this.inputDataDrawer.remove();
                }
                if (this.outputDataDrawer !== undefined) {
                    this.outputDataDrawer.remove();
                }
                if (this.inputLocalDataDrawer !== undefined) {
                    this.inputLocalDataDrawer.remove();
                }
                if (this.outputLocalDataDrawer !== undefined) {
                    this.outputLocalDataDrawer.remove();
                }
                if (this.inputDataTestDrawer !== undefined) {
                    this.inputDataTestDrawer.remove();
                }
                if (this.outputDataTestDrawer !== undefined) {
                    this.outputDataTestDrawer.remove();
                }
                this.removeGraphToolbar();
                this.model.removeListener(Events.BlockAddEvent, this.onBlockAddCB);
                this.model.removeListener(Events.BlockRemoveEvent, this.onBlockRemoveCB);
                this.model.removeListener(Events.DataPortAddEvent, this.onDataPortAddCB);
                this.model.removeListener(Events.DataPortRemoveEvent, this.onDataPortRemoveCB);
                this.model.removeListener(Events.ControlPortAddEvent, this.onControlPortAddCB);
                this.model.removeListener(Events.ControlPortRemoveEvent, this.onControlPortRemoveCB);
                this.model.removeListener(Events.DataLinkAddEvent, this.onDataLinkAddCB);
                this.model.removeListener(Events.DataLinkRemoveEvent, this.onDataLinkRemoveCB);
                this.model.removeListener(Events.ControlLinkAddEvent, this.onControlLinkAddCB);
                this.model.removeListener(Events.ControlLinkRemoveEvent, this.onControlLinkRemoveCB);
                this.viewer.getDisplay().removeNode(this.display);
            }
            finally {
                this.viewer.getDisplay().updateUnlock();
            }
            this.model = undefined;
            this.blocks = undefined;
            this.comments = undefined;
            this.controlLinks = undefined;
            this.dataLinks = undefined;
            this.shortcuts = undefined;
            this.controlPorts = undefined;
            this._nodeIdSelectorController = undefined;
            this.inputDataDrawer = undefined;
            this.outputDataDrawer = undefined;
            this.inputLocalDataDrawer = undefined;
            this.outputLocalDataDrawer = undefined;
            this.inputDataTestDrawer = undefined;
            this.outputDataTestDrawer = undefined;
            this.inputControlPortButton = undefined;
            this.outputControlPortButton = undefined;
            this.localTemplateLibrary = undefined;
            this.smartSearch = undefined;
            this.blockView = undefined;
            this.graphContext = undefined;
            this.dataLinksMinimizerState = undefined;
            this.toolbar = undefined;
            this.graphAnalyserState = undefined;
            this.controlWaitingDataBlocks = undefined;
            this.dataLoopBlocks = undefined;
            this.controlLoopBlocks = undefined;
            this.onBlockAddCB = undefined;
            this.onBlockRemoveCB = undefined;
            this.onDataPortAddCB = undefined;
            this.onDataPortRemoveCB = undefined;
            this.onControlPortAddCB = undefined;
            this.onControlPortRemoveCB = undefined;
            this.onDataLinkAddCB = undefined;
            this.onDataLinkRemoveCB = undefined;
            this.onControlLinkAddCB = undefined;
            this.onControlLinkRemoveCB = undefined;
            super.remove();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                   _     ___    _    ____        __   ____    ___     _______                   //
        //                  | |   / _ \  / \  |  _ \      / /  / ___|  / \ \   / / ____|                  //
        //                  | |  | | | |/ _ \ | | | |    / /   \___ \ / _ \ \ / /|  _|                    //
        //                  | |__| |_| / ___ \| |_| |   / /     ___) / ___ \ V / | |___                   //
        //                  |_____\___/_/   \_\____/   /_/     |____/_/   \_\_/  |_____|                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Builds the graph from the provided model.
         * @protected
         */
        _buildFromModel() {
            const blocksModel = this.model.getBlocks();
            const controlPortsModel = this.model.getControlPorts();
            const dataPortsModel = this.model.getDataPorts();
            const dataLinksModel = this.model.getDataLinks();
            const controlLinksModel = this.model.getControlLinks();
            const nodeIdSelectorsModel = this.model.getNodeIdSelectors();
            blocksModel.forEach(model => this.createBlockFromModel(model));
            controlPortsModel.forEach(model => this._createControlPortFromModel(model));
            dataPortsModel.forEach(model => this._createDataPortFromModel(model));
            dataLinksModel.forEach(model => this.createDataLinkFromModel(model));
            controlLinksModel.forEach(model => this.createControlLinkFromModel(model));
            nodeIdSelectorsModel.forEach(model => this._nodeIdSelectorController.createNodeIdSelectorNodeModel(model));
        }
        /**
         * Saves a graph to json object.
         * @public
         * @returns {IJSONGraphWithUI} The json object representing the graph.
         */
        save() {
            const jsonObject = {};
            jsonObject.version = Tools.version;
            jsonObject.model = {};
            this.model.toJSON(jsonObject.model);
            jsonObject.ui = {};
            this.toJSON(jsonObject.ui);
            if (this.getGraphContext() === this) {
                this.localTemplateLibrary.toJSON(jsonObject);
                jsonObject.types = {};
                jsonObject.types.model = {};
                TypeLibrary.toJSONLocalCustom(this.model, jsonObject.types.model);
            }
            return jsonObject;
        }
        /**
         * Loads a graph from a json object.
         * @public
         * @param {IJSONGraphWithUI} iJSONGraph - The json object reprensenting the graph.
         */
        load(iJSONGraph) {
            this.removeComments(this.comments);
            if (this.inputDataTestDrawer !== undefined) {
                this.inputDataTestDrawer.resetTestValues();
            }
            if (this.outputDataTestDrawer !== undefined) {
                this.outputDataTestDrawer.resetTestValues();
            }
            UIJSONConverter.convertGraph(iJSONGraph);
            if (this.getGraphContext() === this) {
                if (iJSONGraph.types !== undefined) {
                    TypeLibrary.fromJSONLocalCustom(this.model, iJSONGraph.types.model);
                }
                this.localTemplateLibrary.fromJSON(iJSONGraph);
            }
            this.model.fromJSON(iJSONGraph.model);
            this.fromJSON(iJSONGraph.ui);
            this._nodeIdSelectorController.updateNodeIdSelectorsCount();
        }
        /**
         * Loads the provided blocks into the graph.
         * @public
         * @param {IJSONBlockCopyPaste[]} blocks - The list of blocks.
         */
        loadBlocks(blocks) {
            if (Array.isArray(blocks) && blocks.length > 0) {
                blocks.forEach(block => {
                    if (block.ui.top !== undefined && block.ui.left !== undefined) {
                        const position = this.getAvailableBlockPosition(block.ui.top, block.ui.left);
                        block.ui.top = position.top;
                        block.ui.left = position.left;
                        const blockUI = this.createBlock(block.model.definition.uid, block.ui.left, block.ui.top);
                        if (blockUI) {
                            blockUI.load(block.model, block.ui);
                        }
                    }
                });
            }
        }
        /**
         * Projects the graph from the provided JSON.
         * TODO: Only public for CSI execution graph access! Find a better solution!
         * @public
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        fromJSON(iJSONGraph) {
            if (iJSONGraph !== undefined) {
                this.viewer.getDisplay().updateLock();
                try {
                    if (iJSONGraph.graphLeft !== undefined) {
                        this.setLeft(iJSONGraph.graphLeft);
                    }
                    if (iJSONGraph.graphTop !== undefined) {
                        this.setTop(iJSONGraph.graphTop);
                    }
                    if (iJSONGraph.width !== undefined) {
                        this.setWidth(iJSONGraph.width);
                    }
                    if (iJSONGraph.height !== undefined) {
                        this.setHeight(iJSONGraph.height);
                    }
                    if (this.shortcuts.length > 0) {
                        this.removeShortcuts(this.shortcuts.slice(), true);
                    }
                    this._fromJSONBlocks(iJSONGraph);
                    this.fromJSONDataPorts(iJSONGraph);
                    this._fromJSONControlPorts(iJSONGraph);
                    this._fromJSONShortcuts(iJSONGraph);
                    this._fromJSONDataLinks(iJSONGraph);
                    this._fromJSONControlLinks(iJSONGraph);
                    this._nodeIdSelectorController.fromJSON(iJSONGraph);
                    this._fromJSONComments(iJSONGraph);
                }
                finally {
                    this.viewer.getDisplay().updateUnlock();
                }
            }
            else {
                this.viewer.getDisplay().updateLock();
                try {
                    this.setDefaultBlocksPosition();
                    this.unexposeAllDrawerSubDataPorts();
                }
                finally {
                    this.viewer.getDisplay().updateUnlock();
                    this.updateSizeFromBlocks();
                }
            }
        }
        /**
         * Projects the blocks from the provided JSON.
         * @private
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        _fromJSONBlocks(iJSONGraph) {
            if (Array.isArray(iJSONGraph.blocks)) {
                this.blocks.forEach((block, index) => block.fromJSON(iJSONGraph.blocks?.[index]));
            }
        }
        /**
         * Projects the comments from the provided JSON.
         * @private
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        _fromJSONComments(iJSONGraph) {
            if (Array.isArray(iJSONGraph.comments)) {
                iJSONGraph.comments.forEach(jsonComment => this.createComment(0, 0, jsonComment, false, false));
            }
        }
        /**
         * Projects the control links from the provided JSON.
         * @private
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        _fromJSONControlLinks(iJSONGraph) {
            if (Array.isArray(iJSONGraph.controlLinks)) {
                this.controlLinks.forEach((controlLink, index) => controlLink.fromJSON(iJSONGraph.controlLinks?.[index]));
            }
        }
        /**
         * Projects the control ports from the provided JSON.
         * @private
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        _fromJSONControlPorts(iJSONGraph) {
            if (Array.isArray(iJSONGraph.controlPorts)) {
                this.controlPorts.forEach((controlPort, index) => controlPort.fromJSON(iJSONGraph.controlPorts?.[index]));
            }
        }
        /**
         * Projects the data links from the provided JSON.
         * @private
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        _fromJSONDataLinks(iJSONGraph) {
            if (Array.isArray(iJSONGraph.dataLinks)) {
                this.dataLinks.forEach((dataLink, index) => dataLink.fromJSON(iJSONGraph.dataLinks?.[index]));
                iJSONGraph.dataLinks.forEach((jsonLink, index) => {
                    if (jsonLink.shortcut !== undefined) {
                        let startPort;
                        let endPort;
                        const dataLink = this.dataLinks[index];
                        if (jsonLink.shortcut.startPort !== undefined) {
                            const shortcut = this.getObjectFromPath(jsonLink.shortcut.startPort);
                            startPort = shortcut.getShortcutDataPort();
                            endPort = dataLink.getEndPort();
                        }
                        if (jsonLink.shortcut.endPort !== undefined) {
                            const shortcut = this.getObjectFromPath(jsonLink.shortcut.endPort);
                            startPort = dataLink.getStartPort();
                            endPort = shortcut.getShortcutDataPort();
                        }
                        if (startPort && endPort) {
                            this.rerouteUIDataLink(dataLink, startPort, endPort);
                        }
                    }
                });
            }
        }
        /**
         * Projects the data ports from the provided JSON.
         * @public
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        fromJSONDataPorts(iJSONGraph) {
            if (Array.isArray(iJSONGraph.dataPorts)) {
                this.model.getDataPorts().forEach((dataPortModel, index) => {
                    const dataPortJSON = iJSONGraph.dataPorts?.[index];
                    if (dataPortJSON !== undefined) {
                        if (dataPortModel.getType() === ModelEnums.EDataPortType.eInput || dataPortModel.getType() === ModelEnums.EDataPortType.eOutput) {
                            const dataPortUI = this.getUIDataPortFromModel(dataPortModel);
                            dataPortUI?.fromJSON(dataPortJSON);
                        }
                        else if (dataPortModel.getType() === ModelEnums.EDataPortType.eLocal) {
                            const localJSONDataPorts = dataPortJSON.dataPorts;
                            if (localJSONDataPorts !== undefined) {
                                const inLocalJSON = { dataPorts: [] };
                                const outLocalJSON = { dataPorts: [] };
                                localJSONDataPorts.forEach(localJSONDataPort => {
                                    inLocalJSON.dataPorts.push({ localInput: localJSONDataPort.localInput });
                                    outLocalJSON.dataPorts.push({ localOutput: localJSONDataPort.localOutput });
                                });
                                const inLocalDataPortUI = this.getUIDataPortFromModel(dataPortModel, true);
                                inLocalDataPortUI?.fromJSON(inLocalJSON);
                                const options = this.viewer.getEditor().getOptions();
                                if (!options.hideOutputLocalDataDrawer) {
                                    const outLocalDataPortUI = this.getUIDataPortFromModel(dataPortModel, false);
                                    outLocalDataPortUI?.fromJSON(outLocalJSON);
                                }
                            }
                        }
                    }
                });
            }
        }
        /**
         * Projects the shortcuts from the provided JSON.
         * @private
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        _fromJSONShortcuts(iJSONGraph) {
            if (Array.isArray(iJSONGraph.shortcuts)) {
                iJSONGraph.shortcuts.forEach(shortcut => {
                    let dataPortUI;
                    const dataPortModel = this.model.getObjectFromPath(shortcut.port);
                    if (dataPortModel.block instanceof GraphBlock && dataPortModel.block === this.model) {
                        const isInputLocal = shortcut.shortcutType === 0 /* UIEnums.EShortcutType.eStartPort */;
                        if (dataPortModel.dataPort !== undefined) { // Manage shortcut on sub data ports
                            const parentDataPortUI = this.getUIDataPortFromModel(dataPortModel.dataPort, isInputLocal);
                            dataPortUI = parentDataPortUI?.getUISubDataPortFromModel(dataPortModel);
                        }
                        else {
                            dataPortUI = this.getUIDataPortFromModel(dataPortModel, isInputLocal);
                        }
                    }
                    else {
                        if (dataPortModel.dataPort !== undefined) { // Manage shortcut on sub data ports
                            const blockUI = this.getUIBlockFromModel(dataPortModel.block);
                            const parentDataPortUI = blockUI?.getUIDataPortFromModel(dataPortModel.dataPort);
                            dataPortUI = parentDataPortUI?.getUISubDataPortFromModel(dataPortModel);
                        }
                        else {
                            dataPortUI = this.getObjectFromPath(shortcut.port);
                        }
                    }
                    if (dataPortUI) {
                        const shortcutUI = this.createShortcut(dataPortUI, shortcut.left, shortcut.top, shortcut.shortcutType);
                        shortcutUI.fromJSON(shortcut);
                    }
                });
            }
        }
        /**
         * Projects the graph into the provided JSON.
         * @public
         * @param {IJSONGraphUI} oJSONGraph - The JSON graph.
         */
        toJSON(oJSONGraph) {
            oJSONGraph.graphLeft = this.display.actualLeft;
            oJSONGraph.graphTop = this.display.actualTop;
            oJSONGraph.width = this.display.actualWidth;
            oJSONGraph.height = this.display.actualHeight;
            oJSONGraph.blocks = [];
            oJSONGraph.dataPorts = [];
            oJSONGraph.controlPorts = [];
            oJSONGraph.dataLinks = [];
            oJSONGraph.controlLinks = [];
            oJSONGraph.shortcuts = [];
            this.blocks.forEach(block => {
                const oJSONBlock = {};
                block.toJSON(oJSONBlock);
                oJSONGraph.blocks?.push(oJSONBlock);
            });
            const hideOutputLocalDataDrawer = this.getEditor().getOptions().hideOutputLocalDataDrawer;
            this.model.getDataPorts().forEach(dataPort => {
                const oJSONDataPort = {};
                if (dataPort.getType() === ModelEnums.EDataPortType.eInput || dataPort.getType() === ModelEnums.EDataPortType.eOutput) {
                    const dataPortUI = this.getUIDataPortFromModel(dataPort);
                    dataPortUI?.toJSON(oJSONDataPort);
                }
                else if (dataPort.getType() === ModelEnums.EDataPortType.eLocal) {
                    const oJSONInputDataPort = {};
                    const inputLocalDataPortUI = this.getUIDataPortFromModel(dataPort, true);
                    inputLocalDataPortUI?.toJSON(oJSONInputDataPort);
                    oJSONDataPort.dataPorts = [];
                    oJSONInputDataPort.dataPorts.forEach(localDataPort => {
                        oJSONDataPort.dataPorts.push({
                            localInput: localDataPort.localInput,
                            localOutput: !hideOutputLocalDataDrawer ? localDataPort.localOutput : undefined
                        });
                    });
                }
                oJSONGraph.dataPorts?.push(oJSONDataPort);
            });
            this.controlPorts.forEach(controlPort => {
                const oJSONControlPort = {};
                controlPort.toJSON(oJSONControlPort);
                oJSONGraph.controlPorts?.push(oJSONControlPort);
            });
            this.shortcuts.forEach(shortcut => {
                const oJSONShortcut = {
                    top: 0,
                    left: 0,
                    port: ''
                };
                shortcut.toJSON(oJSONShortcut);
                oJSONGraph.shortcuts?.push(oJSONShortcut);
            });
            this.dataLinks.forEach(dataLink => {
                const oJSONDataLink = {};
                dataLink.toJSON(oJSONDataLink);
                oJSONGraph.dataLinks?.push(oJSONDataLink);
            });
            this.controlLinks.forEach(controlLink => {
                const oJSONControlLink = {};
                controlLink.toJSON(oJSONControlLink);
                oJSONGraph.controlLinks?.push(oJSONControlLink);
            });
            this._nodeIdSelectorController.toJSON(oJSONGraph);
            if (this.comments.length) {
                oJSONGraph.comments = [];
                this.comments.forEach(comment => {
                    const oJSONComment = {};
                    comment.toJSON(oJSONComment);
                    oJSONGraph.comments?.push(oJSONComment);
                });
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //     __  __  ___  ____  _____ _        ____    _    _     _     ____    _    ____ _  ______     //
        //    |  \/  |/ _ \|  _ \| ____| |      / ___|  / \  | |   | |   | __ )  / \  / ___| |/ / ___|    //
        //    | |\/| | | | | | | |  _| | |     | |     / _ \ | |   | |   |  _ \ / _ \| |   | ' /\___ \    //
        //    | |  | | |_| | |_| | |___| |___  | |___ / ___ \| |___| |___| |_) / ___ \ |___| . \ ___) |   //
        //    |_|  |_|\___/|____/|_____|_____|  \____/_/   \_\_____|_____|____/_/   \_\____|_|\_\____/    //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the model change event.
         * @public
         */
        onModelChange() {
            this.editor.onChange();
        }
        /**
         * The callback on the UI change event.
         * @public
         */
        onUIChange() {
            if (this.editor !== undefined) {
                this.editor.onChange();
            }
        }
        /**
         * The callback on the model block add event.
         * @private
         * @param {Events.BlockAddEvent} event - The model block add event.
         */
        _onBlockAdd(event) {
            this.createBlockFromModel(event.getBlock());
            this.onModelChange();
            this.analyze();
        }
        /**
         * The callback on the model block remove event.
         * @private
         * @param {Events.BlockRemoveEvent} event - The model block remove event.
         */
        _onBlockRemove(event) {
            this._removeBlockAtIndex(event.getIndex());
            this.onModelChange();
            this.analyze();
        }
        /**
         * The callback on the model control port add event.
         * @protected
         * @param {Events.ControlPortAddEvent} event - The model control port add event.
         */
        _onControlPortAdd(event) {
            this._createControlPortFromModel(event.getControlPort());
            this.onModelChange();
        }
        /**
         * The callback on the model control port remove event.
         * @protected
         * @param {Events.ControlPortRemoveEvent} event - The model control port remove event.
         */
        _onControlPortRemove(event) {
            this.removeControlPortAtIndex(event.getIndex());
            this.onModelChange();
        }
        /**
         * The callback on the model data port add event.
         * @protected
         * @param {Events.DataPortAddEvent} _event - The model data port add event.
         */
        _onDataPortAdd(_event) {
            this.onModelChange();
        }
        /**
         * The callback on the model data port remove event.
         * @protected
         * @param {Events.DataPortRemoveEvent} _event - The model data port remove event.
         */
        _onDataPortRemove(_event) {
            this.onModelChange();
        }
        /**
         * The callback on the model control link add event.
         * @private
         * @param {Events.ControlLinkAddEvent} event - The model control link add event.
         */
        _onControlLinkAdd(event) {
            const controlLink = this.createControlLinkFromModel(event.getControlLink());
            this.viewer.replaceSelection(controlLink.getDisplay());
            this.onModelChange();
            this.analyze();
        }
        /**
         * The callback on the model control link remove event.
         * @private
         * @param {Events.ControlLinkRemoveEvent} event - The model control link remove event.
         */
        _onControlLinkRemove(event) {
            this._removeControlLinkAtIndex(event.getIndex());
            this.onModelChange();
            this.analyze();
        }
        /**
         * The callback on the model data link add event.
         * @private
         * @param {Events.DataLinkAddEvent} event - The model data link add event.
         */
        _onDataLinkAdd(event) {
            const dataLink = this.createDataLinkFromModel(event.getDataLink());
            this.viewer.replaceSelection(dataLink.getDisplay());
            this.onModelChange();
            this.analyze();
        }
        /**
         * The callback on the model data link remove event.
         * @private
         * @param {Events.DataLinkRemoveEvent} event - The model data link remove event.
         */
        _onDataLinkRemove(event) {
            this._removeDataLinkAtIndex(event.getIndex());
            this.onModelChange();
            this.analyze();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //   ____ _____ _____ _____ _____ ____  ____       __  ____  _____ _____ _____ _____ ____  ____   //
        //  / ___| ____|_   _|_   _| ____|  _ \/ ___|     / / / ___|| ____|_   _|_   _| ____|  _ \/ ___|  //
        // | |  _|  _|   | |   | | |  _| | |_) \___ \    / /  \___ \|  _|   | |   | | |  _| | |_) \___ \  //
        // | |_| | |___  | |   | | | |___|  _ < ___) |  / /    ___) | |___  | |   | | | |___|  _ < ___) | //
        //  \____|_____| |_|   |_| |_____|_| \_\____/  /_/    |____/|_____| |_|   |_| |_____|_| \_\____/  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the viewer.
         * @public
         * @override
         * @returns {UIViewer} The viewer.
         */
        getViewer() {
            return super.getViewer();
        }
        /**
         * Gets the list of blocks.
         * @public
         * @returns {UIBlock[]} The list of blocks.
         */
        getBlocks() {
            return this.blocks;
        }
        /**
         * Gets the graph comments.
         * @public
         * @returns {UIComment[]} The graph comments.
         */
        getComments() {
            return this.comments;
        }
        /**
         * Gets the graph control links.
         * @public
         * @returns {UIControlLink[]} The graph control links.
         */
        getControlLinks() {
            return this.controlLinks;
        }
        /**
         * Gets the graph data links.
         * @public
         * @returns {UIDataLink[]} The graph data links.
         */
        getDataLinks() {
            return this.dataLinks;
        }
        /**
         * Gets the graph control ports.
         * @public
         * @returns {UIGraphControlPort[]} The graph control ports.
         */
        getControlPorts() {
            return this.controlPorts;
        }
        /**
         * Gets the input data drawer.
         * @public
         * @returns {UIGraphDataDrawer} The input data drawer.
         */
        getInputDataDrawer() {
            return this.inputDataDrawer;
        }
        /**
         * Gets the output data drawer.
         * @public
         * @returns {UIGraphDataDrawer} The output data drawer.
         */
        getOutputDataDrawer() {
            return this.outputDataDrawer;
        }
        /**
         * Gets the input local data drawer.
         * @public
         * @returns {UIGraphDataDrawer} The input local data drawer.
         */
        getInputLocalDataDrawer() {
            return this.inputLocalDataDrawer;
        }
        /**
         * Gets the output local data drawer.
         * @public
         * @returns {UIGraphDataDrawer|undefined} The output local data drawer.
         */
        getOutputLocalDataDrawer() {
            return this.outputLocalDataDrawer;
        }
        /**
         * Gets the input data test drawer.
         * @public
         * @returns {UIGraphDataTestDrawer|undefined} The input data test drawer.
         */
        getInputDataTestDrawer() {
            return this.inputDataTestDrawer;
        }
        /**
         * Gets the output data test drawer.
         * @public
         * @returns {UIGraphDataTestDrawer|undefined} The output data test drawer.
         */
        getOutputDataTestDrawer() {
            return this.outputDataTestDrawer;
        }
        /**
         * Gets the graph block model.
         * @public
         * @returns {GraphBlock} The graph block model.
         */
        getModel() {
            return this.model;
        }
        /**
         * Gets the smart search.
         * @public
         * @returns {UISmartSearch|undefined} The graph smart Search.
         */
        getSmartSearch() {
            return this.smartSearch;
        }
        /**
         * Gets the graph toolbar.
         * @public
         * @returns {UIGraphToolbar} The graph toolbar.
         */
        getToolbar() {
            return this.toolbar;
        }
        /**
         * Gets the list of shortcuts.
         * @public
         * @returns {UIShortcut[]} The list of shortcuts;
         */
        getShortcuts() {
            return this.shortcuts;
        }
        /**
         * Gets the local template library.
         * @public
         * @returns {UILocalTemplateLibrary} The local template library.
         */
        getLocalTemplateLibrary() {
            return this.localTemplateLibrary;
        }
        /**
         * Gets the input control port button.
         * @public
         * @returns {UIGraphControlButton} The input control port button.
         */
        getInputControlPortButton() {
            return this.inputControlPortButton;
        }
        /**
         * Gets the output control port button.
         * @public
         * @returns {UIGraphControlButton} The input output port button.
         */
        getOutputControlPortButton() {
            return this.outputControlPortButton;
        }
        /**
         * Gets the graph padding top value.
         * @public
         * @returns {number} The graph padding top value.
         */
        getPaddingTop() {
            return this.kGraphPaddingTop;
        }
        /**
         * Gets the graph padding bottom value.
         * @public
         * @returns {number} The graph padding bottom value.
         */
        getPaddingBottom() {
            return this.kGraphPaddingBottom;
        }
        /**
         * Gets the graph padding left value.
         * @public
         * @returns {number} The graph padding left value.
         */
        getPaddingLeft() {
            return this.kGraphPaddingLeft;
        }
        /**
         * Gets the graph padding right value.
         * @public
         * @returns {number} The graph padding right value.
         */
        getPaddingRight() {
            return this.kGraphPaddingRight;
        }
        /**
         * Gets the graph view.
         * @public
         * @returns {UIGraphView} The graph view.
         */
        getView() {
            return this.display.views.main;
        }
        /**
         * Gets the graph view element.
         * @public
         * @returns {SVGElement} The graph view element.
         */
        getElement() {
            return this.getView().getContainer();
        }
        /**
         * Gets the graph data drawer of the provided port type.
         * @public
         * @param {ModelEnums.EDataPortType} portType - The data port type
         * @param {boolean} [isInputLocal] - True for input local data port else false.
         * @returns {UIGraphDataDrawer|undefined} The graph data drawer.
         */
        getDataDrawer(portType, isInputLocal) {
            let drawer;
            if (portType === ModelEnums.EDataPortType.eInput) {
                drawer = this.inputDataDrawer;
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                drawer = this.outputDataDrawer;
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                drawer = isInputLocal ? this.inputLocalDataDrawer : this.outputLocalDataDrawer;
            }
            return drawer;
        }
        /**
         * Gets the graph context.
         * @public
         * @returns {UIGraph} The UI graph context.
         */
        getGraphContext() {
            return this.graphContext !== undefined ? this.graphContext : this.getRootGraph();
        }
        /**
         * Sets the graph context.
         * @public
         * @param {UIGraph} graphContext - The UI graph context.
         */
        setGraphContext(graphContext) {
            this.graphContext = graphContext;
        }
        /**
         * Gets the data links minimizer state.
         * @public
         * @returns {boolean} The data links minimizer state.
         */
        getDataLinksMinimizerState() {
            return this.dataLinksMinimizerState;
        }
        /**
         * Sets the data links minimizer state.
         * @public
         * @param {boolean} state - The data links minimizer state.
         */
        setDataLinksMinimizerState(state) {
            this.dataLinksMinimizerState = state;
            this.viewer.getDisplay().updateLock();
            try {
                this.dataLinks.forEach(dataLink => dataLink.getView().updateMinimizedLinkState(this.dataLinksMinimizerState));
            }
            finally {
                this.viewer.getDisplay().updateUnlock();
            }
            const graphDataLinkMinimizerButton = this.getToolbar().getGraphDataLinkMinimizerButton();
            if (graphDataLinkMinimizerButton) { // Button could be hidden via editor options!
                graphDataLinkMinimizerButton.setCheckedState(state);
            }
        }
        /**
         * Gets the nodeId selector controller.
         * @public
         * @returns {UINodeIdSelectorController} The nodeId selector controller.
         */
        getNodeIdSelectorController() {
            return this._nodeIdSelectorController;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                       _____ ____   ___  __  __      ____   _  _____ _   _                      //
        //                      |  ___|  _ \ / _ \|  \/  |    |  _ \ / \|_   _| | | |                     //
        //                      | |_  | |_) | | | | |\/| |    | |_) / _ \ | | | |_| |                     //
        //                      |  _| |  _ <| |_| | |  | |    |  __/ ___ \| | |  _  |                     //
        //                      |_|   |_| \_\\___/|_|  |_|    |_| /_/   \_\_| |_| |_|                     //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the object corresponding to the given path.
         * @public
         * @param {string} path - The path of the object to find in the graph.
         * @returns {UIGraph|UIBlock|UIGraphBlock|UIPort|UILink|UIShortcut|undefined} The UI object corresponding to the given path.
         */
        getObjectFromPath(path) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let object = this;
            const elements = path.replace('.containedGraph', '').replace(/\[/g, '.').replace(/\]/g, '').split('.');
            for (let e = 1; e < elements.length; e++) {
                const property = elements[e];
                if (object instanceof UIBlock) {
                    if (property === 'controlPorts') {
                        object = object.getUIControlPorts()[elements[++e]];
                    }
                    else if (property === 'dataPorts') {
                        object = object.getUIDataPorts()[elements[++e]];
                    }
                    else {
                        object = undefined;
                    }
                }
                else if (object !== undefined) {
                    object = object[property];
                }
                if (object === undefined) {
                    break;
                }
                else if (object instanceof UIGraphBlock && object.getGraphView() !== undefined) {
                    object = object.getGraphView();
                }
                else if (object instanceof UIGraphContainerBlock) {
                    object = object.getGraphContainerViewer()?.getMainGraph();
                }
            }
            return object;
        }
        /**
         * Opens the graph block from the provided path.
         * @public
         * @param {string} path - The graph block path to open.
         */
        openGraphBlockFromPath(path) {
            this.editor.getViewerController().removeAllViewers();
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let object = this;
            const elements = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
            for (let e = 1; e < elements.length; e++) {
                const property = elements[e];
                if (object !== undefined) {
                    object = object[property];
                }
                if (Array.isArray(object)) {
                    continue;
                }
                else if (object instanceof UIGraphBlock) {
                    if (object.getGraphView() === undefined) {
                        object.openGraphBlockViewer();
                    }
                    object = object.getGraphView();
                }
                else if (object instanceof UIGraphContainerBlock && elements[e + 1] === 'containedGraph') {
                    const graphContainerViewer = object.openGraphContainerViewer();
                    object = graphContainerViewer.getMainGraph();
                    e++;
                }
                else {
                    break;
                }
            }
        }
        /**
         * Gets the outside control port from the given path.
         * @public
         * @param {string} path - The path of the outside control port.
         * @returns {UIBlockControlPort|undefined} The outside control port.
         */
        getOutsideControlPortFromPath(path) {
            let controlPort = this.getObjectFromPath(path);
            if (controlPort instanceof UIGraphControlPort) { // If graph view is opened
                const graphBlockUI = controlPort.getParent().getBlockView();
                controlPort = graphBlockUI !== undefined ? graphBlockUI.getUIControlPortFromModel(controlPort.getModel()) : undefined;
            }
            return controlPort;
        }
        /**
         * Gets the inside control port from the given path.
         * @public
         * @param {string} path - The path of the inside control port.
         * @returns {UIGraphControlPort|undefined} The inside control port.
         */
        getInsideControlPortFromPath(path) {
            const controlPort = this.getObjectFromPath(path);
            return controlPort instanceof UIGraphControlPort ? controlPort : undefined;
        }
        /**
         * Gets the outside data port from the given path.
         * @public
         * @param {string} path - The path of the outside data port.
         * @returns {UIBlockDataPort|undefined} The outside data port.
         */
        getOutsideDataPortFromPath(path) {
            let dataPort;
            const dataPortModel = this.model.getObjectFromPath(path);
            if (dataPortModel?.block) {
                let parentUI = this.getObjectFromPath(dataPortModel.block.toPath());
                if (parentUI !== undefined) {
                    if (parentUI instanceof UIGraph && parentUI.getBlockView() !== undefined) {
                        parentUI = parentUI.getBlockView();
                    }
                    dataPort = parentUI.getUIDataPortFromModel(dataPortModel);
                }
            }
            return dataPort;
        }
        /**
         * Gets the inside data port from the given path.
         * @public
         * @param {string} path - The path of the inside data port.
         * @returns {UIGraphDataPort|undefined} The inside data port.
         */
        getInsideDataPortFromPath(path) {
            let dataPort;
            const dataPortModel = this.model.getObjectFromPath(path);
            if (dataPortModel?.block) {
                const parentUI = this.getObjectFromPath(dataPortModel?.block?.toPath());
                if (parentUI instanceof UIGraph) {
                    dataPort = parentUI.getUIDataPortFromModel(dataPortModel);
                }
            }
            return dataPort;
        }
        /**
         * Gets the graph test data port from the specified path.
         * @public
         * @param {string} path - The path of the graph test data port.
         * @returns {UIGraphTestDataPort|UIGraphTestSubDataPort} The graph test data port.
         */
        getGraphTestDataPortFromPath(path) {
            const inputTestDataPorts = this.inputDataTestDrawer?.getUIDataPorts(true) || [];
            const outputTestDataPorts = this.outputDataTestDrawer?.getUIDataPorts(true) || [];
            const testDataPorts = [...inputTestDataPorts, ...outputTestDataPorts];
            const result = testDataPorts.find(testDataPort => testDataPort.getModel().toPath() === path);
            return result;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                              ____ ____  _____    _  _____ _____                                //
        //                             / ___|  _ \| ____|  / \|_   _| ____|                               //
        //                            | |   | |_) |  _|   / _ \ | | |  _|                                 //
        //                            | |___|  _ <| |___ / ___ \| | | |___                                //
        //                             \____|_| \_\_____/_/   \_\_| |_____|                               //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Creates a block in the graph.
         * @public
         * @param {string} uid - The uid of the block definition.
         * @param {number} left - The left position of the block in the graph.
         * @param {number} top - The top position of the block in the graph.
         * @returns {UIBlock|undefined} The created block.
         */
        createBlock(uid, left, top) {
            let block;
            if (this.model.createBlock(uid) !== undefined) {
                block = this.blocks[this.blocks.length - 1];
                block.setPosition(left, top);
                this.updateSizeFromBlocks();
                this.getViewer().replaceSelection(block.getDisplay());
                this.editor.getHistoryController().registerCreateAction(block);
            }
            return block;
        }
        /**
         * Creates a block in the middle of the graph.
         * @public
         * @param {string} uid - The uid of the block definition.
         * @returns {UIBlock|undefined} The created block.
         */
        createBlockInMiddle(uid) {
            const middleViewpointPosition = this.getViewer().getMiddleViewpointPosition();
            const block = this.createBlock(uid, middleViewpointPosition.left, middleViewpointPosition.top);
            if (block) {
                block.setPosition(middleViewpointPosition.left - block.getWidth() / 2, middleViewpointPosition.top - block.getHeight() / 2);
            }
            return block;
        }
        /**
         * Creates the block from the provided model.
         * @private
         * @param {Block} blockModel - The block model.
         */
        createBlockFromModel(blockModel) {
            let lastPosition = { left: 0, top: 0 };
            if (this.blocks.length > 0) {
                lastPosition = this.blocks[this.blocks.length - 1].getPosition();
            }
            const position = this.getAvailableBlockPosition(lastPosition.top, lastPosition.left);
            let block;
            if (blockModel instanceof GraphBlock || blockModel instanceof CSIGraphFunctionBlock) {
                block = new UIGraphBlock(this, blockModel, position.left, position.top);
            }
            else if (blockModel instanceof ScriptBlock || blockModel instanceof CSIScriptFunctionBlock) {
                block = new UIScriptBlock(this, blockModel, position.left, position.top);
            }
            else if (blockModel instanceof GraphContainerBlock) {
                block = new UIGraphContainerBlock(this, blockModel, position.left, position.top);
            }
            else {
                block = new UIBlock(this, blockModel, position.left, position.top);
            }
            this.blocks.push(block);
            block.addNodeToGraph();
            block.computeWidth();
            block.computeHeight();
            // Colorize the block if NodeId Selector panel is opened
            const nodeIdSelectorPanel = this.getEditor().getNodeIdSelectorsPanel();
            if (nodeIdSelectorPanel.isOpen() && nodeIdSelectorPanel.getWUXPanel().getContentVisibleState()) {
                nodeIdSelectorPanel.colorizeBlock(block);
            }
        }
        /**
         * Creates a comment.
         * @public
         * @param {number} [left] - The left position of the comment.
         * @param {number} [top] - The top position of the comment.
         * @param {IJSONCommentUI} [jsonComment] - The JSON comment configuration.
         * @param {boolean} [registerHistory=true] - True to register the create action in history, false otherwise.
         * @param {boolean} [updateGraphSize=true] - True to update the graph size from the created comment node.
         * @returns {UIComment} The created comment.
         */
        createComment(left, top, jsonComment, registerHistory = true, updateGraphSize = true) {
            const doCenterLeft = left === undefined;
            const doCenterTop = top === undefined;
            left = left || 0;
            top = top || 0;
            const comment = new UIComment(this, left, top);
            if (jsonComment !== undefined) {
                comment.fromJSON(jsonComment);
            }
            else if (doCenterLeft || doCenterTop) {
                const middlePosition = this.viewer.getMiddleViewpointPosition();
                // TODO: Apply directly the Math.round into the UINode class (Impact for block?)
                comment.setPosition(Math.round(middlePosition.left - comment.getWidth() / 2), Math.round(middlePosition.top - comment.getHeight() / 2));
            }
            comment.addNodeToGraph();
            this.comments.push(comment);
            if (updateGraphSize) {
                this.updateSizeFromBlocks();
            }
            if (registerHistory) {
                this.editor.getHistoryController().registerCreateAction(comment);
            }
            this.onUIChange();
            return comment;
        }
        /**
         * Creates the control link from the specified model.
         * @protected
         * @param {ControlLink} controlLinkModel - The control link model.
         * @returns {UIControlLink} The UI control link.
         */
        createControlLinkFromModel(controlLinkModel) {
            const controlLink = new UIControlLink(this, controlLinkModel);
            const startPortModel = controlLinkModel.getStartPort();
            const startBlockModel = startPortModel.block;
            const startBlock = startBlockModel === this.model ? this : this.getUIBlockFromModel(startBlockModel);
            const startPort = startBlock?.getUIControlPortFromModel(startPortModel);
            const endPortModel = controlLinkModel.getEndPort();
            const endBlockModel = endPortModel.block;
            const endBlock = endBlockModel === this.model ? this : this.getUIBlockFromModel(endBlockModel);
            const endPort = endBlock?.getUIControlPortFromModel(endPortModel);
            if (startPort && endPort) {
                controlLink.setStartPort(startPort);
                controlLink.setEndPort(endPort);
                this.viewer.getDisplay().addEdge(startPort.getDisplay(), endPort.getDisplay(), controlLink.getDisplay());
            }
            this.controlLinks.push(controlLink);
            return controlLink;
        }
        /**
         * Creates the data link from the specified model.
         * @protected
         * @param {DataLink} dataLinkModel - The data link model.
         * @returns {UIDataLink} The UI data link.
         */
        createDataLinkFromModel(dataLinkModel) {
            const dataLink = new UIDataLink(this, dataLinkModel);
            const shortcutPorts = this._getShortcutPorts(dataLinkModel);
            const startPort = shortcutPorts.startPort ? shortcutPorts.startPort : this._findDataPort(dataLinkModel, true);
            const endPort = shortcutPorts.endPort ? shortcutPorts.endPort : this._findDataPort(dataLinkModel, false);
            if (startPort && endPort) {
                dataLink.setStartPort(startPort);
                dataLink.setEndPort(endPort);
                this.viewer.getDisplay().addEdge(startPort.getDisplay(), endPort.getDisplay(), dataLink.getDisplay());
                // Refreshes the persistent labels
                const startPortLabel = startPort.getPersistentLabel();
                if (startPortLabel) {
                    startPortLabel.getView().refreshLabelDisplay();
                }
                const endPortLabel = endPort.getPersistentLabel();
                if (endPortLabel) {
                    endPortLabel.getView().refreshLabelDisplay();
                }
            }
            this.dataLinks.push(dataLink);
            return dataLink;
        }
        /**
         * Creates a graph control port from the specified type and name.
         * @public
         * @param {ModelEnums.EControlPortType} type - The control port type.
         * @param {string} [name] - The name of the control port.
         * @returns {UIGraphControlPort|undefined} The created graph control port.
         */
        createControlPort(type, name) {
            let controlPort;
            if (this.model.createDynamicControlPort(type, name) !== undefined) {
                controlPort = this.controlPorts[this.controlPorts.length - 1];
                this.getViewer().replaceSelection(controlPort.getDisplay());
                this.editor.getHistoryController().registerCreateAction(controlPort);
            }
            return controlPort;
        }
        /**
         * Creates the graph control port from the specified model.
         * @private
         * @param {ControlPort} controlPortModel - The control port model.
         * @returns {UIGraphControlPort} The created graph control port.
         */
        _createControlPortFromModel(controlPortModel) {
            const offset = this._getMaxPortOffset(controlPortModel.isStartPort(this.model));
            const GraphControlPortCtr = controlPortModel instanceof EventPort ? UIGraphEventPort : UIGraphControlPort;
            const controlPort = new GraphControlPortCtr(this, controlPortModel, offset);
            this.controlPorts.push(controlPort);
            this.display.appendConnector(controlPort.getDisplay());
            return controlPort;
        }
        /**
         * Creates a graph data port into the corresponding drawer from the specified model.
         * @private
         * @param {DataPort} dataPortModel - The data port model.
         * @returns {UIGraphDataPort|undefined} - The graph data port.
         */
        _createDataPortFromModel(dataPortModel) {
            let dataPort;
            const portType = dataPortModel.getType();
            if (portType === ModelEnums.EDataPortType.eInput) {
                dataPort = this.inputDataDrawer.createUIDataPort(dataPortModel);
                if (this.inputDataTestDrawer !== undefined) {
                    dataPort = this.inputDataTestDrawer.createUIDataPort(dataPortModel);
                }
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                dataPort = this.outputDataDrawer.createUIDataPort(dataPortModel);
                if (this.outputDataTestDrawer !== undefined) {
                    dataPort = this.outputDataTestDrawer.createUIDataPort(dataPortModel);
                }
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                dataPort = this.inputLocalDataDrawer.createUIDataPort(dataPortModel);
                const options = this.viewer.getEditor().getOptions();
                if (!options.hideOutputLocalDataDrawer && this.outputLocalDataDrawer) {
                    dataPort = this.outputLocalDataDrawer.createUIDataPort(dataPortModel);
                }
            }
            return dataPort;
        }
        /**
         * Creates the smart search.
         * @public
         * @param {number} left - The left position of the smart search.
         * @param {number} top - The top position of the smart search.
         * @param {number} blockLeft - The left position of the block.
         * @param {number} blockTop - The top position of the block.
         */
        createSmartSearch(left, top, blockLeft, blockTop) {
            this.smartSearch = new UISmartSearch(this, left, top, blockLeft, blockTop);
        }
        /**
         * Creates a shortcut.
         * @public
         * @param {UIDataPort} dataPortUI - The data port reference.
         * @param {number} left - The left position of the shortcut.
         * @param {number} top - The top position of the shortcut.
         * @param {UIEnums.EShortcutType} [shortcutType] - The type of shortcut.
         * @returns {UIShortcut} The UI Shortcut.
         */
        createShortcut(dataPortUI, left, top, shortcutType) {
            const shortcut = new UIShortcut(this, dataPortUI, left, top, shortcutType);
            shortcut.addNodeToGraph();
            this.shortcuts.push(shortcut);
            return shortcut;
        }
        /**
         * Creates the graph toolbar.
         * @protected
         * @returns {UIGraphToolbar} The graph toolbar.
         */
        createGraphToolBar() {
            return new UIGraphToolbar(this);
        }
        removeGraphToolbar() {
            if (this.toolbar !== undefined) {
                this.toolbar.remove();
                this.toolbar = undefined;
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _____ __  __  _____     _______                              //
        //                            |  _ \| ____|  \/  |/ _ \ \   / / ____|                             //
        //                            | |_) |  _| | |\/| | | | \ \ / /|  _|                               //
        //                            |  _ <| |___| |  | | |_| |\ V / | |___                              //
        //                            |_| \_\_____|_|  |_|\___/  \_/  |_____|                             //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes all the persistent label from the graph.
         * @public
         */
        removeAllPersitentLabels() {
            const dataPorts = [];
            Array.prototype.push.apply(dataPorts, this.inputDataDrawer?.getUIDataPorts(true));
            Array.prototype.push.apply(dataPorts, this.outputDataDrawer?.getUIDataPorts(true));
            Array.prototype.push.apply(dataPorts, this.inputLocalDataDrawer?.getUIDataPorts(true));
            if (this.outputLocalDataDrawer) {
                Array.prototype.push.apply(dataPorts, this.outputLocalDataDrawer.getUIDataPorts(true));
            }
            this.blocks.forEach(block => Array.prototype.push.apply(dataPorts, block.getUIDataPorts(undefined, true)));
            dataPorts.forEach(dataPort => dataPort.removePersistentLabel());
        }
        /**
         * Removes a comment from the graph.
         * @public
         * @param {UIComment} comment - The comment to remove.
         */
        removeComment(comment) {
            const index = this.comments.indexOf(comment);
            if (index !== -1) {
                comment.remove();
                this.comments.splice(index, 1);
                this.onUIChange();
            }
        }
        /**
         * Removes an array of comments from the graph.
         * @public
         * @param {UIComment[]} comments - The array of comments to remove.
         */
        removeComments(comments) {
            comments.forEach(comment => this.removeComment(comment));
        }
        /**
         * Removes a link from the graph.
         * @public
         * @param {UILink} link - The link to remove.
         * @returns {boolean} True if the link has been removed else false.
         */
        removeLink(link) {
            let result = false;
            const linkModel = link?.getModel();
            if (linkModel instanceof DataLink) {
                result = this.model.removeDataLink(linkModel);
            }
            else if (linkModel instanceof ControlLink) {
                result = this.model.removeControlLink(linkModel);
            }
            return result;
        }
        /**
         * Removes a list of links from the graph.
         * @public
         * @param {UILink[]} links - The list of links to remove.
         */
        removeLinks(links) {
            links.forEach(link => this.removeLink(link));
        }
        /**
         * Removes the provided block from the graph.
         * @public
         * @param {UIBlock} block - The block to remove.
         */
        removeBlock(block) {
            this.model.removeBlock(block.getModel());
        }
        /**
         * Removes a list of blocks from the graph.
         * @public
         * @param {UIBlock[]} blocks - The list of block to remove.
         */
        removeBlocks(blocks) {
            blocks.forEach(block => this.removeBlock(block));
        }
        /**
         * Removes the provided control port from its parent.
         * Removing a control port that doesn't belong to that graph is handled.
         * @private
         * @param {UIControlPort} controlPort - The control port to remove.
         */
        // eslint-disable-next-line class-methods-use-this
        _removeControlPort(controlPort) {
            const parent = controlPort.getParent();
            if (parent) {
                parent.getModel().removeControlPort(controlPort.getModel());
            }
        }
        /**
         * Removes a list of control ports.
         * Removing a control port that doesn't belong to that graph is handled.
         * @public
         * @param {UIControlPort[]} controlPorts - The list of control ports to remove.
         */
        removeControlPorts(controlPorts) {
            controlPorts.forEach(controlPort => this._removeControlPort(controlPort));
        }
        /**
         * Removes the provided data port from its parent.
         * Removing a data port that doesn't belong to that graph is handled.
         * @private
         * @param {UIDataPort} dataPort - The data port to remove.
         */
        _removeDataPort(dataPort) {
            if (dataPort) {
                if (dataPort.getModel()?.isOptional()) {
                    dataPort.setExposedState(false);
                    this.getEditor().getHistoryController().registerHideOptionalDataPortAction();
                }
                else {
                    const isSubDataPort = dataPort instanceof UISubDataPort;
                    const parent = isSubDataPort ? dataPort.getParentPort() : dataPort.getParent();
                    if (parent) {
                        parent.getModel().removeDataPort(dataPort.getModel());
                    }
                }
            }
        }
        /**
         * Removes a list of data ports.
         * Removing a data port that doesn't belong to that graph is handled.
         * public
         * @param {UIDataPort[]} dataPorts - The list of data ports to remove.
         */
        removeDataPorts(dataPorts) {
            dataPorts.forEach(dataPort => this._removeDataPort(dataPort));
        }
        /**
         * Removes the block at specified index.
         * @private
         * @param {number} index - The index of the block to remove.
         */
        _removeBlockAtIndex(index) {
            if (index < this.blocks.length) {
                const block = this.blocks[index];
                const breakpointController = this.editor.getBreakpointController();
                if (breakpointController) {
                    this.editor.getBreakpointController().unregisterBreakpoint(block);
                }
                block.remove();
                this.blocks.splice(index, 1);
            }
        }
        /**
         * Removes the control link at specified index.
         * @private
         * @param {number} index - The index of the control link to remove.
         */
        _removeControlLinkAtIndex(index) {
            if (index < this.controlLinks.length) {
                const controlLink = this.controlLinks[index];
                this.controlLinks.splice(index, 1);
                controlLink.remove();
            }
        }
        /**
         * Removes the data link at specified index.
         * @private
         * @param {number} index - The index of the data link to remove.
         */
        _removeDataLinkAtIndex(index) {
            if (index < this.dataLinks.length) {
                const dataLink = this.dataLinks[index];
                const startPort = dataLink.getStartPort();
                const endPort = dataLink.getEndPort();
                this.dataLinks.splice(index, 1);
                dataLink.remove();
                // Refreshes the display of the persistent labels
                const startPortLabel = startPort.getPersistentLabel();
                if (startPortLabel) {
                    startPortLabel.getView().refreshLabelDisplay();
                }
                const endPortLabel = endPort.getPersistentLabel();
                if (endPortLabel) {
                    endPortLabel.getView().refreshLabelDisplay();
                }
            }
        }
        /**
         * Removes the control port at specified index.
         * @public
         * @param {number} index - The index of the control port to remove.
         */
        removeControlPortAtIndex(index) {
            if (index < this.controlPorts.length) {
                const controlPort = this.controlPorts[index];
                this.controlPorts.splice(index, 1);
                controlPort.remove();
            }
        }
        /**
         * Removes all the blocks from the graph.
         * @private
         */
        _removeAllBlocks() {
            while (this.blocks.length > 0) {
                this._removeBlockAtIndex(0);
            }
        }
        /**
         * Removes all the control links from the graph.
         * @private
         */
        _removeAllControlLinks() {
            while (this.controlLinks.length > 0) {
                this._removeControlLinkAtIndex(0);
            }
        }
        /**
         * Removes all the data links from the graph.
         * @private
         */
        _removeAllDataLinks() {
            while (this.dataLinks.length > 0) {
                this._removeDataLinkAtIndex(0);
            }
        }
        /**
         * Removes all the control ports from the graph.
         * @private
         */
        _removeAllControlPorts() {
            while (this.controlPorts.length > 0) {
                this.removeControlPortAtIndex(0);
            }
        }
        /**
         * Removes the smart search.
         * @public
         */
        removeSmartSearch() {
            if (this.smartSearch !== undefined) {
                this.smartSearch.remove();
                this.smartSearch = undefined;
            }
        }
        /**
         * Removes a shortcut from the graph.
         * @public
         * @param {UIShortcut} shortcut - The shortcut to remove.
         * @param {boolean} [rerouteLinks=false] - True to retoute links on ref, default is false.
         */
        removeShortcut(shortcut, rerouteLinks = false) {
            const index = this.shortcuts.indexOf(shortcut);
            if (index !== -1) {
                shortcut.remove(rerouteLinks);
                this.shortcuts.splice(index, 1);
            }
        }
        /**
         * Removes a list of shortcuts.
         * @public
         * @param {UIShortcut[]} shortcuts - The list of shortcuts to remove.
         * @param {boolean} [rerouteLinks=false] - True to retoute links on ref, default is false.
         */
        removeShortcuts(shortcuts, rerouteLinks = false) {
            shortcuts.forEach(shortcut => this.removeShortcut(shortcut, rerouteLinks));
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           _   _ _____ _     ____  _____ ____  ____                             //
        //                          | | | | ____| |   |  _ \| ____|  _ \/ ___|                            //
        //                          | |_| |  _| | |   | |_) |  _| | |_) \___ \                            //
        //                          |  _  | |___| |___|  __/| |___|  _ < ___) |                           //
        //                          |_| |_|_____|_____|_|   |_____|_| \_\____/                            //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the maximum offset position available among the specified list of ports.
         * @private
         * @param {boolean} startPort - True for start port, false for end port.
         * @returns {number} the maximum offset position for the port.
         */
        _getMaxPortOffset(startPort) {
            let maxOffset = this.getPaddingTop();
            this.controlPorts.forEach(controlPort => {
                if (controlPort.getModel().isStartPort(this.model) === startPort) {
                    const offset = controlPort.getDisplay().offset;
                    if (offset > maxOffset) {
                        maxOffset = offset;
                    }
                }
            });
            return maxOffset + 30;
        }
        /**
         * Gets the UI block from the provided block model.
         * @public
         * @param {Block} blockModel - The block model.
         * @returns {UIBlock|undefined} The UI block.
         */
        getUIBlockFromModel(blockModel) {
            return this.blocks.find(block => block.getModel() === blockModel);
        }
        /**
         * Gets the UI control port from the provided control port model.
         * @public
         * @param {ControlPort} controlPortModel - The control port model.
         * @returns {UIControlPort|undefined} The UI control port.
         */
        getUIControlPortFromModel(controlPortModel) {
            return this.controlPorts.find(controlPort => controlPort.getModel() === controlPortModel);
        }
        /**
         * Gets the UI data port from the provided data port model.
         * @public
         * @param {DataPort} dataPortModel - The data port model.
         * @param {boolean} [isInputLocal] - True for input local data port, else false.
         * @returns {UIDataPort|undefined} The UI data port.
         */
        getUIDataPortFromModel(dataPortModel, isInputLocal) {
            const ports = this.getDataDrawer(dataPortModel.getType(), isInputLocal)?.getUIDataPorts(true);
            return ports?.find(port => port.getModel() === dataPortModel);
        }
        /**
         * Find the UI data port connected to the provided link model.
         * @private
         * @param {DataLink} dataLinkModel - The data link model.
         * @param {boolean} isStartPort - True for the start port, false for the end port.
         * @returns {UIDataPort|undefined} The found UI data port.
         */
        _findDataPort(dataLinkModel, isStartPort) {
            let port;
            const portModel = isStartPort ? dataLinkModel.getStartPort() : dataLinkModel.getEndPort();
            const blockModel = portModel.block;
            let block;
            if (blockModel === this.model) {
                const portType = portModel.getType();
                if (isStartPort) {
                    block = portType === ModelEnums.EDataPortType.eInput ? this.inputDataDrawer : this.inputLocalDataDrawer;
                }
                else {
                    block = portType === ModelEnums.EDataPortType.eOutput ? this.outputDataDrawer : this.outputLocalDataDrawer;
                }
            }
            else {
                block = this.getUIBlockFromModel(blockModel);
            }
            if (block !== undefined) {
                port = block.getUIDataPortFromModel(portModel);
                if (port === undefined) {
                    if (portModel.isOptional()) { // Expose optional data port so data links can be created!
                        port = block.getUIDataPortFromModel(portModel, true, true);
                        port.setExposedState(true);
                    }
                    else if (portModel.dataPort !== undefined) { // Fixing incremental build issue where subDataPort is reused on model only (exposed inside subgraph but not outside).
                        const parentPort = block.getUIDataPortFromModel(portModel.dataPort);
                        port = parentPort.createUIBlockSubDataPort(portModel, portModel.getIndex());
                    }
                }
            }
            return port;
        }
        /**
         * Gets the shortcuts start and end ports from the data link model.
         * @private
         * @param {DataLink} dataLinkModel - The data link model.
         * @returns {Object} The start and end shortcut ports.
         */
        _getShortcutPorts(dataLinkModel) {
            const shortcutPorts = {};
            const tempEdge = this._getTemporaryEdge(dataLinkModel);
            if (tempEdge !== undefined) {
                const startPort = tempEdge.cl1.c.data.uiElement;
                const endPort = tempEdge.cl2.c.data.uiElement;
                if (startPort instanceof UIShortcutDataPort) {
                    if (dataLinkModel.getStartPort() === startPort.getModel()) {
                        shortcutPorts.startPort = startPort;
                    }
                    else if (dataLinkModel.getEndPort() === startPort.getModel()) {
                        shortcutPorts.endPort = startPort;
                    }
                }
                if (endPort instanceof UIShortcutDataPort) {
                    if (dataLinkModel.getStartPort() === endPort.getModel()) {
                        shortcutPorts.startPort = endPort;
                    }
                    else if (dataLinkModel.getEndPort() === endPort.getModel()) {
                        shortcutPorts.endPort = endPort;
                    }
                }
            }
            return shortcutPorts;
        }
        /**
         * Gets the temporary edge corresponding to the data link model.
         * @private
         * @param {DataLink} dataLinkModel - The data link model.
         * @returns {EGraphCore.Edge|undefined} The temporary edge.
         */
        _getTemporaryEdge(dataLinkModel) {
            let tempEdge;
            const edges = this.viewer.getDisplay().edges;
            for (let edge = edges.first; edge; edge = edge.next) {
                const linkUI = edge.data.uiElement;
                if (linkUI instanceof UILink) {
                    const linkModel = linkUI.getModel();
                    if (linkModel.getStartPort() === undefined && linkModel.getEndPort() === undefined) {
                        const startPort = edge.cl1.c.data.uiElement;
                        const endPort = edge.cl2.c.data.uiElement;
                        if ((startPort.getModel() === dataLinkModel.getStartPort() && endPort.getModel() === dataLinkModel.getEndPort()) ||
                            (startPort.getModel() === dataLinkModel.getEndPort() && endPort.getModel() === dataLinkModel.getStartPort())) {
                            tempEdge = edge;
                            break;
                        }
                    }
                }
            }
            return tempEdge;
        }
        /**
         * Gets the control links bounding box.
         * @public
         * @param {boolean} fixedPath - True to limit the bounding box to fixed paths segment only else false.
         * @returns {EGraphUtils.BoundingRect} The control links bounding box.
         */
        getControlLinkBounds(fixedPath) {
            let bounds = { xmin: NaN, xmax: NaN, ymin: NaN, ymax: NaN };
            if (this.controlLinks.length > 0) {
                bounds = this.controlLinks[0].getBoundingBox(fixedPath);
                this.controlLinks.forEach(controlLink => {
                    const bb = controlLink.getBoundingBox(fixedPath);
                    bounds.xmin = UIMath.getMin(bb.xmin, bounds.xmin);
                    bounds.xmax = UIMath.getMax(bb.xmax, bounds.xmax);
                    bounds.ymin = UIMath.getMin(bb.ymin, bounds.ymin);
                    bounds.ymax = UIMath.getMax(bb.ymax, bounds.ymax);
                });
            }
            return bounds;
        }
        /**
         * Gets the control port minimum and maximum bounds top position.
         * @public
         * @returns {Object} The control port minimum and maximum bounds top position.
         */
        getControlPortBounds() {
            let bounds = { xmin: NaN, xmax: NaN, ymin: NaN, ymax: NaN };
            if (this.controlPorts.length > 0) {
                bounds.ymin = this.controlPorts[0].getTop();
                bounds.ymax = this.controlPorts[0].getTop() + UIGraphControlPortView.kPortHeight;
                this.controlPorts.forEach(controlPort => {
                    const min = controlPort.getTop();
                    const max = controlPort.getTop() + UIGraphControlPortView.kPortHeight;
                    bounds.ymin = min < bounds.ymin ? min : bounds.ymin;
                    bounds.ymax = max > bounds.ymax ? max : bounds.ymax;
                });
            }
            return bounds;
        }
        /**
         * Gets the minimum width of the graph width from the data drawers width.
         * @public
         * @returns {number} The minimum width of the graph.
         */
        getMinimumGraphWidthFromDrawers() {
            const inputWidth = this.inputDataDrawer !== undefined ? this.inputDataDrawer.getWidth() : 0;
            const outputWidth = this.outputDataDrawer !== undefined ? this.outputDataDrawer.getWidth() : 0;
            const localInputWidth = this.inputLocalDataDrawer !== undefined ? this.inputLocalDataDrawer.getWidth() : 0;
            const localOutputWidth = this.outputLocalDataDrawer !== undefined ? this.outputLocalDataDrawer.getWidth() : 0;
            const topWidth = this.getPaddingLeft() + localInputWidth + inputWidth + this.getPaddingRight();
            const bottomWidth = this.getPaddingRight() + outputWidth + localOutputWidth + this.getPaddingLeft();
            return topWidth > bottomWidth ? topWidth : bottomWidth;
        }
        /**
         * Gets the maximum width of the specified graph control ports.
         * @public
         * @param {ModelEnums.EControlPortType} [portType] - The control port type.
         * @returns {number} The control port maximum width.
         */
        getControlPortsMaxWidth(portType) {
            return Math.max.apply(Math, this.controlPorts.filter(controlPort => portType !== undefined ? controlPort.getModel().getType() === portType : true).map(controlPort => controlPort.getView().getBoundingBox().width));
        }
        /**
         * Gets the root graph of the graph.
         * @public
         * @returns {UIGraph} The root graph.
         */
        getRootGraph() {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let root = this;
            while (root.blockView !== undefined) {
                root = root.blockView.getGraph();
            }
            return root;
        }
        /**
         * Reroutes an UI Data Link by deleting the link and creating a new one at same index.
         * @public
         * @param {UIDataLink} dataLink - The UI Data Link to reroute.
         * @param {UIDataPort} startPort - The UI start port of the new link.
         * @param {UIDataPort} endPort - The UI end port of the new link.
         * @returns {UIDataLink} The rerouted new data link.
         */
        rerouteUIDataLink(dataLink, startPort, endPort) {
            const index = this.dataLinks.indexOf(dataLink);
            const model = dataLink.getModel();
            this._removeDataLinkAtIndex(index);
            const newDataLink = new UIDataLink(this, model);
            newDataLink.setStartPort(startPort);
            newDataLink.setEndPort(endPort);
            this.viewer.getDisplay().addEdge(startPort.getDisplay(), endPort.getDisplay(), newDataLink.getDisplay());
            this.dataLinks.splice(index, 0, newDataLink);
            return newDataLink;
        }
        /**
         * Set a default block position for each block in the graph.
         * @public
         */
        setDefaultBlocksPosition() {
            const startBlocks = [];
            this.blocks.forEach(block => {
                const predecessors = Tools.getFirstControlPredecessors(block.getModel(), true, false);
                if (predecessors.length === 0 || predecessors.indexOf(this.model) !== -1) {
                    startBlocks.push(block);
                }
            });
            const xSpace = 50, ySpace = 50;
            let processedBlock = [];
            const setLinePositions = (block, posX, posY) => {
                processedBlock.push(block);
                block.setPosition(posX, posY);
                const successors = Tools.getFirstControlSuccessors(block.getModel(), true, false);
                const newPosX = posX + block.getWidth() + xSpace;
                let newPosY = posY;
                successors.forEach(successor => {
                    const successorUI = this.getUIBlockFromModel(successor);
                    if (successorUI && processedBlock.indexOf(successorUI) === -1) {
                        newPosY = setLinePositions(successorUI, newPosX, newPosY);
                        newPosY = newPosY + ySpace;
                    }
                });
                posY = Math.max(posY + block.getHeight(), newPosY - ySpace);
                return posY;
            };
            let startPosX = 60, startPosY = 50;
            startBlocks.forEach(block => { startPosY = setLinePositions(block, startPosX, startPosY) + ySpace; });
            this.blocks.forEach(block => {
                if (processedBlock.indexOf(block) === -1) {
                    startPosY = setLinePositions(block, startPosX, startPosY) + ySpace;
                }
            });
            this.updateSizeFromBlocks();
        }
        /**
         * Gets the next available block's position related to another block's position.
         * @public
         * @param {number} top - The top position of the block in the graph.
         * @param {number} left - The left position of the block in the graph.
         * @returns {IDomPosition} The next available top and left position.
         */
        getAvailableBlockPosition(top, left) {
            let nextTop = top, nextLeft = left, found = true, offset = 20;
            if (this.blocks.length > 0) {
                nextTop += offset;
                nextLeft += offset;
                while (found) {
                    for (let i = 0; i < this.blocks.length; i++) {
                        const position = this.blocks[i].getPosition();
                        if (position.top === nextTop && position.left === nextLeft) {
                            nextTop += offset;
                            nextLeft += offset;
                            found = true;
                            break;
                        }
                        else {
                            found = false;
                        }
                    }
                }
            }
            return { top: nextTop, left: nextLeft };
        }
        /**
         * Updates the graph size when the control ports position exceed the graph borders.
         * @public
         * @returns {boolean} True if the graph size has been updated else false.
         */
        updateSizeFromControlPorts() {
            let updated = false;
            if (this.controlPorts.length > 0) {
                let offsetMin = this.controlPorts[0].getOffset();
                let offsetMax = this.controlPorts[0].getOffset();
                for (let cp = 1; cp < this.controlPorts.length; cp++) {
                    const offset = this.controlPorts[cp].getOffset();
                    offsetMax = offset > offsetMax ? offset : offsetMax;
                    offsetMin = offset < offsetMin ? offset : offsetMin;
                }
                const geometry = this.display.geometry;
                if (offsetMax + UIGraphControlPortView.kPortHeight > geometry.height - this.getPaddingBottom()) {
                    this.display.setPath(['geometry', 'height'], offsetMax + UIGraphControlPortView.kPortHeight + this.getPaddingBottom());
                    updated = true;
                }
                if (offsetMin < this.getPaddingTop()) {
                    const diff = this.getPaddingTop() - offsetMin;
                    this.viewer.getDisplay().updateLock();
                    try {
                        this.display.multiset(['geometry', 'top'], geometry.top - diff, ['geometry', 'height'], geometry.height + diff);
                        this.controlPorts.forEach(controlPort => controlPort.setOffset(controlPort.getOffset() + diff));
                    }
                    finally {
                        this.viewer.getDisplay().updateUnlock();
                    }
                    updated = true;
                }
            }
            return updated;
        }
        /**
         * Updates the graph size according to the data drawers width.
         * @public
         */
        updateSizeFromDataDrawers() {
            const minWidth = this.getMinimumGraphWidthFromDrawers();
            const geometry = this.display.geometry;
            if (geometry.width < minWidth) {
                this.display.setPath(['geometry', 'width'], minWidth);
            }
            else {
                this.getView().updateDataDrawersPosition();
            }
        }
        /**
         * Unexpose all drawer sub data ports.
         * @public
         */
        unexposeAllDrawerSubDataPorts() {
            if (this.inputDataDrawer !== undefined) {
                this.inputDataDrawer.unexposeAllUISubDataPorts();
            }
            if (this.outputDataDrawer !== undefined) {
                this.outputDataDrawer.unexposeAllUISubDataPorts();
            }
            if (this.inputLocalDataDrawer !== undefined) {
                this.inputLocalDataDrawer.unexposeAllUISubDataPorts();
            }
            if (this.outputLocalDataDrawer !== undefined) {
                this.outputLocalDataDrawer.unexposeAllUISubDataPorts();
            }
        }
        /**
         * Updates the graph size only when the blocks positions exceed the graph borders.
         * @public
         * @returns {boolean} True if the graph size has been updated else false.
         */
        updateSizeFromBlocks() {
            let updated = false;
            if (this.display !== undefined) {
                const gg = this.display.geometry;
                const cb = this.display.childrenBounds;
                const options = this.viewer.getEditor().getOptions();
                const cbxMin = options.gridSnapping ? UIMath.snapValue(cb.xmin) : cb.xmin;
                const cbyMin = options.gridSnapping ? UIMath.snapValue(cb.ymin) : cb.ymin;
                const cbxMax = options.gridSnapping ? UIMath.snapValue(cb.xmax) : cb.xmax;
                const cbyMax = options.gridSnapping ? UIMath.snapValue(cb.ymax) : cb.ymax;
                if (gg.left > cbxMin - this.getPaddingLeft()) {
                    this.display.multiset(['geometry', 'left'], cbxMin - this.getPaddingLeft(), ['geometry', 'width'], gg.width + gg.left - cbxMin + this.getPaddingLeft());
                    updated = true;
                }
                if (gg.top > cbyMin - this.getPaddingTop()) {
                    this.display.multiset(['geometry', 'top'], cbyMin - this.getPaddingTop(), ['geometry', 'height'], gg.height + gg.top - cbyMin + this.getPaddingTop());
                    updated = true;
                }
                if (gg.left + gg.width < cbxMax + this.getPaddingRight()) {
                    this.display.setPath(['geometry', 'width'], cbxMax - gg.left + this.getPaddingRight());
                    updated = true;
                }
                if (gg.top + gg.height < cbyMax + this.getPaddingBottom()) {
                    this.display.setPath(['geometry', 'height'], cbyMax - gg.top + this.getPaddingBottom());
                    updated = true;
                }
            }
            return updated;
        }
        /**
         * Reduces the graph size according to blocks positions.
         * @public
         */
        reduceGraphSize() {
            if (this.display !== undefined) {
                const graphBounds = this.display.childrenBounds;
                const options = this.viewer.getEditor().getOptions();
                const cbxMin = (options.gridSnapping ? UIMath.snapValue(graphBounds.xmin) : graphBounds.xmin) || 0;
                const cbxMax = (options.gridSnapping ? UIMath.snapValue(graphBounds.xmax) : graphBounds.xmax) || 0;
                const left = cbxMin - this.getPaddingLeft();
                const minWidth = this.getMinimumGraphWidthFromDrawers();
                let width = (cbxMax - cbxMin) + this.getPaddingLeft() + this.getPaddingRight();
                width = width < minWidth ? minWidth : width;
                const cpBounds = this.getControlPortBounds();
                const clBounds = this.getControlLinkBounds(true);
                let ymin = UIMath.getMin(graphBounds.ymin, cpBounds.ymin);
                let ymax = UIMath.getMax(graphBounds.ymax, cpBounds.ymax);
                ymin = UIMath.getMin(clBounds.ymin, ymin);
                ymax = UIMath.getMax(clBounds.ymax, ymax);
                const initialTop = this.display.actualTop;
                const top = ymin - this.getPaddingTop();
                const offsetDiff = initialTop - top;
                const height = (ymax - ymin) + this.getPaddingTop() + this.getPaddingBottom();
                this.getViewer().getDisplay().updateLock();
                try {
                    this.display.multiset(['geometry', 'left'], left, ['geometry', 'width'], width, ['geometry', 'top'], top, ['geometry', 'height'], height);
                    this.getControlPorts().forEach(cp => cp.setOffset(UIMath.snapValue(cp.getOffset() + offsetDiff)));
                }
                finally {
                    this.getViewer().getDisplay().updateUnlock();
                }
                this.getViewer().centerView();
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           _    _   _    _    _  __   ____________ ____                         //
        //                          / \  | \ | |  / \  | | \ \ / /__  / ____|  _ \                        //
        //                         / _ \ |  \| | / _ \ | |  \ V /  / /|  _| | |_) |                       //
        //                        / ___ \| |\  |/ ___ \| |___| |  / /_| |___|  _ <                        //
        //                       /_/   \_\_| \_/_/   \_\_____|_| /____|_____|_| \_\                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Analyzes the graph.
         * @puublic
         */
        analyze() {
            if (this.getGraphAnalyzerState()) {
                this.analyzeGraphLoops();
            }
        }
        /**
         * Gets the graph analyzer state.
         * @public
         * @returns {boolean} True if the graph analyzer is activated else false.
         */
        getGraphAnalyzerState() {
            return this.graphAnalyserState;
        }
        /**
         * Sets the graph analyzer state.
         * @public
         * @param {boolean} state - True to activate the graph analyzer else false.
         */
        setGraphAnalyzerState(state) {
            this.graphAnalyserState = state;
            if (state) {
                this.analyzeGraphLoops();
            }
            else {
                this._clearAnalyzedGraphLoops();
            }
        }
        /**
         * Analyzes the graph loops.
         * @public
         */
        analyzeGraphLoops() {
            this._clearAnalyzedGraphLoops();
            this.controlLoopBlocks = this._showAnalyzedGraphLoops(Tools.findGraphControlLoops, false, 'Infinite control loop detected!');
            this.dataLoopBlocks = this._showAnalyzedGraphLoops(Tools.findGraphDataLoops, true, 'Infinite data loop detected!');
            this.controlWaitingDataBlocks = this._showAnalyzedGraphLoops(Tools.findGraphControlWaitingData, true, 'Block is waiting for unreachable data!');
        }
        /**
         * Clears the analyzed graph loops.
         * @private
         */
        _clearAnalyzedGraphLoops() {
            this._hideAnalyzedGraphLoops(this.controlLoopBlocks);
            this._hideAnalyzedGraphLoops(this.dataLoopBlocks);
            this._hideAnalyzedGraphLoops(this.controlWaitingDataBlocks);
        }
        /**
         * Shows the analyzed graph loops.
         * @private
         * @param {Function} findFct - The global analyzer find function.
         * @param {boolean} isError - True if the message should be considered as error else false.
         * @param {string} message - The message to be displayed.
         * @returns {Array<UIBlock[]>} The list of UI blocks involved in a graph loop.
         */
        _showAnalyzedGraphLoops(findFct, isError, message) {
            const graphLoops = [];
            const loops = findFct(this.model, false);
            loops.forEach(blocks => {
                const lUIBlocks = [];
                blocks.forEach(blockModel => {
                    const blockUI = this.getUIBlockFromModel(blockModel);
                    if (blockUI) {
                        blockUI.getView().showInfoIcon(isError, message);
                        lUIBlocks.push(blockUI);
                    }
                });
                if (lUIBlocks.length > 0) {
                    graphLoops.push(lUIBlocks);
                }
            });
            return graphLoops;
        }
        /**
         * Hides the info icon of the provided analyzed graph loop blocks.
         * @private
         * @param {UIBlock[][]} analyzedBlocks - The list of analyzed blocks.
         */
        // eslint-disable-next-line class-methods-use-this
        _hideAnalyzedGraphLoops(analyzedBlocks) {
            analyzedBlocks.forEach(blocks => blocks.forEach(block => block.getView().hideInfoIcon()));
            analyzedBlocks = [];
        }
        /**
         * Selects the blocks concerned by the analyzed graph loops.
         * @public
         * @param {UIBlock} blockUI - The UI block.
         */
        selectAnalyzedGraphLoops(blockUI) {
            let analyzedBlocks = this._getMatchingErrorBlocks(this.controlWaitingDataBlocks, blockUI);
            analyzedBlocks = analyzedBlocks.length > 0 ? analyzedBlocks : this._getMatchingErrorBlocks(this.dataLoopBlocks, blockUI);
            analyzedBlocks = analyzedBlocks.length > 0 ? analyzedBlocks : this._getMatchingErrorBlocks(this.controlLoopBlocks, blockUI);
            this.viewer.clearSelection();
            analyzedBlocks.forEach(block => this.viewer.addToSelection(block.getDisplay()));
        }
        /**
         * Gets the matching error blocks from the given block list and block reference.
         * @private
         * @param {UIBlock[][]} errorBlocks - The list of error blocks.
         * @param {UIBlock} blockUI - The error block reference.
         * @returns {UIBlock[]} The list of matching error blocks.
         */
        // eslint-disable-next-line class-methods-use-this
        _getMatchingErrorBlocks(errorBlocks, blockUI) {
            let analyzedBlocks = [];
            for (let eb = 0; eb < errorBlocks.length && analyzedBlocks.length === 0; eb++) {
                const blocks = errorBlocks[eb];
                for (let b = 0; b < blocks.length && analyzedBlocks.length === 0; b++) {
                    const block = blocks[b];
                    if (block === blockUI) {
                        analyzedBlocks = blocks;
                    }
                }
            }
            return analyzedBlocks;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                _   _ ___ ____ _   _ _     ___ ____ _   _ _____ ___ _   _  ____                 //
        //               | | | |_ _/ ___| | | | |   |_ _/ ___| | | |_   _|_ _| \ | |/ ___|                //
        //               | |_| || | |  _| |_| | |    | | |  _| |_| | | |  | ||  \| | |  _                 //
        //               |  _  || | |_| |  _  | |___ | | |_| |  _  | | |  | || |\  | |_| |                //
        //               |_| |_|___\____|_| |_|_____|___\____|_| |_| |_| |___|_| \_|\____|                //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Highlights elements corresponding to the provided model occurences.
         * @public
         * @param {(DataPort|EventPort)[]} modelOccurences - The model occurences to highlight.
         * @param {ModelEnums.ESeverity} severity - The severity of the compatibility.
         */
        highlightUIElementsFromModel(modelOccurences, severity) {
            let dataPorts = [];
            modelOccurences.forEach(model => {
                if (model instanceof DataPort) {
                    const parentModel = model.block;
                    if (parentModel === this.model) { // Is current graph ?
                        const dataPortUI = this.getUIDataPortFromModel(model, true);
                        if (dataPortUI) {
                            dataPorts = dataPorts.concat(dataPortUI);
                            if (this.outputLocalDataDrawer !== undefined && model.getType() === ModelEnums.EDataPortType.eLocal) {
                                const dpOutputLocalUI = this.getUIDataPortFromModel(model, false);
                                if (dpOutputLocalUI) {
                                    dataPorts = dataPorts.concat(dpOutputLocalUI);
                                }
                            }
                        }
                    }
                    else if (parentModel?.graph === this.model) { // Is block ?
                        const blockUI = this.getUIBlockFromModel(parentModel);
                        if (blockUI) {
                            const dataPortUI = blockUI.getUIDataPortFromModel(model);
                            dataPorts = dataPortUI ? dataPorts.concat(dataPortUI) : dataPorts;
                        }
                    }
                } // TODO: Manage EventPort highlight!
            });
            dataPorts.forEach(dataPort => dataPort.compatibilityHighlight(severity));
        }
        /**
         * Highlights the compatible UI data ports.
         * @public
         * @param {UIDataPort} dataPort - The source UI data port.
         */
        highlightCompatibleDataPorts(dataPort) {
            const compatiblePorts = this._getCompatibleDataPorts(dataPort);
            compatiblePorts.forEach(compatiblePort => compatiblePort.compatibilityHighlight(ModelEnums.ESeverity.eSuccess));
            const compatiblePortsWithChange = this._getCompatibleDataPorts(dataPort, [], true);
            // Highlight ports with change only
            const compatiblePortsWithChangeOnly = compatiblePortsWithChange.filter(compatiblePortWithChange => compatiblePorts.indexOf(compatiblePortWithChange) === -1);
            compatiblePortsWithChangeOnly.forEach(compatiblePortWithChangeOnly => compatiblePortWithChangeOnly.compatibilityHighlight(ModelEnums.ESeverity.eWarning));
        }
        /**
         * Highlights the compatible UI data ports from a list of UI data ports.
         * @public
         * @param {UIDataPort[]} dataPorts - The source list of UI data ports.
         * @param {DataLink[]} [ignoredLinks] - The list of model data links to ignore during the check.
         */
        highlightCompatibleDataPortsFromList(dataPorts, ignoredLinks) {
            let compatiblePorts = [];
            // Get compatible ports list for each data port
            const arrayList = dataPorts.map(dataPort => this._getCompatibleDataPorts(dataPort, ignoredLinks));
            // Intersection on each array to reduce possible ports
            if (arrayList.length > 0) {
                compatiblePorts = arrayList[0];
                for (let i = 1; i < arrayList.length; i++) {
                    compatiblePorts = UITools.arrayIntersection(compatiblePorts, arrayList[i]);
                }
            }
            compatiblePorts.forEach(compatiblePort => compatiblePort.compatibilityHighlight(ModelEnums.ESeverity.eSuccess));
            let compatiblePortsWithChange = [];
            // Get compatible ports list with change for each data port
            const arrayListWithChange = dataPorts.map(dataPort => this._getCompatibleDataPorts(dataPort, ignoredLinks, true));
            // Intersection on each array with change to reduce possible ports
            if (arrayListWithChange.length > 0) {
                compatiblePortsWithChange = arrayListWithChange[0];
                for (let i = 1; i < arrayListWithChange.length; i++) {
                    compatiblePortsWithChange = UITools.arrayIntersection(compatiblePortsWithChange, arrayListWithChange[i]);
                }
            }
            // Highlight ports with change only
            const compatiblePortsWithChangeOnly = compatiblePortsWithChange.filter(compatiblePortWithChange => compatiblePorts.indexOf(compatiblePortWithChange) === -1);
            compatiblePortsWithChangeOnly.forEach(compatiblePortWithChangeOnly => compatiblePortWithChangeOnly.compatibilityHighlight(ModelEnums.ESeverity.eWarning));
        }
        /**
         * Unhighlights every UI block data ports in the current graph.
         * @public
         */
        unhighlightCompatibleDataPorts() {
            this.blocks.forEach(block => {
                block.getUIDataPorts(undefined, true).forEach(dataPort => dataPort.compatibilityUnhighlight());
            });
            this.inputDataDrawer.getUIDataPorts(true).forEach(dataPort => dataPort.compatibilityUnhighlight());
            this.outputDataDrawer.getUIDataPorts(true).forEach(dataPort => dataPort.compatibilityUnhighlight());
            this.inputLocalDataDrawer.getUIDataPorts(true).forEach(dataPort => dataPort.compatibilityUnhighlight());
            if (this.outputLocalDataDrawer !== undefined) {
                this.outputLocalDataDrawer.getUIDataPorts(true).forEach(dataPort => dataPort.compatibilityUnhighlight());
            }
            this.shortcuts.forEach(shortcut => shortcut.getShortcutDataPort().compatibilityUnhighlight());
        }
        /**
         * Gets the list of compatible UI data ports according to their cast level.
         * @private
         * @param {UIDataPort} dataPort - The source UI data port.
         * @param {DataLink[]} [ignoredLinks] - The list of model data links to ignore during the check.
         * @param {boolean} [withChange] - If the data port needs a change to be compatible.
         * @returns {UIDataPort[]} The list of compatible UI data ports.
         */
        _getCompatibleDataPorts(dataPort, ignoredLinks, withChange) {
            let compatiblePorts = [];
            this.blocks.forEach(block => {
                compatiblePorts = compatiblePorts.concat(this._getCompatibleDataPortsFromList(dataPort, block.getUIDataPorts(undefined, true), ignoredLinks, withChange));
            });
            compatiblePorts = compatiblePorts.concat(this._getCompatibleDataPortsFromList(dataPort, this.inputDataDrawer.getUIDataPorts(true), ignoredLinks, withChange));
            compatiblePorts = compatiblePorts.concat(this._getCompatibleDataPortsFromList(dataPort, this.outputDataDrawer.getUIDataPorts(true), ignoredLinks, withChange));
            compatiblePorts = compatiblePorts.concat(this._getCompatibleDataPortsFromList(dataPort, this.inputLocalDataDrawer.getUIDataPorts(true), ignoredLinks, withChange));
            if (this.outputLocalDataDrawer !== undefined) {
                compatiblePorts = compatiblePorts.concat(this._getCompatibleDataPortsFromList(dataPort, this.outputLocalDataDrawer.getUIDataPorts(true), ignoredLinks, withChange));
            }
            if (!(dataPort instanceof UIShortcutDataPort)) {
                compatiblePorts = compatiblePorts.concat(this._getCompatibleDataPortsFromList(dataPort, this.shortcuts.map(shortcut => shortcut.getShortcutDataPort()), ignoredLinks, withChange));
            }
            return compatiblePorts;
        }
        /**
         * Gets the compatible data port list from the provided data port list.
         * @private
         * @param {UIDataPort} dataPortRef - The UI data port reference.
         * @param {UIDataPort[]} dataPorts - The UI data port list.
         * @param {DataLink[]} [ignoredLinks] - The list of model data links to ignore during the check.
         * @param {boolean} [withChange] - If the data port needs a change to be compatible.
         * @returns {UIDataPort[]} The list of compatible data ports.
         */
        _getCompatibleDataPortsFromList(dataPortRef, dataPorts, ignoredLinks, withChange) {
            const compatibleDataPorts = [];
            dataPorts.forEach(dataPort => {
                if (this.isDataPortLinkable(dataPortRef, dataPort, ignoredLinks, withChange)) {
                    compatibleDataPorts.push(dataPort);
                }
            });
            return compatibleDataPorts;
        }
        /**
         * Checks if the provided data ports are linkable.
         * @public
         * @param {UIDataPort} dataPort1 - The source UI data port.
         * @param {UIDataPort} dataPort2 - The target UI data port.
         * @param {DataLink[]} [ignoredLinks] - The list of model data links to ignore during the check.
         * @param {boolean} [withChange] - If the data port needs a change to be compatible.
         * @returns {boolean} True if the data ports are linkable else false.
         */
        isDataPortLinkable(dataPort1, dataPort2, ignoredLinks, withChange) {
            if (dataPort1 instanceof UIShortcutDataPort) {
                if (dataPort2 instanceof UIShortcutDataPort) {
                    return false;
                }
                return this.isDataPortLinkable(dataPort1.getParent().getDataPortUI(), dataPort2, ignoredLinks, withChange);
            }
            else if (dataPort2 instanceof UIShortcutDataPort) {
                return this.isDataPortLinkable(dataPort1, dataPort2.getParent().getDataPortUI(), ignoredLinks, withChange);
            }
            else if (dataPort1 instanceof UIGraphDataPort) {
                if (dataPort1.getModel().getType() === ModelEnums.EDataPortType.eLocal) {
                    if (dataPort1.getInputLocalState() && !dataPort2.getModel().isEndPort(dataPort1.getModel().block)) {
                        return false;
                    }
                    else if (!dataPort1.getInputLocalState() && !dataPort2.getModel().isStartPort(dataPort1.getModel().block)) {
                        return false;
                    }
                }
            }
            else if (dataPort2 instanceof UIGraphDataPort) {
                return this.isDataPortLinkable(dataPort2, dataPort1, ignoredLinks, withChange);
            }
            return this.model.isDataLinkable(dataPort1.getModel(), dataPort2.getModel(), ignoredLinks, withChange);
        }
        /**
         * Highlights the shortcuts of the specified UI data port.
         * @public
         * @param {UIDataPort} dataPort - The UI data port.
         */
        highlightShortcuts(dataPort) {
            this.shortcuts.forEach(shortcut => {
                if (shortcut.getDataPortModel() === dataPort.getModel()) {
                    shortcut.getShortcutDataPort().highlight();
                }
            });
        }
        /**
         * Unhighlights the shortcuts of the specified UI data port.
         * @public
         * @param {UIDataPort} dataPort - The UI data port.
         */
        unhighlightShortcuts(dataPort) {
            this.shortcuts.forEach(shortcut => {
                if (shortcut.getDataPortModel() === dataPort.getModel()) {
                    shortcut.getShortcutDataPort().unhighlight();
                }
            });
        }
        /**
         * Hides all blocks halo.
         * @public
         */
        hideAllBlocksHalo() {
            this.blocks.forEach(block => block.getView().hideHalo());
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                   ____  _     ___   ____ _  __  __     _____ _______        __                 //
        //                  | __ )| |   / _ \ / ___| |/ /  \ \   / /_ _| ____\ \      / /                 //
        //                  |  _ \| |  | | | | |   | ' /    \ \ / / | ||  _|  \ \ /\ / /                  //
        //                  | |_) | |__| |_| | |___| . \     \ V /  | || |___  \ V  V /                   //
        //                  |____/|_____\___/ \____|_|\_\     \_/  |___|_____|  \_/\_/                    //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the block view associated to this graph.
         * @public
         * @returns {UIGraphBlock|undefined} The block view associated to this graph.
         */
        getBlockView() {
            return this.blockView;
        }
        /**
         * Sets the block view associated to this graph.
         * @public
         * @param {UIGraphBlock} blockView - The block view associated to this graph.
         */
        setBlockView(blockView) {
            this.blockView = blockView;
        }
        /**
         * Removes the block view associated to this graph.
         * @private
         */
        _removeBlockView() {
            if (this.blockView) {
                this.blockView.setGraphView(undefined, false);
            }
            this.blockView = undefined;
        }
    }
    return UIGraph;
});
