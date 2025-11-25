/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphSubDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphSubDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphSubDataPortView", "DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphSubDataPortBorderCstr", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsGraphBlock", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UISubDataPort, UIGraphSubDataPortView, UIGraphSubDataPortBorderCstr, ModelEnums, GraphBlock, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI graph sub data port.
     * @private
     * @class UIGraphSubDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphSubDataPort
     * @extends UISubDataPort
     */
    class UIGraphSubDataPort extends UISubDataPort {
        /**
         * @public
         * @constructor
         * @param {UIGraphDataPort} parentPort - The parent UI graph data port.
         * @param {UIGraphDataDrawer} parent - The parent UI graph data drawer.
         * @param {DataPort} model - The data port model.
         */
        constructor(parentPort, parent, model) {
            super(parentPort, parent, model);
            this._setBorderConstraint({
                cstr: new UIGraphSubDataPortBorderCstr(this),
                attach: this.getParentPort().isStartPort() ? EGraphCore.BorderCstr.BOTTOM : EGraphCore.BorderCstr.TOP
            });
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
         * Checks if the port is a start port.
         * @public
         * @returns {boolean} True if the port is a start port else false.
         */
        isStartPort() {
            const portType = this._model.getType();
            return (portType === ModelEnums.EDataPortType.eInput || (portType === ModelEnums.EDataPortType.eLocal && this._parent.getInputLocalState() === true));
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @abstract
         * @returns {UIGraphSubDataPortView} The view of the connector.
         */
        _createView() {
            return new UIGraphSubDataPortView(this);
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
            const parentUIPort = this.getParentPort();
            const isLocalPort = parentUIPort.getModel().getType() === ModelEnums.EDataPortType.eLocal;
            if (isGraphBlock && !isLocalPort) {
                const parentGraph = parentUIPort.getParentGraph();
                const graphBlock = parentGraph.getBlockView();
                if (graphBlock !== undefined) {
                    const graphBlockPort = graphBlock.getUIDataPortFromModel(parentUIPort.getModel());
                    const graphBlocksubDataPort = graphBlockPort?.getUISubDataPortFromModel(this._model);
                    const externalExposedState = graphBlocksubDataPort?.isExposed();
                    if (externalExposedState) {
                        removeFromModel = false;
                        this.setExposedState(false);
                        parentUIPort.updateWidth();
                    }
                }
            }
            if (removeFromModel) {
                this._model.dataPort.removeDataPort(this._model);
            }
        }
    }
    return UIGraphSubDataPort;
});
