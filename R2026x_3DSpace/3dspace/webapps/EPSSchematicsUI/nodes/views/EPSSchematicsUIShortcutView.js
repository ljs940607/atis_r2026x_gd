/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIShortcutView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIShortcutView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIShortcut"], function (require, exports, UINodeView, UIDom) {
    "use strict";
    /**
     * This class defines the UI shortcut view.
     * @private
     * @class UIShortcutView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIShortcutView
     * @extends UINodeView
     */
    class UIShortcutView extends UINodeView {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * Builds the node HTML element.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Node} node - The graph node.
         * @returns {IHTMLElement} The node HTML element.
         */
        buildNodeElement(node) {
            super.buildNodeElement(node);
            UIDom.addClassName(this._element, 'sch-node-shortcut');
            return this._element;
        }
    }
    return UIShortcutView;
});
