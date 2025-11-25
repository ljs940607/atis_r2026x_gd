/// <amd-module name='DS/EPSSchematicsUI/labels/EPSSchematicsUIGraphTestDataPortLabel'/>
define("DS/EPSSchematicsUI/labels/EPSSchematicsUIGraphTestDataPortLabel", ["require", "exports", "DS/EPSSchematicsUI/labels/EPSSchematicsUIDataPortLabel"], function (require, exports, UIDataPortLabel) {
    "use strict";
    /**
     * This class defines a UI data port test label.
     * @private
     * @class UIGraphTestDataPortLabel
     * @alias module:DS/EPSSchematicsUI/labels/EPSSchematicsUIGraphTestDataPortLabel
     * @extends UIDataPortLabel
     */
    class UIGraphTestDataPortLabel extends UIDataPortLabel {
        /**
         * @public
         * @constructor
         * @param {UILabelController} controller - The UI label controller.
         * @param {UIGraphTestDataPort} portUI - The UI data port.
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         * @param {boolean} soloDisplay - Whether the label is displayed solo.
         */
        constructor(controller, portUI, displaySpeed, soloDisplay) {
            super(controller, portUI, displaySpeed, soloDisplay, false);
        }
        /**
         * Updates the label line position.
         * @public
         * @override
         * @param {IViewpoint} vpt - The current graph viewpoint.
         * @param {boolean} [keepStraightLines=false] True to keep straight lines else false.
         */
        updateLinePosition(vpt, keepStraightLines = false) {
            const portBBox = this._portUI.getBoundingBox(vpt);
            const labelBBox = this._element.getBoundingClientRect();
            const isStartPort = this._portUI.isStartPort();
            const bottomBorder = portBBox.top + portBBox.height;
            const middleHeight = portBBox.top + portBBox.height / 2;
            const lineX1 = portBBox.left + portBBox.width / 2;
            const lineY1 = isStartPort ? middleHeight : bottomBorder;
            const lineX2 = keepStraightLines === true ? lineX1 : labelBBox.left + labelBBox.width / 2;
            const lineY2 = isStartPort ? labelBBox.top + labelBBox.height : labelBBox.top;
            this._setLinePosition(lineX1, lineY1, lineX2, lineY2);
        }
        // TODO: Rename API because it is test value and not default value!
        /**
         * Gets the data port test value.
         * @protected
         * @override
         * @returns {IDataPortDefaultValue} The data port play value result.
         */
        _getDataPortDefaultValue() {
            return {
                hasDefaultValue: true,
                value: this._portUI.getModel().getTestValues()[0]
            };
        }
        /**
         * Updates the label position.
         * @protected
         * @override
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        _updateLabelPosition(vpt) {
            const isOnTopOfPort = this._portUI.isStartPort();
            const left = this._computeLabelLeftPosition(vpt);
            const top = this._computeLabelTopPosition(vpt, isOnTopOfPort);
            this.setPosition(left, top);
        }
    }
    return UIGraphTestDataPortLabel;
});
