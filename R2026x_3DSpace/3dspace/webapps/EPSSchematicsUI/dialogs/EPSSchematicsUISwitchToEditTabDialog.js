/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUISwitchToEditTabDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUISwitchToEditTabDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUISwitchToEditTabDialog"], function (require, exports, UIValidationDialog, UINLS, UIDom) {
    "use strict";
    /**
     * This class defines a switch to edit tab dialog.
     * @private
     * @class UISwitchToEditTabDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUISwitchToEditTabDialog
     * @extends UIValidationDialog
     */
    class UISwitchToEditTabDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {Function} onOk - The callback called when Ok button is clicked.
         */
        constructor(editor, onOk) {
            super(editor, {
                title: UINLS.get('switchToEditTabDialogTitle'),
                className: 'sch-dialog-switch-to-edit-tab',
                icon: 'attention',
                immersiveFrame: editor.getImmersiveFrame(),
                width: 200,
                height: 100,
                onOk: onOk
            });
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            UIDom.createElement('div', { textContent: UINLS.get('switchToEditTabDialogContent'), parent: this._content });
            super._onCreateContent();
        }
    }
    return UISwitchToEditTabDialog;
});
