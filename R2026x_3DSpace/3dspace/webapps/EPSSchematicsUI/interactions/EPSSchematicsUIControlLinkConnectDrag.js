/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkConnectDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkConnectDrag", ["require", "exports", "DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkConnectDrag", "DS/EPSSchematicsUI/edges/EPSSchematicsUIControlLink", "DS/EPSSchematicsModelWeb/EPSSchematicsControlLink", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews"], function (require, exports, UILinkConnectDrag, UIControlLink, ControlLink, Tools, EGraphCore, EGraphViews) {
    "use strict";
    /**
     * This class defines a control link connect drag interaction.
     * @private
     * @class UIControlLinkConnectDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUIControlLinkConnectDrag
     * @extends UILinkConnectDrag
     */
    class UIControlLinkConnectDrag extends UILinkConnectDrag {
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
         * @public
         * @returns {EGraphCore.Edge} The new temporary edge.
         */
        // eslint-disable-next-line class-methods-use-this
        newTempEdge() {
            return new EGraphCore.Edge(new EGraphViews.SVGEdgeView('sch-control-link-temp'));
        }
        /**
         * Instantiates the actual created edge.
         * @public
         * @param {EGraphCore.Connector} _c1 - The first connector.
         * @param {EGraphCore.Connector} _c2 - The second connector.
         * @returns {EGraphCore.Edge} The new edge.
         */
        newEdge(_c1, _c2) {
            const controlLink = new UIControlLink(this._graph, new ControlLink());
            return controlLink.getDisplay();
        }
        /**
         * Tests if a connector can accept the drag.
         * @public
         * @param {EGraphCore.Connector} c1 - The dragged connector.
         * @param {EGraphCore.Connector} c2 - The connector to test.
         * @returns {boolean} True to accept the connection else false.
         */
        onaccept(c1, c2) {
            const port1 = c1.data.uiElement;
            const port2 = c2.data.uiElement;
            return this._graph.getModel().isControlLinkable(port1.getModel(), port2.getModel());
        }
        /**
         * The edge connection callback.
         * @public
         * @param {EGraphCore.Edge} edge - The edge.
         * @param {EGraphCore.Connector} _otherConnector - The other connector.
         * @param {boolean} temporaryEdge - True if the edge is a temporary edge.
         */
        onconnect(edge, _otherConnector, temporaryEdge) {
            if (!temporaryEdge) {
                const port1 = edge.cl1.c.data.uiElement;
                const port2 = edge.cl2.c.data.uiElement;
                const doAddFramebreak = port1.getEditor().getOptions().enableFramebreaks && Tools.isFrameBreakAddable(port1.getModel(), port2.getModel(), this._graph.getModel());
                if (doAddFramebreak) {
                    edge.data.uiElement.getModel().setWaitCount(1);
                }
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
            if (this.edge !== undefined && this.edge !== null) {
                const port1 = this.edge.cl1.c.data.uiElement;
                const port2 = this.edge.cl2.c.data.uiElement;
                this.edge.remove();
                const controlLink = this._graph.getModel().createControlLink(port1.getModel(), port2.getModel());
                controlLink.setWaitCount(this.edge.data.uiElement.getModel().getWaitCount());
                this._graph.getViewer().getEditor().getHistoryController().registerCreateAction(this.edge.data.uiElement);
            }
        }
    }
    return UIControlLinkConnectDrag;
});
