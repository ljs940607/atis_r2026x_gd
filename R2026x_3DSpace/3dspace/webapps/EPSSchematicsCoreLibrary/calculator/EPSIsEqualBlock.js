/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSIsEqualBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSIsEqualBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, Block, ControlPortDefinitions, DataPortDefinitions, Enums, CalculatorCategory) {
    "use strict";
    class IsEqualBlock extends Block {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('True'),
                new ControlPortDefinitions.Output('False')
            ]);
            const dataPortValue1 = this.createDataPort(new DataPortDefinitions.InputAll('Value1', 'Double', {
                'Boolean': false,
                'Double': 0.0,
                'Integer': 0,
                'String': ''
            }));
            this.createDataPort(new DataPortDefinitions.InputRef('Value2', dataPortValue1, {
                'Boolean': false,
                'Double': 0.0,
                'Integer': 0,
                'String': ''
            }));
        }
        execute() {
            const value1 = this.getInputDataPortValue('Value1');
            const value2 = this.getInputDataPortValue('Value2');
            const isEqual = IsEqualBlock._compare(value1, value2);
            if (isEqual) {
                this.activateOutputControlPort('True');
            }
            else {
                this.activateOutputControlPort('False');
            }
            return Enums.EExecutionResult.eExecutionFinished;
        }
        static _compare(value1, value2) {
            let result = false;
            if (value1 === value2) {
                result = true;
            }
            else if (value1 instanceof Object) {
                if (Array.isArray(value1)) {
                    result = IsEqualBlock._arrayCompare(value1, value2);
                }
                else {
                    result = IsEqualBlock._objectCompare(value1, value2);
                }
            }
            return result;
        }
        static _arrayCompare(array1, array2) {
            return (array1.length === array2.length) &&
                array1.every((element, index) => IsEqualBlock._compare(element, array2[index]));
        }
        static _objectCompare(obj1, obj2) {
            let result = false;
            if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2)) {
                result = false;
            }
            else if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                result = false;
            }
            else {
                result = true;
                for (let name in obj1) {
                    if (obj1.hasOwnProperty(name) !== obj2.hasOwnProperty(name)) {
                        result = false;
                        break;
                    }
                    else {
                        const isEqual = IsEqualBlock._compare(obj1[name], obj2[name]);
                        if (!isEqual) {
                            result = false;
                            break;
                        }
                    }
                }
            }
            return result;
        }
    }
    IsEqualBlock.prototype.uid = 'eeb7840e-75a0-4464-9497-55acfd240af7';
    IsEqualBlock.prototype.name = 'Is Equal';
    IsEqualBlock.prototype.category = CalculatorCategory;
    IsEqualBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSIsEqualBlockDoc';
    return IsEqualBlock;
});
