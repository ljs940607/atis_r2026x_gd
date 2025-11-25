/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIScriptFunctionBlock'/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("DS/EPSSchematicsCSI/EPSSchematicsCSIScriptFunctionBlock", ["require", "exports", "DS/EPSSchematicsCSI/EPSSchematicsCSIFunctionBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, CSIFunctionBlock, Enums) {
    "use strict";
    var CSIScriptFunctionBlock = /** @class */ (function (_super) {
        __extends(CSIScriptFunctionBlock, _super);
        /**
         * @constructor
         * @public
         */
        function CSIScriptFunctionBlock() {
            return _super.call(this) || this;
        }
        /**
         * Get script language.
         * @private
         * @return {EP.EScriptLanguage} The script language.
         */
        CSIScriptFunctionBlock.prototype.getScriptLanguage = function () {
            var scriptLanguage;
            var functionImplementationName = this.getFunctionImplementationName();
            if (functionImplementationName === 'ecmaScript') {
                scriptLanguage = Enums.EScriptLanguage.eJavaScript;
            }
            else if (functionImplementationName === 'python') {
                scriptLanguage = Enums.EScriptLanguage.ePython;
            }
            return scriptLanguage;
        };
        /**
         * Set script language.
         * @private
         * @param {EP.EScriptLanguage} _iScriptLanguage - The script language to set.
         * @return {boolean} True if the script language was set, false otherwise.
         */
        // eslint-disable-next-line class-methods-use-this
        CSIScriptFunctionBlock.prototype.setScriptLanguage = function (_iScriptLanguage) {
            return false;
        };
        /**
         * Get script content.
         * @private
         * @return {string} The script content.
         */
        CSIScriptFunctionBlock.prototype.getScriptContent = function () {
            return this.getJSONFunction().implementation.settings.script;
        };
        /**
         * Is script content settable.
         * @private
         * @param {string} [_iScriptContent] The script content to check.
         * @return {boolean} True if script content is settable, false otherwise.
         */
        // eslint-disable-next-line class-methods-use-this
        CSIScriptFunctionBlock.prototype.isScriptContentSettable = function (_iScriptContent) {
            return false;
        };
        /**
         * Set script content.
         * @private
         * @param {string} _iScriptContent - The script content to set.
         * @return {boolean} True if script content was set, false otherwise.
         */
        // eslint-disable-next-line class-methods-use-this
        CSIScriptFunctionBlock.prototype.setScriptContent = function (_iScriptContent) {
            return false;
        };
        return CSIScriptFunctionBlock;
    }(CSIFunctionBlock));
    return CSIScriptFunctionBlock;
});
