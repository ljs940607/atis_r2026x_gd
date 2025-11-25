/// <amd-module name="DS/DELGraphEditor/components/ContextToolbar"/>
define("DS/DELGraphEditor/components/ContextToolbar", ["require", "exports", "DS/Tweakers/GeneratedToolbar", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, WUXGeneratedToolbar, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContextToolBar = void 0;
    class ContextToolBar extends HTMLElement {
        static get observedAttributes() {
            return ['elementtype', 'elementcolor', 'isvisible', 'x_position', 'y_position', 'x_offset', 'y_offset', "transmatrix", "typesmenu"];
        }
        constructor() {
            super();
            // model definition
            this._firstRowModel = {
                entries: [
                    {
                        id: "link",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Link",
                            visibleFlag: true,
                            icon: {
                                // iconPath: "../DELGraphEditor/assets/icons/link_two.png",
                                // iconPath:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpCNEZERDA3QkYyNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNzhGNEE1NjhDMzUxMUUyOEI5NTk3NzM2M0U0RUU1QSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNzhGNEE1NThDMzUxMUUyOEI5NTk3NzM2M0U0RUU1QSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRjExNkI5QUZCNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNEZERDA3QkYyNzZFMjExOTJENUUyNUNDNTMzMjQ5NiIvPiA8L3JkZjpEZXNjcmlwdGlv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",
                                // iconName:"level-down",
                                iconName: "up-right",
                                fontIconFamily: 1,
                            },
                            // value: (options: any) => this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "1"
                        }
                    },
                    {
                        id: "color",
                        dataElements: {
                            typeRepresentation: "functionMenuIcon",
                            label: "Edit Node color",
                            icon: {
                                iconName: "palette",
                                fontIconFamily: 1
                            },
                            // drop down menu
                            value: { menu: [] },
                            position: "near",
                            category: "1"
                        }
                    }
                ]
            };
            this._secondRowModel = {
                entries: [
                    {
                        id: "delete",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Delete",
                            icon: {
                                iconName: "trash",
                                fontIconFamily: 1
                            },
                            value: (options) => { var _a; return this.onClick((_a = options === null || options === void 0 ? void 0 : options.context.nodeModel) === null || _a === void 0 ? void 0 : _a.options.label); },
                            position: "near",
                            category: "1"
                        }
                    },
                    {
                        id: "editType",
                        dataElements: {
                            typeRepresentation: "functionMenuIcon",
                            label: "Edit Node type",
                            icon: {
                                iconName: "cog",
                                fontIconFamily: 1
                            },
                            // drop down menu
                            value: { menu: [] },
                            position: "near",
                            category: "1"
                        },
                    }
                ]
            };
            // component instanciation
            this._firstRowParams = new WUXGeneratedToolbar({
                overflowManagement: "scroll",
                direction: 'horizontal',
                items: WUXGeneratedToolbar.prototype.createTreeDocument(this._firstRowModel),
                // touchMode: false
            });
            this._secondRowParams = new WUXGeneratedToolbar({
                overflowManagement: "scroll",
                direction: 'horizontal',
                items: WUXGeneratedToolbar.prototype.createTreeDocument(this._secondRowModel)
            });
        }
        connectedCallback() {
            this.render();
            this.attachEventsListener();
        }
        attributeChangedCallback(name, oldVal, newVal) {
            var _a;
            const divWrapper = this.querySelector(".toolbarWrapper");
            if (name === "isvisible") { // visibility
                const isVisibleFlag = this.getAttribute("isvisible");
                if (divWrapper)
                    divWrapper.style.visibility = isVisibleFlag ? isVisibleFlag : "hidden";
                // condition
                this.hidePopUpMenus();
            }
            if (name === "x_position" || name === "y_position" || name === "transmatrix" || name === "x_offset" || name === "y_offset") { // position, transformation updated
                const x_offset = Number(this.getAttribute("x_offset"));
                const y_offset = Number(this.getAttribute("y_offset"));
                const x_position = Number(this.getAttribute("x_position"));
                const y_position = Number(this.getAttribute("y_position"));
                const transVector = this.getAttribute("transmatrix");
                const [translateX, translateY, scale] = transVector ? JSON.parse(transVector) : [0, 0, 1];
                // update divWrapper styles
                if (divWrapper) {
                    divWrapper.style.left = x_offset + (x_position + StaticAttributes_1.gridStep / 2) * scale + translateX + "px";
                    divWrapper.style.top = y_offset + y_position * scale + translateY + "px";
                    divWrapper.style.transform = `translate(${2 * StaticAttributes_1.gridStep / (100 * scale)}px, -50%)`;
                }
            }
            // content changed
            if ((name === "elementtype") && oldVal !== newVal) {
                let elementtype = this.getAttribute("elementtype");
                let typesMenu = ((_a = this.getAttribute("typesmenu")) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
                if (elementtype && typesMenu.length > 0) {
                    let typesMenuModel = this.generateTypesMenuFromList(elementtype, typesMenu);
                    this._secondRowParams.prepareUpdateView();
                    // update link visibility
                    this._firstRowParams.updateNodeModel("link", {
                        visibleFlag: StaticAttributes_1.nodeTypes.includes(elementtype)
                    });
                    this._secondRowParams.updateNodeModel("editType", {
                        grid: {
                            data: { menu: typesMenuModel }
                        }
                    });
                    this._secondRowParams.pushUpdateView();
                }
            }
            if ((name === "elementcolor") && oldVal !== newVal) {
                const elementcolor = this.getAttribute("elementcolor");
                const elementtype = this.getAttribute("elementtype");
                if (elementcolor && elementtype) {
                    const colorsMenuModel = StaticAttributes_1.linkTypes.includes(elementtype) ? this.generateColorsMenuFromList(elementcolor, ["grey", "red", "blue", "green", "yellow"]) : this.generateColorsMenuFromList(elementcolor, ["white", "red", "blue", "green", "yellow"]);
                    this._firstRowParams.prepareUpdateView();
                    this._firstRowParams.updateNodeModel("color", {
                        grid: {
                            data: { menu: colorsMenuModel }
                        }
                    });
                    this._firstRowParams.pushUpdateView();
                }
            }
        }
        disconnectedCallback() {
            this.removeEventsListener();
        }
        render() {
            const wrapperDiv = document.createElement("div");
            wrapperDiv.setAttribute("class", "toolbarWrapper");
            wrapperDiv.setAttribute("id", "draggableArea_0");
            const draggableArea = document.createElement("div");
            draggableArea.setAttribute("class", "draggableArea");
            draggableArea.setAttribute("id", "draggableArea_1");
            this._secondRowParams.inject(wrapperDiv);
            this._firstRowParams.inject(wrapperDiv);
            wrapperDiv.appendChild(draggableArea);
            this.appendChild(wrapperDiv);
        }
        onClick(attributeName, data) {
            this.dispatchEvent(new CustomEvent("toolbarItemSelected", {
                bubbles: true,
                composed: true, // useful for components with attached ShadowRoot
                detail: { attributeName, actionTarget: attributeName, actionData: data || "" },
            }));
            this.hidePopUpMenus();
        }
        attachEventsListener() {
            this.addEventListener("pointerdown", (e) => {
                var _a;
                e.preventDefault(); // prevent the default behavior of generatedtoolbar on click
                if (e.target.classList.contains("wux-controls-toolbar-nearContainer") || e.target.classList.contains("wux-button-icon-placeholder") || e.target.classList.contains("arrow-icon"))
                    e.stopPropagation();
                const targetElt = (_a = e.composedPath()[1].childNodes[1]) === null || _a === void 0 ? void 0 : _a.textContent;
                if (targetElt && (targetElt === "Link")) {
                    this.onClick(targetElt);
                    if (targetElt === "Link" && e.target) {
                        if (e.target.classList.contains("activeIcon"))
                            e.target.classList.remove("activeIcon");
                        else
                            e.target.classList.add("activeIcon");
                    }
                }
            });
            this.addEventListener("click", (e) => {
                e.stopPropagation();
            });
            this.addEventListener("pointerup", (e) => {
                if (e.target.classList.contains("wux-controls-toolbar-nearContainer") || e.target.classList.contains("arrow-icon"))
                    e.stopPropagation();
            });
        }
        removeEventsListener() {
            this.removeEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); });
            this.removeEventListener("touchstart", (e) => { });
        }
        // utils function 
        generateTypesMenuFromList(selectedType, typesList) {
            let typesMenuEntries = [];
            typesList.forEach((attribute) => typesMenuEntries.push({
                type: "CheckItem",
                title: attribute,
                tooltip: {
                    title: attribute,
                    // shortHelp: "Help Menu"
                },
                state: attribute === selectedType ? "selected" : "unselected",
                action: {
                    callback: () => this.onClick("editType", attribute)
                }
            }));
            return typesMenuEntries;
        }
        generateColorsMenuFromList(selectedColor, colorsList) {
            let typesMenuEntries = [];
            colorsList.forEach((attribute) => typesMenuEntries.push({
                type: "CheckItem",
                title: attribute,
                icon: {
                    iconPath: `../DELGraphEditor/assets/icons/colors/${attribute}.svg`,
                    fontIconFamily: 1
                },
                tooltip: {
                    title: attribute,
                    // shortHelp: "Help Menu"
                },
                state: attribute === selectedColor ? "selected" : "unselected",
                action: {
                    callback: () => this.onClick("editColor", attribute)
                }
            }));
            return typesMenuEntries;
        }
        hidePopUpMenus() {
            const colorPopUpMenu = document.querySelector(".wux-controls-popup");
            if (colorPopUpMenu)
                colorPopUpMenu.remove();
            const typesMenu = document.querySelector(".wux-menu-mouse");
            if (typesMenu)
                typesMenu.remove();
        }
    }
    exports.ContextToolBar = ContextToolBar;
});
