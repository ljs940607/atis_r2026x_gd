/// <amd-module name='DS/EPSSchematicsPlay/EPSLoopManager'/>
define("DS/EPSSchematicsPlay/EPSLoopManager", ["require", "exports", "DS/EPSSchematicsPlay/typings/EPTaskPlayer/EPTaskPlayer", "DS/EPSSchematicsPlay/typings/EPTaskPlayer/EPPlayerContext", "DS/EP/EP"], function (require, exports, EPTaskPlayer, EPPlayerContext, EP) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the loop manager that will execute the specified engines task loop.
     * @class EPSLoopManager
     * @alias module:DS/EPSSchematicsPlay/EPSLoopManager
     * @private
     */
    class EPSLoopManager {
        /**
         * @constructor
         */
        constructor() {
            this._executeCBListener = this.executeCB.bind(this);
            this._previousTime = 0.0;
            this._elapsedTime = 0.0;
            this._deltaTime = 0.0;
            this._tasks = [];
        }
        /**
         * Adds an engine task to the task player.
         * @param {EPTask} task - The engine task to register.
         * @public
         */
        registerTask(task) {
            if (task !== undefined && task !== null) {
                this._tasks.push(task);
                EPTaskPlayer.addTask(task);
            }
        }
        /**
         * Removes all the tasks from the task player.
         * @private
         */
        unregisterTasks() {
            for (let i = 0; i < this._tasks.length; i++) {
                EPTaskPlayer.removeTask(this._tasks[i]);
            }
            this._tasks = [];
        }
        /**
         * Starts the task player.
         * @private
         */
        start() {
            if (EPTaskPlayer.getPlayState() === EP.Task.EPlayState.eStopped) {
                this._previousTime = Date.now();
                this._elapsedTime = 0.0;
                this._deltaTime = 0.0;
                EPTaskPlayer.start();
                this.execute();
            }
        }
        /**
         * Resumes the task player.
         * @private
         */
        resume() {
            if (EPTaskPlayer.getPlayState() === EP.Task.EPlayState.ePaused) {
                EPTaskPlayer.resume();
                this.execute();
            }
        }
        /**
         * Pauses the task player.
         * @private
         */
        // eslint-disable-next-line class-methods-use-this
        pause() {
            if (EPTaskPlayer.getPlayState() === EP.Task.EPlayState.eExecuted) {
                EPTaskPlayer.pause();
            }
        }
        /**
         * Stops the task player.
         * @private
         */
        stop() {
            EPTaskPlayer.stop();
            window.cancelAnimationFrame(this._currentRequestID);
            this.unregisterTasks();
        }
        /**
         * Executes the task player.
         * @private
         */
        execute() {
            this._currentRequestID = window.requestAnimationFrame(this._executeCBListener);
        }
        /**
         * The callback to the execution of the task player.
         * @private
         */
        executeCB() {
            const playState = EPTaskPlayer.getPlayState();
            if (playState === EP.Task.EPlayState.eExecuted || playState === EP.Task.EPlayState.eStarted || playState === EP.Task.EPlayState.eResumed) {
                const currentTime = Date.now();
                this._deltaTime = currentTime - this._previousTime;
                this._previousTime = currentTime;
                this._elapsedTime += this._deltaTime;
                const playerContext = new EPPlayerContext();
                playerContext.deltaTime = this._deltaTime;
                playerContext.elapsedTime = this._elapsedTime;
                EPTaskPlayer.execute(playerContext);
                this._currentRequestID = window.requestAnimationFrame(this._executeCBListener);
            }
        }
    }
    return EPSLoopManager;
});
