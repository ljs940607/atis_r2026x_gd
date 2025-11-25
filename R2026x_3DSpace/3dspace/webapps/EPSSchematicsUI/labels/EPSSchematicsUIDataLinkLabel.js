/// <amd-module name='DS/EPSSchematicsUI/labels/EPSSchematicsUIDataLinkLabel'/>
define("DS/EPSSchematicsUI/labels/EPSSchematicsUIDataLinkLabel", ["require", "exports", "DS/EPSSchematicsUI/labels/EPSSchematicsUILinkLabel", "DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel", "DS/EPSSchematicsUI/labels/EPSSchematicsUIDataPortLabel"], function (require, exports, UILinkLabel, UIPortLabel, UIDataPortLabel) {
    "use strict";
    /**
     * This class defines a UI data link label.
     * @private
     * @class UIDataLinkLabel
     * @alias module:DS/EPSSchematicsUI/labels/EPSSchematicsUIDataLinkLabel
     * @extends UILinkLabel
     */
    class UIDataLinkLabel extends UILinkLabel {
        /**
         * @public
         * @constructor
         * @param {UILabelController} controller - The UI label controller.
         * @param {UIDataLink} linkUI - The UI data link.
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         */
        constructor(controller, linkUI, displaySpeed) {
            super(controller, linkUI, displaySpeed);
        }
        /**
         * Creates the data link label element.
         * @protected
         * @override
         */
        _createElement() {
            const startPort = this._linkUI.getStartPort();
            const endPort = this._linkUI.getEndPort();
            this._startPortLabel = new UIDataPortLabel(this._controller, startPort, this._displaySpeed, false, false);
            this._endPortLabel = new UIDataPortLabel(this._controller, endPort, this._displaySpeed, false, false);
            super._createElement();
        }
        /**
         * Updates the start/end label and lines position.
         * @public
         * @override
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        updatePosition(vpt) {
            const startPort = this._linkUI.getStartPort();
            const endPort = this._linkUI.getEndPort();
            const startPortBBox = startPort.getBoundingBox(vpt);
            const endPortBBox = endPort.getBoundingBox(vpt);
            const parentBBox = this._linkUI.getParentGraph().getViewer().getClientRect();
            const startLabelBBox = this._startPortLabel.getElement().getBoundingClientRect();
            const endLabelBBox = this._endPortLabel.getElement().getBoundingClientRect();
            const gap = vpt.scale < 1 ? UIPortLabel.kLabelToPortXYGap * vpt.scale : UIPortLabel.kLabelToPortXYGap;
            const isStartLefterEnd = startPortBBox.left <= endPortBBox.left;
            // Compute possible positions
            const startLabelLeftBorder = startPortBBox.left - parentBBox.left - startLabelBBox.width - gap;
            const startLabelRightBorder = startPortBBox.left - parentBBox.left + startPortBBox.width + gap;
            const endLabelLeftBorder = endPortBBox.left - parentBBox.left - endLabelBBox.width - gap;
            const endLabelRightBorder = endPortBBox.left - parentBBox.left + endPortBBox.width + gap;
            // Compute start/end top/left positions
            const startLabelLeft = isStartLefterEnd ? startLabelLeftBorder : startLabelRightBorder;
            const endLabelLeft = isStartLefterEnd ? endLabelRightBorder : endLabelLeftBorder;
            const startLabelTop = startPortBBox.top - parentBBox.top + startPortBBox.height + gap;
            const endLabelTop = endPortBBox.top - parentBBox.top - endLabelBBox.height - gap;
            super.updatePosition(vpt, startLabelLeft, startLabelTop, endLabelLeft, endLabelTop);
        }
    }
    return UIDataLinkLabel;
});
