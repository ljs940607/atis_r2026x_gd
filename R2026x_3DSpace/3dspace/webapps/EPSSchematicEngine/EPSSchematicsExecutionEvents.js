/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsExecutionEvents'/>
define("DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", ["require", "exports", "DS/EPEventServices/EPEvent", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsTools"], function (require, exports, EPEvent, EventServices, TypeLibrary, Tools) {
    "use strict";
    /* eslint-enable no-unused-vars */
    var ExecutionEvents;
    (function (ExecutionEvents) {
        /**
         * class ExecutionControlPortEvent
         * @extends Event
         * @private
         */
        class ExecutionControlPortEvent extends EPEvent {
            constructor() {
                super();
            }
            /**
             * Gets the execution control port.
             * @private
             * @returns {ExecutionControlPort} The execution control port.
             */
            getControlPort() {
                return this.controlPort;
            }
        }
        ExecutionEvents.ExecutionControlPortEvent = ExecutionControlPortEvent;
        ExecutionControlPortEvent.prototype.type = 'ExecutionControlPortEvent';
        EventServices.registerEvent(ExecutionControlPortEvent);
        /**
         * class ExecutionControlPortActivateEvent
         * @extends ExecutionControlPortEvent
         * @private
         */
        class ExecutionControlPortActivateEvent extends ExecutionControlPortEvent {
            constructor() {
                super();
            }
        }
        ExecutionEvents.ExecutionControlPortActivateEvent = ExecutionControlPortActivateEvent;
        ExecutionControlPortActivateEvent.prototype.type = 'ExecutionControlPortActivateEvent';
        EventServices.registerEvent(ExecutionControlPortActivateEvent);
        /**
         * class ExecutionDataPortEvent
         * @extends Event
         * @private
         */
        class ExecutionDataPortEvent extends EPEvent {
            constructor() {
                super();
            }
            /**
             * Gets the execution data port.
             * @private
             * @returns {ExecutionDataPort} The execution data port.
             */
            getDataPort() {
                return this.dataPort;
            }
        }
        ExecutionEvents.ExecutionDataPortEvent = ExecutionDataPortEvent;
        ExecutionDataPortEvent.prototype.type = 'ExecutionDataPortEvent';
        EventServices.registerEvent(ExecutionDataPortEvent);
        /**
         * class ExecutionDataPortValueChangeEvent
         * @extends ExecutionDataPortEvent
         * @private
         */
        class ExecutionDataPortValueChangeEvent extends ExecutionDataPortEvent {
            constructor() {
                super();
            }
            /**
             * Gets the execution data port value.
             * @private
             * @returns {*} The execution data port value.
             */
            getValue() {
                return this.value;
            }
        }
        ExecutionEvents.ExecutionDataPortValueChangeEvent = ExecutionDataPortValueChangeEvent;
        ExecutionDataPortValueChangeEvent.prototype.type = 'ExecutionDataPortValueChangeEvent';
        EventServices.registerEvent(ExecutionDataPortValueChangeEvent);
        /**
         * class TraceStartEvent
         * @extends Event
         * @private
         */
        class TraceStartEvent extends EPEvent {
            constructor() {
                super();
            }
        }
        ExecutionEvents.TraceStartEvent = TraceStartEvent;
        TraceStartEvent.prototype.type = 'TraceStartEvent';
        EventServices.registerEvent(TraceStartEvent);
        /**
         * class TracePauseEvent
         * @extends Event
         * @private
         */
        class TracePauseEvent extends EPEvent {
            constructor() {
                super();
            }
        }
        ExecutionEvents.TracePauseEvent = TracePauseEvent;
        TracePauseEvent.prototype.type = 'TracePauseEvent';
        EventServices.registerEvent(TracePauseEvent);
        /**
         * class TraceResumeEvent
         * @extends Event
         * @private
         */
        class TraceResumeEvent extends EPEvent {
            constructor() {
                super();
            }
        }
        ExecutionEvents.TraceResumeEvent = TraceResumeEvent;
        TraceResumeEvent.prototype.type = 'TraceResumeEvent';
        EventServices.registerEvent(TraceResumeEvent);
        /**
         * class TraceStopEvent
         * @extends Event
         * @private
         */
        class TraceStopEvent extends EPEvent {
            constructor() {
                super();
            }
        }
        ExecutionEvents.TraceStopEvent = TraceStopEvent;
        TraceStopEvent.prototype.type = 'TraceStopEvent';
        EventServices.registerEvent(TraceStopEvent);
        /**
         * class TraceBlockEvent
         * @extends Event
         * @private
         */
        class TraceBlockEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
            getExecutionResult() {
                return this.executionResult;
            }
            getErrorStack() {
                return this.errorStack;
            }
            getErrorMessage() {
                return this.errorMessage;
            }
        }
        ExecutionEvents.TraceBlockEvent = TraceBlockEvent;
        TraceBlockEvent.prototype.type = 'TraceBlockEvent';
        EventServices.registerEvent(TraceBlockEvent);
        /**
         * class TracePortEvent
         * @extends Event
         * @private
         */
        class TracePortEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
        }
        ExecutionEvents.TracePortEvent = TracePortEvent;
        TracePortEvent.prototype.type = 'TracePortEvent';
        EventServices.registerEvent(TracePortEvent);
        /**
         * class TraceDataPortEvent
         * @extends Event
         * @private
         */
        class TraceDataPortEvent extends EPEvent {
            constructor() {
                super();
                this.fromDebug = false;
            }
            getPath() {
                return this.path;
            }
            getValue(iGraphContext) {
                if (this.jsonValue !== undefined) {
                    this.value = TypeLibrary.getValueFromJSONValue(iGraphContext, this.jsonValue, this.valueType);
                    this.jsonValue = undefined;
                }
                return this.value;
            }
            isFromDebug() {
                return this.fromDebug;
            }
        }
        ExecutionEvents.TraceDataPortEvent = TraceDataPortEvent;
        TraceDataPortEvent.prototype.type = 'TraceDataPortEvent';
        EventServices.registerEvent(TraceDataPortEvent);
        /**
         * class TraceLinkEvent
         * @extends Event
         * @private
         */
        class TraceLinkEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
        }
        ExecutionEvents.TraceLinkEvent = TraceLinkEvent;
        TraceLinkEvent.prototype.type = 'TraceLinkEvent';
        EventServices.registerEvent(TraceLinkEvent);
        /**
         * class TraceDataLinkEvent
         * @extends Event
         * @private
         */
        class TraceDataLinkEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
        }
        ExecutionEvents.TraceDataLinkEvent = TraceDataLinkEvent;
        TraceDataLinkEvent.prototype.type = 'TraceDataLinkEvent';
        EventServices.registerEvent(TraceDataLinkEvent);
        /**
         * class DebugBreakEvent
         * @extends Event
         * @private
         */
        class DebugBreakEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
        }
        ExecutionEvents.DebugBreakEvent = DebugBreakEvent;
        DebugBreakEvent.prototype.type = 'DebugBreakEvent';
        EventServices.registerEvent(DebugBreakEvent);
        /**
         * class DebugUnbreakEvent
         * @extends Event
         * @private
         */
        class DebugUnbreakEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
        }
        ExecutionEvents.DebugUnbreakEvent = DebugUnbreakEvent;
        DebugUnbreakEvent.prototype.type = 'DebugUnbreakEvent';
        EventServices.registerEvent(DebugUnbreakEvent);
        /**
         * class DebugBlockEvent
         * @extends Event
         * @private
         */
        class DebugBlockEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
            getState() {
                return this.state;
            }
        }
        ExecutionEvents.DebugBlockEvent = DebugBlockEvent;
        DebugBlockEvent.prototype.type = 'DebugBlockEvent';
        EventServices.registerEvent(DebugBlockEvent);
        /**
         * class NotifyEvent
         * @extends Event
         * @private
         */
        class NotifyEvent extends EPEvent {
            constructor() {
                super();
            }
            getSeverity() {
                return this.severity;
            }
            getTitle() {
                return this.title;
            }
            getMessage() {
                return this.message;
            }
        }
        ExecutionEvents.NotifyEvent = NotifyEvent;
        NotifyEvent.prototype.type = 'NotifyEvent';
        EventServices.registerEvent(NotifyEvent);
        /**
         * class PrintEvent
         * @extends Event
         * @private
         */
        class PrintEvent extends EPEvent {
            constructor() {
                super();
            }
            getPath() {
                return this.path;
            }
            getSeverity() {
                return this.severity;
            }
            getContent() {
                if (this.jsonContent !== undefined) {
                    this.content = Tools.jsonParse(this.jsonContent);
                    this.jsonContent = undefined;
                }
                return this.content;
            }
        }
        ExecutionEvents.PrintEvent = PrintEvent;
        PrintEvent.prototype.type = 'PrintEvent';
        EventServices.registerEvent(PrintEvent);
    })(ExecutionEvents || (ExecutionEvents = {}));
    return ExecutionEvents;
});
