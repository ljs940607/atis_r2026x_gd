/// <amd-module name="DS/DELGraphEditor/services/controllerServices/RelationManagerService"/>
define("DS/DELGraphEditor/services/controllerServices/RelationManagerService", ["require", "exports", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node"], function (require, exports, Link_1, Node_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RelationManagerService = void 0;
    class RelationManagerService {
        constructor(graphModel) {
            this._graphModel = graphModel;
        }
        /**
         * method to handle selection behavior based on the action target (single-selection,multi-selection)
         * return the new list of objects IDs that should be selected
         */
        defineIdsOfGraphElementsToSelect(targetId, targetType, shiftKey) {
            const graphSelectedEltIds = this._graphModel.getSelectedEltsIds();
            // deselection all selected nodes
            if (!targetId || targetType === "bodyGroupNode")
                return [];
            else {
                if (targetType === "segmentOutline")
                    return [targetId];
                else {
                    // 1st case targetObject is already selected
                    if (graphSelectedEltIds.includes(targetId)) {
                        if (shiftKey)
                            return [targetId];
                        // no action needed
                        else
                            return graphSelectedEltIds;
                        // 2nd case targetObject is not selected yet
                    }
                    else {
                        // multi-selection
                        if (graphSelectedEltIds.length > 0 && shiftKey)
                            return [...graphSelectedEltIds, targetId];
                        // single-selection
                        return [targetId];
                    }
                }
            }
        }
        defineGraphSteps() {
            const nodes = this._graphModel.getNodes();
            let setOfRanks = [];
            const startingNodes = nodes.filter((node) => this._graphModel.getInLinkList(node).length === 0 && this._graphModel.getOutLinkList(node).length > 0 && node.parentId === "");
            if (startingNodes.length > 0) {
                startingNodes.forEach((node) => {
                    const outLinks = this._graphModel.getOutLinkList(node);
                    outLinks.forEach((link, index) => {
                        const possibilites = this.listOfPossToReachTheEndFromStep(link, new Map([[link.id, index]]));
                        setOfRanks.push(possibilites);
                    });
                });
            }
            else {
                nodes.forEach((node) => {
                    const outLinks = this._graphModel.getOutLinkList(node);
                    outLinks.forEach((link, index) => {
                        const possibilites = this.listOfPossToReachTheEndFromStep(link, new Map([[link.id, index]]));
                        setOfRanks.push(possibilites);
                    });
                });
            }
            return setOfRanks;
        }
        listOfPossToReachTheEndFromStep(link, possMap, previousPath = link.id) {
            if (link.sourceID === link.targetID)
                return possMap;
            const target = this._graphModel.getEltById(link.targetID);
            const targetChidlren = this._graphModel.getChildren(target).filter((elt) => elt instanceof Node_1.Node);
            if (targetChidlren.length > 0) {
                targetChidlren.forEach((child) => {
                    const outChildLinks = this._graphModel.getOutLinkList(child);
                    outChildLinks.forEach((outChildLink, index) => {
                        // possMap.delete(previousPath);
                        const newPath = previousPath + "/" + outChildLink.id;
                        possMap.set(newPath, index);
                        this.listOfPossToReachTheEndFromStep(outChildLink, possMap, newPath);
                    });
                });
            }
            const outLinks = this._graphModel.getOutLinkList(target);
            outLinks.forEach((outLink, index) => {
                possMap.delete(previousPath);
                const newPath = previousPath + "/" + outLink.id;
                possMap.set(newPath, index);
                this.listOfPossToReachTheEndFromStep(outLink, possMap, newPath);
            });
            return possMap;
        }
        defineDraggableElementsFrom(listOfSelectedElts) {
            let listOfEltsTodrag = [];
            let ancestorsOfEltsTodrag = [];
            if (listOfSelectedElts.length === this._graphModel._graphElts.size)
                listOfEltsTodrag = [...listOfSelectedElts];
            else {
                listOfSelectedElts.forEach((graphElt) => {
                    if (graphElt instanceof Node_1.Node) {
                        const graphEltChildren = this._graphModel.getChildren(graphElt);
                        graphEltChildren.forEach((value) => {
                            if (value instanceof Node_1.Node)
                                listOfEltsTodrag = [...listOfEltsTodrag, ...this._graphModel.getInLinkList(value), ...this._graphModel.getOutLinkList(value), value];
                        });
                    }
                    listOfEltsTodrag = [graphElt, ...this._graphModel.getNeighbors(graphElt), ...listOfEltsTodrag];
                    ancestorsOfEltsTodrag = [...this._graphModel.getAncestors(graphElt), ...ancestorsOfEltsTodrag];
                });
                listOfEltsTodrag = listOfEltsTodrag.filter((graphObject, index) => listOfEltsTodrag.lastIndexOf(graphObject) === index);
            }
            return { ancestorsOfEltsTodrag: ancestorsOfEltsTodrag, listOfEltsTodrag: listOfEltsTodrag };
        }
        defineElementsTodelete(id) {
            const listOfSelectedObjects = id ? [this._graphModel.getEltById(id)] : this._graphModel.getSelectedElts();
            const listOfObjectsToDelete = [];
            let listOfObjectsToResize = [];
            listOfSelectedObjects.reverse().forEach((object) => {
                const friendsList = this._graphModel.getFriends(object);
                let childrenList = [];
                if (object instanceof Node_1.Node) {
                    const graphEltChildren = this._graphModel.getChildren(object);
                    graphEltChildren.forEach((value) => {
                        if (value instanceof Node_1.Node)
                            childrenList = [value, ...this._graphModel.getFriends(value), ...childrenList];
                    });
                }
                // add related objects 
                [...friendsList, ...childrenList, object].forEach((graphObject) => { if (!listOfObjectsToDelete.includes(graphObject))
                    listOfObjectsToDelete.push(graphObject); });
                // add ancestors 
                const ancestorsList = this._graphModel.getAncestors(object);
                listOfObjectsToResize = [...listOfObjectsToResize, ...ancestorsList];
            });
            return { listOfObjectsToDelete: listOfObjectsToDelete, listOfObjectsToResize: listOfObjectsToResize };
        }
        defineElementsToCopy() {
            let clipBoardObjects = [];
            const selectedElts = this._graphModel.getSelectedElts();
            selectedElts.forEach((selecteObject) => {
                if (selecteObject instanceof Node_1.Node) {
                    // check the parent
                    clipBoardObjects.push(selecteObject);
                    // selected obejcts is parent => copy his children
                    if (selecteObject.type === "GroupNode") {
                        const children = this._graphModel.getChildren(selecteObject);
                        const nodesChildren = children.filter((node) => node instanceof Node_1.Node);
                        const linkChildren = children.filter((link) => link instanceof Link_1.Link);
                        // order is important
                        clipBoardObjects = [...clipBoardObjects, ...nodesChildren, ...linkChildren];
                    }
                }
            });
            return clipBoardObjects.filter((elt, index) => clipBoardObjects.indexOf(elt) === index);
        }
    }
    exports.RelationManagerService = RelationManagerService;
    exports.default = RelationManagerService;
});
