/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIPersistentLabel'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIPersistentLabel", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIPersistentLabelView", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIPersistentLabelConnector", "DS/EPSSchematicsUI/edges/EPSSchematicsUIPersistentLabelEdge", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort"], function (require, exports, UINode, UIPersistentLabelView, UIPersistentLabelConnector, UIPersistentLabelEdge, DataPort) {
    "use strict";
    // TODO: Find a way to bring edges in front of nodes!
    // TODO: Rework the edge position from the label so that the attach point be on left, middle or right!
    // TODO: Manage history!
    /**
     * This class defines a UI persistent label.
     * @private
     * @class UIPersistentLabel
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIPersistentLabel
     * @extends UINode
     */
    class UIPersistentLabel extends UINode {
        /**
         * @public
         * @constructor
         * @param {UIPort} port - The UI port.
         */
        constructor(port) {
            super({ graph: port.getParentGraph(), isDraggable: true });
            this._portUI = port;
            this._parent = this._portUI.getParent();
            this.setView(new UIPersistentLabelView(this));
            this.setDimension(100, 30);
            this.setMinDimension(100, 30);
            this._alignPositionOnPort();
            this.addNodeToGraph();
            this._offsetLeft = this._parent.getLeft() - this.getLeft();
            this._offsetTop = this._parent.getTop() - this.getTop();
            // Add connector
            this._connector = new UIPersistentLabelConnector(this);
            this.appendConnector(this._connector);
            // Add edge
            const viewer = this._graph.getViewer().getDisplay();
            this._edge = new UIPersistentLabelEdge();
            viewer.addEdge(this._connector.getDisplay(), this._portUI.getDisplay(), this._edge.getDisplay());
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the node from its parent graph.
         * @public
         * @override
         */
        remove() {
            this._edge.remove();
            this._connector.remove();
            this._portUI = undefined;
            this._parent = undefined;
            this._offsetLeft = undefined;
            this._offsetTop = undefined;
            this._connector = undefined;
            this._edge = undefined;
            super.remove();
        }
        /**
         * Gets the main view of the node.
         * @public
         * @override
         * @returns {UIPersistentLabelView} The main view of the node.
         */
        getView() {
            return super.getView();
        }
        /**
         * Projects the specified JSON object to the label.
         * @public
         * @param {IJSONLabelUI} iJSONLabel - The JSON projected label.
         */
        fromJSON(iJSONLabel) {
            if (iJSONLabel) {
                if (iJSONLabel.left !== undefined && iJSONLabel.top !== undefined) {
                    this.setPosition(iJSONLabel.left, iJSONLabel.top);
                }
                if (iJSONLabel.width !== undefined && iJSONLabel.height !== undefined) {
                    this.setDimension(iJSONLabel.width, iJSONLabel.height);
                }
            }
        }
        /**
         * Projects the label to the specified JSON object.
         * @public
         * @param {IJSONLabelUI} oJSONLabel - The JSON projected label.
         */
        toJSON(oJSONLabel) {
            if (oJSONLabel) {
                oJSONLabel.top = this.getActualTop();
                oJSONLabel.left = this.getActualLeft();
                oJSONLabel.height = this._display.actualHeight;
                oJSONLabel.width = this._display.actualWidth;
            }
        }
        /**
         * Synchronizes the persistent label position when moving associated parent node.
         * @public
         */
        synchronizePositionWithParentNode() {
            const left = this._parent.getLeft() - this._offsetLeft;
            const top = this._parent.getTop() - this._offsetTop;
            this.setLeft(left);
            this.setTop(top);
        }
        /**
         * Sets the label position relative to its parent graph.
         * @public
         * @override
         * @param {number} left - The left position of the label.
         * @param {number} top - The top position of the label.
         */
        setPosition(left, top) {
            this._offsetLeft = this._parent.getLeft() - left;
            this._offsetTop = this._parent.getTop() - top;
            super.setPosition(left, top);
        }
        /**
         * Gets the associated UI port.
         * @public
         * @returns {UIPort} - The associated port.
         */
        getUIPort() {
            return this._portUI;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Aligns the persistent label position on its port.
         * @private
         */
        _alignPositionOnPort() {
            const kLabelTopGap = 50;
            const vpt = this._portUI.getParentGraph().getViewer().getViewpoint();
            const portBBox = this._portUI.getBoundingBox(vpt);
            const left = this._portUI.getLeft() - (this.getWidth() / 2); // The attach point of the connector is on center so no need to (width / 2)
            let top = 0;
            const isDataPort = this._portUI.getModel() instanceof DataPort;
            if (isDataPort) {
                const isOnTopOfPort = this._portUI.isDataPortLabelOnTop();
                if (isOnTopOfPort) {
                    top = this._portUI.getTop() - this.getHeight() - (portBBox.height / vpt.scale) - kLabelTopGap;
                }
                else {
                    top = this._portUI.getTop() + (portBBox.height / vpt.scale) + kLabelTopGap;
                }
            }
            top = Math.round(top);
            this.setPosition(left, top);
        }
    }
    return UIPersistentLabel;
});
