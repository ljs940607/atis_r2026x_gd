/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUINodeIdSelectorController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUINodeIdSelectorController", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeDocument", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsNodeIdSelector", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/EPSSchematicsUIEnums", "DS/Utilities/Color", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel"], function (require, exports, WUXTreeDocument, Tools, Events, NodeIdSelector, ModelEnums, UINLS, UIEnums, WUXColor, WUXTreeNodeModel) {
    "use strict";
    /**
     * This class defines a nodeId selector controller.
     * @private
     * @class UINodeIdSelectorController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUINodeIdSelectorController
     */
    class UINodeIdSelectorController {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graphUI - The UI graph.
         */
        constructor(graphUI) {
            this._onNodeIdSelectorAddCB = this._onNodeIdSelectorAdd.bind(this);
            this._onNodeIdSelectorRemoveCB = this._onNodeIdSelectorRemove.bind(this);
            this._onNodeIdSelectorNameChangeCB = this._onNodeIdSelectorNameChange.bind(this);
            this._onNodeIdSelectorPoolChangeCB = this._onNodeIdSelectorPoolChange.bind(this);
            this._onNodeIdSelectorCriterionChangeCB = this._onNodeIdSelectorCriterionChange.bind(this);
            this._onNodeIdSelectorIdentifierChangeCB = this._onNodeIdSelectorIdentifierChange.bind(this);
            this._onNodeIdSelectorQueuingChangeCB = this._onNodeIdSelectorQueuingChange.bind(this);
            this._onNodeIdSelectorTimeoutChangeCB = this._onNodeIdSelectorTimeoutChange.bind(this);
            this._onNodeIdSelectorMaxInstanceCountChangeCB = this._onNodeIdSelectorMaxInstanceCountChange.bind(this);
            this._onNodeIdSelectorCmdLineChangeCB = this._onNodeIdSelectorCmdLineChange.bind(this);
            this._deleteNodeIdSelectorIconCB = { module: 'DS/EPSSchematicsUI/controllers/EPSSchematicsUINodeIdSelectorController', func: '_deleteNodeIdSelector' };
            this._applyNodeIdSelectorIconCB = { module: 'DS/EPSSchematicsUI/controllers/EPSSchematicsUINodeIdSelectorController', func: '_applyNodeIdSelector' };
            this._kColorPalette = [
                '98DDAA', '858DD6', 'D5A081', 'CF6E91', 'CFCA6E',
                'FF8F2E', '8454BF', '3D85B8', '2F8E78', '0056E0',
                '40B43C', '92256F', '71D0B5', '914930', 'D42B7D',
                'E067D2', '859D89', '52FF5A', 'FF3838', 'FFC2F0'
            ];
            this._graphUI = graphUI;
            this._deleteNodeIdSelectorIconCB.argument = { editor: this._graphUI.getEditor() };
            this._applyNodeIdSelectorIconCB.argument = { editor: this._graphUI.getEditor() };
            this._graphModel = graphUI.getModel();
            this._treeDocument = new WUXTreeDocument({ useAsyncPreExpand: true });
            this._graphModel.addListener(Events.NodeIdSelectorAddEvent, this._onNodeIdSelectorAddCB);
            this._graphModel.addListener(Events.NodeIdSelectorRemoveEvent, this._onNodeIdSelectorRemoveCB);
            this._graphModel.getNodeIdSelectors().forEach(nis => this._addNodeIdSelectorListeners(nis));
            this._initializeTreeDocument();
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
            this._graphModel.removeListener(Events.NodeIdSelectorAddEvent, this._onNodeIdSelectorAddCB);
            this._graphModel.removeListener(Events.NodeIdSelectorRemoveEvent, this._onNodeIdSelectorRemoveCB);
            this._graphModel.getNodeIdSelectors().forEach(nis => this._removeNodeIdSelectorListeners(nis));
            if (this._treeDocument) {
                this._treeDocument.empty();
            }
            this._graphUI = undefined;
            this._graphModel = undefined;
            this._treeDocument = undefined;
            this._onNodeIdSelectorAddCB = undefined;
            this._onNodeIdSelectorRemoveCB = undefined;
            this._onNodeIdSelectorNameChangeCB = undefined;
            this._onNodeIdSelectorPoolChangeCB = undefined;
            this._onNodeIdSelectorCriterionChangeCB = undefined;
            this._onNodeIdSelectorIdentifierChangeCB = undefined;
            this._onNodeIdSelectorQueuingChangeCB = undefined;
            this._onNodeIdSelectorTimeoutChangeCB = undefined;
            this._onNodeIdSelectorMaxInstanceCountChangeCB = undefined;
            this._onNodeIdSelectorCmdLineChangeCB = undefined;
            this._deleteNodeIdSelectorIconCB = undefined;
            this._applyNodeIdSelectorIconCB = undefined;
        }
        /**
         * Gets the tree document.
         * @public
         * @returns {WUXTreeDocument} The tree document.
         */
        getTreeDocument() {
            return this._treeDocument;
        }
        /**
         * Exports the nodeId selectors to the provided JSON.
         * @public
         * @param {IJSONGraphUI} oJSONGraph - The JSON graph.
         */
        toJSON(oJSONGraph) {
            if (oJSONGraph !== undefined) {
                const nodeIdSelectors = this._getNodeIdSelectors();
                if (nodeIdSelectors.length > 0) {
                    oJSONGraph.nodeIdSelectors = [];
                    nodeIdSelectors.forEach(nodeIdSelector => oJSONGraph.nodeIdSelectors?.push(nodeIdSelector.getAttributeValue('color')));
                }
            }
        }
        /**
         * Creates the nodeId selectors from the provided JSON.
         * @public
         * @param {IJSONGraphUI} iJSONGraph - The JSON graph.
         */
        fromJSON(iJSONGraph) {
            const jsonGraphNodeIdSelectors = iJSONGraph.nodeIdSelectors;
            if (jsonGraphNodeIdSelectors !== undefined) {
                const nodeIdSelectors = this._getNodeIdSelectors();
                nodeIdSelectors.forEach((nodeIdSelector, index) => {
                    const color = jsonGraphNodeIdSelectors[index];
                    if (color !== undefined) {
                        nodeIdSelector.setAttribute('color', color);
                    }
                });
            }
        }
        /**
         * Gets the color of the nodeId Selector at provided index.
         * @public
         * @param {number} index - The index of the nodeId selector.
         * @returns {string} The color of the nodeId selector.
         */
        getColor(index) {
            let color = '';
            if (index > -1) {
                const nodeIdSelectors = this._getNodeIdSelectors();
                const nodeIdSelector = nodeIdSelectors[index];
                color = nodeIdSelector?.getAttributeValue('color');
            }
            return color;
        }
        /**
         * Creates the nodeId selector node model.
         * @public
         * @param {NodeIdSelector} nodeIdSelector - The nodeId selector.
         */
        createNodeIdSelectorNodeModel(nodeIdSelector) {
            this._addNodeIdSelectorListeners(nodeIdSelector);
            const children = [];
            const fakeNodeIdSelector = UINodeIdSelectorController._createFakeNodeIdSelector();
            if (nodeIdSelector.isPoolSettable()) {
                children.push(new WUXTreeNodeModel({
                    label: UINLS.get('treeListRowNodeIdSelectorPool'),
                    grid: {
                        nodeIdSelector: nodeIdSelector,
                        id: UIEnums.ENodeIdSelectorProperty.ePool,
                        typeRepresentation: 'string',
                        value: nodeIdSelector.getPool(),
                        ...(fakeNodeIdSelector.isPoolSettable(undefined) && { actions: {} })
                    }
                }));
            }
            if (nodeIdSelector.isCriterionSettable()) {
                let criterion = nodeIdSelector.getCriterion();
                criterion = criterion === undefined ? -1 : criterion;
                children.push(new WUXTreeNodeModel({
                    label: UINLS.get('treeListRowNodeIdSelectorCriterion'),
                    grid: {
                        nodeIdSelector: nodeIdSelector,
                        id: UIEnums.ENodeIdSelectorProperty.eCriterion,
                        typeRepresentation: 'NodeIdSelectorCriterion',
                        value: criterion,
                        ...(fakeNodeIdSelector.isCriterionSettable(undefined) && { actions: {} })
                    }
                }));
            }
            if (nodeIdSelector.isIdentifierSettable()) {
                children.push(UINodeIdSelectorController._createIdentifierNodeModel(nodeIdSelector));
            }
            if (nodeIdSelector.isQueuingSettable()) {
                children.push(new WUXTreeNodeModel({
                    label: UINLS.get('treeListRowNodeIdSelectorQueuing'),
                    grid: {
                        nodeIdSelector: nodeIdSelector,
                        id: UIEnums.ENodeIdSelectorProperty.eQueuing,
                        typeRepresentation: 'Boolean',
                        value: nodeIdSelector.getQueuing(),
                        ...(fakeNodeIdSelector.isQueuingSettable(undefined) && { actions: {} })
                    }
                }));
            }
            if (nodeIdSelector.isTimeoutSettable()) {
                children.push(new WUXTreeNodeModel({
                    label: UINLS.get('treeListRowNodeIdSelectorTimeout'),
                    grid: {
                        nodeIdSelector: nodeIdSelector,
                        id: UIEnums.ENodeIdSelectorProperty.eTimeout,
                        typeRepresentation: 'uint32',
                        value: nodeIdSelector.getTimeout(),
                        ...(fakeNodeIdSelector.isTimeoutSettable(undefined) && { actions: {} })
                    }
                }));
            }
            if (nodeIdSelector.isMaxInstanceCountSettable()) {
                children.push(new WUXTreeNodeModel({
                    label: UINLS.get('treeListRowNodeIdSelectorMaxInstanceCount'),
                    grid: {
                        nodeIdSelector: nodeIdSelector,
                        id: UIEnums.ENodeIdSelectorProperty.eMaxInstanceCount,
                        typeRepresentation: 'NonZeroUInt32',
                        value: nodeIdSelector.getMaxInstanceCount(),
                        ...(fakeNodeIdSelector.isMaxInstanceCountSettable(undefined) && { actions: {} })
                    }
                }));
            }
            if (nodeIdSelector.isCmdLineSettable()) {
                children.push(new WUXTreeNodeModel({
                    label: UINLS.get('treeListRowNodeIdSelectorCmdLine'),
                    grid: {
                        nodeIdSelector: nodeIdSelector,
                        id: UIEnums.ENodeIdSelectorProperty.eCmdLine,
                        typeRepresentation: 'string',
                        value: nodeIdSelector.getCmdLine(),
                        ...(fakeNodeIdSelector.isCmdLineSettable(undefined) && { actions: {} })
                    }
                }));
            }
            const index = this._graphModel.getNodeIdSelectors().length - 1;
            const color = index < 20 ? this._kColorPalette[index] : WUXColor.hslToHex([Math.floor(Math.random() * 361), 100, 50]);
            const nodeIdSelectorNodeModel = new WUXTreeNodeModel({
                label: nodeIdSelector.getName(),
                grid: {
                    nodeIdSelector: nodeIdSelector,
                    count: '',
                    deleteNodeIdSelector: this._deleteNodeIdSelectorIconCB,
                    color: color,
                    applyNodeIdSelector: this._applyNodeIdSelectorIconCB
                },
                children: children
            });
            this._updateNodeIdSelectorCountByNodeModel(nodeIdSelectorNodeModel);
            this._treeDocument.addRoot(nodeIdSelectorNodeModel);
        }
        /**
         * Updates the nodeId selectors count.
         * @public
         */
        updateNodeIdSelectorsCount() {
            // First reset every nodeIdSelector count as the model do not return ref on empty nodeIdSelectors
            const childNodes = this._treeDocument.getChildren() || [];
            childNodes.forEach(childNode => childNode.setAttribute('count', '0 / 0'));
            const blocksByNodeIdSelector = this._graphModel.getBlocksByNodeIdSelector();
            Object.keys(blocksByNodeIdSelector).forEach(key => {
                const blockList = blocksByNodeIdSelector[key] || [];
                let nodeModel;
                if (key === Tools.parentNodeIdSelector) {
                    nodeModel = this._parentNodeIdSelectorNodeModel;
                }
                else if (key === 'undefined') {
                    nodeModel = this._noNodeIdSelectorNodeModel;
                }
                else {
                    nodeModel = childNodes.find(childNode => childNode.getLabel() === key);
                }
                if (nodeModel !== undefined) {
                    this._updateNodeIdSelectorCountByNodeModel(nodeModel, blockList);
                }
            });
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
         * Updates the nodeId selector count for the provided node model.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model to update.
         * @param {Block[]} [blockList] - The optional list of block for that nodeId selector.
         */
        _updateNodeIdSelectorCountByNodeModel(nodeModel, blockList) {
            if (nodeModel) {
                if (!blockList) {
                    let label = nodeModel.getLabel();
                    if (nodeModel === this._parentNodeIdSelectorNodeModel) {
                        label = Tools.parentNodeIdSelector;
                    }
                    else if (nodeModel === this._noNodeIdSelectorNodeModel) {
                        label = 'undefined';
                    }
                    const blocksByNodeIdSelector = this._graphModel.getBlocksByNodeIdSelector();
                    blockList = blocksByNodeIdSelector[label] || [];
                }
                const globalBlockCount = blockList.length;
                const localBlockCount = blockList.filter(block => block.graph === this._graphModel).length;
                nodeModel.setAttribute('count', localBlockCount + ' / ' + globalBlockCount);
            }
        }
        /**
         * Gets the list of nodeId selectors.
         * @private
         * @returns {WUXTreeNodeModel[]} The list of nodeId selectors
         */
        _getNodeIdSelectors() {
            return this._treeDocument.getAllDescendants().filter(nodeModel => nodeModel.isRoot() && nodeModel.getAttributeValue('nodeIdSelector') !== undefined);
        }
        /**
         * Initializes the tree document.
         * @private
         */
        _initializeTreeDocument() {
            this._noNodeIdSelectorNodeModel = new WUXTreeNodeModel({
                label: 'No NodeId Selector', // TODO: NLS
                grid: { count: '0/0', color: undefined, applyNodeIdSelector: this._applyNodeIdSelectorIconCB }
            });
            this._updateNodeIdSelectorCountByNodeModel(this._noNodeIdSelectorNodeModel);
            this._parentNodeIdSelectorNodeModel = new WUXTreeNodeModel({
                label: Tools.parentNodeIdSelector, // TODO: NLS create a value field!!!
                grid: { count: '0/0', color: '8C8C8C', applyNodeIdSelector: this._applyNodeIdSelectorIconCB }
            });
            this._updateNodeIdSelectorCountByNodeModel(this._parentNodeIdSelectorNodeModel);
            this._treeDocument.addRoot(this._noNodeIdSelectorNodeModel);
            this._treeDocument.addRoot(this._parentNodeIdSelectorNodeModel);
        }
        /**
         * Adds event listeners to provided nodeId selector.
         * @private
         * @param {NodeIdSelector} nodeIdSelector - The nodeId selector.
         */
        _addNodeIdSelectorListeners(nodeIdSelector) {
            nodeIdSelector.addListener(Events.NodeIdSelectorNameChangeEvent, this._onNodeIdSelectorNameChangeCB);
            nodeIdSelector.addListener(Events.NodeIdSelectorPoolChangeEvent, this._onNodeIdSelectorPoolChangeCB);
            nodeIdSelector.addListener(Events.NodeIdSelectorCriterionChangeEvent, this._onNodeIdSelectorCriterionChangeCB);
            nodeIdSelector.addListener(Events.NodeIdSelectorIdentifierChangeEvent, this._onNodeIdSelectorIdentifierChangeCB);
            nodeIdSelector.addListener(Events.NodeIdSelectorQueuingChangeEvent, this._onNodeIdSelectorQueuingChangeCB);
            nodeIdSelector.addListener(Events.NodeIdSelectorTimeoutChangeEvent, this._onNodeIdSelectorTimeoutChangeCB);
            nodeIdSelector.addListener(Events.NodeIdSelectorMaxInstanceCountChangeEvent, this._onNodeIdSelectorMaxInstanceCountChangeCB);
            nodeIdSelector.addListener(Events.NodeIdSelectorCmdLineChangeEvent, this._onNodeIdSelectorCmdLineChangeCB);
        }
        /**
         * Removes event listeners from provided nodeId selector.
         * @private
         * @param {NodeIdSelector} nodeIdSelector - The nodeId selector.
         */
        _removeNodeIdSelectorListeners(nodeIdSelector) {
            nodeIdSelector.removeListener(Events.NodeIdSelectorNameChangeEvent, this._onNodeIdSelectorNameChangeCB);
            nodeIdSelector.removeListener(Events.NodeIdSelectorPoolChangeEvent, this._onNodeIdSelectorPoolChangeCB);
            nodeIdSelector.removeListener(Events.NodeIdSelectorCriterionChangeEvent, this._onNodeIdSelectorCriterionChangeCB);
            nodeIdSelector.removeListener(Events.NodeIdSelectorIdentifierChangeEvent, this._onNodeIdSelectorIdentifierChangeCB);
            nodeIdSelector.removeListener(Events.NodeIdSelectorQueuingChangeEvent, this._onNodeIdSelectorQueuingChangeCB);
            nodeIdSelector.removeListener(Events.NodeIdSelectorTimeoutChangeEvent, this._onNodeIdSelectorTimeoutChangeCB);
            nodeIdSelector.removeListener(Events.NodeIdSelectorMaxInstanceCountChangeEvent, this._onNodeIdSelectorMaxInstanceCountChangeCB);
            nodeIdSelector.removeListener(Events.NodeIdSelectorCmdLineChangeEvent, this._onNodeIdSelectorCmdLineChangeCB);
        }
        /**
         * Finds the node model corresponding to specified nodeId selector.
         * @private
         * @param {NodeIdSelector} nodeIdSelector - The nodeId selector.
         * @param {string} [childId] - The child Id.
         * @returns {WUXTreeNodeModel} The corresponding node model.
         */
        _findNodeIdSelectorNodeModel(nodeIdSelector, childId) {
            let result = undefined;
            result = this._treeDocument.getAllDescendants().find(nodeModel => nodeModel.getAttributeValue('nodeIdSelector') === nodeIdSelector);
            if (result && childId) {
                result = result.getChildren().find(nodeModel => nodeModel.getAttributeValue('id') === childId);
            }
            return result;
        }
        /**
         * Creates the identifier node model.
         * @private
         * @static
         * @param {NodeIdSelector} nodeIdSelector - The nodeId selector.
         * @returns {WUXTreeNodeModel} The created node model.
         */
        static _createIdentifierNodeModel(nodeIdSelector) {
            return new WUXTreeNodeModel({
                label: UINLS.get('treeListRowNodeIdSelectorIdentifier'),
                grid: { nodeIdSelector: nodeIdSelector, id: UIEnums.ENodeIdSelectorProperty.eIdentifier, typeRepresentation: 'string', value: nodeIdSelector.getIdentifier() }
            });
        }
        /**
         * The callback on the nodeId selector add event.
         * @private
         * @param {Events.NodeIdSelectorAddEvent} event - The nodeId selector add event.
         */
        _onNodeIdSelectorAdd(event) {
            this.createNodeIdSelectorNodeModel(event.getNodeIdSelector());
        }
        /**
         * The callback on the nodeId selector remove event.
         * @private
         * @param {Events.NodeIdSelectorRemoveEvent} event - The nodeId selector remove event.
         */
        _onNodeIdSelectorRemove(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            this._removeNodeIdSelectorListeners(nodeIdSelector);
            const foundNodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector);
            if (foundNodeModel) {
                this._treeDocument.removeRoot(foundNodeModel);
            }
        }
        /**
         * The callback on the nodeId selector name change event.
         * @private
         * @param {Events.NodeIdSelectorNameChangeEvent} event - The nodeId selector name change event.
         */
        _onNodeIdSelectorNameChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const foundNodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector);
            if (foundNodeModel) {
                foundNodeModel.setLabel(nodeIdSelector.getName());
            }
        }
        /**
         * The callback on the nodeId selector pool change event.
         * @private
         * @param {Events.NodeIdSelectorPoolChangeEvent} event - The nodeId selector pool change event.
         */
        _onNodeIdSelectorPoolChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const nodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.ePool);
            if (nodeModel) {
                nodeModel.setAttribute('value', event.getPool());
            }
        }
        /**
         * The callback on the nodeId selector criterion change event.
         * @private
         * @param {Events.NodeIdSelectorCriterionChangeEvent} event - The nodeId selector criterion change event.
         */
        _onNodeIdSelectorCriterionChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const nodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.eCriterion);
            if (nodeModel) {
                const criterion = event.getCriterion();
                const criterionAttValue = criterion === undefined ? -1 : criterion;
                nodeModel.setAttribute('value', criterionAttValue);
                let identifierNodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.eIdentifier);
                if (identifierNodeModel) {
                    identifierNodeModel.getParent().removeChild(identifierNodeModel);
                }
                if (criterion === ModelEnums.ECriterion.eIdentifier) {
                    identifierNodeModel = UINodeIdSelectorController._createIdentifierNodeModel(nodeIdSelector);
                    nodeModel.getParent().addChild(identifierNodeModel, 2); // In third position just after criterion!
                }
            }
        }
        /**
         * The callback on the nodeId selector identifier change event.
         * @private
         * @param {Events.NodeIdSelectorIdentifierChangeEvent} event - The nodeId selector identifier change event.
         */
        _onNodeIdSelectorIdentifierChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const nodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.eIdentifier);
            if (nodeModel) {
                nodeModel.setAttribute('value', event.getIdentifier());
            }
        }
        /**
         * The callback on the nodeId selector queuing change event.
         * @private
         * @param {Events.NodeIdSelectorQueuingChangeEvent} event - The nodeId selector queuing change event.
         */
        _onNodeIdSelectorQueuingChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const nodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.eQueuing);
            if (nodeModel) {
                nodeModel.setAttribute('value', event.getQueuing());
            }
        }
        /**
         * The callback on the nodeId selector timeout change event.
         * @private
         * @param {Events.NodeIdSelectorTimeoutChangeEvent} event - The nodeId selector timeout change event.
         */
        _onNodeIdSelectorTimeoutChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const nodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.eTimeout);
            if (nodeModel) {
                nodeModel.setAttribute('value', event.getTimeout());
            }
        }
        /**
         * The callback on the nodeId selector max instance count change event.
         * @private
         * @param {Events.NodeIdSelectorMaxInstanceCountChangeEvent} event - The nodeId selector max instance count change event.
         */
        _onNodeIdSelectorMaxInstanceCountChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const nodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.eMaxInstanceCount);
            if (nodeModel) {
                nodeModel.setAttribute('value', event.getMaxInstanceCount());
            }
        }
        /**
         * The callback on the nodeId selector command line change event.
         * @private
         * @param {Events.NodeIdSelectorCmdLineChangeEvent} event - The nodeId selector command line change event.
         */
        _onNodeIdSelectorCmdLineChange(event) {
            const nodeIdSelector = event.getNodeIdSelector();
            const nodeModel = this._findNodeIdSelectorNodeModel(nodeIdSelector, UIEnums.ENodeIdSelectorProperty.eCmdLine);
            if (nodeModel) {
                nodeModel.setAttribute('value', event.getCmdLine());
            }
        }
        /**
         * Removes the selected nodeId selector.
         * @private
         * @static
         * @param {IFunctionIconArguments} args - The function icon arguments.
         */
        static _deleteNodeIdSelector(args) {
            const nodeModel = args.context.nodeModel;
            if (nodeModel) {
                const nodeIdSelector = nodeModel.getAttributeValue('nodeIdSelector');
                if (nodeIdSelector) {
                    nodeIdSelector.graph.removeNodeIdSelector(nodeIdSelector);
                    const editor = args.editor;
                    editor.getHistoryController().registerRemoveNodeIdSelectorAction();
                }
            }
        }
        /**
         * Applies the selected nodeId selector.
         * @private
         * @static
         * @param {IFunctionIconArguments} args - The function icon arguments.
         */
        static _applyNodeIdSelector(args) {
            const nodeModel = args.context.nodeModel;
            if (nodeModel) {
                const editor = args.editor;
                const nodeIdSelectorPanel = editor.getNodeIdSelectorsPanel();
                const dataGridView = nodeIdSelectorPanel.getDataGridView();
                let currentNodeIdSelectorId = undefined;
                const nodeIdSelector = nodeModel.getAttributeValue('nodeIdSelector');
                if (nodeIdSelector) {
                    currentNodeIdSelectorId = nodeIdSelector.getName();
                }
                else if (nodeModel.getLabel() === Tools.parentNodeIdSelector) {
                    currentNodeIdSelectorId = Tools.parentNodeIdSelector;
                }
                dataGridView.setCurrentNodeIdSelectorId(currentNodeIdSelectorId);
                editor.getNodeIdSelectorsPanel().enablePaintMode();
            }
        }
        /**
         * Creates a fake nodeId selector in order to check the settability of each property.
         * @private
         * @static
         * @returns {NodeIdSelector} The fake nodeId selector.
         */
        static _createFakeNodeIdSelector() {
            const fakeNodeIdSelector = new NodeIdSelector();
            fakeNodeIdSelector.setPool('fakePool');
            fakeNodeIdSelector.setCriterion(ModelEnums.ECriterion.eIdentifier);
            fakeNodeIdSelector.setQueuing(true);
            fakeNodeIdSelector.setTimeout(500);
            fakeNodeIdSelector.setMaxInstanceCount(1);
            fakeNodeIdSelector.setCmdLine('fakeCmdLine');
            return fakeNodeIdSelector;
        }
    }
    return UINodeIdSelectorController;
});
