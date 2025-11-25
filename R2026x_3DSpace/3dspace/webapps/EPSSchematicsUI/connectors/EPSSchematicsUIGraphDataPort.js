/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphDataPortView", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphSubDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIDataPort, UIGraphDataPortView, UIGraphSubDataPort, ModelEnums, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI graph data port.
     * @private
     * @class UIGraphDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort
     * @extends UIDataPort
     */
    class UIGraphDataPort extends UIDataPort {
        /**
         * @public
         * @constructor
         * @param {UIGraphDataDrawer} parent - The UI graph data drawer that owns this UI graph data port.
         * @param {DataPort} model - The data port model.
         * @param {boolean} [isInputLocal] - Optionnal parameter for local data port type.
         */
        constructor(parent, model, isInputLocal) {
            super(parent, model);
            this._isInputLocal = isInputLocal ?? false;
            this._setBorderConstraint({
                attach: this.isStartPort() ? EGraphCore.BorderCstr.BOTTOM : EGraphCore.BorderCstr.TOP
            });
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
            this._isInputLocal = undefined;
            super.remove();
        }
        /**
         * Indicates whether the data port label should be displayed on top of the port.
         * @public
         * @abstract
         * @returns {boolean} True if the data port label should be displayed on top of the port else false.
         */
        isDataPortLabelOnTop() {
            return !this.isStartPort();
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UIGraphDataPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the parent graph of the port.
         * @public
         * @returns {UIGraph} The parent graph of the port.
         */
        getParentGraph() {
            return this._parent.getGraph();
        }
        /**
         * Gets the parent of the port.
         * @public
         * @override
         * @returns {UIGraph} The parent of the port.
         */
        getParent() {
            return this._parent.getGraph();
        }
        /**
         * Gets the input local state.
         * @public
         * @returns {boolean} True if the graph data port is an input local port else false.
         */
        getInputLocalState() {
            return this._isInputLocal;
        }
        /**
         * Checks if the port is a start port.
         * @public
         * @returns {boolean} True if the port is a start port else false.
         */
        isStartPort() {
            const portType = this._model.getType();
            return (portType === ModelEnums.EDataPortType.eInput || (portType === ModelEnums.EDataPortType.eLocal && this._isInputLocal));
        }
        /**
         * Projects the specified JSON object to the graph data port.
         * @public
         * @override
         * @param {IJSONDataPortUI} iJSONDataPort - The JSON projected graph data port.
         */
        fromJSON(iJSONDataPort) {
            if (iJSONDataPort !== undefined && Array.isArray(iJSONDataPort.dataPorts)) {
                iJSONDataPort.dataPorts.forEach((dataPort, index) => {
                    const subDataPort = this._subDataPorts[index];
                    if (subDataPort) {
                        const isLocalDataPort = subDataPort.getModel().getType() === ModelEnums.EDataPortType.eLocal;
                        const exposedState = isLocalDataPort ? (this._isInputLocal ? dataPort?.localInput?.show : dataPort?.localOutput?.show) : dataPort?.inside?.show;
                        if (exposedState !== undefined) {
                            subDataPort.setExposedState(exposedState);
                        }
                    }
                });
                this.updateWidth();
            }
        }
        /**
         * Projects the graph data port to the specified JSON object.
         * @public
         * @override
         * @param {IJSONDataPortUI} oJSONDataPort - The JSON projected graph data port.
         */
        toJSON(oJSONDataPort) {
            oJSONDataPort.dataPorts = [];
            this._subDataPorts.forEach(subDataPort => {
                const exposedState = subDataPort.isExposed();
                const isLocalDataPort = subDataPort.getModel().getType() === ModelEnums.EDataPortType.eLocal;
                oJSONDataPort.dataPorts?.push({
                    inside: !isLocalDataPort ? { show: exposedState } : undefined,
                    outside: !isLocalDataPort ? { show: false } : undefined,
                    localInput: isLocalDataPort ? { show: exposedState } : undefined,
                    localOutput: isLocalDataPort ? { show: exposedState } : undefined
                });
            });
        }
        /**
         * Creates the UI sub data port.
         * @public
         * @param {UIGraphDataDrawer} parent - The parent UI graph data drawer.
         * @param {number} index - The index of the sub data port.
         * @param {DataPort} subDataPortModel - The sub data port model.
         * @returns {UIGraphSubDataPort} The created UI sub data port.
         */
        createUISubDataPort(parent, index, subDataPortModel) {
            const subDataPortUI = new UIGraphSubDataPort(this, parent, subDataPortModel);
            this._addSubDataPort(subDataPortUI, index);
            this.updateWidth();
            return subDataPortUI;
        }
        /**
         * Updates the data port width.
         * @public
         * @override
         */
        updateWidth() {
            super.updateWidth();
            this._parent.computeWidth();
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
         * Creates the view of the connector.
         * @protected
         * @override
         * @returns {UIGraphDataPortView} The view of the connector.
         */
        _createView() {
            return new UIGraphDataPortView(this);
        }
        /**
         * The callback on the data port add event.
         * @protected
         * @override
         * @param {DataPortAddEvent} event - The data port add event.
         */
        _onDataPortAdd(event) {
            this.createUISubDataPort(this._parent, event.getIndex(), event.getDataPort());
        }
    }
    return UIGraphDataPort;
});
