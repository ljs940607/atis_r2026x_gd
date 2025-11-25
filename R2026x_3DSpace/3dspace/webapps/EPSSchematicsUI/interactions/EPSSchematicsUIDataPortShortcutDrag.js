/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataPortShortcutDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataPortShortcutDrag", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphIact"], function (require, exports, EGraphIact) {
    "use strict";
    /**
     * This class defines a data port shortcut drag interaction.
     * @private
     * @class UIDataPortShortcutDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUIDataPortShortcutDrag
     * @extends EGraphIact.SinglePtDrag
     */
    class UIDataPortShortcutDrag extends EGraphIact.SinglePtDrag {
        /**
         * @public
         * @constructor
         * @param {UIDataPort} port - The UI data port.
         */
        constructor(port) {
            super();
            this._port = port;
            this._graph = this._port.getParentGraph();
            this._shortcut = this._graph.createShortcut(this._port, this._port.getLeft(), this._port.getTop());
        }
        /**
         * The node move callback.
         * @protected
         * @override
         * @param {EGraphIact.IMouseMoveData} data - The move data.
         */
        onmove(data) {
            if (data.inside) {
                this._shortcut.setPosition(data.graphPos[0], data.graphPos[1]);
            }
        }
        /**
         * The node move end callback.
         * @protected
         * @override
         * @param {boolean} _cancel - True when the drag is cancel else false.
         */
        onend(_cancel) {
            if (this._shortcut !== undefined) {
                const historyController = this._graph.getViewer().getEditor().getHistoryController();
                historyController.registerCreateAction(this._shortcut);
            }
        }
    }
    return UIDataPortShortcutDrag;
});
