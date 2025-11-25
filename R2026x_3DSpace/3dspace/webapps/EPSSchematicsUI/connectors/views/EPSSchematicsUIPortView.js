/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIConnectorView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIPort"], function (require, exports, UIConnectorView, UIDom) {
    "use strict";
    /**
     * This class defined a UI port view.
     * @private
     * @abstract
     * @class UIPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPortView
     * @extends UIConnectorView
     */
    class UIPortView extends UIConnectorView {
        /**
         * @public
         * @constructor
         * @param {UIPort} port - The UI port.
         */
        constructor(port) {
            super();
            this._port = port;
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
         * Handles the display of the port reroute handler.
         * @private
         */
        handleRerouteHandlerDisplay() {
            const links = this._port.getLinks();
            const isCtrlPressed = this._port.getEditor().getKeyboardController().isCtrlKeyPressed();
            if (this._isMouseOver() && isCtrlPressed && links.length > 0) {
                links.forEach(link => link.getView().highlight());
                this.showRerouteHandler();
            }
            else {
                let selected = false;
                links.forEach(link => {
                    link.getView().unhighlight();
                    selected = selected || link.isSelected();
                });
                if (!selected) {
                    this.hideRerouteHandler();
                }
            }
        }
        /**
         * Gets the reroute handler svg rect element.
         * @public
         * @returns {SVGRectElement} The reroute handler svg rect element.
         */
        getRerouteHandler() {
            return this._rerouteHandler;
        }
        /**
         * Shows the port reroute handler.
         * @private
         */
        showRerouteHandler() {
            const isReadOnly = this._port.getParentGraph().getViewer().isReadOnly();
            if (!isReadOnly) {
                this._element.appendChild(this._rerouteHandler);
                this._rerouteHandler.style.display = 'block';
            }
        }
        /**
         * Hides the port reroute handler.
         * @private
         */
        hideRerouteHandler() {
            this._rerouteHandler.style.display = 'none';
        }
        /**
         * Highlights the port.
         * @public
         */
        highlight() {
            UIDom.addClassName(this.structure.root, 'sch-port-highlight');
        }
        /**
         * Unhighlights the port.
         * @public
         */
        unhighlight() {
            UIDom.removeClassName(this.structure.root, 'sch-port-highlight');
        }
        /**
         * Checks if the provided target is part of the port view.
         * @public
         * @param {Element} target - The target element to check.
         * @returns {boolean} True if the target element is inside the port view else false.
         */
        isPartOfView(target) {
            let result = false;
            let parent = target;
            while (!result && parent !== undefined && parent !== null) {
                result = parent === this._element;
                parent = parent.parentElement;
            }
            return result;
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
            this._port = undefined;
            this._rerouteHandler = undefined;
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
            UIDom.addClassName(this.structure.root, 'sch-port');
            this._createRerouteHandler();
            this.hideRerouteHandler();
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
            this.handleRerouteHandlerDisplay();
        }
        /**
         * Sets the port reroute handler position.
         * It is mainly a IE11 fix which does not handle svg matrix modification in css!
         * @protected
         * @param {number} left - The left position.
         * @param {number} top - The top position.
         */
        _setRerouteHandlerPosition(left, top) {
            this._rerouteHandler.setAttribute('transform', 'translate(' + left + ' ' + top + ')');
        }
        /**
         * The callback on the connector mouse enter event.
         * @protected
         * @override
         * @param {MouseEvent} event - The mouse enter event.
         */
        _onMouseEnter(event) {
            super._onMouseEnter(event);
            const isCtrlPressed = event.ctrlKey;
            const displaySpeed = isCtrlPressed ? 0 /* UIEnums.ELabelDisplaySpeed.eDirect */ : 1 /* UIEnums.ELabelDisplaySpeed.eFast */;
            const labelController = this._port.getParentGraph().getViewer().getLabelController();
            labelController.displayPortLabel(this._port, displaySpeed);
            this.highlight();
            const grView = this._port.getParentGraph().getViewer().getView();
            this.onmodifyDisplay(this._port.getDisplay(), false, grView);
        }
        /**
         * The callback on the connector mouse leave event.
         * @protected
         * @override
         * @param {MouseEvent} event - The mouse leave event.
         */
        _onMouseLeave(event) {
            super._onMouseLeave(event);
            const isCtrlPressed = event.ctrlKey;
            const labelController = this._port.getParentGraph().getViewer().getLabelController();
            labelController.clearAllLabels(true);
            // Remove the port label while dragging a link
            if (event.buttons !== 0 || isCtrlPressed) {
                labelController.clearAllLabels();
            }
            this.unhighlight();
            const grView = this._port.getParentGraph().getViewer().getView();
            this.onmodifyDisplay(this._port.getDisplay(), false, grView);
        }
        /**
         * The callback on the connectore mouse up event.
         * @protected
         * @override
         * @param {MouseEvent} event - The mouse up event.
         */
        _onMouseUp(event) {
            super._onMouseUp(event);
            const labelController = this._port.getParentGraph().getViewer().getLabelController();
            labelController.clearAllLabels();
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
         * Creates the port reroute handler.
         * @private
         */
        _createRerouteHandler() {
            this._rerouteHandler = UIDom.createSVGRect({
                className: 'sch-reroute-handler',
                attributes: { x: 0, y: 0, width: 4, height: 4 },
                parent: this._element
            });
        }
    }
    return UIPortView;
});
