/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUINodeIdSelectorsPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUINodeIdSelectorsPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVNodeIdSelector", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUINodeIdSelectorsPanel"], function (require, exports, UIPanel, UIFontIcon, UICommandType, UIDom, UIEvents, UIDGVNodeIdSelector, UINLS, Tools) {
    "use strict";
    /**
     * This class defines a UI nodeId selector panel.
     * @private
     * @class UINodeIdSelectorsPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUINodeIdSelectorsPanel
     * @extends UIPanel
     */
    class UINodeIdSelectorsPanel extends UIPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                immersiveFrame: editor.getImmersiveFrame(),
                title: UINLS.get('panelTitleNodeIdSelectors'),
                currentDockArea: editor.getOptions().blockLibraryDockArea,
                width: 500,
                height: 900,
                className: ['sch-nodeidselector-panel'],
                icon: UIFontIcon.getWUXIconFromCommand(UICommandType.eOpenNodeIdSelectorsPanel),
                stackInWindowGroup: true
            });
            this._onViewerChangeCB = this._onViewerChange.bind(this);
            this._paintModeEnabled = false;
            this._editor = editor;
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
         * Removes the panel.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the panel!
            this._editor = undefined;
            this._onViewerChangeCB = undefined;
            this._paintModeEnabled = undefined;
            this._currentGraph = undefined;
            this._dataGridView = undefined;
        }
        /**
         * Refreshes the panel content.
         * @private
         */
        _refreshContent() {
            if (this.isOpen()) {
                if (this._dataGridView !== undefined) {
                    this.getContent().removeChild(this._dataGridView.getElement());
                    this._dataGridView.remove();
                    this._dataGridView = undefined;
                }
                this._createDataGridView();
                if (this.getWUXPanel().getContentVisibleState()) {
                    this.colorizeBlocks();
                    this._currentGraph?.getNodeIdSelectorController().updateNodeIdSelectorsCount();
                }
            }
        }
        /**
         * Sets the block nodeId selector.
         * @public
         * @param {UIBlock} block - The UI block.
         * @returns {boolean} True if the nodeId selector has been set, false otherwise.
         */
        setBlockNodeIdSelector(block) {
            const nodeIdSelectorId = this._dataGridView.getCurrentNodeIdSelectorId();
            const result = block.getModel().setNodeIdSelector(nodeIdSelectorId);
            if (result) {
                this._currentGraph?.getNodeIdSelectorController().updateNodeIdSelectorsCount();
            }
            return result;
        }
        /**
         * Colorizes the blocks.
         * @public
         */
        colorizeBlocks() {
            this._currentGraph?.getBlocks().forEach(block => this.colorizeBlock(block));
        }
        /**
         * Colorizes the block.
         * @public
         * @param {UIBlock} block - The UI block.
         */
        colorizeBlock(block) {
            if (this._currentGraph !== undefined) {
                UIDom.addClassName(document.body, 'sch-nodeidselector-displayed');
                const blockView = block.getView();
                const nodeIdSelectorName = block.getModel().getNodeIdSelector();
                if (nodeIdSelectorName === Tools.parentNodeIdSelector) {
                    const parentColor = '8C8C8C';
                    blockView.setBackgroundColor(parentColor);
                }
                else {
                    const nodeIdSelector = this._currentGraph.getModel().getNodeIdSelectorByName(nodeIdSelectorName);
                    if (nodeIdSelector !== undefined) {
                        const index = this._currentGraph.getModel().getNodeIdSelectors().indexOf(nodeIdSelector);
                        if (index !== -1) {
                            const color = this._currentGraph.getNodeIdSelectorController().getColor(index);
                            blockView.setBackgroundColor(color);
                        }
                    }
                    else {
                        blockView.removeBackgroundColor();
                    }
                }
            }
        }
        /**
         * Checks if the paint mode is enabled.
         * @public
         * @returns {boolean} True if the paint mode is enabled else false.
         */
        isPaintModeEnabled() {
            return this._paintModeEnabled;
        }
        /**
         * Enables the paint mode.
         * @public
         */
        enablePaintMode() {
            this._paintModeEnabled = true;
            UIDom.addClassName(document.body, 'sch-nodeidselector-paint-mode');
        }
        /**
         * Disables the paint mode.
         * @public
         */
        disablePaintMode() {
            this._paintModeEnabled = false;
            UIDom.removeClassName(document.body, 'sch-nodeidselector-paint-mode');
        }
        /**
         * Gets the data grid view nodeId selector.
         * @public
         * @returns {UIDGVNodeIdSelector} The data grid view nodeId selector.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the panel close event.
         * @protected
         * @override
         */
        _onClose() {
            this.disablePaintMode();
            this._uncolorizeblocks();
            if (this._dataGridView) {
                this._dataGridView.remove();
                this._dataGridView = undefined;
            }
            if (this._editor !== undefined) {
                this._editor.removeListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeCB);
            }
            this._currentGraph = undefined;
            this._paintModeEnabled = undefined;
            super._onClose();
        }
        /**
         * Creates the panel content.
         * @protected
         * @abstract
         */
        _createContent() {
            this._paintModeEnabled = false;
            this._currentGraph = this._editor.getViewerController().getCurrentViewer().getMainGraph();
            this._editor.addListener(UIEvents.UIViewerChangeEvent, this._onViewerChangeCB);
            this._createDataGridView();
            this.colorizeBlocks();
        }
        /**
         * The callback on the panel content visible state change event.
         * @protected
         * @override
         * @param {WUX.Event} event - The panel content visible state change event.
         */
        _onContentVisibleStateChange(event) {
            this.disablePaintMode();
            if (event.dsModel.contentVisibleState) {
                this.colorizeBlocks();
            }
            else {
                this._uncolorizeblocks();
            }
            super._onContentVisibleStateChange(event);
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
         * Creates the data grid view.
         * @private
         */
        _createDataGridView() {
            const graphUI = this._editor.getViewerController().getCurrentViewer().getMainGraph();
            this._dataGridView = new UIDGVNodeIdSelector(graphUI);
            this.getContent().appendChild(this._dataGridView.getElement());
        }
        /**
         * The callback on the viewer change event.
         * @private
         * @param {UIEvents.UIViewerChangeEvent} event - The UI viewer change event.
         */
        _onViewerChange(event) {
            this._currentGraph = event.getViewer().getMainGraph();
            this._refreshContent();
        }
        /**
         * Uncolorizes the blocks.
         * @private
         */
        _uncolorizeblocks() {
            UIDom.removeClassName(document.body, 'sch-nodeidselector-displayed');
            const viewers = this._editor.getViewerController().getRootViewerWithAllViewers();
            viewers.forEach(viewer => {
                viewer.getMainGraph().getBlocks().forEach(block => {
                    block.getView().removeBackgroundColor();
                });
            });
        }
    }
    return UINodeIdSelectorsPanel;
});
