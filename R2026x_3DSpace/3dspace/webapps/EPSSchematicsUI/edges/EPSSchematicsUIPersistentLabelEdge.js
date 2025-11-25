/// <amd-module name='DS/EPSSchematicsUI/edges/EPSSchematicsUIPersistentLabelEdge'/>
define("DS/EPSSchematicsUI/edges/EPSSchematicsUIPersistentLabelEdge", ["require", "exports", "DS/EPSSchematicsUI/edges/EPSSchematicsUIEdge", "DS/EPSSchematicsUI/edges/views/EPSSchematicsUIPersistentLabelEdgeView"], function (require, exports, UIEdge, UIPersistentLabelEdgeView) {
    "use strict";
    /**
     * This class defines a UI permanent label edge.
     * @private
     * @class UIPersistentLabelEdge
     * @alias module:DS/EPSSchematicsUI/edges/EPSSchematicsUIPersistentLabelEdge
     * @extends UIEdge
     */
    class UIPersistentLabelEdge extends UIEdge {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super();
            this.setView(this.createView());
        }
        /**
         * Creates the permanent label edge view.
         * @public
         * @returns {UIPersistentLabelEdgeView} The persistent label edge view.
         */
        // eslint-disable-next-line class-methods-use-this
        createView() {
            return new UIPersistentLabelEdgeView();
        }
    }
    return UIPersistentLabelEdge;
});
