/// <amd-module name='DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordBasicDialog'/>
define("DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordBasicDialog", ["require", "exports", "DS/CSIExecutionGraphUI/dialogs/CSIEGUIAbstractSaveRecordDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/Controls/Button", "DS/Controls/Toggle", "css!DS/CSIExecutionGraphUI/sass/dialogs/CSIEGUISaveRecordBasicDialog"], function (require, exports, CSIEGUIAbstractSaveRecordDialog, UIDom, WUXButton, WUXToggle) {
    "use strict";
    /**
     * This class defines a CSI Execution Graph UI save record basic dialog.
     * @private
     * @class CSIEGUISaveRecordBasicDialog
     * @alias module:DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordBasicDialog
     * @extends CSIEGUIAbstractSaveRecordDialog
     */
    class CSIEGUISaveRecordBasicDialog extends CSIEGUIAbstractSaveRecordDialog {
        /**
         * @public
         * @constructor
         * @param {CSIExecutionGraphUIEditor} editor - The CSI Execution Graph UI editor.
         * @param {CSIEGUISaveGraphDialog} saveCSIGraphDialog - The save graph dialog.
         */
        constructor(editor, saveCSIGraphDialog) {
            super({
                title: 'Save CSI Record (basic)',
                className: 'csiegui-save-record-basic-dialog',
                icon: 'floppy',
                immersiveFrame: editor.getImmersiveFrame(),
                modalFlag: true,
                width: 500,
                height: 245
            }, editor, saveCSIGraphDialog);
            if (this._options.buttonsDefinition) {
                this._options.buttonsDefinition.Save = {
                    label: 'Basic Save',
                    onClick: this._onBasicSaveButtonClick.bind(this)
                };
            }
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
            super.remove();
            this._declarativeFunctionToggle = undefined;
            this._testInputsToggle = undefined;
            this._poolToSelectToggle = undefined;
            this._expectedStatusToggle = undefined;
            this._expectedOutputRefToggle = undefined;
            this._backButton = undefined;
            this._advancedButton = undefined;
        }
        /**
         * Gets the back button.
         * @public
         * @returns {WUXButton} The back button.
         */
        getBackButton() {
            return this._backButton;
        }
        /**
         * Gets the advanced button.
         * @public
         * @returns {WUXButton} The advanced button.
         */
        getAdvancedButton() {
            return this._advancedButton;
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
            UIDom.createElement('div', {
                className: 'csiegui-content-title',
                textContent: 'Elements included into this scenario?',
                parent: this._content
            });
            const hasGraphChangedAfterPlay = this._saveCSIGraphDialog.hasGraphModelOrIOTestValuesChanged();
            const tmpRecordInfo = hasGraphChangedAfterPlay ? undefined : this._editor._getTempRecordInfo();
            const hasTmpRecordInfo = tmpRecordInfo !== undefined;
            const poolName = hasTmpRecordInfo ? tmpRecordInfo.poolName : 'undefined';
            const expectedStatus = this._getExpectedStatus();
            const hasExpectedStatus = expectedStatus !== undefined;
            const expectedStatusValue = hasExpectedStatus ? expectedStatus : 'undefined';
            const graphModel = this._editor.getGraphModel();
            const callDataPort = graphModel.getDataPortByName('Call');
            const successDataPort = graphModel.getDataPortByName('Success');
            const errorDataPort = graphModel.getDataPortByName('Error');
            const hasInputTestValue = hasTmpRecordInfo || callDataPort.getTestValues()[0] !== undefined;
            const hasSuccessTestValue = successDataPort.getTestValues()[0] !== undefined;
            const hasErrorTestValue = errorDataPort.getTestValues()[0] !== undefined;
            const hasOutputTestValue = hasTmpRecordInfo || hasSuccessTestValue || hasErrorTestValue;
            this._declarativeFunctionToggle = new WUXToggle({
                type: 'checkbox',
                label: 'CSI Declarative Function',
                value: 0,
                checkFlag: true,
                disabled: true
            }).inject(this._content);
            this._testInputsToggle = new WUXToggle({
                type: 'checkbox',
                label: 'Test Inputs CSI Parameters',
                value: 1,
                checkFlag: hasInputTestValue,
                disabled: !hasInputTestValue
            }).inject(this._content);
            this._poolToSelectToggle = new WUXToggle({
                type: 'checkbox',
                label: 'Pool to select "' + poolName + '"',
                value: 2,
                checkFlag: hasTmpRecordInfo,
                disabled: !hasTmpRecordInfo
            }).inject(this._content);
            this._expectedStatusToggle = new WUXToggle({
                type: 'checkbox',
                label: 'Expected status of the Graph "' + expectedStatusValue + '"',
                value: 3,
                checkFlag: hasExpectedStatus,
                disabled: !hasExpectedStatus
            }).inject(this._content);
            this._expectedOutputRefToggle = new WUXToggle({
                type: 'checkbox',
                label: 'Expected Outputs reference CSI Parameters',
                value: 4,
                checkFlag: hasOutputTestValue,
                disabled: !hasOutputTestValue
            }).inject(this._content);
            this._backButton = new WUXButton({
                label: 'Back',
                emphasize: 'secondary',
                onClick: this._onBackButtonClick.bind(this)
            });
            this._advancedButton = new WUXButton({
                label: 'Advanced Editing For Unit Test',
                emphasize: 'secondary',
                onClick: this._onAdvancedEditButtonClick.bind(this)
            });
            const footer = this._dialog.getContent().querySelector('.wux-windows-dialog-buttons');
            if (footer) {
                UIDom.createElement('div', {
                    className: 'csiegui-dialog-footer-custom',
                    parent: footer,
                    children: [this._backButton.getContent(), this._advancedButton.getContent()]
                });
            }
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
         * The callback on the back button click event.
         * @private
         */
        _onBackButtonClick() {
            this._saveCSIGraphDialog.setVisibleFlag(true);
            this.setVisibleFlag(false);
        }
        /**
         * The callback on the advanced edit button click event.
         * @private
         */
        _onAdvancedEditButtonClick() {
            this.setVisibleFlag(false);
            const saveCSIRecordAdvancedDialog = this._saveCSIGraphDialog.getSaveRecordAdvancedDialog();
            saveCSIRecordAdvancedDialog.open();
            saveCSIRecordAdvancedDialog.setVisibleFlag(true);
        }
        /**
         * The callback on the basic save button click event.
         * @private
         */
        _onBasicSaveButtonClick() {
            this._exportJSONRecordToFile({
                'function': this._declarativeFunctionToggle.checkFlag,
                inputs: this._testInputsToggle.checkFlag,
                poolToSelect: this._poolToSelectToggle.checkFlag,
                expectedStatus: this._expectedStatusToggle.checkFlag,
                outputs: this._expectedOutputRefToggle.checkFlag
            });
            this._saveCSIGraphDialog.close();
        }
    }
    return CSIEGUISaveRecordBasicDialog;
});
