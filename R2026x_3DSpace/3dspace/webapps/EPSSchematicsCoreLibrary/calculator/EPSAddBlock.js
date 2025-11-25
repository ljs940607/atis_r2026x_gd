/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSAddBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSAddBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, CalculatorCategory) {
    "use strict";
    class AddBlock extends DynamicBlock {
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
                result += this.getInputDataPortValue(inputDataPortNames[i]);
            }
            this.setOutputDataPortValue('Result', result);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    AddBlock.prototype.uid = '7da33b4b-94f6-46a6-b4c0-572d3d74b5f9';
    AddBlock.prototype.name = 'Add';
    AddBlock.prototype.category = CalculatorCategory;
    AddBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSAddBlockDoc';
    return AddBlock;
});
