/// <amd-module name='DS/CSIExecutionGraphUI/panels/CSIEGUIPlayPanel'/>
define("DS/CSIExecutionGraphUI/panels/CSIEGUIPlayPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPlayPanel"], function (require, exports, UIPlayPanel) {
    "use strict";
    /**
     * This class defines a CSI Execution Graph UI play panel.
     * @private
     * @class CSIEGUIPlayPanel
     * @alias module:DS/CSIExecutionGraphUI/panels/CSIEGUIPlayPanel
     * @extends UIPlayPanel
     */
    class CSIEGUIPlayPanel extends UIPlayPanel {
        /**
         * @public
         * @constructor
         * @param {CSIExecutionGraphUIEditor} editor - The CSI Execution Graph UI editor.
         */
        constructor(editor) {
            super(editor);
        }
        /**
         * The callback on the panel close event.
         * @protected
         * @override
         */
        _onClose() {
            super._onClose();
        }
        /**
         * Creates the panel content.
         * @protected
         * @override
         */
        _createContent() {
            this._createBaseCommands();
            this._createDebugExpander();
        }
    }
    return CSIEGUIPlayPanel;
});
