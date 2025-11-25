/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIGraphDataPort"], function (require, exports, UIDataPortView, UIDom, ModelEnums) {
    "use strict";
    /**
     * This class defined a UI graph data port view.
     * @private
     * @class UIGraphDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphDataPortView
     * @extends UIDataPortView
     */
    class UIGraphDataPortView extends UIDataPortView {
        /**
         * @public
         * @constructor
         * @param {UIGraphDataPort} port - The UI graph data port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Updates the connector width.
         * @public
         * @override
         */
        updateConnectorWidth() {
            const subDataPortLength = this._port.getExposedSubDataPorts().length;
            const portType = this._port.getModel().getType();
            if (portType === ModelEnums.EDataPortType.eInput ||
                (portType === ModelEnums.EDataPortType.eLocal && this._port.getInputLocalState())) {
                this._updateOutputConnectorWidth(subDataPortLength);
            }
            else if (portType === ModelEnums.EDataPortType.eOutput ||
                (portType === ModelEnums.EDataPortType.eLocal && !this._port.getInputLocalState())) {
                this._updateInputConnectorWidth(subDataPortLength);
            }
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
            UIDom.addClassName(this.structure.root, 'sch-graph-port');
            this._createConnector(connector);
            return this._element;
        }
        /**
         * Creates the connector.
         * @protected
         * @param {module:egraph/core.Connector} connector - The connector.
         */
        _createConnector(connector) {
            const portType = this._port.getModel().getType();
            if (portType === ModelEnums.EDataPortType.eInput) {
                this._createOutputConnector(connector);
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                this._createInputConnector(connector);
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                if (this._port.getInputLocalState()) {
                    this._createOutputConnector(connector);
                }
                else {
                    this._createInputConnector(connector);
                }
            }
        }
    }
    return UIGraphDataPortView;
});
