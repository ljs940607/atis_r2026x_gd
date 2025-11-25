/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIValueEvaluator'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIValueEvaluator", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUIBasicEvaluator", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeDocument", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIValueEvaluator"], function (require, exports, UIBasicEvaluator, UIDom, WUXTreeDocument, WUXTreeNodeModel) {
    "use strict";
    /**
     * This class defines a UI value evaluator.
     * @private
     * @class UIValueEvaluator
     * @alias module:S/EPSSchematicsUI/components/EPSSchematicsUIValueEvaluator
     */
    class UIValueEvaluator {
        /**
         * @public
         * @constructor
         * @param {*} value - The value to evaluate.
         * @param {IValueEvaluatorOptions} [options] The evaluator options.
         */
        constructor(value, options = {}) {
            this._value = value;
            this._options = options;
            this._element = UIDom.createElement('div', { className: 'sch-value-evaluator' });
            this._setValue(value);
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
         * Gets the object evaluator element.
         * @public
         * @returns {HTMLDivElement} The object evaluator element.
         */
        getElement() {
            return this._element;
        }
        /**
         * Gets the WUX tree document.
         * @public
         * @returns {WUXTreeDocument} The tree document.
         */
        getTreeDocument() {
            return this._treeDocument;
        }
        /**
         * Gets the value of the evaluator.
         * @public
         * @returns {*} The value of the evaluator.
         */
        getValue() {
            return this._value;
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
         * Sets the value of the evaluator.
         * @private
         * @param {*} value - The value of the evaluator.
         */
        _setValue(value) {
            if (typeof value === 'object' && !(value instanceof ArrayBuffer)) {
                this._createObjectView(value);
            }
            else {
                this._createInlineView(value);
            }
        }
        /**
         * Creates the inline view of the provided value.
         * @private
         * @param {string|number|boolean} value - The value.
         */
        _createInlineView(value) {
            this._value = value;
            const inlineElt = UIBasicEvaluator.getInlineValueElement(value);
            if (inlineElt) {
                this._element.appendChild(inlineElt);
            }
        }
        /**
         * Creates the object view of the provided value.
         * @private
         * @param {object|WUXTreeDocument} value - The object value value of tree document object value.
         */
        _createObjectView(value) {
            this._value = value;
            const treeDocument = value instanceof WUXTreeDocument ? value : UIValueEvaluator._createObjectTreeDocument(value);
            if (treeDocument) {
                this._treeDocument = treeDocument;
                const rootNodeModel = this._treeDocument.getRoots()[0];
                this._nodeModelMap = new Map();
                // Clean previous tree document model events
                const modelEvents = this._treeDocument.getModelEvents();
                modelEvents.unsubscribeAll({ event: 'postExpand' });
                modelEvents.unsubscribeAll({ event: 'postCollapse' });
                this._treeDocument.onPreExpand(UIValueEvaluator._onPreExpand);
                this._treeDocument.onPostExpand(this._onPostExpand.bind(this));
                this._treeDocument.onPostCollapse(this._onPostCollapse.bind(this));
                const key = rootNodeModel.getAttributeValue('key');
                const val = rootNodeModel.getAttributeValue('value');
                const keyValueElt = UIValueEvaluator._createKeyValueElement(key, val, false);
                const rootElement = UIDom.createElement('ol', { parent: this._element, className: ['sch-object-tree-root', 'sch-object-tree-children'] });
                const liElt = UIDom.createElement('li', {
                    parent: rootElement,
                    className: 'sch-object-tree-parent',
                    children: [keyValueElt]
                });
                liElt.onclick = UIValueEvaluator._onClick.bind(this, rootNodeModel);
                const olElt = UIDom.createElement('ol', {
                    parent: rootElement,
                    className: 'sch-object-tree-children'
                });
                this._addNodeModelToMap(rootNodeModel, liElt, olElt);
                if (rootNodeModel.isExpanded()) {
                    this._createNodeView(rootNodeModel);
                }
            }
        }
        /**
         * The callback on the tree document pre expand event.
         * @private
         * @param {IWUXModelEvent} event - The pre expand event.
         */
        static _onPreExpand(event) {
            const parentNodeModel = event.target;
            if (parentNodeModel?.getChildren().length === 0) {
                const parentValue = parentNodeModel.getAttributeValue('value');
                Object.keys(parentValue).forEach(key => {
                    const value = parentValue[key];
                    const childNodeModel = new WUXTreeNodeModel({
                        label: key,
                        grid: { key: key, value: value },
                        children: []
                    });
                    parentNodeModel.addChild(childNodeModel);
                });
            }
            parentNodeModel?.preExpandDone();
        }
        /**
         * The callback on the tree document post expand event.
         * @private
         * @param {IWUXModelEvent} event - The post expand event.
         */
        _onPostExpand(event) {
            if (event.target) {
                this._createNodeView(event.target);
                if (this._options.onExpand !== undefined) {
                    this._options.onExpand();
                }
            }
        }
        /**
         * The callback on the tree document post collapse event.
         * @private
         * @param {IWUXModelEvent} event - The post collapse event.
         */
        _onPostCollapse(event) {
            if (event.target) {
                this._removeNodeView(event.target);
                if (this._options.onCollapse !== undefined) {
                    this._options.onCollapse();
                }
            }
        }
        /**
         * The callback on the expander click event.
         * @private
         * @static
         * @param {WUXTreeNodeModel} childNodeModel - The clicked child node model.
         * @param {MouseEvent} event - The click event.
         */
        static _onClick(childNodeModel, event) {
            const selection = window.getSelection();
            if (selection?.toString() === '') {
                if (!childNodeModel.isExpanded()) {
                    childNodeModel.expand();
                }
                else {
                    childNodeModel.collapse();
                }
            }
            event.stopPropagation();
        }
        /**
         * Creates a tree document from the provided object value.
         * @private
         * @static
         * @param {object} value - The object value.
         * @returns {WUXTreeDocument|undefined} The object value tree document.
         */
        static _createObjectTreeDocument(value) {
            let treeDocument = undefined;
            if (typeof value === 'object') {
                treeDocument = new WUXTreeDocument({ useAsyncPreExpand: true });
                const rootNode = new WUXTreeNodeModel({ grid: { value: value }, children: [] });
                treeDocument.addChild(rootNode);
            }
            return treeDocument;
        }
        /**
         * Creates the key value pair element.
         * @private
         * @static
         * @param {string} key - The key.
         * @param {*} value - The value
         * @param {boolean} hideValue - True to hide the object value (only display object type) else false.
         * @returns {HTMLSpanElement} The key value pair element.
         */
        static _createKeyValueElement(key, value, hideValue) {
            let container = [];
            if (key !== undefined) {
                const keyElt = UIDom.createElement('span', { className: 'sch-object-key', textContent: key });
                const separatorElt = UIDom.createElement('span', { textContent: ': ' });
                container = [keyElt, separatorElt];
            }
            const inlineValueElt = UIBasicEvaluator.getInlineValueElement(value, hideValue);
            if (inlineValueElt) {
                container.push(inlineValueElt);
            }
            return UIDom.createElement('span', { className: 'sch-object-keyvalue', children: container });
        }
        /**
         * Creates the node view.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         */
        _createNodeView(nodeModel) {
            this._expandNodeViewArrow(nodeModel);
            this._expandNodeViewTitle(nodeModel);
            const childNodeModelList = nodeModel.getChildren();
            childNodeModelList.forEach(childNodeModel => {
                const key = childNodeModel.getAttributeValue('key');
                const value = childNodeModel.getAttributeValue('value');
                const isObject = value !== null && value !== undefined && typeof value === 'object' && !(value instanceof ArrayBuffer);
                const isChildExpanded = childNodeModel.isExpanded();
                const childContainer = this._getChildContainer(nodeModel);
                const liElt = UIDom.createElement('li', {
                    parent: childContainer,
                    className: isObject ? 'sch-object-tree-parent' : 'sch-object-tree-leaf',
                    children: [UIValueEvaluator._createKeyValueElement(key, value, isChildExpanded)]
                });
                const olElt = UIDom.createElement('ol', {
                    parent: childContainer,
                    className: 'sch-object-tree-children'
                });
                this._addNodeModelToMap(childNodeModel, liElt, olElt);
                if (isObject) {
                    liElt.onclick = UIValueEvaluator._onClick.bind(this, childNodeModel);
                }
                if (isChildExpanded) {
                    this._createNodeView(childNodeModel);
                }
            });
        }
        /**
         * Removes the node view.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         */
        _removeNodeView(nodeModel) {
            this._collapseNodeViewArrow(nodeModel);
            this._collapseNodeViewTitle(nodeModel);
            const childNodeModelList = nodeModel.getChildren();
            childNodeModelList.forEach(childNodeModel => {
                this._removeNodeView(childNodeModel);
                this._removeNodeModelFromMap(childNodeModel);
            });
            const childContainer = this._getChildContainer(nodeModel);
            if (childContainer !== undefined) {
                while (childContainer.firstChild) {
                    childContainer.removeChild(childContainer.firstChild);
                }
            }
        }
        /**
         * Expands the node view arrow.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         */
        _expandNodeViewArrow(nodeModel) {
            const titleContainer = this._getNodeTitleContainer(nodeModel);
            if (titleContainer) {
                UIDom.addClassName(titleContainer, 'expanded');
            }
        }
        /**
         * Collapses the node view arrow.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         */
        _collapseNodeViewArrow(nodeModel) {
            const titleContainer = this._getNodeTitleContainer(nodeModel);
            if (titleContainer) {
                UIDom.removeClassName(titleContainer, 'expanded');
            }
        }
        /**
         * Expands the node view title.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         */
        _expandNodeViewTitle(nodeModel) {
            const titleContainer = this._getNodeTitleContainer(nodeModel);
            if (titleContainer !== undefined) {
                const key = nodeModel.getAttributeValue('key');
                const value = nodeModel.getAttributeValue('value');
                while (titleContainer.firstChild) {
                    titleContainer.removeChild(titleContainer.firstChild);
                }
                titleContainer.appendChild(UIValueEvaluator._createKeyValueElement(key, value, true));
            }
        }
        /**
         * Collapses the node view title.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         */
        _collapseNodeViewTitle(nodeModel) {
            const titleContainer = this._getNodeTitleContainer(nodeModel);
            if (titleContainer !== undefined) {
                const key = nodeModel.getAttributeValue('key');
                const value = nodeModel.getAttributeValue('value');
                while (titleContainer.firstChild) {
                    titleContainer.removeChild(titleContainer.firstChild);
                }
                titleContainer.appendChild(UIValueEvaluator._createKeyValueElement(key, value, false));
            }
        }
        /**
         * Adds the node model to the map.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @param {HTMLLIElement} titleContainer - The title container.
         * @param {HTMLOListElement} childContainer - The child container.
         */
        _addNodeModelToMap(nodeModel, titleContainer, childContainer) {
            this._nodeModelMap.set(nodeModel, { titleContainer: titleContainer, childContainer: childContainer });
        }
        /**
         * Removes the node model from the map.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         */
        _removeNodeModelFromMap(nodeModel) {
            this._nodeModelMap.delete(nodeModel);
        }
        /**
         * Gets the child container.
         * @private
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @returns {HTMLOListElement|undefined} The child container.
         */
        _getChildContainer(nodeModel) {
            const nodeModelFromMap = this._nodeModelMap.get(nodeModel);
            return nodeModelFromMap?.childContainer;
        }
        /**
         * Gets the node's count.
         * @private
         * @param {WUXTreeNodeModel} node - The parent node.
         * @returns {number} The node's count.
         */
        static _getNodesCount(node) {
            let count = 0;
            if (node !== undefined) {
                count++;
                if (node.isExpanded()) {
                    const childNodes = node.getChildren();
                    childNodes.forEach(childNode => { count += UIValueEvaluator._getNodesCount(childNode); });
                }
            }
            return count;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                      ___  ____ _____                                           //
        //                                     / _ \|  _ \_   _|                                          //
        //                                    | | | | | | || |                                            //
        //                                    | |_| | |_| || |                                            //
        //                                     \___/|____/ |_|                                            //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Gets the object expanded height.
         * @private
         * @ignore
         * @returns {number} The object expanded height.
         */
        _getObjectExpandedHeight() {
            const rootNode = this._treeDocument.getRoots()[0];
            const expandedCount = UIValueEvaluator._getNodesCount(rootNode);
            const height = expandedCount * 16;
            return height;
        }
        /**
         * Gets the node title container.
         * @private
         * @ignore
         * @param {WUXTreeNodeModel} nodeModel - The node model.
         * @returns {HTMLLIElement|undefined} The child container.
         */
        _getNodeTitleContainer(nodeModel) {
            const nodeModelFromMap = this._nodeModelMap.get(nodeModel);
            return nodeModelFromMap?.titleContainer;
        }
    }
    return UIValueEvaluator;
});
