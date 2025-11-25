/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSWaitAllBlock'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSWaitAllBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, SettingDefinitions, Enums, FlowCategory) {
    "use strict";
    class WaitAllBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In1'),
                new ControlPortDefinitions.Input('In2'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createSetting(new SettingDefinitions.Basic('Same Frame', 'Boolean', false));
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
        execute(runParams) {
            const sameFrame = this.getSettingValue('Same Frame');
            if ((sameFrame && this.data.time !== runParams.currentTime) || this.data.time === undefined) {
                this.data.time = runParams.currentTime;
                WaitAllBlock._resetInputStates.call(this);
                WaitAllBlock._resetInputStates.call(this);
            }
            WaitAllBlock._activateInputs.call(this);
            if (WaitAllBlock._areAllInputsActivated.call(this)) {
                this.data.time = undefined;
                this.activateOutputControlPort('Out');
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
        static _resetInputStates() {
            this.data.inputStates = [];
            const inputControlPortNames = this.getInputControlPortNameList();
            for (let i = 0; i < inputControlPortNames.length; i++) {
                this.data.inputStates.push(false);
            }
        }
        static _areAllInputsActivated() {
            for (let i = 0; i < this.data.inputStates.length; i++) {
                if (this.data.inputStates[i] === false) {
                    return false;
                }
            }
            return true;
        }
        static _activateInputs() {
            const inputControlPortNames = this.getInputControlPortNameList();
            for (let i = 0; i < inputControlPortNames.length; i++) {
                if (this.isInputControlPortActivated(inputControlPortNames[i])) {
                    this.data.inputStates[i] = true;
                }
            }
        }
    }
    WaitAllBlock.prototype.uid = '6c238a6a-9299-44c9-99a4-4d82ee8fca17';
    WaitAllBlock.prototype.name = 'Wait All';
    WaitAllBlock.prototype.category = FlowCategory;
    WaitAllBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSWaitAllBlockDoc';
    return WaitAllBlock;
});
