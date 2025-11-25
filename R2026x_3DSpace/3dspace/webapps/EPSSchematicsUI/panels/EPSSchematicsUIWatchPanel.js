/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUIWatchPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUIWatchPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVWatch", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/CoreBase/WebUXGlobalEnums", "DS/Controls/LineEditor", "DS/Controls/Button", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUIWatchPanel"], function (require, exports, UIPanel, UIDGVWatch, UIDom, UIFontIcon, UIWUXTools, WebUXGlobalEnums_1, WUXLineEditor, WUXButton, Block, GraphBlock, UIBlock, UIKeyboard, UINLS) {
    "use strict";
    /**
     * This class defines a UI watch panel.
     * @private
     * @class UIWatchPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUIWatchPanel
     * @extends UIPanel
     */
    class UIWatchPanel extends UIPanel {
        static { this._width = 400; }
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                immersiveFrame: editor.getImmersiveFrame(),
                title: UINLS.get('panelTitleWatch'),
                maximizeButtonFlag: false,
                closeButtonFlag: false,
                currentDockArea: editor.getOptions().watchPanel?.dockArea || WebUXGlobalEnums_1.WUXDockAreaEnum.RightDockArea,
                horizontallyStretchableFlag: false,
                verticallyStretchableFlag: false,
                className: ['sch-watch-panel'],
                icon: UIFontIcon.getWUX3DSIconDefinition('eye'),
                width: UIWatchPanel._width,
                minHeight: 300,
                height: 300
            });
            this._editor = editor;
        }
        /**
         * Removes the panel.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the panel!
            this._editor = undefined;
            this._dataGridView = undefined;
        }
        /**
         * Add the data port to the user scope.
         * @public
         * @param {string} path - The data port path.
         */
        addDataPortToUserScope(path) {
            this._dataGridView.addDataPortToUserScope(path);
        }
        /**
         * Gets the watch data grid view UI.
         * @public
         * @returns {UIDGVWatch} The watch data grid view UI.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * The callback on the panel open event.
         * @protected
         * @override
         */
        _onOpen() {
            super._onOpen();
            const currentDockArea = this._panel.currentDockArea;
            const dockingElt = this._panel.immersiveFrame.getDockingElement(currentDockArea);
            dockingElt.dockingZoneSize = UIWatchPanel._width;
        }
        /**
         * The callback on the panel close event.
         * @protected
         * @override
         */
        _onClose() {
            if (this._dataGridView !== undefined) {
                this._dataGridView.remove();
                this._dataGridView = undefined;
            }
            super._onClose();
        }
        /**
         * Creates the panel content.
         * @protected
         */
        _createContent() {
            const identifyContainer = UIDom.createElement('div', { className: 'sch-identify-container' });
            this.getContent().appendChild(identifyContainer);
            UIDom.createElement('span', {
                className: 'sch-label-property',
                parent: identifyContainer,
                textContent: 'Identify block:'
            });
            this._identifyLineEditor = new WUXLineEditor({
                placeholder: 'Enter a block id',
                //requiredFlag: true,
                displayClearFieldButtonFlag: true,
                pattern: '',
                value: '',
                disabled: false
            }).inject(identifyContainer);
            this._identifyLineEditor.addEventListener('keydown', (event) => {
                const blockPath = this._identifyLineEditor.value.trim();
                this._identifyButton.disabled = blockPath.length === 0;
                if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnter)) {
                    this._identifyBlock(blockPath);
                }
            });
            this._identifyLineEditor.addEventListener('uncommittedChange', (_event) => {
                this._identifyButton.disabled = this._identifyLineEditor.valueToCommit.trim().length === 0;
            });
            this._identifyButton = new WUXButton({
                emphasize: 'secondary',
                disabled: true,
                icon: UIFontIcon.getWUXFAIconDefinition('search'),
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Click to identify the block' }),
                onClick: () => this._identifyBlock(this._identifyLineEditor.value.trim())
            });
            this._identifyButton.inject(identifyContainer);
            this._dataGridView = new UIDGVWatch(this._editor);
            this.getContent().appendChild(this._dataGridView.getElement());
        }
        /**
         * Identifies the block according to the given block path.
         * @private
         * @param {string} blockPath - The path to the block.
         */
        _identifyBlock(blockPath) {
            if (blockPath.length > 0) {
                // $ref:$.blocks[0].blocks[0]
                // blocks[0]/blocks[0]
                // $ref:$.blocks[0].containedGraph.blocks[0]
                // blocks[0]/blocks[0]
                const mainGraph = this._editor.getViewerController().getRootViewer().getMainGraph();
                const block = mainGraph.getModel().getObjectFromPath(blockPath);
                if (block instanceof Block) {
                    const blockUIPath = block.toPath();
                    const parentGraph = block.graph;
                    if (parentGraph instanceof GraphBlock) {
                        if (parentGraph !== mainGraph.getModel()) {
                            mainGraph.openGraphBlockFromPath(blockUIPath);
                        }
                        const blockUI = mainGraph.getObjectFromPath(blockUIPath);
                        if (blockUI instanceof UIBlock) {
                            const viewer = blockUI.getGraph().getViewer();
                            viewer.replaceSelection(blockUI.getDisplay());
                            viewer.centerView(blockUI);
                        }
                    }
                }
                else {
                    this._editor.displayNotification({
                        level: 'warning',
                        title: 'Invalid block id',
                        subtitle: 'The block id "' + blockPath + '" is invalid.'
                    });
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
         * Gets the identify line editor for ODT.
         * @private
         * @ignore
         * @returns {WUXLineEditor} The identify line editor.
         */
        _getIdentifyLineEditorForODT() {
            return this._identifyLineEditor;
        }
        /**
         * Gets the identify button for ODT.
         * @private
         * @ignore
         * @returns {WUXButton} The identify button.
         */
        _getIdentifyButtonForODT() {
            return this._identifyButton;
        }
    }
    return UIWatchPanel;
});
