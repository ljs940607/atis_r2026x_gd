/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayGetIndexBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayGetIndexBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, Enums, ControlPortDefinitions, DataPortDefinitions, ArrayCategory) {
    "use strict";
    /* eslint-enable no-unused-vars */
    class ArrayGetIndexBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Found'),
                new ControlPortDefinitions.Output('Not Found')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('Array', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputRefArrayValue('Value', dataPortArray),
                new DataPortDefinitions.OutputCategory('Index', Enums.FTypeCategory.fNumerical, 'Integer')
            ]);
        }
        execute() {
            const array = this.getInputDataPortValue('Array');
            if (array === undefined) {
                throw new Error('The data port Array is undefined!');
            }
            const value = this.getInputDataPortValue('Value');
            if (value === undefined) {
                throw new Error('The data port Value is undefined!');
            }
            const index = array.indexOf(value);
            if (index !== -1) {
                this.setOutputDataPortValue('Index', index);
                this.activateOutputControlPort('Found');
            }
            else {
                this.setOutputDataPortValue('Index', undefined);
                this.activateOutputControlPort('Not Found');
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayGetIndexBlock.prototype.uid = 'd65b326f-ae0b-447f-9134-84e9cf67910c';
    ArrayGetIndexBlock.prototype.name = 'Array Get Index';
    ArrayGetIndexBlock.prototype.category = ArrayCategory;
    ArrayGetIndexBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayGetIndexBlockDoc';
    return ArrayGetIndexBlock;
});
