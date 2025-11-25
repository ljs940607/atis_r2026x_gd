/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleTestDataPort'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleTestDataPort", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractTestDataPort"], function (require, exports, UIDGVAbstractTestDataPort) {
    "use strict";
    /**
     * This class defines the UI data grid view single test data port.
     * @private
     * @class UIDGVSingleTestDataPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleTestDataPort
     * @extends UIDGVAbstractTestDataPort
     */
    class UIDGVSingleTestDataPort extends UIDGVAbstractTestDataPort {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @param {DataPort} dataPort - The data port.
         */
        constructor(editor, blockModel, readOnly, dataPort) {
            super({ className: 'sch-datagridview-inputtest' }, editor, blockModel, readOnly, 'dataPort');
            this._dataPort = dataPort;
            this._initialize();
        }
        /**
         * Removes the data grid view.
         * @public
         * @override
         */
        remove() {
            this._dataPort = undefined;
            super.remove();
        }
        /**
         * Initializes the data grid view.
         * @protected
         * @override
         */
        _initialize() {
            this._dataPorts = [this._dataPort];
            super._initialize();
        }
    }
    return UIDGVSingleTestDataPort;
});
