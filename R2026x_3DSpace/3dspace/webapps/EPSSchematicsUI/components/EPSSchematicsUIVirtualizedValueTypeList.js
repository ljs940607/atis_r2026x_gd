/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedValueTypeList'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedValueTypeList", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedSearchList", "DS/Utilities/Dom", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIVirtualizedValueTypeList"], function (require, exports, UIVirtualizedSearchList, WUXDomUtils) {
    "use strict";
    /**
     * This class defines the virtualized value type list component.
     * @private
     * @class UIVirtualizedValueTypeList
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedValueTypeList
     * @extends UIVirtualizedSearchList
     */
    class UIVirtualizedValueTypeList extends UIVirtualizedSearchList {
        /**
         * @public
         * @constructor
         * @param {IVirtualizedValueTypeListOptions} options - The options for the virtualized list..
         */
        constructor(options) {
            options.className = ['sch-vlist-valuetype'];
            options.visibleItemCount = 7;
            options.itemHeight = 30;
            options.keepNonMatchtingItems = true;
            super(options);
        }
        /**
         * Gets the selected list item.
         * @public
         * @override
         * @returns {IValueTypeVListData} The selected list item.
         */
        getSelectedListItem() {
            return super.getSelectedListItem();
        }
        /**
         * Gets the inner HTML structure of the list item.
         * @protected
         * @override
         * @returns {string} The inner HTML structure of the list item.
         */
        // eslint-disable-next-line class-methods-use-this
        _getItemInnerHTML() {
            return '<div></div>';
        }
        /**
         * Renders the list item.
         * @protected
         * @override
         * @param {HTMLLIElement} listItem - The list item to be rendered.
         * @param {IValueTypeVListData} valueType - The valueType data used to render the list item.
         */
        _renderItem(listItem, valueType) {
            super._renderItem(listItem, valueType);
            const valueTypeNameDiv = listItem.querySelector('div');
            if (valueTypeNameDiv) {
                valueTypeNameDiv.textContent = valueType.name;
                if (valueType.ranges && valueType.ranges.length > 0) {
                    this._highlightFilteredData(valueTypeNameDiv, valueType.ranges);
                }
            }
        }
        /**
         * Updates the list item click event listener.
         * @protected
         * @param {HTMLLIElement} listItem - The list item.
         */
        _updateListItemClickEventListener(listItem) {
            WUXDomUtils.removeEventOnElement(listItem, listItem, 'click', this._onMouseClickEventCB);
            WUXDomUtils.addEventOnElement(listItem, listItem, 'click', this._onMouseClickEventCB);
        }
        /**
         * Gets the formatted valueType data.
         * @protected
         * @override
         * @param {IValueTypeVListData} valueType - The valueType data to format.
         * @returns {string} The formatted valueType data.
         */
        // eslint-disable-next-line class-methods-use-this
        _getFormattedData(valueType) {
            return valueType.name || '';
        }
    }
    return UIVirtualizedValueTypeList;
});
