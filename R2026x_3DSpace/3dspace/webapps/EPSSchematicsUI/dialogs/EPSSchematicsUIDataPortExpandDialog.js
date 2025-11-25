/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortExpandDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortExpandDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIFadeOutDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVPropertyExposure", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIDataPortExpandDialog"], function (require, exports, UIFadeOutDialog, UIDGVPropertyExposure, UINLS, GraphBlock, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI data port expand dialog.
     * @private
     * @class UIDataPortExpandDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortExpandDialog
     * @extends UIFadeOutDialog
     */
    class UIDataPortExpandDialog extends UIFadeOutDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {UIDataPort} dataPortUI - The UI data port.
         */
        constructor(editor, dataPortUI) {
            super({
                title: UINLS.get('dialogTitleDataPortPropertyExposureEditor'),
                className: 'sch-dialog-expand-dataport',
                immersiveFrame: editor.getImmersiveFrame(),
                resizableFlag: true,
                width: 300,
                minWidth: 300,
                height: 200
            });
            this._dataPortUI = dataPortUI;
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
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            this._dataPortUI = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view property exposure.
         * @public
         * @returns {UIDGVPropertyExposure} The data grid view property exposure.
         */
        getDataGridView() {
            return this._dataGridView;
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
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
            this._dataPortUI.getParentGraph().getViewer().takeFocus();
            this._dataGridView.remove();
            this._dataGridView = undefined;
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            this._dataGridView = new UIDGVPropertyExposure(this._dataPortUI, this._onOk.bind(this));
            this._content.appendChild(this._dataGridView.getElement());
            super._onCreateContent();
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         */
        _onOk() {
            const blockModel = this._dataPortUI.getModel().block;
            const isLocalPort = this._dataPortUI.getModel().getType() === ModelEnums.EDataPortType.eLocal;
            const parent = this._dataPortUI.getParent();
            const isGraph = blockModel instanceof GraphBlock;
            let subDataPortUpdateList = [];
            if (blockModel.isTemplate() && !isLocalPort) {
                //this.updateExternalSubDataPorts(parent);
                // TO FINISH: create sub data port that exist on the model but does not exist on the UI!
                // check that sub data port that does not exist on the model are correctly created on the UI!
                // check that delete sub data port from the UI does not delete from the template
                // check that deleted or created sub data port from the template does not impact the instance!
                subDataPortUpdateList = this._updateExternalTemplateSubDataPorts();
            }
            else if (isGraph && !isLocalPort) {
                // Prevent circular dependency!
                const UIGraphBlockCtor = require('DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphBlock');
                subDataPortUpdateList = parent instanceof UIGraphBlockCtor ? this._updateExternalSubDataPorts(parent) : this._updateInternalSubDataPorts(parent.blockView);
                this._dataPortUI.updateWidth();
            }
            else {
                subDataPortUpdateList = this._dataGridView.getExposedDataPortsName();
            }
            this._dataPortUI.getModel().updateDataPorts(subDataPortUpdateList);
            if (!isGraph) {
                this._dataPortUI.getParentGraph().updateSizeFromBlocks();
            }
            const graph = (isGraph ? this._dataPortUI.getParent() : this._dataPortUI.getParentGraph());
            graph.getEditor().getHistoryController().registerEditAction(this._dataPortUI);
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
         * Exposes the sub data ports according to the selected names from the tree list.
         * @private
         * @returns {Array<string>} The list of sub data port name to expose.
         */
        _exposeSubDataPortsFromTreeList() {
            const exposedSubDataPortsName = this._dataGridView.getExposedDataPortsName();
            exposedSubDataPortsName.forEach(name => {
                const subDataPort = this._dataPortUI.getUISubDataPortByName(name);
                if (subDataPort !== undefined) { // Change the exposed state of the sub data port that already exists on the model
                    subDataPort.setExposedState(true);
                }
            });
            return exposedSubDataPortsName;
        }
        /**
         * Updates the internal sub data ports.
         * @private
         * @param {UIGraphBlock} parent - The parent UI graph block.
         * @returns {Array<string>} The list of sub data port name to expose.
         */
        _updateInternalSubDataPorts(parent) {
            const updateList = this._exposeSubDataPortsFromTreeList();
            if (parent !== undefined) {
                // Get the list of external sub data ports to include the visible ones
                const externalDataPort = parent.getUIDataPortFromModel(this._dataPortUI.getModel());
                const externalSubDataPorts = externalDataPort.getAllSubDataPorts();
                externalSubDataPorts.forEach(externalSubDataPort => {
                    const externalSubDataPortName = externalSubDataPort.getModel().getName();
                    if (updateList.indexOf(externalSubDataPortName) === -1) {
                        if (externalSubDataPort.isExposed()) {
                            updateList.push(externalSubDataPortName);
                        }
                        const internalSubDataPort = this._dataPortUI.getUISubDataPortByName(externalSubDataPortName);
                        if (internalSubDataPort?.isExposed()) {
                            internalSubDataPort.setExposedState(false);
                        }
                    }
                });
                // The other internal sub data ports that are no more selected and
                // not externaly visible will be removed by omission!
            }
            return updateList;
        }
        /**
         * Updates the external sub data ports.
         * @private
         * @param {UIGraphBlock} parent - The parent UI graph block.
         * @returns {Array<string>} The list of sub data port name to expose.
         */
        _updateExternalSubDataPorts(parent) {
            const updateList = this._exposeSubDataPortsFromTreeList();
            // Remove the data port that does not exist
            const dataPortIndex = parent.getUIDataPorts().indexOf(this._dataPortUI);
            const externalSubDataPorts = this._dataPortUI.getAllSubDataPorts();
            externalSubDataPorts.forEach((externalSubDataPort, subDataPortIndex) => {
                const externalSubDataPortName = externalSubDataPort.getModel().getName();
                if (updateList.indexOf(externalSubDataPortName) === -1) {
                    if (!externalSubDataPort.isExposed()) {
                        // If sub data port is not exposed, this means it is internally exposed so we do not remove
                        updateList.push(externalSubDataPortName);
                    }
                    else {
                        // If sub data port is exposed, we need to unexpose it if it exist internally or remove it if it does not.
                        if (parent.getInternalSubDataPortExposedState(dataPortIndex, subDataPortIndex)) {
                            externalSubDataPort.setExposedState(false);
                            updateList.push(externalSubDataPortName);
                        }
                        // Else Remove from model by omission
                    }
                }
            });
            return updateList;
        }
        /**
         * Updates the external template sub data port.
         * @private
         * @returns {string[]} The list of sub data port name to expose.
         */
        _updateExternalTemplateSubDataPorts() {
            const exposedSubDataPortsName = this._dataGridView.getExposedDataPortsName();
            exposedSubDataPortsName.forEach(subDataPortName => {
                const subDataPortUI = this._dataPortUI.getUISubDataPortByName(subDataPortName);
                if (subDataPortUI !== undefined) {
                    // Change the exposed state of the sub data port that already exists on the model
                    subDataPortUI.setExposedState(true);
                } /* else {
                    // check the sub data port exist on the model
                    const subDataPortModel = this.dataPortUI.model.getDataPortByName(subDataPortName);
                    if (subDataPortModel !== undefined) {
                        //create the subdataport
                    }
                }*/
            });
            this._dataPortUI.updateWidth();
            return exposedSubDataPortsName;
        }
    }
    return UIDataPortExpandDialog;
});
