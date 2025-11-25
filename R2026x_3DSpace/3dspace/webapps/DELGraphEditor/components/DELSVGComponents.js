/// <amd-module name="DS/DELGraphEditor/components/DELSVGComponents"/>
define("DS/DELGraphEditor/components/DELSVGComponents", ["require", "exports", "DS/DELGraphEditor/utils/GeometricalComputation", "DS/DELGraphEditor/utils/LinksMovementsUtils", "DS/DELGraphEditor/utils/StaticAttributes", "DS/DELGraphModel/model/Link", "DS/DELGraphModel/model/Node", "DS/DELGraphEditor/utils/StaticAttributes", "DS/DELGraphEditor/utils/TextComputations"], function (require, exports, GeometricalComputation_1, LinksMovementsUtils_1, StaticAttributes_1, Link_1, Node_1, StaticAttributes_2, TextComputations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drawQuadTree = exports.drawOrthogonalIntersectionArcs = exports.drawFloatingConnector = exports.hideSelectionBar = exports.updateSelectiobBarPos = exports.showSelectionBar = exports.cleanToolsShapersLayer = exports.highlightElements = exports.drawFreeSelectionZone = exports.updateGraphLink = exports.createGraphLink = exports.updateGraphNode = exports.createGraphNode = exports.getGridSVGTemplate = void 0;
    const nameSpace = "http://www.w3.org/2000/svg";
    const EMBEDED_STYLES = `
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
    --COLOR_BACKGROUND_GRAY: #f9f9f9;
    --COLOR_DARK_GRAY: #3d3d3d;
    --COLOR_OUTLINE_GRAY:#e2e4e3;
    --COLOR_COPY_GRAY:#77797c;
    --white:#fff;
    --red:#ffd2cf;
    --green:#d3f4cb;
    --blue:#d1e7f2;
    --yellow:#fcf2c8;
    --darkgrey:#77797c;
    --darkred:#ea4f37;
    --darkgreen:#57b847;
    --darkblue:#00b8de;
    --darkyellow:#ffce00;
    --lightgrey:rgba(0, 0, 0, .25);
}




.readOnlyInput {
    width: 100%;
    height: 100%;
    outline: none;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    -webkit-text-align: center;
    cursor: move;
    padding: 0 8px;
    word-break: break-word;
    white-space: wrap;
    line-height: 24px;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    border: none;
    font-kerning: auto;
    font-optical-sizing: none;
   
}


.textAreaWrapper {
    overflow: visible;
}

.glassLayer {
    width: calc(100%);
    height: calc(100%);
    background-color: rgba(216, 213, 213, 0.3);
    pointer-events: none;
}
</style>
`;
    const getGridSVGTemplate = (componentId, mousecursor, transformVector, svgStaticPos, svgWidth, svgHeight) => {
        return `
            <div class="editor" >
            <div class="console" style="position:absolute;top:10px;"></div>
            <wux-context-tool-bar id="wux-context-tool-bar_${componentId}" isvisible="hidden" color="white" x_position="0" y_position="0" x_offset="0" y_offset="0" transmatrix="[0,0,1]" scale=${transformVector[2]}></wux-context-tool-bar>
            <wux-authoring-side-tool-bar id="wux-authoring-side-tool-bar_${componentId}" ></wux-authoring-side-tool-bar>
            <svg 
                id="svg-Layer_${componentId}"
                class="svgLayer"
                tabindex="-1"
                preserveAspectRatio="xMaxYMid meet"
                style="cursor:${mousecursor}; font-family: Arial;font-size: 14px; font-weight:normal;outline: 1px solid white;"
                >
                ${EMBEDED_STYLES}
                <style >
                #svg-Layer_${componentId} {
                    --highlighted-flow-head:url(#highlightedarrowHead_${componentId});
                    --plus-icon-id:url(#plus_${componentId});
                    --shadow-id:url(#shadow_${componentId});
                }

                
                    
                </style>
                    <defs>
                        <filter id="shadow_${componentId}">
                            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="var(--lightgrey)"/>
                        </filter>
                        <pattern id="grid-pattern_${componentId}" width=${StaticAttributes_2.gridStep} height=${StaticAttributes_2.gridStep} x="0" y="0" patternUnits="userSpaceOnUse">
                            <rect width=${StaticAttributes_2.gridStep} height=${StaticAttributes_2.gridStep} fill="white" stroke="var(--COLOR_OUTLINE_GRAY)" stroke-opacity="0.45" stroke-width="1" ></rect>
                        </pattern>
                        <pattern id="resize_${componentId}" x="0" y="0" width="1" height="1">
                         <image  x="0" y="0" width="8" height="8" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU0IiBoZWlnaHQ9IjEyOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMCI+PHJlY3QgeD0iMTkxNCIgeT0iMzI3IiB3aWR0aD0iMTU0IiBoZWlnaHQ9IjEyOSIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xOTE0IC0zMjcpIj48cGF0aCBkPSJNMTkxNi43NyA0MzkuMDg2QzE5MTMuNzYgNDM1LjY2NiAxOTE0LjA5IDQzMC40NTMgMTkxNy41MSA0MjcuNDQzTDIwMjguOTkgMzI5LjM0NUMyMDMyLjQyIDMyNi4zMzUgMjAzNy42MyAzMjYuNjY4IDIwNDAuNjQgMzMwLjA4OEwyMDQwLjY0IDMzMC4wODhDMjA0My42NSAzMzMuNTA5IDIwNDMuMzEgMzM4LjcyMiAyMDM5Ljg5IDM0MS43MzJMMTkyOC40MSA0MzkuODNDMTkyNC45OSA0NDIuODQgMTkxOS43NyA0NDIuNTA3IDE5MTYuNzcgNDM5LjA4NloiIGZpbGw9IiM3NjcxNzEiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xOTg0LjE1IDQ1Mi42NTlDMTk4MS4xNCA0NDkuMjM4IDE5ODEuNDcgNDQ0LjAyNSAxOTg0LjkgNDQxLjAxNUwyMDU0LjI2IDM3OS45NzZDMjA1Ny42OSAzNzYuOTY3IDIwNjIuOSAzNzcuMyAyMDY1LjkxIDM4MC43MkwyMDY1LjkxIDM4MC43MkMyMDY4LjkyIDM4NC4xNDEgMjA2OC41OCAzODkuMzU0IDIwNjUuMTYgMzkyLjM2M0wxOTk1Ljc5IDQ1My40MDJDMTk5Mi4zNyA0NTYuNDEyIDE5ODcuMTYgNDU2LjA3OSAxOTg0LjE1IDQ1Mi42NTlaIiBmaWxsPSIjNzY3MTcxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L2c+PC9zdmc+" />
                        </pattern>
                        <pattern id="event_${componentId}" x="0" y="0" width="1" height="1">
                        <image href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTc0IiBoZWlnaHQ9IjcwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgb3ZlcmZsb3c9ImhpZGRlbiI+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMCI+PHJlY3QgeD0iMTU3NSIgeT0iODg2IiB3aWR0aD0iNTc0IiBoZWlnaHQ9IjcwMiIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTc1IC04ODYpIj48cGF0aCBkPSJNMTU3Ny41IDEyMjkuNUMxNTc3LjUgMTA3Mi42NSAxNzA0Ljg4IDk0NS41IDE4NjIgOTQ1LjUgMjAxOS4xMiA5NDUuNSAyMTQ2LjUgMTA3Mi42NSAyMTQ2LjUgMTIyOS41IDIxNDYuNSAxMzg2LjM1IDIwMTkuMTIgMTUxMy41IDE4NjIgMTUxMy41IDE3MDQuODggMTUxMy41IDE1NzcuNSAxMzg2LjM1IDE1NzcuNSAxMjI5LjVaIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNC41ODMzMyIgc3Ryb2tlLW1pdGVybGltaXQ9IjgiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xNjE2LjUgMTIzMEMxNjE2LjUgMTA5NC40MSAxNzI2LjQxIDk4NC41IDE4NjIgOTg0LjUgMTk5Ny41OSA5ODQuNSAyMTA3LjUgMTA5NC40MSAyMTA3LjUgMTIzMCAyMTA3LjUgMTM2NS41OSAxOTk3LjU5IDE0NzUuNSAxODYyIDE0NzUuNSAxNzI2LjQxIDE0NzUuNSAxNjE2LjUgMTM2NS41OSAxNjE2LjUgMTIzMFoiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0LjU4MzMzIiBzdHJva2UtbWl0ZXJsaW1pdD0iOCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTE3NjkuOTMgMTI3OC41QzE3MzguOTYgMTI2NS40NCAxNzI0LjQ1IDEyMjkuNzYgMTczNy41IDExOTguNzlMMTg0Ny42MyA5MzcuNjQ4QzE4NjAuNjkgOTA2LjY4NCAxODk2LjM4IDg5Mi4xNjkgMTkyNy4zNCA5MDUuMjI3TDE5MjcuMzQgOTA1LjIyN0MxOTU4LjMxIDkxOC4yODUgMTk3Mi44MiA5NTMuOTcyIDE5NTkuNzYgOTg0LjkzNkwxODQ5LjY0IDEyNDYuMDhDMTgzNi41OCAxMjc3LjA0IDE4MDAuODkgMTI5MS41NiAxNzY5LjkzIDEyNzguNVoiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyNy41IiBzdHJva2UtbWl0ZXJsaW1pdD0iOCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTE4MjkuNDIgMTU3MC43OEMxODA5LjU1IDE1NjIuNzQgMTc5OS45NyAxNTQwLjExIDE4MDguMDIgMTUyMC4yNUwxOTMxLjk5IDEyMTQuMTFDMTk0MC4wMyAxMTk0LjI0IDE5NjIuNjUgMTE4NC42NiAxOTgyLjUyIDExOTIuN0wxOTgyLjUyIDExOTIuNzFDMjAwMi4zOCAxMjAwLjc1IDIwMTEuOTcgMTIyMy4zNyAyMDAzLjkyIDEyNDMuMjRMMTg3OS45NSAxNTQ5LjM4QzE4NzEuOTEgMTU2OS4yNCAxODQ5LjI4IDE1NzguODIgMTgyOS40MiAxNTcwLjc4WiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjI3LjUiIHN0cm9rZS1taXRlcmxpbWl0PSI4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMTc0OSAxMjIwLjVDMTc0OSAxMTkxLjUxIDE3NzIuNTEgMTE2OCAxODAxLjUgMTE2OEwxOTQxLjUgMTE2OEMxOTcwLjUgMTE2OCAxOTk0IDExOTEuNTEgMTk5NCAxMjIwLjVMMTk5NCAxMjIwLjVDMTk5NCAxMjQ5LjUgMTk3MC40OSAxMjczIDE5NDEuNSAxMjczTDE4MDEuNSAxMjczQzE3NzIuNTEgMTI3MyAxNzQ5IDEyNDkuNSAxNzQ5IDEyMjAuNVoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xODM4LjI2IDE1NDcuNDhDMTgyNi40NyAxNTQ0LjkyIDE4MTguOTggMTUzMy4yOCAxODIxLjU0IDE1MjEuNDlMMTg4MS4yNiAxMjQ2LjFDMTg4My44MiAxMjM0LjMxIDE4OTUuNDUgMTIyNi44MiAxOTA3LjI1IDEyMjkuMzhMMTkwNy4yNSAxMjI5LjM4QzE5MTkuMDQgMTIzMS45NCAxOTI2LjUzIDEyNDMuNTcgMTkyMy45NyAxMjU1LjM2TDE4NjQuMjQgMTUzMC43NUMxODYxLjY5IDE1NDIuNTUgMTg1MC4wNSAxNTUwLjAzIDE4MzguMjYgMTU0Ny40OFoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xODQwLjQ5IDExOTkuNjVDMTgyNC4zMyAxMTk0LjMgMTgxNS41NyAxMTc2Ljg2IDE4MjAuOTIgMTE2MC43TDE4ODUuMjcgOTY2LjQyNUMxODkwLjYyIDk1MC4yNjcgMTkwOC4wNiA5NDEuNTA2IDE5MjQuMjIgOTQ2Ljg1OUwxOTI0LjIyIDk0Ni44NTlDMTk0MC4zOCA5NTIuMjExIDE5NDkuMTQgOTY5LjY0OSAxOTQzLjc5IDk4NS44MDhMMTg3OS40NCAxMTgwLjA4QzE4NzQuMDggMTE5Ni4yNCAxODU2LjY1IDEyMDUgMTg0MC40OSAxMTk5LjY1WiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTE5MDYgMTI0OUMxOTA2IDEyNDUuNjkgMTkwOC42OSAxMjQzIDE5MTIgMTI0M0wxOTM2IDEyNDNDMTkzOS4zMSAxMjQzIDE5NDIgMTI0NS42OSAxOTQyIDEyNDlMMTk0MiAxMjg2QzE5NDIgMTI4OS4zMSAxOTM5LjMxIDEyOTIgMTkzNiAxMjkyTDE5MTIgMTI5MkMxOTA4LjY5IDEyOTIgMTkwNiAxMjg5LjMxIDE5MDYgMTI4NloiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvZz48L3N2Zz4K" x="0" y="0" width="15" height="18" />
                       </pattern>
                        <pattern id="time_${componentId}" x="0" y="0"  width="1" height="1">
                        <image href="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjYwNCIgaGVpZ2h0PSI2NTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHg9IjI1NzkiIHk9Ijc2MCIgd2lkdGg9IjYwNCIgaGVpZ2h0PSI2NTkiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDApIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjU3OSAtNzYwKSI+PHBhdGggZD0iTTI1ODEuNSAxMTMzQzI1ODEuNSA5NzYuNDI3IDI3MDguNjUgODQ5LjUgMjg2NS41IDg0OS41IDMwMjIuMzUgODQ5LjUgMzE0OS41IDk3Ni40MjcgMzE0OS41IDExMzMgMzE0OS41IDEyODkuNTcgMzAyMi4zNSAxNDE2LjUgMjg2NS41IDE0MTYuNSAyNzA4LjY1IDE0MTYuNSAyNTgxLjUgMTI4OS41NyAyNTgxLjUgMTEzM1oiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0LjU4MzMzIiBzdHJva2UtbWl0ZXJsaW1pdD0iOCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTI2MTkuNSAxMTMzQzI2MTkuNSA5OTcuNDE0IDI3MjkuNjQgODg3LjUgMjg2NS41IDg4Ny41IDMwMDEuMzYgODg3LjUgMzExMS41IDk5Ny40MTQgMzExMS41IDExMzMgMzExMS41IDEyNjguNTkgMzAwMS4zNiAxMzc4LjUgMjg2NS41IDEzNzguNSAyNzI5LjY0IDEzNzguNSAyNjE5LjUgMTI2OC41OSAyNjE5LjUgMTEzM1oiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0LjU4MzMzIiBzdHJva2UtbWl0ZXJsaW1pdD0iOCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTI4MjEuOTYgMTE4NS45NUMyODA1LjMzIDExNzUuODIgMjgwMC4wNiAxMTU0LjEyIDI4MTAuMTkgMTEzNy40OUwyOTE4LjA3IDk2MC40MjVDMjkyOC4yIDk0My43OTYgMjk0OS44OSA5MzguNTI5IDI5NjYuNTIgOTQ4LjY1OUwyOTY2LjUyIDk0OC42NTlDMjk4My4xNSA5NTguNzkgMjk4OC40MiA5ODAuNDgyIDI5NzguMjkgOTk3LjExTDI4NzAuNDEgMTE3NC4xOEMyODYwLjI4IDExOTAuODEgMjgzOC41OSAxMTk2LjA4IDI4MjEuOTYgMTE4NS45NVoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0yODE5LjUxIDExNTEuOTRDMjgyNi4zNiAxMTM0Ljc1IDI4NDUuODUgMTEyNi4zNiAyODYzLjA1IDExMzMuMjFMMjk2My41NSAxMTczLjIzQzI5ODAuNzUgMTE4MC4wOCAyOTg5LjE0IDExOTkuNTcgMjk4Mi4yOSAxMjE2Ljc3TDI5ODIuMjkgMTIxNi43N0MyOTc1LjQ0IDEyMzMuOTcgMjk1NS45NSAxMjQyLjM2IDI5MzguNzUgMTIzNS41MUwyODM4LjI1IDExOTUuNDhDMjgyMS4wNSAxMTg4LjYzIDI4MTIuNjYgMTE2OS4xNCAyODE5LjUxIDExNTEuOTRaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMjczNCA3OTVDMjczNCA3NzUuNjcgMjc0OS42NyA3NjAgMjc2OSA3NjBMMjk3NyA3NjBDMjk5Ni4zMyA3NjAgMzAxMiA3NzUuNjcgMzAxMiA3OTVMMzAxMiA3OTVDMzAxMiA4MTQuMzMgMjk5Ni4zMyA4MzAgMjk3NyA4MzBMMjc2OSA4MzBDMjc0OS42NyA4MzAgMjczNCA4MTQuMzMgMjczNCA3OTVaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMjg3My41IDc5NkMyODkyIDc5NiAyOTA3IDgxMC45OTggMjkwNyA4MjkuNUwyOTA3IDg1My41QzI5MDcgODcyLjAwMSAyODkyIDg4NyAyODczLjUgODg3TDI4NzMuNSA4ODdDMjg1NSA4ODcgMjg0MCA4NzIuMDAxIDI4NDAgODUzLjVMMjg0MCA4MjkuNUMyODQwIDgxMC45OTggMjg1NSA3OTYgMjg3My41IDc5NloiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0zMTA0Ljg5IDg4Ni4xOTdDMzExNS4wMyA4NzkuOTIzIDMxMjguMzIgODgzLjA0OSAzMTM0LjYgODkzLjE4TDMxNzkuNjYgOTY1LjkzOEMzMTg1LjkzIDk3Ni4wNjggMzE4Mi44MSA5ODkuMzY3IDMxNzIuNjcgOTk1LjY0MUwzMTcyLjY3IDk5NS42NEMzMTYyLjU0IDEwMDEuOTEgMzE0OS4yNSA5OTguNzg4IDMxNDIuOTcgOTg4LjY1N0wzMDk3LjkxIDkxNS45QzMwOTEuNjQgOTA1Ljc2OSAzMDk0Ljc2IDg5Mi40NyAzMTA0Ljg5IDg4Ni4xOTdaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMzE0Mi44MyA5MzYuODE2QzMxNDkuMzkgOTQ3LjQxNCAzMTQ2LjEyIDk2MS4zMjcgMzEzNS41MiA5NjcuODlMMzEwOS45MSA5ODMuNzQ4QzMwOTkuMzIgOTkwLjMxMiAzMDg1LjQgOTg3LjA0MSAzMDc4Ljg0IDk3Ni40NDNMMzA3OC44NCA5NzYuNDQzQzMwNzIuMjggOTY1Ljg0NSAzMDc1LjU1IDk1MS45MzIgMzA4Ni4xNSA5NDUuMzY5TDMxMTEuNzUgOTI5LjUxMUMzMTIyLjM1IDkyMi45NDcgMzEzNi4yNiA5MjYuMjE4IDMxNDIuODMgOTM2LjgxNloiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvZz48L3N2Zz4K" x="0" y="0" width="15" height="18" />
                        </pattern>
                        <pattern id="always_${componentId}" x="0" y="0" width="1" height="1">
                        <image href="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjU3NCIgaGVpZ2h0PSI1NzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHg9IjE4MTEiIHk9IjE2MTIiIHdpZHRoPSI1NzQiIGhlaWdodD0iNTcyIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4MTEgLTE2MTIpIj48cGF0aCBkPSJNMTgxMy41IDE4OThDMTgxMy41IDE3NDEuNDMgMTk0MC44OCAxNjE0LjUgMjA5OCAxNjE0LjUgMjI1NS4xMiAxNjE0LjUgMjM4Mi41IDE3NDEuNDMgMjM4Mi41IDE4OTggMjM4Mi41IDIwNTQuNTcgMjI1NS4xMiAyMTgxLjUgMjA5OCAyMTgxLjUgMTk0MC44OCAyMTgxLjUgMTgxMy41IDIwNTQuNTcgMTgxMy41IDE4OThaIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNC41ODMzMyIgc3Ryb2tlLW1pdGVybGltaXQ9IjgiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xODUxLjUgMTg5OEMxODUxLjUgMTc2Mi40MSAxOTYxLjY0IDE2NTIuNSAyMDk3LjUgMTY1Mi41IDIyMzMuMzYgMTY1Mi41IDIzNDMuNSAxNzYyLjQxIDIzNDMuNSAxODk4IDIzNDMuNSAyMDMzLjU5IDIyMzMuMzYgMjE0My41IDIwOTcuNSAyMTQzLjUgMTk2MS42NCAyMTQzLjUgMTg1MS41IDIwMzMuNTkgMTg1MS41IDE4OThaIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNC41ODMzMyIgc3Ryb2tlLW1pdGVybGltaXQ9IjgiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xOTAxIDE4OTguNUMxOTAxIDE4NzQuNDggMTkyMC40OCAxODU1IDE5NDQuNSAxODU1TDIxNzYuNSAxODU1QzIyMDAuNTIgMTg1NSAyMjIwIDE4NzQuNDggMjIyMCAxODk4LjVMMjIyMCAxODk4LjVDMjIyMCAxOTIyLjUyIDIyMDAuNTIgMTk0MiAyMTc2LjUgMTk0MkwxOTQ0LjUgMTk0MkMxOTIwLjQ4IDE5NDIgMTkwMSAxOTIyLjUyIDE5MDEgMTg5OC41WiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTIxNDcuOTYgMTc4Ni40QzIxNTkuMjcgMTc3NS44NSAyMTc2Ljk4IDE3NzYuNDYgMjE4Ny41MyAxNzg3Ljc2TDIyNjguNTcgMTg3NC41NkMyMjc5LjEyIDE4ODUuODYgMjI3OC41MSAxOTAzLjU4IDIyNjcuMjEgMTkxNC4xM0wyMjY3LjIxIDE5MTQuMTNDMjI1NS45IDE5MjQuNjggMjIzOC4xOSAxOTI0LjA3IDIyMjcuNjQgMTkxMi43N0wyMTQ2LjYgMTgyNS45N0MyMTM2LjA1IDE4MTQuNjcgMjEzNi42NiAxNzk2Ljk1IDIxNDcuOTYgMTc4Ni40WiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTIxNTMuNDIgMjAwMy45M0MyMTQxLjQxIDE5OTMuNjkgMjEzOS45OCAxOTc1LjY1IDIxNTAuMjIgMTk2My42NEwyMjIxLjQ3IDE4ODAuMTFDMjIzMS43MSAxODY4LjEgMjI0OS43NSAxODY2LjY3IDIyNjEuNzUgMTg3Ni45MUwyMjYxLjc1IDE4NzYuOTFDMjI3My43NiAxODg3LjE1IDIyNzUuMTkgMTkwNS4xOSAyMjY0Ljk1IDE5MTcuMTlMMjE5My43IDIwMDAuNzNDMjE4My40NiAyMDEyLjc0IDIxNjUuNDIgMjAxNC4xNyAyMTUzLjQyIDIwMDMuOTNaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L2c+PC9zdmc+Cg==" x="0" y="0"width="15" height="18" />
                        </pattern>
                        <pattern id="after_${componentId}" x="0" y="0"  width="1" height="1">
                        <image href="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjU3NCIgaGVpZ2h0PSI1NzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHg9IjE4MTEiIHk9IjE2MTIiIHdpZHRoPSI1NzQiIGhlaWdodD0iNTcyIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4MTEgLTE2MTIpIj48cGF0aCBkPSJNMTgxMy41IDE4OThDMTgxMy41IDE3NDEuNDMgMTk0MC44OCAxNjE0LjUgMjA5OCAxNjE0LjUgMjI1NS4xMiAxNjE0LjUgMjM4Mi41IDE3NDEuNDMgMjM4Mi41IDE4OTggMjM4Mi41IDIwNTQuNTcgMjI1NS4xMiAyMTgxLjUgMjA5OCAyMTgxLjUgMTk0MC44OCAyMTgxLjUgMTgxMy41IDIwNTQuNTcgMTgxMy41IDE4OThaIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNC41ODMzMyIgc3Ryb2tlLW1pdGVybGltaXQ9IjgiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xODUxLjUgMTg5OEMxODUxLjUgMTc2Mi40MSAxOTYxLjY0IDE2NTIuNSAyMDk3LjUgMTY1Mi41IDIyMzMuMzYgMTY1Mi41IDIzNDMuNSAxNzYyLjQxIDIzNDMuNSAxODk4IDIzNDMuNSAyMDMzLjU5IDIyMzMuMzYgMjE0My41IDIwOTcuNSAyMTQzLjUgMTk2MS42NCAyMTQzLjUgMTg1MS41IDIwMzMuNTkgMTg1MS41IDE4OThaIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNC41ODMzMyIgc3Ryb2tlLW1pdGVybGltaXQ9IjgiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0xOTAxIDE4OTguNUMxOTAxIDE4NzQuNDggMTkyMC40OCAxODU1IDE5NDQuNSAxODU1TDIxNzYuNSAxODU1QzIyMDAuNTIgMTg1NSAyMjIwIDE4NzQuNDggMjIyMCAxODk4LjVMMjIyMCAxODk4LjVDMjIyMCAxOTIyLjUyIDIyMDAuNTIgMTk0MiAyMTc2LjUgMTk0MkwxOTQ0LjUgMTk0MkMxOTIwLjQ4IDE5NDIgMTkwMSAxOTIyLjUyIDE5MDEgMTg5OC41WiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTIxNDcuOTYgMTc4Ni40QzIxNTkuMjcgMTc3NS44NSAyMTc2Ljk4IDE3NzYuNDYgMjE4Ny41MyAxNzg3Ljc2TDIyNjguNTcgMTg3NC41NkMyMjc5LjEyIDE4ODUuODYgMjI3OC41MSAxOTAzLjU4IDIyNjcuMjEgMTkxNC4xM0wyMjY3LjIxIDE5MTQuMTNDMjI1NS45IDE5MjQuNjggMjIzOC4xOSAxOTI0LjA3IDIyMjcuNjQgMTkxMi43N0wyMTQ2LjYgMTgyNS45N0MyMTM2LjA1IDE4MTQuNjcgMjEzNi42NiAxNzk2Ljk1IDIxNDcuOTYgMTc4Ni40WiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTIxNTMuNDIgMjAwMy45M0MyMTQxLjQxIDE5OTMuNjkgMjEzOS45OCAxOTc1LjY1IDIxNTAuMjIgMTk2My42NEwyMjIxLjQ3IDE4ODAuMTFDMjIzMS43MSAxODY4LjEgMjI0OS43NSAxODY2LjY3IDIyNjEuNzUgMTg3Ni45MUwyMjYxLjc1IDE4NzYuOTFDMjI3My43NiAxODg3LjE1IDIyNzUuMTkgMTkwNS4xOSAyMjY0Ljk1IDE5MTcuMTlMMjE5My43IDIwMDAuNzNDMjE4My40NiAyMDEyLjc0IDIxNjUuNDIgMjAxNC4xNyAyMTUzLjQyIDIwMDMuOTNaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L2c+PC9zdmc+Cg==" x="0" y="0" width="15" height="18" />
                        </pattern>
                        <pattern id="initial-state_${componentId}" x="0" y="0"  width="1" height="1">
                        <image href="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjU3MyIgaGVpZ2h0PSI1NzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHg9IjI0NjMiIHk9IjEzNzAiIHdpZHRoPSI1NzMiIGhlaWdodD0iNTcyIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI0NjMgLTEzNzApIj48cGF0aCBkPSJNMjQ2NS41IDE2NTZDMjQ2NS41IDE0OTkuNDMgMjU5Mi42NSAxMzcyLjUgMjc0OS41IDEzNzIuNSAyOTA2LjM1IDEzNzIuNSAzMDMzLjUgMTQ5OS40MyAzMDMzLjUgMTY1NiAzMDMzLjUgMTgxMi41NyAyOTA2LjM1IDE5MzkuNSAyNzQ5LjUgMTkzOS41IDI1OTIuNjUgMTkzOS41IDI0NjUuNSAxODEyLjU3IDI0NjUuNSAxNjU2WiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjQuNTgzMzMiIHN0cm9rZS1taXRlcmxpbWl0PSI4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMjUwMy41IDE2NTZDMjUwMy41IDE1MjAuNDEgMjYxMy42NCAxNDEwLjUgMjc0OS41IDE0MTAuNSAyODg1LjM2IDE0MTAuNSAyOTk1LjUgMTUyMC40MSAyOTk1LjUgMTY1NiAyOTk1LjUgMTc5MS41OSAyODg1LjM2IDE5MDEuNSAyNzQ5LjUgMTkwMS41IDI2MTMuNjQgMTkwMS41IDI1MDMuNSAxNzkxLjU5IDI1MDMuNSAxNjU2WiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjQuNTgzMzMiIHN0cm9rZS1taXRlcmxpbWl0PSI4IiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L2c+PC9zdmc+Cg==" x="0" y="0" width="20" height="20" />
                        </pattern>
                        <pattern id="final-state_${componentId}" x="0" y="0"  width="1" height="1">
                        <image href="data:image/svg+xml;base64,Cgo8c3ZnIHdpZHRoPSI1NzMiIGhlaWdodD0iNTcyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBvdmVyZmxvdz0iaGlkZGVuIj48ZGVmcz48Y2xpcFBhdGggaWQ9ImNsaXAwIj48cmVjdCB4PSIzMzk0IiB5PSIxMzYyIiB3aWR0aD0iNTczIiBoZWlnaHQ9IjU3MiIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMzk0IC0xMzYyKSI+PHBhdGggZD0iTTMzOTYuNSAxNjQ4QzMzOTYuNSAxNDkxLjQzIDM1MjMuNjUgMTM2NC41IDM2ODAuNSAxMzY0LjUgMzgzNy4zNSAxMzY0LjUgMzk2NC41IDE0OTEuNDMgMzk2NC41IDE2NDggMzk2NC41IDE4MDQuNTcgMzgzNy4zNSAxOTMxLjUgMzY4MC41IDE5MzEuNSAzNTIzLjY1IDE5MzEuNSAzMzk2LjUgMTgwNC41NyAzMzk2LjUgMTY0OFoiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0LjU4MzMzIiBzdHJva2UtbWl0ZXJsaW1pdD0iOCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTM0MzQuNSAxNjUxQzM0MzQuNSAxNTE1LjQxIDM1NDQuNjQgMTQwNS41IDM2ODAuNSAxNDA1LjUgMzgxNi4zNiAxNDA1LjUgMzkyNi41IDE1MTUuNDEgMzkyNi41IDE2NTEgMzkyNi41IDE3ODYuNTkgMzgxNi4zNiAxODk2LjUgMzY4MC41IDE4OTYuNSAzNTQ0LjY0IDE4OTYuNSAzNDM0LjUgMTc4Ni41OSAzNDM0LjUgMTY1MVoiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI0LjU4MzMzIiBzdHJva2UtbWl0ZXJsaW1pdD0iOCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9nPjwvc3ZnPg==" x="0" y="0" width="20" height="20" />
                        </pattern>
                        <pattern id="creation-failed_${componentId}" x="0" y="0"  width="1" height="1">
                        <image href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iYyIgZGF0YS1uYW1lPSJpdDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSI4LjgzIiB5MT0iMy41OCIgeDI9IjIzLjE3IiB5Mj0iMjguNDIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmMzZjA1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2MxMGUwMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggZD0iTTI4LjkyLDkuODZjLjM4LjM5LjU4Ljg0LjU4LDEuMzV2OS41OWMwLC41MS0uMTkuOTYtLjU4LDEuMzVsLTYuNzgsNi43OGMtLjM4LjM5LS44My41OC0xLjM1LjU4aC05LjU5Yy0uNTEsMC0uOTYtLjE5LTEuMzUtLjU4bC02Ljc4LTYuNzhjLS4zOC0uMzktLjU4LS44NC0uNTgtMS4zNXYtOS41OWMwLS41MS4xOS0uOTYuNTgtMS4zNWw2Ljc4LTYuNzhjLjM4LS4zOS44My0uNTgsMS4zNS0uNThoOS41OWMuNTEsMCwuOTYuMTksMS4zNS41OGw2Ljc4LDYuNzhaIiBmaWxsPSJ1cmwoI2EpIiBzdHJva2U9IiM4MzEzMDAiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cG9seWdvbiBwb2ludHM9IjI0IDIwLjUgMTkuNSAxNiAyNCAxMS41IDIwLjUgOCAxNiAxMi41IDExLjUgOCA4IDExLjUgMTIuNSAxNiA4IDIwLjUgMTEuNSAyNCAxNiAxOS41IDIwLjUgMjQgMjQgMjAuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+Cjwvc3ZnPg==" x="0" y="0" width="24" height="24" />
                        </pattern>
                        <pattern id="sync-ongoing_${componentId}" x="0" y="0"  width="1" height="1">
                        <image href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iZSIgZGF0YS1uYW1lPSJpdDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIxNCIgeTE9IjE1IiB4Mj0iMTgiIHkyPSIxNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0NjQ2NDYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTQxNDE0Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iNS45OCIgeTE9IjkuMDUiIHgyPSIyMC4wMSIgeTI9IjMzLjM0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZiZTg2YSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMWNmMmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHkxPSIyNCIgeTI9IjI0IiB4bGluazpocmVmPSIjYSIvPgogIDwvZGVmcz4KICA8cGF0aCBkPSJNMjkuNSwyNi45NGMwLC40MS0uMTQuNzctLjQzLDEuMDgtLjI5LjMyLS42NC40OC0xLjA2LjQ4SDMuOTljLS40NCwwLS44LS4xNi0xLjA3LS40OHMtLjQxLS42OC0uNDEtMS4wOGMwLS4yNy4wNi0uNTMuMTktLjc4TDE0LjcxLDQuMjhjLjI5LS41Mi43My0uNzgsMS4yOS0uNzhzMSwuMjYsMS4yOS43OGwxMi4wMSwyMS44OGMuMTMuMjUuMTkuNTEuMTkuNzhaIiBmaWxsPSJ1cmwoI2MpIiBzdHJva2U9IiM5NjMyMDAiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNMTcuNzEsMjBsLjI5LTguNTNjLS4wMi0uNDEtLjE2LS43Ni0uNDMtMS4wNC0uMjctLjI4LS42LS40My0xLS40M2gtMS4xNGMtLjM4LDAtLjcxLjE0LS45OC40MS0uMjguMjgtLjQyLjYzLS40NCwxLjA2bC4yOSw4LjUzaDMuNDNaIiBmaWxsPSJ1cmwoI2EpIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjIyIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiByeD0iMSIgcnk9IjEiIGZpbGw9InVybCgjZikiLz4KPC9zdmc+" x="0" y="0" width="24" height="24" />
                        </pattern>
                        <pattern id="waiting_${componentId}" x="0" y="0"  width="1" height="1">
                        <image href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHg9IjE3NiIgeT0iMjQwIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iY2xpcDEiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIzMDQ4MDAiIGhlaWdodD0iMzA0ODAwIi8+PC9jbGlwUGF0aD48aW1hZ2Ugd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNBQUFBQWdDQU1BQUFCRXBJckdBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFHU1VFeFVSUUFBQURBd01FQkFRQ2dvS0RnNE9FQkFRQ1VsSlRBd01EVTFOVG82T2tCQVFFVkZSVEF3TURRME5FQkFRRVJFUkVoSVNDWW1Kak16TXprNU9UQXdNREF3TUQwOVBVbEpTU1FrSkM0dUxqSXlNalEwTkRnNE9EdzhQRUJBUUVSRVJFWkdSaWtwS1MwdExUQXdNRFEwTkRVMU5TZ29LQzh2THpNek16YzNOem82T2pzN096OC9QME5EUXlJaUlpOHZMems1T1VWRlJTQWdJQzR1TGprNU9TY25KeWtwS1M0dUxpOHZMekV4TVRNek16VTFOVGMzTnprNU9UbzZPanM3TzBCQVFFTkRRMGRIUnhzYkd5c3JLeTB0TFRFeE1USXlNak16TXpVMU5UYzNOenc4UEUxTlRSZ1lHQmtaR1JvYUdoc2JHeHdjSEIwZEhSNGVIaDhmSHlBZ0lDRWhJU0lpSWlNakl5UWtKQ1VsSlNZbUppY25KeWdvS0NrcEtTb3FLaXNyS3l3c0xDMHRMUzR1TGk4dkx6QXdNREV4TVRJeU1qTXpNelEwTkRVMU5UWTJOamMzTnpnNE9EazVPVG82T2pzN096dzhQRDA5UFQ0K1BqOC9QMEJBUUVGQlFVSkNRa05EUTBSRVJFVkZSVVpHUmtkSFIwaElTRWxKU1VwS1NrdExTMHhNVEUxTlRVNU9UazlQVDFCUVVEekNYYzBBQUFCTmRGSk9Vd0FRRUNBZ0lEQXdNREF3TUVCQVFFQkFVRkJRWUhCd2NJQ0FnSUNBZ0lDQWdJK1BqNCtQbjUrZm41K2ZuNSt2cjcrL3o4L1AzOS9mMzkvZjM5L2YzOS9mMzkvdjcrL3Y3Ky92NysvdkFXeE1Sd0FBQUFsd1NGbHpBQUFPd3dBQURzTUJ4MitvWkFBQUFXWkpSRUZVT0UrOWptVlhBa0VVUUhleEM3RVRGYnU3Q3hzTEZRUUJhUUVwa1JTUUVnVC90ek03anpNc2g2OTZ2OHc5Ny9MZXd2d1hQNFY4L2p1WC9jcWtVOGxrNGpNZWkzNUV3bUdJbUFKazFMbU1leWdJRVhPYnk1SjFuTG4xVURBZ2hRaGswajBpVVN0R0tCUjI4OVlKSjZrUk1JUTRjQWhHV1Vrc2dDRm0vY3RnbE9INE1Saml3RGNJUm1tS1JSdEJtWVkzYnoxb0NVZVJlVEJteHJzSFZzcFFPRlJEck5yakhpREdRM0FUbkNNMjdiNWtpZkVSKzk4NzhOdnVjdlp6ZzNJRTY3NXI5TEF5NTA3RkF3eTc3NzNDejRWanUvSVBKanllRnZ3MjIyMmozS0FNK3QvN3JKWXFZanpHWFRLNHpKNlpKY1I0N0RySHdCaUpjUU9zaExwWFIrZlUxb3ZWWXQ2Y2JEUG9hMkZNNlhMWWJUaWJURWFEL2xuWEMyUEtFc3E0YzFtblhZUXhaWTFiUnhsMXJlWnBGY1lVZWgxbHRWb0ZZK0FjWmJpdTFhQ3VlbFFxRktjUU1jV1BrM1dVbFlxSCt6dUlHSnlMMTFWNEhXVzVIT0lmd3pDL3JzZHF4RitZRGZvQUFBQUFTVVZPUks1Q1lJST0iIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIGlkPSJpbWcyIj48L2ltYWdlPjxjbGlwUGF0aCBpZD0iY2xpcDMiPjxyZWN0IHg9IjAiIHk9Ii0wLjI1IiB3aWR0aD0iMzA0ODAwIiBoZWlnaHQ9IjMwNDgwMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzYgLTI0MCkiPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMSkiIHRyYW5zZm9ybT0ibWF0cml4KDAuMDAwMTA0OTg3IDAgMCAwLjAwMDEwNDk4NyAxNzYgMjQwKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAzKSI+PHVzZSB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bGluazpocmVmPSIjaW1nMiIgdHJhbnNmb3JtPSJtYXRyaXgoOTUyNSAwIDAgOTUyNSAwIC0wLjI1KSI+PC91c2U+PC9nPjwvZz48L2c+PC9zdmc+" x="0" y="0" width="28" height="28" />
                        </pattern>
                        <marker
                        id="grey_arrowHead_${componentId}"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        fill="var(--darkgrey)"
                        orient="auto-start-reverse" >
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                        <marker
                        id="red_arrowHead_${componentId}"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        fill="var(--darkred)"
                        orient="auto-start-reverse" >
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                        <marker
                        id="yellow_arrowHead_${componentId}"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        fill="var(--darkyellow)"
                        orient="auto-start-reverse" >
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                        <marker
                        id="green_arrowHead_${componentId}"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        fill="var(--darkgreen)"
                        orient="auto-start-reverse" >
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                        <marker
                        id="blue_arrowHead_${componentId}"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        fill="var(--darkblue)"
                        orient="auto-start-reverse" >
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                        <marker
                        id="highlightedarrowHead_${componentId}"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        fill="var(--ds-blue)"
                        orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                       
                        
                    </defs>
                    <g class="grid-layer" id="grid-layer_${componentId}" transform="translate(${transformVector[0]} ${transformVector[1]}) scale(${transformVector[2]})">
                        <rect class="grid" width=${svgWidth} height=${svgHeight}  x=${svgStaticPos.x} y=${svgStaticPos.y} fill="url('#grid-pattern_${componentId}')" pointerEvents="none">
                        </rect>
                    </g>
                    <g class="content-layer" id="grid-content-layer_${componentId}"transform="translate(${transformVector[0]} ${transformVector[1]}) scale(${transformVector[2]})" >
                        <g class="ghosts-layer" id="ghosts-layer_${componentId}" opacity="0.3" ></g>
                        <g class="graphElts-layer" id="graphElts-layer_${componentId}" ></g>
                        <g id="arcsGroup_${componentId}"></g>
                        <g class="preview-layer" id="preview-layer_${componentId}" opacity="0.4" ></g>
                        <g class="tools-graphElts-layer" id="tools-graphElts-layer_${componentId}" ></g>
                    </g>

                </svg>
            </div>
    `;
    };
    exports.getGridSVGTemplate = getGridSVGTemplate;
    const getInitialMarkerTemplate = (componentId, id, status, isSelected, isDragged, color) => {
        return `
    <g style="pointer-events:${status === 'ready-to-use' && !isDragged ? 'all' : 'none'}">
    <circle id=${"bodyNode_" + id} class=${isSelected ? "isSelected" : "notSelected"} filter="url(#shadow_${componentId})"  cx=${StaticAttributes_2.gridStep} cy=${StaticAttributes_2.gridStep}  r=${StaticAttributes_2.gridStep - 2.5} stroke-width=${(isDragged) ? 1.5 : 0.8} stroke=${(isDragged) ? "var(--ds-blue)" : "var(--COLOR_COPY_GRAY)"} fill=var(--${color})  opacity="1"></circle>
    <rect  class="outline" id=${"outlineNode_" + id} x=${-2} y=${-2} width=${2 * StaticAttributes_2.gridStep + 4} height=${2 * StaticAttributes_2.gridStep + 4} rx=${6} stroke=${(isSelected && !isDragged) ? "var(--ds-blue)" : "transparent"} stroke-width="2" fill="none" ></rect>
    <rect x=${-StaticAttributes_2.gridStep / 4} y=${-StaticAttributes_2.gridStep / 4} class="wings" id=${"wings_" + id} height=${2 * StaticAttributes_2.gridStep + StaticAttributes_2.gridStep / 2} width=${2 * StaticAttributes_2.gridStep + StaticAttributes_2.gridStep / 2}  fill="none" stroke-width=${StaticAttributes_2.gridStep / 2}  style="pointer-events: stroke;"  ></rect>
    </g>    
    `;
    };
    const getChoiceMarkerTemplate = (componentId, id, status, isSelected, isDragged, color) => {
        return `
    <g style="pointer-events:${status === 'ready-to-use' && !isDragged ? 'all' : 'none'}">
    <rect id=${"bodyNode_" + id} class=${isSelected ? "isSelected" : "notSelected"} filter="url(#shadow_${componentId})" x="8" y="8" width=${2 * StaticAttributes_2.gridStep - 16} height=${2 * StaticAttributes_2.gridStep - 16} rx="2.5" stroke-width="1.5" stroke=${(isDragged) ? "var(--ds-blue)" : "var(--COLOR_COPY_GRAY)"} fill=var(--${color})  transform="rotate(-45 ${StaticAttributes_2.gridStep} ${StaticAttributes_2.gridStep})" ></rect>
    <rect  class="outline" id=${"outlineNode_" + id} x=${-2} y=${-2} width=${2 * StaticAttributes_2.gridStep + 4} height=${2 * StaticAttributes_2.gridStep + 4} rx=${6} stroke=${(isSelected && !isDragged) ? "var(--ds-blue)" : "transparent"} stroke-width="2" fill="none" ></rect>
    <rect x=${-StaticAttributes_2.gridStep / 4} y=${-StaticAttributes_2.gridStep / 4} class="wings" id=${"wings_" + id} height=${2 * StaticAttributes_2.gridStep + StaticAttributes_2.gridStep / 2} width=${2 * StaticAttributes_2.gridStep + StaticAttributes_2.gridStep / 2}  fill="none" stroke-width=${StaticAttributes_2.gridStep / 2}  style="pointer-events: stroke;"  ></rect>
    </g>
    `;
    };
    const getFinalMarkerTemplate = (componentId, id, status, isSelected, isDragged, color) => {
        // const htmlTemplate = `
        //     	<p data-value="model-property-name" class="my-first-node-view-label">name</p>
        // `.split(/<script(.*?)>(.*?)<\/script>/).join('');
        // // .replace(/<script(.*?)>(.*?)<\/script>/,'');
        // // for parameters use: dataAttributes <p data-value="model-property-name">content based on my attribute name value</p>
        // console.log(htmlTemplate)
        // return `
        //     <foreignObject id=${"bodyNode_" + id}  x=${-gridStep / 4} y=${-gridStep / 4} height=${2 * gridStep + gridStep / 2} width=${2 * gridStep + gridStep / 2}  >
        //         ${htmlTemplate}
        //     </foreignObject>
        // `;
        return `
    <g style="pointer-events:${status === 'ready-to-use' && !isDragged ? 'all' : 'none'}">
        <circle id=${"bodyNode_" + id} class=${isSelected ? "isSelected" : "notSelected"} filter="url(#shadow_${componentId})" cx=${StaticAttributes_2.gridStep} cy=${StaticAttributes_2.gridStep}  r=${StaticAttributes_2.gridStep - 2.5} stroke-width=${(isDragged) ? 1.5 : 0.8} stroke=${isDragged ? "var(--ds-blue)" : "var(--COLOR_COPY_GRAY)"} fill=var(--${color})  opacity="1"></circle>
        <circle id=${"innerNode_" + id} class=${isSelected ? "isSelected" : "notSelected"} cx=${StaticAttributes_2.gridStep} cy=${StaticAttributes_2.gridStep} r=${2 * StaticAttributes_2.gridStep / 3 - 5} fill=${isDragged ? "var(--ds-blue)" : "var(--COLOR_COPY_GRAY)"} opacity="1"></circle>
        <rect  class="outline" id=${"outlineNode_" + id} x=${-2} y=${-2} width=${2 * StaticAttributes_2.gridStep + 4} height=${2 * StaticAttributes_2.gridStep + 4} rx=${6} stroke=${(isSelected && !isDragged) ? "var(--ds-blue)" : "transparent"} stroke-width="2" fill="none" ></rect>
        <rect x=${-StaticAttributes_2.gridStep / 4} y=${-StaticAttributes_2.gridStep / 4} class="wings" id=${"wings_" + id} height=${2 * StaticAttributes_2.gridStep + StaticAttributes_2.gridStep / 2} width=${2 * StaticAttributes_2.gridStep + StaticAttributes_2.gridStep / 2}  fill="none" stroke-width=${StaticAttributes_2.gridStep / 2}  style="pointer-events: stroke;"  ></rect>
    </g>
    `;
    };
    const getDetachedLabelTemplate = (componentId, id, label, editMode, isSelected, isDragged, width, height, labelLeftOffset, labelTopOffset) => {
        return `
    <g class="graphEltDetails">
    <line id=${"anchorDragabbleLabel_" + id} class="anchorLink" x1=${StaticAttributes_2.gridStep} y1=${2 * StaticAttributes_2.gridStep} x2=${labelLeftOffset + width / 2} y2=${labelTopOffset + height + 2 * StaticAttributes_2.gridStep} stroke-dasharray="4" stroke="${(label && isSelected) ? "var(--COLOR_COPY_GRAY)" : "transparent"}" visibility="${label && !isDragged ? "visible" : "hidden"}"/>
    <rect id=${"backgroundDragabbleLabel_" + id} class="backgroundDragabbleLabel" x=${labelLeftOffset} y=${labelTopOffset + 2 * StaticAttributes_2.gridStep} width=${(label || editMode) ? width : 0} height=${(label || editMode) ? height : 0}  stroke-dasharray="4" stroke="${(label && isSelected) ? "var(--COLOR_COPY_GRAY)" : "transparent"}" fill="white"  visibility="${(label || editMode) && !isDragged ? "visible" : "hidden"}" style="pointer-events: ${!editMode ? "all" : "none"}" ></rect>
    <rect id=${"resizeAnchor_" + id} class="resizableAnchor" x=${width + labelLeftOffset - 10} y=${2 * StaticAttributes_2.gridStep + labelTopOffset + height - 10} width=${25} height=${25} rx="2.5" fill="${(label && isSelected) ? `url(#resize_${componentId})` : "transparent"}" visibility="${(label) && !isDragged ? "visible" : "hidden"}"></rect>
    <foreignObject x=${labelLeftOffset} y=${labelTopOffset + 2 * StaticAttributes_2.gridStep} width=${width} height=${height} style="pointer-events:none;overflow:${editMode ? "visible" : "hidden"}" >
    <editable-input id=${"input_" + id} visibility=${((editMode || label) && !isDragged) ? "visible" : "hidden"} editmode=${editMode} label="${label}"></editable-input>
    </foreignObject>
    </g>
    `;
    };
    const getNodeBodyTemplate = (componentId, id, status, label, editMode, isSelected, position, isDragged, width, height, color, data, isOverlapping = false) => {
        const { title, body, icon, badges } = data;
        // width and height definition
        const iconWidth = icon ? StaticAttributes_2.gridStep : 0;
        const headerHeight = body ? 2 * StaticAttributes_2.gridStep : height;
        if (isOverlapping)
            return `
    <g style="pointer-events:${status === 'ready-to-use' && !isDragged ? 'all' : 'none'}">
        <rect id=${"bodyNode_" + id} class=${isSelected ? "isSelected" : "notSelected"} x=${5} y=${5} filter="url(#shadow_${componentId})" width=${width} height=${height}  rx="2.5" stroke-width=${(isDragged) ? 1.5 : 0.8} stroke=${(isDragged) ? "var(--ds-blue)" : "var(--COLOR_COPY_GRAY)"} fill=var(--${color}) opacity="0.6"></rect>
        <rect class="outline" id=${"outlineNode_" + id} x=${-5} y=${-5} width=${width + 10} height=${height + 10} rx=${5} stroke=${(isSelected && !isDragged) ? "var(--ds-blue)" : "transparent"} stroke-width="2" fill="none"  ></rect>
        <title>${(0, TextComputations_1.encodeTextInput)(label)}</title>
        <foreignObject  x="5" y="5" width=${width - 2} height=${height - 2} ><div class="lightglassLayer" ></div></foreignObject>
        <foreignObject x=${iconWidth + 5} y="5" width=${width - 2 * iconWidth} height=${headerHeight} style="overflow:${editMode ? "visible" : "hidden"};position:relative">
        <editable-input id=${"input_" + id} visibility="visible" editmode=${editMode} label="${label}"></editable-input>
        </foreignObject>
        ${icon ? `<image xlink:href=${icon} id=${"input_" + id} x="5" y=${headerHeight / 2 - 16} height=${iconWidth}px width=${iconWidth}px  />` : ''}
        ${body ? `<line x1="0" y1=${headerHeight} x2=${width} y2=${headerHeight} stroke=var(--lightgrey) stroke-dasharray="4"/>` : ""}
        ${body ? `
        <foreignObject x="0" y=${headerHeight} width=${width} height=${Math.abs(height - headerHeight)} style="overflow:hidden;position:relative;color:grey">
        <div id=${"input_" + id} style="color:var(--darkgrey);padding:5px;width:100%;height:100%">
        ${JSON.stringify(body)}
        </div>
        </foreignObject>
        ` : ""}
    </g>
    `;
        return `
     <g style="pointer-events:${status === 'ready-to-use' && !isDragged ? 'all' : 'none'}">
        <rect id=${"bodyNode_" + id} class=${isSelected ? "isSelected" : "notSelected"} x="0" y="0" filter="url(#shadow_${componentId})"  width=${width} height=${height} rx="2.5" stroke-width=${(isDragged) ? 1.5 : 0.8} stroke=${(isDragged) ? "var(--ds-blue)" : "var(--COLOR_COPY_GRAY)"} fill=var(--${color}) opacity="1"></rect>
        <rect class="outline" id=${"outlineNode_" + id} x=${-5} y=${-5} width=${width + 10} height=${height + 10} rx=${5} stroke=${(isSelected && !isDragged) ? "var(--ds-blue)" : "transparent"} stroke-width="2" fill="none"></rect>
        <title>${(0, TextComputations_1.encodeTextInput)(label)}</title>
        <foreignObject x=${iconWidth} y="0" width=${width - 2 * iconWidth} height=${headerHeight} style="overflow:${editMode ? "visible" : "hidden"};position:relative;">
        <editable-input id=${"input_" + id} visibility="visible" editmode=${editMode} label="${label}"></editable-input>
        </foreignObject>
        ${icon ? `<image xlink:href=${icon} id=${"input_" + id} x="5" y=${headerHeight / 2 - 16} height=${iconWidth}px width=${iconWidth}px  />` : ''}
        ${body ? `<line x1="0" y1=${headerHeight} x2=${width} y2=${headerHeight} stroke=var(--lightgrey) stroke-dasharray="4"/>` : ""}
        ${body ? `
        <foreignObject x="0" y=${headerHeight} width=${width} height=${Math.abs(height - headerHeight)} style="overflow:hidden;position:relative;color:grey;">
        <div id=${"input_" + id} style="color:var(--darkgrey);padding:5px;width:100%;height:100%">
        ${JSON.stringify(body)}
        </div>
        </foreignObject>
            ` : ""}
     </g>
        `;
    };
    const getGroupNodeBodyTemplate = (componentId, id, status, label, editMode, isSelected, isDragged, width, height, color, data) => {
        const { title, body, icon, badges } = data;
        // width and height definition
        const headerHeight = 2 * StaticAttributes_2.gridStep;
        const iconWidth = icon && width > StaticAttributes_2.gridStep ? StaticAttributes_2.gridStep : 0;
        const bodyHeight = body && height > 4 * StaticAttributes_2.gridStep ? 2 * StaticAttributes_2.gridStep : 0;
        return `
        <g style="pointer-events:${status === 'ready-to-use' && !isDragged ? 'all' : 'none'}">
        <foreignObject  x="0" y=${headerHeight + bodyHeight} width=${width} height=${Math.abs(height - headerHeight - bodyHeight)}><div   class="glassLayer"></div></foreignObject>
        <rect id=${"bodyGroupNode_" + id} class=${isSelected ? "isSelected" : "notSelected"} x="0" y=${0} width=${width - 1} height=${height} rx="2.5" stroke-width="1.5" stroke=${(isDragged) ? "var(--ds-blue)" : "var(--COLOR_COPY_GRAY)"} fill="url('#grid-pattern_${componentId}')" fill-opacity="0.1"  ></rect>
        <rect id=${"headerNode_" + id} class="header" width=${width - 2} filter="url(#shadow_${componentId})" height=${2 * StaticAttributes_2.gridStep} rx="2.5" x="0.5" y="0.5"  fill=var(--${color}) ></rect>
        <rect  class="outline" id=${"outlineNode_" + id} x=${-5} y=${-5} width=${width + 10} height=${height + 10} rx=${6} stroke=${(isSelected && !isDragged) ? "var(--ds-blue)" : "transparent"} stroke-width="2" fill="none" style="pointer-events: none;"></rect>
        <title>${(0, TextComputations_1.encodeTextInput)(label)}</title> 
        <foreignObject x=${iconWidth} y="0" width=${Math.abs(width - 2 - 2 * iconWidth)} height=${headerHeight} style="position:relative">
        <editable-input id=${"input_" + id} visibility="visible" editmode=${editMode} label="${label}"></editable-input>
        </foreignObject>
        ${icon ? `<image xlink:href=${icon} id=${"input_" + id} x="5" y=${headerHeight / 2 - 16} height=${iconWidth}px width=${iconWidth}px  />` : ''}
        ${body ? `<line x1="0" y1=${headerHeight} x2=${width} y2=${headerHeight} stroke=var(--lightgrey) stroke-dasharray="4"/>` : ""}
        ${body ? `
        <foreignObject x="0" y=${headerHeight} width=${width} height=${bodyHeight} style="overflow:hidden;position:relative;color:grey">
        <div id=${"input_" + id} style="color:var(--darkgrey);padding:5px;width:100%;height:100%">
        ${JSON.stringify(body)}
        </div>
        </foreignObject>
            ` : ""}
        </g>
        `;
    };
    const getNodeDetailsTemplate = (componentId, id, isSelected, width, height) => {
        const resizeAnchorTriggerZone = StaticAttributes_2.isMobileDevice ? 2 * StaticAttributes_2.gridStep : StaticAttributes_2.gridStep;
        return `
             <g class="graphEltDetails">
            <rect x=${-StaticAttributes_2.gridStep / 4} y=${-StaticAttributes_2.gridStep / 4} class="wings" id=${"wings_" + id} height=${height + StaticAttributes_2.gridStep / 2} width=${width + StaticAttributes_2.gridStep / 2}   fill="none" stroke-width=${StaticAttributes_2.gridStep / 2}  style="pointer-events: stroke;"  ></rect>
            <rect id=${"resizeAnchor_" + id} class="resizableAnchor" x=${width - 10} y=${height - 10} width=${resizeAnchorTriggerZone} height=${resizeAnchorTriggerZone} rx="2.5" fill="url(#resize_${componentId})" visibility="${isSelected ? "visible" : "hidden"}"></rect>
            </g>
        `;
    };
    const getLinkTriggerZoneTemplate = (id, status, wayPoints) => {
        const pathTriggerZoneWidth = StaticAttributes_2.isMobileDevice ? StaticAttributes_2.gridStep : StaticAttributes_2.gridStep / 2;
        let triggerZoneTemplate = ``;
        wayPoints.map((point, index) => {
            if (index !== wayPoints.length - 1) {
                let bd = { x: 0, y: 0, w: 0, h: 0 };
                let [offsetx, offsety] = (index === wayPoints.length - 2) ? [Math.sign(point.x - wayPoints[index + 1].x) * pathTriggerZoneWidth, Math.sign(point.y - wayPoints[index + 1].y) * pathTriggerZoneWidth] : [0, 0];
                if (point.y === wayPoints[index + 1].y)
                    bd = (0, GeometricalComputation_1.computeBoundingBoxBetweenTwoPoints)({ "x": point.x, "y": point.y - pathTriggerZoneWidth }, { "x": wayPoints[index + 1].x + offsetx, "y": wayPoints[index + 1].y + pathTriggerZoneWidth });
                else
                    bd = (0, GeometricalComputation_1.computeBoundingBoxBetweenTwoPoints)({ "x": point.x - pathTriggerZoneWidth, "y": point.y }, { "x": wayPoints[index + 1].x + pathTriggerZoneWidth, "y": wayPoints[index + 1].y + offsety });
                triggerZoneTemplate += `
        <rect class="segmentOutline" id=${"segmentOutline_" + id + "_" + index} x=${bd.x} y=${bd.y} width=${bd.w} height=${bd.h} rx=${5} stroke="transparent" fill="transparent" style="pointer-events:${status === 'ready-to-use' ? 'all' : 'none'}" ></rect>
        `;
            }
        });
        return triggerZoneTemplate;
    };
    const getLinkControlPointsTemplate = (id, wayPoints, controlPointRadius, color) => {
        return `
    <g class="controlPointsGroup" id=${"controlPoints_" + id}>
    <circle class="controlPoints" id=${`midPoint_${id}_${0}`}  cx=${wayPoints[0].x} cy=${wayPoints[0].y} r=${controlPointRadius} stroke="white" stroke-width="2" fill="var(--ds-blue)" />
    <circle class="controlPoints" id=${`midPoint_${id}_${wayPoints.length - 1}`}  cx=${wayPoints[wayPoints.length - 1].x} cy=${wayPoints[wayPoints.length - 1].y} r=${controlPointRadius} stroke="white" stroke-width="2" fill="var(--ds-blue)" />
    </g>
    `;
    };
    const getLinkPathTemplate = (componentId, id, wayPoints, isSelected, isDragged, color) => {
        // geometrical attributes
        const pathData = (0, LinksMovementsUtils_1.generatePathdata)(wayPoints);
        return `
     <path
        class="pathWidthArrow"
        id=${"pathFlow_" + id}
        d="${pathData}"
        stroke=${isDragged || isSelected ? "var(--ds-blue)" : `var(--dark${color})`}
        opacity=${1}
        stroke-width=${2.5}
        viewBox="0 0 100 100"
        fill="none"
        marker-end=${isDragged || isSelected ? `url(#highlightedarrowHead_${componentId})` : `url(#${color}_arrowHead_${componentId})`}
        ></path>
    `;
    };
    const getLinkDetachedLabelTemplate = (componentId, id, label, width, height, labelLeftOffset, labelTopOffset, editMode, wayPoints, isSelected, isDragged) => {
        const midPathPoint = (0, LinksMovementsUtils_1.getMidPathPoint)(wayPoints);
        // width = width;
        // height = Math.max(gridStep, height);
        return `
    <g id=${"DragabbleLabelWrapperGroup_" + id} class="graphEltDetails" transform=translate(${midPathPoint.x},${midPathPoint.y})>
    <line id=${"anchorDragabbleLabel_" + id} class="anchorLink" x1=${0} y1=${0} x2=${labelLeftOffset} y2=${labelTopOffset} stroke-dasharray="4" stroke="${(label && isSelected) ? "var(--COLOR_COPY_GRAY)" : "transparent"}" visibility="${(((label.length > 0 && !isDragged) || editMode)) ? "visible" : "hidden"}"/>
    <rect id=${"backgroundDragabbleLabel_" + id} class="backgroundDragabbleLabel" x=${labelLeftOffset - width / 2} y=${labelTopOffset - height / 2} width=${(label || editMode) ? width : 0} height=${(label || editMode) ? height : 0}  stroke-dasharray="4" stroke="${(label && isSelected) ? "var(--COLOR_COPY_GRAY)" : "transparent"}" fill=${(((label.length > 0 && !isDragged) || editMode)) ? "white" : "transparent"} visibility="${(((label.length > 0 && !isDragged) || editMode)) ? "visible" : "hidden"}" ></rect>
    <rect id=${"resizeAnchor_" + id} class="resizableAnchor" x=${labelLeftOffset + width / 2 - 10} y=${labelTopOffset + height / 2 - 10} width=${25} height=${25}  fill="${(label && isSelected) ? `url(#resize_${componentId})` : "transparent"}" visibility="${((label.length > 0 && !isDragged) || editMode) ? "visible" : "hidden"}" opacity="1"></rect>
    <foreignObject x=${labelLeftOffset - width / 2} y=${labelTopOffset - height / 2} width=${width} height=${height}  style="pointer-events: none;overflow:${editMode ? "visible" : "hidden"}"
     >
    <editable-input id=${"input_" + id} visibility=${((label.length > 0 && !isDragged) || editMode) ? "visible" : "hidden"} editmode=${editMode} label="${label}" ></editable-input>
    </foreignObject>
    </g>
    `;
    };
    const createGraphNode = (componentId, id, status, type, label, editMode, x_position, y_position, isSelected, isDragged, width, height, color, labelLeftOffset, labelTopOffset, data, renderDetailsGuard) => {
        const nodeElement = document.createElementNS(nameSpace, 'g');
        nodeElement.setAttribute("id", "nodeElement_" + id);
        nodeElement.setAttribute("transform", `translate(${x_position} ${y_position})`);
        let nodeElementTemplate = "";
        if (type === "Initial") {
            nodeElement.setAttribute("class", "marker-group");
            nodeElementTemplate = getInitialMarkerTemplate(componentId, id, status, isSelected, isDragged, color);
            if (renderDetailsGuard)
                nodeElementTemplate += getDetachedLabelTemplate(componentId, id, label, editMode, isSelected, isDragged, width, height, labelLeftOffset, labelTopOffset);
        }
        if (type === "Choice") {
            nodeElement.setAttribute("class", "node-group");
            nodeElementTemplate = getChoiceMarkerTemplate(componentId, id, status, isSelected, isDragged, color);
            if (renderDetailsGuard)
                nodeElementTemplate += getDetachedLabelTemplate(componentId, id, label, editMode, isSelected, isDragged, width, height, labelLeftOffset, labelTopOffset);
        }
        if (type === "Final") {
            nodeElement.setAttribute("class", "marker-group");
            nodeElementTemplate = getFinalMarkerTemplate(componentId, id, status, isSelected, isDragged, color);
            if (renderDetailsGuard)
                nodeElementTemplate += getDetachedLabelTemplate(componentId, id, label, editMode, isSelected, isDragged, width, height, labelLeftOffset, labelTopOffset);
        }
        if (type === "GroupNode") {
            nodeElement.setAttribute("class", "node-group");
            nodeElementTemplate = getGroupNodeBodyTemplate(componentId, id, status, label, editMode, isSelected, isDragged, width, height, color, data);
            if (renderDetailsGuard && status === "ready-to-use")
                nodeElementTemplate += getNodeDetailsTemplate(componentId, id, isSelected, width, height);
        }
        if (type === "Node") {
            nodeElement.setAttribute("class", "node-group");
            // const overlappingGuard = checkOverlappingV2(graphComponent, nodeElement);
            nodeElementTemplate = getNodeBodyTemplate(componentId, id, status, label, editMode, isSelected, { x: x_position, y: y_position }, isDragged, width, height, color, data, false);
            if (renderDetailsGuard && status === "ready-to-use")
                nodeElementTemplate += getNodeDetailsTemplate(componentId, id, isSelected, width, height);
        }
        // status rendering
        if (["sync-ongoing", "creation-failed"].includes(status)) {
            nodeElementTemplate += `
        <g>
        <rect  x=${width - StaticAttributes_2.gridStep / 2} y=${-StaticAttributes_2.gridStep / 2} width=${StaticAttributes_2.gridStep} height=${StaticAttributes_2.gridStep} fill="url('#${status}_${componentId}')" />
        <title>${status}</title>
        </g>
    `;
        }
        nodeElement.innerHTML = nodeElementTemplate;
        return nodeElement;
    };
    exports.createGraphNode = createGraphNode;
    const updateGraphNode = (componentId, id, status, type, label, editMode, x_position, y_position, isSelected, isDragged, width, height, color, labelLeftOffset, labelTopOffset, data, renderDetailsGuard) => {
        const nodeElement = document.getElementById("nodeElement_" + id);
        let nodeElementTemplate = "";
        if (nodeElement) {
            nodeElement.setAttribute("transform", `translate(${x_position} ${y_position})`);
            if (type === "Initial") {
                nodeElement.setAttribute("class", "marker-group");
                nodeElementTemplate = getInitialMarkerTemplate(componentId, id, status, isSelected, isDragged, color);
                if (renderDetailsGuard)
                    nodeElementTemplate += getDetachedLabelTemplate(componentId, id, label, editMode, isSelected, isDragged, width, height, labelLeftOffset, labelTopOffset);
            }
            if (type === "Choice") {
                nodeElement.setAttribute("class", "node-group");
                nodeElementTemplate = getChoiceMarkerTemplate(componentId, id, status, isSelected, isDragged, color);
                if (renderDetailsGuard)
                    nodeElementTemplate += getDetachedLabelTemplate(componentId, id, label, editMode, isSelected, isDragged, width, height, labelLeftOffset, labelTopOffset);
            }
            if (type === "Final") {
                nodeElement.setAttribute("class", "marker-group");
                nodeElementTemplate = getFinalMarkerTemplate(componentId, id, status, isSelected, isDragged, color);
                if (renderDetailsGuard)
                    nodeElementTemplate += getDetachedLabelTemplate(componentId, id, label, editMode, isSelected, isDragged, width, height, labelLeftOffset, labelTopOffset);
            }
            if (type === "GroupNode") {
                nodeElement.setAttribute("class", "node-group");
                nodeElementTemplate = getGroupNodeBodyTemplate(componentId, id, status, label, editMode, isSelected, isDragged, width, height, color, data);
                if (renderDetailsGuard && status === "ready-to-use")
                    nodeElementTemplate += getNodeDetailsTemplate(componentId, id, isSelected, width, height);
            }
            if (type === "Node") {
                nodeElement.setAttribute("class", "node-group");
                // const overlappingGuard = checkOverlappingV2(graphComponent, nodeElement);
                nodeElementTemplate = getNodeBodyTemplate(componentId, id, status, label, editMode, isSelected, { x: x_position, y: y_position }, isDragged, width, height, color, data, false);
                if (renderDetailsGuard && status === "ready-to-use")
                    nodeElementTemplate += getNodeDetailsTemplate(componentId, id, isSelected, width, height);
            }
            // status rendering
            if (["sync-ongoing", "creation-failed"].includes(status)) {
                nodeElementTemplate += `
            <g>
            <rect  x=${width - StaticAttributes_2.gridStep / 2} y=${-StaticAttributes_2.gridStep / 2} width=${StaticAttributes_2.gridStep} height=${StaticAttributes_2.gridStep} fill="url('#${status}_${componentId}')" />
            <title>${status}</title>
            </g>
        `;
            }
            nodeElement.innerHTML = nodeElementTemplate;
        }
        return nodeElement;
    };
    exports.updateGraphNode = updateGraphNode;
    const createGraphLink = (componentId, id, status, label, width, height, labelLeftOffset, labelTopOffset, editMode, wayPoints, color, type, isSelected, isDragged, controlPointRadius, renderDetailsGuard) => {
        const connectionElement = document.createElementNS(nameSpace, 'g');
        connectionElement.setAttribute("id", "connectionElement_" + id);
        let connectElementTemplate = "";
        // triggers zones and path
        connectElementTemplate += getLinkTriggerZoneTemplate(id, status, wayPoints) + getLinkPathTemplate(componentId, id, wayPoints, isSelected, isDragged, color);
        if (renderDetailsGuard && isSelected && !isDragged) {
            connectElementTemplate += getLinkControlPointsTemplate(id, wayPoints, controlPointRadius, color);
        }
        //label
        if (renderDetailsGuard)
            connectElementTemplate += getLinkDetachedLabelTemplate(componentId, id, label, width, height, labelLeftOffset, labelTopOffset, editMode, wayPoints, isSelected, isDragged);
        // status rendering
        if (["sync-ongoing", "creation-failed"].includes(status)) {
            const midPathPoint = (0, LinksMovementsUtils_1.getMidPathPoint)(wayPoints);
            connectElementTemplate += `
                <g>
                    <rect  x=${midPathPoint.x - StaticAttributes_2.gridStep / 2} y=${midPathPoint.y - StaticAttributes_2.gridStep / 2} width=${StaticAttributes_2.gridStep} height=${StaticAttributes_2.gridStep} fill="url('#${status}_${componentId}')" />
                    <title>${status}</title>
                 </g>
                `;
        }
        connectionElement.innerHTML = connectElementTemplate;
        return connectionElement;
    };
    exports.createGraphLink = createGraphLink;
    const updateGraphLink = (componentId, id, status, label, width, height, labelLeftOffset, labelTopOffset, editMode, wayPoints, color, type, isSelected, isDragged, controlPointRadius, renderDetailsGuard) => {
        const connectionElement = document.getElementById("connectionElement_" + id);
        if (connectionElement) {
            let connectElementTemplate = "";
            // triggers zones and path
            connectElementTemplate += getLinkTriggerZoneTemplate(id, status, wayPoints) + getLinkPathTemplate(componentId, id, wayPoints, isSelected, isDragged, color);
            if (renderDetailsGuard && isSelected && !isDragged) {
                connectElementTemplate += getLinkControlPointsTemplate(id, wayPoints, controlPointRadius, color);
            }
            //label
            if (renderDetailsGuard)
                connectElementTemplate += getLinkDetachedLabelTemplate(componentId, id, label, width, height, labelLeftOffset, labelTopOffset, editMode, wayPoints, isSelected, isDragged);
            // status rendering
            if (["sync-ongoing", "creation-failed"].includes(status)) {
                const midPathPoint = (0, LinksMovementsUtils_1.getMidPathPoint)(wayPoints);
                connectElementTemplate += `
                <rect  x=${midPathPoint.x - StaticAttributes_2.gridStep / 2} y=${midPathPoint.y - StaticAttributes_2.gridStep / 2} width=${StaticAttributes_2.gridStep} height=${StaticAttributes_2.gridStep} fill="url('#${status}_${componentId}')" />
                <title>${status}</title>
            `;
                connectionElement.style.opacity = "0.8";
            }
            connectionElement.innerHTML = connectElementTemplate;
        }
        return connectionElement;
    };
    exports.updateGraphLink = updateGraphLink;
    const drawFreeSelectionZone = (componentId, bd, isfill) => {
        const { x, y, w, h } = bd;
        const toolsShapeLayer = document.getElementById(`tools-graphElts-layer_${componentId}`);
        if (w >= 0 && h >= 0) {
            if (!(toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.hasChildNodes())) {
                const freeZoneRect = document.createElementNS(nameSpace, 'rect');
                freeZoneRect.setAttribute("x", `${x}`);
                freeZoneRect.setAttribute("y", `${y}`);
                freeZoneRect.setAttribute("width", `${w}`);
                freeZoneRect.setAttribute("height", `${h}`);
                freeZoneRect.setAttribute("stroke", `var(--ds-blue)`);
                freeZoneRect.setAttribute("stroke-dasharray", `4`);
                freeZoneRect.setAttribute("fill", `${!isfill ? "transparent" : `var(--ds-blue)`}`); // condition on w/h
                freeZoneRect.setAttribute("fill-opacity", `0.1`);
                toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.appendChild(freeZoneRect);
            }
            else {
                if (toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.children[0]) {
                    toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.children[0].setAttribute("x", `${x}`);
                    toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.children[0].setAttribute("y", `${y}`);
                    toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.children[0].setAttribute("width", `${w}`);
                    toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.children[0].setAttribute("height", `${h}`);
                    toolsShapeLayer === null || toolsShapeLayer === void 0 ? void 0 : toolsShapeLayer.children[0].setAttribute("fill", `${!isfill ? "transparent" : `var(--ds-blue)`}`); // condition on w/h
                }
            }
        }
    };
    exports.drawFreeSelectionZone = drawFreeSelectionZone;
    const highlightElements = (listOfselectedElts) => {
        var _a, _b;
        // mimic mouse-out effect
        const hoveredNodesList = document.querySelectorAll(".highlighted,.linkHighlighted");
        for (let i = 0; i < hoveredNodesList.length; i++) {
            (_a = hoveredNodesList[i]) === null || _a === void 0 ? void 0 : _a.classList.remove("highlighted");
            (_b = hoveredNodesList[i]) === null || _b === void 0 ? void 0 : _b.classList.remove("linkHighlighted");
        }
        // mimic mouse over effect
        for (let i = 0; i < listOfselectedElts.length; i++) {
            if (listOfselectedElts[i] instanceof Node_1.Node) {
                const selectedElt = document.getElementById("bodyNode_" + listOfselectedElts[i].id);
                selectedElt === null || selectedElt === void 0 ? void 0 : selectedElt.classList.add("highlighted");
            }
            if (listOfselectedElts[i] instanceof Link_1.Link) {
                const selectedElt = document.getElementById("pathFlow_" + listOfselectedElts[i].id);
                selectedElt === null || selectedElt === void 0 ? void 0 : selectedElt.classList.add("linkHighlighted");
            }
        }
    };
    exports.highlightElements = highlightElements;
    const cleanToolsShapersLayer = (componentId) => {
        const toolsShapeLayer = document.getElementById(`tools-graphElts-layer_${componentId}`);
        if (toolsShapeLayer)
            toolsShapeLayer.innerHTML = ``;
    };
    exports.cleanToolsShapersLayer = cleanToolsShapersLayer;
    const showSelectionBar = (componentId, pos, color, type) => {
        // context Sidebar
        const contextSideBar = document.getElementById(`wux-context-tool-bar_${componentId}`);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("isvisible", "visible");
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("x_offset", `0`);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("y_offset", `0`);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("x_position", `${pos.x}`);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("y_position", `${pos.y}`);
        // synchronous attributes?
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("typesmenu", (0, StaticAttributes_1.getPossibleTypesOfNode)(type).toString());
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("elementtype", type);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("elementcolor", color);
    };
    exports.showSelectionBar = showSelectionBar;
    const updateSelectiobBarPos = (componentId, offset) => {
        const contextSideBar = document.getElementById(`wux-context-tool-bar_${componentId}`);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("x_offset", `${offset.x}`);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("y_offset", `${offset.y}`);
    };
    exports.updateSelectiobBarPos = updateSelectiobBarPos;
    const hideSelectionBar = (componentId) => {
        const contextSideBar = document.getElementById(`wux-context-tool-bar_${componentId}`);
        contextSideBar === null || contextSideBar === void 0 ? void 0 : contextSideBar.setAttribute("isvisible", "hidden");
    };
    exports.hideSelectionBar = hideSelectionBar;
    const drawFloatingConnector = (position) => {
        let flotingConnector = document.createElementNS(nameSpace, "circle");
        flotingConnector.setAttribute('cx', `${position.x}`);
        flotingConnector.setAttribute('cy', `${position.y}`);
        flotingConnector.setAttribute('r', `${6}`);
        flotingConnector.setAttribute('opacity', `${1}`);
        flotingConnector.setAttribute('style', 'fill: var(--ds-blue); stroke: white; stroke-width:2;');
        return flotingConnector;
    };
    exports.drawFloatingConnector = drawFloatingConnector;
    const drawOrthogonalIntersectionArcs = (componentId, listOfPoints) => {
        const arcsGroup = document.getElementById(`arcsGroup_${componentId}`);
        if (arcsGroup) {
            //clear
            arcsGroup.innerHTML = "";
            if (listOfPoints.length > 0)
                listOfPoints.forEach((pt) => {
                    let startPt = { x: pt.x - StaticAttributes_2.gridStep / 4, y: pt.y };
                    let endPt = { x: pt.x + StaticAttributes_2.gridStep / 4, y: pt.y };
                    let arcRadius = StaticAttributes_2.gridStep / 8;
                    arcsGroup.innerHTML += `
            <path d="M${startPt.x} ${startPt.y} A${arcRadius} ${arcRadius}  0 0 1  ${endPt.x} ${endPt.y}" stroke-width="2" stroke="var(--COLOR_COPY_GRAY)"  fill="transparent"></path> 
            <path d="M${startPt.x + 1} ${startPt.y} L${pt.x - 1} ${endPt.y} M${pt.x + 1} ${startPt.y} L${endPt.x - 1} ${endPt.y}" stroke-width="2.2" opacity="0.8" stroke="url('#grid-pattern_${componentId}')"></path>
            `;
                });
        }
    };
    exports.drawOrthogonalIntersectionArcs = drawOrthogonalIntersectionArcs;
    const drawQuadTree = (componentId, listOfMarkers, listOfQuads) => {
        const previewGroup = document.getElementById(`preview-layer_${componentId}`);
        if (previewGroup) {
            // clear
            previewGroup.innerHTML = "";
            //add markers
            listOfMarkers.forEach((marker) => {
                previewGroup.innerHTML += `
        <circle r="5" cx=${marker.x} cy=${marker.y} fill="red" stroke="black" stroke-width="2" />
        `;
            });
            // add quads
            listOfQuads.forEach((quad) => {
                previewGroup.innerHTML += `
        <rect width=${quad.w} height=${quad.h} x=${quad.x} y=${quad.y} fill="transparent" stroke-width="2" stroke="green" />
        `;
            });
        }
    };
    exports.drawQuadTree = drawQuadTree;
});
// export const checkOverlappingV2 = (graphComponent: HTMLElement, currentNode: Element): boolean => {
//     if (!currentNode) return false;
//     const currentNodeBd = currentNode.getBoundingClientRect();
//     const renderedNodes = graphComponent.querySelectorAll(".node-group");
//     for (let i = 0; i < renderedNodes.length; i++) {
//         if (renderedNodes[i].id.split("_")[1] !== currentNode.id.split("_")[1]) {
//             const siblingNodeBd = renderedNodes[i].getBoundingClientRect();
//             const selectionGuard = checkRectangleInclusiveIntersection([siblingNodeBd.x, siblingNodeBd.y, siblingNodeBd.width, siblingNodeBd.height], [currentNodeBd.x, currentNodeBd.y, currentNodeBd.width, currentNodeBd.height]);
//             if (selectionGuard) return true;
//         }
//     }
//     return false;
// }
