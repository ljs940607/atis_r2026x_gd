/// <amd-module name='DS/EPSSchematicsCoreLibrary/event/EPSEventReaderBlock'/>
define("DS/EPSSchematicsCoreLibrary/event/EPSEventReaderBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/event/EPSSchematicsCoreLibraryEventCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, EventPortDefinitions, Enums, EventCategory) {
    "use strict";
    class EventReaderBlock extends Block {
        constructor() {
            super();
            const controlPorts = this.createControlPorts([
                new EventPortDefinitions.InputAll('EventIn', 'Event'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPort(new DataPortDefinitions.OutputRef('DataEventOut', controlPorts[0]));
        }
        execute() {
            const event = this.getInputControlPortEvent('EventIn');
            this.setOutputDataPortValue('DataEventOut', event);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    EventReaderBlock.prototype.uid = '3c32086d-5651-4311-8366-5542194be8ba';
    EventReaderBlock.prototype.name = 'Event Reader';
    EventReaderBlock.prototype.category = EventCategory;
    EventReaderBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSEventReaderBlockDoc';
    return EventReaderBlock;
});
