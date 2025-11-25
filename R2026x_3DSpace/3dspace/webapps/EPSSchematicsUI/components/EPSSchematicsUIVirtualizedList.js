/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedList'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedList", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIVirtualizedList"], function (require, exports, UIDom) {
    "use strict";
    /**
     * This class defines the virtualized list component.
     * Inspiration from https://tghosh.hashnode.dev/rendering-large-lists-in-vanilla-js-list-virtualization
     * @private
     * @abstract
     * @class UIVirtualizedList
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedList
     */
    class UIVirtualizedList {
        /**
         * @public
         * @constructor
         * @param {IVirtualizedListOptions} options - The options for the virtualized list.
         */
        constructor(options) {
            this._poolNode = [];
            this._selectedGlobalIndex = 0;
            this._preselectedLocalIndex = 0;
            this._onScrollEventCB = this._onScrollEvent.bind(this);
            this._onMouseenterEventCB = this._onMouseenterEvent.bind(this);
            this._onMouseleaveEventCB = this._onMouseleaveEvent.bind(this);
            this._onMousemoveEventCB = this._onMousemoveEvent.bind(this);
            this._onMouseClickEventCB = this._onMouseClickEvent.bind(this);
            this._mouseFrozen = false;
            this._options = options;
            this._visibleItemCount = this._options.visibleItemCount ?? 5;
            this._itemHeight = this._options.itemHeight ?? 40;
            this._listHeight = this._visibleItemCount * this._itemHeight;
            this._maxVisibleItems = this._listHeight / this._itemHeight;
            this._poolSize = this._maxVisibleItems * 2;
            this._listWidth = this._options.listWidth;
            this._parent = options.parent;
            this._data = options.data;
            this._initialize();
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
         * Removes the virtualized list.
         * @public
         */
        remove() {
            if (this._container) {
                this._container.removeEventListener('scroll', this._onScrollEventCB);
            }
        }
        /**
         * Selects the next item in the list.
         * @public
         */
        selectNextListItem() {
            const index = this._selectedGlobalIndex + 1 < this._data.length ? this._selectedGlobalIndex + 1 : 0;
            this._selectListItem(index);
        }
        /**
         * Selects the previous item in the list.
         * @public
         */
        selectPreviousListItem() {
            const index = this._selectedGlobalIndex - 1 >= 0 ? this._selectedGlobalIndex - 1 : this._data.length - 1;
            this._selectListItem(index);
        }
        /**
         * Selects the first item in the list.
         * @public
         */
        selectFirstListItem() {
            this._selectListItem(0);
        }
        /**
         * Selects the last item in the list.
         * @public
         */
        selectLastListItem() {
            this._selectListItem(this._data.length - 1);
        }
        /**
         * Selects the next page item in the list.
         * @public
         */
        selectNextPageListItem() {
            const offsetIndex = Math.floor(this._container.clientHeight / this._itemHeight) - 1 || 1;
            let index = this._selectedGlobalIndex + offsetIndex;
            index = index > (this._data.length - 1) ? this._data.length - 1 : index;
            this._selectListItem(index);
        }
        /**
         * Selects the previous page item in the list.
         * @public
         */
        selectPreviousPageListItem() {
            const offsetIndex = Math.floor(this._container.clientHeight / this._itemHeight) - 1 || 1;
            let index = this._selectedGlobalIndex - offsetIndex;
            index = index < 0 ? 0 : index;
            this._selectListItem(index);
        }
        /**
         * Picks the selected list item.
         * @public
         * @returns {IVListData} The selected list item.
         */
        pickSelectedListItem() {
            const pickedData = this.getSelectedListItem();
            if (pickedData) {
                this._options.onPick(pickedData);
            }
            return pickedData;
        }
        /**
         * Gets the selected list item.
         * @public
         * @returns {IVListData} The selected list item.
         */
        getSelectedListItem() {
            return this._data[this._selectedGlobalIndex];
        }
        /**
         * Checks whether the provided element is a child of this list.
         * @public
         * @param {HTMLElement} element - The HTML element to check.
         * @returns {boolean} Whether the element is a child of this list.
         */
        isChildOfList(element) {
            let result = false;
            let parentElt = element;
            while (!result && parentElt) {
                if (parentElt === this._container) {
                    result = true;
                }
                parentElt = parentElt.parentElement || undefined;
            }
            return result;
        }
        /**
         * Initializes the virtualized list.
         * @protected
         */
        _initialize() {
            this._container = document.createElement('div');
            this._container.classList.add('sch-vlist-container');
            this._container.style.maxHeight = `${this._listHeight}px`;
            if (this._listWidth !== undefined) {
                this._container.style.width = `${this._listWidth}px`;
            }
            this._container.onmousedown = e => e.preventDefault(); // Prevent input focus lost!
            if (this._options.className) {
                UIDom.addClassName(this._container, this._options.className);
            }
            this._list = document.createElement('ul');
            this._list.classList.add('sch-vlist');
            this._list.onmousedown = e => e.preventDefault(); // Prevent input focus lost!
            this._container.appendChild(this._list);
            this._parent.appendChild(this._container);
            this._createPoolNode();
            this._createPlaceholder();
            this._container.addEventListener('scroll', this._onScrollEventCB);
            this._selectedGlobalIndex = 0;
            this._render();
        }
        /**
         * Renders the data into the pool node according to the scroll position.
         * @protected
         */
        _render() {
            const scrollTop = this._container.scrollTop;
            const startIndex = Math.floor(scrollTop / this._itemHeight);
            const endIndex = startIndex + this._poolSize;
            const visibleData = this._data.slice(startIndex, Math.min(endIndex, this._data.length));
            for (let localIndex = 0; localIndex < this._poolNode.length; localIndex++) {
                const listItem = this._poolNode[localIndex];
                UIDom.removeClassName(listItem, ['selected', 'preselected', 'invisible']);
                if (localIndex < visibleData.length) {
                    const globalIndex = startIndex + localIndex;
                    this._renderItem(listItem, visibleData[localIndex]);
                    listItem.style.top = `${(startIndex + localIndex) * this._itemHeight}px`;
                    listItem.style.height = `${this._itemHeight}px`;
                    //listItem.style.display = '';
                    listItem.dataset.localIndex = String(localIndex);
                    listItem.dataset.globalIndex = String(globalIndex);
                    this._updateListItemClickEventListener(listItem);
                    listItem.onmouseenter = this._onMouseenterEventCB;
                    listItem.onmouseleave = this._onMouseleaveEventCB;
                    listItem.onmousemove = this._onMousemoveEventCB;
                    listItem.onmousedown = e => e.preventDefault(); // Prevent input focus lost!
                    if (globalIndex === this._selectedGlobalIndex) {
                        UIDom.addClassName(listItem, 'selected');
                    }
                }
                else {
                    UIDom.addClassName(listItem, 'invisible');
                    listItem.dataset.localIndex = '';
                    listItem.dataset.globalIndex = '';
                }
            }
            this._updateListHeightToFixScrollIssue(visibleData.length);
        }
        /**
         * Updates the list item click event listener.
         * @protected
         * @param {HTMLLIElement} listItem - The list item.
         */
        _updateListItemClickEventListener(listItem) {
            listItem.onclick = this._onMouseClickEventCB;
        }
        /**
         * Updates the placeholder height.
         * @protected
         */
        _updatePlaceholderHeight() {
            const height = this._data.length * this._itemHeight;
            this._placeholder.style.height = `${height}px`;
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
         * Creates the pool of node.
         * @private
         */
        _createPoolNode() {
            for (let i = 0; i < this._poolSize; i++) {
                const listItem = document.createElement('li');
                listItem.classList.add('sch-vlist-item');
                listItem.innerHTML = this._getItemInnerHTML();
                listItem.style.top = `${i * this._itemHeight}px`;
                UIDom.addClassName(listItem, 'invisible');
                this._list.appendChild(listItem);
                this._poolNode.push(listItem);
            }
        }
        /**
         * Creates the placeholder node.
         * @private
         */
        _createPlaceholder() {
            this._placeholder = document.createElement('li');
            this._placeholder.classList.add('sch-vlist-placeholder');
            this._updatePlaceholderHeight();
            this._list.appendChild(this._placeholder);
        }
        /**
         * The callback on the scroll event.
         * @private
         */
        _onScrollEvent() {
            this._render();
        }
        /**
         * The callback on the list item mouse enter event.
         * @private
         * @param {MouseEvent} event - The mouse enter event.
         */
        _onMouseenterEvent(event) {
            const element = event.target;
            if (element) {
                const localIndex = Number(element.dataset.localIndex);
                this._preselectListItem(localIndex);
            }
        }
        /**
         * The callback on the list item mouse leave event.
         * @private
         * @param {MouseEvent} event - The mouse leave event.
         */
        _onMouseleaveEvent(event) {
            const element = event.target;
            if (element) {
                const localIndex = Number(element.dataset.localIndex);
                this._unpreselectListItem(localIndex);
            }
        }
        /**
         * The callback on the list item mouse move event.
         * @private
         * @param {MouseEvent} event - The mouse move event.
         */
        _onMousemoveEvent(event) {
            this._mouseFrozen = false;
            const element = event.target;
            if (element) {
                const localIndex = Number(element.dataset.localIndex);
                this._preselectListItem(localIndex);
            }
        }
        /**
         * The callback on the list item mouse click event.
         * @private
         * @param {MouseEvent} event - The mouse click event.
         */
        _onMouseClickEvent(event) {
            const element = event.target;
            if (element) {
                const globalIndex = Number(element.dataset.globalIndex);
                this._selectListItem(globalIndex);
                this.pickSelectedListItem();
            }
        }
        /**
         * Preselects the list item at given local index.
         * @private
         * @param {number} index - The local index of the item in the list.
         */
        _preselectListItem(index) {
            if (!this._mouseFrozen && typeof index === 'number' && index > -1) {
                const listItem = this._poolNode[index];
                UIDom.addClassName(listItem, 'preselected');
                this._preselectedLocalIndex = index;
            }
        }
        /**
         * Unpreselects the list item at given local index.
         * @private
         * @param {number} index - The local index of the item in the list.
         */
        _unpreselectListItem(index) {
            if (typeof index === 'number' && index > -1) {
                const listItem = this._poolNode[index];
                UIDom.removeClassName(listItem, 'preselected');
            }
        }
        /**
         * Selects the list item at given global index.
         * @private
         * @param {number} index - The global index of the item in the list.
         */
        _selectListItem(index) {
            if (index >= 0 && index <= this._data.length - 1) {
                this._mouseFrozen = true;
                this._unpreselectListItem(this._preselectedLocalIndex);
                this._unselectListElement(this._selectedGlobalIndex);
                const listItem = this._getListItemByGlobalIndex(index);
                const isVisible = this._isListItemVisible(listItem);
                if (listItem && isVisible) {
                    this._selectedGlobalIndex = index;
                    UIDom.addClassName(listItem, 'selected');
                }
                else {
                    this._scrollToGlobalIndex(index);
                }
            }
        }
        /**
         * Unselects the list item at given global index.
         * @private
         * @param {number} index - The global index of the item in the list.
         */
        _unselectListElement(index) {
            if (index >= 0 && index <= this._data.length - 1) {
                const listItem = this._getListItemByGlobalIndex(index);
                if (listItem) {
                    UIDom.removeClassName(listItem, 'selected');
                }
            }
        }
        /**
         * Scrolls the list to the given global index.
         * @private
         * @param {number} index - The global index.
         */
        _scrollToGlobalIndex(index) {
            if (index >= 0 && index <= this._data.length - 1) {
                if (index > this._selectedGlobalIndex) {
                    this._selectedGlobalIndex = index;
                    const scrollTop = (this._itemHeight * index) - (this._container.clientHeight - this._itemHeight) + 1;
                    this._container.scrollTop = scrollTop; // Triggers a the render function
                }
                else {
                    this._selectedGlobalIndex = index;
                    const scrollTop = this._itemHeight * index;
                    this._container.scrollTop = scrollTop; // Triggers a the render function
                }
            }
        }
        /**
         * Checks the list item is visible.
         * @private
         * @param {HTMLLIElement|undefined} listItem - The list item.
         * @returns {boolean} Whether the list item is visible.
         */
        _isListItemVisible(listItem) {
            let result = false;
            if (listItem) {
                const containerBCR = this._container.getBoundingClientRect();
                const listItemBCR = listItem.getBoundingClientRect();
                const isListItemTopVisible = listItemBCR.top >= containerBCR.top;
                const isListItemBottomVisible = listItemBCR.bottom <= containerBCR.bottom;
                result = isListItemTopVisible && isListItemBottomVisible;
            }
            return result;
        }
        /**
         * Gets the list item corresponding to the given global index.
         * @private
         * @param {number} index - The global index of the list item.
         * @returns {HTMLLIElement|undefined} The corresponding list item.
         */
        _getListItemByGlobalIndex(index) {
            return this._poolNode.find(elt => elt.dataset.globalIndex === String(index));
        }
        /**
         * Updates the list height to fix the manual scroll issue.
         * An issue occurs when we click and drag the scroll bar:
         * If no height is defines on the list, the scroll bar occasionally
         * stop scrolling while the user still have the mouse button pressed!
         * No height is needed if block count is less than list height.
         * @private
         * @param {number} visibleDataCount - The number of visible data.
         */
        _updateListHeightToFixScrollIssue(visibleDataCount) {
            const isSrollbarDisplayed = visibleDataCount >= this._maxVisibleItems;
            this._list.style.height = isSrollbarDisplayed ? `${this._listHeight}px` : '';
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
         * @returns {IVListData[]} The list data model.
         */
        _getDataModelForODT() {
            return this._data;
        }
        /**
         * Selects the list item at given global index for ODT.
         * @private
         * @ignore
         * @param {number} index - The global index of the item in the list.
         */
        _selectListItemForODT(index) {
            this._selectListItem(index);
        }
        /**
         * Gets the selected global index for ODT.
         * @private
         * @ignore
         * @returns {number} The global index of the item in the list.
         */
        _getSelectedGlobalIndexForODT() {
            return this._selectedGlobalIndex;
        }
        /**
         * Gets the container HTML element for ODT.
         * @private
         * @ignore
         * @returns {HTMLElement} The container HTML element.
         */
        _getContainerForODT() {
            return this._container;
        }
    }
    return UIVirtualizedList;
});
