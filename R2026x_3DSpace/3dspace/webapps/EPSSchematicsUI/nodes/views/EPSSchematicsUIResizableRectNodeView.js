/* eslint-disable class-methods-use-this */
/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIResizableRectNodeView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIResizableRectNodeView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIResizableRectNode"], function (require, exports, UINodeView, UIDom) {
    "use strict";
    /**
     * This class defines a UI resizable rectangular node view.
     * @private
     * @abstract
     * @class UIResizableRectNodeView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIResizableRectNodeView
     * @extends UINodeView
     */
    class UIResizableRectNodeView extends UINodeView {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * Checks if the provided element is a node border element.
         * @public
         * @param {Element} element - The element to check.
         * @returns {boolean} True if the provided element is a node border else false.
         */
        isNodeBorderElement(element) {
            return UIDom.hasClassName(element, 'sch-node-border');
        }
        /**
         * Gets the node borders.
         * @public
         * @returns {IDOMRectBorders} The node borders.
         */
        getNodeBorders() {
            return {
                topLeft: this._topLeftBorder,
                top: this._topBorder,
                topRight: this._topRightBorder,
                left: this._leftBorder,
                right: this._rightBorder,
                bottomLeft: this._bottomLeftBorder,
                bottom: this._bottomBorder,
                bottomRight: this._bottomRightBorder
            };
        }
        /**
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._borderContainer = undefined;
            this._topLeftBorder = undefined;
            this._topBorder = undefined;
            this._topRightBorder = undefined;
            this._leftBorder = undefined;
            this._centerBorder = undefined;
            this._rightBorder = undefined;
            this._bottomLeftBorder = undefined;
            this._bottomBorder = undefined;
            this._bottomRightBorder = undefined;
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
            this._topLeftBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-top-left'] });
            this._topBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-top'] });
            this._topRightBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-top-right'] });
            this._leftBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-left'] });
            this._centerBorder = UIDom.createElement('div', { className: ['sch-node-border-center'] });
            this._rightBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-right'] });
            this._bottomLeftBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-bottom-left'] });
            this._bottomBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-bottom'] });
            this._bottomRightBorder = UIDom.createElement('div', { className: ['sch-node-border', 'sch-node-border-bottom-right'] });
            this._borderContainer = UIDom.createElement('div', {
                className: 'sch-node-border-container',
                parent: this._element,
                children: [this._topLeftBorder, this._topBorder, this._topRightBorder,
                    this._leftBorder, this._centerBorder, this._rightBorder,
                    this._bottomLeftBorder, this._bottomBorder, this._bottomRightBorder]
            });
            return this._element;
        }
    }
    return UIResizableRectNodeView;
});
