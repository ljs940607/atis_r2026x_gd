/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkRerouteDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkRerouteDrag", ["require", "exports", "DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkRerouteDrag", "DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkConnectDrag"], function (require, exports, UILinkRerouteDrag, UIControlLinkConnectDrag) {
    "use strict";
    /**
     * This class defines a control link reroute drag interaction.
     * @private
     * @class UIControlLinkRerouteDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkRerouteDrag
     * @extends UILinkRerouteDrag
     */
    class UIControlLinkRerouteDrag extends UILinkRerouteDrag {
        /**
         * @public
         * @constructor
         * @param {EGraphCore.EGraph} graph - The graph.
         * @param {EGraphCore.Connector} currentConnector - The connector from which the drag began.
         * @param {EGraphIact.IRerouteOptions} subElt - The reroute options.
         */
        constructor(graph, currentConnector, subElt) {
            super(graph, currentConnector, subElt);
        }
        /**
         * Instantiates a temporary edge that follows the pointer
         * when no target connector is picked.
         * @protected
         * @returns {EGraphCore.Edge} The new temporary edge.
         */
        // eslint-disable-next-line class-methods-use-this
        newTempEdge() {
            return UIControlLinkConnectDrag.prototype.newTempEdge.call(this);
        }
        /**
         * Instantiates the actual created edge.
         * @protected
         * @param {EGraphCore.Connector} _c1 - The first connector.
         * @param {EGraphCore.Connector} _c2 - The second connector.
         * @returns {EGraphCore.Edge} The new edge.
         */
        newEdge(_c1, _c2) {
            return UIControlLinkConnectDrag.prototype.newEdge.call(this, _c1, _c2);
        }
        /**
         * Tests if a connector can accept the drag.
         * @protected
         * @param {EGraphCore.Connector} c1 - The dragged connector.
         * @param {EGraphCore.Connector} c2 - The connector to test.
         * @returns {boolean} True to accept the connection else false.
         */
        onaccept(c1, c2) {
            return UIControlLinkConnectDrag.prototype.onaccept.call(this, c1, c2);
        }
        /**
         * The edge connection callback.
         * @protected
         * @param {EGraphCore.Edge} edge - The edge.
         * @param {EGraphCore.Connector} otherConnector - The other connector.
         * @param {boolean} temporaryEdge - True if the edge is a temporary edge.
         */
        onconnect(edge, otherConnector, temporaryEdge) {
            UIControlLinkConnectDrag.prototype.onconnect.call(this, edge, otherConnector, temporaryEdge);
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
                const controlLinks = [];
                if (this.edges.length <= 0) {
                    this.edgesToReroute.forEach(edge => {
                        const link = edge.data.uiElement;
                        const startPort = link.getStartPort();
                        const endPort = link.getEndPort();
                        const waitCount = link.getModel().getWaitCount();
                        this._graph.getModel().removeControlLink(link.getModel());
                        const controlLink = this._graph.getModel().createControlLink(startPort.getModel(), endPort.getModel());
                        controlLink.setWaitCount(waitCount);
                        const graphControlLinks = this._graph.getControlLinks();
                        const controlLinkUI = graphControlLinks[graphControlLinks.length - 1];
                        if (controlLinkUI.getModel() === controlLink) {
                            controlLinks.push(controlLinkUI.getDisplay());
                        }
                    });
                }
                else {
                    this.edgesToReroute.forEach(edge => this._graph.getModel().removeControlLink(edge.data.uiElement.getModel()));
                    this.edges.forEach(edge => {
                        const port1 = edge.cl1.c.data.uiElement;
                        const port2 = edge.cl2.c.data.uiElement;
                        const controlLink = this._graph.getModel().createControlLink(port1.getModel(), port2.getModel());
                        controlLink.setWaitCount(edge.data.uiElement.getModel().getWaitCount());
                        edge.remove();
                        const graphControlLinks = this._graph.getControlLinks();
                        const controlLinkUI = graphControlLinks[graphControlLinks.length - 1];
                        if (controlLinkUI.getModel() === controlLink) {
                            controlLinks.push(controlLinkUI.getDisplay());
                        }
                    });
                }
                this._graph.getViewer().updateSelection(controlLinks);
            }
        }
    }
    return UIControlLinkRerouteDrag;
});
