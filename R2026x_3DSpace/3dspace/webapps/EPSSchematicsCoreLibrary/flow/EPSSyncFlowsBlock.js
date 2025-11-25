/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSSyncFlowsBlock'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSSyncFlowsBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, FlowCategory) {
    "use strict";
    class SyncFlowsBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In1'),
                new ControlPortDefinitions.Input('In2'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.setDataPortInputRules({ dynamicCount: 0 });
            this.setDataPortOutputRules({ dynamicCount: 0 });
            this.setDataPortLocalRules({ dynamicCount: 0 });
            this.setDataPortInputExternalRules({ dynamicCount: 0 });
            this.setControlPortInputRules({ name: { prefix: 'In', readonly: true } });
            this.setControlPortOutputRules({ dynamicCount: 0 });
            this.setEventPortInputRules({ dynamicCount: 0 });
            this.setEventPortOutputRules({ dynamicCount: 0 });
            this.setSettingRules({ dynamicCount: 0 });
        }
    }
    SyncFlowsBlock.prototype.uid = '14cbf758-aca1-4021-90fe-c241f65db354';
    SyncFlowsBlock.prototype.name = 'Sync Flows';
    SyncFlowsBlock.prototype.category = FlowCategory;
    SyncFlowsBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSSyncFlowsBlockDoc';
    return SyncFlowsBlock;
});
