/**
 * 
 * 
 * @name DS/StudioUIActorModelWeb/CXPGalleryControl
 * @constructor
 * @augments module:DS/Controls/Abstract
 * 
 * @param {Object|Element} [options] - Options used for construction.
 * @param {Array}         [options.items=[]]
 * @param {String}         [options.orientation='vertical']
 * @param {Boolean}        [options.stretchToContent=true]
 * @param {Boolean}        [options.selectionfeedback=true]
 * @param {Number}         [options.itemMinWidth=200]
 * @param {Number}         [options.itemMinHeight=140]
 * @param {Function}       [options.onClick=undefined]
 * @param {Function}       [options.onDoubleClick=undefined]
 * @param {Function}       [options.onEnter=undefined]
 * @param {Function}       [options.onExit=undefined]
 * @param {Function}       [options.onHover=undefined]
 * @param {Function}       [options.onClickOnIndex=undefined]
 * @param {Function}       [options.onDoubleClickOnIndex=undefined]
 * @param {Function}       [options.onEnterOnIndex=undefined]
 * @param {Function}       [options.onExitOnIndex=undefined]
 * @param {Function}       [options.onHoverOnIndex=undefined]
 * 
*/
define('DS/StudioUIActorModelWeb/controls/CXPGalleryControl', 
['UWA/Core', 
'DS/Controls/Abstract', 
'css!DS/StudioUIActorModelWeb/style/CXPGalleryControl.css',
'DS/Utilities/Dom',
'DS/Core/PointerEvents'],

function (UWA, Abstract, CXPGalleryCSS, DomUtils, PointerEvents) {
    'use strict';

    function _updateEventHandler(iEventName, iOldValue, iNewValue) {
        if (iOldValue) {
            this.removeEventListener(iEventName, iOldValue);
        }
        if (iNewValue) {
            this.addEventListener(iEventName, iNewValue);
        }
    }

    var CXPGalleryControl = Abstract.inherit(
        /**
         * @lends DS/StudioUIActorModelWeb/CXPGalleryControl.prototype
         */
        {
        publishedProperties: {
            orientation: {
                defaultValue: 'vertical',
                type: 'string'
            },
            items: {
                defaultValue: []
            },
            stretchToContent: {
                defaultValue: true
            },
            selectionFeedback: {
                defaultValue: true
            },
            itemMinWidth: {
                defaultValue: 200
            },
            itemMinHeight: {
                defaultValue: 140
            },
            onClick: {
                defaultValue: undefined,
                type: 'function'
            },
            onDoubleClick: {
                defaultValue: undefined,
                type: 'function'
            },
            onEnter: {
                defaultValue: undefined,
                type: 'function'
            },
            onExit: {
                defaultValue: undefined,
                type: 'function'
            },
            onHover: {
                defaultValue: undefined,
                type: 'function'
            },

            onClickOnIndex: {
                defaultValue: undefined,
                type: 'function'
            },
            onDoubleClickOnIndex: {
                defaultValue: undefined,
                type: 'function'
            },
            onEnterOnIndex: {
                defaultValue: undefined,
                type: 'function'
            },
            onExitOnIndex: {
                defaultValue: undefined,
                type: 'function'
            },
            onHoverOnIndex: {
                defaultValue: undefined,
                type: 'function'
            }
        },
        
        _preBuildView: function(properties) {
            this.elements.container = UWA.createElement('div', {'class': 'cxp-controls-gallery'});
            this._parent(properties);
        },

        buildView: function() {
            this._parent();
            let div = UWA.createElement('div', {'class': 'cxp-controls-gallery-centeringcontainer'}).inject(this.elements.container);
            this.elements.itemsContainer = UWA.createElement('div', {'class': 'cxp-controls-gallery-itemscontainer'}).inject(div);

            this.elements.itemsContainer.style.setProperty("--minWidth", this.itemMinWidth + 'px');
            this.elements.itemsContainer.style.setProperty("--minHeight", this.itemMinHeight + 'px');

            this._viewItems = [];
            this._selectedItem = null;
            this._preselectedItem = null;
        },

        updateItem: function(iIndex, iItem) {
            if (iIndex >= this._viewItems.length) {
                console.error('item ' + iIndex + ' on gallery does not exist');
                return;
            }
            
            let itemContainer = this._viewItems[iIndex];
            while (itemContainer.firstChild) {
                itemContainer.removeChild(itemContainer.lastChild);
            }
            
            this.items[iIndex] = iItem;
            this._buildItem(this.items[iIndex], iIndex, itemContainer);
        },

        _applyProperties: function (oldValues) {
            this._parent(oldValues);

            if (this.isDirty('items') ) {
                this._applyItems(oldValues.items);
            }

            if (this.isDirty('orientation')) {
                this._applyOrientation(oldValues.orientation);
            }

            if (this.isDirty('stretchToContent')) {
                this._applyStretchToContent(oldValues.stretchToContent);
            }

            if (this.isDirty('itemMinWidth')) {
                this._applyItemMinWidth(oldValues.minWidth);
            }

            if (this.isDirty('itemMinHeight')) {
                this._applyItemMinHeight(oldValues.minHeight);
            }

            if (this.isDirty('onClick')) {
                this._applyOnClick(oldValues.onClick);
            }

            if (this.isDirty('onDoubleClick')) {
                this._applyOnDoubleClick(oldValues.onDoubleClick);
            }

            if (this.isDirty('onEnter')) {
                this._applyOnEnter(oldValues.onEnter);
            }

            if (this.isDirty('onExit')) {
                this._applyOnEnter(oldValues.onExit);
            }

            if (this.isDirty('onHover')) {
                this._applyOnEnter(oldValues.onHover);
            }

        },

        _applyItems: function() {
            this.elements.itemsContainer.empty();
            this._onCleanItems();
            for (let i = 0; i < this.items.length; ++i) {
                let itemContainer = UWA.createElement('div', {'class': 'cxp-controls-gallery-item'}).inject(this.elements.itemsContainer);
                this._buildItem(this.items[i], i, itemContainer);
                this._viewItems[i] = itemContainer;
            }
        },
        
        _applyOrientation: function() {
            if (this.orientation === 'horizontal' || this.orientation === 'vertical') {
                this.elements.container.setAttribute('orientation', this.orientation);
            } else {
                console.error("wrong orientation, expected 'horizontal' or 'vertical', got '" + this.orientation + "'");
            }
        },

        _applyStretchToContent: function() {
            if (this.stretchToContent) {
                this.elements.container.setAttribute("stretch", true);
            } else {
                this.elements.container.setAttribute("stretch", false);
            }
        },

        _applyItemMinWidth: function() {
            this.elements.itemsContainer.style.setProperty("--minWidth", this.itemMinWidth + 'px');
        },

        _applyItemMinHeight: function() {
            this.elements.itemsContainer.style.setProperty("--minHeight", this.itemMinHeight + 'px');
        },

        _applyOnClick: function(iOldValue) {
            _updateEventHandler.call(this, 'galleryclick', iOldValue, this.onClick);
        },

        _applyOnDoubleClick: function(iOldValue) {
            _updateEventHandler.call(this, 'gallerydoubleclick', iOldValue, this.onDoubleClick);
        },

        _applyOnEnter: function(iOldValue) {
            _updateEventHandler.call(this, 'galleryenter', iOldValue, this.onEnter);
        },

        _applyOnExit: function(iOldValue) {
            _updateEventHandler.call(this, 'galleryexit', iOldValue, this.onExit);
        },

        _applyOnHover: function(iOldValue) {
            _updateEventHandler.call(this, 'galleryhover', iOldValue, this.onHover);
        },

        _buildItem: function(iItem, iIndex, iItemContainer) {
            var self = this;
            DomUtils.addEventOnElement(this, iItemContainer, 'click', function () {
                if (self.disabled) return;
                if (self.selectionFeedback) {
                    if (UWA.is(self._selectedItem)) {
                        self._selectedItem.setAttribute("selected", false);
                    }
                    self._selectedItem = iItemContainer;
                    iItemContainer.setAttribute("selected", true);
                }
                self.fire('galleryclick', {index:iIndex});
            });
        
            DomUtils.addEventOnElement(this, iItemContainer, PointerEvents.POINTERHIT, function (e) {
                if (e.multipleHitCount === 2) { // if double click
                    if (self.disabled) {
                        return;
                    }
                    self.fire('gallerydoubleclick', {index:iIndex});
                }
            });     
        
            DomUtils.addEventOnElement(this, iItemContainer, PointerEvents.POINTERMOVE, function () {
                if (self.disabled) return;
                self.fire('galleryhover', {index:iIndex});
            });

            DomUtils.addEventOnElement(this, iItemContainer, 'pointerenter', function () {
                if (self.disabled) return;
                if (self.selectionFeedback) {
                    if (UWA.is(self._preselectedItem)) {
                        self._preselectedItem.setAttribute("preselected", false);
                    }
                    self._preselectedItem = iItemContainer;
                    iItemContainer.setAttribute("preselected", true);
                }
                self.fire('galleryenter', {index:iIndex});
            });

            DomUtils.addEventOnElement(this, iItemContainer, 'pointerleave', function () {
                if (self.disabled) return;
                if (self.selectionFeedback) {
                    if (self._preselectedItem ===  iItemContainer) {
                        self._preselectedItem.setAttribute("preselected", false);
                        self._preselectedItem = null;
                    }
                }
                self.fire('galleryexit', {index:iIndex});
            });
        },

        _onCleanItems: function() {
            this._viewItems = [];
        }
    });

    CXPGalleryControl.CreateLabeledItem = function(iContainer, iLabel) {
        let contentContainer = UWA.createElement('div').inject(iContainer);
        contentContainer.position = 'relative'; // some items like camera viewer do position:absolute so we need to set the relative positio here to match the size
        contentContainer.style.flex = '1 1 0%';
        contentContainer.style.minWidth =  'var(--minWidth)';
        contentContainer.style.minHeight = 'var(--minHeight)';
        contentContainer.style.height = '1px'; // to make height: 100% work for children, see https://stackoverflow.com/questions/58548583/why-does-height-100-on-a-child-element-not-apply-when-the-parent-element-has-a

        let labelContainer = UWA.createElement('div').inject(iContainer);
        labelContainer.style.paddingTop = '2px';
        labelContainer.style.textAlign = 'center';
        labelContainer.style.flex = '0 0 auto';

        let label = UWA.createElement('span', {text:iLabel}).inject(labelContainer);
        label.style.fontWeight = 'bold';
        label.style.fontSize = '11px';
        return contentContainer;
    };

    return CXPGalleryControl;
});

