/*global define*/
define('DS/StuRenderEngine/StuSubProductActorNA', ['DS/StuRenderEngine/StuSubProductActor'], function (StuSubProductActorJS) {
	'use strict';

	StuSubProductActorJS.prototype.buildPLMServices = function () {
        //I don't really know why the VisuServices hold the PLM infos of products
		return new StuVisuServices();
	}

	return StuSubProductActorJS;
});
