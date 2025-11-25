/// <amd-module name='DS/EPSSchematicsUI/data/EPSSchematicsUIBreakpoint'/>
define("DS/EPSSchematicsUI/data/EPSSchematicsUIBreakpoint", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines a UI breakpoint.
     * @private
     * @class UIBreakpoint
     * @alias module:DS/EPSSchematicsUI/data/EPSSchematicsUIBreakpoint
     */
    class UIBreakpoint {
        /**
         * @public
         * @constructor
         * @param {Block} block - The block.
         */
        constructor(block) {
            this._block = block;
        }
        /**
         * Gets the block associated to the breakpoint.
         * @public
         * @returns {Block} The block associated to the breakpoint.
         */
        getBlock() {
            return this._block;
        }
    }
    return UIBreakpoint;
});
