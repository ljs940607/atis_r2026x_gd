/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIDataPortView, UIDom, UIShapes, ModelEnums) {
    "use strict";
    /**
     * This class defined a UI sub data port view.
     * @private
     * @abstract
     * @class UISubDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView
     * @extends UIDataPortView
     */
    class UISubDataPortView extends UIDataPortView {
        /**
         * @public
         * @constructor
         * @param {UISubDataPort} port - The UI sub data port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Updates the connector width.
         * @public
         */
        // eslint-disable-next-line class-methods-use-this
        updateConnectorWidth() { }
        /**
         * Builds the connector SVG element.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The UI connector.
         * @returns {SVGElement} The connector SVG element.
         */
        buildConnElement(connector) {
            super.buildConnElement(connector);
            UIDom.addClassName(this.structure.root, 'sch-subdata-port');
            this.setVisibility(this._port.isVisible());
            return this._element;
        }
        /**
         * Creates an input connector.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The connector.
         */
        _createInputConnector(connector) {
            const isExternal = this._port.getModel().getType() === ModelEnums.EDataPortType.eInputExternal;
            const points = isExternal ? UIShapes.inputExternalSubDataPortPolygonPoints : UIShapes.inputSubDataPortPolygonPoints;
            this._polygon = UIDom.createSVGPolygon({
                className: 'sch-subdata-port-polygon',
                parent: this._element,
                attributes: { points: points }
            });
            connector.multiset(['cstr', 'aoffy'], -6);
            this._setRerouteHandlerPosition(2, -2);
        }
        /**
         * Creates an output connector.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The connector.
         */
        _createOutputConnector(connector) {
            this._polygon = UIDom.createSVGPolygon({
                className: 'sch-subdata-port-polygon',
                parent: this._element,
                attributes: { points: UIShapes.outputSubDataPortPolygonPoints }
            });
            connector.multiset(['cstr', 'aoffy'], -10);
            this._setRerouteHandlerPosition(7, -2);
        }
    }
    return UISubDataPortView;
});
