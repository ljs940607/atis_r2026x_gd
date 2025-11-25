/// <amd-module name="DS/DELGraphEditor/models/QuadTreeStructure"/>
define("DS/DELGraphEditor/models/QuadTreeStructure", ["require", "exports", "DS/DELGraphEditor/utils/GeometricalComputation"], function (require, exports, GeometricalComputation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuadTree = void 0;
    class QuadTree {
        constructor(leftTopCorner, dimension, depthLevel, maxCapacity, maxLevels) {
            // _childNodes for leaf quadTree (not split yet)
            this._childNodes = [];
            // quarters 
            this._quarters = null;
            this._leftTopCorner = leftTopCorner;
            this._dimension = dimension;
            this._level = depthLevel;
            this._maxCapacity = maxCapacity;
            this._maxLevels = maxLevels;
        }
        subDivide() {
            /**
             * //------//-------//
             * // TL   //   TR  //
             * //------//-------//
             * //  BL  // BR    //
             * //------//-------//
             */
            let nextLevel = this._level + 1;
            this._quarters = {
                topLeft: new QuadTree(this._leftTopCorner, { w: this._dimension.w / 2, h: this._dimension.h / 2 }, nextLevel, this._maxCapacity, this._maxLevels),
                topRight: new QuadTree({ x: this._leftTopCorner.x + this._dimension.w / 2, y: this._leftTopCorner.y }, { w: this._dimension.w / 2, h: this._dimension.h / 2 }, nextLevel, this._maxCapacity, this._maxLevels),
                bottomLeft: new QuadTree({ x: this._leftTopCorner.x, y: this._leftTopCorner.y + this._dimension.h / 2 }, { w: this._dimension.w / 2, h: this._dimension.h / 2 }, nextLevel, this._maxCapacity, this._maxLevels),
                bottomRight: new QuadTree({ x: this._leftTopCorner.x + this._dimension.w / 2, y: this._leftTopCorner.y + this._dimension.h / 2 }, { w: this._dimension.w / 2, h: this._dimension.h / 2 }, nextLevel, this._maxCapacity, this._maxLevels),
            };
        }
        /**
         * find the Quarter that fully includes a given node
         * @param node
         */
        findEnclosingQuarter(node) {
            let enclosingQuarter = null;
            let nodeBoundingRect = { x: node.leftTopCorner.x, y: node.leftTopCorner.y, w: node.dimension.w, h: node.dimension.h };
            let quarters = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
            quarters.forEach((value) => {
                if (this._quarters) {
                    let quarterBoundingRect = { x: this._quarters[value]._leftTopCorner.x, y: this._quarters[value]._leftTopCorner.y, w: this._quarters[value]._dimension.w, h: this._quarters[value]._dimension.h };
                    if (this._quarters && (0, GeometricalComputation_1.checkRectangleInclusiveIntersection)(nodeBoundingRect, quarterBoundingRect))
                        enclosingQuarter = value;
                }
            });
            return enclosingQuarter;
        }
        findEnclosingQuarterV2(bd) {
            let intersectionNodes = [];
            let quarters = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
            // same levels children
            if (this._childNodes)
                this._childNodes.forEach((childNode) => {
                    if ((0, GeometricalComputation_1.checkRectangleExeclusiveIntersection)({ x: childNode.leftTopCorner.x, y: childNode.leftTopCorner.y, w: childNode.dimension.w, h: childNode.dimension.h }, bd))
                        intersectionNodes.push(childNode);
                });
            // recursivity
            quarters.forEach((quarter) => {
                if (this._quarters && ((0, GeometricalComputation_1.checkRectangleIntersection)({ x: this._quarters[quarter]._leftTopCorner.x, y: this._quarters[quarter]._leftTopCorner.y, w: this._quarters[quarter]._dimension.w, h: this._quarters[quarter]._dimension.h }, bd)))
                    //   if(this._quarters) 
                    intersectionNodes = [...intersectionNodes, ...this._quarters[quarter].findEnclosingQuarterV2(bd)];
            });
            return intersectionNodes;
        }
        insert(node) {
            // the quadTree is subdivided
            if (this._quarters) {
                let enclosingQuarter = this.findEnclosingQuarter(node);
                if (enclosingQuarter) {
                    this._quarters[enclosingQuarter].insert(node);
                    return;
                }
            }
            this._childNodes.push(node);
            // none of the quarters fully enclose the node
            if (!this._quarters && this._childNodes.length > this._maxCapacity && this._level < this._maxLevels) {
                this.subDivide();
                let listOfIndexToremove = [];
                // recursive process
                this._childNodes.forEach((value, index) => {
                    let enclosingQuarter = this.findEnclosingQuarter(value);
                    if (this._quarters && enclosingQuarter) {
                        this._quarters[enclosingQuarter].insert(value);
                        // remove this node from the parent childNodes
                        listOfIndexToremove.push(value.objectModelId);
                    }
                });
                //clean parent childNodes (remove those who are included in one of the quarters)
                this._childNodes = this._childNodes.filter((value) => !listOfIndexToremove.includes(value.objectModelId));
            }
        }
        getParentNode(node) {
            let parentNode = null;
            if (this._childNodes)
                this._childNodes.forEach((child) => {
                    if (child.objectModelId === node.objectModelId)
                        parentNode = this;
                });
            // recursive process
            if (this._quarters) {
                let enclosingQuarter = this.findEnclosingQuarter(node);
                if (enclosingQuarter)
                    return this._quarters[enclosingQuarter].getParentNode(node);
            }
            return parentNode;
        }
        queryLeftNodes(node) {
            let leftNodes = [];
            let quarters = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
            // same levels children
            if (this._childNodes)
                this._childNodes.forEach((childNode) => {
                    if (childNode.leftTopCorner.x <= node.leftTopCorner.x && childNode.objectModelId !== node.objectModelId)
                        leftNodes.push(childNode);
                });
            // recursivity
            quarters.forEach((quarter) => {
                if (this._quarters && this._quarters[quarter]._leftTopCorner.x <= node.leftTopCorner.x)
                    leftNodes = [...leftNodes, ...this._quarters[quarter].queryLeftNodes(node)];
            });
            leftNodes.sort((currentNode, nextNode) => (nextNode.leftTopCorner.x + nextNode.dimension.w) - (currentNode.leftTopCorner.x + currentNode.dimension.w));
            return leftNodes;
        }
        queryRightNodes(node) {
            let rightNodes = [];
            let quarters = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
            // same levels children
            if (this._childNodes)
                this._childNodes.forEach((childNode) => {
                    if (childNode.leftTopCorner.x > node.leftTopCorner.x && childNode.objectModelId !== node.objectModelId)
                        rightNodes.push(childNode);
                });
            // recursivity
            quarters.forEach((quarter) => {
                if (this._quarters && (this._quarters[quarter]._leftTopCorner.x + this._quarters[quarter]._dimension.w) >= (node.leftTopCorner.x))
                    rightNodes = [...rightNodes, ...this._quarters[quarter].queryRightNodes(node)];
            });
            // // sort
            rightNodes.sort((currentNode, nextNode) => currentNode.leftTopCorner.x - nextNode.leftTopCorner.x);
            return rightNodes;
        }
        queryTopNodes(node) {
            let topNodes = [];
            let quarters = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
            // same levels children
            if (this._childNodes)
                this._childNodes.forEach((childNode) => {
                    if (childNode.leftTopCorner.y < node.leftTopCorner.y && childNode.objectModelId !== node.objectModelId)
                        topNodes.push(childNode);
                });
            // recursivity
            quarters.forEach((quarter) => {
                if (this._quarters && this._quarters[quarter]._leftTopCorner.y <= node.leftTopCorner.y)
                    topNodes = [...topNodes, ...this._quarters[quarter].queryTopNodes(node)];
            });
            topNodes.sort((currentNode, nextNode) => (nextNode.leftTopCorner.y + nextNode.dimension.h) - (currentNode.leftTopCorner.y + currentNode.dimension.h));
            return topNodes;
        }
        queryBottomNodes(node) {
            let bottomNodes = [];
            let quarters = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
            // same levels children
            if (this._childNodes)
                this._childNodes.forEach((childNode, index) => {
                    if (childNode.leftTopCorner.y > node.leftTopCorner.y && childNode.objectModelId !== node.objectModelId)
                        bottomNodes.push(childNode);
                });
            // recursivity
            quarters.forEach((quarter) => {
                if (this._quarters && (this._quarters[quarter]._leftTopCorner.y + this._quarters[quarter]._dimension.h) >= node.leftTopCorner.y)
                    bottomNodes = [...bottomNodes, ...this._quarters[quarter].queryBottomNodes(node)];
            });
            bottomNodes.sort((currentNode, nextNode) => currentNode.leftTopCorner.y - nextNode.leftTopCorner.y);
            return bottomNodes;
        }
        checkOrthogonalIntersectionv2() {
            let siblingsdLinks = this.getAllChildNodes();
            let verticalSiblingsLinks = siblingsdLinks.filter((vSibling) => vSibling.dimension.w === 0);
            let horizontalSiblingsLinks = siblingsdLinks.filter((hSibling) => hSibling.dimension.h === 0);
            let listOfIntersectedPoints = [];
            // horizontal segment with vertical segment
            horizontalSiblingsLinks.forEach((segment) => {
                verticalSiblingsLinks.forEach((vsibling) => {
                    let xIntersectionCondition = (vsibling.leftTopCorner.x - segment.leftTopCorner.x) * (vsibling.leftTopCorner.x - (segment.leftTopCorner.x + segment.dimension.w)) < 0;
                    let yIntersectionCondition = (segment.leftTopCorner.y - vsibling.leftTopCorner.y) * (segment.leftTopCorner.y - (vsibling.leftTopCorner.y + vsibling.dimension.h)) < 0;
                    if (xIntersectionCondition && yIntersectionCondition && segment.objectModelParentId === vsibling.objectModelParentId)
                        listOfIntersectedPoints.push({ x: vsibling.leftTopCorner.x, y: segment.leftTopCorner.y });
                });
            });
            //vertical segment with horizontal segment
            verticalSiblingsLinks.forEach((segment) => {
                horizontalSiblingsLinks.forEach((hsibling) => {
                    let yIntersectionCondition = (hsibling.leftTopCorner.y - segment.leftTopCorner.y) * (hsibling.leftTopCorner.y - (segment.leftTopCorner.y + segment.dimension.h)) < 0;
                    let xIntersectionCondition = (segment.leftTopCorner.x - hsibling.leftTopCorner.x) * (segment.leftTopCorner.x - (hsibling.leftTopCorner.x + hsibling.dimension.w)) < 0;
                    if (xIntersectionCondition && yIntersectionCondition && segment.objectModelParentId === hsibling.objectModelParentId)
                        listOfIntersectedPoints.push({ x: segment.leftTopCorner.x, y: hsibling.leftTopCorner.y });
                });
            });
            return listOfIntersectedPoints;
        }
        remove(node) {
            let parentNode = this.getParentNode(node);
            if (parentNode)
                parentNode._childNodes = parentNode._childNodes.filter((childNode) => childNode.objectModelId !== node.objectModelId);
        }
        update(id, parentId, oldBoundRect, newBoundRect) {
            if (oldBoundRect.x !== newBoundRect.x || oldBoundRect.y !== newBoundRect.y || oldBoundRect.w !== newBoundRect.w || oldBoundRect.h !== newBoundRect.h) {
                let nodeToUpdate = { leftTopCorner: { x: oldBoundRect.x, y: oldBoundRect.y }, dimension: { w: oldBoundRect.w, h: oldBoundRect.h }, objectModelId: id, objectModelParentId: parentId };
                this.remove(nodeToUpdate);
                let newNode = { leftTopCorner: { x: newBoundRect.x, y: newBoundRect.y }, dimension: { w: newBoundRect.w, h: newBoundRect.h }, objectModelId: id, objectModelParentId: parentId };
                this.insert(newNode);
            }
        }
        getAllSubQuadTree(rootNode = this) {
            let listOfQuads = [{ ...rootNode._leftTopCorner, ...rootNode._dimension }];
            if (rootNode._quarters) {
                listOfQuads = [...listOfQuads, ...this.getAllSubQuadTree(rootNode._quarters.topLeft)];
                listOfQuads = [...listOfQuads, ...this.getAllSubQuadTree(rootNode._quarters.topRight)];
                listOfQuads = [...listOfQuads, ...this.getAllSubQuadTree(rootNode._quarters.bottomLeft)];
                listOfQuads = [...listOfQuads, ...this.getAllSubQuadTree(rootNode._quarters.bottomRight)];
            }
            return listOfQuads;
        }
        getAllChildNodes(rootNode = this) {
            let listOfMarkers = [];
            if (rootNode._childNodes.length > 0)
                rootNode._childNodes.forEach((value) => listOfMarkers = [...listOfMarkers, value]);
            if (rootNode._quarters) {
                listOfMarkers = [...listOfMarkers, ...this.getAllChildNodes(rootNode._quarters.topLeft)];
                listOfMarkers = [...listOfMarkers, ...this.getAllChildNodes(rootNode._quarters.topRight)];
                listOfMarkers = [...listOfMarkers, ...this.getAllChildNodes(rootNode._quarters.bottomLeft)];
                listOfMarkers = [...listOfMarkers, ...this.getAllChildNodes(rootNode._quarters.bottomRight)];
            }
            return listOfMarkers;
        }
        reset() {
            this._childNodes = [];
            if (this._quarters) {
                this._quarters.topLeft.reset();
                this._quarters.topRight.reset();
                this._quarters.bottomLeft.reset();
                this._quarters.bottomRight.reset();
            }
        }
    }
    exports.QuadTree = QuadTree;
});
