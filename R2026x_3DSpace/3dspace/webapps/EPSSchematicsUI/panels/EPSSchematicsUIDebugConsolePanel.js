/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUIDebugConsolePanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUIDebugConsolePanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDebugConsole", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFileSaver", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/Controls/Button", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUIDebugConsolePanel"], function (require, exports, UIPanel, UIDGVDebugConsole, UIDom, UIFileSaver, UITools, UIFontIcon, UICommandType, UIWUXTools, WUXButton, UINLS) {
    "use strict";
    // TODO: Disable save and clear button when treeDocument is empty!
    /**
     * This class defines a UI debug console panel.
     * @private
     * @class UIDebugConsolePanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUIDebugConsolePanel
     * @extends UIPanel
     */
    class UIDebugConsolePanel extends UIPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                immersiveFrame: editor.getImmersiveFrame(),
                title: UINLS.get('panelTitleDebugConsole'),
                width: 1200,
                height: 310,
                currentDockArea: editor.getOptions().debugConsoleDockArea,
                className: ['sch-debugconsole-panel'],
                icon: UIFontIcon.getWUXIconFromCommand(UICommandType.eDebugConsole)
            });
            this._fileSaver = new UIFileSaver();
            this._editor = editor;
            this._controller = this._editor.getDebugConsoleController();
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
            this._controller = undefined;
            this._fileSaver = undefined;
            this._toolbar = undefined;
            this._clearButton = undefined;
            this._saveButton = undefined;
            this._dataGridViewContainer = undefined;
            this._dataGridView = undefined;
        }
        /**
         * Gets the debug console controller.
         * @public
         * @returns {UIDebugConsoleController} The debug console controller.
         */
        getController() {
            return this._controller;
        }
        /**
         * Gets the data grid view debug console.
         * @public
         * @returns {UIDGVDebugConsole} The data grid view debug console.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * Gets the WUX save button.
         * @public
         * @returns {WUXButton} The WUX save button.
         */
        getWUXSaveButton() {
            return this._saveButton;
        }
        /**
         * Gets the WUX clear button.
         * @public
         * @returns {WUXButton} The WUX clear button.
         */
        getWUXClearButton() {
            return this._clearButton;
        }
        /**
         * Gets the file saver.
         * @public
         * @returns {UIFileSaver} The file saver.
         */
        getFileSaver() {
            return this._fileSaver;
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
            this._toolbar = undefined;
            this._clearButton = undefined;
            this._saveButton = undefined;
            this._dataGridViewContainer = undefined;
            if (this._dataGridView !== undefined) {
                this._dataGridView.remove();
                this._dataGridView = undefined;
            }
            if (this._controller !== undefined) {
                this._controller.unregisterDebugConsole();
            }
            super._onClose();
        }
        /**
         * Creates the panel content.
         * @protected
         * @abstract
         */
        _createContent() {
            this._createToolbar();
            this._createDataGridView();
            this._controller.clearToolbarButtonsNotifications();
            this._controller.registerDebugConsole(this);
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
         * Creates the panel toolbar.
         * @private
         */
        _createToolbar() {
            this._toolbar = UIDom.createElement('div', { className: 'sch-toolbar', parent: this.getContent() });
            this._clearButton = new WUXButton({
                emphasize: 'primary',
                icon: UIFontIcon.getWUXFAIconDefinition('trash-o'),
                allowUnsafeHTMLLabel: false,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: UINLS.get('shortHelpClearConsole') }),
                onClick: () => this._onClearButtonClick()
            }).inject(this._toolbar);
            this._saveButton = new WUXButton({
                emphasize: 'primary',
                icon: UIFontIcon.getWUXFAIconDefinition('floppy-o'),
                allowUnsafeHTMLLabel: false,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: UINLS.get('shortHelpSaveConsole') }),
                onClick: () => this._onSaveButtonClick()
            }).inject(this._toolbar);
        }
        /**
         * Creates the data grid view.
         * @private
         */
        _createDataGridView() {
            this._dataGridViewContainer = UIDom.createElement('div', { className: 'sch-datagridview-container', parent: this.getContent() });
            this._dataGridView = new UIDGVDebugConsole(this._controller);
            this._dataGridViewContainer.appendChild(this._dataGridView.getElement());
        }
        /**
         * The callback on the clear button click event.
         * @private
         */
        _onClearButtonClick() {
            this._controller.clear();
        }
        /**
         * The callback on the save button click event.
         * @private
         */
        _onSaveButtonClick() {
            const treeDocument = this._controller.getTreeDocument();
            const roots = treeDocument.getRoots();
            let entries = [];
            roots.forEach(root => {
                const grid = root.options.grid;
                entries.push({
                    timestamp: grid.timestamp.getTime(),
                    date: grid.fullDate + ' ' + grid.fullTime,
                    severity: grid.severity,
                    severityText: grid.severityText,
                    message: grid.message
                });
            });
            const stringToSave = UITools.safeJSONStringify(entries);
            const currentDate = new Date();
            const fullDateAndTime = UITools.getFullDate(currentDate) + ' ' + UITools.getFullTime(currentDate);
            const fileName = 'OutputConsole - ' + fullDateAndTime + '.json';
            this._fileSaver.saveTextFile(stringToSave, fileName);
        }
    }
    return UIDebugConsolePanel;
});
