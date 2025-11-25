/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DSlider
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DSlider_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DSlider',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
	'DS/Controls/Slider'
],
function (UWA, CATE3DXUIRep2DUIActor, WUXSlider) {
	'use strict';

	var CATE3DXUIRep2DSlider = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DSlider.prototype **/
	{
		/**
		* Enumeration of slider orientations
		*
        * @readonly
        * @enum {number}
		*/
		ESliderOrientation : {
			eVertical: 0,
			eHorizontal : 1
		},

		/**
		* Enumeration of slider label positions
		*
        * @readonly
        * @enum {number}
		*/
		ESliderLabelPosition : {
			eTop: 0,
			eBottom : 1,
			eRight : 2,
			eLeft : 3
		},

        _Fill: function(iContainer) {
            this._parent(iContainer);

			this._childContainer = UWA.createElement('div').inject(iContainer);
			this._childContainer.style.display = 'flex';
			this._childContainer.style.alignItems = 'stretch';
			this._childContainer.style.width = '100%';
			this._childContainer.style.height = '100%';

			this._slider = new WUXSlider().inject(this._childContainer);
			this._slider.getContent().style.flex = '1 1 auto';
			this._slider.getContent().style.display = 'flex';
			this._slider.getContent().style.alignItems = 'center';

			this._label = UWA.createElement('span').inject(this._childContainer);
			this._label.style.flex = '0 1 auto';
			this._label.style.display = 'inline-flex';
			this._label.style.alignItems = 'center';
			this._label.style.justifyContent = 'center';
			this._label.style.whiteSpace = 'pre';

			this._valueUnit = '';

			let sliderEO = this.QueryInterface('CATI3DExperienceObject');

			this._SetValue(sliderEO.GetValueByName('value'));
			this._ListenVariableChanges(sliderEO, 'value');

			this._SetMinimumValue(sliderEO.GetValueByName('minimumValue'));
			this._ListenVariableChanges(sliderEO, 'minimumValue');

			this._SetMaximumValue(sliderEO.GetValueByName('maximumValue'));
			this._ListenVariableChanges(sliderEO, 'maximumValue');

			this._SetStepValue(sliderEO.GetValueByName('stepValue'));
			this._ListenVariableChanges(sliderEO, 'stepValue');

			this._SetOrientation(sliderEO.GetValueByName('orientation'));
			this._ListenVariableChanges(sliderEO, 'orientation');

			this._SetShowValueLabel(sliderEO.GetValueByName('showValueLabel'));
			this._ListenVariableChanges(sliderEO, 'showValueLabel');

			this._SelLabelPosition(sliderEO.GetValueByName('labelPosition'));
			this._ListenVariableChanges(sliderEO, 'labelPosition');

			this._SetValueUnit(sliderEO.GetValueByName('valueUnit'));
			this._ListenVariableChanges(sliderEO, 'valueUnit');

			this._SetEnabled(sliderEO.GetValueByName('enabled'));
            this._ListenVariableChanges(sliderEO, 'enabled');

        },

        _UpdateProperty: function(iProps) {
			let iVariableName = iProps[0];
			let sliderEO = this.QueryInterface('CATI3DExperienceObject');
			
            if (iVariableName === 'value') {
				this._SetValue(sliderEO.GetValueByName('value'));
			} else if (iVariableName === 'minimumValue') {
				this._SetMinimumValue(sliderEO.GetValueByName('minimumValue'));
			} else if (iVariableName === 'maximumValue') {
				this._SetMaximumValue(sliderEO.GetValueByName('maximumValue'));
			} else if (iVariableName === 'stepValue') {
				this._SetStepValue(sliderEO.GetValueByName('stepValue'));
			} else if (iVariableName === 'orientation') {
				this._SetOrientation(sliderEO.GetValueByName('orientation'));
			} else if (iVariableName === 'showValueLabel') {
				this._SetShowValueLabel(sliderEO.GetValueByName('showValueLabel'));
			} else if (iVariableName === 'labelPosition') {
				this._SelLabelPosition(sliderEO.GetValueByName('labelPosition'));
			} else if (iVariableName === 'valueUnit') {
				this._SetValueUnit(sliderEO.GetValueByName('valueUnit'));
            } else if (iVariableName === 'enabled') {
                this._SetEnabled(sliderEO.GetValueByName('enabled'));
			} else {
				this._parent(iProps);
			}
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);

			var self = this;
			this._slider.addEventListener('change', this._sliderValueChanged = function () {
				if (!self._enabled) {
                    return;
                }
				let sliderEO = self.QueryInterface('CATI3DExperienceObject');
				sliderEO.SetValueByName('value', self._slider.value);
				iSDKObject.doUIDispatchEvent('UIValueChangeEvent');

			});

			this._slider.addEventListener('beginEdit', this._beginEditChanged = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIDragStartEvent');
			});

			this._slider.addEventListener('endEdit', this._endEditChanged = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIDragEndEvent');
			});

			this._slider.addEventListener('mouseenter', this._mouseEnterEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIEnterEvent');
			});

			this._slider.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
				if (!self._enabled) {
                    return;
                }
				iSDKObject.doUIDispatchEvent('UIExitEvent');
			});
		},

		ReleasePlayEvents: function() {
			this._parent();

			this._slider.removeEventListener('change', this._sliderValueChanged);
			this._slider.removeEventListener('beginEdit', this._beginEditChanged);
			this._slider.removeEventListener('endEdit', this._endEditChanged);
			this._slider.removeEventListener('mouseenter', this._mouseEnterEvent);
			this._slider.removeEventListener('mouseleave', this._mouseLeaveEvent);
		},

		_SetValue: function(iValue) {
			this._slider.value = iValue;
			this._UpdateLabelWithCache();
		},

		_UpdateLabelWithCache : function() {
			this._label.textContent = this._slider.value + " " + this._valueUnit;
		},

		_SetMinimumValue : function(iMinValue) {
			this._slider.minValue = iMinValue;
		},

		_SetMaximumValue : function(iMaxValue) {
			this._slider.maxValue = iMaxValue;
		},

		_SetStepValue : function(iStepValue) {
			this._slider.stepValue = iStepValue;
		},

		_SetOrientation: function(iOrientation) {
			if (iOrientation === this.ESliderOrientation.eVertical) {
				this._slider.displayStyle = 'vertical';
			} else {
				this._slider.displayStyle = 'horizontal';
			}
		},

		_SetShowValueLabel: function(iShowValueLabel) {
			if (iShowValueLabel) {
				this._label.style.display = 'inline-flex';
			} else {
				this._label.style.display = 'none';
			}
		},

		_SelLabelPosition: function(iLabelPosition) {
			if (iLabelPosition === this.ESliderLabelPosition.eTop 
			|| iLabelPosition === this.ESliderLabelPosition.eLeft) 
			{
				this._label.style.order = '0';
				this._slider.getContent().style.order = '1';
			} else {
				this._label.style.order = '1';
				this._slider.getContent().style.order = '0';
			}

			if (iLabelPosition === this.ESliderLabelPosition.eTop
				|| iLabelPosition === this.ESliderLabelPosition.eBottom) 
			{
				this._childContainer.style.flexDirection = 'column';
			} else {
				this._childContainer.style.flexDirection = 'row';
			}
		},

		_SetEnabled: function(iEnabled) {
			this._enabled = iEnabled;
            this._slider.disabled = !iEnabled;
        },

		_SetValueUnit: function(iUnit) {
			this._valueUnit = iUnit;
			this._UpdateLabelWithCache();
		}

	});
	return CATE3DXUIRep2DSlider;
});
