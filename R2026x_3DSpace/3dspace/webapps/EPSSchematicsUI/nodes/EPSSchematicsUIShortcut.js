/// <amd-module name='DS/EPSSchematicsUI/nodes/EPSSchematicsUIShortcut'/>
define("DS/EPSSchematicsUI/nodes/EPSSchematicsUIShortcut", ["require", "exports", "DS/EPSSchematicsUI/nodes/EPSSchematicsUINode", "DS/EPSSchematicsUI/nodes/views/EPSSchematicsUIShortcutView", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIShortcutDataPort", "DS/EPSSchematicsUI/tools/EPSSchematicsUIMath", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents"], function (require, exports, UINode, UIShortcutView, UIShortcutDataPort, UIMath, ModelEnums, Events) {
    "use strict";
    /**
     * This class defines a UI shortcut.
     * @private
     * @class UIShortcut
     * @alias module:DS/EPSSchematicsUI/nodes/EPSSchematicsUIShortcut
     * @extends UINode
     */
    class UIShortcut extends UINode {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The parent UI graph that owns this UI shortcut.
         * @param {UIDataPort} dataPortUI - The UI data port reference.
         * @param {number} left - The left position of the shortcut.
         * @param {number} top - The top position of the shortcut.
         * @param {UIEnums.EShortcutType} [shortcutType] - The type of shortcut.
         */
        constructor(graph, dataPortUI, left, top, shortcutType) {
            super({ graph: graph, isDraggable: true });
            this._onDataPortRemoveCB = this._onDataPortRemove.bind(this);
            this._onBlockRemoveCB = this._onBlockRemove.bind(this);
            this._build(dataPortUI, left, top, shortcutType);
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
         * Builds the shortcut (created to be able to derivate that part)
         * @public
         * @param {UIDataPort} dataPortUI - The UI data port.
         * @param {number} left - The left position of the shortcut.
         * @param {number} top - The top position of the shortcut.
         * @param {UIEnums.EShortcutType} [shortcutType] - The shortcut type.
         */
        _build(dataPortUI, left, top, shortcutType) {
            this._dataPortUI = dataPortUI;
            this._dataPortModel = this._dataPortUI.getModel(); // Keep the reference on model after dataPortUI destruction!
            this._blockModel = this._dataPortModel.block;
            this._portType = this._dataPortModel.getType();
            this._parentDataPortModel = this._dataPortModel.dataPort;
            this.setView(new UIShortcutView());
            this.setPosition(left, top);
            this.setDimension(20, 3);
            if (this._portType === ModelEnums.EDataPortType.eInput || this._portType === ModelEnums.EDataPortType.eInputExternal || this._portType === ModelEnums.EDataPortType.eOutput) {
                this._shortcutType = this._dataPortModel.isStartPort(this._graph.getModel()) ? 0 /* UIEnums.EShortcutType.eStartPort */ : 1 /* UIEnums.EShortcutType.eEndPort */;
            }
            else if (this._portType === ModelEnums.EDataPortType.eLocal) {
                if (shortcutType !== undefined) {
                    this._shortcutType = shortcutType;
                }
                else if (this._parentDataPortModel !== undefined) { // Manage sub data port
                    this._shortcutType = this._dataPortUI.getParentPort().getInputLocalState() ? 0 /* UIEnums.EShortcutType.eStartPort */ : 1 /* UIEnums.EShortcutType.eEndPort */;
                }
                else {
                    this._shortcutType = this._dataPortUI.getInputLocalState() ? 0 /* UIEnums.EShortcutType.eStartPort */ : 1 /* UIEnums.EShortcutType.eEndPort */;
                }
            }
            this._shortcutDataPort = new UIShortcutDataPort(this, this._dataPortModel, this._shortcutType);
            this.appendConnector(this._shortcutDataPort);
            if (this._parentDataPortModel !== undefined) {
                this._parentDataPortModel.addListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            }
            else {
                this._blockModel.addListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            }
            this._graph.getModel().addListener(Events.BlockRemoveEvent, this._onBlockRemoveCB);
        }
        /**
         * Removes the node from its parent graph.
         * @public
         * @override
         * @param {boolean} [retouteLinks=false] - True to retoute links on ref, default is false.
         */
        remove(retouteLinks = false) {
            if (retouteLinks === true) {
                this._shortcutDataPort.rerouteUILinksOnRef();
            }
            this._shortcutDataPort.remove();
            if (this._parentDataPortModel !== undefined) {
                this._parentDataPortModel.removeListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            }
            else {
                this._blockModel.removeListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            }
            this._graph.getModel().removeListener(Events.BlockRemoveEvent, this._onBlockRemoveCB);
            this._dataPortUI = undefined;
            this._shortcutType = undefined;
            this._dataPortModel = undefined;
            this._blockModel = undefined;
            this._portType = undefined;
            this._parentDataPortModel = undefined;
            this._shortcutDataPort = undefined;
            this._onDataPortRemoveCB = undefined;
            this._onBlockRemoveCB = undefined;
            super.remove();
        }
        /**
         * Projects the specified JSON object to the shortcut.
         * @public
         * @param {IJSONShortcutUI} iJSONShortcut - The JSON projected shortcut.
         */
        fromJSON(iJSONShortcut) {
            if (iJSONShortcut !== undefined) {
                this.setPosition(iJSONShortcut.left, iJSONShortcut.top);
            }
        }
        /**
         * Projects the shortcut to the specified JSON object.
         * @public
         * @param {IJSONShortcutUI} oJSONShortcut - The JSON projected shortcut.
         */
        toJSON(oJSONShortcut) {
            oJSONShortcut.left = this.getActualLeft();
            oJSONShortcut.top = this.getActualTop();
            oJSONShortcut.port = this._dataPortModel.toPath(this._graph.getModel());
            oJSONShortcut.shortcutType = this._shortcutType;
        }
        /**
         * Sets the shortcut position relative to its parent graph.
         * @public
         * @override
         * @param {number} left - The left position of the shortcut.
         * @param {number} top - The top position of the shortcut.
         */
        setPosition(left, top) {
            const posLeft = this._graph.getEditor().getOptions().gridSnapping ? UIMath.snapValue(left) : left;
            const posTop = this._graph.getEditor().getOptions().gridSnapping ? UIMath.snapValue(top) : top;
            if (this.getLeft() !== posLeft || this.getTop() !== posTop) {
                this._graph.onUIChange();
            }
            super.setPosition(posLeft, posTop);
        }
        /**
         * Gets the UI shortcut data port.
         * @public
         * @returns {UIShortcutDataPort} The UI shortcut data port.
         */
        getShortcutDataPort() {
            return this._shortcutDataPort;
        }
        /**
         * Gets the shortcut data port model.
         * @public
         * @returns {DataPort} The data port model.
         */
        getDataPortModel() {
            return this._dataPortModel;
        }
        /**
         * Gets the shortcut data port UI.
         * @public
         * @returns {UIDataPort} The data port UI.
         */
        getDataPortUI() {
            return this._dataPortUI;
        }
        /**
         * Gets the shortcut type.
         * @public
         * @returns {UIEnums.EShortcutType} The shortcut type.
         */
        getShortcutType() {
            return this._shortcutType;
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
         * The callback on the model data port remove event.
         * @private
         * @param {Events.DataPortRemoveEvent} event - The model data port remove event.
         */
        _onDataPortRemove(event) {
            if (event.getDataPort() === this._dataPortModel) {
                this._graph.removeShortcut(this);
            }
        }
        /**
         * The callback on the model block remove event.
         * @private
         * @param {Events.BlockRemoveEvent} event - The model block remove event.
         */
        _onBlockRemove(event) {
            if (event.getBlock() === this._blockModel) {
                this._graph.removeShortcut(this);
            }
        }
    }
    return UIShortcut;
});
