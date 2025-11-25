/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockSubDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockSubDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockSubDataPortBorderCstr", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockSubDataPortView", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock"], function (require, exports, UISubDataPort, EGraphCore, UIBlockSubDataPortBorderCstr, UIBlockSubDataPortView, ModelEnums, GraphBlock) {
    "use strict";
    /**
     * This class defines a UI block sub data port.
     * @private
     * @class UIBlockSubDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIBlockSubDataPort
     * @extends UISubDataPort
     */
    class UIBlockSubDataPort extends UISubDataPort {
        /**
         * @public
         * @constructor
         * @param {UIBlockDataPort} parentPort - The parent UI block data port.
         * @param {UIBlock} parent - The parent UI block.
         * @param {DataPort} model - The data port model.
         */
        constructor(parentPort, parent, model) {
            super(parentPort, parent, model);
            this._setBorderConstraint({
                cstr: new UIBlockSubDataPortBorderCstr(this),
                attach: this.getParentPort().isStartPort() ? EGraphCore.BorderCstr.TOP : EGraphCore.BorderCstr.BOTTOM
            });
        }
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
         * Checks if the port is a start port.
         * @public
         * @returns {boolean} True if the port is a start port else false.
         */
        isStartPort() {
            return this._model.getType() === ModelEnums.EDataPortType.eInput || this._model.getType() === ModelEnums.EDataPortType.eInputExternal;
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @abstract
         * @returns {UIBlockSubDataPortView} The view of the connector.
         */
        _createView() {
            return new UIBlockSubDataPortView(this);
        }
        /**
         * The callback of the remove sub data port command.
         * It removes the subdata port from the model for blocks.
         * For graph blocks, it checks weither the external sub data port is not exposed before removing it.
         * @protected
         * @override
         */
        _onRemoveSubDataPort() {
            let removeFromModel = true;
            const isGraphBlock = this._model.block instanceof GraphBlock;
            if (isGraphBlock) {
                const parentUIPort = this.getParentPort();
                const parentUIGraphBlock = parentUIPort.getParent();
                const portIndex = parentUIGraphBlock.getModel().getDataPorts().indexOf(parentUIPort.getModel());
                const subDataPortindex = parentUIPort.getModel().getDataPorts().indexOf(this._model);
                const internalExposedState = parentUIGraphBlock.getInternalSubDataPortExposedState(portIndex, subDataPortindex);
                if (internalExposedState) {
                    removeFromModel = false;
                    this.setExposedState(false);
                    parentUIPort.updateWidth();
                }
            }
            if (removeFromModel) {
                this._model.dataPort.removeDataPort(this._model);
            }
        }
    }
    return UIBlockSubDataPort;
});
