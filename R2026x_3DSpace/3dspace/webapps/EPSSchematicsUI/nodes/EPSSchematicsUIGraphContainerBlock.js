/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphContainerBlock'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphContainerBlock", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphContainerBlockView", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType"], function (require, exports, UIBlock, UIGraphContainerBlockView, UICommand, UICommandType) {
    "use strict";
    /**
     * This class defines a UI graph container block.
     * @private
     * @class UIGraphContainerBlock
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphContainerBlock
     * @extends UIBlock
     */
    class UIGraphContainerBlock extends UIBlock {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph that owns this block.
         * @param {Block} model - The block model.
         * @param {number} left - The left position of the block.
         * @param {number} top - The top position of the block.
         */
        constructor(graph, model, left, top) {
            super(graph, model, left, top, UIGraphContainerBlockView);
        }
        /**
         * Removes the node from its parent graph.
         * @public
         * @override
         */
        remove() {
            this._containedGraphUI = undefined;
            this._graphContainerViewer = undefined;
            super.remove();
        }
        /**
         * Projects the specified JSON object to the block.
         * @public
         * @override
         * @param {IJSONGraphContainerBlockUI} iJSONBlock - The JSON projected block.
         */
        fromJSON(iJSONBlock) {
            super.fromJSON(iJSONBlock);
            this._containedGraphUI = iJSONBlock.containedGraph;
        }
        /**
         * Projects the block to the specified JSON object.
         * @public
         * @override
         * @param {IJSONGraphContainerBlockUI} oJSONBlock - The JSON projected block.
         */
        toJSON(oJSONBlock) {
            super.toJSON(oJSONBlock);
            if (this._graphContainerViewer) { // If graph container viewer is opened and save is asked!
                const jsonGraph = this._graphContainerViewer.save();
                this._containedGraphUI = jsonGraph.ui;
            }
            if (this._containedGraphUI) {
                oJSONBlock.containedGraph = this._containedGraphUI;
            }
        }
        /**
         * Gets the block model.
         * @public
         * @override
         * @returns {GraphContainerBlock} The block model.
         */
        getModel() {
            return super.getModel();
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {UICommand[]} The list of available commands.
         */
        getCommands() {
            const commands = super.getCommands();
            commands.splice(1, 0, new UICommand(UICommandType.eOpen, this.onBlockDblClick.bind(this)));
            return commands;
        }
        /**
         * The callback on the block double click event.
         * @public
         * @override
         */
        onBlockDblClick() {
            this._graphContainerViewer = this.openGraphContainerViewer();
            this._graph.getViewer().getEditor().getHistoryController().registerViewerChangeAction();
        }
        /**
         * Opens the graph container viewer.
         * @public
         * @returns {UIGraphContainerViewer} The graph container viewer.
         */
        openGraphContainerViewer() {
            this._graphContainerViewer = this._graph.getViewer().getEditor().getViewerController().createGraphContainerViewer(this);
            return this._graphContainerViewer;
        }
        /**
         * Gets the UI contained graph.
         * @public
         * @returns {IJSONGraphUI|undefined} The UI contained graph.
         */
        getContainedGraphUI() {
            return this._containedGraphUI;
        }
        /**
         * Sets the UI contained graph.
         * @public
         * @param {IJSONGraphUI} containedGraphUI - The UI contained graph.
         */
        setContainedGraphUI(containedGraphUI) {
            this._containedGraphUI = containedGraphUI;
        }
        /**
         * Removes the reference on the opened graph container viewer.
         * @public
         */
        removeGraphContainerVieweReference() {
            this._graphContainerViewer = undefined;
        }
        /**
         * Gets the graph container viewer.
         * @public
         * @returns {UIGraphContainerViewer|undefined} The graph container viewer.
         */
        getGraphContainerViewer() {
            return this._graphContainerViewer;
        }
    }
    return UIGraphContainerBlock;
});
