/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayGetBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayGetBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, ArrayCategory) {
    "use strict";
    class ArrayGetBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            var dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('Array', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputCategory('Index', Enums.FTypeCategory.fNumerical, 'Integer'),
                new DataPortDefinitions.OutputRefArrayValue('Value', dataPortArray)
            ]);
        }
        execute() {
            const array = this.getInputDataPortValue('Array');
            if (array === undefined) {
                throw new Error('The data port Array is undefined!');
            }
            const index = this.getInputDataPortValue('Index');
            if (index === undefined) {
                throw new Error('The data port Index is undefined!');
            }
            if (index < 0 || index >= array.length) {
                throw new Error('The data port Index is out of range!');
            }
            const value = array[index];
            this.setOutputDataPortValue('Value', value);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayGetBlock.prototype.uid = '12fd7927-760f-49ce-8db8-4989c2c21d79';
    ArrayGetBlock.prototype.name = 'Array Get';
    ArrayGetBlock.prototype.category = ArrayCategory;
    ArrayGetBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayGetBlockDoc';
    return ArrayGetBlock;
});
