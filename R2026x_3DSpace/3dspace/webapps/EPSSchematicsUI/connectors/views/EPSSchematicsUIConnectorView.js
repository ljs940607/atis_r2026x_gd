/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIConnectorView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIConnectorView", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, EGraphViews, UIDom) {
    "use strict";
    /**
     * This class defines a UI connector view.
     * @private
     * @class UIConnectorView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIConnectorView
     * @extends EGraphViews.SVGConnView
     */
    class UIConnectorView extends EGraphViews.SVGConnView {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super();
            this._mouseOver = false;
            this._onMouseEnterCB = this._onMouseEnter.bind(this);
            this._onMouseLeaveCB = this._onMouseLeave.bind(this);
            this._onMouseUpCB = this._onMouseUp.bind(this);
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
         * Gets the SVG element representing the connector.
         * @public
         * @returns {SVGElement} The SVG element representing the connecor.
         */
        getElement() {
            return this.structure.root;
        }
        /**
         * Gets the bounding box of the connector.
         * @public
         * @returns {IDOMRect} The bounding box of the connector.
         */
        getBoundingBox() {
            const rect = this._element.getBoundingClientRect();
            return {
                left: rect.left, right: rect.right,
                top: rect.top, bottom: rect.bottom,
                width: rect.width, height: rect.height
            };
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
         * @param {EGraphCore.Element} _elt - The element using this view.
         * @param {EGraphCore.GraphView} _grView - The graph view.
         */
        ondestroyDisplay(_elt, _grView) {
            if (this.structure !== undefined && this.structure.root !== undefined) {
                this.structure.root.removeEventListener('mouseenter', this._onMouseEnterCB);
                this.structure.root.removeEventListener('mouseleave', this._onMouseLeaveCB);
                this.structure.root.removeEventListener('mouseup', this._onMouseUpCB);
            }
            this._element = undefined;
            this._mouseOver = undefined;
            this._onMouseEnterCB = undefined;
            this._onMouseLeaveCB = undefined;
            this._onMouseUpCB = undefined;
        }
        /**
         * Builds the connector SVG element.
         * @protected
         * @override
         * @param {EGraphCore.Connector} _connector - The UI connector.
         * @returns {SVGElement} The connector SVG element.
         */
        buildConnElement(_connector) {
            UIDom.addClassName(this.structure.root, 'sch-connector');
            this._element = UIDom.createSVGGroup();
            this.structure.root.addEventListener('mouseenter', this._onMouseEnterCB);
            this.structure.root.addEventListener('mouseleave', this._onMouseLeaveCB);
            this.structure.root.addEventListener('mouseup', this._onMouseUpCB);
            return this._element;
        }
        /**
         * The callback on the modify display.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The connector.
         * @param {Object} changes - Set of paths of modified properties.
         * @param {EGraphCore.GraphView} grView - The graph view.
         */
        onmodifyDisplay(connector, changes, grView) {
            super.onmodifyDisplay(connector, changes, grView);
        }
        /**
         * The callback on the connector structure positionning.
         * @protected
         * @override
         * @param {EGraphCore.Connector} elt - The element using this view.
         * @param {EGraphCore.Connector} nextWithView - The next sibling of element.
         * @param {EGraphCore.GraphView} grView - The graph view.
         * @param {EGraphViews.PerEltView} parentView - The view of the parent of the element.
         */
        onpositionStructure(elt, nextWithView, grView, parentView) {
            super.onpositionStructure(elt, nextWithView, grView, parentView);
        }
        /**
         * The callback on the connector mouse enter event.
         * @protected
         * @param {MouseEvent} _event - The mouse enter event.
         */
        _onMouseEnter(_event) {
            this._mouseOver = true;
        }
        /**
         * The callback on the connector mouse leave event.
         * @protected
         * @param {MouseEvent} _event - The mouse leave event.
         */
        _onMouseLeave(_event) {
            this._mouseOver = false;
        }
        /**
         * The callback on the connectore mouse up event.
         * @protected
         * @param {MouseEvent} _event - The mouse up event.
         */
        // eslint-disable-next-line class-methods-use-this
        _onMouseUp(_event) { }
        /**
         * Checks if the mouse cursor is over the connector.
         * @protected
         * @returns {boolean} True if the mouse cursor is over the connector else false.
         */
        _isMouseOver() {
            return this._mouseOver;
        }
    }
    return UIConnectorView;
});
