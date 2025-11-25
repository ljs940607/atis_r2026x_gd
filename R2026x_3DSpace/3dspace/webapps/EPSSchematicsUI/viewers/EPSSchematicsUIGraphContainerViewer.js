/// <amd-module name='DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphContainerViewer'/>
define("DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphContainerViewer", ["require", "exports", "DS/EPSSchematicsUI/viewers/EPSSchematicsUIViewer"], function (require, exports, UIViewer) {
    "use strict";
    /**
     * This class defines the graph container viewer.
     * @private
     * @class UIGraphContainerViewer
     * @alias module:DS/EPSSchematicsUI/viewers/EPSSchematicsUIGraphContainerViewer
     * @extends UIViewer
     */
    class UIGraphContainerViewer extends UIViewer {
        /**
         * @public
         * @constructor
         * @param {HTMLElement} container - The HTML parent container that will hold the graph viewer.
         * @param {UIEditor} editor - The editor.
         * @param {UIGraphContainerBlock} graphContainerBlockUI - The graph container block.
         */
        constructor(container, editor, graphContainerBlockUI) {
            super(container, editor);
            this._graphContainerBlockUI = graphContainerBlockUI;
            this._initialize();
        }
        /**
         * Removes the viewer.
         * @public
         * @override
         */
        remove() {
            const jsonGraph = this.save();
            this._graphContainerBlockUI.setContainedGraphUI(jsonGraph.ui);
            this._graphContainerBlockUI.removeGraphContainerVieweReference();
            this._graphContainerBlockUI = undefined;
            super.remove();
        }
        /**
         * Initializes the viewer.
         * @private
         */
        _initialize() {
            const containedGraph = this._graphContainerBlockUI.getModel().getContainedGraph();
            const containedGraphUI = this._graphContainerBlockUI.getContainedGraphUI();
            this.createGraph(containedGraph, containedGraphUI);
            this.getMainGraph().setGraphContext(this._graphContainerBlockUI.getGraph().getGraphContext());
            this.zoomGraphToFitInView();
        }
    }
    return UIGraphContainerViewer;
});
