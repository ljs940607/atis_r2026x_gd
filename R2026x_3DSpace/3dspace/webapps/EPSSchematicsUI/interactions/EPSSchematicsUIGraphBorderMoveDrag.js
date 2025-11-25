/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphBorderMoveDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphBorderMoveDrag", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIMath"], function (require, exports, UIMath) {
    "use strict";
    /**
     * This class defines a graph border move drag interaction.
     * @private
     * @class UIGraphBorderMoveDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphBorderMoveDrag
     */
    class UIGraphBorderMoveDrag {
        /**
         * @public
         * @constructor
         * @param {Element} border - The border of the graph.
         * @param {EGraphCore.Group} group - The group representing the graph.
         */
        constructor(border, group) {
            this._initialPortOffsets = [];
            this._border = border;
            this._group = group;
            this._graph = this._group.data.graph;
            this._initialLeft = this._group.geometry.left;
            this._initialTop = this._group.geometry.top;
            this._initialWidth = this._group.geometry.width;
            this._initialHeight = this._group.geometry.height;
            this._graph.getControlPorts().forEach(cp => this._initialPortOffsets.push(cp.getOffset()));
            // Merge the blocks and control ports boundaries
            this._graphBounds = this._group.childrenBounds;
            this._cpBounds = this._graph.getControlPortBounds();
            this._clBounds = this._graph.getControlLinkBounds(true);
            this._ymin = UIMath.getMin(this._graphBounds.ymin, this._cpBounds.ymin);
            this._ymax = UIMath.getMax(this._graphBounds.ymax, this._cpBounds.ymax);
            this._ymin = UIMath.getMin(this._clBounds.ymin, this._ymin);
            this._ymax = UIMath.getMax(this._clBounds.ymax, this._ymax);
        }
        /**
         * The graph border mouse move callback.
         * @public
         * @override
         * @param {EGraphIact.IMouseMoveData} data - The move data.
         */
        onmousemove(data) {
            let positionX = data.graphPos[0];
            let positionY = data.graphPos[1];
            positionX = this._graph.getEditor().getOptions().gridSnapping ? UIMath.snapValue(positionX) : positionX;
            positionY = this._graph.getEditor().getOptions().gridSnapping ? UIMath.snapValue(positionY) : positionY;
            let computeTop = false, computeBottom = false, computeLeft = false, computeRight = false;
            const graphView = this._graph.getView();
            if (this._border === graphView.getBorderTop()) {
                computeTop = true;
            }
            else if (this._border === graphView.getBorderBottom()) {
                computeBottom = true;
            }
            else if (this._border === graphView.getBorderLeft()) {
                computeLeft = true;
            }
            else if (this._border === graphView.getBorderRight()) {
                computeRight = true;
            }
            else if (this._border === graphView.getCornerNW()) {
                computeTop = true;
                computeLeft = true;
            }
            else if (this._border === graphView.getCornerNE()) {
                computeTop = true;
                computeRight = true;
            }
            else if (this._border === graphView.getCornerSW()) {
                computeBottom = true;
                computeLeft = true;
            }
            else if (this._border === graphView.getCornerSE()) {
                computeBottom = true;
                computeRight = true;
            }
            if (computeTop) {
                let topLimit, top, height, offsetDiff;
                if (isNaN(this._ymin)) {
                    topLimit = (this._initialTop + this._initialHeight) - (this._graph.getPaddingTop() + this._graph.getPaddingBottom());
                }
                else {
                    topLimit = this._ymin - this._graph.getPaddingTop();
                }
                if (positionY < topLimit) {
                    top = positionY;
                    height = this._initialHeight + this._initialTop - positionY;
                    offsetDiff = this._initialTop - positionY;
                }
                else {
                    top = topLimit;
                    height = this._initialHeight + this._initialTop - topLimit;
                    offsetDiff = this._initialTop - topLimit;
                }
                this._graph.getViewer().getDisplay().updateLock();
                try {
                    this._group.multiset(['geometry', 'top'], top, ['geometry', 'height'], height);
                    this._graph.getControlPorts().forEach((controlPort, index) => controlPort.setOffset(UIMath.snapValue(this._initialPortOffsets[index] + offsetDiff)));
                }
                finally {
                    this._graph.getViewer().getDisplay().updateUnlock();
                }
            }
            if (computeBottom) {
                let bottomLimit;
                if (isNaN(this._ymax)) {
                    bottomLimit = this._initialTop + this._graph.getPaddingTop() + this._graph.getPaddingBottom();
                }
                else {
                    bottomLimit = this._ymax + this._graph.getPaddingBottom();
                }
                const top = this._initialTop;
                const height = positionY > bottomLimit ? (this._initialHeight + positionY - this._initialTop - this._initialHeight) : (bottomLimit - this._initialTop);
                this._group.multiset(['geometry', 'top'], top, ['geometry', 'height'], height);
            }
            const minWidth = this._graph.getMinimumGraphWidthFromDrawers();
            this._clBounds = this._graph.getControlLinkBounds(true); // Need to be called again cause of automatic links that are redrawn!
            if (computeLeft) {
                let leftLimit;
                const xmin = UIMath.getMin(this._graphBounds.xmin, this._clBounds.xmin);
                if (isNaN(xmin)) {
                    leftLimit = (this._initialLeft + this._initialWidth) - (this._graph.getPaddingLeft() + this._graph.getPaddingRight());
                }
                else {
                    leftLimit = xmin - this._graph.getPaddingLeft();
                }
                if ((this._initialLeft + this._initialWidth - leftLimit) < minWidth) {
                    leftLimit = this._initialLeft + this._initialWidth - minWidth;
                }
                const width = positionX < leftLimit ? (this._initialWidth + this._initialLeft - positionX) : (this._initialWidth + this._initialLeft - leftLimit);
                const left = positionX < leftLimit ? positionX : leftLimit;
                this._group.multiset(['geometry', 'left'], left, ['geometry', 'width'], width);
            }
            if (computeRight) {
                let rightLimit;
                const xmax = UIMath.getMax(this._graphBounds.xmax, this._clBounds.xmax);
                if (isNaN(xmax)) {
                    rightLimit = this._initialLeft + this._graph.getPaddingLeft() + this._graph.getPaddingRight();
                }
                else {
                    rightLimit = xmax + this._graph.getPaddingRight();
                }
                if ((rightLimit - this._initialLeft) < minWidth) {
                    rightLimit = this._initialLeft + minWidth;
                }
                const width = positionX > rightLimit ? (this._initialWidth + positionX - this._initialLeft - this._initialWidth) : (rightLimit - this._initialLeft);
                const left = this._initialLeft;
                this._group.multiset(['geometry', 'left'], left, ['geometry', 'width'], width);
            }
            this._graph.onUIChange();
        }
        /**
         * The graph border move end callback.
         * @public
         * @param {boolean} _cancel - True when the drag is cancel else false.
         */
        onend(_cancel) {
            let update = this._graph.getTop() !== this._initialTop;
            update = update || this._graph.getLeft() !== this._initialLeft;
            update = update || this._graph.getHeight() !== this._initialHeight;
            update = update || this._graph.getWidth() !== this._initialWidth;
            if (update) {
                const historyController = this._graph.getViewer().getEditor().getHistoryController();
                historyController.registerMoveAction([this._graph]);
            }
        }
    }
    return UIGraphBorderMoveDrag;
});
