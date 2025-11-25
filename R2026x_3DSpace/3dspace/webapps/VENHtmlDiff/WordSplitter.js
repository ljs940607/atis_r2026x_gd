define(["require", "exports", "./Utils"], function (require, exports, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertHtmlToListOfWords = void 0;
    var convertHtmlToListOfWords = function (text, blockExpressions) {
        var _a;
        var state = {
            mode: "character",
            currentWord: [],
            words: [],
        };
        var blockLocations = findBlocks(text, blockExpressions);
        var isBlockCheckRequired = !!blockLocations.size;
        var isGrouping = false;
        var groupingUntil = -1;
        for (var index = 0; index < text.length; index++) {
            var character = text[index];
            // Don't bother executing block checks if we don't have any blocks to check for!
            if (isBlockCheckRequired) {
                // Check if we have completed grouping a text sequence/block
                if (groupingUntil === index) {
                    groupingUntil = -1;
                    isGrouping = false;
                }
                // Check if we need to group the next text sequence/block
                var until = 0;
                if (blockLocations.has(index)) {
                    until = (_a = blockLocations.get(index)) !== null && _a !== void 0 ? _a : 0;
                    isGrouping = true;
                    groupingUntil = until;
                }
                // if we are grouping, then we don't care about what type of character we have, it's going to be treated as a word
                if (isGrouping) {
                    state.currentWord.push(character);
                    state.mode = "character";
                    continue;
                }
            }
            switch (state.mode) {
                case "character":
                    if (Utils.isStartOfTag(character)) {
                        addClearWordSwitchMode(state, "<", "tag");
                    }
                    else if (Utils.isStartOfEntity(character)) {
                        addClearWordSwitchMode(state, character, "entity");
                    }
                    else if (Utils.isWhiteSpace(character)) {
                        addClearWordSwitchMode(state, character, "whitespace");
                    }
                    else if (Utils.isWord(character) &&
                        (state.currentWord.length === 0 ||
                            Utils.isWord(state.currentWord[state.currentWord.length - 1]))) {
                        state.currentWord.push(character);
                    }
                    else {
                        addClearWordSwitchMode(state, character, "character");
                    }
                    break;
                case "tag":
                    if (Utils.isEndOfTag(character)) {
                        state.currentWord.push(character);
                        state.words.push(state.currentWord.join(""));
                        state.currentWord = [];
                        state.mode = Utils.isWhiteSpace(character)
                            ? "whitespace"
                            : "character";
                    }
                    else {
                        state.currentWord.push(character);
                    }
                    break;
                case "whitespace":
                    if (Utils.isStartOfTag(character)) {
                        addClearWordSwitchMode(state, character, "tag");
                    }
                    else if (Utils.isStartOfEntity(character)) {
                        addClearWordSwitchMode(state, character, "entity");
                    }
                    else if (Utils.isWhiteSpace(character)) {
                        state.currentWord.push(character);
                    }
                    else {
                        addClearWordSwitchMode(state, character, "character");
                    }
                    break;
                case "entity":
                    if (Utils.isStartOfTag(character)) {
                        addClearWordSwitchMode(state, character, "tag");
                    }
                    else if (Utils.isWhiteSpace(character)) {
                        addClearWordSwitchMode(state, character, "whitespace");
                    }
                    else if (Utils.isEndOfEntity(character)) {
                        var switchToNextMode = true;
                        if (state.currentWord.length !== 0) {
                            state.currentWord.push(character);
                            state.words.push(state.currentWord.join(""));
                            //join &nbsp; entity with last whitespace
                            if (state.words.length > 2 &&
                                Utils.isWhiteSpace(state.words[state.words.length - 2]) &&
                                Utils.isWhiteSpace(state.words[state.words.length - 1])) {
                                var w1 = state.words[state.words.length - 2];
                                var w2 = state.words[state.words.length - 1];
                                state.words.splice(state.words.length - 2, 2);
                                state.currentWord = [w1, w2];
                                state.mode = "whitespace";
                                switchToNextMode = false;
                            }
                        }
                        if (switchToNextMode) {
                            state.currentWord = [];
                            state.mode = "character";
                        }
                    }
                    else if (Utils.isWord(character)) {
                        state.currentWord.push(character);
                    }
                    else {
                        addClearWordSwitchMode(state, character, "character");
                    }
                    break;
            }
        }
        if (state.currentWord.length !== 0) {
            state.words.push(state.currentWord.join(""));
        }
        return state.words;
    };
    exports.convertHtmlToListOfWords = convertHtmlToListOfWords;
    var addClearWordSwitchMode = function (state, character, mode) {
        if (state.currentWord.length !== 0) {
            state.words.push(state.currentWord.join(""));
        }
        state.currentWord = [character];
        state.mode = mode;
    };
    var findBlocks = function (text, blockExpressions) {
        var blockLocations = new Map();
        if (blockExpressions === null) {
            return blockLocations;
        }
        for (var _i = 0, blockExpressions_1 = blockExpressions; _i < blockExpressions_1.length; _i++) {
            var exp = blockExpressions_1[_i];
            var m = void 0;
            while ((m = exp.exec(text)) !== null) {
                if (blockLocations.has(m.index)) {
                    throw new Error("One or more block expressions result in a text sequence that overlaps. Current expression: " +
                        exp.toString());
                }
                blockLocations.set(m.index, m.index + m[0].length);
            }
        }
        return blockLocations;
    };
});
//# sourceMappingURL=WordSplitter.js.map
