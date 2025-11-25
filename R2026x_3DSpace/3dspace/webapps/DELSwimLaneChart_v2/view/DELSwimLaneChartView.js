/// <amd-module name="DS/DELSwimLaneChart_v2/view/DELSwimLaneChartView"/>
define("DS/DELSwimLaneChart_v2/view/DELSwimLaneChartView", ["require", "exports", "DS/DELSwimLaneChart_v2/model/SwimLaneChartColumn", "DS/DELSwimLaneChart_v2/model/SwimLaneChartGroup", "DS/DELSwimLaneChart_v2/model/SwimLaneChartNode", "DS/DELSwimLaneChart_v2/utils/StaticAttributes", "DS/DELSwimLaneChart_v2/view/DELSwimLaneChartComponents", "DS/Controls/Find", "i18n!DS/DELSwimLaneChart_v2/assets/nls/view"], function (require, exports, SwimLaneChartColumn_1, SwimLaneChartGroup_1, SwimLaneChartNode_1, StaticAttributes_1, DELSwimLaneChartComponents_1, WUXFind, I18n) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartView {
        constructor(id) {
            // search
            this._findView = new WUXFind();
            this._id = id;
        }
        initRender(customComponent) {
            customComponent.innerHTML = (0, DELSwimLaneChartComponents_1.backgroundTemplate)(this._id).trim();
        }
        initSearchView(customComponent, findStr, scrollToResult) {
            const searchArea = this.getFindContainer();
            if (!searchArea)
                return;
            this._findView = new WUXFind({
                relatedWidget: customComponent,
                placeholder: I18n.get("search"),
                onFindRequest: function () {
                    findStr();
                },
                onFindPreviousResult: function () {
                    scrollToResult();
                },
                onFindNextResult: function () {
                    scrollToResult();
                },
                displayClose: false,
                displayCount: true,
            });
            this._findView.inject(searchArea);
        }
        reRender(renderActions) {
            renderActions.forEach((renderAction) => {
                const { type, payload } = renderAction;
                payload.forEach((elt) => {
                    if (elt instanceof SwimLaneChartColumn_1.default)
                        this.reRenderSwimLaneChartColumn(type, elt);
                    if (elt instanceof SwimLaneChartNode_1.default)
                        this.reRenderSwimLaneChartNode(type, elt);
                    if (elt instanceof SwimLaneChartGroup_1.default)
                        this.reRenderGroup(type, elt);
                });
            });
        }
        reRenderSwimLaneChartColumn(type, column) {
            const columnHeaderLayer = document.getElementById(`sticky-layer__${this._id}`);
            const columnLayer = document.getElementById(`columns-layer__${this._id}`);
            switch (type) {
                case "create":
                    {
                        const columnHeaderElement = (0, DELSwimLaneChartComponents_1.columnHeaderElt)(column, this._id);
                        const columnSeparatorElement = (0, DELSwimLaneChartComponents_1.columnSeparatorElt)(column, this._id);
                        if (columnHeaderElement && columnHeaderLayer)
                            columnHeaderLayer.appendChild(columnHeaderElement);
                        if (columnSeparatorElement && columnLayer)
                            columnLayer.appendChild(columnSeparatorElement);
                    }
                    break;
                case "update":
                    {
                        (0, DELSwimLaneChartComponents_1.columnHeaderElt)(column, this._id);
                        (0, DELSwimLaneChartComponents_1.columnSeparatorElt)(column, this._id);
                    }
                    break;
                case "delete":
                    {
                        const columnHeaderElement = document.getElementById(`columnHeader__${column.id}__${this._id}`);
                        const columnSeparatorElement = document.getElementById(`columnSeparatorGroup__${column.id}__${this._id}`);
                        if (columnHeaderElement && columnHeaderLayer)
                            columnHeaderLayer.removeChild(columnHeaderElement);
                        if (columnSeparatorElement && columnLayer)
                            columnLayer.removeChild(columnSeparatorElement);
                    }
                    break;
            }
        }
        reRenderSwimLaneChartNode(type, node) {
            var _a, _b, _c, _d;
            const nodesLinksLayer = document.getElementById(`nodes-Links-layer__${this._id}`);
            const topLayer = document.getElementById(`top-layer__${this._id}`);
            switch (type) {
                case "create":
                    {
                        const nodeToCreate = (0, DELSwimLaneChartComponents_1.nodeTemplate)(node);
                        if (nodeToCreate && nodesLinksLayer)
                            nodesLinksLayer.appendChild(nodeToCreate);
                        this.adjustResponsiveText(node);
                    }
                    break;
                case "update":
                    {
                        const oldWidth = (_b = (_a = document.getElementById("node__" + node.id)) === null || _a === void 0 ? void 0 : _a.firstChild) === null || _b === void 0 ? void 0 : _b.getAttribute("width");
                        (0, DELSwimLaneChartComponents_1.nodeTemplate)(node);
                        if (node.width !== Number(oldWidth) || !node.content.fontSize || ((_c = node.header) === null || _c === void 0 ? void 0 : _c.fontSize))
                            this.adjustResponsiveText(node);
                        if ((_d = node.header) === null || _d === void 0 ? void 0 : _d.topOffset) {
                            const nodeClone = new SwimLaneChartNode_1.default(node.id + "__clone", "", { x: node.position.x, y: node.position.y + node.header.topOffset }, node.width, node.height, { ...node.header, text: " " });
                            (0, DELSwimLaneChartComponents_1.nodeTemplate)(nodeClone);
                            // update the text 
                            const headerText = document.getElementById("nodeHeaderResponsiveText__" + node.id);
                            const headerTextClone = document.getElementById("nodeHeaderResponsiveText__" + node.id + "__clone");
                            if (headerText && headerTextClone)
                                headerTextClone.innerHTML = headerText.innerHTML;
                        }
                    }
                    break;
                case "pin":
                    {
                        const nodeToPin = document.getElementById("node__" + node.id);
                        if (nodeToPin) {
                            nodeToPin.style.transform = `translate(${node.position.x}px,${node.position.y}px)`;
                        }
                        if (node.header && typeof node.header.topOffset !== "undefined") {
                            if (node.header.topOffset > 0) {
                                const nodeClone = new SwimLaneChartNode_1.default(node.id + "__clone", "", { x: node.position.x, y: node.position.y + node.header.topOffset }, node.width, node.height, { ...node.header, text: " " });
                                const clonedHeaderElt = (0, DELSwimLaneChartComponents_1.nodeTemplate)(nodeClone);
                                if (clonedHeaderElt)
                                    topLayer === null || topLayer === void 0 ? void 0 : topLayer.appendChild(clonedHeaderElt);
                                // update the text 
                                const headerText = document.getElementById("nodeHeaderResponsiveText__" + node.id);
                                const headerTextClone = document.getElementById("nodeHeaderResponsiveText__" + node.id + "__clone");
                                if (headerText && headerTextClone)
                                    headerTextClone.innerHTML = headerText.innerHTML;
                            }
                            else {
                                const headerClone = document.getElementById("node__" + node.id + "__clone");
                                if (headerClone) {
                                    topLayer === null || topLayer === void 0 ? void 0 : topLayer.removeChild(headerClone);
                                }
                            }
                        }
                    }
                    break;
                case "delete":
                    {
                        const nodeToDelete = document.getElementById("node__" + node.id);
                        if (nodeToDelete && nodesLinksLayer)
                            nodesLinksLayer.removeChild(nodeToDelete);
                        const headerClone = document.getElementById("node__" + node.id + "__clone");
                        if (headerClone) {
                            topLayer === null || topLayer === void 0 ? void 0 : topLayer.removeChild(headerClone);
                        }
                    }
                    break;
            }
        }
        reRenderGroup(type, group) {
            const groupsLayer = document.getElementById(`groups-layer__${this._id}`);
            if (!group.id)
                return;
            const groupDelimitersElt = (0, DELSwimLaneChartComponents_1.groupTemplate)(group);
            switch (type) {
                case "create":
                    if (groupDelimitersElt && groupsLayer)
                        groupsLayer.appendChild(groupDelimitersElt);
                    break;
                case "update":
                    break;
                case "delete":
                    if (groupDelimitersElt && groupsLayer && groupDelimitersElt.parentNode === groupsLayer)
                        groupsLayer.removeChild(groupDelimitersElt);
                    break;
            }
        }
        updateGridHeight(newHeight) {
            var _a, _b, _c, _d, _e;
            const parentContainer = this.getParentContainer();
            const rootContainer = this.getRootContainer();
            const domWrapper = (_b = (_a = this.getRootContainer()) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
            const grandParentMaxHeight = domWrapper === null || domWrapper === void 0 ? void 0 : domWrapper.style.maxHeight;
            //fix to avoid double scrollbars issue
            if (domWrapper && rootContainer && parentContainer && grandParentMaxHeight) {
                if ((domWrapper === null || domWrapper === void 0 ? void 0 : domWrapper.style.height) === "auto") {
                    rootContainer.style.maxHeight = `calc(${grandParentMaxHeight} - ${1.5 * StaticAttributes_1.grid_yOffset}px)`;
                    parentContainer.style.maxHeight = `calc(${grandParentMaxHeight} - ${1.5 * StaticAttributes_1.grid_yOffset}px)`;
                }
                else {
                    rootContainer.style.maxHeight = "unset";
                    parentContainer.style.maxHeight = "unset";
                }
            }
            // update height
            const svgContainer = this.getGridContainer();
            const parentHeight = (_c = parentContainer === null || parentContainer === void 0 ? void 0 : parentContainer.clientHeight) !== null && _c !== void 0 ? _c : 0;
            const stickyLayerHeight = (_e = (_d = this.getStickyContainer()) === null || _d === void 0 ? void 0 : _d.clientHeight) !== null && _e !== void 0 ? _e : 0;
            if (svgContainer) {
                const occupiedHeight = Math.max(Math.min(parentHeight - stickyLayerHeight - 10, svgContainer === null || svgContainer === void 0 ? void 0 : svgContainer.clientHeight), newHeight);
                svgContainer.style.height = (occupiedHeight) + "px";
            }
        }
        updateGridWidth(newWidth) {
            const svgContainer = this.getGridContainer();
            const header = this.getHeader();
            if (header && svgContainer) {
                header.style.width = newWidth + "px";
                svgContainer.style.width = newWidth + "px";
            }
        }
        adjustResponsiveText(node) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            // adjust the header text
            const headerTextElement = (_a = document.getElementById("nodeHeaderText__" + node.id)) === null || _a === void 0 ? void 0 : _a.firstChild;
            if (headerTextElement && ((_b = node.header) === null || _b === void 0 ? void 0 : _b.textWrap) === "nowrap") {
                const headerLeftIconLeft = ((_c = node.header) === null || _c === void 0 ? void 0 : _c.collapsibleIcon) ? StaticAttributes_1.imgSize + StaticAttributes_1.margin : StaticAttributes_1.margin;
                const headerTitleLeft = ((_d = node.header) === null || _d === void 0 ? void 0 : _d.leftIcon) ? StaticAttributes_1.imgSize + StaticAttributes_1.margin + headerLeftIconLeft : headerLeftIconLeft;
                const headerTitleWidth = ((_e = node.header) === null || _e === void 0 ? void 0 : _e.rightIcon) ? Math.max(node.width - headerTitleLeft - StaticAttributes_1.imgSize - 2 * StaticAttributes_1.margin, 2 * StaticAttributes_1.margin) : Math.max(node.width - headerTitleLeft - StaticAttributes_1.margin, 2 * StaticAttributes_1.margin);
                headerTextElement.style.height = ((_f = node.header) === null || _f === void 0 ? void 0 : _f.height) + "px";
                let fontSize = 12;
                headerTextElement.style.fontSize = fontSize + "px";
                while (headerTextElement.offsetWidth >= headerTitleWidth && fontSize > 8) {
                    fontSize -= 0.5;
                    headerTextElement.style.fontSize = fontSize + "px";
                }
                if (node.header)
                    node.header.fontSize = fontSize;
                headerTextElement.style.width = "100%";
            }
            // adjust the content text
            const minFontSize = node.content.text ? 5 : 12;
            const contenTextElement = ((_g = node.content) === null || _g === void 0 ? void 0 : _g.childElement) ? (_h = document.getElementById("foreignNode__" + node.id)) === null || _h === void 0 ? void 0 : _h.firstChild : (_j = document.getElementById("bodyTextContent__" + node.id)) === null || _j === void 0 ? void 0 : _j.firstChild;
            if (contenTextElement) {
                contenTextElement.classList.remove("chidlElement");
                const topOffset = node.header ? ((_l = (_k = node.header) === null || _k === void 0 ? void 0 : _k.height) !== null && _l !== void 0 ? _l : StaticAttributes_1.header_height) + 2 * StaticAttributes_1.margin : 2 * StaticAttributes_1.margin;
                let fontSize = 14;
                const heightTreshold = node.type === "CompositeNode" ? node.bodyHeight - topOffset : node.height - topOffset;
                contenTextElement.style.fontSize = fontSize + "px"; // todo: to optimize
                while (contenTextElement.clientHeight > heightTreshold && fontSize > minFontSize) {
                    fontSize--;
                    contenTextElement.style.fontSize = fontSize + "px";
                }
                node.content.fontSize = fontSize;
                contenTextElement.classList.add("childElement");
            }
        }
        highlightMatchingStringInNode(node, str, res) {
            const regex = new RegExp(`${str.toLocaleLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/, "\\$&")}`, "gim"); // g for global
            res.locations.forEach((location) => {
                if (location === "Header" && node.header && node.header.text) {
                    // reset the text from the already existing marks, and then highlight it
                    node.header.text = node.header.text
                        .replace(/<\/?mark>/g, "")
                        .replace(regex, (match) => `<mark>${match}</mark>`);
                }
                else {
                    // child element or text element
                    if (node.content.childElement) {
                        node.content.highlightedchildElement =
                            node.content.childElement.cloneNode();
                        node.content.highlightedchildElement.innerHTML =
                            node.content.childElement.innerHTML;
                        const customRegex = new RegExp(`(?<!<[^>]*)(${str.toLocaleLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})(?![^<]*>)`, "gim");
                        if (node.content.highlightedchildElement)
                            node.content.highlightedchildElement.innerHTML =
                                node.content.highlightedchildElement.innerHTML
                                    .replace(/<\/?mark>/g, "")
                                    .replace(customRegex, (match) => `<mark>${match}</mark>`);
                        // node.content.childElement.innerHTML=node.content.childElement.innerHTML.replace(/<\/?mark>/g, '').replace(regex, `<mark>${str}</mark>`);
                        // const chidNodes=node.content.childElement.getElementsByTagName("*");
                        // for(let i=0;i<chidNodes.length;i++){
                        //     console.log("childNode",chidNodes[i].TEXT_NODE,chidNodes[i].nodeType,Node.TEXT_NODE)
                        // }
                    }
                    else if (node.content.text)
                        node.content.text = node.content.text
                            .replace(/<\/?mark>/g, "")
                            .replace(regex, (match) => `<mark>${match}</mark>`);
                }
            });
        }
        unHighlightMatchingStringInNode(node) {
            if (node.header && node.header.text) {
                node.header.text = node.header.text.replace(/<\/?mark>/gi, "");
            }
            // child element or text element
            if (node.content.childElement) {
                node.content.highlightedchildElement = undefined;
            }
            else if (node.content.text)
                node.content.text = node.content.text.replace(/<\/?mark>/gi, "");
        }
        checkScrollbars() {
            const parentContainer = this.getParentContainer();
            const gridContainer = this.getGridContainer();
            if (gridContainer && parentContainer && (gridContainer.clientHeight + StaticAttributes_1.grid_yOffset) > parentContainer.offsetHeight) {
                return true;
            }
            return false;
        }
        resetScrollbar() {
            const resetRect = document.getElementById(`reset-scroll__${this._id}`);
            if (!resetRect)
                return;
            resetRect.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            });
        }
        scrollBy(offsetx, offsety) {
            const parentContainer = this.getParentContainer();
            if (parentContainer)
                parentContainer.scrollTo({ top: offsety });
        }
        getRootContainer() {
            return document.getElementById(`root__${this._id}`);
        }
        getParentContainer() {
            return document.getElementById(`parent__${this._id}`);
        }
        getGridContainer() {
            return document.getElementById(`content__${this._id}`);
        }
        getStickyContainer() {
            return document.getElementById(`sticky-container__${this._id}`);
        }
        getHeader() {
            return document.getElementById(`header__${this._id}`);
        }
        getStickyLayer() {
            return document.getElementById(`sticky-layer__${this._id}`);
        }
        getContentLayer() {
            return document.getElementById(`grid-content-layer__${this._id}`);
        }
        getFindContainer() {
            return document.getElementById(`searcharea__${this._id}`);
        }
        getFindView() {
            return this._findView;
        }
    }
    exports.default = SwimLaneChartView;
});
