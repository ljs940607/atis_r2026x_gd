/// <amd-module name='DS/EPSSchematicsCoreLibrary/array/EPSArrayInsertBlock'/>
define("DS/EPSSchematicsCoreLibrary/array/EPSArrayInsertBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsValueTypeRules", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/array/EPSSchematicsCoreLibraryArrayCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, ValueTypeRules, Enums, ArrayCategory) {
    "use strict";
    class ArrayInsertBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
            const dataPortArray = this.createDataPort(new DataPortDefinitions.InputCategory('ArrayIn', Enums.FTypeCategory.fArray, 'Array<Double>'));
            this.createDataPorts([
                new DataPortDefinitions.InputCategory('Index', Enums.FTypeCategory.fNumerical, 'Integer'),
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
            const index = this.getInputDataPortValue('Index');
            if (index === undefined) {
                throw new Error('The data port Index is undefined!');
            }
            if (index < 0 || index > arrayIn.length) {
                throw new Error('The data port Index is out of range!');
            }
            const inputDataPortNames = this.getInputDataPortNameList();
            const values = [];
            for (let i = 2; i < inputDataPortNames.length; i++) {
                const inputDataPortName = inputDataPortNames[i];
                const value = this.getInputDataPortValue(inputDataPortName);
                if (value === undefined) {
                    throw new Error('The data port ' + inputDataPortName + ' is undefined!');
                }
                values.push(value);
            }
            arrayIn.splice(index, 0, ...values);
            this.setOutputDataPortValue('ArrayOut', arrayIn);
            this.activateOutputControlPort('Out');
            return Enums.EExecutionResult.eExecutionFinished;
        }
    }
    ArrayInsertBlock.prototype.uid = 'ac561ac8-5693-4033-bd3b-bf4e2142ca20';
    ArrayInsertBlock.prototype.name = 'Array Insert';
    ArrayInsertBlock.prototype.category = ArrayCategory;
    ArrayInsertBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSArrayInsertBlockDoc';
    return ArrayInsertBlock;
});
