/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsTask'/>
define("DS/EPSSchematicEngine/EPSSchematicsTask", ["require", "exports", "DS/EPSSchematicEngine/typings/EPTaskPlayer/EPTask", "DS/EPSSchematicEngine/EPSSchematicsExecutionBlock", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums"], function (require, exports, EPTask, ExecutionBlock, EventServices, ExecutionEvents, ExecutionEnums) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a schematics task.
     * The task is in charge of the schematics execution work flow.
     * An execution graph instance must be provided to the task so
     * the task be able to execute the graph.
     * @protected
     */
    class SchematicsTask extends EPTask {
        /**
         * @constructor
         * @param {ExecutionGraph} executionGraph - The execution graph instance to execute.
         * @param {boolean|FTraceEvent} traceMode - True to enable the trace mode else false or use FTraceEvent
         */
        constructor(executionGraph, traceMode) {
            super();
            this.timeDelay = 0.0; // Accumulated time during pauses
            this.pauseTimeStamp = 0.0; // Time stamp information when pause was triggered
            this.runsCount = 0; // Counter to know how many times this task has been run
            this.graph = executionGraph;
            // Keep trace mode state
            this.traceMode = traceMode;
            if (this.traceMode === true) {
                this.traceMode = ExecutionEnums.FTraceEvent.fAll;
            }
            else if (this.traceMode === false) {
                this.traceMode = ExecutionEnums.FTraceEvent.fNone;
            }
            this.graph.traceMode = this.traceMode;
        }
        /**
         * Starts the execution of the task.
         * @private
         */
        onStart() {
            if (this.traceMode !== ExecutionEnums.FTraceEvent.fNone) {
                const event = new ExecutionEvents.TraceStartEvent();
                EventServices.dispatchEvent(event);
            }
            const startupPortName = this.graph.model.getStartupPort().getName();
            this.graph.activateInputControlPort(startupPortName);
            this.graph.subscribeEventListeners();
        }
        /**
         * Stops the execution of the task.
         * @private
         */
        onStop() {
            this.graph.unsubscribeEventListeners();
            this.graph.disconnect();
            if (this.traceMode !== ExecutionEnums.FTraceEvent.fNone) {
                const event = new ExecutionEvents.TraceStopEvent();
                EventServices.dispatchEvent(event);
            }
        }
        /**
         * Pauses the execution of the task.
         * @private
         */
        onPause() {
            this.pauseTimeStamp = (new Date()).getTime();
            if (this.traceMode !== ExecutionEnums.FTraceEvent.fNone) {
                const event = new ExecutionEvents.TracePauseEvent();
                EventServices.dispatchEvent(event);
            }
        }
        /**
         * Resumes the execution of the task.
         * @private
         */
        onResume() {
            if (this.traceMode !== ExecutionEnums.FTraceEvent.fNone) {
                const event = new ExecutionEvents.TraceResumeEvent();
                EventServices.dispatchEvent(event);
            }
            this.timeDelay += (new Date()).getTime() - this.pauseTimeStamp;
        }
        /**
         * Executes the task.
         * @private
         * @param {EPPlayerContext} playerContext - The execution context of the player.
         */
        onExecute(playerContext) {
            // Start the task execution
            this.runsCount++;
            // Initialize run parameters
            const runParams = new ExecutionBlock.RunParameters();
            runParams.globalStepsCount = this.runsCount;
            runParams.currentTime = Date.now() - this.timeDelay;
            runParams.deltaTime = playerContext.deltaTime;
            // Execute this graph
            this.graph.execute(runParams);
        }
    }
    return SchematicsTask;
});
