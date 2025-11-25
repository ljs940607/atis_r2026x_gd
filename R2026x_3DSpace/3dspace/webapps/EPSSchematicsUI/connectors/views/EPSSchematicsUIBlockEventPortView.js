/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockEventPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockEventPortView", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockControlPortView"], function (require, exports, UIDom, UIShapes, UIBlockControlPortView) {
    "use strict";
    /**
     * This class defined the customized default view for a UI block event port.
     * @private
     * @class UIBlockEventPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockEventPortView
     * @extends UIBlockControlPortView
     */
    class UIBlockEventPortView extends UIBlockControlPortView {
        /**
         * @public
         * @constructor
         * @param {UIBlockEventPort} port - The UI block event port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Destroys the connector.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._portHandler = undefined;
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Creates the block event port shape.
         * @protected
         * @override
         */
        _createShape() {
            this._polygon = UIDom.createSVGPath({ attributes: { d: UIShapes.eventPortPathPoints } });
            this._portHandler = UIDom.createSVGPolygon({
                className: 'sch-event-port-handler',
                attributes: { points: UIShapes.controlPortPolygonPoints }
            });
            this._element.appendChild(this._portHandler);
            if (!this._port.isStartPort()) {
                UIDom.transformSVGShape(this._polygon, 15, 0, -180);
                UIDom.transformSVGShape(this._portHandler, 15, 0, -180);
            }
        }
    }
    return UIBlockEventPortView;
});
