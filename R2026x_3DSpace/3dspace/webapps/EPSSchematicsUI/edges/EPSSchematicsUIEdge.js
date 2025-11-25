/// <amd-module name='DS/EPSSchematicsUI/edges/EPSSchematicsUIEdge'/>
define("DS/EPSSchematicsUI/edges/EPSSchematicsUIEdge", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, EGraphCore) {
    "use strict";
    /**
     * This class define the UI Egraph base edge element.
     * @private
     * @abstract
     * @class UIEdge
     * @alias module:DS/EPSSchematicsUI/edges/EPSSchematicsUIEdge
     */
    class UIEdge {
        /**
         * @public
         * @constructor
         */
        constructor() {
            this.createDisplay();
        }
        /**
         * Removes the edge.
         * @public
         */
        remove() {
            this._display.remove();
            this._display = undefined;
        }
        /**
         * Creates the edge display.
         * @private
         */
        createDisplay() {
            this._display = new EGraphCore.Edge();
            this._display.data = { uiElement: this };
        }
        /**
         * Gets the edge display.
         * @public
         * @returns {EgraphCore.Edge} The edge display.
         */
        getDisplay() {
            return this._display;
        }
        /**
         * Gets the edge view.
         * @public
         * @returns {EGraphViews.SVGEdgeView} The edge view.
         */
        getView() {
            return this._display.views.main;
        }
        /**
         * Sets the edge view.
         * @public
         * @param {EGraphViews.SVGEdgeView} view - The edge view.
         */
        setView(view) {
            this._display.views.main = view;
        }
        /**
         * Checks if the edge is selected.
         * @public
         * @returns {boolean} True if the edge is selected else false.
         */
        isSelected() {
            return this._display.selected;
        }
    }
    return UIEdge;
});
