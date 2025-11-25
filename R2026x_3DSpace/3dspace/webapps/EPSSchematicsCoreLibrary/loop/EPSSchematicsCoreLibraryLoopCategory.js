/// <amd-module name='DS/EPSSchematicsCoreLibrary/loop/EPSSchematicsCoreLibraryLoopCategory'/>
define("DS/EPSSchematicsCoreLibrary/loop/EPSSchematicsCoreLibraryLoopCategory", ["require", "exports", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, CoreCategory, BlockLibrary) {
    "use strict";
    const LoopCategory = CoreCategory + '/Loop';
    BlockLibrary.registerCategory(LoopCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryLoopDoc');
    return LoopCategory;
});
