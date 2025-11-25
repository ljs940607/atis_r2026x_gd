/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIFunctionBlock'/>
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
define("DS/EPSSchematicsCSI/EPSSchematicsCSIFunctionBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCSI/EPSSchematicsCSITools", "DS/ExperienceKernel/ExperienceKernel"], function (require, exports, Block, Enums, CSITools, EK) {
    "use strict";
    var CSIFunctionBlock = /** @class */ (function (_super) {
        __extends(CSIFunctionBlock, _super);
        /**
         * @constructor
         * @public
         */
        function CSIFunctionBlock() {
            return _super.call(this) || this;
        }
        /**
         * Get json function.
         * @protected
         * @return {ICSIJSONFunction} The json function.
         */
        CSIFunctionBlock.prototype.getJSONFunction = function () {
            return JSON.parse(JSON.stringify(this.jsonFunction));
        };
        /**
         * Set json function.
         * @private
         * @param {string} iJSONFunction - The json function to set.
         * @return {boolean} True if the json function was set, false otherwise.
         */
        CSIFunctionBlock.prototype.setJSONFunction = function (iJSONFunction) {
            var result = !this.isTemplate();
            result = result && !this.isFromTemplate();
            result = result && this.jsonFunction === undefined;
            result = result && iJSONFunction instanceof Object;
            if (result) {
                this.jsonFunction = iJSONFunction;
            }
            return result;
        };
        /**
         * Get function pool.
         * @private
         * @return {string} The function pool.
         */
        CSIFunctionBlock.prototype.getFunctionPool = function () {
            return this.jsonFunction.pool;
        };
        /**
         * Get function name.
         * @private
         * @return {string} The function name.
         */
        CSIFunctionBlock.prototype.getFunctionName = function () {
            return this.jsonFunction.name;
        };
        /**
         * Get function version.
         * @private
         * @return {number} The function version.
         */
        CSIFunctionBlock.prototype.getFunctionVersion = function () {
            return this.jsonFunction.version;
        };
        /**
         * Get function implementation name.
         * @private
         * @return {string} The function implementation name.
         */
        CSIFunctionBlock.prototype.getFunctionImplementationName = function () {
            return this.jsonFunction.implementation.name;
        };
        CSIFunctionBlock.prototype.execute = function () {
            var _this = this;
            var executionResult = Enums.EExecutionResult.eExecutionPending;
            var model = this.model;
            if (this.isInputControlPortActivated('Call')) {
                if (this.data.interruption === undefined) {
                    var node = this.getNode();
                    var nodeId = this.getNodeId(model.getFunctionPool());
                    var csiParameters;
                    if (this.model.hasDataPortName('Call')) {
                        var dataPortIn = this.getInputDataPortValue('Call');
                        var dataPortInType = this.getInputDataPortValueType('Call');
                        csiParameters = CSITools.getParameters(dataPortInType, dataPortIn, model.getGraphContext());
                    }
                    this.data.interruption = new EK.Interruption();
                    node.call({
                        name: model.getFunctionName(),
                        version: model.getFunctionVersion(),
                        onSuccess: function (iCSIParameters) {
                            _this.data.success = CSITools.createProxyParameters(iCSIParameters);
                        },
                        onProgress: function (iCSIParameters) {
                            _this.data.progress = CSITools.createProxyParameters(iCSIParameters);
                        },
                        onError: function (iCSIParameters) {
                            if (iCSIParameters.getObjectType() === 'CSISystemError') {
                                _this.data.systemError = CSITools.createProxyParameters(iCSIParameters);
                            }
                            else {
                                _this.data.error = CSITools.createProxyParameters(iCSIParameters);
                            }
                        },
                        destinationNodeId: nodeId,
                        parameters: csiParameters
                    }, this.data.interruption);
                }
                else {
                    throw new Error('Call is already in progress');
                }
            }
            /*else if (this.isInputControlPortActivated('Interrupt')) {
                if (this.data.interruption !== undefined) {
                    this.data.interruption.interrupt();
                }
                else {
                    throw new Error('Nothing to interrupt');
                }
            }*/
            else {
                if (this.data.progress !== undefined && this.model.hasControlPortName('Progress')) {
                    if (this.model.hasDataPortName('Progress')) {
                        this.setOutputDataPortValue('Progress', this.data.progress);
                    }
                    this.data.progress = undefined;
                    this.activateOutputControlPort('Progress');
                    executionResult = Enums.EExecutionResult.eExecutionPending;
                }
                if (this.data.success !== undefined) {
                    if (this.model.hasDataPortName('Success')) {
                        this.setOutputDataPortValue('Success', this.data.success);
                    }
                    this.data.success = undefined;
                    this.activateOutputControlPort('Success');
                    this.data.interruption = undefined;
                    executionResult = Enums.EExecutionResult.eExecutionFinished;
                }
                else if (this.data.error !== undefined && this.model.hasControlPortName('Error')) {
                    if (this.model.hasDataPortName('Error')) {
                        this.setOutputDataPortValue('Error', this.data.error);
                    }
                    this.data.error = undefined;
                    this.activateOutputControlPort('Error');
                    this.data.interruption = undefined;
                    executionResult = Enums.EExecutionResult.eExecutionFinished;
                }
                else if (this.data.systemError !== undefined) {
                    var systemErrorMessage = this.data.systemError.error;
                    this.data.systemError = undefined;
                    this.data.function = undefined;
                    throw new Error(systemErrorMessage);
                }
            }
            return executionResult;
        };
        return CSIFunctionBlock;
    }(Block));
    return CSIFunctionBlock;
});
