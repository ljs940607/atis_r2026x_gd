/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUICustomTypeNameDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUICustomTypeNameDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/Controls/LineEditor", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUICustomTypeNameDialog"], function (require, exports, UIValidationDialog, TypeLibrary, ModelEnums, Tools, UINLS, WUXLineEditor) {
    "use strict";
    /**
     * This class defines a UI custom type name dialog.
     * @private
     * @class UICustomTypeNameDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUICustomTypeNameDialog
     * @extends UIValidationDialog
     */
    class UICustomTypeNameDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {Function} onClose - The callback on the dialog close event.
         */
        constructor(editor, onClose) {
            super(editor, {
                title: UINLS.get('dialogTitleCreateCustomType'),
                className: 'sch-dialog-createtype',
                immersiveFrame: editor.getImmersiveFrame(),
                onClose: onClose
            });
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
            this._lineEditor = undefined;
            super.remove();
        }
        /**
         * Opens the dialog.
         * @public
         * @override
         * @param {DataPort} [dataPort] - The data port model to update.
         */
        open(dataPort) {
            this._dataPort = dataPort;
            super.open();
        }
        /**
         * Gets the WUX line editor.
         * @public
         * @returns {WuxLineEditor} The WUX line editor.
         */
        getLineEditor() {
            return this._lineEditor;
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
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
            const typeName = this._lineEditor.value !== '' ? this._lineEditor.value : undefined;
            this._lineEditor = undefined;
            this._dataPort = undefined;
            super._onClose(typeName);
        }
        /**
         * Creates the dialog content.
         * @protected
         * @override
         */
        _onCreateContent() {
            super._onCreateContent();
            this.getDialog().defaultButton.disabled = true;
            this._lineEditor = new WUXLineEditor({
                placeholder: UINLS.get('placeholderNewCustomTypeName'),
                requiredFlag: true,
                pattern: '^[a-zA-Z0-9_]+$',
                value: '',
                autoCorrectFlag: false,
                displayClearFieldButtonFlag: true
            }).inject(this.getContent());
            const input = this._lineEditor.getContent().querySelector('input');
            if (input) {
                input.title = UINLS.get('shortHelpInvalidCustomTypeName');
                input.spellcheck = false;
                this._lineEditor.addEventListener('uncommittedChange', (event) => {
                    const graphContext = this._editor._getViewer().getMainGraph().getModel().getGraphContext();
                    const typeName = event.dsModel.valueToCommit.trim();
                    const hasTypeName = TypeLibrary.hasType(graphContext, typeName, ModelEnums.FTypeCategory.fAll) || TypeLibrary.isReservedName(typeName);
                    const isNameValid = Tools.regExpAlphanumeric.test(typeName);
                    let title = UINLS.get('shortHelpInvalidCustomTypeName');
                    let customValidity = '';
                    let disabled = false;
                    if (!isNameValid || hasTypeName) {
                        if (hasTypeName) {
                            title = UINLS.get('shortHelpExistingCustomTypeName');
                        }
                        customValidity = 'error';
                        disabled = true;
                    }
                    input.title = title;
                    input.setCustomValidity(customValidity);
                    this.getDialog().defaultButton.disabled = disabled;
                }, false);
            }
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            const graphContext = this._editor._getViewer().getMainGraph().getModel().getGraphContext();
            const typeName = this._lineEditor.value;
            if (typeName !== undefined && typeName !== '') {
                TypeLibrary.registerLocalCustomObjectType(graphContext, typeName, {});
                this._editor.getHistoryController().registerCreateCustomTypeAction();
                this._editor.getTypeLibraryController().sortTypes();
                if (this._dataPort !== undefined) {
                    const noTempDataPort = graphContext.getObjectFromPath(this._dataPort.toPath());
                    noTempDataPort.setValueType(typeName);
                }
            }
            super._onOk();
        }
    }
    return UICustomTypeNameDialog;
});
