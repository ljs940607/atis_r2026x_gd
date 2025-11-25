/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUISmartSearch'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUISmartSearch", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "DS/EPSSchematicsUI/components/EPSSchematicsUIVirtualizedBlockList", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUISmartSearch"], function (require, exports, UIDom, UIKeyboard, UIVirtualizedBlockList, UINLS) {
    "use strict";
    // TODO: Look at the following links to test if we could have better performance for
    // quicksearch algorithms:
    // http://bripkens.github.io/fuzzy.js/demo/
    // https://fwextensions.github.io/quick-score-demo/#demo
    // https://github.com/fwextensions/quick-score/blob/main/src/quick-score.js
    // TODO: Implement Control link drag into void and display smart search!!!!
    /**
     * This class defines a UI smart search.
     * @private
     * @class UISmartSearch
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUISmartSearch
     */
    class UISmartSearch {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph on which the building block must be added.
         * @param {number} left - The left position of the smart combobox.
         * @param {number} top - The top position of the smart combobox.
         * @param {number} blockLeft - The left position of the block.
         * @param {number} blockTop - The top position of the block.
         */
        constructor(graph, left, top, blockLeft, blockTop) {
            this._isRemoved = false;
            this._readyState = true;
            this._graph = graph;
            this._left = left;
            this._top = top;
            this._blockLeft = blockLeft;
            this._blockTop = blockTop;
            this._viewerContent = this._graph.getViewer().getContainer();
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
         * Removes the component.
         * @public
         */
        // eslint-disable-next-line class-methods-use-this
        remove() {
            if (this._isRemoved === false) {
                this._isRemoved = true;
                clearTimeout(this._timeoutId);
                if (this?._container?.parentElement) {
                    this._container.parentElement.removeChild(this._container);
                }
            }
            this._graph = undefined;
            this._left = undefined;
            this._top = undefined;
            this._blockLeft = undefined;
            this._blockTop = undefined;
            this._viewerContent = undefined;
            this._container = undefined;
            this._inputContainer = undefined;
            this._searchInput = undefined;
            this._searchCount = undefined;
            this._searchList = undefined;
            this._timeoutId = undefined;
            this._isRemoved = undefined;
        }
        /**
         * Gets the smart search container.
         * @public
         * @returns {HTMLDivElement} The smart search container.
         */
        getContainer() {
            return this._container;
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
         * Initializes the component.
         * @private
         */
        _initialize() {
            const model = this._graph.getEditor()._getBlockLibraryController().getFullBlockListModel();
            // Creates the interface
            this._container = UIDom.createElement('div', { className: 'sch-components-smartsearch' });
            this._inputContainer = UIDom.createElement('div', { className: 'sch-components-smartsearch-input-container', parent: this._container });
            this._searchInput = UIDom.createElement('input', {
                className: 'sch-components-smartsearch-input', parent: this._inputContainer, attributes: {
                    type: 'text', spellcheck: false, placeholder: UINLS.get('smartSearchPlaceHolder'), tabindex: 0
                }
            });
            this._searchInput.ondblclick = e => e.stopPropagation();
            this._searchInput.oninput = this._onInput.bind(this);
            this._searchInput.onkeydown = this._onKeydown.bind(this);
            this._searchInput.onblur = () => {
                if (this._graph) {
                    this._graph.removeSmartSearch();
                }
            };
            this._searchCount = UIDom.createElement('span', { className: 'sch-components-smartsearch-count', parent: this._inputContainer });
            this._updateSearchCountTextContent(model.length);
            this._searchList = new UIVirtualizedBlockList({
                parent: this._container,
                data: model,
                onPick: data => {
                    this._searchList.remove();
                    if (data.uid) {
                        const blockUI = this._graph.createBlock(data.uid, this._blockLeft, this._blockTop);
                        blockUI?.automaticExpandDataPorts();
                        if (this._graph) {
                            this._graph.removeSmartSearch();
                        }
                    }
                }
            });
            this._container.setAttribute('style', 'left:' + this._left + 'px; top:' + this._top + 'px;');
            this._viewerContent.appendChild(this._container);
            this._setPositionAccordingToViewerBCR();
            this._searchInput.focus();
        }
        /**
         * Sets the smart search correct position according to the parent
         * viewer bounding client rect.
         * @private
         */
        _setPositionAccordingToViewerBCR() {
            const parentBCR = this._graph.getViewer().getContainer().getBoundingClientRect();
            const smartSearchBCR = this._container.getBoundingClientRect();
            let left = this._left;
            const isOutOfScreenLeft = this._left < parentBCR.left;
            left = isOutOfScreenLeft ? parentBCR.left : left;
            const isOutOfScreenRight = this._left + smartSearchBCR.width > parentBCR.left + parentBCR.width;
            left = isOutOfScreenRight ? (parentBCR.left + parentBCR.width) - (parentBCR.left + smartSearchBCR.width) : left;
            let top = this._top;
            const isOutOfScreenTop = this._top < parentBCR.top;
            top = isOutOfScreenTop ? parentBCR.top : top;
            const isOutOfScreenBottom = this._top + smartSearchBCR.height > parentBCR.top + parentBCR.height;
            top = isOutOfScreenBottom ? (parentBCR.top + parentBCR.height) - (parentBCR.top + smartSearchBCR.height) : top;
            this._container.setAttribute('style', 'left:' + left + 'px; top:' + top + 'px;');
        }
        /**
         * The callback on the input event.
         * @private
         */
        _onInput() {
            this._readyState = false;
            clearTimeout(this._timeoutId);
            this._timeoutId = setTimeout(() => {
                const blockCount = this._searchList.filterData(this._searchInput.value);
                this._updateSearchCountTextContent(blockCount);
                this._readyState = true;
            }, 100);
        }
        /**
         * Updates the search count text content.
         * @private
         * @param {number} count - The search count.
         */
        _updateSearchCountTextContent(count) {
            const hasManyBlocks = count > 1;
            const txtCount = count + ' ' + UINLS.get('categoryBlock') + (hasManyBlocks ? 's' : '');
            this._searchCount.textContent = txtCount;
        }
        /**
         * The callback on the keydown event.
         * @private
         * @param {KeyboardEvent} event - The keydown event.
         */
        _onKeydown(event) {
            if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnter)) {
                this._searchList.pickSelectedListItem();
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEscape)) {
                if (this._graph) {
                    this._graph.removeSmartSearch();
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageUp)) {
                this._searchList.selectPreviousPageListItem();
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageDown)) {
                this._searchList.selectNextPageListItem();
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnd)) {
                this._searchList.selectLastListItem();
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eHome)) {
                this._searchList.selectFirstListItem();
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowUp)) {
                this._searchList.selectPreviousListItem();
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowDown)) {
                this._searchList.selectNextListItem();
            }
            event.stopPropagation();
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
         * Gets the search input element for ODT.
         * @private
         * @ignore
         * @returns {HTMLInputElement} The search input element.
         */
        _getSearchInputForODT() {
            return this._searchInput;
        }
        /**
         * Gets the virtualized search block list component for ODT.
         * @private
         * @ignore
         * @returns {UIVirtualizedBlockList} The virtualized search block list component.
         */
        _getSearchListForODT() {
            return this._searchList;
        }
        /**
         * Gets the search input ready state for ODT.
         * @private
         * @ignore
         * @returns {boolean} Whether the search input is ready.
         */
        _getReadyStateForODT() {
            return this._readyState;
        }
    }
    return UISmartSearch;
});
