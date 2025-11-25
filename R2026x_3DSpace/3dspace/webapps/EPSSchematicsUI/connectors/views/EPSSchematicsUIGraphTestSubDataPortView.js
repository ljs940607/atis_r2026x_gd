/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestSubDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestSubDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphSubDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIGraphTestSubDataPort"], function (require, exports, UIGraphSubDataPortView, UIDom) {
    "use strict";
    /**
     * This class defines a UI graph test sub data port view.
     * @private
     * class UIGraphTestSubDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestSubDataPortView
     * @extends UIGraphSubDataPortView
     */
    class UIGraphTestSubDataPortView extends UIGraphSubDataPortView {
        /**
         * @public
         * @constructor
         * @param {UIGraphTestSubDataPort} port - The UI graph test sub data port.
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
            UIDom.addClassName(this.structure.root, 'sch-connector-graph-test-sub-data-port');
            return this._element;
        }
        /**
         * Creates the connector.
         * @protected
         * @override
         * @param {module:egraph/core.Connector} _connector - The connector.
         */
        _createConnector(_connector) {
            this._polygon = UIDom.createSVGGroup({
                className: 'sch-subdata-port-polygon',
                parent: this._element
            });
            this._rect = UIDom.createSVGRect({ attributes: { x: 0, y: -6, width: 8, height: 12 } });
            this._polygon.appendChild(this._rect);
            this._circle = UIDom.createSVGCircle({ attributes: { cx: 4, cy: 0, r: 2.5 } });
            this._polygon.appendChild(this._circle);
        }
    }
    return UIGraphTestSubDataPortView;
});
