/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleDataPort'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleDataPort", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVSinglePort"], function (require, exports, UIDGVAbstractDataItem, Events) {
    "use strict";
    /**
     * This class defines the UI data grid view single data port.
     * @private
     * @class UIDGVSingleDataPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleDataPort
     * @extends UIDGVAbstractDataItem
     */
    class UIDGVSingleDataPort extends UIDGVAbstractDataItem {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {string} path - The data port model path.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, blockModel, path, readOnly) {
            super({
                className: [
                    'sch-datagridview-single-port',
                    'sch-datagridview-single-data-port'
                ]
            }, editor, blockModel, readOnly, 'dataPort', 'defaultValue');
            this._onDataPortDefaultValueChangeCB = this._onDataPortDefaultValueChange.bind(this);
            this._onDataPortOverrideChangeCB = this._onDataPortOverrideChange.bind(this);
            this._dataPortPath = path;
            this._dataPort = this._blockModel.getObjectFromPath(this._dataPortPath);
            this._dataPort.addListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            this._dataPort.addListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
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
            this._dataPort.removeListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            this._dataPort.removeListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._dataPortPath = undefined;
            this._dataPort = undefined;
            this._onDataPortDefaultValueChangeCB = undefined;
            this._onDataPortOverrideChangeCB = undefined;
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
            this._defineValueTypeColumn();
            this._defineDefaultValueColumn();
            this._defineActionsColumn();
        }
        /**
         * The callback on the model data port default value change event.
         * @protected
         * @param {Events.DataPortDefaultValueChangeEvent} event - The model data port default value change event.
         */
        _onDataPortDefaultValueChange(event) {
            const dataPort = event.getDataPort();
            const nodeModel = this._treeDocument.getRoots()[0];
            UIDGVAbstractDataItem._onDataItemDefaultValueChange(dataPort, nodeModel);
        }
        /**
         * The callback on the model data port override change event.
         * @protected
         * @param {Events.DataPortOverrideChangeEvent} _event - The model data port override change event.
         */
        _onDataPortOverrideChange(_event) {
            const nodeModel = this._treeDocument.getRoots()[0];
            UIDGVAbstractDataItem._onDataItemOverrideChange(nodeModel);
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
            this._renameCSIDefaultValueDGVColumn(this._editor, this._dataPort);
            this._hideColumnsForOutputDataPortTypeOrSubDataPort(this._dataPort.getType(), this._dataPort.dataPort !== undefined);
            const nodeModel = this._createDataItemNodeModel(this._dataPort, 'defaultValue', false);
            if (nodeModel) {
                this._treeDocument.addRoot(nodeModel);
            }
        }
    }
    return UIDGVSingleDataPort;
});
