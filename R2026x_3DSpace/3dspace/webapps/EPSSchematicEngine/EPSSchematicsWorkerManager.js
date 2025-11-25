/// <amd-module name='DS/EPSSchematicEngine/EPSSchematicsWorkerManager'/>
define("DS/EPSSchematicEngine/EPSSchematicsWorkerManager", ["require", "exports", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, EventServices, Tools, Enums) {
    "use strict";
    /* eslint-enable no-unused-vars */
    const workers = [];
    /**
     * The worker manager is a static class allowing to get, create and manage web workers.
     * @class WorkerManager
     * @private
     */
    class WorkerManager {
        static { this.workerActivated = true; }
        static { this.kMaximumCreatedWorkers = (typeof navigator === 'undefined' || navigator.hardwareConcurrency === undefined) ? 8 : navigator.hardwareConcurrency; }
        /**
         * Terminate all the workers.
         * @private
         */
        static terminateWorkers() {
            workers.forEach(worker => worker.terminate());
            workers.length = 0;
        }
        static activateWorker() {
            WorkerManager.workerActivated = true;
        }
        static deactivateWorker() {
            WorkerManager.workerActivated = false;
        }
        /**
         * Gets an available worker or create one if none are available.
         * @private
         * @returns {SchematicsWorker} A web worker.
         */
        static getAvailableWorker() {
            let workerChoosen;
            if (workers.length !== 0) {
                workerChoosen = workers[0];
                if (workerChoosen.isAvailable()) {
                    return workerChoosen;
                }
                let lessTaskRunning = workers[0].currentExecutingBlocks.length;
                for (let wk = 1; wk < workers.length; wk++) {
                    if (workers[wk].isAvailable()) {
                        return workers[wk];
                    }
                    if (workers[wk].currentExecutingBlocks.length < lessTaskRunning) {
                        workerChoosen = workers[wk];
                        lessTaskRunning = workers[wk].currentExecutingBlocks.length;
                    }
                }
            }
            if (workers.length < WorkerManager.kMaximumCreatedWorkers) {
                workerChoosen = new SchematicsWorker();
            }
            return workerChoosen;
        }
        /**
         * Add a worker event to be trigger.
         * @private
         * @param {ExecutionBlock} executionBlock - The execution block.
         * @param {EPEvent} event - The event.
         */
        static addWorkerEvent(executionBlock, event) {
            if (executionBlock.workerEvents === undefined) {
                executionBlock.workerEvents = [];
            }
            executionBlock.workerEvents.push(event);
        }
        /**
         * Dispatch worker events.
         * @private
         * @param {ExecutionBlock} executionBlock - The execution block.
         */
        static dispatchWorkerEvents(executionBlock) {
            if (executionBlock.workerEvents !== undefined) {
                while (executionBlock.workerEvents.length !== 0) {
                    const event = executionBlock.workerEvents.shift();
                    EventServices.dispatchEvent(event);
                }
            }
        }
        /**
         * Execute the execution block given.
         * @public
         * @param {ExecutionBlock} executionBlock - The execution block.
         * @param {IRunParameters} runParams - The run parameters.
         * @return {EP.EExecutionResult} The execution result.
         */
        static executeBlock(executionBlock, runParams) {
            let result = Enums.EExecutionResult.eExecutionWorker;
            if (executionBlock.workerExecutionResult !== undefined) {
                result = executionBlock.workerExecutionResult;
                executionBlock.workerExecutionResult = undefined;
            }
            else if (executionBlock.executionResult === Enums.EExecutionResult.eExecutionWorker) {
                executionBlock.trace(result);
            }
            else {
                const jsonExecutionBlock = {
                    runParams: runParams,
                    modules: executionBlock.parent.getModules()
                };
                executionBlock.inputsToJSON(jsonExecutionBlock);
                // Execute with a web worker
                const worker = WorkerManager.getAvailableWorker();
                worker.addTask(executionBlock, jsonExecutionBlock);
                executionBlock.trace(result);
            }
            this.dispatchWorkerEvents(executionBlock);
            return result;
        }
    }
    class SchematicsWorker {
        /**
         * @constructor
         */
        constructor() {
            this.currentExecutingBlocks = [];
            this.worker = new Worker('../EPSSchematicsWorker/EPSSchematicsWorker.js');
            workers.push(this);
            this.worker.onmessage = (event) => {
                // Event receive from the worker
                if (event.data.eventMessage) {
                    const executionBlock = this.currentExecutingBlocks[this.currentExecutingBlocks.length - 1];
                    const EventCtor = EventServices.getEventByType(event.data.type);
                    const eventToDispatch = new EventCtor();
                    const eventObj = event.data.eventObj;
                    if (eventObj.path !== undefined) {
                        eventObj.path = eventObj.path.replace(Tools.rootPath, executionBlock.model.toPath());
                    }
                    SchematicsWorker._mergeObject(eventObj, eventToDispatch);
                    WorkerManager.addWorkerEvent(executionBlock, eventToDispatch);
                }
                else if (event.data.executionMessage) { // Execution result receive from the worker
                    const executionBlock = this.currentExecutingBlocks.shift();
                    // Control et data port from json
                    executionBlock.outputsFromJSON(event.data.jsonExecutionBlock);
                    executionBlock.workerExecutionResult = event.data.executionStatus;
                }
            };
        }
        isAvailable() {
            return this.currentExecutingBlocks.length === 0;
        }
        addTask(executionBlock, postMsg) {
            this.currentExecutingBlocks.push(executionBlock);
            this.worker.postMessage(postMsg);
        }
        terminate() {
            this.worker.terminate();
        }
        /**
         * Used to merge two object for worker event.
         * @private
         * @static
         * @param {Object} fromObject - The source object.
         * @param {Object} toObject - The target object.
         */
        static _mergeObject(fromObject, toObject) {
            const keys = Object.keys(fromObject);
            for (let k = 0; k < keys.length; k++) {
                const key = keys[k];
                toObject[key] = fromObject[key];
            }
        }
    }
    return WorkerManager;
});
