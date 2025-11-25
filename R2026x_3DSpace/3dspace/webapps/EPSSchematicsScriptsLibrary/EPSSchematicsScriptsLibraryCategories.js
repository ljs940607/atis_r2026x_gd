/// <amd-module name='DS/EPSSchematicsScriptsLibrary/EPSSchematicsScriptsLibraryCategories'/>
define("DS/EPSSchematicsScriptsLibrary/EPSSchematicsScriptsLibraryCategories", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory"], function (require, exports, BlockLibrary, CoreCategory) {
    "use strict";
    var ScriptCategory = CoreCategory + '/Script';
    BlockLibrary.registerCategory(ScriptCategory, 'i18n!DS/EPSSchematicsScriptsLibrary/assets/nls/EPSCategoryScriptDoc');
    return ScriptCategory;
});
