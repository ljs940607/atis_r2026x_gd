/// <amd-module name="DS/DELGraphEditor/components/AuthoringSideToolbar"/>
define("DS/DELGraphEditor/components/AuthoringSideToolbar", ["require", "exports", "DS/Tweakers/GeneratedToolbar"], function (require, exports, WUXGeneratedToolbar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthoringSideToolBar = void 0;
    class AuthoringSideToolBar extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.render();
            this.attachEventsListener();
        }
        disconnectedCallback() {
            this.removeEventsListener();
        }
        render() {
            // model definition
            const model = {
                entries: [
                    {
                        id: "spacingTool",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Spacing Tool",
                            icon: {
                                // iconPath: "../DELGraphEditor/assets/icons/link_two.png",
                                iconName: "up-down-reduced",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "1"
                        }
                    },
                    {
                        id: "lassoTool",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Lasso Tool",
                            icon: {
                                iconName: "multiselect",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "1"
                        }
                    },
                    {
                        id: "initialMarker",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Initial",
                            icon: {
                                iconName: "radiobutton-off",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "2"
                        }
                    },
                    {
                        id: "finalMarker",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Final",
                            icon: {
                                iconName: "radiobutton-on",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "2"
                        }
                    },
                    {
                        id: "choice",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Choice",
                            icon: {
                                iconName: "object-instance",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "2"
                        }
                    },
                    {
                        id: "node",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Node",
                            icon: {
                                iconName: "checkbox-off",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "2"
                        }
                    },
                    {
                        id: "GroupNode",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "GroupNode",
                            icon: {
                                iconName: "view-embedded",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "2"
                        }
                    },
                    {
                        id: "note",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Note",
                            icon: {
                                iconName: "text-note",
                                fontIconFamily: 1
                            },
                            disabled: true,
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "2"
                        }
                    },
                    {
                        id: "autoLayout",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Auto Layout",
                            icon: {
                                iconName: "tree-view-all",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "3"
                        }
                    },
                    {
                        id: "fitWindow",
                        dataElements: {
                            typeRepresentation: "functionIcon",
                            label: "Fit to Window",
                            icon: {
                                iconName: "group",
                                fontIconFamily: 1
                            },
                            // value:(options:any)=>this.onClick(options?.context.nodeModel?.options.label),
                            position: "near",
                            category: "3"
                        }
                    }
                ]
            };
            const toolbarTreeDocument = WUXGeneratedToolbar.prototype.createTreeDocument(model);
            const generatedToolbar = new WUXGeneratedToolbar({
                overflowManagement: "scroll",
                direction: "vertical",
                items: toolbarTreeDocument
            });
            // inject into DOM
            const wrapperDiv = document.createElement("div");
            wrapperDiv.setAttribute("class", "toolbarWrapper");
            wrapperDiv.setAttribute("id", "bartest");
            generatedToolbar.inject(wrapperDiv);
            this.appendChild(wrapperDiv);
        }
        onClick(attributeName, element) {
            this.dispatchEvent(new CustomEvent("toolbarItemSelected", {
                bubbles: true,
                composed: true, // useful for components with attached ShadowRoot
                detail: { actionTarget: attributeName },
            }));
            const activeIcon = document.querySelector(".activeIcon");
            activeIcon === null || activeIcon === void 0 ? void 0 : activeIcon.classList.remove("activeIcon");
            if (!["Fit to Window", "Auto Layout"].includes(attributeName))
                element.classList.add("activeIcon");
        }
        attachEventsListener() {
            this.addEventListener("pointerdown", (e) => {
                var _a;
                e.preventDefault();
                e.stopPropagation();
                // to have the feeling of dragging from toolbar (if we comment this section we need to uncomment the value:this.click())
                const targetElt = (_a = e.composedPath()[1].childNodes[1]) === null || _a === void 0 ? void 0 : _a.textContent;
                if (!targetElt)
                    return;
                this.onClick(targetElt, e.target);
            });
            this.addEventListener("click", (e) => {
                e.stopPropagation();
            });
            this.addEventListener("pointerup", (e) => {
                e.stopPropagation();
            });
            this.addEventListener("touchstart", (e) => {
                e.stopPropagation();
            });
        }
        removeEventsListener() {
            this.removeEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); });
            this.removeEventListener("pointerup", (e) => { e.preventDefault(); e.stopPropagation(); });
        }
    }
    exports.AuthoringSideToolBar = AuthoringSideToolBar;
});
