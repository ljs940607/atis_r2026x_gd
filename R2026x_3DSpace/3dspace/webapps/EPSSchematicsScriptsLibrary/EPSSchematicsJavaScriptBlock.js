/// <amd-module name='DS/EPSSchematicsScriptsLibrary/EPSSchematicsJavaScriptBlock'/>
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
define("DS/EPSSchematicsScriptsLibrary/EPSSchematicsJavaScriptBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsScriptBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsScriptsLibrary/EPSSchematicsScriptsLibraryCategories"], function (require, exports, ScriptBlock, ControlPortDefinitions, Enums, ScriptCategory) {
    "use strict";
    var replaceGUIDCharacter = function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    };
    var generateGUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replaceGUIDCharacter);
    };
    var lf = '\n';
    var ht = '\t';
    var generateCodeFromValueType = function (iType, iValue, iGraphContext) {
        var TypeLibrary = require('DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary');
        var code = {
            block: '',
            value: 'undefined'
        };
        var elementType = TypeLibrary.getArrayValueTypeName(iType) || iType;
        if (!TypeLibrary.hasType(iGraphContext, elementType, Enums.FTypeCategory.fBase | Enums.FTypeCategory.fNumerical)) {
            code.block += ht + ht + '// TODO: Add ' + elementType + ' as define dependencies' + lf;
        }
        if (iValue !== undefined) {
            if (TypeLibrary.hasType(iGraphContext, elementType, Enums.FTypeCategory.fEnum)) {
                code.block += ht + ht + 'var ' + elementType + ' = TypeLibrary.getType(this.getGraphContext(), \'' + elementType + '\');' + lf;
                var valueToEnumKey_1 = {};
                var Enum = TypeLibrary.getType(iGraphContext, elementType);
                var enumKeys = Object.keys(Enum);
                for (var ek = 0; ek < enumKeys.length; ek++) {
                    var enumKey = enumKeys[ek];
                    valueToEnumKey_1[Enum[enumKey]] = enumKey;
                }
                if (Array.isArray(iValue)) {
                    var arrayCodeValue = iValue.map(function (elt) { return elementType + '.' + valueToEnumKey_1[elt]; });
                    code.value = '[' + arrayCodeValue.join(', ') + ']';
                }
                else {
                    code.value = elementType + '.' + valueToEnumKey_1[iValue];
                }
            }
            else {
                var jsonObjectValue = TypeLibrary.getJSONValueFromValue(iGraphContext, iValue, iType);
                var jsonValue = JSON.stringify(jsonObjectValue);
                jsonValue = jsonValue.replace(/"/g, '\'');
                if (!TypeLibrary.hasType(iGraphContext, iType, Enums.FTypeCategory.fBase | Enums.FTypeCategory.fNumerical)) {
                    code.value = 'TypeLibrary.getValueFromJSONValue(this.getGraphContext(), ' + jsonValue + ', \'' + iType + '\')';
                }
                else {
                    code.value = jsonValue;
                }
            }
        }
        return code;
    };
    var toPascalCase = function (iString) {
        var pascalCaseString = iString.replace(/[^a-zA-Z0-9]+(.)/g, function (_match, char) { return char.toUpperCase(); });
        return pascalCaseString;
    };
    var JavaScriptBlock = /** @class */ (function (_super) {
        __extends(JavaScriptBlock, _super);
        function JavaScriptBlock() {
            var _this = _super.call(this) || this;
            _this.createControlPort(new ControlPortDefinitions.Input('In')).setRenamable(true);
            _this.createDynamicControlPort(Enums.EControlPortType.eOutput, 'Out');
            _this.setScriptLanguage(Enums.EScriptLanguage.eJavaScript);
            _this.setScriptContent('/*******************************************************\n\n An output control port can be activated using:\n this.activateOutputControlPort(<portName>);\n\n An input data port value can be accessed using:\n this.getInputDataPortValue(<portName>);\n\n An output data port value can be set using:\n this.setOutputDataPortValue(<portName>, <portValue>);\n\n*******************************************************/\n// Insert code here\n\nthis.activateOutputControlPort(\'Out\');\nreturn EP.EExecutionResult.eExecutionFinished;');
            return _this;
        }
        // eslint-disable-next-line class-methods-use-this
        JavaScriptBlock.prototype.isExportable = function () {
            return true;
        };
        JavaScriptBlock.prototype.exportContent = function () {
            var blockName = this.getName();
            var blockPascalCaseName = toPascalCase(blockName);
            var blockUid = generateGUID();
            var blockCategory = blockPascalCaseName + 'Category';
            var blockClassName = blockPascalCaseName + 'Block';
            var blockRequireId = 'DS/' + blockPascalCaseName + 'Module/' + blockClassName;
            var code;
            var blockCode = '';
            blockCode += 'define(\'' + blockRequireId + '\', [' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsBlock\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsEventPortDefinitions\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums\',' + lf;
            blockCode += ht + '\'DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary\'' + lf;
            blockCode += '], function (Block, ControlPortDefinitions, EventPortDefinitions, DataPortDefinitions, SettingDefinitions, Enums, TypeLibrary) {' + lf;
            blockCode += ht + '\'use strict\';' + lf;
            blockCode += lf;
            blockCode += ht + 'var ' + blockClassName + ' = function () {' + lf;
            blockCode += ht + ht + 'Block.call(this);' + lf;
            blockCode += lf;
            var inputControlPorts = this.getControlPorts(Enums.EControlPortType.eInput);
            for (var icp = 0; icp < inputControlPorts.length; icp++) {
                var inputControlPort = inputControlPorts[icp];
                var icpName = inputControlPort.getName();
                blockCode += ht + ht + 'this.createControlPort(new ControlPortDefinitions.Input(\'' + icpName + '\'));' + lf;
            }
            var inputEventPorts = this.getControlPorts(Enums.EControlPortType.eInputEvent);
            for (var iep = 0; iep < inputEventPorts.length; iep++) {
                var inputEventPort = inputEventPorts[iep];
                var iepName = inputEventPort.getName();
                var iepType = inputEventPort.getEventType();
                blockCode += ht + ht + 'this.createControlPort(new EventPortDefinitions.InputBasic(\'' + iepName + '\', \'' + iepType + '\'));' + lf;
            }
            var outputControlPorts = this.getControlPorts(Enums.EControlPortType.eOutput);
            for (var ocp = 0; ocp < outputControlPorts.length; ocp++) {
                var outputControlPort = outputControlPorts[ocp];
                var ocpName = outputControlPort.getName();
                blockCode += ht + ht + 'this.createControlPort(new ControlPortDefinitions.Output(\'' + ocpName + '\'));' + lf;
            }
            var outputEventPorts = this.getControlPorts(Enums.EControlPortType.eOutputEvent);
            for (var oep = 0; oep < outputEventPorts.length; oep++) {
                var outputEventPort = outputEventPorts[oep];
                var oepName = outputEventPort.getName();
                var oepType = outputEventPort.getEventType();
                blockCode += ht + ht + 'this.createControlPort(new EventPortDefinitions.OutputBasic(\'' + oepName + '\', \'' + oepType + '\'));' + lf;
            }
            var inputDataPorts = this.getDataPorts(Enums.EDataPortType.eInput);
            for (var idp = 0; idp < inputDataPorts.length; idp++) {
                var inputDataPort = inputDataPorts[idp];
                var idpName = inputDataPort.getName();
                var idpType = inputDataPort.getValueType();
                code = generateCodeFromValueType(idpType, inputDataPort.getDefaultValue(), this.getGraphContext());
                if (blockCode.indexOf(code.block) === -1) {
                    blockCode += code.block;
                }
                var idpDefaultValue = code.value;
                blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.InputBasic(\'' + idpName + '\', \'' + idpType + '\', ' + idpDefaultValue + '));' + lf;
            }
            var outputDataPorts = this.getDataPorts(Enums.EDataPortType.eOutput);
            for (var odp = 0; odp < outputDataPorts.length; odp++) {
                var outputDataPort = outputDataPorts[odp];
                var odpName = outputDataPort.getName();
                var odpType = outputDataPort.getValueType();
                blockCode += ht + ht + 'this.createDataPort(new DataPortDefinitions.OutputBasic(\'' + odpName + '\', \'' + odpType + '\'));' + lf;
            }
            var settings = this.getSettings();
            for (var s = 0; s < settings.length; s++) {
                var setting = settings[s];
                var sName = setting.getName();
                var sType = setting.getValueType();
                code = generateCodeFromValueType(sType, setting.getValue(), this.getGraphContext());
                if (blockCode.indexOf(code.block) === -1) {
                    blockCode += code.block;
                }
                var sValue = code.value;
                blockCode += ht + ht + 'this.createSetting(new SettingDefinitions.Basic(\'' + sName + '\', \'' + sType + '\', ' + sValue + '));' + lf;
            }
            blockCode += ht + '};' + lf;
            blockCode += lf;
            blockCode += ht + blockClassName + '.prototype = Object.create(Block.prototype);' + lf;
            blockCode += ht + blockClassName + '.prototype.constructor = ' + blockClassName + ';' + lf;
            blockCode += lf;
            blockCode += ht + blockClassName + '.prototype.uid = \'' + blockUid + '\';' + lf;
            blockCode += ht + blockClassName + '.prototype.name = \'' + blockName + '\';' + lf;
            blockCode += ht + blockClassName + '.prototype.category = \'' + blockCategory + '\';' + lf;
            blockCode += lf;
            blockCode += ht + blockClassName + '.prototype.execute = function () {' + lf;
            blockCode += this.getScriptContent().replace(/^/gm, ht + ht) + lf;
            blockCode += ht + '};' + lf;
            blockCode += lf;
            blockCode += ht + 'return ' + blockClassName + ';' + lf;
            blockCode += '});' + lf;
            return blockCode;
        };
        JavaScriptBlock.prototype.exportFileName = function () {
            var blockName = this.getName();
            var blockPascalCaseName = toPascalCase(blockName);
            var blockClassName = blockPascalCaseName + 'Block';
            var blockFileName = blockClassName + '.js';
            return blockFileName;
        };
        return JavaScriptBlock;
    }(ScriptBlock));
    JavaScriptBlock.prototype.uid = '729b0bc1-c2a3-42a8-8d02-7bb99034791c';
    JavaScriptBlock.prototype.name = 'JavaScript';
    JavaScriptBlock.prototype.category = ScriptCategory;
    JavaScriptBlock.prototype.documentation = 'i18n!DS/EPSSchematicsScriptsLibrary/assets/nls/EPSSchematicsJavaScriptBlockDoc';
    return JavaScriptBlock;
});
