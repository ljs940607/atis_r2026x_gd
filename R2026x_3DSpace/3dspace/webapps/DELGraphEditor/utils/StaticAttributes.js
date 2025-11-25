/// <amd-module name="DS/DELGraphEditor/utils/StaticAttributes"/>
define("DS/DELGraphEditor/utils/StaticAttributes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nodeDimensionsSet = exports.getPossibleTypesOfNode = exports.linkTypes = exports.nodeTypes = exports.isMobileDevice = exports.line_height = exports.font_family = exports.text_padding = exports.font_size = exports.min_text_length = exports.svgHeight = exports.svgWidth = exports.svgStaticPos = exports.gridStep = void 0;
    //grid related attributes
    exports.gridStep = 24;
    exports.svgStaticPos = { x: -1000000 / 2, y: -1000000 / 2 };
    exports.svgWidth = 1000000;
    exports.svgHeight = 1000000;
    // text related attributes
    exports.min_text_length = 2 * exports.gridStep;
    exports.font_size = "14px";
    exports.text_padding = "8px 12px";
    exports.font_family = "Arial";
    exports.line_height = 21;
    exports.isMobileDevice = window.navigator.userAgent.toLowerCase().includes("mobi") || window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    // graph elts related attributes
    exports.nodeTypes = [
        "Initial",
        "Final",
        "Choice",
        "Node",
        "GroupNode"
    ];
    exports.linkTypes = [
        "Event",
        "After",
        "Always",
        "Time",
    ];
    const getPossibleTypesOfNode = (initialNodeType) => {
        if (exports.nodeTypes.includes(initialNodeType))
            return exports.nodeTypes;
        else if (exports.linkTypes.includes(initialNodeType))
            return exports.linkTypes;
        else
            return [];
    };
    exports.getPossibleTypesOfNode = getPossibleTypesOfNode;
    exports.nodeDimensionsSet = new Map([
        ["Initial", [2 * exports.gridStep, 2 * exports.gridStep]],
        ["Final", [2 * exports.gridStep, 2 * exports.gridStep]],
        ["Choice", [2 * exports.gridStep, 2 * exports.gridStep]],
        ["Node", [8 * exports.gridStep, 4 * exports.gridStep]],
        ["GroupNode", [8 * exports.gridStep, 8 * exports.gridStep]]
    ]);
});
