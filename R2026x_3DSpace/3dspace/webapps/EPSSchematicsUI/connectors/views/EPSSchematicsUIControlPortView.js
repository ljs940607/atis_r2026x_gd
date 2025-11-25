/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPortView"], function (require, exports, UIPortView) {
    "use strict";
    /**
     * This class defines a UI control port view.
     * @private
     * @class UIControlPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView
     * @extends UIPortView
     */
    class UIControlPortView extends UIPortView {
        /**
         * @public
         * @constructor
         * @param {UIControlPort} port - The UI control port.
         */
        constructor(port) {
            super(port);
        }
    }
    return UIControlPortView;
});
