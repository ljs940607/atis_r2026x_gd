/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayShiftBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayShiftBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, ArrayCategory) {
    "use strict";
    class ArrayShiftBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('ArrayIn', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.OutputRef('ArrayOut', dataPortArray),
                new DataPortDefinitions.OutputRefArrayValue('Value', dataPortArray)
            ]);
        }
        execute() {
            const arrayIn = this.getInputDataPortValue('ArrayIn');
            if (arrayIn === undefined) {
                throw new Error('The data port ArrayIn is undefined!');
            }
            const value = arrayIn.shift();
            this.setOutputDataPortValue('ArrayOut', arrayIn);
            this.setOutputDataPortValue('Value', value);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayShiftBlock.prototype.uid = '1ac864ff-9ffd-498c-bcb4-ea117ebb10c7';
    ArrayShiftBlock.prototype.name = 'Array Shift';
    ArrayShiftBlock.prototype.category = ArrayCategory;
    ArrayShiftBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayShiftBlockDoc';
    return ArrayShiftBlock;
});
