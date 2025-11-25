/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIGraphToolbar'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIGraphToolbar", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/components/EPSSchematicsUICommandButton", "DS/EPSSchematicsUI/components/EPSSchematicsUICommandToggleButton", "DS/EPSSchematicsUI/components/EPSSchematicsUICommandNotificationButton", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIEditorSettingsDialog", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphBlockDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIGraphToolbar"], function (require, exports, UIDom, UICommandButton, UICommandToggleButton, UICommandNotificationButton, UICommand, UICommandType, UIEditorSettingsDialog, UIGraphBlockDialog, UITools, UINLS) {
    "use strict";
    /**
     * This class defines a graph toolbar.
     * @private
     * @class UIGraphToolbar
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIGraphToolbar
     */
    class UIGraphToolbar {
        static { this.kGraphBorderSize = 5.0; }
        static { this.kGraphBorderHalfSize = UIGraphToolbar.kGraphBorderSize / 2; }
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The UI graph.
         */
        constructor(graph) {
            this._onButtonClickCB = this._onButtonClick.bind(this);
            this._commandButtons = [];
            this._graph = graph;
            this._viewer = this._graph.getViewer();
            this._editor = this._graph.getEditor();
            this._editorSettingsDialog = new UIEditorSettingsDialog(this._editor);
            this._graphConfigDialog = new UIGraphBlockDialog(this._graph);
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
            this._commandButtons.forEach(commandButton => commandButton.remove());
            this._commandButtons = undefined;
            this._blockLibraryButton = undefined;
            this._typeLibraryButton = undefined;
            this._debugConsoleButton = undefined;
            this._historyButton = undefined;
            this._graphConfigButton = undefined;
            this._graphLoadButton = undefined;
            this._graphSaveButton = undefined;
            this._graphClearButton = undefined;
            this._graphAnalyzerButton = undefined;
            this._graphDataLinkMinimizerButton = undefined;
            this._graphContrastButton = undefined;
            this._graphNodeIdSelectorsButton = undefined;
            this._commentButton = undefined;
            this._editorSettingsButton = undefined;
            this._expanderButton = undefined;
            const viewerContent = this._viewer.getContainer();
            if (viewerContent !== undefined) {
                viewerContent.removeChild(this._toolbarElt);
            }
            if (this._editorSettingsDialog !== undefined) {
                this._editorSettingsDialog.remove();
                this._editorSettingsDialog = undefined;
            }
            if (this._graphConfigDialog) {
                this._graphConfigDialog.close();
                this._graphConfigDialog = undefined;
            }
            this._graph = undefined;
            this._viewer = undefined;
            this._editor = undefined;
            this._toolbarElt = undefined;
            this._expanderContainerElt = undefined;
            this._onButtonClickCB = undefined;
        }
        /**
         * Updates the graph toolbar position.
         * @public
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        updatePosition(vpt) {
            let toolbarLeft, toolbarTop;
            const vpx = vpt.translationX;
            const vpy = vpt.translationY;
            const vps = vpt.scale;
            const scale = vps < 1.0 ? vps : 1.0;
            const toolbarBBox = this._toolbarElt.getBoundingClientRect();
            const viewHeight = this._graph.getViewer().getHeight();
            const graphTop = this._graph.getTop();
            const graphHeight = this._graph.getHeight();
            const graphLeft = this._graph.getLeft();
            const graphWidth = this._graph.getWidth();
            // Compute the toolbar left position
            const isLeftBorderVisible = (vpx / vps) + graphLeft + UIGraphToolbar.kGraphBorderHalfSize >= 0;
            if (!isLeftBorderVisible) {
                const fixedLeft = 0;
                const rightLimit = vpx + (graphLeft * vps) + (graphWidth * vps) - (UIGraphToolbar.kGraphBorderHalfSize * vps) - toolbarBBox.width;
                toolbarLeft = fixedLeft > rightLimit ? rightLimit : fixedLeft;
            }
            else {
                toolbarLeft = vpx + (graphLeft * vps) + (UIGraphToolbar.kGraphBorderHalfSize * vps);
            }
            // Compute the toolbar top position
            const isBottomBorderVisible = (vpy / vps) + graphTop + graphHeight - UIGraphToolbar.kGraphBorderHalfSize <= viewHeight / vps;
            if (!isBottomBorderVisible) {
                const fixedTop = viewHeight - toolbarBBox.height;
                const topLimit = vpy + (graphTop * vps) + (UIGraphToolbar.kGraphBorderHalfSize * vps);
                toolbarTop = fixedTop < topLimit ? topLimit : fixedTop;
            }
            else {
                toolbarTop = vpy + (graphTop * vps) + (graphHeight * vps) - toolbarBBox.height - (UIGraphToolbar.kGraphBorderHalfSize * vps);
            }
            // Update the toolbar scale and position
            this._toolbarElt.style.transform = 'matrix(' + scale + ',0,0,' + scale + ',' + Math.round(toolbarLeft) + ',' + Math.round(toolbarTop) + ')';
            const padding = vps < 1.0 ? 5 : 5 * vps;
            this._toolbarElt.style.padding = padding + 'px';
        }
        /**
         * Gets the block library button.
         * @public
         * @returns {UICommandButton} The block library button.
         */
        getBlockLibraryButton() {
            return this._blockLibraryButton;
        }
        /**
         * Gets the type library button.
         * @public
         * @returns {UICommandButton} The type library button.
         */
        getTypeLibraryButton() {
            return this._typeLibraryButton;
        }
        /**
         * Gets the debug console button.
         * @public
         * @returns {UICommandNotificationButton} The debug console button.
         */
        getDebugConsoleButton() {
            return this._debugConsoleButton;
        }
        /**
         * Gets the history button.
         * @public
         * @returns {UICommandButton} The history button.
         */
        getHistoryButton() {
            return this._historyButton;
        }
        /**
         * Gets the graph configuration button.
         * @public
         * @returns {UICommandButton} The graph configuration button.
         */
        getGraphConfigurationButton() {
            return this._graphConfigButton;
        }
        /**
         * Gets the graph load button.
         * @public
         * @returns {UICommandButton} The graph load button.
         */
        getGraphLoadButton() {
            return this._graphLoadButton;
        }
        /**
         * Gets the graph save button.
         * @public
         * @returns {UICommandButton} The graph save button.
         */
        getGraphSaveButton() {
            return this._graphSaveButton;
        }
        /**
         * Gets the graph clear button.
         * @public
         * @returns {UICommandButton} The graph clear button.
         */
        getGraphClearButton() {
            return this._graphClearButton;
        }
        /**
         * Gets the graph analyzer button.
         * @public
         * @returns {UICommandToggleButton} The graph analyzer button.
         */
        getGraphAnalyzerButton() {
            return this._graphAnalyzerButton;
        }
        /**
         * Gets the graph data link minimizer button.
         * @public
         * @returns {UICommandToggleButton} The graph data link minimizer button.
         */
        getGraphDataLinkMinimizerButton() {
            return this._graphDataLinkMinimizerButton;
        }
        /**
         * Gets the graph contrast button.
         * @public
         * @returns {UICommandButton} The graph contrast button.
         */
        getGraphContrastButton() {
            return this._graphContrastButton;
        }
        /**
         * Gets the graph nodeId selectors button.
         * @public
         * @returns {UICommandButton} The graph nodeId selectors button.
         */
        getGraphNodeIdSelectorsButton() {
            return this._graphNodeIdSelectorsButton;
        }
        /**
         * Gets the comment button.
         * @public
         * @returns {UICommandButton} The comment button.
         */
        getCommentButton() {
            return this._commentButton;
        }
        /**
         * Gets the editor settings button.
         * @public
         * @returns {UICommandButton} The graph editor settings button.
         */
        getEditorSettingsButton() {
            return this._editorSettingsButton;
        }
        /**
         * Gets the expander button.
         * @public
         * @returns {UICommandToggleButton} The expander button.
         */
        getExpanderButton() {
            return this._expanderButton;
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
         * Initializes the graph toolbar.
         * @private
         */
        _initialize() {
            this._toolbarElt = UIDom.createElement('div', { className: 'sch-graph-toolbar', parent: this._viewer.getContainer() });
            this._blockLibraryButton = new UICommandButton({
                command: new UICommand(UICommandType.eOpenBlockLibrary, this._onButtonClickCB),
                parent: this._toolbarElt
            });
            this._commandButtons.push(this._blockLibraryButton);
            this._typeLibraryButton = new UICommandButton({
                command: new UICommand(UICommandType.eOpenTypeLibraryPanel, this._onButtonClickCB),
                parent: this._toolbarElt
            });
            this._commandButtons.push(this._typeLibraryButton);
            this._debugConsoleButton = new UICommandNotificationButton({
                command: new UICommand(UICommandType.eDebugConsole, this._onButtonClickCB),
                parent: this._toolbarElt
            }, this._editor.getDebugConsoleController());
            this._commandButtons.push(this._debugConsoleButton);
            this._historyButton = new UICommandButton({
                command: new UICommand(UICommandType.eOpenHistoryPanel, this._onButtonClickCB),
                parent: this._toolbarElt
            });
            this._commandButtons.push(this._historyButton);
            this._graphConfigButton = new UICommandButton({
                command: new UICommand(UICommandType.eOpenGraphConfiguration, this._onButtonClickCB),
                className: 'sch-graph-toolbar-button-configuration',
                parent: this._toolbarElt
            });
            this._commandButtons.push(this._graphConfigButton);
            this._createExpanderToolbar();
        }
        /**
         * Creates the expander toolbar part.
         * @private
         */
        _createExpanderToolbar() {
            const options = this._editor.getOptions();
            if (options.hideGraphToolbarButton !== 511 /* UIEnums.FGraphToolbarButton.fAllButton */) {
                this._expanderContainerElt = UIDom.createElement('div', { className: 'sch-graph-toolbar-expander-container' });
                const showButton = (option, value) => {
                    return option !== undefined ? !UITools.hasEnumFlag(option, value) : true;
                };
                const expandButton = (option, value) => {
                    return option !== undefined ? UITools.hasEnumFlag(option, value) : true;
                };
                if (showButton(options.hideGraphToolbarButton, 1 /* UIEnums.FGraphToolbarButton.fLoad */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 1 /* UIEnums.FGraphToolbarButton.fLoad */);
                    this._graphLoadButton = new UICommandButton({
                        className: 'sch-graph-toolbar-button-open',
                        command: new UICommand(UICommandType.eOpenFile, () => {
                            const rootViewer = this._editor.getViewerController().getRootViewer();
                            const callback = options.onOpen || rootViewer.loadFile.bind(rootViewer);
                            callback();
                        }),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt
                    });
                    this._commandButtons.push(this._graphLoadButton);
                }
                if (showButton(options.hideGraphToolbarButton, 2 /* UIEnums.FGraphToolbarButton.fSave */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 2 /* UIEnums.FGraphToolbarButton.fSave */);
                    this._graphSaveButton = new UICommandButton({
                        className: 'sch-graph-toolbar-button-save',
                        command: new UICommand(UICommandType.eSaveFile, () => {
                            const rootViewer = this._editor.getViewerController().getRootViewer();
                            const callback = options.onSave || rootViewer.saveFile.bind(rootViewer);
                            callback();
                        }),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt
                    });
                    this._commandButtons.push(this._graphSaveButton);
                }
                if (showButton(options.hideGraphToolbarButton, 4 /* UIEnums.FGraphToolbarButton.fClear */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 4 /* UIEnums.FGraphToolbarButton.fClear */);
                    const rootViewer = this._editor.getViewerController().getRootViewer();
                    this._graphClearButton = new UICommandButton({
                        className: 'sch-graph-toolbar-button-clear',
                        command: new UICommand(UICommandType.eClearGraph, rootViewer.clearGraph.bind(rootViewer)),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt
                    });
                    this._commandButtons.push(this._graphClearButton);
                }
                if (showButton(options.hideGraphToolbarButton, 8 /* UIEnums.FGraphToolbarButton.fGraphAnalyzer */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 8 /* UIEnums.FGraphToolbarButton.fGraphAnalyzer */);
                    this._graphAnalyzerButton = new UICommandToggleButton({
                        command: new UICommand(UICommandType.eGraphAnalyzer),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt,
                        toggleCB: this._graph.setGraphAnalyzerState.bind(this._graph),
                        checked: this._graph.getGraphAnalyzerState()
                    });
                    this._commandButtons.push(this._graphAnalyzerButton);
                }
                if (showButton(options.hideGraphToolbarButton, 16 /* UIEnums.FGraphToolbarButton.fDataLinkMinimizer */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 16 /* UIEnums.FGraphToolbarButton.fDataLinkMinimizer */);
                    this._graphDataLinkMinimizerButton = new UICommandToggleButton({
                        command: new UICommand(UICommandType.eMinimizeDataLinks),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt,
                        toggleCB: this._graph.setDataLinksMinimizerState.bind(this._graph),
                        checked: this._graph.getDataLinksMinimizerState()
                    });
                    this._commandButtons.push(this._graphDataLinkMinimizerButton);
                }
                if (showButton(options.hideGraphToolbarButton, 32 /* UIEnums.FGraphToolbarButton.fContrast */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 32 /* UIEnums.FGraphToolbarButton.fContrast */);
                    this._graphContrastButton = new UICommandButton({
                        command: new UICommand(UICommandType.eSwitchContrast, this._viewer.switchGraphContrast.bind(this._viewer)),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt
                    });
                    this._commandButtons.push(this._graphContrastButton);
                }
                if (showButton(options.hideGraphToolbarButton, 64 /* UIEnums.FGraphToolbarButton.fNodeIdSelectors */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 64 /* UIEnums.FGraphToolbarButton.fNodeIdSelectors */);
                    this._graphNodeIdSelectorsButton = new UICommandButton({
                        command: new UICommand(UICommandType.eOpenNodeIdSelectorsPanel, this._onButtonClickCB),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt
                    });
                    this._commandButtons.push(this._graphNodeIdSelectorsButton);
                }
                if (showButton(options.hideGraphToolbarButton, 128 /* UIEnums.FGraphToolbarButton.fCreateComment */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 128 /* UIEnums.FGraphToolbarButton.fCreateComment */);
                    this._commentButton = new UICommandButton({
                        className: 'sch-graph-toolbar-button-comment',
                        command: new UICommand(UICommandType.eCreateComment, () => { this._graph.createComment(); }),
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt
                    });
                    this._commandButtons.push(this._commentButton);
                }
                if (showButton(options.hideGraphToolbarButton, 256 /* UIEnums.FGraphToolbarButton.fEditorSettings */)) {
                    const isExpanded = expandButton(options.expandGraphToolbarButton, 256 /* UIEnums.FGraphToolbarButton.fEditorSettings */);
                    this._editorSettingsButton = new UICommandButton({
                        command: new UICommand(UICommandType.eOpenEditorSettings, this._onButtonClickCB),
                        className: 'sch-graph-toolbar-button-editor-settings',
                        parent: isExpanded ? this._toolbarElt : this._expanderContainerElt
                    });
                    this._commandButtons.push(this._editorSettingsButton);
                }
                if (this._expanderContainerElt.children.length > 0) {
                    this._toolbarElt.appendChild(this._expanderContainerElt);
                    this._expanderButton = new UICommandToggleButton({
                        command: new UICommand(UICommandType.eToolbarExpander, this._onButtonClickCB),
                        parent: this._toolbarElt,
                        className: 'sch-graph-toolbar-button-expander'
                    });
                    this._commandButtons.push(this._expanderButton);
                }
            }
        }
        /**
         * The callback on the button click event.
         * @private
         * @param {MouseEvent} event - The button click event.
         */
        _onButtonClick(event) {
            const buttonElt = event.currentTarget;
            if (buttonElt === this._blockLibraryButton.getElement()) {
                this._editor.getBlockLibraryPanel().switchVisibility();
            }
            else if (buttonElt === this._typeLibraryButton.getElement()) {
                this._editor.getTypeLibraryPanel().switchVisibility();
            }
            else if (buttonElt === this._debugConsoleButton.getElement()) {
                this._editor.getDebugConsolePanel().switchVisibility();
            }
            else if (buttonElt === this._graphConfigButton.getElement()) {
                this._graphConfigDialog.open();
            }
            else if (buttonElt === this._historyButton.getElement()) {
                this._editor.getHistoryPanel().switchVisibility();
            }
            else if (buttonElt === this._graphNodeIdSelectorsButton.getElement()) {
                this._editor.getNodeIdSelectorsPanel().switchVisibility();
            }
            else if (buttonElt === this._editorSettingsButton.getElement()) {
                this._editorSettingsDialog.open();
            }
            else if (buttonElt === this._expanderButton.getElement()) {
                this._switchExpander();
            }
        }
        /**
         * Switches the opening or the closing of the toolbar expander.
         * @private
         */
        _switchExpander() {
            UIDom.toggleClassName(this._expanderContainerElt, 'expanded');
            const shortHelp = this._expanderButton.getCheckedState() ? UINLS.get('shortHelpHideEditorOptions') : UINLS.get('shortHelpShowEditorOptions');
            this._expanderButton.setShortHelp(shortHelp);
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
         * Gets the toolbar element.
         * @private
         * @ignore
         * @returns {HTMLDivElement} The toolbar element.
         */
        _getToolbarElt() {
            return this._toolbarElt;
        }
        /**
         * Gets the expander container element.
         * @private
         * @ignore
         * @returns {HTMLDivElement} The expander container element.
         */
        _getExpanderContainerElt() {
            return this._expanderContainerElt;
        }
        /**
         * Gets the editor settings dialog.
         * @private
         * @ignore
         * @returns {UIEditorSettingsDialog} The editor settings dialog.
         */
        _getEditorSettingsDialog() {
            return this._editorSettingsDialog;
        }
        /**
         * Gets the graph configuration dialog.
         * @private
         * @ignore
         * @returns {UIGraphBlockDialog} The graph configuration dialog.
         */
        _getGraphConfigurationDialog() {
            return this._graphConfigDialog;
        }
    }
    return UIGraphToolbar;
});
