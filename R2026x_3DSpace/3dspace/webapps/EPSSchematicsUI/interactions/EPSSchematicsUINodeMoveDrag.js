/// <amd-module name='DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeMoveDrag'/>
define("DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeMoveDrag", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphIact", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIPersistentLabel"], function (require, exports, EGraphIact, UINode, UIDom, UIBlock, UIPersistentLabel) {
    "use strict";
    /**
     * This class defines UI node move drag interaction.
     * @private
     * @class UINodeMoveDrag
     * @alias module:DS/EPSSchematicsUI/interactions/EPSSchematicsUINodeMoveDrag
     * @extends EGraphIact.NodeDrag
     */
    class UINodeMoveDrag extends EGraphIact.NodeDrag {
        /**
         * @public
         * @constructor
         * @param {EGraphCore.EGraph} gr - The concerned graph.
         */
        constructor(gr) {
            super(gr);
        }
        /**
         * The node move callback.
         * The graph size is modified according to the position of the node.
         * @protected
         * @override
         * @param {EGraphIact.IMouseMoveData} data - The move data.
         */
        onmove(data) {
            super.onmove(data);
            if (Array.isArray(this.nodes) && this.nodes.length > 0) {
                this.gr.updateLock();
                try {
                    const viewer = this.gr.data.uiElement;
                    // Automatic grid snapping
                    this.nodes.forEach(node => {
                        const uiElement = node.data.uiElement;
                        if (uiElement !== undefined) {
                            UIDom.addClassName(uiElement.getView().getElement(), 'move');
                            if (uiElement instanceof UINode && uiElement.isDraggable()) {
                                uiElement.setPosition(Math.round(node.left), Math.round(node.top));
                                if (uiElement instanceof UIBlock) {
                                    uiElement.getUIDataPorts(undefined, true).forEach(dataPort => {
                                        const persistentLabel = dataPort.getPersistentLabel();
                                        if (persistentLabel) {
                                            persistentLabel.synchronizePositionWithParentNode();
                                        }
                                    });
                                }
                                else if (uiElement instanceof UIPersistentLabel) {
                                    viewer.getEditor().getHistoryController().registerMoveAction(uiElement);
                                }
                            }
                        }
                    });
                    // Automatic resize of the parent graph
                    const graph = viewer.getMainGraph();
                    const updated = graph.updateSizeFromBlocks();
                    if (updated) {
                        graph.onUIChange();
                    }
                }
                finally {
                    this.gr.updateUnlock();
                }
            }
        }
        /**
         * The node move end callback.
         * @protected
         * @override
         * @param {boolean} cancel - True when the drag is cancel else false.
         */
        onend(cancel) {
            super.onend(cancel);
            if (Array.isArray(this.nodes) && this.nodes.length > 0) {
                const uiElements = this.nodes.map(node => { return node.data.uiElement; });
                uiElements.forEach(uiElement => UIDom.removeClassName(uiElement.getView().getElement(), 'move'));
                const viewer = this.gr.data.uiElement;
                const historyController = viewer.getEditor().getHistoryController();
                historyController.registerMoveAction(uiElements);
            }
        }
    }
    return UINodeMoveDrag;
});
