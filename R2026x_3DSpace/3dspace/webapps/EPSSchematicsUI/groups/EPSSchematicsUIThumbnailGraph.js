/// <amd-module name='DS/EPSSchematicsUI/groups/EPSSchematicsUIThumbnailGraph'/>
define("DS/EPSSchematicsUI/groups/EPSSchematicsUIThumbnailGraph", ["require", "exports", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGroup"], function (require, exports, UIGroup) {
    "use strict";
    /**
     * This class defines a UI thumbnail graph.
     * @private
     * @class UIThumbnailGraph
     * @alias module:DS/EPSSchematicsUI/groups/EPSSchematicsUIThumbnailGraph
     * @extends UIGroup
     */
    class UIThumbnailGraph extends UIGroup {
        /**
         * @public
         * @constructor
         * @param {UIThumbnailViewer} viewer - The thumbnail viewer.
         * @param {GraphBlock} model - The graph block model.
         */
        constructor(viewer, model) {
            super(viewer);
            this.model = model;
        }
        /**
         * Gets the graph block model.
         * @public
         * @returns {GraphBlock} The graph block model.
         */
        getModel() {
            return this.model;
        }
        /**
         * The callback on the UI change event.
         * @public
         */
        // eslint-disable-next-line class-methods-use-this
        onUIChange() { }
    }
    return UIThumbnailGraph;
});
