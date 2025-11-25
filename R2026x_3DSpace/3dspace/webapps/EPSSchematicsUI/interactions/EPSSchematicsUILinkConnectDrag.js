/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkConnectDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkConnectDrag", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphIact"], function (require, exports, EGraphIact) {
    "use strict";
    /**
     * This class defines a link connect drag interaction.
     * @private
     * @abstract
     * @class UILinkConnectDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUILinkConnectDrag
     * @extends EGraphIact.ConnConnectDrag
     */
    class UILinkConnectDrag extends EGraphIact.ConnConnectDrag {
        /**
         * @public
         * @constructor
         * @param {EGraphCore.EGraph} gr - The concerned graph.
         * @param {EGraphCore.Connector} c - The concerned connector.
         */
        constructor(gr, c) {
            super(gr, c);
            this._port = c.data.uiElement;
            this._graph = this._port.getParentGraph();
        }
        /**
         * The connector drag end callback.
         * @public
         * @override
         * @param {boolean} cancel - True when the drag is cancel else false.
         */
        onend(cancel) {
            super.onend(cancel);
        }
    }
    return UILinkConnectDrag;
});
