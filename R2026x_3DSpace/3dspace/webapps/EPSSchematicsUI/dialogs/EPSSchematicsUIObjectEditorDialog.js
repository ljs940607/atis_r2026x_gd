/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIObjectEditorDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIObjectEditorDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVObjectEditor"], function (require, exports, UIValidationDialog, UIDGVObjectEditor) {
    "use strict";
    /**
     * This class defines an object editor dialog.
     * @private
     * @class UIObjectEditorDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIObjectEditorDialog
     * @extends UIValidationDialog
     */
    class UIObjectEditorDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {string} name - The name of the objec to edit.
         * @param {string} valueType - The value type.
         * @param {any} defaultValue - The default value.
         * @param {boolean} readOnly - Whether the value is read-only.
         * @param {Function} onOk - The onOk callback.
         */
        constructor(editor, name, valueType, defaultValue, readOnly, onOk) {
            super(editor, {
                title: 'Object Editor',
                className: 'sch-dialog-objecteditor',
                immersiveFrame: editor.getImmersiveFrame(),
                width: 700, minWidth: 300, height: 400, minHeight: 200,
                onOk: () => onOk(this._defaultValue)
            });
            this._editor = editor;
            this._name = name;
            this._valueType = valueType;
            this._defaultValue = defaultValue;
            this._readOnly = readOnly;
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            if (this._dataGridView) {
                this._dataGridView.remove();
                this._dataGridView = undefined;
            }
            this._name = undefined;
            this._valueType = undefined;
            this._defaultValue = undefined;
            this._readOnly = undefined;
            super.remove();
        }
        /**
         * Closes the dialog.
         * @public
         * @override
         */
        close() {
            super.close();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVObjectEditor} The data grid view.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            this._defaultValue = this._dataGridView.getDefaultValue();
            super._onOk();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            this._dataGridView = new UIDGVObjectEditor(this._editor, this._name, this._valueType, this._defaultValue, this._readOnly);
            this._content.appendChild(this._dataGridView.getElement());
        }
    }
    return UIObjectEditorDialog;
});
