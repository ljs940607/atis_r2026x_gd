/// <amd-module name='DS/EPSSchematicsUI/geometries/EPSSchematicsUIGraphGeometry'/>
define("DS/EPSSchematicsUI/geometries/EPSSchematicsUIGraphGeometry", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This class defines the graph geometry.
     * @private
     * @class UIGraphGeometry
     * @alias module:DS/EPSSchematicsUI/geometries/EPSSchematicsUIGraphGeometry
     */
    class UIGraphGeometry {
        /**
         * @public
         * @constructor
         * @param {number} left - The left position of the graph.
         * @param {number} top - The top position of the graph.
         * @param {number} width - The graph's width.
         * @param {number} height - The graph's height.
         */
        constructor(left, top, width, height) {
            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;
        }
        /**
         * The callback on the graph geometry update.
         * @public
         * @param {EGraphCore.Group} graph - The graph to update.
         */
        onupdate(graph) {
            graph.multiset('actualLeft', this.left, 'actualTop', this.top, 'actualWidth', this.width, 'actualHeight', this.height);
        }
    }
    return UIGraphGeometry;
});
