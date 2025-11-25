/**
* @name DS/StudioUIActorModelWeb/extensions/CATECXP3DWebViewer
* @implements {DS/StudioUIActorModelWeb/interfaces/CATICXPWebViewer}
* @constructor
*
* @description
* CATICXPWebViewer implementation
*/
define('DS/StudioUIActorModelWeb/extensions/CATECXP3DWebViewer',
[
	'UWA/Core',
    'UWA/Class',
],
function (UWA, Class) {
	'use strict';

	var CATECXP3DWebViewer = Class.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATECXP3DWebViewer.prototype **/
	{

        ExecuteScript: function(iScript) {
            
        },

        SendMessage: function(iMessage) {
            const pathOfIds = this.QueryInterface('CATI3DExperienceObject').GetPathOfIds().toString();
            let avpComManager = this.GetObject()._experienceBase.getManager('CAT3DXAVPComManager');
            if (avpComManager) {
                avpComManager.sendCommandToSwift('SendMessageToWebViewer', { pathOfIds: pathOfIds, message: iMessage })
            }
        }
	});
	return CATECXP3DWebViewer;
});
