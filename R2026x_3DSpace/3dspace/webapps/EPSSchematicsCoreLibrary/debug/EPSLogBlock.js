/* eslint-disable no-console */
/// <amd-module name='DS/EPSSchematicsCoreLibrary/debug/EPSLogBlock'/>
define("DS/EPSSchematicsCoreLibrary/debug/EPSLogBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions", "DS/EPSSchematicsCoreLibrary/EPSESeverityType", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/debug/EPSSchematicsCoreLibraryDebugCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, SettingDefinitions, ESeverity, ValueTypeRules, Enums, DebugCategory) {
    "use strict";
    class LogBlock extends DynamicBlock {
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
            const values = [];
            for (let i = 0; i < inputDataPortNames.length; i++) {
                values.push(this.getInputDataPortValue(inputDataPortNames[i]));
            }
            const severity = this.getSettingValue('Severity') || ESeverity.eInfo;
            switch (severity) {
                case ESeverity.eInfo:
                    console.info.apply(undefined, values);
                    break;
                case ESeverity.eWarning:
                    console.warn.apply(undefined, values);
                    break;
                case ESeverity.eDebug:
                    console.debug.apply(undefined, values);
                    break;
                case ESeverity.eError:
                    console.error.apply(undefined, values);
                    break;
                case ESeverity.eSuccess:
                    console.log.apply(undefined, values);
                    break;
            }
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    LogBlock.prototype.uid = 'a2c886c6-64fd-4a1d-a02f-fbba81c3e080';
    LogBlock.prototype.name = 'Log';
    LogBlock.prototype.category = DebugCategory;
    LogBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSLogBlockDoc';
    return LogBlock;
});
