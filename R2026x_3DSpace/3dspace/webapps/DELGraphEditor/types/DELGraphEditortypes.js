/// <amd-module name="DS/DELGraphEditor/types/DELGraphEditortypes"/>
define("DS/DELGraphEditor/types/DELGraphEditortypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditorModes = exports.isLinkDiagramSchema = exports.isNodeDiagramSchema = exports.isLinkModelSchema = exports.isNodeModelSchema = void 0;
    // types chacking
    const isNodeModelSchema = (elt) => elt.id !== undefined && elt.type !== undefined && elt.label !== undefined && elt.parentID !== undefined;
    exports.isNodeModelSchema = isNodeModelSchema;
    const isLinkModelSchema = (elt) => elt.id !== undefined;
    exports.isLinkModelSchema = isLinkModelSchema;
    const isNodeDiagramSchema = (elt) => elt.id !== undefined;
    exports.isNodeDiagramSchema = isNodeDiagramSchema;
    ;
    const isLinkDiagramSchema = (elt) => elt.id !== undefined;
    exports.isLinkDiagramSchema = isLinkDiagramSchema;
    ;
    var EditorModes;
    (function (EditorModes) {
        EditorModes[EditorModes["AUTHORING"] = 0] = "AUTHORING";
        EditorModes[EditorModes["SIMULATION"] = 1] = "SIMULATION";
        EditorModes[EditorModes["READONLY"] = 2] = "READONLY";
    })(EditorModes || (exports.EditorModes = EditorModes = {}));
});
