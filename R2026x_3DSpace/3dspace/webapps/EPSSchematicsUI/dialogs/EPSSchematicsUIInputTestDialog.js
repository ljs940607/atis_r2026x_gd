/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIInputTestDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIInputTestDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTestDataPorts", "DS/Controls/Button", "DS/CoreBase/WebUXGlobalEnums", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIIOTestDialog"], function (require, exports, UIValidationDialog, UIFontIcon, UIDom, UIWUXTools, UIDGVInputTestDataPorts, WUXButton, WebUXGlobalEnums_1) {
    "use strict";
    // TODO: NLS to be done!
    /**
     * This class defines a UI input test dialog.
     * @private
     * @class UIInputTestDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIInputTestDialog
     * @extends UIValidationDialog
     */
    class UIInputTestDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                title: 'Test inputs editor',
                className: ['sch-dialog-iotest', 'sch-dialog-inputtest'],
                immersiveFrame: editor.getImmersiveFrame(),
                width: 600,
                height: 400
            });
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        overrideremove() {
            this._importButton = undefined;
            this._exportButton = undefined;
            this._dataGridView = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVInputTestDataPorts} The data grid view.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * Gets the open button.
         * @public
         * @returns {WUXButton|undefined} The open button.
         */
        getOpenButton() {
            return this._importButton;
        }
        /**
         * Gets the save button.
         * @public
         * @returns {WUXButton|undefined} The save button.
         */
        getSaveButton() {
            return this._exportButton;
        }
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
            this._importButton = undefined;
            this._exportButton = undefined;
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            const topContainer = UIDom.createElement('div', { className: 'sch-top-container', parent: this.getContent() });
            const bottomContainer = UIDom.createElement('div', { className: 'sch-bottom-container', parent: this.getContent() });
            const testEditor = this._editor.getOptions().tabViewMode?.testEditor;
            if (testEditor?.onOpenInputTest) {
                this._importButton = new WUXButton({
                    label: 'Open',
                    emphasize: 'primary',
                    icon: UIFontIcon.getWUXFAIconDefinition('folder-open'),
                    tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Open input test file' }),
                    onClick: testEditor.onOpenInputTest
                }).inject(topContainer);
            }
            if (testEditor?.onSaveInputTest) {
                this._exportButton = new WUXButton({
                    label: 'Save',
                    emphasize: 'primary',
                    icon: UIFontIcon.getWUXFAIconDefinition('floppy-o'),
                    tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Save input test file' }),
                    onClick: testEditor.onSaveInputTest
                }).inject(topContainer);
            }
            const isReadOnly = this._editor.getViewerController().getCurrentViewer().isReadOnly();
            this._dialog.icon = isReadOnly ? {
                iconName: 'lock',
                fontIconFamily: WebUXGlobalEnums_1.WUXManagedFontIcons.FontAwesome
            } : '';
            const blockModel = this._editor.getGraphModel();
            this._dataGridView = new UIDGVInputTestDataPorts(this._editor, blockModel, isReadOnly);
            bottomContainer.appendChild(this._dataGridView.getElement());
        }
    }
    return UIInputTestDialog;
});
