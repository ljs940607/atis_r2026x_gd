/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryProduct
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DGalleryProduct_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryProduct',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGallery',
    'DS/StudioUIActorModelWeb/controls/CXPGalleryProductControl'
],
function (UWA, CATE3DXUIRep2DGallery, CXPGalleryProductControl) {
	'use strict';

	var CATE3DXUIRep2DGalleryProduct = CATE3DXUIRep2DGallery.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryProduct.prototype **/
	{
        _BuildGalleryView: function(iContainer) {
            this._gallery = new CXPGalleryProductControl().inject(iContainer);
        },

        _SetItems: function(iItems) {
            let promises = [];
         
            let items=[];
            for (let i = 0; i < iItems.length; i++) {
                let itemEO = iItems[i].QueryInterface('CATI3DExperienceObject');
                let image = itemEO.GetValueByName('image');
                let product = itemEO.GetValueByName('product');
                let label = itemEO.GetValueByName('label');

                if (UWA.is(image)) {
                    let cati3DXPictureResourceAsset = image.QueryInterface('CATI3DXPictureResourceAsset');
                    if (!UWA.is(cati3DXPictureResourceAsset)) { 
                        console.error('Cant retrieve picture');
                        return; 
                    }
                    promises.push(cati3DXPictureResourceAsset.getPicture().then(iPicture => {items[i] = {image: iPicture.src, product: product, label: label}; } ));
                } else {
                    items[i] = {image: null, product: product, label: label};
                }
            }

            Promise.allSettled(promises).then(() => { this._gallery.items = items; });
        },

        _UpdateItem: function(iIndex, iItem) {
            let itemEO = iItem.QueryInterface('CATI3DExperienceObject');
            let image = itemEO.GetValueByName('image');
            let product = itemEO.GetValueByName('product');
            let label = itemEO.GetValueByName('label');

            if (UWA.is(image)) {
                let cati3DXPictureResourceAsset = image.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                cati3DXPictureResourceAsset.getPicture().then(iPicture => {
                    let item = {image: iPicture.src, product: product, label: label};
                    this._gallery.updateItem(iIndex, item);

                } );
            } else {
                let item = {image: null, product: product, label: label};
                this._gallery.updateItem(iIndex, item);
            }
       }

	});
	return CATE3DXUIRep2DGalleryProduct;
});
