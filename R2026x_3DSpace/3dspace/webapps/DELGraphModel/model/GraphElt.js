/// <amd-module name="DS/DELGraphModel/model/GraphElt"/>
define("DS/DELGraphModel/model/GraphElt", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphElt = void 0;
    class GraphElt {
        constructor(id, type, label) {
            this.color = "white";
            this.editMode = false;
            this.isSelected = false;
            this.isDragged = false;
            this.labelOffset = { left: 0, top: 0 };
            this.position = { "x": 0, "y": 0 };
            this.width = 0;
            this.height = 0;
            this.data = {};
            this._status = "ready-to-use";
            this.id = id;
            this.type = type;
            this.label = label;
        }
        get status() { return this._status; }
        ;
        set status(newStatus) { this._status = newStatus; }
        setIsSelected() { this.isSelected = true; }
        setIsDeselected() { this.isSelected = false; }
        setIsDragged() { this.isDragged = true; }
        setIsNotDragged() { this.isDragged = false; }
        updateLabelOffset(dhorizontal, dvertical) { this.labelOffset = Object.assign({}, { left: this.labelOffset.left + dhorizontal, top: this.labelOffset.top + dvertical }); }
        setColor(newColor) { this.color = newColor; }
        ;
        dragShadowElt() { }
        ;
        shiftToLeft(dx) { }
        ;
        shiftToRight(dx) { }
        ;
        shiftToBottom(dy) { }
        ;
        shiftToTop(dy) { }
        ;
    }
    exports.GraphElt = GraphElt;
});
