/// <amd-module name='DS/EPSSchematicsCoreLibrary/loop/EPSCounterBlock'/>
define("DS/EPSSchematicsCoreLibrary/loop/EPSCounterBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/loop/EPSSchematicsCoreLibraryLoopCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, LoopCategory) {
    "use strict";
    class CounterBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Input('Loop In'),
                new ControlPortDefinitions.Output('Out'),
                new ControlPortDefinitions.Output('Loop Out')
            ]);
            const dataPortStart = this.createDataPort(new DataPortDefinitions.InputList('Start', ['Double', 'Integer'], 'Integer', {
                'Double': 0.0,
                'Integer': 0
            }));
            this.createDataPort(new DataPortDefinitions.InputRef('End', dataPortStart, {
                'Double': 10.0,
                'Integer': 10
            }));
            this.createDataPort(new DataPortDefinitions.InputRef('Step', dataPortStart, {
                'Double': 1.0,
                'Integer': 1
            }));
            this.createDataPort(new DataPortDefinitions.OutputRef('Current Count', dataPortStart));
        }
        execute() {
            const start = this.getInputDataPortValue('Start');
            const end = this.getInputDataPortValue('End');
            const step = Math.abs(this.getInputDataPortValue('Step'));
            const increment = start < end;
            if (this.isInputControlPortActivated('In')) {
                this.data.count = start;
            }
            if ((increment && this.data.count >= end) || (!increment && this.data.count <= end)) {
                this.activateOutputControlPort('Out');
                return Enums.EExecutionResult.eExecutionFinished;
            }
            this.data.count += increment ? step : -step;
            this.setOutputDataPortValue('Current Count', this.data.count);
            this.activateOutputControlPort('Loop Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    CounterBlock.prototype.uid = '5041a595-5570-4b46-b62b-d236076aa446';
    CounterBlock.prototype.name = 'Counter';
    CounterBlock.prototype.category = LoopCategory;
    CounterBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCounterBlockDoc';
    return CounterBlock;
});
