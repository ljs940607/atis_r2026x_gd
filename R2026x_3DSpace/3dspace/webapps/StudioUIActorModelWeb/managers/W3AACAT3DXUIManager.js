define('DS/StudioUIActorModelWeb/managers/W3AACAT3DXUIManager',
[
	'UWA/Core',
	'DS/WebApplicationBase/W3AAManager'
],
function (UWA, W3AAManager) {
	'use strict';

	var W3AACAT3DXUIManager = UWA.Class.extend(W3AAManager,
	{
		update: function () {
			let CAT3DXUIManager = this.GetObject();
			CAT3DXUIManager._update();
        }
	});
	return W3AACAT3DXUIManager;
});

