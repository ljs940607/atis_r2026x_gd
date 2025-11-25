/// <amd-module name='DS/EPSSchematicsCoreLibrary/string/EPSContainsStringBlock'/>
define("DS/EPSSchematicsCoreLibrary/string/EPSContainsStringBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/string/EPSSchematicsCoreLibraryStringCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, StringCategory) {
    "use strict";
    class ContainsStringBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('True'),
                new ControlPortDefinitions.Output('False')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputBasic('Input String', 'String', ''),
                new DataPortDefinitions.InputBasic('Searched String', 'String', ''),
                new DataPortDefinitions.InputBasic('From Index', 'Integer', 0),
                new DataPortDefinitions.OutputBasic('Found Index', 'Integer')
            ]);
        }
        execute() {
            const inputString = this.getInputDataPortValue('Input String');
            const searchedString = this.getInputDataPortValue('Searched String');
            const fromIndex = this.getInputDataPortValue('From Index');
            const result = inputString !== undefined ? inputString.indexOf(searchedString, fromIndex) : -1;
            if (result !== -1) {
                this.activateOutputControlPort('True');
            }
            else {
                this.activateOutputControlPort('False');
            }
            this.setOutputDataPortValue('Found Index', result);
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ContainsStringBlock.prototype.uid = '467b8c1d-9d76-4405-8dfa-cf03efb74eca';
    ContainsStringBlock.prototype.name = 'Contains String';
    ContainsStringBlock.prototype.category = StringCategory;
    ContainsStringBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSContainsStringBlockDoc';
    return ContainsStringBlock;
});
