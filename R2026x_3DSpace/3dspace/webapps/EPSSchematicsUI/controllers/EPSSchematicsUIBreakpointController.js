/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIBreakpointController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIBreakpointController", ["require", "exports", "DS/EPSSchematicsUI/data/EPSSchematicsUIBreakpoint"], function (require, exports, UIBreakpoint) {
    "use strict";
    /**
     * This class defines the UI breakpoint controller.
     * @private
     * @class UIBreakpointController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIBreakpointController
     */
    class UIBreakpointController {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._breakpoints = new Map();
            this._editor = editor;
        }
        /**
         * Removes the controller.
         * @public
         */
        remove() {
            this.unregisterAllBreakpoints();
            this._editor = undefined;
            this._breakpoints = undefined;
        }
        /**
         * Registers a breakpoint.
         * @public
         * @param {UIBlock} block - The UI block.
         */
        registerBreakpoint(block) {
            this._breakpoints.set(block.getModel(), new UIBreakpoint(block.getModel()));
            this.sendBreakpointList();
        }
        /**
         * Unregisters a breakpoint.
         * @public
         * @param {UIBlock} block - The UI block.
         */
        unregisterBreakpoint(block) {
            if (this.hasBreakpoint(block)) {
                this._breakpoints.delete(block.getModel());
                this.sendBreakpointList();
            }
        }
        /**
         * Unregisters all the existing breakpoints.
         * @public
         */
        unregisterAllBreakpoints() {
            this._breakpoints.clear();
            this.sendBreakpointList();
        }
        /**
         * Checks if the provided block has a breakpoint.
         * @public
         * @param {UIBlock} block - The UI block.
         * @returns {boolean} True if the block has a breakpoint, else false.
         */
        hasBreakpoint(block) {
            return this._breakpoints.has(block.getModel());
        }
        /**
         * Sendsthe breakpoint list to the play panel.
         * @private
         */
        sendBreakpointList() {
            const playPanel = this._editor.getPlayPanel();
            if (playPanel !== undefined) {
                const bkList = [];
                const graph = this._editor.getGraphModel();
                this._breakpoints.forEach((_value, key) => { bkList.push({ path: key.toPath(graph), condition: undefined }); });
                playPanel.onBreakpointsChange(bkList);
            }
        }
    }
    return UIBreakpointController;
});
