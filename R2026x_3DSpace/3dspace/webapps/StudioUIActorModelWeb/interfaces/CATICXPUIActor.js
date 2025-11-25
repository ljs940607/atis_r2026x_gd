/**
* @name DS/StudioUIActorModelWeb/interfaces/CATICXPUIActor
* @interface
*
* @description
* Interface to manage UIActors properties
*/
define('DS/StudioUIActorModelWeb/interfaces/CATICXPUIActor',
[
    'UWA/Class',
    'DS/WebComponentModeler/CATWebInterface'
],

function (
    UWA,
    CATWebInterface) {
    'use strict';

    var CATICXPUIActor = CATWebInterface.singleton(
    {

        interfaceName: 'CATICXPUIActor',
        /** @lends DS/StudioUIActorModelWeb/interfaces/CATICXPUIActor.prototype **/
        required: {

        	/**
            * Set ui actor offset position
            * @public
            * @param {object} iOffset - offset to set
            * @param {number} iOffset.x - x
            * @param {number} iOffset.y - y
            */
            SetOffset: function (/*iOffset*/) {
            },

        	/**
            * Get  ui actor offset position
            * @public
            * @returns {object} offset
            */
        	GetOffset: function () {
        	    return undefined;
            },

            /**
            * Set ui actor offset mode
            * @public
            * @param {boolean} iOffsetMode - offset mode to set
            */
            SetOffsetMode: function (/*iOffsetMode*/) {
            },

            /**
            * Get  ui actor offset mode
            * @public
            * @returns {boolean} offsetMode
            */
            GetOffsetMode: function () {
                return undefined;
            },

        	/**
            * Set ui actor minimum dimension
            * @public
            * @param {number} iWidth - minimum width
            * @param {number} iHeight - minimum height
            */
        	SetMinimumDimension: function (/*iWidth, iHeight*/) {
        	},

        	/**
            * Get ui actor minimum dimension
            * @public
            * @returns {object} minimum dimension
            */
        	GetMinimumDimension: function () {
        	    return undefined;
        	},

        	/**
            * Get ui actor dimension
            * @public
            * @returns {object} dimension
            */
        	GetDimension: function () {
        	    return undefined;
        	},

        	/**
            * Set ui actor attachment
            * @param {number} iSide - attachment enum
            * @param {object} iTarget - target for 3D attached UIActor
            * @public
            */
        	SetAttachment: function (/*iSide, iTarget*/) {
        	},

        	/**
            * Get ui actor attachment
            * @public
            * @return {object} attachment
            */
            GetAttachment: function () {
                return undefined;
        	},

        	/**
            * Enable/Disable ui actor
            * @public
            * @param {boolean} iEnable - enable
            */
        	SetEnable: function (/*iEnable*/) {
        	},

            /**
            * Get ui actor enable
            * @public
            * @returns {boolean} enable
            */
        	GetEnable: function () {
        	    return undefined;
        	},

        	/**
            * Set ui actor opacity
            * @public
            * @param {number} iOpacity - opacity
            */
        	SetOpacity: function (/*iOpacity*/) {
        	},

            /**
            * Get ui actor opacity
            * @public
            * @returns {number} opacity
            */
        	GetOpacity: function () {
        	    return undefined;
        	},

        	/**
            * Set ui actor visibility
            * @public
            * @param {boolean} iVisible - visibility
            */
        	SetVisible: function (/*iVisible*/) {
        	},

            /**
            * Get ui actor visibility
            * @public
            * @returns {boolean} visibility
            */
        	GetVisible: function () {
        	    return undefined;
        	}
        },

        optional: {
        }
    });

    return CATICXPUIActor;
});
