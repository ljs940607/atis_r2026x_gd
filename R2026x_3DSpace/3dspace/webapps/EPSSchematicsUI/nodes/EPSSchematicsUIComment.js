/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIComment'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIComment", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUICommentView", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType"], function (require, exports, UINode, UICommentView, UICommand, UICommandType) {
    "use strict";
    /**
     * This class defines a UI comment.
     * @private
     * @class UIComment
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIComment
     * @extends UINode
     */
    class UIComment extends UINode {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The parent graph.
         * @param {number} left - The left position.
         * @param {number} top - The top position.
         */
        constructor(graph, left, top) {
            super({ graph: graph, isDraggable: true });
            this.setView(new UICommentView(this));
            this.setDimension(200, 100);
            this.setMinDimension(200, 80);
            this.setPosition(left, top);
            this._textContent = 'This is a comment!';
        }
        /**
         * Removes the node from its parent graph.
         * @public
         * @override
         */
        remove() {
            this._textContent = undefined;
            super.remove();
        }
        /**
         * Gets the main view of the node.
         * @public
         * @override
         * @returns {UICommentView} The main view of the node.
         */
        getView() {
            return super.getView();
        }
        /**
         * Projects the specified JSON object to the comment.
         * @public
         * @param {IJSONCommentUI} iJSONComment - The JSON projected comment.
         */
        fromJSON(iJSONComment) {
            if (iJSONComment) {
                if (iJSONComment.left !== undefined && iJSONComment.top !== undefined) {
                    this.setPosition(iJSONComment.left, iJSONComment.top);
                }
                if (iJSONComment.width !== undefined && iJSONComment.height !== undefined) {
                    this.setDimension(iJSONComment.width, iJSONComment.height);
                }
                if (iJSONComment.textContent !== undefined) {
                    this._textContent = iJSONComment.textContent;
                }
            }
        }
        /**
         * Projects the comment to the specified JSON object.
         * @public
         * @param {IJSONCommentUI} oJSONComment - The JSON projected comment.
         */
        toJSON(oJSONComment) {
            if (oJSONComment !== undefined) {
                oJSONComment.top = this.getActualTop();
                oJSONComment.left = this.getActualLeft();
                oJSONComment.width = this.getWidth();
                oJSONComment.height = this.getHeight();
                oJSONComment.textContent = this._textContent;
            }
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            const commands = [];
            const isReadOnly = this._graph.getViewer().isReadOnly();
            if (!isReadOnly) {
                const commentView = this.getView();
                commands.push(new UICommand(UICommandType.eEdit, commentView.onTextContentDblclick.bind(commentView)));
                const viewer = this._graph.getViewer();
                commands.push(new UICommand(UICommandType.eRemove, viewer.deleteSelection.bind(viewer)));
            }
            return commands;
        }
        /**
         * Gets the text content of the comment.
         * @public
         * @returns {string} The text content of the comment.
         */
        getTextContent() {
            return this._textContent;
        }
        /**
         * Sets the text content of the comment.
         * @public
         * @param {string} textContent - The text content of the comment.
         */
        setTextContent(textContent) {
            this._textContent = textContent;
            this._graph.onUIChange();
        }
    }
    return UIComment;
});
