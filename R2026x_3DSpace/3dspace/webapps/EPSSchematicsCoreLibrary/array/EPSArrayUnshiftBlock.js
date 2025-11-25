/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayUnshiftBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayUnshiftBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, Enums, ValueTypeRules, ArrayCategory) {
    "use strict";
    class ArrayUnshiftBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('ArrayIn', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputRefArrayValue('Value1', dataPortArray, {
                    'Boolean': false,
                    'Double': 0.0,
                    'Integer': 0,
                    'String': ''
                }),
                new DataPortDefinitions.OutputRef('ArrayOut', dataPortArray)
            ]);
            this.setDataPortInputRules({
                name: { prefix: 'Value', readonly: true },
                valueTypes: new ValueTypeRules.RefArrayValue(dataPortArray)
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
            const arrayIn = this.getInputDataPortValue('ArrayIn');
            if (arrayIn === undefined) {
                throw new Error('The data port ArrayIn is undefined!');
            }
            const inputDataPortNames = this.getInputDataPortNameList();
            const values = [];
            for (let i = 1; i < inputDataPortNames.length; i++) {
                const inputDataPortName = inputDataPortNames[i];
                const value = this.getInputDataPortValue(inputDataPortName);
                if (value === undefined) {
                    throw new Error('The data port ' + inputDataPortName + ' is undefined!');
                }
                values.push(value);
            }
            Array.prototype.unshift.apply(arrayIn, values);
            this.setOutputDataPortValue('ArrayOut', arrayIn);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayUnshiftBlock.prototype.uid = 'dab97f85-e94e-4f58-a061-bee3fad06f3e';
    ArrayUnshiftBlock.prototype.name = 'Array Unshift';
    ArrayUnshiftBlock.prototype.category = ArrayCategory;
    ArrayUnshiftBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayUnshiftBlockDoc';
    return ArrayUnshiftBlock;
});
