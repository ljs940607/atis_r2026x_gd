/// <amd-module name="DS/DELGraphModel/types/DELGraphEditortypes"/>
define("DS/DELGraphModel/types/DELGraphEditortypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isLinkDiagramSchema = exports.isNodeDiagramSchema = exports.isLinkModelSchema = exports.isNodeModelSchema = void 0;
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
});
