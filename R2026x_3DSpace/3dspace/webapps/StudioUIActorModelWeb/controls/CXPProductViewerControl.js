/**
 * 
 * 
 * @name DS/StudioUIActorModelWeb/CXPProductViewerControl
 * @constructor
 * @augments module:DS/Controls/Abstract
 * 
 * 
*/
define('DS/StudioUIActorModelWeb/controls/CXPProductViewerControl', 
['UWA/Core', 
'DS/Controls/Abstract'],

function (UWA, Abstract) {
    'use strict';

    function _UpdateProductViewer() {
        if (this.product && this.product.QueryInterface('CATI3DGeoVisu')) {
            var previewManager = this.product._experienceBase.getManager('CAT3DXPreviewManager');
            var width = this.elements.container.offsetWidth;
            var height = this.elements.container.offsetHeight;
            if (width !== 0 && height !== 0) {
                previewManager.getPreview(this.product.QueryInterface('CATI3DGeoVisu'), width, height).done((iPreview) => {
                    this.elements.container.style.background = "url('" + iPreview + "')";
                    this.elements.container.style.backgroundSize = '100% 100%';
                });
            }
        } else {
            this.elements.container.background = 'inherit';
        }
    }

    var CXPProductViewerControl = Abstract.inherit(
        /**
          * @lends DS/StudioUIActorModelWeb/CXPProductViewerControl.prototype
          */
          {
            publishedProperties: {
              product: {
                  defaultValue: null,
                  type: 'object'
              }
            },
            
            _preBuildView: function(properties) {
                this.elements.container = new UWA.Element('div');
                this.elements.container.style.width = '100%';
                this.elements.container.style.height = '100%';
                this._parent(properties);
            },

            _applyProduct: function() {
                _UpdateProductViewer.call(this);
            },

            _applyWidth: function() {
                _UpdateProductViewer.call(this);
            },

            _applyHeight: function() {
                _UpdateProductViewer.call(this);
            },

      
            _applyProperties: function (oldValues) {
                this._parent(oldValues);

                if (this.isDirty('product')) {
                    this._applyProduct(oldValues.product);
                }

                if (this.isDirty('disabled')) {
                    this._applyDisabled(oldValues.disabled);
                }
            },

            refreshProductViewer() {
                _UpdateProductViewer.call(this);
            }
        });

        return CXPProductViewerControl;
});

