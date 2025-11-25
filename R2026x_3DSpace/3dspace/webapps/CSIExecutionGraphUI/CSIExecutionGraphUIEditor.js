/* eslint-disable dot-notation */
/// <amd-module name='DS/CSIExecutionGraphUI/CSIExecutionGraphUIEditor'/>
define("DS/CSIExecutionGraphUI/CSIExecutionGraphUIEditor", ["require", "exports", "DS/EPSSchematicsUI/EPSSchematicsUIEditor", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsCSI/EPSSchematicsCSIExport", "DS/CSIExecutionGraphUI/controllers/CSIEGUIBlockConverterController", "DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveGraphDialog", "DS/CSIExecutionGraphUI/panels/CSIEGUIPlayPanel", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicsCSI/EPSSchematicsCSIImport", "DS/EPSSchematicsCSI/EPSSchematicsCSITypeCastConfig", "DS/CSIExecutionGraphUI/tools/CSIEGUIEvents", "DS/CSICommandBinder/CSICommandBinder"], function (require, exports, EPSSchematicsUIEditor, UITools, TypeLibrary, CSIExport, CSIEGUIBlockConverterController, CSIEGUISaveGraphDialog, CSIEGUIPlayPanel, EventServices, ExecutionEvents, CSIImport, CSITypeCastConfig, CSIEGUIEvents, CSICommandBinder) {
    "use strict";
    /**
     * This class defines the CSI Execution Graph Editor.
     * @protected
     * @class CSIExecutionGraphUIEditor
     * @alias module:DS/CSIExecutionGraphUI/CSIExecutionGraphUIEditor
     * @extends EPSSchematicsUIEditor
     */
    class CSIExecutionGraphUIEditor extends EPSSchematicsUIEditor {
        /**
         * @public
         * @constructor
         * @param {IEditorOptions} options - The editor options.
         */
        constructor(options) {
            super(UITools.mergeObjectWithoutArray({
                hideOutputLocalDataDrawer: true,
                defaultLibrary: false,
                rootInputDataDefaultValueSettable: false,
                enableFramebreaks: false,
                templates: {
                    enableLocalTemplates: false,
                    enableGlobalTemplates: false
                },
                hideGraphToolbarButton: 8 /* UIEnums.FGraphToolbarButton.fGraphAnalyzer */,
                expandGraphToolbarButton: 1 /* UIEnums.FGraphToolbarButton.fLoad */ | 2 /* UIEnums.FGraphToolbarButton.fSave */,
                modules: [
                    'DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock',
                    'DS/EPSSchematicsCSI/EPSSchematicsCSIJavaScriptBlock',
                    'DS/EPSSchematicsCSI/EPSSchematicsCSIPythonBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayConcatBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayFilterBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayGetBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayGetIndexBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayInsertBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayIteratorBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayLengthBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayMapBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayPopBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayPushBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayRemoveBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArraySetBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayShiftBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayUnshiftBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSIfBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSSyncFlowsBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSOnlyOneBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSAddBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSDivideBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSIsEqualBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSMultiplyBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSSetValueBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSSubstractBlock'
                ],
                onSave: () => this.onDefaultSaveButtonClick()
            }, options));
            TypeLibrary.registerTypeCastConfig(CSITypeCastConfig);
            CSIEGUIBlockConverterController.registerBlockConverters();
            this._saveGraphDialog = new CSIEGUISaveGraphDialog(this);
        }
        /**
         * Removes the editor.
         * @public
         * @override
         */
        remove() {
            if (this._saveGraphDialog) {
                this._saveGraphDialog.remove();
                this._saveGraphDialog = undefined;
            }
            this._jsonDescription = undefined;
            this._tempRecordInfo = undefined;
            this._tempProgressesRef = undefined;
            this._poolFromRecord = undefined;
            super.remove();
        }
        /**
         * Gets the editor JSON function.
         * @public
         * @param {boolean} exportUI - True to export the UI part else false.
         * @returns {string} The editor JSON function.
         */
        getJSONFunction(exportUI) {
            let json = CSIExport.generateJSON(this.getGraphModel(), this._getJSONVersion());
            if (this._jsonDescription || exportUI) {
                const parsedJson = JSON.parse(json);
                if (this._jsonDescription) {
                    parsedJson.desc = this._jsonDescription;
                }
                if (exportUI) {
                    parsedJson.implementation.settings.implementation.ui = this.getContent();
                }
                json = JSON.stringify(parsedJson);
            }
            EventServices.dispatchEvent(new ExecutionEvents.TraceStopEvent());
            return json;
        }
        /**
         * Sets the editor JSON function.
         * @public
         * @param {string} content - The editor JSON function.
         * @param {string} [fileName] - The name of the JSON function.
         */
        setJSONFunction(content, fileName) {
            this._jsonDescription = undefined;
            this._tempProgressesRef = undefined;
            this._poolFromRecord = undefined;
            // Loads the json content
            let jsonContent = JSON.parse(content);
            // Importing CSI Record
            let inputs, outputs, expected;
            const jsonRecord = jsonContent;
            if (jsonRecord && jsonRecord['function']) {
                inputs = jsonRecord.inputs;
                outputs = jsonRecord.outputs;
                expected = jsonRecord.expected;
                if (Array.isArray(jsonRecord.progresses) && jsonRecord.progresses.length > 0) {
                    this._tempProgressesRef = [];
                    jsonRecord.progresses.forEach(progress => this._tempProgressesRef?.push(CSIExecutionGraphUIEditor._stringifyExportedParameters(progress)));
                }
                if (jsonRecord.poolToSelect) {
                    this._poolFromRecord = jsonRecord.poolToSelect;
                }
                jsonContent = jsonRecord['function'];
                if (fileName) {
                    fileName = fileName.replace('.csirecord', '');
                }
            }
            // Importing CSI function
            const jsonFunction = jsonContent;
            const isCSIFunction = jsonFunction?.implementation?.name === 'executionGraph';
            if (isCSIFunction) {
                try {
                    this._jsonDescription = jsonFunction.desc;
                    const schematicsJSONString = jsonFunction?.implementation?.settings?.implementation?.ui;
                    const isUISectionAvailable = schematicsJSONString !== undefined;
                    let loadJSONFunctionWithoutUI = !isUISectionAvailable;
                    if (isUISectionAvailable) {
                        const schematicsJSONObject = JSON.parse(schematicsJSONString);
                        const hasModel = schematicsJSONObject.hasOwnProperty('version'); // Check a model section is present
                        if (hasModel) {
                            const isGraphVersion2 = jsonFunction.implementation.version === 2;
                            const result = this._setContent(schematicsJSONString, isGraphVersion2);
                            if (result === false) {
                                throw new Error('An error occured while setting the content of the JSON function! There may be an inconsistency between the ui part and the model!');
                            }
                            if (fileName) {
                                this.getGraphModel().setName(fileName); // fileName vs graphName ?
                            }
                        }
                        else {
                            loadJSONFunctionWithoutUI = true;
                            this.displayNotification({
                                level: 'error',
                                title: 'Invalid JSON format',
                                message: 'The model part is not available in the ui part of the JSON! Trying to load the CSI function instead!'
                            });
                        }
                    }
                    if (loadJSONFunctionWithoutUI === true) {
                        CSIImport.buildFromJSONObject(this.getGraphModel(), jsonFunction);
                        if (fileName) {
                            this.getGraphModel().setName(fileName);
                        }
                        this.getViewerController().getRootViewer().getMainGraph().setDefaultBlocksPosition();
                    }
                    if (isUISectionAvailable) {
                        this._setTestValuesFromDefaultValue();
                    }
                    this._setInputTestValues(inputs);
                    this._setOutputTestValues(outputs, expected || '');
                }
                catch (error) {
                    this.displayNotification({
                        level: 'error',
                        title: 'Failed to load the JSON graph',
                        message: 'Error: ' + JSON.stringify(error)
                    });
                    // eslint-disable-next-line no-console
                    console.error(error);
                }
            }
            else { // Fallback on Schematics JSON format
                this._setContent(content);
                this._setTestValuesFromDefaultValue();
            }
        }
        /**
         * Sets the input test values.
         * @private
         * @param {object|undefined} inputs - The input test values.
         */
        _setInputTestValues(inputs) {
            if (inputs) {
                const inputsParameters = CSICommandBinder.createParameters();
                if (inputsParameters.importFromString(JSON.stringify(inputs))) {
                    const callDataPort = this.getGraphModel().getDataPortByName('Call');
                    callDataPort.setTestValues([inputsParameters.toJSObject()]);
                }
            }
        }
        /**
         * Sets the output test values.
         * @private
         * @param {object|undefined} outputs - The output test values.
         * @param {string} expected - The expected data port name.
         */
        _setOutputTestValues(outputs, expected) {
            if (outputs) {
                const expectedDataPortName = expected.charAt(0).toUpperCase() + expected.slice(1);
                const outputDataPort = this.getGraphModel().getDataPortByName(expectedDataPortName);
                const outputsParameters = CSICommandBinder.createParameters();
                if (outputsParameters.importFromString(JSON.stringify(outputs))) {
                    let testValue = outputsParameters.toJSObject();
                    if (expected === 'error') {
                        testValue = testValue.data;
                    }
                    outputDataPort.setTestValues([testValue]);
                }
            }
        }
        /**
         * Gets the json version.
         * @private
         * @returns {number} The json version.
         */
        _getJSONVersion() {
            const isGraphVersion2 = this._getGraphVersion2();
            return isGraphVersion2 ? 2 : 1;
        }
        /**
         * The default callback on the save button click.
         * @public
         */
        onDefaultSaveButtonClick() {
            this._saveGraphDialog.open();
        }
        /**
         * Gets the save graph dialog.
         * @public
         * @returns {CSIEGUISaveGraphDialog} The save graph dialog.
         */
        getSaveGraphDialog() {
            return this._saveGraphDialog;
        }
        /**
         * Gets the pool name used by the record.
         * @public
         * @returns {string|undefined} The pool name used by the record.
         */
        getPoolFromRecord() {
            return this._poolFromRecord;
        }
        /**
         * (DO NOT USE) Gets the temporary record information.
         * @private
         * @ignore
         * @returns {ITempRecordInfo|undefined} The temporary record information.
         */
        _getTempRecordInfo() {
            return this._tempRecordInfo;
        }
        /**
         * (DO NOT USE) Sets the temporary record information.
         * @private
         * @ignore
         * @param {string} poolName - The pool name.
         * @param {string} expectedStatus - The expected status.
         * @param {object} inputs - The inputs test values.
         * @param {object} outputs - The outputs test values.
         * @param {object[]} progresses - The progresses test values.
         */
        _setTempRecordInfo(poolName, expectedStatus, inputs, outputs, progresses) {
            this._tempRecordInfo = {
                poolName: poolName,
                expectedStatus: expectedStatus,
                inputs: inputs,
                outputs: outputs,
                progresses: progresses
            };
        }
        /**
         * (DO NOT USE) Gets the temporary progresses reference.
         * @private
         * @ignore
         * @returns {(string|undefined)[]|undefined} The progresses reference.
         */
        _getTempProgressesRef() {
            return this._tempProgressesRef;
        }
        /**
         * (DO NOT USE) Sets the temporary progresses reference.
         * @private
         * @ignore
         * @param {string[]} progressesRef - The progresses reference.
         */
        _setTempProgressesRef(progressesRef) {
            this._tempProgressesRef = progressesRef;
        }
        /**
         * Creates the CSI Execution Graph UI play planel.
         * @protected
         * @override
         * @returns {CSIEGUIPlayPanel} The created CSI Execution Graph UI play planel.
         */
        _createPlayPanel() {
            return new CSIEGUIPlayPanel(this);
        }
        /**
         * Stringifies the provided exported parameters.
         * @public
         * @static
         * @param {object} parameters - The exported parameters.
         * @returns {string|undefined} The stringified CSI parameters.
         */
        static _stringifyExportedParameters(parameters) {
            let result;
            const refParameters = CSICommandBinder.createParameters();
            if (refParameters.importFromString(JSON.stringify(parameters))) {
                const jsObject = refParameters.toJSObject();
                result = JSON.stringify(jsObject, undefined, 2);
            }
            return result;
        }
        /**
         * Sets test values from default value.
         * @private
         */
        _setTestValuesFromDefaultValue() {
            const callDataPort = this.getGraphModel().getDataPortByName('Call');
            if (callDataPort.isOverride()) { // TMP for old json since new test values
                callDataPort.setTestValues([callDataPort.getDefaultValue()]);
                callDataPort.resetDefaultValue();
            }
        }
        /**
         * Sets the editor content.
         * @private
         * @param {string} content - The JSON string representing the graph content.
         * @returns {boolean} True if the content has been set correctly, false otherwise.
         */
        _setContent(content, isGraphVersion2) {
            let result = false;
            try {
                result = super.setContent(content, isGraphVersion2);
            }
            catch (error) {
                this.displayNotification({
                    level: 'error',
                    title: 'Obsolete version',
                    subtitle: 'The file cannot be loaded.',
                    message: 'This version of json file is not valid anymore: you can visit help section for more informations.'
                });
                // eslint-disable-next-line no-console
                console.error(error);
                const errorEvent = new CSIEGUIEvents.CSIEGUIImportErrorEvent();
                errorEvent.error = error;
                this.dispatchEvent(errorEvent);
            }
            return result;
        }
    }
    return CSIExecutionGraphUIEditor;
});
