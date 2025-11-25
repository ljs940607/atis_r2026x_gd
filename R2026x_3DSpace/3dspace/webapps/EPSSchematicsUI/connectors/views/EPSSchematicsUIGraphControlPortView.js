/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphControlPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphControlPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIGraphControlPort"], function (require, exports, UIControlPortView, UIDom, UIShapes, ModelEnums) {
    "use strict";
    /**
     * This class defined a UI graph control port view.
     * @private
     * @class UIGraphControlPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphControlPortView
     * @extends UIControlPortView
     */
    class UIGraphControlPortView extends UIControlPortView {
        static { this.kPortWidth = 100; }
        static { this.kPortHeight = 20; }
        static { this.kPortLeftOffset = 20; }
        static { this.kPortWidthOffset = 5; }
        static { this._kPortTriangleHeight = 15; }
        static { this._kPortTriangleOffset = 1.5; }
        static { this._kPortRerouteHandlerWidth = 4; }
        static { this._kPortRerouteHandlerHeight = 4; }
        /**
         * @public
         * @constructor
         * @param {UIGraphControlPort} port - The UI block port.
         */
        constructor(port) {
            super(port);
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
         * Updates the port name.
         * @public
         * @param {string} name - The port name.
         */
        updatePortName(name) {
            this._computePortWidth(name);
            this._port.getDisplay().internalUpdate();
        }
        /**
         * Checks if the given element is part of the graph port's handler.
         * @public
         * @param {Element} element - The graph port element.
         * @returns {boolean} true if the element is part of the graph port's handler else false.
         */
        // eslint-disable-next-line class-methods-use-this
        isHandler(element) {
            return element !== undefined && UIDom.hasClassName(element, 'sch-graph-port-handler');
        }
        /**
         * Gets the graph control port handler svg element.
         * @public
         * @returns {SVGElement} The graph control port handler.
         */
        getHandler() {
            return this._handler;
        }
        /**
         * Gets the graph control port triangle svg element.
         * @public
         * @returns {SVGElement} The graph control port triangle svg element.
         */
        getTriangle() {
            return this._triangle;
        }
        /**
         * Gets the port bounding box.
         * @public
         * @override
         * @returns {IDOMRect} The port bounding box.
         */
        getBoundingBox() {
            return this._background.getBoundingClientRect();
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
            this._background = undefined;
            this._title = undefined;
            this._triangle = undefined;
            this._handler = undefined;
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
            UIDom.addClassName(this.structure.root, 'sch-graph-port');
            const isInputPort = this._port.getModel().getType() === ModelEnums.EControlPortType.eInput;
            UIDom.addClassName(this._element, isInputPort ? 'sch-input-control-port' : 'sch-output-control-port');
            this._createBackground();
            this._createTitle();
            this._createTriangle();
            this._createHandler();
            this._computePortWidth(this._port.getModel().getName());
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
            const graph = this._port.getParent();
            const topLimit = graph.getPaddingTop();
            const bottomLimit = graph.getHeight() - graph.getPaddingBottom() - UIGraphControlPortView.kPortHeight;
            if (connector.offset < topLimit) {
                graph.updateSizeFromControlPorts();
                this._port.setOffset(topLimit);
            }
            else if (connector.offset > bottomLimit) {
                graph.updateSizeFromControlPorts();
            }
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
            // Force update to refresh border constraint after port dimension be correctly computed.
            this._port.getDisplay().internalUpdate();
        }
        /**
         * Creates the port background.
         * @protected
         */
        _createBackground() {
            this._background = UIDom.createSVGRect({
                className: 'background',
                parent: this._element,
                attributes: {
                    x: 0, y: 0, rx: 2, ry: 2,
                    width: UIGraphControlPortView.kPortWidth,
                    height: UIGraphControlPortView.kPortHeight
                }
            });
        }
        /**
         * Create the port title.
         * @protected
         */
        _createTitle() {
            this._title = UIDom.createSVGText({
                className: 'title',
                attributes: { dy: 4.2 },
                parent: this._element
            });
        }
        /**
         * Creates the port triangle.
         * @protected
         */
        _createTriangle() {
            this._triangle = UIDom.createSVGPolygon({
                className: 'sch-graph-port-triangle',
                parent: this._element,
                attributes: { points: UIShapes.controlPortPolygonPoints }
            });
        }
        /**
         * Creates the port handler.
         * @protected
         */
        _createHandler() {
            this._handler = UIDom.createSVGRect({
                className: 'sch-graph-port-handler',
                parent: this._element,
                attributes: {
                    x: 0, y: 0,
                    width: UIGraphControlPortView.kPortWidth,
                    height: UIGraphControlPortView.kPortHeight
                }
            });
        }
        /**
         * Computes the port background.
         * @protected
         */
        _computeBackground() {
            const parentClassNames = ['sch-graph-port', 'sch-input-control-port'];
            const titleBBox = UIDom.renderedSVGBBox(this._title, parentClassNames); // Compute offscreen SVG bounding boxes
            const bgWidth = titleBBox.width + UIGraphControlPortView._kPortTriangleHeight + UIGraphControlPortView._kPortTriangleOffset + 2 * UIGraphControlPortView.kPortWidthOffset;
            this._background.setAttribute('width', String(bgWidth));
        }
        /**
         * Computes the port title.
         * @private
         */
        _computeTitle() {
            const titleLeft = this._port.isStartPort() ? UIGraphControlPortView.kPortWidthOffset : UIGraphControlPortView.kPortLeftOffset + UIGraphControlPortView.kPortWidthOffset;
            const titleTop = UIGraphControlPortView.kPortHeight / 2;
            this._title.setAttribute('x', String(titleLeft));
            this._title.setAttribute('y', String(titleTop));
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
         * Computes the port triangle.
         * @private
         */
        _computeTriangle() {
            const bgWidth = parseFloat(this._background.getAttribute('width') || '');
            const triangleHeight = UIGraphControlPortView._kPortTriangleHeight;
            const triangleOffset = UIGraphControlPortView._kPortTriangleOffset;
            const triangleLeft = this._port.isStartPort() ? bgWidth - triangleOffset : triangleOffset + triangleHeight;
            const triangleTop = (UIGraphControlPortView.kPortHeight / 2);
            this._triangle.setAttribute('transform', 'translate(' + triangleLeft + ' ' + triangleTop + ') rotate(180)');
        }
        /**
         * Computes the port handler.
         * @private
         */
        _computeHandler() {
            const bgWidth = parseFloat(this._background.getAttribute('width') || '');
            const width = bgWidth - UIGraphControlPortView.kPortLeftOffset;
            const left = this._port.isStartPort() ? 0 : UIGraphControlPortView.kPortLeftOffset;
            this._handler.setAttribute('width', String(width));
            this._handler.setAttribute('x', String(left));
        }
        /**
         * Computes the port reroute handler.
         * @private
         */
        _computeRerouteHandler() {
            const bgWidth = parseFloat(this._background.getAttribute('width') || '');
            const left = this._port.isStartPort() ? bgWidth - UIGraphControlPortView._kPortRerouteHandlerWidth / 2 : -UIGraphControlPortView._kPortRerouteHandlerWidth / 2;
            const top = UIGraphControlPortView.kPortHeight / 2 - UIGraphControlPortView._kPortRerouteHandlerHeight / 2;
            this._setRerouteHandlerPosition(left, top);
        }
        /**
         * Computes the width of the port.
         * @private
         * @param {string} name - The port name.
         */
        _computePortWidth(name) {
            this._updateTitle(name);
            this._computeBackground();
            this._computeTitle();
            this._computeTriangle();
            this._computeHandler();
            this._computeRerouteHandler();
        }
        /**
         * Updates the port title.
         * @private
         * @param {string} name - The port name.
         */
        _updateTitle(name) {
            this._title.textContent = name;
        }
    }
    return UIGraphControlPortView;
});
