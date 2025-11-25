/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSMultiplyBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSMultiplyBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, CalculatorCategory) {
    "use strict";
    class MultiplyBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortValue1 = this.createDataPort(new DataPortDefinitions.InputCategory('Value1', Enums.FTypeCategory.fNumerical, 'Double', {
                'Double': 0.0,
                'Integer': 0
            }));
            this.createDataPorts([
                new DataPortDefinitions.InputRef('Value2', dataPortValue1, {
                    'Double': 0.0,
                    'Integer': 0
                }),
                new DataPortDefinitions.OutputRef('Result', dataPortValue1)
            ]);
            this.setDataPortInputRules({
                name: { prefix: 'Value', readonly: true },
                valueTypes: new ValueTypeRules.Ref(dataPortValue1, {
                    'Double': 0.0,
                    'Integer': 0
                })
            });
            this.setDataPortOutputRules({ dynamicCount: 0 });
            this.setDataPortLocalRules({ dynamicCount: 0 });
            this.setDataPortInputExternalRules({ dynamicCount: 0 });
            this.setControlPortInputRules({ dynamicCount: 0 });
            this.setControlPortOutputRules({ dynamicCount: 0 });
            this.setEventPortInputRules({ dynamicCount: 0 });
            this.setEventPortOutputRules({ dynamicCount: 0 });
            this.setSettingRules({ dynamicCount: 0 });
        }
        execute() {
            const inputDataPortNames = this.getInputDataPortNameList();
            let result = this.getInputDataPortValue(inputDataPortNames[0]);
            for (let i = 1; i < inputDataPortNames.length; i++) {
                result *= this.getInputDataPortValue(inputDataPortNames[i]);
            }
            this.setOutputDataPortValue('Result', result);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    MultiplyBlock.prototype.uid = '74311df0-1313-4447-b6cf-e0a5f981f916';
    MultiplyBlock.prototype.name = 'Multiply';
    MultiplyBlock.prototype.category = CalculatorCategory;
    MultiplyBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSMultiplyBlockDoc';
    return MultiplyBlock;
});
