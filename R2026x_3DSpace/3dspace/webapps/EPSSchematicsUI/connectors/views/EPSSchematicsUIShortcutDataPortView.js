/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIShortcutDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIShortcutDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIShortcutDataPort"], function (require, exports, UIDataPortView, UIDom, UIShapes) {
    "use strict";
    /**
     * This class defined a UI shortcut data port view.
     * @private
     * @class UIShortcutDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIShortcutDataPortView
     * @extends UIDataPortView
     */
    class UIShortcutDataPortView extends UIDataPortView {
        /**
         * @public
         * @constructor
         * @param {UIShortcutDataPort} port - The UI shortcut data port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Updates the connector width.
         * @public
         * @override
         */
        // eslint-disable-next-line class-methods-use-this
        updateConnectorWidth() { }
        /**
         * Destroys the connector.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Builds the connector SVG element.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The UI connector.
         * @returns {SVGElement} The connector SVG element.
         */
        buildConnElement(connector) {
            super.buildConnElement(connector);
            UIDom.addClassName(this.structure.root, 'sch-shortcut-data-port');
            const shortcutType = this._port.getShortcutType();
            if (shortcutType === 0 /* UIEnums.EShortcutType.eStartPort */) {
                UIDom.addClassName(this._element, 'sch-output-data-port');
                this._createOutputConnector(connector);
                this._createIcon(-90, 0, 6.5, 0.08);
            }
            else if (shortcutType === 1 /* UIEnums.EShortcutType.eEndPort */) {
                UIDom.addClassName(this._element, 'sch-input-data-port');
                this._createInputConnector(connector);
                this._createIcon(-90, 0, 3.8, 0.07);
            }
            return this._element;
        }
        /**
         * The callback on the connector mouse enter event.
         * @protected
         * @override
         * @param {MouseEvent} event - The mouse enter event.
         */
        _onMouseEnter(event) {
            if (event.buttons === 0) {
                super._onMouseEnter(event);
                const dataPortUI = this._port.getParent().getDataPortUI();
                if (dataPortUI !== undefined) {
                    dataPortUI.highlight();
                }
            }
        }
        /**
         * The callback on the connector mouse leave event.
         * @protected
         * @override
         * @param {MouseEvent} event - The mouse leave event.
         */
        _onMouseLeave(event) {
            super._onMouseLeave(event);
            const dataPortUI = this._port.getParent().getDataPortUI();
            if (dataPortUI !== undefined) {
                dataPortUI.unhighlight();
            }
        }
        /**
         * Creates the shortcut svg icon.
         * It is mainly a IE11 fix which does not handle svg matrix modification in css!
         * @protected
         * @param {number} rotation - The icon rotation.
         * @param {number} translateX - The icon left translation.
         * @param {number} translateY - The icon top translation.
         * @param {number} scale - The icon scale.
         */
        _createIcon(rotation, translateX, translateY, scale) {
            UIDom.createSVGPath({
                className: 'sch-shortcut-icon',
                parent: this._element,
                attributes: {
                    d: UIShapes.shortcutIconPathPoints,
                    transform: 'rotate(' + rotation + ') translate(' + translateX + ' ' + translateY + ') scale(' + scale + ')'
                }
            });
        }
    }
    return UIShortcutDataPortView;
});
