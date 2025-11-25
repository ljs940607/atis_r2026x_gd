var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define("DS/VENHtmlDiff/HTMLDiff", ["require", "exports", "./Match", "./MatchFinder", "./Utils", "./WordSplitter"], function (require, exports, Match_1, MatchFinder_1, Utils, WordSplitter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var specialCaseClosingTags = new Map([
        ["</strong>", 0],
        ["</em>", 0],
        ["</b>", 0],
        ["</i>", 0],
        ["</big>", 0],
        ["</small>", 0],
        ["</u>", 0],
        ["</sub>", 0],
        ["</strike>", 0],
        ["</s>", 0],
        ["</dfn>", 0],
    ]);
    var specialCaseOpeningTagRegex = /<((strong)|(b)|(i)|(dfn)|(em)|(big)|(small)|(u)|(sub)|(sup)|(strike)|(s))[>\s]+/gi;
    var build = function (oldText, newText, options) {
        var _a, _b, _c, _d, _e;
        if (oldText === newText) {
            return newText;
        }
        var _f = splitInputsIntoWords(oldText, newText, []), oldWords = _f.oldWords, newWords = _f.newWords;
        var matchGranularity = Math.min((_a = options === null || options === void 0 ? void 0 : options.matchGranularity) !== null && _a !== void 0 ? _a : 4, oldWords.length, newWords.length);
        var operations = getOperations(oldWords, newWords, (_b = options === null || options === void 0 ? void 0 : options.combineWords) !== null && _b !== void 0 ? _b : false, (_c = options === null || options === void 0 ? void 0 : options.orphanMatchThreshold) !== null && _c !== void 0 ? _c : 0, matchGranularity, (_d = options === null || options === void 0 ? void 0 : options.repeatingWordsAccuracy) !== null && _d !== void 0 ? _d : 1, (_e = options === null || options === void 0 ? void 0 : options.ignoreWhiteSpaceDifferences) !== null && _e !== void 0 ? _e : false);
        var specialTagDiffStack = [];
        var content = operations.map(function (operation) {
            return performOperation(operation, oldWords, newWords, specialTagDiffStack);
        });
        return content.join("");
    };
    var splitInputsIntoWords = function (oldText, newText, blockExpressions) {
        var oldWords = WordSplitter.convertHtmlToListOfWords(oldText, blockExpressions);
        var newWords = WordSplitter.convertHtmlToListOfWords(newText, blockExpressions);
        return { oldWords: oldWords, newWords: newWords };
    };
    var performOperation = function (operation, oldWords, newWords, specialTagDiffStack) {
        switch (operation.action) {
            case "equal":
                return processEqualOperation(operation, newWords);
            case "delete":
                return processDeleteOperation(operation, "diffdel", oldWords, specialTagDiffStack);
            case "insert":
                return processInsertOperation(operation, "diffins", newWords, specialTagDiffStack);
            case "replace":
                return processReplaceOperation(operation, oldWords, newWords, specialTagDiffStack);
            case "none":
            default:
                return "";
        }
    };
    var processReplaceOperation = function (operation, oldWords, newWords, specialTagDiffStack) {
        var deletedContent = processDeleteOperation(operation, "diffmod", oldWords, specialTagDiffStack);
        var insertedContent = processInsertOperation(operation, "diffmod", newWords, specialTagDiffStack);
        return "".concat(deletedContent).concat(insertedContent);
    };
    var processInsertOperation = function (operation, cssClass, newWords, specialTagDiffStack) {
        var text = newWords.filter(function (_s, pos) { return pos >= operation.startInNew && pos < operation.endInNew; });
        return insertTag("ins", cssClass, text, specialTagDiffStack);
    };
    var processDeleteOperation = function (operation, cssClass, oldWords, specialTagDiffStack) {
        var text = oldWords.filter(function (_s, pos) { return pos >= operation.startInOld && pos < operation.endInOld; });
        return insertTag("del", cssClass, text, specialTagDiffStack);
    };
    var processEqualOperation = function (operation, newWords) {
        var result = newWords.filter(function (_s, pos) { return pos >= operation.startInNew && pos < operation.endInNew; });
        return result.join("");
    };
    var insertTag = function (tag, cssClass, words, specialTagDiffStack) {
        var content = [];
        while (words.length) {
            var nonTags = extractConsecutiveWords(words, function (x) { return !Utils.isTag(x); });
            var specialCaseTagInjection = "";
            var specialCaseTagInjectionIsbefore = false;
            if (nonTags.length !== 0) {
                var text = Utils.wrapText(nonTags.join(""), tag, cssClass);
                content.push(text);
            }
            else {
                if (specialCaseOpeningTagRegex.test(words[0])) {
                    var matchedTag = words[0].match(specialCaseOpeningTagRegex);
                    if (matchedTag !== null) {
                        var matchedDiff = "<" + matchedTag[0].replace(/(<|>| )/g, "") + ">";
                        specialTagDiffStack.push(matchedDiff);
                    }
                    specialCaseTagInjection = '<ins class="mod">';
                    if (tag === "del") {
                        words.shift();
                        while (words.length > 0 &&
                            specialCaseOpeningTagRegex.test(words[0])) {
                            words.shift();
                        }
                    }
                }
                else if (specialCaseClosingTags.has(words[0])) {
                    var openingTag = specialTagDiffStack.length === 0 ? null : specialTagDiffStack.pop();
                    if (!(openingTag === null ||
                        openingTag !== words[words.length - 1].replace(/\//g, ""))) {
                        specialCaseTagInjection = "</ins>";
                        specialCaseTagInjectionIsbefore = true;
                    }
                    if (tag === "del") {
                        words.shift();
                        while (words.length > 0 && specialCaseClosingTags.has(words[0])) {
                            words.shift();
                        }
                    }
                }
                if (words.length === 0 && specialCaseTagInjection.length === 0) {
                    break;
                }
                if (specialCaseTagInjectionIsbefore) {
                    content.push(specialCaseTagInjection +
                        extractConsecutiveWords(words, Utils.isTag).join(""));
                }
                else {
                    content.push(extractConsecutiveWords(words, Utils.isTag).join("") +
                        specialCaseTagInjection);
                }
            }
        }
        return content.join("");
    };
    var extractConsecutiveWords = function (words, condition) {
        var indexOfFirstTag = 0;
        var tagFound = false;
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (i === 0 && word === " ") {
                words[i] = "&nbsp;";
            }
            if (!condition(word)) {
                indexOfFirstTag = i;
                tagFound = true;
                break;
            }
        }
        if (tagFound) {
            var items = words.filter(function (_s, pos) { return pos >= 0 && pos < indexOfFirstTag; });
            if (indexOfFirstTag > 0) {
                words.splice(0, indexOfFirstTag);
            }
            return items;
        }
        else {
            var items = words.filter(function (_s, pos) { return pos >= 0 && pos < words.length; });
            words.splice(0, words.length);
            return items;
        }
    };
    var getOperations = function (oldWords, newWords, combineWords, orphanMatchThreshold, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences) {
        var positionInOld = 0;
        var positionInNew = 0;
        var operations = [];
        var oldWordsCount = oldWords.length;
        var newWordsCount = newWords.length;
        var matches = getMatchingBlocks(oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences);
        matches.push({
            startInOld: oldWordsCount,
            startInNew: newWordsCount,
            endInOld: oldWordsCount,
            endInNew: newWordsCount,
            size: 0,
        });
        var matchesWithoutOrphans = removeOrphans(matches, oldWords, newWords, orphanMatchThreshold);
        for (var _i = 0, matchesWithoutOrphans_1 = matchesWithoutOrphans; _i < matchesWithoutOrphans_1.length; _i++) {
            var match = matchesWithoutOrphans_1[_i];
            if (match === null)
                continue;
            var matchStartsAtCurrentPositionInOld = positionInOld === match.startInOld;
            var matchStartsAtCurrentPositionInNew = positionInNew === match.startInNew;
            var action = void 0;
            if (!matchStartsAtCurrentPositionInOld &&
                !matchStartsAtCurrentPositionInNew) {
                action = "replace";
            }
            else if (matchStartsAtCurrentPositionInOld &&
                !matchStartsAtCurrentPositionInNew) {
                action = "insert";
            }
            else if (!matchStartsAtCurrentPositionInOld) {
                action = "delete";
            }
            else {
                action = "none";
            }
            if (action !== "none") {
                operations.push({
                    action: action,
                    startInOld: positionInOld,
                    endInOld: match.startInOld,
                    startInNew: positionInNew,
                    endInNew: match.startInNew,
                });
            }
            if (match.size !== 0) {
                operations.push({
                    action: "equal",
                    startInOld: match.startInOld,
                    endInOld: match.endInOld,
                    startInNew: match.startInNew,
                    endInNew: match.endInNew,
                });
            }
            positionInOld = match.endInOld;
            positionInNew = match.endInNew;
        }
        if (!combineWords)
            return operations;
        else
            return combineOperations(operations, oldWords, newWords);
    };
    var combineOperations = function (operations, oldWords, newWords) {
        var combinedOperations = [];
        var operationIsWhitespace = function (op) {
            return Utils.isWhiteSpace(oldWords
                .filter(function (_word, pos) { return pos >= op.startInOld && pos < op.endInOld; })
                .join("")) &&
                Utils.isWhiteSpace(newWords
                    .filter(function (_word, pos) { return pos >= op.startInNew && pos < op.endInNew; })
                    .join(""));
        };
        var lastOperation = operations[operations.length - 1];
        for (var index = 0; index < operations.length; index++) {
            var operation = operations[index];
            if (operation.action === "replace") {
                var matchFound = false;
                for (var combineIndex = index + 1; combineIndex < operations.length; combineIndex++) {
                    var operationToCombine = operations[combineIndex];
                    if (operationToCombine.action !== "replace" &&
                        operationToCombine.action === "equal" &&
                        !operationIsWhitespace(operationToCombine)) {
                        combinedOperations.push({
                            action: "replace",
                            startInOld: operation.startInOld,
                            endInOld: operationToCombine.startInOld,
                            startInNew: operation.startInNew,
                            endInNew: operationToCombine.startInNew,
                        });
                        index = combineIndex - 1;
                        matchFound = true;
                        break;
                    }
                }
                if (!matchFound) {
                    combinedOperations.push({
                        action: "replace",
                        startInOld: operation.startInOld,
                        endInOld: lastOperation.endInOld,
                        startInNew: operation.startInNew,
                        endInNew: lastOperation.endInNew,
                    });
                    break;
                }
            }
            else {
                combinedOperations.push(operation);
            }
        }
        return combinedOperations;
    };
    var removeOrphans = function (matches, oldWords, newWords, orphanMatchThreshold) {
        var matchesWithoutOrphans = [];
        var prev = __assign({}, Match_1.NoMatch);
        var curr = null;
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var next = matches_1[_i];
            if (curr === null) {
                prev = __assign({}, Match_1.NoMatch);
                curr = next;
                continue;
            }
            if ((prev.endInOld === curr.startInOld &&
                prev.endInNew === curr.startInNew) ||
                (curr.endInOld === next.startInOld && curr.endInNew === next.startInNew)) {
                matchesWithoutOrphans.push(curr);
                prev = curr;
                curr = next;
                continue;
            }
            var sumLength = function (sum, word) { return sum + word.length; };
            var oldDistanceInChars = oldWords
                .slice(prev.endInOld, next.startInOld)
                .reduce(sumLength, 0);
            var newDistanceInChars = newWords
                .slice(prev.endInNew, next.startInNew)
                .reduce(sumLength, 0);
            var currMatchLengthInChars = newWords
                .slice(curr.startInNew, curr.endInNew)
                .reduce(sumLength, 0);
            if (currMatchLengthInChars >
                Math.max(oldDistanceInChars, newDistanceInChars) * orphanMatchThreshold) {
                matchesWithoutOrphans.push(curr);
            }
            prev = curr;
            curr = next;
        }
        if (curr !== null)
            matchesWithoutOrphans.push(curr);
        return matchesWithoutOrphans;
    };
    var getMatchingBlocks = function (oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences) {
        return findMatchingBlocks(0, oldWords.length, 0, newWords.length, oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences);
    };
    var findMatchingBlocks = function (startInOld, endInOld, startInNew, endInNew, oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences) {
        if (startInOld >= endInOld || startInNew >= endInNew)
            return [];
        var match = findMatchByGranularity(startInOld, endInOld, startInNew, endInNew, oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences);
        if (match === null)
            return [];
        var preMatch = findMatchingBlocks(startInOld, match.startInOld, startInNew, match.startInNew, oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences);
        var postMatch = findMatchingBlocks(match.endInOld, endInOld, match.endInNew, endInNew, oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences);
        return __spreadArray(__spreadArray(__spreadArray([], preMatch, true), [match], false), postMatch, true);
    };
    var findMatchByGranularity = function (startInOld, endInOld, startInNew, endInNew, oldWords, newWords, matchGranularity, repeatingWordsAccuracy, ignoreWhiteSpaceDifferences) {
        for (var i = matchGranularity; i > 0; i--) {
            var options = {
                blockSize: i,
                repeatingWordsAccuracy: repeatingWordsAccuracy,
                ignoreWhiteSpaceDifferences: ignoreWhiteSpaceDifferences,
            };
            var match = (0, MatchFinder_1.findMatch)(oldWords, newWords, startInOld, endInOld, startInNew, endInNew, options);
            if (match !== null) {
                return match;
            }
        }
        return null;
    };
    var execute = function (oldText, newText, options) {
        return build(oldText, newText, options);
    };
    exports.default = execute;
});
//# sourceMappingURL=HTMLDiff.js.map
