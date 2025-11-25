/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUIBreadcrumb'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUIBreadcrumb", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUIBreadcrumb"], function (require, exports, UIDom, UIFontIcon, EventServices, ExecutionEvents) {
    "use strict";
    /**
     * This class defines a UI breadcrumb.
     * @private
     * @class UIBreadcrumb
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUIBreadcrumb
     */
    class UIBreadcrumb {
        /**
         * @public
         * @constructor
         * @param {UIViewerController} viewerController - The viewer controller.
         * @param {HTMLElement} container - The breadcrumb container.
         */
        constructor(viewerController, container) {
            this._items = [];
            this._onItemClickCB = this._onItemClick.bind(this);
            this._onTraceStartEventCB = this._onTraceStartEvent.bind(this);
            this._onTraceStopEventCB = this._onTraceStopEvent.bind(this);
            this._viewerController = viewerController;
            this._container = container;
            EventServices.addListener(ExecutionEvents.TraceStartEvent, this._onTraceStartEventCB);
            EventServices.addListener(ExecutionEvents.TraceStopEvent, this._onTraceStopEventCB);
            this._component = UIDom.createElement('div', {
                className: 'sch-breadcrumb-toolbar',
                parent: this._container
            });
            this._itemList = UIDom.createElement('ul', {
                className: 'sch-breadcrumb-list',
                parent: this._component
            });
            this._rootItem = UIDom.createElement('li', {
                className: 'sch-breadcrumb-root',
                parent: this._itemList,
                children: [
                    UIFontIcon.createFAFontIcon('lock', {
                        className: 'sch-breadcrumb-item-lock',
                        tooltipInfos: { shortHelp: 'Graph is read-only!' }
                    }),
                    UIFontIcon.createFAFontIcon('home')
                ]
            });
            this._rootItem.addEventListener('click', this._onItemClickCB);
            /*this._expander = UIDom.createElement('li', {
                className: 'sch-breadcrumb-expander',
                parent: this._itemList,
                children: [UIFontIcon.createFontIconFromDefinition({ name: 'ellipsis-h', fontFamily: 'eFontAwesome' })]
            });*/
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
         * Removes the breadcrumb.
         * @public
         */
        remove() {
            EventServices.removeListener(ExecutionEvents.TraceStartEvent, this._onTraceStartEventCB);
            EventServices.removeListener(ExecutionEvents.TraceStopEvent, this._onTraceStopEventCB);
            if (this._rootItem !== undefined) {
                this._rootItem.removeEventListener('click', this._onItemClickCB);
                this._itemList?.removeChild(this._rootItem);
            }
            if (this._container !== undefined) {
                this._container.removeChild(this._component);
            }
            this._viewerController = undefined;
            this._container = undefined;
            this._component = undefined;
            this._itemList = undefined;
            this._rootItem = undefined;
            this._items = undefined;
            this._onItemClickCB = undefined;
            this._onTraceStartEventCB = undefined;
            this._onTraceStopEventCB = undefined;
        }
        /**
         * Adds an item to the item list.
         * @public
         * @param {string} title - The title of the item to add.
         * @param {boolean} isReadOnly - Whether the item is read-only.
         */
        addListItem(title, isReadOnly) {
            const item = UIDom.createElement('li', {
                className: 'sch-breadcrumb-item',
                parent: this._itemList,
                children: [
                    UIFontIcon.createFAFontIcon('lock', {
                        className: ['sch-breadcrumb-item-lock', isReadOnly ? 'visible' : ''],
                        tooltipInfos: { shortHelp: 'Graph is read-only!' }
                    }),
                    UIDom.createElement('span', { textContent: title })
                ]
            });
            item.addEventListener('click', this._onItemClickCB);
            this._items.push(item);
            this._showBreadcrumb();
        }
        /**
         * Changes the name of the item at the given index.
         * @private
         * @param {number} index - The index of the item.
         * @param {string} name - The new name of the item.
         */
        changeItemName(index, name) {
            const item = this._items[index];
            if (item && item.lastChild) {
                item.lastChild.textContent = name;
            }
        }
        /**
         * Removes the last item from the list.
         * @private
         */
        removeLastItem() {
            const item = this._items.pop();
            if (item !== undefined) {
                item.removeEventListener('click', this._onItemClickCB);
                this._itemList.removeChild(item);
            }
            this._hideBreadcrumb();
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
         * The callback on the list item click event.
         * @private
         * @param {MouseEvent} event - The mouse event.
         */
        _onItemClick(event) {
            const historyController = this._viewerController.getRootViewer().getEditor().getHistoryController();
            if (event.target === this._rootItem) {
                this._viewerController.removeAllViewers();
                historyController.registerViewerChangeAction();
            }
            else {
                const index = this._items.indexOf(event.target);
                if (index !== -1) {
                    this._viewerController.removeViewersUpToIndex(index + 1);
                    historyController.registerViewerChangeAction();
                }
            }
        }
        /**
         * Shows the breadcrumb.
         * @private
         */
        _showBreadcrumb() {
            UIDom.addClassName(this._component, 'visible');
        }
        /**
         * Hides the breadcrumb.
         * @private
         * @param {boolean} [force=false] True to force the breadcrumb to be hidden, false otherwise.
         */
        _hideBreadcrumb(force = false) {
            if (this._items.length === 0) {
                const isPlaying = this._viewerController.getRootViewer().getEditor().getTraceController().getPlayingState();
                if (!isPlaying || force) {
                    UIDom.removeClassName(this._component, 'visible');
                }
            }
        }
        /**
         * The callback on the trace start event.
         * @private
         */
        _onTraceStartEvent() {
            this._showBreadcrumb();
            UIDom.addClassName(this._rootItem.firstChild, 'visible'); // Display lock on Home item!
            this._items.forEach(item => {
                UIDom.addClassName(item.firstChild, 'visible'); // Display lock on each item!
            });
        }
        /**
         * The callback on the trace stop event.
         * @private
         */
        _onTraceStopEvent() {
            // TODO: When implementing specific readOnly graph block, it will be necessary to parse each viewer
            // from the viewer controller to check whether its block is readOnly or not!
            UIDom.removeClassName(this._rootItem.firstChild, 'visible'); // Hide lock on Home item!
            this._items.forEach(item => {
                UIDom.removeClassName(item.firstChild, 'visible'); // Hide lock on each item!
            });
            this._hideBreadcrumb(true);
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
         * Gets the root item.
         * @private
         * @ignore
         * @returns {HTMLLIElement} The root item.
         */
        _getRootItem() {
            return this._rootItem;
        }
        /**
         * Gets the list of items.
         * @private
         * @ignore
         * @returns {HTMLLIElement[]} The list of items.
         */
        _getItems() {
            return this._items;
        }
    }
    return UIBreadcrumb;
});
