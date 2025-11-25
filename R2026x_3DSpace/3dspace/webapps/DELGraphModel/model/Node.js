/// <amd-module name="DS/DELGraphModel/model/Node"/>
define("DS/DELGraphModel/model/Node", ["require", "exports", "DS/DELGraphModel/utils/GeometricalComputation", "DS/DELGraphModel/model/GraphElt"], function (require, exports, GeometricalComputation_1, GraphElt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Node = void 0;
    class Node extends GraphElt_1.GraphElt {
        constructor(id, type, label, position, width, height) {
            super(id, type, label);
            this.isSelected = false;
            this.isDragged = false;
            this.editMode = false;
            this.guardExpression = " ";
            this.labelOffset = { left: 0, top: 0 };
            this.parentId = "";
            this.id = id;
            this.type = type;
            const isMarkerGuard = ["Initial", "Final", "Choice"].includes(this.type);
            this.label = label;
            this.position = Object.assign({}, position);
            this.shadowEltPosition = Object.assign({}, position);
            this.width = Math.max(width, (0, GeometricalComputation_1.computeStringLength)(label));
            // this.width=width;
            this.height = height;
            this.updateAnchors();
            const customWidth = isMarkerGuard ? 2 * GeometricalComputation_1.gridStep : (0, GeometricalComputation_1.checkDimensionParity)(this.width) ? this.width : this.width + GeometricalComputation_1.gridStep;
            const customHeight = isMarkerGuard ? 2 * GeometricalComputation_1.gridStep : (0, GeometricalComputation_1.checkDimensionParity)(this.height) ? this.height : this.height + GeometricalComputation_1.gridStep;
            this.anchors = {
                "North": Object.assign({}, { "x": this.position.x + (customWidth / 2), "y": this.position.y }),
                "West": Object.assign({}, { "x": this.position.x, "y": this.position.y + customHeight / 2 }),
                "South": Object.assign({}, { "x": this.position.x + customWidth / 2, "y": this.position.y + (isMarkerGuard ? customHeight : this.height) }),
                "East": Object.assign({}, { "x": this.position.x + (isMarkerGuard ? customWidth : this.width), "y": this.position.y + customHeight / 2 }),
                "Center": Object.assign({}, { "x": this.position.x + customWidth / 2, "y": this.position.y + customHeight / 2 }),
            };
        }
        dragElt(mouseX, mouseY) {
            this.position = Object.assign({}, { "x": (0, GeometricalComputation_1.convertToGridCoord)(mouseX) + this.shadowEltPosition.x, "y": (0, GeometricalComputation_1.convertToGridCoord)(mouseY) + this.shadowEltPosition.y });
            this.updateAnchors();
            if (!this.isDragged)
                this.dragShadowElt();
        }
        moveToPosition(mouseX, mouseY) {
            this.position = Object.assign({}, { "x": (0, GeometricalComputation_1.convertToGridCoord)(mouseX), "y": (0, GeometricalComputation_1.convertToGridCoord)(mouseY) });
            this.updateAnchors();
            if (!this.isDragged)
                this.dragShadowElt();
        }
        dragShadowElt() {
            this.shadowEltPosition = Object.assign({}, this.position);
        }
        updateAnchors() {
            const isMarkerGuard = ["Initial", "Final", "Choice"].includes(this.type);
            const customWidth = isMarkerGuard ? 2 * GeometricalComputation_1.gridStep : (0, GeometricalComputation_1.checkDimensionParity)(this.width) ? this.width : this.width + GeometricalComputation_1.gridStep;
            const customHeight = isMarkerGuard ? 2 * GeometricalComputation_1.gridStep : (0, GeometricalComputation_1.checkDimensionParity)(this.height) ? this.height : this.height + GeometricalComputation_1.gridStep;
            this.anchors = {
                "North": Object.assign({}, { "x": this.position.x + (customWidth / 2), "y": this.position.y }),
                "West": Object.assign({}, { "x": this.position.x, "y": this.position.y + customHeight / 2 }),
                "South": Object.assign({}, { "x": this.position.x + customWidth / 2, "y": this.position.y + (isMarkerGuard ? customHeight : this.height) }),
                "East": Object.assign({}, { "x": this.position.x + (isMarkerGuard ? customWidth : this.width), "y": this.position.y + customHeight / 2 }),
                "Center": Object.assign({}, { "x": this.position.x + customWidth / 2, "y": this.position.y + customHeight / 2 }),
            };
        }
        setPos(newX, newY) {
            let xcoord = this.position.x + newX;
            let ycoord = this.position.y + newY;
            this.position = Object.assign({}, { "x": xcoord, "y": ycoord });
            if (!this.isDragged)
                this.dragShadowElt();
            this.updateAnchors();
        }
        // dx,dy => snap-to-grid values
        shiftToLeft(dx, dragRootFlag = true) {
            this.position = Object.assign({}, { "x": this.position.x - dx, "y": this.position.y });
            this.updateAnchors();
            if (dragRootFlag)
                this.dragShadowElt();
        }
        ;
        shiftToRight(dx, dragRootFlag = true) {
            this.position = Object.assign({}, { "x": this.position.x + dx, "y": this.position.y });
            this.updateAnchors();
            if (dragRootFlag)
                this.dragShadowElt();
        }
        ;
        shiftToBottom(dy, dragRootFlag = true) {
            this.position = Object.assign({}, { "x": this.position.x, "y": this.position.y + dy });
            this.updateAnchors();
            if (dragRootFlag)
                this.dragShadowElt();
        }
        ;
        shiftToTop(dy, dragRootFlag = true) {
            this.position = Object.assign({}, { "x": this.position.x, "y": this.position.y - dy });
            this.updateAnchors();
            if (dragRootFlag)
                this.dragShadowElt();
        }
        ;
    }
    exports.Node = Node;
});
