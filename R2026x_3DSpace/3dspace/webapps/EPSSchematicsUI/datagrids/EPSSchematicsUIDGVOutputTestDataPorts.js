/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOutputTestDataPorts'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOutputTestDataPorts", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractTestDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIDGVAbstractTestDataPort, ModelEnums) {
    "use strict";
    /**
     * This class defines the UI data grid view output test data ports.
     * @private
     * @class UIDGVOutputTestDataPorts
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOutputTestDataPorts
     * @extends UIDGVAbstractTestDataPort
     */
    class UIDGVOutputTestDataPorts extends UIDGVAbstractTestDataPort {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, blockModel, readOnly) {
            super({ className: 'sch-datagridview-outputtest' }, editor, blockModel, readOnly, 'dataPort');
            this._initialize();
        }
        /**
         * Initializes the data grid view.
         * @protected
         * @override
         */
        _initialize() {
            this._dataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eOutput);
            super._initialize();
        }
    }
    return UIDGVOutputTestDataPorts;
});
