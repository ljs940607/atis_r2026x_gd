/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestSubDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestSubDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphSubDataPort", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestSubDataPortView", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphTestSubDataPortBorderCstr", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog"], function (require, exports, UIGraphSubDataPort, ModelEnums, UIGraphTestSubDataPortView, EGraphCore, UIGraphTestSubDataPortBorderCstr, UICommand, UICommandType, UISingleTestDataPortDialog) {
    "use strict";
    /**
     * This class defines a UI graph test sub data port.
     * @private
     * @class UIGraphTestSubDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestSubDataPort
     * @extends UIGraphSubDataPort
     */
    class UIGraphTestSubDataPort extends UIGraphSubDataPort {
        /**
         * @public
         * @constructor
         * @param {UIGraphTestDataPort} parentPort - The parent UI graph test data port.
         * @param {UIGraphDataTestDrawer} parent - The parent UI graph test data drawer.
         * @param {DataPort} model - The data port model.
         */
        constructor(parentPort, parent, model) {
            super(parentPort, parent, model);
            this._setBorderConstraint({
                cstr: new UIGraphTestSubDataPortBorderCstr(this),
                attach: this.isStartPort() ? EGraphCore.BorderCstr.TOP : EGraphCore.BorderCstr.BOTTOM
            });
            const editor = this.getEditor();
            this._testDataPortDialog = new UISingleTestDataPortDialog(editor, model);
        }
        /**
         * Removes the port.
         * @public
         * @override
         */
        remove() {
            if (this._testDataPortDialog !== undefined) {
                this._testDataPortDialog.remove();
            }
            this._testDataPortDialog = undefined;
            super.remove();
        }
        /**
         * Get the graph data test dialog.
         * @public
         * @returns {UISingleTestDataPortDialog} The graph data test dialog.
         */
        getTestDialog() {
            return this._testDataPortDialog;
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UIGraphTestSubDataPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Checks if the sub data port is a start port.
         * @public
         * @override
         * @returns {boolean} True if the sub data port is a start port else false.
         */
        isStartPort() {
            const portType = this._model.getType();
            return portType === ModelEnums.EDataPortType.eInput;
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            const commands = [];
            commands.push(new UICommand(UICommandType.eEdit, this.onConnectorDoubleClick.bind(this)));
            return commands;
        }
        /**
         * The callback on the connector double click event.
         * @public
         */
        onConnectorDoubleClick() {
            this._testDataPortDialog.open();
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @override
         * @returns {UIGraphTestSubDataPortView} The view of the connector.
         */
        _createView() {
            return new UIGraphTestSubDataPortView(this);
        }
    }
    return UIGraphTestSubDataPort;
});
