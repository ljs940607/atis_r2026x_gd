/*global define*/
define('DS/StuRenderEngine/StuProductActorNA', ['DS/StuRenderEngine/StuProductActor'], function (StuProductActorJS) {
	'use strict';

	StuProductActorJS.prototype.buildPLMServices = function () {
        //I don't really know why the VisuServices hold the PLM infos of products
		return new StuVisuServices();
	}

	return StuProductActorJS;
});
