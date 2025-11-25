/// <amd-module name='DS/EPSSchematicsCoreLibrary/event/EPSEventWriterBlock'/>
define("DS/EPSSchematicsCoreLibrary/event/EPSEventWriterBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/event/EPSSchematicsCoreLibraryEventCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, EventPortDefinitions, Enums, EventCategory) {
    "use strict";
    class EventWriterBlock extends Block {
        constructor() {
            super();
            const controlPorts = this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new EventPortDefinitions.OutputAll('EventOut', 'Event')
            ]);
            this.createDataPort(new DataPortDefinitions.InputRef('DataEventIn', controlPorts[1]));
        }
        execute() {
            const event = this.getInputDataPortValue('DataEventIn');
            if (event !== undefined) {
                this.setOutputControlPortEvent('EventOut', event);
                this.activateOutputControlPort('EventOut');
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    EventWriterBlock.prototype.uid = '478f4862-fffd-4114-9247-95c2ff28b7ff';
    EventWriterBlock.prototype.name = 'Event Writer';
    EventWriterBlock.prototype.category = EventCategory;
    EventWriterBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSEventWriterBlockDoc';
    return EventWriterBlock;
});
