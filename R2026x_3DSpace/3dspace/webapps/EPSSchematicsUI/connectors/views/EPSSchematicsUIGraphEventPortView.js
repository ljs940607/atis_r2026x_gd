/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphEventPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphEventPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphControlPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes"], function (require, exports, UIGraphControlPortView, UIDom, UIShapes) {
    "use strict";
    /**
     * This class defined the customized default view for a UI graph event port.
     * @private
     * @class UIGraphEventPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphEventPortView
     * @extends UIGraphControlPortView
     */
    class UIGraphEventPortView extends UIGraphControlPortView {
        /**
         * @public
         * @constructor
         * @param {UIGraphEventPort} port - The UI block port.
         */
        constructor(port) {
            super(port);
            this.kPortIconOffset = 2;
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
         * Destroys the connector.
         * @protected
         * @override
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._icon = undefined;
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Creates the port background.
         * @protected
         * @override
         */
        _createBackground() {
            super._createBackground();
            this._createIcon();
        }
        /**
         * Creates the port triangle.
         * @protected
         * @override
         */
        _createTriangle() {
            this._triangle = UIDom.createSVGPath({
                className: 'sch-graph-port-triangle',
                attributes: { d: UIShapes.eventPortPathPoints },
                parent: this._element
            });
        }
        /**
         * Computes the port background.
         * @protected
         * @override
         */
        _computeBackground() {
            super._computeBackground();
            // Update the background by adding the icon width.
            let bgWidth = parseFloat(this._background.getAttribute('width') || '');
            bgWidth += this.kPortIconOffset + this._getIconWidth() - UIGraphControlPortView.kPortWidthOffset;
            this._background.setAttribute('width', String(bgWidth));
            this._computeIcon();
        }
        /**
         * Computes the port title.
         * @protected
         * @override
         */
        _computeTitle() {
            super._computeTitle();
            if (this._port.isStartPort()) { // Override the title left position
                const titleLeft = this.kPortIconOffset + this._getIconWidth();
                this._title.setAttribute('x', String(titleLeft));
            }
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
         * Gets the port icon width.
         * @private
         * @returns {number} The port icon width.
         */
        _getIconWidth() {
            const parentClassNames = ['sch-graph-port', 'sch-input-control-port'];
            const iconBBox = UIDom.renderedSVGBBox(this._icon, parentClassNames);
            return iconBBox.width;
        }
        /**
        * Computes the port icon.
        * @private
        */
        _computeIcon() {
            const bgWidth = parseFloat(this._background.getAttribute('width') || '');
            const iconWidth = this._getIconWidth();
            const iconLeft = this._port.isStartPort() ? this.kPortIconOffset : bgWidth - iconWidth + this.kPortIconOffset;
            const iconTop = (UIGraphControlPortView.kPortHeight / 2);
            this._icon.setAttribute('x', iconLeft.toString());
            this._icon.setAttribute('y', iconTop.toString());
        }
        /**
         * Creates the port icon.
         * @private
         */
        _createIcon() {
            this._icon = UIDom.createSVGText({
                className: 'icon',
                textContent: this._port.isStartPort() ? '\uf1eb' : '\uf0a1',
                parent: this._element,
                attributes: { dy: 4.2 }
            });
        }
    }
    return UIGraphEventPortView;
});
