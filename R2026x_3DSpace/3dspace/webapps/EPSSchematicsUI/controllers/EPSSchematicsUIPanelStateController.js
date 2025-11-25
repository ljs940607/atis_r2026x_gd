/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIPanelStateController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIPanelStateController", ["require", "exports", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/CoreBase/WebUXGlobalEnums"], function (require, exports, UIEnums, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines the UI panel state controller.
     * @private
     * @class UIPanelStateController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIPanelStateController
     */
    class UIPanelStateController {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._panels = [];
            this._panelStateMap = new Map();
            this._dockingStateMap = new Map();
            this._editor = editor;
            this._panels = [
                this._editor.getBlockLibraryPanel(),
                this._editor.getTypeLibraryPanel(),
                this._editor.getHistoryPanel(),
                this._editor.getNodeIdSelectorsPanel(),
                this._editor.getDebugConsolePanel()
            ];
            this._dockingElements = [
                this._editor.getImmersiveFrame().getDockingElement(WebUXGlobalEnums_1.WUXDockAreaEnum.LeftDockArea),
                this._editor.getImmersiveFrame().getDockingElement(WebUXGlobalEnums_1.WUXDockAreaEnum.RightDockArea),
                this._editor.getImmersiveFrame().getDockingElement(WebUXGlobalEnums_1.WUXDockAreaEnum.BottomDockArea)
            ];
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the controller.
         * @public
         */
        remove() {
            this._panelStateMap.clear();
            this._dockingStateMap.clear();
            this._editor = undefined;
            this._panels = undefined;
            this._dockingElements = undefined;
            this._panelStateMap = undefined;
            this._dockingStateMap = undefined;
        }
        /**
         * Initializes the state of each panel.
         * @public
         */
        initialize() {
            const viewModes = [UIEnums.EViewMode.eEdit, UIEnums.EViewMode.ePlay, UIEnums.EViewMode.eDebug];
            viewModes.forEach(viewMode => {
                this._dockingElements.forEach(dockingElement => this._storeDockingElementState(dockingElement, viewMode));
                this._panels.forEach(panel => this._storePanelState(panel, viewMode));
            });
            const playPanel = this._editor.getPlayPanel();
            if (playPanel) {
                this._initializePanelState(playPanel);
                const playPanelStateMap = this._panelStateMap.get(playPanel);
                if (playPanelStateMap !== undefined) {
                    const editPanelState = playPanelStateMap.get(UIEnums.EViewMode.eEdit);
                    const playPanelState = playPanelStateMap.get(UIEnums.EViewMode.ePlay);
                    const debugPanelState = playPanelStateMap.get(UIEnums.EViewMode.eDebug);
                    if (editPanelState) {
                        editPanelState.visibleFlag = false;
                    }
                    if (playPanelState) {
                        playPanelState.debugCommandsVisibleFlag = false;
                    }
                    if (debugPanelState) {
                        debugPanelState.debugCommandsVisibleFlag = true;
                    }
                }
            }
            const watchPanel = this._editor.getWatchPanel();
            if (watchPanel) {
                this._initializePanelState(watchPanel);
                const watchPanelStateMap = this._panelStateMap.get(watchPanel);
                if (watchPanelStateMap) {
                    const editPanelState = watchPanelStateMap.get(UIEnums.EViewMode.eEdit);
                    if (editPanelState) {
                        editPanelState.visibleFlag = false;
                    }
                }
            }
            this.restorePanelStates(UIEnums.EViewMode.eEdit);
        }
        /**
         * Stores each panels states.
         * @public
         * @param {EViewMode} viewMode - The view mode to store.
         */
        storePanelStates(viewMode) {
            if (viewMode !== undefined) {
                this._dockingElements.forEach(dockingElement => this._storeDockingElementState(dockingElement, viewMode));
                this._panels.forEach(panel => this._storePanelState(panel, viewMode));
                this._storePanelState(this._editor.getPlayPanel(), viewMode);
                this._storePanelState(this._editor.getWatchPanel(), viewMode);
            }
        }
        /**
         * Restores each panels states to the provided view mode.
         * @public
         * @param {EViewMode} viewMode - The view mode to restore.
         */
        restorePanelStates(viewMode) {
            this._dockingElements.forEach(dockingElement => this._restoreDockingElementState(dockingElement, viewMode));
            this._panels.forEach(panel => this._restorePanelState(panel, viewMode));
            this._restorePanelState(this._editor.getPlayPanel(), viewMode);
            this._restorePanelState(this._editor.getWatchPanel(), viewMode);
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
         * Stores the provided panel state.
         * @private
         * @param {UIPanel} panelUI - The UI panel.
          *@param {UIEnums.EViewMode} viewMode - The view mode to store.
         */
        _storePanelState(panelUI, viewMode) {
            if (panelUI !== undefined) {
                const panelStates = this._panelStateMap.get(panelUI) || new Map();
                const wuxPanel = panelUI.getWUXPanel();
                // Specific to play panel
                const isPlayPanel = panelUI === this._editor.getPlayPanel();
                const debugCommandsVisibleFlag = isPlayPanel ? panelUI.getDebugCommandsVisibleFlag() : undefined;
                const visibleFlag = panelUI.isOpen() && wuxPanel.visibleFlag;
                const panelState = { visibleFlag: visibleFlag };
                if (visibleFlag) {
                    panelState.width = wuxPanel.width;
                    panelState.height = wuxPanel.height;
                    panelState.position = Object.assign({}, wuxPanel.position);
                    panelState.currentDockArea = wuxPanel.currentDockArea;
                    panelState.activeFlag = wuxPanel.activeFlag;
                    panelState.debugCommandsVisibleFlag = debugCommandsVisibleFlag;
                }
                panelStates.set(viewMode, panelState);
                this._panelStateMap.set(panelUI, panelStates);
            }
        }
        /**
         * Restores the panel state to the provided view mode.
         * @private
         * @param {UIPanel} panelUI - The UI panel.
          *@param {UIEnums.EViewMode} viewMode - The view mode to restore.
         */
        _restorePanelState(panelUI, viewMode) {
            if (panelUI !== undefined) {
                const panelStates = this._panelStateMap.get(panelUI);
                if (panelStates !== undefined) {
                    const panelState = panelStates.get(viewMode);
                    if (panelState !== undefined) {
                        if (panelState.visibleFlag === true) {
                            if (!panelUI.isOpen()) {
                                panelUI.open();
                            }
                            // Specific to play panel
                            const isPlayPanel = panelUI === this._editor.getPlayPanel();
                            if (isPlayPanel && panelState.debugCommandsVisibleFlag !== undefined) {
                                panelUI.setDebugCommandsVisibleFlag(panelState.debugCommandsVisibleFlag);
                            }
                            const wuxPanel = panelUI.getWUXPanel();
                            wuxPanel.visibleFlag = true;
                            wuxPanel.currentDockArea = panelState.currentDockArea;
                            wuxPanel.width = panelState.width;
                            wuxPanel.height = panelState.height;
                            wuxPanel.position = Object.assign({}, panelState.position);
                            if (panelState.activeFlag) {
                                wuxPanel.activeFlag = true;
                                //panel.panel.ensureVisible();
                            }
                        }
                        else if (panelUI.isOpen()) {
                            panelUI.getWUXPanel().visibleFlag = false;
                        }
                    }
                }
            }
        }
        /**
         * Stores each docking element states.
         * @private
         * @param {DockingElementForImmersiveFrame} dockingElement - The docking element.
         * @param {UIEnums.EViewMode} viewMode - The view mode to store.
         */
        _storeDockingElementState(dockingElement, viewMode) {
            if (dockingElement !== undefined) {
                const dockingElementStates = this._dockingStateMap.get(dockingElement) || {};
                dockingElementStates[viewMode] = {
                    dockingZoneSize: dockingElement.dockingZoneSize,
                    collapseDockingZoneFlag: dockingElement.collapseDockingZoneFlag
                };
                this._dockingStateMap.set(dockingElement, dockingElementStates);
            }
        }
        /**
         * Restores each dockign element states to the provided view mode.
         * @private
         * @param {DockingElementForImmersiveFrame} dockingElement - The docking element.
         * @param {UIEnums.EViewMode} viewMode - The view mode to restore.
         */
        _restoreDockingElementState(dockingElement, viewMode) {
            if (dockingElement !== undefined) {
                const dockingElementStates = this._dockingStateMap.get(dockingElement);
                if (dockingElementStates !== undefined) {
                    const dockingElementState = dockingElementStates[viewMode];
                    if (dockingElementState !== undefined) {
                        dockingElement.dockingZoneSize = dockingElementState.dockingZoneSize;
                        dockingElement.collapseDockingZoneFlag = dockingElementState.collapseDockingZoneFlag;
                    }
                }
            }
        }
        /**
         * Initializes the panel state.
         * @private
         * @param {UIPanel} panelUI - The UI panel to initialize.
         */
        _initializePanelState(panelUI) {
            if (panelUI !== undefined) {
                const wuxPanel = panelUI.getWUXPanel();
                const panelStateByViewModeMap = new Map();
                Object.keys(UIEnums.EViewMode).forEach(viewMode => {
                    const state = UIEnums.EViewMode[viewMode];
                    panelStateByViewModeMap.set(state, {
                        width: wuxPanel.width,
                        height: wuxPanel.height,
                        position: Object.assign({}, wuxPanel.position),
                        visibleFlag: true,
                        currentDockArea: wuxPanel.currentDockArea
                    });
                });
                this._panelStateMap.set(panelUI, panelStateByViewModeMap);
            }
        }
    }
    return UIPanelStateController;
});
