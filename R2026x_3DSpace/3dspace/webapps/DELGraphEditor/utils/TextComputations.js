/// <amd-module name="DS/DELGraphEditor/utils/TextComputations"/>
define("DS/DELGraphEditor/utils/TextComputations", ["require", "exports", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphModel/model/Link", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, GeometricalComputation_1, Link_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeTextInput = exports.computeTextLongestWordLength = exports.getLongestWordInArray = exports.computeWordLength = exports.computeNewDimensionsAfterResizing = exports.computeTextLinesBreaksInBreakWordMode = exports.getLabelPosition = exports.computeLabelDimensionsOfGraphElt = exports.getTextFromElement = void 0;
    /**
     * Function to get the innerText after input validation
     * @returns content text inside the validated input
     */
    const getTextFromElement = (input) => {
        var _a;
        const textContent = (_a = input.innerHTML) === null || _a === void 0 ? void 0 : _a.split("<br>").join("\n");
        return typeof textContent !== "undefined" ? textContent : "";
    };
    exports.getTextFromElement = getTextFromElement;
    /**
     * Function to compute the graphElt dimensions depending on its label
     * @param graphElt
     * @returns the new width and new height (to fit the inner text)
     */
    const computeLabelDimensionsOfGraphElt = (graphElt) => {
        const verticalOffset = ["Node", "GroupNode"].includes(graphElt.type) ? 1 : 0;
        const custom_line_height = ["Node", "GroupNode"].includes(graphElt.type) ? StaticAttributes_1.gridStep : StaticAttributes_1.line_height;
        const labelLines = (0, exports.computeTextLinesBreaksInBreakWordMode)(graphElt.label, graphElt.width);
        const newHeight = (labelLines + verticalOffset) * custom_line_height;
        return [graphElt.width, Math.max(newHeight, graphElt.height)];
    };
    exports.computeLabelDimensionsOfGraphElt = computeLabelDimensionsOfGraphElt;
    /**
     * Function to get the position (top/left) of the label inside Graph Element [Node,Link, Initial..]
     * @param {GraphElt} graphElt
     * @returns {position}
     */
    const getLabelPosition = (graphElt) => {
        if (graphElt instanceof Link_1.Link)
            return { x: graphElt.position.x - (graphElt.width / 2), y: graphElt.position.y - (graphElt.height / 2) };
        else if (["Initial", "Choice", "Final"].includes(graphElt.type))
            return { x: graphElt.position.x + graphElt.labelOffset.left, y: graphElt.position.y + graphElt.labelOffset.top + 2 * StaticAttributes_1.gridStep };
        return { x: graphElt.position.x, y: graphElt.position.y };
    };
    exports.getLabelPosition = getLabelPosition;
    /**
     *
     * @param str
     * @param lineWidth
     * @param fontSize
     * @param padding
     * @returns
     */
    const computeTextLinesBreaksInBreakWordMode = (str, lineWidth, fontSize = StaticAttributes_1.font_size, padding = StaticAttributes_1.text_padding) => {
        const textRows = str.includes("\n") ? str.split("\n") : [str];
        let minimumLinesOfBreaks = Math.max(1, textRows.length);
        let nbOfLinesBreaks = Math.ceil((0, exports.computeWordLength)(str, fontSize, padding) / lineWidth);
        return Math.max(nbOfLinesBreaks, minimumLinesOfBreaks);
    };
    exports.computeTextLinesBreaksInBreakWordMode = computeTextLinesBreaksInBreakWordMode;
    /**
     * Function to compute the new Dimensions of a graph element with respect to the inner text dimensions contraints
     * @param graphElt
     * @param widthLimit
     * @param {position} pointerCoord the pointer position at the end of resizing
     * @param {transformationVectorType} transVector inner transaformation
     * @param offset outer transformation
     * @returns Dimensions
     */
    const computeNewDimensionsAfterResizing = (graphElt, widthLimit, pointerCoord, transVector, offset) => {
        const pointerNormalizedCoord = (0, GeometricalComputation_1.normalizePosition)(pointerCoord, transVector, offset);
        const xcoord = ["Node", "GroupNode"].includes(graphElt.type) ? (0, GeometricalComputation_1.convertToGridCoord)(pointerNormalizedCoord.x) : pointerNormalizedCoord.x;
        const ycoord = ["Node", "GroupNode"].includes(graphElt.type) ? (0, GeometricalComputation_1.convertToGridCoord)(pointerNormalizedCoord.y) : pointerNormalizedCoord.y;
        const posOfLabelEdge = (0, exports.getLabelPosition)(graphElt);
        const [computedWidth, computedHeight] = [xcoord - posOfLabelEdge.x, ycoord - posOfLabelEdge.y];
        const newWidth = Math.max(computedWidth, widthLimit);
        const nbOfLinesBreaks = (0, exports.computeTextLinesBreaksInBreakWordMode)(graphElt.label, newWidth);
        const verticalOffset = (["Node", "GroupNode"].includes(graphElt.type)) ? 1 : 1 / 2;
        const newHeight = computedHeight > (nbOfLinesBreaks + verticalOffset) * StaticAttributes_1.gridStep ? computedHeight : (nbOfLinesBreaks + verticalOffset) * StaticAttributes_1.gridStep;
        return [newWidth, newHeight];
    };
    exports.computeNewDimensionsAfterResizing = computeNewDimensionsAfterResizing;
    /**
     * Function to compute a word length based on the fontsize, padding, textwrapping mode,..
     * @param word
     * @param fontSize
     * @param padding
     * @returns
     */
    const computeWordLength = (word, fontSize = StaticAttributes_1.font_size, padding = StaticAttributes_1.text_padding, fontFamily = StaticAttributes_1.font_family) => {
        const paragraph = document.createElement("span");
        paragraph.style.fontFamily = fontFamily;
        paragraph.style.fontSize = fontSize;
        paragraph.style.padding = padding;
        paragraph.style.whiteSpace = "nowrap";
        paragraph.textContent = word;
        document.body.appendChild(paragraph);
        const stringLength = paragraph.offsetWidth;
        document.body.removeChild(paragraph);
        return stringLength;
    };
    exports.computeWordLength = computeWordLength;
    /**
     * get the index of the longest word in an array of words
     * @param wordsArray
     * @returns {number} word index
     */
    const getLongestWordInArray = (wordsArray) => {
        let longestWordIndex = 0;
        wordsArray.forEach((str, index) => {
            if ((0, exports.computeWordLength)(str) > (0, exports.computeWordLength)(wordsArray[longestWordIndex]))
                longestWordIndex = index;
        });
        return longestWordIndex;
    };
    exports.getLongestWordInArray = getLongestWordInArray;
    /**
     * get the index of the longest word in a text (multiLines/multiRows)
     * @param text
     * @returns
     */
    const computeTextLongestWordLength = (text) => {
        if (text === "")
            return StaticAttributes_1.min_text_length;
        if (text.length === 1)
            return (0, exports.computeWordLength)(text);
        const textRows = text.includes("\n") ? text.split("\n") : [text];
        let textFragments = [];
        for (let r of textRows) {
            textFragments = [...textFragments, ...r.split(" ")];
        }
        const longestWordIndex = (0, exports.getLongestWordInArray)(textFragments);
        return (0, exports.computeWordLength)(textFragments[longestWordIndex]);
    };
    exports.computeTextLongestWordLength = computeTextLongestWordLength;
    /**
     * Function to encode a html content (input sanitization)
     * @param input
     * @returns
     */
    const encodeTextInput = (input) => {
        if (!input)
            return "";
        return input === null || input === void 0 ? void 0 : input.replace(/[\u00A0-\u9999<>\&]/g, i => '&#' + i.charCodeAt(0) + ';').split("\n").join("<br>");
    };
    exports.encodeTextInput = encodeTextInput;
});
// /**
//  * Function to compute the text lines breaks based on word-wrapping greedy algorithm (from wikipedia https://en.wikipedia.org/wiki/Line_wrap_and_word_wrap#Minimum_number_of_lines)
//  * @param str 
//  * @param lineWidth 
//  * @param fontSize 
//  * @param padding 
//  * @returns 
//  * 
//  */
// export const computeTextLinesBreaks=(str:string,lineWidth:number,fontSize:string,padding:string):number=>{
//     const textRows=str.split("\n");
//     let textFragments:string[]=[];
//     for (let r of textRows){
//         textFragments=[...textFragments,...r.split(" ")];
//     }
//     const spaceWidth=computeWordLength(" ",fontSize,padding);
//     let availableSpaceWidth=lineWidth;
//     let minimumLinesOfBreaks=Math.max(2,textRows.length);
//     let nbOfLinesBreaks=textRows.length;
//     for (let fragment of textFragments){
//         const fragmentWidth=computeWordLength(fragment,fontSize,padding);
//         if(fragmentWidth+spaceWidth>availableSpaceWidth ) {
//             nbOfLinesBreaks++;
//             availableSpaceWidth=lineWidth-fragmentWidth;
//         }else{
//             availableSpaceWidth=availableSpaceWidth-(fragmentWidth+spaceWidth);
//         }
//     }
//     return nbOfLinesBreaks>minimumLinesOfBreaks?nbOfLinesBreaks:minimumLinesOfBreaks;
// }
// export const computeStringDimensions=(str:string,fontSize:string,padding:string,width:number,height:number):[number,number]=>{
//     const paragraph=document.createElement("div");
//     const text=document.createElement("p");
//     paragraph.style.fontSize = fontSize;
//     paragraph.style.padding=padding;
//     paragraph.style.width = `${width}`;
//     paragraph.style.height = `${height}`;
//     text.innerHTML=str;
//     paragraph.appendChild(text);
//     document.body.appendChild(paragraph);
//     const stringLength=text.offsetWidth;
//     const stringHeight=text.offsetHeight;
//     console.log("what",paragraph.getBoundingClientRect())
//     document.body.removeChild(paragraph);
//     return [stringLength,stringHeight];
// }
