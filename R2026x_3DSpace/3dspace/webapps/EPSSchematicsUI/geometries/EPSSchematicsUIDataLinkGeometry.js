/// <amd-module name='DS/EPSSchematicsUI/geometries/EPSSchematicsUIDataLinkGeometry'/>
define("DS/EPSSchematicsUI/geometries/EPSSchematicsUIDataLinkGeometry", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphSubDataPort", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort"], function (require, exports, UIGraphDataPort, UIGraphSubDataPort, UIShortcutDataPort) {
    "use strict";
    /**
     * This class defines a UI data link geometry.
     * @private
     * @class UIDataLinkGeometry
     * @alias module:DS/EPSSchematicsUI/geometries/EPSSchematicsUIDataLinkGeometry
     */
    class UIDataLinkGeometry {
        // Removed readonly so Dataflow mode can change this parameter
        static { this.K_MINIMIZEDLINKLENGTH = 10; }
        static { this.K_MINTANGENTLENGTH = 120; }
        /**
         * @public
         * @constructor
         */
        constructor() { }
        /**
         * The callback on the data link geometry update.
         * @public
         * @param {EGraphCore.Edge} edge - The edge to update.
         */
        // eslint-disable-next-line class-methods-use-this
        onupdate(edge) {
            const uiElement = edge.cl1.c.data.uiElement;
            const isGraphOrShortcut = uiElement instanceof UIGraphDataPort || uiElement instanceof UIGraphSubDataPort || uiElement instanceof UIShortcutDataPort;
            const isStartPort = uiElement.isStartPort();
            let c1, c2;
            if (isGraphOrShortcut) {
                c1 = isStartPort ? edge.cl1.c : edge.cl2.c;
                c2 = isStartPort ? edge.cl2.c : edge.cl1.c;
            }
            else {
                c1 = isStartPort ? edge.cl2.c : edge.cl1.c;
                c2 = isStartPort ? edge.cl1.c : edge.cl2.c;
            }
            const start = { x: c1.aleft, y: c1.atop };
            const end = { x: c2.aleft, y: c2.atop };
            const sx = start.x;
            const sy = start.y + UIDataLinkGeometry.K_MINIMIZEDLINKLENGTH;
            const tx = end.x;
            const ty = end.y - UIDataLinkGeometry.K_MINIMIZEDLINKLENGTH;
            const an1x = c1.anormx;
            const an1y = c1.anormy;
            const an2x = c2.anormx;
            const an2y = c2.anormy;
            const dx = Math.max(UIDataLinkGeometry.K_MINTANGENTLENGTH, Math.abs(tx - sx));
            const dy = Math.max(UIDataLinkGeometry.K_MINTANGENTLENGTH, Math.abs(ty - sy));
            const x1 = sx + dx * an1x / 2;
            const y1 = sy + dy * an1y / 2;
            const x2 = tx + dx * an2x / 2;
            const y2 = ty + dy * an2y / 2;
            const newPath = [
                0 /* EGraphCore.PathCmd.M */, start.x, start.y,
                1 /* EGraphCore.PathCmd.L */, sx, sy,
                2 /* EGraphCore.PathCmd.C */, tx, ty, x1, y1, x2, y2,
                1 /* EGraphCore.PathCmd.L */, end.x, end.y
            ];
            edge.set('path', newPath);
        }
    }
    return UIDataLinkGeometry;
});
