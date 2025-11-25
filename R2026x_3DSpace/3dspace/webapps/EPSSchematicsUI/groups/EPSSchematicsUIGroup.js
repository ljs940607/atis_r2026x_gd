/// <amd-module name='DS/EPSSchematicsUI/groups/EPSSchematicsUIGroup'/>
define("DS/EPSSchematicsUI/groups/EPSSchematicsUIGroup", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUINodeView"], function (require, exports, EGraphCore, UINodeView) {
    "use strict";
    /**
     * This class defines a UI group.
     * @private
     * @class UIGroup
     * @alias module:DS/EPSSchematicsUI/groups/EPSSchematicsUIGroup
     */
    class UIGroup {
        /**
         * @public
         * @constructor
         * @param {UIEGraphViewer} viewer - The viewer.
         */
        constructor(viewer) {
            this.viewer = viewer;
            this.editor = this.viewer.getEditor();
            this.display = new EGraphCore.Group();
            this.display.data = { graph: this }; // TODO: Check if we can be more generic and call it uiElement
        }
        /**
         * Removes the group.
         * @public
         */
        remove() {
            this.display = undefined;
            this.viewer = undefined;
            this.editor = undefined;
        }
        /**
         * Gets the group display.
         * @public
         * @returns {EGraphCore.Group} The group display.
         */
        getDisplay() {
            return this.display;
        }
        /**
         * Sets the main view of the group.
         * @public
         * @param {UINodeView} view - The main view of the group.
         */
        setView(view) {
            if (view !== undefined && view instanceof UINodeView) {
                this.display.views.main = view;
            }
        }
        /**
         * Gets the viewer.
         * @returns {UIEGraphViewer} The viewer.
         */
        getViewer() {
            return this.viewer;
        }
        /**
         * Gets the editor.
         * @public
         * @returns {UIEditor} The editor.
         */
        getEditor() {
            return this.viewer.getEditor();
        }
        /**
         * Gets the left position of the group.
         * @public
         * @returns {number} The left position of the group.
         */
        getLeft() {
            return this.display.actualLeft;
        }
        /**
         * Gets the top position of the group.
         * @public
         * @returns {number} The top position of the group.
         */
        getTop() {
            return this.display.actualTop;
        }
        /**
         * Gets the height of the group.
         * @public
         * @returns {number} The height of the group.
         */
        getHeight() {
            return this.display.actualHeight;
        }
        /**
         * Gets the width of the group.
         * @public
         * @returns {number} The width of the group.
         */
        getWidth() {
            return this.display.actualWidth;
        }
        /**
         * Sets the left position of the group.
         * @public
         * @param {number} left - The left position of the group.
         */
        setLeft(left) {
            this.display.multiset(['geometry', 'left'], left, 'left', 0, 'actualLeft', left);
        }
        /**
         * Sets the top position of the group.
         * @public
         * @param {number} top - The top position of the group.
         */
        setTop(top) {
            this.display.multiset(['geometry', 'top'], top, 'top', 0, 'actualTop', top);
        }
        /**
         * Sets the height of the group.
         * @public
         * @param {number} height - The height of the group.
         */
        setHeight(height) {
            this.display.multiset(['geometry', 'height'], height, 'height', height, 'actualHeight', height);
        }
        /**
         * Sets the width of the group.
         * @public
         * @param {number} width - The width of the group.
         */
        setWidth(width) {
            this.display.multiset(['geometry', 'width'], width, 'width', width, 'actualWidth', width);
        }
    }
    return UIGroup;
});
