/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkConnectDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkConnectDrag", ["require", "exports", "DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkConnectDrag", "DS/EPSSchematicsUI/edges/EPSSchematicsUIDataLink", "DS/EPSSchematicsModelWeb/EPSSchematicsDataLink", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews"], function (require, exports, UILinkConnectDrag, UIDataLink, DataLink, EGraphCore, EGraphViews) {
    "use strict";
    /**
     * This class defines a data link connect drag interaction.
     * @private
     * @class UIDataLinkConnectDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkConnectDrag
     * @extends UILinkConnectDrag
     * @private
     */
    class UIDataLinkConnectDrag extends UILinkConnectDrag {
        /**
         * @public
         * @constructor
         * @param {EGraphCore.EGraph} gr - The concerned graph.
         * @param {EGraphCore.Connector} c - The concerned connector.
         */
        constructor(gr, c) {
            super(gr, c);
        }
        /**
         * Instantiates a temporary edge that follows the pointer
         * when no target connector is picked.
         * @protected
         * @returns {EGraphCore.Edge} The new temporary edge.
         */
        // eslint-disable-next-line class-methods-use-this
        newTempEdge() {
            this._graph.highlightCompatibleDataPorts(this._port);
            return new EGraphCore.Edge(new EGraphViews.SVGEdgeView('sch-data-link-path temp'));
        }
        /**
         * Instantiates the actual created edge.
         * @protected
         * @param {EGraphCore.Connector} _c1 - The first connector.
         * @param {EGraphCore.Connector} _c2 - The second connector.
         * @returns {EGraphCore.Edge} The new edge.
         */
        newEdge(_c1, _c2) {
            const dataLink = new UIDataLink(this._graph, new DataLink(), true);
            return dataLink.getDisplay();
        }
        /**
         * Tests if a connector can accept the drag.
         * @protected
         * @param {EGraphCore.Connector} c1 - The dragged connector.
         * @param {EGraphCore.Connector} c2 - The connector to test.
         * @returns {boolean} True to accept the connection else false.
         */
        onaccept(c1, c2) {
            const port1 = c1.data.uiElement;
            const port2 = c2.data.uiElement;
            return this._graph.isDataPortLinkable(port1, port2, [], true);
        }
        /**
         * The edge connection callback.
         * @protected
         * @param {EGraphCore.Edge} _edge - The edge.
         * @param {EGraphCore.Connector} _otherConnector - The other connector.
         * @param {boolean} temporaryEdge - True if the edge is a temporary edge.
         */
        onconnect(_edge, _otherConnector, temporaryEdge) {
            if (!temporaryEdge) {
                this._graph.unhighlightCompatibleDataPorts();
            }
        }
        /**
         * The connector drag end callback.
         * @public
         * @override
         * @param {boolean} cancel - True when the drag is cancel else false.
         */
        onend(cancel) {
            super.onend(cancel);
            this._graph.unhighlightCompatibleDataPorts();
            if (this.edge !== undefined && this.edge !== null) {
                const port1 = this.edge.cl1.c.data.uiElement;
                const port2 = this.edge.cl2.c.data.uiElement;
                this._graph.getModel().createDataLink(port1.getModel(), port2.getModel(), true);
                this.edge.remove();
                this._graph.getViewer().getEditor().getHistoryController().registerCreateAction(this.edge.data.uiElement);
            }
        }
    }
    return UIDataLinkConnectDrag;
});
