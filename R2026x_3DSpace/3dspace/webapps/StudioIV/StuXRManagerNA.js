/*global define*/
define('DS/StudioIV/StuXRManagerNA', ['DS/StudioIV/StuXRManager'], function (StuXRManagerJS) {
	'use strict';

	StuXRManagerJS.prototype.buildHMDWrapper = function () {
		return new stu__HMDWrapper();
	}

	return StuXRManagerJS;
});
