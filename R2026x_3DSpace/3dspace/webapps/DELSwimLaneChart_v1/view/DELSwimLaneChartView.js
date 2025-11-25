/// <amd-module name="DS/DELSwimLaneChart_v1/view/DELSwimLaneChartView"/>
define("DS/DELSwimLaneChart_v1/view/DELSwimLaneChartView", ["require", "exports", "DS/DELSwimLaneChart_v1/model/SwimLaneChartColumn", "DS/DELSwimLaneChart_v1/model/SwimLaneChartGroup", "DS/DELSwimLaneChart_v1/model/SwimLaneChartNode", "DS/DELSwimLaneChart_v1/utils/StaticAttributes", "DS/DELSwimLaneChart_v1/view/DELSwimLaneChartComponents", "DS/Controls/Find", "i18n!DS/DELSwimLaneChart_v1/assets/nls/view"], function (require, exports, SwimLaneChartColumn_1, SwimLaneChartGroup_1, SwimLaneChartNode_1, StaticAttributes_1, DELSwimLaneChartComponents_1, WUXFind, I18n) {
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
                        const columnHeaderElement = (0, DELSwimLaneChartComponents_1.columnHeaderElt)(column);
                        const columnSeparatorElement = (0, DELSwimLaneChartComponents_1.columnSeparatorElt)(column);
                        if (columnHeaderElement && columnHeaderLayer)
                            columnHeaderLayer.appendChild(columnHeaderElement);
                        if (columnSeparatorElement && columnLayer)
                            columnLayer.appendChild(columnSeparatorElement);
                    }
                    break;
                case "update":
                    {
                        (0, DELSwimLaneChartComponents_1.columnHeaderElt)(column);
                        (0, DELSwimLaneChartComponents_1.columnSeparatorElt)(column);
                    }
                    break;
                case "delete":
                    {
                        const columnHeaderElement = document.getElementById("columnHeader__" + column.id);
                        const columnSeparatorElement = document.getElementById("columnSeparatorGroup__" + column.id);
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
                            const headerGroup = document.getElementById("nodeHeaderGroup__" + node.id);
                            const headerGroupClone = document.getElementById("nodeHeaderGroup__" + node.id + "_clone");
                            if (headerGroup && headerGroupClone) {
                                headerGroupClone.innerHTML = headerGroup.innerHTML;
                                if (headerGroupClone.children.length > 0) {
                                    for (let i = 0; i < headerGroupClone.children.length; i++) {
                                        headerGroupClone.children[i].id = headerGroupClone.children[i].id + "_clone";
                                    }
                                }
                            }
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
                            const headerGroup = document.getElementById("nodeHeaderGroup__" + node.id);
                            if (!headerGroup)
                                break;
                            let headerClone = document.getElementById("nodeHeaderGroup__" + node.id + "_clone");
                            if (!headerClone) {
                                headerClone = document.createElementNS(StaticAttributes_1.nameSpace, "g");
                                headerClone.setAttribute("id", "nodeHeaderGroup__" + node.id + "_clone");
                                topLayer === null || topLayer === void 0 ? void 0 : topLayer.appendChild(headerClone);
                                headerClone.innerHTML = headerGroup.innerHTML;
                                if (headerClone.children.length > 0) {
                                    for (let i = 0; i < headerClone.children.length; i++) {
                                        headerClone.children[i].id = headerClone.children[i].id + "_clone";
                                    }
                                }
                            }
                            if (node.header.topOffset > 0) {
                                headerClone.style.transform = `translate(${node.position.x}px,${node.position.y + node.header.topOffset}px)`;
                            }
                            else {
                                topLayer === null || topLayer === void 0 ? void 0 : topLayer.removeChild(headerClone);
                            }
                        }
                    }
                    break;
                case "delete":
                    {
                        const nodeToDelete = document.getElementById("node__" + node.id);
                        if (nodeToDelete && nodesLinksLayer)
                            nodesLinksLayer.removeChild(nodeToDelete);
                        const headerClone = document.getElementById("nodeHeaderGroup__" + node.id + "_clone");
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
                    if (groupDelimitersElt && groupsLayer)
                        groupsLayer.removeChild(groupDelimitersElt);
                    break;
            }
        }
        updateGridHeight(newHeight) {
            var _a, _b, _c, _d;
            const svgContainer = this.getGridContainer();
            const parentHeight = (_b = (_a = this.getParentContainer()) === null || _a === void 0 ? void 0 : _a.clientHeight) !== null && _b !== void 0 ? _b : 0;
            const stickyLayerHeight = (_d = (_c = this.getStickyContainer()) === null || _c === void 0 ? void 0 : _c.clientHeight) !== null && _d !== void 0 ? _d : 0;
            if (svgContainer) {
                const occupiedHeight = Math.max(Math.min(parentHeight - stickyLayerHeight, svgContainer === null || svgContainer === void 0 ? void 0 : svgContainer.clientHeight), newHeight);
                svgContainer.style.height = occupiedHeight + "px";
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
            var _a, _b, _c, _d, _e, _f;
            // adjust the header text
            const headerTextElement = (_a = document.getElementById("nodeHeaderText__" + node.id)) === null || _a === void 0 ? void 0 : _a.firstChild;
            if (headerTextElement) {
                const headerLeftIconLeft = StaticAttributes_1.margin;
                const headerTitleLeft = ((_b = node.header) === null || _b === void 0 ? void 0 : _b.leftIcon) ? StaticAttributes_1.imgSize + StaticAttributes_1.margin + headerLeftIconLeft : StaticAttributes_1.margin;
                const headerTitleWidth = ((_c = node.header) === null || _c === void 0 ? void 0 : _c.rightIcon) ? node.width - headerTitleLeft - StaticAttributes_1.imgSize - 2 * StaticAttributes_1.margin : node.width - headerTitleLeft - StaticAttributes_1.margin;
                headerTextElement.style.width = "auto";
                headerTextElement.style.height = StaticAttributes_1.header_height + "px";
                let fontSize = 12;
                headerTextElement.style.fontSize = fontSize + "px";
                while (headerTextElement.offsetWidth >= headerTitleWidth && fontSize >= 4) {
                    fontSize -= 0.5;
                    headerTextElement.style.fontSize = fontSize + "px";
                }
                if (node.header)
                    node.header.fontSize = fontSize;
                headerTextElement.style.width = "100%";
            }
            // adjust the content text
            const contenTextElement = ((_d = node.content) === null || _d === void 0 ? void 0 : _d.childElement) ? (_e = document.getElementById("foreignNode__" + node.id)) === null || _e === void 0 ? void 0 : _e.firstChild : (_f = document.getElementById("bodyTextContent__" + node.id)) === null || _f === void 0 ? void 0 : _f.firstChild;
            if (contenTextElement) {
                contenTextElement.classList.remove("chidlElement");
                const topOffset = node.header ? StaticAttributes_1.header_height + 2 * StaticAttributes_1.margin : 2 * StaticAttributes_1.margin;
                let fontSize = 14;
                const heightTreshold = node.type === "CompositeNode" ? node.bodyHeight - topOffset : node.height - topOffset;
                contenTextElement.style.fontSize = fontSize + "px"; // todo: to optimize
                while (contenTextElement.clientHeight > heightTreshold && fontSize >= 6) {
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
            if (gridContainer && parentContainer && (gridContainer.clientHeight + StaticAttributes_1.grid_yOffset) > parentContainer.offsetHeight)
                return true;
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
