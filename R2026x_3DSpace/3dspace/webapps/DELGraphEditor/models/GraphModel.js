/// <amd-module name="DS/DELGraphEditor/models/GraphModel"/>
define("DS/DELGraphEditor/models/GraphModel", ["require", "exports", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node"], function (require, exports, Link_1, Node_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphModel = void 0;
    class GraphModel {
        constructor() {
            this._graphElts = new Map();
        }
        // read actions
        getAll() {
            return this._graphElts;
        }
        getEltById(id) {
            return this._graphElts.get(id);
        }
        getSelectedElts() {
            let selectedElts = [];
            this._graphElts.forEach((value) => {
                if (value.isSelected)
                    selectedElts.push(value);
            });
            return selectedElts;
        }
        getSelectedNodes() {
            return this.getSelectedElts().filter((elt) => elt instanceof Node_1.Node);
        }
        getSelectedEltsIds() {
            let selectedEltsIds = [];
            this._graphElts.forEach((value, id) => {
                if (value.isSelected)
                    selectedEltsIds.push(id);
            });
            return selectedEltsIds;
        }
        getNodes() {
            return [...this._graphElts.values()].filter((elt) => elt instanceof Node_1.Node);
        }
        getLinks() {
            return [...this._graphElts.values()].filter((elt) => elt instanceof Link_1.Link);
        }
        /*** CUD manager ****/
        addNodeToGraph(node) {
            if (node.id)
                this._graphElts.set(node.id, node);
        }
        addLinkToGraph(link) {
            if (link.id)
                this._graphElts.set(link.id, link);
        }
        updateElt(updatedElt) {
            this._graphElts.set(updatedElt.id, updatedElt);
        }
        updateEltId(oldId, newId) {
            const graphElt = this.getEltById(oldId);
            graphElt.id = newId;
            this._graphElts.delete(oldId);
            this._graphElts.set(newId, graphElt);
        }
        selectAll() {
            const selectedEltsIds = this.getSelectedEltsIds();
            this._graphElts.forEach((graphElt) => graphElt.setIsSelected());
            return [...this._graphElts.values()].filter((graphElt) => !selectedEltsIds.includes(graphElt.id));
        }
        deselectAll() {
            const selectedEltsIds = this.getSelectedEltsIds();
            this._graphElts.forEach((graphElt) => graphElt.setIsDeselected());
            return [...this._graphElts.values()].filter((graphElt) => selectedEltsIds.includes(graphElt.id));
        }
        selectGraphElt(id) {
            let graphElt = this.getEltById(id);
            graphElt === null || graphElt === void 0 ? void 0 : graphElt.setIsSelected();
            return graphElt;
        }
        deSelectGraphElt(id) {
            let graphElt = this.getEltById(id);
            graphElt === null || graphElt === void 0 ? void 0 : graphElt.setIsDeselected();
            return graphElt;
        }
        delete(id) {
            this._graphElts.delete(id);
        }
        has(eltId) {
            return typeof this._graphElts.get(eltId) !== "undefined";
        }
        /** relations manager > READ **/
        getSource(link) {
            let sourceNode = this.getEltById(link.sourceID);
            if (sourceNode instanceof Node_1.Node)
                return sourceNode;
            else
                return {};
        }
        getTarget(link) {
            let targetNode = this.getEltById(link.targetID);
            if (targetNode instanceof Node_1.Node)
                return targetNode;
            else
                return {};
        }
        getInLinkList(node) {
            let InLinkList = [];
            this._graphElts.forEach((value) => {
                if (value instanceof Link_1.Link && value.targetID === node.id)
                    InLinkList.push(value);
            });
            return InLinkList;
        }
        getOutLinkList(node) {
            let OutLinkList = [];
            this._graphElts.forEach((value) => {
                if (value instanceof Link_1.Link && value.sourceID === node.id)
                    OutLinkList.push(value);
            });
            return OutLinkList;
        }
        getSiblings(graphElt) {
            return [graphElt];
        }
        getFriends(graphElt) {
            if (graphElt instanceof Node_1.Node) {
                let listOfNestedFriends = [];
                const InLinkList = this.getInLinkList(graphElt);
                InLinkList.forEach((link) => listOfNestedFriends = [...listOfNestedFriends, ...this.getFriends(link), link]);
                const OutLinkList = this.getOutLinkList(graphElt);
                OutLinkList.forEach((link) => listOfNestedFriends = [...listOfNestedFriends, ...this.getFriends(link), link]);
                return [...listOfNestedFriends];
            }
            else {
                return [];
            }
        }
        getNeighbors(graphElt) {
            if (graphElt instanceof Node_1.Node)
                return [...this.getInLinkList(graphElt), ...this.getOutLinkList(graphElt)];
            else
                return [];
        }
        getParent(graphElt) {
            let parent = {};
            if (graphElt instanceof Node_1.Node) {
                if (graphElt.parentId) {
                    let parentById = this.getEltById(graphElt.parentId);
                    if (parentById instanceof Node_1.Node && parentById.type === "GroupNode")
                        parent = parentById;
                }
            }
            else if (graphElt instanceof Link_1.Link) {
                let sourceNode = this.getSource(graphElt);
                let targetNode = this.getTarget(graphElt);
                if (sourceNode && targetNode && sourceNode.parentId === targetNode.parentId)
                    parent = this.getParent(sourceNode);
            }
            ;
            return parent;
        }
        getCommonParentId(firstNode, secondNode) {
            let firstNodeAncestorsIds = this.getAncestors(firstNode).map((ancestor) => ancestor.id);
            let secondNodeAncestorsIds = this.getAncestors(secondNode).map((ancestor) => ancestor.id);
            for (let firstAncestorId of firstNodeAncestorsIds) {
                if (secondNodeAncestorsIds.includes(firstAncestorId))
                    return firstAncestorId;
            }
            return "";
        }
        getAncestors(graphElt) {
            let ancestorGroupList = [];
            let nodeParent = this.getParent(graphElt);
            // find node ancestors
            if (nodeParent && nodeParent.id) {
                // stop condition
                if (!nodeParent.parentId)
                    ancestorGroupList.push(nodeParent);
                else
                    ancestorGroupList = [nodeParent, ...this.getAncestors(nodeParent)];
            }
            return ancestorGroupList;
        }
        getChildren(node) {
            let childNodesList = [];
            this._graphElts.forEach((value) => {
                // if (value instanceof Node) console.log(value.parentId,node.id);
                if (value instanceof Node_1.Node && node && value.parentId === node.id) {
                    // add the child node and their friends
                    childNodesList.push(value);
                    // recursive process
                    if (value instanceof Node_1.Node && value.type === "GroupNode") {
                        childNodesList = [...childNodesList, ...this.getChildren(value)];
                    }
                }
                ;
                if (value instanceof Link_1.Link) {
                    let parent = this.getParent(value);
                    if (parent.id === node.id)
                        childNodesList.push(value);
                }
            });
            return childNodesList.filter((child, index) => childNodesList.lastIndexOf(child) === index);
        }
        getTopLevelObjects(parentLevel) {
            let topLevelObjects = [];
            this._graphElts.forEach((value) => {
                if (value instanceof Node_1.Node && value.parentId === parentLevel)
                    topLevelObjects.push(value);
            });
            return topLevelObjects;
        }
    }
    exports.GraphModel = GraphModel;
});
