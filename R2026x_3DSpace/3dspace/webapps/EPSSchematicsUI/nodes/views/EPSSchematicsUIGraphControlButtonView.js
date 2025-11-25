/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphControlButtonView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphControlButtonView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIGraphControlButton"], function (require, exports, UINodeView, UIDom, UIFontIcon, ModelEnums, UINLS) {
    "use strict";
    /**
     * This class defines a UI graph control button view.
     * @private
     * @class UIGraphControlButtonView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIGraphControlButtonView
     * @extends UINodeView
     */
    class UIGraphControlButtonView extends UINodeView {
        /**
         * @public
         * @constructor
         * @param {UIGraphControlButton} graphControlButton - The graph control button.
         * @param {boolean} isInput - True for input, false for output.
         */
        constructor(graphControlButton, isInput) {
            super();
            this._onButtonClickCB = this._onButtonClick.bind(this);
            this._graphControlButton = graphControlButton;
            this._isInput = isInput;
        }
        /**
         * Gets the control port button.
         * @public
         * @returns {HTMLDivElement|undefined} The control port button.
         */
        getControlPortButton() {
            return this._controlPortButton;
        }
        /**
         * Gets the event port button.
         * @public
         * @returns {HTMLDivElement|undefined} The event port button.
         */
        getEventPortButton() {
            return this._eventPortButton;
        }
        /**
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            if (this._controlPortButton !== undefined) {
                this._controlPortButton.removeEventListener('click', this._onButtonClickCB, false);
            }
            if (this._eventPortButton !== undefined) {
                this._eventPortButton.removeEventListener('click', this._onButtonClickCB, false);
            }
            this._graphControlButton = undefined;
            this._isInput = undefined;
            this._controlPortButton = undefined;
            this._eventPortButton = undefined;
            this._onButtonClickCB = undefined;
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
            const graphModel = this._graphControlButton.getGraph().getModel();
            // Button container
            const containerClass = this._isInput ? 'sch-graph-input-control-button-container' : 'sch-graph-output-control-button-container';
            UIDom.addClassName(this._element, ['sch-graph-control-button-container', containerClass]);
            // Control port button and icons
            const controlPortType = this._isInput ? ModelEnums.EControlPortType.eInput : ModelEnums.EControlPortType.eOutput;
            if (graphModel.isControlPortTypeAddable(controlPortType)) {
                const controlShortHelp = this._isInput ? UINLS.get('shortHelpCreateInputControlPort') : UINLS.get('shortHelpCreateOutputControlPort');
                this._controlPortButton = UIDom.createElement('div', {
                    className: 'sch-graph-control-button',
                    parent: this._element,
                    tooltipInfos: { shortHelp: controlShortHelp },
                    children: [UIFontIcon.createFAFontIcon('plus'), UIFontIcon.createFAFontIcon('caret-right')]
                });
                this._controlPortButton.addEventListener('click', this._onButtonClickCB, false);
            }
            // Event port button and icons
            const eventPortType = this._isInput ? ModelEnums.EControlPortType.eInputEvent : ModelEnums.EControlPortType.eOutputEvent;
            if (graphModel.isControlPortTypeAddable(eventPortType)) {
                const eventShortHelp = this._isInput ? UINLS.get('shortHelpCreateInputEventPort') : UINLS.get('shortHelpCreateOutputEventPort');
                this._eventPortButton = UIDom.createElement('div', {
                    className: 'sch-graph-control-button',
                    parent: this._element,
                    tooltipInfos: { shortHelp: eventShortHelp },
                    children: [UIFontIcon.createFAFontIcon('plus'), UIFontIcon.createFAFontIcon(this._isInput ? 'wifi' : 'bullhorn')]
                });
                this._eventPortButton.addEventListener('click', this._onButtonClickCB, false);
            }
            return this._element;
        }
        /**
         * The callback on the button click event.
         * @private
         * @param {MouseEvent} event - The button click event.
         */
        _onButtonClick(event) {
            let portType;
            if (event.currentTarget === this._controlPortButton) {
                portType = this._isInput ? ModelEnums.EControlPortType.eInput : ModelEnums.EControlPortType.eOutput;
            }
            else if (event.currentTarget === this._eventPortButton) {
                portType = this._isInput ? ModelEnums.EControlPortType.eInputEvent : ModelEnums.EControlPortType.eOutputEvent;
            }
            if (portType !== undefined) {
                this._graphControlButton.getGraph().createControlPort(portType);
            }
        }
    }
    return UIGraphControlButtonView;
});
