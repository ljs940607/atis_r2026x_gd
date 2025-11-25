/// <amd-module name="DS/DELSwimLaneChart_v1/utils/TextUtils"/>
define("DS/DELSwimLaneChart_v1/utils/TextUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findAllOccurrences = exports.truncateText = exports.computeWordLength = exports.computeHtmlContentHeight = exports.encodeTextInput = void 0;
    /**
     * Function to encode a html content (input sanitization)
     * @param input
     * @returns
     */
    const encodeTextInput = (input) => {
        if (!input)
            return "";
        return input === null || input === void 0 ? void 0 : input.replace(/([\u00A0-\u9999<>&])(?!(?:<\/?mark>))/g, i => '&#' + i.charCodeAt(0) + ';').split("\n").join("<br>");
    };
    exports.encodeTextInput = encodeTextInput;
    const computeHtmlContentHeight = (htmlContent, width) => {
        const div = document.createElement("htmlElementWrapper");
        document.body.appendChild(div);
        div.style.width = width + "px";
        div.style.position = "absolute";
        div.style.left = "-9999px";
        div.style.display = "hidden";
        div.style.padding = "0";
        div.style.margin = "0";
        div.style.border = "0";
        div.style.overflow = "visible";
        div.appendChild(htmlContent);
        const nodeHeight = div.offsetHeight;
        div.removeChild(htmlContent);
        document.body.removeChild(div);
        return nodeHeight;
    };
    exports.computeHtmlContentHeight = computeHtmlContentHeight;
    /**
     * Function to compute a word length based on the fontsize, padding, textwrapping mode,..
     * @param word
     * @param fontSize
     * @param padding
     * @returns
     */
    const computeWordLength = (word, fontSize = "12px", fontFamily = "Arial") => {
        const paragraph = document.createElement("span");
        paragraph.style.fontFamily = fontFamily;
        paragraph.style.fontSize = fontSize;
        paragraph.style.whiteSpace = "nowrap";
        paragraph.textContent = word;
        document.body.appendChild(paragraph);
        const stringLength = paragraph.offsetWidth;
        document.body.removeChild(paragraph);
        return stringLength;
    };
    exports.computeWordLength = computeWordLength;
    const truncateText = (text, width) => {
        let result = "";
        for (const c of text) {
            result += c;
            if ((0, exports.computeWordLength)(result) > (width - (0, exports.computeWordLength)("..."))) {
                result += "...";
                break;
            }
        }
        return (result);
    };
    exports.truncateText = truncateText;
    /**
     * Find the occurences of substring in a string (used by find function)
     * @param str
     * @param subStr
     * @returns
     */
    const findAllOccurrences = (str, subStr) => {
        if (subStr.length <= 1)
            return 0;
        subStr = subStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape special characters
        const regex = new RegExp(`${subStr}`, 'gi');
        const matches = str.match(regex);
        return matches ? matches.length : 0;
    };
    exports.findAllOccurrences = findAllOccurrences;
});
