/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayIteratorBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayIteratorBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, TypeLibrary, ArrayCategory) {
    "use strict";
    class ArrayIteratorBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Input('Loop In'),
                new ControlPortDefinitions.Output('Out'),
                new ControlPortDefinitions.Output('Loop Out')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('Array', Enums.FTypeCategory.fArray, 'Array<Double>'));
            const startIndexDefaultValues = {};
            TypeLibrary.getGlobalTypeNameList(Enums.FTypeCategory.fNumerical).forEach(function (typeName) {
                startIndexDefaultValues[typeName] = 0;
            });
            this.createDataPorts([
                new DataPortDefinitions.InputCategory('StartIndex', Enums.FTypeCategory.fNumerical, 'Integer', startIndexDefaultValues),
                new DataPortDefinitions.InputCategory('EndIndex', Enums.FTypeCategory.fNumerical, 'Integer'),
                new DataPortDefinitions.OutputCategory('Index', Enums.FTypeCategory.fNumerical, 'Integer'),
                new DataPortDefinitions.OutputRefArrayValue('Value', dataPortArray)
            ]);
        }
        execute() {
            const array = this.getInputDataPortValue('Array');
            if (array === undefined) {
                throw new Error('The data port Array is undefined!');
            }
            const startIndex = this.getInputDataPortValue('StartIndex');
            if (startIndex === undefined) {
                throw new Error('The data port StartIndex is undefined!');
            }
            if (startIndex < 0 || startIndex >= array.length) {
                throw new Error('The data port StartIndex is out of range!');
            }
            let endIndex = this.getInputDataPortValue('EndIndex');
            if (endIndex === undefined) {
                endIndex = array.length;
            }
            else if (endIndex < 0 || endIndex > array.length) {
                throw new Error('The data port EndIndex is out of range!');
            }
            this.data.index = this.isInputControlPortActivated('In') ? startIndex : this.data.index + 1;
            let value;
            if (this.data.index >= endIndex) {
                delete this.data.index;
                this.activateOutputControlPort('Out');
            }
            else {
                value = array[this.data.index];
                this.activateOutputControlPort('Loop Out');
            }
            this.setOutputDataPortValue('Value', value);
            this.setOutputDataPortValue('Index', this.data.index);
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayIteratorBlock.prototype.uid = 'f8ab03aa-a92e-4bfe-a01e-3630147a8eeb';
    ArrayIteratorBlock.prototype.name = 'Array Iterator';
    ArrayIteratorBlock.prototype.category = ArrayCategory;
    ArrayIteratorBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayIteratorBlockDoc';
    return ArrayIteratorBlock;
});
