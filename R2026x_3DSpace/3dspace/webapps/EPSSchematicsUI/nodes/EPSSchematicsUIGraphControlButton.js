/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphControlButton'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphControlButton", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphControlButtonView"], function (require, exports, UINode, UIGraphControlButtonView) {
    "use strict";
    /**
     * This class defines a graph control button.
     * @private
     * @class UIGraphControlButton
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphControlButton
     * @extends UINode
     */
    class UIGraphControlButton extends UINode {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The parent graph.
         * @param {boolean} isInput - True for input, false for output.
         */
        constructor(graph, isInput) {
            super({ graph: graph, isDraggable: false });
            this.setView(new UIGraphControlButtonView(this, isInput));
            this.setDimension(20, 20);
            this.addNodeToViewer();
        }
        /**
         * Removes the node from its parent graph.
         * @public
         * @override
         */
        remove() {
            super.remove();
        }
        /**
         * Gets the main view if the node.
         * @public
         * @override
         * @returns {UIGraphControlButtonView} The main view of the node.
         */
        getView() {
            return super.getView();
        }
        /**
         * Checks if the node is selectable.
         * @public
         * @override
         * @returns {boolean} True if the node is selectable else false.
         */
        // eslint-disable-next-line class-methods-use-this
        isSelectable() {
            return false;
        }
    }
    return UIGraphControlButton;
});
