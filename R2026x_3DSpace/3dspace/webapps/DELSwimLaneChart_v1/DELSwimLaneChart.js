/// <amd-module name="DS/DELSwimLaneChart_v1/DELSwimLaneChart"/>
define("DS/DELSwimLaneChart_v1/DELSwimLaneChart", ["require", "exports", "DS/DELSwimLaneChart_v1/services/EventsHandler", "DS/DELSwimLaneChart_v1/services/DELSwimLaneChartDocument", "DS/DELSwimLaneChart_v1/model/DELSwimLaneChartModel", "DS/DELSwimLaneChart_v1/presenter/DELSwimLaneChartPresenter", "DS/DELSwimLaneChart_v1/view/DELSwimLaneChartView", "DS/Menu/ContextualMenu", "css!./assets/swimLaneChartStyles.css", "css"], function (require, exports, EventsHandler_1, DELSwimLaneChartDocument_1, DELSwimLaneChartModel_1, DELSwimLaneChartPresenter_1, DELSwimLaneChartView_1, WUXContextualMenu) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // const WUX_variables = WebUXGlobalEnum;
    class SwimLaneChart extends HTMLElement {
        constructor(props = {}) {
            super();
            this._contextMenuNumber = 0;
            //resizer observer
            this._ro = new ResizeObserver(() => {
                window.requestAnimationFrame(() => this._presenter.handleResizeObserver());
            });
            this._props = props;
            const id = "swimLanechart" + document.getElementsByTagName("swim-lane-chart").length + Math.round(50 * Math.random());
            // services initialization
            this._model = new DELSwimLaneChartModel_1.default();
            this._view = new DELSwimLaneChartView_1.default(id);
            this._presenter = new DELSwimLaneChartPresenter_1.default(this._model, this._view, props);
            this._eventsHandler = new EventsHandler_1.default(this._presenter);
            this.swimLaneChartdocument = new DELSwimLaneChartDocument_1.default(this._presenter);
            if (props.model)
                this.model = props.model;
        }
        set model(newModel) {
            this._presenter.model = newModel;
        }
        connectedCallback() {
            this._view.initRender(this);
            this.attachEventsListener();
            // once the component is rendered call the presenter to update the view with the local props
            if (this._props.searchBar)
                this._view.initSearchView(this, this._presenter.findStr, this._presenter.scrollToResult);
            this._presenter.isRendered = true;
        }
        disconnectedCallback() {
            this.removeEventsListener();
            this._presenter.isRendered = false;
        }
        attachEventsListener() {
            var _a, _b;
            const targetBd = this.parentElement.getBoundingClientRect();
            this._presenter.windowBoundingBox = { ...this._presenter.windowBoundingBox, w: targetBd.width, h: targetBd.height };
            this._ro.observe(this._view.getParentContainer());
            (_a = this._view.getParentContainer()) === null || _a === void 0 ? void 0 : _a.addEventListener("scroll", this._eventsHandler.onScroll);
            (_b = this._view.getParentContainer()) === null || _b === void 0 ? void 0 : _b.addEventListener("wheel", this._eventsHandler.onWheelEvent);
            // this._view.getParentContainer()?.addEventListener("wheel",(e)=>(isFireFox && !e.ctrlKey)?requestAnimationFrame(()=>(e)):this._eventsHandler.onWheelEvent(e));
            this.addEventListener("pointerdown", this._eventsHandler.onPointerDown);
            this.addEventListener("pointerover", this._eventsHandler.onPointerOver);
            this.addEventListener("pointerout", this._eventsHandler.onPointerOut);
            this.addEventListener("contextmenu", this._eventsHandler.onContextMenu);
            if (this._props.onContextMenu) {
                this._contextMenuNumber = WUXContextualMenu.addEventListener(this, {
                    callback: (params) => {
                        const target = this._presenter.getOnContextMenuTarget(params.data.target);
                        if (this._props.onContextMenu)
                            return this._props.onContextMenu(target); // check the default ?
                        else
                            return [];
                    }
                });
            }
        }
        removeEventsListener() {
            // this._ro.unobserve(this._view.getParentContainer() as Element);
            // this._view.getParentContainer()?.removeEventListener("scroll", this._eventsHandler.onScroll);
            // this._view.getParentContainer()?.removeEventListener("wheel", this._eventsHandler.onWheelEvent);
            this.removeEventListener("pointerdown", this._eventsHandler.onPointerDown);
            this.removeEventListener("pointerover", this._eventsHandler.onPointerOver);
            this.removeEventListener("pointerout", this._eventsHandler.onPointerOut);
            this.removeEventListener("contextmenu", this._eventsHandler.onContextMenu);
            if (this._props.onContextMenu)
                WUXContextualMenu.removeEventListener(this, this._contextMenuNumber);
        }
    }
    if (!window.customElements.get('swim-lane-chart'))
        customElements.define('swim-lane-chart', SwimLaneChart);
    exports.default = SwimLaneChart;
});
