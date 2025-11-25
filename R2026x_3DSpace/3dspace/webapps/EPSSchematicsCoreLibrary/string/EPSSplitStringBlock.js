/// <amd-module name='DS/EPSSchematicsCoreLibrary/string/EPSSplitStringBlock'/>
define("DS/EPSSchematicsCoreLibrary/string/EPSSplitStringBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/string/EPSSchematicsCoreLibraryStringCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, StringCategory) {
    "use strict";
    class SplitStringBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputBasic('Input String', 'String', ''),
                new DataPortDefinitions.InputBasic('Seperator', 'String', ''),
                new DataPortDefinitions.InputBasic('Max Count', 'Integer', undefined),
                new DataPortDefinitions.OutputBasic('Splits', 'Array<String>')
            ]);
        }
        execute() {
            const inputString = this.getInputDataPortValue('Input String');
            const separator = this.getInputDataPortValue('Seperator');
            const maxCount = this.getInputDataPortValue('Max Count');
            const splits = inputString.split(separator, maxCount);
            this.setOutputDataPortValue('Splits', splits);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    SplitStringBlock.prototype.uid = '6eae7cc5-3d1e-4c54-9e55-48bba761f9c7';
    SplitStringBlock.prototype.name = 'Split String';
    SplitStringBlock.prototype.category = StringCategory;
    SplitStringBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSSplitStringBlockDoc';
    return SplitStringBlock;
});
