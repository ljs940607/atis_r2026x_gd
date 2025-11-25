/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIControlPortDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIControlPortDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleControlPort", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/CoreBase/WebUXGlobalEnums"], function (require, exports, UIValidationDialog, UIDGVSingleControlPort, UINLS, ModelEnums, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines a control port dialog.
     * @private
     * @class UIControlPortDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIControlPortDialog
     * @extends UIValidationDialog
     */
    class UIControlPortDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIControlPort} controlPort - The UI control port.
         */
        constructor(controlPort) {
            super(controlPort.getEditor(), {
                title: UIControlPortDialog._getTitle(controlPort.getModel().getType()),
                className: 'sch-dialog-controlport',
                immersiveFrame: controlPort.getParentGraph().getEditor().getImmersiveFrame(),
                width: 400,
                height: 125
            });
            this._controlPort = controlPort;
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
            this._controlPort = undefined;
            this._tmpBlockModel = undefined;
            this._dataGridView = undefined;
            super.remove();
        }
        /**
         * Closes the dialog.
         * @public
         * @override
         */
        close() {
            if (this._dataGridView) {
                this._dataGridView.remove();
            }
            this._tmpBlockModel = undefined;
            this._dataGridView = undefined;
            super.close();
        }
        /**
         * Gets the single control port data grid view.
         * @public
         * @returns {UIDGVSingleControlPort} THe single control port data grid view.
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
            this._tmpBlockModel = this._controlPort.getParent().getModel().clone();
            const rootViewer = this._editor.getViewerController().getRootViewer();
            const isReadOnly = rootViewer.isReadOnly();
            this._dialog.icon = isReadOnly ? {
                iconName: 'lock',
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome
            } : '';
            this._dataGridView = new UIDGVSingleControlPort(this._editor, this._tmpBlockModel, this._controlPort.getName(), isReadOnly);
            this._content.appendChild(this._dataGridView.getElement());
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            const controlPort = this._controlPort;
            const editor = this._editor;
            let jsonBlock = {};
            this._tmpBlockModel.toJSON(jsonBlock);
            super._onOk();
            controlPort.getParent().getModel().fromJSON(jsonBlock); // Triggers the deletion of the dialog!
            editor.getHistoryController().registerEditAction(controlPort);
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
         * Gets the dialog title.
         * @private
         * @static
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         * @returns {string} The title of the dialog.
         */
        static _getTitle(portType) {
            let title = '';
            if (portType === ModelEnums.EControlPortType.eInput) {
                title = UINLS.get('dialogTitleInputControlPortEditor');
            }
            else if (portType === ModelEnums.EControlPortType.eOutput) {
                title = UINLS.get('dialogTitleOutputControlPortEditor');
            }
            else if (portType === ModelEnums.EControlPortType.eInputEvent) {
                title = UINLS.get('dialogTitleInputEventPortEditor');
            }
            else if (portType === ModelEnums.EControlPortType.eOutputEvent) {
                title = UINLS.get('dialogTitleOutputEventPortEditor');
            }
            return title;
        }
    }
    return UIControlPortDialog;
});
