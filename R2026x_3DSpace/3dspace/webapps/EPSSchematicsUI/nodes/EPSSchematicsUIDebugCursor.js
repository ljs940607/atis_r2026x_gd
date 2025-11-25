/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIDebugCursor'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIDebugCursor", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIDebugCursorView"], function (require, exports, UINode, UIDebugCursorView) {
    "use strict";
    /**
     * This class defines a debug cursor.
     * @private
     * @class UIDebugCursor
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIDebugCursor
     * @extends UINode
     */
    class UIDebugCursor extends UINode {
        /**
         * @public
         * @constructor
         * @param {UIBlock} block - The block where to place the debug cursor.
         * @param {boolean} isParent - True if this is a parent debug cursor else false.
         */
        constructor(block, isParent) {
            super({ graph: block.getGraph(), isDraggable: false });
            this._kDataPortGap = 20;
            this._kControlPortGap = 20;
            this._block = block;
            this._isParent = isParent;
            this.setView(new UIDebugCursorView(this._isParent));
            this._updatePosition();
            this._updateDimension();
            this.addNodeToViewer();
        }
        /**
         * Removes the node from its parent graph.
         * @public
         * @override
         */
        remove() {
            this._block = undefined;
            this._isParent = undefined;
            super.remove();
        }
        /**
         * Gets the block of the debug cursor.
         * @public
         * @returns {UIBlock} The ui block.
         */
        getBlock() {
            return this._block;
        }
        /**
         * Updates the debug cursor position.
         * @private
         */
        _updatePosition() {
            const left = this._block.getActualLeft() - this._kControlPortGap;
            const top = this._block.getActualTop() - this._kDataPortGap;
            this.setPosition(left, top);
        }
        /**
         * Updates the debug cursor dimension.
         * @private
         */
        _updateDimension() {
            const dimension = this._block.getDimension();
            const width = dimension.width + (this._kDataPortGap * 2);
            const height = dimension.height + (this._kControlPortGap * 2);
            this.setDimension(width, height);
        }
    }
    return UIDebugCursor;
});
