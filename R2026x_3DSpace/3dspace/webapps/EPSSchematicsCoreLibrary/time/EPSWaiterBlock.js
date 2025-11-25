/// <amd-module name='DS/EPSSchematicsCoreLibrary/time/EPSWaiterBlock'/>
define("DS/EPSSchematicsCoreLibrary/time/EPSWaiterBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/time/EPSSchematicsCoreLibraryTimeCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, TimeCategory) {
    "use strict";
    class WaiterBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPort(new DataPortDefinitions.InputBasic('Delay', 'Double', 1000.0));
        }
        execute(runParams) {
            this.data.startTimes = this.data.startTimes !== undefined ? this.data.startTimes : [];
            if (this.isInputControlPortActivated('In')) {
                this.data.startTimes.push(runParams.currentTime);
            }
            if (this.data.startTimes.length > 0) {
                const delay = this.getInputDataPortValue('Delay');
                if ((runParams.currentTime - this.data.startTimes[0]) >= delay) {
                    this.data.startTimes.shift();
                    this.activateOutputControlPort('Out');
                    return Enums.EExecutionResult.eExecutionFinished;
                }
            }
            return Enums.EExecutionResult.eExecutionPending;
        }
    }
    WaiterBlock.prototype.uid = '4b949047-55ff-45a1-9549-41a09969f97d';
    WaiterBlock.prototype.name = 'Waiter';
    WaiterBlock.prototype.category = TimeCategory;
    WaiterBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSWaiterBlockDoc';
    return WaiterBlock;
});
