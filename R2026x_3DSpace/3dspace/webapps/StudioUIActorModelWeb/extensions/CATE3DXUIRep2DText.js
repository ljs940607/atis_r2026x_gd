/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DText
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DText_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DText',
[
	'UWA/Core',
	'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
	'DS/VCXWebProperties/VCXColor'
],
function (UWA, CATE3DXUIRep2DUIActor, VCXColor) {
	'use strict';

	var CATE3DXUIRep2DText = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DText.prototype **/
	{
		/**
		* Enumeration of all possible text alignments
		*
        * @readonly
        * @enum {number}
        */
		ETextAlignments: {
			eAlignLeft: 0,
			eAlignCenter: 1,
			eAlignRight: 2
		},

        _Fill: function(iContainer) {
            this._parent(iContainer);

			this._textOpacity = 1.0;
			this._textColor = new VCXColor().SetRGB(85, 118, 139);
			
			this._showBg = true;
			this._backgroundOpacity = 1.0;
			this._backgroundColor = new VCXColor().SetRGB(255, 255, 255);

			this._showBorder = true;
			this._borderColor = new VCXColor().SetRGB(85, 118, 138);
			this._borderOpacity = 1.0;

			this._labelContainer = UWA.createElement('div').inject(iContainer);
			this._labelContainer.style.width = '100%';
			this._labelContainer.style.height = '100%';
			this._labelContainer.style.border = '2px';
			this._labelContainer.style.borderStyle = 'solid';
			this._labelContainer.style.borderRadius = '5px';
			this._labelContainer.style.padding = '6px';
			this._labelContainer.style.boxSizing = 'border-box';


			this._label = UWA.createElement('span').inject(this._labelContainer);
			this._label.style.whiteSpace = 'pre';
			this._label.style.lineHeight = 'initial';

			let textEO = this.QueryInterface('CATI3DExperienceObject');

			this._SetAlignment(textEO.GetValueByName('alignment'));
			this._ListenVariableChanges(textEO, 'alignment');

			this._SetFont(textEO.GetValueByName('font'));
			this._ListenVariableChanges(textEO, 'font');

			this._SetFontSize(textEO.GetValueByName('fontSize'));
			this._ListenVariableChanges(textEO, 'fontSize');

			this._SetBold(textEO.GetValueByName('bold'));
			this._ListenVariableChanges(textEO, 'bold');

			this._SetItalic(textEO.GetValueByName('italic'));
			this._ListenVariableChanges(textEO, 'italic');

			this._SetText(textEO.GetValueByName('text'));
			this._ListenVariableChanges(textEO, 'text');

			this._SetTextColor(textEO.GetValueByName('textColor'));
			this._ListenVariableChanges(textEO, 'textColor');

			this._SetTextOpacity(textEO.GetValueByName('textOpacity'));
			this._ListenVariableChanges(textEO, 'textOpacity');

			this._SetShowBackground(textEO.GetValueByName('showBackground'));
			this._ListenVariableChanges(textEO, 'showBackground');

			this._SetBackgroundColor(textEO.GetValueByName('backgroundColor'));
			this._ListenVariableChanges(textEO, 'backgroundColor');

			this._SetBackgroundOpacity(textEO.GetValueByName('backgroundOpacity'));
			this._ListenVariableChanges(textEO, 'backgroundOpacity');

			this._SetShowBorder(textEO.GetValueByName('showBorder'));
			this._ListenVariableChanges(textEO, 'showBorder');

			this._SetBorderColor(textEO.GetValueByName('borderColor'));
			this._ListenVariableChanges(textEO, 'borderColor');

			this._SetBorderOpacity(textEO.GetValueByName('borderOpacity'));
			this._ListenVariableChanges(textEO, 'borderOpacity');

			this._SetEnabled(textEO.GetValueByName('enabled'));
            this._ListenVariableChanges(textEO, 'enabled');
        },

        _UpdateProperty: function(iProps) {
			let iVariableName = iProps[0];
			let textEO = this.QueryInterface('CATI3DExperienceObject');
			
            if (iVariableName === 'alignment') {
				this._SetAlignment(textEO.GetValueByName('alignment'));
			} else if (iVariableName === 'font') {
				this._SetFont(textEO.GetValueByName('font'));
			} else if (iVariableName === 'fontSize') {
				this._SetFontSize(textEO.GetValueByName('fontSize'));
			} else if (iVariableName === 'bold') {
				this._SetBold(textEO.GetValueByName('bold'));
			} else if (iVariableName === 'italic') {
				this._SetItalic(textEO.GetValueByName('italic'));
			} else if (iVariableName === 'text') {
				this._SetText(textEO.GetValueByName('text'));
			} else if (iVariableName === 'textColor') {
				this._SetTextColor(textEO.GetValueByName('textColor'));
			} else if (iVariableName === 'textOpacity') {
				this._SetTextOpacity(textEO.GetValueByName('textOpacity'));
			} else if (iVariableName === 'showBackground') {
				this._SetShowBackground(textEO.GetValueByName('showBackground'));
			} else if (iVariableName === 'backgroundColor') {
				this._SetBackgroundColor(textEO.GetValueByName('backgroundColor'));
			} else if (iVariableName === 'backgroundOpacity') {
				this._SetBackgroundOpacity(textEO.GetValueByName('backgroundOpacity'));
			} else if (iVariableName === 'showBorder') {
				this._SetShowBorder(textEO.GetValueByName('showBorder'));
			} else if (iVariableName === 'borderColor') {
				this._SetBorderColor(textEO.GetValueByName('borderColor'));
			} else if (iVariableName === 'borderOpacity') {
				this._SetBorderOpacity(textEO.GetValueByName('borderOpacity'));
			} else if (iVariableName === 'enabled') {
                this._SetEnabled(textEO.GetValueByName('enabled'));
			} else {
				this._parent(iProps);
			}
        },

		_GroupPropertyUpdate: function(iPropertyName) {
			// to avoid having multiple updates that refresh the same thing, we try to group some updates
			let props = iPropertyName.split('.');
			let rootProperty = props[0];
			if (rootProperty === 'backgroundColor'
			|| rootProperty === 'borderColor'
			|| rootProperty === 'textColor') {
				return rootProperty;
			}
			return this._parent(iPropertyName);
		},

		RegisterPlayEvents: function (iSdkObject) {
			this._parent(iSdkObject);

			var self = this;
			this._labelContainer.addEventListener('click', this._clickEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSdkObject.doUIDispatchEvent('UIClickEvent');
			});

			this._labelContainer.addEventListener('dblclick', this._dblclickEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSdkObject.doUIDispatchEvent('UIDoubleClickEvent');
			});

			this._labelContainer.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSdkObject.doUIDispatchEvent('UIEnterEvent');
			});

			this._labelContainer.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSdkObject.doUIDispatchEvent('UIExitEvent');
			});

			this._labelContainer.addEventListener('mousemove', this._mouseMoveEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSdkObject.doUIDispatchEvent('UIHoverEvent');
			});

			this._labelContainer.addEventListener('mousedown', this._mouseDownEvent = function (iEvent) {
				if (!self._enabled) {
                    return;
                }
				if (iEvent.button === 0) {
					iSdkObject.doUIDispatchEvent('UIPressEvent');
				}
			});

			this._labelContainer.addEventListener('mouseup', this._mouseUpEvent = function (iEvent) {
				if (!self._enabled) {
                    return;
                }
				if (iEvent.button === 0) {
					iSdkObject.doUIDispatchEvent('UIReleaseEvent');
				}
			});

			this._labelContainer.addEventListener('contextmenu', this._contextMenuEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSdkObject.doUIDispatchEvent('UIRightClickEvent');
			});
		},

		// Release play events
		ReleasePlayEvents: function () {
			this._parent();

			this._labelContainer.removeEventListener('click', this._clickEvent);
			this._labelContainer.removeEventListener('dblclick', this._dblclickEvent);
			this._labelContainer.removeEventListener('mouseenter', this._mouseEnterEvent);
			this._labelContainer.removeEventListener('mouseleave', this._mouseLeaveEvent);
			this._labelContainer.removeEventListener('mousemove', this._mouseMoveEvent);
			this._labelContainer.removeEventListener('mousedown', this._mouseDownEvent);
			this._labelContainer.removeEventListener('mouseup', this._mouseUpEvent);
			this._labelContainer.removeEventListener('contextmenu', this._contextMenuEvent);
		},

		_SetText: function(iText) {
			this._label.innerHTML = iText;
			this._CheckValidDimension();
		},

		_SetBold: function(iBold) {
			if (iBold) {
				this._label.style.fontWeight = 'bold';
				}
			else {
				this._label.style.fontWeight = 'normal';
			}
		},

		_SetItalic: function(iItalic) {
			if (iItalic) {
				this._label.style.fontStyle = 'italic';
			}
			else {
				this._label.style.fontStyle = 'normal';
			}
		},

		_SetAlignment: function(iAlignment) {
			if (this.ETextAlignments.eAlignLeft === iAlignment) {
				this._labelContainer.style.textAlign = 'left';
			} else if (this.ETextAlignments.eAlignRight === iAlignment) {
				this._labelContainer.style.textAlign = 'right';
			} else {
				this._labelContainer.style.textAlign = 'center';
			}
		},

		_SetFont: function(iFont) {
			this._label.style.fontFamily = "'" + iFont + "'";
			this._CheckValidDimension();
		},

		_SetFontSize: function(iFontSize) {
			this._label.style.fontSize = iFontSize + 'px';
			this._CheckValidDimension();
		},

		_SetTextColor: function(iTextColor) {
			this._textColor = iTextColor;
			this._label.style.color = 'rgba(' + this._textColor.r*255 + ', ' + this._textColor.g*255 + ', ' + this._textColor.b*255 + ', ' + this._textOpacity + ')';
		},
		
		_SetTextOpacity: function(iOpacity) {
			this._textOpacity = iOpacity;
			this._label.style.color = 'rgba(' + this._textColor.r*255 + ', ' + this._textColor.g*255 + ', ' + this._textColor.b*255 + ', ' + this._textOpacity + ')';
		},

		_SetShowBackground: function(iShowBg) {
			this._showBg = iShowBg;
			this._UpdateBackground();
		},

		_SetBackgroundColor: function(iBackgroundColor) {
			this._backgroundColor = iBackgroundColor;
			this._UpdateBackground();
		},

		_SetBackgroundOpacity: function(iBackgroundOpacity) {
			this._backgroundOpacity = iBackgroundOpacity;
			this._UpdateBackground();
		},

		_SetShowBorder: function(iShowBorder) {
			this._showBorder = iShowBorder;
			this._UpdateBorder();
		},

		_SetBorderColor: function(iBorderColor) {
			this._borderColor = iBorderColor;
			this._UpdateBorder();
		},

		_SetBorderOpacity: function(iBorderOpacity) {
			this._borderOpacity = iBorderOpacity;
			this._UpdateBorder();
		},

		_UpdateBackground: function() {
			if (this._showBg) {
				this._labelContainer.style.backgroundColor = 'rgba(' + this._backgroundColor.r*255 + ',' + this._backgroundColor.g*255 + ',' + this._backgroundColor.b*255 + ', ' + this._backgroundOpacity + ')';
			} else {
				this._labelContainer.style.backgroundColor = 'transparent';
			}
		},

		_UpdateBorder: function() {
			if (this._showBorder) {
				let borderColor = this._borderColor;
				this._labelContainer.style.borderColor = 'rgb(' + borderColor.r*255 + ',' + borderColor.g*255 + ',' + borderColor.b*255  + ', ' + this._borderOpacity + ')';
			}
			else {
				this._labelContainer.style.borderColor = 'transparent';
			}
		},

        _SetEnabled: function(iEnabled) {
            this._enabled = iEnabled;

			if (this._enabled) {
				this._labelContainer.style.pointerEvents = 'inherit';
				this._labelContainer.style.filter = 'none';
			}
			else {
				this._labelContainer.style.pointerEvents = 'none';
				this._labelContainer.style.filter = 'brightness(70%) grayscale(100%)';
			}
        }

	});

	return CATE3DXUIRep2DText;
});
