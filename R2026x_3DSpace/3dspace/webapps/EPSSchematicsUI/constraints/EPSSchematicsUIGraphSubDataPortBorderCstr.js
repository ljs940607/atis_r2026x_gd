/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphSubDataPortBorderCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphSubDataPortBorderCstr", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, EGraphCore) {
    "use strict";
    /**
     * This class defines a graph sub data port border constraint.
     * @private
     * @class UIGraphSubDataPortBorderCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphSubDataPortBorderCstr
     * @extends BorderCstr
     */
    class UIGraphSubDataPortBorderCstr extends EGraphCore.BorderCstr {
        /**
         * @public
         * @constructor
         * @param {UIGraphSubDataPort} subDataPort - The graph sub data port.
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
            const top = isStartPort ? connector.top + offset : connector.top - offset;
            connector.multiset('top', top);
        }
    }
    return UIGraphSubDataPortBorderCstr;
});
