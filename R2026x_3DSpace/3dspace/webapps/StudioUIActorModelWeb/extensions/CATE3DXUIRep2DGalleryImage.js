/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryImage
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DGalleryImage_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryImage',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGallery',
    'DS/StudioUIActorModelWeb/controls/CXPGalleryImageControl'
],
function (UWA, CATE3DXUIRep2DGallery, CXPGalleryImageControl) {
	'use strict';

	var CATE3DXUIRep2DGalleryImage = CATE3DXUIRep2DGallery.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryImage.prototype **/
	{
        _BuildGalleryView: function(iContainer) {
            this._gallery = new CXPGalleryImageControl().inject(iContainer);
        },

        _SetItems: function(iItems) {
            let items=[];
            var promises = [];
            for (let i = 0; i < iItems.length; i++) {
                let itemEO = iItems[i].QueryInterface('CATI3DExperienceObject');
                let image = itemEO.GetValueByName('image');
                let label = itemEO.GetValueByName('label');

                if (UWA.is(image)) {
                    let cati3DXPictureResourceAsset = image.QueryInterface('CATI3DXPictureResourceAsset');
                    if (!UWA.is(cati3DXPictureResourceAsset)) { 
                        console.error('Cant retrieve picture');
                        return; 
                    }
                    promises.push(cati3DXPictureResourceAsset.getPicture().then(iPicture => {items[i] = {label: label, image: iPicture.src}; } ));
                } else {
                    items[i] = {label:label, image:""};
                }
            }

            Promise.allSettled(promises).then(() => { this._gallery.items = items; } );
        },

        _UpdateItem: function(iIndex, iItem) {
            let itemEO = iItem.QueryInterface('CATI3DExperienceObject');
            let image = itemEO.GetValueByName('image');
            let label = itemEO.GetValueByName('label');

            if (UWA.is(image)) {
                let cati3DXPictureResourceAsset = image.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                cati3DXPictureResourceAsset.getPicture().then(iPicture => {
                    let item = {label: label, image: iPicture.src};
                    this._gallery.updateItem(iIndex, item);
                } );
            } else {
                let item = {label:label, image:""};
                this._gallery.updateItem(iIndex, item);
            }
       },

	});
	return CATE3DXUIRep2DGalleryImage;
});
