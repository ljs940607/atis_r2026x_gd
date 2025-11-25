/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUIHistoryPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUIHistoryPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVHistory", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "DS/Controls/Button", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUIHistoryPanel"], function (require, exports, UIPanel, UIFontIcon, UIDom, UIWUXTools, UIDGVHistory, UICommandType, UIKeyboard, UIEvents, WUXButton, UINLS) {
    "use strict";
    /**
     * This class defines a UI history panel.
     * @private
     * @class UIHistoryPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUIHistoryPanel
     * @extends UIPanel
     */
    class UIHistoryPanel extends UIPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                immersiveFrame: editor.getImmersiveFrame(),
                title: UINLS.get('panelTitleHistory'),
                currentDockArea: editor.getOptions().historyDockArea,
                width: 250,
                height: 600,
                className: ['sch-history-panel'],
                icon: UIFontIcon.getWUXIconFromCommand(UICommandType.eOpenHistoryPanel),
                stackInWindowGroup: true
            });
            this._onHistoryControllerUpdateCB = this._onHistoryControllerUpdate.bind(this);
            this._onKeydownCB = this._onKeydown.bind(this);
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
         * @private
         * @override
         */
        remove() {
            super.remove(); // Closes the panel!
            this._editor = undefined;
            this._onHistoryControllerUpdateCB = undefined;
            this._onKeydownCB = undefined;
        }
        /**
         * Gets the UI data grid view history.
         * @public
         * @returns {UIDGVHistory} The UI data grid view history.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * Gets the WUX undo button.
         * @public
         * @returns {WUXButton} The WUX undo button.
         */
        getWUXUndoButton() {
            return this._undoButton;
        }
        /**
         * Gets the WUX redo button.
         * @public
         * @returns {WUXButton} The WUX redo button.
         */
        getWUXRedoButton() {
            return this._redoButton;
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
            if (this._dataGridView !== undefined) {
                this._dataGridView.remove();
                this._dataGridView = undefined;
            }
            if (this._editor !== undefined) {
                this._editor.removeListener(UIEvents.UIHistoryControllerUpdateEvent, this._onHistoryControllerUpdateCB);
            }
            if (this._panel !== undefined) {
                this._panel.getContent().removeEventListener('keydown', this._onKeydownCB, false);
            }
            this._buttonContainer = undefined;
            this._undoButton = undefined;
            this._redoButton = undefined;
            super._onClose();
        }
        /**
         * Creates the panel content.
         * @protected
         * @abstract
         */
        _createContent() {
            this._panel.getContent().setAttribute('tabIndex', '-1'); // Allow to get focus anywhere on the panel!
            this._panel.getContent().addEventListener('keydown', this._onKeydownCB, false);
            this._buttonContainer = UIDom.createElement('div', {
                parent: this.getContent(),
                className: 'sch-history-button-container'
            });
            this._undoButton = new WUXButton({
                emphasize: 'primary',
                icon: UIFontIcon.getWUXFAIconDefinition('undo'),
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: UINLS.get('shortHelpUndo') + ' (Ctrl+Z)' }),
                onClick: () => this._onUndoButtonClick()
            }).inject(this._buttonContainer);
            this._redoButton = new WUXButton({
                emphasize: 'primary',
                icon: UIFontIcon.getWUXFAIconDefinition('repeat'),
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: UINLS.get('shortHelpRedo') + ' (Ctrl+Y)' }),
                onClick: () => this._onRedoButtonClick()
            }).inject(this._buttonContainer);
            this._dataGridView = new UIDGVHistory(this._editor.getHistoryController());
            this.getContent().appendChild(this._dataGridView.getElement());
            this._editor.addListener(UIEvents.UIHistoryControllerUpdateEvent, this._onHistoryControllerUpdateCB);
            this._onHistoryControllerUpdate(); // To initialize button state
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
         * The callback on the undo button click event.
         * @private
         */
        _onUndoButtonClick() {
            if (!this._undoButton.disabled) {
                this._editor.getHistoryController().back();
            }
        }
        /**
         * The callback on the redo button click event.
         * @private
         */
        _onRedoButtonClick() {
            if (!this._redoButton.disabled) {
                this._editor.getHistoryController().forward();
            }
        }
        /**
         * The cllback on the history controller update event.
         * @private
         */
        _onHistoryControllerUpdate() {
            this._undoButton.disabled = this._editor.getHistoryController().isFirstIndex();
            this._redoButton.disabled = this._editor.getHistoryController().isLastIndex();
            this._panel.getContent().focus(); // Get back the focus when button are disabled!
        }
        /**
         * The callback on the current viewer keydown event
         * @private
         * @param {KeyboardEvent} event - The keydown event.
         */
        _onKeydown(event) {
            const isCtrlPressed = event.metaKey || event.ctrlKey;
            if (isCtrlPressed) {
                if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyZ)) {
                    event.preventDefault();
                    this._editor.getHistoryController().back();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eKeyY)) {
                    event.preventDefault();
                    this._editor.getHistoryController().forward();
                }
            }
        }
    }
    return UIHistoryPanel;
});
