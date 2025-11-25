/// <amd-module name="DS/DELSwimLaneChart_v2/presenter/DELSwimLaneChartPresenter"/>
define("DS/DELSwimLaneChart_v2/presenter/DELSwimLaneChartPresenter", ["require", "exports", "DS/DELSwimLaneChart_v2/utils/StaticAttributes", "DS/DELSwimLaneChart_v2/utils/LayoutUtils", "DS/DELSwimLaneChart_v2/services/presenterServices/LayoutManager", "DS/DELSwimLaneChart_v2/model/SwimLaneChartColumn"], function (require, exports, StaticAttributes_1, LayoutUtils_1, LayoutManager_1, SwimLaneChartColumn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartPresenter {
        constructor(model, view, props) {
            // attributes
            this._isRendered = false;
            this._windowBoundingBox = { x: 0, y: 0, w: 0, h: 0 };
            this._visibleNodes = [];
            this._stickyNodes = [];
            this._visibleGroups = [];
            this._transVector = [0, 0, 1];
            this._zoomCenter = null;
            this._fitToWindowScale = 1;
            // search attributes
            this._highlightedStrFindNodesIds = [];
            this._highlightedList = [];
            this._highlightIndex = 0;
            this._highlightedStrWithOccurencesIds = new Map();
            /**
         * Callback method called when the findInput value is updated
         */
            this.findStr = () => {
                this._highlightedList = []; // reset
                this._highlightIndex = 0;
                const str = this._swimLaneChartView.getFindView().findStr;
                const nodes = this._swimLaneChartModel.getSwimLaneChartNodes();
                let countTotal = 0;
                if (str.length === 0) {
                    for (let i = 0; i < this._highlightedStrFindNodesIds.length; i++) {
                        const nodeToUnhighlight = this._swimLaneChartModel.getSwimLaneChartNodeById(this._highlightedStrFindNodesIds[i]);
                        if (nodeToUnhighlight)
                            this._swimLaneChartView.unHighlightMatchingStringInNode(nodeToUnhighlight);
                    }
                    this._highlightedStrFindNodesIds = []; // reset 
                    this._swimLaneChartView.reRender([
                        { type: "update", payload: [...this._visibleNodes] }
                    ]);
                    this._swimLaneChartView.getFindView().count = 0;
                }
                // valid search string
                for (let i = 0; i < nodes.length; i++) {
                    const res = nodes[i].findStr(str);
                    if (res.count > 0) {
                        this._swimLaneChartView.highlightMatchingStringInNode(nodes[i], str, res);
                        countTotal += res.count;
                        if (!this._highlightedStrFindNodesIds.includes(nodes[i].id)) {
                            this._highlightedStrFindNodesIds.push(nodes[i].id);
                            this._highlightedStrWithOccurencesIds.set(nodes[i].id, res.count);
                        }
                    }
                    else {
                        if (this._highlightedStrFindNodesIds.includes(nodes[i].id)) {
                            this._swimLaneChartView.unHighlightMatchingStringInNode(nodes[i]);
                            this._highlightedStrFindNodesIds = this._highlightedStrFindNodesIds.filter((id) => id !== nodes[i].id);
                            this._highlightedStrWithOccurencesIds.delete(nodes[i].id);
                        }
                    }
                }
                // sort
                this._highlightedStrFindNodesIds.sort((currId, nextId) => {
                    const currNode = this._swimLaneChartModel.nodes.get(currId);
                    const nextNode = this._swimLaneChartModel.nodes.get(nextId);
                    if (!currNode || !nextNode)
                        return 0;
                    return ((currNode === null || currNode === void 0 ? void 0 : currNode.node.position.y) - (nextNode === null || nextNode === void 0 ? void 0 : nextNode.node.position.y));
                });
                this._swimLaneChartView.getFindView().count = countTotal;
                this._swimLaneChartView.getFindView().currentValue = 0;
                this._highlightedStrFindNodesIds.forEach((id) => {
                    const count = this._highlightedStrWithOccurencesIds.get(id);
                    if (count) {
                        for (let i = 0; i < count; i++) {
                            this._highlightedList.push(id);
                        }
                    }
                });
                this._swimLaneChartView.reRender([
                    { type: "update", payload: [...this._visibleNodes] }
                ]);
            };
            /**
             * Callback method called when to navigae=te between the search found results
             */
            this.scrollToResult = () => {
                var _a, _b, _c;
                this._highlightIndex = this._swimLaneChartView.getFindView().currentValue - 1;
                const currentVisibleNodesIds = this._visibleNodes.map((n) => n.id);
                const nodeToHighlightId = this._highlightedList[this._highlightIndex];
                if (!currentVisibleNodesIds.includes(nodeToHighlightId)) {
                    const node = this._swimLaneChartModel.nodes.get(nodeToHighlightId);
                    if (!node)
                        return;
                    this.scrollIntoNode(node.node.id);
                }
                const view = document.getElementById("node__" + nodeToHighlightId);
                const markElements = view === null || view === void 0 ? void 0 : view.getElementsByTagName("mark"); // header > location
                const index = this._highlightedList.indexOf(nodeToHighlightId);
                if (markElements && markElements.length > 0) {
                    // remove the previous marker
                    const previousMakers = document.querySelectorAll(".current_mark");
                    for (let i = 0; i < previousMakers.length; i++) {
                        (_a = previousMakers[i]) === null || _a === void 0 ? void 0 : _a.classList.remove("current_mark");
                    }
                    (_b = markElements[this._highlightIndex - index]) === null || _b === void 0 ? void 0 : _b.classList.add("current_mark");
                    // add a condition?
                    (_c = markElements[this._highlightIndex - index]) === null || _c === void 0 ? void 0 : _c.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                }
            };
            this._swimLaneChartModel = model;
            this._swimLaneChartView = view;
            this._props = props;
            this._layoutManager = new LayoutManager_1.LayoutManager(model);
        }
        get props() {
            return this._props;
        }
        get isRendered() {
            return this._isRendered;
        }
        /**
         * Setter method to update the isRendered flag and execute actions depending on its value
         * @param {boolean}
         */
        set isRendered(isRendered) {
            if (this._isRendered === isRendered)
                return;
            if (!this._isRendered) {
                this.renderModel();
            }
            else {
                this._visibleNodes = [];
                this._stickyNodes = [];
                this._visibleGroups = [];
                this._fitToWindowScale = 1;
                // find related attributes
                for (let i = 0; i < this._highlightedStrFindNodesIds.length; i++) {
                    const nodeToUnhighlight = this._swimLaneChartModel.getSwimLaneChartNodeById(this._highlightedStrFindNodesIds[i]);
                    if (nodeToUnhighlight)
                        this._swimLaneChartView.unHighlightMatchingStringInNode(nodeToUnhighlight);
                }
                this._highlightedStrFindNodesIds = [];
                this._highlightedList = [];
                this._highlightIndex = 0;
                this._highlightedStrWithOccurencesIds = new Map();
                this.refreshView();
            }
            this._isRendered = isRendered;
        }
        get windowBoundingBox() {
            return this._windowBoundingBox;
        }
        /**
         * Setter method to update the windowBoundingBox of the swimLaneChart
         * @param {boundingBoxType} newBd
         */
        set windowBoundingBox(newBd) {
            if (newBd.w === 0 || newBd.h === 0 || this._transVector[2] !== 1)
                return;
            this._layoutManager.boundingBox = newBd;
            if (this._windowBoundingBox.w !== newBd.w)
                this.handleHorizontalResize();
            if (this._windowBoundingBox.h !== newBd.h)
                this.checkScrollbars();
            this._windowBoundingBox = newBd;
            this.updateVisibleElts();
        }
        /**
         * Setter method to update the transformation vector (responsible for zoom in/out, fit to window)
         * @param {transformationVectorType}
         */
        set transVector(newTransVector) {
            // handle the view
            const gridContainer = this._swimLaneChartView.getGridContainer();
            const headerLayer = this._swimLaneChartView.getHeader();
            if (gridContainer && headerLayer) {
                if (newTransVector[2] === 1 && (this._transVector[0] !== 0 || this._transVector[1] !== 0)) {
                    this.resetZoom();
                }
                else if (newTransVector[2] > 1) {
                    headerLayer.style.transform = `translate(${newTransVector[0]}px,${(newTransVector[1])}px) scale(${newTransVector[2]})`;
                    gridContainer.style.transform = `translate(${newTransVector[0]}px,${(newTransVector[1])}px) scale(${newTransVector[2]})`;
                }
            }
            this._transVector = newTransVector;
        }
        /**
         * Setter method to update the swimLaneChart Model
         * @param {chartModel}
         */
        set model(model) {
            var _a;
            this._props = { ...this._props, model: model };
            this.resetPresenter();
            if ((_a = this._props.model) === null || _a === void 0 ? void 0 : _a.columns) {
                this._swimLaneChartModel.loadSwimLaneChartModel(this._props.model.columns, this._props.model.groups);
                this._swimLaneChartModel.reorderModel();
                this._layoutManager.autoLayoutModel();
            }
            if (this._isRendered)
                this.renderModel();
        }
        /**
         * Method to render the current data model (called when the component is added to the dom or when a new model is loaded)
         */
        renderModel() {
            this.updateHeight();
            this._swimLaneChartView.reRender([
                { type: "create", payload: [...this._swimLaneChartModel.columns, ...this._visibleNodes, ...this._visibleGroups] }
            ]);
        }
        /**
         * Method to compute and update the visible elements upon a viewport transformation (scroll, fitToWindow)
         */
        updateVisibleElts() {
            const visibleElts = this._layoutManager.getVisibleElts();
            if (this._highlightedList.length >= 0) {
                const node = this._swimLaneChartModel.nodes.get(this._highlightedList[this._highlightIndex]);
                if (node && !node.node.isHidden) {
                    if (node.node.parentId) { // to fix the issue shown in the demo MGA (the parent element once visible will be inserted after the child leading to the invisible child element but do we need recursivity?)
                        const parentNode = this._swimLaneChartModel.nodes.get(node.node.parentId);
                        if (parentNode)
                            visibleElts.nodes.push(parentNode);
                        visibleElts.nodes.push(node);
                    }
                    else {
                        visibleElts.nodes.push(node);
                    }
                }
            }
            // nodes
            const currentVisibleNodesIds = this._visibleNodes.map((n) => n.id);
            const newVisibleNodesIds = visibleElts.nodes.map((n) => n.node.id);
            const oldVisibleNodes = visibleElts.nodes.filter((n) => currentVisibleNodesIds.includes(n.node.id)).map((v) => v.node);
            const newVisibleNodes = visibleElts.nodes.filter((n) => !currentVisibleNodesIds.includes(n.node.id)).map((v) => v.node);
            const inVisibleNodes = this._visibleNodes.filter((n) => !newVisibleNodesIds.includes(n.id));
            // groups
            const currentVisibleGroupsIds = this._visibleGroups.map((gr) => gr.id);
            const newVisibleGroupsIds = visibleElts.groups.map((gr) => gr.id);
            const newVisibleGroups = visibleElts.groups.filter((gr) => !currentVisibleGroupsIds.includes(gr.id));
            const inVisibleGroups = this._visibleGroups.filter((gr) => !newVisibleGroupsIds.includes(gr.id));
            this._visibleNodes = visibleElts.nodes.map((v) => v.node);
            this._visibleGroups = visibleElts.groups;
            if (this._transVector[2] === 1 && this._fitToWindowScale === 1) {
                let newStickyNodes = [];
                visibleElts.groups.forEach((vgr) => {
                    const stickyElts = this._layoutManager.applyStickyTransformation(vgr);
                    newStickyNodes = [...newStickyNodes, ...stickyElts];
                });
                this._stickyNodes = newStickyNodes;
                this._layoutManager.pinCompositeNodeHeader(this._visibleNodes);
            }
            else {
                this._layoutManager.unPinCompositeNodeHeader();
            }
            // parent-child constraint
            const childVisibleNodes = [];
            newVisibleNodes.forEach((n) => {
                if (n.type === "CompositeNode") {
                    const childElts = this._swimLaneChartModel.getSwimLaneChartChildren(n.id);
                    childElts.forEach((child) => {
                        if (currentVisibleNodesIds.includes(child.node.id) && newVisibleNodesIds.includes(child.node.id)) {
                            inVisibleNodes.push(child.node);
                            childVisibleNodes.push(child.node);
                        }
                    });
                }
            });
            this._swimLaneChartView.reRender([
                { type: "delete", payload: [...inVisibleNodes, ...inVisibleGroups] },
                { type: "create", payload: [...newVisibleNodes, ...childVisibleNodes, ...newVisibleGroups] },
                { type: "pin", payload: [...oldVisibleNodes] },
            ]);
        }
        /**
         * Method to refresh the view if the model is already rendered (to make sure that the view is scrollbars if we detached the component from the dom and rettached it e.g visibility toggle, docking/undocking)
         */
        refreshView() {
            const swimLanechartHeight = this._layoutManager.getSwimLaneChartHeight();
            this._swimLaneChartView.updateGridHeight(swimLanechartHeight);
        }
        /**
         * Method to check if the Scrollbars are displayed (to reserve space in the grid and hence avoid blanck spaces or non-necessary horizontal scrollbars)
         */
        checkScrollbars() {
            // if (this._windowBoundingBox.w <= 800) return;
            const hasScrollbar = this._swimLaneChartView.checkScrollbars();
            if (hasScrollbar)
                this._layoutManager.rightOffset = 18;
            else
                this._layoutManager.rightOffset = 0;
            const swimLanechartWidth = this._layoutManager.getSwimLaneChartWidth();
            this._swimLaneChartView.updateGridWidth(swimLanechartWidth);
            this.updateHeight();
            this._swimLaneChartView.reRender([
                { type: "update", payload: [...this._swimLaneChartModel.columns, ...this._visibleNodes, ...this._visibleGroups] }
            ]);
        }
        /**
         * Callback method passed to the resize observer
         */
        handleResizeObserver() {
            if (this._fitToWindowScale !== 1 || this._transVector[2] !== 1 || this._swimLaneChartModel.columns.length === 0 || this._swimLaneChartModel.nodes.size === 0)
                return;
            const gridContainer = this._swimLaneChartView.getGridContainer();
            const parentContainer = this._swimLaneChartView.getRootContainer();
            if (!gridContainer || !parentContainer)
                return;
            const targetBd = parentContainer.getBoundingClientRect();
            const gridContainertop = gridContainer.getBoundingClientRect().top;
            this.windowBoundingBox = { y: (targetBd.top - gridContainertop), x: targetBd.left, w: targetBd.width, h: targetBd.height };
            this._windowBoundingBox.y = gridContainertop;
            this.checkScrollbars();
        }
        /**
         * Method to handle horizontal resize after a resize event
         */
        handleHorizontalResize() {
            const swimLanechartWidth = this._layoutManager.getSwimLaneChartWidth();
            this._swimLaneChartView.updateGridWidth(swimLanechartWidth);
            this.updateHeight();
            this._swimLaneChartView.reRender([
                { type: "update", payload: [...this._swimLaneChartModel.columns, ...this._visibleNodes, ...this._visibleGroups] }
            ]);
        }
        /**
         * Method to handle scroll event
         */
        handleScroll() {
            this.unHighlightNodes();
            const gridContainer = this._swimLaneChartView.getGridContainer();
            const parentContainer = this._swimLaneChartView.getParentContainer();
            if (!gridContainer || !parentContainer)
                return;
            const parentContainertop = parentContainer.getBoundingClientRect().top;
            const gridContainertop = gridContainer.getBoundingClientRect().top;
            this._layoutManager.boundingBox = { ...this._windowBoundingBox, y: (parentContainertop - gridContainertop) / this._transVector[2] };
            this.updateVisibleElts();
            if (this._transVector[2] !== 1)
                return;
            this._windowBoundingBox = { ...this._windowBoundingBox, y: gridContainertop };
        }
        /**
         * Method to handle wheel event
         * @param {Event} e
         * @returns
        */
        handleWheelAction(e) {
            var _a;
            if (!(e instanceof WheelEvent))
                return;
            e.stopPropagation();
            if (e.ctrlKey) {
                e.preventDefault();
                if (!this._zoomCenter) { // zoom start
                    this._zoomCenter = { x: e.clientX, y: e.clientY };
                    this.resetPinTransformation();
                }
                const parentContainer = this._swimLaneChartView.getParentContainer();
                const bd = parentContainer === null || parentContainer === void 0 ? void 0 : parentContainer.getBoundingClientRect();
                this.transVector = (0, LayoutUtils_1.handleZoom)({
                    clientX: this._zoomCenter.x / (this._fitToWindowScale), clientY: this._zoomCenter.y / (this._fitToWindowScale),
                    deltaY: e.deltaY
                }, [this._transVector[0], this._transVector[1], this._transVector[2]], [((_a = bd === null || bd === void 0 ? void 0 : bd.left) !== null && _a !== void 0 ? _a : 0) / this._fitToWindowScale, (this._windowBoundingBox.y) / this._fitToWindowScale]);
                this.handleScroll();
            }
        }
        /**
         * Method to handle pointer down event
         * @param {Event} e
         * @returns
         */
        handlePointerDown(e) {
            var _a, _b, _c;
            const [type, nodeId] = (_c = (_b = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.split("__")) !== null && _c !== void 0 ? _c : [];
            // deSelection
            const selectedElts = this._swimLaneChartModel.getSelectedSwimLaneChartNodes();
            selectedElts.forEach((elt) => {
                elt.unSelect();
                if (this._props.onNodeUnSelect)
                    this._props.onNodeUnSelect(elt);
            });
            this._swimLaneChartView.reRender([
                { type: "update", payload: [...selectedElts] }
            ]);
            if (["columnSeparatorGroup", "columnHeader", "columnHeaderText", "columnSeparatorContainer"].includes(type)) {
                return;
            }
            //selection
            let targetElt;
            if (nodeId)
                targetElt = this._swimLaneChartModel.getSwimLaneChartNodeById(nodeId);
            else {
                const intersectionNode = this._layoutManager.checkPositionIntersectionWithObject((0, LayoutUtils_1.normalizePosition)({ x: e.clientX, y: e.clientY }, this._transVector, [this._windowBoundingBox.x, this._windowBoundingBox.y]), this._visibleNodes);
                if (intersectionNode) {
                    targetElt = intersectionNode;
                }
            }
            if (!targetElt)
                return;
            if (nodeId)
                e.preventDefault();
            // expand/collapse
            if (e.target.id.split("__")[0] === "headerCollapsibleIcon") {
                if (targetElt.isCollapsed)
                    this.expand(nodeId);
                else
                    this.collapse(nodeId);
            }
            this._swimLaneChartModel.selectSwimLaneChartNode(targetElt.id);
            if (this._props.onNodeSelect)
                this._props.onNodeSelect(targetElt);
            this._swimLaneChartView.reRender([
                { type: "update", payload: [targetElt] }
            ]);
        }
        /**
         * Method to handle double click event
         * @param {Event} e
         * @returns
         */
        handleDblClick(e) {
            var _a, _b, _c, _d, _e;
            e.preventDefault();
            // call the notifier 
            const [type, id] = (_b = (_a = e.target.id) === null || _a === void 0 ? void 0 : _a.split("__")) !== null && _b !== void 0 ? _b : [];
            const [parenttype, nodeId] = (_e = (_d = (_c = e.target.parentElement) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.split("__")) !== null && _e !== void 0 ? _e : [];
            if (["columnSeparatorGroup", "columnHeader", "columnHeaderText", "columnSeparatorContainer"].includes(type)) {
                e.preventDefault();
                return;
            }
            let targetElt;
            if (nodeId)
                targetElt = this._swimLaneChartModel.getSwimLaneChartNodeById(nodeId);
            else {
                const intersectionNode = this._layoutManager.checkPositionIntersectionWithObject((0, LayoutUtils_1.normalizePosition)({ x: e.clientX, y: e.clientY }, this._transVector, [this._windowBoundingBox.x, this._windowBoundingBox.y]), this._visibleNodes);
                if (intersectionNode) {
                    targetElt = intersectionNode;
                }
            }
            if (!targetElt)
                return;
            if ((!targetElt.isCollapsible || (targetElt.type !== "CompositeNode" && !targetElt.content.childElement && !targetElt.content.text && !targetElt.content.fragmentElement))) {
                if (this._props.onNodeDblSelect)
                    this._props.onNodeDblSelect(targetElt);
                return;
            }
            //collapse/minimize
            if (type === "nodeHeaderResponsiveText" || type === "nodeHeader" || type === "nodeHeaderText" || type === "headerLeftIcon" || type === "headerRightIcon") {
                if (targetElt.isCollapsed)
                    this.expand(nodeId);
                else
                    this.collapse(nodeId);
            }
            else if (this._props.onNodeDblSelect)
                this._props.onNodeDblSelect(targetElt);
        }
        /**
         * Method to handle pointer over event
         * @param {Event} e
         * @returns
         */
        handlePointerOver(e) {
            var _a, _b, _c;
            e.preventDefault();
            const [type, nodeId] = (_c = (_b = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.split("__")) !== null && _c !== void 0 ? _c : [];
            const targetElt = this._swimLaneChartModel.getSwimLaneChartNodeById(nodeId);
            if (!targetElt || targetElt.highlighted)
                return;
            if (!["node", "childElement", "nodeHeaderGroup", "foreignNode", "bodyTextContent", "nodeHeaderText"].includes(type))
                return;
            const highlightedElements = this._swimLaneChartModel.getHighlightedSwimLaneChartNodes();
            highlightedElements.forEach((elt) => {
                elt.unHighlight();
                if (this._props.onNodeUnHighlight)
                    this._props.onNodeUnHighlight(elt);
            });
            targetElt.highlight();
            if (this._props.onNodeHighlight)
                this._props.onNodeHighlight(targetElt);
            this._swimLaneChartView.reRender([
                { type: "update", payload: [targetElt, ...highlightedElements] }
            ]);
        }
        /**
         * Method to handle pointer out event
         * @param {Event} e
         * @returns
         */
        handlePointerOut(e) {
            e.preventDefault();
            this.unHighlightNodes();
        }
        /**
         * Method to get the target element of the contextual menu event
         * @param {HTMLElement} target element
         * @returns
         */
        getOnContextMenuTarget(targetElement, position) {
            var _a, _b, _c, _d;
            const [type, nodeId] = (_c = (_b = (_a = targetElement.parentElement) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.split("__")) !== null && _c !== void 0 ? _c : [];
            let targetElt = null;
            if (["columnSeparatorGroup", "columnHeader", "columnHeaderText", "columnSeparatorContainer"].includes(type)) {
                return null;
            }
            if (nodeId)
                targetElt = (_d = this._swimLaneChartModel.getSwimLaneChartNodeById(nodeId)) !== null && _d !== void 0 ? _d : null;
            else {
                const intersectionNode = this._layoutManager.checkPositionIntersectionWithObject((0, LayoutUtils_1.normalizePosition)({ x: position.x, y: position.y }, this._transVector, [this._windowBoundingBox.x, this._windowBoundingBox.y]), this._visibleNodes);
                if (intersectionNode) {
                    targetElt = intersectionNode;
                }
            }
            return targetElt;
        }
        /**
         * Method to trigger a scroll into a node
         * @param {string} nodeId the node id
         * @returns
         */
        scrollIntoNode(nodeId) {
            const eltIsExisting = document.getElementById("node__" + nodeId);
            if (eltIsExisting)
                return; // no need to scroll
            const node = this._swimLaneChartModel.getSwimLaneChartNodeById(nodeId);
            if (!node || node.isHidden)
                return;
            this.windowBoundingBox = { ...this._windowBoundingBox, y: node.position.y - this._windowBoundingBox.h / 2 };
            const elt = document.getElementById("node__" + nodeId);
            elt === null || elt === void 0 ? void 0 : elt.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        }
        /****CRUDS operations */
        /**
         * Method to get all the swimlanechart nodes
         * @returns list of swimlane nodes
         */
        getAllNodes() {
            return this._swimLaneChartModel.getSwimLaneChartNodes();
        }
        /**
         * Method to get a node by id
         * @param id the node id
         * @returns the swimlane node
         */
        getNodeById(id) {
            var _a;
            return (_a = this._swimLaneChartModel.getSwimLaneChartNodeById(id)) !== null && _a !== void 0 ? _a : null;
        }
        /**
         * Method to get all selected nodes
         * @returns the swimlane selected nodes
         */
        getSelectedNodes() {
            const selectedNodes = this._swimLaneChartModel.getSelectedSwimLaneChartNodes();
            return selectedNodes;
        }
        /**
         * Method to create a swimlane column
         * @param {chartColumnType} props
         * @returns
         */
        createColumn(props) {
            const newColumn = this._swimLaneChartModel.createSwimLaneChartColumn(props);
            this._swimLaneChartModel.reorderModel();
            if (!newColumn)
                return;
            this._layoutManager.autoLayoutModel();
            this.updateVisibleElts();
            const swimLanechartHeight = this._layoutManager.getSwimLaneChartHeight();
            this._swimLaneChartView.updateGridHeight(swimLanechartHeight);
            this._swimLaneChartView.reRender([
                { type: "create", payload: [newColumn] },
                { type: "update", payload: [...this._swimLaneChartModel.columns.filter((col) => col.id !== props.id)] }
            ]);
        }
        /**
         * Method to create a swimlane node
         * @param {chartNodeType & { columnId: string; columnIndex?: number; }} props
         */
        createNode(props) {
            this._swimLaneChartModel.createSwimLaneChartNode(props);
            this._swimLaneChartModel.reorderModel();
            this._layoutManager.autoLayoutModel(); // avoid unnecessary calls?
            this.updateHeight();
        }
        /**
         * Method to update a swimlane column
         * @param {chartColumnType} props
         * @returns
         */
        updateColumn(props) {
            const columnToUpdate = this._swimLaneChartModel.updateSwimLaneChartColumn(props);
            this._swimLaneChartModel.reorderModel();
            if (!columnToUpdate)
                return;
            this._layoutManager.autoLayoutModel();
            if (this._layoutManager.boundingBox.y > 0)
                this.handleScroll();
            this.updateVisibleElts();
            const swimLanechartHeight = this._layoutManager.getSwimLaneChartHeight();
            this._swimLaneChartView.updateGridHeight(swimLanechartHeight);
            this._swimLaneChartView.reRender([
                { type: "update", payload: [...this._swimLaneChartModel.columns, ...this._visibleGroups, ...this._visibleNodes] },
            ]);
        }
        updateGroup(props) {
            this._swimLaneChartModel.updateSwimLaneChartGroup(props);
            if (props.elements)
                this.updateHeight();
            else
                this._swimLaneChartView.reRender([
                    { type: "update", payload: this._visibleGroups.filter((vgr) => vgr.id === props.id) },
                ]);
        }
        /**
         * Method to update a swimlane node
         * @param {chartNodeType} props
         * @returns
         */
        updateNode(props) {
            const value = this._swimLaneChartModel.nodes.get(props.id);
            if (!value)
                return;
            const node = value.node;
            const oldParentId = node.parentId;
            const oldHeight = node.height;
            const oldGroupId = value.groupId;
            this._swimLaneChartModel.updateSwimLaneChartNode(props);
            if (node.parentId !== oldParentId) {
                const oldParent = this._swimLaneChartModel.nodes.get(oldParentId);
                if (oldParent)
                    this._layoutManager.placeChildElements(oldParent);
                const newParent = this._swimLaneChartModel.nodes.get(node.parentId);
                if (newParent) {
                    newParent.node.type = "CompositeNode";
                    this._layoutManager.placeChildElements(newParent);
                }
                if (!oldParentId)
                    this._layoutManager.updateModelWidth(); // child inside the parent (width less)
            }
            if (oldHeight !== node.height || node.parentId !== oldParentId || props.groupId !== oldGroupId) {
                this.updateHeight();
            }
            this._swimLaneChartView.reRender([
                { type: "update", payload: [node, ...this._visibleNodes, ...this._visibleGroups] }
            ]);
        }
        setGroupsOrder(newOrder) {
            this._swimLaneChartModel.setGroupsOrder(newOrder);
            this.updateHeight();
        }
        /**
         * Method to delete a column by id
         * @param {string} id column id
         */
        deleteColumn(id) {
            this._swimLaneChartModel.deleteSwimLaneChartColumn(id);
            this._layoutManager.autoLayoutModel();
            this.updateVisibleElts();
            const swimLanechartHeight = this._layoutManager.getSwimLaneChartHeight();
            this._swimLaneChartView.updateGridHeight(swimLanechartHeight);
            this._swimLaneChartView.reRender([
                { type: "delete", payload: [new SwimLaneChartColumn_1.default(id, "", 0, 0, 0)] },
                { type: "update", payload: [...this._swimLaneChartModel.columns, ...this._visibleNodes] }
            ]);
        }
        /**
         * Method to delete a group by id
         * @param {string} id group id
         */
        deleteGroup(id) {
            this._swimLaneChartModel.deleteSwimLaneChartGroup(id);
            this._layoutManager.autoLayoutModel();
            this.updateHeight();
        }
        /**
         * Method to delete a node by id
         * @param {string} id node id
         */
        deleteNode(id) {
            this._swimLaneChartModel.deleteSwimLaneChartNode(id);
            this._swimLaneChartModel.deleteEmptyGroups();
            this.updateHeight();
            this._swimLaneChartView.reRender([
                { type: "update", payload: [...this._visibleNodes, ...this._visibleGroups] }
            ]);
        }
        /**
         * Method to highlight a node by id
         * @param {string} id node id
         */
        highlightNode(nodeId) {
            const node = this._swimLaneChartModel.highlightSwimLaneChartNode(nodeId);
            this._swimLaneChartView.reRender([
                { type: "update", payload: [node] }
            ]);
        }
        /**
         * Method to unhighlight a node by id
         * @param {string} id node id
         */
        unHighlightNode(nodeId) {
            const node = this._swimLaneChartModel.unHighlightSwimLaneChartNode(nodeId);
            this._swimLaneChartView.reRender([
                { type: "update", payload: [node] }
            ]);
        }
        /**
         * Method to unhighlight all highlighted nodes
         * @param
         */
        unHighlightNodes() {
            const highlightedElements = this._swimLaneChartModel.getHighlightedSwimLaneChartNodes();
            if (highlightedElements.length === 0)
                return;
            highlightedElements.forEach((elt) => {
                elt.unHighlight();
                if (this._props.onNodeUnHighlight)
                    this._props.onNodeUnHighlight(elt);
            });
            this._swimLaneChartView.reRender([
                { type: "update", payload: highlightedElements }
            ]);
        }
        /**
         * Method to select a node by id
         * @param {string} id node id
         * @param  {boolean} shouldScrollFlag optional flag to scroll into node
         */
        selectNode(nodeId, shouldScrollFlag = true) {
            const node = this._swimLaneChartModel.selectSwimLaneChartNode(nodeId);
            if (!node)
                return;
            this._swimLaneChartView.reRender([
                { type: "update", payload: [node] }
            ]);
            if (shouldScrollFlag)
                this.scrollIntoNode(node.id);
        }
        /**
         * Method to select multiple nodes
         * @param {string[]} nodesIds list of nodes ids
         */
        selectNodes(nodesIds) {
            nodesIds.forEach((nodeId) => this._swimLaneChartModel.selectSwimLaneChartNode(nodeId));
            this._swimLaneChartView.reRender([
                { type: "update", payload: this._visibleNodes }
            ]);
        }
        /**
         * Method to select all swimlane nodes
         */
        selectAllNodes() {
            [...this._swimLaneChartModel.nodes.values()].map((v) => v.node.select());
            this._swimLaneChartView.reRender([
                { type: "update", payload: this._visibleNodes }
            ]);
        }
        /**
         * Method to unselect a node by id
         * @param {string} nodeId  node id
         */
        unSelectNode(nodeId) {
            const node = this._swimLaneChartModel.unSelectSwimLaneChartNode(nodeId);
            this._swimLaneChartView.reRender([
                { type: "update", payload: [node] }
            ]);
        }
        /**
         * Method to unselect multiple nodes
         * @param {string[]} nodesIds list of nodes ids
         */
        unSelectNodes(nodesIds) {
            nodesIds.forEach((nodeId) => this._swimLaneChartModel.unSelectSwimLaneChartNode(nodeId));
            this._swimLaneChartView.reRender([
                { type: "update", payload: this._visibleNodes }
            ]);
        }
        /**
         * Method to unselect all swimlane nodes
         */
        unSelectAllNodes() {
            [...this._swimLaneChartModel.nodes.values()].map((v) => v.node.unSelect());
            this._swimLaneChartView.reRender([
                { type: "update", payload: this._visibleNodes }
            ]);
        }
        /**
         * Method to minimize a node by id
         * @param id node id
         */
        minimize(id) {
            this._swimLaneChartModel.minimizeSwimLaneChartNode(id);
            this.updateHeight();
            this.checkScrollbars();
        }
        /**
         * Method to minimize a node by id
         * @param id node id
        */
        collapse(id) {
            this._swimLaneChartModel.collapseSwimLaneChartNode(id);
            this.updateHeight();
            this.checkScrollbars();
        }
        /**
         * Method to minimize all swimlane nodes
         */
        minimizeAll() {
            this._swimLaneChartModel.getSwimLaneChartNodes().forEach((n) => this._swimLaneChartModel.minimizeSwimLaneChartNode(n.id));
            if (this._transVector[2] === 1 && this._fitToWindowScale === 1) {
                this.resetStickyTransformation();
                this._swimLaneChartView.resetScrollbar();
            }
            this.updateHeight();
            this.checkScrollbars();
        }
        /**
         * Method to collapse all swimlane nodes
         */
        collapseAll(id) {
            if (id) {
                this._swimLaneChartModel.collapseSwimLaneChartNode(id, true);
            }
            else {
                if (this._transVector[2] === 1 && this._fitToWindowScale === 1) {
                    this.resetStickyTransformation();
                    this._swimLaneChartView.resetScrollbar();
                }
                this._swimLaneChartModel.getSwimLaneChartNodes().forEach((n) => {
                    const shouldBeCollapsed = !n.isCollapsed && !n.isHidden && !n.parentId && n.header && n.header.height && n.height > n.header.height;
                    if (shouldBeCollapsed)
                        this._swimLaneChartModel.collapseSwimLaneChartNode(n.id);
                });
            }
            this.updateHeight();
            this.checkScrollbars();
        }
        /**
         * Method to maximize a minimized node by id
         * @param id node id
         */
        maximize(id) {
            this._swimLaneChartModel.maximizeSwimLaneChartNode(id);
            this.updateHeight();
        }
        /**
         * Method to expand a collapsed node by id
         * @param id node id
         */
        expand(id) {
            this._swimLaneChartModel.expandSwimLaneChartNode(id);
            this.updateHeight();
            this.checkScrollbars();
        }
        /**
         * Method to maximize all swimlane nodes
         */
        maximizeAll() {
            this._swimLaneChartModel.getSwimLaneChartNodes().forEach((n) => this._swimLaneChartModel.maximizeSwimLaneChartNode(n.id));
            if (this._transVector[2] === 1 && this._fitToWindowScale === 1) {
                this.resetStickyTransformation();
                this._swimLaneChartView.resetScrollbar();
            }
            this.updateHeight();
        }
        /**
         * Method to collapse all swimlane nodes
         */
        expandAll(id) {
            if (id) {
                this._swimLaneChartModel.expandSwimLaneChartNode(id, true);
            }
            else {
                if (this._transVector[2] === 1 && this._fitToWindowScale === 1) {
                    this.resetStickyTransformation();
                    this._swimLaneChartView.resetScrollbar();
                }
                this._swimLaneChartModel.getSwimLaneChartNodes().forEach((n) => {
                    if (n.isCollapsed && !n.isHidden) {
                        this._swimLaneChartModel.expandSwimLaneChartNode(n.id, false);
                    }
                });
            }
            this.updateHeight();
            this.checkScrollbars();
        }
        /**
         * Method to update the swimlane occupied height (to show/hide the scrollbars)
         * @param {number} top the viewport top level from which we should re-compute the height of the elements
         */
        updateHeight(top = 0) {
            this._layoutManager.updateModelHeight(top);
            const swimLanechartHeight = this._layoutManager.getSwimLaneChartHeight();
            this._swimLaneChartView.updateGridHeight(swimLanechartHeight);
            this.updateVisibleElts();
            this._swimLaneChartView.reRender([
                { type: "update", payload: [...this._swimLaneChartModel.columns, ...this._visibleNodes, ...this._stickyNodes, ...this._visibleGroups] }
            ]);
        }
        /**
         * UX Method to fit the swimlane to the current window height
         * @returns
         */
        fitToWindowHeight() {
            if (this._fitToWindowScale !== 1)
                return;
            if (this._transVector[2] !== 1)
                this.resetZoom();
            if (this._swimLaneChartModel.getSwimLaneChartNodes().length > 0) {
                const parentContainer = this._swimLaneChartView.getParentContainer();
                const bdElts = { x: this._windowBoundingBox.x, y: 0, w: this._layoutManager.getSwimLaneChartWidth(), h: this._layoutManager.getSwimLaneChartHeight() };
                const t2 = Math.min(this._windowBoundingBox.h / (bdElts.h), 1);
                if (parentContainer && t2 !== 1) {
                    this.resetScroll();
                    this._fitToWindowScale = t2;
                    this.windowBoundingBox = { ...this._windowBoundingBox, y: 0, h: this._layoutManager.getSwimLaneChartHeight() };
                    parentContainer.style.overflow = "hidden";
                    parentContainer.style.transform = `translate(${0}px,${this._windowBoundingBox.y}px) scale(${t2})`;
                    parentContainer.style.height = this._layoutManager.getSwimLaneChartHeight() + 2 * StaticAttributes_1.gridStep + "px";
                    parentContainer.style.maxHeight = "none";
                    const topLayer = document.querySelector(".top-layer");
                    if (topLayer)
                        topLayer.innerHTML = "";
                }
            }
        }
        /**
         * Method to reset all transformations applied to the swimlane (zoom in/out or fit to window)
         * @returns
         */
        resetTransformation() {
            if (this._transVector[2] === 1 && this._fitToWindowScale === 1)
                return;
            const parentContainer = this._swimLaneChartView.getParentContainer();
            if (!parentContainer)
                return;
            parentContainer.style.overflow = "auto";
            parentContainer.style.transform = ``;
            parentContainer.style.maxHeight = "100vh";
            parentContainer.style.width = "100%";
            parentContainer.style.height = "100%";
            this.windowBoundingBox = { ...this._windowBoundingBox, y: parentContainer.getBoundingClientRect().top, h: this._layoutManager.getSwimLaneChartHeight() * this._fitToWindowScale };
            this.checkScrollbars();
            this.resetZoom();
            this._fitToWindowScale = 1;
        }
        /**
         * Method to reset the special transformation applied to keep the nodes sticky while scrolling
         */
        resetStickyTransformation() {
            const resetedNodes = this._layoutManager.resetStickyTransformation();
            this._swimLaneChartView.reRender([
                { type: "pin", payload: [...resetedNodes] }
            ]);
        }
        /**
         * Method to reset the special transformation applied to pin the nodes header while scrolling
         */
        resetPinTransformation() {
            const resetedNodes = this._layoutManager.unPinCompositeNodeHeader();
            this._swimLaneChartView.reRender([
                { type: "pin", payload: [...resetedNodes] }
            ]);
        }
        /**
         * Method to reset the zoom
         * @returns
         */
        resetZoom() {
            const gridContainer = this._swimLaneChartView.getGridContainer();
            const headerLayer = this._swimLaneChartView.getHeader();
            if (!gridContainer || !headerLayer)
                return;
            this._transVector = [0, 0, 1];
            this._zoomCenter = null;
            headerLayer.style.transform = ``;
            gridContainer.style.transform = ``;
        }
        /**
         * Method to reset the scroll (return to top of the viewport)
         */
        resetScroll() {
            this._swimLaneChartView.resetScrollbar();
            this.handleScroll();
        }
        /**
        * Method to reset the presenter local attributes (after loading new model)
        */
        resetPresenter() {
            // reset the dom (View)
            this.resetPinTransformation();
            this._swimLaneChartView.reRender([
                { type: "delete", payload: [...this._swimLaneChartModel.columns, ...this._visibleNodes, ...this._visibleGroups] }
            ]);
            // reset the data model
            this._swimLaneChartModel.resetSwimLaneChartModel();
            // reset the local attributes
            this._visibleNodes = [];
            this._stickyNodes = [];
            this._visibleGroups = [];
            this._fitToWindowScale = 1;
        }
        /**
         * Method to export the swimlane to svg format
         */
        async exportToSvg() {
            var _a, _b;
            this.resetStickyTransformation();
            this.renderInvisibleElts();
            const serializer = new XMLSerializer();
            const stickyLayer = (_a = this._swimLaneChartView.getStickyLayer()) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
            const parentElt = (_b = this._swimLaneChartView.getGridContainer()) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
            stickyLayer.setAttribute("transform", `translate(${0} ${-2 * StaticAttributes_1.gridStep})`);
            parentElt.style.transform = "";
            parentElt.insertBefore(stickyLayer, null);
            parentElt.innerHTML += StaticAttributes_1.EMBEDED_STYLES;
            parentElt.setAttribute("width", `${this._layoutManager.getSwimLaneChartWidth()}`);
            parentElt.setAttribute("height", `${this._layoutManager.getSwimLaneChartHeight() + 2 * StaticAttributes_1.gridStep}`);
            parentElt.setAttribute("viewBox", `${0} ${-2 * StaticAttributes_1.gridStep} ${this._layoutManager.getSwimLaneChartWidth() + 2 * StaticAttributes_1.gridStep} ${this._layoutManager.getSwimLaneChartHeight() + 2 * StaticAttributes_1.gridStep}`);
            // clean the top Layer
            const topLayer = parentElt.querySelector(".top-layer");
            if (topLayer)
                topLayer.innerHTML = "";
            // handle childElements innerImages
            const listOfImgElts = parentElt.getElementsByTagName("img");
            for (let i = 0; i < listOfImgElts.length; i++) {
                const imgElt = listOfImgElts[i];
                const imgSrc = imgElt.src;
                if (imgSrc.includes("https://")) {
                    // convert the image to base64
                    const img = new Image();
                    img.setAttribute("crossorigin", "use-credentials");
                    img.src = imgSrc;
                    const base64 = (0, LayoutUtils_1.convertImageToBase64)(img, { x: Number(0), y: Number(0), w: img.naturalWidth || 32, h: img.naturalHeight || 32 });
                    if (base64) {
                        imgElt.src = base64;
                    }
                }
            }
            // handle childElements
            const listOfForeighnObjects = parentElt.getElementsByClassName("foreignNode");
            for (let i = 0; i < listOfForeighnObjects.length; i++) {
                const fo = listOfForeighnObjects[i];
                (0, LayoutUtils_1.applyStyle)(fo);
                const x = fo.getAttribute("x");
                const y = fo.getAttribute("y");
                const w = fo.getAttribute("width");
                const h = fo.getAttribute("height");
                const foImg = document.createElementNS(StaticAttributes_1.nameSpace, 'image');
                foImg.setAttribute('style', "opacity:var(--opacity)");
                foImg.setAttribute('height', `${h}`);
                foImg.setAttribute('width', `${w}`);
                foImg.setAttribute('x', `${x}`);
                foImg.setAttribute('y', `${y}`);
                const parent = fo.parentElement;
                await (0, LayoutUtils_1.convertHtmlToImg)(fo.outerHTML, { x: Number(x), y: Number(y), w: Number(w), h: Number(h) })
                    .then((imgUrl) => {
                    foImg.setAttribute('href', imgUrl);
                    parent === null || parent === void 0 ? void 0 : parent.insertBefore(foImg, fo);
                })
                    .catch(err => console.error(err));
            }
            const iconsList = parentElt.getElementsByClassName("icons");
            for (let i = 0; i < iconsList.length; i++) {
                const icon = iconsList[i];
                const x = icon.getAttribute("x");
                const y = icon.getAttribute("y");
                const w = icon.getAttribute("width");
                const h = icon.getAttribute("height");
                const href = icon.getAttribute("href");
                if (href === null || href === void 0 ? void 0 : href.includes("https://")) {
                    if (icon && href && w && h) {
                        const img = new Image();
                        img.src = href;
                        const base64 = (0, LayoutUtils_1.convertImageToBase64)(icon, { x: Number(x), y: Number(y), w: img.naturalWidth || parseFloat(w), h: img.naturalHeight || parseFloat(h) });
                        if (base64) {
                            icon.setAttribute("href", base64);
                        }
                    }
                }
            }
            const uri = encodeURIComponent(`<?xml version="1.0" encoding="utf-8"?>\n` + serializer.serializeToString(parentElt));
            (0, LayoutUtils_1.saveGraphAsSVGImage)(uri);
            this.deleteInvisibleElts();
        }
        /**
         * Method to render the invisible elements (nodes, groups that don't appear in the viewport) for export purposes
         */
        renderInvisibleElts() {
            // nodes
            const currentVisibleNodesIds = this._visibleNodes.map((n) => n.id);
            const inVisibleNodes = this._swimLaneChartModel.getSwimLaneChartVisibleColumnNodes().filter((n) => !n.isHidden && !currentVisibleNodesIds.includes(n.id));
            // groups
            const currentVisibleGroupsIds = this._visibleGroups.map((gr) => gr.id);
            const inVisibleGroups = this._swimLaneChartModel.listOfGroups.filter((gr) => gr.boundingBox.h > 0 && !currentVisibleGroupsIds.includes(gr.id));
            this._swimLaneChartView.reRender([
                { type: "create", payload: [...inVisibleNodes, ...inVisibleGroups] },
                { type: "update", payload: [...this._visibleNodes] }
            ]);
        }
        /**
         * Method to remove the invisible elements (nodes, groups that don't appear in the viewport)
         */
        deleteInvisibleElts() {
            // nodes
            const currentVisibleNodesIds = this._visibleNodes.map((n) => n.id);
            const inVisibleNodes = this._swimLaneChartModel.getSwimLaneChartVisibleColumnNodes().filter((n) => !n.isHidden && !currentVisibleNodesIds.includes(n.id));
            // groups
            const currentVisibleGroupsIds = this._visibleGroups.map((gr) => gr.id);
            const inVisibleGroups = this._swimLaneChartModel.listOfGroups.filter((gr) => !currentVisibleGroupsIds.includes(gr.id));
            this._swimLaneChartView.reRender([
                { type: "delete", payload: [...inVisibleNodes, ...inVisibleGroups] }
            ]);
        }
    }
    exports.default = SwimLaneChartPresenter;
});
