/// <amd-module name="DS/DELSwimLaneChart_v2/typings/ChartTypings"/>
define("DS/DELSwimLaneChart_v2/typings/ChartTypings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBoudingBoxType = void 0;
    const isBoudingBoxType = (obj) => {
        return obj instanceof Object
            && "x" in obj && typeof obj["x"] === "number"
            && "y" in obj && typeof obj["y"] === "number"
            && "w" in obj && typeof obj["w"] === "number"
            && "h" in obj && typeof obj["h"] === "number";
    };
    exports.isBoudingBoxType = isBoudingBoxType;
});
