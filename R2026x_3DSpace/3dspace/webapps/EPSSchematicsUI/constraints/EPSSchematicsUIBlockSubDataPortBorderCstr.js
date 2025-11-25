/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockSubDataPortBorderCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockSubDataPortBorderCstr", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, EGraphCore) {
    "use strict";
    /**
     * This class defines a block sub data port border constraint.
     * @private
     * @class UIBlockSubDataPortBorderCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockSubDataPortBorderCstr
     * @extends BorderCstr
     */
    class UIBlockSubDataPortBorderCstr extends EGraphCore.BorderCstr {
        /**
         * @public
         * @constructor
         * @param {UIBlockSubDataPort} subDataPort - The block sub data port.
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
            const borderWidth = 0.5;
            const offset = 3 + borderWidth;
            const isStartPort = this._subDataPort.getParentPort().isStartPort();
            const top = isStartPort ? connector.top - offset : connector.top + offset;
            connector.multiset('top', top);
        }
    }
    return UIBlockSubDataPortBorderCstr;
});
