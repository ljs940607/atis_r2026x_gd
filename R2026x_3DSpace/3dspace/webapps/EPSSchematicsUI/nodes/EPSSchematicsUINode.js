/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUINode'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView"], function (require, exports, EGraphCore, UINodeView) {
    "use strict";
    /**
     * This class define the UI Egraph base node element.
     * @private
     * @abstract
     * @class UINode
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUINode
     */
    class UINode {
        /**
         * @public
         * @constructor
         * @param {INodeOptions} options - The parent graph.
         */
        constructor(options) {
            this._graph = options.graph;
            this._isDraggable = options.isDraggable || false;
            this._minHeight = 0;
            this._minWidth = 0;
            this._createDisplay();
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
         * Removes the node from its parent graph.
         * @public
         */
        remove() {
            if (this._display.getParent() === this._graph.getDisplay()) {
                this._graph.getDisplay().removeNode(this._display);
            }
            else if (this._display.getParent() === this._graph.getViewer()?.getDisplay()) {
                this._graph.getViewer().getDisplay().removeNode(this._display);
            }
            this._display = undefined;
            this._graph = undefined;
        }
        /**
         * Gets the node display.
         * @public
         * @returns {Node} The node display.
         */
        getDisplay() {
            return this._display;
        }
        /**
         * Adds the node to the graph.
         * @public
         */
        addNodeToGraph() {
            this._graph.getDisplay().addNode(this._display);
        }
        /**
         * Adds the node to the graph viewer.
         * @public
         */
        addNodeToViewer() {
            this._graph.getViewer().getDisplay().addNode(this._display);
        }
        /**
         * Gets the main view if the node.
         * @public
         * @returns {UINodeView} The main view of the node.
         */
        getView() {
            return this._display.views.main;
        }
        /**
         * Sets the main view of the node.
         * @public
         * @param {UINodeView} view - The main view of the node.
         */
        setView(view) {
            if (view !== undefined && view instanceof UINodeView) {
                this._display.views.main = view;
            }
        }
        /**
         * Gets the node's actual left position.
         * @public
         * @returns {number} The node's actual left position.
         */
        getActualLeft() {
            return this._display.actualLeft;
        }
        /**
         * Gets the node's left position.
         * @public
         * @returns {number} The node's left position.
         */
        getLeft() {
            return this._display.left;
        }
        /**
         * Sets the node's left position.
         * @public
         * @param {number} left - The node's left position.
         */
        setLeft(left) {
            this._display.set('left', left);
        }
        /**
         * Gets the node's actual top position.
         * @public
         * @returns {number} The node's actual top position.
         */
        getActualTop() {
            return this._display.actualTop;
        }
        /**
         * Gets the node's top position.
         * @public
         * @returns {number} The node's top position.
         */
        getTop() {
            return this._display.top;
        }
        /**
         * Sets the node's top position.
         * @public
         * @param {number} top - The node's top position.
         */
        setTop(top) {
            this._display.set('top', top);
        }
        /**
         * Gets the node's position relative to its parent graph.
         * @public
         * @returns {IDomPosition} The left and top position of the node.
         */
        getPosition() {
            return { left: this._display.left, top: this._display.top };
        }
        /**
         * Sets the node's position relative to its parent graph.
         * @public
         * @param {number} left - The left position of the node.
         * @param {number} top - The top position of the node.
         */
        setPosition(left, top) {
            this._display.multiset('left', left, 'top', top);
        }
        /**
         * Gets the node's height.
         * @public
         * @returns {number} The node's height.
         */
        getHeight() {
            return this._display.height;
        }
        /**
         * Sets the node's height.
         * @public
         * @param {number} height - The node's height.
         */
        setHeight(height) {
            this._display.set('height', height);
        }
        /**
         * Gets the node's width.
         * @public
         * @returns {number} The node's width.
         */
        getWidth() {
            return this._display.width;
        }
        /**
         * Sets the node's width.
         * @public
         * @param {number} width - The node's width.
         */
        setWidth(width) {
            this._display.set('width', width);
        }
        /**
         * Gets the node's width and height dimension.
         * @public
         * @returns {IDomDimension} The width and height dimension of the node.
         */
        getDimension() {
            return { width: this._display.width, height: this._display.height };
        }
        /**
         * Sets the node's width and height dimension.
         * @public
         * @param {number} width - The node's width.
         * @param {number} height - The node's height.
         */
        setDimension(width, height) {
            this._display.multiset('width', width, 'height', height);
        }
        /**
         * Sets the minimum width and height of the node.
         * @public
         * @param {number} minWidth - The minimum node's width.
         * @param {number} minHeight - The minimum node's height.
         */
        setMinDimension(minWidth, minHeight) {
            this._minWidth = minWidth;
            this._minHeight = minHeight;
        }
        /**
         * Gets the minimum height of the node.
         * @public
         * @returns {number} The minimum node's height.
         */
        getMinHeight() {
            return this._minHeight;
        }
        /**
         * Gets the minimum width of the node.
         * @public
         * @returns {number} The minimum node's width.
         */
        getMinWidth() {
            return this._minWidth;
        }
        /**
         * Appends the provided connector to the node.
         * @public
         * @param {UIConnector} connector - The connector to append.
         */
        appendConnector(connector) {
            if (connector && connector.getDisplay()) {
                this._display.appendConnector(connector.getDisplay());
            }
        }
        /**
         * Checks if the node is selected.
         * @public
         * @returns {boolean} True if the node is selected else false.
         */
        isSelected() {
            return this._graph.getViewer().isSelected(this._display);
        }
        /**
         * Checks if the node is draggable.
         * @public
         * @returns {boolean} True if the node is draggable else false.
         */
        isDraggable() {
            return this._isDraggable;
        }
        /**
         * Checks if the node is selectable.
         * @public
         * @returns {boolean} True if the node is selectable else false.
         */
        // eslint-disable-next-line class-methods-use-this
        isSelectable() {
            return true;
        }
        /**
         * Gets the graph editor immersive frame.
         * @public
         * @returns {ImmersiveFrame} The graph editor immersive frame.
         */
        getImmersiveFrame() {
            return this._graph.getViewer().getEditor().getImmersiveFrame();
        }
        /**
         * Gets the graph.
         * @public
         * @returns {UIGraph} The graph.
         */
        getGraph() {
            return this._graph;
        }
        /**
         * Gets the main node html element.
         * @public
         * @returns {HTMLElement} The html element that represents the node.
         */
        getElement() {
            return this.getView().getElement();
        }
        /**
         * Gets the list of available commands.
         * @public
         * @returns {UICommand[]} The list of available commands.
         */
        // eslint-disable-next-line class-methods-use-this
        getCommands() { return []; }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Creates the node display.
         * @private
         */
        _createDisplay() {
            this._display = new EGraphCore.Node();
            this._display.data = { uiElement: this };
        }
    }
    return UINode;
});
