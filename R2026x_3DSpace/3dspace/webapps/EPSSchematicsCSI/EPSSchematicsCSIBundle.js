/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSIBundle'/>
define("DS/EPSSchematicsCSI/EPSSchematicsCSIBundle", ["require", "exports", "DS/EPSSchematicsCSI/EPSSchematicsCSIIntrospection", "DS/EPSSchematicsCSI/typings/CSIJSONToolsWeb/EPSSCSIGrammarUpgrader"], function (require, exports, CSIIntrospection, CSIGrammarUpgrader) {
    "use strict";
    var CSIBundle = /** @class */ (function () {
        function CSIBundle() {
        }
        /**
         * Registers introspection content: CSIType and CSIFunction.
         * @public
         * @param {IBundleArguments} iArguments - The bundle arguments.
         */
        CSIBundle.registerContent = function (iArguments) {
            var content = CSIGrammarUpgrader.upgradeObject(iArguments.content);
            var functions = [];
            content.pools.forEach(function (pool) {
                pool.functions.forEach(function (fct) {
                    fct.pool = pool.name;
                    functions.push(fct);
                });
            });
            CSIIntrospection.registerContent({
                types: content.types,
                functions: functions,
                onSuccess: iArguments.onSuccess,
                onWarning: iArguments.onWarning,
                onError: iArguments.onError
            });
        };
        return CSIBundle;
    }());
    return CSIBundle;
});
