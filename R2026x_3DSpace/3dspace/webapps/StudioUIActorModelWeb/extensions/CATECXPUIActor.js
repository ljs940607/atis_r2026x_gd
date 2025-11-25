/**
* @name DS/StudioUIActorModelWeb/extensions/CATECXPUIActor
* @implements {DS/StudioUIActorModelWeb/interfaces/CATICXPUIActor}
* @constructor
*
* @description
* CATICXPUIActor implementation
*/
define('DS/StudioUIActorModelWeb/extensions/CATECXPUIActor',
[
	'UWA/Core'
],

function (
	UWA
	) {
	'use strict';

	var CATECXPUIActor = UWA.Class.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATECXPUIActor.prototype **/
    {
    	SetOffset: function (iOffset) {
    		var expObject = this.QueryInterface('CATI3DExperienceObject');
    		var offset = expObject.GetValueByName('offset');
    		var offsetEo = offset.QueryInterface('CATI3DExperienceObject');
    		offsetEo.SetValueByName('x', iOffset.x);
    		offsetEo.SetValueByName('y', iOffset.y);
    	},

    	GetOffset: function () {
    		var expObject = this.QueryInterface('CATI3DExperienceObject');
    		var offset = expObject.GetValueByName('offset');
    		var offsetEO = offset.QueryInterface('CATI3DExperienceObject');
    		return {
    			x: offsetEO.GetValueByName('x'),
    			y: offsetEO.GetValueByName('y')
    		};
        },

        SetOffsetMode: function (iOffsetMode) {
            var expObject = this.QueryInterface('CATI3DExperienceObject');
            expObject.SetValueByName('offsetMode', iOffsetMode);
        },

        GetOffsetMode: function () {
            var expObject = this.QueryInterface('CATI3DExperienceObject');
            return expObject.GetValueByName('offsetMode');
        },

    	SetMinimumDimension: function (iWidth, iHeight, iMode) {
    		var expObject = this.QueryInterface('CATI3DExperienceObject');
    		var dim = expObject.GetValueByName('minimumDimension');
    		var dimEo = dim.QueryInterface('CATI3DExperienceObject');
    		dimEo.SetValueByName('width', iWidth);
    		dimEo.SetValueByName('height', iHeight);
    		if (iMode) {
    		    dimEo.SetValueByName('mode', iMode);
    		}
    	},

    	GetMinimumDimension: function () {
    		var expObject = this.QueryInterface('CATI3DExperienceObject');
    		var dim = expObject.GetValueByName('minimumDimension');
    		var dimEO = dim.QueryInterface('CATI3DExperienceObject');
    		return {
    			width: dimEO.GetValueByName('width'),
    			height: dimEO.GetValueByName('height'),
    			mode: dimEO.GetValueByName('mode')
    		};
    	},

    	GetDimension: function () {
    		var uiRep = this.QueryInterface('CATI3DXUIRep');
    		var rep = uiRep.Get();

    		return {
    			width: rep.clientWidth,
    			height: rep.clientHeight
    			//mode: dimEO.GetValueByName('mode'),
    		};
    	},

    	SetAttachment: function (iSide, iTarget) {
    		var expObject = this.QueryInterface('CATI3DExperienceObject');
    		var attachment = expObject.GetValueByName('attachment');
    		var attachmentEo = attachment.QueryInterface('CATI3DExperienceObject');
    		attachmentEo.SetValueByName('side', iSide);
    		attachmentEo.SetValueByName('target', iTarget);
    	},

    	GetAttachment: function () {
    		var expObject = this.QueryInterface('CATI3DExperienceObject');
    		var attachment = expObject.GetValueByName('attachment');
    		var attachmentEO = attachment.QueryInterface('CATI3DExperienceObject');
    		return {
    			side : attachmentEO.GetValueByName('side'),
    			target: attachmentEO.GetValueByName('target')
    		};
    	},

    	SetEnable: function (iEnable) {
    		this.QueryInterface('CATI3DExperienceObject').SetValueByName('enable', iEnable);
    	},

    	GetEnable: function () {
    	    return this.QueryInterface('CATI3DExperienceObject').GetValueByName('enable');
    	},

    	SetOpacity: function (iOpacity) {
    		this.QueryInterface('CATI3DExperienceObject').SetValueByName('opacity', iOpacity * 255);
    	},

    	GetOpacity: function () {
    	    return this.QueryInterface('CATI3DExperienceObject').GetValueByName('opacity') / 255;
    	},

    	SetVisible: function (iVisible) {
    		this.QueryInterface('CATI3DExperienceObject').SetValueByName('visible', iVisible);
    	},

    	GetVisible: function () {
    		return this.QueryInterface('CATI3DExperienceObject').GetValueByName('visible');
    	}

    });
	return CATECXPUIActor;
});
