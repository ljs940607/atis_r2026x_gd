/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIDataPort", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIShortcutDataPortView", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIDataPort, UIShortcutDataPortView, EGraphCore) {
    "use strict";
    /**
     * This class defines a UI shortcut data port.
     * @private
     * @class UIShortcutDataPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort
     * @extends UIDataPort
     */
    class UIShortcutDataPort extends UIDataPort {
        /**
         * @public
         * @constructor
         * @param {UIShortcut} parent - The parent UI shortcut.
         * @param {DataPort} model - The data port model.
         * @param {EShortcutType} shortcutType - The shortcut type.
         */
        constructor(parent, model, shortcutType) {
            super(parent, model);
            this._shortcutType = shortcutType;
            this._startPortState = this._shortcutType === 0 /* UIEnums.EShortcutType.eStartPort */;
            this._setBorderConstraint({
                attach: this._startPortState ? EGraphCore.BorderCstr.BOTTOM : EGraphCore.BorderCstr.TOP,
                offset: 10,
                aoffy: this._startPortState ? -14 : -7
            });
        }
        /**
         * Removes the connector.
         * @public
         * @override
         */
        remove() {
            this._shortcutType = undefined;
            this._startPortState = undefined;
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
         * Gets the parent of the port.
         * @public
         * @override
         * @returns {UIShortcut} The parent of the port.
         */
        getParent() {
            return super.getParent();
        }
        /**
         * Gets the parent port of the shortcut.
         * @public
         * @returns {UIDataPort} The parent port of the shortcut.
         */
        getParentPort() {
            return this.getParent().getDataPortUI();
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
            return this._startPortState;
        }
        /**
         * Gets the shortcut type.
         * @private
         * @returns {ShortcutType} The shortcut type.
         */
        getShortcutType() {
            return this._shortcutType;
        }
        /**
         * Checks if the port is editable or not.
         * @private
         * @override
         * @returns {boolean} True if the port is editable else false.
         */
        // eslint-disable-next-line class-methods-use-this
        isEditable() {
            return false;
        }
        /**
         * Converts the shortcut data port to a graph relative path.
         * @public
         * @returns {string} The relative shortcut data port path.
         */
        toPath() {
            const graph = this._parent.getGraph();
            return graph.getModel().toPath(this.getParentGraph().getModel()) + '.shortcuts[' + graph.getShortcuts().indexOf(this.getParent()) + ']';
        }
        /**
         * Gets the port name.
         * @public
         * @override
         * @returns {string} The port name.
         */
        getName() {
            return this._parent.getDataPortUI().getName();
        }
        /**
         * Reroutes the shortcut UI links on the data port reference.
         * @public
         */
        rerouteUILinksOnRef() {
            const viewer = this.getParentGraph().getViewer();
            const links = this.getLinks();
            links.forEach(link => {
                let startPort = link.getStartPort();
                let endPort = link.getEndPort();
                const refPort = this._parent.getDataPortUI();
                viewer.removeLinkFromViewer(link);
                refPort.removeShortcutLink();
                if (startPort === this) {
                    startPort = refPort;
                    link.setStartPort(startPort);
                }
                else if (endPort === this) {
                    endPort = refPort;
                    link.setEndPort(endPort);
                }
                link.setView(link.createView());
                viewer.addLinkToViewer(startPort, endPort, link);
            });
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @override
         * @returns {UIShortcutDataPortView} The view of the connector.
         */
        _createView() {
            return new UIShortcutDataPortView(this);
        }
    }
    return UIShortcutDataPort;
});
