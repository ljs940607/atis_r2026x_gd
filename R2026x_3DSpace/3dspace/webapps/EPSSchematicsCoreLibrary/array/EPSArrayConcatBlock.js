/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayConcatBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayConcatBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, ArrayCategory) {
    "use strict";
    class ArrayConcatBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('Array1', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputRef('Array2', dataPortArray),
                new DataPortDefinitions.OutputRef('NewArray', dataPortArray)
            ]);
            this.setDataPortInputRules({
                name: { prefix: 'Array', readonly: true },
                valueTypes: new ValueTypeRules.Ref(dataPortArray)
            });
            this.setDataPortOutputRules({ dynamicCount: 0 });
            this.setDataPortLocalRules({ dynamicCount: 0 });
            this.setDataPortInputExternalRules({ dynamicCount: 0 });
            this.setControlPortInputRules({ dynamicCount: 0 });
            this.setControlPortOutputRules({ dynamicCount: 0 });
            this.setEventPortInputRules({ dynamicCount: 0 });
            this.setEventPortOutputRules({ dynamicCount: 0 });
            this.setSettingRules({ dynamicCount: 0 });
        }
        execute() {
            const inputDataPortNames = this.getInputDataPortNameList();
            const arrays = [];
            for (let i = 0; i < inputDataPortNames.length; i++) {
                const inputDataPortName = inputDataPortNames[i];
                const array = this.getInputDataPortValue(inputDataPortName);
                if (array === undefined) {
                    throw new Error('The data port ' + inputDataPortName + ' is undefined!');
                }
                arrays.push(array);
            }
            const newArray = Array.prototype.concat.apply([], arrays);
            this.setOutputDataPortValue('NewArray', newArray);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayConcatBlock.prototype.uid = '25fe5b1d-8d61-410f-bfd5-f58e7ad01b4e';
    ArrayConcatBlock.prototype.name = 'Array Concat';
    ArrayConcatBlock.prototype.category = ArrayCategory;
    ArrayConcatBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayConcatBlockDoc';
    return ArrayConcatBlock;
});
