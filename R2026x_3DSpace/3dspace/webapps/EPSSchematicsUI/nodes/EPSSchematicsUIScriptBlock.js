/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIScriptBlock'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIScriptBlock", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUITemplatableBlock", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptBlockDialog", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptTemplateDialog", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateLibrary", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsCSI/EPSSchematicsCSIScriptFunctionBlock"], function (require, exports, UITemplatableBlock, UIScriptBlockDialog, UIScriptTemplateDialog, UITemplateLibrary, UIDom, Events, CSIScriptFunctionBlock) {
    "use strict";
    /**
     * This class defines a script block.
     * @private
     * @class UIScriptBlock
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIScriptBlock
     * @extends UITemplatableBlock
     */
    class UIScriptBlock extends UITemplatableBlock {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph that owns this block.
         * @param {ScriptBlock|CSIScriptFunctionBlock} model - The block model.
         * @param {number} left - The left position of the block.
         * @param {number} top - The top position of the block.
         */
        constructor(graph, model, left, top) {
            super(graph, model, left, top);
            this._onBlockScriptContentChangeCB = this._onBlockScriptContentChange.bind(this);
            this._onBlockTemplateChangeCB = this._onBlockTemplateChange.bind(this);
            // Specific to codeMirror editor
            this._onKeyupCB = this._onKeyup.bind(this);
            this._configurationDialog = new UIScriptBlockDialog(this);
            this._createTemplateDialog();
            this._model.addListener(Events.BlockScriptContentChangeEvent, this._onBlockScriptContentChangeCB);
            this._model.addListener(Events.BlockTemplateChangeEvent, this._onBlockTemplateChangeCB);
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
         * Removes the node from its parent graph.
         * @public
         * @override
         */
        remove() {
            this._removeTemplateDialog();
            if (this._model !== undefined) {
                this._model.removeListener(Events.BlockScriptContentChangeEvent, this._onBlockScriptContentChangeCB);
                this._model.removeListener(Events.BlockTemplateChangeEvent, this._onBlockTemplateChangeCB);
                this._onBlockScriptContentChangeCB = undefined;
                this._onBlockTemplateChangeCB = undefined;
            }
            this._codeMirror = undefined;
            this._onKeyupCB = undefined;
            this._refreshCB = undefined;
            super.remove();
        }
        /**
         * Gets the script block model.
         * @public
         * @override
         * @returns {ScriptBlock} The script block model.
         */
        getModel() {
            return super.getModel();
        }
        /**
         * Gets the script template dialog.
         * @public
         * @returns {UIScriptTemplateDialog|undefined} The script template dialog.
         */
        getTemplateDialog() {
            return this._templateDialog;
        }
        /**
         * Opens the block configuration dialog.
         * @public
         * @override
         */
        openConfigurationDialog() {
            this._configurationDialog.open();
        }
        /**
         * Gets the codeMirror script.
         * @public
         * @returns {string} The codeMirror script.
         */
        getCodeMirrorScript() {
            return this._codeMirror?.getValue();
        }
        /**
         * Refreshes the script editor.
         * @public
         */
        refreshScriptEditor() {
            if (this._codeMirror !== undefined) {
                this._codeMirror.refresh();
            }
        }
        /**
         * Creates the codeMirror script editor.
         * @public
         * @returns {HTMLDivElement} The parent html element aggregating the editor.
         */
        createScriptEditor() {
            const isCSIScriptFunctionBlock = this._model instanceof CSIScriptFunctionBlock;
            const isReadOnly = this.getViewer().isReadOnly() || isCSIScriptFunctionBlock;
            const scriptContainer = UIDom.createElement('div', {
                className: ['sch-codemirror-editor', isReadOnly ? 'readonly' : '']
            });
            const callback = this._createCodeMirrorEditor.bind(this, scriptContainer);
            if (!window.hasOwnProperty('CodeMirror')) {
                UIDom.loadCSS('../CodeMirror/lib/codemirror.css');
                UIDom.loadCSS('../CodeMirror/addon/scroll/simplescrollbars.css');
                UIDom.loadJS('../CodeMirror/lib/codemirror.js', () => {
                    UIDom.loadJS('../CodeMirror/mode/javascript/javascript.js', () => {
                        UIDom.loadJS('../CodeMirror/mode/python/python.js', () => {
                            UIDom.loadJS('../CodeMirror/addon/scroll/simplescrollbars.js', () => {
                                callback();
                            });
                        });
                    });
                });
            }
            else {
                callback();
            }
            return scriptContainer;
        }
        /**
         * Removes the script editor.
         * @private
         */
        removeScriptEditor() {
            if (this._codeMirror !== undefined && this._refreshCB !== undefined) {
                this._codeMirror.off('focus', this._refreshCB);
                const wrapper = this._codeMirror.getWrapperElement();
                wrapper.removeEventListener('keyup', this._onKeyupCB, false);
            }
            this._codeMirror = undefined;
            this._refreshCB = undefined;
        }
        /**
         * Gets the code mirror script editor.
         * @public
         * @returns {ICodeMirror} The code mirror script editor.
         */
        getScriptEditor() {
            return this._codeMirror;
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
         * Creates a local template from the block.
         * @protected
         */
        _createLocalTemplate() {
            if (!this._model.isTemplate()) {
                this._graph.getLocalTemplateLibrary().registerScript(this);
            }
        }
        /**
         * Creates a global template from the block.
         * @protected
         */
        _createGlobalTemplate() {
            if (!this._model.isTemplate()) {
                UITemplateLibrary.registerScript(this);
            }
        }
        /**
         * Converts the local template reference of the block to a global template reference.
         * @protected
         */
        _convertLocalTemplateToGlobalTemplate() {
            if (this._model.isLocalTemplate()) {
                const templateUid = this._model.getUid();
                UITemplateLibrary.registerScriptFromLocal(templateUid, this._graph.getGraphContext());
            }
        }
        /**
         * Edits the template reference.
         * This will impact all the template instances.
         * @protected
         */
        _editTemplateReference() {
            if (this._templateDialog) {
                this._templateDialog.open();
            }
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
         * Creates a codeMirror editor that will be appended to the specified parent DOM element.
         * @private
         * @param {HTMLElement} parent - The parent html element aggregating the editor.
         */
        _createCodeMirrorEditor(parent) {
            if (this._model !== undefined && window.hasOwnProperty('CodeMirror')) {
                const isCSIScriptFunctionBlock = this._model instanceof CSIScriptFunctionBlock;
                const readOnly = this.getViewer().isReadOnly() || isCSIScriptFunctionBlock;
                this._codeMirror = new window.CodeMirror(parent, {
                    mode: this._model.getScriptLanguage().toLowerCase(),
                    value: this._model.getScriptContent(),
                    lineNumbers: true,
                    styleActiveLine: true,
                    scrollbarStyle: 'simple',
                    readOnly: readOnly ? 'nocursor' : false
                });
                // Refresh the editor to prevent the no selectable last line bug!
                this._codeMirror.refresh();
                this._refreshCB = this._codeMirror.refresh.bind(this._codeMirror);
                this._codeMirror.on('focus', this._refreshCB);
                // Catch keyup event to prevent a key to close the dialog!
                const wrapper = this._codeMirror.getWrapperElement();
                wrapper.addEventListener('keyup', this._onKeyupCB, false);
            }
        }
        /**
         * Creates the template dialog.
         * @private
         */
        _createTemplateDialog() {
            this._removeTemplateDialog();
            if (this._model.isTemplate()) {
                this._templateDialog = new UIScriptTemplateDialog(this._model.getUid(), this._model.isLocalTemplate(), this._graph);
            }
        }
        /**
         * Removes the template dialog.
         * @private
         */
        _removeTemplateDialog() {
            if (this._templateDialog) {
                this._templateDialog.remove();
                this._templateDialog = undefined;
            }
        }
        /**
         * The callback on the model block script content change event.
         * @private
         */
        _onBlockScriptContentChange() {
            this.getGraph().onModelChange();
        }
        /**
         * The callback on the model block template change event.
         * @private
         */
        _onBlockTemplateChange() {
            this._createTemplateDialog();
        }
        /**
         * The callback on the editor keyup event.
         * It will catch keyup events to prevent the dialog to be closed
         * while writting text into the codeMirror editor.
         * @private
         * @param {KeyboardEvent} event - The keyup event.
         */
        // eslint-disable-next-line class-methods-use-this
        _onKeyup(event) {
            event.stopPropagation();
        }
    }
    return UIScriptBlock;
});
