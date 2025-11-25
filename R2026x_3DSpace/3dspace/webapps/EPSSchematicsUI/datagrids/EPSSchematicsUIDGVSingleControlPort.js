/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleControlPort'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleControlPort", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractControlPort", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort"], function (require, exports, UIDGVAbstractControlPort, EventPort) {
    "use strict";
    /**
     * This class defines the UI datagridview single control port.
     * @private
     * @class UIDGVSingleControlPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleControlPort
     * @extends UIDGVAbstractControlPort
     */
    class UIDGVSingleControlPort extends UIDGVAbstractControlPort {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {string} portName - The name of the port.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, blockModel, portName, readOnly) {
            super({
                className: [
                    'sch-datagridview-single-port',
                    'sch-datagridview-single-control-port'
                ]
            }, editor, blockModel, readOnly);
            this._portName = portName;
            this._controlPort = this._blockModel.getControlPortByName(this._portName);
            this._isEventPort = this._controlPort instanceof EventPort;
            this._updateContent();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the data grid view.
         * @public
         * @override
         */
        remove() {
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._portName = undefined;
            this._controlPort = undefined;
            this._isEventPort = undefined;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            this._defineNameColumn();
            this._defineEventTypeColumn();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Updates the data grid view content.
         * @private
         */
        _updateContent() {
            if (this._isEventPort) {
                this._dataGridView.layout.setColumnVisibleFlag('eventType', true);
            }
            const nodeModel = this._createControlPortNodeModel(this._controlPort, false);
            if (nodeModel) {
                this._treeDocument.addRoot(nodeModel);
            }
        }
    }
    return UIDGVSingleControlPort;
});
