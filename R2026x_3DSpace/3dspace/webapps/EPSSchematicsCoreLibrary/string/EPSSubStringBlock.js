/// <amd-module name='DS/EPSSchematicsCoreLibrary/string/EPSSubStringBlock'/>
define("DS/EPSSchematicsCoreLibrary/string/EPSSubStringBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/string/EPSSchematicsCoreLibraryStringCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, StringCategory) {
    "use strict";
    class SubStringBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputBasic('Input String', 'String', ''),
                new DataPortDefinitions.InputBasic('Start', 'Integer', 0),
                new DataPortDefinitions.InputBasic('Length', 'Integer', -1),
                new DataPortDefinitions.OutputBasic('Output String', 'String')
            ]);
        }
        execute() {
            const inputString = this.getInputDataPortValue('Input String');
            const start = this.getInputDataPortValue('Start');
            const length = this.getInputDataPortValue('Length');
            let outputString = '';
            if (inputString !== undefined && inputString !== null) {
                outputString = (length > 0) ? inputString.substr(start, length) : inputString.substr(start);
            }
            this.setOutputDataPortValue('Output String', outputString);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    SubStringBlock.prototype.uid = '45cffa7d-d92f-44c3-be9e-a960044ff933';
    SubStringBlock.prototype.name = 'Sub String';
    SubStringBlock.prototype.category = StringCategory;
    SubStringBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSSubStringBlockDoc';
    return SubStringBlock;
});
