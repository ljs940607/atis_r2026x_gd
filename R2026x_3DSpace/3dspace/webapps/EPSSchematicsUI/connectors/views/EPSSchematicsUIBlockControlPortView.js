/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockControlPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockControlPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIBlockControlPort"], function (require, exports, UIControlPortView, UIDom, UIShapes) {
    "use strict";
    /**
     * This class defined the customized default view for a UI block control port.
     * @private
     * @class UIBlockControlPortView
     * @alias module:DS/EPSSchematicsUI/views/EPSSchematicsUIBlockControlPortView
     * @extends UIControlPortView
     */
    class UIBlockControlPortView extends UIControlPortView {
        /**
         * @public
         * @constructor
         * @param {UIBlockControlPort} port - The UI block control port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Gets the port polygon SVG element.
         * @public
         * @returns {SVGElement} The port polygon SVG element.
         */
        getPolygon() {
            return this._polygon;
        }
        /**
         * Destroys the connector.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._polygon = undefined;
            super.ondestroyDisplay(elt, grView);
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
            UIDom.addClassName(this.structure.root, ['sch-control-port', 'sch-block-port']);
            const isStartPort = this._port.isStartPort();
            const className = isStartPort ? 'sch-input-control-port' : 'sch-output-control-port';
            UIDom.addClassName(this._element, className);
            this._createShape();
            this._element.appendChild(this._polygon);
            this._setRerouteHandlerPosition(13, -2.05);
            return this._element;
        }
        /**
         * Creates the block event port shape.
         * @protected
         */
        _createShape() {
            this._polygon = UIDom.createSVGPolygon({
                className: 'sch-block-control-port-polygon',
                attributes: { points: UIShapes.controlPortPolygonPoints }
            });
            if (!this._port.isStartPort()) {
                UIDom.transformSVGShape(this._polygon, 15, 0, -180);
            }
        }
    }
    return UIBlockControlPortView;
});
