/**
 * 
 * 
 * @name DS/StudioUIActorModelWeb/CXPGalleryImageControl
 * @constructor
 * @augments module:DS/Controls/CXPGalleryControl
 * 
*/
define('DS/StudioUIActorModelWeb/controls/CXPGalleryImageControl', 
['UWA/Core', 
'DS/StudioUIActorModelWeb/controls/CXPGalleryControl'],

function (UWA, CXPGalleryControl) {
    'use strict';

    var CXPGalleryImageControl = CXPGalleryControl.inherit(
        /**
          * @lends DS/StudioUIActorModelWeb/CXPGalleryControl.prototype
          */
          {
            publishedProperties: {
            },

            buildView: function() {
                this._parent();

                this.contentContainers = [];
            },


            _buildItem: function(iItem, iIndex, iItemContainer) {
                this._parent(iItem, iIndex, iItemContainer);
                let contentContainer = CXPGalleryControl.CreateLabeledItem(iItemContainer, iItem.label);
                
                if (iItem.image) {
                    contentContainer.style.background = 'url(' + iItem.image + ')';
                    contentContainer.style.backgroundSize = '100% 100%';
                    // let img = UWA.createElement('img', {src:iItem.image}).inject(contentContainer);
                    // img.style.width = '100%';
                    // img.style.height = '100%';
                    // img.style.objectFit = 'fill';
                } else {
                    let div = UWA.createElement('div').inject(contentContainer);
                    div.style.width = '100%';
                    div.style.height = '100%';
                }
                this.contentContainers.push(contentContainer);
            },

            _onCleanItems: function() {
                this._parent();
                this.contentContainers = [];
            }
        });

        return CXPGalleryImageControl;
});

