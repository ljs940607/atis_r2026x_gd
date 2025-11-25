/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIConnector'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIConnector", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIConnectorView"], function (require, exports, EGraphCore, UIConnectorView) {
    "use strict";
    /**
     * This class defines a UI connector.
     * @private
     * @abstract
     * @class UIConnector
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIConnector
     */
    class UIConnector {
        /**
         * @public
         * @constructor
         */
        constructor() {
            this._createDisplay();
            this._setView(this._createView());
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
         * Removes the connector.
         * @public
         */
        remove() {
            this._display.remove();
            this._display = undefined;
        }
        /**
         * Gets the connector display.
         * @public
         * @returns {EGraphCore.Connector} The connector display.
         */
        getDisplay() {
            return this._display;
        }
        /**
         * Gets the view of the connector.
         * @public
         * @returns {UIConnectorView} The view of the connector.
         */
        getView() {
            return this._display.views.main;
        }
        /**
         * Gets the offset of the connector.
         * @public
         * @returns {number} The offset of the connector.
         */
        getOffset() {
            return this._display.offset;
        }
        /**
         * Sets the offset of the connector.
         * @public
         * @param {number} offset - The offset of the connector.
         */
        setOffset(offset) {
            this._display.set('offset', offset);
        }
        /**
         * Gets the top position of the connector.
         * @public
         * @returns {number} The top position of the connector.
         */
        getTop() {
            return this._display.top;
        }
        /**
         * Gets the left position of the connector.
         * @public
         * @returns {number} left top position of the connector.
         */
        getLeft() {
            return this._display.left;
        }
        /**
         * Gets the SVG element representing the connector.
         * @public
         * @returns {SVGElement} The SVG element representing the connecor.
         */
        getElement() {
            return this.getView().getElement();
        }
        /**
         * Gets the bounding box of the connector.
         * @public
         * @param {IViewpoint} _vpt - The current graph viewpoint.
         * @returns {IDOMRect} The bounding box of the connector.
         */
        getBoundingBox(_vpt) {
            return this.getView().getBoundingBox();
        }
        /**
         * Sets the connector border constraint.
         * @protected
         * @param {IBorderConstraint} constraint - The connector border constraint.
         */
        _setBorderConstraint(constraint) {
            const parameters = [];
            for (let prop in constraint) {
                if (constraint.hasOwnProperty(prop)) {
                    parameters.push(prop === 'cstr' ? ['cstr'] : ['cstr', prop]);
                    parameters.push(constraint[prop]);
                }
            }
            if (parameters.length) {
                this._display.multiset.apply(this._display, parameters);
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
         * Creates the display of the connector.
         * @private
         */
        _createDisplay() {
            this._display = new EGraphCore.Connector();
            this._display.data = { uiElement: this };
        }
        /**
         * Sets the view of the connector.
         * @private
         * @param {UIConnectorView} view - The view of the connector.
         */
        _setView(view) {
            if (view !== undefined && view instanceof UIConnectorView) {
                this._display.views.main = view;
            }
        }
    }
    return UIConnector;
});
