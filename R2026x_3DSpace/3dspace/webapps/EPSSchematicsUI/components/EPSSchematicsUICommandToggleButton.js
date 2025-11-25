/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUICommandToggleButton'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUICommandToggleButton", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUICommandButton", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UICommandButton, UIDom) {
    "use strict";
    /**
     * This class defines a UI command toggle button.
     * @private
     * @class UICommandToggleButton
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUICommandToggleButton
     * @extends UICommandButton
     */
    class UICommandToggleButton extends UICommandButton {
        /**
         * @public
         * @constructor
         * @param {ICommandToggleButtonOptions} options - The command button options.
         */
        constructor(options) {
            super(options);
            this._toggleCB = options.toggleCB;
            this._checked = options.checked || false;
            this.setCheckedState(this._checked);
            UIDom.addClassName(this._buttonElt, 'sch-toggle-command-button');
            UIDom.createElement('div', { parent: this._buttonElt });
        }
        /**
         * Removes the command button.
         * @public
         * @override
         */
        remove() {
            this._toggleCB = undefined;
            this._checked = undefined;
            super.remove();
        }
        /**
         * Sets the checked state of the command toggle button.
         * @public
         * @param {boolean} checked - The checked state of the command toggle button.
         */
        setCheckedState(checked) {
            this._checked = checked;
            if (this._checked === true) {
                UIDom.addClassName(this._buttonElt, 'checked');
            }
            else {
                UIDom.removeClassName(this._buttonElt, 'checked');
            }
        }
        /**
         * Gets the checked state of the command toggle button.
         * @public
         * @returns {boolean} The checked state of the command toggle button.
         */
        getCheckedState() {
            return this._checked;
        }
        /**
         * The callback on the command button mouse click event.
         * @protected
         * @override
         * @param {MouseEvent} event - The command button click event.
         */
        _onClick(event) {
            this.setCheckedState(!this._checked);
            if (this._toggleCB !== undefined) {
                this._toggleCB(this._checked);
            }
            super._onClick(event);
        }
    }
    return UICommandToggleButton;
});
