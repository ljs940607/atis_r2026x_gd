/// <amd-module name="DS/DELSwimLaneChart_v1/model/SwimLaneChartGroup"/>
define("DS/DELSwimLaneChart_v1/model/SwimLaneChartGroup", ["require", "exports", "DS/DELSwimLaneChart_v1/utils/StaticAttributes"], function (require, exports, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartGroup {
        constructor(id, elementsId, color = StaticAttributes_1.outlinegrey) {
            this._boudingBox = { x: 0, y: -1000, w: 0, h: -1000 };
            this._id = id;
            this._elements = elementsId.filter((elt, index) => elementsId.indexOf(elt) === index); // remove duplicates
            this._color = color;
        }
        get id() {
            return this._id;
        }
        get elements() {
            return this._elements;
        }
        get color() {
            return this._color;
        }
        get boundingBox() {
            return this._boudingBox;
        }
        set boundingBox(newBd) {
            this._boudingBox = newBd;
        }
        set color(color) {
            this._color = color;
        }
        addElement(id) {
            if (this._elements.includes(id))
                return;
            this._elements.push(id);
        }
        removeElement(id) {
            this._elements = this._elements.filter((eltId) => eltId !== id);
        }
    }
    exports.default = SwimLaneChartGroup;
});
