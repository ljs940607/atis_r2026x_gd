/// <amd-module name='DS/EPSSchematicsCoreLibrary/debug/EPSNotifyBlock'/>
define("DS/EPSSchematicsCoreLibrary/debug/EPSNotifyBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions", "DS/EPSSchematicsCoreLibrary/EPSESeverityType", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/debug/EPSSchematicsCoreLibraryDebugCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, SettingDefinitions, ESeverity, Enums, DebugCategory) {
    "use strict";
    class NotifyBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPort(new DataPortDefinitions.InputBasic('Title', 'String', ''));
            this.createDataPort(new DataPortDefinitions.InputList('Message', ['String', 'Integer', 'Double', 'Boolean'], 'String', {
                'String': 'Hello World!',
                'Integer': 0,
                'Double': 0.0,
                'Boolean': false
            }));
            this.createSetting(new SettingDefinitions.Basic('Severity', 'ESeverity', ESeverity.eInfo));
        }
        execute() {
            const severity = this.getSettingValue('Severity') || ESeverity.eInfo;
            const title = this.getInputDataPortValue('Title');
            const message = this.getInputDataPortValue('Message');
            this.notify(severity, title, message);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    NotifyBlock.prototype.uid = '381afc55-87e9-4663-9211-59abab491c7e';
    NotifyBlock.prototype.name = 'Notify';
    NotifyBlock.prototype.category = DebugCategory;
    NotifyBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSNotifyBlockDoc';
    return NotifyBlock;
});
