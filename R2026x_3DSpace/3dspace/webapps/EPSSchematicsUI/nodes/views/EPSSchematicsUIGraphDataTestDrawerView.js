/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataTestDrawerView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataTestDrawerView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataDrawerView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIGraphTestDrawer"], function (require, exports, UIGraphDataDrawerView, UIDom, UIWUXTools, UINLS) {
    "use strict";
    /**
     * This class defines the UI graph data test drawer view.
     * @private
     * @class UIGraphDataTestDrawerView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphDataTestDrawerView
     * @extends UIGraphDataDrawerView
     */
    class UIGraphDataTestDrawerView extends UIGraphDataDrawerView {
        /**
         * @public
         * @constructor
         * @param {UIGraphDataTestDrawer} graphDataDrawer - The graph data test drawer.
         * @param {boolean} isInputPort - True if the data port is an input type else false.
         */
        constructor(graphDataDrawer, isInputPort) {
            super(graphDataDrawer);
            this._isInputPort = isInputPort;
        }
        /**
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._isInputPort = undefined;
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Creates the node element.
         * @protected
         * @override
         */
        createNodeElement() {
            const className = this._isInputPort ? 'sch-graph-inputtest-drawer' : 'sch-graph-outputref-drawer';
            const textContent = this._isInputPort ? UINLS.get('drawerTestInputs') : UINLS.get('drawerTestOutputsReference');
            const tooltipTitle = this._isInputPort ? UINLS.get('tooltipTitleEditTestInputs') : UINLS.get('tooltipTitleEditTestOutputsReference');
            const tooltipShortHelp = this._isInputPort ? UINLS.get('tooltipShortHelpEditTestInputs') : UINLS.get('tooltipShortHelpEditTestOutputsReference');
            UIDom.addClassName(this._element, ['sch-graph-test-drawer', className]);
            const titleElt = UIDom.createElement('div', {
                parent: this._element,
                className: 'sch-graph-drawer-title',
                textContent: textContent,
                tooltipInfos: UIWUXTools.createTooltip({ title: tooltipTitle, shortHelp: tooltipShortHelp })
            });
            this.display.titleElt = titleElt;
            this.display.titleElt.grElt = this._graphDataDrawer.getDisplay();
            this.display.titleElt.subElt = titleElt;
        }
    }
    return UIGraphDataTestDrawerView;
});
