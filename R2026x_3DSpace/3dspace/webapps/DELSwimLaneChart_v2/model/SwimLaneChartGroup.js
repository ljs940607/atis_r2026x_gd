/// <amd-module name="DS/DELSwimLaneChart_v2/model/SwimLaneChartGroup"/>
define("DS/DELSwimLaneChart_v2/model/SwimLaneChartGroup", ["require", "exports", "DS/DELSwimLaneChart_v2/utils/StaticAttributes"], function (require, exports, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartGroup {
        constructor(id, elementsId, _elementsBoundToCol, color = StaticAttributes_1.outlinegrey) {
            this._type = "normal";
            this._groupRoots = []; // relavant for innerGorup to know which composite node controls the auto-layouting
            this._boundingBox = { x: 0, y: -1000, w: 0, h: -1000 };
            this._id = id;
            this._elements = elementsId.filter((elt, index) => elementsId.indexOf(elt) === index); // remove duplicates
            this._elementsBoundToCol = _elementsBoundToCol;
            this._color = color;
        }
        get id() {
            return this._id;
        }
        get elements() {
            return this._elements;
        }
        get elementsBoundToCol() {
            return this._elementsBoundToCol;
        }
        get goupRoots() {
            return this._groupRoots;
        }
        get type() {
            return this._type;
        }
        get color() {
            return this._color;
        }
        get boundingBox() {
            return this._boundingBox;
        }
        set boundingBox(newBd) {
            this._boundingBox = newBd;
        }
        set type(grType) {
            this._type = grType;
        }
        set color(color) {
            this._color = color;
        }
        addRoot(id) {
            if (this.type === "normal" || this._groupRoots.includes(id))
                return;
            this._groupRoots.push(id);
        }
        removeRoot(id) {
            if (!this._groupRoots.includes(id))
                return;
            this._groupRoots = this._groupRoots.filter((rid) => rid !== id);
        }
        addElement(id, colId) {
            if (this._elements.includes(id))
                return;
            this._elements.push(id);
            const value = this._elementsBoundToCol.get(colId);
            if (value)
                this._elementsBoundToCol.set(colId, [...value, id]);
            else
                this._elementsBoundToCol.set(colId, [id]);
        }
        removeElement(id, colId) {
            if (!this._elements.includes(id))
                return;
            this._elements = this._elements.filter((eltId) => eltId !== id);
            let value = this._elementsBoundToCol.get(colId);
            if (value) {
                value = value.filter((eltId) => eltId !== id);
                if (value.length > 0)
                    this._elementsBoundToCol.set(colId, value);
                else
                    this._elementsBoundToCol.delete(colId);
            }
        }
        reset() {
            this._elements = [];
            this._elementsBoundToCol = new Map();
            this._type = "normal";
            this._groupRoots = [];
        }
        resetBoundingBox() {
            this._boundingBox = { x: 0, y: -1000, w: 0, h: -1000 };
        }
    }
    exports.default = SwimLaneChartGroup;
});
