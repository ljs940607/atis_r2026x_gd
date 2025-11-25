/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIPersistentLabelView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIPersistentLabelView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIResizableRectNodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/components/EPSSchematicsUIValueEvaluator", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIPersistentLabel"], function (require, exports, UIResizableRectNodeView, UIDom, UIFontIcon, UIValueEvaluator, UIWUXTools, UITools, Events, UINLS) {
    "use strict";
    /**
     * This class defines a UI persistent label view.
     * @private
     * @class UIPersistentLabelView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIPersistentLabelView
     * @extends UIResizableRectNodeView
     */
    class UIPersistentLabelView extends UIResizableRectNodeView {
        /**
         * @public
         * @constructor
         * @param {UIPersistentLabel} label - The persistent label.
         */
        constructor(label) {
            super();
            this._onDataPortNameChangeCB = this._onDataPortNameChange.bind(this);
            this._onDataPortValueTypeChangeCB = this._onDataPortValueTypeChange.bind(this);
            this._onDataPortDefaultValueChangeCB = this._onDataPortDefaultValueChange.bind(this);
            this._label = label;
            this._portUI = this._label.getUIPort();
            this._dataPort = this._portUI.getModel(); // TODO: rename into _portModel!!!
            this._isSubdataPort = this._dataPort.dataPort !== undefined;
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
         * Checks if the provided element is the unpin icon element.
         * @public
         * @param {Element} element - The element to check.
         * @returns {boolean} True if the provided element is the unpin icon element else false.
         */
        isUnpinIconElement(element) {
            return element === this._unpinIconElt;
        }
        /**
         * Checks if the provided element is the evaluator element.
         * @public
         * @param {Element} element - The element to check.
         * @returns {boolean} True if the provided element is the evaluator element else false.
         */
        isEvaluator(element) {
            return this._evaluator?.getElement()?.contains(element) || false;
        }
        /**
         * Gets the persistent label evaluator.
         * @public
         * @returns {UIValueEvaluator|undefined} The persistent label evaluator.
         */
        getEvaluator() {
            return this._evaluator;
        }
        /**
         * Refreshes the display of the label (play value or default value).
         * @public
         */
        refreshLabelDisplay() {
            this._removeEvaluator();
            UIDom.removeClassName(this._element, ['sch-node-label-trace', 'sch-node-label-trace-debug']);
            const playValueState = UITools.getDataPortPlayValue(this._portUI);
            if (playValueState.hasPlayValue) {
                const fromDebug = playValueState.fromDebug;
                UIDom.addClassName(this._element, fromDebug ? 'sch-node-label-trace-debug' : 'sch-node-label-trace');
                this._createEvaluator(playValueState.value);
            }
            else {
                const defaultValueState = UITools.getDataPortDefaultValue(this._portUI);
                if (defaultValueState.hasDefaultValue) {
                    this._createEvaluator(defaultValueState.value);
                }
            }
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
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._dataPort.removeListener(Events.DataPortNameChangeEvent, this._onDataPortNameChangeCB);
            this._dataPort.removeListener(Events.DataPortValueTypeChangeEvent, this._onDataPortValueTypeChangeCB);
            // Handle sub data ports
            const refDataPort = this._dataPort.dataPort ? this._dataPort.dataPort : this._dataPort;
            refDataPort.removeListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            this._label = undefined;
            this._portUI = undefined;
            this._dataPort = undefined;
            this._titleElt = undefined;
            this._portNameElt = undefined;
            this._bracketLeftElt = undefined;
            this._portValueTypeElt = undefined;
            this._bracketRightElt = undefined;
            this._contentElt = undefined;
            this._evaluator = undefined;
            this._unpinIconElt = undefined;
            this._onDataPortNameChangeCB = undefined;
            this._onDataPortValueTypeChangeCB = undefined;
            this._onDataPortDefaultValueChangeCB = undefined;
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Builds the node HTML element.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Node} node - The graph node.
         * @returns {IHTMLElement} The node HTML element.
         */
        buildNodeElement(node) {
            super.buildNodeElement(node);
            UIDom.addClassName(this._element, 'sch-node-label-container');
            const portName = this._dataPort.getName();
            const portType = this._dataPort.getValueType();
            this._portNameElt = UIDom.createElement('span', { className: ['sch-node-label-port-name', 'sch-node-draggable'], textContent: portName });
            this._bracketLeftElt = UIDom.createElement('span', { className: ['sch-node-label-port-bracket', 'sch-node-draggable'], textContent: ' (' });
            this._portValueTypeElt = UIDom.createElement('span', { className: ['sch-node-label-dataport-valuetype', 'sch-node-draggable'], textContent: portType });
            this._bracketRightElt = UIDom.createElement('span', { className: ['sch-node-label-port-bracket', 'sch-node-draggable'], textContent: ')' });
            this._titleElt = UIDom.createElement('div', {
                className: ['sch-node-label-title', 'sch-node-draggable'],
                children: [this._portNameElt, this._bracketLeftElt, this._portValueTypeElt, this._bracketRightElt]
            });
            this._element.appendChild(this._titleElt);
            this._unpinIconElt = UIFontIcon.create3DSFontIcon('pin-off', {
                className: 'sch-node-label-unpin',
                parent: this._element,
                tooltipInfos: UIWUXTools.createTooltip({ title: UINLS.get('unpinPortLabelTitle'), shortHelp: UINLS.get('unpinPortLabelShortHelp'), initialDelay: 800 }),
                onclick: () => {
                    const historyController = this._portUI.getEditor().getHistoryController();
                    const persistentLabel = this._label;
                    this._portUI.removePersistentLabel();
                    historyController.registerRemoveAction([persistentLabel]);
                }
            });
            this.display.unpinIcon = this._unpinIconElt;
            this.display.unpinIcon.grElt = this._label.getDisplay();
            this.display.unpinIcon.subElt = this._unpinIconElt;
            this._contentElt = UIDom.createElement('div', { parent: this._element, className: 'sch-node-label-content' });
            this.refreshLabelDisplay();
            this._dataPort.addListener(Events.DataPortNameChangeEvent, this._onDataPortNameChangeCB);
            this._dataPort.addListener(Events.DataPortValueTypeChangeEvent, this._onDataPortValueTypeChangeCB);
            // Handle sub data ports
            const refDataPort = this._dataPort.dataPort ? this._dataPort.dataPort : this._dataPort;
            refDataPort.addListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            return this._element;
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
         * The callback on the data port name change event.
         * @private
         * @param {DataPortNameChangeEvent} event - The data port name change event.
         */
        _onDataPortNameChange(event) {
            const portName = event.getName();
            if (this._portNameElt) {
                this._portNameElt.textContent = portName;
                this._updateLabelWidthFromTitleWidth();
            }
        }
        /**
         * The callback on the data port value type change event.
         * @private
         * @param {DataPortValueTypeChangeEvent} event - The data port value type change event.
         */
        _onDataPortValueTypeChange(event) {
            if (this._portValueTypeElt) {
                const valueType = event.getValueType();
                const defaultValue = event.getDefaultValue();
                this._portValueTypeElt.textContent = valueType;
                this._updateContentClassNameFromValueChange(defaultValue);
                this._updateLabelWidthFromTitleWidth();
            }
        }
        /**
         * The callback on the data port default value change event.
         * @private
         * @param {DataPortDefaultValueChangeEvent} event - The data port default value change event.
         */
        _onDataPortDefaultValueChange(event) {
            const defaultValue = event.getDefaultValue();
            const displayValue = this._isSubdataPort ? defaultValue[this._dataPort.getName()] : defaultValue;
            this._createEvaluator(displayValue);
        }
        /**
         * Removes the evaluator.
         * @private
         */
        _removeEvaluator() {
            if (this._evaluator && this._contentElt?.contains(this._evaluator.getElement())) {
                this._contentElt.removeChild(this._evaluator.getElement());
                this._evaluator = undefined;
            }
        }
        /**
         * Creates the evaluator.
         * @private
         * @param {*} value - The value to evaluate.
         */
        _createEvaluator(value) {
            this._removeEvaluator();
            this._evaluator = new UIValueEvaluator(value);
            this._contentElt.appendChild(this._evaluator.getElement());
            this._updateContentClassNameFromValueChange(value);
        }
        /**
         * Updates the content element className when the data port value change.
         * @private
         * @param {*} defaultValue - The data port default value.
         */
        _updateContentClassNameFromValueChange(defaultValue) {
            UIDom.clearClassName(this._contentElt);
            const contentClasses = UITools.getLabelClassNamesFromDataPortValue('sch-node-label-content', defaultValue);
            UIDom.addClassName(this._contentElt, contentClasses);
        }
        /**
         * Updates the width of the label from the title width.
         * As title width is cropped for overflow management,
         * we have to compute its width from its children elements.
         * @private
         */
        _updateLabelWidthFromTitleWidth() {
            const vpt = this._label.getGraph().getViewer().getViewpoint();
            const portNameWidth = this._portNameElt.getBoundingClientRect().width;
            const bracketLeftWidth = this._bracketLeftElt.getBoundingClientRect().width;
            const portValueTypeWidth = this._portValueTypeElt.getBoundingClientRect().width;
            const bracketRightWidth = this._bracketRightElt.getBoundingClientRect().width;
            const kPaddings = 30;
            const titleWidth = portNameWidth + bracketLeftWidth + portValueTypeWidth + bracketRightWidth + kPaddings;
            const screenSpaceWidth = titleWidth / vpt.scale;
            this._label.setWidth(screenSpaceWidth);
        }
    }
    return UIPersistentLabelView;
});
