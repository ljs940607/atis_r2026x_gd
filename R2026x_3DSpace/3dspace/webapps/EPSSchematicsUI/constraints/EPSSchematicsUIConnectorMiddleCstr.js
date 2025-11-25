/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIConnectorMiddleCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIConnectorMiddleCstr", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines a connector middle constraint.
     * @private
     * @class UIConnectorMiddleCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIConnectorMiddleCstr
     */
    class UIConnectorMiddleCstr {
        /**
         * @public
         * @constructor
         * @param {EGraphCore.Node} parent - The parent node.
         */
        constructor(parent) {
            this._parent = parent;
        }
        /**
         * The callback on the update constraint.
         * @protected
         * @param {EGraphCore.Connector} connector - The connector.
         */
        onupdate(connector) {
            const top = this._parent.actualTop + (this._parent.height / 2);
            const left = this._parent.actualLeft + (this._parent.width / 2);
            connector.multiset('left', left, 'top', top, 'aleft', left, 'atop', top);
        }
    }
    return UIConnectorMiddleCstr;
});
