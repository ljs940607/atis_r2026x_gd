define('DS/StuModel/StuVariantsManagerNA', ['DS/StuModel/StuVariantsManager'], function (StuVariantsManagerJS) {
	'use strict';

	StuVariantsManagerJS.get = function () {
		return new StuVariantsManager();
	};
});
