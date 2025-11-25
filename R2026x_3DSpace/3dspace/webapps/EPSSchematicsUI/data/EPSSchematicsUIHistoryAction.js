/// <amd-module name='DS/EPSSchematicsUI/data/EPSSchematicsUIHistoryAction'/>
define("DS/EPSSchematicsUI/data/EPSSchematicsUIHistoryAction", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUINLSTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUIHistoryAction.json"], function (require, exports, UINLSTools, UIFontIcon, UIHistoryActionJSON) {
    "use strict";
    const JSONHistoryAction = JSON.parse(UIHistoryActionJSON);
    /**
     * This class defines the history action.
     * @private
     * @class HistoryAction
     * @alias module:DS/EPSSchematicsUI/data/EPSSchematicsUIHistoryAction
     */
    class UIHistoryAction {
        static { this.eCreateGraph = new UIHistoryAction(JSONHistoryAction.eCreateGraph); }
        static { this.eCreateBlock = new UIHistoryAction(JSONHistoryAction.eCreateBlock); }
        static { this.eCreateBlockControlPort = new UIHistoryAction(JSONHistoryAction.eCreateBlockControlPort); }
        static { this.eCreateBlockDataPort = new UIHistoryAction(JSONHistoryAction.eCreateBlockDataPort); }
        static { this.eCreateControlLink = new UIHistoryAction(JSONHistoryAction.eCreateControlLink); }
        static { this.eCreateDataLink = new UIHistoryAction(JSONHistoryAction.eCreateDataLink); }
        static { this.eCreateGraphControlPort = new UIHistoryAction(JSONHistoryAction.eCreateGraphControlPort); }
        static { this.eCreateGraphDataPort = new UIHistoryAction(JSONHistoryAction.eCreateGraphDataPort); }
        static { this.eCreateGraphEventPort = new UIHistoryAction(JSONHistoryAction.eCreateGraphEventPort); }
        static { this.eCreateShortcut = new UIHistoryAction(JSONHistoryAction.eCreateShortcut); }
        static { this.eCreateCustomType = new UIHistoryAction(JSONHistoryAction.eCreateCustomType); }
        static { this.eRemoveCustomType = new UIHistoryAction(JSONHistoryAction.eRemoveCustomType); }
        static { this.eEditCustomType = new UIHistoryAction(JSONHistoryAction.eEditCustomType); }
        static { this.eRemoveBlock = new UIHistoryAction(JSONHistoryAction.eRemoveBlock); }
        static { this.eRemoveBlockControlPort = new UIHistoryAction(JSONHistoryAction.eRemoveBlockControlPort); }
        static { this.eRemoveBlockDataPort = new UIHistoryAction(JSONHistoryAction.eRemoveBlockDataPort); }
        static { this.eRemoveControlLink = new UIHistoryAction(JSONHistoryAction.eRemoveControlLink); }
        static { this.eRemoveDataLink = new UIHistoryAction(JSONHistoryAction.eRemoveDataLink); }
        static { this.eRemoveGraphControlPort = new UIHistoryAction(JSONHistoryAction.eRemoveGraphControlPort); }
        static { this.eRemoveGraphDataPort = new UIHistoryAction(JSONHistoryAction.eRemoveGraphDataPort); }
        static { this.eRemoveGraphEventPort = new UIHistoryAction(JSONHistoryAction.eRemoveGraphEventPort); }
        static { this.eRemoveSelection = new UIHistoryAction(JSONHistoryAction.eRemoveSelection); }
        static { this.eRemoveShortcut = new UIHistoryAction(JSONHistoryAction.eRemoveShortcut); }
        static { this.eMoveBlock = new UIHistoryAction(JSONHistoryAction.eMoveBlock); }
        static { this.eMoveGraph = new UIHistoryAction(JSONHistoryAction.eMoveGraph); }
        static { this.eMoveGraphControlPort = new UIHistoryAction(JSONHistoryAction.eMoveGraphControlPort); }
        static { this.eMoveGraphEventPort = new UIHistoryAction(JSONHistoryAction.eMoveGraphEventPort); }
        static { this.eMoveShortcut = new UIHistoryAction(JSONHistoryAction.eMoveShortcut); }
        static { this.eMoveSelection = new UIHistoryAction(JSONHistoryAction.eMoveSelection); }
        static { this.eChangeViewer = new UIHistoryAction(JSONHistoryAction.eChangeViewer); }
        static { this.eEditBlock = new UIHistoryAction(JSONHistoryAction.eEditBlock); }
        static { this.eEditGraph = new UIHistoryAction(JSONHistoryAction.eEditGraph); }
        static { this.eEditGraphControlPort = new UIHistoryAction(JSONHistoryAction.eEditGraphControlPort); }
        static { this.eEditGraphDataPort = new UIHistoryAction(JSONHistoryAction.eEditGraphDataPort); }
        static { this.eEditBlockControlPort = new UIHistoryAction(JSONHistoryAction.eEditBlockControlPort); }
        static { this.eEditBlockDataPort = new UIHistoryAction(JSONHistoryAction.eEditBlockDataPort); }
        static { this.eLoadGraph = new UIHistoryAction(JSONHistoryAction.eLoadGraph); }
        static { this.eEditDataPortType = new UIHistoryAction(JSONHistoryAction.eEditDataPortType); }
        static { this.eEditDataPortTypeSelection = new UIHistoryAction(JSONHistoryAction.eEditDataPortTypeSelection); }
        static { this.eCreatePersistentLabel = new UIHistoryAction(JSONHistoryAction.eCreatePersistentLabel); }
        static { this.eRemovePersistentLabel = new UIHistoryAction(JSONHistoryAction.eRemovePersistentLabel); }
        static { this.eMovePersistentLabel = new UIHistoryAction(JSONHistoryAction.eMovePersistentLabel); }
        static { this.eResizePersistentLabel = new UIHistoryAction(JSONHistoryAction.eResizePersistentLabel); }
        static { this.eCreateComment = new UIHistoryAction(JSONHistoryAction.eCreateComment); }
        static { this.eRemoveComment = new UIHistoryAction(JSONHistoryAction.eRemoveComment); }
        static { this.eMoveComment = new UIHistoryAction(JSONHistoryAction.eMoveComment); }
        static { this.eResizeComment = new UIHistoryAction(JSONHistoryAction.eResizeComment); }
        static { this.eEditComment = new UIHistoryAction(JSONHistoryAction.eEditComment); }
        static { this.eClearGraph = new UIHistoryAction(JSONHistoryAction.eClearGraph); }
        static { this.eShowOptionalDataPort = new UIHistoryAction(JSONHistoryAction.eShowOptionalDataPort); }
        static { this.eHideOptionalDataPort = new UIHistoryAction(JSONHistoryAction.eHideOptionalDataPort); }
        static { this.eCreateNodeIdSelector = new UIHistoryAction(JSONHistoryAction.eCreateNodeIdSelector); }
        static { this.eRemoveNodeIdSelector = new UIHistoryAction(JSONHistoryAction.eRemoveNodeIdSelector); }
        static { this.eEditNodeIdSelector = new UIHistoryAction(JSONHistoryAction.eEditNodeIdSelector); }
        /**
         * @private
         * @constructor
         * @param {ICommandType} action - The history action.
         */
        constructor(action) {
            this._action = action;
        }
        /**
         * Gets the corresponding history action short help.
         * @public
         * @param {UIHistoryAction} historyAction - The history action.
         * @returns {string} The history action short help.
         */
        static getShortHelp(historyAction) {
            return UINLSTools.getNLSFromString(historyAction._action.shortHelp) || '';
        }
        /**
         * Gets the corresponding history action icon.
         * @public
         * @param {UIHistoryAction} historyAction - The history action.
         * @returns {WUX.IconDefinition|undefined} The history action icon.
         */
        static getIcon(historyAction) {
            return UIFontIcon.getWUXIconFromCommand(historyAction._action);
        }
    }
    return UIHistoryAction;
});
