/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIBlockView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIMath", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockControlPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockEventPort", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBlockDialog", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortVisibilityDialog", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileSaver", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock"], function (require, exports, UINode, UIBlockView, UIMath, UIDom, UIBlockControlPort, UIBlockDataPort, UIBlockEventPort, UIBlockDialog, UIDataPortVisibilityDialog, UICommand, UICommandType, UIFileSaver, UITools, Events, EventPort, ModelEnums, Tools, JoinAllBlock) {
    "use strict";
    /**
     * This class defines a UI Block.
     * @private
     * @class UIBlock
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlocks
     * @extends UINode
     */
    class UIBlock extends UINode {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph that owns this block.
         * @param {Block} model - The block model.
         * @param {number} left - The left position of the block.
         * @param {number} top - The top position of the block.
         * @param {IUIBlockViewCtr} [ViewCtr] - The optional block view constructor.
         */
        constructor(graph, model, left, top, ViewCtr) {
            super({ graph: graph, isDraggable: true });
            this._dataPorts = [];
            this._controlPorts = [];
            this._visibilityDialog = new UIDataPortVisibilityDialog(this.getEditor(), this);
            this._fileSaver = new UIFileSaver();
            this._onBlockNameChangeCB = this._onBlockNameChange.bind(this);
            this._onDataPortAddCB = this._onDataPortAdd.bind(this);
            this._onDataPortRemoveCB = this._onDataPortRemove.bind(this);
            this._onControlPortAddCB = this._onControlPortAdd.bind(this);
            this._onControlPortRemoveCB = this._onControlPortRemove.bind(this);
            this._onSettingAddCB = this._onSettingAdd.bind(this);
            this._onSettingRemoveCB = this._onSettingRemove.bind(this);
            this._onBlockNodeIdSelectorChangeCB = this._onBlockNodeIdSelectorChange.bind(this);
            this._onSettingNameChangeCB = this._onSettingNameChange.bind(this);
            this._onSettingValueChangeCB = this._onSettingValueChange.bind(this);
            this._onSettingOverrideChangeCB = this._onSettingOverrideChange.bind(this);
            this._kBorderToExecPortSize = 20;
            this._kBorderToParamPortSize = 20;
            this._kExecPortToPortSize = 40;
            this._kParamPortToPortSize = 20;
            this._model = model;
            this._configurationDialog = new UIBlockDialog(this);
            // Configure block display
            const view = ViewCtr ? new ViewCtr(this) : new UIBlockView(this);
            this.setView(view);
            this._display.data.name = this._model.getName();
            this._display.customPropertyFlags = {
                name: 1 /* EGraphCore.PropertyFlag.VIEW */
            };
            this.setPosition(left, top);
            this._model.addListener(Events.BlockNameChangeEvent, this._onBlockNameChangeCB);
            this._model.addListener(Events.DataPortAddEvent, this._onDataPortAddCB);
            this._model.addListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            this._model.addListener(Events.ControlPortAddEvent, this._onControlPortAddCB);
            this._model.addListener(Events.ControlPortRemoveEvent, this._onControlPortRemoveCB);
            this._model.addListener(Events.SettingAddEvent, this._onSettingAddCB);
            this._model.addListener(Events.SettingRemoveEvent, this._onSettingRemoveCB);
            this._model.addListener(Events.BlockNodeIdSelectorChangeEvent, this._onBlockNodeIdSelectorChangeCB);
            this._model.getSettings().forEach(setting => {
                setting.addListener(Events.SettingNameChangeEvent, this._onSettingNameChangeCB);
                setting.addListener(Events.SettingValueChangeEvent, this._onSettingValueChangeCB);
                setting.addListener(Events.SettingOverrideChangeEvent, this._onSettingOverrideChangeCB);
            });
            this._buildFromModel();
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
         * Removes the node from its parent graph.
         * @public
         * @override
         */
        remove() {
            if (this._visibilityDialog !== undefined) {
                this._visibilityDialog.remove();
                this._visibilityDialog = undefined;
            }
            if (this._model !== undefined) {
                this._model.getSettings().forEach(setting => {
                    setting.removeListener(Events.SettingNameChangeEvent, this._onSettingNameChangeCB);
                    setting.removeListener(Events.SettingValueChangeEvent, this._onSettingValueChangeCB);
                    setting.removeListener(Events.SettingOverrideChangeEvent, this._onSettingOverrideChangeCB);
                });
                this._model.removeListener(Events.BlockNameChangeEvent, this._onBlockNameChangeCB);
                this._model.removeListener(Events.DataPortAddEvent, this._onDataPortAddCB);
                this._model.removeListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
                this._model.removeListener(Events.ControlPortAddEvent, this._onControlPortAddCB);
                this._model.removeListener(Events.ControlPortRemoveEvent, this._onControlPortRemoveCB);
                this._model.removeListener(Events.SettingAddEvent, this._onSettingAddCB);
                this._model.removeListener(Events.SettingRemoveEvent, this._onSettingRemoveCB);
                this._model.removeListener(Events.BlockNodeIdSelectorChangeEvent, this._onBlockNodeIdSelectorChangeCB);
            }
            this._dataPorts.forEach(dataPort => dataPort.remove());
            this._controlPorts.forEach(controlPort => controlPort.remove());
            this._graph.getViewer().getContextualBarController().clearCommands();
            if (this._configurationDialog) {
                this._configurationDialog.remove();
                this._configurationDialog = undefined;
            }
            this._model = undefined;
            this._fileSaver = undefined;
            this._dataPorts = undefined;
            this._controlPorts = undefined;
            this._onBlockNameChangeCB = undefined;
            this._onDataPortAddCB = undefined;
            this._onDataPortRemoveCB = undefined;
            this._onControlPortAddCB = undefined;
            this._onControlPortRemoveCB = undefined;
            this._onSettingAddCB = undefined;
            this._onSettingRemoveCB = undefined;
            this._onBlockNodeIdSelectorChangeCB = undefined;
            this._onSettingNameChangeCB = undefined;
            this._onSettingValueChangeCB = undefined;
            this._onSettingOverrideChangeCB = undefined;
            super.remove();
        }
        /**
         * Gets the main view of the node.
         * @public
         * @override
         * @returns {UIBlockView} The main view of the node.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the viewer of the block.
         * @public
         * @returns {UIViewer} The viewer of the block.
         */
        getViewer() {
            return this._graph.getViewer();
        }
        /**
         * Gets the optional data ports visibility dialog.
         * @public
         * @returns {UIDataPortVisibilityDialog} The optional data ports visibility dialog.
         */
        getOptionalDataPortsVisibilityDialog() {
            return this._visibilityDialog;
        }
        /**
         * Projects the specified JSON object to the block.
         * @public
         * @param {IJSONBlockUI} iJSONBlock - The JSON projected block.
         */
        fromJSON(iJSONBlock) {
            if (iJSONBlock) {
                if (iJSONBlock.left !== undefined && iJSONBlock.top !== undefined) {
                    this.setPosition(iJSONBlock.left, iJSONBlock.top);
                }
                if (iJSONBlock.dataPorts) {
                    this.getUIDataPorts(undefined, false, true).forEach((dataPortUI, index) => {
                        dataPortUI.fromJSON(iJSONBlock.dataPorts?.[index]);
                    });
                }
            }
        }
        /**
         * Projects the block to the specified JSON object.
         * @public
         * @param {IJSONBlockUI} oJSONBlock - The JSON projected block.
         */
        toJSON(oJSONBlock) {
            if (oJSONBlock !== undefined) {
                oJSONBlock.top = this.getActualTop();
                oJSONBlock.left = this.getActualLeft();
                oJSONBlock.dataPorts = [];
                this.getUIDataPorts(undefined, false, true).forEach(dataPortUI => {
                    const oJSONDataPort = {};
                    dataPortUI.toJSON(oJSONDataPort);
                    oJSONBlock.dataPorts?.push(oJSONDataPort);
                });
            }
        }
        /**
         * Saves the block to JSON.
         * Used by the clipboard when copying a block.
         * @public
         * @returns {IJSONBlockCopyPaste} The JSON representing the saved block.
         */
        save() {
            const json = {
                model: {},
                ui: {}
            };
            this._model.toJSON(json.model);
            this.toJSON(json.ui);
            return json;
        }
        /**
         * Loads a block from the given JSON object.
         * Used by the clipboard when pasting a block.
         * @public
         * @param {object} model - The JSON model projected block.
         * @param {IJSONBlockUI} ui - The JSON ui projected block.
         */
        load(model, ui) {
            this._model.fromJSON(model);
            this.fromJSON(ui);
        }
        /**
         * Sets the block position relative to its parent graph.
         * @public
         * @override
         * @param {number} left - The left position of the block.
         * @param {number} top - The top position of the block.
         */
        setPosition(left, top) {
            const editor = this._graph.getEditor();
            const gridSnapping = editor !== undefined ? editor.getOptions().gridSnapping : false;
            const posLeft = gridSnapping ? UIMath.snapValue(left) : left;
            const posTop = gridSnapping ? UIMath.snapValue(top) : top;
            if (this._display.top !== posTop || this._display.left !== posLeft) {
                this._graph.onUIChange();
            }
            super.setPosition(posLeft, posTop);
        }
        /**
         * Computes the height of the block according to its control port list.
         * @public
         */
        computeHeight() {
            const blockView = this.getView();
            if (blockView.getElement() !== undefined) {
                // Compute the ports height
                const controlIn = this._model.getControlPorts(ModelEnums.EControlPortType.eInput);
                const controlInEvent = this._model.getControlPorts(ModelEnums.EControlPortType.eInputEvent);
                const controlOut = this._model.getControlPorts(ModelEnums.EControlPortType.eOutput);
                const controlOutEvent = this._model.getControlPorts(ModelEnums.EControlPortType.eOutputEvent);
                const controlInCount = controlIn.length + controlInEvent.length;
                const controlOutCount = controlOut.length + controlOutEvent.length;
                let maxPorts = (controlInCount > controlOutCount) ? controlInCount : controlOutCount;
                maxPorts = maxPorts > 0 ? maxPorts - 1 : 0;
                const portHeight = this._kBorderToExecPortSize * 2 + this._kExecPortToPortSize * maxPorts;
                //const height = portHeight > minHeight ? portHeight : minHeight;
                // Impose a minimum block height
                const minHeight = UIDom.getComputedStyleMinDimension(blockView.getElement()).height;
                const height = minHeight > portHeight ? minHeight : portHeight;
                // Set the block height
                this._display.set('height', height);
                // Dispatch each control ports
                this._dispatchControlPorts();
            }
        }
        /**
         * Computes the width of the block according to its data port list.
         * @public
         */
        computeWidth() {
            const blockView = this.getView();
            if (blockView.getElement() !== undefined) {
                // Get the minimum block width
                const leftWidth = UIDom.getComputedStyleBBox(blockView.getBlockContainerLeftElement()).width;
                const rightWidth = UIDom.getComputedStyleBBox(blockView.getBlockContainerRightElement()).width;
                const middleWidth = UIDom.getComputedStyleBBox(blockView.getBlockNameElement()).width;
                const blockBorderWidth = UIDom.getComputedStyleBorderWidth(blockView.getElement());
                let width = blockBorderWidth.left + leftWidth + middleWidth + rightWidth + blockBorderWidth.right;
                // Compute the ports width
                const dataInCount = this.getUIDataPortsMultiTypes([ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal], true).length;
                const dataOutCount = this.getUIDataPorts(ModelEnums.EDataPortType.eOutput, true).length;
                let maxPorts = (dataInCount > dataOutCount) ? dataInCount : dataOutCount;
                maxPorts = maxPorts > 0 ? maxPorts - 1 : 0;
                const portWidth = this._kBorderToParamPortSize * 2 + this._kParamPortToPortSize * maxPorts;
                width = width > portWidth ? width : portWidth;
                // Impose a minimum block width
                const minWidth = UIDom.getComputedStyleMinDimension(blockView.getElement()).width;
                width = width > minWidth ? width : minWidth;
                width = UIMath.upperSnapValue(width, 20);
                // Set the block width
                this._display.set('width', width);
                // Dispatch the data ports
                this._dispatchDataPortsByType([ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal]);
                this._dispatchDataPortsByType([ModelEnums.EDataPortType.eOutput]);
            }
        }
        /**
         * Opens the block configuration dialog.
         * @public
         */
        openConfigurationDialog() {
            this._configurationDialog.open();
        }
        /**
         * The callback on the block double click event.
         * @public
         */
        onBlockDblClick() {
            this.openConfigurationDialog();
        }
        /**
         * The callback on the block info icon click event.
         * @public
         */
        onInfoIconClick() {
            this._graph.selectAnalyzedGraphLoops(this);
        }
        /**
         * The callback on the block category icon click event.
         * @public
         */
        onCategoryIconClick() {
            this._openBlockDocumentation();
        }
        /**
         * The callback on the block breakpoint icon click event.
         * @public
         */
        onBreakpointIconClick() {
            this.toggleBreakpoint();
        }
        /**
         * Gets the block model.
         * @public
         * @returns {Block} The block model.
         */
        getModel() {
            return this._model;
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {UICommand[]} The list of available commands.
         */
        getCommands() {
            const commands = super.getCommands();
            const viewer = this._graph.getViewer();
            const isReadOnly = viewer.isReadOnly();
            const isDebuggable = UITools.isBlockDataPortDebuggable(this.getEditor(), this._model);
            commands.push(new UICommand(isDebuggable ? UICommandType.eDebug : UICommandType.eEdit, this.openConfigurationDialog.bind(this)));
            commands.push(new UICommand(UICommandType.eOpenBlockDocumentation, this._openBlockDocumentation.bind(this)));
            if (this._model.isExportable() && !isReadOnly) {
                const sessionStorageController = this.getEditor().getSessionStorageController();
                const exportJSBlock = sessionStorageController.getHiddenSettingValue('exportJSBlock');
                const fileName = this._model.exportFileName();
                if (exportJSBlock || fileName.endsWith('.json')) {
                    commands.push(new UICommand(UICommandType.eExportBlock, () => { this.exportBlock(); }));
                }
            }
            if (this._model instanceof JoinAllBlock) {
                commands.push(new UICommand(UICommandType.eShowBlockPredecessors, () => {
                    const blocks = Tools.getAllControlPredecessors(this._model);
                    blocks.forEach(block => this.getGraph().getUIBlockFromModel(block)?.getView().showHalo());
                }));
            }
            if (this._model.hasOptionalDataPort() && !isReadOnly) {
                commands.push(new UICommand(UICommandType.eEditOptionalDataPorts, event => {
                    this._visibilityDialog.setMousePosition({ left: event.clientX, top: event.clientY });
                    this._visibilityDialog.open();
                }));
            }
            if (!isReadOnly) {
                commands.push(new UICommand(UICommandType.eRemove, viewer.deleteSelection.bind(viewer)));
            }
            return commands;
        }
        /**
         * Exports the block if it is exportable.
         * @public
         */
        exportBlock() {
            if (this._model.isExportable()) {
                const sessionStorageController = this.getEditor().getSessionStorageController();
                const exportJSBlock = sessionStorageController.getHiddenSettingValue('exportJSBlock');
                const fileName = this._model.exportFileName();
                if (exportJSBlock || fileName.endsWith('.json')) {
                    const jsonUI = {
                        top: undefined,
                        left: undefined,
                        dataPorts: []
                    };
                    this.toJSON(jsonUI);
                    const modelContent = this._model.exportContent();
                    const jsonModel = JSON.parse(modelContent);
                    jsonModel.ui = jsonUI;
                    const fileContent = JSON.stringify(jsonModel, undefined, 2);
                    this._fileSaver.saveTextFile(fileContent, fileName);
                }
            }
        }
        /**
         * Gets the block file saver.
         * @public
         * @returns {UIFileSaver} The block file saver.
         */
        getFileSaver() {
            return this._fileSaver;
        }
        /**
         * Gets the create graph from selection command.
         * @public
         * @returns {UICommand} The created command.
         */
        getCreateGraphFromSelectionCommand() {
            const viewer = this._graph.getViewer();
            return new UICommand(UICommandType.eCreateGraphFromSelection, viewer.createGraphFromSelection.bind(viewer));
        }
        /**
         * Gets the create CSI graph from selection command.
         * @public
         * @returns {UICommand} The created command.
         */
        getCreateCSIGraphFromSelectionCommand() {
            const viewer = this._graph.getViewer();
            return new UICommand(UICommandType.eCreateCSIGraphFromSelection, viewer.createCSIGraphFromSelection.bind(viewer));
        }
        /**
         * Gets the block UI control ports.
         * @public
         * @returns {UIBlockControlPort[]} The block UI control ports.
         */
        getUIControlPorts() {
            return this._controlPorts;
        }
        /**
         * Gets the list of block UI data ports.
         * If portType is undefined then the whole UI data ports list will be returned.
         * @public
         * @param {ModelEnums.EDataPortType} [portType] - The data port type.
         * @param {boolean} [includeSubDataPorts=false] - True to include sub data ports else false.
         * @param {boolean} [includeUnexposed=false] - True to include unexposed data ports else false.
         * @returns {UIDataPort[]} The list of block UI data ports.
         */
        getUIDataPorts(portType, includeSubDataPorts = false, includeUnexposed = false) {
            return this.getUIDataPortsMultiTypes(portType !== undefined ? [portType] : undefined, includeSubDataPorts, includeUnexposed);
        }
        /**
         * Gets the list of block UI data ports.
         * If portTypes is undefined then the whole UI data ports list will be returned.
         * @public
         * @param {ModelEnums.EDataPortType[]} [portTypes] - The data port types.
         * @param {boolean} [includeSubDataPorts=false] - True to include sub data ports else false.
         * @param {boolean} [includeUnexposed=false] - True to include unexposed data ports else false.
         * @returns {UIDataPort[]} The list of block UI data ports.
         */
        getUIDataPortsMultiTypes(portTypes, includeSubDataPorts = false, includeUnexposed = false) {
            let dataPorts = [];
            this._dataPorts.filter(dp => !includeUnexposed ? dp.isExposed() === true : true).forEach(dataPort => {
                if (portTypes === undefined || portTypes.includes(dataPort.getModel().getType())) {
                    dataPorts.push(dataPort);
                    if (includeSubDataPorts) {
                        const subDataPorts = includeUnexposed ? dataPort.getAllSubDataPorts() : dataPort.getExposedSubDataPorts();
                        dataPorts = dataPorts.concat(subDataPorts);
                    }
                }
            });
            return dataPorts;
        }
        /**
         * Gets the list of block UI data links.
         * If portType is undefined then all the block data link list will be returned.
         * @public
         * @param {ModelEnums.EDataPortType} [portType] - The data port type.
         * @returns {UIDataLink[]} The list of block UI datalinks.
         */
        getUIDataLinks(portType) {
            return this.getUIDataLinksMultiTypes(portType !== undefined ? [portType] : undefined);
        }
        /**
         * Gets the list of block UI data links.
         * If portTypes is undefined then all the block data link list will be returned.
         * @public
         * @param {ModelEnums.EDataPortType[]} [portTypes] - The data port types.
         * @returns {UIDataLink[]} The list of block UI datalinks.
         */
        getUIDataLinksMultiTypes(portTypes) {
            const dataLinks = [];
            this._dataPorts.forEach(dataPort => {
                if (portTypes === undefined || portTypes.includes(dataPort.getModel().getType())) {
                    dataLinks.push(dataPort.getLinks());
                }
            });
            return UIDom.flatDeep(dataLinks);
        }
        /**
         * Gets the list of block UI control links.
         * If portType is undefined then all the block control link list will be returned.
         * @public
         * @param {ModelEnums.EControlPortType} [portType] - The control port type.
         * @returns {ControlLink[]} The list of block model control links.
         */
        getUIControlLinks(portType) {
            let controlLinks = [];
            this._controlPorts.forEach(controlPort => {
                if (portType === undefined || controlPort.getModel().getType() === portType) {
                    controlLinks.push(controlPort.getModel().getControlLinks());
                }
            });
            return UIDom.flatDeep(controlLinks);
        }
        /**
         * Gets the UI data port or sub data port from the provided data port model.
         * @public
         * @param {DataPort} dataPortModel - The data port model.
         * @param {boolean} [includeSubDataPorts=false] - True to include sub data ports else false.
         * @param {boolean} [includeUnexposed=false] - True to include unexposed data ports else false.
         * @returns {UIDataPort|undefined} The UI data port.
         */
        getUIDataPortFromModel(dataPortModel, includeSubDataPorts = true, includeUnexposed = false) {
            const dataPorts = this.getUIDataPorts(dataPortModel.getType(), includeSubDataPorts, includeUnexposed);
            return dataPorts.find(dataPort => dataPort.getModel() === dataPortModel);
        }
        /**
         * Gets the UI control port from the provided control port model.
         * @public
         * @param {ControlPort} controlPortModel - The control port model.
         * @returns {UIControlPort|undefined} The UI control port.
         */
        getUIControlPortFromModel(controlPortModel) {
            return this._controlPorts.find(controlPort => controlPort.getModel() === controlPortModel);
        }
        /**
         * Gets the configuration dialog.
         * @public
         * @returns {UIBlockDialog} The block configuration dialog.
         */
        getConfigurationDialog() {
            return this._configurationDialog;
        }
        /**
         * Gets the editor.
         * @public
         * @returns {UIEditor} The editor.
         */
        getEditor() {
            return this.getGraph().getEditor();
        }
        /**
         * Toggles the breakpoint on the block.
         * @public
         */
        toggleBreakpoint() {
            if (this.getEditor()._areBreakpointsEnabled()) {
                const breakpointController = this.getEditor().getBreakpointController();
                if (breakpointController.hasBreakpoint(this)) {
                    this.getView().hideBreakpoint();
                    breakpointController.unregisterBreakpoint(this);
                }
                else {
                    this.getView().showBreakpoint();
                    breakpointController.registerBreakpoint(this);
                }
            }
        }
        /**
         * Automatic expand data ports according to the maxSplitDataPort editor setting.
         * The logic is all or nothing:
         * - If the number of input data ports + the number of their sub data ports exceed maxSplitDataPort value,
         *   then we don't expand any data ports else we expand every thing.
         * - If the number of output data ports + the number of their sub data ports exceed maxSplitDataPort value,
         *   then we don't expand any data ports else we expand every thing.
         * @public
         */
        automaticExpandDataPorts() {
            const maxSplitDataPort = this._graph.getEditor().getLocalStorageController().getMaxSplitDataPortCountEditorSetting();
            const inputDataPorts = this.getUIDataPortsMultiTypes([ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal], false);
            let inputSubDataPortCount = inputDataPorts.length;
            for (let idp = 0; (idp < inputDataPorts.length) && (inputSubDataPortCount <= maxSplitDataPort); idp++) {
                const iValueTypeDescriptor = inputDataPorts[idp].getValueTypeDescriptor();
                inputSubDataPortCount += Object.keys(iValueTypeDescriptor).length;
            }
            if (inputSubDataPortCount <= maxSplitDataPort) {
                const outputDataPorts = this.getUIDataPorts(ModelEnums.EDataPortType.eOutput, false);
                let outputDataPortCount = outputDataPorts.length;
                for (let odp = 0; (odp < outputDataPorts.length) && (outputDataPortCount <= maxSplitDataPort); odp++) {
                    const oValueTypeDescriptor = outputDataPorts[odp].getValueTypeDescriptor();
                    outputDataPortCount += Object.keys(oValueTypeDescriptor).length;
                }
                if (outputDataPortCount <= maxSplitDataPort) {
                    inputDataPorts.forEach(inputDataPort => inputDataPort.getModel().expand());
                    outputDataPorts.forEach(outputDataPort => outputDataPort.getModel().expand());
                }
            }
            this._graph.updateSizeFromBlocks();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the model data port add event.
         * @protected
         * @param {Events.DataPortAddEvent} event - The model data port add event.
         * @returns {boolean} True if the data port has been added else false.
         */
        _onDataPortAdd(event) {
            let result = false;
            const dataPortModel = event.getDataPort();
            if (dataPortModel.getType() !== ModelEnums.EDataPortType.eLocal) {
                const dataPort = new UIBlockDataPort(this, dataPortModel);
                this._dataPorts.push(dataPort);
                this.appendConnector(dataPort);
                this.computeWidth();
                result = true;
            }
            this.getGraph().updateSizeFromBlocks();
            this.getGraph().onModelChange();
            return result;
        }
        /**
         * The callback on the model data port remove event.
         * @protected
         * @param {Events.DataPortRemoveEvent} event - The model data port remove event.
         * @returns {boolean} True if the data port has been removed else false.
         */
        _onDataPortRemove(event) {
            let result = false;
            const dataPortModel = event.getDataPort();
            const dataPortType = dataPortModel.getType();
            if (dataPortType !== ModelEnums.EDataPortType.eLocal) {
                const dataPorts = this.getUIDataPorts(dataPortType);
                const index = event.getIndexByType();
                this._removeUIDataPort(dataPorts[index]);
                result = true;
            }
            this.getGraph().onModelChange();
            return result;
        }
        /**
         * The callback on the model control port add event.
         * @protected
         * @param {Events.ControlPortAddEvent} event - The model control port add event.
         */
        _onControlPortAdd(event) {
            const controlPortModel = event.getControlPort();
            const isEventPort = controlPortModel instanceof EventPort;
            const UIBlockPortCtr = isEventPort ? UIBlockEventPort : UIBlockControlPort;
            const controlPort = new UIBlockPortCtr(this, controlPortModel);
            this._controlPorts.push(controlPort);
            this.appendConnector(controlPort);
            this.computeHeight();
            this.getGraph().updateSizeFromBlocks();
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the model control port remove event.
         * @protected
         * @param {Events.ControlPortRemoveEvent} event - The model control port remove event.
         */
        _onControlPortRemove(event) {
            const index = event.getIndex();
            const controlPort = this._controlPorts[index];
            controlPort.remove();
            this._controlPorts.splice(index, 1);
            this.computeHeight();
            this.getGraph().onModelChange();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Opens the block documentation.
         * @private
         */
        _openBlockDocumentation() {
            const uid = this._model.getUid();
            const blockLibraryPanel = this._graph.getEditor().getBlockLibraryPanel();
            blockLibraryPanel.open(() => {
                blockLibraryPanel.getBlockLibraryDataGridView().selectBlock(uid);
            });
        }
        /**
         * Dispatches the control ports along the block height.
         * @private
         */
        _dispatchControlPorts() {
            let inputIndex = 0, outputIndex = 0;
            this._controlPorts.forEach(controlPort => {
                if (controlPort.isStartPort()) {
                    controlPort.setOffset(this._kBorderToExecPortSize + inputIndex * this._kExecPortToPortSize);
                    inputIndex++;
                }
                else {
                    controlPort.setOffset(this._kBorderToExecPortSize + outputIndex * this._kExecPortToPortSize);
                    outputIndex++;
                }
            });
        }
        /**
         * Dispatches the data ports from the provided type
         * along the block width.
         * @private
         * @param {ModelEnums.EDataPortType[]} portTypes - The data port types.
         */
        _dispatchDataPortsByType(portTypes) {
            const dataPorts = this.getUIDataPortsMultiTypes(portTypes, true);
            const centerIndex = Math.floor(dataPorts.length / 2);
            const isEven = dataPorts.length % 2 === 0;
            const center = this._display.width / 2;
            const gap = this._kParamPortToPortSize;
            dataPorts.forEach((dataPort, index) => {
                let offset;
                if (index < centerIndex) {
                    if (isEven) {
                        const diff = centerIndex - index - 1;
                        offset = center - (gap / 2) - (diff * gap);
                    }
                    else {
                        const diff = centerIndex - index;
                        offset = center - diff * gap;
                    }
                }
                else {
                    const diff = index - centerIndex;
                    if (isEven) {
                        offset = center + (gap / 2) + (diff * gap);
                    }
                    else {
                        offset = center + diff * gap;
                    }
                }
                dataPort.setOffset(offset);
            });
        }
        /**
         * Builds the UI block from the model.
         * @private
         */
        _buildFromModel() {
            const dataPortsModel = this._model.getDataPorts();
            dataPortsModel.forEach(dataPortModel => {
                if (dataPortModel.getType() !== ModelEnums.EDataPortType.eLocal) {
                    const dataPortUI = new UIBlockDataPort(this, dataPortModel);
                    this._dataPorts.push(dataPortUI);
                    this.appendConnector(dataPortUI);
                }
            });
            const controlPortsModel = this._model.getControlPorts();
            controlPortsModel.forEach(controlPortModel => {
                const isEventPort = controlPortModel instanceof EventPort;
                const UIBlockPortCtr = isEventPort ? UIBlockEventPort : UIBlockControlPort;
                const controlPortUI = new UIBlockPortCtr(this, controlPortModel);
                this._controlPorts.push(controlPortUI);
                this.appendConnector(controlPortUI);
            });
            this.computeWidth();
            this.computeHeight();
        }
        /**
         * The callback on the model block name change event.
         * @private
         * @param {Events.BlockNameChangeEvent} event - The model block name change event.
         */
        _onBlockNameChange(event) {
            this._display.setPath(['data', 'name'], event.getName());
            this.computeWidth();
            this.getGraph().updateSizeFromBlocks();
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the model setting add event.
         * @private
         * @param {Events.SettingAddEvent} event - The model setting add event.
         */
        _onSettingAdd(event) {
            const setting = event.getSetting();
            setting.addListener(Events.SettingNameChangeEvent, this._onSettingNameChangeCB);
            setting.addListener(Events.SettingValueChangeEvent, this._onSettingValueChangeCB);
            setting.addListener(Events.SettingOverrideChangeEvent, this._onSettingOverrideChangeCB);
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the model setting remove event.
         * @private
         * @param {Events.SettingRemoveEvent} event - The model setting remove event.
         */
        _onSettingRemove(event) {
            const setting = event.getSetting();
            setting.removeListener(Events.SettingNameChangeEvent, this._onSettingNameChangeCB);
            setting.removeListener(Events.SettingValueChangeEvent, this._onSettingValueChangeCB);
            setting.removeListener(Events.SettingOverrideChangeEvent, this._onSettingOverrideChangeCB);
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the model setting name change event.
         * @private
         */
        _onSettingNameChange() {
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the model setting value change event.
         * @private
         */
        _onSettingValueChange() {
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the model setting override change event.
         * @private
         */
        _onSettingOverrideChange() {
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the block nodeId selector change event.
         * @private
         */
        _onBlockNodeIdSelectorChange() {
            const nodeIdSelectorsPanel = this._graph.getEditor().getNodeIdSelectorsPanel();
            if (nodeIdSelectorsPanel.isOpen() === true) {
                nodeIdSelectorsPanel.colorizeBlock(this);
            }
            this.getGraph().onModelChange();
        }
        /**
         * Removes the given UI data port from the block.
         * @private
         * @param {UIBlockDataPort} dataPortUI - The UI data port.
         */
        _removeUIDataPort(dataPortUI) {
            const index = this._dataPorts.indexOf(dataPortUI);
            if (index !== -1) {
                const dataPort = this._dataPorts[index];
                dataPort.remove();
                this._dataPorts.splice(index, 1);
                this.computeWidth();
            }
        }
    }
    return UIBlock;
});
