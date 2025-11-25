/// <amd-module name='DS/EPSSchematicsUI/labels/EPSSchematicsUIBlockLabel'/>
define("DS/EPSSchematicsUI/labels/EPSSchematicsUIBlockLabel", ["require", "exports", "DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel", "DS/EPSSchematicsUI/labels/EPSSchematicsUIControlPortLabel", "DS/EPSSchematicsUI/labels/EPSSchematicsUIDataPortLabel", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIPortLabel, UIControlPortLabel, UIDataPortLabel, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI block label.
     * @private
     * @class UILinkLabel
     * @alias module:DS/EPSSchematicsUI/labels/EPSSchematicsUIBlockLabel
     */
    class UIBlockLabel {
        static { this._kLabelToLabelGap = 1; }
        /**
         * @public
         * @constructor
         * @param {UILabelController} controller - The UI label controller.
         * @param {UIBlock} blockUI - The UI block.
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         */
        constructor(controller, blockUI, displaySpeed) {
            this._icpLabels = [];
            this._ocpLabels = [];
            this._idpLabels = [];
            this._odpLabels = [];
            this._controller = controller;
            this._blockUI = blockUI;
            this._displaySpeed = displaySpeed;
            this._createElement();
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
         * Removes the block label.
         * @public
         */
        remove() {
            const removeLabel = (label) => label.remove();
            this._icpLabels.forEach(removeLabel);
            this._ocpLabels.forEach(removeLabel);
            this._idpLabels.forEach(removeLabel);
            this._odpLabels.forEach(removeLabel);
            this._controller = undefined;
            this._blockUI = undefined;
            this._displaySpeed = undefined;
            this._icpLabels = undefined;
            this._ocpLabels = undefined;
            this._idpLabels = undefined;
            this._odpLabels = undefined;
        }
        /**
         * Gets the UI block.
         * @public
         * @returns {UIBlock} blockUI - The UI block.
         */
        getUIBlock() {
            return this._blockUI;
        }
        /**
         * Updates the block labels positions.
         * @public
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        updatePosition(vpt) {
            this._updateControlPortLabelsPosition(vpt, true);
            this._updateControlPortLabelsPosition(vpt, false);
            this._updateDataPortLabelsPosition(vpt, true);
            this._updateDataPortLabelsPosition(vpt, false);
        }
        /**
         * Gets the block label bounding box including the block bounding box.
         * @public
         * @returns {IDOMRect} The block label bounding box.
         */
        getBoundingBox() {
            const blockBB = this._blockUI.getElement().getBoundingClientRect();
            const labelsBB = {
                left: blockBB.left, right: blockBB.right,
                top: blockBB.top, bottom: blockBB.bottom,
                width: blockBB.width, height: blockBB.height
            };
            const labels = [].concat(this._icpLabels, this._ocpLabels, this._idpLabels, this._odpLabels);
            labels.forEach(label => {
                const lBB = label.getElement().getBoundingClientRect();
                labelsBB.left = lBB.left < labelsBB.left ? lBB.left : labelsBB.left;
                labelsBB.right = lBB.right > labelsBB.right ? lBB.right : labelsBB.right;
                labelsBB.top = lBB.top < labelsBB.top ? lBB.top : labelsBB.top;
                labelsBB.bottom = lBB.bottom > labelsBB.bottom ? lBB.bottom : labelsBB.bottom;
            });
            labelsBB.width = labelsBB.right - labelsBB.left;
            labelsBB.height = labelsBB.bottom - labelsBB.top;
            return labelsBB;
        }
        /**
         * Gets the label display speed.
         * @public
         * @returns {UIEnums.ELabelDisplaySpeed} The label display speed.
         */
        getDisplaySpeed() {
            return this._displaySpeed;
        }
        /**
         * Gets the input control port labels.
         * @public
         * @returns {Array<UIControlPortLabel>} The input control port labels.
         */
        getInputControlPortLabels() {
            return this._icpLabels;
        }
        /**
         * Gets the output control port labels.
         * @public
         * @returns {Array<UIControlPortLabel>} The output control port labels.
         */
        getOutputControlPortLabels() {
            return this._ocpLabels;
        }
        /**
         * Gets the input data port labels.
         * @public
         * @returns {Array<UIDataPortLabel>} The input data port labels.
         */
        getInputDataPortLabels() {
            return this._idpLabels;
        }
        /**
         * Gets the output data port labels.
         * @public
         * @returns {Array<UIDataPortLabel>} The output data port labels.
         */
        getOutputDataPortLabels() {
            return this._odpLabels;
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
         * Creates the block label element.
         * @private
         */
        _createElement() {
            // Create control port labels
            const controlPorts = this._blockUI.getUIControlPorts();
            controlPorts.forEach(controlPort => {
                const cpLabel = new UIControlPortLabel(this._controller, controlPort, this._displaySpeed, false);
                cpLabel.disableFadeWithDistance();
                const array = controlPort.isStartPort() ? this._icpLabels : this._ocpLabels;
                array.push(cpLabel);
            });
            // Create input data port labels
            const inputDataPorts = this._blockUI.getUIDataPortsMultiTypes([ModelEnums.EDataPortType.eInput, ModelEnums.EDataPortType.eInputExternal], true);
            inputDataPorts.forEach(dataPort => {
                const dpLabel = new UIDataPortLabel(this._controller, dataPort, this._displaySpeed, false, false);
                dpLabel.disableFadeWithDistance();
                this._idpLabels.push(dpLabel);
            });
            // Create output data port labels
            const outputDataPorts = this._blockUI.getUIDataPorts(ModelEnums.EDataPortType.eOutput, true);
            outputDataPorts.forEach(dataPort => {
                const dpLabel = new UIDataPortLabel(this._controller, dataPort, this._displaySpeed, false, false);
                dpLabel.disableFadeWithDistance();
                this._odpLabels.push(dpLabel);
            });
        }
        /**
         * Updates the control port labels position.
         * @private
         * @param {IViewpoint} vpt - The current graph viewpoint.
         * @param {boolean} isStartPort - True for start port, false for end port.
         */
        _updateControlPortLabelsPosition(vpt, isStartPort) {
            const controlPortLabels = isStartPort ? this._icpLabels : this._ocpLabels;
            const parentBBox = this._blockUI.getGraph().getViewer().getClientRect();
            const length = controlPortLabels.length;
            const isEven = length % 2 === 0;
            const centerIndex = Math.floor(length / 2);
            const gap = vpt.scale < 1 ? UIPortLabel.kLabelToPortGap * vpt.scale : UIPortLabel.kLabelToPortGap;
            controlPortLabels.forEach((label, index) => {
                const portBBox = label.getUIPort().getBoundingBox(vpt);
                const labelBBox = label.getElement().getBoundingClientRect();
                const portLeft = portBBox.left - parentBBox.left;
                const portMiddleTop = portBBox.top - parentBBox.top + portBBox.height / 2;
                const labelMiddleHeight = labelBBox.height / 2;
                let labelTop = 0;
                if (index < centerIndex) {
                    labelTop = portBBox.top - parentBBox.top - labelBBox.height;
                }
                else if (!isEven && index === centerIndex) {
                    labelTop = portMiddleTop - labelMiddleHeight;
                }
                else {
                    labelTop = portBBox.top - parentBBox.top + portBBox.height;
                }
                const labelLeft = isStartPort ? portLeft - gap - labelBBox.width : portLeft + portBBox.width + gap;
                label.setPosition(labelLeft, labelTop);
                label.updateLinePosition(vpt);
            });
        }
        /**
         * Updates the data port labels position.
         * @private
         * @param {IViewpoint} vpt - The current graph viewpoint.
         * @param {boolean} isStartPort - True for start port, false for end port.
         */
        _updateDataPortLabelsPosition(vpt, isStartPort) {
            const dataPortLabels = isStartPort ? this._idpLabels.slice() : this._odpLabels.slice();
            const parentBBox = this._blockUI.getGraph().getViewer().getClientRect();
            const gap = vpt.scale < 1 ? UIPortLabel.kLabelToPortGap * vpt.scale : UIPortLabel.kLabelToPortGap;
            let accumulator;
            while (dataPortLabels.length > 0) {
                const firstLabel = dataPortLabels.shift();
                const lastLabel = dataPortLabels.pop() || firstLabel;
                const isCenter = firstLabel === lastLabel;
                const firstLabelBBox = firstLabel.getElement().getBoundingClientRect();
                const firstPortBBox = firstLabel.getUIPort().getBoundingBox(vpt);
                const firstPortLeft = firstPortBBox.left - parentBBox.left;
                const firstPortTop = firstPortBBox.top - parentBBox.top;
                let firstLabelLeft, firstLabelTop;
                if (accumulator === undefined) {
                    accumulator = isStartPort ? firstPortTop - gap : firstPortTop + firstPortBBox.height + gap;
                }
                if (isCenter) {
                    firstLabelLeft = firstPortLeft + firstPortBBox.width / 2 - firstLabelBBox.width / 2;
                    firstLabelTop = isStartPort ? accumulator - firstLabelBBox.height : accumulator;
                }
                else {
                    const lastLabelBBox = lastLabel.getElement().getBoundingClientRect();
                    const lastPortBBox = lastLabel.getUIPort().getBoundingBox(vpt);
                    const lastPortLeft = lastPortBBox.left - parentBBox.left;
                    const maxLabelHeight = firstLabelBBox.height > lastLabelBBox.height ? firstLabelBBox.height : lastLabelBBox.height;
                    const labelTop = isStartPort ? accumulator - maxLabelHeight : accumulator;
                    const lastLabelTop = labelTop;
                    const lastLabelLeft = lastPortLeft;
                    lastLabel.setPosition(lastLabelLeft, lastLabelTop);
                    lastLabel.updateLinePosition(vpt, true);
                    firstLabelLeft = firstPortLeft + firstPortBBox.width - firstLabelBBox.width;
                    firstLabelTop = labelTop;
                    accumulator = isStartPort ? labelTop - UIBlockLabel._kLabelToLabelGap : labelTop + maxLabelHeight + UIBlockLabel._kLabelToLabelGap;
                }
                firstLabel.setPosition(firstLabelLeft, firstLabelTop);
                firstLabel.updateLinePosition(vpt, true);
            }
        }
    }
    return UIBlockLabel;
});
