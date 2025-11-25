/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataDrawer'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataDrawer", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataDrawerView", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphDataDrawerDialog", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UINode, UIDom, UIGraphDataDrawerView, UIGraphDataPort, UIGraphDataDrawerDialog, Events, ModelEnums) {
    "use strict";
    /**
     * This class defines UI graph data drawer.
     * @private
     * @class UIGraphDataDrawer
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataDrawer
     * @extends UINode
     */
    class UIGraphDataDrawer extends UINode {
        static { this._kBorderToDataPortOffset = 20; }
        static { this._kPortToPortOffset = 20; }
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph that owns this block.
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @param {boolean} [isInputLocal] - Optionnal parameter for local data port type.
         */
        constructor(graph, portType, isInputLocal) {
            super({ graph: graph, isDraggable: false });
            this._dataPorts = [];
            this._onDataPortAddCB = this._onDataPortAdd.bind(this);
            this._onDataPortRemoveCB = this._onDataPortRemove.bind(this);
            this._portType = portType;
            this._isInputLocal = isInputLocal;
            this._graphDataDrawerDialog = new UIGraphDataDrawerDialog(graph, portType);
            this.setView(this._createDrawerView());
            this.setDimension(170, 18);
            this.addNodeToViewer();
            this._graph.getModel().addListener(Events.DataPortAddEvent, this._onDataPortAddCB);
            this._graph.getModel().addListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
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
            this._dataPorts.forEach(dataPort => dataPort.remove());
            if (this._graph.getModel() !== undefined) {
                this._graph.getModel().removeListener(Events.DataPortAddEvent, this._onDataPortAddCB);
                this._graph.getModel().removeListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            }
            if (this._graphDataDrawerDialog) {
                this._graphDataDrawerDialog.remove();
                this._graphDataDrawerDialog = undefined;
            }
            this._portType = undefined;
            this._isInputLocal = undefined;
            this._dataPorts = undefined;
            this._onDataPortAddCB = undefined;
            this._onDataPortRemoveCB = undefined;
            super.remove();
        }
        /**
         * Checks if the node is selectable.
         * @public
         * @override
         * @returns {boolean} True if the node is selectable else false.
         */
        // eslint-disable-next-line class-methods-use-this
        isSelectable() {
            return false;
        }
        /**
         * Checks if the data port is addable.
         * @public
         * @returns {boolean} True if the data port is addable else false.
         */
        isDataPortAddable() {
            return this._graph.getModel().isDataPortTypeAddable(this._portType);
        }
        /**
         * Gets the main view if the node.
         * @public
         * @override
         * @returns {UIGraphDataDrawerView} The main view of the node.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the graph data drawer dialog.
         * @public
         * @returns {UIGraphDataDrawerDialog} The graph data drawer dialog.
         */
        getDialog() {
            return this._graphDataDrawerDialog;
        }
        /**
         * Hides the graph data drawer without hiding its ports.
         * @public
         */
        hide() {
            this.getView().hide();
        }
        /**
         * Shows the graph data drawer.
         * @public
         */
        show() {
            this.getView().show();
        }
        /**
         * Checks if the drawer is visible or not.
         * @public
         * @returns {boolean} True if the drawer is visible else false.
         */
        isVisible() {
            return this.getView().isVisible();
        }
        /**
         * Gets the graph data drawer port type.
         * @public
         * @returns {ModelEnums.EDataPortType} The graph data drawer port type.
         */
        getPortType() {
            return this._portType;
        }
        /**
         * The callback on the node click event.
         * @public
         * @param {Element} subElt - The node sub element.
         */
        onNodeClick(subElt) {
            const drawerView = this.getView();
            if (subElt === drawerView.getButtonElement()) {
                this._createDataPort();
            }
            else if (subElt === drawerView.getTitleElement()) {
                this._graphDataDrawerDialog.open();
            }
        }
        /**
         * Computes the position of the drawer.
         * @public
         * @param {number} [offsetLeft] - The optional adgacent drawer's left offset position.
         */
        computePosition(offsetLeft) {
            const graphLeft = this._graph.getLeft();
            const graphTop = this._graph.getTop();
            const graphHeight = this._graph.getHeight();
            const graphWidth = this._graph.getWidth();
            const graphPaddingLeft = this._graph.getPaddingLeft();
            const drawerHeight = this.getHeight();
            const drawerWidth = this.getWidth();
            const graphBorderWidth = this._graph.getView().getBorderWidth();
            const graphHalfBorderWidth = parseInt(String(graphBorderWidth / 2));
            let drawerLeft = 0, drawerTop = 0;
            if (this._portType === ModelEnums.EDataPortType.eInput) {
                drawerLeft = offsetLeft !== undefined ? offsetLeft : graphLeft + graphPaddingLeft;
                drawerTop = graphTop - drawerHeight - graphHalfBorderWidth;
            }
            else if (this._portType === ModelEnums.EDataPortType.eOutput) {
                drawerLeft = offsetLeft !== undefined ? offsetLeft - drawerWidth : graphLeft + graphWidth - graphPaddingLeft - drawerWidth;
                drawerTop = graphTop + graphHeight + graphHalfBorderWidth;
            }
            else if (this._portType === ModelEnums.EDataPortType.eLocal) {
                if (this._isInputLocal) {
                    drawerLeft = graphLeft + graphPaddingLeft;
                    drawerTop = graphTop + graphHalfBorderWidth;
                }
                else {
                    drawerLeft = graphLeft + graphWidth - graphPaddingLeft - drawerWidth;
                    drawerTop = graphTop + graphHeight - drawerHeight - graphHalfBorderWidth;
                }
            }
            this.setLeft(drawerLeft);
            this.setTop(drawerTop);
            this._dataPorts.forEach(dataPort => dataPort.getPersistentLabel()?.synchronizePositionWithParentNode());
        }
        /**
         * Computes the width of the drawer.
         * @public
         */
        computeWidth() {
            const drawerViewElt = this.getView().getElement();
            const maxPort = this.getUIDataPorts(true, false).length;
            //const maxPort = this.dataPorts.length;
            let width = UIGraphDataDrawer._kBorderToDataPortOffset + maxPort * UIGraphDataDrawer._kPortToPortOffset;
            // Impose a minimum drawer width
            const minWidth = UIDom.getComputedStyleMinDimension(drawerViewElt).width;
            width = width > minWidth ? width : minWidth;
            // Set the drawer width
            this.setWidth(width);
            this._dispatchDataPorts();
            this._graph.updateSizeFromDataDrawers();
        }
        /**
         * Gets the list of UI data ports.
         * Sub data ports and invisible sub data ports can be included to the list.
         * @public
         * @param {boolean} [includeSubDataPorts=false] - True to include sub data ports else false.
         * @param {boolean} [includeUnexposed=false] - True to include unexposed data ports else false.
         * @returns {UIDataPort[]} The list of UI data ports.
         */
        getUIDataPorts(includeSubDataPorts = false, includeUnexposed = false) {
            let dataPorts = [];
            this._dataPorts.filter(dp => !includeUnexposed ? dp.isExposed() : true).forEach(dataPort => {
                dataPorts.push(dataPort);
                if (includeSubDataPorts) {
                    const subDataPorts = includeUnexposed ? dataPort.getAllSubDataPorts() : dataPort.getExposedSubDataPorts();
                    dataPorts = dataPorts.concat(subDataPorts);
                }
            });
            return dataPorts;
        }
        /**
         * Gets the list of model data ports.
         * @public
         * @returns {Array<DataPort>} The list of model data ports.
         */
        getModelDataPorts() {
            return this._dataPorts.map(dataPort => dataPort.getModel());
        }
        /**
         * Gets the UI data port from the provided data port model.
         * @public
         * @param {DataPort} dataPortModel - The data port model.
         * @returns {UIDataPort|undefined} The UI data port.
         */
        getUIDataPortFromModel(dataPortModel) {
            const dataPorts = this.getUIDataPorts(true, true);
            return dataPorts.find(dataPort => dataPort.getModel() === dataPortModel);
        }
        /**
         * Unexpose all UI sub data ports.
         * @public
         */
        unexposeAllUISubDataPorts() {
            this._dataPorts.forEach(dataPort => dataPort.unexposeAllUISubDataPorts());
            this.computeWidth();
        }
        /**
         * Gets the input local state.
         * @public
         * @returns {boolean|undefined} True for input local type, false for output local type.
         */
        getInputLocalState() {
            return this._isInputLocal;
        }
        /**
         * Creates an UI data port from the provided data port model.
         * @public
         * @param {DataPort} dataPortModel - The data port model .
         * @returns {UIGraphDataPort|undefined} The created UI graph data port.
         */
        createUIDataPort(dataPortModel) {
            let dataPortUI;
            if (dataPortModel.getType() === this._portType) {
                dataPortUI = new UIGraphDataPort(this, dataPortModel, this._isInputLocal);
                this._dataPorts.push(dataPortUI);
                this.appendConnector(dataPortUI);
                this.computeWidth();
                dataPortModel.getDataPorts().forEach((dataPort, index) => {
                    dataPortUI?.createUISubDataPort(this, index, dataPort);
                });
            }
            return dataPortUI;
        }
        /**
         * Creates a graph data port according to the drawer data port type.
         * @public
         */
        _createDataPort() {
            this._graph.getModel().createDynamicDataPort(this._portType);
            const drawer = this._graph.getDataDrawer(this._portType, this._isInputLocal);
            const dataPort = drawer?._dataPorts[drawer._dataPorts.length - 1];
            if (dataPort) {
                this._graph.getViewer().replaceSelection(dataPort.getDisplay());
                this._graph.getViewer().getEditor().getHistoryController().registerCreateAction(dataPort);
            }
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
         * Creates the drawer view.
         * @protected
         * @override
         * @returns {UIGraphDataDrawerView} The drawer view.
         */
        _createDrawerView() {
            return new UIGraphDataDrawerView(this);
        }
        /**
         * Dispatches each graph data ports along its drawer.
         * @protected
         */
        _dispatchDataPorts() {
            const dataPorts = this.getUIDataPorts(true, false);
            dataPorts.forEach((dataPort, index) => {
                const offset = UIGraphDataDrawer._kBorderToDataPortOffset + index * UIGraphDataDrawer._kPortToPortOffset;
                dataPort.setOffset(offset);
            });
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
         * The callback on the model data port add event.
         * @private
         * @param {Events.DataPortAddEvent} event - The model data port add event.
         */
        _onDataPortAdd(event) {
            this.createUIDataPort(event.getDataPort());
        }
        /**
         * The callback on the model data port remove event.
         * @private
         * @param {Events.DataPortRemoveEvent} event - The model data port remove event.
         */
        _onDataPortRemove(event) {
            const dataPortModel = event.getDataPort();
            if (dataPortModel.getType() === this._portType) {
                const dataPortUI = this._dataPorts.find(dataPort => dataPort.getModel() === dataPortModel);
                if (dataPortUI !== undefined) {
                    const index = this._dataPorts.indexOf(dataPortUI);
                    this._dataPorts.splice(index, 1);
                    dataPortUI.remove();
                    this.computeWidth();
                }
            }
        }
    }
    return UIGraphDataDrawer;
});
