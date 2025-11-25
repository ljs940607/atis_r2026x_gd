/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedBlockList'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedBlockList", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedSearchList", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIVirtualizedBlockList"], function (require, exports, UIVirtualizedSearchList, UIFontIcon) {
    "use strict";
    /**
     * This class defines the virtualized search block list component.
     * @private
     * @class UIVirtualizedBlockList
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedBlockList
     * @extends UIVirtualizedSearchList
     */
    class UIVirtualizedBlockList extends UIVirtualizedSearchList {
        /**
         * @public
         * @constructor
         * @param {IVirtualizedBlockListOptions} options - The options for the virtualized list..
         */
        constructor(options) {
            options.className = ['sch-vlist-block'];
            options.keepNonMatchtingItems = false;
            options.listWidth = 500;
            super(options);
        }
        /**
         * Gets the inner HTML structure of the list item.
         * @protected
         * @override
         * @returns {string} The inner HTML structure of the list item.
         */
        // eslint-disable-next-line class-methods-use-this
        _getItemInnerHTML() {
            return `
            <span></span>
            <div>
                <div class="block-name"></div>
                <div class="block-category"></div>
            </div>
        `;
        }
        /**
         * Renders the list item.
         * @protected
         * @override
         * @param {HTMLLIElement} listItem - The list item to be rendered.
         * @param {IBlockVListData} block - The block data used to render the list item.
         */
        _renderItem(listItem, block) {
            super._renderItem(listItem, block);
            const iconSpan = listItem.querySelector('span');
            const blockNameLI = listItem.querySelector('.block-name');
            const blockCategoryLI = listItem.querySelector('.block-category');
            if (iconSpan && blockNameLI && blockCategoryLI) {
                iconSpan.className = UIFontIcon.getFontIconClassName(block.icon.fontIconFamily, block.icon.iconName);
                blockNameLI.textContent = block.name;
                blockCategoryLI.textContent = block.categoryName + '/' + block.name;
                if (block.ranges?.length > 0) {
                    const formattedData = this._getFormattedData(block);
                    const fileNameIndex = formattedData.lastIndexOf('/');
                    if (block.ranges[0].offset > fileNameIndex) {
                        const blockNameRanges = block.ranges.map(range => ({ offset: range.offset - (fileNameIndex + 1), length: 1 }));
                        this._highlightFilteredData(blockNameLI, blockNameRanges);
                    }
                    else {
                        this._highlightFilteredData(blockCategoryLI, block.ranges);
                    }
                }
            }
        }
        /**
         * Gets the formatted block data.
         * @protected
         * @override
         * @param {IBlockVListData} block - The block data to format.
         * @returns {string} The formatted block data.
         */
        // eslint-disable-next-line class-methods-use-this
        _getFormattedData(block) {
            return block.categoryName + '/' + block.name;
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
         * Gets the list data model for ODT.
         * @private
         * @ignore
         * @returns {IBlockVListData[]} The list data model.
         */
        _getDataModelForODT() {
            return super._getDataModelForODT();
        }
    }
    return UIVirtualizedBlockList;
});
