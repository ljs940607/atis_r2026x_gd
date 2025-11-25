/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionScriptBlock'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionScriptBlock", ["require", "exports", "DS/EPSSchematicEngine/EPSSchematicsExecutionBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, ExecutionBlock, Events, Enums) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a schematics execution script block.
     * @class ExecutionScriptBlock
     * @alias module:DS/EPSSchematicEngine/EPSSchematicsExecutionScriptBlock
     * @private
     */
    class ExecutionScriptBlock extends ExecutionBlock {
        /**
         * @constructor
         * @param {ScriptBlock} model - The block model.
         * @param {ExecutionGraph} parent - The parent graph.
         */
        constructor(model, parent) {
            super(model, parent);
            const onBlockScriptContentChangeCB = this.onBlockScriptContentChange.bind(this);
            this.model.addListener(Events.BlockScriptContentChangeEvent, onBlockScriptContentChangeCB);
            this._updateScript(this.model.getScriptContent());
        }
        /**
         * Updates the script block.
         * @private
         * @param {string} scriptContent - The script content.
         */
        _updateScript(scriptContent) {
            const handleShorcuts = this.parent !== undefined && (this.parent.version === '1.0.0' || this.parent.version === '1.0.1');
            // Initialize the execution script
            let executionScript = '(function (runParams) {\n';
            if (handleShorcuts) {
                // Declare data ports shortcuts
                const dataPorts = this.getDataPorts();
                for (let dp = 0; dp < dataPorts.length; dp++) {
                    const dataPort = dataPorts[dp];
                    if (dataPort.model.getType() === Enums.EDataPortType.eInput) {
                        executionScript += 'var ' + dataPort.model.getName() + ' = this.dataPorts[' + dp + '].getValue();\n';
                    }
                    else if (dataPort.model.getType() === Enums.EDataPortType.eOutput) {
                        executionScript += 'var ' + dataPort.model.getName() + ';\n';
                    }
                }
            }
            // Declare the execution function
            executionScript += 'var __scriptFunction = function (runParams) {\n';
            executionScript += scriptContent + '\n};\n';
            executionScript += 'var __scriptReturn = __scriptFunction.call(this, runParams);\n';
            if (handleShorcuts) {
                // Copy shortcuts value to outputs data ports
                const dataPorts = this.getDataPorts();
                for (let dp = 0; dp < dataPorts.length; dp++) {
                    const dataPort = dataPorts[dp];
                    if (dataPort.model.getType() === Enums.EDataPortType.eOutput) {
                        executionScript += 'if (' + dataPort.model.getName() + ' !== undefined) ';
                        executionScript += 'this.dataPorts[' + dp + '].setValue(' + dataPort.model.getName() + ');\n';
                    }
                }
            }
            // Function return
            executionScript += 'return __scriptReturn;\n';
            executionScript += '});';
            // Evaluate to get execute function
            this.onExecute = eval(executionScript); // eslint-disable-line
        }
        /**
         * The callback on the block script change event.
         * @private
         * @param {BlockScriptContentChangeEvent} event - The block script change event.
         */
        onBlockScriptContentChange(event) {
            this._updateScript(event.getScriptContent());
        }
    }
    return ExecutionScriptBlock;
});
