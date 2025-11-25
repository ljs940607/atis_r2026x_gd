/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayLengthBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayLengthBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, ArrayCategory) {
    "use strict";
    class ArrayLengthBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            this.createDataPorts([
                new DataPortDefinitions.InputCategory('Array', Enums.FTypeCategory.fArray, 'Array<Double>'),
                new DataPortDefinitions.OutputCategory('Length', Enums.FTypeCategory.fNumerical, 'Integer')
            ]);
        }
        execute() {
            const array = this.getInputDataPortValue('Array');
            if (array === undefined) {
                throw new Error('The data port Array is undefined!');
            }
            this.setOutputDataPortValue('Length', array.length);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayLengthBlock.prototype.uid = 'd0aa786c-e50a-4428-84b3-e4fd487db7ae';
    ArrayLengthBlock.prototype.name = 'Array Length';
    ArrayLengthBlock.prototype.category = ArrayCategory;
    ArrayLengthBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayLengthBlockDoc';
    return ArrayLengthBlock;
});
