/// <amd-module name='DS/EPSSchematicsUI/data/EPSSchematicsUICommand'/>
define("DS/EPSSchematicsUI/data/EPSSchematicsUICommand", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUINLSTools", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "css!DS/EPSSchematicsUI/css/data/EPSSchematicsUICommand"], function (require, exports, UINLSTools, UIKeyboard) {
    "use strict";
    /**
     * This class defines a UI command.
     * @class UICommand
     * @alias module:DS/EPSSchematicsUI/data/EPSSchematicsUICommand
     * @private
     */
    class UICommand {
        /**
         * @constructor
         * @param {UICommandType} commandType - The command type.
         * @param {Function} [callback] - The command callback.
         */
        constructor(commandType, callback) {
            this._commandType = commandType;
            this._callback = callback;
        }
        /**
         * Gets the command type.
         * @public
         * @returns {UICommandType} The command type.
         */
        getCommandType() {
            return this._commandType;
        }
        /**
         * Gets the command callback.
         * @public
         * @returns {TMouseEventCallback|undefined} The command callback.
         */
        getCallback() {
            return this._callback;
        }
        /**
         * Gets the command icon.
         * @public
         * @returns {ICommandTypeIconDefinition} The command icon.
         */
        getIcon() {
            return this._commandType.icon;
        }
        /**
         * Gets the command title.
         * @public
         * @returns {string} The command title.
         */
        getTitle() {
            let title = '';
            if (this._commandType.title) {
                title = UINLSTools.getNLSFromString(this._commandType.title) || this._commandType.title;
                if (this._commandType.shortcut) {
                    title += ' ' + this._buildShortcut();
                }
            }
            return title;
        }
        /**
         * Gets the command short help.
         * @public
         * @returns {string} The command short help.
         */
        getShortHelp() {
            let shortHelp = '';
            if (this._commandType.shortHelp !== undefined) {
                shortHelp = UINLSTools.getNLSFromString(this._commandType.shortHelp) || this._commandType.shortHelp;
                if (this._commandType.title === undefined && this._commandType.shortcut) {
                    shortHelp += ' ' + this._buildShortcut();
                }
            }
            return shortHelp;
        }
        /**
         * Builds the shortcut command.
         * @private
         * @returns {string} The shortcut command.
         */
        _buildShortcut() {
            let result = '';
            const shortcut = this._commandType.shortcut;
            if (shortcut !== undefined && (shortcut.key || shortcut.altKey || shortcut.ctrlKey || shortcut.shiftKey)) {
                let keys = shortcut.altKey ? 'Alt' : '';
                keys += shortcut.ctrlKey ? (keys.length ? '+' : '') + 'Ctrl' : '';
                keys += shortcut.shiftKey ? (keys.length ? '+' : '') + 'Shift' : '';
                const keyNames = shortcut.key;
                keys += shortcut.key ? (keys.length ? '+' : '') + UIKeyboard[keyNames].getCode() : '';
                result = '<span class="sch-tooltip-shortcut">' + keys + '</span>';
            }
            return result;
        }
    }
    return UICommand;
});
