/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockSubDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockSubDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UISubDataPortView, UIDom) {
    "use strict";
    /**
     * This class defined a UI block sub data port view.
     * @private
     * @class UIBlockSubDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockSubDataPortView
     * @extends UISubDataPortView
     */
    class UIBlockSubDataPortView extends UISubDataPortView {
        /**
         * @public
         * @constructor
         * @param {UIBlockSubDataPort} port - The UI block sub data port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Builds the connector SVG element.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The UI connector.
         * @returns {SVGElement} The connector SVG element.
         */
        buildConnElement(connector) {
            super.buildConnElement(connector);
            UIDom.addClassName(this.structure.root, 'sch-block-subdata-port');
            if (this._port.isStartPort()) {
                this._createInputConnector(connector);
            }
            else {
                this._createOutputConnector(connector);
            }
            return this._element;
        }
    }
    return UIBlockSubDataPortView;
});
