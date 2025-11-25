/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, UIBaseDialog, UITools, UIEvents, UINLS) {
    "use strict";
    /**
     * This class defines a UI validation dialog.
     * @private
     * @abstract
     * @class UIValidationDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog
     * @extends UIBaseDialog
     */
    class UIValidationDialog extends UIBaseDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {IWUXDialogOptions} options - The dialog options.
         */
        constructor(editor, options) {
            options.resizableFlag = UITools.getOptionValue(options.resizableFlag, true);
            options.modalFlag = UITools.getOptionValue(options.modalFlag, true);
            options.allowMaximizeFlag = UITools.getOptionValue(options.allowMaximizeFlag, true);
            options.maximizeButtonFlag = UITools.getOptionValue(options.maximizeButtonFlag, true);
            super(options);
            this._onDialogCloseEventCB = this._onDialogCloseEvent.bind(this);
            this._editor = editor;
            this._options.buttonsDefinition = {
                Ok: {
                    label: UINLS.get('buttonOK'),
                    onClick: this._onOk.bind(this)
                },
                Cancel: {
                    label: UINLS.get('buttonCancel'),
                    onClick: this._onCancel.bind(this)
                }
            };
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            super.remove();
            this._editor = undefined;
            this._onDialogCloseEventCB = undefined;
        }
        /**
         * Closes the dialog.
         * @public
         * @override
         */
        close() {
            this._editor.removeListener(UIEvents.UIDialogCloseEvent, this._onDialogCloseEventCB);
            super.close();
        }
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            this._editor.addListener(UIEvents.UIDialogCloseEvent, this._onDialogCloseEventCB);
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         */
        _onOk() {
            if (typeof this._options.onOk === 'function') {
                this._options.onOk(this);
            }
            this.close();
        }
        /**
         * The callback on the dialog Cancel button click event.
         * @private
         */
        _onCancel() {
            if (typeof this._options.onCancel === 'function') {
                this._options.onCancel(this);
            }
            this.close();
        }
        /**
         * The callback on the dialog close event.
         * @private
         */
        _onDialogCloseEvent() {
            this._onOk();
        }
    }
    return UIValidationDialog;
});
