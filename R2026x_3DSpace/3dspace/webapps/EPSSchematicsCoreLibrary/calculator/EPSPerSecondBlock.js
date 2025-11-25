/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSPerSecondBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSPerSecondBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, CalculatorCategory) {
    "use strict";
    class PerSecondBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputBasic('Input', 'Double', 1.0),
                new DataPortDefinitions.OutputBasic('Output', 'Double')
            ]);
        }
        execute(runParams) {
            const input = this.getInputDataPortValue('Input');
            const output = input * runParams.deltaTime * 0.001;
            this.setOutputDataPortValue('Output', output);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    PerSecondBlock.prototype.uid = '33272ee5-babf-4b5c-9b89-8a83d5946d06';
    PerSecondBlock.prototype.name = 'Per Second';
    PerSecondBlock.prototype.category = CalculatorCategory;
    PerSecondBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSPerSecondBlockDoc';
    return PerSecondBlock;
});
