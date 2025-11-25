/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUITemporaryModelDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUITemporaryModelDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools"], function (require, exports, UIValidationDialog, UITools) {
    "use strict";
    /**
     * This class defines a port dialog.
     * @private
     * @abstract
     * @class UITemporaryModelDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUITemporaryModelDialog
     * @extends UIValidationDialog
     */
    class UITemporaryModelDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {UIBlock|UIGraph} block - The UI block.
         * @param {IWUXDialogOptions} options - The WUX dialog options.
         */
        constructor(editor, block, options) {
            super(editor, options);
            this._editor = editor;
            this._block = block;
            this._model = this._block.getModel();
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the dialog!
            this._editor = undefined;
            this._model = undefined;
            this._tmpModel = undefined;
        }
        /**
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
            this._tmpModel = undefined;
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            this._tmpModel = this._model.clone();
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            const isReadOnly = this._block.getViewer().isReadOnly();
            if (!UITools.isBlockDataPortDebuggable(this._editor, this._model) && !isReadOnly) {
                const jsonBlock = {};
                this._tmpModel.toJSON(jsonBlock);
                this._model.fromJSON(jsonBlock);
            }
            super._onOk();
        }
    }
    return UITemporaryModelDialog;
});
