/// <amd-module name="DS/DELSwimLaneChart_v2/services/EventsHandler"/>
define("DS/DELSwimLaneChart_v2/services/EventsHandler", ["require", "exports", "DS/DELSwimLaneChart_v2/utils/StaticAttributes"], function (require, exports, StaticAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventsHandler {
        constructor(presenter) {
            // dbl click
            this._isdblclick = false;
            this._lastClickTimeStamp = new Date().getTime();
            this._pointerPrevPos = { x: 0, y: 0 };
            this.onScroll = () => {
                this._presenter.handleScroll();
            };
            this.onWheelEvent = (e) => {
                this._presenter.handleWheelAction(e);
            };
            this.onPointerDown = (e) => {
                if (e.button === 0) { // left click
                    const timeIntervall = new Date().getTime() - this._lastClickTimeStamp;
                    const distance = Math.hypot(e.clientX - this._pointerPrevPos.x, e.clientY - this._pointerPrevPos.y); // compute the distance between the previous pointer position and the current position
                    const timeThreshold = StaticAttributes_1.isMobileDevice ? 2000 : 300;
                    const distanceThreshold = StaticAttributes_1.isMobileDevice ? 48 : 10;
                    const dblClickGuard = timeIntervall < timeThreshold && distance < distanceThreshold;
                    if (dblClickGuard) {
                        e.preventDefault();
                        this._presenter.handleDblClick(e);
                    }
                    else {
                        this._presenter.handlePointerDown(e);
                    }
                    this._pointerPrevPos = { x: e.clientX, y: e.clientY };
                    this._lastClickTimeStamp = new Date().getTime();
                }
            };
            this._presenter = presenter;
        }
        onPointerOver(e) {
            this._presenter.handlePointerOver(e);
        }
        onPointerOut(e) {
            this._presenter.handlePointerOut(e);
        }
        onContextMenu(e) {
            e.preventDefault();
        }
    }
    exports.default = EventsHandler;
});
