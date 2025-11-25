/// <amd-module name='DS/EPSSchematicsCoreLibrary/debug/EPSPrintBlock'/>
define("DS/EPSSchematicsCoreLibrary/debug/EPSPrintBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsCoreLibrary/EPSESeverityType", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/debug/EPSSchematicsCoreLibraryDebugCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, SettingDefinitions, ValueTypeRules, ESeverity, Enums, DebugCategory) {
    "use strict";
    class PrintBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPort(new DataPortDefinitions.InputAll('Value1', 'String', { 'String': 'Hello World!' }));
            this.createSetting(new SettingDefinitions.Basic('Severity', 'ESeverity', ESeverity.eInfo));
            this.setDataPortInputRules({
                name: { prefix: 'Value', readonly: true },
                valueTypes: new ValueTypeRules.All('String')
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
            const printContent = [];
            for (let i = 0; i < inputDataPortNames.length; i++) {
                printContent.push(this.getInputDataPortValue(inputDataPortNames[i]));
            }
            const severity = this.getSettingValue('Severity') || ESeverity.eInfo;
            this.print(severity, ...printContent);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    PrintBlock.prototype.uid = 'ce0a713f-6ada-4db0-b608-5f138579b668';
    PrintBlock.prototype.name = 'Print';
    PrintBlock.prototype.category = DebugCategory;
    PrintBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSPrintBlockDoc';
    return PrintBlock;
});
