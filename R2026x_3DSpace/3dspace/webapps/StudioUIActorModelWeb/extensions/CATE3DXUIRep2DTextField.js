/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DTextField
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DTextField_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DTextField',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
    'css!DS/StudioUIActorModelWeb/style/CXPTextField.css',
	'DS/Controls/Editor'
],
function (UWA, CATE3DXUIRep2DUIActor, CXPTextFieldCSS, WUXEditor) {
	'use strict';

	var CATE3DXUIRep2DTextField = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DTextField.prototype **/
	{

        _Fill: function(iContainer) {
            this._parent(iContainer);

            this._editor = new WUXEditor().inject(iContainer);
            this._editor.elements.container.classList.add('cxptextfield-container');
            this._editor.elements.container.childNodes[0].classList.add('cxptextfield-childnode');
            this._editor.nbRows = 1;


            let textFieldEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetText(textFieldEO.GetValueByName('text'));
            this._ListenVariableChanges(textFieldEO, 'text');

            this._SetEnabled(textFieldEO.GetValueByName('enabled'));
            this._ListenVariableChanges(textFieldEO, 'enabled');
        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            let textFieldEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'text') {
                this._SetText(textFieldEO.GetValueByName('text'));
            } else if (iVariableName === 'enabled') {
                this._SetEnabled(textFieldEO.GetValueByName('enabled'));
            } else {
                this._parent(iProps);
            }
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);

			var self = this;
            let textFieldEO = this.QueryInterface('CATI3DExperienceObject');

            this._editor.addEventListener('uncommittedChange', this._valueChanged = function () {
                if (!self._enabled) {
                    return;
                }
                textFieldEO.SetValueByName('text', self._editor.valueToCommit);
                iSDKObject.doUIDispatchEvent('UIValueChangeEvent');
            });

            this._editor.addEventListener('keydown', this._returnPress = function (e) {
                if (e.keyCode === 13) {
                    if (self._enabled) {
                        iSDKObject.doUIDispatchEvent('UIReturnPressEvent');
                    }
                    e.preventDefault();
                }
            });

            this._editor.addEventListener('mouseenter', this._mouseEnterEvent = function () {
                if (!self._enabled) {
                    return;
                }
                iSDKObject.doUIDispatchEvent('UIEnterEvent');
            });

            this._editor.addEventListener('mouseleave', this._mouseLeaveEvent = function () {
                if (!self._enabled) {
                    return;
                }
                iSDKObject.doUIDispatchEvent('UIExitEvent');
            });
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._editor.removeEventListener('uncommittedChange', this._valueChanged);
            this._editor.removeEventListener('keydown', this._returnPress);
            this._editor.removeEventListener('mouseenter', this._mouseEnterEvent);
            this._editor.removeEventListener('mouseleave', this._mouseLeaveEvent);
		},

        _SetText: function(iText) {
            this._editor.value = iText;
        },

        _SetEnabled: function(iEnabled) {
            this._enabled = iEnabled;
            this._editor.disabled = !iEnabled;
        }

	});
	return CATE3DXUIRep2DTextField;
});
