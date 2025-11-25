define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isWord = exports.stripAnyAttributes = exports.isWhiteSpace = exports.isEndOfEntity = exports.isStartOfEntity = exports.isEndOfTag = exports.isStartOfTag = exports.wrapText = exports.stripTagAttributes = exports.isTag = void 0;
    var tagRegex = /^\s*<\/?[^>]+>\s*$/;
    var tagWordRegex = /<[^\s>]+/;
    var whitespaceRegex = /^(\s|&nbsp;)+$/;
    var wordRegex = /(\p{Script_Extensions=Latin}|[\d@#])+/u;
    var specialCaseWordTags = ["<img"];
    var isTag = function (item) {
        return (!specialCaseWordTags.some(function (tag) { return item !== null && item.startsWith(tag); }) &&
            tagRegex.test(item));
    };
    exports.isTag = isTag;
    var stripTagAttributes = function (word) {
        var _a;
        var tag = (_a = tagWordRegex.exec(word)) === null || _a === void 0 ? void 0 : _a[0];
        if (tag) {
            word = tag + (word.endsWith("/>") ? "/>" : ">");
        }
        return word;
    };
    exports.stripTagAttributes = stripTagAttributes;
    var wrapText = function (text, tagName, cssClass) {
        return "<".concat(tagName, " class=\"").concat(cssClass, "\">").concat(text, "</").concat(tagName, ">");
    };
    exports.wrapText = wrapText;
    var isStartOfTag = function (val) { return val === "<"; };
    exports.isStartOfTag = isStartOfTag;
    var isEndOfTag = function (val) { return val === ">"; };
    exports.isEndOfTag = isEndOfTag;
    var isStartOfEntity = function (val) { return val === "&"; };
    exports.isStartOfEntity = isStartOfEntity;
    var isEndOfEntity = function (val) { return val === ";"; };
    exports.isEndOfEntity = isEndOfEntity;
    var isWhiteSpace = function (value) { return whitespaceRegex.test(value); };
    exports.isWhiteSpace = isWhiteSpace;
    var stripAnyAttributes = function (word) {
        return isTag(word) ? stripTagAttributes(word) : word;
    };
    exports.stripAnyAttributes = stripAnyAttributes;
    var isWord = function (text) { return wordRegex.test(text); };
    exports.isWord = isWord;
});
//# sourceMappingURL=Utils.js.map
