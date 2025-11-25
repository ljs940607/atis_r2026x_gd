/// <amd-module name="DS/DELSwimLaneChart_v1/services/DELSwimLaneChartDocument"/>
define("DS/DELSwimLaneChart_v1/services/DELSwimLaneChartDocument", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwimLaneChartDocument {
        constructor(presenter) {
            this._presenter = presenter;
        }
        /****CRUDS operations */
        // read 
        getAllNodes() {
            return this._presenter.getAllNodes();
        }
        getNodeById(nodeId) {
            return this._presenter.getNodeById(nodeId);
        }
        getSelectedNodes() {
            return this._presenter.getSelectedNodes();
        }
        // creation
        createColumn(props) {
            this._presenter.createColumn(props);
        }
        createNode(props) {
            this._presenter.createNode(props);
        }
        // update
        updateColumn(props) {
            this._presenter.updateColumn(props);
        }
        updateNode(props) {
            this._presenter.updateNode(props);
        }
        // delete
        deleteColumn(id) {
            this._presenter.deleteColumn(id);
        }
        deleteGroup(id) {
            this._presenter.deleteGroup(id);
        }
        deleteNode(id) {
            this._presenter.deleteNode(id);
        }
        // ux interactions
        highlightNode(nodeId) {
            this._presenter.highlightNode(nodeId);
        }
        unhighlightNode(nodeId) {
            this._presenter.unHighlightNode(nodeId);
        }
        // selection/deselection methods
        scrollIntoNode(nodeId) {
            this._presenter.scrollIntoNode(nodeId);
        }
        selectNode(nodeId, shouldScrollFlag = true) {
            this._presenter.selectNode(nodeId, shouldScrollFlag);
        }
        selectNodes(nodesIds) {
            this._presenter.selectNodes(nodesIds);
        }
        selectAllNodes() {
            this._presenter.selectAllNodes();
        }
        unSelectNode(nodeId) {
            this._presenter.unSelectNode(nodeId);
        }
        unSelectNodes(nodesIds) {
            this._presenter.unSelectNodes(nodesIds);
        }
        unSelectAllNodes() {
            this._presenter.unSelectAllNodes();
        }
        async exportToSvg() {
            await this._presenter.exportToSvg();
        }
        fitToWindowHeight() {
            this._presenter.fitToWindowHeight();
        }
        resetTransformation() {
            this._presenter.resetTransformation();
        }
        minimizeNode(id) {
            this._presenter.minimize(id);
        }
        expandNode(id) {
            this._presenter.expand(id);
        }
        expandAll() {
            this._presenter.expandAll();
        }
        minimizeAll() {
            this._presenter.minimizeAll();
        }
    }
    exports.default = SwimLaneChartDocument;
});
