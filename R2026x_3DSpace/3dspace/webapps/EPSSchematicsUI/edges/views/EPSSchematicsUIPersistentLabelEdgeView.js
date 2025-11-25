/// <amd-module name='DS/EPSSchematicsUI/edges/views/EPSSchematicsUIPersistentLabelEdgeView'/>
define("DS/EPSSchematicsUI/edges/views/EPSSchematicsUIPersistentLabelEdgeView", ["require", "exports", "DS/EPSSchematicsUI/edges/views/EPSSchematicsUIEdgeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/edges/EPSSchematicsUIPersistentLabelEdge"], function (require, exports, UIEdgeView, UIDom) {
    "use strict";
    /**
     * This class defines a UI permanent label edge view.
     * @private
     * @class UIPersistentLabelEdgeView
     * @alias module:DS/EPSSchematicsUI/edges/views/EPSSchematicsUIPersistentLabelEdgeView
     */
    class UIPersistentLabelEdgeView extends UIEdgeView {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super('sch-edge-persistent-label-path');
        }
        /**
         * Creates the edge view.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        oncreateDisplay(elt, grView) {
            super.oncreateDisplay(elt, grView);
            UIDom.addClassName(this.structure.root, 'sch-edge-persistent-label');
        }
    }
    return UIPersistentLabelEdgeView;
});
