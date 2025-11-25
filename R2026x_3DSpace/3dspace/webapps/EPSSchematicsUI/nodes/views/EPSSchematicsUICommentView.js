/// <amd-module name='DS/EPSSchematicsUI/nodes/views/EPSSchematicsUICommentView'/>
define("DS/EPSSchematicsUI/nodes/views/EPSSchematicsUICommentView", ["require", "exports", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIResizableRectNodeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "css!DS/EPSSchematicsUI/css/nodes/EPSSchematicsUIComment"], function (require, exports, UIResizableRectNodeView, UIDom, UIKeyboard) {
    "use strict";
    /**
     * This class defines a UI comment view.
     * @private
     * @class UICommentView
     * @alias module:DS/EPSSchematicsUI/nodes/views/EPSSchematicsUICommentView
     * @extends UINodeView
     */
    class UICommentView extends UIResizableRectNodeView {
        /**
         * @public
         * @constructor
         * @param {UIComment} comment - The UI comment.
         */
        constructor(comment) {
            super();
            this._isEscapeKeyPressed = false;
            this._onTextContentDblclickCB = this.onTextContentDblclick.bind(this);
            this._onInputTextContentBlurCB = this._onInputTextContentBlur.bind(this);
            this._onInputTextContentKeydownCB = this._onInputTextContentKeydown.bind(this);
            this._comment = comment;
        }
        /**
         * Removes the customized default view of the node.
         * @protected
         * @override
         * @param {module:DS/egraph/core.Element} elt - The element using this view.
         * @param {module:DS/egraph/core.GraphView} grView - The graph view.
         */
        ondestroyDisplay(elt, grView) {
            this._comment = undefined;
            this._containerElt = undefined;
            this._textContentElt = undefined;
            this._inputTextContentElt = undefined;
            this._isEscapeKeyPressed = undefined;
            this._onTextContentDblclickCB = undefined;
            this._onInputTextContentBlurCB = undefined;
            this._onInputTextContentKeydownCB = undefined;
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
            UIDom.addClassName(this._element, ['sch-node-comment', 'sch-node-draggable']);
            this._containerElt = UIDom.createElement('div', {
                className: ['sch-node-comment-container', 'sch-node-draggable'],
                parent: this._element,
                insertBefore: this._borderContainer
            });
            this._textContentElt = UIDom.createElement('div', {
                className: ['sch-node-comment-textcontent', 'sch-node-draggable'],
                parent: this._containerElt,
                textContent: this._comment.getTextContent()
            });
            this._textContentElt.addEventListener('dblclick', this._onTextContentDblclickCB);
            this._element.dsModel = this._comment;
            return this._element;
        }
        /**
         * The callback on the text content double click event.
         * @public
         */
        onTextContentDblclick() {
            const isReadOnly = this._comment.getGraph().getViewer().isReadOnly();
            if (!isReadOnly) {
                this._createInputTextContentElement();
            }
        }
        /**
         * Gets the input text content element.
         * @public
         * @returns {HTMLTextAreaElement|undefined} The input text content element.
         */
        getInputTextContentElement() {
            return this._inputTextContentElt;
        }
        /**
         * The callback on the input text content blur event.
         * @private
         * @param {FocusEvent} event - The input text content blur event.
         */
        _onInputTextContentBlur(event) {
            if (!this._isEscapeKeyPressed && this._inputTextContentElt) {
                this._comment.setTextContent(this._inputTextContentElt.value);
            }
            this._removeInputTextContentElement();
            event.stopPropagation();
            this._comment.getGraph().getEditor().getHistoryController().registerEditAction(this._comment);
        }
        /**
         * The callback on the input text content keydown event.
         * @private
         * @param {KeyboardEvent} event - The input text content keydown event.
         */
        _onInputTextContentKeydown(event) {
            if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEscape)) {
                this._isEscapeKeyPressed = true;
                this._inputTextContentElt?.blur();
            }
            event.stopPropagation();
        }
        /**
         * Creates the input text content element.
         * @private
         */
        _createInputTextContentElement() {
            if (this._inputTextContentElt === undefined) {
                this._textContentElt.textContent = '';
                this._inputTextContentElt = UIDom.createElement('textarea', {
                    className: 'sch-node-comment-textcontent-input',
                    parent: this._textContentElt,
                    attributes: { spellcheck: true }
                });
                this._inputTextContentElt.value = this._comment.getTextContent();
                this._inputTextContentElt.focus();
                this._inputTextContentElt.select();
                this._inputTextContentElt.addEventListener('blur', this._onInputTextContentBlurCB);
                this._inputTextContentElt.addEventListener('keydown', this._onInputTextContentKeydownCB);
                this._inputTextContentElt.addEventListener('mousedown', (e) => e.stopPropagation());
                this._inputTextContentElt.addEventListener('wheel', (e) => e.stopPropagation());
            }
        }
        /**
         * Removes the input text content element.
         * @private
         */
        _removeInputTextContentElement() {
            if (this._inputTextContentElt !== undefined) {
                this._inputTextContentElt.removeEventListener('blur', this._onInputTextContentBlurCB);
                this._inputTextContentElt.removeEventListener('keydown', this._onInputTextContentKeydownCB);
                if (this._inputTextContentElt.parentElement) {
                    this._inputTextContentElt.parentElement.removeChild(this._inputTextContentElt);
                }
                this._textContentElt.textContent = this._comment.getTextContent();
                this._inputTextContentElt = undefined;
                this._isEscapeKeyPressed = false;
            }
        }
    }
    return UICommentView;
});
