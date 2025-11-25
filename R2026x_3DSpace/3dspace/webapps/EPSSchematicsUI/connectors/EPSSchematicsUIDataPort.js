/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortDialog", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortExpandDialog", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIDataPortView", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents"], function (require, exports, UIPort, UIDataPortDialog, UIDataPortExpandDialog, UICommand, UICommandType, UIDataPortView, ModelEnums, TypeLibrary, UITools, Events) {
    "use strict";
    /**
     * This class defines a UI data port.
     * @private
     * @abstract
     * @class UIDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort
     * @extends UIPort
     */
    class UIDataPort extends UIPort {
        /**
         * @public
         * @constructor
         * @param {UIBlock|UIGraphDataDrawer|UIShortcut} parent - The parent UI node that owns this UI data port.
         * @param {DataPort} model - The data port model.
         */
        constructor(parent, model) {
            super(parent, model);
            this._subDataPorts = [];
            this._expandDialog = new UIDataPortExpandDialog(this.getEditor(), this);
            this._shortcutLinks = 0;
            this._isExposed = true;
            this._dialog = new UIDataPortDialog(this);
            this._onDataPortNameChangeCB = this._onDataPortNameChange.bind(this);
            this._onDataPortDefaultValueChangeCB = this._onDataPortDefaultValueChange.bind(this);
            this._onDataPortAddCB = this._onDataPortAdd.bind(this);
            this._onDataPortRemoveCB = this._onDataPortRemove.bind(this);
            this._onDataPortValidityChangeCB = this.getView().onDataPortValidityChange.bind(this.getView());
            this._model.addListener(Events.DataPortNameChangeEvent, this._onDataPortNameChangeCB);
            this._model.addListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            this._model.addListener(Events.DataPortAddEvent, this._onDataPortAddCB);
            this._model.addListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            this._model.addListener(Events.DataPortValidityChangeEvent, this._onDataPortValidityChangeCB);
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
         * Removes the port.
         * @public
         * @override
         */
        remove() {
            this._dialog.remove();
            this._removeSubDataPorts();
            if (this._model !== undefined) {
                this._model.removeListener(Events.DataPortNameChangeEvent, this._onDataPortNameChangeCB);
                this._model.removeListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
                this._model.removeListener(Events.DataPortAddEvent, this._onDataPortAddCB);
                this._model.removeListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
                this._model.removeListener(Events.DataPortValidityChangeEvent, this._onDataPortValidityChangeCB);
            }
            if (this._expandDialog !== undefined) {
                this._expandDialog.remove();
                this._expandDialog = undefined;
            }
            this._dialog = undefined;
            this._shortcutLinks = undefined;
            this._subDataPorts = undefined;
            this._onDataPortNameChangeCB = undefined;
            this._onDataPortDefaultValueChangeCB = undefined;
            this._onDataPortAddCB = undefined;
            this._onDataPortRemoveCB = undefined;
            this._onDataPortValidityChangeCB = undefined;
            super.remove();
        }
        /**
         * Projects the specified JSON object to the data port.
         * @public
         * @override
         * @param {IJSONDataPortUI} iJSONDataPort - The JSON projected data port.
         */
        fromJSON(iJSONDataPort) {
            super.fromJSON(iJSONDataPort);
            if (this._model.isOptional()) {
                const isExposed = iJSONDataPort?.visible || // UI info is available
                    this._model.isOverride() || // Default value is override
                    this._model.getDataLinks(this.getParentGraph().getModel()).length > 0 || // Data port has links
                    this._model.getDataPorts().length > 0; // There are subdata ports available
                this.setExposedState(isExposed);
            }
        }
        /**
         * Projects the data port to the specified JSON object.
         * @public
         * @override
         * @param {IJSONDataPortUI} oJSONDataPort - The JSON projected data port.
         */
        toJSON(oJSONDataPort) {
            super.toJSON(oJSONDataPort);
            if (this._model.isOptional() && this.isExposed()) {
                oJSONDataPort.visible = true;
            }
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UIDataPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the port model.
         * @public
         * @override
         * @returns {DataPort} The port model.
         */
        getModel() {
            return super.getModel();
        }
        /**
         * Gets the list of UI links connected to that port.
         * @public
         * @override
         * @returns {Array<UIDataLink>} The list of UI links connected to that port.
         */
        getLinks() {
            return super.getLinks();
        }
        /**
         * Highlights the data port as a compatible port.
         * @public
         * @param {ModelEnums.ESeverity} severity - The severity of the compatibility.
         */
        compatibilityHighlight(severity) {
            this.getView().compatibilityHighlight(severity);
        }
        /**
         * Unhighlights the data port as a compatible port.
         * @public
         */
        compatibilityUnhighlight() {
            this.getView().compatibilityUnhighlight();
        }
        /**
         * Updates the data port width.
         * @public
         */
        updateWidth() {
            this.getView().updateConnectorWidth();
        }
        /**
         * Gets the list of sub data ports (exposed and unexposed).
         * @public
         * @returns {UISubDataPort[]} The list of sub data ports.
         */
        getAllSubDataPorts() {
            return this._subDataPorts.filter(subDataPort => subDataPort !== undefined);
        }
        /**
         * Gets the list of exposed sub data ports.
         * @public
         * @returns {UISubDataPort[]} The list of exposed sub data ports.
         */
        getExposedSubDataPorts() {
            return this._subDataPorts.filter(subDataPort => subDataPort.isExposed());
        }
        /**
         * Gets the UI sub data port from the provided sud data port model.
         * @public
         * @param {DataPort} subDataPortModel - The sub data port model.
         * @returns {UISubDataPort|undefined} The UI sub data port.
         */
        getUISubDataPortFromModel(subDataPortModel) {
            return this._subDataPorts.find(subDataPort => subDataPort.getModel() === subDataPortModel);
        }
        /**
         * Gets the UI sub data port from the provided name.
         * @public
         * @param {string} name - The sub data port name.
         * @returns {UISubDataPort|undefined} The UI sub data port.
         */
        getUISubDataPortByName(name) {
            return this._subDataPorts.find(subDataPort => subDataPort.getModel().getName() === name);
        }
        /**
         * Gets the shortcut links count.
         * @public
         * @returns {number} The shortcut links count.
         */
        getShorcutLinksCount() {
            return this._shortcutLinks;
        }
        /**
         * Adds a shortcut link.
         * @public
         */
        addShortcutLink() {
            this._shortcutLinks++;
            this.getView().updateShortcutLinkDisplay();
        }
        /**
         * Removes a shortcut link.
         * @public
         */
        removeShortcutLink() {
            this._shortcutLinks--;
            this.getView().updateShortcutLinkDisplay();
        }
        /**
         * Checks if the data port is editable or not.
         * @public
         * @override
         * @returns {boolean} True if the data port is editable else false.
         */
        isEditable() {
            return super.isEditable() || this._model.isValueTypeSettable() || this._model.isDefaultValueSettable();
        }
        /**
         * The callback to port double click event.
         * @public
         */
        openDialog() {
            if (this.isEditable()) {
                this._dialog.open();
            }
        }
        /**
         * Gets the data port dialog.
         * @public
         * @returns {UIDataPortDialog} The data port dialog.
         */
        getDialog() {
            return this._dialog;
        }
        /**
         * Gets the data port expand dialog.
         * @public
         * @returns {UIDataPortExpandDialog} The data port expand dialog.
         */
        getExpandDialog() {
            return this._expandDialog;
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            const commands = super.getCommands();
            const typeLibraryPanel = this.getEditor().getTypeLibraryPanel();
            const typeName = this._model.getValueType();
            const viewer = this.getParentGraph().getViewer();
            const isReadOnly = viewer.isReadOnly();
            if ((this._model.isExpandable() || this._model.isCollapsible()) && !isReadOnly) {
                commands.push(new UICommand(UICommandType.eEditExpandState, event => {
                    this._expandDialog.setMousePosition({ left: event.clientX, top: event.clientY });
                    this._expandDialog.open();
                }));
            }
            commands.push(new UICommand(UICommandType.eOpenTypeDescription, () => { typeLibraryPanel.selectType(typeName); }));
            if (this._model.block.isDataPortRemovable(this._model)) {
                if (!isReadOnly) {
                    commands.push(new UICommand(UICommandType.eRemove, viewer.deleteSelection.bind(viewer)));
                }
            }
            const isDebuggable = UITools.isDataPortDebuggable(this.getEditor(), this._model);
            if (isDebuggable) {
                const index = commands.findIndex(command => command.getCommandType() === UICommandType.eEdit);
                if (index !== -1) {
                    commands.splice(index, 1, new UICommand(UICommandType.eDebug, this.openDialog.bind(this)));
                }
            }
            if (this._model.isOptional()) {
                commands.push(new UICommand(UICommandType.eHideOptionalDataPort, () => {
                    this.setExposedState(false);
                    this.getEditor().getHistoryController().registerHideOptionalDataPortAction();
                }));
            }
            const hasWatchPanel = this.getEditor().getWatchPanel() !== undefined;
            if (hasWatchPanel) {
                commands.push(new UICommand(UICommandType.eAddDataPortToWatch, () => {
                    const dataPortPath = this.getModel().toPath();
                    this.getEditor().getWatchPanel()?.addDataPortToUserScope(dataPortPath);
                }));
            }
            return commands;
        }
        /**
         * Gets the data port bounding box.
         * @public
         * @override
         * @param {IViewpoint} vpt - The current graph viewpoint.
         * @returns {DOMRect} The data port bounding box.
         */
        getBoundingBox(vpt) {
            const portBBox = super.getBoundingBox();
            const subDataPortLength = this.getExposedSubDataPorts().length;
            if (subDataPortLength > 0) {
                const width = subDataPortLength * UIDataPortView.kSpaceBetweenPorts;
                portBBox.width -= width * vpt.scale;
            }
            return portBBox;
        }
        /**
         * Unexpose all UI sub data ports.
         * @public
         */
        unexposeAllUISubDataPorts() {
            this._subDataPorts.forEach(subDataPort => {
                const dataLinks = subDataPort.getModel().getDataLinks();
                if (dataLinks.length === 0) {
                    subDataPort.setExposedState(false);
                }
            });
            this.updateWidth();
        }
        /**
         * Gets the data port value type descriptor.
         * @public
         * @returns {Object} The value type descriptor.
         */
        getValueTypeDescriptor() {
            const valueTypeName = this._model.getValueType();
            const Type = TypeLibrary.getType(this._model.getGraphContext(), valueTypeName);
            let descriptor = {};
            if (TypeLibrary.hasType(this._model.getGraphContext(), valueTypeName, ModelEnums.FTypeCategory.fObject)) {
                descriptor = Type;
            }
            else if (TypeLibrary.hasType(this._model.getGraphContext(), valueTypeName, ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent)) {
                descriptor = Type.descriptor;
            }
            return descriptor;
        }
        /**
         * Checks if the data port is exposed.
         * @public
         * @returns {boolean} True if the data port is exposed else false.
         */
        isExposed() {
            return this._isExposed;
        }
        /**
         * Sets the data port exposed state.
         * @public
         * @param {boolean} exposedState - True to expose the data port, false to unexpose it.
         */
        setExposedState(exposedState) {
            if (this._isExposed !== exposedState) {
                this._isExposed = exposedState;
                if (!exposedState) {
                    this.removeLinks();
                }
                if (this._model.isOptional()) {
                    if (!exposedState) {
                        this._model.collapse();
                        this._model.resetDefaultValue();
                    }
                    this.setVisibility(exposedState);
                }
            }
        }
        /**
         * Checks if the data port is visible or not.
         * @public
         * @returns {boolean} True is the data port is visible else false.
         */
        isVisible() {
            return this.getView().isVisible();
        }
        /**
         * Sets the data port visibility.
         * @public
         * @param {boolean} visible - True to show the data port, false to hide it.
         */
        setVisibility(visible) {
            this.getView().setVisibility(visible);
            this._subDataPorts.forEach(subDataPort => subDataPort.setVisibility(visible));
        }
        /**
         * Triggers a pulse animation on the port.
         * @public
         */
        triggerPulseAnimation() {
            this.getView().triggerPulseAnimation();
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
         * The callback on the data port add event.
         * @protected
         * @param {DataPortAddEvent} _event - The data port add event.
         */
        _onDataPortAdd(_event) {
            this.updateWidth();
            this.getParentGraph().onModelChange();
        }
        /**
         * Adds the provided sub data port to the port.
         * @protected
         * @param {UISubDataPort} subDataPort - The sub data port.
         * @param {number} index - The index of the sub data port.
         */
        _addSubDataPort(subDataPort, index) {
            const UISubDataPortCtr = require('DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort');
            if (subDataPort instanceof UISubDataPortCtr) {
                this._subDataPorts.splice(index, 0, subDataPort);
                this._parent.appendConnector(subDataPort);
                // Check if we are on a graph block with an opened graph view
                const UIGraphBlock = require('DS/EPSSchematicsUI/nodes/EPSSchematicsUIGraphBlock');
                const parentBlock = this.getParent();
                if (parentBlock instanceof UIGraphBlock && parentBlock.isGraphViewOpened()) {
                    subDataPort.setExposedState(false);
                }
            }
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
         * The callback on the data port name change event.
         * @private
         * @param {DataPortNameChangeEvent} _event - The data port name change event.
         */
        _onDataPortNameChange(_event) {
            this.getParentGraph().onModelChange();
        }
        /**
         * The callback on the data port default value change event.
         * @private
         * @param {DataPortDefaultValueChange} _event - The data port default value change event.
         */
        _onDataPortDefaultValueChange(_event) {
            this.getParentGraph().onModelChange();
        }
        /**
         * The callback on the data port remove event.
         * @private
         * @param {DataPortRemoveEvent} event - The data port remove event.
         */
        _onDataPortRemove(event) {
            const subDataPort = this.getUISubDataPortFromModel(event.getDataPort());
            if (subDataPort !== undefined) {
                this._removeSubDataPort(subDataPort);
                this.updateWidth();
            }
            this.getParentGraph().onModelChange();
        }
        /**
         * Removes all sub data ports from the data port.
         * @private
         */
        _removeSubDataPorts() {
            while (this._subDataPorts.length > 0) {
                this._removeSubDataPort(this._subDataPorts[0]);
            }
        }
        /**
         * Removes the provided sub data port from the data port.
         * @private
         * @param {UISubDataPort} subDataPort - The sub data port.
         */
        _removeSubDataPort(subDataPort) {
            const UISubDataPortCtr = require('DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort');
            if (subDataPort instanceof UISubDataPortCtr) {
                const index = this._subDataPorts.indexOf(subDataPort);
                if (index !== -1) {
                    this._subDataPorts.splice(index, 1);
                    subDataPort.remove();
                }
            }
        }
    }
    return UIDataPort;
});
