/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DColorPicker
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DColorPicker_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DColorPicker',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
    'css!DS/StudioUIActorModelWeb/style/CXPColorPicker.css',
	'DS/Controls/ColorChooser',
    'DS/VCXWebProperties/VCXColor'
],
function (UWA, CATE3DXUIRep2DUIActor, CXPColorPicker, WUXColorChooser, VCXColor) {
	'use strict';

	var CATE3DXUIRep2DColorPicker = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DColorPicker.prototype **/
	{

        _Fill: function(iContainer) {
            this._parent(iContainer);
            this._colorPicker = new WUXColorChooser().inject(iContainer);
            this._colorPicker.informationsVisibleFlag = false;
            this._colorPicker.colorChooserDimensions = { x: 220, y: 160 };
            
            var content = this._colorPicker.getContent();
            content.classList.add('cxpcolorpicker-container');


            let colorPickerEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetColor(colorPickerEO.GetValueByName('color'));
            this._ListenVariableChanges(colorPickerEO, 'color');

            this._SetEnabled(colorPickerEO.GetValueByName('enabled'));
            this._ListenVariableChanges(colorPickerEO, 'enabled');
        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            let colorPickerEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'color') {
                this._SetColor(colorPickerEO.GetValueByName('color'));
            } else if (iVariableName === 'enabled') {
                this._SetEnabled(colorPickerEO.GetValueByName('enabled'));
            } else {
                this._parent(iProps);
            }
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);

			var self = this;
            let colorPickerEO = this.QueryInterface('CATI3DExperienceObject');

            this._colorPicker.addEventListener('change', this._valueChanged = function () {
                if (!self._enabled) {
                    return;
                }

                let color = new VCXColor();
                color.FromHexString('#'+self._colorPicker.value);
                colorPickerEO.SetValueByName('color', color);

                iSDKObject.doUIDispatchEvent('UIValueChangeEvent');
            });

            this._colorPicker.addEventListener('mouseenter', this._mouseEnterEvent = function () {
                if (!self._enabled) {
                    return;
                }
                iSDKObject.doUIDispatchEvent('UIEnterEvent');
            });

            this._colorPicker.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
                if (!self._enabled) {
                    return;
                }
                iSDKObject.doUIDispatchEvent('UIExitEvent');
            });
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._colorPicker.removeEventListener('change', this._valueChanged);
            this._colorPicker.removeEventListener('mouseenter', this._mouseEnterEvent);
            this._colorPicker.removeEventListener('mouseleave', this._mouseLeaveEvent);
		},

        _SetColor: function(iVCXColor) {
            this._colorPicker.value = iVCXColor.GetColorHexString();
        },

        _SetEnabled: function(iEnabled) {
            this._enabled = iEnabled;
            this._colorPicker.disabled = !iEnabled;
        },

        _GetVisuMinimumDimension: function() {
            // same as win
			return {width: 211, height: 180};
		},

	});
	return CATE3DXUIRep2DColorPicker;
});
