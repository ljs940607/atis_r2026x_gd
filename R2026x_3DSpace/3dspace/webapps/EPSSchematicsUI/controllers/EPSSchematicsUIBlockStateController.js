/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockStateController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockStateController", ["require", "exports", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph"], function (require, exports, EventServices, ExecutionEvents, UIEvents, UIBlock, UIGraph) {
    "use strict";
    /**
     * This class defines a block state controller.
     * It manages the different block states while debugging a graph (multiple call).
     * @private
     * @class UIBlockStateController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockStateController
     */
    class UIBlockStateController {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._onTraceStartEventCB = this._onTraceStartEvent.bind(this);
            this._onTraceStopEventCB = this._onTraceStopEvent.bind(this);
            this._onDebugBlockEventCB = this._onDebugBlockEvent.bind(this);
            this._onViewerChangeEventCB = this._onViewerChangeEvent.bind(this);
            this._blockEventsByPath = new Map();
            this._editor = editor;
            EventServices.addListener(ExecutionEvents.TraceStartEvent, this._onTraceStartEventCB);
            EventServices.addListener(ExecutionEvents.TraceStopEvent, this._onTraceStopEventCB);
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
            this._onTraceStopEvent();
            EventServices.removeListener(ExecutionEvents.TraceStartEvent, this._onTraceStartEventCB);
            EventServices.removeListener(ExecutionEvents.TraceStopEvent, this._onTraceStopEventCB);
            this._editor = undefined;
            this._onTraceStartEventCB = undefined;
            this._onTraceStopEventCB = undefined;
            this._onDebugBlockEventCB = undefined;
            this._onViewerChangeEventCB = undefined;
            this._blockEventsByPath = undefined;
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
         * The callback on the trace start event.
         * @private
         */
        _onTraceStartEvent() {
            if (this._editor._getTabViewSwitcher()?.isDebugActiveTab()) {
                this._showAllBlockStates();
                EventServices.addListener(ExecutionEvents.DebugBlockEvent, this._onDebugBlockEventCB);
                this._editor.addListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeEventCB);
            }
        }
        /**
         * The callback on the trace stop event.
         * @private
         */
        _onTraceStopEvent() {
            this._hideAllBlockStates();
            EventServices.removeListener(ExecutionEvents.DebugBlockEvent, this._onDebugBlockEventCB);
            this._editor.removeListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeEventCB);
            this._blockEventsByPath.clear();
        }
        /**
         * The callback on the viewer change event.
         * @private
         * @param {UIEvents.UIViewerChangeEvent} event - The viewer change event.
         */
        _onViewerChangeEvent(event) {
            const isOpening = event.getOpeningState();
            if (isOpening) {
                const blocks = event.getViewer().getMainGraph().getBlocks();
                blocks.forEach(block => {
                    block.getView().showBlockState(); // Initialize block state
                    const blockPath = block.getModel().toPath(); // Redispatch block events
                    const blockEvents = this._blockEventsByPath.get(blockPath) || [];
                    blockEvents.forEach(blockEvent => block.getView().onDebugBlockEvent(blockEvent));
                });
            }
        }
        /**
         * The callback on the execution debug block event.
         * @private
         * @param {ExecutionEvents.DebugBlockEvent} event - The execution debug block event.
         */
        _onDebugBlockEvent(event) {
            const blockPath = event.getPath();
            if (blockPath && blockPath !== '') {
                const blockEvents = this._blockEventsByPath.get(blockPath) || [];
                blockEvents.push(event);
                this._blockEventsByPath.set(blockPath, blockEvents);
                // Redispatch block event on existing UI block
                const rootGraph = this._editor.getViewerController().getRootViewer().getMainGraph();
                let blockUI = rootGraph.getObjectFromPath(blockPath);
                blockUI = blockUI instanceof UIGraph ? blockUI.getBlockView() : blockUI;
                if (blockUI instanceof UIBlock) {
                    blockUI.getView().onDebugBlockEvent(event);
                }
            }
        }
        /**
         * Shows the block state of each existing UI block.
         * @private
         */
        _showAllBlockStates() {
            const blocks = this._getAllExistingUIBlocks();
            blocks.forEach(block => block.getView().showBlockState());
        }
        /**
         * Hides the block state from each existing UI block.
         * @private
         */
        _hideAllBlockStates() {
            const blocks = this._getAllExistingUIBlocks();
            blocks.forEach(block => block.getView().hideBlockState());
        }
        /**
         * Gets the list of existing UI blocks.
         * @private
         * @returns {UIBlock[]} The list of existing UI blocks.
         */
        _getAllExistingUIBlocks() {
            let blocks = [];
            const viewerController = this._editor.getViewerController();
            if (viewerController) {
                const viewers = viewerController.getRootViewerWithAllViewers();
                blocks = viewers.map(viewer => viewer.getMainGraph().getBlocks()).flat();
            }
            return blocks;
        }
    }
    return UIBlockStateController;
});
