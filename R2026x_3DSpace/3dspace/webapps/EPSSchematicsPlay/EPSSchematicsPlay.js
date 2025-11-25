/// <amd-module name='DS/EPSSchematicsPlay/EPSSchematicsPlay'/>
define("DS/EPSSchematicsPlay/EPSSchematicsPlay", ["require", "exports", "DS/EPSSchematicsUI/EPSSchematicsUIEditor", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicEngine/EPSSchematicsExecutionGraph", "DS/EPSSchematicEngine/EPSSchematicsTask", "DS/EPSSchematicsPlay/EPSLoopManager", "DS/EPInputsServicesWeb/EPInputsServices"], function (require, exports, SchematicsEditor, UIDom, ExecutionGraph, SchematicsTask, EPSLoopManager, InputsServices) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the Schematics Play.
     * @private
     * @class EPSSchematicsPlay
     * @alias module:DS/EPSSchematicsPlay/EPSSchematicsPlay
     * @private
     */
    class EPSSchematicsPlay {
        /**
         * @public
         * @constructor
         * @param {Function} [onInitialized] - The function called after initialization.
         */
        constructor(onInitialized) {
            this._onInitialized = onInitialized;
            this._container = UIDom.createElement('div', { parent: document.body, style: { height: '100%' } });
            const options = {
                domContainer: this._container,
                onInitialized: this._onInitializedCB.bind(this),
                playCommands: {
                    callbacks: {
                        onStart: this._onStart.bind(this),
                        onStop: this._onStop.bind(this),
                        onStepOver: this._onStepOver.bind(this),
                        onStepInto: this._onStepInto.bind(this),
                        onStepOut: this._onStepOut.bind(this),
                        onBreakAll: this._onBreakAll.bind(this),
                        onContinue: this._onContinue.bind(this),
                        onBreakpointsChange: this._onBreakpointsChange.bind(this)
                    }
                },
                watchPanel: {}
            };
            this._editor = new SchematicsEditor(options);
            this._loopManager = new EPSLoopManager();
        }
        /**
         * Closes the schematics play.
         * @public
         */
        onClose() {
            if (this._editor !== undefined) {
                this._editor.remove();
            }
            this._onInitialized = undefined;
            this._container = undefined;
        }
        /**
         * Gets the Schematics editor.
         * @public
         * @returns {SchematicsEditor} The Schematics editor.
         */
        getEditor() {
            return this._editor;
        }
        /**
         * The callback on the start button click event.
         * @private
         */
        _onStart() {
            const savedGraph = this._editor.getContent();
            const breakOnStart = this._editor.getPlayPanel().getBreakOnStartToggleCheckedState();
            this._executionGraph = ExecutionGraph.createExecutionGraph(savedGraph, undefined, undefined, undefined, breakOnStart, this._breakpoints);
            this._loopManager.registerTask(new SchematicsTask(this._executionGraph, true));
            this._loopManager.start();
            this._inputsServices = new InputsServices();
            this._inputsServices.enableMouse(document.body);
            this._inputsServices.enableKeyboard(document.body);
        }
        /**
         * The callback on the stop button click event.
         * @private
         */
        _onStop() {
            this._inputsServices.disableMouse();
            this._inputsServices.disableKeyboard();
            this._inputsServices = undefined;
            this._loopManager.stop();
        }
        /**
         * The callback on the step over button click event.
         * @private
         * @param {string} contextPath - The context path.
         */
        _onStepOver(contextPath) {
            this._executionGraph.stepOver(contextPath);
        }
        /**
         * The callback on the step into button click event.
         * @private
         * @param {string} contextPath - The context path.
         */
        _onStepInto(contextPath) {
            this._executionGraph.stepInto(contextPath);
        }
        /**
         * The callback on the step out button click event.
         * @private
         * @param {string} contextPath - The context path.
         */
        _onStepOut(contextPath) {
            this._executionGraph.stepOut(contextPath);
        }
        /**
         * The callback on the break all button click event.
         * @private
         */
        _onBreakAll() {
            this._executionGraph.breakAll();
        }
        /**
         * The callback on the continue button click event.
         * @private
         */
        _onContinue() {
            this._executionGraph.continue();
        }
        /**
         * The callback on the breakpoints change event.
         * @private
         * @param {IBreakpoint[]} breakpoints - The list of breakpoints.
         */
        _onBreakpointsChange(breakpoints) {
            this._breakpoints = breakpoints;
            if (this._executionGraph !== undefined) {
                this._executionGraph.updateBreakpoints(breakpoints);
            }
        }
        /**
         * The callback to the schematics editor initialization.
         * @private
         */
        _onInitializedCB() {
            this._loadJSONGraphFromURL(location.search);
            if (this._onInitialized !== undefined) {
                this._onInitialized();
            }
        }
        /**
         * Loads the json graph provided into the URL of the page.
         * @private (Public only for ODT)
         * @param {string} urlParams - The url parameters.
         * @param {Function} [callback] - The function call when the JSON graph is loaded.
         */
        _loadJSONGraphFromURL(urlParams, callback) {
            let content;
            const parameters = urlParams.substring(1).split('&');
            for (let p = 0; p < parameters.length; p++) {
                const parameter = parameters[p];
                const keyValue = parameter.split('=');
                if (keyValue.length === 2) {
                    const key = decodeURI(keyValue[0]);
                    const value = decodeURI(keyValue[1]);
                    if (key === 'content' && value !== undefined && value !== '') {
                        content = value;
                        break;
                    }
                }
            }
            if (content !== undefined) {
                new Promise((resolve_1, reject_1) => { require(['text!' + content], resolve_1, reject_1); }).then((jsonGraph) => {
                    this._editor.setContent(jsonGraph);
                    if (callback !== undefined) {
                        callback();
                    }
                });
            }
        }
    }
    return EPSSchematicsPlay;
});
