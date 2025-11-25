/// <amd-module name='DS/EPSSchematicsCoreLibrary/debug/EPSSchematicsCoreLibraryDebugCategory'/>
define("DS/EPSSchematicsCoreLibrary/debug/EPSSchematicsCoreLibraryDebugCategory", ["require", "exports", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, CoreCategory, BlockLibrary) {
    "use strict";
    const DebugCategory = CoreCategory + '/Debug';
    BlockLibrary.registerCategory(DebugCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryDebugDoc');
    return DebugCategory;
});
