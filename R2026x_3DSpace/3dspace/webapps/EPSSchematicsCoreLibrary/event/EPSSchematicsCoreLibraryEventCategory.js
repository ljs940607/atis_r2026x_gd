/// <amd-module name='DS/EPSSchematicsCoreLibrary/event/EPSSchematicsCoreLibraryEventCategory'/>
define("DS/EPSSchematicsCoreLibrary/event/EPSSchematicsCoreLibraryEventCategory", ["require", "exports", "DS/EPSSchematicsCoreLibrary/EPSSchematicsCoreLibraryCoreCategory", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, CoreCategory, BlockLibrary) {
    "use strict";
    const EventCategory = CoreCategory + '/Event';
    BlockLibrary.registerCategory(EventCategory, 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSCategoryEventDoc');
    return EventCategory;
});
