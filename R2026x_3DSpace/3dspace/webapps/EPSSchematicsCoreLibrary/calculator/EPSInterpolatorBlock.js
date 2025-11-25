/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSInterpolatorBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSInterpolatorBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, CalculatorCategory) {
    "use strict";
    class InterpolatorBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortValue1 = this.createDataPort(new DataPortDefinitions.InputList('Value1', ['Double', 'Integer'], 'Double', {
                'Double': 0.0,
                'Integer': 0
            }));
            this.createDataPorts([
                new DataPortDefinitions.InputRef('Value2', dataPortValue1, {
                    'Double': 1.0,
                    'Integer': 1
                }),
                new DataPortDefinitions.InputBasic('Alpha', 'Double', 0.0),
                new DataPortDefinitions.OutputRef('Result', dataPortValue1)
            ]);
        }
        execute() {
            const value1 = this.getInputDataPortValue('Value1');
            const value2 = this.getInputDataPortValue('Value2');
            const alpha = this.getInputDataPortValue('Alpha');
            let result = 0;
            if (value1 < value2) {
                result = value1 + (value2 - value1) * alpha;
            }
            else if (value1 > value2) {
                result = value1 - (value1 - value2) * alpha;
            }
            else {
                result = value1;
            }
            result = this.getInputDataPortValueType('Value1') === 'Integer' ? Math.round(result) : result;
            this.setOutputDataPortValue('Result', result);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    InterpolatorBlock.prototype.uid = '32c42e7d-53bc-4119-bdfe-b1fff627a1c8';
    InterpolatorBlock.prototype.name = 'Interpolator';
    InterpolatorBlock.prototype.category = CalculatorCategory;
    InterpolatorBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSInterpolatorBlockDoc';
    return InterpolatorBlock;
});
