/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphBlock'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphBlock", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUITemplatableBlock", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateLibrary", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsCSI/EPSSchematicsCSIGraphFunctionBlock"], function (require, exports, UITemplatableBlock, UITemplateLibrary, UICommand, UICommandType, UITools, Events, ModelEnums, Tools, CSIGraphFunctionBlock) {
    "use strict";
    /**
     * This class defines a UI graph block.
     * @private
     * @class UIGraphBlock
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphBlock
     * @extends UIBlock
     */
    class UIGraphBlock extends UITemplatableBlock {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph that owns this block.
         * @param {GraphBlock| CSIGraphFunctionBlock} model - The block model.
         * @param {number} left - The left position of the block.
         * @param {number} top - The top position of the block.
         */
        constructor(graph, model, left, top) {
            super(graph, model, left, top);
            this._onSubDataPortAddCB = this._onSubDataPortAdd.bind(this);
            this._onSubDataPortRemoveCB = this._onSubDataPortRemove.bind(this);
            const jsonObjectModel = {};
            model.toJSON(jsonObjectModel);
            const jsonModel = JSON.stringify(jsonObjectModel);
            const jsonObjectDefinition = {};
            model.getDefinition().toJSON(jsonObjectDefinition);
            const jsonDefinition = JSON.stringify(jsonObjectDefinition, (key, value) => key === 'startupPort' ? undefined : value);
            this._isCSIGraphFunctionBlock = this._model instanceof CSIGraphFunctionBlock;
            if (jsonModel === jsonDefinition && !this._isCSIGraphFunctionBlock) {
                // Add a default output control port
                model.createDynamicControlPort(ModelEnums.EControlPortType.eOutput, 'Out');
            }
            // The build from model exposes all sub data port sby default!
            // So we hide by default all the not linked sub data ports!
            // The JSON with sub data ports configuration is loaded afterwards by the fromJSON of the graph.
            this._dataPorts.forEach(dataPort => dataPort.unexposeAllUISubDataPorts());
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
            this._model.getDataPorts().forEach(dataPort => {
                if (dataPort.getType() !== ModelEnums.EDataPortType.eLocal) {
                    this._removeDataPortListeners(dataPort);
                }
            });
            this._graphView = undefined;
            this._jsonUIGraph = undefined;
            this._isCSIGraphFunctionBlock = undefined;
            this._onSubDataPortAddCB = undefined;
            this._onSubDataPortRemoveCB = undefined;
            super.remove();
        }
        /**
         * Gets the graph block model.
         * @public
         * @override
         * @returns {GraphBlock} The graph block model.
         */
        getModel() {
            return super.getModel();
        }
        /**
         * Projects the specified JSON object to the block.
         * @public
         * @override
         * @param {IJSONGraphUI} iJSONBlock - The JSON projected block.
         */
        fromJSON(iJSONBlock) {
            super.fromJSON(iJSONBlock);
            this._dataPorts.forEach((dataPort, index) => dataPort.fromJSON(iJSONBlock.dataPorts?.[index]));
            this._jsonUIGraph = JSON.parse(JSON.stringify(iJSONBlock));
            if (this._jsonUIGraph) {
                delete this._jsonUIGraph.left;
                delete this._jsonUIGraph.top;
            }
        }
        /**
         * Projects the block to the specified JSON object.
         * @public
         * @override
         * @param {IJSONGraphUI} oJSONBlock - The JSON projected block.
         */
        toJSON(oJSONBlock) {
            super.toJSON(oJSONBlock);
            // Update the JSON with the current graph viewer content
            if (this._graphView !== undefined) {
                this._jsonUIGraph = {};
                this._graphView.toJSON(this._jsonUIGraph);
            }
            // Fill the oJSONBlock with copied properties (must keep oJSONBlock instance)!
            if (this._jsonUIGraph !== undefined) {
                // We merge the object because we need to keep exposed label present on oJSONBlock
                UITools.mergeObjectWithArray(oJSONBlock, this._jsonUIGraph);
            }
            // Updates the outside graph block sub data port exposition state
            const dataPorts = oJSONBlock.dataPorts || [];
            this._dataPorts.forEach((dataPort, dp) => {
                if (dataPorts[dp] === undefined) {
                    dataPorts[dp] = {
                        dataPorts: []
                    };
                }
                dataPort.getAllSubDataPorts().forEach((subDataPort, sdp) => {
                    if (dataPorts[dp].dataPorts === undefined) {
                        dataPorts[dp].dataPorts = [];
                    }
                    if (dataPorts[dp].dataPorts[sdp] === undefined) {
                        dataPorts[dp].dataPorts[sdp] = { inside: { show: false } };
                    }
                    dataPorts[dp].dataPorts[sdp].outside = { show: subDataPort.isExposed() };
                });
            });
            oJSONBlock.dataPorts = dataPorts;
        }
        /**
         * The callback on the block double click event.
         * @public
         * @override
         */
        onBlockDblClick() {
            if (!this._model.isTemplate()) {
                this.openGraphBlockViewer();
                this._graph.getViewer().getEditor().getHistoryController().registerViewerChangeAction();
            }
        }
        /**
         * Flattens the graph block.
         * @public
         */
        flattenGraphBlock() {
            if (!this._isCSIGraphFunctionBlock) {
                Tools.createBlocksFromGraphBlock(this._model);
            }
        }
        /**
         * Opens the graph block viewer.
         * @public
         */
        openGraphBlockViewer() {
            if (!this._model.isTemplate()) {
                const viewerController = this._graph.getViewer().getEditor().getViewerController();
                if (this._isCSIGraphFunctionBlock) {
                    viewerController.createGraphFunctionViewer(this, this._model);
                }
                else {
                    viewerController.createGraphBlockViewer(this);
                }
            }
        }
        /**
         * Gets the block graph view if it is opened.
         * @public
         * @returns {UIGraph|undefined} The block graph view.
         */
        getGraphView() {
            return this._graphView;
        }
        /**
         * Gets the JSON graph block UI.
         * @public
         * @returns {IJSONGraphUI|undefined} THe JSON graph block UI.
         */
        getJSONGraphBlockUI() {
            return this._jsonUIGraph;
        }
        /**
         * Sets the graph view of this block.
         * @public
         * @param {UIGraph|undefined} graphView - The graph view of this block.
         * @param {boolean} updateGraphView - True to update the graph view.
         */
        setGraphView(graphView, updateGraphView) {
            this._graphView = graphView;
            if (updateGraphView && this._graphView) {
                if (this._jsonUIGraph !== undefined) {
                    this._graphView.fromJSONDataPorts(this._jsonUIGraph);
                }
                else {
                    this._graphView.setDefaultBlocksPosition();
                    this._graphView.unexposeAllDrawerSubDataPorts();
                }
            }
        }
        /**
         * Checks whether the graph view is opened.
         * @public
         * @returns {boolean} True if the graph view is opened else false.
         */
        isGraphViewOpened() {
            return this._graphView !== undefined;
        }
        /**
         * Removes the graph view of this block.
         * @public
         */
        removeGraphView() {
            this._jsonUIGraph = {};
            if (this._graphView) {
                this._graphView.toJSON(this._jsonUIGraph);
            }
            this._graphView = undefined;
        }
        /**
         * Gets the internal sub data port exposed state.
         * @public
         * @param {number} dataPortIndex - The index of the data port.
         * @param {number} subDataPortIndex - The index of the sub data port.
         * @returns {boolean} True if the sub data port is exposed else false.
         */
        getInternalSubDataPortExposedState(dataPortIndex, subDataPortIndex) {
            let state = false;
            if (this._jsonUIGraph) {
                const jsonSubDataPort = this._jsonUIGraph.dataPorts?.[dataPortIndex].dataPorts[subDataPortIndex];
                if (jsonSubDataPort?.inside) {
                    state = jsonSubDataPort.inside.show;
                }
            }
            return state;
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
         * Gets the list of available templatable block related commands.
         * @protected
         * @override
         * @returns {UICommand[]} The list of available templatable block related commands.
         */
        _getCommandsFromTemplatableBlock() {
            const commands = super._getCommandsFromTemplatableBlock();
            const isReadOnly = this._graph.getViewer().isReadOnly();
            if (!isReadOnly) {
                commands.unshift(new UICommand(UICommandType.eOpen, this.onBlockDblClick.bind(this)));
                if (!this._isCSIGraphFunctionBlock) {
                    commands.push(new UICommand(UICommandType.eFlattenGraph, this.flattenGraphBlock.bind(this)));
                }
            }
            return commands;
        }
        /**
         * Creates a local template from the block.
         * @protected
         */
        _createLocalTemplate() {
            if (!this._model.isTemplate()) {
                this._graph.getLocalTemplateLibrary().registerGraph(this);
            }
        }
        /**
         * Creates a global template from the block.
         * @protected
         */
        _createGlobalTemplate() {
            if (!this._model.isTemplate()) {
                UITemplateLibrary.registerGraph(this);
            }
        }
        /**
         * Converts the local template reference of the block to a global template reference.
         * @protected
         */
        _convertLocalTemplateToGlobalTemplate() {
            if (this._model.isLocalTemplate()) {
                const templateUid = this._model.getUid();
                UITemplateLibrary.registerGraphFromLocal(templateUid, this._graph.getGraphContext());
            }
        }
        /**
         * Edits the template reference.
         * This will impact all the template instances.
         * @protected
         */
        _editTemplateReference() {
            if (this._model.isTemplate()) {
                const isLocalTemplate = this._model.isLocalTemplate();
                const templateUid = this._model.getUid();
                const graphContext = this._graph.getGraphContext();
                this._graph.getViewer().getEditor().getViewerController().createGraphTemplateViewer(templateUid, isLocalTemplate, graphContext);
            }
        }
        /**
         * The callback on the model control port remove event.
         * @protected
         * @override
         * @param {Events.ControlPortRemoveEvent} event - The model control port remove event.
         */
        _onControlPortRemove(event) {
            if (this._jsonUIGraph !== undefined && this._jsonUIGraph.controlPorts !== undefined) {
                // Removes the control port from the JSON to delete previous UI definition.
                const index = event.getIndex();
                if (index > -1) {
                    this._jsonUIGraph.controlPorts.splice(index, 1);
                }
            }
            super._onControlPortRemove(event);
        }
        /**
         * The callback on the model data port add event.
         * @protected
         * @override
         * @param {Events.DataPortAddEvent} event - The model data port add event.
         * @returns {boolean} True if the data port has been added else false.
         */
        _onDataPortAdd(event) {
            const result = super._onDataPortAdd(event);
            const dataPortModel = event.getDataPort();
            if (dataPortModel.getType() !== ModelEnums.EDataPortType.eLocal) {
                this._addDataPortListeners(dataPortModel);
                if (this._jsonUIGraph !== undefined) {
                    const index = event.getIndex();
                    this._jsonUIGraph.dataPorts?.splice(index, 0, { dataPorts: [] });
                }
            }
            return result;
        }
        /**
         * The callback on the model data port remove event.
         * @protected
         * @override
         * @param {Events.DataPortRemoveEvent} event - The model data port remove event.
         * @returns {boolean} True if the data port has been removed else false.
         */
        _onDataPortRemove(event) {
            const dataPortModel = event.getDataPort();
            if (dataPortModel.getType() !== ModelEnums.EDataPortType.eLocal) {
                this._removeDataPortListeners(dataPortModel);
                if (this._jsonUIGraph !== undefined) {
                    const index = event.getIndex();
                    this._jsonUIGraph.dataPorts?.splice(index, 1);
                }
            }
            return super._onDataPortRemove(event);
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
         * Sdds listeners on the provided model data port.
         * @private
         * @param {DataPort} dataPortModel - The model data port.
         */
        _addDataPortListeners(dataPortModel) {
            dataPortModel.addListener(Events.DataPortAddEvent, this._onSubDataPortAddCB);
            dataPortModel.addListener(Events.DataPortRemoveEvent, this._onSubDataPortRemoveCB);
        }
        /**
         * Removes listeners from the provided model data port.
         * @private
         * @param {DataPort} dataPortModel - The model data port.
         */
        _removeDataPortListeners(dataPortModel) {
            dataPortModel.removeListener(Events.DataPortAddEvent, this._onSubDataPortAddCB);
            dataPortModel.removeListener(Events.DataPortRemoveEvent, this._onSubDataPortRemoveCB);
        }
        /**
         * The callback on the sub data port add event.
         * @private
         * @param {Events.DataPortAddEvent} event - The model sub data port add event.
         */
        _onSubDataPortAdd(event) {
            if (this._jsonUIGraph !== undefined) {
                const subDataPortModel = event.getDataPort();
                if (subDataPortModel.dataPort !== undefined) { // Fix model to ignore main data port
                    const parentDataPortModel = subDataPortModel.dataPort;
                    const parentIndex = parentDataPortModel.block.getDataPorts().indexOf(parentDataPortModel);
                    const index = event.getIndex();
                    const isInside = this.isGraphViewOpened();
                    this._jsonUIGraph.dataPorts?.[parentIndex].dataPorts.splice(index, 0, {
                        outside: !isInside ? { show: true } : undefined,
                        inside: isInside ? { show: true } : undefined
                    });
                }
            }
        }
        /**
         * The callback on the sub data port remove event.
         * @private
         * @param {Events.DataPortRemoveEvent} event - The model sub data port remove event.
         */
        _onSubDataPortRemove(event) {
            if (this._jsonUIGraph !== undefined) {
                const subDataPortModel = event.getDataPort();
                if (subDataPortModel.dataPort !== undefined) { // Fix model to ignore main data port
                    const parentDataPortModel = subDataPortModel.dataPort;
                    const parentIndex = parentDataPortModel.block.getDataPorts().indexOf(parentDataPortModel);
                    const index = event.getIndex();
                    this._jsonUIGraph.dataPorts?.[parentIndex].dataPorts.splice(index, 1);
                }
            }
        }
    }
    return UIGraphBlock;
});
