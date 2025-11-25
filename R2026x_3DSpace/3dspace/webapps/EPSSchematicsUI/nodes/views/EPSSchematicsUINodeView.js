/* eslint-disable class-methods-use-this */
/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, EGraphViews, UIDom) {
    "use strict";
    /**
     * This class defines the UI node view.
     * @private
     * @class UINodeView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView
     * @extends EGraphViews.HTMLNodeView
     */
    class UINodeView extends EGraphViews.HTMLNodeView {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * Gets the node HTML element.
         * @public
         * @returns {IHTMLElement} The node HTML element.
         */
        getElement() {
            return this._element;
        }
        /**
         * Gets the node bounding box.
         * @public
         * @returns {IDOMRect} The node bounding box.
         */
        getBoundingBox() {
            return this._element.getBoundingClientRect();
        }
        /**
         * Checks if the provided element is a node draggable element.
         * @public
         * @param {Element} element - The element to check.
         * @returns {boolean} True if the provided element is a node draggable element else false.
         */
        isNodeDraggableElement(element) {
            return UIDom.hasClassName(element, 'sch-node-draggable');
        }
        /**
         * Destroys the view of the element.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view that called this callback.
         */
        ondestroy(elt, grView) {
            super.ondestroy(elt, grView);
        }
        /**
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._element = undefined;
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Builds the node HTML element.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Node} node - The graph node.
         * @returns {HTMLDivElement} The node HTML element.
         */
        buildNodeElement(node) {
            super.buildNodeElement(node);
            this._element = UIDom.createElement('div');
            return this._element;
        }
        /**
         * The callback on the node display modification.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.PathSetTrie} changes - Changes set of paths of modified properties.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        onmodifyDisplay(elt, changes, grView) {
            super.onmodifyDisplay(elt, changes, grView);
        }
        /**
         * The callback on the node insert event.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.PathSetTrie} changes - Changes set of paths of modified properties.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         * @param {module:DS/egraph/core.GraphView} nextWithView - The view of the next.
         */
        oninsert(elt, changes, grView, nextWithView) {
            super.oninsert(elt, changes, grView, nextWithView);
        }
    }
    return UINodeView;
});
