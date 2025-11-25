/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIDataPortView", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIGraphTestDataPort"], function (require, exports, UIGraphDataPortView, UIDom, UIShapes, UIDataPortView) {
    "use strict";
    /**
     * This class defines an UI graph test data port view.
     * @private
     * @class UIGraphTestDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestDataPortView
     * @extends UIConnectorView
     */
    class UIGraphTestDataPortView extends UIGraphDataPortView {
        /**
         * @public
         * @constructor
         * @param {UIGraphTestDataPort} port - The UI graph test data port.
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
            let points = UIShapes.graphTestDataPortPathPoints;
            if (subDataPortLength > 0) {
                const width = UIDataPortView.kPortHalfWidth + subDataPortLength * UIDataPortView.kSpaceBetweenPorts;
                points = this._port.isStartPort() ? UIShapes.stretchableGraphTestDataPortPathPoints : UIShapes.stretchableReversedGraphTestDataPortPathPoints;
                points = points.replace(new RegExp('x', 'g'), String(width));
            }
            this._path?.setAttribute('points', points);
            super.updateConnectorWidth();
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
            UIDom.addClassName(this.structure.root, 'sch-connector-graph-test-data-port');
            return this._element;
        }
        /**
         * Creates the connector.
         * @protected
         * @override
         * @param {EGraphCore.Connector} _connector - The connector.
         */
        _createConnector(_connector) {
            this._polygon = UIDom.createSVGGroup({
                className: 'sch-data-port-polygon',
                parent: this._element
            });
            this._path = UIDom.createSVGPolygon({
                parent: this._polygon,
                attributes: { points: UIShapes.graphTestDataPortPathPoints }
            });
            this._circle = UIDom.createSVGCircle({
                attributes: { cx: 6, cy: 0, r: 3 }
            });
            this._polygon.appendChild(this._circle);
        }
    }
    return UIGraphTestDataPortView;
});
