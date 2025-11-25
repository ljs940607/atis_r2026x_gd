/// <amd-module name='DS/EPSSchematicsCoreLibrary/json/EPSSchematicsCoreLibraryJSONCategory'/>
define("DS/EPSSchematicsCoreLibrary/json/EPSSchematicsCoreLibraryJSONCategory", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory"], function (require, exports, BlockLibrary, CoreCategory) {
    "use strict";
    const JSONCategory = CoreCategory + '/JSON';
    BlockLibrary.registerCategory(JSONCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryJSONDoc');
    return JSONCategory;
});
