/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DImageButton
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DImageButton_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DImageButton',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
    'DS/StudioUIActorModelWeb/controls/CXPImageButtonControl'
],
function (UWA, CATE3DXUIRep2DUIActor, CXPImageButtonControl) {
	'use strict';

	var CATE3DXUIRep2DImageButton = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DImageButton.prototype **/
	{
        _Fill: function(iContainer) {
            this._parent(iContainer);
            
            this._imagebutton = new CXPImageButtonControl().inject(iContainer);
            
            var imagebuttonEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetNormalImage(imagebuttonEO.GetValueByName('normalImage'));
            this._ListenVariableChanges(imagebuttonEO, 'normalImage');

            this._SetPressedImage(imagebuttonEO.GetValueByName('pressedImage'));
            this._ListenVariableChanges(imagebuttonEO, 'pressedImage');

            this._SetHoveredImage(imagebuttonEO.GetValueByName('hoveredImage'));
            this._ListenVariableChanges(imagebuttonEO, 'hoveredImage');

            this._SetDisabledImage(imagebuttonEO.GetValueByName('disabledImage'));
            this._ListenVariableChanges(imagebuttonEO, 'disabledImage');

            this._SetEnabled(imagebuttonEO.GetValueByName('enabled'));
            this._ListenVariableChanges(imagebuttonEO, 'enabled');

        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            var imagebuttonEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'normalImage') {
                this._SetNormalImage(imagebuttonEO.GetValueByName('normalImage'));
            } else if (iVariableName === 'pressedImage') {
                this._SetPressedImage(imagebuttonEO.GetValueByName('pressedImage'));
            } else if (iVariableName === 'hovered') {
                this._SetHoveredImage(imagebuttonEO.GetValueByName('hoveredImage'));
            } else if (iVariableName === 'disabledImage') {
                this._SetDisabledImage(imagebuttonEO.GetValueByName('disabledImage'));
            } else if (iVariableName === 'enabled') {
                this._SetEnabled(imagebuttonEO.GetValueByName('enabled'));
            } else {
                this._parent(iProps);
            }
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);
            
            this._imagebutton.onClick = function() {iSDKObject.doUIDispatchEvent('UIClickEvent');};
            this._imagebutton.onDoubleClick = function() {iSDKObject.doUIDispatchEvent('UIDoubleClickEvent');};
            this._imagebutton.onRightClick = function() {iSDKObject.doUIDispatchEvent('UIRightClickEvent');};
            this._imagebutton.onEnter = function() {iSDKObject.doUIDispatchEvent('UIEnterEvent');};
            this._imagebutton.onExit = function() {iSDKObject.doUIDispatchEvent('UIExitEvent');};
            this._imagebutton.onHover = function() {iSDKObject.doUIDispatchEvent('UIHoverEvent');};
            this._imagebutton.onPress = function() {iSDKObject.doUIDispatchEvent('UIPressEvent');};
            this._imagebutton.onRelease = function() {iSDKObject.doUIDispatchEvent('UIReleaseEvent');};
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._imagebutton.onClick = null;
            this._imagebutton.onDoubleClick = null;
            this._imagebutton.onRightClick = null;
            this._imagebutton.onEnter = null;
            this._imagebutton.onExit = null;
            this._imagebutton.onHover = null;
            this._imagebutton.onPress = null;
            this._imagebutton.onRelease = null;
		},

        _SetNormalImage: function(iNormalImage) {
            if (iNormalImage) {
                var cati3DXPictureResourceAsset = iNormalImage.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                var self = this;
                return cati3DXPictureResourceAsset.getPicture().then(
                    function (iPicture) {
                        self._imagebutton.normalImage = iPicture.src;
                    }
                );
            }
            this._imagebutton.normalImage = '';
            return UWA.Promise.resolve(this._imagebutton.normalImage);
        },

        _SetPressedImage: function(iPressedImage) {
            if (iPressedImage) {
                var cati3DXPictureResourceAsset = iPressedImage.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                var self = this;
                return cati3DXPictureResourceAsset.getPicture().then(
                    function (iPicture) {
                        self._imagebutton.pressedImage = iPicture.src;
                    }
                );
            }
            this._imagebutton.pressedImage = '';
            return UWA.Promise.resolve(this._imagebutton.pressedImage);
        },

        _SetHoveredImage: function(iHoveredImage) {
            if (iHoveredImage) {
                var cati3DXPictureResourceAsset = iHoveredImage.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                var self = this;
                return cati3DXPictureResourceAsset.getPicture().then(
                    function (iPicture) {
                        self._imagebutton.hoveredImage = iPicture.src;
                    }
                );
            }
            this._imagebutton.hoveredImage = '';
            return UWA.Promise.resolve(this._imagebutton.hoveredImage);
        },

        _SetDisabledImage: function(iDisabled) {
            if (iDisabled) {
                var cati3DXPictureResourceAsset = iDisabled.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                var self = this;
                return cati3DXPictureResourceAsset.getPicture().then(
                    function (iPicture) {
                        self._imagebutton.disabledImage = iPicture.src;
                    }
                );
            }
            this._imagebutton.disabledImage = '';
            return UWA.Promise.resolve(this._imagebutton.disabledImage);
        },

        _SetEnabled: function(iEnabled) {
            this._imagebutton.enabled = iEnabled;
        }

	});
	return CATE3DXUIRep2DImageButton;
});
