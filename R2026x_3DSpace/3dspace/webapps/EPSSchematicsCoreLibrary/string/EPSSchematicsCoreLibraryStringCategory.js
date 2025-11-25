/// <amd-module name='DS/EPSSchematicsCoreLibrary/string/EPSSchematicsCoreLibraryStringCategory'/>
define("DS/EPSSchematicsCoreLibrary/string/EPSSchematicsCoreLibraryStringCategory", ["require", "exports", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, CoreCategory, BlockLibrary) {
    "use strict";
    const StringCategory = CoreCategory + '/String';
    BlockLibrary.registerCategory(StringCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryStringDoc');
    return StringCategory;
});
