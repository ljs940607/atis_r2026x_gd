/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkRerouteDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkRerouteDrag", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphIact"], function (require, exports, EGraphIact) {
    "use strict";
    /**
     * This class defines a link reroute drag interaction.
     * @private
     * @abstract
     * @class UILinkRerouteDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkRerouteDrag
     * @extends EGraphIact.RerouteConnConnectDrag
     */
    class UILinkRerouteDrag extends EGraphIact.RerouteConnConnectDrag {
        /**
         * @public
         * @constructor
         * @param {EGraphCore.EGraph} graph - The graph.
         * @param {EGraphCore.Connector} currentConnector - The connector from which the drag began.
         * @param {EGraphIact.IRerouteOptions} subElt - The reroute options.
         */
        constructor(graph, currentConnector, subElt) {
            super(graph, currentConnector, subElt);
            this._beginPorts = [];
            const viewer = graph.data.uiElement;
            this._graph = viewer.getMainGraph();
            this._currentPort = currentConnector.data.uiElement;
            this.beginConnectors.forEach(connector => this._beginPorts.push(connector.data.uiElement));
        }
        /**
         * The edge disconnection callback.
         * @protected
         * @param {EGraphCore.Edge} _edge - The disconnected edge.
         * @param {EGraphCore.Connector} _otherConnector - The other connector.
         * @param {boolean} _temporaryEdge - True if the edge is a temporary edge.
         * @param {boolean} [_nextOtherConnector] - Not null when the disconnection is
         * immediately followed by a connection to a not temporary connector.
         */
        ondisconnect(_edge, _otherConnector, _temporaryEdge, _nextOtherConnector) {
            this._currentPort.getView().hideRerouteHandler();
            this._beginPorts.forEach(port => port.getView().hideRerouteHandler());
        }
        /**
         * The connector drag end callback.
         * @public
         * @override
         * @param {boolean} cancel - True when the drag is cancel else false.
         */
        onend(cancel) {
            EGraphIact.ConnConnectDrag.prototype.onend.call(this, cancel);
        }
    }
    return UILinkRerouteDrag;
});
