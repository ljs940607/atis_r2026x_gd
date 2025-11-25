/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataDrawerView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataDrawerView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIGraphDataDrawer"], function (require, exports, UINodeView, UIDom, UIFontIcon, UIWUXTools, UINLS, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI graph data drawer view.
     * @private
     * @class UIGraphDataDrawerView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataDrawerView
     * @extends UINodeView
     */
    class UIGraphDataDrawerView extends UINodeView {
        /**
         * @public
         * @constructor
         * @param {UIGraphDataDrawer} graphDataDrawer - The UI graph data drawer.
         */
        constructor(graphDataDrawer) {
            super();
            this._graphDataDrawer = graphDataDrawer;
        }
        /**
         * Shows the graph drawer.
         * @public
         */
        show() {
            UIDom.removeClassName(this._element, 'sch-drawer-hidden');
        }
        /**
         * Hides the graph drawer.
         * @public
         */
        hide() {
            UIDom.addClassName(this._element, 'sch-drawer-hidden');
        }
        /**
         * Checks if the drawer is visible.
         * @public
         * @returns {boolean} True if the drawer is visible else false.
         */
        isVisible() {
            return !UIDom.hasClassName(this._element, 'sch-drawer-hidden');
        }
        /**
         * Gets the title element.
         * @public
         * @returns {HTMLDivElement} The title element.
         */
        getTitleElement() {
            return this._titleElt;
        }
        /**
         * Gets the button element.
         * @public
         * @returns {HTMLDivElement|undefined} The button element.
         */
        getButtonElement() {
            return this._buttonElt;
        }
        /**
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._graphDataDrawer = undefined;
            this._buttonElt = undefined;
            this._titleElt = undefined;
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
            UIDom.addClassName(this._element, 'sch-graph-data-drawer');
            this._createDrawerElement();
            return this._element;
        }
        /**
         * Creates the drawer element.
         * @protected
         */
        _createDrawerElement() {
            let textContent;
            let titleShortHelp;
            let buttonShortHelp;
            let dataPortClassName;
            if (this._graphDataDrawer.getPortType() === ModelEnums.EDataPortType.eInput) {
                textContent = UINLS.get('drawerInputDataPorts');
                titleShortHelp = UINLS.get('shortHelpEditInputDataPorts');
                buttonShortHelp = UINLS.get('shortHelpCreateInputDataPort');
                dataPortClassName = 'sch-graph-input-data-drawer';
            }
            else if (this._graphDataDrawer.getPortType() === ModelEnums.EDataPortType.eOutput) {
                textContent = UINLS.get('drawerOutputDataPorts');
                titleShortHelp = UINLS.get('shortHelpEditOutputDataPorts');
                buttonShortHelp = UINLS.get('shortHelpCreateOutputDataPort');
                dataPortClassName = 'sch-graph-output-data-drawer';
            }
            else if (this._graphDataDrawer.getPortType() === ModelEnums.EDataPortType.eLocal) {
                textContent = UINLS.get('drawerLocalDataPorts');
                titleShortHelp = UINLS.get('shortHelpEditLocalDataPorts');
                buttonShortHelp = UINLS.get('shortHelpCreateLocalDataPort');
                if (this._graphDataDrawer.getInputLocalState()) {
                    dataPortClassName = 'sch-graph-input-local-data-drawer';
                }
                else {
                    dataPortClassName = 'sch-graph-output-local-data-drawer';
                }
            }
            if (dataPortClassName) {
                UIDom.addClassName(this._element, dataPortClassName);
            }
            if (this._graphDataDrawer.isDataPortAddable()) {
                UIDom.addClassName(this._element, 'sch-drawer-addable');
                this._buttonElt = UIDom.createElement('div', {
                    className: 'sch-drawer-button',
                    parent: this._element,
                    tooltipInfos: UIWUXTools.createTooltip({ shortHelp: buttonShortHelp }),
                    children: [UIFontIcon.createFAFontIcon('plus')]
                });
                this.display.buttonElt = this._buttonElt;
                this.display.buttonElt.grElt = this._graphDataDrawer.getDisplay();
                this.display.buttonElt.subElt = this._buttonElt;
            }
            this._titleElt = UIDom.createElement('div', {
                className: 'sch-drawer-title',
                parent: this._element,
                textContent: textContent,
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: titleShortHelp })
            });
            this.display.titleElt = this._titleElt;
            this.display.titleElt.grElt = this._graphDataDrawer.getDisplay();
            this.display.titleElt.subElt = this._titleElt;
        }
    }
    return UIGraphDataDrawerView;
});
