/// <amd-module name='DS/EPSSchematicsCoreLibrary/string/EPSConcatStringBlock'/>
define("DS/EPSSchematicsCoreLibrary/string/EPSConcatStringBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/string/EPSSchematicsCoreLibraryStringCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, SettingDefinitions, ValueTypeRules, Enums, StringCategory) {
    "use strict";
    class ConcatStringBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputBasic('Value1', 'String', ''),
                new DataPortDefinitions.InputBasic('Value2', 'String', '')
            ]);
            this.setDataPortInputRules({
                name: { prefix: 'Value', readonly: true },
                valueTypes: new ValueTypeRules.Basic('String', '')
            });
            this.createDataPort(new DataPortDefinitions.OutputBasic('Output String', 'String'));
            this.createSetting(new SettingDefinitions.Basic('Separator', 'String', ''));
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
            const separator = this.getSettingValue('Separator') || '';
            let result = '';
            const inputDataPortNames = this.getInputDataPortNameList();
            for (let i = 0; i < inputDataPortNames.length; i++) {
                result += this.getInputDataPortValue(inputDataPortNames[i]);
                if (i + 1 < inputDataPortNames.length) {
                    result += separator;
                }
            }
            this.setOutputDataPortValue('Output String', result);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ConcatStringBlock.prototype.uid = '25ecb466-9d4e-4116-9d5d-b215f3e75419';
    ConcatStringBlock.prototype.name = 'Concat String';
    ConcatStringBlock.prototype.category = StringCategory;
    ConcatStringBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSConcatStringBlockDoc';
    return ConcatStringBlock;
});
