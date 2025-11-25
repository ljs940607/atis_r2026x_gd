/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIActorGraphicalProperties
* @implements {DS/CAT3DExpModel/interfaces/CATI3DXGraphicalProperties}
* @constructor
*
* @description
* CATI3DXGraphicalProperties implementation for CXPUIActor_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIActorGraphicalProperties',
[
	'UWA/Core',
    'UWA/Class'
],

function (UWA) {
	'use strict';

	var CATE3DXUIActorGraphicalProperties = UWA.Class.extend(
    /** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIActorGraphicalProperties.prototype **/
    {

    	init: function () {
    		this._parent();
    	},

    	GetShowMode: function () {
    	    return this.QueryInterface('CATI3DExperienceObject').GetValueByName('visible');
    	},

    	SetShowMode: function (iVisible) {
    	    this.QueryInterface('CATI3DExperienceObject').SetValueByName('visible', iVisible);
    	},

    	GetOpacity: function () {
    	    var opacity = this.QueryInterface('CATI3DExperienceObject').GetValueByName('opacity');
    	    if (undefined === opacity) { // if not defined, set opacity to 255
    	        opacity = 255;
    	    }
    	    return opacity;
    	},

    	SetOpacity: function (iOpacity) {
    	    this.QueryInterface('CATI3DExperienceObject').SetValueByName('opacity', iOpacity);
    	},

    	//not implement in C++
    	GetRed: function () {
    	},

    	GetGreen: function () {
    	},

    	GetBlue: function () {
    	},

    	SetColor: function (/*iRed, iGreen, iBlue*/) {
    	},

    	GetPickMode: function () {
    	},

    	SetPickMode: function (/*iClickable*/) {
    	}

    });

	return CATE3DXUIActorGraphicalProperties;
});

