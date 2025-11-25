/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSSetValueBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSSetValueBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, CalculatorCategory) {
    "use strict";
    class SetValueBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortValueIn1 = this.createDataPort(new DataPortDefinitions.InputAll('ValueIn1', 'Double', {
                'Boolean': false,
                'Double': 0.0,
                'Integer': 0,
                'String': ''
            }));
            this.createDataPort(new DataPortDefinitions.OutputRef('ValueOut1', dataPortValueIn1));
            this.setDataPortInputRules({
                name: { prefix: 'ValueIn', readonly: true },
                valueTypes: new ValueTypeRules.All('Double', {
                    'Boolean': false,
                    'Double': 0.0,
                    'Integer': 0,
                    'String': ''
                })
            });
            this.setDataPortOutputRules({
                name: { prefix: 'ValueOut', readonly: true },
                valueTypes: new ValueTypeRules.RefIndex()
            });
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
            const outputDataPortNames = this.getOutputDataPortNameList();
            for (let i = 0; i < inputDataPortNames.length; i++) {
                this.setOutputDataPortValue(outputDataPortNames[i], this.getInputDataPortValue(inputDataPortNames[i]));
            }
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    SetValueBlock.prototype.uid = '8dc81190-2eb2-4e20-a595-8939ff534f29';
    SetValueBlock.prototype.name = 'Set Value';
    SetValueBlock.prototype.category = CalculatorCategory;
    SetValueBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSSetValueBlockDoc';
    return SetValueBlock;
});
