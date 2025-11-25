/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSCompareBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSCompareBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, CalculatorCategory) {
    "use strict";
    class CompareBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Equal'),
                new ControlPortDefinitions.Output('Greater'),
                new ControlPortDefinitions.Output('Lesser')
            ]);
            const dataPortValue1 = this.createDataPort(new DataPortDefinitions.InputList('Value1', ['Double', 'Integer'], 'Double', {
                'Double': 0.0,
                'Integer': 0
            }));
            this.createDataPort(new DataPortDefinitions.InputRef('Value2', dataPortValue1, {
                'Double': 0.0,
                'Integer': 0
            }));
        }
        execute() {
            const value1 = this.getInputDataPortValue('Value1');
            const value2 = this.getInputDataPortValue('Value2');
            if (value1 === value2) {
                this.activateOutputControlPort('Equal');
            }
            else if (value1 > value2) {
                this.activateOutputControlPort('Greater');
            }
            else {
                this.activateOutputControlPort('Lesser');
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    CompareBlock.prototype.uid = 'f0e74e29-3829-4744-82f7-acb12bd3bc7f';
    CompareBlock.prototype.name = 'Compare';
    CompareBlock.prototype.category = CalculatorCategory;
    CompareBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCompareBlockDoc';
    return CompareBlock;
});
