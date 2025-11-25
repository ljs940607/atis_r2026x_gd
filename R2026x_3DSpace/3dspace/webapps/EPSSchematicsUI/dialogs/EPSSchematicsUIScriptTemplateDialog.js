/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptTemplateDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptTemplateDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptBlockDialog", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateLibrary", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools"], function (require, exports, UIScriptBlockDialog, UITemplateLibrary, UINLS, UITools) {
    "use strict";
    /**
     * This class defines a UI script template dialog.
     * @private
     * @class UIScriptTemplateDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptTemplateDialog
     * @extends UIScriptBlockDialog
     */
    class UIScriptTemplateDialog extends UIScriptBlockDialog {
        /**
         * @public
         * @constructor
         * @param {string} scriptUid - The script block uid.
         * @param {boolean} isLocalTemplate - True for local template, false for global template.
         * @param {UIGraph} graph - The UI graph.
         */
        constructor(scriptUid, isLocalTemplate, graph) {
            const block = UIScriptTemplateDialog._getScriptBlock(scriptUid, isLocalTemplate, graph);
            super(block);
            this._scriptUid = scriptUid;
            this._isLocalTemplate = isLocalTemplate;
            this._graph = graph;
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Closes the dialog!
            this._scriptUid = undefined;
            this._isLocalTemplate = undefined;
            this._graph = undefined;
        }
        /**
         * Computes the dialog title.
         * @protected
         * @override
         * @returns {string} The dialog title.
         */
        _computeTitle() {
            const title = super._computeTitle();
            return UINLS.get('dialogTitleTemplateEditor') + ': ' + title;
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         * @override
         */
        _onOk() {
            const script = this._block.getCodeMirrorScript();
            this._tmpModel.setScriptContent(UITools.formatToSingleQuotes(script));
            const templateLibrary = this._isLocalTemplate ? this._graph.getLocalTemplateLibrary() : UITemplateLibrary;
            this._tmpModel.graphContext = this._graph.getModel();
            templateLibrary.updateScript(this._scriptUid, this._tmpModel, undefined);
            super._onOk();
        }
        /**
         * Gets the script reference from the template library.
         * @private
         * @static
         * @param {string} scriptUid - The script block uid.
         * @param {boolean} isLocalTemplate - True for local template, false for global template.
         * @param {UIGraph} graph - The UI graph.
         * @returns {UIScriptBlock} The UI script block.
         */
        static _getScriptBlock(scriptUid, isLocalTemplate, graph) {
            const templateLibrary = isLocalTemplate ? graph.getLocalTemplateLibrary() : UITemplateLibrary;
            const script = templateLibrary.getScript(scriptUid);
            const UIScriptBlockCtor = require('DS/EPSSchematicsUI/nodes/EPSSchematicsUIScriptBlock');
            return new UIScriptBlockCtor(graph, script.model, 0, 0);
        }
    }
    return UIScriptTemplateDialog;
});
