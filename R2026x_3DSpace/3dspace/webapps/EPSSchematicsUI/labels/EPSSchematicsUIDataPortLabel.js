/// <amd-module name='DS/EPSSchematicsUI/labels/EPSSchematicsUIDataPortLabel'/>
define("DS/EPSSchematicsUI/labels/EPSSchematicsUIDataPortLabel", ["require", "exports", "DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel", "DS/EPSSchematicsUI/components/EPSSchematicsUIValueEvaluator", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools"], function (require, exports, UIPortLabel, UIValueEvaluator, UIDom, UIShortcutDataPort, UIGraph, UITools) {
    "use strict";
    /**
     * This class defines a UI data port label.
     * @private
     * @class UIDataPortLabel
     * @alias module:DS/EPSSchematicsUI/labels/EPSSchematicsUIDataPortLabel
     * @extends UIPortLabel
     */
    class UIDataPortLabel extends UIPortLabel {
        /**
         * @public
         * @constructor
         * @param {UILabelController} controller - The UI label controller.
         * @param {UIDataPort} portUI - The UI data port.
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         * @param {boolean} soloDisplay - Whether the label is displayed solo.
         */
        constructor(controller, portUI, displaySpeed, soloDisplay, displayDocumentation) {
            super(controller, portUI, displaySpeed, soloDisplay, displayDocumentation);
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
         * Removes the port label.
         * @public
         * @override
         */
        remove() {
            this._evaluator = undefined;
            super.remove();
        }
        /**
         * This method updates the line position.
         * @private
         * @param {IViewpoint} vpt - The current graph viewpoint.
         * @param {boolean} [keepStraightLines=false] True to keep straight lines else false.
         */
        updateLinePosition(vpt, keepStraightLines = false) {
            const labelBBox = this._element.getBoundingClientRect();
            const portBBox = this._portUI.getBoundingBox(vpt);
            const lineY1 = labelBBox.top + labelBBox.height / 2;
            const isStartPort = this._portUI.isStartPort();
            const isGraphPort = this._portUI.getParent() instanceof UIGraph;
            const isShortcut = this._portUI instanceof UIShortcutDataPort;
            const inverse = isGraphPort;
            const lineX2 = portBBox.left + portBBox.width / 2;
            const lineX1 = keepStraightLines ? lineX2 : labelBBox.left + labelBBox.width / 2;
            const bottomBorder = portBBox.top + portBBox.height;
            const middleHeight = portBBox.top + portBBox.height / 2;
            let lineY2 = inverse ? (isStartPort ? bottomBorder : middleHeight) : (isStartPort ? middleHeight : bottomBorder);
            lineY2 = isShortcut ? (isStartPort ? bottomBorder : middleHeight) : lineY2;
            this._setLinePosition(lineX1, lineY1, lineX2, lineY2);
        }
        /**
         * Gets the evaluator.
         * @public
         * @returns {UIValueEvaluator|undefined} The evaluator.
         */
        getEvaluator() {
            return this._evaluator;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Creates the data port label element.
         * @protected
         * @override
         */
        _createElement() {
            super._createElement();
            UIDom.addClassName(this._element, 'sch-label-dataport');
            this._buildContentElement();
        }
        /**
         * Builds the label title element.
         * @protected
         * @override
         * @returns {HTMLDivElement} The label title element
         */
        _buildTitleElement() {
            const titleElt = super._buildTitleElement();
            UIDom.createElement('span', {
                className: 'sch-label-port-bracket',
                textContent: ' (',
                parent: titleElt
            });
            UIDom.createElement('span', {
                className: 'sch-label-dataport-valuetype',
                textContent: this._portUI.getModel().getValueType(),
                parent: titleElt
            });
            UIDom.createElement('span', {
                className: 'sch-label-port-bracket',
                textContent: ')',
                parent: titleElt
            });
            return titleElt;
        }
        /**
         * Gets the data port default value.
         * @protected
         * @returns {IDataPortDefaultValue} The data port default value result.
         */
        _getDataPortDefaultValue() {
            return UITools.getDataPortDefaultValue(this._portUI);
        }
        /**
         * Updates the label position.
         * @protected
         * @abstract
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        _updateLabelPosition(vpt) {
            const isOnTopOfPort = this._portUI.isDataPortLabelOnTop();
            const labelLeft = this._computeLabelLeftPosition(vpt);
            const labelTop = this._computeLabelTopPosition(vpt, isOnTopOfPort);
            this.setPosition(labelLeft, labelTop);
        }
        /**
         * Computes the label left position.
         * @protected
         * @param {IViewpoint} vpt - The current graph viewpoint.
         * @returns {number} The label left position.
         */
        _computeLabelLeftPosition(vpt) {
            const parentBBox = this._portUI.getParentGraph().getViewer().getClientRect();
            const portBBox = this._portUI.getBoundingBox(vpt);
            const labelBBox = this._element.getBoundingClientRect();
            let labelLeft = portBBox.left - parentBBox.left + (portBBox.width / 2) - (labelBBox.width / 2);
            const leftLimit = 0;
            const rightLimit = parentBBox.width - labelBBox.width;
            labelLeft = labelLeft < leftLimit ? leftLimit : labelLeft;
            labelLeft = labelLeft > rightLimit ? rightLimit : labelLeft;
            return labelLeft;
        }
        /**
         * Computes the label top position.
         * @protected
         * @param {IViewpoint} vpt - The current graph viewpoint.
         * @param {boolean} isOnTopOfPort - True if the label is positionned on top of the port else false.
         * @returns {number} The label top position.
         */
        _computeLabelTopPosition(vpt, isOnTopOfPort) {
            const parentBBox = this._portUI.getParentGraph().getViewer().getClientRect();
            const portBBox = this._portUI.getBoundingBox(vpt);
            const labelBBox = this._element.getBoundingClientRect();
            const gap = UIPortLabel.kLabelToPortGap;
            const fromPortTopPosition = portBBox.top - parentBBox.top - labelBBox.height - gap;
            const fromPortBottomPosition = portBBox.top - parentBBox.top + portBBox.height + gap;
            let labelTop = isOnTopOfPort ? fromPortTopPosition : fromPortBottomPosition;
            const topLimit = 0;
            const bottomLimit = parentBBox.height - labelBBox.height;
            labelTop = labelTop < topLimit ? fromPortBottomPosition : labelTop;
            labelTop = labelTop > bottomLimit ? fromPortTopPosition : labelTop;
            return labelTop;
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
         * Builds the label content element.
         * @private
         */
        _buildContentElement() {
            let hasContent = false;
            let dataPortValue;
            const playValue = UITools.getDataPortPlayValue(this._portUI);
            if (playValue.hasPlayValue && !this._isThumbnailViewer) {
                hasContent = true;
                dataPortValue = playValue.value;
                UIDom.addClassName(this._element, playValue.fromDebug ? 'sch-label-trace-debug' : 'sch-label-trace');
            }
            else {
                const defaultvalue = this._getDataPortDefaultValue();
                if (defaultvalue.hasDefaultValue) {
                    hasContent = true;
                    dataPortValue = defaultvalue.value;
                }
            }
            if (hasContent) {
                const valueTypeClasses = UITools.getLabelClassNamesFromDataPortValue('sch-label-content', dataPortValue);
                this._evaluator = new UIValueEvaluator(dataPortValue);
                UIDom.createElement('div', {
                    className: valueTypeClasses,
                    children: [this._evaluator.getElement()],
                    parent: this._element
                });
            }
            if (this._displayDocumentation) {
                //this._isFadeDisabled = true;
                const description = this._portUI.getModel().getDocumentationDescription();
                if (description !== undefined && description !== '') {
                    UIDom.createElement('div', {
                        className: 'sch-label-doc-container',
                        children: [UIDom.createElement('div', {
                                className: 'sch-label-doc',
                                innerHTML: description
                            })],
                        parent: this._element
                    });
                }
            }
        }
    }
    return UIDataPortLabel;
});
