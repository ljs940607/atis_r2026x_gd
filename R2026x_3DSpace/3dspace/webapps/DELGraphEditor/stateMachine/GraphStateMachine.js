/// <amd-module name="DS/DELGraphEditor/stateMachine/GraphStateMachine"/>
define("DS/DELGraphEditor/stateMachine/GraphStateMachine", ["require", "exports", "DS/DELGraphEditor/types/DELGraphEditortypes", "../types/GraphStateMachinetypes", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, DELGraphEditortypes_1, GraphStateMachinetypes_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphStateMachine = void 0;
    class GraphStateMachine {
        constructor(editorMode, graphController, graphControllerSimulationMode) {
            // declarative model
            this._graphStateMachine = {
                initState: GraphStateMachinetypes_1.GraphStates.IDLE,
                states: [
                    {
                        state: GraphStateMachinetypes_1.GraphStates.IDLE,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OVER, actions: [{ action: (e) => this.graphController.handleHoverAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OUT, actions: [{ action: (e) => this.graphController.handleOutAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_ALL, actions: [{ action: (e) => { e.preventDefault(); this.graphController.selectAll(); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.GENERATE_FAKE_GRAPH, actions: [{ action: (e) => this.graphController.generateMultipleNodes(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.COPY_ELT, actions: [{ action: (e) => this.graphController.copyGraphElement() }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CUT_ELT, actions: [{ action: (e) => this.graphController.cutGraphElement() }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PASTE_ELT, actions: [{ action: (e) => this.graphController.pasteGraphElement() }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.DELETE, actions: [{ action: (e) => { e.preventDefault(); this.graphController.deleteGraphElt(); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.UPDATE_TYPE, actions: [{ action: (e) => this.graphController.updateGraphEltType(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.UPDATE_COLOR, actions: [{ action: (e) => this.graphController.updateGraphEltColor(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.MOVE_WITH_ARROWS_KEYS, actions: [{ action: (e) => this.graphController.translateGraphElements(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.EXPORT_TO_JSON, actions: [{ action: (e) => { e.preventDefault(); this.graphController.exportToJson(); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.EXPORT_TO_IMAGE, actions: [{ action: (e) => { e.preventDefault(); this.graphController.exportToImage(); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.COPY_AS_IMAGE, actions: [{ action: (e) => { e.preventDefault(); this.graphController.copyAsImage(); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.OPEN_FILE, actions: [{ action: (e) => this.graphController.openFile(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.FIT_TO_WINDOW, actions: [{ action: (e) => this.graphController.fitToWindow() }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.AUTO_LAYOUT, actions: [{ action: (e) => this.graphController.autoLayout() }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.ENABLE_SIMULATION, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.SIMULATION_STATE_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            {
                                eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_DBL_CLICK, actions: [
                                    { guard: (event) => this.findEventTargetType(event) === "empty", action: (e) => this.graphController.createNodeElt(e), to: GraphStateMachinetypes_1.GraphStates.IDLE },
                                    { guard: (event) => this.findEventTargetType(event) === "occupied", action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.AUTHORING_GRAPH_ELT }
                                ]
                            },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PRESS_KEY, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.AUTHORING_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_LASSO_TOOL, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.LASSO_TOOL_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_SPACING_TOOL, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.SPACING_TOOL_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_TOOLBAR_ELT, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CREATE_LINK, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.SIBLING_NODE_PREVIEW }] },
                            {
                                eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_LEFT_DOWN, actions: [
                                    { guard: (event) => this.findEventPointer(event) === "resizeAnchor", action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.RESIZE_GRAPH_ELT },
                                    { guard: (event) => this.findEventPointer(event) === "draggableArea", action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.DRAG_SELECTIONBAR_GRAPH_ELT },
                                    { guard: (event) => this.findEventPointer(event) === "Connector", action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_DRAG_CONNECTOR },
                                    { guard: (event) => this.findEventPointer(event) === "Point", action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_DRAG_GRAPH_ELT },
                                    { guard: (event) => this.findEventPointer(event) === "DragabbleLabel", action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_DRAG_LABEL },
                                    { guard: (event) => this.findEventPointer(event) === "Grid", action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PAN_GRAPH_ELT },
                                ]
                            },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.RESIZE_GRAPH_ELT,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.startResize(e);
                        },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { this.graphController.resize(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => { this.graphController.endResize(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.DRAG_SELECTIONBAR_GRAPH_ELT,
                        onEntry: (e) => { this.graphController.startSelectionBarDrag(e); },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { this.graphController.dragSelectionBar(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => { this.graphController.endSelectionBarDrag(e); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PAN_GRAPH_ELT,
                        onEntry: (e) => { this.graphController.startPan(e); },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PINCH_START, actions: [{ action: (e) => { this.graphController.startPan(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PINCH, actions: [{ action: (e) => { this.graphController.pan(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { this.graphController.pan(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => { e.preventDefault(); this.graphController.endPan(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PRE_DRAG_LABEL,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.startGraphElementsDrag(e);
                        },
                        onExit: (e) => { },
                        transitions: [
                            {
                                eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [
                                    { action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.DRAG_LABEL },
                                ]
                            },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.DRAG_LABEL,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            {
                                eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [
                                    { action: (e) => { this.graphController.dragLabelElement(e); } },
                                ]
                            },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PRE_DRAG_GRAPH_ELT,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.startGraphElementsDrag(e);
                        },
                        onExit: (e) => { },
                        transitions: [
                            {
                                eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [
                                    { action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.DRAG_GRAPH_ELT },
                                ]
                            },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PINCH_START, actions: [{ action: (e) => { this.graphController.startPan(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.DRAG_GRAPH_ELT,
                        onEntry: (e) => { this.graphController.duplicateGraphElements(e); },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PINCH, actions: [{ action: (e) => { this.graphController.pan(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PINCH_START, actions: [{ action: (e) => { this.graphController.startPan(e); } }] },
                            {
                                eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [
                                    { action: (e) => { this.graphController.dragGraphElements(e); } },
                                ]
                            },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => this.graphController.dropGraphElements(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => { this.graphController.cancelAction(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PRE_DRAG_CONNECTOR,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.startConnectorDrag(e);
                        },
                        onExit: (e) => { },
                        transitions: [
                            // mouse move
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.DRAG_CONNECTOR }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.DRAG_CONNECTOR,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OVER, actions: [{ action: (e) => this.graphController.handleHoverAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OUT, actions: [{ action: (e) => this.graphController.handleOutAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => this.graphController.dragConnector(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => this.graphController.dropDraggedConnector(e), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SIBLING_NODE_PREVIEW,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.startDragToCreateConnection();
                        },
                        onExit: (e) => { },
                        transitions: [
                            // self-transition
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PRESS_KEY, actions: [{ action: (e) => { this.graphController.updateDefaultConnectionNodeType(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OVER, actions: [{ action: (e) => this.graphController.handleHoverAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OUT, actions: [{ action: (e) => this.graphController.handleOutAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ guard: (e) => !StaticAttributes_1.isMobileDevice, action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.SIBLING_NODE_PREVIEW_DRAG_MODE }] },
                            // { eventName: GraphEvents.POINTER_UP, actions: [{ guard: (e: Event) => !isMobileDevice, action: (e: Event) => this.graphController.setConnectionModePreview()}] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_LEFT_DOWN, actions: [{ guard: (event) => !!StaticAttributes_1.isMobileDevice, action: (e) => this.graphController.createConnection(e), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.DELETE, actions: [{ action: (e) => { e.preventDefault(); this.graphController.cancelAction(); this.graphController.deleteGraphElt(); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.UPDATE_TYPE, actions: [{ action: (e) => this.graphController.updateGraphEltType(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.UPDATE_COLOR, actions: [{ action: (e) => this.graphController.updateGraphEltColor(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CREATE_LINK, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            // { eventName: GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e: Event) => this.graphController.cancelAction(), to: GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SIBLING_NODE_PREVIEW_DRAG_MODE,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            // self-transition
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PRESS_KEY, actions: [{ action: (e) => { this.graphController.updateDefaultConnectionNodeType(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OVER, actions: [{ action: (e) => this.graphController.handleHoverAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_OUT, actions: [{ action: (e) => this.graphController.handleOutAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ guard: (e) => !StaticAttributes_1.isMobileDevice, action: (e) => { this.graphController.dragToCreateConnection(e); } }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ guard: (e) => !StaticAttributes_1.isMobileDevice, action: (e) => this.graphController.createConnection(e), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.DELETE, actions: [{ action: (e) => { e.preventDefault(); this.graphController.deleteGraphElt(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.UPDATE_TYPE, actions: [{ action: (e) => this.graphController.updateGraphEltType(e), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.UPDATE_COLOR, actions: [{ action: (e) => this.graphController.updateGraphEltColor(e), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CREATE_LINK, actions: [{ action: (e) => { this.graphController.cancelAction(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            // { eventName: GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e: Event) => this.graphController.cancelAction(), to: GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.AUTHORING_GRAPH_ELT,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.enableLabelAuthoringMode();
                        },
                        onExit: (e) => { },
                        transitions: [
                            // we can receive a pointer down event, but we need to add a guard on the target
                            {
                                eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_LEFT_DOWN, actions: [
                                    { guard: (event) => { return event.target !== document.activeElement; }, action: (e) => { this.graphController.disableLabelAuthoringMode(); }, to: GraphStateMachinetypes_1.GraphStates.PRE_DRAG_GRAPH_ELT },
                                ]
                            },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.VALIDATE, actions: [{ action: (e) => this.graphController.disableLabelAuthoringMode(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            // internal action
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CREATE_LINK, actions: [{ action: (e) => this.graphController.disableLabelAuthoringMode(), to: GraphStateMachinetypes_1.GraphStates.SIBLING_NODE_PREVIEW }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.LASSO_TOOL_IDLE,
                        onEntry: (e) => { this.graphController.saveCurrentSnapshot(); this.graphController.mouseCursor = "copy"; },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_LEFT_DOWN, actions: [{ action: (e) => this.graphController.startFreeHandSelection(e), to: GraphStateMachinetypes_1.GraphStates.PRE_SELECT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e), to: GraphStateMachinetypes_1.GraphStates.LASSO_TOOL_IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PRE_SELECT_GRAPH_ELT,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => this.graphController.updateFreeHandSelectionArea(e), to: GraphStateMachinetypes_1.GraphStates.SELECT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e), to: GraphStateMachinetypes_1.GraphStates.PRE_SELECT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SELECT_GRAPH_ELT,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => this.graphController.updateFreeHandSelectionArea(e), to: GraphStateMachinetypes_1.GraphStates.SELECT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => this.graphController.endFreeHandSelection(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e), to: GraphStateMachinetypes_1.GraphStates.SELECT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SPACING_TOOL_IDLE,
                        onEntry: (e) => this.graphController.enableSpacingTool(),
                        onExit: (e) => { },
                        transitions: [
                            // { eventName: GraphEvents.CHANGE_SELECTION_TOOL, actions: [{ action: (e: Event) => {}, to: GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_LEFT_DOWN, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_SHIFT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_LASSO_TOOL, actions: [{ action: (e) => this.graphController.disableSpacingTool(), to: GraphStateMachinetypes_1.GraphStates.LASSO_TOOL_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e), to: GraphStateMachinetypes_1.GraphStates.SPACING_TOOL_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_TOOLBAR_ELT, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PRE_SHIFT_GRAPH_ELT,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.startSpacingAction(e);
                        },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { this.graphController.updateSpacingAction(e); }, to: GraphStateMachinetypes_1.GraphStates.SHIFT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => this.graphController.disableSpacingTool(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SHIFT_GRAPH_ELT,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { this.graphController.updateSpacingAction(e); }, to: GraphStateMachinetypes_1.GraphStates.SHIFT_GRAPH_ELT }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => this.graphController.endSpacingAction(), to: GraphStateMachinetypes_1.GraphStates.SPACING_TOOL_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE,
                        onEntry: (e) => {
                            this.graphController.saveCurrentSnapshot();
                            this.graphController.startToolbarEltDrag(e);
                        },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_TOOLBAR_ELT, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE_DRAG }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_LEFT_DOWN, actions: [{ action: (e) => this.graphController.dropToolbarElt(e), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE_DRAG,
                        onEntry: (e) => { this.graphController.dragToolbarElt(e); },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, actions: [{ action: (e) => { }, to: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE_DRAG }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e), to: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_UP, actions: [{ action: (e) => { this.graphController.dropToolbarElt(e); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            // cancel action cases
                            { eventName: GraphStateMachinetypes_1.GraphEvents.CANCEL_ONGOING_ACTION, actions: [{ action: (e) => this.graphController.cancelAction(), to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_TOOLBAR_ELT, actions: [{ action: (e) => { this.graphController.cancelAction(); }, to: GraphStateMachinetypes_1.GraphStates.PRE_ELT_CREATE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_SPACING_TOOL, actions: [{ action: (e) => { this.graphController.cancelAction(); }, to: GraphStateMachinetypes_1.GraphStates.SPACING_TOOL_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.SELECT_LASSO_TOOL, actions: [{ action: (e) => { this.graphController.cancelAction(); }, to: GraphStateMachinetypes_1.GraphStates.LASSO_TOOL_IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.FIT_TO_WINDOW, actions: [{ action: (e) => { this.graphController.cancelAction(); this.graphController.fitToWindow(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.AUTO_LAYOUT, actions: [{ action: (e) => { this.graphController.cancelAction(); this.graphController.autoLayout(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SIMULATION_STATE_IDLE,
                        onEntry: (e) => {
                            this.graphController.deSelectAll();
                            this.graphControllerSimulationMode.enableSimulationMode();
                        },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.DISABLE_SIMULATION, actions: [{ action: (e) => { this.graphControllerSimulationMode.disableSimulationMode(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.PLAY_SIMULATION, actions: [{ action: (e) => { this.graphControllerSimulationMode.playSimulation(); }, to: GraphStateMachinetypes_1.GraphStates.SIMULATION_STATE_PLAY }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SIMULATION_STATE_PLAY,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.DISABLE_SIMULATION, actions: [{ action: (e) => { this.graphControllerSimulationMode.disableSimulationMode(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            // { eventName: GraphEvents.PAUSE_SIMULATION, actions: [{ action: (e: Event) => { this.graphControllerSimulationMode.pauseSimulation() }, to: GraphStates.SIMULATION_STATE_PAUSE }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.ENABLE_SIMULATION, actions: [{ action: (e) => { this.graphControllerSimulationMode.disableSimulationMode(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                        ]
                    },
                    {
                        state: GraphStateMachinetypes_1.GraphStates.SIMULATION_STATE_PAUSE,
                        onEntry: (e) => { },
                        onExit: (e) => { },
                        transitions: [
                            { eventName: GraphStateMachinetypes_1.GraphEvents.DISABLE_SIMULATION, actions: [{ action: (e) => { this.graphControllerSimulationMode.disableSimulationMode(); }, to: GraphStateMachinetypes_1.GraphStates.IDLE }] },
                            // { eventName: GraphEvents.PLAY_SIMULATION, actions: [{ action: (e: Event) => { this.graphControllerSimulationMode.resumeSimulation() }, to: GraphStates.SIMULATION_STATE_PLAY }] },
                            { eventName: GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, actions: [{ action: (e) => this.graphController.handleWheelAction(e) }] },
                        ]
                    }
                ]
            };
            this.graphController = graphController;
            this.graphControllerSimulationMode = graphControllerSimulationMode;
            switch (editorMode) {
                case DELGraphEditortypes_1.EditorModes.AUTHORING:
                    this._graphState = GraphStateMachinetypes_1.GraphStates.IDLE;
                    break;
                case DELGraphEditortypes_1.EditorModes.SIMULATION:
                    this.graphControllerSimulationMode.enableSimulationMode();
                    this._graphState = GraphStateMachinetypes_1.GraphStates.SIMULATION_STATE_IDLE;
                    break;
                case DELGraphEditortypes_1.EditorModes.READONLY:
                    this._graphState = GraphStateMachinetypes_1.GraphStates.IDLE;
                    break;
            }
        }
        fireEvent(eventName, event = new Event("")) {
            const currentState = this.findStateInStateMachine(this._graphState);
            if (typeof currentState !== "undefined") {
                const nextStateTransition = this.findTransition(eventName, currentState);
                if (typeof nextStateTransition !== "undefined") {
                    for (let transition of nextStateTransition.actions) {
                        const guardCheck = (transition.guard) ? transition.guard(event) : true;
                        if (guardCheck) {
                            if (transition.action)
                                transition.action(event);
                            // switch to next state
                            if (transition === null || transition === void 0 ? void 0 : transition.to) {
                                if (this._graphState !== (transition === null || transition === void 0 ? void 0 : transition.to) && (currentState === null || currentState === void 0 ? void 0 : currentState.onExit))
                                    currentState === null || currentState === void 0 ? void 0 : currentState.onExit(event);
                                const nextState = this.findStateInStateMachine(transition === null || transition === void 0 ? void 0 : transition.to);
                                this._graphState = transition === null || transition === void 0 ? void 0 : transition.to;
                                if (nextState === null || nextState === void 0 ? void 0 : nextState.onEntry)
                                    nextState === null || nextState === void 0 ? void 0 : nextState.onEntry(event);
                                break;
                            }
                            return;
                        }
                    }
                }
            }
        }
        findStateInStateMachine(stateName) {
            return this._graphStateMachine.states.find((stateInstance) => stateInstance.state === stateName);
        }
        findTransition(eventName, state) {
            var _a;
            return (_a = state.transitions) === null || _a === void 0 ? void 0 : _a.find((transition) => transition.eventName === eventName);
        }
        // utils functions
        findEventTargetType(event) {
            const eventTarget = event === null || event === void 0 ? void 0 : event.target;
            const [targetType, targetId, endPt] = eventTarget.id.split('_');
            let eventTargetType = "empty";
            if (this._graphState === GraphStateMachinetypes_1.GraphStates.IDLE)
                eventTargetType = (targetId && targetType !== "bodyGroupNode") ? "occupied" : "empty";
            else {
                eventTargetType = (targetId && targetType !== "segmentOutline" && targetType !== "bodyGroupNode") ? "occupied" : "empty";
            }
            return eventTargetType;
        }
        findEventPointer(event) {
            const eventTarget = event.target;
            const [targetType, targetId, endPt] = eventTarget.id.split('_');
            if (targetType === "resizeAnchor")
                return targetType;
            if (targetType === "draggableArea" || eventTarget.classList.contains("wux-controls-toolbar") || eventTarget.classList.contains("wux-tweakers") || eventTarget.classList.contains("wux-toolbar-horizontal"))
                return "draggableArea";
            if (typeof targetId !== "undefined" && targetType !== "bodyGroupNode")
                return (targetType === "midPoint" && Number(endPt) !== -1) ? "Connector" : targetType !== "backgroundDragabbleLabel" ? "Point" : "DragabbleLabel";
            else
                return "Grid";
        }
        eventTargetIsInsideToolbar(event) {
            const eventTarget = event.target;
            return eventTarget.classList.contains("wux-controls-abstract");
        }
    }
    exports.GraphStateMachine = GraphStateMachine;
});
