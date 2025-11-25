/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayRemoveBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayRemoveBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, ArrayCategory) {
    "use strict";
    class ArrayRemoveBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('ArrayIn', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputCategory('Index', Enums.FTypeCategory.fNumerical, 'Integer'),
                new DataPortDefinitions.OutputRef('ArrayOut', dataPortArray),
                new DataPortDefinitions.OutputRefArrayValue('Value', dataPortArray)
            ]);
        }
        execute() {
            const arrayIn = this.getInputDataPortValue('ArrayIn');
            if (arrayIn === undefined) {
                throw new Error('The data port ArrayIn is undefined!');
            }
            const index = this.getInputDataPortValue('Index');
            if (index === undefined) {
                throw new Error('The data port Index is undefined!');
            }
            if (index < 0 || index >= arrayIn.length) {
                throw new Error('The data port Index is out of range!');
            }
            const value = arrayIn.splice(index, 1)[0];
            this.setOutputDataPortValue('ArrayOut', arrayIn);
            this.setOutputDataPortValue('Value', value);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayRemoveBlock.prototype.uid = '7c16a8ff-8499-44a2-8454-e50ad020a852';
    ArrayRemoveBlock.prototype.name = 'Array Remove';
    ArrayRemoveBlock.prototype.category = ArrayCategory;
    ArrayRemoveBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayRemoveBlockDoc';
    return ArrayRemoveBlock;
});
