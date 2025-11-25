/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphTestSubDataPortBorderCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphTestSubDataPortBorderCstr", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, EGraphCore) {
    "use strict";
    /**
     * This class defines a graph test sub data port border constraint.
     * @private
     * @class UIGraphTestSubDataPortBorderCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphTestSubDataPortBorderCstr
     * @extends BorderCstr
     */
    class UIGraphTestSubDataPortBorderCstr extends EGraphCore.BorderCstr {
        /**
         * @public
         * @constructor
         * @param {UIGraphTestSubDataPort} subDataPort - The graph test sub data port.
         */
        constructor(subDataPort) {
            super();
            this._subDataPort = subDataPort;
        }
        /**
         * The callback on the update constraint.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The connector.
         */
        onupdate(connector) {
            super.onupdate(connector);
            const halfBorderWidth = 0.5 / 2;
            const offset = 3 + halfBorderWidth;
            const isStartPort = this._subDataPort.getParentPort().isStartPort();
            const top = isStartPort ? connector.top - offset : connector.top + offset;
            connector.multiset('top', top);
        }
    }
    return UIGraphTestSubDataPortBorderCstr;
});
