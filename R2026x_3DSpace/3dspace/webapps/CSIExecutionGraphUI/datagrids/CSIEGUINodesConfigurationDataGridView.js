/* global WUXManagedFontIcons */
/// <amd-module name='DS/CSIExecutionGraphUI/datagrids/CSIEGUINodesConfigurationDataGridView'/>
define("DS/CSIExecutionGraphUI/datagrids/CSIEGUINodesConfigurationDataGridView", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/Core/TooltipModel", "DS/Controls/Button"], function (require, exports, UIDataGridView, UIFontIcon, UIDom, WUXTooltipModel, WUXButton) {
    "use strict";
    /**
     * This class defines the CSI Execution Graph nodes configuration data grid view.
     * @private
     * @class CSIEGUINodesConfigurationDataGridView
     * @alias module:DS/CSIExecutionGraphUI/datagrids/CSIEGUINodesConfigurationDataGridView
     * @extends UIDataGridView
     */
    class CSIEGUINodesConfigurationDataGridView extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {string[]} nodesConfig - The nodes sonfig.
         */
        constructor(nodesConfig) {
            super({
                className: 'csiege-datagridview',
                rowsHeader: false,
                placeholder: 'No nodes configuration',
                cellActivationFeedback: 'none',
                cellSelection: 'single'
            });
            this.container = UIDom.createElement('div', { className: 'csiegui-datagridview-container' });
            this.deleteNodeConfigIconCB = {
                module: 'DS/CSIExecutionGraphUI/datagrids/CSIEGUINodesConfigurationDataGridView',
                func: 'deleteNodeConfiguration'
            };
            this._nodesConfig = nodesConfig;
            this.deleteNodeConfigIconCB.argument = { dataGridView: this };
            this.initialize();
        }
        /**
         * Removes the data grid view.
         * @public
         * @override
         */
        remove() {
            this._nodesConfig = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view element.
         * @public
         * @override
         * @returns {HTMLDivElement} The data grid view element.
         */
        getElement() {
            return this.container;
        }
        /**
         * Toggles the disabled state on the data grid view.
         * @public
         */
        toggleDisabledState() {
            if (UIDom.hasClassName(this.container, 'disabled')) {
                UIDom.removeClassName(this.container, 'disabled');
            }
            else {
                UIDom.addClassName(this.container, 'disabled');
            }
        }
        /**
         * Initializes the data grid view.
         * @protected
         */
        initialize() {
            this._nodesConfig.forEach(nodeConfig => {
                this._addTreeNodeModel({
                    grid: {
                        nodeConfig: nodeConfig,
                        deleteNodeConfig: this.deleteNodeConfigIconCB
                    }
                });
            });
            const addButton = new WUXButton({
                label: 'Add Node configuration',
                icon: { iconName: 'plus', fontIconFamily: WUXManagedFontIcons.Font3DS },
                emphasize: 'secondary',
                onClick: () => this.createAndEditNodeConfiguration()
            });
            this.container.appendChild(this._element);
            this.container.appendChild(addButton.getContent());
        }
        /**
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            this._columns.push({
                dataIndex: 'nodeConfig',
                text: 'CSI Nodes configuration',
                visibleFlag: true,
                editableFlag: true
            });
            this._columns.push({
                dataIndex: 'deleteNodeConfig',
                text: '',
                typeRepresentation: 'functionIcon',
                resizableFlag: false,
                sortableFlag: false,
                width: '30',
                minWidth: '30',
                editionPolicy: 'EditionOnOver',
                editableFlag: false,
                getCellSemantics: () => { return { icon: UIFontIcon.getWUX3DSIconDefinition('wrong') }; },
                getCellTooltip: () => new WUXTooltipModel({
                    shortHelp: 'Delete Node configuration',
                    initialDelay: 500
                })
            });
        }
        /**
         * Gets the nodes configuration.
         * @public
         * @returns {string[]} The nodes configuration.
         */
        getNodesConfig() {
            const roots = this.getTreeDocument().getRoots();
            const nodesConfig = roots.map(root => root.getAttributeValue('nodeConfig'));
            return nodesConfig;
        }
        /**
         * Creates and edit a node configuration.
         * @public
         */
        createAndEditNodeConfiguration() {
            const nodeModel = this._addTreeNodeModel({
                grid: {
                    nodeConfig: '',
                    deleteNodeConfig: this.deleteNodeConfigIconCB
                }
            });
            this.scrollToBottom();
            const cellID = this.getCellIdFromNodeModel(nodeModel, 0);
            this._dataGridView.setCellInEdition(cellID);
        }
        /**
         * Removes the selected node configuration from the tree document.
         * @protected
         * @static
         * @param {object} args - The function icon arguments.
         */
        static deleteNodeConfiguration(args) {
            const treeDocument = args.dataGridView.getTreeDocument();
            treeDocument.removeRoot(args.context.nodeModel);
        }
    }
    return CSIEGUINodesConfigurationDataGridView;
});
