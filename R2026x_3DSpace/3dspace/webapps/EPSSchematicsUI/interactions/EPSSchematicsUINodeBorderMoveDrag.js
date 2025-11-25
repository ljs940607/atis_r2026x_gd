/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeBorderMoveDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeBorderMoveDrag", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines a node border move drag interaction.
     * @private
     * @class UINodeBorderMoveDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeBorderMoveDrag
     */
    class UINodeBorderMoveDrag {
        /**
         * @public
         * @constructor
         * @param {HTMLDivElement} border - The dragged border.
         * @param {UINode} node - The UI node.
         */
        constructor(border, node) {
            this._border = border;
            this._node = node;
            this._initialTop = this._node.getTop();
            this._initialLeft = this._node.getLeft();
            this._initialWidth = this._node.getWidth();
            this._initialHeight = this._node.getHeight();
        }
        /**
         * The call back on the mouse move event.
         * @public
         * @param {EGraphIact.IMouseMoveData} data - The mouse move data.
         */
        onmousemove(data) {
            const positionX = Math.round(data.graphPos[0]);
            const positionY = Math.round(data.graphPos[1]);
            const nodeView = this._node.getView();
            const borders = nodeView.getNodeBorders();
            const computeTop = this._border === borders.top || this._border === borders.topLeft || this._border === borders.topRight;
            const computeBottom = this._border === borders.bottom || this._border === borders.bottomLeft || this._border === borders.bottomRight;
            const computeLeft = this._border === borders.left || this._border === borders.topLeft || this._border === borders.bottomLeft;
            const computeRight = this._border === borders.right || this._border === borders.topRight || this._border === borders.bottomRight;
            const nodeMinHeight = this._node.getMinHeight();
            const nodeMinWidth = this._node.getMinWidth();
            if (computeTop) {
                this._cursorDeltaY = Math.round(this._cursorDeltaY || this._initialTop - positionY);
                const height = Math.round(this._initialHeight + (this._initialTop - positionY) - this._cursorDeltaY);
                const top = Math.round(positionY + this._cursorDeltaY);
                if (height >= nodeMinHeight) {
                    this._node.setTop(top);
                    this._node.setHeight(height);
                }
            }
            else if (computeBottom) {
                this._cursorDeltaY = Math.round(this._cursorDeltaY || this._initialTop + this._initialHeight - positionY);
                const height = Math.round(positionY + this._cursorDeltaY - this._initialTop);
                if (height >= nodeMinHeight) {
                    this._node.setHeight(height);
                }
            }
            if (computeLeft) {
                this._cursorDeltaX = Math.round(this._cursorDeltaX || this._initialLeft - positionX);
                const width = Math.round(this._initialWidth + (this._initialLeft - positionX) - this._cursorDeltaX);
                const left = Math.round(positionX + this._cursorDeltaX);
                if (width >= nodeMinWidth) {
                    this._node.setLeft(left);
                    this._node.setWidth(width);
                }
            }
            else if (computeRight) {
                this._cursorDeltaX = Math.round(this._cursorDeltaX || this._initialLeft + this._initialWidth - positionX);
                const width = Math.round(positionX + this._cursorDeltaX - this._initialLeft);
                if (width >= nodeMinWidth) {
                    this._node.setWidth(width);
                }
            }
            this._node.getGraph().onUIChange();
        }
        /**
         * The callback on the mouse move end drag event.
         * @public
         */
        onend() {
            const hasTopChanged = this._node.getTop() !== this._initialTop;
            const hasLeftChanged = this._node.getLeft() !== this._initialLeft;
            const hasHeightChanged = this._node.getHeight() !== this._initialHeight;
            const hasWidthChanged = this._node.getWidth() !== this._initialWidth;
            const hasSizeUpdated = hasTopChanged || hasLeftChanged || hasHeightChanged || hasWidthChanged;
            if (hasSizeUpdated) {
                this._node.getGraph().updateSizeFromBlocks();
                const historyController = this._node.getGraph().getEditor().getHistoryController();
                historyController.registerResizeAction(this._node);
            }
        }
    }
    return UINodeBorderMoveDrag;
});
