/// <amd-module name="DS/DELSwimLaneChart_v2/services/presenterServices/LayoutManager"/>
define("DS/DELSwimLaneChart_v2/services/presenterServices/LayoutManager", ["require", "exports", "DS/DELSwimLaneChart_v2/utils/LayoutUtils", "DS/DELSwimLaneChart_v2/utils/StaticAttributes"], function (require, exports, LayoutUtils_1, StaticAttributes_1) {
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
                var _a, _b, _c, _d;
                const parent = this._swimLaneChartModel.getSwilmLaneChartParent(v.node.id);
                if (parent) {
                    v.node.width = parent.node.width - StaticAttributes_1.nodeColumnMargin;
                    v.node.position = { ...v.node.position, x: parent.node.position.x + StaticAttributes_1.nodeColumnMargin / 2 };
                    if (v.node.height === 0 || ((_a = v.node.header) === null || _a === void 0 ? void 0 : _a.textWrap) === "wrap") { // || v.node.header?.textWrap === "nowrap"
                        if (v.node.type === "CompositeNode") {
                            v.node.height = this._swimLaneChartModel.computeNodeHeightFromHtmlContent(v.node, v.node.width);
                            v.node.bodyHeight = v.node.height;
                            if (((_b = v.node.header) === null || _b === void 0 ? void 0 : _b.textWrap) === "wrap")
                                this.placeChildElements(v);
                        }
                        else {
                            v.node.height = this._swimLaneChartModel.computeNodeHeightFromHtmlContent(v.node, v.node.width);
                            v.node.bodyHeight = v.node.height;
                        }
                        itShouldRecomputeLayoutFlag = true;
                    }
                    return;
                }
                const col = visibleColumns.find((col) => col.id === v.columnId);
                if (col) {
                    v.node.width = col.width - StaticAttributes_1.nodeColumnMargin;
                    v.node.position = { ...v.node.position, x: col.left + StaticAttributes_1.nodeColumnMargin / 2 };
                    if (v.node.height === 0 || ((_c = v.node.header) === null || _c === void 0 ? void 0 : _c.textWrap) === "wrap") {
                        if (v.node.type === "CompositeNode") {
                            v.node.height = this._swimLaneChartModel.computeNodeHeightFromHtmlContent(v.node, v.node.width);
                            v.node.bodyHeight = v.node.height;
                            if (((_d = v.node.header) === null || _d === void 0 ? void 0 : _d.textWrap) === "wrap")
                                this.placeChildElements(v);
                        }
                        else {
                            v.node.height = this._swimLaneChartModel.computeNodeHeightFromHtmlContent(v.node, v.node.width);
                            v.node.bodyHeight = v.node.height;
                        }
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
            const normalGroupsList = top === 0 ? this._swimLaneChartModel.getNormalSwimLaneChartGroups() : this._swimLaneChartModel.getNormalSwimLaneChartGroups().filter((gr) => gr.boundingBox.y >= top);
            /** @todo: refactor */
            this._swimLaneChartModel.nodes.forEach(((elt) => {
                if (elt.node.type === "CompositeNode" && !elt.node.parentId)
                    this.placeGrandChildElements(elt); // intialize the height
            }));
            let startY = 0;
            // group elements auto-layouting
            for (const gr of normalGroupsList) {
                if (gr.id === "" && gr.elements.length === 0) {
                    if (normalGroupsList.length > 1 && normalGroupsList[1].type === "normal")
                        normalGroupsList[1].color = "transparent";
                    continue;
                }
                this.autoLayoutGroup(gr, startY);
                startY = gr.boundingBox.y + gr.boundingBox.h + StaticAttributes_1.gridStep;
            }
        }
        setVerticalPositionOfGroupElt(elt, verticalPos) {
            if (!elt.node.parentId && elt.node.position.y !== elt.nodeVerticalOffset) {
                const diff = elt.node.position.y - elt.nodeVerticalOffset;
                elt.nodeVerticalOffset = verticalPos;
                elt.node.position.y = elt.nodeVerticalOffset + diff;
            }
            else {
                elt.node.position.y = verticalPos;
                elt.nodeVerticalOffset = verticalPos;
            }
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
            var _a, _b, _c, _d;
            if (node.isHidden)
                return 0;
            if (node.type === "CompositeNode") {
                if (node.isCollapsed)
                    return ((_b = (_a = node.header) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0);
                else
                    return node.height;
            }
            if (node.isMinimized || node.isCollapsed)
                return ((_d = (_c = node.header) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0);
            return node.height;
        }
        computeGroupHeight(group, execludedId = "") {
            const elementsBoundToCol = group.elementsBoundToCol;
            const columns = [...elementsBoundToCol.keys()];
            let maxHeight = 0;
            // second loop
            for (let k = 0; k < columns.length; k++) {
                const heightPerCol = this.computeGroupGolumnHeight(group, columns[k], execludedId);
                maxHeight = Math.max(maxHeight, heightPerCol !== null && heightPerCol !== void 0 ? heightPerCol : 0);
            }
            return maxHeight;
        }
        computeGroupGolumnHeight(group, columnId, execludedId = "") {
            const elements = group.elementsBoundToCol.get(columnId);
            if (!elements)
                return 0;
            const execludedElt = this._swimLaneChartModel.nodes.get(execludedId);
            return elements.reduce((acc, curr) => {
                if (curr === execludedId)
                    return acc;
                const currElt = this._swimLaneChartModel.nodes.get(curr);
                if (!currElt)
                    return acc;
                if (execludedElt) {
                    //@to-refactor
                    if (execludedElt.columnId === columnId || (currElt && currElt.nodeisParentOfInnerGroupElt))
                        return acc;
                }
                const h = this.computeNodeHeight(currElt.node);
                if (h)
                    return acc + h + StaticAttributes_1.groupMargin;
                else
                    return acc;
            }, 0);
        }
        getVisibleElts() {
            // -progressive-rendering-mode is deactivated
            if (this._swimLaneChartModel.nodes.size < 100 || localStorage.getItem("Swimlane-Chart-progressive-rendering-mode") === "deactivated") {
                return { nodes: [...this._swimLaneChartModel.nodes.values()], groups: this._swimLaneChartModel.listOfGroups };
            }
            // fragment element condition
            const isContainingFragmentElt = [...this._swimLaneChartModel.nodes.values()].some((elt) => elt.node.content.fragmentElement);
            if (isContainingFragmentElt || localStorage.getItem("Swimlane-Chart-progressive-rendering-mode") === "deactivated")
                return { nodes: [...this._swimLaneChartModel.nodes.values()], groups: this._swimLaneChartModel.listOfGroups };
            let visibleElts = [...this._swimLaneChartModel.nodes.values()].filter((v) => {
                const intersectionCondition = (0, LayoutUtils_1.checkRectangleIntersection)({ ...v.node.position, w: v.node.width, h: this.computeNodeHeight(v.node) }, this._boundingBox) ||
                    (v.nodeVerticalOffset > 0 && (0, LayoutUtils_1.checkRectangleIntersection)({ x: v.node.position.x, y: v.nodeVerticalOffset, w: v.node.width, h: this.computeNodeHeight(v.node) }, this._boundingBox));
                return (!v.node.isHidden && intersectionCondition); // v.node.content.fragmentElement 
            });
            visibleElts = visibleElts.filter((elt) => {
                const col = this._swimLaneChartModel.columns.find((col) => col.id === elt.columnId);
                return col && !col.hidden;
            });
            const visibleGroups = [];
            // add visible groups
            visibleElts.forEach((v) => {
                const group = this._swimLaneChartModel.listOfGroups.find((gr) => gr.id === v.groupId);
                if (!group || group.boundingBox.h === 0)
                    return;
                visibleGroups.push(group);
            });
            return { nodes: visibleElts, groups: [...new Set(visibleGroups)] };
        }
        checkPositionIntersectionWithObject(position, nodes) {
            let isIntersectedWithNode = null;
            let intersectionArea = Number.MAX_SAFE_INTEGER;
            nodes.forEach((n) => {
                const intersectionGuard = position.x >= n.position.x && position.y >= n.position.y && position.x <= (n.position.x + n.width) && (position.y) <= (n.position.y + this.computeNodeHeight(n));
                if (intersectionGuard) {
                    const newIntersectionArea = n.width * this.computeNodeHeight(n);
                    isIntersectedWithNode = n;
                    if (newIntersectionArea < intersectionArea) {
                        isIntersectedWithNode = n;
                        intersectionArea = newIntersectionArea;
                    }
                    return;
                }
            });
            if (isIntersectedWithNode)
                console.log("selected", isIntersectedWithNode.id);
            return isIntersectedWithNode;
        }
        getSwimLaneChartHeight() {
            let swimLanechartHeight = 0;
            if (this._swimLaneChartModel.nodes.size === 0)
                swimLanechartHeight = this._boundingBox.h - StaticAttributes_1.grid_yOffset;
            else {
                const nodesBottomList = [...this._swimLaneChartModel.nodes.values()].map((v) => v.node.isHidden ? 0 : v.nodeVerticalOffset + this.computeNodeHeight(v.node));
                swimLanechartHeight = Math.max(...nodesBottomList) + StaticAttributes_1.groupMargin;
            }
            this._swimLaneChartModel.columns.forEach((col) => col.height = Math.max(swimLanechartHeight, this._boundingBox.h));
            return swimLanechartHeight;
        }
        getSwimLaneChartWidth() {
            return this._boundingBox.w - this._rightOffset;
        }
        autoLayoutGroup(group, startY, depth = 0, columnsOffset = new Map()) {
            var _a, _b, _c, _d;
            if (depth > 50)
                return;
            depth++;
            const elementsBoundToCol = group.elementsBoundToCol;
            const reservedSpaces = [];
            const columns = [...elementsBoundToCol.keys()];
            const listOfElts = [...elementsBoundToCol.values()];
            const visitedNodesIds = [];
            const maxIterations = (_a = listOfElts.reduce((max, current) => {
                return current.length > max.length ? current : max;
            }, [])) === null || _a === void 0 ? void 0 : _a.length;
            for (let j = 0; j < maxIterations; j++) {
                for (let k = 0; k < columns.length; k++) {
                    const currentColId = columns[k];
                    const listOfnodes = elementsBoundToCol.get(currentColId);
                    if (!listOfnodes || listOfnodes.length <= j)
                        continue;
                    const currentNodeId = listOfnodes[j];
                    const currentElt = this._swimLaneChartModel.nodes.get(currentNodeId);
                    if (!currentElt || currentElt.node.isHidden)
                        continue;
                    const parentChildCondition = !currentElt.node.parentId || (currentElt.node.parentId && currentElt.groupId && ((((_b = this._swimLaneChartModel.nodes.get(currentElt.node.parentId)) === null || _b === void 0 ? void 0 : _b.groupId) !== currentElt.groupId)));
                    if (parentChildCondition) {
                        if (!visitedNodesIds.includes(currentNodeId)) {
                            if (!currentElt.node.parentId && currentElt.nodeisParentOfInnerGroupElt && currentElt.nodeisParentOfInnerGroupElt.length > 0) {
                                const maxOffset = [...columnsOffset.values()].reduce((prev, curr) => Math.max(prev, curr), 0);
                                this.setVerticalPositionOfGroupElt(currentElt, maxOffset === 0 ? startY + StaticAttributes_1.groupMargin : maxOffset + StaticAttributes_1.groupMargin);
                            }
                            else {
                                // check that the new position is not intersecting with any of the reserved spaces
                                let newPosY = ((_c = columnsOffset.get(currentColId)) !== null && _c !== void 0 ? _c : startY);
                                reservedSpaces.forEach(((r) => {
                                    var _a;
                                    const isNotInteresecingGuard = (newPosY < r[0] && (newPosY + this.computeNodeHeight(currentElt.node)) < (r[0])) || (newPosY > (r[1] + r[0]) && (newPosY + this.computeNodeHeight(currentElt.node)) > (r[1] + r[0]));
                                    if (!isNotInteresecingGuard) {
                                        newPosY += (r[1] + r[0] - newPosY);
                                        columnsOffset.set(currentColId, Math.max((_a = columnsOffset.get(currentColId)) !== null && _a !== void 0 ? _a : 0, newPosY + this.computeNodeHeight(currentElt.node)));
                                    }
                                }));
                                this.setVerticalPositionOfGroupElt(currentElt, newPosY + StaticAttributes_1.groupMargin);
                            }
                        }
                        if (currentElt.node.type === "CompositeNode") {
                            const innerGroupsLevel = this.placeChildElements(currentElt);
                            if (innerGroupsLevel.size > 0) {
                                innerGroupsLevel.forEach((value, innerGroup) => {
                                    const innerGroupRoots = innerGroup.goupRoots.filter((rid) => rid !== currentElt.node.id);
                                    if (innerGroup.goupRoots.includes(currentNodeId) && innerGroupRoots.length > 0) {
                                        let innerGroupStartY = value;
                                        innerGroupRoots.forEach((rid) => {
                                            var _a, _b;
                                            const siblingElt = this._swimLaneChartModel.nodes.get(rid);
                                            if (siblingElt) {
                                                this.setVerticalPositionOfGroupElt(siblingElt, currentElt.nodeVerticalOffset); // sibling should be placed at the same horizontal
                                                const siblingInnerGroupsLevel = this.placeChildElements(siblingElt);
                                                // edge case the sibling node is itself a child node > reposition it will lead to collision with the rest of children within the parent
                                                innerGroupStartY = Math.max(innerGroupStartY, ((_a = siblingInnerGroupsLevel.get(innerGroup)) !== null && _a !== void 0 ? _a : 0));
                                                siblingElt.node.height += (innerGroupStartY - ((_b = siblingInnerGroupsLevel.get(innerGroup)) !== null && _b !== void 0 ? _b : 0));
                                                visitedNodesIds.push(rid);
                                            }
                                        });
                                        this.autoLayoutGroup(innerGroup, innerGroupStartY, depth);
                                        currentElt.node.height += (innerGroupStartY - value);
                                    }
                                    else {
                                        this.autoLayoutGroup(innerGroup, value, depth);
                                    }
                                    columnsOffset.set(currentColId, currentElt.nodeVerticalOffset + this.computeNodeHeight(currentElt.node));
                                    if (innerGroup.boundingBox.h > 0)
                                        reservedSpaces.push([innerGroup.boundingBox.y - StaticAttributes_1.groupMargin, innerGroup.boundingBox.h + 2 * StaticAttributes_1.groupMargin]);
                                });
                            }
                            else
                                columnsOffset.set(currentColId, currentElt.nodeVerticalOffset + this.computeNodeHeight(currentElt.node));
                        }
                        else {
                            columnsOffset.set(currentColId, currentElt.nodeVerticalOffset + this.computeNodeHeight(currentElt.node));
                        }
                    }
                }
            }
            const max = [...columnsOffset.values()].reduce((prev, curr) => Math.max(prev, curr), startY);
            if (group.type === "inner")
                group.boundingBox = { x: 0, y: startY + StaticAttributes_1.groupMargin / 2, w: this._boundingBox.w, h: Math.max(0, (max) - startY) };
            else
                group.boundingBox = { x: 0, y: startY, w: this._boundingBox.w, h: Math.max(0, (max) - startY) };
            // the sticky transformation is not well handled in mobile environments
            if (!StaticAttributes_1.isMobileDevice)
                for (let i = 0; i < group.elements.length; i++) {
                    const v = this._swimLaneChartModel.nodes.get(group.elements[i]);
                    if (v && !v.node.parentId && !v.nodeisParentOfInnerGroupElt) {
                        if (reservedSpaces.length === 0)
                            v.colGroupVerticalOffset = ((_d = columnsOffset.get(v.columnId)) !== null && _d !== void 0 ? _d : group.boundingBox.y + group.boundingBox.h);
                        else {
                            v.colGroupVerticalOffset = 0;
                        }
                    }
                }
        }
        placeChildElements(parentElt) {
            let innerGroupsLevel = new Map();
            const parentNode = parentElt.node;
            if (parentElt.node.type !== "CompositeNode")
                return innerGroupsLevel;
            let heightSum = parentNode.bodyHeight + StaticAttributes_1.groupMargin;
            const childElements = this._swimLaneChartModel.getSwimLaneChartChildren(parentNode.id);
            const visitedGroupsIds = [];
            for (let i = 0; i < childElements.length; i++) {
                if (!childElements[i].groupId || childElements[i].groupId === parentElt.groupId) {
                    if (i > 0 && childElements[i - 1].groupId !== parentElt.groupId)
                        heightSum += StaticAttributes_1.groupMargin; // @todo:refactor
                    if (!childElements[i].node.isCollapsed && childElements[i].nodeisParentOfInnerGroupElt)
                        this.setVerticalPositionOfGroupElt(childElements[i], parentElt.nodeVerticalOffset + heightSum);
                    else
                        this.setVerticalPositionOfGroupElt(childElements[i], parentNode.position.y + heightSum);
                    if (childElements[i].node.type === "CompositeNode") {
                        parentNode.height = heightSum;
                        const innerGroups = this.placeChildElements(childElements[i]);
                        innerGroupsLevel = new Map([...innerGroupsLevel, ...innerGroups]); //maps concatenation
                    }
                    heightSum += (this.computeNodeHeight(childElements[i].node) + StaticAttributes_1.groupMargin);
                    parentElt.node.height = heightSum;
                }
                else {
                    if (i === 0 || (i > 0 && (!childElements[i - 1].groupId || (childElements[i - 1].groupId === parentElt.groupId)))) {
                        const gr = this._swimLaneChartModel.listOfGroups.find((inGr) => inGr.id === parentElt.groupId);
                        if (gr) {
                            const groupHeight = this.computeGroupHeight(gr, parentElt.node.id);
                            if (groupHeight) {
                                if (!gr.elements.includes(parentElt.node.parentId))
                                    heightSum = Math.max(heightSum, this.computeGroupHeight(gr, parentElt.node.id)); // aligned with the parentElt and not the root
                                else {
                                    const rootElt = this._swimLaneChartModel.nodes.get(parentNode.parentId);
                                    if (rootElt && rootElt.nodeVerticalOffset + groupHeight > parentElt.nodeVerticalOffset + heightSum)
                                        heightSum = Math.max(rootElt.nodeVerticalOffset + groupHeight - parentElt.nodeVerticalOffset, heightSum);
                                }
                            }
                        }
                        heightSum -= StaticAttributes_1.groupMargin; // @todo:refactor
                    }
                    const innerGroup = this._swimLaneChartModel.getInnerSwimLaneChartGroups().find((inGr) => inGr.id === childElements[i].groupId);
                    if (!innerGroup || visitedGroupsIds.includes(innerGroup.id))
                        continue;
                    innerGroupsLevel.set(innerGroup, parentElt.nodeVerticalOffset + heightSum); // innerGroupi
                    const groupHeight = this.computeGroupHeight(innerGroup);
                    if (groupHeight)
                        heightSum += (groupHeight);
                    parentElt.node.height = heightSum + StaticAttributes_1.groupMargin;
                    visitedGroupsIds.push(innerGroup.id);
                }
            }
            return innerGroupsLevel;
        }
        placeGrandChildElements(parentElt) {
            const children = this._swimLaneChartModel.getSwimLaneChartChildren(parentElt.node.id);
            children.forEach((child) => this.placeGrandChildElements(child));
            this.placeChildElements(parentElt); // intialize the height
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
                const startingY = Math.max(v.colGroupVerticalOffset - groupUnOccupiedHeight - StaticAttributes_1.groupMargin / 2 - 2 * StaticAttributes_1.gridStep, group.boundingBox.y + start - StaticAttributes_1.groupMargin / 2 - StaticAttributes_1.gridStep);
                const stickyGuard = (v.nodeVerticalOffset + nodeHeight) >= startingY;
                const minEdge = v.nodeVerticalOffset + start, maxEdge = group.boundingBox.y + end;
                if (stickyGuard && nodeshiftDelta > 0) {
                    const topOffset = 0;
                    const newVerticalOffset = this._boundingBox.y + v.nodeVerticalOffset + topOffset - startingY;
                    const newValue = Math.min(Math.max(newVerticalOffset, minEdge), maxEdge);
                    if (Math.abs(newValue - v.node.position.y) > 1) {
                        v.node.position.y = newValue;
                        this.placeChildElements(v);
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
                if (node.type === "CompositeNode" && node.isPinnable) {
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
                    if (v.node.type === "CompositeNode") {
                        this.placeChildElements(v);
                        const childNodes = this._swimLaneChartModel.getSwimLaneChartChildren(v.node.id).map((v) => v.node);
                        resetedNodes = [...resetedNodes, ...childNodes];
                    }
                    resetedNodes = [...resetedNodes, v.node];
                }
            });
            return resetedNodes;
        }
    }
    exports.LayoutManager = LayoutManager;
});
