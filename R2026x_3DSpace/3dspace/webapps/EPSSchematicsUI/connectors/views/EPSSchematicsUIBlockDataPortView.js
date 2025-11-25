/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/connectors/EPSSchematicsUIBlockDataPort"], function (require, exports, UIDataPortView, UIDom) {
    "use strict";
    /**
     * This class defined a UI block data port view.
     * @private
     * @class UIBlockDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIBlockDataPortView
     * @extends UIDataPortView
     */
    class UIBlockDataPortView extends UIDataPortView {
        /**
         * @public
         * @constructor
         * @param {UIBlockDataPort} port - The UI block data port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Builds the connector SVG element.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The UI connector.
         * @returns {SVGElement} The connector SVG element.
         */
        buildConnElement(connector) {
            super.buildConnElement(connector);
            UIDom.addClassName(this.structure.root, 'sch-block-port');
            if (this._port.isStartPort()) {
                this._createInputConnector(connector);
            }
            else {
                this._createOutputConnector(connector);
            }
            this.updateConnectorWidth();
            return this._element;
        }
        /**
         * Updates the shortcut link display.
         * @public
         * @override
         */
        updateShortcutLinkDisplay() {
            super.updateShortcutLinkDisplay();
            if (this._shortcutText !== undefined) {
                if (this._port.isStartPort()) {
                    const startPort = this._port.getModel().getDataLinks()[0].getStartPort();
                    const graphUI = this._port.getParentGraph();
                    const isSubDataPort = startPort.dataPort !== undefined;
                    const blockModel = isSubDataPort ? startPort.dataPort.block : startPort.block;
                    const isRootGraph = blockModel.graph === undefined;
                    const blockUI = isRootGraph ? graphUI : graphUI.getUIBlockFromModel(blockModel);
                    let dataPortUI;
                    if (isSubDataPort) {
                        const parentDataPortUI = blockUI?.getUIDataPortFromModel(startPort.dataPort);
                        dataPortUI = parentDataPortUI?.getUISubDataPortFromModel(startPort);
                    }
                    else {
                        dataPortUI = blockUI?.getUIDataPortFromModel(startPort);
                    }
                    if (dataPortUI) {
                        const targetPortName = dataPortUI.getName();
                        this._shortcutText.textContent = targetPortName;
                    }
                }
            }
        }
        /**
         * Updates the connector width.
         * @public
         */
        updateConnectorWidth() {
            const subDataPortLength = this._port.getExposedSubDataPorts().length;
            if (this._port.isStartPort()) {
                this._updateInputConnectorWidth(subDataPortLength);
            }
            else {
                this._updateOutputConnectorWidth(subDataPortLength);
            }
        }
    }
    return UIBlockDataPortView;
});
