/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIClearGraphDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIClearGraphDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIClearGraphDialog"], function (require, exports, UIValidationDialog, UINLS, UIFontIcon, UIDom) {
    "use strict";
    /**
     * This class defines a clear graph dialog.
     * @private
     * @class UIClearGraphDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIClearGraphDialog
     * @extends UIValidationDialog
     */
    class UIClearGraphDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                title: UINLS.get('shortHelpClearGraph'),
                className: 'sch-dialog-cleargraph',
                immersiveFrame: editor.getImmersiveFrame()
            });
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            super.remove();
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            this._editor.getViewerController().removeAllViewers();
            const options = this._editor.getOptions();
            const viewer = this._editor._getViewer();
            const callback = options.onClear || viewer.loadDefaultGraph.bind(viewer);
            callback();
            this._editor.getHistoryController().registerClearGraphAction();
            super._onOk();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            const dialogContent = this.getContent();
            UIFontIcon.create3DSFontIcon('broom', { parent: dialogContent });
            UIDom.createElement('div', {
                parent: dialogContent,
                textContent: UINLS.get('dialogContentClearGraphQuestion')
            });
        }
    }
    return UIClearGraphDialog;
});
