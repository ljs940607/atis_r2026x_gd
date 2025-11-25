/// <amd-module name="DS/DELSwimLaneChart_v1/view/DELSwimLaneChartComponents"/>
define("DS/DELSwimLaneChart_v1/view/DELSwimLaneChartComponents", ["require", "exports", "DS/DELSwimLaneChart_v1/utils/StaticAttributes", "DS/DELSwimLaneChart_v1/utils/TextUtils"], function (require, exports, StaticAttributes_1, TextUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nodeTemplate = exports.groupTemplate = exports.columnSeparatorElt = exports.columnHeaderElt = exports.backgroundTemplate = void 0;
    const backgroundTemplate = (viewId) => {
        //
        return ` 
  <div id="root__${viewId}" style="width:100%;height:100%;overflow:hidden;position:relative"> <div class="parentContainer" style="width:100%;max-height:100vh;height:100%;overflow:auto" id="parent__${viewId}" >
            <div id="sticky-container__${viewId}"  style="width:100%;height:${StaticAttributes_1.grid_yOffset}px;position:sticky;top:0px;">
                <svg
                id="header__${viewId}"
                class="content"
                style="width:100%;height:${StaticAttributes_1.grid_yOffset}px"
                preserveAspectRatio="xMaxYMid meet"
                >
                <g class="sticky-layer" id="sticky-layer__${viewId}"></g>
                </svg>
            </div>
            <svg
            id="content__${viewId}"
            class="content"
            style="width:100%;height:calc(100% - ${StaticAttributes_1.grid_yOffset}px)"
            tabindex="-1"
            preserveAspectRatio="xMaxYMid meet">
                <g class="content-layer"  id="grid-content-layer__${viewId}">
                  <g class="columns-layer" id="columns-layer__${viewId}"></g>
                  <g class="nodes-Links-layer" id="nodes-Links-layer__${viewId}"></g>
                  <g class="groups-layer" id="groups-layer__${viewId}">
                  <rect id="reset-scroll__${viewId}" x=0 y=0 width=1 height=1 fill="transparent"></rect>
                  </g>  
                  <g class="top-layer" id="top-layer__${viewId}"></g>
                </g>
            </svg>
          </div>
          <div id="htmlElementWrapper"></div>
          <div id="searcharea__${viewId}"  style="width:fit-content;height:fit-content;position:sticky;z-index:7;bottom:0;background-color:transparent"></div>
          </div>`;
    };
    exports.backgroundTemplate = backgroundTemplate;
    const columnHeaderElt = (col) => {
        let columnGroupElement;
        if (document.getElementById(`columnHeader__${col.id}`))
            columnGroupElement = document.getElementById(`columnHeader__${col.id}`);
        else {
            columnGroupElement = document.createElementNS(StaticAttributes_1.nameSpace, 'g');
            columnGroupElement.setAttribute("id", `columnHeader__${col.id}`);
        }
        if (!columnGroupElement)
            return;
        columnGroupElement.setAttribute("transform", `translate(${col.left} 0)`);
        columnGroupElement.setAttribute("visibility", `${col.hidden ? "hidden" : "visible"}`);
        columnGroupElement.innerHTML = `
      <rect
        id="columnHeaderContainer__${col.id}"
        x="0"
        y="0"
        width=${col.width} 
        height=${2 * StaticAttributes_1.gridStep}
        fill="${col.color ? `${col.color}` : "white"}"
        style="position:sticker;top:0px"
      ></rect>
       <Text x=${col.width / 2} y=${StaticAttributes_1.gridStep} dominant-baseline="middle" text-anchor="middle" fill="var(--transparent)" style="font-family:'Arial'" style="color:${col.textColor}">
      ${(0, TextUtils_1.encodeTextInput)((0, TextUtils_1.truncateText)(col.title, col.width / 2))}
      </Text>
      <foreignObject id="columnHeader__${col.id}" class="columnHeader" x=${0} y=${0} width=${col.width} height=${2 * StaticAttributes_1.gridStep}  >
      <div class="titleParent" style="font-family:Arial;background-color:${col.color ? `${col.color}` : "white"}" id="columnHeaderText__${col.id}"  >
        ${col.icon ? `<span id="columnHeaderTextIcon__${col.id}" class="wux-ui-3ds-1x wux-ui-3ds-${col.icon} titleIcon" ></span>` : ''}
        <span class="title" id="columnHeaderText__${col.id}" style="color:${col.textColor}"  >&nbsp${col.title}</span>
      </div>
      </foreignObject>
      <rect 
        id="columnHeaderSeparatorContainer__${col.id}" 
        fill=${StaticAttributes_1.outlinegrey}
        x="-1"
        y="0"
        width=${1.5}
        height=${2 * StaticAttributes_1.gridStep}
      ></rect>
      <title>${col.title}</title>
    `;
        return columnGroupElement;
    };
    exports.columnHeaderElt = columnHeaderElt;
    const columnSeparatorElt = (col) => {
        let columnSeparatorElement;
        if (document.getElementById(`columnSeparatorGroup__${col.id}`))
            columnSeparatorElement = document.getElementById(`columnSeparatorGroup__${col.id}`);
        else {
            columnSeparatorElement = document.createElementNS(StaticAttributes_1.nameSpace, 'g');
            columnSeparatorElement.setAttribute("id", `columnSeparatorGroup__${col.id}`);
        }
        if (!columnSeparatorElement)
            return;
        columnSeparatorElement.setAttribute("transform", `translate(${col.left} 0)`);
        columnSeparatorElement.setAttribute("visibility", `${col.hidden ? "hidden" : "visible"}`);
        columnSeparatorElement.innerHTML = `
     <rect 
    id="columnSeparatorContainer__${col.id}" 
    fill="${col.color ? `${col.color}` : "white"}"
    x="0"
    y="0"
    width=${col.width} 
    height=${col.height}
    ></rect>
      <rect 
    id="columnSeparator__${col.id}" 
    fill=${StaticAttributes_1.outlinegrey}
    x="-1.1"
    y="0"
    width=${1.5}
    height=${col.height}
      ></rect>
    `;
        return columnSeparatorElement;
    };
    exports.columnSeparatorElt = columnSeparatorElt;
    const groupTemplate = (group) => {
        let groupElement;
        if (document.getElementById(`group__${group.id}`))
            groupElement = document.getElementById(`group__${group.id}`);
        else {
            groupElement = document.createElementNS(StaticAttributes_1.nameSpace, 'g');
            groupElement.setAttribute("id", `group__${group.id}`);
        }
        if (!groupElement)
            return;
        groupElement.innerHTML = `
      <line x1=${group.boundingBox.x} y1=${group.boundingBox.y} x2=${group.boundingBox.x + group.boundingBox.w} y2=${group.boundingBox.y} stroke=${group.color} stroke-width=1.5 stroke-dasharray="8"/>
    `;
        //  <line x1=${group.boundingBox.x} y1=${group.boundingBox.y + group.boundingBox.h} x2=${group.boundingBox.x + group.boundingBox.w} y2=${group.boundingBox.y + group.boundingBox.h} stroke=${group.color} stroke-width=1.5 stroke-dasharray="8" />
        return groupElement;
    };
    exports.groupTemplate = groupTemplate;
    const nodeTemplate = (node) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const isExpanded = (!node.header || (node.header && !node.isMinimized)) && node.bodyHeight > StaticAttributes_1.header_height; // 
        const cornerRadius = 4;
        // header 
        const headerHeight = node.header ? StaticAttributes_1.header_height : 0;
        const headerWidth = node.width;
        const headerIconTop = (headerHeight - StaticAttributes_1.imgSize) / 2;
        const headerLeftIconLeft = StaticAttributes_1.margin;
        const headerRightIconLeft = node.width - StaticAttributes_1.imgSize - StaticAttributes_1.margin;
        const headerTitleTop = 0;
        const headerTitleLeft = ((_a = node.header) === null || _a === void 0 ? void 0 : _a.leftIcon) ? StaticAttributes_1.imgSize + StaticAttributes_1.margin + headerLeftIconLeft : StaticAttributes_1.margin;
        const headerTitleWidth = ((_b = node.header) === null || _b === void 0 ? void 0 : _b.rightIcon) ? node.width - headerTitleLeft - StaticAttributes_1.imgSize - 2 * StaticAttributes_1.margin : node.width - headerTitleLeft - StaticAttributes_1.margin;
        // content
        const contentBodyTop = headerHeight + StaticAttributes_1.margin;
        const contentHeight = node.type === "CompositeNode" ? node.bodyHeight : node.height;
        const contentBodyHeight = contentHeight - headerHeight - 2 * StaticAttributes_1.margin;
        const contentIconTop = (contentHeight + StaticAttributes_1.imgSize) / 2;
        const contentLeftIconLeft = StaticAttributes_1.margin;
        const contentRightIconLeft = node.width - StaticAttributes_1.imgSize - StaticAttributes_1.margin;
        const contentBodyLeft = node.content.leftIcon ? StaticAttributes_1.imgSize + contentLeftIconLeft + StaticAttributes_1.margin : StaticAttributes_1.margin;
        const contentBodyWidth = node.content.rightIcon ? node.width - contentBodyLeft - StaticAttributes_1.imgSize - 2 * StaticAttributes_1.margin : node.width - contentBodyLeft - StaticAttributes_1.margin;
        let nodeGroupElement;
        if (document.getElementById(`node__${node.id}`))
            nodeGroupElement = document.getElementById(`node__${node.id}`);
        else {
            nodeGroupElement = document.createElementNS(StaticAttributes_1.nameSpace, 'g');
            nodeGroupElement.setAttribute("id", `node__${node.id}`);
            nodeGroupElement.setAttribute("class", `node`);
        }
        if (!nodeGroupElement)
            return;
        nodeGroupElement.setAttribute("transform", `translate(${node.position.x},${node.position.y})`);
        // nodeGroupElement.style.transform=`translate3d(${node.position.x}px,${node.position.y}px,0px)`;
        // nodeGroupElement.style.transform=`translate(${node.position.x}px,${node.position.y}px)`;
        if (node.type === "CompositeNode") {
            let compositeNodeBackground = document.getElementById("compositeNodeBody__" + node.id);
            if (!compositeNodeBackground) {
                compositeNodeBackground = document.createElementNS(StaticAttributes_1.nameSpace, 'rect');
                compositeNodeBackground.setAttribute("id", "compositeNodeBody__" + node.id);
                nodeGroupElement.insertBefore(compositeNodeBackground, nodeGroupElement.firstChild);
            }
            compositeNodeBackground.setAttribute("fill", `${node.highlighted ? StaticAttributes_1.highlight_color : StaticAttributes_1.lightgrey}`);
            compositeNodeBackground.setAttribute("x", "0");
            compositeNodeBackground.setAttribute("y", "0");
            compositeNodeBackground.setAttribute("rx", cornerRadius + "");
            compositeNodeBackground.setAttribute("width", node.width + "");
            compositeNodeBackground.setAttribute("height", node.height + "");
            compositeNodeBackground.setAttribute("stroke", `${node.selected || node.highlighted ? StaticAttributes_1.corporate_steel_blue : StaticAttributes_1.dark_gray}`);
            compositeNodeBackground.setAttribute("stroke-width", `${node.selected || node.highlighted ? 2 : 1}`);
            compositeNodeBackground.setAttribute("stroke-opacity", `${node.highlighted && !node.selected ? "0.5" : "0.8"}`);
        }
        else {
            const compositeNodeBackground = document.getElementById("compositeNodeBody__" + node.id);
            if (compositeNodeBackground)
                nodeGroupElement.removeChild(compositeNodeBackground);
        }
        if (node.content) {
            // background rectangle
            let contentBackground = document.getElementById("nodeBody__" + node.id);
            if (!contentBackground) {
                contentBackground = document.createElementNS(StaticAttributes_1.nameSpace, 'rect');
                contentBackground.setAttribute("id", "nodeBody__" + node.id);
                nodeGroupElement.appendChild(contentBackground);
            }
            contentBackground.setAttribute("fill", `${(node.highlighted) ? StaticAttributes_1.highlight_color : node.content && node.content.color ? `${node.content.color}` : "white"}`);
            contentBackground.setAttribute("x", node.type === "CompositeNode" ? "1" : "0");
            contentBackground.setAttribute("y", "0");
            contentBackground.setAttribute("rx", cornerRadius + "");
            contentBackground.setAttribute("width", node.type === "CompositeNode" ? node.width - 2 + "" : node.width + "");
            contentBackground.setAttribute("height", contentHeight + "");
            contentBackground.setAttribute("visibility", isExpanded ? "visible" : "hidden");
            contentBackground.setAttribute("display", isExpanded ? "block" : "none");
            if (node.type !== "CompositeNode") {
                contentBackground.setAttribute("stroke", `${node.selected || node.highlighted ? StaticAttributes_1.corporate_steel_blue : StaticAttributes_1.dark_gray}`);
                contentBackground.setAttribute("stroke-width", `${node.selected || node.highlighted ? 2 : 1}`);
                contentBackground.setAttribute("stroke-opacity", `${node.highlighted && !node.selected ? "0.5" : "0.8"}`);
            }
            else {
                contentBackground.setAttribute("stroke-width", `0`);
            }
            // leftIcon
            if (node.content.leftIcon) {
                let leftIcon = document.getElementById("bodyLeftIcon__" + node.id);
                if (!leftIcon) {
                    leftIcon = document.createElementNS(StaticAttributes_1.nameSpace, 'image');
                    leftIcon.setAttribute("id", "bodyLeftIcon__" + node.id);
                    leftIcon.setAttribute("crossorigin", "use-credentials");
                    leftIcon.setAttribute("class", "icons");
                    nodeGroupElement.appendChild(leftIcon);
                }
                leftIcon.setAttribute('height', `${StaticAttributes_1.imgSize}`);
                leftIcon.setAttribute('width', `${StaticAttributes_1.imgSize}`);
                leftIcon.setAttribute('x', `${contentLeftIconLeft}`);
                leftIcon.setAttribute('y', `${contentIconTop}`);
                leftIcon.setAttribute("display", isExpanded ? "block" : "none");
                if (leftIcon.getAttribute("href") !== node.content.leftIcon)
                    leftIcon.setAttribute('href', `${node.content.leftIcon}`);
            }
            else {
                const leftIcon = document.getElementById("bodyLeftIcon__" + node.id);
                if (leftIcon)
                    nodeGroupElement.removeChild(leftIcon);
            }
            // body
            if (node.content.childElement) {
                let contentBody = document.getElementById("foreignNode__" + node.id);
                if (!contentBody) {
                    contentBody = document.createElementNS(StaticAttributes_1.nameSpace, 'foreignObject');
                    contentBody.setAttribute('id', "foreignNode__" + node.id);
                    contentBody.setAttribute('class', "foreignNode");
                    nodeGroupElement.appendChild(contentBody);
                }
                if (!node.content.childElement.classList.contains("childElement"))
                    node.content.childElement.classList.add("childElement");
                contentBody.setAttribute('height', `${contentBodyHeight}`);
                contentBody.setAttribute('width', `${contentBodyWidth}`);
                contentBody.setAttribute('x', `${contentBodyLeft}`);
                contentBody.setAttribute('y', `${contentBodyTop}`);
                contentBody.setAttribute("visibility", isExpanded ? "visible" : "hidden");
                contentBody.setAttribute("display", isExpanded ? "block" : "none");
                if (node.content.highlightedchildElement)
                    node.content.highlightedchildElement.style.fontSize = ((_c = node.content.fontSize) !== null && _c !== void 0 ? _c : 12) + "px";
                else
                    node.content.childElement.style.fontSize = ((_d = node.content.fontSize) !== null && _d !== void 0 ? _d : 12) + "px";
                const childElement = document.getElementById("childElement__" + node.id);
                if (!childElement) {
                    if (node.content.highlightedchildElement) {
                        node.content.highlightedchildElement.setAttribute('id', "childElement__" + node.id);
                        contentBody.appendChild(node.content.highlightedchildElement);
                    }
                    else {
                        node.content.childElement.setAttribute('id', "childElement__" + node.id);
                        contentBody.innerHTML = "";
                        contentBody.appendChild(node.content.childElement);
                    }
                }
                else {
                    if (node.content.highlightedchildElement)
                        childElement.replaceWith(node.content.highlightedchildElement);
                    else
                        childElement.replaceWith(node.content.childElement);
                }
            }
            else {
                const contentBody = document.getElementById("foreignNode__" + node.id);
                if (contentBody)
                    nodeGroupElement.removeChild(contentBody);
            }
            if (node.content.text && !node.content.childElement) {
                let textContent = document.getElementById("bodyTextContent__" + node.id);
                if (!textContent) {
                    textContent = document.createElementNS(StaticAttributes_1.nameSpace, 'foreignObject');
                    textContent.setAttribute("id", "bodyTextContent__" + node.id);
                    textContent.setAttribute('class', "foreignNode");
                    nodeGroupElement.appendChild(textContent);
                }
                textContent.setAttribute('fill', (_e = node.content.textColor) !== null && _e !== void 0 ? _e : "black");
                textContent.setAttribute('x', `${contentBodyLeft}`);
                textContent.setAttribute('y', `${contentBodyTop}`);
                textContent.setAttribute('height', `${contentBodyHeight}`);
                textContent.setAttribute('width', `${contentBodyWidth}`);
                textContent.setAttribute("visibility", isExpanded ? "visible" : "hidden");
                textContent.setAttribute("display", isExpanded ? "block" : "none");
                textContent.innerHTML = `<div  class="responsiveText" style="font-size:${(_f = node.content.fontSize) !== null && _f !== void 0 ? _f : 12}px;color:${(_g = node.content.textColor) !== null && _g !== void 0 ? _g : "black"};">${node.content.text}</div>`;
                if (textContent.firstChild)
                    textContent.firstChild.setAttribute("title", `${node.content.text}`);
                // case of update: delete the content > remove it from dom
            }
            else {
                const textContent = document.getElementById("bodyTextContent__" + node.id);
                if (textContent)
                    nodeGroupElement.removeChild(textContent);
            }
            // rightIcon
            if (node.content.rightIcon) {
                let rightIcon = document.getElementById("bodyRightIcon__" + node.id);
                if (!rightIcon) {
                    rightIcon = document.createElementNS(StaticAttributes_1.nameSpace, 'image');
                    rightIcon.setAttribute("id", "bodyRightIcon__" + node.id);
                    rightIcon.setAttribute("crossorigin", "use-credentials");
                    rightIcon.setAttribute("class", "icons");
                    nodeGroupElement.appendChild(rightIcon);
                }
                rightIcon.setAttribute('height', `${StaticAttributes_1.imgSize}`);
                rightIcon.setAttribute('width', `${StaticAttributes_1.imgSize}`);
                rightIcon.setAttribute('x', `${contentRightIconLeft}`);
                rightIcon.setAttribute('y', `${contentIconTop}`);
                rightIcon.setAttribute("display", isExpanded ? "block" : "none");
                if (rightIcon.getAttribute("href") !== node.content.rightIcon)
                    rightIcon.setAttribute('href', `${node.content.rightIcon}`);
            }
        }
        else {
            const rightIcon = document.getElementById("bodyRightIcon__" + node.id);
            if (rightIcon)
                nodeGroupElement.removeChild(rightIcon);
        }
        if (node.header) {
            let headerGroup = document.getElementById("nodeHeaderGroup__" + node.id);
            if (!headerGroup) {
                headerGroup = document.createElementNS(StaticAttributes_1.nameSpace, "g");
                headerGroup.setAttribute("id", "nodeHeaderGroup__" + node.id);
                nodeGroupElement.appendChild(headerGroup);
            }
            // background rectangle
            let headerBackground = document.getElementById("nodeHeader__" + node.id);
            if (!headerBackground) {
                headerBackground = document.createElementNS(StaticAttributes_1.nameSpace, "path");
                headerBackground.setAttribute("id", "nodeHeader__" + node.id);
                headerBackground.style.pointerEvents = "fill";
                headerGroup.appendChild(headerBackground);
            }
            headerBackground.setAttribute("fill", `${(node.header && node.header.color) ? node.header.color : "var(--lightgrey)"}`);
            headerBackground.setAttribute("d", isExpanded ? `
      M ${cornerRadius} 0
      Q 0 0 0 ${cornerRadius}
      L 0 ${headerHeight}
      L ${headerWidth} ${headerHeight}
      L ${headerWidth} ${cornerRadius}
      Q ${headerWidth} 0 ${headerWidth - cornerRadius} 0
      z
    ` : `
    M ${cornerRadius} 0
    Q 0 0 0 ${cornerRadius}
    L 0 ${headerHeight - cornerRadius}
    Q 0 ${headerHeight} ${cornerRadius} ${headerHeight}
    L ${headerWidth - cornerRadius} ${headerHeight}
    Q ${headerWidth} ${headerHeight} ${headerWidth} ${headerHeight - cornerRadius}
    L ${headerWidth} ${cornerRadius}
    Q ${headerWidth} 0 ${headerWidth - cornerRadius} 0
    z
  `);
            headerBackground.setAttribute("stroke", `${node.selected || node.highlighted ? StaticAttributes_1.corporate_steel_blue : StaticAttributes_1.dark_gray}`);
            headerBackground.setAttribute("stroke-width", `${node.selected || node.highlighted ? 2 : 1}`);
            headerBackground.setAttribute("stroke-opacity", `${node.highlighted && !node.selected ? "0.5" : "0.8"}`);
            if (node.header.leftIcon) {
                let leftHeaderIcon = document.getElementById("headerLeftIcon__" + node.id);
                if (!leftHeaderIcon) {
                    leftHeaderIcon = document.createElementNS(StaticAttributes_1.nameSpace, 'image');
                    leftHeaderIcon.setAttribute("id", "headerLeftIcon__" + node.id);
                    leftHeaderIcon.setAttribute("crossorigin", "use-credentials");
                    leftHeaderIcon.setAttribute("class", "icons");
                    headerGroup.appendChild(leftHeaderIcon);
                }
                leftHeaderIcon.setAttribute('height', `${StaticAttributes_1.imgSize}`);
                leftHeaderIcon.setAttribute('width', `${StaticAttributes_1.imgSize}`);
                leftHeaderIcon.setAttribute('x', `${headerLeftIconLeft}`);
                leftHeaderIcon.setAttribute('y', `${headerIconTop}`);
                if (leftHeaderIcon.getAttribute("href") !== node.header.leftIcon)
                    leftHeaderIcon.setAttribute('href', `${node.header.leftIcon}`);
            }
            else {
                const leftHeaderIcon = document.getElementById("headerLeftIcon__" + node.id);
                if (leftHeaderIcon)
                    headerGroup.removeChild(leftHeaderIcon);
            }
            if (node.header.text) {
                let headerTitle = document.getElementById("nodeHeaderText__" + node.id);
                if (!headerTitle) {
                    headerTitle = document.createElementNS(StaticAttributes_1.nameSpace, 'foreignObject');
                    headerTitle.setAttribute('id', "nodeHeaderText__" + node.id);
                    headerTitle.setAttribute('class', "foreignNode");
                    headerGroup.appendChild(headerTitle);
                }
                headerTitle.setAttribute('height', `${headerHeight}`);
                headerTitle.setAttribute('width', `${headerTitleWidth}`);
                headerTitle.setAttribute('x', `${headerTitleLeft}`);
                headerTitle.setAttribute('y', `${headerTitleTop}`);
                headerTitle.innerHTML = `<span id=${"nodeHeaderResponsiveText__" + node.id} class="responsiveText"  style="font-size:${(_h = node.header.fontSize) !== null && _h !== void 0 ? _h : 12}px;height:${StaticAttributes_1.header_height}px;color:${(_j = node.header.textColor) !== null && _j !== void 0 ? _j : "black"};">${node.header.text}</span>`;
                if (headerTitle.firstChild)
                    headerTitle.firstChild.setAttribute("title", `${node.header.text}`);
            }
            else {
                const headerTitle = document.getElementById("nodeHeaderText__" + node.id);
                if (headerTitle)
                    headerGroup.removeChild(headerTitle);
            }
            if (node.header.rightIcon) {
                let rightHeaderIcon = document.getElementById("headerRightIcon__" + node.id);
                if (!rightHeaderIcon) {
                    rightHeaderIcon = document.createElementNS(StaticAttributes_1.nameSpace, 'image');
                    rightHeaderIcon.setAttribute("id", "headerRightIcon__" + node.id);
                    rightHeaderIcon.setAttribute("crossorigin", "use-credentials");
                    rightHeaderIcon.setAttribute("class", "icons");
                    headerGroup.appendChild(rightHeaderIcon);
                }
                rightHeaderIcon.setAttribute('height', `${StaticAttributes_1.imgSize}`);
                rightHeaderIcon.setAttribute('width', `${StaticAttributes_1.imgSize}`);
                rightHeaderIcon.setAttribute('x', `${headerRightIconLeft}`);
                rightHeaderIcon.setAttribute('y', `${headerIconTop}`);
                if (rightHeaderIcon.getAttribute("href") !== node.header.rightIcon)
                    rightHeaderIcon.setAttribute('href', node.header.rightIcon);
            }
            else {
                const rightHeaderIcon = document.getElementById("headerRightIcon__" + node.id);
                if (rightHeaderIcon)
                    headerGroup.removeChild(rightHeaderIcon);
            }
        }
        else {
            const headerGroup = document.getElementById("nodeHeaderGroup__" + node.id);
            if (headerGroup)
                nodeGroupElement.removeChild(headerGroup);
        }
        return nodeGroupElement;
    };
    exports.nodeTemplate = nodeTemplate;
});
