/// <amd-module name='DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory'/>
define("DS/EPSSchematicsCoreLibrary/calculator/EPSSchematicsCoreLibraryCalculatorCategory", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory"], function (require, exports, BlockLibrary, CoreCategory) {
    "use strict";
    const CalculatorCategory = CoreCategory + '/Calculator';
    BlockLibrary.registerCategory(CalculatorCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryCalculatorDoc');
    return CalculatorCategory;
});
