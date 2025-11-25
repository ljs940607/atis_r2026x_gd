/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIControlPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIControlPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIControlPortDialog", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort"], function (require, exports, UIPort, UICommand, UICommandType, UIControlPortDialog, ModelEnums, Events, EventPort) {
    "use strict";
    /**
     * This class defines a UI control port.
     * @private
     * @abstract
     * @class UIControlPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIControlPort
     * @extends UIPort
     */
    class UIControlPort extends UIPort {
        /**
         * @public
         * @constructor
         * @param {UIBlock|UIGraph} parent - The parent that owns this UI control port.
         * @param {ControlPort} model - The control port model.
         */
        constructor(parent, model) {
            super(parent, model);
            this._onControlPortNameChangeCB = this._onControlPortNameChange.bind(this);
            this._onControlPortEventTypeChangeCB = this._onControlPortEventTypeChange.bind(this);
            this._dialog = new UIControlPortDialog(this);
            this._model.addListener(Events.ControlPortNameChangeEvent, this._onControlPortNameChangeCB);
            this._model.addListener(Events.ControlPortEventTypeChangeEvent, this._onControlPortEventTypeChangeCB);
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
            this._model.removeListener(Events.ControlPortNameChangeEvent, this._onControlPortNameChangeCB);
            this._model.removeListener(Events.ControlPortEventTypeChangeEvent, this._onControlPortEventTypeChangeCB);
            this._onControlPortNameChangeCB = undefined;
            this._onControlPortEventTypeChangeCB = undefined;
            this._dialog = undefined;
            super.remove();
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UIControlPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the port model.
         * @public
         * @override
         * @returns {ControlPort} The port model.
         */
        getModel() {
            return super.getModel();
        }
        /**
         * Gets the parent of the port.
         * @public
         * @override
         * @returns {UIBlock|UIGraph} The parent of the port.
         */
        getParent() {
            return super.getParent();
        }
        /**
         * Gets the list of UI links connected to that port.
         * @public
         * @override
         * @returns {Array<UIControlLink>} The list of UI links connected to that port.
         */
        getLinks() {
            return super.getLinks();
        }
        /**
         * Checks if the port is a start port.
         * @public
         * @returns {boolean} True if the port is a start port else false.
         */
        isStartPort() {
            return this._model.getType() === ModelEnums.EControlPortType.eInput || this._model.getType() === ModelEnums.EControlPortType.eInputEvent;
        }
        /**
         * Checks if the control port is editable or not.
         * @public
         * @override
         * @returns {boolean} True if the control port is editable else false.
         */
        isEditable() {
            return super.isEditable() || (this._model instanceof EventPort && this._model.isEventTypeSettable());
        }
        /**
         * The callback to control port double click event.
         * @public
         */
        openDialog() {
            if (this.isEditable()) {
                this._dialog.open();
            }
        }
        /**
         * Gets the control port dialog.
         * @public
         * @returns {UIControlPortDialog} The control port dialog.
         */
        getDialog() {
            return this._dialog;
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            const commands = super.getCommands();
            if (this._parent.getModel().isControlPortRemovable(this._model)) {
                const viewer = this.getParentGraph().getViewer();
                const isReadOnly = viewer.isReadOnly();
                if (!isReadOnly) {
                    commands.push(new UICommand(UICommandType.eRemove, viewer.deleteSelection.bind(viewer)));
                }
            }
            return commands;
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
         * The callback on the control port name change event.
         * @protected
         * @param {ControlPortNameChangeEvent} _event - The control port name change event.
         */
        _onControlPortNameChange(_event) {
            this.getParentGraph().onModelChange();
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
         * The callback on the control port event type change event.
         * @private
         * @param {ControlPortEventTypeChangeEvent} _event - The control port event type change event.
         */
        _onControlPortEventTypeChange(_event) {
            this.getParentGraph().onModelChange();
        }
    }
    return UIControlPort;
});
