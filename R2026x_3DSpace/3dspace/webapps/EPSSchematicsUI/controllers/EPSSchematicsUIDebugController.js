/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugController", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIDebugCursor", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphBlock"], function (require, exports, UIDebugCursor, EventServices, ExecutionEvents, UIBlock, UIGraph, UIGraphBlock) {
    "use strict";
    /**
     * This class defines a debug controller.
     * @private
     * @class UIDebugController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugController
     */
    class UIDebugController {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._debugEventsByOrder = [];
            this._debugEventByBlockPath = new Map();
            this._debugCursorByBlockPath = new Map();
            this._parentDebugCursorByGraphBlockPath = new Map();
            this._onDebugBreakCB = this._onDebugBreak.bind(this);
            this._onDebugUnbreakCB = this._onDebugUnbreak.bind(this);
            this._freezeGraphContext = false;
            this._editor = editor;
            EventServices.addListener(ExecutionEvents.DebugBreakEvent, this._onDebugBreakCB);
            EventServices.addListener(ExecutionEvents.DebugUnbreakEvent, this._onDebugUnbreakCB);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the controller.
         * @public
         */
        remove() {
            this.clear();
            EventServices.removeListener(ExecutionEvents.DebugBreakEvent, this._onDebugBreakCB);
            EventServices.removeListener(ExecutionEvents.DebugUnbreakEvent, this._onDebugUnbreakCB);
            this._editor = undefined;
            this._debugEventsByOrder = undefined;
            this._debugEventByBlockPath = undefined;
            this._debugCursorByBlockPath = undefined;
            this._parentDebugCursorByGraphBlockPath = undefined;
            this._onDebugBreakCB = undefined;
            this._onDebugUnbreakCB = undefined;
            this._freezeGraphContext = undefined;
        }
        /**
         * Clears the list of debug elements.
         * @public
         */
        clear() {
            this._removeAllDebugCursors();
            this._removeAllParentDebugCursors();
            this._debugEventsByOrder = [];
            this._debugEventByBlockPath.clear();
            this._debugCursorByBlockPath.clear();
            this._parentDebugCursorByGraphBlockPath.clear();
            this._freezeGraphContext = false;
        }
        /**
         * Gets the debug cursor by block path.
         * @public
         * @param {string} blockPath - The block path.
         * @returns {UIDebugCursor|undefined} The debug cursor.
         */
        getDebugCursorByBlockPath(blockPath) {
            return this._debugCursorByBlockPath.get(blockPath);
        }
        /**
         * Gets the debug cursor at the giving graph context.
         * @public
         * @param {string} path - The graph context path.
         * @returns {UIDebugCursor|undefined} The debug cursor.
         */
        getDebugCursorByGraphContext(path) {
            let debugCursor = undefined;
            this._debugCursorByBlockPath.forEach((value, key) => {
                const index = key.lastIndexOf('.');
                const parentPath = key.substring(0, index);
                if (!debugCursor && index !== -1 && parentPath === path) {
                    debugCursor = value;
                }
            });
            return debugCursor;
        }
        /**
         * On continue callback, called from the play panel.
         * @public
         */
        onContinue() {
            this._freezeGraphContext = false;
        }
        /**
         * On break all callback, called from the play panel.
         * @public
         */
        onBreakAll() {
            this._freezeGraphContext = false;
        }
        /**
         * On step over callback, called from the play panel.
         * @public
         * @param {string} contextPath - The context path.
         */
        onStepOver(contextPath) {
            this._openContextNextDebugCursor(contextPath);
            this._freezeGraphContext = false;
        }
        /**
         * On step into callback, called from the play panel.
         * @public
         * @param {string} contextPath - The context path.
         */
        onStepInto(contextPath) {
            const mainGraph = this._editor._getViewer().getMainGraph();
            const debugCursor = this.getDebugCursorByGraphContext(contextPath);
            if (debugCursor) {
                const newContextPath = debugCursor.getBlock().getModel().toPath();
                mainGraph.openGraphBlockFromPath(newContextPath);
                this._freezeGraphContext = true;
            }
        }
        /**
         * On step out callback, called from the play panel.
         * @public
         * @param {string} contextPath - The context path.
         */
        onStepOut(contextPath) {
            this._openContextNextDebugCursor(contextPath);
            this._freezeGraphContext = false;
        }
        /**
         * The callback on the subGraph opened event.
         * @public
         * @param {UIGraphBlock} graphBlockUI - The UI graph block.
         */
        onSubGraphOpened(graphBlockUI) {
            const graphBlockPath = graphBlockUI.getModel().toPath();
            this._debugEventByBlockPath.forEach((_value, key) => {
                if (graphBlockPath !== key && key.startsWith(graphBlockPath)) {
                    const nextBlockList = key.replace(graphBlockPath + '.', '').split('.') || [];
                    const nextBlockPath = graphBlockPath + '.' + nextBlockList[0];
                    this._createParentDebugCursor(nextBlockPath);
                    this._createDebugCursor(key);
                }
            });
        }
        /**
         * The callback on the subGraph removed event.
         * @public
         * @param {UIGraphBlock} graphBlockUI - The UI graph block.
         */
        onSubGraphRemoved(graphBlockUI) {
            const graphBlockPath = graphBlockUI.getModel().toPath();
            // Remove the debug cursor from the block in previous graph view
            this._debugCursorByBlockPath.forEach((_value, key) => {
                if (graphBlockPath !== key && key.startsWith(graphBlockPath)) {
                    this._removeDebugCursor(key);
                }
            });
            // Remove parent debug cursor from the graph block in the previous graph view
            this._parentDebugCursorByGraphBlockPath.forEach((_value, key) => {
                if (key.startsWith(graphBlockPath)) {
                    this._removeParentDebugCursor(key);
                }
            });
            // Create the parent debug cursor on the graph block in the current graph view
            this._debugEventByBlockPath.forEach((_value, key) => {
                if (graphBlockPath !== key && key.startsWith(graphBlockPath)) {
                    this._createParentDebugCursor(graphBlockPath);
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the debug break event.
         * @private
         * @param {DebugBreakEvent} event - The debug break event.
         */
        _onDebugBreak(event) {
            const blockPath = event.getPath();
            this._focusOnGraph(UIDebugController._getParentPath(blockPath));
            this._createDebugCursor(blockPath);
            this._registerDebugEvent(event);
        }
        /**
         * The callback on the debug unbreak event.
         * @private
         * @param {DebugUnbreakEvent} event - The debug unbreak event.
         */
        _onDebugUnbreak(event) {
            const blockPath = event.getPath();
            this._removeDebugCursor(blockPath);
            // Remove parent debug cursor
            this._parentDebugCursorByGraphBlockPath.forEach((_value, key) => {
                if (blockPath.startsWith(key)) {
                    this._removeParentDebugCursor(key);
                }
            });
            this._registerDebugEvent(event);
        }
        /**
         * Registers the provided event.
         * @private
         * @param {DebugEvent} event - The debug event.
         */
        _registerDebugEvent(event) {
            this._debugEventsByOrder.push(event);
            const blockPath = event.getPath();
            if (event instanceof ExecutionEvents.DebugBreakEvent) {
                this._debugEventByBlockPath.set(blockPath, event);
            }
            else {
                this._debugEventByBlockPath.delete(blockPath);
            }
        }
        /**
         * Creates a debug cursor for the provided block path.
         * @private
         * @param {string} blockPath - The block path.
         */
        _createDebugCursor(blockPath) {
            if (!this._debugCursorByBlockPath.has(blockPath)) {
                const rootGraph = this._editor.getViewerController().getRootViewer().getMainGraph();
                const elementUI = rootGraph.getObjectFromPath(blockPath);
                if (elementUI instanceof UIBlock) {
                    this._debugCursorByBlockPath.set(blockPath, new UIDebugCursor(elementUI, false));
                }
            }
        }
        /**
         * Removes the debug cursor for the provided block path.
         * @private
         * @param {string} blockPath - The block path.
         */
        _removeDebugCursor(blockPath) {
            const debugCursor = this._debugCursorByBlockPath.get(blockPath);
            if (debugCursor) {
                debugCursor.remove();
                this._debugCursorByBlockPath.delete(blockPath);
            }
        }
        /**
         * Removes all the debug cursors.
         * @private
         */
        _removeAllDebugCursors() {
            this._debugCursorByBlockPath.forEach((_value, key) => this._removeDebugCursor(key));
        }
        /**
         * Creates a parent debug cursor for the provided graph block path.
         * @private
         * @param {string} graphBlockPath - The graph block path.
         */
        _createParentDebugCursor(graphBlockPath) {
            if (!this._parentDebugCursorByGraphBlockPath.has(graphBlockPath)) {
                const rootGraph = this._editor.getViewerController().getRootViewer().getMainGraph();
                let graphBlockUI = rootGraph.getObjectFromPath(graphBlockPath);
                if (graphBlockUI instanceof UIGraph) {
                    graphBlockUI = graphBlockUI.getBlockView();
                }
                if (graphBlockUI instanceof UIGraphBlock) {
                    this._parentDebugCursorByGraphBlockPath.set(graphBlockPath, new UIDebugCursor(graphBlockUI, true));
                }
            }
        }
        /**
         * Removes the parent debug cursor for the provided graph block path.
         * @private
         * @param {string} graphBlockPath - THe graph block path.
         */
        _removeParentDebugCursor(graphBlockPath) {
            const debugCursor = this._parentDebugCursorByGraphBlockPath.get(graphBlockPath);
            if (debugCursor) {
                debugCursor.remove();
                this._parentDebugCursorByGraphBlockPath.delete(graphBlockPath);
            }
        }
        /**
         * Removes all the parent debug cursors.
         * @private
         */
        _removeAllParentDebugCursors() {
            this._parentDebugCursorByGraphBlockPath.forEach((_value, key) => this._removeParentDebugCursor(key));
        }
        /**
         * Focusses on the given graph path.
         * @private
         * @param {string} graphPath - The graph path.
         */
        _focusOnGraph(graphPath) {
            if (!this._freezeGraphContext) {
                const rootGraph = this._editor.getViewerController().getRootViewer().getMainGraph();
                rootGraph.openGraphBlockFromPath(graphPath);
                this._freezeGraphContext = true;
            }
        }
        /**
         * Opens context next debug cursor.
         * @private
         * @param {string} contextPath - The context path.
         */
        _openContextNextDebugCursor(contextPath) {
            const mainGraph = this._editor._getViewer().getMainGraph();
            let currentContextPath = contextPath;
            let newContextPath = '';
            let debugCursorFound = false;
            while (currentContextPath !== '' && !debugCursorFound) {
                newContextPath = currentContextPath;
                debugCursorFound = newContextPath !== contextPath && this.getDebugCursorByGraphContext(newContextPath) !== undefined;
                if (!debugCursorFound) {
                    currentContextPath = UIDebugController._getParentPath(newContextPath);
                }
            }
            mainGraph.openGraphBlockFromPath(newContextPath);
        }
        /**
         * Gets the parent graph block path.
         * @private
         * @static
         * @param {string} path - The path of the block.
         * @returns {string} The parent graph block path.
         */
        static _getParentPath(path) {
            return path.split('.').slice(0, -1).join('.');
        }
    }
    return UIDebugController;
});
