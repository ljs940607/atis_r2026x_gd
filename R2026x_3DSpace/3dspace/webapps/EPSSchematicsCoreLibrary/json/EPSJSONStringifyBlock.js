/// <amd-module name='DS/EPSSchematicsCoreLibrary/json/EPSJSONStringifyBlock'/>
define("DS/EPSSchematicsCoreLibrary/json/EPSJSONStringifyBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/json/EPSSchematicsCoreLibraryJSONCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, JSONCategory) {
    "use strict";
    class JSONStringifyBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputAdvanced('Object', Enums.FTypeCategory.fObject, ['Object']),
                new DataPortDefinitions.OutputBasic('JSON', 'String')
            ]);
        }
        execute() {
            const object = this.getInputDataPortValue('Object');
            if (object === undefined) {
                throw new Error('The data port Object is undefined!');
            }
            const json = JSON.stringify(object);
            this.setOutputDataPortValue('JSON', json);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    JSONStringifyBlock.prototype.uid = 'f4f03aaf-066f-4a9e-aaa8-8711a72bba2a';
    JSONStringifyBlock.prototype.name = 'JSON Stringify';
    JSONStringifyBlock.prototype.category = JSONCategory;
    JSONStringifyBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSJSONStringifyBlockDoc';
    return JSONStringifyBlock;
});
