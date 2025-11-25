/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSOnlyOneBlock'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSOnlyOneBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, DataPort, ValueTypeRules, Enums, FlowCategory) {
    "use strict";
    class OnlyOneBlock extends DynamicBlock {
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
            if (!this.data.executed) {
                const inputControlPortNames = this.getInputControlPortNameList();
                const inputDataPortNames = this.getInputDataPortNameList();
                for (let i = 0; i < inputControlPortNames.length; i++) {
                    if (this.isInputControlPortActivated(inputControlPortNames[i])) {
                        this.setOutputDataPortValue('SelectedValue', this.getInputDataPortValue(inputDataPortNames[i]));
                        this.activateOutputControlPort('Out');
                        this.data.executed = true;
                        break;
                    }
                }
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    OnlyOneBlock.prototype.uid = 'ffeb5f74-51d3-4631-9f05-4538cb8ec893';
    OnlyOneBlock.prototype.name = 'Only One';
    OnlyOneBlock.prototype.category = FlowCategory;
    OnlyOneBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSOnlyOneBlockDoc';
    return OnlyOneBlock;
});
