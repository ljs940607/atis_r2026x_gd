/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryMenu
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DGalleryMenu_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryMenu',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGallery',
    'DS/StudioUIActorModelWeb/controls/CXPGalleryMenuControl'
],
function (UWA, CATE3DXUIRep2DGallery, CXPGalleryMenuControl) {
	'use strict';

	var CATE3DXUIRep2DGalleryMenu = CATE3DXUIRep2DGallery.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGalleryMenu.prototype **/
	{
        _Fill: function(iContainer) {
            this._parent(iContainer);

            let galleryEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetFontSize(galleryEO.GetValueByName('fontSize'));
			this._ListenVariableChanges(galleryEO, 'fontSize');
        },


        _BuildGalleryView: function(iContainer) {
            this._gallery = new CXPGalleryMenuControl().inject(iContainer);
        },

        _SetItems: function(iItems) {
            let items=[];
            for (let i = 0; i < iItems.length; i++) {
                let itemEO = iItems[i].QueryInterface('CATI3DExperienceObject');
                let label = itemEO.GetValueByName('label');
                items.push({label: label});
            }
            this._gallery.items = items;
        },

        _UpdateItem: function(iIndex, iItem) {
            let itemEO = iItem.QueryInterface('CATI3DExperienceObject');
            let label = itemEO.GetValueByName('label');
            let item = {label: label};
            this._gallery.updateItem(iIndex, item);
       },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            if (iVariableName === 'fontSize') {
                let galleryEO = this.QueryInterface('CATI3DExperienceObject');
                this._SetFontSize(galleryEO.GetValueByName('fontSize'));
            } else {
                this._parent(iProps);
            }
        },

        _SetFontSize: function(iFontSize) {
            this._gallery.fontSize = iFontSize;
        }

	});
	return CATE3DXUIRep2DGalleryMenu;
});
