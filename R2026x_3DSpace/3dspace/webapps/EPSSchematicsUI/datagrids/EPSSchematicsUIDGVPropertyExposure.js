/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVPropertyExposure'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVPropertyExposure", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIDataGridView, UINLS, WUXTreeNodeModel, TypeLibrary, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI data grid view property exposure.
     * @private
     * @class UIDGVPropertyExposure
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVPropertyExposure
     * @extends UIDataGridView
     */
    class UIDGVPropertyExposure extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIDataPort} dataPortUI - The UI data port.
         * @param {Function} updateCB - The callback to call when updating a property.
         */
        constructor(dataPortUI, updateCB) {
            super({
                className: 'sch-datagridview-propertyexposure',
                rowsHeader: false,
                columnsHeader: false,
                columnDragEnabledFlag: false,
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: false,
                cellSelection: 'none',
                rowSelection: 'single'
            });
            this._dataPortUI = dataPortUI;
            this._updateCB = updateCB;
            this._generateHierarchy();
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
         * Removes the data grid view.
         * @public
         * @override
         */
        remove() {
            this._dataPortUI = undefined;
            super.remove();
        }
        /**
         * Gets the list of exposed data ports name.
         * @public
         * @returns {string[]} The list of exposed data ports name.
         */
        getExposedDataPortsName() {
            const rootNode = this._treeDocument.getNthRoot(0);
            const selectedNodes = this._treeDocument.getAllDescendants().filter(node => node.getAttributeValue('isExposed') === true);
            const exposedDataPorts = [];
            selectedNodes.forEach(selectedNode => {
                if (selectedNode !== rootNode) {
                    let dataPortName = selectedNode.getLabel();
                    let parentNode = selectedNode.getParent();
                    while (parentNode !== rootNode) {
                        dataPortName = parentNode.getLabel() + '.' + dataPortName;
                        parentNode = parentNode.getParent();
                    }
                    exposedDataPorts.push(dataPortName);
                }
            });
            return exposedDataPorts;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            this._columns.push({
                dataIndex: 'tree',
                text: UINLS.get('treeListColumnPropertyName'),
                visibleFlag: true,
                sortableFlag: false,
                editableFlag: false,
                typeRepresentation: 'string'
            });
            this._columns.push({
                dataIndex: 'type',
                text: UINLS.get('treeListColumnValueType'),
                sortableFlag: false,
                editableFlag: false,
                typeRepresentation: 'string'
            });
            this._columns.push({
                dataIndex: 'isExposed',
                text: UINLS.get('treeListColumnExposition'),
                sortableFlag: false,
                editableFlag: true,
                typeRepresentation: 'independantBoolean', //'boolean',
                editionPolicy: 'EditionInPlace',
                width: 20,
                setCellValue: (cellInfos, value) => {
                    /*const nodeModel = cellInfos.nodeModel;
                    let newValue: boolean = value;
                    if (nodeModel.hasChildren() && nodeModel.isExpanded()) {
                        nodeModel.getChildren().forEach(childNode => {
                            childNode.setAttribute('isExposed', newValue);
                        });
                    }
                    nodeModel.setAttribute('isExposed', newValue);*/
                    cellInfos.nodeModel.setAttribute('isExposed', value);
                    this._updateCB();
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
         * Generates the properties hierarchy of the data port value type.
         * @private
         */
        _generateHierarchy() {
            const rootNode = new WUXTreeNodeModel({
                label: this._dataPortUI.getModel().getName(),
                grid: { type: this._dataPortUI.getModel().getValueType() },
                children: []
            });
            this._treeDocument.addRoot(rootNode);
            this._treeDocument.onPreExpand(this._onPreExpand.bind(this));
            this._treeDocument.expandNLevels(0);
            this._selectExpandedDataPorts();
        }
        /**
         * The callback on the treeDocument pre expand model event.
         * @private
         * @param {*} modelEvent - The pre expand model event.
         */
        _onPreExpand(modelEvent) {
            const nodeModel = modelEvent.target;
            if (nodeModel) {
                const valueTypeName = nodeModel.getAttributeValue('type');
                const valueType = TypeLibrary.getType(this._dataPortUI.getModel().getGraphContext(), valueTypeName);
                if (valueType !== undefined) {
                    const children = [];
                    Object.keys(valueType).forEach(propertyName => {
                        let childNode = (nodeModel.getChildren() || []).find(cn => cn.getLabel() === propertyName);
                        if (!childNode) {
                            const pValueTypeName = valueType[propertyName].type;
                            const typeCategory = ModelEnums.FTypeCategory.fObject | ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent;
                            const canExpand = TypeLibrary.hasType(this._dataPortUI.getModel().getGraphContext(), pValueTypeName, typeCategory);
                            childNode = new WUXTreeNodeModel({
                                label: propertyName,
                                grid: { type: pValueTypeName, isExposed: false },
                                children: canExpand ? [] : undefined
                            });
                        }
                        children.push(childNode);
                    });
                    nodeModel.removeChildren();
                    nodeModel.addChild(children);
                }
                nodeModel.preExpandDone();
            }
        }
        /**
         * Selects the expanded data ports in the data grid view.
         * @private
         */
        _selectExpandedDataPorts() {
            const rootNode = this._treeDocument.getNthRoot(0);
            const port = this._dataPortUI.getModel();
            const parentPort = port.dataPort;
            const parentUIPort = parentPort === undefined ? this._dataPortUI : this._dataPortUI.getParentPort();
            let exposedDataPorts;
            if (port.block.isTemplate()) {
                exposedDataPorts = this._dataPortUI.getAllSubDataPorts().map(subDataPort => subDataPort.getModel());
            }
            else {
                exposedDataPorts = parentPort === undefined ? port.getDataPorts() : parentPort.searchDataPortByName(RegExp(port.getName() + '.+'));
            }
            exposedDataPorts.forEach(exposedDataPort => {
                const exposedUIDataPort = parentUIPort.getUISubDataPortFromModel(exposedDataPort);
                if (exposedUIDataPort?.isExposed()) {
                    const dataPortName = exposedDataPort.getName();
                    const properties = dataPortName.split('.');
                    if (parentPort !== undefined) {
                        properties.shift();
                    }
                    let childNode = rootNode;
                    for (let p = 0; p < properties.length && childNode !== undefined; p++) {
                        const property = properties[p];
                        if (!childNode.isExpanded()) {
                            childNode.expand();
                        }
                        const childrenNodes = childNode.getChildren();
                        childNode = childrenNodes.find(cn => cn.getLabel() === property);
                    }
                    if (childNode !== undefined) {
                        childNode.setAttribute('isExposed', true);
                    }
                }
            });
        }
    }
    return UIDGVPropertyExposure;
});
