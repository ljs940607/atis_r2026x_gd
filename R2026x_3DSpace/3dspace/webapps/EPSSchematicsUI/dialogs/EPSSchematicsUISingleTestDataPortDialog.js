/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleTestDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/CoreBase/WebUXGlobalEnums"], function (require, exports, UIValidationDialog, UIDGVSingleTestDataPort, ModelEnums, UINLS, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines a UI single test data port dialog.
     * @private
     * @class UISingleTestDataPortDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog
     * @extends UIValidationDialog
     */
    class UISingleTestDataPortDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {DataPort} dataPort - The single data port.
         */
        constructor(editor, dataPort) {
            const portType = dataPort.getType();
            const isInputType = portType === ModelEnums.EDataPortType.eInput;
            const nlsKey = isInputType ? 'TestInputsEditorDialogTitle' : 'TestOutputsReferenceEditorDialogTitle';
            const title = UINLS.get(nlsKey) + ' (' + dataPort.getName() + ')';
            super(editor, {
                title: title,
                className: ['sch-dialog-iotest', isInputType ? 'sch-dialog-inputtest' : 'sch-dialog-outputtest'],
                immersiveFrame: editor.getImmersiveFrame(),
                width: 600,
                height: 400
            });
            this._dataPort = dataPort;
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            this._dataGridView = undefined;
            this._dataPort = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVSingleTestDataPort} The data grid view.
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
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            this._dataGridView.applyTestValues();
            super._onOk();
        }
        /**
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
            if (this._dataGridView !== undefined) {
                this._dataGridView.remove();
                this._dataGridView = undefined;
            }
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            const isReadOnly = this._editor.getViewerController().getCurrentViewer().isReadOnly();
            this._dialog.icon = isReadOnly ? {
                iconName: 'lock',
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome
            } : '';
            const blockModel = this._dataPort.block;
            this._dataGridView = new UIDGVSingleTestDataPort(this._editor, blockModel, isReadOnly, this._dataPort);
            this._content.appendChild(this._dataGridView.getElement());
        }
    }
    return UISingleTestDataPortDialog;
});
