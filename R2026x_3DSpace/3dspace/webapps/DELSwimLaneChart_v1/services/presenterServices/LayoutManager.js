/// <amd-module name="DS/DELSwimLaneChart_v1/services/presenterServices/LayoutManager"/>
define("DS/DELSwimLaneChart_v1/services/presenterServices/LayoutManager", ["require", "exports", "DS/DELSwimLaneChart_v1/utils/LayoutUtils", "DS/DELSwimLaneChart_v1/utils/StaticAttributes"], function (require, exports, LayoutUtils_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LayoutManager = void 0;
    class LayoutManager {
        constructor(model) {
            this._boundingBox = { x: 0, y: 0, w: StaticAttributes_1.gridWidthThreshold, h: 0 };
            this._rightOffset = 0;
            this._swimLaneChartModel = model;
        }
        set boundingBox(newBd) {
            this._boundingBox.y = newBd.y;
            this._boundingBox.h = newBd.h;
            this._boundingBox.x = 0;
            if (newBd.w > StaticAttributes_1.gridWidthThreshold && newBd.w !== this._boundingBox.w) {
                this._boundingBox.w = newBd.w;
                const recomputeModelHeight = this.updateModelWidth();
                if (recomputeModelHeight) {
                    this.updateModelHeight();
                    this.getSwimLaneChartHeight();
                }
            }
        }
        get boundingBox() {
            return this._boundingBox;
        }
        set rightOffset(newoffset) {
            if (this._rightOffset !== newoffset) {
                this._rightOffset = newoffset;
                this.updateModelWidth();
            }
        }
        updateRightOffset(newHeight) {
            if (newHeight > this._boundingBox.h)
                this.rightOffset = 14; // var(scrollbar size)
            else
                this.rightOffset = 0;
        }
        autoLayoutModel() {
            this.updateModelWidth();
            this.updateModelHeight();
        }
        updateModelWidth() {
            // update the columns width
            const colWidth = this.computeColumnWidth();
            const visibleColumns = this._swimLaneChartModel.columns.filter((col) => !col.hidden);
            let cumLeft = 0;
            visibleColumns.forEach((col) => {
                col.left = cumLeft;
                col.width = colWidth * col.weight;
                cumLeft += col.width;
            });
            let itShouldRecomputeLayoutFlag = false;
            // update the node width
            this._swimLaneChartModel.nodes.forEach((v) => {
                const parent = this._swimLaneChartModel.getSwilmLaneChartParent(v.node.id);
                if (parent) {
                    v.node.width = parent.node.width - StaticAttributes_1.nodeColumnMargin;
                    v.node.position = { ...v.node.position, x: parent.node.position.x + StaticAttributes_1.nodeColumnMargin / 2 };
                    if (v.node.height === 0) {
                        v.node.height = this._swimLaneChartModel.computeNodeHeightFromHtmlContent(v.node, v.node.width);
                        v.node.bodyHeight = v.node.height;
                        itShouldRecomputeLayoutFlag = true;
                    }
                    return;
                }
                const col = visibleColumns.find((col) => col.id === v.columnId);
                if (col) {
                    v.node.width = col.width - StaticAttributes_1.nodeColumnMargin;
                    v.node.position = { ...v.node.position, x: col.left + StaticAttributes_1.nodeColumnMargin / 2 };
                    if (v.node.height === 0) {
                        v.node.height = this._swimLaneChartModel.computeNodeHeightFromHtmlContent(v.node, v.node.width);
                        v.node.bodyHeight = v.node.height;
                        itShouldRecomputeLayoutFlag = true;
                    }
                }
            });
            // update the group width
            this._swimLaneChartModel.listOfGroups.forEach((gr) => {
                gr.boundingBox = { ...gr.boundingBox, w: this._boundingBox.w };
            });
            return itShouldRecomputeLayoutFlag;
        }
        updateModelHeight(top = 0) {
            let colOffset = new Map();
            const groupOffset = new Map();
            const groupsList = top === 0 ? this._swimLaneChartModel.listOfGroups : this._swimLaneChartModel.listOfGroups.filter((gr) => gr.boundingBox.y >= top);
            const visibleColumns = this._swimLaneChartModel.columns.filter((col) => !col.hidden);
            // place the nodes
            let maxGrBottom = top === 0 ? top : top - StaticAttributes_1.groupMargin;
            // place the groups && nodes that are not children
            // groupsList.forEach((gr: SwimLaneChartGroup) => {
            //     const groupVerticalOffset = maxGrBottom !== 0 ? maxGrBottom + groupMargin : groupMargin; // distance between groups
            //     let verticalOffset = groupVerticalOffset;
            //     let prevNodeHeight = 0;
            //     colOffset = new Map();
            //     // current group bd
            //     let minTop = Number.MAX_VALUE, maxBottom = 0;
            //     for (let i = 0; i < gr.elements.length; i++) {
            //         const v = this._swimLaneChartModel.nodes.get(gr.elements[i]);
            //         if (!v) continue;
            //         if (v.node.parentId) {
            //             // if (gr.id) {
            //             //     groupOffset.set(gr.id, v.node.position.y);
            //             //     maxBottom = Math.max(maxBottom, v.node.position.y + this.computeNodeHeight(v.node));
            //             //     maxGrBottom = Math.max(maxGrBottom, maxBottom);
            //             //     minTop = Math.min(minTop, v.node.position.y);
            //             // }
            //             continue;
            //         }
            //         const col = visibleColumns.find((col) => col.id === v.columnId); // could alter the group dimensions
            //         if (col) {
            //             verticalOffset = colOffset.get(col.id) ?? groupOffset.get(gr.id) ?? groupVerticalOffset;
            //             // update the y position
            //             if (v.node.header) v.node.header.topOffset = 0;
            //             v.node.position.y = verticalOffset;
            //             v.nodeVerticalOffset = verticalOffset;
            //             this.positionChildElementsInsideParent(v);
            //             // update the group bounding box
            //             prevNodeHeight = this.computeNodeHeight(v.node);
            //             maxBottom = Math.max(maxBottom, v.nodeVerticalOffset + prevNodeHeight);
            //             maxGrBottom = Math.max(maxGrBottom, maxBottom);
            //             minTop = Math.min(minTop, v.nodeVerticalOffset);
            //             colOffset.set(col.id, (colOffset.get(col.id) ?? groupVerticalOffset) + prevNodeHeight + groupMargin); // offset with respect to the column
            //             if (gr.id) groupOffset.set(gr.id, v.node.position.y); // offset with respect to the group
            //         }
            //     }
            //     // update the colGroup vertical offset
            //     for (let i = 0; i < gr.elements.length; i++) {
            //         const v = this._swimLaneChartModel.nodes.get(gr.elements[i]);
            //         if (v) v.colGroupVerticalOffset = colOffset.get(v.columnId) ?? groupOffset.get(gr.id) ?? groupVerticalOffset;
            //     }
            //     if (minTop !== Number.MAX_VALUE) gr.boundingBox = { x: 0, y: minTop - groupMargin/2, w: this._boundingBox.w, h: maxBottom - minTop + groupMargin }
            // });
            groupsList.forEach((gr) => {
                var _a, _b, _c;
                const groupVerticalOffset = maxGrBottom !== 0 ? maxGrBottom + 2 * StaticAttributes_1.gridStep : StaticAttributes_1.gridStep / 2; // distance between groups
                let verticalOffset = groupVerticalOffset;
                let prevNodeHeight = 0;
                colOffset = new Map();
                // current group bd
                let minTop = Number.MAX_VALUE, maxBottom = 0;
                for (let i = 0; i < gr.elements.length; i++) {
                    const v = this._swimLaneChartModel.nodes.get(gr.elements[i]);
                    if (!v || v.node.parentId)
                        continue;
                    const col = visibleColumns.find((col) => col.id === v.columnId); // could ater the group dimensions
                    if (col) {
                        verticalOffset = (_a = colOffset.get(col.id)) !== null && _a !== void 0 ? _a : groupVerticalOffset;
                        // update the y position
                        if (v.node.header)
                            v.node.header.topOffset = 0;
                        if (v.node.position.y !== v.nodeVerticalOffset) {
                            const diff = v.node.position.y - v.nodeVerticalOffset;
                            v.nodeVerticalOffset = verticalOffset;
                            v.node.position.y = v.nodeVerticalOffset + diff;
                        }
                        else {
                            v.node.position.y = verticalOffset;
                            v.nodeVerticalOffset = verticalOffset;
                        }
                        this.positionChildElementsInsideParent(v);
                        // update the goup bounding box
                        prevNodeHeight = this.computeNodeHeight(v.node);
                        maxBottom = Math.max(maxBottom, v.nodeVerticalOffset + prevNodeHeight);
                        maxGrBottom = Math.max(maxGrBottom, maxBottom);
                        minTop = Math.min(minTop, v.nodeVerticalOffset);
                        colOffset.set(col.id, ((_b = colOffset.get(col.id)) !== null && _b !== void 0 ? _b : groupVerticalOffset) + prevNodeHeight + StaticAttributes_1.gridStep);
                    }
                }
                // update the colGroup vertical offset
                for (let i = 0; i < gr.elements.length; i++) {
                    const v = this._swimLaneChartModel.nodes.get(gr.elements[i]);
                    if (v)
                        v.colGroupVerticalOffset = (_c = colOffset.get(v.columnId)) !== null && _c !== void 0 ? _c : groupVerticalOffset;
                }
                if (minTop !== Number.MAX_VALUE)
                    gr.boundingBox = { x: 0, y: minTop - StaticAttributes_1.gridStep, w: this._boundingBox.w, h: maxBottom - minTop + 2 * StaticAttributes_1.gridStep };
            });
        }
        /**
         * Move to utils
         * @returns
         */
        computeColumnWidth() {
            let columnsCount = 0;
            for (const col of this._swimLaneChartModel.columns) {
                if (col.hidden)
                    continue;
                columnsCount += col.weight;
            }
            return Math.floor((this._boundingBox.w - this._rightOffset) / columnsCount);
        }
        computeNodeHeight(node) {
            if (node.type === "CompositeNode")
                return node.height;
            if (node.isMinimized)
                return StaticAttributes_1.header_height;
            return node.height;
        }
        getVisibleElts() {
            let visibleElts = [...this._swimLaneChartModel.nodes.values()].filter((v) => {
                const intersectionCondition = (0, LayoutUtils_1.checkRectangleIntersection)({ ...v.node.position, w: v.node.width, h: this.computeNodeHeight(v.node) }, this._boundingBox) ||
                    (v.nodeVerticalOffset > 0 && (0, LayoutUtils_1.checkRectangleIntersection)({ x: v.node.position.x, y: v.nodeVerticalOffset, w: v.node.width, h: this.computeNodeHeight(v.node) }, this._boundingBox));
                return intersectionCondition;
            });
            visibleElts = visibleElts.filter((elt) => {
                const col = this._swimLaneChartModel.columns.find((col) => col.id === elt.columnId);
                return col && !col.hidden;
            });
            const visibleGroups = [];
            // add visible groups
            visibleElts.forEach((v) => {
                const group = this._swimLaneChartModel.listOfGroups.find((gr) => gr.id === v.groupId);
                if (!group)
                    return;
                visibleGroups.push(group);
            });
            return { nodes: visibleElts, groups: [...new Set(visibleGroups)] };
        }
        getSwimLaneChartHeight() {
            let swimLanechartHeight = 0;
            if (this._swimLaneChartModel.nodes.size === 0)
                swimLanechartHeight = this._boundingBox.h - StaticAttributes_1.grid_yOffset;
            else {
                const nodesBottomList = [...this._swimLaneChartModel.nodes.values()].map((v) => v.node.position.y + this.computeNodeHeight(v.node));
                swimLanechartHeight = Math.max(...nodesBottomList) + StaticAttributes_1.grid_yOffset;
            }
            this._swimLaneChartModel.columns.forEach((col) => col.height = Math.max(swimLanechartHeight, this._boundingBox.h));
            return swimLanechartHeight;
        }
        getSwimLaneChartWidth() {
            return this._boundingBox.w - this._rightOffset;
        }
        positionChildElementsInsideParent(parentElt) {
            const parentNode = parentElt.node;
            if (parentNode.type === "CompositeNode") {
                let heightSum = parentNode.isMinimized ? StaticAttributes_1.header_height + StaticAttributes_1.gridStep : parentNode.bodyHeight + StaticAttributes_1.gridStep;
                const childElements = this._swimLaneChartModel.getSwimLaneChartChildren(parentNode.id);
                for (let i = 0; i < childElements.length; i++) {
                    childElements[i].node.position.y = parentNode.position.y + heightSum;
                    childElements[i].nodeVerticalOffset = parentElt.nodeVerticalOffset + heightSum;
                    if (childElements[i].node.type === "CompositeNode") {
                        parentNode.height = heightSum;
                        this.positionChildElementsInsideParent(childElements[i]);
                    }
                    heightSum += this.computeNodeHeight(childElements[i].node) + StaticAttributes_1.header_height / 2;
                }
                parentNode.height = heightSum;
            }
            ;
        }
        applyStickyTransformation(group) {
            let stickyNodes = [];
            for (let i = 0; i < group.elements.length; i++) {
                const v = this._swimLaneChartModel.nodes.get(group.elements[i]);
                if (!v || v.node.parentId)
                    continue;
                const nodeHeight = this.computeNodeHeight(v.node);
                const nodeshiftDelta = v.colGroupVerticalOffset - v.nodeVerticalOffset;
                const groupUnOccupiedHeight = (group.boundingBox.y + group.boundingBox.h - v.colGroupVerticalOffset);
                const start = 0, end = (group.boundingBox.h - (nodeshiftDelta));
                const startingY = Math.max(v.colGroupVerticalOffset - groupUnOccupiedHeight - 2 * StaticAttributes_1.gridStep, group.boundingBox.y + start - StaticAttributes_1.gridStep);
                const stickyGuard = (v.nodeVerticalOffset + nodeHeight) >= startingY;
                const minEdge = v.nodeVerticalOffset + start, maxEdge = group.boundingBox.y + end;
                if (stickyGuard && nodeshiftDelta > 0) {
                    const topOffset = 0;
                    const newVerticalOffset = this._boundingBox.y + v.nodeVerticalOffset + topOffset - startingY;
                    const newValue = Math.min(Math.max(newVerticalOffset, minEdge), maxEdge);
                    if (Math.abs(newValue - v.node.position.y) > 1) {
                        v.node.position.y = newValue;
                        this.positionChildElementsInsideParent(v);
                        if ((0, LayoutUtils_1.checkRectangleIntersection)(this._boundingBox, { x: v.node.position.x, y: newValue, w: v.node.width, h: nodeHeight })) {
                            stickyNodes = [...stickyNodes, v.node];
                        }
                    }
                }
                else {
                    v.node.position.y = v.nodeVerticalOffset;
                }
            }
            return stickyNodes;
        }
        pinCompositeNodeHeader(visibleNodes) {
            const pinnedNodes = [];
            visibleNodes.forEach((node) => {
                if (node.type === "CompositeNode") {
                    if (node.header) {
                        const newOffset = (this._boundingBox.y + 2 * StaticAttributes_1.gridStep - node.position.y);
                        if (newOffset >= 0) {
                            node.header.topOffset = newOffset <= (this.computeNodeHeight(node) - 2 * StaticAttributes_1.gridStep) ? newOffset : 0;
                        }
                        else {
                            node.header.topOffset = 0;
                        }
                        pinnedNodes.push(node);
                    }
                }
            });
            return pinnedNodes;
        }
        unPinCompositeNodeHeader() {
            const unPinnedNodes = [];
            this._swimLaneChartModel.nodes.forEach((v) => {
                if (v.node.type === "CompositeNode") {
                    if (v.node.header) {
                        if (v.node.header.topOffset) {
                            v.node.header.topOffset = 0;
                            unPinnedNodes.push(v.node);
                        }
                    }
                }
            });
            return unPinnedNodes;
        }
        resetStickyTransformation() {
            let resetedNodes = [];
            this._swimLaneChartModel.nodes.forEach((v) => {
                var _a;
                if (v.node.position.y !== v.nodeVerticalOffset) {
                    v.node.position.y = v.nodeVerticalOffset;
                    if ((_a = v.node.header) === null || _a === void 0 ? void 0 : _a.topOffset)
                        v.node.header.topOffset = 0;
                    resetedNodes = [...resetedNodes, v.node];
                }
            });
            return resetedNodes;
        }
    }
    exports.LayoutManager = LayoutManager;
});
