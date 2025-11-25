/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSRandomBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSRandomBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, CalculatorCategory) {
    "use strict";
    class RandomBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortMin = this.createDataPort(new DataPortDefinitions.InputList('Min', ['Double', 'Integer'], 'Double', {
                'Double': 0.0,
                'Integer': 0
            }));
            this.createDataPorts([
                new DataPortDefinitions.InputRef('Max', dataPortMin, {
                    'Double': 1.0,
                    'Integer': 1
                }),
                new DataPortDefinitions.OutputRef('Result', dataPortMin)
            ]);
        }
        execute() {
            const min = this.getInputDataPortValue('Min');
            const max = this.getInputDataPortValue('Max');
            const isInteger = this.getInputDataPortValueType('Min') === 'Integer';
            const result = isInteger ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;
            this.setOutputDataPortValue('Result', result);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    RandomBlock.prototype.uid = 'efe981bf-908b-4a50-a09c-42f1bf9227ce';
    RandomBlock.prototype.name = 'Random';
    RandomBlock.prototype.category = CalculatorCategory;
    RandomBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSRandomBlockDoc';
    return RandomBlock;
});
