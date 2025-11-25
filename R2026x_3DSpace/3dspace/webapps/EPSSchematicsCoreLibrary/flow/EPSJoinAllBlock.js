/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory"], function (require, exports, Block, ControlPortDefinitions, FlowCategory) {
    "use strict";
    class JoinAllBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
        }
    }
    JoinAllBlock.prototype.uid = 'a11c4b60-f396-4811-bb61-a19ae23cfc5c';
    JoinAllBlock.prototype.name = 'Join All';
    JoinAllBlock.prototype.category = FlowCategory;
    JoinAllBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSJoinAllBlockDoc';
    return JoinAllBlock;
});
