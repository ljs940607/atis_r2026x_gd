/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIFadeOutDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIFadeOutDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBaseDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UIBaseDialog, UIDom) {
    "use strict";
    /**
     * This class defines a UI fade out dialog.
     * @private
     * @abstract
     * @class UIFadeOutDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIFadeOutDialog
     * @extends UIBaseDialog
     */
    class UIFadeOutDialog extends UIBaseDialog {
        /**
         * @public
         * @constructor
         * @param {IWUXDialogOptions} options - The dialog options.
         */
        constructor(options) {
            super(options);
            this._isPinned = false;
            this._onMousedownCB = this._onMousedown.bind(this);
            this._onMousemoveCB = this._onMousemove.bind(this);
            this._kOpacityMinDistance = 30;
            this._kOpacityMaxDistance = 100;
        }
        /**
         * Removes the dialog.
         * @public
         * @override
         */
        remove() {
            super.remove();
            this._onMousedownCB = undefined;
            this._onMousemoveCB = undefined;
        }
        /**
         * Sets the mouse position to place the dialog.
         * @public
         * @param {IDomPosition} position - The mouse position.
         */
        setMousePosition(position) {
            this._mousePosition = position;
        }
        /**
         * The callback on the dialog close event.
         * @protected
         * @override
         */
        _onClose() {
            document.removeEventListener('mousedown', this._onMousedownCB);
            document.removeEventListener('mousemove', this._onMousemoveCB);
            this._mousePosition = undefined;
            this._isPinned = false;
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            const dialogBBox = this._dialog.getContent().getBoundingClientRect();
            const immersiveFrameBBox = this._dialog.immersiveFrame.getContent().getBoundingClientRect();
            const dialogPosition = {
                my: 'top left',
                at: 'top left',
                offsetX: this._mousePosition.left - dialogBBox.width / 2,
                offsetY: this._mousePosition.top - dialogBBox.height - immersiveFrameBBox.y + 5
            };
            this._dialog.position = dialogPosition;
            document.addEventListener('mousedown', this._onMousedownCB);
            document.addEventListener('mousemove', this._onMousemoveCB);
            // Add a pin button to allow the user to pin the dialog and prevent it from closing!
            const titleBar = this._dialog.getTitleBar();
            const buttonContainer = titleBar.querySelector('.wux-windows-window-header-buttons-div');
            if (buttonContainer) {
                const pinButton = UIDom.createElement('button', {
                    className: ['wux-windows-window-header-button', 'wux-ui-3ds', 'wux-ui-3ds-pin']
                });
                buttonContainer.insertBefore(pinButton, buttonContainer.firstChild);
                pinButton.addEventListener('click', event => {
                    this._isPinned = !this._isPinned;
                    UIDom.toggleClassName(pinButton, ['wux-ui-3ds-pin', 'wux-ui-3ds-pin-off']);
                    event.stopPropagation();
                });
            }
        }
        /**
         * Fades the dialog according to the mouse position.
         * @private
         * @param {number} mouseLeft - The left position of the mouse.
         * @param {number} mouseTop - The top position of the mouse.
         */
        _fadeWithDistance(mouseLeft, mouseTop) {
            const dialogContent = this._dialog.getContent();
            const distance = UIDom.computeDistanceFromMouse(dialogContent, mouseLeft, mouseTop);
            if (distance >= 0 && distance <= this._kOpacityMinDistance) {
                dialogContent.style.opacity = String(1);
            }
            else if (distance > this._kOpacityMinDistance && distance < this._kOpacityMaxDistance) {
                dialogContent.style.opacity = String(1 - (distance / this._kOpacityMaxDistance));
            }
            else {
                this.close();
            }
        }
        /**
         * The callback on the mousedown event.
         * @private
         * @param {MouseEvent} event - The mousedown event.
         */
        _onMousedown(event) {
            if (!this._isPinned) {
                const dialogContent = this._dialog.getContent();
                let clickOnDialog = false;
                let clickedElt = event.target;
                while (clickedElt) {
                    if (clickedElt === dialogContent) {
                        clickOnDialog = true;
                        break;
                    }
                    clickedElt = clickedElt.parentElement;
                }
                if (!clickOnDialog) {
                    this.close();
                }
            }
        }
        /**
         * The callback on the mouse move event.
         * @private
         * @param {MouseEvent} event - The mouse move event.
         */
        _onMousemove(event) {
            if (!this._isPinned) {
                this._fadeWithDistance(event.clientX, event.clientY);
            }
        }
    }
    return UIFadeOutDialog;
});
