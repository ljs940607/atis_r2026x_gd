/// <amd-module name="DS/DELSwimLaneChart_v1/model/SwimLaneChartNode"/>
define("DS/DELSwimLaneChart_v1/model/SwimLaneChartNode", ["require", "exports", "DS/DELSwimLaneChart_v1/utils/StaticAttributes", "DS/DELSwimLaneChart_v1/utils/TextUtils"], function (require, exports, StaticAttributes_1, TextUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartNode {
        constructor(id, parentId, position, width = StaticAttributes_1.swimLanechartNodeHeight, height = StaticAttributes_1.swimLanechartNodeHeight, header = null, content = {}) {
            this._type = "Node";
            this._selected = false;
            this._highlighted = false;
            this._isMinimized = false;
            this._id = id;
            this._position = position;
            this._width = width;
            this._height = Object.keys(content).length > 0 ? height : StaticAttributes_1.header_height;
            this._bodyHeight = Object.keys(content).length > 0 ? height : StaticAttributes_1.header_height;
            if (header && header.text)
                header.text = (0, TextUtils_1.encodeTextInput)(header.text);
            if (header && header.leftIcon && header.leftIcon.includes("https://") && !header.leftIcon.includes("?not-from-cache-please"))
                header.leftIcon += "?not-from-cache-please";
            if (header && header.rightIcon && header.rightIcon.includes("https://") && !header.rightIcon.includes("?not-from-cache-please"))
                header.rightIcon += "?not-from-cache-please";
            this._header = header;
            if (content.text)
                content.text = (0, TextUtils_1.encodeTextInput)(content.text);
            if (content && content.leftIcon && content.leftIcon.includes("https://") && !content.leftIcon.includes("?not-from-cache-please"))
                content.leftIcon += "?not-from-cache-please";
            if (content && content.rightIcon && content.rightIcon.includes("https://") && !content.rightIcon.includes("?not-from-cache-please"))
                content.rightIcon += "?not-from-cache-please";
            this._content = content;
            this._parentId = parentId;
        }
        // getters
        get id() {
            return this._id;
        }
        get parentId() {
            return this._parentId;
        }
        get position() {
            return this._position;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get bodyHeight() {
            return this._bodyHeight;
        }
        get header() {
            return this._header;
        }
        get content() {
            return this._content;
        }
        get type() {
            return this._type;
        }
        get selected() {
            return this._selected;
        }
        get highlighted() {
            return this._highlighted;
        }
        get isMinimized() {
            return this._isMinimized;
        }
        // setters
        set header(newHeader) {
            if (newHeader && newHeader.text)
                newHeader.text = (0, TextUtils_1.encodeTextInput)(newHeader.text);
            if (newHeader && newHeader.leftIcon && newHeader.leftIcon.includes("https://") && !newHeader.leftIcon.includes("?not-from-cache-please"))
                newHeader.leftIcon += "?not-from-cache-please";
            if (newHeader && newHeader.rightIcon && newHeader.rightIcon.includes("https://") && !newHeader.rightIcon.includes("?not-from-cache-please"))
                newHeader.rightIcon += "?not-from-cache-please";
            this._header = { ...this._header, ...newHeader };
        }
        set type(newType) {
            if (this._type !== newType)
                this._type = newType;
        }
        set parentId(newParentId) {
            this._parentId = newParentId;
        }
        set content(newContent) {
            if (newContent.text)
                newContent.text = (0, TextUtils_1.encodeTextInput)(newContent.text);
            if (newContent && newContent.leftIcon && newContent.leftIcon.includes("https://") && !newContent.leftIcon.includes("?not-from-cache-please"))
                newContent.leftIcon += "?not-from-cache-please";
            if (newContent && newContent.rightIcon && newContent.rightIcon.includes("https://") && !newContent.rightIcon.includes("?not-from-cache-please"))
                newContent.rightIcon += "?not-from-cache-please";
            this._content = { ...this._content, ...newContent };
        }
        set width(newWidth) {
            this._width = newWidth;
        }
        set height(newHeight) {
            this._height = newHeight;
        }
        set bodyHeight(newHeight) {
            this._bodyHeight = newHeight;
        }
        set position(newPosition) {
            this._position = newPosition;
        }
        set isMinimized(isMinimized) {
            if (this.header)
                this._isMinimized = isMinimized;
        }
        select() {
            this._selected = true;
        }
        unSelect() {
            this._selected = false;
        }
        highlight() {
            this._highlighted = true;
        }
        unHighlight() {
            this._highlighted = false;
        }
        findStr(str) {
            var _a, _b, _c;
            const locations = [];
            let count = 0;
            if (this.header && this.header.text) {
                const occurencesNb = (0, TextUtils_1.findAllOccurrences)(this.header.text.replace(/<\/?mark>/gi, ''), str);
                if (occurencesNb > 0) {
                    locations.push("Header");
                    count += occurencesNb;
                }
            }
            if (!this.isMinimized && this.content.childElement) {
                const occurencesNb = (0, TextUtils_1.findAllOccurrences)((_b = (_a = this.content.childElement.textContent) === null || _a === void 0 ? void 0 : _a.replace(/<\/?mark>/gi, '')) !== null && _b !== void 0 ? _b : "", str);
                if (occurencesNb > 0) {
                    locations.push("Content");
                    count += occurencesNb;
                }
            }
            else if (!this.isMinimized && this.content.text) {
                const occurencesNb = (0, TextUtils_1.findAllOccurrences)((_c = this.content.text) === null || _c === void 0 ? void 0 : _c.replace(/<\/?mark>/gi, ''), str);
                if (occurencesNb > 0) {
                    locations.push("Content");
                    count += occurencesNb;
                }
            }
            return { locations, count };
        }
    }
    exports.default = SwimLaneChartNode;
});
