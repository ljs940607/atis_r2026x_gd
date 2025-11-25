/* eslint-disable dot-notation */
/// <amd-module name='DS/CSIExecutionGraphUI/dialogs/CSIEGUIAbstractSaveRecordDialog'/>
define("DS/CSIExecutionGraphUI/dialogs/CSIEGUIAbstractSaveRecordDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileSaver", "DS/CSIExecutionGraphUI/tools/CSIEGUITools", "DS/EPSSchematicsCSI/EPSSchematicsCSIIntrospection", "DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock", "DS/EPSSchematicsCoreLibrary/array/EPSArrayMapBlock", "DS/EPSSchematicsCSI/EPSSchematicsCSITools"], function (require, exports, UIBaseDialog, UIFileSaver, CSIEGUITools, CSIIntrospection, CSIGraphBlock, ArrayMapBlock, CSITools) {
    "use strict";
    /**
     * This class defines a CSI Execution Graph UI abstract save record dialog.
     * @private
     * @abstract
     * @class CSIEGUIAbstractSaveRecordDialog
     * @alias module:DS/CSIExecutionGraphUI/dialogs/CSIEGUIAbstractSaveRecordDialog
     * @extends UIBaseDialog
     */
    class CSIEGUIAbstractSaveRecordDialog extends UIBaseDialog {
        /**
         * @public
         * @constructor
         * @param {IWUXDialogOptions} options — The dialog options.
         * @param {CSIExecutionGraphUIEditor} editor - The CSI Execution Graph UI editor.
         * @param {CSIEGESaveGraphDialog} saveCSIGraphDialog - The save CSI graph dialog.
         */
        constructor(options, editor, saveCSIGraphDialog) {
            super(options);
            this._editor = editor;
            this._saveCSIGraphDialog = saveCSIGraphDialog;
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
            super.remove();
            this._editor = undefined;
            this._saveCSIGraphDialog = undefined;
            this._fileSaver = undefined;
        }
        /**
         * Gets the save record button.
         * @public
         * @returns {WUXButton|undefined} The save record button.
         */
        getSaveRecordButton() {
            return this._dialog.buttons.Save;
        }
        /**
         * Gets the file saver.
         * @public
         * @returns {UIFileSaver} The file saver.
         */
        getFileSaver() {
            return this._fileSaver;
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
         * @param {*} [args] - The optionnal arguments.
         */
        _onClose(args) {
            super._onClose(args);
            this._saveCSIGraphDialog.close();
        }
        /**
         * Exports the JSON record to file.
         * @protected
         * @param {ISaveRecordOptions} options - The save record options.
         */
        _exportJSONRecordToFile(options) {
            options = options || {
                'function': true,
                inputs: true,
                progresses: true,
                outputs: true,
                expectedStatus: true,
                poolToSelect: true,
                nodesConfig: true
            };
            const hasGraphChangedAfterPlay = this._saveCSIGraphDialog.hasGraphModelOrIOTestValuesChanged();
            const tmpRecordInfo = hasGraphChangedAfterPlay ? undefined : this._editor._getTempRecordInfo();
            const hasTmpRecordInfo = tmpRecordInfo !== undefined;
            const fctInfo = CSIEGUITools.getCSIFunctionInfo(this._editor.getGraphModel());
            const config = {
                grammarVersion: 1,
                $schema: 'http://executionfw.dsone.3ds.com/schema/csiRecord.schema.json',
                poolName: fctInfo.pool || 'CSITestExecutionGraph',
                functionName: fctInfo.name || 'newExecutionGraphFuntion',
                version: fctInfo.version || '1'
            };
            const fileNameWithVersion = (fctInfo.name && fctInfo.version) ? fctInfo.name + '_v' + fctInfo.version : undefined;
            const fileName = (fileNameWithVersion || config.functionName) + '.csirecord.json';
            if (options['function'] === true) {
                config['function'] = JSON.parse(this._editor.getJSONFunction(true));
            }
            if (options.inputs === true) {
                config.inputs = hasTmpRecordInfo ? tmpRecordInfo.inputs : this._buildTestInputsFromModel();
            }
            if (options.outputs === true) {
                config.outputs = hasTmpRecordInfo ? tmpRecordInfo.outputs : this._buildTestOutputsFromModel();
            }
            if (options.progresses === true) {
                config.progresses = hasTmpRecordInfo ? tmpRecordInfo.progresses : this._buildTestProgressesFromModel();
            }
            if (options.expectedStatus === true) {
                config.expected = options.expectedStatusOverload || this._getExpectedStatus();
            }
            if (options.poolToSelect === true) {
                const overload = options.poolToSelectOverload;
                config.poolToSelect = overload && overload !== '' ? overload : hasTmpRecordInfo ? tmpRecordInfo.poolName : undefined;
            }
            if (options.nodesConfig === true) {
                config.nodesToCreate = [];
                if (options.nodesConfigOverload !== undefined) {
                    config.cmdsToLaunch = options.nodesConfigOverload;
                }
                else {
                    this._buildNodesConfig(config);
                }
            }
            const content = JSON.stringify(config, undefined, 2) + '\n';
            this._fileSaver.saveTextFile(content, fileName);
        }
        /**
         * Gets the expected client status.
         * @protected
         * @returns {string|undefined} The expected client status.
         */
        _getExpectedStatus() {
            let result;
            const tmpRecordInfo = this._editor._getTempRecordInfo();
            if (tmpRecordInfo !== undefined) {
                result = tmpRecordInfo.expectedStatus;
            }
            else {
                const graphModel = this._editor.getGraphModel();
                const successDataPort = graphModel.getDataPortByName('Success');
                const errorDataPort = graphModel.getDataPortByName('Error');
                const hasSuccess = successDataPort.getTestValues()[0] !== undefined;
                const hasError = errorDataPort.getTestValues()[0] !== undefined;
                const hasBothOrNone = (hasSuccess && hasError) || (!hasSuccess && !hasError);
                result = hasBothOrNone ? undefined : hasSuccess ? 'success' : 'error';
            }
            return result;
        }
        /**
         * Gets the nodes config.
         * @protected
         * @returns {string[]|undefined} The nodes config.
         */
        _getNodesConfig() {
            const config = {};
            this._buildNodesConfig(config);
            return config.cmdsToLaunch;
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
         * Builds the test inputs from the model to the JSON parameters format.
         * @private
         * @returns {any} The test inputs with JSON parameters format.
         */
        _buildTestInputsFromModel() {
            return this._buildTestValueFromModel('Call');
        }
        /**
         * Builds the test outputs from the model to the JSON parameters format.
         * If success and error test output are filled, we take the success test output!
         * @private
         * @returns {any} The test outputs with JSON parameters format.
         */
        _buildTestOutputsFromModel() {
            const successTestValue = this._buildTestValueFromModel('Success');
            const errorTestValue = this._buildTestValueFromModel('Error');
            return successTestValue || errorTestValue;
        }
        /**
         * Builds the test progresses from the model to the JSON parameters format.
         * @private
         * @returns {any} The test progresses with JSON parameters format.
         */
        _buildTestProgressesFromModel() {
            return this._buildTestValueFromModel('Progress');
        }
        /**
         * Builds the test value from the model to the JSON parameters format.
         * @private
         * @param {string} dataPortName - The name of the data port.
         * @returns {any} The test value with JSON parameters format.
         */
        _buildTestValueFromModel(dataPortName) {
            let result;
            const graphModel = this._editor.getGraphModel();
            const dataPort = graphModel.getDataPortByName(dataPortName);
            if (dataPort) {
                const testValue = dataPort.getTestValues()[0];
                if (testValue !== undefined) {
                    const name = dataPort.getValueType();
                    const graphContext = graphModel.getGraphContext();
                    const parameters = CSITools.createParameters(name, testValue, graphContext);
                    const stringParameters = parameters.exportToString();
                    result = JSON.parse(stringParameters);
                }
            }
            return result;
        }
        /**
         * Builds the nodes config.
         * @private
         * @param {IJSONRecordConfig} config - The JSON record config.
         */
        _buildNodesConfig(config) {
            config.cmdsToLaunch = [];
            const tmpRecordInfo = this._editor._getTempRecordInfo();
            if (tmpRecordInfo !== undefined) {
                CSIEGUIAbstractSaveRecordDialog._pushPoolInConfig(tmpRecordInfo.poolName, config);
                this._buildNodesConfigOf(this._editor.getGraphModel(), config);
            }
        }
        /**
         * Pushes the pool into the JSON record config.
         * @private
         * @static
         * @param {string} pool - The pool name.
         * @param {IJSONRecordConfig} config - The JSON record config.
         * @param {boolean} [java=false] - True for java function else false.
         * @param {string} [identifier=undefined] - The identifier.
         * @param {number} [maxInstanceCount=undefined] - The max instance count.
         */
        static _pushPoolInConfig(pool, config, java, identifier, maxInstanceCount) {
            let cmd = (java ? 'sh 3DExperienceNodeJava.sh' : '3DExperienceNode') + ' -p ' + pool;
            if (identifier && identifier.length > 0) {
                cmd += ' -id ' + identifier;
            }
            if (maxInstanceCount === undefined) {
                maxInstanceCount = 1;
            }
            for (let i = 0; i < maxInstanceCount; i++) {
                config.cmdsToLaunch?.push(cmd);
            }
        }
        /**
         * Builds the nodes config of the provided graph block.
         * @private
         * @param {GraphBlock} graphBlock - The graph block.
         * @param {IJSONRecordConfig} config - The JSON record config.
         */
        _buildNodesConfigOf(graphBlock, config) {
            const nodeIdForJava = {};
            graphBlock.getBlocks().forEach(block => {
                if (block.getNodeIdSelector() === undefined) {
                    if (block instanceof CSIGraphBlock) {
                        CSIEGUIAbstractSaveRecordDialog._pushPoolInConfig('CSIExecutionGraph', config);
                        this._buildNodesConfigOf(block, config);
                    }
                    else if (block instanceof ArrayMapBlock) {
                        CSIEGUIAbstractSaveRecordDialog._pushPoolInConfig('CSIExecutionGraph', config);
                        this._buildNodesConfigOf(block.getContainedGraph(), config);
                    }
                    else if (CSIIntrospection.hasBlock(block.getUid())) {
                        CSIEGUIAbstractSaveRecordDialog._pushPoolInConfig(CSIIntrospection.getFunctionPool(block.getUid()), config, this._isJavaFunction(block));
                    }
                }
                else if (this._isJavaFunction(block)) {
                    nodeIdForJava[CSIIntrospection.getFunctionPool(block.getUid())] = true;
                }
            });
            graphBlock.getNodeIdSelectors().forEach(nodeIdSelector => {
                const poolName = nodeIdSelector.getPool();
                CSIEGUIAbstractSaveRecordDialog._pushPoolInConfig(poolName, config, nodeIdForJava[poolName], nodeIdSelector.getIdentifier(), nodeIdSelector.getMaxInstanceCount());
            });
        }
        /**
         * Checks if the provided block is a java function.
         * @private
         * @param {Block} block - The block.
         * @returns {boolean} True if the block is a java function else false.
         */
        // eslint-disable-next-line class-methods-use-this
        _isJavaFunction(block) {
            let result = CSIIntrospection.getFunctionImplementationName(block.getUid()) === 'java';
            return result;
        }
    }
    return CSIEGUIAbstractSaveRecordDialog;
});
