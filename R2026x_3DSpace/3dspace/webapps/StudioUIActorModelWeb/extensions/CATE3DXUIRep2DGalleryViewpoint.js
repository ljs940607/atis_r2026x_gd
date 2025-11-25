/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryViewpoint
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DGalleryViewpoint_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryViewpoint',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGallery',
    'DS/StudioUIActorModelWeb/controls/CXPGalleryViewpointControl'
],
function (UWA, CATE3DXUIRep2DGallery, CXPGalleryViewpointControl) {
	'use strict';

	var CATE3DXUIRep2DGalleryViewpoint = CATE3DXUIRep2DGallery.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryViewpoint.prototype **/
	{
        _Fill: function(iContainer) {
            this._parent(iContainer);

            let galleryEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetLiveUpdate(galleryEO.GetValueByName('liveUpdate'));
			this._ListenVariableChanges(galleryEO, 'liveUpdate');
        },


        _BuildGalleryView: function(iContainer) {
            this._gallery = new CXPGalleryViewpointControl().inject(iContainer);
        },

        _SetItems: function(iItems) {
            let promises = [];
         
            let items=[];
            for (let i = 0; i < iItems.length; i++) {
                let itemEO = iItems[i].QueryInterface('CATI3DExperienceObject');
                let image = itemEO.GetValueByName('image');
                let camera = itemEO.GetValueByName('camera');
                let label = itemEO.GetValueByName('label');

                if (UWA.is(image)) {
                    let cati3DXPictureResourceAsset = image.QueryInterface('CATI3DXPictureResourceAsset');
                    if (!UWA.is(cati3DXPictureResourceAsset)) { 
                        console.error('Cant retrieve picture');
                        return; 
                    }
                    promises.push(cati3DXPictureResourceAsset.getPicture().then(iPicture => {items[i] = {image: iPicture.src, camera: camera, label: label}; } ));
                } else {
                    items[i] = {image: null, camera: camera, label: label};
                }
            }

            Promise.allSettled(promises).then(() => { this._gallery.items = items; } );
        },

        _UpdateItem: function(iIndex, iItem) {
            let itemEO = iItem.QueryInterface('CATI3DExperienceObject');
            let image = itemEO.GetValueByName('image');
            let camera = itemEO.GetValueByName('camera');
            let label = itemEO.GetValueByName('label');

            if (UWA.is(image)) {
                let cati3DXPictureResourceAsset = image.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                cati3DXPictureResourceAsset.getPicture().then(iPicture => {
                    let item = {image: iPicture.src, camera: camera, label: label}; 
                    this._gallery.updateItem(iIndex, item);
                } );
            } else {
                let item = {image: null, camera: camera, label: label};
                this._gallery.updateItem(iIndex, item);
            }
       },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            if (iVariableName === 'liveupdate') {
                let galleryEO = this.QueryInterface('CATI3DExperienceObject');
                this._SetLiveUpdate(galleryEO.GetValueByName('liveUpdate'));
            } else {
                this._parent(iProps);
            }
        },

        _SetLiveUpdate: function(iLiveUpdate) {
            this._gallery.liveUpdate = iLiveUpdate;
        }

	});
	return CATE3DXUIRep2DGalleryViewpoint;
});
