/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory", ["require", "exports", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, CoreCategory, BlockLibrary) {
    "use strict";
    const FlowCategory = CoreCategory + '/Flow';
    BlockLibrary.registerCategory(FlowCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryFlowDoc');
    return FlowCategory;
});
