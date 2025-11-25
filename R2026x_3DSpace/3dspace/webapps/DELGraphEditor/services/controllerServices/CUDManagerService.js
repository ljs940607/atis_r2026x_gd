/// <amd-module name="DS/DELGraphEditor/services/controllerServices/CUDManagerService"/>
define("DS/DELGraphEditor/services/controllerServices/CUDManagerService", ["require", "exports", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node", "DS/DELGraphEditor/utils/LinksMovementsUtils", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphEditor/utils/StaticAttributes", "DS/DELGraphEditor/utils/UxActionsUtils", "DS/DELGraphEditor/utils/TextComputations"], function (require, exports, Link_1, Node_1, LinksMovementsUtils_1, GeometricalComputation_1, StaticAttributes_1, UxActionsUtils_1, TextComputations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CUDManagerService {
        // getters and setters for state variables
        set clipBoardObjects(listValue) { this._clipBoardObjects = listValue; }
        set copyOffset(value) { this._copyOffset = value; }
        constructor(graphModel) {
            // utils state variables
            // copy&paste
            this._copyOffset = 0;
            this._clipBoardObjects = [];
            //drag to create connection
            this._defaultCreatedNodeType = "Node";
            this._isDraggingToCreateNode = false;
            this._sourceNodeId = "";
            this._connectionAttachmentSide = "Center";
            this._graphModel = graphModel;
        }
        /** read operations */
        getGraphEltsList() {
            return [...this._graphModel._graphElts.values()];
        }
        getGraphEltById(id) {
            return this._graphModel.getEltById(id);
        }
        getSelectedElts() {
            return this._graphModel.getSelectedElts();
        }
        getSelectedNodes() {
            return this._graphModel.getSelectedNodes();
        }
        getListOfAncestors(node) {
            return this._graphModel.getAncestors(node);
        }
        /** create operations **/
        createLink(type, sourceNodeID, targetNodeID, id) {
            const linkId = sourceNodeID + targetNodeID;
            const newLink = new Link_1.Link(linkId, type, "", sourceNodeID, targetNodeID);
            if (id)
                newLink.id = id;
            this._graphModel.addLinkToGraph(newLink);
            return newLink;
        }
        createNode(isTransitoryFlag, isGroupFlag, groupID, type, label, position, id) {
            const nodeDimension = StaticAttributes_1.nodeDimensionsSet.get(type);
            const [nodeWidth, nodeHeight] = nodeDimension ? nodeDimension : [0, 0];
            const nodeType = (isGroupFlag) ? "GroupNode" : type;
            const nodeId = id ? id : this.generateUniqueObjectId();
            const newNode = new Node_1.Node(nodeId, nodeType, label, position, nodeWidth, nodeHeight); // DynamicNodeClass
            // assign parentId
            if (typeof groupID !== "undefined" && groupID)
                newNode.parentId = groupID;
            else
                newNode.parentId = "";
            if (!isTransitoryFlag) {
                newNode.setIsSelected();
                this._graphModel.addNodeToGraph(newNode);
            }
            // newNode.data = {
            //     body: `
            //     onEntry()=>{/*some logic*/} 
            //     onInvoke()=>{/*some logic*/}
            //     onExit()=>{/*some logic*/}
            //     `,
            //     // icon:"https://webui.dsone.3ds.com/DSFiddle/R426/win_b64/webapps/WebUIPortal/assets/I_Cross.png"
            //     icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpCNEZERDA3QkYyNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNzhGNEE1NjhDMzUxMUUyOEI5NTk3NzM2M0U0RUU1QSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNzhGNEE1NThDMzUxMUUyOEI5NTk3NzM2M0U0RUU1QSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRjExNkI5QUZCNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNEZERDA3QkYyNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIvPiA8L3JkZjpEZXNjcmlwdGlv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"
            //     // image:,
            // };
            return newNode;
        }
        createLinkBteweenTwoNodes(isTransitoryFlag, label, sourceNodeID, targetNodeID, targetIsExisting, position = { x: 0, y: 0 }, targetConnectorSide) {
            const sourceNode = this._graphModel.getEltById(sourceNodeID);
            const possibconstargetNode = this._graphModel.getEltById(targetNodeID);
            // two cases: target node exists already or it should be created
            if (!(sourceNode instanceof Node_1.Node))
                return {};
            const targetNode = typeof possibconstargetNode !== "undefined" ? possibconstargetNode : this.createNode(true, false, "", this._defaultCreatedNodeType, "", (0, LinksMovementsUtils_1.defineTargetNodePosition)(sourceNode, position, this._defaultCreatedNodeType));
            if (!(targetNode instanceof Node_1.Node))
                return {};
            let [InSourceSide, OutTargetSide] = (0, LinksMovementsUtils_1.defineConnectorsAttachmentSides)(sourceNode, targetNode);
            if (targetIsExisting && targetConnectorSide)
                OutTargetSide = targetConnectorSide;
            // out link props
            const OutLinkId = this.generateUniqueObjectId();
            const OutLink = new Link_1.Link(OutLinkId, "Event", label, sourceNode.id, targetNode.id);
            const InstartPos = sourceNode.anchors[InSourceSide];
            OutLink.setSourceSide(InSourceSide);
            OutLink.setTargetSide(OutTargetSide);
            OutLink.addWayPoint(0, InstartPos);
            // continue follow the cursor position
            OutLink.addWayPoint(1, position);
            // midPts definition 
            if (["East", "West"].includes(OutLink.sourceSide) && ["East", "West"].includes(OutLink.targetSide) && OutLink.wayPoints[0].y !== OutLink.wayPoints[1].y) {
                if (OutLink.wayPoints[1].y < sourceNode.anchors["South"].y && OutLink.wayPoints[1].y > sourceNode.anchors["North"].y)
                    OutLink.wayPoints[0].y = OutLink.wayPoints[1].y;
                else {
                    if (OutLink.wayPoints[1].y >= sourceNode.anchors["South"].y)
                        OutLink.wayPoints[0].y = sourceNode.anchors["South"].y - StaticAttributes_1.gridStep;
                    if (OutLink.wayPoints[1].y <= sourceNode.anchors["North"].y)
                        OutLink.wayPoints[0].y = sourceNode.anchors["North"].y + StaticAttributes_1.gridStep;
                    OutLink.updateWayPoint();
                }
            }
            else if (["South", "North"].includes(OutLink.sourceSide) && ["South", "North"].includes(OutLink.targetSide) && OutLink.wayPoints[0].x !== OutLink.wayPoints[1].x) {
                if (OutLink.wayPoints[1].x < sourceNode.anchors["East"].x && OutLink.wayPoints[1].x > sourceNode.anchors["West"].x)
                    OutLink.wayPoints[0].x = OutLink.wayPoints[1].x;
                else {
                    if (OutLink.wayPoints[1].x >= sourceNode.anchors["East"].x)
                        OutLink.wayPoints[0].x = sourceNode.anchors["East"].x - StaticAttributes_1.gridStep;
                    if (OutLink.wayPoints[1].x <= sourceNode.anchors["West"].x)
                        OutLink.wayPoints[0].x = sourceNode.anchors["West"].x + StaticAttributes_1.gridStep;
                    OutLink.updateWayPoint();
                }
            }
            else
                OutLink.updateWayPoint();
            OutLink.dragShadowElt();
            if (!isTransitoryFlag) {
                this._graphModel.addLinkToGraph(OutLink);
            }
            return OutLink;
        }
        /**
         * method to deep clone a node inside a graph
         * @param node
         * @returns {Node} cloned node
         */
        cloneNode(node, cloneProps) {
            const clonedNodeId = this.generateUniqueObjectId();
            const clonedNode = Object.assign(Object.create(Object.getPrototypeOf(node)), { ...structuredClone(node), id: clonedNodeId });
            // set adds-on props
            if (cloneProps && typeof cloneProps.parentId !== "undefined")
                clonedNode.parentId = cloneProps.parentId;
            if (cloneProps && cloneProps.label)
                clonedNode.label = cloneProps.label;
            if (cloneProps && cloneProps.position) {
                clonedNode.position = Object.assign({}, cloneProps.position);
                clonedNode.dragShadowElt();
                clonedNode.updateAnchors();
            }
            this._graphModel.addNodeToGraph(clonedNode);
            return clonedNode;
        }
        /**
         * method to deep clone a link inside a graph
         * @param link
         * @returns {Link} cloned link
         */
        cloneLink(link, cloneProps) {
            const clonedLinkId = this.generateUniqueObjectId();
            const clonedLink = Object.assign(Object.create(Object.getPrototypeOf(link)), { ...structuredClone(link), id: clonedLinkId });
            // set adds-on props
            if (cloneProps && cloneProps.label)
                clonedLink.label = cloneProps.label;
            if (cloneProps && cloneProps.sourceId)
                clonedLink.sourceID = cloneProps.sourceId;
            if (cloneProps && cloneProps.targetId)
                clonedLink.targetID = cloneProps.targetId;
            if (cloneProps && cloneProps.wayPtsOffset) {
                clonedLink.wayPoints.forEach((wayPt) => {
                    wayPt.x += this._copyOffset;
                    wayPt.y += this._copyOffset;
                });
                clonedLink.dragShadowElt();
            }
            this._graphModel.addLinkToGraph(clonedLink);
            return clonedLink;
        }
        createGraph(listOfElts) {
            const newGraph = new Map();
            // affectation
            listOfElts.forEach((graphElt) => {
                newGraph.set(graphElt.id, graphElt);
            });
            // update links intersection Points
            this._graphModel._graphElts = newGraph;
        }
        pastClipBoardObjects() {
            const listOfPastedObjects = this.duplicateElts(this._clipBoardObjects, this._copyOffset);
            this._copyOffset += 2 * StaticAttributes_1.gridStep;
            return listOfPastedObjects;
        }
        duplicateElts(listOfEltsToDuplicate, offset = 0) {
            const listOfduplicates = [];
            const listOfNodesToDuplicate = listOfEltsToDuplicate.filter((elt) => elt instanceof Node_1.Node);
            const listOfLinksToDuplicate = listOfEltsToDuplicate.filter((elt) => elt instanceof Link_1.Link);
            const nodesOldIdsMap = new Map();
            listOfNodesToDuplicate.forEach((node) => {
                node.setIsDeselected();
                const pastedNodeProps = this.defineCloneNodeProps(node, nodesOldIdsMap, offset);
                const clonedNode = this.cloneNode(node, pastedNodeProps);
                nodesOldIdsMap.set(node.id, clonedNode.id);
                listOfduplicates.push(clonedNode);
            });
            listOfLinksToDuplicate.forEach((link) => {
                link.setIsDeselected();
                const pastedLinkProps = this.defineCloneLinkProps(link, nodesOldIdsMap, offset);
                const clonedLink = this.cloneLink(link, pastedLinkProps);
                listOfduplicates.push(clonedLink);
            });
            return listOfduplicates;
        }
        updateGraphElement(updatePayload) {
            const selectedElts = this._graphModel.getSelectedElts();
            if ((selectedElts.length !== 1) && !(updatePayload.id) && ((selectedElts.length === 1 && updatePayload.id && selectedElts[0].id !== updatePayload.id)))
                return null;
            const elementId = updatePayload.id ? updatePayload.id : selectedElts[0].id;
            if (!this._graphModel.has(elementId))
                return null;
            const graphElt = this._graphModel.getEltById(elementId);
            // update props
            if (typeof updatePayload.label !== "undefined") {
                graphElt.label = updatePayload.label === " " ? "" : updatePayload.label.split("\"").join("\'"); // label
                const [labelWidth, labelHeight] = (0, TextComputations_1.computeLabelDimensionsOfGraphElt)(graphElt);
                graphElt.width = labelWidth;
                graphElt.height = labelHeight;
            }
            if (typeof updatePayload.editMode !== "undefined")
                graphElt.editMode = updatePayload.editMode; // editMode
            if (updatePayload.status)
                graphElt.status = updatePayload.status;
            if (updatePayload.data)
                graphElt.data = updatePayload.data;
            if (updatePayload.color)
                graphElt.setColor(updatePayload.color);
            if (updatePayload.width)
                graphElt.width = updatePayload.width;
            if (updatePayload.height)
                graphElt.height = updatePayload.height;
            if (updatePayload.position && graphElt instanceof Node_1.Node)
                graphElt.moveToPosition(updatePayload.position.x, updatePayload.position.y);
            if (updatePayload.parentId && graphElt instanceof Node_1.Node)
                graphElt.parentId = updatePayload.parentId;
            if (updatePayload.wayPoints && graphElt instanceof Link_1.Link) {
                graphElt.wayPoints = structuredClone([...updatePayload.wayPoints]);
                graphElt.dragShadowElt();
            }
            if (updatePayload.sourceSide && graphElt instanceof Link_1.Link)
                graphElt.sourceSide = updatePayload.sourceSide;
            if (updatePayload.targetSide && graphElt instanceof Link_1.Link)
                graphElt.targetSide = updatePayload.targetSide;
            if (updatePayload.type && updatePayload.type !== graphElt.type) { //type
                const typeCompatibiltyGuard = (graphElt instanceof Node_1.Node) ? StaticAttributes_1.nodeTypes.includes(updatePayload.type) : StaticAttributes_1.linkTypes.includes(updatePayload.type);
                if (!typeCompatibiltyGuard)
                    return graphElt;
                graphElt.type = updatePayload.type;
                const newDimensions = StaticAttributes_1.nodeDimensionsSet.get(updatePayload.type);
                if (graphElt instanceof Node_1.Node && newDimensions) {
                    graphElt.position = { x: graphElt.anchors["Center"].x - newDimensions[0] / 2, y: graphElt.anchors["Center"].y - newDimensions[1] / 2 };
                    // reset
                    graphElt.data = {};
                    graphElt.width = newDimensions[0];
                    graphElt.height = newDimensions[1];
                    graphElt.updateAnchors();
                    graphElt.dragShadowElt();
                }
            }
            if (typeof updatePayload.selected !== "undefined") {
                graphElt.isSelected = updatePayload.selected;
            } // selection
            return graphElt;
        }
        updateGraphEltId(oldId, newId) {
            const graphElt = this.getGraphEltById(oldId);
            if (!graphElt)
                return { oldElt: null, newElt: null };
            if (graphElt instanceof Node_1.Node) {
                const childrenList = this._graphModel.getChildren(graphElt).filter((elt) => elt instanceof Node_1.Node);
                childrenList.forEach((child) => child.parentId = newId);
                const inLinkList = this._graphModel.getInLinkList(graphElt);
                inLinkList.forEach((inLink) => inLink.targetID = newId);
                const outLinkList = this._graphModel.getOutLinkList(graphElt);
                outLinkList.forEach((outLink) => outLink.sourceID = newId);
            }
            const oldElt = Object.assign(Object.create(Object.getPrototypeOf(graphElt)), { ...structuredClone(graphElt), id: oldId });
            this._graphModel.updateEltId(oldId, newId);
            return { oldElt: oldElt, newElt: graphElt };
        }
        deleteGraphElement(id) {
            if (this._graphModel.has(id))
                this._graphModel.delete(id);
        }
        deleteGraphElements(listOfElts) {
            listOfElts.forEach((value) => {
                if (typeof value !== "undefined")
                    this.deleteGraphElement(value.id);
            });
        }
        /** create connection (existingNode,existingNode)  Or (existingNode,newNode) */
        startDragToCreateConnection() {
            this._defaultCreatedNodeType = "Node";
            const sourceNode = this._graphModel.getSelectedElts()[0];
            if (!(sourceNode instanceof Node_1.Node))
                return {};
            this._sourceNodeId = sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.id;
            const link = this.createLinkBteweenTwoNodes(true, "", this._sourceNodeId, "", false, { x: sourceNode.anchors["East"].x, y: sourceNode.anchors["East"].y });
            return link;
        }
        updateDefaultConnectionNodeType(key) {
            const lowerCaseKey = key.toLowerCase();
            switch (lowerCaseKey) {
                case "n":
                    this._defaultCreatedNodeType = "Node";
                    break;
                case "g":
                    this._defaultCreatedNodeType = "GroupNode";
                    break;
                case "i":
                    this._defaultCreatedNodeType = "Initial";
                    break;
                case "c":
                    this._defaultCreatedNodeType = "Choice";
                    break;
                case "f":
                    this._defaultCreatedNodeType = "Final";
                    break;
                default:
                    this._defaultCreatedNodeType = "Node";
                    break;
            }
        }
        createConnection(targetId, clientX, clientY, svgLeftTop, transVector, createFlag) {
            let createdNode = null;
            const sourceNode = this._graphModel.getEltById(this._sourceNodeId);
            if (!(sourceNode instanceof Node_1.Node))
                return null;
            // target Node (properties)
            let targetNodeID = "";
            let targetNodeSide = "Center";
            let targetIsExisting = false;
            const targetElement = this._graphModel.getEltById(targetId);
            if ((targetElement instanceof Link_1.Link) && createFlag)
                return null;
            // pointer coordinates
            let xPos = (clientX - transVector[0] - svgLeftTop[0]) / transVector[2];
            let yPos = (clientY - transVector[1] - svgLeftTop[1]) / transVector[2];
            let xcoord = (0, GeometricalComputation_1.convertToGridCoord)(xPos);
            let ycoord = (0, GeometricalComputation_1.convertToGridCoord)(yPos);
            // check node ancestors and children (to prevent connection between the source and one of these elements)
            const listOfAncestorsId = (typeof sourceNode !== 'undefined' && sourceNode instanceof Node_1.Node) ? this._graphModel.getAncestors(sourceNode).map((ancestor) => ancestor.id) : [""];
            const listOfChildrenId = (typeof sourceNode !== 'undefined' && sourceNode instanceof Node_1.Node) ? this._graphModel.getChildren(sourceNode).map((child) => child.id) : [];
            // 1st case: the target doesn't exist (create new one)
            if (!this._graphModel.has(targetId) || listOfAncestorsId.includes(targetId) || listOfChildrenId.includes(targetId)) {
                const newNode = this.createNode(!createFlag, false, listOfAncestorsId[0], this._defaultCreatedNodeType, "", (0, LinksMovementsUtils_1.defineTargetNodePosition)(sourceNode, { x: xcoord, y: ycoord }, this._defaultCreatedNodeType));
                targetNodeID = newNode.id;
                createdNode = newNode;
            }
            // 2nd case: the target exists (choose the attachment side)
            else if (this._graphModel.has(targetId) && sourceNode instanceof Node_1.Node && targetElement instanceof Node_1.Node) {
                targetNodeID = targetElement.id;
                targetIsExisting = true;
                targetNodeSide = (0, LinksMovementsUtils_1.defineAttachmentSideFromPointerPosition)(targetElement, { x: xPos, y: yPos }, this._connectionAttachmentSide);
                if (targetNodeSide === "North") {
                    ycoord = targetElement.anchors["North"].y;
                    this._connectionAttachmentSide = "North";
                }
                if (targetNodeSide === "West") {
                    xcoord = targetElement.anchors["West"].x;
                    this._connectionAttachmentSide = "West";
                }
                if (targetNodeSide === "South") {
                    ycoord = targetElement.anchors["South"].y;
                    this._connectionAttachmentSide = "South";
                }
                if (targetNodeSide === "East") {
                    xcoord = targetElement.anchors["East"].x;
                    this._connectionAttachmentSide = "East";
                }
            }
            // connection element
            const newLink = this.createLinkBteweenTwoNodes(!createFlag, "", this._sourceNodeId, targetNodeID, targetIsExisting, { x: xcoord, y: ycoord }, targetNodeSide);
            return { link: newLink, createdNode: createdNode };
        }
        handleDropOnObject(eventTarget, droppedNode) {
            const eventTargetId = eventTarget.id.split("_")[1];
            const eventTargetElt = this._graphModel.getEltById(eventTargetId);
            const droppedNodeFriends = this._graphModel.getFriends(droppedNode); // when the node is already attached > avoid cyclic links
            if (eventTargetElt instanceof Node_1.Node && eventTargetElt.type === "GroupNode") {
                return { deletedLink: null, createdLink: null, secondCreatedLink: null, parentId: eventTargetId };
            }
            if (eventTargetElt instanceof Link_1.Link && !droppedNodeFriends.includes(eventTargetElt)) {
                const dropAreaIndex = (0, GeometricalComputation_1.findDropArea)(droppedNode, eventTargetElt.wayPoints, { x: droppedNode.anchors["Center"].x, y: droppedNode.anchors["Center"].y });
                const parentElt = this._graphModel.getParent(eventTargetElt);
                const parentId = parentElt.id ? parentElt.id : "";
                if (dropAreaIndex === -1)
                    return { deletedLink: null, createdLink: null, secondCreatedLink: null, parentId: "" };
                const [entrySide, exitSide] = (0, GeometricalComputation_1.findLinkEntryAndExitSide)(eventTargetElt.wayPoints[dropAreaIndex], eventTargetElt.wayPoints[dropAreaIndex + 1]);
                const firstSegmentWayPts = eventTargetElt.wayPoints.slice(0, dropAreaIndex + 1);
                const secondSegmentWayPts = eventTargetElt.wayPoints.slice(dropAreaIndex + 1);
                // create a new connection
                const newLink = this.createLink("Event", droppedNode.id, eventTargetElt.targetID);
                newLink.sourceSide = exitSide;
                newLink.targetSide = eventTargetElt.targetSide;
                newLink.wayPoints = [droppedNode.anchors[exitSide], ...secondSegmentWayPts];
                // update connection
                const secondPartLink = this.createLink("Event", eventTargetElt.sourceID, droppedNode.id);
                secondPartLink.targetSide = entrySide;
                secondPartLink.wayPoints = [...firstSegmentWayPts, droppedNode.anchors[entrySide]];
                return { deletedLink: eventTargetElt, createdLink: newLink, secondCreatedLink: secondPartLink, parentId: parentId };
            }
            return { deletedLink: null, createdLink: null, secondCreatedLink: null, parentId: "" };
        }
        clearModel() {
            this._graphModel._graphElts = new Map();
        }
        generateUniqueObjectId() {
            let nodeId = (0, UxActionsUtils_1.generateUniqueId)();
            // check unicity
            while (this._graphModel.has(nodeId)) {
                nodeId = (0, UxActionsUtils_1.generateUniqueId)();
            }
            return nodeId;
        }
        defineCloneNodeProps(node, oldIDsMap, offset) {
            const pastedObjectParentId = oldIDsMap.get(node.parentId);
            const parentObjectIsPasted = (typeof pastedObjectParentId) !== "undefined";
            if (this._graphModel.has(node.id)) // copy action
                return {
                    parentId: parentObjectIsPasted ? pastedObjectParentId : node.parentId,
                    label: (node.label && offset) ? node.label + `(copy${offset / (2 * StaticAttributes_1.gridStep)})` : node.label,
                    position: { x: node.position.x + offset, y: node.position.y + offset }
                };
            else { // cut action
                if (!parentObjectIsPasted)
                    return { parentId: "" }; // take an obejct out of its group
                return {
                    parentId: pastedObjectParentId,
                    label: node.label,
                    position: { x: node.position.x, y: node.position.y }
                };
            }
        }
        defineCloneLinkProps(link, oldIDsMap, offset) {
            const newSourceId = oldIDsMap.get(link.sourceID);
            const newTargetId = oldIDsMap.get(link.targetID);
            const isCopyAction = this._graphModel.has(link.id);
            if ((typeof newSourceId === "undefined") || (typeof newTargetId === "undefined"))
                return {};
            return {
                sourceId: newSourceId,
                targetId: newTargetId,
                label: (offset && link.label) ? link.label + `(copy${offset / (2 * StaticAttributes_1.gridStep)})` : link.label,
                wayPtsOffset: isCopyAction ? offset : 0,
            };
        }
        selectAll() {
            return this._graphModel.selectAll();
        }
        deselectAll() {
            return this._graphModel.deselectAll();
        }
        deSelectGraphElementsByIds(listOfIds) {
            const listOfEltsToDeselect = [];
            const selectedElts = this._graphModel.getSelectedElts();
            selectedElts.forEach((graphElt) => {
                if (!listOfIds.includes(graphElt.id)) {
                    graphElt.setIsDeselected();
                    listOfEltsToDeselect.push(graphElt);
                }
            });
            return listOfEltsToDeselect;
        }
        selectGraphElementsByIds(listOfIds) {
            const listOfEltsToSelect = [];
            listOfIds.forEach((id) => {
                const selectedElt = this._graphModel.selectGraphElt(id);
                listOfEltsToSelect.push(selectedElt);
            });
            return listOfEltsToSelect;
        }
        saveCurrentSnapshot() {
            const currentSnapshot = [];
            this._graphModel._graphElts.forEach((value) => {
                const deepCopyValue = Object.assign(Object.create(Object.getPrototypeOf(value)), { ...structuredClone(value) }); // structuredClone doesn't maintain the prototype chain
                currentSnapshot.push(deepCopyValue);
            });
            return currentSnapshot;
        }
        reset() {
            this._copyOffset = 0;
            this._clipBoardObjects = [];
        }
        generateMultipleNodes() {
            const horizontalNodesNum = 100;
            const verticalNodesNum = 10;
            const listOfNodes = [];
            for (let i = 0; i < horizontalNodesNum; i++) {
                for (let j = 0; j < verticalNodesNum; j++) {
                    const id = 1 / 2 * (i + j) * (i + j + 1) + j;
                    const node = new Node_1.Node(`${id}`, "Node", "Node" + i, { "x": i * 8 * StaticAttributes_1.gridStep + i * StaticAttributes_1.gridStep, "y": j * 4 * StaticAttributes_1.gridStep + j * StaticAttributes_1.gridStep }, 8 * StaticAttributes_1.gridStep, 4 * StaticAttributes_1.gridStep);
                    node.parentId = "";
                    this._graphModel._graphElts.set(`${id}`, node);
                    listOfNodes.push(node);
                }
            }
            return listOfNodes;
        }
    }
    exports.default = CUDManagerService;
});
