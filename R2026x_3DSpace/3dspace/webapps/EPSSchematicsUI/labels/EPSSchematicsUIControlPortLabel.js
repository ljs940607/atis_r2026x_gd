/// <amd-module name='DS/EPSSchematicsUI/labels/EPSSchematicsUIControlPortLabel'/>
define("DS/EPSSchematicsUI/labels/EPSSchematicsUIControlPortLabel", ["require", "exports", "DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph"], function (require, exports, UIPortLabel, UIDom, EventPort, UIGraph) {
    "use strict";
    /**
     * This class defines a UI control port label.
     * @private
     * @class UIControlPortLabel
     * @alias module:DS/EPSSchematicsUI/labels/EPSSchematicsUIControlPortLabel
     * @extends UIPortLabel
     */
    class UIControlPortLabel extends UIPortLabel {
        /**
         * @public
         * @constructor
         * @param {UILabelController} controller - The UI label controller.
         * @param {UIControlPort} portUI - The UI control port.
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         * @param {boolean} soloDisplay - Whether the label is displayed solo.
         */
        constructor(controller, portUI, displaySpeed, soloDisplay) {
            super(controller, portUI, displaySpeed, soloDisplay, false);
        }
        /**
         * Updates the line position.
         * @public
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        updateLinePosition(vpt) {
            const labelBBox = this._element.getBoundingClientRect();
            const portBBox = this._portUI.getBoundingBox(vpt);
            const isStartPort = this._portUI.isStartPort();
            const isGraphPort = this._portUI.getParent() instanceof UIGraph;
            const lineX1 = labelBBox.left + labelBBox.width / 2;
            const lineY1 = labelBBox.top + labelBBox.height / 2;
            const leftBorder = portBBox.left;
            const rightBorder = portBBox.left + portBBox.width;
            const lineX2 = isGraphPort ? (isStartPort ? rightBorder : leftBorder) : (isStartPort ? leftBorder : rightBorder);
            const lineY2 = portBBox.top + portBBox.height / 2;
            this._setLinePosition(lineX1, lineY1, lineX2, lineY2);
        }
        /**
         * Creates the control port label element.
         * @protected
         * @override
         */
        _createElement() {
            super._createElement();
            UIDom.addClassName(this._element, 'sch-label-controlport');
        }
        /**
         * Builds the label title element.
         * @protected
         * @override
         * @returns {HTMLDivElement} The label title element
         */
        _buildTitleElement() {
            const titleElt = super._buildTitleElement();
            if (this._portUI.getModel() instanceof EventPort) {
                UIDom.createElement('span', {
                    className: 'sch-label-port-bracket',
                    textContent: ' (',
                    parent: titleElt
                });
                UIDom.createElement('span', {
                    className: 'sch-label-controlport-eventtype',
                    textContent: this._portUI.getModel().getEventType(),
                    parent: titleElt
                });
                UIDom.createElement('span', {
                    className: 'sch-label-port-bracket',
                    textContent: ')',
                    parent: titleElt
                });
            }
            return titleElt;
        }
        /**
         * Updates the label position.
         * @protected
         * @abstract
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        _updateLabelPosition(vpt) {
            const parentBBox = this._portUI.getParentGraph().getViewer().getClientRect();
            const portBBox = this._portUI.getBoundingBox(vpt);
            const labelBBox = this._element.getBoundingClientRect();
            const isStartPort = this._portUI.isStartPort();
            const isGraphPort = this._portUI.getParent() instanceof UIGraph;
            //const gap = vpt.scale < 1 ? UIPortLabel.kLabelToPortGap * vpt.scale : UIPortLabel.kLabelToPortGap;
            const gap = UIPortLabel.kLabelToPortGap;
            // Compute the label left position
            const leftStartPort = portBBox.left - parentBBox.left - labelBBox.width - gap;
            const rightStartPort = portBBox.left - parentBBox.left + portBBox.width + gap;
            let labelLeft = isGraphPort ? (isStartPort ? rightStartPort : leftStartPort) : (isStartPort ? leftStartPort : rightStartPort);
            const leftLimit = 0;
            const rightLimit = parentBBox.width - labelBBox.width;
            labelLeft = labelLeft < leftLimit ? leftLimit : labelLeft;
            labelLeft = labelLeft > rightLimit ? rightLimit : labelLeft;
            /*
            // TODO: POC to avoid label border collision!
            const labelLeftGap = labelBBox.width + UIPortLabel.kLabelToPortGap;
            const x, y;
            if (portBBox.left - parentBBox.left > 0) {
                if (portBBox.left - parentBBox.left - labelLeftGap > 0) {
                    x = -labelLeftGap;
                } else {
                    x = -portBBox.left - parentBBox.left;
                }
            } else {
                if (portBBox.left - parentBBox.left + labelLeftGap < 0) {
                    x = labelLeftGap;
                } else {
                    x = -portBBox.left - parentBBox.left;
                }
            }
            console.log(x);
    
            y = Math.sqrt(Math.pow(labelLeftGap, 2) - Math.pow(x, 2));
            console.log(y);
    
            labelLeft = portBBox.left + x;
            const labelTop = portBBox.top - parentBBox.top + (portBBox.height / 2) - (labelBBox.height / 2) - y;
            */
            // Compute the label top position
            let labelTop = portBBox.top - parentBBox.top + (portBBox.height / 2) - (labelBBox.height / 2);
            const topLimit = 0;
            const bottomLimit = parentBBox.height - labelBBox.height;
            labelTop = labelTop < topLimit ? topLimit : labelTop;
            labelTop = labelTop > bottomLimit ? bottomLimit : labelTop;
            // Set the label position
            this.setPosition(labelLeft, labelTop);
        }
    }
    return UIControlPortLabel;
});
