/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTestDataPorts'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTestDataPorts", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractTestDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIDGVAbstractTestDataPort, ModelEnums) {
    "use strict";
    /**
     * This class defines the UI data grid view input test data ports.
     * @private
     * @class UIDGVInputTestDataPorts
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTestDataPorts
     * @extends UIDGVAbstractTestDataPort
     */
    class UIDGVInputTestDataPorts extends UIDGVAbstractTestDataPort {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, blockModel, readOnly) {
            super({ className: 'sch-datagridview-inputtest' }, editor, blockModel, readOnly, 'dataPort');
            this._initialize();
        }
        /**
         * Initializes the data grid view.
         * @protected
         * @override
         */
        _initialize() {
            this._dataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eInput);
            super._initialize();
        }
    }
    return UIDGVInputTestDataPorts;
});
