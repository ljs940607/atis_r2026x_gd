/// <amd-module name='DS/EPSSchematicsCoreLibrary/time/EPSSchematicsCoreLibraryTimeCategory'/>
define("DS/EPSSchematicsCoreLibrary/time/EPSSchematicsCoreLibraryTimeCategory", ["require", "exports", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, CoreCategory, BlockLibrary) {
    "use strict";
    const TimeCategory = CoreCategory + '/Time';
    BlockLibrary.registerCategory(TimeCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryTimeDoc');
    return TimeCategory;
});
