/// <amd-module name='DS/EPSSchematicsUI/viewers/EPSSchematicsUIThumbnailViewer'/>
define("DS/EPSSchematicsUI/viewers/EPSSchematicsUIThumbnailViewer", ["require", "exports", "DS/EPSSchematicsUI/viewers/EPSSchematicsUIEGraphViewer", "DS/EPSSchematicsUI/groups/EPSSchematicsUIThumbnailGraph", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIBlock", "DS/EPSSchematicsUI/controllers/EPSSchematicsUILabelController", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIContextualBarController", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock"], function (require, exports, UIEGraphViewer, UIThumbnailGraph, UIBlock, UILabelController, UIContextualBarController, GraphBlock) {
    "use strict";
    /**
     * This class defines a UI Thumbnail viewer used for block
     * thumbnail generation in the block library documentation.
     * @private
     * @class UIThumbnailViewer
     * @alias module:DS/EPSSchematicsUI/viewersEPSSchematicsUIThumbnailViewer
     * @extends UIEGraphViewer
     */
    class UIThumbnailViewer extends UIEGraphViewer {
        /**
         * @public
         * @constructor
         * @param {HTMLElement} container - The HTML parent container that will hold the graph viewer.
         * @param {UIEditor} editor - The editor.
         * @param {string} blockUid - The uid of the block definition.
         */
        constructor(container, editor, blockUid) {
            super(container, editor);
            this._blockUid = blockUid;
            // Creates a thumbnail block
            this._graphUI = new UIThumbnailGraph(this, new GraphBlock());
            this._blockModel = this._graphUI.getModel().createBlock(this._blockUid);
            this._blockUI = new UIBlock(this._graphUI, this._blockModel, 0, 0);
            this._display.addNode(this._blockUI.getDisplay());
            this._contextualBarController = new UIContextualBarController(this);
            // Display the block labels
            this._labelController = new UILabelController(this);
            this._labelController.displayBlockLabels(this._blockUI, 0 /* UIEnums.ELabelDisplaySpeed.eDirect */);
            this._resize();
            this._labelController.updateLabels(this.getViewpoint());
        }
        /**
         * Removes the viewer.
         * @public
         * @override
         */
        remove() {
            this._labelController.remove();
            this._contextualBarController.remove();
            this._blockUI.remove();
            this._graphUI.remove();
            this._blockUid = undefined;
            this._labelController = undefined;
            this._contextualBarController = undefined;
            this._graphUI = undefined;
            this._blockUI = undefined;
            this._blockModel = undefined;
            super.remove();
        }
        /**
         * Gets the main graph of the viewer.
         * @public
         * @returns {UIThumbnailGraph} The main graph of the viewer.
         */
        getMainGraph() {
            return this._graphUI;
        }
        /**
         * Gets the contextual bar controller.
         * @public
         * @returns {UIContextualBarController} The contextual bar controller.
         */
        getContextualBarController() {
            return this._contextualBarController;
        }
        /**
         * Gets the label controller.
         * @public
         * @returns {UILabelController} The label controller.
         */
        getLabelController() {
            return this._labelController;
        }
        /**
         * Resizes the view of the graph.
         * @private
         */
        _resize() {
            const kBorderGap = 10;
            const labelsBB = this._labelController.getBlockLabelsBoundingBox();
            if (labelsBB !== undefined) {
                const blockBB = this._blockUI.getElement().getBoundingClientRect();
                // Set the dimension of the viewer
                const viewerWidth = labelsBB.width + (kBorderGap * 2);
                const viewerHeight = labelsBB.height + (kBorderGap * 2);
                this._container.style.width = viewerWidth + 'px';
                this._container.style.minWidth = viewerWidth + 'px';
                this._container.style.height = viewerHeight + 'px';
                // Set the position of the block by intersecting the 2 bounding boxes
                const blockLeft = labelsBB.left < blockBB.left ? blockBB.left - labelsBB.left + kBorderGap : kBorderGap;
                const blockTop = labelsBB.top < blockBB.top ? blockBB.top - labelsBB.top + kBorderGap : kBorderGap;
                this._blockUI.setPosition(blockLeft, blockTop);
            }
        }
    }
    return UIThumbnailViewer;
});
