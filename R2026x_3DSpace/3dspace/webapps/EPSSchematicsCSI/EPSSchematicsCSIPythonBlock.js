/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIPythonBlock'/>
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
define("DS/EPSSchematicsCSI/EPSSchematicsCSIPythonBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsScriptBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsCSI/EPSSchematicsCSICategory", "DS/EPSSchematicsCSI/EPSSchematicsCSITools"], function (require, exports, ScriptBlock, Enums, TypeLibrary, ControlPortDefinitions, DataPortDefinitions, CSICategory, CSITools) {
    "use strict";
    var CSIPythonBlock = /** @class */ (function (_super) {
        __extends(CSIPythonBlock, _super);
        /**
         * @constructor
         * @public
         */
        function CSIPythonBlock() {
            var _this = _super.call(this) || this;
            _this.createControlPorts([
                new ControlPortDefinitions.Input('Call'),
                new ControlPortDefinitions.Output('Success'),
                new ControlPortDefinitions.Output('Progress'),
                new ControlPortDefinitions.Output('Error')
            ]);
            var nodeIdSelectorType = TypeLibrary.hasGlobalType('CSIExecGraphNodeIdSelector', Enums.FTypeCategory.fObject) ? 'CSIExecGraphNodeIdSelector' : 'Object';
            _this.createDataPorts([
                new DataPortDefinitions.InputAdvanced('Call', Enums.FTypeCategory.fObject, ['Object']),
                new DataPortDefinitions.OutputAdvanced('Success', Enums.FTypeCategory.fObject, ['Object']),
                new DataPortDefinitions.OutputAdvanced('Progress', Enums.FTypeCategory.fObject, ['Object']),
                new DataPortDefinitions.OutputAdvanced('Error', Enums.FTypeCategory.fObject, ['Object']),
                new DataPortDefinitions.InputExternalBasic('NodeIdSelector', nodeIdSelectorType, undefined, true)
            ]);
            _this.setDataPortInputRules({ dynamicCount: 0 });
            _this.setDataPortOutputRules({ dynamicCount: 0 });
            _this.setDataPortLocalRules({ dynamicCount: 0 });
            _this.setDataPortInputExternalRules({ dynamicCount: 0 });
            _this.setControlPortInputRules({ dynamicCount: 0 });
            _this.setControlPortOutputRules({ dynamicCount: 0 });
            _this.setEventPortInputRules({ dynamicCount: 0 });
            _this.setEventPortOutputRules({ dynamicCount: 0 });
            _this.setSettingRules({ dynamicCount: 0 });
            _this.activateNodeIdSelector();
            _this.setScriptLanguage(Enums.EScriptLanguage.ePython);
            _this.setScriptContent('def onCall(input, origin):\n' +
                '  if origin.isInterrupted():\n' +
                '    return origin.answerError({ \'errorCode\': 499, \'error\': \'Function was interrupted\' })\n' +
                '\n' +
                '  # insert your code here\n' +
                '\n' +
                '  return origin.answerSuccess({})\n');
            return _this;
        }
        /**
         * Is exportable.
         * @public
         * @return {boolean}
         */
        // eslint-disable-next-line class-methods-use-this
        CSIPythonBlock.prototype.isExportable = function () {
            return true;
        };
        /**
         * Export content.
         * @public
         * @return {string} The export content.
         */
        CSIPythonBlock.prototype.exportContent = function () {
            var csiFunction = {};
            csiFunction.grammarVersion = 3;
            csiFunction.implementation = {};
            csiFunction.implementation.name = 'python';
            csiFunction.implementation.version = 2;
            csiFunction.implementation.settings = {};
            csiFunction.implementation.settings.script = this.getScriptContent();
            csiFunction.desc = this.getDescription() || 'Specify here the description of this function implemented in Python';
            csiFunction.onCall = {
                'in': CSITools.getCSISignatureFromDataPort(this.getDataPortByName('Call')),
                out: CSITools.getCSISignatureFromDataPort(this.getDataPortByName('Success'))
            };
            csiFunction.progress = CSITools.getCSISignatureFromDataPort(this.getDataPortByName('Progress'));
            csiFunction.throwError = CSITools.getCSISignatureFromDataPort(this.getDataPortByName('Error'));
            return JSON.stringify(csiFunction, undefined, 2);
        };
        /**
         * Export file name.
         * @public
         * @return {string} The file name.
         */
        CSIPythonBlock.prototype.exportFileName = function () {
            return CSITools.exportFileName(this.getName());
        };
        return CSIPythonBlock;
    }(ScriptBlock));
    CSIPythonBlock.prototype.uid = 'f17d86a9-8137-4d34-a30b-5737f77850e2';
    CSIPythonBlock.prototype.name = 'CSI Python';
    CSIPythonBlock.prototype.category = CSICategory;
    CSIPythonBlock.prototype.documentation = 'text!DS/EPSSchematicsCSI/assets/EPSSchematicsCSIPythonBlockDoc.json';
    return CSIPythonBlock;
});
