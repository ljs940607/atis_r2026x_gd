/**
* @name DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep
* @interface
*
* @description
* Interface to get representation of 2D Actors
*/
define('DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep',
[
	'UWA/Class',
	'DS/WebComponentModeler/CATWebInterface'
],

function (
	UWA,
	CATWebInterface) {
	'use strict';

	var CATI3DXUIRep = CATWebInterface.singleton(
    /** @lends DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep **/
	{
	    /**
        * Enum for Attachment values.
        * @readonly
        * @enum {number}
        */
	    Attachment:{
	        ESide: {
	            eTopLeft: 0,
	            eTop: 1,
	            eTopRight: 2,
	            eLeft: 3,
	            eCenter: 4,
	            eRight: 5,
	            eBottomLeft: 6,
	            eBottom: 7,
	            eBottomRight: 8,
	            e3DActor: 9
	        }
	    },

		interfaceName: 'CATI3DXUIRep',
	    /** @lends DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep.prototype **/
		required: {

			/**
			*  Get the 2D rep of an UIActor
			* @public
			* @returns {div} the div holding the 2D representation and its children
			*/
		    Get: function () {
		        return undefined;
		    },

		    /**
            * Update 2D representation
            * @public
            */
		    Refresh: function () {
		    },

			RegisterPlayEvents: function(/*iSdkObject*/) {
			},

			ReleasePlayEvents: function() {				
			},

			SetIndex: function(/*iIndex*/){
			},

			AttachNodeToViewer: function(/*iIndex*/){
			},

			DetachNodeFromViewer: function(/*iIndex*/){
			},
		},

		optional: {

		}

	});

	return CATI3DXUIRep;
});
