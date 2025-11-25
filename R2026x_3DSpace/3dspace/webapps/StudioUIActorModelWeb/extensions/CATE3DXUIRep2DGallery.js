/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGallery
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DColorPicker_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGallery',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
    'DS/StudioUIActorModelWeb/controls/CXPGalleryControl'
],
function (UWA, CATE3DXUIRep2DUIActor, CXPGalleryControl) {
	'use strict';

	function GetPixelDimensions(iUIActor) {
		var uiactor = iUIActor.QueryInterface('CATICXPUIActor');

		var dim = uiactor.GetMinimumDimension();
		if (dim.mode === 1 /* Percentage */) {
			const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
			const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
			return {width: dim.width*vw/100.0, height: dim.height*vh/100.0};
		}
		return {width: dim.width, height: dim.height};
	}

	var CATE3DXUIRep2DGallery = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DGallery.prototype **/
	{

		/**
		* Enumeration of gallery orientations
		*
        * @readonly
        * @enum {number}
		*/
		EGalleryOrientation : {
			eVertical: 0,
			eHorizontal : 1
		},

        _Fill: function(iContainer) {
            this._parent(iContainer);

            this._BuildGalleryView(iContainer);

            let galleryEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetEnabled(galleryEO.GetValueByName('enabled'));
			this._ListenVariableChanges(galleryEO, 'enabled');
            
            this._SetItems(galleryEO.GetValueByName('items'));
			this._ListenVariableChanges(galleryEO, 'items');
            
            this._SetItemSize(galleryEO.GetValueByName('itemSize'));
			this._ListenVariableChanges(galleryEO, 'itemSize');

            this._SetOrientation(galleryEO.GetValueByName('orientation'));
            this._ListenVariableChanges(galleryEO, 'orientation');

            this._SetStretchToContent(galleryEO.GetValueByName('stretchToContent'));
			this._ListenVariableChanges(galleryEO, 'stretchToContent');
        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            let galleryEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'enabled') {
                this._SetEnabled(galleryEO.GetValueByName('enabled'));
            }
            else if (iVariableName === 'items') {
                if (iProps.length >= 2) {
                    let items = galleryEO.GetValueByName('items');
                    let index = parseInt(iProps[1]);
                    if (items.length <= index) {
                        console.error("invalid index " + index + " on items");
                    } else {
                        this._UpdateItem(index, items[index]);
                    }
               } else {
                    this._SetItems(galleryEO.GetValueByName('items'));
               }
            }
            else if (iVariableName === 'itemSize') {
                this._SetItemSize(galleryEO.GetValueByName('itemSize'));
            }
            else if (iVariableName === 'orientation') {
                this._SetOrientation(galleryEO.GetValueByName('orientation'));
            }
            else if (iVariableName === 'stretchToContent') {
                this._SetStretchToContent(galleryEO.GetValueByName('stretchToContent'));
            } else {
                this._parent(iProps);
            }
        },

        _BuildGalleryView: function(iContainer) {
            this._gallery = new CXPGalleryControl().inject(iContainer);
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);

            this._gallery.onClick = function(e) {iSDKObject.doUIDispatchEvent('UIClickEvent', '{"index": ' +  e.options.index + '}');};
            this._gallery.onDoubleClick = function(e) {iSDKObject.doUIDispatchEvent('UIDoubleClickEvent', '{"index": ' +  e.options.index + '}');};
            this._gallery.onEnter = function(e) {iSDKObject.doUIDispatchEvent('UIEnterEvent', '{"index": ' +  e.options.index + '}');};
            this._gallery.onExit = function(e) {iSDKObject.doUIDispatchEvent('UIExitEvent', '{"index": ' +  e.options.index + '}');};
            this._gallery.onHover = function(e) {iSDKObject.doUIDispatchEvent('UIHoverEvent', '{"index": ' +  e.options.index + '}');};
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._gallery.onClick = null;
            this._gallery.onDoubleClick = null;
            this._gallery.onEnter = null;
            this._gallery.onExit = null;
            this._gallery.onHover = null;

            this._gallery.onClickOnIndex = null;
            this._gallery.onDoubleClickOnIndex = null;
            this._gallery.onEnterOnIndex = null;
            this._gallery.onExitOnIndex = null;
            this._gallery.onHoverOnIndex = null;
		},

        _SetEnabled: function(iEnabled) {
            this._gallery.disabled = !iEnabled;
        },

        _SetOrientation: function(iOrientation) {
            if (iOrientation === this.EGalleryOrientation.eVertical) {
                this._gallery.orientation = 'vertical';
            } else {
                this._gallery.orientation = 'horizontal';
            }
            this._CheckValidDimension();
        },

        _SetItemSize: function(iItemSize) {
            let itemSizeEO = iItemSize.QueryInterface('CATI3DExperienceObject');
            this._gallery.itemMinWidth = itemSizeEO.GetValueByName("x");
            this._gallery.itemMinHeight = itemSizeEO.GetValueByName("y");
            this._CheckValidDimension();
        },

        _SetStretchToContent: function(iStretchToContent) {
            this._gallery.stretchToContent = iStretchToContent;
            this._CheckValidDimension();
        },

        _SetItems: function() {
            //to implement on child classes
        },

        _UpdateItem: function(iIndex, iItem) {
             //to implement on child classes
        },

        _GroupPropertyUpdate: function(iPropertyName) {
			let props = iPropertyName.split('.');
			let rootProperty = props[0];
			if (rootProperty === 'items') {
				if (props.length == 3) {
                    return props[0] + '.' + props[1]
                } else {
                    rootProperty;
                }
			}
			return this._parent(iPropertyName);
		},

        _GetVisuMinimumDimension: function() {
			if (!this._gallery || this._gallery.stretchToContent) {
                return this._parent();
            }

            return GetPixelDimensions(this);
		}

	});
	return CATE3DXUIRep2DGallery;
});
