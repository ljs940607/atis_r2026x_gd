/**
 * 
 * 
 * @name DS/StudioUIActorModelWeb/CXPGalleryProductControl
 * @constructor
 * @augments module:DS/Controls/CXPGalleryControl
 * 
*/
define('DS/StudioUIActorModelWeb/controls/CXPGalleryProductControl', 
['UWA/Core', 
'DS/StudioUIActorModelWeb/controls/CXPGalleryControl',
'DS/StudioUIActorModelWeb/controls/CXPProductViewerControl'],

function (UWA, CXPGalleryControl, CXPProductViewerControl) {
    'use strict';

    var CXPGalleryProductControl = CXPGalleryControl.inherit(
        /**
          * @lends DS/StudioUIActorModelWeb/CXPGalleryControl.prototype
          */
          {
              
            buildView: function() {
                this._parent();

                this.contentContainers = [];
                this.viewers = [];
            },


            _buildItem: function(iItem, iIndex, iItemContainer) {
                this._parent(iItem, iIndex, iItemContainer);
                let contentContainer = CXPGalleryControl.CreateLabeledItem(iItemContainer, iItem.label);

                if (iItem.image) {
                    contentContainer.style.background = 'url(' + iItem.image + ')';
                    contentContainer.style.backgroundSize = '100% 100%';
                } else {
                    let productviewer = new CXPProductViewerControl().inject(contentContainer);
                    productviewer.product = iItem.product;
                    productviewer.elements.container.style.width = '100%';
                    productviewer.elements.container.style.height = '100%';

                    this.viewers.push(productviewer);
                }

                this.contentContainers.push(contentContainer);
            },

            _applyItems: function() {
                this._parent();
                // product image size should be computed with all items, otherwise first item can take space of other items in _UpdateProductViewer
                for (let productViewer of this.viewers) {
                    productViewer.refreshProductViewer();
                }
            },

            _onCleanItems: function() {
                this._parent();
                this.contentContainers = [];
                this.viewers = [];
            }
        });

        return CXPGalleryProductControl;
});

