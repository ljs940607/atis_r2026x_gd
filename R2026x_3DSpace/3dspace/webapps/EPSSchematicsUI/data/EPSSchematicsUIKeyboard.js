/// <amd-module name='DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard'/>
define("DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", ["require", "exports", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUIKeyboard.json"], function (require, exports, UIKeyboardJSON) {
    "use strict";
    const JSONKeyboard = JSON.parse(UIKeyboardJSON);
    /**
     * The class defines the UI keyboard.
     * @class UIKeyboard
     * @alias module:DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard
     * @private
     */
    class UIKeyboard {
        static { this.eBackspace = new UIKeyboard(JSONKeyboard.eBackspace); }
        static { this.eEnter = new UIKeyboard(JSONKeyboard.eEnter); }
        static { this.eControl = new UIKeyboard(JSONKeyboard.eControl); }
        static { this.eEscape = new UIKeyboard(JSONKeyboard.eEscape); }
        static { this.eSpace = new UIKeyboard(JSONKeyboard.eSpace); }
        static { this.ePageUp = new UIKeyboard(JSONKeyboard.ePageUp); }
        static { this.ePageDown = new UIKeyboard(JSONKeyboard.ePageDown); }
        static { this.eEnd = new UIKeyboard(JSONKeyboard.eEnd); }
        static { this.eHome = new UIKeyboard(JSONKeyboard.eHome); }
        static { this.eArrowLeft = new UIKeyboard(JSONKeyboard.eArrowLeft); }
        static { this.eArrowUp = new UIKeyboard(JSONKeyboard.eArrowUp); }
        static { this.eArrowRight = new UIKeyboard(JSONKeyboard.eArrowRight); }
        static { this.eArrowDown = new UIKeyboard(JSONKeyboard.eArrowDown); }
        static { this.eDelete = new UIKeyboard(JSONKeyboard.eDelete); }
        static { this.eKeyC = new UIKeyboard(JSONKeyboard.eKeyC); }
        static { this.eKeyE = new UIKeyboard(JSONKeyboard.eKeyE); }
        static { this.eKeyF = new UIKeyboard(JSONKeyboard.eKeyF); }
        static { this.eKeyG = new UIKeyboard(JSONKeyboard.eKeyG); }
        static { this.eKeyK = new UIKeyboard(JSONKeyboard.eKeyK); }
        static { this.eKeyL = new UIKeyboard(JSONKeyboard.eKeyL); }
        static { this.eKeyO = new UIKeyboard(JSONKeyboard.eKeyO); }
        static { this.eKeyP = new UIKeyboard(JSONKeyboard.eKeyP); }
        static { this.eKeyS = new UIKeyboard(JSONKeyboard.eKeyS); }
        static { this.eKeyT = new UIKeyboard(JSONKeyboard.eKeyT); }
        static { this.eKeyY = new UIKeyboard(JSONKeyboard.eKeyY); }
        static { this.eKeyZ = new UIKeyboard(JSONKeyboard.eKeyZ); }
        static { this.eNumpad0 = new UIKeyboard(JSONKeyboard.eNumpad0); }
        static { this.eNumpad1 = new UIKeyboard(JSONKeyboard.eNumpad1); }
        static { this.eNumpad2 = new UIKeyboard(JSONKeyboard.eNumpad2); }
        static { this.eNumpad3 = new UIKeyboard(JSONKeyboard.eNumpad3); }
        static { this.eNumpad4 = new UIKeyboard(JSONKeyboard.eNumpad4); }
        static { this.eNumpad5 = new UIKeyboard(JSONKeyboard.eNumpad5); }
        static { this.eNumpad6 = new UIKeyboard(JSONKeyboard.eNumpad6); }
        static { this.eNumpad7 = new UIKeyboard(JSONKeyboard.eNumpad7); }
        static { this.eNumpad8 = new UIKeyboard(JSONKeyboard.eNumpad8); }
        static { this.eNumpad9 = new UIKeyboard(JSONKeyboard.eNumpad9); }
        static { this.eF8 = new UIKeyboard(JSONKeyboard.eF8); }
        static { this.eF9 = new UIKeyboard(JSONKeyboard.eF9); }
        static { this.eF10 = new UIKeyboard(JSONKeyboard.eF10); }
        static { this.eF11 = new UIKeyboard(JSONKeyboard.eF11); }
        /**
         * @constructor
         * @param {IKeyDefinition} key - The key definition.
         */
        constructor(key) {
            this._key = key;
        }
        /**
         * Gets the code of the key.
         * @public
         * @returns {string} The code of the key.
         */
        getCode() {
            return this._key.code;
        }
        /**
         * Gets the key code of the key.
         * @public
         * @returns {number} The key code of the key.
         */
        getKeyCode() {
            return this._key.keyCode;
        }
        /**
         * Checks if the key is pressed.
         * @private
         * @param {KeyboardEvent} event - The keyboard event.
         * @param {UIKeyboard} key - The key definition.
         * @returns {boolean} True if the key is pressed else false.
         */
        static isKeyPressed(event, key) {
            return event.code === key.getCode() || event.keyCode === key.getKeyCode();
        }
    }
    return UIKeyboard;
});
