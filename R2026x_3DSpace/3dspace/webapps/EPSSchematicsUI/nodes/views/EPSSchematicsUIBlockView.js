/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIBlockView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIBlockView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicEngine/EPSSchematicsExecutionEnums", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIBlock"], function (require, exports, UINodeView, UIDom, UIWUXTools, UIFontIcon, UINLS, ModelEnums, Events, ExecutionEnums) {
    "use strict";
    /**
     * This class defines a UI block view.
     * @private
     * @class UIBlockView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIBlockView
     * @extends UINodeView
     */
    class UIBlockView extends UINodeView {
        /**
         * @public
         * @constructor
         * @param {UIBlock} block - The UI block.
         */
        constructor(block) {
            super();
            this._onValidityChangeCB = this._onValidityChange.bind(this);
            this._onAddButtonClickCB = this._onAddButtonClick.bind(this);
            this._onMouseenterEventCB = this._onMouseenterEvent.bind(this);
            this._onMouseLeaveEventCB = this._onMouseLeaveEvent.bind(this);
            this._block = block;
        }
        /**
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            if (this._block.getModel() !== undefined) {
                this._block.getModel().removeListener(Events.BlockValidityChangeEvent, this._onValidityChangeCB);
            }
            if (this._blockContainer !== undefined) {
                this._blockContainer.removeEventListener('mouseenter', this._onMouseenterEventCB, false);
                this._blockContainer.removeEventListener('mouseleave', this._onMouseLeaveEventCB, false);
            }
            if (this._triggerZoneLeftButton !== undefined) {
                this._triggerZoneLeftButton.removeEventListener('click', this._onAddButtonClickCB, false);
            }
            if (this._triggerZoneTopButton !== undefined) {
                this._triggerZoneTopButton.removeEventListener('click', this._onAddButtonClickCB, false);
            }
            if (this._triggerZoneRightButton !== undefined) {
                this._triggerZoneRightButton.removeEventListener('click', this._onAddButtonClickCB, false);
            }
            if (this._triggerZoneBottomButton !== undefined) {
                this._triggerZoneBottomButton.removeEventListener('click', this._onAddButtonClickCB, false);
            }
            this._block = undefined;
            this._blockContainer = undefined;
            this._blockContainerLeft = undefined;
            this._blockContainerMiddle = undefined;
            this._blockContainerRight = undefined;
            this._blockContainerMiddleBottom = undefined;
            this._blockNameElt = undefined;
            this._breakpointIcon = undefined;
            this._configurationIcon = undefined;
            this._infoIcon = undefined;
            this._categoryIcon = undefined;
            this._blockStateContainer = undefined;
            this._blockStatePendingElt = undefined;
            this._blockStateConnectingElt = undefined;
            this._blockStateExecutingElt = undefined;
            this._blockStateTerminatedElt = undefined;
            this._triggerZoneContainer = undefined;
            this._triggerZoneMiddle = undefined;
            this._triggerZoneTop = undefined;
            this._triggerZoneBottom = undefined;
            this._triggerZoneLeft = undefined;
            this._triggerZoneRight = undefined;
            this._triggerZoneTopButton = undefined;
            this._triggerZoneBottomButton = undefined;
            this._triggerZoneLeftButton = undefined;
            this._triggerZoneRightButton = undefined;
            this._onValidityChangeCB = undefined;
            this._onAddButtonClickCB = undefined;
            this._onMouseenterEventCB = undefined;
            this._onMouseLeaveEventCB = undefined;
            super.ondestroyDisplay(elt, grView);
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
         * Checks if the given element is part of the block container.
         * @public
         * @param {HTMLDivElement} element - The block element.
         * @returns {boolean} True if the element is part of the block container else false.
         */
        isBlockContainer(element) {
            return element !== undefined && element === this._blockContainer;
        }
        /**
         * Checks if the given element is part of the block configuration icon.
         * @public
         * @param {HTMLDivElement} element - The block element.
         * @returns {boolean} True if the element is part of the block configuration icon else false.
         */
        isConfigurationIcon(element) {
            return element !== undefined && element === this._configurationIcon;
        }
        /**
         * This method checks whether the given element is part of the block info icon.
         * @public
         * @param {HTMLDivElement} element - The block info icon html element.
         * @returns {boolean} True if the element is part of the block info icon else false.
         */
        isInfoIcon(element) {
            return element !== undefined && element === this._infoIcon && (this._infoIcon.firstChild !== undefined && this._infoIcon.firstChild !== null);
        }
        /**
         * This method checks whether the given element is part of the block category icon.
         * @public
         * @param {HTMLDivElement} element - The block category icon html element.
         * @returns {boolean} True if the element is part of the block category icon else false.
         */
        isCategoryIcon(element) {
            return element !== undefined && element === this._categoryIcon;
        }
        /**
         * Checks if the given element is the breakpoint icon.
         * @public
         * @param {HTMLDivElement} element - The element to check.
         * @returns {boolean} True if the element is the breakpoint icon else false.
         */
        isBreakpointIcon(element) {
            return element !== undefined && element === this._breakpointIcon;
        }
        /**
         * Shows the info icon.
         * @public
         * @param {boolean} isError - True to display an error icon, false to display a warning icon.
         * @param {string} message - The information message to display in the tooltip.
         */
        showInfoIcon(isError, message) {
            this.hideInfoIcon();
            if (this._infoIcon !== undefined) {
                const severity = isError ? 'sch-block-severity-error' : 'sch-block-severity-warning';
                UIFontIcon.create3DSFontIcon('attention', {
                    className: [severity],
                    parent: this._infoIcon,
                    tooltipInfos: { shortHelp: message }
                });
                this.display.infoIcon = this._infoIcon;
                this.display.infoIcon.grElt = this._block.getDisplay();
                this.display.infoIcon.subElt = this._infoIcon;
            }
        }
        /**
         * Hides the info icon.
         * @public
         */
        hideInfoIcon() {
            if (this._infoIcon !== undefined) {
                this._infoIcon.innerHTML = '';
                this.display.infoIcon = undefined;
            }
        }
        /**
         * Hides the breakpoint from the block view.
         * @public
         */
        hideBreakpoint() {
            UIDom.removeClassName(this._breakpointIcon, 'visible');
        }
        /**
         * Shows the breakpoint on the block view.
         * @public
         */
        showBreakpoint() {
            UIDom.addClassName(this._breakpointIcon, 'visible');
        }
        /**
         * Sets the background color.
         * @public
         * @param {string} color - The background color.
         */
        setBackgroundColor(color) {
            this._element.style.backgroundColor = '#' + color;
        }
        /**
         * Removes the background color.
         * @public
         */
        removeBackgroundColor() {
            this._element.style.backgroundColor = '';
        }
        /**
         * Shows the block halo.
         * @public
         */
        showHalo() {
            UIDom.addClassName(this._element, 'sch-block-halo');
        }
        /**
         * Hides the block halo.
         * @public
         */
        hideHalo() {
            UIDom.removeClassName(this._element, 'sch-block-halo');
        }
        /**
         * Gets the block container element.
         * @public
         * @returns {HTMLDivElement} The block container element.
         */
        getBlockContainer() {
            return this._blockContainer;
        }
        /**
         * This method gets the block container left element.
         * @public
         * @returns {HTMLDivElement} The block container left element.
         */
        getBlockContainerLeftElement() {
            return this._blockContainerLeft;
        }
        /**
         * This method gets the block name element.
         * @public
         * @returns {HTMLDivElement} The block name element.
         */
        getBlockNameElement() {
            return this._blockNameElt;
        }
        /**
         * This method gets the block container right element.
         * @public
         * @returns {HTMLDivElement} The block container right element.
         */
        getBlockContainerRightElement() {
            return this._blockContainerRight;
        }
        /**
         * Gets the breakpoint icon element.
         * @public
         * @returns {HTMLDivElement} The breakpoint icon element.
         */
        getBreakpointIcon() {
            return this._breakpointIcon;
        }
        /**
         * Gets the info icon element.
         * @public
         * @returns {HTMLDivElement} The info icon element.
         */
        getInfoIconElement() {
            return this._infoIcon;
        }
        /**
         * Gets the trigger zone left button element.
         * @public
         * @returns {HTMLDivElement|undefined} The trigger zone left button element.
         */
        getTriggerZoneLeftButtonElement() {
            return this._triggerZoneLeftButton;
        }
        /**
         * Gets the trigger zone right button element.
         * @public
         * @returns {HTMLDivElement|undefined} The trigger zone right button element.
         */
        getTriggerZoneRightButtonElement() {
            return this._triggerZoneRightButton;
        }
        /**
         * Gets the trigger zone top button element.
         * @public
         * @returns {HTMLDivElement|undefined} The trigger zone top button element.
         */
        getTriggerZoneTopButtonElement() {
            return this._triggerZoneTopButton;
        }
        /**
         * Gets the trigger zone bottom button element.
         * @public
         * @returns {HTMLDivElement|undefined} The trigger zone bottom button element.
         */
        getTriggerZoneBottomButtonElement() {
            return this._triggerZoneBottomButton;
        }
        /**
         * Gets the configuration icon element.
         * @public
         * @returns {HTMLDivElement} The configuration icon element.
         */
        getConfigurationIconElement() {
            return this._configurationIcon;
        }
        /**
         * Gets the category icon element.
         * @public
         * @returns {HTMLDivElement} The category icon element.
         */
        getCategoryIconElement() {
            return this._categoryIcon;
        }
        /**
         * Shows the block state element (multiple call).
         * @public
         */
        showBlockState() {
            if (!this._blockStateContainer) {
                this._blockStateContainer = UIDom.createElement('div', {
                    className: 'sch-block-state-container',
                    parent: this._blockContainerMiddleBottom
                });
                this.display.blockStateContainer = this._blockStateContainer;
                this.display.blockStateContainer.grElt = this._block.getDisplay();
                this.display.blockStateContainer.subElt = this._blockStateContainer;
                this._blockStatePendingElt = UIDom.createElement('p', {
                    className: 'sch-block-state-element',
                    parent: this._blockStateContainer,
                    textContent: '0',
                    tooltipInfos: { title: 'Pending', shortHelp: 'The number of instances in pending state.' }
                });
                UIDom.createElement('p', {
                    parent: this._blockStateContainer,
                    textContent: '-'
                });
                this._blockStateConnectingElt = UIDom.createElement('p', {
                    className: 'sch-block-state-element',
                    parent: this._blockStateContainer,
                    textContent: '0',
                    tooltipInfos: { title: 'Connecting', shortHelp: 'The number of instances in connecting state.' }
                });
                UIDom.createElement('p', {
                    parent: this._blockStateContainer,
                    textContent: '-'
                });
                this._blockStateExecutingElt = UIDom.createElement('p', {
                    className: 'sch-block-state-element',
                    parent: this._blockStateContainer,
                    textContent: '0',
                    tooltipInfos: { title: 'Executing', shortHelp: 'The number of instances in execution.' }
                });
                UIDom.createElement('p', {
                    parent: this._blockStateContainer,
                    textContent: '-'
                });
                this._blockStateTerminatedElt = UIDom.createElement('p', {
                    className: 'sch-block-state-element',
                    parent: this._blockStateContainer,
                    textContent: '0',
                    tooltipInfos: { title: 'Terminated', shortHelp: 'The number of instances which execution is terminated.' }
                });
            }
        }
        /**
         * Hides the block state element (multiple call).
         * @public
         */
        hideBlockState() {
            if (this._blockContainerMiddleBottom && this._blockStateContainer) {
                this._blockContainerMiddleBottom.removeChild(this._blockStateContainer);
                this._blockStateContainer = undefined;
                this._blockStatePendingElt = undefined;
                this._blockStateConnectingElt = undefined;
                this._blockStateExecutingElt = undefined;
                this._blockStateTerminatedElt = undefined;
            }
        }
        /**
         * The callback on the execution debug block event.
         * @private
         * @param {ExecutionEvents.DebugBlockEvent} event - The execution debug block event.
         */
        onDebugBlockEvent(event) {
            if (this._blockStateContainer && event.getPath() === this._block.getModel().toPath() &&
                this._blockStatePendingElt && this._blockStateConnectingElt &&
                this._blockStateExecutingElt && this._blockStateTerminatedElt) {
                const pendingValue = Number(this._blockStatePendingElt.textContent);
                const connectingValue = Number(this._blockStateConnectingElt.textContent);
                const executingValue = Number(this._blockStateExecutingElt.textContent);
                const terminatedValue = Number(this._blockStateTerminatedElt.textContent);
                const state = event.getState();
                if (state === ExecutionEnums.EBlockState.ePending) {
                    this._blockStatePendingElt.textContent = String(pendingValue + 1);
                }
                else if (state === ExecutionEnums.EBlockState.eConnecting) {
                    this._blockStatePendingElt.textContent = String(pendingValue - 1);
                    this._blockStateConnectingElt.textContent = String(connectingValue + 1);
                }
                else if (state === ExecutionEnums.EBlockState.eExecuting) {
                    this._blockStateConnectingElt.textContent = String(connectingValue - 1);
                    this._blockStateExecutingElt.textContent = String(executingValue + 1);
                }
                else if (state === ExecutionEnums.EBlockState.eTerminated) {
                    this._blockStateExecutingElt.textContent = String(executingValue - 1);
                    this._blockStateTerminatedElt.textContent = String(terminatedValue + 1);
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
         * Builds the node HTML element.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Node} node - The graph node.
         * @returns {IHTMLElement} The node HTML element.
         */
        buildNodeElement(node) {
            super.buildNodeElement(node);
            const isNodeIdSettable = this._block.getModel().isNodeIdSelectorSettable();
            UIDom.addClassName(this._element, ['sch-block', ...(isNodeIdSettable ? [] : ['sch-block-no-nodeid'])]);
            this._block.getModel().addListener(Events.BlockValidityChangeEvent, this._onValidityChangeCB);
            this._onValidityChange();
            this._createTriggerZoneContainer();
            this._createBlockContainer();
            this._element.dsModel = this._block;
            return this._element;
        }
        /**
         * The callback on the node display modification.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.PathSetTrie} changes - Changes set of paths of modified properties.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        onmodifyDisplay(elt, changes, grView) {
            super.onmodifyDisplay(elt, changes, grView);
            const block = elt.data.uiElement.getModel();
            const blockName = block.getName();
            this._blockNameElt.innerText = blockName;
        }
        /**
         * The callback on the node insert event.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.PathSetTrie} changes - Changes set of paths of modified properties.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         * @param {module:DS/egraph/core.GraphView} nextWithView - The view of the next.
         */
        oninsert(elt, changes, grView, nextWithView) {
            super.oninsert(elt, changes, grView, nextWithView);
            this._block.computeWidth();
            this._block.computeHeight();
        }
        /**
         * The callback on the validity change event of a block.
         * @protected
         */
        _onValidityChange() {
            if (this._element && this._block && this._block.getModel()) {
                if (!this._block.getModel().isValid()) {
                    UIDom.addClassName(this._element, 'sch-block-invalid');
                }
                else {
                    UIDom.removeClassName(this._element, 'sch-block-invalid');
                }
            }
        }
        /**
         * Creates the block container.
         * @private
         */
        _createBlockContainer() {
            this._blockContainer = UIDom.createElement('div', {
                className: 'sch-block-container',
                parent: this._element
            });
            this.display.blockContainer = this._blockContainer;
            this.display.blockContainer.grElt = this._block.getDisplay();
            this.display.blockContainer.subElt = this._blockContainer;
            this._blockContainer.addEventListener('mouseenter', this._onMouseenterEventCB, false);
            this._blockContainer.addEventListener('mouseleave', this._onMouseLeaveEventCB, false);
            this._blockContainerLeft = UIDom.createElement('div', {
                className: 'sch-block-container-left',
                parent: this._blockContainer
            });
            this._blockContainerMiddle = UIDom.createElement('div', {
                className: 'sch-block-container-middle',
                parent: this._blockContainer
            });
            this._blockContainerRight = UIDom.createElement('div', {
                className: 'sch-block-container-right',
                parent: this._blockContainer
            });
            // Create the middle top container
            UIDom.createElement('div', {
                className: 'sch-block-container-middle-top',
                parent: this._blockContainerMiddle
            });
            // Create the block middle center container
            this._blockContainerMiddleCenter = UIDom.createElement('div', {
                className: 'sch-block-container-middle-center',
                parent: this._blockContainerMiddle
            });
            // Create the block name
            this._blockNameElt = UIDom.createElement('div', {
                className: 'sch-block-name',
                parent: this._blockContainerMiddleCenter
            });
            // Create the middle bottom container
            this._blockContainerMiddleBottom = UIDom.createElement('div', {
                className: 'sch-block-container-middle-bottom',
                parent: this._blockContainerMiddle
            });
            // Create the block breakpoint icon
            const graphContext = this._block.getEditor()._getViewer().getMainGraph()?.getModel() || this._block.getModel().getGraphContext();
            const activateBreakpoints = this._block.getEditor()._areBreakpointsEnabled() && this._block.getModel().handleBreakpoint(graphContext);
            const bpClassName = ['sch-block-breakpoint-icon'];
            if (!activateBreakpoints) {
                bpClassName.push('deactivated');
            }
            this._breakpointIcon = UIDom.createElement('div', {
                className: bpClassName,
                parent: this._blockContainerLeft,
                tooltipInfos: UIWUXTools.createTooltip({
                    title: UINLS.get('tooltipTitleBlockToggleBreakpoint') + ' <span class="sch-tooltip-shortcut">F9</span>',
                    shortHelp: UINLS.get('tooltipShortHelpBlockToggleBreakpoint')
                })
            });
            if (activateBreakpoints) {
                this.display.breakpointIcon = this._breakpointIcon;
                this.display.breakpointIcon.grElt = this._block.getDisplay();
                this.display.breakpointIcon.subElt = this._breakpointIcon;
            }
            const breakpointController = this._block.getEditor().getBreakpointController();
            if (breakpointController.hasBreakpoint(this._block)) {
                this.showBreakpoint();
            }
            // Create the block configuration icon
            this._configurationIcon = UIDom.createElement('div', {
                className: 'sch-block-configuration-icon',
                parent: this._blockContainerLeft,
                tooltipInfos: { shortHelp: UINLS.get('shortHelpOpenBlockConfigurationDialog') },
                children: [UIFontIcon.createFAFontIcon('cog')]
            });
            this.display.configurationIcon = this._configurationIcon;
            this.display.configurationIcon.grElt = this._block.getDisplay();
            this.display.configurationIcon.subElt = this._configurationIcon;
            // Create the block info container
            this._infoIcon = UIDom.createElement('div', {
                className: 'sch-block-info-icon',
                parent: this._blockContainerRight
            });
            // Create the block category container
            this._categoryIcon = UIDom.createElement('div', {
                className: 'sch-block-category-icon',
                parent: this._blockContainerRight
            });
            UIFontIcon.createIconFromBlockCategory(this._block.getModel().getCategory(), this._categoryIcon, undefined, true);
            this.display.categoryIcon = this._categoryIcon;
            this.display.categoryIcon.grElt = this._block.getDisplay();
            this.display.categoryIcon.subElt = this._categoryIcon;
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
         * Creates the block trigger zone container.
         * @private
         */
        _createTriggerZoneContainer() {
            this._triggerZoneContainer = UIDom.createElement('div', {
                className: 'sch-block-triggerzone-container',
                parent: this._element
            });
            this._triggerZoneMiddle = UIDom.createElement('div', {
                className: ['sch-block-triggerzone', 'sch-block-triggerzone-middle']
            });
            this._triggerZoneContainer.appendChild(this._triggerZoneMiddle);
            if (this._block.getModel().isValid()) {
                if (this._block.getModel().isDataPortTypeAddable(ModelEnums.EDataPortType.eInput)) {
                    this._triggerZoneTop = UIDom.createElement('div', {
                        className: ['sch-block-triggerzone', 'sch-block-triggerzone-top'],
                        parent: this._triggerZoneContainer
                    });
                    this._triggerZoneTopButton = UIBlockView._createAddPortButton(this._triggerZoneTop, UINLS.get('shortHelpAddInputDataPort'));
                    this._triggerZoneTopButton.addEventListener('click', this._onAddButtonClickCB, false);
                }
                if (this._block.getModel().isDataPortTypeAddable(ModelEnums.EDataPortType.eOutput)) {
                    this._triggerZoneBottom = UIDom.createElement('div', {
                        className: ['sch-block-triggerzone', 'sch-block-triggerzone-bottom'],
                        parent: this._triggerZoneContainer
                    });
                    this._triggerZoneBottomButton = UIBlockView._createAddPortButton(this._triggerZoneBottom, UINLS.get('shortHelpAddOutputDataPort'));
                    this._triggerZoneBottomButton.addEventListener('click', this._onAddButtonClickCB, false);
                }
                if (this._block.getModel().isControlPortTypeAddable(ModelEnums.EControlPortType.eInput)) {
                    this._triggerZoneLeft = UIDom.createElement('div', {
                        className: ['sch-block-triggerzone', 'sch-block-triggerzone-left'],
                        parent: this._triggerZoneContainer
                    });
                    this._triggerZoneLeftButton = UIBlockView._createAddPortButton(this._triggerZoneLeft, UINLS.get('shortHelpAddInputControlPort'));
                    this._triggerZoneLeftButton.addEventListener('click', this._onAddButtonClickCB, false);
                }
                if (this._block.getModel().isControlPortTypeAddable(ModelEnums.EControlPortType.eOutput)) {
                    this._triggerZoneRight = UIDom.createElement('div', {
                        className: ['sch-block-triggerzone', 'sch-block-triggerzone-right'],
                        parent: this._triggerZoneContainer
                    });
                    this._triggerZoneRightButton = UIBlockView._createAddPortButton(this._triggerZoneRight, UINLS.get('shortHelpAddOutputControlPort'));
                    this._triggerZoneRightButton.addEventListener('click', this._onAddButtonClickCB, false);
                }
            }
        }
        /**
         * Creates the add port button.
         * @private
         * @static
         * @param {HTMLDivElement} parent - The parent html element.
         * @param {string} shortHelp - The short help.
         * @returns {HTMLDivElement} The add port button.
         */
        static _createAddPortButton(parent, shortHelp) {
            return UIDom.createElement('div', {
                className: 'sch-block-triggerzone-button',
                parent: parent,
                tooltipInfos: { shortHelp: shortHelp },
                children: [
                    UIFontIcon.createFAFontIcon('circle'),
                    UIFontIcon.createFAFontIcon('plus-circle')
                ]
            });
        }
        /**
         * The callback on the add button click event.
         * @private
         * @param {MouseEvent} event - The mouse click event.
         */
        _onAddButtonClick(event) {
            let portUI;
            const blockModel = this._block.getModel();
            if (event.target === this._triggerZoneTopButton) {
                const portModel = blockModel.createDynamicDataPort(ModelEnums.EDataPortType.eInput);
                portUI = this._block.getUIDataPortFromModel(portModel);
            }
            else if (event.target === this._triggerZoneBottomButton) {
                const portModel = blockModel.createDynamicDataPort(ModelEnums.EDataPortType.eOutput);
                portUI = this._block.getUIDataPortFromModel(portModel);
            }
            else if (event.target === this._triggerZoneLeftButton) {
                const portModel = blockModel.createDynamicControlPort(ModelEnums.EControlPortType.eInput);
                portUI = this._block.getUIControlPortFromModel(portModel);
            }
            else if (event.target === this._triggerZoneRightButton) {
                const portModel = blockModel.createDynamicControlPort(ModelEnums.EControlPortType.eOutput);
                portUI = this._block.getUIControlPortFromModel(portModel);
            }
            if (portUI !== undefined) {
                const historyController = this._block.getGraph().getEditor().getHistoryController();
                historyController.registerCreateAction(portUI);
            }
        }
        /**
         * The callback on the mouse enter event.
         * @private
         */
        _onMouseenterEvent() {
            UIDom.addClassName(this._element, 'hover');
        }
        /**
         * The callback on the mouse leave event.
         * @private
         */
        _onMouseLeaveEvent() {
            UIDom.removeClassName(this._element, 'hover');
        }
    }
    return UIBlockView;
});
