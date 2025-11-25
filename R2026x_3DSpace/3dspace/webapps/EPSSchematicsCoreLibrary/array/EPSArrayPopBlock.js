/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayPopBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayPopBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, ArrayCategory) {
    "use strict";
    class ArrayPopBlock extends Block {
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
            const value = arrayIn.pop();
            this.setOutputDataPortValue('ArrayOut', arrayIn);
            this.setOutputDataPortValue('Value', value);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayPopBlock.prototype.uid = '53cf0941-191e-45df-9c13-1aa14b846efe';
    ArrayPopBlock.prototype.name = 'Array Pop';
    ArrayPopBlock.prototype.category = ArrayCategory;
    ArrayPopBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayPopBlockDoc';
    return ArrayPopBlock;
});
