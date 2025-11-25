/// <amd-module name='DS/EPSSchematicsCoreLibrary/json/EPSJSONParseBlock'/>
define("DS/EPSSchematicsCoreLibrary/json/EPSJSONParseBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/json/EPSSchematicsCoreLibraryJSONCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, JSONCategory) {
    "use strict";
    class JSONParseBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputBasic('JSON', 'String'),
                new DataPortDefinitions.OutputAdvanced('Object', Enums.FTypeCategory.fObject, ['Object'])
            ]);
        }
        execute() {
            const json = this.getInputDataPortValue('JSON');
            if (json === undefined) {
                throw new Error('The data port JSON is undefined!');
            }
            const object = JSON.parse(json);
            this.setOutputDataPortValue('Object', object);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    JSONParseBlock.prototype.uid = '5285862d-25ad-4c76-bf24-a90bf9b1016a';
    JSONParseBlock.prototype.name = 'JSON Parse';
    JSONParseBlock.prototype.category = JSONCategory;
    JSONParseBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSJSONParseBlockDoc';
    return JSONParseBlock;
});
