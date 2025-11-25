/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedSearchList'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedSearchList", ["require", "exports", "DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedList", "DS/EPSEditorCore/QuickSearchScorer", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIVirtualizedSearchList"], function (require, exports, UIVirtualizedList, Scorer, UIDom) {
    "use strict";
    /**
     * This class defines the virtualized search list component.
     * @private
     * @abstract
     * @class UIVirtualizedSearchList
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedSearchList
     * @extends UIVirtualizedList
     */
    class UIVirtualizedSearchList extends UIVirtualizedList {
        /**
         * @public
         * @constructor
         * @param {IVirtualizedSearchListOptions<IVSearchListData>} options - The options for the virtualized search list.
         */
        constructor(options) {
            if (options.className) {
                options.className.push('sch-vlist-search');
            }
            super(options);
            this._isFiltering = false;
            this._keepNonMatchtingItems = options.keepNonMatchtingItems ?? false;
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
         * Filters the data.
         * @public
         * @param {string} filter - The filter to apply to the data.
         * @returns {number} The filtered data count.
         */
        filterData(filter) {
            this._data = this._originalData;
            this._isFiltering = filter !== undefined && filter !== '';
            if (this._isFiltering) {
                const filterRegExp = Scorer.filterRegex(filter);
                this._data = this._data.filter(data => {
                    let result = false;
                    const formattedData = this._getFormattedData(data);
                    if (filter === undefined || formattedData.match(filterRegExp)) {
                        if (filter !== undefined) {
                            const indexes = [];
                            const ranges = [];
                            data.score = new Scorer(filter).score(formattedData, indexes);
                            indexes.forEach(index => ranges.push({ offset: index, length: 1 }));
                            data.ranges = ranges;
                        }
                        result = true;
                    }
                    else if (this._keepNonMatchtingItems) {
                        data.score = 0;
                        data.nonMatching = true;
                        result = true;
                    }
                    return result;
                });
                this._data.sort((a, b) => b.score - a.score);
            }
            this._updatePlaceholderHeight();
            this._render();
            this.selectFirstListItem();
            return this._data.length;
        }
        /**
         * Initializes the virtualized list.
         * @protected
         * @override
         */
        _initialize() {
            this._originalData = this._data;
            super._initialize();
        }
        /**
         * Renders the list item.
         * @protected
         * @override
         * @param {HTMLLIElement} listItem - The list item to be rendered.
         * @param {IVSearchListData} data - The data used to render the list item.
         */
        _renderItem(listItem, data) {
            // If we are not filtering we reset so previous ranges and score do not apply!
            if (!this._isFiltering) {
                data.ranges = [];
                data.score = 0;
            }
            if (data.nonMatching) {
                UIDom.addClassName(listItem, 'nonmatching');
            }
            else {
                UIDom.removeClassName(listItem, 'nonmatching');
            }
        }
        /**
         * Highlights the filtered data.
         * @protected
         * @param {HTMLElement} element - The element to highlight.
         * @param {IVSearchRanges[]} ranges - The ranges to highlight in the element.
         */
        // eslint-disable-next-line class-methods-use-this
        _highlightFilteredData(element, ranges) {
            Scorer.highlightRangesWithStyleClass(element, ranges, 'highlighted');
        }
    }
    return UIVirtualizedSearchList;
});
