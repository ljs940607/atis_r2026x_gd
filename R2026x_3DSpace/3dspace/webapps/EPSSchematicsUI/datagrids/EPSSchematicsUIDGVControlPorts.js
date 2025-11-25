/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVControlPorts'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVControlPorts", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractControlPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsUI/tools/EPSSchematicsUINLSTools", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVControlPort"], function (require, exports, UIDGVAbstractControlPort, ModelEnums, Events, UINLSTools) {
    "use strict";
    /**
     * This class defines the UI datagridview for control ports.
     * @private
     * @class UIDGVControlPorts
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVControlPorts
     * @extends UIDGVAbstractControlPort
     */
    class UIDGVControlPorts extends UIDGVAbstractControlPort {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, blockModel, readOnly) {
            super({ className: 'sch-datagridview-controlport' }, editor, blockModel, readOnly);
            this._onControlPortAddCB = this._onControlPortAdd.bind(this);
            this._onControlPortRemoveCB = this._onControlPortRemove.bind(this);
            this._updateContent();
            this._blockModel.addListener(Events.ControlPortAddEvent, this._onControlPortAddCB);
            this._blockModel.addListener(Events.ControlPortRemoveEvent, this._onControlPortRemoveCB);
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
            this._blockModel.removeListener(Events.ControlPortAddEvent, this._onControlPortAddCB);
            this._blockModel.removeListener(Events.ControlPortRemoveEvent, this._onControlPortRemoveCB);
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._icpNodeModel = undefined;
            this._ocpNodeModel = undefined;
            this._iepNodeModel = undefined;
            this._oepNodeModel = undefined;
            this._onControlPortAddCB = undefined;
            this._onControlPortRemoveCB = undefined;
        }
        /**
         * Gets the section node model from the provided control port type.
         * @publicgetSectionNodeModelFromPortType
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         * @returns {WUXTreeNodeModel|undefined} The corresponding section node model.
         */
        getSectionNodeModelFromPortType(portType) {
            let nodeModel;
            if (portType === ModelEnums.EControlPortType.eInput) {
                nodeModel = this._icpNodeModel;
            }
            else if (portType === ModelEnums.EControlPortType.eOutput) {
                nodeModel = this._ocpNodeModel;
            }
            else if (portType === ModelEnums.EControlPortType.eInputEvent) {
                nodeModel = this._iepNodeModel;
            }
            else if (portType === ModelEnums.EControlPortType.eOutputEvent) {
                nodeModel = this._oepNodeModel;
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
            this._defineEventTypeColumn();
            this._defineSectionActionsColumn();
        }
        /**
         * Creates a control port node model.
         * @protected
         * @override
         * @param {ControlPort} controlPort - The control port model.
         * @param {boolean} hasSectionActions - Whether to create the section actions.
         * @returns {WUXTreeNodeModel|undefined} The created control node model.
         */
        _createControlPortNodeModel(controlPort, hasSectionActions) {
            const nodeModel = super._createControlPortNodeModel(controlPort, hasSectionActions);
            if (nodeModel) {
                const portType = controlPort.getType();
                const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
                if (sectionNodeModel) {
                    sectionNodeModel.addChild(nodeModel);
                    sectionNodeModel.expand();
                    this._updateSectionNodeModelLabel(portType);
                }
            }
            return nodeModel;
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
            this._icpNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eInput);
            this._updateSectionNodeModelLabel(ModelEnums.EControlPortType.eInput);
            this._ocpNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eOutput);
            this._updateSectionNodeModelLabel(ModelEnums.EControlPortType.eOutput);
            this._iepNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eInputEvent);
            this._updateSectionNodeModelLabel(ModelEnums.EControlPortType.eInputEvent);
            this._oepNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eOutputEvent);
            this._updateSectionNodeModelLabel(ModelEnums.EControlPortType.eOutputEvent);
            const inputControlPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eInput);
            inputControlPorts.forEach(icp => this._createControlPortNodeModel(icp, true));
            const outputControlPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eOutput);
            outputControlPorts.forEach(ocp => this._createControlPortNodeModel(ocp, true));
            const inputEventPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eInputEvent);
            inputEventPorts.forEach(iep => this._createControlPortNodeModel(iep, true));
            const outputEventPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eOutputEvent);
            outputEventPorts.forEach(oep => this._createControlPortNodeModel(oep, true));
        }
        /**
         * Updates the section node model label.
         * @private
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         */
        _updateSectionNodeModelLabel(portType) {
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            if (sectionNodeModel) {
                const count = sectionNodeModel.getChildren()?.length || 0;
                const label = UINLSTools.getControlPortsNLSName(portType) + ' (' + count + ')';
                sectionNodeModel.setLabel(label);
            }
        }
        /**
          * The callback on the model control port add event.
          * @private
          * @param {Events.ControlPortAddEvent} event - The model control port add event.
          */
        _onControlPortAdd(event) {
            const controlPort = event.getControlPort();
            this._createControlPortNodeModel(controlPort, true);
        }
        /**
         * The callback on the model control port remove event.
         * @private
         * @param {Events.ControlPortRemoveEvent} event - The model control port remove event.
         */
        _onControlPortRemove(event) {
            const controlPort = event.getControlPort();
            const portType = controlPort.getType();
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            if (sectionNodeModel) {
                const portNodeModel = sectionNodeModel.getChildren().find(node => node.getAttributeValue('controlPort') === controlPort);
                if (portNodeModel) {
                    sectionNodeModel.removeChild(portNodeModel);
                }
                this._updateSectionNodeModelLabel(portType);
            }
        }
    }
    return UIDGVControlPorts;
});
