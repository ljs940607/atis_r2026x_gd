/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSettings'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSettings", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, UIDGVAbstractDataItem, Events, UINLS) {
    "use strict";
    /**
     * This class defines the UI data grid view setting.
     * @private
     * @class UIDGVSettings
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSettings
     * @extends UIDGVAbstractDataItem
     */
    class UIDGVSettings extends UIDGVAbstractDataItem {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, blockModel, readOnly) {
            super({
                className: [
                    'sch-datagridview-settings'
                ]
            }, editor, blockModel, readOnly, 'setting', 'defaultValue');
            this._onSettingAddCB = this._onSettingAdd.bind(this);
            this._onSettingRemoveCB = this._onSettingRemove.bind(this);
            this._onSettingValueChangeCB = this._onSettingValueChange.bind(this);
            this._onSettingOverrideChangeCB = this._onSettingOverrideChange.bind(this);
            this._updateContent();
            this._blockModel.addListener(Events.SettingAddEvent, this._onSettingAddCB);
            this._blockModel.addListener(Events.SettingRemoveEvent, this._onSettingRemoveCB);
        }
        /**
         * Gets the settings section node model.
         * @public
         * @returns {WUXTreeNodeModel} The settings section node model.
         */
        getSettingsSectionNodeModel() {
            return this._settingsSectionNodeModel;
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
            this._blockModel.removeListener(Events.SettingAddEvent, this._onSettingAddCB);
            this._blockModel.removeListener(Events.SettingRemoveEvent, this._onSettingRemoveCB);
            this._blockModel.getSettings().forEach(setting => {
                setting.removeListener(Events.SettingValueChangeEvent, this._onSettingValueChangeCB);
                setting.removeListener(Events.SettingOverrideChangeEvent, this._onSettingOverrideChangeCB);
            });
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._settingsSectionNodeModel = undefined;
            this._onSettingAddCB = undefined;
            this._onSettingRemoveCB = undefined;
            this._onSettingValueChangeCB = undefined;
            this._onSettingOverrideChangeCB = undefined;
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
            this._defineNameColumn();
            this._defineValueTypeColumn();
            this._defineDefaultValueColumn();
            this._defineActionsColumn();
            this._defineSectionActionsColumn();
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
         * Updates the data grid view content.
         * @private
         */
        _updateContent() {
            this._settingsSectionNodeModel = this._createSectionNodeModel();
            const settings = this._blockModel.getSettings();
            settings.forEach(setting => this._createSettingNodeModel(setting));
            this._updateSectionNodeModelLabel();
        }
        /**
         * Creates a setting node model.
         * @private
         * @param {Setting} setting - The setting model.
         * @returns {WUXTreeNodeModel|undefined} The created setting node model.
         */
        _createSettingNodeModel(setting) {
            let nodeModel = this._createDataItemNodeModel(setting, 'defaultValue', true);
            if (nodeModel !== undefined) {
                this._settingsSectionNodeModel.addChild(nodeModel);
                this._settingsSectionNodeModel.expand();
                this._updateSectionNodeModelLabel();
                setting.addListener(Events.SettingValueChangeEvent, this._onSettingValueChangeCB);
                setting.addListener(Events.SettingOverrideChangeEvent, this._onSettingOverrideChangeCB);
            }
            return nodeModel;
        }
        /**
         * Updates the setting section node model label.
         * @private
         */
        _updateSectionNodeModelLabel() {
            const count = this._settingsSectionNodeModel.getChildren()?.length || 0;
            const label = UINLS.get('categorySettings') + ' (' + count + ')';
            this._settingsSectionNodeModel.setLabel(label);
        }
        /**
          * The callback on the model setting add event.
          * @private
          * @param {Events.SettingAddEvent} event - The model setting add event.
          */
        _onSettingAdd(event) {
            const setting = event.getSetting();
            this._createSettingNodeModel(setting);
        }
        /**
         * The callback on the model setting remove event.
         * @private
         * @param {Events.DataPortRemoveEvent} event - The model setting remove event.
         */
        _onSettingRemove(event) {
            const setting = event.getSetting();
            setting.removeListener(Events.SettingValueChangeEvent, this._onSettingValueChangeCB);
            setting.removeListener(Events.SettingOverrideChangeEvent, this._onSettingOverrideChangeCB);
            const childrenNodeModel = this._settingsSectionNodeModel.getChildren() || [];
            const settingNodeModel = childrenNodeModel.find(node => node.getAttributeValue('setting') === setting);
            if (settingNodeModel) {
                this._settingsSectionNodeModel.removeChild(settingNodeModel);
            }
            this._updateSectionNodeModelLabel();
        }
        /**
         * The callback on the model setting value change event.
         * @private
         * @param {Events.SettingValueChangeEvent} event - The model setting value change event.
         */
        _onSettingValueChange(event) {
            const setting = event.getSetting();
            const nodeModel = this._getNodeModelFromSettingModel(setting);
            if (nodeModel) {
                const valueType = setting.getValueType();
                nodeModel.setAttribute('valueType', valueType);
                const defaultValue = setting.getValue();
                nodeModel.setAttribute('defaultValue', defaultValue);
            }
        }
        /**
         * The callback on the model setting override change event.
         * @private
         * @param {Events.SettingOverrideChangeEvent} event - The model setting override change event.
         */
        _onSettingOverrideChange(event) {
            const setting = event.getSetting();
            const nodeModel = this._getNodeModelFromSettingModel(setting);
            if (nodeModel) {
                nodeModel.updateOptions({ grid: { actions: {} } });
            }
        }
        /**
         * Gets the node model from the given setting model.
         * @private
         * @param {Setting} setting - The setting model.
         * @returns {WUXTreeNodeModel|undefined} The corresponding node model.
         */
        _getNodeModelFromSettingModel(setting) {
            return (this._settingsSectionNodeModel.getChildren() || []).find(child => child.getAttributeValue('setting') === setting);
        }
    }
    return UIDGVSettings;
});
