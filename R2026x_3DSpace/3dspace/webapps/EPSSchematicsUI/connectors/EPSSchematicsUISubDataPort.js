/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType"], function (require, exports, UIDataPort, UICommand, UICommandType) {
    "use strict";
    /**
     * This class defines a UI sub data port.
     * @abstract
     * @private
     * @class UISubDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUISubDataPort
     * @extends UIDataPort
     */
    class UISubDataPort extends UIDataPort {
        /**
         * @public
         * @constructor
         * @param {UIDataPort} parentPort - The parent UI data port that owns this sub data port.
         * @param {UIBlock|UIGraphDataDrawer} parent - The parent of this sub data port.
         * @param {DataPort} model - The data port model.
         */
        constructor(parentPort, parent, model) {
            super(parent, model);
            this._parentPort = parentPort;
        }
        /**
         * Removes the port.
         * @public
         * @override
         */
        remove() {
            this._parentPort = undefined;
            super.remove();
        }
        /**
         * Gets the view of the of.
         * @public
         * @override
         * @returns {UISubDataPortView} The view of the port.
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
         * Gets the parent port of the sub data port.
         * @public
         * @returns {UIDataPort} the parent port of the sub data port.
         */
        getParentPort() {
            return this._parentPort;
        }
        /**
         * Gets the name of the sub data port.
         * @public
         * @override
         * @returns {string} The name of the sub data port.
         */
        getName() {
            return this._model.dataPort.getName() + '.' + this._model.getName();
        }
        /**
         * Gets the list of available commands.
         * @public
         * @override
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            const commands = super.getCommands();
            const isReadOnly = this._parentPort.getParentGraph().getViewer().isReadOnly();
            if (this._model.dataPort.isDataPortRemovable(this._model) && !isReadOnly) {
                commands.push(new UICommand(UICommandType.eHideProperty, this._onRemoveSubDataPort.bind(this)));
            }
            return commands;
        }
        /**
         * Sets the data port exposed state.
         * @public
         * @override
         * @param {boolean} exposedState - True to expose the data port, false to unexpose it.
         */
        setExposedState(exposedState) {
            super.setExposedState(exposedState);
            if (this._parentPort.isVisible()) {
                this.setVisibility(exposedState);
            }
        }
    }
    return UISubDataPort;
});
