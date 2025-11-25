/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIDebugCursorView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIDebugCursorView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIDebugCursor"], function (require, exports, UINodeView, UIDom, UIFontIcon) {
    "use strict";
    /**
     * This class defines the view of a debug cursor.
     * @private
     * @class UIDebugCursorView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIDebugCursorView
     * @extends UINodeView
     */
    class UIDebugCursorView extends UINodeView {
        /**
         * @public
         * @constructor
         * @param {boolean} isParent - True if this is a parent debug cursor else false.
         */
        constructor(isParent) {
            super();
            this._isParent = isParent;
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
            const classNames = [
                'sch-debug-cursor',
                ...(this._isParent ? ['sch-debug-cursor-parent'] : [])
            ];
            UIDom.addClassName(this._element, classNames);
            UIFontIcon.create3DSFontIcon('down', {
                className: [UIFontIcon.getWUX3DSClassName('1x')],
                parent: this._element
            });
            return this._element;
        }
    }
    return UIDebugCursorView;
});
