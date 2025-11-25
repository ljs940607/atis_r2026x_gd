/// <amd-module name='DS/EPSSchematicsUI/edges/EPSSchematicsUILink'/>
define("DS/EPSSchematicsUI/edges/EPSSchematicsUILink", ["require", "exports", "DS/EPSSchematicsUI/edges/EPSSchematicsUIEdge", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType"], function (require, exports, UIEdge, UICommand, UICommandType) {
    "use strict";
    /**
     * This class defines a UI Link.
     * @private
     * @abstract
     * @class UILink
     * @alias module:DS/EPSSchematicsUI/edges/EPSSchematicsUILink
     * @extends UIEdge
     */
    class UILink extends UIEdge {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The UI Graph that owns this link.
         * @param {DataLink|ControlLink} model - The data link or control link model.
         */
        constructor(graph, model) {
            super();
            this._onValidityChangeCB = this._onValidityChange.bind(this);
            this._graph = graph;
            this._model = model;
        }
        /**
         * Removes the link.
         * @public
         * @override
         */
        remove() {
            this._graph.getViewer().getContextualBarController().clearCommands();
            this._startPort.unhighlight();
            this._endPort.unhighlight();
            this._startPort.getView().hideRerouteHandler();
            this._endPort.getView().hideRerouteHandler();
            this._graph = undefined;
            this._model = undefined;
            this._startPort = undefined;
            this._endPort = undefined;
            this._onValidityChangeCB = undefined;
            super.remove();
        }
        /**
         * Gets the list of available commands.
         * @public
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            let commands = [];
            const viewer = this._graph.getViewer();
            const isReadOnly = viewer.isReadOnly();
            if (!isReadOnly) {
                commands.push(new UICommand(UICommandType.eRemove, viewer.deleteSelection.bind(viewer)));
            }
            return commands;
        }
        /**
         * Gets the link view.
         * @public
         * @override
         * @returns {UILinkView} The link view.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the parent graph of the link.
         * @public
         * @returns {UIGraph} The parent graph of the link.
         */
        getGraph() {
            return this._graph;
        }
        /**
         * Gets the parent graph of the link.
         * // TODO: Rename to getParent or getGraph ?
         * @public
         * @returns {UIGraph} The parent graph of the link.
         */
        getParentGraph() {
            return this._graph;
        }
        /**
         * Gets the SVG element representing the link.
         * @public
         * @returns {SVGElement} The SVG element representing the link.
         */
        getElement() {
            return this.getView().getElement();
        }
        /**
         * Gets the link SVG path.
         * @public
         * @returns {SVGPathElement} The link SVG path.
         */
        getPath() {
            return this.getView().getPath();
        }
        /**
         * The callback on the validity change event of a link.
         * @private
         */
        _onValidityChange() {
            this.getView().onValidityChange();
        }
    }
    return UILink;
});
