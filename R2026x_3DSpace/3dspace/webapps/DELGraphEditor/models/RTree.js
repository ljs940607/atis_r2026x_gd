/// <amd-module name="DS/DELGraphEditor/models/RTree"/>
define("DS/DELGraphEditor/models/RTree", ["require", "exports", "DS/DELGraphEditor/utils/GeometricalComputation"], function (require, exports, GeometricalComputation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTree = exports.RtreeBox = void 0;
    class RtreeBox {
        constructor(bd, parent) {
            this.childBoxes = [];
            this.chilNodes = [];
            this.size = 4000;
            this.boundingRect = bd;
            this.parentBox = parent;
            // this.attachBoudingBoxTracker();
        }
        split() {
            // create childBoxes and move the childNodes to accurate boxes 
            // this.chilNodes.sort((a: boxChildNode, b: boxChildNode) => (a.boundingRect.x) - (b.boundingRect.x)); // sort horizontally
            this.chilNodes.sort((a, b) => ((a.boundingRect.x + a.boundingRect.w) - (b.boundingRect.x + b.boundingRect.w))); // sort horizontally
            const leftChildBox = new RtreeBox({ x: 0, y: 0, w: 0, h: 0 }, this);
            const rightChildBox = new RtreeBox({ x: 0, y: 0, w: 0, h: 0 }, this);
            leftChildBox.chilNodes = this.chilNodes.slice(0, Math.floor((this.size) / 2));
            leftChildBox.updateTheBoundingBoxOfChildren();
            rightChildBox.chilNodes = this.chilNodes.slice(Math.floor((this.size) / 2), this.size);
            rightChildBox.updateTheBoundingBoxOfChildren();
            this.childBoxes = [leftChildBox, rightChildBox];
            this.chilNodes = [];
        }
        merge() {
            if (this.childBoxes.length === 0 && this.parentBox)
                this.parentBox.childBoxes = this.parentBox.childBoxes.filter((box) => box === this);
        }
        addChildNode(childNode) {
            this.chilNodes.push(childNode);
            if (this.chilNodes.length >= this.size)
                this.split(); // split to keep blanced tree
            else
                this.updateTheBoundingBoxOfChildren();
        }
        removeChildNode(childNodeId) {
            this.chilNodes = this.chilNodes.filter((node) => node.objectModelId !== childNodeId);
            this.updateTheBoundingBoxOfChildren();
        }
        updateTheBoundingBoxOfChildren() {
            var _a;
            let minleft = Number.MAX_VALUE;
            let minTop = Number.MAX_VALUE;
            let maxBottom = -Number.MAX_VALUE;
            let maxRight = -Number.MAX_VALUE;
            if (this.chilNodes.length === 0 && this.childBoxes.length === 2) {
                minleft = Math.min(this.childBoxes[0].boundingRect.x, this.childBoxes[1].boundingRect.x);
                minTop = Math.min(this.childBoxes[0].boundingRect.y, this.childBoxes[1].boundingRect.y);
                maxRight = Math.max(this.childBoxes[0].boundingRect.x + this.childBoxes[0].boundingRect.w, this.childBoxes[1].boundingRect.x + this.childBoxes[1].boundingRect.w);
                maxBottom = Math.max(this.childBoxes[0].boundingRect.y + this.childBoxes[0].boundingRect.h, this.childBoxes[1].boundingRect.y + this.childBoxes[1].boundingRect.h);
            }
            else {
                this.chilNodes.forEach((node) => {
                    minleft = Math.min(minleft, node.boundingRect.x);
                    minTop = Math.min(minTop, node.boundingRect.y);
                    maxRight = Math.max(maxRight, node.boundingRect.x + node.boundingRect.w);
                    maxBottom = Math.max(maxBottom, node.boundingRect.y + node.boundingRect.h);
                });
            }
            if (minleft === Number.MAX_VALUE)
                this.boundingRect = { x: 0, y: 0, w: 0, h: 0 };
            else
                this.boundingRect = { x: minleft, y: minTop, w: maxRight - minleft, h: maxBottom - minTop };
            (_a = this.parentBox) === null || _a === void 0 ? void 0 : _a.updateTheBoundingBoxOfChildren();
        }
        reset() {
            this.childBoxes = [];
            this.chilNodes = [];
        }
    }
    exports.RtreeBox = RtreeBox;
    class RTree {
        constructor(spaceBd) {
            this.rootBox = new RtreeBox(spaceBd, null);
        }
        insert(nodeBd, nodeModelId, nodeModelParentId, parentBox = this.rootBox) {
            if (parentBox.childBoxes.length === 0) { // leaf-node
                const newBoxChildNode = { boundingRect: nodeBd, objectModelId: nodeModelId, objectModelParentId: nodeModelParentId };
                parentBox.addChildNode(newBoxChildNode);
                return;
            }
            let min_Enlargement = Number.MAX_VALUE;
            let minimal_child_To_enlarge = null;
            for (const childBox of parentBox.childBoxes) {
                const minleft = Math.min(childBox.boundingRect.x, nodeBd.x);
                const minTop = Math.min(childBox.boundingRect.y, nodeBd.y);
                const maxRight = Math.max(childBox.boundingRect.x + childBox.boundingRect.w, nodeBd.x + nodeBd.w);
                const maxBottom = Math.max(childBox.boundingRect.y + childBox.boundingRect.h, nodeBd.y + nodeBd.h);
                // area diff
                const endlargmentDiff = (maxRight - minleft) * (maxBottom - minTop)
                    - childBox.boundingRect.w * childBox.boundingRect.h;
                if (endlargmentDiff < min_Enlargement) {
                    min_Enlargement = endlargmentDiff;
                    minimal_child_To_enlarge = childBox;
                }
            }
            if (nodeModelParentId === "26")
                console.log(minimal_child_To_enlarge);
            if (minimal_child_To_enlarge) {
                this.insert(nodeBd, nodeModelId, nodeModelParentId, minimal_child_To_enlarge);
                return;
            }
        }
        delete(nodeBd, nodeModelId, parentBox = this.rootBox) {
            const closeParentBox = this.search(nodeBd, parentBox);
            closeParentBox.removeChildNode(nodeModelId);
            if (closeParentBox.chilNodes.length === 0)
                closeParentBox.merge();
        }
        search(nodeBd, parentBox = this.rootBox) {
            if (parentBox.childBoxes.length === 0 && (0, GeometricalComputation_1.checkRectangleInclusiveIntersection)(nodeBd, parentBox.boundingRect)) {
                return parentBox;
            }
            if (parentBox.childBoxes.length > 0) {
                for (const childBox of parentBox.childBoxes) {
                    if ((0, GeometricalComputation_1.checkRectangleInclusiveIntersection)(nodeBd, childBox.boundingRect)) {
                        return this.search(nodeBd, childBox);
                    }
                }
            }
            return parentBox;
        }
        getAllBoxes(parentBox = this.rootBox) {
            let listOfBoxes = [];
            if (parentBox.childBoxes.length === 0)
                return [parentBox];
            parentBox.childBoxes.forEach((child) => {
                listOfBoxes = [...listOfBoxes, ...this.getAllBoxes(child)];
            });
            return listOfBoxes;
        }
        getAllChildNodes(parentBox = this.rootBox) {
            let listOfChildren = [];
            listOfChildren = [...listOfChildren, ...parentBox.chilNodes];
            parentBox.childBoxes.forEach((child) => {
                listOfChildren = [...listOfChildren, ...this.getAllChildNodes(child)];
            });
            return listOfChildren;
        }
        reset() {
            this.rootBox.reset();
        }
    }
    exports.RTree = RTree;
});
