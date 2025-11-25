/**
* @name DS/StudioUIActorModelWeb/interfaces/CATICXPWebViewer
* @interface
*
* @description
* Interface to get representation of 2D Actors
*/
define('DS/StudioUIActorModelWeb/interfaces/CATICXPWebViewer',
[
	'UWA/Class',
	'DS/WebComponentModeler/CATWebInterface'
],

function (
	UWA,
	CATWebInterface) {
	'use strict';

	var CATICXPWebViewer = CATWebInterface.singleton(
    /** @lends DS/StudioUIActorModelWeb/interfaces/CATICXPWebViewer **/
	{

		interfaceName: 'CATICXPWebViewer',
	    /** @lends DS/StudioUIActorModelWeb/interfaces/CATICXPWebViewer.prototype **/
		required: {

            /**
             * @param {string} iScript - The JS script to execute 
             */
		    ExecuteScript: function (/*iScript*/) {
		    },
			
			/**
			 * Send message to webviewer (iframe)
			 * @param {string} iMessage - The message to send
			 */
			SendMessage: function(/*iMessage*/) {
			}
		},

		optional: {

		}

	});

	return CATICXPWebViewer;
});
