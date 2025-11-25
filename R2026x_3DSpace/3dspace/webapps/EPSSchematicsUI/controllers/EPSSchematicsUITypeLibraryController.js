/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUITypeLibraryController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUITypeLibraryController", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeDocument", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents"], function (require, exports, WUXTreeDocument, WUXTreeNodeModel, UITools, UINLS, TypeLibrary, ModelEnums, Events) {
    "use strict";
    /**
     * This class defines a UI type library controller.
     * @private
     * @class UITypeLibraryController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUITypeLibraryController
     */
    class UITypeLibraryController {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._treeDocument = new WUXTreeDocument({ useAsyncPreExpand: true });
            this._onTypeLibraryRegisterGlobalCB = this._onTypeLibraryRegisterGlobal.bind(this);
            this._onTypeLibraryRegisterLocalCustomCB = this._onTypeLibraryRegisterLocalCustom.bind(this);
            this._onTypeLibraryUnregisterLocalCustomCB = this._onTypeLibraryUnregisterLocalCustom.bind(this);
            this._applyTypeIconCB = { module: 'DS/EPSSchematicsUI/controllers/EPSSchematicsUITypeLibraryController', func: '_applyTypeToSelectedPort' };
            this._deleteTypeIconCB = { module: 'DS/EPSSchematicsUI/controllers/EPSSchematicsUITypeLibraryController', func: '_removeSelectedNode' };
            this._editor = editor;
            this._applyTypeIconCB.argument = { editor: this._editor };
            this._deleteTypeIconCB.argument = { editor: this._editor };
            this._initializeTreeDocument();
            this._initializeGlobalTypes();
            TypeLibrary.addListener(Events.TypeLibraryRegisterGlobalEvent, this._onTypeLibraryRegisterGlobalCB);
            TypeLibrary.addListener(Events.TypeLibraryRegisterLocalCustomEvent, this._onTypeLibraryRegisterLocalCustomCB);
            TypeLibrary.addListener(Events.TypeLibraryUnregisterLocalCustomEvent, this._onTypeLibraryUnregisterLocalCustomCB);
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
         * Removes the controller.
         * @public
         */
        remove() {
            TypeLibrary.removeListener(Events.TypeLibraryRegisterGlobalEvent, this._onTypeLibraryRegisterGlobalCB);
            TypeLibrary.removeListener(Events.TypeLibraryRegisterLocalCustomEvent, this._onTypeLibraryRegisterLocalCustomCB);
            TypeLibrary.removeListener(Events.TypeLibraryUnregisterLocalCustomEvent, this._onTypeLibraryUnregisterLocalCustomCB);
            if (this._treeDocument !== undefined) {
                this._treeDocument.empty();
            }
            this._editor = undefined;
            this._treeDocument = undefined;
            this._appTypesNode = undefined;
            this._customTypesNode = undefined;
            this._onTypeLibraryRegisterGlobalCB = undefined;
            this._onTypeLibraryRegisterLocalCustomCB = undefined;
            this._onTypeLibraryUnregisterLocalCustomCB = undefined;
            this._applyTypeIconCB = undefined;
            this._deleteTypeIconCB = undefined;
        }
        /**
         * Gets the tree document.
         * @public
         * @returns {TreeDocument} The tree document.
         */
        getTreeDocument() {
            return this._treeDocument;
        }
        /**
         * Gets the custom types node.
         * @public
         * @returns {WUXTreeNodeModel} The custom types node.
         */
        getCustomTypesNode() {
            return this._customTypesNode;
        }
        /**
         * Gets the application types node.
         * @public
         * @returns {WUXTreeNodeModel} The application types node.
         */
        getApplicationTypesNode() {
            return this._appTypesNode;
        }
        /**
         * Gets the tree node model matching the provided type name.
         * @public
         * @param {string} typeName - The type name.
         * @param {boolean} [includeApplicationTypes=false] - True to include application types.
         * @returns {TreeNodeModel|undefined} The matching tree node model.
         */
        getTreeNodeModelFromTypeName(typeName, includeApplicationTypes = false) {
            let children = this._customTypesNode.getChildren() || [];
            if (includeApplicationTypes) {
                children = children.concat(this._appTypesNode.getChildren());
            }
            const treeNodModel = children.find(childNode => childNode.getLabel() === typeName);
            return treeNodModel;
        }
        /**
         * Sorts the custom and applicative types by alphabetic order.
         * @public
         */
        sortTypes() {
            this._customTypesNode.sortChildren();
            this._appTypesNode.sortChildren();
        }
        /**
         * Updates the apply button disabled state.
         * @public
         */
        updateApplyButtonDisabledState() {
            const typeLibraryPanel = this._editor.getTypeLibraryPanel();
            if (typeLibraryPanel.isOpen()) {
                const selectedDataPorts = this._editor.getViewerController().getCurrentViewer().getSelectedDataPorts();
                let allowedValueTypes = [];
                if (selectedDataPorts.length > 0) {
                    const areSettable = selectedDataPorts.every(dataPort => dataPort.getModel().isValueTypeSettable());
                    if (areSettable) {
                        selectedDataPorts.forEach((dataPort, index) => {
                            if (index === 0) {
                                allowedValueTypes = dataPort.getModel().getAllowedValueTypes();
                            }
                            else {
                                const nextAllowedValueTypes = dataPort.getModel().getAllowedValueTypes();
                                allowedValueTypes = allowedValueTypes.filter(valueType => nextAllowedValueTypes.includes(valueType));
                            }
                            // Remove the current value type because useless to reapply same type!
                            const typeIndex = allowedValueTypes.indexOf(dataPort.getModel().getValueType());
                            if (typeIndex > -1) {
                                allowedValueTypes.splice(typeIndex, 1);
                            }
                        });
                    }
                }
                this._updateApplyButtonDisabledStateFromTypeList(allowedValueTypes);
            }
        }
        /**
         * Updates the occurence count.
         * @public
         */
        updateOccurenceCount() {
            const typeLibraryPanel = this._editor.getTypeLibraryPanel();
            if (typeLibraryPanel !== undefined && typeLibraryPanel.isOpen()) {
                // First reset the occurence count
                const customTypesChildren = this._customTypesNode.getChildren() || [];
                const appTypesChildren = this._appTypesNode.getChildren() || [];
                const typeNodes = customTypesChildren.concat(appTypesChildren);
                typeNodes.forEach(childNode => childNode.setAttribute('occurenceCount', 0));
                // Then compute occurence count for each used types
                const rootGraph = this._editor.getViewerController().getRootViewer().getMainGraph();
                const objectsByType = rootGraph.getModel().getObjectsByType();
                const graphContext = this._editor._getViewer().getMainGraph().getModel().getGraphContext();
                const typeNames = Object.keys(objectsByType);
                if (typeNames.length > 0) {
                    typeNames.forEach(typeName => {
                        const typeCount = objectsByType[typeName].length;
                        const hasLocalCustomType = TypeLibrary.hasLocalCustomType(graphContext, typeName, ModelEnums.FTypeCategory.fAll);
                        const hasGlobalType = !hasLocalCustomType && TypeLibrary.hasGlobalType(typeName, ModelEnums.FTypeCategory.fAll);
                        const rootNode = hasLocalCustomType ? this._customTypesNode : hasGlobalType ? this._appTypesNode : undefined;
                        if (rootNode) {
                            const foundNode = (rootNode.getChildren() || []).find(childNode => childNode.getLabel() === typeName);
                            if (foundNode) {
                                foundNode.setAttribute('occurenceCount', typeCount);
                                foundNode.setAttribute('occurenceReferences', objectsByType[typeName]);
                            }
                        }
                    });
                }
            }
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
         * Updates the apply button disabled state from the provided type list.
         * @private
         * @param {string[]} types - The allowed value types.
         */
        _updateApplyButtonDisabledStateFromTypeList(types) {
            const customTypesChildren = this._customTypesNode.getChildren() || [];
            const appTypesChildren = this._appTypesNode.getChildren() || [];
            const childrenNodes = customTypesChildren.concat(appTypesChildren);
            childrenNodes.forEach(childNode => {
                const isTypeAllowed = types.indexOf(childNode.getLabel()) > -1;
                childNode.setAttribute('disabled', !isTypeAllowed);
            });
        }
        /**
         * Initializes the tree document.
         * @private
         */
        _initializeTreeDocument() {
            this._appTypesNode = new WUXTreeNodeModel({
                label: UINLS.get('categoryApplicationTypes'),
                grid: {}
            });
            this._customTypesNode = new WUXTreeNodeModel({
                label: UINLS.get('categoryCustomTypes'),
                grid: {}
            });
            this._treeDocument.addRoot(this._customTypesNode);
            this._treeDocument.addRoot(this._appTypesNode);
            this._treeDocument.setFilterModel({
                typeName: {
                    filterId: 'stringRegexp',
                    filterModel: {}
                }
            });
        }
        /**
         * Initializes the global types already registered in the type library.
         * @private
         */
        _initializeGlobalTypes() {
            const globalTypeNames = TypeLibrary.getGlobalTypeNameList(ModelEnums.FTypeCategory.fAll ^ ModelEnums.FTypeCategory.fArray);
            this._appTypesNode.prepareUpdate();
            globalTypeNames.forEach(typeName => this._registerGlobalType(typeName));
            this._appTypesNode.pushUpdate();
        }
        /**
         * The callback on the type library register global event.
         * @private
         * @param {TypeLibraryRegisterGlobalEvent} event - The type library register global event.
         */
        _onTypeLibraryRegisterGlobal(event) {
            this._registerGlobalType(event.getName());
        }
        /**
         * The callback on the type library register local custom event.
         * @private
         * @param {TypeLibraryRegisterLocalCustomEvent} event - The type library register local custom event.
         */
        _onTypeLibraryRegisterLocalCustom(event) {
            this._registerLocalCustomType(event.getName());
        }
        /**
         * The callback on the type library unregister local custom event.
         * @private
         * @param {TypeLibraryUnregisterLocalCustomEvent} event - The type library unregister local custom event.
         */
        _onTypeLibraryUnregisterLocalCustom(event) {
            const treeNodeModel = this.getTreeNodeModelFromTypeName(event.getName(), false);
            if (treeNodeModel !== undefined) {
                this._customTypesNode.removeChild(treeNodeModel);
            }
        }
        /**
         * Registers a global type.
         * @private
         * @param {string} typeName - The type name.
         */
        _registerGlobalType(typeName) {
            this._appTypesNode.addChild(new WUXTreeNodeModel({
                label: typeName,
                grid: {
                    typeName: typeName,
                    occurenceCount: 0,
                    occurenceReferences: [],
                    applyType: this._applyTypeIconCB,
                    disabled: true
                }
            }));
        }
        /**
         * Registers a local custom type.
         * @private
         * @param {string} typeName - The type name.
         */
        _registerLocalCustomType(typeName) {
            let disabled = true;
            const selectedDataPorts = this._editor.getViewerController().getCurrentViewer().getSelectedDataPorts();
            if (selectedDataPorts.length > 0) {
                const areSettable = selectedDataPorts.every(dataPort => dataPort.getModel().isValueTypeSettable());
                if (areSettable) {
                    disabled = !selectedDataPorts.every(dataPort => UITools.hasEnumFlag(dataPort.getModel().typeCategory, ModelEnums.FTypeCategory.fObject));
                }
            }
            this._customTypesNode.addChild(new WUXTreeNodeModel({
                label: typeName,
                grid: {
                    typeName: typeName,
                    occurenceCount: 0,
                    occurenceReferences: [],
                    applyType: this._applyTypeIconCB,
                    deleteType: this._deleteTypeIconCB,
                    disabled: disabled
                }
            }));
            this._customTypesNode.expand();
        }
        /**
         * Removes the selected node from the type library treeDocument.
         * @protected
         * @static
         * @param {IFunctionIconArguments} args - The function icon arguments.
         */
        static _removeSelectedNode(args) {
            const nodeModel = args.context.nodeModel;
            const editor = args.editor;
            const graphContext = editor._getViewer().getMainGraph().getModel().getGraphContext();
            const typeName = nodeModel.getLabel();
            try {
                TypeLibrary.unregisterLocalCustomTypes(graphContext, [typeName]);
                editor.getHistoryController().registerRemoveCustomTypeAction();
            }
            catch (error) {
                if (error instanceof Error) {
                    const title = UINLS.get('notificationRemoveTypeError', { typeName: typeName });
                    editor.displayNotification({
                        level: 'error',
                        title: title,
                        subtitle: error.stack
                    });
                    editor.displayDebugConsoleMessage(ModelEnums.ESeverity.eError, title);
                    if (error.stack) {
                        editor.displayDebugConsoleMessage(ModelEnums.ESeverity.eError, error.stack);
                    }
                }
            }
        }
        /**
         * Apply the selected type to the selected data ports.
         * @protected
         * @static
         * @param {IFunctionIconArguments} args - The function icon arguments.
         */
        static _applyTypeToSelectedPort(args) {
            const typeName = args.context.nodeModel.getLabel();
            if (typeName !== undefined && typeName !== '') {
                const editor = args.editor;
                const dataPorts = editor.getViewerController().getCurrentViewer().getSelectedDataPorts();
                let changedDataPorts = [];
                dataPorts.forEach(dataPort => {
                    const result = dataPort.getModel().setValueType(typeName);
                    if (result) {
                        dataPort.triggerPulseAnimation();
                        changedDataPorts.push(dataPort);
                    }
                });
                if (dataPorts.length) {
                    const historyController = editor.getHistoryController();
                    historyController.registerEditDataPortTypeAction(dataPorts);
                    editor.getTypeLibraryController().updateApplyButtonDisabledState();
                }
            }
        }
    }
    return UITypeLibraryController;
});
