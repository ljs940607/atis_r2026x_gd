/// <amd-module name='DS/EPSSchematicsCoreLibrary/EPSESeverityType'/>
define("DS/EPSSchematicsCoreLibrary/EPSESeverityType", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary"], function (require, exports, Enums, TypeLibrary) {
    "use strict";
    TypeLibrary.registerGlobalEnumType('ESeverity', Enums.ESeverity);
    return Enums.ESeverity;
});
