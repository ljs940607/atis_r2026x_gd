/// <amd-module name='DS/EPSSchematicsUI/labels/EPSSchematicsUIControlLinkLabel'/>
define("DS/EPSSchematicsUI/labels/EPSSchematicsUIControlLinkLabel", ["require", "exports", "DS/EPSSchematicsUI/labels/EPSSchematicsUILinkLabel", "DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel", "DS/EPSSchematicsUI/labels/EPSSchematicsUIControlPortLabel"], function (require, exports, UILinkLabel, UIPortLabel, UIControlPortLabel) {
    "use strict";
    /**
     * This class defines a UI control link label.
     * @private
     * @class UIControlLinkLabel
     * @alias module:DS/EPSSchematicsUI/labels/EPSSchematicsUIControlLinkLabel
     * @extends UILinkLabel
     */
    class UIControlLinkLabel extends UILinkLabel {
        /**
         * @public
         * @constructor
         * @param {UILabelController} controller - The UI label controller.
         * @param {UIControlLink} linkUI - The UI data link.
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         */
        constructor(controller, linkUI, displaySpeed) {
            super(controller, linkUI, displaySpeed);
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
            const isStartUpperEnd = startPortBBox.top <= endPortBBox.top;
            // Compute possible positions
            const startLabelTopBorder = startPortBBox.top - parentBBox.top - startLabelBBox.height - gap;
            const startLabelBottomBorder = startPortBBox.top - parentBBox.top + startPortBBox.height + gap;
            const endLabelTopBorder = endPortBBox.top - parentBBox.top - endLabelBBox.height - gap;
            const endLabelBottomBorder = endPortBBox.top - parentBBox.top + endPortBBox.height + gap;
            // Compute start/end top/left positions
            const startLabelTop = isStartUpperEnd ? startLabelTopBorder : startLabelBottomBorder;
            const endLabelTop = isStartUpperEnd ? endLabelBottomBorder : endLabelTopBorder;
            const startLabelLeft = startPortBBox.left - parentBBox.left + startPortBBox.width + gap;
            const endLabelLeft = endPortBBox.left - parentBBox.left - endLabelBBox.width - gap;
            super.updatePosition(vpt, startLabelLeft, startLabelTop, endLabelLeft, endLabelTop);
        }
        /**
         * Creates the data link label element.
         * @protected
         * @override
         */
        _createElement() {
            const startPort = this._linkUI.getStartPort();
            const endPort = this._linkUI.getEndPort();
            this._startPortLabel = new UIControlPortLabel(this._controller, startPort, this._displaySpeed, false);
            this._endPortLabel = new UIControlPortLabel(this._controller, endPort, this._displaySpeed, false);
            super._createElement();
        }
    }
    return UIControlLinkLabel;
});
