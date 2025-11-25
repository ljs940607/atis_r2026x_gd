/// <amd-module name='DS/EPSSchematicsCoreLibrary/EPSEExecutionStateType'/>
define("DS/EPSSchematicsCoreLibrary/EPSEExecutionStateType", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary"], function (require, exports, TypeLibrary) {
    "use strict";
    const EExecutionState = {
        eSuccess: 0,
        eError: 1,
        eRunning: 2
    };
    Object.freeze(EExecutionState);
    TypeLibrary.registerGlobalEnumType('EExecutionState', EExecutionState);
    return EExecutionState;
});
