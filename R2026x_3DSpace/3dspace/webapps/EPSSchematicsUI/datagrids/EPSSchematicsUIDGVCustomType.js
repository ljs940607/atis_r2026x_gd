/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVCustomType'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVCustomType", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/Controls/Button", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVCustomType"], function (require, exports, UIDataGridView, UINLS, UIFontIcon, UIWUXTools, UIDGVTools, ModelEnums, TypeLibrary, WUXButton) {
    "use strict";
    /**
     * This class defines the UI data grid view custom type.
     * @private
     * @class UIDGVCustomType
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVCustomType
     * @extends UIDataGridView
     */
    class UIDGVCustomType extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {Block} blockModel - The block model.
         * @param {string} customTypeName - The custom type name.
         * @param {boolean} isEditable - True if the custom type is editable else false.
         */
        constructor(editor, blockModel, customTypeName, isEditable) {
            super({
                className: 'sch-datagridview-customtype',
                isEditable: isEditable,
                placeholder: UINLS.get('placeholderNoProperties'),
                rowsHeader: isEditable,
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: true,
                columnDragEnabledFlag: false,
                cellSelection: 'none',
                rowSelection: isEditable ? 'multiple' : 'none',
                cellPreselectionFeedback: isEditable ? 'row' : 'none',
                showCellActivationFlag: false,
                cellActivationFeedback: 'none'
                //onContextualEvent: () => []
            });
            this._editor = editor;
            this._blockModel = blockModel;
            this._customTypeName = customTypeName;
            this._isEditable = isEditable;
            this._graphContext = this._blockModel.getGraphContext();
            this._customType = TypeLibrary.getType(this._graphContext, customTypeName);
            this._customTypeCategory = TypeLibrary.getTypeCategory(this._graphContext, customTypeName);
            this._isEnumTypeCategory = this._customTypeCategory === ModelEnums.FTypeCategory.fEnum;
            this._typeNameList = TypeLibrary.getTypeNameList(this._graphContext, ModelEnums.FTypeCategory.fAll);
            if (this._isEditable) {
                this._createToolbar();
            }
            this._updateContent();
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
            this._editor = undefined;
            this._blockModel = undefined;
            this._customTypeName = undefined;
            this._graphContext = undefined;
            this._customType = undefined;
            this._customTypeCategory = undefined;
            this._isEnumTypeCategory = undefined;
            this._typeNameList = undefined;
            this._addButton = undefined;
            this._deleteButton = undefined;
            super.remove();
        }
        /**
         * Gets the WUX add button.
         * @public
         * @returns {WUXButton|undefined} The WUX add button.
         */
        getAddButton() {
            return this._addButton;
        }
        /**
         * Gets the WUX delete button.
         * @public
         * @returns {WUXButton|undefined} The WUX delete button.
         */
        getDeleteButton() {
            return this._deleteButton;
        }
        /**
         * Updates the type library custom type.
         * @public
         */
        updateTypeLibraryCustomType() {
            const customTypeDefinition = this._getCustomTypeDefinition();
            TypeLibrary.updateLocalCustomObjectType(this._graphContext, this._customTypeName, customTypeDefinition);
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
            this._defineColumnName();
            this._defineColumnValueType();
            this._defineColumnValue();
            this._defineColumnMandatoryValue();
        }
        /**
         * Creates the data grid view toolbar.
         * @protected
         * @override
         */
        _createToolbar() {
            super._createToolbar();
            this._addButton = new WUXButton({
                icon: UIFontIcon.getWUXFAIconDefinition('plus'),
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: UINLS.get('shortHelpAddProperty') }),
                onClick: this._onAddButtonClick.bind(this)
            }).inject(this._toolbarContainer);
            this._deleteButton = new WUXButton({
                icon: UIFontIcon.getWUX3DSIconDefinition('trash'),
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: UINLS.get('shortHelpDeleteProperty') }),
                disabled: true,
                onClick: this._onDeleteButtonClick.bind(this)
            }).inject(this._toolbarContainer);
            this._treeDocument.getXSO().onChange(() => {
                if (this._deleteButton !== undefined) {
                    const selectedNodes = this._treeDocument.getSelectedNodes();
                    this._deleteButton.disabled = selectedNodes.length === 0;
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
         * Defines the data grid view name column.
         * @private
         */
        _defineColumnName() {
            this._columns.push({
                dataIndex: 'tree',
                text: UINLS.get('treeListColumnName'),
                typeRepresentation: 'string',
                sortableFlag: this._isEditable,
                editableFlag: this._isEditable,
                editionPolicy: 'EditionOnOver',
                setCellValue: (cellInfos, value) => {
                    let newName = value;
                    const roots = this._treeDocument.getRoots();
                    const filteredRoots = roots.filter(nodeModel => nodeModel.getLabel() === newName);
                    if (filteredRoots.length > 0) {
                        newName = cellInfos.nodeModel.getLabel();
                    }
                    cellInfos.nodeModel.updateOptions({ label: newName });
                }
            });
        }
        /**
         * Defines the data grid view value type column.
         * @private
         */
        _defineColumnValueType() {
            this._columns.push({
                dataIndex: 'valueType',
                text: UINLS.get('treeListColumnValueType'),
                typeRepresentation: 'valueTypeCombo',
                sortableFlag: this._isEditable,
                editableFlag: this._isEditable,
                editionPolicy: 'EditionOnOver',
                getCellSemantics: () => { return { possibleValues: this._typeNameList }; }
            });
        }
        /**
         * Defines the data grid view value column.
         * @private
         */
        _defineColumnValue() {
            this._columns.push({
                dataIndex: 'defaultValue',
                text: UINLS.get('treeListColumnDefaultValue'),
                typeRepresentation: 'String',
                sortableFlag: this._isEditable,
                editableFlag: this._isEditable,
                editionPolicy: 'EditionOnOver',
                alignment: 'near',
                getCellTypeRepresentation: cellInfos => {
                    let typeRepresentation = 'String';
                    if (cellInfos.nodeModel) {
                        typeRepresentation = cellInfos.nodeModel.getAttributeValue('valueType');
                    }
                    return typeRepresentation;
                },
                getCellEditableState: (cellInfos) => {
                    let isEditable = this._isEditable;
                    if (cellInfos.nodeModel) { // TODO: Ask WebUX if possible to have a typrep that displays nothing?
                        const valueType = cellInfos.nodeModel.getAttributeValue('valueType');
                        isEditable = isEditable && (valueType !== 'Buffer' && valueType !== 'Array<Buffer>');
                    }
                    return isEditable;
                },
                getCellSemantics: cellInfos => UIDGVTools.getDataItemDefaultValueCellSemantics(this._editor, cellInfos),
                getCellValue: (cellInfos) => {
                    let cellValue = undefined;
                    if (cellInfos.nodeModel) {
                        const defaultValue = cellInfos.nodeModel.getAttributeValue('defaultValue');
                        const valueType = cellInfos.nodeModel.getAttributeValue('valueType');
                        const isDefaultValueValid = TypeLibrary.isValueType(this._graphContext, valueType, defaultValue);
                        cellValue = isDefaultValueValid ? defaultValue : undefined;
                    }
                    return cellValue;
                },
                setCellValue: (cellInfos, value) => {
                    cellInfos.nodeModel.setAttribute('defaultValue', value);
                }
            });
        }
        /**
         * Defines the data grid view mandatory value column.
         * @private
         */
        _defineColumnMandatoryValue() {
            this._columns.push({
                dataIndex: 'mandatoryValue',
                width: 40,
                resizableFlag: false,
                alignment: 'center',
                icon: UIFontIcon.getWUX3DSIconDefinition('issue'),
                typeRepresentation: 'boolean',
                sortableFlag: this._isEditable,
                editableFlag: this._isEditable,
                editionPolicy: 'EditionOnOver',
                getCellTooltip: () => {
                    return UIWUXTools.createTooltip({
                        shortHelp: UINLS.get('treeListColumnMandatoryValue'),
                        initialDelay: 500
                    });
                }
            });
        }
        /**
         * Updates the data grid view content.
         * @private
         */
        _updateContent() {
            if (this._customType !== undefined) {
                const isClassType = this._customTypeCategory === ModelEnums.FTypeCategory.fClass;
                const isEventType = this._customTypeCategory === ModelEnums.FTypeCategory.fEvent;
                const isClassOrEventType = (isClassType || isEventType) && this._customType.descriptor;
                const customTypeDescriptor = isClassOrEventType ? this._customType.descriptor : this._customType;
                Object.keys(customTypeDescriptor).forEach(propertyName => {
                    const property = customTypeDescriptor[propertyName];
                    this._addCustomType(propertyName, property.type, property.defaultValue, property.mandatory);
                });
                if (this._isEnumTypeCategory) {
                    this._dataGridView.layout.setColumnVisibleFlag('valueType', false);
                    this._dataGridView.layout.setColumnVisibleFlag('defaultValue', false);
                    this._dataGridView.layout.setColumnVisibleFlag('mandatoryValue', false);
                }
            }
        }
        /**
         * Adds a custom type.
         * @private
         * @param {string} name - The custom type name.
         * @param {string} valueType - The custom type value type.
         * @param {*} defaultValue - The custom type default value.
         * @param {boolean} mandatoryValue - The custom type mandatory value.
         */
        _addCustomType(name, valueType, defaultValue, mandatoryValue) {
            this._addTreeNodeModel({
                label: name,
                grid: {
                    valueType: valueType,
                    defaultValue: defaultValue,
                    mandatoryValue: mandatoryValue
                }
            });
        }
        /**
         * Gets the custom type definition.
         * @private
         * @returns {IObjectType} The custom type definition.
         */
        _getCustomTypeDefinition() {
            let customType = {};
            const roots = this._treeDocument.getRoots();
            roots.forEach(nodeModel => {
                const name = nodeModel.getLabel();
                customType[name] = {
                    type: nodeModel.getAttributeValue('valueType'),
                    defaultValue: nodeModel.getAttributeValue('defaultValue'),
                    mandatory: nodeModel.getAttributeValue('mandatoryValue')
                };
            });
            return customType;
        }
        /**
         * The callback on the add button click event.
         * @private
         */
        _onAddButtonClick() {
            const roots = this._treeDocument.getRoots();
            const property = 'property';
            let id = 1;
            let propertyName = property + id;
            const filterCB = (root) => root.getLabel() === propertyName;
            while (roots.filter(filterCB).length > 0) {
                id++;
                propertyName = property + id;
            }
            this._addCustomType(propertyName, 'Double', undefined, false);
        }
        /**
         * The callback on the delete button click event.
         * @private
         */
        _onDeleteButtonClick() {
            const roots = this._treeDocument.getSelectedNodes();
            roots.forEach(nodeModel => this._treeDocument.removeRoot(nodeModel));
        }
    }
    return UIDGVCustomType;
});
