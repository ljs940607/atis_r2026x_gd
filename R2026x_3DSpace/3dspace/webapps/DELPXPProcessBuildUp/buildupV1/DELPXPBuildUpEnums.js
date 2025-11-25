define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionMode = void 0;
    var SelectionMode;
    (function (SelectionMode) {
        SelectionMode[SelectionMode["SelectionMode_Start"] = 0] = "SelectionMode_Start";
        SelectionMode[SelectionMode["SelectionMode_WIP"] = 1] = "SelectionMode_WIP";
        SelectionMode[SelectionMode["SelectionMode_End"] = 2] = "SelectionMode_End";
    })(SelectionMode || (exports.SelectionMode = SelectionMode = {}));
});
