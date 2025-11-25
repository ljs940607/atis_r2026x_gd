/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock'/>
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
define("DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsJSONConverter", "DS/EPSSchematicsCSI/EPSSchematicsCSICategory", "DS/EPSSchematicsCSI/EPSSchematicsCSITools"], function (require, exports, GraphBlock, Enums, Tools, TypeLibrary, ControlPortDefinitions, DataPortDefinitions, SettingDefinitions, JSONConverter, CSICategory, CSITools) {
    "use strict";
    /* eslint-enable no-unused-vars */
    TypeLibrary.registerGlobalObjectType('ProgressEventsSettings', {
        flowIn: {
            type: 'Boolean',
            mandatory: true,
            defaultValue: false
        },
        flowOut: {
            type: 'Boolean',
            mandatory: true,
            defaultValue: false
        },
        notPluggedProgress: {
            type: 'Boolean',
            mandatory: true,
            defaultValue: false
        },
        select: {
            type: 'Boolean',
            mandatory: true,
            defaultValue: false
        },
        timestamp: {
            type: 'Boolean',
            mandatory: true,
            defaultValue: false
        }
    });
    var CSIGraphBlock = /** @class */ (function (_super) {
        __extends(CSIGraphBlock, _super);
        /**
         * @constructor
         * @public
         */
        function CSIGraphBlock() {
            var _this = _super.call(this) || this;
            var startupPort = _this.getStartupPort();
            startupPort.setName('Call');
            startupPort.setRenamable(false);
            _this.createControlPorts([
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
            _this.getDataPortByName('Call').setMaxTestValues(1);
            _this.getDataPortByName('Success').setMaxTestValues(1);
            _this.getDataPortByName('Error').setMaxTestValues(1);
            var castLevelSetting = _this.getSettingByName('CastLevel');
            castLevelSetting.setValue(Enums.ECastLevel.eUnsafe);
            _this.createSettings([
                new SettingDefinitions.Basic('defaultTimeout', 'Integer', 60),
                new SettingDefinitions.Basic('directData', 'Boolean', false),
                new SettingDefinitions.Basic('progressEvents', 'ProgressEventsSettings', { flowIn: false, flowOut: false, notPluggedProgress: false, select: false, timestamp: false }),
                new SettingDefinitions.Basic('multipleCall', 'Boolean', false)
            ]);
            _this.setDataPortInputRules({ dynamicCount: 0 });
            _this.setDataPortOutputRules({ dynamicCount: 0 });
            _this.setControlPortInputRules({ dynamicCount: 0 });
            _this.setControlPortOutputRules({ dynamicCount: 0 });
            _this.setEventPortInputRules({ dynamicCount: 0 });
            _this.setEventPortOutputRules({ dynamicCount: 0 });
            _this.activateNodeIdSelector();
            return _this;
        }
        /**
         * On add.
         * @public
         * @param {GraphBlock} iGraphBlock - The graph block.
         */
        CSIGraphBlock.prototype.onAdd = function (iGraphBlock) {
            _super.prototype.onAdd.call(this, iGraphBlock);
            this.setNodeIdSelector(Tools.parentNodeIdSelector);
        };
        /**
         * Is exportable.
         * @public
         * @return {boolean}
         */
        // eslint-disable-next-line class-methods-use-this
        CSIGraphBlock.prototype.isExportable = function () {
            return true;
        };
        /**
         * Export content.
         * @public
         * @return {string} The export content.
         */
        CSIGraphBlock.prototype.exportContent = function () {
            var CSIExport = require('DS/EPSSchematicsCSI/EPSSchematicsCSIExport');
            var jsonObject = CSIExport.generateJSONObject(this);
            jsonObject.implementation.settings.implementation.ui = this.generateJSON();
            return JSON.stringify(jsonObject, undefined, 2);
        };
        /**
         * Export file name.
         * @public
         * @return {string} The file name.
         */
        CSIGraphBlock.prototype.exportFileName = function () {
            return CSITools.exportFileName(this.getName());
        };
        return CSIGraphBlock;
    }(GraphBlock));
    CSIGraphBlock.prototype.uid = '6d004daa-6201-413e-9bde-45dbc9351cc6';
    CSIGraphBlock.prototype.name = 'CSI Graph';
    CSIGraphBlock.prototype.category = CSICategory;
    CSIGraphBlock.prototype.documentation = 'text!DS/EPSSchematicsCSI/assets/EPSSchematicsCSIGraphBlockDoc.json';
    var convertBlock = function (_iOldBlock, oNewBlock, _oControlPorts, _oDataPorts, iJSON) {
        var jsonGraph = iJSON;
        var nodeIdSelectorDataPort = oNewBlock.getDataPortByName('NodeIdSelector');
        var nodeIdSelectorDataPortIndex = nodeIdSelectorDataPort.getIndex();
        if (jsonGraph.dataPorts[nodeIdSelectorDataPortIndex] && jsonGraph.dataPorts[nodeIdSelectorDataPortIndex].name !== 'NodeIdSelector') {
            var dataPortsRootPath = Tools.rootPath + '.dataPorts[';
            for (var dl = 0; dl < jsonGraph.dataLinks.length; dl++) {
                var dataLink = jsonGraph.dataLinks[dl];
                if (dataLink.startPort.indexOf(dataPortsRootPath) === 0) {
                    var index = Number(dataLink.startPort.substring(dataPortsRootPath.length, dataLink.startPort.indexOf(']')));
                    if (index >= nodeIdSelectorDataPortIndex) {
                        var newIndex = index + 1;
                        dataLink.startPort = dataLink.startPort.replace('[' + index + ']', '[' + newIndex + ']');
                    }
                }
                if (dataLink.endPort.indexOf(dataPortsRootPath) === 0) {
                    var index = Number(dataLink.endPort.substring(dataPortsRootPath.length, dataLink.endPort.indexOf(']')));
                    if (index >= nodeIdSelectorDataPortIndex) {
                        var newIndex = index + 1;
                        dataLink.endPort = dataLink.endPort.replace('[' + index + ']', '[' + newIndex + ']');
                    }
                }
            }
            var nodeIdSelectorDataPortJSONObject = {};
            jsonGraph.dataPorts.splice(nodeIdSelectorDataPortIndex, 0, nodeIdSelectorDataPortJSONObject);
            nodeIdSelectorDataPort.toJSON(nodeIdSelectorDataPortJSONObject);
        }
        oNewBlock.fromJSON(jsonGraph);
    };
    JSONConverter.addBlockConverter('2.0.6', CSIGraphBlock.prototype.uid, CSIGraphBlock.prototype.uid, convertBlock);
    return CSIGraphBlock;
});
