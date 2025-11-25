/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUITabViewSwitcher'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUITabViewSwitcher", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUISwitchToEditTabDialog", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUITabViewSwitcher"], function (require, exports, UIDom, UIFontIcon, UIEnums, UISwitchToEditTabDialog) {
    "use strict";
    /**
     * This class defines a UI tab view switcher.
     * @private
     * @class UITabViewSwitcher
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUITabViewSwitcher
     */
    class UITabViewSwitcher {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor The UI editor.
         */
        constructor(editor) {
            this._editor = editor;
            this._initialize();
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
         * Removes the component.
         * @public
         */
        remove() {
            this._editor = undefined;
            this._tabFrame = undefined;
            this._tabContainer = undefined;
            this._editTab = undefined;
            this._playTab = undefined;
            this._debugTab = undefined;
            this._currentViewMode = undefined;
            this._currentActiveTab = undefined;
            if (this._switchToEditTabDialog) {
                this._switchToEditTabDialog.remove();
                this._switchToEditTabDialog = undefined;
            }
        }
        /**
         * Sets the edit active tab.
         * @public
         */
        setEditActiveTab() {
            this._onTabClick(this._editTab);
        }
        /**
         * Gets the current view mode.
         * @public
         * @returns {UIEnums.EViewMode} The current view mode.
         */
        getCurrentViewMode() {
            return this._currentViewMode;
        }
        /**
         * Checks if the current view is the debug view.
         * @public
         * @returns {boolean} Whether the current view is the debug view.
         */
        isDebugActiveTab() {
            return this._currentViewMode === UIEnums.EViewMode.eDebug;
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
         * Initializes the component.
         * @private
         */
        _initialize() {
            this._tabFrame = UIDom.createElement('div', { className: 'sch-tabview-frame', parent: this._editor.getDomElement() });
            this._tabContainer = UIDom.createElement('ul', { className: 'sch-tabview-container', parent: this._tabFrame });
            this._editTab = UIDom.createElement('li', {
                className: ['sch-tabview-element', 'sch-tabview-edit', 'active'],
                parent: this._tabContainer,
                children: [
                    UIFontIcon.createFAFontIcon('pencil', { className: [UIFontIcon.getWUXFAClassName('lg')] }),
                    UIDom.createElement('span', { textContent: 'Edit' })
                ],
                onclick: () => this._onTabClick(this._editTab),
                tooltipInfos: { shortHelp: 'Switch to edit mode' }
            });
            this._playTab = UIDom.createElement('li', {
                className: ['sch-tabview-element', 'sch-tabview-play'],
                parent: this._tabContainer,
                children: [
                    UIFontIcon.createFAFontIcon('play-circle', { className: [UIFontIcon.getWUXFAClassName('lg')] }),
                    UIDom.createElement('span', { textContent: 'Play' })
                ],
                onclick: () => this._onTabClick(this._playTab),
                tooltipInfos: { shortHelp: 'Switch to play mode' }
            });
            this._debugTab = UIDom.createElement('li', {
                className: ['sch-tabview-element', 'sch-tabview-debug'],
                parent: this._tabContainer,
                children: [
                    UIFontIcon.createFAFontIcon('bug', { className: [UIFontIcon.getWUXFAClassName('lg')] }),
                    UIDom.createElement('span', { textContent: 'Debug' })
                ],
                onclick: () => this._onTabClick(this._debugTab),
                tooltipInfos: { shortHelp: 'Switch to debug mode' }
            });
            this._updateTabFrameColor();
        }
        /**
         * Updates the tab frame color.
         * @private
         */
        _updateTabFrameColor() {
            const classNames = ['sch-activetab-edit', 'sch-activetab-play', 'sch-activetab-debug'];
            UIDom.removeClassName(this._editor.getImmersiveFrame().getContent(), classNames);
            let activeClassName = undefined;
            if (this._currentViewMode === UIEnums.EViewMode.eEdit) {
                activeClassName = classNames[0];
            }
            else if (this._currentViewMode === UIEnums.EViewMode.ePlay) {
                activeClassName = classNames[1];
            }
            else if (this._currentViewMode === UIEnums.EViewMode.eDebug) {
                activeClassName = classNames[2];
            }
            if (activeClassName) {
                UIDom.addClassName(this._editor.getImmersiveFrame().getContent(), activeClassName);
            }
        }
        /**
         * The callback on the tab click.
         * @private
         * @param {HTMLLIElement} tab - The clicked tab.
         */
        _onTabClick(tab) {
            if (tab !== this._currentActiveTab) {
                const callback = () => {
                    const panelStateController = this._editor.getPanelStateController();
                    if (panelStateController) {
                        panelStateController.storePanelStates(this._currentViewMode);
                        const options = this._editor.getOptions().tabViewMode;
                        let clickCB = undefined;
                        if (tab === this._editTab) {
                            this._currentViewMode = UIEnums.EViewMode.eEdit;
                            clickCB = options?.onEditTabViewClick;
                            this._switchDrawersVisibleState(true);
                        }
                        else if (tab === this._playTab) {
                            this._currentViewMode = UIEnums.EViewMode.ePlay;
                            clickCB = options?.onPlayTabViewClick;
                            this._switchDrawersVisibleState(false);
                        }
                        else if (tab === this._debugTab) {
                            this._currentViewMode = UIEnums.EViewMode.eDebug;
                            clickCB = options?.onDebugTabViewClick;
                            this._switchDrawersVisibleState(false);
                        }
                        panelStateController.restorePanelStates(this._currentViewMode);
                        this._currentActiveTab = tab;
                        UIDom.removeClassName(this._editTab, 'active');
                        UIDom.removeClassName(this._playTab, 'active');
                        UIDom.removeClassName(this._debugTab, 'active');
                        UIDom.addClassName(tab, 'active');
                        this._updateTabFrameColor();
                        if (typeof clickCB === 'function') {
                            clickCB();
                        }
                    }
                };
                const playingState = this._editor.getTraceController().getPlayingState();
                if (tab === this._editTab && playingState) {
                    this._switchToEditTabDialog = new UISwitchToEditTabDialog(this._editor, () => {
                        const playPanel = this._editor.getPlayPanel();
                        playPanel?.stop();
                        callback();
                    });
                    this._switchToEditTabDialog.open();
                }
                else {
                    callback();
                }
            }
        }
        /**
         * Switches the visibility state of the graph drawers.
         * @private
         * @param {boolean} isEditMode - True for edit mode else false.
         */
        _switchDrawersVisibleState(isEditMode) {
            const tabViewMode = this._editor.getOptions().tabViewMode;
            if (tabViewMode !== undefined && tabViewMode.testEditor !== undefined) {
                const graph = this._editor.getViewerController().getRootViewer().getMainGraph();
                const graphInputDataDrawer = graph.getInputDataDrawer();
                const graphOutputDataDrawer = graph.getOutputDataDrawer();
                const graphInputDataTestDrawer = graph.getInputDataTestDrawer();
                const graphOutputDataTestDrawer = graph.getOutputDataTestDrawer();
                if (graphInputDataDrawer) {
                    if (isEditMode) {
                        graphInputDataDrawer.show();
                    }
                    else {
                        graphInputDataDrawer.hide();
                    }
                }
                if (graphOutputDataDrawer) {
                    if (isEditMode) {
                        graphOutputDataDrawer.show();
                    }
                    else {
                        graphOutputDataDrawer.hide();
                    }
                }
                if (graphInputDataTestDrawer) {
                    if (isEditMode) {
                        graphInputDataTestDrawer.hide();
                    }
                    else {
                        graphInputDataTestDrawer.show();
                    }
                }
                if (graphOutputDataTestDrawer) {
                    if (isEditMode) {
                        graphOutputDataTestDrawer.hide();
                    }
                    else {
                        graphOutputDataTestDrawer.show();
                    }
                }
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                      ___  ____ _____                                           //
        //                                     / _ \|  _ \_   _|                                          //
        //                                    | | | | | | || |                                            //
        //                                    | |_| | |_| || |                                            //
        //                                     \___/|____/ |_|                                            //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the current active tab.
         * @private
         * @ignore
         * @returns {HTMLLIElement} The current active tab.
         */
        _getCurrentActiveTab() {
            return this._currentActiveTab;
        }
        /**
         * Gets the edit tab.
         * @private
         * @ignore
         * @returns {HTMLLIElement} The edit tab.
         */
        _getEditTab() {
            return this._editTab;
        }
        /**
         * Gets the play tab.
         * @private
         * @ignore
         * @returns {HTMLLIElement} The play tab.
         */
        _getPlayTab() {
            return this._playTab;
        }
        /**
         * Gets the debug tab.
         * @private
         * @ignore
         * @returns {HTMLLIElement} The debug tab.
         */
        _getDebugTab() {
            return this._debugTab;
        }
        /**
         * Gets the switch to edit tab dialog.
         * @private
         * @ignore
         * @returns {UISwitchToEditTabDialog} The switch to edit tab dialog.
         */
        _getSwitchToEditTabDialog() {
            return this._switchToEditTabDialog;
        }
    }
    return UITabViewSwitcher;
});
