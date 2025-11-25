/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPersistentLabelConnectorView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPersistentLabelConnectorView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIConnectorView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UIConnectorView, UIDom) {
    "use strict";
    /**
     * This class defined a UI persistent label connector view.
     * @private
     * @class UIPersistentLabelConnectorView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPersistentLabelConnectorView
     * @extends UIConnectorView
     */
    class UIPersistentLabelConnectorView extends UIConnectorView {
        /**
         * @public
         * @constructor
         * @param {UIPersistentLabelConnector} connector - The persistent label connector.
         */
        constructor(connector) {
            super();
            this._connector = connector;
        }
        /**
         * Destroys the connector.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._connector = undefined;
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
            UIDom.addClassName(this.structure.root, 'sch-connector-label');
            /*const circle = UIDom.createSVGCircle({
                attributes: { cx: 5, cy: 0, r: 5 },
                className: 'sch-connector-label-circle',
                parent: this.element
            });*/
            return this._element;
        }
    }
    return UIPersistentLabelConnectorView;
});
