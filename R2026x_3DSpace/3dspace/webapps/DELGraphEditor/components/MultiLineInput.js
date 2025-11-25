/// <amd-module name="DS/DELGraphEditor/components/MultiLineInput"/>
define("DS/DELGraphEditor/components/MultiLineInput", ["require", "exports", "DS/DELGraphEditor/utils/StaticAttributes", "DS/DELGraphEditor/utils/TextComputations"], function (require, exports, StaticAttributes_1, TextComputations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MultiLineInput = void 0;
    class MultiLineInput extends HTMLElement {
        static get observedAttributes() {
            return ['visibility', 'label', 'editmode']; // rerender on label updates
        }
        constructor() {
            super();
        }
        connectedCallback() {
            this.render();
        }
        attributeChangedCallback(name, oldVal, newVal) {
            if (newVal && oldVal && newVal !== oldVal) {
                this.render();
            }
        }
        render() {
            var _a;
            // get the passed props
            const id = this.getAttribute("id");
            const visibility = this.getAttribute("visibility");
            const label = (_a = this.getAttribute("label")) === null || _a === void 0 ? void 0 : _a.trim();
            const editmode = this.getAttribute("editmode") ? this.getAttribute("editmode") === "true" : false;
            if (id && visibility && (typeof label !== "undefined") && (typeof editmode == "boolean")) {
                const editableDiv = document.createElement("div");
                editableDiv.setAttribute("id", `parentDIV${id}`);
                editableDiv.setAttribute("contenteditable", `${editmode}`);
                editableDiv.setAttribute("data-pl", "Enter a label...");
                editableDiv.setAttribute("style", `visibility:${visibility}`);
                editableDiv.classList.add((editmode) ? "editableInput" : "readOnlyInput");
                if (!label && !editmode) {
                    editableDiv.innerHTML = "Enter a label...";
                    editableDiv.style.color = "grey";
                    // editableDiv.setAttribute("style", `opacity:0.5`); // strangely the opacity is not working
                }
                else {
                    editableDiv.innerHTML = (0, TextComputations_1.encodeTextInput)(label);
                    if (!label) {
                        if (!StaticAttributes_1.isMobileDevice) {
                            editableDiv.style.position = "absolute";
                            editableDiv.style.top = "calc(50%)";
                            editableDiv.style.left = "calc(50%)";
                            editableDiv.style.transform = "translate(-50%, -50%)";
                        }
                    }
                }
                this.appendChild(editableDiv);
                if (editmode)
                    this.autoSelectAll();
            }
        }
        autoSelectAll() {
            const id = this.getAttribute("id");
            const parentDiv = document.getElementById(`parentDIV${id}`);
            if (parentDiv) {
                parentDiv.focus();
                // if(isMobileDevice) parentDiv.scrollIntoView();
                parentDiv.spellcheck = false;
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(parentDiv);
                if (selection && range.intersectsNode(parentDiv)) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                    // range.collapse(false)
                }
            }
        }
    }
    exports.MultiLineInput = MultiLineInput;
});
