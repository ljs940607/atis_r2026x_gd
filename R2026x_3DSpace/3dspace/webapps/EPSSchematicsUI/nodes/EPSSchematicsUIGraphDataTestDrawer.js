/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataTestDrawer'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataTestDrawer", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataDrawer", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataTestDrawerView", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestDataPort", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIInputTestDialog", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIOutputTestDialog", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIGraphDataDrawer, UIGraphDataTestDrawerView, UIGraphTestDataPort, UIInputTestDialog, UIOutputTestDialog, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI graph data test drawer.
     * @private
     * @class UIGraphDataTestDrawer
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphDataTestDrawer
     * @extends UIGraphDataDrawer
     */
    class UIGraphDataTestDrawer extends UIGraphDataDrawer {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The parent graph.
         * @param {EDataPortType} portType - The data port type.
         */
        constructor(graph, portType) {
            super(graph, portType, false);
            this._drawerRef = this.isInputPort() ? this._graph.getInputDataDrawer() : this._graph.getOutputDataDrawer();
            const editor = this._graph.getEditor();
            this._validationDialog = this.isInputPort() ? new UIInputTestDialog(editor) : new UIOutputTestDialog(editor);
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
            if (this._validationDialog !== undefined) {
                this._validationDialog.remove();
                this._validationDialog = undefined;
            }
            super.remove();
        }
        /**
         * Computes the position of the drawer.
         * @public
         * @override
         */
        computePosition() {
            const drawerRefPosition = this._drawerRef.getPosition();
            const left = drawerRefPosition.left;
            //const top = this.isInputPort() ? drawerRefPosition.top - this.getHeight() : drawerRefPosition.top + this.drawerRef.getHeight();
            const top = drawerRefPosition.top;
            this.setPosition(left, top);
        }
        /**
         * Computes the width of the drawer.
         * @public
         * @override
         */
        computeWidth() {
            this.setWidth(this._drawerRef.getWidth());
            this._dispatchDataPorts();
        }
        /**
         * The callback on the node click event.
         * @public
         * @override
         */
        onNodeClick() {
            this._validationDialog.open();
        }
        /**
         * Get the graph data test drawer dialog.
         * @public
         * @returns {UIValidationDialog} The graph data test drawer dialog.
         */
        getTestDialog() {
            return this._validationDialog;
        }
        /**
         * Creates an UI data port from the provided data port model.
         * @public
         * @override
         * @param {DataPort} dataPortModel - The data port model .
         * @returns {UIGraphDataPort|undefined} The created UI graph data port.
         */
        createUIDataPort(dataPortModel) {
            let dataPortUI;
            if (dataPortModel.getType() === this._portType) {
                dataPortUI = new UIGraphTestDataPort(this, dataPortModel);
                this._dataPorts.push(dataPortUI);
                this.appendConnector(dataPortUI);
                if (!this.isVisible()) {
                    dataPortUI.setVisibility(false);
                }
                this.computeWidth();
                dataPortModel.getDataPorts().forEach((dataPort, index) => dataPortUI?.createUISubDataPort(this, index, dataPort));
            }
            return dataPortUI;
        }
        /**
         * Hides the graph data test drawer with its data ports.
         * @public
         * @override
         */
        hide() {
            super.hide();
            this._dataPorts.forEach(dataPort => dataPort.setVisibility(false));
        }
        /**
         * Shows the graph data test drawer.
         * @public
         * @override
         */
        show() {
            super.show();
            this._dataPorts.forEach(dataPort => dataPort.setVisibility(true));
            this.computeWidth();
        }
        /**
         * Resets the test values;
         * @public
         */
        resetTestValues() {
            this._dataPorts.forEach(dataPort => dataPort.getModel().setTestValues([]));
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
            return (new UIGraphDataTestDrawerView(this, this.isInputPort()));
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
         * Checks if the port is an input type.
         * @private
         * @returns {boolean} True if the port is an input type else false.
         */
        isInputPort() {
            return this._portType === ModelEnums.EDataPortType.eInput;
        }
    }
    return UIGraphDataTestDrawer;
});
