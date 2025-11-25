/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort", "DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockDataPortBorderCstr", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockDataPortView", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockSubDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIDataPort, UIBlockDataPortBorderCstr, UIBlockDataPortView, UIBlockSubDataPort, ModelEnums, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI block data port.
     * @private
     * @class UIBlockDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockDataPort
     * @extends UIDataPort
     */
    class UIBlockDataPort extends UIDataPort {
        /**
         * @public
         * @constructor
         * @param {UIBlock} block - The UI block that owns this UI block data port.
         * @param {DataPort} model - The data port model.
         */
        constructor(block, model) {
            super(block, model);
            this._setBorderConstraint({
                cstr: new UIBlockDataPortBorderCstr(this),
                attach: this.isStartPort() ? EGraphCore.BorderCstr.TOP : EGraphCore.BorderCstr.BOTTOM
            });
            this._buildFromModel();
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
         * Indicates whether the data port label should be displayed on top of the port.
         * @public
         * @abstract
         * @returns {boolean} True if the data port label should be displayed on top of the port else false.
         */
        isDataPortLabelOnTop() {
            return this.isStartPort();
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
         * Checks if the port is a start port.
         * @public
         * @returns {boolean} True if the port is a start port else false.
         */
        isStartPort() {
            return this._model.getType() === ModelEnums.EDataPortType.eInput || this._model.getType() === ModelEnums.EDataPortType.eInputExternal;
        }
        /**
         * Projects the specified JSON object to the block data port.
         * @public
         * @override
         * @param {IJSONDataPortUI} iJSONDataPort - The JSON projected block data port.
         */
        fromJSON(iJSONDataPort) {
            super.fromJSON(iJSONDataPort);
            if (iJSONDataPort?.dataPorts) {
                iJSONDataPort.dataPorts.forEach((dataPort, index) => {
                    const subDataPort = this._subDataPorts[index];
                    if (subDataPort) {
                        const exposedState = dataPort?.outside?.show || true;
                        subDataPort.setExposedState(exposedState);
                        if (dataPort?.outside?.label) {
                            const label = subDataPort.createPersistentLabel();
                            label.fromJSON(dataPort.outside.label);
                        }
                    }
                });
                this.updateWidth();
            }
        }
        /**
         * Projects the block data port to the specified JSON object.
         * @public
         * @override
         * @param {IJSONDataPortUI} oJSONDataPort - The JSON projected block data port.
         */
        toJSON(oJSONDataPort) {
            super.toJSON(oJSONDataPort);
            if (this._subDataPorts.length) {
                oJSONDataPort.dataPorts = [];
                this._subDataPorts.forEach(subDataPort => {
                    const oJSONPort = { dataPorts: [] };
                    subDataPort.toJSON(oJSONPort);
                    if (oJSONDataPort.dataPorts) {
                        oJSONDataPort.dataPorts.push({
                            //inside: { show: false },
                            outside: { show: subDataPort.isExposed(), label: oJSONPort.label }
                        });
                    }
                });
            }
        }
        /**
         * Creates the UI block sub data port.
         * @public
         * @param {DataPort} subDataPortModel - The sub data port model.
         * @param {number} index - The sub data port index.
         * @returns {UIBlockSubDataPort} The UI block sub data port.
         */
        createUIBlockSubDataPort(subDataPortModel, index) {
            const subDataPort = new UIBlockSubDataPort(this, this._parent, subDataPortModel);
            this._addSubDataPort(subDataPort, index);
            return subDataPort;
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
        /**
         * Sets the data port exposed state.
         * @public
         * @override
         * @param {boolean} exposedState - True to expose the data port, false to unexpose it.
         */
        setExposedState(exposedState) {
            super.setExposedState(exposedState);
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
         * @returns {UIBlockDataPortView} The view of the connector.
         */
        _createView() {
            return new UIBlockDataPortView(this);
        }
        /**
         * The callback on the data port add event.
         * @protected
         * @override
         * @param {DataPortAddEvent} event - The data port add event.
         */
        _onDataPortAdd(event) {
            this.createUIBlockSubDataPort(event.getDataPort(), event.getIndex());
            this.updateWidth();
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
         * Builds the block data port from the model.
         * For template instance, we synchronize the number of data ports.
         * @private
         */
        _buildFromModel() {
            this._model.getDataPorts().forEach((dataPort, index) => {
                this.createUIBlockSubDataPort(dataPort, index);
            });
            if (this._model.isOptional()) {
                const hasLink = this._model.getDataLinks().length > 0;
                const isDefaultValueOverride = this._model.isOverride();
                const hasSubDataPorts = this._model.getDataPorts().length > 0;
                const exposedState = hasLink || isDefaultValueOverride || hasSubDataPorts;
                this.setExposedState(exposedState);
            }
        }
    }
    return UIBlockDataPort;
});
