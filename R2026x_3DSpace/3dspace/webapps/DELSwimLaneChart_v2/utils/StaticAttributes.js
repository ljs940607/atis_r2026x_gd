/// <amd-module name="DS/DELSwimLaneChart_v2/utils/StaticAttributes"/>
define("DS/DELSwimLaneChart_v2/utils/StaticAttributes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EMBEDED_STYLES = exports.outlinegrey = exports.lightgrey = exports.highlight_color = exports.dark_gray = exports.corporate_steel_blue = exports.minus_icon = exports.plus_icon = exports.maximize_icon = exports.imgSize = exports.margin = exports.header_height = exports.groupMargin = exports.nodeColumnMargin = exports.gridWidthThreshold = exports.nameSpace = exports.isFireFox = exports.isMobileDevice = exports.group_gap = exports.node_gap = exports.grid_yOffset = exports.grid_xOffset = exports.swimLanechartNodeHeight = exports.gridStep = void 0;
    // graphical attributes
    exports.gridStep = 20;
    exports.swimLanechartNodeHeight = 6 * exports.gridStep;
    // rendering attributes
    exports.grid_xOffset = 0;
    exports.grid_yOffset = 2 * exports.gridStep;
    // export const min_grid_width=800;
    exports.node_gap = exports.gridStep;
    exports.group_gap = 2 * exports.gridStep;
    exports.isMobileDevice = window.navigator.userAgent.toLowerCase().includes("mobi") || window.navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    exports.isFireFox = navigator.userAgent.toLowerCase().includes('firefox');
    // svg elements namespace
    exports.nameSpace = "http://www.w3.org/2000/svg";
    // column view
    exports.gridWidthThreshold = 800;
    exports.nodeColumnMargin = exports.gridStep * 1.5;
    exports.groupMargin = exports.gridStep; // to avoid collision between nodes (grid-based positions) and group delimeters especially in the case of Porcedure (groupes traversing nodes)
    // node view
    exports.header_height = 1.5 * exports.gridStep;
    exports.margin = 8;
    exports.imgSize = 18;
    //icons
    exports.maximize_icon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='#000000' d='M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z'/></svg>";
    exports.plus_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaWQ9IkZJTkFMX2FydCIgZGF0YS1uYW1lPSJGSU5BTCBhcnQiPjxwb2x5Z29uIHBvaW50cz0iNi41IDEuNSA5LjUgMS41IDkuNSA2LjUgMTQuNSA2LjUgMTQuNSA5LjUgOS41IDkuNSA5LjUgMTQuNSA2LjUgMTQuNSA2LjUgOS41IDEuNSA5LjUgMS41IDYuNSA2LjUgNi41IDYuNSAxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0iYmxhY2siLz48L2c+PC9zdmc+";
    exports.minus_icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaWQ9IkZJTkFMX2FydCIgZGF0YS1uYW1lPSJGSU5BTCBhcnQiPjxyZWN0IHg9IjIuNSIgeT0iNi41IiB3aWR0aD0iMTEiIGhlaWdodD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJibGFjayIvPjwvZz48L3N2Zz4=";
    // colors
    exports.corporate_steel_blue = "#005686";
    exports.dark_gray = "#797979";
    exports.highlight_color = "#c9e0f0";
    exports.lightgrey = "#f4f5f6";
    exports.outlinegrey = "#cccccc";
    // styles
    exports.EMBEDED_STYLES = `
<style>
:root {
    --ds-blue: #0d6efd;
    --ds-body-color: #212529;
    --ds-secondary-color: rgba(33, 37, 41, 0.75);
    --ds-font-arial: Arial;
    --ds-body-font-family: var(--ds-font-arial);
    --ds-body-font-size: 14px;
    --ds-body-font-weight: 400;
    --ds-body-line-height: 1.5;
    --ds-body-bg: #fff;
    --ds-outline: var(--COLOR_OUTLINE_DARK_GRAY);
    --white: #fff;
    --black: #212529;
    --red: #ff8a8a;
    --green: #a2e88e;
    --blue: #00b8de;
    --yellow: #fff792;
    --lightgrey: #e7e2e2;
    --darkred: #ea4f37;
    --darkgreen: #57b847;
    --darkblue: #00b8de;
    --darkyellow: #ffce00;
    --darkgrey: #D3D3D3;
    --fontdarkgrey:#77797c;
    --transparent:transparent;
    --opacity:0;
}

*, *::before, *::after {
    box-sizing: border-box;
}


.content:focus {
    outline: 1px solid white;
}

.titleParent{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
} 


.responsiveText {
    width: 100%;
    height: 100%;
    outline: none;
    display: table-cell;
    vertical-align: middle;
    flex-direction: row;
    word-break: break-word;
    white-space: wrap;
    font-size:"Arial";
}

</style>
`;
});
