/// <amd-module name='DS/EPSSchematicsCSI/EPSSchematicsCSICategory'/>
define("DS/EPSSchematicsCSI/EPSSchematicsCSICategory", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, BlockLibrary) {
    "use strict";
    var CSICategory = 'CSI';
    BlockLibrary.registerCategory(CSICategory, 'text!DS/EPSSchematicsCSI/assets/EPSSchematicsCSICategoryDoc.json');
    return CSICategory;
});
