/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIConnector", "DS/EPSSchematicsUI/nodes/EPSSchematicsUIPersistentLabel", "DS/EPSSchematicsUI/edges/EPSSchematicsUILink", "DS/EPSSchematicsUI/data/EPSSchematicsUICommand", "DS/EPSSchematicsUI/data/EPSSchematicsUICommandType"], function (require, exports, UIConnector, UIPersistentLabel, UILink, UICommand, UICommandType) {
    "use strict";
    /**
     * This class defines a UI port.
     * @private
     * @abstract
     * @class UIPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIPort
     * @extends UIConnector
     */
    class UIPort extends UIConnector {
        /**
         * @public
         * @constructor
         * @param {UIBlock|UIGraph|UIGraphDataDrawer|UIShortcut} parent - The parent that owns this UI port.
         * @param {DataPort|ControlPort} model - The data or control port model.
         */
        constructor(parent, model) {
            super();
            this._parent = parent;
            this._model = model;
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
            const controller = this.getParentGraph().getViewer().getContextualBarController();
            if (controller) {
                controller.clearCommands();
            }
            this.removeLinks();
            this.removePersistentLabel();
            this._parent = undefined;
            this._model = undefined;
            super.remove();
        }
        /**
         * Gets the view of the of the port.
         * @public
         * @override
         * @returns {UIPortView} The view of the port.
         */
        getView() {
            return super.getView();
        }
        /**
         * Gets the list of UI links connected to that port.
         * @public
         * @returns {Array<UILink>} The list of UI links connected to that port.
         */
        getLinks() {
            const links = [];
            for (let element = this._display.children.first; element; element = element.next) {
                if (element?.ref?.data?.uiElement instanceof UILink) {
                    links.push(element.ref.data.uiElement);
                }
            }
            return links;
        }
        /**
         * Removes the links connected to that port.
         * @public
         */
        removeLinks() {
            const links = this.getLinks();
            const graph = this.getParentGraph();
            links.forEach(link => graph.removeLink(link));
        }
        /**
         * Gets the parent of the port.
         * @public
         * @returns {UIBlock|UIGraph|UIGraphDataDrawer|UIShortcut} The parent of the port.
         */
        getParent() {
            return this._parent;
        }
        /**
         * Gets the UI editor.
         * @public
         * @returns {UIEditor} The UI editor.
         */
        getEditor() {
            return this.getParentGraph().getEditor();
        }
        /**
         * Gets the port model.
         * @public
         * @returns {DataPort|ControlPort} The port model.
         */
        getModel() {
            return this._model;
        }
        /**
         * Gets the name of the port.
         * @public
         * @returns {string} The name of the port.
         */
        getName() {
            return this._model.getName();
        }
        /**
         * Highlights the port.
         * @public
         */
        highlight() {
            this.getView().highlight();
        }
        /**
         * Unhghlights the port.
         * @public
         */
        unhighlight() {
            this.getView().unhighlight();
        }
        /**
         * Checks if the port is editable.
         * @public
         * @returns {boolean} True if the port is editable else false.
         */
        isEditable() {
            return this._model.isNameSettable();
        }
        /**
         * Checks if the port is selected.
         * @public
         * @returns {boolean} True is the port is selected else false.
         */
        isSelected() {
            return this.getParentGraph().getViewer().isSelected(this._display);
        }
        /**
         * Gets the list of available commands.
         * @public
         * @returns {Array<UICommand>} The list of available commands.
         */
        getCommands() {
            const commands = [];
            if (this.isEditable()) {
                commands.push(new UICommand(UICommandType.eEdit, this.openDialog.bind(this)));
            }
            return commands;
        }
        /**
         * Loads the port from the provided JSON port model.
         * @public
         * @abstract
         * @param {IJSONPortUI} iJSONPort - The JSON port model.
         */
        fromJSON(iJSONPort) {
            if (iJSONPort?.label) {
                this.createPersistentLabel();
                this._persistentLabel?.fromJSON(iJSONPort.label);
            }
        }
        /**
         * Saves the port to the provided JSON port model.
         * @public
         * @abstract
         * @param {IJSONPortUI} oJSONPort - The JSON port model.
         */
        toJSON(oJSONPort) {
            if (this._persistentLabel) {
                const oJSONLabel = {};
                this._persistentLabel.toJSON(oJSONLabel);
                oJSONPort.label = oJSONLabel;
            }
        }
        /**
         * Creates the port persistent label.
         * @public
         * @returns {UIPersistentLabel} The persistent label.
         */
        createPersistentLabel() {
            if (!this._persistentLabel) {
                this._persistentLabel = new UIPersistentLabel(this);
                this.getEditor().getViewerController().getCurrentViewer().getLabelController().clearAllLabels();
            }
            return this._persistentLabel;
        }
        /**
         * Removes the port persistent label.
         * @public
         */
        removePersistentLabel() {
            if (this._persistentLabel) {
                this._persistentLabel.remove();
                this._persistentLabel = undefined;
            }
        }
        /**
         * Gets the port persistent label.
         * @public
         * @returns {UIPersistentLabel|undefined} The port persistent label.
         */
        getPersistentLabel() {
            return this._persistentLabel;
        }
    }
    return UIPort;
});
