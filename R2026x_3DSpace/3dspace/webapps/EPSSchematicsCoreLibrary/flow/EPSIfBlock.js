/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSIfBlock'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSIfBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, FlowCategory) {
    "use strict";
    class IfBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('True'),
                new ControlPortDefinitions.Output('False')
            ]);
            this.createDataPort(new DataPortDefinitions.InputBasic('Condition', 'Boolean', false));
        }
        execute() {
            const condition = this.getInputDataPortValue('Condition');
            this.activateOutputControlPort(condition ? 'True' : 'False');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    IfBlock.prototype.uid = '6f0fb6a2-c669-4825-9c64-fc9e8a268e79';
    IfBlock.prototype.name = 'If';
    IfBlock.prototype.category = FlowCategory;
    IfBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSIfBlockDoc';
    return IfBlock;
});
