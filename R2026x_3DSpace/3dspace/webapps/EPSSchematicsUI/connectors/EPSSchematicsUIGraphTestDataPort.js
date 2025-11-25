/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphDataPort", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphTestDataPortView", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestSubDataPort", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIGraphDataPort, UIGraphTestDataPortView, UIGraphTestSubDataPort, UICommand, UICommandType, UISingleTestDataPortDialog, ModelEnums, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI graph test data port.
     * @private
     * @class UIGraphTestDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphTestDataPort
     * @extends UIGraphDataPort
     */
    class UIGraphTestDataPort extends UIGraphDataPort {
        /**
         * @public
         * @constructor
         * @param {UIGraphDataTestDrawer} parent - The UI graph input test drawer.
         * @param {DataPort} model - The data port model.
         */
        constructor(parent, model) {
            super(parent, model, false);
            this._setBorderConstraint({
                attach: this.isStartPort() ? EGraphCore.BorderCstr.TOP : EGraphCore.BorderCstr.BOTTOM
            });
            const editor = this.getEditor();
            this._testDataPortDialog = new UISingleTestDataPortDialog(editor, this._model);
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
         * @returns {UIValidationDialog} The graph data test dialog.
         */
        getTestDialog() {
            return this._testDataPortDialog;
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UIGraphTestDataPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Checks if the data port is a start port.
         * @public
         * @override
         * @returns {boolean} True if the data port is a start port else false.
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
         * Creates the UI sub data port.
         * @public
         * @override
         * @param {UIGraphDataTestDrawer} parent - The parent UI graph test data drawer.
         * @param {number} index - The index of the sub data port.
         * @param {DataPort} subDataPortModel - The sub data port model.
         * @returns {UIGraphTestSubDataPort} The creates UI sub data port.
         */
        createUISubDataPort(parent, index, subDataPortModel) {
            const subDataPortUI = new UIGraphTestSubDataPort(this, parent, subDataPortModel);
            this._addSubDataPort(subDataPortUI, index);
            if (!this.isVisible()) {
                subDataPortUI.setVisibility(false);
            }
            this.updateWidth();
            return subDataPortUI;
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @override
         * @returns {UIGraphTestDataPortView} The view of the connector.
         */
        _createView() {
            return new UIGraphTestDataPortView(this);
        }
    }
    return UIGraphTestDataPort;
});
