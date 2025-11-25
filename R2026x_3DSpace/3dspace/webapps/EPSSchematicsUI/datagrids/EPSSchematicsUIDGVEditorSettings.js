/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVEditorSettings'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVEditorSettings", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools"], function (require, exports, UIDataGridView, UINLS, UIWUXTools) {
    "use strict";
    /**
     * This class defines the UI data grid view editor settings.
     * @private
     * @class UIDGVEditorSettings
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVEditorSettings
     * @extends UIDataGridView
     */
    class UIDGVEditorSettings extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super({
                className: 'sch-datagridview-editor-settings',
                columnDragEnabledFlag: false,
                showAlternateBackgroundFlag: false,
                showCellActivationFlag: false,
                showCellPreselectionFlag: false,
                cellSelection: 'none',
                rowSelection: 'single',
                showRowBorderFlag: true,
                //cellActivationFeedback: 'none'
                placeholder: '',
                rowsHeader: false,
                defaultColumnDef: {
                    width: 'auto',
                    typeRepresentation: 'string'
                }
            });
            this._editor = editor;
            this._readSettingValues();
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
            super.remove();
        }
        /**
         * Writes the setting values.
         * @private
         */
        writeSettingValues() {
            const roots = this.getTreeDocument().getRoots();
            if (roots.length > 0) {
                const localStorageController = this._editor.getLocalStorageController();
                localStorageController.setMaxSplitDataPortCountEditorSetting(roots[0].getAttributeValue('settingValue'));
                localStorageController.setAlwaysMinimizeDataLinksSetting(roots[1].getAttributeValue('settingValue'));
                this._editor._setGraphVersion2(roots[2].getAttributeValue('settingValue'));
                localStorageController.setShowSplashScreen(roots[3].getAttributeValue('settingValue'));
                // For read only mode testing!
                /*const isReadOnly = roots[2].getAttributeValue('settingValue') as boolean;
                const rootViewer = this._editor.getViewerController().getRootViewer();
                rootViewer.setReadOnly(isReadOnly);*/
            }
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
            super._defineColumns();
            this._defineSettingNameColumn();
            this._defineSettingValueColumn();
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
         * Defines the setting name column.
         * @private
         */
        _defineSettingNameColumn() {
            this._columns.push({
                dataIndex: 'settingName',
                text: 'Setting',
                sortableFlag: true,
                editableFlag: false,
                typeRepresentation: 'string',
                getCellClassName: () => 'sch-dgv-settings-name',
                getCellTooltip: function (cellInfos) {
                    let tooltip = {};
                    if (cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options) {
                        tooltip = cellInfos.nodeModel.options.tooltip || {};
                    }
                    return tooltip;
                }
            });
        }
        /**
         * Defines the setting value column.
         * @private
         */
        _defineSettingValueColumn() {
            this._columns.push({
                dataIndex: 'settingValue',
                text: 'Value',
                sortableFlag: true,
                editableFlag: true,
                alignment: 'near',
                //editionPolicy: 'EditionInPlace',
                editionPolicy: 'EditionOnOver',
                getCellClassName: () => 'sch-dgv-settings-value',
                getCellTypeRepresentation: function (cellInfos) {
                    let typeRepresentation = 'string';
                    if (cellInfos && cellInfos.nodeModel && cellInfos.nodeModel.options) {
                        typeRepresentation = cellInfos.nodeModel.options.typeRepresentation || 'string';
                    }
                    return typeRepresentation;
                }
            });
        }
        /**
         * Reads the setting values.
         * @private
         */
        _readSettingValues() {
            const localStorageController = this._editor.getLocalStorageController();
            this._addTreeNodeModel({
                label: 'maxSplitDataPortCount',
                grid: {
                    settingName: UINLS.get('settingNameMaxSplit'),
                    settingValue: localStorageController.getMaxSplitDataPortCountEditorSetting()
                },
                typeRepresentation: 'integer',
                tooltip: UIWUXTools.createTooltip({
                    title: UINLS.get('settingTitleMaxSplit'),
                    shortHelp: UINLS.get('settingShortHelpMaxSplit'),
                    longHelp: UINLS.get('settingLongHelpMaxSplit')
                })
            });
            this._addTreeNodeModel({
                label: 'alwaysMinimizeDataLinks',
                grid: {
                    settingName: UINLS.get('alwaysMinimizeDataLinksSettingName'),
                    settingValue: localStorageController.getAlwaysMinimizeDataLinksSetting()
                },
                typeRepresentation: 'boolean',
                tooltip: UIWUXTools.createTooltip({
                    title: UINLS.get('alwaysMinimizeDataLinksSettingTooltipTitle'),
                    shortHelp: UINLS.get('alwaysMinimizeDataLinksSettingTooltipShortHelp'),
                    longHelp: UINLS.get('alwaysMinimizeDataLinksSettingTooltipLongHelp')
                })
            });
            this._addTreeNodeModel({
                label: 'graphVersion2',
                grid: {
                    settingName: UINLS.get('graphVersion2SettingName'),
                    settingValue: this._editor._getGraphVersion2()
                },
                typeRepresentation: 'boolean',
                tooltip: UIWUXTools.createTooltip({
                    title: UINLS.get('graphVersion2SettingTooltipTitle'),
                    shortHelp: UINLS.get('graphVersion2SettingTooltipShortHelp'),
                    longHelp: UINLS.get('graphVersion2SettingTooltipLongHelp')
                })
            });
            this._addTreeNodeModel({
                label: 'showSplashScreen',
                grid: {
                    settingName: UINLS.get('showSplashScreenSettingName'),
                    settingValue: localStorageController.getShowSplashScreen()
                },
                typeRepresentation: 'boolean',
                tooltip: UIWUXTools.createTooltip({
                    title: UINLS.get('showSplashScreenSettingTooltipTitle'),
                    shortHelp: UINLS.get('showSplashScreenSettingTooltipShortHelp'),
                    longHelp: UINLS.get('showSplashScreenSettingTooltipLongHelp')
                })
            });
            // For read only mode testing!
            /*const rootViewer = this._editor.getViewerController().getRootViewer();
            const isReadOnly = rootViewer.isReadOnly();
            this._addTreeNodeModel({
                label: 'testReadOnly',
                grid: {
                    settingName: 'testReadOnly',
                    settingValue: isReadOnly
                },
                typeRepresentation: 'boolean'
            });*/
        }
    }
    return UIDGVEditorSettings;
});
