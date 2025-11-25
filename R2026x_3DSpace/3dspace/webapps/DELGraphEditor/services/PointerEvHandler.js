/// <amd-module name="DS/DELGraphEditor/services/PointerEvHandler"/>
define("DS/DELGraphEditor/services/PointerEvHandler", ["require", "exports", "../types/GraphStateMachinetypes", "DS/DELGraphEditor/utils/StaticAttributes"], function (require, exports, GraphStateMachinetypes_1, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PointerEvHandler = void 0;
    class PointerEvHandler {
        constructor(graphStateMachine) {
            this._isdblclick = false;
            // eventTimeSTamp
            this._lastTouchTimeStamp = new Date().getTime();
            this._pointerPrevPos = { x: 0, y: 0 };
            this.selectFromToolbar = (e) => {
                e.preventDefault();
                if (!(e instanceof CustomEvent))
                    return;
                // layout tools
                if (e.detail.actionTarget === "Lasso Tool")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.SELECT_LASSO_TOOL, e);
                if (e.detail.actionTarget === "Spacing Tool")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.SELECT_SPACING_TOOL, e);
                if (e.detail.actionTarget === "Fit to Window")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.FIT_TO_WINDOW, e);
                if (e.detail.actionTarget === "Auto Layout")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.AUTO_LAYOUT, e);
                // objects creation actions
                if (e.detail.actionTarget === "Node" || e.detail.actionTarget === "GroupNode" || e.detail.actionTarget === "Initial" || e.detail.actionTarget === "Final" || e.detail.actionTarget === "Choice")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.SELECT_TOOLBAR_ELT, e);
                if (e.detail.actionTarget === "Link")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.CREATE_LINK, e);
                if (e.detail.actionTarget === "editType")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.UPDATE_TYPE, e);
                if (e.detail.actionTarget === "editColor")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.UPDATE_COLOR, e);
                // update & delete
                if (e.detail.actionTarget === "Delete")
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.DELETE, e);
                this._pointerPrevPos = { x: -999, y: -999 };
                this._lastTouchTimeStamp = 0;
            };
            this.onPointerDown = (e) => {
                if (e.button === 0) { // left click
                    const timeIntervall = new Date().getTime() - this._lastTouchTimeStamp;
                    const distance = Math.hypot(e.clientX - this._pointerPrevPos.x, e.clientY - this._pointerPrevPos.y); // compute the distance between the previous pointer position and the current position
                    const timeThreshold = StaticAttributes_1.isMobileDevice ? 1000 : 300; // 500
                    const distanceThreshold = StaticAttributes_1.isMobileDevice ? 48 : 10; // 12
                    const dblClickGuard = timeIntervall < timeThreshold && distance < distanceThreshold;
                    if (dblClickGuard) {
                        e.preventDefault();
                        if (!StaticAttributes_1.isMobileDevice)
                            this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_DBL_CLICK, e);
                        else
                            this._isdblclick = true;
                    }
                    else {
                        // specific condition
                        if (e.target.tagName !== "DIV")
                            e.preventDefault();
                        this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_LEFT_DOWN, e);
                        this._isdblclick = false;
                    }
                    this._pointerPrevPos = { x: e.clientX, y: e.clientY };
                    this._lastTouchTimeStamp = new Date().getTime();
                }
            };
            this.onPointerMove = (e) => {
                var _a;
                (_a = this._graphStateMachine) === null || _a === void 0 ? void 0 : _a.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_MOVE, e);
                // if (this._lastTouchTimeStamp !== 0) {
                //     this._pointerPrevPos = { x: -999, y: -999 };
                //     this._lastTouchTimeStamp = 0;
                // }
            };
            this.onPointerUp = (e) => {
                if (!this._isdblclick)
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_UP, e);
                else
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_DBL_CLICK, e);
                this._isdblclick = false;
            };
            this.onWheel = (e) => {
                e.preventDefault();
                this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_WHEEL, e);
            };
            this.onTouchStart = (e) => {
                // specific condition
                // if ((e.target as HTMLElement).tagName !== "DIV")  to interact with the input on edition
                if (e.target !== document.activeElement && !e.target.classList.contains("wux-button-icon-placeholder"))
                    e.preventDefault();
                if (e.touches.length === 2) {
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.PINCH_START, e);
                    this._lastTouchTimeStamp = 0;
                }
            };
            this.onTouchMove = (e) => {
                if (e.touches.length === 2) {
                    this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.PINCH, e);
                    if (this._lastTouchTimeStamp !== 0) {
                        this._pointerPrevPos = { x: -999, y: -999 };
                        this._lastTouchTimeStamp = 0;
                    }
                }
            };
            this._graphStateMachine = graphStateMachine;
        }
        onPointerOver(e) {
            var _a;
            (_a = this._graphStateMachine) === null || _a === void 0 ? void 0 : _a.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_OVER, e);
        }
        onPointerOut(e) {
            var _a;
            (_a = this._graphStateMachine) === null || _a === void 0 ? void 0 : _a.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_OUT, e);
        }
        onContextMenu(e) {
            e.preventDefault();
        }
        onTouchEnd(e) {
            // emitEvent
            this._graphStateMachine.fireEvent(GraphStateMachinetypes_1.GraphEvents.POINTER_UP, e);
        }
    }
    exports.PointerEvHandler = PointerEvHandler;
});
