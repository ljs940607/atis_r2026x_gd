/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockControlPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockControlPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIControlPort", "DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockControlPortBorderCstr", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockControlPortView", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIControlPort, UIBlockControlPortBorderCstr, UIBlockControlPortView, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI block control port.
     * @private
     * @class UIBlockControlPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockControlPort
     * @extends UIControlPort
     */
    class UIBlockControlPort extends UIControlPort {
        /**
         * @public
         * @constructor
         * @param {UIBlock} parent - The UI block that owns this UI block control port.
         * @param {ControlPort} model - The control port model.
         */
        constructor(parent, model) {
            super(parent, model);
            this._setBorderConstraint({
                cstr: new UIBlockControlPortBorderCstr(this),
                attach: this.isStartPort() ? EGraphCore.BorderCstr.LEFT : EGraphCore.BorderCstr.RIGHT,
                offset: 0,
                aoffy: -12
            });
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UIBlockControlPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the parent graph of the port.
         * @public
         * @returns {UIGraph} The parent graph of the port.
         */
        getParentGraph() {
            return this._parent.getGraph();
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @override
         * @returns {UIBlockControlPortView} The view of the connector.
         */
        _createView() {
            return new UIBlockControlPortView(this);
        }
    }
    return UIBlockControlPort;
});
