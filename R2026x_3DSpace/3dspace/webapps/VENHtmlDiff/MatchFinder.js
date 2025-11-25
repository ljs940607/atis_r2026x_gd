define(["require", "exports", "./Utils"], function (require, exports, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findMatch = void 0;
    var putNewWord = function (block, word, blockSize) {
        block.push(word);
        if (block.length > blockSize) {
            block.shift();
        }
        if (block.length !== blockSize) {
            return null;
        }
        return block.join("");
    };
    // Converts the word to index-friendly value so it can be compared with other similar words
    var normalizeForIndex = function (word, ignoreWhiteSpaceDifferences) {
        word = Utils.stripAnyAttributes(word);
        if (ignoreWhiteSpaceDifferences && Utils.isWhiteSpace(word)) {
            return " ";
        }
        return word;
    };
    var indexNewWords = function (newWords, startIndex, endIndex, options) {
        var _a;
        var wordIndices = new Map();
        var block = [];
        for (var i = startIndex; i < endIndex; i++) {
            // if word is a tag, we should ignore attributes as attribute changes are not supported (yet)
            var word = normalizeForIndex(newWords[i], options.ignoreWhiteSpaceDifferences);
            var key = putNewWord(block, word, options.blockSize);
            if (key === null) {
                continue;
            }
            if (wordIndices.has(key)) {
                (_a = wordIndices.get(key)) === null || _a === void 0 ? void 0 : _a.push(i);
            }
            else {
                wordIndices.set(key, [i]);
            }
        }
        return wordIndices;
    };
    var findMatch = function (oldWords, newWords, startInOld, endInOld, startInNew, endInNew, options) {
        var _a, _b;
        var wordIndices = indexNewWords(newWords, startInNew, endInNew, options);
        if (wordIndices.size === 0) {
            return null;
        }
        var bestMatchInOld = startInOld;
        var bestMatchInNew = startInNew;
        var bestMatchSize = 0;
        var matchLengthAt = new Map();
        var blockSize = options.blockSize;
        var block = [];
        for (var indexInOld = startInOld; indexInOld < endInOld; indexInOld++) {
            var word = normalizeForIndex(oldWords[indexInOld], options.ignoreWhiteSpaceDifferences);
            var index = putNewWord(block, word, blockSize);
            if (index === null) {
                continue;
            }
            var newMatchLengthAt = new Map();
            if (!wordIndices.has(index)) {
                matchLengthAt = newMatchLengthAt;
                continue;
            }
            var indices = (_a = wordIndices.get(index)) !== null && _a !== void 0 ? _a : [];
            for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                var indexInNew = indices_1[_i];
                var newMatchLength = ((_b = matchLengthAt.get(indexInNew - 1)) !== null && _b !== void 0 ? _b : 0) + 1;
                newMatchLengthAt.set(indexInNew, newMatchLength);
                if (newMatchLength > bestMatchSize) {
                    bestMatchInOld = indexInOld - newMatchLength - blockSize + 2;
                    bestMatchInNew = indexInNew - newMatchLength - blockSize + 2;
                    bestMatchSize = newMatchLength;
                }
            }
            matchLengthAt = newMatchLengthAt;
        }
        var matchSize = bestMatchSize + blockSize - 1;
        return bestMatchSize !== 0
            ? {
                startInOld: bestMatchInOld,
                startInNew: bestMatchInNew,
                endInOld: bestMatchInOld + matchSize,
                endInNew: bestMatchInNew + matchSize,
                size: matchSize,
            }
            : null;
    };
    exports.findMatch = findMatch;
});
//# sourceMappingURL=MatchFinder.js.map
