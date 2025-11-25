/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleDataPort", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/CoreBase/WebUXGlobalEnums"], function (require, exports, UIValidationDialog, UIDGVSingleDataPort, UITools, UIEvents, UINLS, UIDom, ModelEnums, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines a data port dialog.
     * @private
     * @class UIDataPortDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortDialog
     * @extends UIValidationDialog
     */
    class UIDataPortDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIDataPort} dataPort - The UI data port.
         */
        constructor(dataPort) {
            super(dataPort.getEditor(), {
                title: UIDataPortDialog._getTitle(dataPort.getModel().getType()),
                className: 'sch-dialog-dataport',
                immersiveFrame: dataPort.getParentGraph().getEditor().getImmersiveFrame(),
                width: 600,
                minHeight: 125,
                height: 125
            });
            this._onDialogExpandEventCB = this._onDialogExpandEvent.bind(this);
            this._dataPort = dataPort;
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
            super.remove();
            this._dataPort = undefined;
            this._tmpBlockModel = undefined;
            this._dataGridView = undefined;
            this._onDialogExpandEventCB = undefined;
        }
        /**
         * Closes the dialog.
         * @public
         * @override
         */
        close() {
            this._editor.removeListener(UIEvents.UIDialogExpandEvent, this._onDialogExpandEventCB);
            if (this._dataGridView) {
                this._dataGridView.remove();
            }
            this._tmpBlockModel = undefined;
            this._dataGridView = undefined;
            super.close();
        }
        /**
         * Gets the single data port data grid view.
         * @public
         * @returns {UIDGVSingleDataPort} THe single data port data grid view.
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
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            this._editor.addListener(UIEvents.UIDialogExpandEvent, this._onDialogExpandEventCB);
            const blockModel = this._dataPort.getModel().block;
            this._tmpBlockModel = blockModel.clone();
            const dataPortPath = this._dataPort.getModel().toPath(blockModel);
            const rootViewer = this._editor.getViewerController().getRootViewer();
            const isDebuggable = UITools.isDataPortDebuggable(this._editor, this._dataPort.getModel());
            const isReadOnly = !isDebuggable && rootViewer.isReadOnly();
            this._dialog.icon = isReadOnly ? {
                iconName: 'lock',
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome
            } : '';
            this._dataGridView = new UIDGVSingleDataPort(this._editor, this._tmpBlockModel, dataPortPath, isReadOnly);
            this._content.appendChild(this._dataGridView.getElement());
            // Display debug icon
            this._dialog.icon = isDebuggable ? 'bug' : this._dialog.icon;
            const titleBar = this._dialog.getTitleBar();
            UIDom.addClassName(titleBar, isDebuggable ? 'sch-windows-dialog-debug' : '');
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            if (UITools.isDataPortDebuggable(this._editor, this._dataPort.getModel())) {
                const options = this._editor.getOptions();
                if (options?.playCommands?.callbacks?.onBreakBlockDataChange) {
                    const fromDebugByDataPortPath = new Map();
                    this._dataGridView.getTreeDocument().getRoots().forEach(root => {
                        const dataPort = root.getAttributeValue('dataPort');
                        const fromDebug = root.getAttributeValue('fromDebug');
                        fromDebugByDataPortPath.set(dataPort.toPath(), fromDebug);
                    });
                    const breakBlockData = UITools.getBreakBlockData(this._editor, this._tmpBlockModel.getDataPorts([ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal]), fromDebugByDataPortPath);
                    options.playCommands.callbacks.onBreakBlockDataChange(breakBlockData);
                }
                super._onOk();
            }
            else {
                const dataPort = this._dataPort;
                const editor = this._editor;
                const jsonBlock = {};
                this._tmpBlockModel.toJSON(jsonBlock);
                super._onOk();
                dataPort.getModel().block.fromJSON(jsonBlock); // Triggers the deletion of the dialog!
                editor.getHistoryController().registerEditAction(dataPort);
            }
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
         * The callback on the dialog expand event.
         * @private
         */
        _onDialogExpandEvent() {
            if (this._dialog.height < 300) {
                this._dialog.height = 300;
            }
        }
        /**
         * Gets the dialog title.
         * @private
         * @static
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @returns {string} The title of the dialog.
         */
        static _getTitle(portType) {
            let title = '';
            if (portType === ModelEnums.EDataPortType.eLocal) {
                title = UINLS.get('dialogTitleLocalDataPortEditor');
            }
            else if (portType === ModelEnums.EDataPortType.eInput) {
                title = UINLS.get('dialogTitleInputDataPortEditor');
            }
            else if (portType === ModelEnums.EDataPortType.eInputExternal) {
                title = UINLS.get('dialogTitleInputExternalDataPortEditor');
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                title = UINLS.get('dialogTitleOutputDataPortEditor');
            }
            return title;
        }
    }
    return UIDataPortDialog;
});
