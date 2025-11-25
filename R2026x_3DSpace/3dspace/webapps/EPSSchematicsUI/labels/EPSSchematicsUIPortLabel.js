/// <amd-module name='DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel'/>
define("DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUIFadeOutContainer", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPort", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/labels/EPSSchematicsUIPortLabel"], function (require, exports, UIFadeOutContainer, UIDom, UIFontIcon, UIWUXTools, UIGraph, DataPort, UINLS) {
    "use strict";
    // TODO: Manage enumeration (display in blue as number but with the string value)! see UITypesCatalog.getStringValue!
    // TODO: Margin when the label is close to the window border!
    // TODO: Highlight (or cursor change) on the evaluator title to show the title is expandable!
    // TODO: Then manage Ctrl key press to direct show label ok for port but ko for block and link!
    // TODO: Persist label inside graph => https://bl.ocks.org/Jverma/2385cb7794d18c51e3ab
    /**
     * This class defines a UI port label.
     * @private
     * @abstract
     * @class UIPortLabel
     * @alias module:DS/EPSSchematicsUI/labels/EPSSchematicsUIPortLabel
     * @extends UIFadeOutContainer
     */
    class UIPortLabel extends UIFadeOutContainer {
        static { this._kOpacityMaxDistance = 25; }
        static { this.kLabelToPortGap = 40; }
        static { this.kLabelToPortXYGap = Math.sqrt(Math.pow(UIPortLabel.kLabelToPortGap, 2) / 2); }
        /**
         * @public
         * @constructor
         * @param {UILabelController} controller - The UI label controller.
         * @param {UIPort} portUI - The UI port.
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         * @param {boolean} soloDisplay - Whether the label is displayed solo.
         */
        constructor(controller, portUI, displaySpeed, soloDisplay, displayDocumentation) {
            super();
            this._controller = controller;
            this._portUI = portUI;
            this._displaySpeed = displaySpeed;
            this._soloDisplay = soloDisplay;
            this._displayDocumentation = displayDocumentation;
            const UIThumbnailViewerCtor = require('../viewers/EPSSchematicsUIThumbnailViewer');
            this._isThumbnailViewer = this._controller.getViewer() instanceof UIThumbnailViewerCtor;
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
         * Removes the port label.
         * @public
         * @override
         */
        remove() {
            if (this._controller) {
                this._controller.clearPortLabelWithoutRemove();
                this._controller.removeLabelFromContainer(this._element);
                this._controller.removeLineFromContainer(this._line);
                this._controller = undefined;
            }
            this._portUI = undefined;
            this._displaySpeed = undefined;
            this._soloDisplay = undefined;
            this._isThumbnailViewer = undefined;
            this._line = undefined;
            this._initialDistance = undefined;
            super.remove();
        }
        /**
         * Gets the UI port.
         * @public
         * @returns {UIPort} portUI - The UI port.
         */
        getUIPort() {
            return this._portUI;
        }
        /**
         * Updates the display speed of the label.
         * @public
         * @param {UIEnums.ELabelDisplaySpeed} displaySpeed - The label display speed.
         */
        updateDisplaySpeed(displaySpeed) {
            const isDirect = displaySpeed === 0 /* UIEnums.ELabelDisplaySpeed.eDirect */;
            const isSlow = displaySpeed === 2 /* UIEnums.ELabelDisplaySpeed.eSlow */;
            const classNameToAdd = isDirect ? 'sch-label-show-direct' : (isSlow ? 'sch-label-show-slow' : 'sch-label-show-fast');
            const classNameToRemove = ['sch-label-show-direct', 'sch-label-show-slow', 'sch-label-show-fast'];
            UIDom.removeClassName(this._element, classNameToRemove);
            UIDom.removeClassName(this._line, classNameToRemove);
            UIDom.addClassName(this._element, classNameToAdd);
            UIDom.addClassName(this._line, classNameToAdd);
        }
        /**
         * Updates the position of the port label and its line.
         * @public
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        updatePosition(vpt) {
            this._updateLabelPosition(vpt);
            this.updateLinePosition(vpt);
        }
        /**
         * Sets the label position.
         * @public
         * @override
         * @param {number} left: The left position of the label.
         * @param {number} top: The top position of the label.
         */
        setPosition(left, top) {
            super.setPosition(left, top);
            // Set the minimum label width
            const labelBBox = this._element.getBoundingClientRect();
            this._element.style.width = labelBBox.width + 'px';
        }
        /**
         * Gets the port label line element.
         * @public
         * @returns {SVGLineElement} The port label line element.
         */
        getLine() {
            return this._line;
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
         * Gets the label controller.
         * @public
         * @returns {UILabelController} The label controller.
         */
        getLabelController() {
            return this._controller;
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
         * Fades the container according to the mouse position.
         * @protected
         * @override
         * @param {number} mouseLeft - The left position of the mouse.
         * @param {number} mouseTop - The top position of the mouse.
         * @param {HTMLElement} target - The target mouse element.
         */
        _fadeWithDistance(mouseLeft, mouseTop, target) {
            if (!this._isFadeDisabled) {
                const distance = UIDom.computeDistanceFromMouse(this._element, mouseLeft, mouseTop);
                if (this._initialDistance === undefined || distance <= this._initialDistance || this._portUI.getView().isPartOfView(target)) {
                    this._initialDistance = distance;
                    this._element.style.opacity = String(1);
                    this._line.style.opacity = String(1);
                }
                else if (distance < UIPortLabel._kOpacityMaxDistance) {
                    this._element.style.opacity = String(1 - (distance / UIPortLabel._kOpacityMaxDistance));
                    this._line.style.opacity = String(1 - (distance / UIPortLabel._kOpacityMaxDistance));
                }
                else {
                    this.remove();
                }
            }
        }
        /**
         * Creates the port label element.
         * @protected
         * @override
         */
        _createElement() {
            super._createElement();
            const isHidden = this._portUI.getPersistentLabel() !== undefined;
            const hiddenClass = isHidden ? ['sch-label-hidden'] : [];
            const traceHiddenClass = this._isThumbnailViewer ? ['sch-trace-hidden'] : [];
            const labelClassName = ['sch-label', ...hiddenClass, ...traceHiddenClass];
            UIDom.addClassName(this._element, labelClassName);
            const isDataPort = this._portUI.getModel() instanceof DataPort;
            const isSubDataPort = isDataPort && this._portUI.getModel().dataPort !== undefined;
            const parentDataPort = isSubDataPort ? this._portUI.getParentPort() : this._portUI;
            const isGraphDataPort = parentDataPort.getParent() instanceof UIGraph;
            const isPinable = isDataPort && !isGraphDataPort;
            if (this._soloDisplay && isPinable) {
                UIDom.addClassName(this._element, 'sch-label-solo');
                UIFontIcon.create3DSFontIcon('pin', {
                    className: 'sch-label-pin-icon',
                    parent: this._element,
                    tooltipInfos: UIWUXTools.createTooltip({ title: UINLS.get('pinPortLabelTitle'), shortHelp: UINLS.get('pinPortLabelShortHelp'), initialDelay: 800 }),
                    onclick: () => this._portUI.getEditor().getHistoryController().registerCreateAction(this._portUI.createPersistentLabel())
                });
            }
            // Create the label title
            this._buildTitleElement();
            this._controller.addLabelToContainer(this._element);
            // Create the line
            const lineClassName = ['sch-label-line', ...(isHidden ? ['sch-label-line-hidden'] : [])];
            this._line = UIDom.createSVGLine({ className: lineClassName });
            this._controller.addLineToContainer(this._line);
            // Manage the display speed
            this.updateDisplaySpeed(this._displaySpeed);
        }
        /**
         * Builds the label title element.
         * @protected
         * @returns {HTMLDivElement} The label title element
         */
        _buildTitleElement() {
            return UIDom.createElement('div', {
                className: 'sch-label-title',
                children: [UIDom.createElement('span', {
                        className: 'sch-label-port-name',
                        textContent: this._portUI.getModel().getName()
                    })],
                parent: this._element
            });
        }
        /**
         * Updates the line position.
         * @private
         * @param {IViewpoint} vpt - The current graph viewpoint.
         */
        /*private updateLinePosition(vpt: IViewpoint): void {
            const labelBBox = this.element.getBoundingClientRect();
            const portBBox = this.portUI.getBoundingBox(vpt);
            const lineX1 = labelBBox.left + labelBBox.width / 2;
            const lineY1 = labelBBox.top + labelBBox.height / 2;
            const lineX2 = portBBox.left + portBBox.width / 2;
            const lineY2 = portBBox.top + portBBox.height / 2;
            this.setLinePosition(lineX1, lineY1, lineX2, lineY2);
        };*/
        /**
         * Sets the label line position.
         * @protected
         * @param {number} x1 - The start point line left position.
         * @param {number} y1 - The start point line top position.
         * @param {number} x2 - The end point line left position.
         * @param {number} y2 - The end point line top position.
         */
        _setLinePosition(x1, y1, x2, y2) {
            const cr = this._controller.getViewer().getClientRect();
            this._line.setAttribute('x1', String(x1 - cr.left));
            this._line.setAttribute('y1', String(y1 - cr.top));
            this._line.setAttribute('x2', String(x2 - cr.left));
            this._line.setAttribute('y2', String(y2 - cr.top));
        }
    }
    return UIPortLabel;
});
