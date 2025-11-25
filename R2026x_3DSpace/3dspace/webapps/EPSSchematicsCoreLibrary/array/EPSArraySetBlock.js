/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArraySetBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArraySetBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, ArrayCategory) {
    "use strict";
    class ArraySetBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('ArrayIn', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputCategory('Index', Enums.FTypeCategory.fNumerical, 'Integer'),
                new DataPortDefinitions.InputRefArrayValue('Value', dataPortArray, {
                    'Boolean': false,
                    'Double': 0.0,
                    'Integer': 0,
                    'String': ''
                }),
                new DataPortDefinitions.OutputRef('ArrayOut', dataPortArray)
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
            const value = this.getInputDataPortValue('Value');
            if (value === undefined) {
                throw new Error('The data port Value is undefined!');
            }
            arrayIn[index] = value;
            this.setOutputDataPortValue('ArrayOut', arrayIn);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArraySetBlock.prototype.uid = '140a891f-a5f1-4e61-ab8e-7cb7ee85ed7e';
    ArraySetBlock.prototype.name = 'Array Set';
    ArraySetBlock.prototype.category = ArrayCategory;
    ArraySetBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArraySetBlockDoc';
    return ArraySetBlock;
});
