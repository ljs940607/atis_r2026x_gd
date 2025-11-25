/**
* @name DS/StudioUIActorModelWeb/extensions/CATECXPUIActorModifiable
* @implements {DS/VCXWebModifiables/VCXModifiable}
* @augments DS/CAT3DExpModel/extensions/CATEModifiable
* @constructor
*
* @description
* VCXIModifiable implementation for CXP3DActor_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATECXPUIActorModifiable',
[
	'UWA/Core',
    'DS/CAT3DExpModel/extensions/CATEModifiable'
],

function (
    UWA,
    CATEModifiable
    ) {
    'use strict';

    var CATECXPUIActorModifiable = CATEModifiable.extend(
    /** @lends DS/StudioUIActorModelWeb/extensions/CATECXPUIActorModifiable.prototype **/
    {     
        _getVCXPropertyValue: function (iVariableName) {
            if (iVariableName === 'opacity') {
                var vcxValue = this._parent(iVariableName);
                vcxValue.SetValue(vcxValue.GetValue() / 255);
                return vcxValue;
            }
            return this._parent(iVariableName);
        },

        _getVariableValue: function (iPropertyName, iPropertyValue) {
            if (iPropertyName === 'opacity') {
                return this._parent(iPropertyName, iPropertyValue) * 255;
            }
            return this._parent(iPropertyName, iPropertyValue);
        }
    });

    return CATECXPUIActorModifiable;
});

