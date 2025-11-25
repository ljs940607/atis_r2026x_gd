/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DImage
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DImage_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DImage',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor'
],
function (UWA, CATE3DXUIRep2DUIActor) {
	'use strict';

	var CATE3DXUIRep2DImage = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DImage.prototype **/
	{
        _Fill: function(iContainer) {
            this._parent(iContainer);

            this._img = UWA.createElement('img').inject(iContainer);
            this._img.setAttribute('draggable', false);
            this._img.style.width = '100%';
            this._img.style.height = '100%';
            this._img.style.display = 'inherit';

            let imageEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetImage(imageEO.GetValueByName('image'));
            this._ListenVariableChanges(imageEO, 'image');

            this._SetEnabled(imageEO.GetValueByName('enabled'));
            this._ListenVariableChanges(imageEO, 'enabled');
        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            let imageEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'enabled') {
                this._SetEnabled(imageEO.GetValueByName('enabled'));
            }
            else if (iVariableName === 'image') {
                this._SetImage(imageEO.GetValueByName('image'));
            } else {
				this._parent(iProps);
			}
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);

            var self = this;
			this._img.addEventListener('click', this._clickEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIClickEvent');
			});

			this._img.addEventListener('dblclick', this._dblclickEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIDoubleClickEvent');
			});

			this._img.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIEnterEvent');
			});

			this._img.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIExitEvent');
			});

			this._img.addEventListener('mousemove', this._mouseMoveEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIHoverEvent');
			});

			this._img.addEventListener('mousedown', this._mouseDownEvent = function (iEvent) {
				if (!self._enabled) {
                    return;
                }
				if (iEvent.button === 0) {
					iSDKObject.doUIDispatchEvent('UIPressEvent');
				}
			});

			this._img.addEventListener('mouseup', this._mouseUpEvent = function (iEvent) {
				if (!self._enabled) {
                    return;
                }
				if (iEvent.button === 0) {
					iSDKObject.doUIDispatchEvent('UIReleaseEvent');
				}
			});

			this._img.addEventListener('contextmenu', this._contextMenuEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIRightClickEvent');
			});    
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._img.removeEventListener('click', this._clickEvent);
			this._img.removeEventListener('dblclick', this._dblclickEvent);
			this._img.removeEventListener('mouseenter', this._mouseEnterEvent);
			this._img.removeEventListener('mouseleave', this._mouseLeaveEvent);
			this._img.removeEventListener('mousemove', this._mouseMoveEvent);
			this._img.removeEventListener('mousedown', this._mouseDownEvent);
			this._img.removeEventListener('mouseup', this._mouseUpEvent);
			this._img.removeEventListener('contextmenu', this._contextMenuEvent);
		},

        _SetImage: function(iImage) {
            if (iImage) {
                var cati3DXPictureResourceAsset = iImage.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) {console.error('Cant retrieve picture'); return;}
                var self = this;
                cati3DXPictureResourceAsset.getPicture().then(function (iPicture) {
                    self._img.src = iPicture.src;
                    self._img.hidden = false;
                });
            }
            else {
                // probably incorrect because we still send event event if hidden in cxp on native side
                this._img.hidden = true;
            }
        },

        _SetEnabled: function(iEnabled) {
            this._enabled = iEnabled;

            if (iEnabled) {
                this._img.style.pointerEvents = 'inherit';
                this._img.style.filter = 'none';
            }
            else {
                this._img.style.pointerEvents = 'none';
                this._img.style.filter = 'brightness(70%) grayscale(100%)';
            }
        }

	});
	return CATE3DXUIRep2DImage;
});
