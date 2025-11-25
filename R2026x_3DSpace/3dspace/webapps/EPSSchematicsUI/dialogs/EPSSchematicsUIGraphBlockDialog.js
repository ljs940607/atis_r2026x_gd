/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphBlockDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphBlockDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBlockDialog"], function (require, exports, UIBlockDialog) {
    "use strict";
    /**
     * This class defines a UI graph block dialog.
     * @private
     * @class UIGraphBlockDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphBlockDialog
     * @extends UIBlockDialog
     */
    class UIGraphBlockDialog extends UIBlockDialog {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The UI graph.
         */
        constructor(graph) {
            super(graph);
        }
    }
    return UIGraphBlockDialog;
});
