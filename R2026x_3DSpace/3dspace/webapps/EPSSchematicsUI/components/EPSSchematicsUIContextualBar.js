/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIContextualBar'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIContextualBar", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUIFadeOutContainer", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/components/EPSSchematicsUICommandButton", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIContextualBar"], function (require, exports, UIFadeOutContainer, UIDom, UICommandButton) {
    "use strict";
    /**
     * This class defines a UI contextual bar.
     * @private
     * @class UIContextualBar
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIContextualBar
     * @extends UIFadeOutContainer
     */
    class UIContextualBar extends UIFadeOutContainer {
        /**
         * @public
         * @constructor
         * @param {UIViewer} viewer - The graph viewer.
         * @param {UIContextualBarController} controller - The contextual bar controller.
         * @param {UICommand[]} commands - The list of commands.
         */
        constructor(viewer, controller, commands) {
            super(viewer.getContainer());
            this._buttons = [];
            this._isRemoving = false;
            this._controller = controller;
            this._commands = commands;
            this._createElement();
        }
        /**
         * Removes the container.
         * @public
         * @override
         */
        remove() {
            if (!this._isRemoving) {
                this._isRemoving = true;
                this._controller.clearContextualBar();
                this._buttons.forEach(button => button.remove());
                this._controller = undefined;
                this._commands = undefined;
                this._buttons = undefined;
                super.remove();
            }
        }
        /**
         * Sets the position of the contextual bar.
         * @public
         * @override
         * @param {number} mouseLeft - The left position of the mouse.
         * @param {number} mouseTop - The top position of the mouse.
         */
        setPosition(mouseLeft, mouseTop) {
            if (this._parent) {
                const parentBBox = this._parent.getBoundingClientRect();
                const elementBBox = this._element.getBoundingClientRect();
                let left = mouseLeft - parentBBox.left + UIFadeOutContainer._kOffsetLeft;
                left = left + elementBBox.width > parentBBox.width ? parentBBox.width - elementBBox.width : left;
                let top = mouseTop - parentBBox.top - elementBBox.height - UIFadeOutContainer._kOffsetTop;
                top = top < 0 ? 0 : top;
                super.setPosition(left, top);
            }
        }
        /**
         * Creates the element.
         * @protected
         * @override
         */
        _createElement() {
            super._createElement();
            UIDom.addClassName(this._element, 'sch-contextual-bar');
            this._commands.forEach(command => {
                const button = new UICommandButton({
                    command: command,
                    parent: this._element,
                    callback: this._controller.clearCommands.bind(this._controller)
                });
                this._buttons.push(button);
            });
        }
        /**
         * Gets the list of buttons.
         * @private
         * @ignore
         * @returns {UICommandButton[]} The list of buttons.
         */
        _getButtons() {
            return this._buttons;
        }
    }
    return UIContextualBar;
});
