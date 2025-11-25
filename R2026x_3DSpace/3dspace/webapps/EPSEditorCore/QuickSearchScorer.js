/// <amd-module name='DS/EPSEditorCore/QuickSearchScorer'/>
define("DS/EPSEditorCore/QuickSearchScorer", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines a QuickSearchScorer.
     * @private
     * @class QuickSearchScorer
     * @alias module:DS/EPSEditorCore/QuickSearchScorer
     */
    class QuickSearchScorer {
        /**
         * @public
         * @constructor
         * @param {string} query - The search query.
         */
        constructor(query) {
            this._dataUpperCase = '';
            this._fileNameIndex = 0;
            this._query = query;
            this._queryUpperCase = query.toUpperCase();
        }
        score(data, matchIndexes) {
            let result = 0;
            if (data && this._query) {
                const n = this._query.length;
                const m = data.length;
                if (!this._score || this._score.length < n * m) {
                    this._score = new Int32Array(n * m * 2);
                    this._sequence = new Int32Array(n * m * 2);
                }
                const score = this._score;
                const sequence = this._sequence;
                this._dataUpperCase = data.toUpperCase();
                this._fileNameIndex = data.lastIndexOf('/');
                for (let i = 0; i < n; ++i) {
                    for (let j = 0; j < m; ++j) {
                        const skipCharScore = j === 0 ? 0 : score[i * m + j - 1];
                        const prevCharScore = i === 0 || j === 0 ? 0 : score[(i - 1) * m + j - 1];
                        const consecutiveMatch = i === 0 || j === 0 ? 0 : sequence[(i - 1) * m + j - 1];
                        const pickCharScore = this._match(this._query, data, i, j, consecutiveMatch);
                        if (pickCharScore && prevCharScore + pickCharScore >= skipCharScore) {
                            sequence[i * m + j] = consecutiveMatch + 1;
                            score[i * m + j] = (prevCharScore + pickCharScore);
                        }
                        else {
                            sequence[i * m + j] = 0;
                            score[i * m + j] = skipCharScore;
                        }
                    }
                }
                if (matchIndexes) {
                    QuickSearchScorer._restoreMatchIndexes(sequence, n, m, matchIndexes);
                }
                const maxDataLength = 256;
                result = score[n * m - 1] * maxDataLength + (maxDataLength - data.length);
            }
            return result;
        }
        /**
         * Filters the regular expression.
         * @public
         * @static
         * @param {string} query - The search query.
         * @returns {RegExp} The search regexp.
         */
        static filterRegex(query) {
            let result = '';
            if (query) {
                const toEscape = '^[]{}()\\.^$*+?|-,';
                for (let i = 0; i < query.length; ++i) {
                    let c = query.charAt(i);
                    if (toEscape.indexOf(c) !== -1) {
                        c = '\\' + c;
                    }
                    if (i) {
                        result += '[^\\0' + c + ']*';
                    }
                    result += c;
                }
            }
            return new RegExp(result, 'i');
        }
        static highlightRangesWithStyleClass(element, resultRanges, styleClass) {
            const highlightNodes = [];
            const textNodes = QuickSearchScorer._getChildTextNodes(element);
            if (textNodes.length > 0) {
                const lineText = textNodes.map(n => n.textContent).join('');
                const ownerDocument = element.ownerDocument;
                const nodeRanges = QuickSearchScorer._getNodesRanges(textNodes);
                let startIndex = 0;
                for (let i = 0; i < resultRanges.length; ++i) {
                    const startOffset = resultRanges[i].offset;
                    const endOffset = startOffset + resultRanges[i].length;
                    while (startIndex < textNodes.length && nodeRanges[startIndex].offset + nodeRanges[startIndex].length <= startOffset) {
                        startIndex++;
                    }
                    let endIndex = startIndex;
                    while (endIndex < textNodes.length && nodeRanges[endIndex].offset + nodeRanges[endIndex].length < endOffset) {
                        endIndex++;
                    }
                    if (endIndex === textNodes.length) {
                        break;
                    }
                    const highlightNode = ownerDocument.createElement('span');
                    highlightNode.className = styleClass;
                    highlightNode.textContent = lineText.substring(startOffset, endOffset);
                    const lastTextNode = textNodes[endIndex];
                    const lastText = lastTextNode.textContent;
                    lastTextNode.textContent = lastText.substring(endOffset - nodeRanges[endIndex].offset);
                    if (startIndex === endIndex) {
                        lastTextNode.parentElement.insertBefore(highlightNode, lastTextNode);
                        highlightNodes.push(highlightNode);
                        const prefixNode = ownerDocument.createTextNode(lastText.substring(0, startOffset - nodeRanges[startIndex].offset));
                        lastTextNode.parentElement.insertBefore(prefixNode, highlightNode);
                    }
                    else {
                        const firstTextNode = textNodes[startIndex];
                        const firstText = firstTextNode.textContent;
                        const anchorElement = firstTextNode.nextSibling;
                        firstTextNode.parentElement.insertBefore(highlightNode, anchorElement);
                        highlightNodes.push(highlightNode);
                        firstTextNode.textContent = firstText.substring(0, startOffset - nodeRanges[startIndex].offset);
                        for (let k = startIndex + 1; k < endIndex; k++) {
                            const textNode = textNodes[k];
                            textNode.textContent = '';
                        }
                    }
                    startIndex = endIndex;
                    nodeRanges[startIndex].offset = endOffset;
                    nodeRanges[startIndex].length = lastTextNode.textContent.length;
                }
            }
            return highlightNodes;
        }
        _match(query, data, i, j, consecutiveMatch) {
            if (this._queryUpperCase[i] !== this._dataUpperCase[j]) {
                return 0;
            }
            if (!consecutiveMatch) {
                return this._singleCharScore(query, data, i, j);
            }
            return this._sequenceCharScore(data, j - consecutiveMatch, consecutiveMatch);
        }
        _singleCharScore(query, data, i, j) {
            const isWordStart = this._testWordStart(data, j);
            const isFileName = j > this._fileNameIndex;
            const isPathTokenStart = j === 0 || data[j - 1] === '/';
            const isCapsMatch = query[i] === data[j] && query[i] === this._queryUpperCase[i];
            let score = 10;
            if (isPathTokenStart) {
                score += 4;
            }
            if (isWordStart) {
                score += 2;
            }
            if (isCapsMatch) {
                score += 6;
            }
            if (isFileName) {
                score += 4;
            }
            if (j === this._fileNameIndex + 1 && i === 0) {
                score += 5;
            }
            if (isFileName && isWordStart) {
                score += 3;
            }
            return score;
        }
        _testWordStart(data, j) {
            let result = true;
            if (j !== 0) {
                const prevChar = data.charAt(j - 1);
                result = prevChar === '_' || prevChar === '-' || prevChar === '/' || (data[j - 1] !== this._dataUpperCase[j - 1] && data[j] === this._dataUpperCase[j]);
            }
            return result;
        }
        _sequenceCharScore(data, j, sequenceLength) {
            const isFileName = j > this._fileNameIndex;
            const isPathTokenStart = j === 0 || data[j - 1] === '/';
            let score = 10;
            if (isFileName) {
                score += 4;
            }
            if (isPathTokenStart) {
                score += 5;
            }
            score += sequenceLength * 4;
            return score;
        }
        static _restoreMatchIndexes(sequence, n, m, out) {
            let i = n - 1;
            let j = m - 1;
            while (i >= 0 && j >= 0) {
                switch (sequence[i * m + j]) {
                    case 0:
                        --j;
                        break;
                    default:
                        out.push(j);
                        --i;
                        --j;
                        break;
                }
            }
            out.reverse();
        }
        static _getNodesRanges(textNodes) {
            const result = [];
            let rangeEndOffset = 0;
            for (let i = 0; i < textNodes.length; ++i) {
                const range = {
                    offset: rangeEndOffset,
                    length: textNodes[i].textContent.length
                };
                rangeEndOffset = range.offset + range.length;
                result.push(range);
            }
            return result;
        }
        static _getChildTextNodes(element) {
            let node = QuickSearchScorer._traverseNextTextNode(element);
            let result = [];
            while (node) {
                if (QuickSearchScorer._isTextTag(node)) {
                    result.push(node);
                }
                node = QuickSearchScorer._traverseNextTextNode(node);
            }
            return result;
        }
        static _traverseNextTextNode(element) {
            let node = QuickSearchScorer._traverseNextNode(element);
            if (node) {
                while (node && (node.nodeType !== Node.TEXT_NODE || !QuickSearchScorer._isTextTag(node))) {
                    node = QuickSearchScorer._traverseNextNode(node);
                }
            }
            return node;
        }
        static _traverseNextNode(element) {
            return element.firstChild ? element.firstChild : null;
        }
        static _isTextTag(node) {
            const nonTextTags = ['STYLE', 'SCRIPT'];
            return !nonTextTags.includes(node.parentElement.nodeName);
        }
    }
    return QuickSearchScorer;
});
