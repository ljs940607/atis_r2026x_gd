/// <amd-module name="DS/DELSwimLaneChart_v1/model/SwimLaneChartColumn"/>
define("DS/DELSwimLaneChart_v1/model/SwimLaneChartColumn", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartColumn {
        constructor(id, title = "", left, width, height, icon = "", color = "white", textColor = "grey", hidden = false, weight = 1) {
            this._id = id;
            this._title = title;
            this._left = left;
            this._width = width;
            this._height = height;
            this._icon = icon;
            this._color = color;
            this._textColor = textColor;
            this._hidden = hidden;
            this._weight = weight;
        }
        get id() {
            return this._id;
        }
        get title() {
            return this._title;
        }
        get hidden() {
            return this._hidden;
        }
        get icon() {
            return this._icon;
        }
        get color() {
            return this._color;
        }
        get textColor() {
            return this._textColor;
        }
        get left() {
            return this._left;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get weight() {
            return this._weight;
        }
        set title(newTitle) {
            this._title = newTitle;
        }
        set icon(newIcon) {
            this._icon = newIcon;
        }
        set color(newColor) {
            this._color = newColor;
        }
        set textColor(newColor) {
            this._textColor = newColor;
        }
        set left(off) {
            this._left = off;
        }
        set width(width) {
            this._width = width;
        }
        set height(height) {
            this._height = height;
        }
        set hidden(hidden) {
            this._hidden = hidden;
        }
        set weight(w) {
            this._weight = w;
        }
        toggleVisibility() {
            this._hidden = !this._hidden;
        }
    }
    exports.default = SwimLaneChartColumn;
});
