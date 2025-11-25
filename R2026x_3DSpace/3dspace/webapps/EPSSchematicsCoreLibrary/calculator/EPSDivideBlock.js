/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSDivideBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSDivideBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, CalculatorCategory) {
    "use strict";
    class DivideBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out'),
                new ControlPortDefinitions.Output('Invalid')
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
                result /= this.getInputDataPortValue(inputDataPortNames[i]);
            }
            if (isFinite(result)) {
                this.setOutputDataPortValue('Result', result);
                this.activateOutputControlPort('Out');
            }
            else {
                this.activateOutputControlPort('Invalid');
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    DivideBlock.prototype.uid = 'f9e12486-83da-4078-874e-71ef1e1aaed3';
    DivideBlock.prototype.name = 'Divide';
    DivideBlock.prototype.category = CalculatorCategory;
    DivideBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSDivideBlockDoc';
    return DivideBlock;
});
