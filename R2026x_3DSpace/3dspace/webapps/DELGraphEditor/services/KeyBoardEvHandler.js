/// <amd-module name="DS/DELGraphEditor/services/KeyBoardEvHandler"/>
define("DS/DELGraphEditor/services/KeyBoardEvHandler", ["require", "exports", "../types/GraphStateMachinetypes"], function (require, exports, GraphStateMachinetypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KeyBoardEvHandler = void 0;
    class KeyBoardEvHandler {
        constructor(graphStateMachine) {
            this._graphStateMachine = graphStateMachine;
        }
        onKeyDown(e) {
            // press ESCAPE to cancel current action
            if (e.key === "Escape") {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, e);
                return;
            }
            // pressa key to enable authoring mode
            if (!["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "Enter", "Shift", "Alt", "Control", "Delete", "Backspace", "Escape"].includes(e.key) && !e.ctrlKey) {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.PRESS_KEY, e);
                return;
            }
            // press ENTER to disable the authoring mode
            if (e.key === "Enter" && !e.shiftKey) {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.VALIDATE, e);
                return;
            }
            // press DELETE key to remove a node/link, && objectType !== "input" > not authoring mode
            if ((e.key === "Delete" || e.key === "Backspace")) {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.DELETE, e);
                return;
            }
            // press keyboard arrows keys
            if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)) {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.MOVE_WITH_ARROWS_KEYS, e);
                return;
            }
            // press ctrl+S to save/export the graph to JSON format
            if ((e.key === "s" || e.key === "S") && e.ctrlKey) {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.EXPORT_TO_JSON, e);
                return;
            }
            /**  quadTree temporary actions (for debug purposes) **/
            if ((e.key === "q" || e.key === "Q") && e.ctrlKey) {
                e.preventDefault();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.SHOW_QUAD_TREE, e);
                return;
            }
            if ((e.key === "j" || e.key === "J") && e.ctrlKey) {
                e.preventDefault();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.HIDE_QUAD_TREE, e);
                return;
            }
            // press ctrl+G to generate multiple nodes for test purposes
            if ((e.key === "g" || e.key === "G") && e.ctrlKey) {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.GENERATE_FAKE_GRAPH, e);
                return;
            }
            // press ctrl+D to export the graph to svg image
            if ((e.key === "d" || e.key === "D") && e.ctrlKey) {
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.EXPORT_TO_IMAGE, e);
                return;
            }
            // press ctrl+A to selectALL
            if ((e.key === "a" || e.key === "A") && e.ctrlKey) {
                e.preventDefault();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.SELECT_ALL, e);
                return;
            }
            // press ctrl+C to copy a node/group
            if ((e.key === "c" || e.key === "C") && e.ctrlKey) {
                e.preventDefault();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.COPY_ELT, e);
                return;
            }
            // press ctrl+X to cut a node/group
            if ((e.key === "x" || e.key === "X") && e.ctrlKey) {
                e.preventDefault();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.CUT_ELT, e);
                return;
            }
            // press ctrl+V to paste a node/group
            if ((e.key === "v" || e.key === "V") && e.ctrlKey) {
                e.preventDefault();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.PASTE_ELT, e);
                return;
            }
            // press ctrl+shit+p to export the graph to svg image
            if ((e.key === "p" || e.key === "P") && e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.COPY_AS_IMAGE, e);
                return;
            }
            // press ctrl+V to change the selection tool
            // if ((e.key === "h" || e.key === "H")) {
            //     this._graphStateMachine.fireEvent(GraphEvents.CHANGE_SELECTION_TOOL, e);
            //     return;
            // }
            // press ctrl+O to open a new file
            if ((e.key === "o" || e.key === "O") && e.ctrlKey) {
                e.preventDefault();
                // open a .json file from the file browser pop-up
                const fileBrowser = document.createElement("input");
                if (fileBrowser) {
                    fileBrowser.setAttribute("type", "file");
                    fileBrowser.setAttribute("accept", ".json");
                    fileBrowser.click();
                    fileBrowser.addEventListener('change', (event) => {
                        var _a, _b;
                        if (((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) > 0)
                            this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.OPEN_FILE, event.target.files[0]);
                    });
                    return;
                }
            }
        }
    }
    exports.KeyBoardEvHandler = KeyBoardEvHandler;
});
