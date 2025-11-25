/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortVisibilityDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortVisibilityDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIFadeOutDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOptionalDataPorts", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIDataPortVisibilityDialog"], function (require, exports, UIFadeOutDialog, UIDGVOptionalDataPorts, UINLS) {
    "use strict";
    /**
     * This class defines a UI data port visibility dialog.
     * @private
     * @class UIDataPortVisibilityDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortVisibilityDialog
     * @extends UIFadeOutDialog
     */
    class UIDataPortVisibilityDialog extends UIFadeOutDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {UIBlock} blockUI - The UI block.
         */
        constructor(editor, blockUI) {
            super({
                title: UINLS.get('dialogTitleDataPortVisibilityEditor'),
                className: 'sch-dialog-visibility-dataport',
                immersiveFrame: editor.getImmersiveFrame(),
                resizableFlag: true,
                width: 300,
                minWidth: 300,
                height: 200
            });
            this._blockUI = blockUI;
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            this._blockUI = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVOptionalDataPorts} The data grid view.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
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
            this._dataGridView = new UIDGVOptionalDataPorts(this._blockUI);
            this._content.appendChild(this._dataGridView.getElement());
            super._onCreateContent();
        }
    }
    return UIDataPortVisibilityDialog;
});
