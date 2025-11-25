/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIGraphFunctionBlock'/>
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
define("DS/EPSSchematicsCSI/EPSSchematicsCSIGraphFunctionBlock", ["require", "exports", "DS/EPSSchematicsCSI/EPSSchematicsCSIFunctionBlock"], function (require, exports, CSIFunctionBlock) {
    "use strict";
    var CSIGraphFunctionBlock = /** @class */ (function (_super) {
        __extends(CSIGraphFunctionBlock, _super);
        /**
         * @constructor
         * @public
         */
        function CSIGraphFunctionBlock() {
            return _super.call(this) || this;
        }
        /**
         * Get json function.
         * @protected
         * @return {ICSIJSONGraphFunction} The json function.
         */
        CSIGraphFunctionBlock.prototype.getJSONFunction = function () {
            return _super.prototype.getJSONFunction.call(this);
        };
        return CSIGraphFunctionBlock;
    }(CSIFunctionBlock));
    return CSIGraphFunctionBlock;
});
