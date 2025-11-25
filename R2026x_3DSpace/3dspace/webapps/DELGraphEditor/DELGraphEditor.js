/// <amd-module name="DS/DELGraphEditor/DELGraphEditor"/>
define("DS/DELGraphEditor/DELGraphEditor", ["require", "exports", "DS/DELGraphEditor/components/MultiLineInput", "DS/DELGraphEditor/components/AuthoringSideToolbar", "DS/DELGraphEditor/types/DELGraphEditortypes", "DS/DELGraphEditor/services/ViewUpdater", "DS/DELGraphEditor/services/TransactionManager", "DS/DELGraphEditor/services/PointerEvHandler", "DS/DELGraphEditor/stateMachine/GraphStateMachine", "DS/DELGraphEditor/services/KeyBoardEvHandler", "DS/DELGraphEditor/services/GraphDocument", "DS/DELGraphEditor/components/ContextToolbar", "DS/DELGraphEditor/controllers/GraphController", "DS/DELGraphEditor/models/GraphModel", "DS/DELGraphEditor/services/controllerServices/MoveActionsManager", "DS/DELGraphEditor/services/controllerServices/CUDManagerService", "DS/DELGraphEditor/services/controllerServices/RelationManagerService", "DS/DELGraphEditor/services/controllerServices/LayoutManagerService", "DS/DELGraphEditor/controllers/GraphControllerSimulationMode", "css!./assets/css/graphstyles.css"], function (require, exports, MultiLineInput_1, AuthoringSideToolbar_1, DELGraphEditortypes_1, ViewUpdater_1, TransactionManager_1, PointerEvHandler_1, GraphStateMachine_1, KeyBoardEvHandler_1, GraphDocument_1, ContextToolbar_1, GraphController_1, GraphModel_1, MoveActionsManager_1, CUDManagerService_1, RelationManagerService_1, LayoutManagerService_1, GraphControllerSimulationMode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditorComponent = void 0;
    class EditorComponent extends HTMLElement {
        constructor(editorOptions) {
            super();
            //resizer observer
            this._ro = new ResizeObserver((entries) => {
                const targetBd = entries[0].target.getBoundingClientRect();
                this._graphController.gridBoudingBox = { x: targetBd.left, y: targetBd.top, w: targetBd.width, h: targetBd.height };
            });
            // get the props
            let { content, editorMode } = editorOptions;
            if (!editorMode)
                editorMode = DELGraphEditortypes_1.EditorModes.AUTHORING;
            // services initialization
            const graphModel = new GraphModel_1.GraphModel();
            const layoutManager = new LayoutManagerService_1.default(graphModel);
            const cudManager = new CUDManagerService_1.default(graphModel);
            const relationManager = new RelationManagerService_1.default(graphModel);
            const moveActionsManager = new MoveActionsManager_1.MoveActionsManager(graphModel);
            this._viewUpdater = new ViewUpdater_1.ViewUpdater(cudManager, editorOptions);
            const transactionManagerCallback = this._viewUpdater.transactionManagerCallback; // transaction Manager Callback
            const transactionManager = new TransactionManager_1.default(transactionManagerCallback);
            this._graphController = new GraphController_1.GraphController(relationManager, layoutManager, cudManager, moveActionsManager, transactionManager);
            this._graphControllerSimulationMode = new GraphControllerSimulationMode_1.GraphControllerSimulationMode(relationManager, cudManager, transactionManager);
            this._graphStateMachine = new GraphStateMachine_1.GraphStateMachine(editorMode, this._graphController, this._graphControllerSimulationMode);
            this._graphDocument = new GraphDocument_1.GraphDocument(this._graphController, this._graphControllerSimulationMode, this._graphStateMachine);
            this._pointerEvHandler = new PointerEvHandler_1.PointerEvHandler(this._graphStateMachine);
            this._keyboardEvHandler = new KeyBoardEvHandler_1.KeyBoardEvHandler(this._graphStateMachine);
            // load data
            if (content && content.model)
                this._graphController.loadData(content);
            // override the console.log
            // const buitInConsoleLog = console.log;
            // console.log = function (...args) {
            //     if (isMobileDevice) {
            //         const fakeConsole = document.querySelector(".console");
            //         if (fakeConsole) {
            //             if (args instanceof Object) {
            //                 fakeConsole.textContent = JSON.stringify(args);
            //             } else fakeConsole.textContent = args + "";
            //         }
            //     } else buitInConsoleLog.apply(console, args);
            // }
        }
        /** exposed apis */
        get graphDocument() {
            return this._graphDocument;
        }
        /**
         * callback afer inserting the component into DOM
         */
        connectedCallback() {
            this._viewUpdater.firstRender(this, this._graphController.GraphContent, this._graphController.transVector, this._graphController.mouseCursor);
            this.attachEventsListener();
        }
        /**
         * callback afer removing the component form dom
         */
        disconnectedCallback() {
            this.removeEventsListener();
        }
        /**
         * method to attach events/actions listeners to graph component
         */
        attachEventsListener() {
            const svgElt = this._viewUpdater.getGridSVGElt();
            if (svgElt)
                this._ro.observe(svgElt); // attach a resizer observer to SVG element
            // toolbar events
            this.addEventListener("toolbarItemSelected", this._pointerEvHandler.selectFromToolbar);
            // pointer&touch&wheel events
            this.addEventListener("pointerdown", this._pointerEvHandler.onPointerDown);
            this.addEventListener("touchstart", this._pointerEvHandler.onTouchStart); //{ passive: false }
            this.addEventListener("touchmove", this._pointerEvHandler.onTouchMove);
            this.addEventListener('wheel', this._pointerEvHandler.onWheel, { passive: false });
            this.addEventListener("pointerover", this._pointerEvHandler.onPointerOver);
            this.addEventListener("pointerout", this._pointerEvHandler.onPointerOut);
            this.addEventListener("pointermove", this._pointerEvHandler.onPointerMove);
            this.addEventListener("pointerup", this._pointerEvHandler.onPointerUp);
            this.addEventListener("contextmenu", this._pointerEvHandler.onContextMenu);
            // keyboard events
            this.addEventListener("keydown", this._keyboardEvHandler.onKeyDown);
            // window events
            window.addEventListener('beforeunload', (e) => {
                e.preventDefault();
                this._graphController.saveGraphicalAttributes();
            });
        }
        /**
         * method to remove events/actions listeners from graph component
         */
        removeEventsListener() {
            const svgElt = this._viewUpdater.getGridSVGElt();
            if (svgElt)
                this._ro.unobserve(svgElt);
            // toolbar events
            this.removeEventListener("toolbarItemSelected", this._pointerEvHandler.selectFromToolbar);
            // pointer&touch&wheel events
            this.removeEventListener("pointerdown", this._pointerEvHandler.onPointerDown);
            this.removeEventListener("touchstart", this._pointerEvHandler.onTouchStart); //{ passive: false }
            this.removeEventListener("touchmove", this._pointerEvHandler.onTouchMove);
            this.removeEventListener('wheel', this._pointerEvHandler.onWheel);
            this.removeEventListener("pointerover", this._pointerEvHandler.onPointerOver);
            this.removeEventListener("pointerout", this._pointerEvHandler.onPointerOut);
            this.removeEventListener("pointermove", this._pointerEvHandler.onPointerMove);
            this.removeEventListener("pointerup", this._pointerEvHandler.onPointerUp);
            this.removeEventListener("contextmenu", this._pointerEvHandler.onContextMenu);
            // keyboard events
            this.removeEventListener("keydown", this._keyboardEvHandler.onKeyDown);
            // window events
            window.removeEventListener('beforeunload', (e) => e.preventDefault());
        }
    }
    exports.EditorComponent = EditorComponent;
    window.customElements.define("graph-component", EditorComponent);
    window.customElements.define("wux-authoring-side-tool-bar", AuthoringSideToolbar_1.AuthoringSideToolBar);
    window.customElements.define("wux-context-tool-bar", ContextToolbar_1.ContextToolBar);
    window.customElements.define("editable-input", MultiLineInput_1.MultiLineInput);
});
