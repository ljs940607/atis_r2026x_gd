/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayPushBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayPushBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, ArrayCategory) {
    "use strict";
    class ArrayPushBlock extends DynamicBlock {
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
            Array.prototype.push.apply(arrayIn, values);
            this.setOutputDataPortValue('ArrayOut', arrayIn);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayPushBlock.prototype.uid = '513d5d58-82e8-464a-9a6d-bc3dc0a9166b';
    ArrayPushBlock.prototype.name = 'Array Push';
    ArrayPushBlock.prototype.category = ArrayCategory;
    ArrayPushBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayPushBlockDoc';
    return ArrayPushBlock;
});
