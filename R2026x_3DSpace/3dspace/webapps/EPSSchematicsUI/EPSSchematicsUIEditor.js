/// <amd-module name='DS/EPSSchematicsUI/EPSSchematicsUIEditor'/>
define("DS/EPSSchematicsUI/EPSSchematicsUIEditor", ["require", "exports", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIBreakpointController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugConsoleController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIDebugController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIHistoryController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIKeyboardController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUILocalStorageController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUISessionStorageController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIPanelStateController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUITraceController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockStateController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUITypeLibraryController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIViewerController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController", "DS/EPSSchematicsUI/components/EPSSchematicsUITabViewSwitcher", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITypesCatalog", "DS/EPSSchematicsUI/components/EPSSchematicsUIFileDropper", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/EPSSchematicsUI/panels/EPSSchematicsUIBlockLibraryPanel", "DS/EPSSchematicsUI/panels/EPSSchematicsUIDebugConsolePanel", "DS/EPSSchematicsUI/panels/EPSSchematicsUIHistoryPanel", "DS/EPSSchematicsUI/panels/EPSSchematicsUINodeIdSelectorsPanel", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPlayPanel", "DS/EPSSchematicsUI/panels/EPSSchematicsUIWatchPanel", "DS/EPSSchematicsUI/panels/EPSSchematicsUITypeLibraryPanel", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUISplashScreenDialog", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPEventServices/EPEventTarget", "DS/Windows/ImmersiveFrame", "DS/CoreBase/WebUXGlobalEnums", "DS/EPSSchematicsUI/typings/WebUX/notifications/EPSWUXNotificationsManagerUXMessages", "DS/EPSSchematicsUI/typings/WebUX/notifications/EPSWUXNotificationsManagerViewOnScreen", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUIDefaultGraph.json", "css!DS/EPSSchematicsUI/css/EPSSchematicsUIEditor"], function (require, exports, UIBreakpointController, UIDebugConsoleController, UIDebugController, UIHistoryController, UIKeyboardController, UILocalStorageController, UISessionStorageController, UIPanelStateController, UITraceController, UIBlockStateController, UITypeLibraryController, UIViewerController, UIBlockLibraryController, UITabViewSwitcher, UITypesCatalog, UIFileDropper, UIDom, UIEnums, UIBlockLibraryPanel, UIDebugConsolePanel, UIHistoryPanel, UINodeIdSelectorsPanel, UIPlayPanel, UIWatchPanel, UITypeLibraryPanel, UISplashScreenDialog, BlockLibrary, Block, EventTarget, ImmersiveFrame, WebUXGlobalEnums_1, WUXNotificationsManagerUXMessages, WUXNotificationsManagerViewOnScreen, UINLS, UIDefaultGraph) {
    "use strict";
    /**
     * This class defines the ExecutionGraph/Schematics editor.
     * @protected
     * @class UIEditor
     * @alias module:DS/EPSSchematicsUI/EPSSchematicsUIEditor
     */
    class UIEditor {
        /**
         * @public
         * @constructor
         * @param {IEditorOptions} options - The editor options.
         */
        constructor(options) {
            this.eventTarget = new EventTarget();
            this.markHasEdited = false;
            // Create the main DOM element
            this.domElement = UIDom.createElement('div', { className: 'epsSchematicsEditor' });
            this.domElement.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });
            // Initialize the editor options
            this.initializeOptions(options);
            // Append editor on domContainer
            if (this.options.domContainer instanceof HTMLElement) {
                if (this.options.domContainer === document.body) {
                    UIDom.addClassName(document.body, 'epsSchematicsBody');
                    UIDom.addClassName(document.documentElement, 'epsSchematicsBody');
                }
            }
            // Configure the notifications manager
            this.notificationsManager = WUXNotificationsManagerUXMessages;
            this.notificationsViewManager = WUXNotificationsManagerViewOnScreen;
            this.notificationsViewManager.setNotificationManager(this.notificationsManager);
            // Initialize controllers
            this.breakpointController = new UIBreakpointController(this);
            this.debugConsoleController = new UIDebugConsoleController(this);
            this.debugController = new UIDebugController(this);
            this.historyController = new UIHistoryController(this);
            this.keyboardController = new UIKeyboardController(this);
            this.localStorageController = new UILocalStorageController(this);
            if (this.options.clearLocalStorage === true) {
                this.localStorageController.clearStorage();
            }
            this._sessionStorageController = new UISessionStorageController();
            this.typeLibraryController = new UITypeLibraryController(this);
            this.viewerController = this._createViewerController();
            this.traceController = new UITraceController(this);
            this._blockStateController = new UIBlockStateController(this);
            this._blockLibraryController = new UIBlockLibraryController(this);
            this.typesCatalog = new UITypesCatalog(this);
            this.fileDropper = new UIFileDropper(this);
            // Initialize panels and dialogs
            this._splashScreenDialog = new UISplashScreenDialog(this);
            this.blockLibraryPanel = new UIBlockLibraryPanel(this);
            this.debugConsolePanel = new UIDebugConsolePanel(this);
            this.historyPanel = new UIHistoryPanel(this);
            this.nodeIdSelectorsPanel = new UINodeIdSelectorsPanel(this);
            this.typeLibraryPanel = new UITypeLibraryPanel(this);
            if (this.options.tabViewMode) {
                this.panelStateController = new UIPanelStateController(this);
                this.tabViewSwitcher = new UITabViewSwitcher(this);
            }
            this.createEditor();
        }
        /**
         * Removes the editor.
         * @public
         */
        remove() {
            if (this.tabViewSwitcher !== undefined) {
                this.tabViewSwitcher.remove();
                this.tabViewSwitcher = undefined;
            }
            this.breakpointController.remove();
            this.breakpointController = undefined;
            this.blockLibraryPanel.remove();
            this.blockLibraryPanel = undefined;
            this.debugConsolePanel.remove();
            this.debugConsolePanel = undefined;
            this.historyPanel.remove();
            this.historyPanel = undefined;
            this.nodeIdSelectorsPanel.remove();
            this.nodeIdSelectorsPanel = undefined;
            this.typeLibraryPanel.remove();
            this.typeLibraryPanel = undefined;
            if (this._playPanel !== undefined) {
                this._playPanel.remove();
                this._playPanel = undefined;
            }
            if (this._watchPanel !== undefined) {
                this._watchPanel.remove();
                this._watchPanel = undefined;
            }
            this.typesCatalog.remove();
            this.typesCatalog = undefined;
            this._blockLibraryController.remove();
            this._blockLibraryController = undefined;
            this.viewerController.remove();
            this.viewerController = undefined;
            this.debugConsoleController.remove();
            this.debugConsoleController = undefined;
            this.debugController.remove();
            this.debugController = undefined;
            this.historyController.remove();
            this.historyController = undefined;
            this.keyboardController.remove();
            this.keyboardController = undefined;
            this.localStorageController.remove();
            this.localStorageController = undefined;
            this._sessionStorageController.remove();
            this._sessionStorageController = undefined;
            if (this.panelStateController !== undefined) {
                this.panelStateController.remove();
                this.panelStateController = undefined;
            }
            this.traceController.remove();
            this.traceController = undefined;
            this._blockStateController.remove();
            this._blockStateController = undefined;
            this.typeLibraryController.remove();
            this.typeLibraryController = undefined;
            this.fileDropper.remove();
            this.fileDropper = undefined;
            this.notificationsViewManager.removeNotifications();
            this.notificationsViewManager = undefined;
            if (this._isImmersiveFrameCreated()) {
                this.immersiveFrame.remove();
            }
            this._immersiveFrameCreated = undefined;
            this.domElement.parentNode?.removeChild(this.domElement);
            this.options = undefined;
            this.eventTarget = undefined;
            this.viewer = undefined;
            this.immersiveFrame = undefined;
            this.domElement = undefined;
            this.markHasEdited = undefined;
            this.jsonOriginal = undefined;
        }
        /**
         * Closes the editor.
         * @public
         * @deprecated Use {@link #remove} instead.
         */
        onClose() {
            this.remove();
        }
        /**
         * Gets the editor's current graph model and ui to JSON object.
         * @public
         * @returns {string} The JSON string representing the graph model and ui.
         */
        getContent() {
            if (!this.markHasEdited && this.jsonOriginal !== undefined) {
                return this.jsonOriginal;
            }
            return JSON.stringify(this.viewer.save());
        }
        /**
         * Sets the editor's current graph model and ui from JSON object.
         * @public
         * @param {string} json - The JSON string representing the graph model and ui.
         * @param {boolean} [isGraphVersion2] - True for graph version 2, false otherwise.
         * @returns {boolean} True if the content has been set correctly, false otherwise.
         */
        setContent(json, isGraphVersion2) {
            let result = false;
            if (typeof json === 'string') {
                this.debugController.clear();
                this.breakpointController.unregisterAllBreakpoints();
                this.viewerController.removeAllViewers();
                this.jsonOriginal = json;
                result = this.viewer.load(this.jsonOriginal, isGraphVersion2);
                this.markHasEdited = false;
                this.historyController.registerLoadGraphAction();
            }
            return result;
        }
        /**
         * Gets the editor immersive frame.
         * @public
         * @returns {ImmersiveFrame} The editor immersive frame.
         */
        getImmersiveFrame() {
            return this.immersiveFrame;
        }
        /**
         * Gets the editor options.
         * @public
         * @returns {IInternalEditorOptions} The editor options.
         */
        getOptions() {
            return this.options;
        }
        /**
         * Gets the editor DOM element.
         * This DOM element can be appended to a DOM container after the editor creation.
         * @public
         * @returns {HTMLDivElement} The DOM element.
         */
        getDomElement() {
            return this.domElement;
        }
        /**
         * Gets the editor graph model.
         * @public
         * @returns {GraphBlock} The editor graph model.
         */
        getGraphModel() {
            return this.viewer.getMainGraph().getModel();
        }
        /**
         * Displays a notification into the editor.
         * @public
         * @param {IWUXNotificationOptions} [options] - Notification display options.
         * @param {string} [options.level] - The level of the notification (info, warning, error or success).
         * @param {string} [options.title] - The title of the notification
         * @param {string} [options.subtitle] - The subtitle of the notification.
         * @param {string} [options.message] - The message to display into the notification.
         */
        displayNotification(options) {
            this.notificationsManager.addNotif({
                level: options.level,
                title: options.title || UINLS.get('notificationSchematicsEditorTitle'),
                subtitle: options.subtitle,
                message: options.message
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Set or create a default WUX Immersive Frame.
         * @private
         * @param {HTMLElement} domContainer - The DOM container.
         * @param {ImmersiveFrame} [immersiveFrame] - The optional WUX Immersive Frame.
         * @returns {ImmersiveFrame} The current or created WUX Immersive Frame used by the editor.
         */
        _setOrCreateImmersiveFrame(domContainer, immersiveFrame) {
            const isValid = immersiveFrame instanceof ImmersiveFrame;
            this.immersiveFrame = isValid ? immersiveFrame : new ImmersiveFrame({
                identifier: 'EPSSchematicsUI_ImmersiveFrame',
                reactToPointerEventsFlag: false
                //_ActionBar_V3: true // Option to change immersive frame look!
            });
            this._immersiveFrameCreated = !isValid;
            if (!isValid) {
                this.immersiveFrame.inject(domContainer);
            }
            this.immersiveFrame.reactToPointerEventsFlag = false;
            this.immersiveFrame.setContentInBackgroundLayer(this.domElement);
            UIDom.addClassName(this.immersiveFrame.getContent(), 'sch-immersive-frame');
            return this.immersiveFrame;
        }
        /**
         * Creates the editor.
         * The dependent modules are loaded asynchronously with a require and
         * initialization of the graph is performed afterwards.
         * If no modules are needed the schematics editor will be loaded synchronously.
         * @private
         */
        createEditor() {
            if (this.options.defaultLibrary === true) {
                this.options.modules.push('DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock');
                this.options.modules.push('DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryDefine');
                this.options.modules.push('DS/EPSSchematicsScriptsLibrary/EPSSchematicsScriptsLibraryDefine');
                this.options.modules.push('DS/EPSSchematicsInputsLibrary/EPSSchematicsInputsLibraryDefine');
            }
            if (this.options.modules.length > 0) {
                // Temporary fix to load block documentation icon by default!
                const initCB = this.initializeEditor.bind(this);
                require(this.options.modules, function (...modules) {
                    modules.forEach((module) => {
                        if (typeof module === 'function' && module.prototype instanceof Block) {
                            BlockLibrary.registerBlock(module);
                        }
                    });
                    BlockLibrary.loadDocumentation(initCB);
                }, () => {
                    BlockLibrary.loadDocumentation(initCB);
                    this.displayNotification({
                        level: 'error',
                        title: UINLS.get('notificationLoadingBlockTitleError'),
                        message: UINLS.get('notificationLoadingBlockError')
                    });
                });
            }
            else {
                this.initializeEditor();
            }
        }
        /**
         * Initializes the editor synchronously.
         * @protected
         */
        initializeEditor() {
            this.viewer = this.viewerController.createRootViewer();
            if (this.options.json) {
                this.jsonOriginal = this.options.json;
                this.viewer.load(this.jsonOriginal);
            }
            else {
                this.viewer.loadDefaultGraph();
            }
            const interval = setInterval(() => {
                if (this.typesCatalog.isReady()) {
                    clearInterval(interval);
                    if (this.options.onInitialized) {
                        this.options.onInitialized(this);
                    }
                    if (this.historyController) {
                        this.historyController.registerCreateNewGraphAction();
                    }
                    if (this.tabViewSwitcher !== undefined) {
                        this.tabViewSwitcher.setEditActiveTab();
                    }
                    this._blockLibraryController.initializeFullBlockListModel();
                    this._blockLibraryController.startBlockLibraryListeners();
                }
            }, 100);
            // Create the play panel
            if (this.options.playCommands !== undefined) {
                this._playPanel = this._createPlayPanel();
                this._playPanel.open();
                if (this.options.tabViewMode !== undefined) {
                    this._playPanel.getWUXPanel().visibleFlag = false;
                }
            }
            // Create the watch panel
            if (this.options.watchPanel !== undefined) {
                this._watchPanel = new UIWatchPanel(this);
                this._watchPanel.open();
                if (this.options.tabViewMode !== undefined) {
                    this._watchPanel.getWUXPanel().visibleFlag = false;
                }
            }
            if (this.panelStateController !== undefined) {
                this.panelStateController.initialize();
            }
            if (!this.options.disableSplashScreen && this._splashScreenDialog && this.getLocalStorageController().getShowSplashScreen()) {
                this._splashScreenDialog.open();
            }
            this.initializeUsageAnalytics();
            /*
            const MySuperColor = {
                r: { type: 'Integer', mandatory: true, defaultValue: 0 },
                g: { type: 'Integer', mandatory: true, defaultValue: 0 },
                b: { type: 'Integer', mandatory: true, defaultValue: 0 },
                a: { type: 'Integer', mandatory: true, defaultValue: 0 }
            };
            const MySuperVector3D = {
                x: { type: 'Integer', mandatory: true, defaultValue: 0 },
                y: { type: 'Integer', mandatory: true, defaultValue: 0 },
                z: { type: 'Integer', mandatory: true, defaultValue: 0 }
            };
            const MySuperObject = {
                color: { type: 'MySuperColor', mandatory: true, defaultValue: { r: 128, g: 255, b: 0, a: 99 } },
                vector: { type: 'MySuperVector3D', mandatory: true, defaultValue: { x: 1, y: 2, z: 3 } },
                objectFilled: { type: 'Object', mandatory: true, defaultValue: undefined },
                objectEmpty: { type: 'Object', mandatory: true, defaultValue: undefined },
                arrayDouble: { type: 'Array<Double>', mandatory: true, defaultValue: [] }
            };
            const MySuperActor = {
                name: { type: 'String', mandatory: true, defaultValue: '' },
                isActive: { type: 'Boolean', mandatory: true, defaultValue: true },
                power: { type: 'Double', mandatory: true, defaultValue: 0.0 },
                obj: { type: 'MySuperObject', mandatory: true, defaultValue: undefined },
                arrayBool: { type: 'Array<Boolean>', mandatory: true, defaultValue: [] },
                arrayVector: { type: 'Array<MySuperVector3D>', mandatory: true, defaultValue: [] }
            };
            const MySuperArray = {
                arrayDouble: { type: 'Array<Double>', mandatory: true, defaultValue: [] }
            };*/
            /*class MyClassType {
                public boolean = false;
                public double = 0.0;
                public integer = 0;
                public string = '';
            }
            var MyClassDesc = {
                'boolean': { type: 'Boolean', mandatory: true, defaultValue: false },
                'double': { type: 'Double', mandatory: true, defaultValue: 0.0 },
                integer: { type: 'Integer', mandatory: true, defaultValue: 0 },
                object: { type: 'Object', mandatory: false },
                string: { type: 'String', mandatory: true, defaultValue: '' },
                array: { type: 'Array', mandatory: false },
                arrayBoolean: { type: 'Array<Boolean>', mandatory: false },
                arrayDouble: { type: 'Array<Double>', mandatory: false },
                arrayInteger: { type: 'Array<Integer>', mandatory: false },
                arrayObject: { type: 'Array<Object>', mandatory: false },
                arrayString: { type: 'Array<String>', mandatory: false },
                arrayArray: { type: 'Array<Array>', mandatory: false }
            };
            const TypeLibrary = require('DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary');
            TypeLibrary.registerGlobalClassType('MyClassType', MyClassType, MyClassDesc);*/
            /*TypeLibrary.registerAdvancedTypes();
            const MySuperBigIntObject = {
                myUInt64: { type: 'UInt64', mandatory: true, defaultValue: BigInt(0) },
                myInt64: { type: 'Int64', mandatory: true, defaultValue: BigInt(0) },
                myArrayUInt64: { type: 'Array<UInt64>', mandatory: true, defaultValue: [] },
                myArrayInt64: { type: 'Array<Int64>', mandatory: true, defaultValue: [] }
            };
            TypeLibrary.registerGlobalObjectType('MySuperBigIntObject', MySuperBigIntObject);
            const BigIntObject = {
                myUInt64: { type: 'UInt64', mandatory: true, defaultValue: BigInt(0) },
                myInt64: { type: 'Int64', mandatory: true, defaultValue: BigInt(0) },
                myArrayUInt64: { type: 'Array<UInt64>', mandatory: true, defaultValue: [] },
                myArrayInt64: { type: 'Array<Int64>', mandatory: true, defaultValue: [] },
                myObject: {
                    type: 'MySuperBigIntObject', mandatory: true, defaultValue: {
                        myUInt64: BigInt(0), myInt64: BigInt(0), myArrayUInt64: [], myArrayInt64: []
                    }
                }
            };
            TypeLibrary.registerGlobalObjectType('BigIntObject', BigIntObject);*/
            /*
            //TypeLibrary.registerGlobalObjectType('MySuperColor', MySuperColor);
            TypeLibrary.registerLocalCustomObjectType(this.viewer.getMainGraph().getModel().getGraphContext(), 'MySuperColor', MySuperColor);
            TypeLibrary.registerLocalCustomObjectType(this.viewer.getMainGraph().getModel().getGraphContext(), 'MySuperVector3D', MySuperVector3D);
            TypeLibrary.registerLocalCustomObjectType(this.viewer.getMainGraph().getModel().getGraphContext(), 'MySuperObject', MySuperObject);
            TypeLibrary.registerLocalCustomObjectType(this.viewer.getMainGraph().getModel().getGraphContext(), 'MySuperActor', MySuperActor);
            TypeLibrary.registerLocalCustomObjectType(this.viewer.getMainGraph().getModel().getGraphContext(), 'MySuperArray', MySuperArray);*/
            /*const TypeLibrary = require('DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary');
            TypeLibrary.registerAdvancedTypes();*/
        }
        /**
         * Initializes the editor options default values.
         * @param {IEditorOptions} options - The options of the editor.
         * @private
         */
        initializeOptions(options) {
            this.options = {
                domContainer: options.domContainer,
                modules: Array.isArray(options.modules) ? options.modules : [],
                json: (typeof options.json === 'string' && options.json !== '') ? options.json : undefined,
                defaultJSONGraph: options.defaultJSONGraph ?? UIDefaultGraph,
                defaultLibrary: options.defaultLibrary ?? true,
                traceMode: options.traceMode ?? true,
                gridSnapping: options.gridSnapping ?? true,
                immersiveFrame: this._setOrCreateImmersiveFrame(options.domContainer, options.immersiveFrame),
                onInitialized: (typeof options.onInitialized === 'function') ? options.onInitialized : undefined,
                templates: options.templates || { enableLocalTemplates: true, enableGlobalTemplates: true },
                enableFramebreaks: options.enableFramebreaks ?? true,
                hideOutputLocalDataDrawer: options.hideOutputLocalDataDrawer ?? false,
                blockLibraryDockArea: options.blockLibraryDockArea ?? WebUXGlobalEnums_1.WUXDockAreaEnum.LeftDockArea,
                debugConsoleDockArea: options.debugConsoleDockArea ?? WebUXGlobalEnums_1.WUXDockAreaEnum.BottomDockArea,
                historyDockArea: options.historyDockArea ?? WebUXGlobalEnums_1.WUXDockAreaEnum.LeftDockArea,
                typeLibraryDockArea: options.typeLibraryDockArea ?? WebUXGlobalEnums_1.WUXDockAreaEnum.LeftDockArea,
                rootInputDataDefaultValueSettable: options.rootInputDataDefaultValueSettable ?? true,
                hideGraphToolbarButton: options.hideGraphToolbarButton ?? 0 /* UIEnums.FGraphToolbarButton.fNone */,
                expandGraphToolbarButton: options.expandGraphToolbarButton ?? 0 /* UIEnums.FGraphToolbarButton.fNone */,
                playCommands: options.playCommands || undefined,
                watchPanel: options.watchPanel || undefined,
                onOpen: options.onOpen || undefined,
                onSave: options.onSave || undefined,
                onClear: options.onClear || undefined,
                onChange: options.onChange || undefined,
                onFileDrop: options.onFileDrop || undefined,
                tabViewMode: options.tabViewMode || undefined,
                clearLocalStorage: options.clearLocalStorage ?? false,
                disableSplashScreen: options.disableSplashScreen ?? false,
                isGraphVersion2DefaultValue: true
            };
            this._graphVersion2 = this.options.isGraphVersion2DefaultValue;
        }
        /**
         * Initializes Usage Analytics tracking
         * @private
         */
        // eslint-disable-next-line class-methods-use-this
        initializeUsageAnalytics() {
            if (globalThis.DS && globalThis.DS.analytics) {
                globalThis.DS.analytics.trackPageView({
                    'pageURL': window.location.pathname,
                    'pageTitle': document.title.replace('Execution Framework - ', ''),
                    'pageLanguage': 'en'
                });
            }
        }
        /**
         * Creates the new viewController.
         * @protected
         * @returns {UIViewerController} The viewerController to be instantiated
         */
        _createViewerController() {
            return new UIViewerController(this);
        }
        /**
         * Creates the UI play planel.
         * @protected
         * @returns {UIPlayPanel} The created UI play panel.
         */
        _createPlayPanel() {
            return new UIPlayPanel(this);
        }
        /**
         * Sets the editor graph model.
         * @private
         * @param {GraphBlock} model - The graph model.
         * @param {IJSONGraphUI} [modelUI] - The graph model UI.
         * @returns {UIGraph} The created graph.
         */
        setGraphModel(model, modelUI) {
            return this.viewer.createGraph(model, modelUI);
        }
        /**
         * Gets the editor viewer.
         * @private
         * @returns {UIViewer} The editor viewer.
         */
        _getViewer() {
            return this.viewer;
        }
        /**
         * Gets the breakpoint controller.
         * @private
         * @returns {UIBreakpointController} The breakpoint controller.
         */
        getBreakpointController() {
            return this.breakpointController;
        }
        /**
         * Gets the debug console controller.
         * @private
         * @returns {UIDebugConsoleController} The debug console controller.
         */
        getDebugConsoleController() {
            return this.debugConsoleController;
        }
        /**
         * Gets the debug controller.
         * @private
         * @returns {UIDebugController} The debug controller.
         */
        getDebugController() {
            return this.debugController;
        }
        /**
         * Gets the history controller.
         * @private
         * @returns {UIHistoryController} The history controller.
         */
        getHistoryController() {
            return this.historyController;
        }
        /**
         * Gets the keyboard controller.
         * @private
         * @returns {UIKeyboardController} The keyboard controller.
         */
        getKeyboardController() {
            return this.keyboardController;
        }
        /**
         * Gets the local storage controller.
         * @private
         * @returns {UILocalStorageController} The local storage controller.
         */
        getLocalStorageController() {
            return this.localStorageController;
        }
        /**
         * Gets the session storage controller.
         * @private
         * @returns {UISessionStorageController} The session storage controller.
         */
        getSessionStorageController() {
            return this._sessionStorageController;
        }
        /**
         * Gets the panel state controller.
         * @private
         * @returns {UIPanelStateController|undefined} The panel state controller.
         */
        getPanelStateController() {
            return this.panelStateController;
        }
        /**
          * Gets the trace controller.
         * @private
          * @returns {UITraceController} The trace controller.
          */
        getTraceController() {
            return this.traceController;
        }
        /**
         * Gets the type library controller.
         * @private
         * @returns {UITypeLibraryController} The type library controller.
         */
        getTypeLibraryController() {
            return this.typeLibraryController;
        }
        /**
         * Gets the viewer controller.
         * @private
         * @returns {UIViewerController} The viewer controller.
         */
        getViewerController() {
            return this.viewerController;
        }
        /**
         * Gets the block library controller.
         * @private
         * @returns {UIBlockLibraryController} The block library controller.
         */
        _getBlockLibraryController() {
            return this._blockLibraryController;
        }
        /**
         * Gets the types catalog.
         * @private
         * @returns {UITypesCatalog} The types catalog.
         */
        getTypesCatalog() {
            return this.typesCatalog;
        }
        /**
         * Gets the block library panel.
         * @private
         * @returns {UIBlockLibraryPanel} The block library panel.
         */
        getBlockLibraryPanel() {
            return this.blockLibraryPanel;
        }
        /**
         * Gets the debug console panel.
         * @private
         * @returns {UIDebugConsolePanel} The debug console panel.
         */
        getDebugConsolePanel() {
            return this.debugConsolePanel;
        }
        /**
         * Gets the history panel.
         * @private
         * @returns {UIHistoryPanel} The history panel.
         */
        getHistoryPanel() {
            return this.historyPanel;
        }
        /**
         * Gets the nodeId selectors panel.
         * @private
         * @returns {UINodeIdSelectorsPanel} The nodeId selectors panel.
         */
        getNodeIdSelectorsPanel() {
            return this.nodeIdSelectorsPanel;
        }
        /**
         * Gets the play panel.
         * @private
         * @returns {UIPlayPanel|undefined} The play panel.
         */
        getPlayPanel() {
            return this._playPanel;
        }
        /**
         * Gets the watch panel.
         * @private
         * @returns {UIWatchPanel|undefined} The watch panel.
         */
        getWatchPanel() {
            return this._watchPanel;
        }
        /**
         * Gets the type library panel.
         * @private
         * @returns {UITypeLibraryPanel} The type library panel.
         */
        getTypeLibraryPanel() {
            return this.typeLibraryPanel;
        }
        /**
         * Gets the file dropper.
         * @private
         * @returns {UIFileDropper} The file dropper.
         */
        getFileDropper() {
            return this.fileDropper;
        }
        /**
         * Gets the notification manager.
         * @private
         * @returns {WUXNotificationsManagerUXMessages} The notification manager.
         */
        _getNotificationsManager() {
            return this.notificationsManager;
        }
        /**
         * Gets the tab view switcher.
         * @private
         * @returns {UITabViewSwitcher|undefined} The tab view switcher.
         */
        _getTabViewSwitcher() {
            return this.tabViewSwitcher;
        }
        /**
         * Gets the graph version 2 editor setting value.
         * @public
         * @returns {boolean} The graph version 2 editor setting value.
         */
        _getGraphVersion2() {
            return this._graphVersion2;
        }
        /**
         * Sets the graph version 2 editor setting value.
         * @public
         * @param {boolean} value - The graph version 2 editor setting value.
         */
        _setGraphVersion2(value) {
            // Always display a notification when loading a graph in version 1.
            // Display a notification only when version has changed (v1 -> v2 || v2 -> v1)
            if (value === false || value !== this._graphVersion2) {
                const version = value ? 2 : 1;
                this.displayNotification({
                    level: 'warning',
                    title: UINLS.get('graphVersionNotificationTitle', { version: String(version) })
                });
            }
            this._graphVersion2 = value;
        }
        /**
         * Displays a message into the debug console.
         * @private
         * @param {ModelEnums.ESeverity} severity - The severity of the message.
         * @param {string|string[]} message - The message.
         */
        displayDebugConsoleMessage(severity, message) {
            this.debugConsoleController.displayMessage(UIEnums.EMessageOrigin.eApplication, severity, new Date(), message);
        }
        /**
         * Adds an event listener.
         * @private
         * @param {EPEvent} iEventCtor - The event constructor.
         * @param {Function} iListener - The callback function.
         */
        addListener(iEventCtor, iListener) {
            this.eventTarget.addListener(iEventCtor, iListener);
        }
        /**
         * Removes an event listener.
         * @private
         * @param {EPEvent} iEventCtor - The event constructor.
         * @param {Function} iListener - The callback function.
         */
        removeListener(iEventCtor, iListener) {
            this.eventTarget.removeListener(iEventCtor, iListener);
        }
        /**
         * Dispatches the event.
         * @private
         * @param {EPEvent} iEvent - The event.
         */
        dispatchEvent(iEvent) {
            this.eventTarget.dispatchEvent(iEvent);
        }
        /**
         * Injects data block into the editor at a specified drop position.
         * @private
         * @param {Object} data - The data block structure to be injected into the editor.
         * @param {DragEvent} dropInfo - The drop info specifying the position.
         */
        injectData(data, dropInfo) {
            if (data !== undefined && data.uid !== undefined) {
                const viewer = this.viewerController.getCurrentViewer();
                const position = viewer.clientToViewpoint(dropInfo.clientX, dropInfo.clientY);
                const block = viewer.getMainGraph().createBlock(data.uid, position[0], position[1]);
                block?.automaticExpandDataPorts();
            }
        }
        /**
         * The callback on the editor change event.
         * @private
         */
        onChange() {
            if (!this.viewer.isLoading()) {
                this.markHasEdited = true;
                this.typeLibraryController.updateOccurenceCount();
                if (this.options.onChange) {
                    this.options.onChange();
                }
            }
        }
        /**
         * Checks if the breakpoints are enabled.
         * @private
         * @returns {boolean} True if the breakpoints are enabled, false otherwise.
         */
        _areBreakpointsEnabled() {
            return this.options.playCommands !== undefined && this.options.playCommands.callbacks !== undefined &&
                this.options.playCommands.callbacks.onBreakpointsChange !== undefined;
        }
        /**
         * Checks if an immersive frame hase been created by the editor.
         * @private
         * @returns {boolean} True if an immersive frame has been created by the editor, false otherwise.
         */
        _isImmersiveFrameCreated() {
            return this._immersiveFrameCreated;
        }
        /**
         * Gets the splash schreen dialog.
         * @private
         * @ignore
         * @returns {UISplashScreenDialog} The splash schreen dialog.
         */
        _getSplashScreenDialog() {
            return this._splashScreenDialog;
        }
    }
    return UIEditor;
});
