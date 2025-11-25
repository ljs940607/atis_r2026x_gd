/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkRerouteDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkRerouteDrag", ["require", "exports", "DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkRerouteDrag", "DS/EPSSchematicsUI/edges/EPSSchematicsUIDataLink", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews", "DS/EPSSchematicsModelWeb/EPSSchematicsDataLink"], function (require, exports, UILinkRerouteDrag, UIDataLink, EGraphCore, EGraphViews, DataLink) {
    "use strict";
    /**
     * This class defines a data link reroute drag interaction.
     * @private
     * @class UIDataLinkRerouteDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataLinkRerouteDrag
     * @extends UILinkRerouteDrag
     */
    class UIDataLinkRerouteDrag extends UILinkRerouteDrag {
        /**
         * @public
         * @constructor
         * @param {EGraphCore.EGraph} graph - The graph.
         * @param {EGraphCore.Connector} currentConnector - The connector from which the drag began.
         * @param {EGraphIact.IRerouteOptions} subElt - The reroute options.
         */
        constructor(graph, currentConnector, subElt) {
            super(graph, currentConnector, subElt);
            this._reroutedLinks = this.edgesToReroute.map(edge => edge.data.uiElement.getModel());
        }
        /**
         * Instantiates a temporary edge that follows the pointer
         * when no target connector is picked.
         * @protected
         * @returns {EGraphCore.Edge} The new temporary edge.
         */
        newTempEdge() {
            this._graph.highlightCompatibleDataPortsFromList(this._beginPorts, this._reroutedLinks);
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
            const dataLink = new UIDataLink(this._graph, new DataLink());
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
            return this._graph.getModel().isDataLinkable(c1.data.uiElement.getModel(), c2.data.uiElement.getModel(), this._reroutedLinks, true);
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
            if (this.removed) {
                if (this.edges.length <= 0) {
                    this.edgesToReroute.forEach(edge => {
                        const link = edge.data.uiElement;
                        const startPort = link.getStartPort();
                        const endPort = link.getEndPort();
                        this._graph.rerouteUIDataLink(link, startPort, endPort);
                    });
                }
                else {
                    this.edgesToReroute.forEach(edge => this._graph.getModel().removeDataLink(edge.data.uiElement.getModel()));
                    this.edges.forEach(edge => {
                        const port1 = edge.cl1.c.data.uiElement;
                        const port2 = edge.cl2.c.data.uiElement;
                        this._graph.getModel().createDataLink(port1.getModel(), port2.getModel(), true);
                        edge.remove();
                    });
                }
            }
        }
    }
    return UIDataLinkRerouteDrag;
});
