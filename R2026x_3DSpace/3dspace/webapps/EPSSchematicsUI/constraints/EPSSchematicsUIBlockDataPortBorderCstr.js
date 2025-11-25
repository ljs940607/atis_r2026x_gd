/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockDataPortBorderCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockDataPortBorderCstr", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, EGraphCore) {
    "use strict";
    /**
     * This class defines a block data port border constraint.
     * @private
     * @class UIBlockDataPortBorderCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockDataPortBorderCstr
     * @extends BorderCstr
     */
    class UIBlockDataPortBorderCstr extends EGraphCore.BorderCstr {
        /**
         * @public
         * @constructor
         * @param {UIBlockDataPort} dataPort - The block data port.
         */
        constructor(dataPort) {
            super();
            this._dataPort = dataPort;
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
            const isInput = this._dataPort.isStartPort();
            const top = isInput ? connector.top - halfBorderWidth : connector.top + halfBorderWidth;
            connector.multiset('top', top);
        }
    }
    return UIBlockDataPortBorderCstr;
});
