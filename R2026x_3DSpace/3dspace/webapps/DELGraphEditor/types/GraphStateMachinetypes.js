define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GuardParams = exports.GraphStates = exports.GraphEvents = void 0;
    var GraphEvents;
    (function (GraphEvents) {
        // pointer events
        GraphEvents["POINTER_OVER"] = "POINTER_OVER";
        GraphEvents["POINTER_OUT"] = "POINTER_OUT";
        GraphEvents["POINTER_UP"] = "POINTER_UP";
        GraphEvents["POINTER_MOVE"] = "POINTER_MOVE";
        GraphEvents["POINTER_MOVE_OVER_OBSTACLE"] = "POINTER_MOVE_OVER_OBSTACLE";
        GraphEvents["POINTER_LEFT_DOWN"] = "POINTER_LEFT_DOWN";
        GraphEvents["POINTER_WHEEL"] = "POINTER_WHEEL";
        GraphEvents["POINTER_DBL_CLICK"] = "POINTER_DBL_CLICK";
        GraphEvents["POINTER_DBL_CLICK_EMPTY_TARGET"] = "POINTER_DBL_CLICK_EMPTY_TARGET";
        GraphEvents["POINTER_DBL_CLICK_ON_EMPTY_SPACE"] = "POINTER_DBL_CLICK_ON_EMPTY_SPACE";
        GraphEvents["POINTER_DBL_CLICK_ON_OCCUPIED_SPACE"] = "POINTER_DBL_CLICK_ON_OCCUPIED_SPACE";
        GraphEvents["SELECT_LASSO_TOOL"] = "SELECT_LASSO_TOOL";
        GraphEvents["SELECT_SPACING_TOOL"] = "SELECT_SPACING_TOOL";
        GraphEvents["SELECT_TOOLBAR_ELT"] = "SELECT_TOOLBAR_ELT";
        // keyboard events (keyDown)
        GraphEvents["PRESS_KEY"] = "PRESS_KEY";
        GraphEvents["MOVE_WITH_ARROWS_KEYS"] = "MOVE_WITH_ARROWS_KEYS";
        GraphEvents["DELETE"] = "press delete";
        GraphEvents["CANCEL_ONGOING_ACTION"] = "CANCEL_ONGOING_ACTION";
        GraphEvents["VALIDATE"] = "VALIDATE";
        GraphEvents["CREATE_LINK"] = "CREATE_LINK";
        GraphEvents["EXPORT_TO_JSON"] = "EXPORT_TO_JSON";
        GraphEvents["COPY_AS_IMAGE"] = "COPY_AS_IMAGE";
        GraphEvents["OPEN_FILE"] = "OPEN_FILE";
        GraphEvents["GENERATE_FAKE_GRAPH"] = "GENERATE_FAKE_GRAPH";
        GraphEvents["EXPORT_TO_IMAGE"] = "EXPORT_TO_IMAGE";
        GraphEvents["SELECT_ALL"] = "SELECT_ALL";
        GraphEvents["COPY_ELT"] = "COPY_ELT";
        GraphEvents["CUT_ELT"] = "CUT_ELT";
        GraphEvents["PASTE_ELT"] = "PASTE_ELT";
        GraphEvents["CHANGE_SELECTION_TOOL"] = "CHANGE_SELECTION_TOOL";
        GraphEvents["SHOW_QUAD_TREE"] = "QUAD_QUAD_TREE";
        GraphEvents["HIDE_QUAD_TREE"] = "Hide_QUAD_TREE";
        // custom events
        GraphEvents["UPDATE_TYPE"] = "UPDATE_NODE_TYPE";
        GraphEvents["UPDATE_COLOR"] = "UPDATE_NODE_COLOR";
        // PINCH events (for pinch to zoom in and out)
        GraphEvents["PINCH_START"] = "PINCH_START";
        GraphEvents["PINCH"] = "PINCH";
        GraphEvents["PINCH_END"] = "PINCH_END";
        // drag and drop files events
        GraphEvents["FILE_DRAG_ENTER"] = "drag enter";
        GraphEvents["FILE_DRAG_OVER"] = "drag over";
        GraphEvents["FILE_DROP"] = "drop file";
        GraphEvents["FILE_DRAG_LEAVE"] = "drag leave";
        // layouting
        GraphEvents["FIT_TO_WINDOW"] = "Fit to window";
        GraphEvents["AUTO_LAYOUT"] = "Auto layout";
        // simulation
        GraphEvents["ENABLE_SIMULATION"] = "Enable the simulation mode";
        GraphEvents["PLAY_SIMULATION"] = "Play/Start the simulation";
        GraphEvents["PAUSE_SIMULATION"] = "Pause the simulation";
        GraphEvents["DISABLE_SIMULATION"] = "Disable the simulation mode";
    })(GraphEvents || (exports.GraphEvents = GraphEvents = {}));
    var GraphStates;
    (function (GraphStates) {
        GraphStates["IDLE"] = "IDLE";
        GraphStates["LASSO_TOOL_IDLE"] = "LASSO_TOOL_IDLE";
        GraphStates["SPACING_TOOL_IDLE"] = "SPACING_TOOL_IDLE";
        GraphStates["AUTHORING_GRAPH_ELT"] = "AUTHORING_GRAPH_ELT";
        // mouse over
        // SET_CURSOR_
        // mouse down
        GraphStates["PAN_GRAPH_ELT"] = "PAN_GRAPH_ELT";
        GraphStates["PINCH_GRAPH_ELT"] = "PAN_GRAPH_ELT";
        GraphStates["PRE_DRAG_CONNECTOR"] = " PRE_DRAG_CONNECTOR";
        GraphStates["PRE_DRAG_GRAPH_ELT"] = "PRE_DRAG_GRAPH_ELT";
        GraphStates["SELECT_TOOLBAR_ELT"] = "SELECT_TOOLBAR_ELT";
        GraphStates["PRE_SELECT_GRAPH_ELT"] = "PRE_SELECT_GRAPH_ELT";
        GraphStates["PRE_SHIFT_GRAPH_ELT"] = "PRE_SHIFT_GRAPH_ELT";
        GraphStates["PRE_ELT_CREATE"] = "PRE_ELT_CREATE";
        GraphStates["PRE_ELT_CREATE_DRAG"] = "PRE_ELT_CREATE_DRAG";
        GraphStates["PRE_DRAG_LABEL"] = "PRE_DRAG_LABEL";
        GraphStates["DRAG_SELECTIONBAR_GRAPH_ELT"] = "DRAG_SELECTIONBAR_GRAPH_ELT";
        // mouse move
        GraphStates["DRAG_CONNECTOR"] = " DRAG_CONNECTOR";
        GraphStates["RESIZE_GRAPH_ELT"] = "RESIZE_GRAPH_ELT";
        GraphStates["DRAG_GRAPH_ELT"] = "DRAG_GRAPH_ELT";
        GraphStates["UNAUTHORIZED_DRAG_GRAPH_ELT"] = "UNAUTHORIZED_DRAG_GRAPH_ELT";
        GraphStates["SELECT_GRAPH_ELT"] = "SELECT_GRAPH_ELT";
        GraphStates["SHIFT_GRAPH_ELT"] = "SHIFT_GRAPH_ELT";
        GraphStates["LOCKED_SHIFT_GRAPH_ELT"] = "LOCKED_SHIFT_GRAPH_ELT";
        GraphStates["DRAG_TOOLBAR_ELT"] = "DRAG_TOOLBAR_ELT";
        GraphStates["PAN"] = "pan";
        GraphStates["SELECT_WITH_LASSO_TOOL"] = "SELECT_WITH_LASSO_TOOL";
        GraphStates["PRE_SIBLING_NODE_PREVIEW"] = "PRE_SIBLING_NODE_PREVIEW";
        GraphStates["SIBLING_NODE_PREVIEW"] = "Show a preview for the precreated sibling node";
        GraphStates["SIBLING_NODE_PREVIEW_DRAG_MODE"] = "SIBLING_NODE_PREVIEW_DRAG_MODE";
        GraphStates["DRAG_LABEL"] = "DRAG_LABEL";
        // mouse up
        GraphStates["WHEEL_GRAPH_ELT"] = "WHEEL_GRAPH_ELT";
        GraphStates["END_SELECT_GRAPH_ELT"] = "validate selection with lasso tool";
        GraphStates["STOP_SHIFT_GRAPH_ELT"] = "stop shifting";
        GraphStates["DROP_TOOLBAR_ELT"] = "drop toolbar element";
        // wheel
        GraphStates["ZOOM"] = "zoom";
        GraphStates["NAVIGATE"] = "navigate";
        // simulation mode
        GraphStates["SIMULATION_STATE_IDLE"] = "Simulation Idle state";
        GraphStates["SIMULATION_STATE_PLAY"] = "Simulation Play state";
        GraphStates["SIMULATION_STATE_PAUSE"] = "Simulation Pause State";
    })(GraphStates || (exports.GraphStates = GraphStates = {}));
    var GuardParams;
    (function (GuardParams) {
        GuardParams["EVENT_TARGET"] = "EVENT_TARGET";
        GuardParams["EVENT_TARGET_TYPE"] = "EVENT_TARGET_TYPE";
        GuardParams["EVENT_TARGET_PROPS"] = "EVENT_TARGET_PROPS";
    })(GuardParams || (exports.GuardParams = GuardParams = {}));
});
