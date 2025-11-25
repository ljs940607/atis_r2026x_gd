/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSConditionBlock'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSConditionBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsDataPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsSettingDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory"], function (require, exports, DynamicBlock, ControlPortDefinitions, DataPortDefinitions, SettingDefinitions, Events, Enums, CalculatorCategory) {
    "use strict";
    class ConditionBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('True'),
                new ControlPortDefinitions.Output('False')
            ]);
            this.createDataPort(new DataPortDefinitions.InputAll('Value1', 'Double', {
                'Boolean': false,
                'Double': 0.0,
                'Integer': 0,
                'String': ''
            }));
            this.createDataPort(new DataPortDefinitions.InputAll('Value2', 'Double', {
                'Boolean': false,
                'Double': 0.0,
                'Integer': 0,
                'String': ''
            }));
            this.setDataPortInputRules({
                name: { prefix: 'Value', readonly: true }
            });
            this.setDataPortOutputRules({ dynamicCount: 0 });
            this.setDataPortLocalRules({ dynamicCount: 0 });
            this.setDataPortInputExternalRules({ dynamicCount: 0 });
            this.setControlPortInputRules({ dynamicCount: 0 });
            this.setControlPortOutputRules({ dynamicCount: 0 });
            this.setEventPortInputRules({ dynamicCount: 0 });
            this.setEventPortOutputRules({ dynamicCount: 0 });
            this.setSettingRules({ dynamicCount: 0 });
            const setting = this.createSetting(new SettingDefinitions.Basic('Expression', 'String', 'Value1 === Value2'));
            setting.addListener(Events.SettingValueChangeEvent, this._onSettingChange.bind(this));
            this._onSettingChange();
        }
        _onSettingChange() {
            // Initialize the execution script
            let executionScript = '(function (runParams) {\n';
            const expression = this._computeExpression();
            executionScript += 'this.activateOutputControlPort(' + expression + ' ? \'True\' : \'False\');';
            // Function return
            executionScript += 'return Enums.EExecutionResult.eExecutionFinished;\n';
            executionScript += '});';
            // Evaluate to get execute function
            try {
                this.execute = eval(executionScript); // eslint-disable-line
            }
            catch (e) {
                // eslint-disable-next-line no-console
                console.log(e);
                this.execute = function () {
                    return Enums.EExecutionResult.eExecutionError;
                };
            }
        }
        _computeExpression() {
            let result = false;
            let expression = this.getSettingByName('Expression').getValue();
            if (expression) {
                // Find single and double quotes indices
                // var quotePattern = new RegExp(/'((?:\\.|[^'])*)'|"((?:\\.|[^"])*)"/, 'igm');
                // RegExp compatible with ES5
                const quotePattern = new RegExp('\'((?:\\\\.|[^\'])*)\'|"((?:\\\\.|[^"])*)"', 'igm');
                let quoteMatch;
                const quotes = [];
                while (null !== (quoteMatch = quotePattern.exec(expression))) {
                    quotes.push({
                        startIndex: quoteMatch.index,
                        endIndex: quotePattern.lastIndex
                    });
                }
                // Replace only unquoted values
                // var valuePattern = new RegExp(/Value\d+/, 'g');
                // RegExp compatible with ES5
                const valuePattern = new RegExp('Value\\d+', 'g');
                expression = expression.replace(valuePattern, function (match, index) {
                    var res = match;
                    if (!ConditionBlock._isQuoted(quotes, index, index + match.length)) {
                        res = 'this.getInputDataPortValue("' + match + '")';
                    }
                    return res;
                });
                result = expression;
            }
            return result;
        }
        static _isQuoted(quotes, startIndex, endIndex) {
            for (let q = 0; q < quotes.length; q++) {
                const quote = quotes[q];
                if (startIndex > quote.startIndex && endIndex < quote.endIndex) {
                    return true;
                }
            }
            return false;
        }
    }
    ConditionBlock.prototype.uid = 'cc1fbcb5-5645-4b9d-b680-644f0d09db2d';
    ConditionBlock.prototype.name = 'Condition';
    ConditionBlock.prototype.category = CalculatorCategory;
    ConditionBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSConditionBlockDoc';
    return ConditionBlock;
});
