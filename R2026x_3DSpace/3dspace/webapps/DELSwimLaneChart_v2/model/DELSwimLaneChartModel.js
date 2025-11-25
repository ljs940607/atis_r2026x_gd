/// <amd-module name="DS/DELSwimLaneChart_v2/model/DELSwimLaneChartModel"/>
define("DS/DELSwimLaneChart_v2/model/DELSwimLaneChartModel", ["require", "exports", "DS/DELSwimLaneChart_v2/model/SwimLaneChartColumn", "DS/DELSwimLaneChart_v2/model/SwimLaneChartNode", "DS/DELSwimLaneChart_v2/model/SwimLaneChartGroup", "DS/DELSwimLaneChart_v2/utils/StaticAttributes", "DS/DELSwimLaneChart_v2/utils/TextUtils"], function (require, exports, SwimLaneChartColumn_1, SwimLaneChartNode_1, SwimLaneChartGroup_1, StaticAttributes_1, TextUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartModel {
        constructor() {
            this._columns = [];
            this._listOfGroups = [new SwimLaneChartGroup_1.default("", [], new Map())]; // default group
            this._nodes = new Map();
        }
        /*** getters and setters ***/
        get listOfGroups() {
            return this._listOfGroups;
        }
        get nodes() {
            return this._nodes;
        }
        get columns() {
            return this._columns;
        }
        resetSwimLaneChartModel() {
            this._columns = [];
            this._listOfGroups = [new SwimLaneChartGroup_1.default("", [], new Map())]; // default group
            this._nodes = new Map();
        }
        loadSwimLaneChartModel(columnsAndNodes, groups = []) {
            // to respect the order of groups declaration
            this._listOfGroups = [...this._listOfGroups, ...[...groups].map((gr) => new SwimLaneChartGroup_1.default(gr.id, [], new Map(), gr.color))];
            columnsAndNodes.forEach((col) => {
                this.createSwimLaneChartColumn(col, groups);
            });
        }
        addNodesToColumn(colId, nodes, groups = []) {
            const childElements = [];
            nodes.forEach((n, index) => {
                var _a, _b, _c;
                if (!this._nodes.has(n.id)) {
                    /*** temp to continue supporting the definition of groups outside the model */
                    const externalGroup = groups.find((gr) => gr.elements.includes(n.id));
                    if (externalGroup)
                        n.groupId = externalGroup.id;
                    /***  end temp code */
                    const group = this._listOfGroups.find((gr) => n.groupId === gr.id || gr.elements.includes(n.id));
                    if (group)
                        group.addElement(n.id, colId);
                    else if (n.groupId) {
                        this._listOfGroups.push(new SwimLaneChartGroup_1.default(n.groupId, [], new Map()));
                        this._listOfGroups[this._listOfGroups.length - 1].addElement(n.id, colId);
                    }
                    else if (!n.parentId)
                        this._listOfGroups[0].addElement(n.id, colId); // element with no group belongs to the default one
                    this._nodes.set(n.id, {
                        node: new SwimLaneChartNode_1.default(n.id, "", { x: 0, y: 0 }, 0, (_a = n.height) !== null && _a !== void 0 ? _a : 0, n.header, n.content, n.isCollapsible, n.isPinnable),
                        groupId: (_b = ((group === null || group === void 0 ? void 0 : group.id) || n.groupId)) !== null && _b !== void 0 ? _b : "",
                        columnId: colId,
                        columnIndex: (_c = n.columnIndex) !== null && _c !== void 0 ? _c : index,
                        nodeVerticalOffset: 0,
                        colGroupVerticalOffset: 0
                    });
                    if (n.parentId && n.parentId !== n.id)
                        childElements.push(n);
                }
            });
            for (let i = 0; i < childElements.length; i++) {
                const n = childElements[i];
                if (n.parentId) {
                    const parent = this._nodes.get(n.parentId);
                    const elt = this._nodes.get(n.id);
                    if (!parent || !elt) {
                        console.log("error: parent with id", n.parentId, "node found");
                    }
                    else {
                        if (elt.columnId !== parent.columnId) {
                            console.error("The child Node from column:", elt.columnId, " cannot have a parent from:", parent.columnId);
                        }
                        else {
                            parent.node.type = "CompositeNode";
                            /** temp code: to support swimlanechart default pinned header behavior */
                            if (!parent.node.parentId && !parent.node.isPinnable) {
                                const parentProps = nodes.find((n) => n.id === parent.node.id);
                                if (parentProps && typeof parentProps.isPinnable === "undefined" && !parentProps.isPinnable)
                                    parent.node.isPinnable = true;
                            }
                            /* end temp code */
                            const group = this._listOfGroups.find((gr) => n.groupId === gr.id || gr.elements.includes(n.id));
                            if (group && group.id && parent.groupId !== group.id) {
                                const compatibilityFlag = this.checkGroupElementsCompatibility(elt, group);
                                if (compatibilityFlag) {
                                    group.type = "inner";
                                    group.addRoot(parent.node.id);
                                    if (parent.nodeisParentOfInnerGroupElt)
                                        parent.nodeisParentOfInnerGroupElt.push(group.id);
                                    else
                                        parent.nodeisParentOfInnerGroupElt = [group.id];
                                }
                                else {
                                    group.removeElement(elt.node.id, elt.columnId);
                                    group.removeRoot(parent.node.id);
                                    elt.groupId = "";
                                    console.error("node with id:", elt.node.id, " cannot be added to group:", group.id, parent.groupId);
                                }
                            }
                            else if (group && group.id && parent.groupId === group.id) {
                                group.removeElement(elt.node.id, elt.columnId);
                                //elt.groupId = "";
                            }
                            else if (parent && !elt.groupId) {
                                elt.groupId = parent.groupId;
                            }
                            elt.node.parentId = n.parentId;
                            this._nodes.set(n.id, {
                                ...elt
                            });
                        }
                    }
                }
            }
        }
        checkGroupElementsCompatibility(newElt, gr) {
            if (!newElt.node.parentId)
                return true;
            const parent = this._nodes.get(newElt.node.parentId);
            if (!parent)
                return true;
            let compatibilityFlag = true;
            for (const eltId of gr.elements) {
                const elt = this._nodes.get(eltId);
                if (elt && elt.node.parentId) {
                    const siblingParent = this._nodes.get(elt.node.parentId);
                    if (siblingParent && siblingParent.groupId !== parent.groupId) {
                        compatibilityFlag = false;
                        break;
                    }
                }
            }
            return compatibilityFlag;
        }
        // CRUDS management
        /*** Read requests */
        getSwimLaneChartNodeById(id) {
            var _a;
            return (_a = this.nodes.get(id)) === null || _a === void 0 ? void 0 : _a.node;
        }
        getSwimLaneChartNodes() {
            return [...this._nodes.values()].map((v) => v.node);
        }
        getNormalSwimLaneChartGroups() {
            return this._listOfGroups.filter((gr) => gr.type === "normal");
        }
        getInnerSwimLaneChartGroups() {
            return this._listOfGroups.filter((gr) => gr.type === "inner");
        }
        /**
         * Get the nodes that their colums are visible
         * @returns visible columns nodes
         */
        getSwimLaneChartVisibleColumnNodes() {
            const visibleColumnNodes = [];
            const visibleColumns = this._columns.filter((col) => !col.hidden);
            [...this._nodes.values()].forEach((v) => {
                const col = visibleColumns.find((col) => col.id === v.columnId);
                if (col)
                    visibleColumnNodes.push(v.node);
            });
            return visibleColumnNodes;
        }
        getSelectedSwimLaneChartNodes() {
            return this.getSwimLaneChartNodes().filter((node) => node.selected);
        }
        getHighlightedSwimLaneChartNodes() {
            return this.getSwimLaneChartNodes().filter((node) => node.highlighted);
        }
        getSwilmLaneChartParent(id) {
            const node = this.getSwimLaneChartNodeById(id);
            if (!node)
                return undefined;
            return this.nodes.get(node === null || node === void 0 ? void 0 : node.parentId);
        }
        getSwimLaneChartGroup(nodeId) {
            const node = this._nodes.get(nodeId);
            if (!node)
                return undefined;
            return this._listOfGroups.find((gr) => gr.id === node.groupId);
        }
        getSwimLaneChartChildren(id) {
            return [...this._nodes.values()].filter((elt) => elt.node.parentId === id);
        }
        /*** Create requests */
        createSwimLaneChartColumn(props, groups = []) {
            var _a;
            const newColumn = new SwimLaneChartColumn_1.default(props.id, props.title, 0, 0, 0, props.icon, props.color, props.textColor, props.hidden, props.weight);
            this._columns.push(newColumn); // initialization
            this.addNodesToColumn(newColumn.id, (_a = props.nodes) !== null && _a !== void 0 ? _a : [], groups); // add nodes to their columns
            return newColumn;
        }
        createSwimLaneChartNode(props) {
            const column = this._columns.find((col) => col.id === props.columnId);
            if (!column) {
                console.error("The column of the node to create is not found, column Id:", props.columnId);
                return;
            }
            this.addNodesToColumn(props.columnId, [props]);
        }
        /** update requests */
        updateSwimLaneChartColumn(props) {
            var _a, _b, _c, _d, _e, _f;
            const columnToUpdate = this._columns.find((col) => col.id === props.id);
            if (columnToUpdate) {
                columnToUpdate.color = (_a = props.color) !== null && _a !== void 0 ? _a : columnToUpdate.color;
                columnToUpdate.textColor = (_b = props.textColor) !== null && _b !== void 0 ? _b : columnToUpdate.textColor;
                columnToUpdate.icon = (_c = props.icon) !== null && _c !== void 0 ? _c : columnToUpdate.icon;
                columnToUpdate.title = (_d = props.title) !== null && _d !== void 0 ? _d : columnToUpdate.title;
                columnToUpdate.hidden = (_e = props.hidden) !== null && _e !== void 0 ? _e : columnToUpdate.hidden;
                if (props.nodes) {
                    // old nodes
                    this._nodes.forEach((elt) => {
                        if (elt.columnId === props.id)
                            this.deleteSwimLaneChartNode(elt.node.id);
                    });
                    // nodes to add
                    this.addNodesToColumn(columnToUpdate.id, (_f = props.nodes) !== null && _f !== void 0 ? _f : []);
                    // clean empty groups
                    this.deleteEmptyGroups();
                }
            }
            return columnToUpdate;
        }
        updateSwimLaneChartNode(props) {
            const { id, parentId, groupId, height, header, content, isCollapsible, isPinnable } = props;
            const node = this._nodes.get(id);
            if (!node) {
                console.error("Node width id:", id, " is not found");
                return undefined;
            }
            if (height) {
                node.node.height = height;
                node.node.bodyHeight = height;
            }
            if (header) {
                node.node.header = header;
                node.node.height = height !== null && height !== void 0 ? height : this.computeNodeHeightFromHtmlContent(node.node, node.node.width);
                node.node.bodyHeight = height !== null && height !== void 0 ? height : this.computeNodeHeightFromHtmlContent(node.node, node.node.width);
            }
            if (content) {
                node.node.content = content;
                node.node.height = height !== null && height !== void 0 ? height : this.computeNodeHeightFromHtmlContent(node.node, node.node.width);
                node.node.bodyHeight = height !== null && height !== void 0 ? height : this.computeNodeHeightFromHtmlContent(node.node, node.node.width);
            }
            if (typeof isCollapsible !== "undefined")
                node.node.isCollapsible = isCollapsible;
            if (typeof isPinnable !== "undefined")
                node.node.isPinnable = isPinnable;
            if (typeof parentId !== "undefined")
                node.node.parentId = parentId;
            if (typeof groupId !== "undefined") {
                const oldGroup = this._listOfGroups.find((gr) => gr.id === node.groupId);
                const group = this._listOfGroups.find((gr) => gr.id === groupId);
                node.groupId = groupId;
                // remove from the old group
                if (oldGroup) {
                    oldGroup.removeElement(node.node.id, node.columnId);
                }
                // add to a new group
                if (group) {
                    group.addElement(node.node.id, node.columnId);
                }
                else {
                    this._listOfGroups.push(new SwimLaneChartGroup_1.default(groupId, [], new Map()));
                    this._listOfGroups[this._listOfGroups.length - 1].addElement(node.node.id, node.columnId);
                }
            }
            this._nodes.set(id, node);
            return node.node;
        }
        updateSwimLaneChartGroup(props) {
            const { id, color, elements } = props;
            const groupToUpdate = this._listOfGroups.find((gr) => gr.id === id);
            if (!groupToUpdate)
                return;
            if (color)
                groupToUpdate.color = color;
            if (elements) {
                groupToUpdate.reset();
                this._nodes.forEach((elt) => {
                    if (elements.includes(elt.node.id)) {
                        elt.groupId = id;
                        groupToUpdate.addElement(elt.node.id, elt.columnId);
                        if (elt.node.parentId) {
                            const parent = this._nodes.get(elt.node.parentId);
                            if (parent && parent.groupId !== id) {
                                const compatibilityFlag = this.checkGroupElementsCompatibility(elt, new SwimLaneChartGroup_1.default(id, elements, new Map()));
                                if (compatibilityFlag) {
                                    groupToUpdate.type = "inner";
                                    groupToUpdate.addRoot(parent.node.id);
                                    if (parent.nodeisParentOfInnerGroupElt)
                                        parent.nodeisParentOfInnerGroupElt.push(groupToUpdate.id);
                                    else
                                        parent.nodeisParentOfInnerGroupElt = [groupToUpdate.id];
                                }
                                else {
                                    groupToUpdate.removeElement(elt.node.id, elt.columnId);
                                    groupToUpdate.removeRoot(parent.node.id);
                                    elt.groupId = "";
                                    console.error("node with id:", elt.node.id, " cannot be added to group:", groupToUpdate.id, parent.groupId);
                                }
                            }
                        }
                    }
                    else if (elt.groupId === id)
                        elt.groupId = "";
                });
            }
        }
        setGroupsOrder(newOrder) {
            newOrder.unshift(""); // to keep the default group always on the top
            const orderMap = new Map(newOrder.map((v, index) => [v, index]));
            this.listOfGroups.sort((gr1, gr2) => {
                var _a, _b;
                const gr1Index = (_a = orderMap.get(gr1.id)) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
                const gr2Index = (_b = orderMap.get(gr2.id)) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
                return gr1Index - gr2Index;
            });
        }
        selectSwimLaneChartNode(id) {
            const node = this.getSwimLaneChartNodeById(id);
            if (!node) {
                console.error("Node not found");
                return;
            }
            node.select();
            return node;
        }
        unSelectSwimLaneChartNode(id) {
            const node = this.getSwimLaneChartNodeById(id);
            if (!node) {
                console.error("Node not found");
                return;
            }
            node.unSelect();
            return node;
        }
        highlightSwimLaneChartNode(id) {
            const node = this.getSwimLaneChartNodeById(id);
            if (!node) {
                console.error("Node not found");
                return;
            }
            node.highlight();
            return node;
        }
        unHighlightSwimLaneChartNode(id) {
            const node = this.getSwimLaneChartNodeById(id);
            if (!node) {
                console.error("Node not found");
                return;
            }
            node.unHighlight();
            return node;
        }
        minimizeSwimLaneChartNode(id) {
            const elt = this.nodes.get(id);
            if (!elt || elt.node.isMinimized)
                return elt;
            elt.node.isMinimized = true;
            if (elt.node.type === "CompositeNode") {
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    // child.node.isMinimized = true;
                    this.minimizeSwimLaneChartNode(child.node.id);
                });
            }
            return elt;
        }
        collapseSwimLaneChartNode(id, recursiveFlag = false) {
            const elt = this.nodes.get(id);
            if (!elt || !elt.node.isCollapsible)
                return elt;
            elt.node.isCollapsed = true;
            if (elt.node.type === "CompositeNode") {
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    if (recursiveFlag)
                        this.collapseSwimLaneChartNode(child.node.id, recursiveFlag);
                    this.hideSwimLaneChartNode(child.node.id, child.groupId !== elt.groupId);
                });
            }
            if (elt.node.isHidden)
                elt.node.isHidden = false;
            return elt;
        }
        hideSwimLaneChartNode(id, shouldHideInnerGroup = true) {
            const elt = this.nodes.get(id);
            if (!elt || elt.node.isHidden)
                return elt;
            elt.node.isHidden = true;
            const gr = this.getSwimLaneChartGroup(id);
            if (shouldHideInnerGroup && gr && gr.type === "inner") {
                gr.resetBoundingBox();
                /*** to fix: repetitve recursive calls */
                gr.elements.forEach((eltId) => {
                    this.hideSwimLaneChartNode(eltId);
                });
            }
            if (elt.node.type === "CompositeNode" && !elt.node.isCollapsed) {
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    // child.node.isMinimized = true;
                    this.hideSwimLaneChartNode(child.node.id);
                });
            }
            return elt;
        }
        maximizeSwimLaneChartNode(id) {
            const elt = this.nodes.get(id);
            if (!elt || !elt.node.isMinimized)
                return elt;
            elt.node.isMinimized = false;
            if (elt.node.type === "CompositeNode") {
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    this.maximizeSwimLaneChartNode(child.node.id);
                });
            }
            return elt;
        }
        expandSwimLaneChartNode(id, recursiveFlag = false) {
            const elt = this.nodes.get(id);
            if (!elt || !elt.node.isCollapsible)
                return elt;
            elt.node.isCollapsed = false;
            if (elt.node.type === "CompositeNode") {
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    if (recursiveFlag)
                        this.expandSwimLaneChartNode(child.node.id, recursiveFlag);
                    this.showSwimLaneChartNode(child.node.id);
                });
            }
            return elt;
        }
        showSwimLaneChartNode(id) {
            const elt = this.nodes.get(id);
            if (!elt || !elt.node.isHidden)
                return elt;
            elt.node.isHidden = false;
            const gr = this.getSwimLaneChartGroup(id);
            // temp code (it should be moved but where?)
            if (elt.node.parentId) {
                const parent = this._nodes.get(elt.node.parentId);
                if (parent && parent.node.isCollapsed) {
                    this.expandSwimLaneChartNode(elt.node.parentId);
                    return;
                }
            }
            if (gr && gr.type === "inner") {
                gr.elements.forEach((eltId) => {
                    this.showSwimLaneChartNode(eltId);
                });
            }
            if (elt.node.type === "CompositeNode" && !elt.node.isCollapsed) {
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    this.showSwimLaneChartNode(child.node.id);
                });
            }
            return elt;
        }
        // delete
        deleteSwimLaneChartColumn(id) {
            this._columns = this._columns.filter((col) => col.id !== id);
            this._nodes.forEach((elt) => {
                if (elt.columnId === id) {
                    // delete the column nodes
                    this._nodes.delete(elt.node.id);
                    // remove the node from its group
                    const group = this.getSwimLaneChartGroup(elt.node.id);
                    group === null || group === void 0 ? void 0 : group.removeElement(elt.node.id, elt.columnId);
                }
            });
        }
        deleteSwimLaneChartNode(id) {
            var _a;
            const elt = this._nodes.get(id);
            if (elt === null || elt === void 0 ? void 0 : elt.node.isCollapsed)
                this.expandSwimLaneChartNode(id); // to counter the side effects of the collapse (hide some elements)
            if (!elt) {
                console.error("Node to delete is not found");
                return;
            }
            //child elements cleanup?
            if (elt.node.type === "CompositeNode") {
                const childElements = this.getSwimLaneChartChildren(id);
                childElements.forEach((child) => {
                    this.deleteSwimLaneChartNode(child.node.id);
                });
            }
            // remove the node from its parent group
            const group = this.getSwimLaneChartGroup(id);
            group === null || group === void 0 ? void 0 : group.removeElement(id, elt.columnId);
            if (group && group.type === "inner") {
                const isInnerGr = group.elements.some((id) => {
                    const elt = this._nodes.get(id);
                    return elt && elt.node.parentId;
                });
                group.type = isInnerGr ? "inner" : "normal";
            }
            // delete the node
            this._nodes.delete(id);
            // parent element update
            if (elt.node.parentId) {
                const parent = this._nodes.get(elt.node.parentId);
                if (parent) {
                    const siblingsElements = this.getSwimLaneChartChildren(elt.node.parentId);
                    if (siblingsElements.length === 0) {
                        parent.node.type = "Node";
                        if ((_a = parent.node.header) === null || _a === void 0 ? void 0 : _a.topOffset)
                            parent.node.header.topOffset = 0;
                        parent.node.height = parent.node.bodyHeight;
                        if (group)
                            group.removeRoot(parent.node.id);
                        parent.nodeisParentOfInnerGroupElt = undefined;
                    }
                    else {
                        if (group)
                            group.removeRoot(parent.node.id);
                        parent.nodeisParentOfInnerGroupElt = undefined;
                        siblingsElements.forEach((child) => {
                            const group = this._listOfGroups.find((gr) => child.groupId === gr.id || gr.elements.includes(child.node.id));
                            if (group && group.id && parent.groupId !== group.id) {
                                group.type = "inner";
                                group.addRoot(parent.node.id);
                                if (parent.nodeisParentOfInnerGroupElt)
                                    parent.nodeisParentOfInnerGroupElt.push(group.id);
                                else
                                    parent.nodeisParentOfInnerGroupElt = [group.id];
                            }
                        });
                    }
                }
            }
        }
        deleteSwimLaneChartGroup(id) {
            this._listOfGroups = this._listOfGroups.filter((gr) => gr.id !== id);
            this._nodes.forEach((elt) => {
                if (elt.groupId === id) {
                    elt.groupId = "";
                    this.listOfGroups[0].addElement(elt.node.id, elt.columnId);
                }
            });
        }
        deleteEmptyGroups() {
            this._listOfGroups = this._listOfGroups.filter((gr) => !gr.id || gr.id && gr.elements.length > 0);
        }
        // reorder model (make sure that the nodes are ordered as follows: greatParent > parent > children)
        reorderModel(parentLevel = "") {
            const parentLevelElts = [...this._nodes.entries()].filter((elt) => elt[1].node.parentId === parentLevel);
            parentLevelElts.forEach((elt) => {
                this._nodes.delete(elt[0]);
                this._nodes.set(elt[0], elt[1]);
                if (elt[1].node.type === "CompositeNode")
                    this.reorderModel(elt[1].node.id);
            });
        }
        computeNodeHeightFromHtmlContent(node, width) {
            var _a, _b, _c, _d, _e;
            // define header height
            let headerHeight = 0;
            if (node.header) {
                if (node.header.textWrap === "wrap") {
                    const headerSpan = document.createElement("span");
                    headerSpan.classList.add("spanText");
                    headerSpan.style.fontFamily = "Arial";
                    headerSpan.style.fontSize = "12px";
                    headerSpan.innerHTML = ((_b = (_a = node.header.text) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "");
                    const headerLeftIconLeft = ((_c = node.header) === null || _c === void 0 ? void 0 : _c.collapsibleIcon) ? StaticAttributes_1.imgSize + StaticAttributes_1.margin : StaticAttributes_1.margin;
                    const headerTitleLeft = ((_d = node.header) === null || _d === void 0 ? void 0 : _d.leftIcon) ? StaticAttributes_1.imgSize + StaticAttributes_1.margin + headerLeftIconLeft : headerLeftIconLeft;
                    const headerWidth = ((_e = node.header) === null || _e === void 0 ? void 0 : _e.rightIcon) ? Math.max(node.width - headerTitleLeft - StaticAttributes_1.imgSize - 2 * StaticAttributes_1.margin, 2 * StaticAttributes_1.margin) : Math.max(node.width - headerTitleLeft - StaticAttributes_1.margin, 2 * StaticAttributes_1.margin);
                    headerHeight = Math.max((0, TextUtils_1.computeHtmlContentHeight)(headerSpan, headerWidth), StaticAttributes_1.header_height);
                    node.header = { ...node.header, height: headerHeight }; // move elsewhere
                    headerSpan.classList.remove("spanText");
                }
                else {
                    headerHeight = StaticAttributes_1.header_height;
                    node.header = { ...node.header, height: headerHeight }; // move elsewhere
                }
            }
            else
                headerHeight = 0;
            // define content Height
            if (!node.content)
                return headerHeight;
            if (!node.content.childElement) {
                if (node.content.fragmentElement || node.content.text)
                    return StaticAttributes_1.swimLanechartNodeHeight + headerHeight;
                else {
                    return headerHeight;
                }
            }
            const htmlContent = node.content.childElement;
            const contentBodyLeft = node.content.leftIcon ? StaticAttributes_1.imgSize + StaticAttributes_1.margin : StaticAttributes_1.margin;
            const contentBodyWidth = node.content.rightIcon ? width - contentBodyLeft - (StaticAttributes_1.imgSize + StaticAttributes_1.margin) : width - contentBodyLeft - StaticAttributes_1.margin;
            return (0, TextUtils_1.computeHtmlContentHeight)(htmlContent, contentBodyWidth) + headerHeight + 2 * StaticAttributes_1.margin;
        }
    }
    exports.default = SwimLaneChartModel;
});
