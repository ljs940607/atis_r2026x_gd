/* global WUXManagedFontIcons */
/// <amd-module name='DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveGraphDialog'/>
define("DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveGraphDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileSaver", "DS/Controls/Button", "DS/CSIExecutionGraphUI/tools/CSIEGUITools", "DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordBasicDialog", "DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordAdvancedDialog", "css!DS/CSIExecutionGraphUI/sass/dialogs/CSIEGUISaveGraphDialog"], function (require, exports, UIBaseDialog, UIDom, UIFileSaver, WUXButton, CSIEGUITools, CSIEGUISaveRecordBasicDialog, CSIEGUISaveRecordAdvancedDialog) {
    "use strict";
    /**
     * This class defines a CSI Execution Graph UI save graph dialog.
     * @private
     * @class CSIEGUISaveGraphDialog
     * @alias module:DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveGraphDialog
     * @extends UIBaseDialog
     */
    class CSIEGUISaveGraphDialog extends UIBaseDialog {
        /**
         * @public
         * @constructor
         * @param {CSIExecutionGraphUIEditor} editor - The CSI Execution Graph UI Editor.
         */
        constructor(editor) {
            super({
                title: 'Save Graph',
                className: 'csiegui-save-graph-dialog',
                icon: 'floppy',
                immersiveFrame: editor.getImmersiveFrame(),
                modalFlag: true,
                width: 500,
                height: 270
            });
            this._editor = editor;
            this._fileSaver = new UIFileSaver();
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
            super.remove(); // Closes the dialog first!
            this._editor = undefined;
            this._saveCSIGraphButton = undefined;
            this._saveCSIRecordButton = undefined;
            this._fileSaver = undefined;
            this._saveRecordBasicDialog = undefined;
            this._saveRecordAdvancedDialog = undefined;
            this._graphModelJSONRef = undefined;
            this._inputTestValuesJSONRef = undefined;
            this._outputTestValuesJSONRef = undefined;
        }
        /**
         * Closes the dialog.
         * @public
         * @override
         */
        close() {
            if (this._saveRecordBasicDialog) {
                this._saveRecordBasicDialog.remove();
                this._saveRecordBasicDialog = undefined;
            }
            if (this._saveRecordAdvancedDialog) {
                this._saveRecordAdvancedDialog.remove();
                this._saveRecordAdvancedDialog = undefined;
            }
            this._saveCSIGraphButton = undefined;
            this._saveCSIRecordButton = undefined;
            super.close();
        }
        /**
         * Gets the save record basic dialog.
         * @public
         * @returns {CSIEGUISaveRecordBasicDialog} The save record basic dialog.
         */
        getSaveRecordBasicDialog() {
            return this._saveRecordBasicDialog;
        }
        /**
         * Gets the save record advanced dialog.
         * @public
         * @returns {CSIEGUISaveRecordAdvancedDialog} The save record advanced dialog.
         */
        getSaveRecordAdvancedDialog() {
            return this._saveRecordAdvancedDialog;
        }
        /**
         * Stores the graph model and the input/output test values JSON references.
         * @public
         */
        storeGraphModelAndIOTestValuesJSONReference() {
            const graphModel = this._editor.getGraphModel();
            this._graphModelJSONRef = graphModel.generateJSON();
            this._inputTestValuesJSONRef = JSON.stringify(graphModel.getInputTestValues());
            this._outputTestValuesJSONRef = JSON.stringify(graphModel.getOutputTestValues());
        }
        /**
         * Checks whether the graph model or input/output test values have changed.
         * @public
         * @returns {boolean} Whether the graph model or input/output test values have changed.
         */
        hasGraphModelOrIOTestValuesChanged() {
            let result = false;
            const graphModel = this._editor.getGraphModel();
            const graphModelJSONRef = graphModel.generateJSON();
            const inputTestValuesJSONRef = JSON.stringify(graphModel.getInputTestValues());
            const outputTestValuesJSONRef = JSON.stringify(graphModel.getOutputTestValues());
            const hasGraphModelChanged = graphModelJSONRef !== this._graphModelJSONRef;
            const hasinputTestValuesChanged = inputTestValuesJSONRef !== this._inputTestValuesJSONRef;
            const hasoutputTestValuesChanged = outputTestValuesJSONRef !== this._outputTestValuesJSONRef;
            result = hasGraphModelChanged || hasinputTestValuesChanged || hasoutputTestValuesChanged;
            return result;
        }
        /**
         * Gets the file saver.
         * @public
         * @returns {UIFileSaver} The file saver.
         */
        getFileSaver() {
            return this._fileSaver;
        }
        /**
         * Gets the save CSI graph button.
         * @public
         * @returns {WUXButton} The save CSI graph button.
         */
        getSaveCSIGraphButton() {
            return this._saveCSIGraphButton;
        }
        /**
         * Gets the save CSI record button.
         * @public
         * @returns {WUXButton} The save CSI record button.
         */
        getSaveCSIRecordButton() {
            return this._saveCSIRecordButton;
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
         */
        _onCreateContent() {
            this._saveRecordBasicDialog = new CSIEGUISaveRecordBasicDialog(this._editor, this);
            this._saveRecordAdvancedDialog = new CSIEGUISaveRecordAdvancedDialog(this._editor, this);
            UIDom.createElement('div', {
                className: 'csiegui-content-title',
                textContent: 'For which purpose do you want to save this Graph?',
                parent: this._content
            });
            this._saveCSIGraphButton = new WUXButton({
                emphasize: 'secondary',
                icon: { iconName: 'rocket', fontIconFamily: WUXManagedFontIcons.FontAwesome, fontIconSize: '3x' },
                onClick: this._onSaveCSIGraphButtonClick.bind(this),
                allowUnsafeHTMLLabel: true
            }).inject(this._content);
            UIDom.createElement('div', {
                className: 'csiegui-button-content',
                parent: this._saveCSIGraphButton.getContent(),
                children: [
                    UIDom.createElement('div', { textContent: 'Deliver it and use it in my service' }),
                    UIDom.createElement('div', { innerHTML: 'Save the Graph as a CSI Declarative Function ' + CSIEGUITools.createHelpLink('http://executionfw.dsone.3ds.com/docs/csi/BasicDocumentation/Function/') })
                ]
            });
            this._saveCSIRecordButton = new WUXButton({
                emphasize: 'secondary',
                icon: { iconName: 'tape', fontIconFamily: WUXManagedFontIcons.Font3DS, fontIconSize: '3x' },
                onClick: this._onSaveCSIRecordButtonClick.bind(this),
                allowUnsafeHTMLLabel: true
            }).inject(this._content);
            UIDom.createElement('div', {
                className: 'csiegui-button-content',
                parent: this._saveCSIRecordButton.getContent(),
                children: [
                    UIDom.createElement('div', { textContent: 'Test it and use it as a scenario' }),
                    UIDom.createElement('div', { innerHTML: 'Save the Graph, the Test Inputs and Outputs Reference as a CSI&nbsp;Record for Unit Test ' + CSIEGUITools.createHelpLink('http://executionfw.dsone.3ds.com/docs/graph/advanced_features/#tests-with-csirecord') + ' or Scalability Tester ' + CSIEGUITools.createHelpLink('http://executionfw.dsone.3ds.com/executionfw/?scalability') })
                ]
            });
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
         * The callback on the save CSI graph button click event.
         * @private
         */
        _onSaveCSIGraphButtonClick() {
            this._exportJSONGraphToFile();
            this.close();
        }
        /**
         * The callback on the save CSI record button click event.
         * @private
         */
        _onSaveCSIRecordButtonClick() {
            this.setVisibleFlag(false);
            this._saveRecordBasicDialog.open();
            this._saveRecordBasicDialog.setVisibleFlag(true);
        }
        /**
         * Exports the JSON graph to file.
         * @private
         */
        _exportJSONGraphToFile() {
            const jsonFct = this._editor.getJSONFunction(true);
            const fctInfo = CSIEGUITools.getCSIFunctionInfo(this._editor.getGraphModel());
            const fileName = fctInfo.name && fctInfo.version ? fctInfo.name + '_v' + fctInfo.version + '.json' : 'newExecutionGraphFuntion_v1.json';
            const content = JSON.stringify(JSON.parse(jsonFct), undefined, 2) + '\n';
            this._fileSaver.saveTextFile(content, fileName);
        }
    }
    return CSIEGUISaveGraphDialog;
});
