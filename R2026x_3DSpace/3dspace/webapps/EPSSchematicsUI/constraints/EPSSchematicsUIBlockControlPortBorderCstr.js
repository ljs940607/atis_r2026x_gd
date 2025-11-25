/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockControlPortBorderCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockControlPortBorderCstr", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, ModelEnums, EGraphCore) {
    "use strict";
    /**
     * This class defines a block control port border constraint.
     * @private
     * @class UIBlockControlPortBorderCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockControlPortBorderCstr
     * @extends BorderCstr
     */
    class UIBlockControlPortBorderCstr extends EGraphCore.BorderCstr {
        /**
         * @public
         * @constructor
         * @param {UIBlockControlPort} controlPort - The control port.
         */
        constructor(controlPort) {
            super();
            this._controlPort = controlPort;
        }
        /**
         * The callback on the update constraint.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The connector.
         */
        onupdate(connector) {
            super.onupdate(connector);
            const halfBorderWidth = 0.75 / 2;
            const isInput = this._controlPort.getModel().getType() === ModelEnums.EControlPortType.eInput;
            const left = isInput ? connector.left - halfBorderWidth : connector.left + halfBorderWidth;
            connector.multiset('left', left);
        }
    }
    return UIBlockControlPortBorderCstr;
});
