/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSParameterSelectorBlock'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSParameterSelectorBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort", "DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, DataPort, FlowCategory) {
    "use strict";
    class ParameterSelectorBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In1'),
                new ControlPortDefinitions.Input('In2'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortValue1 = this.createDataPort(new DataPortDefinitions.InputAll('Value1', 'Double', {
                'Boolean': false,
                'Double': 0.0,
                'Integer': 0,
                'String': ''
            }));
            this.createDataPorts([
                new DataPortDefinitions.InputRef('Value2', dataPortValue1, {
                    'Boolean': false,
                    'Double': 0.0,
                    'Integer': 0,
                    'String': ''
                }),
                new DataPortDefinitions.OutputRef('SelectedValue', dataPortValue1)
            ]);
            this.setDataPortInputRules({
                name: { prefix: 'Value', readonly: true },
                valueTypes: new ValueTypeRules.Ref(dataPortValue1, {
                    'Boolean': false,
                    'Double': 0.0,
                    'Integer': 0,
                    'String': ''
                })
            });
            this.setDataPortOutputRules({ dynamicCount: 0 });
            this.setDataPortLocalRules({ dynamicCount: 0 });
            this.setDataPortInputExternalRules({ dynamicCount: 0 });
            this.setControlPortInputRules({
                name: { prefix: 'In', readonly: true },
                dynamicCount: { ctor: DataPort, type: Enums.EDataPortType.eInput }
            });
            this.setControlPortOutputRules({ dynamicCount: 0 });
            this.setEventPortInputRules({ dynamicCount: 0 });
            this.setEventPortOutputRules({ dynamicCount: 0 });
            this.setSettingRules({ dynamicCount: 0 });
        }
        execute() {
            const inputControlPortNames = this.getInputControlPortNameList();
            const inputDataPortNames = this.getInputDataPortNameList();
            for (let i = 0; i < inputControlPortNames.length; i++) {
                if (this.isInputControlPortActivated(inputControlPortNames[i])) {
                    this.setOutputDataPortValue('SelectedValue', this.getInputDataPortValue(inputDataPortNames[i]));
                    this.activateOutputControlPort('Out');
                    break;
                }
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ParameterSelectorBlock.prototype.uid = '29d8cb5e-1371-4020-9529-bc562bc1011f';
    ParameterSelectorBlock.prototype.name = 'Parameter Selector';
    ParameterSelectorBlock.prototype.category = FlowCategory;
    ParameterSelectorBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSParameterSelectorBlockDoc';
    return ParameterSelectorBlock;
});
