/// <amd-module name='DS/EPSSchematicsUI/data/EPSSchematicsUIShapes'/>
define("DS/EPSSchematicsUI/data/EPSSchematicsUIShapes", ["require", "exports", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUIShapes.json"], function (require, exports, UIShapesJSON) {
    "use strict";
    const JSONShapes = JSON.parse(UIShapesJSON);
    /**
     * The class defines the UI Shapes.
     * @class UIShapes
     * @alias module:DS/EPSSchematicsUI/data/EPSSchematicsUIShapes
     * @abstract
     * @private
     */
    class UIShapes {
        static { this.controlPortPolygonPoints = JSONShapes.controlPortPolygonPoints; }
        static { this.inputDataPortPolygonPoints = JSONShapes.inputDataPortPolygonPoints; }
        static { this.inputExternalDataPortPolygonPoints = JSONShapes.inputExternalDataPortPolygonPoints; }
        static { this.outputDataPortPolygonPoints = JSONShapes.outputDataPortPolygonPoints; }
        static { this.inputDataPortStretchablePolygonPoints = JSONShapes.inputDataPortStretchablePolygonPoints; }
        static { this.inputExternalDataPortStretchablePolygonPoints = JSONShapes.inputExternalDataPortStretchablePolygonPoints; }
        static { this.inputDataPortStretchableReversedPolygonPoints = JSONShapes.inputDataPortStretchableReversedPolygonPoints; }
        static { this.outputDataPortStretchablePolygonPoints = JSONShapes.outputDataPortStretchablePolygonPoints; }
        static { this.outputDataPortStretchableReversedPolygonPoints = JSONShapes.outputDataPortStretchableReversedPolygonPoints; } // TODO: points not implemenated yet!
        static { this.graphTestDataPortPathPoints = JSONShapes.graphTestDataPortPathPoints; }
        static { this.stretchableGraphTestDataPortPathPoints = JSONShapes.stretchableGraphTestDataPortPathPoints; }
        static { this.stretchableReversedGraphTestDataPortPathPoints = JSONShapes.stretchableReversedGraphTestDataPortPathPoints; }
        static { this.inputSubDataPortPolygonPoints = JSONShapes.inputSubDataPortPolygonPoints; }
        static { this.inputExternalSubDataPortPolygonPoints = JSONShapes.inputExternalSubDataPortPolygonPoints; }
        static { this.outputSubDataPortPolygonPoints = JSONShapes.outputSubDataPortPolygonPoints; }
        static { this.shortcutIconPathPoints = JSONShapes.shortcutIconPathPoints; }
        static { this.eventPortPathPoints = JSONShapes.eventPortPathPoints; }
        static { this.eventPortPathPointsOrignal = JSONShapes.eventPortPathPointsOrignal; }
        static { this.eventPortPathPoints01 = JSONShapes.eventPortPathPoints01; }
        static { this.eventPortPathPoints02 = JSONShapes.eventPortPathPoints02; }
        static { this.eventPortPathPointsArondi = JSONShapes.eventPortPathPointsArondi; }
        static { this.eventPortPathPointsWifi = JSONShapes.eventPortPathPointsWifi; }
        static { this.castLevelLossLessPathPoints = JSONShapes.castLevelLossLessPathPoints; }
        static { this.castLevelLossyPathPoints = JSONShapes.castLevelLossyPathPoints; }
        static { this.castLevelInvalidPathPoints = JSONShapes.castLevelInvalidPathPoints; }
        static { this.castLevelBackgroundPathPoints = JSONShapes.castLevelBackgroundPathPoints; }
        static { this.minimizedCastLevelCrossPathPoints = JSONShapes.minimizedCastLevelCrossPathPoints; }
    }
    return UIShapes;
});
