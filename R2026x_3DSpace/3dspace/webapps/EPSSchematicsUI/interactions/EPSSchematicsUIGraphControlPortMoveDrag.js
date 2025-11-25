/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphControlPortMoveDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphControlPortMoveDrag", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines UI graph control port move drag interaction.
     * @private
     * @class UIGraphControlPortMoveDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUIGraphControlPortMoveDrag
     */
    class UIGraphControlPortMoveDrag {
        /**
         * @public
         * @constructor
         * @param {UIGraphControlPort} controlPort - The graph control port.
         */
        constructor(controlPort) {
            this._dragStart = true;
            this._anchorY = 0;
            this._controlPort = controlPort;
        }
        /**
         * The connector mouse move callback.
         * @public
         * @override
         * @param {EGraphIact.IMouseMoveData} data - The move data.
         */
        onmousemove(data) {
            const graphPosY = data.graphPos[1];
            const connector = this._controlPort.getDisplay();
            const graph = this._controlPort.getParent();
            const graphTop = graph.getDisplay().actualTop;
            if (this._dragStart) {
                const connectorHeight = this._controlPort.getView().getHandler().height.baseVal.value;
                this._anchorY = graphPosY - connector.top;
                this._anchorY = this._anchorY > 0 ? this._anchorY : 0;
                this._anchorY = this._anchorY < connectorHeight ? this._anchorY : connectorHeight;
                this._dragStart = false;
            }
            const diff = Math.abs(graphTop - graphPosY);
            let posY = diff - this._anchorY;
            posY = this._controlPort.computeValidOffset(posY);
            connector.multiset(['cstr', 'offset'], posY);
            graph.getViewer().getLabelController().clearAllLabels();
        }
        /**
         * The connector move end callback.
         * @public
         * @override
         */
        onend() {
            if (this._anchorY > 0) {
                const graph = this._controlPort.getParent();
                graph.onUIChange();
                const historyController = graph.getViewer().getEditor().getHistoryController();
                historyController.registerMoveAction([this._controlPort]);
            }
        }
    }
    return UIGraphControlPortMoveDrag;
});
