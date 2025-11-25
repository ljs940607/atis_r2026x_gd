/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPorts'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPorts", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem", "DS/EPSSchematicsUI/tools/EPSSchematicsUINLSTools", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVDataPort"], function (require, exports, UIDGVAbstractDataItem, UINLSTools, Events, ModelEnums) {
    "use strict";
    // TODO: Remove and change the display of object editor tweaker in default value column for object type!
    // TODO: Remove the section actions column if data ports are not addable nor removable!
    // (ie the call parameters in CSI execution graph drawer)
    /**
     * This class defines the UI data grid view data port.
     * @private
     * @class UIDGVProtoDataPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPorts
     * @extends UIDGVAbstractDataItem
     */
    class UIDGVDataPorts extends UIDGVAbstractDataItem {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         * @param {EDataPortType} [portTypeSection] - The data port type section to display.
         */
        constructor(editor, blockModel, readOnly, portTypeSection) {
            super({ className: 'sch-datagridview-dataport' }, editor, blockModel, readOnly, 'dataPort', 'defaultValue');
            this._onDataPortAddCB = this._onDataPortAdd.bind(this);
            this._onDataPortRemoveCB = this._onDataPortRemove.bind(this);
            this._onDataPortDefaultValueChangeCB = this._onDataPortDefaultValueChange.bind(this);
            this._onDataPortOverrideChangeCB = this._onDataPortOverrideChange.bind(this);
            this._portTypeSection = portTypeSection;
            this._updateContent();
            this._blockModel.addListener(Events.DataPortAddEvent, this._onDataPortAddCB);
            this._blockModel.addListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
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
            this._blockModel.removeListener(Events.DataPortAddEvent, this._onDataPortAddCB);
            this._blockModel.removeListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            this._blockModel.getDataPorts().forEach(dp => {
                dp.removeListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
                dp.removeListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
            });
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._portTypeSection = undefined;
            this._idpSectionNodeModel = undefined;
            this._iedpSectionNodeModel = undefined;
            this._odpSectionNodeModel = undefined;
            this._ldpSectionNodeModel = undefined;
            this._onDataPortAddCB = undefined;
            this._onDataPortRemoveCB = undefined;
            this._onDataPortDefaultValueChangeCB = undefined;
            this._onDataPortOverrideChangeCB = undefined;
        }
        /**
         * Gets the section node model from the provided data port type.
         * @public
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @returns {WUXTreeNodeModel|undefined} The corresponding section node model.
         */
        getSectionNodeModelFromPortType(portType) {
            let nodeModel;
            if (portType === ModelEnums.EDataPortType.eInput) {
                nodeModel = this._idpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eInputExternal) {
                nodeModel = this._iedpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                nodeModel = this._odpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                nodeModel = this._ldpSectionNodeModel;
            }
            return nodeModel;
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
            this._defineSectionActionsColumn();
        }
        /**
         * The callback on the model data port default value change event.
         * @protected
         * @param {Events.DataPortDefaultValueChangeEvent} event - The model data port default value change event.
         */
        _onDataPortDefaultValueChange(event) {
            const dataPort = event.getDataPort();
            const nodeModel = this._getNodeModelFromDataPortModel(dataPort);
            UIDGVAbstractDataItem._onDataItemDefaultValueChange(dataPort, nodeModel);
        }
        /**
         * The callback on the model data port override change event.
         * @protected
         * @param {Events.DataPortOverrideChangeEvent} event - The model data port override change event.
         */
        _onDataPortOverrideChange(event) {
            const dataPort = event.getDataPort();
            const nodeModel = this._getNodeModelFromDataPortModel(dataPort);
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
            if (this._portTypeSection === undefined || this._portTypeSection === ModelEnums.EDataPortType.eInput) {
                this._idpSectionNodeModel = this._createSectionNodeModel(ModelEnums.EDataPortType.eInput);
                const inputDataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eInput);
                inputDataPorts.forEach(idp => this._createDataPortNodeModel(idp));
                this._updateSectionNodeModelLabel(ModelEnums.EDataPortType.eInput);
            }
            const isRootBlock = this._blockModel.graph === undefined;
            if ((this._portTypeSection === undefined && !isRootBlock) || this._portTypeSection === ModelEnums.EDataPortType.eInputExternal) {
                this._iedpSectionNodeModel = this._createSectionNodeModel(ModelEnums.EDataPortType.eInputExternal);
                const inputExternalDataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eInputExternal);
                inputExternalDataPorts.forEach(iedp => this._createDataPortNodeModel(iedp));
                this._updateSectionNodeModelLabel(ModelEnums.EDataPortType.eInputExternal);
            }
            if (this._portTypeSection === undefined || this._portTypeSection === ModelEnums.EDataPortType.eOutput) {
                this._odpSectionNodeModel = this._createSectionNodeModel(ModelEnums.EDataPortType.eOutput);
                const outputDataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eOutput);
                outputDataPorts.forEach(odp => this._createDataPortNodeModel(odp));
                this._updateSectionNodeModelLabel(ModelEnums.EDataPortType.eOutput);
            }
            if (this._portTypeSection === undefined || this._portTypeSection === ModelEnums.EDataPortType.eLocal) {
                this._ldpSectionNodeModel = this._createSectionNodeModel(ModelEnums.EDataPortType.eLocal);
                const localDataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eLocal);
                localDataPorts.forEach(ldp => this._createDataPortNodeModel(ldp));
                this._updateSectionNodeModelLabel(ModelEnums.EDataPortType.eLocal);
            }
            // Hide columns for output data port type only
            this._hideColumnsForOutputDataPortTypeOrSubDataPort(this._portTypeSection, false);
            // Rename default value column header for CSI case
            const firstDataPort = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eInput)[0];
            this._renameCSIDefaultValueDGVColumn(this._editor, firstDataPort);
        }
        /**
         * Creates a data port node model.
         * @private
         * @param {DataPort} dataPort - The data port model.
         * @returns {WUXTreeNodeModel|undefined} The created data node model.
         */
        _createDataPortNodeModel(dataPort) {
            let nodeModel = this._createDataItemNodeModel(dataPort, 'defaultValue', true);
            if (nodeModel !== undefined) {
                const portType = dataPort.getType();
                const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
                if (sectionNodeModel) {
                    sectionNodeModel.addChild(nodeModel);
                    sectionNodeModel.expand();
                    this._updateSectionNodeModelLabel(portType);
                    dataPort.addListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
                    dataPort.addListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
                }
            }
            return nodeModel;
        }
        /**
         * Updates the section node model label.
         * @private
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         */
        _updateSectionNodeModelLabel(portType) {
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            if (sectionNodeModel) {
                const count = sectionNodeModel.getChildren()?.length || 0;
                const label = UINLSTools.getDataPortsNLSName(portType) + ' (' + count + ')';
                sectionNodeModel.setLabel(label);
            }
        }
        /**
          * The callback on the model data port add event.
          * @private
          * @param {Events.DataPortAddEvent} event - The model data port add event.
          */
        _onDataPortAdd(event) {
            const dataPort = event.getDataPort();
            this._createDataPortNodeModel(dataPort);
        }
        /**
         * The callback on the model data port remove event.
         * @private
         * @param {Events.DataPortRemoveEvent} event - The model data port remove event.
         */
        _onDataPortRemove(event) {
            const dataPort = event.getDataPort();
            dataPort.removeListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            dataPort.removeListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
            const portType = dataPort.getType();
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            if (sectionNodeModel) {
                const childrenNodeModel = sectionNodeModel.getChildren() || [];
                const portNodeModel = childrenNodeModel.find(node => node.getAttributeValue('dataPort') === dataPort);
                if (portNodeModel) {
                    sectionNodeModel.removeChild(portNodeModel);
                }
                this._updateSectionNodeModelLabel(portType);
            }
        }
        /**
         * Gets the node model from the given data port model.
         * @private
         * @param {DataPort} dataPort - The data port model.
         * @returns {WUXTreeNodeModel|undefined} The corresponding node model.
         */
        _getNodeModelFromDataPortModel(dataPort) {
            let nodeModel;
            let sectionNodeModel;
            const portType = dataPort.getType();
            if (portType === ModelEnums.EDataPortType.eInput) {
                sectionNodeModel = this._idpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eInputExternal) {
                sectionNodeModel = this._iedpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                sectionNodeModel = this._odpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                sectionNodeModel = this._ldpSectionNodeModel;
            }
            if (sectionNodeModel) {
                nodeModel = (sectionNodeModel.getChildren() || []).find(child => child.getAttributeValue('dataPort') === dataPort);
            }
            return nodeModel;
        }
    }
    return UIDGVDataPorts;
});
