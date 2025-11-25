/// <amd-module name="DS/DELSwimLaneChart_v1/model/DELSwimLaneChartModel"/>
define("DS/DELSwimLaneChart_v1/model/DELSwimLaneChartModel", ["require", "exports", "DS/DELSwimLaneChart_v1/model/SwimLaneChartColumn", "DS/DELSwimLaneChart_v1/model/SwimLaneChartNode", "DS/DELSwimLaneChart_v1/model/SwimLaneChartGroup", "DS/DELSwimLaneChart_v1/utils/StaticAttributes", "DS/DELSwimLaneChart_v1/utils/TextUtils"], function (require, exports, SwimLaneChartColumn_1, SwimLaneChartNode_1, SwimLaneChartGroup_1, StaticAttributes_1, TextUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartModel {
        constructor() {
            this._columns = [];
            this._listOfGroups = [new SwimLaneChartGroup_1.default("", [])]; // default group
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
            this._listOfGroups = [new SwimLaneChartGroup_1.default("", [])]; // default group
            this._nodes = new Map();
        }
        loadSwimLaneChartModel(columnsAndNodes, groups = []) {
            this._listOfGroups = [...this._listOfGroups, ...[...groups].map((gr) => new SwimLaneChartGroup_1.default(gr.id, gr.elements, gr.color))];
            columnsAndNodes.forEach((col) => this.createSwimLaneChartColumn(col));
        }
        addNodesToColumn(id, nodes) {
            const childElements = [];
            nodes.forEach((n, index) => {
                var _a, _b, _c;
                if (!this._nodes.has(n.id)) {
                    const group = this._listOfGroups.find((gr) => n.groupId === gr.id || gr.elements.includes(n.id));
                    if (group)
                        group.addElement(n.id);
                    else if (n.groupId)
                        this._listOfGroups.push(new SwimLaneChartGroup_1.default(n.groupId, [n.id]));
                    else
                        this._listOfGroups[0].addElement(n.id); // element with no group belongs to the default one
                    this._nodes.set(n.id, {
                        node: new SwimLaneChartNode_1.default(n.id, "", { x: 0, y: 0 }, 0, (_a = n.height) !== null && _a !== void 0 ? _a : 0, n.header, n.content),
                        groupId: (_b = ((group === null || group === void 0 ? void 0 : group.id) || n.groupId)) !== null && _b !== void 0 ? _b : "",
                        columnId: id,
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
                            this._nodes.delete(n.id); // child elements will always be after the parent in the map
                            elt.node.parentId = n.parentId;
                            this._nodes.set(n.id, {
                                ...elt
                            });
                            // const group: SwimLaneChartGroup | undefined = this._listOfGroups.find((gr: groupType) => n.groupId === gr.id || gr.elements.includes(n.id));
                            // (group ?? this._listOfGroups[0]).removeElement(n.id); // child elements group is its parent group (simplify the auto-layouting)
                        }
                    }
                }
            }
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
        createSwimLaneChartColumn(props) {
            var _a;
            const newColumn = new SwimLaneChartColumn_1.default(props.id, props.title, 0, 0, 0, props.icon, props.color, props.textColor, props.hidden, props.weight);
            this._columns.push(newColumn); // initialization
            this.addNodesToColumn(newColumn.id, (_a = props.nodes) !== null && _a !== void 0 ? _a : []); // add nodes to their columns
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
            const { id, parentId, groupId, height, header, content } = props;
            const node = this._nodes.get(id);
            if (!node) {
                console.error("Node width id:", id, " is not found");
                return undefined;
            }
            if (header)
                node.node.header = header;
            if (height) {
                node.node.height = height;
            }
            if (content) {
                node.node.content = content;
                node.node.height = this.computeNodeHeightFromHtmlContent(node.node, node.node.width);
                node.node.bodyHeight = this.computeNodeHeightFromHtmlContent(node.node, node.node.width);
            }
            if (typeof parentId !== "undefined")
                node.node.parentId = parentId;
            if (typeof groupId !== "undefined") {
                const oldGroup = this._listOfGroups.find((gr) => gr.id === node.groupId);
                const group = this._listOfGroups.find((gr) => gr.id === groupId);
                node.groupId = groupId;
                // remove from the old group
                if (oldGroup) {
                    oldGroup.removeElement(node.node.id);
                }
                // add to a new group
                if (group) {
                    group.addElement(node.node.id);
                }
                else {
                    this._listOfGroups.push(new SwimLaneChartGroup_1.default(groupId, [node.node.id]));
                }
            }
            this._nodes.set(id, node);
            return node.node;
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
                // if(elt.node.header) elt.node.header.topOffset = 0;
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    // child.node.isMinimized = true;
                    this.minimizeSwimLaneChartNode(child.node.id);
                });
            }
            return elt;
        }
        expandSwimLaneChartNode(id) {
            const elt = this.nodes.get(id);
            if (!elt || !elt.node.isMinimized)
                return elt;
            elt.node.isMinimized = false;
            if (elt.node.type === "CompositeNode") {
                // if(elt.node.header) elt.node.header.topOffset = 0;
                const children = [...this.nodes.values()].filter((n) => n.node.parentId === id);
                children.forEach((child) => {
                    // child.node.isMinimized = false;
                    this.expandSwimLaneChartNode(child.node.id);
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
                    group === null || group === void 0 ? void 0 : group.removeElement(elt.node.id);
                }
            });
        }
        deleteSwimLaneChartNode(id) {
            const elt = this._nodes.get(id);
            if (!elt) {
                console.error("Node to delete is not found");
                return;
            }
            if (elt.node.type === "CompositeNode") {
                //cleanup-child elements ?
                const childElements = this.getSwimLaneChartChildren(id);
                childElements.forEach((child) => {
                    this.deleteSwimLaneChartNode(child.node.id);
                });
            }
            // remove the node from its parent group
            const group = this.getSwimLaneChartGroup(id);
            group === null || group === void 0 ? void 0 : group.removeElement(id);
            this._nodes.delete(id);
        }
        deleteSwimLaneChartGroup(id) {
            this._listOfGroups = this._listOfGroups.filter((gr) => gr.id !== id);
            this._nodes.forEach((elt) => {
                if (elt.groupId === id) {
                    elt.groupId = "";
                    this.listOfGroups[0].addElement(elt.node.id);
                }
            });
        }
        deleteEmptyGroups() {
            this._listOfGroups = this._listOfGroups.filter((gr) => !gr.id || gr.id && gr.elements.length > 0);
        }
        computeNodeHeightFromHtmlContent(node, width) {
            if (!node.content)
                return StaticAttributes_1.header_height;
            if (!node.content.childElement) {
                if (!node.content.text)
                    return StaticAttributes_1.header_height;
                else
                    return StaticAttributes_1.swimLanechartNodeHeight;
            }
            const htmlContent = node.content.childElement;
            const contentBodyLeft = node.content.leftIcon ? StaticAttributes_1.imgSize + StaticAttributes_1.margin : StaticAttributes_1.margin;
            const contentBodyWidth = node.content.rightIcon ? width - contentBodyLeft - (StaticAttributes_1.imgSize + StaticAttributes_1.margin) : width - contentBodyLeft - StaticAttributes_1.margin;
            const headerHeight = node.header ? StaticAttributes_1.header_height : 0;
            return (0, TextUtils_1.computeHtmlContentHeight)(htmlContent, contentBodyWidth) + headerHeight + 2 * StaticAttributes_1.margin;
        }
    }
    exports.default = SwimLaneChartModel;
});
