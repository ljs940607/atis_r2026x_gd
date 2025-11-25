/// <amd-module name="DS/DELGraphEditor/services/controllerServices/LayoutManagerService"/>
define("DS/DELGraphEditor/services/controllerServices/LayoutManagerService", ["require", "exports", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node", "DS/DELGraphEditor/models/QuadTreeStructure", "DS/DELGraphEditor/utils/LinksMovementsUtils", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphEditor/models/RTree", "DS/DELGraphEditor/utils/LayoutAlgorithms", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, Link_1, Node_1, QuadTreeStructure_1, LinksMovementsUtils_1, GeometricalComputation_1, RTree_1, LayoutAlgorithms_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LayoutManagerService {
        constructor(graphModel) {
            this._listOfOverlappingNodes = [];
            this._listOfIntersectionPoints = [];
            this._graphModel = graphModel;
            this._rTree = new RTree_1.RTree({ ...StaticAttributes_1.svgStaticPos, w: StaticAttributes_1.svgWidth, h: StaticAttributes_1.svgHeight });
            this._graphNodesQuadTree = new QuadTreeStructure_1.QuadTree(StaticAttributes_1.svgStaticPos, { w: StaticAttributes_1.svgWidth, h: StaticAttributes_1.svgHeight }, 0, 4, 1000);
            this._graphLinksQuadTree = new QuadTreeStructure_1.QuadTree(StaticAttributes_1.svgStaticPos, { w: StaticAttributes_1.svgWidth, h: StaticAttributes_1.svgHeight }, 0, 8, 1000);
        }
        /** Spacing algorithms */
        getRightElementsToPoint(limitPos, listOfIds) {
            const rightElements = [];
            const [nodeWidth, nodeHeight] = [8 * StaticAttributes_1.gridStep, 4 * StaticAttributes_1.gridStep];
            let quadTreeNodes = this._graphNodesQuadTree.queryRightNodes({ leftTopCorner: { "x": limitPos.x, "y": limitPos.y }, dimension: { w: nodeWidth, h: nodeHeight }, objectModelId: "", objectModelParentId: "" });
            if (listOfIds)
                quadTreeNodes = quadTreeNodes.filter((QuadTreeNode) => listOfIds.includes(QuadTreeNode.objectModelId));
            // graphModel mapping with quadTree nodes
            quadTreeNodes.forEach((quadTreeNode) => {
                rightElements.push(this._graphModel.getEltById(quadTreeNode.objectModelId));
            });
            return rightElements;
        }
        getTopElementsToPoint(limitPos, listOfIds) {
            const topElements = [];
            const [nodeWidth, nodeHeight] = [8 * StaticAttributes_1.gridStep, 4 * StaticAttributes_1.gridStep];
            let quadTreeNodes = this._graphNodesQuadTree.queryTopNodes({ leftTopCorner: { "x": limitPos.x, "y": limitPos.y }, dimension: { w: nodeWidth, h: nodeHeight }, objectModelId: "", objectModelParentId: "" });
            if (listOfIds)
                quadTreeNodes = quadTreeNodes.filter((QuadTreeNode) => listOfIds.includes(QuadTreeNode.objectModelId));
            quadTreeNodes.forEach((quadTreeNode) => {
                topElements.push(this._graphModel.getEltById(quadTreeNode.objectModelId));
            });
            return topElements;
        }
        getLeftElementsToPoint(limitPos, listOfIds) {
            const leftElements = [];
            const [nodeWidth, nodeHeight] = [8 * StaticAttributes_1.gridStep, 4 * StaticAttributes_1.gridStep];
            let quadTreeNodes = this._graphNodesQuadTree.queryLeftNodes({ leftTopCorner: { "x": limitPos.x, "y": limitPos.y }, dimension: { w: nodeWidth, h: nodeHeight }, objectModelId: "", objectModelParentId: "" });
            if (listOfIds)
                quadTreeNodes = quadTreeNodes.filter((QuadTreeNode) => listOfIds.includes(QuadTreeNode.objectModelId));
            quadTreeNodes.forEach((quadTreeNode) => {
                leftElements.push(this._graphModel.getEltById(quadTreeNode.objectModelId));
            });
            return leftElements;
        }
        getBottomElementsToPoint(limitPos, listOfIds) {
            const bottomElements = [];
            const [nodeWidth, nodeHeight] = [8 * StaticAttributes_1.gridStep, 4 * StaticAttributes_1.gridStep];
            let quadTreeNodes = this._graphNodesQuadTree.queryBottomNodes({ leftTopCorner: { "x": limitPos.x, "y": limitPos.y }, dimension: { w: nodeWidth, h: nodeHeight }, objectModelId: "", objectModelParentId: "" });
            if (listOfIds)
                quadTreeNodes = quadTreeNodes.filter((QuadTreeNode) => listOfIds.includes(QuadTreeNode.objectModelId));
            quadTreeNodes.forEach((quadTreeNode) => {
                bottomElements.push(this._graphModel.getEltById(quadTreeNode.objectModelId));
            });
            return bottomElements;
        }
        findSpaceNeighbors(node, axis, direction) {
            const listOfPossibleNeighbors = [];
            let neighborhoodBoundingBOx = { x: 0, y: 0, w: 0, h: 0 };
            const nodeParent = this._graphModel.getParent(node);
            // define neighbors search area
            const nodeParentChildren = this._graphModel.getChildren(nodeParent).filter((child) => (child instanceof Node_1.Node && node instanceof Node_1.Node) && child.id !== node.id && child.parentId === node.parentId);
            if (axis === 'xaxis') {
                if (direction === "right") {
                    let rightQuadTreeNodes = this._graphNodesQuadTree.queryRightNodes({ leftTopCorner: { "x": node.position.x, "y": node.position.y }, dimension: { w: node.width, h: node.height }, objectModelId: node.id, objectModelParentId: node.parentId });
                    if (nodeParentChildren.length > 0)
                        rightQuadTreeNodes = rightQuadTreeNodes.filter((node) => nodeParentChildren.includes(this._graphModel.getEltById(node.objectModelId)));
                    rightQuadTreeNodes.forEach((quadTreeNode) => listOfPossibleNeighbors.push(this._graphModel.getEltById(quadTreeNode.objectModelId)));
                }
                else {
                    let leftQuadTreeNodes = this._graphNodesQuadTree.queryLeftNodes({ leftTopCorner: { "x": node.position.x, "y": node.position.y }, dimension: { w: node.width, h: node.height }, objectModelId: node.id, objectModelParentId: node.parentId });
                    if (nodeParentChildren.length > 0)
                        leftQuadTreeNodes = leftQuadTreeNodes.filter((node) => nodeParentChildren.includes(this._graphModel.getEltById(node.objectModelId)));
                    leftQuadTreeNodes.forEach((quadTreeNode) => listOfPossibleNeighbors.push(this._graphModel.getEltById(quadTreeNode.objectModelId)));
                }
            }
            else {
                if (direction === "top") {
                    let topQuadTreeNodes = this._graphNodesQuadTree.queryTopNodes({ leftTopCorner: { "x": node.position.x, "y": node.position.y }, dimension: { w: node.width, h: node.height }, objectModelId: node.id, objectModelParentId: node.parentId });
                    if (nodeParentChildren.length > 0)
                        topQuadTreeNodes = topQuadTreeNodes.filter((node) => nodeParentChildren.includes(this._graphModel.getEltById(node.objectModelId)));
                    topQuadTreeNodes.forEach((quadTreeNode) => listOfPossibleNeighbors.push(this._graphModel.getEltById(quadTreeNode.objectModelId)));
                }
                else {
                    let bottomQuadTreeNodes = this._graphNodesQuadTree.queryBottomNodes({ leftTopCorner: { "x": node.position.x, "y": node.position.y }, dimension: { w: node.width, h: node.height }, objectModelId: node.id, objectModelParentId: node.parentId });
                    if (nodeParentChildren.length > 0)
                        bottomQuadTreeNodes = bottomQuadTreeNodes.filter((node) => nodeParentChildren.includes(this._graphModel.getEltById(node.objectModelId)));
                    bottomQuadTreeNodes.forEach((quadTreeNode) => listOfPossibleNeighbors.push(this._graphModel.getEltById(quadTreeNode.objectModelId)));
                }
            }
            // neighborhood limits
            const neighborThreshold = 100 * StaticAttributes_1.gridStep;
            if (axis === 'xaxis') {
                if (direction === "right")
                    neighborhoodBoundingBOx = { x: node.position.x, y: node.position.y, w: node.width + neighborThreshold, h: node.height };
                if (direction === "left")
                    neighborhoodBoundingBOx = { x: node.position.x - (node.width + neighborThreshold), y: node.position.y, w: node.width + neighborThreshold, h: node.height };
            }
            else {
                if (direction === "bottom")
                    neighborhoodBoundingBOx = { x: node.position.x, y: node.position.y, w: node.width, h: neighborThreshold + node.height };
                if (direction === "top")
                    neighborhoodBoundingBOx = { x: node.position.x, y: node.position.y - (neighborThreshold + node.height), w: node.width, h: (neighborThreshold + node.height) };
            }
            let listOfNeighbors = listOfPossibleNeighbors.filter((graphObject) => {
                const objectBoundingBox = (0, GeometricalComputation_1.computeBoundingBoxOfNode)(graphObject);
                const boxesIntersectionGuard = (0, GeometricalComputation_1.checkRectangleIntersection)(objectBoundingBox, neighborhoodBoundingBOx);
                const graphObjectParent = this._graphModel.getParent(graphObject);
                const nodeParent = this._graphModel.getParent(node);
                const ancestorGuard = graphObject instanceof Node_1.Node && !this._graphModel.getAncestors(node).includes(graphObject);
                return !this._graphModel.getChildren(node).includes(graphObject) && (graphObject instanceof Link_1.Link || ancestorGuard) && (!graphObjectParent || (graphObjectParent && nodeParent && graphObjectParent.id === nodeParent.id)) && (boxesIntersectionGuard);
            });
            // add neighbors of neighbors > mvt propagation
            // let listOfSecondNeighbors: GraphElt[] = [];
            // listOfNeighbors.forEach((neighbor: GraphElt) => listOfSecondNeighbors = [...listOfSecondNeighbors, ...this._graphModel.getNeighbors(neighbor)])
            // const expandedListOfNeighbors: GraphElt[] = [...listOfNeighbors, ...listOfSecondNeighbors];
            return listOfNeighbors.filter((graphObject, index) => listOfNeighbors.indexOf(graphObject) === index && graphObject.id !== node.id);
        }
        resizeNode(node, newWidth, newHeight, shfitNeighborsFlag = true) {
            const childrenList = this._graphModel.getChildren(node);
            if (childrenList.length > 0) {
                const leftOffset = childrenList.length === 1 ? 2 * StaticAttributes_1.gridStep : StaticAttributes_1.gridStep;
                const childrenBd = (0, GeometricalComputation_1.computeBoundingBoxOfSelection)(childrenList);
                const metaDataBodyOffset = node.data.body ? 4 * StaticAttributes_1.gridStep : 0;
                const groupBoundingBox = { x: childrenBd.x - leftOffset, y: childrenBd.y - 3 * StaticAttributes_1.gridStep - metaDataBodyOffset, w: childrenBd.w + 2 * leftOffset, h: childrenBd.h + 3 * StaticAttributes_1.gridStep + metaDataBodyOffset + leftOffset };
                const widthLimit = Math.max(newWidth, groupBoundingBox.w);
                const heightLimit = Math.max(newHeight, groupBoundingBox.h);
                const rightBottomDelta = { "x": (groupBoundingBox.x - node.position.x), "y": (groupBoundingBox.y - node.position.y) };
                const leftTopDelta = { "x": (groupBoundingBox.x + widthLimit) - (node.position.x + node.width), "y": (groupBoundingBox.y + heightLimit) - (node.position.y + node.height) };
                node.moveToPosition(groupBoundingBox.x, groupBoundingBox.y);
                node.width = widthLimit;
                node.height = heightLimit;
                node.updateAnchors();
                if (!shfitNeighborsFlag)
                    return [node];
                return [node, ...this.handleSpaceBetweenNeighbors(node, rightBottomDelta, leftTopDelta)];
            }
            else {
                const leftTopDelta = { "x": newWidth - node.width, "y": newHeight - node.height };
                node.width = newWidth;
                node.height = newHeight;
                node.updateAnchors();
                node.dragShadowElt();
                return [node, ...this.handleSpaceBetweenNeighbors(node, { x: 0, y: 0 }, leftTopDelta)];
            }
        }
        resizeListOfAncestors(listOfancestors) {
            if (listOfancestors.length === 0)
                return [];
            let updatedNodesList = [];
            listOfancestors.map((ancestor) => {
                if (ancestor instanceof Node_1.Node) {
                    if (!ancestor.isDragged)
                        ancestor.setIsNotDragged();
                    ancestor.dragShadowElt();
                    const shiftedNodes = this.resizeNode(ancestor, ancestor.width, ancestor.height);
                    updatedNodesList = [...updatedNodesList, ...shiftedNodes];
                }
            });
            return updatedNodesList;
        }
        handleSpaceBetweenNeighbors(node, leftTopDelta, rightBottomDelta) {
            let listOfUpdatedElts = [];
            const bdNode = (0, GeometricalComputation_1.computeBoundingBoxOfElt)(node);
            if (rightBottomDelta.x !== 0) {
                const rightNeighbors = this.findSpaceNeighbors(node, "xaxis", "right");
                const bdRn = (0, GeometricalComputation_1.computeBoundingBoxOfElt)(rightNeighbors[0]);
                if ((0, GeometricalComputation_1.checkRectangleIntersection)(bdNode, bdRn)) {
                    rightNeighbors.forEach((rn) => {
                        if (rn.isSelected)
                            rn.setIsDeselected();
                        rn.shiftToRight(rightBottomDelta.x);
                        rn.dragShadowElt();
                        const outLinks = this._graphModel.getOutLinkList(rn);
                        const inLinks = this._graphModel.getInLinkList(rn);
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, outLinks, "sourceSide");
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, inLinks, "targetSide");
                        listOfUpdatedElts = [...listOfUpdatedElts, rn, ...inLinks, ...outLinks];
                        // special cases
                        if (this._graphModel.getChildren(rn).length > 0) {
                            const neighborChildren = this._graphModel.getChildren(rn);
                            neighborChildren.forEach((child) => {
                                child.shiftToRight(rightBottomDelta.x);
                                child.dragShadowElt();
                            });
                            listOfUpdatedElts = [...listOfUpdatedElts, ...neighborChildren];
                        }
                    });
                }
            }
            if (rightBottomDelta.y !== 0) {
                // console.log("bottom",rightBottomDelta.y);
                const bottomNeighbors = this.findSpaceNeighbors(node, "yaxis", "bottom");
                const bdRn = (0, GeometricalComputation_1.computeBoundingBoxOfElt)(bottomNeighbors[0]);
                if ((0, GeometricalComputation_1.checkRectangleIntersection)(bdNode, bdRn)) {
                    bottomNeighbors.forEach((rn) => {
                        if (rn.isSelected)
                            rn.setIsDeselected();
                        rn.shiftToBottom(rightBottomDelta.y);
                        rn.dragShadowElt();
                        const outLinks = this._graphModel.getOutLinkList(rn);
                        const inLinks = this._graphModel.getInLinkList(rn);
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, outLinks, "sourceSide");
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, inLinks, "targetSide");
                        listOfUpdatedElts = [...listOfUpdatedElts, rn, ...inLinks, ...outLinks];
                        // special cases
                        if (rn instanceof Node_1.Node && this._graphModel.getChildren(rn).length > 0) {
                            const neighborChildren = this._graphModel.getChildren(rn);
                            neighborChildren.forEach((child) => {
                                child.shiftToBottom(rightBottomDelta.y);
                                child.dragShadowElt();
                            });
                            listOfUpdatedElts = [...listOfUpdatedElts, ...neighborChildren];
                        }
                    });
                }
            }
            if (leftTopDelta.x !== 0) {
                // console.log("left",leftTopDelta.x);
                const leftNeighbors = this.findSpaceNeighbors(node, "xaxis", "left");
                const bdRn = (0, GeometricalComputation_1.computeBoundingBoxOfElt)(leftNeighbors[0]);
                if ((0, GeometricalComputation_1.checkRectangleIntersection)({ ...bdNode, x: bdNode.x - StaticAttributes_1.gridStep }, bdRn)) {
                    leftNeighbors.forEach((rn) => {
                        if (rn.isSelected)
                            rn.setIsDeselected();
                        rn.shiftToLeft(-leftTopDelta.x);
                        rn.dragShadowElt();
                        const outLinks = this._graphModel.getOutLinkList(rn);
                        const inLinks = this._graphModel.getInLinkList(rn);
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, outLinks, "sourceSide");
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, inLinks, "targetSide");
                        listOfUpdatedElts = [...listOfUpdatedElts, rn, ...inLinks, ...outLinks];
                        // special cases
                        if (rn instanceof Node_1.Node && this._graphModel.getChildren(rn).length > 0) {
                            const neighborChildren = this._graphModel.getChildren(rn);
                            neighborChildren.forEach((child) => {
                                child.shiftToLeft(-leftTopDelta.x);
                                child.dragShadowElt();
                            });
                            listOfUpdatedElts = [...listOfUpdatedElts, ...neighborChildren];
                        }
                    });
                }
            }
            if (leftTopDelta.y !== 0) {
                // console.log("top",leftTopDelta.y);
                const topNeighbors = this.findSpaceNeighbors(node, "yaxis", "top");
                const bdRn = (0, GeometricalComputation_1.computeBoundingBoxOfElt)(topNeighbors[0]);
                if ((0, GeometricalComputation_1.checkRectangleIntersection)({ ...bdNode, y: bdNode.y - StaticAttributes_1.gridStep }, bdRn)) {
                    topNeighbors.forEach((rn) => {
                        if (rn.isSelected)
                            rn.setIsDeselected();
                        rn.shiftToTop(-leftTopDelta.y);
                        rn.dragShadowElt();
                        const outLinks = this._graphModel.getOutLinkList(rn);
                        const inLinks = this._graphModel.getInLinkList(rn);
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, outLinks, "sourceSide");
                        (0, LinksMovementsUtils_1.attachLinksToNode)(rn, inLinks, "targetSide");
                        listOfUpdatedElts = [...listOfUpdatedElts, rn, ...inLinks, ...outLinks];
                        // special cases
                        if (rn instanceof Node_1.Node && this._graphModel.getChildren(rn).length > 0) {
                            const neighborChildren = this._graphModel.getChildren(rn);
                            neighborChildren.forEach((child) => {
                                child.shiftToTop(-leftTopDelta.y);
                                child.dragShadowElt();
                            });
                            listOfUpdatedElts = [...listOfUpdatedElts, ...neighborChildren];
                        }
                    });
                }
            }
            return listOfUpdatedElts;
        }
        findGraphEltsInsideBoundingBox(boundingBox) {
            let returnedListOfOBjects = [];
            this._graphModel._graphElts.forEach((value) => {
                const graphObjectBoundingBox = (value instanceof Node_1.Node) ? (0, GeometricalComputation_1.computeBoundingBoxOfNode)(value) : (value instanceof Link_1.Link) ? (0, GeometricalComputation_1.computeBoundingBoxOfLink)(value) : { x: 0, y: 0, w: 0, h: 0 };
                const selectionGuard = (0, GeometricalComputation_1.checkRectangleIntersection)(graphObjectBoundingBox, boundingBox);
                if (selectionGuard)
                    returnedListOfOBjects.push(value);
            });
            return returnedListOfOBjects.filter((graphObject, index) => returnedListOfOBjects.indexOf(graphObject) === index);
        }
        findGraphEltsInsideBoundingBoxUsingRtree(boundingBox) {
            let returnedListOfOBjects = [];
            const rtreeBox = this._rTree.search(boundingBox);
            const rtreeChildNodes = this._rTree.getAllChildNodes(rtreeBox);
            rtreeChildNodes.forEach((child) => {
                if ((0, GeometricalComputation_1.checkRectangleIntersection)(child.boundingRect, boundingBox)) {
                    returnedListOfOBjects.push(this._graphModel.getEltById(child.objectModelId));
                }
            });
            return returnedListOfOBjects;
        }
        findGraphEltsInsideBoundingBoxUsingQuadtree(boundingBox) {
            let returnedListOfOBjects = [];
            const treeNodes = this._graphNodesQuadTree.findEnclosingQuarterV2(boundingBox);
            const treeLinks = this._graphLinksQuadTree.findEnclosingQuarterV2(boundingBox);
            treeNodes.forEach((child) => returnedListOfOBjects.push(this._graphModel.getEltById(child.objectModelId)));
            treeLinks.forEach((child) => returnedListOfOBjects.push(this._graphModel.getEltById(child.objectModelId)));
            return returnedListOfOBjects;
        }
        /** QuadTree methods */
        addGraphEltsToQuadTree(graphElts) {
            graphElts.forEach((graphElt) => {
                if (graphElt instanceof Node_1.Node)
                    this.addNodeToQuadTree(graphElt);
                if (graphElt instanceof Link_1.Link)
                    this.addLinkToQuadTree(graphElt);
            });
        }
        removeGraphEltsFromQuadTree(graphElts) {
            graphElts.forEach((graphElt) => {
                if (graphElt instanceof Node_1.Node)
                    this.removeNodeFromQuadTree(graphElt);
                if (graphElt instanceof Link_1.Link)
                    this.removeLinkFromQuadTree(graphElt);
            });
        }
        addNodeToQuadTree(node) {
            this.attachPositionTracker(node);
            this.attachWidthTracker(node);
            this.attachHeightTracker(node);
            const quadTreeNode = { leftTopCorner: node.position, dimension: { w: node.width, h: node.height }, objectModelId: node.id, objectModelParentId: node.parentId };
            this._graphNodesQuadTree.insert(quadTreeNode);
            this._rTree.insert({ ...node.position, w: node.width, h: node.height }, node.id, node.parentId);
        }
        addLinkToQuadTree(link) {
            const parentNode = this._graphModel.getAncestors(link).length > 0 ? this._graphModel.getAncestors(link)[0] : this._graphModel.getParent(link);
            this.attachWayPointsTracker(link);
            link.wayPoints.forEach((wayPt, index) => {
                if (index !== (link.wayPoints.length - 1)) {
                    const nextWayPt = link.wayPoints[index + 1];
                    if (nextWayPt) {
                        const quadTreeElt = { leftTopCorner: wayPt, dimension: { w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, objectModelId: link.id, objectModelParentId: parentNode.id };
                        this._graphLinksQuadTree.insert(quadTreeElt);
                        this._rTree.insert({ ...wayPt, w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, link.id, parentNode.id);
                    }
                }
            });
            // update intersection Points
            this._listOfIntersectionPoints = this._graphLinksQuadTree.checkOrthogonalIntersectionv2();
        }
        removeNodeFromQuadTree(node) {
            const quadTreeNode = { leftTopCorner: node.position, dimension: { w: node.width, h: node.height }, objectModelId: node.id, objectModelParentId: node.parentId };
            this._graphNodesQuadTree.remove(quadTreeNode);
            this._rTree.delete({ ...node.position, w: node.width, h: node.height }, node.id);
        }
        removeLinkFromQuadTree(link) {
            const parentNode = this._graphModel.getParent(link);
            //remove
            link.wayPoints.forEach((wayPt, index) => {
                if (index !== (link.wayPoints.length - 1)) {
                    const nextWayPt = link.wayPoints[index + 1];
                    if (nextWayPt) {
                        const quadTreeElt = { leftTopCorner: wayPt, dimension: { w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, objectModelId: link.id, objectModelParentId: parentNode.parentId };
                        this._graphLinksQuadTree.remove(quadTreeElt);
                        this._rTree.delete({ ...wayPt, w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, link.id);
                    }
                }
            });
            // update intersection Points
            this._listOfIntersectionPoints = this._graphLinksQuadTree.checkOrthogonalIntersectionv2();
        }
        updateLinkToQuadTree(oldWayPts, link) {
            const parentNode = this._graphModel.getParent(link);
            //remove
            oldWayPts.forEach((wayPt, index) => {
                if (index !== (oldWayPts.length - 1)) {
                    const nextWayPt = oldWayPts[index + 1];
                    if (nextWayPt) {
                        const quadTreeElt = { leftTopCorner: wayPt, dimension: { w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, objectModelId: link.id, objectModelParentId: parentNode.parentId };
                        this._graphLinksQuadTree.remove(quadTreeElt);
                        this._rTree.delete({ ...wayPt, w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, link.id);
                    }
                }
            });
            //update
            link.wayPoints.forEach((wayPt, index) => {
                if (index !== (link.wayPoints.length - 1)) {
                    const nextWayPt = link.wayPoints[index + 1];
                    if (nextWayPt) {
                        const quadTreeElt = { leftTopCorner: wayPt, dimension: { w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, objectModelId: link.id, objectModelParentId: parentNode.parentId };
                        this._graphLinksQuadTree.insert(quadTreeElt);
                        this._rTree.insert({ ...wayPt, w: (nextWayPt.x - wayPt.x), h: (nextWayPt.y - wayPt.y) }, link.id, parentNode.id);
                    }
                }
            });
            // update intersection Points
            this._listOfIntersectionPoints = this._graphLinksQuadTree.checkOrthogonalIntersectionv2();
        }
        // position, dimension, wayPoints trackers
        attachPositionTracker(node) {
            const that = this;
            // position tracker
            let val = node.shadowEltPosition;
            Object.defineProperty(node, "shadowEltPosition", {
                get() {
                    return val;
                },
                set(newData) {
                    that._graphNodesQuadTree.update(node.id, node.parentId, { ...val, w: node.width, h: node.height }, { ...newData, w: node.width, h: node.height });
                    if (!node.isDragged) {
                        that._rTree.delete({ ...val, w: node.width, h: node.height }, node.id);
                        that._rTree.insert({ ...newData, w: node.width, h: node.height }, node.id, node.parentId);
                    }
                    val = newData;
                },
                enumerable: true
            });
        }
        attachWidthTracker(node) {
            const that = this;
            // dimensions tracker (width)
            let widthVal = node.width;
            Object.defineProperty(node, "width", {
                get() {
                    return widthVal;
                },
                set(newWidth) {
                    that._graphNodesQuadTree.update(node.id, node.parentId, { ...node.position, w: widthVal, h: node.height }, { ...node.position, w: newWidth, h: node.height });
                    // if (!node.isDragged) {
                    //     that._rTree.delete({ ...node.position, w: widthVal, h: node.height }, node.id);
                    //     that._rTree.insert({ ...node.position, w: newWidth, h: node.height }, node.id, node.parentId);
                    // }
                    widthVal = newWidth;
                },
                enumerable: true
            });
        }
        attachHeightTracker(node) {
            const that = this;
            // dimensions tracker (height)
            let heightVal = node.height;
            Object.defineProperty(node, "height", {
                get() {
                    return heightVal;
                },
                set(newHeight) {
                    that._graphNodesQuadTree.update(node.id, node.parentId, { ...node.position, w: node.width, h: heightVal }, { ...node.position, w: node.width, h: newHeight });
                    // if (!node.isDragged) {
                    //     that._rTree.delete({ ...node.position, w: heightVal, h: node.height }, node.id);
                    //     that._rTree.insert({ ...node.position, w: newHeight, h: node.height }, node.id, node.parentId);
                    // }
                    heightVal = newHeight;
                },
                enumerable: true
            });
        }
        attachWayPointsTracker(link) {
            const that = this;
            let val = link.shadowEltWayPoints;
            Object.defineProperty(link, "_shadowEltWayPoints", {
                get() {
                    return val;
                },
                set(newData) {
                    that.updateLinkToQuadTree(val, link);
                    val = newData;
                },
                enumerable: true
            });
        }
        resizeGraphElt(graphElt, newWidth, newHeight) {
            if (graphElt instanceof Link_1.Link || (graphElt instanceof Node_1.Node && ["Initial", "Choice", "Final"].includes(graphElt.type))) {
                graphElt.width = newWidth;
                graphElt.height = newHeight;
                return [graphElt];
            }
            if (graphElt instanceof Node_1.Node) {
                const updatedElts = this.resizeNode(graphElt, newWidth, newHeight); // graphElts and neighbors impacted by the resize
                const graphEltsAncestors = this._graphModel.getAncestors(graphElt);
                const updatedAncestors = this.resizeListOfAncestors(graphEltsAncestors);
                return [...updatedElts, ...updatedAncestors];
            }
            return [];
        }
        defineParentGroupFromPosition(position) {
            const eventTargetId = document.elementFromPoint(position.x, position.y).id.split('_')[1];
            const targetElt = this._graphModel.getEltById(eventTargetId);
            if (targetElt)
                return targetElt.id;
            return '';
        }
        defineSameLevelElements(parentLevel) {
            const sameLevelObjects = [];
            this._graphModel._graphElts.forEach((value) => {
                if (value instanceof Node_1.Node && value.parentId === parentLevel)
                    sameLevelObjects.push(value);
            });
            return sameLevelObjects;
        }
        reset() {
            this._graphLinksQuadTree.reset();
            this._graphNodesQuadTree.reset();
            this._rTree.reset();
        }
        updateListOfIntersectionsArcs() {
            this._listOfIntersectionPoints = this._graphLinksQuadTree.checkOrthogonalIntersectionv2();
        }
        defineEltsToShift(relativepointerPos, pointerSpacingPos, axis) {
            let listOfShiftedEltsAncestors = [];
            // check if the movement happens inside a group
            const possibleParentId = this.defineParentGroupFromPosition(relativepointerPos);
            let sameLevelElementsIds = this.defineSameLevelElements(possibleParentId).map((object) => object.id);
            // call layout manager to determine right,bottom elements according to the axis
            let listOfShiftedElts = (axis === "xaxis") ? this.getRightElementsToPoint(pointerSpacingPos, sameLevelElementsIds) : this.getBottomElementsToPoint(pointerSpacingPos, sameLevelElementsIds);
            const limitObjectList = (axis === "xaxis") ? this.getLeftElementsToPoint(pointerSpacingPos, sameLevelElementsIds) : this.getTopElementsToPoint(pointerSpacingPos, sameLevelElementsIds);
            // get the potential impacted objects by the movement
            let sameLevelGraphElements = [];
            listOfShiftedElts.forEach((sameLevelElement) => {
                if (sameLevelElement instanceof Node_1.Node) {
                    sameLevelGraphElements = [...this._graphModel.getChildren(sameLevelElement), ...sameLevelGraphElements].filter((elt) => elt instanceof Node_1.Node);
                    listOfShiftedEltsAncestors = [...listOfShiftedEltsAncestors, ...this._graphModel.getAncestors(sameLevelElement),];
                }
            });
            // add  children and related objects
            listOfShiftedElts = [...listOfShiftedElts, ...sameLevelGraphElements];
            listOfShiftedElts = listOfShiftedElts.filter((elt, index) => listOfShiftedElts.indexOf(elt) === index);
            listOfShiftedEltsAncestors = listOfShiftedEltsAncestors.filter((elt, index) => listOfShiftedEltsAncestors.indexOf(elt) === index);
            return { eltsToShift: listOfShiftedElts, ancestorsOfEltsToshift: listOfShiftedEltsAncestors, spacingLimitBoundingBox: limitObjectList.length > 0 ? [limitObjectList[0].position.x, limitObjectList[0].position.y, limitObjectList[0].width, limitObjectList[0].height] : [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0, 0] };
        }
        autoLayout(graphElts, rootId = "") {
            const nodes = graphElts.filter((graphElt) => graphElt instanceof Node_1.Node && graphElt.parentId === rootId);
            const parentNodes = nodes.filter((node) => this._graphModel.getChildren(node).length !== 0);
            const links = graphElts.filter((graphElt) => { var _a; return graphElt instanceof Link_1.Link && ((rootId === "") ? typeof this._graphModel.getParent(graphElt) !== "undefined" : ((_a = this._graphModel.getParent(graphElt)) === null || _a === void 0 ? void 0 : _a.id) === rootId); });
            const rankedNodesIds = (0, LayoutAlgorithms_1.rankingAutoLayoutAlgorithms)(nodes, links);
            let index = -1, preValue = -1, widthInRow = 4 * StaticAttributes_1.gridStep, heightInColumn = 2 * StaticAttributes_1.gridStep;
            for (let i = 0; i < parentNodes.length; i++) {
                this.autoLayout(graphElts, parentNodes[i].id); //recursivity
                this.resizeNode(parentNodes[i], 8 * StaticAttributes_1.gridStep, 4 * StaticAttributes_1.gridStep, true);
            }
            rankedNodesIds.forEach((value, key) => {
                if (preValue === value) { // same column 
                    index++;
                }
                else
                    index = 0; // different rank > different row
                const node = this._graphModel.getEltById(key);
                const nodeCurrentPos = Object.assign({}, node.position);
                if (!(node instanceof Node_1.Node))
                    console.error('invalid node id');
                else {
                    node.moveToPosition(widthInRow, heightInColumn);
                    if (parentNodes.includes(node)) {
                        const childNodes = this._graphModel.getChildren(node).filter((childElt) => childElt instanceof Node_1.Node);
                        childNodes.forEach((childNode) => childNode.setPos(node.position.x - nodeCurrentPos.x, node.position.y - nodeCurrentPos.y));
                    }
                    if (preValue === value) { // same column
                        widthInRow = Math.max(6 * StaticAttributes_1.gridStep * (value), widthInRow);
                        heightInColumn = node.height + node.position.y + StaticAttributes_1.gridStep;
                    }
                    else { // same row
                        widthInRow = node.width + node.position.x + 3 * StaticAttributes_1.gridStep;
                        heightInColumn = Math.max(StaticAttributes_1.gridStep * (index), heightInColumn);
                    }
                }
                preValue = value;
            });
            for (let k = 0; k < links.length; k++) {
                const sourceNode = this._graphModel.getEltById(links[k].sourceID);
                const targetNode = this._graphModel.getEltById(links[k].targetID);
                if (sourceNode instanceof Node_1.Node && targetNode instanceof Node_1.Node) {
                    const [sourceSide, targetSide] = (0, LinksMovementsUtils_1.defineConnectorsAttachmentSides)(sourceNode, targetNode);
                    links[k].sourceSide = sourceSide;
                    links[k].targetSide = targetSide;
                    links[k].wayPoints = [sourceNode.anchors[links[k].sourceSide], targetNode.anchors[links[k].targetSide]];
                    links[k].updateWayPoint();
                    links[k].dragShadowElt();
                }
                else {
                    window.alert(`Error: sourceNode/targetNode are not found for ${links[k].id}`);
                }
            }
        }
    }
    exports.default = LayoutManagerService;
});
