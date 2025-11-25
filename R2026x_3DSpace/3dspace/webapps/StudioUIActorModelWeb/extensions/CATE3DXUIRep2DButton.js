/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DButton
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DButton_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DButton',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
    'DS/Controls/Button',
    'css!DS/StudioUIActorModelWeb/style/CXPButton.css'
],
function (UWA, CATE3DXUIRep2DUIActor, WUXButton, CXPButtonCSS) {
	'use strict';

	var CATE3DXUIRep2DButton = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DButton.prototype **/
	{
        _Fill: function(iContainer) {
            this._parent(iContainer);

            this._button = new WUXButton({ emphasize: 'secondary' }).inject(iContainer);
            this._button.getContent().style.overflow = 'initial';
            this._button.getContent().style.minWidth = '100%';
            this._button.getContent().style.minHeight = '100%';
            this._button.getContent().style.paddingLeft = '7px';
            this._button.getContent().style.paddingRight = '7px';

            this._iconWidth = null;
            this._iconHeight = null;

            var buttonEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetFontSize(buttonEO.GetValueByName('fontSize'));
            this._ListenVariableChanges(buttonEO, 'fontSize');

            this._SetLabel(buttonEO.GetValueByName('label'));
            this._ListenVariableChanges(buttonEO, 'label');

            if (this._button.elements.text) {
                // to center label and leave icon to the left
                this._button.elements.text.style.margin = 'auto';
            }

            this._SetPushable(buttonEO.GetValueByName('pushable'));
            this._ListenVariableChanges(buttonEO, 'pushable');

            this._SetPushed(buttonEO.GetValueByName('pushed'));
            this._ListenVariableChanges(buttonEO, 'pushed');

            var iconDimension = buttonEO.GetValueByName('iconDimension').QueryInterface('CATI3DExperienceObject');
            var self = this;
            this._SetIcon(buttonEO.GetValueByName('icon')).then( function() {
                self._SetIconWidth(iconDimension.GetValueByName("x"));
                self._SetIconHeight(iconDimension.GetValueByName("y"));
            });

            this._ListenVariableChanges(buttonEO, 'icon');
            this._ListenVariableChanges(buttonEO, 'iconDimension');

            this._SetEnabled(buttonEO.GetValueByName('enabled'));
            this._ListenVariableChanges(buttonEO, 'enabled');
        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            var buttonEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'fontSize') {
                this._SetFontSize(buttonEO.GetValueByName('fontSize'));
            } else if (iVariableName === 'label') {
                this._SetLabel(buttonEO.GetValueByName('label'));
            } else if (iVariableName === 'pushable') {
                this._SetPushable(buttonEO.GetValueByName('pushable'));
            } else if (iVariableName === 'pushed') {
                this._SetPushed(buttonEO.GetValueByName('pushed'));
            } else if (iVariableName === 'icon') {
                this._SetIcon(buttonEO.GetValueByName('icon'));
            } else if (iVariableName === 'iconDimension') {
                var iconDimension = buttonEO.GetValueByName('iconDimension').QueryInterface('CATI3DExperienceObject');
                if (iProps.length === 2) {
                    if (iProps[1] === 'x') {
                        this._SetIconWidth(iconDimension.GetValueByName("x"));
                    } else if (iProps[1] === 'y') {
                        this._SetIconHeight(iconDimension.GetValueByName("y"));
                    } else {
                        console.error('unknown property ' + iProps[1] + ' on iconDimension');
                    }
               } else {
                   this._SetIconWidth(iconDimension.GetValueByName("x"));
                   this._SetIconHeight(iconDimension.GetValueByName("y"));
               }
            } else if (iVariableName === 'enabled') {
                this._SetEnabled(buttonEO.GetValueByName('enabled'));
            } else {
                this._parent(iProps);
            }
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);
            
            this._button.addEventListener('buttonclick', this._OnButtonclick = function () {
			    iSDKObject.doUIDispatchEvent('UIClickEvent');
			});

            this._button.addEventListener('buttonDblClick', this._OnButtonDblClick = function () {
                iSDKObject.doUIDispatchEvent('UIDoubleClickEvent');
            });

            var self = this;
            this._button.addEventListener('change', this._OnChange = function () {
			    self.QueryInterface('CATI3DExperienceObject').SetValueByName('pushed', self._button.checkFlag);
			});

			this._button.addEventListener('mouseenter', this._OnMouseEnter = function () {
			    iSDKObject.doUIDispatchEvent('UIEnterEvent');
			});

			this._button.addEventListener('mouseleave', this._OnMouseLeave = function () {
			    iSDKObject.doUIDispatchEvent('UIExitEvent');
			});

			this._button.addEventListener('mousemove', this._OnMouseMove = function () {
			    iSDKObject.doUIDispatchEvent('UIHoverEvent');
			});
            
            this._button.addEventListener('mousedown', this._OnMouseDown = function (iEvent) {
                if (iEvent.button === 0) {
                    iSDKObject.doUIDispatchEvent('UIPressEvent');
                }
            });

            this._button.addEventListener('mouseup', this._OnMouseUp = function (iEvent) {
                if (iEvent.button === 0) {
                    iSDKObject.doUIDispatchEvent('UIReleaseEvent');
                }
            });

			this._button.addEventListener('contextmenu', this._OnContextMenu = function () {
			    iSDKObject.doUIDispatchEvent('UIRightClickEvent');
			});

            
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._button.removeEventListener('buttonclick', this._OnButtonclickEvent);
            this._button.removeEventListener('buttonDblClick', this._OnButtonDblClick);
            this._button.removeEventListener('change', this._OnChange);
			this._button.removeEventListener('mouseenter', this._OnMouseEnter);
			this._button.removeEventListener('mouseleave', this._OnMouseLeave);
			this._button.removeEventListener('mousemove', this._OnMouseMove);
			this._button.removeEventListener('mousedown', this._OnMouseDown);
			this._button.removeEventListener('mouseup', this._OnMouseUp);
			this._button.removeEventListener('contextmenu', this._OnContextMenu);
		},

        _SetEnabled: function(iEnabled) {
            this._button.disabled = !iEnabled;
        },

        _SetFontSize: function(iFontSize) {
            this._button.getContent().style.fontSize = iFontSize + 'px';
        },

        _SetLabel: function(iLabel) {
            this._button.label = iLabel;
        },

        _SetPushable: function(iPushable) {
            if (iPushable) {
                this._button.type = 'check';
            }
            else {
                this._button.type = 'standard';
            }
        },

        _SetPushed: function(iPushed) {
            if (iPushed) {
                this._button.checkFlag = true;
            } else {
                this._button.checkFlag = false;
            }
        },

        _SetIcon: function(iIcon) {
            if (iIcon) {
                var cati3DXPictureResourceAsset = iIcon.QueryInterface('CATI3DXPictureResourceAsset');
                if (!UWA.is(cati3DXPictureResourceAsset)) { 
                    console.error('Cant retrieve picture');
                    return; 
                }
                var self = this;
                return cati3DXPictureResourceAsset.getPicture().then(
                    function (iPicture) {
                        let img = UWA.createElement('img');
                        img.setAttribute('draggable', false);
                        img.src = iPicture.src;
                        
                        self._button.icon = {iconClasses:'cxpbutton-iconcontainer'};

                        img.inject(self._button.elements.icon);
                        if (self._iconWidth !== null && self._iconHeight !== null) {
                            self._button.elements.icon.parentElement.style.order = '-1'; // WebUX sets icon to the right, we want it to the left
                            self._button.elements.icon.style.width = self._iconWidth + 'px';
                            self._button.elements.icon.style.height = self._iconHeight + 'px';
                        }
                    }
                );
            }

            this._button.icon = '';
            return UWA.Promise.resolve(this._button.icon);
        },

        _SetIconWidth: function(iIconWidth) {
            if (iIconWidth !== this._iconWidth) {
                this._iconWidth = iIconWidth;
            }
            if (this._button.elements.icon) {
                this._button.elements.icon.style.width = this._iconWidth + 'px';
            }
        },

        _SetIconHeight: function(iIconHeight) {
            if (iIconHeight !== this._iconHeight) {
                this._iconHeight = iIconHeight;
            }
            if (this._button.elements.icon) {
                this._button.elements.icon.style.height = this._iconHeight + 'px';
            }
        }

	});
	return CATE3DXUIRep2DButton;
});
